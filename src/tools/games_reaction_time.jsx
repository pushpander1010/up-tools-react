import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LS = { BEST: 'ut_rt_best', HISTORY: 'ut_rt_history', ATTEMPTS: 'ut_rt_attempts' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) {
  try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {}
}
function playGo() { playTone(880,0.15,'sine',0.1) }
function playResult(ms) { const f = 300 + Math.max(0, (500-ms)) * 2; playTone(f,0.15,'sine',0.08); setTimeout(()=>playTone(f*1.5,0.2,'sine',0.06),100) }
function playTooEarly() { playTone(200,0.2,'sawtooth',0.07) }
function playSelect() { playTone(440,0.06,'sine',0.05) }
function playComplete() { playTone(523,0.1,'sine',0.08); setTimeout(()=>playTone(659,0.1,'sine',0.08),80); setTimeout(()=>playTone(784,0.1,'sine',0.08),160); setTimeout(()=>playTone(1047,0.2,'sine',0.1),240) }

const ROUNDS = 3

export default function games_reaction_time() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [phase, setPhase] = useState('idle') // idle, waiting, ready, tooEarly, result, done
  const [results, setResults] = useState([])
  const [currentRound, setCurrentRound] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [bestTime, setBestTime] = useState(() => Number(localStorage.getItem(LS.BEST) || Infinity))
  const [attempts, setAttempts] = useState(() => Number(localStorage.getItem(LS.ATTEMPTS) || 0))
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS.HISTORY) || '[]') } catch { return [] }
  })
  const startTimeRef = useRef(0)
  const timeoutRef = useRef(null)

  const startRound = useCallback(() => {
    playSelect()
    setPhase('waiting')
    setCurrentTime(0)
    // Random delay between 1-4 seconds
    const delay = 1000 + Math.random() * 3000
    timeoutRef.current = setTimeout(() => {
      setPhase('ready')
      startTimeRef.current = performance.now()
      playGo()
    }, delay)
  }, [])

  const handleClick = useCallback(() => {
    if (phase === 'waiting') {
      // Too early!
      clearTimeout(timeoutRef.current)
      playTooEarly()
      setPhase('tooEarly')
      setCurrentTime(-1)
    } else if (phase === 'ready') {
      // Got it!
      const ms = Math.round(performance.now() - startTimeRef.current)
      playResult(ms)
      setCurrentTime(ms)
      setPhase('result')
      const newResults = [...results, ms]
      setResults(newResults)

      if (currentRound + 1 >= ROUNDS) {
        // Done
        setTimeout(() => {
          const avg = Math.round(newResults.reduce((a, b) => a + b, 0) / newResults.length)
          const best = Math.min(...newResults)
          const newBest = Math.min(bestTime === Infinity ? best : bestTime, best)
          setBestTime(newBest)
          const newAttempts = attempts + 1
          setAttempts(newAttempts)
          const newHistory = [{ date: new Date().toLocaleDateString(), results: [...newResults], avg, best }, ...history].slice(0, 20)
          setHistory(newHistory)
          try {
            localStorage.setItem(LS.BEST, String(newBest))
            localStorage.setItem(LS.ATTEMPTS, String(newAttempts))
            localStorage.setItem(LS.HISTORY, JSON.stringify(newHistory))
          } catch {}
          playComplete()
          setPhase('done')
        }, 800)
      }
    }
  }, [phase, results, currentRound, bestTime, attempts, history])

  const resetGame = useCallback(() => {
    playSelect()
    setPhase('idle')
    setResults([])
    setCurrentRound(0)
    setCurrentTime(0)
  }, [])

  const continueRounds = useCallback(() => {
    playSelect()
    setCurrentRound(prev => prev + 1)
    startRound()
  }, [startRound])

  const avg = results.length > 0 ? Math.round(results.reduce((a, b) => a + b, 0) / results.length) : 0
  const bestRound = results.length > 0 ? Math.min(...results) : 0

  const getRating = (ms) => {
    if (ms < 200) return { label: 'Lightning Fast ⚡', color: '#22c55e' }
    if (ms < 300) return { label: 'Great! 🔥', color: '#3b82f6' }
    if (ms < 400) return { label: 'Good 👍', color: '#f59e0b' }
    return { label: 'Keep Practicing 💪', color: '#ef4444' }
  }

  const shareResults = useCallback(() => {
    const text = `⚡ Reaction Time Test\n${results.map((r, i) => `Round ${i+1}: ${r}ms`).join('\n')}\nAverage: ${avg}ms | Best: ${bestRound}ms\nPlay at: https://www.uptools.in/games/reaction-time/`
    navigator.clipboard?.writeText(text).then(() => {
      playTone(880, 0.08, 'sine', 0.06)
    }).catch(() => {})
  }, [results, avg, bestRound])

  const bg = phase === 'ready' ? '#22c55e' :
             phase === 'waiting' ? '#ef4444' :
             phase === 'tooEarly' ? '#f59e0b' :
             phase === 'result' ? '#3b82f6' : '#1e293b'

  return (
    <ToolLayout
      title="Reaction Time Test - How Fast Are You?"
      desc="Test your reaction speed! See how fast you can respond to visual cues. Track your best times and compete with yourself."
      icon="⚡" iconBg="rgba(245,158,11,0.08)"
      category="fun" slug="games-reaction-time"
      faq={[
        { q: "How does the Reaction Time Test work?", a: "Click the screen when it turns green! Wait for the red screen to change, then click as fast as you can. Click too early and you'll need to restart the round." },
        { q: "What's a good reaction time?", a: "Under 200ms is lightning fast, 200-300ms is great, 300-400ms is average. Most people average around 250-350ms." },
        { q: "Does my history save?", a: "Yes! Your best time, number of attempts, and recent results are saved to your device." },
      ]}
      howItWorks={[
        "Click Start to begin. The screen turns red — wait!",
        "When it turns green, click/tap as FAST as you can.",
        "If you click too early during red, you must restart that round.",
        "Complete 3 rounds to see your average and best time.",
        "Share your results or keep practicing to beat your best!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Reaction Time Test", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/reaction-time/",
        "genre": "Puzzle", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-xl mx-auto space-y-5">
        {/* Stats */}
        <div className="glass p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white">{bestTime === Infinity ? '—' : bestTime + 'ms'}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Best</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-purple-400">{attempts}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Attempts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white">{currentRound + (phase === 'done' ? 0 : 1)}/{ROUNDS}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Round</div>
            </div>
          </div>
        </div>

        {/* Game area */}
        <div ref={resultRef}
          className="relative rounded-2xl overflow-hidden border border-white/[0.08] cursor-pointer select-none transition-colors duration-200"
          style={{ background: bg, minHeight: '280px' }}
          onClick={phase === 'idle' ? startRound :
                  phase === 'waiting' || phase === 'ready' ? handleClick :
                  phase === 'tooEarly' ? startRound :
                  phase === 'result' && currentRound + 1 < ROUNDS ? continueRounds :
                  phase === 'done' ? resetGame : undefined}
        >
          <div className="flex flex-col items-center justify-center min-h-[280px] sm:min-h-[380px] p-6">
            {phase === 'idle' && (
              <>
                <div className="text-5xl mb-4">⚡</div>
                <h2 className="text-xl font-bold text-white mb-2">Reaction Time Test</h2>
                <p className="text-sm text-slate-400 text-center">Click the screen when it turns green!<br/>3 rounds · Average + Best tracked</p>
                <div className="glow-btn mt-6 px-8 py-3 text-sm">
                  Click to Start
                </div>
              </>
            )}
            {phase === 'waiting' && (
              <>
                <div className="text-5xl mb-4">🔴</div>
                <h2 className="text-xl font-bold text-white mb-2">Wait for green...</h2>
                <p className="text-sm text-red-300/80">Don't click yet!</p>
              </>
            )}
            {phase === 'ready' && (
              <>
                <div className="text-5xl mb-4">🟢</div>
                <h2 className="text-5xl font-extrabold text-white mb-2">CLICK!</h2>
              </>
            )}
            {phase === 'tooEarly' && (
              <>
                <div className="text-5xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold text-yellow-300 mb-2">Too Early!</h2>
                <p className="text-sm text-slate-400">Wait for green before clicking</p>
                <div className="glow-btn mt-6 px-8 py-3 text-sm">
                  Try Again
                </div>
              </>
            )}
            {phase === 'result' && (
              <>
                <div className="text-5xl mb-4">⏱️</div>
                <h2 className="text-4xl font-extrabold text-white mb-1">{currentTime}ms</h2>
                <p className="text-sm font-bold" style={{color: getRating(currentTime).color}}>
                  {getRating(currentTime).label}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  {currentRound + 1 < ROUNDS ? `Click to start Round ${currentRound + 2}` : 'Computing results...'}
                </p>
              </>
            )}
            {phase === 'done' && (
              <>
                <div className="text-5xl mb-4">🏆</div>
                <h2 className="text-2xl font-bold text-white mb-4">Results</h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-white">{avg}ms</div>
                    <div className="text-xs text-slate-400">Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-extrabold" style={{color: getRating(bestRound).color}}>{bestRound}ms</div>
                    <div className="text-xs text-slate-400">Best Round</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-white">{results.length}</div>
                    <div className="text-xs text-slate-400">Rounds</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {results.map((r, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-mono font-bold"
                      style={{background: getRating(r).color + '20', color: getRating(r).color, border: `1px solid ${getRating(r).color}40`}}>
                      R{i+1}: {r}ms
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 justify-center">
                  <button onClick={(e) => { e.stopPropagation(); shareResults() }}
                    className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">
                    📋 Copy Results
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); resetGame() }}
                    className="glow-btn px-4 py-2 text-xs">
                    Play Again
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-400">Recent Attempts</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.slice(0, 10).map((h, i) => (
                <div key={i} className="flex flex-wrap items-center justify-between p-3 glass text-xs gap-2">
                  <div className="text-xs text-slate-500">{h.date}</div>
                  <div className="flex gap-2">
                    {h.results.map((r, j) => (
                      <span key={j} className="text-xs font-mono px-2 py-0.5 rounded"
                        style={{background: getRating(r).color + '15', color: getRating(r).color}}>
                        {r}ms
                      </span>
                    ))}
                  </div>
                  <div className="text-xs font-bold text-white">avg {h.avg}ms</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-slate-500">Best times and history saved on this device.</p>
      </div>
    </ToolLayout>
  )
}
