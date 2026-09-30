import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const LS = { BEST: 'ut_momo_merge_best_v1' }

// 10 momo sizes. Only ranks 0-3 drop randomly. 9+9 does NOT merge.
const MOMOS = [
  { r: 16, color: '#FFF7ED', edge: '#FED7AA', name: 'Mini', score: 10 },
  { r: 22, color: '#FEF3C7', edge: '#FCD34D', name: 'Baby', score: 25 },
  { r: 28, color: '#FFEDD5', edge: '#FB923C', name: 'Tiny', score: 50 },
  { r: 36, color: '#FCE7F3', edge: '#F472B6', name: 'Chotu', score: 100 },
  { r: 44, color: '#FECACA', edge: '#EF4444', name: 'Classic', score: 200 },
  { r: 52, color: '#BBF7D0', edge: '#22C55E', name: 'Veggie', score: 350 },
  { r: 62, color: '#BAE6FD', edge: '#0EA5E9', name: 'Jumbo', score: 550 },
  { r: 72, color: '#DDD6FE', edge: '#8B5CF6', name: 'Royal', score: 850 },
  { r: 84, color: '#FDE68A', edge: '#F59E0B', name: 'Golden', score: 1300 },
  { r: 96, color: '#FBCFE8', edge: '#EC4899', name: 'King', score: 2000 },
]
const DROP_RANKS = [0, 1, 2, 3]
const randDrop = () => DROP_RANKS[Math.floor(Math.random() * DROP_RANKS.length)]

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); return audioCtx }
function tone(freq, dur, type = 'sine', vol = 0.07, delay = 0) {
  try {
    const ctx = ensureAudio(); const t = ctx.currentTime + delay
    const o = ctx.createOscillator(); const g = ctx.createGain()
    o.type = type; o.frequency.value = freq
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur)
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur)
  } catch {}
}
const sndDrop = () => tone(300, 0.08, 'triangle', 0.05)
const sndMerge = (rank) => { tone(320 + rank * 70, 0.14, 'sine', 0.09); tone((320 + rank * 70) * 1.5, 0.12, 'sine', 0.05, 0.05) }
const sndOver = () => { tone(300, 0.3, 'sawtooth', 0.06); tone(150, 0.5, 'sawtooth', 0.05, 0.2) }

let UID = 1

function drawMomo(ctx, x, y, r, rank) {
  const m = MOMOS[rank]
  // body
  const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.2, x, y, r)
  grad.addColorStop(0, '#FFFFFF'); grad.addColorStop(0.55, m.color); grad.addColorStop(1, m.edge)
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = grad; ctx.fill()
  ctx.lineWidth = Math.max(1.5, r * 0.06); ctx.strokeStyle = m.edge; ctx.stroke()
  // pleat knot on top
  ctx.beginPath(); ctx.arc(x, y - r * 0.72, r * 0.16, 0, Math.PI * 2)
  ctx.fillStyle = m.edge; ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1; ctx.stroke()
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath()
    ctx.moveTo(x + i * r * 0.14, y - r * 0.72 + r * 0.1)
    ctx.quadraticCurveTo(x + i * r * 0.2, y - r * 0.4, x + i * r * 0.28, y - r * 0.18)
    ctx.strokeStyle = 'rgba(0,0,0,0.10)'; ctx.lineWidth = Math.max(1, r * 0.03); ctx.stroke()
  }
  // cute face (skip on tiniest? keep, scaled)
  const e = r * 0.16, ey = y - r * 0.05, ex = r * 0.32
  ctx.fillStyle = '#1F2937'
  ctx.beginPath(); ctx.arc(x - ex, ey, e, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(x + ex, ey, e, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.beginPath(); ctx.arc(x - ex + e * 0.3, ey - e * 0.3, e * 0.35, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(x + ex + e * 0.3, ey - e * 0.3, e * 0.35, 0, Math.PI * 2); ctx.fill()
  // blush
  ctx.fillStyle = 'rgba(244,114,182,0.55)'
  ctx.beginPath(); ctx.arc(x - ex - r * 0.22, ey + r * 0.22, r * 0.11, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(x + ex + r * 0.22, ey + r * 0.22, r * 0.11, 0, Math.PI * 2); ctx.fill()
  // smile
  ctx.beginPath(); ctx.arc(x, ey + r * 0.08, r * 0.22, 0.25 * Math.PI, 0.75 * Math.PI)
  ctx.strokeStyle = '#1F2937'; ctx.lineWidth = Math.max(1.2, r * 0.045); ctx.lineCap = 'round'; ctx.stroke()
}

export default function games_momo_merge() {
  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => { try { return Number(localStorage.getItem(LS.BEST) || 0) } catch { return 0 } })
  const [curRank, setCurRank] = useState(() => randDrop())
  const [nextRank, setNextRank] = useState(() => randDrop())
  const [muted, setMuted] = useState(false)
  const [popups, setPopups] = useState([])
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const [cw, setCw] = useState(400)
  const mutedRef = useRef(false)
  mutedRef.current = muted
  const s = useCallback((fn, ...a) => { if (!mutedRef.current) fn(...a) }, [])

  const st = useRef({
    balls: [], aimX: 200, dropCooldown: 0, overTimer: 0,
    running: false, over: false, score: 0, cur: 0, next: 1, combo: 0,
  })

  const W = cw, H = 560, WALL = 8, LINE_Y = 120

  const fit = useCallback(() => {
    if (wrapRef.current) {
      const w = Math.min(420, wrapRef.current.clientWidth - 4, window.innerWidth - 32)
      setCw(Math.max(280, Math.floor(w)))
    }
  }, [])
  useEffect(() => { fit() }, [fit])
  useEffect(() => {
    window.addEventListener('resize', fit)
    window.addEventListener('ut:board-h', fit)
    return () => { window.removeEventListener('resize', fit); window.removeEventListener('ut:board-h', fit) }
  }, [fit])
  useEffect(() => { if (playing) requestAnimationFrame(fit) }, [playing, fit])

  const startNew = useCallback(() => {
    const c = randDrop(); let n = randDrop()
    st.current = { balls: [], aimX: W / 2, dropCooldown: 0, overTimer: 0, running: true, over: false, score: 0, cur: c, next: n, combo: 0 }
    UID = 1
    setScore(0); setGameOver(false); setPlaying(true); setPopups([])
    setCurRank(c); setNextRank(n)
  }, [W])

  const endGame = useCallback(() => {
    const sc = st.current.score
    st.current.running = false; st.current.over = true
    setGameOver(true); s(sndOver)
    setBest((prev) => { const nb = Math.max(prev, sc); try { localStorage.setItem(LS.BEST, String(nb)) } catch {} return nb })
  }, [s])

  const drop = useCallback(() => {
    const S = st.current
    if (!S.running || S.over || S.dropCooldown > 0) return
    const rank = S.cur, r = MOMOS[rank].r
    const x = Math.min(Math.max(S.aimX, WALL + r), W - WALL - r)
    S.balls.push({ id: UID++, x, y: LINE_Y - 40, vx: 0, vy: 0, r, rank, fresh: true })
    S.cur = S.next; S.next = randDrop()
    setCurRank(S.cur); setNextRank(S.next)
    S.dropCooldown = 0.45
    s(sndDrop)
  }, [W, s])

  const dropRef = useRef(drop); dropRef.current = drop

  // aim input
  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const toX = (clientX) => {
      const rect = cv.getBoundingClientRect()
      const scale = W / rect.width
      st.current.aimX = (clientX - rect.left) * scale
    }
    const mv = (e) => { if (e.touches?.[0]) toX(e.touches[0].clientX); else if (e.clientX != null) toX(e.clientX) }
    const dn = (e) => {
      if (!st.current.running) { window.dispatchEvent(new Event('ut:game-start')); return }
      mv(e); dropRef.current()
    }
    cv.addEventListener('mousemove', mv)
    cv.addEventListener('mousedown', dn)
    cv.addEventListener('touchstart', (e) => { e.preventDefault(); dn(e) }, { passive: false })
    cv.addEventListener('touchmove', (e) => { e.preventDefault(); mv(e) }, { passive: false })
    return () => {
      cv.removeEventListener('mousemove', mv); cv.removeEventListener('mousedown', dn)
      cv.removeEventListener('touchstart', dn); cv.removeEventListener('touchmove', mv)
    }
  }, [playing, W])

  useEffect(() => {
    const h = (e) => {
      if (!st.current.running) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); window.dispatchEvent(new Event('ut:game-start')) }
        return
      }
      if (e.key === 'ArrowLeft' || e.key === 'a') st.current.aimX = Math.max(0, st.current.aimX - 18)
      if (e.key === 'ArrowRight' || e.key === 'd') st.current.aimX = Math.min(W, st.current.aimX + 18)
      if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'Enter') { e.preventDefault(); dropRef.current() }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [W])

  // physics loop
  useEffect(() => {
    if (!playing) return
    let raf; let last = performance.now()
    const step = (now) => {
      const dt = Math.min(0.033, (now - last) / 1000); last = now
      const S = st.current
      if (S.running && !S.over) {
        S.dropCooldown = Math.max(0, S.dropCooldown - dt)
        const sub = 2
        for (let k = 0; k < sub; k++) {
          const h = dt / sub
          for (const b of S.balls) {
            b.vy += 1500 * h
            b.vx *= (1 - 0.4 * h); b.vy *= (1 - 0.05 * h)
            b.x += b.vx * h; b.y += b.vy * h
            // walls + floor
            if (b.x - b.r < WALL) { b.x = WALL + b.r; b.vx = Math.abs(b.vx) * 0.4 }
            if (b.x + b.r > W - WALL) { b.x = W - WALL - b.r; b.vx = -Math.abs(b.vx) * 0.4 }
            if (b.y + b.r > H - WALL) { b.y = H - WALL - b.r; b.vy = -Math.abs(b.vy) * 0.35; b.vx *= 0.96; if (Math.abs(b.vy) < 25) b.vy = 0 }
            if (b.y - b.r < 0) { b.y = b.r; b.vy = Math.abs(b.vy) * 0.3 }
          }
          // circle collisions
          const B = S.balls
          for (let i = 0; i < B.length; i++) {
            for (let j = i + 1; j < B.length; j++) {
              const a = B[i], b = B[j]
              const dx = b.x - a.x, dy = b.y - a.y
              const dist = Math.hypot(dx, dy), min = a.r + b.r
              if (dist > 0 && dist < min) {
                const nx = dx / dist, ny = dy / dist, ov = (min - dist) / 2
                const ta = a.fresh ? 0.2 : 1, tb = b.fresh ? 0.2 : 1
                a.x -= nx * ov * ta; a.y -= ny * ov * ta
                b.x += nx * ov * tb; b.y += ny * ov * tb
                const rvx = b.vx - a.vx, rvy = b.vy - a.vy
                const vn = rvx * nx + rvy * ny
                if (vn < 0) {
                  const imp = -vn * 0.6
                  a.vx -= imp * nx; a.vy -= imp * ny
                  b.vx += imp * nx; b.vy += imp * ny
                }
              }
            }
          }
          for (const b of S.balls) b.fresh = false
        }
        // merges: same rank, rank < 9
        let merged = true
        while (merged) {
          merged = false
          const B = S.balls
          outer: for (let i = 0; i < B.length; i++) {
            for (let j = i + 1; j < B.length; j++) {
              const a = B[i], b = B[j]
              if (a.rank === b.rank && a.rank < 9 && Math.hypot(b.x - a.x, b.y - a.y) < (a.r + b.r) * 0.82) {
                const nr = a.rank + 1
                const nx = (a.x + b.x) / 2, ny = (a.y + b.y) / 2
                S.balls = B.filter((_, k) => k !== i && k !== j)
                const nb = { id: UID++, x: nx, y: ny, vx: (a.vx + b.vx) / 2, vy: Math.min(a.vy, b.vy) - 60, r: MOMOS[nr].r, rank: nr, fresh: false, pop: 1 }
                S.balls.push(nb)
                const pts = MOMOS[nr].score
                S.combo += 1
                S.score += pts
                setScore(S.score)
                setPopups((p) => [...p.slice(-5), { id: UID, x: nx, y: ny, text: `+${pts}` }])
                setTimeout(() => setPopups((p) => p.slice(1)), 800)
                s(sndMerge, nr)
                merged = true
                break outer
              }
            }
          }
        }
        S.combo = Math.max(0, S.combo - dt * 1.5)
        // game over: settled ball above line
        const danger = S.balls.some((b) => b.y - b.r * 0.4 < LINE_Y && Math.abs(b.vy) < 60 && b.y > 0)
        if (danger) { S.overTimer += dt; if (S.overTimer > 2) endGame() }
        else S.overTimer = Math.max(0, S.overTimer - dt * 2)
      }
      // draw
      const cv = canvasRef.current
      if (cv) {
        const dpr = Math.min(2, window.devicePixelRatio || 1)
        if (cv.width !== W * dpr || cv.height !== H * dpr) { cv.width = W * dpr; cv.height = H * dpr }
        const ctx = cv.getContext('2d')
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, W, H)
        // bg
        const bg = ctx.createLinearGradient(0, 0, 0, H)
        bg.addColorStop(0, '#0f172a'); bg.addColorStop(1, '#1e1b4b')
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)
        // danger line
        const S2 = st.current
        const urg = S2.overTimer > 0
        ctx.save()
        ctx.strokeStyle = urg ? '#EF4444' : 'rgba(239,68,68,0.45)'
        ctx.lineWidth = urg ? 3 : 2
        ctx.setLineDash([8, 6])
        ctx.beginPath(); ctx.moveTo(WALL, LINE_Y); ctx.lineTo(W - WALL, LINE_Y); ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = urg ? '#EF4444' : 'rgba(239,68,68,0.6)'
        ctx.font = 'bold 10px system-ui'; ctx.fillText(urg ? `⚠ ${(2 - S2.overTimer).toFixed(1)}s` : 'game over line', WALL + 6, LINE_Y - 6)
        ctx.restore()
        // aim guide
        if (S2.running && !S2.over) {
          const r = MOMOS[S2.cur].r
          const ax = Math.min(Math.max(S2.aimX, WALL + r), W - WALL - r)
          ctx.save()
          ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.setLineDash([4, 5]); ctx.lineWidth = 1.5
          ctx.beginPath(); ctx.moveTo(ax, LINE_Y - 60); ctx.lineTo(ax, H - WALL); ctx.stroke()
          ctx.setLineDash([]); ctx.globalAlpha = 0.9
          drawMomo(ctx, ax, LINE_Y - 60, r, S2.cur)
          ctx.restore()
        }
        // walls
        ctx.fillStyle = '#334155'
        ctx.fillRect(0, 0, WALL, H); ctx.fillRect(W - WALL, 0, WALL, H); ctx.fillRect(0, H - WALL, W, WALL)
        for (const b of S2.balls) {
          ctx.save()
          if (b.pop) { const sc = 1 + 0.25 * b.pop; ctx.translate(b.x, b.y); ctx.scale(sc, sc); ctx.translate(-b.x, -b.y); b.pop = Math.max(0, (b.pop || 0) - dt * 4) }
          drawMomo(ctx, b.x, b.y, b.r, b.rank)
          ctx.restore()
        }
        // popups
        ctx.save()
        ctx.font = 'bold 15px system-ui'; ctx.textAlign = 'center'
        for (const p of popupsRef.current) {
          ctx.fillStyle = '#FDE047'
          ctx.fillText(p.text, p.x, p.y - 10)
        }
        ctx.restore()
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [playing, W, H, endGame, s])

  const popupsRef = useRef(popups); popupsRef.current = popups

  return (
    <GameShell
      name="Momo Merge"
      startAction={startNew} startLabel={!playing ? '🥟 Start Dropping' : '⟲ Restart'}
      extraButtons={
        <button onClick={() => setMuted((m) => !m)} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white transition-all">{muted ? '🔇 Muted' : '🔊 Sound'}</button>
      }
      headerStats={<><span>Score <b className="text-cyan-300">{score}</b></span><span>Best <b className="text-amber-300">🏆 {best}</b></span></>}
      title="Momo Merge — Cute Suika-Style Momo Drop Puzzle Game"
      desc="Drop cute momos, match same sizes to merge them into bigger momos, and beat your best before the stack crosses the line."
      icon="🥟" iconBg="rgba(244,114,182,0.08)"
      category="fun" slug="games-momo-merge"
      faq={[
        { q: 'How do I play Momo Merge?', a: 'Move to aim, click / tap / Space to drop the momo. Two momos of the same size touching each other merge into the next bigger size.' },
        { q: 'Which momos can I drop?', a: 'The dropper gives you sizes 1–4 at random, shown as Next. Merge your way up — there are 10 sizes total, ending in the King Momo.' },
        { q: 'Do King Momos merge?', a: 'No. Two size-10 King Momos just sit together — exactly like the Snapchat game, nothing exists past size 10.' },
        { q: 'How do I score?', a: 'Every merge scores points — bigger merges pay more (10 for Mini up to 2000 for King). Survive longer for a higher score.' },
        { q: 'When is it game over?', a: 'If settled momos stack above the red dashed line for 2 seconds, the game ends.' },
      ]}
      howItWorks={[
        'Aim with mouse, touch, or arrow keys — click, tap, or Space drops the momo.',
        'Same-size momos touching merge into the next bigger size (1→2→…→10).',
        'Only sizes 1–4 drop randomly. Size 10 never merges.',
        'Crossing the red line for 2 seconds ends the run. Chain merges for big points!',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'VideoGame',
        name: 'Momo Merge', applicationCategory: 'Game',
        url: 'https://www.uptools.in/games/momo-merge/',
        genre: 'Puzzle',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }}
    >
      <div className="min-w-0 space-y-5">
        {!playing && (
          <div className="relative glass p-6 text-center overflow-y-auto max-h-[70vh]"
            onPointerDown={(e) => { if (e.target.closest('button')) return; window.dispatchEvent(new Event('ut:game-start')) }}>
            <div className="text-6xl mb-2">🥟</div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white">MOMO MERGE</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-3">Drop · Match · Merge · 10 cute sizes</p>
            <div className="flex items-center justify-center gap-1.5 mb-4 flex-wrap">
              {MOMOS.slice(0, 6).map((m, i) => (
                <span key={i} className="inline-flex items-center justify-center rounded-full border font-bold text-slate-800"
                  style={{ width: Math.min(44, 18 + m.r * 0.55), height: Math.min(44, 18 + m.r * 0.55), background: m.color, borderColor: m.edge, fontSize: 10 }}>{i + 1}</span>
              ))}
              <span className="text-slate-500 text-xs">…10</span>
            </div>
            {best > 0 && <p className="text-xs text-amber-400 mb-2">🏆 Best: {best}</p>}
            <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-extrabold text-lg shadow hover:scale-105 transition">🥟 Start Dropping</button>
            <p className="text-[11px] text-slate-500 mt-3">Aim with mouse / touch / ← → · Drop with click / tap / Space</p>
          </div>
        )}

        {playing && (
          <>
            <div className="flex gap-2 items-center justify-between flex-wrap">
              <div className="flex gap-2">
                <div className="px-3 py-2 glass text-sm font-bold text-white">⭐ {score}</div>
                <div className="px-3 py-2 glass text-sm text-slate-400">Best: {best}</div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="px-3 py-2 glass text-sm text-slate-300">Next: <b style={{ color: MOMOS[nextRank].edge }}>●</b> {MOMOS[nextRank].name}</div>
                <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">⟲</button>
              </div>
            </div>

            <div ref={wrapRef} className="glass p-3">
              <div className="relative mx-auto overflow-hidden rounded-xl" style={{ width: W, maxWidth: '100%', touchAction: 'none' }}>
                <canvas ref={canvasRef} style={{ width: W, height: H, display: 'block', cursor: 'crosshair' }} />
                {gameOver && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4 text-center">
                    <div className="text-4xl mb-2">🥟</div>
                    <h2 className="text-xl font-bold text-white mb-1">Game Over!</h2>
                    <p className="text-sm text-slate-300 mb-1">Score: <b className="text-cyan-300">{score}</b> · Best: <b className="text-amber-300">{best}</b></p>
                    <p className="text-[11px] text-slate-500 mb-3">The momos crossed the line!</p>
                    <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold text-sm hover:scale-105 transition">🥟 Play Again</button>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <p className="text-[10px] text-slate-500 mb-1.5 text-center">MERGE CHART — same + same = next</p>
                <div className="flex items-center justify-center gap-1 flex-wrap">
                  {MOMOS.map((m, i) => (
                    <span key={i} title={`${m.name} (+${m.score})`} className="inline-flex items-center justify-center rounded-full border text-slate-800 font-bold"
                      style={{ width: 15 + m.r * 0.28, height: 15 + m.r * 0.28, background: m.color, borderColor: m.edge, fontSize: 9 }}>{i + 1}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 text-center">Tip: keep big momos at the bottom, drop small ones into gaps between matching pairs.</p>
          </>
        )}
      </div>
    </GameShell>
  )
}
