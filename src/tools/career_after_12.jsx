import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

const STREAMS = [
  { name: 'Engineering', icon: '⚙️', desc: 'Build the future with technology and innovation', courses: ['B.Tech', 'B.E.', 'Diploma'], exams: ['JEE Main', 'JEE Advanced', 'BITSAT'], careers: ['Software Engineer', 'Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer'], duration: '4 years' },
  { name: 'Medical', icon: '🏥', desc: 'Pursue a career in healthcare and medicine', courses: ['MBBS', 'BDS', 'B.Pharma', 'Nursing'], exams: ['NEET', 'AIIMS', 'JIPMER'], careers: ['Doctor', 'Surgeon', 'Dentist', 'Pharmacist', 'Nurse'], duration: '5.5 years (MBBS)' },
  { name: 'Commerce', icon: '💰', desc: 'Master business, finance, and economics', courses: ['B.Com', 'B.B.A.', 'CA', 'CS'], exams: ['CA Foundation', 'CUET UG', 'college-specific admissions'], careers: ['Chartered Accountant', 'Business Analyst', 'Entrepreneur', 'Financial Advisor'], duration: '3-4.5 years' },
  { name: 'Arts/Humanities', icon: '📚', desc: 'Explore culture, history, and social sciences', courses: ['B.A.', 'B.A. (Hons)', 'Journalism', 'Psychology'], exams: ['Various entrance exams', 'UPSC (for civil services)'], careers: ['Journalist', 'Psychologist', 'Historian', 'Civil Servant', 'Teacher'], duration: '3 years' },
  { name: 'Law', icon: '⚖️', desc: 'Study law and pursue a legal career', courses: ['B.A. LLB', 'B.Sc. LLB', 'B.Com. LLB'], exams: ['CLAT', 'AILET', 'LSAT'], careers: ['Advocate', 'Judge', 'Legal Consultant', 'Corporate Lawyer'], duration: '5 years' },
  { name: 'Science', icon: '🔬', desc: 'Pursue research and scientific innovation', courses: ['B.Sc.', 'B.Sc. (Hons)', 'Integrated M.Sc.'], exams: ['Various entrance exams', 'CSIR NET'], careers: ['Scientist', 'Researcher', 'Professor', 'Lab Technician'], duration: '3-5 years' },
]

const CAREERS = [
  { icon: '👨‍⚕️', title: 'Medical Professional', desc: 'Doctor, Surgeon, Dentist, Pharmacist', exam: 'NEET', duration: '5.5 years (MBBS)' },
  { icon: '👨‍💻', title: 'Software Engineer', desc: 'Developer, Data Scientist, AI/ML Engineer', exam: 'JEE Main/Advanced', duration: '4 years (B.Tech)' },
  { icon: '💼', title: 'Business Professional', desc: 'CA, MBA, Entrepreneur', exam: 'CA Foundation, CUET UG', duration: '4.5 years (CA)' },
  { icon: '⚖️', title: 'Lawyer', desc: 'Advocate, Legal Consultant, Judge', exam: 'CLAT, AILET', duration: '5 years (B.A. LLB)' },
  { icon: '🎓', title: 'Academic/Research', desc: 'Professor, Researcher, Scientist', exam: 'Various entrance exams', duration: '3-5 years (Bachelor)' },
  { icon: '🎨', title: 'Creative Professional', desc: 'Designer, Animator, Filmmaker', exam: 'Portfolio-based', duration: '3-4 years' },
]

export default function career_after_12() {
  const [expandedIdx, setExpandedIdx] = useState(null)

  return (
    <ToolLayout
      title="Career Path After Class 12"
      desc="Discover career paths, streams, courses, and entrance exams after Class 12."
      icon="🎯" iconBg="rgba(99,102,241,0.08)"
      category="utility" slug="career-after-12"
      faq={[
        { q: 'Is Career After 12 free?', a: "Yes, it's completely free with no sign-ups required." },
        { q: 'Is Career After 12 private?', a: 'Yes. All calculations run in your browser. No data is uploaded.' },
        { q: 'Does Career After 12 work on mobile?', a: 'Yes. All tools are mobile-responsive and work on any device.' },
      ]}
      howItWorks={[
        'Choose a stream that matches your interests and strengths.',
        'Explore courses, entrance exams, and career options within that stream.',
        'Use the planning tips to make informed decisions about your future.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Career Path After Class 12", "applicationCategory": "EducationalApplication",
        "url": "https://www.uptools.in/career-after-12/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Streams */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <h2 className="text-lg font-bold text-white mb-2">Choose Your Stream</h2>
          <p className="text-sm text-slate-500 mb-4">Click on any stream to explore courses, career options, and entrance exams.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STREAMS.map((s, idx) => (
              <button key={idx} onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                className={`text-left rounded-xl border-2 p-4 transition-all ${expandedIdx === idx ? 'border-indigo-500/40 bg-indigo-500/[0.06]' : 'border-white/8 bg-white/[0.04] hover:border-white/15'}`}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <h3 className="font-bold text-white text-sm">{s.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
                {expandedIdx === idx && (
                  <div className="mt-3 pt-3 border-t border-white/8 space-y-2 text-xs text-slate-400">
                    <div><strong className="text-slate-300">Courses:</strong> {s.courses.join(', ')}</div>
                    <div><strong className="text-slate-300">Entrance Exams:</strong> {s.exams.join(', ')}</div>
                    <div><strong className="text-slate-300">Career Options:</strong> {s.careers.join(', ')}</div>
                    <div><strong className="text-slate-300">Duration:</strong> {s.duration}</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Careers */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <h2 className="text-lg font-bold text-white mb-4">Popular Career Options</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CAREERS.map((c, i) => (
              <div key={i} className="rounded-xl border border-white/8 bg-white/[0.04] p-4">
                <div className="text-2xl mb-2">{c.icon}</div>
                <h3 className="font-bold text-white text-sm">{c.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{c.desc}</p>
                <div className="mt-2 text-xs text-slate-400">
                  <div><strong className="text-slate-300">Exam:</strong> {c.exam}</div>
                  <div><strong className="text-slate-300">Duration:</strong> {c.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Considerations */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <h2 className="text-lg font-bold text-white mb-3">Important Considerations</h2>
          <ul className="space-y-2 text-sm text-slate-400">
            {[
              ['Aptitude & Interest', 'Choose a stream that aligns with your interests and strengths'],
              ['Career Prospects', 'Research job market and salary trends for your chosen field'],
              ['Entrance Exams', 'Prepare well for competitive entrance exams like JEE, NEET, CLAT'],
              ['College Selection', 'Choose colleges based on rankings, placements, and specializations'],
              ['Skill Development', 'Focus on developing both technical and soft skills'],
              ['Internships', 'Gain practical experience through internships during college'],
            ].map(([title, desc], i) => (
              <li key={i} className="flex gap-2">
                <span className="text-indigo-400 font-bold mt-0.5">•</span>
                <div><strong className="text-white">{title}:</strong> {desc}</div>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-white/8">
            <h3 className="text-sm font-bold text-white mb-2">Related Resources</h3>
            <div className="flex flex-wrap gap-2">
              {[
                ['/cbse-class-12-result/', 'Check CBSE Results'],
                ['/india-college-rankings/', 'Explore College Rankings'],
                ['/exams-after-12/', 'Entrance Exams Guide'],
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
