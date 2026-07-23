import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LS = { STATS: 'ut_rps_stats_v1', HISTORY: 'ut_rps_history_v1' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) { try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {} }
function playSelect() { playTone(440,0.1,'sine',0.06) }
function playWin() { [0,100,200].forEach((d,i)=>setTimeout(()=>playTone(523+i*132,0.2,'sine',0.07),d)) }
function playLose() { playTone(300,0.3,'sawtooth',0.06); setTimeout(()=>playTone(200,0.4,'sawtooth',0.05),150) }
function playTie() { playTone(440,0.2,'triangle',0.05) }

const CHOICES = [
  { id: 'rock', emoji: '🪨', name: 'Rock' },
  { id: 'paper', emoji: '📄', name: 'Paper' },
  { id: 'scissors', emoji: '✂️', name: 'Scissors' },
]

function getWinner(player, computer) {
  if (player === computer) return 'tie'
  if (
    (player === 'rock' && computer === 'scissors') ||
    (player === 'paper' && computer === 'rock') ||
    (player === 'scissors' && computer === 'paper')
  ) return 'win'
  return 'lose'
}

function getComputerChoice(playerHistory) {
  // Simple adaptive AI: slightly favor counters to player's recent choices
  if (playerHistory.length < 3) {
    return CHOICES[Math.floor(Math.random() * 3)].id
  }
  const recent = playerHistory.slice(-5)
  const counts = { rock: 0, paper: 0, scissors: 0 }
  recent.forEach(c => counts[c]++)
  // Counter the most common
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const counters = { rock: 'paper', paper: 'scissors', scissors: 'rock' }
  // 60% chance to counter, 40% random
  if (Math.random() < 0.6) return counters[sorted[0][0]]
  return CHOICES[Math.floor(Math.random() * 3)].id
}

function loadStats() {
  try { return JSON.parse(localStorage.getItem(LS.STATS)) || { wins: 0, losses: 0, ties: 0, bestStreak: 0 } }
  catch { return { wins: 0, losses: 0, ties: 0, bestStreak: 0 } }
}

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(LS.HISTORY)) || [] }
  catch { return [] }
}

export default function games_rock_paper_scissors() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [bestOf, setBestOf] = useState(3)
  const [playerScore, setPlayerScore] = useState(0)
  const [computerScore, setComputerScore] = useState(0)
  const [roundResult, setRoundResult] = useState(null) // { player, computer, winner }
  const [roundHistory, setRoundHistory] = useState([])
  const [gameState, setGameState] = useState('idle') // idle, playing, gameover
  const [animating, setAnimating] = useState(false)
  const [stats, setStats] = useState(loadStats)
  const [history, setHistory] = useState(loadHistory)
  const [playerStreak, setPlayerStreak] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => { try { localStorage.setItem(LS.STATS, JSON.stringify(stats)) } catch {} }, [stats])
  useEffect(() => { try { localStorage.setItem(LS.HISTORY, JSON.stringify(history.slice(0, 20))) } catch {} }, [history])

  const winnerToText = (w) => w === 'win' ? 'You Win!' : w === 'lose' ? 'Computer Wins!' : 'Tie!'

  const handleChoice = useCallback((choice) => {
    if (animating || gameState === 'gameover') return
    playSelect()
    setAnimating(true)

    // Animate computer selection
    let animCount = 0
    const animInterval = setInterval(() => {
      animCount++
      if (animCount >= 6) {
        clearInterval(animInterval)
        const computerChoice = getComputerChoice(roundHistory.map(r => r.player))
        const result = getWinner(choice, computerChoice)
        setRoundResult({ player: choice, computer: computerChoice, winner: result })

        const newRoundHistory = [...roundHistory, { player: choice, computer: computerChoice, winner: result }]
        setRoundHistory(newRoundHistory)

        if (result === 'win') {
          const newScore = playerScore + 1
          setPlayerScore(newScore)
          setPlayerStreak(s => s + 1)
          playWin()
          if (newScore >= Math.ceil(bestOf / 2)) {
            setGameState('gameover')
            setStats(prev => ({ ...prev, wins: prev.wins + 1, bestStreak: Math.max(prev.bestStreak, playerStreak + 1) }))
            setHistory(prev => [{ result: 'win', player: choice, computer: computerChoice, time: Date.now() }, ...prev].slice(0, 20))
          }
        } else if (result === 'lose') {
          const newScore = computerScore + 1
          setComputerScore(newScore)
          setPlayerStreak(0)
          playLose()
          if (newScore >= Math.ceil(bestOf / 2)) {
            setGameState('gameover')
            setStats(prev => ({ ...prev, losses: prev.losses + 1 }))
            setHistory(prev => [{ result: 'lose', player: choice, computer: computerChoice, time: Date.now() }, ...prev].slice(0, 20))
          }
        } else {
          playTie()
          setHistory(prev => [{ result: 'tie', player: choice, computer: computerChoice, time: Date.now() }, ...prev].slice(0, 20))
        }
        setAnimating(false)
      }
    }, 80)
  }, [animating, gameState, roundHistory, playerScore, computerScore, bestOf, playerStreak])

  const startGame = useCallback((bo) => {
    setBestOf(bo)
    setPlayerScore(0)
    setComputerScore(0)
    setRoundResult(null)
    setRoundHistory([])
    setGameState('playing')
    setAnimating(false)
    setPlayerStreak(0)
  }, [])

  const resetGame = useCallback(() => {
    setGameState('idle')
    setRoundResult(null)
    setRoundHistory([])
    setPlayerScore(0)
    setComputerScore(0)
    setPlayerStreak(0)
  }, [])

  const needed = Math.ceil(bestOf / 2)
  const computerNeeded = needed

  return (
    <ToolLayout
      title="Rock Paper Scissors Online - Play vs Computer"
      desc="Play Rock Paper Scissors online against the computer! Choose your weapon and see if you can win. Track your wins and compete for the best streak."
      icon="✊"
      iconBg="rgba(234,179,8,0.08)"
      category="fun"
      slug="games-rock-paper-scissors"
      faq={[
        { q: "How does the computer choose?", a: "The computer uses an adaptive AI that slightly favors counters to your most recent choices, adding a strategic element." },
        { q: "What does 'Best of' mean?", a: "Best of 3 means the first to 2 wins. Best of 5 means first to 3 wins. Best of 1 is a single round." },
        { q: "Is my game history saved?", a: "Your last 20 games and overall statistics (wins, losses, streak) are saved locally on your device." },
        { q: "How do I start a new game?", a: "Click the 'New Game' button to start a fresh match, or select a different 'Best of' mode." },
      ]}
      howItWorks={[
        "Select your match mode: Best of 1, 3, or 5 rounds.",
        "Click Rock, Paper, or Scissors to make your choice.",
        "The computer makes an adaptive choice based on your pattern.",
        "First to win the required number of rounds wins the match!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Rock Paper Scissors Online", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/rock-paper-scissors/",
        "genre": "Game", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-lg mx-auto space-y-5">
        {/* Mode selector */}
        <div className="flex gap-2 justify-center flex-wrap">
          {[1, 3, 5].map(n => (
            <button key={n} onClick={() => startGame(n)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${bestOf === n && gameState === 'playing' ? 'text-white' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white'}`}
              style={bestOf === n && gameState === 'playing' ? { background: 'linear-gradient(135deg,#eab308,#ca8a04)' } : {}}>
              Best of {n}
            </button>
          ))}
        </div>

        {/* Scoreboard */}
        <div ref={resultRef} className="grid grid-cols-3 gap-3 items-center px-4 py-4 bg-black/20 rounded-xl border border-white/[0.06]">
          <div className="text-center">
            <div className="text-sm text-slate-400 mb-1">You</div>
            <div className="text-3xl font-extrabold text-white">{playerScore}</div>
            <div className="text-xs text-slate-500">Need {needed}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-400 mb-1">VS</div>
            <div className="text-lg font-bold text-slate-500">Best of {bestOf}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-400 mb-1">CPU</div>
            <div className="text-3xl font-extrabold text-white">{computerScore}</div>
            <div className="text-xs text-slate-500">Need {computerNeeded}</div>
          </div>
        </div>

        {/* Choice buttons */}
        <div className="grid grid-cols-3 gap-3">
          {CHOICES.map(c => (
            <button key={c.id} onClick={() => handleChoice(c.id)}
              disabled={animating || gameState === 'gameover'}
              className="flex flex-col items-center gap-2 p-4 sm:p-6 rounded-2xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.12] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <span className="text-4xl sm:text-5xl">{c.emoji}</span>
              <span className="text-sm font-bold text-slate-300">{c.name}</span>
            </button>
          ))}
        </div>

        {/* Round result */}
        {roundResult && (
          <div className="text-center p-4 bg-black/20 rounded-xl border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-center gap-4 text-3xl">
              <span className={roundResult.winner === 'win' ? 'animate-bounce' : ''}>
                {CHOICES.find(c => c.id === roundResult.player)?.emoji}
              </span>
              <span className="text-slate-500 text-lg">vs</span>
              <span className={roundResult.winner === 'lose' ? 'animate-bounce' : ''}>
                {CHOICES.find(c => c.id === roundResult.computer)?.emoji}
              </span>
            </div>
            <div className={`text-lg font-bold ${
              roundResult.winner === 'win' ? 'text-emerald-400' :
              roundResult.winner === 'lose' ? 'text-red-400' : 'text-slate-400'
            }`}>
              {winnerToText(roundResult.winner)}
            </div>
            {playerStreak >= 2 && roundResult.winner === 'win' && (
              <div className="text-sm text-amber-400 font-bold">🔥 {playerStreak} Win Streak!</div>
            )}
          </div>
        )}

        {/* Game over */}
        {gameState === 'gameover' && (
          <div className="text-center p-6 bg-black/30 rounded-2xl border border-white/[0.06] space-y-3">
            <div className="text-4xl">{playerScore >= needed ? '🏆' : '😤'}</div>
            <h2 className="text-xl font-bold text-white">
              {playerScore >= needed ? 'You Won the Match!' : 'Computer Won the Match!'}
            </h2>
            <p className="text-sm text-slate-400">Final Score: {playerScore} - {computerScore}</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => startGame(bestOf)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#eab308,#ca8a04)' }}>
                Rematch
              </button>
              <button onClick={resetGame} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                Menu
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-black/20 rounded-xl"><div className="text-sm font-bold text-emerald-400">{stats.wins}</div><div className="text-xs text-slate-500">Wins</div></div>
          <div className="p-2 bg-black/20 rounded-xl"><div className="text-sm font-bold text-red-400">{stats.losses}</div><div className="text-xs text-slate-500">Losses</div></div>
          <div className="p-2 bg-black/20 rounded-xl"><div className="text-sm font-bold text-amber-400">🔥 {stats.bestStreak}</div><div className="text-xs text-slate-500">Best Streak</div></div>
          <div className="p-2 bg-black/20 rounded-xl"><div className="text-sm font-bold text-white">{stats.wins + stats.losses}</div><div className="text-xs text-slate-500">Total</div></div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div>
            <button onClick={() => setShowHistory(h => !h)} className="text-sm text-slate-400 hover:text-white transition-colors mb-2">
              {showHistory ? 'Hide' : 'Show'} History ({history.length})
            </button>
            {showHistory && (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] rounded-lg text-xs">
                    <span className={h.result === 'win' ? 'text-emerald-400' : h.result === 'lose' ? 'text-red-400' : 'text-slate-400'}>
                      {h.result === 'win' ? '✓' : h.result === 'lose' ? '✗' : '='}
                    </span>
                    <span>{CHOICES.find(c => c.id === h.player)?.emoji} vs {CHOICES.find(c => c.id === h.computer)?.emoji}</span>
                    <span className="ml-auto text-slate-500">{new Date(h.time).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-center text-xs text-slate-500">The computer adapts to your choices • First to win the majority wins the match</p>
      </div>
    </ToolLayout>
  )
}
