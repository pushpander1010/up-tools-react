import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function AnimatedNumber({ value, decimals = 0, prefix = '' }) {
  const [display, setDisplay] = useState(value)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!value) { setDisplay(0); return }
    const start = display
    const diff = value - start
    const duration = 400
    const startTime = performance.now()
    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(start + diff * eased)
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value])

  return <span>{prefix}{display.toFixed(decimals)}</span>
}

const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Sedentary', icon: '🪑', desc: 'Desk job, little exercise', color: 'slate' },
  { value: 1.375, label: 'Light', icon: '🚶', desc: '1–3 days/week', color: 'blue' },
  { value: 1.55, label: 'Moderate', icon: '🏋️', desc: '3–5 days/week', color: 'emerald' },
  { value: 1.725, label: 'Active', icon: '🏃', desc: '6–7 days/week', color: 'amber' },
  { value: 1.9, label: 'Very Active', icon: '🏆', desc: 'Athlete level', color: 'rose' },
]

function computeCalories(gender, age, weight, height, activityLevel) {
  if (age <= 0 || weight <= 0 || height <= 0) return null

  // Mifflin-St Jeor
  let bmr
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  const tdee = bmr * activityLevel
  const weightLoss = tdee - 500
  const weightGain = tdee + 500

  // BMI
  const heightM = height / 100
  const bmi = weight / (heightM * heightM)

  // Ideal weight range (BMI 18.5–24.9)
  const idealWeightLow = 18.5 * heightM * heightM
  const idealWeightHigh = 24.9 * heightM * heightM

  // Macro split suggestion (based on TDEE)
  // Protein: 30%, Carbs: 40%, Fat: 30% (balanced)
  const proteinCalories = tdee * 0.30
  const carbsCalories = tdee * 0.40
  const fatCalories = tdee * 0.30
  const proteinGrams = Math.round(proteinCalories / 4)
  const carbsGrams = Math.round(carbsCalories / 4)
  const fatGrams = Math.round(fatCalories / 9)

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    weightLoss: Math.round(weightLoss),
    weightGain: Math.round(weightGain),
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory: bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese',
    bmiColor: bmi < 18.5 ? 'blue' : bmi < 25 ? 'emerald' : bmi < 30 ? 'amber' : 'rose',
    idealWeightLow: Math.round(idealWeightLow),
    idealWeightHigh: Math.round(idealWeightHigh),
    proteinGrams,
    carbsGrams,
    fatGrams,
  }
}

const FAQs = [
  { q: 'What is BMR?', a: 'Basal Metabolic Rate (BMR) is the number of calories your body needs at complete rest to maintain basic life functions like breathing, circulation, and cell production. It is the minimum energy required to keep you alive.' },
  { q: 'How do I lose weight effectively?', a: 'Create a calorie deficit by consuming ~500 fewer calories than your TDEE (Total Daily Expenditure). This leads to about 0.5 kg weight loss per week. Combine with regular exercise and adequate protein intake for best results.' },
  { q: 'What is the Mifflin-St Jeor formula?', a: 'It is widely considered the most accurate BMR formula. For males: BMR = 10×weight(kg) + 6.25×height(cm) - 5×age + 5. For females: BMR = 10×weight(kg) + 6.25×height(cm) - 5×age - 161.' },
  { q: 'What is TDEE and how is it calculated?', a: 'TDEE (Total Daily Energy Expenditure) = BMR × Activity Level. It represents the total calories you burn in a day including all activities. Your activity level multiplier ranges from 1.2 (sedentary) to 1.9 (very active).' },
]

const HOW_IT_WORKS = [
  'Select your gender (Male or Female).',
  'Enter your age, weight in kg, and height in cm.',
  'Choose your activity level from the options provided.',
  'View your BMR, TDEE, and recommended calories for weight loss/gain.',
  'Check your BMI category and ideal weight range.',
  'See a suggested macro split for protein, carbs, and fat.',
]

export default function calorie_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [gender, setGender] = useState('male')
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [activity, setActivity] = useState(1.55)
  const [copied, setCopied] = useState(false)

  const a = parseFloat(age) || 0
  const w = parseFloat(weight) || 0
  const h = parseFloat(height) || 0

  const result = useMemo(() => computeCalories(gender, a, w, h, activity), [gender, a, w, h, activity])

  const handleCopy = useCallback(() => {
    if (!result) return
    const lines = [
      `Gender: ${gender === 'male' ? 'Male' : 'Female'}`,
      `Age: ${age} years | Weight: ${weight} kg | Height: ${height} cm`,
      `Activity: ${ACTIVITY_LEVELS.find(l => l.value === activity)?.label}`,
      ``,
      `BMR: ${result.bmr} kcal/day`,
      `TDEE: ${result.tdee} kcal/day`,
      `Weight Loss: ${result.weightLoss} kcal/day`,
      `Weight Gain: ${result.weightGain} kcal/day`,
      `BMI: ${result.bmi} (${result.bmiCategory})`,
      `Ideal Weight: ${result.idealWeightLow}–${result.idealWeightHigh} kg`,
      ``,
      `Protein: ${result.proteinGrams}g | Carbs: ${result.carbsGrams}g | Fat: ${result.fatGrams}g`,
    ].join('\n')
    navigator.clipboard.writeText(lines)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [result, gender, age, weight, height, activity])

  // Circular progress for BMR and TDEE
  const bmrPct = result ? Math.min(result.bmr / 3000, 1) : 0
  const tdeePct = result ? Math.min(result.tdee / 4500, 1) : 0

  const colorMap = { blue: 'text-blue-400', emerald: 'text-emerald-400', amber: 'text-amber-400', rose: 'text-rose-400', slate: 'text-slate-400' }

  return (
    <ToolLayout
      title="Calorie Calculator"
      desc="Calculate your daily calorie needs using the Mifflin-St Jeor formula. Get BMR, TDEE, BMI, ideal weight range, and macro split."
      icon="🔥" iconBg="rgba(239,68,68,0.08)"
      category="health" slug="calorie-calculator"
      faq={FAQs}
      howItWorks={HOW_IT_WORKS}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Calorie Calculator", "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/calorie-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ─── Gender Toggle ─── */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Gender</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['male', 'Male', '♂'],
              ['female', 'Female', '♀'],
            ].map(([val, label, symbol]) => (
              <button key={val} onClick={() => setGender(val)}
                className={`relative p-5 rounded-2xl border-2 text-center transition-all duration-300 overflow-hidden
                  ${gender === val
                    ? val === 'male'
                      ? 'bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10'
                      : 'bg-rose-500/10 border-rose-500/30 shadow-lg shadow-rose-500/10'
                    : 'bg-white/[0.05] border-white/8 hover:border-white/12 hover:bg-white/[0.06]'
                  }`}>
                {gender === val && (
                  <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent" />
                )}
                <span className="relative text-3xl mb-2 block">{symbol}</span>
                <span className={`relative text-sm font-bold ${gender === val ? (val === 'male' ? 'text-blue-400' : 'text-rose-400') : 'text-slate-400'}`}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Age, Weight, Height ─── */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Age</label>
            <div className="relative group">
              <input
                type="number" value={age} onChange={e => setAge(e.target.value)}
                placeholder="25" min="1" max="120"
                className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-4 py-4 text-2xl font-bold text-white outline-none text-center
                  focus:border-red-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_30px_rgba(239,68,68,0.06)]
                  transition-all duration-300 placeholder:text-slate-500"
              />
              <span className="absolute right-3 bottom-2 text-[10px] text-slate-600">yrs</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Weight</label>
            <div className="relative group">
              <input
                type="number" value={weight} onChange={e => setWeight(e.target.value)}
                placeholder="70" step="0.1"
                className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-4 py-4 text-2xl font-bold text-white outline-none text-center
                  focus:border-red-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_30px_rgba(239,68,68,0.06)]
                  transition-all duration-300 placeholder:text-slate-500"
              />
              <span className="absolute right-3 bottom-2 text-[10px] text-slate-600">kg</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Height</label>
            <div className="relative group">
              <input
                type="number" value={height} onChange={e => setHeight(e.target.value)}
                placeholder="175" step="0.1"
                className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-4 py-4 text-2xl font-bold text-white outline-none text-center
                  focus:border-red-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_30px_rgba(239,68,68,0.06)]
                  transition-all duration-300 placeholder:text-slate-500"
              />
              <span className="absolute right-3 bottom-2 text-[10px] text-slate-600">cm</span>
            </div>
          </div>
        </div>

        {/* ─── Activity Level Cards ─── */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Activity Level</label>
          <div className="grid grid-cols-5 gap-2">
            {ACTIVITY_LEVELS.map(level => (
              <button key={level.value} onClick={() => setActivity(level.value)}
                className={`relative p-3 rounded-xl text-center transition-all duration-200 overflow-hidden
                  ${activity === level.value
                    ? `bg-${level.color}-500/10 border-2 border-${level.color}-500/30 shadow-lg shadow-${level.color}-500/10`
                    : 'bg-white/[0.06] border-2 border-white/8 hover:bg-white/[0.08] hover:border-white/12'
                  }`}
                style={activity === level.value ? {
                  background: level.color === 'slate' ? 'rgba(100,116,139,0.1)' :
                    level.color === 'blue' ? 'rgba(59,130,246,0.1)' :
                    level.color === 'emerald' ? 'rgba(16,185,129,0.1)' :
                    level.color === 'amber' ? 'rgba(245,158,11,0.1)' : 'rgba(244,63,94,0.1)',
                  borderColor: level.color === 'slate' ? 'rgba(100,116,139,0.3)' :
                    level.color === 'blue' ? 'rgba(59,130,246,0.3)' :
                    level.color === 'emerald' ? 'rgba(16,185,129,0.3)' :
                    level.color === 'amber' ? 'rgba(245,158,11,0.3)' : 'rgba(244,63,94,0.3)',
                  boxShadow: level.color === 'slate' ? '0 4px 20px rgba(100,116,139,0.1)' :
                    level.color === 'blue' ? '0 4px 20px rgba(59,130,246,0.1)' :
                    level.color === 'emerald' ? '0 4px 20px rgba(16,185,129,0.1)' :
                    level.color === 'amber' ? '0 4px 20px rgba(245,158,11,0.1)' : '0 4px 20px rgba(244,63,94,0.1)',
                } : {}}>
                <span className="text-xl mb-1 block">{level.icon}</span>
                <span className={`text-[10px] font-bold block ${activity === level.value ? colorMap[level.color] : 'text-slate-400'}`}>
                  {level.label}
                </span>
                <span className="text-[8px] text-slate-600 block mt-0.5 leading-tight">{level.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Result ─── */}
        {result && (
          <div className="rounded-3xl border-2 border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Your Results</h3>
              </div>
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:border-white/15 hover:bg-white/10 transition-all duration-200 active:scale-95">
                {copied ? (
                  <><svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Copied!</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg> Copy</>
                )}
              </button>
            </div>

            {/* BMR & TDEE Circles */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* BMR Circle */}
              <div className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.03] border border-white/8">
                <div className="relative w-28 h-28 mb-3">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${bmrPct * 264} 264`}
                      className="transition-all duration-700" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-white"><AnimatedNumber value={result.bmr} /></span>
                    <span className="text-[10px] text-slate-500">kcal</span>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-300">BMR</div>
                <div className="text-[10px] text-slate-500">Basal Metabolic Rate</div>
              </div>

              {/* TDEE Circle */}
              <div className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.03] border border-white/8">
                <div className="relative w-28 h-28 mb-3">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(16,185,129,0.5)" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${tdeePct * 264} 264`}
                      className="transition-all duration-700" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-white"><AnimatedNumber value={result.tdee} /></span>
                    <span className="text-[10px] text-slate-500">kcal</span>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-300">TDEE</div>
                <div className="text-[10px] text-slate-500">Total Daily Expenditure</div>
              </div>
            </div>

            {/* Color-coded Goal Cards */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/15 text-center">
                <div className="text-[10px] text-blue-400 uppercase font-bold tracking-wider mb-1">Weight Loss</div>
                <div className="text-xl font-extrabold text-blue-400"><AnimatedNumber value={result.weightLoss} /></div>
                <div className="text-[10px] text-slate-500">kcal/day</div>
                <div className="text-[9px] text-blue-400/60 mt-1">~0.5 kg/week</div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 text-center">
                <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-1">Maintain</div>
                <div className="text-xl font-extrabold text-emerald-400"><AnimatedNumber value={result.tdee} /></div>
                <div className="text-[10px] text-slate-500">kcal/day</div>
                <div className="text-[9px] text-emerald-400/60 mt-1">Current weight</div>
              </div>
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/15 text-center">
                <div className="text-[10px] text-rose-400 uppercase font-bold tracking-wider mb-1">Weight Gain</div>
                <div className="text-xl font-extrabold text-rose-400"><AnimatedNumber value={result.weightGain} /></div>
                <div className="text-[10px] text-slate-500">kcal/day</div>
                <div className="text-[9px] text-rose-400/60 mt-1">~0.5 kg/week</div>
              </div>
            </div>

            {/* BMI & Ideal Weight */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/8 mb-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs text-slate-500">Your BMI</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-white">{result.bmi}</span>
                    <span className={`text-xs font-bold ${colorMap[result.bmiColor]}`}>{result.bmiCategory}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Ideal Weight</span>
                  <div className="text-lg font-bold text-white">{result.idealWeightLow}–{result.idealWeightHigh} kg</div>
                </div>
              </div>
              {/* BMI Scale Bar */}
              <div className="h-2.5 rounded-full bg-white/5 overflow-hidden flex">
                <div className="bg-blue-500/50 h-full" style={{ width: '20%' }} />
                <div className="bg-emerald-500/50 h-full" style={{ width: '25%' }} />
                <div className="bg-amber-500/50 h-full" style={{ width: '25%' }} />
                <div className="bg-rose-500/50 h-full" style={{ width: '30%' }} />
              </div>
              <div className="flex justify-between mt-1 text-[9px] text-slate-600">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </div>

            {/* Macro Split */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/8">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Suggested Macro Split</h4>
              <div className="flex gap-1 h-6 rounded-full overflow-hidden mb-3">
                <div className="bg-indigo-500/60 h-full flex items-center justify-center text-[9px] font-bold text-white/80"
                  style={{ width: '30%' }}>30%</div>
                <div className="bg-emerald-500/60 h-full flex items-center justify-center text-[9px] font-bold text-white/80"
                  style={{ width: '40%' }}>40%</div>
                <div className="bg-amber-500/60 h-full flex items-center justify-center text-[9px] font-bold text-white/80"
                  style={{ width: '30%' }}>30%</div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-lg font-extrabold text-indigo-400">{result.proteinGrams}g</div>
                  <div className="text-[10px] text-slate-500">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-extrabold text-emerald-400">{result.carbsGrams}g</div>
                  <div className="text-[10px] text-slate-500">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-extrabold text-amber-400">{result.fatGrams}g</div>
                  <div className="text-[10px] text-slate-500">Fat</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔥</div>
            <p className="text-sm text-slate-600 font-medium">Enter your details to calculate daily calorie needs</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
