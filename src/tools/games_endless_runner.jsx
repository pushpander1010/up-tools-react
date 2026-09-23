import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const LS = { BEST: 'ut_Endless Runner_best_v1' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); return audioCtx }
function playTone(freq, dur, type = 'sine', vol = 0.08) {
  try { const ctx = ensureAudio(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(vol, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur) } catch {}
}
function playJump() { playTone(600, 0.08, 'triangle', 0.06) }
function playDoubleJump() { playTone(800, 0.08, 'triangle', 0.07) }
function playScore() { playTone(523, 0.1, 'sine', 0.05); setTimeout(() => playTone(659, 0.1, 'sine', 0.05), 60) }
function playCrash() { playTone(200, 0.3, 'sawtooth', 0.07); setTimeout(() => playTone(120, 0.4, 'sawtooth', 0.06), 150) }

const GROUND_Y_RATIO = 0.75
const PLAYER_W = 30
const PLAYER_H = 36
const JUMP_VEL = -12
const GRAVITY = 0.55
const OBS_MIN_GAP = 90
const OBS_MAX_GAP = 220
const OBS_W = 22
const OBS_H_MIN = 30
const OBS_H_MAX = 55
const BASE_SPEED = 5
const SPEED_INCREASE = 0.0008
const SCORE_PER_FRAME = 0.15

export default function games_endless_runner() {
  const [best, setBest] = useState(() => { try { return Number(localStorage.getItem(LS.BEST) || 0) } catch { return 0 } })
  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)

  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const animRef = useRef(null)
  const stateRef = useRef(null)
  const sizeRef = useRef({ w: 400, h: 300 })

  const initGame = useCallback(() => {
    const w = sizeRef.current.w
    const h = sizeRef.current.h
    const groundY = Math.floor(h * GROUND_Y_RATIO)
    stateRef.current = {
      playerY: groundY - PLAYER_H,
      playerVY: 0,
      jumpsLeft: 2,
      obstacles: [],
      nextObsDist: 150,
      speed: BASE_SPEED,
      scoreVal: 0,
      groundY,
      running: true,
      dustFrame: 0,
    }
    setScore(0)
    setFinalScore(0)
    setGameOver(false)
  }, [])

  const startGame = useCallback(() => {
    initGame()
    setPlaying(true)
    setGameOver(false)
  }, [initGame])

  useEffect(() => {
    const h = () => fitCanvas()
    window.addEventListener('resize', h)
    window.addEventListener('ut:board-h', h)
    return () => { window.removeEventListener('resize', h); window.removeEventListener('ut:board-h', h) }
  }, [])

  const fitCanvas = useCallback(() => {
    if (!containerRef.current) return
    const parentW = containerRef.current.clientWidth
    const maxH = window.__utBoardH || 9999
    const w = Math.min(520, parentW - 16, window.innerWidth - 32)
    const h = Math.min(320, maxH, Math.floor(w * 0.62))
    sizeRef.current = { w: Math.max(280, w), h: Math.max(200, h) }
    const c = canvasRef.current
    if (c) { c.width = sizeRef.current.w; c.height = sizeRef.current.h }
  }, [])

  useEffect(() => { fitCanvas() }, [fitCanvas])
  useEffect(() => { if (playing) fitCanvas() }, [playing, fitCanvas])

  const jump = useCallback(() => {
    const s = stateRef.current
    if (!s || !s.running) return
    if (s.jumpsLeft > 0) {
      const isDouble = s.jumpsLeft === 1
      s.playerVY = JUMP_VEL
      s.jumpsLeft--
      if (isDouble) playDoubleJump()
      else playJump()
    }
  }, [])

  useEffect(() => {
    if (!playing || gameOver) return
    initGame()
    const loop = () => {
      const s = stateRef.current
      if (!s || !s.running) return
      update(s)
      draw(s)
      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [playing, gameOver, initGame])

  const update = (s) => {
    const w = sizeRef.current.w
    s.speed += SPEED_INCREASE
    s.playerVY += GRAVITY
    s.playerY += s.playerVY
    if (s.playerY >= s.groundY - PLAYER_H) {
      s.playerY = s.groundY - PLAYER_H
      s.playerVY = 0
      s.jumpsLeft = 2
    }
    s.dustFrame++
    s.nextObsDist -= s.speed
    if (s.nextObsDist <= 0) {
      const h = OBS_H_MIN + Math.random() * (OBS_H_MAX - OBS_H_MIN)
      s.obstacles.push({ x: w + 10, h, passed: false })
      s.nextObsDist = OBS_MIN_GAP + Math.random() * (OBS_MAX_GAP - OBS_MIN_GAP)
    }
    s.obstacles.forEach(obs => { obs.x -= s.speed })
    s.obstacles = s.obstacles.filter(obs => obs.x > -OBS_W - 10)
    s.obstacles.forEach(obs => {
      if (!obs.passed && obs.x + OBS_W < 60) {
        obs.passed = true
        s.scoreVal += 10
        playScore()
      }
    })
    const px = 60, py = s.playerY, pw = PLAYER_W, ph = PLAYER_H
    for (const obs of s.obstacles) {
      const ox = obs.x, oy = s.groundY - obs.h, ow = OBS_W, oh = obs.h
      if (px < ox + ow && px + pw > ox && py < oy + oh && py + ph > oy) {
        s.running = false
        playCrash()
        setGameOver(true)
        setFinalScore(Math.floor(s.scoreVal))
        setBest(prev => { const nb = Math.max(prev, Math.floor(s.scoreVal)); try { localStorage.setItem(LS.BEST, String(nb)) } catch {}; return nb })
        return
      }
    }
    s.scoreVal += SCORE_PER_FRAME
    setScore(Math.floor(s.scoreVal))
  }

  const draw = (s) => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    const w = c.width, h = c.height
    ctx.clearRect(0, 0, w, h)
    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, '#0f172a')
    grad.addColorStop(1, '#1e293b')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)
    // Stars
    for (let i = 0; i < 30; i++) {
      const sx = (i * 137.5 + s.dustFrame * 0.1) % w
      const sy = (i * 73.1) % (s.groundY - 20)
      ctx.fillStyle = `rgba(255,255,255,${0.2 + (i % 3) * 0.15})`
      ctx.fillRect(sx, sy, 1.5, 1.5)
    }
    // Ground
    ctx.fillStyle = '#334155'
    ctx.fillRect(0, s.groundY, w, h - s.groundY)
    ctx.fillStyle = '#475569'
    ctx.fillRect(0, s.groundY, w, 3)
    // Ground dashes
    ctx.setLineDash([12, 8])
    ctx.strokeStyle = '#64748b'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, s.groundY + 16)
    ctx.lineTo(w, s.groundY + 16)
    ctx.stroke()
    ctx.setLineDash([])
    // Player
    ctx.fillStyle = '#22d3ee'
    const px = 60, py = s.playerY
    // Body
    ctx.fillRect(px + 6, py + 8, PLAYER_W - 12, PLAYER_H - 12)
    // Head
    ctx.beginPath()
    ctx.arc(px + PLAYER_W / 2, py + 8, 9, 0, Math.PI * 2)
    ctx.fillStyle = '#22d3ee'
    ctx.fill()
    // Eyes
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(px + 15, py + 5, 3, 3)
    ctx.fillRect(px + 21, py + 5, 3, 3)
    // Legs animation
    const legPhase = Math.floor(s.dustFrame / 6) % 2
    ctx.fillStyle = '#06b6d4'
    if (s.playerY >= s.groundY - PLAYER_H - 1) {
      if (legPhase === 0) {
        ctx.fillRect(px + 8, py + PLAYER_H - 4, 6, 4)
        ctx.fillRect(px + 18, py + PLAYER_H - 8, 6, 8)
      } else {
        ctx.fillRect(px + 8, py + PLAYER_H - 8, 6, 8)
        ctx.fillRect(px + 18, py + PLAYER_H - 4, 6, 4)
      }
    } else {
      ctx.fillRect(px + 8, py + PLAYER_H - 6, 6, 6)
      ctx.fillRect(px + 18, py + PLAYER_H - 6, 6, 6)
    }
    // Double-jump indicator
    if (s.jumpsLeft === 2) {
      ctx.fillStyle = 'rgba(34,211,238,0.3)'
      ctx.fillRect(px + 4, py + PLAYER_H + 2, PLAYER_W - 8, 2)
    }
    // Obstacles
    s.obstacles.forEach(obs => {
      const oy = s.groundY - obs.h
      // Spike shape
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.moveTo(obs.x, s.groundY)
      ctx.lineTo(obs.x + OBS_W / 2, oy)
      ctx.lineTo(obs.x + OBS_W, s.groundY)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = '#dc2626'
      ctx.beginPath()
      ctx.moveTo(obs.x + 3, s.groundY)
      ctx.lineTo(obs.x + OBS_W / 2, oy + 6)
      ctx.lineTo(obs.x + OBS_W - 3, s.groundY)
      ctx.closePath()
      ctx.fill()
    })
    // Speed lines
    const speedAlpha = Math.min((s.speed - BASE_SPEED) * 0.15, 0.5)
    if (speedAlpha > 0.05) {
      ctx.strokeStyle = `rgba(255,255,255,${speedAlpha})`
      ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        const lx = (s.dustFrame * s.speed * 0.5 + i * 110) % w
        const ly = 20 + (i * 47) % (s.groundY - 30)
        ctx.beginPath()
        ctx.moveTo(lx, ly)
        ctx.lineTo(lx - 30, ly)
        ctx.stroke()
      }
    }
  }

  const handleKeyDown = useCallback((e) => {
    if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); jump() }
  }, [jump])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleStartTap = (e) => {
    if (e.target.tagName === 'BUTTON') return
    if (!playing) window.dispatchEvent(new Event('ut:game-start'))
  }

  const handleCanvasTap = (e) => {
    e.preventDefault()
    jump()
  }

  const handleGameOverTap = () => {
    window.dispatchEvent(new Event('ut:game-start'))
  }

  return (
    <GameShell
      name="Endless Runner"
      startAction={startGame} startLabel="🎮 Start Running"
      title="Endless Runner — Play Free Jumping Game Online"
      desc="Play Endless Runner online for free. Jump over obstacles, use double-jump to survive, and beat your high score in this fast-paced canvas game."
      icon="🏃" iconBg="rgba(34,211,238,0.08)"
      category="fun" slug="games-endless-runner"
      faq={[
        { q: "How do I play Endless Runner?", a: "Press Space or tap the screen to jump. Press twice for a double-jump. Avoid red spike obstacles that scroll towards you." },
        { q: "What is the double-jump?", a: "You get two jumps before landing. Press Space or tap a second time while in the air to double-jump over taller obstacles." },
        { q: "How do I play Endless Runner — Play Free Jumping Game Online online free?", a: "Click Start and follow the on-screen steps. Use Space, arrow keys, or tap to jump. No download needed." },
        { q: "Can I play Endless Runner — Play Free Jumping Game Online without downloading?", a: "Yes. This Endless Runner — Play Free Jumping Game Online runs in your browser with no install. Free on mobile and desktop." },
        { q: "How do I use this Endless Runner — Play Free Jumping Game Online online free?", a: "Open the game above and press Start. Free with no login, works on mobile and desktop." },
        { q: "Is this Endless Runner — Play Free Jumping Game Online free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        "Your character runs automatically — press Space or tap to jump.",
        "You have a double-jump: press again while airborne for extra height.",
        "Obstacles get faster and more frequent as your score climbs.",
        "Survive as long as possible to beat your best score!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Endless Runner", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/endless-runner/",
        "genre": "Arcade",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="min-w-0 space-y-5">
        {!playing && !gameOver && (
          <div onClick={handleStartTap} className="cursor-pointer">
            <div className="glass p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center"><div className="text-2xl font-extrabold text-white">{best}</div><div className="text-xs text-slate-400 font-medium mt-0.5">Best Score</div></div>
                <div className="text-center"><div className="text-2xl font-extrabold text-cyan-400">🏃</div><div className="text-xs text-slate-400 font-medium mt-0.5">Endless Runner</div></div>
              </div>
            </div>
            <p className="text-center text-xs text-slate-400 mt-4">👆 Tap anywhere or press Start to play</p>
          </div>
        )}
        {playing && (
          <>
            <div className="flex gap-3 items-center justify-between">
              <div className="flex gap-3">
                <div className="px-4 py-2 glass text-sm font-bold text-white">{score}</div>
                <div className="px-4 py-2 glass text-sm font-bold text-slate-400">Best: {best}</div>
              </div>
              <button onClick={() => { window.dispatchEvent(new Event('ut:game-start')) }} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">⟲</button>
            </div>
            <div ref={containerRef} className="glass p-2">
              <canvas ref={canvasRef} className="w-full rounded-lg" style={{ touchAction: 'none', cursor: 'pointer', imageRendering: 'pixelated' }}
                onTouchStart={(e) => { e.preventDefault(); jump() }}
                onClick={handleCanvasTap}
              />
            </div>
            <p className="text-center text-xs text-slate-400">Space / ↑ / Tap to jump • Double-tap for double jump</p>
          </>
        )}
        {gameOver && (
          <div className="glass p-6 text-center" onClick={handleGameOverTap}>
            <div className="text-4xl mb-2">💥</div>
            <h2 className="text-xl font-bold text-white mb-1">Game Over!</h2>
            <p className="text-sm text-slate-400 mb-1">Score: {finalScore}</p>
            <p className="text-xs text-slate-500 mb-4">Best: {best}</p>
            <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new Event('ut:game-start')) }} className="px-6 py-3 rounded-xl text-sm font-semibold bg-cyan-500 text-white hover:bg-cyan-400 transition-all">🔄 Try Again</button>
          </div>
        )}
      </div>
    </GameShell>
  )
}
