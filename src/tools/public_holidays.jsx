import { useState, useCallback, useEffect, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function public_holidays() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [countries, setCountries] = useState([])
  const [code, setCode] = useState('in')
  const [year, setYear] = useState(new Date().getFullYear())
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [countriesLoading, setCountriesLoading] = useState(true)
  const [error, setError] = useState('')

  // Load country list once
  useEffect(() => {
    let mounted = true
    fetch('https://caldays.com/api/holidays')
      .then(r => r.json())
      .then(d => {
        if (!mounted) return
        const list = d.countries || []
        list.sort((a, b) => a.name.localeCompare(b.name))
        setCountries(list)
      })
      .catch(() => {})
      .finally(() => mounted && setCountriesLoading(false))
    return () => { mounted = false }
  }, [])

  const fetchHolidays = useCallback(async () => {
    if (!code) return
    setLoading(true)
    setError('')
    setData(null)
    jumpTo()
    try {
      const r = await fetch(`https://caldays.com/api/holidays/${encodeURIComponent(code)}?year=${year}`)
      if (!r.ok) throw new Error('bad status')
      const d = await r.json()
      if (d.holidays && d.holidays.length) {
        const byMonth = {}
        d.holidays.forEach(h => {
          const m = h.date.slice(0, 7)
          byMonth[m] = byMonth[m] || []
          byMonth[m].push(h)
        })
        setData({ ...d, byMonth })
      } else {
        setError('No public holidays found for this country/year.')
      }
    } catch {
      setError('Could not load holidays. Please try again.')
    }
    setLoading(false)
  }, [code, year, jumpTo])

  useEffect(() => { if (code) fetchHolidays() }, [code, fetchHolidays])

  const monthNames = useMemo(() =>
    ['January','February','March','April','May','June','July','August','September','October','November','December'], [])

  const flagFor = (c) => c
    ? String.fromCodePoint(...[...c.toUpperCase()].map(x => 0x1F1E6 - 65 + x.charCodeAt(0)))
    : '🌍'

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Public Holidays"
      desc="Public holidays for 206 countries by year. Search national, regional, and bank holidays for any country."
      icon="🎉" iconBg="rgba(245,158,11,0.08)"
      category="tools" slug="public-holidays"
      faq={[
        { q: 'Which countries are covered?', a: 'This tool covers public holidays for 206 countries worldwide, powered by the open caldays dataset.' },
        { q: 'Can I check other years?', a: 'Yes, pick any year from the dropdown to view that year\u2019s public holidays for the selected country.' },
        { q: 'Are these official holidays?', a: 'Data comes from the caldays public-holiday dataset (CC BY 4.0), compiled from official sources and updated regularly.' },
      ]}
      howItWorks={[
        'Pick a country from the searchable dropdown (defaults to India).',
        'Choose a year to view.',
        'Holidays load grouped by month with dates and names.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "Public Holidays", "applicationCategory": "UtilitiesApplication",
        url: "https://www.uptools.in/public-holidays/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Country</label>
            <select value={code} onChange={e => setCode(e.target.value)}
              className={inputClass}>
              {countriesLoading
                ? <option>Loading countries…</option>
                : countries.map(c => <option key={c.code} value={c.code}>{flagFor(c.code)} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Year</label>
            <select value={year} onChange={e => setYear(parseInt(e.target.value))} className={inputClass}>
              {Array.from({ length: 6 }, (_, i) => 2024 + i).map(y =>
                <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {loading && <div className="text-center py-10"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>}
        {error && <p className="text-center text-sm text-rose-400">{error}</p>}

        {data && (
          <div ref={resultRef} className="space-y-4" style={{ animation: 'slideUp 0.35s ease-out' }}>
            {/* Summary */}
            <div className="rounded-3xl border-2 border-white/8 bg-gradient-to-br from-amber-500/[0.08] to-transparent p-6 flex items-center gap-4">
              <div className="text-4xl">{flagFor(data.code)}</div>
              <div>
                <div className="text-lg font-extrabold text-white">{data.country || data.countryLocal}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {data.count} public holidays in {data.year} · Data: caldays (CC BY 4.0)
                </div>
              </div>
            </div>

            {/* By month */}
            {Object.entries(data.byMonth).map(([m, holidays]) => (
              <div key={m} className="rounded-3xl border-2 border-white/8 bg-white/[0.03] p-5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  {monthNames[parseInt(m.slice(5, 7)) - 1]} {m.slice(0, 4)}
                </div>
                <div className="space-y-2">
                  {holidays.map((h, i) => {
                    const dt = new Date(h.date)
                    const dow = dt.toLocaleDateString('en-US', { weekday: 'long' })
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/5">
                        <div className="w-12 text-center shrink-0">
                          <div className="text-sm font-extrabold text-white">{dt.getDate()}</div>
                          <div className="text-[9px] text-slate-500 uppercase">{dow.slice(0, 3)}</div>
                        </div>
                        <div className="text-sm font-semibold text-white flex-1">{h.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{h.date}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            <p className="text-[10px] text-slate-600 text-center pt-2">
              Public holiday data powered by <a href="https://caldays.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-400">caldays</a> (CC BY 4.0).
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
