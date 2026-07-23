import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const WINNERS_DATA = [
  { year:1930, host:"Uruguay", winner:"Uruguay", runnerUp:"Argentina", score:"4–2", flagWinner:"🇺🇾", flagRunner:"🇦🇷", flagHost:"🇺🇾" },
  { year:1934, host:"Italy", winner:"Italy", runnerUp:"Czechoslovakia", score:"2–1", flagWinner:"🇮🇹", flagRunner:"🇨🇿", flagHost:"🇮🇹" },
  { year:1938, host:"France", winner:"Italy", runnerUp:"Hungary", score:"4–2", flagWinner:"🇮🇹", flagRunner:"🇭🇺", flagHost:"🇫🇷" },
  { year:1950, host:"Brazil", winner:"Uruguay", runnerUp:"Brazil", score:"2–1", flagWinner:"🇺🇾", flagRunner:"🇧🇷", flagHost:"🇧🇷" },
  { year:1954, host:"Switzerland", winner:"West Germany", runnerUp:"Hungary", score:"3–2", flagWinner:"🇩🇪", flagRunner:"🇭🇺", flagHost:"🇨🇭" },
  { year:1958, host:"Sweden", winner:"Brazil", runnerUp:"Sweden", score:"5–2", flagWinner:"🇧🇷", flagRunner:"🇸🇪", flagHost:"🇸🇪" },
  { year:1962, host:"Chile", winner:"Brazil", runnerUp:"Czechoslovakia", score:"3–1", flagWinner:"🇧🇷", flagRunner:"🇨🇿", flagHost:"🇨🇱" },
  { year:1966, host:"England", winner:"England", runnerUp:"West Germany", score:"4–2", flagWinner:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", flagRunner:"🇩🇪", flagHost:"🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { year:1970, host:"Mexico", winner:"Brazil", runnerUp:"Italy", score:"4–1", flagWinner:"🇧🇷", flagRunner:"🇮🇹", flagHost:"🇲🇽" },
  { year:1974, host:"West Germany", winner:"West Germany", runnerUp:"Netherlands", score:"2–1", flagWinner:"🇩🇪", flagRunner:"🇳🇱", flagHost:"🇩🇪" },
  { year:1978, host:"Argentina", winner:"Argentina", runnerUp:"Netherlands", score:"3–1", flagWinner:"🇦🇷", flagRunner:"🇳🇱", flagHost:"🇦🇷" },
  { year:1982, host:"Spain", winner:"Italy", runnerUp:"West Germany", score:"3–1", flagWinner:"🇮🇹", flagRunner:"🇩🇪", flagHost:"🇪🇸" },
  { year:1986, host:"Mexico", winner:"Argentina", runnerUp:"West Germany", score:"3–2", flagWinner:"🇦🇷", flagRunner:"🇩🇪", flagHost:"🇲🇽" },
  { year:1990, host:"Italy", winner:"West Germany", runnerUp:"Argentina", score:"1–0", flagWinner:"🇩🇪", flagRunner:"🇦🇷", flagHost:"🇮🇹" },
  { year:1994, host:"USA", winner:"Brazil", runnerUp:"Italy", score:"0–0 (3–2 p)", flagWinner:"🇧🇷", flagRunner:"🇮🇹", flagHost:"🇺🇸" },
  { year:1998, host:"France", winner:"France", runnerUp:"Brazil", score:"3–0", flagWinner:"🇫🇷", flagRunner:"🇧🇷", flagHost:"🇫🇷" },
  { year:2002, host:"South Korea/Japan", winner:"Brazil", runnerUp:"Germany", score:"2–0", flagWinner:"🇧🇷", flagRunner:"🇩🇪", flagHost:"🇰🇷🇯🇵" },
  { year:2006, host:"Germany", winner:"Italy", runnerUp:"France", score:"1–1 (5–3 p)", flagWinner:"🇮🇹", flagRunner:"🇫🇷", flagHost:"🇩🇪" },
  { year:2010, host:"South Africa", winner:"Spain", runnerUp:"Netherlands", score:"1–0", flagWinner:"🇪🇸", flagRunner:"🇳🇱", flagHost:"🇿🇦" },
  { year:2014, host:"Brazil", winner:"Germany", runnerUp:"Argentina", score:"1–0", flagWinner:"🇩🇪", flagRunner:"🇦🇷", flagHost:"🇧🇷" },
  { year:2018, host:"Russia", winner:"France", runnerUp:"Croatia", score:"4–2", flagWinner:"🇫🇷", flagRunner:"🇭🇷", flagHost:"🇷🇺" },
  { year:2022, host:"Qatar", winner:"Argentina", runnerUp:"France", score:"3–3 (4–2 p)", flagWinner:"🇦🇷", flagRunner:"🇫🇷", flagHost:"🇶🇦" },
  { year:2026, host:"USA/Canada/Mexico", winner:"Spain", runnerUp:"Argentina", score:"1–0", flagWinner:"🇪🇸", flagRunner:"🇦🇷", flagHost:"🇺🇸🇨🇦🇲🇽" },
]

const TROPHY_TALLY = [
  { team: 'Brazil', flag: '🇧🇷', wins: 5 },
  { team: 'Germany', flag: '🇩🇪', wins: 4 },
  { team: 'Italy', flag: '🇮🇹', wins: 4 },
  { team: 'Argentina', flag: '🇦🇷', wins: 3 },
  { team: 'France', flag: '🇫🇷', wins: 2 },
  { team: 'Uruguay', flag: '🇺🇾', wins: 2 },
  { team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', wins: 1 },
  { team: 'Spain', flag: '🇪🇸', wins: 2 },
]

const DECADES = ['All', '1930s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s']
const DECADE_MAP = { '1930s': 1930, '1950s': 1950, '1960s': 1960, '1970s': 1970, '1980s': 1980, '1990s': 1990, '2000s': 2000, '2010s': 2010, '2020s': 2020 }

function normalizeTeam(name) {
  return name === 'West Germany' ? 'Germany' : name
}

export default function fifa_world_cup_trophy_counter() {
  const [decade, setDecade] = useState('All')
  const [country, setCountry] = useState('all')
  const [highlightTeam, setHighlightTeam] = useState(null)

  const filteredData = useMemo(() => {
    return WINNERS_DATA.filter(t => {
      const normalizedWinner = normalizeTeam(t.winner)
      if (decade !== 'All') {
        const d = DECADE_MAP[decade]
        const tDecade = Math.floor(t.year / 10) * 10
        if (tDecade !== d) return false
      }
      if (country !== 'all' && normalizedWinner !== country) return false
      return true
    })
  }, [decade, country])

  const handleTeamClick = (team) => {
    setHighlightTeam(prev => prev === team ? null : team)
  }

  return (
    <ToolLayout
      title="FIFA World Cup Trophy History"
      desc="Complete FIFA World Cup winners list from 1930 to 2026. Every tournament: host, winner, runner-up, score. Stats, bar chart, filter by decade or country."
      icon="🏆" iconBg="rgba(234,179,8,0.08)"
      category="fifa" slug="fifa-world-cup-trophy-counter"
      faq={[
        { q: "Which country has won the most FIFA World Cups?", a: "Brazil holds the record with 5 World Cup titles (1958, 1962, 1970, 1994, 2002). They are the only team to have participated in every tournament." },
        { q: "How many World Cups has Germany won?", a: "Germany has won 4 World Cups (1954 as West Germany, 1974 as West Germany, 1990 as West Germany, and 2014)." },
        { q: "Who won the 2022 FIFA World Cup?", a: "Argentina won the 2022 FIFA World Cup in Qatar, defeating France 3-3 (4-2 on penalties)." },
        { q: "When did the first FIFA World Cup take place?", a: "The first FIFA World Cup was held in 1930 in Uruguay. Host nation Uruguay won the tournament." },
        { q: "How many countries have won the World Cup?", a: "Eight countries have won the FIFA World Cup: Brazil (5), Germany (4), Italy (4), Argentina (3), France (2), Uruguay (2), England (1), Spain (2)." },
        { q: "Has any team won back-to-back World Cups?", a: "Yes, Italy (1934, 1938) and Brazil (1958, 1962). No team has won three in a row." },
      ]}
      howItWorks={[
        "Browse the complete winners list from 1930 to 2026.",
        "Filter by decade or country to focus on specific eras.",
        "Click team names to highlight all their wins across history.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        name: "FIFA World Cup Trophy History",
        url: "https://www.uptools.in/fifa-world-cup-trophy-counter/",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Trophy Tally */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <h2 className="text-sm font-bold text-white mb-3">🏅 Trophy Tally</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {TROPHY_TALLY.map(t => (
              <button key={t.team} onClick={() => handleTeamClick(normalizeTeam(t.team))}
                className={`p-2 rounded-xl text-center transition-all ${highlightTeam === normalizeTeam(t.team) ? 'bg-amber-500/15 border border-amber-500/30' : 'bg-black/20 border border-white/[0.04] hover:border-white/[0.12]'}`}>
                <div className="text-lg">{t.flag}</div>
                <div className="text-lg font-extrabold text-white">{t.wins}</div>
                <div className="text-[9px] text-slate-500">{t.team}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <h2 className="text-sm font-bold text-white mb-3">📊 Wins by Country</h2>
          <div className="space-y-2">
            {TROPHY_TALLY.map(t => {
              const pct = (t.wins / 5) * 100
              return (
                <button key={t.team} onClick={() => handleTeamClick(normalizeTeam(t.team))}
                  className={`w-full flex items-center gap-2 text-left transition-all ${highlightTeam === normalizeTeam(t.team) ? 'opacity-100' : highlightTeam ? 'opacity-40' : 'opacity-100'}`}>
                  <span className="text-xs w-20 text-slate-400 shrink-0">{t.flag} {t.team}</span>
                  <div className="flex-1 h-6 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700 flex items-center justify-end pr-2"
                      style={{ width: `${pct}%` }}>
                      <span className="text-[10px] font-bold text-black">{t.wins}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <h2 className="text-sm font-bold text-white mb-3">🔍 Filter Tournaments</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {DECADES.map(d => (
              <button key={d} onClick={() => setDecade(d)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${decade === d ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'}`}>
                {d}
              </button>
            ))}
          </div>
          <select value={country} onChange={e => setCountry(e.target.value)}
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]">
            <option value="all" className="bg-gray-900">All Countries</option>
            {TROPHY_TALLY.map(t => (
              <option key={t.team} value={t.team} className="bg-gray-900">{t.flag} {t.team}</option>
            ))}
          </select>
        </div>

        {/* Timeline */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <h2 className="text-sm font-bold text-white mb-1">📅 Every World Cup Winner</h2>
          <p className="text-[10px] text-slate-600 mb-3">Click a team name to highlight all their wins.</p>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredData.map(t => {
              const nw = normalizeTeam(t.winner)
              const isHighlighted = highlightTeam && nw === highlightTeam
              const isDimmed = highlightTeam && !isHighlighted
              return (
                <div key={t.year} className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${isHighlighted ? 'bg-amber-500/10 border border-amber-500/20' : isDimmed ? 'opacity-30' : 'bg-black/20 border border-white/[0.04]'}`}>
                  <div className="text-sm font-extrabold text-amber-400 w-10 shrink-0">{t.year}</div>
                  <div className="text-[10px] text-slate-500 w-20 shrink-0">{t.flagHost} {t.host}</div>
                  <div className="flex-1 min-w-0">
                    <button onClick={() => handleTeamClick(nw)}
                      className={`text-xs font-bold transition-all ${isHighlighted ? 'text-amber-400' : 'text-white hover:text-amber-400'}`}>
                      {t.flagWinner} {t.winner}
                    </button>
                    <span className="text-[10px] text-slate-600 mx-1">vs</span>
                    <span className="text-[11px] text-slate-400">{t.flagRunner} {t.runnerUp}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 shrink-0">{t.score}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
