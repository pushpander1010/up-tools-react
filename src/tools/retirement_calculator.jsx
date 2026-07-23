import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
const fmt = (n) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })

export default function retirement_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [age, setAge] = useState(35)
  const [savings, setSavings] = useState(150000)
  const [monthly, setMonthly] = useState(1500)
  const [income, setIncome] = useState(60000)
  const [returnRate, setReturnRate] = useState(7)
  const [inflation, setInflation] = useState(3)
  const [social, setSocial] = useState(20000)
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const a = parseInt(age) || 35
    const s = parseFloat(savings) || 0
    const m = parseFloat(monthly) || 0
    const inc = parseFloat(income) || 60000
    const r = parseFloat(returnRate) || 7
    const inf = parseFloat(inflation) || 3
    const soc = parseFloat(social) || 0
    const neededIncome = inc - soc
    const needed = neededIncome * 25
    let balance = s
    let yrs = 0
    const monthlyReturn = r / 100 / 12
    while (balance < needed && yrs < 600) {
      balance += m
      balance *= (1 + monthlyReturn)
      yrs++
    }
    const years = Math.ceil(yrs / 12)
    const retireAge = a + years
    const monthlyIncome = (balance * 0.04 / 12) + soc / 12
    setResult({ retireAge, years, needed, projected: balance, monthlyIncome })
  }, [age, savings, monthly, income, returnRate, inflation, social])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  const fields = [
    { label: 'Current Age', value: age, set: setAge, step: 1 },
    { label: 'Current Savings ($)', value: savings, set: setSavings, step: 10000 },
    { label: 'Monthly Contribution ($)', value: monthly, set: setMonthly, step: 100 },
    { label: 'Desired Annual Retirement Income ($)', value: income, set: setIncome, step: 5000 },
    { label: 'Expected Annual Return (%)', value: returnRate, set: setReturnRate, step: 0.5 },
    { label: 'Inflation Rate (%)', value: inflation, set: setInflation, step: 0.5 },
    { label: 'Annual Social Security ($)', value: social, set: setSocial, step: 1000 },
  ]

  return (
    <ToolLayout
      title="Retirement Calculator"
      desc="Calculate when you can retire based on your savings, income needs, and investment returns."
      icon="🏖️" iconBg="rgba(14,165,233,0.08)"
      category="finance" slug="retirement-calculator"
      faq={[
        { q: "How much do I need to retire?", a: "A common rule is the 4% rule: multiply your annual expenses by 25. If you need $50,000/year, you need $1.25 million saved." },
        { q: "What is the 4% rule?", a: "The 4% rule suggests you can withdraw 4% of your retirement savings annually without running out of money for 30 years." },
      ]}
      howItWorks={[
        "Enter your current age, savings, and monthly contribution.",
        "Set your desired retirement income and expected return rate.",
        "Click Calculate to see when you can retire and projected savings.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Retirement Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/retirement-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {fields.map((f, i) => (
            <div key={i}>
              <label className="block text-sm font-semibold text-slate-300 mb-2">{f.label}</label>
              <input type="number" value={f.value} onChange={e => f.set(e.target.value)} step={f.step} className={inputClass} />
            </div>
          ))}
        </div>

        <button onClick={() => { calculate(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate Retirement
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Retirement Results</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'You Can Retire At Age', value: result.retireAge, color: 'text-3xl font-extrabold text-indigo-300' },
                { label: 'Years Until Retirement', value: result.years, color: 'text-lg font-bold text-white' },
                { label: 'Retirement Savings Needed', value: fmt(result.needed), color: 'text-lg font-bold text-white' },
                { label: 'Projected Savings at Retirement', value: fmt(result.projected), color: 'text-lg font-bold text-emerald-400' },
                { label: 'Monthly Income in Retirement', value: fmt(result.monthlyIncome), color: 'text-lg font-bold text-amber-400' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={r.color}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏖️</div>
            <p className="text-sm text-slate-600 font-medium">Enter your details and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
