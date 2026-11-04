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
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className="font-heading text-[1.75rem] font-medium tracking-wide text-cream sm:text-3xl">{brand.wordmark}</span>
      <span className="mt-[2px] pl-[0.32em] font-body text-[0.5rem] font-semibold uppercase tracking-brand text-amber">Honey</span>
    </span>
  )
}

function Nav({ className = '' }: { className?: string }) {
  const { t } = useLang()
  const link = ({ isActive }: { isActive: boolean }) =>
    `relative py-space-2 font-body text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
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
      <div className="container-site flex h-16 items-center justify-between gap-space-4 sm:h-20">
        <Link to="/" aria-label={brand.name} className="shrink-0">
          <Wordmark />
        </Link>
        <Nav className="hidden items-center gap-space-6 md:flex" />
        <div className="flex items-center gap-space-2 sm:gap-space-4">
          <LangToggle />
          <Link
            to="/cart"
            aria-label={t.nav.openCart(count)}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded text-cream transition hover:text-amber focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
          >
            <ShoppingBag size={22} strokeWidth={1.6} />
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
      {/* Mobile nav row */}
      <Nav className="container-site flex items-center justify-center gap-space-7 border-t border-cream/10 md:hidden" />
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
        <div>
          <Wordmark />
          <p className="mt-space-4 max-w-xs font-heading text-xl italic text-cream/80">{t.tagline}</p>
        </div>
        <div>
          <p className="eyebrow text-amber">{t.footer.contact}</p>
          <ul className="mt-space-4 space-y-space-3 font-body text-sm">
            <li>
              <a href={brand.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-cream/80 transition hover:text-amber">
                WhatsApp · {brand.whatsapp}
              </a>
            </li>
            <li>
              <a href={brand.tiktokLink} target="_blank" rel="noopener noreferrer" className="text-cream/80 transition hover:text-amber">
                TikTok · {brand.tiktok}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-site relative border-t border-cream/10 py-space-5 font-body text-xs text-cream/50">
        © {YEAR} {brand.name}. {t.footer.rights}
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
