import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function kMeans(pixels, k = 8, maxIter = 30) {
  // Initialize centroids from pixel sample
  const step = Math.floor(pixels.length / k)
  let centroids = Array.from({ length: k }, (_, i) => [...pixels[Math.min(i * step, pixels.length - 1)]])

  for (let iter = 0; iter < maxIter; iter++) {
    // Assign pixels to nearest centroid
    const clusters = Array.from({ length: k }, () => [])
    for (const px of pixels) {
      let minDist = Infinity, minIdx = 0
      for (let j = 0; j < k; j++) {
        const dr = px[0] - centroids[j][0]
        const dg = px[1] - centroids[j][1]
        const db = px[2] - centroids[j][2]
        const dist = dr * dr + dg * dg + db * db
        if (dist < minDist) { minDist = dist; minIdx = j }
      }
      clusters[minIdx].push(px)
    }
    // Update centroids
    let moved = false
    for (let j = 0; j < k; j++) {
      if (clusters[j].length === 0) continue
      const newC = [0, 0, 0]
      for (const px of clusters[j]) {
        newC[0] += px[0]; newC[1] += px[1]; newC[2] += px[2]
      }
      newC[0] = Math.round(newC[0] / clusters[j].length)
      newC[1] = Math.round(newC[1] / clusters[j].length)
      newC[2] = Math.round(newC[2] / clusters[j].length)
      if (newC[0] !== centroids[j][0] || newC[1] !== centroids[j][1] || newC[2] !== centroids[j][2]) {
        moved = true
        centroids[j] = newC
      }
    }
    if (!moved) break
  }

  // Sort by luminance for nice gradient
  centroids.sort((a, b) => (a[0] * 299 + a[1] * 587 + a[2] * 114) - (b[0] * 299 + b[1] * 587 + b[2] * 114))
  return centroids.map(([r, g, b]) => ({ r, g, b, hex: rgbToHex(r, g, b), hsl: rgbToHsl(r, g, b) }))
}

export default function color_palette_from_image() {
  const [palette, setPalette] = useState([])
  const [preview, setPreview] = useState(null)
  const [numColors, setNumColors] = useState(8)
  const [copied, setCopied] = useState(null)
  const canvasRef = useRef(null)
  const fileRef = useRef(null)

  const extractColors = useCallback((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setPreview(e.target.result)
        const canvas = document.createElement('canvas')
        const maxSize = 200
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        const pixels = []
        for (let i = 0; i < data.length; i += 16) { // sample every 4th pixel
          pixels.push([data[i], data[i + 1], data[i + 2]])
        }
        const colors = kMeans(pixels, numColors)
        setPalette(colors)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }, [numColors])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) extractColors(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) extractColors(file)
  }

  const copyColor = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 1200)
  }

  return (
    <ToolLayout
      title="Color Palette from Image"
      desc="Extract a beautiful color palette from any image. Upload and get HEX, RGB, and HSL values instantly."
      icon="🎨" iconBg="rgba(168,85,247,0.08)"
      category="design" slug="color-palette-from-image"
      faq={[
        { q: 'How does the color extraction work?', a: 'The tool uses K-means clustering on pixel data to find the dominant colors in an image. It samples pixels, groups them by color similarity, and returns the cluster centers as the palette.' },
        { q: 'What formats are supported?', a: 'All common image formats: PNG, JPG/JPEG, GIF, WebP, BMP, and more.' },
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
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Upload Area */}
        <div
          onDrop={handleDrop} onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="bg-white/[0.06] border-2 border-dashed border-white/[0.12] rounded-2xl p-8 text-center cursor-pointer hover:border-purple-500/30 hover:bg-purple-500/[0.03] transition-all duration-200"
        >
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <div className="text-5xl mb-3 opacity-40">🖼️</div>
          <p className="text-sm font-semibold text-slate-300 mb-1">Drop an image here or click to upload</p>
          <p className="text-xs text-slate-400">PNG, JPG, GIF, WebP — up to 10 MB</p>
        </div>

        {/* Options */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-300">Colors:</label>
            <div className="flex gap-1">
              {[4, 6, 8, 10, 12].map(n => (
                <button key={n} onClick={() => setNumColors(n)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all duration-200 ${numColors === n ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/30' : 'bg-white/[0.04] text-slate-400 hover:text-slate-300'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => fileRef.current?.click()}
            className="ml-auto px-5 py-2.5 rounded-xl bg-purple-500/20 text-purple-400 text-sm font-bold hover:bg-purple-500/30 transition-all duration-200">
            Upload Image
          </button>
        </div>

        {/* Preview + Palette */}
        {preview && palette.length > 0 && (
          <div className="space-y-5">
            {/* Color bar preview */}
            <div className="rounded-2xl overflow-hidden h-20 flex border border-white/[0.08]">
              {palette.map((c, i) => (
                <div key={i} className="flex-1 relative group cursor-pointer" style={{ backgroundColor: c.hex }}
                  onClick={() => copyColor(c.hex, i)}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <span className="text-[10px] font-bold text-white drop-shadow-lg">{copied[i] ? 'Copied!' : c.hex}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Color cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {palette.map((c, i) => (
                <div key={i} className="bg-white/[0.06] border border-white/[0.08] rounded-xl overflow-hidden group hover:scale-[1.02] transition-all duration-200">
                  <div className="h-20 w-full relative cursor-pointer" style={{ backgroundColor: c.hex }}
                    onClick={() => copyColor(c.hex, i)}>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-bold bg-black/40 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {copied === i ? '✓ Copied' : 'Click to copy'}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <div className="text-xs font-bold text-white uppercase tracking-wider">{c.hex}</div>
                    <div className="text-[10px] text-slate-400 font-mono">RGB({c.r}, {c.g}, {c.b})</div>
                    <div className="text-[10px] text-slate-400 font-mono">HSL({c.hsl.h}°, {c.hsl.s}%, {c.hsl.l}%)</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CSS Variables */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-300">CSS Variables</h3>
                <button onClick={() => {
                  const css = ':root {\n' + palette.map((c, i) => `  --palette-${i + 1}: ${c.hex};`).join('\n') + '\n}'
                  navigator.clipboard.writeText(css)
                  setCopied('css')
                  setTimeout(() => setCopied(null), 1200)
                }} className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors">
                  {copied === 'css' ? '✓ Copied!' : '📋 Copy CSS'}
                </button>
              </div>
              <pre className="text-[11px] text-slate-400 font-mono bg-black/20 rounded-xl p-3 overflow-x-auto whitespace-pre">
                {':root {\n' + palette.map((c, i) => `  --palette-${i + 1}: ${c.hex};`).join('\n') + '\n}'}
              </pre>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!preview && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎨</div>
            <p className="text-sm text-slate-600 font-medium">Upload an image to extract its color palette</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
