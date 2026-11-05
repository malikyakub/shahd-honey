import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  MessageCircle,
  Clock,
  MapPin,
  User,
  CreditCard,
  Truck,
  Check,
  AlertCircle,
} from 'lucide-react'
import { toPng } from 'html-to-image'
import { getOrder, updateOrderStatus, buildWhatsAppLink, type OrderStatus, ORDER_STATUSES } from '../../lib/orders'
import { getZone } from '../../data/delivery'
import { formatDateTime, money } from '../../lib/format'
import { useLang } from '../../i18n/useLang'
import { StatusBadge } from '../../components/admin/StatusBadge'
import { Receipt } from '../../components/Receipt'
import { NotFound } from '../NotFound'

export function AdminOrderDetail() {
  const { id } = useParams()
  const { t, lang } = useLang()
  const [order, setOrder] = useState(() => getOrder(id))
  const [savingStatus, setSavingStatus] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(false)
  const receiptRef = useRef<HTMLDivElement>(null)

  if (!order) {
    return <NotFound message={t.order.notFound} />
  }

  const zone = getZone(order.address.zone)
  const localizedZone = t.zones[order.address.zone]

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (newStatus === order.status) return
    setSavingStatus(true)
    const updated = updateOrderStatus(order.id, newStatus)
    if (updated) {
      setOrder({ ...updated })
    }
    setTimeout(() => setSavingStatus(false), 500)
  }

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return
    setDownloading(true)
    setDownloadError(false)
    try {
      const dataUrl = await toPng(receiptRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#FBF3E0',
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `${order.id}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (err) {
      console.error('Receipt download error', err)
      setDownloadError(true)
    } finally {
      setDownloading(false)
    }
  }

  const statusLabel = t.admin.status[order.status]
  const waMessage = t.admin.orderDetails.whatsappMessage(
    order.customer.name,
    order.id,
    statusLabel,
    money(order.total)
  )
  const whatsappUrl = buildWhatsAppLink(order.customer.phone, waMessage)

  const history = order.statusHistory && order.statusHistory.length > 0
    ? order.statusHistory
    : [{ status: order.status, timestamp: order.createdAt }]

  return (
    <div className="space-y-space-6 animate-fade-in">
      {/* Top Navigation */}
      <div>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-space-2 font-body text-xs font-semibold uppercase tracking-[0.16em] text-dark/70 hover:text-dark"
        >
          <ArrowLeft size={14} /> {t.admin.orderDetails.backToOrders}
        </Link>
      </div>

      {/* Order Header */}
      <div className="flex flex-col gap-space-4 rounded-lg bg-white/70 p-space-5 shadow-soft ring-1 ring-dark/5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-space-3">
            <h1 className="font-heading text-3xl font-medium text-dark">{order.id}</h1>
            <StatusBadge status={order.status} className="text-xs px-space-3 py-1" />
          </div>
          <p className="mt-1 font-body text-xs text-dark/60">
            {t.order.date}: {formatDateTime(order.createdAt)}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-space-2 sm:gap-space-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-space-2 rounded bg-emerald-700 px-space-4 py-space-2.5 font-body text-xs font-semibold uppercase tracking-[0.1em] text-white shadow transition hover:bg-emerald-800"
          >
            <MessageCircle size={15} />
            <span>{t.admin.orderDetails.contactWhatsApp}</span>
          </a>

          <button
            type="button"
            onClick={handleDownloadReceipt}
            disabled={downloading}
            className="btn-amber text-xs py-space-2.5"
          >
            <Download size={15} />
            <span>{downloading ? t.order.downloading : t.admin.orderDetails.downloadReceipt}</span>
          </button>
        </div>
      </div>

      {downloadError && (
        <p role="alert" className="flex items-center gap-2 rounded bg-red-50 border border-red-800/30 p-space-3 text-xs text-red-900">
          <AlertCircle size={15} /> {t.order.downloadError}
        </p>
      )}

      {/* STATUS CONTROL SECTION */}
      <div className="rounded-lg bg-white/70 p-space-5 shadow-soft ring-1 ring-dark/5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-medium text-dark">{t.admin.orderDetails.statusControlTitle}</h2>
            <p className="font-body text-xs text-dark/60">{t.admin.orderDetails.changeStatus}</p>
          </div>
          {savingStatus && (
            <span className="font-body text-xs font-semibold text-amber-deep animate-pulse">
              Updating…
            </span>
          )}
        </div>

        {/* Status Stepper / Switcher */}
        <div className="mt-space-4 grid grid-cols-2 gap-space-2 sm:grid-cols-5">
          {ORDER_STATUSES.map((status) => {
            const active = order.status === status
            return (
              <button
                key={status}
                type="button"
                onClick={() => handleStatusChange(status)}
                className={`relative flex items-center justify-center gap-2 rounded-md border p-space-3 text-center font-body text-xs font-semibold transition ${
                  active
                    ? 'border-dark bg-dark text-cream shadow'
                    : 'border-dark/15 bg-white/60 text-dark hover:border-dark/40 hover:bg-pale-amber/40'
                }`}
              >
                {active && <Check size={14} className="text-amber" />}
                <span>{t.admin.status[status]}</span>
              </button>
            )
          })}
        </div>

        {/* Status History Timeline */}
        <div className="mt-space-6 border-t border-dark/10 pt-space-4">
          <p className="eyebrow text-dark/60 mb-space-3">{t.admin.orderDetails.statusHistory}</p>
          <div className="space-y-space-2 font-body text-xs">
            {history.map((h, i) => (
              <div key={`${h.status}-${h.timestamp}-${i}`} className="flex items-center gap-space-3 text-dark/80">
                <Clock size={13} className="text-dark/40 shrink-0" />
                <span className="font-semibold">{t.admin.status[h.status]}</span>
                <span className="text-dark/50">· {formatDateTime(h.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2-COLUMN ORDER DETAILS & SUMMARY */}
      <div className="grid gap-space-6 lg:grid-cols-3">
        {/* Left Column (2 cols on lg): Customer, Address, Items */}
        <div className="space-y-space-6 lg:col-span-2">
          {/* Customer & Address Card */}
          <div className="grid gap-space-4 rounded-lg bg-white/70 p-space-5 shadow-soft ring-1 ring-dark/5 sm:grid-cols-2">
            {/* Customer Info */}
            <div>
              <div className="flex items-center gap-2 text-dark font-medium pb-space-2 border-b border-dark/10">
                <User size={16} className="text-amber-deep" />
                <h3 className="font-heading text-lg">{t.admin.orderDetails.customerInfo}</h3>
              </div>
              <dl className="mt-space-3 space-y-space-1.5 font-body text-xs">
                <div>
                  <dt className="text-dark/50">{t.admin.orderDetails.customerName}</dt>
                  <dd className="font-semibold text-dark text-sm">{order.customer.name}</dd>
                </div>
                <div>
                  <dt className="text-dark/50">{t.admin.orderDetails.customerPhone}</dt>
                  <dd className="font-medium text-dark">{order.customer.phone}</dd>
                </div>
              </dl>
            </div>

            {/* Delivery & Zone */}
            <div>
              <div className="flex items-center gap-2 text-dark font-medium pb-space-2 border-b border-dark/10">
                <Truck size={16} className="text-amber-deep" />
                <h3 className="font-heading text-lg">{t.admin.orderDetails.zoneAndEta}</h3>
              </div>
              <dl className="mt-space-3 space-y-space-1.5 font-body text-xs">
                <div>
                  <dt className="text-dark/50">{t.admin.orderDetails.zone}</dt>
                  <dd className="font-semibold text-dark">
                    Zone {order.address.zone}: {localizedZone?.name ?? zone?.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-dark/50">{t.admin.orderDetails.eta}</dt>
                  <dd className="font-medium text-dark">{localizedZone?.eta ?? zone?.eta}</dd>
                </div>
              </dl>
            </div>

            {/* Full Address */}
            <div className="sm:col-span-2 border-t border-dark/10 pt-space-3">
              <div className="flex items-center gap-2 text-dark font-medium">
                <MapPin size={16} className="text-amber-deep" />
                <h3 className="font-heading text-lg">{t.admin.orderDetails.deliveryAddress}</h3>
              </div>
              <div className="mt-space-2 font-body text-xs text-dark space-y-0.5 leading-relaxed">
                <p><span className="text-dark/50">{t.checkout.road}:</span> {order.address.road}</p>
                <p><span className="text-dark/50">{t.checkout.xaafad}:</span> {order.address.xaafad}</p>
                <p><span className="text-dark/50">{t.checkout.district}:</span> {order.address.district}</p>
                <p><span className="text-dark/50">{t.checkout.city}:</span> {order.address.city}</p>
                <p><span className="text-dark/50">{t.checkout.region}:</span> {order.address.region}</p>
                {order.address.landmark && (
                  <p><span className="text-dark/50">{t.checkout.landmark}:</span> {order.address.landmark}</p>
                )}
              </div>
            </div>
          </div>

          {/* Ordered Items Table */}
          <div className="rounded-lg bg-white/70 p-space-5 shadow-soft ring-1 ring-dark/5">
            <h3 className="font-heading text-xl font-medium text-dark pb-space-2 border-b border-dark/10">
              {t.admin.orderDetails.orderedItems} ({order.items.reduce((s, i) => s + i.qty, 0)})
            </h3>
            <div className="mt-space-3 overflow-x-auto">
              <table className="w-full text-left font-body text-xs">
                <thead className="border-b border-dark/10 text-dark/60 uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-2">{t.admin.products.product}</th>
                    <th className="py-2 text-center">{t.order.qty}</th>
                    <th className="py-2 text-right">{t.admin.products.price}</th>
                    <th className="py-2 text-right">{t.admin.orders.total}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark/5">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-space-3 font-medium text-dark">
                        <div>{lang === 'so' ? item.name_so : item.name}</div>
                        <div className="text-[0.68rem] text-dark/50">{item.name}</div>
                      </td>
                      <td className="py-space-3 text-center">{item.qty}</td>
                      <td className="py-space-3 text-right">{money(item.unitPrice)}</td>
                      <td className="py-space-3 text-right font-semibold text-dark">
                        {money(item.unitPrice * item.qty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 col on lg): Totals, Payment & Receipt Preview */}
        <div className="space-y-space-6">
          {/* Order Summary & Payment */}
          <div className="rounded-lg bg-white/70 p-space-5 shadow-soft ring-1 ring-dark/5 space-y-space-4">
            <h3 className="font-heading text-xl font-medium text-dark pb-space-2 border-b border-dark/10">
              {t.admin.orderDetails.orderSummary}
            </h3>

            <dl className="space-y-space-2 font-body text-xs">
              <div className="flex justify-between text-dark/70">
                <dt>{t.cart.subtotal}</dt>
                <dd className="font-medium text-dark">{money(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-dark/70">
                <dt>{t.checkout.delivery}</dt>
                <dd className="font-medium text-dark">
                  {order.deliveryFee === 0 ? t.checkout.free : money(order.deliveryFee)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-dark/10 pt-space-3 text-dark">
                <dt className="font-semibold text-sm">{t.checkout.total}</dt>
                <dd className="font-heading text-2xl font-bold">{money(order.total)}</dd>
              </div>
            </dl>

            <div className="border-t border-dark/10 pt-space-3">
              <div className="flex items-center gap-2 font-body text-xs text-dark/60 mb-1">
                <CreditCard size={14} />
                <span>{t.admin.orderDetails.paymentMethod}</span>
              </div>
              <p className="font-body text-sm font-semibold text-dark">
                {t.checkout.methods[order.payment]}
              </p>
            </div>
          </div>

          {/* Receipt Preview & Download Card */}
          <div className="rounded-lg bg-white/70 p-space-5 shadow-soft ring-1 ring-dark/5">
            <div className="flex items-center justify-between pb-space-3 border-b border-dark/10">
              <h3 className="font-heading text-lg font-medium text-dark">{t.order.receipt}</h3>
              <button
                type="button"
                onClick={handleDownloadReceipt}
                disabled={downloading}
                className="inline-flex items-center gap-1 font-body text-xs font-semibold text-amber-deep hover:underline"
              >
                <Download size={13} />
                <span>{downloading ? t.order.downloading : 'PNG'}</span>
              </button>
            </div>

            <div className="mt-space-4 transform scale-90 -mx-6 sm:scale-100 sm:mx-0">
              <Receipt ref={receiptRef} order={order} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
