import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const MILESTONES = [
  { days: 7, emoji: '🎯', label: 'First Week' },
  { days: 30, emoji: '🏆', label: 'One Month' },
  { days: 100, emoji: '💯', label: 'Century' },
  { days: 365, emoji: '🎉', label: 'One Year' },
  { days: 500, emoji: '🚀', label: 'Epic' },
  { days: 1000, emoji: '👑', label: 'Legendary' },
]

export default function snapchat_streak_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(); d.setFullYear(d.getFullYear() - 1)
    return d.toISOString().split('T')[0]
  })
  const [friendName, setFriendName] = useState('')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const start = new Date(startDate)
    if (isNaN(start)) return
    const today = new Date()
    const diffDays = Math.ceil(Math.abs(today - start) / (1000 * 60 * 60 * 24))
    setResult({ diffDays, friendName: friendName.trim() })
  }, [startDate, friendName])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const labelClass = "block text-sm font-semibold text-slate-300 mb-2"

  return (
    <ToolLayout
      title="Snapchat Streak Calculator"
      desc="Calculate your Snapchat streak duration and track milestones."
      icon="🔥" iconBg="rgba(255,252,0,0.08)"
      category="social" slug="snapchat-streak-calculator"
      faq={[
        { q: "How do Snapchat streaks work?", a: "A streak starts when you and a friend send snaps to each other for 3 consecutive days. The 🔥 emoji and number appear next to their name." },
        { q: "What happens if I lose a Snapchat streak?", a: "If you don't send a snap within 24 hours, the streak ends. You can contact Snapchat support to restore streaks lost due to technical issues." },
        { q: "What's the longest Snapchat streak ever?", a: "The longest verified Snapchat streak is over 2900+ days (8+ years). Maintaining long streaks requires daily commitment from both users." },
      ]}
      howItWorks={[
        "Select the date when your streak started.",
        "Optionally enter your friend's name.",
        "Click Calculate to see your streak duration and milestones.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Snapchat Streak Calculator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/snapchat-streak-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className={labelClass}>Streak Start Date</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Friend's Name (Optional)</label>
          <input type="text" value={friendName} onChange={e => setFriendName(e.target.value)}
            placeholder="Enter friend's name" className={inputClass} />
        </div>

        <button onClick={() => { calculate(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-sm hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 active:scale-[0.98]">
          🔥 Calculate Streak
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-yellow-500/15 bg-gradient-to-br from-yellow-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">Streak Duration</h3>
            </div>
            <div className="text-5xl font-extrabold text-white mb-1">{result.diffDays}</div>
            <div className="text-lg font-bold text-yellow-400 mb-2">🔥 Day Streak</div>
            {result.friendName && <p className="text-sm text-slate-400">with {result.friendName}</p>}

            <div className="grid grid-cols-3 gap-3 mt-6">
              {MILESTONES.map(m => (
                <div key={m.days} className={`text-center p-3 rounded-2xl border-2 transition-all ${
                  result.diffDays >= m.days
                    ? 'border-yellow-400/40 bg-yellow-400/10'
                    : 'border-white/5 bg-white/[0.02] opacity-50'
                }`}>
                  <div className="text-2xl mb-1">{m.emoji}</div>
                  <div className="text-xs font-bold text-white">{m.days} Days</div>
                  <div className="text-[10px] text-slate-500">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔥</div>
            <p className="text-sm text-slate-600 font-medium">Select a start date and click Calculate</p>
          </div>
        )}

        <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-5">
          <h3 className="text-sm font-bold text-yellow-400 mb-3">💡 Tips to Maintain Streaks</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><strong className="text-white">Set reminders:</strong> Daily alarm to send snaps</li>
            <li><strong className="text-white">Send early:</strong> Don't wait until midnight</li>
            <li><strong className="text-white">Both must send:</strong> Streaks require snaps from both users</li>
            <li><strong className="text-white">Photos/videos only:</strong> Chat messages don't count</li>
            <li><strong className="text-white">⏳ Hourglass warning:</strong> Means streak expires in 4 hours</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
}
