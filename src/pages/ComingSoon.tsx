import { brand } from '../data/brand'
import { useLang } from '../i18n/useLang'
import { LangToggle } from '../components/LangToggle'

export function ComingSoon() {
  const { t } = useLang()

  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden bg-dark text-cream">
      {/* Faint honeycomb pattern */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]">
        <defs>
          <pattern id="honeycomb" width="56" height="97" patternUnits="userSpaceOnUse">
            <path
              d="M28 0 56 16.2v32.3L28 64.7 0 48.5V16.2Zm0 64.7L56 81v32.3M28 64.7 0 81v32.3"
              fill="none"
              stroke="var(--color-pale-amber)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#honeycomb)" />
      </svg>
      {/* Warm glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/10 blur-3xl"
      />

      <header className="relative z-10 flex justify-end px-space-5 py-space-5 sm:px-space-7">
        <LangToggle />
      </header>

      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-space-5 text-center">
        <span className="mb-space-6 inline-flex items-center rounded-full bg-amber px-space-4 py-space-1 font-body text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-dark shadow-soft">
          {t.comingSoon}
        </span>

        <h1 className="font-heading text-[clamp(4.5rem,16vw,10rem)] font-light leading-none tracking-wide text-cream">
          {brand.wordmark}
        </h1>
        <p className="mt-space-2 pl-[0.32em] font-body text-[0.7rem] font-medium uppercase tracking-brand text-amber">
          Honey
        </p>

        <div aria-hidden className="my-space-6 h-px w-16 bg-pale-amber/30" />

        <p className="font-heading text-2xl italic text-cream/90 sm:text-3xl">{brand.tagline_so}</p>
        <p className="mt-space-4 font-body text-xs tracking-[0.15em] text-cream/60 sm:text-sm">{t.pureHoney}</p>
      </section>

      <footer className="relative z-10 flex flex-col items-center gap-space-1 px-space-5 py-space-6 font-body text-xs tracking-wider text-cream/50 sm:flex-row sm:justify-center sm:gap-space-5">
        <a href={brand.whatsappLink} className="transition-colors hover:text-amber">
          WhatsApp {brand.whatsapp}
        </a>
        <a href={brand.tiktokLink} className="transition-colors hover:text-amber">
          TikTok {brand.tiktok}
        </a>
      </footer>
    </main>
  )
}
