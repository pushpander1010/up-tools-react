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

export default function image_compressor() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [originalImg, setOriginalImg] = useState(null)
  const [originalUrl, setOriginalUrl] = useState('')
  const [compressedUrl, setCompressedUrl] = useState('')
  const [quality, setQuality] = useState(80)
  const [resizePercent, setResizePercent] = useState(1)
  const [outputFormat, setOutputFormat] = useState('image/jpeg')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const compressedBlobRef = useRef(null)

  const handleFile = useCallback((f) => {
    if (!f || !f.type.match(/image\/(jpeg|png|webp)/)) {
      alert('Please select a JPEG, PNG, or WebP image.')
      return
    }
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setOriginalImg(img)
        setOriginalUrl(e.target.result)
        setCompressedUrl('')
        setStats(null)
        compressedBlobRef.current = null
        if (f.type === 'image/png') setOutputFormat('image/png')
        else if (f.type === 'image/webp') setOutputFormat('image/webp')
        else setOutputFormat('image/jpeg')
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(f)
  }, [])

  const compress = useCallback(() => {
    if (!originalImg || !file) return
    setLoading(true)
    setTimeout(() => {
      try {
        const scale = resizePercent
        const newW = Math.round(originalImg.naturalWidth * scale)
        const newH = Math.round(originalImg.naturalHeight * scale)
        const canvas = document.createElement('canvas')
        canvas.width = newW; canvas.height = newH
        const ctx = canvas.getContext('2d')
        ctx.drawImage(originalImg, 0, 0, newW, newH)
        const q = quality / 100
        canvas.toBlob((blob) => {
          if (!blob) { setLoading(false); return }
          compressedBlobRef.current = blob
          const url = URL.createObjectURL(blob)
          setCompressedUrl(url)
          const saved = file.size - blob.size
          const pct = ((saved / file.size) * 100).toFixed(1)
          setStats({ originalSize: file.size, compressedSize: blob.size, saved, pct, width: newW, height: newH })
          setLoading(false)
        }, outputFormat, q)
      } catch { setLoading(false) }
    }, 50)
  }, [originalImg, file, quality, resizePercent, outputFormat])

  const download = () => {
    const blob = compressedBlobRef.current
    if (!blob) return
    const ext = outputFormat === 'image/jpeg' ? '.jpg' : outputFormat === 'image/png' ? '.png' : '.webp'
    const name = file ? file.name.replace(/\.[^.]+$/, '') + '_compressed' + ext : 'compressed' + ext
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = name
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setFile(null); setOriginalImg(null); setOriginalUrl(''); setCompressedUrl('')
    setStats(null); compressedBlobRef.current = null
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <ToolLayout
      title="Image Compressor"
      desc="Compress images instantly in your browser. Reduce JPEG, PNG, WebP file sizes without losing quality."
      icon="🖼️" iconBg="rgba(99,102,241,0.08)"
      category="image" slug="image-compressor"
      faq={[
        { q: 'What image formats are supported?', a: 'JPEG, PNG, and WebP images can be compressed.' },
        { q: 'Are my images uploaded to a server?', a: 'No. All compression happens in your browser using the Canvas API.' },
        { q: 'What quality setting should I use?', a: 'For photos, 70-80% quality usually provides a good balance. For graphics, 80-90% works well.' },
      ]}
      howItWorks={[
        'Click or drag & drop an image (JPEG, PNG, WebP).',
        'Adjust quality (10-100%) and resize options.',
        'Choose output format (JPEG, PNG, WebP).',
        'Click Compress and download the result.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Image Compressor", "applicationCategory": "MultimediaApplication",
        "url": "https://www.uptools.in/image-compressor/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]) }}
          className={`p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${dragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/15 bg-white/[0.03] hover:border-white/25'}`}>
          <div className="text-3xl mb-2">📁</div>
          <div className="text-sm text-slate-300 font-medium">Click to select or drag & drop an image</div>
          <div className="text-xs text-slate-600 mt-1">Supports JPEG, PNG, WebP — up to ~50MB</div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
            onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]) }} />
        </div>

        {/* Settings */}
        {originalImg && (
          <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/8 space-y-4">
            {/* Quality */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Quality: {quality}%</label>
              <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(parseInt(e.target.value))}
                className="w-full accent-indigo-500" />
              <div className="flex gap-2 mt-1.5">
                {[50, 65, 80, 90].map(q => (
                  <button key={q} onClick={() => setQuality(q)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${quality === q ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                    {q}%
                  </button>
                ))}
              </div>
            </div>

            {/* Resize & Format */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Resize</label>
                <select value={resizePercent} onChange={e => setResizePercent(parseFloat(e.target.value))}
                  className="w-full bg-black/20 border-2 border-white/8 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                  <option className="bg-gray-900" value={1}>Original (100%)</option>
                  <option className="bg-gray-900" value={0.75}>75%</option>
                  <option className="bg-gray-900" value={0.5}>50%</option>
                  <option className="bg-gray-900" value={0.25}>25%</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Output Format</label>
                <select value={outputFormat} onChange={e => setOutputFormat(e.target.value)}
                  className="w-full bg-black/20 border-2 border-white/8 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                  <option className="bg-gray-900" value="image/jpeg">JPEG</option>
                  <option className="bg-gray-900" value="image/png">PNG</option>
                  <option className="bg-gray-900" value="image/webp">WebP</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={() => { compress(); jumpTo() }}
                disabled={loading}
                className="glow-btn px-5 py-2.5 rounded-xl text-sm flex-1 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {loading ? '⏳ Compressing...' : '🗜️ Compress'}
              </button>
              <button onClick={reset}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/8 text-slate-400 hover:text-white transition-all">
                🗑️ Reset
              </button>
            </div>
          </div>
        )}

        {/* Preview & Results */}
        {originalUrl && (
          <div ref={resultRef} className="p-5 rounded-2xl bg-white/[0.05] border border-white/8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xs font-semibold text-slate-500 mb-2">📄 Original</div>
                <img src={originalUrl} alt="Original" className="max-h-48 mx-auto rounded-lg" />
                <div className="text-xs text-slate-500 mt-1">{originalImg?.naturalWidth} × {originalImg?.naturalHeight} px</div>
              </div>
              {compressedUrl && (
                <div className="text-center">
                  <div className="text-xs font-semibold text-slate-500 mb-2">🗜️ Compressed</div>
                  <img src={compressedUrl} alt="Compressed" className="max-h-48 mx-auto rounded-lg" />
                  <div className="text-xs text-slate-500 mt-1">{stats?.width} × {stats?.height} px</div>
                </div>
              )}
            </div>

            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-black/20">
                  <div className="text-[10px] text-slate-500 uppercase">Original</div>
                  <div className="text-sm font-bold text-white">{formatBytes(stats.originalSize)}</div>
                </div>
                <div className="p-3 rounded-xl bg-black/20">
                  <div className="text-[10px] text-slate-500 uppercase">Compressed</div>
                  <div className="text-sm font-bold text-emerald-400">{formatBytes(stats.compressedSize)}</div>
                </div>
                <div className="p-3 rounded-xl bg-black/20">
                  <div className="text-[10px] text-slate-500 uppercase">Saved</div>
                  <div className="text-sm font-bold text-emerald-400">{formatBytes(stats.saved)}</div>
                </div>
                <div className="p-3 rounded-xl bg-black/20">
                  <div className="text-[10px] text-slate-500 uppercase">Reduction</div>
                  <div className="text-sm font-bold text-emerald-400">{stats.pct}%</div>
                </div>
              </div>
            )}

            {compressedUrl && (
              <button onClick={download}
                className="glow-btn px-6 py-3 rounded-xl text-sm w-full"
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                💾 Download Compressed
              </button>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
