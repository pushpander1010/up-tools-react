import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const ACTIVITY_LEVELS = [
  { key: 'sedentary', label: 'Sedentary', icon: '🪑', desc: 'Desk job, minimal exercise', multiplier: 0.033 },
  { key: 'light', label: 'Light', icon: '🚶', desc: 'Light walks, stretching', multiplier: 0.035 },
  { key: 'moderate', label: 'Moderate', icon: '🏃', desc: '3–5 sessions/week', multiplier: 0.040 },
  { key: 'active', label: 'Active', icon: '💪', desc: '6–7 sessions/week', multiplier: 0.050 },
  { key: 'very_active', label: 'Very Active', icon: '🔥', desc: 'Daily intense training', multiplier: 0.065 },
]

function calcWater(weight, multiplier) {
  const litres = weight * multiplier
  const glasses = Math.ceil(litres / 0.25)
  const fillPct = Math.min((litres / 4) * 100, 100)
  return { litres, glasses, fillPct }
}

export default function water_intake_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [weight, setWeight] = useState('')
  const [activity, setActivity] = useState('moderate')
  const [showResult, setShowResult] = useState(false)

  const multiplier = useMemo(() => ACTIVITY_LEVELS.find(a => a.key === activity)?.multiplier || 0.040, [activity])

  const result = useMemo(() => {
    const w = parseFloat(weight)
    if (!w || w <= 0) return null
    return calcWater(w, multiplier)
  }, [weight, multiplier])

  const handleSubmit = useCallback(() => {
    if (!result) return
    setShowResult(true)
    jumpTo()
  }, [result, jumpTo])

  return (
    <ToolLayout
      title="Water Intake Calculator"
      desc="Calculate your ideal daily water intake based on body weight and activity level."
      icon="💧" iconBg="rgba(56,189,248,0.08)"
      category="health" slug="water-intake-calculator"
      faq={[
        { q: 'How much water should I drink daily?', a: 'A common guideline is body weight (kg) × 0.033 litres, adjusted for activity level. Most adults need 2–4 litres per day.' },
        { q: 'Does activity level affect water needs?', a: 'Yes. Physical activity increases fluid loss through sweat. Active individuals may need 30–60% more water than sedentary people.' },
        { q: 'What are signs of dehydration?', a: 'Dark urine, headache, dry mouth, fatigue, dizziness, and reduced skin elasticity. By the time you feel thirsty, you may already be mildly dehydrated.' },
      ]}
      howItWorks={[
        'Enter your body weight in kilograms.',
        'Select your daily activity level.',
        'Click Calculate to see your recommended water intake.',
        'View your daily litres, number of glasses, and a visual water fill indicator.',
      ]}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Water Intake Calculator",
        "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/water-intake-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Weight Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Body Weight (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 70"
            className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-sky-500/40 transition-all duration-300 placeholder:text-white/8" />
        </div>

        {/* Activity Level Cards */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Activity Level</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACTIVITY_LEVELS.map(a => (
              <button key={a.key} onClick={() => setActivity(a.key)}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 text-left
                  ${activity === a.key ? 'bg-sky-500/10 border-sky-500/30 shadow-lg shadow-sky-500/5' : 'bg-white/[0.05] border-white/8 hover:border-white/12'}`}>
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <div className={`text-sm font-bold ${activity === a.key ? 'text-sky-400' : 'text-white'}`}>{a.label}</div>
                  <div className="text-[11px] text-slate-500">{a.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button onClick={handleSubmit} disabled={!result}
          className={`w-full py-4 rounded-2xl text-sm font-extrabold transition-all duration-300 border-2
            ${result ? 'bg-sky-500/20 border-sky-500/40 text-sky-400 hover:bg-sky-500/30 hover:border-sky-500/50 shadow-lg shadow-sky-500/10' : 'bg-white/[0.04] border-white/8 text-slate-600 cursor-not-allowed'}`}>
          💧 Calculate Water Intake
        </button>

        {/* Result */}
        {showResult && result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-sky-500/20 bg-sky-500/[0.04] p-8 text-center overflow-hidden" style={{ animation: 'slideUp 0.35s ease-out' }}>
            {/* Water Glass Visual */}
            <div className="relative w-24 h-36 mx-auto mb-6">
              <div className="absolute inset-0 rounded-b-2xl rounded-t-lg border-2 border-sky-500/30 overflow-hidden bg-white/[0.03]">
                <div className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out rounded-b-xl"
                  style={{ height: `${result.fillPct}%`, background: 'linear-gradient(0deg, rgba(56,189,248,0.5), rgba(56,189,248,0.2))' }} />
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl">💧</div>
            </div>

            <div className="text-5xl font-extrabold text-sky-400 tracking-tight">{result.litres.toFixed(1)} L</div>
            <div className="text-sm text-sky-300/70 mt-1 font-semibold">per day</div>

            <div className="flex justify-center gap-8 mt-6">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/8">
                <div className="text-2xl font-extrabold text-white">{result.glasses}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">glasses (250ml)</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/8">
                <div className="text-2xl font-extrabold text-white">{(result.litres * 1000).toFixed(0)}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">millilitres</div>
              </div>
            </div>

            <div className="mt-5 p-4 rounded-2xl bg-white/[0.04] border border-white/8 text-left">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Formula Used</div>
              <div className="text-sm text-slate-300">{parseFloat(weight)} kg × {multiplier} = <span className="text-sky-400 font-bold">{result.litres.toFixed(2)} L</span></div>
            </div>
          </div>
        )}

        {!showResult && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💧</div>
            <p className="text-sm text-slate-600 font-medium">Enter your weight and select activity level</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
