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
function tone(freq, dur, type = 'sine', vol = 0.07) {
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
  shoot:    () => tone(880, 0.08, 'square', 0.04),
  kill:     () => { tone(300, 0.15, 'sawtooth', 0.06); setTimeout(() => tone(200, 0.1, 'sawtooth', 0.04), 40) },
  hit:      () => tone(180, 0.12, 'square', 0.05),
  wave:     () => [520, 660, 780, 990].forEach((f, i) => setTimeout(() => tone(f, 0.1, 'sine', 0.05), i * 70)),
  die:      () => { tone(200, 0.3, 'sawtooth', 0.07); setTimeout(() => tone(120, 0.4, 'sawtooth', 0.05), 150) },
}

const ROWS = 5, COLS = 9

export default function SpaceInvadersGame() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const cvs = useRef(null)
  const g = useRef(null)          // mutable game state
  const touch = useRef({ on: false, sx: 0, st: 0, pid: null })

  const [score, setScore] = useState(0)
  const [best, setBest]   = useState(() => { try { return +(localStorage.getItem('ut_si_best') || 0) } catch { return 0 } })
  const [lives, setLives] = useState(3)
  const [wave, setWave]   = useState(1)
  const [phase, setPhase] = useState('idle')   // idle | playing | over

  /* ── helpers ── */
  const sync = (s) => { setScore(s.score); setLives(s.lives); setWave(s.wave) }

  /* ── resize canvas ── */
  const resize = useCallback(() => {
    const c = cvs.current, wrap = c?.parentElement
    if (!c || !wrap) return
    const W = wrap.clientWidth
    const H = Math.floor(W * 1.5)
    const dpr = Math.min(2, devicePixelRatio || 1)
    c.width = W * dpr; c.height = H * dpr
    c.style.width = W + 'px'; c.style.height = H + 'px'
    c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0)
    const s = g.current; s.W = W; s.H = H; s.dpr = dpr
    s.player.x = Math.min(s.player.x, W - s.player.w)
    s.stars = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3, sp: Math.random() * 0.4 + 0.1,
    }))
  }, [])

  /* ── spawn aliens ── */
  const spawnAliens = useCallback((wv) => {
    const s = g.current
    const aw = Math.floor(s.W * 0.065)
    const ah = Math.floor(s.H * 0.03)
    const gx = Math.floor(s.W * 0.025)
    const gy = Math.floor(s.H * 0.045)
    const totalW = COLS * aw + (COLS - 1) * gx
    const sx = (s.W - totalW) / 2
    const sy = Math.floor(s.H * 0.08)
    s.aliens = []
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        s.aliens.push({
          x: sx + c * (aw + gx),
          y: sy + r * (ah + gy),
          w: aw, h: ah,
          hp: r === 0 ? 2 : 1,
          pts: (ROWS - r) * 10,
          type: r < 2 ? 'squid' : r < 4 ? 'crab' : 'bug',
        })
      }
    }
    s.dir = 1
    s.speed = 0.4 + wv * 0.12
    s.dropRemain = 0
    s.shootTimer = 0
  }, [])

  /* ── draw ── */
  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return
    const s = g.current
    const ctx = c.getContext('2d')
    const { W, H } = s

    // bg
    ctx.fillStyle = '#050d1a'
    ctx.fillRect(0, 0, W, H)

    // stars
    for (const st of s.stars) {
      ctx.fillStyle = `rgba(255,255,255,${0.2 + st.r * 0.3})`
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill()
    }

    // player ship
    if (s.lives > 0 && phase !== 'idle') {
      const px = s.player.x, py = H - H * 0.09
      const hw = W * 0.04
      ctx.fillStyle = '#00e5ff'; ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.moveTo(px, py - hw)
      ctx.lineTo(px - hw, py + hw * 0.5)
      ctx.lineTo(px - hw * 0.6, py + hw * 0.5)
      ctx.lineTo(px - hw * 0.6, py + hw * 0.8)
      ctx.lineTo(px + hw * 0.6, py + hw * 0.8)
      ctx.lineTo(px + hw * 0.6, py + hw * 0.5)
      ctx.lineTo(px + hw, py + hw * 0.5)
      ctx.closePath(); ctx.fill()
      ctx.shadowBlur = 0
    }

    // aliens
    const colors = { squid: '#c084fc', crab: '#34d399', bug: '#f87171' }
    for (const a of s.aliens) {
      if (a.hp <= 0) continue
      const col = a.hp > 1 ? '#fbbf24' : colors[a.type]
      ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 4
      const { x, y, w, h } = a
      ctx.beginPath()
      if (a.type === 'squid') {
        ctx.roundRect(x + w * 0.1, y, w * 0.8, h, w * 0.2)
      } else if (a.type === 'crab') {
        ctx.roundRect(x, y + h * 0.15, w, h * 0.7, w * 0.12)
        ctx.fillRect(x - 3, y + h * 0.3, 5, 4)
        ctx.fillRect(x + w - 2, y + h * 0.3, 5, 4)
      } else {
        ctx.roundRect(x + w * 0.15, y, w * 0.7, h, w * 0.25)
        ctx.fillRect(x + 2, y + h * 0.2, w - 4, h * 0.5)
      }
      ctx.fill(); ctx.shadowBlur = 0
      // eyes
      ctx.fillStyle = '#000'
      const es = Math.max(2, w * 0.12)
      ctx.fillRect(x + w * 0.28, y + h * 0.3, es, es)
      ctx.fillRect(x + w * 0.6, y + h * 0.3, es, es)
    }

    // player bullet
    for (const b of s.bullets) {
      ctx.fillStyle = '#00e5ff'; ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 6
      ctx.fillRect(b.x - 1.5, b.y - 6, 3, 12)
      ctx.shadowBlur = 0
    }
    // alien bullets
    for (const b of s.abullets) {
      ctx.fillStyle = '#ef4444'; ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 4
      ctx.fillRect(b.x - 1.5, b.y - 4, 3, 10)
      ctx.shadowBlur = 0
    }

    // particles
    for (const p of s.particles) {
      ctx.globalAlpha = Math.max(0, p.life * 2)
      ctx.fillStyle = p.col
      ctx.beginPath(); ctx.arc(p.x, p.y, 2 + (1 - p.life) * 3, 0, Math.PI * 2); ctx.fill()
    }
    ctx.globalAlpha = 1

    // HUD
    const fs = Math.max(12, Math.floor(W * 0.04))
    ctx.fillStyle = '#fff'; ctx.font = `bold ${fs}px system-ui`
    ctx.textAlign = 'left'
    ctx.fillText(`Score ${s.score}`, 8, fs + 4)
    ctx.textAlign = 'right'
    ctx.fillText(`Wave ${s.wave}`, W - 8, fs + 4)
    // lives icons
    for (let i = 0; i < s.lives; i++) {
      ctx.fillStyle = '#00e5ff'
      const lx = 8 + i * (fs + 4), ly = fs + fs * 0.7
      ctx.beginPath()
      ctx.moveTo(lx, ly - 5); ctx.lineTo(lx - 5, ly + 3); ctx.lineTo(lx + 5, ly + 3)
      ctx.closePath(); ctx.fill()
    }

    // overlays
    if (s.phase === 'idle') {
      ctx.fillStyle = 'rgba(5,13,26,0.8)'; ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'
      ctx.font = `bold ${Math.max(20, W * 0.08)}px system-ui`
      ctx.fillText('SPACE INVADERS', W / 2, H * 0.42)
      ctx.font = `${Math.max(11, W * 0.035)}px system-ui`; ctx.fillStyle = '#94a3b8'
      ctx.fillText('Tap or press Start to play', W / 2, H * 0.50)
    }
    if (s.phase === 'over') {
      ctx.fillStyle = 'rgba(5,13,26,0.85)'; ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'
      ctx.font = `bold ${Math.max(18, W * 0.07)}px system-ui`
      ctx.fillText('GAME OVER', W / 2, H * 0.42)
      ctx.font = `${Math.max(12, W * 0.04)}px system-ui`; ctx.fillStyle = '#94a3b8'
      ctx.fillText(`Score ${s.score}  ·  Wave ${s.wave}`, W / 2, H * 0.48)
      ctx.fillText(`Best ${Math.max(s.best, s.score)}`, W / 2, H * 0.53)
      ctx.font = `${Math.max(10, W * 0.032)}px system-ui`; ctx.fillStyle = '#64748b'
      ctx.fillText('Tap to restart', W / 2, H * 0.59)
    }
  }, [phase])

  /* ── game loop ── */
  const loop = useCallback((ts) => {
    const s = g.current
    if (!s.playing) return
    const dt = Math.min((ts - (s.lt || ts)) / 1000, 0.05)
    s.lt = ts; s.frame++

    const { W, H } = s

    // player move
    const spd = Math.min(300, W * 0.6) * dt
    if (s.keys.left)  s.player.x = Math.max(s.player.w / 2, s.player.x - spd)
    if (s.keys.right) s.player.x = Math.min(W - s.player.w / 2, s.player.x + spd)

    // shoot
    s.cooldown -= dt
    if (s.keys.shoot && s.cooldown <= 0 && s.bullets.length < 2) {
      s.bullets.push({ x: s.player.x, y: H - H * 0.11, vy: -420 })
      s.cooldown = 0.22; snd.shoot()
    }

    // bullets move
    for (const b of s.bullets) b.y += b.vy * dt
    s.bullets = s.bullets.filter(b => b.y > -20)

    for (const b of s.abullets) b.y += b.vy * dt
    s.abullets = s.abullets.filter(b => b.y < H + 20)

    // alien shoot
    s.shootTimer += dt
    const shootInterval = Math.max(0.4, 1.8 - s.wave * 0.12)
    if (s.shootTimer > shootInterval) {
      s.shootTimer = 0
      const living = s.aliens.filter(a => a.hp > 0)
      if (living.length) {
        // pick random bottom alien from each column
        const bottom = {}
        for (const a of living) {
          const col = Math.round(a.x / a.w)
          if (!bottom[col] || a.y > bottom[col].y) bottom[col] = a
        }
        const shooters = Object.values(bottom)
        const shooter = shooters[Math.floor(Math.random() * shooters.length)]
        s.abullets.push({ x: shooter.x + shooter.w / 2, y: shooter.y + shooter.h, vy: 180 + s.wave * 18 })
      }
    }

    // ── alien movement: horizontal + gradual vertical drop ──
    if (s.dropRemain > 0) {
      // drop phase: descend gradually each frame
      const step = Math.min(H * 0.01, s.dropRemain)
      for (const a of s.aliens) { if (a.hp > 0) a.y += step }
      s.dropRemain -= step
      if (s.dropRemain <= 0) { s.dropRemain = 0; s.dir *= -1 }
    } else {
      // horizontal march
      const move = s.speed * 50 * dt * s.dir
      let hitEdge = false
      for (const a of s.aliens) {
        if (a.hp <= 0) continue
        a.x += move
        if (a.x + a.w > W - 8 || a.x < 8) hitEdge = true
      }
      if (hitEdge) {
        // pull back & start dropping
        const pull = s.speed * 50 * dt * s.dir
        for (const a of s.aliens) { if (a.hp > 0) a.x -= pull }
        s.dropRemain = Math.max(H * 0.02, H * 0.015)
      }
    }

    // player bullet → alien
    for (const b of s.bullets) {
      for (const a of s.aliens) {
        if (a.hp <= 0) continue
        if (b.x > a.x && b.x < a.x + a.w && b.y > a.y && b.y < a.y + a.h) {
          a.hp--
          b.y = -999
          if (a.hp <= 0) {
            s.score += a.pts
            for (let i = 0; i < 8; i++) s.particles.push({
              x: a.x + a.w / 2, y: a.y + a.h / 2,
              vx: (Math.random() - 0.5) * 200, vy: (Math.random() - 0.5) * 200,
              life: 0.4, col: '#ff6b6b',
            })
            snd.kill()
          } else snd.hit()
          break
        }
      }
    }

    // alien bullet → player
    const py = H - H * 0.09
    for (const b of s.abullets) {
      if (Math.abs(b.x - s.player.x) < s.player.w / 2 && Math.abs(b.y - py) < H * 0.025) {
        b.y = H + 999; s.lives--; snd.die()
        for (let i = 0; i < 5; i++) s.particles.push({
          x: s.player.x, y: py,
          vx: (Math.random() - 0.5) * 150, vy: (Math.random() - 0.5) * 150,
          life: 0.5, col: '#00e5ff',
        })
        if (s.lives <= 0) {
          s.playing = false; s.phase = 'over'
          const nb = Math.max(s.best, s.score); s.best = nb
          try { localStorage.setItem('ut_si_best', String(nb)) } catch {}
          sync(s); snd.die(); setPhase('over'); draw(); return
        }
        sync(s)
      }
    }

    // wave cleared
    if (s.aliens.every(a => a.hp <= 0)) {
      s.wave++
      spawnAliens(s.wave)
      s.bullets = []; s.abullets = []
      snd.wave(); sync(s)
    }

    // particles
    for (const p of s.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt }
    s.particles = s.particles.filter(p => p.life > 0)

    // stars scroll
    for (const st of s.stars) { st.y += st.sp * 60 * dt; if (st.y > H) { st.y = 0; st.x = Math.random() * W } }

    draw()
    s.animId = requestAnimationFrame(loop)
  }, [draw, spawnAliens, sync])

  /* ── start game ── */
  const startGame = useCallback(() => {
    const s = g.current
    s.score = 0; s.lives = 3; s.wave = 1; s.frame = 0
    s.bullets = []; s.abullets = []; s.particles = []
    s.cooldown = 0; s.shootTimer = 0; s.lt = 0
    s.keys = { left: false, right: false, shoot: false }
    s.playing = true; s.phase = 'playing'
    s.player.x = s.W / 2
    s.player.w = Math.max(32, s.W * 0.09)
    resize()
    spawnAliens(1)
    setScore(0); setLives(3); setWave(1); setPhase('playing')
    if (s.animId) cancelAnimationFrame(s.animId)
    s.animId = requestAnimationFrame(loop)
  }, [loop, resize, spawnAliens])

  /* ── init ── */
  useEffect(() => {
    g.current = {
      W: 400, H: 600, dpr: 1,
      player: { x: 200, w: 36 },
      aliens: [], dir: 1, speed: 0.5,
      dropRemain: 0,
      bullets: [], abullets: [], particles: [],
      stars: [],
      score: 0, lives: 3, wave: 1,
      keys: { left: false, right: false, shoot: false },
      cooldown: 0, shootTimer: 0, frame: 0, lt: 0,
      animId: null, playing: false, phase: 'idle',
      best: +(() => { try { return +(localStorage.getItem('ut_si_best') || 0) } catch { return 0 } })(),
    }
    resize()
    draw()
    const h = () => { resize(); draw() }
    window.addEventListener('resize', h)
    return () => { window.removeEventListener('resize', h); if (g.current?.animId) cancelAnimationFrame(g.current.animId) }
  }, [resize, draw])

  /* ── keyboard ── */
  useEffect(() => {
    const down = (e) => {
      const s = g.current
      if (e.key === 'ArrowLeft' || e.key === 'a') { s.keys.left = true; e.preventDefault() }
      if (e.key === 'ArrowRight' || e.key === 'd') { s.keys.right = true; e.preventDefault() }
      if (e.key === ' ' || e.key === 'ArrowUp') { s.keys.shoot = true; e.preventDefault() }
      if (s.phase === 'over' && (e.key === ' ' || e.key === 'Enter')) startGame()
    }
    const up = (e) => {
      const s = g.current
      if (e.key === 'ArrowLeft' || e.key === 'a') s.keys.left = false
      if (e.key === 'ArrowRight' || e.key === 'd') s.keys.right = false
      if (e.key === ' ' || e.key === 'ArrowUp') s.keys.shoot = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [startGame])

  /* ── pointer (touch / mouse) ── */
  const onDown = useCallback((e) => {
    const s = g.current
    if (s.phase === 'over') { startGame(); return }
    if (!s.playing) return
    const c = cvs.current; if (!c) return
    const rect = c.getBoundingClientRect()
    const x = e.clientX - rect.left
    touch.current = { on: true, sx: x, st: performance.now(), pid: e.pointerId }
    s.keys.left = x < rect.width / 2
    s.keys.right = !s.keys.left
    try { c.setPointerCapture(e.pointerId) } catch {}
  }, [startGame])

  const onMove = useCallback((e) => {
    if (!touch.current.on || touch.current.pid !== e.pointerId) return
    const c = cvs.current; if (!c) return
    const rect = c.getBoundingClientRect()
    const x = e.clientX - rect.left
    const s = g.current
    s.keys.left = x < rect.width / 2
    s.keys.right = !s.keys.left
  }, [])

  const onUp = useCallback((e) => {
    if (!touch.current.on || touch.current.pid !== e.pointerId) return
    const elapsed = performance.now() - touch.current.st
    const c = cvs.current; if (!c) return
    const rect = c.getBoundingClientRect()
    const x = e.clientX - rect.left
    const dist = Math.abs(x - touch.current.sx)
    const s = g.current
    // quick tap = shoot
    if (elapsed < 250 && dist < 15) {
      s.keys.shoot = true; setTimeout(() => { s.keys.shoot = false }, 80)
    }
    s.keys.left = false; s.keys.right = false
    touch.current = { on: false, sx: 0, st: 0, pid: null }
  }, [])

  /* ── best display state (for idle screen) ── */
  const displayBest = phase === 'over' ? Math.max(best, score) : best

  return (
    <ToolLayout
      title="Space Invaders Online - Classic Arcade Shooter"
      desc="Play Space Invaders online free. Defend Earth from alien invaders! Arrow keys to move, space to shoot. Waves get harder!"
      icon="👾" iconBg="rgba(0,229,255,0.08)"
      category="fun" slug="games-space-invaders"
      faq={[
        { q: "How do I play?", a: "Arrow keys or A/D to move, Space to shoot. On mobile drag to move, tap to shoot. Destroy all aliens each wave!" },
        { q: "Alien types?", a: "Squids (top, 2 hits, 50pts), Crabs (middle, 1 hit, 30pts), Bugs (bottom, 1 hit, 10pts)." },
      ]}
      howItWorks={["Move left/right to dodge alien fire", "Shoot to destroy aliens", "Clear all aliens to advance waves", "Aliens get faster each wave"]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Space Invaders", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/space-invaders/",
        "genre": "Arcade", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-lg mx-auto space-y-4">
        {phase === 'idle' && (
          <div className="glass p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div><div className="text-2xl font-extrabold text-white">{best}</div><div className="text-xs text-slate-500">Best Score</div></div>
              <div><div className="text-2xl font-extrabold text-cyan-400">{lastWave()}</div><div className="text-xs text-slate-500">Last Wave</div></div>
            </div>
            <div className="flex justify-center mt-4">
              <button onClick={startGame} className="glow-btn px-8 py-3 text-sm font-bold">▶ Start Game</button>
            </div>
          </div>
        )}
        {phase === 'playing' && (
          <div className="flex gap-2 justify-between items-center">
            <div className="flex gap-2">
              <span className="px-3 py-1 glass rounded-lg text-xs font-bold text-white">Score {score}</span>
              <span className="px-3 py-1 glass rounded-lg text-xs font-bold text-green-400">Wave {wave}</span>
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
          {'ontouchstart' in window ? 'Drag to move · Tap to shoot' : '← → Move · Space Shoot'}
        </p>
      </div>
    </ToolLayout>
  )
}

function lastWave() {
  try { return +(localStorage.getItem('ut_si_wave') || 0) } catch { return 0 }
}
