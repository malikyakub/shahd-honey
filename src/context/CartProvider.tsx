import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getProduct } from '../data/products'
import { CartContext, type CartItem, type CartLine } from './cart'

import { isProductInStock } from '../lib/stock'

const STORAGE_KEY = 'shahd_cart'
const MAX_QTY = 99

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (i): i is CartItem => !!i && typeof i.id === 'string' && typeof i.qty === 'number' && !!getProduct(i.id),
    )
  } catch {
    return []
  }
}

const clamp = (n: number) => Math.max(1, Math.min(MAX_QTY, Math.floor(n)))

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* ignore */
    }
  }, [items])

  const add = useCallback((id: string, qty = 1) => {
    if (!isProductInStock(id)) return
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id)
      if (existing) return prev.map((i) => (i.id === id ? { ...i, qty: clamp(i.qty + qty) } : i))
      return [...prev, { id, qty: clamp(qty) }]
    })
  }, [])

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: clamp(qty) } : i)))
  }, [])

  const remove = useCallback((id: string) => setItems((prev) => prev.filter((i) => i.id !== id)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(() => {
    const lines: CartLine[] = items.flatMap((i) => {
      const product = getProduct(i.id)
      return product ? [{ product, qty: i.qty, lineTotal: product.priceUSD * i.qty }] : []
    })
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
      add,
      setQty,
      remove,
      clear,
    }
  }, [items, add, setQty, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
