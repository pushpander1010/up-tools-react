import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function snapchat_score_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [snapsSent, setSnapsSent] = useState(20)
  const [snapsReceived, setSnapsReceived] = useState(20)
  const [storiesPosted, setStoriesPosted] = useState(2)
  const [streaks, setStreaks] = useState(5)
  const [days, setDays] = useState(365)
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const sent = Number(snapsSent) || 0
    const received = Number(snapsReceived) || 0
    const stories = Number(storiesPosted) || 0
    const stks = Number(streaks) || 0
    const d = Number(days) || 1

    const sentPoints = sent * d
    const receivedPoints = received * d
    const storyPoints = stories * d
    const streakBonus = stks * d * 0.5
    const activityBonus = Math.floor((sentPoints + receivedPoints) * 0.1)
    const totalScore = Math.floor(sentPoints + receivedPoints + storyPoints + streakBonus + activityBonus)

    setResult({
      totalScore,
      sentPoints: Math.floor(sentPoints),
      receivedPoints: Math.floor(receivedPoints),
      storyPoints: Math.floor(storyPoints),
      streakBonus: Math.floor(streakBonus),
      activityBonus,
    })
  }, [snapsSent, snapsReceived, storiesPosted, streaks, days])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const labelClass = "block text-sm font-semibold text-slate-300 mb-2"

  return (
    <ToolLayout
      title="Snapchat Score Calculator"
      desc="Calculate your estimated Snapchat score and learn how it works."
      icon="👻" iconBg="rgba(255,252,0,0.08)"
      category="social" slug="snapchat-score-calculator"
      faq={[
        { q: "How is Snapchat score calculated?", a: "Snapchat score is calculated based on: snaps sent (+1 point each), snaps received (+1 point each), stories posted (+1 point each), and bonus points for maintaining streaks and being active." },
        { q: "What is a good Snapchat score?", a: "Average scores: 50,000-200,000 is typical for regular users. 200,000-500,000 is high. 500,000+ is very high. 1 million+ is exceptional." },
        { q: "Can you increase Snapchat score fast?", a: "To increase score: send snaps to multiple friends daily, maintain streaks, post stories regularly, open snaps quickly, and stay active." },
      ]}
      howItWorks={[
        "Enter your daily average snaps sent, received, and stories posted.",
        "Enter your active streaks and days on Snapchat.",
        "Click Calculate to see your estimated score breakdown.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Snapchat Score Calculator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/snapchat-score-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Snaps Sent (Daily)</label>
            <input type="number" value={snapsSent} min="0" onChange={e => setSnapsSent(e.target.value)}
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Snaps Received (Daily)</label>
            <input type="number" value={snapsReceived} min="0" onChange={e => setSnapsReceived(e.target.value)}
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Stories Posted (Daily)</label>
            <input type="number" value={storiesPosted} min="0" onChange={e => setStoriesPosted(e.target.value)}
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Active Streaks</label>
            <input type="number" value={streaks} min="0" onChange={e => setStreaks(e.target.value)}
              className={inputClass} />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Days on Snapchat</label>
            <input type="number" value={days} min="1" onChange={e => setDays(e.target.value)}
              className={inputClass} />
          </div>
        </div>

        <button onClick={() => { calculate(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-all duration-200 active:scale-[0.98]">
          Calculate Score
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-yellow-500/15 bg-gradient-to-br from-yellow-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">Estimated Score</h3>
            </div>
            <div className="text-4xl font-extrabold text-white mb-1">{result.totalScore.toLocaleString()}</div>
            <p className="text-sm text-slate-400 mb-6">Approximate score based on your activity</p>
            <div className="space-y-3">
              {[
                ['Snaps Sent Points', result.sentPoints],
                ['Snaps Received Points', result.receivedPoints],
                ['Stories Points', result.storyPoints],
                ['Streak Bonus', result.streakBonus],
                ['Activity Bonus', result.activityBonus],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-slate-400">{label}</span>
                  <span className="text-sm font-bold text-white">{val.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">👻</div>
            <p className="text-sm text-slate-600 font-medium">Enter your activity and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
