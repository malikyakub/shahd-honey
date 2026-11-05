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
        // Search filter: order #, name, phone, city
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
    <div className="space-y-6 animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="font-heading text-3xl font-medium text-dark sm:text-4xl">{t.admin.orders.title}</h1>
        <p className="font-body text-xs text-dark/60 mt-1">{t.admin.orders.subtitle}</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input: 44px height, 8px radius */}
        <div className="relative flex-1 max-w-md">
          <Search size={18} strokeWidth={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.admin.orders.searchPlaceholder}
            className="h-11 w-full rounded-[8px] border border-dark/15 bg-white/80 py-2.5 pl-10 pr-4 font-body text-xs text-dark placeholder:text-dark/40 transition focus:border-amber focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber/60"
          />
        </div>

        {/* Status Filter Pill Bar: 16px horizontal (px-4), 8px vertical (py-2), active amber with dark text, horizontally scrollable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-nowrap pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`flex shrink-0 items-center whitespace-nowrap rounded-full px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
              statusFilter === 'all'
                ? 'bg-amber text-dark font-bold shadow-sm'
                : 'bg-white/70 text-dark/70 hover:bg-pale-amber/60 hover:text-dark border border-dark/15'
            }`}
          >
            <span>{t.admin.orders.allStatuses}</span>
            <span
              className={`ml-2 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[0.65rem] ${
                statusFilter === 'all' ? 'bg-dark text-cream' : 'bg-dark/10 text-dark'
              }`}
            >
              {orders.length}
            </span>
          </button>

          {ORDER_STATUSES.map((status) => {
            const count = orders.filter((o) => o.status === status).length
            const active = statusFilter === status
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`flex shrink-0 items-center whitespace-nowrap rounded-full px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
                  active
                    ? 'bg-amber text-dark font-bold shadow-sm'
                    : 'bg-white/70 text-dark/70 hover:bg-pale-amber/60 hover:text-dark border border-dark/15'
                }`}
              >
                <span>{t.admin.status[status]}</span>
                <span
                  className={`ml-2 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[0.65rem] ${
                    active ? 'bg-dark text-cream' : 'bg-dark/10 text-dark'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Orders List Container */}
      <div className="rounded-[8px] bg-white/70 shadow-soft ring-1 ring-dark/5 overflow-hidden">
        <div className="border-b border-dark/10 px-4 py-3 text-xs text-dark/60 font-body flex items-center justify-between">
          <span>{t.admin.orders.showingCount(filteredOrders.length, orders.length)}</span>
          <span className="flex items-center gap-1.5 text-[0.7rem] text-dark/40 font-medium">
            <ArrowUpDown size={14} strokeWidth={1.75} /> Newest first
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center px-4">
            <Filter size={28} strokeWidth={1.75} className="mx-auto text-dark/30" />
            <p className="mt-3 font-body text-sm text-dark/60">{t.admin.orders.noMatchingOrders}</p>
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
                    <th className="py-3.5 px-4">{t.admin.orders.phone}</th>
                    <th className="py-3.5 px-4">{t.admin.orders.city}</th>
                    <th className="py-3.5 px-4">{t.admin.orders.total}</th>
                    <th className="py-3.5 px-4">{t.admin.orders.payment}</th>
                    <th className="py-3.5 px-4">{t.admin.orders.status}</th>
                    <th className="py-3.5 px-4 text-right">{t.admin.orders.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark/5">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-white/90">
                      <td className="py-3.5 px-4 font-semibold text-dark">
                        <Link to={`/admin/orders/${order.id}`} className="hover:text-amber-deep">
                          {order.id}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-dark/70 whitespace-nowrap">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-dark">{order.customer.name}</td>
                      <td className="py-3.5 px-4 text-dark/70 whitespace-nowrap">{order.customer.phone}</td>
                      <td className="py-3.5 px-4 text-dark/80">{order.address.city}</td>
                      <td className="py-3.5 px-4 font-semibold text-dark whitespace-nowrap">
                        {money(order.total)}
                      </td>
                      <td className="py-3.5 px-4 text-dark/70">
                        {t.checkout.methods[order.payment]}
                      </td>
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
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Link to={`/admin/orders/${order.id}`} className="font-semibold text-dark text-xs hover:text-amber-deep">
                      {order.id}
                    </Link>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs">
                    <div className="min-w-0">
                      <p className="text-dark/50 text-[0.68rem] uppercase tracking-wider">{t.admin.orders.customer}</p>
                      <p className="font-medium text-dark break-words">{order.customer.name}</p>
                      <p className="text-dark/60 text-[0.7rem]">{order.customer.phone}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-dark/50 text-[0.68rem] uppercase tracking-wider">{t.admin.orders.city} & {t.admin.orders.payment}</p>
                      <p className="font-medium text-dark break-words">{order.address.city}</p>
                      <p className="text-dark/60 text-[0.7rem]">{t.checkout.methods[order.payment]}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-dark/5 pt-2">
                    <div>
                      <span className="text-[0.68rem] text-dark/50 mr-2">{formatDateTime(order.createdAt)}</span>
                      <span className="font-semibold text-dark text-base">{money(order.total)}</span>
                    </div>
                    {/* Secondary button with 44px min-height on mobile touch target */}
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-[8px] border border-dark/20 bg-cream/70 px-4 py-2 text-xs font-semibold text-dark hover:bg-pale-amber/60 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
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
    </div>
  )
}
