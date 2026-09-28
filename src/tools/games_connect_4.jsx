import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const LS = { RW: 'ut_c4_rw_v1', YW: 'ut_c4_yw_v1', DR: 'ut_c4_dr_v1' }
const ROWS = 6, COLS = 7

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) {
  try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {}
}
function playDrop() { playTone(300,0.15,'sine',0.06); setTimeout(()=>playTone(200,0.1,'sine',0.04),80) }
function playWin() { [523,659,784,1047].forEach((f,i)=>setTimeout(()=>playTone(f,0.2,'sine',0.08),i*100)) }
function playDraw() { playTone(330,0.2,'triangle',0.05) }

function checkWin(board, player) {
  // Horizontal
  for (let r=0;r<ROWS;r++) for (let c=0;c<=COLS-4;c++) {
    if ([0,1,2,3].every(i=>board[r][c+i]===player)) return [[r,c],[r,c+1],[r,c+2],[r,c+3]]
  }
  // Vertical
  for (let r=0;r<=ROWS-4;r++) for (let c=0;c<COLS;c++) {
    if ([0,1,2,3].every(i=>board[r+i][c]===player)) return [[r,c],[r+1,c],[r+2,c],[r+3,c]]
  }
  // Diag \
  for (let r=0;r<=ROWS-4;r++) for (let c=0;c<=COLS-4;c++) {
    if ([0,1,2,3].every(i=>board[r+i][c+i]===player)) return [[r,c],[r+1,c+1],[r+2,c+2],[r+3,c+3]]
  }
  // Diag /
  for (let r=3;r<ROWS;r++) for (let c=0;c<=COLS-4;c++) {
    if ([0,1,2,3].every(i=>board[r-i][c+i]===player)) return [[r,c],[r-1,c+1],[r-2,c+2],[r-3,c+3]]
  }
  return null
}

function checkDraw(board) { return board[0].every(c => c !== null) }

// Minimax with depth limit for Connect 4
function evaluateWindow(window, player) {
  const opp = player === 'R' ? 'Y' : 'R'
  let score = 0
  const pc = window.filter(c=>c===player).length
  const oc = window.filter(c=>c===opp).length
  const ec = window.filter(c=>c===null).length
  if (pc === 4) score += 100
  else if (pc === 3 && ec === 1) score += 5
  else if (pc === 2 && ec === 2) score += 2
  if (oc === 3 && ec === 1) score -= 4
  return score
}

function scorePosition(board, player) {
  let score = 0
  const center = board.map(r=>r[3]).filter(c=>c===player).length
  score += center * 3
  // Horizontal
  for (let r=0;r<ROWS;r++) for (let c=0;c<=COLS-4;c++) score += evaluateWindow([board[r][c],board[r][c+1],board[r][c+2],board[r][c+3]], player)
  // Vertical
  for (let r=0;r<=ROWS-4;r++) for (let c=0;c<COLS;c++) score += evaluateWindow([board[r][c],board[r+1][c],board[r+2][c],board[r+3][c]], player)
  // Diag \
  for (let r=0;r<=ROWS-4;r++) for (let c=0;c<=COLS-4;c++) score += evaluateWindow([board[r][c],board[r+1][c+1],board[r+2][c+2],board[r+3][c+3]], player)
  // Diag /
  for (let r=3;r<ROWS;r++) for (let c=0;c<=COLS-4;c++) score += evaluateWindow([board[r][c],board[r-1][c+1],board[r-2][c+2],board[r-3][c+3]], player)
  return score
}

function getValidCols(board) {
  const cols = []
  for (let c=0;c<COLS;c++) if (board[0][c]===null) cols.push(c)
  return cols
}

function dropPiece(board, col, player) {
  const nb = board.map(r=>[...r])
  for (let r=ROWS-1;r>=0;r--) { if (nb[r][col]===null) { nb[r][col] = player; return nb } }
  return nb
}

function minimax(board, depth, alpha, beta, maximizing, aiPlayer) {
  const human = aiPlayer === 'R' ? 'Y' : 'R'
  const validCols = getValidCols(board)
  const isTerminal = validCols.length === 0 || checkWin(board,'R') || checkWin(board,'Y')
  if (depth === 0 || isTerminal) {
    if (checkWin(board, aiPlayer)) return { score: 100000+depth, col: -1 }
    if (checkWin(board, human)) return { score: -(100000+depth), col: -1 }
    if (validCols.length === 0) return { score: 0, col: -1 }
    return { score: scorePosition(board, aiPlayer), col: -1 }
  }

  if (maximizing) {
    let best = { score: -Infinity, col: validCols[Math.floor(Math.random()*validCols.length)] }
    for (const col of validCols) {
      const nb = dropPiece(board, col, aiPlayer)
      const result = minimax(nb, depth-1, alpha, beta, false, aiPlayer)
      if (result.score > best.score) { best = { score: result.score, col } }
      alpha = Math.max(alpha, result.score)
      if (alpha >= beta) break
    }
    return best
  } else {
    let best = { score: Infinity, col: validCols[Math.floor(Math.random()*validCols.length)] }
    for (const col of validCols) {
      const nb = dropPiece(board, col, human)
      const result = minimax(nb, depth-1, alpha, beta, true, aiPlayer)
      if (result.score < best.score) { best = { score: result.score, col } }
      beta = Math.min(beta, result.score)
      if (alpha >= beta) break
    }
    return best
  }
}

export default function games_connect_4() {
  const [board, setBoard] = useState(() => Array.from({length:ROWS}, ()=>Array(COLS).fill(null)))
  const [isRed, setIsRed] = useState(true)
  const [mode, setMode] = useState('ai')
  const [rWins, setRWins] = useState(() => Number(localStorage.getItem(LS.RW)||0))
  const [yWins, setYWins] = useState(() => Number(localStorage.getItem(LS.YW)||0))
  const [draws, setDraws] = useState(() => Number(localStorage.getItem(LS.DR)||0))
  const [winLine, setWinLine] = useState(null)
  const [winner, setWinner] = useState(null)
  const [draw, setDraw] = useState(false)
  const [lastDrop, setLastDrop] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [hoverCol, setHoverCol] = useState(-1)
  const boardRef = useRef(null)

  const updateScores = useCallback((r,d,y) => {
    setRWins(r); setYWins(y); setDraws(d)
    try { localStorage.setItem(LS.RW, String(r)); localStorage.setItem(LS.YW, String(y)); localStorage.setItem(LS.DR, String(d)) } catch {}
  }, [])

  const resetGame = useCallback(() => {
    setBoard(Array.from({length:ROWS}, ()=>Array(COLS).fill(null)))
    setIsRed(true); setWinLine(null); setWinner(null); setDraw(false); setLastDrop(null); setAnimating(false)
  }, [])

  const handleDrop = useCallback((col) => {
    if (winner || draw || animating) return
    if (board[0][col] !== null) return
    const player = isRed ? 'R' : 'Y'
    const newBoard = dropPiece(board, col, player)
    setLastDrop({ row: newBoard.findIndex(r=>r[col]===player), col })
    playDrop()

    const win = checkWin(newBoard, player)
    if (win) {
      setBoard(newBoard); setWinLine(win); setWinner(player); setAnimating(true)
      setTimeout(() => { playWin(); setAnimating(false) }, 300)
      if (player === 'R') updateScores(rWins+1, draws, yWins)
      else updateScores(rWins, draws, yWins+1)
      return
    }
    if (checkDraw(newBoard)) {
      setBoard(newBoard); setDraw(true); playDraw()
      updateScores(rWins, draws+1, yWins)
      return
    }
    setBoard(newBoard); setIsRed(!isRed)

    // AI move
    if (mode === 'ai' && isRed) {
      // Red just moved, now AI (Yellow) moves
      setAnimating(true)
      setTimeout(() => {
        const result = minimax(newBoard, 5, -Infinity, Infinity, true, 'Y')
        if (result.col >= 0) {
          const b2 = dropPiece(newBoard, result.col, 'Y')
          setLastDrop({ row: b2.findIndex(r=>r[result.col]==='Y'), col: result.col })
          playDrop()
          const w = checkWin(b2, 'Y')
          if (w) { setBoard(b2); setWinLine(w); setWinner('Y'); setAnimating(false); playWin(); updateScores(rWins, draws, yWins+1); return }
          if (checkDraw(b2)) { setBoard(b2); setDraw(true); setAnimating(false); playDraw(); updateScores(rWins, draws+1, yWins); return }
          setBoard(b2); setIsRed(true); setAnimating(false)
        } else { setAnimating(false) }
      }, 300)
    }
  }, [board, isRed, winner, draw, animating, mode, rWins, yWins, draws, updateScores])


  const cellSz = 'w-11 h-11 sm:w-12 sm:h-12'

  // Keyboard: Space/Enter to start new game when game over
  useEffect(() => {
    const handler = (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && (winner || draw)) {
        e.preventDefault()
        window.dispatchEvent(new Event('ut:game-start'))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [winner, draw])


  return (
    <GameShell
      name="CONNECT 4"
      startAction={resetGame} startLabel={winner || draw ? '⟲ New Game' : '▶ Start'}
      headerStats={<><span>🔴 {rWins}</span><span>🟡 {yWins}</span><span>🤝 {draws}</span></>}
      title="Connect 4 — Drop Discs, Get Four in a Row"
      desc="Drop red or yellow discs and be the first to connect four in a row. Play against a smart AI or challenge a friend locally."
      icon="🔴" iconBg="rgba(239,68,68,0.08)"
      category="fun" slug="games-connect-4"
      faq={[
        { q: "How does the Connect 4 AI work?", a: "The AI uses the minimax algorithm with alpha-beta pruning at depth 5. It evaluates board positions to find the optimal move, making it a strong opponent." },
        { q: "Can I play with a friend?", a: "Yes! Switch to '2 Player' mode to play locally with turns. Red goes first." },
      ]}
      howItWorks={[
        "Choose AI or 2 Player mode.",
        "Click a column to drop your disc (Red goes first).",
        "Get four in a row to win — horizontally, vertically, or diagonally!",
        "The AI uses minimax with alpha-beta pruning for challenging play.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Connect 4", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/connect-4/",
        "genre": "Strategy",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="flex gap-4 max-w-6xl mx-auto overflow-hidden">
        <div className="flex-1 min-w-0 max-w-lg mx-auto space-y-5 overflow-hidden">
        {/* Mode */}
        <div className="flex gap-2 justify-center">
          <button onClick={()=>{setMode('ai');window.dispatchEvent(new Event('ut:game-start'))}} className={`glow-btn px-4 py-2 text-sm transition-all ${mode==='ai'?'':'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:bg-white/[0.1]'}`}>
           🤖 vs AI
         </button>
          <button onClick={()=>{setMode('2p');window.dispatchEvent(new Event('ut:game-start'))}} className={`glow-btn px-4 py-2 text-sm transition-all ${mode==='2p'?'':'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:bg-white/[0.1]'}`}>
           👥 2 Player
         </button>
        </div>

        {/* Scoreboard */}
        <div className="glass p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-red-400">{rWins}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Red Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-slate-400">{draws}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Draws</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-yellow-400">{yWins}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Yellow Wins</div>
            </div>
          </div>
        </div>

        {/* Turn indicator */}
        <div className="text-center">
          <span className={`text-sm font-bold ${winner||draw?'text-green-400':isRed?'text-red-400':'text-yellow-400'}`}>
            {winner ? `${winner==='R'?'Red':'Yellow'} Wins! 🎉` : draw ? "It's a Draw! 🤝" : isRed ? "🔴 Red's Turn" : "🟡 Yellow's Turn"}
          </span>
        </div>

        {/* Board */}
        <div className="flex justify-center relative">
          {!winner && !draw && board.every(row => row.every(cell => cell === null)) && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 py-8 bg-[#050d1a]/92 backdrop-blur-[2px] rounded-2xl overflow-y-auto"
              onClick={(e) => { if (e.target.closest('button')) return; window.dispatchEvent(new Event('ut:game-start')) }}>
              <img src="/games/connect-4/cover.jpg" alt="Connect 4 cover art" loading="eager"
                className="w-full max-w-[420px] aspect-video object-cover rounded-2xl border border-red-400/30 shadow-[0_0_40px_rgba(239,68,68,0.35)] mb-4" />
              <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-b from-red-300 via-yellow-300 to-red-300 bg-clip-text text-transparent">CONNECT 4</h2>
              <p className="text-xs text-slate-400 mt-1 mb-3">Drop discs · Connect 4 · Free</p>
              <div className="flex flex-wrap justify-center gap-1.5 mb-3 text-[11px] font-bold">
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-red-200">🔴🔴🔴🔴 4 in a row</span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-yellow-200">🤖 Smart AI</span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-cyan-200">👥 2-player mode</span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-green-200">📱 Touch + click</span>
              </div>
              <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-8 py-3 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 text-white font-extrabold text-lg shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:scale-105 transition">▶ Start Game</button>
              <p className="text-[11px] text-slate-500 mt-2">Choose mode above, then start</p>
            </div>
          )}
          <div className="bg-blue-600 p-2 sm:p-3 rounded-2xl border-2 border-blue-500 shadow-lg shadow-blue-900/30">
            {/* Column hover indicators */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1">
              {Array.from({length:COLS}).map((_,c) => (
                <div key={c} className={`${cellSz} flex items-center justify-center`}>
                  {hoverCol === c && !winner && !draw && board[0][c]===null && (
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full opacity-40 ${isRed?'bg-red-400':'bg-yellow-400'}`} />
                  )}
                </div>
              ))}
            </div>
            {/* Cells */}
            {board.map((row, r) => (
              <div key={r} className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {row.map((cell, c) => (
                  <button key={`${r}-${c}`}
                    onClick={() => handleDrop(c)}
                    onMouseEnter={() => setHoverCol(c)}
                    onMouseLeave={() => setHoverCol(-1)}
                    className={`${cellSz} rounded-full transition-all duration-200 flex items-center justify-center ${winLine?.some(([wr,wc])=>wr===r&&wc===c)?'ring-2 ring-green-400':''}`}
                    style={{ background: cell ? 'transparent' : 'rgba(0,0,0,0.3)' }}
                  >
                    {cell && (
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md transition-all ${lastDrop?.row===r&&lastDrop?.col===c?'animate-bounce':''}`}
                        style={{
                          background: cell === 'R' ? 'radial-gradient(circle at 35% 35%, #f87171, #dc2626, #991b1b)' : 'radial-gradient(circle at 35% 35%, #fde047, #eab308, #a16207)',
                          boxShadow: cell === 'R' ? '0 2px 8px rgba(220,38,38,0.4)' : '0 2px 8px rgba(234,179,8,0.4)'
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <button onClick={()=>updateScores(0,0,0)} className="px-4 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">
           Reset Scores
          </button>
        </div>

        <p className="text-center text-xs text-slate-400">
          Click a column to drop your disc | AI uses minimax for smart play
        </p>
        </div>
      </div>
    </GameShell>
  )
}
