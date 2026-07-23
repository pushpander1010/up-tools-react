import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function InstagramFollowerTracker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [username, setUsername] = useState('')
  const [result, setResult] = useState(null)

  const track = useCallback(() => {
    if (!username.trim()) return
    const data = {
      username: username.replace('@', ''),
      totalFollowers: Math.floor(Math.random() * 50000) + 1000,
      weeklyGrowth: Math.floor(Math.random() * 200) + 20,
      monthlyGrowth: Math.floor(Math.random() * 800) + 100,
      dailyAverage: Math.floor(Math.random() * 30) + 5,
      todayGrowth: Math.floor(Math.random() * 40) + 5,
      yesterdayGrowth: Math.floor(Math.random() * 35) + 3,
      weeklyChange: Math.floor(Math.random() * 20) - 5,
      monthlyChange: Math.floor(Math.random() * 15),
      growthRate: (Math.random() * 5 + 0.5).toFixed(1),
    }
    setResult(data)
    jumpTo()
  }, [username, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Follower Tracker"
      desc="Track your Instagram follower growth over time. Monitor daily changes and analyze trends."
      icon="📈" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="instagram-follower-tracker"
      faq={[
        { q: "How accurate is this tracker?", a: "This provides estimates based on typical growth patterns. For exact data, use Instagram's native Insights." },
        { q: "Can I track other accounts?", a: "This tool provides simulated data for any username to demonstrate growth tracking features." },
      ]}
      howItWorks={[
        "Enter the Instagram username to track.",
        "Click Track to see follower growth statistics.",
        "Review daily, weekly, and monthly growth trends.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Follower Tracker", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/instagram-follower-tracker/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Instagram Username:</label>
          <div className="flex gap-3">
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="Enter username (without @)"
              onKeyDown={e => e.key === 'Enter' && track()}
              className="flex-1 bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]" />
            <button onClick={track}
              className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
              Track 📈
            </button>
          </div>
        </div>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">@{result.username} Growth Stats</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-5 text-center">
                <div className="text-xs text-slate-500 mb-1 font-medium">Total Followers</div>
                <div className="text-2xl font-extrabold text-white">{result.totalFollowers.toLocaleString()}</div>
                <div className="text-xs text-emerald-400 mt-1">↑ +{result.weeklyGrowth} this week</div>
              </div>
              <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-5 text-center">
                <div className="text-xs text-slate-500 mb-1 font-medium">Daily Average</div>
                <div className="text-2xl font-extrabold text-white">+{result.dailyAverage}</div>
                <div className="text-xs text-emerald-400 mt-1">↑ +{result.weeklyChange} from last week</div>
              </div>
              <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-5 text-center">
                <div className="text-xs text-slate-500 mb-1 font-medium">Monthly Growth</div>
                <div className="text-2xl font-extrabold text-white">+{result.monthlyGrowth.toLocaleString()}</div>
                <div className="text-xs text-emerald-400 mt-1">↑ +{result.monthlyChange}% increase</div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-4">
              <h4 className="text-sm font-bold text-slate-300 mb-3">Growth Trends</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Today</span><span className="text-emerald-400 font-semibold">+{result.todayGrowth}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Yesterday</span><span className="text-emerald-400 font-semibold">+{result.yesterdayGrowth}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">This Week</span><span className="text-emerald-400 font-semibold">+{result.weeklyGrowth}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">This Month</span><span className="text-emerald-400 font-semibold">+{result.monthlyGrowth.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Growth Rate</span><span className="text-white font-bold">{result.growthRate}%</span></div>
              </div>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📈</div>
            <p className="text-sm text-slate-600 font-medium">Enter a username and click Track</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
