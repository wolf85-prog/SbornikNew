import { SafeAreaView, Text, View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from "expo-router";
import { Stack, useRouter } from 'expo-router';
import React from 'react'
import { useEffect, useState } from "react";
import { DrawerToggleButton } from "@react-navigation/drawer";
import {Provider, Surface, useTheme } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
//import filter from "lodash.filter"

import catAccordData from './../../../data/categories_accords.js';


import {
  Locales,
  TabBar, TabsHeader,
  styles, 
} from '@/lib'

export default function AccordScreen() {


  return (
    <Surface style={[styles.screen, styles.containerAccords]} >
      <Stack.Screen options={{ 
        headerShown: true, 
        title: "Аккорды", 
        headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />),
        headerStyle: {backgroundColor: '#26489a'}, 
        headerTintColor: 'white',
        header: (props) => <TabsHeader navProps={props} children={undefined} />,
      }} />

      <Content />
        
    </Surface>
  );
}

export function Content() {
  const db = useSQLiteContext();

  const router = useRouter();

  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([])
  const [accords, setAccords] = useState([])
  const [error, setError] = useState(null)
  const [fullData, setFullData] = useState([])

  useEffect(() => {
    setIsLoading(true);
    const fetch = (async()=> {

      // await db.withTransactionAsync(async () => {
      //   const allRows = await db.getAllAsync('SELECT * FROM categories_accords');
      //   const accords = allRows.map((row) => ({
      //     _id: row?._id,
      //     accord: row?.accord,
      //   }));
    
      //   setAccords(accords);

      //   setIsLoading(false);
      // });

      setAccords(catAccordData)
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
    <TouchableOpacity style={styles.item} onPress={()=> {router.push(`/accords/categoryAcc/${item._id}`)}} >
      <Text style={[styles.textAccord]}>{item.accord}</Text>
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
          borderColor: "#CED0CE",
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  return (
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
  );
}
