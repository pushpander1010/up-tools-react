import { useState, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

const PRESET_SIZES = [
  { label: 'Full HD (1920×1080)', w: 1920, h: 1080 },
  { label: 'Social Share (1200×630)', w: 1200, h: 630 },
  { label: 'Square Post (1080×1080)', w: 1080, h: 1080 },
  { label: 'Standard (800×600)', w: 800, h: 600 },
  { label: 'Ad Banner (300×250)', w: 300, h: 250 },
  { label: 'Avatar / Icon (400×400)', w: 400, h: 400 },
]

const COLOR_THEMES = [
  { name: 'Indigo', bg: '#4f46e5', fg: '#ffffff' },
  { name: 'Slate Dark', bg: '#0f172a', fg: '#f8fafc' },
  { name: 'Light Gray', bg: '#e2e8f0', fg: '#334155' },
  { name: 'Emerald', bg: '#059669', fg: '#ffffff' },
  { name: 'Amber', bg: '#d97706', fg: '#ffffff' },
  { name: 'Rose', bg: '#e11d48', fg: '#ffffff' },
]

function hexToRgb(h) {
  if (!h || !h.startsWith('#')) return { r: 99, g: 102, b: 241 }
  const r = parseInt(h.slice(1, 3), 16) || 0
  const g = parseInt(h.slice(3, 5), 16) || 0
  const b = parseInt(h.slice(5, 7), 16) || 0
  return { r, g, b }
}

function genTextLines(ctx, txt, w, fs) {
  const lines = []
  let temp = ''
  const words = txt.split(' ')
  for (const wd of words) {
    const test = temp ? temp + ' ' + wd : wd
    ctx.font = `bold ${Math.min(fs, w / 10)}px Inter, system-ui, sans-serif`
    if (ctx.measureText(test).width > w * 0.85 && temp) {
      lines.push(temp)
      temp = wd
    } else {
      temp = test
    }
  }
  if (temp) lines.push(temp)
  return lines
}

export default function ImagePlaceholderGenerator() {
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(400)
  const [text, setText] = useState('800 × 400')
  const [bg, setBg] = useState('#4f46e5')
  const [fg, setFg] = useState('#ffffff')
  const [fontSize, setFontSize] = useState(36)
  const [htmlCode, setHtmlCode] = useState('')
  const [mdCode, setMdCode] = useState('')
  const [copiedKey, setCopiedKey] = useState(null)

  const canvasRef = useRef(null)

  const applyPresetSize = (w, h) => {
    setWidth(w)
    setHeight(h)
    setText(`${w} × ${h}`)
  }

  const applyTheme = (theme) => {
    setBg(theme.bg)
    setFg(theme.fg)
  }

  const generate = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const w = Math.max(10, Math.min(4000, width || 800))
    const h = Math.max(10, Math.min(4000, height || 400))
    const txt = text.trim() || `${w} × ${h}`
    const fs = Math.max(8, fontSize || 36)

    c.width = w
    c.height = h
    const ctx = c.getContext('2d')

    // Background
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    // Subtle gradient depth overlay
    const fr = hexToRgb(fg)
    const grad = ctx.createLinearGradient(0, 0, w, 0)
    grad.addColorStop(0, `rgba(${fr.r},${fr.g},${fr.b}, 0.03)`)
    grad.addColorStop(0.5, `rgba(${fr.r},${fr.g},${fr.b}, 0.1)`)
    grad.addColorStop(1, `rgba(${fr.r},${fr.g},${fr.b}, 0.03)`)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // Text rendering
    ctx.fillStyle = fg
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const lines = genTextLines(ctx, txt, w, fs)
    ctx.font = `bold ${Math.min(fs, w / 10)}px Inter, system-ui, sans-serif`
    const lh = fs * 1.3
    const startY = (h - lines.length * lh) / 2 + lh / 2
    lines.forEach((l, i) => {
      ctx.fillText(l, w / 2, startY + i * lh)
    })

    const dataUrl = c.toDataURL('image/png')
    setHtmlCode(`<img src="${dataUrl}" width="${w}" height="${h}" alt="${txt}" />`)
    setMdCode(`![${txt}](${dataUrl})`)
  }, [width, height, text, bg, fg, fontSize])

  useEffect(() => {
    generate()
  }, [generate])

  const copyToClipboard = async (textToCopy, key) => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 1500)
    } catch {
      /* clipboard error */
    }
  }

  const downloadPng = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const a = document.createElement('a')
    const slug = (text || 'placeholder').replace(/\s+/g, '-').toLowerCase()
    a.download = `${slug}-${c.width}x${c.height}.png`
    a.href = c.toDataURL('image/png')
    document.body.appendChild(a)
    a.click()
    a.remove()
  }, [text])

  const downloadSvg = useCallback(() => {
    const w = width || 800
    const h = height || 400
    const txt = text.trim() || `${w} × ${h}`
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="${bg}" />
  <text x="50%" y="50%" font-family="Inter, system-ui, sans-serif" font-size="${fontSize}" font-weight="bold" fill="${fg}" dominant-baseline="middle" text-anchor="middle">${txt}</text>
</svg>`
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.download = `placeholder-${w}x${h}.svg`
    a.href = url
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [width, height, text, bg, fg, fontSize])

  return (
    <ToolLayout
      title="Image Placeholder Generator"
      desc="Image Placeholder Generator - generate custom placeholder images for mockups. All processing done, online free. Free online, no sign-up. Works on any device."
      icon="🖼️" iconBg="rgba(99,102,241,0.08)"
      category="images" slug="image-placeholder-generator"
      faq={[
        { q: "How do I make a placeholder image online free?", a: "Set width, height, and text above, preview instantly, then copy the URL or download. Free, no sign-up." },
        { q: "What sizes are supported?", a: "Any size from 10 to 4000 pixels. All processing happens in your browser, free." },
        { q: "Is it free?", a: "Yes, completely free with no sign-up. Generate unlimited placeholders on any device." },
        { q: "Do I need to sign up?", a: "No sign-up needed. Generate unlimited placeholders free on any device." },
        { q: "Does it work on mobile?", a: "Yes. Make placeholders free in your phone browser, no app needed." },
        { q: "Is my data private?", a: "Yes. All processing happens in your browser. Nothing is uploaded." },
      ]}
      howItWorks={[
        "Set the width, height, and text above.",
        "Preview the placeholder instantly.",
        "Copy the URL or download the image.",
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Controls */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          {/* Quick presets */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Standard Dimensions</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_SIZES.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => applyPresetSize(s.w, s.h)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    width === s.w && height === s.h
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Themes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Color Palette Schemes</label>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {COLOR_THEMES.map((theme) => (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => applyTheme(theme)}
                  className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                    bg === theme.bg
                      ? 'border-indigo-600 ring-2 ring-indigo-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: theme.bg, color: theme.fg }}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dimension & Text Form inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Width (px)</label>
              <input
                className="w-full min-h-[44px] bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm text-gray-900 font-mono outline-none focus:ring-2 focus:ring-indigo-500"
                type="number"
                value={width}
                min={10}
                max={4000}
                onChange={(e) => setWidth(Math.max(10, parseInt(e.target.value, 10) || 800))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Height (px)</label>
              <input
                className="w-full min-h-[44px] bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm text-gray-900 font-mono outline-none focus:ring-2 focus:ring-indigo-500"
                type="number"
                value={height}
                min={10}
                max={4000}
                onChange={(e) => setHeight(Math.max(10, parseInt(e.target.value, 10) || 400))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Custom Text</label>
              <input
                className="w-full min-h-[44px] bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Background Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="w-12 min-h-[44px] rounded-xl border border-gray-300 p-1 bg-white cursor-pointer"
                />
                <input
                  className="flex-1 min-h-[44px] bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-mono outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Text Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                  className="w-12 min-h-[44px] rounded-xl border border-gray-300 p-1 bg-white cursor-pointer"
                />
                <input
                  className="flex-1 min-h-[44px] bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-mono outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1">
                <span>Font Size</span>
                <span className="text-indigo-600 font-bold">{fontSize}px</span>
              </div>
              <input
                type="range"
                min={12}
                max={140}
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={downloadPng}
              className="min-h-[44px] flex-1 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              ⬇️ Download PNG Image
            </button>
            <button
              type="button"
              onClick={downloadSvg}
              className="min-h-[44px] px-5 py-3 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              📄 Download Vector SVG
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Live Rendered Preview</h2>
            <span className="text-xs text-gray-500 font-mono">{width} × {height} px</span>
          </div>

          <div
            className="rounded-xl p-4 text-center min-h-[220px] flex items-center justify-center border border-gray-200 overflow-hidden"
            style={{
              background: 'repeating-conic-gradient(#e5e7eb 0% 25%, #f9fafb 0% 50%) 50% / 20px 20px',
            }}
          >
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto block rounded-lg shadow-sm"
            />
          </div>

          {/* Code Snippets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700">HTML &lt;img&gt; Tag</label>
                <button
                  type="button"
                  onClick={() => copyToClipboard(htmlCode, 'html')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  {copiedKey === 'html' ? '✓ Copied!' : 'Copy Code'}
                </button>
              </div>
              <textarea
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-800 font-mono h-20 resize-none outline-none focus:ring-2 focus:ring-indigo-500"
                readOnly
                value={htmlCode}
                onClick={(e) => e.target.select()}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700">Markdown Code</label>
                <button
                  type="button"
                  onClick={() => copyToClipboard(mdCode, 'md')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  {copiedKey === 'md' ? '✓ Copied!' : 'Copy Code'}
                </button>
              </div>
              <textarea
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-800 font-mono h-20 resize-none outline-none focus:ring-2 focus:ring-indigo-500"
                readOnly
                value={mdCode}
                onClick={(e) => e.target.select()}
              />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
