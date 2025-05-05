import { MaterialCommunityIcons, Ionicons, Entypo, Feather } from '@expo/vector-icons'
import { Tabs, router } from 'expo-router'
import React from 'react'
import { Appbar, Menu, Tooltip } from 'react-native-paper'
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Locales, TabBar, TabsHeader } from '@/lib'

const TabLayout = () => {
  const [visible, setVisible] = React.useState(false)

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        header: (props) => <TabsHeader navProps={props} children={undefined} />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
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
                  onPress={() => router.push('/(tabs)/settings')}
                />
                <Menu.Item
                  title={Locales.t('stackNav')}
                  leadingIcon="card-multiple-outline"
                  onPress={() => router.push('/modal')}
                />
                <Menu.Item
                  title={Locales.t('drawerNav')}
                  leadingIcon="gesture-swipe"
                  onPress={() => router.push('/drawer')}
                />
              </Menu>
            </>
          ),
          headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />),
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? 'home' : 'home-outline'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: Locales.t('profile'),
          headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />),
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
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? 'account' : 'account-outline'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: Locales.t('titleSettings'),
          headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />),
          headerRight: () => (
            <Tooltip title={Locales.t('drawerNav')}>
              <Appbar.Action
                icon="gesture-swipe"
                onPress={() => router.push('/drawer')}
              />
            </Tooltip>
          ),
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? 'cog' : 'cog-outline'}
            />
          ),
        }}
      />
      <Tabs.Screen
          name="favorites"
          options={{
            title: 'Избранное',
            // headerShown: true,
            headerLeft: (() => <DrawerToggleButton tintColor={'#fff'} />),
            tabBarIcon: (props) => (
              <Entypo 
                {...props}
                size={24}
                name={props.focused ? 'heart' : 'heart-outlined'} 
              />
            ),
          }}
        />
    </Tabs>
  )
}

export default TabLayout
