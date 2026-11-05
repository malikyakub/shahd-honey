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
    <div className="space-y-space-7 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col gap-space-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-medium text-dark sm:text-4xl">{t.admin.dashboard.title}</h1>
          <p className="font-body text-xs text-dark/60 mt-0.5">{t.admin.dashboard.subtitle}</p>
        </div>

        {orders.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="inline-flex items-center gap-space-2 rounded border border-red-800/20 bg-red-50/80 px-space-3 py-space-2 font-body text-xs font-semibold text-red-900 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-800/40"
            >
              <Trash2 size={14} />
              <span>{t.admin.dashboard.clearOrders}</span>
            </button>
          </div>
        )}
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 gap-space-4 lg:grid-cols-4">
        {/* Total Orders */}
        <div className="rounded-lg bg-white/70 p-space-4 sm:p-space-5 shadow-soft ring-1 ring-dark/5">
          <div className="flex items-center justify-between text-dark/60">
            <span className="eyebrow text-dark/60">{t.admin.dashboard.totalOrders}</span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-pale-amber/60 text-dark">
              <ShoppingBag size={16} strokeWidth={1.8} />
            </span>
          </div>
          <p className="mt-space-2 font-heading text-3xl sm:text-4xl font-semibold text-dark">{totalOrders}</p>
        </div>

        {/* Total Revenue */}
        <div className="rounded-lg bg-white/70 p-space-4 sm:p-space-5 shadow-soft ring-1 ring-dark/5">
          <div className="flex items-center justify-between text-dark/60">
            <span className="eyebrow text-dark/60">{t.admin.dashboard.totalRevenue}</span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-pale-amber/60 text-amber-deep">
              <Banknote size={16} strokeWidth={1.8} />
            </span>
          </div>
          <p className="mt-space-2 font-heading text-3xl sm:text-4xl font-semibold text-dark">{money(totalRevenue)}</p>
        </div>

        {/* Pending Orders */}
        <div className="rounded-lg bg-white/70 p-space-4 sm:p-space-5 shadow-soft ring-1 ring-dark/5">
          <div className="flex items-center justify-between text-dark/60">
            <span className="eyebrow text-amber-deep">{t.admin.dashboard.pendingOrders}</span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-amber/25 text-amber-deep">
              <Clock size={16} strokeWidth={1.8} />
            </span>
          </div>
          <p className="mt-space-2 font-heading text-3xl sm:text-4xl font-semibold text-dark">{pendingCount}</p>
        </div>

        {/* Delivered Orders */}
        <div className="rounded-lg bg-white/70 p-space-4 sm:p-space-5 shadow-soft ring-1 ring-dark/5">
          <div className="flex items-center justify-between text-dark/60">
            <span className="eyebrow text-emerald-900">{t.admin.dashboard.deliveredOrders}</span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-emerald-100 text-emerald-900">
              <CheckCircle2 size={16} strokeWidth={1.8} />
            </span>
          </div>
          <p className="mt-space-2 font-heading text-3xl sm:text-4xl font-semibold text-dark">{deliveredCount}</p>
        </div>
      </div>

      {/* 5 RECENT ORDERS */}
      <div className="rounded-lg bg-white/70 shadow-soft ring-1 ring-dark/5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-dark/10 p-space-4 sm:p-space-5">
          <div>
            <h2 className="font-heading text-xl font-medium text-dark sm:text-2xl">{t.admin.dashboard.recentOrders}</h2>
            <p className="font-body text-xs text-dark/55">
              {orders.length > 0
                ? t.admin.orders.showingCount(recentOrders.length, orders.length)
                : t.admin.dashboard.noOrders}
            </p>
          </div>

          {orders.length > 0 && (
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1 font-body text-xs font-semibold uppercase tracking-[0.14em] text-amber-deep hover:underline"
            >
              <span>{t.admin.dashboard.viewAllOrders}</span>
              <ArrowRight size={13} />
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-space-8 text-center px-space-4">
            <ShoppingBag size={32} className="mx-auto text-dark/30" />
            <p className="mt-space-3 font-body text-sm text-dark/60">{t.admin.dashboard.noOrders}</p>
            <Link to="/shop" className="btn-amber mt-space-4 text-xs">
              {t.home.shopNow}
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left font-body text-xs">
                <thead className="border-b border-dark/10 bg-pale-amber/20 text-dark/70 uppercase tracking-wider text-[0.7rem]">
                  <tr>
                    <th className="py-space-3 px-space-4">{t.admin.orders.orderNo}</th>
                    <th className="py-space-3 px-space-4">{t.admin.orders.date}</th>
                    <th className="py-space-3 px-space-4">{t.admin.orders.customer}</th>
                    <th className="py-space-3 px-space-4">{t.admin.orders.city}</th>
                    <th className="py-space-3 px-space-4">{t.admin.orders.total}</th>
                    <th className="py-space-3 px-space-4">{t.admin.orders.status}</th>
                    <th className="py-space-3 px-space-4 text-right">{t.admin.orders.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark/5">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-white/90">
                      <td className="py-space-3 px-space-4 font-semibold text-dark">
                        <Link to={`/admin/orders/${order.id}`} className="hover:text-amber-deep">
                          {order.id}
                        </Link>
                      </td>
                      <td className="py-space-3 px-space-4 text-dark/70">{formatDateTime(order.createdAt)}</td>
                      <td className="py-space-3 px-space-4">
                        <div className="font-medium text-dark">{order.customer.name}</div>
                        <div className="text-[0.68rem] text-dark/50">{order.customer.phone}</div>
                      </td>
                      <td className="py-space-3 px-space-4 text-dark/80">{order.address.city}</td>
                      <td className="py-space-3 px-space-4 font-semibold text-dark">{money(order.total)}</td>
                      <td className="py-space-3 px-space-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-space-3 px-space-4 text-right">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 rounded bg-cream px-space-2.5 py-1 text-[0.72rem] font-semibold text-dark hover:bg-pale-amber hover:text-amber-deep transition"
                        >
                          <Eye size={12} />
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
                <div key={order.id} className="p-space-4 space-y-space-2">
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
                    <p className="font-semibold text-dark text-sm">{money(order.total)}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[0.68rem] text-dark/50">{formatDateTime(order.createdAt)}</span>
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-[0.72rem] font-semibold text-amber-deep hover:underline"
                    >
                      <span>{t.admin.orders.view}</span>
                      <ArrowRight size={11} />
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 p-space-4 backdrop-blur-sm animate-fade-in"
        >
          <div className="relative w-full max-w-md rounded-lg bg-cream p-space-6 shadow-lift ring-1 ring-dark/10">
            <div className="flex items-start gap-space-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-900">
                <AlertTriangle size={20} />
              </span>
              <div>
                <h3 id="clear-modal-title" className="font-heading text-xl font-medium text-dark">
                  {t.admin.dashboard.clearConfirmTitle}
                </h3>
                <p className="mt-space-2 font-body text-xs leading-relaxed text-dark/70">
                  {t.admin.dashboard.clearConfirmText}
                </p>
              </div>
            </div>

            <div className="mt-space-6 flex items-center justify-end gap-space-3">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="rounded border border-dark/20 px-space-4 py-space-2 font-body text-xs font-semibold uppercase tracking-wider text-dark hover:bg-pale-amber/40 transition"
              >
                {t.admin.dashboard.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="rounded bg-red-800 px-space-4 py-space-2 font-body text-xs font-semibold uppercase tracking-wider text-white shadow hover:bg-red-900 transition"
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
