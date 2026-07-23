import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LS = { BEST_EASY: 'ut_mm_best_easy', BEST_MED: 'ut_mm_best_med', BEST_HARD: 'ut_mm_best_hard' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) { try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {} }
function playFlip() { playTone(500,0.08,'sine',0.05) }
function playMatch() { playTone(600,0.15,'sine',0.07); setTimeout(()=>playTone(800,0.15,'sine',0.06),80) }
function playNoMatch() { playTone(200,0.2,'square',0.04) }
function playWin() { [0,80,160,240,320,400].forEach((d,i)=>setTimeout(()=>playTone(440+i*80,0.2,'sine',0.06),d)) }

const EMOJIS = [
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
  '🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🦆','🦅',
  '🍕','🍔','🍟','🌭','🍿','🧁','🎂','🍩','🍪','🍫',
  '⚽','🏀','🏈','⚾','🎾','🏐','🎱','🏓','🥊','🎯',
  '🎸','🎹','🎺','🎻','🥁','🎨','🎭','🎪','🎬','🎤',
  '🚀','✈️','🚂','🚗','⛵','🏠','🏰','🌈','⭐','🔥',
]

const DIFFICULTIES = {
  easy: { rows: 3, cols: 4, pairs: 6, label: 'Easy (4×3)' },
  medium: { rows: 4, cols: 4, pairs: 8, label: 'Medium (4×4)' },
  hard: { rows: 5, cols: 6, pairs: 15, label: 'Hard (6×5)' },
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function createCards(difficulty) {
  const { pairs } = DIFFICULTIES[difficulty]
  const selected = shuffle(EMOJIS).slice(0, pairs)
  const cards = shuffle([...selected, ...selected].map((emoji, i) => ({
    id: i, emoji, flipped: false, matched: false
  })))
  return cards
}

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function games_memory_match() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [difficulty, setDifficulty] = useState('easy')
  const [cards, setCards] = useState(() => createCards('easy'))
  const [flippedIds, setFlippedIds] = useState([])
  const [moves, setMoves] = useState(0)
  const [timer, setTimer] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [bestScores, setBestScores] = useState(() => {
    try {
      return {
        easy: Number(localStorage.getItem(LS.BEST_EASY)) || 0,
        medium: Number(localStorage.getItem(LS.BEST_MED)) || 0,
        hard: Number(localStorage.getItem(LS.BEST_HARD)) || 0,
      }
    } catch { return { easy: 0, medium: 0, hard: 0 } }
  })
  const timerRef = useRef(null)
  const lockRef = useRef(false)

  const { rows, cols } = DIFFICULTIES[difficulty]

  useEffect(() => {
    if (gameStarted && !gameOver) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [gameStarted, gameOver])

  useEffect(() => {
    const matched = cards.filter(c => c.matched).length
    if (matched === cards.length && cards.length > 0 && gameStarted) {
      setGameOver(true)
      clearInterval(timerRef.current)
      playWin()
      const lsKey = difficulty === 'easy' ? LS.BEST_EASY : difficulty === 'medium' ? LS.BEST_MED : LS.BEST_HARD
      const best = bestScores[difficulty]
      if (best === 0 || moves < best) {
        setBestScores(prev => ({ ...prev, [difficulty]: moves }))
        try { localStorage.setItem(lsKey, String(moves)) } catch {}
      }
    }
  }, [cards, difficulty, moves, bestScores, gameStarted])

  const handleCardClick = useCallback((id) => {
    if (lockRef.current) return
    if (flippedIds.length >= 2) return
    const card = cards.find(c => c.id === id)
    if (!card || card.flipped || card.matched) return

    if (!gameStarted) setGameStarted(true)

    playFlip()
    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c)
    const newFlipped = [...flippedIds, id]
    setCards(newCards)
    setFlippedIds(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      const [firstId, secondId] = newFlipped
      const first = newCards.find(c => c.id === firstId)
      const second = newCards.find(c => c.id === secondId)

      if (first.emoji === second.emoji) {
        lockRef.current = true
        setTimeout(() => {
          playMatch()
          setCards(prev => prev.map(c => c.id === firstId || c.id === secondId ? { ...c, matched: true } : c))
          setFlippedIds([])
          lockRef.current = false
        }, 400)
      } else {
        lockRef.current = true
        setTimeout(() => {
          playNoMatch()
          setCards(prev => prev.map(c => c.id === firstId || c.id === secondId ? { ...c, flipped: false } : c))
          setFlippedIds([])
          lockRef.current = false
        }, 800)
      }
    }
  }, [cards, flippedIds, gameStarted])

  const startGame = useCallback((diff) => {
    setDifficulty(diff)
    setCards(createCards(diff))
    setFlippedIds([])
    setMoves(0)
    setTimer(0)
    setGameStarted(false)
    setGameOver(false)
    clearInterval(timerRef.current)
    lockRef.current = false
  }, [])

  const matchedCount = cards.filter(c => c.matched).length / 2
  const totalPairs = cards.length / 2

  return (
    <ToolLayout
      title="Memory Match Game - Test Your Memory"
      desc="Play Memory Match online for free! Flip cards, find matching pairs, and test your memory skills. Multiple difficulty levels with score tracking."
      icon="🧠"
      iconBg="rgba(139,92,246,0.08)"
      category="fun"
      slug="games-memory-match"
      faq={[
        { q: "How do I play Memory Match?", a: "Click or tap cards to flip them. Find all matching pairs by remembering where each card is located." },
        { q: "What are the difficulty levels?", a: "Easy has 6 pairs (4×3), Medium has 8 pairs (4×4), and Hard has 15 pairs (6×5)." },
        { q: "How is my score calculated?", a: "Your score is the number of moves it takes to find all pairs. Fewer moves means a better score!" },
        { q: "Are my best scores saved?", a: "Yes! Your best score for each difficulty is saved on your device and displayed when you start a new game." },
      ]}
      howItWorks={[
        "Click or tap a card to flip it and reveal its emoji.",
        "Click a second card to see if it matches the first.",
        "If they match, both cards stay face up. If not, they flip back.",
        "Find all matching pairs in the fewest moves possible!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Memory Match Game", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/memory-match/",
        "genre": "Puzzle", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Difficulty selector */}
        <div className="flex gap-2 justify-center flex-wrap">
          {Object.entries(DIFFICULTIES).map(([key, d]) => (
            <button key={key} onClick={() => startGame(key)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${difficulty === key ? 'text-white' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white'}`}
              style={difficulty === key ? { background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' } : {}}>
              {d.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div ref={resultRef} className="flex items-center justify-between px-4 py-3 bg-black/20 rounded-xl border border-white/[0.06]">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{moves}</div>
            <div className="text-xs text-slate-500">Moves</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{matchedCount}/{totalPairs}</div>
            <div className="text-xs text-slate-500">Pairs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{formatTime(timer)}</div>
            <div className="text-xs text-slate-500">Time</div>
          </div>
          {bestScores[difficulty] > 0 && (
            <div className="text-center">
              <div className="text-lg font-bold text-amber-400">🏆 {bestScores[difficulty]}</div>
              <div className="text-xs text-slate-500">Best</div>
            </div>
          )}
        </div>

        {/* Card grid */}
        <div className="mx-auto" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: '8px', maxWidth: cols * 80 + 'px' }}>
          {cards.map((card) => (
            <div key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="relative cursor-pointer select-none"
              style={{ aspectRatio: '1', perspective: '600px' }}>
              <div className="absolute inset-0 transition-transform duration-300"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: (card.flipped || card.matched) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}>
                {/* Back of card */}
                <div className="absolute inset-0 rounded-xl flex items-center justify-center border border-white/[0.08] bg-white/[0.08] hover:bg-white/[0.12] transition-colors"
                  style={{ backfaceVisibility: 'hidden' }}>
                  <span className="text-2xl sm:text-3xl opacity-30">❓</span>
                </div>
                {/* Front of card */}
                <div className={`absolute inset-0 rounded-xl flex items-center justify-center border transition-all ${card.matched ? 'bg-emerald-500/20 border-emerald-500/30 scale-105' : 'bg-indigo-500/20 border-indigo-500/30'}`}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <span className="text-3xl sm:text-4xl">{card.emoji}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Game over */}
        {gameOver && (
          <div className="text-center p-6 bg-black/30 rounded-2xl border border-white/[0.06] space-y-3">
            <div className="text-4xl">🎉</div>
            <h2 className="text-xl font-bold text-white">Congratulations!</h2>
            <p className="text-sm text-slate-400">You found all {totalPairs} pairs in {moves} moves and {formatTime(timer)}!</p>
            {bestScores[difficulty] === moves && moves > 0 && (
              <p className="text-sm text-amber-400 font-bold">🏆 New Best Score!</p>
            )}
            <button onClick={() => startGame(difficulty)} className="px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' }}>
              Play Again
            </button>
          </div>
        )}

        <p className="text-center text-xs text-slate-500">Click cards to flip • Find all matching pairs • Fewest moves wins</p>
      </div>
    </ToolLayout>
  )
}
