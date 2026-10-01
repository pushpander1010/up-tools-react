import { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
      default:
        break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

function kMeans(pixels, k = 8, maxIter = 30) {
  if (!pixels || pixels.length === 0) return []
  const count = Math.min(k, pixels.length)
  const step = Math.floor(pixels.length / count)
  let centroids = Array.from({ length: count }, (_, i) => [
    ...pixels[Math.min(i * step, pixels.length - 1)],
  ])

  for (let iter = 0; iter < maxIter; iter++) {
    const clusters = Array.from({ length: count }, () => [])
    for (const px of pixels) {
      let minDist = Infinity
      let minIdx = 0
      for (let j = 0; j < count; j++) {
        const dr = px[0] - centroids[j][0]
        const dg = px[1] - centroids[j][1]
        const db = px[2] - centroids[j][2]
        const dist = dr * dr + dg * dg + db * db
        if (dist < minDist) {
          minDist = dist
          minIdx = j
        }
      }
      clusters[minIdx].push(px)
    }

    let moved = false
    for (let j = 0; j < count; j++) {
      if (clusters[j].length === 0) continue
      const newC = [0, 0, 0]
      for (const px of clusters[j]) {
        newC[0] += px[0]
        newC[1] += px[1]
        newC[2] += px[2]
      }
      newC[0] = Math.round(newC[0] / clusters[j].length)
      newC[1] = Math.round(newC[1] / clusters[j].length)
      newC[2] = Math.round(newC[2] / clusters[j].length)
      if (
        newC[0] !== centroids[j][0] ||
        newC[1] !== centroids[j][1] ||
        newC[2] !== centroids[j][2]
      ) {
        moved = true
        centroids[j] = newC
      }
    }
    if (!moved) break
  }

  // Sort by luminance
  centroids.sort(
    (a, b) =>
      a[0] * 299 + a[1] * 587 + a[2] * 114 - (b[0] * 299 + b[1] * 587 + b[2] * 114)
  )

  return centroids.map(([r, g, b]) => ({
    r,
    g,
    b,
    hex: rgbToHex(r, g, b),
    hsl: rgbToHsl(r, g, b),
  }))
}

export default function color_palette_from_image() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [palette, setPalette] = useState([])
  const [preview, setPreview] = useState(null)
  const [numColors, setNumColors] = useState(8)
  const [copied, setCopied] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState("")

  const fileRef = useRef(null)
  const pixelsRef = useRef([])
  const previewUrlRef = useRef("")

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  const extractFromPixels = useCallback((pixels, count) => {
    if (!pixels || pixels.length === 0) return
    const colors = kMeans(pixels, count)
    setPalette(colors)
  }, [])

  const processImage = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    const url = URL.createObjectURL(file)
    previewUrlRef.current = url
    setPreview(url)
    setFileName(file.name.replace(/\.[^.]+$/, ''))

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const maxSize = 200
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
      canvas.width = Math.max(1, Math.round(img.width * scale))
      canvas.height = Math.max(1, Math.round(img.height * scale))
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      const pxs = []
      // Sample pixels skipping transparent pixels
      for (let i = 0; i < data.length; i += 16) {
        if (data[i + 3] > 64) {
          pxs.push([data[i], data[i + 1], data[i + 2]])
        }
      }
      pixelsRef.current = pxs
      extractFromPixels(pxs, numColors)
      jumpTo()
    }
    img.src = url
  }, [numColors, extractFromPixels, jumpTo])

  // Changing color count instantly updates palette!
  const handleNumColorsChange = (n) => {
    setNumColors(n)
    if (pixelsRef.current.length > 0) {
      extractFromPixels(pixelsRef.current, n)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) processImage(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processImage(file)
  }

  const copyColor = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 1500)
  }

  const copyAllHex = () => {
    const list = palette.map((c) => c.hex).join(', ')
    navigator.clipboard.writeText(list)
    setCopied('all')
    setTimeout(() => setCopied(null), 1500)
  }

  const downloadJson = () => {
    const data = JSON.stringify(
      palette.map((c) => ({
        hex: c.hex,
        rgb: `rgb(${c.r}, ${c.g}, ${c.b})`,
        hsl: `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`,
      })),
      null,
      2
    )
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName || 'palette'}-colors.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const downloadPngSwatch = () => {
    if (palette.length === 0) return
    const canvas = document.createElement('canvas')
    const sw = 160
    const sh = 180
    canvas.width = palette.length * sw
    canvas.height = sh
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    palette.forEach((c, i) => {
      // Swatch color block
      ctx.fillStyle = c.hex
      ctx.fillRect(i * sw, 0, sw, 120)

      // Text labels below
      ctx.fillStyle = '#0f172a'
      ctx.font = 'bold 15px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(c.hex.toUpperCase(), i * sw + sw / 2, 146)

      ctx.fillStyle = '#64748b'
      ctx.font = '12px system-ui, sans-serif'
      ctx.fillText(`${c.r}, ${c.g}, ${c.b}`, i * sw + sw / 2, 166)
    })

    const a = document.createElement('a')
    a.download = `${fileName || 'palette'}-swatch.png`
    a.href = canvas.toDataURL('image/png')
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <ToolLayout
      title="Color Palette from Image"
      desc="Color Palette from Image - extract a beautiful color palette from any image. Upload and get HEX,, online free. Free online, no sign-up. Works on any device."
      icon="🎨" iconBg="rgba(168,85,247,0.08)"
      category="design" slug="color-palette-from-image"
      faq={[
        { q: 'How does the color extraction work?', a: 'The tool uses K-means clustering on pixel data to find the dominant colors in an image. It samples pixels, groups them by color similarity, and returns the cluster centers as the palette.' },
        { q: 'What formats are supported?', a: 'All common image formats: PNG, JPG/JPEG, GIF, WebP, BMP, and more.' },
        { q: "How do I use this Color Palette from Image online free?", a: "Enter your input above, customize the options, and copy or save the result. Free with no sign-up." },
        { q: "How do I save my result?", a: "Click the copy or download button on your result to save it. Free with no sign-up." },
        { q: "Can I use it more than once?", a: "Yes, unlimited free use. Generate as many results as you need, on any device." },
        { q: "Is this Color Palette from Image free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        'Upload an image by clicking the upload area or drag-and-drop.',
        'Choose how many colors to extract (3–12).',
        'Click "Extract Colors" to generate the palette.',
        'Click any color to copy its value.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Color Palette from Image", "applicationCategory": "DesignApplication",
        "url": "https://www.uptools.in/color-palette-from-image/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileRef.current?.click()}
          className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 ${
            dragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/[0.15] bg-white/[0.02] hover:border-white/[0.25] hover:bg-white/[0.04]'
          }`}
        >
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <div className="text-4xl mb-2">🎨</div>
          <p className="text-sm font-semibold text-white mb-1">Drop image here or click to extract palette</p>
          <p className="text-xs text-slate-400">Supports PNG, JPG, GIF, WebP, BMP</p>
        </div>

        {/* Options */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Number of Colors:</label>
            <div className="flex gap-1.5">
              {[4, 6, 8, 10, 12].map((n) => {
                const isSelected = numColors === n
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleNumColorsChange(n)}
                    className={`min-w-[44px] min-h-[44px] rounded-xl text-xs font-bold transition-all duration-200 border flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 active:scale-95'
                        : 'bg-white/[0.04] text-slate-200 border-white/[0.1] hover:bg-white/[0.08] active:scale-95'
                    }`}
                  >
                    {isSelected && <span className="text-[11px]">✓</span>}
                    {n}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 hover:text-white text-xs font-semibold transition-colors"
          >
            Change Photo
          </button>
        </div>

        {/* Palette & Results */}
        {preview && palette.length > 0 && (
          <div ref={resultRef} className="space-y-4">
            {/* Color bar preview */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Dominant Color Spectrum</span>
                <span className="text-xs text-slate-400">Click any strip to copy HEX</span>
              </div>
              <div className="rounded-xl overflow-hidden h-16 flex border border-white/[0.1] shadow-inner">
                {palette.map((c, i) => (
                  <div
                    key={i}
                    className="flex-1 relative group cursor-pointer"
                    style={{ backgroundColor: c.hex }}
                    onClick={() => copyColor(c.hex, i)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white font-mono text-[10px] font-bold">
                      {copied === i ? '✓ Copied' : c.hex}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual color cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {palette.map((c, i) => (
                <div
                  key={i}
                  className="bg-white/[0.06] border border-white/[0.08] rounded-2xl overflow-hidden shadow-sm hover:border-white/[0.15] transition-colors flex flex-col"
                >
                  <button
                    type="button"
                    className="h-20 w-full relative cursor-pointer group outline-none"
                    style={{ backgroundColor: c.hex }}
                    onClick={() => copyColor(c.hex, i)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <span className="text-[11px] font-semibold bg-slate-900/90 text-white border border-white/[0.1] px-2 py-0.5 rounded-full shadow-sm">
                        {copied === i ? '✓ Copied' : 'Copy'}
                      </span>
                    </div>
                  </button>
                  <div className="p-3 space-y-1 bg-white/[0.02]">
                    <div className="text-xs font-bold text-white tracking-wider font-mono">{c.hex.toUpperCase()}</div>
                    <div className="text-[11px] text-slate-400 font-mono">RGB({c.r}, {c.g}, {c.b})</div>
                    <div className="text-[11px] text-slate-400 font-mono">HSL({c.hsl.h}°, {c.hsl.s}%, {c.hsl.l}%)</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Export Toolbar */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Export &amp; Share Palette</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={downloadPngSwatch}
                  className="glow-btn min-h-[44px] flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  💾 Download Image Swatch (PNG)
                </button>
                <button
                  type="button"
                  onClick={downloadJson}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 hover:text-white text-xs font-semibold transition-colors"
                >
                  📄 Save JSON
                </button>
                <button
                  type="button"
                  onClick={copyAllHex}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 hover:text-white text-xs font-semibold transition-colors"
                >
                  {copied === 'all' ? '✓ Copied HEX List!' : '📋 Copy All HEX'}
                </button>
              </div>
            </div>

            {/* CSS Variables */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">CSS Variables</h3>
                <button
                  type="button"
                  onClick={() => {
                    const css = ':root {\n' + palette.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n') + '\n}'
                    navigator.clipboard.writeText(css)
                    setCopied('css')
                    setTimeout(() => setCopied(null), 1500)
                  }}
                  className="min-h-[38px] text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {copied === 'css' ? '✓ Copied!' : '📋 Copy CSS'}
                </button>
              </div>
              <pre className="text-xs text-slate-300 font-mono bg-white/[0.03] border border-white/[0.08] rounded-xl p-3.5 overflow-x-auto whitespace-pre">
                {':root {\n' + palette.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n') + '\n}'}
              </pre>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!preview && (
          <div className="text-center py-12 rounded-2xl border border-white/[0.08] bg-white/[0.06]">
            <div className="text-4xl mb-2 opacity-40">🎨</div>
            <p className="text-sm text-slate-300 font-medium">Upload any photo or illustration to extract its colors</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
