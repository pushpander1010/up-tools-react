import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import data from '../data/tools.json'

const { tools } = data

export default function ToolPage() {
  const { toolSlug } = useParams()
  const tool = tools.find(t => t.slug === toolSlug)

  if (!tool) {
    return (
      <>
        <Helmet><title>Tool Not Found | UpTools</title></Helmet>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-white mb-4">Tool Not Found</h1>
          <p className="text-slate-400 mb-6">The tool "{toolSlug}" doesn't exist yet.</p>
          <Link to="/" className="glow-btn text-sm px-5 py-2 rounded-xl no-underline">← Back to Home</Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{tool.title} | UpTools</title>
        <meta name="description" content={tool.desc} />
        <link rel="canonical" href={`https://www.uptools.in${tool.href}`} />
        <meta property="og:title" content={`${tool.title} | UpTools`} />
        <meta property="og:description" content={tool.desc} />
        <meta property="og:url" content={`https://www.uptools.in${tool.href}`} />
        <meta name="twitter:card" content="summary" />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 mb-4">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-white">{tool.title}</span>
      </nav>

      {/* Tool Header */}
      <section className="glass p-6 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(17,24,39,0.6))', borderColor: 'rgba(99,102,241,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            {tool.icon}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white m-0">{tool.title}</h1>
            <p className="text-sm text-slate-400 mt-1">{tool.desc}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {tool.tags?.map(tag => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/4 border border-white/6 text-slate-400">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Tool Content Placeholder — actual tool logic lives in the original HTML pages */}
      <section className="glass p-8 text-center">
        <div className="text-5xl mb-4">{tool.icon}</div>
        <h2 className="text-lg font-bold text-white mb-2">{tool.title}</h2>
        <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">{tool.desc}</p>

        <div className="p-6 rounded-2xl mb-6" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-slate-500 text-sm">
            This tool is being migrated to React. For now, the full version is available at the original URL.
          </p>
          <a href={`https://www.uptools.in${tool.href}`} target="_blank" rel="noopener"
            className="glow-btn text-sm px-5 py-2 rounded-xl mt-4 inline-flex no-underline">
            Open Original →
          </a>
        </div>

        {/* Related tools */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-400 mb-3">Related Tools</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {tools
              .filter(t => t.slug !== tool.slug && t.cats?.some(c => tool.cats?.includes(c)))
              .slice(0, 6)
              .map(t => (
                <Link key={t.slug} to={t.href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/4 border border-white/6 text-slate-400 hover:text-white hover:border-brand/40 transition-all no-underline">
                  {t.icon} {t.title}
                </Link>
              ))
            }
          </div>
        </div>
      </section>

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": tool.title,
        "description": tool.desc,
        "url": `https://www.uptools.in${tool.href}`,
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      })}} />
    </>
  )
}
