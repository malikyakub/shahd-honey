import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, MapPin, Truck } from 'lucide-react'
import { brand } from '../data/brand'
import { getProduct } from '../data/products'
import { useLang } from '../i18n/useLang'
import { Honeycomb, Starburst } from '../components/Decor'
import { HeroImage, ProductImage } from '../components/ProductImage'
import { ProductCard } from '../components/ProductCard'
import { Reveal } from '../components/Reveal'

const FEATURED = ['1l-bottle', '500ml-bottle', '1l-jar', 'family-pack']

export function Home() {
  const { t, lang } = useLang()
  const story = lang === 'so' ? brand.story_so : brand.story_en
  const giftBox = getProduct('gift-box')!
  const trustIcons = [Leaf, MapPin, Truck]

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-dark text-cream">
        <Honeycomb className="opacity-[0.05]" />
        <div className="container-site relative grid items-center gap-space-6 pb-space-7 pt-space-7 md:grid-cols-2 md:gap-space-8 md:py-space-9">
          <div className="animate-fade-in text-center md:text-left">
            <p className="eyebrow text-amber">{t.home.eyebrow}</p>
            <h1 className="mt-space-4 font-heading text-[clamp(2.75rem,9vw,5rem)] font-medium leading-[1.02] text-cream">
              {t.home.headline}
            </h1>
            <p className="mt-space-4 font-heading text-xl italic text-cream/80 sm:text-2xl">{t.tagline}</p>
            <div className="mt-space-7 flex flex-col items-center gap-space-4 sm:flex-row md:justify-start">
              <Link to="/shop" className="btn-amber w-full sm:w-auto">
                {t.home.shopNow} <ArrowRight size={16} />
              </Link>
              <a
                href="#story"
                className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-cream/70 underline-offset-8 transition hover:text-cream hover:underline"
              >
                {t.home.ourStory}
              </a>
            </div>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[15rem] sm:max-w-sm md:max-w-md">
            <HeroImage alt={brand.name} className="h-full w-full" />
            <Starburst className="absolute -right-2 top-[6%] h-20 w-20 rotate-12 drop-shadow-lg sm:h-24 sm:w-24 md:-right-4" />
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-pale-amber bg-cream">
        <ul className="container-site grid grid-cols-1 gap-space-4 py-space-5 sm:grid-cols-3 sm:gap-space-2">
          {t.home.trust.map((label, i) => {
            const Icon = trustIcons[i]
            return (
              <li key={label} className="flex items-center justify-center gap-space-3 text-center">
                <Icon size={18} strokeWidth={1.6} className="shrink-0 text-amber-deep" />
                <span className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-dark">{label}</span>
              </li>
            )
          })}
        </ul>
      </section>

      {/* FEATURED */}
      <section className="bg-cream py-space-8 md:py-space-9">
        <div className="container-site">
          <Reveal className="mb-space-6 flex flex-wrap items-end justify-between gap-space-4">
            <div>
              <p className="eyebrow text-amber-deep">{t.home.featuredEyebrow}</p>
              <h2 className="mt-space-2 font-heading text-4xl font-medium text-dark sm:text-5xl">{t.home.featuredTitle}</h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-space-2 font-body text-xs font-semibold uppercase tracking-[0.16em] text-dark underline-offset-8 hover:underline"
            >
              {t.home.viewAll} <ArrowRight size={14} />
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-space-4 md:grid-cols-4 md:gap-space-5">
            {FEATURED.map((id, i) => (
              <Reveal key={id} delay={i * 80}>
                <ProductCard product={getProduct(id)!} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="relative scroll-mt-24 overflow-hidden bg-dark text-cream">
        <Honeycomb className="opacity-[0.05]" />
        <div className="container-site relative py-space-8 md:py-space-9">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Starburst className="mx-auto h-20 w-20" />
            <p className="eyebrow mt-space-6 text-amber">{t.home.storyEyebrow}</p>
            <h2 className="mt-space-3 font-heading text-4xl font-medium text-amber sm:text-5xl">{t.home.storyTitle}</h2>
            <div className="mx-auto my-space-6 h-px w-16 bg-pale-amber/30" />
            <div className="space-y-space-5 font-body text-[0.95rem] leading-[1.85] text-cream/80">
              {story.slice(0, -1).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-space-6 font-heading text-2xl italic text-cream sm:text-3xl">{story[story.length - 1]}</p>
          </Reveal>
        </div>
      </section>

      {/* GIFT BOX BANNER */}
      <section className="bg-cream py-space-8 md:py-space-9">
        <div className="container-site">
          <Reveal className="grid overflow-hidden rounded-lg bg-white/60 shadow-soft ring-1 ring-dark/5 md:grid-cols-2">
            <div className="aspect-[4/3] md:aspect-auto">
              <ProductImage product={giftBox} large />
            </div>
            <div className="flex flex-col justify-center gap-space-4 p-space-6 sm:p-space-7">
              <p className="eyebrow text-amber-deep">{t.home.giftEyebrow}</p>
              <h2 className="font-heading text-4xl font-medium leading-tight text-dark">{t.home.giftTitle}</h2>
              <p className="font-body text-sm leading-relaxed text-dark/75">{t.home.giftText}</p>
              <div>
                <Link to="/product/gift-box" className="btn-dark mt-space-2">
                  {t.home.giftCta} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
