import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import learning from '../data/learning.json'

export default function LearningDSAPage() {
  const algos = learning.dsa || []
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'DSA Algorithms Explained with Animation',
    description: 'Data structures and algorithms lessons with step-by-step animations, code, practice questions and interview tips.',
    numberOfItems: algos.length,
    itemListElement: algos.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: a.title,
      url: `https://www.uptools.in/learning/dsa/${a.slug}/`,
    })),
  }

  return (
    <>
      <Helmet>
        <title>DSA Algorithms Explained with Animation | UpTools Learning</title>
        <meta name="description" content="Master DSA with live animations — Quickselect and more. Each algorithm: visual walkthrough, code in Python & JavaScript, practice questions and interview tips." />
        <link rel="canonical" href="https://www.uptools.in/learning/dsa/" />
        <meta property="og:title" content="DSA Algorithms Explained with Animation | UpTools Learning" />
        <meta property="og:description" content="Watch algorithms move step by step — then practice questions and interview tips. Starting with Quickselect." />
        <meta property="og:url" content="https://www.uptools.in/learning/dsa/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta property="og:image" content="https://www.uptools.in/assets/og/default.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="keywords" content="DSA animation, quickselect algorithm, learn data structures algorithms, kth smallest element, coding interview preparation" />
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.uptools.in/' },
            { '@type': 'ListItem', position: 2, name: 'Learning', item: 'https://www.uptools.in/learning/' },
            { '@type': 'ListItem', position: 3, name: 'DSA', item: 'https://www.uptools.in/learning/dsa/' },
          ],
        })}</script>
      </Helmet>

      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <Link to="/learning" className="hover:text-white transition-colors">Learning</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">DSA</span>
      </nav>

      <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/[0.06] p-8 sm:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(17,24,39,0.4))' }}>
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 border border-brand/30 text-indigo-300 mb-4">
            <span>🧩</span> DSA Track · {algos.length} lesson{algos.length === 1 ? '' : 's'} live
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
            DSA, explained with animation
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            No dry theory. Press play, watch the algorithm work, then test yourself
            with questions and walk into interviews prepared.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {algos.map(a => (
          <Link key={a.slug} to={`/learning/dsa/${a.slug}`}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 no-underline hover:border-indigo-500/40 hover:bg-white/[0.04] transition-all group">
            <div className="text-3xl mb-3">{a.icon}</div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-base font-bold text-white m-0">{a.title}</h2>
              {a.difficulty && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  {a.difficulty.toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">{a.desc}</p>
            {a.tags && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {a.tags.map(t => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">{t}</span>
                ))}
              </div>
            )}
            <span className="text-sm font-semibold text-indigo-300">Open lesson →</span>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-white/10 p-6 mt-4 text-center">
        <p className="text-sm text-slate-400 m-0">
          More algorithms on the way — Quicksort, Binary Search, Merge Sort, BFS & DFS. <Link to="/learning" className="text-indigo-300 font-semibold">Back to all tracks</Link>
        </p>
      </div>
    </>
  )
}
