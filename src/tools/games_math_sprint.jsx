import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const LS = { BEST: 'ut_Math Sprint_best_v1', LAST: 'ut_Math Sprint_last_v1' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); return audioCtx }
function playTone(freq, dur, type = 'sine', vol = 0.08) {
  try { const ctx = ensureAudio(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(vol, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur) } catch {}
}
function playCorrect() { playTone(523, 0.08, 'sine', 0.06); setTimeout(() => playTone(659, 0.08, 'sine', 0.06), 50); setTimeout(() => playTone(784, 0.1, 'sine', 0.06), 100) }
function playWrong() { playTone(200, 0.2, 'sawtooth', 0.05) }
function playStreak() { playTone(880, 0.06, 'sine', 0.05); setTimeout(() => playTone(1047, 0.08, 'sine', 0.05), 60) }

const DIFFICULTIES = [
  { label: 'Easy', ops: ['+', '-'], range: [1, 20], time: 60 },
  { label: 'Medium', ops: ['+', '-', '×'], range: [1, 50], time: 60 },
  { label: 'Hard', ops: ['+', '-', '×', '÷'], range: [1, 100], time: 60 },
]

function genProblem(diff) {
  const op = diff.ops[Math.floor(Math.random() * diff.ops.length)]
  let a, b, answer
  switch (op) {
    case '+':
      a = diff.range[0] + Math.floor(Math.random() * (diff.range[1] - diff.range[0] + 1))
      b = diff.range[0] + Math.floor(Math.random() * (diff.range[1] - diff.range[0] + 1))
      answer = a + b
      break
    case '-':
      a = diff.range[0] + Math.floor(Math.random() * (diff.range[1] - diff.range[0] + 1))
      b = diff.range[0] + Math.floor(Math.random() * Math.min(a, diff.range[1] - diff.range[0] + 1))
      answer = a - b
      break
    case '×':
      a = 2 + Math.floor(Math.random() * 12)
      b = 2 + Math.floor(Math.random() * 12)
      answer = a * b
      break
    case '÷':
      b = 2 + Math.floor(Math.random() * 12)
      answer = 2 + Math.floor(Math.random() * 12)
      a = b * answer
      break
    default:
      a = 1; b = 1; answer = 2
  }
  return { a, b, op, answer, display: `${a} ${op} ${b} = ?` }
}

export default function games_math_sprint() {
  const [best, setBest] = useState(() => { try { return Number(localStorage.getItem(LS.BEST) || 0) } catch { return 0 } })
  const [lastScore, setLastScore] = useState(() => { try { return Number(localStorage.getItem(LS.LAST) || 0) } catch { return 0 } })
  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [difficulty, setDifficulty] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [problem, setProblem] = useState(null)
  const [userInput, setUserInput] = useState('')
  const [feedback, setFeedback] = useState(null)

  const inputRef = useRef(null)
  const timerRef = useRef(null)
  const stateRef = useRef({ scoreVal: 0, streakVal: 0, correctVal: 0, wrongVal: 0, maxStreakVal: 0 })

  const initGame = useCallback((diffIdx) => {
    const diff = DIFFICULTIES[diffIdx]
    stateRef.current = { scoreVal: 0, streakVal: 0, correctVal: 0, wrongVal: 0, maxStreakVal: 0 }
    setScore(0)
    setFinalScore(0)
    setStreak(0)
    setMaxStreak(0)
    setCorrect(0)
    setWrong(0)
    setTimeLeft(diff.time)
    setFeedback(null)
    setUserInput('')
    setProblem(genProblem(diff))
    setDifficulty(diffIdx)
  }, [])

  const startGame = useCallback(() => {
    initGame(difficulty)
    setPlaying(true)
    setGameOver(false)
  }, [initGame, difficulty])

  useEffect(() => {
    if (!playing || gameOver) return
    if (inputRef.current) inputRef.current.focus()
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          // Game over
          const s = stateRef.current
          setGameOver(true)
          setPlaying(false)
          setFinalScore(s.scoreVal)
          const newBest = Math.max(best, s.scoreVal)
          setBest(newBest)
          setLastScore(s.scoreVal)
          try {
            localStorage.setItem(LS.BEST, String(newBest))
            localStorage.setItem(LS.LAST, String(s.scoreVal))
          } catch {}
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [playing, gameOver, best])

  const submitAnswer = useCallback((val) => {
    if (!playing || gameOver || !problem) return
    const numVal = Number(val)
    const s = stateRef.current
    if (numVal === problem.answer) {
      playCorrect()
      const streakBonus = Math.floor(s.streakVal / 3)
      const points = 10 + streakBonus
      s.scoreVal += points
      s.streakVal++
      s.correctVal++
      if (s.streakVal > s.maxStreakVal) s.maxStreakVal = s.streakVal
      if (s.streakVal > 0 && s.streakVal % 3 === 0) playStreak()
      setScore(s.scoreVal)
      setStreak(s.streakVal)
      setMaxStreak(s.maxStreakVal)
      setCorrect(s.correctVal)
      setFeedback({ type: 'correct', text: `+${points}` + (streakBonus > 0 ? ` (🔥${s.streakVal})` : '') })
    } else {
      playWrong()
      s.streakVal = 0
      s.wrongVal++
      setStreak(0)
      setWrong(s.wrongVal)
      setFeedback({ type: 'wrong', text: `✗ ${problem.answer}` })
    }
    setUserInput('')
    setProblem(genProblem(DIFFICULTIES[difficulty]))
    setTimeout(() => setFeedback(null), 600)
  }, [playing, gameOver, problem, difficulty])

  const handleKeyDown = useCallback((e) => {
    if (!playing || gameOver) return
    if (e.target.tagName === 'INPUT') return
    if (e.key === 'Enter' && userInput.trim() !== '') {
      e.preventDefault()
      submitAnswer(userInput.trim())
    }
  }, [playing, gameOver, userInput, submitAnswer])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleStartTap = (e) => {
    if (e.target.tagName === 'BUTTON') return
    if (!playing) window.dispatchEvent(new Event('ut:game-start'))
  }

  const timerColor = timeLeft <= 10 ? 'text-red-400' : timeLeft <= 20 ? 'text-yellow-400' : 'text-green-400'
  const timerPercent = (timeLeft / DIFFICULTIES[difficulty].time) * 100

  return (
    <GameShell
      name="Math Sprint"
      startAction={startGame} startLabel="🧮 Start Sprint"
      title="Math Sprint — Play Free Mental Maths Game Online"
      desc="Play Math Sprint online for free. Solve as many arithmetic problems as you can in 60 seconds. Choose difficulty, build streaks, and beat your high score."
      icon="🧮" iconBg="rgba(168,85,247,0.08)"
      category="fun" slug="games-math-sprint"
      faq={[
        { q: "How do I play Math Sprint?", a: "Type the answer to each arithmetic problem and press Enter. You have 60 seconds to solve as many as possible. Higher streaks earn bonus points." },
        { q: "What are the difficulty levels?", a: "Easy uses addition and subtraction (1-20). Medium adds multiplication (1-50). Hard includes division with larger numbers (1-100)." },
        { q: "How do I play Math Sprint — Play Free Mental Maths Game Online online free?", a: "Click Start and follow the on-screen steps. Use keyboard to type answers. No download needed." },
        { q: "Can I play Math Sprint — Play Free Mental Maths Game Online without downloading?", a: "Yes. This Math Sprint — Play Free Mental Maths Game Online runs in your browser with no install. Free on mobile and desktop." },
        { q: "How do I use this Math Sprint — Play Free Mental Maths Game Online online free?", a: "Open the game above and press Start. Free with no login, works on mobile and desktop." },
        { q: "Is this Math Sprint — Play Free Mental Maths Game Online free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        "Choose your difficulty level and press Start to begin the 60-second sprint.",
        "Type the answer to each math problem and press Enter to submit.",
        "Building a streak of correct answers earns bonus points every 3 in a row.",
        "Try to maximize your score before the timer runs out!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Math Sprint", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/math-sprint/",
        "genre": "Educational",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="min-w-0 space-y-5">
        {!playing && !gameOver && (
          <div onClick={handleStartTap} className="cursor-pointer">
            <div className="glass p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center"><div className="text-2xl font-extrabold text-white">{best}</div><div className="text-xs text-slate-400 font-medium mt-0.5">Best Score</div></div>
                <div className="text-center"><div className="text-2xl font-extrabold text-purple-400">🧮</div><div className="text-xs text-slate-400 font-medium mt-0.5">Math Sprint</div></div>
                <div className="text-center"><div className="text-2xl font-extrabold text-white">{lastScore}</div><div className="text-xs text-slate-400 font-medium mt-0.5">Last Score</div></div>
              </div>
              <div className="flex gap-2 justify-center mb-3">
                {DIFFICULTIES.map((d, i) => (
                  <button key={i} onClick={(e) => { e.stopPropagation(); setDifficulty(i) }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${difficulty === i ? 'bg-purple-500 text-white' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1]'}`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-center text-xs text-slate-400 mt-4">👆 Tap Start or press any key to begin</p>
          </div>
        )}
        {playing && (
          <>
            {/* Timer bar */}
            <div className="glass p-3">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold ${timerColor}`}>⏱ {timeLeft}s</span>
                <span className="text-sm font-bold text-white">{score} pts</span>
                <span className="text-xs text-slate-400">Best: {best}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${timeLeft <= 10 ? 'bg-red-500' : timeLeft <= 20 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${timerPercent}%` }} />
              </div>
            </div>
            {/* Stats row */}
            <div className="flex gap-3 justify-center text-xs">
              <div className="px-3 py-1 glass text-green-400 font-semibold">✓ {correct}</div>
              <div className="px-3 py-1 glass text-red-400 font-semibold">✗ {wrong}</div>
              <div className="px-3 py-1 glass text-orange-400 font-semibold">🔥 {streak}</div>
              <div className="px-3 py-1 glass text-slate-400">Max: {maxStreak}</div>
            </div>
            {/* Problem */}
            <div className="glass p-6 text-center">
              <div className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'monospace' }}>
                {problem?.display || '—'}
              </div>
              {/* Feedback */}
              {feedback && (
                <div className={`text-sm font-bold mb-2 ${feedback.type === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                  {feedback.text}
                </div>
              )}
              {/* Input */}
              <div className="flex gap-2 justify-center">
                <input ref={inputRef} type="number" value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && userInput.trim() !== '') { e.preventDefault(); submitAnswer(userInput.trim()) } }}
                  className="w-32 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-center text-xl font-bold outline-none focus:border-purple-400 transition-colors"
                  placeholder="?" autoFocus inputMode="numeric" />
                <button onClick={() => { if (userInput.trim() !== '') submitAnswer(userInput.trim()) }}
                  className="px-4 py-3 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-400 transition-all">
                  →
                </button>
              </div>
            </div>
            <p className="text-center text-xs text-slate-400">Type answer + Enter • Streak bonus every 3 correct!</p>
          </>
        )}
        {gameOver && (
          <div className="glass p-6 text-center">
            <div className="text-4xl mb-2">⏱️</div>
            <h2 className="text-xl font-bold text-white mb-1">Time's Up!</h2>
            <p className="text-3xl font-extrabold text-purple-400 mb-2">{finalScore}</p>
            <p className="text-xs text-slate-500 mb-1">Best: {best}</p>
            <div className="flex gap-3 justify-center my-3 text-sm">
              <span className="text-green-400">✓ {correct}</span>
              <span className="text-red-400">✗ {wrong}</span>
              <span className="text-orange-400">🔥 Best streak: {maxStreak}</span>
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={() => { window.dispatchEvent(new Event('ut:game-start')) }} className="px-6 py-3 rounded-xl text-sm font-semibold bg-purple-500 text-white hover:bg-purple-400 transition-all">🔄 Play Again</button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  )
}
