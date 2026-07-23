import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/

const BANK_LOGOS = {
  SBIN: '🏦', HDFC: '🏦', ICIC: '🏦', UTIB: '🏦', KKBK: '🏦',
  PUNB: '🏦', BARB: '🏦', CNRB: '🏦', UBIN: '🏦', IDIB: '🏦',
}

const RECENT_KEY = 'ifsc:recent'

export default function ifsc_finder() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bulkInput, setBulkInput] = useState('')
  const [bulkResults, setBulkResults] = useState([])
  const [bulkLoading, setBulkLoading] = useState(false)
  const [copied, setCopied] = useState(null)
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch { return [] }
  })

  const fetchIFSC = useCallback(async (ifsc) => {
    const r = await fetch(`https://ifsc.razorpay.com/${ifsc}`)
    if (!r.ok) throw new Error('NOT_FOUND')
    return r.json()
  }, [])

  const search = useCallback(async () => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed || trimmed.length !== 11 || !IFSC_RE.test(trimmed)) {
      setError('Invalid IFSC format. Example: SBIN0000001')
      return
    }
    setError(''); setLoading(true); setResult(null)
    try {
      const data = await fetchIFSC(trimmed)
      setResult(data)
      const newRecent = [trimmed, ...recent.filter(r => r !== trimmed)].slice(0, 10)
      setRecent(newRecent)
      localStorage.setItem(RECENT_KEY, JSON.stringify(newRecent))
      jumpTo()
    } catch {
      setError('Not found or temporarily unavailable. Check the code and try again.')
    }
    setLoading(false)
  }, [code, fetchIFSC, recent, jumpTo])

  const searchBulk = useCallback(async () => {
    const codes = [...new Set(bulkInput.split(/[\n,]+/).map(s => s.trim().toUpperCase()).filter(x => x.length === 11 && IFSC_RE.test(x)))]
    if (!codes.length) return
    setBulkLoading(true); setBulkResults([])
    const results = []
    for (const c of codes) {
      try {
        const d = await fetchIFSC(c)
        results.push({ ...d, _ok: true })
      } catch {
        results.push({ IFSC: c, _ok: false, _error: 'Not found' })
      }
      setBulkResults([...results])
    }
    setBulkLoading(false)
  }, [bulkInput, fetchIFSC])

  const copy = useCallback((text, label) => {
    navigator.clipboard?.writeText(text)
    setCopied(label); setTimeout(() => setCopied(null), 2000)
  }, [])

  const shareResult = useCallback((data) => {
    const text = `${data.BANK}\nIFSC: ${data.IFSC}\nBranch: ${data.BRANCH}\nCity: ${data.CITY}\nState: ${data.STATE}`
    if (navigator.share) navigator.share({ title: `IFSC: ${data.IFSC}`, text }).catch(() => {})
    else copy(text, 'share')
  }, [copy])

  const openInMaps = useCallback((data) => {
    const q = encodeURIComponent([data.ADDRESS, data.BRANCH, data.CITY, data.STATE, data.BANK].filter(Boolean).join(', '))
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank')
  }, [])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"
  const rs = v => (v || '').toString().trim()

  return (
    <ToolLayout
      title="IFSC Code Finder"
      desc="Find Indian bank branch details using IFSC code. Get bank name, branch, address, MICR, and more instantly."
      icon="🏦" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="ifsc-finder"
      faq={[
        { q: 'What is an IFSC code?', a: 'IFSC (Indian Financial System Code) is an 11-character alphanumeric code assigned to each bank branch in India for electronic fund transfers (NEFT, RTGS, IMPS).' },
        { q: 'Where do I find my IFSC code?', a: 'You can find it on your cheque book, bank statement, or your bank\'s website. It\'s also shown in UPI apps under bank account details.' },
      ]}
      howItWorks={[
        'Enter an 11-character IFSC code (e.g., SBIN0000001).',
        'Click Lookup to fetch branch details from the Razorpay IFSC API.',
        'View bank name, branch, address, MICR, contact, and map.',
        'Copy, share, or download as vCard/CSV.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "IFSC Code Finder", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/ifsc-finder/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Search Input */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-3">
          <label className="text-xs font-semibold text-slate-500 mb-1 block">IFSC Code</label>
          <div className="flex gap-2">
            <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="SBIN0000001" maxLength={11}
              className={inputClass + ' font-mono'} />
            <button onClick={() => { search(); jumpTo() }} disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold text-sm shrink-0 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
              {loading ? '⏳' : '🔍'} Lookup
            </button>
          </div>
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>}
        </div>

        {/* Recent Searches */}
        {recent.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recent.slice(0, 5).map(r => (
              <button key={r} onClick={() => { setCode(r); search() }}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/8 text-[11px] font-mono text-slate-400 hover:text-white transition-all">
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Result */}
        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-6 space-y-4"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏦</span>
                  <h3 className="text-lg font-extrabold text-white">{rs(result.BANK)}</h3>
                </div>
                <div className="text-xs text-slate-400 mt-1">{rs(result.BRANCH)}{result.CITY ? `, ${result.CITY}` : ''}{result.STATE ? `, ${result.STATE}` : ''}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => copy(result.IFSC, 'ifsc')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${copied === 'ifsc' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
                  {copied === 'ifsc' ? '✓ Copied' : '📋 Copy IFSC'}
                </button>
                <button onClick={() => shareResult(result)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white/5 text-slate-400 hover:text-white transition-all">
                  📤 Share
                </button>
              </div>
            </div>

            <div className="h-px bg-white/8" />

            {[
              ['IFSC', result.IFSC], ['MICR', result.MICR || '-'],
              ['Branch', result.BRANCH || '-'], ['Bank', result.BANK || '-'],
              ['City', result.CITY || '-'], ['State', result.STATE || '-'],
              ['Contact', result.CONTACT || '-'], ['Address', result.ADDRESS || '-'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0"
                onClick={() => copy(String(value), label)}>
                <span className="text-xs text-slate-500">{label}</span>
                <span className="text-xs font-mono font-bold text-white">{value}</span>
              </div>
            ))}

            <div className="flex gap-2 pt-2">
              <button onClick={() => openInMaps(result)}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] border border-white/8 text-xs font-bold text-slate-400 hover:text-white transition-all">
                🗺️ Open in Maps
              </button>
              <button onClick={() => {
                const blob = new Blob([`BEGIN:VCARD\nVERSION:3.0\nFN:${rs(result.BANK)} - ${rs(result.BRANCH)}\nORG:${rs(result.BANK)}\nADR;TYPE=WORK:;;${rs(result.ADDRESS)};${rs(result.CITY)};${rs(result.STATE)};;India\nTEL;TYPE=WORK:${rs(result.CONTACT)}\nEND:VCARD`], { type: 'text/vcard' })
                const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${rs(result.BANK)}-${rs(result.BRANCH)}.vcf`.replace(/\s+/g, '-'); a.click()
              }}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] border border-white/8 text-xs font-bold text-slate-400 hover:text-white transition-all">
                📇 Download vCard
              </button>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏦</div>
            <p className="text-sm text-slate-600 font-medium">Enter an IFSC code to look up branch details</p>
          </div>
        )}

        {/* Bulk Lookup */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-3">
          <h3 className="text-sm font-bold text-white">📋 Bulk Lookup</h3>
          <textarea value={bulkInput} onChange={e => setBulkInput(e.target.value)}
            placeholder="Enter IFSC codes (one per line or comma-separated)..." rows={4}
            className={inputClass + ' font-mono resize-none'} />
          <button onClick={searchBulk} disabled={bulkLoading}
            className="w-full py-3 rounded-xl bg-white/[0.06] border border-white/8 text-sm font-bold text-slate-400 hover:text-white transition-all disabled:opacity-50">
            {bulkLoading ? '⏳ Looking up...' : '🔍 Lookup All'}
          </button>
          {bulkResults.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-slate-500 font-semibold">#</th>
                    <th className="text-left py-2 text-slate-500 font-semibold">Status</th>
                    <th className="text-left py-2 text-slate-500 font-semibold">IFSC</th>
                    <th className="text-left py-2 text-slate-500 font-semibold">Bank</th>
                    <th className="text-left py-2 text-slate-500 font-semibold">Branch</th>
                    <th className="text-left py-2 text-slate-500 font-semibold">City</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkResults.map((r, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-2 text-slate-400">{i + 1}</td>
                      <td className="py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${r._ok ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {r._ok ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="py-2 font-mono text-white">{r.IFSC || '-'}</td>
                      <td className="py-2 text-slate-300">{r.BANK || '-'}</td>
                      <td className="py-2 text-slate-300">{r.BRANCH || '-'}</td>
                      <td className="py-2 text-slate-300">{r.CITY || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
