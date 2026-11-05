import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { brand } from '../data/brand'
import { useCart } from '../context/cart'
import { useLang } from '../i18n/useLang'
import { LangToggle } from './LangToggle'
import { Honeycomb } from './Decor'

function Wordmark({ className = '' }: { className?: string }) {
  return (
    <img
      src="/light.svg"
      alt="Shahd Honey"
      width={160}
      height={44}
      className={`h-5 xs:h-7 sm:h-9 w-auto select-none ${className}`}
    />
  )
}

function Nav({ className = '' }: { className?: string }) {
  const { t } = useLang()
  const link = ({ isActive }: { isActive: boolean }) =>
    `relative py-1 font-body text-[0.68rem] xs:text-xs font-semibold uppercase tracking-wider xs:tracking-[0.16em] transition-colors whitespace-nowrap ${
      isActive ? 'text-amber' : 'text-cream/75 hover:text-cream'
    }`
  return (
    <nav className={className}>
      <NavLink to="/" end className={link}>
        {t.nav.home}
      </NavLink>
      <NavLink to="/shop" className={link}>
        {t.nav.shop}
      </NavLink>
    </nav>
  )
}

function Header() {
  const { t } = useLang()
  const { count } = useCart()
  return (
    <header className="sticky top-0 z-40 border-b border-cream/10 bg-dark/95 text-cream backdrop-blur supports-[backdrop-filter]:bg-dark/85">
      <div className="container-site flex h-14 sm:h-16 md:h-20 items-center justify-between gap-1 xs:gap-2 sm:gap-4">
        <Link to="/" aria-label={brand.name} className="shrink-0 flex items-center min-h-[44px]">
          <Wordmark />
        </Link>
        <Nav className="flex items-center gap-2 xs:gap-3 sm:gap-6 shrink-0" />
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <LangToggle variant="pill" className="scale-85 xs:scale-100 origin-right" />
          <Link
            to="/cart"
            aria-label={t.nav.openCart(count)}
            className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded text-cream transition hover:text-amber focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
          >
            <ShoppingBag size={20} strokeWidth={1.6} />
            {count > 0 && (
              <span
                key={count}
                className="animate-bump absolute right-0.5 top-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-amber px-1 font-body text-[0.65rem] font-bold text-dark"
              >
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

const YEAR = new Date().getFullYear()

function Footer() {
  const { t } = useLang()
  return (
    <footer className="relative overflow-hidden bg-dark text-cream">
      <Honeycomb className="opacity-[0.04]" />
      <div className="container-site relative grid gap-space-7 py-space-8 md:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0">
          <Wordmark className="h-8 sm:h-9" />
          <p className="mt-space-4 max-w-xs font-heading text-xl italic text-cream/80">{t.tagline}</p>
        </div>
        <div className="min-w-0">
          <p className="eyebrow text-amber">{t.footer.contact}</p>
          <ul className="mt-space-4 space-y-1 font-body text-sm">
            <li>
              <a
                href={brand.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center text-cream/80 transition hover:text-amber"
              >
                WhatsApp · {brand.whatsapp}
              </a>
            </li>
            <li>
              <a
                href={brand.tiktokLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center text-cream/80 transition hover:text-amber"
              >
                TikTok · {brand.tiktok}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-site relative flex flex-wrap items-center justify-between gap-space-2 border-t border-cream/10 py-space-3 font-body text-xs text-cream/50">
        <span className="min-w-0 break-words py-2">© {YEAR} {brand.name}. {t.footer.rights}</span>
        <Link to="/admin" className="inline-flex min-h-[44px] items-center text-[0.7rem] text-cream/30 transition hover:text-cream/70">
          Admin
        </Link>
      </div>
    </footer>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function Layout() {
  return (
    <div className="flex min-h-[100svh] flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
