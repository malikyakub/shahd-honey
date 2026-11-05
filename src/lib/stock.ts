import { useEffect, useState } from 'react'

export const STOCK_STORAGE_KEY = 'shahd_stock'
const STOCK_EVENT = 'shahd_stock_changed'

export type StockMap = Record<string, boolean>

/**
 * Reads stock state from localStorage.
 * If a product ID is not explicitly set to false, it is considered IN STOCK (true).
 */
export function loadStock(): StockMap {
  try {
    const raw = localStorage.getItem(STOCK_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

/**
 * Checks whether a product is in stock.
 * Default is in-stock (`true`).
 */
export function isProductInStock(productId: string): boolean {
  const stock = loadStock()
  return stock[productId] !== false
}

/**
 * Sets product stock status and notifies listeners across the app.
 */
export function setProductStock(productId: string, inStock: boolean): void {
  try {
    const stock = loadStock()
    stock[productId] = inStock
    localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(stock))
    window.dispatchEvent(new CustomEvent(STOCK_EVENT, { detail: { productId, inStock } }))
  } catch {
    /* ignore storage quota errors */
  }
}

/**
 * React hook to reactively read and toggle stock status.
 */
export function useStock() {
  const [stock, setStock] = useState<StockMap>(loadStock)

  useEffect(() => {
    const update = () => setStock(loadStock())
    window.addEventListener(STOCK_EVENT, update)
    window.addEventListener('storage', update)
    return () => {
      window.removeEventListener(STOCK_EVENT, update)
      window.removeEventListener('storage', update)
    }
  }, [])

  const isInStock = (productId: string) => stock[productId] !== false

  const toggle = (productId: string) => {
    const next = !isInStock(productId)
    setProductStock(productId, next)
  }

  return { stock, isInStock, toggle, setStock: setProductStock }
}
