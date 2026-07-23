import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const DICE_TYPES = [4, 6, 8, 10, 12, 20]

export default function dice_roller() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [diceCount, setDiceCount] = useState(2)
  const [sides, setSides] = useState(6)
  const [results, setResults] = useState(null)

  const rollDice = useCallback(() => {
    const n = Math.min(12, Math.max(1, diceCount))
    const rolls = Array.from({ length: n }, () => Math.floor(Math.random() * sides) + 1)
    const total = rolls.reduce((a, b) => a + b, 0)
    setResults({ rolls, total })
  }, [diceCount, sides])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Dice Roller"
      desc="Roll one or many dice online. Choose number of dice and sides (d6, d20) for games and decisions."
      icon="🎲" iconBg="rgba(99,102,241,0.08)"
      category="fun" slug="dice-roller"
      faq={[
        { q: "Can I roll multiple dice?", a: "Yes — set how many dice and how many sides each has." },
        { q: "Is it fair?", a: "Rolls use Math.random() which is suitable for games and casual decisions." },
      ]}
      howItWorks={[
        "Set the number of dice (1–12).",
        "Choose the number of sides per die (d4, d6, d8, d10, d12, d20).",
        "Click Roll and see individual rolls plus the total.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Dice Roller", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/dice-roller/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Number of Dice</label>
            <input type="number" value={diceCount} min={1} max={12}
              onChange={e => setDiceCount(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Sides per Die</label>
            <select value={sides} onChange={e => setSides(parseInt(e.target.value))}
              className={selectClass}>
              {DICE_TYPES.map(d => <option key={d} value={d}>d{d}</option>)}
            </select>
          </div>
        </div>

        <button onClick={() => { rollDice(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          🎲 Roll
        </button>

        {results && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex flex-wrap gap-3 justify-center mb-4">
              {results.rolls.map((r, i) => (
                <div key={i} className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold bg-white/[0.06] border border-white/10 text-white">
                  {r}
                </div>
              ))}
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Rolls: {results.rolls.join(', ')}</div>
              <div className="text-3xl font-extrabold text-white">Total: {results.total}</div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
