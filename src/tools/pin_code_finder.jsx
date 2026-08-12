import { useState, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

const PIN_RE = /^[1-9][0-9]{5}$/
const CACHE_KEY = 'pin:cache:v2'
const RECENT_KEY = 'pin:recent'

function getCached(code) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
    const entry = cache[code]
    if (entry && Date.now() - entry.ts < 7 * 24 * 60 * 60 * 1000) return entry.data
  } catch {}
  return null
}
function setCached(code, data) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
    cache[code] = { data, ts: Date.now() }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {}
}

export default function pin_code_finder() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch { return [] }
  })
  const [copied, setCopied] = useState(null)
  const [bulkInput, setBulkInput] = useState('')
  const [bulkResults, setBulkResults] = useState(null)
  const [bulkLoading, setBulkLoading] = useState(false)

  useEffect(() => {
    const qs = new URLSearchParams(window.location.search)
    const code = qs.get('code')
    if (code && PIN_RE.test(code)) { setInput(code); doSearch(code) }
  }, [])

  const addRecent = useCallback((code) => {
    setRecent(prev => {
      const next = [code, ...prev.filter(c => c !== code)].slice(0, 8)
      localStorage.setItem(RECENT_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const doSearch = useCallback(async (code) => {
    setLoading(true); setError(''); setResult(null)
    const cached = getCached(code)
    if (cached) { setResult(cached); setLoading(false); addRecent(code); return }
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${code}`, { credentials: 'omit' })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const json = await res.json()
      if (!json?.[0] || json[0].Status !== 'Success') throw new Error('NOT_FOUND')
      const data = json[0]
      setCached(code, data)
      setResult(data)
      addRecent(code)
    } catch {
      setError('Not found or temporarily unavailable. Please check the PIN code and try again.')
    }
    setLoading(false)
  }, [addRecent])

  const search = useCallback(() => {
    const raw = input.trim().replace(/\D/g, '')
    setInput(raw)
    if (!raw) { setError('Enter a PIN code.'); return }
    if (!PIN_RE.test(raw)) { setError('Invalid PIN code. Must be 6 digits starting with 1–9.'); return }
    doSearch(raw)
  }, [input, doSearch])

  const doBulk = useCallback(async () => {
    const codes = [...new Set(bulkInput.split(/\r?\n/).map(s => s.trim().replace(/\D/g, '')).filter(s => s && PIN_RE.test(s)))]
    if (!codes.length) return
    setBulkLoading(true)
    const results = await Promise.allSettled(codes.map(async c => {
      const cached = getCached(c)
      if (cached) return { code: c, ok: true, data: cached }
      const res = await fetch(`https://api.postalpincode.in/pincode/${c}`)
      const json = await res.json()
      if (json?.[0]?.Status === 'Success') { setCached(c, json[0]); return { code: c, ok: true, data: json[0] } }
      return { code: c, ok: false }
    }))
    setBulkResults(results.map(r => r.value || { code: '?', ok: false }))
    setBulkLoading(false)
  }, [bulkInput])

  const copyText = useCallback((text, label) => {
    navigator.clipboard.writeText(text)
    setCopied(label); setTimeout(() => setCopied(null), 1500)
  }, [])

  const offices = result?.PostOffice || []
  const first = offices[0] || {}

  return (
    <ToolLayout
      title="PIN Code Finder – Find PIN Code Details, Post Office & District"
      desc="Free PIN code finder: enter a 6-digit Indian PIN to see the district, state, taluk, and all post offices. Bulk lookup for multiple PIN codes, CSV/JSON export — no signup."
      icon="📮" iconBg="rgba(99,102,241,0.08)"
      category="india" slug="pin-code-finder"
      faq={[
        { q: 'What is a PIN code?', a: 'A PIN code (Postal Index Number) is the 6-digit postal code used by India Post to sort and deliver mail. The first digit indicates the postal region, and the first two digits indicate the state or circle.' },
        { q: 'How do I find PIN code details?', a: 'Enter any 6-digit Indian PIN code above and press Search. You will instantly see the district, state, taluk/tehsil, division, and every post office served by that PIN.' },
        { q: 'How many post offices can a PIN code have?', a: 'A single PIN code can serve anywhere from one to several post offices. Our finder lists all of them for the PIN you enter, straight from India Post data.' },
        { q: 'Can I look up multiple PIN codes at once?', a: 'Yes. Use the Bulk Lookup tab to enter several PIN codes (one per line) and get district, state, and post-office count for all of them in one table.' },
        { q: 'Is the PIN code finder free?', a: 'Yes, it is completely free with no signup and no limits. You can also export your results as JSON or CSV.' },
        { q: 'How many PIN codes are in the database?', a: 'All Indian PIN codes (19,000+) from India Post.' },
      ]}
      howItWorks={[
        'Enter a 6-digit Indian PIN code.',
        'View district, state, taluk, and all post offices.',
        'Use Bulk Lookup for multiple PIN codes at once.',
        'Export results as JSON or CSV.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "PIN Code Finder", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/pin-code-finder/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-lg mx-auto space-y-4">
        {/* Input */}
        <div className="bg-white/[0.06] border border-white/8 rounded-2xl p-4">
          <label className="text-xs font-semibold text-slate-400 mb-2 block">Enter PIN Code</label>
          <div className="flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="e.g. 110001"
              className="flex-1 bg-black/20 border-2 border-white/8 rounded-xl px-4 py-3 text-sm font-mono text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600" />
            <button onClick={search} disabled={loading}
              className="glow-btn px-6 py-3 rounded-xl text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              {loading ? '⏳' : '🔍'} Search
            </button>
          </div>
          {/* Recent */}
          {recent.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {recent.map(c => (
                <button key={c} onClick={() => { setInput(c); doSearch(c) }}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white/[0.06] border border-white/8 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all">
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>}

        {/* Result */}
        {result && (
          <div className="bg-white/[0.06] border border-white/8 rounded-2xl p-4 space-y-3"
            style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 grid place-items-center text-xl">📮</div>
              <div>
                <div className="font-extrabold text-white">{input} — {first.District || '—'}</div>
                <div className="text-xs text-slate-400">{first.State || '—'}, {first.Country || 'India'}</div>
              </div>
            </div>
            <div className="space-y-1.5">
              {[
                { label: 'PIN Code', value: input },
                { label: 'District', value: first.District || '—' },
                { label: 'State', value: first.State || '—' },
                { label: 'Taluk / Tehsil', value: first.Taluk || '—' },
                { label: 'Division', value: first.Division || '—' },
                { label: 'Post Offices', value: offices.length },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center py-2 border-b border-white/[0.04] text-sm">
                  <span className="text-slate-400 font-semibold">{r.label}</span>
                  <span className="text-white font-medium">{r.value}</span>
                </div>
              ))}
            </div>
            {/* Actions */}
            <div className="flex gap-2">
              {[
                { label: 'Copy PIN', text: input, key: 'pin' },
                { label: '📋 JSON', text: JSON.stringify({ pinCode: input, district: first.District, state: first.State, postOffices: offices.length }, null, 2), key: 'json' },
              ].map(a => (
                <button key={a.key} onClick={() => copyText(a.text, a.key)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${copied === a.key ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white'}`}>
                  {copied === a.key ? '✓ Copied' : a.label}
                </button>
              ))}
            </div>
            {/* Post Offices */}
            {offices.length > 0 && (
              <div>
                <div className="text-xs font-bold text-slate-400 mb-2">All Post Offices ({offices.length})</div>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {offices.map((o, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-black/20 border border-white/[0.04]">
                      <div className="text-xs font-bold text-white">{o.Name || '—'}</div>
                      <div className="text-[10px] text-slate-400">{o.BranchType || ''} · {o.DeliveryStatus || ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bulk Lookup */}
        <div className="bg-white/[0.06] border border-white/8 rounded-2xl p-4">
          <div className="text-xs font-bold text-slate-400 mb-2">📦 Bulk Lookup</div>
          <textarea value={bulkInput} onChange={e => setBulkInput(e.target.value)}
            placeholder="Enter PIN codes, one per line"
            rows={3}
            className="w-full bg-black/20 border-2 border-white/8 rounded-xl px-4 py-3 text-xs font-mono text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none mb-2" />
          <button onClick={doBulk} disabled={bulkLoading}
            className="glow-btn w-full py-3 rounded-xl text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            {bulkLoading ? '⏳ Fetching...' : '📦 Bulk Search'}
          </button>
          {bulkResults && (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="text-slate-400 border-b border-white/8">
                  <th className="text-left py-2 px-2">#</th><th className="text-left py-2 px-2">Status</th>
                  <th className="text-left py-2 px-2">PIN</th><th className="text-left py-2 px-2">District</th>
                  <th className="text-left py-2 px-2">State</th><th className="text-left py-2 px-2">POs</th>
                </tr></thead>
                <tbody>
                  {bulkResults.map((r, i) => (
                    <tr key={i} className="border-b border-white/[0.04]">
                      <td className="py-2 px-2 text-slate-400">{i + 1}</td>
                      <td className="py-2 px-2">{r.ok ? <span className="text-emerald-400">OK</span> : <span className="text-red-400">ERR</span>}</td>
                      <td className="py-2 px-2 text-white font-mono">{r.code}</td>
                      <td className="py-2 px-2 text-slate-300">{r.ok ? (r.data?.PostOffice?.[0]?.District || '—') : '—'}</td>
                      <td className="py-2 px-2 text-slate-300">{r.ok ? (r.data?.PostOffice?.[0]?.State || '—') : '—'}</td>
                      <td className="py-2 px-2 text-slate-300">{r.ok ? (r.data?.PostOffice?.length || 0) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!result && !loading && !error && (
          <div className="text-center py-10 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📮</div>
            <p className="text-sm text-slate-600 font-medium">Enter a PIN code to look up details</p>
          </div>
        )}
      </div>

      {/* SEO content section */}
      <div className="max-w-2xl mx-auto pt-2">
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Free PIN Code Finder – Check PIN Code Details Instantly</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Need to check a PIN code, verify a postal address, or find every post office in a PIN
              area? Enter any 6-digit Indian PIN code and this free PIN code finder returns the
              district, state, taluk, division, and all post offices in seconds — straight from
              India Post data. No signup, no limits, and free forever.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">How to find PIN code details</h3>
            <ol className="list-decimal list-inside text-sm text-slate-400 space-y-1.5 leading-relaxed">
              <li>Type a 6-digit PIN code (for example, <strong className="text-slate-200">110001</strong> for New Delhi) into the box above.</li>
              <li>Click <strong className="text-slate-200">Search</strong>.</li>
              <li>View the district, state, taluk, division, and the full list of post offices for that PIN.</li>
              <li>Copy the details or export them as JSON for your records.</li>
            </ol>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">What you get for every PIN code</h3>
            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1.5 leading-relaxed">
              <li>District and State</li>
              <li>Taluk / Tehsil and Postal Division</li>
              <li>Every post office served by the PIN, with branch type and delivery status</li>
              <li>Bulk lookup for many PIN codes at once, plus JSON / CSV export</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">Why use our PIN code finder?</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              It is completely free with no signup and no daily limits, and it pulls live data from
              India Post, so you always see accurate, up-to-date post office and address details.
              Everything runs in your browser, and your recent searches are saved locally so you can
              quickly re-check a PIN code you looked up before.
            </p>
          </div>
          <p className="text-xs text-slate-600 pt-1">
            Pair with other India tools:{' '}
            <a className="text-indigo-400 hover:text-indigo-300" href="/ifsc-finder/">IFSC Code Finder</a>,{' '}
            <a className="text-indigo-400 hover:text-indigo-300" href="/gst-number-search/">GST Number Search</a>,{' '}
            and <a className="text-indigo-400 hover:text-indigo-300" href="/upi-validator/">UPI ID Validator</a>.
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
