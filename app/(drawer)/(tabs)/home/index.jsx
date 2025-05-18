import { SafeAreaView, StatusBar, Text, View, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import Card from '../../../../components/ui/Card';
import { Stack, useRouter } from 'expo-router';
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from "expo-sqlite";
import React, { useContext, useState, useEffect, useMemo } from 'react'

import {
  Surface,
  Appbar, 
  Menu, 
  Tooltip,
  Snackbar, Searchbar
} from "react-native-paper";
import {
  Locales,
  TabBar, TabsHeader,
  styles, 
} from '@/lib'

import filter from "lodash.filter"

import songsData from './../../../../data/songsData.js';

export default function TabsHome() {
  const [showSearch, setShowSearch] = useState(false);
  const [visible, setVisible] = React.useState(false) 
  const router = useRouter();

  return (
    <Surface style={styles.screen}>
      <Stack.Screen options={{ 
        headerShown: true, 
        title: Locales.t('titleHome'), 
        headerRight: () => (
                    <>
                      <Tooltip title={Locales.t('search')} >
                        <Appbar.Action
                          icon={showSearch ? "close" : "magnify"}
                          onPress={() => setShowSearch(!showSearch)}
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
                  ),
        headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />),
        headerStyle: {backgroundColor: '#26489a'},    
        headerTintColor: 'white',
        //headerTitleStyle: {fontWeight: 400},
        header: (props) => <TabsHeader navProps={props} children={undefined} />,
        }}
      />
      
      <Content showSearch={showSearch}/>
      
    </Surface>
  );
}

//---------------------------------------------------------------------------------

export function Content(showSearch) {
  const db = useSQLiteContext();

  console.log("showSearch: ", showSearch.showSearch)

  const router = useRouter();

  //const {songs, setSongs} = useUserContext()
  let arr = []

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [fullData, setFullData] = useState([])
  const [textInputValue, setTextInputValue] = useState("");
  const [favorite, setFavorite] = useState([])
  const [numSong, setNumSong] = useState("");
  
  const [visible, setVisible] = useState(false);

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);


  useEffect(() => {
    setIsLoading(true);

    const fetch = (async()=> {
      try {
        const my_db4 = await SQLite.openDatabaseAsync('myLocalDatabase4', 	{
            useNewConnection: true
        });

        const allRows2 = await my_db4.getAllAsync('SELECT * FROM songs');
        console.log("Кол-во песен: ", allRows2.length);
          
        setData(allRows2)
        setFullData(allRows2)

        setIsLoading(false);

      } catch (error) {
          setError(error)
          console.log(error)
      }  

    })

    fetch()
  }, []);

  useEffect(() => {
    //console.log("favorite: ", favorite)
  },[favorite])

  const pressStar = (item, fav) => {
    onToggleSnackBar()
    setNumSong(item.number)
    console.log("press: ", item.number)

    setData((data) => {
      let userIndex = data.findIndex((item2) => item2.number === item.id);
      const usersCopy = JSON.parse(JSON.stringify(data));

      const userObject = usersCopy[userIndex];
			usersCopy[userIndex] = { ...userObject, ['favorite']: fav === 1 ? 0 : 1};

      return usersCopy;
    });

    // const editSong = data.map((song) => {
    //   if (song.id !== item.id) {
    //     return song;
    //   }

    //   const updatedSong = {
    //     favorite: 1,
    //   }
    //   return updatedSong;
    // });

    // setData(editSong);

    //favorite[item.number-1] = !fav
    //console.log(favorite)
    //favorite.push(arr)
    //setFavorite(favorite)
  }
  
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
        <TouchableOpacity onPress={()=> {router.push(`/home/song/${item.number}`)}} >
          <View style={styles.card}>
            <View style={styles.number}>
              <Text style={styles.numberText}>{item.number}</Text>
            </View>   
            
            <View style={styles.main_content}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>Без категории</Text>     
            </View>

            <View style={styles.right_section}>
              <Ionicons onPress={()=> pressStar(item, item.favorite)} name={item.favorite === 1 ? "star" : "star-outline"} size={24} color="#feed33" />
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


  // Search logic
  // useEffect(() => {
  //   if (searchQuery !== '') {
  //     setLoading(true)
  //   }

  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 1000)
  // }, [searchQuery])
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        animated={true}
        backgroundColor = '#060606' //'#26489a'
        //barStyle={statusBarStyle}
        //showHideTransition={statusBarTransition}
        //hidden={hidden}
      />
      <Searchbar
        value={searchQuery}
        loading={loading}
        onChangeText={(v) => handleSearch(v)}
        placeholder="Введите номер или название песни"
        style={{ display: showSearch.showSearch ? 'block' :'none', marginTop: 16, marginHorizontal: 16 }}
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


      <Snackbar
        visible={visible}
        duration={1000}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Отмена',
          onPress: () => {
            // Do something
          },
        }}>
        <Text>Песня №{numSong} добавлена в избранное!</Text>
      </Snackbar>
            
    </SafeAreaView>
  );
}
