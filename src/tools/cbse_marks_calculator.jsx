import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const SUBJECTS = [
  { name: 'English', max: 100 },
  { name: 'Mathematics', max: 100 },
  { name: 'Science', max: 100 },
  { name: 'Social Science', max: 100 },
  { name: 'Hindi / 2nd Language', max: 100 },
]

function getGrade(pct) {
  if (pct >= 91) return { grade: 'A1', div: 'Distinction', color: 'emerald' }
  if (pct >= 81) return { grade: 'A2', div: 'First Division', color: 'emerald' }
  if (pct >= 71) return { grade: 'B1', div: 'First Division', color: 'blue' }
  if (pct >= 61) return { grade: 'B2', div: 'Second Division', color: 'blue' }
  if (pct >= 51) return { grade: 'C1', div: 'Second Division', color: 'amber' }
  if (pct >= 41) return { grade: 'C2', div: 'Third Division', color: 'amber' }
  if (pct >= 33) return { grade: 'D',  div: 'Pass', color: 'orange' }
  return { grade: 'E', div: 'Fail', color: 'red' }
}

export default function cbse_marks_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [marks, setMarks] = useState(SUBJECTS.map(() => ''))
  const [customSubjects, setCustomSubjects] = useState(false)
  const [customList, setCustomList] = useState([
    { name: 'Subject 1', max: 100, got: '' },
    { name: 'Subject 2', max: 100, got: '' },
    { name: 'Subject 3', max: 100, got: '' },
    { name: 'Subject 4', max: 100, got: '' },
    { name: 'Subject 5', max: 100, got: '' },
  ])

  const result = useMemo(() => {
    const src = customSubjects ? customList : SUBJECTS.map((s, i) => ({ ...s, got: marks[i] }))
    const valid = src.filter(s => s.got !== '' && !isNaN(parseFloat(s.got)))
    if (valid.length === 0) return null

    const totalObtained = valid.reduce((sum, s) => sum + parseFloat(s.got), 0)
    const totalMax = valid.reduce((sum, s) => sum + s.max, 0)
    const pct = (totalObtained / totalMax) * 100
    const { grade, div, color } = getGrade(pct)

    return {
      totalObtained, totalMax, pct: pct.toFixed(1),
      grade, div, color,
      subjectResults: valid.map(s => ({
        name: s.name, got: parseFloat(s.got), max: s.max,
        pct: ((parseFloat(s.got) / s.max) * 100).toFixed(1),
      })),
    }
  }, [marks, customSubjects, customList])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all text-center [color-scheme:dark]"

  return (
    <ToolLayout
      title="CBSE Marks to Percentage Calculator"
      desc="Convert CBSE board exam marks to percentage, grade & division. Supports 5-subject and custom subject lists."
      icon="📝" iconBg="rgba(99,102,241,0.08)"
      category="study" slug="cbse-marks-calculator"
      faq={[
        { q: "How is CBSE percentage calculated?", a: "Add marks of all 5 subjects, divide by total maximum marks (usually 500), multiply by 100. Example: 420/500 × 100 = 84%." },
        { q: "What is CBSE grading system?", a: "A1 (91-100), A2 (81-90), B1 (71-80), B2 (61-70), C1 (51-60), C2 (41-50), D (33-40), E (below 33)." },
        { q: "Is CGPA different from percentage?", a: "Yes. CGPA = average grade points. To convert: Percentage = CGPA × 9.5. This tool calculates percentage directly from marks." },
      ]}
      howItWorks={[
        "Enter marks for each of the 5 CBSE subjects (out of 100).",
        "See your percentage, grade, and division update instantly.",
        "Switch to 'Custom Subjects' if you have more or fewer than 5.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "CBSE Marks to Percentage Calculator", "applicationCategory": "EducationalApplication",
        "url": "https://www.uptools.in/cbse-marks-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex gap-2 mb-2">
          <button onClick={() => setCustomSubjects(false)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${!customSubjects ? 'bg-indigo-500 text-white' : 'bg-white/[0.06] border border-white/8 text-slate-400'}`}>
            5 Standard Subjects
          </button>
          <button onClick={() => setCustomSubjects(true)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${customSubjects ? 'bg-indigo-500 text-white' : 'bg-white/[0.06] border border-white/8 text-slate-400'}`}>
            Custom Subjects
          </button>
        </div>

        {!customSubjects ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUBJECTS.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/6">
                <span className="text-xs font-semibold text-slate-400 flex-1">{s.name}</span>
                <input type="number" min="0" max={s.max} value={marks[i]}
                  onChange={e => { const n = [...marks]; n[i] = e.target.value; setMarks(n) }}
                  placeholder={`/ ${s.max}`}
                  className="w-20 bg-white/[0.06] border border-white/8 rounded-lg px-3 py-2 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 text-center [color-scheme:dark]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {customList.map((s, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.04] border border-white/6">
                <input type="text" value={s.name}
                  onChange={e => { const n = [...customList]; n[i] = { ...n[i], name: e.target.value }; setCustomList(n) }}
                  className="flex-1 bg-white/[0.06] border border-white/8 rounded-lg px-3 py-2 text-white text-sm font-semibold outline-none [color-scheme:dark]" />
                <input type="number" min="0" value={s.got}
                  onChange={e => { const n = [...customList]; n[i] = { ...n[i], got: e.target.value }; setCustomList(n) }}
                  placeholder="Got" className="w-16 bg-white/[0.06] border border-white/8 rounded-lg px-3 py-2 text-white text-sm font-semibold outline-none text-center [color-scheme:dark]" />
                <span className="text-xs text-slate-600">/</span>
                <input type="number" min="1" value={s.max}
                  onChange={e => { const n = [...customList]; n[i] = { ...n[i], max: parseInt(e.target.value) || 100 }; setCustomList(n) }}
                  className="w-16 bg-white/[0.06] border border-white/8 rounded-lg px-3 py-2 text-white text-sm font-semibold outline-none text-center [color-scheme:dark]" />
              </div>
            ))}
          </div>
        )}

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="text-5xl font-extrabold text-white mb-1">{result.pct}%</div>
              <div className={`text-sm font-bold text-${result.color}-400 uppercase tracking-wider`}>{result.grade} — {result.div}</div>
              <div className="text-xs text-slate-400 mt-1">Total: {result.totalObtained} / {result.totalMax}</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {result.subjectResults.map((s, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.04] border border-white/6 text-center">
                  <div className="text-[11px] font-semibold text-slate-400 mb-1 truncate">{s.name}</div>
                  <div className="text-lg font-bold text-white">{s.got}<span className="text-xs text-slate-400">/{s.max}</span></div>
                  <div className="text-xs text-slate-400">{s.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
