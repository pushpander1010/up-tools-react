import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const QUESTIONS = [
  { id: 'age', q: 'Are you over 45 years of age?', yes: 2 },
  { id: 'bmi', q: 'Is your BMI 25 or above (overweight/obese)?', yes: 2 },
  { id: 'family', q: 'Does a close relative (parent/sibling) have diabetes?', yes: 1 },
  { id: 'gestational', q: 'Were you diagnosed with gestational diabetes during pregnancy?', yes: 2 },
  { id: 'activity', q: 'Do you exercise less than 3 times a week?', yes: 1 },
  { id: 'bp', q: 'Have you been told you have high blood pressure (140/90+)?', yes: 1 },
  { id: 'lipids', q: 'Do you have low HDL cholesterol or high triglycerides?', yes: 1 },
  { id: 'pcos', q: 'Have you been diagnosed with PCOS or metabolic syndrome?', yes: 1 },
  { id: 'history', q: 'Has your blood sugar ever been tested as borderline (100–125 mg/dL fasting)?', yes: 2 },
]

export default function diabetes_risk_checker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [answers, setAnswers] = useState({})

  const handleAnswer = (id, val) => {
    setAnswers(prev => ({ ...prev, [id]: val }))
    jumpTo()
  }

  const allAnswered = Object.keys(answers).length === QUESTIONS.length

  const result = useMemo(() => {
    if (!allAnswered) return null
    let score = 0
    QUESTIONS.forEach(q => {
      if (answers[q.id] === 'yes') score += q.yes
    })
    let level, color, advice
    if (score <= 4) {
      level = 'Low Risk'
      color = 'text-emerald-400'
      advice = 'Your risk factors are minimal. Maintain a healthy lifestyle with regular exercise and balanced diet.'
    } else if (score <= 8) {
      level = 'Moderate Risk'
      color = 'text-amber-400'
      advice = 'You have several risk factors. Consider getting a fasting blood sugar test and HbA1c done. Consult your doctor for a preventive plan.'
    } else {
      level = 'High Risk'
      color = 'text-red-400'
      advice = 'Multiple risk factors are present. Please consult a healthcare professional for blood sugar screening (fasting glucose, HbA1c, OGTT) as soon as possible.'
    }
    return { score, maxScore: 13, level, color, advice }
  }, [answers, allAnswered])

  return (
    <ToolLayout
      title="Diabetes Risk Checker"
      desc="Diabetes Risk Checker - assess your risk of developing Type 2 diabetes based on lifestyle and health factors. Free online questionnaire."
      icon="🩺" iconBg="rgba(239,68,68,0.08)"
      category="health" slug="diabetes-risk-checker"
      faq={[
        { q: 'What is the Diabetes Risk Checker?', a: 'A questionnaire-based tool that evaluates your risk of developing Type 2 diabetes based on common risk factors like age, BMI, family history, and lifestyle.' },
        { q: 'How to use it?', a: 'Answer all 9 yes/no questions about your health and lifestyle. The tool calculates a risk score and classifies it as Low, Moderate, or High.' },
        { q: 'How do I use this Diabetes Risk Checker online free?', a: 'Enter your input above, customize the options, and copy or save the result. Free with no sign-up.' },
        { q: 'How do I save my result?', a: 'Click the copy or download button on your result to save it. Free with no sign-up.' },
        { q: 'Can I use it more than once?', a: 'Yes, unlimited free use. Generate as many results as you need, on any device.' },
        { q: 'Is this Diabetes Risk Checker free?', a: 'Yes, completely free with no sign-up. Use it unlimited times online on any device.' },
      ]}
      howItWorks={[
        'Answer each of the 9 health and lifestyle questions with Yes or No.',
        'The tool assigns weighted scores to each affirmative answer based on medical risk factors.',
        'Your total score is compared against thresholds to determine Low, Moderate, or High risk.',
        'Review your risk level and recommended next steps for screening or lifestyle changes.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Diabetes Risk Checker", "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/diabetes-risk-checker/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Disclaimer */}
        <div className="bg-red-500/[0.08] border border-red-500/20 rounded-2xl p-4">
          <p className="text-xs text-red-300 font-semibold">
            ⚠️ NOT MEDICAL ADVICE — This tool is for educational and informational purposes only. It is not a substitute for professional medical diagnosis, advice, or treatment. Always consult a qualified healthcare provider for medical concerns.
          </p>
        </div>

        {/* Questions */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-3">
          {QUESTIONS.map((q, i) => (
            <div key={q.id} className="flex items-center justify-between gap-4 py-2 border-b border-white/[0.05] last:border-0">
              <span className="text-sm text-slate-300 font-medium flex-1">
                <span className="text-slate-500 font-bold mr-2">{i + 1}.</span>{q.q}
              </span>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleAnswer(q.id, 'no')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${answers[q.id] === 'no' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08] hover:border-white/[0.15]'}`}>
                  No
                </button>
                <button onClick={() => handleAnswer(q.id, 'yes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${answers[q.id] === 'yes' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08] hover:border-white/[0.15]'}`}>
                  Yes
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Your Result</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                <div className="text-2xl font-extrabold text-indigo-400">{result.score}/{result.maxScore}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Risk Score</div>
              </div>
              <div className="p-3 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                <div className={`text-2xl font-extrabold ${result.color}`}>{result.level}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Risk Level</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-black/20 border border-white/[0.05]">
              <p className="text-sm text-slate-300 font-medium">{result.advice}</p>
            </div>
            <p className="text-[10px] text-slate-500 mt-3">
              ⚠️ NOT MEDICAL ADVICE. This is a general risk assessment based on publicly available risk factors. It does not diagnose diabetes. Please consult a healthcare professional for proper evaluation.
            </p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🩺</div>
            <p className="text-sm text-slate-600 font-medium">Answer all 9 questions to see your risk level</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
