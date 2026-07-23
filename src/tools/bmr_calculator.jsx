import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const ACTS = [
  { mult: 1.2, name: 'Sedentary', desc: 'Little/no exercise, desk job' },
  { mult: 1.375, name: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
  { mult: 1.55, name: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
  { mult: 1.725, name: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
  { mult: 1.9, name: 'Extra Active', desc: 'Very hard exercise or physical job' },
]

export default function bmr_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [unit, setUnit] = useState('imperial')
  const [sex, setSex] = useState('male')
  const [age, setAge] = useState('30')
  const [hFt, setHFt] = useState('5')
  const [hIn, setHIn] = useState('10')
  const [hCm, setHCm] = useState('178')
  const [weight, setWeight] = useState('170')
  const [bf, setBf] = useState('')
  const [result, setResult] = useState(null)

  const hCmVal = useMemo(() => {
    if (unit === 'metric') return parseFloat(hCm) || 178
    return ((parseFloat(hFt) || 5) * 12 + (parseFloat(hIn) || 10)) * 2.54
  }, [unit, hFt, hIn, hCm])

  const wKg = useMemo(() => {
    const w = parseFloat(weight) || 70
    return unit === 'imperial' ? w * 0.453592 : w
  }, [weight, unit])

  const calculate = useCallback(() => {
    const ageVal = parseFloat(age) || 30
    const h = hCmVal, w = wKg
    const bfVal = parseFloat(bf)
    const msj = Math.round(10 * w + 6.25 * h - 5 * ageVal + (sex === 'male' ? 5 : -161))
    const hb = Math.round(sex === 'male'
      ? (88.362 + 13.397 * w + 4.799 * h - 5.677 * ageVal)
      : (447.593 + 9.247 * w + 3.098 * h - 4.330 * ageVal))
    let km = null
    if (!isNaN(bfVal) && bfVal > 0) {
      const lbm = w * (1 - bfVal / 100)
      km = Math.round(370 + 21.6 * lbm)
    }
    setResult({ msj, hb, km })
  }, [age, hCmVal, wKg, bf, sex])

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"

  return (
    <ToolLayout
      title="BMR Calculator"
      desc="Basal metabolic rate with Mifflin-St Jeor, Harris-Benedict & Katch-McArdle formulas. TDEE at every activity level."
      icon="🔥" iconBg="rgba(245,158,11,0.08)"
      category="health" slug="bmr-calculator"
      faq={[
        { q: 'What is BMR?', a: 'Basal Metabolic Rate is the number of calories your body needs at rest to maintain basic life functions.' },
        { q: 'Which formula is best?', a: 'Mifflin-St Jeor is recommended by the American Dietetic Association. Katch-McArdle is best if you know your body fat %.' },
      ]}
      howItWorks={[
        'Select your unit system (Imperial or Metric) and sex.',
        'Enter your age, height, weight, and optionally body fat %.',
        'Click Calculate to see BMR from 3 formulas plus TDEE table.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "BMR Calculator", "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/bmr-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Unit Toggle */}
        <div className="flex gap-2">
          {['imperial', 'metric'].map(u => (
            <button key={u} onClick={() => setUnit(u)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${unit === u ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.06] border-white/[0.08] text-slate-500'}`}>
              {u === 'imperial' ? '📏 Imperial (lbs, ft/in)' : '📐 Metric (kg, cm)'}
            </button>
          ))}
        </div>

        {/* Sex Toggle */}
        <div className="flex gap-2">
          {[['male', '♂ Male'], ['female', '♀ Female']].map(([s, label]) => (
            <button key={s} onClick={() => setSex(s)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${sex === s ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.06] border-white/[0.08] text-slate-500'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Age (years)</label>
              <input type="number" min="10" max="100" value={age} onChange={e => setAge(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Weight ({unit === 'imperial' ? 'lbs' : 'kg'})
              </label>
              <input type="number" min="30" max="500" value={weight} onChange={e => setWeight(e.target.value)} className={inputClass} />
            </div>
          </div>

          {unit === 'imperial' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Height</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" min="3" max="8" value={hFt} onChange={e => setHFt(e.target.value)} placeholder="ft" className={inputClass} />
                <input type="number" min="0" max="11" value={hIn} onChange={e => setHIn(e.target.value)} placeholder="in" className={inputClass} />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Height (cm)</label>
              <input type="number" min="100" max="250" value={hCm} onChange={e => setHCm(e.target.value)} className={inputClass} />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Body Fat % <span className="text-slate-600">(optional — for Katch-McArdle)</span>
            </label>
            <input type="number" min="1" max="70" step="0.1" value={bf} onChange={e => setBf(e.target.value)} placeholder="e.g. 20" className={inputClass} />
          </div>
        </div>

        <button onClick={() => { calculate(); jumpTo() }}
          className="glow-btn w-full py-4 rounded-2xl text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          🔥 Calculate BMR
        </button>

        {result && (
          <div ref={resultRef} className="space-y-4" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <h3 className="text-sm font-bold text-center text-slate-300 uppercase tracking-wider">Your BMR Results</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Mifflin-St Jeor', val: result.msj, desc: 'Most accurate for general population', best: true },
                { name: 'Harris-Benedict', val: result.hb, desc: 'Classic formula (1919, revised 1984)', best: false },
                { name: 'Katch-McArdle', val: result.km, desc: 'Best if body fat % is known', best: false },
              ].map(c => (
                <div key={c.name} className={`p-4 rounded-2xl border-2 text-center ${c.best ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/[0.04] border-white/[0.06]'}`}>
                  <div className="text-xl font-extrabold text-white">{c.val !== null ? c.val.toLocaleString() : '—'}</div>
                  <div className="text-xs font-semibold text-slate-300 mt-1">{c.name}{c.best ? ' ✓' : ''}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">{c.desc}</div>
                </div>
              ))}
            </div>

            {/* TDEE Table */}
            <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
              <h3 className="text-sm font-bold text-slate-300 mb-3">📊 TDEE at Each Activity Level</h3>
              <div className="space-y-2">
                {ACTS.map(a => (
                  <div key={a.name} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <div>
                      <div className="text-sm font-semibold text-white">{a.name}</div>
                      <div className="text-[11px] text-slate-600">{a.desc}</div>
                    </div>
                    <div className="text-sm font-bold text-amber-400 font-mono">{Math.round(result.msj * a.mult).toLocaleString()} cal</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
