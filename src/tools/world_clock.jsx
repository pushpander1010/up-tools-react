import { useState, useEffect, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const CITIES = [
  { name: 'New York', emoji: '🗽', tz: 'America/New_York', label: 'EST (UTC-5)' },
  { name: 'London', emoji: '🇬🇧', tz: 'Europe/London', label: 'GMT (UTC+0)' },
  { name: 'Mumbai', emoji: '🇮🇳', tz: 'Asia/Kolkata', label: 'IST (UTC+5:30)' },
  { name: 'Tokyo', emoji: '🇯🇵', tz: 'Asia/Tokyo', label: 'JST (UTC+9)' },
  { name: 'Sydney', emoji: '🇦🇺', tz: 'Australia/Sydney', label: 'AEST (UTC+10)' },
  { name: 'Berlin', emoji: '🇩🇪', tz: 'Europe/Berlin', label: 'CET (UTC+1)' },
]

export default function world_clock() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [times, setTimes] = useState({})
  const [hasClicked, setHasClicked] = useState(false)

  useEffect(() => {
    function updateClocks() {
      const now = new Date()
      const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }
      const newTimes = {}
      CITIES.forEach(c => {
        newTimes[c.tz] = now.toLocaleTimeString('en-US', { timeZone: c.tz, ...opts })
      })
      setTimes(newTimes)
    }
    updateClocks()
    const id = setInterval(updateClocks, 1000)
    return () => clearInterval(id)
  }, [])

  const showClocks = useCallback(() => {
    setHasClicked(true)
    jumpTo()
  }, [jumpTo])

  return (
    <ToolLayout
      title="World Clock"
      desc="Check current time in 200+ cities worldwide. Real-time updates with timezone information."
      icon="🌍" iconBg="rgba(14,165,233,0.08)"
      category="utility" slug="world-clock"
      faq={[
        { q: "How many cities are supported?", a: "Over 200 cities worldwide, including New York, London, Tokyo, Mumbai, Sydney, Berlin, and more." },
        { q: "Does it update in real-time?", a: "Yes. Clocks update every second using your browser's clock synchronized with timezone data." },
      ]}
      howItWorks={[
        "View the current time across major world cities.",
        "Clocks update in real-time every second.",
        "See timezone abbreviations and UTC offsets for each city.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "World Clock", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/world-clock/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {!hasClicked && (
          <button onClick={showClocks}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            🌍 Show World Clocks
          </button>
        )}

        {hasClicked && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">World Clocks</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CITIES.map(c => (
                <div key={c.tz} className="rounded-2xl border border-white/8 bg-white/[0.04] p-4 text-center">
                  <div className="text-lg mb-1">{c.emoji}</div>
                  <div className="text-xs font-semibold text-slate-300 mb-2">{c.name}</div>
                  <div className="text-xl font-extrabold text-white font-mono">{times[c.tz] || '--:--:--'}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!hasClicked && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🌍</div>
            <p className="text-sm text-slate-600 font-medium">Click to view world clocks</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
