import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const LS_KEY = 'ut_tambola_best_v1'
const COL_RANGES = [[1,2,3,4,5,6,7,8,9],[10,11,12,13,14,15,16,17,18,19],[20,21,22,23,24,25,26,27,28,29],[30,31,32,33,34,35,36,37,38,39],[40,41,42,43,44,45,46,47,48,49],[50,51,52,53,54,55,56,57,58,59],[60,61,62,63,64,65,66,67,68,69],[70,71,72,73,74,75,76,77,78,79],[80,81,82,83,84,85,86,87,88,89,90]]

let audioCtx = null
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}
function playTone(freq, dur, type = 'sine', vol = 0.08) {
  try {
    const ctx = ensureAudio()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type; o.frequency.value = freq
    g.gain.setValueAtTime(vol, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur)
  } catch {}
}
function playCall() { playTone(600, 0.12, 'sine', 0.07); setTimeout(() => playTone(800, 0.1, 'sine', 0.05), 80) }
function playMark() { playTone(500, 0.06, 'triangle', 0.04) }
function playWin() {
  playTone(523, 0.15, 'sine', 0.1)
  setTimeout(() => playTone(659, 0.15, 'sine', 0.1), 150)
  setTimeout(() => playTone(784, 0.3, 'sine', 0.12), 300)
}

function generateTicket() {
  const ticket = Array.from({ length: 3 }, () => Array(9).fill(0))
  const usedNums = new Set()
  for (let col = 0; col < 9; col++) {
    const range = COL_RANGES[col]
    const count = col === 0 ? 2 : col === 8 ? 1 : Math.ceil(Math.random() * 3)
    const shuffled = [...range].sort(() => Math.random() - 0.5)
    let placed = 0
    for (const num of shuffled) {
      if (placed >= count || usedNums.has(num)) continue
      const row = Math.floor(Math.random() * 3)
      if (ticket[row][col] !== 0) {
        const alt = (row + 1) % 3
        if (ticket[alt][col] !== 0) continue
        ticket[alt][col] = num
      } else {
        ticket[row][col] = num
      }
      usedNums.add(num)
      placed++
    }
  }
  // Ensure exactly 5 numbers per row
  for (let row = 0; row < 3; row++) {
    const nums = ticket[row].filter(n => n > 0)
    while (nums.length < 5) {
      for (let col = 0; col < 9; col++) {
        if (ticket[row][col] !== 0) continue
        const range = COL_RANGES[col].filter(n => !usedNums.has(n) && !ticket.flat().includes(n))
        if (range.length > 0) {
          const num = range[Math.floor(Math.random() * range.length)]
          ticket[row][col] = num
          usedNums.add(num)
          nums.push(num)
          if (nums.length >= 5) break
        }
      }
      if (nums.length >= 5) break
      break // prevent infinite loop
    }
    // Remove extras if more than 5
    const allNums = ticket[row].map((n, c) => ({ n, c })).filter(x => x.n > 0)
    while (allNums.length > 5) {
      const idx = allNums.pop()
      ticket[row][idx.c] = 0
      usedNums.delete(idx.n)
    }
  }
  return ticket
}

function checkWin(ticket, marked) {
  const topLine = ticket[0].some((n, c) => n > 0 && marked.has(c + '-' + 0 + '-' + n))
    && ticket[0].filter(n => n > 0).every((n, i) => {
      const col = ticket[0].indexOf(n)
      return marked.has(col + '-' + 0 + '-' + n)
    })
  const fullHouse = ticket.flat().filter(n => n > 0).every((n, i) => {
    const col = ticket.flat().indexOf(n)
    return marked.has(ticket.indexOf(ticket.find(row => row.includes(n))) + '-' + ticket[ticket.indexOf(ticket.find(row => row.includes(n)))].indexOf(n) + '-' + n)
  })
  const markedCount = ticket.flat().filter(n => n > 0).filter((n) => {
    const row = ticket.findIndex(r => r.includes(n))
    const col = ticket[row].indexOf(n)
    return marked.has(row + '-' + col + '-' + n)
  }).length
  return {
    earlyFive: markedCount >= 5 && !marked._earlyFiveWon,
    topLine,
    fullHouse,
    markedCount
  }
}

export default function games_tambola() {
  const [playing, setPlaying] = useState(false)
  const [ticket, setTicket] = useState(generateTicket)
  const [calledNumbers, setCalledNumbers] = useState([])
  const [marked, setMarked] = useState(() => new Set())
  const [currentNumber, setCurrentNumber] = useState(null)
  const [calledSet, setCalledSet] = useState(() => new Set())
  const [remaining, setRemaining] = useState(() => new Set(Array.from({ length: 90 }, (_, i) => i + 1)))
  const [autoMode, setAutoMode] = useState(false)
  const [wins, setWins] = useState({ earlyFive: false, topLine: false, fullHouse: false })
  const [gameOver, setGameOver] = useState(false)
  const [winMessage, setWinMessage] = useState('')
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem(LS_KEY) || 90) } catch { return 90 }
  })
  const autoRef = useRef(null)
  const markedRef = useRef(new Set())
  const winsRef = useRef({ earlyFive: false, topLine: false, fullHouse: false })
  const gameOverRef = useRef(false)

  const syncBest = useCallback((callsNeeded) => {
    setBest(prev => {
      const b = Math.min(prev, callsNeeded)
      try { localStorage.setItem(LS_KEY, String(b)) } catch {}
      return b
    })
  }, [])

  const startGame = useCallback(() => {
    const newTicket = generateTicket()
    setTicket(newTicket)
    setCalledNumbers([])
    setMarked(new Set())
    setCurrentNumber(null)
    setCalledSet(new Set())
    setRemaining(new Set(Array.from({ length: 90 }, (_, i) => i + 1)))
    setAutoMode(false)
    setWins({ earlyFive: false, topLine: false, fullHouse: false })
    setGameOver(false)
    setWinMessage('')
    markedRef.current = new Set()
    winsRef.current = { earlyFive: false, topLine: false, fullHouse: false }
    gameOverRef.current = false
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null }
    setPlaying(true)
  }, [])

  const callNumber = useCallback(() => {
    if (gameOverRef.current) return
    const remArr = Array.from(remaining)
    if (remArr.length === 0) { setGameOver(true); gameOverRef.current = true; return }
    const idx = Math.floor(Math.random() * remArr.length)
    const num = remArr[idx]
    playCall()
    setCurrentNumber(num)
    setCalledNumbers(prev => [...prev, num])
    setCalledSet(prev => new Set([...prev, num]))
    setRemaining(prev => { const s = new Set(prev); s.delete(num); return s })
  }, [remaining])

  const toggleAuto = useCallback(() => {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; setAutoMode(false); return }
    setAutoMode(true)
    autoRef.current = setInterval(() => {
      if (gameOverRef.current) { clearInterval(autoRef.current); autoRef.current = null; return }
      callNumber()
    }, 2000)
  }, [callNumber])

  const markNumber = useCallback((row, col, num) => {
    if (!calledSet.has(num) || gameOverRef.current) return
    playMark()
    const key = `${row}-${col}-${num}`
    const newMarked = new Set(markedRef.current)
    if (newMarked.has(key)) newMarked.delete(key)
    else newMarked.add(key)
    markedRef.current = newMarked
    setMarked(new Set(newMarked))

    // Check wins after marking
    const ticketFlat = ticket.flat()
    const markedCount = ticketFlat.filter(n => n > 0).filter((n) => {
      const r = ticket.findIndex(row => row.includes(n))
      const c = ticket[r].indexOf(n)
      return newMarked.has(`${r}-${c}-${n}`)
    }).length

    if (markedCount >= 5 && !winsRef.current.earlyFive) {
      winsRef.current.earlyFive = true
      setWins(prev => ({ ...prev, earlyFive: true }))
      setWinMessage('🎉 Early Five! You marked 5 numbers!')
      playWin()
      syncBest(calledNumbers.length)
    }

    const topRowNums = ticket[0].filter(n => n > 0)
    if (topRowNums.every(n => {
      const c = ticket[0].indexOf(n)
      return newMarked.has(`0-${c}-${n}`)
    }) && !winsRef.current.topLine) {
      winsRef.current.topLine = true
      setWins(prev => ({ ...prev, topLine: true }))
      setWinMessage('🏆 Top Line! First row complete!')
      playWin()
      syncBest(calledNumbers.length)
    }

    const allNums = ticketFlat.filter(n => n > 0)
    if (allNums.every(n => {
      const r = ticket.findIndex(row => row.includes(n))
      const c = ticket[r].indexOf(n)
      return newMarked.has(`${r}-${c}-${n}`)
    }) && !winsRef.current.fullHouse) {
      winsRef.current.fullHouse = true
      setWins(prev => ({ ...prev, fullHouse: true }))
      gameOverRef.current = true
      setGameOver(true)
      if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null }
      setWinMessage('🏠🏠🏠 FULL HOUSE! All numbers marked!')
      playWin()
      syncBest(calledNumbers.length)
    }
  }, [calledSet, ticket, calledNumbers.length, syncBest])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!gameOver) callNumber() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [callNumber, gameOver])

  useEffect(() => {
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [])

  const handleStartTap = (e) => {
    if (e.target.tagName === 'BUTTON') return
    if (!playing) window.dispatchEvent(new Event('ut:game-start'))
  }

  return (
    <GameShell
      name="Tambola Housie"
      startAction={startGame} startLabel="🎯 Play Tambola"
      title="Tambola Housie Online — Play Free Number Caller Game"
      desc="Play Tambola Housie online for free. Auto number caller 1-90, mark your ticket, and win with Early Five, Top Line, or Full House!"
      icon="🎯" iconBg="rgba(168,85,247,0.08)"
      category="fun" slug="games-tambola"
      faq={[
        { q: "How do I play Tambola Housie?", a: "Numbers 1-90 are called randomly. Mark matching numbers on your ticket. Win with Early Five, Top Line, or Full House!" },
        { q: "What is a Full House?", a: "Full House means all 15 numbers on your ticket are marked. It's the ultimate win in Tambola!" },
        { q: "What is Early Five?", a: "Early Five is won when you mark the first 5 numbers on your ticket that have been called. It's a bonus win!" },
        { q: "How do I play Tambola Housie Online — Play Free Number Caller Game online free?", a: "Click Start and follow the on-screen steps. Use mouse, touch, or keyboard controls. No download needed." },
        { q: "Can I play Tambola Housie Online — Play Free Number Caller Game without downloading?", a: "Yes. This Tambola Housie Online — Play Free Number Caller Game runs in your browser with no install. Free on mobile and desktop." },
        { q: "Is this Tambola Housie Online — Play Free Number Caller Game free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        "A random number between 1-90 is called each round.",
        "Click or tap matching numbers on your ticket to mark them.",
        "Win with Early Five (first 5 marks), Top Line (first row), or Full House (all numbers).",
        "Fewer calls to win means a better score. Try to beat your best!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Tambola Housie", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/games-tambola/",
        "genre": "Board Game",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="min-w-0 space-y-5">
        {!playing && (
          <div onClick={handleStartTap} className="cursor-pointer">
            <div className="glass p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-white">{best < 90 ? best : '—'}</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">Best Calls to Win</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-white">90</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">Numbers Range</div>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-slate-400 mt-3">👆 Tap anywhere to start playing</p>
          </div>
        )}

        {playing && (
          <>
            <div className="flex gap-2 items-center justify-between flex-wrap">
              <div className="flex gap-2 items-center flex-wrap">
                {currentNumber && (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white text-xl font-extrabold shadow-lg shadow-purple-500/20">
                    {currentNumber}
                  </div>
                )}
                <div className="px-3 py-2 glass text-sm font-bold text-white">Called: {calledNumbers.length}/90</div>
              </div>
              <div className="flex gap-2">
                <button onClick={callNumber} disabled={gameOver}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white hover:brightness-110 transition-all disabled:opacity-30">
                  📢 Call
                </button>
                <button onClick={toggleAuto} disabled={gameOver}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${autoMode ? 'bg-rose-500 text-white' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                  {autoMode ? '⏸ Stop' : '▶ Auto'}
                </button>
                <button onClick={() => { setPlaying(false); if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null } }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">
                  ⟵ Back
                </button>
              </div>
            </div>

            {/* Win badges */}
            <div className="flex gap-2 flex-wrap">
              {wins.earlyFive && <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold border border-yellow-500/30">⭐ Early Five</div>}
              {wins.topLine && <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">⬆ Top Line</div>}
              {wins.fullHouse && <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold border border-green-500/30">🏠 Full House</div>}
            </div>

            {/* Ticket Grid */}
            <div className="glass p-3">
              <div className="text-center text-xs text-slate-400 mb-2 font-medium">YOUR TICKET — Tap called numbers to mark</div>
              <div className="overflow-x-auto">
                <div className="inline-grid" style={{ gridTemplateColumns: 'repeat(9, minmax(36px, 1fr))', gap: 3 }}>
                  {ticket.map((row, r) => row.map((num, c) => {
                    const isCalled = num > 0 && calledSet.has(num)
                    const key = `${r}-${c}-${num}`
                    const isMarked = marked.has(key)
                    return (
                      <div key={key}
                        onClick={() => num > 0 && markNumber(r, c, num)}
                        className={`aspect-square flex items-center justify-center rounded text-xs font-bold transition-all ${num === 0 ? 'bg-transparent' : isMarked ? 'bg-green-500/30 text-green-300 border-2 border-green-500/50 scale-110 shadow-lg shadow-green-500/10' : isCalled ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 animate-pulse cursor-pointer' : 'bg-white/[0.04] text-slate-300 border border-white/[0.06]'}`}
                        style={{ minWidth: 36, minHeight: 36 }}>
                        {num > 0 ? num : ''}
                      </div>
                    )
                  }))}
                </div>
              </div>
            </div>

            {/* Called numbers */}
            {calledNumbers.length > 0 && (
              <div className="glass p-3">
                <div className="text-xs text-slate-400 mb-2 font-medium">Called Numbers ({calledNumbers.length})</div>
                <div className="flex flex-wrap gap-1">
                  {calledNumbers.map((num, i) => (
                    <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${i === calledNumbers.length - 1 ? 'bg-purple-500 text-white ring-2 ring-purple-400' : 'bg-white/[0.08] text-slate-300'}`}>
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {winMessage && (
              <div className="glass p-4 text-center">
                <div className="text-lg font-bold text-white mb-2">{winMessage}</div>
                {gameOver && (
                  <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))}
                    className="px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white hover:brightness-110 transition-all">
                    🎯 New Game
                  </button>
                )}
              </div>
            )}

            <p className="text-center text-xs text-slate-400">Space/Enter to call · Tap ticket numbers to mark</p>
          </>
        )}
      </div>
    </GameShell>
  )
}
