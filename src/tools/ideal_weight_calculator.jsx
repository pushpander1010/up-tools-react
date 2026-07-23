import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

// Devine Formula: Male = 50 + 2.3 × (height_in - 60), Female = 45.5 + 2.3 × (height_in - 60)
function calcIdealWeight(heightCm, gender) {
  const heightIn = heightCm / 2.54
  if (gender === 'male') {
    return 50 + 2.3 * (heightIn - 60)
  }
  return 45.5 + 2.3 * (heightIn - 60)
}

function calcBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null
  const h = heightCm / 100
  return weightKg / (h * h)
}

export default function ideal_weight_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [height, setHeight] = useState('')
  const [gender, setGender] = useState('male')
  const [showResult, setShowResult] = useState(false)

  const result = useMemo(() => {
    const h = parseFloat(height)
    if (!h || h <= 0) return null
    const ideal = calcIdealWeight(h, gender)
    const idealLow = ideal * 0.90
    const idealHigh = ideal * 1.10
    const bmi = calcBMI(ideal, h)
    return {
      ideal: ideal.toFixed(1),
      idealLow: idealLow.toFixed(1),
      idealHigh: idealHigh.toFixed(1),
      bmi: bmi ? bmi.toFixed(1) : null,
      heightCm: h,
      gender,
    }
  }, [height, gender])

  const handleSubmit = useCallback(() => {
    if (!result) return
    setShowResult(true)
    jumpTo()
  }, [result, jumpTo])

  // Weight range bar: 40kg to 120kg visual scale
  const barMin = 40
  const barMax = 120
  const barRange = barMax - barMin

  return (
    <ToolLayout
      title="Ideal Weight Calculator"
      desc="Calculate your ideal body weight using the Devine formula. Get a healthy weight range based on your height and gender."
      icon="⚖️" iconBg="rgba(34,197,94,0.08)"
      category="health" slug="ideal-weight-calculator"
      faq={[
        { q: 'How is ideal weight calculated?', a: 'This tool uses the Devine formula (1974): Male = 50 + 2.3 × (height in inches − 60), Female = 45.5 + 2.3 × (height in inches − 60).' },
        { q: 'BMI vs ideal weight — what is the difference?', a: 'BMI is a ratio of weight to height squared (kg/m²). Ideal weight formulas give a target weight directly. They complement each other but neither accounts for muscle mass or body composition.' },
        { q: 'What is the Devine formula?', a: 'Published by Dr. Benjamine Devine in 1974, it estimates ideal body weight based on height and gender. It was originally designed to determine drug dosages.' },
      ]}
      howItWorks={[
        'Enter your height in centimetres.',
        'Select your gender (male or female).',
        'Click Calculate to see your ideal weight.',
        'View the ideal weight, ±10% healthy range, BMI at ideal weight, and a visual weight range bar.',
      ]}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Ideal Weight Calculator",
        "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/ideal-weight-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Height Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Height (cm)</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 170"
            className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-emerald-500/40 transition-all duration-300 placeholder:text-white/8" />
        </div>

        {/* Gender Toggle */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Gender</label>
          <div className="flex gap-3">
            {[['male', '♂️', 'Male'], ['female', '♀️', 'Female']].map(([val, emoji, label]) => (
              <button key={val} onClick={() => setGender(val)}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-bold transition-all duration-200 border-2
                  ${gender === val ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10' : 'bg-white/[0.05] border-white/8 text-slate-500 hover:border-white/12'}`}>
                <span className="text-xl">{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button onClick={handleSubmit} disabled={!result}
          className={`w-full py-4 rounded-2xl text-sm font-extrabold transition-all duration-300 border-2
            ${result ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 hover:border-emerald-500/50 shadow-lg shadow-emerald-500/10' : 'bg-white/[0.04] border-white/8 text-slate-600 cursor-not-allowed'}`}>
          ⚖️ Calculate Ideal Weight
        </button>

        {/* Result */}
        {showResult && result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/20 bg-emerald-500/[0.04] p-8 text-center" style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="text-xs text-emerald-400/70 font-semibold uppercase tracking-wider">Your Ideal Weight</div>
            <div className="text-6xl font-extrabold text-emerald-400 tracking-tight mt-2">{result.ideal}<span className="text-3xl">kg</span></div>

            {/* Healthy Range */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/8">
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Min (−10%)</div>
                <div className="text-xl font-extrabold text-white mt-1">{result.idealLow} kg</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/8">
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Max (+10%)</div>
                <div className="text-xl font-extrabold text-white mt-1">{result.idealHigh} kg</div>
              </div>
            </div>

            {/* BMI at Ideal Weight */}
            {result.bmi && (
              <div className="mt-5 p-4 rounded-2xl bg-white/[0.04] border border-white/8">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">BMI at Ideal Weight</div>
                <div className="text-lg font-bold text-emerald-400">{result.bmi} <span className="text-sm text-slate-500">(Normal range)</span></div>
              </div>
            )}

            {/* Weight Range Bar */}
            <div className="mt-6">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Weight Range Visual</div>
              <div className="relative">
                <div className="h-4 rounded-full bg-white/5 overflow-hidden relative">
                  {/* Ideal range segment */}
                  <div className="absolute h-full rounded-full" style={{
                    left: `${((parseFloat(result.idealLow) - barMin) / barRange) * 100}%`,
                    width: `${((parseFloat(result.idealHigh) - parseFloat(result.idealLow)) / barRange) * 100}%`,
                    background: 'linear-gradient(90deg, rgba(34,197,94,0.4), rgba(34,197,94,0.7), rgba(34,197,94,0.4))',
                  }} />
                  {/* Ideal marker */}
                  <div className="absolute top-0 h-full w-0.5 bg-emerald-400" style={{
                    left: `${((parseFloat(result.ideal) - barMin) / barRange) * 100}%`,
                  }} />
                </div>
                {/* Scale labels */}
                <div className="flex justify-between mt-2">
                  {[barMin, 60, 80, 100, barMax].map(v => (
                    <div key={v} className="text-[10px] text-slate-600">{v}kg</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Formula Detail */}
            <div className="mt-5 p-4 rounded-2xl bg-white/[0.04] border border-white/8 text-left">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Formula Used</div>
              <div className="text-sm text-slate-300">
                {result.gender === 'male' ? '50' : '45.5'} + 2.3 × ({result.heightCm}cm ÷ 2.54 − 60) = <span className="text-emerald-400 font-bold">{result.ideal} kg</span>
              </div>
            </div>
          </div>
        )}

        {!showResult && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">⚖️</div>
            <p className="text-sm text-slate-600 font-medium">Enter your height and gender to calculate ideal weight</p>
          </div>
        )}

        {/* Reference Table */}
        <div className="rounded-2xl border border-white/8 overflow-hidden">
          <div className="px-5 py-3 bg-white/[0.05] border-b border-white/8">
            <h3 className="text-sm font-bold text-slate-300">Devine Formula Reference</h3>
          </div>
          <div className="divide-y divide-white/4">
            {[
              { h: '150 cm', m: '46.3 kg', f: '41.8 kg' },
              { h: '160 cm', m: '52.1 kg', f: '47.6 kg' },
              { h: '170 cm', m: '57.8 kg', f: '53.3 kg' },
              { h: '180 cm', m: '63.6 kg', f: '59.1 kg' },
              { h: '190 cm', m: '69.3 kg', f: '64.8 kg' },
            ].map(r => (
              <div key={r.h} className="flex items-center px-5 py-3 text-sm">
                <span className="text-slate-400 font-medium w-20">{r.h}</span>
                <span className="text-white flex-1">♂ {r.m}</span>
                <span className="text-slate-300 flex-1">♀ {r.f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
