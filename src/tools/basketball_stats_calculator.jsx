import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function basketball_stats_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [inputs, setInputs] = useState({ fgm: '', fga: '', threepm: '', ftm: '', fta: '', reb: '', ast: '' })
  const [result, setResult] = useState(null)

  const update = useCallback((key, val) => {
    setInputs(prev => ({ ...prev, [key]: val }))
  }, [])

  const calculate = useCallback(() => {
    const fgm = parseInt(inputs.fgm) || 0
    const fga = parseInt(inputs.fga) || 0
    const threepm = parseInt(inputs.threepm) || 0
    const ftm = parseInt(inputs.ftm) || 0
    const fta = parseInt(inputs.fta) || 0
    const reb = parseInt(inputs.reb) || 0
    const ast = parseInt(inputs.ast) || 0

    if (fga === 0) return

    const fgPct = ((fgm / fga) * 100).toFixed(1)
    const threePct = fga > 0 ? ((threepm / (fga - fgm + threepm)) * 100).toFixed(1) : '0.0'
    const ftPct = fta > 0 ? ((ftm / fta) * 100).toFixed(1) : '0.0'
    const ts = ((fgm + 0.44 * ftm) / (2 * (fga + 0.44 * fta)) * 100).toFixed(1)
    const points = fgm * 2 - threepm + ftm

    setResult({
      fgPct, threePct, ftPct, ts, points, reb, ast,
      label: `FGM:${fgm} FGA:${fga} 3PM:${threepm} FTM:${ftm} FTA:${fta} REB:${reb} AST:${ast}`
    })
  }, [inputs])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  const fields = [
    { key: 'fgm', label: 'Field Goals Made', ph: '0' },
    { key: 'fga', label: 'Field Goals Attempted', ph: '0' },
    { key: 'threepm', label: '3-Pointers Made', ph: '0' },
    { key: 'ftm', label: 'Free Throws Made', ph: '0' },
    { key: 'fta', label: 'Free Throws Attempted', ph: '0' },
    { key: 'reb', label: 'Rebounds', ph: '0' },
    { key: 'ast', label: 'Assists', ph: '0' },
  ]

  return (
    <ToolLayout
      title="Basketball Stats Calculator"
      desc="Calculate shooting percentages, True Shooting %, and player performance metrics. Free online basketball stats tool."
      icon="🏀" iconBg="rgba(234,88,12,0.08)"
      category="sports" slug="basketball-stats-calculator"
      faq={[
        { q: 'What stats does this calculator compute?', a: 'Field Goal %, 3-Point %, Free Throw %, True Shooting %, total points, rebounds, and assists.' },
        { q: 'What is True Shooting %?', a: 'True Shooting % is an advanced metric that accounts for field goals, 3-pointers, and free throws to measure scoring efficiency.' },
      ]}
      howItWorks={[
        "Enter your player's shooting and rebounding stats.",
        "Click Calculate to see all computed metrics.",
        "Compare FG%, 3P%, FT%, and True Shooting % instantly.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "Basketball Stats Calculator", "applicationCategory": "SportsApplication",
        url: "https://www.uptools.in/basketball-stats-calculator/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Input Grid */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.04] p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.key}>
                <label className="block text-sm font-semibold text-slate-300 mb-2">{f.label}</label>
                <input type="number" min="0" placeholder={f.ph}
                  value={inputs[f.key]}
                  onChange={e => update(f.key, e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && calculate()}
                  className={inputClass} />
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => { calculate(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate Stats
        </button>

        {/* Result */}
        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Performance Metrics</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'FG%', value: `${result.fgPct}%`, color: 'text-emerald-400' },
                { label: '3P%', value: `${result.threePct}%`, color: 'text-amber-400' },
                { label: 'FT%', value: `${result.ftPct}%`, color: 'text-sky-400' },
                { label: 'True Shooting %', value: `${result.ts}%`, color: 'text-purple-400' },
                { label: 'Points', value: result.points, color: 'text-rose-400' },
                { label: 'Rebounds', value: result.reb, color: 'text-indigo-400' },
                { label: 'Assists', value: result.ast, color: 'text-teal-400' },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-slate-400 font-medium">{r.label}</span>
                  <span className={`text-lg font-extrabold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏀</div>
            <p className="text-sm text-slate-600 font-medium">Enter shooting stats and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
