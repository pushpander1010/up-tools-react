import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function image_resizer() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const fileInputRef = useRef(null)
  const [img, setImg] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [quality, setQuality] = useState(85)
  const [format, setFormat] = useState('image/jpeg')
  const [lockAspect, setLockAspect] = useState(true)
  const [aspectRatio, setAspectRatio] = useState(1)
  const [outputUrl, setOutputUrl] = useState('')
  const [outputInfo, setOutputInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const outputBlobRef = useRef(null)

  const loadImage = useCallback((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const image = new Image()
      image.onload = () => {
        setImg(image)
        setWidth(String(image.width))
        setHeight(String(image.height))
        setAspectRatio(image.width / image.height)
        setPreviewUrl(e.target.result)
        setOutputUrl('')
        setOutputInfo('')
      }
      image.src = e.target.result
    }
    reader.readAsDataURL(file)
  }, [])

  const handleWidth = (v) => {
    setWidth(v)
    if (lockAspect && v && img) setHeight(String(Math.round(parseInt(v) / aspectRatio)))
  }
  const handleHeight = (v) => {
    setHeight(v)
    if (lockAspect && v && img) setWidth(String(Math.round(parseInt(v) * aspectRatio)))
  }

  const resize = useCallback(() => {
    if (!img) return
    setLoading(true)
    const canvas = document.createElement('canvas')
    canvas.width = parseInt(width) || img.width
    canvas.height = parseInt(height) || img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      outputBlobRef.current = blob
      setOutputUrl(url)
      setOutputInfo(`${canvas.width} × ${canvas.height} — ${formatBytes(blob.size)}`)
      setLoading(false)
    }, format, quality / 100)
  }, [img, width, height, quality, format])

  const download = () => {
    const blob = outputBlobRef.current
    if (!blob) return
    const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg'
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `resized.${ext}`
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  const clear = () => {
    setImg(null); setPreviewUrl(''); setWidth(''); setHeight('')
    setOutputUrl(''); setOutputInfo(''); outputBlobRef.current = null
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <ToolLayout
      title="Image Resizer"
      desc="Resize images instantly in your browser. Adjust width, height, quality, and format. JPG, PNG, WebP support."
      icon="🖼️" iconBg="rgba(99,102,241,0.08)"
      category="image" slug="image-resizer"
      faq={[
        { q: 'What formats are supported?', a: 'JPG, PNG, WebP, and GIF input. Output as JPEG, PNG, or WebP.' },
        { q: 'Is my data private?', a: 'Yes. All processing happens in your browser. Files are never uploaded.' },
        { q: 'Does it work on mobile?', a: 'Yes. All tools are mobile-responsive.' },
      ]}
      howItWorks={[
        'Upload or drag & drop an image.',
        'Set target width and height (lock aspect ratio optional).',
        'Choose quality and output format.',
        'Click Resize and download the result.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Image Resizer", "applicationCategory": "MultimediaApplication",
        "url": "https://www.uptools.in/image-resizer/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Upload */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) loadImage(e.dataTransfer.files[0]) }}
          className={`p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${dragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/15 bg-white/[0.03] hover:border-white/25'}`}>
          <div className="text-3xl mb-2">🖼️</div>
          <div className="text-sm text-slate-300 font-medium">Drop image here or click to select</div>
          <div className="text-xs text-slate-600 mt-1">Supports JPG, PNG, WebP, GIF</div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { if (e.target.files[0]) loadImage(e.target.files[0]) }} />
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="text-center">
            <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
          </div>
        )}

        {/* Settings */}
        {img && (
          <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/8 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Width (px)</label>
                <input type="number" value={width} onChange={e => handleWidth(e.target.value)}
                  placeholder="800"
                  className="w-full bg-black/20 border-2 border-white/8 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-indigo-500/40 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Height (px)</label>
                <input type="number" value={height} onChange={e => handleHeight(e.target.value)}
                  placeholder="600"
                  className="w-full bg-black/20 border-2 border-white/8 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-indigo-500/40 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Quality (1-100)</label>
                <input type="number" value={quality} onChange={e => setQuality(parseInt(e.target.value) || 85)}
                  min={1} max={100}
                  className="w-full bg-black/20 border-2 border-white/8 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-indigo-500/40 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Format</label>
                <select value={format} onChange={e => setFormat(e.target.value)}
                  className="w-full bg-black/20 border-2 border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                  <option className="bg-gray-900" value="image/jpeg">JPEG</option>
                  <option className="bg-gray-900" value="image/png">PNG</option>
                  <option className="bg-gray-900" value="image/webp">WebP</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none">
              <input type="checkbox" checked={lockAspect} onChange={e => setLockAspect(e.target.checked)}
                className="accent-indigo-500 w-4 h-4" />
              Lock aspect ratio
            </label>

            <div className="flex gap-2">
              <button onClick={() => { resize(); jumpTo() }}
                disabled={loading}
                className="glow-btn px-5 py-2.5 rounded-xl text-sm flex-1 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {loading ? '⏳ Resizing...' : '🔄 Resize Image'}
              </button>
              <button onClick={clear}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/8 text-slate-400 hover:text-white transition-all">
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Output */}
        {outputUrl && (
          <div ref={resultRef} className="p-5 rounded-2xl bg-white/[0.05] border border-white/8 text-center space-y-3"
            style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="text-xs font-semibold text-slate-500">Resized Image</div>
            <img src={outputUrl} alt="Resized" className="max-h-64 mx-auto rounded-lg" />
            <div className="text-xs text-slate-400">{outputInfo}</div>
            <button onClick={download}
              className="glow-btn px-6 py-3 rounded-xl text-sm w-full"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
              ⬇️ Download
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
