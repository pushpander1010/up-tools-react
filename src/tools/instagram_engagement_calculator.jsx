import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function instagram_engagement_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [followers, setFollowers] = useState('')
  const [likes, setLikes] = useState('')
  const [comments, setComments] = useState('')
  const [shares, setShares] = useState('')

  const result = useMemo(() => {
    const f = parseFloat(followers) || 0
    const l = parseFloat(likes) || 0
    const c = parseFloat(comments) || 0
    const s = parseFloat(shares) || 0
    if (f <= 0) return null
    const total = l + c + s
    const rate = ((total / f) * 100).toFixed(2)
    let level = 'Poor', color = '#ef4444', bg = 'rgba(239,68,68,0.12)'
    if (rate >= 6) { level = 'Excellent'; color = '#7aa2ff'; bg = 'rgba(122,162,255,0.12)' }
    else if (rate >= 3) { level = 'Good'; color = '#22c55e'; bg = 'rgba(34,197,94,0.12)' }
    else if (rate >= 1) { level = 'Average'; color = '#f59e0b'; bg = 'rgba(245,158,11,0.12)' }
    return { rate, total, level, color, bg }
  }, [followers, likes, comments, shares])

  const handleCalculate = useCallback(() => {
    if (!followers || parseFloat(followers) <= 0) return
    jumpTo()
  }, [followers, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Engagement Calculator"
      desc="Calculate your Instagram engagement rate instantly. Analyze likes, comments, shares and track growth."
      icon="📊" iconBg="rgba(99,102,241,0.08)"
      category="social" slug="instagram-engagement-calculator"
      faq={[
        { q: 'What is a good Instagram engagement rate?', a: 'A good engagement rate is typically 3-6%. Above 6% is excellent. Below 1% is considered poor.' },
        { q: 'How is engagement rate calculated?', a: '(Likes + Comments + Shares) ÷ Followers × 100. This gives you the percentage of followers who interact with your content.' },
        { q: 'Does this tool store my data?', a: 'No. All calculations run locally in your browser. Nothing is uploaded or stored.' },
      ]}
      howItWorks={[
        'Enter your follower count.',
        'Enter your average likes, comments, and shares per post.',
        'View your engagement rate and performance level instantly.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Engagement Calculator", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-engagement-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Followers</label>
          <input type="number" value={followers} onChange={e => setFollowers(e.target.value)}
            placeholder="e.g. 10000" className={inputClass} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Likes</label>
            <input type="number" value={likes} onChange={e => setLikes(e.target.value)}
              placeholder="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Comments</label>
            <input type="number" value={comments} onChange={e => setComments(e.target.value)}
              placeholder="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Shares</label>
            <input type="number" value={shares} onChange={e => setShares(e.target.value)}
              placeholder="0" className={inputClass} />
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate Engagement Rate
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Results</h3>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl p-4 bg-white/[0.04]">
                <div className="text-2xl font-extrabold" style={{ color: result.color }}>{result.rate}%</div>
                <div className="text-xs text-slate-500 mt-1">Engagement Rate</div>
              </div>
              <div className="rounded-2xl p-4 bg-white/[0.04]">
                <div className="text-2xl font-extrabold text-white">{result.total.toLocaleString()}</div>
                <div className="text-xs text-slate-500 mt-1">Total Interactions</div>
              </div>
              <div className="rounded-2xl p-4" style={{ background: result.bg }}>
                <div className="text-2xl font-extrabold" style={{ color: result.color }}>{result.level}</div>
                <div className="text-xs text-slate-500 mt-1">Performance</div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-white/[0.03] p-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Benchmarks</h4>
              <div className="space-y-2 text-sm">
                {[
                  { range: 'Below 1%', label: 'Poor', color: '#ef4444' },
                  { range: '1% – 3%', label: 'Average', color: '#f59e0b' },
                  { range: '3% – 6%', label: 'Good', color: '#22c55e' },
                  { range: 'Above 6%', label: 'Excellent', color: '#7aa2ff' },
                ].map(b => (
                  <div key={b.label} className="flex justify-between items-center">
                    <span className="text-slate-400">{b.range}</span>
                    <span className="font-semibold" style={{ color: b.color }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📊</div>
            <p className="text-sm text-slate-600 font-medium">Enter your stats and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
