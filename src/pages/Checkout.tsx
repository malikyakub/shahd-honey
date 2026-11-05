import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Banknote, Check, Smartphone } from 'lucide-react'
import { deliveryFee, getZone, regionOptions } from '../data/delivery'
import { useCart } from '../context/cart'
import { useLang } from '../i18n/useLang'
import { money, productName } from '../lib/format'
import { newOrderId, saveOrder, type Order, type PaymentMethod } from '../lib/orders'

interface Form {
  name: string
  phone: string
  region: string
  city: string
  district: string
  xaafad: string
  road: string
  landmark: string
  payment: PaymentMethod | ''
}

type Errors = Partial<Record<keyof Form, string>>

const EMPTY: Form = { name: '', phone: '', region: '', city: '', district: '', xaafad: '', road: '', landmark: '', payment: '' }
const PAYMENTS: PaymentMethod[] = ['evc', 'zaad', 'sahal', 'cod']

function isValidPhone(v: string) {
  const digits = v.replace(/[\s\-()]/g, '')
  return /^\+?\d{7,15}$/.test(digits)
}

export function Checkout() {
  const { t, lang } = useLang()
  const { lines, subtotal, clear } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState<Form>(EMPTY)
  const [submitted, setSubmitted] = useState(false)

  const region = regionOptions.find((r) => r.id === form.region)
  const zone = region ? getZone(region.zone) : null
  const fee = zone ? deliveryFee(zone, subtotal) : 0
  const total = subtotal + fee

  const errors: Errors = useMemo(() => {
    const e: Errors = {}
    const req = t.checkout.errors.required
    if (!form.name.trim()) e.name = req
    if (!form.phone.trim()) e.phone = req
    else if (!isValidPhone(form.phone)) e.phone = t.checkout.errors.phone
    if (!form.region) e.region = t.checkout.errors.region
    if (!form.city.trim()) e.city = req
    if (!form.district.trim()) e.district = req
    if (!form.xaafad.trim()) e.xaafad = req
    if (!form.road.trim()) e.road = req
    if (!form.payment) e.payment = t.checkout.errors.payment
    return e
  }, [form, t])
  const shown: Errors = submitted ? errors : {}
  const hasErrors = Object.keys(errors).length > 0

  const set = (key: keyof Form) => (value: string) => setForm((f) => ({ ...f, [key]: value }))

  const onRegion = (id: string) => {
    const r = regionOptions.find((o) => o.id === id)
    setForm((f) => ({
      ...f,
      region: id,
      // Pre-fill city when it's empty or still the previous region's suggestion
      city: r && (!f.city || regionOptions.some((o) => o.city === f.city)) ? r.city : f.city,
    }))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (hasErrors || !region || !zone || !form.payment) {
      // Wait for the error state to render, then move focus to the first invalid field
      setTimeout(() => {
        const first = document.querySelector<HTMLElement>('[aria-invalid="true"]')
        first?.focus()
        first?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }, 0)
      return
    }
    const now = new Date()
    const order: Order = {
      id: newOrderId(now),
      createdAt: now.toISOString(),
      items: lines.map((l) => ({
        id: l.product.id,
        name: l.product.name_en,
        name_so: l.product.name_so,
        qty: l.qty,
        unitPrice: l.product.priceUSD,
      })),
      subtotal,
      deliveryFee: fee,
      total,
      customer: { name: form.name.trim(), phone: form.phone.trim() },
      address: {
        region: region.id === 'remote' ? t.checkout.remoteRegion : region.label,
        zone: zone.id,
        city: form.city.trim(),
        district: form.district.trim(),
        xaafad: form.xaafad.trim(),
        road: form.road.trim(),
        landmark: form.landmark.trim(),
      },
      payment: form.payment,
      status: 'pending',
      statusHistory: [{ status: 'pending', timestamp: now.toISOString() }],
    }
    saveOrder(order)
    navigate(`/order/${order.id}`, { replace: true })
    clear()
  }

  if (lines.length === 0) {
    return (
      <section className="container-site flex min-h-[50vh] flex-col items-center justify-center py-space-8 text-center">
        <h1 className="font-heading text-4xl font-medium text-dark">{t.checkout.emptyCart}</h1>
        <Link to="/shop" className="btn-amber mt-space-6">
          {t.cart.emptyCta}
        </Link>
      </section>
    )
  }

  return (
    <section className="container-site py-space-7 sm:py-space-8">
      <h1 className="font-heading text-5xl font-medium text-dark">{t.checkout.title}</h1>

      <form noValidate onSubmit={onSubmit} className="mt-space-6 grid gap-space-6 lg:grid-cols-[1fr_24rem] lg:gap-space-7">
        <div className="space-y-space-6">
          {submitted && hasErrors && (
            <p role="alert" className="flex items-center gap-space-2 rounded border border-red-800/30 bg-red-50 px-space-4 py-space-3 font-body text-sm text-red-900">
              <AlertCircle size={16} /> {t.checkout.errors.summary}
            </p>
          )}

          <Fieldset legend={t.checkout.contact}>
            <Field id="name" label={t.checkout.fullName} error={shown.name}>
              <input id="name" autoComplete="name" value={form.name} onChange={(e) => set('name')(e.target.value)} {...inputProps(shown.name, 'name')} />
            </Field>
            <Field id="phone" label={t.checkout.phone} error={shown.phone}>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={t.checkout.phonePlaceholder}
                value={form.phone}
                onChange={(e) => set('phone')(e.target.value)}
                {...inputProps(shown.phone, 'phone')}
              />
            </Field>
          </Fieldset>

          <Fieldset legend={t.checkout.address}>
            <Field id="region" label={t.checkout.region} error={shown.region} wide>
              <select id="region" value={form.region} onChange={(e) => onRegion(e.target.value)} {...inputProps(shown.region, 'region')}>
                <option value="">{t.checkout.selectRegion}</option>
                {regionOptions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id === 'remote' ? t.checkout.remoteRegion : r.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="city" label={t.checkout.city} error={shown.city}>
              <input id="city" autoComplete="address-level2" value={form.city} onChange={(e) => set('city')(e.target.value)} {...inputProps(shown.city, 'city')} />
            </Field>
            <Field id="district" label={t.checkout.district} error={shown.district}>
              <input id="district" value={form.district} onChange={(e) => set('district')(e.target.value)} {...inputProps(shown.district, 'district')} />
            </Field>
            <Field id="xaafad" label={t.checkout.xaafad} error={shown.xaafad}>
              <input id="xaafad" value={form.xaafad} onChange={(e) => set('xaafad')(e.target.value)} {...inputProps(shown.xaafad, 'xaafad')} />
            </Field>
            <Field id="road" label={t.checkout.road} error={shown.road}>
              <input id="road" value={form.road} onChange={(e) => set('road')(e.target.value)} {...inputProps(shown.road, 'road')} />
            </Field>
            <Field id="landmark" label={t.checkout.landmark} optional={t.checkout.optional} wide>
              <input id="landmark" value={form.landmark} onChange={(e) => set('landmark')(e.target.value)} className="field-input" />
            </Field>
          </Fieldset>

          <fieldset>
            <legend className="font-heading text-2xl font-medium text-dark">{t.checkout.payment}</legend>
            <div
              role="radiogroup"
              aria-invalid={shown.payment ? true : undefined}
              aria-describedby={shown.payment ? 'payment-error' : undefined}
              tabIndex={shown.payment ? -1 : undefined}
              className="mt-space-4 grid grid-cols-2 gap-space-3 focus:outline-none"
            >
              {PAYMENTS.map((m) => {
                const active = form.payment === m
                const Icon = m === 'cod' ? Banknote : Smartphone
                return (
                  <label
                    key={m}
                    className={`relative flex cursor-pointer flex-col gap-space-2 rounded-lg border p-space-4 transition ${
                      active ? 'border-dark bg-white shadow-soft ring-1 ring-dark' : 'border-dark/15 bg-white/60 hover:border-dark/40'
                    } ${shown.payment ? 'border-red-800/50' : ''}`}
                  >
                    <input type="radio" name="payment" value={m} checked={active} onChange={() => set('payment')(m)} className="sr-only" />
                    <Icon size={20} strokeWidth={1.6} className={active ? 'text-amber-deep' : 'text-dark/60'} />
                    <span className="font-body text-sm font-semibold leading-snug text-dark">{t.checkout.methods[m]}</span>
                    {active && (
                      <span className="absolute right-space-3 top-space-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber">
                        <Check size={12} strokeWidth={3} className="text-dark" />
                      </span>
                    )}
                  </label>
                )
              })}
            </div>
            {shown.payment && <ErrorText id="payment-error">{shown.payment}</ErrorText>}
            {form.payment && (
              <div className="mt-space-4 rounded bg-pale-amber/50 p-space-4 font-body text-sm leading-relaxed text-dark">
                <p>{form.payment === 'cod' ? t.checkout.codNote : t.checkout.mobileMoneyNote}</p>
                <p className="mt-space-1 text-xs font-semibold text-amber-deep">{t.checkout.simulated}</p>
              </div>
            )}
          </fieldset>
        </div>

        {/* Order summary */}
        <aside className="h-fit rounded-lg bg-white/60 p-space-5 shadow-soft ring-1 ring-dark/5 sm:p-space-6 lg:sticky lg:top-28">
          <h2 className="font-heading text-2xl font-medium text-dark">{t.checkout.summary}</h2>
          <ul className="mt-space-4 space-y-space-3 border-b border-pale-amber pb-space-4">
            {lines.map(({ product, qty, lineTotal }) => (
              <li key={product.id} className="flex justify-between gap-space-3 font-body text-sm">
                <span className="text-dark/80">
                  {productName(product, lang)} <span className="text-dark/50">× {qty}</span>
                </span>
                <span className="shrink-0 font-medium text-dark">{money(lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-space-4 space-y-space-2 font-body text-sm">
            <div className="flex justify-between">
              <dt className="text-dark/70">{t.cart.subtotal}</dt>
              <dd className="font-medium text-dark">{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-dark/70">{t.checkout.delivery}</dt>
              <dd className="font-medium text-dark">
                {!zone ? <span className="text-dark/50">{t.checkout.selectRegionHint}</span> : fee === 0 ? <span className="text-amber-deep">{t.checkout.free}</span> : money(fee)}
              </dd>
            </div>
            {zone && (
              <div className="flex justify-between gap-space-3">
                <dt className="text-dark/70">{t.checkout.eta}</dt>
                <dd className="text-right font-medium text-dark">{t.zones[zone.id].eta}</dd>
              </div>
            )}
            <div className="flex items-baseline justify-between border-t border-pale-amber pt-space-3">
              <dt className="font-semibold text-dark">{t.checkout.total}</dt>
              <dd className="text-2xl font-semibold text-dark">{money(total)}</dd>
            </div>
          </dl>
          <button type="submit" className="btn-amber mt-space-5 w-full">
            {t.checkout.placeOrder}
          </button>
          <p className="mt-space-3 text-center font-body text-xs text-dark/55">{t.checkout.simulated}</p>
        </aside>
      </form>
    </section>
  )
}

function inputProps(error: string | undefined, id: string) {
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
    className: `field-input ${error ? 'border-red-800/60 focus:border-red-800' : ''}`,
  } as const
}

function Fieldset({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="font-heading text-2xl font-medium text-dark">{legend}</legend>
      <div className="mt-space-4 grid gap-space-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  )
}

function Field({
  id,
  label,
  error,
  optional,
  wide,
  children,
}: {
  id: string
  label: string
  error?: string
  optional?: string
  wide?: boolean
  children: ReactNode
}) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="mb-space-1 block font-body text-xs font-semibold uppercase tracking-[0.1em] text-dark/75">
        {label}
        {optional ? <span className="ml-1 font-normal normal-case tracking-normal text-dark/50">({optional})</span> : <span className="text-amber-deep"> *</span>}
      </label>
      {children}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  )
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-space-1 flex items-center gap-space-1 font-body text-xs font-medium text-red-800">
      <AlertCircle size={12} /> {children}
    </p>
  )
}
