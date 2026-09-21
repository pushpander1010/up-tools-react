import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const LS = { BEST: 'ut_tetris_best_v1', LAST: 'ut_tetris_last_v1', LINES: 'ut_tetris_lines_v1' }
const COLS = 10
const ROWS = 20
const SHAPES = {
  I: { blocks: [[0,0],[1,0],[2,0],[3,0]], color: '#00d4ff' },
  O: { blocks: [[0,0],[1,0],[0,1],[1,1]], color: '#ffdd57' },
  T: { blocks: [[0,0],[1,0],[2,0],[1,1]], color: '#b07dff' },
  S: { blocks: [[1,0],[2,0],[0,1],[1,1]], color: '#22c55e' },
  Z: { blocks: [[0,0],[1,0],[1,1],[2,1]], color: '#ef4444' },
  J: { blocks: [[0,0],[1,0],[2,0],[0,1]], color: '#3b82f6' },
  L: { blocks: [[0,0],[1,0],[2,0],[2,1]], color: '#f97316' },
}
const PIECE_NAMES = Object.keys(SHAPES)
const KICKS = [[0,0],[-1,0],[1,0],[0,-1],[-2,0],[2,0],[-1,-1],[1,-1]]
const LOCK_DELAY = 500
const CLEAR_ANIM_MS = 220

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) {
  try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {}
}
function playMove() { playTone(200,0.05,'triangle',0.04) }
function playRotate() { playTone(350,0.08,'sine',0.05) }
function playDrop() { playTone(150,0.12,'square',0.04) }
function playHold() { playTone(300,0.08,'sine',0.05) }
function playLevel() { [523,659,784].forEach((f,i)=>setTimeout(()=>playTone(f,0.15,'sine',0.07),i*80)) }
function playClear(n) { for(let i=0;i<Math.min(n,4);i++) setTimeout(()=>playTone(440+i*120,0.15,'sine',0.07), i*60); if(n>=4) setTimeout(()=>playTone(880,0.3,'sine',0.09),260) }
function playGameOver() { playTone(300,0.3,'sawtooth',0.06); setTimeout(()=>playTone(200,0.4,'sawtooth',0.05),200) }

function rotate(blocks) {
  const maxX = Math.max(...blocks.map(b=>b[0]))
  return blocks.map(([x,y]) => [maxX - y, x])
}

// 7-bag randomizer — fair, no long droughts
function makeBag() {
  const bag = [...PIECE_NAMES]
  for (let i=bag.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [bag[i],bag[j]]=[bag[j],bag[i]] }
  return bag
}
function pieceFromName(name) {
  return { name, blocks: SHAPES[name].blocks.map(b=>[...b]), color: SHAPES[name].color }
}

// Mini preview of the ACTUAL piece shape
function MiniPiece({ piece }) {
  if (!piece) return <div className="w-20 h-14" />
  const shape = SHAPES[piece.name] || { blocks: piece.blocks }
  const xs = shape.blocks.map(b=>b[0]), ys = shape.blocks.map(b=>b[1])
  const w = Math.max(...xs)+1, h = Math.max(...ys)+1
  const cs = piece.name==='I' ? 13 : 16
  return (
    <div className="flex items-center justify-center" style={{ width: 80, height: 56 }}>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${w}, ${cs}px)`, gap: 2 }}>
        {Array.from({length: h*w}).map((_,i) => {
          const x = i%w, y = Math.floor(i/w)
          const on = shape.blocks.some(([bx,by])=>bx===x&&by===y)
          return <div key={i} className="rounded-[3px]" style={on
            ? { width: cs, height: cs, background: piece.color, boxShadow: `0 0 8px ${piece.color}90, inset 0 1px 0 rgba(255,255,255,.5)` }
            : { width: cs, height: cs, background: 'transparent' }} />
        })}
      </div>
    </div>
  )
}

export default function games_tetris() {
  const canvasRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [combo, setCombo] = useState(-1)
  const [best, setBest] = useState(() => Number(localStorage.getItem(LS.BEST)||0))
  const [lastScore, setLastScore] = useState(() => Number(localStorage.getItem(LS.LAST)||0))
  const [gameOver, setGameOver] = useState(false)
  const [nextPiece, setNextPiece] = useState(null)
  const [holdPiece, setHoldPiece] = useState(null)

  const gRef = useRef({
    board: Array.from({length:ROWS}, ()=>Array(COLS).fill(null)),
    bag: [], piece: null, pieceX: 0, pieceY: 0, pieceName: '',
    next: null, hold: null, canHold: true,
    score: 0, lines: 0, level: 1, combo: -1,
    dropTimer: 0, lockTimer: 0, lockResets: 0,
    softDrop: false, heldDir: 0, dasTimer: 0, arrTimer: 0,
    clearing: null, // {rows:[...], t}
    particles: [], texts: [], shake: 0,
    banner: null, // {text, t}
    paused: false, playing: false, gameOver: false, best: 0,
    lastTime: 0, animId: null, dpr: 1, W: 0, H: 0, cellSz: 0,
    stars: Array.from({length:40},()=>({x:Math.random(),y:Math.random(),s:Math.random()*1.6+0.4,v:Math.random()*0.02+0.005})),
  })

  const initBoard = () => Array.from({length:ROWS}, ()=>Array(COLS).fill(null))

  const drawPiece = () => { const s = gRef.current; return { name: s.next?.name, color: s.next?.color } }

  const collides = (board, blocks, px, py) => {
    for (const [bx,by] of blocks) {
      const nx = px+bx, ny = py+by
      if (nx<0||nx>=COLS||ny>=ROWS) return true
      if (ny>=0 && board[ny][nx]) return true
    }
    return false
  }

  const lockPiece = (board, blocks, px, py, color) => {
    const nb = board.map(r=>[...r])
    for (const [bx,by] of blocks) {
      const ny = py+by, nx = px+bx
      if (ny>=0 && ny<ROWS && nx>=0 && nx<COLS) nb[ny][nx] = color
    }
    return nb
  }

  const getGhostY = (board, blocks, px, py) => {
    let gy = py
    while (!collides(board, blocks, px, gy+1)) gy++
    return gy
  }

  const dropInterval = (level) => Math.max(50, Math.round(800 * Math.pow(0.85, level-1)))

  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const wrap = canvas.parentElement
    if (!wrap) return
    const maxW = Math.min(wrap.clientWidth - 16, window.innerWidth - 32)
    const maxH = Math.min(window.innerHeight - 200, (window.__utBoardH || 1e9))
    const cellSz = Math.max(10, Math.min(Math.floor(maxW / COLS), Math.floor(maxH / ROWS)))
    const W = cellSz * COLS
    const H = cellSz * ROWS
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1))
    gRef.current.W = W; gRef.current.H = H; gRef.current.cellSz = cellSz; gRef.current.dpr = dpr
    canvas.width = Math.floor(W*dpr); canvas.height = Math.floor(H*dpr)
    canvas.style.width = W+'px'; canvas.style.height = H+'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr,0,0,dpr,0,0)
  }, [])

  const burst = useCallback((cx, cy, color, n=14, spread=3.2) => {
    const s = gRef.current
    for (let i=0;i<n;i++) {
      const a = Math.random()*Math.PI*2, sp = Math.random()*spread+0.6
      s.particles.push({ x: cx, y: cy, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp-1.2, life: 1, color, sz: Math.random()*3+2 })
    }
    if (s.particles.length > 400) s.particles.splice(0, s.particles.length-400)
  }, [])

  const floatText = useCallback((text, x, y, color='#fff', size=16) => {
    const s = gRef.current
    s.texts.push({ text, x, y, color, size, life: 1 })
  }, [])

  const spawnPiece = useCallback(() => {
    const s = gRef.current
    if (s.bag.length === 0) s.bag = makeBag()
    if (!s.next) {
      if (s.bag.length === 0) s.bag = makeBag()
      s.piece = pieceFromName(s.bag.pop())
    } else {
      s.piece = s.next
    }
    if (s.bag.length === 0) s.bag = makeBag()
    s.next = pieceFromName(s.bag.pop())
    s.pieceName = s.piece.name
    s.pieceX = Math.floor((COLS - (Math.max(...s.piece.blocks.map(b=>b[0]))+1)) / 2)
    s.pieceY = 0
    s.dropTimer = 0; s.lockTimer = 0; s.lockResets = 0
    s.canHold = true
    setNextPiece({ name: s.next.name, color: s.next.color })
    if (collides(s.board, s.piece.blocks, s.pieceX, s.pieceY)) {
      s.gameOver = true
      setGameOver(true)
      playGameOver()
      s.shake = 10
      const newBest = Math.max(s.best, s.score)
      s.best = newBest
      setBest(newBest); setLastScore(s.score)
      try { localStorage.setItem(LS.BEST, String(newBest)); localStorage.setItem(LS.LAST, String(s.score)); localStorage.setItem(LS.LINES, String(s.lines)) } catch {}
    }
  }, [])

  const startGame = useCallback(() => {
    const s = gRef.current
    s.board = initBoard()
    s.bag = makeBag()
    s.score = 0; s.lines = 0; s.level = 1; s.combo = -1
    s.dropTimer = 0; s.lockTimer = 0; s.lastTime = 0
    s.next = pieceFromName(s.bag.pop())
    s.hold = null; s.canHold = true
    s.clearing = null; s.particles = []; s.texts = []; s.shake = 0; s.banner = null
    s.softDrop = false; s.heldDir = 0
    s.paused = false; s.playing = true; s.gameOver = false
    setScore(0); setLines(0); setLevel(1); setCombo(-1); setGameOver(false); setPlaying(true); setPaused(false)
    setHoldPiece(null)
    fitCanvas()
    spawnPiece()
    setTimeout(() => { startLoop() }, 30)
  }, [fitCanvas, spawnPiece])

  const tryMove = useCallback((dx, dy) => {
    const s = gRef.current
    if (!s.piece || !s.playing || s.gameOver || s.paused || s.clearing) return false
    if (!collides(s.board, s.piece.blocks, s.pieceX+dx, s.pieceY+dy)) {
      s.pieceX += dx; s.pieceY += dy
      if (dx !== 0 && collides(s.board, s.piece.blocks, s.pieceX, s.pieceY+1) && s.lockResets < 15) {
        s.lockTimer = 0; s.lockResets++
      }
      return true
    }
    return false
  }, [])

  const tryRotate = useCallback(() => {
    const s = gRef.current
    if (!s.piece || !s.playing || s.gameOver || s.paused || s.clearing) return
    const rotated = rotate(s.piece.blocks)
    for (const [kx,ky] of KICKS) {
      if (!collides(s.board, rotated, s.pieceX+kx, s.pieceY+ky)) {
        s.piece.blocks = rotated; s.pieceX += kx; s.pieceY += ky
        if (collides(s.board, s.piece.blocks, s.pieceX, s.pieceY+1) && s.lockResets < 15) {
          s.lockTimer = 0; s.lockResets++
        }
        playRotate()
        return
      }
    }
  }, [])

  const doHold = useCallback(() => {
    const s = gRef.current
    if (!s.piece || !s.canHold || !s.playing || s.gameOver || s.paused || s.clearing) return
    playHold()
    const cur = { name: s.pieceName, color: s.piece.color }
    if (s.hold) {
      const h = s.hold
      s.hold = cur
      s.piece = pieceFromName(h.name)
      s.pieceName = h.name
    } else {
      s.hold = cur
      if (s.bag.length === 0) s.bag = makeBag()
      s.piece = pieceFromName(s.bag.pop())
      if (s.bag.length === 0) s.bag = makeBag()
      s.next = pieceFromName(s.bag.pop())
      setNextPiece({ name: s.next.name, color: s.next.color })
    }
    s.pieceX = Math.floor((COLS - (Math.max(...s.piece.blocks.map(b=>b[0]))+1)) / 2)
    s.pieceY = 0; s.dropTimer = 0; s.lockTimer = 0; s.lockResets = 0
    s.canHold = false
    setHoldPiece({ ...s.hold })
    burst(2, 2, '#a78bfa', 10, 2)
  }, [burst])

  const hardDrop = useCallback(() => {
    const s = gRef.current
    if (!s.piece || !s.playing || s.gameOver || s.paused || s.clearing) return
    const gy = getGhostY(s.board, s.piece.blocks, s.pieceX, s.pieceY)
    const dist = gy - s.pieceY
    s.pieceY = gy
    s.score += dist * 2
    setScore(s.score)
    // landing dust
    const cs = s.cellSz || 20
    for (const [bx] of s.piece.blocks) burst((s.pieceX+bx+0.5)*cs, (gy+1)*cs, s.piece.color, 3, 1.6)
    s.shake = Math.max(s.shake, Math.min(6, 2 + dist*0.25))
    lockAndClear()
    playDrop()
  }, [])

  const lockAndClear = useCallback(() => {
    const s = gRef.current
    if (!s.piece) return
    s.board = lockPiece(s.board, s.piece.blocks, s.pieceX, s.pieceY, s.piece.color)
    const rows = []
    s.board.forEach((r,i) => { if (r.every(c=>c)) rows.push(i) })
    if (rows.length > 0) {
      s.clearing = { rows, t: 0 }
      playClear(rows.length)
      s.shake = Math.max(s.shake, rows.length >= 4 ? 9 : rows.length*2)
    } else {
      s.combo = -1; setCombo(-1)
      playDropSoft()
      spawnPiece()
    }
    function playDropSoft() { try { playTone(150,0.08,'square',0.03) } catch {} }
  }, [spawnPiece])

  const finishClear = useCallback(() => {
    const s = gRef.current
    const rows = s.clearing.rows
    const cleared = rows.length
    // particle celebration across cleared rows
    const cs = s.cellSz || 20
    rows.forEach(r => { for (let c=0;c<COLS;c+=2) burst((c+0.5)*cs, (r+0.5)*cs, s.board[r][c] || '#fff', 2, 2.4) })
    const kept = s.board.filter((_,i)=>!rows.includes(i))
    while (kept.length < ROWS) kept.unshift(Array(COLS).fill(null))
    s.board = kept
    const pts = [0,100,300,500,800][cleared] || 0
    s.combo = (s.combo < 0 ? 0 : s.combo+1)
    const comboBonus = s.combo > 0 ? s.combo*50*s.level : 0
    s.score += pts * s.level + comboBonus
    s.lines += cleared
    const nl = Math.floor(s.lines / 10) + 1
    if (nl !== s.level) {
      s.level = nl
      s.banner = { text: `LEVEL ${nl}!`, t: 0 }
      playLevel()
    }
    setScore(s.score); setLines(s.lines); setLevel(s.level); setCombo(s.combo)
    const labels = ['','SINGLE','DOUBLE','TRIPLE','TETRIS!']
    floatText(`+${pts*s.level + comboBonus}`, s.W/2, s.H - rows[0]*(s.cellSz||20) - 20, cleared>=4 ? '#ffd54a' : '#fff', cleared>=4 ? 26 : 18)
    if (cleared >= 2) floatText(labels[cleared], s.W/2, s.H - rows[0]*(s.cellSz||20) - 48, '#22d3ee', 15)
    if (s.combo > 0) floatText(`COMBO x${s.combo+1}`, s.W/2, s.H - rows[0]*(s.cellSz||20) - 70, '#f0abfc', 14)
    s.clearing = null
    spawnPiece()
  }, [burst, floatText, spawnPiece])

  const startLoop = useCallback(() => {
    const s = gRef.current
    if (s.animId) cancelAnimationFrame(s.animId)

    const loop = (ts) => {
      const dt = Math.min(100, ts - (s.lastTime || ts))
      s.lastTime = ts

      if (s.playing && !s.gameOver && !s.paused) {
        // line-clear flash animation pauses gravity briefly
        if (s.clearing) {
          s.clearing.t += dt
          if (s.clearing.t >= CLEAR_ANIM_MS) finishClear()
        } else if (s.piece) {
          // DAS auto-shift for held left/right
          if (s.heldDir !== 0) {
            s.dasTimer += dt
            if (s.dasTimer >= 150) {
              s.arrTimer += dt
              while (s.arrTimer >= 45) {
                s.arrTimer -= 45
                if (!tryMove(s.heldDir, 0)) break
                else playMove()
              }
            }
          }
          const interval = s.softDrop ? Math.min(50, Math.floor(dropInterval(s.level)/20)) : dropInterval(s.level)
          const grounded = collides(s.board, s.piece.blocks, s.pieceX, s.pieceY+1)
          if (!grounded) {
            s.lockTimer = 0
            s.dropTimer += dt
            while (s.dropTimer >= interval) {
              s.dropTimer -= interval
              s.pieceY++
              if (s.softDrop) { s.score += 1; setScore(s.score) }
              if (collides(s.board, s.piece.blocks, s.pieceX, s.pieceY+1)) break
            }
          } else {
            // lock delay — piece rests, player can still slide/rotate
            s.lockTimer += dt
            if (s.lockTimer >= LOCK_DELAY) {
              s.lockTimer = 0
              lockAndClear()
            }
          }
        }
        // decay shake, age particles/texts/banner
        s.shake = Math.max(0, s.shake - dt*0.03)
        for (const p of s.particles) { p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life -= dt/700 }
        s.particles = s.particles.filter(p=>p.life>0)
        for (const t of s.texts) { t.y -= dt*0.05; t.life -= dt/1100 }
        s.texts = s.texts.filter(t=>t.life>0)
        if (s.banner) { s.banner.t += dt; if (s.banner.t > 1400) s.banner = null }
        for (const st of s.stars) { st.y += st.v*dt/16; if (st.y > 1) { st.y = 0; st.x = Math.random() } }
      }

      draw()
      s.animId = requestAnimationFrame(loop)
    }
    s.animId = requestAnimationFrame(loop)
  }, [finishClear, lockAndClear, tryMove])

  function drawBlock(ctx, x, y, cs, color, glow=false) {
    const g = ctx.createLinearGradient(x, y, x, y+cs)
    g.addColorStop(0, '#ffffff55')
    g.addColorStop(0.25, color)
    g.addColorStop(1, color)
    ctx.fillStyle = g
    if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 10 }
    ctx.beginPath(); ctx.roundRect(x+1, y+1, cs-2, cs-2, Math.max(2, cs*0.14)); ctx.fill()
    ctx.shadowBlur = 0
    // gloss highlight
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.beginPath(); ctx.roundRect(x+cs*0.14, y+cs*0.1, cs*0.72, cs*0.2, cs*0.1); ctx.fill()
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = gRef.current
    const ctx = canvas.getContext('2d')
    const W = s.W, H = s.H, cs = s.cellSz
    if (!W || !cs) return

    ctx.save()
    // screen shake
    if (s.shake > 0.2) ctx.translate((Math.random()-0.5)*s.shake, (Math.random()-0.5)*s.shake)

    // bg gradient + drifting stars
    const bg = ctx.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0, '#0a1430')
    bg.addColorStop(0.6, '#050d1a')
    bg.addColorStop(1, '#0b0618')
    ctx.fillStyle = bg
    ctx.fillRect(-12, -12, W+24, H+24)
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    for (const st of s.stars) ctx.fillRect(st.x*W, st.y*H, st.s, st.s)

    // playfield panel glow border (color shifts with level)
    const hue = (260 + s.level*18) % 360
    ctx.strokeStyle = `hsla(${hue},90%,65%,0.55)`
    ctx.lineWidth = 2
    ctx.shadowColor = `hsla(${hue},90%,65%,0.8)`
    ctx.shadowBlur = 14
    ctx.strokeRect(1, 1, W-2, H-2)
    ctx.shadowBlur = 0

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    ctx.lineWidth = 0.5
    for (let c=1;c<COLS;c++) { ctx.beginPath(); ctx.moveTo(c*cs,0); ctx.lineTo(c*cs,H); ctx.stroke() }
    for (let r=1;r<ROWS;r++) { ctx.beginPath(); ctx.moveTo(0,r*cs); ctx.lineTo(W,r*cs); ctx.stroke() }

    // Board blocks
    const flashRows = s.clearing ? s.clearing.rows : []
    const flash = s.clearing ? Math.abs(Math.sin(s.clearing.t/40)) : 0
    for (let r=0;r<ROWS;r++) {
      for (let c=0;c<COLS;c++) {
        if (s.board[r][c]) {
          if (flashRows.includes(r)) {
            ctx.fillStyle = `rgba(255,255,255,${0.4+flash*0.6})`
            ctx.fillRect(c*cs+1, r*cs+1, cs-2, cs-2)
          } else {
            drawBlock(ctx, c*cs, r*cs, cs, s.board[r][c])
          }
        }
      }
    }

    // Ghost piece (dashed outline)
    if (s.piece && s.playing && !s.gameOver && !s.clearing) {
      const gy = getGhostY(s.board, s.piece.blocks, s.pieceX, s.pieceY)
      ctx.save()
      ctx.globalAlpha = 0.35
      ctx.strokeStyle = s.piece.color
      ctx.lineWidth = 1.5
      ctx.setLineDash([4,3])
      for (const [bx,by] of s.piece.blocks) {
        if (s.pieceY+by >= 0) ctx.strokeRect((s.pieceX+bx)*cs+2.5, (gy+by)*cs+2.5, cs-5, cs-5)
      }
      ctx.restore()
    }

    // Current piece (glow + lock-delay pulse when about to lock)
    if (s.piece && s.playing && !s.gameOver) {
      const locking = collides(s.board, s.piece.blocks, s.pieceX, s.pieceY+1)
      const pulse = locking ? 6 + Math.sin(Date.now()/90)*3 : 8
      for (const [bx,by] of s.piece.blocks) {
        if (s.pieceY+by >= 0) {
          ctx.shadowColor = s.piece.color
          ctx.shadowBlur = pulse
          drawBlock(ctx, (s.pieceX+bx)*cs, (s.pieceY+by)*cs, cs, s.piece.color)
          ctx.shadowBlur = 0
        }
      }
    }

    // Particles
    for (const p of s.particles) {
      ctx.globalAlpha = Math.max(0, p.life)
      ctx.fillStyle = p.color
      ctx.fillRect(p.x, p.y, p.sz, p.sz)
    }
    ctx.globalAlpha = 1

    // Floating texts
    ctx.textAlign = 'center'
    for (const t of s.texts) {
      ctx.globalAlpha = Math.max(0, Math.min(1, t.life*1.5))
      ctx.font = `bold ${t.size}px system-ui`
      ctx.shadowColor = t.color; ctx.shadowBlur = 12
      ctx.fillStyle = t.color
      ctx.fillText(t.text, t.x, t.y)
      ctx.shadowBlur = 0
    }
    ctx.globalAlpha = 1

    // Level-up banner
    if (s.banner) {
      const a = s.banner.t < 200 ? s.banner.t/200 : s.banner.t > 1000 ? Math.max(0, 1-(s.banner.t-1000)/400) : 1
      ctx.globalAlpha = a
      ctx.fillStyle = 'rgba(5,13,26,0.75)'
      ctx.fillRect(0, H/2-34, W, 68)
      ctx.font = 'bold 30px system-ui'
      ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 18
      ctx.fillStyle = '#fff'
      ctx.fillText(s.banner.text, W/2, H/2+10)
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
    }

    // Paused overlay
    if (s.paused && s.playing && !s.gameOver) {
      ctx.fillStyle = 'rgba(5,13,26,0.7)'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 26px system-ui'
      ctx.fillText('PAUSED', W/2, H/2-5)
      ctx.font = '13px system-ui'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('Press P to resume', W/2, H/2+20)
    }

    // Game over overlay
    if (s.gameOver) {
      ctx.fillStyle = 'rgba(5,13,26,0.88)'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 26px system-ui'
      ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 16
      ctx.fillText('Game Over!', W/2, H/2-15)
      ctx.shadowBlur = 0
      ctx.font = '14px system-ui'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText(`Score: ${s.score}  Lines: ${s.lines}`, W/2, H/2+10)
      ctx.fillText('Tap to restart', W/2, H/2+35)
    }

    if (!s.playing) {
      ctx.fillStyle = 'rgba(5,13,26,0.72)'
      ctx.fillRect(0,0,W,H)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 30px system-ui'
      ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 20
      ctx.fillText('TETRIS', W/2, H/2-10)
      ctx.shadowBlur = 0
      ctx.font = '13px system-ui'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('Press Start to play', W/2, H/2+15)
    }
    ctx.restore()
  }, [])

  // Keyboard (with DAS + soft-drop hold + hold + pause)
  useEffect(() => {
    const down = (e) => {
      const s = gRef.current
      if (['ArrowLeft','ArrowRight','ArrowDown','ArrowUp',' '].includes(e.key)) e.preventDefault()
      if (e.repeat) {
        if ((e.key==='ArrowDown'||e.key==='s')) s.softDrop = true
        return
      }
      if (s.gameOver) { if (e.key===' '||e.key==='Enter') window.dispatchEvent(new Event('ut:game-start')); return }
      if (!s.playing) { window.dispatchEvent(new Event('ut:game-start')); return }
      if (!s.piece) return
      if (e.key==='p' || e.key==='P') {
        s.paused = !s.paused
        setPaused(s.paused)
        return
      }
      if (s.paused) return
      if (e.key==='ArrowLeft'||e.key==='a') {
        if (tryMove(-1,0)) playMove()
        s.heldDir = -1; s.dasTimer = 0; s.arrTimer = 0
      } else if (e.key==='ArrowRight'||e.key==='d') {
        if (tryMove(1,0)) playMove()
        s.heldDir = 1; s.dasTimer = 0; s.arrTimer = 0
      } else if (e.key==='ArrowDown'||e.key==='s') {
        s.softDrop = true
        tryMove(0,1)
      } else if (e.key==='ArrowUp'||e.key==='w') {
        tryRotate()
      } else if (e.key===' ') {
        hardDrop()
      } else if (e.key==='c'||e.key==='C'||e.key==='Shift') {
        doHold()
      }
    }
    const up = (e) => {
      const s = gRef.current
      if (e.key==='ArrowLeft'||e.key==='a') { if (s.heldDir===-1) s.heldDir = 0 }
      if (e.key==='ArrowRight'||e.key==='d') { if (s.heldDir===1) s.heldDir = 0 }
      if (e.key==='ArrowDown'||e.key==='s') s.softDrop = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [tryMove, tryRotate, hardDrop, doHold])

  // Touch
  const touchStart = useRef({x:0,y:0,time:0})

  const handlePointerDown = (e) => { touchStart.current = {x:e.clientX,y:e.clientY,time:Date.now()} }
  const handlePointerUp = (e) => {
    const s = gRef.current
    if (s.gameOver) { window.dispatchEvent(new Event('ut:game-start')); return }
    if (!s.playing) { window.dispatchEvent(new Event('ut:game-start')); return }
    if (!s.piece || s.paused) return
    const dx = e.clientX - touchStart.current.x
    const dy = e.clientY - touchStart.current.y
    const dt = Date.now() - touchStart.current.time
    if (Math.abs(dx)<15 && Math.abs(dy)<15 && dt<300) {
      tryRotate()
      return
    }
    if (Math.abs(dx) > Math.abs(dy)) {
      const dir = dx > 0 ? 1 : -1
      const steps = Math.min(4, Math.floor(Math.abs(dx)/25))
      for (let i=0;i<steps;i++) if (!tryMove(dir,0)) break
      playMove()
    } else if (dy > 60) {
      hardDrop() // long swipe down = hard drop
    } else if (dy > 20) {
      for (let i=0;i<4;i++) if (!tryMove(0,1)) break // short swipe = soft nudge
    } else if (dy < -30) {
      tryRotate()
    }
  }

  const btn = (label, action, bg) => (
    <button
      onPointerDown={(e)=>{e.preventDefault(); action()}}
      className="rounded-xl font-bold text-white select-none"
      style={{ background: bg, minWidth: 52, height: 44, fontSize: 18, touchAction: 'none' }}
    >{label}</button>
  )

  useEffect(() => { fitCanvas(); draw() }, [fitCanvas, draw])
  useEffect(() => {
    const h = () => { fitCanvas(); draw() }
    window.addEventListener('resize', h)
    window.addEventListener('ut:board-h', h)
    const blur = () => { const s = gRef.current; if (s.playing && !s.gameOver) { s.paused = true; setPaused(true) } }
    window.addEventListener('blur', blur)
    return () => { window.removeEventListener('resize', h); window.removeEventListener('ut:board-h', h); window.removeEventListener('blur', blur); if (gRef.current.animId) cancelAnimationFrame(gRef.current.animId) }
  }, [fitCanvas, draw])


  return (
    <GameShell
      name="TETRIS"
      startAction={startGame} startLabel="▶ Start"
      title="Tetris Online - Free Classic Puzzle Game"
      desc="Tetris Online - Free Classic Puzzle Game - play Tetris online. Classic falling block, online free. Play online free, no download. Works on mobile and desktop."
      icon="🧩" iconBg="rgba(168,85,247,0.08)"
      category="fun" slug="games-tetris"
      faq={[
        { q: "How do I play Tetris?", a: "Use arrow keys to move/rotate pieces. Down arrow soft drops, Space hard drops. On mobile, swipe left/right to move, tap to rotate, swipe down to drop." },
        { q: "What is the ghost piece?", a: "The translucent piece showing where your current piece will land if you hard drop." },
        { q: "How is scoring calculated?", a: "1 line=100×level, 2 lines=300×level, 3 lines=500×level, 4 lines=800×level. Speed increases every 10 lines." },
        { q: "Can I play Tetris Online - Free Classic Puzzle Game without downloading?", a: "Yes. This Tetris Online - Free Classic Puzzle Game runs in your browser with no install. Free on mobile and desktop." },
        { q: "How do I use this Tetris Online - Free Classic Puzzle Game online free?", a: "Open the game above and press Start. Free with no login, works on mobile and desktop." },
        { q: "Is this Tetris Online - Free Classic Puzzle Game free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        "Arrow keys to move, Up to rotate, Down for soft drop, Space for hard drop.",
        "Mobile: Swipe left/right, tap to rotate, swipe down to drop.",
        "Clear lines to score points. 4 lines at once is a Tetris for 800×level!",
        "Speed increases every 10 lines cleared. How far can you go?",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Tetris Online", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/tetris/",
        "genre": "Puzzle",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="flex gap-4 max-w-6xl mx-auto overflow-hidden">
        <div className="flex-1 min-w-0 max-w-xl mx-auto space-y-5 overflow-hidden">
        {/* Stats */}
        <div className="glass p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white">{score}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-purple-400">{level}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-cyan-400">{lines}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Lines</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-slate-300">{best}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Best</div>
            </div>
          </div>
          {combo > 0 && (
            <div className="text-center mt-1 text-sm font-bold text-fuchsia-400 animate-pulse">🔥 COMBO x{combo+1}</div>
          )}
        </div>

        {/* Hold + Next previews (actual shapes) */}
        <div className="flex gap-3 justify-center items-stretch">
          <div className="glass px-4 py-2">
            <div className="text-xs text-slate-400 font-medium mb-1 text-center">Hold (C)</div>
            {holdPiece ? <MiniPiece piece={holdPiece} /> : <div className="flex items-center justify-center text-slate-600 text-xs" style={{ width: 80, height: 56 }}>empty</div>}
          </div>
          <div className="glass px-4 py-2" style={{ borderColor: 'rgba(34,211,238,0.35)', boxShadow: '0 0 16px rgba(34,211,238,0.15)' }}>
            <div className="text-xs text-cyan-300 font-bold mb-1 text-center">⬇ NEXT</div>
            {nextPiece ? <MiniPiece piece={nextPiece} /> : <div className="flex items-center justify-center text-slate-600 text-xs" style={{ width: 80, height: 56 }}>…</div>}
          </div>
          <div className="glass px-4 py-2 flex flex-col justify-center">
            <div className="text-xs text-slate-400 font-medium mb-1 text-center">Speed</div>
            <div className="text-center text-lg font-extrabold text-emerald-400">{(dropInterval(level)/1000).toFixed(2)}s</div>
            {paused && <div className="text-center text-xs font-bold text-amber-400 mt-1">PAUSED</div>}
          </div>
        </div>

        {/* Canvas */}
        <div className="glass p-3 flex justify-center overflow-hidden">
          <canvas ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            className="rounded-xl cursor-pointer"
            style={{ background: '#050d1a', touchAction: 'none' }}
          />
        </div>

        {/* Touch controls */}
        <div className="flex gap-2 justify-center md:hidden">
          {btn('◀', () => { if (tryMove(-1,0)) playMove() }, '#1e293b')}
          {btn('▶', () => { if (tryMove(1,0)) playMove() }, '#1e293b')}
          {btn('▼', () => tryMove(0,1), '#1e293b')}
          {btn('⟳', () => tryRotate(), '#7c3aed')}
          {btn('⤓', () => hardDrop(), '#0891b2')}
          {btn('H', () => doHold(), '#475569')}
        </div>

        <p className="text-center text-xs text-slate-400">
          Desktop: ←→ move (hold for auto), ↑ rotate, ↓ hold = fast drop, Space hard drop, C hold, P pause | Mobile: swipe + tap + buttons
        </p>
      </div>
      </div>
    </GameShell>
  )
}
