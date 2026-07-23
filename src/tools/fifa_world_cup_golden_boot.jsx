import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const PLAYERS = [
  { rank:1, name:'Kylian Mbappé', flag:'🇫🇷', country:'France', goals:10, assists:4 },
  { rank:2, name:'Lionel Messi', flag:'🇦🇷', country:'Argentina', goals:8, assists:4 },
  { rank:3, name:'Jude Bellingham', flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', country:'England', goals:7, assists:0 },
  { rank:4, name:'Erling Haaland', flag:'🇳🇴', country:'Norway', goals:6, assists:0 },
  { rank:5, name:'Harry Kane', flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', country:'England', goals:6, assists:0 },
  { rank:6, name:'Ousmane Dembélé', flag:'🇫🇷', country:'France', goals:6, assists:0 },
  { rank:7, name:'Cristiano Ronaldo', flag:'🇵🇹', country:'Portugal', goals:5, assists:0 },
  { rank:8, name:'Vinícius Júnior', flag:'🇧🇷', country:'Brazil', goals:5, assists:0 },
  { rank:9, name:'Julián Álvarez', flag:'🇦🇷', country:'Argentina', goals:5, assists:0 },
  { rank:10, name:'Lautaro Martínez', flag:'🇦🇷', country:'Argentina', goals:5, assists:0 },
  { rank:11, name:'Deniz Undav', flag:'🇩🇪', country:'Germany', goals:5, assists:0 },
  { rank:12, name:'Bukayo Saka', flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', country:'England', goals:5, assists:0 },
]

const rankStyle = (r) => {
  if (r === 1) return 'bg-amber-500/20 text-amber-400 font-extrabold'
  if (r === 2) return 'bg-slate-300/10 text-slate-300 font-bold'
  if (r === 3) return 'bg-amber-700/20 text-amber-600 font-bold'
  return 'text-slate-500'
}

export default function fifa_world_cup_golden_boot() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('rank')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useMemo(() => {
    let list = [...PLAYERS]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.country.toLowerCase().includes(q))
    }
    list.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey]
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return list
  }, [search, sortKey, sortDir])

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    jumpTo()
  }

  const SortArrow = ({ col }) => {
    if (sortKey !== col) return <span className="text-slate-700 ml-1">⇅</span>
    return <span className="text-indigo-400 ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>
  }

  return (
    <ToolLayout
      title="FIFA World Cup 2026 Golden Boot"
      desc="Top scorers of the 2026 FIFA World Cup. Goals, assists, and player rankings."
      icon="🥇" iconBg="rgba(234,179,8,0.08)"
      category="fifa" slug="fifa-world-cup-golden-boot"
      faq={[
        { q: "Who won the 2026 Golden Boot?", a: "Kylian Mbappé (France) won with 10 goals, followed by Lionel Messi (Argentina) with 8 goals." },
        { q: "How is the ranking determined?", a: "By total goals scored. Assists are used as a tiebreaker." },
      ]}
      howItWorks={[
        "Browse the top scorers table with goals and assists.",
        "Click column headers to sort by any stat.",
        "Search by player name or country to filter.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "FIFA World Cup 2026 Golden Boot",
        url: "https://www.uptools.in/fifa-world-cup-golden-boot/",
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6" ref={resultRef}>
        {/* Search */}
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search player or country..."
          className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3 text-white text-sm outline-none focus:border-amber-500/40 placeholder:text-slate-600" />

        {/* Table */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {[['rank','Rank'],['name','Player'],['country','Country'],['goals','Goals'],['assists','Assists']].map(([k,l]) => (
                  <th key={k} onClick={() => toggleSort(k)}
                    className={`px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:text-white transition-colors ${sortKey === k ? 'text-indigo-400' : 'text-slate-500'}`}>
                    {l}<SortArrow col={k} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.rank} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className={`px-3 py-2.5 rounded-l-lg ${rankStyle(p.rank)}`}>{p.rank}</td>
                  <td className="px-3 py-2.5 text-white font-semibold">{p.name}</td>
                  <td className="px-3 py-2.5 text-slate-300">{p.flag} {p.country}</td>
                  <td className="px-3 py-2.5 text-amber-400 font-bold">{p.goals}</td>
                  <td className="px-3 py-2.5 text-slate-400">{p.assists}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-600 text-sm">No players match your search.</div>
        )}
      </div>
    </ToolLayout>
  )
}
