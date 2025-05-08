import React, { useContext } from 'react'
import { DrawerToggleButton } from "@react-navigation/drawer";
//import { ThemeContext } from '@/context/ThemeContext';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { Ionicons, FontAwesome, AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
//import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import Card from '../../../components/ui/Card';

import { 
  Surface, 
  Appbar, 
  Menu, 
  Tooltip,
  FAB} from "react-native-paper";

import { Locales, ScreenInfo, styles, TabsHeader } from '@/lib'

//import filter from "lodash.filter"


const CategoriesScreen = () => {

  const router = useRouter();

  const [visible, setVisible] = useState(false)
  const [visiblePlaylist, setVisiblePlaylist] = useState(false);

  //const {currentTheme, toggleTheme} = useContext(ThemeContext)

  const headerRight = () => {
      return (
        <>
          {/* <TouchableOpacity
            // onPress={()=>router.push("/modal")}
            onPress={()=>setVisibleFontSize(true)}
            style={{marginRight: 20}}
          >
            <AntDesign name="search1" size={22} color="white" />
          </TouchableOpacity> */}
  
          <TouchableOpacity
            // onPress={()=>router.push("/modal")}
            onPress={()=>setVisiblePlaylist(true)}
            style={{marginRight: 15}}
          >
            <AntDesign name="delete" size={18} color="white" />
          </TouchableOpacity>
  
          {/* <PopupMenu options={data} color={"white"}/> */}
          <Tooltip title={Locales.t('search')} color={"white"}>
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
                                  <Tooltip title={Locales.t('options')} color={"white"}>
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
      <Stack.Screen options={{ 
        headerShown: true, 
        title: "Категории песен", 
        headerLeft: (() => <DrawerToggleButton  />), 
        headerRight: headerRight,
        headerStyle: {backgroundColor: '#26489a'},  
        headerTintColor: 'white',
        header: (props) => <TabsHeader navProps={props} children={undefined} />,
        }} />

        <Content />
    </Surface>
  )
}

export default CategoriesScreen

export function Content() {
  //const db = useSQLiteContext();

  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([])
  const [notes, setNotes] = useState([])
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
    })

    fetch()
    setIsLoading(false);
  }, []);
  
  function Item({ item }: any) {
    return (
      <Card>
        <TouchableOpacity onPress={()=> {router.push(`/songs/song/${item.number}`)}} >
          <View>
            
            <View>
              <Text>{item.name}</Text>
              {/* <Text style={styles.category}>{item.email}</Text>      */}
            </View>

            <View>
              <View>
                <Text>{item.number}</Text>
              </View>  
              <Ionicons name="star-outline" size={24} color="#feed33" />
            </View>
          </View>
          
        </TouchableOpacity >
      </Card>
      
    );
  }

  if (isLoading) {
    return (
      <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size={"large"} color="#5500dc"/>
      </View>
    );
  }

  const onButtonAdd = ()=> {
    console.log("press add category")
    //showDialog()
    
  }

  return (
    <SafeAreaView style={{flex:1}}>

      <FlatList
        //style={styles.listSongs}
        data={notes}
        renderItem={({ item }) => <Item item={item}/>}
        //keyExtractor={item => item.number}
        // ItemSeparatorComponent={() => <View style={{height: 15}} />}
        contentContainerStyle={{  flexGrow: 1, justifyContent: "center", alignItems: "center", gap: 15 }}
        // columnWrapperStyle={{ gap: GAP_BETWEEN_COLUMNS }}
        ListEmptyComponent={() =>
          <Text>
            Список категорий пуст
          </Text>
        }
      /> 

      {/* Кнопка Добавить */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={onButtonAdd}
      />      
    </SafeAreaView>
  );
}
