import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

/* ── Audio helpers ────────────────────────────────────────────────────────── */
let audioCtx = null
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}
function playTone(freq, dur, type = 'sine', vol = 0.12) {
  try {
    const ctx = ensureAudio()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    o.frequency.value = freq
    g.gain.setValueAtTime(vol, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + dur)
  } catch { /* ignore */ }
}

/* Colour → frequency map so each pad sounds unique */
const COLORS = [
  { bg: '#ef4444', light: '#fca5a5', name: 'Red',    freq: 330 },
  { bg: '#3b82f6', light: '#93c5fd', name: 'Blue',   freq: 440 },
  { bg: '#22c55e', light: '#86efac', name: 'Green',  freq: 523 },
  { bg: '#eab308', light: '#fde68a', name: 'Yellow', freq: 659 },
]

const LS_KEY = 'ut_mem_seq_best_v1'

/* ── Component ────────────────────────────────────────────────────────────── */
export default function GamesMemorySequence() {
  /* ── State ── */
  const [sequence, setSequence] = useState([])
  const [playerIdx, setPlayerIdx] = useState(0)
  const [activePad, setActivePad] = useState(null)        // index of lit pad
  const [playing, setPlaying] = useState(false)            // show sequence?
  const [waiting, setWaiting] = useState(false)            // player's turn
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem(LS_KEY) || 0) } catch { return 0 }
  })
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const [speed, setSpeed] = useState(600)                 // ms per pad flash
  const timerRef = useRef(null)

  /* ── Cleanup ── */
  useEffect(() => () => clearTimeout(timerRef.current), [])

  /* ── Helpers ── */
  const randomPad = () => Math.floor(Math.random() * 4)

  const flashSequence = useCallback((seq, spd) => {
    setPlaying(true)
    setWaiting(false)
    let i = 0
    const flash = () => {
      if (i >= seq.length) {
        setActivePad(null)
        setPlaying(false)
        setWaiting(true)
        return
      }
      setActivePad(seq[i])
      playTone(COLORS[seq[i]].freq, spd / 1000 * 0.8, 'sine', 0.1)
      setTimeout(() => setActivePad(null), spd * 0.55)
      timerRef.current = setTimeout(flash, spd)
      i++
    }
    timerRef.current = setTimeout(flash, 500)
  }, [])

  const startGame = useCallback(() => {
    const first = randomPad()
    const seq = [first]
    setSequence(seq)
    setScore(0)
    setPlayerIdx(0)
    setGameOver(false)
    setStarted(true)
    flashSequence(seq, speed)
  }, [speed, flashSequence])

  const nextRound = useCallback((prevSeq, prevSpeed) => {
    const next = [...prevSeq, randomPad()]
    setSequence(next)
    setPlayerIdx(0)
    const newSpeed = Math.max(250, (prevSpeed || speed) - 15)
    setSpeed(newSpeed)
    flashSequence(next, newSpeed)
  }, [speed, flashSequence])

  /* ── Player input ── */
  const handlePad = useCallback((idx) => {
    if (!waiting || gameOver) return

    /* Light up & sound */
    setActivePad(idx)
    playTone(COLORS[idx].freq, 0.25, 'sine', 0.12)
    setTimeout(() => setActivePad(null), 200)

    if (idx === sequence[playerIdx]) {
      /* Correct */
      const nextIdx = playerIdx + 1
      setPlayerIdx(nextIdx)
      if (nextIdx === sequence.length) {
        /* Round complete */
        const newScore = score + 1
        setScore(newScore)
        if (newScore > best) {
          setBest(newScore)
          try { localStorage.setItem(LS_KEY, String(newScore)) } catch { /* */ }
        }
        setWaiting(false)
        setTimeout(() => nextRound(sequence, speed), 800)
      }
    } else {
      /* Wrong — game over */
      setGameOver(true)
      setWaiting(false)
      playTone(150, 0.5, 'sawtooth', 0.08)
    }
  }, [waiting, gameOver, playerIdx, sequence, score, best, speed, nextRound])

  /* ── Keyboard support ── */
  useEffect(() => {
    const map = { '1': 0, '2': 1, '3': 2, '4': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 }
    const handler = (e) => {
      const idx = map[e.key.toLowerCase()]
      if (idx !== undefined) handlePad(idx)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handlePad])

  /* ── Render ── */
  return (
    <GameShell
      name="MEMORY SEQUENCE"
      startAction={startGame} startLabel="▶ Start"
      title="Memory Sequence Game – Simon Says Online Free"
      desc="Test your memory! Watch the sequence of colors, then repeat it. Each round gets faster and longer. How far can you go?"
      icon="🧠" iconBg="rgba(239,68,68,0.08)"
      category="fun" slug="games-memory-sequence"
      faq={[
        { q: "How do I play?", a: "Watch the colored pads light up, then click them in the same order." },
        { q: "Does it get harder?", a: "Yes — each round adds one more step and the flashes speed up." },
        { q: "Can I use keyboard?", a: "Yes! Keys 1-4 or A-D correspond to the four pads." },
      ]}
      howItWorks={[
        "Press 'Start Game' to begin.",
        "Watch the sequence of colors that light up.",
        "Repeat the sequence by clicking the pads in order.",
        "Each correct round adds a step and increases speed.",
        "Game ends when you press the wrong pad.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Memory Sequence", "applicationCategory": "Game",
        "genre": ["Puzzle", "Memory", "Brain Training"],
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      }}
    >
      <div className="max-w-lg mx-auto space-y-6">
        {/* ── Score bar ── */}
        <div className="flex items-center justify-between text-sm text-slate-300">
          <div className="flex gap-4">
            <span>Score: <strong className="text-white text-base">{score}</strong></span>
            <span>Best: <strong className="text-amber-400 text-base">{best}</strong></span>
          </div>
          <span className="text-xs text-slate-400">
            Round {sequence.length || 1} · Speed {Math.round((1 / (speed / 1000)) * 10) / 10}×
          </span>
        </div>

        {/* ── Status message ── */}
        <div className="text-center h-8 text-sm font-medium">
          {!started && <span className="text-slate-400">Press Start to play</span>}
          {playing && <span className="text-blue-400 animate-pulse">Watch the sequence…</span>}
          {waiting && <span className="text-green-400">Your turn! Repeat the sequence</span>}
          {gameOver && <span className="text-red-400">Game Over! Final score: {score}</span>}
        </div>

        {/* ── 2×2 Pad grid ── */}
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          {COLORS.map((c, i) => {
            const lit = activePad === i
            return (
              <button
                key={i}
                onClick={() => handlePad(i)}
                disabled={!waiting || gameOver}
                className="aspect-square rounded-2xl transition-all duration-150 select-none focus:outline-none focus:ring-4 focus:ring-white/20"
                style={{
                  background: lit ? c.light : c.bg,
                  boxShadow: lit
                    ? `0 0 40px 10px ${c.bg}80, inset 0 0 30px rgba(255,255,255,0.3)`
                    : `inset 0 -4px 12px rgba(0,0,0,0.3)`,
                  transform: lit ? 'scale(0.95)' : 'scale(1)',
                  opacity: waiting || gameOver ? 1 : 0.7,
                  cursor: waiting && !gameOver ? 'pointer' : 'default',
                }}
                aria-label={`${c.name} pad`}
              />
            )
          })}
        </div>

        {/* ── Controls ── */}
        <div className="flex justify-center gap-3">
          {(started && !gameOver) && (
            <button
              onClick={() => { clearTimeout(timerRef.current); setGameOver(true); setWaiting(false); setPlaying(false) }}
              className="px-6 py-3 rounded-xl text-sm font-medium bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all"
            >
              End Game
            </button>
          )}
        </div>

        {/* ── Instructions ── */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-xs text-slate-400 space-y-1">
          <p><strong className="text-slate-300">Keyboard:</strong> 1 / A = Red, 2 / B = Blue, 3 / C = Green, 4 / D = Yellow</p>
          <p>Each correct round adds one step and increases the flash speed. Try to beat your best score!</p>
        </div>
      </div>
    </GameShell>
  )
}
