import type { Locale } from '../types'

export const LOCALE_STORAGE_KEY = 'webfrank-locale'

export function detectLocale(
  stored: string | null = typeof localStorage === 'undefined' ? null : localStorage.getItem(LOCALE_STORAGE_KEY),
  browserLanguage: string = typeof navigator === 'undefined' ? 'en' : navigator.language,
): Locale {
  if (stored === 'zh' || stored === 'en') return stored
  return browserLanguage.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export function saveLocale(locale: Locale): void {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}
