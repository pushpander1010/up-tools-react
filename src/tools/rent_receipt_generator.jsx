import { useState, useMemo, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

export default function rent_receipt_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const receiptRef = useRef(null)
  const [tenant, setTenant] = useState('')
  const [landlord, setLandlord] = useState('')
  const [rent, setRent] = useState('')
  const [month, setMonth] = useState('')
  const [fy, setFy] = useState('')
  const [receipts, setReceipts] = useState([])

  const fyMonths = useMemo(() => {
    if (!fy) return []
    const parts = fy.split('-')
    if (parts.length !== 2) return []
    const startYear = parseInt(parts[0])
    const endYear = parseInt(parts[1])
    const result = []
    for (let m = 3; m < 12; m++) result.push({ month: MONTHS[m], year: startYear })
    for (let m = 0; m < 3; m++) result.push({ month: MONTHS[m], year: endYear })
    return result
  }, [fy])

  const totalHra = useMemo(() => {
    return receipts.reduce((sum, r) => sum + (parseInt(r.rent) || 0), 0)
  }, [receipts])

  const addReceipt = () => {
    if (!tenant || !landlord || !rent || !month || !fy) return
    const fyMonth = fyMonths.find(f => f.month === month)
    setReceipts(prev => [...prev, {
      id: Date.now(), tenant, landlord, rent: parseInt(rent),
      month, year: fyMonth ? fyMonth.year : new Date().getFullYear(), fy
    }])
    setRent(''); setMonth('')
    jumpTo()
  }

  const removeReceipt = (id) => setReceipts(prev => prev.filter(r => r.id !== id))

  const printReceipt = (r) => {
    const w = window.open('', '_blank')
    w.document.write(`<!DOCTYPE html><html><head><title>Rent Receipt</title>
      <style>body{font-family:Arial,sans-serif;max-width:600px;margin:40px auto;padding:20px;border:2px solid #333}
      h2{text-align:center;border-bottom:2px solid #333;padding-bottom:10px}
      table{width:100%;margin:15px 0}td{padding:8px 0;font-size:14px}
      .sign{text-align:right;margin-top:60px;font-size:13px}</style></head><body>
      <h2>RENT RECEIPT</h2>
      <table><tr><td><b>Date:</b></td><td>${new Date().toLocaleDateString('en-IN')}</td></tr>
      <tr><td><b>Received from:</b></td><td>${r.tenant}</td></tr>
      <tr><td><b>Amount:</b></td><td>₹${r.rent.toLocaleString('en-IN')}/-</td></tr>
      <tr><td><b>Month:</b></td><td>${r.month} ${r.year}</td></tr>
      <tr><td><b>FY:</b></td><td>${r.fy}</td></tr>
      <tr><td><b>Mode:</b></td><td>Cash / UPI</td></tr></table>
      <p>Received rent amount of ₹${r.rent.toLocaleString('en-IN')} for the month of ${r.month} ${r.year}.</p>
      <div class="sign"><p>${r.landlord}</p><p>Landlord</p></div>
      </body></html>`)
    w.document.close(); w.print()
  }

  const hasData = tenant && landlord && fy

  return (
    <ToolLayout
      title="Rent Receipt Generator"
      desc="Rent Receipt Generator - create printable rent receipts with HRA total for tenants and landlords, online free. Free online, no sign-up. Works on any device."
      icon="🏠" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="rent-receipt-generator"
      faq={[
        { q: 'What is Rent Receipt Generator?', a: 'A tool to create monthly rent receipts for HRA claims, with a running total for the financial year.' },
        { q: 'How do I generate rent receipts?', a: 'Enter tenant, landlord, monthly rent, select month and FY, then click Add Receipt. Print individual receipts or view the FY total.' },
        { q: 'How do I use this Rent Receipt Generator online free?', a: 'Enter your input above, customize the options, and copy or save the result. Free with no sign-up.' },
        { q: 'How do I save my result?', a: 'Click the Print button on any receipt to open a print-ready view you can save as PDF or send to a printer.' },
        { q: 'Can I use it more than once?', a: 'Yes, unlimited free use. Generate as many receipts as you need, on any device.' },
        { q: 'Is this Rent Receipt Generator free?', a: 'Yes, completely free with no sign-up. Use it unlimited times online on any device.' },
      ]}
      howItWorks={[
        'Enter tenant name, landlord name, monthly rent, and select the financial year.',
        'Select the month and click Add Receipt to add it to your FY list.',
        'View the running HRA total across all receipts for the financial year.',
        'Click Print on any receipt to open a printable view — save as PDF or print directly.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Rent Receipt Generator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/rent-receipt-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Inputs */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Tenant Name</label>
              <input value={tenant} onChange={e => setTenant(e.target.value)} placeholder="Tenant name"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-green-500/40 transition-all placeholder:text-slate-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Landlord Name</label>
              <input value={landlord} onChange={e => setLandlord(e.target.value)} placeholder="Landlord name"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-green-500/40 transition-all placeholder:text-slate-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Monthly Rent (₹)</label>
              <input type="number" value={rent} onChange={e => setRent(e.target.value)} placeholder="e.g. 15000"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-green-500/40 transition-all placeholder:text-slate-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Month</label>
              <select value={month} onChange={e => setMonth(e.target.value)}
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-green-500/40 transition-all">
                <option value="">Select</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Financial Year</label>
              <select value={fy} onChange={e => setFy(e.target.value)}
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-green-500/40 transition-all">
                <option value="">Select</option>
                {['2024-25','2025-26','2026-27','2027-28'].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <button onClick={addReceipt} disabled={!tenant || !landlord || !rent || !month || !fy}
            className="w-full py-2.5 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 font-bold text-sm hover:bg-green-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            + Add Receipt
          </button>
        </div>

        {/* FY Receipt List */}
        {receipts.length > 0 && (
          <div ref={resultRef} className="rounded-3xl border-2 border-green-500/15 bg-gradient-to-br from-green-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">FY {fy} — HRA Total: ₹{totalHra.toLocaleString('en-IN')}</h3>
              </div>
            </div>
            <div className="space-y-2">
              {receipts.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/[0.05]">
                  <div>
                    <span className="text-sm font-bold text-white">{r.month} {r.year}</span>
                    <span className="text-xs text-slate-400 ml-3">₹{r.rent.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => printReceipt(r)} className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold hover:bg-indigo-500/30 transition-all">Print</button>
                    <button onClick={() => removeReceipt(r.id)} className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-all">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {receipts.length === 0 && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏠</div>
            <p className="text-sm text-slate-600 font-medium">Add receipts to see your FY HRA total</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
