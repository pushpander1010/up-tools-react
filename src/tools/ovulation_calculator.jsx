import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function ovulation_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [lastPeriod, setLastPeriod] = useState('')
  const [cycleLength, setCycleLength] = useState('28')

  const result = useMemo(() => {
    if (!lastPeriod) return null
    const lp = new Date(lastPeriod)
    if (isNaN(lp.getTime())) return null
    const cycle = parseInt(cycleLength) || 28
    const ovulationDate = new Date(lp)
    ovulationDate.setDate(ovulationDate.getDate() + (cycle - 14))
    const fertileStart = new Date(ovulationDate)
    fertileStart.setDate(fertileStart.getDate() - 5)
    const fertileEnd = new Date(ovulationDate)
    fertileEnd.setDate(fertileEnd.getDate() + 1)
    const nextPeriod = new Date(lp)
    nextPeriod.setDate(nextPeriod.getDate() + cycle)
    return {
      ovulationDate: ovulationDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      fertileStart: fertileStart.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      fertileEnd: fertileEnd.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      nextPeriod: nextPeriod.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      cycle,
    }
  }, [lastPeriod, cycleLength])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Ovulation Calculator"
      desc="Calculate ovulation date and fertility window for family planning."
      icon="🌸" iconBg="rgba(236,72,153,0.08)"
      category="health" slug="ovulation-calculator"
      faq={[
        { q: 'How accurate is this calculator?', a: 'It provides estimates based on a 28-day average cycle. Cycles vary, so results are approximate.' },
        { q: 'What is the fertile window?', a: 'The 6-day period around ovulation when pregnancy is most likely: 5 days before ovulation and 1 day after.' },
      ]}
      howItWorks={[
        'Enter the first day of your last menstrual period.',
        'Enter your typical cycle length (default 28 days).',
        'View your estimated ovulation date and fertility window.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Ovulation Calculator", "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/ovulation-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Last Period Date</label>
            <input type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)}
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Cycle Length (days)</label>
            <input type="number" value={cycleLength} onChange={e => setCycleLength(e.target.value)}
              min="21" max="35" placeholder="e.g. 28" className={inputClass} />
          </div>
          <button onClick={() => { if (result) jumpTo() }}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            Calculate
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-pink-500/15 bg-gradient-to-br from-pink-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider">Fertility Information</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Ovulation Date', value: result.ovulationDate, color: 'text-emerald-400' },
                { label: 'Fertile Window Start', value: result.fertileStart, color: 'text-amber-400' },
                { label: 'Fertile Window End', value: result.fertileEnd, color: 'text-amber-400' },
                { label: 'Next Expected Period', value: result.nextPeriod, color: 'text-slate-300' },
              ].map((r, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-white/[0.04] last:border-0">
                  <span className="text-sm text-slate-400">{r.label}</span>
                  <span className={`text-sm font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
              <p className="text-sm text-pink-400 font-medium">🌸 {result.cycle}-day cycle • Ovulation typically occurs {result.cycle - 14} days after your last period</p>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🌸</div>
            <p className="text-sm text-slate-600 font-medium">Select your last period date to calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
