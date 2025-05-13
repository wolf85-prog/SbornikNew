import React, {useEffect, useRef, useState, useMemo, Fragment} from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar, View, StyleSheet, SafeAreaView, ActivityIndicator, Image, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Ionicons, FontAwesome, Entypo, MaterialCommunityIcons, SimpleLineIcons, Fontisto } from '@expo/vector-icons';
import { Stack } from "expo-router";
import CardSong from '../../../../../components/ui/CardSong';
import { Button, Dialog, Portal, TextInput,  Snackbar, RadioButton } from 'react-native-paper';
import Slider from '@react-native-community/slider';
//import {Slider} from '@miblanchard/react-native-slider';
import MyPager from './../../../../../components/ui/MyPager'


import songsData from './../../../../../data/songsData.js';
import { PAGES, createPage } from './../../../../../constants/utils';
import { images } from "../../../../../constants";
import { COLORS } from '../../../../../constants/colors.js';
import { useSQLiteContext } from "expo-sqlite";
import {
  Surface, 
  Appbar, 
  Menu, 
  Tooltip,
} from "react-native-paper";
import { Locales, ScreenInfo, styles, TabsHeader } from '@/lib'

import { ScrollView } from 'react-native-gesture-handler';

import PopupMenu from "../../../../../components/ui/PopupMenu.js";

//import PagerView from 'react-native-pager-view';
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
//import { usePagerView } from 'react-native-pager-view';
//const { AnimatedPagerView, ref, ...rest } = usePagerView({ pagesAmount: 10 });

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

const MIN_HEIGHT = 10;
const MAX_HEIGHT = 50;



export default function DetailsScreen() {

  const db = useSQLiteContext();

  const { id } = useLocalSearchParams();

  const router = useRouter();

  const [title, setTitle] = useState<any>('');  
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
  const [playlistName, setPlaylistName] = useState<any>('');
  const [categoryName, setCategoryName] = useState<any>('');
  const [noteText, setNoteText] = useState<any>('');
  const [songTone, setSongTone] = useState<any>(0);
  const [separators, setSeparators] = useState<any>([])

  const [visiblePlaylist, setVisiblePlaylist] = useState(false);
  const [visibleNewPlaylist, setVisibleNewPlaylist] = useState(false);

  const [visibleCategory, setVisibleCategory] = useState(false);
  const [visibleNewCategory, setVisibleNewCategory] = useState(false);
  const [visibleNewNote, setVisibleNewNote] = useState(false);
  const [visibleTone, setVisibleTone] = useState(false);

  const [visibleFontSize, setVisibleFontSize] = useState(false);
  const [textSize, setTextSize] = useState(15);

  //const sliderRef = useRef<PagerView>(null);
  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const scrollOfset = useScrollViewOffset(scrollRef)

  const [showFullPage, setShowFullPage] = useState(false);

  const [visibleSnackBar, setVisibleSnackBar] = useState(false);
  
  
  
  const data = [
    {
      title: "Добавить в плейлист",
      action: ()=>setVisiblePlaylist(true)
    },
    {
        title: "Добавить в категорию",
        action: ()=>setVisibleCategory(true)
    },
    {
        title: "Добавить заметку",
        action: ()=>setVisibleNewNote(true)
    },
    {
        title: "Тональность",
        action: ()=>setVisibleTone(true)
    },
    {
        title: "Размер шрифта",
        action: ()=>setVisibleFontSize(true)
    },
    {
      title: "Настройки",
      action: ()=>router.push("/settings")
  },
  ]

  const hideDialog = () => setVisibleNumber(false);
  const hideDialogNewPlaylst = () => setVisibleNewPlaylist(false);
  const hideDialogNewCategory = () => setVisibleNewCategory(false);
  const hideDialogNewNote = () => setVisibleNewNote(false);
  const hideDialogTone = () => setVisibleTone(false);

  const onToggleSnackBar = () => setVisibleSnackBar(!visibleSnackBar);
  const onDismissSnackBar = () => setVisibleSnackBar(false);

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

  

  useEffect(() => {
    console.log("id: ", id)
    setTitle(id)
    setSongId(id)
  }, [id])

  
  useEffect(() => {
      setIsLoading(true);
  
      const fetch = (async()=> {

          const resSong = songsData.find(item => item._id === Number(id))
          setSongName(resSong ? resSong.name : '')
          setSongs(songsData);
      
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
              onPress={onChangeSong}
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
              onPress={()=>setShowFullPage(true)}
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
    console.log(!showSongText)
    setShowSongText(!showSongText)
    
  }

  


  return (
    <Surface style={styles.screen}>
      <Stack.Screen options={{ 
        headerTransparent: true,
        headerBackground: ()=> <Animated.View style={[styles.header, headerAnimatedStyle]} />,
        headerShown: true, 
        title: `№ ${title}` ,
        headerTintColor: '#fff',
        headerRight: headerRight,
        }} 
      />


        <SafeAreaView style={[styles.screen, {backgroundColor: '#000'}]}> 
          <StatusBar
            animated={true}
            backgroundColor= {COLORS.black}
            //barStyle={statusBarStyle}
            //showHideTransition={statusBarTransition}
            //hidden={hidden}
          />
          {!showFullPage ? 
          <>
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
              <MyPager
                numberPage={songId} 
                textSong={songText}
                setTitleSong={setSongName}
                setNumberSong={setTitle}
                showSongText={showSongText}
                textSize={textSize}
              />

              {/* <PagerView
                ref={sliderRef}
                testID="pager-view"
                style={styles.pagerView}
                initialPage={3}
                pageMargin={10}
                onPageScroll={onPageScroll}
                onPageSelected={onPageSelected}
                onPageScrollStateChanged={onPageScrollStateChanged}
              > */}
                {/* {songs.map((page: any) => (
                  <View key={page.uid} collapsable={false}>      
                    <ScrollView style={styles.scrollStyle}>       
                      <CardSong>
                        <View style={[styles.slide] }>
                         {showSongText ?
                          <AllText text={page.text}></AllText>
                          :<Text style={[styles.text, {fontSize: 18}]}>{page.onlytext}</Text>
                         }
                        </View>
                      </CardSong>        
                    </ScrollView>
                  </View>
                  )
                )} */}
              {/* </PagerView> */}
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
                <Text>Введите номер в данном сборнике, на который желаете перейти</Text>
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
                <Button onPress={() => {
                  setVisibleNewPlaylist(true)
                  setVisiblePlaylist(false)
                }}>Новый</Button>

                <Button onPress={() => setVisiblePlaylist(false)}>Отмена</Button>
                <Button onPress={() => setVisiblePlaylist(false)}>ОК</Button>
              </Dialog.Actions>
          </Dialog>

          <Dialog visible={visibleNewPlaylist} onDismiss={hideDialogNewPlaylst}>
              <Dialog.Title>Новый</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  label="Введите название"
                  placeholder="Введите название"
                  value={playlistName}
                  onChangeText={text => setPlaylistName(text)}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setVisibleNewPlaylist(false)}>Отмена</Button>
                <Button onPress={() => setVisibleNewPlaylist(false)}>Добавить</Button>
              </Dialog.Actions>
          </Dialog>

          {/* Добавить в категорию */}
          <Dialog visible={visibleCategory} onDismiss={hideDialog}>
              <Dialog.Title>Добавить в категорию</Dialog.Title>
              <Dialog.Content>
                <Text>...</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => {
                  setVisibleNewCategory(true)
                  setVisibleCategory(false)
                }}>Новая категория</Button>
                
                <Button onPress={() => setVisibleCategory(false)}>Отмена</Button>
                <Button onPress={() => setVisibleCategory(false)}>ОК</Button>
              </Dialog.Actions>
          </Dialog>

          <Dialog visible={visibleNewCategory} onDismiss={hideDialogNewCategory}>
              <Dialog.Title>Новая категория</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  label="Введите название"
                  placeholder="Введите название"
                  value={categoryName}
                  onChangeText={text => setCategoryName(text)}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setVisibleNewCategory(false)}>Отмена</Button>
                <Button onPress={() => setVisibleNewCategory(false)}>Добавить</Button>
              </Dialog.Actions>
          </Dialog>

          {/* Добавить заметку */}
          <Dialog visible={visibleNewNote} onDismiss={hideDialogNewNote}>
              <Dialog.Title>Новая заметка</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  label="Введите текст"
                  placeholder="Введите текст"
                  value={noteText}
                  onChangeText={text => setNoteText(text)}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setVisibleNewNote(false)}>Отмена</Button>
                <Button onPress={() => {
                  setVisibleNewNote(false)
                  onToggleSnackBar()
                  }}>Добавить</Button>
              </Dialog.Actions>
          </Dialog>

          {/* Тональность */}
          <Dialog visible={visibleTone} onDismiss={hideDialogTone}>
              <Dialog.Title>Выберите тональность</Dialog.Title>
              <Dialog.Content>
                <ScrollView>
                  <View style={styles.rowTone}>
                    <Text style={styles.textTone}>0 Dm</Text>
                    <RadioButton
                      value="0"
                      status={ songTone === '0' ? 'checked' : 'unchecked' }
                      onPress={() => setSongTone('0')}
                    />
                  </View>

                  <View style={styles.rowTone}>
                    <Text style={styles.textTone}>+1 D#m</Text>
                    <RadioButton
                      value="1"
                      status={ songTone === '1' ? 'checked' : 'unchecked' }
                      onPress={() => setSongTone('1')}
                    />
                  </View>   
                </ScrollView>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => {
                  setVisibleTone(false)

                  }}>Отмена</Button>
              </Dialog.Actions>
          </Dialog>
  
          <Dialog visible={visibleFontSize} onDismiss={hideDialog}>
              <Dialog.Title>Размер текста</Dialog.Title>
              <Dialog.Content>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.text}>{textSize}</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={10}
                    maximumValue={50}
                    minimumTrackTintColor="#9a5871"
                    maximumTrackTintColor="#000000"
                    step={1}
                    onValueChange={(value) => setTextSize(value)}
                    value={textSize}
                  />   
                </View>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setVisibleFontSize(false)}>Отмена</Button>
                <Button onPress={() => setVisibleFontSize(false)}>ОК</Button>
              </Dialog.Actions>
          </Dialog>
          </>

          // Текст песни без аккордов
          :<ScrollView>
            <View style={{height: 1000}}>
              <MyPager
                numberPage={songId} 
                textSong={songText}
                setTitleSong={setSongName}
                setNumberSong={setTitle}
                showSongText={showSongText}
                textSize={textSize}
              />
            </View>
          </ScrollView>
          
          }


          <Snackbar
            visible={visibleSnackBar}
            onDismiss={onDismissSnackBar}
            action={{
              label: 'Отмена',
              onPress: () => {
                // Do something
              },
            }}>
            Заметка добавлена
          </Snackbar>

        </SafeAreaView>
    </Surface>
  );
}



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   page: {
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   header: {
//     backgroundColor: COLORS.darkBlue,
//     height: 100,
//   },
//   scrollStyle: {
//     padding: 5,
//   },
//   slide: {
//     flex: 1,
//     alignItems: 'flex-start',
//     justifyContent: 'flex-start',
//     backgroundColor: 'white',
//   },
//   image: {
//     width: width, 
//     height: IMG_HEIGHT,
//     //marginVertical: 32,
//   },
//   text: {
//     color: 'rgba(0, 0, 0, 0.8)',
//     textAlign: 'left',
//   },
//   title: {
//     fontSize: 22,
//     color: 'rgba(255, 255, 255, 0.8)',
//     textAlign: 'center',
//   },

//   floatingButton: {
//     position: 'absolute',
//     width: 100,
//     height: 100,
//     alignItems: 'center',
//     justifyContent: 'center',
//     bottom: 0,
//     right: 0,
//   },

//   floatingButtonNote: {
//     backgroundColor:'#DE3163',
//     borderRadius:'50%',
//     position: 'absolute',
//     width: 60,
//     height: 60,
//     alignItems: 'center',
//     justifyContent: 'center',
//     top: 270,
//     right: 90,
//     zIndex: 100,
//   },

//   floatingButtonBemol: {
//     backgroundColor:'#DE3163',
//     borderRadius:'50%',
//     position: 'absolute',
//     width: 45,
//     height: 45,
//     alignItems: 'center',
//     justifyContent: 'center',
//     top: 280,
//     right: 170,
//     zIndex: 100,
//   },

//   floatingButtonDiez: {
//     backgroundColor:'#DE3163',
//     borderRadius:'50%',
//     position: 'absolute',
//     width: 45,
//     height: 45,
//     alignItems: 'center',
//     justifyContent: 'center',
//     top: 280,
//     right: 20,
//     zIndex: 100,
//   },

//   chordName: {
//     color: 'red',
//   },

//   rowTone: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexDirection: 'row',
//     width: '90%',
//     marginLeft: 25,
//   },

//   textTone: {
//     color: '#fff',
//   },

//   slider: {
//     width: 300,
//     opacity: 1,
//     marginTop: 10,
//   },
// });