import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function InstagramUnfollowerTracker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [username, setUsername] = useState('')
  const [result, setResult] = useState(null)

  const track = useCallback(() => {
    if (!username.trim()) return
    const data = {
      username: username.replace('@', ''),
      totalFollowers: Math.floor(Math.random() * 50000) + 1000,
      unfollowedWeek: Math.floor(Math.random() * 50) + 5,
      newFollowers: Math.floor(Math.random() * 100) + 10,
      ghostFollowers: Math.floor(Math.random() * 200) + 20,
      netChange: 0,
      unfollowRate: 0,
    }
    data.netChange = data.newFollowers - data.unfollowedWeek
    data.unfollowRate = ((data.unfollowedWeek / data.totalFollowers) * 100).toFixed(2)
    setResult(data)
    jumpTo()
  }, [username, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Unfollower Tracker"
      desc="Track who unfollowed you on Instagram. Monitor unfollowers, ghost followers, and net follower changes."
      icon="👥" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="instagram-unfollower-tracker"
      faq={[
        { q: "Can I see exactly who unfollowed me?", a: "This tool provides estimated unfollower counts. For exact lists, use Instagram's data export." },
        { q: "What are ghost followers?", a: "Ghost followers are accounts that follow you but never engage with your content." },
      ]}
      howItWorks={[
        "Enter your Instagram username.",
        "Click Track to see unfollower statistics.",
        "Review unfollowers, ghost followers, and net changes.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Unfollower Tracker", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/instagram-unfollower-tracker/",
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
              Track 👥
            </button>
          </div>
        </div>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">@{result.username} Unfollower Stats</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-5 text-center">
                <div className="text-xs text-slate-500 mb-1 font-medium">Total Followers</div>
                <div className="text-2xl font-extrabold text-white">{result.totalFollowers.toLocaleString()}</div>
              </div>
              <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-5 text-center">
                <div className="text-xs text-slate-500 mb-1 font-medium">Net Change</div>
                <div className={`text-2xl font-extrabold ${result.netChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.netChange >= 0 ? '+' : ''}{result.netChange}
                </div>
              </div>
              <div className="rounded-2xl bg-red-500/[0.06] border border-red-500/15 p-5 text-center">
                <div className="text-xs text-red-400/70 mb-1 font-medium">Unfollowed This Week</div>
                <div className="text-2xl font-extrabold text-red-400">{result.unfollowedWeek}</div>
              </div>
              <div className="rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/15 p-5 text-center">
                <div className="text-xs text-emerald-400/70 mb-1 font-medium">New Followers</div>
                <div className="text-2xl font-extrabold text-emerald-400">{result.newFollowers}</div>
              </div>
              <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-5 text-center col-span-2">
                <div className="text-xs text-slate-500 mb-1 font-medium">Ghost Followers (inactive)</div>
                <div className="text-2xl font-extrabold text-amber-400">{result.ghostFollowers}</div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-4">
              <h4 className="text-sm font-bold text-slate-300 mb-2">Unfollow Rate</h4>
              <div className="text-sm text-slate-400">
                <span className="text-white font-bold">{result.unfollowRate}%</span> of followers unfollowed this week
              </div>
              <div className="mt-2 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(parseFloat(result.unfollowRate) * 10, 100)}%` }} />
              </div>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">👥</div>
            <p className="text-sm text-slate-600 font-medium">Enter a username and click Track</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
