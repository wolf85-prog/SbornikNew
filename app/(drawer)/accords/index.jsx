import { SafeAreaView, Text, View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from "expo-router";
import { Stack, useRouter } from 'expo-router';
import React from 'react'
import { useEffect, useState } from "react";
import { DrawerToggleButton } from "@react-navigation/drawer";
import {Provider} from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
//import filter from "lodash.filter"

export default function AccordScreen() {


  return (
    <View style={styles.container} >
      <Stack.Screen options={{ 
        headerShown: true, 
        title: "Аккорды", 
        headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />),
        headerStyle: {backgroundColor: '#26489a'}, 
        headerTintColor: 'white',
      }} />
      <Provider>
        <Content />
      </Provider>
    </View>
  );
}

export function Content() {
  const db = useSQLiteContext();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([])
  const [accords, setAccords] = useState([])
  const [error, setError] = useState(null)
  const [fullData, setFullData] = useState([])

  useEffect(() => {
    setIsLoading(true);
    const fetch = (async()=> {

      await db.withTransactionAsync(async () => {
        const allRows = await db.getAllAsync('SELECT * FROM categories_accords');
        const accords = allRows.map((row) => ({
          uid: row?._id,
          name: row?.accord,
        }));
    
        setAccords(accords);

        setIsLoading(false);
      });
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
    <TouchableOpacity style={styles.item} onPress={()=> {router.push(`/accords/categoryAcc/${item.uid}`)}} >
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );


  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "95%",
          backgroundColor: "#CED0CE",
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
        keyExtractor={item => item.uid}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    width: '100%',
    paddingHorizontal: 0,
    paddingVertical: 20,
  },

  listSongs:{
    padding: 10,
    flex: 1,
  },
  text: {
    color: '#fff',
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 18,
    color: '#000'
  },
});