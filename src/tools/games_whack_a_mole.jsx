import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LS = { HIGH: 'ut_wam_highscore' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) { try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {} }
function playWhack() { playTone(600,0.08,'square',0.08); setTimeout(()=>playTone(800,0.06,'sine',0.05),30) }
function playMiss() { playTone(150,0.2,'sawtooth',0.04) }
function playPop() { playTone(300,0.1,'triangle',0.06) }
function playGameOver() { playTone(300,0.3,'sawtooth',0.06); setTimeout(()=>playTone(200,0.4,'sawtooth',0.05),200) }
function playNewHigh() { [0,100,200,300].forEach((d,i)=>setTimeout(()=>playTone(523+i*110,0.15,'sine',0.07),d)) }

const GAME_DURATION = 30

export default function games_whack_a_mole() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [moles, setMoles] = useState(Array(9).fill(false))
  const [moleIndex, setMoleIndex] = useState(-1)
  const [gameState, setGameState] = useState('idle') // idle, playing, gameover
  const [highScore, setHighScore] = useState(() => {
    try { return Number(localStorage.getItem(LS.HIGH)) || 0 } catch { return 0 }
  })
  const [whacking, setWhacking] = useState(-1)
  const [level, setLevel] = useState(1)
  const timerRef = useRef(null)
  const moleTimerRef = useRef(null)
  const moleTimeoutRef = useRef(null)
  const scoreRef = useRef(0)

  const getMoleSpeed = useCallback(() => {
    // Speed decreases (faster moles) as level increases
    const base = 1200
    return Math.max(350, base - (level - 1) * 100)
  }, [level])

  const getMoleShowTime = useCallback(() => {
    const base = 1000
    return Math.max(300, base - (level - 1) * 80)
  }, [level])

  const spawnMole = useCallback(() => {
    const idx = Math.floor(Math.random() * 9)
    setMoleIndex(idx)
    setMoles(prev => prev.map((_, i) => i === idx))
    playPop()

    // Auto-hide after time
    clearTimeout(moleTimeoutRef.current)
    moleTimeoutRef.current = setTimeout(() => {
      setMoles(Array(9).fill(false))
      setMoleIndex(-1)
    }, getMoleShowTime())
  }, [getMoleShowTime])

  const startGame = useCallback(() => {
    setScore(0)
    scoreRef.current = 0
    setTimeLeft(GAME_DURATION)
    setMoles(Array(9).fill(false))
    setMoleIndex(-1)
    setLevel(1)
    setGameState('playing')

    // Game timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          clearInterval(moleTimerRef.current)
          clearTimeout(moleTimeoutRef.current)
          setGameState('gameover')
          setMoles(Array(9).fill(false))
          setMoleIndex(-1)
          playGameOver()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Initial mole spawn after short delay
    setTimeout(() => {
      spawnMole()
      // Recurring mole spawn
      moleTimerRef.current = setInterval(() => {
        setMoles(Array(9).fill(false))
        setMoleIndex(-1)
        setTimeout(() => spawnMole(), 200)
      }, getMoleSpeed())
    }, 500)
  }, [spawnMole, getMoleSpeed])

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
      clearInterval(moleTimerRef.current)
      clearTimeout(moleTimeoutRef.current)
    }
  }, [])

  // Update level based on score
  useEffect(() => {
    const newLevel = Math.floor(score / 5) + 1
    if (newLevel !== level && gameState === 'playing') {
      setLevel(newLevel)
      // Restart mole timer with new speed
      clearInterval(moleTimerRef.current)
      moleTimerRef.current = setInterval(() => {
        setMoles(Array(9).fill(false))
        setMoleIndex(-1)
        setTimeout(() => spawnMole(), 200)
      }, getMoleSpeed())
    }
  }, [score, level, gameState, spawnMole, getMoleSpeed])

  // High score
  useEffect(() => {
    if (gameState === 'gameover' && score > highScore) {
      setHighScore(score)
      try { localStorage.setItem(LS.HIGH, String(score)) } catch {}
      playNewHigh()
    }
  }, [gameState, score, highScore])

  const handleWhack = useCallback((idx) => {
    if (gameState !== 'playing') return
    if (moles[idx] && idx === moleIndex) {
      // Hit!
      playWhack()
      setWhacking(idx)
      setTimeout(() => setWhacking(-1), 200)
      setMoles(Array(9).fill(false))
      setMoleIndex(-1)
      clearTimeout(moleTimeoutRef.current)
      scoreRef.current += 1
      setScore(s => s + 1)

      // Spawn next mole sooner
      setTimeout(() => spawnMole(), 150)
    } else {
      // Miss
      playMiss()
    }
  }, [gameState, moles, moleIndex, spawnMole])

  return (
    <ToolLayout
      title="Whack-a-Mole Online - Free Arcade Game"
      desc="Play Whack-a-Mole online! Tap the moles as they pop up and score points before time runs out. Difficulty increases as your score grows."
      icon="🔨"
      iconBg="rgba(234,179,8,0.08)"
      category="fun"
      slug="games-whack-a-mole"
      faq={[
        { q: "How do I play Whack-a-Mole?", a: "Click or tap on the moles as they pop up from their holes. Each successful whack earns 1 point." },
        { q: "How does the difficulty increase?", a: "Every 5 points increases the level. Moles appear faster and stay visible for shorter time at higher levels." },
        { q: "What happens if I miss?", a: "Missing a mole (clicking an empty hole) plays a miss sound but doesn't reduce your score. Only whacking moles earns points." },
        { q: "How long is each round?", a: "Each round lasts 30 seconds. Try to get the highest score before time runs out!" },
      ]}
      howItWorks={[
        "Click 'Start Game' to begin a 30-second round.",
        "Moles pop up randomly from the holes — tap or click them quickly!",
        "Every 5 points increases the level, making moles faster and harder to catch.",
        "Score as many points as possible before the timer runs out!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Whack-a-Mole Online", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/whack-a-mole/",
        "genre": "Arcade", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-sm mx-auto space-y-5">
        {/* Stats */}
        <div ref={resultRef} className="glass p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white">{score}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Score</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-extrabold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{timeLeft}s</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-amber-400">🏆 {highScore}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Best</div>
            </div>
          </div>
        </div>

        {/* Level indicator */}
        {gameState === 'playing' && (
          <div className="text-center">
            <span className="text-xs font-bold text-slate-400 bg-white/[0.06] px-3 py-1 rounded-full">
              Level {level} — Speed: {Math.round((1200 - (level-1)*100)/1000*100)}%
            </span>
          </div>
        )}

        {/* Game grid — 3x3 mole holes */}
        <div className="grid grid-cols-3 gap-3">
          {moles.map((hasMole, idx) => (
            <div key={idx}
              onClick={() => handleWhack(idx)}
              className="relative cursor-pointer select-none"
              style={{ aspectRatio: '1' }}>
              {/* Hole */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-[35%] rounded-full bg-slate-900 border-2 border-slate-700" />
              {/* Mole */}
              <div className={`absolute bottom-[10%] left-1/2 -translate-x-1/2 transition-all duration-150 ${
                hasMole ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full opacity-0 scale-50'
              } ${whacking === idx ? 'scale-125 animate-bounce' : ''}`}>
                <div className="text-5xl sm:text-6xl" style={{ filter: whacking === idx ? 'hue-rotate(120deg) brightness(1.5)' : 'none' }}>
                  {whacking === idx ? '🤕' : '🐹'}
                </div>
                {hasMole && whacking !== idx && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              {/* Dirt particles on whack */}
              {whacking === idx && (
                <>
                  <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-amber-700 rounded-full animate-ping" />
                  <div className="absolute top-[30%] right-[15%] w-1.5 h-1.5 bg-amber-600 rounded-full animate-ping" style={{animationDelay:'0.05s'}} />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Start / Game over */}
        {gameState === 'idle' && (
          <div className="text-center space-y-3">
            <div className="text-5xl">🔨</div>
            <h2 className="text-xl font-bold text-white">Whack-a-Mole!</h2>
            <p className="text-sm text-slate-400">Click or tap moles as they pop up. You have {GAME_DURATION} seconds!</p>
            <button onClick={startGame} className="glow-btn px-8 py-3 text-sm">
             Start Game
           </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="text-center p-5 glass space-y-3">
            <div className="text-4xl">{score > highScore ? '🏆' : '⏰'}</div>
            <h2 className="text-xl font-bold text-white">Time's Up!</h2>
            <p className="text-sm text-slate-400">You scored <span className="text-white font-bold">{score}</span> points{score > highScore ? ' — New High Score!' : ''}</p>
            <p className="text-xs text-slate-500">Level reached: {level}</p>
            <button onClick={startGame} className="glow-btn px-6 py-3 text-sm">
             Play Again
           </button>
          </div>
        )}

        <p className="text-center text-xs text-slate-500">Tap moles quickly! • Difficulty increases every 5 points • 30 seconds per round</p>
      </div>
    </ToolLayout>
  )
}
