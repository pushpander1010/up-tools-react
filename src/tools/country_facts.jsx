import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function country_facts() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [query, setQuery] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const FIELDS = 'name,alpha2Code,alpha3Code,capital,region,subregion,population,area,currencies,languages,callingCodes,topLevelDomain,flag,flags,timezones,latlng'

  const lookup = useCallback(async () => {
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setError('')
    setData(null)
    jumpTo()
    try {
      // Try by name first, fall back to alpha code
      let d = null
      try {
        const r = await fetch(`https://countries.dev/name/${encodeURIComponent(q)}?fields=${FIELDS}`)
        const j = await r.json()
        if (Array.isArray(j) && j.length) d = j[0]
      } catch {}
      if (!d) {
        const r = await fetch(`https://countries.dev/alpha/${encodeURIComponent(q.toUpperCase())}?fields=${FIELDS}`)
        d = await r.json()
      }
      if (!d || !d.name) throw new Error('not found')
      setData(d)
    } catch {
      setError('Country not found. Try the English name (e.g. "India") or a 2-letter code (e.g. "IN").')
    }
    setLoading(false)
  }, [query, jumpTo])

  const fmtNum = (n) => n == null ? '—' : n.toLocaleString('en-US')
  const fmtArea = (n) => n == null ? '—' : `${n.toLocaleString('en-US')} km²`

  const inputClass = "flex-1 bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3.5 text-white font-semibold outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Country Facts"
      desc="Get detailed facts about any country: capital, population, area, currency, languages, flag, calling code, and timezone."
      icon="🌍" iconBg="rgba(16,185,129,0.08)"
      category="education" slug="country-facts"
      faq={[
        { q: 'What facts does this provide?', a: 'Capital, population, area, region, subregion, currency, official languages, calling code, top-level domain, flag, timezone, and coordinates.' },
        { q: 'How do I search?', a: 'Type a country name in English (e.g. "Canada", "Japan") or a 2-letter ISO code (e.g. "CA", "JP").' },
        { q: 'Is the data current?', a: 'Data comes from the countries.dev API (the free, keyless replacement for REST Countries) and reflects the latest available statistics.' },
      ]}
      howItWorks={[
        'Enter a country name or 2-letter code.',
        'Click "Look Up" to fetch country data.',
        'View population, area, currency, languages, and other key facts with the flag.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "Country Facts", "applicationCategory": "ReferenceApplication",
        url: "https://www.uptools.in/country-facts/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && lookup()}
            placeholder="Country name or code (e.g. India or IN)"
            className={inputClass}
          />
          <button onClick={lookup} disabled={loading}
            className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
            {loading ? '⏳' : '🌍 Look Up'}
          </button>
        </div>

        {error && <p className="text-center text-sm text-rose-400">{error}</p>}

        {data && (
          <div ref={resultRef} className="space-y-4" style={{ animation: 'slideUp 0.35s ease-out' }}>
            {/* Header */}
            <div className="rounded-3xl border-2 border-white/8 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-6 flex items-center gap-4">
              <img src={data.flags?.png} alt={data.name} className="w-20 h-12 object-cover rounded-lg border border-white/10 shadow-lg" loading="lazy" />
              <div>
                <div className="text-2xl font-extrabold text-white">{data.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {data.alpha2Code} · {data.alpha3Code} {data.region ? `· ${data.region}` : ''}{data.subregion ? `, ${data.subregion}` : ''}
                </div>
              </div>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                ['👥', 'Population', fmtNum(data.population)],
                ['🗺️', 'Area', fmtArea(data.area)],
                ['🏛️', 'Capital', data.capital || '—'],
                ['💰', 'Currency', data.currencies?.map(c => `${c.name} (${c.symbol})`).join(', ') || '—'],
                ['🗣️', 'Languages', data.languages?.map(l => l.name).join(', ') || '—'],
                ['📞', 'Calling Code', data.callingCodes?.map(c => '+' + c).join(', ') || '—'],
                ['🌐', 'TLD', data.topLevelDomain?.join(', ') || '—'],
                ['🕐', 'Timezone', data.timezones?.join(', ') || '—'],
                ['📍', 'Coordinates', data.latlng ? `${data.latlng[0]}°, ${data.latlng[1]}°` : '—'],
              ].map(([icon, label, value]) => (
                <div key={label} className="rounded-2xl border-2 border-white/8 bg-white/[0.04] p-4">
                  <div className="text-lg mb-1">{icon}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
                  <div className="text-sm text-white font-semibold mt-0.5 break-words">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
