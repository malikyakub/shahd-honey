import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Ban, Droplet, MapPin, Thermometer } from 'lucide-react'
import { getProduct, sizeFamilies } from '../data/products'
import { useCart } from '../context/cart'
import { useLang } from '../i18n/useLang'
import { money, pricePer100, productDescription, productName } from '../lib/format'
import { useStock } from '../lib/stock'
import { ProductImage } from '../components/ProductImage'
import { ProductBadge } from '../components/ProductCard'
import { QuantityPicker } from '../components/QuantityPicker'
import { Starburst } from '../components/Decor'
import { NotFound } from './NotFound'

export function ProductPage() {
  const { id } = useParams()
  // Keyed by id so quantity / "added" state resets when switching sizes
  return <ProductDetail key={id} id={id} />
}

function ProductDetail({ id }: { id: string | undefined }) {
  const product = getProduct(id)
  const { t, lang } = useLang()
  const { add } = useCart()
  const { isInStock } = useStock()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!added) return
    const timer = setTimeout(() => setAdded(false), 2200)
    return () => clearTimeout(timer)
  }, [added])

  if (!product) return <NotFound message={t.product.notFound} />

  const inStock = isInStock(product.id)
  const name = productName(product, lang)
  const per100 = pricePer100(product)
  const family = product.category === 'bottle' || product.category === 'jar' ? sizeFamilies[product.category] : null

  const handleAdd = () => {
    if (!inStock) return
    add(product.id, qty)
    setAdded(true)
  }

  const facts = [
    { icon: Droplet, label: t.product.ingredientsLabel, value: t.product.ingredients },
    { icon: MapPin, label: t.product.originLabel, value: t.product.origin },
    { icon: Ban, label: t.product.nothingAddedLabel, value: t.product.nothingAdded },
    { icon: Thermometer, label: t.product.storageLabel, value: t.product.storage },
  ]

  return (
    <div className="bg-cream pb-32 md:pb-0">
      <div className="container-site py-space-4 sm:py-space-6">
        <Link
          to="/shop"
          className="inline-flex min-h-[44px] items-center gap-space-2 font-body text-xs font-semibold uppercase tracking-[0.16em] text-dark/70 hover:text-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded"
        >
          <ArrowLeft size={16} /> {t.product.back}
        </Link>

        <div className="mt-space-3 md:mt-space-5 grid gap-space-6 md:grid-cols-2 md:gap-space-8">
          {/* Edge-to-edge image on mobile (<768px), rounded sticky card on desktop (>=768px) */}
          <div className="animate-fade-in relative aspect-square overflow-hidden bg-cream shadow-soft md:rounded-lg md:ring-1 md:ring-dark/5 md:sticky md:top-28 md:self-start -mx-4 sm:-mx-6 md:mx-0 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] md:w-full">
            <ProductImage product={product} large />
            <Starburst className="absolute bottom-3 right-3 h-14 w-14 sm:bottom-4 sm:right-4 sm:h-20 sm:w-20" />
          </div>

          <div className="animate-fade-in min-w-0">
            <div className="flex items-center gap-space-2">
              <ProductBadge product={product} isOutOfStock={!inStock} />
              {!inStock && (
                <span className="font-body text-xs font-semibold uppercase tracking-wider text-red-800">
                  {t.badges.outOfStock}
                </span>
              )}
            </div>
            <h1 className="mt-space-3 font-heading text-3xl font-medium leading-tight text-dark sm:text-4xl md:text-5xl break-words">{name}</h1>
            <p className="mt-space-2 font-body text-xs font-medium uppercase tracking-[0.16em] text-dark/55">
              {t.packs[product.pack]}
              {product.sizeLabel && ` · ${product.sizeLabel}`}
            </p>

            <div className="mt-space-4 flex flex-wrap items-baseline gap-space-3">
              <span className="font-body text-3xl font-semibold text-dark">{money(product.priceUSD)}</span>
              {per100 !== null && (
                <span className="font-body text-sm text-dark/60">
                  {money(per100)} {t.product.per100}
                </span>
              )}
            </div>

            {family && (
              <div className="mt-space-5">
                <p className="eyebrow text-dark/60">{t.product.size}</p>
                {/* Size switcher: wraps and scrolls if container is narrow */}
                <div className="mt-space-2 flex flex-wrap gap-2 overflow-x-auto no-scrollbar max-w-full pb-1">
                  {family.map((fid) => {
                    const p = getProduct(fid)!
                    const active = fid === product.id
                    return (
                      <Link
                        key={fid}
                        to={`/product/${fid}`}
                        replace
                        aria-current={active ? 'page' : undefined}
                        className={`inline-flex min-h-[44px] items-center gap-2 rounded border px-3 py-2 text-center font-body text-xs font-semibold transition shrink-0 max-w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
                          active ? 'border-dark bg-dark text-cream shadow-sm' : 'border-dark/20 text-dark hover:border-dark/50 hover:bg-pale-amber/60'
                        }`}
                      >
                        <span className="h-6 w-6 shrink-0 overflow-hidden rounded bg-cream flex items-center justify-center">
                          <ProductImage product={p} compact />
                        </span>
                        <span className="truncate">{p.sizeLabel}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            <p className="mt-space-5 max-w-prose font-body text-[0.95rem] leading-[1.8] text-dark/80 break-words">
              {productDescription(product, lang)}
            </p>

            {/* Desktop / tablet Quantity + add */}
            <div className="mt-space-6 hidden items-center gap-space-4 md:flex">
              <QuantityPicker value={qty} onChange={setQty} />
              <button
                type="button"
                onClick={handleAdd}
                disabled={!inStock}
                className="btn-amber flex-1 min-h-[44px] disabled:opacity-50 disabled:pointer-events-none"
              >
                {!inStock ? t.product.outOfStock : added ? t.product.added : t.product.addToCart}
              </button>
            </div>
            {added && (
              <Link to="/cart" className="mt-space-3 hidden font-body text-xs font-semibold uppercase tracking-[0.16em] text-amber-deep underline underline-offset-4 md:inline-block">
                {t.product.viewCart} →
              </Link>
            )}

            {/* Facts Section */}
            <div className="mt-space-6 border-t border-pale-amber pt-space-5">
              <h2 className="font-heading text-xl sm:text-2xl font-medium text-dark">{t.product.factsTitle}</h2>
              <dl className="mt-space-3 grid gap-space-3 sm:grid-cols-2">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-space-3 min-w-0">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pale-amber/70">
                      <Icon size={15} strokeWidth={1.8} className="text-amber-deep" />
                    </span>
                    <div className="min-w-0">
                      <dt className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-dark/60">{label}</dt>
                      <dd className="mt-0.5 font-body text-sm leading-relaxed text-dark break-words">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {/* Mobile Quantity selector */}
            <div className="mt-space-6 flex items-center justify-between border-t border-pale-amber pt-space-4 md:hidden">
              <span className="eyebrow text-dark/60">{t.product.quantity}</span>
              <QuantityPicker value={qty} onChange={setQty} />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile add-to-cart bar with safe-area padding */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-cream/10 bg-dark/95 px-space-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur md:hidden shadow-lift">
        <div className="flex items-center gap-space-3 max-w-md mx-auto">
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-base text-cream">{name}</p>
            <p className="font-body text-sm font-semibold text-amber">{money(product.priceUSD * qty)}</p>
          </div>
          {!inStock ? (
            <button type="button" disabled className="btn-amber min-h-[44px] px-space-5 opacity-50 pointer-events-none">
              {t.product.outOfStock}
            </button>
          ) : added ? (
            <Link to="/cart" className="btn-amber min-h-[44px] px-space-5">
              {t.product.viewCart}
            </Link>
          ) : (
            <button type="button" onClick={handleAdd} className="btn-amber min-h-[44px] px-space-5">
              {t.product.addToCart}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
