import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

/* ─── Sudoku Engine (ported from super-sudoku) ─── */
const NUMBERS = [1,2,3,4,5,6,7,8,9]

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row][i] === num) return false
    if (i !== row && board[i][col] === num) return false
  }
  const sr = Math.floor(row/3)*3, sc = Math.floor(col/3)*3
  for (let r = sr; r < sr+3; r++)
    for (let c = sc; c < sc+3; c++)
      if ((r!==row||c!==col) && board[r][c] === num) return false
  return true
}

function solve(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const shuffled = [...NUMBERS].sort(() => Math.random()-0.5)
        for (const n of shuffled) {
          if (isValid(board, r, c, n)) {
            board[r][c] = n
            if (solve(board)) return true
            board[r][c] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

function generateSolved() {
  const board = Array.from({length:9}, ()=>Array(9).fill(0))
  solve(board)
  return board
}

function countSolutions(board, limit=2) {
  let count = 0
  const b = board.map(r=>[...r])
  function solveCount() {
    if (count >= limit) return
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (b[r][c] === 0) {
          for (const n of NUMBERS) {
            if (isValid(b, r, c, n)) {
              b[r][c] = n
              solveCount()
              b[r][c] = 0
              if (count >= limit) return
            }
          }
          return
        }
      }
    }
    count++
  }
  solveCount()
  return count
}

const DIFFICULTY = { easy:36, medium:45, hard:52, expert:58 }

function generatePuzzle(difficulty) {
  const solved = generateSolved()
  const puzzle = solved.map(r=>[...r])
  const cellsToRemove = DIFFICULTY[difficulty] || 45
  const positions = []
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) positions.push([r,c])
  positions.sort(()=>Math.random()-0.5)
  let removed = 0
  for (const [r,c] of positions) {
    if (removed >= cellsToRemove) break
    const backup = puzzle[r][c]
    puzzle[r][c] = 0
    if (countSolutions(puzzle) === 1) {
      removed++
    } else {
      puzzle[r][c] = backup
    }
  }
  return { puzzle, solution: solved }
}

/* ─── Audio ─── */
let audioCtx = null
function ensureAudio() { if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(f,d,t='sine',v=0.06) { try{const ctx=ensureAudio();const o=ctx.createOscillator();const g=ctx.createGain();o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+d);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+d)}catch{} }
function playPlace() { playTone(440,0.08,'sine',0.05) }
function playError() { playTone(200,0.15,'sawtooth',0.04) }
function playWin() { playTone(523,0.15,'sine',0.08); setTimeout(()=>playTone(659,0.15,'sine',0.08),100); setTimeout(()=>playTone(784,0.2,'sine',0.1),200) }

const LS = { BEST: 'ut_sudoku_best_v1' }

export default function games_super_sudoku() {
  const canvasRef = useRef(null)
  const [difficulty, setDifficulty] = useState('medium')
  const [puzzle, setPuzzle] = useState(null)
  const [solution, setSolution] = useState(null)
  const [board, setBoard] = useState(null)
  const [initial, setInitial] = useState(null)
  const [notes, setNotes] = useState(null)
  const [selected, setSelected] = useState(null)
  const [notesMode, setNotesMode] = useState(false)
  const [errors, setErrors] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [timer, setTimer] = useState(0)
  const [bestTime, setBestTime] = useState(()=>{try{return JSON.parse(localStorage.getItem(LS.BEST)||'{}')}catch{return {}}})
  const [gameStarted, setGameStarted] = useState(false)


  const timerRef = useRef(null)
  const gRef = useRef({ selected: null, board: null, notes: null, initial: null, solution: null })

  useEffect(() => {
    gRef.current = { selected, board, notes, initial, solution }
  }, [selected, board, notes, initial, solution])

  const startGame = useCallback(() => {
    const { puzzle: p, solution: s } = generatePuzzle(difficulty)
    const b = p.map(r=>[...r])
    const init = p.map(r=>r.map(v=>v!==0))
    const n = Array.from({length:9}, ()=>Array.from({length:9}, ()=>new Set()))
    setPuzzle(p); setSolution(s); setBoard(b); setInitial(init); setNotes(n)
    setSelected(null); setErrors(0); setCompleted(false); setTimer(0); setGameStarted(true)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(()=>setTimer(t=>t+1), 1000)
  }, [difficulty])

  useEffect(() => { if(completed && timerRef.current) clearInterval(timerRef.current) }, [completed])

  useEffect(() => { return ()=>{ if(timerRef.current) clearInterval(timerRef.current) } }, [])

  const placeNumber = useCallback((num) => {
    const s = gRef.current
    if (!s.selected || !s.board || !s.initial || s.completed) return
    const [r,c] = s.selected
    if (s.initial[r][c]) return
    const newBoard = s.board.map(row=>[...row])
    const newNotes = s.notes.map(row=>row.map(n=>new Set(n)))

    if (notesMode) {
      if (num === 0) { newNotes[r][c].clear() }
      else {
        if (newNotes[r][c].has(num)) newNotes[r][c].delete(num)
        else newNotes[r][c].add(num)
      }
      newBoard[r][c] = 0
      playPlace()
    } else {
      newNotes[r][c].clear()
      if (num === 0) {
        newBoard[r][c] = 0
      } else {
        const isCorrect = s.solution && s.solution[r][c] === num
        newBoard[r][c] = num
        if (isCorrect) { playPlace() } else { playError(); setErrors(e=>e+1) }
      }
    }

    setBoard(newBoard); setNotes(newNotes)

    // Check completion
    if (!notesMode && num !== 0) {
      let complete = true
      for (let rr=0;rr<9;rr++) for(let cc=0;cc<9;cc++) if(newBoard[rr][cc]===0||newBoard[rr][cc]!==s.solution[rr][cc]) complete=false
      if (complete) {
        setCompleted(true)
        playWin()
        const newBest = {...(bestTime||{})}
        const prev = newBest[difficulty]
        if (!prev || timer < prev) { newBest[difficulty] = timer; setBestTime(newBest); try{localStorage.setItem(LS.BEST,JSON.stringify(newBest))}catch{} }
      }
    }
  }, [notesMode, bestTime, difficulty])

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      if (completed) { if(e.key==='Enter'||e.key===' ') window.dispatchEvent(new Event('ut:game-start')); return }
      if (!gameStarted) return
      if (e.key>='1'&&e.key<='9') placeNumber(parseInt(e.key))
      else if (e.key==='0'||e.key==='Backspace'||e.key==='Delete') placeNumber(0)
      else if (e.key==='n'||e.key==='N') setNotesMode(m=>!m)
      else if (e.key==='ArrowUp'&&selected) setSelected([Math.max(0,selected[0]-1),selected[1]])
      else if (e.key==='ArrowDown'&&selected) setSelected([Math.min(8,selected[0]+1),selected[1]])
      else if (e.key==='ArrowLeft'&&selected) setSelected([selected[0],Math.max(0,selected[1]-1)])
      else if (e.key==='ArrowRight'&&selected) setSelected([selected[0],Math.min(8,selected[1]+1)])
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [completed, gameStarted, selected, placeNumber, startGame])

  // Canvas rendering
  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current; if(!canvas) return
    const wrap = canvas.parentElement; if(!wrap) return
    const sz = Math.min(420, wrap.clientWidth - 16)
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1))
    canvas.width = Math.floor(sz*dpr); canvas.height = Math.floor(sz*dpr)
    canvas.style.width = sz+'px'; canvas.style.height = sz+'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr,0,0,dpr,0,0)
    draw(sz)
  }, [])

  const draw = useCallback((sz) => {
    const canvas = canvasRef.current; if(!canvas) return
    const s = gRef.current; if(!s.board) return
    const ctx = canvas.getContext('2d')
    const cellSz = sz / 9

    ctx.fillStyle = '#0a0f1a'
    ctx.fillRect(0, 0, sz, sz)

    // Draw cells
    for (let r=0;r<9;r++) {
      for (let c=0;c<9;c++) {
        const x = c*cellSz, y = r*cellSz
        // Box background (3x3 shading)
        const boxR = Math.floor(r/3), boxC = Math.floor(c/3)
        if ((boxR+boxC)%2===0) ctx.fillStyle = 'rgba(255,255,255,0.02)'
        else ctx.fillStyle = 'rgba(255,255,255,0.04)'
        ctx.fillRect(x, y, cellSz, cellSz)

        // Selected highlight
        if (s.selected && s.selected[0]===r && s.selected[1]===c) {
          ctx.fillStyle = 'rgba(99,102,241,0.25)'
          ctx.fillRect(x, y, cellSz, cellSz)
        }
        // Row/col highlight
        if (s.selected && (s.selected[0]===r||s.selected[1]===c)) {
          ctx.fillStyle = 'rgba(99,102,241,0.08)'
          ctx.fillRect(x, y, cellSz, cellSz)
        }
        // Same number highlight
        if (s.selected && s.board[s.selected[0]][s.selected[1]]!==0 && s.board[s.selected[0]][s.selected[1]]===s.board[r][c]) {
          ctx.fillStyle = 'rgba(99,102,241,0.15)'
          ctx.fillRect(x, y, cellSz, cellSz)
        }

        const val = s.board[r][c]
        if (val !== 0) {
          const isInitial = s.initial[r][c]
          const isSelected = s.selected && s.selected[0]===r && s.selected[1]===c
          ctx.font = `bold ${cellSz*0.55}px system-ui`
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
          if (isInitial) {
            ctx.fillStyle = '#e2e8f0'
          } else {
            const isCorrect = s.solution && s.solution[r][c] === val
            ctx.fillStyle = isCorrect ? '#818cf8' : '#ef4444'
          }
          ctx.fillText(val, x+cellSz/2, y+cellSz/2+1)
        } else {
          // Notes
          const noteSet = s.notes && s.notes[r] && s.notes[r][c]
          if (noteSet && noteSet.size > 0) {
            ctx.font = `${cellSz*0.22}px system-ui`
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
            ctx.fillStyle = '#64748b'
            for (const n of noteSet) {
              const nr = Math.floor((n-1)/3), nc = (n-1)%3
              ctx.fillText(n, x+nc*cellSz/3+cellSz/6, y+nr*cellSz/3+cellSz/6)
            }
          }
        }
      }
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'
    ctx.lineWidth = 0.5
    for (let i=0;i<=9;i++) {
      ctx.beginPath(); ctx.moveTo(i*cellSz,0); ctx.lineTo(i*cellSz,sz); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0,i*cellSz); ctx.lineTo(sz,i*cellSz); ctx.stroke()
    }
    // 3x3 box lines
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'
    ctx.lineWidth = 2
    for (let i=0;i<=3;i++) {
      ctx.beginPath(); ctx.moveTo(i*3*cellSz,0); ctx.lineTo(i*3*cellSz,sz); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0,i*3*cellSz); ctx.lineTo(sz,i*3*cellSz); ctx.stroke()
    }
  }, [])

  useEffect(()=>{ fitCanvas() }, [fitCanvas, board, selected, notes])
  useEffect(() => {
    const h = () => { fitCanvas() };
    window.addEventListener('resize', h);
    window.addEventListener('ut:board-h', h);
    return () => { window.removeEventListener('resize', h); window.removeEventListener('ut:board-h', h) };
  }, [fitCanvas]);

  const handleCanvasClick = useCallback((e) => {
    if (!board || completed) return
    const canvas = canvasRef.current; if(!canvas) return
    const rect = canvas.getBoundingClientRect()
    const sz = parseFloat(canvas.style.width)
    const cellSz = sz / 9
    const x = (e.clientX - rect.left) / rect.width * sz
    const y = (e.clientY - rect.top) / rect.height * sz
    const col = Math.floor(x / cellSz)
    const row = Math.floor(y / cellSz)
    if (row>=0&&row<9&&col>=0&&col<9) {
      setSelected([row,col])
      if (initial[row][col]) return
    }
  }, [board, completed, initial])

  const formatTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`


  return (
    <GameShell
      name="SUPER SUDOKU"
      startAction={startGame} startLabel="▶ Start" 
      title="Super Sudoku Online - Free Puzzle Game"
      desc="Play Sudoku online with multiple difficulty levels. Generate unique puzzles with guaranteed single solutions. Notes mode, timer, and error tracking."
      icon="🔢" iconBg="rgba(99,102,241,0.08)"
      category="fun" slug="games-super-sudoku"
      faq={[
        { q:"How do I play Sudoku?", a:"Fill every row, column, and 3×3 box with numbers 1-9 without repeats. Click a cell and press a number key." },
        { q:"What is Notes mode?", a:"Press N to toggle notes mode. In notes mode, numbers you enter appear as small pencil marks to help you plan." },
        { q:"How is difficulty determined?", a:"Easy puzzles have ~36 blanks, medium ~45, hard ~52, expert ~58. More blanks = harder." },
      ]}
      howItWorks={[
        "Select a difficulty and press Start to generate a new puzzle.",
        "Click a cell to select it, then press 1-9 to fill in a number.",
        "Press N to toggle notes mode for pencil marks.",
        "Complete the grid correctly to win. Your best time is saved!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Super Sudoku", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/super-sudoku/",
        "genre": "Puzzle",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="flex gap-4 max-w-6xl mx-auto overflow-hidden">
        <div className="flex-1 min-w-0 max-w-xl mx-auto space-y-4 overflow-hidden">
          {/* Difficulty + Controls */}
          <div className="glass p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {['easy','medium','hard','expert'].map(d=>(
                <button key={d} onClick={()=>setDifficulty(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${
                    difficulty===d ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.04] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}>{d}</button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-lg font-extrabold text-white">{gameStarted ? formatTime(timer) : '--:--'}</div>
                <div className="text-xs text-slate-400">Time</div>
              </div>
              <div>
                <div className="text-lg font-extrabold text-red-400">{errors}</div>
                <div className="text-xs text-slate-400">Errors</div>
              </div>
              <div>
                <div className="text-lg font-extrabold text-green-400">{bestTime[difficulty] ? formatTime(bestTime[difficulty]) : '--'}</div>
                <div className="text-xs text-slate-400">Best</div>
              </div>
              <div>
                <div className={`text-lg font-extrabold ${notesMode?'text-yellow-400':'text-slate-400'}`}>{notesMode?'ON':'OFF'}</div>
                <div className="text-xs text-slate-400">Notes</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center flex-wrap">
            <button onClick={()=>setNotesMode(m=>!m)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${notesMode?'bg-yellow-500/15 border-yellow-500/30 text-yellow-400':'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'}`}>
              📝 Notes {notesMode?'ON':'OFF'}
            </button>
            <button onClick={()=>placeNumber(0)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
              ⌫ Erase
            </button>
          </div>

          {/* Victory banner */}
          {completed && (
            <div className="glass p-4 text-center border border-green-500/20">
              <div className="text-2xl mb-1">🎉</div>
              <div className="text-sm font-bold text-green-400">Puzzle Solved!</div>
              <div className="text-xs text-slate-400 mt-1">Time: {formatTime(timer)} | Errors: {errors}</div>
            </div>
          )}

          {/* Canvas */}
          <div className="glass p-3 flex justify-center overflow-hidden">
            <canvas ref={canvasRef} onClick={handleCanvasClick}
              className="rounded-xl cursor-pointer" style={{background:'#0a0f1a',touchAction:'none'}} />
          </div>

          {/* Number pad (mobile) */}
          <div className="grid grid-cols-9 gap-1">
            {[1,2,3,4,5,6,7,8,9].map(n=>(
              <button key={n} onClick={()=>placeNumber(n)}
                className="py-2 rounded-lg text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:bg-indigo-500/20 hover:text-white active:scale-95 transition-all">
                {n}
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400">
            Desktop: Click cell + 1-9 keys | N = notes toggle | ← → ↑ ↓ navigate
          </p>
        </div>
      </div>
    </GameShell>
  )
}
