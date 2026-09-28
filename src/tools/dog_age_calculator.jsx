import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const SIZES = {
  small:  { label: 'Small (< 10 kg)',  factor: [15, 9, 5] },
  medium: { label: 'Medium (10–25 kg)', factor: [15, 9, 5.5] },
  large:  { label: 'Large (25–45 kg)',  factor: [15, 9, 6] },
  giant:  { label: 'Giant (> 45 kg)',   factor: [15, 9, 7] },
}

const STAGES = [
  { max: 0.08, label: 'Newborn', emoji: '🐶' },
  { max: 0.25, label: 'Puppy', emoji: '🐕' },
  { max: 1, label: 'Junior', emoji: '🦮' },
  { max: 3, label: 'Adult', emoji: '🐕‍🦺' },
  { max: 7, label: 'Mature', emoji: '🐕‍🦺' },
  { max: Infinity, label: 'Senior', emoji: '🐾' },
]

const FUN_FACTS = [
  "A dog's nose print is unique — like a human fingerprint!",
  "Dogs can learn over 1,000 words and gestures.",
  "A dog's sense of smell is 10,000× stronger than yours.",
  "Dogs dream just like humans — they twitch during REM sleep.",
  "A greyhound can beat a cheetah in a long-distance race.",
  "Dogs can smell diseases, including certain cancers.",
]

function getAge(dogYears, dogMonths) {
  return (parseFloat(dogYears) || 0) + (parseFloat(dogMonths) || 0) / 12
}

function calcHumanAge(dogAge, size) {
  const f = SIZES[size].factor
  if (dogAge <= 0) return 0
  if (dogAge <= 1) return dogAge * f[0]
  if (dogAge <= 2) return f[0] + (dogAge - 1) * f[1]
  return f[0] + f[1] + (dogAge - 2) * f[2]
}

function getStage(dogAge) {
  for (const s of STAGES) { if (dogAge <= s.max) return s }
  return STAGES[STAGES.length - 1]
}

function getFact(index) { return FUN_FACTS[index % FUN_FACTS.length] }

export default function dog_age_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [dogYears, setDogYears] = useState('')
  const [dogMonths, setDogMonths] = useState('')
  const [size, setSize] = useState('medium')
  const [factIdx, setFactIdx] = useState(0)

  const calculate = useCallback(() => {
    const age = getAge(dogYears, dogMonths)
    if (age <= 0) return null
    const humanYears = calcHumanAge(age, size)
    const stage = getStage(age)
    return { humanYears, stage, dogAge: age }
  }, [dogYears, dogMonths, size])

  const result = calculate()

  const handleCalculate = () => {
    const r = calculate()
    if (r) setFactIdx((prev) => (prev + 1) % FUN_FACTS.length)
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-rose-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-rose-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="Dog Age Calculator — Convert to Human Years"
      desc="Convert your dog's age to human years using a size-adjusted formula. Know your dog's life stage and get fun dog facts."
      icon="🐕" iconBg="rgba(244,63,94,0.08)"
      category="fun" slug="dog-age-calculator"
      faq={[
        { q: "How do you calculate dog age in human years?", a: "The old '1 dog year = 7 human years' is a myth. Dogs age faster early on: roughly 15 human years for the first year, 9 for the second, then 4–7 per year depending on breed size." },
        { q: "Why does dog size matter for age conversion?", a: "Small dogs tend to live longer and age slower after maturity, while giant breeds age faster. Size-adjusted formulas account for this difference in life expectancy." },
        { q: "What is considered a senior dog?", a: "Generally, dogs are considered senior around 7–10 years, depending on breed. Giant breeds may be senior as early as 5–6 years, while small breeds can stay active past 10." },
        { q: "How do I use this Dog Age Calculator free?", a: "Enter your dog's age in years and months, select their size category, and click Calculate. It's free, no sign-up required." },
      ]}
      howItWorks={[
        "Enter your dog's age in years and months.",
        "Select your dog's size: small, medium, large, or giant.",
        "Click Calculate to see the human-equivalent age.",
        "View your dog's life stage label and a fun dog fact.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Dog Age Calculator", "applicationCategory": "EntertainmentApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Years</label>
              <input type="number" value={dogYears} onChange={(e) => setDogYears(e.target.value)}
                placeholder="e.g. 3" min="0" max="30" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Months</label>
              <input type="number" value={dogMonths} onChange={(e) => setDogMonths(e.target.value)}
                placeholder="e.g. 6" min="0" max="11" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Dog Size</label>
            <select value={size} onChange={(e) => setSize(e.target.value)} className={selectClass}>
              {Object.entries(SIZES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-rose-500/15 bg-gradient-to-br from-rose-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="text-center mb-5">
              <div className="text-5xl font-extrabold text-rose-400">{Math.round(result.humanYears)}</div>
              <div className="text-sm text-slate-400 mt-1">human years old</div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Life Stage', value: `${result.stage.emoji} ${result.stage.label}`, color: 'text-white' },
                { label: 'Dog Age', value: `${Math.floor(result.dogAge)} yr ${Math.round((result.dogAge % 1) * 12)} mo`, color: 'text-white' },
                { label: 'Size Category', value: SIZES[size].label, color: 'text-slate-300' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 rounded-2xl bg-rose-500/[0.08] border border-rose-500/10">
              <p className="text-sm text-rose-200 font-medium">🐾 Fun Fact: {getFact(factIdx)}</p>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🐕</div>
            <p className="text-sm text-slate-600 font-medium">Enter your dog's age and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
