import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const ROADMAP = [
  { title: 'How AI actually works (no jargon)', desc: 'What models, training and predictions mean — in plain words.', done: false },
  { title: 'Prompting that gets results', desc: 'Give context, show examples, and check the output — with live demos.', done: false },
  { title: 'Build with AI tools', desc: 'Use our AI tools plus APIs to automate real work.', done: false },
  { title: 'AI for interviews & resumes', desc: 'Prepare smarter with AI — without sounding robotic.', done: false },
]

export default function LearningAIPage() {
  return (
    <>
      <Helmet>
        <title>AI Learning Track (Coming Soon) | UpTools Learning</title>
        <meta name="description" content="The UpTools AI track is coming soon — plain-English guides on how AI works, prompting, and building with AI tools. Start with DSA meanwhile." />
        <link rel="canonical" href="https://www.uptools.in/learning/ai/" />
        <meta property="og:title" content="AI Learning Track (Coming Soon) | UpTools Learning" />
        <meta property="og:description" content="Plain-English AI guides are on the way. Start with the DSA track today." />
        <meta property="og:url" content="https://www.uptools.in/learning/ai/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta property="og:image" content="https://www.uptools.in/assets/og/default.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.uptools.in/' },
            { '@type': 'ListItem', position: 2, name: 'Learning', item: 'https://www.uptools.in/learning/' },
            { '@type': 'ListItem', position: 3, name: 'AI', item: 'https://www.uptools.in/learning/ai/' },
          ],
        })}</script>
      </Helmet>

      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <Link to="/learning" className="hover:text-white transition-colors">Learning</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">AI</span>
      </nav>

      <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/[0.06] p-8 sm:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(17,24,39,0.4))' }}>
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 border border-green-500/30 text-green-300 mb-4">
            <span>🤖</span> AI Track · Coming soon
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
            AI, in plain English
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            No jargon, no maths degree needed. Short practical guides on how AI works
            and how to use it well. We are building these lessons now.
          </p>
          <Link to="/learning/dsa"
            className="inline-block text-sm font-semibold px-5 py-2.5 rounded-xl no-underline text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            Start with DSA meanwhile →
          </Link>
        </div>
      </div>

      <h2 className="text-lg font-bold text-white mb-4">Planned lessons</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {ROADMAP.map(r => (
          <div key={r.title} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 opacity-90">
            <div className="text-2xl mb-2">🔜</div>
            <h3 className="text-sm font-bold text-white m-0 mb-1">{r.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed m-0">{r.desc}</p>
          </div>
        ))}
      </div>
    </>
  )
}
