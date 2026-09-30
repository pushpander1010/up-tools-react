import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const LS = { BEST: 'ut_momo_merge_best_v1' }

// 10 momo sizes. Only ranks 0-3 drop randomly. 9+9 does NOT merge.
const MOMOS = [
  { r: 16, color: '#FFF7ED', edge: '#FDBA74', name: 'Mini', score: 10 },
  { r: 22, color: '#FEF3C7', edge: '#FBBF24', name: 'Baby', score: 25 },
  { r: 28, color: '#FFEDD5', edge: '#FB923C', name: 'Tiny', score: 50 },
  { r: 36, color: '#FCE7F3', edge: '#F472B6', name: 'Chotu', score: 100 },
  { r: 44, color: '#FECACA', edge: '#F87171', name: 'Classic', score: 200 },
  { r: 52, color: '#D1FAE5', edge: '#34D399', name: 'Veggie', score: 350 },
  { r: 62, color: '#E0F2FE', edge: '#38BDF8', name: 'Jumbo', score: 550 },
  { r: 72, color: '#EDE9FE', edge: '#A78BFA', name: 'Royal', score: 850 },
  { r: 84, color: '#FEF3C7', edge: '#F59E0B', name: 'Golden', score: 1300 },
  { r: 96, color: '#FCE7F3', edge: '#EC4899', name: 'King', score: 2000 },
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

function drawFace(ctx, x, y, r, rank) {
  const ex = r * 0.30, ey = y + r * 0.02, e = Math.max(2.2, r * 0.13)
  const happy = rank % 3
  ctx.save()
  if (happy === 0) {
    // round shiny eyes
    ctx.fillStyle = '#26303B'
    ctx.beginPath(); ctx.arc(x - ex, ey, e, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(x + ex, ey, e, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.arc(x - ex + e * 0.32, ey - e * 0.32, e * 0.42, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(x + ex + e * 0.32, ey - e * 0.32, e * 0.42, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(x - ex - e * 0.25, ey + e * 0.35, e * 0.18, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(x + ex - e * 0.25, ey + e * 0.35, e * 0.18, 0, Math.PI * 2); ctx.fill()
  } else if (happy === 1) {
    // happy closed ^ ^ eyes
    ctx.strokeStyle = '#26303B'; ctx.lineWidth = Math.max(1.4, r * 0.05); ctx.lineCap = 'round'
    for (const sgn of [-1, 1]) {
      ctx.beginPath(); ctx.arc(x + sgn * ex, ey + e * 0.4, e * 0.95, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke()
    }
  } else {
    // wink: one eye + one happy arc
    ctx.fillStyle = '#26303B'
    ctx.beginPath(); ctx.arc(x - ex, ey, e, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.arc(x - ex + e * 0.32, ey - e * 0.32, e * 0.42, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#26303B'; ctx.lineWidth = Math.max(1.4, r * 0.05); ctx.lineCap = 'round'
    ctx.beginPath(); ctx.arc(x + ex, ey + e * 0.4, e * 0.95, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke()
  }
  // big rosy cheeks
  ctx.fillStyle = 'rgba(244,114,182,0.6)'
  ctx.beginPath(); ctx.ellipse(x - ex - r * 0.26, ey + r * 0.26, r * 0.13, r * 0.09, 0, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(x + ex + r * 0.26, ey + r * 0.26, r * 0.13, r * 0.09, 0, 0, Math.PI * 2); ctx.fill()
  // mouth
  ctx.strokeStyle = '#26303B'; ctx.lineWidth = Math.max(1.2, r * 0.04); ctx.lineCap = 'round'
  if (happy === 1) {
    // open joyful mouth with tongue
    ctx.fillStyle = '#7F1D1D'
    ctx.beginPath(); ctx.ellipse(x, ey + r * 0.34, r * 0.13, r * 0.16, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#F9A8D4'
    ctx.beginPath(); ctx.ellipse(x, ey + r * 0.41, r * 0.075, r * 0.08, 0, 0, Math.PI * 2); ctx.fill()
  } else {
    ctx.beginPath(); ctx.arc(x, ey + r * 0.12, r * 0.2, 0.3 * Math.PI, 0.7 * Math.PI); ctx.stroke()
  }
  ctx.restore()
}

function drawMomo(ctx, x, y, r, rank, squash = 1) {
  const m = MOMOS[rank]
  const sy = Math.min(1.18, Math.max(0.82, squash))
  let sx = 2 - sy
  sx = Math.min(1.18, Math.max(0.82, sx))
  ctx.save()
  ctx.translate(x, y); ctx.scale(sx, sy); ctx.translate(-x, -y)
  // soft shadow
  ctx.fillStyle = 'rgba(0,0,0,0.22)'
  ctx.beginPath(); ctx.ellipse(x, y + r * 0.92, r * 0.75, r * 0.16, 0, 0, Math.PI * 2); ctx.fill()
  // plump body
  const grad = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.15, x, y, r * 1.05)
  grad.addColorStop(0, '#FFFFFF'); grad.addColorStop(0.5, m.color); grad.addColorStop(1, m.edge)
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = grad; ctx.fill()
  ctx.lineWidth = Math.max(1.5, r * 0.055); ctx.strokeStyle = m.edge; ctx.stroke()
  // glossy highlight (top-left shine)
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.beginPath(); ctx.ellipse(x - r * 0.42, y - r * 0.45, r * 0.2, r * 0.12, -0.6, 0, Math.PI * 2); ctx.fill()
  // pleat folds fanning from the knot
  ctx.strokeStyle = 'rgba(120,53,15,0.20)'; ctx.lineWidth = Math.max(1, r * 0.032); ctx.lineCap = 'round'
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath()
    ctx.moveTo(x + i * r * 0.11, y - r * 0.78)
    ctx.quadraticCurveTo(x + i * r * 0.17, y - r * 0.5, x + i * r * 0.30, y - r * 0.22)
    ctx.stroke()
  }
  // twisted knot on top
  ctx.beginPath(); ctx.arc(x, y - r * 0.8, r * 0.15, 0, Math.PI * 2)
  ctx.fillStyle = m.edge; ctx.fill()
  ctx.strokeStyle = 'rgba(120,53,15,0.35)'; ctx.lineWidth = 1; ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.beginPath(); ctx.arc(x - r * 0.05, y - r * 0.85, r * 0.045, 0, Math.PI * 2); ctx.fill()
  // tiny stubby arms
  ctx.strokeStyle = m.edge; ctx.lineWidth = Math.max(2, r * 0.07); ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(x - r * 0.92, y + r * 0.15); ctx.quadraticCurveTo(x - r * 1.12, y + r * 0.3, x - r * 1.02, y + r * 0.48); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(x + r * 0.92, y + r * 0.15); ctx.quadraticCurveTo(x + r * 1.12, y + r * 0.3, x + r * 1.02, y + r * 0.48); ctx.stroke()
  drawFace(ctx, x, y, r, rank)
  // golden crown for King momo
  if (rank === 9) {
    ctx.fillStyle = '#FBBF24'
    const cw2 = r * 0.5, cy = y - r * 1.02
    ctx.beginPath()
    ctx.moveTo(x - cw2, cy); ctx.lineTo(x - cw2, cy - r * 0.28); ctx.lineTo(x - cw2 * 0.5, cy - r * 0.1)
    ctx.lineTo(x, cy - r * 0.34); ctx.lineTo(x + cw2 * 0.5, cy - r * 0.1); ctx.lineTo(x + cw2, cy - r * 0.28)
    ctx.lineTo(x + cw2, cy); ctx.closePath(); ctx.fill()
    ctx.strokeStyle = '#B45309'; ctx.lineWidth = 1.5; ctx.stroke()
  }
  ctx.restore()
}

function drawBackground(ctx, W, H, LINE_Y, t) {
  // cozy night-kitchen gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#1B1035'); bg.addColorStop(0.55, '#3B1D4E'); bg.addColorStop(1, '#57253B')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)
  // twinkling stars
  ctx.save()
  for (let i = 0; i < 26; i++) {
    const sx = ((i * 97.3) % 1) * W, sy = ((i * 57.7) % 1) * (LINE_Y - 20) + 8
    const tw = 0.25 + 0.55 * Math.abs(Math.sin(t * 1.4 + i * 1.7))
    ctx.fillStyle = 'rgba(255,240,200,' + (tw * 0.7).toFixed(2) + ')'
    ctx.beginPath(); ctx.arc(sx, sy, 1.3, 0, Math.PI * 2); ctx.fill()
  }
  ctx.restore()
  // festive bunting across the top
  const cols = ['#F472B6', '#FBBF24', '#34D399', '#38BDF8', '#FB923C']
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(0, 6); ctx.quadraticCurveTo(W / 2, 34, W, 6); ctx.stroke()
  for (let i = 0; i < 9; i++) {
    const fx = (W * (i + 0.5)) / 9
    const fy = 6 + Math.sin((fx / W) * Math.PI) * 24
    ctx.fillStyle = cols[i % cols.length]
    ctx.beginPath(); ctx.moveTo(fx - 9, fy); ctx.lineTo(fx + 9, fy); ctx.lineTo(fx, fy + 15); ctx.closePath(); ctx.fill()
  }
  ctx.restore()
  // rising steam wisps
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 3; ctx.lineCap = 'round'
  for (let i = 0; i < 3; i++) {
    const bx = W * (0.25 + i * 0.25) + Math.sin(t * 0.9 + i * 2) * 8
    ctx.beginPath()
    ctx.moveTo(bx, H - 60)
    ctx.bezierCurveTo(bx - 12, H - 160, bx + 12, H - 260, bx - 6, H - 360)
    ctx.stroke()
  }
  ctx.restore()
}

function drawBasket(ctx, W, H, WALL) {
  // bamboo steamer walls
  const bam = ctx.createLinearGradient(0, 0, WALL, 0)
  bam.addColorStop(0, '#B07A3B'); bam.addColorStop(0.5, '#E3B76B'); bam.addColorStop(1, '#B07A3B')
  ctx.fillStyle = bam
  ctx.fillRect(0, 0, WALL, H); ctx.fillRect(W - WALL, 0, WALL, H)
  ctx.fillStyle = 'rgba(120,63,20,0.55)'
  for (let y = 14; y < H; y += 30) { ctx.fillRect(0, y, WALL, 3); ctx.fillRect(W - WALL, y, WALL, 3) }
  // woven basket floor
  const fl = ctx.createLinearGradient(0, H - WALL - 14, 0, H)
  fl.addColorStop(0, '#C99A55'); fl.addColorStop(1, '#8A5A28')
  ctx.fillStyle = fl; ctx.fillRect(WALL, H - WALL - 6, W - 2 * WALL, WALL + 6)
  ctx.fillStyle = 'rgba(120,63,20,0.4)'
  for (let x = WALL + 6; x < W - WALL; x += 14) ctx.fillRect(x, H - WALL - 6, 3, WALL + 6)
}

export default function games_momo_merge() {
  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => { try { return Number(localStorage.getItem(LS.BEST) || 0) } catch { return 0 } })
  const [curRank, setCurRank] = useState(() => randDrop())
  const [nextRank, setNextRank] = useState(() => randDrop())
  const [muted, setMuted] = useState(false)
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const [cw, setCw] = useState(400)
  const mutedRef = useRef(false)
  mutedRef.current = muted
  const s = useCallback((fn, ...a) => { if (!mutedRef.current) fn(...a) }, [])

  const st = useRef({
    balls: [], parts: [], popups: [], aimX: 200, dropCooldown: 0, worst: 0,
    running: false, over: false, score: 0, cur: 0, next: 1, t: 0,
  })

  const W = cw, H = 560, WALL = 10, LINE_Y = 128

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
    const c = randDrop(); const n = randDrop()
    st.current = { balls: [], parts: [], popups: [], aimX: W / 2, dropCooldown: 0, worst: 0, running: true, over: false, score: 0, cur: c, next: n, t: 0 }
    UID = 1
    setScore(0); setGameOver(false); setPlaying(true)
    setCurRank(c); setNextRank(n)
  }, [W])

  const endGame = useCallback(() => {
    const S = st.current
    if (S.over) return
    S.running = false; S.over = true
    const sc = S.score
    setGameOver(true); s(sndOver)
    setBest((prev) => { const nb = Math.max(prev, sc); try { localStorage.setItem(LS.BEST, String(nb)) } catch {} return nb })
  }, [s])
  const endRef = useRef(endGame); endRef.current = endGame

  const drop = useCallback(() => {
    const S = st.current
    if (!S.running || S.over || S.dropCooldown > 0) return
    const rank = S.cur, r = MOMOS[rank].r
    const x = Math.min(Math.max(S.aimX, WALL + r), W - WALL - r)
    S.balls.push({ id: UID++, x, y: 44, vx: (Math.random() - 0.5) * 20, vy: 30, r, rank, age: 0, above: 0, squash: 1 })
    S.cur = S.next; S.next = randDrop()
    setCurRank(S.cur); setNextRank(S.next)
    S.dropCooldown = 0.4
    s(sndDrop)
  }, [W, s])
  const dropRef = useRef(drop); dropRef.current = drop

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const toX = (clientX) => {
      const rect = cv.getBoundingClientRect()
      st.current.aimX = (clientX - rect.left) * (W / rect.width)
    }
    const mv = (e) => { if (e.touches && e.touches[0]) toX(e.touches[0].clientX); else if (e.clientX != null) toX(e.clientX) }
    const onDown = (e) => {
      if (!st.current.running) { window.dispatchEvent(new Event('ut:game-start')); return }
      e.preventDefault(); mv(e); dropRef.current()
    }
    const onMove = (e) => { e.preventDefault(); mv(e) }
    cv.addEventListener('mousemove', mv)
    cv.addEventListener('mousedown', onDown)
    cv.addEventListener('touchstart', onDown, { passive: false })
    cv.addEventListener('touchmove', onMove, { passive: false })
    return () => {
      cv.removeEventListener('mousemove', mv); cv.removeEventListener('mousedown', onDown)
      cv.removeEventListener('touchstart', onDown); cv.removeEventListener('touchmove', onMove)
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

  // physics + render loop
  useEffect(() => {
    if (!playing) return
    let raf; let last = performance.now()
    const step = (now) => {
      const dt = Math.min(0.033, (now - last) / 1000); last = now
      const S = st.current
      S.t += dt
      if (S.running && !S.over) {
        S.dropCooldown = Math.max(0, S.dropCooldown - dt)
        const sub = 3
        for (let k = 0; k < sub; k++) {
          const h = dt / sub
          for (const b of S.balls) {
            b.age += h
            b.vy += 1600 * h
            b.vx *= (1 - 0.5 * h); b.vy *= (1 - 0.06 * h)
            b.squash += (1 - b.squash) * Math.min(1, 10 * h)
            b.x += b.vx * h; b.y += b.vy * h
            if (b.x - b.r < WALL) { b.x = WALL + b.r; b.vx = Math.abs(b.vx) * 0.4 }
            if (b.x + b.r > W - WALL) { b.x = W - WALL - b.r; b.vx = -Math.abs(b.vx) * 0.4 }
            if (b.y + b.r > H - WALL) {
              b.y = H - WALL - b.r
              if (Math.abs(b.vy) > 120) b.squash = 0.78
              b.vy = -Math.abs(b.vy) * 0.3; b.vx *= 0.96
              if (Math.abs(b.vy) < 30) b.vy = 0
            }
            if (b.y - b.r < 0) { b.y = b.r; b.vy = Math.abs(b.vy) * 0.3 }
          }
          const B = S.balls
          for (let i = 0; i < B.length; i++) {
            for (let j = i + 1; j < B.length; j++) {
              const a = B[i], b = B[j]
              const dx = b.x - a.x, dy = b.y - a.y
              const dist = Math.hypot(dx, dy) || 0.001, min = a.r + b.r
              if (dist < min) {
                const nx = dx / dist, ny = dy / dist, ov = (min - dist) / 2
                a.x -= nx * ov; a.y -= ny * ov
                b.x += nx * ov; b.y += ny * ov
                const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
                if (vn < 0) {
                  const imp = -vn * 0.55
                  a.vx -= imp * nx; a.vy -= imp * ny
                  b.vx += imp * nx; b.vy += imp * ny
                  if (vn < -160) { a.squash = 0.85; b.squash = 0.85 }
                }
              }
            }
          }
        }
        // MERGE: same rank touching (rank < 9). Touching = centres within 92% of summed radii.
        let merged = true
        let guard = 0
        while (merged && guard++ < 12) {
          merged = false
          const B = S.balls
          outer: for (let i = 0; i < B.length; i++) {
            for (let j = i + 1; j < B.length; j++) {
              const a = B[i], b = B[j]
              if (a.rank === b.rank && a.rank < 9 && Math.hypot(b.x - a.x, b.y - a.y) < (a.r + b.r) * 0.92) {
                const nr = a.rank + 1
                const nx = (a.x + b.x) / 2, ny = (a.y + b.y) / 2
                S.balls = B.filter((_, kk) => kk !== i && kk !== j)
                S.balls.push({ id: UID++, x: nx, y: ny, vx: (a.vx + b.vx) / 2, vy: -80, r: MOMOS[nr].r, rank: nr, age: 0, above: 0, squash: 1.18 })
                const pts = MOMOS[nr].score
                S.score += pts
                setScore(S.score)
                for (let p = 0; p < 14; p++) {
                  const an = (p / 14) * Math.PI * 2
                  S.parts.push({ x: nx, y: ny, vx: Math.cos(an) * (90 + Math.random() * 130), vy: Math.sin(an) * (90 + Math.random() * 130) - 60, life: 0.55 + Math.random() * 0.25, max: 0.8, color: MOMOS[nr].edge, ring: false })
                }
                S.parts.push({ x: nx, y: ny, vx: 0, vy: 0, life: 0.35, max: 0.35, color: '#FFFFFF', ring: true, r0: MOMOS[nr].r * 0.5, r1: MOMOS[nr].r * 1.5 })
                S.popups.push({ id: UID++, x: nx, y: ny - MOMOS[nr].r, text: '+' + pts, life: 0.9 })
                s(sndMerge, nr)
                merged = true
                break outer
              }
            }
          }
        }
        // GAME OVER: any momo older than 1s resting with body above the line
        let worst = 0
        for (const b of S.balls) {
          const speed = Math.hypot(b.vx, b.vy)
          if (b.age > 1 && b.y - b.r * 0.55 < LINE_Y && speed < 260) b.above += dt
          else b.above = 0
          worst = Math.max(worst, b.above)
        }
        S.worst = worst
        if (worst > 2) { endRef.current() }
        for (const p of S.parts) { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 500 * dt }
        S.parts = S.parts.filter((p) => p.life > 0)
        for (const p of S.popups) { p.life -= dt; p.y -= 34 * dt }
        S.popups = S.popups.filter((p) => p.life > 0)
      }
      // ---- draw ----
      const cv = canvasRef.current
      if (cv) {
        const dpr = Math.min(2, window.devicePixelRatio || 1)
        if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr) }
        const ctx = cv.getContext('2d')
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        drawBackground(ctx, W, H, LINE_Y, S.t)
        // danger line (pulses red as overflow timer grows)
        const urg = Math.min(1, (S.worst || 0) / 2)
        ctx.save()
        ctx.strokeStyle = urg > 0 ? 'rgba(239,68,68,' + (0.5 + urg * 0.5).toFixed(2) + ')' : 'rgba(255,255,255,0.4)'
        ctx.lineWidth = urg > 0 ? 2 + urg * 2 : 2
        ctx.setLineDash([10, 7])
        if (urg > 0 && Math.floor(S.t * 6) % 2 === 0) ctx.lineWidth += 1
        ctx.beginPath(); ctx.moveTo(WALL, LINE_Y); ctx.lineTo(W - WALL, LINE_Y); ctx.stroke()
        ctx.setLineDash([])
        ctx.font = 'bold 11px system-ui'
        ctx.fillStyle = urg > 0 ? '#FCA5A5' : 'rgba(255,255,255,0.55)'
        ctx.fillText(urg > 0 ? '⚠ ' + (2 - (S.worst || 0)).toFixed(1) + 's — move it down!' : '─ danger line ─', WALL + 8, LINE_Y - 8)
        ctx.restore()
        // aim guide + held momo + dropper claw
        if (S.running && !S.over) {
          const r = MOMOS[S.cur].r
          const ax = Math.min(Math.max(S.aimX, WALL + r), W - WALL - r)
          ctx.save()
          ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.setLineDash([4, 6]); ctx.lineWidth = 2
          ctx.beginPath(); ctx.moveTo(ax, 66); ctx.lineTo(ax, H - WALL); ctx.stroke()
          ctx.setLineDash([])
          ctx.globalAlpha = 0.95
          drawMomo(ctx, ax, 44, r, S.cur)
          ctx.fillStyle = 'rgba(255,255,255,0.5)'
          ctx.fillRect(ax - 14, 8, 28, 5)
          ctx.beginPath(); ctx.moveTo(ax - 14, 13); ctx.lineTo(ax - r * 0.5, 44 - r * 0.9); ctx.lineTo(ax - r * 0.5 + 5, 44 - r * 0.9); ctx.lineTo(ax - 9, 13); ctx.closePath(); ctx.fill()
          ctx.beginPath(); ctx.moveTo(ax + 14, 13); ctx.lineTo(ax + r * 0.5, 44 - r * 0.9); ctx.lineTo(ax + r * 0.5 - 5, 44 - r * 0.9); ctx.lineTo(ax + 9, 13); ctx.closePath(); ctx.fill()
          ctx.restore()
        }
        drawBasket(ctx, W, H, WALL)
        for (const b of S.balls) drawMomo(ctx, b.x, b.y, b.r, b.rank, b.squash)
        // particles
        ctx.save()
        for (const p of S.parts) {
          const a = Math.max(0, p.life / p.max)
          if (p.ring) {
            ctx.globalAlpha = a
            ctx.strokeStyle = p.color; ctx.lineWidth = 3
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r0 + (p.r1 - p.r0) * (1 - a), 0, Math.PI * 2); ctx.stroke()
          } else {
            ctx.globalAlpha = a
            ctx.fillStyle = p.color
            ctx.beginPath(); ctx.arc(p.x, p.y, 3.5 * a + 1, 0, Math.PI * 2); ctx.fill()
          }
        }
        ctx.restore()
        // score popups
        ctx.save()
        ctx.font = 'bold 16px system-ui'; ctx.textAlign = 'center'
        ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.5)'
        for (const p of S.popups) {
          ctx.globalAlpha = Math.min(1, p.life * 2)
          ctx.strokeText(p.text, p.x, p.y)
          ctx.fillStyle = '#FDE047'; ctx.fillText(p.text, p.x, p.y)
        }
        ctx.restore()
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [playing, W, H, s])

  return (
    <GameShell
      name="Momo Merge"
      startAction={startNew} startLabel={!playing ? '🥟 Start Dropping' : '⟲ Restart'}
      extraButtons={
        <button onClick={() => setMuted((m) => !m)} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white transition-all">{muted ? '🔇 Muted' : '🔊 Sound'}</button>
      }
      headerStats={<><span>Score <b className="text-cyan-300">{score}</b></span><span>Best <b className="text-amber-300">🏆 {best}</b></span></>}
      title="Momo Merge — Cute Momo Drop & Merge Puzzle Game"
      desc="Drop cute momos into the steamer, match same sizes to merge them into bigger momos, and beat your best before the stack crosses the line."
      icon="🥟" iconBg="rgba(244,114,182,0.08)"
      category="fun" slug="games-momo-merge"
      faq={[
        { q: 'How do I play Momo Merge?', a: 'Move to aim, click / tap / Space to drop the momo into the steamer. Two momos of the same size touching each other merge into the next bigger size.' },
        { q: 'Which momos can I drop?', a: 'The dropper gives you sizes 1–4 at random, shown as Next. Merge your way up — there are 10 sizes total, ending in the crowned King Momo.' },
        { q: 'Do King Momos merge?', a: 'No. Two size-10 King Momos just sit together — exactly like the Snapchat game, nothing exists past size 10.' },
        { q: 'How do I score?', a: 'Every merge scores points — bigger merges pay more (10 for Mini up to 2000 for King), with burst effects on each merge.' },
        { q: 'When is it game over?', a: 'If a momo rests with its body above the red danger line for 2 seconds, the run ends. The line flashes with a countdown warning first.' },
      ]}
      howItWorks={[
        'Aim with mouse, touch, or arrow keys — click, tap, or Space drops the momo.',
        'Same-size momos touching merge into the next bigger size (1→2→…→10).',
        'Only sizes 1–4 drop randomly. Size 10 never merges.',
        'A momo resting above the red line for 2 seconds ends the run. Chain merges for big points!',
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
            <div className="flex items-end justify-center gap-1.5 mb-4 flex-wrap">
              {MOMOS.slice(0, 7).map((m, i) => (
                <span key={i} className="inline-flex items-center justify-center rounded-full border font-bold text-slate-800"
                  style={{ width: Math.min(46, 16 + m.r * 0.55), height: Math.min(46, 16 + m.r * 0.55), background: m.color, borderColor: m.edge, fontSize: 10 }}>{i + 1}</span>
              ))}
              <span className="text-slate-500 text-xs">…10 👑</span>
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
                    <h2 className="text-xl font-bold text-white mb-1">Steamer Full!</h2>
                    <p className="text-sm text-slate-300 mb-1">Score: <b className="text-cyan-300">{score}</b> · Best: <b className="text-amber-300">{best}</b></p>
                    <p className="text-[11px] text-slate-500 mb-3">A momo rested above the danger line!</p>
                    <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold text-sm hover:scale-105 transition">🥟 Play Again</button>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <p className="text-[10px] text-slate-500 mb-1.5 text-center">MERGE CHART — same + same = next</p>
                <div className="flex items-center justify-center gap-1 flex-wrap">
                  {MOMOS.map((m, i) => (
                    <span key={i} title={m.name + ' (+' + m.score + ')'} className="inline-flex items-center justify-center rounded-full border text-slate-800 font-bold"
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
