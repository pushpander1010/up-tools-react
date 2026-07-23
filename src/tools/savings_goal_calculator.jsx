import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = n => '$' + Math.round(n).toLocaleString('en-US')

export default function savings_goal_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [mode, setMode] = useState('time')
  const [goalAmount, setGoalAmount] = useState('20000')
  const [currentSavings, setCurrentSavings] = useState('5000')
  const [monthlyContribution, setMonthlyContribution] = useState('500')
  const [monthsToGoal, setMonthsToGoal] = useState('24')
  const [interestRate, setInterestRate] = useState('4')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const goal = parseFloat(goalAmount) || 0
    const current = parseFloat(currentSavings) || 0
    const rate = (parseFloat(interestRate) || 0) / 100 / 12

    if (mode === 'time') {
      const monthly = parseFloat(monthlyContribution) || 0
      let balance = current
      let months = 0
      let totalContributions = current

      while (balance < goal && months < 600) {
        months++
        balance = balance * (1 + rate) + monthly
        totalContributions += monthly
      }

      const interestEarned = Math.max(0, goal - totalContributions)
      setResult({
        title: 'Time to Reach Goal',
        value: months >= 600 ? '600+ months' : `${months} months`,
        subtitle: months >= 600 ? 'Goal may not be reachable with current inputs' : `${Math.floor(months / 12)} years ${months % 12} months`,
        goal: fmt(goal),
        contributions: fmt(totalContributions),
        interest: fmt(interestEarned)
      })
    } else {
      const months = parseInt(monthsToGoal) || 24
      const futureValue = goal
      const presentValue = current
      const monthlyPayment = rate > 0
        ? (futureValue - presentValue * Math.pow(1 + rate, months)) / ((Math.pow(1 + rate, months) - 1) / rate)
        : (futureValue - presentValue) / months

      const totalContributions = current + monthlyPayment * months
      const interestEarned = Math.max(0, goal - totalContributions)
      setResult({
        title: 'Monthly Savings Needed',
        value: fmt(Math.max(0, monthlyPayment)),
        subtitle: `per month for ${months} months`,
        goal: fmt(goal),
        contributions: fmt(totalContributions),
        interest: fmt(interestEarned)
      })
    }
    jumpTo()
  }, [mode, goalAmount, currentSavings, monthlyContribution, monthsToGoal, interestRate, jumpTo])

  return (
    <ToolLayout
      title="Savings Goal Calculator"
      desc="Calculate how long it takes to reach your savings goal or how much to save monthly."
      icon="💰" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="savings-goal-calculator"
      faq={[
        { q: 'How much should I save each month?', a: 'A common rule is the 50/30/20 budget: 50% for needs, 30% for wants, and 20% for savings.' },
        { q: 'What is a realistic savings goal?', a: 'Start with an emergency fund of 3-6 months of expenses. Then set goals for specific purchases.' },
        { q: 'How can I reach my savings goal faster?', a: 'Increase monthly contributions, find a higher-yield savings account, automate savings, or reduce expenses.' }
      ]}
      howItWorks={[
        'Enter your savings goal amount and current savings.',
        'Choose a mode: calculate time to goal, or calculate monthly payment needed.',
        'Enter the interest rate and click Calculate.'
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Savings Goal Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/savings-goal-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Mode Tabs */}
        <div className="flex gap-2">
          {[['time', '⏱️ Calculate Time'], ['payment', '💳 Calculate Payment']].map(([key, label]) => (
            <button key={key} onClick={() => { setMode(key); setResult(null) }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                mode === key
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-white/[0.06] border-white/8 text-slate-500 hover:border-white/15'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 font-medium mb-1 block">Savings Goal ($)</label>
            <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} min="0" step="1000"
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3 text-white text-sm outline-none focus:border-amber-500/40 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-500 font-medium mb-1 block">Current Savings ($)</label>
            <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} min="0" step="100"
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3 text-white text-sm outline-none focus:border-amber-500/40 transition-all" />
          </div>
          {mode === 'time' ? (
            <div>
              <label className="text-xs text-slate-500 font-medium mb-1 block">Monthly Contribution ($)</label>
              <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} min="0" step="50"
                className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3 text-white text-sm outline-none focus:border-amber-500/40 transition-all" />
            </div>
          ) : (
            <div>
              <label className="text-xs text-slate-500 font-medium mb-1 block">Months to Reach Goal</label>
              <input type="number" value={monthsToGoal} onChange={(e) => setMonthsToGoal(e.target.value)} min="1" max="600"
                className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3 text-white text-sm outline-none focus:border-amber-500/40 transition-all" />
            </div>
          )}
          <div>
            <label className="text-xs text-slate-500 font-medium mb-1 block">Annual Interest Rate (%)</label>
            <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} min="0" max="20" step="0.1"
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3 text-white text-sm outline-none focus:border-amber-500/40 transition-all" />
          </div>
        </div>

        <button onClick={calculate}
          className="w-full py-4 rounded-2xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">{result.title}</h3>
            </div>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-white">{result.value}</p>
              <p className="text-sm text-slate-400 mt-1">{result.subtitle}</p>
            </div>
            <div className="space-y-2">
              {[
                ['Goal Amount', result.goal],
                ['Total Contributions', result.contributions],
                ['Interest Earned', result.interest]
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="text-sm text-slate-400">{label}</span>
                  <span className="text-sm text-white font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💰</div>
            <p className="text-sm text-slate-600 font-medium">Enter values and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
