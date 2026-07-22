import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function water_intake_calculator() {
  return (
    <>
      <Helmet>
        <title>Water Intake Calculator | UpTools</title>
        <meta name="description" content="Calculate daily water intake needs." />
        <link rel="canonical" href="https://www.uptools.in/water-intake-calculator/" />
        <meta property="og:title" content="Water Intake Calculator | UpTools" />
        <meta property="og:description" content="Calculate daily water intake needs." />
      </Helmet>

      <nav className="text-xs text-slate-500 mb-4">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-white">Water Intake Calculator</span>
      </nav>

      <section className="glass p-6 mb-6" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(17,24,39,0.6))', borderColor: 'rgba(99,102,241,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>💧</div>
          <div>
            <h1 className="text-xl font-bold text-white m-0">Water Intake Calculator</h1>
            <p className="text-sm text-slate-400 mt-1">Calculate daily water intake needs.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">
          <span key="health" className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/4 border border-white/8 text-slate-400">health</span>
          <span key="fitness" className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/4 border border-white/8 text-slate-400">fitness</span>
        </div>
      </section>

      <iframe
        src="/water-intake-calculator/index.html"
        className="w-full border-0 rounded-2xl overflow-hidden"
        style={{ minHeight: '700px', background: '#0f172a' }}
        title="Water Intake Calculator"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
      />
    </>
  )
}
