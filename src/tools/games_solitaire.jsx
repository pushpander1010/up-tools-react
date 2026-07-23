import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LS = { WINS: 'ut_sol_wins', BEST: 'ut_sol_best', GAMES: 'ut_sol_games' }

function safeGetItem(key, fallback) { try { return localStorage.getItem(key) ?? fallback } catch { return fallback } }
function safeSetItem(key, val) { try { localStorage.setItem(key, val) } catch {} }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.08) {
  try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {}
}
function playDeal() { playTone(300,0.04,'triangle',0.04) }
function playPlace() { playTone(500,0.06,'sine',0.05) }
function playFlip() { playTone(400,0.05,'sine',0.04) }
function playWin() { playTone(523,0.1,'sine',0.08); setTimeout(()=>playTone(659,0.1,'sine',0.08),80); setTimeout(()=>playTone(784,0.1,'sine',0.08),160); setTimeout(()=>playTone(1047,0.25,'sine',0.1),240) }
function playSelect() { playTone(440,0.06,'sine',0.05) }
function playUndo() { playTone(350,0.08,'triangle',0.04) }

const SUITS = ['♠', '♥', '♣', '♦']
const SUIT_COLORS = { '♠': '#fff', '♥': '#ef4444', '♣': '#fff', '♦': '#ef4444' }
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const RANK_VALUES = { A:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, 10:10, J:11, Q:12, K:13 }

function createDeck() {
  const deck = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, value: RANK_VALUES[rank], faceUp: false, id: `${rank}${suit}` })
    }
  }
  return shuffle(deck)
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function dealCards() {
  const deck = createDeck()
  const tableau = [[], [], [], [], [], [], []]
  let idx = 0
  for (let col = 0; col < 7; col++) {
    for (let row = col; row < 7; row++) {
      const card = { ...deck[idx], faceUp: row === col }
      tableau[row].push(card)
      idx++
    }
  }
  const stock = deck.slice(idx).map(c => ({ ...c, faceUp: false }))
  return { tableau, stock, waste: [], foundation: [[], [], [], []] }
}

function canPlaceOnFoundation(card, foundationPile) {
  if (foundationPile.length === 0) return card.value === 1
  const top = foundationPile[foundationPile.length - 1]
  return card.suit === top.suit && card.value === top.value + 1
}

function canPlaceOnTableau(card, tableauPile) {
  if (tableauPile.length === 0) return card.value === 13
  const top = tableauPile[tableauPile.length - 1]
  if (!top.faceUp) return false
  return top.color !== card.color && top.value === card.value + 1
}

export default function games_solitaire() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [gameState, setGameState] = useState(null)
  const [moves, setMoves] = useState(0)
  const [timer, setTimer] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [won, setWon] = useState(false)
  const [wins, setWins] = useState(() => Number(localStorage.getItem(LS.WINS) || 0))
  const [bestMoves, setBestMoves] = useState(() => Number(localStorage.getItem(LS.BEST) || Infinity))
  const [gamesPlayed, setGamesPlayed] = useState(() => Number(localStorage.getItem(LS.GAMES) || 0))
  const [undoStack, setUndoStack] = useState([])
  const [drawThree, setDrawThree] = useState(false)
  const [dragging, setDragging] = useState(null) // { source, cardIndex, cards, offsetX, offsetY }
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [autoComplete, setAutoComplete] = useState(false)
  const timerRef = useRef(null)
  const boardRef = useRef(null)
  const winsRef = useRef(0)
  const bestMovesRef = useRef(Infinity)

  useEffect(() => { winsRef.current = wins }, [wins])
  useEffect(() => { bestMovesRef.current = bestMoves }, [bestMoves])

  const saveState = useCallback((state) => {
    setGameState(state)
  }, [])

  const startNewGame = useCallback(() => {
    playSelect()
    const state = dealCards()
    saveState(state)
    setMoves(0)
    setTimer(0)
    setPlaying(true)
    setWon(false)
    setUndoStack([])
    setAutoComplete(false)
    setGamesPlayed(prev => {
      const n = prev + 1
      try { localStorage.setItem(LS.GAMES, String(n)) } catch {}
      return n
    })
  }, [saveState])

  const toggleDrawMode = useCallback(() => {
    playSelect()
    setDrawThree(prev => !prev)
  }, [])

  // Timer
  useEffect(() => {
    if (playing && !won) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [playing, won])

  const pushUndo = useCallback((state) => {
    setUndoStack(prev => [...prev.slice(-9), JSON.parse(JSON.stringify(state))])
  }, [])

  const undo = useCallback(() => {
    if (undoStack.length === 0) return
    playUndo()
    const prev = undoStack[undoStack.length - 1]
    setUndoStack(s => s.slice(0, -1))
    saveState(prev)
  }, [undoStack, saveState])

  const drawCard = useCallback(() => {
    if (!gameState) return
    playDeal()
    const state = JSON.parse(JSON.stringify(gameState))
    pushUndo(state)

    if (state.stock.length === 0) {
      // Recycle waste to stock
      state.stock = state.waste.reverse().map(c => ({ ...c, faceUp: false }))
      state.waste = []
    } else {
      const count = drawThree ? 3 : 1
      for (let i = 0; i < count && state.stock.length > 0; i++) {
        const card = state.stock.pop()
        card.faceUp = true
        state.waste.push(card)
      }
    }
    saveState(state)
  }, [gameState, drawThree, pushUndo, saveState])

  const moveCard = useCallback((fromType, fromIdx, cardIdx, toType, toIdx) => {
    if (!gameState) return false
    const state = JSON.parse(JSON.stringify(gameState))
    pushUndo(state)

    let cards = []
    let moved = false

    if (fromType === 'waste') {
      if (state.waste.length === 0) return false
      cards = [state.waste.pop()]
    } else if (fromType === 'tableau') {
      const pile = state.tableau[fromIdx]
      if (cardIdx >= pile.length || !pile[cardIdx].faceUp) return false
      cards = pile.splice(cardIdx)
    } else if (fromType === 'foundation') {
      if (state.foundation[fromIdx].length === 0) return false
      cards = [state.foundation[fromIdx].pop()]
    }

    if (toType === 'foundation') {
      if (cards.length !== 1) return false
      if (!canPlaceOnFoundation(cards[0], state.foundation[toIdx])) return false
      state.foundation[toIdx].push(cards[0])
      moved = true
    } else if (toType === 'tableau') {
      if (!canPlaceOnTableau(cards[0], state.tableau[toIdx])) return false
      state.tableau[toIdx].push(...cards)
      moved = true
    }

    if (moved) {
      // Flip top card of source tableau
      if (fromType === 'tableau') {
        const pile = state.tableau[fromIdx]
        if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
          pile[pile.length - 1].faceUp = true
          playFlip()
        }
      }
      playPlace()
      setMoves(m => m + 1)
      saveState(state)

      // Check win
      const totalFoundation = state.foundation.reduce((sum, f) => sum + f.length, 0)
      if (totalFoundation === 52) {
        playWin()
        setWon(true)
        setPlaying(false)
        setMoves(m => {
          const newWins = winsRef.current + 1
          const newBest = Math.min(bestMovesRef.current, m + 1)
          setWins(newWins)
          setBestMoves(newBest)
          try {
            localStorage.setItem(LS.WINS, String(newWins))
            localStorage.setItem(LS.BEST, String(newBest))
          } catch {}
          return m + 1
        })
      }
    } else {
      // Restore state on failed move
      saveState(JSON.parse(JSON.stringify(state)))
    }

    return moved
  }, [gameState, pushUndo, saveState])

  const handleDoubleClick = useCallback((fromType, fromIdx, cardIdx) => {
    if (!gameState) return
    // Auto-move to foundation
    let card
    if (fromType === 'waste') {
      card = gameState.waste[gameState.waste.length - 1]
    } else if (fromType === 'tableau') {
      card = gameState.tableau[fromIdx][cardIdx]
    }
    if (!card || !card.faceUp) return

    // Try each foundation
    for (let fi = 0; fi < 4; fi++) {
      if (canPlaceOnFoundation(card, gameState.foundation[fi])) {
        moveCard(fromType, fromIdx, cardIdx, 'foundation', fi)
        return
      }
    }
  }, [gameState, moveCard])

  // Auto-complete: when all cards face up, auto-move to foundations
  useEffect(() => {
    if (!gameState || won || !autoComplete) return
    const allFaceUp = gameState.tableau.every(pile => pile.every(c => c.faceUp)) && gameState.stock.length === 0 && gameState.waste.length === 0
    if (!allFaceUp) return

    const tryAutoMove = () => {
      const state = JSON.parse(JSON.stringify(gameState))
      let moved = false

      // Try waste
      if (state.waste.length > 0) {
        const card = state.waste[state.waste.length - 1]
        for (let fi = 0; fi < 4; fi++) {
          if (canPlaceOnFoundation(card, state.foundation[fi])) {
            state.foundation[fi].push(state.waste.pop())
            moved = true
            break
          }
        }
      }

      // Try tableau tops
      for (let ti = 0; ti < 7; ti++) {
        const pile = state.tableau[ti]
        if (pile.length === 0) continue
        const card = pile[pile.length - 1]
        if (!card.faceUp) continue
        for (let fi = 0; fi < 4; fi++) {
          if (canPlaceOnFoundation(card, state.foundation[fi])) {
            state.foundation[fi].push(pile.pop())
            moved = true
            break
          }
        }
      }

      if (moved) {
        saveState(state)
        setMoves(m => m + 1)
        playPlace()
        setTimeout(tryAutoMove, 150)
      } else {
        // Check win
        const totalFoundation = state.foundation.reduce((sum, f) => sum + f.length, 0)
        if (totalFoundation === 52) {
          playWin()
          setWon(true)
          setPlaying(false)
          setMoves(m => {
            const newWins = wins + 1
            setWins(newWins)
            try { localStorage.setItem(LS.WINS, String(newWins)) } catch {}
            return m
          })
        }
      }
    }
    tryAutoMove()
  }, [gameState, autoComplete, won, saveState, wins])

  // Check if auto-complete is possible
  useEffect(() => {
    if (!gameState || won) return
    const allFaceUp = gameState.tableau.every(pile => pile.every(c => c.faceUp)) && gameState.stock.length === 0
    if (allFaceUp && !autoComplete) {
      setAutoComplete(true)
    }
  }, [gameState, won, autoComplete])

  const formatTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`

  // Drag handling
  const handleDragStart = useCallback((e, source, fromIdx, cardIdx) => {
    e.preventDefault()
    const state = gameState
    if (!state) return

    let cards = []
    if (source === 'waste') {
      cards = state.waste.length > 0 ? [state.waste[state.waste.length - 1]] : []
    } else if (source === 'tableau') {
      const pile = state.tableau[fromIdx]
      if (cardIdx < pile.length && pile[cardIdx].faceUp) {
        cards = pile.slice(cardIdx)
      }
    }
    if (cards.length === 0) return

    playSelect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    setDragging({ source, fromIdx, cardIdx, cards })
    setDragPos({ x: clientX, y: clientY })
  }, [gameState])

  const handleDragMove = useCallback((e) => {
    if (!dragging) return
    e.preventDefault()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    setDragPos({ x: clientX, y: clientY })
  }, [dragging])

  const handleDragEnd = useCallback((e) => {
    if (!dragging) return
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY

    // Determine drop target
    const board = boardRef.current
    if (!board) { setDragging(null); return }
    const rect = board.getBoundingClientRect()

    // Check foundations
    const foundEls = board.querySelectorAll('[data-foundation]')
    for (const el of foundEls) {
      const r = el.getBoundingClientRect()
      if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) {
        const fi = parseInt(el.dataset.foundation)
        moveCard(dragging.source, dragging.fromIdx, dragging.cardIdx, 'foundation', fi)
        setDragging(null)
        return
      }
    }

    // Check tableau
    const tabEls = board.querySelectorAll('[data-tableau]')
    for (const el of tabEls) {
      const r = el.getBoundingClientRect()
      if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) {
        const ti = parseInt(el.dataset.tableau)
        moveCard(dragging.source, dragging.fromIdx, dragging.cardIdx, 'tableau', ti)
        setDragging(null)
        return
      }
    }

    setDragging(null)
  }, [dragging, moveCard])

  useEffect(() => {
    if (!dragging) return
    window.addEventListener('mousemove', handleDragMove)
    window.addEventListener('mouseup', handleDragEnd)
    window.addEventListener('touchmove', handleDragMove, { passive: false })
    window.addEventListener('touchend', handleDragEnd)
    return () => {
      window.removeEventListener('mousemove', handleDragMove)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchmove', handleDragMove)
      window.removeEventListener('touchend', handleDragEnd)
    }
  }, [dragging, handleDragMove, handleDragEnd])

  if (!gameState) {
    return (
      <ToolLayout
        title="Solitaire Online - Classic Klondike Card Game"
        desc="Play classic Klondike Solitaire in your browser. Drag and drop cards, undo moves, auto-complete, and track your stats."
        icon="🃏" iconBg="rgba(34,197,94,0.08)"
        category="fun" slug="games-solitaire"
        faq={[
          { q: "How do I play Solitaire?", a: "Move cards between tableau columns, alternating colors in descending order. Build up foundation piles by suit from Ace to King." },
          { q: "What is auto-complete?", a: "When all cards in the tableau are face-up and no stock remains, cards automatically move to foundations to speed up the end game." },
          { q: "Can I undo moves?", a: "Yes! You can undo the last 10 moves using the undo button." },
        ]}
        howItWorks={[
          "Click the stock pile to draw cards (1 or 3 at a time).",
          "Drag cards between tableau columns — alternate colors, descending order.",
          "Double-click or drag to foundation piles — build by suit from Ace to King.",
          "Flip face-down cards when their covering card is moved.",
          "Get all 52 cards to the foundations to win!",
        ]}
        schema={{
          "@context": "https://schema.org", "@type": "VideoGame",
          "name": "Solitaire Online", "applicationCategory": "Game",
          "url": "https://www.uptools.in/games/solitaire/",
          "genre": "Card", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        }}
      >
        <div className="max-w-xl mx-auto space-y-5">
          <div className="text-center p-8 glass rounded-2xl">
            <div className="text-5xl mb-4">🃏</div>
            <h2 className="text-xl font-bold text-white mb-2">Klondike Solitaire</h2>
            <p className="text-sm text-slate-400 mb-6">The classic card game. Build foundations from Ace to King!</p>
            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              <div className="p-3 rounded-xl glass">
                <div className="text-2xl font-extrabold text-white">{wins}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Wins</div>
              </div>
              <div className="p-3 rounded-xl glass">
                <div className="text-2xl font-extrabold text-white">{bestMoves === Infinity ? '—' : bestMoves}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Best Moves</div>
              </div>
              <div className="p-3 rounded-xl glass">
                <div className="text-2xl font-extrabold text-white">{gamesPlayed}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Played</div>
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={startNewGame}
                className="glow-btn px-6 py-3 text-sm">
                Deal Cards
              </button>
              <button onClick={toggleDrawMode}
                className="px-4 py-3 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">
                Draw {drawThree ? 3 : 1}
              </button>
            </div>
          </div>
        </div>
      </ToolLayout>
    )
  }

  const Card = ({ card, style, onMouseDown, onTouchStart, onDoubleClick, faceUp = true }) => {
    if (!faceUp || !card) return (
      <div className="absolute rounded-lg border-2 border-indigo-900/50 bg-indigo-950/80 flex items-center justify-center"
        style={{...style, width: 56, height: 78}}>
        <span className="text-indigo-600/40 text-lg">✦</span>
      </div>
    )
    const isRed = card.suit === '♥' || card.suit === '♦'
    return (
      <div
        className={`absolute rounded-lg border cursor-grab active:cursor-grabbing transition-shadow ${isRed ? 'bg-white border-red-200' : 'bg-white border-gray-200'}`}
        style={{...style, width: 56, height: 78, userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'none'}}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onDoubleClick={onDoubleClick}
      >
        <div className="absolute top-1 left-1.5 text-xs font-bold leading-none" style={{color: isRed ? '#ef4444' : '#1e293b'}}>
          {card.rank}
          <div className="text-sm leading-none">{card.suit}</div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl" style={{color: isRed ? '#ef4444' : '#1e293b'}}>
          {card.suit}
        </div>
        <div className="absolute bottom-1 right-1.5 text-xs font-bold rotate-180 leading-none" style={{color: isRed ? '#ef4444' : '#1e293b'}}>
          {card.rank}
          <div className="text-sm leading-none">{card.suit}</div>
        </div>
      </div>
    )
  }

  const EmptyPile = ({ type, idx, children, ...props }) => (
    <div
      className="relative rounded-lg border-2 border-dashed border-white/[0.12] bg-white/[0.02]"
      style={{ width: 56, height: 78 }}
      data-foundation={type === 'foundation' ? idx : undefined}
      data-tableau={type === 'tableau' ? idx : undefined}
      {...props}
    >
      {type === 'foundation' && <div className="absolute inset-0 flex items-center justify-center text-2xl text-white/[0.15]">♠♥♣♦</div>}
      {children}
    </div>
  )

  const renderPile = (pile, startX, startY, gapY, source, fromIdx, draggable = true) => {
    return pile.map((card, i) => {
      const isDragging = dragging?.source === source && dragging?.fromIdx === fromIdx && i >= dragging.cardIdx
      if (isDragging) return null
      return (
        <Card
          key={card.id}
          card={card}
          faceUp={card.faceUp}
          style={{ left: startX, top: startY + i * gapY, zIndex: i, position: 'absolute' }}
          onMouseDown={card.faceUp && draggable ? (e) => handleDragStart(e, source, fromIdx, i) : undefined}
          onTouchStart={card.faceUp && draggable ? (e) => handleDragStart(e, source, fromIdx, i) : undefined}
          onDoubleClick={card.faceUp ? () => handleDoubleClick(source, fromIdx, i) : undefined}
        />
      )
    })
  }

  return (
    <ToolLayout
      title="Solitaire Online - Classic Klondike Card Game"
      desc="Play classic Klondike Solitaire in your browser. Drag and drop cards, undo moves, auto-complete, and track your stats."
      icon="🃏" iconBg="rgba(34,197,94,0.08)"
      category="fun" slug="games-solitaire"
      faq={[
        { q: "How do I play Solitaire?", a: "Move cards between tableau columns, alternating colors in descending order. Build up foundation piles by suit from Ace to King." },
        { q: "What is auto-complete?", a: "When all cards in the tableau are face-up and no stock remains, cards automatically move to foundations to speed up the end game." },
        { q: "Can I undo moves?", a: "Yes! You can undo the last 10 moves using the undo button." },
      ]}
      howItWorks={[
        "Click the stock pile to draw cards (1 or 3 at a time).",
        "Drag cards between tableau columns — alternate colors, descending order.",
        "Double-click or drag to foundation piles — build by suit from Ace to King.",
        "Flip face-down cards when their covering card is moved.",
        "Get all 52 cards to the foundations to win!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Solitaire Online", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/solitaire/",
        "genre": "Card", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-xl mx-auto space-y-5">
        {/* Controls */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-2">
            <button onClick={startNewGame}
              className="glow-btn px-3 py-2 text-xs">
              New Game
            </button>
            <button onClick={undo} disabled={undoStack.length === 0}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all disabled:opacity-30">
              ↩ Undo
            </button>
            <button onClick={toggleDrawMode}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">
              Draw {drawThree ? '3' : '1'}
            </button>
          </div>
          <div className="flex gap-3 text-xs text-slate-400">
            <span>⏱ {formatTime(timer)}</span>
            <span>👆 {moves} moves</span>
          </div>
        </div>

        {/* Game Board */}
        <div ref={resultRef} className="relative overflow-x-auto" style={{minHeight: 500}}>
          <div ref={boardRef} className="relative" style={{width: 'min(420px, 100%)', minHeight: 500, margin: '0 auto'}}>
            {/* Top row: Stock, Waste, Foundation */}
            <div className="absolute" style={{top: 0, left: 0}}>
              {/* Stock */}
              <div className="relative" style={{width: 56, height: 78, cursor: 'pointer'}}
                onClick={drawCard}>
                {gameState.stock.length > 0 ? (
                  <div className="absolute inset-0 rounded-lg border-2 border-indigo-900/50 bg-indigo-950/80 flex items-center justify-center">
                    <span className="text-indigo-600/40 text-lg">✦</span>
                  </div>
                ) : (
                  <EmptyPile type="stock"/>
                )}
                <div className="absolute -bottom-4 left-0 right-0 text-center text-xs text-slate-500">{gameState.stock.length}</div>
              </div>
            </div>

            {/* Waste */}
            <div className="absolute" style={{top: 0, left: 70}}>
              {gameState.waste.length > 0 ? (() => {
                const topCard = gameState.waste[gameState.waste.length - 1]
                const isDragging = dragging?.source === 'waste'
                if (isDragging) return <EmptyPile type="waste"/>
                return (
                  <Card card={topCard} faceUp
                    style={{position: 'absolute', left: 0, top: 0, zIndex: 1}}
                    onMouseDown={(e) => handleDragStart(e, 'waste', 0, gameState.waste.length - 1)}
                    onTouchStart={(e) => handleDragStart(e, 'waste', 0, gameState.waste.length - 1)}
                    onDoubleClick={() => handleDoubleClick('waste', 0, gameState.waste.length - 1)}
                  />
                )
              })() : <EmptyPile type="waste"/>}
            </div>

            {/* Foundations */}
            {[0,1,2,3].map(fi => (
              <div key={fi} className="absolute" style={{top: 0, left: 140 + fi * 70}}>
                {gameState.foundation[fi].length > 0 ? (() => {
                  const topCard = gameState.foundation[fi][gameState.foundation[fi].length - 1]
                  return (
                    <Card card={topCard} faceUp
                      style={{position: 'absolute', left: 0, top: 0, zIndex: 1}}
                      onMouseDown={(e) => handleDragStart(e, 'foundation', fi, gameState.foundation[fi].length - 1)}
                      onTouchStart={(e) => handleDragStart(e, 'foundation', fi, gameState.foundation[fi].length - 1)}
                    />
                  )
                })() : (
                  <EmptyPile type="foundation" idx={fi}/>
                )}
              </div>
            ))}

            {/* Tableau */}
            {[0,1,2,3,4,5,6].map(ti => {
              const pile = gameState.tableau[ti]
              const startX = ti * 60 + 5
              return (
                <div key={ti} className="absolute" style={{top: 95, left: startX, width: 56}}>
                  <div data-tableau={ti} className="relative" style={{minHeight: 78}}>
                    {pile.length === 0 && <EmptyPile type="tableau" idx={ti}/>}
                    {pile.map((card, i) => {
                      const isDragging = dragging?.source === 'tableau' && dragging?.fromIdx === ti && i >= dragging.cardIdx
                      if (isDragging) return null
                      return (
                        <Card
                          key={card.id}
                          card={card}
                          faceUp={card.faceUp}
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: card.faceUp ? i * 22 : i * 8,
                            zIndex: i,
                          }}
                          onMouseDown={card.faceUp ? (e) => handleDragStart(e, 'tableau', ti, i) : undefined}
                          onTouchStart={card.faceUp ? (e) => handleDragStart(e, 'tableau', ti, i) : undefined}
                          onDoubleClick={card.faceUp ? () => handleDoubleClick('tableau', ti, i) : undefined}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Win overlay */}
        {won && (
          <div className="text-center p-6 rounded-2xl bg-green-900/30 border border-green-500/20">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-xl font-bold text-white mb-2">You Win!</h2>
            <p className="text-sm text-slate-400 mb-3">Completed in {moves} moves · {formatTime(timer)}</p>
            <button onClick={startNewGame}
              className="glow-btn px-6 py-3 text-sm">
              Play Again
            </button>
          </div>
        )}

        <p className="text-center text-xs text-slate-500">Drag cards or double-click to auto-place. Stats saved on device.</p>

        {/* Dragging card overlay */}
        {dragging && (
          <div className="fixed inset-0 pointer-events-none z-50" style={{left: dragPos.x - 28, top: dragPos.y - 39}}>
            {dragging.cards.map((card, i) => (
              <Card key={card.id} card={card} faceUp style={{position: 'absolute', top: i * 22, left: 0, opacity: 0.9, boxShadow: '0 8px 25px rgba(0,0,0,0.5)'}}/>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
