import { useEffect, useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import RelatedTools from './RelatedTools'
import FAQ from './FAQ'
import HowItWorks from './HowItWorks'
import GameAdSlot from './GameAdSlot'
import { AD_SLOTS } from '../config/ads'

const CATEGORY_LABELS = {
  finance: 'Finance & Investing',
  tax: 'Tax & GST',
  banking: 'Banking & Loans',
  crypto: 'Crypto & Web3',
  images: 'Image & PDF Tools',
  text: 'Text & Writing',
  dev: 'Developer Utilities',
  security: 'Cybersecurity & OSINT',
  networking: 'Network & IP Tools',
  fun: 'Fun & Quizzes',
  health: 'Health & Fitness',
  canada: 'Canada Finance & Tax',
  romantic: 'Relationship Calculators',
  social: 'Social Media Utilities',
  whatsapp: 'WhatsApp Utilities',
  wifi: 'WiFi & Network',
  ai: 'AI Productivity Tools',
  marketing: 'SEO & Marketing',
  cricket: 'Cricket & Sports',
  sports: 'Sports Analytics',
  fifa: 'Football & World Cup',
  india: 'India Utilities',
  education: 'Education & Exams',
  downloader: 'Media Utilities',
  utility: 'Web Utilities',
  tools: 'Online Tools',
}

export default function ToolLayout({
  title,
  desc,
  icon,
  iconBg,
  category,
  slug,
  children,
  faq = [],
  howItWorks = [],
  schema,
  hideHeader = false,
}) {
  const [copiedUrl, setCopiedUrl] = useState(false)

  const path = slug.startsWith('games-') && slug !== 'games'
    ? `games/${slug.slice('games-'.length)}`
    : slug

  const isGame = path.startsWith('games/')
  const showAds = !hideHeader && !isGame
  const canonicalUrl = `https://www.uptools.in/${path}/`

  useEffect(() => {
    if (title) document.title = `${title} | UpTools`
  }, [title])

  const handleShare = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: `${title} | UpTools`, text: desc, url: canonicalUrl }).catch(() => {})
      return
    }
    try {
      navigator.clipboard.writeText(canonicalUrl)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } catch {}
  }, [title, desc, canonicalUrl])

  const catLabel = CATEGORY_LABELS[category] || (isGame ? 'Browser Games' : 'Online Utility')

  const schemaHasFaq = schema && JSON.stringify(schema).includes('FAQPage')
  const faqSchema = !schemaHasFaq && faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(p => ({
      '@type': 'Question',
      name: p.q,
      acceptedAnswer: { '@type': 'Answer', text: p.a },
    })),
  } : null

  return (
    <>
      <Helmet>
        <title>{`${title} | UpTools`}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${title} | UpTools`} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={canonicalUrl} />
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
        {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify((() => {
              const parts = path.split('/')
              const section = parts.length > 1 ? parts[0] : null
              const sectionName = section === 'hncker' ? 'HNCKER'
                : section === 'hackolution' ? 'HACKOLUTION'
                : section === 'aiforrich' ? 'AIFORRICH'
                : section === 'aimakerich' ? 'AIMakeRich'
                : section === 'games' ? 'Games'
                : section ? section.charAt(0).toUpperCase() + section.slice(1) : null
              const items = [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.uptools.in/' },
                ...(section
                  ? [{ '@type': 'ListItem', position: 2, name: sectionName, item: `https://www.uptools.in/${section}/` }]
                  : [{ '@type': 'ListItem', position: 2, name: 'All Tools', item: 'https://www.uptools.in/all-tools/' }]),
                { '@type': 'ListItem', position: 3, name: title, item: canonicalUrl },
              ]
              return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items }
            })()),
          }}
        />
      </Helmet>

      {!hideHeader && (
        <>
          {/* Breadcrumb + Quick Actions Bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <nav className="flex items-center gap-2 text-xs text-slate-400 min-w-0" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white transition-colors no-underline text-slate-400 shrink-0">
                Home
              </Link>
              <span className="text-slate-600 shrink-0">›</span>
              {(() => {
                const parts = path.split('/')
                const section = parts.length > 1 ? parts[0] : null
                const sectionName = section === 'hncker' ? 'HNCKER'
                  : section === 'hackolution' ? 'HACKOLUTION'
                  : section === 'aiforrich' ? 'AIFORRICH'
                  : section === 'aimakerich' ? 'AIMakeRich'
                  : section === 'games' ? 'Games'
                  : null
                if (section && sectionName) {
                  return (
                    <>
                      <Link to={`/${section}/`} className="hover:text-white transition-colors no-underline text-slate-400 shrink-0">
                        {sectionName}
                      </Link>
                      <span className="text-slate-600 shrink-0">›</span>
                    </>
                  )
                }
                return (
                  <>
                    <Link to="/all-tools/" className="hover:text-white transition-colors no-underline text-slate-400 shrink-0">
                      {catLabel}
                    </Link>
                    <span className="text-slate-600 shrink-0">›</span>
                  </>
                )
              })()}
              <span className="text-slate-200 font-medium truncate">{title}</span>
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {copiedUrl ? '✓ Link Copied' : '🔗 Share Tool'}
              </button>
              <Link
                to="/all-tools/"
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors no-underline"
              >
                All Tools A–Z
              </Link>
            </div>
          </div>

          {/* Modern Tool Header Banner */}
          <div
            className="glass relative mb-6 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${iconBg || 'rgba(99,102,241,0.1)'}, rgba(13,20,36,0.88))`,
            }}
          >
            <div
              className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ background: iconBg || 'rgba(99,102,241,0.22)' }}
            />
            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-xl border border-white/15"
                  style={{
                    background: iconBg?.replace('0.06', '0.22').replace('0.08', '0.22') || 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.25))',
                  }}
                >
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                      {catLabel}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
                      ✓ 100% Free · No Sign-up
                    </span>
                    <span className="hidden md:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.04] border border-white/[0.08] text-slate-300">
                      🔒 Runs Locally in Browser
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white m-0 tracking-tight leading-tight">
                    {title}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed m-0">
                    {desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="mb-8">{children}</div>

      {showAds && (
        <GameAdSlot key="tool-incontent" slot={AD_SLOTS.toolInContent} format="auto" className="my-6" />
      )}

      {!hideHeader && howItWorks.length > 0 && <HowItWorks steps={howItWorks} title={title} />}
      {!hideHeader && faq.length > 0 && <FAQ questions={faq} title={title} />}

      {showAds && (
        <GameAdSlot key="tool-belowcontent" slot={AD_SLOTS.toolBelowContent} format="horizontal" className="my-6" />
      )}

      {!hideHeader && <RelatedTools currentSlug={slug} category={category} />}
    </>
  )
}
