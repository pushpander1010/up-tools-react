import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import AdBanner from './AdBanner'
import RelatedTools from './RelatedTools'
import FAQ from './FAQ'
import HowItWorks from './HowItWorks'

export default function ToolLayout({ title, desc, icon, iconBg, category, slug, children, faq = [], howItWorks = [], schema }) {
  return (
    <>
      <Helmet>
        <title>{title} | UpTools</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`https://www.uptools.in/${slug}/`} />
        <meta property="og:title" content={`${title} | UpTools`} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={`https://www.uptools.in/${slug}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${title} | UpTools`} />
        <meta name="twitter:description" content={desc} />
        {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-5" aria-label="Breadcrumb">
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

      <AdBanner slot="9810172647" />

      <div className="mb-8">{children}</div>

      <AdBanner slot="9810172647" />

      {howItWorks.length > 0 && <HowItWorks steps={howItWorks} />}
      {faq.length > 0 && <FAQ questions={faq} />}
      <RelatedTools currentSlug={slug} category={category} />

      <AdBanner slot="9810172647" />
    </>
  )
}
