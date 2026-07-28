import { useState, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function TextToImage() {
  const [text, setText] = useState('Hello, World!')
  const [fontSize, setFontSize] = useState(48)
  const [fg, setFg] = useState('#ffffff')
  const [fgHex, setFgHex] = useState('#ffffff')
  const [bg, setBg] = useState('#6366f1')
  const [bgHex, setBgHex] = useState('#6366f1')
  const [padding, setPadding] = useState(40)
  const [align, setAlign] = useState('center')
  const previewRef = useRef(null)
  const canvasRef = useRef(null)

  const sync = useCallback((type) => {
    if (type === 'fg') {
      if (/^#[0-9a-fA-F]{6}$/.test(fgHex)) setFg(fgHex)
    } else {
      if (/^#[0-9a-fA-F]{6}$/.test(bgHex)) setBg(bgHex)
    }
  }, [fgHex, bgHex])

  const generate = useCallback(() => {
    const txt = text || ' '
    const fs = fontSize || 48
    const pd = padding || 40

    const c = document.createElement('canvas')
    const ctx = c.getContext('2d')
    ctx.font = 'bold ' + fs + 'px Inter,system-ui,sans-serif'
    const lines = txt.split('\n')
    let mw = 0
    lines.forEach(l => {
      const m = ctx.measureText(l)
      if (m.width > mw) mw = m.width
    })
    const lh = fs * 1.4
    const w = Math.ceil(mw + pd * 2)
    const h = Math.ceil(lines.length * lh + pd * 2)
    c.width = w
    c.height = h

    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = fg
    ctx.textBaseline = 'top'
    lines.forEach((l, i) => {
      let x = pd
      if (align === 'center') x = (w - ctx.measureText(l).width) / 2
      else if (align === 'right') x = w - pd - ctx.measureText(l).width
      ctx.fillText(l, x, pd + i * lh)
    })

    canvasRef.current = c
    if (previewRef.current) {
      previewRef.current.innerHTML = ''
      previewRef.current.appendChild(c)
    }
  }, [text, fontSize, fg, bg, padding, align])

  useEffect(() => { generate() }, [generate])

  const download = useCallback(() => {
    const c = canvasRef.current
    if (!c) { generate(); return }
    const a = document.createElement('a')
    a.download = `text-image-${c.width}x${c.height}.png`
    a.href = c.toDataURL('image/png')
    a.click()
  }, [generate])

  const copyBase64 = useCallback(() => {
    const c = canvasRef.current
    if (!c) { generate(); return }
    setTimeout(() => {
      const data = canvasRef.current.toDataURL('image/png')
      navigator.clipboard.writeText(data)
    }, 100)
  }, [generate])

  return (
    <ToolLayout
      title="Text to Image"
      desc="Convert text to a downloadable PNG image. Customize font, colors, and layout."
      icon="📝" iconBg="rgba(99,102,241,0.08)"
      category="images" slug="text-to-image"
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Controls */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-sm text-slate-400 mb-1">Text</label>
              <textarea
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white font-mono min-h-[80px] resize-y focus:outline-none focus:border-indigo-500/50"
                value={text}
                onChange={e => setText(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Font Size</label>
              <input className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/50" type="number" value={fontSize} min={8} max={200} onChange={e => setFontSize(+e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Text Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={fg} onChange={e => { setFg(e.target.value); setFgHex(e.target.value) }} className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent" />
                <input className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500/50" type="text" value={fgHex} onChange={e => setFgHex(e.target.value)} onBlur={() => sync('fg')} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Background</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={bg} onChange={e => { setBg(e.target.value); setBgHex(e.target.value) }} className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent" />
                <input className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500/50" type="text" value={bgHex} onChange={e => setBgHex(e.target.value)} onBlur={() => sync('bg')} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Padding</label>
              <input className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/50" type="number" value={padding} min={0} max={200} onChange={e => setPadding(+e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Align</label>
              <select
                className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                value={align}
                onChange={e => setAlign(e.target.value)}
              >
                <option value="center">Center</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={download} className="glow-btn text-xs px-5 py-2.5 rounded-xl font-semibold">⬇️ Download PNG</button>
            <button onClick={copyBase64} className="text-xs px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition">📋 Copy as Base64</button>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Preview</h2>
          <div
            ref={previewRef}
            className="rounded-xl p-4 text-center min-h-[100px] flex items-center justify-center"
            style={{ background: 'repeating-conic-gradient(#2a2a3a 0% 25%,transparent 0% 50%) 50%/20px 20px' }}
          />
        </div>
      </div>
    </ToolLayout>
  )
}
