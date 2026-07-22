import { Helmet } from 'react-helmet-async'
import Breadcrumbs from './Breadcrumbs'
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

      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: title }
      ]} />

      {/* Header */}
      <section className="glass p-6 mb-4" style={{ background: `linear-gradient(135deg, ${iconBg || 'rgba(99,102,241,0.08)'}, rgba(17,24,39,0.6))`, borderColor: `${iconBg?.replace('0.08', '0.2') || 'rgba(99,102,241,0.2)'}` }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: iconBg?.replace('0.08', '0.3') || 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            {icon}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white m-0">{title}</h1>
            <p className="text-sm text-slate-400 mt-1">{desc}</p>
          </div>
        </div>
      </section>

      {/* Ad: Top */}
      <AdBanner slot="9810172647" />

      {/* Tool Content */}
      <section className="glass p-6">
        {children}
      </section>

      {/* Ad: Middle */}
      <AdBanner slot="9810172647" />

      {/* How It Works */}
      {howItWorks.length > 0 && <HowItWorks steps={howItWorks} />}

      {/* FAQ */}
      {faq.length > 0 && <FAQ questions={faq} />}

      {/* Related Tools */}
      <RelatedTools currentSlug={slug} category={category} />

      {/* Ad: Bottom */}
      <AdBanner slot="9810172647" />
    </>
  )
}
