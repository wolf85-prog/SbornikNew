import { Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import {Canvas} from "@shopify/react-native-skia";
import Star from "@/components/Star";
import Setka from "@/components/Setka";
import { useLocalSearchParams } from 'expo-router';
import React from 'react'
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { Surface } from "react-native-paper";
import { styles, TabsHeader } from '@/lib'

export default function AccordPage() {
  const db = useSQLiteContext();

  const [titleAcc, setTitleAcc] = useState('');
  const [codeAcc, setCodeAcc] = useState('');
  const [bareAcc, setBareAcc] = useState('');
  const [ladAcc, setLadAcc] = useState('');

  const { accord } = useLocalSearchParams(); 
  
  useEffect(() => {
      console.log("Acc: ", accord)
        
    }, [accord])

  useEffect(() => {
    const fetch = (async()=> {

      await db.withTransactionAsync(async () => {
        const row = await db.getFirstAsync(`SELECT * FROM accord_new WHERE _id=${accord}`);
        console.log("row: ", row)

        setTitleAcc(row.name)
        setCodeAcc(row.code)
      });

    })

    fetch()

  }, []);

  return (
    <Surface style={[styles.screen, styles.container]}>
      <Stack.Screen options={{ 
        headerShown: true, 
        title: titleAcc,
        headerStyle: {backgroundColor: '#19181c'}, 
        headerTintColor: 'white',
        }} 
      />
      <Canvas style={styles.skia}>
        <Setka data={codeAcc}/>
      </Canvas>
    </Surface>
  );
}
