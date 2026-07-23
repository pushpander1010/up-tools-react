import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

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

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) {
  try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {}
}
function playMove() { playTone(200,0.05,'triangle',0.04) }
function playRotate() { playTone(350,0.08,'sine',0.05) }
function playDrop() { playTone(150,0.12,'square',0.04) }
function playClear(n) { for(let i=0;i<n;i++) setTimeout(()=>playTone(440+i*100,0.15,'sine',0.07), i*60) }
function playGameOver() { playTone(300,0.3,'sawtooth',0.06); setTimeout(()=>playTone(200,0.4,'sawtooth',0.05),200) }

function rotate(blocks) {
  const maxX = Math.max(...blocks.map(b=>b[0]))
  return blocks.map(([x,y]) => [maxX - y, x])
}

export default function games_tetris() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [best, setBest] = useState(() => Number(localStorage.getItem(LS.BEST)||0))
  const [lastScore, setLastScore] = useState(() => Number(localStorage.getItem(LS.LAST)||0))
  const [gameOver, setGameOver] = useState(false)
  const [nextPiece, setNextPiece] = useState(null)

  const gRef = useRef({
    board: Array.from({length:ROWS}, ()=>Array(COLS).fill(null)),
    piece: null,
    pieceX: 0, pieceY: 0,
    pieceName: '',
    next: null,
    score: 0, lines: 0, level: 1,
    dropTimer: 0,
    lastTime: 0,
    animId: null,
    dpr: 1,
    W: 0, H: 0,
    cellSz: 0,
    playing: false,
    gameOver: false,
    best: 0,
  })

  const initBoard = () => Array.from({length:ROWS}, ()=>Array(COLS).fill(null))

  const randomPiece = () => {
    const name = PIECE_NAMES[Math.floor(Math.random()*PIECE_NAMES.length)]
    return { name, blocks: SHAPES[name].blocks.map(b=>[...b]), color: SHAPES[name].color }
  }

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

  const clearLines = (board) => {
    const newBoard = board.filter(r=>r.some(c=>!c))
    const cleared = ROWS - newBoard.length
    while (newBoard.length < ROWS) newBoard.unshift(Array(COLS).fill(null))
    return { board: newBoard, cleared }
  }

  const getGhostY = (board, blocks, px, py) => {
    let gy = py
    while (!collides(board, blocks, px, gy+1)) gy++
    return gy
  }

  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const wrap = canvas.parentElement
    if (!wrap) return
    const maxW = Math.min(320, wrap.clientWidth - 16)
    const cellSz = Math.floor(maxW / COLS)
    const W = cellSz * COLS
    const H = cellSz * ROWS
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1))
    gRef.current.W = W; gRef.current.H = H; gRef.current.cellSz = cellSz; gRef.current.dpr = dpr
    canvas.width = Math.floor(W*dpr); canvas.height = Math.floor(H*dpr)
    canvas.style.width = W+'px'; canvas.style.height = H+'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr,0,0,dpr,0,0)
  }, [])

  const spawnPiece = useCallback(() => {
    const s = gRef.current
    if (s.next) {
      s.piece = s.next
    } else {
      s.piece = randomPiece()
    }
    s.next = randomPiece()
    s.pieceName = s.piece.name
    s.pieceX = Math.floor((COLS - 4) / 2)
    s.pieceY = 0
    setNextPiece({ name: s.next.name, color: s.next.color })
    if (collides(s.board, s.piece.blocks, s.pieceX, s.pieceY)) {
      // Game over
      s.gameOver = true
      setGameOver(true)
      playGameOver()
      const newBest = Math.max(s.best, s.score)
      s.best = newBest
      setBest(newBest); setLastScore(s.score)
      try { localStorage.setItem(LS.BEST, String(newBest)); localStorage.setItem(LS.LAST, String(s.score)) } catch {}
    }
  }, [])

  const startGame = useCallback(() => {
    const s = gRef.current
    s.board = initBoard()
    s.score = 0; s.lines = 0; s.level = 1; s.dropTimer = 0; s.lastTime = 0
    s.next = null; s.playing = true; s.gameOver = false
    setScore(0); setLines(0); setLevel(1); setGameOver(false); setPlaying(true)
    fitCanvas()
    spawnPiece()
    setTimeout(() => { startLoop() }, 30)
  }, [fitCanvas, spawnPiece])

  const startLoop = useCallback(() => {
    const s = gRef.current
    if (s.animId) cancelAnimationFrame(s.animId)

    const loop = (ts) => {
      const dt = ts - (s.lastTime || ts)
      s.lastTime = ts
      const dropInterval = Math.max(50, 800 - (s.level-1) * 60)

      if (s.playing && !s.gameOver && s.piece) {
        s.dropTimer += dt
        if (s.dropTimer >= dropInterval) {
          s.dropTimer = 0
          if (!collides(s.board, s.piece.blocks, s.pieceX, s.pieceY+1)) {
            s.pieceY++
          } else {
            // Lock
            s.board = lockPiece(s.board, s.piece.blocks, s.pieceX, s.pieceY, s.piece.color)
            const { board: nb, cleared } = clearLines(s.board)
            s.board = nb
            if (cleared > 0) {
              playClear(cleared)
              const pts = [0,100,300,500,800][cleared] || 0
              s.score += pts * s.level
              s.lines += cleared
              s.level = Math.floor(s.lines / 10) + 1
              setScore(s.score); setLines(s.lines); setLevel(s.level)
            } else {
              playDrop()
            }
            spawnPiece()
          }
        }
      }

      draw()
      s.animId = requestAnimationFrame(loop)
    }
    s.animId = requestAnimationFrame(loop)
  }, [spawnPiece])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = gRef.current
    const ctx = canvas.getContext('2d')
    const W = s.W, H = s.H, cs = s.cellSz

    ctx.fillStyle = '#050d1a'
    ctx.fillRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.lineWidth = 0.5
    for (let c=0;c<=COLS;c++) { ctx.beginPath(); ctx.moveTo(c*cs,0); ctx.lineTo(c*cs,H); ctx.stroke() }
    for (let r=0;r<=ROWS;r++) { ctx.beginPath(); ctx.moveTo(0,r*cs); ctx.lineTo(W,r*cs); ctx.stroke() }

    // Board
    for (let r=0;r<ROWS;r++) {
      for (let c=0;c<COLS;c++) {
        if (s.board[r][c]) {
          ctx.fillStyle = s.board[r][c]
          ctx.beginPath(); ctx.roundRect(c*cs+1, r*cs+1, cs-2, cs-2, 2); ctx.fill()
        }
      }
    }

    // Ghost piece
    if (s.piece && s.playing && !s.gameOver) {
      const gy = getGhostY(s.board, s.piece.blocks, s.pieceX, s.pieceY)
      ctx.globalAlpha = 0.2
      for (const [bx,by] of s.piece.blocks) {
        ctx.fillStyle = s.piece.color
        ctx.fillRect((s.pieceX+bx)*cs+1, (gy+by)*cs+1, cs-2, cs-2)
      }
      ctx.globalAlpha = 1
    }

    // Current piece
    if (s.piece && s.playing && !s.gameOver) {
      for (const [bx,by] of s.piece.blocks) {
        if (s.pieceY+by >= 0) {
          ctx.fillStyle = s.piece.color
          ctx.shadowColor = s.piece.color
          ctx.shadowBlur = 6
          ctx.beginPath(); ctx.roundRect((s.pieceX+bx)*cs+1, (s.pieceY+by)*cs+1, cs-2, cs-2, 2); ctx.fill()
          ctx.shadowBlur = 0
        }
      }
    }

    // Game over overlay
    if (s.gameOver) {
      ctx.fillStyle = 'rgba(5,13,26,0.85)'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 24px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('Game Over!', W/2, H/2-15)
      ctx.font = '14px system-ui'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText(`Score: ${s.score}  Lines: ${s.lines}`, W/2, H/2+10)
      ctx.fillText('Tap to restart', W/2, H/2+35)
    }

    if (!s.playing) {
      ctx.fillStyle = 'rgba(5,13,26,0.7)'
      ctx.fillRect(0,0,W,H)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 22px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('TETRIS', W/2, H/2-10)
      ctx.font = '13px system-ui'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('Press Start to play', W/2, H/2+15)
    }
  }, [])

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      const s = gRef.current
      if (s.gameOver) { if (e.key===' '||e.key==='Enter') startGame(); return }
      if (!s.playing) return
      if (!s.piece) return

      if (e.key==='ArrowLeft'||e.key==='a') {
        e.preventDefault()
        if (!collides(s.board, s.piece.blocks, s.pieceX-1, s.pieceY)) { s.pieceX--; playMove() }
      } else if (e.key==='ArrowRight'||e.key==='d') {
        e.preventDefault()
        if (!collides(s.board, s.piece.blocks, s.pieceX+1, s.pieceY)) { s.pieceX++; playMove() }
      } else if (e.key==='ArrowDown'||e.key==='s') {
        e.preventDefault()
        if (!collides(s.board, s.piece.blocks, s.pieceX, s.pieceY+1)) { s.pieceY++ }
      } else if (e.key==='ArrowUp'||e.key==='w') {
        e.preventDefault()
        const rotated = rotate(s.piece.blocks)
        if (!collides(s.board, rotated, s.pieceX, s.pieceY)) { s.piece.blocks = rotated; playRotate() }
        else if (!collides(s.board, rotated, s.pieceX-1, s.pieceY)) { s.piece.blocks = rotated; s.pieceX--; playRotate() }
        else if (!collides(s.board, rotated, s.pieceX+1, s.pieceY)) { s.piece.blocks = rotated; s.pieceX++; playRotate() }
      } else if (e.key===' ') {
        e.preventDefault()
        // Hard drop
        const gy = getGhostY(s.board, s.piece.blocks, s.pieceX, s.pieceY)
        s.pieceY = gy
        s.board = lockPiece(s.board, s.piece.blocks, s.pieceX, s.pieceY, s.piece.color)
        const {board:nb,cleared} = clearLines(s.board)
        s.board = nb
        if (cleared > 0) { playClear(cleared); s.score += [0,100,300,500,800][cleared]*s.level; s.lines += cleared; s.level = Math.floor(s.lines/10)+1; setScore(s.score); setLines(s.lines); setLevel(s.level) }
        else playDrop()
        spawnPiece()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [startGame, spawnPiece])

  // Touch
  const touchStart = useRef({x:0,y:0,time:0})
  const handlePointerDown = (e) => { touchStart.current = {x:e.clientX,y:e.clientY,time:Date.now()} }
  const handlePointerUp = (e) => {
    const s = gRef.current
    if (s.gameOver) { startGame(); return }
    if (!s.playing) return
    if (!s.piece) return
    const dx = e.clientX - touchStart.current.x
    const dy = e.clientY - touchStart.current.y
    const dt = Date.now() - touchStart.current.time
    if (Math.abs(dx)<15 && Math.abs(dy)<15 && dt<300) {
      // Tap = rotate
      const rotated = rotate(s.piece.blocks)
      if (!collides(s.board, rotated, s.pieceX, s.pieceY)) { s.piece.blocks = rotated; playRotate() }
      else if (!collides(s.board, rotated, s.pieceX-1, s.pieceY)) { s.piece.blocks = rotated; s.pieceX--; playRotate() }
      else if (!collides(s.board, rotated, s.pieceX+1, s.pieceY)) { s.piece.blocks = rotated; s.pieceX++; playRotate() }
      return
    }
    if (Math.abs(dx) > Math.abs(dy)) {
      const dir = dx > 0 ? 1 : -1
      if (!collides(s.board, s.piece.blocks, s.pieceX+dir, s.pieceY)) { s.pieceX += dir; playMove() }
    } else if (dy > 30) {
      // Hard drop
      const gy = getGhostY(s.board, s.piece.blocks, s.pieceX, s.pieceY)
      s.pieceY = gy
      s.board = lockPiece(s.board, s.piece.blocks, s.pieceX, s.pieceY, s.piece.color)
      const {board:nb,cleared} = clearLines(s.board)
      s.board = nb
      if (cleared > 0) { playClear(cleared); s.score += [0,100,300,500,800][cleared]*s.level; s.lines += cleared; s.level = Math.floor(s.lines/10)+1; setScore(s.score); setLines(s.lines); setLevel(s.level) }
      else playDrop()
      spawnPiece()
    } else if (dy < -30) {
      const rotated = rotate(s.piece.blocks)
      if (!collides(s.board, rotated, s.pieceX, s.pieceY)) { s.piece.blocks = rotated; playRotate() }
    }
  }

  useEffect(() => { fitCanvas(); draw() }, [fitCanvas, draw])
  useEffect(() => {
    const h = () => { fitCanvas(); draw() }
    window.addEventListener('resize', h)
    return () => { window.removeEventListener('resize', h); if (gRef.current.animId) cancelAnimationFrame(gRef.current.animId) }
  }, [fitCanvas, draw])

  return (
    <ToolLayout
      title="Tetris Online - Free Classic Puzzle Game"
      desc="Play Tetris online. Classic falling block puzzle with ghost piece, next preview, levels, and high score tracking."
      icon="🧩" iconBg="rgba(168,85,247,0.08)"
      category="fun" slug="games-tetris"
      faq={[
        { q: "How do I play Tetris?", a: "Use arrow keys to move/rotate pieces. Down arrow soft drops, Space hard drops. On mobile, swipe left/right to move, tap to rotate, swipe down to drop." },
        { q: "What is the ghost piece?", a: "The translucent piece showing where your current piece will land if you hard drop." },
        { q: "How is scoring calculated?", a: "1 line=100×level, 2 lines=300×level, 3 lines=500×level, 4 lines=800×level. Speed increases every 10 lines." },
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
      <div className="max-w-xl mx-auto space-y-5">
        {/* Stats */}
        <div className="glass p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white">{score}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-purple-400">{level}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-cyan-400">{lines}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Lines</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-slate-300">{best}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Best</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center items-center">
          <button onClick={startGame} className="glow-btn px-6 py-3 text-sm">
            {playing&&!gameOver?'⟲ Restart':'▶ Start'}
          </button>
          {/* Next piece preview */}
          {nextPiece && (
            <div className="glass px-4 py-2">
              <div className="text-xs text-slate-500 font-medium mb-1">Next</div>
              <div className="w-16 h-16 flex items-center justify-center">
                <div className="w-8 h-8 rounded" style={{background: nextPiece.color, boxShadow: `0 0 10px ${nextPiece.color}60`}} />
              </div>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div ref={resultRef} className="glass p-3 flex justify-center overflow-hidden">
          <canvas ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            className="rounded-xl cursor-pointer"
            style={{ background: '#050d1a', touchAction: 'none' }}
          />
        </div>

        <p className="text-center text-xs text-slate-500">
          Desktop: ←→ move, ↑ rotate, ↓ soft drop, Space hard drop | Mobile: swipe + tap
        </p>
      </div>
    </ToolLayout>
  )
}
