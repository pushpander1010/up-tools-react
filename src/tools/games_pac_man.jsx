import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import useFullscreen from '../hooks/useFullscreen'
import GameAdSlot from '../components/GameAdSlot'
import InterstitialAd from '../components/InterstitialAd'

/* ── audio ── */
let audioCtx = null
function ctx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}
function tone(freq, dur, type = 'sine', vol = 0.07) {
  try {
    const c = ctx(), o = c.createOscillator(), gn = c.createGain()
    o.type = type; o.frequency.value = freq
    gn.gain.setValueAtTime(vol, c.currentTime)
    gn.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
    o.connect(gn); gn.connect(c.destination)
    o.start(); o.stop(c.currentTime + dur)
  } catch {}
}
const snd = {
  chomp:    () => { tone(440,0.05,'sine',0.06); setTimeout(()=>tone(330,0.05,'sine',0.06),30) },
  power:    () => { tone(523,0.1,'sine',0.08); setTimeout(()=>tone(659,0.1,'sine',0.08),60); setTimeout(()=>tone(784,0.12,'sine',0.09),120) },
  eatGhost: () => { tone(880,0.08,'sine',0.1); setTimeout(()=>tone(1047,0.1,'sine',0.09),50) },
  death:    () => { tone(400,0.15,'sawtooth',0.07); setTimeout(()=>tone(300,0.15,'sawtooth',0.06),100); setTimeout(()=>tone(200,0.25,'sawtooth',0.05),200) },
  win:      () => { tone(523,0.1,'sine',0.08); setTimeout(()=>tone(659,0.1,'sine',0.08),80); setTimeout(()=>tone(784,0.1,'sine',0.08),160); setTimeout(()=>tone(1047,0.2,'sine',0.1),240) },
  start:    () => { tone(330,0.15,'sine',0.07); setTimeout(()=>tone(440,0.15,'sine',0.07),150); setTimeout(()=>tone(550,0.15,'sine',0.07),300) },
}

/* ── maze: 0=empty, 1=wall, 2=dot, 3=power pellet, 4=ghost house, 5=ghost door ── */
const MAZE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
  [1,3,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,3,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,1,2,1,1],
  [1,2,2,2,2,1,2,2,2,1,1,1,2,2,2,1,2,2,2,2,1],
  [1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1],
  [0,0,0,1,2,1,2,2,2,2,2,2,2,2,2,1,2,1,0,0,0],
  [1,1,1,1,2,1,2,1,1,4,4,1,1,2,1,2,1,1,1,1,1],
  [0,0,0,0,2,2,2,5,4,4,4,4,5,2,2,2,0,0,0,0,0],
  [1,1,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1],
  [1,1,1,1,2,1,2,2,2,2,2,2,2,2,2,1,2,1,1,1,1],
  [1,1,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,3,1],
  [1,3,2,1,2,2,2,2,2,0,0,2,2,2,2,2,2,1,2,2,1],
  [1,1,2,1,2,1,2,1,1,1,1,1,1,2,1,2,1,2,1,1,1],
  [1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,2,1,1,1,2,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]
const COLS = 21, ROWS = 21
const GHOST_COLORS = ['#ff0000', '#ffb8ff', '#00ffff', '#ffb851']

function safeGet(k, fb) { try { return localStorage.getItem(k) ?? fb } catch { return fb } }
function safeSet(k, v) { try { localStorage.setItem(k, v) } catch {} }

export default function games_pac_man() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const cvs = useRef(null)
  const g = useRef(null)     // mutable game state
  const touchRef = useRef({ on: false, sx: 0, sy: 0, pid: null })

  const [score, setScore] = useState(0)
  const [best, setBest]   = useState(() => Number(safeGet('ut_pm_best', '0')))
  const [lives, setLives] = useState(3)
  const [phase, setPhase] = useState('idle') // idle | playing | over | won

  const { isFs, toggle: toggleFs, onChange: onFsChange } = useFullscreen()
  const [showAd, setShowAd] = useState(false)
  const pendingAction = useRef(null)
  const triggerAd = useCallback((action) => { pendingAction.current = action; setShowAd(true) }, [])
  const onAdDismiss = useCallback(() => { setShowAd(false); if (pendingAction.current) { pendingAction.current(); pendingAction.current = null } }, [])

  const syncState = (s) => { setScore(s.score); setLives(s.lives) }

  /* ── resize canvas ── */
  const resize = useCallback(() => {
    const c = cvs.current, wrap = c?.parentElement
    if (!c || !wrap) return
    const maxW = Math.min(wrap.clientWidth, window.innerWidth - 48, 420)
    const cell = Math.floor(maxW / COLS)
    const W = cell * COLS
    const H = cell * ROWS
    const dpr = Math.min(2, devicePixelRatio || 1)
    c.width = W * dpr; c.height = H * dpr
    c.style.width = W + 'px'; c.style.height = H + 'px'
    c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0)
    const s = g.current
    if (s) { s.W = W; s.H = H; s.cell = cell; s.dpr = dpr }
  }, [])

  /* ── init maze ── */
  function cloneMaze() {
    const m = MAZE.map(r => [...r])
    let dots = 0
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (m[r][c] === 2 || m[r][c] === 3) dots++
    return { m, dots }
  }

  const canMove = (maze, x, y) => {
    // tunnel wrap
    if (y === 9 && (x < 0 || x >= COLS)) return true
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false
    const cell = maze[y][x]
    return cell !== 1 && cell !== 4 && cell !== 5
  }

  // ghosts can pass through ghost house cells (4,5) but not walls (1)
  const canGhostMove = (maze, x, y) => {
    if (y === 9 && (x < 0 || x >= COLS)) return true
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false
    return maze[y][x] !== 1
  }

  /* ── start / reset ── */
  const startGame = useCallback(() => {
    snd.start()
    const { m, dots } = cloneMaze()
    resize()
    const s = g.current
    if (!s) return
    s.maze = m
    s.pac = { x: 10, y: 15, dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 }, mouth: 0, mouthDir: 1 }
    s.ghosts = [
      { x: 10, y: 8, dir: { x: 0, y: -1 }, color: GHOST_COLORS[0], scared: false, inHouse: false, homeTimer: 0, scatterTarget: { x: COLS-3, y: 0 } },
      { x: 9, y: 9, dir: { x: 0, y: 1 }, color: GHOST_COLORS[1], scared: false, inHouse: true, homeTimer: 0, scatterTarget: { x: 1, y: 0 } },
      { x: 10, y: 9, dir: { x: 1, y: 0 }, color: GHOST_COLORS[2], scared: false, inHouse: true, homeTimer: 0, scatterTarget: { x: COLS-1, y: ROWS-1 } },
      { x: 11, y: 9, dir: { x: -1, y: 0 }, color: GHOST_COLORS[3], scared: false, inHouse: true, homeTimer: 0, scatterTarget: { x: 0, y: ROWS-1 } },
    ]
    // Stagger ghost releases
    s.ghosts[1].homeTimer = 60
    s.ghosts[2].homeTimer = 120
    s.ghosts[3].homeTimer = 180
    s.score = 0; s.lives = 3; s.powerTimer = 0; s.dotsEaten = 0; s.totalDots = dots
    s.moveTimer = 0; s.running = true; s.ghostCombo = 0; s.level = 1
    setPhase('playing'); syncState(s)
    requestAnimationFrame(loop)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── draw ── */
  const draw = useCallback(() => {
    const c = cvs.current
    if (!c) return
    const s = g.current
    if (!s || !s.cell) return
    const ctx = c.getContext('2d')
    const { maze, pac, ghosts } = s
    const cell = s.cell, W = s.W, H = s.H

    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H)

    // maze
    for (let r = 0; r < ROWS; r++) {
      for (let c2 = 0; c2 < COLS; c2++) {
        const x = c2 * cell, y = r * cell, v = maze[r]?.[c2]
        if (v === 1) {
          ctx.fillStyle = '#1a1a4e'; ctx.fillRect(x, y, cell, cell)
          ctx.strokeStyle = '#3333aa'; ctx.lineWidth = 1
          if (r > 0 && maze[r-1]?.[c2] !== 1) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x+cell, y); ctx.stroke() }
          if (r < ROWS-1 && maze[r+1]?.[c2] !== 1) { ctx.beginPath(); ctx.moveTo(x, y+cell); ctx.lineTo(x+cell, y+cell); ctx.stroke() }
          if (c2 > 0 && maze[r]?.[c2-1] !== 1) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y+cell); ctx.stroke() }
          if (c2 < COLS-1 && maze[r]?.[c2+1] !== 1) { ctx.beginPath(); ctx.moveTo(x+cell, y); ctx.lineTo(x+cell, y+cell); ctx.stroke() }
        } else if (v === 4) {
          ctx.fillStyle = '#220033'; ctx.fillRect(x, y, cell, cell)
        } else if (v === 5) {
          ctx.fillStyle = '#ff69b4'; ctx.fillRect(x, y, cell, 2) // ghost door
        } else if (v === 2) {
          ctx.fillStyle = '#ffcc00'
          ctx.beginPath(); ctx.arc(x+cell/2, y+cell/2, cell*0.12, 0, Math.PI*2); ctx.fill()
        } else if (v === 3) {
          ctx.fillStyle = '#ffcc00'
          ctx.beginPath(); ctx.arc(x+cell/2, y+cell/2, cell*0.3, 0, Math.PI*2); ctx.fill()
        }
      }
    }

    // Pac-Man
    const px = pac.x * cell + cell/2, py = pac.y * cell + cell/2, pr = cell * 0.45
    pac.mouth = Math.min(pac.mouth + pac.mouthDir * 0.15, 0.4)
    if (pac.mouth >= 0.4 || pac.mouth <= 0) pac.mouthDir *= -1
    let angle = 0
    if (pac.dir.x === 1) angle = 0
    else if (pac.dir.x === -1) angle = Math.PI
    else if (pac.dir.y === -1) angle = -Math.PI/2
    else if (pac.dir.y === 1) angle = Math.PI/2
    ctx.fillStyle = '#ffff00'
    ctx.beginPath(); ctx.arc(px, py, pr, angle + pac.mouth, angle + Math.PI*2 - pac.mouth); ctx.lineTo(px, py); ctx.fill()

    // Ghosts
    ghosts.forEach(gh => {
      if (gh.inHouse && gh.homeTimer > 0) return // still in house, not drawn
      const gx = gh.x * cell + cell/2, gy = gh.y * cell + cell/2, gr = cell * 0.42
      if (gh.scared) {
        ctx.fillStyle = s.powerTimer > 150 ? '#ffffff' : '#2121de'
      } else {
        ctx.fillStyle = gh.color
      }
      ctx.beginPath(); ctx.arc(gx, gy - gr*0.15, gr, Math.PI, 0); ctx.lineTo(gx+gr, gy+gr*0.7)
      for (let i = 3; i >= 0; i--) { const wx = gx + gr*(2*i/3-1), wy = gy+gr*0.7+(i%2===0?gr*0.3:0); ctx.lineTo(wx, wy) }
      ctx.closePath(); ctx.fill()
      if (!gh.scared) {
        ctx.fillStyle = '#fff'
        ctx.beginPath(); ctx.arc(gx-gr*0.3, gy-gr*0.2, gr*0.2, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(gx+gr*0.3, gy-gr*0.2, gr*0.2, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = '#00f'
        ctx.beginPath(); ctx.arc(gx-gr*0.3+gh.dir.x*gr*0.08, gy-gr*0.2+gh.dir.y*gr*0.08, gr*0.1, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(gx+gr*0.3+gh.dir.x*gr*0.08, gy-gr*0.2+gh.dir.y*gr*0.08, gr*0.1, 0, Math.PI*2); ctx.fill()
      }
    })

    // HUD
    ctx.fillStyle = '#fff'
    ctx.font = `bold ${Math.max(10, cell*0.5)}px monospace`
    ctx.fillText(`Score: ${s.score}`, cell*0.5, cell*0.7)
    for (let i = 0; i < s.lives; i++) {
      ctx.fillStyle = '#ffff00'
      const lx = 10 + i * (cell*0.8), ly = H - cell*0.6
      ctx.beginPath(); ctx.arc(lx, ly, cell*0.3, 0.3, Math.PI*2 - 0.3); ctx.lineTo(lx, ly); ctx.fill()
    }
  }, [])

  /* ── ghost AI ── */
  function ghostTarget(gh, gi, pac, ghosts) {
    if (gh.scared) return null // random
    switch (gi) {
      case 0: return { x: pac.x, y: pac.y }                           // Blinky: direct
      case 1: return { x: pac.x + pac.dir.x*4, y: pac.y + pac.dir.y*4 } // Pinky: ahead
      case 2: { // Inky: 2 cells ahead of pac, then double vector from Blinky
        const a = { x: pac.x + pac.dir.x*2, y: pac.y + pac.dir.y*2 }
        const blinky = ghosts[0]
        return { x: a.x + (a.x - blinky.x), y: a.y + (a.y - blinky.y) }
      }
      case 3: // Clyde: chase when far, scatter when close
        const d = Math.abs(gh.x - pac.x) + Math.abs(gh.y - pac.y)
        return d > 8 ? { x: pac.x, y: pac.y } : gh.scatterTarget
      default: return { x: pac.x, y: pac.y }
    }
  }

  /* ── game loop ── */
  const loop = useCallback((ts) => {
    const s = g.current
    if (!s || !s.running) return

    s.moveTimer++

    // ── Pac-Man movement (every 2 frames) ──
    if (s.moveTimer % 2 === 0) {
      const { pac, maze } = s
      // try next direction first
      if ((pac.nextDir.x || pac.nextDir.y) && canMove(maze, pac.x + pac.nextDir.x, pac.y + pac.nextDir.y)) {
        pac.dir = { ...pac.nextDir }; pac.nextDir = { x: 0, y: 0 }
      }
      if (pac.dir.x || pac.dir.y) {
        let nx = pac.x + pac.dir.x, ny = pac.y + pac.dir.y
        // tunnel
        if (ny === 9) { nx = nx < 0 ? COLS-1 : nx >= COLS ? 0 : nx }
        if (canMove(maze, nx, ny)) {
          pac.x = nx; pac.y = ny
          const cell = maze[ny]?.[nx]
          if (cell === 2) {
            maze[ny][nx] = 0; s.score += 10; s.dotsEaten++
            snd.chomp()
          } else if (cell === 3) {
            maze[ny][nx] = 0; s.score += 50; s.dotsEaten++
            s.powerTimer = 400 - (s.level-1)*50; s.ghostCombo = 0
            s.ghosts.forEach(gh => { gh.scared = true })
            snd.power()
          }
          syncState(s)
          // win check
          if (s.dotsEaten >= s.totalDots) {
            s.running = false; snd.win(); setPhase('won')
            if (s.score > Number(safeGet('ut_pm_best','0'))) { setBest(s.score); safeSet('ut_pm_best', String(s.score)) }
            draw(); return
          }
        }
      }
    }

    // ── Ghosts (every 3 frames) ──
    if (s.moveTimer % 3 === 0) {
      const { maze, pac, ghosts } = s

      // power timer
      if (s.powerTimer > 0) {
        s.powerTimer--
        if (s.powerTimer <= 0) { ghosts.forEach(gh => { gh.scared = false }); s.ghostCombo = 0 }
      }

      ghosts.forEach((gh, gi) => {
        // ghost house release
        if (gh.inHouse) {
          if (gh.homeTimer > 0) { gh.homeTimer--; return }
          // move up out of house
          if (gh.y > 8 && canGhostMove(maze, gh.x, gh.y-1)) { gh.y--; return }
          if (gh.y === 8) { gh.inHouse = false; gh.dir = { x: 0, y: -1 }; return }
          // still in house, move toward opening
          const dirs = [{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}]
          const valid = dirs.filter(d => canGhostMove(maze, gh.x+d.x, gh.y+d.y) && !(d.x===-gh.dir.x&&d.y===-gh.dir.y))
          if (valid.length > 0) { const d = valid[Math.floor(Math.random()*valid.length)]; gh.dir = d; gh.x += d.x; gh.y += d.y }
          return
        }

        // ghost AI direction choice
        const dirs = [{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}].filter(d => {
          if (d.x === -gh.dir.x && d.y === -gh.dir.y) return false
          const nx = gh.x + d.x, ny = gh.y + d.y
          const wx = ny === 9 && (nx < 0 || nx >= COLS) ? (nx < 0 ? COLS-1 : 0) : nx
          return canGhostMove(maze, wx, ny)
        })

        if (dirs.length === 0) {
          // stuck: try reverse
          const rev = { x: -gh.dir.x, y: -gh.dir.y }
          if (canGhostMove(maze, gh.x+rev.x, gh.y+rev.y)) dirs.push(rev)
          else return
        }

        let chosen
        if (gh.scared) {
          chosen = dirs[Math.floor(Math.random() * dirs.length)]
        } else {
          const target = ghostTarget(gh, gi, pac, ghosts)
          if (target) {
            let minD = Infinity
            dirs.forEach(d => {
              const d2 = Math.abs(gh.x+d.x - target.x) + Math.abs(gh.y+d.y - target.y)
              if (d2 < minD) { minD = d2; chosen = d }
            })
          } else { chosen = dirs[Math.floor(Math.random()*dirs.length)] }
        }

        if (!chosen && dirs.length > 0) chosen = dirs[0]
        if (!chosen) return
        gh.dir = chosen
        let nx = gh.x + chosen.x, ny = gh.y + chosen.y
        if (ny === 9) { nx = nx < 0 ? COLS-1 : nx >= COLS ? 0 : nx }
        // don't let ghost re-enter house (block at type 4/5 when leaving)
        if (gh.y <= 8 && (maze[ny]?.[nx] === 4 || maze[ny]?.[nx] === 5)) return
        gh.x = nx; gh.y = ny

        // collision with Pac-Man
        if (gh.x === pac.x && gh.y === pac.y) {
          if (gh.scared) {
            s.ghostCombo++; const pts = 200 * Math.pow(2, s.ghostCombo - 1)
            s.score += pts; snd.eatGhost(); syncState(s)
            gh.x = 10; gh.y = 8; gh.scared = false; gh.inHouse = true; gh.homeTimer = 30
            gh.dir = { x: 0, y: -1 }
          } else {
            s.lives--; syncState(s); snd.death()
            if (s.lives <= 0) {
              s.running = false; setPhase('over')
              if (s.score > Number(safeGet('ut_pm_best','0'))) { setBest(s.score); safeSet('ut_pm_best', String(s.score)) }
              draw(); return
            }
            // reset positions
            pac.x = 10; pac.y = 15; pac.dir = { x: 0, y: 0 }; pac.nextDir = { x: 0, y: 0 }
            s.ghosts.forEach((rg, ri) => {
              rg.x = ri < 2 ? 10 - ri : 10 + (ri-1); rg.y = 8; rg.dir = { x: 0, y: -1 }
              rg.scared = false; rg.inHouse = ri > 0; rg.homeTimer = ri * 30
            })
            s.powerTimer = 0; s.ghostCombo = 0
          }
        }
      })
    }

    draw()
    s.animId = requestAnimationFrame(loop)
  }, [draw])

  /* ── keyboard ── */
  useEffect(() => {
    const h = (e) => {
      const s = g.current
      if (!s || !s.running) {
        if ((s.phase === 'idle' || s.phase === 'over' || s.phase === 'won') && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault(); triggerAd(startGame)
        }
        return
      }
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': e.preventDefault(); s.pac.nextDir = {x:0,y:-1}; break
        case 'ArrowDown': case 's': case 'S': e.preventDefault(); s.pac.nextDir = {x:0,y:1}; break
        case 'ArrowLeft': case 'a': case 'A': e.preventDefault(); s.pac.nextDir = {x:-1,y:0}; break
        case 'ArrowRight': case 'd': case 'D': e.preventDefault(); s.pac.nextDir = {x:1,y:0}; break
        default: if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [startGame, triggerAd])

  /* ── touch / pointer ── */
  const onPointerDown = useCallback((e) => {
    const s = g.current
    if (!s || s.phase === 'idle' || s.phase === 'over' || s.phase === 'won') { triggerAd(startGame); return }
    if (!s.running) return
    touchRef.current = { on: true, sx: e.clientX, sy: e.clientY, pid: e.pointerId }
    try { cvs.current?.setPointerCapture(e.pointerId) } catch {}
  }, [startGame, triggerAd])

  const onPointerMove = useCallback((e) => {
    if (!touchRef.current.on || touchRef.current.pid !== e.pointerId) return
    const s = g.current
    if (!s || !s.running) return
    const dx = e.clientX - touchRef.current.sx
    const dy = e.clientY - touchRef.current.sy
    const th = 25
    if (Math.abs(dx) > th || Math.abs(dy) > th) {
      if (Math.abs(dx) > Math.abs(dy)) s.pac.nextDir = dx > 0 ? {x:1,y:0} : {x:-1,y:0}
      else s.pac.nextDir = dy > 0 ? {x:0,y:1} : {x:0,y:-1}
      touchRef.current.sx = e.clientX; touchRef.current.sy = e.clientY
    }
  }, [])

  const onPointerUp = useCallback((e) => {
    if (touchRef.current.pid !== e.pointerId) return
    touchRef.current = { on: false, sx: 0, sy: 0, pid: null }
  }, [])

  /* ── lifecycle ── */
  useEffect(() => {
    g.current = { running: false, W: 0, H: 0, cell: 0, dpr: 1, maze: MAZE.map(r=>[...r]) }
    resize(); draw()
    return () => { if (g.current?.animId) cancelAnimationFrame(g.current.animId); g.current = null }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const h = () => { resize(); draw() }
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [draw, resize])

  useEffect(() => {
    const h = () => onFsChange()
    document.addEventListener('fullscreenchange', h)
    document.addEventListener('webkitfullscreenchange', h)
    return () => { document.removeEventListener('fullscreenchange', h); document.removeEventListener('webkitfullscreenchange', h) }
  }, [onFsChange])

  return (
    <ToolLayout hideHeader={isFs}
      title="Pac-Man Online - Classic Arcade Game"
      desc="Play the classic Pac-Man arcade game in your browser! Eat dots, avoid ghosts, grab power pellets. Arrow keys or swipe to move."
      icon="👾" iconBg="rgba(250,204,21,0.08)"
      category="fun" slug="games-pac-man"
      faq={[
        { q: "How do I control Pac-Man?", a: "Use arrow keys or WASD on desktop. On mobile, swipe or use the D-pad below the game." },
        { q: "What do power pellets do?", a: "The large glowing dots make ghosts turn blue and vulnerable. Eat them for bonus points: 200, 400, 800, 1600 for consecutive ghosts!" },
        { q: "How do ghosts behave?", a: "Each ghost has a different personality. Blinky chases you directly, Pinky tries to ambush ahead, Inky uses tricky positioning, and Clyde gets scared when close!" },
      ]}
      howItWorks={[
        "Arrow keys or WASD to move Pac-Man around the maze.",
        "Eat all the small dots (10 points each) to clear the level.",
        "Power pellets (large dots) make ghosts vulnerable for a short time.",
        "Eat blue ghosts for escalating bonus points!",
        "Avoid ghosts when they're not blue — touching one costs a life.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Pac-Man Online", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/pac-man/",
        "genre": "Arcade", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <InterstitialAd show={showAd} onDismiss={onAdDismiss} countdown={3} />
      <div className="flex gap-4 max-w-6xl mx-auto overflow-hidden">
        {/* Left aside ad */}
        <div className="hidden lg:block w-[160px] shrink-0 sticky top-24 self-start">
          <GameAdSlot slot="4214854395" format="vertical" className="mt-2" />
        </div>

        {/* Game center */}
        <div className="flex-1 min-w-0 max-w-xl mx-auto space-y-5">
          {/* Score bar */}
          <div className="glass p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-extrabold text-white">{score}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extrabold text-yellow-400">{best}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Best</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extrabold text-red-400">{'❤️'.repeat(Math.max(0, lives))}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Lives</div>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div ref={resultRef} className="glass flex justify-center overflow-hidden" style={{padding:0}}>
            <div className="relative overflow-hidden" style={{background:'#000', lineHeight:0}}>
              <canvas ref={cvs} className="block" style={{imageRendering:'pixelated', touchAction:'none'}}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              />
              {/* Start overlay */}
              {(phase === 'idle' || (phase === 'over' && lives <= 0)) && phase !== 'won' && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6"
                  onClick={() => triggerAd(startGame)}>
                  <div className="text-5xl mb-4">👾</div>
                  <h2 className="text-xl font-bold text-white mb-2">PAC-MAN</h2>
                  <p className="text-sm text-slate-400 text-center mb-4">
                    {phase === 'idle' ? 'Eat dots. Dodge ghosts. Grab power pellets!' : `Final Score: ${score}`}
                  </p>
                  <button onClick={(e) => { e.stopPropagation(); triggerAd(startGame) }}
                    className="glow-btn px-8 py-3 text-sm">
                    {phase === 'idle' ? 'Start Game' : 'Play Again'}
                  </button>
                  <p className="text-xs text-slate-500 mt-3">Arrow keys / WASD / Swipe</p>
                </div>
              )}
              {/* Win overlay */}
              {phase === 'won' && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6"
                  onClick={() => triggerAd(startGame)}>
                  <div className="text-5xl mb-3">🎉</div>
                  <h2 className="text-xl font-bold text-white mb-2">You Win!</h2>
                  <p className="text-sm text-slate-400 mb-4">Score: {score}</p>
                  <button onClick={(e) => { e.stopPropagation(); triggerAd(startGame) }}
                    className="glow-btn px-8 py-3 text-sm">Play Again</button>
                </div>
              )}
            </div>
          </div>

          {/* V-score */}
          {phase === 'over' && lives <= 0 && (
            <div className="text-center text-sm text-slate-500 font-medium">
              Game Over! Score: {score} · Best: {best}
            </div>
          )}

          {/* D-pad */}
          <div className="grid grid-cols-3 gap-1 max-w-[200px] mx-auto sm:hidden">
            <div/>
            <button onPointerDown={(e) => { e.preventDefault(); const s=g.current; if(s?.running) s.pac.nextDir={x:0,y:-1} }}
              className="p-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-lg active:bg-white/[0.12]">▲</button>
            <div/>
            <button onPointerDown={(e) => { e.preventDefault(); const s=g.current; if(s?.running) s.pac.nextDir={x:-1,y:0} }}
              className="p-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-lg active:bg-white/[0.12]">◀</button>
            <div className="p-3 text-center text-slate-500 text-xs">D-PAD</div>
            <button onPointerDown={(e) => { e.preventDefault(); const s=g.current; if(s?.running) s.pac.nextDir={x:1,y:0} }}
              className="p-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-lg active:bg-white/[0.12]">▶</button>
            <div/>
            <button onPointerDown={(e) => { e.preventDefault(); const s=g.current; if(s?.running) s.pac.nextDir={x:0,y:1} }}
              className="p-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-lg active:bg-white/[0.12]">▼</button>
            <div/>
          </div>

          <p className="text-center text-xs text-slate-500">Desktop: Arrow keys or WASD · Mobile: Swipe or D-pad</p>

          {/* Toolbar */}
          <div className="flex gap-2 justify-center mt-4">
            <button onClick={toggleFs} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all" title="Fullscreen">
              {isFs ? '⊡' : '⛶'}
            </button>
          </div>
        </div>

        {/* Right aside ad */}
        <div className="hidden lg:block w-[160px] shrink-0 sticky top-24 self-start">
          <GameAdSlot slot="4462954769" format="vertical" className="mt-2" />
        </div>
      </div>

      {/* Bottom banner ad */}
      <div className="max-w-3xl mx-auto mt-6">
        <GameAdSlot slot="8865234201" format="horizontal" />
      </div>
    </ToolLayout>
  )
}
