import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function school_fee_planner() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [annualFee, setAnnualFee] = useState('')
  const [hike, setHike] = useState('')
  const [years, setYears] = useState('')
  const [admissionFee, setAdmissionFee] = useState('')

  const schedule = useMemo(() => {
    const fee = parseFloat(annualFee)
    const hikeRate = parseFloat(hike) / 100
    const yrs = parseInt(years)
    const adm = parseFloat(admissionFee) || 0
    if (!fee || !yrs || isNaN(hikeRate)) return null

    const rows = []
    let total = adm // Year 0 admission fee
    let currentFee = fee
    for (let y = 1; y <= yrs; y++) {
      const yFee = y === 1 ? fee : currentFee
      total += yFee
      rows.push({ year: y, fee: Math.round(yFee), total: Math.round(total) })
      currentFee = currentFee * (1 + hikeRate)
    }

    return { total: Math.round(total), rows }
  }, [annualFee, hike, years, admissionFee])

  const fmt = n => n.toLocaleString('en-IN')

  return (
    <ToolLayout
      title="School Fee Planner"
      desc="School Fee Planner - project total school education cost with annual fee hikes and admission charges. Free online tool."
      icon="🎓" iconBg="rgba(168,85,247,0.08)"
      category="finance" slug="school-fee-planner"
      faq={[
        { q: 'What is a School Fee Planner?', a: 'A tool that calculates the total cost of school education over multiple years, factoring in annual fee hikes and one-time admission fees.' },
        { q: 'How to use it?', a: 'Enter the current annual fee, expected yearly hike percentage, number of years, and any admission fee. The tool shows a year-by-year projection and total cost.' },
        { q: 'How do I use this School Fee Planner online free?', a: 'Enter your input above, customize the options, and copy or save the result. Free with no sign-up.' },
        { q: 'How do I save my result?', a: 'Click the copy or download button on your result to save it. Free with no sign-up.' },
        { q: 'Can I use it more than once?', a: 'Yes, unlimited free use. Generate as many results as you need, on any device.' },
        { q: 'Is this School Fee Planner free?', a: 'Yes, completely free with no sign-up. Use it unlimited times online on any device.' },
      ]}
      howItWorks={[
        'Enter the current annual school fee in rupees.',
        'Specify the expected yearly fee hike percentage (e.g., 8 for 8%).',
        'Enter the number of years and any one-time admission fee.',
        'The planner projects year-by-year fees and shows total education cost.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "School Fee Planner", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/school-fee-planner/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Inputs */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Annual Fee (₹)</label>
              <input type="number" value={annualFee} onChange={e => { setAnnualFee(e.target.value); jumpTo() }}
                placeholder="60000"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Yearly Hike (%)</label>
              <input type="number" step="0.5" value={hike} onChange={e => { setHike(e.target.value); jumpTo() }}
                placeholder="8"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Number of Years</label>
              <input type="number" min="1" max="20" value={years} onChange={e => { setYears(e.target.value); jumpTo() }}
                placeholder="12"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Admission Fee (₹)</label>
              <input type="number" value={admissionFee} onChange={e => { setAdmissionFee(e.target.value); jumpTo() }}
                placeholder="25000"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400" />
            </div>
          </div>
        </div>

        {/* Results */}
        {schedule ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Fee Projection</h3>
            </div>
            <div className="p-3 rounded-xl bg-black/20 border border-white/[0.05] text-center mb-4">
              <div className="text-3xl font-extrabold text-indigo-400">₹{fmt(schedule.total)}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Total Estimated Cost</div>
            </div>
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Year-by-Year Breakdown</h4>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="sticky top-0 bg-black/40">
                  <tr className="text-slate-400">
                    <th className="py-1.5 px-2">Year</th>
                    <th className="py-1.5 px-2">Annual Fee</th>
                    <th className="py-1.5 px-2">Cumulative Total</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.rows.map(r => (
                    <tr key={r.year} className="border-t border-white/[0.05]">
                      <td className="py-1.5 px-2 text-slate-300">Year {r.year}</td>
                      <td className="py-1.5 px-2 text-indigo-300">₹{fmt(r.fee)}</td>
                      <td className="py-1.5 px-2 text-emerald-300">₹{fmt(r.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎓</div>
            <p className="text-sm text-slate-600 font-medium">Enter fee details to see projection</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
