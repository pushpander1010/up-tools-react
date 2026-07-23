import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LS_KEY = 'uptools_cgpa_data'

function gradeClass(g) {
  if (g >= 9) return { label: 'O (Outstanding)', color: 'text-emerald-400', bg: 'bg-emerald-500/15' }
  if (g >= 8) return { label: 'A+ (Excellent)', color: 'text-cyan-400', bg: 'bg-cyan-500/15' }
  if (g >= 7) return { label: 'A (Very Good)', color: 'text-blue-400', bg: 'bg-blue-500/15' }
  if (g >= 6) return { label: 'B+ (Good)', color: 'text-yellow-400', bg: 'bg-yellow-500/15' }
  if (g >= 5) return { label: 'B (Above Average)', color: 'text-orange-400', bg: 'bg-orange-500/15' }
  if (g >= 4) return { label: 'C (Average)', color: 'text-slate-400', bg: 'bg-white/[0.08]' }
  return { label: 'Below Average', color: 'text-red-400', bg: 'bg-red-500/15' }
}

function loadSaved() {
  try { const d = JSON.parse(localStorage.getItem(LS_KEY)); if (d && d.subjects) return d.subjects } catch {}
  return [{ id: 1, name: '', gp: '', credits: '' }]
}

function AnimatedNumber({ value, decimals = 2 }) {
  const [display, setDisplay] = useState(value)
  const frameRef = useRef(null)
  useEffect(() => {
    const start = display
    const diff = value - start
    const duration = 400
    const startTime = performance.now()
    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(start + diff * eased)
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value])
  return <span>{display.toFixed(decimals)}</span>
}

export default function cgpa_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [subjects, setSubjects] = useState(loadSaved)
  const [classAvg, setClassAvg] = useState('')
  const [copied, setCopied] = useState(false)
  const nextId = useRef(100)

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ subjects }))
  }, [subjects])

  const result = useMemo(() => {
    let totalGP = 0, totalCr = 0
    for (const s of subjects) {
      const gp = parseFloat(s.gp) || 0
      const cr = parseFloat(s.credits) || 0
      if (gp > 0 && cr > 0) { totalGP += gp * cr; totalCr += cr }
    }
    const cgpa = totalCr > 0 ? totalGP / totalCr : 0
    const pct = cgpa * 9.5
    const gc = gradeClass(cgpa)
    return { cgpa, pct, totalCr, totalGP, gc }
  }, [subjects])

  const gaugePercent = (result.cgpa / 10) * 100

  const updateSubject = useCallback((id, field, val) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s))
  }, [])

  const addSubject = useCallback(() => {
    setSubjects(prev => [...prev, { id: ++nextId.current, name: '', gp: '', credits: '' }])
  }, [])

  const removeSubject = useCallback((id) => {
    setSubjects(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev)
  }, [])

  const handleCopy = useCallback(() => {
    const lines = [
      `CGPA Calculator Results`, `CGPA: ${result.cgpa.toFixed(2)}`, `Percentage: ${result.pct.toFixed(2)}%`,
      `Grade: ${result.gc.label}`, `Total Credits: ${result.totalCr}`, ''
    ]
    subjects.forEach(s => { if (s.name) lines.push(`${s.name}: GP ${s.gp} × ${s.credits}cr`) })
    navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [result, subjects])

  const diff = parseFloat(classAvg) > 0 ? (result.cgpa - parseFloat(classAvg)).toFixed(2) : null

  return (
    <ToolLayout
      title="CGPA Calculator"
      desc="Calculate CGPA on a 10-point Indian grading scale. Converts to percentage (CGPA × 9.5) and shows grade classification."
      icon="📊" iconBg="rgba(16,185,129,0.08)"
      category="education" slug="cgpa-calculator"
      faq={[
        { q: 'What is CGPA?', a: 'CGPA (Cumulative Grade Point Average) is the average of grade points obtained in all subjects on a 10-point scale, commonly used in Indian universities.' },
        { q: 'How to convert CGPA to percentage?', a: 'Multiply your CGPA by 9.5 to get the approximate percentage. This is the standard conversion formula used by CBSE and many Indian universities.' },
        { q: 'What is the Indian grading system?', a: 'The 10-point scale: O (10, Outstanding), A+ (9+, Excellent), A (8+, Very Good), B+ (7+, Good), B (6+, Above Average), C (5+, Average).' },
      ]}
      howItWorks={[
        'Enter each subject with its Grade Point (0-10) and Credit hours.',
        'Add more subjects using the "+ Add Subject" button.',
        'CGPA calculates automatically as total grade points ÷ total credits.',
        'Percentage is shown as CGPA × 9.5 (Indian standard conversion).',
        'Optionally enter class average to compare your CGPA.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "CGPA Calculator", "applicationCategory": "EducationalApplication",
        "url": "https://www.uptools.in/cgpa-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Subjects */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.03] p-5 sm:p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Subjects</h3>
          {subjects.map((s) => (
            <div key={s.id} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center"
              style={{ animation: 'slideUp 0.2s ease' }}>
              <input value={s.name} onChange={e => updateSubject(s.id, 'name', e.target.value)}
                placeholder="Subject name"
                className="flex-1 min-w-0 bg-white/[0.06] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white font-medium outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-500" />
              <input type="number" value={s.gp} onChange={e => { const v = e.target.value; if (v === '' || (parseFloat(v) >= 0 && parseFloat(v) <= 10)) updateSubject(s.id, 'gp', v) }}
                min="0" max="10" step="0.1" placeholder="Grade Points (0-10)"
                className="w-20 bg-white/[0.06] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white font-semibold text-center outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-500" />
              <input type="number" value={s.credits} onChange={e => updateSubject(s.id, 'credits', e.target.value)}
                min="0.5" max="10" step="0.5" placeholder="Credits"
                className="w-20 bg-white/[0.06] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white font-semibold text-center outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-500" />
              {subjects.length > 1 && (
                <button onClick={() => removeSubject(s.id)} className="text-red-400/30 hover:text-red-400 text-xs transition-colors">✕</button>
              )}
            </div>
          ))}
          <button onClick={addSubject}
            className="text-xs font-semibold text-emerald-400/60 hover:text-emerald-400 transition-colors">
            + Add Subject
          </button>
        </div>

        {/* Class Average */}
        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.03] p-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Class Average CGPA (optional)</label>
          <input type="number" value={classAvg} onChange={e => setClassAvg(e.target.value)}
            min="0" max="10" step="0.1" placeholder="e.g. 7.5"
            className="w-32 bg-white/[0.06] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white font-semibold outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-500" />
        </div>

        {/* Result */}
        {result.totalCr > 0 ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Your CGPA</h3>
              </div>
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:border-white/15 transition-all active:scale-95">
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>

            {/* Big CGPA */}
            <div className="text-center mb-4">
              <div className={`text-6xl font-extrabold tracking-tight ${result.gc.color}`}>
                <AnimatedNumber value={result.cgpa} decimals={2} />
              </div>
              <div className={`mt-2 text-sm font-semibold ${result.gc.color} ${result.gc.bg} inline-block px-3 py-1 rounded-xl`}>
                {result.gc.label}
              </div>
            </div>

            {/* Gauge */}
            <div className="mb-5">
              <div className="h-4 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 transition-all duration-700"
                  style={{ width: `${Math.min(gaugePercent, 100)}%` }} />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-slate-600">
                <span>0</span><span>5</span><span>10</span>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-1 mb-4">
              {[
                { label: 'Percentage', value: `${result.pct.toFixed(2)}%`, accent: true },
                { label: 'Total Credits', value: result.totalCr, color: 'text-white' },
                { label: 'Total Grade Points', value: result.totalGP.toFixed(1), color: 'text-white' },
                ...(diff !== null ? [{ label: diff >= 0 ? 'Above Class Avg' : 'Below Class Avg', value: `${diff >= 0 ? '+' : ''}${diff}`, color: diff >= 0 ? 'text-emerald-400' : 'text-red-400' }] : []),
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-slate-400">{row.label}</span>
                  <span className={`text-sm font-bold ${row.accent ? 'text-emerald-400' : row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📊</div>
            <p className="text-sm text-slate-600 font-medium">Enter grade points and credits to calculate CGPA</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
