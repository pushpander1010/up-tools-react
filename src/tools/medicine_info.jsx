import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const FIELDS = 'openfda.brand_name,openfda.generic_name,indications_and_usage,dosage_and_administration,warnings,drug_interactions,adverse_reactions,pregnancy_or_breast_feeding,purpose,active_ingredient,storage_and_handling,openfda.manufacturer_name,openfda.drug_class'

function fmt(v) {
  if (!v) return ''
  const t = typeof v === 'string' ? v : Array.isArray(v) ? v.join(', ') : String(v)
  return t.replace(/\n{3,}/g, '\n\n').trim()
}

export default function medicine_info() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(null)

  const search = useCallback(async () => {
    const q = query.trim()
    if (!q || q.length < 2) return
    setLoading(true)
    setError('')
    setResults(null)
    try {
      let r = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(q)}&limit=10`, { headers: { 'Accept': 'application/json' } })
      if (r.status === 404) {
        r = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.generic_name:${encodeURIComponent(q)}&limit=10`, { headers: { 'Accept': 'application/json' } })
      }
      if (!r.ok) {
        if (r.status === 404) throw new Error('No results found for "' + q + '"')
        throw new Error('API error: ' + r.status)
      }
      const d = await r.json()
      if (!d.results || d.results.length === 0) {
        throw new Error('No results found for "' + q + '"')
      }
      setResults(d.results)
      setTimeout(() => jumpTo(true), 100)
    } catch (e) {
      setError(e.message)
      jumpTo(false)
    }
    setLoading(false)
  }, [query, jumpTo])

  const handleKey = useCallback((e) => { if (e.key === 'Enter') search() }, [search])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout title="Medicine Information" desc="Search FDA-approved drug information — uses, dosage, warnings, side effects, and more."
      icon="💊" iconBg="rgba(99,102,241,0.08)" category="health" slug="medicine-info"
      faq={[
        { q: 'Where does this data come from?', a: 'All information is sourced from the openFDA API, the official database of FDA-approved drug labels in the United States.' },
        { q: 'Is this medical advice?', a: 'No. This tool provides reference information from FDA drug labels. Always consult a healthcare professional before taking any medication.' },
        { q: 'Can I search by brand or generic name?', a: 'Yes. You can search by brand name (e.g., Tylenol) or generic name (e.g., Acetaminophen).' },
        { q: 'What drugs are covered?', a: 'All FDA-approved drugs with published labeling information. This covers most prescription and OTC drugs available in the US.' },
      ]}
      howItWorks={[
        'Enter a drug name (brand or generic) in the search box.',
        'The tool queries the openFDA database for matching drug labels.',
        'Results show uses, dosage, warnings, side effects, interactions, and more.',
        'Click any result to expand and read full details.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Medicine Information Lookup", "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/medicine-info/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Search */}
        <div className="flex gap-3">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKey}
            placeholder="Search drug name (e.g., Tylenol, Metformin)..."
            className={inputClass} />
          <button onClick={search} disabled={loading || query.trim().length < 2}
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Search</span>
            ) : 'Search'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border-2 border-red-500/20 bg-red-500/5 p-5 text-center">
            <p className="text-sm text-red-400 font-medium">{error}</p>
          </div>
        )}

        {/* Results */}
        {results && (
          <div ref={resultRef} className="space-y-4">
            <p className="text-xs text-slate-500 font-medium">{results.length} result{results.length > 1 ? 's' : ''} found</p>
            {results.map((drug, i) => {
              const brand = drug.openfda?.brand_name?.[0] || ''
              const generic = drug.openfda?.generic_name?.[0] || ''
              const name = brand || generic || 'Unknown'
              const isOpen = expanded === i
              return (
                <div key={i}
                  className="rounded-3xl border-2 border-indigo-500/10 bg-gradient-to-br from-indigo-500/[0.04] via-white/[0.01] to-transparent p-5 cursor-pointer hover:border-indigo-500/20 transition-all"
                  onClick={() => setExpanded(isOpen ? null : i)}
                  style={{ animation: 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl">{isOpen ? '▼' : '▶'}</span>
                    <div>
                      <h3 className="text-base font-bold text-white">{brand || generic}</h3>
                      {brand && generic && <p className="text-xs text-slate-500">{generic}</p>}
                      {drug.openfda?.manufacturer_name && (
                        <p className="text-xs text-slate-600 mt-0.5">{drug.openfda.manufacturer_name[0]}</p>
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4 space-y-4 border-t border-white/[0.06] pt-4">
                      {drug.purpose && (
                        <Section title="Purpose" text={fmt(drug.purpose)} />
                      )}
                      {drug.indications_and_usage && (
                        <Section title="Uses" text={fmt(drug.indications_and_usage)} />
                      )}
                      {drug.dosage_and_administration && (
                        <Section title="Dosage & Administration" text={fmt(drug.dosage_and_administration)} />
                      )}
                      {drug.warnings && (
                        <Section title="Warnings" text={fmt(drug.warnings)} />
                      )}
                      {drug.drug_interactions && (
                        <Section title="Drug Interactions" text={fmt(drug.drug_interactions)} />
                      )}
                      {drug.adverse_reactions && (
                        <Section title="Side Effects" text={fmt(drug.adverse_reactions)} />
                      )}
                      {drug.pregnancy_or_breast_feeding && (
                        <Section title="Pregnancy & Breastfeeding" text={fmt(drug.pregnancy_or_breast_feeding)} />
                      )}
                      {drug.active_ingredient && (
                        <Section title="Active Ingredient" text={fmt(drug.active_ingredient)} />
                      )}
                      {drug.storage_and_handling && (
                        <Section title="Storage & Handling" text={fmt(drug.storage_and_handling)} />
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Empty state */}
        {!results && !error && (
          <div className="text-center py-16 rounded-3xl border-2 border-dashed border-white/[0.06] bg-white/[0.01]">
            <div className="text-5xl mb-4 opacity-20">💊</div>
            <p className="text-sm text-slate-600 font-medium">Enter a drug name to look up FDA-approved information</p>
            <p className="text-xs text-slate-700 mt-1">Brand names (Tylenol, Advil) and generic names (Acetaminophen, Ibuprofen) both work</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}

function Section({ title, text }) {
  return (
    <div>
      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1.5">{title}</h4>
      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  )
}
