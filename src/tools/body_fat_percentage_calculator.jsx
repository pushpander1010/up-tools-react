import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function body_fat_percentage_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [weight, setWeight] = useState('')
  const [waist, setWaist] = useState('')
  const [gender, setGender] = useState('male')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const w = parseFloat(weight)
    const wa = parseFloat(waist)
    if (isNaN(w) || isNaN(wa)) return
    let bodyFat
    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(wa - 15.7) + 0.15456 * Math.log10(w)) - 450
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(wa + 15.7) + 0.22100 * Math.log10(w)) - 450
    }
    const fatMass = (w * bodyFat / 100).toFixed(1)
    const leanMass = (w * (100 - bodyFat) / 100).toFixed(1)
    setResult({ bodyFat: bodyFat.toFixed(1), fatMass, leanMass })
  }, [weight, waist, gender])

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"

  return (
    <ToolLayout
      title="Body Fat Percentage Calculator"
      desc="Calculate body fat percentage using the Navy method. Gender-specific formula with fat mass and lean mass breakdown."
      icon="📊" iconBg="rgba(239,68,68,0.08)"
      category="health" slug="body-fat-percentage-calculator"
      faq={[
        { q: 'How accurate is this calculator?', a: 'The Navy method provides a good estimate but is not as accurate as DEXA scans or hydrostatic weighing.' },
        { q: 'What is a healthy body fat percentage?', a: 'For men: 10-20% is athletic, 20-25% average. For women: 18-25% athletic, 25-31% average.' },
      ]}
      howItWorks={[
        'Enter your weight in kilograms and waist circumference in centimeters.',
        'Select your gender.',
        'Click Calculate to see your body fat percentage, fat mass, and lean mass.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Body Fat Percentage Calculator", "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/body-fat-percentage-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Weight (kg)</label>
            <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 70" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Waist (cm)</label>
            <input type="number" step="0.1" value={waist} onChange={e => setWaist(e.target.value)} placeholder="e.g. 80" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Gender</label>
            <select value={gender} onChange={e => setGender(e.target.value)}
              className={inputClass + " bg-gray-900"}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <button onClick={() => { calculate(); jumpTo() }}
          className="glow-btn w-full py-4 rounded-2xl text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          📊 Calculate
        </button>

        {result && (
          <div ref={resultRef} className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/[0.08] to-transparent border-2 border-indigo-500/20"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4">Results</h3>
            {[
              ['Body Fat %', result.bodyFat + '%', 'text-indigo-400'],
              ['Fat Mass', result.fatMass + ' kg', 'text-red-400'],
              ['Lean Mass', result.leanMass + ' kg', 'text-emerald-400'],
            ].map(([label, val, color]) => (
              <div key={label} className="flex justify-between items-center py-2.5 border-b border-white/[0.04] last:border-0">
                <span className="text-sm text-slate-300">{label}</span>
                <span className={`text-sm font-bold font-mono ${color}`}>{val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
