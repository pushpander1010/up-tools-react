import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = (v) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(v)

export default function invoice_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [qty, setQty] = useState('10')
  const [rate, setRate] = useState('75')
  const [discount, setDiscount] = useState('10')
  const [tax, setTax] = useState('20')

  const calculate = useCallback(() => {
    const q = parseFloat(qty) || 0
    const r = parseFloat(rate) || 0
    const d = parseFloat(discount) || 0
    const t = parseFloat(tax) || 0

    const subtotal = q * r
    const discountAmount = subtotal * (d / 100)
    const afterDiscount = subtotal - discountAmount
    const taxAmount = afterDiscount * (t / 100)
    const total = afterDiscount + taxAmount

    return { subtotal, discountAmount, afterDiscount, taxAmount, total }
  }, [qty, rate, discount, tax])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Invoice Calculator"
      desc="Calculate invoice totals for client work, consulting, subscriptions or product orders. Add quantity, rate, discount and any tax percentage."
      icon="🧾" iconBg="rgba(99,102,241,0.08)"
      category="finance" slug="invoice-calculator"
      faq={[
        { q: "What does an invoice calculator do?", a: "An invoice calculator totals line items and applies discounts and taxes to show the amount due." },
        { q: "Can I use this for VAT, GST or sales tax?", a: "Yes. Enter the tax percentage that applies to your invoice, whether it is VAT, GST, sales tax or another local rate." },
      ]}
      howItWorks={[
        "Enter the quantity and rate per unit.",
        "Set the discount percentage and tax percentage.",
        "View subtotal, discount, tax, and total due instantly.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Invoice Calculator", "applicationCategory": "BusinessApplication",
        "url": "https://www.uptools.in/invoice-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Quantity</label>
              <input type="number" value={qty} onChange={(e) => setQty(e.target.value)}
                placeholder="Qty" min="0" step="0.01" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Rate per Unit</label>
              <input type="number" value={rate} onChange={(e) => setRate(e.target.value)}
                placeholder="Rate" min="0" step="0.01" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Discount %</label>
              <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)}
                placeholder="0" min="0" max="100" step="0.01" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Tax %</label>
              <input type="number" value={tax} onChange={(e) => setTax(e.target.value)}
                placeholder="0" min="0" step="0.01" className={inputClass} />
            </div>
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Invoice Summary</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Subtotal', value: fmt(result.subtotal), color: 'text-white' },
                { label: 'Discount', value: '-' + fmt(result.discountAmount), color: 'text-rose-400' },
                { label: 'After Discount', value: fmt(result.afterDiscount), color: 'text-white' },
                { label: 'Tax', value: fmt(result.taxAmount), color: 'text-white' },
                { label: 'Total Due', value: fmt(result.total), color: 'text-indigo-400' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🧾</div>
            <p className="text-sm text-slate-600 font-medium">Enter invoice details and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
