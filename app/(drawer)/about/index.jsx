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
  IconButton,
  Provider,
  Portal,
  Dialog,
  Button,
} from "react-native-paper";
//import asyncAlert from "./asyncAlert";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { images } from "../../../constants";
//import { ThemeContext } from "./../../../context/ThemeContext.tsx"
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Divider } from 'react-native-paper';

export default function AboutScreen() {
  //const {currentTheme} = useContext(ThemeContext)
  
  return (

    <View style={styles.container} >
      <Stack.Screen options={{ 
          headerShown: true, 
          title: "О приложении", 
          headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />), 
          headerStyle: {backgroundColor: '#26489a'},  
          headerTintColor: 'white',
        }} />
        <Provider>
          <SQLiteProvider databaseName="sbornik.db" assetSource={{ assetId: require('./../../../assets/sbornik.db') }}>
            <Content />
          </SQLiteProvider>
        </Provider>
    </View>
      
  );
}

export function Content() {
  const db = useSQLiteContext();
  const [countSongs, setCountSongs] = useState(0)

  useEffect(() => {

    const fetch = (async()=> {

      await db.withTransactionAsync(async () => {
        const result = await db.getFirstAsync('SELECT COUNT(*) FROM songs');
        console.log('Count:', result.rows[0]['COUNT(*)']);

        setCountSongs(result.rows[0]['COUNT(*)']);
      });
    })

    fetch()
  }, []);
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
        
          <View style={styles.container}>
            <Text style={styles.titleText}>Майкопский молодежный сборник</Text>
            <Image
              style={styles.image}
              source={images.logo}
              contentFit="cover"
              transition={1000}
            />
            <View>
              <Text style={styles.customerName}>Версия приложения: 2.0</Text>
              <Text style={styles.customerName}>Доступно песен: {countSongs}</Text>
              <Text style={styles.customerName}>Аккордов в БД: {countSongs}</Text>
            </View>

            {/* <View
              style={{
                borderBottomColor: '#000',
                borderBottomWidth: 1,
              }}
            /> */}
            <Divider />

            <View style={{flex: 1}} />

            <View style={styles.container}>
              <Text>Майкоп</Text>
              <Text>2025</Text>
            </View>
          </View>
        
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
    alignItems: "center",
  },
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 20,
  },
  customer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  customerName: {
    fontSize: 18,
  },
  buttonStyle: {
    fontSize: 16,
    color: "white",
    backgroundColor: "green",
    padding: 5,
    marginTop: 32,
    minWidth: 250,
    marginBottom: 16,
  },
  buttonTextStyle: {
    padding: 5,
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  textInputStyle: {
    textAlign: "center",
    height: 40,
    fontSize: 18,
    width: "100%",
    borderWidth: 1,
    borderColor: "green",
  },
  icons: {
    flexDirection: "row",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20
  }
});