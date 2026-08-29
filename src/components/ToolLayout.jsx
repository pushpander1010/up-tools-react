import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import RelatedTools from './RelatedTools'
import FAQ from './FAQ'
import HowItWorks from './HowItWorks'
import GameAdSlot from './GameAdSlot'
import { AD_SLOTS } from '../config/ads'

export default function ToolLayout({ title, desc, icon, iconBg, category, slug, children, faq = [], howItWorks = [], schema, hideHeader = false }) {
  // Real site path: games use nested /games/<name>/ URLs, not flat games-<name> slugs.
  const path = slug.startsWith('games-') && slug !== 'games'
    ? `games/${slug.slice('games-'.length)}`
    : slug
  // Game pages already render their own two rails + a banner, so ToolLayout must not
  // add more on top of them. Every other tool page had zero ad units below 1024px,
  // because the only non-game placements were the `hidden lg:block` rails in App.jsx.
  const isGame = path.startsWith('games/')
  const showAds = !hideHeader && !isGame
  // Guard against react-helmet-async leaving document.title empty (stray empty <title> tag).
  useEffect(() => {
    if (title) document.title = `${title} | UpTools`
  }, [title])
  return (
    <>
      <Helmet>
        <title>{title} | UpTools</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`https://www.uptools.in/${path}/`} />
        <meta property="og:title" content={`${title} | UpTools`} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={`https://www.uptools.in/${path}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta property="og:image" content="https://www.uptools.in/assets/og/default.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.uptools.in/assets/og/default.png" />
        <meta name="twitter:title" content={`${title} | UpTools`} />
        <meta name="twitter:description" content={desc} />
        {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify((() => {
            const parts = path.split('/')
            const section = parts.length > 1 ? parts[0] : null
            const sectionName = section === 'hncker' ? 'HNCKER'
              : section === 'games' ? 'Games'
              : section ? section.charAt(0).toUpperCase() + section.slice(1) : null
            const items = [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.uptools.in/" },
              ...(section ? [{ "@type": "ListItem", "position": 2, "name": sectionName, "item": `https://www.uptools.in/${section}/` }] : []),
              { "@type": "ListItem", "position": section ? 3 : 2, "name": title, "item": `https://www.uptools.in/${path}/` },
            ]
            return { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items }
          })())
        }} />
      </Helmet>

      {!hideHeader && (
        <>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-slate-700">›</span>
            <span className="text-slate-300 font-medium">{title}</span>
          </nav>

          {/* Header */}
          <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/[0.06]"
            style={{ background: `linear-gradient(135deg, ${iconBg || 'rgba(99,102,241,0.06)'}, rgba(17,24,39,0.3))` }}>
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ background: iconBg || 'rgba(99,102,241,0.15)' }} />
            <div className="relative p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg"
                  style={{ background: iconBg?.replace('0.06', '0.2').replace('0.08', '0.2') || 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {icon}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white m-0 tracking-tight leading-tight">{title}</h1>
                  <p className="text-sm text-slate-400 mt-1.5 max-w-lg leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}


      <div className="mb-8">{children}</div>

      {/* Highest-value placement: the user has just read their result and is deciding
          what to do next. Height is reserved by GameAdSlot so this costs no CLS. */}
      {showAds && (
        <GameAdSlot key={'ic-' + path} slot={AD_SLOTS.toolInContent} format="auto" className="my-6" />
      )}

      {!hideHeader && howItWorks.length > 0 && <HowItWorks steps={howItWorks} />}
      {!hideHeader && faq.length > 0 && <FAQ questions={faq} />}

      {showAds && (
        <GameAdSlot key={'bc-' + path} slot={AD_SLOTS.toolBelowContent} format="horizontal" className="my-6" />
      )}

      {!hideHeader && <RelatedTools currentSlug={slug} category={category} />}

    </>
  )
}
