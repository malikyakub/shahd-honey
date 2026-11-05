import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Lock, ArrowLeft, AlertCircle, ShieldAlert } from 'lucide-react'
import { ADMIN_PASSWORD, ADMIN_SESSION_KEY } from '../../data/admin'
import { brand } from '../../data/brand'
import { useLang } from '../../i18n/useLang'
import { LangToggle } from '../LangToggle'
import { Honeycomb } from '../Decor'

/**
 * CLIENT-SIDE DEMO LOGIN:
 * This component handles password-only verification for university evaluation.
 * Note: Client-side authentication is purely illustrative and does NOT provide true security.
 */
export function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const { t } = useLang()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true')
      } catch {
        /* ignore */
      }
      setError(false)
      onLogin()
    } else {
      setError(true)
    }
  }

  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center bg-cream px-space-4 py-space-8 text-dark">
      <div className="absolute right-space-4 top-space-4 z-10 flex items-center gap-space-3">
        <LangToggle />
      </div>

      <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-dark p-space-6 text-cream shadow-lift sm:p-space-8">
        <Honeycomb className="opacity-[0.04]" />

        <div className="relative z-10 text-center">
          <span className="font-heading text-4xl font-medium tracking-wide text-cream">{brand.wordmark}</span>
          <span className="mt-1 block pl-[0.32em] font-body text-[0.6rem] font-semibold uppercase tracking-brand text-amber">
            {t.admin.title}
          </span>

          <div className="mt-space-6 flex items-center justify-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-amber">
              <Lock size={20} strokeWidth={1.8} />
            </span>
          </div>

          <h1 className="mt-space-3 font-heading text-2xl font-medium text-cream">{t.admin.login.title}</h1>
          <p className="mt-space-1 font-body text-xs text-cream/70">{t.admin.login.subtitle}</p>

          <form onSubmit={handleSubmit} className="mt-space-6 space-y-space-4 text-left">
            <div>
              <label htmlFor="admin-pw" className="mb-space-1 block font-body text-xs font-semibold uppercase tracking-wider text-cream/80">
                {t.admin.login.password}
              </label>
              <input
                id="admin-pw"
                type="password"
                autoComplete="current-password"
                required
                placeholder={t.admin.login.passwordPlaceholder}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError(false)
                }}
                className="w-full rounded border border-cream/20 bg-cream/10 px-space-4 py-space-3 font-body text-sm text-cream placeholder:text-cream/40 transition focus:border-amber focus:bg-cream/15 focus:outline-none focus:ring-1 focus:ring-amber"
              />
            </div>

            {error && (
              <div role="alert" className="flex items-center gap-space-2 rounded bg-red-950/60 border border-red-800/40 p-space-3 font-body text-xs text-red-300">
                <AlertCircle size={14} className="shrink-0" />
                <span>{t.admin.login.error}</span>
              </div>
            )}

            <button type="submit" className="btn-amber w-full">
              {t.admin.login.submit}
            </button>
          </form>

          {/* Client-side Demo Note */}
          <div className="mt-space-6 flex items-start gap-space-2 rounded border border-amber/30 bg-amber/10 p-space-3 text-left font-body text-[0.7rem] leading-relaxed text-pale-amber">
            <ShieldAlert size={15} className="shrink-0 text-amber mt-0.5" />
            <p>{t.admin.login.demoNote}</p>
          </div>

          <div className="mt-space-6 pt-space-4 border-t border-cream/10">
            <Link
              to="/"
              className="inline-flex items-center gap-space-2 font-body text-xs text-cream/60 transition hover:text-cream"
            >
              <ArrowLeft size={14} /> {t.admin.nav.viewStore}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
