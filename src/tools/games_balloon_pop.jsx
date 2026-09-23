import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const LS = { BEST: 'ut_Balloon Pop_best_v1' }
const GAME_DURATION = 45
const BALLOON_SIZE = 48
const GOLDEN_CHANCE = 0.12
const MISS_PENALTY = 3
const POP_POINTS = 10
const GOLDEN_POINTS = 30

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); return audioCtx }
function playTone(freq, dur, type = 'sine', vol = 0.08) {
  try { const ctx = ensureAudio(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(vol, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur) } catch {}
}
function playPop() { playTone(800, 0.08, 'sine', 0.06) }
function playGold() { playTone(1200, 0.12, 'sine', 0.08); setTimeout(() => playTone(1600, 0.1, 'sine', 0.06), 60) }
function playMiss() { playTone(200, 0.15, 'sawtooth', 0.05) }

const BALLOON_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6',
]

function createBalloon(w, h) {
  const golden = Math.random() < GOLDEN_CHANCE
  return {
    id: Date.now() + Math.random(),
    x: BALLOON_SIZE / 2 + Math.random() * (w - BALLOON_SIZE * 2),
    y: h + BALLOON_SIZE,
    speed: 1.2 + Math.random() * 1.8 + (golden ? 0.5 : 0),
    color: golden ? '#fbbf24' : BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
    golden,
    size: golden ? BALLOON_SIZE + 6 : BALLOON_SIZE,
    wobble: Math.random() * Math.PI * 2,
    wobbleAmp: 0.5 + Math.random() * 1,
    alive: true,
    popFrame: 0,
  }
}

export default function games_balloon_pop() {
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => { try { return Number(localStorage.getItem(LS.BEST) || 0) } catch { return 0 } })
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [gameOver, setGameOver] = useState(false)
  const [pops, setPops] = useState(0)
  const [misses, setMisses] = useState(0)
  const [canvasSize, setCanvasSize] = useState(380)
  const [popEffects, setPopEffects] = useState([])
  const canvasRef = useRef(null)
  const stateRef = useRef({ balloons: [], score: 0, pops: 0, misses: 0, running: false })
  const timerRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => { resizeBoard() }, [])
  useEffect(() => {
    const h = () => resizeBoard()
    window.addEventListener('resize', h)
    window.addEventListener('ut:board-h', h)
    return () => { window.removeEventListener('resize', h); window.removeEventListener('ut:board-h', h) }
  }, [])

  const resizeBoard = () => {
    const c = canvasRef.current
    if (c && c.parentElement) {
      const parentW = c.parentElement.clientWidth
      const vpW = window.innerWidth
      const w = Math.min(380, parentW - 16, (window.__utBoardH || 1e9) - 16, vpW - 32)
      setCanvasSize(Math.max(260, w))
    }
  }

  const startNew = useCallback(() => {
    stateRef.current = { balloons: [], score: 0, pops: 0, misses: 0, running: true }
    setScore(0); setPops(0); setMisses(0); setPopEffects([])
    setTimeLeft(GAME_DURATION); setGameOver(false); setPlaying(true)
    // Spawn initial balloons
    const w = canvasSize
    const h = canvasSize
    const balloons = []
    for (let i = 0; i < 6; i++) {
      const b = createBalloon(w, h)
      b.y = Math.random() * h
      balloons.push(b)
    }
    stateRef.current.balloons = balloons
  }, [canvasSize])

  useEffect(() => {
    if (!playing || gameOver) return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); endGame(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [playing, gameOver])

  const endGame = useCallback(() => {
    stateRef.current.running = false
    const s = stateRef.current.score
    setBest(prev => { const nb = Math.max(prev, s); try { localStorage.setItem(LS.BEST, String(nb)) } catch {}; return nb })
    setGameOver(true)
  }, [])

  useEffect(() => {
    if (!playing || gameOver) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let lastSpawn = 0

    const loop = (ts) => {
      if (!stateRef.current.running) return
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, '#0b1628')
      grad.addColorStop(1, '#1e293b')
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h)

      // Spawn new balloons
      if (ts - lastSpawn > 1200) {
        lastSpawn = ts
        stateRef.current.balloons.push(createBalloon(w, h))
      }

      // Update and draw balloons
      const balloons = stateRef.current.balloons
      for (let i = balloons.length - 1; i >= 0; i--) {
        const b = balloons[i]
        if (!b.alive) continue
        b.y -= b.speed
        b.wobble += 0.03
        const wx = b.x + Math.sin(b.wobble) * b.wobbleAmp * 8

        if (b.y < -b.size) {
          if (b.alive) {
            stateRef.current.misses++
            setMisses(stateRef.current.misses)
            if (!b.golden) {
              stateRef.current.score = Math.max(0, stateRef.current.score - MISS_PENALTY)
              setScore(stateRef.current.score)
            }
          }
          balloons.splice(i, 1)
          continue
        }

        // Draw balloon
        ctx.save()
        ctx.translate(wx, b.y)
        // Balloon body
        ctx.beginPath()
        ctx.ellipse(0, 0, b.size * 0.4, b.size * 0.5, 0, 0, Math.PI * 2)
        ctx.fillStyle = b.color
        ctx.fill()
        // Shine
        ctx.beginPath()
        ctx.ellipse(-b.size * 0.12, -b.size * 0.15, b.size * 0.08, b.size * 0.12, -0.3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.35)'
        ctx.fill()
        // Knot
        ctx.beginPath()
        ctx.moveTo(-3, b.size * 0.48)
        ctx.lineTo(0, b.size * 0.58)
        ctx.lineTo(3, b.size * 0.48)
        ctx.fillStyle = b.color
        ctx.fill()
        // String
        ctx.beginPath()
        ctx.moveTo(0, b.size * 0.58)
        ctx.lineTo(0, b.size * 0.9)
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'
        ctx.lineWidth = 1
        ctx.stroke()
        // Star for golden
        if (b.golden) {
          ctx.fillStyle = '#fff'
          ctx.font = `${b.size * 0.3}px sans-serif`
          ctx.textAlign = 'center'
          ctx.fillText('⭐', 0, b.size * 0.12)
        }
        ctx.restore()
      }

      // Draw pop effects
      const effects = stateRef.current.popEffects || []
      for (let i = effects.length - 1; i >= 0; i--) {
        const e = effects[i]
        e.life -= 0.03
        if (e.life <= 0) { effects.splice(i, 1); continue }
        ctx.save()
        ctx.globalAlpha = e.life
        ctx.fillStyle = e.golden ? '#fbbf24' : '#fff'
        ctx.font = `bold ${16 + (1 - e.life) * 12}px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText(e.golden ? `+${GOLDEN_POINTS}` : `+${POP_POINTS}`, e.x, e.y - (1 - e.life) * 20)
        // Particles
        for (let p = 0; p < 5; p++) {
          const angle = (p / 5) * Math.PI * 2
          const dist = (1 - e.life) * 30
          ctx.beginPath()
          ctx.arc(e.x + Math.cos(angle) * dist, e.y + Math.sin(angle) * dist, 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, gameOver])

  useEffect(() => {
    if (!playing || gameOver) return
    const canvas = canvasRef.current
    if (!canvas) return

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY }
    }

    const handlePop = (e) => {
      if (!stateRef.current.running) return
      e.preventDefault()
      const pos = getPos(e)
      const balloons = stateRef.current.balloons
      let popped = false
      for (let i = balloons.length - 1; i >= 0; i--) {
        const b = balloons[i]
        if (!b.alive) continue
        const bx = b.x + Math.sin(b.wobble) * b.wobbleAmp * 8
        const dx = pos.x - bx
        const dy = pos.y - b.y
        const hitR = b.size * 0.5
        if (dx * dx + dy * dy < hitR * hitR) {
          b.alive = false
          balloons.splice(i, 1)
          popped = true
          const pts = b.golden ? GOLDEN_POINTS : POP_POINTS
          stateRef.current.score += pts
          stateRef.current.pops++
          setScore(stateRef.current.score)
          setPops(stateRef.current.pops)
          stateRef.current.popEffects = stateRef.current.popEffects || []
          stateRef.current.popEffects.push({ x: bx, y: b.y, life: 1, golden: b.golden })
          if (b.golden) playGold(); else playPop()
          break
        }
      }
      if (!popped) {
        playMiss()
      }
    }

    canvas.addEventListener('click', handlePop)
    canvas.addEventListener('touchstart', handlePop, { passive: false })
    return () => {
      canvas.removeEventListener('click', handlePop)
      canvas.removeEventListener('touchstart', handlePop)
    }
  }, [playing, gameOver])

  return (
    <GameShell
      name="Balloon Pop"
      startAction={startNew} startLabel="🎈 Start Popping"
      title="Balloon Pop — Play Free Kids Popping Game Online"
      desc="Pop balloons before they float away! Golden stars give bonus points, but missing costs you. How many can you pop in 45 seconds?"
      icon="🎈" iconBg="rgba(236,72,153,0.08)"
      category="fun" slug="games-balloon-pop"
      faq={[
        { q: "How do I play Balloon Pop?", a: "Tap or click on balloons to pop them before they float off screen. Each pop earns points!" },
        { q: "What are the golden balloons?", a: "Golden balloons with a star are bonus balloons worth 3x points. Pop them for extra score!" },
        { q: "How long does a round last?", a: "Each round is 45 seconds. Pop as many balloons as you can before time runs out." },
        { q: "How do I play Balloon Pop — Play Free Kids Popping Game Online online free?", a: "Click Start and tap the balloons as they float up. Works on mobile and desktop. No download needed." },
        { q: "Can I play Balloon Pop — Play Free Kids Popping Game Online without downloading?", a: "Yes. This Balloon Pop — Play Free Kids Popping Game Online runs in your browser with no install. Free on mobile and desktop." },
        { q: "Is this Balloon Pop — Play Free Kids Popping Game Online free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        "Balloons float up from the bottom of the screen automatically.",
        "Tap or click a balloon to pop it and earn points.",
        "Golden star balloons are bonus — they're worth 3x points!",
        "Miss penalty: balloons that escape reduce your score slightly.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Balloon Pop", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/games-balloon-pop/",
        "genre": "Arcade",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="min-w-0 space-y-5">
        {!playing && (
          <div className="glass p-6 text-center">
            <div className="text-5xl mb-3">🎈</div>
            <h2 className="text-xl font-bold text-white mb-2">Balloon Pop</h2>
            <p className="text-sm text-slate-400 mb-4">Tap balloons before they escape! Golden stars = bonus!</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="glass p-3 rounded-xl"><div className="text-lg font-bold text-green-400">+{POP_POINTS}</div><div className="text-xs text-slate-400">Normal Pop</div></div>
              <div className="glass p-3 rounded-xl"><div className="text-lg font-bold text-yellow-400">+{GOLDEN_POINTS}</div><div className="text-xs text-slate-400">Golden ⭐</div></div>
              <div className="glass p-3 rounded-xl"><div className="text-lg font-bold text-red-400">-{MISS_PENALTY}</div><div className="text-xs text-slate-400">Miss Penalty</div></div>
            </div>
            {best > 0 && <p className="text-xs text-slate-400 mb-3">🏆 Best: {best}</p>}
            <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:opacity-90 transition-all">🎈 Start Popping</button>
          </div>
        )}

        {playing && (
          <>
            <div className="flex gap-3 items-center justify-between">
              <div className="flex gap-2">
                <div className="px-3 py-2 glass text-sm font-bold text-white">⭐ {score}</div>
                <div className="px-3 py-2 glass text-sm text-slate-400">Best: {best}</div>
              </div>
              <div className="flex gap-2 items-center">
                <div className={`px-3 py-2 glass text-sm font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
                  ⏱ {timeLeft}s
                </div>
                <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">⟲</button>
                <button onClick={() => { stateRef.current.running = false; setPlaying(false) }} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">⟵</button>
              </div>
            </div>

            <div className="glass p-2" ref={canvasRef}>
              <canvas
                ref={el => { canvasRef.current = el; if (el) { el.width = canvasSize; el.height = canvasSize; } }}
                style={{ width: canvasSize, height: canvasSize, borderRadius: 12, touchAction: 'none', cursor: 'pointer' }}
              />
            </div>

            <div className="flex justify-center gap-4 text-xs text-slate-400">
              <span>🎯 Popped: {pops}</span>
              <span>💨 Escaped: {misses}</span>
            </div>

            {gameOver && (
              <div className="glass p-6 text-center rounded-xl">
                <div className="text-4xl mb-2">🎉</div>
                <h2 className="text-xl font-bold text-white mb-2">Time's Up!</h2>
                <p className="text-sm text-slate-400 mb-1">Score: {score} | Popped: {pops} | Escaped: {misses}</p>
                {score >= best && score > 0 && <p className="text-sm text-yellow-400 mb-2">🏆 New Best Score!</p>}
                <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:opacity-90 transition-all">Play Again</button>
              </div>
            )}
          </>
        )}
        <p className="text-center text-xs text-slate-400">Tip: Tap/click balloons quickly. Golden stars are worth 3x!</p>
      </div>
    </GameShell>
  )
}
