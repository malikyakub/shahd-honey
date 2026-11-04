export type ProductCategory = 'bottle' | 'jar' | 'packs'

export interface Product {
  id: string
  name_so: string
  name_en: string
  pack: string
  sizeLabel: string
  priceUSD: number
  category: ProductCategory
  badge?: string
  note?: string
  /** Filled in Phase 2 */
  description_so: string
  /** Filled in Phase 2 */
  description_en: string
}

// NOTE: name_so values are draft Somali translations — have a native speaker confirm.
export const products: Product[] = [
  {
    id: '250ml-bottle',
    name_so: 'Malabka Shahd 250 ml',
    name_en: 'Shahd Honey 250 ml',
    pack: 'plastic bottle',
    sizeLabel: '250 ml',
    priceUSD: 8,
    category: 'bottle',
    description_so: '',
    description_en: '',
  },
  {
    id: '500ml-bottle',
    name_so: 'Malabka Shahd 500 ml',
    name_en: 'Shahd Honey 500 ml',
    pack: 'plastic bottle',
    sizeLabel: '500 ml',
    priceUSD: 14,
    category: 'bottle',
    description_so: '',
    description_en: '',
  },
  {
    id: '1l-bottle',
    name_so: 'Malabka Shahd 1 L',
    name_en: 'Shahd Honey 1 L',
    pack: 'plastic bottle',
    sizeLabel: '1 L',
    priceUSD: 24,
    category: 'bottle',
    badge: 'Best value',
    description_so: '',
    description_en: '',
  },
  {
    id: '500ml-jar',
    name_so: 'Quraaradda Premium ee Shahd 500 ml',
    name_en: 'Shahd Premium Jar 500 ml',
    pack: 'glass jar',
    sizeLabel: '500 ml',
    priceUSD: 17,
    category: 'jar',
    description_so: '',
    description_en: '',
  },
  {
    id: '1l-jar',
    name_so: 'Quraaradda Premium ee Shahd 1 L',
    name_en: 'Shahd Premium Jar 1 L',
    pack: 'glass jar',
    sizeLabel: '1 L',
    priceUSD: 29,
    category: 'jar',
    description_so: '',
    description_en: '',
  },
  {
    id: 'family-pack',
    name_so: 'Xirmada Qoyska (3 x 1 L)',
    name_en: 'Family Pack (3 x 1 L)',
    pack: 'plastic bottles',
    sizeLabel: '3 x 1 L',
    priceUSD: 66,
    category: 'packs',
    note: 'saves $6',
    description_so: '',
    description_en: '',
  },
  {
    id: 'gift-box',
    name_so: 'Sanduuqa Hadiyadda Shahd (2 x 500 ml quraarad + qaado)',
    name_en: 'Shahd Gift Box (2 x 500 ml jars + dipper)',
    pack: 'gift box',
    sizeLabel: '2 x 500 ml',
    priceUSD: 36,
    category: 'packs',
    note: 'saves $2',
    description_so: '',
    description_en: '',
  },
  {
    id: 'dipper',
    name_so: 'Qaadada Malabka ee Alwaaxa',
    name_en: 'Wooden Honey Dipper',
    pack: 'accessory',
    sizeLabel: '',
    priceUSD: 4,
    category: 'packs',
    description_so: '',
    description_en: '',
  },
]
