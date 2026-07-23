import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmtUSD = n => '$' + Math.round(n).toLocaleString('en-US')

const defaultDebts = [
  { name: 'Credit Card 1', balance: '5000', rate: '18', minPayment: '100' },
  { name: 'Credit Card 2', balance: '3000', rate: '22', minPayment: '75' },
]

export default function debt_payoff_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [monthlyPayment, setMonthlyPayment] = useState('1000')
  const [method, setMethod] = useState('avalanche')
  const [debts, setDebts] = useState(defaultDebts)
  const [result, setResult] = useState(null)

  const updateDebt = useCallback((idx, field, val) => {
    setDebts(prev => prev.map((d, i) => i === idx ? { ...d, [field]: val } : d))
  }, [])

  const addDebt = useCallback(() => {
    setDebts(prev => [...prev, { name: '', balance: '', rate: '', minPayment: '' }])
  }, [])

  const removeDebt = useCallback((idx) => {
    setDebts(prev => prev.filter((_, i) => i !== idx))
  }, [])

  const calculate = useCallback(() => {
    const mp = parseFloat(monthlyPayment) || 0
    let debtList = debts
      .map(d => ({ balance: parseFloat(d.balance) || 0, rate: (parseFloat(d.rate) || 0) / 100 / 12, minPayment: parseFloat(d.minPayment) || 0 }))
      .filter(d => d.balance > 0)
    if (debtList.length === 0) return

    if (method === 'avalanche') debtList.sort((a, b) => b.rate - a.rate)
    else debtList.sort((a, b) => a.balance - b.balance)

    let totalInterest = 0, months = 0
    while (debtList.some(d => d.balance > 0) && months < 600) {
      months++
      let extraPayment = mp
      debtList.forEach(debt => {
        if (debt.balance > 0) {
          const interest = debt.balance * debt.rate
          const principal = Math.min(debt.minPayment - interest, debt.balance)
          debt.balance -= principal; totalInterest += interest; extraPayment -= debt.minPayment
        }
      })
      const target = debtList.find(d => d.balance > 0)
      if (target && extraPayment > 0) target.balance -= Math.min(extraPayment, target.balance)
    }

    const totalDebt = debts.reduce((s, d) => s + (parseFloat(d.balance) || 0), 0)
    setResult({ months, totalDebt, totalInterest, totalPaid: totalDebt + totalInterest })
    setTimeout(() => jumpTo(), 50)
  }, [monthlyPayment, method, debts, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Debt Payoff Calculator"
      desc="Calculate how fast you can become debt-free. Compare snowball vs avalanche methods."
      icon="💳" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="debt-payoff-calculator"
      faq={[
        { q: "What is the avalanche method?", a: "The avalanche method pays off debts with the highest interest rate first, saving the most money on interest." },
        { q: "What is the snowball method?", a: "The snowball method pays off the smallest balance first for quick wins and motivation." },
      ]}
      howItWorks={[
        "Enter your total monthly payment for debt repayment.",
        "Add your debts with balance, interest rate, and minimum payment.",
        "Choose avalanche (highest interest first) or snowball (smallest balance first).",
        "View your debt-free timeline and total interest paid.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Debt Payoff Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/debt-payoff-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Total Monthly Payment ($)</label>
              <input type="number" value={monthlyPayment} onChange={e => setMonthlyPayment(e.target.value)}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Payoff Method</label>
              <select value={method} onChange={e => setMethod(e.target.value)} className={inputClass}>
                <option value="avalanche">Avalanche (Highest Interest First)</option>
                <option value="snowball">Snowball (Smallest Balance First)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-300">Your Debts</h3>
              <button onClick={addDebt} className="text-xs text-indigo-400 hover:text-indigo-300 transition-all">+ Add Debt</button>
            </div>
            <div className="space-y-3">
              {debts.map((d, i) => (
                <div key={i} className="p-3 bg-black/20 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="text" value={d.name} onChange={e => updateDebt(i, 'name', e.target.value)}
                      placeholder="Debt name" className={`${inputClass} flex-1`} />
                    {debts.length > 1 && (
                      <button onClick={() => removeDebt(i)} className="text-red-400 hover:text-red-300 text-sm">✕</button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-slate-500">Balance ($)</label>
                      <input type="number" value={d.balance} onChange={e => updateDebt(i, 'balance', e.target.value)}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Rate (%)</label>
                      <input type="number" value={d.rate} onChange={e => updateDebt(i, 'rate', e.target.value)}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Min Payment ($)</label>
                      <input type="number" value={d.minPayment} onChange={e => updateDebt(i, 'minPayment', e.target.value)}
                        className={inputClass} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => { calculate(); jumpTo() }}
            className="w-full mt-4 py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98]">
            Calculate Payoff Plan
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4">Debt-Free Timeline</h3>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-emerald-400">
                {result.months} months ({Math.floor(result.months / 12)}y {result.months % 12}m)
              </div>
              <div className="text-sm text-slate-500 mt-1">Time to become debt-free</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Debt', value: fmtUSD(result.totalDebt), color: 'text-slate-300' },
                { label: 'Total Interest', value: fmtUSD(result.totalInterest), color: 'text-red-400' },
                { label: 'Total Paid', value: fmtUSD(result.totalPaid), color: 'text-emerald-400' },
              ].map(item => (
                <div key={item.label} className="text-center p-3 bg-black/20 rounded-xl">
                  <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💳</div>
            <p className="text-sm text-slate-600 font-medium">Add debts and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
