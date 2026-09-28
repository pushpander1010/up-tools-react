import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const GRID = 20, LS = { BEST: 'ut_snake_best_v1', LAST: 'ut_snake_last_v1' }
const DIR = { UP:{x:0,y:-1}, DOWN:{x:0,y:1}, LEFT:{x:-1,y:0}, RIGHT:{x:1,y:0} }
const speedFor = (score) => Math.max(60, 140 - score * 4)
const levelFor = (score) => 1 + Math.floor(score / 5)

function playTone(freq,dur,type='sine',vol=0.08){
  try{const a=new (window.AudioContext||window.webkitAudioContext)();if(a.state==='suspended')a.resume();const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol,a.currentTime);g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+dur);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+dur)}catch{}
}
function playEat(){playTone(523,0.1,'sine',0.09);setTimeout(()=>playTone(784,0.12,'sine',0.06),60)}
function playDie(){playTone(220,0.3,'sawtooth',0.07);setTimeout(()=>playTone(150,0.4,'sawtooth',0.05),150)}
function playMove(){playTone(180,0.04,'triangle',0.03)}

function fireStart(){ try{ window.dispatchEvent(new Event('ut:game-start')) }catch{} }

export default function SnakeGame() {
  const canvasRef = useRef(null)
  const boardRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(()=>{try{return Number(localStorage.getItem(LS.BEST)||0)}catch{return 0}})
  const [lastScore, setLastScore] = useState(()=>{try{return Number(localStorage.getItem(LS.LAST)||0)}catch{return 0}})

  const g = useRef({ snake:[{x:10,y:10}], dir:DIR.RIGHT, queue:[], food:null, score:0, W:400, H:400, cell:20, dpr:1, playing:false, over:false })
  const pausedRef = useRef(false)
  pausedRef.current = paused

  const fit = useCallback(() => {
    const c = canvasRef.current, board = boardRef.current; if(!c || !board) return
    const rect = board.getBoundingClientRect()
    let side = Math.max(GRID*10, Math.floor(rect.width / GRID) * GRID)
    // In fullscreen respect the shell-published board height so D-pad stays visible.
    try{
      const cap = window.__utBoardH
      if(cap && cap > 220) side = Math.min(side, Math.floor(cap / GRID) * GRID)
    }catch{}
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1))
    g.current.W = side; g.current.H = side; g.current.cell = side / GRID; g.current.dpr = dpr
    c.width = Math.floor(side*dpr); c.height = Math.floor(side*dpr)
    c.style.width = side+'px'; c.style.height = side+'px'
    const ctx = c.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0)
  }, [])

  const food = useCallback(() => {
    let s=g.current, occ=new Set(s.snake.map(p=>p.x+","+p.y)); let pos={}
    do{pos={x:Math.floor(Math.random()*GRID),y:Math.floor(Math.random()*GRID)}}while(occ.has(pos.x+","+pos.y))
    s.food = pos
  }, [])

  const draw = useCallback(() => {
    const c = canvasRef.current; if(!c) return; const ctx = c.getContext('2d'); const s = g.current
    const sz = s.W, cell = s.cell || sz / GRID
    ctx.setTransform(s.dpr||1,0,0,s.dpr||1,0,0)
    ctx.clearRect(0,0,sz,sz)
    ctx.strokeStyle = 'rgba(34,211,238,0.08)'; ctx.lineWidth = 1
    ctx.beginPath()
    for(let i=0;i<=GRID;i++){ const p=Math.min(i*cell+0.5, sz-0.5); ctx.moveTo(p,0.5); ctx.lineTo(p,sz-0.5); ctx.moveTo(0.5,p); ctx.lineTo(sz-0.5,p) }
    ctx.stroke()
    const pad = cell > 14 ? 2 : 1
    if(s.food){ ctx.save(); ctx.shadowColor='#f472b6'; ctx.shadowBlur=18; ctx.fillStyle='#f472b6'; ctx.fillRect(s.food.x*cell+pad,s.food.y*cell+pad,cell-pad*2,cell-pad*2); ctx.restore() }
    for(let i=0;i<s.snake.length;i++){ const p=s.snake[i]; ctx.save(); ctx.fillStyle=i===0?'#22d3ee':'#e879f9'; ctx.shadowColor=i===0?'#22d3ee':'#e879f9'; ctx.shadowBlur=12; ctx.fillRect(p.x*cell+1,p.y*cell+1,cell-2,cell-2); ctx.restore() }
  }, [])

  const die = useCallback(() => {
    const s = g.current
    s.over=true; s.playing=false
    setGameOver(true); setPlaying(false); setPaused(false)
    playDie()
    try{localStorage.setItem(LS.LAST,String(s.score)); setLastScore(s.score)}catch{}
  }, [])

  const tick = useCallback(() => {
    const s = g.current; if(!s.playing||s.over||pausedRef.current) return
    // Drain queued turns, rejecting 180-degree reversals against last applied dir.
    while(s.queue.length){
      const d = s.queue.shift()
      if(d.x !== -s.dir.x || d.y !== -s.dir.y){ s.dir = d; break }
    }
    const head = {x:s.snake[0].x+s.dir.x, y:s.snake[0].y+s.dir.y}
    if(head.x<0||head.x>=GRID||head.y<0||head.y>=GRID){ die(); return }
    for(let p of s.snake) if(p.x===head.x&&p.y===head.y){ die(); return }
    s.snake.unshift(head)
    if(s.food&&head.x===s.food.x&&head.y===s.food.y){
      s.score++; playEat(); food()
      if(s.score>best){setBest(s.score); try{localStorage.setItem(LS.BEST,String(s.score))}catch{}}
      setScore(s.score)
    }
    else s.snake.pop()
    draw()
  }, [draw, food, best, die])

  // Self-perpetuating loop: reschedules itself every step so the snake keeps
  // moving even when the score (and hence React state) doesn't change.
  const tickRef = useRef(tick)
  tickRef.current = tick
  const speedRef = useRef(speedFor(0))
  speedRef.current = speedFor(score)
  useEffect(() => {
    if(!playing) return
    let alive = true, timer = null
    const step = () => {
      if(!alive) return
      try{ tickRef.current() }catch{}
      timer = setTimeout(step, speedRef.current)
    }
    timer = setTimeout(step, speedRef.current)
    return () => { alive = false; if(timer) clearTimeout(timer) }
  }, [playing])

  useEffect(() => {
    const onR = () => { fit(); draw() }
    fit(); draw()
    window.addEventListener('resize', onR)
    window.addEventListener('ut:board-h', onR)
    return () => { window.removeEventListener('resize', onR); window.removeEventListener('ut:board-h', onR) }
  }, [fit, draw])

  // RAW start for GameShell.startAction — no ads, no fullscreen inside.
  const start = useCallback(() => {
    const s = g.current
    s.snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}]; s.dir=DIR.RIGHT; s.queue=[]; s.score=0; s.playing=true; s.over=false
    setScore(0); setGameOver(false); setPlaying(true); setPaused(false); food()
    requestAnimationFrame(() => { fit(); draw() })
    playMove()
  }, [fit, food, draw])

  const handleExit = useCallback(() => {
    g.current.playing = false; g.current.over = false
    setPlaying(false); setGameOver(false); setPaused(false)
    requestAnimationFrame(() => { fit(); draw() })
  }, [fit, draw])

  const togglePause = useCallback(() => {
    if(!g.current.playing || g.current.over) return
    setPaused(p => !p)
  }, [])

  const queueDir = useCallback((d) => {
    const s = g.current
    if(!s.playing || s.over || pausedRef.current) return
    const last = s.queue.length ? s.queue[s.queue.length-1] : s.dir
    if(d.x === -last.x && d.y === -last.y) return // reject reversal vs queued intent
    if(d.x === last.x && d.y === last.y) return
    if(s.queue.length < 3) s.queue.push(d)
  }, [])

  useEffect(() => {
    const k = e => {
      if(!playing && !gameOver && (e.key===' '||e.key==='Enter')) { e.preventDefault(); fireStart(); return }
      if(e.key==='p'||e.key==='P'){ togglePause(); return }
      if(!playing||gameOver||pausedRef.current) return
      if(e.key==='ArrowUp'||e.key==='w'||e.key==='W') { e.preventDefault(); queueDir(DIR.UP) }
      if(e.key==='ArrowDown'||e.key==='s'||e.key==='S') { e.preventDefault(); queueDir(DIR.DOWN) }
      if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A') { e.preventDefault(); queueDir(DIR.LEFT) }
      if(e.key==='ArrowRight'||e.key==='d'||e.key==='D') { e.preventDefault(); queueDir(DIR.RIGHT) }
    }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [playing, gameOver, togglePause, queueDir])

  const touch = useRef({ sx:0, sy:0 })
  const onDown = e => { touch.current.sx=e.touches?e.touches[0].clientX:e.clientX; touch.current.sy=e.touches?e.touches[0].clientY:e.clientY; e.preventDefault() }
  const onUp = e => {
    const cx = e.changedTouches?e.changedTouches[0].clientX:e.clientX, cy = e.changedTouches?e.changedTouches[0].clientY:e.clientY
    const dx = cx - touch.current.sx, dy = cy - touch.current.sy
    if(Math.abs(dx)<10&&Math.abs(dy)<10) return
    if(Math.abs(dx)>Math.abs(dy)){ if(dx>0) queueDir(DIR.RIGHT); else queueDir(DIR.LEFT) }
    else { if(dy>0) queueDir(DIR.DOWN); else queueDir(DIR.UP) }
  }

  const dpadBtn = (label, dir) => (
    <button
      onTouchStart={(e)=>{e.preventDefault(); queueDir(dir)}}
      onMouseDown={(e)=>{e.preventDefault(); queueDir(dir)}}
      className="w-14 h-14 rounded-2xl bg-white/[0.08] border border-white/10 text-cyan-100 font-black text-xl active:bg-cyan-500/30 touch-none select-none"
      aria-label={label}
    >{label}</button>
  )

  const level = levelFor(score)
  const speed = speedFor(score)

  return (
    <GameShell
      name="SNAKE"
      startAction={start}
      startLabel={playing && !gameOver ? '⟲ Restart' : '▶ Start'}
      onExit={handleExit}
      headerStats={<><span>Score <b className="text-white">{score}</b></span><span>Lvl <b className="text-emerald-300">{level}</b></span><span>Best <b className="text-fuchsia-300">{best}</b></span><span>Last <b className="text-slate-400">{lastScore}</b></span></>}
      extraButtons={playing && !gameOver ? (
        <button onClick={togglePause} className="px-6 py-2.5 rounded-full bg-white/[0.08] border border-white/10 text-cyan-100 font-bold text-sm hover:bg-white/15">{paused ? '▶ Resume' : '⏸ Pause'}</button>
      ) : null}
      title="Snake Game Online - Free Classic Arcade"
      desc="Play classic Snake online free. Eat food, grow your neon snake, level up with speed. No download, no sign-up. Works on mobile and desktop."
      icon="🐍" iconBg="rgba(34,211,238,0.08)"
      category="fun" slug="games-snake"
      faq={[
        { q: "How do I play Snake?", a: "Press Start, then steer with arrow keys or WASD on desktop, swipe or the D-pad buttons on mobile. Eat the pink food to grow. Don't hit walls or yourself." },
        { q: "Does Snake get faster?", a: "Yes. Speed increases with every food you eat, and you gain a level every 5 foods. Top speed is very fast — pause with P anytime." },
        { q: "How do I pause Snake?", a: "Press P on desktop or tap the Pause button under the board. Tap Resume to continue." },
        { q: "Can I play Snake on mobile?", a: "Yes. Swipe on the board or use the on-screen arrow buttons. The game goes fullscreen for bigger play." },
        { q: "Is this Snake game free?", a: "Yes, completely free with no sign-up. Your best score is saved on your device." },
        { q: "How is my best score saved?", a: "Your best and last scores are stored in your browser on this device, so they survive refreshes." },
      ]}
      howItWorks={[
        "Press Start and steer with Arrows/WASD, swipe, or the D-pad.",
        "Eat pink food to score and grow longer.",
        "Every food speeds you up; every 5 foods is a new level.",
        "Avoid walls and your own tail. Press P to pause.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Snake Game Online", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/snake/",
        "genre": "Arcade",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="flex-1 min-w-0 max-w-xl mx-auto flex flex-col items-center">
        <div className="glass px-4 py-2 flex gap-5 justify-center w-full">
          <div className="text-center"><div className="text-xl font-extrabold text-white">{score}</div><div className="text-xs text-slate-400 font-medium">Score</div></div>
          <div className="text-center"><div className="text-xl font-extrabold text-emerald-400">Lv {level}</div><div className="text-xs text-slate-400 font-medium">{speed}ms</div></div>
          <div className="text-center"><div className="text-xl font-extrabold text-fuchsia-300">{best}</div><div className="text-xs text-slate-400 font-medium">Best</div></div>
          {paused && <div className="text-center self-center text-xs font-bold text-amber-400">PAUSED</div>}
        </div>

        <div ref={boardRef} className="relative aspect-square flex items-center justify-center w-[min(92vw,520px)] min-w-[260px]">
          <div className="absolute inset-[-24px] rounded-[2rem] bg-gradient-to-br from-cyan-500/20 via-fuchsia-500/10 to-cyan-500/20 blur-2xl -z-10" />
          <canvas ref={canvasRef} onPointerDown={onDown} onPointerUp={onUp} className="rounded-2xl border border-cyan-400/30 shadow-[0_0_60px_rgba(34,211,238,0.25)] bg-[#050d1a] touch-none cursor-pointer" style={{touchAction:'none'}} />
          {!playing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030b14]/80 rounded-2xl z-10 px-4 py-6 text-center overflow-y-auto"
              onPointerDown={(e) => { if (e.target.closest('button')) return; fireStart() }}>
              <img src="/games/snake/cover.jpg" alt="Neon snake arcade cover art" loading="eager"
                className="w-full max-w-[420px] aspect-video object-cover rounded-2xl border border-cyan-400/30 shadow-[0_0_40px_rgba(34,211,238,0.35)] mb-4" />
              <h2 className="text-6xl md:text-7xl font-black bg-gradient-to-b from-cyan-300 via-fuchsia-300 to-cyan-200 bg-clip-text text-transparent mb-3 tracking-tighter">SNAKE</h2>
              {gameOver && <p className="text-xl md:text-2xl text-rose-400 font-bold mb-4">Game Over — Score {score}</p>}
              <div className="flex flex-wrap justify-center gap-1.5 mb-4 text-[11px] font-bold">
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-cyan-200">⚡ Speed ramps</span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-emerald-200">🏆 Levels</span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-amber-200">⏸ Pause (P)</span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-fuchsia-200">📱 Swipe + D-pad</span>
              </div>
              <p className="text-xs md:text-sm text-slate-400 mb-6">Desktop: Arrows / WASD / P pause · Mobile: Swipe or D-pad</p>
              <button onClick={fireStart} className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-extrabold text-lg shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:scale-105 transition">▶ Start Game</button>
            </div>
          )}
          {playing && paused && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030b14]/70 rounded-2xl z-10 px-4 text-center">
              <p className="text-2xl font-black text-amber-300 mb-4">PAUSED</p>
              <button onClick={togglePause} className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-extrabold text-lg hover:scale-105 transition">▶ Resume</button>
            </div>
          )}
        </div>

        {/* Mobile D-pad — sticky so it never hides under the fold */}
        <div className="grid grid-cols-3 gap-2 mt-4 md:hidden sticky bottom-2 z-20 py-2 px-6 bg-[#030b14]/92 backdrop-blur-sm rounded-2xl border border-white/5" aria-label="Direction pad">
          <div />
          <div className="flex justify-center">{dpadBtn('▲', DIR.UP)}</div>
          <div />
          <div className="flex justify-center">{dpadBtn('◀', DIR.LEFT)}</div>
          <div className="flex justify-center">{dpadBtn('▼', DIR.DOWN)}</div>
          <div className="flex justify-center">{dpadBtn('▶', DIR.RIGHT)}</div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-3">
          Desktop: Arrows/WASD move, P pause · Mobile: swipe or D-pad · Speed ramps every food
        </p>
      </div>
    </GameShell>
  )
}
