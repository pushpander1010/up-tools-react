import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = v => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(v)

export default function salary_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [amount, setAmount] = useState('25')
  const [period, setPeriod] = useState('hourly')
  const [hoursPerDay, setHoursPerDay] = useState('8')
  const [daysPerWeek, setDaysPerWeek] = useState('5')
  const [weeksPerYear, setWeeksPerYear] = useState('52')

  const amt = parseFloat(amount) || 0
  const hpd = parseFloat(hoursPerDay) || 0
  const dpw = parseFloat(daysPerWeek) || 0
  const wpy = parseFloat(weeksPerYear) || 0

  const result = useMemo(() => {
    if (amt < 0 || hpd <= 0 || dpw <= 0 || wpy <= 0) return null
    const hoursPerWeek = hpd * dpw
    const annualHours = hoursPerWeek * wpy
    const annual = period === 'hourly' ? amt * annualHours
      : period === 'daily' ? amt * dpw * wpy
      : period === 'weekly' ? amt * wpy
      : period === 'monthly' ? amt * 12
      : amt
    const hourly = annualHours > 0 ? annual / annualHours : 0
    const daily = hourly * hpd
    const weekly = daily * dpw
    const monthly = annual / 12
    return { hourly, daily, weekly, monthly, annual }
  }, [amt, period, hpd, dpw, wpy])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  const periods = [
    { key: 'hourly', label: 'Hourly' },
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'annual', label: 'Annual' },
  ]

  return (
    <ToolLayout
      title="Salary Converter"
      desc="Convert salary between hourly, daily, weekly, monthly and annual pay. Useful for comparing job offers."
      icon="💼" iconBg="rgba(99,102,241,0.08)"
      category="finance" slug="salary-converter"
      faq={[
        { q: 'How do I convert hourly to annual?', a: 'Multiply hourly rate × hours/day × days/week × weeks/year. This calculator does it automatically.' },
        { q: 'Can I use this for freelance work?', a: 'Yes. Adjust hours per day and days per week to match your contract or workload.' },
      ]}
      howItWorks={[
        'Enter your pay amount and select the pay period.',
        'Customize your work schedule (hours/day, days/week, weeks/year).',
        'View converted rates for all pay periods.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Salary Converter", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/salary-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Amount</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                min="0" step="0.01" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Pay Period</label>
              <select value={period} onChange={e => setPeriod(e.target.value)} className={selectClass}>
                {periods.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Hours per Day</label>
              <input type="number" value={hoursPerDay} onChange={e => setHoursPerDay(e.target.value)}
                min="0.1" step="0.1" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Days per Week</label>
              <input type="number" value={daysPerWeek} onChange={e => setDaysPerWeek(e.target.value)}
                min="0.1" step="0.1" className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-300 mb-1">Weeks per Year</label>
              <input type="number" value={weeksPerYear} onChange={e => setWeeksPerYear(e.target.value)}
                min="1" step="0.1" className={inputClass} />
            </div>
          </div>
          <button onClick={() => { if (result) jumpTo() }}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            Convert
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Converted Pay</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Hourly', value: fmt(result.hourly) },
                { label: 'Daily', value: fmt(result.daily) },
                { label: 'Weekly', value: fmt(result.weekly) },
                { label: 'Monthly', value: fmt(result.monthly) },
                { label: 'Annual', value: fmt(result.annual) },
              ].map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                  <div className="text-xs text-slate-500 uppercase font-bold mb-1">{r.label}</div>
                  <div className="text-lg font-extrabold text-white">{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💼</div>
            <p className="text-sm text-slate-600 font-medium">Enter pay details to convert</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
