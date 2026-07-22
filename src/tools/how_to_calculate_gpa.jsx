import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function how_to_calculate_gpa() {
  return (
    <>
      <Helmet>
        <title>How to Calculate GPA | UpTools</title>
        <meta name="description" content="Step-by-step GPA & CGPA calculation guide." />
        <link rel="canonical" href="https://www.uptools.in/how-to-calculate-gpa/" />
        <meta property="og:title" content="How to Calculate GPA | UpTools" />
        <meta property="og:description" content="Step-by-step GPA & CGPA calculation guide." />
      </Helmet>

      <nav className="text-xs text-slate-500 mb-4">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-white">How to Calculate GPA</span>
      </nav>

      <section className="glass p-6 mb-6" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(17,24,39,0.6))', borderColor: 'rgba(99,102,241,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>🎓</div>
          <div>
            <h1 className="text-xl font-bold text-white m-0">How to Calculate GPA</h1>
            <p className="text-sm text-slate-400 mt-1">Step-by-step GPA & CGPA calculation guide.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">
          <span key="study" className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/4 border border-white/8 text-slate-400">study</span>
          <span key="gpa" className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/4 border border-white/8 text-slate-400">gpa</span>
          <span key="guide" className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/4 border border-white/8 text-slate-400">guide</span>
        </div>
      </section>

      <iframe
        src="/how-to-calculate-gpa/index.html"
        className="w-full border-0 rounded-2xl overflow-hidden"
        style={{ minHeight: '700px', background: '#0f172a' }}
        title="How to Calculate GPA"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
      />
    </>
  )
}
