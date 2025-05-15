import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react'
import { useEffect, useState } from "react";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Ionicons, FontAwesome, AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
//import Card from '../../../../components/ui/Card';
import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from "expo-sqlite";
import { 
  Surface, 
  Appbar, 
  Menu, 
  Tooltip,
  FAB,
  Avatar, 
  Card} from "react-native-paper";
import { Button, Dialog, Portal, IconButton } from 'react-native-paper';
import asyncAlert from "./../../../../components/asyncAlert.js";

import filter from "lodash.filter"
import PopupMenu from "./../../../../components/ui/PopupMenu.js";

import { Locales, ScreenInfo, styles, TabsHeader } from '@/lib'


const PlaylistScreen = () => {

  const router = useRouter();

  const [visible, setVisible] = useState(false) 
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
        {/* <PopupMenu options={data} color={"white"}/> */}
        <Tooltip title={Locales.t('search')}>
          <Appbar.Action
            icon="delete"
            onPress={()=>setVisiblePlaylist(true)}
          />
        </Tooltip>
        <Tooltip title={Locales.t('search')}>
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
    );
  };

  return (

    <Surface style={styles.screen}>
      {/* Header */}
      <Stack.Screen options={{ 
        headerShown: true, 
        title: Locales.t("titlePlaylist"), 
        headerRight: headerRight,
        headerLeft: (() => <DrawerToggleButton tintColor={'#fff'}  />),
        headerStyle: {backgroundColor: '#26489a'},    
        headerTintColor: 'white',
        header: (props) => <TabsHeader navProps={props} children={undefined} />,
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
  const db = useSQLiteContext();

  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('')
  const [data, setData] = useState([])
  const [playlists, setPlaylists] = useState([{"id": "1", "name": "Тест", "uid": "1747278926882"}, {"id": "2", "name": "Тест2", "uid": "1747279082656"}, {"id": "3", "name": "Тест", "uid": "1747279201178"}])
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

      try {
        const local_db = await SQLite.openDatabaseAsync('myLocalDatabase4');

        await local_db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS playlists2 (
            _id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            uid	TEXT NOT NULL,
            nameList	TEXT NOT NULL
          );`
        );

        await local_db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS playlist_songs (
            _id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            id_song	INTEGER NOT NULL,
            id_playlist	INTEGER NOT NULL
          )`
        );

        await local_db.withTransactionAsync(async () => {
          const allRows = await local_db.getAllAsync('SELECT * FROM playlists2');
          console.log("allRows: ", allRows)
          const playlist = allRows.map((row) => ({
            id: row._id,
            uid: row.uid,
            name: row.nameList,
          }));

          const sortedSongs = [...playlist].sort((a, b) => {       
            var songA = a.name, songB = b.name
            return (songA < songB) ? -1 : (songA > songB) ? 1 : 0;  //сортировка по возрастанию 
          })
      
          //setPlaylists(sortedSongs);

          setIsLoading(false);
         });

        // setPlaylists([]);

        // setIsLoading(false);

      } catch (error) {
        console.log(error.message)
      }
      
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

  const showNewDialog = () =>
  
  setDialog({
    isVisible: true,
    customer: {},
  });

  // const hideDialog = () => setVisible(false);

  const hideDialog = async (updatedCustomer) => {
    setDialog({
      isVisible: false,
      customer: {},
    });

    setPlaylistTitle('')

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

  useEffect(() => {
    console.log("Плейлисты: ", playlists)
  }, [playlists])

  // Добавить плейлист
  const addPlaylist = async (textInputValue)=> {
    const newValue = {
      uid: Date.now().toString(),
      name: textInputValue,
    };
    setPlaylists([...playlists, newValue]);

    //скрыть диалоговое окно
    setDialog({
      isVisible: false,
      customer: {},
    });

    setPlaylistTitle('')

    // const local_db = await SQLite.openDatabaseAsync('myLocalDatabase4');

    // try {
    //   // Insert new customer into the database
    //   await local_db.withTransactionAsync(async () => {
    //     await local_db.execAsync(
    //       `INSERT INTO playlists (uid, nameList) values (?, ?)`, 
    //       [newValue.uid, newValue.name]
    //     );
    //   })
    // } catch (error) {
    //     console.log(error.message)
    // }
    
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
      const newCustomers = playlists.filter((c) => c.id !== customer.id);
      setPlaylists(newCustomers);
  
      // Delete customer from the database
      // await db.withTransactionAsync(async () => {
      //   await db.execAsync("DELETE FROM playlists WHERE uid = ?", [customer.uid]);
      // })
  };

  
  function Item({ item }) {
    return ( 
      <Card style={styles.back}>
        <TouchableOpacity onPress={()=> {router.push(`/plalist/list/${item.id}`)}} >
          <Card.Title 
            title={item.name} 
            left={(props) => <Avatar.Icon {...props} icon="play-box-multiple-outline" />}
            right={(props) => 
              <>
                <View style={styles.right_section}>
                  <Text>0</Text>
                  <IconButton {...props} icon="dots-vertical" onPress={() => {}} />
                </View>
              </>
            }
          />
        </TouchableOpacity>
      </Card>
    );
  }

  const renderSeparator = () => {
      return (
        <View
          style={{
            height: 0.5,
            width: "95%",
            backgroundColor: "#c3c3c3",
            marginLeft: "2%",
          }}
        />
      );
  };


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
    showNewDialog()
    
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <FlatList
        style={styles.listSongs}
        data={playlists}
        renderItem={({ item }) => <Item item={item}/>}
        keyExtractor={item => item.uid}
        //ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={{  flexGrow: 1,  gap: 15 }}
        // columnWrapperStyle={{ gap: GAP_BETWEEN_COLUMNS }}
        ListEmptyComponent={EmptyListMessage}
      />   

      {/* Кнопка Добавить */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={onButtonAdd}
      />

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
