import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

/* ─── Bubble Shooter Engine (ported from Bubble-Shooter-HTML5) ─── */
const COLORS = ['#ef4444','#22c55e','#3b82f6','#f59e0b','#8b5cf6','#ec4899','#06b6d4']
const NUM_COLORS = 7

const LS = { BEST: 'ut_bubble_best_v1' }

/* ─── Audio ─── */
let audioCtx = null
function ensureAudio() { if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(f,d,t='sine',v=0.06) { try{const ctx=ensureAudio();const o=ctx.createOscillator();const g=ctx.createGain();o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+d);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+d)}catch{} }
function playShoot() { playTone(300,0.06,'triangle',0.04) }
function playPop() { playTone(800,0.08,'sine',0.06); setTimeout(()=>playTone(1000,0.06,'sine',0.04),40) }
function playDrop() { playTone(200,0.15,'sine',0.05) }
function playGameOver() { playTone(150,0.4,'sawtooth',0.05); setTimeout(()=>playTone(100,0.5,'sawtooth',0.04),200) }

export default function games_bubble_shooter() {
  const canvasRef = useRef(null)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(()=>{try{return Number(localStorage.getItem(LS.BEST)||0)}catch{return 0}})
  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)


  const gRef = useRef({
    level: null,
    player: null,
    gameState: 'init', // init, ready, shoot, remove, gameover
    score: 0,
    turnCounter: 0,
    rowOffset: 0,
    cluster: [],
    floatingClusters: [],
    animId: null,
    lastFrame: 0,
    W: 0, H: 0, dpr: 1,
    canvasW: 0, canvasH: 0,
    mouseAngle: 90,
    touchPos: null,
  })

  const degToRad = (a) => a * Math.PI / 180
  const radToDeg = (a) => a * 180 / Math.PI

  const neighborOffsets = [
    [[1,0],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1]],
    [[1,0],[1,1],[0,1],[-1,0],[0,-1],[1,-1]]
  ]

  const createTile = (x,y,type,shift) => ({ x,y,type,removed:false,shift,velocity:0,alpha:1,processed:false })

  const initLevel = useCallback(() => {
    const g = gRef.current
    const cols = 12, rows = 16
    const tileW = 38, tileH = 38, rowH = 32, radius = 19
    const levelW = cols * tileW + tileW/2
    const levelH = (rows-1) * rowH + tileH
    const offsetX = 4, offsetY = 60

    const tiles = []
    for (let i=0;i<cols;i++) { tiles[i]=[]; for(let j=0;j<rows;j++) tiles[i][j]=createTile(i,j,0,0) }

    g.level = { x:offsetX, y:offsetY, width:levelW, height:levelH, columns:cols, rows:rows, tilewidth:tileW, tileheight:tileH, rowheight:rowH, radius, tiles, rowoffset:0 }
    g.player = {
      x: offsetX + levelW/2 - tileW/2, y: offsetY + levelH,
      angle: 90, tiletype: 0,
      bubble: { x:0, y:0, angle:0, speed:900, dropspeed:800, tiletype:0, visible:false },
      nextbubble: { x:0, y:0, tiletype:0 }
    }
    g.player.nextbubble.x = g.player.x - 2*tileW
    g.player.nextbubble.y = g.player.y
  }, [])

  const findColors = useCallback(() => {
    const g = gRef.current; if(!g.level) return []
    const found = new Set()
    for (let i=0;i<g.level.columns;i++) for(let j=0;j<g.level.rows;j++) {
      const t = g.level.tiles[i][j]
      if (t.type >= 0) found.add(t.type)
    }
    return [...found]
  }, [])

  const getExistingColor = useCallback(() => {
    const colors = findColors()
    return colors.length > 0 ? colors[Math.floor(Math.random()*colors.length)] : 0
  }, [findColors])

  const getTileCoord = useCallback((col,row) => {
    const g = gRef.current; if(!g.level) return {tilex:0,tiley:0}
    const lo = g.level
    let tilex = lo.x + col * lo.tilewidth
    if ((row + g.rowOffset) % 2) tilex += lo.tilewidth/2
    const tiley = lo.y + row * lo.rowheight
    return { tilex, tiley }
  }, [])

  const getNeighbors = useCallback((tile) => {
    const g = gRef.current; if(!g.level) return []
    const lo = g.level
    const tilerow = (tile.y + g.rowOffset) % 2
    const n = neighborOffsets[tilerow]
    const neighbors = []
    for (let i=0;i<n.length;i++) {
      const nx = tile.x+n[i][0], ny = tile.y+n[i][1]
      if (nx>=0&&nx<lo.columns&&ny>=0&&ny<lo.rows) neighbors.push(lo.tiles[nx][ny])
    }
    return neighbors
  }, [])

  const findCluster = useCallback((tx,ty,matchtype,reset,skipremoved) => {
    const g = gRef.current; if(!g.level) return []
    const lo = g.level
    if (reset) { for(let i=0;i<lo.columns;i++) for(let j=0;j<lo.rows;j++) lo.tiles[i][j].processed=false }
    const target = lo.tiles[tx][ty]
    const toProcess = [target]; target.processed = true
    const found = []
    while (toProcess.length > 0) {
      const cur = toProcess.pop()
      if (cur.type < 0) continue
      if (skipremoved && cur.removed) continue
      if (!matchtype || cur.type === target.type) {
        found.push(cur)
        for (const nb of getNeighbors(cur)) { if(!nb.processed){toProcess.push(nb);nb.processed=true} }
      }
    }
    return found
  }, [getNeighbors])

  const findFloatingClusters = useCallback(() => {
    const g = gRef.current; if(!g.level) return []
    const lo = g.level
    for(let i=0;i<lo.columns;i++) for(let j=0;j<lo.rows;j++) lo.tiles[i][j].processed=false
    const found = []
    for (let i=0;i<lo.columns;i++) {
      for(let j=0;j<lo.rows;j++) {
        const tile = lo.tiles[i][j]
        if (!tile.processed) {
          const cluster = findCluster(i,j,false,false,true)
          if (cluster.length <= 0) continue
          const floating = !cluster.some(c=>c.y===0)
          if (floating) found.push(cluster)
        }
      }
    }
    return found
  }, [findCluster])

  const nextBubble = useCallback(() => {
    const g = gRef.current; if(!g.player) return
    g.player.tiletype = g.player.nextbubble.tiletype
    g.player.bubble.tiletype = g.player.nextbubble.tiletype
    g.player.bubble.x = g.player.x
    g.player.bubble.y = g.player.y
    g.player.bubble.visible = true
    g.player.nextbubble.tiletype = getExistingColor()
  }, [getExistingColor])

  const createLevel = useCallback(() => {
    const g = gRef.current; if(!g.level) return
    const lo = g.level
    for (let j=0;j<lo.rows;j++) {
      let randTile = Math.floor(Math.random()*NUM_COLORS)
      let count = 0
      for (let i=0;i<lo.columns;i++) {
        if (count >= 2) {
          let newTile = Math.floor(Math.random()*NUM_COLORS)
          if (newTile === randTile) newTile = (newTile+1) % NUM_COLORS
          randTile = newTile; count = 0
        }
        count++
        lo.tiles[i][j].type = j < lo.rows/2 ? randTile : -1
      }
    }
  }, [])

  const circleIntersection = (x1,y1,r1,x2,y2,r2) => {
    const dx=x1-x2, dy=y1-y2
    return Math.sqrt(dx*dx+dy*dy) < r1+r2
  }

  const getGridPosition = useCallback((x,y) => {
    const g = gRef.current; if(!g.level) return {x:0,y:0}
    const lo = g.level
    const gy = Math.floor((y-lo.y)/lo.rowheight)
    let xoff = 0
    if ((gy+g.rowOffset)%2) xoff = lo.tilewidth/2
    const gx = Math.floor(((x-xoff)-lo.x)/lo.tilewidth)
    return {x:gx, y:gy}
  }, [])

  const checkGameOver = useCallback(() => {
    const g = gRef.current; if(!g.level) return false
    const lo = g.level
    for (let i=0;i<lo.columns;i++) {
      if (lo.tiles[i][lo.rows-1].type !== -1) {
        g.gameState = 'gameover'; setGameOver(true); setPlaying(false)
        playGameOver()
        const newBest = Math.max(g.score, best)
        setBest(newBest)
        try{localStorage.setItem(LS.BEST, String(newBest))}catch{}
        return true
      }
    }
    return false
  }, [best])

  const addBubbles = useCallback(() => {
    const g = gRef.current; if(!g.level) return
    const lo = g.level
    for (let i=0;i<lo.columns;i++) {
      for(let j=0;j<lo.rows-1;j++) lo.tiles[i][lo.rows-1-j].type = lo.tiles[i][lo.rows-1-j-1].type
    }
    for (let i=0;i<lo.columns;i++) lo.tiles[i][0].type = getExistingColor()
  }, [getExistingColor])

  const snapBubble = useCallback(() => {
    const g = gRef.current; if(!g.level||!g.player) return
    const lo = g.level
    const centerx = g.player.bubble.x + lo.tilewidth/2
    const centery = g.player.bubble.y + lo.tileheight/2
    const gridpos = getGridPosition(centerx, centery)
    if (gridpos.x<0) gridpos.x=0
    if (gridpos.x>=lo.columns) gridpos.x=lo.columns-1
    if (gridpos.y<0) gridpos.y=0
    if (gridpos.y>=lo.rows) gridpos.y=lo.rows-1

    let addtile = false
    if (lo.tiles[gridpos.x][gridpos.y].type !== -1) {
      for (let nr=gridpos.y+1;nr<lo.rows;nr++) {
        if (lo.tiles[gridpos.x][nr].type===-1) { gridpos.y=nr; addtile=true; break }
      }
    } else { addtile=true }

    if (addtile) {
      g.player.bubble.visible = false
      lo.tiles[gridpos.x][gridpos.y].type = g.player.bubble.tiletype
      if (checkGameOver()) return
      g.cluster = findCluster(gridpos.x,gridpos.y,true,true,false)
      if (g.cluster.length >= 3) { g.gameState='remove'; return }
    }

    g.turnCounter++
    if (g.turnCounter >= 5) {
      addBubbles(); g.turnCounter=0; g.rowOffset=(g.rowOffset+1)%2
      if (checkGameOver()) return
    }
    nextBubble(); g.gameState='ready'
  }, [getGridPosition, checkGameOver, findCluster, addBubbles, nextBubble])

  const shootBubble = useCallback(() => {
    const g = gRef.current; if(!g.player) return
    g.player.bubble.x = g.player.x; g.player.bubble.y = g.player.y
    g.player.bubble.angle = g.player.angle; g.player.bubble.tiletype = g.player.tiletype
    g.gameState = 'shoot'; playShoot()
  }, [])

  const startGame = useCallback(() => {
    const g = gRef.current
    initLevel(); createLevel(); g.score=0; g.turnCounter=0; g.rowOffset=0
    g.gameState='ready'; setScore(0); setGameOver(false); setPlaying(true)
    nextBubble(); nextBubble()
    fitCanvas()
  }, [initLevel, createLevel, nextBubble])

  const stateShootBubble = useCallback((dt) => {
    const g = gRef.current; if(!g.level||!g.player) return
    const lo = g.level, b = g.player.bubble
    b.x += dt * b.speed * Math.cos(degToRad(b.angle))
    b.y += dt * b.speed * -1 * Math.sin(degToRad(b.angle))

    if (b.x <= lo.x) { b.angle = 180-b.angle; b.x=lo.x }
    else if (b.x+lo.tilewidth >= lo.x+lo.width) { b.angle = 180-b.angle; b.x=lo.x+lo.width-lo.tilewidth }

    if (b.y <= lo.y) { b.y=lo.y; snapBubble(); return }

    for (let i=0;i<lo.columns;i++) {
      for(let j=0;j<lo.rows;j++) {
        const tile = lo.tiles[i][j]
        if (tile.type < 0) continue
        const coord = getTileCoord(i,j)
        if (circleIntersection(b.x+lo.tilewidth/2, b.y+lo.tileheight/2, lo.radius, coord.tilex+lo.tilewidth/2, coord.tiley+lo.tileheight/2, lo.radius)) {
          snapBubble(); return
        }
      }
    }
  }, [snapBubble, getTileCoord])

  const stateRemoveCluster = useCallback((dt) => {
    const g = gRef.current; if(!g.level||!g.player) return
    const lo = g.level
    if (g.removeAnimState === 0) {
      for (const t of g.cluster) t.removed = true
      g.score += g.cluster.length * 100
      setScore(g.score)
      playPop()
      g.floatingClusters = findFloatingClusters()
      for (const fc of g.floatingClusters) for (const t of fc) { t.shift=1; t.velocity=g.player.bubble.dropspeed }
      g.removeAnimState = 1; g.removeAnimTime = 0
    }
    if (g.removeAnimState === 1) {
      let tilesLeft = false
      for (const t of g.cluster) {
        if (t.type >= 0) { tilesLeft=true; t.alpha -= dt*15; if(t.alpha<0)t.alpha=0; if(t.alpha===0){t.type=-1;t.alpha=1} }
      }
      for (const fc of g.floatingClusters) {
        for (const t of fc) {
          if (t.type >= 0) { tilesLeft=true; t.velocity+=dt*700; t.shift+=dt*t.velocity; t.alpha-=dt*8; if(t.alpha<0)t.alpha=0; if(t.alpha===0||t.y*lo.rowheight+t.shift>(lo.rows-1)*lo.rowheight+lo.tileheight){t.type=-1;t.shift=0;t.alpha=1} }
        }
      }
      g.score += g.floatingClusters.reduce((s,fc)=>s+fc.length,0)*100
      setScore(g.score)
      if (g.floatingClusters.length > 0) playDrop()
      if (!tilesLeft) {
        nextBubble(); g.gameState='ready'
        // Check win
        let anyTiles = false
        for(let i=0;i<lo.columns;i++) for(let j=0;j<lo.rows;j++) if(lo.tiles[i][j].type!==-1) anyTiles=true
        if (!anyTiles) { g.gameState='gameover'; setGameOver(true); setPlaying(false)
          const newBest = Math.max(g.score, best); setBest(newBest)
          try{localStorage.setItem(LS.BEST,String(newBest))}catch{}
        }
      }
    }
  }, [findFloatingClusters, nextBubble, best])

  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current; if(!canvas) return
    const wrap = canvas.parentElement; if(!wrap) return
    const g = gRef.current; if(!g.level) return
    const lo = g.level
    const totalW = lo.width + 8
    const totalH = lo.height + 3*lo.tileheight + 80
    const maxW = Math.min(totalW, wrap.clientWidth - 16)
    const scale = maxW / totalW
    const w = Math.floor(totalW * scale)
    const h = Math.floor(totalH * scale)
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1))
    g.W = w; g.H = h; g.dpr = dpr; g.canvasW = totalW; g.canvasH = totalH
    canvas.width = Math.floor(w*dpr); canvas.height = Math.floor(h*dpr)
    canvas.style.width = w+'px'; canvas.style.height = h+'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr*scale,0,0,dpr*scale,0,0)
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if(!canvas) return
    const g = gRef.current; if(!g.level||!g.player) return
    const lo = g.level, p = g.player, ctx = canvas.getContext('2d')

    // Background
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, g.canvasW, g.canvasH)

    // Header
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, g.canvasW, 55)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 18px system-ui'
    ctx.textAlign = 'left'
    ctx.fillText('🫧 Bubble Shooter', 10, 35)
    ctx.textAlign = 'right'
    ctx.fillText('Score: '+g.score, g.canvasW-10, 35)

    // Level background
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(lo.x-4, lo.y-4, lo.width+8, lo.height+4-lo.tileheight/2)

    // Render tiles
    for (let j=0;j<lo.rows;j++) {
      for (let i=0;i<lo.columns;i++) {
        const tile = lo.tiles[i][j]
        if (tile.type < 0) continue
        const coord = getTileCoord(i,j)
        ctx.save()
        ctx.globalAlpha = tile.alpha
        const cx = coord.tilex+lo.tilewidth/2, cy = coord.tiley+lo.tileheight/2+tile.shift
        ctx.beginPath()
        ctx.arc(cx, cy, lo.radius, 0, Math.PI*2)
        // Gradient bubble
        const grad = ctx.createRadialGradient(cx-3,cy-3,2,cx,cy,lo.radius)
        grad.addColorStop(0, COLORS[tile.type]+'cc')
        grad.addColorStop(1, COLORS[tile.type])
        ctx.fillStyle = grad
        ctx.fill()
        // Shine
        ctx.beginPath()
        ctx.arc(cx-4, cy-4, lo.radius*0.3, 0, Math.PI*2)
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        ctx.fill()
        ctx.restore()
      }
    }

    // Level bottom
    ctx.fillStyle = '#334155'
    ctx.fillRect(lo.x-4, lo.y-4+lo.height+4-lo.tileheight/2, lo.width+8, 2*lo.tileheight+3)

    // Player
    const centerx = p.x+lo.tilewidth/2, centery = p.y+lo.tileheight/2
    ctx.fillStyle = '#475569'
    ctx.beginPath(); ctx.arc(centerx,centery,lo.radius+10,0,Math.PI*2); ctx.fill()
    ctx.strokeStyle = '#64748b'; ctx.lineWidth=2; ctx.stroke()

    // Angle line
    ctx.strokeStyle = '#6366f1'; ctx.lineWidth=2
    ctx.beginPath()
    ctx.moveTo(centerx,centery)
    ctx.lineTo(centerx+1.5*lo.tilewidth*Math.cos(degToRad(p.angle)), centery-1.5*lo.tileheight*Math.sin(degToRad(p.angle)))
    ctx.stroke()

    // Current bubble
    if (p.bubble.visible) {
      const bx = p.bubble.x+lo.tilewidth/2, by = p.bubble.y+lo.tileheight/2
      ctx.beginPath(); ctx.arc(bx,by,lo.radius,0,Math.PI*2)
      const grad = ctx.createRadialGradient(bx-3,by-3,2,bx,by,lo.radius)
      grad.addColorStop(0, COLORS[p.bubble.tiletype]+'cc')
      grad.addColorStop(1, COLORS[p.bubble.tiletype])
      ctx.fillStyle = grad; ctx.fill()
    }

    // Next bubble
    drawBubble(ctx, p.nextbubble.x, p.nextbubble.y, p.nextbubble.tiletype)

    // Game over
    if (g.gameState === 'gameover') {
      ctx.fillStyle = 'rgba(15,23,42,0.85)'
      ctx.fillRect(lo.x-4,lo.y-4,lo.width+8,lo.height+2*lo.tileheight+8-lo.tileheight/2)
      ctx.fillStyle = '#fff'; ctx.font = 'bold 26px system-ui'; ctx.textAlign = 'center'
      ctx.fillText('Game Over!', lo.x+lo.width/2, lo.y+lo.height/2)
      ctx.font = '14px system-ui'; ctx.fillStyle = '#94a3b8'
      ctx.fillText('Score: '+g.score, lo.x+lo.width/2, lo.y+lo.height/2+30)
      ctx.fillText('Click to restart', lo.x+lo.width/2, lo.y+lo.height/2+55)
    }
  }, [])

  const drawBubble = (ctx, x, y, type) => {
    if (type < 0 || type >= NUM_COLORS) return
    const g = gRef.current; if(!g.level) return
    const lo = g.level
    const cx = x+lo.tilewidth/2, cy = y+lo.tileheight/2
    ctx.beginPath(); ctx.arc(cx,cy,lo.radius,0,Math.PI*2)
    const grad = ctx.createRadialGradient(cx-3,cy-3,2,cx,cy,lo.radius)
    grad.addColorStop(0, COLORS[type]+'cc')
    grad.addColorStop(1, COLORS[type])
    ctx.fillStyle = grad; ctx.fill()
    ctx.beginPath(); ctx.arc(cx-4,cy-4,lo.radius*0.3,0,Math.PI*2)
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fill()
  }

  // Main loop
  const mainLoop = useCallback((ts) => {
    const g = gRef.current
    g.animId = requestAnimationFrame(mainLoop)
    if (!g.level||!g.player||g.gameState==='init') { draw(); return }
    const dt = Math.min((ts - g.lastFrame)/1000, 0.05)
    g.lastFrame = ts
    if (g.gameState === 'shoot') stateShootBubble(dt)
    else if (g.gameState === 'remove') { g.removeAnimState = g.removeAnimState||0; stateRemoveCluster(dt) }
    draw()
  }, [draw, stateShootBubble, stateRemoveCluster])

  useEffect(() => {
    if (playing) {
      gRef.current.lastFrame = performance.now()
      gRef.current.removeAnimState = 0
      gRef.current.animId = requestAnimationFrame(mainLoop)
    }
    return () => { if(gRef.current.animId) cancelAnimationFrame(gRef.current.animId) }
  }, [playing, mainLoop])

  useEffect(() => { fitCanvas(); if(!playing) draw() }, [fitCanvas, draw, playing])

  useEffect(() => {
    const h = () => { fitCanvas(); draw() }
    window.addEventListener('resize', h)
    return () => { window.removeEventListener('resize', h); if(gRef.current.animId) cancelAnimationFrame(gRef.current.animId) }
  }, [fitCanvas, draw])

  // Mouse/touch
  const handleMouseMove = useCallback((e) => {
    const g = gRef.current; if(!g.level||!g.player||g.gameState!=='ready') return
    const canvas = canvasRef.current; if(!canvas) return
    const rect = canvas.getBoundingClientRect()
    const lo = g.level
    const scale = canvas.width / g.dpr / g.canvasW
    const px = (e.clientX - rect.left) / rect.width * g.canvasW
    const py = (e.clientY - rect.top) / rect.height * g.canvasH
    const centerx = g.player.x+lo.tilewidth/2, centery = g.player.y+lo.tileheight/2
    let angle = radToDeg(Math.atan2(centery-py, px-centerx))
    if (angle<0) angle = 180+(180+angle)
    if (angle>90&&angle<270) { if(angle>172)angle=172 }
    else { if(angle<8||angle>=270) angle=8 }
    g.player.angle = angle
  }, [])

  const handleClick = useCallback(() => {
    const g = gRef.current
    if (g.gameState==='ready') shootBubble()
    else if (g.gameState==='gameover') { window.dispatchEvent(new Event('ut:game-start')) }
  }, [shootBubble, startGame])

  // Touch support
  const handleTouchMove = useCallback((e) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY })
  }, [handleMouseMove])

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault()
    handleClick()
  }, [handleClick])

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      const g = gRef.current
      if (g.gameState==='gameover') { if(e.key===' '||e.key==='Enter') { window.dispatchEvent(new Event('ut:game-start')); return } }
      if (g.gameState==='ready') {
        if (e.key===' '||e.key==='Enter') { e.preventDefault(); shootBubble() }
        if (e.key==='ArrowLeft'&&g.player) g.player.angle = Math.min(172, g.player.angle+5)
        if (e.key==='ArrowRight'&&g.player) g.player.angle = Math.max(8, g.player.angle-5)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [shootBubble, startGame])


  return (
    <GameShell
      name="BUBBLE SHOOTER"
      startAction={startGame} startLabel="▶ Start" 
      title="Bubble Shooter Online - Free Arcade Game"
      desc="Play the classic Bubble Shooter game. Match 3 or more colored bubbles to pop them. Aim and shoot to clear the board!"
      icon="🫧" iconBg="rgba(6,182,212,0.08)"
      category="fun" slug="games-bubble-shooter"
      faq={[
        { q:"How do I play Bubble Shooter?", a:"Move your mouse to aim and click to shoot. Match 3+ same-colored bubbles to pop them. Clear all bubbles to win!" },
        { q:"What happens when bubbles reach the bottom?", a:"Game over! New rows push down every 5 shots if no clusters are found." },
        { q:"How is score calculated?", a:"Each popped bubble gives 100 points. Floating clusters that drop also give bonus points." },
      ]}
      howItWorks={[
        "Press Start to begin. Move mouse to aim the shooter.",
        "Click to fire. Bubbles bounce off walls.",
        "Match 3+ same-colored bubbles to pop them.",
        "Every 5 shots without a match, a new row pushes down. Don't let them reach the bottom!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Bubble Shooter", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/bubble-shooter/",
        "genre": "Arcade",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="flex gap-4 max-w-6xl mx-auto overflow-hidden">
        <div className="flex-1 min-w-0 max-w-xl mx-auto space-y-4 overflow-hidden">
          <div className="glass p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-extrabold text-white">{score}</div>
                <div className="text-xs text-slate-400 font-medium">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extrabold text-cyan-400">{best}</div>
                <div className="text-xs text-slate-400 font-medium">Best</div>
              </div>
            </div>
          </div>

          <div className="glass p-3 flex justify-center overflow-hidden">
            <canvas ref={canvasRef}
              onMouseMove={handleMouseMove} onClick={handleClick}
              onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
              className="rounded-xl cursor-pointer"
              style={{background:'#0f172a', touchAction:'none'}} />
          </div>

          <p className="text-center text-xs text-slate-400">
            Desktop: Move mouse to aim, click to shoot | Mobile: Touch to aim & shoot
          </p>
        </div>
      </div>
    </GameShell>
  )
}
