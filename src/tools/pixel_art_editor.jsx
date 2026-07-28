import { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

const DEFAULT_SIZE = 32
const PALETTE = [
  '#000000','#ffffff','#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff','#00ffff',
  '#ff8800','#8800ff','#0088ff','#ff0088','#88ff00','#00ff88',
  '#888888','#cccccc','#444444','#884400','#ff4444','#44ff44','#4444ff','#ffff88',
  '#ff88ff','#88ffff','#c0392b','#2ecc71','#3498db','#f39c12','#9b59b6','#1abc9c',
  'eraser',
]

function createEmptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(null))
}

function floodFill(grid, row, col, newColor) {
  const size = grid.length
  const targetColor = grid[row][col]
  if (targetColor === newColor) return grid

  const newGrid = grid.map(r => [...r])
  const stack = [[row, col]]

  while (stack.length > 0) {
    const [r, c] = stack.pop()
    if (r < 0 || r >= size || c < 0 || c >= size) continue
    if (newGrid[r][c] !== targetColor) continue
    newGrid[r][c] = newColor
    stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1])
  }
  return newGrid
}

export default function PixelArtEditor() {
  const canvasRef = useRef(null)
  const [grid, setGrid] = useState(() => createEmptyGrid(DEFAULT_SIZE))
  const [size, setSize] = useState(DEFAULT_SIZE)
  const [color, setColor] = useState('#000000')
  const [tool, setTool] = useState('brush')
  const [isDrawing, setIsDrawing] = useState(false)
  const [history, setHistory] = useState([createEmptyGrid(DEFAULT_SIZE)])
  const [historyIdx, setHistoryIdx] = useState(0)
  const [bgColor, setBgColor] = useState('transparent')

  const pushHistory = useCallback((newGrid) => {
    setHistory(prev => {
      const truncated = prev.slice(0, historyIdx + 1)
      return [...truncated, newGrid]
    })
    setHistoryIdx(prev => prev + 1)
  }, [historyIdx])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const cellSize = Math.floor(canvas.width / grid.length)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Background
    if (bgColor === 'transparent') {
      // Checkerboard pattern
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid.length; c++) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#1a1a2e' : '#16162a'
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize)
        }
      }
    } else {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Pixels
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid.length; c++) {
        if (grid[r][c]) {
          ctx.fillStyle = grid[r][c]
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize)
        }
      }
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= grid.length; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cellSize, 0)
      ctx.lineTo(i * cellSize, canvas.height)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * cellSize)
      ctx.lineTo(canvas.width, i * cellSize)
      ctx.stroke()
    }
  }, [grid, bgColor])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const sz = Math.min(560, window.innerWidth - 48)
      canvas.width = sz
      canvas.height = sz
    }
    draw()
  }, [draw, size])

  const getCell = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    const cellSize = canvas.width / grid.length
    const col = Math.floor(x / cellSize)
    const row = Math.floor(y / cellSize)
    if (row < 0 || row >= grid.length || col < 0 || col >= grid.length) return null
    return { row, col }
  }

  const applyTool = useCallback((row, col) => {
    setGrid(prev => {
      const newGrid = prev.map(r => [...r])
      if (tool === 'brush') {
        newGrid[row][col] = color
      } else if (tool === 'eraser') {
        newGrid[row][col] = null
      } else if (tool === 'eyedropper') {
        const picked = newGrid[row][col]
        if (picked) setColor(picked)
        return prev
      } else if (tool === 'fill') {
        const filled = floodFill(newGrid, row, col, color)
        if (filled !== newGrid) {
          pushHistory(filled)
          return filled
        }
        return prev
      }
      return newGrid
    })
  }, [tool, color, pushHistory])

  const handleMouseDown = (e) => {
    const cell = getCell(e)
    if (!cell) return
    setIsDrawing(true)
    if (tool === 'fill' || tool === 'eyedropper') {
      applyTool(cell.row, cell.col)
    } else {
      applyTool(cell.row, cell.col)
    }
  }

  const handleMouseMove = (e) => {
    if (!isDrawing) return
    if (tool === 'fill' || tool === 'eyedropper') return
    const cell = getCell(e)
    if (cell) applyTool(cell.row, cell.col)
  }

  const handleMouseUp = () => {
    if (isDrawing && tool !== 'fill' && tool !== 'eyedropper') {
      pushHistory(grid)
    }
    setIsDrawing(false)
  }

  const handleUndo = () => {
    if (historyIdx > 0) {
      setHistoryIdx(prev => prev - 1)
      setGrid(history[historyIdx - 1])
    }
  }
  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(prev => prev + 1)
      setGrid(history[historyIdx + 1])
    }
  }

  const handleClear = () => {
    const empty = createEmptyGrid(size)
    setGrid(empty)
    pushHistory(empty)
  }

  const handleResize = (newSize) => {
    setSize(newSize)
    const newGrid = createEmptyGrid(newSize)
    // Copy old grid into new
    const oldSize = grid.length
    const min = Math.min(oldSize, newSize)
    for (let r = 0; r < min; r++) {
      for (let c = 0; c < min; c++) {
        newGrid[r][c] = grid[r][c]
      }
    }
    setGrid(newGrid)
    setHistory([newGrid])
    setHistoryIdx(0)
  }

  const handleExportPNG = () => {
    // Create a clean export canvas without grid lines
    const exportCanvas = document.createElement('canvas')
    const pxSize = 16
    exportCanvas.width = size * pxSize
    exportCanvas.height = size * pxSize
    const ctx = exportCanvas.getContext('2d')

    if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
    }

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid.length; c++) {
        if (grid[r][c]) {
          ctx.fillStyle = grid[r][c]
          ctx.fillRect(c * pxSize, r * pxSize, pxSize, pxSize)
        }
      }
    }

    const link = document.createElement('a')
    link.download = 'pixel-art.png'
    link.href = exportCanvas.toDataURL('image/png')
    link.click()
  }

  const handleExportJSON = () => {
    const json = JSON.stringify(grid)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'pixel-art.json'
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  const tools = [
    { id: 'brush', icon: '✏️', label: 'Brush' },
    { id: 'eraser', icon: '🧹', label: 'Eraser' },
    { id: 'fill', icon: '🪣', label: 'Fill' },
    { id: 'eyedropper', icon: '💉', label: 'Eyedropper' },
  ]

  return (
    <ToolLayout
      title="Pixel Art Editor"
      desc="Draw pixel art with brush, eraser, fill bucket, eyedropper tools. Export as PNG or JSON."
      icon="🎨" iconBg="rgba(99,102,241,0.08)"
      category="fun" slug="pixel-art-editor"
      faq={[
        { q: 'What tools are available?', a: 'Brush (draw), Eraser (erase), Fill Bucket (flood fill area), and Eyedropper (pick color from canvas).' },
        { q: 'Can I export my artwork?', a: 'Yes! Export as a PNG image or save as JSON to reload and continue editing later.' },
      ]}
      howItWorks={[
        'Select a tool from the toolbar (brush, eraser, fill, eyedropper).',
        'Pick a color from the palette.',
        'Draw on the canvas by clicking and dragging.',
        'Export as PNG or JSON when done.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Pixel Art Editor", "applicationCategory": "DesignApplication",
        "url": "https://www.uptools.in/pixel-art-editor/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Tools */}
          <div className="flex rounded-xl overflow-hidden border border-white/[0.08]">
            {tools.map(t => (
              <button key={t.id} onClick={() => setTool(t.id)}
                className={`px-3 py-2 text-sm font-medium transition-all ${tool === t.id ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/[0.04] text-slate-400 hover:text-white'}`}
                title={t.label}>
                {t.icon}
              </button>
            ))}
          </div>

          {/* Undo/Redo */}
          <div className="flex rounded-xl overflow-hidden border border-white/[0.08]">
            <button onClick={handleUndo} disabled={historyIdx === 0}
              className="px-3 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">↩️</button>
            <button onClick={handleRedo} disabled={historyIdx === history.length - 1}
              className="px-3 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">↪️</button>
          </div>

          {/* Grid size */}
          <select value={size} onChange={e => handleResize(Number(e.target.value))}
            className="bg-white/[0.06] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none">
            {[8, 16, 24, 32, 48, 64].map(s => <option key={s} value={s}>{s}×{s}</option>)}
          </select>

          {/* Background */}
          <select value={bgColor} onChange={e => setBgColor(e.target.value)}
            className="bg-white/[0.06] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none">
            <option value="transparent">Transparent BG</option>
            <option value="#ffffff">White BG</option>
            <option value="#000000">Black BG</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Canvas */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-3 flex-shrink-0">
            <canvas ref={canvasRef}
              className="rounded-lg cursor-crosshair max-w-full"
              style={{ imageRendering: 'pixelated' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          {/* Palette */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 flex-1">
            <label className="block text-xs font-semibold text-slate-400 mb-2">Color Palette</label>
            <div className="grid grid-cols-8 gap-1.5 mb-4">
              {PALETTE.map((c, i) => (
                c === 'eraser' ? (
                  <button key={i} onClick={() => { setTool('eraser') }}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${tool === 'eraser' ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ background: 'repeating-conic-gradient(#555 0% 25%, #333 0% 50%) 50% / 12px 12px' }}
                    title="Eraser"
                  />
                ) : (
                  <button key={i} onClick={() => { setColor(c); setTool('brush') }}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${color === c && tool === 'brush' ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ background: c }}
                    title={c}
                  />
                )
              ))}
            </div>

            {/* Custom color picker */}
            <div className="flex items-center gap-2 mb-4">
              <input type="color" value={color} onChange={e => { setColor(e.target.value); setTool('brush') }}
                className="w-10 h-10 rounded-xl cursor-pointer border-0" />
              <span className="text-xs text-slate-400 font-mono">{color}</span>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button onClick={handleClear}
                className="w-full text-xs px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-medium">
                🗑️ Clear Canvas
              </button>
              <button onClick={handleExportPNG}
                className="glow-btn w-full text-xs px-3 py-2 rounded-xl font-semibold">
                ⬇ Export PNG
              </button>
              <button onClick={handleExportJSON}
                className="w-full text-xs px-3 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white font-medium">
                💾 Save JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
