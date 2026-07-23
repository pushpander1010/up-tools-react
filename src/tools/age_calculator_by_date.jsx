import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const ZODIAC_SIGNS = [
  { name: 'Capricorn', emoji: '♑', start: [12, 22], end: [1, 19] },
  { name: 'Aquarius', emoji: '♒', start: [1, 20], end: [2, 18] },
  { name: 'Pisces', emoji: '♓', start: [2, 19], end: [3, 20] },
  { name: 'Aries', emoji: '♈', start: [3, 21], end: [4, 19] },
  { name: 'Taurus', emoji: '♉', start: [4, 20], end: [5, 20] },
  { name: 'Gemini', emoji: '♊', start: [5, 21], end: [6, 20] },
  { name: 'Cancer', emoji: '♋', start: [6, 21], end: [7, 22] },
  { name: 'Leo', emoji: '♌', start: [7, 23], end: [8, 22] },
  { name: 'Virgo', emoji: '♍', start: [8, 23], end: [9, 22] },
  { name: 'Libra', emoji: '♎', start: [9, 23], end: [10, 22] },
  { name: 'Scorpio', emoji: '♏', start: [10, 23], end: [11, 21] },
  { name: 'Sagittarius', emoji: '♐', start: [11, 22], end: [12, 21] },
]

function getZodiac(month, day) {
  for (const sign of ZODIAC_SIGNS) {
    if ((month === sign.start[0] && day >= sign.start[1]) || (month === sign.end[0] && day <= sign.end[1])) {
      return sign
    }
  }
  return ZODIAC_SIGNS[0]
}

export default function age_calculator_by_date() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [dob, setDob] = useState('')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    if (!dob) return
    const birthDate = new Date(dob)
    if (isNaN(birthDate)) return
    const today = new Date()
    let years = today.getFullYear() - birthDate.getFullYear()
    let months = today.getMonth() - birthDate.getMonth()
    let days = today.getDate() - birthDate.getDate()
    if (days < 0) { months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate() }
    if (months < 0) { years--; months += 12 }
    const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24))
    const nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
    if (nextBday < today) nextBday.setFullYear(today.getFullYear() + 1)
    const daysUntilBday = Math.ceil((nextBday - today) / (1000 * 60 * 60 * 24))
    const zodiac = getZodiac(birthDate.getMonth() + 1, birthDate.getDate())
    setResult({ years, months, days, totalDays, daysUntilBday, zodiac })
  }, [dob])

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="Age Calculator by Date"
      desc="Calculate your exact age in years, months, and days. Find zodiac sign and days until next birthday."
      icon="🎂" iconBg="rgba(245,158,11,0.08)"
      category="health" slug="age-calculator-by-date"
      faq={[
        { q: 'How is exact age calculated?', a: 'By computing the difference between today and your birth date in years, months, and days, accounting for varying month lengths.' },
        { q: 'How is the zodiac sign determined?', a: 'From your birth month and day using the standard Western zodiac date ranges.' },
      ]}
      howItWorks={[
        'Select your date of birth using the date picker.',
        'Click Calculate to see your exact age.',
        'View your zodiac sign, total days lived, and days until next birthday.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Age Calculator", "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/age-calculator-by-date/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Date of Birth</label>
          <input type="date" value={dob} onChange={e => setDob(e.target.value)} className={inputClass} />
        </div>

        <button onClick={() => { calculate(); jumpTo() }}
          className="glow-btn w-full py-4 rounded-2xl text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          🎂 Calculate Age
        </button>

        {result && (
          <div ref={resultRef} className="space-y-4" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-amber-500/[0.1] to-transparent border-2 border-amber-500/20">
              <div className="text-3xl font-extrabold text-white mb-2">
                {result.years} <span className="text-lg text-slate-400">years</span>{' '}
                {result.months} <span className="text-lg text-slate-400">months</span>{' '}
                {result.days} <span className="text-lg text-slate-400">days</span>
              </div>
              <div className="text-2xl">{result.zodiac.emoji} {result.zodiac.name}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ['Total Days Lived', result.totalDays.toLocaleString()],
                ['Days Until Birthday', result.daysUntilBday.toString()],
              ].map(([label, val]) => (
                <div key={label} className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-center">
                  <div className="text-lg font-bold text-white">{val}</div>
                  <div className="text-[10px] text-slate-600 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
