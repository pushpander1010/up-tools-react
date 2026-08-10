import { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import { formatBytes, postImage } from '../lib/imageBackend'

export default function image_resizer() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [origW, setOrigW] = useState(0)
  const [origH, setOrigH] = useState(0)
  const [quality, setQuality] = useState(85)
  const [format, setFormat] = useState('auto')
  const [lockAspect, setLockAspect] = useState(true)
  const [aspectRatio, setAspectRatio] = useState(1)
  const [outputUrl, setOutputUrl] = useState('')
  const [outputInfo, setOutputInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const outputBlobRef = useRef(null)

  const loadImage = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }
    setError('')
    setFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    // Read dimensions locally for the aspect lock / defaults.
    const reader = new FileReader()
    reader.onload = (e) => {
      const image = new Image()
      image.onload = () => {
        setOrigW(image.width); setOrigH(image.height)
        setWidth(String(image.width)); setHeight(String(image.height))
        setAspectRatio(image.width / image.height)
        setOutputUrl(''); setOutputInfo('')
      }
      image.src = e.target.result
    }
    reader.readAsDataURL(file)
  }, [])

  const handleWidth = (v) => {
    setWidth(v)
    if (lockAspect && v && origW) setHeight(String(Math.round(parseInt(v) / aspectRatio)))
  }
  const handleHeight = (v) => {
    setHeight(v)
    if (lockAspect && v && origH) setWidth(String(Math.round(parseInt(v) * aspectRatio)))
  }

  const resize = useCallback(async () => {
    if (!file) return
    setLoading(true); setError('')
    try {
      const fields = {
        width: parseInt(width) || 0,
        height: parseInt(height) || 0,
        keep_aspect: lockAspect,
        output_format: format,
        quality,
      }
      const out = await postImage('resize', file, fields)
      outputBlobRef.current = out.blob
      setOutputUrl(out.url)
      setOutputInfo(`${out.width} × ${out.height} — ${formatBytes(out.size)}`)
    } catch (e) {
      setError(e.message || 'Resize failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [file, width, height, lockAspect, format, quality])

  const download = () => {
    const blob = outputBlobRef.current
    if (!blob) return
    const ext = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg'
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `resized.${ext}`
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  const clear = () => {
    setFile(null); setPreviewUrl(''); setWidth(''); setHeight('')
    setOutputUrl(''); setOutputInfo(''); outputBlobRef.current = null; setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const inputClass = "w-full bg-black/20 border-2 border-white/8 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

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
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) loadImage(e.dataTransfer.files[0]) }}
          className={`p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${dragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/15 bg-white/[0.03] hover:border-white/25'}`}>
          <div className="text-3xl mb-2">🖼️</div>
          <div className="text-sm text-slate-300 font-medium">Drop image here or click to select</div>
          <div className="text-xs text-slate-600 mt-1">JPG, PNG, WebP, GIF, BMP, TIFF</div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { if (e.target.files[0]) loadImage(e.target.files[0]) }} />
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="text-center">
            <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
            {origW > 0 && <div className="text-xs text-slate-500 mt-1">{origW} × {origH} px original</div>}
          </div>
        )}

        {/* Settings */}
        {file && (
          <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/8 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Width (px)</label>
                <input type="number" value={width} onChange={e => handleWidth(e.target.value)}
                  placeholder="800" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Height (px)</label>
                <input type="number" value={height} onChange={e => handleHeight(e.target.value)}
                  placeholder="600" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Quality (1-100)</label>
                <input type="number" value={quality} onChange={e => setQuality(parseInt(e.target.value) || 85)}
                  min={1} max={100} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Format</label>
                <select value={format} onChange={e => setFormat(e.target.value)}
                  className="w-full bg-black/20 border-2 border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none [color-scheme:dark]">
                  <option className="bg-gray-900" value="auto">Auto</option>
                  <option className="bg-gray-900" value="jpeg">JPEG</option>
                  <option className="bg-gray-900" value="png">PNG</option>
                  <option className="bg-gray-900" value="webp">WebP</option>
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

            {error && <div className="text-sm text-red-400 font-semibold">{error}</div>}
          </div>
        )}

        {/* Output */}
        {outputUrl && (
          <div ref={resultRef} className="p-5 rounded-2xl bg-white/[0.05] border border-white/8 text-center space-y-3"
            style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="text-xs font-semibold text-slate-400">Resized Image</div>
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
