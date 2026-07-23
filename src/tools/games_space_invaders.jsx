import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LS = { BEST: 'ut_si_best_v1', LAST: 'ut_si_last_v1', WAVE: 'ut_si_wave_v1' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) {
  try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {}
}
function playShoot() { playTone(880,0.08,'square',0.04) }
function playExplosion() { playTone(150,0.2,'sawtooth',0.06); setTimeout(()=>playTone(100,0.15,'sawtooth',0.04),50) }
function playHit() { playTone(200,0.15,'square',0.05) }
function playWaveUp() { [440,550,660,880].forEach((f,i)=>setTimeout(()=>playTone(f,0.12,'sine',0.06),i*80)) }
function playGameOver() { playTone(300,0.4,'sawtooth',0.07); setTimeout(()=>playTone(200,0.5,'sawtooth',0.05),200) }

const ALIEN_ROWS = 5
const ALIEN_COLS = 8

export default function games_space_invaders() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => Number(localStorage.getItem(LS.BEST)||0))
  const [lastScore, setLastScore] = useState(() => Number(localStorage.getItem(LS.LAST)||0))
  const [lives, setLives] = useState(3)
  const [wave, setWave] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [touchControls, setTouchControls] = useState(false)

  const gRef = useRef({
    player: { x: 200, w: 36, speed: 280 },
    aliens: [],
    alienDir: 1,
    alienSpeed: 1,
    alienDropDist: 0,
    bullets: [],
    alienBullets: [],
    particles: [],
    stars: [],
    score: 0, lives: 3, wave: 1,
    keys: { left:false, right:false, shoot:false },
    lastTime: 0,
    animId: null,
    W: 400, H: 600,
    dpr: 1,
    shootCooldown: 0,
    alienShootTimer: 0,
    frameCount: 0,
  })

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
    gRef.current.player.x = maxW / 2
    gRef.current.stars = Array.from({length:50}, () => ({
      x: Math.random()*maxW, y: Math.random()*H, r: Math.random()*1.2+0.3, speed: Math.random()*0.3+0.1
    }))
  }, [])

  const spawnAliens = useCallback((waveNum) => {
    const s = gRef.current
    s.aliens = []
    const W = s.W
    const alienW = 24, gap = 12
    const totalW = ALIEN_COLS * (alienW + gap)
    const startX = (W - totalW) / 2
    for (let r = 0; r < ALIEN_ROWS; r++) {
      for (let c = 0; c < ALIEN_COLS; c++) {
        const hp = r === 0 ? 2 : 1
        const points = (ALIEN_ROWS - r) * 10
        s.aliens.push({
          x: startX + c * (alienW + gap),
          y: 60 + r * 36,
          w: alienW, h: 20, hp, points,
          type: r < 2 ? 'squid' : r < 4 ? 'crab' : 'octopus',
          frame: 0,
        })
      }
    }
    s.alienDir = 1
    s.alienSpeed = 0.5 + waveNum * 0.15
    s.alienDropDist = 0
    s.alienShootTimer = 0
  }, [])

  const startGame = useCallback(() => {
    const s = gRef.current
    s.score = 0; s.lives = 3; s.wave = 1; s.frameCount = 0
    s.bullets = []; s.alienBullets = []; s.particles = []
    s.shootCooldown = 0; s.alienShootTimer = 0
    spawnAliens(1)
    setScore(0); setLives(3); setWave(1); setGameOver(false); setPlaying(true)
    fitCanvas()
    // Detect touch device
    setTouchControls('ontouchstart' in window || navigator.maxTouchPoints > 0)
    setTimeout(() => { startLoop() }, 30)
  }, [fitCanvas, spawnAliens])

  const startLoop = useCallback(() => {
    const s = gRef.current
    if (s.animId) cancelAnimationFrame(s.animId)

    const loop = (ts) => {
      const dt = Math.min((ts - (s.lastTime||ts))/1000, 0.05)
      s.lastTime = ts
      s.frameCount++

      if (playing && !gameOver) {
        // Player movement
        const spd = s.player.speed * dt
        if (s.keys.left && s.player.x - s.player.w/2 > 0) s.player.x -= spd
        if (s.keys.right && s.player.x + s.player.w/2 < s.W) s.player.x += spd

        // Shooting
        s.shootCooldown -= dt
        if (s.keys.shoot && s.shootCooldown <= 0 && s.bullets.length < 3) {
          s.bullets.push({ x: s.player.x, y: s.H - 70, vy: -400 })
          s.shootCooldown = 0.2
          playShoot()
        }

        // Move bullets
        for (const b of s.bullets) b.y += b.vy * dt
        s.bullets = s.bullets.filter(b => b.y > -10)

        // Move alien bullets
        for (const b of s.alienBullets) b.y += b.vy * dt
        s.alienBullets = s.alienBullets.filter(b => b.y < s.H + 10)

        // Alien shooting
        s.alienShootTimer += dt
        if (s.alienShootTimer > Math.max(0.5, 2 - s.wave * 0.15) && s.aliens.length > 0) {
          s.alienShootTimer = 0
          const living = s.aliens.filter(a => a.hp > 0)
          if (living.length > 0) {
            const shooter = living[Math.floor(Math.random()*living.length)]
            s.alienBullets.push({ x: shooter.x + shooter.w/2, y: shooter.y + shooter.h, vy: 200 + s.wave * 20 })
          }
        }

        // Move aliens
        let shouldDrop = false
        const moveAmt = s.alienSpeed * 60 * dt * s.alienDir
        for (const a of s.aliens) {
          if (a.hp <= 0) continue
          a.x += moveAmt
          if (a.x + a.w > s.W - 10 || a.x < 10) shouldDrop = true
          a.frame = Math.floor(s.frameCount / 30) % 2
        }
        if (shouldDrop) {
          s.alienDir *= -1
          for (const a of s.aliens) { a.y += 18; a.x += s.alienDir * -moveAmt * 2 }
        }

        // Bullet-alien collision
        for (const b of s.bullets) {
          for (const a of s.aliens) {
            if (a.hp <= 0) continue
            if (b.x > a.x && b.x < a.x + a.w && b.y > a.y && b.y < a.y + a.h) {
              a.hp--
              if (a.hp <= 0) {
                s.score += a.points
                setScore(s.score)
                // Explosion particles
                for (let i = 0; i < 8; i++) {
                  s.particles.push({
                    x: a.x + a.w/2, y: a.y + a.h/2,
                    vx: (Math.random()-0.5)*200, vy: (Math.random()-0.5)*200,
                    life: 0.5, color: '#ff6b6b'
                  })
                }
                playExplosion()
              } else {
                playHit()
              }
              b.y = -100
              break
            }
          }
        }

        // Alien bullet-player collision
        for (const b of s.alienBullets) {
          if (Math.abs(b.x - s.player.x) < s.player.w/2 && Math.abs(b.y - (s.H-60)) < 15) {
            s.lives--
            setLives(s.lives)
            b.y = s.H + 100
            playHit()
            // Explosion
            for (let i = 0; i < 6; i++) {
              s.particles.push({
                x: s.player.x, y: s.H-60,
                vx: (Math.random()-0.5)*150, vy: (Math.random()-0.5)*150,
                life: 0.6, color: '#00e5ff'
              })
            }
            if (s.lives <= 0) {
              setGameOver(true); setPlaying(false)
              playGameOver()
              const newBest = Math.max(best, s.score)
              setBest(newBest); setLastScore(s.score)
              try { localStorage.setItem(LS.BEST, String(newBest)); localStorage.setItem(LS.LAST, String(s.score)); localStorage.setItem(LS.WAVE, String(s.wave)) } catch {}
            }
          }
        }

        // Update particles
        for (const p of s.particles) { p.x += p.vx*dt; p.y += p.vy*dt; p.life -= dt }
        s.particles = s.particles.filter(p => p.life > 0)

        // Stars scroll
        for (const star of s.stars) { star.y += star.speed * 60 * dt; if (star.y > s.H) { star.y = 0; star.x = Math.random()*s.W } }

        // Wave complete
        if (s.aliens.every(a => a.hp <= 0)) {
          s.wave++
          setWave(s.wave)
          playWaveUp()
          spawnAliens(s.wave)
          s.bullets = []; s.alienBullets = []
        }
      }

      draw()
      s.animId = requestAnimationFrame(loop)
    }
    s.animId = requestAnimationFrame(loop)
  }, [playing, gameOver, best, spawnAliens])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = gRef.current
    const ctx = canvas.getContext('2d')
    const W = s.W, H = s.H

    // Background
    ctx.fillStyle = '#050d1a'
    ctx.fillRect(0, 0, W, H)

    // Stars
    for (const star of s.stars) {
      ctx.fillStyle = `rgba(255,255,255,${0.3 + star.r*0.3})`
      ctx.beginPath(); ctx.arc(star.x, star.y, star.r, 0, Math.PI*2); ctx.fill()
    }

    // Player ship
    if (s.lives > 0 || !gameOver) {
      const px = s.player.x, py = s.H - 60
      ctx.fillStyle = '#00e5ff'
      ctx.shadowColor = '#00e5ff'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.moveTo(px, py - 16)
      ctx.lineTo(px - 18, py + 8)
      ctx.lineTo(px - 10, py + 8)
      ctx.lineTo(px - 10, py + 14)
      ctx.lineTo(px + 10, py + 14)
      ctx.lineTo(px + 10, py + 8)
      ctx.lineTo(px + 18, py + 8)
      ctx.closePath()
      ctx.fill()
      ctx.shadowBlur = 0
    }

    // Aliens
    for (const a of s.aliens) {
      if (a.hp <= 0) continue
      const colors = { squid: '#c084fc', crab: '#34d399', octopus: '#f87171' }
      ctx.fillStyle = a.hp > 1 ? '#fbbf24' : colors[a.type] || '#fff'
      ctx.shadowColor = ctx.fillStyle
      ctx.shadowBlur = 4
      // Simple alien shape
      const ax = a.x, ay = a.y, aw = a.w, ah = a.h
      ctx.beginPath()
      if (a.type === 'squid') {
        ctx.roundRect(ax+2, ay, aw-4, ah, 4)
      } else if (a.type === 'crab') {
        ctx.roundRect(ax, ay+2, aw, ah-4, 3)
        ctx.fillRect(ax-3, ay+6, 5, 4)
        ctx.fillRect(ax+aw-2, ay+6, 5, 4)
      } else {
        ctx.roundRect(ax+4, ay, aw-8, ah, 6)
        ctx.fillRect(ax, ay+4, aw, ah-8)
      }
      ctx.fill()
      ctx.shadowBlur = 0
      // Eyes
      ctx.fillStyle = '#000'
      ctx.fillRect(ax+aw*0.3, ay+ah*0.3, 3, 3)
      ctx.fillRect(ax+aw*0.6, ay+ah*0.3, 3, 3)
    }

    // Bullets
    for (const b of s.bullets) {
      ctx.fillStyle = '#00e5ff'
      ctx.shadowColor = '#00e5ff'
      ctx.shadowBlur = 6
      ctx.fillRect(b.x-1.5, b.y-6, 3, 12)
      ctx.shadowBlur = 0
    }
    for (const b of s.alienBullets) {
      ctx.fillStyle = '#ef4444'
      ctx.shadowColor = '#ef4444'
      ctx.shadowBlur = 4
      ctx.fillRect(b.x-1.5, b.y-4, 3, 10)
      ctx.shadowBlur = 0
    }

    // Particles
    for (const p of s.particles) {
      ctx.globalAlpha = Math.max(0, p.life * 2)
      ctx.fillStyle = p.color
      ctx.beginPath(); ctx.arc(p.x, p.y, 2 + (1-p.life)*3, 0, Math.PI*2); ctx.fill()
    }
    ctx.globalAlpha = 1

    // HUD
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px system-ui'
    ctx.textAlign = 'left'
    ctx.fillText(`Score: ${s.score}`, 10, 25)
    ctx.textAlign = 'right'
    ctx.fillText(`Wave: ${s.wave}`, W-10, 25)
    // Lives
    for (let i = 0; i < s.lives; i++) {
      ctx.fillStyle = '#00e5ff'
      ctx.beginPath()
      ctx.moveTo(10+i*22, 45); ctx.lineTo(2+i*22, 53); ctx.lineTo(18+i*22, 53)
      ctx.closePath(); ctx.fill()
    }

    // Game over
    if (gameOver) {
      ctx.fillStyle = 'rgba(5,13,26,0.85)'
      ctx.fillRect(0,0,W,H)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 28px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('Game Over', W/2, H/2-30)
      ctx.font = '16px system-ui'; ctx.fillStyle = '#94a3b8'
      ctx.fillText(`Score: ${s.score}  |  Wave: ${s.wave}`, W/2, H/2)
      ctx.fillText(`Best: ${Math.max(best, s.score)}`, W/2, H/2+25)
      ctx.font = '14px system-ui'; ctx.fillStyle = '#64748b'
      ctx.fillText('Tap or Space to restart', W/2, H/2+55)
    }

    if (!playing) {
      ctx.fillStyle = 'rgba(5,13,26,0.7)'
      ctx.fillRect(0,0,W,H)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 24px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('SPACE INVADERS', W/2, H/2-10)
      ctx.font = '13px system-ui'; ctx.fillStyle = '#94a3b8'
      ctx.fillText('Press Start to play', W/2, H/2+15)
    }
  }, [playing, gameOver, best])

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      const s = gRef.current
      if (gameOver) { if (e.key===' '||e.key==='Enter') startGame(); return }
      if (!playing) return
      if (e.key==='ArrowLeft'||e.key==='a') { s.keys.left = true; e.preventDefault() }
      if (e.key==='ArrowRight'||e.key==='d') { s.keys.right = true; e.preventDefault() }
      if (e.key===' '||e.key==='ArrowUp') { s.keys.shoot = true; e.preventDefault() }
    }
    const handlerUp = (e) => {
      const s = gRef.current
      if (e.key==='ArrowLeft'||e.key==='a') s.keys.left = false
      if (e.key==='ArrowRight'||e.key==='d') s.keys.right = false
      if (e.key===' '||e.key==='ArrowUp') s.keys.shoot = false
    }
    window.addEventListener('keydown', handler)
    window.addEventListener('keyup', handlerUp)
    return () => { window.removeEventListener('keydown', handler); window.removeEventListener('keyup', handlerUp) }
  }, [playing, gameOver, startGame])

  // Touch controls
  const handleTouchBtn = (dir, pressed) => {
    const s = gRef.current
    if (dir === 'left') s.keys.left = pressed
    if (dir === 'right') s.keys.right = pressed
    if (dir === 'shoot') s.keys.shoot = pressed
  }

  const handlePointerDown = () => {
    if (gameOver) { startGame(); return }
  }

  useEffect(() => { fitCanvas(); draw() }, [fitCanvas, draw])
  useEffect(() => {
    const h = () => { fitCanvas(); draw() }
    window.addEventListener('resize', h)
    return () => { window.removeEventListener('resize', h); if (gRef.current.animId) cancelAnimationFrame(gRef.current.animId) }
  }, [fitCanvas, draw])

  return (
    <ToolLayout
      title="Space Invaders Online - Classic Arcade Shooter"
      desc="Play Space Invaders online. Defend Earth from alien invaders! Arrow keys to move, space to shoot. Waves get harder!"
      icon="👾" iconBg="rgba(0,229,255,0.08)"
      category="fun" slug="games-space-invaders"
      faq={[
        { q: "How do I play Space Invaders?", a: "Use arrow keys (or A/D) to move, Space to shoot. On mobile, use the touch buttons. Destroy all aliens to advance!" },
        { q: "What are the alien types?", a: "Squids (top row, 2 hits, 50pts), Crabs (middle, 1 hit, 30pts), and Octopuses (bottom, 1 hit, 10pts)." },
        { q: "How does the difficulty increase?", a: "Each wave makes aliens faster and they shoot more frequently. Survive as long as you can!" },
      ]}
      howItWorks={[
        "Arrow keys or A/D to move your ship left and right.",
        "Space bar to shoot — you can have up to 3 bullets on screen.",
        "Destroy all 40 aliens to advance to the next wave.",
        "Aliens speed up and shoot more each wave. How long can you survive?",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Space Invaders", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/space-invaders/",
        "genre": "Arcade",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-lg mx-auto space-y-5">
        {/* Stats */}
        <div className="glass p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white">{score}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-cyan-400">{best}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Best</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-green-400">{wave}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Wave</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-red-400">{lives}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Lives</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={startGame} className="glow-btn px-6 py-3 text-sm">
            {playing&&!gameOver?'⟲ Restart':'▶ Start'}
          </button>
        </div>

        <div ref={resultRef} className="glass p-3 flex justify-center overflow-hidden">
          <canvas ref={canvasRef}
            onPointerDown={handlePointerDown}
            className="rounded-xl cursor-pointer"
            style={{ background: '#050d1a', touchAction: 'none' }}
          />
        </div>

        {/* Mobile touch controls */}
        {touchControls && (
          <div className="flex justify-center gap-4 pb-2">
            <button
              onTouchStart={(e)=>{e.preventDefault();handleTouchBtn('left',true)}}
              onTouchEnd={(e)=>{e.preventDefault();handleTouchBtn('left',false)}}
              onTouchCancel={(e)=>{e.preventDefault();handleTouchBtn('left',false)}}
              className="w-16 h-16 rounded-xl bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-2xl text-white active:bg-white/[0.15] hover:bg-white/[0.12]"
            >◀</button>
            <button
              onTouchStart={(e)=>{e.preventDefault();handleTouchBtn('shoot',true)}}
              onTouchEnd={(e)=>{e.preventDefault();handleTouchBtn('shoot',false)}}
              onTouchCancel={(e)=>{e.preventDefault();handleTouchBtn('shoot',false)}}
              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl text-white active:bg-white/[0.15] glow-btn"
            >🔥</button>
            <button
              onTouchStart={(e)=>{e.preventDefault();handleTouchBtn('right',true)}}
              onTouchEnd={(e)=>{e.preventDefault();handleTouchBtn('right',false)}}
              onTouchCancel={(e)=>{e.preventDefault();handleTouchBtn('right',false)}}
              className="w-16 h-16 rounded-xl bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-2xl text-white active:bg-white/[0.15] hover:bg-white/[0.12]"
            >▶</button>
          </div>
        )}

        <p className="text-center text-xs text-slate-500">
          {touchControls ? 'Use buttons to move and shoot' : '← → to move | Space to shoot | Destroy all aliens!'}
        </p>
      </div>
    </ToolLayout>
  )
}
