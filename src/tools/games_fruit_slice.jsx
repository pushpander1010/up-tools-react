import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const LS_KEY = 'ut_fruit_slice_best_v1'
const GAME_DURATION = 60
const FRUIT_SPAWN_INTERVAL = 800
const SLASH_TRAIL_LIFETIME = 150

const FRUIT_COLORS = ['#f43f5e', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']
const FRUIT_NAMES = ['🍎', '🍊', '🍋', '🍇', '🫐', '🍑', '🍓', '🍉', '🥝', '🍒']

let audioCtx = null
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}
function playTone(freq, dur, type = 'sine', vol = 0.08) {
  try {
    const ctx = ensureAudio()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type; o.frequency.value = freq
    g.gain.setValueAtTime(vol, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur)
  } catch {}
}
function playSlice() { playTone(800 + Math.random() * 400, 0.08, 'sine', 0.06) }
function playBomb() { playTone(100, 0.4, 'sawtooth', 0.12); setTimeout(() => playTone(60, 0.5, 'sawtooth', 0.08), 100) }
function playGameOver() { playTone(300, 0.3, 'sawtooth', 0.06); setTimeout(() => playTone(200, 0.4, 'sawtooth', 0.05), 200) }

class Fruit {
  constructor(canvasW, canvasH) {
    this.x = Math.random() * (canvasW - 80) + 40
    this.y = canvasH + 20
    this.vx = (Math.random() - 0.5) * 4
    this.vy = -(6 + Math.random() * 5)
    this.r = 18 + Math.random() * 10
    this.gravity = 0.18
    this.color = FRUIT_COLORS[Math.floor(Math.random() * FRUIT_COLORS.length)]
    this.emoji = FRUIT_NAMES[Math.floor(Math.random() * FRUIT_NAMES.length)]
    this.alive = true
    this.sliced = false
    this.isBomb = false
    this.rotation = 0
    this.rotSpeed = (Math.random() - 0.5) * 0.15
    this.killY = canvasH + 40
  }
  update(dt) {
    this.x += this.vx * dt
    this.vy += this.gravity * dt
    this.y += this.vy * dt
    this.rotation += this.rotSpeed * dt
    if (this.y > this.killY) this.alive = false
  }
  draw(ctx) {
    if (!this.alive) return
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    if (this.isBomb) {
      ctx.fillStyle = '#1f2937'
      ctx.beginPath(); ctx.arc(0, 0, this.r, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 3
      ctx.beginPath(); ctx.arc(0, 0, this.r + 2, 0, Math.PI * 2); ctx.stroke()
      ctx.fillStyle = '#ef4444'
      ctx.font = `${this.r}px sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('💣', 0, 0)
    } else {
      ctx.fillStyle = this.color
      ctx.beginPath(); ctx.arc(0, 0, this.r, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.lineWidth = 2
      ctx.beginPath(); ctx.arc(-this.r * 0.3, -this.r * 0.3, this.r * 0.25, 0, Math.PI * 2); ctx.stroke()
      ctx.fillStyle = '#fff'
      ctx.font = `${this.r * 0.7}px sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(this.emoji, 0, 0)
    }
    ctx.restore()
  }
  contains(px, py) {
    const dx = px - this.x
    const dy = py - this.y
    return Math.sqrt(dx * dx + dy * dy) < this.r + 5
  }
}

function spawnFruit(canvasW, canvasH) {
  const f = new Fruit(canvasW, canvasH)
  if (Math.random() < 0.12) f.isBomb = true
  return f
}

export default function games_fruit_slice() {
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem(LS_KEY) || 0) } catch { return 0 }
  })
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [gameOver, setGameOver] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ w: 400, h: 500 })
  const canvasRef = useRef(null)
  const fruitsRef = useRef([])
  const slashTrail = useRef([])
  const scoreRef = useRef(0)
  const isDragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })
  const animRef = useRef(null)
  const spawnRef = useRef(null)
  const timerRef = useRef(null)
  const gameOverRef = useRef(false)
  const lastFrameRef = useRef(0)
  const cssSizeRef = useRef({ w: 400, h: 500 })

  const syncBest = useCallback((s) => {
    setBest(prev => {
      const b = Math.max(prev, s)
      try { localStorage.setItem(LS_KEY, String(b)) } catch {}
      return b
    })
  }, [])

  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return
    const maxW = parent.clientWidth
    const vpW = window.innerWidth
    const w = Math.min(400, maxW - 16, vpW - 32)
    const h = Math.min(500, Math.floor(w * 1.25))
    canvas.width = Math.max(280, w) * 2
    canvas.height = Math.max(350, h) * 2
    canvas.style.width = Math.max(280, w) + 'px'
    canvas.style.height = Math.max(350, h) + 'px'
    const cw = Math.max(280, w), ch = Math.max(350, h)
    cssSizeRef.current = { w: cw, h: ch }
    setCanvasSize({ w: cw, h: ch })
  }, [])

  const startGame = useCallback(() => {
    fitCanvas()
    fruitsRef.current = []
    slashTrail.current = []
    scoreRef.current = 0
    gameOverRef.current = false
    lastFrameRef.current = 0
    setScore(0); setTimeLeft(GAME_DURATION); setGameOver(false); setPlaying(true)

    // Start spawning
    if (spawnRef.current) clearInterval(spawnRef.current)
    spawnRef.current = setInterval(() => {
      if (gameOverRef.current) return
      const sw = cssSizeRef.current.w || 400
      const sh = cssSizeRef.current.h || 500
      fruitsRef.current.push(spawnFruit(sw, sh))
      if (Math.random() < 0.3) fruitsRef.current.push(spawnFruit(sw, sh))
    }, FRUIT_SPAWN_INTERVAL)

    // Start timer
    if (timerRef.current) clearInterval(timerRef.current)
    let time = GAME_DURATION
    timerRef.current = setInterval(() => {
      time--
      setTimeLeft(time)
      if (time <= 0) {
        clearInterval(timerRef.current)
        clearInterval(spawnRef.current)
        gameOverRef.current = true
        setGameOver(true)
        syncBest(scoreRef.current)
        playGameOver()
      }
    }, 1000)

    // Start animation
    const drawFrame = (ts) => {
      if (gameOverRef.current) return
      if (!lastFrameRef.current) lastFrameRef.current = ts
      const dt = Math.min((ts - lastFrameRef.current) / 16.67, 3)
      lastFrameRef.current = ts

      const canvas = canvasRef.current
      if (!canvas) { animRef.current = requestAnimationFrame(drawFrame); return }
      const ctx = canvas.getContext('2d')
      ctx.setTransform(2, 0, 0, 2, 0, 0)
      const w = cssSizeRef.current.w || 400
      const h = cssSizeRef.current.h || 500

      // Background
      ctx.fillStyle = '#0a0a1a'
      ctx.fillRect(0, 0, w, h)

      // Subtle gradient
      const grd = ctx.createLinearGradient(0, 0, 0, h)
      grd.addColorStop(0, 'rgba(30,20,60,0.3)')
      grd.addColorStop(1, 'rgba(10,10,30,0.3)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, w, h)

      // Draw and update fruits
      fruitsRef.current.forEach(f => { f.update(dt); f.draw(ctx) })
      fruitsRef.current = fruitsRef.current.filter(f => f.alive)

      // Draw slash trail
      const now = Date.now()
      slashTrail.current = slashTrail.current.filter(p => now - p.t < SLASH_TRAIL_LIFETIME)
      if (slashTrail.current.length > 1) {
        ctx.strokeStyle = 'rgba(255,255,255,0.8)'
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.moveTo(slashTrail.current[0].x, slashTrail.current[0].y)
        for (let i = 1; i < slashTrail.current.length; i++) {
          ctx.lineTo(slashTrail.current[i].x, slashTrail.current[i].y)
        }
        ctx.stroke()
      }

      animRef.current = requestAnimationFrame(drawFrame)
    }
    animRef.current = requestAnimationFrame(drawFrame)
  }, [fitCanvas, syncBest, canvasSize])

  const handleSlice = useCallback((px, py) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = (px - rect.left) * (canvas.width / rect.width)
    const y = (py - rect.top) * (canvas.height / rect.height)
    if (isDragging.current) {
      slashTrail.current.push({ x, y, t: Date.now() })
    }
    fruitsRef.current.forEach(fruit => {
      if (!fruit.alive || fruit.sliced) return
      if (fruit.contains(x, y)) {
        fruit.alive = false
        fruit.sliced = true
        if (fruit.isBomb) {
          playBomb()
          scoreRef.current = Math.max(0, scoreRef.current - 3)
          setScore(scoreRef.current)
          // Show bomb particles
          for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8
            const speed = 3 + Math.random() * 3
            fruitsRef.current.push({
              x: fruit.x, y: fruit.y,
              vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
              r: 4, gravity: 0.1, color: '#ef4444', alive: true, killY: fruit.killY,
              update(dt) { this.x += this.vx * dt; this.vy += this.gravity * dt; this.y += this.vy * dt; if (this.y > this.killY) this.alive = false },
              draw(ctx) { ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill() },
              contains() { return false }, isBomb: false, sliced: false, rotation: 0, rotSpeed: 0
            })
          }
        } else {
          playSlice()
          scoreRef.current += 1
          setScore(scoreRef.current)
          // Slice particles
          for (let i = 0; i < 6; i++) {
            const angle = Math.random() * Math.PI * 2
            const speed = 2 + Math.random() * 4
            fruitsRef.current.push({
              x: fruit.x, y: fruit.y,
              vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 3,
              r: 3 + Math.random() * 3, gravity: 0.12, color: fruit.color, alive: true, killY: fruit.killY,
              update(dt) { this.x += this.vx * dt; this.vy += this.gravity * dt; this.y += this.vy * dt; if (this.y > this.killY) this.alive = false },
              draw(ctx) { ctx.fillStyle = this.color; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1 },
              contains() { return false }, isBomb: false, sliced: false, rotation: 0, rotSpeed: 0
            })
          }
        }
      }
    })
  }, [])

  const handleMouseDown = useCallback((e) => {
    isDragging.current = true
    lastMouse.current = { x: e.clientX, y: e.clientY }
    handleSlice(e.clientX, e.clientY)
  }, [handleSlice])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return
    handleSlice(e.clientX, e.clientY)
  }, [handleSlice])

  const handleMouseUp = useCallback(() => { isDragging.current = false }, [])

  const handleTouchStart = useCallback((e) => {
    e.preventDefault()
    isDragging.current = true
    const t = e.touches[0]
    lastMouse.current = { x: t.clientX, y: t.clientY }
    handleSlice(t.clientX, t.clientY)
  }, [handleSlice])

  const handleTouchMove = useCallback((e) => {
    e.preventDefault()
    const t = e.touches[0]
    handleSlice(t.clientX, t.clientY)
  }, [handleSlice])

  const handleTouchEnd = useCallback(() => { isDragging.current = false }, [])

  useEffect(() => { fitCanvas() }, [fitCanvas])
  // The canvas only mounts AFTER start (playing=false hides it), so re-fit
  // once it exists — otherwise the canvas keeps the 300x150 default and all
  // spawn/draw coordinates miss the visible area.
  useEffect(() => {
    if (playing && !gameOver) requestAnimationFrame(() => fitCanvas())
  }, [playing, gameOver, fitCanvas])
  useEffect(() => {
    const h = () => fitCanvas()
    window.addEventListener('resize', h)
    window.addEventListener('ut:board-h', h)
    return () => { window.removeEventListener('resize', h); window.removeEventListener('ut:board-h', h) }
  }, [fitCanvas])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!playing) window.dispatchEvent(new Event('ut:game-start')) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [playing])

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      if (spawnRef.current) clearInterval(spawnRef.current)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleStartTap = (e) => {
    if (e.target.tagName === 'BUTTON') return
    if (!playing) window.dispatchEvent(new Event('ut:game-start'))
  }

  return (
    <GameShell
      name="Fruit Slice"
      startAction={startGame} startLabel="🔪 Slice Fruits"
      title="Fruit Slice — Play Free Fruit Ninja Style Game"
      desc="Play Fruit Slice online for free. Slice fruits with your mouse or finger, avoid bombs, and score as high as you can in 60 seconds!"
      icon="🔪" iconBg="rgba(249,115,22,0.08)"
      category="fun" slug="games-fruit-slice"
      faq={[
        { q: "How do I play Fruit Slice?", a: "Click and drag (or touch and swipe) to slice fruits as they fly up. Avoid bombs or lose points!" },
        { q: "What happens if I hit a bomb?", a: "Hitting a bomb costs you 3 points. Try to avoid them while slicing fruits for maximum score." },
        { q: "How long is each game?", a: "Each game lasts 60 seconds. Slice as many fruits as possible before time runs out!" },
        { q: "How do I play Fruit Slice — Play Free Fruit Ninja Style Game online free?", a: "Click Start and follow the on-screen steps. Use mouse, touch, or keyboard controls. No download needed." },
        { q: "Can I play Fruit Slice — Play Free Fruit Ninja Style Game without downloading?", a: "Yes. This Fruit Slice — Play Free Fruit Ninja Style Game runs in your browser with no install. Free on mobile and desktop." },
        { q: "Is this Fruit Slice — Play Free Fruit Ninja Style Game free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        "Fruits fly upward from the bottom of the screen in random arcs.",
        "Click and drag (or touch and swipe) across fruits to slice them.",
        "Each sliced fruit adds 1 point. Avoid black bombs — they cost 3 points!",
        "You have 60 seconds. Slice fast and avoid bombs for the highest score!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Fruit Slice", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/fruit-slice/",
        "genre": "Arcade",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="min-w-0 space-y-5">
        {!playing && (
          <div onClick={handleStartTap} className="cursor-pointer">
            <div className="glass p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-white">{best}</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">Best Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-white">{GAME_DURATION}s</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">Time Limit</div>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-slate-400 mt-3">👆 Tap anywhere to start slicing</p>
          </div>
        )}

        {playing && (
          <>
            <div className="flex gap-3 items-center justify-between">
              <div className="flex gap-3">
                <div className="px-4 py-2 glass text-sm font-bold text-white">Score: {score}</div>
                <div className="px-4 py-2 glass text-sm font-bold text-slate-400">Best: {best}</div>
                <div className={`px-4 py-2 glass text-sm font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>
                  ⏱ {timeLeft}s
                </div>
              </div>
              <button onClick={() => {
                setPlaying(false); gameOverRef.current = true
                if (animRef.current) cancelAnimationFrame(animRef.current)
                if (spawnRef.current) clearInterval(spawnRef.current)
                if (timerRef.current) clearInterval(timerRef.current)
              }} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">
                ⟵ Back
              </button>
            </div>

            <div className="glass p-2 overflow-hidden">
              <canvas ref={canvasRef}
                className="w-full rounded-lg cursor-crosshair"
                style={{ touchAction: 'none', display: 'block', maxWidth: '100%' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </div>

            {gameOver && (
              <div className="glass p-6 text-center">
                <div className="text-4xl mb-2">{score >= 50 ? '🏆' : score >= 30 ? '🎉' : '🍉'}</div>
                <h3 className="text-xl font-bold text-white mb-2">Time's Up!</h3>
                <div className="text-3xl font-extrabold text-white mb-1">{score}</div>
                <div className="text-sm text-slate-400 mb-3">fruits sliced in {GAME_DURATION}s</div>
                {score >= best && score > 0 && <div className="text-sm text-yellow-400 font-bold mb-3">🌟 New Best Score!</div>}
                <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))}
                  className="px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white hover:brightness-110 transition-all">
                  🔪 Play Again
                </button>
              </div>
            )}

            <p className="text-center text-xs text-slate-400">Click & drag to slice · Avoid bombs (💣) · 60 seconds!</p>
          </>
        )}
      </div>
    </GameShell>
  )
}
