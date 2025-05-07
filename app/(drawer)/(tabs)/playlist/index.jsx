import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react'
import { useEffect, useState } from "react";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Ionicons, FontAwesome, AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import Card from '../../../../components/ui/Card';
import { useSQLiteContext } from "expo-sqlite";
import {Provider, Surface} from "react-native-paper";
import { Button, Dialog, Portal, IconButton } from 'react-native-paper';
import asyncAlert from "./../../../../components/asyncAlert.js";

import filter from "lodash.filter"
import PopupMenu from "./../../../../components/ui/PopupMenu.js";

import { Locales, ScreenInfo, styles } from '@/lib'


const PlaylistScreen = () => {

  const router = useRouter();

  const [visiblePlaylist, setVisiblePlaylist] = useState(false);

  const hideDialog = () => setVisible(false);

  const data = [
      {
        title: "Настройки",
        action: ()=>router.push("/settings")
      },
  ]
  
  const headerRight = () => {
    return (
      <>
        <TouchableOpacity
          // onPress={()=>router.push("/modal")}
          onPress={()=>setVisibleFontSize(true)}
          style={{marginRight: 20}}
        >
          <AntDesign name="search1" size={22} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          // onPress={()=>router.push("/modal")}
          onPress={()=>setVisiblePlaylist(true)}
          style={{marginRight: 20}}
        >
          <AntDesign name="delete" size={22} color="white" />
        </TouchableOpacity>

        <PopupMenu options={data} color={"white"}/>
      </>
    );
  };

  return (

    <Surface style={styles.screen}>
      {/* Header */}
      <Stack.Screen options={{ 
        headerShown: true, 
        title: Locales.t("titlePlaylist"), 
        headerRight: headerRight,
        headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />),
        headerStyle: {backgroundColor: '#26489a'},    
        headerTintColor: 'white',
      }} />
      {/* <Provider> */}
          <Content />

          <Dialog visible={visiblePlaylist} onDismiss={hideDialog}>
            <Dialog.Title>Удаление</Dialog.Title>
            <Dialog.Content>
              <Text>Вы хотите очистить список?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setVisiblePlaylist(false)}>Отмена</Button>
              <Button onPress={() => setVisiblePlaylist(false)}>ОК</Button>
            </Dialog.Actions>
        </Dialog>

      {/* </Provider> */}
    </Surface>
  )
}

export default PlaylistScreen

export function Content() {
  //const db = useSQLiteContext();

  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('')
  const [data, setData] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [error, setError] = useState(null)
  const [fullData, setFullData] = useState([])
  const [textInputValue, setTextInputValue] = useState("");
  const [playlistTitle, setPlaylistTitle] = useState("");

  const [dialog, setDialog] = useState({
      customer: {},
      isVisible: false,
    });
  
  const dataMenu = [
    {
      title: "Редактировать",
      action: ()=>alert('dffdf')
    },
    {
        title: "Удалить",
        action: ()=>{
          console.log("удаление...")
          deleteCustomer()
          //playlists.filter(item=> item.id === '5')
        }
    },
  ]

  

  useEffect(() => {
    setIsLoading(true);

    const fetch = (async()=> {

      const db = await SQLite.openDatabaseAsync('myLocalDatabase');

      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS playlists (id INTEGER PRIMARY KEY NOT NULL, uid TEXT, nameList TEXT NOT NULL);
      `);

      await db.withTransactionAsync(async () => {
        const allRows = await db.getAllAsync('SELECT * FROM playlists');
        console.log("allRows: ", allRows)
        const playlist = allRows.map((row) => ({
          uid: row._id,
          name: row.nameList,
        }));

        const sortedSongs = [...playlist].sort((a, b) => {       
          var songA = a.name, songB = b.name
          return (songA < songB) ? -1 : (songA > songB) ? 1 : 0;  //сортировка по возрастанию 
        })
    
        setPlaylists([]);

        setIsLoading(false);
      });
    })

    fetch()

    setIsLoading(false);
  }, []);

  const [visible, setVisible] = useState(false);

  const showDialog = (customer) =>
    setDialog({
      isVisible: true,
      customer,
    });

  // const hideDialog = () => setVisible(false);

  const hideDialog = async (updatedCustomer) => {
    setDialog({
      isVisible: false,
      customer: {},
    });

    // Update the local state
    const newCustomers = playlists.map((customer) => {
      if (customer.uid !== updatedCustomer.uid) {
        return customer;
      }

      return updatedCustomer;
    });

    setPlaylists(newCustomers);

    // await db.withTransactionAsync(async () => {
    //   await db.execAsync(
    //     `UPDATE playlists SET uid=?, name=? WHERE uid=${updatedCustomer.uid}`, 
    //     [updatedCustomer.uid, updatedCustomer.name]
    //   );
    // })
  };

  const addPlaylist = async (textInputValue)=> {
    const newValue = {
      uid: Date.now().toString(),
      name: textInputValue,
    };
    setPlaylists([...playlists, newValue]);

    setDialog({
      isVisible: false,
      customer: {},
    });

    // Insert new customer into the database
    await db.withTransactionAsync(async () => {
      await db.execAsync(
        `INSERT INTO playlists (uid, name) values (?, ?)`, 
        [newValue.uid, newValue.name]
      );
    })
  }

  // Function to delete a customer
  const deleteCustomer = async (customer) => {
      // Show confirmation alert
      // Magpakita ng confirmation alert
      const shouldDelete = await asyncAlert({
        title: "Удаление плейлиста",
        message: `Вы точно хотите удалить плейлист "${customer.name}"?`,
      });
      if (!shouldDelete) {
        return;
      }
  
      // Update the local state
      const newCustomers = playlists.filter((c) => c.uid !== customer.uid);
      setPlaylists(newCustomers);
  
      // Delete customer from the database
      // await db.withTransactionAsync(async () => {
      //   await db.execAsync("DELETE FROM playlists WHERE uid = ?", [customer.uid]);
      // })
  };

  
  function Item({ item }) {
    return (
      <Card key={item.uid}>
        <TouchableOpacity onPress={()=> {router.push(`/`)}} >
          <View style={styles.flex}>
            
            <View style={styles.main_content}>
              <Text style={styles.name}>{item.name}</Text>
              {/* <Text style={styles.category}>{item.email}</Text>      */}
            </View>

            <View style={styles.right_section}>
              <View style={styles.number}>
                <Text>0</Text>
              </View> 
              <IconButton
                icon="delete"
                size={24}
                onPress={() => deleteCustomer(item)}
              /> 
              {/* <Entypo name="dots-three-vertical" size={24} color="gray" /> */}
              <PopupMenu color={"black"} options={dataMenu} id={item.uid}/>
            </View>
          </View>
          
        </TouchableOpacity >
      </Card>
      
    );
  }


  const EmptyListMessage = ({item}) => {
      return (
            // Flat List Item
            <View style={styles.containerList}>
              <MaterialIcons name="playlist-play" size={72} color="#7f8c8d" style={{textAlign: 'center'}}/>
              <Text style={styles.emptyListTitle}>
                Список плейлистов пуст
              </Text>
              <Text style={styles.emptyList}>
                Добавьте новый плейлист
              </Text>
            </View>  
      );
  };

  if (isLoading) {
    return (
      <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size={"large"} color="#5500dc"/>
      </View>
    );
  }

  const onButtonAdd = ()=> {
    console.log("press add playlist")
    showDialog()
    
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <FlatList
        style={styles.listSongs}
        data={playlists}
        renderItem={({ item }) => <Item item={item}/>}
        keyExtractor={item => item.uid}
        // ItemSeparatorComponent={() => <View style={{height: 15}} />}
        contentContainerStyle={{  flexGrow: 1,  gap: 15 }}
        // columnWrapperStyle={{ gap: GAP_BETWEEN_COLUMNS }}
        ListEmptyComponent={EmptyListMessage}
      />   

      {/* Кнопка Добавить */}
      {/* <TouchableOpacity
        style={styles.floatingButton}
        onPress={onButtonAdd}
      >
        <AntDesign name="pluscircle" size={70} color="#DE3163" />
      </TouchableOpacity>  */}

      <Portal>
        <Dialog visible={dialog.isVisible} onDismiss={() => hideDialog(dialog.customer)}>
          <Dialog.Title>Новый плейлист</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Название"
              placeholder="Введите название"
              value={playlistTitle}
              onChangeText={text => setPlaylistTitle(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => hideDialog(dialog.customer)}>Отмена</Button>
            <Button 
              onPress={() => addPlaylist(playlistTitle)}
            >Добавить
            </Button>
          </Dialog.Actions>
        </Dialog>

        
      </Portal>   
    </SafeAreaView>
  );
}


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f3f3f3',
//         width: '100%',
//       },

//       containerList: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#d6d5d5',
//         width: '100%',
//         margin: 0
//       },

//       emptyListTitle: {
//         color: '#7f8c8d',
//         textAlign: 'center',
//         fontSize: 22,
//       },

//       emptyList: {
//         color: '#b2babb',
//         textAlign: 'center',
//         fontSize: 16,
//       },

//       listSongs:{
//         padding: 0,
//         flex: 1,
//       },

//       card: {
//         height: 65,
//         backgroundColor: '#0005',
//         padding: 8,
//         paddingHorizontal: 15,
//         marginTop: 10,
//         borderRadius: 6,
//         borderColor: '#000'
//       },
//       number: {
//         width: 40,
//         height: 40,
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//       },

//       flex: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         flex: 1,
//         flexDirection: 'row',
//         height: 55,
//       },

//       main_content: {
//         width: '70%'
//       },

//       name: {
//         color: '#000',
//         fontSize: 16, 
//         fontFamily: 'SpaceMono',
//       },

//       category: {
//         color: '#e5e5e5',
//         fontFamily: 'SpaceMono'
//       },

//       right_section: {
//         display: 'flex',
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//         flex: 1,
//         flexDirection: 'row'
//       },

//       searchBox: {
//         height: 46,
//         marginLeft: 15,
//         marginRight: 15,
//         marginTop: 15,
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         borderColor: '#ccc',
//         borderWidth: 1,
//         borderRadius: 8,
//       },
//       floatingButton: {
//         position: 'absolute',
//         width: 150,
//         height: 150,
//         alignItems: 'center',
//         justifyContent: 'center',
//         bottom: 0,
//         right: 0,
//       },
// })