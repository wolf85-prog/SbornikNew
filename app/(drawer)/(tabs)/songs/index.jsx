import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState, useMemo } from 'react'
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Ionicons } from '@expo/vector-icons';
import Card from '../../../../components/ui/Card';
import PopupMenu from "../../../../components/ui/PopupMenu.js";
import { useSQLiteContext } from "expo-sqlite";
import * as SQLite from 'expo-sqlite';
import {
  Surface,
  Appbar, 
  Menu, 
  Tooltip 
} from "react-native-paper";

import {
  Locales,
  TabsHeader,
  styles
} from '@/lib'

import filter from "lodash.filter"

import songsData from './../../../../data/songsData.js';

const SongsScreen = () => {

  const [visible, setVisible] = useState(false) 

  const router = useRouter();

  const options = [
    {
      title: "Настройки",
      action: ()=>router.push("/settings")
    },
  ]
  
  const headerRight = () => {
    return (
      // <PopupMenu options={options} color={"white"} />
      <>
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
                                <Tooltip title={Locales.t('options')}>
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
        title: Locales.t('songs'),
        // headerLeft: (() => <DrawerToggleButton tintColor={'#000'} />) 
        headerRight: headerRight,
        headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />),
        headerStyle: {backgroundColor: '#26489a'},    
        headerTintColor: 'white',
        //headerTitleStyle: {fontWeight: 400},
        header: (props) => <TabsHeader navProps={props} children={undefined} />,
        }} 
      />
        <Content />
    </Surface>
  )
}

export default SongsScreen

export function Content() {
  const db = useSQLiteContext();

  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('')
  const [data, setData] = useState([])
  const [songs, setSongs] = useState([])
  const [error, setError] = useState(null)
  const [fullData, setFullData] = useState([])
  const [textInputValue, setTextInputValue] = useState("");


  useEffect(() => {
    setIsLoading(true);
    const fetch = (async()=> {
      try {
        const my_db = await SQLite.openDatabaseAsync('myLocalDatabase2', 	{
            useNewConnection: true
        });

        await my_db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS songs (id INTEGER PRIMARY KEY NOT NULL, 
          uid TEXT, 
          favorite INTEGER NOT NULL, 
          font TEXT NOT NULL, 
          name TEXT NOT NULL,
          number INTEGER NOT NULL,
          song TEXT NOT NULL,
          song2 TEXT NOT NULL,
          song_accord INTEGER NOT NULL,
          song_temp TEXT,
          song_ton TEXT NOT NULL);
        `);

        let allRows
        allRows = await my_db.getAllAsync('SELECT * FROM songs');
        if (allRows.length === 0) {
          songsData.map(async(item)=> {
            await my_db.runAsync('INSERT INTO songs (favorite, font, name, number, song, song2, song_accord, song_temp, song_ton) VALUES (?,?,?,?,?,?,?,?,?)', 
              item.favorite, 
              item.font, 
              item.name, 
              item.number, 
              item.song, 
              item.song2,
              item.song_accord, 
              item.song_temp, 
              item.song_ton
            );
          })

          allRows = await my_db.getAllAsync('SELECT * FROM songs');
          console.log(allRows.length);
        } else {
          console.log(allRows.length);
        } 

        const sortedSongs = [...allRows].sort((a, b) => {       
          var songA = a.name, songB = b.name
          return (songA < songB) ? -1 : (songA > songB) ? 1 : 0;  //сортировка по возрастанию 
        })

        setData(sortedSongs)
        setFullData(sortedSongs)

        setIsLoading(false);

      } catch (error) {
          setError(error)
          console.log(error)
      }  

    })

    fetch()
  }, []);



  const handleSearch = (query) => {
    setSearchQuery(query)
    const formattedQuery = query.toLowerCase()
    const filteredData = filter(fullData, (user)=> {
      return contains(user, formattedQuery)
    })
    setData(filteredData)
  }
  
  const contains = ({name, number}, query) => {

    if (name.toLowerCase().includes(query) || number.toString().includes(query)) {
      return true
    }

    return false
  }


  const renderItem = useMemo(()=> {
    return ({ item }) => (
      <Card style={styles.back}>
        <TouchableOpacity onPress={()=> {router.push(`/songs/song/${item.number}`)}} >
          <View style={styles.card}>
            
            <View style={styles.main_content}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>Без категории</Text>     
            </View>

            <View style={styles.right_section}>
              <View style={styles.number}>
                <Text style={styles.numberText}>{item.number}</Text>
              </View>  
              <Ionicons name="star-outline" size={24} color="#feed33" />
            </View>
          </View>
          
        </TouchableOpacity >
      </Card> 
      );
    }, [data]);
  

  if (isLoading) {
    return (
      <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size={"large"} color="#5500dc"/>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TextInput 
        placeholder="Поиск..." 
        placeholderTextColor="#f3f3f3"
        clearButtonMode='always' 
        style={styles.searchBox}
        autoCapitalize="none"
        value={searchQuery}
        onChangeText={(query)=> handleSearch(query)}
      />

      <FlatList
        style={styles.listSongs}
        data={data}
        renderItem={renderItem}
        removeClippedSubviews={true}
        keyExtractor={item => item.number}
        // ItemSeparatorComponent={() => <View style={{height: 15}} />}
        contentContainerStyle={{ gap: 15 }}
        // columnWrapperStyle={{ gap: GAP_BETWEEN_COLUMNS }}
      />       
    </SafeAreaView>
  );
}

