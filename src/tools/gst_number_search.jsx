import { useState, useEffect, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

const STATE_CODES = {
  '01':'Jammu & Kashmir','02':'Himachal Pradesh','03':'Punjab','04':'Chandigarh','05':'Uttarakhand',
  '06':'Haryana','07':'Delhi','08':'Rajasthan','09':'Uttar Pradesh','10':'Bihar',
  '11':'Sikkim','12':'Arunachal Pradesh','13':'Nagaland','14':'Manipur','15':'Mizoram',
  '16':'Tripura','17':'Meghalaya','18':'Assam','19':'West Bengal','20':'Jharkhand',
  '21':'Odisha','22':'Chhattisgarh','23':'Madhya Pradesh','24':'Gujarat','25':'Daman & Diu',
  '26':'Dadra & Nagar Haveli','27':'Maharashtra','28':'Andhra Pradesh (old)','29':'Karnataka',
  '30':'Goa','31':'Lakshadweep','32':'Kerala','33':'Tamil Nadu','34':'Puducherry',
  '35':'Andaman & Nicobar','36':'Telangana','37':'Andhra Pradesh','38':'Ladakh',
  '97':'Other Territory','99':'Centre Jurisdiction'
}

const ENTITY_TYPES = {
  'P':'Proprietorship','F':'Firm/LLP','C':'Company','T':'Trust','B':'Body of Individuals',
  'L':'Local Authority','J':'Artificial Juridical Person','G':'Government'
}

function decodeGSTIN(gstin) {
  const g = gstin.toUpperCase()
  const stateCode = g.slice(0, 2)
  const pan = g.slice(2, 12)
  const entityNum = g.slice(12, 13)
  const zChar = g.slice(13, 14)
  const checkDigit = g.slice(14, 15)
  const panEntityType = pan.slice(3, 4)
  const state = STATE_CODES[stateCode] || 'Unknown State'
  const entityType = ENTITY_TYPES[panEntityType] || 'Unknown'
  const isValid = GSTIN_RE.test(g)
  return { gstin: g, stateCode, state, pan, entityNum, zChar, checkDigit, entityType, isValid }
}

function getRecent() {
  try { return JSON.parse(localStorage.getItem('gst:recent') || '[]') } catch { return [] }
}

function setRecent(arr) {
  localStorage.setItem('gst:recent', JSON.stringify(arr.slice(0, 8)))
}

export default function gst_number_search() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [recent, setRecentState] = useState(getRecent)
  const [bulkText, setBulkText] = useState('')
  const [bulkResults, setBulkResults] = useState(null)
  const [copied, setCopied] = useState(false)

  // Check URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const gstin = params.get('gstin')
    if (gstin) {
      setInput(gstin.toUpperCase())
      runSearch(gstin.toUpperCase())
    }
  }, [])

  const runSearch = useCallback((raw) => {
    const val = (raw || input).trim().toUpperCase()
    if (!val) { setError('Enter a GSTIN.'); setResult(null); return }
    if (val.length !== 15) { setError(`GSTIN must be exactly 15 characters. You entered ${val.length}.`); setResult(null); return }
    if (!GSTIN_RE.test(val)) { setError('Invalid GSTIN format. Check: 2-digit state + 10-digit PAN + entity + Z + check.'); setResult(null); return }
    setError('')
    const decoded = decodeGSTIN(val)
    setResult(decoded)
    // Update URL
    const u = new URL(window.location.href)
    u.searchParams.set('gstin', val)
    window.history.replaceState({}, '', u)
    // Update recent
    const updated = [val, ...getRecent().filter(c => c !== val)]
    setRecent(updated)
    setRecentState(updated)
    jumpTo()
  }, [input, jumpTo])

  const handleBulk = useCallback(() => {
    const lines = bulkText.split(/\r?\n/).map(s => s.trim().toUpperCase()).filter(Boolean)
    if (!lines.length) return
    setBulkResults(lines.map(g => {
      const valid = GSTIN_RE.test(g)
      if (!valid) return { gstin: g, valid: false, state: '—', pan: '—', entity: '—' }
      const d = decodeGSTIN(g)
      return { gstin: g, valid: true, state: d.state, pan: d.pan, entity: d.entityType }
    }))
  }, [bulkText])

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }).catch(() => {})
  }

  const inputClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark] font-mono'

  return (
    <ToolLayout
      title="GST Number Search & Validator"
      desc="Verify and validate any GSTIN (GST number) instantly. Check GST registration status, business name, state, registration date."
      icon="🧾" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="gst-number-search"
      faq={[
        { q: 'What is a GSTIN?', a: 'GSTIN (Goods and Services Tax Identification Number) is a 15-digit unique identifier assigned to every GST-registered business in India.' },
        { q: 'How do I verify a GST number?', a: 'Enter the 15-digit GSTIN in the search box. The tool will validate the format, decode the state code, PAN, entity type, and registration sequence.' },
        { q: 'What does a GSTIN contain?', a: 'A GSTIN has: 2-digit state code, 10-digit PAN, 1-digit entity number, 1-digit Z (default), and 1 check digit.' },
      ]}
      howItWorks={[
        'Enter a 15-character GSTIN in the search box.',
        'Click Verify to validate the format and decode the GSTIN.',
        'View the state, PAN, entity type, and breakdown visually.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'GST Number Search & Validator', applicationCategory: 'FinanceApplication',
        url: 'https://www.uptools.in/gst-number-search/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">GSTIN (15 characters)</label>
          <div className="flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value.toUpperCase().slice(0, 15))}
              placeholder="e.g. 27AAPFU0939F1ZV" maxLength={15} minLength={15}
              className={`${inputClass} flex-1`} />
            <button onClick={() => runSearch()}
              className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all">
              Verify
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">Format: 2-digit state + 10-digit PAN + entity + Z + check</p>
        </div>

        {/* Recent searches */}
        {recent.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Recent searches</p>
            <div className="flex flex-wrap gap-2">
              {recent.map(code => (
                <button key={code} onClick={() => { setInput(code); runSearch(code) }}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-xs font-mono text-slate-400 hover:text-white transition-all">
                  {code}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">❌ {error}</div>
        )}

        {/* Result */}
        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="text-2xl">🧾</div>
              <div>
                <div className="font-extrabold text-lg font-mono text-white">{result.gstin}</div>
                <div className="text-sm text-slate-400">{result.state}</div>
              </div>
              <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${result.isValid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {result.isValid ? '✅ Valid Format' : '❌ Invalid Format'}
              </span>
            </div>

            {/* Visual breakdown */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-2">GSTIN Breakdown</p>
              <div className="flex gap-1">
                {[
                  { val: result.stateCode, label: 'State', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
                  { val: result.pan, label: 'PAN', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
                  { val: result.entityNum, label: 'Entity#', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
                  { val: result.zChar, label: 'Z', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
                  { val: result.checkDigit, label: 'Check', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
                ].map((seg, i) => (
                  <div key={i} className="flex-1 text-center">
                    <div className={`rounded-lg border px-2 py-1.5 text-sm font-mono font-bold ${seg.color}`}>{seg.val}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{seg.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="divide-y divide-white/5">
              {[
                ['GSTIN', result.gstin],
                ['Format Valid', result.isValid ? '✅ Yes' : '❌ No'],
                ['State Code', result.stateCode],
                ['State', result.state],
                ['PAN Number', result.pan],
                ['Entity Type', result.entityType],
                ['Entity Number', result.entityNum],
                ['Check Digit', result.checkDigit],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-2 text-sm">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-mono text-white">{val}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button onClick={() => copyToClipboard(result.gstin)}
                className={`flex-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy GSTIN'}
              </button>
              <button onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-bold bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                Copy JSON
              </button>
            </div>
          </div>
        )}

        {/* Bulk Validator */}
        <div className="rounded-2xl border border-white/8 p-4">
          <h3 className="text-sm font-bold text-slate-300 mb-2">Bulk GSTIN Validator</h3>
          <p className="text-xs text-slate-500 mb-3">Paste multiple GSTINs (one per line) for batch format validation.</p>
          <textarea value={bulkText} onChange={e => setBulkText(e.target.value)}
            rows={4} placeholder={"27AAPFU0939F1ZV\n07AAACR5055K1Z5\n29AABCT1332L1ZT"}
            className={`${inputClass} resize-none`} />
          <button onClick={handleBulk}
            className="mt-3 px-6 py-2.5 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all">
            Validate All
          </button>
          {bulkResults && (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-white/8">
                    <th className="py-2 pr-2">#</th>
                    <th className="py-2 pr-2">Status</th>
                    <th className="py-2 pr-2 font-mono">GSTIN</th>
                    <th className="py-2 pr-2">State</th>
                    <th className="py-2 pr-2 font-mono">PAN</th>
                    <th className="py-2">Entity</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkResults.map((r, i) => (
                    <tr key={i} className="border-b border-white/4">
                      <td className="py-2 pr-2 text-slate-500">{i + 1}</td>
                      <td className="py-2 pr-2">
                        <span className={`text-xs font-bold ${r.valid ? 'text-emerald-400' : 'text-red-400'}`}>
                          {r.valid ? 'Valid' : 'Invalid'}
                        </span>
                      </td>
                      <td className="py-2 pr-2 font-mono text-white">{r.gstin}</td>
                      <td className="py-2 pr-2 text-slate-300">{r.state}</td>
                      <td className="py-2 pr-2 font-mono text-slate-300">{r.pan}</td>
                      <td className="py-2 text-slate-300">{r.entity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* How to read a GSTIN */}
        <div className="rounded-2xl border border-white/8 p-4">
          <h3 className="text-sm font-bold text-slate-300 mb-3">📖 How to read a GSTIN</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { digits: '1–2', desc: 'State Code', example: '27 = Maharashtra', color: 'text-blue-400' },
              { digits: '3–12', desc: 'PAN Number', example: 'of the taxpayer', color: 'text-emerald-400' },
              { digits: '13', desc: 'Entity number', example: '1–9, A–Z', color: 'text-amber-400' },
              { digits: '14', desc: 'Always "Z"', example: 'by default', color: 'text-purple-400' },
              { digits: '15', desc: 'Check digit', example: '0–9 or A–Z', color: 'text-cyan-400' },
            ].map(item => (
              <div key={item.digits} className="bg-black/20 border border-white/5 rounded-xl p-3">
                <div className={`text-xs font-bold ${item.color}`}>Digits {item.digits}</div>
                <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                <div className="text-[10px] text-slate-600 mt-0.5">{item.example}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
