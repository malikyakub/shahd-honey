import type { Product } from '../data/products'
import { imageFor } from '../lib/images'
import { productName } from '../lib/format'
import { useLang } from '../i18n/useLang'
import { Hexagon, Honeycomb } from './Decor'

interface Props {
  product: Product
  className?: string
  /** Larger name text for the product page */
  large?: boolean
  /** Small thumbnail (cart): hexagon + size only */
  compact?: boolean
}

/** Product photo if src/assets/images/<id>.png|webp exists, otherwise an elegant placeholder. */
export function ProductImage({ product, className = '', large = false, compact = false }: Props) {
  const { lang } = useLang()
  const name = productName(product, lang)
  const src = imageFor(product.id)

  if (src) {
    return <img src={src} alt={name} loading="lazy" className={`h-full w-full object-cover ${className}`} />
  }

  return (
    <div
      role="img"
      aria-label={name}
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-cream to-pale-amber/60 text-center ${compact ? 'p-space-2' : 'p-space-4'} ${className}`}
    >
      <Honeycomb className="opacity-[0.35]" />
      <Hexagon
        className={`relative shrink-0 ${large ? 'h-28 w-28 sm:h-36 sm:w-36' : compact ? 'h-10 w-10' : 'h-14 w-14 sm:h-16 sm:w-16'}`}
      />
      {!compact && (
      <p
        className={`relative mt-space-3 font-heading font-medium leading-tight text-dark ${
          large ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'
        }`}
      >
        Shahd
      </p>
      )}
      {product.sizeLabel && (
        <p className="relative mt-space-1 font-body text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-amber-deep">
          {product.sizeLabel}
        </p>
      )}
    </div>
  )
}

/** Hero image (src/assets/images/hero.png|webp) or a dark placeholder. */
export function HeroImage({ alt, className = '' }: { alt: string; className?: string }) {
  const src = imageFor('hero')
  if (src) return <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} />

  return (
    <div role="img" aria-label={alt} className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-[12%] rounded-full bg-amber/15 blur-3xl" />
      <svg viewBox="0 0 200 230" className="relative h-full w-full max-w-[22rem]" aria-hidden>
        <defs>
          <linearGradient id="hero-honey" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F9A11B" />
            <stop offset="1" stopColor="#8F5300" />
          </linearGradient>
        </defs>
        {/* outer hexagon frame */}
        <path d="M100 6 192 59v112l-92 53-92-53V59Z" fill="none" stroke="#F1DFB0" strokeOpacity="0.25" strokeWidth="1.5" />
        {/* jar */}
        <rect x="68" y="44" width="64" height="16" rx="3" fill="#F9A11B" />
        <rect x="62" y="58" width="76" height="8" rx="2" fill="#101010" stroke="#F9A11B" strokeOpacity="0.6" />
        <path d="M58 70h84c6 0 10 4 10 10v86c0 14-10 24-24 24H72c-14 0-24-10-24-24V80c0-6 4-10 10-10Z" fill="url(#hero-honey)" />
        <path d="M60 84c0-4 3-6 6-6h4v96c-6-2-10-8-10-14Z" fill="#FBF3E0" opacity="0.22" />
        {/* label */}
        <rect x="64" y="102" width="72" height="56" rx="3" fill="#101010" />
        <text x="100" y="128" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="20" fill="#FBF3E0">
          Shahd
        </text>
        <text x="100" y="143" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontSize="5.5" letterSpacing="2.4" fill="#F9A11B">
          HONEY
        </text>
      </svg>
    </div>
  )
}
