export interface DeliveryZone {
  id: 1 | 2 | 3 | 4
  name: string
  areas: string[]
  feeUSD: number
  /** Order subtotal (USD) above which delivery is free; null = never free */
  freeOverUSD: number | null
  eta: string
}

export const deliveryZones: DeliveryZone[] = [
  {
    id: 1,
    name: 'Muqdisho (Banaadir)',
    areas: ['Muqdisho', 'Banaadir'],
    feeUSD: 2,
    freeOverUSD: 25,
    eta: 'Same / next day',
  },
  {
    id: 2,
    name: 'Near regions',
    areas: ['Xudur', 'Waajid', 'Tayeeglow', 'Ceel Barde', 'Baidoa', 'Afgooye'],
    feeUSD: 4,
    freeOverUSD: 50,
    eta: '1-3 days',
  },
  {
    id: 3,
    name: 'Major cities',
    areas: ['Hargeisa', 'Garowe', 'Bosaso', 'Galkacyo', 'Beledweyne', 'Kismayo', 'Dhusamareb'],
    feeUSD: 7,
    freeOverUSD: 70,
    eta: '2-5 days',
  },
  {
    id: 4,
    name: 'Villages / remote',
    areas: [],
    feeUSD: 10,
    freeOverUSD: null,
    eta: 'Confirmed by phone',
  },
]

/** Delivery fee for a zone and order subtotal ("free over $X" = strictly above X). */
export function deliveryFee(zone: DeliveryZone, subtotalUSD: number): number {
  if (zone.freeOverUSD !== null && subtotalUSD > zone.freeOverUSD) return 0
  return zone.feeUSD
}
