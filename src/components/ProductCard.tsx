import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { useLang } from '../i18n/useLang'
import { money, productName } from '../lib/format'
import { useStock } from '../lib/stock'
import { ProductImage } from './ProductImage'

export function ProductBadge({ product, className = '', isOutOfStock = false }: { product: Product; className?: string; isOutOfStock?: boolean }) {
  const { t } = useLang()

  if (isOutOfStock) {
    return (
      <span
        className={`inline-block whitespace-nowrap rounded-sm bg-dark/90 px-space-2 py-[3px] font-body text-[0.58rem] font-bold uppercase tracking-[0.06em] text-cream shadow-sm sm:text-[0.65rem] sm:tracking-[0.14em] ${className}`}
      >
        {t.badges.outOfStock}
      </span>
    )
  }

  const label = product.badge
    ? t.badges.bestValue
    : product.savingsUSD
      ? t.badges.save(money(product.savingsUSD))
      : null
  if (!label) return null
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-sm bg-amber px-space-2 py-[3px] font-body text-[0.58rem] font-bold uppercase tracking-[0.06em] text-dark ${className}`}
    >
      {label}
    </span>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useLang()
  const { isInStock } = useStock()
  const inStock = isInStock(product.id)
  const name = productName(product, lang)

  return (
    <Link
      to={`/product/${product.id}`}
      className={`group flex h-full flex-col overflow-hidden rounded-lg bg-white/60 shadow-soft ring-1 ring-dark/5 transition duration-300 hover:-translate-y-1 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
        !inStock ? 'opacity-90' : ''
      }`}
    >
      <div className="relative aspect-square overflow-hidden">
        <div className={`h-full w-full transition duration-500 group-hover:scale-[1.03] ${!inStock ? 'grayscale-[30%]' : ''}`}>
          <ProductImage product={product} />
        </div>
        <ProductBadge product={product} isOutOfStock={!inStock} className="absolute left-space-2 top-space-2 sm:left-space-3 sm:top-space-3" />
      </div>
      <div className="flex flex-1 flex-col gap-space-1 p-space-3 sm:p-space-4">
        <h3 className="font-heading text-lg font-semibold leading-snug text-dark sm:text-xl">{name}</h3>
        <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.16em] text-dark/55 sm:text-xs">
          {product.sizeLabel || t.packs[product.pack]}
        </p>
        <div className="mt-auto flex items-center justify-between pt-space-2">
          <p className="font-body text-base font-semibold text-dark">{money(product.priceUSD)}</p>
          {!inStock && (
            <span className="font-body text-[0.65rem] font-bold uppercase tracking-wider text-dark/60">
              {t.badges.outOfStock}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
