import type { Product } from '../data/products'
import type { Lang } from '../i18n/types'

/** "$8", "$3.20" */
export function money(n: number): string {
  const rounded = Math.round(n * 100) / 100
  return `$${Number.isInteger(rounded) ? rounded : rounded.toFixed(2)}`
}

export function productName(p: Product, lang: Lang): string {
  return lang === 'so' ? p.name_so : p.name_en
}

export function productDescription(p: Product, lang: Lang): string {
  return lang === 'so' ? p.description_so : p.description_en
}

export function pricePer100(p: Product): number | null {
  return p.volumeML ? (p.priceUSD / p.volumeML) * 100 : null
}

/** "2026-11-04 19:52" (locale-independent so it reads the same in SO and EN) */
export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
