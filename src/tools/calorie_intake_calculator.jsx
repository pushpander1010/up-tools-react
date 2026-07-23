import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const ACTIVITIES = [
  { val: '1.2', label: 'Sedentary (little or no exercise)' },
  { val: '1.375', label: 'Lightly active (1-3 days/week)' },
  { val: '1.55', label: 'Moderately active (3-5 days/week)' },
  { val: '1.725', label: 'Very active (6-7 days/week)' },
  { val: '1.9', label: 'Extremely active (physical job)' },
]

export default function calorie_intake_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [activity, setActivity] = useState('1.2')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const a = parseFloat(age)
    const w = parseFloat(weight)
    const h = parseFloat(height)
    const act = parseFloat(activity)
    if (!a || !w || !h) return
    let bmr
    if (gender === 'male') {
      bmr = 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
    } else {
      bmr = 447.593 + 9.247 * w + 3.098 * h - 4.330 * a
    }
    const tdee = Math.round(bmr * act)
    setResult(tdee)
  }, [age, gender, weight, height, activity])

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"

  return (
    <ToolLayout
      title="Calorie Intake Calculator"
      desc="Calculate your daily calorie needs based on age, weight, height, and activity level."
      icon="🔥" iconBg="rgba(245,158,11,0.08)"
      category="health" slug="calorie-intake-calculator"
      faq={[
        { q: 'How are calories calculated?', a: 'Using the Harris-Benedict equation for BMR, multiplied by an activity factor to get TDEE (Total Daily Energy Expenditure).' },
        { q: 'How many calories for weight loss?', a: 'A deficit of 500 calories/day typically results in about 1 lb (0.45 kg) of weight loss per week.' },
      ]}
      howItWorks={[
        'Enter your age, gender, weight (kg), and height (cm).',
        'Select your activity level.',
        'Click Calculate to see your daily calorie needs.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Calorie Intake Calculator", "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/calorie-intake-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Age</label>
              <input type="number" min="1" max="120" value={age} onChange={e => setAge(e.target.value)} placeholder="Enter age" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className={inputClass + " bg-gray-900"}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Weight (kg)</label>
              <input type="number" min="1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Enter weight" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Height (cm)</label>
              <input type="number" min="1" value={height} onChange={e => setHeight(e.target.value)} placeholder="Enter height" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Activity Level</label>
            <select value={activity} onChange={e => setActivity(e.target.value)} className={inputClass + " bg-gray-900"}>
              {ACTIVITIES.map(a => <option key={a.val} value={a.val}>{a.label}</option>)}
            </select>
          </div>
        </div>

        <button onClick={() => { calculate(); jumpTo() }}
          className="glow-btn w-full py-4 rounded-2xl text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          🔥 Calculate
        </button>

        {result && (
          <div ref={resultRef} className="text-center p-6 rounded-2xl bg-gradient-to-br from-amber-500/[0.1] to-transparent border-2 border-amber-500/20"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="text-4xl font-extrabold text-white mb-1">{result.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Daily Calorie Needs (kcal/day)</div>
          </div>
        )}

        {result && (
          <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
            <h3 className="text-sm font-bold text-slate-300 mb-3">🎯 Calorie Goals</h3>
            {[
              ['Weight Loss', `-${(500).toLocaleString()} cal/day`, 'text-red-400'],
              ['Maintenance', 'Your TDEE', 'text-emerald-400'],
              ['Weight Gain', `+${(500).toLocaleString()} cal/day`, 'text-amber-400'],
            ].map(([label, val, color]) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
                <span className="text-sm text-slate-300">{label}</span>
                <span className={`text-sm font-bold ${color}`}>{val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
