import { products } from '../../data/products'
import { useStock } from '../../lib/stock'
import { money, productName } from '../../lib/format'
import { useLang } from '../../i18n/useLang'
import { ProductImage } from '../../components/ProductImage'
import { Check, X } from 'lucide-react'

export function AdminProducts() {
  const { t, lang } = useLang()
  const { isInStock, toggle } = useStock()

  const inStockCount = products.filter((p) => isInStock(p.id)).length

  return (
    <div className="space-y-space-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-medium text-dark sm:text-4xl">{t.admin.products.title}</h1>
          <p className="font-body text-xs text-dark/60 mt-0.5">{t.admin.products.subtitle}</p>
        </div>
        <div className="font-body text-xs text-dark/70 bg-white/70 rounded-full px-space-4 py-1.5 shadow-sm border border-dark/10 self-start sm:self-auto">
          <span className="font-semibold text-emerald-900">{inStockCount}</span> / {products.length} {t.admin.products.inStock}
        </div>
      </div>

      {/* Product List */}
      <div className="rounded-lg bg-white/70 shadow-soft ring-1 ring-dark/5 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left font-body text-xs">
            <thead className="border-b border-dark/10 bg-pale-amber/20 text-dark/70 uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-space-3 px-space-4 w-20">{t.admin.products.product}</th>
                <th className="py-space-3 px-space-4">Name</th>
                <th className="py-space-3 px-space-4">{t.admin.products.pack}</th>
                <th className="py-space-3 px-space-4">{t.admin.products.price}</th>
                <th className="py-space-3 px-space-4">{t.admin.products.stockStatus}</th>
                <th className="py-space-3 px-space-4 text-right">{t.admin.products.toggleToOut}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/5">
              {products.map((product) => {
                const inStock = isInStock(product.id)
                const name = productName(product, lang)
                return (
                  <tr key={product.id} className="transition hover:bg-white/90">
                    <td className="py-space-3 px-space-4">
                      <div className="h-14 w-14 overflow-hidden rounded bg-cream/60 ring-1 ring-dark/5">
                        <ProductImage product={product} />
                      </div>
                    </td>
                    <td className="py-space-3 px-space-4">
                      <div className="font-heading text-base font-semibold text-dark leading-snug">{name}</div>
                      <div className="text-[0.68rem] text-dark/50">{product.name_en}</div>
                    </td>
                    <td className="py-space-3 px-space-4 text-dark/70">
                      {product.sizeLabel || t.packs[product.pack]}
                    </td>
                    <td className="py-space-3 px-space-4 font-semibold text-dark">
                      {money(product.priceUSD)}
                    </td>
                    <td className="py-space-3 px-space-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-space-2.5 py-0.5 text-[0.7rem] font-semibold ${
                          inStock
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                            : 'bg-rose-100 text-rose-950 border border-rose-300'
                        }`}
                      >
                        {inStock ? <Check size={11} /> : <X size={11} />}
                        <span>{inStock ? t.admin.products.inStock : t.admin.products.outOfStock}</span>
                      </span>
                    </td>
                    <td className="py-space-3 px-space-4 text-right">
                      {/* Toggle Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={inStock}
                        aria-label={`${inStock ? t.admin.products.toggleToOut : t.admin.products.toggleToIn}: ${name}`}
                        onClick={() => toggle(product.id)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 ${
                          inStock ? 'bg-amber' : 'bg-dark/30'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            inStock ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View (< 768px down to 375px) */}
        <div className="md:hidden divide-y divide-dark/10">
          {products.map((product) => {
            const inStock = isInStock(product.id)
            const name = productName(product, lang)
            return (
              <div key={product.id} className="p-space-4 flex items-center justify-between gap-space-3">
                <div className="flex items-center gap-space-3 min-w-0">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded bg-cream/60 ring-1 ring-dark/5">
                    <ProductImage product={product} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-heading text-sm font-semibold text-dark">{name}</h3>
                    <p className="font-body text-[0.68rem] text-dark/50">
                      {product.sizeLabel || t.packs[product.pack]} · {money(product.priceUSD)}
                    </p>
                    <span
                      className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${
                        inStock
                          ? 'bg-emerald-100 text-emerald-950'
                          : 'bg-rose-100 text-rose-950'
                      }`}
                    >
                      {inStock ? t.admin.products.inStock : t.admin.products.outOfStock}
                    </span>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={inStock}
                  aria-label={`${inStock ? t.admin.products.toggleToOut : t.admin.products.toggleToIn}: ${name}`}
                  onClick={() => toggle(product.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber ${
                    inStock ? 'bg-amber' : 'bg-dark/30'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      inStock ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
