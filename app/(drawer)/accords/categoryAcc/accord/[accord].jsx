import { Stack } from "expo-router";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import {Canvas} from "@shopify/react-native-skia";
import Star from "@/components/Star";
import Setka from "@/components/Setka";
import { useLocalSearchParams } from 'expo-router';
import React from 'react'
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { 
  Surface, 
  Appbar, 
  Menu, 
  Tooltip,
  FAB} from "react-native-paper";
import { Locales, ScreenInfo, styles, TabsHeader } from '@/lib'


export default function AccordPage() {
  const db = useSQLiteContext();

  const [titleAcc, setTitleAcc] = useState('');
  const [codeAcc, setCodeAcc] = useState('');
  const [bareAcc, setBareAcc] = useState('');
  const [ladAcc, setLadAcc] = useState('');
  const { accord } = useLocalSearchParams(); 
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
      console.log("codeAcc: ", codeAcc)
        
    }, [codeAcc])

  useEffect(() => {
    setIsLoading(true);

    const fetch = (async()=> {

      await db.withTransactionAsync(async () => {
        const row = await db.getFirstAsync(`SELECT * FROM accord_new WHERE _id=${accord}`);
        console.log("row: ", row)

        setTitleAcc(row.name)
        setCodeAcc(row.code)
      });

    })

    fetch()

    setIsLoading(false);

  }, []);

  if (isLoading) {
      return (
        <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator size={"large"} color="#5500dc"/>
        </View>
      );
  }

  return (
    <Surface style={[styles.screen, styles.container]}>
      <Stack.Screen options={{ 
        headerShown: true, 
        title: titleAcc,
        headerStyle: {backgroundColor: 'rgb(25, 24, 28)'}, 
        headerTintColor: 'white',
        
        }} 
      />
      <Canvas style={styles.skia}>
        <Setka data={codeAcc}/>
      </Canvas>
    </Surface>
  );
}
