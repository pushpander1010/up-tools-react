import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const THEMES = {
  neon: ["#06b6d4", "#ec4899", "#3b82f6", "#a855f7", "#14b8a6"],
  sunset: ["#f97316", "#8b5cf6", "#ec4899", "#ef4444", "#f43f5e"],
  emerald: ["#10b981", "#eab308", "#059669", "#84cc16", "#d97706"],
  ocean: ["#0284c7", "#06b6d4", "#3b82f6", "#0d9488", "#2563eb"],
  rainbow: ["#ef4444", "#f97316", "#eab308", "#10b981", "#3b82f6", "#6366f1", "#a855f7"],
}

const DEFAULT_NAMES = ["Emma", "Noah", "Olivia", "Liam", "Ava", "William", "Sophia", "Mason", "Isabella", "James"]

let audioCtx = null
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function playTick() {
  try {
    const ctx = ensureAudio()
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = "triangle"
    osc.frequency.setValueAtTime(650, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04)
    g.gain.setValueAtTime(0.08, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045)
    osc.connect(g); g.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + 0.05)
  } catch {}
}

function playWinSound() {
  try {
    const ctx = ensureAudio()
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]
    notes.forEach((freq, idx) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = "sine"; o.frequency.value = freq
      o.connect(g); g.connect(ctx.destination)
      g.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.09)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.45)
      o.start(ctx.currentTime + idx * 0.09)
      o.stop(ctx.currentTime + idx * 0.09 + 0.45)
    })
  } catch {}
}

export default function games_wheel_of_names() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const confettiRef = useRef(null)
  const [namesText, setNamesText] = useState(DEFAULT_NAMES.join('\n'))
  const [theme, setTheme] = useState('neon')
  const [spinDuration, setSpinDuration] = useState(5)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [removeWinner, setRemoveWinner] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const namesRef = useRef(DEFAULT_NAMES)
  const angleRef = useRef(0)
  const spinRef = useRef({ active: false, start: 0, velocity: 0, duration: 5000 })
  const lastTickRef = useRef(0)
  const animRef = useRef(null)
  const confettiActiveRef = useRef(false)
  const confettiParticles = useRef([])

  const names = namesText.split('\n').map(n => n.trim()).filter(n => n.length > 0)
  namesRef.current = names

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const container = canvas.parentElement
    if (!container) return
    const size = Math.floor(container.getBoundingClientRect().width)
    if (size < 50) return

    canvas.width = size * dpr; canvas.height = size * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, size, size)

    const center = size / 2, radius = center - 20
    const currentNames = namesRef.current

    if (currentNames.length === 0) {
      ctx.beginPath(); ctx.arc(center, center, radius, 0, 2 * Math.PI)
      ctx.fillStyle = "#1e293b"; ctx.fill()
      ctx.lineWidth = 4; ctx.strokeStyle = "#475569"; ctx.stroke()
      ctx.fillStyle = "#94a3b8"
      ctx.font = `bold ${Math.max(16, Math.min(24, size / 20))}px system-ui, sans-serif`
      ctx.textAlign = "center"; ctx.textBaseline = "middle"
      ctx.fillText("Enter names to begin", center, center)
      return
    }

    const sliceAngle = (2 * Math.PI) / currentNames.length
    const colors = THEMES[theme] || THEMES.neon

    currentNames.forEach((name, i) => {
      const startAng = angleRef.current + i * sliceAngle
      const endAng = startAng + sliceAngle

      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.arc(center, center, radius, startAng, endAng)
      ctx.closePath()
      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()
      ctx.lineWidth = 1.5; ctx.strokeStyle = "#0f172a"; ctx.stroke()

      ctx.save()
      ctx.translate(center, center)
      ctx.rotate(startAng + sliceAngle / 2)
      ctx.fillStyle = "#ffffff"
      ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 4
      let fontSize = Math.min(size / 20, Math.max(12, Math.floor(400 / currentNames.length)))
      ctx.font = `bold ${fontSize}px system-ui, sans-serif`
      ctx.textAlign = "right"; ctx.textBaseline = "middle"
      let maxTextWidth = radius - 80
      let displayName = name
      while (ctx.measureText(displayName + "...").width > maxTextWidth && displayName.length > 0) {
        displayName = displayName.slice(0, -1)
      }
      if (displayName.length < name.length) displayName += "..."
      ctx.fillText(displayName, radius - 40, 0)
      ctx.restore()
    })

    ctx.beginPath(); ctx.arc(center, center, radius, 0, 2 * Math.PI)
    ctx.lineWidth = Math.max(6, Math.min(10, size / 60))
    ctx.strokeStyle = "#1e293b"; ctx.stroke()
  }, [theme])

  useEffect(() => { drawWheel() }, [drawWheel, namesText])

  useEffect(() => {
    const handler = () => drawWheel()
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [drawWheel])

  // Confetti
  const startConfetti = useCallback(() => {
    confettiActiveRef.current = true
    confettiParticles.current = []
    const canvas = confettiRef.current
    if (canvas) {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight
    }
    for (let i = 0; i < 150; i++) {
      confettiParticles.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight - window.innerHeight,
        size: Math.random() * 8 + 4,
        color: ["#f43f5e", "#3b82f6", "#10b981", "#eab308", "#ec4899", "#8b5cf6"][Math.floor(Math.random() * 6)],
        speedY: Math.random() * 4 + 3,
        speedX: Math.random() * 3 - 1.5,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 6 - 3,
      })
    }
    const animate = () => {
      if (!confettiActiveRef.current) return
      const ctx = canvas?.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      confettiParticles.current.forEach(p => {
        p.y += p.speedY; p.x += p.speedX; p.rotation += p.rotationSpeed
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()
        if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width }
      })
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [])

  const stopConfetti = useCallback(() => {
    confettiActiveRef.current = false
    const canvas = confettiRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  const startSpin = useCallback(() => {
    if (isSpinning || names.length === 0) return
    ensureAudio()
    setIsSpinning(true)
    spinRef.current = {
      active: true,
      start: performance.now(),
      velocity: 0.4 + Math.random() * 0.25,
      duration: spinDuration * 1000,
    }
    lastTickRef.current = angleRef.current

    const animate = (timestamp) => {
      const s = spinRef.current
      if (!s.active) return
      const elapsed = timestamp - s.start
      const progress = Math.min(elapsed / s.duration, 1)

      angleRef.current = (angleRef.current + s.velocity * Math.pow(1 - progress, 3)) % (2 * Math.PI)

      const sliceAngle = (2 * Math.PI) / namesRef.current.length
      const currentTickIdx = Math.floor((angleRef.current - Math.PI / 2) / sliceAngle)
      const lastTickIdx = Math.floor((lastTickRef.current - Math.PI / 2) / sliceAngle)
      if (currentTickIdx !== lastTickIdx && soundEnabled) playTick()
      lastTickRef.current = angleRef.current

      drawWheel()

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        s.active = false
        setIsSpinning(false)
        const winningAngle = (1.5 * Math.PI - angleRef.current + 2 * Math.PI) % (2 * Math.PI)
        const winnerIdx = Math.floor(winningAngle / sliceAngle) % namesRef.current.length
        const winName = namesRef.current[winnerIdx]
        setWinner(winName)
        setShowModal(true)
        if (soundEnabled) playWinSound()
        startConfetti()
      }
    }
    animRef.current = requestAnimationFrame(animate)
  }, [isSpinning, names, spinDuration, soundEnabled, drawWheel, startConfetti])

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      confettiActiveRef.current = false
      stopConfetti()
    }
  }, [stopConfetti])

  const handleRemoveWinner = () => {
    if (winner) {
      const lines = namesText.split('\n').map(l => l.trim())
      const idx = lines.indexOf(winner)
      if (idx !== -1) { lines.splice(idx, 1); setNamesText(lines.join('\n')) }
    }
    setShowModal(false); stopConfetti()
  }

  const shuffle = () => {
    const arr = [...names]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    setNamesText(arr.join('\n'))
  }

  return (
    <ToolLayout
      title="Wheel of Names - Free Random Name Picker & Spinner"
      desc="Spin a custom wheel of names to pick a random winner! Perfect for classroom raffles, giveaways, or decision-making."
      icon="🎡" iconBg="rgba(99,102,241,0.08)"
      category="fun" slug="games-wheel-of-names"
      faq={[
        { q: "Is the spinner truly random?", a: "Yes! The spinner uses JavaScript's built-in Math.random(), providing high-quality pseudorandom numbers." },
        { q: "Can I paste hundreds of names?", a: "Yes, the wheel dynamically renders and scales text. We recommend under 100 for optimal readability." },
      ]}
      howItWorks={[
        "Enter one name per line in the text area.",
        "Choose a color theme and spin duration.",
        "Click 'Spin Wheel' to start the animation.",
        "The winner is highlighted when the wheel stops!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Wheel of Names", "applicationCategory": "GameApplication",
        "url": "https://www.uptools.in/games/wheel-of-names/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wheel */}
          <div className="space-y-5">
            <div ref={resultRef} className="relative mx-auto" style={{ maxWidth: 400 }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-white z-10"/>
              <canvas ref={canvasRef} className="w-full rounded-full" style={{ aspectRatio: '1' }} aria-label="Name spinner wheel"/>
            </div>
            <div className="text-center">
              <button onClick={startSpin} disabled={isSpinning || names.length === 0}
                className="glow-btn px-8 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50">
                🎡 Spin Wheel
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-5">
            <div className="glass rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white mb-3">📝 Edit Names</h3>
              <textarea value={namesText} onChange={e => setNamesText(e.target.value)}
                placeholder="Enter one name per line..."
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm font-mono text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none h-40"/>
              <div className="flex gap-2 mt-3">
                <button onClick={shuffle} className="px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">🔀 Shuffle</button>
                <button onClick={() => setNamesText(["1","2","3","4","5","6","7","8","9","10"].join('\n'))}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">🔢 Numbers</button>
                <button onClick={() => setNamesText('')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">🗑️ Clear</button>
              </div>
            </div>

            <div className="glass rounded-2xl p-4 space-y-5">
              <h3 className="text-sm font-bold text-white">⚙️ Settings</h3>
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Sound Effects</span>
                <input type="checkbox" checked={soundEnabled} onChange={e => setSoundEnabled(e.target.checked)}
                  className="w-5 h-5 cursor-pointer accent-indigo-500"/>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Remove Winner</span>
                <input type="checkbox" checked={removeWinner} onChange={e => setRemoveWinner(e.target.checked)}
                  className="w-5 h-5 cursor-pointer accent-indigo-500"/>
              </label>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-300">Theme</span>
                </div>
                <select value={theme} onChange={e => setTheme(e.target.value)}
                  className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/40">
                  {Object.keys(THEMES).map(t => (
                    <option key={t} value={t} className="bg-gray-900">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-300">Spin Duration</span>
                  <span className="text-sm font-bold text-indigo-400">{spinDuration}s</span>
                </div>
                <input type="range" min="2" max="10" value={spinDuration} onChange={e => setSpinDuration(+e.target.value)}
                  className="w-full cursor-pointer accent-indigo-500"/>
              </div>
            </div>
          </div>
        </div>

        {/* Winner Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center">
              <div className="text-4xl mb-2">👑</div>
              <h2 className="text-lg font-bold text-white mb-2">We have a winner!</h2>
              <div className="text-3xl font-extrabold text-indigo-400 mb-6">{winner}</div>
              <div className="flex gap-3 justify-center">
                <button onClick={() => { setShowModal(false); stopConfetti() }}
                  className="glow-btn px-6 py-3 rounded-xl text-sm font-bold text-white transition-all">
                  Got It!
                </button>
                {removeWinner && (
                  <button onClick={handleRemoveWinner}
                    className="px-6 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">
                    Remove Winner
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Confetti canvas */}
        <canvas ref={confettiRef} className="fixed inset-0 pointer-events-none z-[9999]" style={{ position: 'fixed' }}/>
      </div>
    </ToolLayout>
  )
}
