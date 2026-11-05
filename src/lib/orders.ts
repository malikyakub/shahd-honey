import { useEffect, useState } from 'react'
import type { ZoneId } from '../data/delivery'

export const ORDERS_KEY = 'shahd_orders'
export const ORDERS_CHANGED_EVENT = 'shahd_orders_changed'

export type PaymentMethod = 'evc' | 'zaad' | 'sahal' | 'cod'

export type OrderStatus = 'pending' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled'

export const ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled']

export interface OrderStatusHistoryItem {
  status: OrderStatus
  timestamp: string
}

export interface OrderItem {
  id: string
  /** English product name (stable for admin) */
  name: string
  name_so: string
  qty: number
  unitPrice: number
}

export interface Order {
  id: string
  createdAt: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  customer: { name: string; phone: string }
  address: {
    region: string
    zone: ZoneId
    city: string
    district: string
    xaafad: string
    road: string
    landmark: string
  }
  payment: PaymentMethod
  status: OrderStatus
  statusHistory?: OrderStatusHistoryItem[]
}

export function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveOrder(order: Order): void {
  const orders = loadOrders()
  // Ensure initial status history exists
  if (!order.statusHistory || order.statusHistory.length === 0) {
    order.statusHistory = [{ status: order.status, timestamp: order.createdAt }]
  }
  orders.push(order)
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
    window.dispatchEvent(new CustomEvent(ORDERS_CHANGED_EVENT))
  } catch {
    /* ignore storage errors */
  }
}

export function getOrder(id: string | undefined): Order | undefined {
  if (!id) return undefined
  return loadOrders().find((o) => o.id === id)
}

/**
 * Updates an order's status and records the status transition in statusHistory.
 */
export function updateOrderStatus(id: string, newStatus: OrderStatus): Order | undefined {
  const orders = loadOrders()
  const order = orders.find((o) => o.id === id)
  if (!order) return undefined

  const now = new Date().toISOString()
  if (!Array.isArray(order.statusHistory) || order.statusHistory.length === 0) {
    order.statusHistory = [{ status: order.status, timestamp: order.createdAt }]
  }

  // Only append if status actually changed
  if (order.status !== newStatus) {
    order.status = newStatus
    order.statusHistory.push({ status: newStatus, timestamp: now })
  }

  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
    window.dispatchEvent(new CustomEvent(ORDERS_CHANGED_EVENT))
  } catch {
    /* ignore storage errors */
  }

  return order
}

/**
 * Clears all demo orders from localStorage.
 */
export function clearOrders(): void {
  try {
    localStorage.removeItem(ORDERS_KEY)
    window.dispatchEvent(new CustomEvent(ORDERS_CHANGED_EVENT))
  } catch {
    /* ignore storage errors */
  }
}

/**
 * React hook to listen to orders updates.
 */
export function useOrders(): Order[] {
  const [orders, setOrders] = useState<Order[]>(loadOrders)

  useEffect(() => {
    const update = () => setOrders(loadOrders())
    window.addEventListener(ORDERS_CHANGED_EVENT, update)
    window.addEventListener('storage', update)
    return () => {
      window.removeEventListener(ORDERS_CHANGED_EVENT, update)
      window.removeEventListener('storage', update)
    }
  }, [])

  return orders
}

/** SH-YYYYMMDD-XXXX (XXXX = 4 random digits, unique among stored orders) */
export function newOrderId(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const day = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
  const existing = new Set(loadOrders().map((o) => o.id))
  let id: string
  do {
    id = `SH-${day}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
  } while (existing.has(id))
  return id
}

/**
 * Formats a phone number for wa.me URL.
 * Handles local Somalia numbers (61xxxxxxx / 061xxxxxxx) by prepending 252.
 */
export function buildWhatsAppLink(customerPhone: string, message: string): string {
  let digits = customerPhone.replace(/\D/g, '')
  if (digits.startsWith('0')) {
    digits = digits.slice(1)
  }
  if (digits.length <= 9 && !digits.startsWith('252')) {
    digits = `252${digits}`
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
