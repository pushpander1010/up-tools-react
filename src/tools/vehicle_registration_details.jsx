import { useState, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const COUNTRY = {
  IN: { label: 'India', hint: 'India format: KA01AB1234 or DL5CAF1234.' },
  UK: { label: 'United Kingdom', hint: 'UK format: AB12 CDE (two letters, two digits, three letters).' },
  US: { label: 'United States', hint: 'US plates vary by state; this checks length/characters only.' },
  CA: { label: 'Canada', hint: 'Canada plates vary by province; this checks length/characters only.' },
  AU: { label: 'Australia', hint: 'Australia plates vary by state; this checks length/characters only.' },
}

const INDIA_STATES = {
  AP: 'Andhra Pradesh', AR: 'Arunachal Pradesh', AS: 'Assam', BR: 'Bihar',
  CG: 'Chhattisgarh', CH: 'Chandigarh', DL: 'Delhi', DN: 'Dadra and Nagar Haveli',
  GA: 'Goa', GJ: 'Gujarat', HP: 'Himachal Pradesh', HR: 'Haryana',
  JH: 'Jharkhand', JK: 'Jammu and Kashmir', KA: 'Karnataka', KL: 'Kerala',
  LA: 'Ladakh', MH: 'Maharashtra', ML: 'Meghalaya', MN: 'Manipur',
  MP: 'Madhya Pradesh', MZ: 'Mizoram', NL: 'Nagaland', OD: 'Odisha',
  PB: 'Punjab', PY: 'Puducherry', RJ: 'Rajasthan', SK: 'Sikkim',
  TN: 'Tamil Nadu', TS: 'Telangana', TR: 'Tripura', UK: 'Uttarakhand',
  UP: 'Uttar Pradesh', WB: 'West Bengal'
}

const RE_IN = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/
const RE_UK = /^[A-Z]{2}[0-9]{2}[A-Z]{3}$/
const RE_GENERIC = /^[A-Z0-9]{5,8}$/

const normalizeReg = v => (v || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16)
const maskValue = (v, keep = 4) => v ? '•'.repeat(Math.max(0, v.length - keep)) + v.slice(-keep) : '-'

function formatCheck(reg, country) {
  if (!reg) return { ok: false, label: '-', region: '-' }
  if (country === 'IN') {
    const ok = RE_IN.test(reg)
    const code = reg.slice(0, 2)
    const region = INDIA_STATES[code] ? `${code} - ${INDIA_STATES[code]}` : 'Unknown state code'
    return { ok, label: ok ? 'India format OK' : 'Invalid India format', region }
  }
  if (country === 'UK') {
    const ok = RE_UK.test(reg)
    return { ok, label: ok ? 'UK format OK' : 'Invalid UK format', region: 'UK format only' }
  }
  const ok = RE_GENERIC.test(reg)
  return { ok, label: ok ? 'Basic format OK' : 'Invalid format', region: 'Varies by state/province' }
}

export default function vehicle_registration_details() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [reg, setReg] = useState('')
  const [country, setCountry] = useState('IN')
  const [masked, setMasked] = useState(false)
  const [copied, setCopied] = useState(false)

  const normalized = normalizeReg(reg)
  const check = formatCheck(normalized, country)
  const c = COUNTRY[country] || COUNTRY.IN

  const copyReg = useCallback(async () => {
    if (!normalized) return
    try { await navigator.clipboard.writeText(normalized) } catch { /* fallback */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [normalized])

  return (
    <ToolLayout
      title="Vehicle Registration Details"
      desc="Check vehicle registration format for India, UK, US, and more."
      icon="🚗" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="vehicle-registration-details"
      faq={[
        { q: "What countries are supported?", a: "India (with state code detection), UK, US, Canada, and Australia format checking." },
        { q: "Does this check real vehicle data?", a: "No, this only validates the format of registration numbers. It does not access any RTO database." },
      ]}
      howItWorks={[
        "Enter a vehicle registration number.",
        "Select the country format.",
        "View format validation and state/region details.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Vehicle Registration Details", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/vehicle-registration-details/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Registration Number</label>
            <input type="text" value={reg} onChange={e => setReg(normalizeReg(e.target.value))}
              placeholder="KA01AB1234"
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 uppercase" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Country</label>
              <select value={country} onChange={e => setCountry(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all bg-gray-900">
                {Object.entries(COUNTRY).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-black/20 border-2 border-white/[0.08] cursor-pointer w-full">
                <input type="checkbox" checked={masked} onChange={e => setMasked(e.target.checked)}
                  className="rounded" />
                <span className="text-xs text-slate-400">Mask output</span>
              </label>
            </div>
          </div>
          <div className="text-xs text-slate-500">{c.hint}</div>
        </div>

        {/* Results */}
        {normalized && (
          <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-400">Registration</div>
              <div className={`text-xs font-bold ${check.ok ? 'text-emerald-400' : 'text-slate-500'}`}>
                {check.ok ? '✅ Ready' : '⏳ Incomplete'}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 rounded-xl p-3">
                <div className="text-xs text-slate-500">Registration</div>
                <div className="text-sm font-mono text-white">{masked ? maskValue(normalized) : normalized}</div>
              </div>
              <div className="bg-black/20 rounded-xl p-3">
                <div className="text-xs text-slate-500">Country</div>
                <div className="text-sm text-white">{c.label}</div>
              </div>
              <div className="bg-black/20 rounded-xl p-3">
                <div className="text-xs text-slate-500">Format Check</div>
                <div className={`text-sm ${check.ok ? 'text-emerald-400' : 'text-red-400'}`}>{check.label}</div>
              </div>
              <div className="bg-black/20 rounded-xl p-3">
                <div className="text-xs text-slate-500">Region</div>
                <div className="text-sm text-white">{check.region}</div>
              </div>
            </div>
            <button onClick={copyReg}
              className={`w-full py-2 rounded-xl text-sm font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white'}`}>
              {copied ? '✅ Copied!' : '📋 Copy Registration'}
            </button>
          </div>
        )}

        {!normalized && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🚗</div>
            <p className="text-sm text-slate-600 font-medium">Enter a registration number to check format</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
