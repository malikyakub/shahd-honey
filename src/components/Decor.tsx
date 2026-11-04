import { useId } from 'react'
import { useLang } from '../i18n/useLang'

/** Faint pale-amber honeycomb pattern. Place inside a `relative` parent. */
export function Honeycomb({ className = 'opacity-[0.06]' }: { className?: string }) {
  const id = useId()
  return (
    <svg aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <defs>
        <pattern id={id} width="56" height="97" patternUnits="userSpaceOnUse">
          <path
            d="M28 0 56 16.2v32.3L28 64.7 0 48.5V16.2Zm0 64.7L56 81v32.3M28 64.7 0 81v32.3"
            fill="none"
            stroke="rgb(var(--rgb-pale-amber))"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

function starPoints(spikes: number, outer: number, inner: number, c = 50): string {
  const pts: string[] = []
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (Math.PI * i) / spikes - Math.PI / 2
    pts.push(`${(c + r * Math.cos(a)).toFixed(2)},${(c + r * Math.sin(a)).toFixed(2)}`)
  }
  return pts.join(' ')
}

const STAR = starPoints(24, 50, 44)

/** "100% saafi" amber starburst badge, as on the label. */
export function Starburst({ className = 'h-24 w-24' }: { className?: string }) {
  const { t } = useLang()
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={`100% ${t.badges.pure}`}>
      <polygon points={STAR} fill="rgb(var(--rgb-amber))" />
      <circle cx="50" cy="50" r="37" fill="none" stroke="rgb(var(--rgb-dark))" strokeWidth="0.8" strokeDasharray="1.5 2" />
      <text x="50" y="50" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontWeight="700" fontSize="24" fill="rgb(var(--rgb-dark))">
        100%
      </text>
      <text x="50" y="65" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="700" fontSize="9" letterSpacing="2.4" fill="rgb(var(--rgb-dark))">
        {t.badges.pure}
      </text>
    </svg>
  )
}

/** Amber hexagon mark. */
export function Hexagon({ className = 'h-16 w-16', filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      <path
        d="M50 4 90 27v46L50 96 10 73V27Z"
        fill={filled ? 'rgb(var(--rgb-amber))' : 'none'}
        stroke="rgb(var(--rgb-amber))"
        strokeWidth={filled ? 0 : 3}
      />
      {!filled && <path d="M50 22 74 36v28L50 78 26 64V36Z" fill="rgb(var(--rgb-amber))" opacity="0.9" />}
    </svg>
  )
}
