import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const LS_KEY = 'ut_gully_cricket_best_v1'
const TOTAL_BALLS = 12

let audioCtx = null
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}
function playTone(freq, dur, type = 'sine', vol = 0.08) {
  try {
    const ctx = ensureAudio()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type; o.frequency.value = freq
    g.gain.setValueAtTime(vol, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur)
  } catch {}
}
function playHit(runs) {
  if (runs === 6) { playTone(880, 0.25, 'sine', 0.12); setTimeout(() => playTone(1320, 0.2, 'sine', 0.08), 100) }
  else if (runs === 4) { playTone(660, 0.2, 'sine', 0.1) }
  else if (runs === 2) { playTone(440, 0.15, 'triangle', 0.07) }
  else if (runs === 1) { playTone(330, 0.1, 'triangle', 0.05) }
  else { playTone(120, 0.15, 'sawtooth', 0.04) }
}
function playOverEnd() { playTone(250, 0.3, 'sawtooth', 0.05); setTimeout(() => playTone(180, 0.4, 'sawtooth', 0.04), 150) }

const RUNS_WORDS = ['DOT', '1', '2', '4', '6']
const RUNS_VALUES = [0, 1, 2, 4, 6]
const RUNS_COLORS = ['#64748b', '#60a5fa', '#34d399', '#facc15', '#f43f5e']

function getRuns(position) {
  if (position < 0.08 || position > 0.92) return 0
  if (position < 0.2) return 2
  if (position < 0.38) return 4
  if (position < 0.62) return 6
  if (position < 0.8) return 4
  return 2
}

export default function games_gully_cricket() {
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [balls, setBalls] = useState(0)
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem(LS_KEY) || 0) } catch { return 0 }
  })
  const [lastRuns, setLastRuns] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [canHit, setCanHit] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)
  const [ballX, setBallX] = useState(0)
  const [barWidth, setBarWidth] = useState(300)
  const barRef = useRef(null)
  const animRef = useRef(null)
  const dirRef = useRef(1)
  const speedRef = useRef(1.8)
  const posRef = useRef(0)
  const startedRef = useRef(false)
  const scoreRef = useRef(0)
  const ballsRef = useRef(0)
  const gameOverTimeoutRef = useRef(null)
  const nextBallTimeoutRef = useRef(null)

  const syncBest = useCallback((s) => {
    const b = Math.max(best, s)
    setBest(b)
    try { localStorage.setItem(LS_KEY, String(b)) } catch {}
  }, [best])

  const startGame = useCallback(() => {
    if (gameOverTimeoutRef.current) { clearTimeout(gameOverTimeoutRef.current); gameOverTimeoutRef.current = null }
    if (nextBallTimeoutRef.current) { clearTimeout(nextBallTimeoutRef.current); nextBallTimeoutRef.current = null }
    setScore(0); setBalls(0); setLastRuns(null); setGameOver(false); setCanHit(true)
    scoreRef.current = 0; ballsRef.current = 0
    posRef.current = 0; dirRef.current = 1
    speedRef.current = 1.8; startedRef.current = true
    setPlaying(true)
    setShowWelcome(false)
  }, [])

  const resizeBar = useCallback(() => {
    if (barRef.current) {
      const pw = barRef.current.parentElement.clientWidth
      setBarWidth(Math.max(200, Math.min(400, pw - 16)))
    }
  }, [])

  useEffect(() => { resizeBar() }, [resizeBar])
  useEffect(() => {
    const h = () => resizeBar()
    window.addEventListener('resize', h)
    window.addEventListener('ut:board-h', h)
    return () => { window.removeEventListener('resize', h); window.removeEventListener('ut:board-h', h) }
  }, [resizeBar])

  useEffect(() => {
    if (!playing || gameOver) {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      return
    }
    const barW = barWidth
    const moveBar = () => {
      if (!startedRef.current || gameOver) return
      posRef.current += speedRef.current * dirRef.current
      if (posRef.current >= barW) { posRef.current = barW; dirRef.current = -1 }
      if (posRef.current <= 0) { posRef.current = 0; dirRef.current = 1 }
      setBallX(posRef.current)
      animRef.current = requestAnimationFrame(moveBar)
    }
    animRef.current = requestAnimationFrame(moveBar)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [playing, gameOver, barWidth])

  const doHit = useCallback(() => {
    if (!playing || gameOver || !canHit) return
    startedRef.current = false
    const position = Math.max(0, Math.min(1, posRef.current / barWidth))
    const runs = getRuns(position)
    playHit(runs)
    setLastRuns(runs); setCanHit(false)

    const newScore = scoreRef.current + runs
    const newBalls = ballsRef.current + 1
    scoreRef.current = newScore
    ballsRef.current = newBalls
    setScore(newScore); setBalls(newBalls)
    syncBest(newScore)

    if (newBalls >= TOTAL_BALLS) {
      playOverEnd()
      gameOverTimeoutRef.current = setTimeout(() => { setGameOver(true); startedRef.current = false }, 600)
      return
    }

    nextBallTimeoutRef.current = setTimeout(() => {
      posRef.current = 0; dirRef.current = 1
      speedRef.current = Math.min(3.5, 1.8 + (newBalls / TOTAL_BALLS) * 1.7)
      startedRef.current = true
      setCanHit(true); setLastRuns(null)
    }, 700)
  }, [playing, gameOver, canHit, barWidth, syncBest])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); doHit() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [doHit])

  return (
    <GameShell
      name="Gully Cricket"
      startAction={startGame} startLabel={playing ? '⟲ Restart' : '▶ Start'}
      headerStats={<><span>Score <b className="text-white">{score}</b></span><span>Best <b className="text-orange-300">{best}</b></span><span>Ball <b className="text-slate-400">{Math.min(balls + 1, TOTAL_BALLS)}/{TOTAL_BALLS}</b></span></>}
      title="Gully Cricket Sixes — Play Free Online Cricket Hitting Game"
      desc="Play Gully Cricket online for free. Time your bat swing to hit singles, fours, and sixes. Score the highest in 12 balls!"
      icon="🏏" iconBg="rgba(34,197,94,0.08)"
      category="fun" slug="games-gully-cricket"
      faq={[
        { q: "How do I play Gully Cricket?", a: "A timing bar moves back and forth. Tap or press Space to swing your bat. Hit the sweet spot for sixes!" },
        { q: "How many balls per game?", a: "You get 12 balls total. Make every shot count to maximize your score!" },
        { q: "How are runs scored?", a: "Center of the timing bar gives 6 runs, slightly off gives 4, then 2, then 1. Missing the zone entirely gives a dot ball." },
        { q: "What determines how many runs I score?", a: "The timing bar position at the moment you swing decides runs: center zone = 6, then 4, 2, or 1. Missing the zones entirely gives a dot ball (0 runs)." },
        { q: "Does the ball get faster?", a: "Yes! The timing bar speeds up with each ball. By ball 12 it moves significantly faster than ball 1, so early shots are easier than late ones." },
      ]}
      howItWorks={[
        "Watch the timing bar move back and forth across the screen.",
        "Tap, click, or press Space to swing your bat at the right moment.",
        "Hit the center zone for 6 runs, edges for 2-4, and miss for a dot.",
        "Score as many runs as possible in 12 balls. Beat your best score!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Gully Cricket", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/gully-cricket/",
        "genre": "Sports",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="min-w-0 space-y-5">
        {!playing && (
          <div className="glass p-3 overflow-hidden relative">
            <div className="w-full rounded-lg bg-[#0a0a1a]" style={{ minHeight: 300 }} />
            {showWelcome && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 py-4 bg-[#050d1a]/92 backdrop-blur-[2px] overflow-y-auto"
                onPointerDown={(e) => { if (e.target.closest('button')) return; window.dispatchEvent(new Event('ut:game-start')) }}>
                <img src="/games/gully-cricket/cover.jpg" alt="Gully Cricket batting game cover art" loading="eager"
                  className="w-full max-w-[420px] aspect-video object-cover rounded-2xl border border-green-400/30 shadow-[0_0_40px_rgba(34,197,94,0.35)] mb-4" />
                <h2 className="text-4xl sm:text-5xl font-black tracking-tighter bg-gradient-to-b from-green-300 via-emerald-300 to-yellow-300 bg-clip-text text-transparent">GULLY CRICKET</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-3">12 balls · Time your swing · Hit sixes!</p>
                <div className="flex flex-wrap justify-center gap-1.5 mb-3 text-[11px] font-bold">
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-green-200">🏏 Timing bar</span>
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-rose-200">💥 Six hitting</span>
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-amber-200">⚡ Speed increases</span>
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-cyan-200">📱 Touch + keys</span>
                </div>
                {best > 0 && <p className="text-xs text-amber-400 mb-2 font-bold">🏆 Best: {best} runs</p>}
                <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-extrabold text-lg shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:scale-105 transition">▶ Start Game</button>
                <p className="text-[11px] text-slate-500 mt-3">Tap or press Space to swing at the right moment</p>
              </div>
            )}
          </div>
        )}

        {playing && (
          <>
            <div className="flex gap-3 items-center justify-between">
              <div />
              <button onClick={() => { if (gameOverTimeoutRef.current) { clearTimeout(gameOverTimeoutRef.current); gameOverTimeoutRef.current = null } if (nextBallTimeoutRef.current) { clearTimeout(nextBallTimeoutRef.current); nextBallTimeoutRef.current = null } setPlaying(false); startedRef.current = false }}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">
                ⟵ Back
              </button>
            </div>

            <div ref={barRef} className="glass p-4">
              <div className="text-center mb-3 text-sm text-slate-300 font-medium">
                {canHit ? '🎯 Time your swing!' : lastRuns !== null && (
                  <span className="text-xl font-extrabold" style={{ color: RUNS_COLORS[RUNS_VALUES.indexOf(lastRuns)] }}>
                    {lastRuns === 0 ? 'Dot Ball!' : lastRuns === 6 ? '⚡ SIX!!!' : lastRuns === 4 ? '🔥 FOUR!' : `+${lastRuns} run${lastRuns > 1 ? 's' : ''}`}
                  </span>
                )}
              </div>

              <div className="relative mx-auto" style={{ width: barWidth, height: 48, background: 'rgba(255,255,255,0.05)', borderRadius: 8, border: '2px solid rgba(255,255,255,0.1)' }}>
                {/* Six zone (center) */}
                <div className="absolute top-0 h-full rounded flex items-center justify-center" style={{ left: '38%', width: '24%', background: 'rgba(244,63,94,0.25)', borderLeft: '2px solid rgba(244,63,94,0.4)', borderRight: '2px solid rgba(244,63,94,0.4)' }}>
                  <span className="text-sm font-bold text-rose-400">6</span>
                </div>
                {/* Four zones */}
                <div className="absolute top-0 h-full rounded-l" style={{ left: '20%', width: '18%', background: 'rgba(250,204,21,0.15)', borderRight: '1px solid rgba(250,204,21,0.3)' }} />
                <div className="absolute top-0 h-full rounded-r" style={{ left: '62%', width: '18%', background: 'rgba(250,204,21,0.15)', borderLeft: '1px solid rgba(250,204,21,0.3)' }} />
                {/* Two zones */}
                <div className="absolute top-0 h-full rounded-l" style={{ left: '8%', width: '12%', background: 'rgba(52,211,153,0.12)' }} />
                <div className="absolute top-0 h-full rounded-r" style={{ left: '80%', width: '12%', background: 'rgba(52,211,153,0.12)' }} />
                {/* Bat cursor */}
                <div className="absolute top-0 h-full w-1 rounded" style={{ left: ballX, background: canHit ? '#fff' : 'rgba(255,255,255,0.3)', transition: canHit ? 'none' : 'opacity 0.3s', boxShadow: canHit ? '0 0 8px rgba(255,255,255,0.5)' : 'none' }} />
              </div>

              <div className="flex justify-between mt-1 text-[10px] text-slate-500 px-1">
                <span>Dot</span><span>2</span><span>4</span><span>6</span><span>4</span><span>2</span><span>Dot</span>
              </div>

              <button onClick={doHit} disabled={!canHit || gameOver}
                className={`sticky bottom-2 z-20 w-full mt-4 py-4 rounded-xl text-lg font-bold bg-[#030b14]/95 backdrop-blur-sm border border-white/[0.06] transition-all ${canHit && !gameOver ? 'text-white active:scale-95 shadow-lg shadow-emerald-500/20' : 'text-slate-500 cursor-not-allowed'} ${canHit && !gameOver ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 'bg-white/[0.06]'}`}>
                {canHit ? '🏏 TAP TO SWING' : '⏳ Wait...'}
              </button>

              {balls > 0 && (
                <div className="flex gap-1 mt-3 justify-center flex-wrap">
                  {Array.from({ length: TOTAL_BALLS }, (_, i) => {
                    const isDot = i < balls && score === 0
                    return (
                      <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${i < balls ? 'border-white/20' : 'border-white/10'}`}
                        style={i < balls ? { background: 'rgba(255,255,255,0.1)', color: '#fff' } : { color: '#475569' }}>
                        {i + 1}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {gameOver && (
              <div className="glass p-6 text-center">
                <div className="text-4xl mb-2">{score >= 40 ? '🏆' : score >= 25 ? '🎉' : ' cricket '}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {score >= 40 ? 'Innings Done!' : 'Innings Over!'}
                </h3>
                <div className="text-3xl font-extrabold text-white mb-1">{score}</div>
                <div className="text-sm text-slate-400 mb-3">runs in {TOTAL_BALLS} balls</div>
                {score >= best && score > 0 && <div className="text-sm text-yellow-400 font-bold mb-3">🌟 New Best Score!</div>}
                <p className="text-xs text-slate-400">Use the shell button above to play again</p>
              </div>
            )}

            <p className="text-center text-xs text-slate-400">Space / Tap to swing · Tap area · Hit center for maximum runs!</p>
          </>
        )}
      </div>
    </GameShell>
  )
}
