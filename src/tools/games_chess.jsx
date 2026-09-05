import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const LS = { BEST: 'ut_chess_best_v1', LAST: 'ut_chess_last_v1' }

let audioCtx = null
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx }
function playTone(freq,dur,type='sine',vol=0.06) {
  try { const ctx=ensureAudio(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(vol,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur) } catch {}
}
function playMove() { playTone(440,0.06,'sine',0.05) }
function playCapture() { playTone(330,0.1,'sawtooth',0.05); setTimeout(()=>playTone(440,0.08,'sine',0.04),50) }
function playCheck() { playTone(880,0.15,'square',0.04) }

const PIECES = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
}

const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 }

// Piece-square tables for positional evaluation
const PST = {
  p: [
    [0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],
    [0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],
    [-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],
    [-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  b: [
    [-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,10,10,10,10,0,-10],
    [-10,5,5,10,10,5,5,-10],[-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],
    [-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  r: [
    [0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],
    [-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]
  ],
  q: [
    [-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],
    [-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],
    [-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]
  ],
  k: [
    [-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],
    [20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]
  ],
}

function initBoard() {
  const b = Array(8).fill(null).map(() => Array(8).fill(null))
  const back = ['r','n','b','q','k','b','n','r']
  for (let c = 0; c < 8; c++) {
    b[0][c] = back[c]  // black
    b[1][c] = 'p'
    b[6][c] = 'P'
    b[7][c] = back[c].toUpperCase()  // white
  }
  return b
}

function isWhite(piece) { return piece && piece === piece.toUpperCase() }
function isBlack(piece) { return piece && piece === piece.toLowerCase() }
function inBounds(r,c) { return r >= 0 && r < 8 && c >= 0 && c < 8 }

function findKing(board, white) {
  const king = white ? 'K' : 'k'
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    if (board[r][c] === king) return [r, c]
  }
  return null
}

function isSquareAttacked(board, r, c, byWhite) {
  // Check knight attacks
  const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
  for (const [dr, dc] of knightMoves) {
    const nr = r + dr, nc = c + dc
    if (inBounds(nr, nc) && board[nr][nc]) {
      const p = board[nr][nc]
      if (byWhite && p === 'N') return true
      if (!byWhite && p === 'n') return true
    }
  }

  // Check pawn attacks
  const pawnDir = byWhite ? 1 : -1
  const pawnPiece = byWhite ? 'P' : 'p'
  for (const dc of [-1, 1]) {
    const nr = r + pawnDir, nc = c + dc
    if (inBounds(nr, nc) && board[nr][nc] === pawnPiece) return true
  }

  // Check king attacks
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = r + dr, nc = c + dc
      if (inBounds(nr, nc) && board[nr][nc]) {
        const p = board[nr][nc]
        if (byWhite && p === 'K') return true
        if (!byWhite && p === 'k') return true
      }
    }
  }

  // Check sliding attacks (rook, queen, bishop)
  const directions = [
    [-1,0],[1,0],[0,-1],[0,1], // rook dirs
    [-1,-1],[-1,1],[1,-1],[1,1] // bishop dirs
  ]
  for (const [dr, dc] of directions) {
    let nr = r + dr, nc = c + dc
    while (inBounds(nr, nc)) {
      const p = board[nr][nc]
      if (p) {
        if (byWhite && (p === 'R' || p === 'Q' || (Math.abs(dr) === Math.abs(dc) && p === 'B'))) return true
        if (!byWhite && (p === 'r' || p === 'q' || (Math.abs(dr) === Math.abs(dc) && p === 'b'))) return true
        break
      }
      nr += dr; nc += dc
    }
  }

  return false
}

function isInCheck(board, white) {
  const king = findKing(board, white)
  if (!king) return false
  return isSquareAttacked(board, king[0], king[1], !white)
}

function cloneBoard(board) { return board.map(row => [...row]) }

function generateMoves(board, white, castling, enPassant) {
  const moves = []
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (!p) continue
      if (white && !isWhite(p)) continue
      if (!white && !isBlack(p)) continue

      const type = p.toLowerCase()

      if (type === 'p') {
        const dir = white ? -1 : 1
        const startRow = white ? 6 : 1
        const promoRow = white ? 0 : 7
        // Forward
        if (inBounds(r+dir, c) && !board[r+dir][c]) {
          if (r + dir === promoRow) {
            for (const promo of ['q','r','b','n']) moves.push({fr:r,fc:c,tr:r+dir,tc:c,promo:white?promo.toUpperCase():promo})
          } else {
            moves.push({fr:r,fc:c,tr:r+dir,tc:c})
          }
          // Double push
          if (r === startRow && !board[r+2*dir][c]) {
            moves.push({fr:r,fc:c,tr:r+2*dir,tc:c})
          }
        }
        // Captures
        for (const dc of [-1, 1]) {
          const nr = r + dir, nc = c + dc
          if (!inBounds(nr, nc)) continue
          if (board[nr][nc] && (white ? isBlack(board[nr][nc]) : isWhite(board[nr][nc]))) {
            if (nr === promoRow) {
              for (const promo of ['q','r','b','n']) moves.push({fr:r,fc:c,tr:nr,tc:nc,promo:white?promo.toUpperCase():promo})
            } else {
              moves.push({fr:r,fc:c,tr:nr,tc:nc})
            }
          }
          // En passant
          if (enPassant && enPassant[0] === nr && enPassant[1] === nc) {
            moves.push({fr:r,fc:c,tr:nr,tc:nc,enPassant:true})
          }
        }
      }

      if (type === 'n') {
        for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
          const nr = r+dr, nc = c+dc
          if (inBounds(nr, nc) && (!board[nr][nc] || (white ? isBlack(board[nr][nc]) : isWhite(board[nr][nc])))) {
            moves.push({fr:r,fc:c,tr:nr,tc:nc})
          }
        }
      }

      if (type === 'k') {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue
            const nr = r+dr, nc = c+dc
            if (inBounds(nr, nc) && (!board[nr][nc] || (white ? isBlack(board[nr][nc]) : isWhite(board[nr][nc])))) {
              moves.push({fr:r,fc:c,tr:nr,tc:nc})
            }
          }
        }
        // Castling
        const row = white ? 7 : 0
        if (r === row && c === 4) {
          const canCastle = white ? castling : castling
          if (canCastle?.kingSide && !board[row][5] && !board[row][6] && board[row][7]?.toLowerCase() === 'r' &&
              !isSquareAttacked(board, row, 4, !white) && !isSquareAttacked(board, row, 5, !white) && !isSquareAttacked(board, row, 6, !white)) {
            moves.push({fr:r,fc:4,tr:row,tc:6,castle:'king'})
          }
          if (canCastle?.queenSide && !board[row][3] && !board[row][2] && !board[row][1] && board[row][0]?.toLowerCase() === 'r' &&
              !isSquareAttacked(board, row, 4, !white) && !isSquareAttacked(board, row, 3, !white) && !isSquareAttacked(board, row, 2, !white)) {
            moves.push({fr:r,fc:4,tr:row,tc:2,castle:'queen'})
          }
        }
      }

      if (type === 'r' || type === 'q') {
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          let nr = r+dr, nc = c+dc
          while (inBounds(nr, nc)) {
            if (board[nr][nc]) {
              if (white ? isBlack(board[nr][nc]) : isWhite(board[nr][nc])) {
                moves.push({fr:r,fc:c,tr:nr,tc:nc})
              }
              break
            }
            moves.push({fr:r,fc:c,tr:nr,tc:nc})
            nr += dr; nc += dc
          }
        }
      }

      if (type === 'b' || type === 'q') {
        for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
          let nr = r+dr, nc = c+dc
          while (inBounds(nr, nc)) {
            if (board[nr][nc]) {
              if (white ? isBlack(board[nr][nc]) : isWhite(board[nr][nc])) {
                moves.push({fr:r,fc:c,tr:nr,tc:nc})
              }
              break
            }
            moves.push({fr:r,fc:c,tr:nr,tc:nc})
            nr += dr; nc += dc
          }
        }
      }
    }
  }
  return moves
}

function makeMove(board, move) {
  const nb = cloneBoard(board)
  const piece = nb[move.fr][move.fc]
  nb[move.fr][move.fc] = null

  if (move.promo) {
    nb[move.tr][move.tc] = move.promo
  } else {
    nb[move.tr][move.tc] = piece
  }

  // En passant capture
  if (move.enPassant) {
    nb[move.fr][move.tc] = null
  }

  // Castling rook move
  if (move.castle) {
    const row = move.fr
    if (move.castle === 'king') {
      nb[row][5] = nb[row][7]
      nb[row][7] = null
    } else {
      nb[row][3] = nb[row][0]
      nb[row][0] = null
    }
  }

  return nb
}

function filterLegalMoves(board, moves, white, castling) {
  return moves.filter(m => {
    const nb = makeMove(board, m)
    return !isInCheck(nb, white)
  })
}

function evaluateBoard(board, white) {
  let score = 0
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (!p) continue
      const type = p.toLowerCase()
      const val = PIECE_VALUES[type] || 0
      const pst = PST[type]
      const pstVal = pst ? (white ? pst[r][c] : pst[7-r][c]) : 0
      if (isWhite(p)) {
        score += val + pstVal
      } else {
        score -= val + pstVal
      }
    }
  }
  return white ? score : -score
}

function minimax(board, depth, alpha, beta, isMax, white, castling, enPassant) {
  if (depth === 0) {
    return { score: evaluateBoard(board, white) }
  }

  const moves = generateMoves(board, isMax, castling, enPassant)
  const legal = filterLegalMoves(board, moves, isMax, castling)

  if (legal.length === 0) {
    if (isInCheck(board, isMax)) {
      return { score: isMax ? -99999 + (3 - depth) : 99999 - (3 - depth) }
    }
    return { score: 0 } // stalemate
  }

  // Move ordering: captures first
  legal.sort((a, b) => {
    const capA = board[a.tr][a.tc] ? PIECE_VALUES[board[a.tr][a.tc]?.toLowerCase()] || 0 : 0
    const capB = board[b.tr][b.tc] ? PIECE_VALUES[board[b.tr][b.tc]?.toLowerCase()] || 0 : 0
    return capB - capA
  })

  let bestMove = legal[0]

  if (isMax) {
    let maxEval = -Infinity
    for (const m of legal) {
      const nb = makeMove(board, m)
      const result = minimax(nb, depth - 1, alpha, beta, false, white, castling, null)
      if (result.score > maxEval) {
        maxEval = result.score
        bestMove = m
      }
      alpha = Math.max(alpha, maxEval)
      if (beta <= alpha) break
    }
    return { score: maxEval, move: bestMove }
  } else {
    let minEval = Infinity
    for (const m of legal) {
      const nb = makeMove(board, m)
      const result = minimax(nb, depth - 1, alpha, beta, true, white, castling, null)
      if (result.score < minEval) {
        minEval = result.score
        bestMove = m
      }
      beta = Math.min(beta, minEval)
      if (beta <= alpha) break
    }
    return { score: minEval, move: bestMove }
  }
}

function getAIMove(board, castling, depth) {
  const result = minimax(board, depth, -Infinity, Infinity, false, false, castling, null)
  return result.move
}

export default function games_chess() {
  const canvasRef = useRef(null)
  const [board, setBoard] = useState(() => initBoard())
  const [selected, setSelected] = useState(null)
  const [legalMoves, setLegalMoves] = useState([])
  const [whiteTurn, setWhiteTurn] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [result, setResult] = useState('')
  const [captured, setCaptured] = useState({ white: [], black: [] })
  const [moveHistory, setMoveHistory] = useState([])
  const [castling, setCastling] = useState({ kingSide: true, queenSide: true })
  const [difficulty, setDifficulty] = useState('medium')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(()=>{try{return Number(localStorage.getItem(LS.BEST)||0)}catch{return 0}})
  const [lastScore, setLastScore] = useState(()=>{try{return Number(localStorage.getItem(LS.LAST)||0)}catch{return 0}})
  const [thinking, setThinking] = useState(false)


  const gRef = useRef({
    W: 400, H: 400, dpr: 1,
    board: initBoard(),
    selected: null,
    legalMoves: [],
    highlights: [],
    whiteTurn: true,
    castling: { kingSide: true, queenSide: true },
  })

  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const wrap = canvas.parentElement
    if (!wrap) return
    const sz = Math.min(400, wrap.clientWidth - 16)
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1))
    gRef.current.W = sz; gRef.current.H = sz; gRef.current.dpr = dpr
    canvas.width = Math.floor(sz*dpr); canvas.height = Math.floor(sz*dpr)
    canvas.style.width = sz+'px'; canvas.style.height = sz+'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr,0,0,dpr,0,0)
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = gRef.current
    const ctx = canvas.getContext('2d')
    const W = s.W, H = s.H
    const cellW = W / 8

    // Board background
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, W, H)

    // Draw squares
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const isLight = (r + c) % 2 === 0
        const isSelected = s.selected && s.selected[0] === r && s.selected[1] === c
        const isLegal = s.legalMoves.some(m => m.tr === r && m.tc === c)
        const isCapture = isLegal && s.board[r][c]
        const isCheck = s.board[r][c]?.toLowerCase() === 'k' && isInCheck(s.board, s.board[r][c] === 'K')

        let color
        if (isSelected) color = '#fbbf24'
        else if (isCheck) color = '#ef4444'
        else if (isLight) '#e8d5b7'
        else color = '#b58863'

        if (isSelected) color = '#fbbf24'
        else if (isCheck) color = '#ef4444'
        else color = isLight ? '#e8d5b7' : '#b58863'

        ctx.fillStyle = color
        ctx.fillRect(c * cellW, r * cellW, cellW, cellW)

        // Legal move dots
        if (isLegal && !isCapture) {
          ctx.fillStyle = 'rgba(0,0,0,0.2)'
          ctx.beginPath()
          ctx.arc(c * cellW + cellW/2, r * cellW + cellW/2, cellW * 0.15, 0, Math.PI * 2)
          ctx.fill()
        }
        if (isCapture) {
          ctx.strokeStyle = 'rgba(239,68,68,0.6)'
          ctx.lineWidth = 3
          ctx.strokeRect(c * cellW + 2, r * cellW + 2, cellW - 4, cellW - 4)
        }

        // Draw piece
        const piece = s.board[r][c]
        if (piece) {
          ctx.font = `${cellW * 0.75}px serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = isWhite(piece) ? '#fff' : '#1a1a2e'
          ctx.fillText(PIECES[piece], c * cellW + cellW/2, r * cellW + cellW/2 + 2)
          // Outline for contrast
          ctx.strokeStyle = isWhite(piece) ? '#333' : '#fff'
          ctx.lineWidth = 0.5
          ctx.strokeText(PIECES[piece], c * cellW + cellW/2, r * cellW + cellW/2 + 2)
        }
      }
    }

    // Coordinates
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = `${cellW * 0.18}px system-ui`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    for (let c = 0; c < 8; c++) {
      ctx.fillText('abcdefgh'[c], c * cellW + cellW/2, 2)
    }
    ctx.textBaseline = 'bottom'
    for (let r = 0; r < 8; r++) {
      ctx.fillText(String(8 - r), 2, r * cellW + cellW - 2)
    }

    // Thinking indicator
    if (thinking) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 20px system-ui'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('🤔 AI thinking...', W/2, H/2)
    }
  }, [thinking])

  const handleSquareClick = useCallback((row, col) => {
    if (gameOver || thinking || !whiteTurn) return
    const b = gRef.current.board
    const piece = b[row][col]

    // If clicking a legal move destination
    if (selected && legalMoves.some(m => m.tr === row && m.tc === col)) {
      const move = legalMoves.find(m => m.tr === row && m.tc === col)
      const nb = makeMove(b, move)
      const capturedPiece = b[row][col]

      // Update castling rights
      const newCastling = { ...castling }
      if (move.fr === 7 && move.fc === 4) { newCastling.kingSide = false; newCastling.queenSide = false }
      if (move.fr === 7 && move.fc === 7) newCastling.kingSide = false
      if (move.fr === 7 && move.fc === 0) newCastling.queenSide = false

      // Track captures
      if (capturedPiece) {
        setCaptured(prev => ({ ...prev, black: [...prev.black, capturedPiece] }))
      }

      gRef.current.board = nb
      gRef.current.selected = null
      gRef.current.legalMoves = []
      gRef.current.castling = newCastling
      setBoard(nb)
      setSelected(null)
      setLegalMoves([])
      setCastling(newCastling)
      setWhiteTurn(false)
      setMoveHistory(prev => [...prev, { move, board: nb }])

      if (capturedPiece) playCapture(); else playMove()

      // Check for checkmate/stalemate after player move
      const aiMoves = generateMoves(nb, false, newCastling, null)
      const aiLegal = filterLegalMoves(nb, aiMoves, false, newCastling)
      if (aiLegal.length === 0) {
        if (isInCheck(nb, false)) {
          setGameOver(true)
          setResult('White wins by checkmate!')
          const newScore = score + 100
          setScore(newScore)
          const newBest = Math.max(best, newScore)
          setBest(newBest)
          setLastScore(newScore)
          try { localStorage.setItem(LS.BEST, String(newBest)); localStorage.setItem(LS.LAST, String(newScore)) } catch {}
          playCheck()
        } else {
          setGameOver(true)
          setResult('Stalemate - Draw!')
        }
        return
      }

      // AI move
      setThinking(true)
      setTimeout(() => {
        const aiMove = getAIMove(nb, newCastling, {easy:1, medium:2, hard:3}[difficulty] || 2)
        if (aiMove) {
          const nb2 = makeMove(nb, aiMove)
          const capturedByAI = nb[aiMove.tr][aiMove.tc]
          if (capturedByAI) {
            setCaptured(prev => ({ ...prev, white: [...prev.white, capturedByAI] }))
          }

          gRef.current.board = nb2
          gRef.current.whiteTurn = true
          setBoard(nb2)
          setWhiteTurn(true)
          setThinking(false)

          if (capturedByAI) playCapture(); else playMove()

          // Check for checkmate/stalemate after AI move
          const playerMoves = generateMoves(nb2, true, newCastling, null)
          const playerLegal = filterLegalMoves(nb2, playerMoves, true, newCastling)
          if (playerLegal.length === 0) {
            if (isInCheck(nb2, true)) {
              setGameOver(true)
              setResult('Black wins by checkmate!')
              const newScore = Math.max(0, score - 50)
              setScore(newScore)
              setLastScore(newScore)
              try { localStorage.setItem(LS.LAST, String(newScore)) } catch {}
              playCheck()
            } else {
              setGameOver(true)
              setResult('Stalemate - Draw!')
            }
          } else if (isInCheck(nb2, true)) {
            playCheck()
          }
        } else {
          setThinking(false)
          setGameOver(true)
          setResult('White wins!')
        }
      }, 100)
      return
    }

    // Select a piece
    if (piece && isWhite(piece)) {
      const moves = generateMoves(b, true, castling, null)
      const pieceMoves = moves.filter(m => m.fr === row && m.fc === col)
      const legal = filterLegalMoves(b, pieceMoves, true, castling)
      gRef.current.selected = [row, col]
      gRef.current.legalMoves = legal
      setSelected([row, col])
      setLegalMoves(legal)
      playMove()
    }
  }, [selected, legalMoves, gameOver, thinking, whiteTurn, castling, score, best])

  const startNewGame = useCallback(() => {
    const newBoard = initBoard()
    gRef.current.board = newBoard
    gRef.current.selected = null
    gRef.current.legalMoves = []
    gRef.current.castling = { kingSide: true, queenSide: true }
    gRef.current.whiteTurn = true
    setBoard(newBoard)
    setSelected(null)
    setLegalMoves([])
    setWhiteTurn(true)
    setGameOver(false)
    setResult('')
    setCaptured({ white: [], black: [] })
    setMoveHistory([])
    setCastling({ kingSide: true, queenSide: true })
    setThinking(false)
  }, [])

  // Canvas click handler
  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cellW = gRef.current.W / 8
    const col = Math.floor(x / cellW)
    const row = Math.floor(y / cellW)
    if (inBounds(row, col)) {
      handleSquareClick(row, col)
    }
  }, [handleSquareClick])

  // Touch
  const handlePointerDown = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cellW = gRef.current.W / 8
    const col = Math.floor(x / cellW)
    const row = Math.floor(y / cellW)
    if (inBounds(row, col)) {
      handleSquareClick(row, col)
    }
  }, [handleSquareClick])

  useEffect(() => { fitCanvas(); draw() }, [fitCanvas, draw, board, selected, legalMoves, thinking])
  useEffect(() => {
    const h = () => { fitCanvas(); draw() };
    window.addEventListener('resize', h);
    window.addEventListener('ut:board-h', h);
    return () => { window.removeEventListener('resize', h); window.removeEventListener('ut:board-h', h) };
  }, [fitCanvas, draw]);


  return (
    <GameShell
      name="CHESS"
      startAction={startNewGame} startLabel="▶ Start" 
      title="Play Chess Online - Free Chess Game with AI"
      desc="Play chess online against the computer! Full chess rules with check, checkmate, castling, en passant, and promotion. AI opponent included."
      icon="♟️" iconBg="rgba(251,191,36,0.08)"
      category="fun" slug="games-chess"
      faq={[
        { q: "How do I play chess against the AI?", a: "Click/tap a white piece to select it, then click a highlighted square to move. The AI will respond automatically." },
        { q: "What chess rules are supported?", a: "All standard rules: castling, en passant, pawn promotion (auto-promotes to queen), check, and checkmate detection." },
        { q: "How strong is the AI?", a: "The AI uses minimax with alpha-beta pruning at depth 2. It's a good challenge for beginners and intermediate players." },
      ]}
      howItWorks={[
        "Click Start to begin a new game. You play as White.",
        "Click a white piece to see legal moves (highlighted dots).",
        "Click a highlighted square to make your move.",
        "The AI responds automatically. Get checkmate to win!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Chess Game", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/chess/",
        "genre": "Board",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="flex gap-4 max-w-6xl mx-auto overflow-hidden">
        <div className="flex-1 min-w-0 max-w-xl mx-auto space-y-5 overflow-hidden">
        {/* Status */}
        <div className="glass p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">
                {gameOver ? result : thinking ? '🤔 AI thinking...' : whiteTurn ? '⬜ Your turn (White)' : '⬛ AI\'s turn (Black)'}
              </div>
              {isInCheck(board, whiteTurn) && !gameOver && (
                <div className="text-xs text-red-400 font-semibold mt-1">⚠️ Check!</div>
              )}
            </div>
            <div className="text-right">
              <div className="text-lg font-extrabold text-yellow-400">{score}</div>
              <div className="text-xs text-slate-400">Score</div>
            </div>
          </div>
          {/* Captured pieces */}
          <div className="mt-2 flex gap-4">
            <div className="text-xs text-slate-400">
              <span className="text-slate-400">AI captured:</span>{' '}
              {captured.white.map((p, i) => <span key={i}>{PIECES[p]}</span>)}
              {captured.white.length === 0 && '—'}
            </div>
            <div className="text-xs text-slate-400">
              <span className="text-slate-400">You captured:</span>{' '}
              {captured.black.map((p, i) => <span key={i}>{PIECES[p]}</span>)}
              {captured.black.length === 0 && '—'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
        </div>

        {/* Canvas */}
        <div className="glass p-3 flex justify-center overflow-hidden">
          <canvas ref={canvasRef}
            onPointerDown={handlePointerDown}
            className="rounded-xl cursor-pointer"
            style={{ touchAction: 'none' }}
          />
        </div>

        <p className="text-center text-xs text-slate-400">
          Click a piece to select, click a square to move | You play White
        </p>
        </div>
      </div>
    </GameShell>
  )
}
