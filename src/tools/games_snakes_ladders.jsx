import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const LS = { BEST: 'ut_Snakes and Ladders_best_v1' }

const SNAKES = { 16:6, 46:25, 49:11, 62:19, 64:60, 74:53, 89:68, 92:88, 95:75, 99:80 }
const LADDERS = { 2:38, 7:14, 8:31, 15:26, 21:42, 28:84, 36:44, 51:67, 71:91, 78:98 }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); return audioCtx }
function playTone(freq, dur, type = 'sine', vol = 0.08) {
  try { const ctx = ensureAudio(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(vol, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur) } catch {}
}
function playDice() { playTone(600, 0.06, 'square', 0.05); setTimeout(() => playTone(800, 0.06, 'square', 0.05), 60) }
function playSnake() { playTone(400, 0.3, 'sawtooth', 0.07); setTimeout(() => playTone(200, 0.4, 'sawtooth', 0.05), 150) }
function playLadder() { playTone(500, 0.1, 'sine', 0.07); setTimeout(() => playTone(700, 0.1, 'sine', 0.07), 80); setTimeout(() => playTone(900, 0.15, 'sine', 0.06), 160) }
function playWin() { [0,100,200,300,400].forEach((d,i) => setTimeout(() => playTone(500 + i*100, 0.15, 'sine', 0.07), d)) }

function posToXY(pos) {
  if (pos <= 0) return { row: 9, col: 0 }
  const p = pos - 1
  const row = 9 - Math.floor(p / 10)
  const colIdx = p % 10
  const col = (row % 2 === 1) ? colIdx : 9 - colIdx
  return { row, col }
}

export default function games_snakes_ladders() {
  const [playerPos, setPlayerPos] = useState(0)
  const [compPos, setCompPos] = useState(0)
  const [dice, setDice] = useState(0)
  const [rolling, setRolling] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState(null)
  const [message, setMessage] = useState('Roll the dice to start!')
  const [lastEvent, setLastEvent] = useState(null)
  const [boardSize, setBoardSize] = useState(380)
  const [best, setBest] = useState(() => { try { return Number(localStorage.getItem(LS.BEST) || 0) } catch { return 0 } })
  const [turns, setTurns] = useState(0)
  const boardRef = useRef(null)
  const stateRef = useRef({ playerPos: 0, compPos: 0, turns: 0 })

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
      const w = Math.min(380, parentW - 16, (window.__utBoardH || 1e9) - 16, vpW - 32)
      setBoardSize(Math.max(260, w))
    }
  }

  const startNew = useCallback(() => {
    setPlayerPos(0); setCompPos(0); setDice(0)
    setRolling(false); setGameOver(false); setWinner(null)
    setMessage('Your turn — roll the dice!'); setLastEvent(null); setTurns(0)
    stateRef.current = { playerPos: 0, compPos: 0, turns: 0 }
    setPlaying(true)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (!playing || gameOver || rolling) return
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); rollDice() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [playing, gameOver, rolling])

  const rollDice = useCallback(() => {
    if (rolling || gameOver) return
    setRolling(true); playDice()
    let count = 0
    const iv = setInterval(() => {
      setDice(Math.floor(Math.random() * 6) + 1)
      count++
      if (count >= 10) {
        clearInterval(iv)
        const result = Math.floor(Math.random() * 6) + 1
        setDice(result)
        setRolling(false)
        movePlayer(result)
      }
    }, 60)
  }, [rolling, gameOver])

  const movePlayer = useCallback((result) => {
    let pos = stateRef.current.playerPos + result
    if (pos > 100) pos = stateRef.current.playerPos
    let evt = null

    if (SNAKES[pos]) { evt = { type: 'snake', from: pos, to: SNAKES[pos] }; pos = SNAKES[pos]; playSnake() }
    else if (LADDERS[pos]) { evt = { type: 'ladder', from: pos, to: LADDERS[pos] }; pos = LADDERS[pos]; playLadder() }

    stateRef.current.playerPos = pos
    setPlayerPos(pos); setLastEvent(evt)

    if (pos === 100) {
      const newTurns = stateRef.current.turns + 1
      setTurns(newTurns)
      setBest(prev => { const nb = Math.max(prev, 100 - newTurns); try { localStorage.setItem(LS.BEST, String(nb)) } catch {}; return nb })
      setGameOver(true); setWinner('player'); setMessage('🎉 You win!'); playWin(); return
    }

    setMessage(evt ? (evt.type === 'snake' ? `🐍 Slid from ${evt.from} to ${evt.to}!` : `🪜 Climbed from ${evt.from} to ${evt.to}!`) : `You landed on ${pos}. Computer's turn...`)
    const newTurns = stateRef.current.turns + 1
    stateRef.current.turns = newTurns
    setTurns(newTurns)
    setTimeout(() => computerTurn(), 800)
  }, [])

  const computerTurn = useCallback(() => {
    setRolling(true); playDice()
    let count = 0
    const iv = setInterval(() => {
      setDice(Math.floor(Math.random() * 6) + 1)
      count++
      if (count >= 10) {
        clearInterval(iv)
        const result = Math.floor(Math.random() * 6) + 1
        setDice(result); setRolling(false)
        let pos = stateRef.current.compPos + result
        if (pos > 100) pos = stateRef.current.compPos
        let evt = null

        if (SNAKES[pos]) { evt = { type: 'snake', from: pos, to: SNAKES[pos] }; pos = SNAKES[pos]; playSnake() }
        else if (LADDERS[pos]) { evt = { type: 'ladder', from: pos, to: LADDERS[pos] }; pos = LADDERS[pos]; playLadder() }

        stateRef.current.compPos = pos
        setCompPos(pos); setLastEvent(evt)

        if (pos === 100) {
          setGameOver(true); setWinner('computer'); setMessage('💀 Computer wins!'); playWin(); return
        }
        setMessage(evt ? (evt.type === 'snake' ? `Computer 🐍 from ${evt.from} to ${evt.to}!` : `Computer 🪜 from ${evt.from} to ${evt.to}!`) : `Computer landed on ${pos}. Your turn!`)
      }
    }, 60)
  }, [])

  const cellSize = (boardSize - 40) / 10
  const gridSize = boardSize

  return (
    <GameShell
      name="Snakes and Ladders"
      startAction={startNew} startLabel="🎲 Roll to Start"
      title="Snakes and Ladders — Play Free Board Game Online"
      desc="Play Snakes and Ladders online for free. Roll the dice, climb ladders, dodge snakes, and race the computer to square 100!"
      icon="🐍" iconBg="rgba(34,197,94,0.08)"
      category="fun" slug="games-snakes-ladders"
      faq={[
        { q: "How do I play Snakes and Ladders?", a: "Roll the dice to move your piece forward. Land on a ladder to climb up, or a snake to slide down. First to reach square 100 wins!" },
        { q: "Can I play against the computer?", a: "Yes! You play against a computer opponent who takes turns rolling the dice after you." },
        { q: "What do ladders and snakes do?", a: "Ladders let you skip ahead to a higher square. Snakes send you back down to a lower square. Plan your luck wisely!" },
        { q: "How do I play Snakes and Ladders — Play Free Board Game Online online free?", a: "Click Start and press the Roll button or hit Space/Enter. Use mouse, touch, or keyboard. No download needed." },
        { q: "Can I play Snakes and Ladders — Play Free Board Game Online without downloading?", a: "Yes. This Snakes and Ladders — Play Free Board Game Online runs in your browser with no install. Free on mobile and desktop." },
        { q: "Is this Snakes and Ladders — Play Free Board Game Online free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        "Roll the dice by pressing Space, Enter, or tapping the Roll button.",
        "Your piece moves forward by the number shown on the dice.",
        "Ladders boost you ahead; snakes slide you back.",
        "First player to reach square 100 wins the game!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Snakes and Ladders", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/snakes-ladders/",
        "genre": "Board Game",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="min-w-0 space-y-5">
        {!playing && (
          <div className="glass p-6 text-center">
            <div className="text-5xl mb-3">🎲</div>
            <h2 className="text-xl font-bold text-white mb-2">Snakes and Ladders</h2>
            <p className="text-sm text-slate-400 mb-4">Roll the dice, climb ladders, dodge snakes!</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="glass p-3 rounded-xl"><div className="text-lg font-bold text-white">🪜 9 Ladders</div><div className="text-xs text-slate-400">Climb up!</div></div>
              <div className="glass p-3 rounded-xl"><div className="text-lg font-bold text-white">🐍 10 Snakes</div><div className="text-xs text-slate-400">Watch out!</div></div>
            </div>
            {best > 0 && <p className="text-xs text-slate-400 mb-3">Best efficiency: {best}</p>}
            <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 transition-all">🎲 Roll to Start</button>
          </div>
        )}

        {playing && (
          <>
            <div className="flex gap-3 items-center justify-between">
              <div className="flex gap-2">
                <div className="px-3 py-2 glass text-sm font-bold text-white">🎲 {dice || '—'}</div>
                <div className="px-3 py-2 glass text-sm text-green-400">🧑 {playerPos}</div>
                <div className="px-3 py-2 glass text-sm text-red-400">🤖 {compPos}</div>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-2 glass text-xs text-slate-400">Turn {turns + 1}</div>
                <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">⟲</button>
                <button onClick={() => setPlaying(false)} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">⟵</button>
              </div>
            </div>

            <div ref={boardRef} className="glass p-2">
              <div className="relative mx-auto" style={{ width: gridSize, height: gridSize }}>
                {[...Array(10)].map((_, r) => [...Array(10)].map((_, c) => {
                  const row = 9 - r
                  const num = row * 10 + ((row % 2 === 0) ? (c + 1) : (10 - c))
                  const isSnake = !!SNAKES[num]
                  const isLadder = !!LADDERS[num]
                  const isPlayer = playerPos === num
                  const isComp = compPos === num
                  return (
                    <div key={`${r}-${c}`} className="absolute flex items-center justify-center rounded transition-all duration-200" style={{
                      left: c * cellSize, top: r * cellSize, width: cellSize, height: cellSize,
                      background: (r + c) % 2 === 0 ? '#1e293b' : '#0f172a',
                      border: isSnake ? '1px solid #ef4444' : isLadder ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.05)',
                      fontSize: Math.max(9, cellSize * 0.25),
                    }}>
                      <span className="text-slate-500 font-medium">{num}</span>
                      {isSnake && <span className="absolute" style={{ fontSize: Math.max(10, cellSize * 0.3) }}>🐍</span>}
                      {isLadder && <span className="absolute" style={{ fontSize: Math.max(10, cellSize * 0.3) }}>🪜</span>}
                      {isPlayer && <span className="absolute -top-1 -right-1 text-xs">🧑</span>}
                      {isComp && <span className="absolute -bottom-1 -left-1 text-xs">🤖</span>}
                    </div>
                  )
                }))}
                {(gameOver || winner) && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10">
                    <div className="text-4xl mb-2">{winner === 'player' ? '🎉' : '💀'}</div>
                    <h2 className="text-xl font-bold text-white mb-2">{winner === 'player' ? 'You Win!' : 'Computer Wins!'}</h2>
                    <p className="text-sm text-slate-400 mb-4">Turns taken: {turns}</p>
                    <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 transition-all">Play Again</button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-3">
              {!gameOver && !rolling && (
                <button onClick={rollDice} className="px-8 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 transition-all">
                  🎲 Roll Dice
                </button>
              )}
              {rolling && <div className="px-6 py-3 glass text-sm text-slate-400 animate-pulse">Rolling...</div>}
            </div>

            <div className="text-center glass p-3 rounded-xl">
              <p className="text-sm text-white">{message}</p>
              {lastEvent && <p className="text-xs text-slate-400 mt-1">{lastEvent.type === 'snake' ? `🐍 Snake: ${lastEvent.from} → ${lastEvent.to}` : `🪜 Ladder: ${lastEvent.from} → ${lastEvent.to}`}</p>}
            </div>
          </>
        )}
        <p className="text-center text-xs text-slate-400">Tip: Press Space or Enter to roll. Arrow keys disabled — dice only!</p>
      </div>
    </GameShell>
  )
}
