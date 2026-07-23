import { useState, useRef, useEffect, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const TEAMS = [
  { id:'argentina',name:'Argentina',flag:'🇦🇷',rank:1,titles:3,best:'Winners (1978, 1986, 2022)',players:'Lionel Messi, Lautaro Martínez',attack:96,defense:88,midfield:92,experience:94,depth:91 },
  { id:'brazil',name:'Brazil',flag:'🇧🇷',rank:3,titles:5,best:'Winners (1958, 1962, 1970, 1994, 2002)',players:'Vinícius Jr, Neymar Jr',attack:95,defense:85,midfield:90,experience:92,depth:93 },
  { id:'france',name:'France',flag:'🇫🇷',rank:2,titles:2,best:'Winners (1998, 2018)',players:'Kylian Mbappé, Antoine Griezmann',attack:94,defense:88,midfield:91,experience:90,depth:92 },
  { id:'england',name:'England',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',rank:4,titles:1,best:'Winners (1966)',players:'Harry Kane, Jude Bellingham',attack:92,defense:84,midfield:90,experience:84,depth:90 },
  { id:'spain',name:'Spain',flag:'🇪🇸',rank:5,titles:1,best:'Winners (2010)',players:'Lamine Yamal, Pedri',attack:88,defense:83,midfield:91,experience:86,depth:87 },
  { id:'germany',name:'Germany',flag:'🇩🇪',rank:6,titles:4,best:'Winners (1954, 1974, 1990, 2014)',players:'Jamal Musiala, Florian Wirtz',attack:87,defense:85,midfield:88,experience:90,depth:88 },
  { id:'netherlands',name:'Netherlands',flag:'🇳🇱',rank:7,titles:0,best:'Runners-up (1974, 1978, 2010)',players:'Memphis Depay, Cody Gakpo',attack:85,defense:82,midfield:84,experience:85,depth:84 },
  { id:'portugal',name:'Portugal',flag:'🇵🇹',rank:9,titles:0,best:'3rd Place (1966)',players:'Cristiano Ronaldo, Bruno Fernandes',attack:86,defense:78,midfield:85,experience:88,depth:84 },
  { id:'italy',name:'Italy',flag:'🇮🇹',rank:10,titles:4,best:'Winners (1934, 1938, 1982, 2006)',players:'Federico Chiesa, Nicolò Barella',attack:81,defense:87,midfield:83,experience:88,depth:82 },
  { id:'belgium',name:'Belgium',flag:'🇧🇪',rank:8,titles:0,best:'3rd Place (2018)',players:'Kevin De Bruyne, Romelu Lukaku',attack:84,defense:75,midfield:85,experience:82,depth:80 },
  { id:'uruguay',name:'Uruguay',flag:'🇺🇾',rank:12,titles:2,best:'Winners (1930, 1950)',players:'Darwin Núñez, Federico Valverde',attack:82,defense:84,midfield:80,experience:86,depth:80 },
  { id:'croatia',name:'Croatia',flag:'🇭🇷',rank:16,titles:0,best:'Runners-up (2018)',players:'Luka Modrić, Mateo Kovačić',attack:78,defense:76,midfield:86,experience:90,depth:77 },
  { id:'japan',name:'Japan',flag:'🇯🇵',rank:18,titles:0,best:'Round of 16',players:'Takefusa Kubo, Kaoru Mitoma',attack:75,defense:72,midfield:74,experience:70,depth:71 },
  { id:'south-korea',name:'South Korea',flag:'🇰🇷',rank:23,titles:0,best:'4th Place (2002)',players:'Son Heung-min, Lee Kang-in',attack:76,defense:68,midfield:72,experience:73,depth:68 },
  { id:'morocco',name:'Morocco',flag:'🇲🇦',rank:13,titles:0,best:'4th Place (2022)',players:'Youssef En-Nesyri, Achraf Hakimi',attack:80,defense:82,midfield:78,experience:77,depth:76 },
  { id:'usa',name:'USA',flag:'🇺🇸',rank:11,titles:0,best:'3rd Place (1930)',players:'Christian Pulisic, Weston McKennie',attack:78,defense:73,midfield:76,experience:71,depth:74 },
  { id:'mexico',name:'Mexico',flag:'🇲🇽',rank:15,titles:0,best:'Quarter-finals (1970, 1986)',players:'Hirving Lozano, Santiago Giménez',attack:76,defense:72,midfield:73,experience:78,depth:73 },
  { id:'canada',name:'Canada',flag:'🇨🇦',rank:29,titles:0,best:'Group Stage',players:'Alphonso Davies, Jonathan David',attack:74,defense:68,midfield:71,experience:62,depth:68 },
  { id:'australia',name:'Australia',flag:'🇦🇺',rank:30,titles:0,best:'Round of 16',players:'Mathew Leckie, Craig Goodwin',attack:68,defense:66,midfield:69,experience:70,depth:65 },
  { id:'senegal',name:'Senegal',flag:'🇸🇳',rank:20,titles:0,best:'Quarter-finals (2002)',players:'Sadio Mané, Ismaïla Sarr',attack:78,defense:74,midfield:73,experience:72,depth:73 },
]

const H2H = {
  'Argentina-Brazil':'Argentina 42 wins, Brazil 40 wins, 28 draws. Goals: 165-168.',
  'France-England':'France 8 wins, England 7 wins, 5 draws.',
  'Spain-Italy':'Spain 14 wins, Italy 13 wins, 14 draws.',
  'Germany-Netherlands':'Germany 12 wins, Netherlands 11 wins, 10 draws.',
  'Argentina-France':'Argentina 6 wins, France 5 wins, 3 draws.',
}

function RadarCanvas({ teamA, teamB }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width, h = canvas.height
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.35
    const labels = ['Attack', 'Defense', 'Midfield', 'Experience', 'Depth']
    const valsA = [teamA.attack, teamA.defense, teamA.midfield, teamA.experience, teamA.depth]
    const valsB = [teamB.attack, teamB.defense, teamB.midfield, teamB.experience, teamB.depth]
    ctx.clearRect(0, 0, w, h)
    for (let ring = 1; ring <= 5; ring++) {
      const radius = (r / 5) * ring
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
        const x = cx + radius * Math.cos(angle), y = cy + radius * Math.sin(angle)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = ring === 5 ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'
      ctx.lineWidth = ring === 5 ? 1.5 : 1
      ctx.stroke()
    }
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
      ctx.beginPath(); ctx.moveTo(cx, cy)
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle))
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.stroke()
    }
    ctx.fillStyle = '#9fb1c8'; ctx.font = '12px system-ui'; ctx.textAlign = 'center'
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
      ctx.fillText(labels[i], cx + (r + 26) * Math.cos(angle), cy + (r + 26) * Math.sin(angle))
    }
    ;[{vals:valsA,color:'rgba(0,229,255,0.2)',stroke:'#00e5ff'},{vals:valsB,color:'rgba(99,102,241,0.2)',stroke:'#6366f1'}].forEach(({vals,color,stroke}) => {
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
        const x = cx + r * (vals[i]/100) * Math.cos(angle), y = cy + r * (vals[i]/100) * Math.sin(angle)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.closePath(); ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = stroke; ctx.lineWidth = 2.5; ctx.stroke()
    })
  }, [teamA, teamB])
  return <canvas ref={canvasRef} width={400} height={400} className="w-full max-w-[400px] mx-auto" />
}

export default function fifa_world_cup_team_compare() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [nameA, setNameA] = useState('Argentina')
  const [nameB, setNameB] = useState('Brazil')
  const [result, setResult] = useState(null)

  const compare = useCallback(() => {
    const tA = TEAMS.find(t => t.name === nameA)
    const tB = TEAMS.find(t => t.name === nameB)
    if (!tA || !tB || nameA === nameB) return
    const key1 = `${nameA}-${nameB}`, key2 = `${nameB}-${nameA}`
    const h2h = H2H[key1] || H2H[key2] || 'Limited historical meetings.'
    const scoreA = tA.attack + tA.defense + tA.midfield + tA.experience + tA.depth
    const scoreB = tB.attack + tB.defense + tB.midfield + tB.experience + tB.depth
    const verdict = scoreA > scoreB ? `${tA.name} have the edge with a stronger overall squad.` : scoreB > scoreA ? `${tB.name} have the edge with a stronger overall squad.` : 'Evenly matched!'
    setResult({ tA, tB, h2h, verdict })
  }, [nameA, nameB])

  const stats = [
    { label: 'FIFA Rank', a: `#${result?.tA.rank}`, b: `#${result?.tB.rank}` },
    { label: 'WC Titles', a: result?.tA.titles, b: result?.tB.titles },
    { label: 'Best Finish', a: result?.tA.best, b: result?.tB.best },
    { label: 'Key Players', a: result?.tA.players, b: result?.tB.players },
    { label: 'Attack', a: result?.tA.attack, b: result?.tB.attack },
    { label: 'Defense', a: result?.tA.defense, b: result?.tB.defense },
    { label: 'Midfield', a: result?.tA.midfield, b: result?.tB.midfield },
    { label: 'Experience', a: result?.tA.experience, b: result?.tB.experience },
    { label: 'Depth', a: result?.tA.depth, b: result?.tB.depth },
  ]

  return (
    <ToolLayout
      title="FIFA World Cup 2026 Team Comparison"
      desc="Compare FIFA World Cup 2026 national teams side-by-side. FIFA rankings, World Cup titles, key players, radar charts."
      icon="📊" iconBg="rgba(99,102,241,0.08)"
      category="fifa" slug="fifa-world-cup-team-compare"
      faq={[
        { q: "How is the radar chart calculated?", a: "Each attribute (Attack, Defense, Midfield, Experience, Depth) is scored 0-100 based on FIFA ranking, WC history, and squad quality." },
        { q: "What does the head-to-head show?", a: "Historical match results between the two teams including wins, draws, and goals." },
      ]}
      howItWorks={[
        "Select two teams from the dropdowns.",
        "Click Compare Teams to see side-by-side stats.",
        "Review the radar chart for visual comparison.",
        "Read the verdict for which team has the edge.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "FIFA World Cup 2026 Team Comparison",
        url: "https://www.uptools.in/fifa-world-cup-team-compare/",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6" ref={resultRef}>
        {/* Selectors */}
        <div className="flex items-center gap-3 flex-wrap">
          <select value={nameA} onChange={e => setNameA(e.target.value)}
            className="flex-1 min-w-[150px] bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-cyan-500/40 [color-scheme:dark]">
            {TEAMS.map(t => <option key={t.id} value={t.name}>{t.flag} {t.name}</option>)}
          </select>
          <span className="text-lg font-extrabold text-slate-500">VS</span>
          <select value={nameB} onChange={e => setNameB(e.target.value)}
            className="flex-1 min-w-[150px] bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 [color-scheme:dark]">
            {TEAMS.map(t => <option key={t.id} value={t.name}>{t.flag} {t.name}</option>)}
          </select>
        </div>

        <button onClick={() => { compare(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98]">
          📊 Compare Teams
        </button>

        {result && (
          <div className="space-y-6" style={{ animation: 'slideUp 0.35s ease-out' }}>
            {/* Comparison table */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="px-4 py-3 text-left text-xs font-bold text-cyan-400">{result.tA.flag} {result.tA.name}</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-slate-500">Stat</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-indigo-400">{result.tB.flag} {result.tB.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((s, i) => {
                    const aNum = typeof s.a === 'number' ? s.a : null
                    const bNum = typeof s.b === 'number' ? s.b : null
                    const aBetter = aNum !== null && bNum !== null && aNum > bNum
                    const bBetter = aNum !== null && bNum !== null && bNum > aNum
                    return (
                      <tr key={i} className="border-b border-white/5">
                        <td className={`px-4 py-2.5 font-semibold ${aBetter ? 'text-cyan-400' : 'text-slate-300'}`}>{s.a}</td>
                        <td className="px-4 py-2.5 text-center text-xs text-slate-500 font-medium">{s.label}</td>
                        <td className={`px-4 py-2.5 text-right font-semibold ${bBetter ? 'text-indigo-400' : 'text-slate-300'}`}>{s.b}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Radar chart */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-center">
              <h3 className="text-sm font-bold text-slate-300 mb-3">📈 Attribute Radar</h3>
              <RadarCanvas teamA={result.tA} teamB={result.tB} />
            </div>

            {/* Head-to-head */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <h3 className="text-sm font-bold text-slate-300 mb-2">🤝 Head-to-Head</h3>
              <p className="text-sm text-slate-400">{result.h2h}</p>
            </div>

            {/* Verdict */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <h3 className="text-sm font-bold text-amber-400 mb-2">🏆 Verdict</h3>
              <p className="text-sm text-slate-300">{result.verdict}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
