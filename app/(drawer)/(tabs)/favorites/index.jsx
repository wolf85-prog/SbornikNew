import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react'
import { useEffect, useState } from "react";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Ionicons, MaterialIcons, Entypo, AntDesign } from '@expo/vector-icons';
import Card from '../../../../components/ui/Card';
import PopupMenu from "./../../../../components/ui/PopupMenu.js";
//import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import * as SQLite from 'expo-sqlite';
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
          headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />),
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
        let arr = []
        songsData.map((item, index)=> {
          if (item.favorite === 1) {
            
            arr.push(item)
            //console.log(arr)
          }
          
          setSongs(arr)
        })
      })
  
      fetch()

      setTimeout(()=> {
        setIsLoading(false);
      }, 2000)
      
    }, [songsData]);

    useEffect(() => {
      //console.log("songs: ", songs)
    }, [songs])
    
    function Item({ item }) {
      return (
        <Card style={styles.back}>
          <TouchableOpacity onPress={()=> {router.push(`/favorites/song/${item.number}`)}} >
            <View style={styles.card}>
              
              <View style={styles.number}>
                <Text style={styles.numberText}>{item.number}</Text>
              </View>   
                          
              <View style={styles.main_content}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.category}>Без категории</Text>     
              </View>
  
              <View style={styles.right_section}>  
                <Ionicons name="close-sharp"onPress={() => console.log("Удаление...")} size={24} color='white' />
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
            contentContainerStyle={{  flexGrow: 1,  gap: 15 }}
            // columnWrapperStyle={{ gap: GAP_BETWEEN_COLUMNS }}
            ListEmptyComponent={EmptyListMessage}
          />       
    </SafeAreaView>
  );
}
