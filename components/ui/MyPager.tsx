import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import InfinitePager, { InfinitePagerImperativeApi, Preset } from 'react-native-infinite-pager';
import { useSQLiteContext } from "expo-sqlite";
import { useLocalSearchParams, useRouter } from 'expo-router';

import CardSong from '../../components/ui/CardSong';

import songsData from './../../data/songsData.js';

type MyPagerProps = {
  numberPage: number;
  textSong: string;
  setTitleSong: any;
  setNumberSong: any;
  showSongText: boolean;
  textSize: number;
  setShowFullPage: any;
  selectedPage: number;
  setSelectedPage: any;
};


export default function MyPager({ numberPage, textSong, setTitleSong, setNumberSong, showSongText, textSize, setShowFullPage, selectedPage, setSelectedPage }: MyPagerProps) {
  const [preset, setPreset] = useState<Preset>(Preset.SLIDE);
  const pagerRef = useRef<InfinitePagerImperativeApi>(null);
  const [songText, setSongText] = useState<any>('');


  function getTextSong(page: number, show: boolean) {
    let text = ''
    show ? text = songsData[page-1]?.song2
    : text = songsData[page-1]?.song
    return text
  }   

  useEffect(()=> {
      console.log("selectedPage: ", selectedPage)

      if (selectedPage) {
        const timeout = setTimeout(() => {
          pagerRef.current?.setPage(selectedPage, {animated: false})
        }, 300);

        return () => clearTimeout(timeout);
      }
      
      setTitleSong(songsData[selectedPage-1]?.name)
      setNumberSong(songsData[selectedPage-1]?.number)

  }, [selectedPage])


  const renderPage = useCallback(({index}: {index: number}, showSongText: boolean, textSize: number, selectedPage: number) => {

    return (
      <View
        style={[styles.flex, styles.scrollStyle]}>

        <ScrollView style={styles.scrollStyle}>       
          <CardSong style={styles.cardSong}>
            <View style={[styles.slide] }>
              {
              (songsData[index-1]?.song ? 
                <AllText text={songsData[index-1]?.song}></AllText> 
              : '')

              // <Text onPress={()=>setShowFullPage(false)} style={{ color: 'white', fontSize: textSize }}>
              //   {
              //     getTextSong(index, showSongText)
              //   }
              // </Text>
          
              }

            </View>
          </CardSong>        
        </ScrollView>
      </View>
    );
  }, []);

  const changePage = (page: number)=> {
    setTitleSong(songsData[page-1]?.name)
    setNumberSong(songsData[page-1]?.number)
    console.log("change page: ", page)
    //setSelectedPage(0)
  }

  return (
    <GestureHandlerRootView
      style={[styles.flex, { backgroundColor: 'seashell' }]}>
      <InfinitePager
        key={`infinite-pager-${preset}`}
        ref={pagerRef}
        renderPage={(i)=>renderPage(i, showSongText, textSize, selectedPage)}
        style={styles.flex}
        pageWrapperStyle={styles.flex}
        preset={preset}
        pageBuffer={4}
        minIndex={1}
        initialIndex={Number(numberPage)}
        onPageChange={(page)=>changePage(page)}
      />
    </GestureHandlerRootView>
  );
}

// это компонент для всего текста
const AllText = ({text}: any) => {

  const router = useRouter();

  // массив слов для выделения
  const chordRegex = /([A-G]{1}[A-Gmjsu0-9/#]{0,4})(?!\w)/g;

  const [separators, setSeparators] = useState([])

  const parsedText = text?.split("\n").map((row: any) => {
    const rowArr = row?.split(chordRegex).map((charOrSpace: any, index: number) => {
      if (chordRegex.test(charOrSpace)) {
        //console.log({text: charOrSpace, color: 'blue'} )
        return {text: charOrSpace.trim(), color: 'blue', id: '1', uid: index} 
      }
      return {text: charOrSpace, color: 'white', id: '', uid: index} ;
    });

    //console.log(rowArr)
    return rowArr;
  });

  return (
    <View>
      {parsedText.map((row: any) => (  
        <Text key={row.uid} style={{color: `${row[1]?.color}`, fontSize: 18}}>
           {row.map((item: any)=> (
            //console.log(item)
            item?.id ? 
              <Text key={item?.uid2} onPress={()=>router.push(`/home/song/accord/${item?.id}`)}>{item ? item.text : ''}</Text>
              : <Text style={{color: 'white'}} key={item?.uid2}>{item ? item.text : ''}</Text>
          ))} 
        </Text>
       ) 
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  flex: { 
    flex: 1,
    backgroundColor: '#3e3b3e'
  },

  scrollStyle: {
    padding: 5,
  },

  slide: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    
  },

  cardSong: {
    backgroundColor: '#5b585b',
  }
});