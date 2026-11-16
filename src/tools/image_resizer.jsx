import { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import { formatBytes, postImage } from '../lib/imageBackend'

const FORMAT_EXT = { jpeg: 'jpg', png: 'png', webp: 'webp' }

// Resolve the real output format from the user choice + the source file.
function resolveFormat(choice, file) {
  if (choice === 'jpeg' || choice === 'png' || choice === 'webp') return choice
  const t = (file?.type || '').toLowerCase()
  if (t.includes('png')) return 'png'
  if (t.includes('webp')) return 'webp'
  if (t.includes('gif')) return 'png'
  return 'jpeg'
}

function mimeFor(fmt) {
  return fmt === 'png' ? 'image/png' : fmt === 'webp' ? 'image/webp' : 'image/jpeg'
}

function loadBitmap(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const u = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(u)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(u)
      reject(new Error('Failed to load image'))
    }
    img.src = u
  })
}

function canvasToBlob(canvas, mime, q) {
  return new Promise((resolve) => {
    // PNG/WebP-PNG lossless: quality is ignored by canvas for PNG
    if (mime === 'image/png') canvas.toBlob((b) => resolve(b), mime)
    else canvas.toBlob((b) => resolve(b), mime, q)
  })
}

function drawScaled(canvas, img, w, h, mime) {
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (mime === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)
  }
  ctx.drawImage(img, 0, 0, w, h)
}

// Exact dimensions, honouring the chosen format.
async function clientResize(file, { width, height, format, quality }) {
  const img = await loadBitmap(file)
  const mime = mimeFor(format)
  const canvas = document.createElement('canvas')
  drawScaled(canvas, img, width, height, mime)
  const blob = await canvasToBlob(canvas, mime, quality / 100)
  if (!blob) throw new Error('Canvas resize failed')
  if (format === 'webp' && blob.type !== 'image/webp') {
    throw new Error('This browser cannot encode WebP — pick JPEG or PNG.')
  }
  return { blob, url: URL.createObjectURL(blob), width, height, size: blob.size }
}

// Fit under targetKB while honouring the chosen format.
// JPEG/WebP: binary-search quality, then step dimensions down.
// PNG: step dimensions down only (lossless, quality does not apply).
async function clientFitToSize(file, { width, height, format, targetKB }) {
  const target = Math.max(1024, Math.round(targetKB * 1024))
  const img = await loadBitmap(file)
  const mime = mimeFor(format)
  const lossless = format === 'png'
  const baseW = width || img.width
  const baseH = height || img.height
  const canvas = document.createElement('canvas')
  let smallest = null
  let scale = 1
  for (let step = 0; step < 10; step++) {
    const tw = Math.max(1, Math.round(baseW * scale))
    const th = Math.max(1, Math.round(baseH * scale))
    drawScaled(canvas, img, tw, th, mime)
    if (lossless) {
      const blob = await canvasToBlob(canvas, mime)
      if (!blob) throw new Error('Canvas resize failed')
      if (!smallest || blob.size < smallest.blob.size) smallest = { blob, w: tw, h: th, q: 0 }
      if (blob.size <= target) {
        return { blob, url: URL.createObjectURL(blob), width: tw, height: th, size: blob.size, quality: 0, mime, overshoot: false }
      }
    } else {
      let low = 5
      let high = 92
      let best = null
      while (low <= high) {
        const mid = Math.floor((low + high) / 2)
        const blob = await canvasToBlob(canvas, mime, mid / 100)
        if (!blob) break
        if (!smallest || blob.size < smallest.blob.size) smallest = { blob, w: tw, h: th, q: mid }
        if (blob.size <= target) {
          best = { blob, q: mid }
          low = mid + 1
        } else {
          high = mid - 1
        }
      }
      if (best) {
        return { blob: best.blob, url: URL.createObjectURL(best.blob), width: tw, height: th, size: best.blob.size, quality: best.q, mime, overshoot: false }
      }
    }
    scale *= 0.85
  }
  return {
    blob: smallest.blob,
    url: URL.createObjectURL(smallest.blob),
    width: smallest.w,
    height: smallest.h,
    size: smallest.blob.size,
    quality: smallest.q,
    mime,
    overshoot: true,
  }
}

export default function image_resizer() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [origW, setOrigW] = useState(0)
  const [origH, setOrigH] = useState(0)
  const [aspectRatio, setAspectRatio] = useState(1)
  const [lockAspect, setLockAspect] = useState(true)
  const [format, setFormat] = useState('auto')
  const [quality, setQuality] = useState(85)
  const [targetKB, setTargetKB] = useState('')
  const [preset, setPreset] = useState('custom')
  const [outputUrl, setOutputUrl] = useState('')
  const [outputExt, setOutputExt] = useState('jpg')
  const [outputInfo, setOutputInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [copied, setCopied] = useState(false)

  const outputBlobRef = useRef(null)
  const previewUrlRef = useRef('')
  const outputUrlRef = useRef('')

  useEffect(() => { previewUrlRef.current = previewUrl }, [previewUrl])
  useEffect(() => { outputUrlRef.current = outputUrl }, [outputUrl])

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
      if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current)
    }
  }, [])

  const resetOutput = () => {
    if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current)
    outputBlobRef.current = null
    setOutputUrl('')
    setOutputInfo('')
    setCopied(false)
  }

  const loadImage = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }
    setError('')
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    resetOutput()

    setFile(f)
    const newPreview = URL.createObjectURL(f)
    setPreviewUrl(newPreview)
    setPreset('custom')

    const img = new Image()
    img.onload = () => {
      setOrigW(img.width)
      setOrigH(img.height)
      setWidth(String(img.width))
      setHeight(String(img.height))
      setAspectRatio(img.width / img.height || 1)
    }
    img.src = newPreview
  }, [])

  const handleWidth = (v) => {
    setWidth(v)
    setPreset('custom')
    const num = parseInt(v, 10)
    if (lockAspect && !isNaN(num) && num > 0 && aspectRatio > 0) {
      setHeight(String(Math.round(num / aspectRatio)))
    }
  }

  const handleHeight = (v) => {
    setHeight(v)
    setPreset('custom')
    const num = parseInt(v, 10)
    if (lockAspect && !isNaN(num) && num > 0 && aspectRatio > 0) {
      setWidth(String(Math.round(num * aspectRatio)))
    }
  }

  const applyPreset = (key) => {
    setPreset(key)
    if (key === 'custom' || !origW || !origH) return
    const table = {
      p25: [Math.round(origW * 0.25), Math.round(origH * 0.25)],
      p50: [Math.round(origW * 0.5), Math.round(origH * 0.5)],
      p75: [Math.round(origW * 0.75), Math.round(origH * 0.75)],
      hd: [1280, 720],
      fhd: [1920, 1080],
      square: [1080, 1080],
      social: [1200, 630],
    }
    const dims = table[key]
    if (!dims) return
    setWidth(String(dims[0]))
    setHeight(String(dims[1]))
  }

  const resize = useCallback(async () => {
    if (!file) return
    const targetW = parseInt(width, 10)
    const targetH = parseInt(height, 10)
    if (!targetW || targetW <= 0 || !targetH || targetH <= 0) {
      setError('Please enter a valid width and height.')
      return
    }
    const fmt = resolveFormat(format, file)
    const mime = mimeFor(fmt)
    const kb = parseFloat(targetKB)
    const useTargetSize = !isNaN(kb) && kb > 0

    setLoading(true)
    setError('')
    resetOutput()

    try {
      let out
      if (useTargetSize) {
        out = await clientFitToSize(file, { width: targetW, height: targetH, format: fmt, targetKB: kb })
        let note = ''
        if (out.overshoot) note = ` · closest possible (${kb} KB unreachable at these dimensions)`
        outputBlobRef.current = out.blob
        setOutputUrl(out.url)
        setOutputExt(FORMAT_EXT[fmt] || 'jpg')
        setOutputInfo(
          `${out.width} × ${out.height} px · ${formatBytes(out.size)} · ${fmt.toUpperCase()}` +
          (fmt === 'png' ? '' : ` · quality ${out.quality}%`) + note
        )
      } else {
        try {
          out = await postImage('resize', file, {
            width: targetW,
            height: targetH,
            keep_aspect: lockAspect,
            output_format: fmt,
            quality,
          })
        } catch {
          out = await clientResize(file, { width: targetW, height: targetH, format: fmt, quality })
        }
        // Server may still hand back its own default; trust the blob over the request
        const got = (out.blob.type || '').includes('png') ? 'png'
          : (out.blob.type || '').includes('webp') ? 'webp'
            : (out.blob.type || '').includes('jpeg') ? 'jpeg' : fmt
        outputBlobRef.current = out.blob
        setOutputUrl(out.url)
        setOutputExt(FORMAT_EXT[got] || 'jpg')
        setOutputInfo(`${out.width || targetW} × ${out.height || targetH} px · ${formatBytes(out.size)} · ${got.toUpperCase()}`)
      }
    } catch (e) {
      setError(e.message || 'Resize failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [file, width, height, lockAspect, format, quality, targetKB])

  const download = () => {
    const blob = outputBlobRef.current
    if (!blob) return
    const ext = outputExt || 'jpg'
    const base = file ? file.name.replace(/\.[^.]+$/, '') : 'image'
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${base}_${width}x${height}.${ext}`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    const blob = outputBlobRef.current
    if (!blob) return
    try {
      let pngBlob = blob
      if (blob.type !== 'image/png') {
        const img = await loadBitmap(blob)
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        canvas.getContext('2d').drawImage(img, 0, 0)
        pngBlob = await canvasToBlob(canvas, 'image/png')
      }
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Clipboard copy is not supported in this browser.')
    }
  }

  const clear = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    resetOutput()
    setFile(null)
    setPreviewUrl('')
    setWidth('')
    setHeight('')
    setOrigW(0)
    setOrigH(0)
    setPreset('custom')
    setTargetKB('')
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const inputClass = 'w-full min-h-[44px] bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-indigo-500/50 transition-colors'
  const labelClass = 'block text-xs font-semibold text-slate-300 mb-1'
  const effFormat = file ? resolveFormat(format, file) : 'jpeg'
  const showsQuality = effFormat !== 'png'

  return (
    <ToolLayout
      title="Image Resizer — Resize Images Online Free"
      desc="Resize JPG, PNG and WebP images to exact pixel dimensions and download in the format you choose."
      icon="📐" iconBg="rgba(99,102,241,0.08)"
      category="image" slug="image-resizer"
      faq={[
        { q: 'What formats are supported?', a: 'JPG, PNG, WebP, GIF, BMP and TIFF input. Output as JPEG, PNG, or WebP — the format you pick is the format you download.' },
        { q: 'Can I resize to a specific size like 1920x1080?', a: 'Yes. Enter the exact width and height in pixels, or lock the aspect ratio and set one dimension.' },
        { q: 'Can I shrink an image to a target KB size?', a: 'Yes. Enter a max file size in KB in Advanced and the resizer auto-tunes quality and dimensions to fit under it, keeping your chosen output format.' },
        { q: 'Are my images private?', a: 'Most resizing happens right in your browser. If the server is used for an uncommon format, the file is deleted immediately after processing.' },
        { q: 'Is image resizing free?', a: 'Yes, all UpTools image tools are free with no watermarks and no sign-up.' },
      ]}
      howItWorks={[
        'Upload or drag & drop an image.',
        'Set the width and height, or pick a quick size.',
        'Choose the output format and quality.',
        'Resize and download the result.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Image Resizer", "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "url": "https://www.uptools.in/image-resizer/",
        "description": "Free online image resizer. Resize images to exact pixel dimensions in JPG, PNG or WebP.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Upload */}
        {!file && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              if (e.dataTransfer.files?.[0]) loadImage(e.dataTransfer.files[0])
            }}
            className={`p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-colors ${
              dragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/[0.15] bg-white/[0.02] hover:border-white/[0.25]'
            }`}
          >
            <div className="text-4xl mb-2">🖼️</div>
            <div className="text-sm text-white font-semibold">Drop image here or click to select</div>
            <div className="text-xs text-slate-400 mt-1">JPG, PNG, WebP, GIF, BMP, TIFF</div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) loadImage(e.target.files[0]) }}
        />

        {/* Settings */}
        {file && (
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate">{file.name}</div>
                <div className="text-xs text-slate-400 font-mono">{origW} × {origH} px · {formatBytes(file.size)}</div>
              </div>
              <button
                type="button"
                onClick={clear}
                className="min-h-[40px] px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] transition-colors shrink-0"
              >
                Change
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Width (px)</label>
                <input type="number" inputMode="numeric" value={width} onChange={(e) => handleWidth(e.target.value)} placeholder="1920" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Height (px)</label>
                <input type="number" inputMode="numeric" value={height} onChange={(e) => handleHeight(e.target.value)} placeholder="1080" className={inputClass} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer select-none">
                <input type="checkbox" checked={lockAspect} onChange={(e) => setLockAspect(e.target.checked)} className="w-4 h-4 accent-indigo-500 rounded" />
                Keep aspect ratio
              </label>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-slate-400">Quick size</span>
                <select
                  value={preset}
                  onChange={(e) => applyPreset(e.target.value)}
                  className="min-h-[40px] bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500/50"
                >
                  <option className="bg-slate-900" value="custom">Custom</option>
                  <option className="bg-slate-900" value="p25">25% ({Math.round(origW * 0.25)}×{Math.round(origH * 0.25)})</option>
                  <option className="bg-slate-900" value="p50">50% ({Math.round(origW * 0.5)}×{Math.round(origH * 0.5)})</option>
                  <option className="bg-slate-900" value="p75">75% ({Math.round(origW * 0.75)}×{Math.round(origH * 0.75)})</option>
                  <option className="bg-slate-900" value="hd">HD 1280×720</option>
                  <option className="bg-slate-900" value="fhd">Full HD 1920×1080</option>
                  <option className="bg-slate-900" value="square">Square 1080×1080</option>
                  <option className="bg-slate-900" value="social">Social 1200×630</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Output format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className={inputClass}
                >
                  <option className="bg-slate-900" value="auto">Auto ({effFormat.toUpperCase()})</option>
                  <option className="bg-slate-900" value="jpeg">JPEG (.jpg)</option>
                  <option className="bg-slate-900" value="png">PNG (.png)</option>
                  <option className="bg-slate-900" value="webp">WebP (.webp)</option>
                </select>
              </div>
              {showsQuality && (
                <div>
                  <label className={labelClass}>Quality — {quality}%</label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={1}
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                    className="w-full h-11 accent-indigo-500"
                  />
                </div>
              )}
            </div>

            <details className="rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-3">
              <summary className="text-xs font-semibold text-slate-300 cursor-pointer">Advanced — fit under a file size (KB)</summary>
              <div className="pt-3">
                <input
                  type="number"
                  inputMode="numeric"
                  value={targetKB}
                  onChange={(e) => setTargetKB(e.target.value)}
                  placeholder="e.g. 100"
                  min={1}
                  className={inputClass}
                />
                <div className="text-xs text-slate-400 mt-2">
                  Auto-tunes quality and size to fit under this limit, in {effFormat.toUpperCase()}.
                </div>
              </div>
            </details>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => { resize(); jumpTo() }}
                disabled={loading}
                className="glow-btn min-h-[44px] flex-1 py-3 text-sm font-bold disabled:opacity-50"
              >
                {loading ? '⏳ Resizing...' : '🔄 Resize Image'}
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-300">{error}</div>
            )}
          </div>
        )}

        {/* Result */}
        {outputUrl && (
          <div ref={resultRef} className="p-5 sm:p-6 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-center space-y-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-xs font-bold text-emerald-300">✓ Resized</div>
              <div className="text-xs text-emerald-400 font-semibold font-mono mt-1">{outputInfo}</div>
            </div>
            <img src={outputUrl} alt="Resized" className="max-h-72 max-w-full h-auto mx-auto rounded-xl border border-white/[0.1] object-contain bg-black/30" />
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={download} className="glow-btn min-h-[44px] flex-1 py-3 text-sm font-bold">
                ⬇️ Download .{outputExt}
              </button>
              <button
                type="button"
                onClick={copyToClipboard}
                className="min-h-[44px] px-5 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] transition-colors"
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
