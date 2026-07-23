import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const CYCLE_MINUTES = 90
const TOTAL_CYCLES = 6
const FALL_ASLEEP_MINUTES = 14

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function formatMinutes(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function calcWakeTimes(bedtimeStr) {
  if (!bedtimeStr) return null
  const [h, m] = bedtimeStr.split(':').map(Number)
  const now = new Date()
  const bedtime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m)

  const results = []
  for (let i = 1; i <= TOTAL_CYCLES; i++) {
    const totalSleep = (i * CYCLE_MINUTES) - FALL_ASLEEP_MINUTES
    const wakeTime = new Date(bedtime.getTime() + (i * CYCLE_MINUTES * 60 * 1000))
    const isRecommended = i >= 4 && i <= 5
    results.push({ cycles: i, wakeTime, totalSleep, isRecommended })
  }
  return results
}

export default function sleep_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [bedtime, setBedtime] = useState('23:00')
  const [showResult, setShowResult] = useState(false)

  const wakeTimes = useMemo(() => calcWakeTimes(bedtime), [bedtime])

  const handleSubmit = useCallback(() => {
    if (!wakeTimes) return
    setShowResult(true)
    jumpTo()
  }, [wakeTimes, jumpTo])

  return (
    <ToolLayout
      title="Sleep Calculator"
      desc="Find the perfect bedtime or wake-up time based on sleep cycles of 90 minutes."
      icon="😴" iconBg="rgba(139,92,246,0.08)"
      category="health" slug="sleep-calculator"
      faq={[
        { q: 'How many sleep cycles do I need?', a: 'Most adults need 4–6 sleep cycles per night, with 4–5 (6–7.5 hours) being ideal for most people.' },
        { q: 'What is the 90-minute rule?', a: 'Each sleep cycle lasts approximately 90 minutes. Waking up at the end of a cycle (rather than mid-cycle) helps you feel more refreshed.' },
        { q: 'What is the optimal sleep time?', a: 'The optimal amount is 7–9 hours for adults. Going to bed between 10–11 PM aligns well with your circadian rhythm.' },
      ]}
      howItWorks={[
        'Select your desired bedtime.',
        'Click Calculate to see your optimal wake-up times.',
        'Each option shows a full sleep cycle count (90 minutes each).',
        'The recommended options (4–5 cycles) are highlighted in purple.',
      ]}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Sleep Calculator",
        "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/sleep-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Bedtime Picker */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">I go to bed at</label>
          <div className="relative">
            <input type="time" value={bedtime} onChange={e => setBedtime(e.target.value)}
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-violet-500/40 transition-all duration-300 [color-scheme:dark]" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400 text-lg pointer-events-none">🌙</div>
          </div>
        </div>

        {/* Submit Button */}
        <button onClick={handleSubmit}
          className="w-full py-4 rounded-2xl text-sm font-extrabold transition-all duration-300 border-2 bg-violet-500/20 border-violet-500/40 text-violet-400 hover:bg-violet-500/30 hover:border-violet-500/50 shadow-lg shadow-violet-500/10">
          😴 Calculate Wake-Up Times
        </button>

        {/* Result Timeline */}
        {showResult && wakeTimes && (
          <div ref={resultRef} className="space-y-3" style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="text-center mb-4">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Bedtime</div>
              <div className="text-2xl font-extrabold text-white mt-1">{formatTime(new Date(`2000-01-01T${bedtime}`))}</div>
            </div>

            {/* Timeline */}
            <div className="relative pl-8">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-white/8" />
              {wakeTimes.map(wt => (
                <div key={wt.cycles} className={`relative mb-4 last:mb-0 p-5 rounded-2xl border-2 transition-all
                  ${wt.isRecommended ? 'bg-violet-500/[0.08] border-violet-500/25 shadow-lg shadow-violet-500/5' : 'bg-white/[0.04] border-white/8'}`}>
                  {/* Timeline dot */}
                  <div className={`absolute -left-[1.85rem] top-6 w-3 h-3 rounded-full border-2
                    ${wt.isRecommended ? 'bg-violet-400 border-violet-400/50' : 'bg-white/10 border-white/20'}`} />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold text-white">{formatTime(wt.wakeTime)}</span>
                        {wt.isRecommended && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30">
                            ★ RECOMMENDED
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{wt.cycles} cycle{wt.cycles > 1 ? 's' : ''} · {formatMinutes(wt.totalSleep)} of sleep</div>
                    </div>
                    <div className={`text-2xl font-extrabold ${wt.isRecommended ? 'text-violet-400' : 'text-slate-600'}`}>
                      {wt.cycles}×
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="mt-4 p-4 rounded-2xl bg-white/[0.04] border border-white/8">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">💡 Tip</div>
              <p className="text-sm text-slate-400 leading-relaxed">Each sleep cycle is approximately 90 minutes. The first ~14 minutes are falling asleep, so the actual sleep time is slightly less than the cycle duration. Aim for 4–5 cycles for optimal rest.</p>
            </div>
          </div>
        )}

        {!showResult && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">😴</div>
            <p className="text-sm text-slate-600 font-medium">Pick your bedtime to find the best wake-up times</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
