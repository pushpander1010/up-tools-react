import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const LS = { BEST: 'ut_td_best_v1', LAST: 'ut_td_last_v1' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.06) {
  try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {}
}
function playShoot() { playTone(800,0.04,'square',0.03) }
function playPlace() { playTone(523,0.08,'sine',0.05); setTimeout(()=>playTone(659,0.06,'sine',0.04),50) }
function playDestroy() { playTone(200,0.2,'sawtooth',0.05); setTimeout(()=>playTone(150,0.25,'sawtooth',0.04),80) }
function playWave() { playTone(440,0.1,'sine',0.06); setTimeout(()=>playTone(550,0.1,'sine',0.06),80); setTimeout(()=>playTone(660,0.15,'sine',0.06),160) }

const GRID = 16
const TOWER_TYPES = [
  { id: 'arrow', name: 'Arrow', cost: 50, range: 3, damage: 10, fireRate: 600, color: '#22c55e', icon: '🏹' },
  { id: 'cannon', name: 'Cannon', cost: 100, range: 2.5, damage: 30, fireRate: 1200, color: '#ef4444', icon: '💣', splash: 0.8 },
  { id: 'ice', name: 'Ice', cost: 75, range: 3.5, damage: 5, fireRate: 800, color: '#06b6d4', icon: '❄️', slow: 0.5 },
  { id: 'lightning', name: 'Zap', cost: 150, range: 2, damage: 20, fireRate: 400, color: '#f59e0b', icon: '⚡', chain: true },
]

// Predefined path (snake pattern)
const PATH = [
  [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],[13,2],
  [13,3],[13,4],[13,5],[13,6],[13,7],[13,8],[13,9],[13,10],[13,11],[13,12],[13,13],
  [12,13],[11,13],[10,13],[9,13],[8,13],[7,13],[6,13],[5,13],[4,13],[3,13],[2,13],[1,13],
  [1,12],[1,11],[1,10],[1,9],[1,8],[1,7],[1,6],[1,5],[1,4],[1,3],
]
const PATH_SET = new Set(PATH.map(([r,c]) => `${r},${c}`))

function dist(r1,c1,r2,c2) { return Math.sqrt((r1-r2)**2 + (c1-c2)**2) }

function generateWave(waveNum) {
  const count = 5 + waveNum * 3
  const hp = 30 + waveNum * 15
  const speed = (waveNum <= 3 ? 0.008 : 0.02) + Math.min((waveNum-3) * 0.005, 0.02)
  const reward = 5 + waveNum * 2
  const enemies = []
  for (let i = 0; i < count; i++) {
    const type = waveNum > 5 && Math.random() > 0.7 ? 'fast' : waveNum > 8 && Math.random() > 0.8 ? 'tank' : 'normal'
    enemies.push({
      hp: type === 'tank' ? hp * 2 : hp,
      maxHp: type === 'tank' ? hp * 2 : hp,
      speed: type === 'fast' ? speed * 1.5 : speed,
      reward,
      pathIndex: 0,
      pathProgress: 0,
      x: PATH[0][1],
      y: PATH[0][0],
      alive: true,
      type,
      slowTimer: 0,
    })
  }
  return enemies
}

export default function games_tower_defense() {
  const canvasRef = useRef(null)
  const [gold, setGold] = useState(200)
  const [lives, setLives] = useState(20)
  const [wave, setWave] = useState(0)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(()=>{try{return Number(localStorage.getItem(LS.BEST)||0)}catch{return 0}})
  const [lastScore, setLastScore] = useState(()=>{try{return Number(localStorage.getItem(LS.LAST)||0)}catch{return 0}})
  const [gameOver, setGameOver] = useState(false)
  const [selectedTower, setSelectedTower] = useState(null)
  const [placing, setPlacing] = useState(null)
  const [waveActive, setWaveActive] = useState(false)
  const [showTutorial, setShowTutorial] = useState(true)


  const gRef = useRef({
    towers: [],
    enemies: [],
    projectiles: [],
    gold: 200,
    lives: 20,
    wave: 0,
    score: 0,
    W: 400, H: 400,
    dpr: 1,
    playing: false,
    gameOver: false,
    lastTick: 0,
    animId: null,
    waveActive: false,
    waveSpawnTimer: 0,
    waveSpawnIndex: 0,
    selectedTower: null,
    hoverCell: null,
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

  const startGame = useCallback(() => {
    const s = gRef.current
    s.towers = []
    s.enemies = []
    s.projectiles = []
    s.gold = 200
    s.lives = 20
    s.wave = 0
    s.score = 0
    s.playing = true
    s.gameOver = false
    s.lastTick = 0
    s.waveActive = false
    s.waveSpawnTimer = 0
    s.waveSpawnIndex = 0
    s.selectedTower = null
    setGold(200); setLives(20); setWave(0); setScore(0)
    setGameOver(false); setPlacing(null); setSelectedTower(null); setWaveActive(false)
    fitCanvas()
    setTimeout(() => { startLoop() }, 30)
    // Auto-start first wave after a brief delay
    setTimeout(() => startWave(), 800)
  }, [fitCanvas])

  const startLoop = useCallback(() => {
    const s = gRef.current
    if (s.animId) cancelAnimationFrame(s.animId)

    const loop = (ts) => {
      if (!s.playing) { s.animId = requestAnimationFrame(loop); return }
      const dt = Math.min(ts - (s.lastTick || ts), 32)
      s.lastTick = ts

      if (!s.gameOver) {
        // Spawn enemies during wave
        if (s.waveActive && s.waveEnemies && s.waveSpawnIndex < s.waveEnemies.length) {
          s.waveSpawnTimer += dt
          if (s.waveSpawnTimer >= (s.wave <= 3 ? 1200 : 500)) {
            s.waveSpawnTimer = 0
            s.enemies.push(s.waveEnemies[s.waveSpawnIndex])
            s.waveSpawnIndex++
          }
        }

        // Move enemies
        for (const e of s.enemies) {
          if (!e.alive) continue
          if (e.slowTimer > 0) e.slowTimer -= dt
          const spd = e.slowTimer > 0 ? e.speed * 0.5 : e.speed
          e.pathProgress += spd * dt
          const idx = Math.floor(e.pathProgress)
          if (idx >= PATH.length - 1) {
            e.alive = false
            s.lives--
            setLives(s.lives)
            if (s.lives <= 0) {
              s.gameOver = true
              s.playing = false
              setGameOver(true)
              const newBest = Math.max(best, s.score)
              setBest(newBest)
              setLastScore(s.score)
              try { localStorage.setItem(LS.BEST, String(newBest)); localStorage.setItem(LS.LAST, String(s.score)) } catch {}
            }
            continue
          }
          const frac = e.pathProgress - idx
          const [r1, c1] = PATH[idx]
          const [r2, c2] = PATH[Math.min(idx + 1, PATH.length - 1)]
          e.x = c1 + (c2 - c1) * frac
          e.y = r1 + (r2 - r1) * frac
        }

        // Tower shooting
        for (const t of s.towers) {
          t.cooldown = Math.max(0, (t.cooldown || 0) - dt)
          if (t.cooldown > 0) continue

          // Find closest enemy in range
          let closest = null
          let closestDist = Infinity
          for (const e of s.enemies) {
            if (!e.alive) continue
            const d = dist(t.row, t.col, e.y, e.x)
            if (d <= t.range && d < closestDist) {
              closest = e
              closestDist = d
            }
          }

          if (closest) {
            t.cooldown = t.fireRate
            s.projectiles.push({
              x: t.col, y: t.row,
              tx: closest.x, ty: closest.y,
              target: closest,
              damage: t.damage,
              speed: 0.15,
              color: t.color,
              splash: t.splash || 0,
              slow: t.slow || 0,
              chain: t.chain || false,
            })
            playShoot()
          }
        }

        // Move projectiles
        for (const p of s.projectiles) {
          if (!p.target || !p.target.alive) { p.done = true; continue }
          const dx = p.target.x - p.x
          const dy = p.target.y - p.y
          const d = Math.sqrt(dx*dx + dy*dy)
          if (d < 0.3) {
            // Hit!
            p.target.hp -= p.damage
            if (p.slow > 0) p.target.slowTimer = 2000
            if (p.target.hp <= 0) {
              p.target.alive = false
              s.gold += p.target.reward
              s.score += p.target.reward
              setGold(s.gold)
              setScore(s.score)
              playDestroy()
              // Chain lightning
              if (p.chain) {
                let chainTarget = null
                let chainDist = Infinity
                for (const e of s.enemies) {
                  if (!e.alive || e === p.target) continue
                  const cd = dist(p.target.y, p.target.x, e.y, e.x)
                  if (cd < 2 && cd < chainDist) { chainTarget = e; chainDist = cd }
                }
                if (chainTarget) {
                  chainTarget.hp -= p.damage * 0.5
                  if (chainTarget.hp <= 0) {
                    chainTarget.alive = false
                    s.gold += chainTarget.reward
                    s.score += chainTarget.reward
                    setGold(s.gold)
                    setScore(s.score)
                  }
                }
              }
            }
            p.done = true
          } else {
            p.x += (dx / d) * p.speed * dt
            p.y += (dy / d) * p.speed * dt
          }
        }

        // Cleanup
        s.enemies = s.enemies.filter(e => e.alive)
        s.projectiles = s.projectiles.filter(p => !p.done)

        // Check wave complete
        if (s.waveActive && s.waveSpawnIndex >= s.waveEnemies.length && s.enemies.length === 0) {
          s.waveActive = false
          setWaveActive(false)
          s.gold += 25 + s.wave * 5
          setGold(s.gold)
        }
      }

      draw()
      s.animId = requestAnimationFrame(loop)
    }
    s.animId = requestAnimationFrame(loop)
  }, [best])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = gRef.current
    const ctx = canvas.getContext('2d')
    const W = s.W, H = s.H
    const cellW = W / GRID

    // Background
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, W, H)

    // Draw grid
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const isPath = PATH_SET.has(`${r},${c}`)
        ctx.fillStyle = isPath ? '#3d3522' : 'rgba(255,255,255,0.03)'
        ctx.fillRect(c * cellW, r * cellW, cellW, cellW)
        ctx.strokeStyle = 'rgba(255,255,255,0.05)'
        ctx.lineWidth = 0.5
        ctx.strokeRect(c * cellW, r * cellW, cellW, cellW)
      }
    }

    // Path direction arrows
    ctx.fillStyle = 'rgba(255,200,50,0.15)'
    for (let i = 0; i < PATH.length - 1; i++) {
      const [r1, c1] = PATH[i]
      const [r2, c2] = PATH[i + 1]
      const dr = r2 - r1, dc = c2 - c1
      const cx = c1 * cellW + cellW/2
      const cy = r1 * cellW + cellW/2
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(Math.atan2(dr, dc))
      ctx.beginPath()
      ctx.moveTo(cellW*0.2, 0)
      ctx.lineTo(-cellW*0.15, -cellW*0.15)
      ctx.lineTo(-cellW*0.15, cellW*0.15)
      ctx.fill()
      ctx.restore()
    }

    // Hover/placement preview
    if (s.hoverCell && placing) {
      const [hr, hc] = s.hoverCell
      const canPlace = !PATH_SET.has(`${hr},${hc}`) && !s.towers.some(t => t.row === hr && t.col === hc)
      ctx.fillStyle = canPlace ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'
      ctx.fillRect(hc * cellW, hr * cellW, cellW, cellW)
      // Range circle
      if (canPlace) {
        const tt = TOWER_TYPES.find(t => t.id === placing)
        if (tt) {
          ctx.strokeStyle = 'rgba(255,255,255,0.2)'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(hc * cellW + cellW/2, hr * cellW + cellW/2, tt.range * cellW, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
    }

    // Draw towers
    for (const t of s.towers) {
      const tx = t.col * cellW
      const ty = t.row * cellW

      // Range circle if selected
      if (s.selectedTower === t) {
        ctx.strokeStyle = 'rgba(255,255,255,0.15)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(tx + cellW/2, ty + cellW/2, t.range * cellW, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Tower base
      ctx.fillStyle = 'rgba(0,0,0,0.3)'
      ctx.beginPath()
      ctx.roundRect(tx + 2, ty + 2, cellW - 4, cellW - 4, 4)
      ctx.fill()

      // Tower body
      ctx.fillStyle = t.color
      ctx.beginPath()
      ctx.roundRect(tx + 4, ty + 4, cellW - 8, cellW - 8, 3)
      ctx.fill()

      // Tower icon
      ctx.font = `${cellW * 0.5}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(t.icon, tx + cellW/2, ty + cellW/2)

      // Level indicator
      if (t.level > 1) {
        ctx.fillStyle = '#fbbf24'
        ctx.font = `bold ${cellW * 0.2}px system-ui`
        ctx.fillText(`★${t.level}`, tx + cellW - 6, ty + 8)
      }
    }

    // Draw enemies
    for (const e of s.enemies) {
      if (!e.alive) continue
      const ex = e.x * cellW
      const ey = e.y * cellW
      const sz = cellW * 0.6

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)'
      ctx.beginPath()
      ctx.ellipse(ex + cellW/2, ey + cellW/2 + sz*0.3, sz*0.4, sz*0.15, 0, 0, Math.PI * 2)
      ctx.fill()

      // Body
      let bodyColor = e.type === 'fast' ? '#f59e0b' : e.type === 'tank' ? '#7c3aed' : '#ef4444'
      if (e.slowTimer > 0) bodyColor = '#06b6d4'
      ctx.fillStyle = bodyColor
      ctx.beginPath()
      ctx.arc(ex + cellW/2, ey + cellW/2, sz * 0.35, 0, Math.PI * 2)
      ctx.fill()

      // Eyes
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(ex + cellW/2 - 3, ey + cellW/2 - 2, 2, 0, Math.PI * 2)
      ctx.arc(ex + cellW/2 + 3, ey + cellW/2 - 2, 2, 0, Math.PI * 2)
      ctx.fill()

      // HP bar
      const hpPct = e.hp / e.maxHp
      ctx.fillStyle = '#333'
      ctx.fillRect(ex + cellW*0.15, ey - 2, cellW*0.7, 3)
      ctx.fillStyle = hpPct > 0.5 ? '#22c55e' : hpPct > 0.25 ? '#f59e0b' : '#ef4444'
      ctx.fillRect(ex + cellW*0.15, ey - 2, cellW*0.7*hpPct, 3)
    }

    // Draw projectiles
    for (const p of s.projectiles) {
      ctx.fillStyle = p.color
      ctx.shadowColor = p.color
      ctx.shadowBlur = 4
      ctx.beginPath()
      ctx.arc(p.x * cellW + cellW/2, p.y * cellW + cellW/2, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }

    // HUD
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(0, 0, W, 28)
    ctx.font = 'bold 13px system-ui'
    ctx.textAlign = 'left'
    ctx.fillStyle = '#fbbf24'
    ctx.fillText(`💰 ${s.gold}`, 8, 18)
    ctx.fillStyle = '#ef4444'
    ctx.fillText(`❤️ ${s.lives}`, 100, 18)
    ctx.fillStyle = '#22c55e'
    ctx.fillText(`🌊 Wave ${s.wave}`, 180, 18)
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'right'
    ctx.fillText(`⭐ ${s.score}`, W - 8, 18)

    // Game over overlay
    if (s.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.8)'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 28px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('Game Over!', W/2, H/2 - 30)
      ctx.font = '16px system-ui'
      ctx.fillStyle = '#fbbf24'
      ctx.fillText(`Score: ${s.score}`, W/2, H/2)
      ctx.fillStyle = '#94a3b8'
      ctx.fillText(`Best: ${Math.max(best, s.score)}`, W/2, H/2 + 25)
      ctx.font = '14px system-ui'
      ctx.fillStyle = '#64748b'
      ctx.fillText('Tap to restart', W/2, H/2 + 55)
    }
  }, [best, placing])

  const startWave = useCallback(() => {
    const s = gRef.current
    if (s.waveActive || s.gameOver) return
    s.wave++
    s.waveActive = true
    s.waveSpawnTimer = 0
    s.waveSpawnIndex = 0
    s.waveEnemies = generateWave(s.wave)
    setWave(s.wave)
    setWaveActive(true)
    playWave()
  }, [])

  const placeTower = useCallback((row, col) => {
    const s = gRef.current
    if (!placing || PATH_SET.has(`${row},${col}`)) return
    if (s.towers.some(t => t.row === row && t.col === col)) return
    const tt = TOWER_TYPES.find(t => t.id === placing)
    if (!tt || s.gold < tt.cost) return

    s.gold -= tt.cost
    s.towers.push({
      row, col,
      type: tt.id,
      icon: tt.icon,
      color: tt.color,
      range: tt.range,
      damage: tt.damage,
      fireRate: tt.fireRate,
      splash: tt.splash || 0,
      slow: tt.slow || 0,
      chain: tt.chain || false,
      cooldown: 0,
      level: 1,
    })
    setGold(s.gold)
    setPlacing(null)
    playPlace()
  }, [placing])

  // Canvas click
  const handlePointerDown = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = gRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cellW = s.W / GRID
    const col = Math.floor(x / cellW)
    const row = Math.floor(y / cellW)

    if (s.gameOver) { window.dispatchEvent(new Event('ut:game-start')); return }

    if (placing) {
      placeTower(row, col)
      return
    }

    // Check if clicking on existing tower
    const tower = s.towers.find(t => t.row === row && t.col === col)
    if (tower) {
      s.selectedTower = s.selectedTower === tower ? null : tower
      setSelectedTower(s.selectedTower)
    } else {
      s.selectedTower = null
      setSelectedTower(null)
    }
  }, [placing, startGame, placeTower])

  const handlePointerMove = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = gRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cellW = s.W / GRID
    const col = Math.floor(x / cellW)
    const row = Math.floor(y / cellW)
    s.hoverCell = [row, col]
  }, [])

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      const s = gRef.current
      if (s.gameOver) {
        if (e.key === ' ' || e.key === 'Enter') window.dispatchEvent(new Event('ut:game-start'))
        return
      }
      if (e.key === '1') { setPlacing('arrow'); setSelectedTower(null) }
      if (e.key === '2') { setPlacing('cannon'); setSelectedTower(null) }
      if (e.key === '3') { setPlacing('ice'); setSelectedTower(null) }
      if (e.key === '4') { setPlacing('lightning'); setSelectedTower(null) }
      if (e.key === 'Escape') { setPlacing(null) }
      if (e.key === ' ' || e.key === 'n' || e.key === 'N') { startWave() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [startGame, startWave])

  useEffect(() => { fitCanvas(); draw() }, [fitCanvas, draw])


  return (
    <GameShell
      name="TOWER DEFENSE"
      startAction={startGame} startLabel="▶ Start" 
      title="Tower Defense Game Online - Free Strategy Game"
      desc="Play Tower Defense online! Build towers to defend against waves of enemies. Choose from Arrow, Cannon, Ice, and Lightning towers. Strategy and planning required!"
      icon="🏰" iconBg="rgba(239,68,68,0.08)"
      category="fun" slug="games-tower-defense"
      faq={[
        { q: "How do I play Tower Defense?", a: "Select a tower type from the bottom panel, then click an empty cell on the grid to place it. Click 'Next Wave' to send enemies. Earn gold by defeating enemies!" },
        { q: "What do the tower types do?", a: "Arrow (fast, cheap), Cannon (splash damage), Ice (slows enemies), Lightning (chain hits multiple enemies). Each has different range, damage, and fire rate." },
        { q: "How do I earn more gold?", a: "Defeat enemies to earn gold. You also get bonus gold between waves. Use gold to build and upgrade towers!" },
      ]}
      howItWorks={[
        "Press Start to begin. You start with 200 gold.",
        "Select a tower (keys 1-4 or click tower buttons) and place it on the grid.",
        "Click 'Send Wave' or press Space to start the enemy wave.",
        "Earn gold by defeating enemies. Survive as many waves as possible!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Tower Defense Game", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/tower-defense/",
        "genre": "Strategy",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="flex gap-4 max-w-6xl mx-auto overflow-hidden">
        <div className="flex-1 min-w-0 max-w-xl mx-auto space-y-5 overflow-hidden">
        {/* Stats */}
        <div className="glass p-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-xl font-extrabold text-yellow-400">{gold}</div>
              <div className="text-xs text-slate-400 font-medium">Gold</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-extrabold text-red-400">{lives}</div>
              <div className="text-xs text-slate-400 font-medium">Lives</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-extrabold text-cyan-400">{wave}</div>
              <div className="text-xs text-slate-400 font-medium">Wave</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-extrabold text-green-400">{score}</div>
              <div className="text-xs text-slate-400 font-medium">Score</div>
            </div>
          </div>
        </div>

        {showTutorial && (
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <h4 className="text-sm font-bold text-indigo-400 mb-2">🏰 How to Play</h4>
            <ol className="text-xs text-slate-300 space-y-1 ml-4 list-decimal">
              <li>Select a tower below (or press 1-4), then click a grid cell to place it</li>
              <li>Press <b>Space</b> or click <b>Send Wave</b> to start enemies</li>
              <li>Towers auto-attack. Earn gold from kills to build more towers</li>
              <li>Don't let enemies reach the end! You have {lives} lives</li>
            </ol>
            <button onClick={() => setShowTutorial(false)}
              className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-400 transition-all">
              Got it ✕
            </button>
          </div>
        )}

        {/* Tower selection */}
        <div className="glass p-3">
          <div className="grid grid-cols-4 gap-2">
            {TOWER_TYPES.map((tt, i) => (
              <button key={tt.id}
                onClick={() => { setPlacing(placing === tt.id ? null : tt.id); setSelectedTower(null) }}
                className={`p-2 rounded-lg text-center transition-all border ${
                  placing === tt.id
                    ? 'border-white/30 bg-white/10'
                    : 'border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06]'
                } ${gold < tt.cost ? 'opacity-40' : ''}`}
              >
                <div className="text-lg">{tt.icon}</div>
                <div className="text-xs font-bold text-white">{tt.name}</div>
                <div className="text-xs text-yellow-400">{tt.cost}💰</div>
                <div className="text-[10px] text-slate-400">{tt.damage}dmg | {tt.range}r</div>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          {!gameOver && (
            <button onClick={startWave} disabled={waveActive}
              className={`px-6 py-3 text-sm rounded-xl font-semibold border transition-all ${
                waveActive
                  ? 'bg-white/[0.04] border-white/[0.06] text-slate-400 cursor-not-allowed'
                  : 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
              }`}>
              🌊 {waveActive ? 'Wave Active...' : 'Send Wave'}
            </button>
          )}
        </div>

        {/* Canvas */}
        <div className="glass p-3 flex justify-center overflow-hidden">
          <canvas ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            className="rounded-xl cursor-pointer"
            style={{ touchAction: 'none' }}
          />
        </div>

        <p className="text-center text-xs text-slate-400">
          Keys: 1-4 select tower | Space = send wave | Esc = cancel
        </p>
        </div>
      </div>
    </GameShell>
  )
}
