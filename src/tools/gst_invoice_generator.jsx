import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = v => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(v || 0)

function calcGST(amount, rate, type) {
  const a = Math.max(0, Number(amount || 0))
  const r = Math.max(0, Number(rate || 0))
  const gst = a * r / 100
  if (type === 'intra') {
    return {
      taxableAmount: a, gstTotal: gst,
      halfRate: r / 2, cgst: gst / 2, sgst: gst / 2,
      grandTotal: a + gst, type: 'intra'
    }
  }
  return {
    taxableAmount: a, gstTotal: gst,
    igstRate: r, igst: gst,
    grandTotal: a + gst, type: 'inter'
  }
}

export default function gst_invoice_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [amount, setAmount] = useState('1000')
  const [rate, setRate] = useState('12')
  const [type, setType] = useState('intra')
  const [showResult, setShowResult] = useState(false)

  const result = useMemo(() => calcGST(amount, rate, type), [amount, rate, type])

  const handleGenerate = () => {
    setShowResult(true)
    jumpTo()
  }

  const inputClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]'

  return (
    <ToolLayout
      title="GST Invoice Generator"
      desc="Generate a GST-compliant invoice total: item amount, CGST, SGST/IGST and grand total — instantly."
      icon="🧾" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="gst-invoice-generator"
      faq={[
        { q: 'Does it split CGST and SGST?', a: 'Yes — for intra-state sales it shows CGST + SGST; for inter-state, IGST.' },
        { q: 'Is the output downloadable?', a: 'The totals are shown instantly; you can copy them for your invoice.' },
        { q: 'Is it free?', a: 'Yes, free and private.' },
      ]}
      howItWorks={[
        'Enter the taxable amount and select GST rate.',
        'Choose supply type: Intra-state (CGST+SGST) or Inter-state (IGST).',
        'Click Generate to see the invoice breakdown.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'GST Invoice Generator', applicationCategory: 'UtilityApplication',
        url: 'https://www.uptools.in/gst-invoice-generator/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Taxable Amount (₹)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="1000" min="0"
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">GST Rate %</label>
            <select value={rate} onChange={e => setRate(e.target.value)}
              className={`${inputClass} [color-scheme:dark]`}>
              {[5, 12, 18, 28].map(r => (
                <option key={r} value={r} className="bg-gray-900">{r}%</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Supply Type</label>
          <div className="flex gap-2">
            {[
              { value: 'intra', label: 'Intra-state (CGST+SGST)' },
              { value: 'inter', label: 'Inter-state (IGST)' },
            ].map(opt => (
              <button key={opt.value} onClick={() => setType(opt.value)}
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all ${type === opt.value ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleGenerate}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Generate Invoice Total
        </button>

        {showResult && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Invoice Total</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Taxable Amount</span>
                <span className="font-bold text-white">₹{fmt(result.taxableAmount)}</span>
              </div>
              {result.type === 'intra' ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">CGST ({result.halfRate}%)</span>
                    <span className="font-bold text-white">₹{fmt(result.cgst)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">SGST ({result.halfRate}%)</span>
                    <span className="font-bold text-white">₹{fmt(result.sgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">IGST ({result.igstRate}%)</span>
                  <span className="font-bold text-white">₹{fmt(result.igst)}</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="text-slate-400 text-sm">Grand Total</span>
                <span className="text-2xl font-extrabold text-indigo-400">₹{fmt(result.grandTotal)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
