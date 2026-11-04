import type { ZoneId } from '../data/delivery'

export const ORDERS_KEY = 'shahd_orders'

export type PaymentMethod = 'evc' | 'zaad' | 'sahal' | 'cod'

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
  status: 'pending'
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
  orders.push(order)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function getOrder(id: string | undefined): Order | undefined {
  return loadOrders().find((o) => o.id === id)
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
