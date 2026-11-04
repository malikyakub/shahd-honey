import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { useLang } from '../i18n/useLang'
import { money, productName } from '../lib/format'
import { ProductImage } from './ProductImage'

export function ProductBadge({ product, className = '' }: { product: Product; className?: string }) {
  const { t } = useLang()
  const label = product.badge
    ? t.badges.bestValue
    : product.savingsUSD
      ? t.badges.save(money(product.savingsUSD))
      : null
  if (!label) return null
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-sm bg-amber px-space-2 py-[3px] font-body text-[0.58rem] font-bold uppercase tracking-[0.06em] text-dark sm:text-[0.65rem] sm:tracking-[0.14em] ${className}`}
    >
      {label}
    </span>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useLang()
  const name = productName(product, lang)
  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg bg-white/60 shadow-soft ring-1 ring-dark/5 transition duration-300 hover:-translate-y-1 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
    >
      <div className="relative aspect-square overflow-hidden">
        <div className="h-full w-full transition duration-500 group-hover:scale-[1.03]">
          <ProductImage product={product} />
        </div>
        <ProductBadge product={product} className="absolute left-space-2 top-space-2 sm:left-space-3 sm:top-space-3" />
      </div>
      <div className="flex flex-1 flex-col gap-space-1 p-space-3 sm:p-space-4">
        <h3 className="font-heading text-lg font-semibold leading-snug text-dark sm:text-xl">{name}</h3>
        <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.16em] text-dark/55 sm:text-xs">
          {product.sizeLabel || t.packs[product.pack]}
        </p>
        <p className="mt-auto pt-space-2 font-body text-base font-semibold text-dark">{money(product.priceUSD)}</p>
      </div>
    </Link>
  )
}
