import { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import { formatBytes, postImage } from '../lib/imageBackend'

const SIZE_PRESETS = [
  { label: '50 KB', kb: 50 },
  { label: '100 KB', kb: 100 },
  { label: '200 KB', kb: 200 },
  { label: '500 KB', kb: 500 },
  { label: '1 MB', kb: 1000 },
  { label: '2 MB', kb: 2000 },
]

async function clientCompress(file, { mode, targetKb, quality, format }) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const tempUrl = URL.createObjectURL(file)
    img.onload = async () => {
      URL.revokeObjectURL(tempUrl)
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      let mime = 'image/jpeg'
      if (format === 'webp') mime = 'image/webp'
      else if (format === 'png') mime = 'image/png'
      else if (format === 'auto') {
        mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      }

      if (mode === 'quality') {
        const q = quality / 100
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("Canvas compression failed"))
          resolve({
            blob,
            url: URL.createObjectURL(blob),
            width: img.width,
            height: img.height,
            size: blob.size,
            quality,
          })
        }, mime, q)
      } else {
        const targetBytes = targetKb * 1024
        let low = 0.05
        let high = 0.98
        let bestBlob = null
        let bestQuality = 80
        for (let step = 0; step < 6; step++) {
          const mid = (low + high) / 2
          const b = await new Promise((r) => canvas.toBlob(r, mime, mid))
          if (b) {
            bestBlob = b
            bestQuality = Math.round(mid * 100)
            if (b.size > targetBytes) high = mid
            else low = mid
          }
        }
        if (!bestBlob) return reject(new Error("Target compression failed"))
        resolve({
          blob: bestBlob,
          url: URL.createObjectURL(bestBlob),
          width: img.width,
          height: img.height,
          size: bestBlob.size,
          quality: bestQuality,
        })
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(tempUrl)
      reject(new Error("Failed to load image for compression"))
    }
    img.src = tempUrl
  })
}

export default function image_compressor() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [originalUrl, setOriginalUrl] = useState("")
  const [compressedUrl, setCompressedUrl] = useState("")
  const [mode, setMode] = useState('target') // 'target' | 'quality'
  const [targetKb, setTargetKb] = useState(100)
  const [quality, setQuality] = useState(80)
  const [outputFormat, setOutputFormat] = useState('auto')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [copied, setCopied] = useState(false)
  const [compareMode, setCompareMode] = useState('side') // 'side' | 'toggle'
  const [showOriginalInToggle, setShowOriginalInToggle] = useState(false)

  const compressedBlobRef = useRef(null)
  const originalUrlRef = useRef("")
  const compressedUrlRef = useRef("")

  // Keep refs in sync for clean revoking on unmount
  useEffect(() => {
    originalUrlRef.current = originalUrl
  }, [originalUrl])

  useEffect(() => {
    compressedUrlRef.current = compressedUrl
  }, [compressedUrl])

  // Revoke URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current)
      if (compressedUrlRef.current) URL.revokeObjectURL(compressedUrlRef.current)
    }
  }, [])

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) {
      setError("Please select a valid image file.")
      return
    }
    setError("")
    // Revoke old URLs
    if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current)
    if (compressedUrlRef.current) URL.revokeObjectURL(compressedUrlRef.current)

    const newUrl = URL.createObjectURL(f)
    setFile(f)
    setOriginalUrl(newUrl)
    setCompressedUrl("")
    setStats(null)
    compressedBlobRef.current = null
  }, [])

  const compress = useCallback(async () => {
    if (!file) return
    setLoading(true)
    setError("")

    if (compressedUrlRef.current) {
      URL.revokeObjectURL(compressedUrlRef.current)
      setCompressedUrl("")
    }

    try {
      let out
      try {
        const fields = { target_format: outputFormat }
        if (mode === 'target') fields.max_size_kb = targetKb
        else fields.quality = quality
        out = await postImage('compress', file, fields)
      } catch {
        // Graceful client-side fallback if backend server is unreachable
        out = await clientCompress(file, { mode, targetKb, quality, format: outputFormat })
      }

      compressedBlobRef.current = out.blob
      setCompressedUrl(out.url)
      const saved = Math.max(0, file.size - out.size)
      const pct = file.size > 0 ? ((saved / file.size) * 100).toFixed(1) : '0'
      setStats({
        originalSize: file.size,
        compressedSize: out.size,
        saved,
        pct,
        width: out.width,
        height: out.height,
        qualityUsed: out.quality,
        targetKb: mode === 'target' ? targetKb : null,
        format: out.blob.type,
      })
    } catch (e) {
      setError(e.message || "Compression failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [file, mode, targetKb, quality, outputFormat])

  const download = () => {
    const blob = compressedBlobRef.current
    if (!blob) return
    const ext = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg'
    const name = file ? file.name.replace(/\.[^.]+$/, '') + '_compressed.' + ext : 'compressed.' + ext
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
    const blob = compressedBlobRef.current
    if (!blob) return
    try {
      // Browsers generally support copying image/png to clipboard
      if (blob.type === 'image/png') {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        // Convert to png for clipboard support
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
      setError("Clipboard write not supported on this browser.")
    }
  }

  const reset = () => {
    if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current)
    if (compressedUrlRef.current) URL.revokeObjectURL(compressedUrlRef.current)
    setFile(null)
    setOriginalUrl("")
    setCompressedUrl("")
    setStats(null)
    compressedBlobRef.current = null
    setError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const inputClass = "w-full min-h-[44px] bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"

  return (
    <ToolLayout
      title="Image Compressor — Reduce File Size Online"
      desc="Compress JPG, PNG and WebP images online for free. Target an exact file size (100 KB, 500 KB, 1 MB) with automatic quality tuning, or set quality manually. No sign-up, files deleted after processing."
      icon="🗜️" iconBg="rgba(99,102,241,0.08)"
      category="image" slug="image-compressor"
      faq={[
        { q: 'How do I compress an image to 100 KB?', a: 'Choose the "Target size" mode and pick 100 KB. The tool automatically tunes the compression quality until your image is under that size.' },
        { q: 'Are my images uploaded to a server?', a: 'Your image is uploaded to our secure processing server, converted with Pillow, and the original is deleted immediately after. Nothing is stored or shared.' },
        { q: 'What image formats can I compress?', a: 'JPG, PNG, WebP, GIF, BMP and TIFF are supported. Output can be WebP (smallest), JPG, or PNG.' },
        { q: 'What is the best quality setting for photos?', a: 'For photos, 70-80% quality is a good balance. For graphics and logos, 80-90% keeps edges crisp.' },
        { q: 'Is it really free?', a: 'Yes. All image tools on UpTools are 100% free with no watermarks and no sign-up required.' },
      ]}
      howItWorks={[
        'Upload an image (JPG, PNG, WebP, GIF, BMP, TIFF).',
        'Pick target size (e.g. 100 KB) or set quality manually.',
        'Choose output format (WebP, JPG, PNG).',
        'Compress and download your optimized image.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Image Compressor",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "url": "https://www.uptools.in/image-compressor/",
        "description": "Free online image compressor that reduces JPG, PNG and WebP file sizes to a target size such as 100 KB.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
          }}
          className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-colors ${
            dragOver ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <div className="text-4xl mb-2">📁</div>
          <div className="text-sm text-gray-900 font-semibold">Click to select or drag &amp; drop an image</div>
          <div className="text-xs text-gray-500 mt-1">JPG, PNG, WebP, GIF, BMP, TIFF — up to 25MB</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
          />
        </div>

        {/* Settings */}
        {file && (
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="min-w-0">
                <div className="text-sm font-bold text-gray-900 truncate">{file.name}</div>
                <div className="text-xs text-gray-500">{formatBytes(file.size)}</div>
              </div>
              <button
                type="button"
                onClick={reset}
                className="min-h-[44px] px-3 py-2 text-xs font-semibold text-gray-600 hover:text-red-600 transition-colors"
              >
                Change File
              </button>
            </div>

            {/* Mode toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('target')}
                className={`min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
                  mode === 'target'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                🎯 Target Size (e.g. 100 KB)
              </button>
              <button
                type="button"
                onClick={() => setMode('quality')}
                className={`min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
                  mode === 'quality'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                🎚️ Manual Quality Slider
              </button>
            </div>

            {mode === 'target' ? (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-700">Target Maximum File Size</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {SIZE_PRESETS.map((p) => (
                    <button
                      key={p.kb}
                      type="button"
                      onClick={() => setTargetKb(p.kb)}
                      className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                        targetKb === p.kb
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
                  <span className="text-xs font-medium text-gray-600">Custom Target:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={10}
                      value={targetKb}
                      onChange={(e) => setTargetKb(parseInt(e.target.value, 10) || 10)}
                      className="w-28 min-h-[44px] bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-xs text-gray-500 font-semibold">KB</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-700">Quality</label>
                  <span className="text-xs font-bold text-indigo-600">{quality}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  {[50, 65, 80, 90].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuality(q)}
                      className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold border ${
                        quality === q
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {q}%
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Output Format */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Output Format</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className={inputClass}
              >
                <option value="auto">Auto (Smartest &amp; Smallest)</option>
                <option value="webp">WebP (Best Compression)</option>
                <option value="jpeg">JPEG (Maximum Compatibility)</option>
                <option value="png">PNG (Lossless / Transparency)</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => { compress(); jumpTo() }}
                disabled={loading}
                className="min-h-[44px] flex-1 px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? '⏳ Compressing...' : '🗜️ Compress Image'}
              </button>
              <button
                type="button"
                onClick={reset}
                className="min-h-[44px] px-5 py-3 rounded-xl text-sm font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Preview & Results */}
        {originalUrl && (
          <div ref={resultRef} className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
            {/* Compare controls if compressed */}
            {compressedUrl && (
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Preview &amp; Compare</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setCompareMode('side')}
                    className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      compareMode === 'side'
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Side by Side
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompareMode('toggle')}
                    className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      compareMode === 'toggle'
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Hold to Compare
                  </button>
                </div>
              </div>
            )}

            {/* Images display */}
            {compressedUrl && compareMode === 'toggle' ? (
              <div className="text-center space-y-2">
                <div className="relative inline-block max-w-full">
                  <img
                    src={showOriginalInToggle ? originalUrl : compressedUrl}
                    alt={showOriginalInToggle ? "Original" : "Compressed"}
                    className="max-h-72 max-w-full h-auto mx-auto rounded-xl border border-gray-200 object-contain"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-black/70 text-white text-xs font-medium">
                    {showOriginalInToggle ? "Original" : "Compressed"}
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    onMouseDown={() => setShowOriginalInToggle(true)}
                    onMouseUp={() => setShowOriginalInToggle(false)}
                    onTouchStart={() => setShowOriginalInToggle(true)}
                    onTouchEnd={() => setShowOriginalInToggle(false)}
                    className="min-h-[44px] px-4 py-2 rounded-xl border border-gray-300 bg-gray-50 text-xs font-semibold text-gray-700 select-none hover:bg-gray-100"
                  >
                    Press &amp; Hold to View Original
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="text-xs font-bold text-gray-700 mb-2">📄 Original Image</div>
                  <img
                    src={originalUrl}
                    alt="Original"
                    className="max-h-60 max-w-full h-auto mx-auto rounded-lg object-contain"
                  />
                  <div className="text-xs font-semibold text-gray-600 mt-2">{formatBytes(file.size)}</div>
                </div>
                {compressedUrl && (
                  <div className="text-center p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                    <div className="text-xs font-bold text-emerald-800 mb-2">🗜️ Compressed Result</div>
                    <img
                      src={compressedUrl}
                      alt="Compressed"
                      className="max-h-60 max-w-full h-auto mx-auto rounded-lg object-contain"
                    />
                    <div className="text-xs font-semibold text-emerald-700 mt-2">{formatBytes(stats?.compressedSize)}</div>
                  </div>
                )}
              </div>
            )}

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-2">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">Original</div>
                  <div className="text-sm font-bold text-gray-900 mt-0.5">{formatBytes(stats.originalSize)}</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-[10px] text-emerald-700 uppercase font-semibold">Compressed</div>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">{formatBytes(stats.compressedSize)}</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-[10px] text-emerald-700 uppercase font-semibold">Saved</div>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">{formatBytes(stats.saved)}</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-[10px] text-emerald-700 uppercase font-semibold">Reduction</div>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">-{stats.pct}%</div>
                </div>
              </div>
            )}

            {stats?.targetKb && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-800 font-semibold">
                ✓ Optimized to under {stats.targetKb} KB ({stats.format.replace('image/', '').toUpperCase()})
                {stats.qualityUsed ? ` at quality ${stats.qualityUsed}%` : ''}
              </div>
            )}

            {compressedUrl && (
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={download}
                  className="min-h-[44px] flex-1 px-6 py-3.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  💾 Download Compressed Image
                </button>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="min-h-[44px] px-5 py-3.5 rounded-xl text-sm font-semibold bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
