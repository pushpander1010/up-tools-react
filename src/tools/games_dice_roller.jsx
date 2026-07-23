import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const DICE_FACES = {
  4: ['❶', '❷', '❸', '❹'],
  6: ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'],
  8: ['❶', '❷', '❸', '❹', '❺', '❻', '❼', '❽'],
  10: ['❶', '❷', '❸', '❹', '❺', '❻', '❼', '❽', '❾', '❿'],
  12: ['❶', '❷', '❸', '❹', '❺', '❻', '❼', '❽', '❾', '❿', '⓫', '⓬'],
  20: ['❶', '❷', '❸', '❹', '❺', '❻', '❼', '❽', '❾', '❿', '⓫', '⓬', '⓭', '⓮', '⓯', '⓰', '⓱', '⓲', '⓳', '⓴'],
}

const DICE_TYPES = [4, 6, 8, 10, 12, 20]

function getDieContent(value, sides) {
  if (sides === 6 && DICE_FACES[6]?.[value - 1]) return DICE_FACES[6][value - 1]
  if (DICE_FACES[sides]?.[value - 1]) return DICE_FACES[sides][value - 1]
  return value
}

// WebAudio sounds
let audioCtx = null
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function playRollSound() {
  try {
    const ctx = initAudio()
    const now = ctx.currentTime
    for (let i = 0; i < 6; i++) {
      const t = now + i * 0.06
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(150 + Math.random() * 100, t)
      gain.gain.setValueAtTime(0.10, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.04)
    }
  } catch (e) {}
}

function playLandSound() {
  try {
    const ctx = initAudio()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(80, now)
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.12)
    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.12)
  } catch (e) {}
}

const STATS_KEY = 'uptools_dice_stats'
function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {}
  return { totalRolls: 0, totalDiceRolled: 0, largestTotal: 0 }
}
function saveStats(stats) {
  try { localStorage.setItem(STATS_KEY, JSON.stringify(stats)) } catch (e) {}
}

export default function games_dice_roller() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [activeSides, setActiveSides] = useState(6)
  const [customSides, setCustomSides] = useState('')
  const [diceCount, setDiceCount] = useState(1)
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(null)
  const [rolling, setRolling] = useState(false)
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState(loadStats)
  const [showHistory, setShowHistory] = useState(false)

  const sides = customSides ? Math.max(2, parseInt(customSides) || 6) : activeSides

  const rollDice = useCallback(() => {
    if (rolling) return
    const count = Math.max(1, Math.min(20, diceCount))
    const newResults = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1)
    const newTotal = newResults.reduce((a, b) => a + b, 0)

    setRolling(true)
    setResults([])
    setTotal(null)
    playRollSound()

    setTimeout(() => {
      setResults(newResults)
      setTotal(newTotal)
      setRolling(false)
      playLandSound()

      const entry = `${count}D${sides}: [${newResults.join(', ')}] = ${newTotal}`
      setHistory(prev => [entry, ...prev].slice(0, 20))

      const newStats = {
        totalRolls: stats.totalRolls + 1,
        totalDiceRolled: stats.totalDiceRolled + count,
        largestTotal: Math.max(stats.largestTotal, newTotal),
      }
      setStats(newStats)
      saveStats(newStats)
    }, 500)
  }, [rolling, diceCount, sides, stats])

  const clearResults = useCallback(() => {
    setResults([])
    setTotal(null)
  }, [])

  const clearHistory = useCallback(() => setHistory([]), [])

  const resetStats = useCallback(() => {
    const s = { totalRolls: 0, totalDiceRolled: 0, largestTotal: 0 }
    setStats(s)
    saveStats(s)
  }, [])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  // Keyboard: Space to roll
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space' && !rolling && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault()
        rollDice()
        jumpTo()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [rolling, rollDice, jumpTo])

  return (
    <ToolLayout
      title="Dice Roller"
      desc="Roll D4–D20 virtual dice with sound effects, history, and statistics."
      icon="🎲" iconBg="rgba(99,102,241,0.08)"
      category="fun" slug="games-dice-roller"
      faq={[
        { q: "What dice types are supported?", a: "D4, D6, D8, D10, D12, D20, and any custom number of sides from 2 to 100." },
        { q: "How to roll multiple dice?", a: "Enter a number in the Count field (1–20) and click Roll. All dice roll simultaneously." },
      ]}
      howItWorks={[
        "Choose a dice type (D4–D20) or enter custom sides.",
        "Set how many dice to roll (1–20).",
        "Click Roll or press Space to roll all dice.",
        "View results, history, and statistics.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Dice Roller", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/dice-roller/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Dice Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Dice Type</label>
          <div className="flex flex-wrap gap-2">
            {DICE_TYPES.map(d => (
              <button key={d} onClick={() => { setActiveSides(d); setCustomSides('') }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeSides === d && !customSides
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.1]'
                }`}>
                D{d}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Sides + Count */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Custom Sides</label>
            <input type="number" min="2" max="100" value={customSides}
              onChange={e => setCustomSides(e.target.value)}
              placeholder="2-100"
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Count</label>
            <input type="number" min="1" max="20" value={diceCount}
              onChange={e => setDiceCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
              className={inputClass} />
          </div>
        </div>

        {/* Roll Button */}
        <button onClick={() => { rollDice(); jumpTo() }}
          className="glow-btn w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
          disabled={rolling}>
          {rolling ? '🎲 Rolling...' : `🎲 Roll ${diceCount}D${sides}`}
        </button>

        {/* Dice Display */}
        <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden">
          {results.length > 0 ? (
            <div>
              <div className="flex flex-wrap gap-3 justify-center mb-4">
                {results.map((r, i) => (
                  <div key={i} className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold
                    ${rolling ? 'bg-white/10 animate-pulse' : 'glass'}`}>
                    {rolling ? '🎲' : getDieContent(r, sides)}
                  </div>
                ))}
              </div>
              {total !== null && (
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-white">{total}</div>
                  {results.length > 1 && (
                    <div className="text-xs text-slate-500 mt-1">[{results.join(', ')}]</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-3 opacity-30">🎲</div>
              <p className="text-sm text-slate-600 font-medium">Click Roll to cast your dice</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button onClick={clearResults}
            className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 text-sm font-semibold hover:text-white hover:border-white/20 hover:bg-white/[0.1] transition-all">
            Clear
          </button>
          <button onClick={() => setShowHistory(!showHistory)}
            className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 text-sm font-semibold hover:text-white hover:border-white/20 hover:bg-white/[0.1] transition-all">
            History ({history.length})
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-extrabold text-white">{stats.totalRolls}</div>
            <div className="text-[11px] text-slate-500 mt-1">Total Rolls</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-extrabold text-white">{stats.totalDiceRolled}</div>
            <div className="text-[11px] text-slate-500 mt-1">Dice Rolled</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-extrabold text-white">{stats.largestTotal || '—'}</div>
            <div className="text-[11px] text-slate-500 mt-1">Largest Total</div>
          </div>
        </div>
        <button onClick={resetStats}
          className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
          Reset Stats
        </button>

        {/* History */}
        {showHistory && (
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Roll History</h3>
              <button onClick={clearHistory} className="text-xs text-slate-600 hover:text-slate-400">Clear</button>
            </div>
            {history.length > 0 ? (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {history.map((h, i) => (
                  <div key={i} className="text-xs text-slate-400 font-mono py-1 border-b border-white/5 last:border-0">{h}</div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-600 py-2">No rolls yet…</div>
            )}
          </div>
        )}

        {/* Help */}
        <div className="glass rounded-2xl p-4">
          <h3 className="text-sm font-bold text-indigo-400 mb-2">🎲 How to Play</h3>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li><b>Desktop:</b> Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">Space</kbd> to roll</li>
            <li>Choose dice type (D4–D20) or enter custom sides (2–100)</li>
            <li>Roll multiple dice at once (1–20)</li>
            <li>Track your stats and roll history</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
}
