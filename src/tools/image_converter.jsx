import { useState, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const PRESETS = ['512x512', '800x600', '1024x768', '1920x1080']

export default function image_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const [file, setFile] = useState(null)
  const [img, setImg] = useState(null)
  const [width, setWidth] = useState(1024)
  const [height, setHeight] = useState(768)
  const [scale, setScale] = useState(100)
  const [lockAR, setLockAR] = useState(true)
  const [format, setFormat] = useState('image/png')
  const [quality, setQuality] = useState(0.92)
  const [outUrl, setOutUrl] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  const handleFile = useCallback(async (f) => {
    if (!f || !f.type.startsWith('image/')) return
    setFile(f)
    const url = URL.createObjectURL(f)
    const bitmap = await createImageBitmap(await (await fetch(url)).blob())
    URL.revokeObjectURL(url)
    setImg(bitmap)
    setWidth(bitmap.width); setHeight(bitmap.height); setScale(100)
    setOutUrl(null)
  }, [])

  const arRef = useRef(1)
  useEffect(() => { if (img) arRef.current = img.width / img.height }, [img])

  const onWidthChange = useCallback((v) => {
    setWidth(v)
    if (lockAR && arRef.current) setHeight(Math.round(v / arRef.current))
  }, [lockAR])

  const onHeightChange = useCallback((v) => {
    setHeight(v)
    if (lockAR && arRef.current) setWidth(Math.round(v * arRef.current))
  }, [lockAR])

  const onScaleChange = useCallback((v) => {
    setScale(v)
    if (img) {
      const s = v / 100
      setWidth(Math.round(img.width * s))
      setHeight(Math.round(img.height * s))
    }
  }, [img])

  const exportImage = useCallback(() => {
    if (!img) return
    const canvas = document.createElement('canvas')
    canvas.width = width; canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, width, height)
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      setOutUrl(url)
      jumpTo()
    }, format, quality)
  }, [img, width, height, format, quality, jumpTo])

  const download = useCallback(() => {
    if (!outUrl) return
    const ext = format.includes('png') ? 'png' : format.includes('webp') ? 'webp' : 'jpg'
    const a = document.createElement('a')
    a.href = outUrl; a.download = (file?.name?.replace(/\.[^.]+$/, '') || 'image') + '-converted.' + ext
    a.click()
  }, [outUrl, format, file])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Image Converter"
      desc="Resize, crop, and convert images to PNG, JPEG, or WEBP. All processing happens in your browser — no uploads."
      icon="🖼️" iconBg="rgba(99,102,241,0.08)"
      category="image" slug="image-converter"
      faq={[
        { q: 'Is this tool private?', a: 'Yes. All processing runs in your browser. No images are uploaded to any server.' },
        { q: 'What formats are supported?', a: 'Input: PNG, JPEG, WEBP. Output: PNG (lossless), JPEG (smaller), WEBP (modern, smallest).' },
      ]}
      howItWorks={[
        'Drag & drop an image or click to select a file.',
        'Adjust dimensions, scale, format, and quality.',
        'Click Export to process the image.',
        'Download the converted image.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Image Converter", "applicationCategory": "MultimediaApplication",
        "url": "https://www.uptools.in/image-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
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
              <div className="text-xs text-slate-500">{img?.width}×{img?.height} · {(file.size / 1024).toFixed(1)} KB</div>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-3 opacity-30">📁</div>
              <p className="text-sm text-slate-400 font-semibold">Drop image here or click to select</p>
            </>
          )}
        </div>

        {img && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left: Controls */}
            <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold text-white">📐 Resize</h3>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 w-12">Lock</label>
                <button onClick={() => setLockAR(!lockAR)}
                  className={`w-10 h-5 rounded-full transition-all ${lockAR ? 'bg-indigo-500' : 'bg-white/10'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform mx-0.5 ${lockAR ? 'translate-x-5' : ''}`} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Width (px)</label>
                  <input type="number" value={width} onChange={e => onWidthChange(parseInt(e.target.value) || 1)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Height (px)</label>
                  <input type="number" value={height} onChange={e => onHeightChange(parseInt(e.target.value) || 1)} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Scale: {scale}%</label>
                <input type="range" min="10" max="200" value={scale} onChange={e => onScaleChange(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-white/10 accent-indigo-500 cursor-pointer" />
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map(p => {
                  const [w, h] = p.split('x').map(Number)
                  return (
                    <button key={p} onClick={() => { setWidth(w); setHeight(h); setScale(Math.round((w / img.width) * 100)) }}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/8 text-[10px] font-bold text-slate-400 hover:text-white transition-all">
                      {p}
                    </button>
                  )
                })}
              </div>

              <h3 className="text-sm font-bold text-white pt-2">🎨 Format</h3>
              <select value={format} onChange={e => setFormat(e.target.value)}
                className={inputClass + ' text-xs'}>
                <option value="image/png" className="bg-[#0f172a]">PNG (lossless)</option>
                <option value="image/jpeg" className="bg-[#0f172a]">JPEG (smaller)</option>
                <option value="image/webp" className="bg-[#0f172a]">WEBP (modern)</option>
              </select>
              {format !== 'image/png' && (
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Quality: {Math.round(quality * 100)}%</label>
                  <input type="range" min="0.1" max="1" step="0.01" value={quality} onChange={e => setQuality(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none bg-white/10 accent-indigo-500 cursor-pointer" />
                </div>
              )}
            </div>

            {/* Right: Preview */}
            <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex flex-col items-center justify-center min-h-[300px]">
              {outUrl ? (
                <div className="text-center space-y-4">
                  <img src={outUrl} alt="Converted" className="max-w-full max-h-64 rounded-xl border border-white/10" />
                  <div className="text-xs text-slate-400">{width}×{height} · {format.split('/')[1].toUpperCase()}</div>
                  <button onClick={download}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all">
                    ⬇ Download
                  </button>
                </div>
              ) : (
                <div className="text-center text-slate-600 text-sm">Click Export to process</div>
              )}
            </div>
          </div>
        )}

        {/* Export Button */}
        {img && (
          <button onClick={exportImage}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200">
            🔄 Export Image
          </button>
        )}

        {!img && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🖼️</div>
            <p className="text-sm text-slate-600 font-medium">Upload an image to convert</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
