import { SafeAreaView, Text, View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Stack, useRouter } from 'expo-router';
import React from 'react'
import { useEffect, useState, useMemo } from "react";
import Card from '../../../../../components/ui/Card';
import {Provider, Surface} from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { Ionicons } from '@expo/vector-icons';
//import filter from "lodash.filter"
import * as SQLite from 'expo-sqlite';

import {
  Locales,
  TabBar, TabsHeader,
  styles, 
} from '@/lib'
import { COLORS } from '@/constants';

export default function PlaylistIdScreen() {

  const db = useSQLiteContext();
  const DBNAME = 'myLocalDatabase2'

  const [title, setTitle] = useState('');
  const { id } = useLocalSearchParams(); 
  
  useEffect(() => {
    console.log("id playlist: ", id)
      
  }, [id])

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([])
  const [accords, setAccords] = useState([])
  const [error, setError] = useState(null)
  const [fullData, setFullData] = useState([])

  useEffect(() => {
    setIsLoading(true);
    const fetch = (async()=> {

      setTitle(id)

      try {
        const local_db = await SQLite.openDatabaseAsync(DBNAME);

        await local_db.withTransactionAsync(async () => {
            const allRows = await local_db.getAllAsync('SELECT * FROM playlists');
            console.log("allRows: ", allRows)
            const playlist = allRows.map((row) => ({
                id: row._id,
                //uid: row._id,
                name: row.nameList,
            }));

            const sortedSongs = [...playlist].sort((a, b) => {       
                var songA = a.name, songB = b.name
                return (songA < songB) ? -1 : (songA > songB) ? 1 : 0;  //сортировка по возрастанию 
            })
        
            setPlaylists(sortedSongs);

            //setIsLoading(false);
            });

      } catch (error) {
        console.log(error.message)
        setIsLoading(false);
      }

    })

    fetch()

  }, []);

  if (isLoading) {
    return (
      <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size={"large"} color="#5500dc"/>
      </View>
    );
  }
  

const renderItem = useMemo(()=> {
  return ({ item }) => (
      <Card style={styles.back}>
        <TouchableOpacity onPress={()=> {router.push(`/playlist/list/song/${item.number}`)}} >
          <View style={styles.card}>
            <View style={styles.number}>
              <Text style={styles.numberText}>{item.number}</Text>
            </View>   
            
            <View style={styles.main_content}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>Без категории</Text>     
            </View>

            <View style={styles.right_section}>
              {/* <Ionicons onPress={()=> pressStar(item, item.favorite)} name={item.favorite === 1 ? "star" : "star-outline"} size={24} color="#feed33" /> */}
            </View>
          </View>
          
        </TouchableOpacity >
      </Card>  
    );
  }, [data]);



  return (
    <Surface style={styles.screen} >
      <Stack.Screen options={{ 
        headerShown: true, 
        title: title, 
        //headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />),
        headerStyle: {backgroundColor: '#19181c'}, 
        headerTintColor: 'white',
        //header: (props) => <TabsHeader navProps={props} children={undefined} />,
      }} />

      <Provider>
        <SafeAreaView style={{ flex: 1 }}>

          <FlatList
            style={styles.listSongs}
            data={data}
            renderItem={renderItem}
            removeClippedSubviews={true}
            keyExtractor={item => item.number}
            contentContainerStyle={{ gap: 15 }}
            // columnWrapperStyle={{ gap: GAP_BETWEEN_COLUMNS }}
            ListEmptyComponent={() =>
             <View style={styles.containerList}>
                <Text style={styles.emptyListTitle}>
                Список песен пуст
              </Text>
             </View>       
            }
            //ListFooterComponent={renderFooter}
          />       
          </SafeAreaView>

      </Provider>
    </Surface>
  );
}
