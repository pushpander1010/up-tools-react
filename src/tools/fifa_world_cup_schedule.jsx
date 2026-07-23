import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const MATCHES = [
  { date:'Jun 11', home:'Mexico', away:'South Africa', venue:'Estadio Azteca, Mexico City', time:'4:00 PM', round:'Group A', filter:'group' },
  { date:'Jun 11', home:'South Korea', away:'Czech Republic', venue:'Estadio Akron, Guadalajara', time:'8:00 PM', round:'Group A', filter:'group' },
  { date:'Jun 12', home:'Canada', away:'Bosnia', venue:'BMO Field, Toronto', time:'3:00 PM', round:'Group B', filter:'group' },
  { date:'Jun 12', home:'USA', away:'Paraguay', venue:'SoFi Stadium, Los Angeles', time:'8:00 PM', round:'Group D', filter:'group' },
  { date:'Jun 13', home:'Qatar', away:'Switzerland', venue:"Levi's Stadium, Santa Clara", time:'2:00 PM', round:'Group B', filter:'group' },
  { date:'Jun 13', home:'Brazil', away:'Morocco', venue:'MetLife Stadium, East Rutherford', time:'5:00 PM', round:'Group C', filter:'group' },
  { date:'Jun 13', home:'Haiti', away:'Scotland', venue:'Gillette Stadium, Foxborough', time:'8:00 PM', round:'Group C', filter:'group' },
  { date:'Jun 13', home:'Australia', away:'Turkey', venue:'BC Place, Vancouver', time:'9:30 PM', round:'Group D', filter:'group' },
  { date:'Jun 18', home:'Czech Republic', away:'South Africa', venue:'Estadio Akron, Guadalajara', time:'2:00 PM', round:'Group A', filter:'group' },
  { date:'Jun 18', home:'Mexico', away:'South Korea', venue:'Estadio Azteca, Mexico City', time:'5:00 PM', round:'Group A', filter:'group' },
  { date:'Jun 18', home:'Switzerland', away:'Bosnia', venue:'BMO Field, Toronto', time:'8:00 PM', round:'Group B', filter:'group' },
  { date:'Jun 18', home:'Canada', away:'Qatar', venue:'BC Place, Vancouver', time:'9:30 PM', round:'Group B', filter:'group' },
  { date:'Jun 19', home:'Scotland', away:'Morocco', venue:'Gillette Stadium, Foxborough', time:'2:00 PM', round:'Group C', filter:'group' },
  { date:'Jun 19', home:'Brazil', away:'Haiti', venue:'MetLife Stadium, East Rutherford', time:'5:00 PM', round:'Group C', filter:'group' },
  { date:'Jun 19', home:'USA', away:'Australia', venue:'SoFi Stadium, Los Angeles', time:'8:00 PM', round:'Group D', filter:'group' },
  { date:'Jun 19', home:'Turkey', away:'Paraguay', venue:'Estadio Azteca, Mexico City', time:'9:30 PM', round:'Group D', filter:'group' },
  { date:'Jun 24', home:'Czech Republic', away:'Mexico', venue:'Estadio Azteca, Mexico City', time:'4:00 PM', round:'Group A', filter:'group' },
  { date:'Jun 24', home:'South Africa', away:'South Korea', venue:'Estadio Akron, Guadalajara', time:'4:00 PM', round:'Group A', filter:'group' },
  { date:'Jun 24', home:'Switzerland', away:'Canada', venue:'BMO Field, Toronto', time:'4:00 PM', round:'Group B', filter:'group' },
  { date:'Jun 24', home:'Bosnia', away:'Qatar', venue:'BC Place, Vancouver', time:'4:00 PM', round:'Group B', filter:'group' },
  { date:'Jun 24', home:'Scotland', away:'Brazil', venue:'MetLife Stadium, East Rutherford', time:'4:00 PM', round:'Group C', filter:'group' },
  { date:'Jun 24', home:'Morocco', away:'Haiti', venue:'Gillette Stadium, Foxborough', time:'4:00 PM', round:'Group C', filter:'group' },
  { date:'Jun 25', home:'Turkey', away:'USA', venue:'SoFi Stadium, Los Angeles', time:'4:00 PM', round:'Group D', filter:'group' },
  { date:'Jun 25', home:'Paraguay', away:'Australia', venue:'Estadio Akron, Guadalajara', time:'4:00 PM', round:'Group D', filter:'group' },
  { date:'Jun 11-27', home:'Groups E-L', away:'Various teams', venue:'Various', time:'Varied', round:'Groups E-L', filter:'group' },
  { date:'Jun 28', home:'1A vs 3E/F/G/H', away:'', venue:'SoFi Stadium, Los Angeles', time:'4:00 PM', round:'R32', filter:'r32' },
  { date:'Jun 29', home:'2C vs 2D', away:'', venue:'MetLife Stadium, East Rutherford', time:'4:00 PM', round:'R32', filter:'r32' },
  { date:'Jun 30', home:'1E vs 3A/B/C/D', away:'', venue:'BC Place, Vancouver', time:'4:00 PM', round:'R32', filter:'r32' },
  { date:'Jul 1', home:'2A vs 2B', away:'', venue:'Estadio Azteca, Mexico City', time:'4:00 PM', round:'R32', filter:'r32' },
  { date:'Jul 2', home:'1F vs 3C/D/E/F', away:'', venue:"Levi's Stadium, Santa Clara", time:'4:00 PM', round:'R32', filter:'r32' },
  { date:'Jul 3', home:'1G vs 3H/I/J/K', away:'', venue:'Gillette Stadium, Foxborough', time:'4:00 PM', round:'R32', filter:'r32' },
  { date:'Jul 4', home:'Winner R32-1', away:'Winner R32-2', venue:'SoFi Stadium, Los Angeles', time:'4:00 PM', round:'R16', filter:'knockout' },
  { date:'Jul 5', home:'Winner R32-3', away:'Winner R32-4', venue:'Estadio Azteca, Mexico City', time:'4:00 PM', round:'R16', filter:'knockout' },
  { date:'Jul 6', home:'Winner R32-5', away:'Winner R32-6', venue:'MetLife Stadium, East Rutherford', time:'4:00 PM', round:'R16', filter:'knockout' },
  { date:'Jul 7', home:'Winner R32-7', away:'Winner R32-8', venue:'BC Place, Vancouver', time:'4:00 PM', round:'R16', filter:'knockout' },
  { date:'Jul 9', home:'QF1', away:'', venue:'SoFi Stadium, Los Angeles', time:'4:00 PM', round:'QF', filter:'knockout' },
  { date:'Jul 10', home:'QF2', away:'', venue:'Estadio Azteca, Mexico City', time:'4:00 PM', round:'QF', filter:'knockout' },
  { date:'Jul 11', home:'QF3 + QF4', away:'', venue:'MetLife / BC Place', time:'4:00 PM', round:'QF', filter:'knockout' },
  { date:'Jul 14', home:'SF1', away:'', venue:'SoFi Stadium, Los Angeles', time:'4:00 PM', round:'SF', filter:'knockout' },
  { date:'Jul 15', home:'SF2', away:'', venue:'MetLife Stadium, East Rutherford', time:'4:00 PM', round:'SF', filter:'knockout' },
  { date:'Jul 18', home:'Third Place', away:'', venue:'Estadio Azteca, Mexico City', time:'4:00 PM', round:'3rd Place', filter:'knockout' },
  { date:'Jul 19', home:'Spain', away:'Argentina', venue:'MetLife Stadium, East Rutherford', time:'7:00 PM', round:'FINAL', filter:'knockout', final: true },
]

const FILTERS = [
  { key: 'all', label: 'All Matches' },
  { key: 'group', label: 'Group Stage' },
  { key: 'r32', label: 'Round of 32' },
  { key: 'knockout', label: 'Knockout' },
]

const badgeClass = (filter) => {
  if (filter === 'group') return 'bg-emerald-500/20 text-emerald-400'
  if (filter === 'r32') return 'bg-amber-500/20 text-amber-400'
  return 'bg-rose-500/20 text-rose-400'
}

export default function fifa_world_cup_schedule() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return MATCHES
    if (activeFilter === 'knockout') return MATCHES.filter(m => m.filter === 'r32' || m.filter === 'knockout')
    return MATCHES.filter(m => m.filter === activeFilter)
  }, [activeFilter])

  return (
    <ToolLayout
      title="FIFA World Cup 2026 Full Schedule"
      desc="Complete FIFA World Cup 2026 schedule with all 104 matches, dates, venues and times."
      icon="⚽" iconBg="rgba(59,130,246,0.08)"
      category="fifa" slug="fifa-world-cup-schedule"
      faq={[
        { q: "What is the FIFA World Cup 2026 schedule?", a: "The 2026 FIFA World Cup features 104 matches across 16 venues in USA, Canada, and Mexico from June 11 to July 19, 2026." },
        { q: "How many teams are in the 2026 World Cup?", a: "48 teams compete in 12 groups of 4, with the top teams advancing to a Round of 32 knockout stage." },
      ]}
      howItWorks={[
        "Browse the full schedule of all 104 matches.",
        "Filter by stage: Group Stage, Round of 32, or Knockout rounds.",
        "Check dates, venues, and kick-off times (ET).",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SportsEvent",
        name: "FIFA World Cup 2026", startDate: "2026-06-11", endDate: "2026-07-19",
        location: { "@type": "Place", name: "United States, Canada, Mexico" },
        url: "https://www.uptools.in/fifa-world-cup-schedule/",
      }}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2" ref={resultRef}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => { setActiveFilter(f.key); jumpTo() }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeFilter === f.key ? 'bg-indigo-500 text-white' : 'bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Schedule table */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Match</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase hidden sm:table-cell">Venue</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Time</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Round</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={i} className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${m.final ? 'bg-indigo-500/5' : ''}`}>
                  <td className="px-4 py-3 text-slate-300 font-medium whitespace-nowrap">{m.date}</td>
                  <td className="px-4 py-3 text-white font-semibold">
                    {m.home}
                    {m.away ? <> vs {m.away}</> : null}
                    {m.final && <span className="ml-2 text-xs text-indigo-400 font-bold">FINAL</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-400 hidden sm:table-cell">{m.venue}</td>
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{m.time}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold ${badgeClass(m.filter)}`}>
                      {m.round}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center text-xs text-slate-600">
          Showing {filtered.length} of {MATCHES.length} matches · All times in Eastern Time (ET)
        </div>
      </div>
    </ToolLayout>
  )
}
