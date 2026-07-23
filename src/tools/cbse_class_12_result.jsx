import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const DEFAULT_ROWS = [
  { name: 'English', marks: '', max: 100 },
  { name: 'Subject 2', marks: '', max: 100 },
  { name: 'Subject 3', marks: '', max: 100 },
  { name: 'Subject 4', marks: '', max: 100 },
  { name: 'Subject 5', marks: '', max: 100 },
  { name: 'Subject 6', marks: '', max: 100 },
]

const DEMO_ROWS = [
  { name: 'English Core', marks: 88, max: 100 },
  { name: 'Physics', marks: 84, max: 100 },
  { name: 'Chemistry', marks: 79, max: 100 },
  { name: 'Mathematics', marks: 91, max: 100 },
  { name: 'Computer Science', marks: 95, max: 100 },
  { name: 'Physical Education', marks: 93, max: 100 },
]

function gradeFor(percent) {
  if (percent >= 91) return 'A1'
  if (percent >= 81) return 'A2'
  if (percent >= 71) return 'B1'
  if (percent >= 61) return 'B2'
  if (percent >= 51) return 'C1'
  if (percent >= 41) return 'C2'
  if (percent >= 33) return 'D'
  return 'E'
}

export default function cbse_class_12_result() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [rows, setRows] = useState(DEFAULT_ROWS)
  const [result, setResult] = useState(null)

  const updateRow = useCallback((idx, field, value) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: field === 'name' ? value : value } : r))
  }, [])

  const analyze = useCallback(() => {
    const valid = rows.filter(r => r.name && r.marks !== '' && r.max > 0 && Number(r.marks) >= 0 && Number(r.marks) <= r.max)
    if (valid.length < 5) { alert('Enter at least five valid subjects to analyze.'); return }
    const total = valid.reduce((s, r) => s + Number(r.marks), 0)
    const maxTotal = valid.reduce((s, r) => s + r.max, 0)
    const percentage = (total / maxTotal) * 100
    const failed = valid.filter(r => (Number(r.marks) / r.max) * 100 < 33)
    const bestFive = [...valid].sort((a, b) => (Number(b.marks) / b.max) - (Number(a.marks) / a.max)).slice(0, 5)
    const bestFivePercent = (bestFive.reduce((s, r) => s + Number(r.marks), 0) / bestFive.reduce((s, r) => s + r.max, 0)) * 100
    const subjectRows = valid.map(r => {
      const pct = (Number(r.marks) / r.max) * 100
      return { name: r.name, marks: r.marks, max: r.max, pct, grade: gradeFor(pct) }
    })
    const recommendations = [
      percentage >= 85 ? 'Keep merit-based college shortlists active, but still check course-specific cutoffs.' : 'Shortlist a wider college mix instead of relying on only top cutoffs.',
      bestFivePercent !== percentage ? `Your best-of-five percentage is ${bestFivePercent.toFixed(2)}%. Some admissions use this figure.` : 'Your overall and best-of-five percentages are the same because five valid subjects were entered.',
      failed.length ? 'Review compartment, re-evaluation, or supplementary options for the weak subjects before final decisions.' : 'No subject is below the basic pass threshold in this local analysis.',
      'Use official admission criteria for every college. Different universities may calculate eligibility differently.',
    ]
    setResult({ total, maxTotal, percentage, bestFivePercent, subjectRows, failed, recommendations })
    jumpTo()
  }, [rows, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold text-sm outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="CBSE Class 12 Result Checker and Analyzer"
      desc="Use the official CBSE result links, verify your details, and analyze your Class 12 marks with percentage, grade summary, and next-step guidance."
      icon="📊" iconBg="rgba(34,197,94,0.08)"
      category="education" slug="cbse-class-12-result"
      faq={[
        { q: 'Does this tool fetch live results?', a: 'No. This page helps you use the official result links and analyze your marks after you receive them.' },
        { q: 'How many subjects do I need to enter?', a: 'Enter at least five valid subjects to get a meaningful analysis.' },
        { q: 'Is my data private?', a: 'Yes. All calculations run locally in your browser. Nothing is uploaded.' },
      ]}
      howItWorks={[
        'Keep your roll number, school number, admit card ID, and date of birth ready.',
        'Enter up to six subjects exactly as shown in your marksheet.',
        'Click "Analyze Result" to see percentage, grade, and recommendations.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "CBSE Class 12 Result Checker", "applicationCategory": "EducationalApplication",
        "url": "https://www.uptools.in/cbse-class-12-result/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Official Links */}
        <div className="rounded-3xl border-2 border-amber-500/15 bg-amber-500/[0.04] p-6">
          <h2 className="text-sm font-bold text-amber-400 mb-2">Before You Start</h2>
          <p className="text-sm text-slate-400 mb-3">This page does not fetch live result data from CBSE servers. It helps you use the official result links and analyze your marks after you receive them.</p>
          <div className="flex gap-3">
            <a href="https://cbseresults.nic.in/" target="_blank" rel="noopener" className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-400 transition-all">Open Official CBSE Results</a>
            <a href="https://www.cbse.gov.in/" target="_blank" rel="noopener" className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/8 text-white text-xs font-bold hover:bg-white/10 transition-all">Open CBSE Website</a>
          </div>
        </div>

        {/* Subject Form */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <h2 className="text-sm font-bold text-white mb-3">Analyze Your Marks</h2>
          <p className="text-xs text-slate-500 mb-4">Enter up to six subjects exactly as shown in your marksheet. Empty rows are ignored.</p>
          <div className="space-y-3">
            {rows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_80px_80px] gap-2">
                <input type="text" value={row.name} onChange={e => updateRow(idx, 'name', e.target.value)} placeholder="Subject" className={inputClass} />
                <input type="number" value={row.marks} onChange={e => updateRow(idx, 'marks', e.target.value === '' ? '' : Number(e.target.value))} placeholder="Marks" min="0" max={row.max} className={inputClass} />
                <input type="number" value={row.max} onChange={e => updateRow(idx, 'max', Number(e.target.value))} min="1" className={inputClass} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={analyze} className="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all">Analyze Result</button>
            <button onClick={() => { setRows(DEMO_ROWS); setResult(null) }} className="px-4 py-3 rounded-xl bg-white/[0.06] border border-white/8 text-white text-xs font-bold hover:bg-white/10 transition-all">Load Demo</button>
            <button onClick={() => { setRows(DEFAULT_ROWS); setResult(null) }} className="px-4 py-3 rounded-xl bg-white/[0.06] border border-white/8 text-white text-xs font-bold hover:bg-white/10 transition-all">Reset</button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Analysis Summary</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl border border-white/8 bg-white/[0.04] p-3 text-center">
                <div className="text-xs text-slate-500">Total</div>
                <div className="text-lg font-extrabold text-white">{result.total}/{result.maxTotal}</div>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.04] p-3 text-center">
                <div className="text-xs text-slate-500">Percentage</div>
                <div className="text-lg font-extrabold text-indigo-400">{result.percentage.toFixed(2)}%</div>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.04] p-3 text-center">
                <div className="text-xs text-slate-500">Grade Band</div>
                <div className="text-lg font-extrabold text-white">{gradeFor(result.percentage)}</div>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.04] p-3 text-center">
                <div className="text-xs text-slate-500">Best of 5</div>
                <div className="text-lg font-extrabold text-white">{result.bestFivePercent.toFixed(2)}%</div>
              </div>
            </div>
            <h4 className="text-xs font-bold text-white mb-2">Subject Breakdown</h4>
            <div className="space-y-2 mb-4">
              {result.subjectRows.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{r.name}</span>
                  <span className="text-slate-500">{r.marks}/{r.max} ({r.pct.toFixed(1)}%)</span>
                  <span className={`font-bold ${r.pct >= 60 ? 'text-emerald-400' : r.pct >= 33 ? 'text-amber-400' : 'text-rose-400'}`}>{r.grade}</span>
                </div>
              ))}
            </div>
            <h4 className="text-xs font-bold text-white mb-2">Recommendations</h4>
            <ul className="space-y-2">
              {result.recommendations.map((r, i) => (
                <li key={i} className="flex gap-2 text-xs text-slate-400">
                  <span className="text-indigo-400 font-bold mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📊</div>
            <p className="text-sm text-slate-600 font-medium">Enter at least 5 subjects and click Analyze</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
