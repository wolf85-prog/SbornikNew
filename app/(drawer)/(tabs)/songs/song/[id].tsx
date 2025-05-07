import React, {useEffect, useRef, useState, useMemo, Fragment} from 'react';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar, View, StyleSheet, SafeAreaView, ActivityIndicator, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome, Entypo, MaterialCommunityIcons, SimpleLineIcons, Fontisto } from '@expo/vector-icons';
import { Stack } from "expo-router";
import CardSong from '../../../../../components/ui/CardSong';
import { Button, Dialog, Portal, TextInput, Text, Snackbar } from 'react-native-paper';
//import Slider from '@react-native-community/slider';

import songsData from './../../../../../data/songsData.js';
import { PAGES, createPage } from './../../../../../constants/utils';
import { images } from "../../../../../constants";
import { COLORS } from '../../../../../constants/colors.js';
import { useSQLiteContext } from "expo-sqlite";
import {
  Provider,
} from "react-native-paper";
import { ScrollView } from 'react-native-gesture-handler';

import PopupMenu from "../../../../../components/ui/PopupMenu.js";

import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
//import { usePagerView } from 'react-native-pager-view';
//const { AnimatedPagerView, ref, ...rest } = usePagerView({ pagesAmount: 10 });

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

// массив слов для выделения
const selectedWords = ["Hm", "D", "E"]
const chordRegex = /([A-G]{1}[A-Gmjsu0-9/#]{0,4})(?!\w)/g;


const data = [
  {
    title: "Добавить в плейлист",
    action: ()=>alert('dffdf')
  },
  {
      title: "Добавить в категорию",
      action: ()=>alert('dffdf')
  },
  {
      title: "Добавить заметку",
      action: ()=>alert('dffdf')
  },
  {
      title: "Тональность",
      action: ()=>alert('dffdf')
  },
  {
      title: "Размер шрифта",
      action: ()=>alert('dffdf')
  },
  {
    title: "Настройки",
    action: ()=>alert('dffdf')
},
]


export default function DetailsScreen() {

  const db = useSQLiteContext();
  
  const [songs, setSongs] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<any>({});
  const [songId, setSongId] = useState<any>('');
  const [songName, setSongName] = useState<any>('');
  const [songText, setSongText] = useState<any>('');
  const [songOnlyText, setSongOnlyText] = useState<any>('');

  const [showSongText, setShowSongText] = useState(true);
  
  const [visibleNumber, setVisibleNumber] = useState(false);
  const [songNumber, setSongNumber] = useState<any>('');
  const [separators, setSeparators] = useState<any>([])

  const [visiblePlaylist, setVisiblePlaylist] = useState(false);

  const [visibleFontSize, setVisibleFontSize] = useState(false);
  const [textSize, setTextSize] = useState<any>(15);

  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const scrollOfset = useScrollViewOffset(scrollRef)

  

  const hideDialog = () => setVisibleNumber(false);

  const imageAnimatedStyle = useAnimatedStyle(()=> {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOfset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          )
        },
        {
          scale: interpolate(
            scrollOfset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        }
      ]
    }
  })

  const headerAnimatedStyle = useAnimatedStyle(()=> {
    return {
      opacity: interpolate(scrollOfset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    }
  })

  const [title, setTitle] = useState<any>('');
  const { id } = useLocalSearchParams(); 

  useEffect(() => {
    setTitle(id)
  }, [id])


  useEffect(() => {
    setIsLoading(true);

    const fetch = (async()=> {
      let pages = []//new Array(555);
      await db.withTransactionAsync(async () => {
        const row = await db.getFirstAsync<Todo>(`SELECT * FROM songs WHERE _id=${id}`);
        //for (const row of allRows) {
          //console.log(row?.number, row?.name);

          const song = {
            uid: row?._id,
            name: row?.name,
            text: row?.song,
            number: row?.number,
            onlytext: row?.song2,
          };

          //pages[Number(row?._id)-1] = song
          pages.push(song)
   
        //}

        //console.log(pages)
        setSongName(song.name)
        setSongs(pages);

      });
    
    })

    setIsLoading(false);

    fetch()
  }, []);
  

  if (isLoading) {
      return (
        <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator size={"large"} color="#5500dc"/>
        </View>
      );
  }



  interface Todo {
    name: string;
    song: string;
    song2: string;
    _id: number;
    number: number;
  }

  const headerRight = () => {
        return (
          <>

            <TouchableOpacity
              // onPress={()=>router.push("/modal")}
              onPress={()=>setVisibleFontSize(true)}
              style={{marginRight: 20}}
            >
              <Entypo name="note" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={()=>setVisibleNumber(true)}
              style={{marginRight: 20}}
            >
              <Entypo name="dial-pad" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              // onPress={()=>router.push("/modal")}
              style={{marginRight: 20}}
            >
              <SimpleLineIcons name="size-fullscreen" size={20} color="white" />
            </TouchableOpacity>

            <PopupMenu options={data} color={"white"}/>
          </>
          
        );
  };

  const onButtonPress = ()=> {
    console.log("press")
  }

  const onChangeSong = ()=> {
    console.log("change")
    setShowSongText(!showSongText)
    
  }




  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        headerTransparent: true,
        headerBackground: ()=> <Animated.View style={[styles.header, headerAnimatedStyle]} />,
        headerShown: true, 
        title: `№ ${title}` ,
        headerTintColor: '#fff',
        headerRight: headerRight,
        }} 
      />

      <Provider>
        <SafeAreaView style={styles.container}> 
          <StatusBar
            animated={true}
            backgroundColor= {COLORS.darkBlue}
            //barStyle={statusBarStyle}
            //showHideTransition={statusBarTransition}
            //hidden={hidden}
          />
          <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
            <Image 
              style={[styles.image, imageAnimatedStyle]}
              source={images.headerSong}
              resizeMode="cover"
            />
            <View style={{position: 'absolute', top: 80, width: '100%', padding: 15}}>
              <Text style={[styles.title,]}>{songName}</Text>
            </View>

            <View style={{position: 'absolute', top: 140, width: '100%', padding: 15}}>
              <Text style={[styles.title, {fontSize: 16}]}>Без категории</Text>
            </View>

            <View style={{position: 'absolute', top: 220, left: -140, width: '100%', padding: 15}}>
              <Text style={[styles.title, {fontSize: 34}]}>№ {title}</Text>
            </View>

            {/* Убрать тон */}
            <TouchableOpacity
                style={styles.floatingButtonBemol}
                onPress={onButtonPress}
            >
              <MaterialCommunityIcons name="music-accidental-flat" size={30} color="white" />
            </TouchableOpacity> 

            {/* Убрать аккорды */}
            <TouchableOpacity
                style={styles.floatingButtonNote}
                onPress={onChangeSong}
            >
              <Entypo name="note" size={30} color="white" />
            </TouchableOpacity> 

            {/* Добавить тон */}
            <TouchableOpacity
                style={styles.floatingButtonDiez}
                onPress={onButtonPress}
            >
              <Fontisto name="hashtag" size={20} color="white" />
            </TouchableOpacity>

            <View style={{height: 1000}}>

            </View>

          </Animated.ScrollView>  

          

          {/* Добавить в  избранное */}
          <TouchableOpacity
              style={styles.floatingButton}
              onPress={onButtonPress}
          >
            <Ionicons name="heart-circle-outline" size={60} color="#DE3163" />
            {/* <Ionicons name="heart-circle-sharp" size={80} color="red" /> */}
          </TouchableOpacity> 

          <Dialog visible={visibleNumber} onDismiss={hideDialog}>
              <Dialog.Content>
                <Text variant="bodyMedium">Введите номер в данном сборнике, на который желаете перейти</Text>
                      <TextInput
                        label="Номер"
                        placeholder="1-555"
                        value={songNumber}
                        onChangeText={text => setSongNumber(text)}
                      />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setVisibleNumber(false)}>Отмена</Button>
                <Button onPress={() => setVisibleNumber(false)}>ОК</Button>
              </Dialog.Actions>
          </Dialog>
 
          <Dialog visible={visiblePlaylist} onDismiss={hideDialog}>
              <Dialog.Title>Добавить в плейлист</Dialog.Title>
              <Dialog.Content>
                <Text>...</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setVisiblePlaylist(false)}>Отмена</Button>
                <Button onPress={() => setVisiblePlaylist(false)}>ОК</Button>
              </Dialog.Actions>
          </Dialog>
  
          <Dialog visible={visibleFontSize} onDismiss={hideDialog}>
              <Dialog.Title>Размер текста</Dialog.Title>
              <Dialog.Content>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.text}>{textSize}</Text>

                </View>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setVisibleFontSize(false)}>Отмена</Button>
                <Button onPress={() => setVisibleFontSize(false)}>ОК</Button>
              </Dialog.Actions>
          </Dialog>

        </SafeAreaView>
      </Provider>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    backgroundColor: COLORS.darkBlue,
    height: 100,
  },
  scrollStyle: {
    padding: 5,
  },
  slide: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  image: {
    width: width, 
    height: IMG_HEIGHT,
    //marginVertical: 32,
  },
  text: {
    color: 'rgba(0, 0, 0, 0.8)',
    textAlign: 'left',
  },
  title: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  pagerView: {
    flex: 1,
    backgroundColor: '#e5e5e5',
  },
  floatingButton: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    right: 0,
  },

  floatingButtonNote: {
    backgroundColor:'#DE3163',
    borderRadius:'50%',
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    top: 270,
    right: 90,
    zIndex: 100,
  },

  floatingButtonBemol: {
    backgroundColor:'#DE3163',
    borderRadius:'50%',
    position: 'absolute',
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    top: 280,
    right: 170,
    zIndex: 100,
  },

  floatingButtonDiez: {
    backgroundColor:'#DE3163',
    borderRadius:'50%',
    position: 'absolute',
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    top: 280,
    right: 20,
    zIndex: 100,
  },

  chordName: {
    color: 'red',
  }
});