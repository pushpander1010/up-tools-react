import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const LS = { BEST: 'ut_Stack Tower_best_v1' }
const BLOCK_HEIGHT = 28
const INITIAL_WIDTH = 250
const SPEED_START = 2
const SPEED_INC = 0.15
const PERFECT_THRESHOLD = 4
const MAX_LIVES = 3

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); return audioCtx }
function playTone(freq, dur, type = 'sine', vol = 0.08) {
  try { const ctx = ensureAudio(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(vol, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur) } catch {}
}
function playPlace(perfect) { playTone(perfect ? 880 : 550, 0.1, 'sine', 0.07); if (perfect) setTimeout(() => playTone(1100, 0.08, 'sine', 0.06), 80) }
function playMiss() { playTone(200, 0.2, 'sawtooth', 0.06); setTimeout(() => playTone(150, 0.25, 'sawtooth', 0.04), 100) }
function playGameOver() { playTone(300, 0.3, 'sawtooth', 0.06); setTimeout(() => playTone(150, 0.5, 'sawtooth', 0.05), 200) }

export default function games_stack_tower() {
  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => { try { return Number(localStorage.getItem(LS.BEST) || 0) } catch { return 0 } })
  const [lives, setLives] = useState(MAX_LIVES)
  const [streak, setStreak] = useState(0)
  const [boardSize, setBoardSize] = useState(380)
  const [blocks, setBlocks] = useState([])
  const [movingBlock, setMovingBlock] = useState(null)
  const [gameMessage, setGameMessage] = useState('')
  const boardRef = useRef(null)
  const stateRef = useRef({
    blocks: [], movingBlock: null, score: 0, lives: MAX_LIVES, streak: 0,
    speed: SPEED_START, direction: 1, running: false, perfectStreak: 0,
  })
  const rafRef = useRef(null)

  useEffect(() => { resizeBoard() }, [])
  useEffect(() => {
    const h = () => resizeBoard()
    window.addEventListener('resize', h)
    window.addEventListener('ut:board-h', h)
    return () => { window.removeEventListener('resize', h); window.removeEventListener('ut:board-h', h) }
  }, [])

  const resizeBoard = () => {
    if (boardRef.current) {
      const parentW = boardRef.current.parentElement.clientWidth
      const vpW = window.innerWidth
      const w = Math.min(380, parentW - 16, (window.__utBoardH || 1e9) - 16, vpW - 32)
      setBoardSize(Math.max(260, w))
    }
  }

  const startNew = useCallback(() => {
    const baseBlock = { x: (boardSize - INITIAL_WIDTH) / 2, width: INITIAL_WIDTH, color: '#3b82f6' }
    stateRef.current = {
      blocks: [baseBlock],
      movingBlock: { x: boardSize, width: INITIAL_WIDTH, color: '#60a5fa', direction: 1 },
      score: 0, lives: MAX_LIVES, streak: 0, speed: SPEED_START,
      direction: 1, running: true, perfectStreak: 0,
    }
    setBlocks([baseBlock])
    setMovingBlock({ x: boardSize, width: INITIAL_WIDTH, color: '#60a5fa', direction: 1 })
    setScore(0); setLives(MAX_LIVES); setStreak(0)
    setGameOver(false); setPlaying(true); setGameMessage('')
  }, [boardSize])

  useEffect(() => {
    if (!playing || gameOver) return

    const loop = () => {
      if (!stateRef.current.running) return
      const s = stateRef.current
      const mb = s.movingBlock
      if (!mb) return

      const speed = s.speed
      mb.x += speed * mb.direction
      if (mb.x + mb.width > boardSize) { mb.direction = -1; mb.x = boardSize - mb.width }
      if (mb.x < 0) { mb.direction = 1; mb.x = 0 }

      s.movingBlock = { ...mb }
      setMovingBlock({ ...mb })
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, gameOver, boardSize])

  useEffect(() => {
    if (!playing || gameOver) return
    const handler = (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); placeBlock() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [playing, gameOver])

  const placeBlock = useCallback(() => {
    const s = stateRef.current
    if (!s.running || !s.movingBlock) return

    const mb = s.movingBlock
    const lastBlock = s.blocks[s.blocks.length - 1]
    const overlap = Math.min(mb.x + mb.width, lastBlock.x + lastBlock.width) - Math.max(mb.x, lastBlock.x)

    if (overlap <= 0) {
      // Miss — lost a life
      playMiss()
      s.lives--
      s.streak = 0
      setLives(s.lives)
      setStreak(0)
      setGameMessage('Missed! 💔')
      if (s.lives <= 0) {
        s.running = false
        setGameOver(true)
        playGameOver()
        setBest(prev => { const nb = Math.max(prev, s.score); try { localStorage.setItem(LS.BEST, String(nb)) } catch {}; return nb })
        return
      }
      // Reset moving block to full width of last block
      s.movingBlock = { x: 0, width: lastBlock.width, color: getNextColor(s.blocks.length + 1), direction: 1 }
      s.speed = SPEED_START + s.blocks.length * SPEED_INC
      setMovingBlock(s.movingBlock)
      return
    }

    // Trim the overhang
    const newX = Math.max(mb.x, lastBlock.x)
    const newWidth = overlap
    const trimmed = mb.width - newWidth
    const isPerfect = trimmed < PERFECT_THRESHOLD && trimmed >= 0

    if (isPerfect) {
      s.perfectStreak++
      s.streak = s.perfectStreak
      playPlace(true)
      setGameMessage('Perfect! ⭐')
    } else {
      s.perfectStreak = 0
      s.streak = 0
      playPlace(false)
      setGameMessage(`Trimmed ${Math.round(trimmed)}px`)
    }

    const newBlock = { x: newX, width: newWidth, color: getNextColor(s.blocks.length + 1) }
    s.blocks.push(newBlock)
    s.score += Math.round(newWidth * 0.5)
    s.speed = SPEED_START + s.blocks.length * SPEED_INC

    // Bonus for perfect streaks
    if (s.perfectStreak >= 5) {
      s.score += 50
      setGameMessage('🔥 5x Perfect Streak! +50')
    }

    s.movingBlock = { x: -newWidth, width: newWidth, color: getNextColor(s.blocks.length + 2), direction: 1 }
    setBlocks([...s.blocks])
    setMovingBlock(s.movingBlock)
    setScore(s.score)
    setStreak(s.streak)
  }, [])

  const getNextColor = (idx) => {
    const colors = ['#3b82f6', '#60a5fa', '#22c55e', '#eab308', '#f97316', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']
    return colors[idx % colors.length]
  }

  const towerHeight = blocks.length * BLOCK_HEIGHT

  return (
    <GameShell
      name="Stack Tower"
      startAction={startNew} startLabel="🏗️ Start Stacking"
      title="Stack Tower — Play Free Stacking Game Online"
      desc="Stack moving blocks as precisely as possible! Tap to place, trim the overhang, and build the tallest tower you can."
      icon="🏗️" iconBg="rgba(59,130,246,0.08)"
      category="fun" slug="games-stack-tower"
      faq={[
        { q: "How do I play Stack Tower?", a: "Press Space, Enter, or tap the screen to place the moving block on top of the last one. The overhang gets trimmed each time." },
        { q: "What happens if I miss?", a: "If the moving block doesn't overlap at all, you lose a life. You have 3 lives total." },
        { q: "What is the perfect streak bonus?", a: "Place blocks with very little trim (under 4px) to build a perfect streak. 5 perfects in a row gives +50 bonus points!" },
        { q: "How do I play Stack Tower — Play Free Stacking Game Online online free?", a: "Click Start and press Space, Enter, or tap to stack. Works on mobile and desktop. No download needed." },
        { q: "Can I play Stack Tower — Play Free Stacking Game Online without downloading?", a: "Yes. This Stack Tower — Play Free Stacking Game Online runs in your browser with no install. Free on mobile and desktop." },
        { q: "Is this Stack Tower — Play Free Stacking Game Online free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        "A block slides back and forth at increasing speed.",
        "Press Space, Enter, or tap to place the block on the stack.",
        "Overhanging parts are trimmed — closer to center means more points.",
        "Miss completely and you lose a life. 3 lives or go for the perfect streak!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Stack Tower", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/stack-tower/",
        "genre": "Arcade",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="min-w-0 space-y-5">
        {!playing && (
          <div className="glass p-6 text-center">
            <div className="text-5xl mb-3">🏗️</div>
            <h2 className="text-xl font-bold text-white mb-2">Stack Tower</h2>
            <p className="text-sm text-slate-400 mb-4">Tap to place, build the tallest tower!</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="glass p-3 rounded-xl"><div className="text-lg font-bold text-blue-400">⬆️</div><div className="text-xs text-slate-400">Stack Up</div></div>
              <div className="glass p-3 rounded-xl"><div className="text-lg font-bold text-yellow-400">⭐</div><div className="text-xs text-slate-400">Perfect = Bonus</div></div>
              <div className="glass p-3 rounded-xl"><div className="text-lg font-bold text-red-400">❤️×3</div><div className="text-xs text-slate-400">3 Lives</div></div>
            </div>
            {best > 0 && <p className="text-xs text-slate-400 mb-3">🏆 Best: {best}</p>}
            <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 transition-all">🏗️ Start Stacking</button>
          </div>
        )}

        {playing && (
          <>
            <div className="flex gap-3 items-center justify-between">
              <div className="flex gap-2">
                <div className="px-3 py-2 glass text-sm font-bold text-white">📏 {score}</div>
                <div className="px-3 py-2 glass text-sm text-slate-400">Best: {best}</div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="px-3 py-2 glass text-sm text-red-400">❤️ {lives}</div>
                {streak > 0 && <div className="px-3 py-2 glass text-sm text-yellow-400">⭐ {streak}x</div>}
                <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">⟲</button>
                <button onClick={() => { stateRef.current.running = false; setPlaying(false) }} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">⟵</button>
              </div>
            </div>

            <div ref={boardRef} className="glass p-3">
              <div
                className="relative mx-auto overflow-hidden rounded-xl cursor-pointer"
                style={{ width: boardSize, height: Math.min(450, towerHeight + 120), background: '#0b1628', touchAction: 'none' }}
                onClick={() => placeBlock()}
                onTouchStart={(e) => { e.preventDefault(); placeBlock() }}
              >
                {/* Ground line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10" />

                {/* Placed blocks */}
                {blocks.map((b, i) => (
                  <div key={i} className="absolute rounded-sm transition-all duration-75" style={{
                    left: b.x,
                    bottom: i * BLOCK_HEIGHT + 2,
                    width: b.width,
                    height: BLOCK_HEIGHT - 2,
                    background: b.color,
                    boxShadow: `0 0 8px ${b.color}40`,
                  }} />
                ))}

                {/* Moving block */}
                {movingBlock && !gameOver && (
                  <div className="absolute rounded-sm" style={{
                    left: movingBlock.x,
                    bottom: blocks.length * BLOCK_HEIGHT + 2,
                    width: movingBlock.width,
                    height: BLOCK_HEIGHT - 2,
                    background: movingBlock.color,
                    boxShadow: `0 0 12px ${movingBlock.color}60`,
                    opacity: 0.9,
                  }} />
                )}

                {/* Height marker */}
                <div className="absolute right-2 top-2 text-xs text-slate-500">
                  Height: {blocks.length}
                </div>

                {gameOver && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <div className="text-4xl mb-2">🏗️</div>
                    <h2 className="text-xl font-bold text-white mb-2">Tower Crumbled!</h2>
                    <p className="text-sm text-slate-400 mb-1">Score: {score} | Blocks: {blocks.length}</p>
                    {score >= best && score > 0 && <p className="text-sm text-yellow-400 mb-2">🏆 New Best Score!</p>}
                    <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 transition-all">Play Again</button>
                  </div>
                )}
              </div>
            </div>

            {gameMessage && <div className="text-center glass p-2 rounded-xl text-sm text-white">{gameMessage}</div>}
          </>
        )}
        <p className="text-center text-xs text-slate-400">Tip: Press Space or Tap to place blocks. Speed increases as you stack!</p>
      </div>
    </GameShell>
  )
}
