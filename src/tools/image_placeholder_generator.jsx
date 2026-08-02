import { useState, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

function hexToRgb(h) {
  const r = parseInt(h.slice(1,3),16)
  const g = parseInt(h.slice(3,5),16)
  const b = parseInt(h.slice(5,7),16)
  return {r,g,b}
}

function genTextLines(ctx, txt, w, fs) {
  const lines = []
  let temp = ''
  const words = txt.split(' ')
  for (const wd of words) {
    const test = temp ? temp + ' ' + wd : wd
    ctx.font = 'bold ' + Math.min(fs, w/10) + 'px Inter,system-ui,sans-serif'
    if (ctx.measureText(test).width > w * 0.85) {
      lines.push(temp)
      temp = wd
    } else {
      temp = test
    }
  }
  lines.push(temp)
  return lines
}

export default function ImagePlaceholderGenerator() {
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(400)
  const [text, setText] = useState('800 × 400')
  const [bg, setBg] = useState('#6366f1')
  const [bgHex, setBgHex] = useState('#6366f1')
  const [fg, setFg] = useState('#ffffff')
  const [fgHex, setFgHex] = useState('#ffffff')
  const [fontSize, setFontSize] = useState(36)
  const [htmlCode, setHtmlCode] = useState('')
  const [mdCode, setMdCode] = useState('')
  const previewRef = useRef(null)
  const canvasRef = useRef(null)

  const syncColor = useCallback((type) => {
    if (type === 'bg') {
      if (/^#[0-9a-fA-F]{6}$/.test(bgHex)) setBg(bgHex)
    } else {
      if (/^#[0-9a-fA-F]{6}$/.test(fgHex)) setFg(fgHex)
    }
  }, [bgHex, fgHex])

  const generate = useCallback(() => {
    const w = width || 800
    const h = height || 400
    const txt = text || `${w} × ${h}`
    const fs = fontSize || 36

    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    const ctx = c.getContext('2d')

    // Background
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    // Subtle gradient overlay
    const fr = hexToRgb(fg)
    const grad = ctx.createLinearGradient(0, 0, w, 0)
    grad.addColorStop(0, `rgba(${fr.r},${fr.g},${fr.b},.03)`)
    grad.addColorStop(0.5, `rgba(${fr.r},${fr.g},${fr.b},.1)`)
    grad.addColorStop(1, `rgba(${fr.r},${fr.g},${fr.b},.03)`)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // Text
    ctx.fillStyle = fg
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const lines = genTextLines(ctx, txt, w, fs)
    ctx.font = 'bold ' + Math.min(fs, w/10) + 'px Inter,system-ui,sans-serif'
    const lh = fs * 1.3
    const startY = (h - lines.length * lh) / 2 + lh / 2
    lines.forEach((l, i) => {
      ctx.fillText(l, w / 2, startY + i * lh)
    })

    // Store canvas
    canvasRef.current = c

    // Update preview
    if (previewRef.current) {
      previewRef.current.innerHTML = ''
      previewRef.current.appendChild(c)
    }

    // Update codes
    const dataUrl = c.toDataURL('image/png')
    setHtmlCode(`<img src="${dataUrl}" width="${w}" height="${h}" alt="${txt}" />`)
    setMdCode(`![${txt}](${dataUrl})`)
  }, [width, height, text, bg, fg, fontSize])

  useEffect(() => { generate() }, [generate])

  const download = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const a = document.createElement('a')
    a.download = `${text.replace(/\s+/g, '-').toLowerCase()}-${c.width}x${c.height}.png`
    a.href = c.toDataURL('image/png')
    a.click()
  }, [text])

  return (
    <ToolLayout
      title="Image Placeholder Generator"
      desc="Generate custom placeholder images for mockups. All processing done in your browser."
      icon="🖼️" iconBg="rgba(99,102,241,0.08)"
      category="images" slug="image-placeholder-generator"
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Controls */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Width (px)</label>
              <input className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/50" type="number" value={width} min={10} max={4000} onChange={e => setWidth(+e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Height (px)</label>
              <input className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/50" type="number" value={height} min={10} max={4000} onChange={e => setHeight(+e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-slate-400 mb-1">Text</label>
              <input className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50" type="text" value={text} onChange={e => setText(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Background</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={bg} onChange={e => { setBg(e.target.value); setBgHex(e.target.value) }} className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent" />
                <input className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500/50" type="text" value={bgHex} onChange={e => setBgHex(e.target.value)} onBlur={() => syncColor('bg')} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Text Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={fg} onChange={e => { setFg(e.target.value); setFgHex(e.target.value) }} className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent" />
                <input className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500/50" type="text" value={fgHex} onChange={e => setFgHex(e.target.value)} onBlur={() => syncColor('fg')} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Font Size</label>
              <input className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/50" type="number" value={fontSize} min={8} max={200} onChange={e => setFontSize(+e.target.value)} />
            </div>
          </div>
          <button onClick={download} className="glow-btn text-xs px-5 py-2.5 rounded-xl font-semibold mt-4">⬇️ Download PNG</button>
        </div>

        {/* Preview */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Preview</h2>
          <div
            ref={previewRef}
            className="rounded-xl p-4 text-center min-h-[200px] flex items-center justify-center"
            style={{ background: 'repeating-conic-gradient(#2a2a3a 0% 25%,transparent 0% 50%) 50%/20px 20px' }}
          />
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">HTML &lt;img&gt; tag</label>
              <textarea className="w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-3 py-2 text-[11px] text-slate-300 font-mono h-[50px] resize-none focus:outline-none" readOnly value={htmlCode} onClick={e => { e.target.select(); navigator.clipboard.writeText(htmlCode) }} />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Markdown</label>
              <textarea className="w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-3 py-2 text-[11px] text-slate-300 font-mono h-[50px] resize-none focus:outline-none" readOnly value={mdCode} onClick={e => { e.target.select(); navigator.clipboard.writeText(mdCode) }} />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
