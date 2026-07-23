import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const HASHTAGS = {
  'For You Page': ['#fyp','#foryou','#foryoupage','#viral','#trending','#tiktok','#tiktokviral','#explore','#xyzbca','#4u'],
  'Dance': ['#dance','#dancechallenge','#dancetrend','#dancer','#dancing','#choreography','#dancecover','#dancevideo','#tiktokdance','#dancelife'],
  'Comedy': ['#funny','#comedy','#humor','#lol','#memes','#funnyvideos','#comedytiktok','#jokes','#laughing','#relatable'],
  'Food': ['#food','#foodtiktok','#cooking','#recipe','#foodie','#homecooking','#foodlover','#yummy','#delicious','#easyrecipe'],
  'Fitness': ['#fitness','#workout','#gym','#fitnessmotivation','#exercise','#health','#bodybuilding','#fitlife','#training','#weightloss'],
  'Beauty': ['#beauty','#makeup','#skincare','#makeuptutorial','#glam','#beautytips','#skincareroutine','#makeuplook','#beautyhacks','#glow'],
  'Fashion': ['#fashion','#style','#ootd','#outfit','#fashiontiktok','#streetstyle','#fashionista','#clothes','#styling','#lookbook'],
  'Travel': ['#travel','#traveltiktok','#wanderlust','#adventure','#explore','#travellife','#vacation','#trip','#traveler','#destination'],
  'Music': ['#music','#musictiktok','#song','#singer','#musician','#newmusic','#cover','#original','#musicvideo','#artist'],
  'Gaming': ['#gaming','#gamer','#games','#videogames','#gaminglife','#twitch','#gameplay','#gamingtiktok','#esports','#streamer'],
  'Education': ['#learnontiktok','#education','#didyouknow','#facts','#learning','#knowledge','#study','#tips','#howto','#lifehacks'],
  'Pets': ['#pets','#dog','#cat','#dogsoftiktok','#catsoftiktok','#animals','#petlover','#puppy','#kitten','#cuteanimals'],
  'Business': ['#business','#entrepreneur','#smallbusiness','#marketing','#success','#motivation','#hustle','#startup','#money','#sidehustle'],
  'Art': ['#art','#artist','#drawing','#painting','#artwork','#creative','#digitalart','#illustration','#sketch','#arttiktok'],
  'DIY': ['#diy','#crafts','#handmade','#tutorial','#howto','#diytiktok','#craft','#creative','#homemade','#upcycle'],
}

export default function tiktok_hashtag_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [activeCategory, setActiveCategory] = useState('For You Page')
  const [keyword, setKeyword] = useState('')
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(null)

  const generate = useCallback(() => {
    setGenerated(true)
  }, [])

  const tags = generated
    ? (keyword.trim() ? [`#${keyword.trim().toLowerCase().replace(/\s+/g, '')}`, ...HASHTAGS[activeCategory]] : HASHTAGS[activeCategory])
    : HASHTAGS[activeCategory]

  const copyToClipboard = useCallback(async (text, label) => {
    try { await navigator.clipboard.writeText(text) } catch {
      const ta = document.createElement('textarea'); ta.value = text
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
    }
    setCopied(label); setTimeout(() => setCopied(null), 2000)
  }, [])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="TikTok Hashtag Generator"
      desc="Generate trending TikTok hashtags to boost your reach and views. 15+ categories, copy to clipboard."
      icon="🎵" iconBg="rgba(0,0,0,0.08)"
      category="social" slug="tiktok-hashtag-generator"
      faq={[
        { q: "How many hashtags should I use on TikTok?", a: "TikTok recommends 3-5 relevant hashtags rather than stuffing 30. Mix mega, mid-size, and niche tags." },
        { q: "Should I always use #fyp?", a: "Yes! Always include #fyp or #foryoupage to target the For You Page algorithm." },
        { q: "Are niche hashtags better?", a: "Niche hashtags have less competition and help you reach your target audience faster." },
      ]}
      howItWorks={[
        "Select a category that matches your content.",
        "Optionally add a keyword to personalize the hashtags.",
        "Click Generate and copy your favorite hashtags.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "TikTok Hashtag Generator", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/tiktok-hashtag-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Category selector */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <label className="block text-sm font-semibold text-slate-300 mb-3">Select Category</label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(HASHTAGS).map(cat => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setGenerated(true) }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border-2
                  ${activeCategory === cat ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.04] border-white/8 text-slate-500 hover:border-white/12'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Keyword + buttons */}
        <div className="flex gap-2 items-center flex-wrap">
          <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)}
            placeholder="Optional: add your keyword (e.g. cooking)"
            className={`${inputClass} flex-1 min-w-[200px]`} />
          <button onClick={() => { generate(); jumpTo() }}
            className="px-5 py-3 rounded-xl text-sm font-bold text-white shrink-0 transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            Generate ✨
          </button>
          <button onClick={() => copyToClipboard(tags.join(' '), 'all')}
            className={`px-4 py-3 rounded-xl text-sm font-bold shrink-0 transition-all border
              ${copied === 'all' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'}`}>
            {copied === 'all' ? '✅ Copied!' : '📋 Copy All'}
          </button>
        </div>

        {/* Hashtag output */}
        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <button key={i} onClick={() => copyToClipboard(tag, tag)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${copied === tag ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20'}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">TikTok Hashtag Tips</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { h: 'Mix hashtag sizes', p: 'Use a mix of mega (#fyp), mid-size, and niche hashtags for best reach.' },
              { h: 'Use 3–5 hashtags', p: 'TikTok recommends 3–5 relevant hashtags rather than stuffing 30.' },
              { h: '#fyp and #foryou', p: 'Always include #fyp or #foryoupage to target the For You Page.' },
              { h: 'Niche hashtags', p: 'Niche hashtags have less competition and reach your target audience faster.' },
            ].map((tip, i) => (
              <div key={i} className="bg-black/20 rounded-xl p-3">
                <div className="text-xs font-bold text-indigo-400">{tip.h}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{tip.p}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
