import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react'
import { useEffect, useState } from "react";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Ionicons, FontAwesome, Entypo, AntDesign } from '@expo/vector-icons';
import Card from '../../../../components/ui/Card';
import PopupMenu from "./../../../../components/ui/PopupMenu.js";
//import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";

import { Surface, Dialog, Tooltip, Appbar, Menu, Button } from 'react-native-paper'

import { Locales, ScreenInfo, styles, TabsHeader } from '@/lib'

import songsData from './../../../../data/songsData.js';

import filter from "lodash.filter"
const Favorites = () => {

  const router = useRouter();

  const [visible, setVisible] = useState(false) 
  const [visibleSongs, setVisibleSongs] = useState(false);

  const hideDialog = () => setVisibleSongs(false);

  const data = [
      {
        title: "Настройки",
        action: ()=>router.push("/settings")
      },
  ]
  
  const headerRight = () => {
    return (
      <>

        {/* <PopupMenu options={data} color={"white"}/> */}
        <Tooltip title={Locales.t('search')}>
                          <Appbar.Action
                            icon="delete"
                            onPress={()=>setVisibleSongs(true)}
                          />
        </Tooltip>
        <Tooltip title={Locales.t('search')}>
                          <Appbar.Action
                            icon="magnify"
                            onPress={() => router.push('/search')}
                          />
        </Tooltip>
        
        <Menu
          statusBarHeight={48}
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Tooltip title={Locales.t('options')} >
              <Appbar.Action
                icon="dots-vertical"
                onPress={() => setVisible(true)}
              />
            </Tooltip>
          }  
        >
                              <Menu.Item
                                title={Locales.t('titleSettings')}
                                leadingIcon="cog"
                                onPress={() => router.push('/settings')}
                              />
          </Menu>
      </>
        
    );
  };

  return (
  
      <Surface style={styles.screen}>
        {/* Header */}
        <Stack.Screen options={{ 
          headerShown: true, 
          title: Locales.t("titleFavorites"), 
          headerRight: headerRight,
          headerLeft: (() => <DrawerToggleButton />),
          headerStyle: {backgroundColor: '#26489a'},    
          headerTintColor: 'white',
          header: (props) => <TabsHeader navProps={props} children={undefined} />,
        }} />
          
          <Content />

          <Dialog visible={visibleSongs} onDismiss={hideDialog}>
                    <Dialog.Title>Удаление</Dialog.Title>
                    <Dialog.Content>
                      <Text>Вы хотите очистить список избранного?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button onPress={() => setVisibleSongs(false)}>Отмена</Button>
                      <Button onPress={() => setVisibleSongs(false)}>ОК</Button>
                    </Dialog.Actions>
          </Dialog>

      </Surface>
  )
}

export default Favorites

export function Content() {
    //const db = useSQLiteContext();
  
    const router = useRouter();
    
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([])
    const [songs, setSongs] = useState([])
    const [error, setError] = useState(null)
    const [fullData, setFullData] = useState([])
    const [textInputValue, setTextInputValue] = useState("");
  

  useEffect(() => {
      setIsLoading(true);
      const fetch = (async()=> {
  
        // await db.withTransactionAsync(async () => {
        //   const allRows = await db.getAllAsync('SELECT * FROM notes');
        //   const notes = allRows.map((row) => ({
        //     uid: row._id,
        //     name: row.note,
        //   }));
  
        //   const sortedSongs = [...notes].sort((a, b) => {       
        //     var songA = a.name, songB = b.name
        //     return (songA < songB) ? -1 : (songA > songB) ? 1 : 0;  //сортировка по возрастанию 
        //   })
      
        //   setNotes(sortedSongs);
  
        //   setIsLoading(false);
        // });

        songsData.map((item, index)=> {
          if (index === 0) {
            let arr = []
            arr.push(item)
          }
          setSongs(arr)
        })
      })
  
      fetch()
      setIsLoading(false);
    }, []);

    useEffect(() => {
      console.log("songs: ", songs)
    }, [songs])
    
    function Item({ item }) {
      return (
        <Card>
          <TouchableOpacity onPress={()=> {router.push(`/songs/song/${item.number}`)}} >
            <View style={styles.card}>
              
              <View style={styles.main_content}>
                <Text style={styles.name}>{item.name}</Text>
                {/* <Text style={styles.category}>{item.email}</Text>      */}
              </View>
  
              <View style={styles.right_section}>  
                {/* <Ionicons name="star-outline" size={24} color="#feed33" /> */}
              </View>
            </View>
            
          </TouchableOpacity >
        </Card>
        
      );
    }

    const EmptyListMessage = ({item}) => {
      return (
        // Flat List Item
        <View style={styles.containerList}>
          <AntDesign name="heart" size={72} color="#7f8c8d" style={{textAlign: 'center'}}/>
          <Text style={styles.emptyListTitle}>
                Список избранного пуст
          </Text>
          <Text style={styles.emptyList}>
                Понравившиеся песни отобразятся здесь
          </Text>
        </View>  
      );
    };

  if (isLoading) {
      return (
        <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator size={"large"} color="#5500dc"/>
        </View>
      );
  }

  return (
    <SafeAreaView style={{flex:1}}>  
      <FlatList
            style={styles.listSongs}
            data={songs}
            renderItem={({ item }) => <Item item={item}/>}
            keyExtractor={item => item.number}
            // ItemSeparatorComponent={() => <View style={{height: 15}} />}
            contentContainerStyle={{  flexGrow: 1, justifyContent: "center", alignItems: "center", gap: 15 }}
            // columnWrapperStyle={{ gap: GAP_BETWEEN_COLUMNS }}
            ListEmptyComponent={EmptyListMessage}
          />       
    </SafeAreaView>
  );
}



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     //backgroundColor: '#f3f3f3',
//     width: '100%',
//   },

//   containerList: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#d6d5d5',
//     width: '100%',
//     margin: 0
//   },

//   emptyListTitle: {
//     color: '#7f8c8d',
//     textAlign: 'center',
//     fontSize: 22,
//   },

//   emptyList: {
//     color: '#b2babb',
//     textAlign: 'center',
//     fontSize: 16,
//   },

//   listSongs:{
//     padding: 0,
//   },

//   card: {
//     height: 65,
//     backgroundColor: '#0005',
//     padding: 8,
//     paddingHorizontal: 15,
//     marginTop: 10,
//     borderRadius: 6,
//     borderColor: '#000'
//   },
//   number: {
//     width: 40,
//     height: 40,
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   flex: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flex: 1,
//     flexDirection: 'row',
//     height: 55,
//   },

//   main_content: {
//     width: '70%'
//   },

//   name: {
//     color: '#000',
//     fontSize: 16, 
//     fontFamily: 'SpaceMono',
//   },

//   category: {
//     color: '#e5e5e5',
//     fontFamily: 'SpaceMono'
//   },

//   right_section: {
//     display: 'flex',
//     justifyContent: 'end',
//     alignItems: 'center',
//     flex: 1,
//     flexDirection: 'row'
//   },

//   searchBox: {
//     height: 46,
//     marginLeft: 15,
//     marginRight: 15,
//     marginTop: 15,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 8,
//   }
// })