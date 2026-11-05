import { NavLink, Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, Package, Archive, ExternalLink, LogOut } from 'lucide-react'
import { brand } from '../../data/brand'
import { useLang } from '../../i18n/useLang'
import { LangToggle } from '../LangToggle'

export function AdminLayout({ onLogout }: { onLogout: () => void }) {
  const { t } = useLang()

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-space-3 rounded px-space-3 py-space-2.5 font-body text-xs font-semibold uppercase tracking-[0.14em] transition ${
      isActive
        ? 'bg-amber text-dark font-bold shadow-sm'
        : 'text-cream/70 hover:bg-cream/10 hover:text-cream'
    }`

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 py-space-2 font-body text-[0.72rem] font-semibold uppercase tracking-[0.1em] border-b-2 transition ${
      isActive
        ? 'border-amber text-amber'
        : 'border-transparent text-cream/70 hover:text-cream'
    }`

  return (
    <div className="flex min-h-[100svh] flex-col md:flex-row bg-cream text-dark">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col justify-between border-r border-cream/10 bg-dark text-cream p-space-6 shrink-0 sticky top-0 h-screen">
        <div>
          {/* Brand Wordmark */}
          <Link to="/admin" className="block focus:outline-none">
            <span className="font-heading text-3xl font-medium tracking-wide text-cream">{brand.wordmark}</span>
            <span className="mt-[2px] block pl-[0.32em] font-body text-[0.55rem] font-semibold uppercase tracking-brand text-amber">
              {t.admin.badge}
            </span>
          </Link>

          {/* Nav Items */}
          <nav className="mt-space-7 space-y-space-2">
            <NavLink to="/admin" end className={navLinkClass}>
              <LayoutDashboard size={18} strokeWidth={1.8} />
              <span>{t.admin.nav.dashboard}</span>
            </NavLink>
            <NavLink to="/admin/orders" className={navLinkClass}>
              <Package size={18} strokeWidth={1.8} />
              <span>{t.admin.nav.orders}</span>
            </NavLink>
            <NavLink to="/admin/products" className={navLinkClass}>
              <Archive size={18} strokeWidth={1.8} />
              <span>{t.admin.nav.products}</span>
            </NavLink>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-space-4 border-t border-cream/10 pt-space-5">
          <Link
            to="/"
            className="flex items-center gap-space-2 font-body text-xs text-cream/70 transition hover:text-cream"
          >
            <ExternalLink size={15} />
            <span>{t.admin.nav.viewStore}</span>
          </Link>

          <div className="flex items-center justify-between">
            <LangToggle />
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-space-1.5 rounded bg-cream/10 px-space-3 py-space-1.5 font-body text-xs font-medium text-cream/80 transition hover:bg-red-950/80 hover:text-red-200"
              title={t.admin.nav.logout}
            >
              <LogOut size={14} />
              <span>{t.admin.nav.logout}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden sticky top-0 z-40 border-b border-cream/10 bg-dark text-cream">
        <div className="flex items-center justify-between px-space-4 py-space-3">
          <Link to="/admin" className="leading-none">
            <span className="font-heading text-2xl font-medium tracking-wide text-cream">{brand.wordmark}</span>
            <span className="ml-2 font-body text-[0.55rem] font-semibold uppercase tracking-brand text-amber">
              {t.admin.badge}
            </span>
          </Link>
          <div className="flex items-center gap-space-2">
            <LangToggle />
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex h-8 w-8 items-center justify-center rounded bg-cream/10 text-cream/80 transition hover:bg-red-950 hover:text-red-300"
              aria-label={t.admin.nav.logout}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Tabs */}
        <nav className="flex items-center justify-around border-t border-cream/10 px-space-2">
          <NavLink to="/admin" end className={mobileNavLinkClass}>
            <LayoutDashboard size={14} />
            <span>{t.admin.nav.dashboard}</span>
          </NavLink>
          <NavLink to="/admin/orders" className={mobileNavLinkClass}>
            <Package size={14} />
            <span>{t.admin.nav.orders}</span>
          </NavLink>
          <NavLink to="/admin/products" className={mobileNavLinkClass}>
            <Archive size={14} />
            <span>{t.admin.nav.products}</span>
          </NavLink>
          <Link to="/" className="flex items-center gap-1 py-space-2 font-body text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-cream/60 hover:text-cream">
            <ExternalLink size={13} />
            <span>Store</span>
          </Link>
        </nav>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 bg-cream">
        <div className="mx-auto w-full max-w-6xl p-space-4 sm:p-space-6 lg:p-space-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
