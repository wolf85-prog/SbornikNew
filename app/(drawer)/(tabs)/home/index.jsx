import { SafeAreaView, StatusBar, Text, View, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import Card from '../../../../components/ui/Card';
import { Stack, useRouter } from 'expo-router';
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';

import React, { useContext, useState, useEffect } from 'react'

import {
  Provider,
} from "react-native-paper";

import filter from "lodash.filter"

import songsData from './../../../../data/songsData.js';
// import { ThemeContext } from "./../../../../context/ThemeContext.tsx"
// import { useUserContext } from "./../../../../context/SongContext.tsx"
// import { COLORS } from "../../../../constants/colors.js";
// import PopupMenu from "../../../../components/ui/PopupMenu.js";



export default function TabsHome() {
  //const {currentTheme} = useContext(ThemeContext)  

  const router = useRouter();

  // const options = [
  //         {
  //             title: "Настройки",
  //             action: ()=>router.push("/settings")
  //         },
  //     ]

  // const headerRight = () => {
  //   return (
  //     <PopupMenu options={options} color={"white"} />
  //   );
  // };



  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: false, 
        title: "Главная", 
        //headerRight: headerRight,
        //headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />),
        headerStyle: {backgroundColor: '#26489a'},    
        headerTintColor: 'white',
        //headerTitleStyle: {fontWeight: 400},
        }}
      />
      
      <Content />
      
    </View>
  );
}

//---------------------------------------------------------------------------------

export function Content() {
  //const db = useSQLiteContext();

  const router = useRouter();

  //const {songs, setSongs} = useUserContext()

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('')
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [fullData, setFullData] = useState([])
  const [textInputValue, setTextInputValue] = useState("");
  const [favorite, setFavorite] = useState([])

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const handleSearch = (query) => {
    setSearchQuery(query)
    const formattedQuery = query.toLowerCase()
    const filteredData = filter(fullData, (user)=> {
      return contains(user, formattedQuery)
    })
    setData(filteredData)
  }

  const contains = ({name, email}, query) => {
    console.log("name: ", fullData)
    console.log("query: ", query)

    if (name.includes(query) || email.includes(query)) {
      return true
    }

    return false
  }

  useEffect(() => {
    setIsLoading(true);

    const fetch = (async()=> {
      try {
        // await db.withTransactionAsync(async () => {
        //   const allRows = await db.getAllAsync('SELECT * FROM songs');
        //   const songs = allRows.map((row) => ({
        //     uid: row._id,
        //     name: row.name,
        //     number: row.number,
        //   }));

        //   setData(songs)

        //   setFullData(songs)
        //   setIsLoading(false);
        // });

        setData(songsData)

        setFullData(songsData)
        setIsLoading(false);
        
      } catch (error) {
        setError(error)
        console.log(error)
      }    
    })

    fetch()
  }, []);

  const pressStar = (item, fav) => {
    onToggleSnackBar()
    console.log("press: ", item.number)
    let arr = []
    arr[item.number-1] = !fav
    //console.log(arr)
    setFavorite(arr)
  }
  
  function Item({ item }) {
    return (
      <Card>
        <TouchableOpacity onPress={()=> {router.push(`/home/song/${item.number}`)}} >
          <View style={styles.flex}>
            <View style={styles.number}>
              <Text>{item.number}</Text>
            </View>   
            
            <View style={styles.main_content}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>Без категории</Text>     
            </View>

            <View style={styles.right_section}>
              <Ionicons onPress={()=> pressStar(item, favorite[item.number-1])} name={favorite[item.number-1] ? "star" : "star-outline"} size={24} color="#feed33" />
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
      <StatusBar
        animated={true}
        backgroundColor = '#26489a'
        //barStyle={statusBarStyle}
        //showHideTransition={statusBarTransition}
        //hidden={hidden}
      />
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


      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Undo',
          onPress: () => {
            // Do something
          },
        }}>
        Hey there! I'm a Snackbar.
      </Snackbar>
            
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    width: '100%',
  },

  header: {
    backgroundColor: '#F3F3F3', //COLORS.darkBlue,
  },

  listSongs:{
    padding: 15,
    flex: 1,
  },

  number: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18, 
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
    //position: 'relative',
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