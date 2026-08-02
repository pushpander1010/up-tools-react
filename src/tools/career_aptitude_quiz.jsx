import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const QUESTIONS = [
  { q: 'Which subjects do you enjoy most?', opts: [
    { text: 'Physics, Chemistry, Maths', tags: ['eng','tech'] },
    { text: 'Biology, Chemistry', tags: ['med','bio'] },
    { text: 'History, Political Science', tags: ['law','govt'] },
    { text: 'Accounts, Business Studies', tags: ['commerce','ca'] },
  ]},
  { q: 'What kind of problems do you like solving?', opts: [
    { text: 'Mathematical & logical puzzles', tags: ['eng','tech'] },
    { text: 'Real-world health & science questions', tags: ['med','bio'] },
    { text: 'Debates & current affairs', tags: ['law','govt','media'] },
    { text: 'Money & business strategy', tags: ['commerce','ca','mba'] },
  ]},
  { q: 'Your ideal work environment?', opts: [
    { text: 'Lab, hospital, or research facility', tags: ['med','bio','research'] },
    { text: 'Tech company or startup', tags: ['eng','tech'] },
    { text: 'Courtroom, parliament, or newsroom', tags: ['law','govt','media'] },
    { text: 'Office with financial charts', tags: ['commerce','ca','mba'] },
  ]},
  { q: 'What motivates you most?', opts: [
    { text: 'Building things & innovation', tags: ['eng','tech'] },
    { text: 'Helping people heal', tags: ['med','bio'] },
    { text: 'Justice & social change', tags: ['law','govt'] },
    { text: 'Earning well & financial growth', tags: ['commerce','ca','mba'] },
  ]},
  { q: 'How do you prefer to study?', opts: [
    { text: 'Diagrams, formulas & experiments', tags: ['eng','med','research'] },
    { text: 'Case studies & analysis', tags: ['law','commerce','mba'] },
    { text: 'Reading & writing essays', tags: ['media','govt','law'] },
    { text: 'Coding & building projects', tags: ['tech','eng'] },
  ]},
  { q: 'Which activity sounds fun?', opts: [
    { text: 'Hackathon or robotics competition', tags: ['tech','eng'] },
    { text: 'Science olympiad or biology quiz', tags: ['med','bio','research'] },
    { text: 'MUN or mock parliament', tags: ['govt','law','media'] },
    { text: 'Business plan competition', tags: ['commerce','mba'] },
  ]},
  { q: 'Where do you see yourself in 10 years?', opts: [
    { text: 'Doctor or healthcare professional', tags: ['med','bio'] },
    { text: 'Software engineer or startup founder', tags: ['tech','eng'] },
    { text: 'IAS officer, lawyer, or journalist', tags: ['govt','law','media'] },
    { text: 'CA, CFO, or investment banker', tags: ['commerce','ca','mba'] },
  ]},
  { q: 'Your strength is?', opts: [
    { text: 'Memorizing & understanding concepts', tags: ['med','bio'] },
    { text: 'Problem-solving & coding', tags: ['tech','eng'] },
    { text: 'Communication & persuasion', tags: ['media','law','govt'] },
    { text: 'Number crunching & analysis', tags: ['commerce','ca','mba'] },
  ]},
]

const CAREER_MAP = {
  eng: { title: 'Engineering / Technology', icon: '⚙️', careers: ['Software Engineer', 'Civil Engineer', 'Data Scientist', 'AI/ML Engineer'], exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE'], courses: ['B.Tech', 'B.E.', 'BCA'], color: 'blue' },
  med: { title: 'Medical / Healthcare', icon: '🏥', careers: ['Doctor (MBBS)', 'Dentist (BDS)', 'Pharmacist', 'Nurse'], exams: ['NEET UG', 'AIIMS', 'JIPMER'], courses: ['MBBS', 'BDS', 'B.Pharma', 'B.Sc Nursing'], color: 'emerald' },
  law: { title: 'Law / Legal Studies', icon: '⚖️', careers: ['Lawyer', 'Judge', 'Legal Advisor', 'Corporate Counsel'], exams: ['CLAT', 'AILET', 'LSAT', 'DU LLB'], courses: ['BA LLB', 'BBA LLB', 'LLB'], color: 'purple' },
  commerce: { title: 'Commerce / Finance', icon: '💰', careers: ['Chartered Accountant', 'Investment Banker', 'Financial Analyst', 'Company Secretary'], exams: ['CA Foundation', 'CS Foundation', 'CMA', 'CUET'], courses: ['B.Com', 'BBA', 'B.Com (Hons)'], color: 'amber' },
  govt: { title: 'Civil Services / Government', icon: '🏛️', careers: ['IAS Officer', 'IPS Officer', 'IFS Officer', 'State PSC Officer'], exams: ['UPSC CSE', 'State PSC', 'SSC CGL', 'Bank PO'], courses: ['Any Graduation + UPSC Prep'], color: 'rose' },
  tech: { title: 'IT / Computer Science', icon: '💻', careers: ['Full Stack Developer', 'Cloud Architect', 'Cybersecurity Analyst', 'DevOps Engineer'], exams: ['JEE Main', 'Bitsat', 'State CET'], courses: ['B.Tech CSE', 'BCA', 'B.Sc IT'], color: 'cyan' },
  bio: { title: 'Biotechnology / Life Sciences', icon: '🧬', careers: ['Biotechnologist', 'Research Scientist', 'Genetic Counselor', 'Bioinformatician'], exams: ['NEET', 'DBT JRF', 'CSIR NET'], courses: ['B.Sc Biotech', 'B.Sc Life Sciences'], color: 'teal' },
  media: { title: 'Media / Journalism', icon: '📰', careers: ['Journalist', 'Content Strategist', 'PR Manager', 'Film Director'], exams: ['IIMC', 'XIC', 'JMI', 'CUET'], courses: ['BA Journalism', 'BJMC', 'Mass Communication'], color: 'orange' },
  research: { title: 'Research / Academia', icon: '🔬', careers: ['Research Scientist', 'Professor', 'R&D Lead', 'Data Analyst'], exams: ['GATE', 'CSIR NET', 'UGC NET', 'JAM'], courses: ['B.Sc', 'M.Sc', 'Integrated MS-PhD'], color: 'indigo' },
  mba: { title: 'MBA / Management', icon: '📊', careers: ['Product Manager', 'Management Consultant', 'Marketing Head', 'Startup Founder'], exams: ['CAT', 'XAT', 'MAT', 'CMAT', 'GMAT'], courses: ['BBA', 'MBA', 'PGDM'], color: 'violet' },
}

export default function career_aptitude_quiz() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [answers, setAnswers] = useState({})
  const [currentQ, setCurrentQ] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const result = useMemo(() => {
    if (!showResult) return null
    const scores = {}
    Object.values(answers).forEach(optTags => {
      optTags.forEach(tag => { scores[tag] = (scores[tag] || 0) + 1 })
    })
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
    const top = sorted.slice(0, 3)
    const total = top.reduce((s, [, v]) => s + v, 0)
    return top.map(([tag, score]) => ({
      ...CAREER_MAP[tag],
      tag,
      score,
      pct: Math.round((score / total) * 100),
    })).filter(Boolean)
  }, [answers, showResult])

  const selectAnswer = useCallback((qIdx, optIdx) => {
    const tags = QUESTIONS[qIdx].opts[optIdx].tags
    setAnswers(prev => ({ ...prev, [qIdx]: tags }))
    if (qIdx < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(qIdx + 1), 300)
    } else {
      setTimeout(() => { setShowResult(true); setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100) }, 300)
    }
  }, [])

  const reset = () => { setAnswers({}); setCurrentQ(0); setShowResult(false) }

  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100

  return (
    <ToolLayout
      title="Career Aptitude Quiz After 12th"
      desc="Answer 8 quick questions to discover the best career path, entrance exams & courses after 12th grade."
      icon="🎯" iconBg="rgba(99,102,241,0.08)"
      category="study" slug="career-aptitude-quiz"
      faq={[
        { q: "How accurate is this quiz?", a: "This is a directional guide based on your interests and strengths. For personalized advice, consult a career counselor." },
        { q: "What careers does it cover?", a: "Engineering, Medical, Law, Commerce, Civil Services, IT, Biotech, Media, Research, and MBA — the main paths after 12th in India." },
        { q: "Can I retake the quiz?", a: "Yes! Click 'Retake Quiz' at any time to start over with fresh answers." },
      ]}
      howItWorks={[
        "Answer 8 quick questions about your interests and strengths.",
        "Instantly see your top 3 matched career paths.",
        "Get specific entrance exams, courses, and career options for each match.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Career Aptitude Quiz After 12th", "applicationCategory": "EducationalApplication",
        "url": "https://www.uptools.in/career-aptitude-quiz/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress bar */}
        <div className="relative h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs text-slate-400 text-center">{Object.keys(answers).length} / {QUESTIONS.length} answered</div>

        {!showResult ? (
          <div className="rounded-3xl border border-white/6 bg-white/[0.02] p-6 sm:p-8">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Question {currentQ + 1} of {QUESTIONS.length}</div>
            <h3 className="text-lg font-bold text-white mb-5">{QUESTIONS[currentQ].q}</h3>
            <div className="space-y-2.5">
              {QUESTIONS[currentQ].opts.map((opt, i) => (
                <button key={i} onClick={() => selectAnswer(currentQ, i)}
                  className={`w-full text-left p-4 rounded-xl border transition-all font-semibold text-sm ${
                    answers[currentQ] === opt.tags
                      ? 'bg-indigo-500/15 border-indigo-500/40 text-white'
                      : 'bg-white/[0.04] border-white/6 text-slate-300 hover:border-indigo-500/30 hover:bg-indigo-500/[0.06]'
                  }`}>
                  {opt.text}
                </button>
              ))}
            </div>
            {currentQ > 0 && (
              <button onClick={() => setCurrentQ(q => q - 1)}
                className="mt-4 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                ← Previous Question
              </button>
            )}
          </div>
        ) : result && (
          <div ref={resultRef} className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-extrabold text-white mb-2">🎯 Your Top Career Matches</h3>
              <p className="text-sm text-slate-400">Based on your answers, here are your best-fit paths.</p>
            </div>

            {result.map((r, i) => (
              <div key={r.tag} className="rounded-3xl border border-white/6 bg-white/[0.02] p-6 overflow-hidden relative">
                {i === 0 && <div className="absolute top-4 right-4 text-xs font-bold bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">#1 Match</div>}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{r.icon}</span>
                  <div>
                    <h4 className="text-lg font-bold text-white">{r.title}</h4>
                    <div className="text-xs text-slate-400">{r.pct}% match</div>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.06] mb-5">
                  <div className={`h-full rounded-full bg-${r.color}-500`} style={{ width: `${r.pct}%` }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/6">
                    <div className="text-[11px] font-bold text-slate-400 uppercase mb-1.5">Careers</div>
                    {r.careers.map((c, j) => <div key={j} className="text-xs text-slate-300">• {c}</div>)}
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/6">
                    <div className="text-[11px] font-bold text-slate-400 uppercase mb-1.5">Entrance Exams</div>
                    {r.exams.map((e, j) => <div key={j} className="text-xs text-slate-300">• {e}</div>)}
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/6">
                    <div className="text-[11px] font-bold text-slate-400 uppercase mb-1.5">Courses</div>
                    {r.courses.map((c, j) => <div key={j} className="text-xs text-slate-300">• {c}</div>)}
                  </div>
                </div>
              </div>
            ))}

            <div className="text-center pt-4">
              <button onClick={reset}
                className="px-6 py-3 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all">
                🔄 Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
