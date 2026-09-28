import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function credit_score_simulator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [currentScore, setCurrentScore] = useState('')
  const [utilization, setUtilization] = useState('')
  const [missedPayments, setMissedPayments] = useState('')
  const [hardInquiries, setHardInquiries] = useState('')
  const [creditAge, setCreditAge] = useState('')

  const calculate = useCallback(() => {
    const score = parseFloat(currentScore) || 300
    const util = parseFloat(utilization) || 0
    const missed = parseInt(missedPayments) || 0
    const inquiries = parseInt(hardInquiries) || 0
    const age = parseFloat(creditAge) || 0

    let adjustment = 0
    const weakest = []

    // Utilization impact (weight ~30%)
    if (util <= 10) adjustment += 30
    else if (util <= 30) adjustment += 20
    else if (util <= 50) adjustment += 5
    else { adjustment -= 15; weakest.push('utilization') }

    // Missed payments (weight ~35%)
    if (missed === 0) adjustment += 25
    else if (missed === 1) adjustment -= 20
    else if (missed === 2) adjustment -= 40
    else { adjustment -= 55; weakest.push('missed payments') }

    // Hard inquiries (weight ~10%)
    if (inquiries <= 1) adjustment += 5
    else if (inquiries <= 3) adjustment += 0
    else { adjustment -= 15; weakest.push('hard inquiries') }

    // Credit age (weight ~15%)
    if (age >= 10) adjustment += 15
    else if (age >= 5) adjustment += 10
    else if (age >= 2) adjustment += 5
    else { adjustment -= 10; weakest.push('credit age') }

    // Base score contribution
    const baseAdj = score >= 750 ? 10 : score >= 650 ? 0 : score >= 550 ? -10 : -20
    const totalAdj = adjustment + baseAdj

    const simulatedScore = Math.max(300, Math.min(900, Math.round(score + totalAdj)))
    const lowScore = Math.max(300, simulatedScore - 20)
    const highScore = Math.min(900, simulatedScore + 20)

    let grade = ''
    if (simulatedScore >= 750) grade = 'Excellent'
    else if (simulatedScore >= 650) grade = 'Good'
    else if (simulatedScore >= 550) grade = 'Fair'
    else grade = 'Poor'

    // Generate tips based on weaknesses
    const tips = []
    if (weakest.includes('utilization') || util > 30) {
      tips.push('Keep credit utilization below 30% — ideally under 10%. Pay down revolving balances and request credit limit increases without hard pulls.')
    }
    if (weakest.includes('missed payments') || missed > 0) {
      tips.push('Set up autopay or calendar reminders for all credit accounts. A single missed payment can drop your score by 60–110 points and stays on record for 7 years.')
    }
    if (weakest.includes('hard inquiries') || inquiries > 3) {
      tips.push('Limit credit applications — each hard inquiry can lower your score by 5–10 points. Space out applications by at least 6 months.')
    }
    if (weakest.includes('credit age') || age < 2) {
      tips.push('Keep older accounts open even if unused. A longer credit history improves your score — avoid closing your first credit card.')
    }
    if (tips.length === 0) {
      tips.push('Maintain your current habits: low utilization, on-time payments, and a mix of credit types will keep your score strong.')
    }
    if (tips.length < 3) {
      tips.push('Check your credit report for errors at CIBIL, Experian, or Equifax. Dispute any inaccuracies to protect your score.')
    }

    return { simulatedScore, lowScore, highScore, grade, tips }
  }, [currentScore, utilization, missedPayments, hardInquiries, creditAge])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  const gradeColors = {
    Excellent: 'text-emerald-400',
    Good: 'text-sky-400',
    Fair: 'text-amber-400',
    Poor: 'text-rose-400'
  }

  return (
    <ToolLayout
      title="Credit Score Simulator"
      desc="Simulate how changes in utilization, missed payments, hard inquiries, and credit age could shift your credit score across bureau models."
      icon="💳" iconBg="rgba(99,102,241,0.08)"
      category="finance" slug="credit-score-simulator"
      faq={[
        { q: "What is a credit score?", a: "A credit score is a 3-digit number (300–900 in India) that represents your creditworthiness. Lenders use it to decide loan eligibility and interest rates. Key bureaus in India include CIBIL, Experian, and CRIF High Mark." },
        { q: "How does credit utilization affect my score?", a: "Credit utilization is the ratio of your outstanding balance to your total credit limit. High utilization (above 30%) signals risk to lenders and can significantly lower your score. Keeping it under 10% is ideal." },
        { q: "How accurate is this Credit Score Simulator?", a: "This simulator provides an estimated range based on general weighted factors. Actual bureau models (CIBIL, Experian) use proprietary algorithms with additional variables. Use this as a directional guide, not a guaranteed prediction." },
        { q: "How many points does a missed payment drop my score?", a: "A single missed payment can reduce your score by 60–110 points depending on your previous score level. Higher scores tend to drop more. The impact lessens over time but stays on your report for 7 years." },
      ]}
      howItWorks={[
        "Enter your current credit score (300–900 range).",
        "Provide your credit utilization percentage, missed payments count, and hard inquiries.",
        "Enter your average credit age in years.",
        "Click Simulate to see the estimated score range, grade, and personalized improvement tips.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Credit Score Simulator", "applicationCategory": "FinanceApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Current Credit Score</label>
            <input type="number" value={currentScore} onChange={(e) => setCurrentScore(e.target.value)}
              placeholder="e.g. 720" min="300" max="900" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Credit Utilization (%)</label>
            <input type="number" value={utilization} onChange={(e) => setUtilization(e.target.value)}
              placeholder="e.g. 25" min="0" max="100" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Missed Payments (count)</label>
            <input type="number" value={missedPayments} onChange={(e) => setMissedPayments(e.target.value)}
              placeholder="e.g. 1" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Hard Inquiries (last 12 months)</label>
            <input type="number" value={hardInquiries} onChange={(e) => setHardInquiries(e.target.value)}
              placeholder="e.g. 2" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Credit Age (years)</label>
            <input type="number" value={creditAge} onChange={(e) => setCreditAge(e.target.value)}
              placeholder="e.g. 5" min="0" max="50" step="0.5" className={inputClass} />
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Simulate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Simulated Result</h3>
            </div>
            <div className="text-center mb-6">
              <div className="text-5xl font-black text-white mb-1">{result.lowScore} – {result.highScore}</div>
              <div className="text-sm text-slate-400">Estimated Score Range</div>
              <div className={`text-2xl font-bold mt-2 ${gradeColors[result.grade]}`}>{result.grade}</div>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Improvement Tips</h4>
              {result.tips.map((tip, i) => (
                <div key={i} className="flex gap-3 py-2 border-b border-white/5 last:border-0">
                  <span className="text-indigo-400 font-bold mt-0.5">{i + 1}.</span>
                  <span className="text-sm text-slate-300 font-medium">{tip}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-slate-500 text-center leading-relaxed">
              ⚠️ Disclaimer: This is an estimate. Credit bureaus (CIBIL, Experian, CRIF High Mark) use proprietary models with additional variables. Always verify with your official credit report.
            </p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💳</div>
            <p className="text-sm text-slate-600 font-medium">Enter credit details and click Simulate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
