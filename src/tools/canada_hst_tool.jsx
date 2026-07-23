import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = v => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v || 0)

const PROVINCES = {
  ON: { name: 'Ontario', gst: 5, hst: 13, pst: 0 },
  NB: { name: 'New Brunswick', gst: 5, hst: 15, pst: 0 },
  NS: { name: 'Nova Scotia', gst: 5, hst: 15, pst: 0 },
  PE: { name: 'Prince Edward Island', gst: 5, hst: 15, pst: 0 },
  NL: { name: 'Newfoundland & Labrador', gst: 5, hst: 15, pst: 0 },
  QC: { name: 'Québec', gst: 5, hst: 0, pst: 9.975 },
  BC: { name: 'British Columbia', gst: 5, hst: 0, pst: 7 },
  MB: { name: 'Manitoba', gst: 5, hst: 0, pst: 7 },
  SK: { name: 'Saskatchewan', gst: 5, hst: 0, pst: 6 },
  AB: { name: 'Alberta', gst: 5, hst: 0, pst: 0 },
  YT: { name: 'Yukon', gst: 5, hst: 0, pst: 0 },
  NT: { name: 'Northwest Territories', gst: 5, hst: 0, pst: 0 },
  NU: { name: 'Nunavut', gst: 5, hst: 0, pst: 0 },
}

function calcHST(amount, province, mode, includeProv) {
  const amt = Math.max(0, Number(amount || 0))
  if (!amt) return null
  const prov = PROVINCES[province]
  if (!prov) return null

  let effectiveRate, gstAmount, pstAmount, subtotal, total

  if (prov.hst > 0) {
    // HST province: single tax
    effectiveRate = prov.hst
    gstAmount = amt * (prov.hst / 100)
    pstAmount = 0
    if (mode === 'add') {
      subtotal = amt
      total = amt + gstAmount
    } else {
      total = amt
      subtotal = amt / (1 + prov.hst / 100)
      gstAmount = total - subtotal
    }
  } else {
    // GST + optional PST
    const addPST = includeProv === 'include' || (includeProv === 'auto' && prov.pst > 0)
    const pstRate = addPST ? prov.pst : 0
    effectiveRate = prov.gst + pstRate
    if (mode === 'add') {
      subtotal = amt
      gstAmount = amt * (prov.gst / 100)
      pstAmount = amt * (pstRate / 100)
      total = amt + gstAmount + pstAmount
    } else {
      total = amt
      subtotal = amt / (1 + (prov.gst + pstRate) / 100)
      gstAmount = subtotal * (prov.gst / 100)
      pstAmount = subtotal * (pstRate / 100)
    }
  }

  return {
    mode: mode === 'add' ? 'Add tax' : 'Remove tax',
    province: prov.name,
    effectiveRate,
    gstAmount,
    pstAmount,
    subtotal,
    total,
    taxTotal: gstAmount + pstAmount,
  }
}

export default function canada_hst_tool() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [amount, setAmount] = useState('')
  const [province, setProvince] = useState('ON')
  const [mode, setMode] = useState('add')
  const [includeProv, setIncludeProv] = useState('auto')

  const result = useMemo(() => calcHST(amount, province, mode, includeProv), [amount, province, mode, includeProv])

  const inputClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-red-500/40 transition-all duration-300 placeholder:text-white/8'
  const selectClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-white font-semibold outline-none focus:border-red-500/40 transition-all duration-200 [color-scheme:dark]'

  return (
    <ToolLayout
      title="GST/HST Calculator (Canada)"
      desc="Add or remove tax by province - supports HST provinces and GST with optional PST/QST."
      icon="💵" iconBg="rgba(220,38,38,0.08)"
      category="canada" slug="canada-hst-tool"
      faq={[
        { q: 'Which provinces use HST?', a: 'Ontario (13%), New Brunswick (15%), Nova Scotia (15%), PEI (15%), and Newfoundland & Labrador (15%). Others use GST (5%) with or without PST/QST.' },
        { q: 'Is my data stored?', a: 'No. This calculator runs locally in your browser.' },
      ]}
      howItWorks={[
        'Choose Add tax (price before tax) or Remove tax (tax already included).',
        'Enter the amount in CAD.',
        'Select a province to apply the correct HST/GST rate.',
        'View the breakdown with GST/HST and PST/QST lines.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'GST/HST Calculator', applicationCategory: 'BusinessApplication',
        url: 'https://www.uptools.in/canada-hst-tool/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          {[['add', 'Add tax'], ['remove', 'Remove tax']].map(([val, label]) => (
            <button key={val} onClick={() => setMode(val)}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all duration-200 border-2
                ${mode === val ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-lg shadow-red-500/10' : 'bg-white/[0.05] border-white/8 text-slate-500 hover:border-white/12'}`}>
              {label}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Amount (CAD)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="e.g., 100.00" min="0" step="0.01"
            className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Province / Territory</label>
          <select value={province} onChange={e => setProvince(e.target.value)} className={selectClass}>
            <optgroup label="HST provinces">
              {['ON','NB','NS','PE','NL'].map(k => (
                <option key={k} value={k}>{PROVINCES[k].name} (HST {PROVINCES[k].hst}%)</option>
              ))}
            </optgroup>
            <optgroup label="GST + PST/QST">
              {['QC','BC','MB','SK'].map(k => (
                <option key={k} value={k}>{PROVINCES[k].name} (GST 5% + {k==='QC'?'QST':k==='MB'?'RST':'PST'} {PROVINCES[k].pst}%)</option>
              ))}
            </optgroup>
            <optgroup label="GST only">
              {['AB','YT','NT','NU'].map(k => (
                <option key={k} value={k}>{PROVINCES[k].name} (GST 5%)</option>
              ))}
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Provincial tax</label>
          <select value={includeProv} onChange={e => setIncludeProv(e.target.value)} className={selectClass}>
            <option value="auto">Auto (HST provinces only HST)</option>
            <option value="include">Include PST/QST (BC, MB, SK, QC)</option>
            <option value="exclude">Exclude PST/QST</option>
          </select>
        </div>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Breakdown</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Mode</span><span className="text-white font-medium">{result.mode}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Province</span><span className="text-white font-medium">{result.province}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Effective tax rate</span><span className="text-red-400 font-bold">{result.effectiveRate}%</span>
              </div>
              <div className="h-px bg-white/8 my-2" />
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal (before tax)</span><span className="text-white font-bold">{fmt(result.subtotal)}</span>
              </div>
              {result.gstAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">GST/HST</span><span className="text-white">{fmt(result.gstAmount)}</span>
                </div>
              )}
              {result.pstAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">PST/QST</span><span className="text-white">{fmt(result.pstAmount)}</span>
                </div>
              )}
              <div className="h-px bg-white/8 my-2" />
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total tax</span><span className="text-white font-bold">{fmt(result.taxTotal)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-white font-bold">Total</span><span className="text-red-400 font-extrabold">{fmt(result.total)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💵</div>
            <p className="text-sm text-slate-600 font-medium">Enter amount and select province</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
