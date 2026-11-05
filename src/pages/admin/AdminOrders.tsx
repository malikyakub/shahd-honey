import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye, Filter, ArrowUpDown } from 'lucide-react'
import { useOrders, type OrderStatus, ORDER_STATUSES } from '../../lib/orders'
import { formatDateTime, money } from '../../lib/format'
import { useLang } from '../../i18n/useLang'
import { StatusBadge } from '../../components/admin/StatusBadge'

export function AdminOrders() {
  const { t } = useLang()
  const orders = useOrders()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all')

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase()
    return [...orders]
      .filter((o) => {
        // Status filter
        if (statusFilter !== 'all' && o.status !== statusFilter) return false
        // Search filter: order #, name, phone
        if (q) {
          const matchId = o.id.toLowerCase().includes(q)
          const matchName = o.customer.name.toLowerCase().includes(q)
          const matchPhone = o.customer.phone.toLowerCase().includes(q)
          const matchCity = o.address.city.toLowerCase().includes(q)
          if (!matchId && !matchName && !matchPhone && !matchCity) return false
        }
        return true
      })
      // Newest first
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [orders, search, statusFilter])

  return (
    <div className="space-y-space-6 animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="font-heading text-3xl font-medium text-dark sm:text-4xl">{t.admin.orders.title}</h1>
        <p className="font-body text-xs text-dark/60 mt-0.5">{t.admin.orders.subtitle}</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-space-3 md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-space-3 top-1/2 -translate-y-1/2 text-dark/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.admin.orders.searchPlaceholder}
            className="w-full rounded border border-dark/15 bg-white/80 py-2.5 pl-9 pr-4 font-body text-xs text-dark placeholder:text-dark/40 transition focus:border-amber focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber"
          />
        </div>

        {/* Status Filter Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`whitespace-nowrap rounded-full px-space-3 py-1 font-body text-[0.72rem] font-semibold uppercase tracking-wider transition ${
              statusFilter === 'all'
                ? 'bg-dark text-cream shadow-sm'
                : 'bg-white/60 text-dark/70 hover:bg-pale-amber/60 hover:text-dark border border-dark/10'
            }`}
          >
            {t.admin.orders.allStatuses} ({orders.length})
          </button>
          {ORDER_STATUSES.map((status) => {
            const count = orders.filter((o) => o.status === status).length
            const active = statusFilter === status
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`whitespace-nowrap rounded-full px-space-3 py-1 font-body text-[0.72rem] font-semibold uppercase tracking-wider transition ${
                  active
                    ? 'bg-dark text-cream shadow-sm'
                    : 'bg-white/60 text-dark/70 hover:bg-pale-amber/60 hover:text-dark border border-dark/10'
                }`}
              >
                {t.admin.status[status]} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Orders List Container */}
      <div className="rounded-lg bg-white/70 shadow-soft ring-1 ring-dark/5 overflow-hidden">
        <div className="border-b border-dark/10 px-space-4 py-space-3 text-xs text-dark/60 font-body flex items-center justify-between">
          <span>{t.admin.orders.showingCount(filteredOrders.length, orders.length)}</span>
          <span className="flex items-center gap-1 text-[0.7rem] text-dark/40">
            <ArrowUpDown size={12} /> Newest first
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="py-space-9 text-center px-space-4">
            <Filter size={28} className="mx-auto text-dark/30" />
            <p className="mt-space-3 font-body text-sm text-dark/60">{t.admin.orders.noMatchingOrders}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left font-body text-xs">
                <thead className="border-b border-dark/10 bg-pale-amber/20 text-dark/70 uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-space-3 px-space-4">{t.admin.orders.orderNo}</th>
                    <th className="py-space-3 px-space-4">{t.admin.orders.date}</th>
                    <th className="py-space-3 px-space-4">{t.admin.orders.customer}</th>
                    <th className="py-space-3 px-space-4">{t.admin.orders.phone}</th>
                    <th className="py-space-3 px-space-4">{t.admin.orders.city}</th>
                    <th className="py-space-3 px-space-4">{t.admin.orders.total}</th>
                    <th className="py-space-3 px-space-4">{t.admin.orders.payment}</th>
                    <th className="py-space-3 px-space-4">{t.admin.orders.status}</th>
                    <th className="py-space-3 px-space-4 text-right">{t.admin.orders.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark/5">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-white/90">
                      <td className="py-space-3 px-space-4 font-semibold text-dark">
                        <Link to={`/admin/orders/${order.id}`} className="hover:text-amber-deep">
                          {order.id}
                        </Link>
                      </td>
                      <td className="py-space-3 px-space-4 text-dark/70 whitespace-nowrap">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="py-space-3 px-space-4 font-medium text-dark">{order.customer.name}</td>
                      <td className="py-space-3 px-space-4 text-dark/70 whitespace-nowrap">{order.customer.phone}</td>
                      <td className="py-space-3 px-space-4 text-dark/80">{order.address.city}</td>
                      <td className="py-space-3 px-space-4 font-semibold text-dark whitespace-nowrap">
                        {money(order.total)}
                      </td>
                      <td className="py-space-3 px-space-4 text-dark/70">
                        {t.checkout.methods[order.payment]}
                      </td>
                      <td className="py-space-3 px-space-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-space-3 px-space-4 text-right whitespace-nowrap">
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
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-space-4 space-y-space-2.5">
                  <div className="flex items-center justify-between">
                    <Link to={`/admin/orders/${order.id}`} className="font-semibold text-dark text-xs hover:text-amber-deep">
                      {order.id}
                    </Link>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-dark/50 text-[0.68rem] uppercase tracking-wider">{t.admin.orders.customer}</p>
                      <p className="font-medium text-dark">{order.customer.name}</p>
                      <p className="text-dark/60 text-[0.7rem]">{order.customer.phone}</p>
                    </div>
                    <div>
                      <p className="text-dark/50 text-[0.68rem] uppercase tracking-wider">{t.admin.orders.city} & {t.admin.orders.payment}</p>
                      <p className="font-medium text-dark">{order.address.city}</p>
                      <p className="text-dark/60 text-[0.7rem]">{t.checkout.methods[order.payment]}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-dark/5 pt-space-2">
                    <div>
                      <span className="text-[0.68rem] text-dark/50 mr-2">{formatDateTime(order.createdAt)}</span>
                      <span className="font-semibold text-dark text-sm">{money(order.total)}</span>
                    </div>
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="btn-dark py-1.5 px-3 text-[0.72rem]"
                    >
                      <Eye size={12} />
                      <span>{t.admin.orders.view}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
