import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'

const API = 'https://api.balldontlie.io/v1'
const API_KEY = 'demo'

export default function nba_stats() {
  const [tab, setTab] = useState('players')
  const [searchQuery, setSearchQuery] = useState('')
  const [players, setPlayers] = useState([])
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [playerStats, setPlayerStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [gameDate, setGameDate] = useState(new Date().toISOString().split('T')[0])
  const [games, setGames] = useState([])
  const [gamesLoading, setGamesLoading] = useState(false)
  const searchTimeout = useRef(null)

  const searchPlayers = useCallback(async (q) => {
    if (!q || q.length < 2) { setPlayers([]); return }
    setLoading(true)
    setError('')
    try {
      const r = await fetch(`${API}/players?search=${encodeURIComponent(q)}`, { headers: { 'Authorization': API_KEY } })
      const d = await r.json()
      setPlayers(d.data || [])
      if (!d.data || d.data.length === 0) setError('No players found.')
    } catch { setError('API error — try again later.') }
    setLoading(false)
  }, [])

  const handleSearchInput = useCallback((val) => {
    setSearchQuery(val)
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => searchPlayers(val), 400)
  }, [searchPlayers])

  const showPlayer = useCallback(async (id, name) => {
    setSelectedPlayer(name)
    setPlayerStats(null)
    setLoading(true)
    setError('')
    try {
      const [avgR, gameR] = await Promise.all([
        fetch(`${API}/season_averages?player_ids[]=${id}`, { headers: { 'Authorization': API_KEY } }),
        fetch(`${API}/stats?player_ids[]=${id}&per_page=10&sort=date&order=desc`, { headers: { 'Authorization': API_KEY } })
      ])
      const avgD = await avgR.json()
      const gameD = await gameR.json()
      setPlayerStats({ averages: avgD.data?.[0] || null, recentGames: gameD.data || [] })
    } catch { setError('Could not load player stats.') }
    setLoading(false)
  }, [])

  const fetchGames = useCallback(async (date) => {
    setGamesLoading(true)
    setError('')
    try {
      const r = await fetch(`${API}/games?dates[]=${date}&per_page=25`, { headers: { 'Authorization': API_KEY } })
      const d = await r.json()
      setGames(d.data || [])
      if (!d.data || d.data.length === 0) setError('No games found for this date.')
    } catch { setError('Could not load games.') }
    setGamesLoading(false)
  }, [])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const btnClass = "px-6 py-3.5 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98]"

  return (
    <ToolLayout
      title="NBA Stats"
      desc="Look up NBA player stats, team standings, and game scores. Free live NBA statistics tool with search and player comparison."
      icon="🏀" iconBg="rgba(234,88,12,0.08)"
      category="sports" slug="nba-stats"
      faq={[
        { q: 'Where does NBA data come from?', a: 'From the balldontlie API, a free open-source NBA statistics API with no authentication required.' },
        { q: 'Can I search for any NBA player?', a: 'Yes, search by player name to find career stats, averages, and recent games.' },
        { q: 'Are stats up to date?', a: 'Data is updated regularly by the balldontlie API. Current season stats may lag by a day or two.' },
      ]}
      howItWorks={[
        "Type a player name to search — results appear as you type.",
        "Click a player to see season averages and recent game logs.",
        "Switch to the Games tab to look up scores for any date.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "NBA Stats", "applicationCategory": "SportsApplication",
        url: "https://www.uptools.in/nba-stats/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Tab Switcher */}
        <div className="flex gap-2">
          <button onClick={() => setTab('players')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'players' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/[0.04] text-slate-500 border border-white/5 hover:text-white'}`}>
            🔍 Player Search
          </button>
          <button onClick={() => { setTab('games'); fetchGames(gameDate) }}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'games' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/[0.04] text-slate-500 border border-white/5 hover:text-white'}`}>
            🎮 Recent Games
          </button>
        </div>

        {/* Players Tab */}
        {tab === 'players' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="flex gap-2">
              <input type="text" placeholder="Search player (e.g. LeBron, Curry, Jordan)"
                value={searchQuery}
                onChange={e => handleSearchInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchPlayers(searchQuery)}
                className={inputClass} />
              <button onClick={() => searchPlayers(searchQuery)} className={btnClass}>Search</button>
            </div>

            {/* Loading */}
            {loading && <div className="text-center py-8"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>}

            {/* Error */}
            {error && <p className="text-center text-sm text-rose-400">{error}</p>}

            {/* Player Detail */}
            {selectedPlayer && playerStats && (
              <div className="space-y-4" style={{ animation: 'slideUp 0.3s ease' }}>
                <button onClick={() => { setSelectedPlayer(null); setPlayerStats(null) }}
                  className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">← Back to results</button>

                <div className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6">
                  <h3 className="text-lg font-extrabold text-white mb-4">{selectedPlayer}</h3>

                  {playerStats.averages ? (
                    <>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Season Averages</div>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { l: 'PPG', v: (playerStats.averages.points || 0).toFixed(1) },
                          { l: 'RPG', v: (playerStats.averages.rebounds || 0).toFixed(1) },
                          { l: 'APG', v: (playerStats.averages.assists || 0).toFixed(1) },
                          { l: 'SPG', v: (playerStats.averages.steals || 0).toFixed(1) },
                          { l: 'BPG', v: (playerStats.averages.blocks || 0).toFixed(1) },
                          { l: 'FG%', v: `${((playerStats.averages.fg_pct || 0) * 100).toFixed(1)}%` },
                          { l: '3P%', v: `${((playerStats.averages.three_pt_pct || 0) * 100).toFixed(1)}%` },
                          { l: 'FT%', v: `${((playerStats.averages.ft_pct || 0) * 100).toFixed(1)}%` },
                          { l: 'MPG', v: playerStats.averages.min || '0' },
                          { l: 'GP', v: playerStats.averages.games_played || 0 },
                        ].map(s => (
                          <div key={s.l} className="p-2 rounded-xl bg-white/[0.04] border border-white/5 text-center">
                            <div className="text-sm font-extrabold text-white">{s.v}</div>
                            <div className="text-[10px] text-slate-500 font-medium mt-0.5">{s.l}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-slate-500">No season averages available.</p>
                  )}
                </div>

                {/* Recent Games */}
                {playerStats.recentGames.length > 0 && (
                  <div className="rounded-3xl border-2 border-white/8 bg-white/[0.04] p-5">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Recent Games</div>
                    <div className="space-y-2">
                      {playerStats.recentGames.map((g, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-white font-medium">{g.team?.full_name || 'N/A'}</span>
                            <span className="text-sm font-bold text-indigo-400">{g.pts || 0} P</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {g.reb || 0} REB · {g.ast || 0} AST · {g.min || ''} MIN · {g.date || ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Player List */}
            {!selectedPlayer && players.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{players.length} player{players.length !== 1 ? 's' : ''} found</div>
                {players.map(p => (
                  <button key={p.id} onClick={() => showPlayer(p.id, `${p.first_name} ${p.last_name}`)}
                    className="w-full text-left p-4 rounded-2xl bg-white/[0.04] border border-white/8 hover:bg-white/[0.08] transition-all">
                    <div className="text-sm font-bold text-white">{p.first_name} {p.last_name}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {p.position || ''} · {p.team?.full_name || 'Free Agent'} · {p.height_feet || '?'}'{p.height_inches || 0}"
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Games Tab */}
        {tab === 'games' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input type="date" value={gameDate} onChange={e => setGameDate(e.target.value)}
                className={inputClass} />
              <button onClick={() => fetchGames(gameDate)} className={btnClass}>Look Up</button>
            </div>

            {gamesLoading && <div className="text-center py-8"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>}

            {error && !gamesLoading && <p className="text-center text-sm text-rose-400">{error}</p>}

            {games.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{games.length} game{games.length !== 1 ? 's' : ''} on {gameDate}</div>
                {games.map((g, i) => {
                  const homeWon = (g.home_team_score || 0) > (g.visitor_team_score || 0)
                  return (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.04] border border-white/8">
                      <div className="flex items-center justify-between gap-3">
                        <span className={`text-sm font-medium ${homeWon ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {g.home_team?.full_name || '?'} {g.home_team_score || 0}
                        </span>
                        <span className="text-xs text-slate-600">vs</span>
                        <span className={`text-sm font-medium ${!homeWon ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {g.visitor_team?.full_name || '?'} {g.visitor_team_score || 0}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Status: {g.status || 'Final'} {g.period ? `· Q${g.period}` : ''} {g.time || ''}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
