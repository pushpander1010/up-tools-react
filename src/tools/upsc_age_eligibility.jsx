import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const CATEGORIES = {
  general: { label: 'General', maxAge: 32, maxAttempts: 6 },
  obc: { label: 'OBC', maxAge: 35, maxAttempts: 9 },
  sc: { label: 'SC', maxAge: 37, maxAttempts: 'Unlimited' },
  st: { label: 'ST', maxAge: 37, maxAttempts: 'Unlimited' },
  ews: { label: 'EWS', maxAge: 32, maxAttempts: 6 },
  pwb: { label: 'PwBD (General)', maxAge: 42, maxAttempts: 9 },
  pwbObc: { label: 'PwBD (OBC)', maxAge: 45, maxAttempts: 'Unlimited' },
  pwbSc: { label: 'PwBD (SC)', maxAge: 47, maxAttempts: 'Unlimited' },
  pwbSt: { label: 'PwBD (ST)', maxAge: 47, maxAttempts: 'Unlimited' },
}

// Unlimited → we store as a large number for computation
const getMaxAttempts = cat => {
  const info = CATEGORIES[cat]
  return info.maxAttempts === 'Unlimited' ? 999 : info.maxAttempts
}

export default function upsc_age_eligibility() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [dob, setDob] = useState('')
  const [category, setCategory] = useState('general')
  const [attemptsUsed, setAttemptsUsed] = useState('')

  const result = useMemo(() => {
    if (!dob) return null
    const birth = new Date(dob)
    if (isNaN(birth.getTime())) return null

    // Age on Aug 1 of current year
    const now = new Date()
    const refDate = new Date(now.getFullYear(), 7, 1) // Aug 1
    let ageYears = refDate.getFullYear() - birth.getFullYear()
    let ageMonths = refDate.getMonth() - birth.getMonth()
    let ageDays = refDate.getDate() - birth.getDate()
    if (ageDays < 0) { ageMonths--; ageDays += 30 }
    if (ageMonths < 0) { ageYears--; ageMonths += 12 }

    const catInfo = CATEGORIES[category]
    const used = parseInt(attemptsUsed) || 0
    const maxAtt = getMaxAttempts(category)
    const attLeft = maxAtt === 999 ? 'Unlimited' : Math.max(0, maxAtt - used)

    const ageOk = ageYears < catInfo.maxAge || (ageYears === catInfo.maxAge && ageMonths === 0 && ageDays === 0)
    const attOk = attLeft === 'Unlimited' || attLeft > 0
    const eligible = ageOk && attOk

    // Find last attempt year
    const birthYear = birth.getFullYear()
    let lastAttemptYear = null
    if (!ageOk) {
      // They were already maxAge on Aug 1 this year — figure out which year
      lastAttemptYear = birthYear + catInfo.maxAge
    }

    return {
      ageYears, ageMonths, ageDays,
      maxAge: catInfo.maxAge,
      categoryLabel: catInfo.label,
      attemptsUsed: used,
      maxAttempts: maxAtt === 999 ? 'Unlimited' : maxAtt,
      attemptsLeft: attLeft,
      eligible,
      ageOk,
      attOk,
      lastAttemptYear,
    }
  }, [dob, category, attemptsUsed])

  return (
    <ToolLayout
      title="UPSC CSE Age Eligibility Checker"
      desc="UPSC CSE Age Eligibility Checker - check if you meet the age and attempt criteria for Civil Services Examination by category. Free online tool."
      icon="📋" iconBg="rgba(34,197,94,0.08)"
      category="education" slug="upsc-age-eligibility"
      faq={[
        { q: 'What is the UPSC CSE Age Eligibility Checker?', a: 'A tool that calculates your age on August 1 of the exam year and tells you whether you meet the age limit and attempt criteria for UPSC Civil Services by category.' },
        { q: 'How to use it?', a: 'Enter your date of birth, select your category (General/OBC/SC/ST/EWS/PwBD), and the number of attempts already taken. The tool shows your eligibility status.' },
        { q: 'How do I use this UPSC CSE Age Eligibility Checker online free?', a: 'Enter your input above, customize the options, and copy or save the result. Free with no sign-up.' },
        { q: 'How do I save my result?', a: 'Click the copy or download button on your result to save it. Free with no sign-up.' },
        { q: 'Can I use it more than once?', a: 'Yes, unlimited free use. Generate as many results as you need, on any device.' },
        { q: 'Is this UPSC CSE Age Eligibility Checker free?', a: 'Yes, completely free with no sign-up. Use it unlimited times online on any device.' },
      ]}
      howItWorks={[
        'Enter your date of birth in DD/MM/YYYY format.',
        'Select your category (General, OBC, SC, ST, EWS, or PwBD variants).',
        'Enter the number of previous attempts you have already taken.',
        'The tool computes your age on August 1 and shows eligibility with attempts remaining.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "UPSC CSE Age Eligibility Checker", "applicationCategory": "EducationApplication",
        "url": "https://www.uptools.in/upsc-age-eligibility/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Inputs */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Date of Birth</label>
            <input type="date" value={dob} onChange={e => { setDob(e.target.value); jumpTo() }}
              className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400 [color-scheme:dark]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Category</label>
            <select value={category} onChange={e => { setCategory(e.target.value); jumpTo() }}
              className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]">
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <option key={k} value={k} className="bg-slate-800">{v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Attempts Already Taken</label>
            <input type="number" min="0" max="20" value={attemptsUsed} onChange={e => { setAttemptsUsed(e.target.value); jumpTo() }}
              placeholder="0"
              className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400" />
          </div>
        </div>

        {/* Results */}
        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full animate-pulse ${result.eligible ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${result.eligible ? 'text-emerald-400' : 'text-red-400'}`}>
                {result.eligible ? 'Eligible ✓' : 'Not Eligible ✗'}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
              {[
                ['Age on Aug 1', `${result.ageYears}y ${result.ageMonths}m ${result.ageDays}d`, 'text-indigo-400'],
                ['Max Age', `${result.maxAge} years`, result.ageOk ? 'text-emerald-400' : 'text-red-400'],
                ['Category', result.categoryLabel, 'text-slate-300'],
                ['Max Attempts', result.maxAttempts, 'text-slate-300'],
                ['Attempts Used', result.attemptsUsed, 'text-amber-400'],
                ['Attempts Left', result.attemptsLeft, result.attOk ? 'text-emerald-400' : 'text-red-400'],
              ].map(([label, val, color]) => (
                <div key={label} className="p-2.5 sm:p-3 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                  <div className={`text-lg sm:text-xl font-extrabold ${color}`}>{val}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">{label}</div>
                </div>
              ))}
            </div>
            {!result.ageOk && (
              <p className="text-xs text-red-400/80 mt-2">
                You exceeded the age limit on Aug 1. Last eligible exam year was {result.lastAttemptYear}.
              </p>
            )}
            <p className="text-[10px] text-slate-500 mt-3">
              Based on official UPSC CSE rules. Age is computed as on 1st August of the exam year. SC/ST and PwBD categories have no upper limit on attempts (subject to age). Always verify with the latest UPSC notification.
            </p>
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
