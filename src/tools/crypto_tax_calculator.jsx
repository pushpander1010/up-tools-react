import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmtINR = (n) => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '–'

export default function crypto_tax_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [saleValue, setSaleValue] = useState('')
  const [purchaseCost, setPurchaseCost] = useState('')

  const calculate = useCallback(() => {
    const sale = parseFloat(saleValue) || 0
    const cost = parseFloat(purchaseCost) || 0
    if (sale <= 0) return null

    const profit = sale - cost
    const taxOnProfit = Math.max(0, profit * 0.30)
    const cess = taxOnProfit * 0.04
    const totalTax = taxOnProfit + cess
    const tds = sale * 0.01
    const netReceived = sale - cost - totalTax - tds
    const effectiveTaxPct = sale > 0 ? ((totalTax + tds) / sale * 100) : 0

    return { profit, taxOnProfit, cess, totalTax, tds, netReceived, effectiveTaxPct }
  }, [saleValue, purchaseCost])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Crypto Tax Calculator India"
      desc="Calculate India crypto tax under Section 115BBH — 30% on gains + 4% cess, 1% TDS on sale value. Free online calculator for VDA tax."
      icon="🪙" iconBg="rgba(251,191,36,0.08)"
      category="finance" slug="crypto-tax-calculator"
      faq={[
        { q: "How is crypto taxed in India?", a: "Virtual Digital Assets (VDA) are taxed at a flat 30% under Section 115BBH on gains, plus 4% cess. Additionally, 1% TDS applies on the sale/transfer value under Section 194S." },
        { q: "Can I offset crypto losses against other income?", a: "No. Under current Indian tax law, losses from crypto cannot be set off against any other income, including gains from other crypto. Only the cost of acquisition is allowed as a deduction." },
        { q: "What is TDS on crypto in India?", a: "1% TDS is deducted on the sale or transfer value of crypto (VDA) at the time of transaction. This TDS can be claimed as credit while filing your income tax return." },
        { q: "Is this Crypto Tax Calculator India accurate?", a: "This calculator uses the flat 30% + 4% cess + 1% TDS rules as per current Indian tax law. Consult a CA for your specific situation." },
      ]}
      howItWorks={[
        "Enter the total sale/transfer value of your crypto in INR.",
        "Enter your total purchase cost (cost of acquisition) in INR.",
        "Click Calculate to see your tax breakdown instantly.",
        "Review the 30% tax, 4% cess, 1% TDS, and net received amount.",
        "Note: losses cannot be set off — only cost of acquisition is deducted.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Crypto Tax Calculator India", "applicationCategory": "FinanceApplication",
        "operatingSystem": "WebBrowser",
        "url": "https://www.uptools.in/crypto-tax-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Total Sale Value (₹)</label>
            <input type="number" value={saleValue} onChange={(e) => setSaleValue(e.target.value)}
              placeholder="e.g. 500000" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Total Purchase Cost (₹)</label>
            <input type="number" value={purchaseCost} onChange={(e) => setPurchaseCost(e.target.value)}
              placeholder="e.g. 300000" min="0" className={inputClass} />
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-400 transition-all duration-200 active:scale-[0.98]">
          Calculate Tax
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Tax Breakdown</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Profit / (Loss)', value: fmtINR(result.profit), color: result.profit >= 0 ? 'text-emerald-400' : 'text-rose-400' },
                { label: 'Tax @ 30% on Profit', value: fmtINR(result.taxOnProfit), color: 'text-white' },
                { label: 'Health & Education Cess @ 4%', value: fmtINR(result.cess), color: 'text-white' },
                { label: 'Total Income Tax', value: fmtINR(result.totalTax), color: 'text-amber-400' },
                { label: 'TDS @ 1% on Sale Value', value: fmtINR(result.tds), color: 'text-white' },
                { label: 'Net Received', value: fmtINR(result.netReceived), color: result.netReceived >= 0 ? 'text-emerald-400' : 'text-rose-400' },
                { label: 'Effective Tax Rate', value: `${result.effectiveTaxPct.toFixed(1)}%`, color: 'text-amber-400' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600 italic mt-4">
              Note: Losses from crypto cannot be set off against any other income source under Section 115BBH.
            </p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🪙</div>
            <p className="text-sm text-slate-600 font-medium">Enter sale value and purchase cost to see tax</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
