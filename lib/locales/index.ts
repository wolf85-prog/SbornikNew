/**
 * Locales
 */

import { I18n } from 'i18n-js'

import Russian from '@/lib/locales/ru'
import English from '@/lib/locales/en'

const Locales = new I18n({
  ru: Russian,
  en: English,
})

Locales.enableFallback = true

export { Locales }
