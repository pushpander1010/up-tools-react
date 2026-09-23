import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const POST_GROUPS = {
  'Group A': [
    { post: 'Assistant Audit Officer', minAge: 20, maxAge: 30, edu: 'Bachelor Degree', dept: 'C&AG' },
    { post: 'Assistant Section Officer', minAge: 20, maxAge: 30, edu: 'Bachelor Degree', dept: 'Various Ministries' },
    { post: 'Inspector of Income Tax', minAge: 20, maxAge: 30, edu: 'Bachelor Degree', dept: 'CBDT' },
    { post: 'Inspector (Central Excise)', minAge: 20, maxAge: 30, edu: 'Bachelor Degree', dept: 'CBIC' },
    { post: 'Inspector (Preventive Officer)', minAge: 20, maxAge: 30, edu: 'Bachelor Degree', dept: 'CBIC' },
    { post: 'Inspector (Examiner)', minAge: 20, maxAge: 30, edu: 'Bachelor Degree', dept: 'CBIC' },
    { post: 'Assistant Enforcement Officer', minAge: 20, maxAge: 30, edu: 'Bachelor Degree', dept: 'DRI / ED' },
    { post: 'Sub Inspector (CBI)', minAge: 20, maxAge: 30, edu: 'Bachelor Degree', dept: 'CBI' },
    { post: 'Inspector (Narcotics)', minAge: 18, maxAge: 27, edu: "Bachelor's Degree", dept: 'CBN' },
    { post: 'Assistant Registrar', minAge: 20, maxAge: 30, edu: 'Bachelor Degree', dept: 'Various Tribunals' },
  ],
  'Group B': [
    { post: 'Junior Statistical Officer', minAge: 20, maxAge: 30, edu: 'Bachelor with Statistics/Maths', dept: 'M/o Statistics' },
    { post: 'Assistant Audit Officer (Group B)', minAge: 18, maxAge: 27, edu: "Bachelor's Degree", dept: 'C&AG' },
    { post: 'Divisional Accountant', minAge: 18, maxAge: 27, edu: "Bachelor's Degree", dept: 'C&AG' },
    { post: 'Inspector of Posts', minAge: 18, maxAge: 30, edu: "Bachelor's Degree", dept: 'Dept of Posts' },
    { post: 'Auditor (C&AG)', minAge: 18, maxAge: 27, edu: "Bachelor's Degree", dept: 'C&AG' },
    { post: 'Auditor (Other Ministries)', minAge: 18, maxAge: 27, edu: "Bachelor's Degree", dept: 'Various' },
    { post: 'Tax Assistant (CBDT)', minAge: 18, maxAge: 27, edu: "Bachelor's Degree", dept: 'CBDT' },
    { post: 'Tax Assistant (CBIC)', minAge: 18, maxAge: 27, edu: "Bachelor's Degree", dept: 'CBIC' },
    { post: 'Senior Secretariat Assistant', minAge: 18, maxAge: 27, edu: "Bachelor's Degree", dept: 'Various' },
    { post: 'Upper Division Clerk', minAge: 18, maxAge: 27, edu: "Bachelor's Degree", dept: 'Various' },
  ],
}

const AGE_RELAXATIONS = [
  { category: 'OBC', years: 3 },
  { category: 'SC/ST', years: 5 },
  { category: 'PwD', years: 10 },
  { category: 'Ex-Servicemen', years: 3 },
  { category: 'EWS', years: 0 },
]

function computeAgeAsOnAug1(dob) {
  const birth = new Date(dob)
  const refDate = new Date(new Date().getFullYear(), 7, 1)
  let age = refDate.getFullYear() - birth.getFullYear()
  const monthDiff = refDate.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && refDate.getDate() < birth.getDate())) age--
  return age
}

function eduMeetsRequirement(selectedEdu, reqEdu) {
  const level = { '10th': 1, '12th': 2, 'Diploma': 2.5, "Bachelor's Degree": 3, 'Graduation': 3, "Master's Degree": 4 }
  return (level[selectedEdu] || 0) >= (level[reqEdu] || 0)
}

export default function ssc_cgl_eligibility() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [dob, setDob] = useState('')
  const [category, setCategory] = useState('General')
  const [education, setEducation] = useState("Bachelor's Degree")

  const result = useMemo(() => {
    if (!dob) return null
    const age = computeAgeAsOnAug1(dob)
    const relaxation = AGE_RELAXATIONS.find(r => category.includes(r.category))?.years || 0
    const eligible = []
    const ineligible = []

    for (const [group, posts] of Object.entries(POST_GROUPS)) {
      for (const p of posts) {
        const effectiveMax = p.maxAge + relaxation
        if (age >= p.minAge && age <= effectiveMax && eduMeetsRequirement(education, p.edu)) {
          eligible.push({ ...p, group, effectiveMax })
        } else {
          const reasons = []
          if (age < p.minAge) reasons.push(`Min age ${p.minAge} (you: ${age})`)
          if (age > effectiveMax) reasons.push(`Max age ${effectiveMax} with ${relaxation}yr relaxation (you: ${age})`)
          if (!eduMeetsRequirement(education, p.edu)) reasons.push(`Requires ${p.edu}`)
          ineligible.push({ ...p, group, reasons })
        }
      }
    }
    jumpTo()
    return { age, relaxation, eligible, ineligible }
  }, [dob, category, education])

  return (
    <ToolLayout
      title="SSC CGL Eligibility Checker"
      desc="SSC CGL Eligibility Checker - check your age and education eligibility for all CGL posts. Free online tool, no sign-up."
      icon="📋" iconBg="rgba(34,197,94,0.08)"
      category="education" slug="ssc-cgl-eligibility"
      faq={[
        { q: 'What is the SSC CGL Eligibility Checker?', a: 'A tool that checks your eligibility for SSC CGL posts based on your date of birth, category, and education level as per official SSC CGL notification rules.' },
        { q: 'How is age calculated?', a: 'Age is computed as on August 1 of the examination year, which is the standard reference date used by SSC for CGL age eligibility.' },
        { q: 'What age relaxations are available?', a: 'OBC candidates get 3 years relaxation, SC/ST candidates get 5 years, PwD candidates get 10 years, and Ex-Servicemen get 3 years relaxation in the upper age limit.' },
        { q: 'Is Bachelor\'s Degree sufficient for all posts?', a: 'Most CGL posts require a Bachelor\'s Degree from a recognized university. The Junior Statistical Officer requires Statistics or Mathematics at graduation level.' },
        { q: 'Can I use this for SSC CGL 2026?', a: 'Yes, this checker uses the latest official SSC CGL eligibility criteria. Always verify with the official SSC notification for the specific year you are applying.' },
        { q: 'Is this tool free to use?', a: 'Yes, the SSC CGL Eligibility Checker is completely free to use online with no sign-up required. Use it unlimited times on any device.' },
      ]}
      howItWorks={[
        'Enter your date of birth to calculate your age as on August 1 of the examination year.',
        'Select your category (General, OBC, SC/ST, PwD, Ex-Servicemen, EWS) for applicable age relaxation.',
        'Choose your highest educational qualification from the dropdown.',
        'View eligible posts with group classification and ineligible posts with specific reasons.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "SSC CGL Eligibility Checker", "applicationCategory": "EducationalApplication",
        "url": "https://www.uptools.in/ssc-cgl-eligibility/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Inputs */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Date of Birth</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)}
              className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-green-500/40 transition-all duration-200 [color-scheme:dark]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-green-500/40 transition-all duration-200 [color-scheme:dark]">
              {['General', 'EWS', 'OBC', 'SC', 'ST', 'PwD', 'Ex-Servicemen'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Education Level</label>
            <select value={education} onChange={e => setEducation(e.target.value)}
              className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-green-500/40 transition-all duration-200 [color-scheme:dark]">
              {["Bachelor's Degree", 'Graduation', "Master's Degree", '10th', '12th', 'Diploma'].map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        {/* Result */}
        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-green-500/15 bg-gradient-to-br from-green-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">Eligibility Result</h3>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                <div className="text-2xl font-extrabold text-green-400">{result.age}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Age (as on Aug 1)</div>
              </div>
              <div className="p-3 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                <div className="text-2xl font-extrabold text-emerald-400">{result.relaxation}yr</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Relaxation</div>
              </div>
              <div className="p-3 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                <div className="text-2xl font-extrabold text-amber-400">{result.eligible.length}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Eligible Posts</div>
              </div>
            </div>

            {result.eligible.length > 0 && (
              <div className="mb-5">
                <h4 className="text-xs font-bold text-green-400 uppercase mb-2">Eligible Posts ({result.eligible.length})</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {result.eligible.map((p, i) => (
                    <div key={i} className="p-3 rounded-xl bg-green-500/[0.08] border border-green-500/10">
                      <div className="text-sm font-bold text-white">{p.post}</div>
                      <div className="text-xs text-slate-400 mt-1">{p.group} &middot; {p.dept} &middot; Max Age: {p.effectiveMax}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.ineligible.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-red-400 uppercase mb-2">Not Eligible ({result.ineligible.length})</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {result.ineligible.map((p, i) => (
                    <div key={i} className="p-3 rounded-xl bg-red-500/[0.06] border border-red-500/10">
                      <div className="text-sm font-bold text-white">{p.post}</div>
                      <div className="text-xs text-slate-400 mt-1">{p.group} &middot; {p.dept}</div>
                      <div className="text-xs text-red-300 mt-1">{p.reasons.join('; ')}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📋</div>
            <p className="text-sm text-slate-600 font-medium">Enter your details to check eligibility</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
