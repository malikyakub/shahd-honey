import { useLang } from '../i18n/useLang'
import type { Lang } from '../i18n/types'

const options: Lang[] = ['so', 'en']

export function LangToggle({
  variant = 'default',
  className = '',
}: {
  variant?: 'default' | 'pill'
  className?: string
}) {
  const { lang, setLang, t } = useLang()

  if (variant === 'pill') {
    return (
      <div
        role="group"
        aria-label={t.langLabel}
        className={`inline-flex items-center rounded-full bg-cream/10 p-0.5 border border-cream/20 font-body text-xs font-semibold ${className}`}
      >
        {options.map((opt) => {
          const active = lang === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setLang(opt)}
              aria-pressed={active}
              className={`rounded-full px-3 py-1 uppercase tracking-wider text-[0.7rem] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
                active ? 'bg-amber text-dark font-bold shadow-sm' : 'text-cream/70 hover:text-cream'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      role="group"
      aria-label={t.langLabel}
      className={`inline-flex items-center font-body text-xs font-semibold tracking-[0.2em] ${className}`}
    >
      {options.map((opt, i) => (
        <span key={opt} className="inline-flex items-center">
          {i > 0 && (
            <span aria-hidden className="text-cream/30">
              |
            </span>
          )}
          <button
            type="button"
            onClick={() => setLang(opt)}
            aria-pressed={lang === opt}
            className={`rounded-sm px-space-2 py-space-2 uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
              lang === opt ? 'text-amber' : 'text-cream/60 hover:text-cream'
            }`}
          >
            {opt}
          </button>
        </span>
      ))}
    </div>
  )
}
