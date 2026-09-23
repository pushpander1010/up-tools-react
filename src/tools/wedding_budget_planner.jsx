import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const DEFAULT_CATEGORIES = [
  { name: 'Venue & Catering', planned: 300000 },
  { name: 'Photography & Videography', planned: 80000 },
  { name: 'Decoration & Florals', planned: 100000 },
  { name: 'Bride & Groom Attire', planned: 120000 },
  { name: 'Music & Entertainment', planned: 60000 },
  { name: 'Invitations & Stationery', planned: 25000 },
  { name: 'Transport & Logistics', planned: 30000 },
  { name: 'Gifts & Favors', planned: 25000 },
  { name: 'Makeup & Grooming', planned: 40000 },
  { name: 'Miscellaneous', planned: 20000 },
]

export default function wedding_budget_planner() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [totalBudget, setTotalBudget] = useState(800000)
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)

  const updatePlanned = useCallback((idx, val) => {
    setCategories(prev => prev.map((c, i) => i === idx ? { ...c, planned: Number(val) || 0 } : c))
  }, [])

  const updateActual = useCallback((idx, val) => {
    setCategories(prev => prev.map((c, i) => i === idx ? { ...c, actual: Number(val) || 0 } : c))
  }, [])

  const totalPlanned = categories.reduce((s, c) => s + c.planned, 0)
  const totalActual = categories.reduce((s, c) => s + (c.actual || 0), 0)
  const budgetRemaining = totalBudget - totalActual
  const budgetUsedPct = totalBudget > 0 ? Math.min(100, (totalActual / totalBudget) * 100) : 0

  return (
    <ToolLayout
      title="Wedding Budget Planner"
      desc="Wedding Budget Planner - plan and track your wedding expenses by category with planned vs actual comparison online free. Free online, no sign-up. Works on any device."
      icon="💒" iconBg="rgba(236,72,153,0.08)"
      category="finance" slug="wedding-budget-planner"
      faq={[
        { q: 'What is a Wedding Budget Planner?', a: 'A tool that helps you plan, allocate, and track your wedding expenses across categories with planned vs actual comparisons and visual progress bars.' },
        { q: 'How to use this tool?', a: 'Set your total wedding budget, adjust planned amounts for each category, enter actual spending, and see real-time budget tracking with progress indicators.' },
        { q: 'Can I add custom categories?', a: 'Yes, you can edit the category names inline to customize them for your specific wedding needs.' },
        { q: 'Is this tool free?', a: 'Yes, completely free with no sign-up. Use it unlimited times online on any device.' },
        { q: 'Does it calculate remaining budget?', a: 'Yes, the tool shows total planned, total actual spent, remaining budget, and overall budget utilization percentage.' },
        { q: 'Can I use this for other events?', a: 'Absolutely. While designed for weddings, the category-based budget tracking works for any event like birthdays, anniversaries, or corporate functions.' },
      ]}
      howItWorks={[
        'Set your total wedding budget amount at the top.',
        'Review and adjust planned amounts for each expense category.',
        'Enter actual spending as you incur costs to track real-time usage.',
        'Monitor progress bars and remaining budget to stay on track.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Wedding Budget Planner", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/wedding-budget-planner/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Total Budget */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Total Wedding Budget (₹)</label>
          <input type="number" value={totalBudget} onChange={e => setTotalBudget(Number(e.target.value) || 0)}
            className="w-full sm:w-72 bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-pink-500/40 transition-all [color-scheme:dark]" />
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold">
            <span className="text-pink-400">Planned: ₹{totalPlanned.toLocaleString('en-IN')}</span>
            <span className="text-emerald-400">Actual: ₹{totalActual.toLocaleString('en-IN')}</span>
            <span className={budgetRemaining >= 0 ? 'text-slate-300' : 'text-red-400'}>
              Remaining: ₹{budgetRemaining.toLocaleString('en-IN')}
            </span>
          </div>
          {/* Overall Progress Bar */}
          <div className="mt-3 h-3 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${budgetUsedPct}%`,
                background: budgetUsedPct > 90 ? '#ef4444' : budgetUsedPct > 70 ? '#f59e0b' : '#ec4899'
              }} />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{budgetUsedPct.toFixed(1)}% of budget used</p>
        </div>

        {/* Categories Table */}
        {totalPlanned > 0 ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-pink-500/15 bg-gradient-to-br from-pink-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider">Category Breakdown</h3>
            </div>
            <div className="space-y-4">
              {categories.map((cat, idx) => {
                const pct = cat.planned > 0 ? ((cat.actual || 0) / cat.planned) * 100 : 0
                const overBudget = (cat.actual || 0) > cat.planned
                return (
                  <div key={idx} className="bg-black/20 border border-white/[0.05] rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input value={cat.name} onChange={e => {
                        setCategories(prev => prev.map((c, i) => i === idx ? { ...c, name: e.target.value } : c))
                      }}
                        className="flex-1 min-w-0 bg-transparent border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm font-semibold outline-none focus:border-pink-500/40 transition-all [color-scheme:dark]" />
                      <div className="flex gap-2 items-center">
                        <div>
                          <label className="block text-[9px] text-slate-500 uppercase font-bold mb-0.5">Planned ₹</label>
                          <input type="number" value={cat.planned} onChange={e => updatePlanned(idx, e.target.value)}
                            className="w-28 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 text-white text-xs font-medium outline-none focus:border-pink-500/40 [color-scheme:dark]" />
                        </div>
                        <div>
                          <label className="block text-[9px] text-slate-500 uppercase font-bold mb-0.5">Actual ₹</label>
                          <input type="number" value={cat.actual || ''} onChange={e => updateActual(idx, e.target.value)}
                            placeholder="0"
                            className="w-28 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 text-white text-xs font-medium outline-none focus:border-pink-500/40 placeholder:text-slate-600 [color-scheme:dark]" />
                        </div>
                        <span className={`text-xs font-bold self-end mb-1 ${overBudget ? 'text-red-400' : 'text-slate-400'}`}>
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-2 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, pct)}%`,
                          background: overBudget ? '#ef4444' : pct > 80 ? '#f59e0b' : '#ec4899'
                        }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💒</div>
            <p className="text-sm text-slate-600 font-medium">Set a budget to start planning</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
