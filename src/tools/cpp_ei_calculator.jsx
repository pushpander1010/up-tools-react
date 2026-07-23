import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = v => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v || 0)

const CPP_RATE = 0.0595
const CPP_YMPE = 68500
const CPP_EXEMPT = 3500
const EI_RATE = 0.0166
const EI_MAX = 63200

function calcCPP_EI(income) {
  const inc = Math.max(0, Number(income || 0))
  if (!inc) return null
  const cppBase = Math.max(0, Math.min(CPP_YMPE, inc) - CPP_EXEMPT)
  const cpp = cppBase * CPP_RATE
  const ei = Math.min(EI_MAX, inc) * EI_RATE
  return { cpp, ei, total: cpp + ei }
}

export default function cpp_ei_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [income, setIncome] = useState('')

  const result = useMemo(() => calcCPP_EI(income), [income])

  const inputClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-red-500/40 transition-all duration-300 placeholder:text-white/8'

  return (
    <ToolLayout
      title="CPP & EI Deduction Calculator"
      desc="Estimate CPP and EI payroll deductions based on annual income (Canada)."
      icon="🍁" iconBg="rgba(220,38,38,0.08)"
      category="canada" slug="cpp-ei-calculator"
      faq={[
        { q: 'What is CPP & EI Calculator?', a: 'Estimate CPP and EI payroll deductions based on annual income (Canada).' },
        { q: 'Is it free to use?', a: 'Yes. All UpTools calculators are completely free, with no sign-ups required.' },
      ]}
      howItWorks={[
        'Enter your annual income in CAD.',
        'Click Calculate to see estimated CPP and EI deductions.',
        'View the breakdown of each deduction and total.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'CPP & EI Deduction Calculator', applicationCategory: 'UtilitiesApplication',
        url: 'https://www.uptools.in/cpp-ei-calculator/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Annual income (CAD)</label>
          <input type="number" value={income} onChange={e => setIncome(e.target.value)}
            placeholder="e.g., 65000" min="0" step="100"
            className={inputClass} />
          <p className="text-xs text-slate-500 mt-2">CPP rate {CPP_RATE * 100}% on earnings ${CPP_EXEMPT.toLocaleString()} – ${CPP_YMPE.toLocaleString()} | EI rate {EI_RATE * 100}% on first ${EI_MAX.toLocaleString()}</p>
        </div>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Deductions</h3>
            </div>
            <div className="text-3xl font-extrabold text-white">{fmt(result.total)}</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">CPP (employee)</span>
                <span className="font-bold text-white">{fmt(result.cpp)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">EI (employee)</span>
                <span className="font-bold text-white">{fmt(result.ei)}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">Approximate. Use CRA for exact figures.</p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🍁</div>
            <p className="text-sm text-slate-600 font-medium">Enter income to see CPP & EI deductions</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
