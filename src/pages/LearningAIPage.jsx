import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import learning from '../data/learning.json'

const PLANNED = [
  { title: 'Multimodal AI & Vision', desc: 'How models process images, audio, video, and text simultaneously.' },
  { title: 'AI Production Deployment', desc: 'How to containerize, scale, and serve models with vLLM, TensorRT-LLM, and serverless GPU clusters.' },
]

const DIFF_STYLE = {
  Beginner: 'bg-green-500/15 text-green-300 border-green-500/30',
  Intermediate: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Advanced: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
}

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

      {/* Simple hero */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🤖</div>
        <h1 className="text-3xl sm:text-4xl font-black text-white m-0 mb-2">
          AI, in plain English
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          No jargon, no maths degree. Follow the path 1 → {lessons.length}, each lesson takes ~5 minutes.
        </p>
        <div className="flex gap-2 justify-center mt-4">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-300">{lessons.length} lessons live</span>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-slate-300">🌱 Start at lesson 1</span>
        </div>
      </div>

      {/* Numbered learning path */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-green-500/50 via-emerald-500/20 to-transparent" />
        <div className="space-y-3">
          {lessons.map((a, i) => (
            <Link key={a.slug} to={`/learning/ai/${a.slug}`}
              className="relative flex gap-4 items-start rounded-3xl border border-white/10 bg-white/[0.03] p-4 no-underline hover:-translate-y-0.5 hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 group">
              <div className="relative z-10 w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-base font-black text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, #22c55e, #059669)' }}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xl">{a.icon}</span>
                  <h2 className="text-[15px] font-bold text-white m-0">{a.title}</h2>
                  {a.difficulty && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${DIFF_STYLE[a.difficulty] || DIFF_STYLE.Beginner}`}>
                      {a.difficulty.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-slate-400 leading-relaxed mt-1 mb-0 line-clamp-2">{a.desc}</p>
              </div>
              <span className="shrink-0 self-center text-green-300 font-black group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          ))}
        </div>
      </div>

      <h2 className="text-base font-black text-white mb-3 mt-8 text-center">Coming next 🔜</h2>
      <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
        {PLANNED.map(r => (
          <div key={r.title} className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-5">
            <div className="text-2xl mb-2">🔜</div>
            <h3 className="text-sm font-bold text-white m-0 mb-1">{r.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed m-0">{r.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 m-0 mt-4 text-center">
        <Link to="/learning" className="text-green-300 font-semibold">← Back to all tracks</Link>
      </p>
    </>
  )
}
