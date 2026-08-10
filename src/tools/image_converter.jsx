import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import { formatBytes, postImage } from '../lib/imageBackend'

const FORMATS = [
  { value: 'jpeg', label: 'JPEG (.jpg)', mime: 'image/jpeg' },
  { value: 'png', label: 'PNG (.png)', mime: 'image/png' },
  { value: 'webp', label: 'WebP (.webp)', mime: 'image/webp' },
  { value: 'gif', label: 'GIF (.gif)', mime: 'image/gif' },
  { value: 'bmp', label: 'BMP (.bmp)', mime: 'image/bmp' },
  { value: 'tiff', label: 'TIFF (.tiff)', mime: 'image/tiff' },
]

export default function image_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const fileRef = useRef(null)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [format, setFormat] = useState('png')
  const [quality, setQuality] = useState(90)
  const [outUrl, setOutUrl] = useState(null)
  const [outSize, setOutSize] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const outBlobRef = useRef(null)

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }
    setError('')
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setOutUrl(null); setOutSize(0)
  }, [])

  const convert = useCallback(async () => {
    if (!file) return
    setLoading(true); setError('')
    try {
      const out = await postImage('convert', file, { target_format: format, quality })
      outBlobRef.current = out.blob
      setOutUrl(out.url)
      setOutSize(out.size)
    } catch (e) {
      setError(e.message || 'Conversion failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [file, format, quality])

  const download = useCallback(() => {
    if (!outBlobRef.current) return
    const ext = format
    const url = URL.createObjectURL(outBlobRef.current)
    const a = document.createElement('a')
    a.href = url; a.download = (file?.name?.replace(/\.[^.]+$/, '') || 'image') + '-converted.' + ext
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }, [format, file])

  const selectClass = "w-full bg-black/20 border-2 border-white/8 rounded-xl px-3 py-2.5 text-sm text-white outline-none [color-scheme:dark]"

  return (
    <ToolLayout
      title="Image Converter — Convert JPG, PNG, WebP Online"
      desc="Convert images between JPG, PNG, WebP, GIF, BMP and TIFF for free. Preserve transparency with PNG, shrink photos with WebP or JPG. No sign-up, files deleted after conversion."
      icon="🔄" iconBg="rgba(99,102,241,0.08)"
      category="image" slug="image-converter"
      faq={[
        { q: 'How do I convert JPG to PNG?', a: 'Upload your JPG and choose PNG as the output format, then click Convert. PNG preserves transparency and is lossless.' },
        { q: 'What formats are supported?', a: 'Input: JPG, PNG, WebP, GIF, BMP, TIFF. Output: JPG, PNG, WebP, GIF, BMP, TIFF.' },
        { q: 'Is this tool private?', a: 'Your image is uploaded to our secure processing server, converted, and deleted immediately. Nothing is stored.' },
        { q: 'Which format is smallest?', a: 'WebP is generally the smallest for photos, followed by JPG. PNG is best when you need transparency or lossless quality.' },
        { q: 'Is image conversion free?', a: 'Yes, all UpTools image tools are free with no watermarks and no sign-up.' },
      ]}
      howItWorks={[
        'Drag & drop an image or click to select a file.',
        'Choose your output format (JPG, PNG, WebP, GIF, BMP, TIFF).',
        'Adjust quality for lossy formats.',
        'Convert and download your image.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Image Converter", "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "url": "https://www.uptools.in/image-converter/",
        "description": "Free online image converter for JPG, PNG, WebP, GIF, BMP and TIFF.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Upload */}
        <div className={`p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${dragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/[0.04] hover:border-white/15'}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]) }}>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
          {file ? (
            <div>
              <div className="text-sm font-bold text-white">{file.name}</div>
              <div className="text-xs text-slate-400">{formatBytes(file.size)}</div>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-3 opacity-30">📁</div>
              <p className="text-sm text-slate-400 font-semibold">Drop image here or click to select</p>
            </>
          )}
        </div>

        {file && (
          <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Convert to</label>
              <select value={format} onChange={e => setFormat(e.target.value)} className={selectClass}>
                {FORMATS.map(f => (
                  <option key={f.value} value={f.value} className="bg-gray-900">{f.label}</option>
                ))}
              </select>
            </div>

            {format !== 'png' && format !== 'gif' && format !== 'bmp' && format !== 'tiff' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Quality: {quality}%</label>
                <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(parseInt(e.target.value))}
                  className="w-full accent-indigo-500" />
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => { convert(); jumpTo() }}
                disabled={loading}
                className="glow-btn px-5 py-2.5 rounded-xl text-sm flex-1 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {loading ? '⏳ Converting...' : '🔄 Convert Image'}
              </button>
            </div>

            {error && <div className="text-sm text-red-400 font-semibold">{error}</div>}

            {/* Preview */}
            {previewUrl && (
              <div className="text-center pt-2">
                <img src={previewUrl} alt="Original" className="max-h-48 mx-auto rounded-lg border border-white/10" />
              </div>
            )}
          </div>
        )}

        {/* Output */}
        {outUrl && (
          <div ref={resultRef} className="p-5 rounded-2xl bg-white/[0.05] border border-white/8 text-center space-y-3"
            style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="text-xs font-semibold text-slate-400">
              Converted — {FORMATS.find(f => f.value === format)?.label} · {formatBytes(outSize)}
            </div>
            <img src={outUrl} alt="Converted" className="max-h-64 mx-auto rounded-lg border border-white/10" />
            <button onClick={download}
              className="glow-btn px-6 py-3 rounded-xl text-sm w-full"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
              ⬇️ Download
            </button>
          </div>
        )}

        {!file && (
          <div className="text-center py-10 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🖼️</div>
            <p className="text-sm text-slate-600 font-medium">Upload an image to convert</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
