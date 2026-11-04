import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { en } from '../i18n/en'
import { so } from '../i18n/so'
import type { Lang } from '../i18n/types'
import { LangContext } from '../i18n/useLang'

const STORAGE_KEY = 'shahd-lang'
const DEFAULT_LANG: Lang = 'so'
const dictionaries = { so, en }

function readStoredLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'en' || v === 'so' ? v : DEFAULT_LANG
  } catch {
    return DEFAULT_LANG
  }
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readStoredLang)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* storage unavailable — ignore */
    }
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t: dictionaries[lang] }), [lang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}
