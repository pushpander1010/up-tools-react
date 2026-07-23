import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const UNWEIGHTED = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'D-': 0.7, 'F': 0.0 }
const WEIGHTED = { 'A+': 5.0, 'A': 5.0, 'A-': 4.7, 'B+': 4.3, 'B': 4.0, 'B-': 3.7, 'C+': 3.3, 'C': 3.0, 'C-': 2.7, 'D+': 2.3, 'D': 2.0, 'D-': 1.7, 'F': 0.0 }
const GRADES = Object.keys(UNWEIGHTED)
const LS_KEY = 'uptools_gpa_data'

function gradeColor(g) {
  if (g >= 3.5) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
  if (g >= 2.5) return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'
  return 'bg-red-500/15 text-red-400 border-red-500/20'
}

function gradeTextColor(g) {
  if (g >= 3.5) return 'text-emerald-400'
  if (g >= 2.5) return 'text-yellow-400'
  return 'text-red-400'
}

function calcSemesterGPA(courses, weighted) {
  const map = weighted ? WEIGHTED : UNWEIGHTED
  let pts = 0, cr = 0
  for (const c of courses) {
    if (c.grade && c.credits > 0) { pts += map[c.grade] * c.credits; cr += c.credits }
  }
  return cr > 0 ? pts / cr : 0
}

function loadSaved() {
  try { const d = JSON.parse(localStorage.getItem(LS_KEY)); if (d && d.semesters) return d.semesters } catch {}
  return [{ id: 1, name: 'Semester 1', courses: [{ id: 1, name: '', credits: 3, grade: '' }] }]
}

function AnimatedNumber({ value, decimals = 2, prefix = '' }) {
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
  return <span>{prefix}{display.toFixed(decimals)}</span>
}

export default function gpa_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [semesters, setSemesters] = useState(loadSaved)
  const [scale, setScale] = useState('unweighted')
  const [copied, setCopied] = useState(false)
  const nextId = useRef(100)

  const weighted = scale === 'weighted'

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ semesters }))
  }, [semesters])

  const semGPAs = useMemo(() => semesters.map(s => calcSemesterGPA(s.courses, weighted)), [semesters, weighted])

  const cumulativeGPA = useMemo(() => {
    const map = weighted ? WEIGHTED : UNWEIGHTED
    let pts = 0, cr = 0
    for (const s of semesters) for (const c of s.courses) {
      if (c.grade && c.credits > 0) { pts += map[c.grade] * c.credits; cr += c.credits }
    }
    return cr > 0 ? pts / cr : 0
  }, [semesters, weighted])

  const totalCredits = useMemo(() => {
    let cr = 0
    for (const s of semesters) for (const c of s.courses) { if (c.credits > 0) cr += c.credits }
    return cr
  }, [semesters])

  const updateCourse = useCallback((si, ci, field, val) => {
    setSemesters(prev => {
      const next = prev.map((s, i) => i === si ? { ...s, courses: s.courses.map((c, j) => j === ci ? { ...c, [field]: val } : c) } : s)
      return next
    })
  }, [])

  const addCourse = useCallback((si) => {
    const id = ++nextId.current
    setSemesters(prev => prev.map((s, i) => i === si ? { ...s, courses: [...s.courses, { id, name: '', credits: 3, grade: '' }] } : s))
  }, [])

  const removeCourse = useCallback((si, ci) => {
    setSemesters(prev => prev.map((s, i) => i === si ? { ...s, courses: s.courses.filter((_, j) => j !== ci) } : s).filter((s) => s.courses.length > 0 || semesters.length > 1))
  }, [semesters.length])

  const addSemester = useCallback(() => {
    const id = ++nextId.current
    setSemesters(prev => [...prev, { id, name: `Semester ${prev.length + 1}`, courses: [{ id: id + 1, name: '', credits: 3, grade: '' }] }])
  }, [])

  const removeSemester = useCallback((si) => {
    setSemesters(prev => prev.length > 1 ? prev.filter((_, i) => i !== si) : prev)
  }, [])

  const updateSemesterName = useCallback((si, val) => {
    setSemesters(prev => prev.map((s, i) => i === si ? { ...s, name: val } : s))
  }, [])

  const handleCopy = useCallback(() => {
    const lines = [`GPA Calculator Results`, `Scale: ${weighted ? 'Weighted (5.0)' : 'Unweighted (4.0)'}`, `Total Credits: ${totalCredits}`, `Cumulative GPA: ${cumulativeGPA.toFixed(2)}`, '']
    semesters.forEach((s, i) => { lines.push(`${s.name || 'Sem ' + (i+1)}: ${semGPAs[i].toFixed(2)}`) })
    navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [cumulativeGPA, totalCredits, semesters, semGPAs, weighted])

  const barWidth = (cumulativeGPA / (weighted ? 5 : 4)) * 100

  return (
    <ToolLayout
      title="GPA Calculator"
      desc="Calculate semester and cumulative GPA with unweighted (4.0) or weighted (5.0) scales. Add multiple semesters with courses."
      icon="🎓" iconBg="rgba(59,130,246,0.08)"
      category="education" slug="gpa-calculator"
      faq={[
        { q: 'What is GPA?', a: 'GPA (Grade Point Average) is a number representing the average value of accumulated grades over a period, calculated by dividing total grade points by total credits.' },
        { q: 'How is GPA calculated?', a: 'Multiply each course grade point by its credit hours, sum all products, then divide by total credit hours.' },
        { q: 'What is weighted vs unweighted GPA?', a: 'Unweighted GPA uses a 4.0 scale. Weighted GPA adds extra points for harder courses (typically up to 5.0).' },
        { q: 'What is a good GPA?', a: 'A GPA of 3.5+ is considered excellent, 3.0-3.5 is good, 2.5-3.0 is average, and below 2.5 needs improvement.' },
      ]}
      howItWorks={[
        'Choose your grading scale: Unweighted (4.0) or Weighted (5.0).',
        'Add semesters using the "Add Semester" button.',
        'For each semester, enter course names, credits, and select grades.',
        'Per-semester GPA and cumulative GPA update instantly.',
        'Copy results to clipboard with one tap.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "GPA Calculator", "applicationCategory": "EducationalApplication",
        "url": "https://www.uptools.in/gpa-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Scale Toggle */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Grading Scale</label>
          <div className="grid grid-cols-2 gap-2">
            {[['unweighted', 'Unweighted (4.0)', 'A = 4.0'], ['weighted', 'Weighted (5.0)', 'A = 5.0']].map(([val, label, sub]) => (
              <button key={val} onClick={() => setScale(val)}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200
                  ${scale === val
                    ? 'bg-blue-500/10 border-blue-500/25 shadow-lg shadow-blue-500/10'
                    : 'bg-white/[0.06] border-white/8 hover:border-white/12'}`}>
                <div className={`text-sm font-bold ${scale === val ? 'text-blue-400' : 'text-slate-300'}`}>{label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Semesters */}
        {semesters.map((sem, si) => (
          <div key={sem.id} className="rounded-3xl border-2 border-white/8 bg-white/[0.03] p-5 sm:p-6 space-y-4"
            style={{ animation: 'slideUp 0.3s ease' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <input value={sem.name} onChange={e => updateSemesterName(si, e.target.value)}
                  className="bg-transparent text-lg font-bold text-white outline-none border-b border-transparent focus:border-blue-500/40 transition-colors flex-1"
                  placeholder="Semester name" />
                <span className={`text-sm font-bold px-2.5 py-1 rounded-xl border ${gradeColor(semGPAs[si])}`}>
                  {semGPAs[si].toFixed(2)}
                </span>
              </div>
              {semesters.length > 1 && (
                <button onClick={() => removeSemester(si)} className="text-red-400/40 hover:text-red-400 text-sm ml-2 transition-colors">✕</button>
              )}
            </div>

            {/* Courses */}
            {sem.courses.map((course, ci) => (
              <div key={course.id} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center"
                style={{ animation: 'slideUp 0.2s ease' }}>
                <input value={course.name} onChange={e => updateCourse(si, ci, 'name', e.target.value)}
                  placeholder="Course name"
                  className="flex-1 min-w-0 bg-white/[0.06] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white font-medium outline-none focus:border-blue-500/40 transition-all placeholder:text-slate-500" />
                <input type="number" value={course.credits} onChange={e => updateCourse(si, ci, 'credits', Math.max(0.5, Math.min(10, parseFloat(e.target.value) || 0.5)))}
                  min="0.5" max="10" step="0.5"
                  className="w-20 bg-white/[0.06] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white font-semibold text-center outline-none focus:border-blue-500/40 transition-all" />
                <div className="relative w-24">
                  <select value={course.grade} onChange={e => updateCourse(si, ci, 'grade', e.target.value)}
                    className="w-full bg-white/[0.06] border border-white/8 rounded-xl px-2 pr-6 py-2.5 text-sm text-white font-semibold outline-none focus:border-blue-500/40 transition-all appearance-none cursor-pointer">
                    <option value="" className="bg-slate-900">Grade</option>
                    {GRADES.map(g => <option key={g} value={g} className="bg-slate-900">{g}</option>)}
                  </select>
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </div>
                {sem.courses.length > 1 && (
                  <button onClick={() => removeCourse(si, ci)} className="text-red-400/30 hover:text-red-400 text-xs transition-colors">✕</button>
                )}
              </div>
            ))}

            <button onClick={() => addCourse(si)}
              className="text-xs font-semibold text-blue-400/60 hover:text-blue-400 transition-colors">
              + Add Course
            </button>
          </div>
        ))}

        <button onClick={addSemester}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-white/8 text-sm font-semibold text-slate-400 hover:text-white hover:border-white/15 transition-all duration-200">
          + Add Semester
        </button>

        {/* Cumulative Result */}
        {totalCredits > 0 && (
          <div ref={resultRef} className="rounded-3xl border-2 border-blue-500/15 bg-gradient-to-br from-blue-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Cumulative GPA</h3>
              </div>
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:border-white/15 transition-all active:scale-95">
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>

            <div className="text-center mb-6">
              <div className={`text-6xl font-extrabold tracking-tight ${gradeTextColor(cumulativeGPA)}`}>
                <AnimatedNumber value={cumulativeGPA} decimals={2} />
              </div>
              <div className="text-xs text-slate-500 mt-2">{totalCredits} total credits</div>
            </div>

            {/* Scale bar */}
            <div className="mb-5">
              <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
                  style={{ width: `${Math.min(barWidth, 100)}%` }} />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-slate-600">
                <span>0.0</span><span>{weighted ? '5.0' : '4.0'}</span>
              </div>
            </div>

            {/* Per-semester breakdown */}
            <div className="space-y-1">
              {semesters.map((s, i) => (
                <div key={s.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-slate-400">{s.name || `Semester ${i + 1}`}</span>
                  <span className={`text-sm font-bold ${gradeTextColor(semGPAs[i])}`}>{semGPAs[i].toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalCredits === 0 && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎓</div>
            <p className="text-sm text-slate-600 font-medium">Add courses with grades to calculate your GPA</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
