import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function tool_401k_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [age, setAge] = useState('30')
  const [retireAge, setRetireAge] = useState('65')
  const [salary, setSalary] = useState('75000')
  const [contribution, setContribution] = useState('6')
  const [employerMatch, setEmployerMatch] = useState('50')
  const [matchLimit, setMatchLimit] = useState('6')
  const [currentBalance, setCurrentBalance] = useState('25000')
  const [returnRate, setReturnRate] = useState('7')
  const [salaryIncrease, setSalaryIncrease] = useState('3')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const a = parseInt(age) || 30
    const ra = parseInt(retireAge) || 65
    const s = parseFloat(salary) || 75000
    const cp = parseFloat(contribution) || 6
    const emp = parseFloat(employerMatch) || 50
    const ml = parseFloat(matchLimit) || 6
    const cb = parseFloat(currentBalance) || 0
    const rr = parseFloat(returnRate) || 7
    const si = parseFloat(salaryIncrease) || 3

    const years = Math.max(0, ra - a)
    let balance = cb
    let totalYourContrib = 0
    let totalEmployerContrib = 0
    let currentSalary = s

    for (let i = 0; i < years; i++) {
      const yourContrib = currentSalary * (cp / 100)
      const matchableAmount = Math.min(yourContrib, currentSalary * (ml / 100))
      const employerContrib = matchableAmount * (emp / 100)
      totalYourContrib += yourContrib
      totalEmployerContrib += employerContrib
      balance += yourContrib + employerContrib
      balance *= (1 + rr / 100)
      currentSalary *= (1 + si / 100)
    }

    const growth = balance - cb - totalYourContrib - totalEmployerContrib
    const missMatch = cp < ml
    const missedPct = missMatch ? ((ml - cp) * (emp / 100)).toFixed(1) : 0

    setResult({ years, yourContrib: totalYourContrib, employerContrib: totalEmployerContrib, growth, total: balance, missMatch, missedPct, matchLimit: ml })
  }, [age, retireAge, salary, contribution, employerMatch, matchLimit, currentBalance, returnRate, salaryIncrease])

  const fmt = n => '$' + Math.round(n).toLocaleString('en-US')
  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"

  return (
    <ToolLayout
      title="401k Calculator"
      desc="Calculate your 401k retirement savings with employer match, tax benefits, and investment growth projections."
      icon="💰" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="401k-calculator"
      faq={[
        { q: 'How much should I contribute?', a: 'At least enough to get your full employer match (typically 3-6% of salary). Ideally aim for 10-15%.' },
        { q: 'What is employer 401k matching?', a: 'Employer matching is when your company contributes money to your 401k based on your contributions — essentially free money.' },
      ]}
      howItWorks={[
        'Enter your current age, retirement age, salary, and contribution details.',
        'Set the employer match percentage and expected return rate.',
        'Click Calculate to see your projected retirement savings.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "401k Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/401k-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              ['Current Age', age, setAge],
              ['Retirement Age', retireAge, setRetireAge],
              ['Annual Salary ($)', salary, setSalary],
              ['Your Contribution (%)', contribution, setContribution],
              ['Employer Match (%)', employerMatch, setEmployerMatch],
              ['Match Limit (% of salary)', matchLimit, setMatchLimit],
              ['Current 401k Balance ($)', currentBalance, setCurrentBalance],
              ['Expected Return (%)', returnRate, setReturnRate],
              ['Annual Salary Increase (%)', salaryIncrease, setSalaryIncrease],
            ].map(([label, val, set]) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>
                <input type="number" step="0.5" value={val} onChange={e => set(e.target.value)} className={inputClass} />
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => { calculate(); jumpTo() }}
          className="glow-btn w-full py-4 rounded-2xl text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          💰 Calculate 401k Savings
        </button>

        {result && (
          <div ref={resultRef} className="space-y-3" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            {[
              ['Years Until Retirement', result.years.toString(), ''],
              ['Your Total Contributions', fmt(result.yourContrib), ''],
              ['Employer Match Contributions', fmt(result.employerContrib), ''],
              ['Investment Growth', fmt(result.growth), 'text-emerald-400'],
              ['Total Balance at Retirement', fmt(result.total), 'text-xl font-extrabold text-indigo-400 border-indigo-500/30 bg-indigo-500/[0.08]'],
            ].map(([label, val, cls]) => (
              <div key={label} className={`flex justify-between items-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] ${cls.includes('border') ? cls : ''}`}>
                <span className="text-sm text-slate-400">{label}</span>
                <span className={`text-sm font-bold font-mono ${cls.includes('text-') ? cls : 'text-white'}`}>{val}</span>
              </div>
            ))}

            {result.missMatch && (
              <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/20">
                <div className="text-sm font-bold text-amber-400">💡 Tip: You're leaving free money on the table!</div>
                <div className="text-sm text-slate-300 mt-1">
                  Increase your contribution to {result.matchLimit}% to get the full employer match.
                  You're missing out on {result.missedPct}% of your salary.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
