import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const API = 'https://pokeapi.co/api/v2'
const PAGE_SIZE = 72

const toTitle = s => s.charAt(0).toUpperCase() + s.slice(1)
const fmt = v => v == null ? 'N/A' : String(v)

export default function pokemon_stats() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [search, setSearch] = useState('')
  const [allPokemon, setAllPokemon] = useState([])
  const [filtered, setFiltered] = useState([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [details, setDetails] = useState(null)
  const [status, setStatus] = useState('')
  const [exporting, setExporting] = useState(false)
  const cacheRef = useRef(new Map())
  const loadedRef = useRef(false)

  const loadAllPokemon = useCallback(async () => {
    if (loadedRef.current) return
    setStatus('Fetching Pokemon list...')
    try {
      const res = await fetch(`${API}/pokemon?limit=2000`)
      const data = await res.json()
      const list = data.results || []
      setAllPokemon(list)
      setFiltered(list)
      setStatus(`Loaded ${list.length} Pokemon.`)
      loadedRef.current = true
    } catch {
      setStatus('Failed to load Pokemon list.')
    }
  }, [])

  // Load on mount
  useState(() => { loadAllPokemon() })

  const applySearch = useCallback((q) => {
    const term = q.trim().toLowerCase()
    if (!term) { setFiltered(allPokemon) } else { setFiltered(allPokemon.filter(p => p.name.includes(term))) }
    setVisibleCount(PAGE_SIZE)
  }, [allPokemon])

  const loadDetails = useCallback(async (name) => {
    if (cacheRef.current.has(name)) { setDetails(cacheRef.current.get(name)); return }
    setStatus(`Loading ${name}...`)
    try {
      const res = await fetch(`${API}/pokemon/${name}`)
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      cacheRef.current.set(name, data)
      setDetails(data)
      setStatus('Ready.')
      jumpTo()
    } catch {
      setStatus('Failed to load Pokemon details.')
    }
  }, [jumpTo])

  const exportAllStats = useCallback(async () => {
    if (!allPokemon.length) return
    setExporting(true)
    setStatus('Exporting all stats. This can take a few minutes...')
    const rows = ['id,name,type_1,type_2,hp,attack,defense,special_attack,special_defense,speed,height,weight,base_experience,abilities']
    let done = 0
    for (const p of allPokemon) {
      try {
        const res = await fetch(`${API}/pokemon/${p.name}`)
        if (!res.ok) continue
        const data = await res.json()
        const types = data.types.map(t => t.type.name)
        const stats = {}
        data.stats.forEach(s => { stats[s.stat.name] = s.base_stat })
        const abilities = data.abilities.map(a => a.ability.name).join('|')
        rows.push([data.id, data.name, types[0] || '', types[1] || '', stats.hp || 0, stats.attack || 0, stats.defense || 0, stats['special-attack'] || 0, stats['special-defense'] || 0, stats.speed || 0, data.height || 0, data.weight || 0, data.base_experience || 0, abilities].join(','))
        done++
        if (done % 25 === 0) setStatus(`Exporting... ${done} / ${allPokemon.length}`)
        await new Promise(r => setTimeout(r, 80))
      } catch { continue }
    }
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'pokemon-stats.csv'
    document.body.appendChild(link); link.click(); link.remove()
    URL.revokeObjectURL(link.href)
    setStatus('Export complete.')
    setExporting(false)
  }, [allPokemon])

  const stats = details ? Object.fromEntries(details.stats.map(s => [s.stat.name, s.base_stat])) : null

  return (
    <ToolLayout
      title="Pokemon Stats"
      desc="Browse all Pokemon with stats, types, and CSV export."
      icon="⚡" iconBg="rgba(245,158,11,0.08)"
      category="fun" slug="pokemon-stats"
      faq={[
        { q: "Where does the data come from?", a: "Pokemon data is fetched from the free PokeAPI (pokeapi.co)." },
        { q: "Can I export all stats?", a: "Yes! Click 'Export CSV' to download stats for all Pokemon. This may take a few minutes." },
      ]}
      howItWorks={[
        "Browse or search Pokemon by name.",
        "Click a Pokemon to see detailed stats, types, and abilities.",
        "Export all stats to CSV for analysis.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Pokemon Stats", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/pokemon-stats/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Search & Export */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="flex gap-2">
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); applySearch(e.target.value) }}
              placeholder="Search Pokemon..."
              className="flex-1 bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-600" />
            <button onClick={exportAllStats} disabled={exporting}
              className="px-4 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all disabled:opacity-50">
              📥 CSV
            </button>
          </div>
          {status && <div className="text-xs text-slate-500 mt-2">{status}</div>}
        </div>

        {/* Pokemon List */}
        {filtered.length > 0 && !details && (
          <div>
            <div className="text-xs text-slate-500 mb-2">Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} Pokemon</div>
            <div className="flex flex-wrap gap-2" ref={resultRef}>
              {filtered.slice(0, visibleCount).map(p => (
                <button key={p.name} onClick={() => loadDetails(p.name)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all capitalize">
                  {p.name}
                </button>
              ))}
            </div>
            {visibleCount < filtered.length && (
              <button onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                className="w-full mt-3 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                Load More
              </button>
            )}
          </div>
        )}

        {/* Pokemon Details */}
        {details && (
          <div ref={resultRef} className="space-y-4">
            <button onClick={() => setDetails(null)}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-all">
              ← Back to list
            </button>
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6 flex items-center gap-4">
              {details.sprites?.front_default && (
                <img src={details.sprites.front_default} alt={details.name} width={80} height={80} className="pixelated" />
              )}
              <div>
                <div className="text-lg font-bold text-white capitalize">{details.name} <span className="text-xs text-slate-500">#{details.id}</span></div>
                <div className="text-xs text-slate-400">Height: {fmt(details.height)} | Weight: {fmt(details.weight)}</div>
                <div className="text-xs text-slate-400">Base Exp: {fmt(details.base_experience)}</div>
              </div>
            </div>

            {/* Types */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
              <div className="text-xs font-bold text-slate-400 mb-2">Types</div>
              <div className="flex gap-2 flex-wrap">
                {details.types.map(t => (
                  <span key={t.type.name} className="px-3 py-1 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 capitalize">
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Abilities */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
              <div className="text-xs font-bold text-slate-400 mb-2">Abilities</div>
              <div className="text-sm text-white capitalize">
                {details.abilities.map(a => a.ability.name).join(', ') || 'N/A'}
              </div>
            </div>

            {/* Stats */}
            {stats && (
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
                <div className="text-xs font-bold text-slate-400 mb-3">Base Stats</div>
                <div className="space-y-2">
                  {[
                    ['HP', stats.hp],
                    ['Attack', stats.attack],
                    ['Defense', stats.defense],
                    ['Sp. Atk', stats['special-attack']],
                    ['Sp. Def', stats['special-defense']],
                    ['Speed', stats.speed],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="text-xs text-slate-400 w-16">{label}</div>
                      <div className="flex-1 h-2 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (val / 255) * 100)}%` }} />
                      </div>
                      <div className="text-xs text-white font-semibold w-8 text-right">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!details && filtered.length === 0 && !status && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">⚡</div>
            <p className="text-sm text-slate-600 font-medium">Loading Pokemon data...</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
