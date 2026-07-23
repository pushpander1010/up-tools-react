import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

let audioCtx = null
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function playTone(freq, dur, type = 'square', vol = 0.12) {
  try {
    const ctx = ensureAudio()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + dur + 0.05)
  } catch {}
}

const W = 600, H = 360
const PADDLE_W = 12, PADDLE_H = 70, BALL_SIZE = 10
const WIN_SCORE = 7
const AI_SPEED = { easy: 2.5, medium: 4, hard: 6 }

export default function games_ping_pong() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const [gameMode, setGameMode] = useState('ai')
  const [difficulty, setDifficulty] = useState('medium')
  const [gameRunning, setGameRunning] = useState(false)
  const [gamePaused, setGamePaused] = useState(false)
  const gameRef = useRef({
    player: { y: H / 2 - PADDLE_H / 2, score: 0 },
    ai: { y: H / 2 - PADDLE_H / 2, score: 0 },
    ball: { x: W / 2, y: H / 2, vx: 4, vy: 3 },
    keys: {}
  })
  const animRef = useRef(null)
  const modeRef = useRef(gameMode)
  const diffRef = useRef(difficulty)
  const runningRef = useRef(false)
  const pausedRef = useRef(false)

  useEffect(() => { modeRef.current = gameMode }, [gameMode])
  useEffect(() => { diffRef.current = difficulty }, [difficulty])
  useEffect(() => { runningRef.current = gameRunning }, [gameRunning])
  useEffect(() => { pausedRef.current = gamePaused }, [gamePaused])

  const resetBall = useCallback((dir = 1) => {
    const b = gameRef.current.ball
    b.x = W / 2; b.y = H / 2
    b.vx = (4 + Math.random() * 2) * dir
    b.vy = (Math.random() * 4 - 2)
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const s = gameRef.current

    ctx.fillStyle = '#050d1a'
    ctx.fillRect(0, 0, W, H)

    // Center line
    ctx.setLineDash([10, 10])
    ctx.strokeStyle = '#1a2436'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H)
    ctx.stroke()
    ctx.setLineDash([])

    // Scores
    ctx.fillStyle = '#e6edf3'
    ctx.font = 'bold 36px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText(s.player.score, W / 4, 50)
    ctx.fillText(s.ai.score, (W * 3) / 4, 50)

    ctx.font = '12px system-ui'
    ctx.fillStyle = '#4a5568'
    ctx.fillText(modeRef.current === 'ai' ? 'YOU' : 'PLAYER 1', W / 4, 70)
    ctx.fillText(modeRef.current === 'ai' ? 'AI' : 'PLAYER 2', (W * 3) / 4, 70)

    // Paddles
    ctx.fillStyle = '#00e5ff'
    ctx.beginPath(); ctx.roundRect(10, s.player.y, PADDLE_W, PADDLE_H, 4); ctx.fill()
    ctx.fillStyle = '#ff6b6b'
    ctx.beginPath(); ctx.roundRect(W - PADDLE_W - 10, s.ai.y, PADDLE_W, PADDLE_H, 4); ctx.fill()

    // Ball
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 10
    ctx.fillRect(s.ball.x, s.ball.y, BALL_SIZE, BALL_SIZE)
    ctx.shadowBlur = 0

    if (!runningRef.current) {
      ctx.fillStyle = 'rgba(5,13,26,.7)'; ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#e6edf3'; ctx.font = 'bold 24px system-ui'; ctx.textAlign = 'center'
      ctx.fillText('Press Start to play', W / 2, H / 2)
    }
    if (pausedRef.current) {
      ctx.fillStyle = 'rgba(5,13,26,.6)'; ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#e6edf3'; ctx.font = 'bold 28px system-ui'; ctx.textAlign = 'center'
      ctx.fillText('PAUSED', W / 2, H / 2)
    }
  }, [])

  const endGame = useCallback((winner) => {
    setGameRunning(false)
    const s = gameRef.current
    draw()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'rgba(5,13,26,.75)'; ctx.fillRect(0, 0, W, H)

    const mode = modeRef.current
    let text = '', color = '#ff6b6b'
    if (mode === 'ai') {
      const playerWon = winner === 'Player 1'
      text = playerWon ? '🎉 You Win!' : '💀 AI Wins!'
      color = playerWon ? '#00e5a0' : '#ff6b6b'
      if (playerWon) { playTone(523, 0.15); setTimeout(() => playTone(659, 0.15), 120); setTimeout(() => playTone(784, 0.15), 240); setTimeout(() => playTone(1047, 0.25), 360) }
      else { playTone(400, 0.2, 'sawtooth', 0.1); setTimeout(() => playTone(300, 0.2, 'sawtooth', 0.1), 150); setTimeout(() => playTone(200, 0.3, 'sawtooth', 0.1), 300) }
    } else {
      text = winner === 'Player 1' ? '🎉 Player 1 Wins!' : '🎉 Player 2 Wins!'
      color = winner === 'Player 1' ? '#00e5ff' : '#ff6b6b'
    }

    ctx.fillStyle = color; ctx.font = 'bold 36px system-ui'; ctx.textAlign = 'center'
    ctx.fillText(text, W / 2, H / 2 - 20)
    ctx.fillStyle = '#9aa4b2'; ctx.font = '18px system-ui'
    ctx.fillText(`${s.player.score} - ${s.ai.score}`, W / 2, H / 2 + 20)
  }, [draw])

  const update = useCallback(() => {
    if (!runningRef.current || pausedRef.current) return
    const s = gameRef.current
    const b = s.ball, p = s.player, ai = s.ai
    const speed = 6

    if (modeRef.current === 'ai') {
      if ((s.keys['w'] || s.keys['arrowup']) && p.y > 0) p.y -= speed
      if ((s.keys['s'] || s.keys['arrowdown']) && p.y < H - PADDLE_H) p.y += speed
    } else {
      if (s.keys['w'] && p.y > 0) p.y -= speed
      if (s.keys['s'] && p.y < H - PADDLE_H) p.y += speed
      if (s.keys['arrowup'] && ai.y > 0) ai.y -= speed
      if (s.keys['arrowdown'] && ai.y < H - PADDLE_H) ai.y += speed
    }

    if (modeRef.current === 'ai') {
      const aiSpd = AI_SPEED[diffRef.current] || 4
      const aiCenter = ai.y + PADDLE_H / 2
      if (aiCenter < b.y - 5) ai.y = Math.min(ai.y + aiSpd, H - PADDLE_H)
      else if (aiCenter > b.y + 5) ai.y = Math.max(ai.y - aiSpd, 0)
    }

    b.x += b.vx; b.y += b.vy

    if (b.y <= 0 || b.y >= H - BALL_SIZE) {
      b.vy *= -1
      playTone(300, 0.06, 'triangle', 0.08)
    }

    // Player paddle collision
    if (b.x <= PADDLE_W + 20 && b.y + BALL_SIZE >= p.y && b.y <= p.y + PADDLE_H && b.vx < 0) {
      b.vx = Math.abs(b.vx) * 1.05
      b.vy += (b.y - (p.y + PADDLE_H / 2)) * 0.1
      b.x = PADDLE_W + 21
      playTone(440, 0.08)
    }

    // AI paddle collision
    if (b.x >= W - PADDLE_W - 20 - BALL_SIZE && b.y + BALL_SIZE >= ai.y && b.y <= ai.y + PADDLE_H && b.vx > 0) {
      b.vx = -Math.abs(b.vx) * 1.05
      b.vy += (b.y - (ai.y + PADDLE_H / 2)) * 0.1
      b.x = W - PADDLE_W - 21 - BALL_SIZE
      playTone(440, 0.08)
    }

    b.vx = Math.max(-12, Math.min(12, b.vx))
    b.vy = Math.max(-8, Math.min(8, b.vy))

    if (b.x < 0) {
      ai.score++
      playTone(660, 0.15); setTimeout(() => playTone(880, 0.15), 100)
      if (ai.score >= WIN_SCORE) { endGame(modeRef.current === 'ai' ? 'Player 2' : 'Player 2'); return }
      resetBall(1)
    }
    if (b.x > W) {
      p.score++
      playTone(660, 0.15); setTimeout(() => playTone(880, 0.15), 100)
      if (p.score >= WIN_SCORE) { endGame('Player 1'); return }
      resetBall(-1)
    }

    draw()
    animRef.current = requestAnimationFrame(update)
  }, [draw, endGame, resetBall])

  const startGame = useCallback(() => {
    const s = gameRef.current
    s.player.score = 0; s.ai.score = 0
    s.player.y = H / 2 - PADDLE_H / 2; s.ai.y = H / 2 - PADDLE_H / 2
    resetBall(1)
    setGameRunning(true); setGamePaused(false)
    if (animRef.current) cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(update)
  }, [update, resetBall])

  useEffect(() => {
    const handler = (e) => {
      gameRef.current.keys[e.key.toLowerCase()] = true
      if (e.code === 'Space') {
        e.preventDefault()
        if (runningRef.current) setGamePaused(p => !p)
      }
    }
    const upHandler = (e) => { gameRef.current.keys[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', handler)
    window.addEventListener('keyup', upHandler)
    return () => { window.removeEventListener('keydown', handler); window.removeEventListener('keyup', upHandler) }
  }, [])

  useEffect(() => { draw() }, [draw])
  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  // Pointer tracking for mobile
  const handlePointerDown = useCallback((e) => {
    if (e.pointerType === 'touch' || e.pointerType === 'pen') {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.setPointerCapture(e.pointerId)
      const rect = canvas.getBoundingClientRect()
      const scaleY = H / rect.height
      const canvasY = (e.clientY - rect.top) * scaleY
      gameRef.current.player.y = Math.max(0, Math.min(H - PADDLE_H, canvasY - PADDLE_H / 2))
      ensureAudio()
    }
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (e.pointerType === 'touch' || e.pointerType === 'pen') {
      if (!runningRef.current || pausedRef.current) return
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const scaleY = H / rect.height
      const canvasY = (e.clientY - rect.top) * scaleY
      gameRef.current.player.y = Math.max(0, Math.min(H - PADDLE_H, canvasY - PADDLE_H / 2))
    }
  }, [])

  return (
    <ToolLayout
      title="Ping Pong Game Online - Play Pong Free"
      desc="Classic Pong against AI or a friend. First to 7 wins! Retro arcade game."
      icon="🏓" iconBg="rgba(0,229,255,0.08)"
      category="fun" slug="games-ping-pong"
      faq={[
        { q: "How do I play?", a: "Use W/S or Arrow keys to move your paddle. First to 7 points wins!" },
        { q: "Can I play with a friend?", a: "Yes! Select '2 Players (Local)' mode. Player 1 uses W/S, Player 2 uses Arrow keys." },
      ]}
      howItWorks={[
        "Choose vs AI or 2 Players mode.",
        "Select difficulty (Easy, Medium, Hard) for AI mode.",
        "Press Start and use keyboard/touch to move your paddle.",
        "First to 7 points wins the game!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Ping Pong", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/ping-pong/",
        "genre": ["Arcade", "Puzzle", "Casual"],
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Controls */}
        <div className="flex gap-2 items-center flex-wrap">
          <label className="text-sm font-semibold text-slate-300">Mode:</label>
          <button onClick={() => setGameMode('ai')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${gameMode === 'ai' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08] hover:bg-white/[0.1]'}`}>
            vs AI
          </button>
          <button onClick={() => setGameMode('local')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${gameMode === 'local' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08] hover:bg-white/[0.1]'}`}>
            2 Players
          </button>

          {gameMode === 'ai' && (
            <div className="flex gap-2 items-center ml-2">
              <label className="text-sm text-slate-400">Difficulty:</label>
              {['easy', 'medium', 'hard'].map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${difficulty === d ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08] hover:bg-white/[0.1]'}`}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          )}

          <div className="ml-auto flex gap-2">
            {!gameRunning ? (
              <button onClick={startGame}
                className="glow-btn px-5 py-2 text-sm">
                ▶ Start
              </button>
            ) : (
              <button onClick={() => setGamePaused(p => !p)}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all">
                {gamePaused ? '▶ Resume' : '⏸ Pause'}
              </button>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div ref={resultRef} className="glass p-3 overflow-hidden">
          <canvas ref={canvasRef} width={W} height={H}
            onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
            className="w-full" style={{ aspectRatio: `${W}/${H}`, touchAction: 'none' }}
            aria-label="Ping Pong game" />
        </div>

        {/* Controls hint */}
        <div className="flex gap-2 justify-center flex-wrap text-xs text-slate-500">
          {gameMode === 'ai' ? (
            <>
              <span className="px-3 py-1 bg-white/[0.04] rounded-full">W / ▲ — Move Up</span>
              <span className="px-3 py-1 bg-white/[0.04] rounded-full">S / ▼ — Move Down</span>
              <span className="px-3 py-1 bg-white/[0.04] rounded-full">Space — Pause</span>
            </>
          ) : (
            <>
              <span className="px-3 py-1 bg-white/[0.04] rounded-full">P1: W / S</span>
              <span className="px-3 py-1 bg-white/[0.04] rounded-full">P2: ▲ / ▼</span>
              <span className="px-3 py-1 bg-white/[0.04] rounded-full">Space — Pause</span>
            </>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
