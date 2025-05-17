import { MaterialCommunityIcons } from '@expo/vector-icons'
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono'
import { NotoSans_400Regular } from '@expo-google-fonts/noto-sans'
import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import * as Localization from 'expo-localization'
import { SplashScreen, Stack } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Platform, useColorScheme } from 'react-native'
import { adaptNavigationTheme, PaperProvider } from 'react-native-paper'

import { Locales, Setting, StackHeader, Themes } from '@/lib'
import * as SQLite from 'expo-sqlite';
import { SQLiteDatabase, SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import songsData from './../data/songsData.js';

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from 'expo-router'

// Ensure that reloading on `/modal` keeps a back button present.
export const unstable_settings = { 
  initialRouteName: '(drawer)' 
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  const [loaded, error] = useFonts({
    NotoSans_400Regular,
    JetBrainsMono_400Regular,
    ...MaterialCommunityIcons.font,
  })

  //const db = useSQLiteContext();

  // Load db songs
  React.useEffect(() => {
    
    const fetch = async()=> {
      const my_db4 = await SQLite.openDatabaseAsync('myLocalDatabase4', 	{
                  useNewConnection: true
              });

        await my_db4.execAsync(`
          DROP TABLE IF EXISTS songs;
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS songs (id INTEGER PRIMARY KEY NOT NULL, 
          uid TEXT, 
          favorite INTEGER NOT NULL, 
          font TEXT NOT NULL, 
          name TEXT NOT NULL,
          number INTEGER NOT NULL,
          song TEXT NOT NULL,
          song2 TEXT NOT NULL,
          song_accord INTEGER NOT NULL,
          song_temp TEXT,
          song_ton TEXT NOT NULL);
        `);

      //const allRows = await my_db4.getAllAsync('SELECT * FROM songs');
      //console.log("Загрузка песен из ДБ", allRows.length)
      
      songsData.map(async(item)=> {
            await my_db4.runAsync('INSERT INTO songs (favorite, font, name, number, song, song2, song_accord, song_temp, song_ton) VALUES (?,?,?,?,?,?,?,?,?)', 
              item.favorite, 
              item.font, 
              item.name, 
              item.number, 
              item.song, 
              item.song2,
              item.song_accord, 
              item.song_temp, 
              item.song_ton
            );
      })
          

      const allRows = await my_db4.getAllAsync('SELECT * FROM songs');
      console.log("Загрузка песен из ДБ", allRows.length)
    }

    fetch()
    
  }, [])

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  React.useEffect(() => {
    if (error) throw error
  }, [error])

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

const RootLayoutNav = () => {
  const colorScheme = useColorScheme()
  const [settings, setSettings] = React.useState<Setting>({
    theme: 'dark',
    color: 'default',
    language: 'auto',
  })

  

  // Load settings from the device
  React.useEffect(() => {
    if (Platform.OS !== 'web') {
      SecureStore.getItemAsync('settings').then((result) => {
        if (result === null) {
          SecureStore.setItemAsync('settings', JSON.stringify(settings)).then(
            (res) => console.log(res),
          )
        }

        setSettings(JSON.parse(result ?? JSON.stringify(settings)))
      })
    } else {
      setSettings({ ...settings, theme: colorScheme ?? 'light' })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (settings.language === 'auto') {
      Locales.locale = Localization.getLocales()[0].languageCode ?? 'ru'
    } else {
      Locales.locale = settings.language
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const theme =
    Themes[
      settings.theme === 'auto' ? (colorScheme ?? 'dark') : settings.theme
    ][settings.color]

  const { DarkTheme, LightTheme } = adaptNavigationTheme({
    reactNavigationDark: NavDarkTheme,
    reactNavigationLight: NavLightTheme,
    materialDark: Themes.dark[settings.color],
    materialLight: Themes.light[settings.color],
  })

  return (
    <ThemeProvider
      value={
        colorScheme === 'light'
          ? { ...LightTheme, fonts: NavLightTheme.fonts }
          : { ...DarkTheme, fonts: NavDarkTheme.fonts }
      }
    >
      <SQLiteProvider databaseName="sbornik.db" assetSource={{ assetId: require('./../assets/sbornik.db') }}>
        <PaperProvider theme={theme}>
              <Stack
                screenOptions={{
                  animation: 'slide_from_bottom',
                  header: (props) => (
                    <StackHeader navProps={props} children={undefined} />
                  ),
                }}
              >
                <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="search"
                  options={{ title: Locales.t('search') }}
                />
                <Stack.Screen
                  name="modal"
                  options={{ title: Locales.t('titleModal'), presentation: 'modal' }}
                />
              </Stack>
          </PaperProvider>
      </SQLiteProvider>
            

      <StatusBar style="auto" />
    </ThemeProvider>
  )
}

export default RootLayout
