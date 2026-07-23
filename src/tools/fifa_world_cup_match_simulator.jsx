import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const TEAMS = [
  { name:'Argentina',flag:'🇦🇷',str:92 },{ name:'Brazil',flag:'🇧🇷',str:90 },{ name:'France',flag:'🇫🇷',str:91 },
  { name:'England',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',str:88 },{ name:'Spain',flag:'🇪🇸',str:87 },{ name:'Germany',flag:'🇩🇪',str:86 },
  { name:'Netherlands',flag:'🇳🇱',str:84 },{ name:'Portugal',flag:'🇵🇹',str:83 },{ name:'Italy',flag:'🇮🇹',str:82 },
  { name:'Belgium',flag:'🇧🇪',str:80 },{ name:'Uruguay',flag:'🇺🇾',str:78 },{ name:'Croatia',flag:'🇭🇷',str:76 },
  { name:'Morocco',flag:'🇲🇦',str:75 },{ name:'USA',flag:'🇺🇸',str:74 },{ name:'Mexico',flag:'🇲🇽',str:73 },
  { name:'Japan',flag:'🇯🇵',str:72 },{ name:'South Korea',flag:'🇰🇷',str:71 },{ name:'Senegal',flag:'🇸🇳',str:70 },
  { name:'Colombia',flag:'🇨🇴',str:74 },{ name:'Switzerland',flag:'🇨🇭',str:73 },{ name:'Denmark',flag:'🇩🇰',str:72 },
  { name:'Australia',flag:'🇦🇺',str:68 },{ name:'Canada',flag:'🇨🇦',str:67 },{ name:'Poland',flag:'🇵🇱',str:72 },
  { name:'Serbia',flag:'🇷🇸',str:71 },{ name:'Sweden',flag:'🇸🇪',str:70 },{ name:'Turkey',flag:'🇹🇷',str:69 },
  { name:'Nigeria',flag:'🇳🇬',str:68 },{ name:'Egypt',flag:'🇪🇬',str:67 },{ name:'Ecuador',flag:'🇪🇨',str:66 },
  { name:'Peru',flag:'🇵🇪',str:65 },{ name:'Chile',flag:'🇨🇱',str:64 },{ name:'Cameroon',flag:'🇨🇲',str:63 },
  { name:'Ghana',flag:'🇬🇭',str:62 },{ name:'Iran',flag:'🇮🇷',str:65 },{ name:'Saudi Arabia',flag:'🇸🇦',str:60 },
  { name:'Qatar',flag:'🇶🇦',str:58 },{ name:'Iraq',flag:'🇮🇶',str:57 },{ name:'Jamaica',flag:'🇯🇲',str:55 },
  { name:'Tunisia',flag:'🇹🇳',str:62 },{ name:'Algeria',flag:'🇩🇿',str:63 },{ name:'Ivory Coast',flag:'🇨🇮',str:64 },
  { name:'Panama',flag:'🇵🇦',str:56 },{ name:'Costa Rica',flag:'🇨🇷',str:60 },{ name:'New Zealand',flag:'🇳🇿',str:52 },
  { name:'South Africa',flag:'🇿🇦',str:54 },{ name:'Czech Republic',flag:'🇨🇿',str:66 },{ name:'Bosnia',flag:'🇧🇦',str:61 },
  { name:'Haiti',flag:'🇭🇹',str:48 },{ name:'Paraguay',flag:'🇵🇾',str:63 },
]

const SCORERS = {
  'Argentina':['Messi','Martínez','Álvarez','Di María'],'Brazil':['Vinícius Jr','Neymar','Rodrygo','Raphinha'],
  'France':['Mbappé','Griezmann','Dembélé','Giroud'],'England':['Kane','Bellingham','Saka','Rashford'],
  'Spain':['Yamal','Morata','Pedri','Olmo'],'Germany':['Musiala','Wirtz','Havertz','Sané'],
  'Netherlands':['Depay','Gakpo','Simons','Bergwijn'],'Portugal':['Ronaldo','Fernandes','Leão','Silva'],
  'Italy':['Chiesa','Barella','Scamacca','Retegui'],'Belgium':['Lukaku','De Bruyne','Doku','Trossard'],
  'Uruguay':['Núñez','Valverde','Pellistri','Suárez'],'Croatia':['Modrić','Kramarić','Perišić','Kovačić'],
  'Morocco':['En-Nesyri','Ziyech','Hakimi','Boufal'],'USA':['Pulisic','Reyna','McKennie','Weah'],
  'Mexico':['Lozano','Jiménez','Giménez','Antuna'],'Japan':['Kubo','Mitoma','Doan','Fujii'],
  'South Korea':['Son','Lee Kang-in','Hwang','Cho'],'default':['Player A','Player B','Player C','Player D'],
}

function simulate(tA, tB) {
  const sA = tA.str, sB = tB.str
  const diff = sA - sB
  const baseGoals = 2.5
  const goalsA = Math.max(0, Math.round(baseGoals * (sA/90) + (Math.random() * 1.5 - 0.5)))
  const goalsB = Math.max(0, Math.round(baseGoals * (sB/90) + (Math.random() * 1.5 - 0.5)))
  const possessionA = Math.min(70, Math.max(30, 50 + diff * 0.5 + (Math.random() * 10 - 5)))
  const shotsA = Math.round(8 + (sA - 60) * 0.15 + Math.random() * 4)
  const shotsB = Math.round(8 + (sB - 60) * 0.15 + Math.random() * 4)
  const cornersA = Math.round(3 + (sA - 60) * 0.08 + Math.random() * 3)
  const cornersB = Math.round(3 + (sB - 60) * 0.08 + Math.random() * 3)
  const foulsA = Math.round(10 + Math.random() * 8)
  const foulsB = Math.round(10 + Math.random() * 8)

  const scorersA = [], scorersB = []
  const poolA = SCORERS[tA.name] || SCORERS.default
  const poolB = SCORERS[tB.name] || SCORERS.default
  for (let i = 0; i < goalsA; i++) {
    const min = Math.round(Math.random() * 88 + 2)
    scorersA.push({ name: poolA[Math.floor(Math.random() * poolA.length)], min })
  }
  for (let i = 0; i < goalsB; i++) {
    const min = Math.round(Math.random() * 88 + 2)
    scorersB.push({ name: poolB[Math.floor(Math.random() * poolB.length)], min })
  }
  scorersA.sort((a, b) => a.min - b.min)
  scorersB.sort((a, b) => a.min - b.min)

  return {
    scoreA: goalsA, scoreB: goalsB,
    scorersA, scorersB,
    stats: [
      { label: 'Possession', a: Math.round(possessionA), b: Math.round(100 - possessionA) },
      { label: 'Shots', a: shotsA, b: shotsB },
      { label: 'Corners', a: cornersA, b: cornersB },
      { label: 'Fouls', a: foulsA, b: foulsB },
    ]
  }
}

export default function fifa_world_cup_match_simulator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [teamA, setTeamA] = useState('Argentina')
  const [teamB, setTeamB] = useState('Brazil')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wc_sim_history') || '[]') } catch { return [] }
  })

  const simulateMatch = useCallback(() => {
    const tA = TEAMS.find(t => t.name === teamA)
    const tB = TEAMS.find(t => t.name === teamB)
    if (!tA || !tB || teamA === teamB) return
    const res = simulate(tA, tB)
    const entry = { ...res, teamA: tA, teamB: tB, ts: new Date().toLocaleString() }
    setResult(entry)
    const newHist = [entry, ...history].slice(0, 20)
    setHistory(newHist)
    localStorage.setItem('wc_sim_history', JSON.stringify(newHist))
  }, [teamA, teamB, history])

  return (
    <ToolLayout
      title="FIFA World Cup 2026 Match Simulator"
      desc="Simulate FIFA World Cup 2026 matches. Pick two teams, generate realistic scores with goalscorers and stats."
      icon="⚽" iconBg="rgba(34,197,94,0.08)"
      category="fifa" slug="fifa-world-cup-match-simulator"
      faq={[
        { q: "How realistic are the scores?", a: "The simulator uses weighted random logic based on team strength, FIFA rankings, and realistic scoring patterns." },
        { q: "Is match history saved?", a: "Yes, stored in your browser's local storage. Persists between sessions." },
      ]}
      howItWorks={[
        "Pick home and away teams from all 48 nations.",
        "Click Simulate Match to generate a realistic result.",
        "Review score, goalscorers with minutes, and match stats.",
        "Track your simulation history below.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "GameApplication",
        name: "FIFA World Cup 2026 Match Simulator",
        url: "https://www.uptools.in/fifa-world-cup-match-simulator/",
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6" ref={resultRef}>
        {/* Team selectors */}
        <div className="flex items-center gap-3 flex-wrap">
          <select value={teamA} onChange={e => setTeamA(e.target.value)}
            className="flex-1 min-w-[140px] bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-green-500/40 [color-scheme:dark]">
            {TEAMS.map(t => <option key={t.name} value={t.name}>{t.flag} {t.name}</option>)}
          </select>
          <span className="text-lg font-extrabold text-slate-500">VS</span>
          <select value={teamB} onChange={e => setTeamB(e.target.value)}
            className="flex-1 min-w-[140px] bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 [color-scheme:dark]">
            {TEAMS.map(t => <option key={t.name} value={t.name}>{t.flag} {t.name}</option>)}
          </select>
        </div>

        <button onClick={() => { simulateMatch(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-sm hover:bg-green-400 transition-all active:scale-[0.98]">
          ⚽ Simulate Match
        </button>

        {result && (
          <div className="space-y-4" style={{ animation: 'slideUp 0.35s ease-out' }}>
            {/* Scoreboard */}
            <div className="rounded-3xl border-2 border-green-500/15 bg-gradient-to-br from-green-500/[0.06] via-white/[0.01] to-transparent p-6 text-center">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-1">{result.teamA.flag}</div>
                  <div className="text-sm font-bold text-white">{result.teamA.name}</div>
                </div>
                <div className="text-5xl font-extrabold text-white">{result.scoreA} - {result.scoreB}</div>
                <div className="text-center">
                  <div className="text-4xl mb-1">{result.teamB.flag}</div>
                  <div className="text-sm font-bold text-white">{result.teamB.name}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-3">Full Time</div>
            </div>

            {/* Goalscorers */}
            {(result.scorersA.length > 0 || result.scorersB.length > 0) && (
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <h3 className="text-xs font-bold text-slate-400 mb-2">⚽ Goalscorers</h3>
                <div className="flex gap-4 text-xs">
                  <div className="flex-1 space-y-1">
                    {result.scorersA.map((g, i) => (
                      <div key={i} className="text-cyan-400">{g.name} {g.min}'</div>
                    ))}
                  </div>
                  <div className="flex-1 space-y-1 text-right">
                    {result.scorersB.map((g, i) => (
                      <div key={i} className="text-indigo-400">{g.min}' {g.name}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 space-y-3">
              <div className="text-xs font-bold text-slate-400">Match Statistics</div>
              {result.stats.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-8 text-right text-cyan-400 font-bold">{s.a}</span>
                  <div className="flex-1 flex gap-0.5">
                    <div className="h-2 rounded-l bg-cyan-500/40" style={{ width: `${s.a / (s.a + s.b) * 100}%` }} />
                    <div className="h-2 rounded-r bg-indigo-500/40" style={{ width: `${s.b / (s.a + s.b) * 100}%` }} />
                  </div>
                  <span className="w-8 text-indigo-400 font-bold">{s.b}</span>
                  <span className="w-20 text-center text-slate-500">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <h3 className="text-xs font-bold text-slate-400 mb-3">📋 Match History</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-3 text-xs p-2 rounded-lg bg-white/[0.03]">
                  <span>{h.teamA.flag}</span>
                  <span className="font-bold text-white">{h.scoreA}-{h.scoreB}</span>
                  <span>{h.teamB.flag}</span>
                  <span className="text-slate-500 ml-auto">{h.ts}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
