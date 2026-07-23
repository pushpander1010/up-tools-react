import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LS = { BEST: 'ut_ng_best', WINS: 'ut_ng_wins', STREAK: 'ut_ng_streak', HISTORY: 'ut_ng_history' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) {
  try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {}
}
function playGuessClose() { playTone(600,0.08,'sine',0.07); setTimeout(()=>playTone(800,0.08,'sine',0.07),50) }
function playGuessFar() { playTone(200,0.15,'triangle',0.06) }
function playWin() { playTone(523,0.12,'sine',0.09); setTimeout(()=>playTone(659,0.12,'sine',0.09),100); setTimeout(()=>playTone(784,0.12,'sine',0.09),200); setTimeout(()=>playTone(1047,0.25,'sine',0.11),300) }
function playLose() { playTone(400,0.2,'sawtooth',0.06); setTimeout(()=>playTone(300,0.3,'sawtooth',0.05),150) }
function playSelect() { playTone(440,0.06,'sine',0.05) }

const DIFFICULTIES = [
  { name: 'Easy', min: 1, max: 50, tries: 10, color: '#22c55e' },
  { name: 'Medium', min: 1, max: 100, tries: 7, color: '#f59e0b' },
  { name: 'Hard', min: 1, max: 500, tries: 10, color: '#ef4444' },
]

export default function games_number_guessing() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [difficulty, setDifficulty] = useState(null)
  const [target, setTarget] = useState(0)
  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState([])
  const [feedback, setFeedback] = useState('')
  const [feedbackColor, setFeedbackColor] = useState('#fff')
  const [triesLeft, setTriesLeft] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [best, setBest] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS.BEST) || '{}') } catch { return {} }
  })
  const [wins, setWins] = useState(() => Number(localStorage.getItem(LS.WINS) || 0))
  const [streak, setStreak] = useState(() => Number(localStorage.getItem(LS.STREAK) || 0))
  const [confetti, setConfetti] = useState(false)
  const inputRef = useRef(null)

  const startGame = useCallback((diff) => {
    playSelect()
    const d = DIFFICULTIES[diff]
    setDifficulty(diff)
    setTarget(Math.floor(Math.random() * (d.max - d.min + 1)) + d.min)
    setGuess('')
    setGuesses([])
    setFeedback('')
    setFeedbackColor('#fff')
    setTriesLeft(d.tries)
    setGameOver(false)
    setWon(false)
    setConfetti(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const makeGuess = useCallback(() => {
    if (!guess || gameOver) return
    const num = parseInt(guess)
    const d = DIFFICULTIES[difficulty]
    if (isNaN(num) || num < d.min || num > d.max) {
      setFeedback(`Enter a number between ${d.min} and ${d.max}`)
      setFeedbackColor('#f59e0b')
      playTone(300, 0.1, 'square', 0.04)
      return
    }
    const newGuesses = [...guesses, num]
    setGuesses(newGuesses)
    const newTriesLeft = triesLeft - 1

    if (num === target) {
      playWin()
      setWon(true)
      setGameOver(true)
      setConfetti(true)
      setFeedback(`🎉 Correct! It was ${target}!`)
      setFeedbackColor('#22c55e')
      const newWins = wins + 1
      const newStreak = streak + 1
      setWins(newWins)
      setStreak(newStreak)
      const used = d.tries - newTriesLeft
      const prevBest = best[difficulty]
      const newBest = prevBest ? Math.min(prevBest, used) : used
      const newBestObj = { ...best, [difficulty]: newBest }
      setBest(newBestObj)
      try {
        localStorage.setItem(LS.BEST, JSON.stringify(newBestObj))
        localStorage.setItem(LS.WINS, String(newWins))
        localStorage.setItem(LS.STREAK, String(newStreak))
      } catch {}
      setTimeout(() => setConfetti(false), 3000)
    } else if (newTriesLeft <= 0) {
      playLose()
      setGameOver(true)
      setStreak(0)
      try { localStorage.setItem(LS.STREAK, '0') } catch {}
      setFeedback(`💀 Game Over! The number was ${target}`)
      setFeedbackColor('#ef4444')
    } else {
      const diff = Math.abs(num - target)
      const range = d.max - d.min
      const pct = diff / range
      if (pct < 0.05) { playGuessClose(); setFeedback(num < target ? '🔥 Very close! A bit higher' : '🔥 Very close! A bit lower'); setFeedbackColor('#22c55e') }
      else if (pct < 0.15) { playGuessClose(); setFeedback(num < target ? '🟠 Close! Go higher' : '🟠 Close! Go lower'); setFeedbackColor('#f59e0b') }
      else if (pct < 0.3) { playGuessFar(); setFeedback(num < target ? '📉 Too low, but getting warmer' : '📈 Too high, but getting warmer'); setFeedbackColor('#f59e0b') }
      else { playGuessFar(); setFeedback(num < target ? '⬇️ Way too low!' : '⬆️ Way too high!'); setFeedbackColor('#ef4444') }
      setTriesLeft(newTriesLeft)
    }
    setGuess('')
  }, [guess, gameOver, difficulty, guesses, triesLeft, target, wins, streak, best])

  const handleKey = useCallback((e) => {
    if (e.key === 'Enter') makeGuess()
  }, [makeGuess])

  const rangeMin = difficulty !== null ? DIFFICULTIES[difficulty].min : 0
  const rangeMax = difficulty !== null ? DIFFICULTIES[difficulty].max : 100
  const lowBound = guesses.length ? Math.max(rangeMin, Math.min(...guesses.filter(g => g > target).length ? [...guesses, rangeMax].filter(g => g > target) : [rangeMax])) : rangeMin
  const highBound = guesses.length ? Math.min(rangeMax, Math.max(...guesses.filter(g => g < target).length ? [...guesses, rangeMin].filter(g => g < target) : [rangeMin])) : rangeMax

  // Calculate actual narrowing range
  let currentLow = rangeMin, currentHigh = rangeMax
  for (const g of guesses) {
    if (g < target) currentLow = Math.max(currentLow, g + 1)
    else if (g > target) currentHigh = Math.min(currentHigh, g - 1)
  }

  const barLeft = ((currentLow - rangeMin) / (rangeMax - rangeMin)) * 100
  const barWidth = ((currentHigh - currentLow) / (rangeMax - rangeMin)) * 100

  return (
    <ToolLayout
      title="Number Guessing Game - Guess the Number"
      desc="Test your luck and logic! Guess the secret number with hints. Choose difficulty and track your winning streak."
      icon="🔢" iconBg="rgba(99,102,241,0.08)"
      category="fun" slug="games-number-guessing"
      faq={[
        { q: "How do I play the Number Guessing Game?", a: "Choose a difficulty, then guess numbers. You'll get hints like 'too high' or 'too low' to narrow down the answer. Use logic to find it in the fewest tries!" },
        { q: "What do the difficulty levels mean?", a: "Easy: numbers 1-50 with 10 tries. Medium: 1-100 with 7 tries. Hard: 1-500 with 10 tries. Higher difficulties require more precise guessing." },
        { q: "Does my streak save?", a: "Yes! Your wins, streak, and best scores per difficulty are saved to your device using localStorage." },
      ]}
      howItWorks={[
        "Pick a difficulty: Easy (1-50), Medium (1-100), or Hard (1-500).",
        "Type a number and press Enter or tap Guess.",
        "Listen for audio cues and read hints: closer guesses play higher tones.",
        "The range bar shows your narrowing search area.",
        "Find the number to extend your streak — miss all tries and the streak resets!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Number Guessing Game", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/number-guessing/",
        "genre": "Puzzle", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-xl mx-auto space-y-5">
        {/* Confetti */}
        {confetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({length: 60}).map((_, i) => (
              <div key={i} className="absolute animate-bounce" style={{
                left: `${Math.random()*100}%`,
                top: `-5%`,
                animationDelay: `${Math.random()*2}s`,
                animationDuration: `${1+Math.random()*2}s`,
                fontSize: '20px',
                opacity: 0.9,
              }}>{['🎉','🎊','✨','⭐','🌟'][i%5]}</div>
            ))}
          </div>
        )}

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-3 rounded-xl bg-white/[0.06] border border-white/[0.08]">
            <div className="text-xl font-extrabold text-white">{wins}</div>
            <div className="text-xs text-slate-500">Wins</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/[0.06] border border-white/[0.08]">
            <div className="text-xl font-extrabold" style={{color: streak > 0 ? '#22c55e' : '#ef4444'}}>{streak}🔥</div>
            <div className="text-xs text-slate-500">Streak</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/[0.06] border border-white/[0.08]">
            <div className="text-xl font-extrabold text-white">{difficulty !== null && best[difficulty] ? best[difficulty] + ' tries' : '—'}</div>
            <div className="text-xs text-slate-500">Best</div>
          </div>
        </div>

        {/* Difficulty selection or game */}
        {!difficulty && difficulty !== 0 ? (
          <div className="space-y-4">
            <p className="text-center text-slate-400 text-sm">Choose your difficulty</p>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTIES.map((d, i) => (
                <button key={i} onClick={() => startGame(i)}
                  className="p-4 rounded-xl text-center transition-all hover:scale-105 active:scale-95 border border-white/[0.08]"
                  style={{ background: `linear-gradient(135deg, ${d.color}22, ${d.color}08)` }}>
                  <div className="text-2xl mb-2">{d.name === 'Easy' ? '😊' : d.name === 'Medium' ? '🤔' : '😤'}</div>
                  <div className="text-sm font-bold" style={{color: d.color}}>{d.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{d.min}-{d.max} · {d.tries} tries</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="space-y-4">
            {/* Range bar */}
            <div className="relative h-8 rounded-full overflow-hidden bg-white/[0.04] border border-white/[0.08]">
              <div className="absolute inset-y-0 rounded-full transition-all duration-500" style={{
                left: `${barLeft}%`,
                width: `${Math.max(barWidth, 2)}%`,
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                opacity: gameOver ? 0.3 : 0.7,
              }}/>
              <div className="absolute inset-0 flex items-center justify-between px-3 text-xs text-slate-400">
                <span>{rangeMin}</span>
                <span className="text-white/80 font-mono text-xs">
                  {triesLeft} tries left
                </span>
                <span>{rangeMax}</span>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className="text-center py-3 px-4 rounded-xl font-bold text-sm transition-all"
                style={{background: feedbackColor + '15', color: feedbackColor, border: `1px solid ${feedbackColor}30`}}>
                {feedback}
              </div>
            )}

            {/* Input */}
            {!gameOver && (
              <div className="flex gap-2">
                <input ref={inputRef} type="number" value={guess} onChange={e => setGuess(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={`${rangeMin} - ${rangeMax}`}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-center text-lg font-mono focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
                />
                <button onClick={makeGuess}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
                  Guess
                </button>
              </div>
            )}

            {/* Guess history */}
            {guesses.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {guesses.map((g, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-mono font-bold transition-all"
                    style={{
                      background: g === target ? '#22c55e20' : g < target ? '#3b82f620' : '#ef444420',
                      color: g === target ? '#22c55e' : g < target ? '#3b82f6' : '#ef4444',
                      border: `1px solid ${g === target ? '#22c55e40' : g < target ? '#3b82f640' : '#ef444440'}`,
                    }}>
                    {g === target ? '🎯' : g < target ? '↑' : '↓'} {g}
                  </span>
                ))}
              </div>
            )}

            {/* Game over actions */}
            {gameOver && (
              <div className="text-center space-y-3">
                <button onClick={() => { setDifficulty(null); setConfetti(false) }}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
                  {won ? '🎉 Play Again' : 'Try Again'}
                </button>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-xs text-slate-500">Best scores and streaks saved on this device.</p>
      </div>
    </ToolLayout>
  )
}
