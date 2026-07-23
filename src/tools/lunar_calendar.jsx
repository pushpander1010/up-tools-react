import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const PHASES = [
  { max: 0.125, name: 'New Moon', emoji: '🌑' },
  { max: 0.25, name: 'Waxing Crescent', emoji: '🌒' },
  { max: 0.375, name: 'First Quarter', emoji: '🌓' },
  { max: 0.5, name: 'Waxing Gibbous', emoji: '🌔' },
  { max: 0.625, name: 'Full Moon', emoji: '🌕' },
  { max: 0.75, name: 'Waning Gibbous', emoji: '🌖' },
  { max: 0.875, name: 'Last Quarter', emoji: '🌗' },
  { max: 1, name: 'Waning Crescent', emoji: '🌘' }
]

function getMoonPhase(dateStr) {
  const date = new Date(dateStr)
  const knownNewMoon = new Date(2000, 0, 6)
  const lunarCycle = 29.53058867
  const diff = (date - knownNewMoon) / (1000 * 60 * 60 * 24)
  const phase = (diff % lunarCycle) / lunarCycle
  const p = PHASES.find(p => phase < p.max) || PHASES[PHASES.length - 1]
  return { ...p, phase, illumination: (phase * 100).toFixed(1) }
}

export default function lunar_calendar() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [dateInput, setDateInput] = useState(() => new Date().toISOString().split('T')[0])
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    if (!dateInput) return
    const moon = getMoonPhase(dateInput)
    setResult(moon)
    jumpTo()
  }, [dateInput, jumpTo])

  return (
    <ToolLayout
      title="Lunar Calendar"
      desc="View lunar calendar with moon phases, lunar dates, and zodiac information."
      icon="🌙" iconBg="rgba(99,102,241,0.08)"
      category="utility" slug="lunar-calendar"
      faq={[
        { q: 'What moon phases are tracked?', a: 'New Moon, Waxing Crescent, First Quarter, Waxing Gibbous, Full Moon, Waning Gibbous, Last Quarter, and Waning Crescent.' },
        { q: 'How accurate is the calculation?', a: 'It uses the known new moon date of January 6, 2000 and the standard lunar cycle of 29.53 days.' },
        { q: 'Is this tool free?', a: 'Yes, completely free with no sign-ups required.' }
      ]}
      howItWorks={[
        'Select any date using the date picker.',
        'Click "Get Moon Phase" to calculate the lunar phase.',
        'View the moon phase name, emoji, and illumination percentage.'
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Lunar Calendar", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/lunar-calendar/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="text-xs text-slate-500 font-medium mb-1 block">Select Date</label>
          <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)}
            className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]" />
        </div>

        <button onClick={calculate}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          🌙 Get Moon Phase
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Moon Phase</h3>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">{result.emoji}</div>
              <p className="text-xl font-bold text-white mb-1">{result.name}</p>
              <p className="text-sm text-slate-400">Illumination: {result.illumination}%</p>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🌙</div>
            <p className="text-sm text-slate-600 font-medium">Select a date and click Get Moon Phase</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
