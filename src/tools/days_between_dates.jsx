import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function days_between_dates() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [date1, setDate1] = useState('')
  const [date2, setDate2] = useState('')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    if (!date1 || !date2 || isNaN(d1) || isNaN(d2)) { alert('Please select both dates'); return }
    const diffTime = Math.abs(d2 - d1)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const diffWeeks = Math.floor(diffDays / 7)
    const diffMonths = Math.floor(diffDays / 30.44)
    const diffYears = Math.floor(diffDays / 365.25)
    setResult({ days: diffDays, weeks: diffWeeks, months: diffMonths, years: diffYears })
    jumpTo()
  }, [date1, date2, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Days Between Dates Calculator"
      desc="Calculate days, weeks, months, and years between two dates. Instant date difference calculator."
      icon="📅" iconBg="rgba(14,165,233,0.08)"
      category="utility" slug="days-between-dates"
      faq={[
        { q: 'Is Days Between Dates free?', a: "Yes, it's completely free with no sign-ups required." },
        { q: 'Is Days Between Dates private?', a: 'Yes. All calculations run in your browser. No data is uploaded.' },
        { q: 'Does Days Between Dates work on mobile?', a: 'Yes. All tools are mobile-responsive and work on any device.' },
      ]}
      howItWorks={[
        'Select a start date.',
        'Select an end date.',
        'Click Calculate to see days, weeks, months, and years between.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Days Between Dates Calculator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/days-between-dates/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Start Date</label>
            <input type="date" value={date1} onChange={e => setDate1(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">End Date</label>
            <input type="date" value={date2} onChange={e => setDate2(e.target.value)} className={inputClass} />
          </div>
        </div>

        <button onClick={calculate}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          📊 Calculate
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Date Difference</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Days', result.days],
                ['Weeks', result.weeks],
                ['Months', result.months],
                ['Years', result.years],
              ].map(([label, val]) => (
                <div key={label} className="rounded-xl border border-white/8 bg-white/[0.04] p-4 text-center">
                  <div className="text-xs text-slate-500">{label}</div>
                  <div className="text-2xl font-extrabold text-white mt-1">{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📅</div>
            <p className="text-sm text-slate-600 font-medium">Select two dates and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
