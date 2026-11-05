import type { OrderStatus } from '../../lib/orders'
import { useLang } from '../../i18n/useLang'

export function StatusBadge({ status, className = '' }: { status: OrderStatus; className?: string }) {
  const { t } = useLang()
  const label = t.admin.status[status] ?? status

  let style = 'bg-dark/10 text-dark border-dark/20'
  switch (status) {
    case 'pending':
      style = 'bg-amber text-dark font-bold shadow-sm'
      break
    case 'confirmed':
      style = 'bg-sky-100 text-sky-950 border border-sky-300 font-semibold'
      break
    case 'out_for_delivery':
      style = 'bg-purple-100 text-purple-950 border border-purple-300 font-semibold'
      break
    case 'delivered':
      style = 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-semibold'
      break
    case 'cancelled':
      style = 'bg-rose-100 text-rose-900 border border-rose-300 font-semibold'
      break
  }

  return (
    <span
      className={`inline-flex items-center rounded-sm px-space-2 py-[2px] font-body text-[0.68rem] uppercase tracking-[0.12em] ${style} ${className}`}
    >
      {label}
    </span>
  )
}
