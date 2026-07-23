import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const DEFAULT_SUBJECTS = [
  { name: 'English', marks: '', max: 100 },
  { name: 'Physics', marks: '', max: 100 },
  { name: 'Chemistry', marks: '', max: 100 },
  { name: 'Mathematics', marks: '', max: 100 },
  { name: 'Computer Science', marks: '', max: 100 },
  { name: 'Physical Education', marks: '', max: 100 },
  { name: 'Economics', marks: '', max: 100 },
]

const DEMO_SUBJECTS = [
  { name: 'English Core', marks: '88', max: 100 },
  { name: 'Physics', marks: '84', max: 100 },
  { name: 'Chemistry', marks: '79', max: 100 },
  { name: 'Mathematics', marks: '91', max: 100 },
  { name: 'Computer Science', marks: '95', max: 100 },
  { name: 'Physical Education', marks: '93', max: 100 },
  { name: 'Economics', marks: '82', max: 100 },
]

export default function best_of_five_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS)
  const [result, setResult] = useState(null)

  const updateSubject = useCallback((idx, field, val) => {
    setSubjects(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s))
  }, [])

  const calculate = useCallback(() => {
    const valid = subjects.filter(s => s.name && s.marks !== '' && s.max > 0 && Number(s.marks) >= 0)
    if (valid.length < 5) return
    const sorted = [...valid].sort((a, b) => (Number(b.marks) / b.max) - (Number(a.marks) / a.max))
    const chosen = sorted.slice(0, 5)
    const total = chosen.reduce((a, s) => a + Number(s.marks), 0)
    const max = chosen.reduce((a, s) => a + s.max, 0)
    const pct = (total / max) * 100
    setResult({ chosen, total, max, pct, remaining: sorted.slice(5) })
  }, [subjects])

  const loadDemo = useCallback(() => setSubjects(DEMO_SUBJECTS), [])
  const reset = useCallback(() => { setSubjects(DEFAULT_SUBJECTS); setResult(null) }, [])

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"

  return (
    <ToolLayout
      title="Best of Five Calculator"
      desc="Automatically pick the five strongest subjects from board exam marks and calculate your best-of-five percentage."
      icon="📝" iconBg="rgba(99,102,241,0.08)"
      category="education" slug="best-of-five-calculator"
      faq={[
        { q: 'How does best of five work?', a: 'The tool sorts all subjects by percentage (marks/max), picks the top 5, and calculates the combined percentage.' },
        { q: 'How many subjects do I need?', a: 'Enter at least 5 subjects with valid marks. The tool picks the best 5 automatically.' },
      ]}
      howItWorks={[
        'Enter subject names, marks obtained, and maximum marks for each.',
        'The tool picks the top 5 by percentage automatically.',
        'View your best-of-five percentage and included subjects.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Best of Five Calculator", "applicationCategory": "EducationalApplication",
        "url": "https://www.uptools.in/best-of-five-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-3">
          <div className="grid grid-cols-[1fr_80px_80px] gap-2 text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
            <div>Subject</div><div>Marks</div><div>Max</div>
          </div>
          {subjects.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_80px_80px] gap-2">
              <input type="text" value={s.name} onChange={e => updateSubject(i, 'name', e.target.value)}
                placeholder="Subject" className={inputClass} />
              <input type="number" min="0" value={s.marks} onChange={e => updateSubject(i, 'marks', e.target.value)}
                placeholder="0" className={inputClass} />
              <input type="number" min="1" value={s.max} onChange={e => updateSubject(i, 'max', e.target.value)}
                placeholder="100" className={inputClass} />
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={() => { calculate(); jumpTo() }}
            className="glow-btn flex-1 py-3 rounded-xl text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            Calculate Best of Five
          </button>
          <button onClick={loadDemo}
            className="px-4 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
            Demo
          </button>
          <button onClick={reset}
            className="px-4 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
            Reset
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="space-y-4" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-500/[0.08] to-transparent border-2 border-indigo-500/20">
              <div className="text-3xl font-extrabold text-white mb-1">{result.pct.toFixed(2)}%</div>
              <div className="text-sm text-slate-400">Best of Five Percentage</div>
              <div className="text-xs text-slate-600 mt-2">
                {result.total}/{result.max} total marks
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
              <h3 className="text-xs font-semibold text-slate-400 mb-2">Included Subjects</h3>
              <div className="space-y-2">
                {result.chosen.map((s, i) => {
                  const pct = ((Number(s.marks) / s.max) * 100).toFixed(1)
                  return (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <div>
                        <span className="text-sm font-semibold text-white">{s.name}</span>
                        <span className="text-xs text-slate-600 ml-2">#{i + 1}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-indigo-400 font-mono">{s.marks}/{s.max}</span>
                        <span className="text-xs text-slate-600 ml-2">({pct}%)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {result.remaining.length > 0 && (
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Not counted</div>
                <div className="text-xs text-slate-500">{result.remaining.map(s => s.name).join(', ')}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
