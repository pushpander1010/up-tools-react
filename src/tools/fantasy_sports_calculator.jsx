import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const SPORT_FIELDS = {
  cricket: [
    { name: 'runs', label: 'Runs Scored', min: 0 },
    { name: 'fours', label: 'Fours', min: 0 },
    { name: 'sixes', label: 'Sixes', min: 0 },
    { name: 'dismissal', label: 'Dismissal (0=no, 1=yes)', min: 0, max: 1 },
  ],
  'cricket-bowling': [
    { name: 'wickets', label: 'Wickets', min: 0 },
    { name: 'runs', label: 'Runs Conceded', min: 0 },
    { name: 'maidens', label: 'Maiden Overs', min: 0 },
  ],
  football: [
    { name: 'goals', label: 'Goals', min: 0 },
    { name: 'assists', label: 'Assists', min: 0 },
    { name: 'cleansheet', label: 'Clean Sheet (0=no, 1=yes)', min: 0, max: 1 },
  ],
  basketball: [
    { name: 'points', label: 'Points', min: 0 },
    { name: 'rebounds', label: 'Rebounds', min: 0 },
    { name: 'assists', label: 'Assists', min: 0 },
  ],
}

export default function fantasy_sports_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [sport, setSport] = useState('cricket')
  const [values, setValues] = useState({})
  const [result, setResult] = useState(null)

  const fields = useMemo(() => SPORT_FIELDS[sport] || [], [sport])

  const updateField = useCallback((name, val) => {
    setValues(prev => ({ ...prev, [name]: val }))
  }, [])

  const calculate = useCallback(() => {
    let points = 0
    const v = (name) => Number(values[name]) || 0

    if (sport === 'cricket') {
      points = v('runs') + (v('fours') * 1) + (v('sixes') * 2)
      if (v('runs') >= 50) points += 4
      if (v('runs') >= 100) points += 16
      if (v('dismissal') === 1) points -= 2
    } else if (sport === 'cricket-bowling') {
      points = (v('wickets') * 25) + (v('maidens') * 4) - v('runs')
      if (v('wickets') >= 3) points += 4
    } else if (sport === 'football') {
      points = (v('goals') * 10) + (v('assists') * 5) + (v('cleansheet') * 4)
    } else if (sport === 'basketball') {
      points = v('points') + (v('rebounds') * 1.2) + (v('assists') * 1.5)
    }

    setResult(Math.round(points))
    jumpTo()
  }, [sport, values, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="Fantasy Sports Calculator"
      desc="Calculate fantasy points for cricket, football, basketball and more. Dream11 points calculator."
      icon="⭐" iconBg="rgba(234,179,8,0.08)"
      category="utility" slug="fantasy-sports-calculator"
      faq={[
        { q: 'Is this tool free to use?', a: 'Yes. All UpTools calculators are completely free, with no sign-ups required.' },
        { q: 'Is my data private?', a: 'Yes. All calculations run locally in your browser. Nothing is uploaded to any server.' },
        { q: 'Does it work on mobile?', a: 'Yes. All tools are mobile-responsive and work on any device — phone, tablet, or desktop.' },
      ]}
      howItWorks={[
        'Select a sport (Cricket, Football, Basketball).',
        'Enter player stats for the selected sport.',
        'Click Calculate Points to see fantasy points.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Fantasy Sports Calculator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/fantasy-sports-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Sport</label>
            <select value={sport} onChange={e => { setSport(e.target.value); setValues({}); setResult(null) }} className={selectClass}>
              <option value="cricket">Cricket (Batting)</option>
              <option value="cricket-bowling">Cricket (Bowling)</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
            </select>
          </div>
          <div className="space-y-3">
            {fields.map(f => (
              <div key={f.name}>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{f.label}</label>
                <input type="number" value={values[f.name] || ''} onChange={e => updateField(f.name, e.target.value)}
                  placeholder="0" min={f.min} max={f.max} className={inputClass} />
              </div>
            ))}
          </div>
        </div>

        <button onClick={calculate}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate Points
        </button>

        {result !== null && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Fantasy Points</h3>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.04] p-4 text-center">
              <div className="text-xs text-slate-500 mb-1">Total Fantasy Points</div>
              <div className="text-4xl font-extrabold text-indigo-400">{result}</div>
            </div>
          </div>
        )}

        {result === null && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">⭐</div>
            <p className="text-sm text-slate-600 font-medium">Select sport and enter stats</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
