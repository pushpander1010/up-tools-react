import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LS = { STATE:'ut_breakout_state_v1', BEST:'ut_breakout_best_score', BESTLV:'ut_breakout_best_level', LAST:'ut_breakout_last_score', LASTLV:'ut_breakout_last_level', LASTAT:'ut_breakout_last_played', OPTS:'ut_breakout_opts' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playSound(name) {
  try {
    const ctx = ensureAudio(); const t = ctx.currentTime
    const mk = (type, freq, dur, vol) => {
      const o = ctx.createOscillator(); const g = ctx.createGain()
      o.type = type; o.frequency.setValueAtTime(freq, t)
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur)
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur)
    }
    if (name==='paddleHit') mk('triangle',280,0.06,0.06)
    else if (name==='brickBreak') mk('square',500+Math.random()*200,0.05,0.03)
    else if (name==='wallBounce') mk('sine',600,0.035,0.025)
    else if (name==='gameOver') mk('sawtooth',440,0.5,0.04)
    else if (name==='launchBall') mk('sine',300,0.12,0.03)
    else if (name==='levelUp') { [350,440,550].forEach((f,i)=>setTimeout(()=>mk('triangle',f,0.1,0.03),i*80)) }
  } catch {}
}

const COLORS = ["#7dd3fc","#93c5fd","#a5b4fc","#c4b5fd","#f0abfc","#f9a8d4","#fda4af","#fdba74"]

export default function games_breakout() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [gameState, setGameState] = useState('ready')
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [best, setBest] = useState(() => Number(localStorage.getItem(LS.BEST)||0))
  const [bestLevel, setBestLevel] = useState(() => Number(localStorage.getItem(LS.BESTLV)||1))
  const [difficulty, setDifficulty] = useState('normal')
  const [soundOn, setSoundOn] = useState(true)
  const [overlayMsg, setOverlayMsg] = useState({ title: 'Ready', desc: 'Tap to launch' })
  const [showOverlay, setShowOverlay] = useState(true)
  const [activeBuffs, setActiveBuffs] = useState([])

  const gameRef = useRef({
    W: 600, H: 400, dpr: 1,
    paddle: null, ball: null, bricks: [],
    keys: { left: false, right: false },
    fireball: 0, expandTimer: 0, shield: 0,
    lastTime: 0, animId: null
  })

  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const wrap = canvas.parentElement
    if (!wrap) return
    const w = Math.max(320, wrap.clientWidth - 16)
    const h = Math.max(260, Math.floor(w * 0.6))
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    gameRef.current.W = w; gameRef.current.H = h; gameRef.current.dpr = dpr
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr)
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const s = gameRef.current
    if (s.paddle) {
      s.paddle.y = h - h * 0.08
      s.paddle.w = Math.max(60, w * 0.14 * (s.expandTimer > 0 ? 1.4 : 1))
    }
  }, [])

  const spawnBricks = useCallback((lvl) => {
    const s = gameRef.current
    s.bricks = []
    const rows = Math.min(4 + Math.floor((lvl-1) % 8), 10)
    const cols = Math.min(8 + Math.floor((lvl-1) % 4), 14)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        s.bricks.push({ row: r, col: c, hp: 1 + Math.floor((lvl-1)/3), color: COLORS[(r+c)%COLORS.length], alive: true })
      }
    }
    // Pack to screen
    const sidePad = Math.max(8, Math.round(s.W * 0.015))
    const gap = Math.max(4, Math.round(s.W * 0.006))
    const usedW = s.W - sidePad * 2
    const bw = Math.floor((usedW - gap * (cols-1)) / cols)
    const topGap = Math.max(40, Math.round(s.H * 0.06))
    const availH = Math.max(120, Math.round(s.H * 0.52))
    const bh = Math.floor((availH - gap * (rows-1)) / rows)
    const startX = Math.floor((s.W - (bw * cols + gap * (cols-1))) / 2)
    for (const b of s.bricks) { b.w = bw; b.h = bh; b.x = startX + b.col * (bw + gap); b.y = topGap + b.row * (bh + gap) }
  }, [])

  const resetEntities = useCallback((lvl) => {
    const s = gameRef.current
    const base = { easy: 250, normal: 300, hard: 360 }[difficulty] || 300
    s.paddle = { x: s.W / 2, y: s.H - s.H * 0.08, w: Math.max(60, s.W * 0.14), h: Math.max(12, s.H * 0.018) }
    s.ball = { x: s.paddle.x, y: s.paddle.y - 14, r: Math.max(6, s.H * 0.012), vx: (Math.random()<0.5?-1:1)*base*0.58, vy: -base, launched: false }
    s.fireball = 0; s.expandTimer = 0; s.shield = 0
    spawnBricks(lvl || level)
  }, [difficulty, level, spawnBricks])

  const refreshHUD = useCallback((sc, lv, li, bst) => {
    setActiveBuffs([])
    // Update HUD via state is handled by parent
  }, [])

  const startLoop = useCallback(() => {
    const s = gameRef.current
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const loop = (timestamp) => {
      if (!playing) return
      const dt = Math.min((timestamp - (s.lastTime || timestamp)) / 1000, 0.05)
      s.lastTime = timestamp

      if (!s.paused && gameState === 'running') {
        // Move paddle
        const speed = Math.max(220, s.W * 0.45) * dt
        if (s.keys.left && s.paddle.x - s.paddle.w/2 > 0) s.paddle.x -= speed
        if (s.keys.right && s.paddle.x + s.paddle.w/2 < s.W) s.paddle.x += speed
        s.paddle.x = Math.max(s.paddle.w/2, Math.min(s.W - s.paddle.w/2, s.paddle.x))

        // Move ball
        if (s.ball.launched) {
          s.ball.x += s.ball.vx * dt
          s.ball.y += s.ball.vy * dt

          // Wall bounce
          if (s.ball.y - s.ball.r <= 0) { s.ball.y = s.ball.r; s.ball.vy = Math.abs(s.ball.vy); playSound('wallBounce') }
          if (s.ball.x - s.ball.r <= 0 || s.ball.x + s.ball.r >= s.W) { s.ball.vx *= -1; playSound('wallBounce') }

          // Paddle collision
          const py = s.paddle.y - s.paddle.h/2
          if (s.ball.vy > 0 && s.ball.y + s.ball.r >= py && s.ball.y - s.ball.r <= py + s.paddle.h &&
              s.ball.x >= s.paddle.x - s.paddle.w/2 && s.ball.x <= s.paddle.x + s.paddle.w/2) {
            s.ball.vy = -Math.abs(s.ball.vy)
            s.ball.vx += (s.ball.x - s.paddle.x) * 0.15
            const base = { easy: 250, normal: 300, hard: 360 }[difficulty] || 300
            const maxSpd = base * 1.5
            s.ball.vx = Math.max(-maxSpd, Math.min(maxSpd, s.ball.vx))
            playSound('paddleHit')
          }

          // Brick collision
          for (const b of s.bricks) {
            if (!b.alive) continue
            if (s.ball.x + s.ball.r > b.x && s.ball.x - s.ball.r < b.x + b.w &&
                s.ball.y + s.ball.r > b.y && s.ball.y - s.ball.r < b.y + b.h) {
              b.hp--
              if (b.hp <= 0) { b.alive = false; playSound('brickBreak') }
              else playSound('wallBounce')
              if (s.fireball <= 0) s.ball.vy *= -1
              setScore(prev => prev + 10)
              break
            }
          }

          // Check level complete
          if (s.bricks.every(b => !b.alive)) {
            setLevel(prev => prev + 1)
            resetEntities(level + 1)
            playSound('levelUp')
          }

          // Ball lost
          if (s.ball.y > s.H + 20) {
            if (s.shield > 0) { s.shield--; s.ball.vy = -Math.abs(s.ball.vy); s.ball.y = s.H - s.ball.r - 2 }
            else {
              setLives(prev => {
                if (prev <= 1) { setGameState('gameOver'); playSound('gameOver'); return 0 }
                return prev - 1
              })
              s.ball.launched = false
              s.ball.x = s.paddle.x; s.ball.y = s.paddle.y - s.paddle.h/2 - s.ball.r - 2
              s.ball.vx = 0; s.ball.vy = -({ easy: 250, normal: 300, hard: 360 }[difficulty] || 300)
            }
          }
        } else {
          s.ball.x = s.paddle.x; s.ball.y = s.paddle.y - s.paddle.h/2 - s.ball.r - 2
        }
      }

      // Draw
      ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, s.W, s.H)
      // Paddle
      ctx.fillStyle = '#00e5ff'
      ctx.beginPath(); ctx.roundRect(s.paddle.x - s.paddle.w/2, s.paddle.y - s.paddle.h/2, s.paddle.w, s.paddle.h, 4); ctx.fill()
      // Ball
      ctx.fillStyle = '#fff'; ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 8
      ctx.beginPath(); ctx.arc(s.ball.x, s.ball.y, s.ball.r, 0, Math.PI*2); ctx.fill()
      ctx.shadowBlur = 0
      // Bricks
      for (const b of s.bricks) {
        if (!b.alive) continue
        ctx.fillStyle = b.color
        ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, b.h, 3); ctx.fill()
      }
      // Overlay text
      if (gameState !== 'running') {
        ctx.fillStyle = 'rgba(5,13,26,.7)'; ctx.fillRect(0, 0, s.W, s.H)
        ctx.fillStyle = '#e6edf3'; ctx.font = 'bold 24px system-ui'; ctx.textAlign = 'center'
        ctx.fillText(gameState === 'gameOver' ? 'Game Over' : overlayMsg.title, s.W/2, s.H/2 - 10)
        ctx.font = '14px system-ui'; ctx.fillStyle = '#9aa4b2'
        ctx.fillText(overlayMsg.desc, s.W/2, s.H/2 + 20)
      }

      s.animId = requestAnimationFrame(loop)
    }
    s.animId = requestAnimationFrame(loop)
  }, [playing, gameState, difficulty, level, overlayMsg, resetEntities])

  useEffect(() => {
    resizeBoard()
    const h = () => resizeBoard()
    window.addEventListener('resize', h)
    return () => { window.removeEventListener('resize', h); if (gameRef.current.animId) cancelAnimationFrame(gameRef.current.animId) }
  }, [])

  const resizeBoard = () => { fitCanvas() }

  const startGame = useCallback(() => {
    setScore(0); setLevel(1); setLives(3); setGameState('ready')
    resetEntities(1)
    setShowOverlay(true); setOverlayMsg({ title: 'Ready', desc: 'Tap to launch' })
    setPlaying(true)
    setTimeout(() => { fitCanvas(); startLoop() }, 50)
  }, [resetEntities, fitCanvas, startLoop])

  const handleCanvasClick = () => {
    const s = gameRef.current
    if (gameState === 'ready' || gameState === 'running') {
      if (!s.ball.launched) {
        s.ball.launched = true
        const base = { easy: 250, normal: 300, hard: 360 }[difficulty] || 300
        s.ball.vx = (Math.random()<0.5?-1:1)*base*0.58; s.ball.vy = -base
        setGameState('running'); setShowOverlay(false)
        playSound('launchBall')
      } else {
        setGameState(g => g === 'running' ? 'paused' : 'running')
      }
    }
  }

  const handleKeyDown = useCallback((e) => {
    const s = gameRef.current
    if (e.key === 'ArrowLeft' || e.key === 'a') s.keys.left = true
    if (e.key === 'ArrowRight' || e.key === 'd') s.keys.right = true
    if (e.key === ' ' || e.key === 'p') { e.preventDefault(); handleCanvasClick() }
  }, [gameState])

  const handleKeyUp = useCallback((e) => {
    const s = gameRef.current
    if (e.key === 'ArrowLeft' || e.key === 'a') s.keys.left = false
    if (e.key === 'ArrowRight' || e.key === 'd') s.keys.right = false
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp) }
  }, [handleKeyDown, handleKeyUp])

  return (
    <ToolLayout
      title="Breakout - Free Online Game (Fast, Mobile-Perfect)"
      desc="Play Breakout online. Super responsive canvas, power-ups, auto-save, challenge friends."
      icon="🧱" iconBg="rgba(0,229,255,0.08)"
      category="fun" slug="games-breakout"
      faq={[
        { q: "How do I play Breakout?", a: "Move the paddle to bounce the ball and break all bricks. Use Arrow keys or A/D to move. Space or tap to launch/pause." },
        { q: "What power-ups are available?", a: "Shield, Sticky, Laser, x2, AutoPilot, Expand, Slow, and Fireball power-ups drop from broken bricks!" },
      ]}
      howItWorks={[
        "Select difficulty and click 'New Game'.",
        "Use keyboard arrows or touch to move the paddle.",
        "Tap the playfield or press Space to launch the ball.",
        "Break all bricks to advance to the next level!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Breakout", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/breakout/",
        "genre": "Arcade",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        {!playing ? (
          <>
            <div className="glass p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center"><div className="text-2xl font-extrabold text-white">{best}</div><div className="text-xs text-slate-500 font-medium mt-0.5">Best Score</div></div>
                <div className="text-center"><div className="text-2xl font-extrabold text-white">{bestLevel}</div><div className="text-xs text-slate-500 font-medium mt-0.5">Best Level</div></div>
                <div className="text-center"><div className="text-2xl font-extrabold text-white">{Number(localStorage.getItem(LS.LAST)||0)}</div><div className="text-xs text-slate-500 font-medium mt-0.5">Last Score</div></div>
                <div className="text-center"><div className="text-2xl font-extrabold text-white">{Number(localStorage.getItem(LS.LASTLV)||1)}</div><div className="text-xs text-slate-500 font-medium mt-0.5">Last Level</div></div>
              </div>
            </div>
            <div className="flex gap-4 items-center justify-center">
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-400">Difficulty:</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                  className="bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white outline-none">
                  <option value="easy" className="bg-gray-900">Easy 🐢</option>
                  <option value="normal" className="bg-gray-900">Normal ⚡</option>
                  <option value="hard" className="bg-gray-900">Hard 🔥</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={startGame} className="glow-btn px-6 py-3 text-sm">New Game</button>
            </div>
            <p className="text-center text-xs text-slate-500">Keyboard: ← / → or A / D. On mobile: drag to steer, tap to pause/resume.</p>
          </>
        ) : (
          <>
            {/* HUD */}
            <div className="flex gap-3 items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 glass rounded-lg text-xs font-bold text-white">Score: {score}</span>
                <span className="px-3 py-1 glass rounded-lg text-xs font-bold text-white">Level: {level}</span>
                <span className="px-3 py-1 glass rounded-lg text-xs font-bold text-red-400">♥ {lives}</span>
                <span className="px-3 py-1 glass rounded-lg text-xs font-bold text-slate-400">Best: {best}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>{gameRef.current.ball.launched=false;setGameState('ready');setShowOverlay(true);setOverlayMsg({title:'Ready',desc:'Tap to launch'})}}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">⟲</button>
                <button onClick={()=>{setPlaying(false);if(gameRef.current.animId)cancelAnimationFrame(gameRef.current.animId)}}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">⟵</button>
              </div>
            </div>

            {/* Canvas */}
            <div ref={resultRef} className="glass p-3 overflow-hidden cursor-pointer">
              <canvas ref={canvasRef} onClick={handleCanvasClick}
                className="w-full block" style={{ touchAction: 'none' }}
                aria-label="Breakout game area" />
            </div>
            <p className="text-center text-xs text-slate-500">← / → to move · Space to launch/pause</p>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
