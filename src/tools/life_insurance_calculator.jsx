import { useMemo, useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = (n) => '₹' + Math.round(n || 0).toLocaleString('en-IN')
const fmtL = (n) => {
  const v = Math.round((n || 0) / 100000)
  return '₹' + v.toLocaleString('en-IN') + ' Lakh'
}

function Field({ label, value, onChange, placeholder, sub }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}{sub && <span className="text-slate-600 font-normal"> {sub}</span>}</label>
      <input type="number" inputMode="numeric" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || '0'}
        className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-sm text-white font-semibold outline-none focus:border-brand/40 transition-all duration-200 placeholder:text-slate-600" />
    </div>
  )
}

// Term premium estimate (₹ per ₹1Lakh sum assured per year, non-smoker male, ~2026 retail)
const TERM_RATE_BY_AGE = {
  25: 85, 26: 88, 27: 91, 28: 94, 29: 97, 30: 100, 31: 105, 32: 110, 33: 115, 34: 120, 35: 130,
  36: 140, 37: 150, 38: 160, 39: 170, 40: 185, 41: 200, 42: 215, 43: 235, 44: 250, 45: 270,
  46: 300, 47: 330, 48: 360, 49: 395, 50: 440, 51: 490, 52: 540, 53: 600, 54: 660, 55: 730,
  56: 810, 57: 900, 58: 995, 59: 1100, 60: 1220,
}
const clampAge = (a) => Math.min(60, Math.max(25, Math.round(a || 30)))

function termPremium(cover, age, tenureYears) {
  const rate = TERM_RATE_BY_AGE[clampAge(age)]
  const tenureFactor = tenureYears >= 30 ? 1.15 : tenureYears >= 25 ? 1.08 : tenureYears >= 20 ? 1.0 : tenureYears >= 15 ? 0.95 : 0.9
  return (cover / 100000) * rate * tenureFactor
}

export default function life_insurance_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()

  // Need-based method inputs
  const [monthlyExpenses, setMonthlyExpenses] = useState('60000')
  const [supportYears, setSupportYears] = useState('25')
  const [spouseIncome, setSpouseIncome] = useState('')
  const [debts, setDebts] = useState('3000000')
  const [goalEducation, setGoalEducation] = useState('2500000')
  const [goalMarriage, setGoalMarriage] = useState('2000000')
  const [inflation, setInflation] = useState('6')
  const [existingCover, setExistingCover] = useState('0')
  const [existingAssets, setExistingAssets] = useState('1000000')

  // HLV method inputs
  const [annualIncome, setAnnualIncome] = useState('1800000')
  const [workingYears, setWorkingYears] = useState('30')
  const [incomeGrowth, setIncomeGrowth] = useState('8')
  const [discountRate, setDiscountRate] = useState('7')
  const [dependentsShare, setDependentsShare] = useState('70')
  const [age, setAge] = useState('30')

  const result = useMemo(() => {
    const exp = (parseFloat(monthlyExpenses) || 0) * 12
    const yrs = parseFloat(supportYears) || 25
    const spouse = (parseFloat(spouseIncome) || 0) * 12
    const debt = parseFloat(debts) || 0
    const edu = parseFloat(goalEducation) || 0
    const mar = parseFloat(goalMarriage) || 0
    const infl = (parseFloat(inflation) || 6) / 100
    const earn = parseFloat(annualIncome) || 0
    const workYrs = parseFloat(workingYears) || 30
    const g = (parseFloat(incomeGrowth) || 8) / 100
    const r = (parseFloat(discountRate) || 7) / 100
    const share = (parseFloat(dependentsShare) || 70) / 100
    const exist = (parseFloat(existingCover) || 0) + (parseFloat(existingAssets) || 0)

    // Needs-based: family expense corpus (inflation-adjusted annuity), reduced by spouse income, plus one-time goals & debts
    const netYearly = Math.max(0, exp - spouse)
    const expenseCorpus = netYearly * (1 + infl) ** Math.min(yrs, 10) * yrs
    const needsMethod = Math.max(0, expenseCorpus + debt + edu * (1 + infl) ** 12 + mar * (1 + infl) ** 16 - exist)
    const needsRounded = Math.max(0, Math.round(needsMethod / 100000) * 100000)

    // HLV: present value of growing income stream allocated to dependents, minus existing cover
    const pvIncome = r === g ? earn * workYrs : earn * (1 - Math.pow((1 + g) / (1 + r), workYrs)) / (r - g)
    const hlV = Math.max(0, pvIncome * share - exist)
    const hlvRounded = Math.max(0, Math.round(hlV / 100000) * 100000)

    const recommended = Math.max(needsRounded, hlvRounded, 5000000)
    const premium = termPremium(recommended, age, Math.min(35, Math.max(10, Math.round(yrs * 0.8))))
    const premiumsByTenure = [15, 20, 25, 30, 35].map(t => ({
      tenure: t,
      premium: Math.round(termPremium(recommended, age, t)),
    }))
    const eightyC = Math.min(premium, 150000)
    const incomeMultiple = earn > 0 ? (recommended / earn).toFixed(1) : '—'
    // cover matrix
    const matrix = [50, 75, 100, 150, 200].map(cL => ({
      cover: cL * 100000,
      p20: Math.round(termPremium(cL * 100000, age, 20)),
      p30: Math.round(termPremium(cL * 100000, age, 30)),
    }))

    return {
      needsRounded, hlvRounded, recommended, premium, premiumsByTenure, eightyC,
      incomeMultiple, matrix, expenseCorpus, hlvRaw: hlV, needsRaw: needsMethod,
    }
  }, [monthlyExpenses, supportYears, spouseIncome, debts, goalEducation, goalMarriage, inflation, existingCover, existingAssets, annualIncome, workingYears, incomeGrowth, discountRate, dependentsShare, age])

  return (
    <ToolLayout
      title="Life Insurance & Term Insurance Calculator India"
      desc="Calculate how much life insurance you need in India — needs-based method and Human Life Value (HLV) method — with term insurance premium estimate, 80C tax saving and cover matrix. Free, no signup."
      icon="🛡️" iconBg="rgba(34,197,94,0.08)"
      category="insurance" slug="life-insurance-calculator"
      faq={[
        { q: 'How much life insurance do I need in India?', a: 'Use the 10–12× annual income rule as a floor, then refine with this calculator: cover family expenses (inflation-adjusted) for 20–30 years, clear all debts, fund child education and marriage, then subtract existing investments and current cover. The tool runs both the needs-based and Human Life Value methods automatically.' },
        { q: 'What is the Human Life Value (HLV) method?', a: 'HLV is the present value of your future earnings that your family depends on. It is your annual income × working years remaining, discounted at a reasonable rate, with only the dependent share (typically 60–70%) counted. Term cover should at least match this.' },
        { q: 'What is the best life insurance: term, ULIP, or endowment?', a: 'Pure term insurance gives the highest cover for the lowest premium and is best for most people. ULIPs and endowment plans mix investment with cover but earn far less than index funds and charge higher mortality costs. Buy term, invest the difference.' },
        { q: 'How much does ₹1 crore term insurance cost?', a: 'Indicatively: ₹1 Cr cover for 30 years at age 30 costs about ₹1.0–1.2 lakh per year ten years ago, but today roughly ₹10,000–14,000 per year in India (non-smoker, good health). Premiums rise sharply with age — buying at 25 vs 40 can halve or double the cost.' },
        { q: 'Is term insurance premium tax-deductible?', a: 'Yes, under Section 80C of the old regime — premiums on term, endowment and unit-linked plans qualify within the overall ₹1.5 lakh 80C limit. The new regime gives no deduction for insurance premiums.' },
        { q: 'When should I buy term insurance?', a: 'As soon as someone depends on your income — marriage, a child, or a home loan are the triggers. The younger and healthier you are, the cheaper the premium. Lock in 25–35 year cover to protect through your earning years.' },
        { q: 'Should term cover include critical illness?', a: 'Yes, if budget allows. A critical illness rider pays a lump sum on diagnosis (cancer, heart attack, stroke) and covers treatment costs your health insurance may not. Compare riders across insurers — they add roughly 15–30% to premium.' },
      ]}
      howItWorks={[
        'Enter your family monthly expenses, support years and spouse income to compute the needs-based cover.',
        'Add debts (home loan etc.) and future goals — child education and marriage, inflated to their future value.',
        'Subtract your existing term cover and investments to find the real gap.',
        'The Human Life Value panel computes cover from your income, growth and working years independently.',
        'Your recommended cover = the higher of the two methods (min ₹50 lakh).',
        'See the indicative term premium at your age for 15–35 year terms and the ₹50L–₹2Cr cover matrix.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Life Insurance & Term Insurance Calculator India", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/life-insurance-calculator/",
        "description": "Life insurance coverage calculator for India with needs-based and Human Life Value methods, term premium estimate, 80C tax saving and cover matrix.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Needs-based inputs */}
        <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.05] space-y-4">
          <h3 className="text-sm font-bold text-slate-300">1️⃣ Needs-Based Method <span className="text-[10px] font-semibold text-slate-500">(expenses + debts + goals)</span></h3>
          <div ref={resultRef} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field label="Monthly Family Expenses" value={monthlyExpenses} onChange={setMonthlyExpenses} />
            <Field label="Years to Support Family" value={supportYears} onChange={setSupportYears} />
            <Field label="Spouse Annual Income (₹)" value={spouseIncome} onChange={setSpouseIncome} sub="subtracted" />
            <Field label="Total Debts (loan balance)" value={debts} onChange={setDebts} />
            <Field label="Child Education Goal (today)" value={goalEducation} onChange={setGoalEducation} />
            <Field label="Marriage Goal (today)" value={goalMarriage} onChange={setGoalMarriage} />
            <Field label="Inflation %" value={inflation} onChange={setInflation} />
            <Field label="Your Age (for premium)" value={age} onChange={setAge} />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.05] space-y-4">
          <h3 className="text-sm font-bold text-slate-300">2️⃣ Human Life Value (HLV) Method <span className="text-[10px] font-semibold text-slate-500">(income-based)</span></h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field label="Annual Income (₹)" value={annualIncome} onChange={setAnnualIncome} />
            <Field label="Working Years Left" value={workingYears} onChange={setWorkingYears} />
            <Field label="Income Growth %" value={incomeGrowth} onChange={setIncomeGrowth} />
            <Field label="Discount Rate %" value={discountRate} onChange={setDiscountRate} />
            <Field label="Dependent Share %" value={dependentsShare} onChange={setDependentsShare} />
            <Field label="Existing Term Cover (₹)" value={existingCover} onChange={setExistingCover} />
            <Field label="Existing Invest & Savings (₹)" value={existingAssets} onChange={setExistingAssets} />
          </div>
        </div>

        {/* Results */}
        {result.recommended > 0 && (
          <div className="space-y-4" style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="p-6 rounded-2xl border-2 border-brand/20 bg-brand/[0.04] text-center">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Recommended Term Cover</div>
              <div className="text-3xl font-extrabold gradient-text">{fmtL(result.recommended)}</div>
              <div className="text-xs text-slate-400 mt-2">
                Needs-based: <b className="text-white">{fmtL(result.needsRounded)}</b> · HLV: <b className="text-white">{fmtL(result.hlvRounded)}</b>
                {result.incomeMultiple !== '—' && <> · ≈ <b className="text-white">{result.incomeMultiple}×</b> your income</>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
                <div className="text-slate-500 mb-1">Indicative annual premium at age {age}</div>
                <div className="text-lg font-extrabold text-white">{fmt(result.premium)}</div>
                <div className="text-[11px] text-slate-500 mt-1">Non-smoker male estimate. 80C deduction (old regime): {fmt(Math.min(result.eightyC, 150000))}</div>
              </div>
              <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
                <div className="text-slate-500 mb-1">Expense corpus built-in (inflation adj.)</div>
                <div className="text-lg font-extrabold text-white">{fmtL(result.expenseCorpus)}</div>
                <div className="text-[11px] text-slate-500 mt-1">HLV present value: {fmtL(result.hlvRaw)}</div>
              </div>
            </div>

            {/* Premium by tenure */}
            <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.04]">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">📅 Annual premium by tenure — {fmtL(result.recommended)} cover</h4>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {result.premiumsByTenure.map(t => (
                  <div key={t.tenure} className="p-3 rounded-xl bg-white/[0.05] border border-white/8">
                    <div className="text-slate-500 mb-1">{t.tenure} yrs</div>
                    <div className="text-white font-bold">₹{Math.round(t.premium).toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cover matrix */}
            <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.04]">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">📊 Cover matrix at age {age} (annual premium)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 text-left">
                      <th className="py-2 pr-3 font-semibold">Sum Assured</th>
                      <th className="py-2 pr-3 font-semibold text-right">20-year term</th>
                      <th className="py-2 font-semibold text-right">30-year term</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.matrix.map(m => (
                      <tr key={m.cover} className="border-t border-white/5">
                        <td className="py-2 pr-3 text-slate-300 font-medium">{fmtL(m.cover)}</td>
                        <td className="py-2 pr-3 text-white font-medium text-right">₹{Math.round(m.p20).toLocaleString('en-IN')}/yr</td>
                        <td className="py-2 text-white font-medium text-right">₹{Math.round(m.p30).toLocaleString('en-IN')}/yr</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-600 mt-3">Premiums are indicative estimates for a healthy non-smoker male and vary by insurer, BMI, lifestyle and health history. Compare at least 3 insurers before buying.</p>
            </div>

            {/* Buying tips */}
            <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.04]">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">💡 Smart buying checklist</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>• Buy <b className="text-slate-200">term, not ULIP/endowment</b> — cover is the goal; invest separately in index funds.</li>
                <li>• Lock cover early — the same ₹1 Cr policy costs ~2× more at 40 than at 25.</li>
                <li>• Disclose health honestly — hidden medical history = claim rejection risk for your family.</li>
                <li>• Add a <b className="text-slate-200">critical illness rider</b> (15–30% extra premium) and consider <b className="text-slate-200">waiver of premium</b>.</li>
                <li>• Use the <b className="text-slate-200">30-day free-look</b> period to cancel if the policy isn't right.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}