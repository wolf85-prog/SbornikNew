import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Ionicons } from '@expo/vector-icons';
import Card from '../../../../components/ui/Card';
import PopupMenu from "../../../../components/ui/PopupMenu.js";
//import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import {
  Provider,
} from "react-native-paper";

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
        headerLeft: (() => <DrawerToggleButton />),
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
  //const db = useSQLiteContext();

  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('')
  const [data, setData] = useState([])
  const [songs, setSongs] = useState([])
  const [error, setError] = useState(null)
  const [fullData, setFullData] = useState([])
  const [textInputValue, setTextInputValue] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query)
    const formattedQuery = query.toLowerCase()
    const filteredData = filter(fullData, (user)=> {
      return contains(user, formattedQuery)
    })
    setData(filteredData)
  }
  
  const contains = ({name, email}, query) => {
    if (name.includes(query) || email.includes(query)) {
      return true
    }
  
    return false
  }

  useEffect(() => {
    setIsLoading(true);
    const fetch = (async()=> {

      // await db.withTransactionAsync(async () => {
      //   const allRows = await db.getAllAsync('SELECT * FROM songs');
      //   const songs = allRows.map((row) => ({
      //     uid: row._id,
      //     name: row.name,
      //     number: row.number,
      //   }));

      //   const sortedSongs = [...songs].sort((a, b) => {       
      //     var songA = a.name, songB = b.name
      //     return (songA < songB) ? -1 : (songA > songB) ? 1 : 0;  //сортировка по возрастанию 
      //   })
    
      //   setSongs(sortedSongs);

      //   setIsLoading(false);
      // });

      const sortedSongs = [...songsData].sort((a, b) => {       
          var songA = a.name, songB = b.name
          return (songA < songB) ? -1 : (songA > songB) ? 1 : 0;  //сортировка по возрастанию 
      })
    
      //setSongs(sortedSongs);

      setData(sortedSongs)
      setFullData(sortedSongs)
      setIsLoading(false);
      
    })

    fetch()
  }, []);
  
  function Item({ item }) {
    return (
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
  }

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
        clearButtonMode='always' 
        style={styles.searchBox}
        autoCapitalize="none"
        value={searchQuery}
        onChangeText={(query)=> handleSearch(query)}
      />

      <FlatList
        style={styles.listSongs}
        data={data}
        renderItem={({ item }) => <Item item={item}/>}
        keyExtractor={item => item.number}
        // ItemSeparatorComponent={() => <View style={{height: 15}} />}
        contentContainerStyle={{ gap: 15 }}
        // columnWrapperStyle={{ gap: GAP_BETWEEN_COLUMNS }}
      />       
    </SafeAreaView>
  );
}

