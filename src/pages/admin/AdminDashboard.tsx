import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Banknote, Clock, CheckCircle2, Trash2, ArrowRight, AlertTriangle, Eye } from 'lucide-react'
import { useOrders, clearOrders } from '../../lib/orders'
import { formatDateTime, money } from '../../lib/format'
import { useLang } from '../../i18n/useLang'
import { StatusBadge } from '../../components/admin/StatusBadge'

export function AdminDashboard() {
  const { t } = useLang()
  const orders = useOrders()
  const [showClearModal, setShowClearModal] = useState(false)

  // Calculations
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length

  // 5 Most recent orders (newest first)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const handleConfirmClear = () => {
    clearOrders()
    setShowClearModal(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-medium text-dark sm:text-4xl">{t.admin.dashboard.title}</h1>
          <p className="font-body text-xs text-dark/60 mt-1">{t.admin.dashboard.subtitle}</p>
        </div>

        {orders.length > 0 && (
          <div>
            {/* Destructive button with Trash2 (size 18, strokeWidth 1.75, 12px gap, min-h 44px, 8px radius, muted red #B3261E) */}
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="inline-flex min-h-[44px] items-center gap-3 rounded-[8px] border border-[#B3261E]/30 bg-[#B3261E]/10 px-4 py-2.5 font-body text-xs font-semibold text-[#B3261E] transition hover:bg-[#B3261E] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B3261E]"
            >
              <Trash2 size={18} strokeWidth={1.75} className="shrink-0" />
              <span>{t.admin.dashboard.clearOrders}</span>
            </button>
          </div>
        )}
      </div>

      {/* STAT CARDS (1 per row below 360px, 2 per row above 360px, 4 on desktop) */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Orders */}
        <div className="rounded-[8px] bg-white/70 p-4 sm:p-5 shadow-soft ring-1 ring-dark/5">
          <div className="flex items-center justify-between text-dark/60">
            <span className="eyebrow text-dark/60">{t.admin.dashboard.totalOrders}</span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-pale-amber/60 text-dark">
              <ShoppingBag size={18} strokeWidth={1.75} />
            </span>
          </div>
          <p className="mt-3 font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-dark break-all">{totalOrders}</p>
        </div>

        {/* Total Revenue */}
        <div className="rounded-[8px] bg-white/70 p-4 sm:p-5 shadow-soft ring-1 ring-dark/5">
          <div className="flex items-center justify-between text-dark/60">
            <span className="eyebrow text-dark/60">{t.admin.dashboard.totalRevenue}</span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-pale-amber/60 text-amber-deep">
              <Banknote size={18} strokeWidth={1.75} />
            </span>
          </div>
          <p className="mt-3 font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-dark break-all">{money(totalRevenue)}</p>
        </div>

        {/* Pending Orders */}
        <div className="rounded-[8px] bg-white/70 p-4 sm:p-5 shadow-soft ring-1 ring-dark/5">
          <div className="flex items-center justify-between text-dark/60">
            <span className="eyebrow text-amber-deep">{t.admin.dashboard.pendingOrders}</span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-amber/25 text-amber-deep">
              <Clock size={18} strokeWidth={1.75} />
            </span>
          </div>
          <p className="mt-3 font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-dark break-all">{pendingCount}</p>
        </div>

        {/* Delivered Orders */}
        <div className="rounded-[8px] bg-white/70 p-4 sm:p-5 shadow-soft ring-1 ring-dark/5">
          <div className="flex items-center justify-between text-dark/60">
            <span className="eyebrow text-emerald-900">{t.admin.dashboard.deliveredOrders}</span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-emerald-100 text-emerald-900">
              <CheckCircle2 size={18} strokeWidth={1.75} />
            </span>
          </div>
          <p className="mt-3 font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-dark break-all">{deliveredCount}</p>
        </div>
      </div>

      {/* 5 RECENT ORDERS */}
      <div className="rounded-[8px] bg-white/70 shadow-soft ring-1 ring-dark/5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-dark/10 p-4 sm:p-5">
          <div>
            <h2 className="font-heading text-xl font-medium text-dark sm:text-2xl">{t.admin.dashboard.recentOrders}</h2>
            <p className="font-body text-xs text-dark/55 mt-0.5">
              {orders.length > 0
                ? t.admin.orders.showingCount(recentOrders.length, orders.length)
                : t.admin.dashboard.noOrders}
            </p>
          </div>

          {orders.length > 0 && (
            <Link
              to="/admin/orders"
              className="inline-flex min-h-[44px] items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.14em] text-amber-deep hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded-[8px] px-2"
            >
              <span>{t.admin.dashboard.viewAllOrders}</span>
              <ArrowRight size={18} strokeWidth={1.75} />
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center px-4">
            <ShoppingBag size={32} className="mx-auto text-dark/30" />
            <p className="mt-3 font-body text-sm text-dark/60">{t.admin.dashboard.noOrders}</p>
            <Link to="/shop" className="btn-amber mt-4 min-h-[44px] rounded-[8px] text-xs">
              {t.home.shopNow}
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left font-body text-xs">
                <thead className="border-b border-dark/10 bg-pale-amber/20 text-dark/70 uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3.5 px-4">{t.admin.orders.orderNo}</th>
                    <th className="py-3.5 px-4">{t.admin.orders.date}</th>
                    <th className="py-3.5 px-4">{t.admin.orders.customer}</th>
                    <th className="py-3.5 px-4">{t.admin.orders.city}</th>
                    <th className="py-3.5 px-4">{t.admin.orders.total}</th>
                    <th className="py-3.5 px-4">{t.admin.orders.status}</th>
                    <th className="py-3.5 px-4 text-right">{t.admin.orders.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark/5">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-white/90">
                      <td className="py-3.5 px-4 font-semibold text-dark">
                        <Link to={`/admin/orders/${order.id}`} className="hover:text-amber-deep">
                          {order.id}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-dark/70 whitespace-nowrap">{formatDateTime(order.createdAt)}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-dark">{order.customer.name}</div>
                        <div className="text-[0.68rem] text-dark/50">{order.customer.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-dark/80">{order.address.city}</td>
                      <td className="py-3.5 px-4 font-semibold text-dark">{money(order.total)}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {/* Secondary outlined button */}
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="inline-flex min-h-[36px] items-center gap-2 rounded-[8px] border border-dark/20 bg-cream/50 px-3 py-1.5 text-xs font-semibold text-dark hover:border-dark hover:bg-pale-amber/60 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                        >
                          <Eye size={16} strokeWidth={1.75} />
                          <span>{t.admin.orders.view}</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (< 768px down to 375px) */}
            <div className="md:hidden divide-y divide-dark/10">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Link to={`/admin/orders/${order.id}`} className="font-semibold text-dark text-xs hover:text-amber-deep">
                      {order.id}
                    </Link>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex items-baseline justify-between text-xs">
                    <div>
                      <p className="font-medium text-dark">{order.customer.name}</p>
                      <p className="text-dark/50 text-[0.7rem]">{order.address.city} · {order.customer.phone}</p>
                    </div>
                    <p className="font-semibold text-dark text-base">{money(order.total)}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[0.68rem] text-dark/50">{formatDateTime(order.createdAt)}</span>
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-[8px] border border-dark/20 bg-cream/70 px-4 py-2 text-xs font-semibold text-dark hover:bg-pale-amber/60 transition"
                    >
                      <Eye size={16} strokeWidth={1.75} />
                      <span>{t.admin.orders.view}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* In-page Confirm Modal for "Clear demo orders" (NOT window.confirm) */}
      {showClearModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 p-4 backdrop-blur-sm animate-fade-in"
        >
          <div className="relative w-full max-w-md rounded-[8px] bg-cream p-6 shadow-lift ring-1 ring-dark/10">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#B3261E]/15 text-[#B3261E]">
                <AlertTriangle size={20} strokeWidth={1.75} />
              </span>
              <div>
                <h3 id="clear-modal-title" className="font-heading text-xl font-medium text-dark">
                  {t.admin.dashboard.clearConfirmTitle}
                </h3>
                <p className="mt-2 font-body text-xs leading-relaxed text-dark/70">
                  {t.admin.dashboard.clearConfirmText}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="min-h-[44px] rounded-[8px] border border-dark/20 px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider text-dark hover:bg-pale-amber/40 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-dark"
              >
                {t.admin.dashboard.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="min-h-[44px] rounded-[8px] bg-[#B3261E] px-5 py-2 font-body text-xs font-semibold uppercase tracking-wider text-white shadow hover:bg-[#B3261E]/90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B3261E]"
              >
                {t.admin.dashboard.confirmClear}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
