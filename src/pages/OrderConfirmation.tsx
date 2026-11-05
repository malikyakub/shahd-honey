import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Download, CheckCircle2 } from 'lucide-react'
import { toPng } from 'html-to-image'
import { useLang } from '../i18n/useLang'
import { getOrder } from '../lib/orders'
import { Receipt } from '../components/Receipt'
import { NotFound } from './NotFound'

export function OrderConfirmation() {
  const { id } = useParams()
  const { t } = useLang()
  const [order] = useState(() => getOrder(id))
  const receiptRef = useRef<HTMLDivElement>(null)
  const exportReceiptRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)

  if (!order) return <NotFound message={t.order.notFound} />

  const download = async () => {
    const target = exportReceiptRef.current || receiptRef.current
    if (!target) return
    setBusy(true)
    setError(false)
    try {
      const dataUrl = await toPng(target, { pixelRatio: 2, cacheBust: true, backgroundColor: '#FBF3E0' })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `${order.id}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="bg-cream py-space-5 sm:py-space-8">
      <div className="container-site">
        <div className="animate-fade-in mx-auto max-w-xl text-center">
          <CheckCircle2 size={44} strokeWidth={1.4} className="mx-auto text-amber-deep" />
          <h1 className="mt-space-4 font-heading text-3xl sm:text-4xl md:text-5xl font-medium text-dark break-words">{t.order.thanks}</h1>
          <p className="mt-space-3 font-body text-sm leading-relaxed text-dark/75">{t.order.thanksText}</p>
        </div>

        <div className="mx-auto mt-space-6 w-full max-w-md">
          {/* Responsive onscreen receipt */}
          <Receipt ref={receiptRef} order={order} />

          <button type="button" onClick={download} disabled={busy} className="btn-amber mt-space-5 w-full min-h-[44px]">
            <Download size={16} /> {busy ? t.order.downloading : t.order.download}
          </button>
          {error && (
            <p role="alert" className="mt-space-2 text-center font-body text-xs text-red-800">
              {t.order.downloadError}
            </p>
          )}
          <Link to="/" className="mt-space-4 flex min-h-[44px] items-center justify-center text-center font-body text-xs font-semibold uppercase tracking-[0.14em] text-dark/70 hover:text-dark">
            {t.order.backHome}
          </Link>
        </div>

        {/* Offscreen fixed-size receipt (420px) for standard PNG export independent of viewport width */}
        <div style={{ position: 'fixed', left: '-9999px', top: 0, width: '420px', pointerEvents: 'none' }} aria-hidden="true">
          <Receipt ref={exportReceiptRef} order={order} />
        </div>
      </div>
    </section>
  )
}
