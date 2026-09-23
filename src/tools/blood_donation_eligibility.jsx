import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const HEALTH_QUESTIONS = [
  { id: 'recentSurgery', label: 'Have you had surgery in the last 6 months?', category: 'surgery' },
  { id: 'recentIllness', label: 'Have you been ill with fever, cold, or infection in the last 2 weeks?', category: 'illness' },
  { id: 'antibiotics', label: 'Are you currently taking antibiotics or have you in the last 2 weeks?', category: 'medication' },
  { id: 'bloodThinner', label: 'Are you taking blood-thinning medication (aspirin, warfarin, etc.)?', category: 'medication' },
  { id: 'tattoo', label: 'Have you got a tattoo or piercing in the last 6 months?', category: 'body_modification' },
  { id: 'hepatitis', label: 'Have you or a close family member had hepatitis B or C?', category: 'disease' },
  { id: 'hiv', label: 'Have you been diagnosed with or are you at risk of HIV/AIDS?', category: 'disease' },
  { id: 'malaria', label: 'Have you had malaria or traveled to a malaria-endemic area in the last 3 months?', category: 'travel' },
  { id: 'pregnant', label: 'Are you currently pregnant or have you been in the last 6 months?', category: 'pregnancy' },
  { id: 'breastfeeding', label: 'Are you currently breastfeeding a child under 12 months?', category: 'pregnancy' },
  { id: 'lowHemoglobin', label: 'Have you been told you have low hemoglobin or anemia?', category: 'blood' },
  { id: 'epilepsy', label: 'Do you have epilepsy or have you had a seizure in the last year?', category: 'neurological' },
  { id: 'heartDisease', label: 'Do you have a history of heart disease or chest pain?', category: 'cardiovascular' },
  { id: 'kidneyDisease', label: 'Do you have kidney disease or a kidney transplant?', category: 'organ' },
  { id: 'lastDonation', label: 'When did you last donate blood? (enter months, 0 if never)', type: 'number' },
]

function checkEligibility(age, weight, answers) {
  const reasons = []
  let eligible = true

  // Age check
  if (age < 18) { eligible = false; reasons.push('Minimum age to donate blood is 18 years.') }
  if (age > 65) { eligible = false; reasons.push('Maximum age for first-time blood donation is typically 65 years (varies by blood bank).') }

  // Weight check
  if (weight < 45) { eligible = false; reasons.push('Minimum weight requirement is 45 kg (approximately 100 lbs).') }

  // Health questionnaire
  const yesAnswers = HEALTH_QUESTIONS.filter(q => {
    if (q.type === 'number') return false
    return answers[q.id] === true
  })

  const criticalYes = yesAnswers.filter(q => ['disease', 'cardiovascular', 'neurological'].includes(q.category))
  if (criticalYes.length > 0) {
    eligible = false
    criticalYes.forEach(q => reasons.push(`You answered YES to: "${q.label}". Consult your doctor before donating.`))
  }

  const cautionYes = yesAnswers.filter(q => ['surgery', 'illness', 'medication', 'body_modification', 'travel', 'pregnancy', 'pregnancy', 'blood'].includes(q.category))
  if (cautionYes.length > 0) {
    reasons.push(`You answered YES to ${cautionYes.length} health question(s). You may need to wait before donating. Check with your blood bank.`)
  }

  // Last donation
  const lastDonationMonths = parseInt(answers.lastDonation)
  if (!isNaN(lastDonationMonths) && lastDonationMonths > 0 && lastDonationMonths < 3) {
    eligible = false
    reasons.push(`Minimum gap between whole blood donations is 3 months. Your last donation was ${lastDonationMonths} month(s) ago.`)
  }

  if (eligible && reasons.length === 0) {
    reasons.push('You appear to meet the basic eligibility criteria for blood donation.')
  }

  return { eligible, reasons }
}

export default function blood_donation_eligibility() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [answers, setAnswers] = useState({})

  const toggleAnswer = (id) => {
    setAnswers(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const result = useMemo(() => {
    const a = parseInt(age), w = parseFloat(weight)
    if (!a || !w) return null
    const r = checkEligibility(a, w, answers)
    jumpTo()
    return r
  }, [age, weight, answers])

  return (
    <ToolLayout
      title="Blood Donation Eligibility Checker"
      desc="Blood Donation Eligibility Checker - check if you are eligible to donate blood based on age, weight, and health. Free online tool, no sign-up."
      icon="🩸" iconBg="rgba(239,68,68,0.08)"
      category="health" slug="blood-donation-eligibility"
      faq={[
        { q: 'What is the Blood Donation Eligibility Checker?', a: 'A tool that helps you determine if you are eligible to donate blood based on your age, weight, and health questionnaire as per standard blood bank guidelines.' },
        { q: 'What is the minimum age and weight to donate blood?', a: 'Most blood banks require donors to be at least 18 years old and weigh at least 45 kg (approximately 100 lbs) to safely donate whole blood.' },
        { q: 'How often can I donate blood?', a: 'For whole blood donation, the minimum interval is typically 3 months (12 weeks) between donations. For platelet donation, it can be as short as 2 weeks.' },
        { q: 'Can I donate if I have a tattoo?', a: 'Many blood banks require a waiting period of 6 months after getting a tattoo or piercing before you can donate blood, depending on local regulations.' },
        { q: 'Is this tool a medical diagnosis?', a: 'No, this tool provides general guidance only. It is not a substitute for professional medical advice. Always consult your doctor or blood bank for definitive eligibility.' },
        { q: 'Is this tool free to use?', a: 'Yes, the Blood Donation Eligibility Checker is completely free to use online with no sign-up required. Use it unlimited times on any device.' },
      ]}
      howItWorks={[
        'Enter your age and body weight to check basic physical eligibility.',
        'Answer the health screening questionnaire about recent medical history.',
        'Review your eligibility result with detailed reasons for any disqualifications.',
        'Use this as a pre-screening guide — final eligibility is determined by the blood bank.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Blood Donation Eligibility Checker", "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/blood-donation-eligibility/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Basic Info */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Age (years)</label>
              <input type="number" min="16" max="80" value={age} onChange={e => setAge(e.target.value)}
                placeholder="e.g. 25"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-red-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Weight (kg)</label>
              <input type="number" min="30" max="200" step="0.1" value={weight} onChange={e => setWeight(e.target.value)}
                placeholder="e.g. 55"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-red-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]" />
            </div>
          </div>
        </div>

        {/* Health Questionnaire */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Health Screening Questionnaire</h3>
          {HEALTH_QUESTIONS.map(q => (
            <div key={q.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-sm text-slate-300 flex-1 mr-3">{q.label}</span>
              {q.type === 'number' ? (
                <input type="number" min="0" max="24" value={answers[q.id] || ''} onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="0"
                  className="w-20 bg-white/[0.06] border-2 border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm font-semibold outline-none focus:border-red-500/40 transition-all [color-scheme:dark] text-center" />
              ) : (
                <button onClick={() => toggleAnswer(q.id)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                    answers[q.id]
                      ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                      : 'bg-white/[0.06] border border-white/[0.08] text-slate-400'
                  }`}>
                  {answers[q.id] ? 'YES' : 'NO'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Result */}
        {result ? (
          <div ref={resultRef} className={`rounded-3xl border-2 p-5 sm:p-6 overflow-hidden ${
            result.eligible
              ? 'border-green-500/15 bg-gradient-to-br from-green-500/[0.06] via-white/[0.01] to-transparent'
              : 'border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent'
          }`} style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full animate-pulse ${result.eligible ? 'bg-green-400' : 'bg-red-400'}`} />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${result.eligible ? 'text-green-400' : 'text-red-400'}`}>
                {result.eligible ? '✅ Eligible to Donate' : '❌ Not Eligible to Donate'}
              </h3>
            </div>

            <div className="space-y-2 mb-5">
              {result.reasons.map((reason, i) => (
                <div key={i} className={`p-3 rounded-xl border text-sm ${
                  result.eligible
                    ? 'bg-green-500/[0.08] border-green-500/10 text-green-200'
                    : 'bg-red-500/[0.08] border-red-500/10 text-red-200'
                }`}>
                  {reason}
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-amber-500/[0.08] border border-amber-500/15">
              <div className="flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <div>
                  <h4 className="text-xs font-bold text-amber-400 uppercase mb-1">Informational Disclaimer</h4>
                  <p className="text-xs text-amber-200/70 leading-relaxed">
                    This tool provides general eligibility guidance only and is NOT a medical diagnosis.
                    Final eligibility is determined by trained medical staff at the blood bank through a
                    physical screening and mini-medical examination. Always consult your doctor or visit
                    your nearest blood donation camp for accurate assessment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🩸</div>
            <p className="text-sm text-slate-600 font-medium">Enter your details and answer the questionnaire</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
