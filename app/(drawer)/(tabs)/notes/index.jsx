import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react'
import { useEffect, useState } from "react";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Ionicons, FontAwesome, Entypo, AntDesign, MaterialIcons } from '@expo/vector-icons';
import Card from '../../../../components/ui/Card';
import PopupMenu from "../../../../components/ui/PopupMenu.js";
import { Button, Menu, Divider, PaperProvider, Dialog, Portal } from 'react-native-paper';

//import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { Surface, FAB, Tooltip, Appbar } from 'react-native-paper'
import { Locales, ScreenInfo, styles, TabsHeader } from '@/lib'

import filter from "lodash.filter"

const NotesScreen = () => {

  const router = useRouter();

  const data = [
      {
        title: "Настройки",
        action: ()=>router.push("/settings")
      },
  ]
  
  const headerRight = () => {
    return (
      <>
        <Tooltip title={Locales.t('search')}>
                          <Appbar.Action
                            icon="magnify"
                            onPress={() => router.push('/search')}
                          />
                        </Tooltip>
                        <Tooltip title={Locales.t('titleSettings')}>
                          <Appbar.Action
                            icon="cog"
                            onPress={() => router.push('/(drawer)/settings')}
                          />
                        </Tooltip>
      </>
        // <PopupMenu options={data} color={"white"}/>
    );
  };

  return (

    <Surface style={styles.screen}>
      {/* Header */}
      <Stack.Screen options={{ 
        headerShown: true, 
        title: Locales.t("titleNotes"), 
        headerRight: headerRight,
        headerLeft: (() => <DrawerToggleButton />),
        headerStyle: {backgroundColor: '#26489a'},    
        headerTintColor: 'white',
        header: (props) => <TabsHeader navProps={props} children={undefined} />,
      }} />

        <Content />
    </Surface>
  )
}

export default NotesScreen

export function Content() {
  //const db = useSQLiteContext();

  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([])
  const [notes, setNotes] = useState([])
  const [error, setError] = useState(null)
  const [fullData, setFullData] = useState([])
  const [textInputValue, setTextInputValue] = useState("");
  const [noteTitle, setNoteTitle] = useState("");

  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const [dialog, setDialog] = useState({
        note: {},
        isVisible: false,
      });


  const showDialog = (note) =>
        setDialog({
          isVisible: true,
          note,
  });

  const hideDialog = async (updatedNote) => {
        setDialog({
          isVisible: false,
          note: {},
        });

        // Update the local state
    const newNotes = notes.map((note) => {
      if (note.uid !== updatedNote.uid) {
        return customer;
      }

      return updatedNote;
    });

    setNotes(newNotes);

    // await db.withTransactionAsync(async () => {
    //   await db.execAsync(
    //     `UPDATE playlists SET uid=?, name=? WHERE uid=${updatedCustomer.uid}`, 
    //     [updatedCustomer.uid, updatedCustomer.name]
    //   );
    // })
  };

  const addNote = async (textInputValue)=> {
    const newValue = {
      uid: Date.now().toString(),
      name: textInputValue,
    };
    setNotes([...notes, newValue]);

    setDialog({
      isVisible: false,
      note: {},
    });

    // Insert new customer into the database
    await db.withTransactionAsync(async () => {
      await db.execAsync(
        `INSERT INTO playlists (uid, name) values (?, ?)`, 
        [newValue.uid, newValue.name]
      );
    })
  }


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

         setIsLoading(false);
      // });
    })

    fetch()
  }, []);
  
  function Item({ item }) {
    return (
      <Card>
        <TouchableOpacity onPress={()=> {router.push(`/songs/song/${item.number}`)}} >
          <View style={styles.flex}>
            
            <View style={styles.main_content}>
              <Text style={styles.name}>{item.name}</Text>
              {/* <Text style={styles.category}>{item.email}</Text>      */}
            </View>

            <View style={styles.right_section}>
              <View style={styles.number}>
                <Text>{item.number}</Text>
              </View>  
              <Ionicons name="star-outline" size={24} color="#feed33" />
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
            <MaterialIcons name="event-note" size={72} color="#7f8c8d" style={{textAlign: 'center'}}/>
            <Text style={styles.emptyListTitle}>
              Список заметок пуст
            </Text>
            <Text style={styles.emptyList}>
              Добавьте заметку при просмотре песни
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
    console.log("press")
    //setVisible(true)
    showDialog()
  }

  return (
    <SafeAreaView style={{flex:1}}>

      <FlatList
        style={styles.listSongs}
        data={notes}
        renderItem={({ item }) => <Item item={item}/>}
        keyExtractor={item => item.uid}
        // ItemSeparatorComponent={() => <View style={{height: 15}} />}
        contentContainerStyle={{  flexGrow: 1, justifyContent: "center", alignItems: "center", gap: 15 }}
        // columnWrapperStyle={{ gap: GAP_BETWEEN_COLUMNS }}
        ListEmptyComponent={EmptyListMessage}
      />  

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={onButtonAdd}
      />

      <Portal>
        <Dialog visible={dialog.isVisible} onDismiss={() => hideDialog(dialog.note)}>
          <Dialog.Title>Новая заметка</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Название"
              placeholder="Введите название"
              value={noteTitle}
              onChangeText={text => setNoteTitle(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => hideDialog(dialog.note)}>Отмена</Button>
            <Button 
              onPress={() => addNote(noteTitle)}
            >Добавить
            </Button>
          </Dialog.Actions>
        </Dialog>

        
      </Portal>    
    </SafeAreaView>
  );
}
