import { createContext, useContext } from 'react'
import type { Product } from '../data/products'

export interface CartItem {
  id: string
  qty: number
}

export interface CartLine {
  product: Product
  qty: number
  lineTotal: number
}

export interface CartContextValue {
  lines: CartLine[]
  count: number
  subtotal: number
  add: (id: string, qty?: number) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
