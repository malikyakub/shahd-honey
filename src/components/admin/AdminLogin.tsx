import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Lock, ArrowLeft, AlertCircle, ShieldAlert } from 'lucide-react'
import { ADMIN_PASSWORD, ADMIN_SESSION_KEY } from '../../data/admin'
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
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center bg-cream px-4 py-8 text-dark">
      <div className="absolute right-4 top-4 z-10 flex items-center gap-3">
        <LangToggle variant="pill" />
      </div>

      <div className="relative w-full max-w-md overflow-hidden rounded-[8px] bg-dark p-6 text-cream shadow-lift sm:p-8">
        <Honeycomb className="opacity-[0.04]" />

        <div className="relative z-10 text-center">
          <img src="/light.svg" alt="Shahd Honey" width={160} height={44} className="mx-auto h-10 w-auto" />

          <div className="mt-6 flex items-center justify-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-amber">
              <Lock size={18} strokeWidth={1.75} />
            </span>
          </div>

          <h1 className="mt-3 font-heading text-2xl font-medium text-cream">{t.admin.login.title}</h1>
          <p className="mt-1 font-body text-xs text-cream/70">{t.admin.login.subtitle}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
            <div>
              <label htmlFor="admin-pw" className="mb-2 block font-body text-xs font-semibold uppercase tracking-wider text-cream/80">
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
                className="h-11 w-full rounded-[8px] border border-cream/20 bg-cream/10 px-4 font-body text-base text-cream placeholder:text-cream/40 transition focus:border-amber focus:bg-cream/15 focus:outline-none focus:ring-1 focus:ring-amber"
              />
            </div>

            {error && (
              <div role="alert" className="flex items-center gap-3 rounded-[8px] bg-red-950/60 border border-red-800/40 p-3 font-body text-xs text-red-300">
                <AlertCircle size={18} strokeWidth={1.75} className="shrink-0" />
                <span>{t.admin.login.error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-amber min-h-[44px] w-full rounded-[8px] font-semibold"
            >
              {t.admin.login.submit}
            </button>
          </form>

          {/* Client-side Demo Note */}
          <div className="mt-6 flex items-start gap-3 rounded-[8px] border border-amber/30 bg-amber/10 p-3 text-left font-body text-[0.7rem] leading-relaxed text-pale-amber">
            <ShieldAlert size={18} strokeWidth={1.75} className="shrink-0 text-amber mt-0.5" />
            <p>{t.admin.login.demoNote}</p>
          </div>

          <div className="mt-6 pt-4 border-t border-cream/10 flex justify-center">
            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center gap-3 font-body text-xs text-cream/70 transition hover:text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded-[8px] px-3"
            >
              <ArrowLeft size={18} strokeWidth={1.75} />
              <span>{t.admin.nav.viewStore}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
