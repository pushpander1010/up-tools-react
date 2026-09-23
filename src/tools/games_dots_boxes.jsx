import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const LS = { BEST: 'ut_Dots and Boxes_best_v1' }
const GRID_SIZE = 5

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); return audioCtx }
function playTone(freq, dur, type = 'sine', vol = 0.08) {
  try { const ctx = ensureAudio(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(vol, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur) } catch {}
}
function playLine() { playTone(400, 0.06, 'triangle', 0.05) }
function playBox() { playTone(600, 0.1, 'sine', 0.07); setTimeout(() => playTone(800, 0.1, 'sine', 0.06), 80) }
function playGameOver() { [0,100,200].forEach((d,i) => setTimeout(() => playTone(500 + i*200, 0.15, 'sine', 0.06), d)) }

function initGame() {
  // Horizontal lines: GRID_SIZE rows x (GRID_SIZE-1) cols
  const hLines = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE - 1).fill(false))
  // Vertical lines: (GRID_SIZE-1) rows x GRID_SIZE cols
  const vLines = Array.from({ length: GRID_SIZE - 1 }, () => Array(GRID_SIZE).fill(false))
  // Boxes: GRID_SIZE-1 rows x GRID_SIZE-1 cols, null = open, 'player' or 'computer'
  const boxes = Array.from({ length: GRID_SIZE - 1 }, () => Array(GRID_SIZE - 1).fill(null))
  return { hLines, vLines, boxes }
}

function countBoxSides(boxes, hLines, vLines, r, c) {
  let count = 0
  if (hLines[r][c]) count++         // top side
  if (hLines[r + 1][c]) count++     // bottom side
  if (vLines[r][c]) count++         // left side
  if (vLines[r][c + 1]) count++     // right side
  return count
}

function findCompletableBox(hLines, vLines, boxes) {
  for (let r = 0; r < GRID_SIZE - 1; r++) {
    for (let c = 0; c < GRID_SIZE - 1; c++) {
      if (!boxes[r][c] && countBoxSides(boxes, hLines, vLines, r, c) === 3) {
        return { r, c }
      }
    }
  }
  return null
}

function findBestMove(hLines, vLines, boxes) {
  // 1. Complete a box if possible (3 sides already drawn)
  const completable = findCompletableBox(hLines, vLines, boxes)
  if (completable) {
    const { r, c } = completable
    if (!hLines[r][c]) return { type: 'h', r, c }
    if (!hLines[r + 1][c]) return { type: 'h', r: r + 1, c }
    if (!vLines[r][c]) return { type: 'v', r, c }
    if (!vLines[r][c + 1]) return { type: 'v', r, c: c + 1 }
  }

  // 2. Avoid giving opponent a box — find line that doesn't create a 3-side box
  const candidates = []
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE - 1; c++) {
      if (!hLines[r][c]) {
        hLines[r][c] = true
        const isSafe = !findCompletableBox(hLines, vLines, boxes)
        hLines[r][c] = false
        candidates.push({ type: 'h', r, c, safe: isSafe })
      }
    }
  }
  for (let r = 0; r < GRID_SIZE - 1; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!vLines[r][c]) {
        vLines[r][c] = true
        const isSafe = !findCompletableBox(hLines, vLines, boxes)
        vLines[r][c] = false
        candidates.push({ type: 'v', r, c, safe: isSafe })
      }
    }
  }

  // Prefer safe moves (don't open 3-side boxes for opponent)
  const safeMoves = candidates.filter(m => m.safe)
  if (safeMoves.length > 0) return safeMoves[Math.floor(Math.random() * safeMoves.length)]

  // 3. Random move as last resort
  if (candidates.length > 0) return candidates[Math.floor(Math.random() * candidates.length)]
  return null
}

export default function games_dots_boxes() {
  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [playerScore, setPlayerScore] = useState(0)
  const [compScore, setCompScore] = useState(0)
  const [best, setBest] = useState(() => { try { return Number(localStorage.getItem(LS.BEST) || 0) } catch { return 0 } })
  const [turn, setTurn] = useState('player')
  const [message, setMessage] = useState('Your turn — draw a line!')
  const [boardSize, setBoardSize] = useState(360)
  const [animLine, setAnimLine] = useState(null)
  const boardRef = useRef(null)
  const stateRef = useRef(initGame())

  useEffect(() => { resizeBoard() }, [])
  useEffect(() => {
    const h = () => resizeBoard()
    window.addEventListener('resize', h)
    window.addEventListener('ut:board-h', h)
    return () => { window.removeEventListener('resize', h); window.removeEventListener('ut:board-h', h) }
  }, [])

  const resizeBoard = () => {
    if (boardRef.current) {
      const parentW = boardRef.current.parentElement.clientWidth
      const vpW = window.innerWidth
      const w = Math.min(360, parentW - 16, (window.__utBoardH || 1e9) - 16, vpW - 32)
      setBoardSize(Math.max(260, w))
    }
  }

  const startNew = useCallback(() => {
    stateRef.current = initGame()
    setPlayerScore(0); setCompScore(0); setTurn('player')
    setMessage('Your turn — draw a line!'); setGameOver(false); setPlaying(true)
  }, [])

  const checkGameEnd = useCallback(() => {
    const { boxes } = stateRef.current
    let p = 0, c = 0
    for (let r = 0; r < GRID_SIZE - 1; r++)
      for (let cc = 0; cc < GRID_SIZE - 1; cc++) {
        if (boxes[r][cc] === 'player') p++
        else if (boxes[r][cc] === 'computer') c++
      }
    setPlayerScore(p); setCompScore(c)

    // Check if all boxes filled
    let total = 0
    for (let r = 0; r < GRID_SIZE - 1; r++)
      for (let cc = 0; cc < GRID_SIZE - 1; cc++) if (boxes[r][cc]) total++
    if (total === (GRID_SIZE - 1) * (GRID_SIZE - 1)) {
      setGameOver(true)
      const winner = p > c ? 'You win!' : c > p ? 'Computer wins!' : "It's a tie!"
      setMessage(winner)
      playGameOver()
      setBest(prev => { const nb = Math.max(prev, p); try { localStorage.setItem(LS.BEST, String(nb)) } catch {}; return nb })
      return true
    }
    return false
  }, [])

  const computerMove = useCallback(() => {
    setTimeout(() => {
      const move = findBestMove(stateRef.current.hLines, stateRef.current.vLines, stateRef.current.boxes)
      if (!move) return

      const { hLines, vLines, boxes } = stateRef.current
      if (move.type === 'h') hLines[move.r][move.c] = true
      else vLines[move.r][move.c] = true

      playLine()

      // Check if computer completed a box
      let completed = false
      for (let r = 0; r < GRID_SIZE - 1; r++) {
        for (let c = 0; c < GRID_SIZE - 1; c++) {
          if (!boxes[r][c] && countBoxSides(boxes, hLines, vLines, r, c) === 4) {
            boxes[r][c] = 'computer'
            completed = true
          }
        }
      }

      if (completed) {
        playBox()
        if (!checkGameEnd()) {
          setMessage('🤖 Computer got a box! Goes again...')
          setTimeout(() => computerMove(), 600)
        }
      } else {
        setTurn('player')
        setMessage('Your turn — draw a line!')
      }
    }, 400 + Math.random() * 300)
  }, [checkGameEnd])

  const drawLine = useCallback((type, r, c) => {
    if (turn !== 'player' || gameOver) return
    const { hLines, vLines, boxes } = stateRef.current

    if (type === 'h' && hLines[r][c]) return
    if (type === 'v' && vLines[r][c]) return

    setAnimLine({ type, r, c })
    setTimeout(() => setAnimLine(null), 200)

    if (type === 'h') hLines[r][c] = true
    else vLines[r][c] = true

    playLine()

    // Check if player completed a box
    let completed = false
    for (let br = 0; br < GRID_SIZE - 1; br++) {
      for (let bc = 0; bc < GRID_SIZE - 1; bc++) {
        if (!boxes[br][bc] && countBoxSides(boxes, hLines, vLines, br, bc) === 4) {
          boxes[br][bc] = 'player'
          completed = true
        }
      }
    }

    if (completed) {
      playBox()
      if (!checkGameEnd()) {
        setMessage('You got a box! Go again!')
        // Player goes again — don't switch turn
      } else {
        return
      }
    } else {
      setTurn('computer')
      setMessage('🤖 Computer is thinking...')
      computerMove()
    }
  }, [turn, gameOver, computerMove, checkGameEnd])

  const dotSpacing = boardSize / (GRID_SIZE + 1)

  return (
    <GameShell
      name="Dots and Boxes"
      startAction={startNew} startLabel="✏️ Start Drawing"
      title="Dots and Boxes — Play Free Strategy Game Online"
      desc="Play Dots and Boxes against the computer! Draw lines to complete boxes and earn points. The player with the most boxes wins."
      icon="✏️" iconBg="rgba(139,92,246,0.08)"
      category="fun" slug="games-dots-boxes"
      faq={[
        { q: "How do I play Dots and Boxes?", a: "Click on the space between two dots to draw a line. Complete a full box around four dots to score a point." },
        { q: "What happens when I complete a box?", a: "You score a point and get an extra turn! Keep drawing lines until you can't complete a box." },
        { q: "Who does the computer play against me?", a: "The computer uses a greedy strategy: it completes boxes when possible and avoids giving you easy completions." },
        { q: "How do I play Dots and Boxes — Play Free Strategy Game Online online free?", a: "Click Start and click between dots to draw lines. Works on mobile and desktop. No download needed." },
        { q: "Can I play Dots and Boxes — Play Free Strategy Game Online without downloading?", a: "Yes. This Dots and Boxes — Play Free Strategy Game Online runs in your browser with no install. Free on mobile and desktop." },
        { q: "Is this Dots and Boxes — Play Free Strategy Game Online free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        "Click on the gap between two dots to draw a horizontal or vertical line.",
        "Complete all four sides of a box to claim it and earn a point.",
        "Completing a box gives you an extra turn — chain your moves!",
        "The game ends when all boxes are filled. Most boxes wins!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Dots and Boxes", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/dots-boxes/",
        "genre": "Strategy",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="min-w-0 space-y-5">
        {!playing && (
          <div className="glass p-6 text-center">
            <div className="text-5xl mb-3">✏️</div>
            <h2 className="text-xl font-bold text-white mb-2">Dots and Boxes</h2>
            <p className="text-sm text-slate-400 mb-4">Draw lines, complete boxes, outsmart the computer!</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="glass p-3 rounded-xl"><div className="text-lg font-bold text-blue-400">✏️</div><div className="text-xs text-slate-400">Draw Lines</div></div>
              <div className="glass p-3 rounded-xl"><div className="text-lg font-bold text-green-400">📦</div><div className="text-xs text-slate-400">Claim Boxes</div></div>
              <div className="glass p-3 rounded-xl"><div className="text-lg font-bold text-purple-400">🤖</div><div className="text-xs text-slate-400">vs Computer</div></div>
            </div>
            {best > 0 && <p className="text-xs text-slate-400 mb-3">🏆 Best: {best} boxes</p>}
            <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:opacity-90 transition-all">✏️ Start Drawing</button>
          </div>
        )}

        {playing && (
          <>
            <div className="flex gap-3 items-center justify-between">
              <div className="flex gap-2">
                <div className="px-3 py-2 glass text-sm font-bold text-blue-400">🧑 {playerScore}</div>
                <div className="px-3 py-2 glass text-sm font-bold text-red-400">🤖 {compScore}</div>
              </div>
              <div className="flex gap-2 items-center">
                <div className={`px-3 py-2 glass text-xs font-medium ${turn === 'player' ? 'text-blue-400' : 'text-red-400'}`}>
                  {turn === 'player' ? 'Your Turn' : 'Computer'}
                </div>
                <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">⟲</button>
                <button onClick={() => setPlaying(false)} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">⟵</button>
              </div>
            </div>

            <div ref={boardRef} className="glass p-3">
              <div className="relative mx-auto" style={{ width: boardSize, height: boardSize, background: '#0b1628', borderRadius: 12, touchAction: 'none' }}>
                {/* Grid lines (clickable) */}
                {Array.from({ length: GRID_SIZE }).map((_, r) =>
                  Array.from({ length: GRID_SIZE - 1 }).map((_, c) => (
                    <div key={`h-${r}-${c}`}
                      onClick={() => drawLine('h', r, c)}
                      className="absolute cursor-pointer hover:bg-white/10 rounded transition-all"
                      style={{
                        left: dotSpacing * (c + 1),
                        top: dotSpacing * (r + 1) - 3,
                        width: dotSpacing - 4,
                        height: 6,
                        background: stateRef.current.hLines[r][c] ? '#3b82f6' : 'transparent',
                        border: stateRef.current.hLines[r][c] ? 'none' : '1px dashed rgba(255,255,255,0.15)',
                      }}
                    />
                  ))
                )}
                {Array.from({ length: GRID_SIZE - 1 }).map((_, r) =>
                  Array.from({ length: GRID_SIZE }).map((_, c) => (
                    <div key={`v-${r}-${c}`}
                      onClick={() => drawLine('v', r, c)}
                      className="absolute cursor-pointer hover:bg-white/10 rounded transition-all"
                      style={{
                        left: dotSpacing * (c + 1) - 3,
                        top: dotSpacing * (r + 1),
                        width: 6,
                        height: dotSpacing - 4,
                        background: stateRef.current.vLines[r][c] ? '#3b82f6' : 'transparent',
                        border: stateRef.current.vLines[r][c] ? 'none' : '1px dashed rgba(255,255,255,0.15)',
                      }}
                    />
                  ))
                )}

                {/* Completed boxes */}
                {Array.from({ length: GRID_SIZE - 1 }).map((_, r) =>
                  Array.from({ length: GRID_SIZE - 1 }).map((_, c) => {
                    const owner = stateRef.current.boxes[r][c]
                    if (!owner) return null
                    return (
                      <div key={`box-${r}-${c}`} className="absolute rounded transition-all" style={{
                        left: dotSpacing * (c + 1) + 3,
                        top: dotSpacing * (r + 1) + 3,
                        width: dotSpacing - 6,
                        height: dotSpacing - 6,
                        background: owner === 'player' ? 'rgba(59,130,246,0.25)' : 'rgba(239,68,68,0.25)',
                        border: owner === 'player' ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(239,68,68,0.4)',
                      }}>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: owner === 'player' ? '#60a5fa' : '#f87171' }}>
                          {owner === 'player' ? '🧑' : '🤖'}
                        </span>
                      </div>
                    )
                  })
                )}

                {/* Dots */}
                {Array.from({ length: GRID_SIZE }).map((_, r) =>
                  Array.from({ length: GRID_SIZE }).map((_, c) => (
                    <div key={`dot-${r}-${c}`} className="absolute rounded-full" style={{
                      left: dotSpacing * (c + 1) - 4,
                      top: dotSpacing * (r + 1) - 4,
                      width: 8, height: 8,
                      background: '#e2e8f0',
                    }} />
                  ))
                )}

                {gameOver && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10">
                    <div className="text-4xl mb-2">{playerScore > compScore ? '🎉' : playerScore < compScore ? '💀' : '🤝'}</div>
                    <h2 className="text-xl font-bold text-white mb-2">
                      {playerScore > compScore ? 'You Win!' : playerScore < compScore ? 'Computer Wins!' : "It's a Tie!"}
                    </h2>
                    <p className="text-sm text-slate-400 mb-1">You: {playerScore} boxes | Computer: {compScore} boxes</p>
                    <p className="text-xs text-slate-500 mb-4">Total: {(GRID_SIZE-1)*(GRID_SIZE-1)} boxes</p>
                    <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:opacity-90 transition-all">Play Again</button>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center glass p-3 rounded-xl">
              <p className="text-sm text-white">{message}</p>
            </div>
          </>
        )}
        <p className="text-center text-xs text-slate-400">Tip: Completing a box earns an extra turn — chain your moves!</p>
      </div>
    </GameShell>
  )
}
