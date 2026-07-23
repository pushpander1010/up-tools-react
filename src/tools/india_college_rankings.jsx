import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

const COLLEGES = [
  { rank: 1, name: 'Indian Institute of Technology Delhi', location: 'Delhi', category: 'engineering', state: 'delhi' },
  { rank: 2, name: 'Indian Institute of Technology Bombay', location: 'Mumbai', category: 'engineering', state: 'maharashtra' },
  { rank: 3, name: 'Indian Institute of Technology Madras', location: 'Chennai', category: 'engineering', state: 'tamil-nadu' },
  { rank: 4, name: 'All India Institute of Medical Sciences Delhi', location: 'Delhi', category: 'medical', state: 'delhi' },
  { rank: 5, name: 'Delhi University', location: 'Delhi', category: 'arts', state: 'delhi' },
  { rank: 6, name: 'Mumbai University', location: 'Mumbai', category: 'commerce', state: 'maharashtra' },
  { rank: 7, name: 'National Law School of India', location: 'Bangalore', category: 'law', state: 'karnataka' },
  { rank: 8, name: 'Indian Institute of Technology Kanpur', location: 'Kanpur', category: 'engineering', state: 'uttar-pradesh' },
]

const CATEGORIES = ['', 'engineering', 'medical', 'commerce', 'arts', 'law']
const STATES = ['', 'delhi', 'maharashtra', 'karnataka', 'tamil-nadu', 'uttar-pradesh']

export default function india_college_rankings() {
  const [category, setCategory] = useState('')
  const [state, setState] = useState('')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return COLLEGES.filter(c => {
      const matchCat = !category || c.category === category
      const matchState = !state || c.state === state
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchState && matchSearch
    })
  }, [category, state, search])

  const reset = useCallback(() => { setCategory(''); setState(''); setSearch('') }, [])

  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="India College Rankings"
      desc="Explore India's top colleges and universities with comprehensive rankings. Filter by category, location, and specialization."
      icon="📚" iconBg="rgba(99,102,241,0.08)"
      category="education" slug="india-college-rankings"
      faq={[
        { q: "How are colleges ranked?", a: "Based on academic reputation, faculty quality, research output, placement records, and infrastructure." },
        { q: "Can I filter by category?", a: "Yes, filter by Engineering, Medical, Commerce, Arts, or Law." },
      ]}
      howItWorks={["Select category and state filters", "Search by college name", "View ranked results"]}
      schema={{"@context":"https://schema.org","@type":"SoftwareApplication","name":"India College Rankings","applicationCategory":"EducationalApplication","url":"https://www.uptools.in/india-college-rankings/","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Filters */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={selectClass}>
                <option value="">All Categories</option>
                {CATEGORIES.filter(Boolean).map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">State</label>
              <select value={state} onChange={e => setState(e.target.value)} className={selectClass}>
                <option value="">All States</option>
                {STATES.filter(Boolean).map(s => <option key={s} value={s}>{s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Search</label>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="College name..."
                className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]" />
            </div>
          </div>
          <button onClick={reset}
            className="px-5 py-2 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 text-sm font-semibold hover:bg-white/10 transition-all">
            Reset Filters
          </button>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
              <div className="text-4xl mb-3 opacity-20">📚</div>
              <p className="text-sm text-slate-600 font-medium">No colleges found matching your filters</p>
            </div>
          ) : (
            filtered.map(c => (
              <div key={c.rank} className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5 flex items-center justify-between hover:border-indigo-500/20 transition-all">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-indigo-400 w-8 text-center">#{c.rank}</span>
                  <div>
                    <h3 className="text-white font-bold text-sm">{c.name}</h3>
                    <p className="text-xs text-slate-500">📍 {c.location}</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1.5 rounded-full bg-indigo-500/15 text-indigo-400 font-semibold capitalize">{c.category}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
