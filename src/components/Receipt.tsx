import { type ReactNode, type Ref } from 'react'
import { brand } from '../data/brand'
import { useLang } from '../i18n/useLang'
import { formatDateTime, money } from '../lib/format'
import type { Order } from '../lib/orders'
import { Starburst } from './Decor'

export function Receipt({ order, ref }: { order: Order; ref: Ref<HTMLDivElement> }) {
  const { t, lang } = useLang()
  const a = order.address
  const addressLines = [
    [a.road, a.xaafad].filter(Boolean).join(', '),
    [a.district, a.city].filter(Boolean).join(', '),
    a.region,
    a.landmark,
  ].filter(Boolean)

  const statusLabel = t.admin?.status?.[order.status] ?? t.order.pending

  return (
    <div ref={ref} className="overflow-hidden rounded-lg bg-cream shadow-lift ring-1 ring-dark/10 w-full">
      {/* Header */}
      <div className="relative bg-dark px-4 py-5 sm:px-space-6 sm:py-space-6 text-cream">
        <div className="flex items-start justify-between gap-space-3">
          <img src="/light.svg" alt="Shahd Honey" width={160} height={44} className="h-8 sm:h-10 w-auto" />
          <Starburst className="h-12 w-12 sm:h-16 sm:w-16 shrink-0" />
        </div>

        <p className="mt-space-3 sm:mt-space-4 font-heading text-sm sm:text-base italic text-cream/75">{t.tagline}</p>
      </div>

      <div className="space-y-4 sm:space-y-space-5 px-4 py-5 sm:px-space-6 sm:py-space-6 font-body text-xs sm:text-sm">
        <div className="flex items-baseline justify-between gap-2">
          <p className="eyebrow text-amber-deep">{t.order.receipt}</p>
          <span className="rounded-sm bg-amber px-2 py-[2px] text-[0.65rem] font-bold uppercase tracking-[0.14em] text-dark shrink-0">
            {statusLabel}
          </span>
        </div>

        <dl className="space-y-2">
          <Row label={t.order.orderNo} value={<span className="font-semibold break-all">{order.id}</span>} />
          <Row label={t.order.date} value={formatDateTime(order.createdAt)} />
          <Row label={t.order.customer} value={order.customer.name} />
          <Row label={t.checkout.phone} value={order.customer.phone} />
        </dl>

        <div className="border-t border-dashed border-dark/20 pt-space-3 sm:pt-space-4">
          <p className="text-[0.68rem] sm:text-xs font-semibold uppercase tracking-[0.12em] text-dark/60">{t.order.deliverTo}</p>
          <div className="mt-space-2 space-y-0.5 text-dark break-words">
            {addressLines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        </div>

        <div className="border-t border-dashed border-dark/20 pt-space-3 sm:pt-space-4">
          <p className="text-[0.68rem] sm:text-xs font-semibold uppercase tracking-[0.12em] text-dark/60">{t.order.items}</p>
          <ul className="mt-space-2 space-y-space-2">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-space-2">
                <span className="text-dark min-w-0 break-words">
                  {lang === 'so' ? i.name_so : i.name} <span className="text-dark/50 whitespace-nowrap">× {i.qty}</span>
                </span>
                <span className="shrink-0 font-medium text-dark">{money(i.unitPrice * i.qty)}</span>
              </li>
            ))}
          </ul>
        </div>

        <dl className="space-y-2 border-t border-dashed border-dark/20 pt-space-3 sm:pt-space-4">
          <Row label={t.cart.subtotal} value={money(order.subtotal)} />
          <Row label={t.checkout.delivery} value={order.deliveryFee === 0 ? t.checkout.free : money(order.deliveryFee)} />
          <div className="flex items-baseline justify-between border-t border-dark/15 pt-space-2 sm:pt-space-3">
            <dt className="font-semibold text-dark text-sm sm:text-base">{t.checkout.total}</dt>
            <dd className="text-lg sm:text-xl font-semibold text-dark">{money(order.total)}</dd>
          </div>
          <Row label={t.order.paymentMethod} value={t.checkout.methods[order.payment]} />
          <Row label={t.order.status} value={statusLabel} />
        </dl>
      </div>

      <div className="bg-dark px-4 py-3 sm:px-space-6 sm:py-space-4 text-center font-body text-[0.68rem] sm:text-[0.7rem] leading-relaxed text-cream/75">
        <p className="font-heading text-xs sm:text-sm italic text-cream">{t.order.thankLine}</p>
        <p className="mt-1">
          WhatsApp {brand.whatsapp} · TikTok {brand.tiktok}
        </p>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-2 min-w-0">
      <dt className="text-dark/60 shrink-0">{label}</dt>
      <dd className="text-right font-medium text-dark min-w-0 break-words">{value}</dd>
    </div>
  )
}
