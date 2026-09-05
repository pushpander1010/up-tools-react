import { useState, useCallback, useEffect, useRef } from 'react'
const GRID = 20, LS = { BEST: 'ut_snake_best_v1', LAST: 'ut_snake_last_v1' }
const DIR = { UP:{x:0,y:-1}, DOWN:{x:0,y:1}, LEFT:{x:-1,y:0}, RIGHT:{x:1,y:0} }

function playTone(freq,dur,type='sine',vol=0.08){
  try{const a=new (window.AudioContext||window.webkitAudioContext)();if(a.state==='suspended')a.resume();const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol,a.currentTime);g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+dur);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+dur)}catch{}
}
function playEat(){playTone(523,0.1,'sine',0.09);setTimeout(()=>playTone(784,0.12,'sine',0.06),60)}
function playDie(){playTone(220,0.3,'sawtooth',0.07);setTimeout(()=>playTone(150,0.4,'sawtooth',0.05),150)}
function playMove(){playTone(180,0.04,'triangle',0.03)}

export default function SnakeGame() {
  const canvasRef = useRef(null)
  const rootRef = useRef(null)
  const boardRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(()=>{try{return Number(localStorage.getItem(LS.BEST)||0)}catch{return 0}})
  const [lastScore, setLastScore] = useState(()=>{try{return Number(localStorage.getItem(LS.LAST)||0)}catch{return 0}})
  const [fs, setFs] = useState(false)

  const g = useRef({ snake:[{x:10,y:10}], dir:DIR.RIGHT, nextDir:DIR.RIGHT, food:null, score:0, W:400, H:400, cell:20, dpr:1, tick:0, speed:140, playing:false, over:false })

  const fit = useCallback(() => {
    const c = canvasRef.current, board = boardRef.current; if(!c || !board) return
    // Round side DOWN to a multiple of GRID so cell is an integer px:
    // fractional cells desync collision vs render and make grid lines uneven.
    const rect = board.getBoundingClientRect()
    const side = Math.max(GRID*10, Math.floor(rect.width / GRID) * GRID)
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
    // Crisp uniform grid: integer cell + 0.5-offset lines, edges inset by 0.5
    // so the border never clips into the rounded canvas edge.
    ctx.clearRect(0,0,sz,sz)
    ctx.strokeStyle = 'rgba(34,211,238,0.08)'; ctx.lineWidth = 1
    ctx.beginPath()
    for(let i=0;i<=GRID;i++){ const p=Math.min(i*cell+0.5, sz-0.5); ctx.moveTo(p,0.5); ctx.lineTo(p,sz-0.5); ctx.moveTo(0.5,p); ctx.lineTo(sz-0.5,p) }
    ctx.stroke()
    const pad = cell > 14 ? 2 : 1
    if(s.food){ ctx.save(); ctx.shadowColor='#f472b6'; ctx.shadowBlur=18; ctx.fillStyle='#f472b6'; ctx.fillRect(s.food.x*cell+pad,s.food.y*cell+pad,cell-pad*2,cell-pad*2); ctx.restore() }
    for(let i=0;i<s.snake.length;i++){ const p=s.snake[i]; ctx.save(); ctx.fillStyle=i===0?'#22d3ee':'#e879f9'; ctx.shadowColor=i===0?'#22d3ee':'#e879f9'; ctx.shadowBlur=12; ctx.fillRect(p.x*cell+1,p.y*cell+1,cell-2,cell-2); ctx.restore() }
  }, [])

  const tick = useCallback(() => {
    const s = g.current; if(!s.playing||s.over) return
    s.dir = s.nextDir; s.tick++
    const head = {x:s.snake[0].x+s.dir.x, y:s.snake[0].y+s.dir.y}
    if(head.x<0||head.x>=GRID||head.y<0||head.y>=GRID){ s.over=true; s.playing=false; setGameOver(true); setPlaying(false); playDie(); try{localStorage.setItem(LS.LAST,String(s.score))}catch{}; return }
    for(let p of s.snake) if(p.x===head.x&&p.y===head.y){ s.over=true; s.playing=false; setGameOver(true); setPlaying(false); playDie(); try{localStorage.setItem(LS.LAST,String(s.score))}catch{}; return }
    s.snake.unshift(head)
    if(s.food&&head.x===s.food.x&&head.y===s.food.y){ s.score++; playEat(); food(); if(s.score>best){setBest(s.score); try{localStorage.setItem(LS.BEST,String(s.score))}catch{}} setScore(s.score) }
    else s.snake.pop()
    draw();
  }, [draw, food, best])

  useEffect(() => { const i = setInterval(tick, g.current.speed); return () => clearInterval(i) }, [tick])

  useEffect(() => {
    const onR = () => { fit(); draw() }
    fit(); draw()
    window.addEventListener('resize', onR)
    return () => window.removeEventListener('resize', onR)
  }, [fit, draw])

  const goFullscreen = useCallback(() => {
    // Fullscreen the whole game root so header + Exit stay on screen.
    // Falls back to a CSS overlay (fs=true) where the native API is
    // missing or blocked (e.g. iPhone Safari) so Exit is never lost.
    const el = rootRef.current
    if(!el){ setFs(true); return }
    try{
      if(document.fullscreenElement || document.webkitFullscreenElement) return
      const req = (el.requestFullscreen && el.requestFullscreen.bind(el)) || (el.webkitRequestFullscreen && el.webkitRequestFullscreen.bind(el))
      if(req){
        const p = req()
        if(p && p.catch) p.catch(() => setFs(true))
      } else setFs(true)
    }catch{ setFs(true) }
  }, [])

  const start = useCallback(() => {
    const s = g.current
    s.snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}]; s.dir=DIR.RIGHT; s.nextDir=DIR.RIGHT; s.score=0; s.playing=true; s.over=false; s.speed=140
    setScore(0); setGameOver(false); setPlaying(true); food()
    // Fit after layout settles, then draw and go fullscreen on the root.
    requestAnimationFrame(() => { fit(); draw() })
    playMove()
    goFullscreen()
  }, [fit, food, draw, goFullscreen])

  const exit = useCallback(() => {
    g.current.playing = false; g.current.over = false
    setPlaying(false); setGameOver(false)
    try { if(document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(()=>{}) } catch{}
    try { if(document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen() } catch{}
    setFs(false)
    requestAnimationFrame(() => { fit(); draw() })
  }, [fit, draw])

  useEffect(() => {
    const k = e => {
      if(e.key==='Escape'){ exit(); return }
      if(!playing||gameOver) return
      if(e.key==='ArrowUp'||e.key==='w'||e.key==='W') { e.preventDefault(); if(g.current.dir.y===0) g.current.nextDir=DIR.UP }
      if(e.key==='ArrowDown'||e.key==='s'||e.key==='S') { e.preventDefault(); if(g.current.dir.y===0) g.current.nextDir=DIR.DOWN }
      if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A') { e.preventDefault(); if(g.current.dir.x===0) g.current.nextDir=DIR.LEFT }
      if(e.key==='ArrowRight'||e.key==='d'||e.key==='D') { e.preventDefault(); if(g.current.dir.x===0) g.current.nextDir=DIR.RIGHT }
    }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [playing, gameOver, exit])

  const touch = useRef({ sx:0, sy:0 })
  const onDown = e => { touch.current.sx=e.touches?e.touches[0].clientX:e.clientX; touch.current.sy=e.touches?e.touches[0].clientY:e.clientY; e.preventDefault() }
  const onUp = e => {
    const cx = e.changedTouches?e.changedTouches[0].clientX:e.clientX, cy = e.changedTouches?e.changedTouches[0].clientY:e.clientY
    const dx = cx - touch.current.sx, dy = cy - touch.current.sy
    if(Math.abs(dx)<10&&Math.abs(dy)<10) return
    if(Math.abs(dx)>Math.abs(dy)){ if(dx>0&&g.current.dir.x===0) g.current.nextDir=DIR.RIGHT; else if(dx<0&&g.current.dir.x===0) g.current.nextDir=DIR.LEFT }
    else { if(dy>0&&g.current.dir.y===0) g.current.nextDir=DIR.DOWN; else if(dy<0&&g.current.dir.y===0) g.current.nextDir=DIR.UP }
  }

  useEffect(() => {
    const h = () => {
      const on = !!(document.fullscreenElement || document.webkitFullscreenElement)
      setFs(on)
      // Re-measure after fullscreen transition, then redraw.
      setTimeout(() => { fit(); draw() }, 60)
      setTimeout(() => { fit(); draw() }, 300)
    }
    document.addEventListener('fullscreenchange', h); document.addEventListener('webkitfullscreenchange', h);
    return () => { document.removeEventListener('fullscreenchange', h); document.removeEventListener('webkitfullscreenchange', h) }
  }, [fit, draw])

  // NOTE: removed the old 120ms fit()+draw() loop — it reset canvas size every
  // tick (flicker) and fought the game loop. Canvas is now fitted on
  // resize / fullscreen change only.

  return (
    <div ref={rootRef} className={`relative w-full min-h-[100dvh] bg-[#030b14] text-white flex flex-col overflow-x-hidden overflow-y-auto ${fs ? 'fixed inset-0 z-[100]' : ''}`}>
      <header className={`flex items-center justify-between px-4 md:px-6 py-3 gap-4 ${fs ? 'border-b border-cyan-500/20 bg-black/60 sticky top-0 z-20' : ''}`}>
        <h1 className="text-base md:text-xl font-black tracking-tighter bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-cyan-200 bg-clip-text text-transparent">SNAKE</h1>
        <div className="flex gap-3 md:gap-5 font-mono text-xs md:text-sm text-cyan-200 whitespace-nowrap">
          <span>Score <b className="text-white">{score}</b></span>
          <span>Best <b className="text-fuchsia-300">{best}</b></span>
          <span>Last <b className="text-slate-400">{lastScore}</b></span>
        </div>
        <button onClick={exit} className="text-xs md:text-sm px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 font-bold">✕ Exit</button>
      </header>

      <main className={`flex-1 flex flex-col items-center justify-start ${fs ? 'py-3 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] overflow-y-auto' : 'py-5 px-4'}`}>
        <div ref={boardRef} className={`relative aspect-square flex items-center justify-center shadow-[0_0_60px_rgba(34,211,238,0.15)] ${fs ? 'w-[min(94vw,calc(100dvh-220px),640px)]' : 'w-[min(92vw,520px,calc(100dvh-300px))] min-w-[260px]'}`}>
          <div className="absolute inset-[-24px] rounded-[2rem] bg-gradient-to-br from-cyan-500/20 via-fuchsia-500/10 to-cyan-500/20 blur-2xl -z-10" />
          <canvas ref={canvasRef} onPointerDown={onDown} onPointerUp={onUp} className="rounded-2xl border border-cyan-400/30 shadow-[0_0_60px_rgba(34,211,238,0.25)] bg-[#050d1a] touch-none cursor-pointer" style={{touchAction:'none'}} />
          {!playing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030b14]/80 rounded-2xl z-10 px-4 text-center">
              <h2 className="text-6xl md:text-7xl font-black bg-gradient-to-b from-cyan-300 via-fuchsia-300 to-cyan-200 bg-clip-text text-transparent mb-3 tracking-tighter">SNAKE</h2>
              {gameOver && <p className="text-xl md:text-2xl text-rose-400 font-bold mb-4">Game Over</p>}
              <p className="text-xs md:text-sm text-slate-400 mb-6">Desktop: Arrows / WASD · Mobile: Swipe</p>
              <button onClick={start} className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-extrabold text-lg shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:scale-105 transition">▶ Start Game</button>
            </div>
          )}
        </div>
        <div className="mt-5 flex flex-wrap justify-center items-center gap-3 md:gap-4">
          <button onClick={start} className="px-6 py-2.5 rounded-full bg-white/[0.08] border border-white/10 text-cyan-100 font-bold text-sm hover:bg-white/15">⟲ Restart</button>
          <button onClick={goFullscreen} className="px-6 py-2.5 rounded-full bg-white/[0.08] border border-white/10 text-cyan-100 font-bold text-sm hover:bg-white/15">⛶ Fullscreen</button>
          {fs && <button onClick={exit} className="px-6 py-2.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-100 font-bold text-sm hover:bg-rose-500/30">✕ Exit game</button>}
        </div>
      </main>
      <footer className="text-center text-[11px] text-slate-600 py-2 font-mono">Neon Arcade · Snake</footer>
    </div>
  )
}
