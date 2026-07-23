import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LS = { HIGH: 'ut_simon_high' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) { try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {} }

const COLORS = [
  { id: 0, name: 'green', color: '#22c55e', activeColor: '#4ade80', freq: 392, bgClass: 'bg-green-500', activeBgClass: 'bg-green-300' },
  { id: 1, name: 'red', color: '#ef4444', activeColor: '#fca5a5', freq: 329.6, bgClass: 'bg-red-500', activeBgClass: 'bg-red-300' },
  { id: 2, name: 'yellow', color: '#eab308', activeColor: '#fde047', freq: 261.6, bgClass: 'bg-yellow-500', activeBgClass: 'bg-yellow-300' },
  { id: 3, name: 'blue', color: '#3b82f6', activeColor: '#93c5fd', freq: 440, bgClass: 'bg-blue-500', activeBgClass: 'bg-blue-300' },
]

const WRONG_COLOR = '#ef4444'

function playColorTone(colorId, dur = 0.4) {
  const c = COLORS[colorId]
  playTone(c.freq, dur, 'sine', 0.1)
}

function playError() {
  playTone(150, 0.5, 'sawtooth', 0.1)
  setTimeout(() => playTone(100, 0.5, 'sawtooth', 0.08), 200)
}

function playSuccess() {
  [0, 80, 160].forEach((d, i) => setTimeout(() => playTone(523 + i * 132, 0.2, 'sine', 0.07), d))
}

function getSpeed(level) {
  // Speed gets faster at higher levels
  if (level <= 4) return 600
  if (level <= 8) return 500
  if (level <= 12) return 400
  if (level <= 16) return 320
  return 250
}

function getGap(level) {
  if (level <= 4) return 200
  if (level <= 8) return 150
  if (level <= 12) return 100
  return 70
}

export default function games_simon_says() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [sequence, setSequence] = useState([])
  const [playerIndex, setPlayerIndex] = useState(0)
  const [gameState, setGameState] = useState('idle') // idle, showing, input, gameover
  const [activeColor, setActiveColor] = useState(-1)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    try { return Number(localStorage.getItem(LS.HIGH)) || 0 } catch { return 0 }
  })
  const [wrongFlash, setWrongFlash] = useState(false)
  const [showFeedback, setShowFeedback] = useState('')
  const timerRef = useRef(null)
  const sequenceRef = useRef([])
  const playerIndexRef = useRef(0)

  useEffect(() => {
    sequenceRef.current = sequence
  }, [sequence])

  useEffect(() => {
    playerIndexRef.current = playerIndex
  }, [playerIndex])

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  const nextRound = useCallback((prevSequence) => {
    const next = Math.floor(Math.random() * 4)
    const newSeq = [...prevSequence, next]
    setSequence(newSeq)
    setPlayerIndex(0)
    playerIndexRef.current = 0
    setGameState('showing')
    setShowFeedback('Watch carefully...')

    // Play sequence with delays
    const speed = getSpeed(newSeq.length)
    const gap = getGap(newSeq.length)

    newSeq.forEach((colorId, i) => {
      setTimeout(() => {
        setActiveColor(colorId)
        playColorTone(colorId, speed / 1000 * 0.8)
        setTimeout(() => setActiveColor(-1), speed - gap)
      }, i * speed + 500)
    })

    setTimeout(() => {
      setGameState('input')
      setShowFeedback('Your turn!')
    }, newSeq.length * speed + 500)
  }, [])

  const startGame = useCallback(() => {
    setScore(0)
    setSequence([])
    setPlayerIndex(0)
    setWrongFlash(false)
    setShowFeedback('')
    setGameState('showing')

    // Generate and show first color
    const first = Math.floor(Math.random() * 4)
    setSequence([first])
    sequenceRef.current = [first]

    const speed = getSpeed(1)
    setTimeout(() => {
      setActiveColor(first)
      playColorTone(first, speed / 1000 * 0.8)
      setTimeout(() => {
        setActiveColor(-1)
        setGameState('input')
        setShowFeedback('Your turn!')
      }, speed)
    }, 500)
  }, [])

  const handleColorClick = useCallback((colorId) => {
    if (gameState !== 'input') return

    // Flash the color
    setActiveColor(colorId)
    playColorTone(colorId, 0.2)
    setTimeout(() => setActiveColor(-1), 200)

    const currentSeq = sequenceRef.current
    const currentIdx = playerIndexRef.current

    if (colorId === currentSeq[currentIdx]) {
      // Correct
      const nextIdx = currentIdx + 1
      setPlayerIndex(nextIdx)
      playerIndexRef.current = nextIdx

      if (nextIdx >= currentSeq.length) {
        // Completed the sequence
        const newScore = currentSeq.length
        setScore(newScore)
        playSuccess()

        if (newScore > highScore) {
          setHighScore(newScore)
          try { localStorage.setItem(LS.HIGH, String(newScore)) } catch {}
        }

        setShowFeedback(`Round ${newScore} complete!`)
        setGameState('showing')

        // Next round after brief delay
        setTimeout(() => {
          nextRound(currentSeq)
        }, 1000)
      }
    } else {
      // Wrong!
      playError()
      setWrongFlash(true)
      setShowFeedback(`Wrong! The color was ${COLORS[currentSeq[currentIdx]].name}`)
      setGameState('gameover')

      setTimeout(() => {
        setWrongFlash(false)
      }, 500)
    }
  }, [gameState, highScore, nextRound])

  // Keyboard support (1-4 keys for colors, or arrow keys)
  useEffect(() => {
    const handleKey = (e) => {
      if (gameState !== 'input') {
        if (gameState === 'idle' || gameState === 'gameover') {
          if (e.key === ' ' || e.key === 'Enter') startGame()
        }
        return
      }
      const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, 'ArrowUp': 0, 'ArrowDown': 1, 'ArrowLeft': 2, 'ArrowRight': 3 }
      if (keyMap[e.key] !== undefined) handleColorClick(keyMap[e.key])
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [gameState, handleColorClick, startGame])

  return (
    <ToolLayout
      title="Simon Says Game - Memory Challenge"
      desc="Play Simon Says online! Repeat the color sequence as it grows longer. Test your memory and reflexes in this classic arcade game."
      icon="🎮"
      iconBg="rgba(16,185,129,0.08)"
      category="fun"
      slug="games-simon-says"
      faq={[
        { q: "How do I play Simon Says?", a: "Watch the sequence of colors that light up, then repeat them in the same order by clicking the colored buttons." },
        { q: "How does the game get harder?", a: "Each round adds one more color to the sequence. The playback speed also increases at higher levels." },
        { q: "What are the keyboard controls?", a: "Use keys 1-4 or arrow keys to select colors during your turn. Press Space or Enter to start/restart." },
        { q: "How is my high score tracked?", a: "Your highest round number is saved on your device and displayed on the game screen." },
      ]}
      howItWorks={[
        "Press Start and watch the colored buttons light up in sequence.",
        "After the sequence plays, click the colors in the exact same order.",
        "Each round adds one more color to the sequence to remember.",
        "Speed increases at higher levels. How far can you go?",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Simon Says Game", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/simon-says/",
        "genre": "Memory", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-sm mx-auto space-y-5">
        {/* Stats */}
        <div ref={resultRef} className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-black/20 rounded-xl">
            <div className="text-2xl font-extrabold text-white">{score}</div>
            <div className="text-xs text-slate-500">Score (Rounds)</div>
          </div>
          <div className="p-3 bg-black/20 rounded-xl">
            <div className="text-2xl font-extrabold text-amber-400">🏆 {highScore}</div>
            <div className="text-xs text-slate-500">High Score</div>
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`text-center text-sm font-bold py-2 px-4 rounded-xl transition-colors ${
            gameState === 'gameover' ? 'bg-red-500/20 text-red-400' :
            gameState === 'showing' ? 'bg-blue-500/20 text-blue-400' :
            'bg-emerald-500/20 text-emerald-400'
          }`}>
            {showFeedback}
          </div>
        )}

        {/* Simon buttons */}
        <div className="relative mx-auto" style={{ width: '280px', height: '280px' }}>
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center z-10">
            <span className="text-xl font-bold text-white">{sequence.length || '♪'}</span>
          </div>

          {/* Four colored buttons arranged in a square */}
          {COLORS.map((c, i) => {
            const isActive = activeColor === i
            const isWrong = wrongFlash && gameState === 'gameover'

            // Position each button in a quadrant
            const positions = [
              { top: 0, left: 0 },       // top-left (green)
              { top: 0, left: '50%' },   // top-right (red)
              { top: '50%', left: 0 },   // bottom-left (yellow)
              { top: '50%', left: '50%' }, // bottom-right (blue)
            ]
            const radii = ['16px', '16px', '16px', '16px']
            radii[i === 0 ? 1 : i === 1 ? 0 : i === 2 ? 3 : 2] = '50%'

            return (
              <button key={c.id}
                onClick={() => handleColorClick(c.id)}
                disabled={gameState !== 'input'}
                className={`absolute transition-all duration-100 ${
                  gameState === 'input' ? 'active:scale-95 hover:brightness-110 cursor-pointer' : 'cursor-default'
                } ${gameState === 'idle' || gameState === 'gameover' ? 'opacity-70' : ''}`}
                style={{
                  ...positions[i],
                  width: 'calc(50% - 4px)',
                  height: 'calc(50% - 4px)',
                  borderRadius: radii.join(' '),
                  background: isWrong ? WRONG_COLOR : isActive ? c.activeColor : c.color,
                  boxShadow: isActive ? `0 0 20px ${c.activeColor}80, inset 0 0 15px ${c.activeColor}40` : 'none',
                  transform: isActive ? 'scale(1.05)' : '',
                }}>
                <span className="text-white/30 text-lg font-bold select-none">
                  {i + 1}
                </span>
              </button>
            )
          })}
        </div>

        {/* Start / Game over */}
        {(gameState === 'idle' || gameState === 'gameover') && (
          <div className="text-center space-y-3">
            {gameState === 'gameover' && (
              <>
                <div className="text-4xl">😤</div>
                <h2 className="text-xl font-bold text-white">Game Over!</h2>
                <p className="text-sm text-slate-400">You reached round {score}{score >= highScore && score > 0 ? ' — New High Score!' : ''}</p>
              </>
            )}
            {gameState === 'idle' && (
              <>
                <div className="text-5xl">🎵</div>
                <h2 className="text-xl font-bold text-white">Simon Says</h2>
                <p className="text-sm text-slate-400">Watch the sequence and repeat it. Each round gets longer and faster!</p>
              </>
            )}
            <button onClick={startGame} className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-all" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
              {gameState === 'gameover' ? 'Play Again' : 'Start Game'}
            </button>
          </div>
        )}

        <div className="text-center space-y-1">
          <p className="text-xs text-slate-500">Keyboard: 1-4 or Arrow Keys to select colors</p>
          <p className="text-xs text-slate-500">Each color has a unique sound to help you remember</p>
        </div>
      </div>
    </ToolLayout>
  )
}
