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
    <div ref={ref} className="overflow-hidden rounded-lg bg-cream shadow-lift ring-1 ring-dark/10">
      {/* Header */}
      <div className="relative bg-dark px-space-6 py-space-6 text-cream">
        <div className="flex items-start justify-between gap-space-4">
          <img src="/light.svg" alt="Shahd Honey" width={160} height={44} className="h-10 w-auto" />
          <Starburst className="h-16 w-16 shrink-0" />
        </div>

        <p className="mt-space-4 font-heading text-base italic text-cream/75">{t.tagline}</p>
      </div>

      <div className="space-y-space-5 px-space-6 py-space-6 font-body text-sm">
        <div className="flex items-baseline justify-between">
          <p className="eyebrow text-amber-deep">{t.order.receipt}</p>
          <span className="rounded-sm bg-amber px-space-2 py-[2px] text-[0.65rem] font-bold uppercase tracking-[0.14em] text-dark">
            {statusLabel}
          </span>
        </div>

        <dl className="space-y-space-2">
          <Row label={t.order.orderNo} value={<span className="whitespace-nowrap font-semibold">{order.id}</span>} />
          <Row label={t.order.date} value={formatDateTime(order.createdAt)} />
          <Row label={t.order.customer} value={order.customer.name} />
          <Row label={t.checkout.phone} value={order.customer.phone} />
        </dl>

        <div className="border-t border-dashed border-dark/20 pt-space-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-dark/60">{t.order.deliverTo}</p>
          <div className="mt-space-2 space-y-0.5 text-dark">
            {addressLines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        </div>

        <div className="border-t border-dashed border-dark/20 pt-space-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-dark/60">{t.order.items}</p>
          <ul className="mt-space-2 space-y-space-2">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-space-3">
                <span className="text-dark">
                  {lang === 'so' ? i.name_so : i.name} <span className="text-dark/50">× {i.qty}</span>
                </span>
                <span className="shrink-0 font-medium text-dark">{money(i.unitPrice * i.qty)}</span>
              </li>
            ))}
          </ul>
        </div>

        <dl className="space-y-space-2 border-t border-dashed border-dark/20 pt-space-4">
          <Row label={t.cart.subtotal} value={money(order.subtotal)} />
          <Row label={t.checkout.delivery} value={order.deliveryFee === 0 ? t.checkout.free : money(order.deliveryFee)} />
          <div className="flex items-baseline justify-between border-t border-dark/15 pt-space-3">
            <dt className="font-semibold text-dark">{t.checkout.total}</dt>
            <dd className="text-xl font-semibold text-dark">{money(order.total)}</dd>
          </div>
          <Row label={t.order.paymentMethod} value={t.checkout.methods[order.payment]} />
          <Row label={t.order.status} value={statusLabel} />
        </dl>
      </div>

      <div className="bg-dark px-space-6 py-space-4 text-center font-body text-[0.7rem] leading-relaxed text-cream/75">
        <p className="font-heading text-sm italic text-cream">{t.order.thankLine}</p>
        <p className="mt-space-1">
          WhatsApp {brand.whatsapp} · TikTok {brand.tiktok}
        </p>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-space-4">
      <dt className="text-dark/60">{label}</dt>
      <dd className="text-right font-medium text-dark">{value}</dd>
    </div>
  )
}
