import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function instagram_growth_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [currentFollowers, setCurrentFollowers] = useState('')
  const [engagementRate, setEngagementRate] = useState('')
  const [postsPerWeek, setPostsPerWeek] = useState('')
  const [months, setMonths] = useState('')

  const result = useMemo(() => {
    const cf = parseInt(currentFollowers) || 0
    const er = parseFloat(engagementRate) || 0
    const ppw = parseInt(postsPerWeek) || 0
    const m = parseInt(months) || 0
    if (cf <= 0 || er <= 0 || ppw <= 0 || m <= 0) return null
    const monthlyNew = (cf * er / 100) * ppw * 4.33
    const projected = Math.round(cf + monthlyNew * m)
    const totalNew = Math.round(monthlyNew * m)
    const monthlyGrowth = ((monthlyNew / cf) * 100).toFixed(2)
    const avgEngagement = Math.round(cf * er / 100)
    return { projected, totalNew, monthlyGrowth, avgEngagement, monthlyNew: Math.round(monthlyNew) }
  }, [currentFollowers, engagementRate, postsPerWeek, months])

  const handleCalculate = useCallback(() => {
    if (!result) return
    jumpTo()
  }, [result, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Growth Calculator"
      desc="Project your Instagram follower growth based on engagement rate and posting frequency."
      icon="📈" iconBg="rgba(34,197,94,0.08)"
      category="social" slug="instagram-growth-calculator"
      faq={[
        { q: 'How accurate is this projection?', a: 'It provides an estimate based on your current engagement rate and posting frequency. Actual results vary based on content quality, algorithm changes, and audience behavior.' },
        { q: 'What is a good posting frequency?', a: 'Most experts recommend 3-5 posts per week plus daily Stories. Quality matters more than quantity.' },
      ]}
      howItWorks={[
        'Enter your current follower count.',
        'Enter your average engagement rate (%).',
        'Enter posts per week and projection months.',
        'View projected followers, new followers, and growth rate.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Growth Calculator", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-growth-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Current Followers</label>
          <input type="number" value={currentFollowers} onChange={e => setCurrentFollowers(e.target.value)}
            placeholder="e.g. 5000" className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Engagement Rate (%)</label>
            <input type="number" value={engagementRate} onChange={e => setEngagementRate(e.target.value)}
              placeholder="e.g. 3.5" step="0.1" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Posts per Week</label>
            <input type="number" value={postsPerWeek} onChange={e => setPostsPerWeek(e.target.value)}
              placeholder="e.g. 4" className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Projection Period (months)</label>
          <input type="number" value={months} onChange={e => setMonths(e.target.value)}
            placeholder="e.g. 6" className={inputClass} />
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all duration-200 active:scale-[0.98]">
          Calculate Growth
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Projected Growth</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Projected Followers', value: result.projected.toLocaleString(), color: '#22c55e' },
                { label: 'New Followers', value: '+' + result.totalNew.toLocaleString(), color: '#0ea5e9' },
                { label: 'Monthly Growth', value: result.monthlyGrowth + '%', color: '#f59e0b' },
                { label: 'Avg Engagement/Post', value: result.avgEngagement.toLocaleString(), color: '#8b5cf6' },
              ].map(item => (
                <div key={item.label} className="rounded-2xl p-4 bg-white/[0.04] text-center">
                  <div className="text-xl font-extrabold" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📈</div>
            <p className="text-sm text-slate-600 font-medium">Fill in all fields to see growth projection</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
