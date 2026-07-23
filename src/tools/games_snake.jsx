import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LS = { BEST: 'ut_snake_best_v1', LAST: 'ut_snake_last_v1' }
const GRID = 20
const CELL = 20

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) {
  try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {}
}
function playEat() { playTone(523,0.1,'sine',0.09); setTimeout(()=>playTone(784,0.12,'sine',0.06),60) }
function playDie() { playTone(220,0.3,'sawtooth',0.07); setTimeout(()=>playTone(150,0.4,'sawtooth',0.05),150) }
function playMove() { playTone(180,0.04,'triangle',0.03) }

const DIR = { UP:{x:0,y:-1}, DOWN:{x:0,y:1}, LEFT:{x:-1,y:0}, RIGHT:{x:1,y:0} }

export default function games_snake() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(()=>{try{return Number(localStorage.getItem(LS.BEST)||0)}catch{return 0}})
  const [lastScore, setLastScore] = useState(()=>{try{return Number(localStorage.getItem(LS.LAST)||0)}catch{return 0}})
  const [gameOver, setGameOver] = useState(false)
  const [speed, setSpeed] = useState(140)

  const gRef = useRef({
    snake: [{x:10,y:10}],
    dir: DIR.RIGHT,
    nextDir: DIR.RIGHT,
    food: null,
    score: 0,
    W: 400, H: 400,
    lastTick: 0,
    animId: null,
    dpr: 1,
    touchStart: null,
    playing: false,
    gameOver: false,
    speed: 140,
  })

  const placeFood = useCallback(() => {
    const s = gRef.current
    const occupied = new Set(s.snake.map(p=>`${p.x},${p.y}`))
    let pos
    do { pos = { x: Math.floor(Math.random()*GRID), y: Math.floor(Math.random()*GRID) } } while (occupied.has(`${pos.x},${pos.y}`))
    s.food = pos
  }, [])

  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const wrap = canvas.parentElement
    if (!wrap) return
    const sz = Math.min(400, wrap.clientWidth - 16)
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1))
    gRef.current.W = sz; gRef.current.H = sz; gRef.current.dpr = dpr
    canvas.width = Math.floor(sz*dpr); canvas.height = Math.floor(sz*dpr)
    canvas.style.width = sz+'px'; canvas.style.height = sz+'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr,0,0,dpr,0,0)
  }, [])

  const startGame = useCallback(() => {
    const s = gRef.current
    s.snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}]
    s.dir = DIR.RIGHT; s.nextDir = DIR.RIGHT
    s.score = 0; s.lastTick = 0
    s.playing = true; s.gameOver = false; s.speed = 140
    placeFood()
    setScore(0); setGameOver(false); setPlaying(true); setSpeed(140)
    fitCanvas()
    setTimeout(() => { startLoop() }, 30)
  }, [fitCanvas, placeFood])

  const startLoop = useCallback(() => {
    const s = gRef.current
    if (s.animId) cancelAnimationFrame(s.animId)

    const loop = (ts) => {
      if (!s.playing && s.score === 0) { s.animId = requestAnimationFrame(loop); return }
      const dt = ts - s.lastTick
      if (dt < s.speed) {
        draw()
        s.animId = requestAnimationFrame(loop)
        return
      }
      s.lastTick = ts

      if (!s.gameOver) {
        s.dir = s.nextDir
        const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y }

        // Wall collision
        if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
          die(); draw(); s.animId = requestAnimationFrame(loop); return
        }
        // Self collision
        for (const p of s.snake) {
          if (p.x === head.x && p.y === head.y) { die(); draw(); s.animId = requestAnimationFrame(loop); return }
        }

        s.snake.unshift(head)
        if (s.food && head.x === s.food.x && head.y === s.food.y) {
          s.score++
          setScore(s.score)
          playEat()
          // Speed up
          const newSpd = Math.max(50, 140 - s.score * 3)
          s.speed = newSpd
          setSpeed(newSpd)
          placeFood()
        } else {
          s.snake.pop()
        }
      }

      draw()
      s.animId = requestAnimationFrame(loop)
    }
    s.animId = requestAnimationFrame(loop)
  }, [placeFood])

  const die = useCallback(() => {
    const s = gRef.current
    s.gameOver = true
    setGameOver(true)
    playDie()
    const newBest = Math.max(best, s.score)
    setBest(newBest)
    setLastScore(s.score)
    try { localStorage.setItem(LS.BEST, String(newBest)); localStorage.setItem(LS.LAST, String(s.score)) } catch {}
  }, [best])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = gRef.current
    const ctx = canvas.getContext('2d')
    const W = s.W, H = s.H
    const cellSz = W / GRID

    // Background
    ctx.fillStyle = '#050d1a'
    ctx.fillRect(0, 0, W, H)

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i*cellSz, 0); ctx.lineTo(i*cellSz, H); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, i*cellSz); ctx.lineTo(W, i*cellSz); ctx.stroke()
    }

    // Food with glow
    if (s.food) {
      ctx.shadowColor = '#ff6b6b'
      ctx.shadowBlur = 15
      ctx.fillStyle = '#ff6b6b'
      ctx.beginPath()
      ctx.arc(s.food.x*cellSz+cellSz/2, s.food.y*cellSz+cellSz/2, cellSz/2.5, 0, Math.PI*2)
      ctx.fill()
      ctx.shadowBlur = 0
    }

    // Snake body with gradient
    for (let i = s.snake.length - 1; i >= 0; i--) {
      const p = s.snake[i]
      const t = i / Math.max(1, s.snake.length - 1)
      const r = Math.round(0 + t * 34)
      const g = Math.round(200 - t * 50)
      const b = Math.round(100 + t * 100)
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.shadowColor = i === 0 ? '#00ff88' : 'transparent'
      ctx.shadowBlur = i === 0 ? 12 : 0
      const pad = cellSz * 0.08
      ctx.beginPath()
      ctx.roundRect(p.x*cellSz+pad, p.y*cellSz+pad, cellSz-pad*2, cellSz-pad*2, 3)
      ctx.fill()
    }
    ctx.shadowBlur = 0

    // Game over overlay
    if (s.gameOver) {
      ctx.fillStyle = 'rgba(5,13,26,0.85)'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 28px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('Game Over!', W/2, H/2 - 20)
      ctx.font = '16px system-ui'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText(`Score: ${s.score}  |  Best: ${Math.max(best, s.score)}`, W/2, H/2 + 10)
      ctx.font = '14px system-ui'
      ctx.fillStyle = '#64748b'
      ctx.fillText('Tap to restart', W/2, H/2 + 40)
    }
  }, [best])

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      const s = gRef.current
      if (s.gameOver) {
        if (e.key === ' ' || e.key === 'Enter') startGame()
        return
      }
      if (!s.playing) return
      const map = { ArrowUp:DIR.UP, ArrowDown:DIR.DOWN, ArrowLeft:DIR.LEFT, ArrowRight:DIR.RIGHT,
                     w:DIR.UP, s:DIR.DOWN, a:DIR.LEFT, d:DIR.RIGHT,
                     W:DIR.UP, S:DIR.DOWN, A:DIR.LEFT, D:DIR.RIGHT }
      const nd = map[e.key]
      if (nd) {
        e.preventDefault()
        // Prevent 180 turn
        if (nd.x + s.dir.x !== 0 || nd.y + s.dir.y !== 0) {
          s.nextDir = nd
          playMove()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [startGame])

  // Touch / pointer
  const handlePointerDown = (e) => {
    gRef.current.touchStart = { x: e.clientX, y: e.clientY }
  }
  const handlePointerUp = (e) => {
    const s = gRef.current
    if (s.gameOver) { startGame(); return }
    if (!s.touchStart) return
    const dx = e.clientX - s.touchStart.x
    const dy = e.clientY - s.touchStart.y
    s.touchStart = null
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return
    let nd
    if (Math.abs(dx) > Math.abs(dy)) nd = dx > 0 ? DIR.RIGHT : DIR.LEFT
    else nd = dy > 0 ? DIR.DOWN : DIR.UP
    if (nd.x + s.dir.x !== 0 || nd.y + s.dir.y !== 0) { s.nextDir = nd; playMove() }
  }

  // Resize
  useEffect(() => { fitCanvas(); draw() }, [fitCanvas, draw])
  useEffect(() => {
    const h = () => { fitCanvas(); draw() }
    window.addEventListener('resize', h)
    return () => { window.removeEventListener('resize', h); if (gRef.current.animId) cancelAnimationFrame(gRef.current.animId) }
  }, [fitCanvas, draw])

  return (
    <ToolLayout
      title="Snake Game Online - Classic Arcade"
      desc="Play the classic Snake game online. Guide the snake to eat food and grow longer. Keyboard and touch controls. High score saved!"
      icon="🐍" iconBg="rgba(34,197,94,0.08)"
      category="fun" slug="games-snake"
      faq={[
        { q: "How do I play Snake?", a: "Use arrow keys or WASD to change direction. On mobile, swipe to steer the snake. Eat the red food to grow and score points." },
        { q: "What happens when the snake hits the wall?", a: "The game ends. Your score is compared to your best score, which is saved locally." },
        { q: "Does the game get faster?", a: "Yes! As your snake grows longer and your score increases, the speed ramps up for more challenge." },
      ]}
      howItWorks={[
        "Press Start or tap the canvas to begin.",
        "Use arrow keys (or WASD) on desktop, swipe on mobile to steer.",
        "Eat the red food to grow your snake and earn points.",
        "Avoid hitting walls or yourself. Speed increases as you score!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Snake Game", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/snake/",
        "genre": "Arcade",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-xl mx-auto space-y-5">
        {/* Stats */}
        <div className="glass p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white">{score}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-green-400">{best}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Best</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-slate-300">{lastScore}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Last</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <button onClick={startGame} className="glow-btn px-6 py-3 text-sm">
            {playing && !gameOver ? '⟲ Restart' : '▶ Start Game'}
          </button>
        </div>

        {/* Canvas */}
        <div ref={resultRef} className="glass p-3 flex justify-center overflow-hidden">
          <canvas ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            className="rounded-xl cursor-pointer"
            style={{ background: '#050d1a', touchAction: 'none' }}
          />
        </div>

        {/* Mobile D-pad hint */}
        <p className="text-center text-xs text-slate-500">
          Desktop: ← → ↑ ↓ or WASD | Mobile: Swipe to steer
        </p>
      </div>
    </ToolLayout>
  )
}
