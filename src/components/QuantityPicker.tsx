import { Minus, Plus } from 'lucide-react'
import { useLang } from '../i18n/useLang'

interface Props {
  value: number
  onChange: (n: number) => void
  size?: 'sm' | 'md'
  label?: string
}

export function QuantityPicker({ value, onChange, size = 'md', label }: Props) {
  const { t } = useLang()
  const btn = size === 'sm' ? 'h-8 w-8' : 'h-11 w-11'
  return (
    <div
      role="group"
      aria-label={label ?? t.product.quantity}
      className="inline-flex items-center rounded border border-dark/15 bg-white/70"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label={t.product.decrease}
        className={`${btn} inline-flex items-center justify-center text-dark transition hover:bg-pale-amber/60 disabled:opacity-30`}
      >
        <Minus size={size === 'sm' ? 14 : 16} />
      </button>
      <span aria-live="polite" className={`min-w-[2.25rem] text-center font-body font-semibold ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(99, value + 1))}
        disabled={value >= 99}
        aria-label={t.product.increase}
        className={`${btn} inline-flex items-center justify-center text-dark transition hover:bg-pale-amber/60 disabled:opacity-30`}
      >
        <Plus size={size === 'sm' ? 14 : 16} />
      </button>
    </div>
  )
}
