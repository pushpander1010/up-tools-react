import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LS = { BEST_EASY: 'ut_ms_best_easy', BEST_MED: 'ut_ms_best_med', BEST_EXP: 'ut_ms_best_exp', TIME_EASY: 'ut_ms_time_easy', TIME_MED: 'ut_ms_time_med', TIME_EXP: 'ut_ms_time_exp' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) { try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {} }
function playReveal() { playTone(600,0.06,'sine',0.05) }
function playFlag() { playTone(800,0.1,'triangle',0.06) }
function playExplosion() { playTone(80,0.4,'sawtooth',0.12); setTimeout(()=>playTone(60,0.5,'sawtooth',0.08),100); setTimeout(()=>playTone(40,0.6,'sawtooth',0.06),250) }
function playWin() { [0,100,200,300,400].forEach((d,i)=>setTimeout(()=>playTone(440+i*110,0.2,'sine',0.07),d)) }

const DIFFICULTIES = { easy:{rows:9,cols:9,mines:10,label:'Easy'}, medium:{rows:16,cols:16,mines:40,label:'Medium'}, expert:{rows:16,cols:30,mines:99,label:'Expert'} }
const NUM_COLORS = ['','#3b82f6','#22c55e','#ef4444','#7c3aed','#f59e0b','#06b6d4','#fff','#94a3b8']

function createBoard(rows, cols, mines, safeR, safeC) {
  const board = Array.from({length:rows},()=>Array.from({length:cols},()=>({mine:false,revealed:false,flagged:false,count:0})))
  let placed = 0
  while (placed < mines) {
    const r = Math.floor(Math.random()*rows), c = Math.floor(Math.random()*cols)
    if (board[r][c].mine) continue
    if (Math.abs(r-safeR)<=1 && Math.abs(c-safeC)<=1) continue
    board[r][c].mine = true
    placed++
  }
  for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) {
    if (board[r][c].mine) continue
    let cnt = 0
    for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++) {
      const nr=r+dr, nc=c+dc
      if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&board[nr][nc].mine) cnt++
    }
    board[r][c].count = cnt
  }
  return board
}

function floodReveal(board, r, c, rows, cols) {
  if (r<0||r>=rows||c<0||c>=cols) return
  if (board[r][c].revealed||board[r][c].flagged||board[r][c].mine) return
  board[r][c].revealed = true
  if (board[r][c].count===0) {
    for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++) floodReveal(board,r+dr,c+dc,rows,cols)
  }
}

function checkWin(board, rows, cols) {
  for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) {
    if (!board[r][c].mine && !board[r][c].revealed) return false
  }
  return true
}

function cloneBoard(b) { return b.map(row=>row.map(cell=>({...cell}))) }

export default function games_minesweeper() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [difficulty, setDifficulty] = useState('easy')
  const [board, setBoard] = useState(null)
  const [gameState, setGameState] = useState('idle') // idle, playing, won, lost
  const [timer, setTimer] = useState(0)
  const [firstClick, setFirstClick] = useState(true)
  const timerRef = useRef(null)
  const longPressRef = useRef(null)
  const touchStartRef = useRef(null)
  const longPressActiveRef = useRef(false)

  const { rows, cols, mines } = DIFFICULTIES[difficulty]

  useEffect(() => {
    if (gameState==='playing' && !firstClick) {
      timerRef.current = setInterval(()=>setTimer(t=>t+1),1000)
    }
    return () => clearInterval(timerRef.current)
  }, [gameState, firstClick])

  const flagCount = board ? board.flat().filter(c=>c.flagged).length : 0

  const startGame = useCallback((diff) => {
    setDifficulty(diff)
    const d = DIFFICULTIES[diff]
    setBoard(Array.from({length:d.rows},()=>Array.from({length:d.cols},()=>({mine:false,revealed:false,flagged:false,count:0}))))
    setGameState('idle')
    setFirstClick(true)
    setTimer(0)
    clearInterval(timerRef.current)
  }, [])

  const handleCellClick = useCallback((r, c) => {
    if (gameState==='won'||gameState==='lost') return
    if (!board) return
    const cell = board[r][c]
    if (cell.flagged||cell.revealed) return

    const newBoard = cloneBoard(board)

    if (firstClick) {
      const fullBoard = createBoard(rows, cols, mines, r, c)
      fullBoard[r][c].revealed = true
      floodReveal(fullBoard, r, c, rows, cols)
      setBoard(fullBoard)
      setFirstClick(false)
      setGameState('playing')
      playReveal()
      if (checkWin(fullBoard, rows, cols)) {
        setGameState('won')
        playWin()
        const bestKey = difficulty==='easy'?LS.BEST_EASY:difficulty==='medium'?LS.BEST_MED:LS.BEST_EXP
        const timeKey = difficulty==='easy'?LS.TIME_EASY:difficulty==='medium'?LS.TIME_MED:LS.TIME_EXP
        try { const prev = Number(localStorage.getItem(bestKey)||999999); if (0<prev) { localStorage.setItem(bestKey,'0'); localStorage.setItem(timeKey,'0') } } catch {}
      }
      return
    }

    if (newBoard[r][c].mine) {
      // Hit a mine
      for (let i=0;i<rows;i++) for (let j=0;j<cols;j++) newBoard[i][j].revealed = true
      setBoard(newBoard)
      setGameState('lost')
      playExplosion()
      return
    }

    floodReveal(newBoard, r, c, rows, cols)
    setBoard(newBoard)
    playReveal()

    if (checkWin(newBoard, rows, cols)) {
      setGameState('won')
      playWin()
      const bestKey = difficulty==='easy'?LS.BEST_EASY:difficulty==='medium'?LS.BEST_MED:LS.BEST_EXP
      const timeKey = difficulty==='easy'?LS.TIME_EASY:difficulty==='medium'?LS.TIME_MED:LS.TIME_EXP
      try { const prev = Number(localStorage.getItem(bestKey)||999999); if (timer<prev) { localStorage.setItem(bestKey,String(timer)); localStorage.setItem(timeKey,String(timer)) } } catch {}
    }
  }, [board, gameState, firstClick, rows, cols, mines, difficulty, timer])

  const handleFlag = useCallback((r, c, e) => {
    e.preventDefault()
    if (gameState!=='playing'&&gameState!=='idle') return
    if (!board) return
    if (board[r][c].revealed) return
    const newBoard = cloneBoard(board)
    newBoard[r][c].flagged = !newBoard[r][c].flagged
    setBoard(newBoard)
    playFlag()
  }, [board, gameState])

  const handleTouchStart = useCallback((r, c, e) => {
    touchStartRef.current = { r, c, time: Date.now() }
    longPressActiveRef.current = false
    longPressRef.current = setTimeout(() => {
      longPressActiveRef.current = true
      handleFlag(r, c, e)
      touchStartRef.current = null
    }, 500)
  }, [handleFlag])

  const handleTouchEnd = useCallback((r, c, e) => {
    clearTimeout(longPressRef.current)
    if (touchStartRef.current && !longPressActiveRef.current) {
      handleCellClick(r, c)
    }
    touchStartRef.current = null
    longPressActiveRef.current = false
  }, [handleCellClick])

  const handleContextMenu = useCallback((e) => { e.preventDefault() }, [])

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`

  const cellSize = difficulty==='easy' ? 36 : difficulty==='medium' ? 24 : 18

  return (
    <ToolLayout
      title="Minesweeper Online - Classic Puzzle Game"
      desc="Play the classic Minesweeper puzzle game online. Flag the mines, reveal safe cells, and test your logic skills across Easy, Medium, and Expert difficulties."
      icon="💣"
      iconBg="rgba(239,68,68,0.08)"
      category="fun"
      slug="games-minesweeper"
      faq={[
        { q: "How do I flag a mine?", a: "Right-click or long-press (500ms) on a cell to place or remove a flag. On mobile, tap and hold to flag." },
        { q: "What are the difficulty levels?", a: "Easy has a 9×9 grid with 10 mines, Medium is 16×16 with 40 mines, and Expert is 30×16 with 99 mines." },
        { q: "Is the first click always safe?", a: "Yes! The board is generated after your first click, so you will never hit a mine on the first click." },
        { q: "How do I win?", a: "Reveal all safe cells without clicking on any mines. You don't need to flag all mines to win." },
      ]}
      howItWorks={[
        "Click or tap a cell to reveal it. Numbers show how many mines are adjacent.",
        "Right-click or long-press to flag cells you think contain mines.",
        "Use the numbers to deduce which cells are safe and which are mines.",
        "Reveal all safe cells to win! First click is always safe.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Minesweeper Online", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/minesweeper/",
        "genre": "Puzzle", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Difficulty selector */}
        <div className="flex gap-2 justify-center flex-wrap">
          {Object.entries(DIFFICULTIES).map(([key, d]) => (
            <button key={key} onClick={() => startGame(key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${difficulty===key && (gameState!=='idle') ? 'glow-btn text-white' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1]'}`}>
              {d.label} ({d.cols}×{d.rows}, {d.mines} mines)
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div ref={resultRef} className="flex items-center justify-between px-4 py-3 glass rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-lg">💣</span>
            <span className="text-xl font-mono font-bold text-white">{mines - flagCount}</span>
          </div>
          <button onClick={() => startGame(difficulty)} className="text-3xl hover:scale-110 transition-transform cursor-pointer bg-transparent border-none">
            {gameState==='won' ? '😎' : gameState==='lost' ? '😵' : '🙂'}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">⏱️</span>
            <span className="text-xl font-mono font-bold text-white">{formatTime(timer)}</span>
          </div>
        </div>

        {/* Game board */}
        {board && (
          <div className="overflow-x-auto pb-2">
            <div className="mx-auto" style={{ display:'inline-grid', gridTemplateColumns:`repeat(${cols}, ${cellSize}px)`, gap: '2px', touchAction:'manipulation' }}
              onContextMenu={handleContextMenu}>
              {board.map((row, r) => row.map((cell, c) => (
                <div key={`${r}-${c}`}
                  className={`flex items-center justify-center font-bold select-none transition-all duration-100 ${cell.revealed ? 'bg-white/[0.04] border border-white/[0.04]' : 'bg-white/[0.08] border border-white/[0.06] hover:bg-white/[0.12] cursor-pointer'}`}
                  style={{
                    width: cellSize, height: cellSize, fontSize: Math.max(10, cellSize*0.45),
                    ...(cell.revealed && cell.mine ? { background:'rgba(239,68,68,0.25)', borderColor:'rgba(239,68,68,0.3)' } : {}),
                  }}
                  onMouseDown={(e) => { if (e.button===0) handleCellClick(r, c) }}
                  onContextMenu={(e) => handleFlag(r, c, e)}
                  onTouchStart={(e) => handleTouchStart(r, c, e)}
                  onTouchEnd={(e) => handleTouchEnd(r, c, e)}
                  onTouchCancel={() => { clearTimeout(longPressRef.current); touchStartRef.current=null; longPressActiveRef.current=false }}>
                  {cell.flagged && !cell.revealed && <span style={{fontSize:Math.max(10,cellSize*0.55)}}>🚩</span>}
                  {cell.revealed && cell.mine && <span style={{fontSize:Math.max(10,cellSize*0.55)}}>💣</span>}
                  {cell.revealed && !cell.mine && cell.count>0 && <span style={{color:NUM_COLORS[cell.count]||'#fff'}}>{cell.count}</span>}
                </div>
              )))}
            </div>
          </div>
        )}

        {/* Start screen */}
        {gameState==='idle' && !board && (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">💣</div>
            <h2 className="text-xl font-bold text-white mb-2">Minesweeper</h2>
            <p className="text-sm text-slate-400 mb-6">Select a difficulty and click a cell to start!</p>
            <button onClick={() => startGame(difficulty)} className="glow-btn px-8 py-3 text-sm">
              Start Game
            </button>
          </div>
        )}

        {/* Game over overlay */}
        {(gameState==='won'||gameState==='lost') && (
          <div className="text-center p-6 glass rounded-2xl">
            <div className="text-4xl mb-2">{gameState==='won' ? '🎉' : '💀'}</div>
            <h2 className="text-xl font-bold text-white mb-1">{gameState==='won' ? 'You Win!' : 'Game Over!'}</h2>
            <p className="text-sm text-slate-400 mb-4">{gameState==='won' ? `Completed in ${formatTime(timer)}` : 'You hit a mine!'}</p>
            <button onClick={() => startGame(difficulty)} className="glow-btn px-6 py-3 text-sm">
              Play Again
            </button>
          </div>
        )}

        <p className="text-center text-xs text-slate-500">Left-click/tap to reveal • Right-click/long-press to flag • First click is always safe</p>
      </div>
    </ToolLayout>
  )
}
