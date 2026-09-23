import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function group_expense_splitter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()

  const [members, setMembers] = useState(['', ''])
  const [expenses, setExpenses] = useState([])
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    paidBy: 0,
    splitMode: 'equal',
    splitAmong: [],
  })

  const addMember = () => setMembers(p => [...p, ''])
  const updateMember = (i, v) => {
    const m = [...members]
    m[i] = v
    setMembers(m)
  }
  const removeMember = (i) => {
    if (members.length <= 2) return
    setMembers(p => p.filter((_, idx) => idx !== i))
    setExpenses(p => p.map(e => ({
      ...e,
      paidBy: e.paidBy >= members.length - 1 ? 0 : e.paidBy,
      splitAmong: e.splitAmong.filter(s => s !== i).map(s => s > i ? s - 1 : s),
    })))
  }

  const namedMembers = members.filter(m => m.trim())
  const memberIndices = members.map((_, i) => i).filter(i => members[i]?.trim())

  const toggleSplitAmong = (idx) => {
    setNewExpense(p => ({
      ...p,
      splitAmong: p.splitAmong.includes(idx)
        ? p.splitAmong.filter(i => i !== idx)
        : [...p.splitAmong, idx],
    }))
  }

  const addExpense = () => {
    if (!newExpense.description.trim() || !newExpense.amount || Number(newExpense.amount) <= 0) return
    const splitList = newExpense.splitMode === 'select'
      ? newExpense.splitAmong
      : memberIndices
    if (splitList.length === 0) return
    setExpenses(p => [...p, {
      id: Date.now(),
      description: newExpense.description.trim(),
      amount: Number(newExpense.amount),
      paidBy: newExpense.paidBy,
      splitMode: newExpense.splitMode,
      splitAmong: splitList,
    }])
    setNewExpense({ description: '', amount: '', paidBy: newExpense.paidBy, splitMode: 'equal', splitAmong: [] })
  }

  const removeExpense = (id) => setExpenses(p => p.filter(e => e.id !== id))

  const { balances, settlements } = useMemo(() => {
    const bal = {}
    namedMembers.forEach((_, i) => { bal[i] = 0 })

    expenses.forEach(exp => {
      const share = exp.amount / exp.splitAmong.length
      exp.splitAmong.forEach(idx => {
        if (bal[idx] !== undefined) bal[idx] -= share
      })
      if (bal[exp.paidBy] !== undefined) bal[exp.paidBy] += exp.amount
    })

    const debtors = []
    const creditors = []
    Object.entries(bal).forEach(([i, amount]) => {
      const val = Math.round(amount * 100) / 100
      if (val < -0.01) debtors.push({ idx: Number(i), amount: -val })
      else if (val > 0.01) creditors.push({ idx: Number(i), amount: val })
    })

    debtors.sort((a, b) => b.amount - a.amount)
    creditors.sort((a, b) => b.amount - a.amount)

    const settle = []
    let di = 0, ci = 0
    while (di < debtors.length && ci < creditors.length) {
      const d = debtors[di], c = creditors[ci]
      const transfer = Math.min(d.amount, c.amount)
      if (transfer > 0.01) {
        settle.push({ from: d.idx, to: c.idx, amount: Math.round(transfer * 100) / 100 })
      }
      d.amount -= transfer
      c.amount -= transfer
      if (d.amount < 0.01) di++
      if (c.amount < 0.01) ci++
    }

    return { balances: bal, settlements: settle }
  }, [expenses, namedMembers.length])

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)

  const copyResult = () => {
    let text = `GROUP EXPENSE SUMMARY\n${'='.repeat(40)}\n\n`
    text += `Total Expenses: ₹${totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n\n`
    text += `EXPENSES:\n`
    expenses.forEach(e => {
      text += `• ${e.description}: ₹${e.amount.toFixed(2)} (paid by ${members[e.paidBy] || 'Unknown'})\n`
    })
    text += `\nPER-PERSON BALANCES:\n`
    memberIndices.forEach(i => {
      const b = balances[i] || 0
      text += `${members[i]}: ${b >= 0 ? '+' : ''}₹${b.toFixed(2)}\n`
    })
    if (settlements.length) {
      text += `\nSETTLE-UP PLAN:\n`
      settlements.forEach(s => {
        text += `${members[s.from]} pays ₹${s.amount.toFixed(2)} to ${members[s.to]}\n`
      })
    }
    navigator.clipboard.writeText(text)
  }

  const inputCls = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white font-medium outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const labelCls = "block text-sm font-semibold text-slate-300 mb-1.5"

  return (
    <ToolLayout
      title="Group Expense Splitter"
      desc="Group Expense Splitter - split bills and expenses with friends, roommates, or travel groups online free. Free online, no sign-up. Works on any device."
      icon="💰" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="group-expense-splitter"
      faq={[
        { q: 'What is a Group Expense Splitter?', a: 'A tool that helps groups track shared expenses and calculates who owes whom, making bill splitting simple and fair.' },
        { q: 'How does settle-up work?', a: 'The settle-up algorithm minimizes the number of transactions needed to settle all balances. It calculates who should pay whom and how much.' },
        { q: "How do I use this Group Expense Splitter online free?", a: "Add group members, enter expenses with who paid, and choose how to split. See per-person balances and a settle-up plan instantly. Free with no sign-up." },
        { q: "How do I save my result?", a: "Click the copy button to save the summary to your clipboard. Free with no sign-up." },
        { q: "Can I use it more than once?", a: "Yes, unlimited free use. Track as many groups and expenses as you need, on any device." },
        { q: "Is this Group Expense Splitter free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        'Add the names of all group members.',
        'Enter each expense: description, amount, who paid, and how to split it.',
        'Choose split mode: equal among all, or select specific members.',
        'View per-person balances and the optimal settle-up plan.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Group Expense Splitter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/group-expense-splitter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Members */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4">Group Members</h3>
          <div className="space-y-2">
            {members.map((m, i) => (
              <div key={i} className="flex gap-2">
                <input value={m} onChange={e => updateMember(i, e.target.value)}
                  placeholder={`Member ${i + 1} name`}
                  className={inputCls + " flex-1"} />
                {members.length > 2 && (
                  <button onClick={() => removeMember(i)} className="px-3 text-red-400 hover:text-red-300 font-bold transition-colors">✕</button>
                )}
              </div>
            ))}
            <button onClick={addMember} className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors">+ Add Member</button>
          </div>
        </div>

        {/* Add Expense */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4">Add Expense</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Description</label>
              <input value={newExpense.description} onChange={e => setNewExpense(p => ({ ...p, description: e.target.value }))}
                placeholder="e.g. Dinner, Taxi, Hotel" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Amount (₹)</label>
              <input type="number" value={newExpense.amount} onChange={e => setNewExpense(p => ({ ...p, amount: e.target.value }))}
                placeholder="0.00" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Paid By</label>
              <select value={newExpense.paidBy} onChange={e => setNewExpense(p => ({ ...p, paidBy: Number(e.target.value) }))}
                className={inputCls + " appearance-none"}>
                {memberIndices.map(i => <option key={i} value={i}>{members[i]}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            <label className={labelCls}>Split Mode</label>
            <div className="flex gap-3">
              {['equal', 'select'].map(mode => (
                <button key={mode} onClick={() => setNewExpense(p => ({ ...p, splitMode: mode, splitAmong: mode === 'equal' ? [] : p.splitAmong }))}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${newExpense.splitMode === mode ? 'bg-amber-500/30 text-amber-300' : 'bg-white/[0.06] text-slate-400 hover:bg-white/[0.1]'}`}>
                  {mode === 'equal' ? 'Equal Split' : 'Select Members'}
                </button>
              ))}
            </div>
            {newExpense.splitMode === 'select' && (
              <div className="flex flex-wrap gap-2">
                {memberIndices.map(i => (
                  <button key={i} onClick={() => toggleSplitAmong(i)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${newExpense.splitAmong.includes(i) ? 'bg-amber-500/30 text-amber-300' : 'bg-white/[0.06] text-slate-400 hover:bg-white/[0.1]'}`}>
                    {members[i]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={addExpense}
            className="w-full py-3 text-sm font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl transition-all">
            Add Expense
          </button>
        </div>

        {/* Expense List */}
        {expenses.length > 0 && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4">Expenses ({expenses.length}) — Total: ₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {expenses.map(exp => (
                <div key={exp.id} className="flex items-center justify-between bg-black/20 rounded-xl px-4 py-3 border border-white/[0.05]">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-white font-semibold truncate block">{exp.description}</span>
                    <span className="text-xs text-slate-400">Paid by {members[exp.paidBy]} • Split {exp.splitMode === 'equal' ? 'equally' : `among ${exp.splitAmong.length}`}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-amber-300">₹{exp.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    <button onClick={() => removeExpense(exp.id)} className="text-red-400 hover:text-red-300 text-xs font-bold transition-colors">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {expenses.length > 0 && (
          <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Balances & Settle-Up</h3>
              </div>
              <button onClick={copyResult} className="px-4 py-2 text-xs font-bold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-xl transition-all">Copy Summary</button>
            </div>

            {/* Balances */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {memberIndices.map(i => {
                const b = balances[i] || 0
                return (
                  <div key={i} className="p-3 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                    <div className="text-xs text-slate-400 font-medium mb-1">{members[i]}</div>
                    <div className={`text-lg font-extrabold ${b > 0.01 ? 'text-emerald-400' : b < -0.01 ? 'text-red-400' : 'text-slate-500'}`}>
                      {b >= 0 ? '+' : ''}₹{Math.abs(b).toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{b > 0.01 ? 'gets back' : b < -0.01 ? 'owes' : 'settled'}</div>
                  </div>
                )
              })}
            </div>

            {/* Settle Up */}
            {settlements.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Settle-Up Plan</h4>
                <div className="space-y-2">
                  {settlements.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-black/20 rounded-xl px-4 py-3 border border-white/[0.05]">
                      <span className="text-sm font-semibold text-red-300">{members[s.from]}</span>
                      <span className="text-xs text-slate-500">→ pays</span>
                      <span className="text-sm font-bold text-emerald-300">₹{s.amount.toFixed(2)}</span>
                      <span className="text-xs text-slate-500">→ to</span>
                      <span className="text-sm font-semibold text-emerald-300">{members[s.to]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {expenses.length === 0 && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💰</div>
            <p className="text-sm text-slate-600 font-medium">Add members and expenses to see the split</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
