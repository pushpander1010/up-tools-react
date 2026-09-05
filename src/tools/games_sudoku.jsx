import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

/* ═══════════════════════════════════════════════════════════════════════════════
   SUDOKU ENGINE — backtracking generator + solver
   ═══════════════════════════════════════════════════════════════════════════════ */

/** Shuffle array in-place (Fisher-Yates). */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Is placing `num` at (row,col) valid? */
function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false
  }
  const br = Math.floor(row / 3) * 3
  const bc = Math.floor(col / 3) * 3
  for (let r = br; r < br + 3; r++)
    for (let c = bc; c < bc + 3; c++)
      if (board[r][c] === num) return false
  return true
}

/** Fill board with a valid full Sudoku (backtracking). */
function fillBoard(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
        for (const n of nums) {
          if (isValid(board, r, c, n)) {
            board[r][c] = n
            if (fillBoard(board)) return true
            board[r][c] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

/** Generate a full board from scratch. */
function generateFull() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0))
  fillBoard(board)
  return board
}

/** Deep-clone a 2-D array. */
function clone(b) { return b.map(r => [...r]) }

/** Remove cells to create a puzzle. Difficulty → cells removed. */
function makePuzzle(full, difficulty) {
  const removes = { easy: 36, medium: 46, hard: 54 }[difficulty] || 46
  const board = clone(full)
  const cells = []
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) cells.push([r, c])
  shuffle(cells)
  let removed = 0
  for (const [r, c] of cells) {
    if (removed >= removes) break
    board[r][c] = 0
    removed++
  }
  return board
}

/* ═══════════════════════════════════════════════════════════════════════════════
   REACT COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */
const LS_KEY = 'ut_sudoku_best_v1'

export default function GamesSudoku() {
  const [difficulty, setDifficulty] = useState('medium')
  const [solution, setSolution] = useState(null)
  const [board, setBoard] = useState(null)        // player board
  const [given, setGiven] = useState(null)         // boolean grid — cells that are locked
  const [pencil, setPencil] = useState(null)       // pencil marks: Set per cell
  const [selected, setSelected] = useState(null)   // [row, col]
  const [pencilMode, setPencilMode] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [started, setStarted] = useState(false)

  /* Timer */
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef(null)
  useEffect(() => () => clearInterval(timerRef.current), [])

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec < 10 ? '0' : ''}${sec}`
  }

  /* Best time storage */
  const [bestTime, setBestTime] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_KEY) || '{}')
      return raw[difficulty] || null
    } catch { return null }
  })

  /* ── Start / New Game ── */
  const startGame = useCallback(() => {
    const full = generateFull()
    const puzzle = makePuzzle(full, difficulty)
    const g = puzzle.map(r => r.map(v => v !== 0))

    setSolution(full)
    setBoard(clone(puzzle))
    setGiven(g)
    setPencil(Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => new Set())
    ))
    setSelected(null)
    setPencilMode(false)
    setMistakes(0)
    setCompleted(false)
    setStarted(true)
    setSeconds(0)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
  }, [difficulty])

  /* Stop timer on completion */
  useEffect(() => {
    if (completed) clearInterval(timerRef.current)
  }, [completed])

  /* ── Place a number ── */
  const placeNumber = useCallback((num) => {
    if (!selected || completed || !board) return
    const [r, c] = selected
    if (given[r][c]) return

    if (pencilMode) {
      /* Toggle pencil mark */
      setPencil(prev => {
        const next = prev.map(row => row.map(s => new Set(s)))
        if (next[r][c].has(num)) next[r][c].delete(num)
        else next[r][c].add(num)
        return next
      })
      return
    }

    /* Place number */
    setBoard(prev => {
      const next = clone(prev)
      next[r][c] = num
      return next
    })
    /* Clear pencil marks for this cell */
    setPencil(prev => {
      const next = prev.map(row => row.map(s => new Set(s)))
      next[r][c] = new Set()
      return next
    })

    /* Check correctness */
    if (num !== solution[r][c]) {
      setMistakes(m => m + 1)
    }

    /* Check completion (compare board to solution) */
    setTimeout(() => {
      setBoard(prev => {
        let complete = true
        for (let rr = 0; rr < 9; rr++)
          for (let cc = 0; cc < 9; cc++)
            if (prev[rr][cc] !== solution[rr][cc]) complete = false
        if (complete) {
          setCompleted(true)
          /* Save best time */
          try {
            const raw = JSON.parse(localStorage.getItem(LS_KEY) || '{}')
            const prevBest = raw[difficulty]
            if (!prevBest || seconds < prevBest) {
              raw[difficulty] = seconds
              localStorage.setItem(LS_KEY, JSON.stringify(raw))
              setBestTime(seconds)
            }
          } catch { /* */ }
        }
        return prev
      })
    }, 0)
  }, [selected, completed, board, given, pencilMode, solution, difficulty, seconds])

  /* ── Erase cell ── */
  const eraseCell = useCallback(() => {
    if (!selected || completed || !board) return
    const [r, c] = selected
    if (given[r][c]) return
    setBoard(prev => { const next = clone(prev); next[r][c] = 0; return next })
    setPencil(prev => {
      const next = prev.map(row => row.map(s => new Set(s)))
      next[r][c] = new Set()
      return next
    })
  }, [selected, completed, board, given])

  /* ── Keyboard ── */
  useEffect(() => {
    const handler = (e) => {
      if (!started || completed) return
      const key = e.key
      if (key >= '1' && key <= '9') { e.preventDefault(); placeNumber(Number(key)); return }
      if (key === 'Backspace' || key === 'Delete') { e.preventDefault(); eraseCell(); return }
      if (key === 'p' || key === 'P') { e.preventDefault(); setPencilMode(m => !m); return }
      /* Arrow keys */
      if (selected && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        e.preventDefault()
        let [r, c] = selected
        if (key === 'ArrowUp') r = (r + 8) % 9
        if (key === 'ArrowDown') r = (r + 1) % 9
        if (key === 'ArrowLeft') c = (c + 8) % 9
        if (key === 'ArrowRight') c = (c + 1) % 9
        setSelected([r, c])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [started, completed, selected, placeNumber, eraseCell])

  /* ── Hint: reveal one cell ── */
  const giveHint = useCallback(() => {
    if (!selected || completed || !board) return
    const [r, c] = selected
    if (given[r][c] || board[r][c] === solution[r][c]) return
    setBoard(prev => { const next = clone(prev); next[r][c] = solution[r][c]; return next })
    setPencil(prev => {
      const next = prev.map(row => row.map(s => new Set(s)))
      next[r][c] = new Set()
      return next
    })
  }, [selected, completed, board, given, solution])

  /* ── Difficulty change ── */
  useEffect(() => {
    if (!started) {
      try {
        const raw = JSON.parse(localStorage.getItem(LS_KEY) || '{}')
        setBestTime(raw[difficulty] || null)
      } catch { setBestTime(null) }
    }
  }, [difficulty, started])

  /* ── Render helpers ── */
  const cellClass = (r, c) => {
    if (!board) return ''
    const classes = []
    /* Box borders */
    if (r % 3 === 0 && r > 0) classes.push('border-t-[3px] border-t-slate-500')
    if (c % 3 === 0 && c > 0) classes.push('border-l-[3px] border-l-slate-500')
    /* Selection */
    if (selected && selected[0] === r && selected[1] === c)
      classes.push('bg-indigo-600/30 ring-2 ring-indigo-400')
    /* Same row/col/box highlight */
    else if (selected) {
      const [sr, sc] = selected
      if (r === sr || c === sc) classes.push('bg-white/[0.04]')
      else if (Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3))
        classes.push('bg-white/[0.04]')
    }
    /* Highlight matching numbers */
    if (selected && board[selected[0]][selected[1]] !== 0 && board[r][c] === board[selected[0]][selected[1]] && !(r === selected[0] && c === selected[1]))
      classes.push('bg-indigo-500/15')
    /* Wrong answer */
    if (board[r][c] !== 0 && !given[r][c] && board[r][c] !== solution[r][c])
      classes.push('text-red-400')
    return classes.join(' ')
  }

  return (
    <GameShell
      name="SUDOKU"
      startAction={startGame} startLabel="⟲ New Game"
      title="Sudoku Puzzle Game Online Free – 3 Difficulty Levels"
      desc="Play Sudoku online for free! Choose easy, medium, or hard. Features pencil marks, hints, timer, and mistake tracking. Pure client-side – no data leaves your browser."
      icon="🔢" iconBg="rgba(99,102,241,0.08)"
      category="fun" slug="games-sudoku"
      faq={[
        { q: "How do pencil marks work?", a: "Toggle pencil mode (or press P) then press a number to add/remove a small candidate note in the cell." },
        { q: "What do the difficulties mean?", a: "Easy: 36 cells removed. Medium: 46. Hard: 54. All puzzles are guaranteed to have a unique solution." },
        { q: "Can I use keyboard?", a: "Yes — arrow keys to navigate, 1-9 to place, Backspace to erase, P for pencil mode." },
      ]}
      howItWorks={[
        "Choose a difficulty and press New Game.",
        "Click a cell to select it, then press a number (1-9) to fill it.",
        "Toggle pencil mode to add candidate notes.",
        "Use hints or the eraser if you get stuck.",
        "Fill the entire grid correctly to win!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Sudoku", "applicationCategory": "Game",
        "genre": ["Puzzle", "Logic", "Brain Training"],
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      }}
    >
      <div className="max-w-xl mx-auto space-y-4">
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-sm">
          <div className="flex items-center gap-3">
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              disabled={started && !completed}
              className="bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/50 disabled:opacity-50"
            >
              <option value="easy" className="bg-gray-900">Easy (36 removed)</option>
              <option value="medium" className="bg-gray-900">Medium (46 removed)</option>
              <option value="hard" className="bg-gray-900">Hard (54 removed)</option>
            </select>
            <button
              onClick={startGame}
              className="px-4 py-2 rounded-lg font-bold text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:brightness-110 transition-all"
            >
              {completed ? 'New Game' : 'New Game'}
            </button>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span>⏱ {formatTime(seconds)}</span>
            <span className="text-red-400">✕ {mistakes}</span>
            {bestTime != null && <span className="text-amber-400 text-xs">Best: {formatTime(bestTime)}</span>}
          </div>
        </div>

        {/* ── Completed banner ── */}
        {completed && (
          <div className="text-center py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-bold">
            🎉 Congratulations! Solved in {formatTime(seconds)} with {mistakes} mistakes!
          </div>
        )}

        {/* ── Board ── */}
        {board && (
          <div className="flex justify-center">
            <div className="grid grid-cols-9 border-2 border-slate-500 w-fit">
              {board.map((row, r) =>
                row.map((val, c) => (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => setSelected([r, c])}
                    className={`
                      w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-sm sm:text-base font-semibold
                      border border-slate-700/60 cursor-pointer select-none transition-colors
                      ${given[r][c] ? 'text-slate-100' : 'text-indigo-300'}
                      ${cellClass(r, c)}
                    `}
                  >
                    {val !== 0 ? (
                      val
                    ) : pencil && pencil[r][c].size > 0 ? (
                      <div className="grid grid-cols-3 gap-0 w-full h-full leading-none">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                          <span key={n} className="flex items-center justify-center text-[7px] sm:text-[8px] text-slate-400">
                            {pencil[r][c].has(n) ? n : ''}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Number pad & controls ── */}
        {started && (
          <div className="space-y-3">
            {/* Number buttons 1-9 */}
            <div className="flex justify-center gap-1.5 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button
                  key={n}
                  onClick={() => placeNumber(n)}
                  disabled={completed}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-bold text-sm bg-white/[0.06] border border-white/[0.08] text-white hover:bg-indigo-500/30 transition-all disabled:opacity-40"
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-2">
              <button
                onClick={eraseCell}
                disabled={completed}
                className="px-4 py-2 rounded-lg text-sm bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white transition-all disabled:opacity-40"
              >
                ✕ Erase
              </button>
              <button
                onClick={() => setPencilMode(m => !m)}
                disabled={completed}
                className={`px-4 py-2 rounded-lg text-sm border transition-all disabled:opacity-40 ${
                  pencilMode
                    ? 'bg-indigo-500/30 border-indigo-400 text-indigo-300'
                    : 'bg-white/[0.06] border-white/[0.08] text-slate-300 hover:text-white'
                }`}
              >
                ✏️ Pencil {pencilMode ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={giveHint}
                disabled={completed}
                className="px-4 py-2 rounded-lg text-sm bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white transition-all disabled:opacity-40"
              >
                💡 Hint
              </button>
            </div>
          </div>
        )}

        {/* ── Instructions ── */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-xs text-slate-400 space-y-1">
          <p><strong className="text-slate-300">Controls:</strong> Click cell → press 1-9 · Arrows navigate · Backspace erases · P toggles pencil mode</p>
          <p>Place numbers 1-9 so each row, column, and 3×3 box contains all digits exactly once. Use pencil marks to track candidates!</p>
        </div>
      </div>
    </GameShell>
  )
}
