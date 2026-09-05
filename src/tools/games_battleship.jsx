import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

/* ─── Battleship Engine (ported from battleship-game) ─── */
const BOARD_SIZE = 7
const SHIPS = [
  { name:'Carrier', size:5 },
  { name:'Battleship', size:4 },
  { name:'Cruiser', size:3 },
  { name:'Submarine', size:3 },
  { name:'Destroyer', size:2 },
]
const TOTAL_SHIPS = SHIPS.length
const ROW_LABELS = ['A','B','C','D','E','F','G']
const TIMER_DURATION = 120

const LS = { BEST: 'ut_battleship_best_v1' }

/* ─── Audio ─── */
let audioCtx = null
function ensureAudio() { if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(f,d,t='sine',v=0.06) { try{const ctx=ensureAudio();const o=ctx.createOscillator();const g=ctx.createGain();o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+d);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+d)}catch{} }
function playHit() { playTone(600,0.15,'square',0.06); setTimeout(()=>playTone(400,0.2,'square',0.05),100) }
function playMiss() { playTone(200,0.1,'sine',0.04) }
function playSunk() { playTone(300,0.1,'sawtooth',0.06); setTimeout(()=>playTone(400,0.1,'sawtooth',0.06),100); setTimeout(()=>playTone(500,0.15,'sawtooth',0.06),200) }
function playWin() { [523,659,784,1047].forEach((f,i)=>setTimeout(()=>playTone(f,0.2,'sine',0.08),i*120)) }
function playLose() { playTone(200,0.5,'sawtooth',0.06); setTimeout(()=>playTone(150,0.5,'sawtooth',0.05),300) }

function generateShipLocations(boardSize, ships) {
  const placed = []
  for (const ship of ships) {
    let attempts = 0
    while (attempts < 200) {
      attempts++
      const dir = Math.random() < 0.5 ? 'h' : 'v'
      let row, col
      if (dir === 'h') {
        row = Math.floor(Math.random()*boardSize)
        col = Math.floor(Math.random()*(boardSize-ship.size+1))
      } else {
        row = Math.floor(Math.random()*(boardSize-ship.size+1))
        col = Math.floor(Math.random()*boardSize)
      }
      const locs = []
      for (let i=0;i<ship.size;i++) {
        locs.push(dir==='h' ? `${row}${col+i}` : `${row+i}${col}`)
      }
      // Check collision
      let collision = false
      for (const p of placed) {
        for (const l of locs) { if(p.locations.includes(l)){collision=true;break} }
        if (collision) break
      }
      if (!collision) { placed.push({ name:ship.name, size:ship.size, locations:locs, hits:Array(ship.size).fill(''), sunk:false }); break }
    }
  }
  return placed
}

function aiFire(board, lastHits) {
  // Hunt mode: if we have unhit adjacent to a hit, target there
  if (lastHits.length > 0) {
    const dirs = [[0,1],[0,-1],[1,0],[-1,0]]
    for (const hit of lastHits) {
      const r = parseInt(hit[0]), c = parseInt(hit[1])
      for (const [dr,dc] of dirs) {
        const nr=r+dr, nc=c+dc
        if (nr>=0&&nr<BOARD_SIZE&&nc>=0&&nc<BOARD_SIZE) {
          const key = `${nr}${nc}`
          if (board[key]==='empty'||board[key]==='ship') return key
        }
      }
    }
  }
  // Random target
  const available = []
  for (let r=0;r<BOARD_SIZE;r++) for(let c=0;c<BOARD_SIZE;c++) {
    const key=`${r}${c}`
    if (board[key]==='empty'||board[key]==='ship') available.push(key)
  }
  return available[Math.floor(Math.random()*available.length)]
}

export default function games_battleship() {
  const [phase, setPhase] = useState('setup') // setup, play, win, lose
  const [playerBoard, setPlayerBoard] = useState({})
  const [enemyBoard, setEnemyBoard] = useState({})
  const [playerShips, setPlayerShips] = useState([])
  const [enemyShips, setEnemyShips] = useState([])
  const [playerGuesses, setPlayerGuesses] = useState({})
  const [enemyGuesses, setEnemyGuesses] = useState({})
  const [message, setMessage] = useState('Place your ships! Click on the grid.')
  const [shipsToPlace, setShipsToPlace] = useState([])
  const [placingShip, setPlacingShip] = useState(null)
  const [placingDir, setPlacingDir] = useState('h')
  const [placingHover, setPlacingHover] = useState(null)
  const [timer, setTimer] = useState(TIMER_DURATION)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(()=>{try{return JSON.parse(localStorage.getItem(LS.BEST)||'{}')}catch{return {}}})
  const [sunkPlayer, setSunkPlayer] = useState(0)
  const [sunkEnemy, setSunkEnemy] = useState(0)


  const timerRef = useRef(null)
  const gRef = useRef({ playerBoard:{}, enemyBoard:{}, playerShips:[], enemyShips:[], enemyGuesses:{}, playerGuesses:{}, lastEnemyHits:[] })

  useEffect(() => {
    gRef.current = { playerBoard, enemyBoard, playerShips, enemyShips, enemyGuesses, playerGuesses }
  }, [playerBoard, enemyBoard, playerShips, enemyShips, enemyGuesses, playerGuesses])

  const formatTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`

  const startGame = useCallback(() => {
    const eShips = generateShipLocations(BOARD_SIZE, SHIPS)
    const eBoard = {}
    for (const ship of eShips) for (const loc of ship.locations) eBoard[loc] = 'ship'
    for (let r=0;r<BOARD_SIZE;r++) for(let c=0;c<BOARD_SIZE;c++) { const k=`${r}${c}`; if(!eBoard[k]) eBoard[k]='empty' }

    setEnemyBoard(eBoard); setEnemyShips(eShips)
    setPlayerBoard({}); setPlayerShips([])
    setPlayerGuesses({}); setEnemyGuesses({})
    setSunkPlayer(0); setSunkEnemy(0)
    setShipsToPlace([...SHIPS])
    setPlacingShip(SHIPS[0]); setPlacingDir('h')
    setPhase('setup'); setScore(0); setMessage('Place your Carrier (5 cells). Press R to rotate.')
    setTimer(TIMER_DURATION)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const finishSetup = useCallback(() => {
    setPhase('play')
    setMessage('Your turn! Click on the enemy grid to fire.')
    timerRef.current = setInterval(()=>{
      setTimer(t=>{
        if (t<=1) { clearInterval(timerRef.current); setPhase('lose'); playLose(); setMessage("Time's up! You lose."); return 0 }
        return t-1
      })
    }, 1000)
  }, [])

  useEffect(() => { return ()=>{ if(timerRef.current) clearInterval(timerRef.current) } }, [])

  // Keyboard: R to rotate ship during setup
  useEffect(() => {
    const handler = (e) => {
      if (phase==='setup' && (e.key==='r'||e.key==='R')) {
        setPlacingDir(d => d==='h'?'v':'h')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase])

  const canPlace = useCallback((board, row, col, size, dir) => {
    for (let i=0;i<size;i++) {
      const r = dir==='h'?row:row+i, c = dir==='h'?col+i:col
      if (r<0||r>=BOARD_SIZE||c<0||c>=BOARD_SIZE) return false
      if (board[`${r}${c}`]) return false
    }
    return true
  }, [])

  const placeShip = useCallback((row, col) => {
    if (phase!=='setup' || !placingShip) return
    const dir = placingDir
    if (!canPlace(playerBoard, row, col, placingShip.size, dir)) { setMessage('Cannot place here! Press R to rotate.'); return }

    const newBoard = {...playerBoard}
    const newShips = [...playerShips]
    const locs = []
    for (let i=0;i<placingShip.size;i++) {
      const r = dir==='h'?row:row+i, c = dir==='h'?col+i:col
      newBoard[`${r}${c}`] = 'ship'; locs.push(`${r}${c}`)
    }
    newShips.push({ name:placingShip.name, size:placingShip.size, locations:locs, hits:Array(placingShip.size).fill(''), sunk:false })

    const remaining = shipsToPlace.filter((_,i)=>i>0)
    setPlayerBoard(newBoard); setPlayerShips(newShips); setShipsToPlace(remaining)
    if (remaining.length > 0) {
      setPlacingShip(remaining[0])
      setMessage(`Place your ${remaining[0].name} (${remaining[0].size} cells). Press R to rotate.`)
    } else {
      setPlacingShip(null)
      finishSetup()
    }
  }, [phase, placingShip, placingDir, playerBoard, playerShips, shipsToPlace, canPlace, finishSetup])

  const fireEnemy = useCallback((row, col) => {
    if (phase!=='play') return
    const key = `${row}${col}`
    if (playerGuesses[key]) return

    const g = gRef.current
    const newGuesses = {...playerGuesses}
    const newEnemyShips = g.enemyShips.map(s=>({...s, hits:[...s.hits]}))
    const isHit = g.enemyBoard[key] === 'ship'
    newGuesses[key] = isHit ? 'hit' : 'miss'

    if (isHit) {
      playHit()
      setMessage('HIT!')
      // Find which ship
      for (const ship of newEnemyShips) {
        const idx = ship.locations.indexOf(key)
        if (idx>=0) {
          ship.hits[idx] = 'hit'
          if (ship.hits.every(h=>h==='hit')) {
            ship.sunk = true; playSunk()
            setMessage(`You sank their ${ship.name}!`)
            setSunkEnemy(n=>n+1)
            setScore(s=>s+ship.size*100)
          }
          break
        }
      }
      // Check win
      if (newEnemyShips.every(s=>s.sunk)) {
        clearInterval(timerRef.current)
        setPhase('win'); playWin()
        setMessage(`Victory! You sank all ships in ${TIMER_DURATION-timer} seconds!`)
        const newBest = {...best}
        const prev = newBest.battleship
        if (!prev || score+100 > prev) { newBest.battleship = score+100; try{localStorage.setItem(LS.BEST,JSON.stringify(newBest))}catch{} }
        setBest(newBest)
        return
      }
    } else {
      playMiss()
      setMessage('Miss!')
    }

    setPlayerGuesses(newGuesses)
    setEnemyShips(newEnemyShips)

    // AI turn
    setTimeout(()=>{
      const g2 = gRef.current
      const aiKey = aiFire(g2.playerBoard, g2.lastEnemyHits||[])
      if (!aiKey) return
      const newEGuesses = {...g2.enemyGuesses}
      const newPShips = g2.playerShips.map(s=>({...s,hits:[...s.hits]}))
      const aiHit = g2.playerBoard[aiKey] === 'ship'
      newEGuesses[aiKey] = aiHit ? 'hit' : 'miss'

      if (aiHit) {
        playHit()
        for (const ship of newPShips) {
          const idx = ship.locations.indexOf(aiKey)
          if (idx>=0) { ship.hits[idx]='hit'; if(ship.hits.every(h=>h==='hit')){ship.sunk=true;playSunk();setSunkPlayer(n=>n+1)} break }
        }
        if (!g2.lastEnemyHits) g2.lastEnemyHits = []
        g2.lastEnemyHits.push(aiKey)
        // Remove hits from sunk ships
        const sunkLocs = newPShips.filter(s=>s.sunk).flatMap(s=>s.locations)
        g2.lastEnemyHits = g2.lastEnemyHits.filter(h=>!sunkLocs.includes(h))
      } else {
        playMiss()
      }

      setEnemyGuesses(newEGuesses)
      setPlayerShips(newPShips)

      if (newPShips.every(s=>s.sunk)) {
        clearInterval(timerRef.current)
        setPhase('lose'); playLose()
        setMessage('All your ships are sunk! Game Over.')
      }
    }, 400)
  }, [phase, playerGuesses, best, score, timer])

  const handleCellClick = useCallback((row, col) => {
    if (phase==='setup') placeShip(row, col)
    else if (phase==='play') fireEnemy(row, col)
  }, [phase, placeShip, fireEnemy])

  const getPlacingCells = useCallback((row, col) => {
    if (!placingShip || !placingDir) return []
    const cells = []
    for (let i=0;i<placingShip.size;i++) {
      const r = placingDir==='h'?row:row+i, c = placingDir==='h'?col+i:col
      if (r<0||r>=BOARD_SIZE||c<0||c>=BOARD_SIZE) return []
      cells.push(`${r}${c}`)
    }
    return cells
  }, [placingShip, placingDir])

  const renderBoard = (boardData, guesses, isEnemy, onCellHover) => {
    const cells = []
    for (let r=0;r<BOARD_SIZE;r++) {
      for (let c=0;c<BOARD_SIZE;c++) {
        const key = `${r}${c}`
        const shipHere = boardData[key]==='ship'
        const guess = guesses[key]
        let bg = 'bg-slate-800/50', border = 'border-slate-700/50', content = ''

        if (guess === 'hit') { bg = 'bg-red-500/30'; border = 'border-red-500/50'; content = '🔥' }
        else if (guess === 'miss') { bg = 'bg-slate-700/30'; border = 'border-slate-600/30'; content = '💧' }
        else if (!isEnemy && shipHere) { bg = 'bg-blue-500/20'; border = 'border-blue-500/30' }

        // Check if sunk
        if (guess === 'hit' && isEnemy) {
          for (const ship of enemyShips) {
            if (ship.sunk && ship.locations.includes(key)) { bg = 'bg-red-700/40'; content = '💥'; break }
          }
        }

        cells.push(
          <button key={key}
            onClick={()=>handleCellClick(r,c)}
            onMouseEnter={()=>onCellHover&&onCellHover(r,c)}
            className={`w-full aspect-square flex items-center justify-center text-xs sm:text-sm border ${bg} ${border} rounded-sm transition-all hover:brightness-125 active:scale-95 cursor-pointer`}
            disabled={phase==='win'||phase==='lose'}
          >
            {content}
          </button>
        )
      }
    }
    return cells
  }

  // Enemy board: during play, show guesses only; during setup, hide
  const renderEnemyBoard = () => {
    const cells = []
    for (let r=0;r<BOARD_SIZE;r++) {
      for (let c=0;c<BOARD_SIZE;c++) {
        const key = `${r}${c}`
        const guess = playerGuesses[key]
        let bg = 'bg-slate-800/50', border = 'border-slate-700/50', content = ''

        if (guess === 'hit') {
          // Check if sunk
          let sunk = false
          for (const ship of enemyShips) { if(ship.sunk&&ship.locations.includes(key)){sunk=true;break} }
          bg = sunk ? 'bg-red-700/40' : 'bg-red-500/30'
          border = 'border-red-500/50'
          content = sunk ? '💥' : '🔥'
        } else if (guess === 'miss') {
          bg = 'bg-slate-700/30'; border = 'border-slate-600/30'; content = '💧'
        }

        cells.push(
          <button key={key}
            onClick={()=>fireEnemy(r,c)}
            className={`w-full aspect-square flex items-center justify-center text-xs sm:text-sm border ${bg} ${border} rounded-sm transition-all hover:brightness-125 active:scale-95 cursor-pointer`}
            disabled={phase!=='play'||!!playerGuesses[key]||(phase==='win'||phase==='lose')}
          >
            {content}
          </button>
        )
      }
    }
    return cells
  }

  // Player board with placing preview
  const renderPlayerBoard = () => {
    const cells = []
    const hoverCells = phase==='setup' && placingHover ? getPlacingCells(placingHover[0], placingHover[1]) : []
    const canPlaceHere = hoverCells.length > 0 && canPlace(playerBoard, placingHover[0], placingHover[1], placingShip?.size||0, placingDir)

    for (let r=0;r<BOARD_SIZE;r++) {
      for (let c=0;c<BOARD_SIZE;c++) {
        const key = `${r}${c}`
        const shipHere = playerBoard[key]==='ship'
        const eGuess = enemyGuesses[key]
        const isHover = hoverCells.includes(key)
        let bg = 'bg-slate-800/50', border = 'border-slate-700/50', content = ''

        if (eGuess === 'hit') {
          let sunk = false
          for (const ship of playerShips) { if(ship.sunk&&ship.locations.includes(key)){sunk=true;break} }
          bg = sunk ? 'bg-red-700/40' : 'bg-red-500/30'
          border = 'border-red-500/50'
          content = sunk ? '💥' : '🔥'
        } else if (eGuess === 'miss') {
          bg = 'bg-slate-700/30'; border = 'border-slate-600/30'; content = '💧'
        } else if (shipHere) {
          bg = 'bg-blue-500/20'; border = 'border-blue-500/30'
        }

        if (isHover && phase==='setup') {
          bg = canPlaceHere ? 'bg-green-500/30' : 'bg-red-500/30'
          border = canPlaceHere ? 'border-green-500/50' : 'border-red-500/50'
        }

        cells.push(
          <button key={key}
            onClick={()=>handleCellClick(r,c)}
            onMouseEnter={()=>setPlacingHover([r,c])}
            onMouseLeave={()=>setPlacingHover(null)}
            className={`w-full aspect-square flex items-center justify-center text-xs sm:text-sm border ${bg} ${border} rounded-sm transition-all hover:brightness-125 active:scale-95 cursor-pointer`}
            disabled={phase==='win'||phase==='lose'||phase==='play'}
          >
            {content}
          </button>
        )
      }
    }
    return cells
  }

  const enemyShipsSunk = enemyShips.filter(s=>s.sunk).length
  const playerShipsSunk = playerShips.filter(s=>s.sunk).length


  return (
    <GameShell
      name="BATTLESHIP"
      startAction={startGame} startLabel="▶ Start" 
      title="Battleship Online - Free Strategy Game"
      desc="Play the classic Battleship game against the AI. Place your fleet, find and sink all enemy ships before time runs out!"
      icon="🚢" iconBg="rgba(245,158,11,0.08)"
      category="fun" slug="games-battleship"
      faq={[
        { q:"How do I play Battleship?", a:"First place your 5 ships on your grid. Then take turns firing at the enemy grid. Hit all their ships to win!" },
        { q:"How does the AI work?", a:"The AI uses hunt-target mode: it fires randomly until it gets a hit, then targets adjacent cells to sink the ship." },
        { q:"What is the time limit?", a:"You have 2 minutes to sink all 5 enemy ships. Score is based on ships sunk and remaining time." },
      ]}
      howItWorks={[
        "Press Start to begin. Place your 5 ships by clicking on your grid.",
        "Press R to rotate the current ship before placing.",
        "After placing all ships, the battle begins! Click the enemy grid to fire.",
        "Hit = 🔥 | Miss = 💧 | Sunk = 💥. Sink all 5 to win!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Battleship", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/battleship/",
        "genre": "Strategy",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="flex gap-4 max-w-6xl mx-auto overflow-hidden">
        <div className="flex-1 min-w-0 max-w-2xl mx-auto space-y-4 overflow-hidden">
          {/* Stats */}
          <div className="glass p-4">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-lg font-extrabold text-white">{phase==='play'?formatTime(timer):'--:--'}</div>
                <div className="text-xs text-slate-400">Time</div>
              </div>
              <div>
                <div className="text-lg font-extrabold text-green-400">{enemyShipsSunk}/{TOTAL_SHIPS}</div>
                <div className="text-xs text-slate-400">Sunk</div>
              </div>
              <div>
                <div className="text-lg font-extrabold text-red-400">{playerShipsSunk}/{TOTAL_SHIPS}</div>
                <div className="text-xs text-slate-400">Lost</div>
              </div>
              <div>
                <div className="text-lg font-extrabold text-amber-400">{score}</div>
                <div className="text-xs text-slate-400">Score</div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="glass p-3 text-center">
            <p className="text-sm font-medium text-slate-300">{message}</p>
          </div>

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            <button onClick={()=>startGame} className="glow-btn px-6 py-3 text-sm">
              {(phase==='win'||phase==='lose') ? '⟲ New Game' : phase==='setup' && playerShips.length===0 ? '▶ Start' : '⟲ Restart'}
            </button>
          </div>

          {/* Boards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Player Board */}
            <div>
              <div className="text-xs font-bold text-slate-400 mb-2 text-center">
                🛡️ Your Fleet {phase==='setup'&&placingShip&&`(Placing: ${placingShip.name})`}
              </div>
              <div className="glass p-2">
                <div className="grid grid-cols-7 gap-px">
                  {renderPlayerBoard()}
                </div>
                <div className="flex justify-between mt-1 px-1">
                  {ROW_LABELS.map(l=><span key={l} className="text-[9px] text-slate-600 w-full text-center">{l}</span>)}
                </div>
              </div>
            </div>

            {/* Enemy Board */}
            <div>
              <div className="text-xs font-bold text-slate-400 mb-2 text-center">
                🎯 Enemy Waters {phase==='play'&&`(Your Turn)`}
              </div>
              <div className="glass p-2">
                <div className="grid grid-cols-7 gap-px">
                  {renderEnemyBoard()}
                </div>
                <div className="flex justify-between mt-1 px-1">
                  {ROW_LABELS.map(l=><span key={l} className="text-[9px] text-slate-600 w-full text-center">{l}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Ship status */}
          <div className="glass p-3">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-bold text-slate-400 mb-1">Your Ships</div>
                {playerShips.map(s=>(
                  <div key={s.name} className={`flex justify-between ${s.sunk?'text-red-400 line-through':'text-slate-300'}`}>
                    <span>{s.name}</span>
                    <span>{s.size} cells</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="font-bold text-slate-400 mb-1">Enemy Ships</div>
                {enemyShips.map(s=>(
                  <div key={s.name} className={`flex justify-between ${s.sunk?'text-green-400 line-through':'text-slate-300'}`}>
                    <span>{s.name}</span>
                    <span>{s.size} cells</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400">
            Desktop: Click to fire | Mobile: Tap to place/fire | R = rotate ship
          </p>
        </div>
      </div>
    </GameShell>
  )
}
