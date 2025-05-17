import { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { Link } from "expo-router";
import { Stack } from 'expo-router';
import React from 'react'
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import {
  Surface,
  Provider,
  Portal,
  Dialog,
  Button,
  useTheme 
} from "react-native-paper";
import { Locales, ScreenInfo, styles, TabsHeader } from '@/lib'

//import asyncAlert from "./asyncAlert";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { images } from "../../../constants";
//import { ThemeContext } from "./../../../context/ThemeContext.tsx"
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Divider } from 'react-native-paper';

export default function AboutScreen() {
  //const {currentTheme} = useContext(ThemeContext)
  
  return (

    <Surface style={styles.screen}>
      <Stack.Screen options={{ 
          headerShown: true, 
          title: "О приложении", 
          headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />), 
          headerStyle: {backgroundColor: '#26489a'},  
          headerTintColor: 'white',
          header: (props) => <TabsHeader navProps={props} children={undefined} />,
        }} />
            <Content />
    </Surface>
      
  );
}

export function Content() {
  const db = useSQLiteContext();
  const [countSongs, setCountSongs] = useState(0)
  const [countAccords, setCountAccords] = useState(0)

  useEffect(() => {

    const fetch = (async()=> {

      // await db.withTransactionAsync(async () => {
      //   const result = await db.getFirstAsync('SELECT COUNT(*) FROM songs');
      //   console.log('Count:', result.rows[0]['COUNT(*)']);

      //   setCountSongs(result.rows[0]['COUNT(*)']);
      // });

      setCountSongs(612);
      setCountAccords(335)
    })

    fetch()
  }, []);
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
        
          <View style={[styles.container, {paddingLeft: 20, paddingRight: 20}]}>
            <Text style={styles.titleText}>Майкопский молодежный сборник</Text>
            <Image
              style={styles.imageLogo}
              source={images.logo}
              contentFit="cover"
              transition={1000}
            />
            <View style={styles.container}>
              <Text style={styles.customerName}>Версия приложения: <Text style={styles.customerCount}>2.0</Text></Text>
              <Text style={styles.customerName}>Доступно песен: <Text style={styles.customerCount}>{countSongs}</Text></Text>
              <Text style={styles.customerName}>Аккордов в БД: <Text style={styles.customerCount}>{countAccords}</Text></Text>
            </View>

            <Divider style={{ margin: 25, color: 'white', backgroundColor: 'white'}}/>

            <View style={[{flex: 1}, styles.bottom]} />
              <View style={styles.container}>
                <Text style={styles.customerCount}>Майкоп</Text>
                <Text style={styles.customerCount}>2025</Text>
              </View>
          </View>
        
      </SafeAreaView>
  );
}
