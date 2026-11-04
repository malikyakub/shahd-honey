import { Link } from 'react-router-dom'
import { useLang } from '../i18n/useLang'
import { Hexagon } from '../components/Decor'

export function NotFound({ message }: { message?: string }) {
  const { t } = useLang()
  return (
    <section className="container-site flex min-h-[50vh] flex-col items-center justify-center py-space-8 text-center">
      <Hexagon className="h-16 w-16" />
      <h1 className="mt-space-5 font-heading text-4xl font-medium text-dark">{message ?? t.notFound.title}</h1>
      <Link to="/" className="btn-dark mt-space-6">
        {t.notFound.cta}
      </Link>
    </section>
  )
}
