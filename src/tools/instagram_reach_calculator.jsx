import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function instagram_reach_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [followers, setFollowers] = useState('')
  const [reach, setReach] = useState('')
  const [impressions, setImpressions] = useState('')
  const [profileVisits, setProfileVisits] = useState('')

  const result = useMemo(() => {
    const f = parseFloat(followers) || 0
    const r = parseFloat(reach) || 0
    const imp = parseFloat(impressions) || 0
    const pv = parseFloat(profileVisits) || 0
    if (f <= 0 || r <= 0) return null
    const reachRate = ((r / f) * 100).toFixed(2)
    const impressionsPerReach = imp > 0 ? (imp / r).toFixed(2) : null
    const profileConversion = pv > 0 ? ((pv / imp) * 100).toFixed(2) : null
    let reachLevel = 'Poor', reachColor = '#ef4444'
    if (reachRate >= 30) { reachLevel = 'Excellent'; reachColor = '#7aa2ff' }
    else if (reachRate >= 20) { reachLevel = 'Good'; reachColor = '#22c55e' }
    else if (reachRate >= 10) { reachLevel = 'Average'; reachColor = '#f59e0b' }
    return { reachRate, impressionsPerReach, profileConversion, reachLevel, reachColor, reach: r, impressions: imp }
  }, [followers, reach, impressions, profileVisits])

  const handleCalc = useCallback(() => {
    if (!result) return
    jumpTo()
  }, [result, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Reach Calculator"
      desc="Calculate your Instagram reach rate, impressions ratio, and profile conversion. Understand how far your content travels."
      icon="📡" iconBg="rgba(6,182,212,0.08)"
      category="social" slug="instagram-reach-calculator"
      faq={[
        { q: "What is Instagram reach?", a: "Reach is the number of unique accounts that have seen your content. It's different from impressions, which count every time your content was shown." },
        { q: "What's a good reach rate?", a: "A reach rate of 20-30%+ of your followers is considered good. Below 10% may indicate content or timing issues." },
        { q: "How is reach rate calculated?", a: "Reach Rate = (Reach ÷ Followers) × 100. This shows what percentage of your audience saw your content." },
      ]}
      howItWorks={[
        'Enter your follower count and reach (unique accounts reached).',
        'Optionally add impressions and profile visits for deeper analysis.',
        'View your reach rate, impressions ratio, and conversion metrics.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Reach Calculator", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-reach-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Followers</label>
            <input type="number" value={followers} onChange={e => setFollowers(e.target.value)}
              placeholder="e.g. 10000" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Reach (unique)</label>
            <input type="number" value={reach} onChange={e => setReach(e.target.value)}
              placeholder="e.g. 3500" className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Impressions (optional)</label>
            <input type="number" value={impressions} onChange={e => setImpressions(e.target.value)}
              placeholder="e.g. 5200" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Profile Visits (optional)</label>
            <input type="number" value={profileVisits} onChange={e => setProfileVisits(e.target.value)}
              placeholder="e.g. 320" className={inputClass} />
          </div>
        </div>

        <button onClick={handleCalc}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate Reach
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Results</h3>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mb-5">
              <div className="rounded-2xl p-4 bg-white/[0.04]">
                <div className="text-2xl font-extrabold" style={{ color: result.reachColor }}>{result.reachRate}%</div>
                <div className="text-xs text-slate-500 mt-1">Reach Rate</div>
              </div>
              <div className="rounded-2xl p-4 bg-white/[0.04]">
                <div className="text-2xl font-extrabold" style={{ color: result.reachColor }}>{result.reachLevel}</div>
                <div className="text-xs text-slate-500 mt-1">Performance</div>
              </div>
              <div className="rounded-2xl p-4 bg-white/[0.04]">
                <div className="text-2xl font-extrabold text-cyan-400">{result.reach.toLocaleString()}</div>
                <div className="text-xs text-slate-500 mt-1">Reach</div>
              </div>
            </div>

            {result.impressionsPerReach && (
              <div className="rounded-2xl bg-white/[0.03] p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Impressions per Reach</span>
                  <span className="font-bold text-cyan-400">{result.impressionsPerReach}x</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">How many times each person saw your content on average</p>
              </div>
            )}

            {result.profileConversion && (
              <div className="rounded-2xl bg-white/[0.03] p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Profile Visit Rate</span>
                  <span className="font-bold text-purple-400">{result.profileConversion}%</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">Percentage of impressions that led to profile visits</p>
              </div>
            )}

            <div className="mt-5 rounded-2xl bg-white/[0.03] p-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Benchmarks</h4>
              <div className="space-y-2 text-sm">
                {[
                  { range: 'Below 10%', label: 'Poor', color: '#ef4444' },
                  { range: '10% – 20%', label: 'Average', color: '#f59e0b' },
                  { range: '20% – 30%', label: 'Good', color: '#22c55e' },
                  { range: 'Above 30%', label: 'Excellent', color: '#7aa2ff' },
                ].map(b => (
                  <div key={b.label} className="flex justify-between items-center">
                    <span className="text-slate-400">{b.range}</span>
                    <span className="font-semibold" style={{ color: b.color }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📡</div>
            <p className="text-sm text-slate-600 font-medium">Enter your stats to calculate reach</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
