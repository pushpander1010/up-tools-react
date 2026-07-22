import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

function calcAge(dob) {
  if (!dob) return null
  const birth = new Date(dob)
  const today = new Date()
  let y = today.getFullYear() - birth.getFullYear()
  let m = today.getMonth() - birth.getMonth()
  let d = today.getDate() - birth.getDate()
  if (d < 0) { m--; d += new Date(today.getFullYear(), today.getMonth(), 0).getDate() }
  if (m < 0) { y--; m += 12 }
  const totalDays = Math.floor((today - birth) / 86400000)
  const totalWeeks = Math.floor(totalDays / 7)
  const totalHours = totalDays * 24
  const nextBday = (() => {
    let n = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
    if (n <= today) n.setFullYear(n.getFullYear())
    return Math.ceil((n - today) / 86400000)
  })()
  return { years: y, months: m, days: d, totalDays, totalWeeks, totalHours, nextBday }
}

function getZodiac(month, day) {
  const signs = [[1, 20, 'Capricorn', '♑', 'Dec 22 – Jan 19'], [2, 19, 'Aquarius', '♒', 'Jan 20 – Feb 18'], [3, 21, 'Pisces', '♓', 'Feb 19 – Mar 20'], [4, 20, 'Aries', '♈', 'Mar 21 – Apr 19'], [5, 21, 'Taurus', '♉', 'Apr 20 – May 20'], [6, 21, 'Gemini', '♊', 'May 21 – Jun 20'], [7, 23, 'Cancer', '♋', 'Jun 21 – Jul 22'], [8, 23, 'Leo', '♌', 'Jul 23 – Aug 22'], [9, 23, 'Virgo', '♍', 'Aug 23 – Sep 22'], [10, 23, 'Libra', '♎', 'Sep 23 – Oct 22'], [11, 22, 'Scorpio', '♏', 'Oct 23 – Nov 21'], [12, 22, 'Sagittarius', '♐', 'Nov 22 – Dec 21'], [12, 32, 'Capricorn', '♑', 'Dec 22 – Jan 19']]
  for (const [m, d, name, sym, range] of signs) { if (month === m && day <= d) return { name, sym, range } }
  return { name: 'Capricorn', sym: '♑', range: 'Dec 22 – Jan 19' }
}

const StatCard = ({ value, label, color = 'gradient-text' }) => (
  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/6 text-center">
    <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
    <div className="text-xs text-slate-500 mt-1 font-medium">{label}</div>
  </div>
)

export default function age_calculator() {
  const [dob, setDob] = useState('')
  const age = useMemo(() => calcAge(dob), [dob])
  const zodiac = useMemo(() => dob ? getZodiac(new Date(dob).getMonth() + 1, new Date(dob).getDate()) : null, [dob])

  return (
    <ToolLayout
      title="Age Calculator"
      desc="Calculate your exact age in years, months, and days. Find your zodiac sign and birthday countdown."
      icon="🎂" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="age-calculator"
      faq={[
        { q: 'How is my exact age calculated?', a: 'From your date of birth to today, accounting for varying month lengths and leap years.' },
        { q: 'What is a zodiac sign?', a: 'Based on your birth date, one of 12 astrological signs associated with constellations.' },
        { q: 'Can I calculate someone else\'s age?', a: 'Yes — just enter any date of birth, not necessarily your own.' },
      ]}
      howItWorks={[
        'Select your date of birth from the date picker.',
        'View your exact age in years, months, and days.',
        'See your zodiac sign and how many days until your next birthday.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Age Calculator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/age-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Date Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Date of Birth</label>
          <input type="date" value={dob} onChange={e => setDob(e.target.value)}
            className="w-full bg-white/[0.03] border-2 border-white/8 rounded-2xl px-5 py-4 text-xl font-bold text-white outline-none focus:border-brand/40 transition-all duration-300" />
        </div>

        {/* Age Display */}
        {age && (
          <div style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <StatCard value={age.years} label="Years" />
              <StatCard value={age.months} label="Months" />
              <StatCard value={age.days} label="Days" />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard value={age.totalDays.toLocaleString()} label="Total Days" />
              <StatCard value={age.totalWeeks.toLocaleString()} label="Total Weeks" />
              <StatCard value={age.totalHours.toLocaleString()} label="Total Hours" />
            </div>
          </div>
        )}

        {/* Zodiac + Birthday */}
        {zodiac && age && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ animation: 'slideUp 0.4s ease-out' }}>
            {/* Zodiac */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/6 text-center">
              <div className="text-5xl mb-3">{zodiac.sym}</div>
              <div className="text-xl font-extrabold text-white">{zodiac.name}</div>
              <div className="text-xs text-slate-500 mt-1">{zodiac.range}</div>
            </div>

            {/* Next Birthday */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-brand/5 to-purple-500/5 border border-brand/15 text-center">
              <div className="text-5xl font-extrabold text-brand-light">{age.nextBday}</div>
              <div className="text-sm text-slate-400 mt-2">days until your next birthday</div>
              <div className="text-xs text-slate-500 mt-1">You'll be {age.years + 1} years old!</div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!dob && (
          <div className="text-center py-12 rounded-2xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎂</div>
            <p className="text-sm text-slate-600 font-medium">Select your date of birth to calculate your age</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
