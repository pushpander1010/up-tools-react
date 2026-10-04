import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import learning from '../data/learning.json'

const PLANNED = [
  { title: 'Multimodal AI & Vision', desc: 'How models process images, audio, video, and text simultaneously.' },
  { title: 'AI Production Deployment', desc: 'How to containerize, scale, and serve models with vLLM, TensorRT-LLM, and serverless GPU clusters.' },
]

export default function LearningAIPage() {
  const lessons = learning.ai || []
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Guides in Plain English with Animation',
    description: 'Plain-English AI guides — how models work, prompts, and building with AI tools — with live animations, code, practice questions and interview tips.',
    numberOfItems: lessons.length,
    itemListElement: lessons.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: a.title,
      url: `https://www.uptools.in/learning/ai/${a.slug}/`,
    })),
  }

  return (
    <>
      <Helmet>
        <title>AI Guides in Plain English with Animation | UpTools Learning</title>
        <meta name="description" content="Learn how AI really works — plain-English guides with live animations. Start with How AI Actually Works: a next-word predictor, training vs inference, code, questions and interview tips." />
        <link rel="canonical" href="https://www.uptools.in/learning/ai/" />
        <meta property="og:title" content="AI Guides in Plain English with Animation | UpTools Learning" />
        <meta property="og:description" content="No jargon, no maths degree — see how AI works with live animations. Lessons 1–16 are live: How AI Works, Prompting That Gets Results, Context & Memory, Hallucinations & Verifying, Embeddings & Search, Chat With Your Documents (RAG), AI Agents That Do Tasks, Image Generation Basics, Voice & Video AI, AI for Resumes & Interviews, AI for Small Business, AI Costs and Tokens, Privacy and Safety with AI, Building with APIs, Fine-tuning vs Prompting, and Checking AI Quality." />
        <meta property="og:url" content="https://www.uptools.in/learning/ai/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta property="og:image" content="https://www.uptools.in/assets/og/default.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="keywords" content="learn AI, how AI works course, AI for beginners, plain English AI, machine learning explained, LLM explained, AI learning track" />
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
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
            <span>🤖</span> AI Track · {lessons.length} lesson{lessons.length === 1 ? '' : 's'} live
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
            AI, in plain English
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            No jargon, no maths degree needed. Short practical guides on how AI works
            and how to use it well — with live animations you can play with.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {lessons.map(a => (
          <Link key={a.slug} to={`/learning/ai/${a.slug}`}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 no-underline hover:border-green-500/40 hover:bg-white/[0.04] transition-all group">
            <div className="text-3xl mb-3">{a.icon}</div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-base font-bold text-white m-0">{a.title}</h2>
              {a.difficulty && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-300 border border-green-500/30">
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
            <span className="text-sm font-semibold text-green-300">Open lesson →</span>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-bold text-white mb-4 mt-8">Planned next</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {PLANNED.map(r => (
          <div key={r.title} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 opacity-90">
            <div className="text-2xl mb-2">🔜</div>
            <h3 className="text-sm font-bold text-white m-0 mb-1">{r.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed m-0">{r.desc}</p>
          </div>
        ))}
        <div className="rounded-2xl border border-dashed border-white/10 p-5 flex items-center justify-center">
          <p className="text-xs text-slate-400 m-0 text-center">
            More lessons on the way — <Link to="/learning" className="text-green-300 font-semibold">Back to all tracks</Link>
          </p>
        </div>
      </div>
    </>
  )
}
