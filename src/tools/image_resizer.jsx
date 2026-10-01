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
  const [format, setFormat] = useState('auto')
  const [lockAspect, setLockAspect] = useState(true)
  const [aspectRatio, setAspectRatio] = useState(1)
  const [outputUrl, setOutputUrl] = useState("")
  const [outputInfo, setOutputInfo] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [copied, setCopied] = useState(false)

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
      outputBlobRef.current = null
    }
    img.src = newPreview
  }, [])

  const handleWidth = (v) => {
    setWidth(v)
    const num = parseInt(v, 10)
    if (lockAspect && !isNaN(num) && num > 0 && aspectRatio > 0) {
      setHeight(String(Math.round(num / aspectRatio)))
    }
  }

  const handleHeight = (v) => {
    setHeight(v)
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
  }

  const applyPresetSize = (w, h) => {
    setWidth(String(w))
    setHeight(String(h))
  }

  const resize = useCallback(async () => {
    if (!file) return
    const targetW = parseInt(width, 10)
    const targetH = parseInt(height, 10)
    if (!targetW || targetW <= 0 || !targetH || targetH <= 0) {
      setError("Please enter valid width and height dimensions.")
      return
    }

    setLoading(true)
    setError("")

    if (outputUrlRef.current) {
      URL.revokeObjectURL(outputUrlRef.current)
      setOutputUrl("")
    }

    try {
      let out
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
    } catch (e) {
      setError(e.message || "Resize failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [file, width, height, lockAspect, format, quality])

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
    outputBlobRef.current = null
    setError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const inputClass = "w-full min-h-[44px] bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 font-mono outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"

  return (
    <ToolLayout
      title="Image Resizer — Resize Images Online Free"
      desc="Resize JPG, PNG, WebP and GIF images online for free. Set exact width and height in pixels, keep the aspect ratio, and export to JPG, PNG or WebP. No upload history, no sign-up."
      icon="📐" iconBg="rgba(99,102,241,0.08)"
      category="image" slug="image-resizer"
      faq={[
        { q: 'What formats are supported?', a: 'JPG, PNG, WebP, GIF, BMP and TIFF input. Output as JPEG, PNG, or WebP.' },
        { q: 'Can I resize to a specific size like 1920x1080?', a: 'Yes. Enter the exact width and height in pixels, or lock the aspect ratio and set one dimension.' },
        { q: 'Are my images private?', a: 'Your image is uploaded to our secure processing server, resized, and deleted immediately. Nothing is stored.' },
        { q: 'Is image resizing free?', a: 'Yes, all UpTools image tools are free with no watermarks and no sign-up.' },
        { q: "How do I use this Image Resizer — Resize Images Online Free online free?", a: "Enter your input above, customize the options, and copy or save the result. Free with no sign-up." },
        { q: "How do I save my result?", a: "Click the copy or download button on your result to save it. Free with no sign-up." },
      ]}
      howItWorks={[
        'Upload or drag & drop an image.',
        'Set target width and height (lock aspect ratio optional).',
        'Choose quality and output format.',
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
          className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-colors ${
            dragOver ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <div className="text-4xl mb-2">🖼️</div>
          <div className="text-sm text-gray-900 font-semibold">Drop image here or click to select</div>
          <div className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WebP, GIF, BMP, TIFF</div>
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
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="min-w-0">
                <div className="text-sm font-bold text-gray-900 truncate">{file.name}</div>
                <div className="text-xs text-gray-500">Original: {origW} × {origH} px · {formatBytes(file.size)}</div>
              </div>
              <button
                type="button"
                onClick={clear}
                className="min-h-[44px] px-3 py-2 text-xs font-semibold text-gray-600 hover:text-red-600 transition-colors"
              >
                Change File
              </button>
            </div>

            {/* Scale % presets */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Quick Scale Presets</label>
              <div className="flex flex-wrap gap-2">
                {PERCENT_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => applyPercent(p)}
                    className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>

            {/* Dimension presets */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Standard Dimensions</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SIZE_PRESETS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => applyPresetSize(s.w, s.h)}
                    className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-left transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidth(e.target.value)}
                  placeholder="e.g. 1920"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeight(e.target.value)}
                  placeholder="e.g. 1080"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Output Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full min-h-[44px] bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="auto">Auto (Same as Original)</option>
                  <option value="jpeg">JPEG (.jpg)</option>
                  <option value="png">PNG (.png)</option>
                  <option value="webp">WebP (.webp)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Quality ({quality}%)</label>
                <input
                  type="number"
                  value={quality}
                  onChange={(e) => setQuality(Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 85)))}
                  min={1}
                  max={100}
                  className={inputClass}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none py-1">
              <input
                type="checkbox"
                checked={lockAspect}
                onChange={(e) => setLockAspect(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
              <span className="font-medium">Maintain aspect ratio</span>
            </label>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => { resize(); jumpTo() }}
                disabled={loading}
                className="min-h-[44px] flex-1 px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? '⏳ Resizing...' : '🔄 Resize Image'}
              </button>
              <button
                type="button"
                onClick={clear}
                className="min-h-[44px] px-5 py-3 rounded-xl text-sm font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                {error}
              </div>
            )}

            {/* Preview of Original */}
            {previewUrl && (
              <div className="pt-2 text-center">
                <div className="text-xs font-semibold text-gray-600 mb-2">Original Preview</div>
                <img
                  src={previewUrl}
                  alt="Original"
                  className="max-h-56 max-w-full h-auto mx-auto rounded-xl border border-gray-200 object-contain"
                />
              </div>
            )}
          </div>
        )}

        {/* Output */}
        {outputUrl && (
          <div ref={resultRef} className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm text-center space-y-4">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-800">✓ Resized Successfully</div>
              <div className="text-xs text-emerald-700 font-semibold mt-1">{outputInfo}</div>
            </div>

            <img
              src={outputUrl}
              alt="Resized"
              className="max-h-72 max-w-full h-auto mx-auto rounded-xl border border-gray-200 object-contain"
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={download}
                className="min-h-[44px] flex-1 px-6 py-3.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                ⬇️ Download Resized Image
              </button>
              <button
                type="button"
                onClick={copyToClipboard}
                className="min-h-[44px] px-5 py-3.5 rounded-xl text-sm font-semibold bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
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
