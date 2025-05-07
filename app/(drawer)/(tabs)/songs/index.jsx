import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react'
import { useEffect, useState } from "react";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Ionicons } from '@expo/vector-icons';
import Card from '../../../../components/ui/Card';
import PopupMenu from "../../../../components/ui/PopupMenu.js";
//import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import {
  Provider,
} from "react-native-paper";

import filter from "lodash.filter"

import songsData from './../../../../data/songsData.js';

const SongsScreen = () => {

  const router = useRouter();

  const options = [
    {
      title: "Настройки",
      action: ()=>router.push("/settings")
    },
  ]
  
  const headerRight = () => {
    return (
      <PopupMenu options={options} color={"white"} />
    );
  };

  return (

    <View style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: false, 
        title: "Песни", 
        // headerLeft: (() => <DrawerToggleButton tintColor={'#000'} />) 
        headerRight: headerRight,
        headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />),
        headerStyle: {backgroundColor: '#26489a'},    
        headerTintColor: 'white',
                //headerTitleStyle: {fontWeight: 400},
        }} 
      />
      <Provider>
        {/* <SQLiteProvider databaseName="sbornik.db" assetSource={{ assetId: require('./../../../../assets/sbornik.db') }}> */}
          <Content />
        {/* </SQLiteProvider> */}
      </Provider>
    </View>
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
      <Card>
        <TouchableOpacity onPress={()=> {router.push(`/songs/song/${item.number}`)}} >
          <View style={styles.flex}>
            
            <View style={styles.main_content}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>Без категории</Text>     
            </View>

            <View style={styles.right_section}>
              <View style={styles.number}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f3f3',
        width: '100%',
      },

      listSongs:{
        padding: 15,
        flex: 1,
      },

      card: {
        height: 65,
        backgroundColor: '#0005',
        padding: 8,
        paddingHorizontal: 15,
        marginTop: 10,
        borderRadius: 6,
        borderColor: '#000'
      },
      number: {
        width: 40,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },

      flex: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        height: 58,
      },

      main_content: {
        width: '70%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      },

      name: {
        color: '#000',
        fontSize: 16, 
        fontFamily: 'SpaceMono',
      },

      category: {
        color: '#e5e5e5',
        fontFamily: 'SpaceMono'
      },

      right_section: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        gap: 10,
      },

      searchBox: {
        height: 46,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
      }
})