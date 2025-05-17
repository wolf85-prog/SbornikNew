import React, { useContext } from 'react'
import { DrawerToggleButton } from "@react-navigation/drawer";
//import { ThemeContext } from '@/context/ThemeContext';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { Ionicons, FontAwesome, AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
//import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import Card from '../../../components/ui/Card';

import { 
  Surface, 
  Appbar, 
  Menu, 
  Tooltip,
  Dialog, 
  Portal,
  Button,
  FAB} from "react-native-paper";

import { Locales, ScreenInfo, styles, TabsHeader } from '@/lib'

//import filter from "lodash.filter"


const CategoriesScreen = () => {

  const router = useRouter();

  const [visible, setVisible] = useState(false)
  const [visiblePlaylist, setVisiblePlaylist] = useState(false);


  const headerRight = () => {
      return (
        <>
          {/* <TouchableOpacity
            // onPress={()=>router.push("/modal")}
            onPress={()=>setVisibleFontSize(true)}
            style={{marginRight: 20}}
          >
            <AntDesign name="search1" size={22} color="white" />
          </TouchableOpacity> */}
  
          <TouchableOpacity
            // onPress={()=>router.push("/modal")}
            onPress={()=>setVisiblePlaylist(true)}
            style={{marginRight: 15}}
          >
            <AntDesign name="delete" size={18} color="white" />
          </TouchableOpacity>
  
          {/* <PopupMenu options={data} color={"white"}/> */}
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
      );
    };

  return (

    <Surface style={styles.screen}>
      <Stack.Screen options={{ 
        headerShown: true, 
        title: "Категории песен", 
        headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />), 
        headerRight: headerRight,
        headerStyle: {backgroundColor: '#26489a'},  
        headerTintColor: 'white',
        header: (props) => <TabsHeader navProps={props} children={undefined} />,
        }} />

        <Content />
    </Surface>
  )
}

export default CategoriesScreen

export function Content() {
  //const db = useSQLiteContext();

  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([])
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [fullData, setFullData] = useState([])
  const [textInputValue, setTextInputValue] = useState("");
  const [categoryTitle, setCategoryTitle] = useState("");

  const [dialog, setDialog] = useState({
      category: {},
      isVisible: false,
  });

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
  
  function Item({item}) {
    return (
      <Card style={styles.back}>
        <TouchableOpacity onPress={()=> {router.push(`/categories/details/${item.name}`)}} >
          <Card.Title 
            title={item.name} 
            left={(props) => <Avatar.Icon {...props} icon="play-box-multiple-outline" />}
            right={(props) => 
              <>
                <View style={styles.right_section}>
                  <Text style={{color: '#f5f5f5'}}>0</Text>
                  <IconButton {...props} icon="dots-vertical" onPress={() => {}} />
                </View>
              </>
            }
          />
        </TouchableOpacity>
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

  const showNewDialog = () => {
  
    setDialog({
      isVisible: true,
      category: {},
    });
  }

  const hideDialog = async (updatedCustomer) => {
    setDialog({
      isVisible: false,
      category: {},
    });

    setCategoryTitle('')

    // Update the local state
    const newCustomers = categories.map((customer) => {
      if (customer.id !== updatedCustomer.id) {
        return customer;
      }

      return updatedCustomer;
    });

    setCategories(newCustomers);

  };

  // Добавить категорию
    const addCategory = async (textInputValue)=> {
      console.log("textInputValue: ", textInputValue)
      const newValue = {
        //uid: Date.now().toString(),
        id: Date.now().toString(),
        name: textInputValue,
      };
      setCategories([...categories, newValue]);
  
      //скрыть диалоговое окно
      setDialog({
        isVisible: false,
        category: {},
      });
  
      setCategoryTitle('')
  
      console.log(newValue.name)
  
      // try {
      //   const local_db = await SQLite.openDatabaseAsync(DBNAME);
  
      //   // Insert new customer into the database
      //   await local_db.withTransactionAsync(async () => {
      //     await local_db.execAsync(
      //       `INSERT INTO playlists (nameList) values (?)`, 
      //       [newValue.name]
      //     );
      //   })
      // } catch (error) {
      //     console.log(error.message)
      // }
      
    }

  const onButtonAdd = ()=> {
    console.log("press add category")
    showNewDialog()
    
  }



  return (
    <SafeAreaView style={{flex:1}}>

      <FlatList
        style={styles.listSongs}
        data={categories}
        renderItem={({ item }) => <Item item={item}/>}
        keyExtractor={item => item.number}
        // ItemSeparatorComponent={() => <View style={{height: 15}} />}
        contentContainerStyle={{  flexGrow: 1, justifyContent: "center", alignItems: "center", gap: 15 }}
        // columnWrapperStyle={{ gap: GAP_BETWEEN_COLUMNS }}
        ListEmptyComponent={() =>
          <View style={styles.containerList}>
            <Text style={styles.emptyListTitle}>
                Список категорий пуст
              </Text>
              <Text style={styles.emptyList}>
                Добавьте новую категорию
              </Text>
          </View>
          
        }
      /> 

      {/* Кнопка Добавить */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={onButtonAdd}
      /> 

      <Portal>
              <Dialog visible={dialog.isVisible} onDismiss={() => hideDialog(dialog.category)}>
                <Dialog.Title>Новая категория</Dialog.Title>
                <Dialog.Content>
                  <TextInput
                    label="Название"
                    placeholder="Введите название"
                    value={categoryTitle}
                    onChangeText={text => setCategoryTitle(text)}
                  />
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => hideDialog(dialog.category)}>Отмена</Button>
                  <Button 
                    onPress={() => addCategory(categoryTitle)}
                  >Добавить
                  </Button>
                </Dialog.Actions>
              </Dialog>
      
              
      </Portal>      
    </SafeAreaView>
  );
}
