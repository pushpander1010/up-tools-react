import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

/* ── audio ── */
let audioCtx = null
function ctx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}
function tone(freq, dur, type = 'sine', vol = 0.06) {
  try {
    const c = ctx(), o = c.createOscillator(), g = c.createGain()
    o.type = type; o.frequency.value = freq
    g.gain.setValueAtTime(vol, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
    o.connect(g); g.connect(c.destination)
    o.start(); o.stop(c.currentTime + dur)
  } catch {}
}
const snd = {
  paddle:  () => tone(300, 0.06, 'triangle', 0.06),
  brick:   () => { tone(500 + Math.random() * 200, 0.04, 'square', 0.03) },
  wall:    () => tone(600, 0.03, 'sine', 0.025),
  over:    () => tone(220, 0.5, 'sawtooth', 0.05),
  launch:  () => tone(350, 0.1, 'sine', 0.03),
  level:   () => [400, 520, 660].forEach((f, i) => setTimeout(() => tone(f, 0.1, 'triangle', 0.04), i * 70)),
}

const COLORS = ['#7dd3fc','#93c5fd','#a5b4fc','#c4b5fd','#f0abfc','#f9a8d4','#fda4af','#fdba74']

const LS = { BEST: 'ut_bk_best', BESTLV: 'ut_bk_bestlv' }

function bestLevel() {
  try { return +(localStorage.getItem(LS.BESTLV) || 1) } catch { return 1 }
}

export default function BreakoutGame() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const cvs = useRef(null)
  const g = useRef(null)
  const touch = useRef({ on: false, x: 0 })

  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => { try { return +(localStorage.getItem(LS.BEST) || 0) } catch { return 0 } })
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [phase, setPhase] = useState('idle')  // idle | ready | playing | over

  /* ── resize ── */
  const resize = useCallback(() => {
    const c = cvs.current, wrap = c?.parentElement
    if (!c || !wrap) return
    const W = wrap.clientWidth
    const H = Math.floor(W * 0.75)
    const dpr = Math.min(2, devicePixelRatio || 1)
    c.width = W * dpr; c.height = H * dpr
    c.style.width = W + 'px'; c.style.height = H + 'px'
    c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0)
    const s = g.current
    if (s) { s.W = W; s.H = H; s.dpr = dpr }
    if (s?.paddle) {
      s.paddle.y = H - H * 0.07
      s.paddle.w = Math.max(50, W * 0.15)
    }
  }, [])

  /* ── spawn bricks ── */
  const spawnBricks = useCallback((lv) => {
    const s = g.current
    if (!s) return
    const rows = Math.min(3 + Math.floor((lv - 1) % 8), 9)
    const cols = Math.min(6 + Math.floor((lv - 1) % 5), 10)
    const pad = Math.round(s.W * 0.025)
    const gap = Math.max(3, Math.round(s.W * 0.01))
    const bw = Math.floor((s.W - pad * 2 - gap * (cols - 1)) / cols)
    const topY = Math.round(s.H * 0.08)
    const availH = Math.round(s.H * 0.45)
    const bh = Math.max(10, Math.floor((availH - gap * (rows - 1)) / rows))
    const sx = Math.floor((s.W - (bw * cols + gap * (cols - 1))) / 2)
    s.bricks = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        s.bricks.push({
          x: sx + c * (bw + gap),
          y: topY + r * (bh + gap),
          w: bw, h: bh,
          color: COLORS[(r + c) % COLORS.length],
          hp: 1 + Math.floor(lv / 4),
          alive: true,
        })
      }
    }
  }, [])

  /* ── reset for new level ── */
  const resetLevel = useCallback((lv) => {
    const s = g.current
    if (!s) return
    const W = s.W, H = s.H
    s.paddle = { x: W / 2, y: H - H * 0.07, w: Math.max(50, W * 0.15), h: Math.max(10, H * 0.018) }
    const spd = 260 + lv * 15
    s.ball = {
      x: s.paddle.x, y: s.paddle.y - s.paddle.h / 2 - 6,
      r: Math.max(5, W * 0.012),
      vx: (Math.random() < 0.5 ? -1 : 1) * spd * 0.6,
      vy: -spd,
      launched: false,
    }
    s.fireball = false
    spawnBricks(lv)
  }, [spawnBricks])

  /* ── draw ── */
  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return
    const s = g.current
    if (!s || !s.paddle || !s.ball) return
    const ctx = c.getContext('2d')
    const { W, H } = s

    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, W, H)

    // bricks
    for (const b of s.bricks) {
      if (!b.alive) continue
      ctx.fillStyle = b.color
      ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, b.h, 3); ctx.fill()
    }

    // paddle
    ctx.fillStyle = '#00e5ff'; ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.roundRect(s.paddle.x - s.paddle.w / 2, s.paddle.y - s.paddle.h / 2, s.paddle.w, s.paddle.h, 5)
    ctx.fill(); ctx.shadowBlur = 0

    // ball
    ctx.fillStyle = '#fff'; ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 10
    ctx.beginPath(); ctx.arc(s.ball.x, s.ball.y, s.ball.r, 0, Math.PI * 2); ctx.fill()
    ctx.shadowBlur = 0

    // HUD
    const fs = Math.max(11, Math.floor(W * 0.035))
    ctx.fillStyle = '#fff'; ctx.font = `bold ${fs}px system-ui`; ctx.textAlign = 'left'
    ctx.fillText(`Score ${s.score}`, 6, fs + 4)
    ctx.textAlign = 'center'
    ctx.fillText(`Lv ${s.level}`, W / 2, fs + 4)
    ctx.textAlign = 'right'
    ctx.fillText(`♥ ${s.lives}`, W - 6, fs + 4)

    // overlays
    if (s.phase !== 'playing') {
      ctx.fillStyle = 'rgba(5,13,26,0.75)'; ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'
      if (s.phase === 'over') {
        ctx.font = `bold ${Math.max(18, W * 0.07)}px system-ui`
        ctx.fillText('GAME OVER', W / 2, H * 0.42)
        ctx.font = `${Math.max(12, W * 0.038)}px system-ui`; ctx.fillStyle = '#94a3b8'
        ctx.fillText(`Score ${s.score}  ·  Level ${s.level}`, W / 2, H * 0.48)
        ctx.font = `${Math.max(10, W * 0.03)}px system-ui`; ctx.fillStyle = '#64748b'
        ctx.fillText('Tap to restart', W / 2, H * 0.55)
      } else {
        ctx.font = `bold ${Math.max(16, W * 0.06)}px system-ui`
        ctx.fillText(s.title || 'BREAKOUT', W / 2, H * 0.43)
        ctx.font = `${Math.max(10, W * 0.033)}px system-ui`; ctx.fillStyle = '#94a3b8'
        ctx.fillText(s.subtitle || 'Tap to launch', W / 2, H * 0.50)
      }
    }
  }, [])

  /* ── game loop ── */
  const loop = useCallback((ts) => {
    const s = g.current
    if (!s || !s.playing) return
    const dt = Math.min((ts - (s.lt || ts)) / 1000, 0.05)
    s.lt = ts

    const { W, H } = s

    // paddle movement
    const spd = Math.max(250, W * 0.5) * dt
    if (s.keys.left)  s.paddle.x = Math.max(s.paddle.w / 2, s.paddle.x - spd)
    if (s.keys.right) s.paddle.x = Math.min(W - s.paddle.w / 2, s.paddle.x + spd)

    // ball follows paddle when not launched
    if (!s.ball.launched) {
      s.ball.x = s.paddle.x
      s.ball.y = s.paddle.y - s.paddle.h / 2 - s.ball.r - 2
    } else {
      // move ball
      s.ball.x += s.ball.vx * dt
      s.ball.y += s.ball.vy * dt

      // wall bounce
      if (s.ball.x - s.ball.r <= 0) { s.ball.x = s.ball.r; s.ball.vx = Math.abs(s.ball.vx); snd.wall() }
      if (s.ball.x + s.ball.r >= W) { s.ball.x = W - s.ball.r; s.ball.vx = -Math.abs(s.ball.vx); snd.wall() }
      if (s.ball.y - s.ball.r <= 0) { s.ball.y = s.ball.r; s.ball.vy = Math.abs(s.ball.vy); snd.wall() }

      // paddle collision
      const py = s.paddle.y - s.paddle.h / 2
      if (s.ball.vy > 0 &&
          s.ball.y + s.ball.r >= py && s.ball.y - s.ball.r <= py + s.paddle.h &&
          s.ball.x >= s.paddle.x - s.paddle.w / 2 && s.ball.x <= s.paddle.x + s.paddle.w / 2) {
        s.ball.vy = -Math.abs(s.ball.vy)
        // angle based on hit position
        const hit = (s.ball.x - s.paddle.x) / (s.paddle.w / 2) // -1 to 1
        const baseSpd = Math.sqrt(s.ball.vx * s.ball.vx + s.ball.vy * s.ball.vy)
        const angle = hit * 1.1 // max ~63 degrees
        s.ball.vx = baseSpd * Math.sin(angle)
        s.ball.vy = -baseSpd * Math.cos(angle)
        snd.paddle()
      }

      // brick collision
      for (const b of s.bricks) {
        if (!b.alive) continue
        if (s.ball.x + s.ball.r > b.x && s.ball.x - s.ball.r < b.x + b.w &&
            s.ball.y + s.ball.r > b.y && s.ball.y - s.ball.r < b.y + b.h) {
          b.hp--
          if (b.hp <= 0) { b.alive = false; snd.brick() } else snd.wall()
          if (!s.fireball) {
            // reflect
            const overlapX = Math.min(s.ball.x + s.ball.r - b.x, b.x + b.w - (s.ball.x - s.ball.r))
            const overlapY = Math.min(s.ball.y + s.ball.r - b.y, b.y + b.h - (s.ball.y - s.ball.r))
            if (overlapX < overlapY) s.ball.vx *= -1
            else s.ball.vy *= -1
          }
          s.score += 10
          setScore(s.score)
          break
        }
      }

      // level complete
      if (s.bricks.every(b => !b.alive)) {
        const nl = s.level + 1; s.level = nl
        setLevel(nl); resetLevel(nl); snd.level()
        s.title = `Level ${nl}`; s.subtitle = 'Tap to launch'
        s.phase = 'ready'; setPhase('ready')
        draw()
        s.lt = ts // reset time so dt doesn't spike
        s.animId = requestAnimationFrame(loop)
        return
      }

      // ball lost
      if (s.ball.y > H + 20) {
        s.lives--
        if (s.lives <= 0) {
          s.playing = false; s.phase = 'over'
          const nb = Math.max(s.best, s.score); s.best = nb
          try { localStorage.setItem(LS.BEST, String(nb)); localStorage.setItem(LS.BESTLV, String(s.level)) } catch {}
          setBest(nb); setPhase('over'); snd.over(); draw(); return
        }
        setLives(s.lives)
        s.ball.launched = false
        s.ball.x = s.paddle.x; s.ball.y = s.paddle.y - s.paddle.h / 2 - s.ball.r - 2
        s.ball.vx = 0
        s.ball.vy = -(260 + s.level * 15)
      }
    }

    draw()
    s.animId = requestAnimationFrame(loop)
  }, [draw, resetLevel])

  /* ── start ── */
  const startGame = useCallback(() => {
    const s = g.current
    s.score = 0; s.level = 1; s.lives = 3; s.lt = 0
    s.playing = true; s.phase = 'ready'
    s.title = 'BREAKOUT'; s.subtitle = 'Tap to launch'
    s.keys = { left: false, right: false }
    resize(); resetLevel(1)
    setScore(0); setLevel(1); setLives(3); setPhase('ready')
    draw()
    if (s.animId) cancelAnimationFrame(s.animId)
    s.animId = requestAnimationFrame(loop)
  }, [loop, resize, resetLevel, draw])

  /* ── launch / tap ── */
  const handleTap = useCallback(() => {
    const s = g.current
    if (s.phase === 'over') { startGame(); return }
    if (s.phase === 'idle') { startGame(); return }
    if (!s.ball.launched) {
      s.ball.launched = true
      const spd = 260 + s.level * 15
      s.ball.vx = (Math.random() < 0.5 ? -1 : 1) * spd * 0.6
      s.ball.vy = -spd
      s.phase = 'playing'; setPhase('playing')
      snd.launch()
      if (!s.animId || !s.playing) {
        s.playing = true
        s.animId = requestAnimationFrame(loop)
      }
    }
  }, [startGame, loop])

  /* ── init ── */
  useEffect(() => {
    g.current = {
      W: 400, H: 300, dpr: 1,
      paddle: null, ball: null, bricks: [],
      keys: { left: false, right: false },
      score: 0, level: 1, lives: 3,
      fireball: false,
      lt: 0, animId: null, playing: false, phase: 'idle',
      best: +(() => { try { return +(localStorage.getItem(LS.BEST) || 0) } catch { return 0 } })(),
      title: 'BREAKOUT', subtitle: 'Tap to launch',
    }
    resize()
    const h = () => { resize(); draw() }
    window.addEventListener('resize', h)
    return () => { window.removeEventListener('resize', h); if (g.current?.animId) cancelAnimationFrame(g.current.animId) }
  }, [resize, draw])

  /* ── keyboard ── */
  useEffect(() => {
    const down = (e) => {
      const s = g.current
      if (!s) return
      if (e.key === 'ArrowLeft' || e.key === 'a') { s.keys.left = true; e.preventDefault() }
      if (e.key === 'ArrowRight' || e.key === 'd') { s.keys.right = true; e.preventDefault() }
      if (e.key === ' ') { e.preventDefault(); handleTap() }
    }
    const up = (e) => {
      const s = g.current
      if (!s) return
      if (e.key === 'ArrowLeft' || e.key === 'a') s.keys.left = false
      if (e.key === 'ArrowRight' || e.key === 'd') s.keys.right = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [handleTap])

  /* ── pointer ── */
  const onDown = useCallback((e) => {
    const s = g.current
    if (s.phase === 'over' || s.phase === 'idle') { handleTap(); return }
    const c = cvs.current; if (!c) return
    const rect = c.getBoundingClientRect()
    const x = e.clientX - rect.left
    touch.current = { on: true, x }
    s.paddle.x = (x / rect.width) * s.W // direct positioning
    try { c.setPointerCapture(e.pointerId) } catch {}
    if (!s.ball.launched) handleTap()
  }, [handleTap])

  const onMove = useCallback((e) => {
    if (!touch.current.on) return
    const c = cvs.current; if (!c) return
    const rect = c.getBoundingClientRect()
    const x = e.clientX - rect.left
    const s = g.current
    s.paddle.x = Math.max(s.paddle.w / 2, Math.min(s.W - s.paddle.w / 2, (x / rect.width) * s.W))
  }, [])

  const onUp = useCallback(() => {
    touch.current.on = false
  }, [])

  return (
    <ToolLayout
      title="Breakout Online - Free Brick Breaker Game"
      desc="Play Breakout online free. Break all bricks with the ball! Arrow keys or touch to move paddle. Levels get harder!"
      icon="🧱" iconBg="rgba(0,229,255,0.08)"
      category="fun" slug="games-breakout"
      faq={[
        { q: "How to play?", a: "Move the paddle to bounce the ball and break all bricks. Use arrow keys on desktop, drag on mobile. Space/tap to launch." },
        { q: "How do levels work?", a: "Clear all bricks to advance. Each level adds more rows and the ball gets faster!" },
      ]}
      howItWorks={["Move paddle left/right", "Launch the ball with tap/space", "Break all bricks to clear level", "Don't let the ball fall!"]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Breakout", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/breakout/",
        "genre": "Arcade", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-lg mx-auto space-y-4">
        {phase === 'idle' && (
          <div className="glass p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div><div className="text-2xl font-extrabold text-white">{best}</div><div className="text-xs text-slate-500">Best Score</div></div>
              <div><div className="text-2xl font-extrabold text-cyan-400">{bestLevel()}</div><div className="text-xs text-slate-500">Best Level</div></div>
            </div>
            <div className="flex justify-center mt-4">
              <button onClick={startGame} className="glow-btn px-8 py-3 text-sm font-bold">▶ Start Game</button>
            </div>
          </div>
        )}
        {phase !== 'idle' && (
          <div className="flex gap-2 justify-between items-center">
            <div className="flex gap-2">
              <span className="px-3 py-1 glass rounded-lg text-xs font-bold text-white">Score {score}</span>
              <span className="px-3 py-1 glass rounded-lg text-xs font-bold text-green-400">Lv {level}</span>
              <span className="px-3 py-1 glass rounded-lg text-xs font-bold text-red-400">♥ {lives}</span>
            </div>
            <button onClick={() => { g.current.playing = false; if (g.current.animId) cancelAnimationFrame(g.current.animId); setPhase('idle') }}
              className="px-3 py-1.5 rounded-lg text-xs bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition">Menu</button>
          </div>
        )}
        <div ref={resultRef} className="glass !p-0 overflow-hidden rounded-xl">
          <canvas ref={cvs} className="block rounded-xl cursor-pointer" style={{ touchAction: 'none' }}
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} />
        </div>
        <p className="text-center text-xs text-slate-500">
          {'ontouchstart' in window ? 'Drag to move paddle · Tap to launch' : '← → Move · Space Launch'}
        </p>
      </div>
    </ToolLayout>
  )
}
