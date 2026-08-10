import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import { formatBytes, postImage } from '../lib/imageBackend'

const SIZE_PRESETS = [
  { label: '100 KB', kb: 100 },
  { label: '200 KB', kb: 200 },
  { label: '500 KB', kb: 500 },
  { label: '1 MB', kb: 1000 },
  { label: '2 MB', kb: 2000 },
]

export default function image_compressor() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [originalUrl, setOriginalUrl] = useState('')
  const [compressedUrl, setCompressedUrl] = useState('')
  const [mode, setMode] = useState('target') // 'target' | 'quality'
  const [targetKb, setTargetKb] = useState(100)
  const [quality, setQuality] = useState(80)
  const [outputFormat, setOutputFormat] = useState('auto')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const compressedBlobRef = useRef(null)

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }
    setError('')
    setFile(f)
    setOriginalUrl(URL.createObjectURL(f))
    setCompressedUrl('')
    setStats(null)
    compressedBlobRef.current = null
  }, [])

  const compress = useCallback(async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const fields = { target_format: outputFormat }
      if (mode === 'target') fields.max_size_kb = targetKb
      else fields.quality = quality
      const out = await postImage('compress', file, fields)
      compressedBlobRef.current = out.blob
      setCompressedUrl(out.url)
      const saved = file.size - out.size
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
      setError(e.message || 'Compression failed. Please try again.')
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
    a.href = url; a.download = name
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setFile(null); setOriginalUrl(''); setCompressedUrl('')
    setStats(null); compressedBlobRef.current = null; setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const selectClass = "w-full bg-black/20 border-2 border-white/8 rounded-xl px-3 py-2.5 text-sm text-white outline-none [color-scheme:dark]"

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
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]) }}
          className={`p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${dragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/15 bg-white/[0.03] hover:border-white/25'}`}>
          <div className="text-3xl mb-2">📁</div>
          <div className="text-sm text-slate-300 font-medium">Click to select or drag &amp; drop an image</div>
          <div className="text-xs text-slate-600 mt-1">JPG, PNG, WebP, GIF, BMP, TIFF — up to 25MB</div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]) }} />
        </div>

        {/* Settings */}
        {file && (
          <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/8 space-y-4">
            {/* Mode toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setMode('target')}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all border ${mode === 'target' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-white/5 border-white/8 text-slate-400 hover:text-white'}`}>
                🎯 Target size
              </button>
              <button onClick={() => setMode('quality')}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all border ${mode === 'quality' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-white/5 border-white/8 text-slate-400 hover:text-white'}`}>
                🎚️ Manual quality
              </button>
            </div>

            {mode === 'target' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Compress to under</label>
                <div className="flex flex-wrap gap-2">
                  {SIZE_PRESETS.map(p => (
                    <button key={p.kb} onClick={() => setTargetKb(p.kb)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${targetKb === p.kb ? 'bg-indigo-500 text-white' : 'bg-white/5 border border-white/8 text-slate-300 hover:bg-white/10'}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-slate-500">Custom:</span>
                  <input type="number" min={10} value={targetKb} onChange={e => setTargetKb(parseInt(e.target.value) || 100)}
                    className="w-28 bg-black/20 border-2 border-white/8 rounded-xl px-3 py-1.5 text-sm text-white outline-none [color-scheme:dark]" />
                  <span className="text-xs text-slate-500">KB</span>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Quality: {quality}%</label>
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
            )}

            {/* Format */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Output Format</label>
              <select value={outputFormat} onChange={e => setOutputFormat(e.target.value)} className={selectClass}>
                <option className="bg-gray-900" value="auto">Auto (smallest)</option>
                <option className="bg-gray-900" value="webp">WebP</option>
                <option className="bg-gray-900" value="jpeg">JPEG</option>
                <option className="bg-gray-900" value="png">PNG</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={() => { compress(); jumpTo() }}
                disabled={loading}
                className="glow-btn px-5 py-2.5 rounded-xl text-sm flex-1 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {loading ? '⏳ Compressing...' : '🗜️ Compress Image'}
              </button>
              <button onClick={reset}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/8 text-slate-400 hover:text-white transition-all">
                🗑️ Reset
              </button>
            </div>

            {error && <div className="text-sm text-red-400 font-semibold">{error}</div>}
          </div>
        )}

        {/* Preview & Results */}
        {originalUrl && (
          <div ref={resultRef} className="p-5 rounded-2xl bg-white/[0.05] border border-white/8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xs font-semibold text-slate-400 mb-2">📄 Original</div>
                <img src={originalUrl} alt="Original" className="max-h-48 mx-auto rounded-lg" />
                <div className="text-xs text-slate-400 mt-1">{formatBytes(file.size)}</div>
              </div>
              {compressedUrl && (
                <div className="text-center">
                  <div className="text-xs font-semibold text-slate-400 mb-2">🗜️ Compressed</div>
                  <img src={compressedUrl} alt="Compressed" className="max-h-48 mx-auto rounded-lg" />
                  <div className="text-xs text-slate-400 mt-1">{formatBytes(stats?.compressedSize)}</div>
                </div>
              )}
            </div>

            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-black/20">
                  <div className="text-[10px] text-slate-400 uppercase">Original</div>
                  <div className="text-sm font-bold text-white">{formatBytes(stats.originalSize)}</div>
                </div>
                <div className="p-3 rounded-xl bg-black/20">
                  <div className="text-[10px] text-slate-400 uppercase">Compressed</div>
                  <div className="text-sm font-bold text-emerald-400">{formatBytes(stats.compressedSize)}</div>
                </div>
                <div className="p-3 rounded-xl bg-black/20">
                  <div className="text-[10px] text-slate-400 uppercase">Saved</div>
                  <div className="text-sm font-bold text-emerald-400">{formatBytes(stats.saved)}</div>
                </div>
                <div className="p-3 rounded-xl bg-black/20">
                  <div className="text-[10px] text-slate-400 uppercase">Reduction</div>
                  <div className="text-sm font-bold text-emerald-400">{stats.pct}%</div>
                </div>
              </div>
            )}

            {stats?.targetKb && (
              <div className="text-center text-xs text-emerald-400 font-semibold">
                ✓ Compressed to under {stats.targetKb} KB — {stats.format.split('/')[1].toUpperCase()}
                {stats.qualityUsed ? ` at quality ${stats.qualityUsed}%` : ''}
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
