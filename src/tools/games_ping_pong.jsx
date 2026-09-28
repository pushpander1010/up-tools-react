import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

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

const DESIGN_W = 600, DESIGN_H = 360
const PADDLE_W = 12, PADDLE_H = 70, BALL_SIZE = 10
const WIN_SCORE = 7
const AI_SPEED = { easy: 2.5, medium: 4, hard: 6 }

export default function games_ping_pong() {
  const canvasRef = useRef(null)
  const [gameMode, setGameMode] = useState('ai')
  const [difficulty, setDifficulty] = useState('medium')
  const [gameRunning, setGameRunning] = useState(false)
  const [gamePaused, setGamePaused] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [, setTick] = useState(0)
  const gameRef = useRef({
    player: { y: DESIGN_H / 2 - PADDLE_H / 2, score: 0 },
    ai: { y: DESIGN_H / 2 - PADDLE_H / 2, score: 0 },
    ball: { x: DESIGN_W / 2, y: DESIGN_H / 2, vx: 4, vy: 3 },
    keys: {},
    W: DESIGN_W, H: DESIGN_H,
    animId: null,
    shake: 0, particles: [], rings: [], flash: { p: 0, ai: 0 }, rally: 0,
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

  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const wrap = canvas.parentElement
    if (!wrap) return
    const maxW = Math.min(DESIGN_W, wrap.clientWidth - 16)
    const H = Math.floor(maxW * (DESIGN_H / DESIGN_W))
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    gameRef.current.W = maxW; gameRef.current.H = H; gameRef.current.dpr = dpr
    canvas.width = Math.floor(maxW * dpr); canvas.height = Math.floor(H * dpr)
    canvas.style.width = maxW + 'px'; canvas.style.height = H + 'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    // Scale paddle positions proportionally
    const s = gameRef.current
    const scaleY = H / DESIGN_H
    s.player.y = Math.min(s.player.y * scaleY, H - PADDLE_H)
    s.ai.y = Math.min(s.ai.y * scaleY, H - PADDLE_H)
    s.ball.x = Math.min(s.ball.x * (maxW / DESIGN_W), maxW - BALL_SIZE)
    s.ball.y = Math.min(s.ball.y * scaleY, H - BALL_SIZE)
  }, [])

  const resetBall = useCallback((dir = 1) => {
    const b = gameRef.current.ball
    const W = gameRef.current.W, H = gameRef.current.H
    b.x = W / 2; b.y = H / 2
    b.vx = (4 + Math.random() * 2) * dir
    b.vy = (Math.random() * 4 - 2)
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const s = gameRef.current
    const W = s.W, H = s.H

    ctx.save()
    if (s.shake > 0.2) ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake)

    const bgGrad = ctx.createLinearGradient(0, 0, W, H)
    bgGrad.addColorStop(0, '#0a1030'); bgGrad.addColorStop(0.5, '#050d1a'); bgGrad.addColorStop(1, '#0b0618')
    ctx.fillStyle = bgGrad
    ctx.fillRect(-10, -10, W + 20, H + 20)

    // Center line (glow)
    ctx.setLineDash([10, 10])
    ctx.strokeStyle = '#00e5ff55'
    ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 6
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.shadowBlur = 0

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

    // Paddles (flash white on hit)
    ctx.fillStyle = s.flash.p > 0 ? '#ffffff' : '#00e5ff'
    ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = s.flash.p > 0 ? 18 : 10
    ctx.beginPath(); ctx.roundRect(10, s.player.y, PADDLE_W, PADDLE_H, 4); ctx.fill()
    ctx.fillStyle = s.flash.ai > 0 ? '#ffffff' : '#ff6b6b'
    ctx.shadowColor = '#ff6b6b'; ctx.shadowBlur = s.flash.ai > 0 ? 18 : 10
    ctx.beginPath(); ctx.roundRect(W - PADDLE_W - 10, s.ai.y, PADDLE_W, PADDLE_H, 4); ctx.fill()
    ctx.shadowBlur = 0

    // Ball (speed trail)
    const spd = Math.min(1, (Math.abs(s.ball.vx) + Math.abs(s.ball.vy)) / 12)
    const tl = 8 + spd * 26
    const m = Math.hypot(s.ball.vx, s.ball.vy) || 1
    const tx = -s.ball.vx / m, ty = -s.ball.vy / m
    const cx = s.ball.x + BALL_SIZE / 2, cy = s.ball.y + BALL_SIZE / 2
    const trail = ctx.createLinearGradient(cx, cy, cx + tx * tl, cy + ty * tl)
    trail.addColorStop(0, 'rgba(255,255,255,0.85)'); trail.addColorStop(1, 'rgba(0,229,255,0)')
    ctx.strokeStyle = trail; ctx.lineWidth = BALL_SIZE * 0.9; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + tx * tl, cy + ty * tl); ctx.stroke()
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 12
    ctx.beginPath(); ctx.arc(cx, cy, BALL_SIZE / 2 + 1, 0, Math.PI * 2); ctx.fill()
    ctx.shadowBlur = 0

    // impact particles + rings
    for (const pt of s.particles) {
      ctx.globalAlpha = Math.max(0, pt.life * 2.5)
      ctx.fillStyle = pt.col
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2); ctx.fill()
    }
    ctx.globalAlpha = 1
    for (const r of s.rings) {
      ctx.globalAlpha = Math.max(0, r.life * 3)
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke()
    }
    ctx.globalAlpha = 1

    // rally flair
    if (s.rally >= 5) {
      ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 15px system-ui'; ctx.textAlign = 'center'
      ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 10
      ctx.fillText(`🔥 RALLY x${s.rally}`, W / 2, 96)
      ctx.shadowBlur = 0
    }

    ctx.restore()

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
    const W = s.W, H = s.H
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
    const W = s.W, H = s.H

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
      b.vx = Math.abs(b.vx) * 1.02
      b.vy += (b.y - (p.y + PADDLE_H / 2)) * 0.08
      b.x = PADDLE_W + 21
      playTone(440, 0.08)
      s.flash.p = 0.15; s.rally++
      s.rings.push({ x: PADDLE_W + 10, y: b.y, r: 4, life: 0.3 })
      for (let i = 0; i < 6; i++) s.particles.push({ x: PADDLE_W + 10, y: b.y, vx: Math.random() * 160, vy: (Math.random() - 0.5) * 200, life: 0.35, col: '#00e5ff' })
    }

    // AI paddle collision
    if (b.x >= W - PADDLE_W - 20 - BALL_SIZE && b.y + BALL_SIZE >= ai.y && b.y <= ai.y + PADDLE_H && b.vx > 0) {
      b.vx = -Math.abs(b.vx) * 1.02
      b.vy += (b.y - (ai.y + PADDLE_H / 2)) * 0.08
      b.x = W - PADDLE_W - 21 - BALL_SIZE
      playTone(440, 0.08)
      s.flash.ai = 0.15; s.rally++
      s.rings.push({ x: W - PADDLE_W - 10, y: b.y, r: 4, life: 0.3 })
      for (let i = 0; i < 6; i++) s.particles.push({ x: W - PADDLE_W - 10, y: b.y, vx: -Math.random() * 160, vy: (Math.random() - 0.5) * 200, life: 0.35, col: '#ff6b6b' })
    }

    b.vx = Math.max(-8, Math.min(8, b.vx))
    b.vy = Math.max(-6, Math.min(6, b.vy))

    if (b.x < 0) {
      ai.score++
      s.shake = 7; s.rally = 0; setTick(t => t + 1)
      playTone(660, 0.15); setTimeout(() => playTone(880, 0.15), 100)
      if (ai.score >= WIN_SCORE) { endGame(modeRef.current === 'ai' ? 'Player 2' : 'Player 2'); return }
      resetBall(1)
    }
    if (b.x > W) {
      p.score++
      s.shake = 7; s.rally = 0; setTick(t => t + 1)
      playTone(660, 0.15); setTimeout(() => playTone(880, 0.15), 100)
      if (p.score >= WIN_SCORE) { endGame('Player 1'); return }
      resetBall(-1)
    }

    // decay juice
    s.shake = Math.max(0, s.shake - 0.6)
    s.flash.p = Math.max(0, s.flash.p - 0.02)
    s.flash.ai = Math.max(0, s.flash.ai - 0.02)
    for (const pt of s.particles) { pt.x += pt.vx / 60; pt.y += pt.vy / 60; pt.life -= 0.02 }
    s.particles = s.particles.filter(pt => pt.life > 0)
    for (const r of s.rings) { r.r += 4; r.life -= 0.03 }
    s.rings = s.rings.filter(r => r.life > 0)

    draw()
    animRef.current = requestAnimationFrame(update)
  }, [draw, endGame, resetBall])

  const startGame = useCallback(() => {
    const s = gameRef.current
    const W = s.W, H = s.H
    s.player.score = 0; s.ai.score = 0
    s.shake = 0; s.particles = []; s.rings = []; s.flash = { p: 0, ai: 0 }; s.rally = 0
    setShowWelcome(false); setTick(0)
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
        else window.dispatchEvent(new Event('ut:game-start'))
      }
    }
    const upHandler = (e) => { gameRef.current.keys[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', handler)
    window.addEventListener('keyup', upHandler)
    return () => { window.removeEventListener('keydown', handler); window.removeEventListener('keyup', upHandler) }
  }, [])

  // Re-fit when the shell publishes board height (fullscreen) or viewport resizes.
  useEffect(() => {
    const h = () => { fitCanvas(); draw(); };
    window.addEventListener('resize', h);
    window.addEventListener('ut:board-h', h);
    return () => { window.removeEventListener('resize', h); window.removeEventListener('ut:board-h', h) };
  }, [fitCanvas, draw]);


  // Pointer tracking for mobile
  const handlePointerDown = useCallback((e) => {
    if (!runningRef.current) { window.dispatchEvent(new Event('ut:game-start')); return }
    if (e.pointerType === 'touch' || e.pointerType === 'pen') {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.setPointerCapture(e.pointerId)
      const rect = canvas.getBoundingClientRect()
      const scaleY = gameRef.current.H / rect.height
      const canvasY = (e.clientY - rect.top) * scaleY
      gameRef.current.player.y = Math.max(0, Math.min(gameRef.current.H - PADDLE_H, canvasY - PADDLE_H / 2))
      ensureAudio()
    }
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (e.pointerType === 'touch' || e.pointerType === 'pen') {
      if (!runningRef.current || pausedRef.current) return
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const scaleY = gameRef.current.H / rect.height
      const canvasY = (e.clientY - rect.top) * scaleY
      gameRef.current.player.y = Math.max(0, Math.min(gameRef.current.H - PADDLE_H, canvasY - PADDLE_H / 2))
    }
  }, [])

  return (
    <GameShell
      name="PING PONG"
      startAction={startGame} startLabel={gameRunning ? '⟲ Restart' : '▶ Start'}
      headerStats={<><span>You <b className="text-cyan-300">{gameRef.current.player.score}</b></span><span>{gameMode === 'ai' ? 'AI' : 'P2'} <b className="text-red-300">{gameRef.current.ai.score}</b></span><span className="text-slate-400">First to 7</span></>}
      title="Ping Pong Game Online - Play Pong Free"
      desc="Play Ping Pong online free — classic Pong vs smart AI or a friend on one keyboard. First to 7 wins. No download, no sign-up, on mobile and desktop."
      icon="🏓" iconBg="rgba(0,229,255,0.08)"
      category="fun" slug="games-ping-pong"
      faq={[
        { q: "How do I play?", a: "Use W/S or Arrow keys to move your paddle. First to 7 points wins!" },
        { q: "Can I play with a friend?", a: "Yes! Select '2 Players (Local)' mode. Player 1 uses W/S, Player 2 uses Arrow keys." },
        { q: "How do rallies and ball speed work?", a: "Every paddle return speeds the ball up slightly and builds your rally count — long rallies show a 🔥 flair. Angle your returns using the paddle edges." },
        { q: "Is Ping Pong free with no sign-up?", a: "Yes, completely free. No download, no login — just pick a mode and play." },
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
      <div className="flex gap-4 max-w-6xl mx-auto overflow-hidden">
        <div className="flex-1 min-w-0 max-w-2xl mx-auto space-y-5 overflow-hidden">
        {/* Controls */}
        <div className="flex gap-2 items-center flex-wrap">
          <label className="text-sm font-semibold text-slate-300">Mode:</label>
          <button onClick={() => setGameMode('ai')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${gameMode === 'ai' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-400 border border-white/[0.08] hover:bg-white/[0.1]'}`}>
            vs AI
          </button>
          <button onClick={() => setGameMode('local')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${gameMode === 'local' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-400 border border-white/[0.08] hover:bg-white/[0.1]'}`}>
            2 Players
          </button>

          {gameMode === 'ai' && (
            <div className="flex gap-2 items-center ml-2">
              <label className="text-sm text-slate-400">Difficulty:</label>
              {['easy', 'medium', 'hard'].map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${difficulty === d ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-400 border border-white/[0.08] hover:bg-white/[0.1]'}`}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          )}
          <div className="ml-auto flex gap-2">
            {gameRunning && (
              <button onClick={() => setGamePaused(p => !p)}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all">
                {gamePaused ? '▶ Resume' : '⏸ Pause'}
              </button>
            )}
          </div>
        </div>

        {/* Canvas + welcome cover */}
        <div className="glass p-3 overflow-hidden relative">
          <canvas ref={canvasRef}
            onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
            className="w-full rounded-xl" style={{ touchAction: 'none' }}
            aria-label="Ping Pong game" />
          {showWelcome && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 py-4 bg-[#050d1a]/92 backdrop-blur-[2px] overflow-y-auto"
              onPointerDown={(e) => { if (e.target.closest('button')) return; window.dispatchEvent(new Event('ut:game-start')) }}>
              <img src="/games/ping-pong/cover.jpg" alt="Neon table tennis versus cover art" loading="eager"
                className="w-full max-w-[420px] aspect-video object-cover rounded-2xl border border-cyan-400/30 shadow-[0_0_40px_rgba(0,229,255,0.35)] mb-4" />
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter bg-gradient-to-b from-cyan-300 via-sky-300 to-red-300 bg-clip-text text-transparent">PING PONG</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-3">Vs AI or a friend · First to 7 · Free</p>
              <div className="flex flex-wrap justify-center gap-1.5 mb-3 text-[11px] font-bold">
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-indigo-200">🤖 3 AI levels</span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-emerald-200">👥 2-player local</span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-amber-200">🔥 Rally flair</span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-cyan-200">📱 Touch + keys</span>
              </div>
              <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-extrabold text-lg shadow-[0_0_30px_rgba(0,229,255,0.5)] hover:scale-105 transition">▶ Start Game</button>
              <p className="text-[11px] text-slate-500 mt-3">Pick mode + difficulty above, then start</p>
            </div>
          )}
        </div>

        {/* Controls hint */}
        <div className="flex gap-2 justify-center flex-wrap text-xs text-slate-400">
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
      </div>
    </GameShell>
  )
}
