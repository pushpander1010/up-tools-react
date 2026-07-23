import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const PRESETS = {
  days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
  months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  dice: ['1','2','3','4','5','6'],
  coin: ['Heads','Tails'],
  yesno: ['Yes','No'],
  cards: (() => {
    const suits = ['♠ Spades','♥ Hearts','♦ Diamonds','♣ Clubs']
    const ranks = ['Ace','2','3','4','5','6','7','8','9','10','Jack','Queen','King']
    return suits.flatMap(s => ranks.map(r => `${r} of ${s}`))
  })(),
}

const CONFETTI = ['🎊','🎉','⭐','✨','💥','🌟','🎈','🏆','💎','🎆','🔥','🎇']

export default function random_choice_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [winner, setWinner] = useState('')
  const [history, setHistory] = useState([])
  const [spinning, setSpinning] = useState(false)
  const [removeAfterPick, setRemoveAfterPick] = useState(false)
  const [noDuplicates, setNoDuplicates] = useState(true)
  const poolRef = useRef([])
  const spinRef = useRef(null)

  const parseChoices = useCallback((raw) => {
    return raw.split('\n').flatMap(l => l.split(',')).map(s => s.trim()).filter(s => s.length > 0)
  }, [])

  const choices = parseChoices(input)

  const drumRoll = useCallback((allChoices, chosen, onDone) => {
    setSpinning(true)
    let elapsed = 0
    let delay = 55
    const TOTAL = 1400
    const step = () => {
      const remaining = TOTAL - elapsed
      const flash = allChoices[Math.floor(Math.random() * allChoices.length)]
      setWinner(flash)
      if (remaining < 600) delay = 120
      else if (remaining < 900) delay = 85
      elapsed += delay
      if (elapsed >= TOTAL) {
        setWinner(chosen)
        onDone()
        return
      }
      spinRef.current = setTimeout(step, delay)
    }
    step()
  }, [])

  const pick = useCallback(() => {
    if (spinning || choices.length === 0) return
    let pool = removeAfterPick
      ? (poolRef.current.length > 0 ? poolRef.current : [...choices])
      : choices
    if (pool.length === 0) { setWinner('🏁 Pool exhausted!'); return }

    let pickable = pool
    if (noDuplicates && history.length > 0 && pool.length > 1) {
      pickable = pool.filter(c => c !== history[0])
      if (pickable.length === 0) pickable = pool
    }

    const chosen = pickable[Math.floor(Math.random() * pickable.length)]

    if (removeAfterPick) {
      poolRef.current = pool.filter(c => c !== chosen)
    }

    drumRoll(choices, chosen, () => {
      jumpTo()
      const now = new Date()
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      setHistory(prev => [{ choice: chosen, time }, ...prev].slice(0, 10))
      setTimeout(() => setSpinning(false), 120)
    })
  }, [spinning, choices, history, removeAfterPick, noDuplicates, drumRoll, jumpTo])

  const loadPreset = useCallback((key) => {
    setInput(PRESETS[key].join('\n'))
    poolRef.current = [...PRESETS[key]]
    setWinner('')
  }, [])

  return (
    <ToolLayout
      title="Random Choice Generator"
      desc="Decision maker with dramatic drum roll animation. Enter choices and pick one randomly."
      icon="🎲" iconBg="rgba(245,158,11,0.08)"
      category="tools" slug="random-choice-generator"
      faq={[
        { q: 'How does it work?', a: 'Enter choices (one per line or comma-separated), then click Pick One to randomly select.' },
        { q: 'What does "Remove After Pick" do?', a: 'When enabled, each picked choice is removed from the pool so it won\'t be picked again.' },
      ]}
      howItWorks={[
        'Enter your choices (one per line or comma-separated).',
        'Or pick a preset like Days, Dice, Coin, etc.',
        'Click "Pick One!" for a dramatic drum roll selection.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Random Choice Generator", "applicationCategory": "UtilityApplication",
        "url": "https://www.uptools.in/random-choice-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(PRESETS).map(key => (
            <button key={key} onClick={() => loadPreset(key)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all capitalize">
              {key === 'yesno' ? 'Yes/No' : key}
            </button>
          ))}
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Your Choices <span className="text-slate-500 font-normal">({choices.length} choices)</span>
          </label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={"Option 1\nOption 2\nOption 3"}
            rows={5}
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-600 resize-none" />
        </div>

        {/* Options */}
        <div className="flex gap-4 text-xs text-slate-400">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={removeAfterPick} onChange={e => setRemoveAfterPick(e.target.checked)}
              className="accent-amber-500" />
            Remove after pick
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={noDuplicates} onChange={e => setNoDuplicates(e.target.checked)}
              className="accent-amber-500" />
            No consecutive duplicates
          </label>
        </div>

        {/* Pick Button */}
        <button onClick={pick} disabled={spinning || choices.length === 0}
          className="w-full py-4 rounded-2xl text-sm font-bold transition-all disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          {spinning ? '⏳ Deciding...' : '🎲 Pick One!'}
        </button>

        {/* Winner */}
        {winner && (
          <div ref={resultRef}
            className={`text-center py-8 rounded-3xl border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] via-white/[0.02] to-transparent ${!spinning ? 'animate-pulse-once' : ''}`}
            style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="text-5xl mb-2">🎉</div>
            <div className={`text-3xl font-extrabold ${spinning ? 'text-amber-300/60' : 'text-amber-400'}`}>
              {winner}
            </div>
          </div>
        )}

        {!winner && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.02]">
            <div className="text-4xl mb-3 opacity-20">🎲</div>
            <p className="text-sm text-slate-600 font-medium">Enter choices above and click Pick One!</p>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
            <h3 className="text-sm font-bold text-slate-300 mb-3">History</h3>
            <div className="space-y-1">
              {history.map((h, i) => (
                <div key={i} className="flex justify-between items-center py-1 text-xs">
                  <span className="text-white/80">#{i + 1} {h.choice}</span>
                  <span className="text-slate-500">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
