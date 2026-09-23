import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function freelance_rate_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [targetIncome, setTargetIncome] = useState(120000)
  const [hoursPerWeek, setHoursPerWeek] = useState(30)
  const [weeklyExpenses, setWeeklyExpenses] = useState(5000)
  const [vacationWeeks, setVacationWeeks] = useState(4)

  const result = useMemo(() => {
    if (!targetIncome || hoursPerWeek < 1) return null
    const workWeeks = 52 - vacationWeeks
    const annualExpenses = weeklyExpenses * workWeeks
    const totalNeeded = targetIncome + annualExpenses
    const hourlyRate = Math.ceil(totalNeeded / (hoursPerWeek * workWeeks))
    const dailyRate = hourlyRate * 8
    const weeklyRate = hourlyRate * hoursPerWeek
    const monthlyRate = hourlyRate * hoursPerWeek * (workWeeks / 12)
    const projectRate = hourlyRate * 40

    return {
      hourlyRate,
      dailyRate,
      weeklyRate: Math.round(weeklyRate),
      monthlyRate: Math.round(monthlyRate),
      projectRate,
      workWeeks,
      annualExpenses,
      totalNeeded,
    }
  }, [targetIncome, hoursPerWeek, weeklyExpenses, vacationWeeks])

  return (
    <ToolLayout
      title="Freelance Rate Calculator"
      desc="Freelance Rate Calculator – compute hourly, daily and per-project rates based on target income and expenses. Free online, no sign-up. Works on any device."
      icon="💼" iconBg="rgba(99,102,241,0.08)"
      category="finance" slug="freelance-rate-calculator"
      faq={[
        { q: 'How do I calculate my freelance rate?', a: 'Enter your target annual income, weekly working hours, weekly business expenses, and vacation weeks. The tool computes your hourly, daily, and per-project rates.' },
        { q: 'Why include business expenses?', a: 'Freelancers must cover their own insurance, software, equipment, and taxes. Including expenses ensures your rate is sustainable.' },
        { q: 'What is a reasonable number of billable hours?', a: 'Most freelancers bill 25–35 hours per week. The rest goes to admin, marketing, and learning.' },
        { q: 'Can I adjust vacation weeks?', a: 'Yes. Account for unpaid vacation, sick days, and holidays to get an accurate rate.' },
        { q: 'Is the per-project rate a fixed estimate?', a: 'The per-project rate is based on 40 hours. Adjust it based on your project complexity and scope.' },
        { q: 'Is this calculator free?', a: 'Yes, completely free with no sign-up. Use it unlimited times online on any device.' },
      ]}
      howItWorks={[
        'Enter your desired annual income, weekly billable hours, weekly expenses, and vacation weeks.',
        'The tool calculates your hourly, daily, weekly, and monthly rates plus a standard per-project estimate.',
        'The calculation factors in your working weeks and expenses to give a sustainable rate.',
        'Use the output to set pricing for clients, proposals, and invoices.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Freelance Rate Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/freelance-rate-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Inputs */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Target Annual Income (₹)</label>
          <input type="number" value={targetIncome} onChange={e => setTargetIncome(Number(e.target.value))} min={0}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 [color-scheme:dark]" />

          <label className="block text-sm font-semibold text-slate-300 mb-2 mt-4">Billable Hours per Week</label>
          <input type="number" value={hoursPerWeek} onChange={e => setHoursPerWeek(Number(e.target.value))} min={1} max={80}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 [color-scheme:dark]" />

          <label className="block text-sm font-semibold text-slate-300 mb-2 mt-4">Weekly Expenses (₹)</label>
          <input type="number" value={weeklyExpenses} onChange={e => setWeeklyExpenses(Number(e.target.value))} min={0}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 [color-scheme:dark]" />

          <label className="block text-sm font-semibold text-slate-300 mb-2 mt-4">Vacation Weeks per Year</label>
          <input type="number" value={vacationWeeks} onChange={e => setVacationWeeks(Number(e.target.value))} min={0} max={20}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 [color-scheme:dark]" />
        </div>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Your Freelance Rates</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
              {[
                ['Hourly Rate', `₹${result.hourlyRate.toLocaleString()}`, 'text-indigo-400'],
                ['Daily Rate', `₹${result.dailyRate.toLocaleString()}`, 'text-emerald-400'],
                ['Weekly Rate', `₹${result.weeklyRate.toLocaleString()}`, 'text-amber-400'],
                ['Monthly Rate', `₹${result.monthlyRate.toLocaleString()}`, 'text-cyan-400'],
                ['Per Project (40h)', `₹${result.projectRate.toLocaleString()}`, 'text-purple-400'],
                ['Working Weeks', result.workWeeks, 'text-pink-400'],
              ].map(([label, val, color]) => (
                <div key={label} className="p-2.5 sm:p-3 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                  <div className={`text-xl sm:text-2xl font-extrabold ${color}`}>{typeof val === 'number' ? val.toLocaleString() : val}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 text-sm text-slate-400 space-y-1">
              <p><span className="text-white font-semibold">Total annual need:</span> ₹{result.totalNeeded.toLocaleString()} (income ₹{targetIncome.toLocaleString()} + expenses ₹{result.annualExpenses.toLocaleString()})</p>
              <p><span className="text-white font-semibold">Billable hours/year:</span> {hoursPerWeek * result.workWeeks} hrs</p>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💼</div>
            <p className="text-sm text-slate-600 font-medium">Enter your target income and details to calculate rates</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
