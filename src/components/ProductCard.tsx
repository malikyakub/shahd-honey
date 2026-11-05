import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { useLang } from '../i18n/useLang'
import { money, productName } from '../lib/format'
import { useStock } from '../lib/stock'
import { useCart } from '../context/cart'
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
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const inStock = isInStock(product.id)
  const name = productName(product, lang)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!inStock) return
    add(product.id, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div
      className={`group flex h-full flex-col overflow-hidden rounded-lg bg-cream shadow-soft ring-1 ring-dark/5 transition duration-300 hover:-translate-y-1 hover:shadow-lift ${
        !inStock ? 'opacity-90' : ''
      }`}
    >
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-cream block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber">
        <div className={`h-full w-full transition duration-500 group-hover:scale-[1.03] ${!inStock ? 'grayscale-[30%]' : ''}`}>
          <ProductImage product={product} />
        </div>
        <ProductBadge product={product} isOutOfStock={!inStock} className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 z-10" />
      </Link>
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <Link to={`/product/${product.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded">
          <h3 className="font-heading text-lg font-semibold leading-snug text-dark sm:text-xl group-hover:text-amber-deep transition-colors line-clamp-2">{name}</h3>
        </Link>
        <p className="font-body text-[0.68rem] font-medium uppercase tracking-[0.16em] text-dark/55 mt-1 sm:text-xs">
          {product.sizeLabel || t.packs[product.pack]}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3 pb-2.5">
          <p className="font-body text-base font-semibold text-dark">{money(product.priceUSD)}</p>
          {!inStock && (
            <span className="font-body text-[0.65rem] font-bold uppercase tracking-wider text-dark/60">
              {t.badges.outOfStock}
            </span>
          )}
        </div>
        {/* Full-width "Add to cart" button */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inStock}
          className="btn-amber w-full min-h-[44px] text-xs py-2.5 px-3 disabled:opacity-50 disabled:pointer-events-none"
        >
          {!inStock ? t.product.outOfStock : added ? t.product.added : t.product.addToCart}
        </button>
      </div>
    </div>
  )
}
