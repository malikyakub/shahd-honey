import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Trash2, Truck } from 'lucide-react'
import { getZone } from '../data/delivery'
import { useCart } from '../context/cart'
import { useLang } from '../i18n/useLang'
import { money, productName } from '../lib/format'
import { ProductImage } from '../components/ProductImage'
import { QuantityPicker } from '../components/QuantityPicker'

export function Cart() {
  const { t, lang } = useLang()
  const { lines, subtotal, setQty, remove } = useCart()
  const threshold = getZone(1).freeOverUSD!
  const remaining = Math.max(0, threshold - subtotal)
  const progress = Math.min(100, (subtotal / threshold) * 100)

  if (lines.length === 0) {
    return (
      <section className="container-site flex min-h-[55vh] flex-col items-center justify-center py-space-8 text-center">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-pale-amber/70">
          <ShoppingBag size={30} strokeWidth={1.4} className="text-amber-deep" />
        </span>
        <h1 className="mt-space-5 font-heading text-4xl font-medium text-dark">{t.cart.empty}</h1>
        <p className="mt-space-2 font-body text-sm text-dark/65">{t.cart.emptyText}</p>
        <Link to="/shop" className="btn-amber mt-space-6">
          {t.cart.emptyCta} <ArrowRight size={16} />
        </Link>
      </section>
    )
  }

  return (
    <section className="container-site py-space-7 sm:py-space-8">
      <h1 className="font-heading text-5xl font-medium text-dark">{t.cart.title}</h1>

      <div className="mt-space-6 grid gap-space-6 lg:grid-cols-[1fr_22rem] lg:gap-space-7">
        <ul className="divide-y divide-pale-amber border-y border-pale-amber">
          {lines.map(({ product, qty, lineTotal }) => {
            const name = productName(product, lang)
            return (
              <li key={product.id} className="flex gap-space-4 py-space-5">
                <Link to={`/product/${product.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded sm:h-28 sm:w-28">
                  <ProductImage product={product} compact />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-space-3">
                    <div className="min-w-0">
                      <Link to={`/product/${product.id}`} className="font-heading text-lg font-semibold leading-snug text-dark hover:underline sm:text-xl">
                        {name}
                      </Link>
                      <p className="mt-0.5 font-body text-xs text-dark/60">{money(product.priceUSD)}</p>
                    </div>
                    <p className="shrink-0 font-body text-base font-semibold text-dark">{money(lineTotal)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-space-3">
                    <QuantityPicker value={qty} onChange={(n) => setQty(product.id, n)} size="sm" />
                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      className="inline-flex items-center gap-space-1 rounded px-space-2 py-space-2 font-body text-xs font-medium text-dark/60 transition hover:text-dark"
                    >
                      <Trash2 size={14} /> {t.cart.remove}
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <aside className="h-fit rounded-lg bg-white/60 p-space-5 shadow-soft ring-1 ring-dark/5 sm:p-space-6 lg:sticky lg:top-28">
          <div className="rounded bg-pale-amber/50 p-space-4">
            <p className="flex items-start gap-space-2 font-body text-xs font-medium leading-relaxed text-dark">
              <Truck size={16} className="mt-px shrink-0 text-amber-deep" />
              {remaining > 0 ? t.cart.freeMore(money(remaining)) : t.cart.freeReached}
            </p>
            <div
              className="mt-space-3 h-1.5 overflow-hidden rounded-full bg-dark/10"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={threshold}
              aria-valuenow={Math.min(subtotal, threshold)}
            >
              <div className="h-full rounded-full bg-amber transition-[width] duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="mt-space-5 flex items-baseline justify-between">
            <span className="font-body text-sm font-medium text-dark/70">{t.cart.subtotal}</span>
            <span className="font-body text-2xl font-semibold text-dark">{money(subtotal)}</span>
          </div>
          <p className="mt-space-1 font-body text-xs text-dark/55">{t.cart.deliveryNote}</p>

          <Link to="/checkout" className="btn-amber mt-space-5 w-full">
            {t.cart.checkout} <ArrowRight size={16} />
          </Link>
          <Link to="/shop" className="mt-space-4 block text-center font-body text-xs font-semibold uppercase tracking-[0.14em] text-dark/70 hover:text-dark">
            {t.cart.continue}
          </Link>
        </aside>
      </div>
    </section>
  )
}
