import { useState, useMemo, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const EARNINGS = [
  { key: 'basic', label: 'Basic Salary' },
  { key: 'hra', label: 'HRA' },
  { key: 'conveyance', label: 'Conveyance Allowance' },
  { key: 'medical', label: 'Medical Allowance' },
  { key: 'special', label: 'Special Allowance' },
  { key: 'bonus', label: 'Bonus' },
]
const DEDUCTIONS = [
  { key: 'pf', label: 'PF' },
  { key: 'esi', label: 'ESI' },
  { key: 'tds', label: 'TDS' },
  { key: 'loan', label: 'Loan Deduction' },
]

export default function salary_slip_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const slipRef = useRef(null)
  const [employee, setEmployee] = useState('')
  const [empId, setEmpId] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [earnings, setEarnings] = useState({ basic: '', hra: '', conveyance: '', medical: '', special: '', bonus: '' })
  const [deductions, setDeductions] = useState({ pf: '', esi: '', tds: '', loan: '' })

  const totalEarnings = useMemo(() => Object.values(earnings).reduce((s, v) => s + (parseInt(v) || 0), 0), [earnings])
  const totalDeductions = useMemo(() => Object.values(deductions).reduce((s, v) => s + (parseInt(v) || 0), 0), [deductions])
  const netPay = useMemo(() => totalEarnings - totalDeductions, [totalEarnings, totalDeductions])

  const updateEarning = (key, val) => setEarnings(prev => ({ ...prev, [key]: val }))
  const updateDeduction = (key, val) => setDeductions(prev => ({ ...prev, [key]: val }))

  const hasData = employee && (totalEarnings > 0 || totalDeductions > 0)

  const printSlip = () => {
    const w = window.open('', '_blank')
    w.document.write(`<!DOCTYPE html><html><head><title>Salary Slip</title>
      <style>body{font-family:Arial,sans-serif;max-width:650px;margin:40px auto;padding:20px}
      h2{text-align:center;border-bottom:2px solid #333;padding-bottom:10px}
      table{width:100%;border-collapse:collapse;margin:10px 0}
      th,td{padding:8px 10px;border:1px solid #ccc;font-size:13px}
      th{background:#f5f5f5;text-align:left}
      .total{font-weight:bold;background:#f0f0f0}
      .net{font-size:15px;font-weight:bold;text-align:right;margin-top:10px}
      </style></head><body>
      <h2>SALARY SLIP — ${month || ''} ${year || ''}</h2>
      <table><tr><td><b>Employee:</b> ${employee}</td><td><b>ID:</b> ${empId || '-'}</td></tr></table>
      <table><tr><th>Earnings</th><th>Amount (₹)</th><th>Deductions</th><th>Amount (₹)</th></tr>
      ${EARNINGS.map((e,i) => `<tr><td>${e.label}</td><td>₹${(parseInt(earnings[e.key])||0).toLocaleString('en-IN')}</td>
        <td>${DEDUCTIONS[i] ? DEDUCTIONS[i].label : ''}</td><td>${DEDUCTIONS[i] ? '₹'+(parseInt(deductions[DEDUCTIONS[i].key])||0).toLocaleString('en-IN') : ''}</td>`).join('')}
      <tr class="total"><td>Total Earnings</td><td>₹${totalEarnings.toLocaleString('en-IN')}</td>
        <td>Total Deductions</td><td>₹${totalDeductions.toLocaleString('en-IN')}</td></tr></table>
      <p class="net">Net Pay: ₹${netPay.toLocaleString('en-IN')}</p>
      <p style="text-align:right;margin-top:40px;font-size:12px">Authorized Signatory</p>
      </body></html>`)
    w.document.close(); w.print()
  }

  return (
    <ToolLayout
      title="Salary Slip Generator"
      desc="Salary Slip Generator - create professional salary slips with earnings, deductions and net pay, online free. Free online, no sign-up. Works on any device."
      icon="💼" iconBg="rgba(59,130,246,0.08)"
      category="finance" slug="salary-slip-generator"
      faq={[
        { q: 'What is Salary Slip Generator?', a: 'A tool to create professional salary slips showing earnings, deductions, gross pay and net pay.' },
        { q: 'How do I generate a salary slip?', a: 'Enter employee details, month/year, fill in earnings and deductions — the slip auto-calculates gross and net pay. Click Print to save or print.' },
        { q: 'How do I use this Salary Slip Generator online free?', a: 'Enter your input above, customize the options, and copy or save the result. Free with no sign-up.' },
        { q: 'How do I save my result?', a: 'Click the Print button to open a print-ready salary slip — save as PDF or print directly.' },
        { q: 'Can I use it more than once?', a: 'Yes, unlimited free use. Generate as many slips as you need, on any device.' },
        { q: 'Is this Salary Slip Generator free?', a: 'Yes, completely free with no sign-up. Use it unlimited times online on any device.' },
      ]}
      howItWorks={[
        'Enter employee name, employee ID, and select the month and year.',
        'Fill in each earning component — Basic, HRA, Conveyance, Medical, Special, Bonus.',
        'Fill in deductions — PF, ESI, TDS, Loan — gross and net are calculated automatically.',
        'Click Print to open a professional salary slip ready for PDF save or printing.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Salary Slip Generator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/salary-slip-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Employee Details */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Employee Name</label>
              <input value={employee} onChange={e => setEmployee(e.target.value)} placeholder="Employee name"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-blue-500/40 transition-all placeholder:text-slate-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Employee ID</label>
              <input value={empId} onChange={e => setEmpId(e.target.value)} placeholder="e.g. EMP001"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-blue-500/40 transition-all placeholder:text-slate-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Month</label>
              <select value={month} onChange={e => setMonth(e.target.value)}
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-blue-500/40 transition-all">
                <option value="">Select</option>
                {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Year</label>
              <select value={year} onChange={e => setYear(e.target.value)}
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-blue-500/40 transition-all">
                <option value="">Select</option>
                {[2025,2026,2027,2028].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Earnings */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3">Earnings</h3>
          <div className="grid grid-cols-2 gap-3">
            {EARNINGS.map(e => (
              <div key={e.key}>
                <label className="block text-xs font-semibold text-slate-400 mb-1">{e.label}</label>
                <input type="number" value={earnings[e.key]} onChange={ev => updateEarning(e.key, ev.target.value)} placeholder="0"
                  className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-500" />
              </div>
            ))}
          </div>
          <div className="mt-3 text-right text-sm font-bold text-emerald-400">Gross Earnings: ₹{totalEarnings.toLocaleString('en-IN')}</div>
        </div>

        {/* Deductions */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3">Deductions</h3>
          <div className="grid grid-cols-2 gap-3">
            {DEDUCTIONS.map(d => (
              <div key={d.key}>
                <label className="block text-xs font-semibold text-slate-400 mb-1">{d.label}</label>
                <input type="number" value={deductions[d.key]} onChange={ev => updateDeduction(d.key, ev.target.value)} placeholder="0"
                  className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-red-500/40 transition-all placeholder:text-slate-500" />
              </div>
            ))}
          </div>
          <div className="mt-3 text-right text-sm font-bold text-red-400">Total Deductions: ₹{totalDeductions.toLocaleString('en-IN')}</div>
        </div>

        {/* Net Pay */}
        <div ref={resultRef} className="rounded-3xl border-2 border-blue-500/15 bg-gradient-to-br from-blue-500/[0.06] via-white/[0.01] to-transparent p-5"
          style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Net Pay</h3>
            </div>
            <span className="text-2xl font-extrabold text-blue-400">₹{netPay.toLocaleString('en-IN')}</span>
          </div>
          <button onClick={printSlip} disabled={!hasData}
            className="w-full mt-4 py-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold text-sm hover:bg-blue-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            🖨️ Print Salary Slip
          </button>
        </div>
      </div>
    </ToolLayout>
  )
}
