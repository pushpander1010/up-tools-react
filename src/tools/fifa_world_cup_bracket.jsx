import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const R32 = [
  ['Group A Winner','Group C/D/F/H/I 3rd'],['Group B Winner','Group E/F/I/J 3rd'],
  ['Group C Winner','Group A/D/E/F/H 3rd'],['Group D Winner','Group A/C/E/F/H 3rd'],
  ['Group E Winner','Group A/C/D/F/G 3rd'],['Group F Winner','Group A/C/D/E/G 3rd'],
  ['Group G Winner','Group A/D/E/F/H 3rd'],['Group H Winner','Group A/C/D/E/F 3rd'],
  ['Group I Winner','Group C/D/F/H/I 3rd'],['Group J Winner','Group C/D/G/H/K 3rd'],
  ['Group K Winner','Group A/B/C/D/E 3rd'],['Group L Winner','Group A/B/C/D/E 3rd'],
  ['3rd A/B/C/D/E 1','Group A/B/C/D/E 3rd'],['3rd A/B/C/D/E 2','Group A/B/C/D/E 3rd'],
  ['3rd F/G/H/I/J 1','Group F/G/H/I/J 3rd'],['3rd F/G/H/I/J 2','Group F/G/H/I/J 3rd'],
]

export default function fifa_world_cup_bracket() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [picks, setPicks] = useState({ r32: Array(16).fill(null) })

  const handlePick = useCallback((round, match, slot) => {
    setPicks(prev => {
      const next = { ...prev }
      if (round === 'r32') {
        next.r32 = [...prev.r32]
        next.r32[match] = prev.r32[match] === slot ? null : slot
      }
      return next
    })
  }, [])

  const getR32Winner = useCallback((match) => {
    const p = picks.r32[match]
    return p !== null ? R32[match][p] : null
  }, [picks.r32])

  const getR16Team = useCallback((match) => {
    const idx = match * 2
    return getR32Winner(idx) || getR32Winner(idx + 1) ? (getR32Winner(idx) || 'TBD') : 'TBD'
  }, [getR32Winner])

  const resetAll = useCallback(() => {
    setPicks({ r32: Array(16).fill(null) })
  }, [])

  const shareBracket = useCallback(() => {
    const encoded = picks.r32.map(p => p ?? '-').join('')
    const url = window.location.origin + '/fifa-world-cup-bracket/?b=' + encoded
    navigator.clipboard.writeText(url).then(() => alert('📋 Bracket link copied!'))
  }, [picks.r32])

  const Matchup = ({ t1, t2, onPick1, onPick2, picked, label }) => (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-2 text-xs">
      <div className="text-[10px] text-slate-600 mb-1 font-medium text-center">{label}</div>
      <button onClick={onPick1} className={`w-full text-left px-2.5 py-1.5 rounded-lg mb-0.5 transition-all ${picked === 0 ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'hover:bg-white/[0.06] text-slate-400'}`}>
        {picked === 0 && <span className="mr-1">✓</span>}{t1}
      </button>
      <button onClick={onPick2} className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-all ${picked === 1 ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'hover:bg-white/[0.06] text-slate-400'}`}>
        {picked === 1 && <span className="mr-1">✓</span>}{t2}
      </button>
    </div>
  )

  return (
    <ToolLayout
      title="FIFA World Cup 2026 Knockout Bracket"
      desc="Predict knockout stage winners from Round of 32 to the Final. Interactive bracket with all fixtures."
      icon="🏆" iconBg="rgba(234,179,8,0.08)"
      category="fifa" slug="fifa-world-cup-bracket"
      faq={[
        { q: "How does the 2026 knockout format work?", a: "48 teams → 12 group winners, 12 runners-up, 8 best thirds advance to a Round of 32. Single elimination bracket to the Final." },
        { q: "Can I save my bracket predictions?", a: "Click Share to generate a URL with all your picks encoded. Bookmark or send to friends." },
      ]}
      howItWorks={[
        "Click a team name in any R32 matchup to select them as winner.",
        "Your predicted winner progresses to the next round automatically.",
        "Click Share to generate a link with all predictions encoded.",
        "Hit Reset to start a fresh bracket anytime.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        name: "FIFA World Cup 2026 Knockout Bracket", url: "https://www.uptools.in/fifa-world-cup-bracket/",
      }}
    >
      <div className="max-w-6xl mx-auto space-y-6" ref={resultRef}>
        {/* Controls */}
        <div className="flex gap-2">
          <button onClick={shareBracket} className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-400 transition-all">Share Bracket</button>
          <button onClick={resetAll} className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 text-sm font-semibold hover:text-white transition-all">Reset All</button>
        </div>

        {/* Bracket */}
        <div className="flex gap-3 overflow-x-auto pb-4">
          {/* R32 */}
          <div className="min-w-[160px]">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Round of 32</div>
            <div className="space-y-2">
              {R32.map((m, i) => (
                <Matchup key={i} t1={m[0]} t2={m[1]} label={`R32-${i+1}`}
                  picked={picks.r32[i]}
                  onPick1={() => handlePick('r32', i, 0)}
                  onPick2={() => handlePick('r32', i, 1)} />
              ))}
            </div>
          </div>

          {/* R16 */}
          <div className="min-w-[160px]">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Round of 16</div>
            <div className="space-y-6">
              {[0,1,2,3,4,5,6,7].map(i => {
                const t1 = getR32Winner(i * 2) || 'TBD'
                const t2 = getR32Winner(i * 2 + 1) || 'TBD'
                return <div key={i} className="text-xs text-slate-400 px-2 py-1 rounded bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-600">R16-{i+1}</span><br/>
                  {t1} vs {t2}
                </div>
              })}
            </div>
          </div>

          {/* QF */}
          <div className="min-w-[140px]">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Quarter-Finals</div>
            <div className="space-y-8">
              {['QF1','QF2','QF3','QF4'].map((qf, i) => (
                <div key={i} className="text-xs text-slate-400 px-2 py-1 rounded bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-600">{qf}</span><br/>TBD
                </div>
              ))}
            </div>
          </div>

          {/* SF */}
          <div className="min-w-[120px]">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Semi-Finals</div>
            <div className="space-y-12">
              <div className="text-xs text-slate-400 px-2 py-1 rounded bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-600">SF1</span><br/>TBD
              </div>
              <div className="text-xs text-slate-400 px-2 py-1 rounded bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-600">SF2</span><br/>TBD
              </div>
            </div>
          </div>

          {/* Final */}
          <div className="min-w-[120px]">
            <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-2 text-center">🏆 Final</div>
            <div className="text-xs text-slate-400 px-2 py-2 rounded bg-amber-500/5 border border-amber-500/20 text-center">
              TBD vs TBD
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {[{n:'48',l:'Teams'},{n:'32',l:'Knockout'},{n:'16',l:'Venues'},{n:'3',l:'Hosts'},{n:'64',l:'Matches'}].map(s => (
            <div key={s.l} className="p-3 rounded-2xl bg-white/[0.06] border border-white/8 text-center">
              <div className="text-xl font-extrabold text-indigo-400">{s.n}</div>
              <div className="text-[10px] text-slate-500 font-medium">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
