export type ProductCategory = 'bottle' | 'jar' | 'packs'

export interface Product {
  id: string
  name_so: string
  name_en: string
  pack: string
  sizeLabel: string
  /** Volume in ml for single bottles/jars (used for price per 100 ml) */
  volumeML?: number
  priceUSD: number
  category: ProductCategory
  badge?: string
  note?: string
  /** Saving vs. buying separately, shown as a "Save $X" badge */
  savingsUSD?: number
  description_so: string
  description_en: string
}

// NOTE: name_so values and description_so are draft Somali — have a native speaker confirm.
export const products: Product[] = [
  {
    id: '250ml-bottle',
    name_so: 'Malabka Shahd 250 ml',
    name_en: 'Shahd Honey 250 ml',
    pack: 'plastic bottle',
    sizeLabel: '250 ml',
    volumeML: 250,
    priceUSD: 8,
    category: 'bottle',
    description_so:
      'Malabkayaga saafiga ah oo ku jira dhalo yar oo 250 ml ah, kuna habboon isticmaalka maalinlaha ah. Waxaa laga keenay gobolka Bakool ee Soomaaliya, lagumana darin sonkor, dhadhan-sameeye ama kiimiko. Dhadhankaaga ugu horreeya ee Shahd.',
    description_en:
      'Our pure honey in a handy 250 ml bottle, made for everyday use. It comes from the Bakool region of Somalia, with no added sugar, flavourings or chemicals. Your first taste of Shahd.',
  },
  {
    id: '500ml-bottle',
    name_so: 'Malabka Shahd 500 ml',
    name_en: 'Shahd Honey 500 ml',
    pack: 'plastic bottle',
    sizeLabel: '500 ml',
    volumeML: 500,
    priceUSD: 14,
    category: 'bottle',
    description_so:
      '500 ml oo ah malab Bakool 100% saafi ah, leh macaan iyo dhadhan dabiici ah oo u gaar ah. Waxba laguma darin – waa malab sidii dabiicigu u sameeyay.',
    description_en:
      '500 ml of 100% pure Bakool honey, with a natural sweetness and taste all its own. Nothing is added – just honey, as nature made it.',
  },
  {
    id: '1l-bottle',
    name_so: 'Malabka Shahd 1 L',
    name_en: 'Shahd Honey 1 L',
    pack: 'plastic bottle',
    sizeLabel: '1 L',
    volumeML: 1000,
    priceUSD: 24,
    category: 'bottle',
    badge: 'Best value',
    description_so:
      'Hal litir oo buuxa oo malab dabiici ah oo saafi ah, kana yimid Bakool. Waxaa loogu talagalay guryaha malabka maalin kasta ku raaxaysta, iyada oo aan sonkor, dhadhan-sameeye ama kiimiko lagu darin.',
    description_en:
      'A full litre of natural, pure honey from Bakool. Made for homes that enjoy honey every day, with no added sugar, flavourings or chemicals.',
  },
  {
    id: '500ml-jar',
    name_so: 'Quraaradda Premium ee Shahd 500 ml',
    name_en: 'Shahd Premium Jar 500 ml',
    pack: 'glass jar',
    sizeLabel: '500 ml',
    volumeML: 500,
    priceUSD: 17,
    category: 'jar',
    description_so:
      'Malab Bakool saafi ah oo ku jira quraarad muraayad ah oo qurux badan, kuna habboon miiska iyo hadiyadda. 100% malab ah oo leh macaan u gaar ah – waxba laguma darin.',
    description_en:
      'Pure Bakool honey in an elegant glass jar, made for the table and for giving. 100% honey with a sweetness all its own – nothing added.',
  },
  {
    id: '1l-jar',
    name_so: 'Quraaradda Premium ee Shahd 1 L',
    name_en: 'Shahd Premium Jar 1 L',
    pack: 'glass jar',
    sizeLabel: '1 L',
    volumeML: 1000,
    priceUSD: 29,
    category: 'jar',
    description_so:
      'Quraaradda muraayadda ah ee premium-ka ah waxay haysaa hal litir oo malab 100% saafi ah oo ka yimid gobolka Bakool. Waa dabiici, waxba laguma darin, waxayna ku qurxoon tahay miis kasta.',
    description_en:
      'Our premium glass jar holds a full litre of 100% pure honey from the Bakool region. Natural, with nothing added, and beautiful on any table.',
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
    savingsUSD: 6,
    description_so:
      'Saddex dhalo oo 1 L ah oo malab Bakool saafi ah, loogu talagalay qoyska oo dhan. Isla malabkii dabiiciga ahaa, iyada oo aan sonkor, dhadhan-sameeye ama kiimiko lagu darin – waxaadna badbaadinaysaa $6.',
    description_en:
      'Three 1 L bottles of pure Bakool honey for the whole household. The same natural honey, with no added sugar, flavourings or chemicals – and you save $6.',
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
    savingsUSD: 2,
    description_so:
      'Laba quraaradood oo muraayad ah (500 ml) oo malab Bakool saafi ah iyo qaado alwaax ah, oo ku jira sanduuqa hadiyadda Shahd. Hadiyad xambaarsan macaanka dabiiciga ah ee dhulkeenna – waxaadna badbaadinaysaa $2.',
    description_en:
      'Two 500 ml glass jars of pure Bakool honey and a wooden dipper, presented in a Shahd gift box. A gift of the natural sweetness of our land – and you save $2.',
  },
  {
    id: 'dipper',
    name_so: 'Qaadada Malabka ee Alwaaxa',
    name_en: 'Wooden Honey Dipper',
    pack: 'accessory',
    sizeLabel: '',
    priceUSD: 4,
    category: 'packs',
    description_so:
      'Qaado alwaax ah oo malabka si nadiif ah loogu shubo, dhibic dhibic. Lammaanaha ugu habboon ee quraarad kasta oo Shahd ah.',
    description_en:
      'A wooden dipper for serving honey neatly, drop by drop. The perfect partner for any Shahd jar.',
  },
]

export function getProduct(id: string | undefined): Product | undefined {
  return products.find((p) => p.id === id)
}

/** Product ids in the size switcher, per category (only bottles/jars). */
export const sizeFamilies: Record<'bottle' | 'jar', string[]> = {
  bottle: ['250ml-bottle', '500ml-bottle', '1l-bottle'],
  jar: ['500ml-jar', '1l-jar'],
}
