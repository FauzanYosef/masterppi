import id, { type Dictionary } from './dictionaries/id'
import en from './dictionaries/en'
import type { Locale } from './config'

export const dictionaries: Record<Locale, Dictionary> = { id, en }

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale]

export type { Dictionary }
export * from './config'
