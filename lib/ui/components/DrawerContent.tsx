import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { router } from 'expo-router'
import React from 'react'
import { Drawer, DrawerSectionProps } from 'react-native-paper'

import { Locales } from '@/lib/locales'

interface DrawerContentProps extends DrawerSectionProps {
  navProps: DrawerContentComponentProps
}

const DrawerContent = (props: DrawerContentProps) => (
  <Drawer.Section {...props}>
    {/* <Drawer.Item
      label={Locales.t('goHome')}
      icon="arrow-left"
      onPress={() => router.replace('/')}
    /> */}
    <Drawer.Item
      label={Locales.t('titleHome')}
      icon="home"
      active={props.navProps.state.index === 0}
      onPress={() => router.push('/(drawer)/(tabs)/home')}
    />
    <Drawer.Item
      label={Locales.t('titleFavorites')}
      icon="account"
      active={props.navProps.state.index === 1}
      onPress={() => router.push('/(drawer)/favorites')}
    />
    <Drawer.Item
      label={Locales.t('category')}
      icon="account"
      active={props.navProps.state.index === 2}
      onPress={() => router.push('/(drawer)/categories')}
    />   
    <Drawer.Item
      label={Locales.t('accords')}
      icon="account"
      active={props.navProps.state.index === 3}
      onPress={() => router.push('/(drawer)/accords')}
    />
    <Drawer.Item
      label={Locales.t('titleSettings')}
      icon="cog"
      active={props.navProps.state.index === 4}
      onPress={() => router.push('/(drawer)/settings')}
    />
  </Drawer.Section>
)

export default DrawerContent
