import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function cron_expression_generator() {
  return (
    <>
      <Helmet>
        <title>Cron Expression Generator | UpTools</title>
        <meta name="description" content="Build cron job schedules visually." />
        <link rel="canonical" href="https://www.uptools.in/cron-expression-generator/" />
        <meta property="og:title" content="Cron Expression Generator | UpTools" />
        <meta property="og:description" content="Build cron job schedules visually." />
      </Helmet>

      <nav className="text-xs text-slate-500 mb-4">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-white">Cron Expression Generator</span>
      </nav>

      <section className="glass p-6 mb-6" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(17,24,39,0.6))', borderColor: 'rgba(99,102,241,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>⏰</div>
          <div>
            <h1 className="text-xl font-bold text-white m-0">Cron Expression Generator</h1>
            <p className="text-sm text-slate-400 mt-1">Build cron job schedules visually.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">
          <span key="dev" className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/4 border border-white/8 text-slate-400">dev</span>
        </div>
      </section>

      <iframe
        src="/cron-expression-generator/index.html"
        className="w-full border-0 rounded-2xl overflow-hidden"
        style={{ minHeight: '700px', background: '#0f172a' }}
        title="Cron Expression Generator"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
      />
    </>
  )
}
