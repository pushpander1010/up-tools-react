import { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

const DEFAULT_PALETTE = [
  '#000000','#ffffff','#ff0000','#00ff00','#0000ff','#ffff00',
  '#ff00ff','#00ffff','#ff8800','#88ff00','#0088ff','#ff0088',
  '#884400','#448800','#004488','#880044',
  '#ff4444','#44ff44','#4444ff','#ffff44','#ff44ff','#44ffff',
  '#888888','#444444','#cccccc','#f0f0f0'
];

function floodFill(pixels, startR, startC, fillColor, GRID) {
  const targetColor = pixels[startR][startC];
  if (targetColor === fillColor) return pixels;
  const result = pixels.map(r => [...r]);
  const stack = [[startR, startC]];
  const visited = new Set();
  while (stack.length) {
    const [r, c] = stack.pop();
    if (r < 0 || r >= GRID || c < 0 || c >= GRID) continue;
    const key = r * GRID + c;
    if (visited.has(key)) continue;
    if (result[r][c] !== targetColor) continue;
    visited.add(key);
    result[r][c] = fillColor;
    stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
  }
  return result;
}

function initPixels(GRID) {
  const p = [];
  for (let r = 0; r < GRID; r++) {
    p[r] = [];
    for (let c = 0; c < GRID; c++) p[r][c] = null;
  }
  return p;
}

export default function pixel_art_editor() {
  const canvasRef = useRef(null);
  const gridCanvasRef = useRef(null);
  const [gridSize, setGridSize] = useState(32);
  const [tool, setTool] = useState('brush');
  const [currentColor, setCurrentColor] = useState('#4488ff');
  const [showGrid, setShowGrid] = useState(true);
  const [pixels, setPixels] = useState(() => initPixels(32));
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [palette, setPalette] = useState(() => {
    try { const s = localStorage.getItem('uptools_pixel_palette'); return s ? JSON.parse(s) : [...DEFAULT_PALETTE]; }
    catch { return [...DEFAULT_PALETTE]; }
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const drawingRef = useRef(false);

  const CELL = useRef(16);
  const MAX_HISTORY = 100;

  const calcCellSize = useCallback(() => {
    const maxW = typeof window !== 'undefined' ? Math.min(window.innerWidth - 64, 700) : 700;
    CELL.current = Math.max(4, Math.floor(maxW / gridSize));
    return CELL.current;
  }, [gridSize]);

  const getCanvasSize = useCallback(() => calcCellSize() * gridSize, [calcCellSize, gridSize]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const gridCvs = gridCanvasRef.current;
    if (!canvas || !gridCvs) return;
    const ctx = canvas.getContext('2d');
    const gridCtx = gridCvs.getContext('2d');
    const cell = calcCellSize();
    const sz = cell * gridSize;
    canvas.width = gridCvs.width = sz;
    canvas.height = gridCvs.height = sz;
    canvas.style.width = gridCvs.style.width = sz + 'px';
    canvas.style.height = gridCvs.style.height = sz + 'px';

    ctx.clearRect(0, 0, sz, sz);
    // Checkerboard
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        ctx.fillStyle = ((r + c) % 2 === 0) ? '#1a1f2e' : '#1e2436';
        ctx.fillRect(c * cell, r * cell, cell, cell);
      }
    }
    // Pixels
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (pixels[r][c]) {
          ctx.fillStyle = pixels[r][c];
          ctx.fillRect(c * cell, r * cell, cell, cell);
        }
      }
    }
    // Grid
    gridCtx.clearRect(0, 0, sz, sz);
    if (showGrid) {
      gridCtx.strokeStyle = 'rgba(255,255,255,0.08)';
      gridCtx.lineWidth = 0.5;
      gridCtx.beginPath();
      for (let i = 0; i <= gridSize; i++) {
        const pos = i * cell;
        gridCtx.moveTo(pos, 0); gridCtx.lineTo(pos, sz);
        gridCtx.moveTo(0, pos); gridCtx.lineTo(sz, pos);
      }
      gridCtx.stroke();
    }
  }, [pixels, gridSize, showGrid, calcCellSize]);

  useEffect(() => { render(); }, [render]);

  const snapshot = useCallback(() => pixels.map(row => [...row]), [pixels]);

  const saveState = useCallback(() => {
    setHistory(prev => {
      const newHist = prev.slice(0, historyIdx + 1);
      newHist.push(snapshot());
      if (newHist.length > MAX_HISTORY) newHist.shift();
      setHistoryIdx(newHist.length - 1);
      return newHist;
    });
  }, [snapshot, historyIdx]);

  const undo = useCallback(() => {
    if (historyIdx > 0) {
      const newIdx = historyIdx - 1;
      setPixels(history[newIdx].map(r => [...r]));
      setHistoryIdx(newIdx);
    }
  }, [historyIdx, history]);

  const redo = useCallback(() => {
    if (historyIdx < history.length - 1) {
      const newIdx = historyIdx + 1;
      setPixels(history[newIdx].map(r => [...r]));
      setHistoryIdx(newIdx);
    }
  }, [historyIdx, history]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
      else if (e.key === 'b') setTool('brush');
      else if (e.key === 'e') setTool('eraser');
      else if (e.key === 'g') setTool('fill');
      else if (e.key === 'i') setTool('eyedropper');
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [undo, redo]);

  const getCellFromEvent = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX ?? e.pageX) - rect.left;
    const y = (e.clientY ?? e.pageY) - rect.top;
    const cell = calcCellSize();
    const c = Math.floor(x / cell);
    const r = Math.floor(y / cell);
    if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return null;
    return { r, c };
  }, [gridSize, calcCellSize]);

  const paintAt = useCallback((e) => {
    const pos = getCellFromEvent(e);
    if (!pos) return;
    const { r, c } = pos;
    setPixels(prev => {
      const next = prev.map(row => [...row]);
      if (tool === 'brush') {
        if (next[r][c] !== currentColor) next[r][c] = currentColor;
      } else if (tool === 'eraser') {
        if (next[r][c] !== null) next[r][c] = null;
      } else if (tool === 'fill') {
        return floodFill(next, r, c, currentColor, gridSize);
      } else if (tool === 'eyedropper') {
        const picked = next[r][c];
        if (picked) {
          setCurrentColor(picked);
          setTool('brush');
        }
        return next;
      }
      return next;
    });
  }, [tool, currentColor, gridSize, getCellFromEvent]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    drawingRef.current = true;
    setIsDrawing(true);
    paintAt(e);
  }, [paintAt]);

  const handleMouseMove = useCallback((e) => {
    if (!drawingRef.current) return;
    paintAt(e);
  }, [paintAt]);

  useEffect(() => {
    const handler = () => {
      if (drawingRef.current) {
        drawingRef.current = false;
        setIsDrawing(false);
        if (tool !== 'fill' && tool !== 'eyedropper') saveState();
      }
    };
    document.addEventListener('mouseup', handler);
    return () => document.removeEventListener('mouseup', handler);
  }, [tool, saveState]);

  const handleMouseLeave = useCallback(() => {
    drawingRef.current = false;
    setIsDrawing(false);
  }, []);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    const pos = getCellFromEvent(e);
    if (pos && pixels[pos.r][pos.c] !== null) {
      setPixels(prev => {
        const next = prev.map(row => [...row]);
        next[pos.r][pos.c] = null;
        return next;
      });
      saveState();
    }
  }, [getCellFromEvent, pixels, saveState]);

  const handleGridChange = useCallback((newSize) => {
    if (window.confirm('Changing grid size will clear the canvas. Continue?')) {
      setGridSize(+newSize);
      setPixels(initPixels(+newSize));
      setHistory([]); setHistoryIdx(-1);
    }
  }, []);

  const clearCanvas = useCallback(() => {
    if (!window.confirm('Clear the entire canvas?')) return;
    setPixels(initPixels(gridSize));
    saveState();
  }, [gridSize, saveState]);

  const exportPNG = useCallback(() => {
    const exportScale = Math.max(1, Math.floor(512 / gridSize));
    const expCvs = document.createElement('canvas');
    expCvs.width = gridSize * exportScale;
    expCvs.height = gridSize * exportScale;
    const expCtx = expCvs.getContext('2d');
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (pixels[r][c]) {
          expCtx.fillStyle = pixels[r][c];
          expCtx.fillRect(c * exportScale, r * exportScale, exportScale, exportScale);
        }
      }
    }
    const link = document.createElement('a');
    link.download = `pixel-art-${gridSize}x${gridSize}.png`;
    link.href = expCvs.toDataURL('image/png');
    link.click();
  }, [pixels, gridSize]);

  const addCurrentToPalette = useCallback(() => {
    if (!palette.includes(currentColor)) {
      const newPalette = [...palette, currentColor];
      setPalette(newPalette);
      try { localStorage.setItem('uptools_pixel_palette', JSON.stringify(newPalette)); } catch {}
    }
  }, [palette, currentColor]);

  const removeSelectedPalette = useCallback(() => {
    const idx = palette.indexOf(currentColor);
    if (idx > -1) {
      const newPalette = [...palette]; newPalette.splice(idx, 1);
      setPalette(newPalette);
      try { localStorage.setItem('uptools_pixel_palette', JSON.stringify(newPalette)); } catch {}
    }
  }, [palette, currentColor]);

  const resetPalette = useCallback(() => {
    if (window.confirm('Reset palette to default colors?')) {
      setPalette([...DEFAULT_PALETTE]);
      try { localStorage.setItem('uptools_pixel_palette', JSON.stringify(DEFAULT_PALETTE)); } catch {}
    }
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    drawingRef.current = true;
    setIsDrawing(true);
    const t = e.touches[0];
    paintAt(t);
  }, [paintAt]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (!drawingRef.current) return;
    const t = e.touches[0];
    paintAt(t);
  }, [paintAt]);

  const handleTouchEnd = useCallback(() => {
    if (drawingRef.current) {
      drawingRef.current = false;
      setIsDrawing(false);
      if (tool !== 'fill' && tool !== 'eyedropper') saveState();
    }
  }, [tool, saveState]);

  return (
    <ToolLayout
      title="Pixel Art Editor"
      desc="Create pixel art in your browser. Click to paint, right-click to erase."
      icon="🎨" iconBg="rgba(99,102,241,0.08)"
      category="fun" slug="pixel-art-editor"
    >
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Grid Size</label>
              <select className="bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white min-w-[90px] focus:outline-none focus:border-indigo-500/50"
                value={gridSize} onChange={e => handleGridChange(e.target.value)}>
                <option value="16">16×16</option>
                <option value="24">24×24</option>
                <option value="32">32×32</option>
                <option value="48">48×48</option>
                <option value="64">64×64</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Tool</label>
              <select className="bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white min-w-[110px] focus:outline-none focus:border-indigo-500/50"
                value={tool} onChange={e => setTool(e.target.value)}>
                <option value="brush">🖌️ Brush</option>
                <option value="eraser">🧹 Eraser</option>
                <option value="fill">🪣 Fill</option>
                <option value="eyedropper">💉 Eyedropper</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Color</label>
              <div className="flex gap-1.5 items-center">
                <input type="color" value={currentColor} onChange={e => setCurrentColor(e.target.value)}
                  className="w-10 h-[34px] border border-white/10 rounded cursor-pointer bg-transparent p-0.5" />
                <span className="text-xs text-slate-400 font-mono min-w-[56px]">{currentColor}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} className="accent-indigo-500" />
              <label className="text-xs text-slate-400">Grid Lines</label>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={undo} disabled={historyIdx <= 0} className="glow-btn text-xs px-3 py-2 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed">↩ Undo</button>
              <button onClick={redo} disabled={historyIdx >= history.length - 1} className="glow-btn text-xs px-3 py-2 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed">↪ Redo</button>
              <button onClick={clearCanvas} className="bg-red-900/40 hover:bg-red-900/60 border border-red-500/20 text-xs px-3 py-2 rounded-xl text-slate-300 transition-all">🗑️ Clear</button>
              <button onClick={exportPNG} className="bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-500/20 text-xs px-3 py-2 rounded-xl text-slate-300 transition-all">💾 Export PNG</button>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Palette</label>
            <div className="flex flex-wrap gap-1 min-h-[28px]">
              {palette.map((c, i) => (
                <button key={i} onClick={() => setCurrentColor(c)} className="w-6 h-6 rounded transition-all hover:scale-110"
                  style={{ background: c, border: `2px solid ${c === currentColor ? '#fff' : '#1e293b'}` }}
                  title={c} />
              ))}
            </div>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              <button onClick={addCurrentToPalette} className="bg-white/[0.06] border border-white/[0.08] text-[11px] px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition-all">+ Add Current</button>
              <button onClick={removeSelectedPalette} className="bg-white/[0.06] border border-white/[0.08] text-[11px] px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition-all">− Remove</button>
              <button onClick={resetPalette} className="bg-white/[0.06] border border-white/[0.08] text-[11px] px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition-all">↺ Reset</button>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 flex justify-center overflow-auto">
          <div className="relative inline-block shadow-2xl rounded">
            <canvas ref={canvasRef}
              onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave} onContextMenu={handleContextMenu}
              onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
              className="block rounded cursor-crosshair" />
            <canvas ref={gridCanvasRef} className="absolute top-0 left-0 pointer-events-none" />
          </div>
        </div>

        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-slate-300 mb-2">Keyboard Shortcuts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs text-slate-400">
            {[
              ['Ctrl+Z', 'Undo'], ['Ctrl+Y', 'Redo'], ['B', 'Brush'],
              ['E', 'Eraser'], ['G', 'Fill'], ['I', 'Eyedropper'],
            ].map(([key, action]) => (
              <div key={key}><kbd className="bg-white/[0.06] px-1.5 py-0.5 rounded text-[11px]">{key}</kbd> {action}</div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
