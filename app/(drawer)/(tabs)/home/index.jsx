import { SafeAreaView, StatusBar, Text, View, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import Card from '../../../../components/ui/Card';
import { Stack, useRouter } from 'expo-router';
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';

import React, { useContext, useState, useEffect } from 'react'

import {
  Surface,
  Appbar, 
  Menu, 
  Tooltip 
} from "react-native-paper";
import {
  Locales,
  TabBar, TabsHeader,
  styles, 
} from '@/lib'

import filter from "lodash.filter"

import songsData from './../../../../data/songsData.js';
// import { ThemeContext } from "./../../../../context/ThemeContext.tsx"
// import { useUserContext } from "./../../../../context/SongContext.tsx"
// import { COLORS } from "../../../../constants/colors.js";
// import PopupMenu from "../../../../components/ui/PopupMenu.js";



export default function TabsHome() {
  //const {currentTheme} = useContext(ThemeContext) 

  const [visible, setVisible] = React.useState(false) 

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
    <Surface style={styles.screen}>
      <Stack.Screen options={{ 
        headerShown: true, 
        title: Locales.t('titleHome'), 
        headerRight: () => (
                    <>
                      <Tooltip title={Locales.t('search')} color={"white"}>
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
                          <Tooltip title={Locales.t('options')} color={"white"}>
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
      
      <Content />
      
    </Surface>
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
        backgroundColor = '#060606' //'#26489a'
        //barStyle={statusBarStyle}
        //showHideTransition={statusBarTransition}
        //hidden={hidden}
      />
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
