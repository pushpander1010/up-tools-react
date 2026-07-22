import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const NEW_SLABS = [
  { upTo: 300000, rate: 0 },
  { upTo: 700000, rate: 5 },
  { upTo: 1000000, rate: 10 },
  { upTo: 1200000, rate: 15 },
  { upTo: 1500000, rate: 20 },
  { upTo: Infinity, rate: 30 },
]
const OLD_SLABS = [
  { upTo: 250000, rate: 0 },
  { upTo: 500000, rate: 5 },
  { upTo: 1000000, rate: 20 },
  { upTo: Infinity, rate: 30 },
]
const STD_DED = 50000
const REBATE_NEW_LIMIT = 700000
const REBATE_OLD_LIMIT = 500000
const SURCHARGE_BRACKETS = [
  { over: 5000000, rateNew: 25, rateOld: 37 },
  { over: 2000000, rateNew: 15, rateOld: 25 },
  { over: 1000000, rateNew: 15, rateOld: 15 },
  { over: 500000, rateNew: 10, rateOld: 10 },
]

function slabTax(income, slabs) {
  let tax = 0, prev = 0, rem = income
  for (const s of slabs) {
    const w = Math.min(rem, s.upTo - prev)
    if (w > 0) tax += w * (s.rate / 100)
    rem -= w; prev = s.upTo
    if (rem <= 0) break
  }
  return tax
}

function calcHRA(basic, hra, rent, metro) {
  if (!basic || !hra || !rent) return 0
  const a = hra, b = Math.max(0, rent - 0.1 * basic), c = (metro ? 0.5 : 0.4) * basic
  return Math.min(a, b, c)
}

function fmt(n) { return '₹' + Math.round(n).toLocaleString('en-IN') }

export default function income_tax_tool() {
  const [income, setIncome] = useState('')
  const [stdDed, setStdDed] = useState(true)
  const [sec80c, setSec80c] = useState('')
  const [sec80d, setSec80d] = useState('')
  const [nps, setNps] = useState('')
  const [hraRecv, setHraRecv] = useState('')
  const [basic, setBasic] = useState('')
  const [rent, setRent] = useState('')
  const [metro, setMetro] = useState(false)
  const [homeLoan, setHomeLoan] = useState('')

  const inc = parseFloat(income) || 0

  const result = useMemo(() => {
    if (inc <= 0) return null

    // New regime
    let newTaxable = inc - (stdDed ? STD_DED : 0)
    newTaxable = Math.max(0, newTaxable)
    let newTax = slabTax(newTaxable, NEW_SLABS)
    if (newTaxable <= REBATE_NEW_LIMIT) newTax = 0
    let newSurcharge = 0
    for (const b of SURCHARGE_BRACKETS) { if (newTaxable > b.over) newSurcharge = (b.rateNew / 100) * newTax }
    const newCess = (newTax + newSurcharge) * 0.04
    const newTotal = newTax + newSurcharge + newCess

    // Old regime
    const hra = calcHRA(parseFloat(basic) || 0, parseFloat(hraRecv) || 0, parseFloat(rent) || 0, metro)
    const deductions = Math.min(parseFloat(sec80c) || 0, 150000) + (parseFloat(sec80d) || 0) + Math.min(parseFloat(nps) || 0, 50000) + hra + Math.min(parseFloat(homeLoan) || 0, 200000)
    let oldTaxable = inc - deductions - (stdDed ? STD_DED : 0)
    oldTaxable = Math.max(0, oldTaxable)
    let oldTax = slabTax(oldTaxable, OLD_SLABS)
    if (oldTaxable <= REBATE_OLD_LIMIT) oldTax = 0
    let oldSurcharge = 0
    for (const b of SURCHARGE_BRACKETS) { if (oldTaxable > b.over) oldSurcharge = (b.rateOld / 100) * oldTax }
    const oldCess = (oldTax + oldSurcharge) * 0.04
    const oldTotal = oldTax + oldSurcharge + oldCess

    const better = newTotal <= oldTotal ? 'new' : 'old'
    const saving = Math.abs(newTotal - oldTotal)

    return { newTaxable, newTax, newSurcharge, newCess, newTotal, oldTaxable, oldTax, oldSurcharge, oldCess, oldTotal, better, saving, hra }
  }, [inc, stdDed, sec80c, sec80d, nps, hraRecv, basic, rent, metro, homeLoan])

  return (
    <>
      <Helmet>
        <title>Income Tax Calculator India 2024-25 — Old vs New Regime</title>
        <meta name="description" content="Compare old vs new income tax regime. Calculate tax with deductions, HRA, 80C, 80D." />
        <link rel="canonical" href="https://www.uptools.in/income-tax-tool/" />
      </Helmet>

      <nav className="text-xs text-slate-500 mb-4">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-white">Income Tax Calculator</span>
      </nav>

      <section className="glass p-6 mb-6" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(17,24,39,0.6))', borderColor: 'rgba(34,197,94,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>🧾</div>
          <div>
            <h1 className="text-xl font-bold text-white m-0">Income Tax Calculator</h1>
            <p className="text-sm text-slate-400 mt-1">India FY 2024-25 — Old vs New regime comparison</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Income */}
          <div className="glass p-5">
            <label className="text-xs font-medium text-slate-400 mb-2 block">Annual Income (₹)</label>
            <input type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="e.g. 1200000"
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-lg font-semibold outline-none focus:border-green-500/50 transition-colors placeholder:text-slate-600" />
          </div>

          {/* Standard Deduction */}
          <div className="glass p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={stdDed} onChange={e => setStdDed(e.target.checked)} className="w-4 h-4 accent-green-500" />
              <span className="text-sm text-white">Standard Deduction (₹50,000)</span>
            </label>
          </div>

          {/* Old Regime Deductions */}
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-green-400 mb-3">📊 Old Regime Deductions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '80C (max ₹1.5L)', val: sec80c, set: setSec80c },
                { label: '80D (Health Insurance)', val: sec80d, set: setSec80d },
                { label: 'NPS 1B (max ₹50K)', val: nps, set: setNps },
                { label: 'Home Loan Interest', val: homeLoan, set: setHomeLoan },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-[11px] text-slate-500 mb-1 block">{f.label}</label>
                  <input type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder="0"
                    className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-green-500/50" />
                </div>
              ))}
            </div>

            {/* HRA */}
            <div className="mt-4 pt-3 border-t border-white/6">
              <h4 className="text-xs font-medium text-slate-400 mb-2">HRA Exemption</h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">Basic Salary</label>
                  <input type="number" value={basic} onChange={e => setBasic(e.target.value)} placeholder="0"
                    className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">HRA Received</label>
                  <input type="number" value={hraRecv} onChange={e => setHraRecv(e.target.value)} placeholder="0"
                    className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">Rent Paid</label>
                  <input type="number" value={rent} onChange={e => setRent(e.target.value)} placeholder="0"
                    className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none" />
                </div>
              </div>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input type="checkbox" checked={metro} onChange={e => setMetro(e.target.checked)} className="w-3.5 h-3.5 accent-purple-500" />
                <span className="text-xs text-slate-400">Metro city (50% of basic)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Winner Banner */}
              <div className="glass p-5 text-center" style={{ background: `linear-gradient(135deg, ${result.better === 'new' ? 'rgba(99,102,241,0.1)' : 'rgba(34,197,94,0.1)'}, rgba(17,24,39,0.6))` }}>
                <div className="text-xs text-slate-400 mb-1">Better Regime</div>
                <div className="text-2xl font-extrabold gradient-text">{result.better === 'new' ? 'New Regime' : 'Old Regime'}</div>
                <div className="text-sm text-emerald-400 mt-1">Save {fmt(result.saving)}</div>
              </div>

              {/* New Regime */}
              <div className="glass p-4">
                <h3 className="text-sm font-semibold text-brand-light mb-3">New Regime</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Taxable</span><span className="text-white">{fmt(result.newTaxable)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Tax</span><span className="text-white">{fmt(result.newTax)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Surcharge</span><span className="text-white">{fmt(result.newSurcharge)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Cess (4%)</span><span className="text-white">{fmt(result.newCess)}</span></div>
                  <div className="flex justify-between font-bold pt-2 border-t border-white/6"><span className="text-white">Total</span><span className="text-brand-light">{fmt(result.newTotal)}</span></div>
                </div>
              </div>

              {/* Old Regime */}
              <div className="glass p-4">
                <h3 className="text-sm font-semibold text-emerald-400 mb-3">Old Regime</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Taxable</span><span className="text-white">{fmt(result.oldTaxable)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Tax</span><span className="text-white">{fmt(result.oldTax)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Surcharge</span><span className="text-white">{fmt(result.oldSurcharge)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Cess (4%)</span><span className="text-white">{fmt(result.oldCess)}</span></div>
                  <div className="flex justify-between font-bold pt-2 border-t border-white/6"><span className="text-white">Total</span><span className="text-emerald-400">{fmt(result.oldTotal)}</span></div>
                </div>
              </div>
            </>
          ) : (
            <div className="glass p-8 text-center">
              <p className="text-sm text-slate-500">Enter your annual income to compare regimes</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
