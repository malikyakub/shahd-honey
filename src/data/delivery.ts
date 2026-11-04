export type ZoneId = 1 | 2 | 3 | 4

export interface DeliveryZone {
  id: ZoneId
  name: string
  areas: string[]
  feeUSD: number
  /** Order subtotal (USD) from which delivery is free; null = never free */
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

export function getZone(id: ZoneId): DeliveryZone {
  return deliveryZones.find((z) => z.id === id)!
}

/**
 * Delivery fee for a zone and order subtotal.
 * "Free over $X" is applied from $X upwards (subtotal >= X), so the cart's
 * "Add $X more" message never ends at "Add $0 more".
 */
export function deliveryFee(zone: DeliveryZone, subtotalUSD: number): number {
  if (zone.freeOverUSD !== null && subtotalUSD >= zone.freeOverUSD) return 0
  return zone.feeUSD
}

/** Checkout "Gobol / region" dropdown. Each option sets the delivery zone. */
export interface RegionOption {
  id: string
  /** Region name as shown (Somali place names are the same in both languages) */
  label: string
  /** Suggested city, pre-filled into the city field */
  city: string
  zone: ZoneId
}

export const regionOptions: RegionOption[] = [
  { id: 'banaadir', label: 'Banaadir – Muqdisho', city: 'Muqdisho', zone: 1 },
  { id: 'bakool-xudur', label: 'Bakool – Xudur', city: 'Xudur', zone: 2 },
  { id: 'bakool-waajid', label: 'Bakool – Waajid', city: 'Waajid', zone: 2 },
  { id: 'bakool-tayeeglow', label: 'Bakool – Tayeeglow', city: 'Tayeeglow', zone: 2 },
  { id: 'bakool-ceel-barde', label: 'Bakool – Ceel Barde', city: 'Ceel Barde', zone: 2 },
  { id: 'bay-baidoa', label: 'Bay – Baidoa', city: 'Baidoa', zone: 2 },
  { id: 'sh-hoose-afgooye', label: 'Shabeellaha Hoose – Afgooye', city: 'Afgooye', zone: 2 },
  { id: 'woqooyi-galbeed-hargeisa', label: 'Woqooyi Galbeed – Hargeisa', city: 'Hargeisa', zone: 3 },
  { id: 'nugaal-garowe', label: 'Nugaal – Garowe', city: 'Garowe', zone: 3 },
  { id: 'bari-bosaso', label: 'Bari – Bosaso', city: 'Bosaso', zone: 3 },
  { id: 'mudug-galkacyo', label: 'Mudug – Galkacyo', city: 'Galkacyo', zone: 3 },
  { id: 'hiiraan-beledweyne', label: 'Hiiraan – Beledweyne', city: 'Beledweyne', zone: 3 },
  { id: 'jubbada-hoose-kismayo', label: 'Jubbada Hoose – Kismayo', city: 'Kismayo', zone: 3 },
  { id: 'galgaduud-dhusamareb', label: 'Galgaduud – Dhusamareb', city: 'Dhusamareb', zone: 3 },
  // Label for this one comes from i18n (t.checkout.remoteRegion)
  { id: 'remote', label: 'Tuulo / meel fog', city: '', zone: 4 },
]
