import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import useFullscreen from '../hooks/useFullscreen'
import GameAdSlot from '../components/GameAdSlot'
import InterstitialAd from '../components/InterstitialAd'

const LS = { BEST: 'ut_frogger_best_v1', LAST: 'ut_frogger_last_v1' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) {
  try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {}
}
function playHop() { playTone(440,0.08,'sine',0.06); setTimeout(()=>playTone(550,0.06,'sine',0.04),40) }
function playSplash() { playTone(200,0.3,'sawtooth',0.05); setTimeout(()=>playTone(120,0.4,'sawtooth',0.04),100) }
function playSquish() { playTone(150,0.25,'square',0.06); setTimeout(()=>playTone(100,0.3,'square',0.04),80) }
function playWin() { playTone(523,0.15,'sine',0.08); setTimeout(()=>playTone(659,0.15,'sine',0.08),100); setTimeout(()=>playTone(784,0.2,'sine',0.08),200) }

const COLS = 13
const ROWS = 13
const SAFE_LANES = [0, 6] // safe rows (top goal + median)

export default function games_frogger() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(()=>{try{return Number(localStorage.getItem(LS.BEST)||0)}catch{return 0}})
  const [lastScore, setLastScore] = useState(()=>{try{return Number(localStorage.getItem(LS.LAST)||0)}catch{return 0}})
  const [gameOver, setGameOver] = useState(false)
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)

  const { isFs, toggle: toggleFs, onChange: onFsChange } = useFullscreen()
  const [showAd, setShowAd] = useState(false)
  const pendingAction = useRef(null)
  const triggerAd = useCallback((action) => { pendingAction.current = action; setShowAd(true) }, [])
  const onAdDismiss = useCallback(() => { setShowAd(false); if (pendingAction.current) { pendingAction.current(); pendingAction.current = null } }, [])

  const gRef = useRef({
    frog: { x: 6, y: 12 },
    cars: [],
    trucks: [],
    logs: [],
    turtles: [],
    score: 0,
    lives: 3,
    level: 1,
    W: 400, H: 400,
    dpr: 1,
    touchStart: null,
    playing: false,
    gameOver: false,
    lastTick: 0,
    animId: null,
    goalSlots: [false,false,false,false,false],
    invincible: 0,
  })

  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const wrap = canvas.parentElement
    if (!wrap) return
    const sz = Math.min(400, wrap.clientWidth - 16)
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1))
    gRef.current.W = sz; gRef.current.H = sz; gRef.current.dpr = dpr
    canvas.width = Math.floor(sz*dpr); canvas.height = Math.floor(sz*dpr)
    canvas.style.width = sz+'px'; canvas.style.height = sz+'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr,0,0,dpr,0,0)
  }, [])

  const initObstacles = useCallback((level) => {
    const s = gRef.current
    const cellW = s.W / COLS
    const spd = 0.1 + level * 0.03

    // Cars: rows 7-9 (road lanes) - reduced count
    s.cars = [
      { x: 0, y: 7, speed: spd, color: '#ef4444', w: 2 },
      { x: 6, y: 7, speed: spd * 0.8, color: '#ef4444', w: 2 },
      { x: 2, y: 8, speed: -spd * 0.9, color: '#f59e0b', w: 2 },
      { x: 8, y: 8, speed: -spd * 0.7, color: '#f59e0b', w: 2 },
      { x: 1, y: 9, speed: spd * 1.0, color: '#a855f7', w: 3 },
      { x: 8, y: 9, speed: spd * 0.85, color: '#a855f7', w: 3 },
    ]

    // Trucks
    s.trucks = [
      { x: 0, y: 10, speed: spd * 0.6, color: '#3b82f6', w: 3 },
      { x: 7, y: 10, speed: spd * 0.6, color: '#3b82f6', w: 3 },
      { x: 4, y: 11, speed: -spd * 0.7, color: '#14b8a6', w: 3 },
    ]

    // Logs: rows 1-5 (water lanes)
    s.logs = [
      { x: 0, y: 1, speed: spd * 0.5, w: 5 },
      { x: 8, y: 1, speed: spd * 0.5, w: 5 },
      { x: 2, y: 2, speed: -spd * 0.4, w: 4 },
      { x: 9, y: 2, speed: -spd * 0.4, w: 4 },
      { x: 0, y: 3, speed: spd * 0.6, w: 6 },
      { x: 7, y: 3, speed: spd * 0.6, w: 6 },
      { x: 3, y: 4, speed: -spd * 0.5, w: 4 },
      { x: 0, y: 5, speed: spd * 0.45, w: 5 },
      { x: 8, y: 5, speed: spd * 0.45, w: 5 },
    ]

    // Turtles
    s.turtles = [
      { x: 2, y: 4, speed: -spd * 0.5, w: 3, diving: false },
    ]
  }, [])

  const startGame = useCallback(() => {
    const s = gRef.current
    s.frog = { x: 6, y: 12 }
    s.score = 0; s.lives = 5; s.level = 1
    s.goalSlots = [false,false,false,false,false]
    s.invincible = 60
    s.playing = true; s.gameOver = false
    s.lastTick = 0
    initObstacles(1)
    setScore(0); setGameOver(false); setPlaying(true); setLives(3); setLevel(1)
    fitCanvas()
    setTimeout(() => { startLoop() }, 30)
  }, [fitCanvas, initObstacles])

  const startLoop = useCallback(() => {
    const s = gRef.current
    if (s.animId) cancelAnimationFrame(s.animId)

    const loop = (ts) => {
      if (!s.playing) { s.animId = requestAnimationFrame(loop); return }
      const dt = ts - s.lastTick
      if (dt < 16) { draw(); s.animId = requestAnimationFrame(loop); return }
      s.lastTick = ts

      if (!s.gameOver) {
        const cellW = s.W / COLS
        const cellH = s.H / ROWS

        // Move obstacles
        const allObs = [...s.cars, ...s.trucks, ...s.logs, ...s.turtles]
        for (const ob of allObs) {
          ob.x += ob.speed * (dt / 16)
          if (ob.speed > 0 && ob.x * cellW > s.W) ob.x = -ob.w
          if (ob.speed < 0 && (ob.x + ob.w) * cellW < 0) ob.x = COLS
        }

        // Check frog on log/turtle (water rows 1-5)
        const frogRow = Math.round(s.frog.y)
        if (frogRow >= 1 && frogRow <= 5) {
          let onLog = false
          for (const log of s.logs) {
            if (log.y === frogRow && s.frog.x >= log.x - 0.4 && s.frog.x <= log.x + log.w + 0.4) {
              s.frog.x += log.speed * (dt / 16)
              onLog = true
              break
            }
          }
          if (!onLog) {
            for (const tur of s.turtles) {
              if (tur.y === frogRow && s.frog.x >= tur.x - 0.4 && s.frog.x <= tur.x + tur.w + 0.4) {
                s.frog.x += tur.speed * (dt / 16)
                onLog = true
                break
              }
            }
          }
          if (!onLog) {
            die('splash')
            draw(); s.animId = requestAnimationFrame(loop); return
          }
          // Off screen
          if (s.frog.x < -0.5 || s.frog.x > COLS - 0.5) {
            die('splash')
            draw(); s.animId = requestAnimationFrame(loop); return
          }
        }

        // Check car/truck collision (rows 7-11)
        if (frogRow >= 7 && frogRow <= 11 && s.invincible <= 0) {
          for (const car of s.cars) {
            if (car.y === frogRow && s.frog.x >= car.x - 0.3 && s.frog.x <= car.x + car.w + 0.3) {
              die('squish')
              draw(); s.animId = requestAnimationFrame(loop); return
            }
          }
          for (const truck of s.trucks) {
            if (truck.y === frogRow && s.frog.x >= truck.x - 0.3 && s.frog.x <= truck.x + truck.w + 0.3) {
              die('squish')
              draw(); s.animId = requestAnimationFrame(loop); return
            }
          }
        }

        // Goal row (row 0)
        if (frogRow === 0) {
          const slot = Math.floor(s.frog.x)
          if (slot >= 0 && slot < 5) {
            if (s.goalSlots[slot]) {
              die('squish')
            } else {
              s.goalSlots[slot] = true
              s.score += 50
              setScore(s.score)
              playWin()
              // Check if all goals filled
              if (s.goalSlots.every(g => g)) {
                s.level++
                s.score += 200
                setScore(s.score)
                setLevel(s.level)
                s.goalSlots = [false,false,false,false,false]
                initObstacles(s.level)
              }
              // Reset frog
              s.frog = { x: 6, y: 12 }
              s.invincible = 60
            }
          } else {
            die('splash')
          }
        }

        if (s.invincible > 0) s.invincible--
      }

      draw()
      s.animId = requestAnimationFrame(loop)
    }
    s.animId = requestAnimationFrame(loop)
  }, [initObstacles])

  const die = useCallback((type) => {
    const s = gRef.current
    s.lives--
    setLives(s.lives)
    if (type === 'splash') playSplash(); else playSquish()
    if (s.lives <= 0) {
      s.gameOver = true
      s.playing = false
      setGameOver(true)
      const newBest = Math.max(best, s.score)
      setBest(newBest)
      setLastScore(s.score)
      try { localStorage.setItem(LS.BEST, String(newBest)); localStorage.setItem(LS.LAST, String(s.score)) } catch {}
    } else {
      s.frog = { x: 6, y: 12 }
      s.invincible = 60
    }
  }, [best])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = gRef.current
    const ctx = canvas.getContext('2d')
    const W = s.W, H = s.H
    const cellW = W / COLS
    const cellH = H / ROWS

    // Background: gradient from green (bottom) to blue (top water)
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, '#1a4a1a')    // goal grass
    grad.addColorStop(0.08, '#1e3a5f')  // water
    grad.addColorStop(0.46, '#1e3a5f')
    grad.addColorStop(0.48, '#333')     // median
    grad.addColorStop(0.54, '#444')     // road
    grad.addColorStop(0.86, '#444')
    grad.addColorStop(0.88, '#2d5a1e')  // start grass
    grad.addColorStop(1, '#2d5a1e')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Road lines
    ctx.strokeStyle = 'rgba(255,255,0,0.15)'
    ctx.lineWidth = 1
    ctx.setLineDash([8, 8])
    for (let row = 7; row <= 11; row++) {
      const y = row * cellH + cellH / 2
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
    }
    ctx.setLineDash([])

    // Water pattern
    ctx.fillStyle = 'rgba(0,150,255,0.06)'
    for (let row = 1; row <= 5; row++) {
      for (let i = 0; i < 8; i++) {
        const wx = (i * cellW * 1.5 + row * 20) % W
        ctx.fillRect(wx, row * cellH, cellW * 0.4, cellH)
      }
    }

    // Draw goal slots (row 0)
    for (let i = 0; i < 5; i++) {
      const gx = (i * 2 + 1) * cellW
      ctx.fillStyle = s.goalSlots[i] ? '#22c55e' : 'rgba(0,0,0,0.3)'
      ctx.fillRect(gx, 0, cellW * 1.5, cellH)
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'
      ctx.strokeRect(gx, 0, cellW * 1.5, cellH)
      if (s.goalSlots[i]) {
        ctx.fillStyle = '#fff'
        ctx.font = `bold ${cellH * 0.6}px system-ui`
        ctx.textAlign = 'center'
        ctx.fillText('🐸', gx + cellW * 0.75, cellH * 0.7)
      }
    }

    // Draw logs
    for (const log of s.logs) {
      const lx = log.x * cellW
      const ly = log.y * cellH + cellH * 0.15
      const lw = log.w * cellW
      const lh = cellH * 0.7
      ctx.fillStyle = '#8B4513'
      ctx.beginPath()
      ctx.roundRect(lx, ly, lw, lh, 4)
      ctx.fill()
      // Wood grain
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'
      ctx.lineWidth = 1
      for (let g = 0; g < log.w; g++) {
        ctx.beginPath()
        ctx.moveTo(lx + g * cellW + cellW * 0.3, ly)
        ctx.lineTo(lx + g * cellW + cellW * 0.3, ly + lh)
        ctx.stroke()
      }
    }

    // Draw turtles
    for (const tur of s.turtles) {
      const tx = tur.x * cellW
      const ty = tur.y * cellH + cellH * 0.15
      const tw = tur.w * cellW
      const th = cellH * 0.7
      ctx.fillStyle = '#2d8a4e'
      ctx.beginPath()
      ctx.roundRect(tx, ty, tw, th, 6)
      ctx.fill()
      // Shell pattern
      ctx.strokeStyle = '#1a5c32'
      ctx.lineWidth = 2
      for (let g = 0; g < tur.w; g++) {
        const cx = tx + g * cellW + cellW / 2
        const cy = ty + th / 2
        ctx.beginPath()
        ctx.arc(cx, cy, cellW * 0.3, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // Draw cars
    for (const car of s.cars) {
      const cx = car.x * cellW
      const cy = car.y * cellH + cellH * 0.1
      const cw = car.w * cellW
      const ch = cellH * 0.8
      ctx.fillStyle = car.color
      ctx.beginPath()
      ctx.roundRect(cx, cy, cw, ch, 4)
      ctx.fill()
      // Windows
      ctx.fillStyle = 'rgba(200,230,255,0.6)'
      ctx.fillRect(cx + cw * 0.15, cy + ch * 0.15, cw * 0.25, ch * 0.4)
      ctx.fillRect(cx + cw * 0.55, cy + ch * 0.15, cw * 0.25, ch * 0.4)
      // Wheels
      ctx.fillStyle = '#222'
      ctx.beginPath()
      ctx.arc(cx + cw * 0.2, cy + ch, 3, 0, Math.PI * 2)
      ctx.arc(cx + cw * 0.8, cy + ch, 3, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw trucks
    for (const tr of s.trucks) {
      const tx = tr.x * cellW
      const ty = tr.y * cellH + cellH * 0.05
      const tw = tr.w * cellW
      const th = cellH * 0.9
      ctx.fillStyle = tr.color
      ctx.beginPath()
      ctx.roundRect(tx, ty, tw, th, 4)
      ctx.fill()
      // Cabin
      ctx.fillStyle = 'rgba(0,0,0,0.2)'
      ctx.fillRect(tx, ty, tw * 0.3, th)
      // Cargo
      ctx.fillStyle = 'rgba(255,255,255,0.1)'
      ctx.fillRect(tx + tw * 0.35, ty + th * 0.1, tw * 0.6, th * 0.8)
    }

    // Draw frog
    const fx = s.frog.x * cellW
    const fy = s.frog.y * cellH
    const fw = cellW
    const fh = cellH

    // Invincibility blink
    if (s.invincible > 0 && Math.floor(s.invincible / 4) % 2 === 0) {
      ctx.globalAlpha = 0.4
    }

    // Frog body
    ctx.fillStyle = '#22c55e'
    ctx.beginPath()
    ctx.roundRect(fx + fw * 0.1, fy + fh * 0.15, fw * 0.8, fh * 0.7, 8)
    ctx.fill()

    // Eyes
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(fx + fw * 0.3, fy + fh * 0.35, fw * 0.12, 0, Math.PI * 2)
    ctx.arc(fx + fw * 0.7, fy + fh * 0.35, fw * 0.12, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(fx + fw * 0.3, fy + fh * 0.35, fw * 0.06, 0, Math.PI * 2)
    ctx.arc(fx + fw * 0.7, fy + fh * 0.35, fw * 0.06, 0, Math.PI * 2)
    ctx.fill()

    // Legs
    ctx.fillStyle = '#16a34a'
    ctx.beginPath()
    ctx.ellipse(fx + fw * 0.1, fy + fh * 0.5, fw * 0.1, fh * 0.2, -0.3, 0, Math.PI * 2)
    ctx.ellipse(fx + fw * 0.9, fy + fh * 0.5, fw * 0.1, fh * 0.2, 0.3, 0, Math.PI * 2)
    ctx.fill()

    ctx.globalAlpha = 1.0

    // Lives display
    ctx.fillStyle = '#fff'
    ctx.font = `bold ${cellH * 0.5}px system-ui`
    ctx.textAlign = 'left'
    for (let i = 0; i < s.lives; i++) {
      ctx.fillText('❤️', 4 + i * cellH * 0.6, cellH * 0.8)
    }

    // Level display
    ctx.textAlign = 'right'
    ctx.fillStyle = '#94a3b8'
    ctx.font = `bold ${cellH * 0.4}px system-ui`
    ctx.fillText(`Lvl ${s.level}`, W - 4, cellH * 0.6)

    // Score
    ctx.textAlign = 'center'
    ctx.fillStyle = '#fbbf24'
    ctx.font = `bold ${cellH * 0.4}px system-ui`
    ctx.fillText(`${s.score}`, W / 2, cellH * 0.6)

    // Game over overlay
    if (s.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.8)'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 28px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('Game Over!', W/2, H/2 - 30)
      ctx.font = '16px system-ui'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText(`Score: ${s.score}  |  Best: ${Math.max(best, s.score)}`, W/2, H/2)
      ctx.font = '14px system-ui'
      ctx.fillStyle = '#64748b'
      ctx.fillText('Tap to restart', W/2, H/2 + 30)
    }
  }, [best])

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      const s = gRef.current
      if (s.gameOver) {
        if (e.key === ' ' || e.key === 'Enter') startGame()
        return
      }
      if (!s.playing) return
      const cellW = s.W / COLS
      const cellH = s.H / ROWS
      let moved = false
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { if (s.frog.y > 0) { s.frog.y--; moved = true } }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { if (s.frog.y < ROWS - 1) { s.frog.y++; moved = true } }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { if (s.frog.x > 0) { s.frog.x--; moved = true } }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { if (s.frog.x < COLS - 1) { s.frog.x++; moved = true } }
      if (moved) {
        e.preventDefault()
        playHop()
        // Score for moving forward
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          s.score += 1
          setScore(s.score)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [startGame])

  // Touch / pointer
  const handlePointerDown = (e) => {
    gRef.current.touchStart = { x: e.clientX, y: e.clientY }
  }
  const handlePointerUp = (e) => {
    const s = gRef.current
    if (s.gameOver) { startGame(); return }
    if (!s.touchStart) return
    const dx = e.clientX - s.touchStart.x
    const dy = e.clientY - s.touchStart.y
    s.touchStart = null
    if (Math.abs(dx) < 15 && Math.abs(dy) < 15) return
    let moved = false
    const cellW = s.W / COLS
    const cellH = s.H / ROWS
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && s.frog.x < COLS - 1) { s.frog.x++; moved = true }
      else if (dx < 0 && s.frog.x > 0) { s.frog.x--; moved = true }
    } else {
      if (dy < 0 && s.frog.y > 0) { s.frog.y--; moved = true }
      else if (dy > 0 && s.frog.y < ROWS - 1) { s.frog.y++; moved = true }
    }
    if (moved) { playHop(); if (dy < 0) { s.score += 1; setScore(s.score) } }
  }

  // Resize
  useEffect(() => { fitCanvas(); draw() }, [fitCanvas, draw])
  useEffect(() => {
    const h = () => { fitCanvas(); draw() }
    window.addEventListener('resize', h)
    return () => { window.removeEventListener('resize', h); if (gRef.current.animId) cancelAnimationFrame(gRef.current.animId) }
  }, [fitCanvas, draw])

  useEffect(() => {
    const handler = () => onFsChange()
    document.addEventListener('fullscreenchange', handler)
    document.addEventListener('webkitfullscreenchange', handler)
    return () => { document.removeEventListener('fullscreenchange', handler); document.removeEventListener('webkitfullscreenchange', handler) }
  }, [onFsChange])

  return (
    <ToolLayout hideHeader={isFs}
      title="Frogger Game Online - Classic Arcade"
      desc="Play the classic Frogger game online. Guide your frog across roads and rivers to reach safety. Dodge cars, ride logs. Keyboard and touch controls!"
      icon="🐸" iconBg="rgba(34,197,94,0.08)"
      category="fun" slug="games-frogger"
      faq={[
        { q: "How do I play Frogger?", a: "Use arrow keys or WASD to move the frog. On mobile, swipe in the direction you want to go. Cross the road and river to reach the goal." },
        { q: "What happens when I hit a car?", a: "You lose a life. You have 3 lives total. When all lives are gone, the game is over." },
        { q: "How do I get high scores?", a: "Score points by moving forward, reaching goals (50 pts each), and completing levels (200 bonus). Fill all 5 goal slots to advance!" },
      ]}
      howItWorks={[
        "Press Start or tap the canvas to begin.",
        "Use arrow keys (or WASD) on desktop, swipe on mobile to move.",
        "Dodge cars and trucks on the road. Ride logs and turtles across water.",
        "Fill all 5 goal slots at the top to advance to the next level!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Frogger Game", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/frogger/",
        "genre": "Arcade",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <InterstitialAd show={showAd} onDismiss={onAdDismiss} countdown={3} />
      <div className="flex gap-4 max-w-6xl mx-auto overflow-hidden">
        <div className="hidden lg:block w-[160px] shrink-0 sticky top-24 self-start">
          <GameAdSlot slot="3494503358" format="vertical" className="mt-2" width={160} height={600} />
        </div>
        <div className="flex-1 min-w-0 max-w-xl mx-auto space-y-5 overflow-hidden">
        {/* Stats */}
        <div className="glass p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white">{score}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-green-400">{best}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Best</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-red-400">{lives}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Lives</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-yellow-400">{level}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Level</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <button onClick={() => triggerAd(startGame)} className="glow-btn px-6 py-3 text-sm">
            {playing && !gameOver ? '⟲ Restart' : '▶ Start Game'}
          </button>
        </div>

        {/* Canvas */}
        <div ref={resultRef} className="glass p-3 flex justify-center overflow-hidden">
          <canvas ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            className="rounded-xl cursor-pointer"
            style={{ background: '#1a4a1a', touchAction: 'none' }}
          />
        </div>

        {/* Mobile D-pad hint */}
        <p className="text-center text-xs text-slate-400">
          Desktop: ← → ↑ ↓ or WASD | Mobile: Swipe to move
        </p>
          <div className="flex gap-2 justify-center mt-4">
            <button onClick={toggleFs} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all" title="Fullscreen">
              {isFs ? '⊡' : '⛶'}
            </button>
          </div>
        </div>
        <div className="hidden lg:block w-[160px] shrink-0 sticky top-24 self-start">
          <GameAdSlot slot="3414612309" format="vertical" className="mt-2" width={160} height={600} />
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto px-5 mt-2">
        <GameAdSlot slot="8865234201" format="horizontal" />
      </div>
    </ToolLayout>
  )
}
