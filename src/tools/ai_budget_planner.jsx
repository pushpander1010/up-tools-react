import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import useAIStream from '../hooks/useAIStream'

export default function ai_budget_planner() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const { output, status, streaming, generate, stop } = useAIStream()
  const [copied, setCopied] = useState(false)

  const [currency, setCurrency] = useState('INR (₹)')
  const [goal, setGoal] = useState('save more money')
  const [salary, setSalary] = useState('')
  const [otherIncome, setOtherIncome] = useState('')
  const [rent, setRent] = useState('')
  const [food, setFood] = useState('')
  const [transport, setTransport] = useState('')
  const [utilities, setUtilities] = useState('')
  const [entertainment, setEntertainment] = useState('')
  const [health, setHealth] = useState('')
  const [emi, setEmi] = useState('')
  const [savingsCurrent, setSavingsCurrent] = useState('')
  const [otherExp, setOtherExp] = useState('')
  const [context, setContext] = useState('')

  const handleGenerate = useCallback(() => {
    if (!salary.trim()) return

    const prompt = `Create a personalized monthly budget plan.

Currency: ${currency}
Primary Goal: ${goal}

Monthly Income:
- Salary/Primary: ${salary || '0'}
- Other Income: ${otherIncome || '0'}

Monthly Expenses:
- Rent/Housing: ${rent || '0'}
- Food & Groceries: ${food || '0'}
- Transport/Fuel: ${transport || '0'}
- Utilities: ${utilities || '0'}
- Entertainment: ${entertainment || '0'}
- Health & Medical: ${health || '0'}
- EMI/Loan Payments: ${emi || '0'}
- Current Savings/Investments: ${savingsCurrent || '0'}
- Other Expenses: ${otherExp || '0'}

${context ? 'Additional context: ' + context : ''}

Provide:
1. Total income vs expenses summary
2. Recommended budget breakdown (50/30/20 rule or customized)
3. Savings strategy aligned with the goal
4. 3–5 actionable tips to improve finances
5. A month-by-month action plan if applicable

Use clear formatting with headings and bullet points.`

    generate({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      systemPrompt: 'You are a certified financial planner and budgeting expert. Provide clear, actionable budget advice.',
    })
    jumpTo()
  }, [salary, otherIncome, rent, food, transport, utilities, entertainment, health, emi, savingsCurrent, otherExp, currency, goal, context, generate, jumpTo])

  const copy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }

  const download = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'budget-plan.txt'
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"
  const selectClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"
  const numInput = (v, set) => <input type="number" min="0" value={v} onChange={e => set(e.target.value)} placeholder="0" className={inputClass} />

  return (
    <ToolLayout
      title="AI Budget Planner"
      desc="Get a personalized monthly budget with AI. Enter income and expenses for a spending breakdown, savings tips and financial advice."
      icon="💰" iconBg="rgba(245,158,11,0.08)"
      category="ai" slug="ai-budget-planner"
      faq={[
        { q: "Is this financial advice?", a: "No. This tool provides general financial guidance for educational purposes only. Consult a certified financial advisor." },
        { q: "What currencies are supported?", a: "INR, USD, CAD, GBP, EUR, and AUD." },
      ]}
      howItWorks={[
        "Enter your monthly income and expenses.",
        "Select your currency and financial goal.",
        "Click Analyze to get a personalized budget plan.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI Budget Planner", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/ai-budget-planner/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-4">
          {/* Top row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} className={selectClass}>
                <option>INR (₹)</option><option>USD ($)</option><option>CAD ($)</option>
                <option>GBP (£)</option><option>EUR (€)</option><option>AUD ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Financial Goal</label>
              <select value={goal} onChange={e => setGoal(e.target.value)} className={selectClass}>
                <option value="save more money">Save more money</option>
                <option value="pay off debt">Pay off debt</option>
                <option value="build an emergency fund">Build emergency fund</option>
                <option value="invest for retirement">Invest for retirement</option>
                <option value="save for a big purchase">Save for a big purchase</option>
                <option value="achieve financial independence">Financial independence</option>
              </select>
            </div>
          </div>

          {/* Income */}
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">💵 Monthly Income</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="block text-sm font-semibold text-slate-300 mb-1">Salary / Primary Income *</label>{numInput(salary, setSalary)}</div>
            <div><label className="block text-sm font-semibold text-slate-300 mb-1">Other Income</label>{numInput(otherIncome, setOtherIncome)}</div>
          </div>

          {/* Expenses */}
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">💸 Monthly Expenses</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div><label className="block text-xs text-slate-400 mb-1">Rent/Housing</label>{numInput(rent, setRent)}</div>
            <div><label className="block text-xs text-slate-400 mb-1">Food & Groceries</label>{numInput(food, setFood)}</div>
            <div><label className="block text-xs text-slate-400 mb-1">Transport</label>{numInput(transport, setTransport)}</div>
            <div><label className="block text-xs text-slate-400 mb-1">Utilities</label>{numInput(utilities, setUtilities)}</div>
            <div><label className="block text-xs text-slate-400 mb-1">Entertainment</label>{numInput(entertainment, setEntertainment)}</div>
            <div><label className="block text-xs text-slate-400 mb-1">Health</label>{numInput(health, setHealth)}</div>
            <div><label className="block text-xs text-slate-400 mb-1">EMI/Loans</label>{numInput(emi, setEmi)}</div>
            <div><label className="block text-xs text-slate-400 mb-1">Current Savings</label>{numInput(savingsCurrent, setSavingsCurrent)}</div>
            <div><label className="block text-xs text-slate-400 mb-1">Other Expenses</label>{numInput(otherExp, setOtherExp)}</div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Additional Context (optional)</label>
            <textarea value={context} onChange={e => setContext(e.target.value)} rows={3}
              placeholder="e.g. I have 2 kids, planning to buy a house in 3 years"
              className={inputClass + ' resize-none'} />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {streaming ? (
            <button onClick={stop} className="flex-1 px-6 py-3 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all">⏹ Stop</button>
          ) : (
            <button onClick={handleGenerate} disabled={!salary.trim()}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>✨ Analyze & Plan Budget</button>
          )}
          <button onClick={copy} disabled={!output} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all disabled:opacity-40 ${copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'}`}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
          <button onClick={download} disabled={!output} className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all disabled:opacity-40">⬇ Download</button>
        </div>

        {status && (
          <div className={`p-3 rounded-xl text-sm ${status.includes('Error') ? 'bg-red-500/10 border border-red-500/20 text-red-400' : status.includes('Done') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400'}`}>{status}</div>
        )}

        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          {output ? (
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-3 opacity-20">💰</div>
              <p className="text-sm text-slate-600 font-medium">Enter your income and click Analyze</p>
            </div>
          )}
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
          ⚠️ This tool provides general financial guidance for educational purposes only. Consult a certified financial advisor for personalized investment decisions.
        </div>
      </div>
    </ToolLayout>
  )
}
