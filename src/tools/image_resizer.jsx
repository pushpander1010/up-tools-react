import { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import { formatBytes, postImage } from '../lib/imageBackend'

const PERCENT_PRESETS = [25, 50, 75, 150, 200]
const SIZE_PRESETS = [
  { label: 'Full HD (1920×1080)', w: 1920, h: 1080 },
  { label: 'HD (1280×720)', w: 1280, h: 720 },
  { label: 'Square (1080×1080)', w: 1080, h: 1080 },
  { label: 'Social Share (1200×630)', w: 1200, h: 630 },
]

async function clientResize(file, { width, height, format, quality }) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const tempUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(tempUrl)
      const targetW = width || img.width
      const targetH = height || img.height
      const canvas = document.createElement('canvas')
      canvas.width = targetW
      canvas.height = targetH
      const ctx = canvas.getContext('2d')
      if (format === 'jpeg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, targetW, targetH)
      }
      ctx.drawImage(img, 0, 0, targetW, targetH)
      let mime = 'image/jpeg'
      if (format === 'png') mime = 'image/png'
      else if (format === 'webp') mime = 'image/webp'
      else if (format === 'auto') {
        mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      }
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Canvas resize failed"))
          resolve({
            blob,
            url: URL.createObjectURL(blob),
            width: targetW,
            height: targetH,
            size: blob.size,
          })
        },
        mime,
        quality / 100
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(tempUrl)
      reject(new Error("Failed to load image for resize"))
    }
    img.src = tempUrl
  })
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
      reject(new Error("Failed to load image"))
    }
    img.src = u
  })
}

function canvasToBlob(canvas, mime, q) {
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), mime, q)
  })
}

// Shrink output to fit under targetKB: binary-search quality, then step down
// dimensions if even minimum quality does not fit. Always uses lossy encoding.
async function clientFitToSize(file, { width, height, format, targetKB }) {
  const target = Math.max(1024, Math.round(targetKB * 1024))
  const img = await loadBitmap(file)
  const mime = format === "webp" ? "image/webp" : "image/jpeg"
  const baseW = width || img.width
  const baseH = height || img.height
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  let smallest = null
  let scale = 1
  for (let step = 0; step < 8; step++) {
    const tw = Math.max(1, Math.round(baseW * scale))
    const th = Math.max(1, Math.round(baseH * scale))
    canvas.width = tw
    canvas.height = th
    if (mime === "image/jpeg") {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, tw, th)
    }
    ctx.drawImage(img, 0, 0, tw, th)
    let low = 5
    let high = 92
    let best = null
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const blob = await canvasToBlob(canvas, mime, mid / 100)
      if (!blob) break
      if (!smallest || blob.size < smallest.blob.size) {
        smallest = { blob, w: tw, h: th, q: mid }
      }
      if (blob.size <= target) {
        best = { blob, q: mid }
        low = mid + 1
      } else {
        high = mid - 1
      }
    }
    if (best) {
      return {
        blob: best.blob,
        url: URL.createObjectURL(best.blob),
        width: tw,
        height: th,
        size: best.blob.size,
        quality: best.q,
        mime,
        overshoot: false,
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
  const [previewUrl, setPreviewUrl] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [origW, setOrigW] = useState(0)
  const [origH, setOrigH] = useState(0)
  const [quality, setQuality] = useState(85)
  const [targetKB, setTargetKB] = useState("")
  const [format, setFormat] = useState('auto')
  const [lockAspect, setLockAspect] = useState(true)
  const [aspectRatio, setAspectRatio] = useState(1)
  const [outputUrl, setOutputUrl] = useState("")
  const [outputInfo, setOutputInfo] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [copied, setCopied] = useState(false)
  const [appliedFeedback, setAppliedFeedback] = useState("")

  const outputBlobRef = useRef(null)
  const previewUrlRef = useRef("")
  const outputUrlRef = useRef("")

  useEffect(() => {
    previewUrlRef.current = previewUrl
  }, [previewUrl])

  useEffect(() => {
    outputUrlRef.current = outputUrl
  }, [outputUrl])

  // Revoke URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
      if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current)
    }
  }, [])

  const loadImage = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) {
      setError("Please select a valid image file.")
      return
    }
    setError("")
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current)

    setFile(f)
    const newPreview = URL.createObjectURL(f)
    setPreviewUrl(newPreview)

    const img = new Image()
    img.onload = () => {
      setOrigW(img.width)
      setOrigH(img.height)
      setWidth(String(img.width))
      setHeight(String(img.height))
      setAspectRatio(img.width / img.height)
      setOutputUrl("")
      setOutputInfo("")
      setAppliedFeedback("")
      outputBlobRef.current = null
    }
    img.src = newPreview
  }, [])

  const handleWidth = (v) => {
    setWidth(v)
    setAppliedFeedback("")
    const num = parseInt(v, 10)
    if (lockAspect && !isNaN(num) && num > 0 && aspectRatio > 0) {
      setHeight(String(Math.round(num / aspectRatio)))
    }
  }

  const handleHeight = (v) => {
    setHeight(v)
    setAppliedFeedback("")
    const num = parseInt(v, 10)
    if (lockAspect && !isNaN(num) && num > 0 && aspectRatio > 0) {
      setWidth(String(Math.round(num * aspectRatio)))
    }
  }

  const applyPercent = (pct) => {
    if (!origW || !origH) return
    const w = Math.round((origW * pct) / 100)
    const h = Math.round((origH * pct) / 100)
    setWidth(String(w))
    setHeight(String(h))
    setAppliedFeedback(`${pct}% scale (${w} × ${h} px)`)
  }

  const applyPresetSize = (w, h, label) => {
    setWidth(String(w))
    setHeight(String(h))
    setAppliedFeedback(`${label} (${w} × ${h} px)`)
  }

  const resize = useCallback(async () => {
    if (!file) return
    const targetW = parseInt(width, 10)
    const targetH = parseInt(height, 10)
    if (!targetW || targetW <= 0 || !targetH || targetH <= 0) {
      setError("Please enter valid width and height dimensions.")
      return
    }
    const kb = parseFloat(targetKB)
    const useTargetSize = !isNaN(kb) && kb > 0

    setLoading(true)
    setError("")

    if (outputUrlRef.current) {
      URL.revokeObjectURL(outputUrlRef.current)
      setOutputUrl("")
    }

    try {
      let out
      if (useTargetSize) {
        out = await clientFitToSize(file, { width: targetW, height: targetH, format, targetKB: kb })
        let note = ""
        if (out.mime === "image/jpeg" && (format === "png" || (format === "auto" && file.type === "image/png"))) {
          note = " · PNG switched to JPEG to hit KB target"
        }
        if (out.overshoot) {
          note += ` · closest possible (target ${kb} KB unreachable at these dimensions)`
        }
        outputBlobRef.current = out.blob
        setOutputUrl(out.url)
        setOutputInfo(`${out.width} × ${out.height} px · ${formatBytes(out.size)} · quality ${out.quality}%${note}`)
      } else {
        try {
          const fields = {
            width: targetW,
            height: targetH,
            keep_aspect: lockAspect,
            output_format: format,
            quality,
          }
          out = await postImage('resize', file, fields)
        } catch {
          // Fallback to client canvas resize
          out = await clientResize(file, { width: targetW, height: targetH, format, quality })
        }

        outputBlobRef.current = out.blob
        setOutputUrl(out.url)
        setOutputInfo(`${out.width} × ${out.height} px · ${formatBytes(out.size)}`)
      }
    } catch (e) {
      setError(e.message || "Resize failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [file, width, height, lockAspect, format, quality, targetKB])

  const download = () => {
    const blob = outputBlobRef.current
    if (!blob) return
    const ext = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg'
    const name = file ? file.name.replace(/\.[^.]+$/, '') + `_${width}x${height}.${ext}` : `resized.${ext}`
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    const blob = outputBlobRef.current
    if (!blob) return
    try {
      if (blob.type === 'image/png') {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        const img = new Image()
        const u = URL.createObjectURL(blob)
        img.onload = () => {
          URL.revokeObjectURL(u)
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          canvas.getContext('2d').drawImage(img, 0, 0)
          canvas.toBlob(async (pngBlob) => {
            if (pngBlob) {
              await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })])
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }
          }, 'image/png')
        }
        img.src = u
      }
    } catch {
      setError("Clipboard copy is not supported in this browser.")
    }
  }

  const clear = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current)
    setFile(null)
    setPreviewUrl("")
    setWidth("")
    setHeight("")
    setOrigW(0)
    setOrigH(0)
    setOutputUrl("")
    setOutputInfo("")
    setAppliedFeedback("")
    outputBlobRef.current = null
    setError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const inputClass = "w-full min-h-[44px] bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-indigo-500/50 transition-colors"

  return (
    <ToolLayout
      title="Image Resizer — Resize Images Online Free"
      desc="Resize JPG, PNG, WebP and GIF images online for free. Set exact width and height in pixels, keep the aspect ratio, and export to JPG, PNG or WebP. No upload history, no sign-up."
      icon="📐" iconBg="rgba(99,102,241,0.08)"
      category="image" slug="image-resizer"
      faq={[
        { q: 'What formats are supported?', a: 'JPG, PNG, WebP, GIF, BMP and TIFF input. Output as JPEG, PNG, or WebP.' },
        { q: 'Can I resize to a specific size like 1920x1080?', a: 'Yes. Enter the exact width and height in pixels, or lock the aspect ratio and set one dimension.' },
        { q: "Can I shrink an image to a target KB size?", a: "Yes. Enter a max file size in KB and the resizer auto-tunes quality (and dimensions if needed) to fit under it. KB mode exports JPEG or WebP." },
        { q: 'Are my images private?', a: 'Your image is uploaded to our secure processing server, resized, and deleted immediately. Nothing is stored.' },
        { q: 'Is image resizing free?', a: 'Yes, all UpTools image tools are free with no watermarks and no sign-up.' },
        { q: "How do I use this Image Resizer — Resize Images Online Free online free?", a: "Enter your input above, customize the options, and copy or save the result. Free with no sign-up." },
        { q: "How do I save my result?", a: "Click the copy or download button on your result to save it. Free with no sign-up." },
      ]}
      howItWorks={[
        'Upload or drag & drop an image.',
        'Set target width and height (lock aspect ratio optional).',
        'Choose quality and output format.',
        'Optional: set a max file size in KB to auto-fit the output.',
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
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Upload */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            if (e.dataTransfer.files?.[0]) loadImage(e.dataTransfer.files[0])
          }}
          className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 ${
            dragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/[0.15] bg-white/[0.02] hover:border-white/[0.25] hover:bg-white/[0.04]'
          }`}
        >
          <div className="text-4xl mb-2">🖼️</div>
          <div className="text-sm text-white font-semibold">Drop image here or click to select</div>
          <div className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WebP, GIF, BMP, TIFF</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) loadImage(e.target.files[0]) }}
          />
        </div>

        {/* Settings */}
        {file && (
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.06] border border-white/[0.08] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate">{file.name}</div>
                <div className="text-xs text-slate-400 font-mono">Original: {origW} × {origH} px · {formatBytes(file.size)}</div>
              </div>
              <button
                type="button"
                onClick={clear}
                className="min-h-[44px] px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors"
              >
                Change File
              </button>
            </div>

            {/* Scale % presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300">Quick Scale Presets</label>
                {origW > 0 && (
                  <span className="text-xs text-slate-400">Original: {origW}×{origH}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {PERCENT_PRESETS.map((p) => {
                  const isPctSelected = origW > 0 && Math.round((origW * p) / 100) === parseInt(width, 10) && Math.round((origH * p) / 100) === parseInt(height, 10)
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => applyPercent(p)}
                      className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border flex items-center justify-center gap-1 ${
                        isPctSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 active:scale-95 animate-[pulse_0.4s_ease-in-out_1]'
                          : 'bg-white/[0.04] text-slate-200 border-white/[0.1] hover:bg-white/[0.08] active:scale-95'
                      }`}
                    >
                      {isPctSelected && <span className="text-[11px]">✓</span>}
                      {p}%
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Dimension presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300">Standard Dimensions</label>
                {width && height && (
                  <span className="text-xs font-mono text-slate-400">{width} × {height} px</span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SIZE_PRESETS.map((s) => {
                  const isSelected = String(width) === String(s.w) && String(height) === String(s.h)
                  return (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => applyPresetSize(s.w, s.h, s.label)}
                      className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border text-left flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 active:scale-95 animate-[pulse_0.4s_ease-in-out_1]'
                          : 'bg-white/[0.04] text-slate-200 border-white/[0.1] hover:bg-white/[0.08] active:scale-95'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        {isSelected && <span className="font-bold text-white">✓</span>}
                        {s.label}
                      </span>
                      <span className={`text-[11px] font-mono shrink-0 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {s.w}×{s.h}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Inline confirmation showing applied dimensions */}
              {appliedFeedback && (
                <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                  <span>✓</span>
                  <span>Applied dimensions: <strong className="text-white font-mono">{appliedFeedback}</strong></span>
                </div>
              )}
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidth(e.target.value)}
                  placeholder="e.g. 1920"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeight(e.target.value)}
                  placeholder="e.g. 1080"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Output Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className={inputClass}
                >
                  <option className="bg-slate-900 text-white" value="auto">Auto (Same as Original)</option>
                  <option className="bg-slate-900 text-white" value="jpeg">JPEG (.jpg)</option>
                  <option className="bg-slate-900 text-white" value="png">PNG (.png)</option>
                  <option className="bg-slate-900 text-white" value="webp">WebP (.webp)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Quality ({quality}%)</label>
                <input
                  type="number"
                  value={quality}
                  onChange={(e) => setQuality(Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 85)))}
                  min={1}
                  max={100}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Max Size (KB, optional)</label>
                <input
                  type="number"
                  value={targetKB}
                  onChange={(e) => setTargetKB(e.target.value)}
                  placeholder="e.g. 100"
                  min={1}
                  className={inputClass}
                />
              </div>
            </div>

            {targetKB && !isNaN(parseFloat(targetKB)) && parseFloat(targetKB) > 0 && (
              <div className="text-xs text-slate-400">KB mode: quality auto-tunes to fit under {targetKB} KB (exports JPEG or WebP).</div>
            )}

            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none py-1">
              <input
                type="checkbox"
                checked={lockAspect}
                onChange={(e) => setLockAspect(e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded"
              />
              <span className="font-medium">Maintain aspect ratio</span>
            </label>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => { resize(); jumpTo() }}
                disabled={loading}
                className="glow-btn min-h-[44px] flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? '⏳ Resizing...' : '🔄 Resize Image'}
              </button>
              <button
                type="button"
                onClick={clear}
                className="min-h-[44px] px-5 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] transition-colors"
              >
                Clear
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-300">
                {error}
              </div>
            )}

            {/* Preview of Original */}
            {previewUrl && (
              <div className="pt-2 text-center">
                <div className="text-xs font-semibold text-slate-400 mb-2">Original Preview</div>
                <img
                  src={previewUrl}
                  alt="Original"
                  className="max-h-56 max-w-full h-auto mx-auto rounded-xl border border-white/[0.1] object-contain bg-black/30"
                />
              </div>
            )}
          </div>
        )}

        {/* Output */}
        {outputUrl && (
          <div ref={resultRef} className="p-5 sm:p-6 rounded-2xl bg-white/[0.06] border border-white/[0.08] shadow-sm text-center space-y-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-xs font-bold text-emerald-300">✓ Resized Successfully</div>
              <div className="text-xs text-emerald-400 font-semibold font-mono mt-1">{outputInfo}</div>
            </div>

            <img
              src={outputUrl}
              alt="Resized"
              className="max-h-72 max-w-full h-auto mx-auto rounded-xl border border-white/[0.1] object-contain bg-black/30"
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={download}
                className="glow-btn min-h-[44px] flex-1 py-3.5 text-sm font-bold flex items-center justify-center gap-2"
              >
                ⬇️ Download Resized Image
              </button>
              <button
                type="button"
                onClick={copyToClipboard}
                className="min-h-[44px] px-5 py-3.5 rounded-xl text-sm font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/[0.1] transition-colors flex items-center justify-center gap-2"
              >
                {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
