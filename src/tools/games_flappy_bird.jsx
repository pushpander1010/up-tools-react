import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LS = { BEST: 'ut_flappy_best_v1', LAST: 'ut_flappy_last_v1', MEDALS: 'ut_flappy_medals_v1' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) {
  try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {}
}
function playFlap() { playTone(600,0.08,'sine',0.06) }
function playScore() { playTone(523,0.1,'sine',0.08); setTimeout(()=>playTone(659,0.12,'sine',0.06),60) }
function playHit() { playTone(200,0.2,'sawtooth',0.07); setTimeout(()=>playTone(150,0.3,'sawtooth',0.05),100) }

function getMedal(score) {
  if (score >= 40) return { icon: '💎', name: 'Diamond', color: '#a78bfa' }
  if (score >= 30) return { icon: '🏆', name: 'Platinum', color: '#e2e8f0' }
  if (score >= 20) return { icon: '🥇', name: 'Gold', color: '#fbbf24' }
  if (score >= 10) return { icon: '🥈', name: 'Silver', color: '#94a3b8' }
  if (score >= 5) return { icon: '🥉', name: 'Bronze', color: '#d97706' }
  return null
}

export default function games_flappy_bird() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => Number(localStorage.getItem(LS.BEST)||0))
  const [lastScore, setLastScore] = useState(() => Number(localStorage.getItem(LS.LAST)||0))
  const [gameState, setGameState] = useState('idle') // idle, running, dead
  const [medal, setMedal] = useState(null)

  const gRef = useRef({
    bird: { x: 80, y: 200, vy: 0, rot: 0 },
    pipes: [],
    score: 0,
    W: 400, H: 600,
    lastTime: 0,
    animId: null,
    dpr: 1,
    stars: [],
    groundOffset: 0,
    dayPhase: 0,
    frameCount: 0,
  })

  const GRAVITY = 0.45
  const FLAP = -7.5
  const PIPE_W = 52
  const PIPE_GAP = 140
  const PIPE_SPEED = 2.2

  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const wrap = canvas.parentElement
    if (!wrap) return
    const maxW = Math.min(400, wrap.clientWidth - 16)
    const H = Math.floor(maxW * 1.5)
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1))
    gRef.current.W = maxW; gRef.current.H = H; gRef.current.dpr = dpr
    canvas.width = Math.floor(maxW*dpr); canvas.height = Math.floor(H*dpr)
    canvas.style.width = maxW+'px'; canvas.style.height = H+'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr,0,0,dpr,0,0)
    // Generate stars
    gRef.current.stars = Array.from({length:40}, () => ({
      x: Math.random()*maxW, y: Math.random()*H*0.6, r: Math.random()*1.5+0.5, twinkle: Math.random()*Math.PI*2
    }))
  }, [])

  const resetGame = useCallback(() => {
    const s = gRef.current
    s.bird = { x: s.W*0.22, y: s.H*0.4, vy: 0, rot: 0 }
    s.pipes = []
    s.score = 0
    s.groundOffset = 0
    s.dayPhase = 0
    s.frameCount = 0
    setScore(0); setMedal(null)
  }, [])

  const startGame = useCallback(() => {
    resetGame()
    setGameState('running'); setPlaying(true)
    fitCanvas()
    setTimeout(() => { startLoop() }, 30)
  }, [resetGame, fitCanvas])

  const flap = useCallback(() => {
    const s = gRef.current
    if (gameState === 'idle') { startGame(); return }
    if (gameState === 'dead') return
    s.bird.vy = FLAP
    playFlap()
  }, [gameState, startGame])

  const startLoop = useCallback(() => {
    const s = gRef.current
    if (s.animId) cancelAnimationFrame(s.animId)

    const loop = (ts) => {
      const dt = Math.min((ts - (s.lastTime||ts))/16.67, 3)
      s.lastTime = ts
      s.frameCount++

      if (gameState === 'running') {
        // Bird physics
        s.bird.vy += GRAVITY * dt
        s.bird.y += s.bird.vy * dt
        s.bird.rot = Math.min(90, Math.max(-30, s.bird.vy * 4))

        // Ground scroll
        s.groundOffset = (s.groundOffset + PIPE_SPEED * dt) % 40

        // Day/night cycle
        s.dayPhase = (s.dayPhase + 0.002 * dt) % (Math.PI * 2)

        // Pipes
        if (s.pipes.length === 0 || s.pipes[s.pipes.length-1].x < s.W - 200) {
          const minY = 80
          const maxY = s.H - PIPE_GAP - 80
          const topH = minY + Math.random() * (maxY - minY)
          s.pipes.push({ x: s.W + 10, topH: topH, scored: false })
        }

        for (const p of s.pipes) {
          p.x -= PIPE_SPEED * dt
          // Score
          if (!p.scored && p.x + PIPE_W < s.bird.x) {
            p.scored = true
            s.score++
            setScore(s.score)
            playScore()
          }
        }
        s.pipes = s.pipes.filter(p => p.x > -PIPE_W - 10)

        // Collision detection
        const bx = s.bird.x, by = s.bird.y, br = 12
        // Ground / ceiling
        if (by + br > s.H - 40 || by - br < 0) {
          die(); draw(); s.animId = requestAnimationFrame(loop); return
        }
        // Pipes
        for (const p of s.pipes) {
          if (bx + br > p.x && bx - br < p.x + PIPE_W) {
            if (by - br < p.topH || by + br > p.topH + PIPE_GAP) {
              die(); draw(); s.animId = requestAnimationFrame(loop); return
            }
          }
        }
      } else if (gameState === 'idle') {
        // Floating animation
        s.bird.y = s.H * 0.4 + Math.sin(s.frameCount * 0.05) * 15
        s.dayPhase = (s.dayPhase + 0.002) % (Math.PI * 2)
      }

      draw()
      s.animId = requestAnimationFrame(loop)
    }
    s.animId = requestAnimationFrame(loop)
  }, [gameState])

  const die = useCallback(() => {
    setGameState('dead'); setPlaying(false)
    playHit()
    const s = gRef.current
    const newBest = Math.max(best, s.score)
    setBest(newBest); setLastScore(s.score)
    setMedal(getMedal(s.score))
    try { localStorage.setItem(LS.BEST, String(newBest)); localStorage.setItem(LS.LAST, String(s.score)) } catch {}
  }, [best])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = gRef.current
    const ctx = canvas.getContext('2d')
    const W = s.W, H = s.H

    // Sky gradient with day/night cycle
    const nightness = (Math.sin(s.dayPhase) + 1) / 2
    const skyTop = lerpColor('#1e3a5f', '#050d1a', nightness)
    const skyBot = lerpColor('#87ceeb', '#1a1a3e', nightness)
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, skyTop)
    grad.addColorStop(1, skyBot)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Stars (visible at night)
    if (nightness > 0.3) {
      ctx.globalAlpha = (nightness - 0.3) / 0.7
      for (const star of s.stars) {
        const twinkle = Math.sin(s.frameCount * 0.03 + star.twinkle) * 0.5 + 0.5
        ctx.fillStyle = `rgba(255,255,255,${twinkle})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, Math.PI*2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    // Pipes
    for (const p of s.pipes) {
      // Top pipe
      const topGrad = ctx.createLinearGradient(p.x, 0, p.x+PIPE_W, 0)
      topGrad.addColorStop(0, '#22c55e'); topGrad.addColorStop(0.5, '#4ade80'); topGrad.addColorStop(1, '#16a34a')
      ctx.fillStyle = topGrad
      ctx.beginPath(); ctx.roundRect(p.x, 0, PIPE_W, p.topH, [4,4,0,0]); ctx.fill()
      ctx.fillStyle = '#15803d'
      ctx.fillRect(p.x+4, p.topH-16, PIPE_W-8, 16)

      // Bottom pipe
      const botY = p.topH + PIPE_GAP
      ctx.fillStyle = topGrad
      ctx.beginPath(); ctx.roundRect(p.x, botY, PIPE_W, H-botY-40, [0,0,4,4]); ctx.fill()
      ctx.fillStyle = '#15803d'
      ctx.fillRect(p.x+4, botY, PIPE_W-8, 16)
    }

    // Ground
    ctx.fillStyle = '#92400e'
    ctx.fillRect(0, H-40, W, 40)
    ctx.fillStyle = '#b45309'
    ctx.fillRect(0, H-40, W, 4)
    // Ground pattern
    ctx.fillStyle = '#a16207'
    for (let x = -s.groundOffset; x < W; x += 40) {
      ctx.fillRect(x, H-36, 20, 4)
    }

    // Bird
    const bx = s.bird.x, by = s.bird.y
    ctx.save()
    ctx.translate(bx, by)
    ctx.rotate(s.bird.rot * Math.PI / 180)
    // Body
    ctx.fillStyle = '#fbbf24'
    ctx.beginPath()
    ctx.ellipse(0, 0, 14, 11, 0, 0, Math.PI*2)
    ctx.fill()
    // Wing
    const wingFlap = Math.sin(s.frameCount * 0.3) * 8
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.ellipse(-4, wingFlap, 8, 5, -0.3, 0, Math.PI*2)
    ctx.fill()
    // Eye
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.arc(6, -3, 4, 0, Math.PI*2); ctx.fill()
    ctx.fillStyle = '#000'
    ctx.beginPath(); ctx.arc(7, -3, 2, 0, Math.PI*2); ctx.fill()
    // Beak
    ctx.fillStyle = '#f97316'
    ctx.beginPath()
    ctx.moveTo(12, 0); ctx.lineTo(19, 2); ctx.lineTo(12, 5)
    ctx.fill()
    ctx.restore()

    // Score display
    if (gameState === 'running' || gameState === 'idle') {
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 36px system-ui'
      ctx.textAlign = 'center'
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 8
      ctx.fillText(s.score, W/2, 55)
      ctx.shadowBlur = 0
    }

    // Idle screen
    if (gameState === 'idle') {
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 28px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('Flappy Bird', W/2, H*0.2)
      ctx.font = '16px system-ui'
      ctx.fillStyle = '#e2e8f0'
      ctx.fillText('Tap or Space to flap!', W/2, H*0.2+35)
    }

    // Game over
    if (gameState === 'dead') {
      ctx.fillStyle = 'rgba(5,13,26,0.75)'
      ctx.fillRect(0,0,W,H)

      // Score card
      const cardW = 220, cardH = 160
      const cx = (W-cardW)/2, cy = (H-cardH)/2 - 20
      ctx.fillStyle = '#1e293b'
      ctx.beginPath(); ctx.roundRect(cx, cy, cardW, cardH, 12); ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.roundRect(cx, cy, cardW, cardH, 12); ctx.stroke()

      ctx.fillStyle = '#fff'
      ctx.font = 'bold 22px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('Game Over', W/2, cy+35)

      ctx.font = '14px system-ui'; ctx.fillStyle = '#94a3b8'
      ctx.fillText('Score', W/2, cy+60)
      ctx.font = 'bold 28px system-ui'; ctx.fillStyle = '#fff'
      ctx.fillText(s.score, W/2, cy+88)

      ctx.font = '14px system-ui'; ctx.fillStyle = '#94a3b8'
      ctx.fillText('Best', W/2, cy+108)
      ctx.font = 'bold 20px system-ui'; ctx.fillStyle = '#fbbf24'
      ctx.fillText(Math.max(best, s.score), W/2, cy+130)

      // Medal
      const m = getMedal(s.score)
      if (m) {
        ctx.font = '32px system-ui'
        ctx.fillText(m.icon, cx+35, cy+85)
        ctx.font = '10px system-ui'; ctx.fillStyle = m.color
        ctx.fillText(m.name, cx+35, cy+108)
      }

      ctx.font = '14px system-ui'; ctx.fillStyle = '#64748b'
      ctx.fillText('Tap or Space to restart', W/2, cy+cardH+25)
    }
  }, [gameState, best])

  function lerpColor(a, b, t) {
    const ah = parseInt(a.slice(1), 16), bh = parseInt(b.slice(1), 16)
    const ar = (ah>>16)&255, ag = (ah>>8)&255, ab = ah&255
    const br = (bh>>16)&255, bg = (bh>>8)&255, bb = bh&255
    const rr = Math.round(ar+(br-ar)*t), rg = Math.round(ag+(bg-ag)*t), rb = Math.round(ab+(bb-ab)*t)
    return `#${((1<<24)+(rr<<16)+(rg<<8)+rb).toString(16).slice(1)}`
  }

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault()
        if (gameState === 'dead') { startGame(); return }
        flap()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [gameState, flap, startGame])

  // Touch
  const handlePointerDown = (e) => {
    if (gameState === 'dead') { startGame(); return }
    flap()
  }

  useEffect(() => { fitCanvas(); draw() }, [fitCanvas, draw])
  useEffect(() => {
    const h = () => { fitCanvas(); draw() }
    window.addEventListener('resize', h)
    return () => { window.removeEventListener('resize', h); if (gRef.current.animId) cancelAnimationFrame(gRef.current.animId) }
  }, [fitCanvas, draw])

  return (
    <ToolLayout
      title="Flappy Bird Online - Free Arcade Game"
      desc="Play Flappy Bird online. Tap to flap, avoid pipes, and try to beat your high score. Day/night cycle and medal system!"
      icon="🐦" iconBg="rgba(251,191,36,0.08)"
      category="fun" slug="games-flappy-bird"
      faq={[
        { q: "How do I play Flappy Bird?", a: "Tap the screen, click, or press Space/Up arrow to make the bird flap upward. Gravity pulls it down. Avoid the pipes!" },
        { q: "What are the medals?", a: "Bronze (5+), Silver (10+), Gold (20+), Platinum (30+), Diamond (40+). Can you get Diamond?" },
        { q: "Does the background change?", a: "Yes! The game features a day/night cycle with stars appearing at night for extra atmosphere." },
      ]}
      howItWorks={[
        "Tap, click, or press Space to make the bird flap.",
        "Navigate through gaps between the pipes.",
        "Each pipe passed scores 1 point.",
        "Earn medals: Bronze(5), Silver(10), Gold(20), Platinum(30), Diamond(40)!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Flappy Bird Online", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/flappy-bird/",
        "genre": "Arcade",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-lg mx-auto space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-black/20 rounded-xl">
            <div className="text-lg font-extrabold text-yellow-400">{score}</div>
            <div className="text-xs text-slate-500">Score</div>
          </div>
          <div className="text-center p-3 bg-black/20 rounded-xl">
            <div className="text-lg font-extrabold text-green-400">{best}</div>
            <div className="text-xs text-slate-500">Best</div>
          </div>
          <div className="text-center p-3 bg-black/20 rounded-xl">
            <div className="text-lg font-extrabold text-slate-300">{lastScore}</div>
            <div className="text-xs text-slate-500">Last</div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={gameState === 'dead' ? startGame : flap} className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all" style={{background:'linear-gradient(135deg,#f59e0b,#d97706)'}}>
            {gameState === 'dead' ? '⟲ Play Again' : gameState === 'running' ? '🐦 Flap!' : '▶ Start'}
          </button>
        </div>

        <div ref={resultRef} className="flex justify-center">
          <canvas ref={canvasRef}
            onPointerDown={handlePointerDown}
            className="rounded-xl border border-white/[0.08] cursor-pointer"
            style={{ background: '#050d1a', touchAction: 'none' }}
          />
        </div>

        <p className="text-center text-xs text-slate-500">
          Space / Tap / Click to flap | Avoid pipes | Earn medals!
        </p>
      </div>
    </ToolLayout>
  )
}
