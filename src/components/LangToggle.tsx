import { useLang } from '../i18n/useLang'
import type { Lang } from '../i18n/types'

const options: Lang[] = ['so', 'en']

export function LangToggle() {
  const { lang, setLang, t } = useLang()
  return (
    <div
      role="group"
      aria-label={t.langLabel}
      className="inline-flex items-center font-body text-xs font-semibold tracking-[0.2em]"
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
