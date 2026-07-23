import { useState, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const STORAGE_KEY = 'uptools_coinflip_stats'

function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {}
  return { heads: 0, tails: 0, total: 0, streak: 0, lastResult: '', history: [] }
}

function saveStats(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch (e) {}
}

let audioCtx = null
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function playSound(type) {
  try {
    const ctx = ensureAudio()
    if (type === 'spin') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(150, ctx.currentTime)
      gain.gain.setValueAtTime(0.0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.8)
    } else if (type === 'clink') {
      const now = ctx.currentTime
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(1400, now)
      gain1.gain.setValueAtTime(0.15, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start()
      osc1.stop(now + 0.15)
      setTimeout(() => {
        try {
          const c2 = new (window.AudioContext || window.webkitAudioContext)()
          const o2 = c2.createOscillator()
          const g2 = c2.createGain()
          o2.type = 'sine'
          o2.frequency.setValueAtTime(1100, c2.currentTime)
          g2.gain.setValueAtTime(0.1, c2.currentTime)
          g2.gain.exponentialRampToValueAtTime(0.001, c2.currentTime + 0.1)
          o2.connect(g2)
          g2.connect(c2.destination)
          o2.start()
          o2.stop(c2.currentTime + 0.1)
        } catch (e) {}
      }, 80)
    }
  } catch (e) {}
}

export default function games_coin_flip() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [data, setData] = useState(loadStats)
  const [flipping, setFlipping] = useState(false)
  const [resultText, setResultText] = useState('Click to flip!')
  const [resultColor, setResultColor] = useState('')
  const [coinSide, setCoinSide] = useState('H')
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => { saveStats(data) }, [data])

  const applyResult = useCallback((result) => {
    setData(prev => {
      const newHistory = [result, ...prev.history].slice(0, 50)
      const newTotal = prev.total + 1
      const newHeads = prev.heads + (result === 'H' ? 1 : 0)
      const newTails = prev.tails + (result === 'T' ? 1 : 0)
      const newStreak = result === prev.lastResult ? prev.streak + 1 : 1
      return {
        heads: newHeads,
        tails: newTails,
        total: newTotal,
        streak: newStreak,
        lastResult: result,
        history: newHistory,
      }
    })
    setResultText(result === 'H' ? '🪙 HEADS!' : '🔘 TAILS!')
    setResultColor(result === 'H' ? '#f59e0b' : '#9ca3af')
    setCoinSide(result)
  }, [])

  const flip = useCallback(() => {
    if (flipping) return
    const result = Math.random() < 0.5 ? 'H' : 'T'
    setFlipping(true)
    playSound('spin')
    setTimeout(() => {
      setFlipping(false)
      applyResult(result)
      playSound('clink')
    }, 800)
  }, [flipping, applyResult])

  // Keyboard: Space to flip
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space' && !flipping && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault()
        flip()
        jumpTo()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [flipping, flip, jumpTo])

  const flip10 = useCallback(() => {
    if (flipping) return
    const results = Array.from({ length: 10 }, () => Math.random() < 0.5 ? 'H' : 'T')
    let index = 0
    const doNext = () => {
      if (index >= results.length) {
        const h = results.filter(r => r === 'H').length
        setResultText(`10 flips: ${h} Heads, ${10 - h} Tails`)
        setFlipping(false)
        return
      }
      setFlipping(true)
      playSound('spin')
      setTimeout(() => {
        setFlipping(false)
        applyResult(results[index])
        playSound('clink')
        index++
        setTimeout(doNext, 300)
      }, 700)
    }
    doNext()
  }, [flipping, applyResult])

  const reset = useCallback(() => {
    setData({ heads: 0, tails: 0, total: 0, streak: 0, lastResult: '', history: [] })
    setResultText('Click to flip!')
    setResultColor('')
  }, [])

  const pct = data.total > 0 ? Math.round((data.heads / data.total) * 100) : 50

  return (
    <ToolLayout
      title="Coin Flip"
      desc="Virtual coin toss with heads/tails stats, streaks, and 10-flip mode."
      icon="🪙" iconBg="rgba(245,158,11,0.08)"
      category="fun" slug="games-coin-flip"
      faq={[
        { q: "How does the coin flip work?", a: "It uses a cryptographically random method to simulate a fair 50/50 coin toss." },
        { q: "Can I flip multiple coins?", a: "Yes! Use the 'Flip 10x' button for sequential 10-flip rounds with animated results." },
      ]}
      howItWorks={[
        "Click the coin or press Space to flip.",
        "Track heads vs tails percentage in real-time.",
        "Use 'Flip 10x' for rapid sequential flips.",
        "Stats persist across sessions via localStorage.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Coin Flip", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/coin-flip/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Coin Display */}
        <div className="text-center">
          <div style={{ perspective: '800px' }} className="inline-block">
            <button onClick={() => { flip(); jumpTo() }}
              className="w-32 h-32 rounded-full text-6xl flex items-center justify-center transition-transform duration-500 select-none
                bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-2xl shadow-yellow-500/30 hover:scale-105 active:scale-95"
              style={{ animation: flipping ? 'coinFlip 0.8s ease-in-out' : 'none' }}>
              {coinSide === 'H' ? '🪙' : '🔘'}
            </button>
          </div>
          <div ref={resultRef} className="mt-4 text-2xl font-extrabold" style={{ color: resultColor }}>
            {resultText}
          </div>
          {data.streak > 2 && (
            <div className="text-sm text-orange-400 mt-1">🔥 {data.streak} in a row!</div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={flip}
            className="glow-btn flex-1 py-4 min-h-[48px] rounded-2xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
            disabled={flipping}>
            🪙 Flip
          </button>
          <button onClick={flip10}
            className="glow-btn flex-1 py-4 min-h-[48px] rounded-2xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
            disabled={flipping}>
            ⚡ Flip 10x
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-extrabold text-yellow-400">{data.heads}</div>
            <div className="text-[11px] text-slate-500 mt-1">Heads</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-extrabold text-slate-300">{data.tails}</div>
            <div className="text-[11px] text-slate-500 mt-1">Tails</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-extrabold text-white">{data.total}</div>
            <div className="text-[11px] text-slate-500 mt-1">Total</div>
          </div>
        </div>

        {/* Heads % Bar */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Heads %</span>
            <span className="font-bold text-white">{pct}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
              style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button onClick={() => setShowHistory(!showHistory)}
            className="flex-1 py-3 min-h-[44px] rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 text-sm font-semibold hover:text-white hover:border-white/20 hover:bg-white/[0.1] transition-all">
            History ({data.history.length})
          </button>
          <button onClick={reset}
            className="flex-1 py-3 min-h-[44px] rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 text-sm font-semibold hover:text-white hover:border-white/20 hover:bg-white/[0.1] transition-all">
            Reset
          </button>
        </div>

        {/* History */}
        {showHistory && (
          <div className="glass rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-3">Flip History</h3>
            {data.history.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {data.history.map((r, i) => (
                  <span key={i} className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    r === 'H' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-500/20 text-slate-400'
                  }`}>{r}</span>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-600">No flips yet…</div>
            )}
          </div>
        )}

        {/* Help */}
        <div className="glass rounded-2xl p-4">
          <h3 className="text-sm font-bold text-yellow-400 mb-2">🪙 How to Play</h3>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li><b>Desktop:</b> Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">Space</kbd> to flip</li>
            <li>Click the coin or buttons to flip</li>
            <li>Use Flip 10x for rapid sequential flips</li>
            <li>Stats saved automatically via localStorage</li>
          </ul>
        </div>

        <style>{`
          @keyframes coinFlip {
            0% { transform: rotateY(0deg) scale(1); }
            50% { transform: rotateY(900deg) scale(1.1); }
            100% { transform: rotateY(1800deg) scale(1); }
          }
        `}</style>
      </div>
    </ToolLayout>
  )
}
