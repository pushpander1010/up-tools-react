import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const COURSES = [
  { stream: 'pcm', interest: 'tech', name: 'B.Tech / B.E.', path: 'Engineering', exam: 'JEE Main, state CETs, private entrances', fit: 'Best for students targeting core engineering, CS, electronics, and related programs.' },
  { stream: 'pcm', interest: 'design', name: 'B.Des / B.Arch / UX pathways', path: 'Design and built environment', exam: 'NID, UCEED, NATA, JEE Paper 2', fit: 'Useful when you like problem-solving but want creative output.' },
  { stream: 'pcb', interest: 'health', name: 'MBBS / BDS / BSc Nursing / Allied Health', path: 'Medical and health sciences', exam: 'NEET UG and institute-specific routes', fit: 'Good for clinical, health-care, and biological science tracks.' },
  { stream: 'commerce', interest: 'business', name: 'B.Com / BBA / CA Foundation', path: 'Business and finance', exam: 'CUET UG, CA Foundation, college-level admission', fit: 'Fits accounting, finance, operations, and entrepreneurship goals.' },
  { stream: 'arts', interest: 'law', name: 'BA LLB / BBA LLB', path: 'Law', exam: 'CLAT, AILET, SLAT and similar exams', fit: 'Works for legal reasoning, policy, and advocacy ambitions.' },
  { stream: 'any', interest: 'public', name: 'BA / BSc / BCom plus UPSC-oriented foundation', path: 'Public service', exam: 'CUET UG and university admissions', fit: 'Use college years to build writing, analysis, and GK depth.' },
  { stream: 'any', interest: 'design', name: 'Animation / Visual Communication / Fashion Design', path: 'Creative programs', exam: 'NIFT, NID, UCEED, portfolio rounds', fit: 'Useful for students with strong creative interest and portfolio potential.' },
]

const SCORE_NOTES = {
  '90': 'You can keep more merit-heavy options open.',
  '75': 'Keep a balanced shortlist of competitive and safe options.',
  '60': 'Prefer a broader mix of colleges and entrance-based routes.',
  '0': 'Prioritize eligibility, course fit, and wide applications.',
}

export default function college_course_finder() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [stream, setStream] = useState('pcm')
  const [interest, setInterest] = useState('tech')
  const [score, setScore] = useState('90')
  const [results, setResults] = useState(null)

  const findCourses = useCallback(() => {
    const found = COURSES.filter(c => (c.stream === stream || c.stream === 'any') && c.interest === interest)
    setResults(found.length ? found : [{ name: 'Broader search needed', path: 'Mixed pathways', exam: 'Check stream-specific and university criteria', fit: 'No exact preset match. Use Career Path After 12 and Entrance Exams After 12 to widen options.' }])
    jumpTo()
  }, [stream, interest, score, jumpTo])

  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="College Course Finder After 12th"
      desc="Find suitable college courses after Class 12 based on stream, interest area, and score band."
      icon="🎓" iconBg="rgba(99,102,241,0.08)"
      category="education" slug="college-course-finder"
      faq={[
        { q: 'What is College Course Finder After 12th?', a: 'Find suitable college courses after Class 12 based on stream, interest area, and score band.' },
        { q: 'Is College Course Finder After 12th free to use?', a: 'Yes, College Course Finder After 12th is completely free. No sign-up or credit card required.' },
      ]}
      howItWorks={[
        'Select your stream (PCM, PCB, Commerce, Arts, Any).',
        'Choose your interest area (Technology, Health, Business, etc.).',
        'Pick your score band and click Find Courses.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "College Course Finder After 12th", "applicationCategory": "EducationalApplication",
        "url": "https://www.uptools.in/college-course-finder/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Stream</label>
              <select value={stream} onChange={e => setStream(e.target.value)} className={selectClass}>
                <option value="pcm">PCM</option>
                <option value="pcb">PCB</option>
                <option value="commerce">Commerce</option>
                <option value="arts">Arts/Humanities</option>
                <option value="any">Any stream</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Interest</label>
              <select value={interest} onChange={e => setInterest(e.target.value)} className={selectClass}>
                <option value="tech">Technology</option>
                <option value="health">Health</option>
                <option value="business">Business</option>
                <option value="law">Law</option>
                <option value="design">Design</option>
                <option value="public">Public service</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Score band</label>
              <select value={score} onChange={e => setScore(e.target.value)} className={selectClass}>
                <option value="90">90%+</option>
                <option value="75">75% to 89%</option>
                <option value="60">60% to 74%</option>
                <option value="0">Below 60%</option>
              </select>
            </div>
          </div>
          <button onClick={findCourses}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            Find Courses
          </button>
        </div>

        {results && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">{results.length} Course{results.length > 1 ? 's' : ''} Found</h3>
            </div>
            <div className="space-y-4">
              {results.map((c, i) => (
                <div key={i} className="rounded-xl border border-white/8 bg-white/[0.04] p-4">
                  <h4 className="font-bold text-white mb-1">{c.name}</h4>
                  <p className="text-xs text-slate-500 mb-2">{c.path}</p>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div><strong className="text-slate-300">Typical entry route:</strong> {c.exam}</div>
                    <div><strong className="text-slate-300">Why it fits:</strong> {c.fit}</div>
                    <div><strong className="text-slate-300">Score note:</strong> {SCORE_NOTES[score]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!results && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎓</div>
            <p className="text-sm text-slate-600 font-medium">Select your stream and interest, then click Find Courses</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
