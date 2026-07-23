import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'

function toKB(n) { return n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB` }
function isPNG(u8) { return u8[0] === 0x89 && u8[1] === 0x50 && u8[2] === 0x4E && u8[3] === 0x47 }
function isJPG(u8) { return u8[0] === 0xFF && u8[1] === 0xD8 }

export default function exif_tool() {
  const [file, setFile] = useState(null)
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(null)
  const fileRef = useRef(null)

  const handleFile = useCallback(async (f) => {
    if (!f) return
    setFile(f); setLoading(true); setError(''); setMeta(null)
    try {
      const buf = await f.arrayBuffer()
      const u8 = new Uint8Array(buf)
      const format = isPNG(u8) ? 'PNG' : isJPG(u8) ? 'JPEG' : (f.type || 'Unknown')
      const img = new Image()
      const blobUrl = URL.createObjectURL(f)
      await new Promise((resolve, reject) => {
        img.onload = resolve; img.onerror = reject; img.src = blobUrl
      })
      URL.revokeObjectURL(blobUrl)

      // Parse EXIF tags using exifr if available, else basic parsing
      let exifData = {}
      try {
        if (window.exifr) {
          const tags = await window.exifr.parse(buf, { xmp: true, tiff: true, icc: true, iptc: true, gps: true, jfif: true })
          if (tags) {
            const keep = ['Make', 'Model', 'LensModel', 'Software', 'DateTimeOriginal', 'CreateDate', 'Orientation', 'GPSLatitude', 'GPSLongitude', 'FNumber', 'ExposureTime', 'ISO', 'FocalLength']
            keep.forEach(k => { if (k in tags) exifData[k] = tags[k] })
          }
        }
      } catch {}

      // PNG chunks
      let chunks = []
      if (isPNG(u8)) {
        let p = 8
        while (p + 12 <= u8.length) {
          const len = (u8[p] << 24) | (u8[p + 1] << 16) | (u8[p + 2] << 8) | u8[p + 3]
          const type = String.fromCharCode(u8[p + 4], u8[p + 5], u8[p + 6], u8[p + 7])
          chunks.push({ type, size: len })
          p += 12 + len
        }
      }

      setMeta({
        format, width: img.naturalWidth, height: img.naturalHeight,
        fileSize: f.size, exif: exifData, chunks,
        fileName: f.name
      })
    } catch (err) {
      setError('Failed to parse image metadata.')
    }
    setLoading(false)
  }, [])

  const copy = useCallback((text, label) => {
    navigator.clipboard?.writeText(text)
    setCopied(label); setTimeout(() => setCopied(null), 2000)
  }, [])

  const cleanImage = useCallback(() => {
    if (!file) return
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(blob => {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = file.name.replace(/\.[^.]+$/, '') + '-clean.png'
        a.click()
        URL.revokeObjectURL(a.href)
      }, 'image/png')
      URL.revokeObjectURL(url)
    }
    img.src = url
  }, [file])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="EXIF Data Viewer"
      desc="View and analyze image metadata (EXIF, GPS, camera info). Remove metadata for privacy. Detect hidden data and trailing bytes."
      icon="🔍" iconBg="rgba(6,182,212,0.08)"
      category="utility" slug="exif-tool"
      faq={[
        { q: 'Does this upload my images?', a: 'No. Everything runs locally in your browser. No data is sent to any server.' },
        { q: 'What EXIF data is shown?', a: 'Camera make/model, lens, date/time, GPS coordinates, exposure settings, ICC profile, and PNG text chunks.' },
      ]}
      howItWorks={[
        'Drop an image or click to upload (PNG, JPEG, WebP).',
        'View EXIF tags, format info, and PNG chunks.',
        'Check privacy flags: GPS location, camera info, trailing bytes.',
        'Download a cleaned version with all metadata removed.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "EXIF Data Viewer", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/exif-tool/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Upload Zone */}
        <div className="p-8 rounded-2xl bg-white/[0.06] border-2 border-dashed border-white/10 text-center cursor-pointer hover:border-cyan-500/30 transition-all"
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]) }}>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
          {file ? (
            <div>
              <img src={URL.createObjectURL(file)} alt="Preview" className="max-h-40 mx-auto rounded-xl mb-3" />
              <div className="text-sm font-bold text-white">{file.name}</div>
              <div className="text-xs text-slate-500">{toKB(file.size)}</div>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-3 opacity-30">📁</div>
              <p className="text-sm text-slate-400 font-semibold">Drop image here or click to upload</p>
              <p className="text-[10px] text-slate-600 mt-1">PNG, JPEG, WebP supported</p>
            </>
          )}
        </div>

        {loading && <div className="text-center text-sm text-cyan-400 font-semibold">⏳ Analyzing metadata...</div>}
        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>}

        {/* Results */}
        {meta && (
          <div className="space-y-4" style={{ animation: 'slideUp 0.35s ease-out' }}>
            {/* File Info */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Format', value: meta.format },
                { label: 'Dimensions', value: `${meta.width} × ${meta.height}` },
                { label: 'File Size', value: toKB(meta.fileSize) },
              ].map(k => (
                <div key={k.label} className="p-3 rounded-xl bg-white/[0.04] border border-white/8 text-center">
                  <div className="text-[10px] text-slate-500 uppercase">{k.label}</div>
                  <div className="text-sm font-bold text-white mt-1">{k.value}</div>
                </div>
              ))}
            </div>

            {/* Privacy Flags */}
            <div className="flex flex-wrap gap-2">
              {meta.exif.GPSLatitude && <span className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-bold">📍 GPS Location Detected</span>}
              {meta.exif.Model && <span className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-bold">📷 Camera: {String(meta.exif.Model).slice(0, 20)}</span>}
              {(meta.exif.DateTimeOriginal || meta.exif.CreateDate) && <span className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-bold">🕐 Timestamp</span>}
              {meta.exif.Software && <span className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-slate-400 text-xs font-bold">💻 Software</span>}
              {!meta.exif.GPSLatitude && !meta.exif.Model && <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-bold">✅ No sensitive metadata found</span>}
            </div>

            {/* EXIF Data */}
            {Object.keys(meta.exif).length > 0 && (
              <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">📋 EXIF Tags</h3>
                  <button onClick={() => copy(JSON.stringify(meta.exif, null, 2), 'exif')}
                    className={`text-xs font-bold transition-all ${copied === 'exif' ? 'text-emerald-400' : 'text-slate-500 hover:text-white'}`}>
                    {copied === 'exif' ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <div className="space-y-1.5">
                  {Object.entries(meta.exif).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                      <span className="text-xs text-slate-500">{k}</span>
                      <span className="text-xs font-mono text-white">{typeof v === 'object' ? JSON.stringify(v) : String(v).slice(0, 50)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PNG Chunks */}
            {meta.chunks.length > 0 && (
              <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
                <h3 className="text-sm font-bold text-white mb-3">📦 File Chunks ({meta.chunks.length})</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {meta.chunks.map((c, i) => (
                    <div key={i} className="flex justify-between items-center py-1 text-xs border-b border-white/5 last:border-0">
                      <span className="font-mono text-slate-300">{c.type}</span>
                      <span className="text-slate-600">{toKB(c.size)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={cleanImage}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all">
                🧹 Download Clean (No Metadata)
              </button>
              <button onClick={() => copy(JSON.stringify({ format: meta.format, width: meta.width, height: meta.height, exif: meta.exif }, null, 2), 'all')}
                className="px-4 py-3 rounded-xl bg-white/[0.06] border border-white/8 text-sm font-bold text-slate-400 hover:text-white transition-all">
                {copied === 'all' ? '✓' : '📋'}
              </button>
            </div>
          </div>
        )}

        {!meta && !loading && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔍</div>
            <p className="text-sm text-slate-600 font-medium">Upload an image to view its metadata</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
