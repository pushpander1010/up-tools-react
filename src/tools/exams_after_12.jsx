import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

const EXAMS = [
  { name: 'JEE Main / Advanced', desc: 'Engineering admissions for PCM students.', fit: 'Students aiming for B.Tech and allied engineering programs.', subjects: 'Physics, Chemistry, Mathematics', route: 'NITs, IIITs, IITs, and other engineering colleges' },
  { name: 'NEET UG', desc: 'Primary medical entrance route for PCB students.', fit: 'MBBS, BDS, AYUSH, and many allied health programs.', subjects: 'Physics, Chemistry, Biology', route: 'Medical, dental, and health-sciences colleges' },
  { name: 'CUET UG', desc: 'Broad undergraduate entry route across many universities.', fit: 'Students targeting BA, BCom, BSc, and many domain-based UG courses.', subjects: 'Domain papers chosen by course requirements', route: 'Central universities and participating institutions' },
  { name: 'CLAT / AILET', desc: 'Law entrances for integrated five-year law programs.', fit: 'Students planning BA LLB, BBA LLB, or similar law tracks.', subjects: 'English, reasoning, GK, legal aptitude, and basic math', route: 'National law universities and leading law schools' },
  { name: 'NDA', desc: 'Defence path for students interested in armed forces careers.', fit: 'Candidates interested in Army, Navy, or Air Force officer training.', subjects: 'Mathematics, general ability, SSB interview stages', route: 'National Defence Academy and service-based progression' },
  { name: 'NIFT / NID / UCEED', desc: 'Design-focused entrances for fashion, product, and visual design.', fit: 'Students with strong portfolio, creativity, and design aptitude.', subjects: 'Drawing, observation, design thinking, aptitude, and studio tests', route: 'Fashion, industrial, UX, visual communication, and design schools' },
]

const TABLE = [
  { exam: 'JEE', best: 'Engineering', stream: 'PCM', outcome: 'B.Tech and related programs' },
  { exam: 'NEET UG', best: 'Medicine and allied health', stream: 'PCB', outcome: 'Medical and health-sciences admissions' },
  { exam: 'CUET UG', best: 'General undergraduate admissions', stream: 'All streams', outcome: 'University admissions across many courses' },
  { exam: 'CLAT / AILET', best: 'Law', stream: 'All streams', outcome: 'Integrated law admissions' },
  { exam: 'NDA', best: 'Defence', stream: 'All streams', outcome: 'Officer-entry route' },
  { exam: 'NIFT / NID / UCEED', best: 'Design', stream: 'All streams', outcome: 'Design school admissions' },
]

export default function exams_after_12() {
  return (
    <ToolLayout
      title="Entrance Exams After Class 12"
      desc="Explore major entrance exams after Class 12 including JEE, NEET, CUET, CLAT, NDA, NIFT, and more with eligibility, subjects, and planning tips."
      icon="📝" iconBg="rgba(244,63,94,0.08)"
      category="education" slug="exams-after-12"
      faq={[
        { q: 'What is Entrance Exams After Class 12?', a: 'This page focuses only on exams you can target directly after Class 12. Postgraduate exams such as CAT are intentionally excluded.' },
        { q: 'Is Entrance Exams After Class 12 free to use?', a: 'Yes, completely free. No sign-up or credit card required.' },
      ]}
      howItWorks={[
        'Match the exam to your stream first, then to your target course.',
        'Check subject eligibility before spending time on preparation.',
        'Keep one broad option such as CUET UG alongside specialized entrances.',
        'Use college cutoffs and course outcomes together, not exam brand alone.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Entrance Exams After Class 12", "applicationCategory": "EducationalApplication",
        "url": "https://www.uptools.in/exams-after-12/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Exam Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {EXAMS.map((exam, i) => (
            <div key={i} className="rounded-xl border-2 border-white/8 bg-white/[0.06] p-4">
              <h3 className="font-bold text-white text-sm mb-1">{exam.name}</h3>
              <p className="text-xs text-slate-500 mb-3">{exam.desc}</p>
              <div className="space-y-1.5 text-xs text-slate-400">
                <div><strong className="text-slate-300">Who it fits:</strong> {exam.fit}</div>
                <div><strong className="text-slate-300">Core subjects:</strong> {exam.subjects}</div>
                <div><strong className="text-slate-300">Typical route:</strong> {exam.route}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Planning Table */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6 overflow-x-auto">
          <h2 className="text-lg font-bold text-white mb-4">Exam Planning Table</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left py-2 px-3 text-xs font-bold text-slate-400">Exam</th>
                <th className="text-left py-2 px-3 text-xs font-bold text-slate-400">Best For</th>
                <th className="text-left py-2 px-3 text-xs font-bold text-slate-400">Stream Fit</th>
                <th className="text-left py-2 px-3 text-xs font-bold text-slate-400">Main Outcome</th>
              </tr>
            </thead>
            <tbody>
              {TABLE.map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-2 px-3 text-white font-semibold">{row.exam}</td>
                  <td className="py-2 px-3 text-slate-400">{row.best}</td>
                  <td className="py-2 px-3 text-slate-400">{row.stream}</td>
                  <td className="py-2 px-3 text-slate-400">{row.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-3">Application windows and exam dates change every cycle. Always verify current deadlines on the official exam website before applying.</p>
        </div>

        {/* How to Choose */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
            <h2 className="text-sm font-bold text-white mb-3">How To Choose</h2>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex gap-2"><span className="text-indigo-400 font-bold">•</span>Match the exam to your stream first, then to your target course.</li>
              <li className="flex gap-2"><span className="text-indigo-400 font-bold">•</span>Check subject eligibility before spending time on preparation.</li>
              <li className="flex gap-2"><span className="text-indigo-400 font-bold">•</span>Keep one broad option such as CUET UG alongside specialized entrances.</li>
              <li className="flex gap-2"><span className="text-indigo-400 font-bold">•</span>Use college cutoffs and course outcomes together, not exam brand alone.</li>
            </ul>
          </div>
          <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
            <h2 className="text-sm font-bold text-white mb-3">Related Resources</h2>
            <div className="flex flex-wrap gap-2">
              {[
                ['/cbse-class-12-result/', 'CBSE Class 12 Result Checker'],
                ['/cbse-percentage-calculator/', 'CBSE Percentage Calculator'],
                ['/india-college-rankings/', 'India College Rankings'],
                ['/career-after-12/', 'Career Path After 12'],
                ['/college-course-finder/', 'College Course Finder'],
              ].map(([href, label]) => (
                <a key={href} href={href} className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/8 text-xs text-indigo-400 hover:bg-indigo-500/10 transition-all">{label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
