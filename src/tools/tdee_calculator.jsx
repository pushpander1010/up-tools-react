import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const ACTIVITIES = [
  { mult: 1.2, name: 'Sedentary', desc: 'Little or no exercise, desk job' },
  { mult: 1.375, name: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
  { mult: 1.55, name: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
  { mult: 1.725, name: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
  { mult: 1.9, name: 'Extra Active', desc: 'Very hard exercise, physical job' },
]

const MACRO_GOALS = [
  { name: '🔻 Weight Loss', calOff: -500, p: 0.30, c: 0.40, f: 0.30, minCal: 1200 },
  { name: '⚖️ Maintenance', calOff: 0, p: 0.25, c: 0.50, f: 0.25, minCal: 0 },
  { name: '💪 Muscle Gain', calOff: 300, p: 0.30, c: 0.45, f: 0.25, minCal: 0 },
]

export default function tdee_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [unit, setUnit] = useState('imperial')
  const [sex, setSex] = useState('male')
  const [age, setAge] = useState(25)
  const [hFt, setHFt] = useState(5)
  const [hIn, setHIn] = useState(10)
  const [hCm, setHCm] = useState(178)
  const [weight, setWeight] = useState(165)
  const [actMult, setActMult] = useState(1.375)
  const [result, setResult] = useState(null)

  const getHcm = () => {
    if (unit === 'metric') return parseFloat(hCm) || 178
    return ((parseFloat(hFt) || 5) * 12 + (parseFloat(hIn) || 10)) * 2.54
  }
  const getWkg = () => {
    const w = parseFloat(weight) || 70
    return unit === 'imperial' ? w * 0.453592 : w
  }

  const calculate = useCallback(() => {
    const a = parseFloat(age) || 25
    const h = getHcm(), w = getWkg()
    const bmr = Math.round(10 * w + 6.25 * h - 5 * a + (sex === 'male' ? 5 : -161))
    const tdee = Math.round(bmr * actMult)
    const goals = MACRO_GOALS.map(g => {
      const cal = g.minCal ? Math.max(g.minCal, tdee + g.calOff) : tdee + g.calOff
      return {
        name: g.name,
        cal,
        protein: Math.round(cal * g.p / 4),
        carbs: Math.round(cal * g.c / 4),
        fat: Math.round(cal * g.f / 9),
      }
    })
    setResult({ bmr, tdee, goals })
  }, [age, hFt, hIn, hCm, weight, sex, unit, actMult])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const fmt = (n) => n.toLocaleString()

  return (
    <ToolLayout
      title="TDEE Calculator"
      desc="Find your Total Daily Energy Expenditure, BMR, and macro targets for weight loss, maintenance, or muscle gain."
      icon="🔥" iconBg="rgba(239,68,68,0.08)"
      category="health" slug="tdee-calculator"
      faq={[
        { q: "What is TDEE?", a: "Total Daily Energy Expenditure is the total number of calories your body burns each day, including all activity. It's BMR × activity multiplier." },
        { q: "How do I use TDEE for weight loss?", a: "Eat 300-500 calories below your TDEE for steady, sustainable weight loss of about 0.5-1 lb per week." },
      ]}
      howItWorks={[
        "Select your unit system and enter age, sex, height, and weight.",
        "Choose your activity level from the list.",
        "Click Calculate to see your BMR, TDEE, calorie goals, and macro targets.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "TDEE Calculator", "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/tdee-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex gap-2">
          <button onClick={() => setUnit('imperial')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${unit === 'imperial' ? 'bg-indigo-500 text-white' : 'bg-white/[0.06] text-slate-400 border-2 border-white/8'}`}>
            Imperial (lbs, ft)
          </button>
          <button onClick={() => setUnit('metric')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${unit === 'metric' ? 'bg-indigo-500 text-white' : 'bg-white/[0.06] text-slate-400 border-2 border-white/8'}`}>
            Metric (kg, cm)
          </button>
        </div>

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Age (years)</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} min={10} max={100} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Sex</label>
              <div className="flex gap-2">
                <button onClick={() => setSex('male')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${sex === 'male' ? 'bg-indigo-500 text-white' : 'bg-white/[0.06] text-slate-400 border-2 border-white/8'}`}>♂ Male</button>
                <button onClick={() => setSex('female')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${sex === 'female' ? 'bg-indigo-500 text-white' : 'bg-white/[0.06] text-slate-400 border-2 border-white/8'}`}>♀ Female</button>
              </div>
            </div>
            {unit === 'imperial' ? (
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Height (ft & in)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={hFt} onChange={e => setHFt(e.target.value)} min={3} max={8} placeholder="ft" className={inputClass} />
                  <input type="number" value={hIn} onChange={e => setHIn(e.target.value)} min={0} max={11} placeholder="in" className={inputClass} />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Height (cm)</label>
                <input type="number" value={hCm} onChange={e => setHCm(e.target.value)} min={100} max={250} className={inputClass} />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Weight ({unit === 'imperial' ? 'lbs' : 'kg'})</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} min={50} max={500} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Activity Level</label>
            <div className="space-y-2">
              {ACTIVITIES.map((a, i) => (
                <button key={i} onClick={() => setActMult(a.mult)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${actMult === a.mult ? 'bg-indigo-500/20 border-2 border-indigo-500/40 text-white' : 'bg-white/[0.03] border-2 border-white/8 text-slate-400'}`}>
                  <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${actMult === a.mult ? 'bg-indigo-400 border-indigo-400' : 'border-slate-500'}`} />
                  <div>
                    <div className="font-bold">{a.name}</div>
                    <div className="text-xs font-normal opacity-70">{a.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={() => { calculate(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          🔥 Calculate My TDEE
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Your Results</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-2xl p-4 border-2 border-white/8 bg-white/[0.03] text-center">
                <div className="text-xl font-extrabold text-white">{fmt(result.bmr)}</div>
                <div className="text-xs text-slate-400 mt-1">BMR (Basal Metabolic Rate)</div>
              </div>
              <div className="rounded-2xl p-4 border-2 border-indigo-500/30 bg-indigo-500/10 text-center">
                <div className="text-xl font-extrabold text-indigo-300">{fmt(result.tdee)}</div>
                <div className="text-xs text-slate-400 mt-1">TDEE (Daily Calories)</div>
              </div>
            </div>

            <h3 className="text-sm font-bold text-white mb-3">Calorie Targets by Goal</h3>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {result.goals.map((g, i) => (
                <div key={i} className="rounded-xl p-3 border-2 border-white/8 bg-white/[0.03] text-center">
                  <div className="text-lg font-extrabold text-white">{fmt(g.cal)}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{g.name}</div>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-bold text-white mb-3">📊 Macro Targets</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/8">
                  <th className="text-left py-2 text-slate-400 font-semibold">Goal</th>
                  <th className="text-right py-2 text-slate-400 font-semibold">Cal</th>
                  <th className="text-right py-2 text-slate-400 font-semibold">Protein</th>
                  <th className="text-right py-2 text-slate-400 font-semibold">Carbs</th>
                  <th className="text-right py-2 text-slate-400 font-semibold">Fat</th>
                </tr></thead>
                <tbody>
                  {result.goals.map((g, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-2 text-white font-medium">{g.name}</td>
                      <td className="py-2 text-right text-white font-bold">{fmt(g.cal)}</td>
                      <td className="py-2 text-right text-rose-400 font-bold">{g.protein}g</td>
                      <td className="py-2 text-right text-amber-400 font-bold">{g.carbs}g</td>
                      <td className="py-2 text-right text-emerald-400 font-bold">{g.fat}g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔥</div>
            <p className="text-sm text-slate-600 font-medium">Enter your details and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
