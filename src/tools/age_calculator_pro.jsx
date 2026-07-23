import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function age_calculator_pro() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [dob, setDob] = useState('')
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split('T')[0])
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    if (!dob) { alert('Please enter your date of birth'); return }
    const birth = new Date(dob)
    const target = new Date(targetDate || new Date())
    if (isNaN(birth)) { alert('Invalid date of birth'); return }

    let years = target.getFullYear() - birth.getFullYear()
    let months = target.getMonth() - birth.getMonth()
    let days = target.getDate() - birth.getDate()

    if (days < 0) { months--; days += new Date(target.getFullYear(), target.getMonth(), 0).getDate() }
    if (months < 0) { years--; months += 12 }

    const totalDays = Math.floor((target - birth) / (1000 * 60 * 60 * 24))
    const totalHours = Math.floor(totalDays * 24)
    const totalMinutes = Math.floor(totalHours * 60)

    let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBday <= target) nextBday.setFullYear(nextBday.getFullYear() + 1)
    const daysUntilBday = Math.ceil((nextBday - target) / (1000 * 60 * 60 * 24))

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    setResult({ years, months, days, totalDays, totalHours, totalMinutes, daysUntilBday, nextBday: nextBday.toLocaleDateString(), dayOfBirth: dayNames[birth.getDay()] })
  }, [dob, targetDate])

  return (
    <ToolLayout
      title="Age Calculator Pro"
      desc="Calculate your age at any date. See total days, hours, minutes, and next birthday countdown."
      icon="⏰" iconBg="rgba(139,92,246,0.08)"
      category="health" slug="age-calculator-pro"
      faq={[
        { q: 'What is Age Calculator Pro?', a: 'An advanced age calculator that lets you compute your exact age on any past or future date, with detailed breakdowns.' },
        { q: 'Can I calculate age at a past date?', a: 'Yes! Enter any target date to see what your age was on that day.' },
      ]}
      howItWorks={[
        'Enter your date of birth.',
        'Select a target date (defaults to today).',
        'Click Calculate to see detailed age breakdown.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Age Calculator Pro", "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/age-calculator-pro/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Date of Birth</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)}
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/40 transition-all [color-scheme:dark]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Target Date</label>
            <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)}
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/40 transition-all [color-scheme:dark]" />
          </div>
        </div>

        <button onClick={() => { calculate(); jumpTo() }}
          className="glow-btn px-6 py-3 rounded-xl text-sm w-full"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
          Calculate Age
        </button>

        {result && (
          <div ref={resultRef} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Years', value: result.years },
                { label: 'Months', value: result.months },
                { label: 'Days', value: result.days },
              ].map((item, i) => (
                <div key={i} className="text-center p-4 bg-black/20 rounded-xl">
                  <div className="text-2xl font-bold text-purple-400">{item.value}</div>
                  <div className="text-xs text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '🎂 Next Birthday', value: `${result.daysUntilBday} days (${result.nextBday})` },
                { label: '📅 Born On', value: result.dayOfBirth },
                { label: '⏱️ Total Hours', value: result.totalHours.toLocaleString() },
                { label: '⏰ Total Minutes', value: result.totalMinutes.toLocaleString() },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-black/20 rounded-xl">
                  <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                  <div className="text-sm font-bold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
