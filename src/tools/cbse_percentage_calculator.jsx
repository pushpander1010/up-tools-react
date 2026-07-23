import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const SEED = [
  { name: 'English', marks: '', max: 100 },
  { name: 'Physics', marks: '', max: 100 },
  { name: 'Chemistry', marks: '', max: 100 },
  { name: 'Mathematics', marks: '', max: 100 },
  { name: 'Computer Science', marks: '', max: 100 },
  { name: 'Physical Education', marks: '', max: 100 },
]

const DEMO = [
  { name: 'English Core', marks: 88, max: 100 },
  { name: 'Physics', marks: 84, max: 100 },
  { name: 'Chemistry', marks: 79, max: 100 },
  { name: 'Mathematics', marks: 91, max: 100 },
  { name: 'Computer Science', marks: 95, max: 100 },
  { name: 'Physical Education', marks: 93, max: 100 },
]

function grade(p) {
  if (p >= 91) return 'A1'
  if (p >= 81) return 'A2'
  if (p >= 71) return 'B1'
  if (p >= 61) return 'B2'
  if (p >= 51) return 'C1'
  if (p >= 41) return 'C2'
  if (p >= 33) return 'D'
  return 'E'
}

export default function cbse_percentage_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [subjects, setSubjects] = useState(SEED)
  const [result, setResult] = useState(null)

  const updateSubject = useCallback((index, field, value) => {
    setSubjects(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }, [])

  const addSubject = useCallback(() => {
    setSubjects(prev => [...prev, { name: '', marks: '', max: 100 }])
  }, [])

  const removeSubject = useCallback((index) => {
    setSubjects(prev => prev.filter((_, i) => i !== index))
  }, [])

  const calculate = useCallback(() => {
    const rows = subjects
      .filter(s => s.name && s.marks !== '' && s.max > 0)
      .map(s => ({
        name: s.name,
        marks: Number(s.marks),
        max: Number(s.max),
      }))
      .filter(r => r.marks >= 0 && r.marks <= r.max)

    if (!rows.length) {
      setResult({ error: 'Enter at least one valid subject with marks.' })
      return
    }

    const total = rows.reduce((a, b) => a + b.marks, 0)
    const max = rows.reduce((a, b) => a + b.max, 0)
    const pct = (total / max) * 100

    setResult({
      total,
      max,
      percentage: pct.toFixed(2),
      average: (total / rows.length).toFixed(2),
      grade: grade(pct),
      subjects: rows.map(r => ({
        name: r.name,
        marks: r.marks,
        max: r.max,
        pct: ((r.marks / r.max) * 100).toFixed(1),
        grade: grade((r.marks / r.max) * 100),
      })),
    })
    jumpTo()
  }, [subjects, jumpTo])

  const loadDemo = useCallback(() => {
    setSubjects(DEMO)
    setResult(null)
  }, [])

  const reset = useCallback(() => {
    setSubjects(SEED)
    setResult(null)
  }, [])

  return (
    <ToolLayout
      title="CBSE Percentage Calculator"
      desc="Calculate CBSE Class 12 percentage from subject-wise marks."
      icon="📊" iconBg="rgba(99,102,241,0.08)"
      category="education" slug="cbse-percentage-calculator"
      faq={[
        { q: "How is the percentage calculated?", a: "Total marks obtained divided by total maximum marks, multiplied by 100." },
        { q: "What grading system is used?", a: "CBSE grading: A1 (91+), A2 (81-90), B1 (71-80), B2 (61-70), C1 (51-60), C2 (41-50), D (33-40), E (<33)." },
      ]}
      howItWorks={[
        "Enter subject names, marks obtained, and maximum marks.",
        "Click Calculate to see your total, percentage, and grade.",
        "Use Demo to load sample data or Reset to start over.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "CBSE Percentage Calculator", "applicationCategory": "EducationalApplication",
        "url": "https://www.uptools.in/cbse-percentage-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Subjects */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-2">
          <div className="text-xs font-bold text-slate-400 mb-2">📝 Subjects</div>
          {subjects.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="text" value={s.name} onChange={e => updateSubject(i, 'name', e.target.value)}
                placeholder="Subject name"
                className="flex-1 bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600" />
              <input type="number" value={s.marks} onChange={e => updateSubject(i, 'marks', e.target.value)}
                placeholder="Marks" min={0}
                className="w-20 bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600" />
              <span className="text-xs text-slate-600">/</span>
              <input type="number" value={s.max} onChange={e => updateSubject(i, 'max', e.target.value)}
                placeholder="Max" min={1}
                className="w-16 bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600" />
              {subjects.length > 1 && (
                <button onClick={() => removeSubject(i)}
                  className="text-xs text-slate-600 hover:text-red-400 transition-all">✕</button>
              )}
            </div>
          ))}
          <button onClick={addSubject}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-all">
            + Add Subject
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={calculate}
            className="flex-1 glow-btn py-3 rounded-xl text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            📊 Calculate
          </button>
          <button onClick={loadDemo}
            className="px-4 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
            📋 Demo
          </button>
          <button onClick={reset}
            className="px-4 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
            🔄 Reset
          </button>
        </div>

        {/* Results */}
        {result && !result.error && (
          <div ref={resultRef} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 text-center">
                <div className="text-xs text-slate-500 mb-1">Total</div>
                <div className="text-lg font-bold text-white">{result.total}/{result.max}</div>
              </div>
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 text-center">
                <div className="text-xs text-slate-500 mb-1">Percentage</div>
                <div className="text-lg font-bold text-indigo-400">{result.percentage}%</div>
              </div>
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 text-center">
                <div className="text-xs text-slate-500 mb-1">Average</div>
                <div className="text-lg font-bold text-white">{result.average}</div>
              </div>
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 text-center">
                <div className="text-xs text-slate-500 mb-1">Grade</div>
                <div className="text-lg font-bold text-emerald-400">{result.grade}</div>
              </div>
            </div>

            {/* Subject Breakdown */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
              <div className="text-xs font-bold text-slate-400 mb-3">📋 Subject Breakdown</div>
              <div className="space-y-2">
                {result.subjects.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                    <div className="flex-1">
                      <span className="text-sm text-white">{s.name}</span>
                      <span className="text-xs text-slate-500 ml-2">{s.marks}/{s.max}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{s.pct}%</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${s.grade.startsWith('A') ? 'text-emerald-400 bg-emerald-500/10' : s.grade.startsWith('B') ? 'text-cyan-400 bg-cyan-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                        {s.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {result?.error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-sm text-red-400 text-center">
            {result.error}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
