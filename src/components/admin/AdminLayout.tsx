import { NavLink, Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Package, Store, LogOut } from 'lucide-react'
import { useLang } from '../../i18n/useLang'
import { LangToggle } from '../LangToggle'

export function AdminLayout({ onLogout }: { onLogout: () => void }) {
  const { t } = useLang()

  // Desktop nav item style: 44px tall, 16px px, 8px radius, 12px gap with icon
  const desktopNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex h-11 w-full items-center gap-3 rounded-[8px] px-4 font-body text-xs font-semibold uppercase tracking-[0.12em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
      isActive
        ? 'bg-amber text-dark font-bold shadow-sm'
        : 'text-cream/70 hover:bg-cream/10 hover:text-cream'
    }`

  // Mobile bottom tab: at least 56px tall, icon above label, active in amber
  const mobileTabClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-1 flex-col items-center justify-center min-h-[56px] gap-1 py-1 font-body text-[0.68rem] font-semibold uppercase tracking-wider transition ${
      isActive ? 'text-amber' : 'text-cream/60 hover:text-cream'
    }`

  return (
    <div className="flex min-h-[100svh] flex-col md:flex-row bg-cream text-dark">
      {/* DESKTOP SIDEBAR (~256px wide, dark #101010) */}
      <aside className="hidden md:flex w-64 flex-col justify-between border-r border-cream/10 bg-dark text-cream shrink-0 sticky top-0 h-screen overflow-y-auto z-30">
        <div>
          {/* Top Wordmark with 24px (p-6) padding & thin divider */}
          <div className="p-6 border-b border-cream/10">
            <Link to="/admin" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded-[8px]">
              <img src="/light.svg" alt="Shahd Honey" width={160} height={44} className="h-8 w-auto" />
            </Link>
          </div>

          {/* Navigation Items (4px gap between items) */}
          <nav className="p-4 space-y-1">
            <NavLink to="/admin" end className={desktopNavClass}>
              <LayoutDashboard size={18} strokeWidth={1.75} className="shrink-0" />
              <span>{t.admin.nav.dashboard}</span>
            </NavLink>
            <NavLink to="/admin/orders" className={desktopNavClass}>
              <ClipboardList size={18} strokeWidth={1.75} className="shrink-0" />
              <span>{t.admin.nav.orders}</span>
            </NavLink>
            <NavLink to="/admin/products" className={desktopNavClass}>
              <Package size={18} strokeWidth={1.75} className="shrink-0" />
              <span>{t.admin.nav.products}</span>
            </NavLink>
          </nav>
        </div>

        {/* Bottom Group pinned with divider */}
        <div className="border-t border-cream/10 p-4 space-y-3">
          {/* View store in same nav item style */}
          <Link
            to="/"
            className="flex h-11 w-full items-center gap-3 rounded-[8px] px-4 font-body text-xs font-semibold uppercase tracking-[0.12em] text-cream/70 hover:bg-cream/10 hover:text-cream transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
          >
            <Store size={18} strokeWidth={1.75} className="shrink-0" />
            <span>{t.admin.nav.viewStore}</span>
          </Link>

          {/* SO | EN Two-segment pill */}
          <div className="flex items-center justify-between px-1">
            <span className="font-body text-[0.7rem] uppercase tracking-wider text-cream/40">
              {t.langLabel}
            </span>
            <LangToggle variant="pill" />
          </div>

          {/* Logout as outlined button: 1px border cream 20%, 44px tall, icon + label, hover cream 10% */}
          <button
            type="button"
            onClick={onLogout}
            className="flex h-11 w-full items-center justify-center gap-3 rounded-[8px] border border-cream/20 px-4 font-body text-xs font-semibold uppercase tracking-[0.12em] text-cream hover:bg-cream/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
          >
            <LogOut size={18} strokeWidth={1.75} className="shrink-0" />
            <span>{t.admin.nav.logout}</span>
          </button>
        </div>
      </aside>

      {/* MOBILE STICKY TOP BAR (dark #101010) with safe area */}
      <header className="md:hidden sticky top-0 z-40 border-b border-cream/10 bg-dark text-cream pt-[env(safe-area-inset-top,0px)]">
        <div className="flex h-14 items-center justify-between px-2.5 xs:px-4">
          <Link to="/admin" className="leading-none focus:outline-none shrink-0 flex items-center min-h-[44px]">
            <img src="/light.svg" alt="Shahd Honey" width={120} height={33} className="h-6 xs:h-7 w-auto" />
          </Link>

          <div className="flex items-center gap-1 xs:gap-2">
            {/* View store icon-button: 44x44 touch target */}
            <Link
              to="/"
              aria-label={t.admin.nav.viewStore}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border border-cream/15 text-cream/80 hover:bg-cream/10 hover:text-cream transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
            >
              <Store size={18} strokeWidth={1.75} />
            </Link>

            {/* SO | EN pill */}
            <LangToggle variant="pill" className="scale-85 xs:scale-100 origin-right" />

            {/* Logout icon-button: 44x44 touch target */}
            <button
              type="button"
              onClick={onLogout}
              aria-label={t.admin.nav.logout}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border border-cream/20 text-cream/80 hover:bg-cream/10 hover:text-red-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
            >
              <LogOut size={18} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      {/* FIXED BOTTOM TAB BAR ON MOBILE (>=56px tall, dark #101010) */}
      <nav
        aria-label="Admin tabs"
        className="md:hidden fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-cream/10 bg-dark text-cream pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom,0px))] shadow-lift"
      >
        <NavLink to="/admin" end className={mobileTabClass}>
          <LayoutDashboard size={18} strokeWidth={1.75} />
          <span>{t.admin.nav.dashboard}</span>
        </NavLink>
        <NavLink to="/admin/orders" className={mobileTabClass}>
          <ClipboardList size={18} strokeWidth={1.75} />
          <span>{t.admin.nav.orders}</span>
        </NavLink>
        <NavLink to="/admin/products" className={mobileTabClass}>
          <Package size={18} strokeWidth={1.75} />
          <span>{t.admin.nav.products}</span>
        </NavLink>
      </nav>

      {/* MAIN CONTENT AREA (p-4 on mobile, p-6 on desktop; extra bottom padding pb-28 on mobile) */}
      <main className="flex-1 min-w-0 bg-cream pb-28 md:pb-8">
        <div className="mx-auto w-full max-w-6xl p-3.5 sm:p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
