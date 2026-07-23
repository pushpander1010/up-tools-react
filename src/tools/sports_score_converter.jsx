import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const CONVERSIONS = {
  basketball: {
    name: 'Basketball',
    points: [1, 2, 3],
    descriptions: ['Free Throw', 'Field Goal', 'Three-Pointer']
  },
  football: {
    name: 'American Football',
    points: [3, 6, 7, 8, 2],
    descriptions: ['Field Goal', 'Touchdown', 'Touchdown + Extra Point', 'Touchdown + 2-Point Conversion', 'Safety']
  },
  soccer: {
    name: 'Soccer/Football',
    points: [1, 3],
    descriptions: ['Goal', 'Win (3 pts)']
  },
  tennis: {
    name: 'Tennis',
    points: [1, 4, 6],
    descriptions: ['Point', 'Game', 'Set']
  },
  baseball: {
    name: 'Baseball',
    points: [1, 2, 3, 4],
    descriptions: ['Single', 'Double', 'Triple', 'Home Run']
  },
  hockey: {
    name: 'Ice Hockey',
    points: [1, 2, 3],
    descriptions: ['Goal', 'Assist', 'Win (2 pts)']
  }
}

export default function sports_score_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [sport, setSport] = useState('basketball')
  const [score, setScore] = useState('')
  const [results, setResults] = useState(null)

  const convert = useCallback(() => {
    const s = parseInt(score)
    if (isNaN(s) || s < 0) return
    const data = CONVERSIONS[sport]
    const conversions = data.points.map((point, idx) => ({
      label: data.descriptions[idx],
      count: Math.floor(s / point)
    })).filter(c => c.count > 0)
    setResults(conversions)
    jumpTo()
  }, [sport, score, jumpTo])

  return (
    <ToolLayout
      title="Sports Score Converter"
      desc="Convert scores between different sports formats and scoring systems."
      icon="⚽" iconBg="rgba(34,197,94,0.08)"
      category="utility" slug="sports-score-converter"
      faq={[
        { q: 'What sports are supported?', a: 'Basketball, American Football, Soccer, Tennis, Baseball, and Ice Hockey.' },
        { q: 'How does the conversion work?', a: 'Enter a score and select a sport — it breaks down the score into scoring events (e.g., 10 basketball points = 10 free throws, or 5 field goals).' },
        { q: 'Is this tool free?', a: 'Yes, completely free with no sign-ups required.' }
      ]}
      howItWorks={[
        'Select a sport from the dropdown.',
        'Enter the score you want to convert.',
        'Click Convert to see the breakdown of scoring events.'
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Sports Score Converter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/sports-score-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 font-medium mb-1 block">Sport</label>
            <select value={sport} onChange={(e) => setSport(e.target.value)}
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3 text-white text-sm font-semibold outline-none focus:border-emerald-500/40 transition-all [color-scheme:dark]">
              {Object.entries(CONVERSIONS).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-medium mb-1 block">Score</label>
            <input type="number" value={score} onChange={(e) => setScore(e.target.value)} min="0" placeholder="Enter score"
              onKeyDown={(e) => { if (e.key === 'Enter') convert() }}
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3 text-white text-sm outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-600" />
          </div>
        </div>

        <button onClick={convert}
          className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all duration-200 active:scale-[0.98]">
          ⚽ Convert
        </button>

        {results ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Conversion Results</h3>
            </div>
            {results.length > 0 ? (
              <div className="space-y-2">
                {results.map((r, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-sm text-slate-300">{r.label}</span>
                    <span className="text-lg font-bold text-emerald-400">{r.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No conversions available for this score.</p>
            )}
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">⚽</div>
            <p className="text-sm text-slate-600 font-medium">Enter a score and select a sport to see conversions</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
