import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import FAQ from '../components/FAQ'

const API = 'https://api.fda.gov/drug/label.json'

const FIELDS = [
  { key: 'indications_and_usage', label: 'Uses', icon: '💊' },
  { key: 'dosage_and_administration', label: 'Dosage', icon: '📐' },
  { key: 'warnings', label: 'Warnings', icon: '⚠️' },
  { key: 'adverse_reactions', label: 'Side Effects', icon: '🩺' },
  { key: 'contraindications', label: 'Contraindications', icon: '🚫' },
  { key: 'drug_interactions', label: 'Drug Interactions', icon: '🔀' },
  { key: 'description', label: 'Description', icon: '📄' },
  { key: 'how_supplied', label: 'How Supplied', icon: '📦' },
]

export default function drug_information_tool() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [activeTab, setActiveTab] = useState('indications_and_usage')
  const abortRef = useRef(null)

  const search = async (q) => {
    const term = (q || query).trim()
    if (!term) return
    setLoading(true)
    setError('')
    setResults([])
    setSelected(null)

    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    try {
      // Search by brand name, then fallback to generic/ingredient
      const searches = [
        `openfda.brand_name:${encodeURIComponent(term)}`,
        `openfda.generic_name:${encodeURIComponent(term)}`,
        `openfda.substance_name:${encodeURIComponent(term)}`,
      ]

      let allResults = []
      for (const s of searches) {
        try {
          const res = await fetch(`${API}?search=${s}&limit=5`, { signal: abortRef.current.signal })
          const data = await res.json()
          if (data.results) allResults.push(...data.results)
        } catch {}
        if (allResults.length >= 5) break
      }

      // Deduplicate by brand+generic
      const seen = new Set()
      const unique = allResults.filter(r => {
        const key = JSON.stringify(r.openfda?.brand_name?.sort()) + JSON.stringify(r.openfda?.generic_name?.sort())
        if (seen.has(key)) return false
        seen.add(key)
        return true
      }).slice(0, 8)

      if (unique.length === 0) {
        setError(`No results for "${term}". Try a different name (e.g. ibuprofen, aspirin, metformin).`)
      } else {
        setResults(unique)
        setSelected(unique[0])
      }
    } catch (e) {
      if (e.name !== 'AbortError') setError('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getFieldValue = (drug, key) => {
    const val = drug[key]
    if (Array.isArray(val)) return val.join('\n')
    return val || null
  }

  const getOpenFDA = (drug) => drug.openfda || {}

  return (
    <>
      <Helmet>
        <title>Medicine Lookup - Drug Information Tool | UpTools</title>
        <meta name="description" content="Look up any medicine or drug. Get uses, dosage, warnings, side effects, and drug interactions instantly. Powered by OpenFDA." />
        <link rel="canonical" href="https://www.uptools.in/drug-information-tool/" />
        <meta property="og:title" content="Medicine Lookup - Drug Information Tool | UpTools" />
        <meta property="og:description" content="Look up any medicine or drug. Get uses, dosage, warnings, side effects, and drug interactions instantly." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "WebApplication",
          "name": "Medicine Lookup", "applicationCategory": "HealthApplication",
          "url": "https://www.uptools.in/drug-information-tool/",
          "description": "Look up drug information including uses, dosage, warnings, and side effects.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        }) }} />
      </Helmet>

      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">Medicine Lookup</span>
      </nav>

      <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/[0.06]"
        style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(17,24,39,0.3))' }}>
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: 'rgba(34,197,94,0.15)' }} />
        <div className="relative p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
              💊
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white m-0 tracking-tight leading-tight">Medicine Lookup</h1>
              <p className="text-sm text-slate-400 mt-1.5 max-w-lg leading-relaxed">Search any drug name to get uses, dosage, warnings, side effects & interactions. Powered by OpenFDA.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-5">
        {/* Search */}
        <div className="glass p-4">
          <form onSubmit={(e) => { e.preventDefault(); search() }} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search medicine (e.g. paracetamol, metformin, viagra)"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-green-500/50"
            />
            <button type="submit" disabled={loading} className="glow-btn px-5 py-3 text-sm shrink-0" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
              {loading ? '...' : '🔍 Search'}
            </button>
          </form>
          <p className="text-xs text-slate-400 mt-2">Try: ibuprofen, amoxicillin, metformin, omeprazole, aspirin, sildenafil</p>
        </div>

        {error && (
          <div className="glass p-4 border border-red-500/20">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="glass p-4">
            <h2 className="text-sm font-semibold text-slate-400 mb-3">Found {results.length} result{results.length > 1 ? 's' : ''}</h2>

            {/* Drug selector tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {results.map((drug, i) => {
                const fda = getOpenFDA(drug)
                const brand = fda.brand_name?.[0] || 'Unknown'
                const generic = fda.generic_name?.[0] || ''
                const isActive = selected === drug
                return (
                  <button
                    key={i}
                    onClick={() => { setSelected(drug); setActiveTab('indications_and_usage') }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'}`}
                  >
                    {brand}
                    {generic && <span className="text-slate-400 ml-1">({generic})</span>}
                  </button>
                )
              })}
            </div>

            {/* Selected drug details */}
            {selected && (
              <div>
                {/* Drug header */}
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">💊</span>
                    <div>
                      <h3 className="text-lg font-bold text-white m-0">
                        {getOpenFDA(selected).brand_name?.[0] || 'Unknown Drug'}
                      </h3>
                      {getOpenFDA(selected).generic_name?.[0] && (
                        <p className="text-xs text-slate-400 m-0">
                          Generic: {getOpenFDA(selected).generic_name.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  {getOpenFDA(selected).route?.[0] && (
                    <span className="inline-block bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded-full">
                      {getOpenFDA(selected).route.join(', ')}
                    </span>
                  )}
                  {getOpenFDA(selected).pharm_class_epc?.[0] && (
                    <span className="inline-block bg-blue-500/10 text-blue-400 text-xs px-2 py-0.5 rounded-full ml-2">
                      {getOpenFDA(selected).pharm_class_epc[0]}
                    </span>
                  )}
                </div>

                {/* Info tabs */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {FIELDS.filter(f => getFieldValue(selected, f.key)).map(f => (
                    <button
                      key={f.key}
                      onClick={() => setActiveTab(f.key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${activeTab === f.key ? 'bg-white/10 text-white border border-white/10' : 'text-slate-400 hover:text-slate-300'}`}
                    >
                      {f.icon} {f.label}
                    </button>
                  ))}
                </div>

                {/* Active field content */}
                {(() => {
                  const field = FIELDS.find(f => f.key === activeTab)
                  const value = getFieldValue(selected, activeTab)
                  if (!value) return <p className="text-sm text-slate-400">No data available for this section.</p>
                  return (
                    <div className="bg-white/5 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-white mb-2">{field?.icon} {field?.label}</h4>
                      <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line max-h-80 overflow-y-auto">
                        {value}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        )}

        <FAQ questions={[
          { q: 'Where does the drug data come from?', a: 'All data is sourced from OpenFDA, the US FDA\'s open data initiative. It includes official drug labeling information from the National Library of Medicine.' },
          { q: 'Is this a substitute for medical advice?', a: 'No. This tool is for informational purposes only. Always consult a doctor or pharmacist before taking any medication.' },
          { q: 'Why can\'t I find my medicine?', a: 'OpenFDA primarily covers US-approved drugs. If your medicine isn\'t found, try searching by its generic/ingredient name instead of brand name.' },
        ]} />

        <p className="text-center text-xs text-slate-400">
          Data from <a href="https://open.fda.gov" target="_blank" rel="noopener" className="text-green-400 hover:underline">OpenFDA</a> — for informational purposes only. Not medical advice.
        </p>
      </div>
    </>
  )
}
