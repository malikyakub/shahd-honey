import { useRef, useState, type ReactNode, type Ref } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Download, CheckCircle2 } from 'lucide-react'
import { toPng } from 'html-to-image'
import { brand } from '../data/brand'
import { useLang } from '../i18n/useLang'
import { formatDateTime, money } from '../lib/format'
import { getOrder, type Order } from '../lib/orders'
import { Starburst } from '../components/Decor'
import { NotFound } from './NotFound'

export function OrderConfirmation() {
  const { id } = useParams()
  const { t } = useLang()
  const [order] = useState(() => getOrder(id))
  const receiptRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)

  if (!order) return <NotFound message={t.order.notFound} />

  const download = async () => {
    if (!receiptRef.current) return
    setBusy(true)
    setError(false)
    try {
      const dataUrl = await toPng(receiptRef.current, { pixelRatio: 2, cacheBust: true, backgroundColor: '#FBF3E0' })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `${order.id}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="bg-cream py-space-7 sm:py-space-8">
      <div className="container-site">
        <div className="animate-fade-in mx-auto max-w-xl text-center">
          <CheckCircle2 size={44} strokeWidth={1.4} className="mx-auto text-amber-deep" />
          <h1 className="mt-space-4 font-heading text-5xl font-medium text-dark">{t.order.thanks}</h1>
          <p className="mt-space-3 font-body text-sm leading-relaxed text-dark/75">{t.order.thanksText}</p>
        </div>

        <div className="mx-auto mt-space-7 max-w-md">
          <Receipt ref={receiptRef} order={order} />

          <button type="button" onClick={download} disabled={busy} className="btn-amber mt-space-5 w-full">
            <Download size={16} /> {busy ? t.order.downloading : t.order.download}
          </button>
          {error && (
            <p role="alert" className="mt-space-2 text-center font-body text-xs text-red-800">
              {t.order.downloadError}
            </p>
          )}
          <Link to="/" className="mt-space-4 block text-center font-body text-xs font-semibold uppercase tracking-[0.14em] text-dark/70 hover:text-dark">
            {t.order.backHome}
          </Link>
        </div>
      </div>
    </section>
  )
}

function Receipt({ order, ref }: { order: Order; ref: Ref<HTMLDivElement> }) {
  const { t, lang } = useLang()
  const a = order.address
  const addressLines = [
    [a.road, a.xaafad].filter(Boolean).join(', '),
    [a.district, a.city].filter(Boolean).join(', '),
    a.region,
    a.landmark,
  ].filter(Boolean)

  return (
    <div ref={ref} className="overflow-hidden rounded-lg bg-cream shadow-lift ring-1 ring-dark/10">
      {/* Header */}
      <div className="relative bg-dark px-space-6 py-space-6 text-cream">
        <div className="flex items-start justify-between gap-space-4">
          <div className="leading-none">
            <p className="font-heading text-4xl font-medium tracking-wide">{brand.wordmark}</p>
            <p className="mt-1 pl-[0.32em] font-body text-[0.55rem] font-semibold uppercase tracking-brand text-amber">Honey</p>
          </div>
          <Starburst className="h-16 w-16 shrink-0" />
        </div>
        <p className="mt-space-4 font-heading text-base italic text-cream/75">{t.tagline}</p>
      </div>

      <div className="space-y-space-5 px-space-6 py-space-6 font-body text-sm">
        <div className="flex items-baseline justify-between">
          <p className="eyebrow text-amber-deep">{t.order.receipt}</p>
          <span className="rounded-sm bg-amber px-space-2 py-[2px] text-[0.65rem] font-bold uppercase tracking-[0.14em] text-dark">
            {t.order.pending}
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
          <Row label={t.order.status} value={t.order.pending} />
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
