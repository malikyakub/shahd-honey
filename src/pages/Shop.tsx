import { useSearchParams } from 'react-router-dom'
import { products, type ProductCategory } from '../data/products'
import { useLang } from '../i18n/useLang'
import { ProductCard } from '../components/ProductCard'
import { Reveal } from '../components/Reveal'

type Filter = 'all' | ProductCategory
const FILTERS: Filter[] = ['all', 'bottle', 'jar', 'packs']

export function Shop() {
  const { t } = useLang()
  const [params, setParams] = useSearchParams()
  const raw = params.get('c')
  const filter: Filter = FILTERS.includes(raw as Filter) ? (raw as Filter) : 'all'
  const list = filter === 'all' ? products : products.filter((p) => p.category === filter)

  return (
    <div className="bg-cream">
      <section className="container-site py-space-7 sm:py-space-8">
        <div className="text-center">
          <p className="eyebrow text-amber-deep">{t.shop.eyebrow}</p>
          <h1 className="mt-space-2 font-heading text-5xl font-medium text-dark sm:text-6xl">{t.shop.title}</h1>
        </div>

        <div
          role="tablist"
          aria-label={t.shop.title}
          className="no-scrollbar -mx-space-5 mt-space-6 flex gap-space-2 overflow-x-auto px-space-5 pb-space-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0"
        >
          {FILTERS.map((f) => {
            const active = f === filter
            return (
              <button
                key={f}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setParams(f === 'all' ? {} : { c: f }, { replace: true })}
                className={`shrink-0 whitespace-nowrap rounded-full border px-space-4 py-space-2 font-body text-xs font-semibold uppercase tracking-[0.12em] transition ${
                  active
                    ? 'border-dark bg-dark text-cream'
                    : 'border-dark/20 text-dark hover:border-dark/40 hover:bg-pale-amber/60'
                }`}
              >
                {t.shop.filters[f]}
              </button>
            )
          })}
        </div>

        <div className="mt-space-6 grid grid-cols-2 gap-space-4 md:grid-cols-4 md:gap-space-5">
          {list.map((p, i) => (
            <Reveal key={`${filter}-${p.id}`} delay={(i % 4) * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        {list.length === 0 && <p className="mt-space-7 text-center text-dark/60">{t.shop.empty}</p>}
      </section>
    </div>
  )
}
