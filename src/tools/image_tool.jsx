import { useState, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

// Reusable filter profiles.
const PRESETS = {
  none: { label: 'None', brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, invert: 0, blur: 0 },
  grayscale: { label: 'Grayscale', brightness: 100, contrast: 105, saturation: 0, grayscale: 100, sepia: 0, invert: 0, blur: 0 },
  sepia: { label: 'Sepia', brightness: 100, contrast: 100, saturation: 90, grayscale: 0, sepia: 100, invert: 0, blur: 0 },
  invert: { label: 'Invert', brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, invert: 100, blur: 0 },
  vivid: { label: 'Vivid', brightness: 105, contrast: 115, saturation: 150, grayscale: 0, sepia: 0, invert: 0, blur: 0 },
  warm: { label: 'Warm', brightness: 105, contrast: 100, saturation: 110, grayscale: 0, sepia: 30, invert: 0, blur: 0 },
  cool: { label: 'Cool', brightness: 100, contrast: 105, saturation: 95, grayscale: 0, sepia: 0, invert: 0, blur: 0 },
  soft: { label: 'Soft', brightness: 108, contrast: 92, saturation: 95, grayscale: 0, sepia: 0, invert: 0, blur: 1 },
  noir: { label: 'Noir', brightness: 95, contrast: 130, saturation: 0, grayscale: 100, sepia: 0, invert: 0, blur: 0 },
}

function filterStyle(f) {
  return `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) grayscale(${f.grayscale}%) sepia(${f.sepia}%) invert(${f.invert}%) blur(${f.blur}px)`
}

export default function image_tool() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const fileRef = useRef(null)
  const [hasImage, setHasImage] = useState(false)
  const [bg, setBg] = useState('checker')
  const [filters, setFilters] = useState(PRESETS.none)
  const [exportFmt, setExportFmt] = useState('image/png')
  const [exportQ, setExportQ] = useState(0.92)
  const [orig, setOrig] = useState(null) // original Image
  const [imgName, setImgName] = useState('image')

  // Draw the ORIGINAL whenever a filter changes (never stack filters).
  useEffect(() => {
    if (!orig || !canvasRef.current) return
    const c = canvasRef.current
    c.width = orig.width; c.height = orig.height
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.drawImage(orig, 0, 0)
  }, [orig, filters])

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    setImgName(file.name.replace(/\.[^.]+$/, ''))
    const img = new Image()
    img.onload = () => {
      setOrig(img)
      setHasImage(true)
      setFilters(PRESETS.none)
    }
    img.src = URL.createObjectURL(file)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer?.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const applyPreset = (key) => setFilters(PRESETS[key])
  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }))

  const download = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const a = document.createElement('a')
    a.download = `${imgName}-edited.${exportFmt === 'image/png' ? 'png' : exportFmt === 'image/webp' ? 'webp' : 'jpg'}`
    a.href = c.toDataURL(exportFmt, exportQ)
    a.click()
    jumpTo()
  }, [exportFmt, exportQ, jumpTo, imgName])

  const clearCanvas = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, c.width, c.height)
    setHasImage(false); setOrig(null); setFilters(PRESETS.none)
  }, [])

  const rangeClass = "w-full accent-indigo-500"
  const selectClass = "bg-white/[0.06] border-2 border-white/8 rounded-xl px-3 py-2 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="Image Editor — Filters & Color Adjust Online"
      desc="Edit images free online: apply filters like grayscale, sepia, invert and vivid, adjust brightness, contrast and saturation, then export PNG, WebP or JPG. Runs in your browser."
      icon="🖼️" iconBg="rgba(168,85,247,0.08)"
      category="utility" slug="image-tool"
      faq={[
        { q: 'Is my image uploaded?', a: 'No, this editor runs entirely in your browser. Your image never leaves your device.' },
        { q: 'What formats are supported?', a: 'Export as PNG (transparent), WebP, or JPEG. Most image formats can be opened.' },
        { q: 'How do I remove the background?', a: 'Export as PNG — transparency is preserved. For automatic background removal you need an AI tool, which this free editor does not include.' },
      ]}
      howItWorks={["Upload an image", "Apply a filter preset or fine-tune brightness/contrast/saturation", "Export in your preferred format"]}
      schema={{ "@context":"https://schema.org","@type":"SoftwareApplication","name":"Image Editor","applicationCategory":"MultimediaApplication","operatingSystem":"Web","url":"https://www.uptools.in/image-tool/","description":"Free online image editor with filters and color adjustments.","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Controls */}
          <div className="space-y-4">
            {/* Upload */}
            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-5">
              <h3 className="text-sm font-bold text-white mb-3">1) Upload Image</h3>
              <div onDragOver={e => e.preventDefault()} onDrop={handleDrop}
                className="border-2 border-dashed border-white/12 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500/30 transition-all"
                onClick={() => fileRef.current?.click()}>
                <div className="text-3xl mb-2 opacity-30">🖼️</div>
                <p className="text-xs text-slate-400">Drop image here or</p>
                <button className="mt-2 px-4 py-2 rounded-xl bg-indigo-500/15 text-indigo-400 text-xs font-semibold">Choose file</button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => handleFile(e.target.files?.[0])} />
            </div>

            {/* Presets */}
            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-5">
              <h3 className="text-sm font-bold text-white mb-3">Presets</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(PRESETS).map(([key, p]) => (
                  <button key={key} onClick={() => applyPreset(key)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                      filters === PRESETS[key] ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-white/[0.04] text-slate-400 border-white/8 hover:text-white'
                    }`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">2) Adjust</h3>
              {[
                ['Brightness', filters.brightness, v => setFilter('brightness', v), 50, 150],
                ['Contrast', filters.contrast, v => setFilter('contrast', v), 50, 150],
                ['Saturation', filters.saturation, v => setFilter('saturation', v), 0, 200],
                ['Grayscale', filters.grayscale, v => setFilter('grayscale', v), 0, 100],
                ['Sepia', filters.sepia, v => setFilter('sepia', v), 0, 100],
                ['Invert', filters.invert, v => setFilter('invert', v), 0, 100],
                ['Blur', filters.blur, v => setFilter('blur', v), 0, 10],
              ].map(([label, val, setter, min, max]) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-bold text-slate-400">{label}</label>
                    <span className="text-xs text-white font-semibold">{val}{label === 'Blur' ? 'px' : '%'}</span>
                  </div>
                  <input type="range" min={min} max={max} value={val} onChange={e => setter(parseInt(e.target.value))}
                    className={rangeClass} />
                </div>
              ))}
              <div className="flex gap-2">
                <button onClick={() => setFilters(PRESETS.none)}
                  className="flex-1 py-2 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 text-xs font-semibold hover:bg-white/10 transition-all">
                  Reset
                </button>
                <button onClick={clearCanvas}
                  className="flex-1 py-2 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 text-xs font-semibold hover:bg-white/10 transition-all">
                  Clear
                </button>
              </div>
            </div>

            {/* Export */}
            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">3) Export</h3>
              <div className="flex gap-2">
                <select value={exportFmt} onChange={e => setExportFmt(e.target.value)} className={selectClass + ' flex-1'}>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                  <option value="image/jpeg">JPEG</option>
                </select>
                <input type="number" min={0.1} max={1} step={0.1} value={exportQ}
                  onChange={e => setExportQ(parseFloat(e.target.value))}
                  className="w-20 bg-white/[0.06] border-2 border-white/8 rounded-xl px-3 py-2 text-white text-sm font-semibold outline-none [color-scheme:dark]" />
              </div>
              <button onClick={download} disabled={!hasImage}
                className="w-full py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all disabled:opacity-40">
                📥 Download
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div ref={resultRef} className="lg:col-span-2 rounded-3xl border-2 border-white/8 bg-white/[0.06] p-4">
            <div className="relative rounded-xl overflow-hidden" style={{
              background: bg === 'checker'
                ? 'repeating-conic-gradient(rgba(255,255,255,0.06) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px'
                : bg
            }}>
              <canvas ref={canvasRef} className="w-full h-auto block" style={{ filter: filterStyle(filters) }} />
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { if (hasImage) download() }}
                className="flex-1 py-2 rounded-xl bg-indigo-500 text-white font-bold text-xs hover:bg-indigo-400 transition-all">
                Quick Download (PNG)
              </button>
              <div className="flex gap-2">
                {['checker', '#ffffff', '#000000'].map(v => (
                  <button key={v} onClick={() => setBg(v)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      bg === v ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-white/[0.04] text-slate-400 border-white/8'
                    }`}>
                    {v === 'checker' ? 'Checker' : v === '#ffffff' ? 'White' : 'Black'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* How-to */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <h3 className="text-sm font-bold text-white mb-3">How to edit a photo</h3>
          <ol className="text-sm text-slate-400 space-y-1 list-decimal list-inside">
            <li>Upload any image (JPG, PNG, WebP).</li>
            <li>Pick a preset like Grayscale, Sepia, Vivid or Noir, or fine-tune sliders.</li>
            <li>Export as PNG for transparency, WebP for small size, or JPEG for photos.</li>
          </ol>
        </div>
      </div>
    </ToolLayout>
  )
}
