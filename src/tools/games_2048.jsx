import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const TILE_COLORS = {
  2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563',
  32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61',
  512: '#edc850', 1024: '#edc53f', 2048: '#edc22e',
}
const TILE_TEXT = { 2:'#776e65',4:'#776e65',8:'#f9f6f2',16:'#f9f6f2',32:'#f9f6f2',64:'#f9f6f2',128:'#f9f6f2',256:'#f9f6f2',512:'#f9f6f2',1024:'#f9f6f2',2048:'#f9f6f2' }

const LS = { STATE:'ut_2048_state_v1', BEST:'ut_2048_best', BESTT:'ut_2048_bestTile', LAST:'ut_2048_last', MOVES:'ut_2048_lastMoves' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) {
  try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {}
}
function playMove() { playTone(200,0.08,'triangle',0.06) }
function playMerge(v=440) { playTone(v,0.15,'sine',0.09); setTimeout(()=>playTone(v*1.5,0.12,'sine',0.04),30) }
function playGameOver() { playTone(300,0.3,'sawtooth',0.06); setTimeout(()=>playTone(200,0.4,'sawtooth',0.05),200) }

function emptyGrid(n=4) { return Array.from({length:n},()=>Array.from({length:n},()=>0)) }

function addRandom(grid) {
  const empties = []
  for (let r=0;r<4;r++) for (let c=0;c<4;c++) if (grid[r][c]===0) empties.push([r,c])
  if (!empties.length) return grid
  const [r,c] = empties[Math.floor(Math.random()*empties.length)]
  const ng = grid.map(row=>[...row])
  ng[r][c] = Math.random()<0.9 ? 2 : 4
  return ng
}

function canMove(grid) {
  for (let r=0;r<4;r++) for (let c=0;c<4;c++) {
    if (grid[r][c]===0) return true
    if (c+1<4 && grid[r][c]===grid[r][c+1]) return true
    if (r+1<4 && grid[r][c]===grid[r+1][c]) return true
  }
  return false
}

function slide(row) {
  let a = row.filter(v=>v!==0)
  let gained = 0
  const merged = []
  for (let i=0;i<a.length;i++) {
    if (i+1<a.length && a[i]===a[i+1]) { merged.push(a[i]*2); gained+=a[i]*2; i++ }
    else merged.push(a[i])
  }
  while (merged.length<4) merged.push(0)
  return { result: merged, gained, moved: JSON.stringify(merged)!==JSON.stringify(row) }
}

function moveGrid(grid, dir) {
  let g = grid.map(r=>[...r])
  let totalGained = 0
  let moved = false

  const process = (get,set) => {
    for (let i=0;i<4;i++) {
      const row = [0,1,2,3].map(j=>get(i,j))
      const {result,gained,moved:m} = slide(row)
      totalGained += gained
      if (m) moved = true
      for (let j=0;j<4;j++) set(i,j,result[j])
    }
  }

  if (dir==='left') process((r,c)=>g[r][c],(r,c,v)=>{g[r][c]=v})
  if (dir==='right') process((r,c)=>g[r][3-c],(r,c,v)=>{g[r][3-c]=v})
  if (dir==='up') process((r,c)=>g[c][r],(r,c,v)=>{g[c][r]=v})
  if (dir==='down') process((r,c)=>g[3-c][r],(r,c,v)=>{g[3-c][r]=v})

  return { grid: g, gained: totalGained, moved }
}

function saveLocal(state) { try { localStorage.setItem(LS.STATE, JSON.stringify(state)); localStorage.setItem(LS.BEST, String(state.best)); localStorage.setItem(LS.BESTT, String(state.bestTile)); localStorage.setItem(LS.LAST, String(state.score)); localStorage.setItem(LS.MOVES, String(state.moves)) } catch {} }
function loadLocal() { try { return JSON.parse(localStorage.getItem(LS.STATE)||'null') } catch { return null } }

export default function games_2048() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [grid, setGrid] = useState(emptyGrid)
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [best, setBest] = useState(()=>Number(localStorage.getItem(LS.BEST)||0))
  const [bestTile, setBestTile] = useState(()=>Number(localStorage.getItem(LS.BESTT)||0))
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [boardSize, setBoardSize] = useState(400)
  const boardRef = useRef(null)
  const stateRef = useRef({ grid: emptyGrid, score: 0, moves: 0, history: [] })

  const syncState = useCallback((g, s, m) => {
    stateRef.current = { ...stateRef.current, grid: g, score: s, moves: m }
    setGrid(g); setScore(s); setMoves(m)
    const biggest = Math.max(...g.flat())
    const newBest = Math.max(best, s)
    const newBestTile = Math.max(bestTile, biggest)
    setBest(newBest); setBestTile(newBestTile)
    saveLocal({ grid: g, score: s, moves: m, best: newBest, bestTile: newBestTile })
  }, [best, bestTile])

  const startNew = useCallback(() => {
    const g = addRandom(addRandom(emptyGrid()))
    syncState(g, 0, 0)
    setGameOver(false); setWon(false); setPlaying(true)
    stateRef.current.history = []
  }, [syncState])

  const continueSaved = useCallback(() => {
    const saved = loadLocal()
    if (saved) {
      syncState(saved.grid, saved.score||0, saved.moves||0)
      setGameOver(!canMove(saved.grid))
      setPlaying(true)
    } else startNew()
  }, [syncState, startNew])

  useEffect(() => { resizeBoard() }, [])

  const resizeBoard = () => {
    if (boardRef.current) {
      const w = Math.min(400, boardRef.current.parentElement.clientWidth - 32)
      setBoardSize(Math.max(280, w))
    }
  }

  useEffect(() => {
    const handler = (e) => {
      if (!playing || gameOver) return
      const dirs = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down', a:'left', d:'right', w:'up', s:'down' }
      const dir = dirs[e.key]
      if (!dir) return
      e.preventDefault()
      doMove(dir)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const doMove = useCallback((dir) => {
    const s = stateRef.current
    const { grid: ng, gained, moved } = moveGrid(s.grid, dir)
    if (!moved) return

    // Save snapshot for undo
    stateRef.current.history.push({ grid: s.grid.map(r=>[...r]), score: s.score, moves: s.moves })
    if (stateRef.current.history.length > 32) stateRef.current.history.shift()

    const newScore = s.score + gained
    const newMoves = s.moves + 1
    const g2 = addRandom(ng)
    syncState(g2, newScore, newMoves)

    playMove()
    if (gained > 0) playMerge(440 + (Math.max(...g2.flat()) % 1000) * 0.5)

    if (!canMove(g2)) {
      setGameOver(true)
      playGameOver()
    }
  }, [syncState])

  const undo = () => {
    if (!stateRef.current.history.length) return
    const prev = stateRef.current.history.pop()
    syncState(prev.grid, prev.score, prev.moves)
    setGameOver(false)
  }

  // Touch handling
  const touchStart = useRef({ x: 0, y: 0 })
  const handleTouchStart = (e) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  const handleTouchEnd = (e) => {
    if (!playing || gameOver) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return
    if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? 'right' : 'left')
    else doMove(dy > 0 ? 'down' : 'up')
  }

  const gap = 8
  const cellSize = (boardSize - gap * 5) / 4

  return (
    <ToolLayout
      title="2048 - Free Online Game (Undo, Save, Share)"
      desc="Play 2048 online. Smooth swipes & arrows, undo, auto-save, best score & best tile."
      icon="🎲" iconBg="rgba(245,158,11,0.08)"
      category="fun" slug="games-2048"
      faq={[
        { q: "How do I play 2048?", a: "Use arrow keys or swipe to slide tiles. When two tiles with the same number collide, they merge into one with their sum. Create a 2048 tile to win!" },
        { q: "Does progress save?", a: "Yes! Your game state is automatically saved. Click 'Continue' to resume where you left off." },
      ]}
      howItWorks={[
        "Use arrow keys (or WASD) to slide tiles in four directions.",
        "Matching numbers merge and add to your score.",
        "A new '2' or '4' tile appears after each move.",
        "Create a 2048 tile to win — or keep going for a higher score!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "2048", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/2048/",
        "genre": "Puzzle",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-xl mx-auto space-y-5">
        {!playing && (
          <>
            <div className="glass p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center"><div className="text-2xl font-extrabold text-white">{best}</div><div className="text-xs text-slate-500 font-medium mt-0.5">Best Score</div></div>
                <div className="text-center"><div className="text-2xl font-extrabold text-white">{bestTile}</div><div className="text-xs text-slate-500 font-medium mt-0.5">Best Tile</div></div>
                <div className="text-center"><div className="text-2xl font-extrabold text-white">{Number(localStorage.getItem(LS.LAST)||0)}</div><div className="text-xs text-slate-500 font-medium mt-0.5">Last Score</div></div>
                <div className="text-center"><div className="text-2xl font-extrabold text-white">{Number(localStorage.getItem(LS.MOVES)||0)}</div><div className="text-xs text-slate-500 font-medium mt-0.5">Last Moves</div></div>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={startNew} className="glow-btn px-6 py-3 text-sm">New Game</button>
              <button onClick={continueSaved} className="px-6 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">↩️ Continue</button>
            </div>
            <p className="text-center text-xs text-slate-500">Keyboard: ← → ↑ ↓ or swipe on mobile. Bests saved on this device.</p>
          </>
        )}

        {playing && (
          <>
            {/* Top bar */}
            <div className="flex gap-3 items-center justify-between">
              <div className="flex gap-3">
                <div className="px-4 py-2 glass text-sm font-bold text-white">{score}</div>
                <div className="px-4 py-2 glass text-sm font-bold text-slate-400">Best: {best}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={undo} disabled={!stateRef.current.history.length} className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all disabled:opacity-30">↶ Undo</button>
                <button onClick={startNew} className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">⟲ Restart</button>
                <button onClick={()=>{setPlaying(false)}} className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">⟵ Back</button>
              </div>
            </div>

            {/* Board */}
            <div ref={resultRef} className="glass p-3">
              <div className="relative mx-auto" style={{ width: boardSize, height: boardSize, background: '#0b1628', borderRadius: 12, padding: gap }}
                onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                {/* Background cells */}
                {[0,1,2,3].map(r => [0,1,2,3].map(c => (
                  <div key={`${r}-${c}`} className="absolute rounded-lg" style={{
                    left: gap + c * (cellSize + gap), top: gap + r * (cellSize + gap),
                    width: cellSize, height: cellSize, background: 'rgba(255,255,255,0.04)'
                  }}/>
                )))}

                {/* Tiles */}
                {grid.map((row, r) => row.map((val, c) => val !== 0 && (
                  <div key={`${r}-${c}-${val}`} className="absolute flex items-center justify-center rounded-lg font-bold transition-all duration-150"
                    style={{
                      left: gap + c * (cellSize + gap), top: gap + r * (cellSize + gap),
                      width: cellSize, height: cellSize,
                      background: TILE_COLORS[val] || '#3c3a32',
                      color: TILE_TEXT[val] || '#f9f6f2',
                      fontSize: Math.max(14, cellSize * 0.35),
                      boxShadow: val >= 128 ? `0 0 ${Math.min(val/50, 20)}px ${TILE_COLORS[val]}40` : 'none',
                    }}>
                    {val}
                  </div>
                )))}

                {/* Game over overlay */}
                {(gameOver || (won && grid.flat().includes(2048))) && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10">
                    <div className="text-3xl mb-2">{won ? '🎉' : '💀'}</div>
                    <h2 className="text-xl font-bold text-white mb-2">{won ? 'You Won!' : 'Game Over!'}</h2>
                    <p className="text-sm text-slate-400 mb-4">Score: {score}</p>
                    <button onClick={startNew} className="glow-btn px-6 py-3 text-sm">Try Again</button>
                  </div>
                )}
              </div>
            </div>

            <p className="text-center text-xs text-slate-500">Tip: use WASD too. Press Back to stop — progress is saved.</p>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
