import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import InfinitePager, { Preset } from 'react-native-infinite-pager';
import { useSQLiteContext } from "expo-sqlite";
import { useLocalSearchParams, useRouter } from 'expo-router';

import CardSong from '../../components/ui/CardSong';

const NUM_ITEMS = 15;


import songsData from './../../data/songsData.js';


type MyPagerProps = {
  numberPage: number;
  textSong: string;
  setTitleSong: any;
  setNumberSong: any;
  showSongText: boolean;
};

export default function MyPager({ numberPage, textSong, setTitleSong, setNumberSong, showSongText }: MyPagerProps) {
  const [preset, setPreset] = useState<Preset>(Preset.SLIDE);
  const pagerRef = useRef(null);
  const [songText, setSongText] = useState<any>('');

  const db = useSQLiteContext();

  interface Todo {
    name: string;
    song: string;
    song2: string;
    _id: number;
    number: number;
  }

  const renderPage = useCallback(({ index }: { index: number }) => {

    return (
      <View
        style={[styles.flex, styles.scrollStyle]}>

        <ScrollView style={styles.scrollStyle}>       
          <CardSong style={styles.cardSong}>
            <View style={[styles.slide] }>
              {showSongText ?
              // (songsData[index-1]?.song ? 
              // <AllText text={songsData[index-1]?.song}></AllText> 
              // : '')
              <Text style={{ color: 'black', fontSize: 20 }}>{songsData[index-1]?.song2}</Text>
              :<Text style={{ color: 'black', fontSize: 20 }}>{songsData[index-1]?.song2}</Text>
              }

              {/* <Text style={{ color: 'black', fontSize: 20 }}>
                {songsData[index-1]?.song}
              </Text> */}
            </View>
          </CardSong>        
        </ScrollView>
      </View>
    );
  }, []);

  const changePage = (page: number)=> {
    setTitleSong(songsData[page-1]?.name)
    setNumberSong(songsData[page-1]?.number)
  }

  return (
    <GestureHandlerRootView
      style={[styles.flex, { backgroundColor: 'seashell' }]}>
      <InfinitePager
        key={`infinite-pager-${preset}`}
        ref={pagerRef}
        renderPage={renderPage}
        style={styles.flex}
        pageWrapperStyle={styles.flex}
        preset={preset}
        pageBuffer={1}
        minIndex={1}
        initialIndex={numberPage}
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
    const rowArr = row?.split(chordRegex).map((charOrSpace: any) => {
      if (chordRegex.test(charOrSpace)) {
        //console.log({text: charOrSpace, color: 'blue'} )
        return {text: charOrSpace.trim(), color: 'blue', id: '1', uid: Date.now()} 
      }
      return {text: charOrSpace, color: '', id: '', uid: Date.now(), uid2: Date.now()+1} ;
    });

    //console.log(row)
    return rowArr;
  });

  return (
    <View>
      {parsedText.map((row: any) => (  
        <Text key={row.uid} style={{color: `${row[1]?.color}`, fontSize: 18}}>
           {row.map((item: any)=> (
            
            item?.id ? 
              <Text key={item?.uid2} onPress={()=>router.push(`/home/song/accord/${item?.id}`)}>{item ? item.text : ''}</Text>
              : <Text key={item?.uid2}>{item ? item.text : ''}</Text>
          ))} 
        </Text>
       ) 
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, height: 350 },

  scrollStyle: {
    padding: 5,
  },

  slide: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    
  },

  cardSong: {
    backgroundColor: 'white',
  }
});