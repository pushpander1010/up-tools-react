import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

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
          if (e.key === ' ' || e.key === 'Enter') window.dispatchEvent(new Event('ut:game-start'))
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
    <GameShell
      name="SIMON SAYS"
      startAction={startGame} startLabel={gameState === 'idle' || gameState === 'gameover' ? '▶ Start' : '⟲ Restart'}
      headerStats={<><span>Rounds <b className="text-cyan-300">{score}</b></span><span>Best <b className="text-amber-300">🏆 {highScore}</b></span></>}
      title="Simon Says Game - Memory Challenge"
      desc="Test your memory in this classic color-sequence game — watch the pattern, repeat it, and see how many rounds you can survive."
      icon="🎮"
      iconBg="rgba(16,185,129,0.08)"
      category="fun"
      slug="games-simon-says"
      faq={[
        { q: "How do I play Simon Says?", a: "Watch the sequence of colors that light up, then repeat them in the same order by clicking the colored buttons." },
        { q: "How does the game get harder?", a: "Each round adds one more color to the sequence. The playback speed also increases at higher levels." },
        { q: "What are the keyboard controls?", a: "Use keys 1-4 or arrow keys to select colors during your turn. Press Space or Enter to start/restart." },
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
      <div className="flex gap-4 max-w-6xl mx-auto overflow-hidden">
        <div className="flex-1 min-w-0 max-w-sm mx-auto space-y-5 overflow-hidden">
        {/* Stats */}
        <div className="glass p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white">{score}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Score (Rounds)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-amber-400">🏆 {highScore}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">High Score</div>
            </div>
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

        {/* Welcome overlay */}
        {(gameState === 'idle' || gameState === 'gameover') && (
          <div className="relative glass p-6 text-center overflow-y-auto max-h-[70vh]"
            onPointerDown={(e) => { if (e.target.closest('button')) return; window.dispatchEvent(new Event('ut:game-start')) }}>
            <img src="/games/simon-says/cover.jpg" alt="Simon Says memory game cover art" loading="eager"
              className="w-full max-w-[420px] aspect-video object-cover rounded-2xl border border-green-400/30 shadow-[0_0_40px_rgba(16,185,129,0.35)] mb-4 mx-auto" />
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter bg-gradient-to-b from-green-300 via-emerald-300 to-blue-300 bg-clip-text text-transparent">SIMON SAYS</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-3">Memory challenge · Growing sequences · Speed ramps</p>
            <div className="flex flex-wrap justify-center gap-1.5 mb-3 text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-green-200">🎵 Audio cues</span>
              <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-blue-200">⚡ Speed ramps</span>
              <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-amber-200">🏆 High score</span>
              <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-purple-200">⌨️ 1-4 keys</span>
            </div>
            {highScore > 0 && <p className="text-xs text-amber-400 mb-2">🏆 Best: round {highScore}</p>}
            {gameState === 'gameover' && <p className="text-xs text-red-400 mb-2">You reached round {score}{score >= highScore && score > 0 ? ' — New High Score!' : ''}</p>}
            <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-extrabold text-lg shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition">▶ Start Game</button>
            <p className="text-[11px] text-slate-500 mt-3">Watch the colors, repeat the sequence</p>
          </div>
        )}

        {/* Simon buttons */}
        <div className="relative mx-auto w-full max-w-[280px]" style={{ aspectRatio: '1' }}>
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

        <div className="text-center space-y-1">
          <p className="text-xs text-slate-400">Keyboard: 1-4 or Arrow Keys to select colors</p>
          <p className="text-xs text-slate-400">Each color has a unique sound to help you remember</p>
        </div>
        </div>
      </div>
    </GameShell>
  )
}
