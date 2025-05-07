import { router } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import React from 'react'
import { View, Text, Pressable, Image, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Appbar, Menu, Tooltip, useTheme } from 'react-native-paper'

import { DrawerContent, DrawerHeader, Locales } from '@/lib'

const DrawerLayout = () => {
  const theme = useTheme()
  const [visible, setVisible] = React.useState(false)

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => (
          <View style={{flex: 1, padding: 0}}>
            <Image
              style={{height: 215, width: '100%',  marginBottom: 15}}
              source={require('@/assets/images/drawer-header.jpg')}
              resizeMode="cover"
            />
            <Text style={{position: 'absolute', top: 100, left: 20, textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: 16, width: 280, backgroundColor: '#000'}}>
              СБОРНИК МОЛОДЕЖНЫХ ХРИСТИАНСКИХ ПЕСЕН
            </Text>
        
            <DrawerContent
              navProps={props}
              showDivider={false}
              children={undefined}
              title=""
            />
          </View>
        )}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: theme.colors.background,
            paddingTop: 32,
          },
          // header: (props) => (
          //   <DrawerHeader navProps={props} children={undefined} />
          // ),
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: Locales.t('titleHome'),
            title: Locales.t('titleHome'),
            headerRight: () => (
              <>
                <Tooltip title={Locales.t('search')}>
                  <Appbar.Action
                    icon="magnify"
                    onPress={() => router.push('/search')}
                  />
                </Tooltip>
                <Menu
                  statusBarHeight={48}
                  visible={visible}
                  onDismiss={() => setVisible(false)}
                  anchor={
                    <Tooltip title={Locales.t('options')}>
                      <Appbar.Action
                        icon="dots-vertical"
                        onPress={() => setVisible(true)}
                      />
                    </Tooltip>
                  }
                >
                  <Menu.Item
                    title={Locales.t('titleSettings')}
                    leadingIcon="cog"
                    onPress={() => router.push('/modal')}
                  />
                  <Menu.Item
                    title={Locales.t('stackNav')}
                    leadingIcon="card-multiple-outline"
                    onPress={() => router.push('/modal')}
                  />
                  <Menu.Item
                    title={Locales.t('drawerNav')}
                    leadingIcon="gesture-swipe"
                    onPress={() => router.push('/modal')}
                  />
                </Menu>
              </>
            ),
          }}
        />
        {/* <Drawer.Screen
          name="about"
          options={{
            drawerLabel: Locales.t('profile'),
            title: Locales.t('profile'),
            headerRight: () => (
              <>
                <Tooltip title={Locales.t('search')}>
                  <Appbar.Action
                    icon="magnify"
                    onPress={() => router.push('/search')}
                  />
                </Tooltip>
                <Tooltip title={Locales.t('titleSettings')}>
                  <Appbar.Action
                    icon="cog"
                    onPress={() => router.push('/(tabs)/settings')}
                  />
                </Tooltip>
              </>
            ),
          }}
        /> */}
        {/* <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: Locales.t('titleSettings'),
            title: Locales.t('titleSettings'),
            headerRight: () => (
              <Tooltip title={Locales.t('stackNav')}>
                <Appbar.Action
                  icon="card-multiple-outline"
                  onPress={() => router.push('/modal')}
                />
              </Tooltip>
            ),
          }}
        /> */}
      </Drawer>
    </GestureHandlerRootView>
  )
}

export default DrawerLayout
