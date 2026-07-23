import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function ipl_fantasy_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [stats, setStats] = useState({
    runs: 0, fours: 0, sixes: 0, balls: 0,
    wickets: 0, runsConceded: 0, oversBowled: 0, maidens: 0,
    catches: 0, runouts: 0, stumpings: 0,
  })
  const [result, setResult] = useState(null)

  const update = useCallback((key, val) => {
    setStats(prev => ({ ...prev, [key]: val }))
  }, [])

  const calculate = useCallback(() => {
    const v = (k) => parseFloat(stats[k]) || 0
    let battingPts = v('runs') + v('fours') + (v('sixes') * 2)
    let bowlingPts = (v('wickets') * 25) + (v('maidens') * 12)
    let fieldingPts = (v('catches') * 8) + (v('stumpings') * 12) + (v('runouts') * 6)
    let bonusPts = 0

    // Batting milestones
    if (v('runs') >= 100) bonusPts += 16
    else if (v('runs') >= 50) bonusPts += 8

    // Strike rate bonus
    if (v('balls') >= 10) {
      const sr = (v('runs') / v('balls')) * 100
      if (sr >= 170) bonusPts += 6
      else if (sr >= 150) bonusPts += 4
      else if (sr >= 130) bonusPts += 2
    }

    // Bowling milestones
    if (v('wickets') >= 5) bonusPts += 24
    else if (v('wickets') >= 4) bonusPts += 16
    else if (v('wickets') >= 3) bonusPts += 8

    // Economy rate bonus
    if (v('oversBowled') >= 2) {
      const er = v('runsConceded') / v('oversBowled')
      if (er <= 5) bonusPts += 6
      else if (er <= 6) bonusPts += 4
      else if (er <= 7) bonusPts += 2
    }

    // Fielding bonus
    if (v('catches') >= 3) bonusPts += 4

    const total = battingPts + bowlingPts + fieldingPts + bonusPts
    setResult({ batting: Math.round(battingPts), bowling: Math.round(bowlingPts), fielding: Math.round(fieldingPts), bonus: bonusPts, total: Math.round(total) })
  }, [stats])

  const reset = useCallback(() => {
    setStats({ runs: 0, fours: 0, sixes: 0, balls: 0, wickets: 0, runsConceded: 0, oversBowled: 0, maidens: 0, catches: 0, runouts: 0, stumpings: 0 })
    setResult(null)
  }, [])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  const sections = [
    { title: '🏏 Batting Stats', fields: [
      { key: 'runs', label: 'Runs Scored' }, { key: 'fours', label: 'Fours (4s)' },
      { key: 'sixes', label: 'Sixes (6s)' }, { key: 'balls', label: 'Balls Faced' },
    ]},
    { title: '🎯 Bowling Stats', fields: [
      { key: 'wickets', label: 'Wickets Taken' }, { key: 'runsConceded', label: 'Runs Conceded' },
      { key: 'oversBowled', label: 'Overs Bowled', step: '0.1' }, { key: 'maidens', label: 'Maiden Overs' },
    ]},
    { title: '🧤 Fielding Stats', fields: [
      { key: 'catches', label: 'Catches' }, { key: 'runouts', label: 'Run Outs' },
      { key: 'stumpings', label: 'Stumpings' },
    ]},
  ]

  return (
    <ToolLayout
      title="IPL Fantasy Points Calculator"
      desc="Calculate IPL fantasy cricket points for Dream11, MyTeam11, and fantasy leagues."
      icon="⭐" iconBg="rgba(234,179,8,0.08)"
      category="sports" slug="ipl-fantasy-calculator"
      faq={[
        { q: "How are fantasy points calculated?", a: "Points are awarded for runs, boundaries, wickets, catches, run-outs, and strike rate/economy bonuses." },
        { q: "What is the 50/100 bonus?", a: "8 points for scoring 50 runs, 16 points for scoring 100 runs." },
      ]}
      howItWorks={["Enter batting, bowling, and fielding stats", "Click Calculate Points", "See breakdown of batting, bowling, fielding, and bonus points"]}
      schema={{"@context":"https://schema.org","@type":"SoftwareApplication","name":"IPL Fantasy Points Calculator","applicationCategory":"UtilitiesApplication","url":"https://www.uptools.in/ipl-fantasy-calculator/","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.slice(0, 2).map(sec => (
            <div key={sec.title} className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
              <h3 className="text-base font-bold text-white mb-4">{sec.title}</h3>
              <div className="space-y-3">
                {sec.fields.map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-bold text-slate-400 mb-1">{f.label}</label>
                    <input type="number" min={0} step={f.step || '1'} placeholder="0"
                      value={stats[f.key] || ''}
                      onChange={e => update(f.key, e.target.value)}
                      className={inputClass} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <h3 className="text-base font-bold text-white mb-4">🧤 Fielding Stats</h3>
          <div className="grid grid-cols-3 gap-3">
            {sections[2].fields.map(f => (
              <div key={f.key}>
                <label className="block text-xs font-bold text-slate-400 mb-1">{f.label}</label>
                <input type="number" min={0} placeholder="0"
                  value={stats[f.key] || ''}
                  onChange={e => update(f.key, e.target.value)}
                  className={inputClass} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => { calculate(); jumpTo() }}
              className="flex-1 py-3 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-400 transition-all active:scale-[0.98]">
              Calculate Points
            </button>
            <button onClick={reset}
              className="px-5 py-3 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 font-semibold text-sm hover:bg-white/10 transition-all">
              Reset
            </button>
          </div>
        </div>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Fantasy Points</h3>
            </div>
            <div className="space-y-3">
              {[['Batting Points', result.batting], ['Bowling Points', result.bowling], ['Fielding Points', result.fielding], ['Bonus Points', result.bonus]].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{label}</span>
                  <span className="text-white font-bold">{val}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-3 border-t-2 border-amber-500/20 mt-2">
                <span className="text-white font-bold">Total Fantasy Points</span>
                <span className="text-amber-400 font-bold text-2xl">{result.total}</span>
              </div>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">⭐</div>
            <p className="text-sm text-slate-600 font-medium">Enter stats and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
