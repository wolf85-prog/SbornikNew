import { router } from 'expo-router'
import React from 'react'
import { Button, Surface } from 'react-native-paper'
import Slider from '@react-native-community/slider';
import { Locales, ScreenInfo, styles } from '@/lib'

const Profile = () => (
  <Surface style={styles.screen}>
    <ScreenInfo title={Locales.t('profile')} path="app/(tabs)/profile.tsx" />

    <Slider
          style={{width: 200, height: 40}}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="gray"
          maximumTrackTintColor="#000000"
        />

    <Surface
      elevation={0}
      style={{
        padding: 16,
        gap: 16,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Button mode="contained" onPress={() => router.push('/(auth)/login')}>
        Login
      </Button>

      <Button mode="contained" onPress={() => router.push('/(auth)/signup')}>
        Sign Up
      </Button>
    </Surface>
  </Surface>
)

export default Profile
