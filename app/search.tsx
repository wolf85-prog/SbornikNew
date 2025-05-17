import React from 'react'
import { Searchbar, Surface } from 'react-native-paper'

import { Locales, ScreenInfo, styles } from '@/lib'

const Search = () => {
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  // Search logic
  React.useEffect(() => {
    if (query !== '') {
      setLoading(true)
    }

    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [query])

  return (
    <Surface style={{ flex: 1, gap: 16 }}>
      <Searchbar
        value={query}
        loading={loading}
        onChangeText={(v) => setQuery(v)}
        placeholder="Введите здесь для поиска..."
        style={{ marginTop: 16, marginHorizontal: 16 }}
      />


    </Surface>
  )
}

export default Search
