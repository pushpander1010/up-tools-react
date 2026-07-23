import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LS = { BEST: 'ut_pm_best', LIVES: 'ut_pm_lives', LEVEL: 'ut_pm_level' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) {
  try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {}
}
function playChomp() { playTone(440,0.05,'sine',0.06); setTimeout(()=>playTone(330,0.05,'sine',0.06),30) }
function playPower() { playTone(523,0.1,'sine',0.08); setTimeout(()=>playTone(659,0.1,'sine',0.08),60); setTimeout(()=>playTone(784,0.12,'sine',0.09),120) }
function playEatGhost() { playTone(880,0.08,'sine',0.1); setTimeout(()=>playTone(1047,0.1,'sine',0.09),50) }
function playDeath() { playTone(400,0.15,'sawtooth',0.07); setTimeout(()=>playTone(300,0.15,'sawtooth',0.06),100); setTimeout(()=>playTone(200,0.25,'sawtooth',0.05),200) }
function playWin() { playTone(523,0.1,'sine',0.08); setTimeout(()=>playTone(659,0.1,'sine',0.08),80); setTimeout(()=>playTone(784,0.1,'sine',0.08),160); setTimeout(()=>playTone(1047,0.2,'sine',0.1),240) }
function playStart() { playTone(330,0.15,'sine',0.07); setTimeout(()=>playTone(440,0.15,'sine',0.07),150); setTimeout(()=>playTone(550,0.15,'sine',0.07),300) }

// 0=empty, 1=wall, 2=dot, 3=power pellet, 4=ghost house
const MAZE_TEMPLATE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
  [1,3,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,3,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,1,2,1,1],
  [1,2,2,2,2,1,2,2,2,1,1,1,2,2,2,1,2,2,2,2,1],
  [1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1],
  [0,0,0,1,2,1,2,2,2,2,2,2,2,2,2,1,2,1,0,0,0],
  [1,1,1,1,2,1,2,1,1,4,4,1,1,2,1,2,1,1,1,1,1],
  [0,0,0,0,2,2,2,1,4,4,4,4,1,2,2,2,0,0,0,0,0],
  [1,1,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1],
  [1,1,1,1,2,1,2,2,2,2,2,2,2,2,2,1,2,1,1,1,1],
  [1,1,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,3,1],
  [1,3,2,1,2,2,2,2,2,0,0,2,2,2,2,2,2,1,2,2,1],
  [1,1,2,1,2,1,2,1,1,1,1,1,1,2,1,2,1,2,1,1,1],
  [1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,2,1,1,1,2,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]

const COLS = 21, ROWS = 21
const GHOST_COLORS = ['#ff0000', '#ffb8ff', '#00ffff', '#ffb851']
const GHOST_NAMES = ['Blinky', 'Pinky', 'Inky', 'Clyde']
const GHOST_SCARED_COLOR = '#2121de'

export default function games_pac_man() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem(LS.BEST) || 0))
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [showStart, setShowStart] = useState(true)

  const gameState = useRef({
    maze: [],
    pac: { x: 10, y: 15, dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 }, mouthAngle: 0, mouthDir: 1 },
    ghosts: [],
    score: 0,
    lives: 3,
    powerTimer: 0,
    dotsEaten: 0,
    totalDots: 0,
    animFrame: null,
    moveTimer: 0,
    running: false,
    ghostEatenCombo: 0,
  })

  const initMaze = useCallback(() => {
    const maze = MAZE_TEMPLATE.map(row => [...row])
    let dots = 0
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (maze[r][c] === 2 || maze[r][c] === 3) dots++
    return { maze, dots }
  }, [])

  const initGhosts = useCallback(() => [
    { x: 10, y: 9, dir: { x: 0, y: -1 }, color: GHOST_COLORS[0], name: 'Blinky', mode: 'chase', scared: false, eatable: false, homeTimer: 0 },
    { x: 9, y: 9, dir: { x: 0, y: 1 }, color: GHOST_COLORS[1], name: 'Pinky', mode: 'scatter', scared: false, eatable: false, homeTimer: 60 },
    { x: 10, y: 9, dir: { x: 1, y: 0 }, color: GHOST_COLORS[2], name: 'Inky', mode: 'scatter', scared: false, eatable: false, homeTimer: 120 },
    { x: 11, y: 9, dir: { x: -1, y: 0 }, color: GHOST_COLORS[3], name: 'Clyde', mode: 'scatter', scared: false, eatable: false, homeTimer: 180 },
  ], [])

  const canMove = useCallback((maze, x, y) => {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false
    // Tunnel wrapping
    if (y === 9 && (x < 0 || x >= COLS)) return true
    const cell = maze[y]?.[x]
    return cell !== undefined && cell !== 1 && cell !== 4
  }, [])

  const startGame = useCallback(() => {
    playStart()
    const { maze, dots } = initMaze()
    const gs = gameState.current
    gs.maze = maze
    gs.pac = { x: 10, y: 15, dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 }, mouthAngle: 0, mouthDir: 1 }
    gs.ghosts = initGhosts()
    gs.score = 0
    gs.lives = 3
    gs.powerTimer = 0
    gs.dotsEaten = 0
    gs.totalDots = dots
    gs.running = true
    gs.ghostEatenCombo = 0
    gs.moveTimer = 0
    setScore(0)
    setLives(3)
    setGameOver(false)
    setWon(false)
    setShowStart(false)
    setPlaying(true)
    setLevel(1)
    requestAnimationFrame(gameLoop)
  }, [initMaze, initGhosts])

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const gs = gameState.current
    const { maze, pac, ghosts } = gs

    // Calculate cell size
    const maxW = Math.min(canvas.parentElement.offsetWidth - 16, 420)
    const cellSize = Math.floor(maxW / COLS)
    canvas.width = cellSize * COLS
    canvas.height = cellSize * ROWS

    // Background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw maze
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = c * cellSize, y = r * cellSize
        const cell = maze[r]?.[c]
        if (cell === 1) {
          ctx.fillStyle = '#1a1a4e'
          ctx.fillRect(x, y, cellSize, cellSize)
          // Wall borders
          ctx.strokeStyle = '#3333aa'
          ctx.lineWidth = 1
          if (r > 0 && maze[r-1]?.[c] !== 1) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + cellSize, y); ctx.stroke() }
          if (r < ROWS-1 && maze[r+1]?.[c] !== 1) { ctx.beginPath(); ctx.moveTo(x, y+cellSize); ctx.lineTo(x+cellSize, y+cellSize); ctx.stroke() }
          if (c > 0 && maze[r]?.[c-1] !== 1) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y+cellSize); ctx.stroke() }
          if (c < COLS-1 && maze[r]?.[c+1] !== 1) { ctx.beginPath(); ctx.moveTo(x+cellSize, y); ctx.lineTo(x+cellSize, y+cellSize); ctx.stroke() }
        } else if (cell === 4) {
          ctx.fillStyle = '#220033'
          ctx.fillRect(x, y, cellSize, cellSize)
        } else if (cell === 2) {
          ctx.fillStyle = '#ffcc00'
          ctx.beginPath()
          ctx.arc(x + cellSize/2, y + cellSize/2, cellSize * 0.12, 0, Math.PI * 2)
          ctx.fill()
        } else if (cell === 3) {
          ctx.fillStyle = '#ffcc00'
          ctx.beginPath()
          ctx.arc(x + cellSize/2, y + cellSize/2, cellSize * 0.3, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // Draw Pac-Man
    const px = pac.x * cellSize + cellSize / 2
    const py = pac.y * cellSize + cellSize / 2
    const pr = cellSize * 0.45
    pac.mouthAngle = Math.min(pac.mouthAngle + pac.mouthDir * 0.15, 0.4)
    if (pac.mouthAngle >= 0.4 || pac.mouthAngle <= 0) pac.mouthDir *= -1
    const mouth = pac.mouthAngle

    let angle = 0
    if (pac.dir.x === 1) angle = 0
    else if (pac.dir.x === -1) angle = Math.PI
    else if (pac.dir.y === -1) angle = -Math.PI / 2
    else if (pac.dir.y === 1) angle = Math.PI / 2

    ctx.fillStyle = '#ffff00'
    ctx.beginPath()
    ctx.arc(px, py, pr, angle + mouth, angle + Math.PI * 2 - mouth)
    ctx.lineTo(px, py)
    ctx.fill()

    // Draw ghosts
    ghosts.forEach((g) => {
      const gx = g.x * cellSize + cellSize / 2
      const gy = g.y * cellSize + cellSize / 2
      const gr = cellSize * 0.42

      if (g.scared || g.eatable) {
        ctx.fillStyle = gs.powerTimer > 150 ? '#ffffff' : GHOST_SCARED_COLOR
        // Scared ghost body
        ctx.beginPath()
        ctx.arc(gx, gy - gr*0.15, gr, Math.PI, 0)
        ctx.lineTo(gx + gr, gy + gr*0.7)
        // Wavy bottom
        for (let i = 3; i >= 0; i--) {
          const wx = gx + gr * (2*i/3 - 1)
          const wy = gy + gr*0.7 + (i%2 === 0 ? gr*0.3 : 0)
          ctx.lineTo(wx, wy)
        }
        ctx.closePath()
        ctx.fill()
      } else {
        ctx.fillStyle = g.color
        // Ghost body
        ctx.beginPath()
        ctx.arc(gx, gy - gr*0.15, gr, Math.PI, 0)
        ctx.lineTo(gx + gr, gy + gr*0.7)
        // Wavy bottom
        for (let i = 3; i >= 0; i--) {
          const wx = gx + gr * (2*i/3 - 1)
          const wy = gy + gr*0.7 + (i%2 === 0 ? gr*0.3 : 0)
          ctx.lineTo(wx, wy)
        }
        ctx.closePath()
        ctx.fill()
        // Eyes
        ctx.fillStyle = '#fff'
        ctx.beginPath(); ctx.arc(gx - gr*0.3, gy - gr*0.2, gr*0.2, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(gx + gr*0.3, gy - gr*0.2, gr*0.2, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = '#00f'
        const edx = g.dir.x * gr*0.08
        const edy = g.dir.y * gr*0.08
        ctx.beginPath(); ctx.arc(gx - gr*0.3 + edx, gy - gr*0.2 + edy, gr*0.1, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(gx + gr*0.3 + edx, gy - gr*0.2 + edy, gr*0.1, 0, Math.PI*2); ctx.fill()
      }
    })

    // Lives display
    for (let i = 0; i < gs.lives; i++) {
      ctx.fillStyle = '#ffff00'
      const lx = 10 + i * (cellSize * 0.8)
      const ly = canvas.height - cellSize * 0.6
      ctx.beginPath()
      ctx.arc(lx, ly, cellSize * 0.3, 0.3, Math.PI * 2 - 0.3)
      ctx.lineTo(lx, ly)
      ctx.fill()
    }

    // Score display
    ctx.fillStyle = '#fff'
    ctx.font = `bold ${cellSize * 0.6}px monospace`
    ctx.fillText(`Score: ${gs.score}`, cellSize, cellSize * 0.7)
  }, [])

  const gameLoop = useCallback((timestamp) => {
    const gs = gameState.current
    if (!gs.running) return

    gs.moveTimer++

    // Move Pac-Man (every 2 frames for smooth movement)
    if (gs.moveTimer % 2 === 0) {
      const { pac, maze } = gs

      // Try next direction first
      if (pac.nextDir.x !== 0 || pac.nextDir.y !== 0) {
        const nx = pac.x + pac.nextDir.x
        const ny = pac.y + pac.nextDir.y
        // Tunnel wrapping
        const wrappedX = nx < 0 ? COLS - 1 : nx >= COLS ? 0 : nx
        if (canMove(maze, wrappedX, ny)) {
          pac.dir = { ...pac.nextDir }
          pac.nextDir = { x: 0, y: 0 }
        }
      }

      if (pac.dir.x !== 0 || pac.dir.y !== 0) {
        let nx = pac.x + pac.dir.x
        let ny = pac.y + pac.dir.y
        // Tunnel wrapping
        nx = nx < 0 ? COLS - 1 : nx >= COLS ? 0 : nx

        if (canMove(maze, nx, ny)) {
          pac.x = nx
          pac.y = ny

          // Eat dots
          const cell = maze[ny]?.[nx]
          if (cell === 2) {
            maze[ny][nx] = 0
            gs.score += 10
            gs.dotsEaten++
            playChomp()
          } else if (cell === 3) {
            maze[ny][nx] = 0
            gs.score += 50
            gs.dotsEaten++
            gs.powerTimer = 400 - (gs.level - 1) * 50
            gs.ghostEatenCombo = 0
            gs.ghosts.forEach(g => { g.scared = true; g.eatable = true })
            playPower()
          }

          setScore(gs.score)

          // Check win
          if (gs.dotsEaten >= gs.totalDots) {
            gs.running = false
            playWin()
            setWon(true)
            setGameOver(true)
            if (gs.score > highScore) {
              setHighScore(gs.score)
              try { localStorage.setItem(LS.BEST, String(gs.score)) } catch {}
            }
            return
          }
        }
      }
    }

    // Move ghosts (every 3 frames)
    if (gs.moveTimer % 3 === 0) {
      const { maze, pac, ghosts } = gs

      ghosts.forEach((g, gi) => {
        // Home timer
        if (g.homeTimer > 0) { g.homeTimer--; return }

        // Power timer
        if (gs.powerTimer > 0) {
          gs.powerTimer--
          if (gs.powerTimer <= 0) {
            ghosts.forEach(ng => { ng.scared = false; ng.eatable = false })
            gs.ghostEatenCombo = 0
          }
        }

        // Ghost AI - choose direction
        const dirs = [
          { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
        ].filter(d => {
          // Can't reverse
          if (d.x === -g.dir.x && d.y === -g.dir.y) return false
          const nx = g.x + d.x
          const ny = g.y + d.y
          const wx = nx < 0 ? COLS - 1 : nx >= COLS ? 0 : nx
          return canMove(maze, wx, ny)
        })

        if (dirs.length === 0) {
          // Reverse if stuck
          const rev = { x: -g.dir.x, y: -g.dir.y }
          const nx = g.x + rev.x
          const ny = g.y + rev.y
          const wx = nx < 0 ? COLS - 1 : nx >= COLS ? 0 : nx
          if (canMove(maze, wx, ny)) dirs.push(rev)
          else return
        }

        let chosen
        if (g.scared) {
          // Random when scared
          chosen = dirs[Math.floor(Math.random() * dirs.length)]
        } else {
          // Target based on ghost personality
          let targetX, targetY
          switch (gi) {
            case 0: // Blinky - direct chase
              targetX = pac.x; targetY = pac.y; break
            case 1: // Pinky - target ahead of pac
              targetX = pac.x + pac.dir.x * 4; targetY = pac.y + pac.dir.y * 4; break
            case 2: // Inky - offset from pac
              targetX = pac.x + pac.dir.x * 2; targetY = pac.y + pac.dir.y * 2; break
            case 3: // Clyde - chase when far, scatter when close
              const dist = Math.abs(g.x - pac.x) + Math.abs(g.y - pac.y)
              if (dist > 8) { targetX = pac.x; targetY = pac.y }
              else { targetX = 1; targetY = ROWS - 2 }
              break
            default: targetX = pac.x; targetY = pac.y
          }

          // Pick direction closest to target
          let minDist = Infinity
          chosen = dirs[0]
          dirs.forEach(d => {
            const nx = g.x + d.x
            const ny = g.y + d.y
            const dist = Math.abs(nx - targetX) + Math.abs(ny - targetY)
            if (dist < minDist) { minDist = dist; chosen = d }
          })
        }

        g.dir = chosen
        let nx = g.x + chosen.x
        let ny = g.y + chosen.y
        g.x = nx < 0 ? COLS - 1 : nx >= COLS ? 0 : nx
        g.y = ny

        // Check collision with Pac-Man
        if (g.x === pac.x && g.y === pac.y) {
          if (g.eatable) {
            // Eat ghost
            gs.ghostEatenCombo++
            const pts = 200 * Math.pow(2, gs.ghostEatenCombo - 1)
            gs.score += pts
            setScore(gs.score)
            playEatGhost()
            // Reset ghost
            g.x = 10; g.y = 9; g.scared = false; g.eatable = false; g.homeTimer = 60
            g.dir = { x: 0, y: -1 }
          } else if (!g.scared) {
            // Pac-Man dies
            gs.lives--
            setLives(gs.lives)
            playDeath()
            if (gs.lives <= 0) {
              gs.running = false
              setGameOver(true)
              if (gs.score > highScore) {
                setHighScore(gs.score)
                try { localStorage.setItem(LS.BEST, String(gs.score)) } catch {}
              }
              return
            }
            // Reset positions
            pac.x = 10; pac.y = 15; pac.dir = { x: 0, y: 0 }; pac.nextDir = { x: 0, y: 0 }
            ghosts.forEach((rg, ri) => {
              rg.x = 10 + ri; rg.y = 9; rg.dir = { x: 0, y: -1 }
              rg.scared = false; rg.eatable = false; rg.homeTimer = 0
            })
            gs.powerTimer = 0
          }
        }
      })
    }

    drawGame()
    gs.animFrame = requestAnimationFrame(gameLoop)
  }, [canMove, drawGame, highScore])

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      const gs = gameState.current
      if (!gs.running) return
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': e.preventDefault(); gs.pac.nextDir = { x: 0, y: -1 }; break
        case 'ArrowDown': case 's': case 'S': e.preventDefault(); gs.pac.nextDir = { x: 0, y: 1 }; break
        case 'ArrowLeft': case 'a': case 'A': e.preventDefault(); gs.pac.nextDir = { x: -1, y: 0 }; break
        case 'ArrowRight': case 'd': case 'D': e.preventDefault(); gs.pac.nextDir = { x: 1, y: 0 }; break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // Touch/swipe controls
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let touchStart = null

    const handleTouchStart = (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      touchStart = { x: touch.clientX, y: touch.clientY }
    }
    const handleTouchEnd = (e) => {
      e.preventDefault()
      if (!touchStart) return
      const gs = gameState.current
      if (!gs.running) return
      const touch = e.changedTouches[0]
      const dx = touch.clientX - touchStart.x
      const dy = touch.clientY - touchStart.y
      const threshold = 10
      if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
        if (Math.abs(dx) > Math.abs(dy)) {
          gs.pac.nextDir = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 }
        } else {
          gs.pac.nextDir = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 }
        }
      }
      touchStart = null
    }

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false })
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [playing])

  // Cleanup animation frame
  useEffect(() => {
    return () => {
      if (gameState.current.animFrame) cancelAnimationFrame(gameState.current.animFrame)
      gameState.current.running = false
    }
  }, [])

  // Stop animation when game ends
  useEffect(() => {
    if (gameOver || !playing) {
      gameState.current.running = false
      if (gameState.current.animFrame) cancelAnimationFrame(gameState.current.animFrame)
    }
  }, [gameOver, playing])

  return (
    <ToolLayout
      title="Pac-Man Online - Classic Arcade Game"
      desc="Play the classic Pac-Man arcade game in your browser! Eat dots, avoid ghosts, grab power pellets. Arrow keys or swipe to move."
      icon="👾" iconBg="rgba(250,204,21,0.08)"
      category="fun" slug="games-pac-man"
      faq={[
        { q: "How do I control Pac-Man?", a: "Use arrow keys or WASD on desktop. On mobile, swipe in the direction you want to move." },
        { q: "What do the power pellets do?", a: "The large glowing dots make ghosts turn blue and vulnerable. Eat them for bonus points — 200, 400, 800, 1600 for consecutive ghosts!" },
        { q: "How many lives do I have?", a: "You start with 3 lives. Losing all lives ends the game." },
      ]}
      howItWorks={[
        "Arrow keys or WASD to move Pac-Man around the maze.",
        "Eat all the small dots (10 points each) to clear the level.",
        "Power pellets (large dots) make ghosts vulnerable for a short time.",
        "Eat blue ghosts for escalating bonus points!",
        "Avoid ghosts when they're not blue — touching one costs a life.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Pac-Man Online", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/pac-man/",
        "genre": "Arcade", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-xl mx-auto space-y-5">
        {/* Score display */}
        <div className="glass p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white">{score}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-yellow-400">{highScore}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Best</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-red-400">{'❤️'.repeat(lives)}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Lives</div>
            </div>
          </div>
        </div>

        {/* Canvas game area */}
        <div ref={resultRef} className="glass p-3 flex justify-center overflow-hidden">
          <div className="relative rounded-xl overflow-hidden" style={{background:'#000'}}>
            <canvas ref={canvasRef} className="block" style={{imageRendering: 'pixelated'}}/>
            {/* Start overlay */}
            {showStart && (
              <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6">
                <div className="text-5xl mb-4">👾</div>
                <h2 className="text-xl font-bold text-white mb-2">PAC-MAN</h2>
                <p className="text-sm text-slate-400 text-center mb-4">Eat dots. Dodge ghosts. Grab power pellets!</p>
                <button onClick={startGame}
                  className="glow-btn px-8 py-3 text-sm">
                  Start Game
                </button>
                <p className="text-xs text-slate-500 mt-3">Arrow keys / WASD / Swipe</p>
              </div>
            )}
            {/* Game over overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6">
                <div className="text-5xl mb-3">{won ? '🎉' : '💀'}</div>
                <h2 className="text-xl font-bold text-white mb-2">{won ? 'You Win!' : 'Game Over!'}</h2>
                <p className="text-sm text-slate-400 mb-4">Score: {score}</p>
                <div className="flex gap-2">
                  <button onClick={startGame}
                    className="glow-btn px-6 py-3 text-sm">
                    {won ? 'Next Level' : 'Play Again'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile controls */}
        <div className="grid grid-cols-3 gap-1 max-w-[200px] mx-auto sm:hidden">
          <div/>
          <button onClick={() => { const gs = gameState.current; if (gs.running) gs.pac.nextDir = { x: 0, y: -1 } }}
            className="p-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-lg active:bg-white/[0.12] hover:bg-white/[0.1]">▲</button>
          <div/>
          <button onClick={() => { const gs = gameState.current; if (gs.running) gs.pac.nextDir = { x: -1, y: 0 } }}
            className="p-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-lg active:bg-white/[0.12] hover:bg-white/[0.1]">◀</button>
          <div className="p-3 text-center text-slate-500 text-xs">D-PAD</div>
          <button onClick={() => { const gs = gameState.current; if (gs.running) gs.pac.nextDir = { x: 1, y: 0 } }}
            className="p-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-lg active:bg-white/[0.12] hover:bg-white/[0.1]">▶</button>
          <div/>
          <button onClick={() => { const gs = gameState.current; if (gs.running) gs.pac.nextDir = { x: 0, y: 1 } }}
            className="p-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-lg active:bg-white/[0.12] hover:bg-white/[0.1]">▼</button>
          <div/>
        </div>

        <p className="text-center text-xs text-slate-500">Desktop: Arrow keys or WASD · Mobile: Swipe or D-pad · High score saved on device.</p>
      </div>
    </ToolLayout>
  )
}
