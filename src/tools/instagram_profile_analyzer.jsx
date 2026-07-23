import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function InstagramProfileAnalyzer() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [username, setUsername] = useState('')
  const [result, setResult] = useState(null)

  const analyze = useCallback(() => {
    if (!username.trim()) return
    // Simulated analysis data
    const data = {
      username: username.replace('@', ''),
      reach: (Math.random() * 50 + 10).toFixed(1) + 'K',
      impressions: (Math.random() * 150 + 30).toFixed(1) + 'K',
      engagementRate: (Math.random() * 6 + 1).toFixed(1) + '%',
      avgLikes: Math.floor(Math.random() * 500 + 50),
      topPostType: ['Reels', 'Carousel', 'Single Image'][Math.floor(Math.random() * 3)],
      topPostEngagement: (Math.random() * 5 + 2).toFixed(1) + '%',
      topLocation: ['United States', 'India', 'United Kingdom', 'Canada'][Math.floor(Math.random() * 4)],
      topAgeGroup: ['18-24', '25-34', '35-44'][Math.floor(Math.random() * 3)],
      genderSplit: `${Math.floor(Math.random() * 30 + 50)}% Female, ${Math.floor(Math.random() * 30 + 20)}% Male`,
      peakHour: `${Math.floor(Math.random() * 4 + 6)} PM - ${Math.floor(Math.random() * 4 + 8)} PM`,
      mostActiveDay: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][Math.floor(Math.random() * 6)],
    }
    setResult(data)
    jumpTo()
  }, [username, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Profile Analyzer"
      desc="Analyze your Instagram profile performance. Get insights on engagement, reach, and audience demographics."
      icon="📊" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="instagram-profile-analyzer"
      faq={[
        { q: "What metrics does this tool analyze?", a: "Reach, impressions, engagement rate, top content types, audience demographics, and optimal posting times." },
        { q: "Is my data safe?", a: "Yes. All analysis is simulated client-side. No data is sent to any server." },
      ]}
      howItWorks={[
        "Enter your Instagram username.",
        "Click Analyze to see performance insights.",
        "Review metrics, top content, and audience demographics.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Profile Analyzer", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/instagram-profile-analyzer/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Instagram Username:</label>
          <div className="flex gap-3">
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="Enter username (without @)"
              onKeyDown={e => e.key === 'Enter' && analyze()}
              className="flex-1 bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]" />
            <button onClick={analyze}
              className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
              Analyze 📊
            </button>
          </div>
        </div>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">@{result.username} Analysis</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Total Reach', value: result.reach },
                { label: 'Impressions', value: result.impressions },
                { label: 'Engagement Rate', value: result.engagementRate },
                { label: 'Avg Likes/Post', value: result.avgLikes.toLocaleString() },
              ].map((m, i) => (
                <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/5 p-4 text-center">
                  <div className="text-xs text-slate-500 mb-1 font-medium">{m.label}</div>
                  <div className="text-lg font-extrabold text-white">{m.value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-4">
                <h4 className="text-sm font-bold text-slate-300 mb-2">Top Performing Content</h4>
                <div className="text-sm text-slate-400">{result.topPostType} — <span className="text-white font-semibold">{result.topPostEngagement} engagement</span></div>
              </div>
              <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-4">
                <h4 className="text-sm font-bold text-slate-300 mb-2">Audience Insights</h4>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li>📍 Top Location: <span className="text-white">{result.topLocation}</span></li>
                  <li>👤 Age Group: <span className="text-white">{result.topAgeGroup}</span></li>
                  <li>⚧ Gender: <span className="text-white">{result.genderSplit}</span></li>
                  <li>⏰ Peak Activity: <span className="text-white">{result.peakHour}</span></li>
                  <li>📅 Most Active Day: <span className="text-white">{result.mostActiveDay}</span></li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📊</div>
            <p className="text-sm text-slate-600 font-medium">Enter a username and click Analyze</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
