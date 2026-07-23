import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LS = { XW: 'ut_ttt_xw_v1', OW: 'ut_ttt_ow_v1', DR: 'ut_ttt_dr_v1', BEST: 'ut_ttt_best_v1' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) {
  try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {}
}
function playPlace() { playTone(440,0.1,'sine',0.06) }
function playWin() { [523,659,784].forEach((f,i)=>setTimeout(()=>playTone(f,0.2,'sine',0.08),i*100)) }
function playDraw() { playTone(330,0.2,'triangle',0.05) }

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6], // diags
]

function checkWin(board, player) {
  for (const line of WIN_LINES) {
    if (line.every(i => board[i] === player)) return line
  }
  return null
}

function checkDraw(board) { return board.every(c => c !== null) }

// Minimax AI
function minimax(board, depth, isMax, ai, human) {
  const aiWin = checkWin(board, ai)
  if (aiWin) return 10 - depth
  const humanWin = checkWin(board, human)
  if (humanWin) return depth - 10
  if (checkDraw(board)) return 0

  if (isMax) {
    let best = -Infinity
    for (let i=0;i<9;i++) {
      if (!board[i]) {
        board[i] = ai
        best = Math.max(best, minimax(board, depth+1, false, ai, human))
        board[i] = null
      }
    }
    return best
  } else {
    let best = Infinity
    for (let i=0;i<9;i++) {
      if (!board[i]) {
        board[i] = human
        best = Math.min(best, minimax(board, depth+1, true, ai, human))
        board[i] = null
      }
    }
    return best
  }
}

function aiMove(board, ai='O', human='X') {
  let bestScore = -Infinity
  let bestIdx = -1
  for (let i=0;i<9;i++) {
    if (!board[i]) {
      board[i] = ai
      const score = minimax(board, 0, false, ai, human)
      board[i] = null
      if (score > bestScore) { bestScore = score; bestIdx = i }
    }
  }
  return bestIdx
}

export default function games_tic_tac_toe() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isX, setIsX] = useState(true)
  const [mode, setMode] = useState('ai') // 'ai' or '2p'
  const [xWins, setXWins] = useState(() => Number(localStorage.getItem(LS.XW)||0))
  const [oWins, setOWins] = useState(() => Number(localStorage.getItem(LS.OW)||0))
  const [draws, setDraws] = useState(() => Number(localStorage.getItem(LS.DR)||0))
  const [winLine, setWinLine] = useState(null)
  const [winner, setWinner] = useState(null)
  const [draw, setDraw] = useState(false)
  const [lastMove, setLastMove] = useState(-1)
  const [animating, setAnimating] = useState(false)
  const boardRef = useRef(null)

  const updateScores = useCallback((x,d,o) => {
    setXWins(x); setOWins(o); setDraws(d)
    try { localStorage.setItem(LS.XW, String(x)); localStorage.setItem(LS.OW, String(o)); localStorage.setItem(LS.DR, String(d)) } catch {}
  }, [])

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null)); setIsX(true); setWinLine(null); setWinner(null); setDraw(false); setLastMove(-1); setAnimating(false)
  }, [])

  const handleMove = useCallback((idx) => {
    if (board[idx] || winner || draw || animating) return
    const newBoard = [...board]
    const player = isX ? 'X' : 'O'
    newBoard[idx] = player
    setLastMove(idx)
    playPlace()

    const win = checkWin(newBoard, player)
    if (win) {
      setBoard(newBoard)
      setWinLine(win)
      setWinner(player)
      setAnimating(true)
      setTimeout(() => { playWin(); setAnimating(false) }, 300)
      if (player === 'X') updateScores(xWins+1, draws, oWins)
      else updateScores(xWins, draws, oWins+1)
      return
    }
    if (checkDraw(newBoard)) {
      setBoard(newBoard)
      setDraw(true)
      playDraw()
      updateScores(xWins, draws+1, oWins)
      return
    }
    setBoard(newBoard)
    setIsX(!isX)

    // AI move
    if (mode === 'ai' && !isX) return // AI was O, now human's turn
    if (mode === 'ai' && isX) {
      // It was X's turn, now O (AI) moves
      setAnimating(true)
      setTimeout(() => {
        const b = [...newBoard]
        const mv = aiMove(b)
        if (mv >= 0) {
          b[mv] = 'O'
          setLastMove(mv)
          playPlace()
          const w = checkWin(b, 'O')
          if (w) {
            setBoard(b); setWinLine(w); setWinner('O'); setAnimating(false)
            playWin(); updateScores(xWins, draws, oWins+1)
            return
          }
          if (checkDraw(b)) {
            setBoard(b); setDraw(true); setAnimating(false)
            playDraw(); updateScores(xWins, draws+1, oWins)
            return
          }
          setBoard(b); setIsX(true); setAnimating(false)
        } else { setAnimating(false) }
      }, 250)
    }
  }, [board, isX, winner, draw, animating, mode, xWins, oWins, draws, updateScores])

  const cellSize = 'w-20 h-20 sm:w-24 sm:h-24'

  return (
    <ToolLayout
      title="Tic Tac Toe Online - Play vs AI or Friend"
      desc="Play Tic Tac Toe online against AI or a friend. Animated X and O marks, win detection, and score tracking."
      icon="❌" iconBg="rgba(239,68,68,0.08)"
      category="fun" slug="games-tic-tac-toe"
      faq={[
        { q: "How does the AI work?", a: "The AI uses the minimax algorithm — it plays optimally and can never lose. Try to force a draw!" },
        { q: "Can I play with a friend?", a: "Yes! Switch to '2 Player' mode to play locally with a friend taking turns." },
        { q: "Are scores saved?", a: "Yes! X wins, O wins, and draws are all tracked and saved in your browser." },
      ]}
      howItWorks={[
        "Choose AI or 2 Player mode.",
        "Click a cell to place your mark (X always goes first).",
        "Get three in a row (horizontally, vertically, or diagonally) to win!",
        "Scores are tracked across games — try to beat the AI!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Tic Tac Toe", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/tic-tac-toe/",
        "genre": "Strategy",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-md mx-auto space-y-4">
        {/* Mode selector */}
        <div className="flex gap-2 justify-center">
          <button onClick={()=>{setMode('ai');resetGame()}} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${mode==='ai'?'text-white':'bg-white/[0.06] border border-white/[0.08] text-slate-400'}`} style={mode==='ai'?{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}:{}}>
            🤖 vs AI
          </button>
          <button onClick={()=>{setMode('2p');resetGame()}} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${mode==='2p'?'text-white':'bg-white/[0.06] border border-white/[0.08] text-slate-400'}`} style={mode==='2p'?{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}:{}}>
            👥 2 Player
          </button>
        </div>

        {/* Scoreboard */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-black/20 rounded-xl">
            <div className="text-lg font-extrabold text-red-400">{xWins}</div>
            <div className="text-xs text-slate-500">X Wins</div>
          </div>
          <div className="text-center p-3 bg-black/20 rounded-xl">
            <div className="text-lg font-extrabold text-slate-400">{draws}</div>
            <div className="text-xs text-slate-500">Draws</div>
          </div>
          <div className="text-center p-3 bg-black/20 rounded-xl">
            <div className="text-lg font-extrabold text-blue-400">{oWins}</div>
            <div className="text-xs text-slate-500">O Wins</div>
          </div>
        </div>

        {/* Turn indicator */}
        <div className="text-center">
          <span className={`text-sm font-bold ${winner||draw?'text-green-400':isX?'text-red-400':'text-blue-400'}`}>
            {winner ? `${winner} Wins! 🎉` : draw ? "It's a Draw! 🤝" : isX ? "X's Turn" : "O's Turn"}
          </span>
        </div>

        {/* Board */}
        <div ref={resultRef} className="flex justify-center">
          <div ref={boardRef} className="grid grid-cols-3 gap-2 p-3 bg-black/30 rounded-2xl border border-white/[0.06]">
            {board.map((cell, i) => (
              <button key={i} onClick={() => handleMove(i)}
                className={`${cellSize} flex items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/[0.06] ${winLine?.includes(i) ? 'ring-2 ring-green-400/50 bg-green-400/10' : 'bg-white/[0.04]'}`}
                disabled={!!cell || !!winner || draw || animating}
              >
                {cell && (
                  <svg viewBox="0 0 100 100" className={`w-12 h-12 sm:w-14 sm:h-14 ${lastMove === i ? 'animate-bounce' : ''}`}>
                    {cell === 'X' ? (
                      <>
                        <line x1="20" y1="20" x2="80" y2="80" stroke="#ef4444" strokeWidth="8" strokeLinecap="round"
                          style={{animation:'drawLine 0.3s ease forwards'}} />
                        <line x1="80" y1="20" x2="20" y2="80" stroke="#ef4444" strokeWidth="8" strokeLinecap="round"
                          style={{animation:'drawLine 0.3s ease 0.15s forwards'}} />
                      </>
                    ) : (
                      <circle cx="50" cy="50" r="30" stroke="#3b82f6" strokeWidth="8" fill="none" strokeLinecap="round"
                        style={{animation:'drawCircle 0.3s ease forwards', strokeDasharray: 188, strokeDashoffset: 188}} />
                    )}
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Reset */}
        <div className="flex gap-3 justify-center">
          <button onClick={resetGame} className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
            ⟲ New Game
          </button>
          <button onClick={()=>updateScores(0,0,0)} className="px-4 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
            Reset Scores
          </button>
        </div>

        <p className="text-center text-xs text-slate-500">
          {mode === 'ai' ? 'AI uses minimax — it never loses!' : 'Take turns with a friend on the same device.'}
        </p>

        <style>{`
          @keyframes drawLine { from { stroke-dashoffset: 85 } to { stroke-dashoffset: 0 } }
          @keyframes drawCircle { from { stroke-dashoffset: 188 } to { stroke-dashoffset: 0 } }
        `}</style>
      </div>
    </ToolLayout>
  )
}
