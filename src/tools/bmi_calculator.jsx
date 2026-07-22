import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function calcBMI(weight, height, unit) {
  let w = weight, h = height
  if (unit === 'imperial') { w *= 0.453592; h *= 2.54 }
  h /= 100
  if (w <= 0 || h <= 0) return null
  const bmi = w / (h * h)
  let category, color, bg, advice
  if (bmi < 18.5) { category = 'Underweight'; color = '#0ea5e9'; bg = 'rgba(14,165,233,0.15)'; advice = 'Consider increasing caloric intake with nutrient-rich foods.' }
  else if (bmi < 25) { category = 'Normal'; color = '#22c55e'; bg = 'rgba(34,197,94,0.15)'; advice = 'Great! Maintain a balanced diet and regular exercise.' }
  else if (bmi < 30) { category = 'Overweight'; color = '#f59e0b'; bg = 'rgba(245,158,11,0.15)'; advice = 'Consider increasing physical activity and reducing processed foods.' }
  else { category = 'Obese'; color = '#ef4444'; bg = 'rgba(239,68,68,0.15)'; advice = 'Consult a healthcare professional for personalized guidance.' }
  const idealLow = (18.5 * h * h).toFixed(1)
  const idealHigh = (24.9 * h * h).toFixed(1)
  return { bmi: bmi.toFixed(1), bmiNum: bmi, category, color, bg, advice, idealLow, idealHigh, heightCm: unit === 'imperial' ? (height * 2.54).toFixed(0) : height, weightKg: unit === 'imperial' ? (weight * 0.453592).toFixed(1) : weight }
}

const RANGES = [
  { label: 'Underweight', range: '< 18.5', color: '#0ea5e9', width: '22%' },
  { label: 'Normal', range: '18.5 – 24.9', color: '#22c55e', width: '50%' },
  { label: 'Overweight', range: '25 – 29.9', color: '#f59e0b', width: '75%' },
  { label: 'Obese', range: '≥ 30', color: '#ef4444', width: '100%' },
]

export default function bmi_calculator() {

  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [unit, setUnit] = useState('metric')

  const result = useMemo(() => calcBMI(parseFloat(weight), parseFloat(height), unit), [weight, height, unit])

  return (
    <ToolLayout
      title="BMI Calculator"
      desc="Calculate your Body Mass Index instantly. Supports metric (kg/cm) and imperial (lbs/inches) units."
      icon="⚖️" iconBg="rgba(20,184,166,0.08)"
      category="health" slug="bmi-calculator"
      faq={[
        { q: 'What is BMI?', a: 'Body Mass Index — a measure of body fat based on height and weight. It\'s a screening tool, not a diagnostic.' },
        { q: 'What is a healthy BMI?', a: '18.5 to 24.9 is considered normal weight for most adults.' },
        { q: 'Is BMI accurate for athletes?', a: 'BMI does not distinguish between muscle and fat. Athletes may have a high BMI due to muscle mass, not excess fat.' },
        { q: 'What should I do if my BMI is high?', a: 'Consult a healthcare professional. BMI is just one indicator — they can assess overall health more comprehensively.' },
      ]}
      howItWorks={[
        'Choose metric (kg/cm) or imperial (lbs/inches) units.',
        'Enter your weight.',
        'Enter your height.',
        'View your BMI value, category, visual meter, and health advice.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "BMI Calculator", "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/bmi-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Unit Toggle */}
        <div className="flex gap-2">
          {[['metric', 'Metric (kg/cm)'], ['imperial', 'Imperial (lbs/in)']].map(([val, label]) => (
            <button key={val} onClick={() => setUnit(val)}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all duration-200 border-2
                ${unit === val ? 'bg-teal-500/10 border-teal-500/30 text-teal-400 shadow-lg shadow-teal-500/10' : 'bg-white/[0.05] border-white/8 text-slate-500 hover:border-white/12'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="0"
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-teal-500/40 transition-all duration-300 placeholder:text-white/8" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
            <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="0"
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-teal-500/40 transition-all duration-300 placeholder:text-white/8" />
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="rounded-3xl border-2 p-8 text-center" style={{ borderColor: result.color + '30', background: result.bg.replace('0.15', '0.06'), animation: 'slideUp 0.35s ease-out' }}>
            <div className="text-6xl font-extrabold tracking-tight" style={{ color: result.color }}>{result.bmi}</div>
            <div className="text-lg font-bold mt-2" style={{ color: result.color }}>{result.category}</div>
            <p className="text-sm text-slate-400 mt-3 max-w-md mx-auto">{result.advice}</p>

            {/* BMI Meter */}
            <div className="mt-6 relative">
              <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${Math.min((result.bmiNum / 40) * 100, 100)}%`, background: `linear-gradient(90deg, ${result.color}80, ${result.color})` }} />
              </div>
              <div className="flex justify-between mt-2">
                {RANGES.map(r => (
                  <div key={r.label} className="text-center">
                    <div className="text-[10px] font-bold" style={{ color: r.color }}>{r.label}</div>
                    <div className="text-[9px] text-slate-600">{r.range}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ideal Weight */}
            <div className="mt-6 p-4 rounded-2xl bg-white/[0.04] border border-white/8">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Ideal Weight Range</div>
              <div className="text-lg font-bold text-white">{result.idealLow} – {result.idealHigh} kg</div>
              <div className="text-[11px] text-slate-500 mt-0.5">for height {result.heightCm} cm (BMI 18.5–24.9)</div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">⚖️</div>
            <p className="text-sm text-slate-600 font-medium">Enter your weight and height to calculate BMI</p>
          </div>
        )}

        {/* BMI Reference Table */}
        <div className="rounded-2xl border border-white/8 overflow-hidden">
          <div className="px-5 py-3 bg-white/[0.05] border-b border-white/8">
            <h3 className="text-sm font-bold text-slate-300">BMI Categories</h3>
          </div>
          <div className="divide-y divide-white/4">
            {RANGES.map(r => (
              <div key={r.label} className="flex items-center gap-4 px-5 py-3">
                <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                <span className="text-sm font-medium text-white flex-1">{r.label}</span>
                <span className="text-xs text-slate-500">{r.range}</span>
                <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: r.width, background: r.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
