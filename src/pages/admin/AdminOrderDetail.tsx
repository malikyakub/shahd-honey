import { useRef, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  MessageCircle,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  MapPin,
  User,
  CreditCard,
  AlertCircle,
  Maximize2,
  X,
} from 'lucide-react'
import { toPng } from 'html-to-image'
import { getOrder, updateOrderStatus, buildWhatsAppLink, type OrderStatus } from '../../lib/orders'
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
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)
  const receiptRef = useRef<HTMLDivElement>(null)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (receiptModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [receiptModalOpen])


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
    setTimeout(() => setSavingStatus(false), 400)
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

  // Regular positive flow statuses
  const progressionStatuses: { status: OrderStatus; icon: typeof Clock }[] = [
    { status: 'pending', icon: Clock },
    { status: 'confirmed', icon: CheckCircle2 },
    { status: 'out_for_delivery', icon: Truck },
    { status: 'delivered', icon: PackageCheck },
  ]

  return (
    <>
    <div className="space-y-6 animate-fade-in">
      {/* Top Back Navigation (44px min touch target, 12px gap) */}
      <div>
        <Link
          to="/admin/orders"
          className="inline-flex min-h-[44px] items-center gap-3 font-body text-xs font-semibold uppercase tracking-[0.16em] text-dark/70 hover:text-dark transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded-[8px] px-2 -ml-2"
        >
          <ArrowLeft size={18} strokeWidth={1.75} />
          <span>{t.admin.orderDetails.backToOrders}</span>
        </Link>
      </div>

      {/* Order Header Card */}
      <div className="flex flex-col gap-4 rounded-[8px] bg-white/70 p-5 shadow-soft ring-1 ring-dark/5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-3xl font-medium text-dark">{order.id}</h1>
            <StatusBadge status={order.status} className="text-xs px-3 py-1 font-bold" />
          </div>
          <p className="mt-1 font-body text-xs text-dark/60">
            {t.order.date}: {formatDateTime(order.createdAt)}
          </p>
        </div>

        {/* Action Buttons: 44px min height, 8px radius, 12px gap with icons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-3 rounded-[8px] bg-[#25D366]/20 border border-[#25D366]/50 px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.1em] text-dark hover:bg-[#25D366] hover:text-white transition shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
          >
            <MessageCircle size={18} strokeWidth={1.75} className="shrink-0 text-emerald-800" />
            <span>{t.admin.orderDetails.contactWhatsApp}</span>
          </a>

          {/* Download Receipt Button (Primary amber fill, dark text) */}
          <button
            type="button"
            onClick={handleDownloadReceipt}
            disabled={downloading}
            className="btn-amber min-h-[44px] rounded-[8px] px-4 py-2.5 text-xs"
          >
            <Download size={18} strokeWidth={1.75} className="shrink-0" />
            <span>{downloading ? t.order.downloading : t.admin.orderDetails.downloadReceipt}</span>
          </button>
        </div>
      </div>

      {downloadError && (
        <p role="alert" className="flex items-center gap-3 rounded-[8px] bg-red-50 border border-red-800/30 p-3 text-xs text-red-900">
          <AlertCircle size={18} strokeWidth={1.75} className="shrink-0" />
          <span>{t.order.downloadError}</span>
        </p>
      )}

      {/* STATUS CONTROL SECTION */}
      <div className="rounded-[8px] bg-white/70 p-5 shadow-soft ring-1 ring-dark/5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-medium text-dark">{t.admin.orderDetails.statusControlTitle}</h2>
            <p className="font-body text-xs text-dark/60 mt-0.5">{t.admin.orderDetails.changeStatus}</p>
          </div>
          {savingStatus && (
            <span className="font-body text-xs font-semibold text-amber-deep animate-pulse">
              Updating…
            </span>
          )}
        </div>

        {/* Regular Status Flow (Same-size buttons in a tidy row / grid: 2x2 on mobile, 4-col on desktop) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {progressionStatuses.map(({ status, icon: Icon }) => {
            const active = order.status === status
            return (
              <button
                key={status}
                type="button"
                onClick={() => handleStatusChange(status)}
                className={`flex min-h-[44px] items-center justify-center gap-3 rounded-[8px] border px-3 py-2.5 text-center font-body text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
                  active
                    ? 'border-dark bg-dark text-cream shadow-sm ring-1 ring-dark'
                    : 'border-dark/15 bg-white/70 text-dark hover:border-dark/40 hover:bg-pale-amber/50'
                }`}
              >
                <Icon size={18} strokeWidth={1.75} className={`shrink-0 ${active ? 'text-amber' : 'text-dark/60'}`} />
                <span className="truncate">{t.admin.status[status]}</span>
              </button>
            )
          })}
        </div>

        {/* Cancel Status visually separate with muted red #B3261E */}
        <div className="pt-2 border-t border-dark/10 flex items-center justify-between">
          <span className="font-body text-xs text-dark/60">
            {order.status === 'cancelled' ? t.admin.status.cancelled : 'Need to cancel this order?'}
          </span>
          <button
            type="button"
            onClick={() => handleStatusChange('cancelled')}
            className={`flex min-h-[44px] items-center justify-center gap-3 rounded-[8px] border px-4 py-2 font-body text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B3261E] ${
              order.status === 'cancelled'
                ? 'bg-[#B3261E] text-white border-[#B3261E] shadow-sm'
                : 'border-[#B3261E]/30 bg-[#B3261E]/10 text-[#B3261E] hover:bg-[#B3261E] hover:text-white'
            }`}
          >
            <XCircle size={18} strokeWidth={1.75} className="shrink-0" />
            <span>{t.admin.status.cancelled}</span>
          </button>
        </div>

        {/* Status History Timeline */}
        <div className="border-t border-dark/10 pt-4">
          <p className="eyebrow text-dark/60 mb-3">{t.admin.orderDetails.statusHistory}</p>
          <div className="space-y-2 font-body text-xs">
            {history.map((h, i) => (
              <div key={`${h.status}-${h.timestamp}-${i}`} className="flex items-center gap-3 text-dark/80">
                <Clock size={16} strokeWidth={1.75} className="text-dark/40 shrink-0" />
                <span className="font-semibold text-dark">{t.admin.status[h.status]}</span>
                <span className="text-dark/50">· {formatDateTime(h.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2-COLUMN ORDER DETAILS & SUMMARY */}
      <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
        {/* Left Column (2 cols on lg): Customer, Address, Items */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Customer & Address Card */}
          <div className="grid gap-4 rounded-[8px] bg-white/70 p-5 shadow-soft ring-1 ring-dark/5 sm:grid-cols-2">
            {/* Customer Info */}
            <div>
              <div className="flex items-center gap-3 text-dark font-medium pb-2 border-b border-dark/10">
                <User size={18} strokeWidth={1.75} className="text-amber-deep shrink-0" />
                <h3 className="font-heading text-lg">{t.admin.orderDetails.customerInfo}</h3>
              </div>
              <dl className="mt-3 space-y-2 font-body text-xs">
                <div>
                  <dt className="text-dark/50">{t.admin.orderDetails.customerName}</dt>
                  <dd className="font-semibold text-dark text-sm mt-0.5">{order.customer.name}</dd>
                </div>
                <div>
                  <dt className="text-dark/50">{t.admin.orderDetails.customerPhone}</dt>
                  <dd className="font-medium text-dark mt-0.5">{order.customer.phone}</dd>
                </div>
              </dl>
            </div>

            {/* Delivery & Zone */}
            <div>
              <div className="flex items-center gap-3 text-dark font-medium pb-2 border-b border-dark/10">
                <Truck size={18} strokeWidth={1.75} className="text-amber-deep shrink-0" />
                <h3 className="font-heading text-lg">{t.admin.orderDetails.zoneAndEta}</h3>
              </div>
              <dl className="mt-3 space-y-2 font-body text-xs">
                <div>
                  <dt className="text-dark/50">{t.admin.orderDetails.zone}</dt>
                  <dd className="font-semibold text-dark mt-0.5">
                    Zone {order.address.zone}: {localizedZone?.name ?? zone?.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-dark/50">{t.admin.orderDetails.eta}</dt>
                  <dd className="font-medium text-dark mt-0.5">{localizedZone?.eta ?? zone?.eta}</dd>
                </div>
              </dl>
            </div>

            {/* Full Address */}
            <div className="sm:col-span-2 border-t border-dark/10 pt-3">
              <div className="flex items-center gap-3 text-dark font-medium">
                <MapPin size={18} strokeWidth={1.75} className="text-amber-deep shrink-0" />
                <h3 className="font-heading text-lg">{t.admin.orderDetails.deliveryAddress}</h3>
              </div>
              <div className="mt-2 font-body text-xs text-dark space-y-1 leading-relaxed">
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
          <div className="rounded-[8px] bg-white/70 p-5 shadow-soft ring-1 ring-dark/5">
            <h3 className="font-heading text-xl font-medium text-dark pb-3 border-b border-dark/10">
              {t.admin.orderDetails.orderedItems} ({order.items.reduce((s, i) => s + i.qty, 0)})
            </h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left font-body text-xs">
                <thead className="border-b border-dark/10 text-dark/60 uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-2.5">{t.admin.products.product}</th>
                    <th className="py-2.5 text-center">{t.order.qty}</th>
                    <th className="py-2.5 text-right">{t.admin.products.price}</th>
                    <th className="py-2.5 text-right">{t.admin.orders.total}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark/5">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-medium text-dark">
                        <div>{lang === 'so' ? item.name_so : item.name}</div>
                        <div className="text-[0.68rem] text-dark/50">{item.name}</div>
                      </td>
                      <td className="py-3 text-center">{item.qty}</td>
                      <td className="py-3 text-right">{money(item.unitPrice)}</td>
                      <td className="py-3 text-right font-semibold text-dark">
                        {money(item.unitPrice * item.qty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 col on lg): Totals, Payment & Receipt Card */}
        <div className="flex flex-col gap-6">
          {/* Order Summary & Payment */}
          <div className="rounded-[8px] bg-white/70 p-5 shadow-soft ring-1 ring-dark/5 space-y-4">
            <h3 className="font-heading text-xl font-medium text-dark pb-3 border-b border-dark/10">
              {t.admin.orderDetails.orderSummary}
            </h3>

            <dl className="space-y-2.5 font-body text-xs">
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
              <div className="flex items-baseline justify-between border-t border-dark/10 pt-3 text-dark">
                <dt className="font-semibold text-sm">{t.checkout.total}</dt>
                <dd className="font-heading text-2xl font-bold">{money(order.total)}</dd>
              </div>
            </dl>

            <div className="border-t border-dark/10 pt-3">
              <div className="flex items-center gap-2 font-body text-xs text-dark/60 mb-1">
                <CreditCard size={16} strokeWidth={1.75} />
                <span>{t.admin.orderDetails.paymentMethod}</span>
              </div>
              <p className="font-body text-sm font-semibold text-dark">
                {t.checkout.methods[order.payment]}
              </p>
            </div>
          </div>

          {/* Expandable Receipt Card — flex-1 fills remaining height to match left column */}
          <div
            role="button"
            tabIndex={0}
            aria-label={t.order.receipt}
            onClick={() => setReceiptModalOpen(true)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setReceiptModalOpen(true)}
            className="group flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-[8px] bg-white/70 p-5 shadow-soft ring-1 ring-dark/5 transition hover:ring-amber/50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream ring-1 ring-dark/10 transition group-hover:ring-amber/60">
              <Maximize2 size={22} strokeWidth={1.75} className="text-amber-deep" />
            </span>
            <div className="text-center">
              <p className="font-heading text-base font-medium text-dark">{t.order.receipt}</p>
              <p className="mt-0.5 font-body text-xs text-dark/50">{t.admin.orderDetails.clickToViewReceipt ?? 'Click to view'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Receipt Modal — fixed to viewport, outside animate-fade-in to avoid transform containment */}
    {receiptModalOpen && (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.order.receipt}
        className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-dark/60 p-4 backdrop-blur-sm sm:items-center sm:p-6"
        onClick={(e) => { if (e.target === e.currentTarget) setReceiptModalOpen(false) }}
        onKeyDown={(e) => { if (e.key === 'Escape') setReceiptModalOpen(false) }}
        tabIndex={-1}
      >
        <div className="relative my-auto w-full max-w-md">
          {/* Modal action bar */}
          <div className="mb-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleDownloadReceipt}
              disabled={downloading}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-[8px] bg-amber px-4 py-2 font-body text-xs font-semibold text-dark shadow-sm transition hover:bg-amber/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
            >
              <Download size={16} strokeWidth={1.75} />
              <span>{downloading ? t.order.downloading : t.admin.orderDetails.downloadReceipt}</span>
            </button>
            <button
              type="button"
              onClick={() => setReceiptModalOpen(false)}
              aria-label="Close"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-dark shadow-sm transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
          </div>
          {/* Receipt */}
          <Receipt ref={receiptRef} order={order} />
        </div>
      </div>
    )}
    </>
  )
}

