import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const BP_CATEGORIES = [
  {
    label: 'Normal',
    color: 'green',
    bg: 'from-green-500/[0.06]',
    border: 'border-green-500/15',
    badge: 'bg-green-500/20 text-green-400',
    systolic: [0, 120],
    diastolic: [0, 80],
    meaning: 'Your blood pressure is in the healthy range. Keep up the good lifestyle habits!',
    doctor: 'Regular check-ups are still recommended as part of routine health maintenance.',
  },
  {
    label: 'Elevated',
    color: 'yellow',
    bg: 'from-yellow-500/[0.06]',
    border: 'border-yellow-500/15',
    badge: 'bg-yellow-500/20 text-yellow-400',
    systolic: [120, 130],
    diastolic: [0, 80],
    meaning: 'Blood pressure is slightly above normal. Lifestyle changes can help bring it down.',
    doctor: 'Monitor regularly. If it persists, consult a doctor within a few weeks.',
  },
  {
    label: 'Stage 1 Hypertension',
    color: 'orange',
    bg: 'from-orange-500/[0.06]',
    border: 'border-orange-500/15',
    badge: 'bg-orange-500/20 text-orange-400',
    systolic: [130, 140],
    diastolic: [80, 90],
    meaning: 'Blood pressure is consistently elevated. This increases risk of heart disease over time.',
    doctor: 'See a doctor within a month. Medication and lifestyle changes may be recommended.',
  },
  {
    label: 'Stage 2 Hypertension',
    color: 'red',
    bg: 'from-red-500/[0.06]',
    border: 'border-red-500/15',
    badge: 'bg-red-500/20 text-red-400',
    systolic: [140, 180],
    diastolic: [90, 120],
    meaning: 'Blood pressure is significantly high. This requires prompt medical attention.',
    doctor: 'See a doctor within a week. Medication is usually needed alongside lifestyle changes.',
  },
  {
    label: 'Hypertensive Crisis',
    color: 'rose',
    bg: 'from-rose-600/[0.08]',
    border: 'border-rose-500/20',
    badge: 'bg-rose-600/25 text-rose-300',
    systolic: [180, 300],
    diastolic: [120, 300],
    meaning: '⚠️ Blood pressure is dangerously high. This is a medical emergency.',
    doctor: 'Seek emergency medical care IMMEDIATELY. Call emergency services if you have symptoms like chest pain, shortness of breath, or vision changes.',
  },
]

function classify(sys, dia) {
  for (const cat of BP_CATEGORIES) {
    if (sys >= cat.systolic[0] && sys < cat.systolic[1] &&
        dia >= cat.diastolic[0] && dia < cat.diastolic[1]) {
      return cat
    }
  }
  // Fallback: highest category
  return BP_CATEGORIES[BP_CATEGORIES.length - 1]
}

export default function blood_pressure_checker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')

  const calculate = useCallback(() => {
    const sys = parseInt(systolic) || 0
    const dia = parseInt(diastolic) || 0
    if (sys <= 0 || dia <= 0 || sys <= dia) return null
    return classify(sys, dia)
  }, [systolic, diastolic])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-red-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Blood Pressure Checker — BP Category Calculator"
      desc="Check your blood pressure reading against AHA categories. Find out if your BP is normal, elevated, or high — and when to see a doctor."
      icon="❤️" iconBg="rgba(239,68,68,0.08)"
      category="health" slug="blood-pressure-checker"
      faq={[
        { q: "What are the blood pressure categories?", a: "According to the American Heart Association (AHA): Normal (below 120/80), Elevated (120-129/below 80), Stage 1 Hypertension (130-139/80-89), Stage 2 Hypertension (140+/90+), and Hypertensive Crisis (180+/120+)." },
        { q: "What does systolic vs diastolic mean?", a: "Systolic (top number) measures pressure when the heart beats. Diastolic (bottom number) measures pressure when the heart rests between beats. Both numbers matter for health assessment." },
        { q: "How often should I check my blood pressure?", a: "If your BP is normal, check at least once a year. If elevated or high, check more frequently as advised by your doctor — often daily or weekly." },
        { q: "Is this Blood Pressure Checker a substitute for a doctor?", a: "No. This tool provides general guidance based on AHA categories. It is NOT medical advice. Always consult a qualified healthcare professional for diagnosis and treatment." },
      ]}
      howItWorks={[
        "Enter your systolic (upper) blood pressure reading in mmHg.",
        "Enter your diastolic (lower) blood pressure reading in mmHg.",
        "Click Check to see your BP category, what it means, and when to see a doctor.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Blood Pressure Checker", "applicationCategory": "HealthApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Disclaimer */}
        <div className="p-4 rounded-2xl bg-yellow-500/[0.08] border border-yellow-500/15">
          <p className="text-xs text-yellow-300 font-medium leading-relaxed">
            ⚠️ <strong>Disclaimer:</strong> This tool is for informational purposes only and is NOT medical advice. Always consult a qualified healthcare professional for diagnosis and treatment.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Systolic (mmHg)</label>
              <input type="number" value={systolic} onChange={(e) => setSystolic(e.target.value)}
                placeholder="e.g. 120" min="0" max="300" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Diastolic (mmHg)</label>
              <input type="number" value={diastolic} onChange={(e) => setDiastolic(e.target.value)}
                placeholder="e.g. 80" min="0" max="200" className={inputClass} />
            </div>
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-400 transition-all duration-200 active:scale-[0.98]">
          Check
        </button>

        {result ? (
          <div ref={resultRef} className={`rounded-3xl border-2 ${result.border} bg-gradient-to-br ${result.bg} via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden`}
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full bg-${result.color}-400 animate-pulse`} />
              <h3 className={`text-sm font-bold text-${result.color}-400 uppercase tracking-wider`}>Result</h3>
            </div>
            <div className="text-center mb-5">
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${result.badge}`}>{result.label}</span>
              <div className="text-lg text-white font-semibold mt-3">{systolic} / {diastolic} mmHg</div>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5">
                <p className="text-sm text-slate-300 font-medium leading-relaxed">💡 <strong>What it means:</strong> {result.meaning}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5">
                <p className="text-sm text-slate-300 font-medium leading-relaxed">🏥 <strong>When to see a doctor:</strong> {result.doctor}</p>
              </div>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">❤️</div>
            <p className="text-sm text-slate-600 font-medium">Enter your BP readings and click Check</p>
          </div>
        )}

        {/* AHA Reference Table */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">AHA Blood Pressure Categories</h4>
          <div className="space-y-1.5 text-xs">
            {BP_CATEGORIES.map((cat, i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-white/5 last:border-0">
                <span className={`font-semibold text-${cat.color}-400`}>{cat.label}</span>
                <span className="text-slate-400">
                  {cat.systolic[0]}–{cat.systolic[1] === 300 ? '180+' : cat.systolic[1] - 1} / {cat.diastolic[1] === 300 ? '120+' : cat.diastolic[1] - 1}+
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
