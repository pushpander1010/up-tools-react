import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function image_placeholder_generator() {
  const canvasRef = useRef(null)
  const [width, setWidth] = useState(400)
  const [height, setHeight] = useState(300)
  const [text, setText] = useState('400 × 300')
  const [fontSize, setFontSize] = useState(24)
  const [bgColor, setBgColor] = useState('#6366F1')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [pattern, setPattern] = useState('solid')
  const [generated, setGenerated] = useState(false)

  const generate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = Math.min(Math.max(width, 16), 2000)
    const h = Math.min(Math.max(height, 16), 2000)

    canvas.width = w
    canvas.height = h

    // Background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, w, h)

    // Pattern
    if (pattern === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, w, h)
      grad.addColorStop(0, bgColor)
      grad.addColorStop(1, textColor + '44')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
    } else if (pattern === 'dots') {
      ctx.fillStyle = textColor + '15'
      const spacing = 20
      for (let x = 0; x < w; x += spacing) {
        for (let y = 0; y < h; y += spacing) {
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    } else if (pattern === 'grid') {
      ctx.strokeStyle = textColor + '15'
      ctx.lineWidth = 1
      const gridSize = 30
      for (let x = 0; x <= w; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
      }
      for (let y = 0; y <= h; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
      }
    } else if (pattern === 'diagonal') {
      ctx.strokeStyle = textColor + '15'
      ctx.lineWidth = 1
      for (let i = -h; i < w + h; i += 15) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + h, h); ctx.stroke()
      }
    }

    // Image icon (crossed rectangle)
    const iconSize = Math.min(w, h) * 0.2
    const iconX = w / 2
    const iconY = h / 2 - fontSize * 0.8

    ctx.strokeStyle = textColor + '40'
    ctx.lineWidth = 2
    const iw = iconSize, ih = iconSize * 0.75
    const ix = iconX - iw / 2, iy = iconY - ih / 2
    ctx.strokeRect(ix, iy, iw, ih)

    // Mountain triangle
    ctx.fillStyle = textColor + '30'
    ctx.beginPath()
    ctx.moveTo(ix, iy + ih)
    ctx.lineTo(ix + iw * 0.35, iy + ih * 0.5)
    ctx.lineTo(ix + iw * 0.55, iy + ih * 0.7)
    ctx.lineTo(ix + iw, iy + ih)
    ctx.closePath()
    ctx.fill()

    // Sun circle
    ctx.beginPath()
    ctx.arc(ix + iw * 0.7, iy + ih * 0.3, ih * 0.12, 0, Math.PI * 2)
    ctx.fill()

    // Text
    ctx.fillStyle = textColor
    ctx.font = `bold ${Math.min(fontSize, w * 0.12)}px system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text || `${w} × ${h}`, iconX, h / 2 + iconSize * 0.35)

    // Border
    ctx.strokeStyle = textColor + '30'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.strokeRect(1, 1, w - 2, h - 2)
    ctx.setLineDash([])

    setGenerated(true)
  }, [width, height, text, fontSize, bgColor, textColor, pattern])

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `placeholder-${width}x${height}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const copyToClipboard = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
    } catch {
      // Fallback: open in new tab
      window.open(canvas.toDataURL(), '_blank')
    }
  }

  return (
    <ToolLayout
      title="Image Placeholder Generator"
      desc="Generate custom placeholder images with text, colors, and patterns. Download as PNG or copy to clipboard."
      icon="🖼️" iconBg="rgba(99,102,241,0.08)"
      category="images" slug="image-placeholder-generator"
      faq={[
        { q: 'What can I use this for?', a: 'Wireframes, mockups, testing layouts, or anywhere you need a quick placeholder image.' },
        { q: 'What format is the output?', a: 'PNG format — click Download to save or Copy to place in clipboard.' },
      ]}
      howItWorks={[
        'Set width, height, text, colors, and pattern.',
        'Click Generate to preview on the canvas.',
        'Download the PNG or copy to clipboard.',
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Settings */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Settings</h3>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold">Width (px)</label>
              <input type="number" min={16} max={2000} value={width}
                onChange={e => setWidth(+e.target.value)}
                className="mt-1 w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/40 transition-all" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold">Height (px)</label>
              <input type="number" min={16} max={2000} value={height}
                onChange={e => setHeight(+e.target.value)}
                className="mt-1 w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/40 transition-all" />
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[[320, 180], [640, 360], [1280, 720], [1920, 1080], [400, 400], [800, 600]].map(([w, h]) => (
              <button key={`${w}x${h}`} onClick={() => { setWidth(w); setHeight(h); setText(`${w} × ${h}`) }}
                className="px-3 py-1.5 text-[10px] font-bold text-slate-400 bg-white/[0.04] rounded-lg hover:bg-white/[0.08] transition-all">
                {w}×{h}
              </button>
            ))}
          </div>

          {/* Text */}
          <div className="mb-4">
            <label className="text-[10px] text-slate-500 uppercase font-bold">Display Text</label>
            <input type="text" value={text} onChange={e => setText(e.target.value)}
              placeholder="400 × 300"
              className="mt-1 w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600" />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold">Background</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border-2 border-white/[0.15] cursor-pointer" />
                <span className="text-xs text-slate-400 font-mono">{bgColor}</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold">Text Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border-2 border-white/[0.15] cursor-pointer" />
                <span className="text-xs text-slate-400 font-mono">{textColor}</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold">Font Size</label>
              <input type="number" min={8} max={200} value={fontSize}
                onChange={e => setFontSize(+e.target.value)}
                className="mt-1 w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/40 transition-all" />
            </div>
          </div>

          {/* Pattern */}
          <div>
            <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block">Pattern</label>
            <div className="flex flex-wrap gap-2">
              {['solid', 'gradient', 'dots', 'grid', 'diagonal'].map(p => (
                <button key={p} onClick={() => setPattern(p)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all capitalize ${pattern === p ? 'bg-indigo-500 text-white' : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate + actions */}
        <div className="flex gap-3">
          <button onClick={generate}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-indigo-500/20">
            Generate 🖼️
          </button>
          {generated && (
            <>
              <button onClick={download}
                className="px-6 py-3 bg-white/[0.06] border border-white/[0.1] text-slate-300 text-sm font-bold rounded-xl hover:bg-white/[0.1] transition-all">
                💾 Download
              </button>
              <button onClick={copyToClipboard}
                className="px-6 py-3 bg-white/[0.06] border border-white/[0.1] text-slate-300 text-sm font-bold rounded-xl hover:bg-white/[0.1] transition-all">
                📋 Copy
              </button>
            </>
          )}
        </div>

        {/* Canvas preview */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Preview</h3>
          <div className="bg-black/30 rounded-xl p-4 flex items-center justify-center overflow-auto" style={{ minHeight: 200 }}>
            <canvas ref={canvasRef}
              className="max-w-full rounded-lg"
              style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
          {generated && (
            <div className="mt-2 text-xs text-slate-500">
              Canvas: {width}×{height}px | Format: PNG
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
