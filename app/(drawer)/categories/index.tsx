import React, { useContext } from 'react'
import { DrawerToggleButton } from "@react-navigation/drawer";
//import { ThemeContext } from '@/context/ThemeContext';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
//import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import Card from '../../../components/ui/Card';
import {
  Provider,
} from "react-native-paper";

//import filter from "lodash.filter"


const CategoriesScreen = () => {

  //const {currentTheme, toggleTheme} = useContext(ThemeContext)

  // const headerRight = () => {
  //       return (
  //         <TouchableOpacity
  //           // onPress={()=>router.push("/modal")}
  //           style={{marginRight: 10}}
  //         >
  //           <FontAwesome name="plus-circle" size={28} color="blue" />
  //         </TouchableOpacity>
  //       );
  // };

  return (

    <View>
      <Stack.Screen options={{ 
        headerShown: true, 
        title: "Категории песен", 
        headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />), 
        headerStyle: {backgroundColor: '#26489a'},  
        headerTintColor: 'white',
        }} />
      <Provider>
          <Content />
      </Provider>
    </View>
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
            Список заметок пуст
          </Text>
        }
      />       
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
  emptyList: {
    fontSize: 16,
  },

  listSongs:{
    padding: 15,
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
    height: 55,
  },

  main_content: {
    width: '70%'
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
});