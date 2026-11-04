import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Ban, Droplet, MapPin, Thermometer } from 'lucide-react'
import { getProduct, sizeFamilies } from '../data/products'
import { useCart } from '../context/cart'
import { useLang } from '../i18n/useLang'
import { money, pricePer100, productDescription, productName } from '../lib/format'
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
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!added) return
    const timer = setTimeout(() => setAdded(false), 2200)
    return () => clearTimeout(timer)
  }, [added])

  if (!product) return <NotFound message={t.product.notFound} />

  const name = productName(product, lang)
  const per100 = pricePer100(product)
  const family = product.category === 'bottle' || product.category === 'jar' ? sizeFamilies[product.category] : null

  const handleAdd = () => {
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
    <div className="bg-cream pb-28 md:pb-0">
      <div className="container-site py-space-5 sm:py-space-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-space-2 font-body text-xs font-semibold uppercase tracking-[0.16em] text-dark/70 hover:text-dark"
        >
          <ArrowLeft size={14} /> {t.product.back}
        </Link>

        <div className="mt-space-5 grid gap-space-6 md:grid-cols-2 md:gap-space-8">
          <div className="animate-fade-in relative aspect-square overflow-hidden rounded-lg shadow-soft ring-1 ring-dark/5 md:sticky md:top-28 md:self-start">
            <ProductImage product={product} large />
            <Starburst className="absolute bottom-space-4 right-space-4 h-16 w-16 sm:h-20 sm:w-20" />
          </div>

          <div className="animate-fade-in">
            <ProductBadge product={product} />
            <h1 className="mt-space-3 font-heading text-4xl font-medium leading-tight text-dark sm:text-5xl">{name}</h1>
            <p className="mt-space-2 font-body text-xs font-medium uppercase tracking-[0.16em] text-dark/55">
              {t.packs[product.pack]}
              {product.sizeLabel && ` · ${product.sizeLabel}`}
            </p>

            <div className="mt-space-5 flex items-baseline gap-space-3">
              <span className="font-body text-3xl font-semibold text-dark">{money(product.priceUSD)}</span>
              {per100 !== null && (
                <span className="font-body text-sm text-dark/60">
                  {money(per100)} {t.product.per100}
                </span>
              )}
            </div>

            {family && (
              <div className="mt-space-6">
                <p className="eyebrow text-dark/60">{t.product.size}</p>
                <div className="mt-space-3 flex flex-wrap gap-space-2">
                  {family.map((fid) => {
                    const p = getProduct(fid)!
                    const active = fid === product.id
                    return (
                      <Link
                        key={fid}
                        to={`/product/${fid}`}
                        replace
                        aria-current={active ? 'page' : undefined}
                        className={`min-w-[4.5rem] rounded border px-space-4 py-space-3 text-center font-body text-sm font-semibold transition ${
                          active ? 'border-dark bg-dark text-cream' : 'border-dark/20 text-dark hover:border-dark/50 hover:bg-pale-amber/60'
                        }`}
                      >
                        {p.sizeLabel}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            <p className="mt-space-6 max-w-prose font-body text-[0.95rem] leading-[1.8] text-dark/80">
              {productDescription(product, lang)}
            </p>

            {/* Quantity + add (desktop/tablet) */}
            <div className="mt-space-6 hidden items-center gap-space-4 md:flex">
              <QuantityPicker value={qty} onChange={setQty} />
              <button type="button" onClick={handleAdd} className="btn-amber flex-1">
                {added ? t.product.added : t.product.addToCart}
              </button>
            </div>
            {added && (
              <Link to="/cart" className="mt-space-3 hidden font-body text-xs font-semibold uppercase tracking-[0.16em] text-amber-deep underline underline-offset-4 md:inline-block">
                {t.product.viewCart} →
              </Link>
            )}

            {/* Quantity (mobile) */}
            <div className="mt-space-6 flex items-center justify-between md:hidden">
              <span className="eyebrow text-dark/60">{t.product.quantity}</span>
              <QuantityPicker value={qty} onChange={setQty} />
            </div>

            <div className="mt-space-7 border-t border-pale-amber pt-space-6">
              <h2 className="font-heading text-2xl font-medium text-dark">{t.product.factsTitle}</h2>
              <dl className="mt-space-4 grid gap-space-4 sm:grid-cols-2">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-space-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pale-amber/70">
                      <Icon size={15} strokeWidth={1.8} className="text-amber-deep" />
                    </span>
                    <div>
                      <dt className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-dark/60">{label}</dt>
                      <dd className="mt-0.5 font-body text-sm leading-relaxed text-dark">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile add-to-cart bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-cream/10 bg-dark/95 px-space-4 py-space-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-space-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-base text-cream">{name}</p>
            <p className="font-body text-sm font-semibold text-amber">{money(product.priceUSD * qty)}</p>
          </div>
          {added ? (
            <Link to="/cart" className="btn-amber px-space-5">
              {t.product.viewCart}
            </Link>
          ) : (
            <button type="button" onClick={handleAdd} className="btn-amber px-space-5">
              {t.product.addToCart}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
