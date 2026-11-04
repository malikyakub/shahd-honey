import { createContext, useContext } from 'react'
import type { Dictionary, Lang } from './types'

export interface LangContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Dictionary
}

export const LangContext = createContext<LangContextValue | null>(null)

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}
