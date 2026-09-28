import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const LS = { BEST: 'ut_Highway Car Dodger_best_v1' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); return audioCtx }
function playTone(freq, dur, type = 'sine', vol = 0.08) {
  try { const ctx = ensureAudio(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(vol, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur) } catch {}
}
function playNearMiss() { playTone(880, 0.06, 'sine', 0.04); setTimeout(() => playTone(1100, 0.06, 'sine', 0.04), 40) }
function playCrash() { playTone(180, 0.35, 'sawtooth', 0.07); setTimeout(() => playTone(120, 0.4, 'sawtooth', 0.06), 180) }
function playLaneSwitch() { playTone(440, 0.04, 'triangle', 0.03) }

const LANE_COUNT = 4
const BASE_SPEED = 3.5
const SPEED_INCREASE = 0.0005
const CAR_W = 40
const CAR_H = 65
const NEAR_MISS_PX = 8
const SCORE_PER_FRAME = 0.2
const NEAR_MISS_BONUS = 5

const CAR_COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#10b981', '#ec4899', '#6366f1', '#14b8a6', '#f97316']

export default function games_car_dodger() {
  const [best, setBest] = useState(() => { try { return Number(localStorage.getItem(LS.BEST) || 0) } catch { return 0 } })
  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)

  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const animRef = useRef(null)
  const stateRef = useRef(null)
  const sizeRef = useRef({ w: 400, h: 500 })
  const touchStartX = useRef(0)

  const initGame = useCallback(() => {
    const w = sizeRef.current.w
    const laneW = Math.floor((w - 20) / LANE_COUNT)
    const startY = Math.floor(LANE_COUNT / 2)
    stateRef.current = {
      playerLane: startY,
      playerX: 10 + startY * laneW + (laneW - CAR_W) / 2,
      targetX: 10 + startY * laneW + (laneW - CAR_W) / 2,
      enemies: [],
      speed: BASE_SPEED,
      scoreVal: 0,
      running: true,
      nearMissCooldown: 0,
      dashFrame: 0,
      roadOffset: 0,
      laneW,
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
    const w = Math.min(480, parentW - 16, window.innerWidth - 32)
    const h = Math.min(560, maxH, Math.floor(w * 1.3))
    sizeRef.current = { w: Math.max(280, w), h: Math.max(350, h) }
    const c = canvasRef.current
    if (c) { c.width = sizeRef.current.w; c.height = sizeRef.current.h }
  }, [])

  useEffect(() => { fitCanvas() }, [fitCanvas])
  useEffect(() => { if (playing) fitCanvas() }, [playing, fitCanvas])

  const moveLane = useCallback((dir) => {
    const s = stateRef.current
    if (!s || !s.running) return
    const newLane = s.playerLane + dir
    if (newLane < 0 || newLane >= LANE_COUNT) return
    s.playerLane = newLane
    s.targetX = 10 + newLane * s.laneW + (s.laneW - CAR_W) / 2
    playLaneSwitch()
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
    const h = sizeRef.current.h
    s.speed += SPEED_INCREASE
    s.dashFrame++
    s.roadOffset = (s.roadOffset + s.speed) % 40
    // Smooth player movement
    const dx = s.targetX - s.playerX
    s.playerX += dx * 0.25
    // Spawn enemies
    if (Math.random() < 0.015 + s.speed * 0.002) {
      const lane = Math.floor(Math.random() * LANE_COUNT)
      const color = CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)]
      // Don't spawn on top of player
      const enemyX = 10 + lane * s.laneW + (s.laneW - CAR_W) / 2
      const tooClose = s.enemies.some(e => Math.abs(e.x - enemyX) < CAR_W && e.y < 80)
      if (!tooClose) {
        s.enemies.push({ x: enemyX, y: -CAR_H, lane, color })
      }
    }
    // Move enemies
    s.enemies.forEach(e => { e.y += s.speed })
    // Near-miss detection
    if (s.nearMissCooldown > 0) s.nearMissCooldown--
    const px = s.playerX, py = h - CAR_H - 30
    s.enemies.forEach(e => {
      const gap = Math.abs(px - e.x)
      if (gap < CAR_W + NEAR_MISS_PX && gap > CAR_W - 4 && Math.abs(py - e.y) < CAR_H && e.y < py) {
        if (s.nearMissCooldown <= 0) {
          s.scoreVal += NEAR_MISS_BONUS
          s.nearMissCooldown = 30
          playNearMiss()
        }
      }
    })
    // Collision detection
    for (const e of s.enemies) {
      const gap = Math.abs(px - e.x)
      const overlapY = py < e.y + CAR_H && py + CAR_H > e.y
      if (gap < CAR_W - 6 && overlapY) {
        s.running = false
        playCrash()
        setGameOver(true)
        setFinalScore(Math.floor(s.scoreVal))
        setBest(prev => { const nb = Math.max(prev, Math.floor(s.scoreVal)); try { localStorage.setItem(LS.BEST, String(nb)) } catch {}; return nb })
        return
      }
    }
    s.enemies = s.enemies.filter(e => e.y < h + 50)
    s.scoreVal += SCORE_PER_FRAME
    setScore(Math.floor(s.scoreVal))
  }

  const draw = (s) => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    const w = c.width, h = c.height
    ctx.clearRect(0, 0, w, h)
    // Road background
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, w, h)
    // Road surface
    ctx.fillStyle = '#334155'
    ctx.fillRect(5, 0, w - 10, h)
    // Lane markings
    const dashLen = 30, gap = 20
    ctx.strokeStyle = '#64748b'
    ctx.lineWidth = 2
    for (let i = 1; i < LANE_COUNT; i++) {
      const lx = 10 + i * s.laneW
      ctx.beginPath()
      for (let y = -40 + s.roadOffset; y < h; y += dashLen + gap) {
        ctx.moveTo(lx, y)
        ctx.lineTo(lx, y + dashLen)
      }
      ctx.stroke()
    }
    // Road edges
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(5, 0, 3, h)
    ctx.fillRect(w - 8, 0, 3, h)
    // Road edge stripes
    ctx.fillStyle = '#fbbf24'
    for (let y = -10 + s.roadOffset * 0.5; y < h; y += 20) {
      ctx.fillRect(0, y, 3, 10)
      ctx.fillRect(w - 3, y, 3, 10)
    }
    // Enemies
    s.enemies.forEach(e => {
      drawCar(ctx, e.x, e.y, CAR_W, CAR_H, e.color, false)
    })
    // Player car
    const py = h - CAR_H - 30
    drawCar(ctx, s.playerX, py, CAR_W, CAR_H, '#22d3ee', true)
    // Speed indicator
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.font = '11px monospace'
    ctx.fillText(`SPD ${s.speed.toFixed(1)}x`, w - 80, 20)
  }

  function drawCar(ctx, x, y, w, h, color, isPlayer) {
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)'
    ctx.beginPath()
    ctx.ellipse(x + w / 2, y + h + 2, w / 2 + 2, 4, 0, 0, Math.PI * 2)
    ctx.fill()
    // Body
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(x + 2, y + 10, w - 4, h - 15, 6)
    ctx.fill()
    // Roof
    ctx.fillStyle = isPlayer ? '#06b6d4' : shadeColor(color, -20)
    ctx.beginPath()
    ctx.roundRect(x + 6, y + 18, w - 12, h * 0.35, 4)
    ctx.fill()
    // Windshield
    ctx.fillStyle = 'rgba(148,216,240,0.5)'
    ctx.beginPath()
    ctx.roundRect(x + 8, y + 16, w - 16, 10, 3)
    ctx.fill()
    // Rear window
    ctx.fillStyle = 'rgba(148,216,240,0.3)'
    ctx.beginPath()
    ctx.roundRect(x + 8, y + h - 25, w - 16, 8, 3)
    ctx.fill()
    // Headlights
    ctx.fillStyle = '#fbbf24'
    ctx.fillRect(x + 4, y + 6, 5, 4)
    ctx.fillRect(x + w - 9, y + 6, 5, 4)
    // Taillights
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(x + 4, y + h - 10, 5, 4)
    ctx.fillRect(x + w - 9, y + h - 10, 5, 4)
    // Player glow
    if (isPlayer) {
      ctx.shadowColor = '#22d3ee'
      ctx.shadowBlur = 12
      ctx.strokeStyle = 'rgba(34,211,238,0.3)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(x, y + 4, w, h - 8, 8)
      ctx.stroke()
      ctx.shadowBlur = 0
    }
  }

  function shadeColor(hex, amt) {
    let c = hex.replace('#', '')
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2]
    const num = parseInt(c, 16)
    let r = Math.min(255, Math.max(0, (num >> 16) + amt))
    let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt))
    let b = Math.min(255, Math.max(0, (num & 0x0000FF) + amt))
    return `rgb(${r},${g},${b})`
  }

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') { e.preventDefault(); moveLane(-1) }
    if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); moveLane(1) }
  }, [moveLane])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (!playing || gameOver) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 20) {
      moveLane(dx > 0 ? 1 : -1)
    } else {
      // Tap left/right half of canvas
      const rect = e.currentTarget.getBoundingClientRect()
      const tapX = e.changedTouches[0].clientX - rect.left
      moveLane(tapX < rect.width / 2 ? -1 : 1)
    }
  }

  const handleStartTap = (e) => {
    if (e.target.tagName === 'BUTTON') return
    if (!playing) window.dispatchEvent(new Event('ut:game-start'))
  }

  // Keyboard: Space/Enter to start/restart
  useEffect(() => {
    const handler = (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && (!playing || gameOver)) {
        e.preventDefault()
        window.dispatchEvent(new Event('ut:game-start'))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [playing, gameOver])


  return (
    <GameShell
      name="Highway Car Dodger"
      startAction={startGame} startLabel={playing && !gameOver ? '⟲ Restart' : '▶ Start'}
      headerStats={<><span>Score: {score}</span><span>Best: {best}</span></>}
      title="Highway Car Dodger — Dodge Traffic and Rack Up Near-Misses"
      desc="Dodge speeding traffic on a 4-lane highway. Earn bonus points for near-misses and see how far you can go without crashing."
      icon="🚗" iconBg="rgba(249,115,22,0.08)"
      category="fun" slug="games-car-dodger"
      faq={[
        { q: "How do I play Highway Car Dodger?", a: "Use left/right arrow keys, A/D keys, or swipe to change lanes. Dodge incoming traffic and earn near-miss bonuses by passing close to other cars without crashing." },
        { q: "What is a near-miss bonus?", a: "When you narrowly avoid another car, you earn 5 extra points! The closer you pass without crashing, the higher the reward. Watch for the audio cue!" },
      ]}
      howItWorks={[
        "Your car stays at the bottom — use left/right arrows or swipe to change lanes.",
        "Traffic cars spawn from the top and speed up over time.",
        "Passing close to another car earns a near-miss bonus for extra points.",
        "Avoid collisions to keep your run going and beat your high score!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Highway Car Dodger", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/car-dodger/",
        "genre": "Racing",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="min-w-0 space-y-5">
        {!playing && !gameOver && (
          <div className="glass p-3 relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 py-8 bg-[#050d1a]/92 backdrop-blur-[2px] overflow-y-auto"
              onClick={(e) => { if (e.target.closest('button')) return; window.dispatchEvent(new Event('ut:game-start')) }}>
              <img src="/games/car-dodger/cover.jpg" alt="Car Dodger cover art" loading="eager"
                className="w-full max-w-[420px] aspect-video object-cover rounded-2xl border border-orange-400/30 shadow-[0_0_40px_rgba(249,115,22,0.35)] mb-4" />
              <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-b from-orange-300 via-amber-300 to-yellow-300 bg-clip-text text-transparent">HIGHWAY CAR DODGER</h2>
              <p className="text-xs text-slate-400 mt-1 mb-3">Dodge traffic · Near-miss bonuses · Free</p>
              <div className="flex flex-wrap justify-center gap-1.5 mb-3 text-[11px] font-bold">
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-orange-200">🏎️ 4-lane highway</span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-yellow-200">✨ Near-miss bonus</span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-red-200">📈 Speed increases</span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-green-200">📱 Swipe + keys</span>
              </div>
              {best > 0 && <p className="text-xs text-slate-400 mb-2">🏆 Best: {best}</p>}
              <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-lg shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:scale-105 transition">▶ Start Game</button>
              <p className="text-[11px] text-slate-500 mt-2">Tap anywhere or press Start</p>
            </div>
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
              <canvas ref={canvasRef} className="w-full rounded-lg" style={{ touchAction: 'none', cursor: 'pointer' }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              />
            </div>
            <div className="sticky bottom-2 z-20 flex justify-center gap-4 py-2">
              <button onClick={() => moveLane(-1)} className="px-6 py-3 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/10 text-cyan-100 font-bold text-lg active:scale-95 transition">← Left</button>
              <button onClick={() => moveLane(1)} className="px-6 py-3 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/10 text-cyan-100 font-bold text-lg active:scale-95 transition">Right →</button>
            </div>
            <p className="text-center text-xs text-slate-400">← → Arrow keys or swipe to change lanes</p>
          </>
        )}
        {gameOver && (
          <div className="glass p-6 text-center">
            <div className="text-4xl mb-2">💥</div>
            <h2 className="text-xl font-bold text-white mb-1">Game Over!</h2>
            <p className="text-sm text-slate-400 mb-1">Score: {finalScore}</p>
            <p className="text-xs text-slate-500 mb-4">Best: {best}</p>
            <button onClick={() => { window.dispatchEvent(new Event('ut:game-start')) }} className="px-6 py-3 rounded-xl text-sm font-semibold bg-orange-500 text-white hover:bg-orange-400 transition-all">🔄 Try Again</button>
          </div>
        )}
      </div>
    </GameShell>
  )
}
