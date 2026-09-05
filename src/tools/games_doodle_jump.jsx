import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const LS = { BEST: 'ut_doodle_best_v1', LAST: 'ut_doodle_last_v1' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) {
  try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {}
}
function playBounce() { playTone(523,0.06,'sine',0.07); setTimeout(()=>playTone(659,0.08,'sine',0.05),30) }
function playBreak() { playTone(200,0.15,'sawtooth',0.06) }
function playFall() { playTone(300,0.2,'sawtooth',0.05); setTimeout(()=>playTone(200,0.3,'sawtooth',0.04),100) }

export default function games_doodle_jump() {
  const canvasRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(()=>{try{return Number(localStorage.getItem(LS.BEST)||0)}catch{return 0}})
  const [lastScore, setLastScore] = useState(()=>{try{return Number(localStorage.getItem(LS.LAST)||0)}catch{return 0}})
  const [gameOver, setGameOver] = useState(false)


  const gRef = useRef({
    doodler: { x: 0, y: 0, w: 40, h: 40, facingRight: true },
    platforms: [],
    velocityX: 0,
    velocityY: 0,
    initialVelocityY: -10,
    gravity: 0.45,
    score: 0,
    maxScore: 0,
    W: 360,
    H: 576,
    dpr: 1,
    touchStart: null,
    playing: false,
    gameOver: false,
    animId: null,
    stars: [],
  })

  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const wrap = canvas.parentElement
    if (!wrap) return
    const maxW = Math.min(360, wrap.clientWidth - 16)
    const maxH = Math.min(576, window.innerHeight * 0.6)
    const ratio = 360 / 576
    let w = maxW
    let h = w / ratio
    if (h > maxH) { h = maxH; w = h * ratio }
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1))
    gRef.current.W = w; gRef.current.H = h; gRef.current.dpr = dpr
    canvas.width = Math.floor(w*dpr); canvas.height = Math.floor(h*dpr)
    canvas.style.width = w+'px'; canvas.style.height = h+'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr,0,0,dpr,0,0)
  }, [])

  const placePlatforms = useCallback(() => {
    const s = gRef.current
    s.platforms = []
    const platformW = s.W * 0.18
    const platformH = 12

    // Starting platform under doodler
    s.platforms.push({
      x: s.W / 2 - platformW / 2,
      y: s.H - 60,
      w: platformW,
      h: platformH,
      type: 'normal',
      broken: false,
    })

    // Generate platforms going up
    let y = s.H - 120
    while (y > -100) {
      const x = Math.random() * (s.W - platformW)
      const r = Math.random()
      let type = 'normal'
      if (r > 0.92) type = 'moving'
      else if (r > 0.85) type = 'fragile'
      s.platforms.push({
        x, y, w: platformW, h: platformH,
        type,
        broken: false,
        moveDir: type === 'moving' ? (Math.random() > 0.5 ? 1 : -1) : 0,
        moveSpeed: 0.5 + Math.random() * 0.8,
      })
      y -= 45 + Math.random() * 30
    }
  }, [])

  const newPlatform = useCallback(() => {
    const s = gRef.current
    const platformW = s.W * 0.18
    const platformH = 12
    const r = Math.random()
    let type = 'normal'
    if (r > 0.92) type = 'moving'
    else if (r > 0.85) type = 'fragile'
    s.platforms.push({
      x: Math.random() * (s.W - platformW),
      y: -platformH,
      w: platformW,
      h: platformH,
      type,
      broken: false,
      moveDir: type === 'moving' ? (Math.random() > 0.5 ? 1 : -1) : 0,
      moveSpeed: 0.5 + Math.random() * 0.8,
    })
  }, [])

  const startGame = useCallback(() => {
    const s = gRef.current
    const platformW = s.W * 0.18
    s.doodler = {
      x: s.W / 2 - 20,
      y: s.H - 100,
      w: 40,
      h: 40,
      facingRight: true,
    }
    s.velocityX = 0
    s.velocityY = s.initialVelocityY
    s.score = 0
    s.maxScore = 0
    s.playing = true
    s.gameOver = false
    s.lastTick = 0

    // Generate stars for background
    s.stars = []
    for (let i = 0; i < 30; i++) {
      s.stars.push({ x: Math.random() * s.W, y: Math.random() * s.H, size: 0.5 + Math.random() * 1.5 })
    }

    placePlatforms()
    setScore(0); setGameOver(false); setPlaying(true)
    fitCanvas()
    setTimeout(() => { startLoop() }, 30)
  }, [fitCanvas, placePlatforms])

  const startLoop = useCallback(() => {
    const s = gRef.current
    if (s.animId) cancelAnimationFrame(s.animId)

    const loop = (ts) => {
      if (!s.playing) { s.animId = requestAnimationFrame(loop); return }
      const dt = Math.min(ts - (s.lastTick || ts), 32) / 16
      s.lastTick = ts

      if (!s.gameOver) {
        // Apply gravity
        s.velocityY += s.gravity * dt
        s.doodler.x += s.velocityX * dt
        s.doodler.y += s.velocityY * dt

        // Wrap horizontally
        if (s.doodler.x > s.W) s.doodler.x = -s.doodler.w
        else if (s.doodler.x + s.doodler.w < 0) s.doodler.x = s.W

        // Move moving platforms
        for (const p of s.platforms) {
          if (p.type === 'moving' && !p.broken) {
            p.x += p.moveDir * p.moveSpeed * dt
            if (p.x <= 0 || p.x + p.w >= s.W) {
              p.moveDir *= -1
            }
            p.x = Math.max(0, Math.min(s.W - p.w, p.x))
          }
        }

        // Scroll platforms when doodler goes up
        if (s.velocityY < 0 && s.doodler.y < s.H * 0.4) {
          const scrollAmount = -s.velocityY * dt
          s.doodler.y += scrollAmount
          for (const p of s.platforms) {
            p.y += scrollAmount
          }
          // Score
          s.maxScore += scrollAmount * 0.1
          if (s.score < Math.floor(s.maxScore)) {
            s.score = Math.floor(s.maxScore)
            setScore(s.score)
          }
        }

        // Collision detection (only when falling)
        if (s.velocityY >= 0) {
          for (const p of s.platforms) {
            if (p.broken) continue
            if (
              s.doodler.x + s.doodler.w > p.x + 5 &&
              s.doodler.x < p.x + p.w - 5 &&
              s.doodler.y + s.doodler.h > p.y &&
              s.doodler.y + s.doodler.h < p.y + 12
            ) {
              if (p.type === 'fragile') {
                p.broken = true
                playBreak()
                continue
              }
              s.velocityY = s.initialVelocityY
              playBounce()
              break
            }
          }
        }

        // Remove off-screen platforms, add new ones
        s.platforms = s.platforms.filter(p => p.y < s.H + 50)
        while (s.platforms.length < 8) {
          newPlatform()
          // Move the new platform to the top
          const last = s.platforms[s.platforms.length - 1]
          const minY = Math.min(...s.platforms.map(p => p.y))
          last.y = minY - 45 - Math.random() * 30
        }

        // Game over: fell below screen
        if (s.doodler.y > s.H) {
          s.gameOver = true
          s.playing = false
          setGameOver(true)
          playFall()
          const newBest = Math.max(best, s.score)
          setBest(newBest)
          setLastScore(s.score)
          try { localStorage.setItem(LS.BEST, String(newBest)); localStorage.setItem(LS.LAST, String(s.score)) } catch {}
        }
      }

      draw()
      s.animId = requestAnimationFrame(loop)
    }
    s.animId = requestAnimationFrame(loop)
  }, [best, newPlatform])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = gRef.current
    const ctx = canvas.getContext('2d')
    const W = s.W, H = s.H

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, '#1a1a2e')
    grad.addColorStop(0.5, '#16213e')
    grad.addColorStop(1, '#0f3460')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Stars
    for (const star of s.stars) {
      ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.4})`
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw platforms
    for (const p of s.platforms) {
      if (p.broken) {
        // Broken platform fragments
        ctx.fillStyle = 'rgba(139,92,246,0.3)'
        ctx.fillRect(p.x - 2, p.y + 2, p.w * 0.3, 4)
        ctx.fillRect(p.x + p.w * 0.7, p.y + 4, p.w * 0.3, 4)
        continue
      }

      let color
      switch (p.type) {
        case 'moving':
          color = '#3b82f6'
          break
        case 'fragile':
          color = '#f59e0b'
          break
        default:
          color = '#22c55e'
      }

      // Platform glow
      ctx.shadowColor = color
      ctx.shadowBlur = 6
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.roundRect(p.x, p.y, p.w, p.h, 6)
      ctx.fill()
      ctx.shadowBlur = 0

      // Platform highlight
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.beginPath()
      ctx.roundRect(p.x + 2, p.y + 1, p.w - 4, p.h * 0.4, 4)
      ctx.fill()
    }

    // Draw doodler
    const d = s.doodler
    ctx.save()
    if (!d.facingRight) {
      ctx.translate(d.x + d.w / 2, 0)
      ctx.scale(-1, 1)
      ctx.translate(-(d.x + d.w / 2), 0)
    }

    // Body
    ctx.fillStyle = '#a855f7'
    ctx.beginPath()
    ctx.roundRect(d.x + 4, d.y + 8, d.w - 8, d.h - 12, 8)
    ctx.fill()

    // Head
    ctx.fillStyle = '#c084fc'
    ctx.beginPath()
    ctx.arc(d.x + d.w / 2, d.y + 10, 12, 0, Math.PI * 2)
    ctx.fill()

    // Eyes
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(d.x + d.w / 2 - 4, d.y + 8, 4, 0, Math.PI * 2)
    ctx.arc(d.x + d.w / 2 + 4, d.y + 8, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(d.x + d.w / 2 - 3, d.y + 8, 2, 0, Math.PI * 2)
    ctx.arc(d.x + d.w / 2 + 5, d.y + 8, 2, 0, Math.PI * 2)
    ctx.fill()

    // Nose/beak
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.moveTo(d.x + d.w / 2 + 8, d.y + 10)
    ctx.lineTo(d.x + d.w / 2 + 14, d.y + 12)
    ctx.lineTo(d.x + d.w / 2 + 8, d.y + 14)
    ctx.fill()

    // Feet
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.ellipse(d.x + d.w * 0.3, d.y + d.h - 2, 5, 3, 0, 0, Math.PI * 2)
    ctx.ellipse(d.x + d.w * 0.7, d.y + d.h - 2, 5, 3, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()

    // Score
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 18px system-ui'
    ctx.textAlign = 'left'
    ctx.fillText(`${s.score}`, 8, 24)

    // Game over overlay
    if (s.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.8)'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 28px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('Game Over!', W/2, H/2 - 30)
      ctx.font = '16px system-ui'
      ctx.fillStyle = '#a855f7'
      ctx.fillText(`Score: ${s.score}`, W/2, H/2)
      ctx.fillStyle = '#94a3b8'
      ctx.fillText(`Best: ${Math.max(best, s.score)}`, W/2, H/2 + 25)
      ctx.font = '14px system-ui'
      ctx.fillStyle = '#64748b'
      ctx.fillText('Tap to restart', W/2, H/2 + 55)
    }
  }, [best])

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      const s = gRef.current
      if (s.gameOver) {
        if (e.key === ' ' || e.key === 'Enter') window.dispatchEvent(new Event('ut:game-start'))
        return
      }
      if (!s.playing) return
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault()
        s.velocityX = 5
        s.doodler.facingRight = true
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        s.velocityX = -5
        s.doodler.facingRight = false
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        s.velocityY = s.initialVelocityY
        playBounce()
      }
    }
    const keyUp = (e) => {
      const s = gRef.current
      if (['ArrowRight','d','D','ArrowLeft','a','A'].includes(e.key)) {
        s.velocityX = 0
      }
    }
    window.addEventListener('keydown', handler)
    window.addEventListener('keyup', keyUp)
    return () => { window.removeEventListener('keydown', handler); window.removeEventListener('keyup', keyUp) }
  }, [startGame])

  // Touch / pointer
  const handlePointerDown = (e) => {
    gRef.current.touchStart = { x: e.clientX, y: e.clientY, time: Date.now() }
  }
  const handlePointerMove = (e) => {
    const s = gRef.current
    if (!s.playing || s.gameOver || !s.touchStart) return
    const dx = e.clientX - s.touchStart.x
    // Tilt control: move doodler based on pointer x position relative to canvas center
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const relX = (e.clientX - centerX) / (rect.width / 2)
    s.velocityX = relX * 6
    s.doodler.facingRight = relX > 0
  }
  const handlePointerUp = (e) => {
    const s = gRef.current
    if (s.gameOver) { window.dispatchEvent(new Event('ut:game-start')); return }
    s.touchStart = null
    s.velocityX = 0
  }

  // Resize
  useEffect(() => { fitCanvas(); draw() }, [fitCanvas, draw])


  return (
    <GameShell
      name="DOODLE JUMP"
      startAction={startGame} startLabel="▶ Start" 
      title="Doodle Jump Online - Jump & Bounce"
      desc="Play Doodle Jump online! Guide your doodler upward by bouncing on platforms. Dodge obstacles and reach new heights. Keyboard and touch controls."
      icon="📔" iconBg="rgba(168,85,247,0.08)"
      category="fun" slug="games-doodle-jump"
      faq={[
        { q: "How do I play Doodle Jump?", a: "Use left/right arrow keys or A/D to move. On mobile, tilt your device or drag your finger to move. The doodler automatically bounces on platforms." },
        { q: "What are the different platform colors?", a: "Green = normal (stable), Blue = moving (slides left/right), Yellow/Orange = fragile (breaks on contact)!" },
        { q: "How does scoring work?", a: "Score increases as you jump higher. The higher you go, the more points you earn. Your best score is saved!" },
      ]}
      howItWorks={[
        "Press Start or tap the canvas to begin.",
        "Use arrow keys (or A/D) on desktop, drag on mobile to move left/right.",
        "Bounce on green, blue, and yellow platforms to climb higher.",
        "Avoid falling off the bottom! The game ends when you fall.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Doodle Jump", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/doodle-jump/",
        "genre": "Arcade",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="flex gap-4 max-w-6xl mx-auto overflow-hidden">
        <div className="flex-1 min-w-0 max-w-xl mx-auto space-y-5 overflow-hidden">
        {/* Stats */}
        <div className="glass p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white">{score}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-purple-400">{best}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Best</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-slate-300">{lastScore}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Last</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
        </div>

        {/* Canvas */}
        <div className="glass p-3 flex justify-center overflow-hidden">
          <canvas ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="rounded-xl cursor-pointer"
            style={{ background: '#1a1a2e', touchAction: 'none' }}
          />
        </div>

        {/* Platform legend */}
        <div className="flex gap-3 justify-center text-xs text-slate-400">
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-500"></span> Normal</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-blue-500"></span> Moving</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-amber-500"></span> Fragile</span>
        </div>

        {/* Mobile D-pad hint */}
        <p className="text-center text-xs text-slate-400">
          Desktop: ← → to move | Mobile: Drag left/right to steer
        </p>
        </div>
      </div>
    </GameShell>
  )
}
