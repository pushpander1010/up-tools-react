import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LS = { HIGH: 'ut_cr_high', LEVEL: 'ut_cr_level' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) {
  try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {}
}
function playCorrect() { playTone(523,0.1,'sine',0.09); setTimeout(()=>playTone(784,0.15,'sine',0.09),80) }
function playWrong() { playTone(200,0.2,'sawtooth',0.06); setTimeout(()=>playTone(150,0.3,'sawtooth',0.05),100) }
function playLevelUp() { playTone(440,0.08,'sine',0.08); setTimeout(()=>playTone(554,0.08,'sine',0.08),70); setTimeout(()=>playTone(659,0.08,'sine',0.08),140); setTimeout(()=>playTone(880,0.15,'sine',0.1),210) }
function playSelect() { playTone(440,0.06,'sine',0.05) }

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100
  let r, g, b
  if (s === 0) { r = g = b = l } else {
    const hue2rgb = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1/6) return p + (q - p) * 6 * t; if (t < 1/2) return q; if (t < 2/3) return p + (q - p) * (2/3 - t) * 6; return p }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s; const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3)
  }
  return `rgb(${Math.round(r*255)},${Math.round(g*255)},${Math.round(b*255)})`
}

const GRID_SIZES = [
  { size: 3, label: '3×3' },
  { size: 4, label: '4×4' },
  { size: 5, label: '5×5' },
]

function generateGrid(size, level) {
  const baseHue = Math.random() * 360
  const baseSat = 60 + Math.random() * 30
  const baseLit = 45 + Math.random() * 15
  // Color difference decreases with level
  const diff = Math.max(2, 18 - level * 1.2)
  const oddHue = (baseHue + (Math.random() > 0.5 ? diff : -diff)) % 360
  const oddRow = Math.floor(Math.random() * size)
  const oddCol = Math.floor(Math.random() * size)
  const grid = []
  for (let r = 0; r < size; r++) {
    const row = []
    for (let c = 0; c < size; c++) {
      if (r === oddRow && c === oddCol) {
        row.push({ color: hslToRgb(oddHue, baseSat, baseLit), isOdd: true })
      } else {
        row.push({ color: hslToRgb(baseHue, baseSat, baseLit), isOdd: false })
      }
    }
    grid.push(row)
  }
  return grid
}

export default function games_color_rush() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [playing, setPlaying] = useState(false)
  const [gridSize, setGridSize] = useState(3)
  const [grid, setGrid] = useState([])
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [timer, setTimer] = useState(5)
  const [maxTimer, setMaxTimer] = useState(5)
  const [gameOver, setGameOver] = useState(false)
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem(LS.HIGH) || 0))
  const [shakeWrong, setShakeWrong] = useState(null)
  const [flashCorrect, setFlashCorrect] = useState(null)
  const timerRef = useRef(null)

  const startGame = useCallback((size) => {
    playSelect()
    setGridSize(size)
    setScore(0)
    setLevel(1)
    setTimer(5)
    setMaxTimer(5)
    setGameOver(false)
    setPlaying(true)
    setGrid(generateGrid(size, 1))
  }, [])

  const nextLevel = useCallback((currentScore, currentLevel) => {
    const newLevel = currentLevel + 1
    const newTime = Math.max(2, 5 - Math.floor(newLevel / 3) * 0.5)
    setLevel(newLevel)
    setTimer(newTime)
    setMaxTimer(newTime)
    setGrid(generateGrid(gridSize, newLevel))
    playLevelUp()
  }, [gridSize])

  const handleTap = useCallback((r, c) => {
    if (gameOver) return
    const cell = grid[r]?.[c]
    if (!cell) return
    if (cell.isOdd) {
      playCorrect()
      setFlashCorrect({ r, c })
      setTimeout(() => setFlashCorrect(null), 300)
      const newScore = score + 1
      setScore(newScore)
      nextLevel(newScore, level)
    } else {
      playWrong()
      setShakeWrong({ r, c })
      setTimeout(() => setShakeWrong(null), 400)
      setGameOver(true)
      setPlaying(false)
      const finalScore = score
      if (finalScore > highScore) {
        setHighScore(finalScore)
        try { localStorage.setItem(LS.HIGH, String(finalScore)) } catch {}
      }
    }
  }, [grid, score, level, gameOver, highScore, nextLevel])

  // Timer countdown
  useEffect(() => {
    if (!playing || gameOver) return
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current)
          playWrong()
          setGameOver(true)
          setPlaying(false)
          return 0
        }
        return Math.round((prev - 0.1) * 10) / 10
      })
    }, 100)
    return () => clearInterval(timerRef.current)
  }, [playing, gameOver, level])

  const timerPct = maxTimer > 0 ? (timer / maxTimer) * 100 : 0
  const timerColor = timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#f59e0b' : '#ef4444'

  const cellSize = gridSize <= 3 ? 'calc((min(100vw - 4rem, 400px) - 1.5rem) / 3)' :
                   gridSize <= 4 ? 'calc((min(100vw - 4rem, 400px) - 2rem) / 4)' :
                   'calc((min(100vw - 4rem, 400px) - 2.5rem) / 5)'

  return (
    <ToolLayout
      title="Color Rush Game - Test Your Eyesight"
      desc="Can you spot the odd color out? Challenge your visual perception with Color Rush. Increasingly subtle color differences test your eyes!"
      icon="🎨" iconBg="rgba(168,85,247,0.08)"
      category="fun" slug="games-color-rush"
      faq={[
        { q: "How do I play Color Rush?", a: "A grid of colored squares appears with one slightly different. Find and tap the odd one before the timer runs out!" },
        { q: "How does difficulty increase?", a: "Each level reduces the timer and makes the color difference subtler. Grid sizes of 3x3, 4x4, and 5x5 are available." },
        { q: "What's a good score?", a: "Anything over 10 is impressive! The color differences become extremely subtle at higher levels, testing even trained eyes." },
      ]}
      howItWorks={[
        "Choose a grid size: 3×3, 4×4, or 5×5.",
        "One square has a slightly different shade — find it!",
        "Tap the odd square before the timer runs out.",
        "Each level makes the color difference smaller and the timer shorter.",
        "A wrong tap ends the game — your score is how many you found!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Color Rush", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/color-rush/",
        "genre": "Puzzle", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-xl mx-auto space-y-5">
        {!playing && !gameOver ? (
          <div className="space-y-4">
            <div className="glass text-center p-4">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-lg font-extrabold text-white">{highScore}</div>
              <div className="text-xs text-slate-500">High Score</div>
            </div>
            <p className="text-center text-slate-400 text-sm">Choose your grid size</p>
            <div className="grid grid-cols-3 gap-3">
              {GRID_SIZES.map((gs) => (
                <button key={gs.size} onClick={() => startGame(gs.size)}
                  className="p-4 rounded-xl text-center transition-all hover:scale-105 active:scale-95 border border-white/[0.08]"
                  style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(168,85,247,0.04))' }}>
                  <div className="text-2xl mb-2">{gs.label}</div>
                  <div className="text-xs text-slate-400">{gs.size * gs.size} squares</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="space-y-4">
            {/* Score + Level + Timer */}
            <div className="glass p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-white">{score}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-purple-400">Lv.{level}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-extrabold" style={{color: timerColor}}>{timer.toFixed(1)}s</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Timer</div>
                </div>
              </div>
            </div>

            {/* Timer bar */}
            <div className="h-3 rounded-full overflow-hidden bg-white/[0.04] border border-white/[0.08]">
              <div className="h-full rounded-full transition-all duration-100"
                style={{ width: `${timerPct}%`, background: timerColor }}/>
            </div>

            {/* Grid */}
            <div className="flex justify-center">
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, width: `min(100vw - 4rem, 400px)` }}>
                {grid.map((row, r) => row.map((cell, c) => (
                  <button key={`${r}-${c}`} onClick={() => handleTap(r, c)}
                    className="rounded-xl transition-all active:scale-95 aspect-square"
                    style={{
                      background: cell.color,
                      boxShadow: flashCorrect?.r === r && flashCorrect?.c === c ? '0 0 20px #22c55e' :
                                  shakeWrong?.r === r && shakeWrong?.c === c ? '0 0 20px #ef4444' : 'none',
                      animation: shakeWrong?.r === r && shakeWrong?.c === c ? 'shake 0.4s ease-in-out' :
                                 flashCorrect?.r === r && flashCorrect?.c === c ? 'flash 0.3s ease-out' : 'none',
                      transform: shakeWrong?.r === r && shakeWrong?.c === c ? 'scale(1.05)' : 'scale(1)',
                    }}/>
                )))}
              </div>
            </div>

            {/* Game Over */}
            {gameOver && (
              <div className="text-center space-y-3">
                <div className="glass p-4">
                  <div className="text-3xl mb-2">{score >= highScore && score > 0 ? '🎉' : '😢'}</div>
                  <div className="text-lg font-bold text-white">Score: {score}</div>
                  {score >= highScore && score > 0 && <div className="text-sm text-green-400 mt-1">🏆 New High Score!</div>}
                  <div className="text-xs text-slate-500 mt-1">Level reached: {level}</div>
                </div>
                <div className="flex gap-2 justify-center">
                  <button onClick={() => { setPlaying(false); setGameOver(false) }}
                    className="glow-btn px-6 py-3 text-sm">
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-xs text-slate-500">High scores saved on this device.</p>
      </div>

      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes flash { 0%{filter:brightness(1.5)} 100%{filter:brightness(1)} }
      `}</style>
    </ToolLayout>
  )
}
