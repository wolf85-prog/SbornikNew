import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
//import CarouselPager from 'react-native-carousel-pager';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import InfinitePager, { Preset } from 'react-native-infinite-pager';
import { useSQLiteContext } from "expo-sqlite";

const NUM_ITEMS = 15;

function getColor(i: number) {
    const multiplier = 255 / (NUM_ITEMS - 1);
    const colorVal = Math.abs(i) * multiplier;
    return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
  }

type MyPagerProps = {
  numberPage: number;
  textSong: string;
};

export default function MyPager({ numberPage, textSong }: MyPagerProps) {
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
  console.log("numberPage: ", numberPage)

  useEffect(() => {
    const fetch = (async()=> {

      await db.withTransactionAsync(async () => {
        const row = await db.getFirstAsync<Todo>(`SELECT * FROM songs WHERE _id=${index}`);
        //console.log(index);
        const song = {
          uid: row?._id,
          name: row?.name,
          text: row?.song,
          number: row?.number,
          onlytext: row?.song2,
        };

        setSongText(song.text)
      });
    
    })

    //fetch()
  },[])

  const renderPage = useCallback(({ index }: { index: number }) => {

    return (
      <View
        style={[
          styles.flex,
          {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: getColor(index),
          },
        ]}>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          {index}
        </Text>
      </View>
    );
  }, []);

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
        pageBuffer={4}
        initialIndex={numberPage}
      />
    </GestureHandlerRootView>
  );
}

const Page = ({ index }: { index: number }) => {
  return (
    <View
      style={[
        styles.flex,
        {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: getColor(index),
        },
      ]}>
      <Text style={{ color: 'white', fontSize: 80, fontWeight: 'bold' }}>
        {numberPage}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, height: 350 },
});