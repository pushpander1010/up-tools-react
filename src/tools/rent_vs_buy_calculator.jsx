import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = n => isFinite(n) ? '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 }) : '-'

export default function rent_vs_buy_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [homePrice, setHomePrice] = useState('400000')
  const [downPaymentPct, setDownPaymentPct] = useState('20')
  const [interestRate, setInterestRate] = useState('6.5')
  const [propertyTaxRate, setPropertyTaxRate] = useState('1.2')
  const [homeInsurance, setHomeInsurance] = useState('1500')
  const [hoaFees, setHoaFees] = useState('200')
  const [maintenanceRate, setMaintenanceRate] = useState('1')
  const [monthlyRent, setMonthlyRent] = useState('2000')
  const [rentIncrease, setRentIncrease] = useState('3')
  const [rentersInsurance, setRentersInsurance] = useState('200')
  const [years, setYears] = useState('10')
  const [homeAppreciation, setHomeAppreciation] = useState('3')
  const [investmentReturn, setInvestmentReturn] = useState('7')

  const result = useMemo(() => {
    const hp = parseFloat(homePrice) || 0
    if (hp <= 0) return null
    const dpPct = (parseFloat(downPaymentPct) || 20) / 100
    const ir = (parseFloat(interestRate) || 6.5) / 100
    const ptRate = (parseFloat(propertyTaxRate) || 1.2) / 100
    const hi = parseFloat(homeInsurance) || 0
    const hoa = parseFloat(hoaFees) || 0
    const mRate = (parseFloat(maintenanceRate) || 1) / 100
    const mr = parseFloat(monthlyRent) || 0
    const ri = (parseFloat(rentIncrease) || 3) / 100
    const rIns = parseFloat(rentersInsurance) || 0
    const yrs = parseInt(years) || 10
    const ha = (parseFloat(homeAppreciation) || 3) / 100
    const irReturn = (parseFloat(investmentReturn) || 7) / 100

    // Buying
    const downPayment = hp * dpPct
    const loanAmount = hp - downPayment
    const monthlyRate = ir / 12
    const numPayments = 30 * 12
    const monthlyMortgage = loanAmount > 0 ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1) : 0

    let buyTotalCost = downPayment + (hp * 0.03)
    let hv = hp, lb = loanAmount
    for (let y = 1; y <= yrs; y++) {
      const annualMortgage = monthlyMortgage * 12
      const annualPT = hv * ptRate
      const annualMaint = hv * mRate
      buyTotalCost += annualMortgage + annualPT + hi + annualMaint + (hoa * 12)
      hv *= (1 + ha)
      const intPaid = lb * ir
      const prinPaid = annualMortgage - intPaid
      lb = Math.max(0, lb - prinPaid)
    }
    const homeEquity = hv - lb
    const buyNet = homeEquity - buyTotalCost

    // Renting
    let rentTotalCost = 0, curRent = mr, investments = downPayment
    for (let y = 1; y <= yrs; y++) {
      rentTotalCost += (curRent * 12) + rIns
      investments *= (1 + irReturn)
      curRent *= (1 + ri)
    }
    const rentNet = investments - rentTotalCost

    const buyingBetter = buyNet > rentNet
    const savings = Math.abs(buyNet - rentNet)

    return { buyTotalCost, homeEquity, buyNet, rentTotalCost, investments, rentNet, buyingBetter, savings }
  }, [homePrice, downPaymentPct, interestRate, propertyTaxRate, homeInsurance, hoaFees, maintenanceRate, monthlyRent, rentIncrease, rentersInsurance, years, homeAppreciation, investmentReturn])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Rent vs Buy Calculator"
      desc="Compare the true cost of renting vs buying a home over time. See which option saves you more money."
      icon="🏠" iconBg="rgba(99,102,241,0.08)"
      category="finance" slug="rent-vs-buy-calculator"
      faq={[
        { q: 'Is it better to rent or buy?', a: 'It depends. Buying is better if you plan to stay 5+ years with stable income. Renting is better if you value flexibility.' },
        { q: 'What is the 5% rule?', a: 'If annual rent is less than 5% of the home price, renting is likely cheaper.' },
      ]}
      howItWorks={[
        'Enter home purchase details: price, down payment, interest rate, taxes.',
        'Enter rental details: monthly rent, increase rate, insurance.',
        'View side-by-side comparison with total costs and net position.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Rent vs Buy Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/rent-vs-buy-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Home Purchase Details</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Home Price ($)</label>
              <input type="number" value={homePrice} onChange={e => setHomePrice(e.target.value)} step="5000" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Down Payment (%)</label>
              <input type="number" value={downPaymentPct} onChange={e => setDownPaymentPct(e.target.value)} min="0" max="100" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={e => setInterestRate(e.target.value)} step="0.1" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Property Tax (%/yr)</label>
              <input type="number" value={propertyTaxRate} onChange={e => setPropertyTaxRate(e.target.value)} step="0.1" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Home Insurance ($/yr)</label>
              <input type="number" value={homeInsurance} onChange={e => setHomeInsurance(e.target.value)} step="100" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">HOA Fees ($/mo)</label>
              <input type="number" value={hoaFees} onChange={e => setHoaFees(e.target.value)} step="50" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Maintenance (%/yr)</label>
              <input type="number" value={maintenanceRate} onChange={e => setMaintenanceRate(e.target.value)} step="0.1" className={inputClass} />
            </div>
          </div>

          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mt-4">Rental Details</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Monthly Rent ($)</label>
              <input type="number" value={monthlyRent} onChange={e => setMonthlyRent(e.target.value)} step="100" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Annual Rent Increase (%)</label>
              <input type="number" value={rentIncrease} onChange={e => setRentIncrease(e.target.value)} step="0.5" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Renters Insurance ($/yr)</label>
              <input type="number" value={rentersInsurance} onChange={e => setRentersInsurance(e.target.value)} step="50" className={inputClass} />
            </div>
          </div>

          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mt-4">Other Factors</div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Years</label>
              <input type="number" value={years} onChange={e => setYears(e.target.value)} min="1" max="30" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Home Appreciation (%)</label>
              <input type="number" value={homeAppreciation} onChange={e => setHomeAppreciation(e.target.value)} step="0.5" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Investment Return (%)</label>
              <input type="number" value={investmentReturn} onChange={e => setInvestmentReturn(e.target.value)} step="0.5" className={inputClass} />
            </div>
          </div>

          <button onClick={() => { if (result) jumpTo() }}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            Compare Rent vs Buy
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Comparison Results</h3>
            </div>
            <div className="text-center mb-4">
              <div className="text-2xl font-extrabold text-white">
                {result.buyingBetter ? '💰 Buying is Better' : '🏠 Renting is Better'}
              </div>
              <p className="text-sm text-slate-400 mt-1">You save {fmt(result.savings)} by {result.buyingBetter ? 'buying' : 'renting'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border ${result.buyingBetter ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-white/[0.08] bg-white/[0.03]'}`}>
                <h4 className="text-sm font-bold text-white mb-3">💰 Buying</h4>
                {[
                  { label: 'Total Cost', value: fmt(result.buyTotalCost), color: 'text-rose-400' },
                  { label: 'Home Equity', value: fmt(result.homeEquity), color: 'text-emerald-400' },
                  { label: 'Net Position', value: fmt(result.buyNet), color: 'text-white' },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/[0.04] last:border-0">
                    <span className="text-xs text-slate-400">{r.label}</span>
                    <span className={`text-xs font-bold ${r.color}`}>{r.value}</span>
                  </div>
                ))}
              </div>
              <div className={`p-4 rounded-xl border ${!result.buyingBetter ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-white/[0.08] bg-white/[0.03]'}`}>
                <h4 className="text-sm font-bold text-white mb-3">🏠 Renting</h4>
                {[
                  { label: 'Total Cost', value: fmt(result.rentTotalCost), color: 'text-rose-400' },
                  { label: 'Investments', value: fmt(result.investments), color: 'text-emerald-400' },
                  { label: 'Net Position', value: fmt(result.rentNet), color: 'text-white' },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/[0.04] last:border-0">
                    <span className="text-xs text-slate-400">{r.label}</span>
                    <span className={`text-xs font-bold ${r.color}`}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏠</div>
            <p className="text-sm text-slate-600 font-medium">Enter details to compare renting vs buying</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
