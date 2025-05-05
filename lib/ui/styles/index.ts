/**
 * Styles
 */

import { StyleSheet } from 'react-native'

import Colors from '@/lib/ui/styles/colors'
import Themes from '@/lib/ui/styles/themes'

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyListTitle: {
    color: '#7f8c8d',
    textAlign: 'center',
    fontSize: 22,
  },

    emptyList: {
    color: '#b2babb',
    textAlign: 'center',
    fontSize: 16,
  },
})

export { Colors, Themes, styles }
