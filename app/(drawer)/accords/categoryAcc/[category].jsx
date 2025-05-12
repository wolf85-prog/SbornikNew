import { SafeAreaView, Text, View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Stack, useRouter } from 'expo-router';
import React from 'react'
import { useEffect, useState } from "react";
import { DrawerToggleButton } from "@react-navigation/drawer";
import {Provider, Surface} from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
//import filter from "lodash.filter"

import accordsData from './../../../../data/accord_new.js';
import catAccordData from './../../../../data/categories_accords.js';

import {
  Locales,
  TabBar, TabsHeader,
  styles, 
} from '@/lib'

export default function CategoryAccordScreen() {

  const db = useSQLiteContext();

  const [title, setTitle] = useState('');
  const { category } = useLocalSearchParams(); 
  
  useEffect(() => {
    console.log("id: ", category)
      
  }, [category])

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([])
  const [accords, setAccords] = useState([])
  const [error, setError] = useState(null)
  const [fullData, setFullData] = useState([])

  useEffect(() => {
    setIsLoading(true);
    const fetch = (async()=> {

      // await db.withTransactionAsync(async () => {
      //   const row = await db.getFirstAsync(`SELECT * FROM categories_accords WHERE _id=${category}`);
      //   console.log("row: ", row)

      //   setTitle(row.accord)
      // });
      const resTitle = catAccordData.find((item)=> item._id === Number(category) )
      console.log("resTitle: ", resTitle)
      setTitle(resTitle ? resTitle.accord : '')

      // await db.withTransactionAsync(async () => {
      //   const allRows = await db.getAllAsync(`SELECT * FROM accord_new WHERE _id_cat_acc=${category}`);
      //   const accords = allRows.map((row) => ({
      //     _id: row?._id,
      //     name: row?.name,
      //     code: row?.code,
      //     bare: row?.bare,
      //     lad: row?.lad,
      //   }));

      //   setAccords(accords);

      //   setIsLoading(false);
      // });

        const resAccords = accordsData.filter(item=> item._id_cat_acc === Number(category))
        console.log(resAccords.length)
        setAccords(resAccords);

        setIsLoading(false);

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
  

  const Item = ({item}) => (
    <TouchableOpacity style={styles.item} onPress={()=> {router.push(`/accords/categoryAcc/accord/${item._id}`)}} >
      <Text style={[styles.textAccord]}>{item.name}</Text>
    </TouchableOpacity>
  );


  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: "95%",
          backgroundColor: "#050505",
          marginLeft: "2%",
        }}
      />
    );
  };

  const renderFooter = () => {
    if (isLoading) return null;
  
    return (
      <View
        style={{
          paddingVertical: 10,
          borderTopWidth: 1,
          borderColor: "#050505",
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  return (
    <Surface style={styles.screen} >
      <Stack.Screen options={{ 
        headerShown: true, 
        title: title, 
        headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />),
        headerStyle: {backgroundColor: '#26489a'}, 
        headerTintColor: 'white',
        header: (props) => <TabsHeader navProps={props} children={undefined} />,
      }} />

      <Provider>
        <SafeAreaView style={{ flex: 1 }}>

          <FlatList
            style={styles.listSongs}
            data={accords}
            renderItem={({ item }) => <Item item={item}/>}
            keyExtractor={item => item._id}
            // ItemSeparatorComponent={() => <View style={{height: 15}} />}
            ItemSeparatorComponent={renderSeparator}
            contentContainerStyle={{  flexGrow: 1,  gap: 15 }}
            // columnWrapperStyle={{ gap: GAP_BETWEEN_COLUMNS }}
            ListEmptyComponent={() =>
              <Text>
                Список аккордов пуст
              </Text>
            }
            //ListFooterComponent={renderFooter}
          />       
          </SafeAreaView>

      </Provider>
    </Surface>
  );
}
