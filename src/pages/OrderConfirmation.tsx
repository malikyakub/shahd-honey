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
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)

  if (!order) return <NotFound message={t.order.notFound} />

  const download = async () => {
    if (!receiptRef.current) return
    setBusy(true)
    setError(false)
    try {
      const dataUrl = await toPng(receiptRef.current, { pixelRatio: 2, cacheBust: true, backgroundColor: '#FBF3E0' })
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
    <section className="bg-cream py-space-7 sm:py-space-8">
      <div className="container-site">
        <div className="animate-fade-in mx-auto max-w-xl text-center">
          <CheckCircle2 size={44} strokeWidth={1.4} className="mx-auto text-amber-deep" />
          <h1 className="mt-space-4 font-heading text-5xl font-medium text-dark">{t.order.thanks}</h1>
          <p className="mt-space-3 font-body text-sm leading-relaxed text-dark/75">{t.order.thanksText}</p>
        </div>

        <div className="mx-auto mt-space-7 max-w-md">
          <Receipt ref={receiptRef} order={order} />

          <button type="button" onClick={download} disabled={busy} className="btn-amber mt-space-5 w-full">
            <Download size={16} /> {busy ? t.order.downloading : t.order.download}
          </button>
          {error && (
            <p role="alert" className="mt-space-2 text-center font-body text-xs text-red-800">
              {t.order.downloadError}
            </p>
          )}
          <Link to="/" className="mt-space-4 block text-center font-body text-xs font-semibold uppercase tracking-[0.14em] text-dark/70 hover:text-dark">
            {t.order.backHome}
          </Link>
        </div>
      </div>
    </section>
  )
}
