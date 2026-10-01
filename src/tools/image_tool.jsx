import { useState, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

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
  const [rotation, setRotation] = useState(0) // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [exportFmt, setExportFmt] = useState('image/png')
  const [exportQ, setExportQ] = useState(0.92)
  const [orig, setOrig] = useState(null)
  const [imgName, setImgName] = useState('image')
  const [copied, setCopied] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const activeUrlRef = useRef("")

  useEffect(() => {
    return () => {
      if (activeUrlRef.current) URL.revokeObjectURL(activeUrlRef.current)
    }
  }, [])

  // Draw image with direct context filter so the canvas pixels are actually modified!
  const renderCanvas = useCallback(() => {
    const c = canvasRef.current
    if (!orig || !c) return

    const isRotated90or270 = rotation === 90 || rotation === 270
    c.width = isRotated90or270 ? orig.height : orig.width
    c.height = isRotated90or270 ? orig.width : orig.height

    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, c.width, c.height)

    // Save and transform
    ctx.save()
    ctx.translate(c.width / 2, c.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)

    // Apply filters directly to canvas context
    if (!showOriginal) {
      ctx.filter = filterStyle(filters)
    } else {
      ctx.filter = 'none'
    }

    ctx.drawImage(orig, -orig.width / 2, -orig.height / 2)
    ctx.restore()
  }, [orig, filters, rotation, flipH, flipV, showOriginal])

  useEffect(() => {
    renderCanvas()
  }, [renderCanvas])

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    setImgName(file.name.replace(/\.[^.]+$/, ''))

    if (activeUrlRef.current) {
      URL.revokeObjectURL(activeUrlRef.current)
    }

    const url = URL.createObjectURL(file)
    activeUrlRef.current = url
    const img = new Image()
    img.onload = () => {
      setOrig(img)
      setHasImage(true)
      setFilters(PRESETS.none)
      setRotation(0)
      setFlipH(false)
      setFlipV(false)
    }
    img.src = url
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const applyPreset = (key) => setFilters(PRESETS[key])
  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }))

  const rotate90 = () => setRotation(r => (r + 90) % 360)
  const toggleFlipH = () => setFlipH(v => !v)
  const toggleFlipV = () => setFlipV(v => !v)

  const download = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const ext = exportFmt === 'image/png' ? 'png' : exportFmt === 'image/webp' ? 'webp' : 'jpg'
    const a = document.createElement('a')
    a.download = `${imgName}-edited.${ext}`
    a.href = c.toDataURL(exportFmt, exportQ)
    document.body.appendChild(a)
    a.click()
    a.remove()
    jumpTo()
  }, [exportFmt, exportQ, jumpTo, imgName])

  const copyToClipboard = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    c.toBlob(async (blob) => {
      if (blob) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {
          /* clipboard copy error */
        }
      }
    }, 'image/png')
  }, [])

  const clearCanvas = useCallback(() => {
    const c = canvasRef.current
    if (c) {
      const ctx = c.getContext('2d')
      ctx.clearRect(0, 0, c.width, c.height)
    }
    if (activeUrlRef.current) URL.revokeObjectURL(activeUrlRef.current)
    setHasImage(false)
    setOrig(null)
    setFilters(PRESETS.none)
    setRotation(0)
    setFlipH(false)
    setFlipV(false)
    if (fileRef.current) fileRef.current.value = ""
  }, [])

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
        { q: "How do I use this Image Editor — Filters & Color Adjust Online online free?", a: "Enter your input above, customize the options, and copy or save the result. Free with no sign-up." },
        { q: "How do I save my result?", a: "Click the copy or download button on your result to save it. Free with no sign-up." },
        { q: "Can I use it more than once?", a: "Yes, unlimited free use. Generate as many results as you need, on any device." },
      ]}
      howItWorks={["Upload an image", "Apply a filter preset or fine-tune brightness/contrast/saturation", "Export in your preferred format"]}
      schema={{ "@context":"https://schema.org","@type":"SoftwareApplication","name":"Image Editor","applicationCategory":"MultimediaApplication","operatingSystem":"Web","url":"https://www.uptools.in/image-tool/","description":"Free online image editor with filters and color adjustments.","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Controls column */}
          <div className="space-y-4">
            {/* 1) Upload */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-gray-900">1) Upload Image</h3>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                  dragOver ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                }`}
              >
                <div className="text-3xl mb-1">🖼️</div>
                <p className="text-xs font-semibold text-gray-800">Drop image here or click</p>
                <p className="text-[11px] text-gray-500 mt-0.5">JPG, PNG, WebP, GIF</p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>

            {/* Presets */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Presets</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(PRESETS).map(([key, p]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyPreset(key)}
                    className={`min-h-[44px] py-2 px-2 rounded-xl text-xs font-semibold transition-colors border ${
                      filters === PRESETS[key]
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transforms */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Transform</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={rotate90}
                  className="min-h-[44px] px-2 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ↻ Rotate 90°
                </button>
                <button
                  type="button"
                  onClick={toggleFlipH}
                  className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                    flipH ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ⇄ Flip H
                </button>
                <button
                  type="button"
                  onClick={toggleFlipV}
                  className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                    flipV ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ⇅ Flip V
                </button>
              </div>
            </div>

            {/* Adjustments */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900">2) Fine-Tune Adjustments</h3>
              {[
                ['Brightness', filters.brightness, (v) => setFilter('brightness', v), 50, 150, '%'],
                ['Contrast', filters.contrast, (v) => setFilter('contrast', v), 50, 150, '%'],
                ['Saturation', filters.saturation, (v) => setFilter('saturation', v), 0, 200, '%'],
                ['Grayscale', filters.grayscale, (v) => setFilter('grayscale', v), 0, 100, '%'],
                ['Sepia', filters.sepia, (v) => setFilter('sepia', v), 0, 100, '%'],
                ['Invert', filters.invert, (v) => setFilter('invert', v), 0, 100, '%'],
                ['Blur', filters.blur, (v) => setFilter('blur', v), 0, 10, 'px'],
              ].map(([label, val, setter, min, max, unit]) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-gray-700">{label}</label>
                    <span className="text-xs font-bold text-indigo-600">{val}{unit}</span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={val}
                    onChange={(e) => setter(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFilters(PRESETS.none)}
                  className="min-h-[44px] flex-1 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors"
                >
                  Reset Sliders
                </button>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="min-h-[44px] flex-1 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* 3) Export */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-gray-900">3) Export</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Format</label>
                  <select
                    value={exportFmt}
                    onChange={(e) => setExportFmt(e.target.value)}
                    className="w-full min-h-[44px] bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WebP</option>
                    <option value="image/jpeg">JPEG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Quality</label>
                  <input
                    type="number"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={exportQ}
                    onChange={(e) => setExportQ(parseFloat(e.target.value) || 0.92)}
                    className="w-full min-h-[44px] bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={download}
                disabled={!hasImage}
                className="w-full min-h-[44px] py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors disabled:opacity-40 shadow-sm"
              >
                📥 Download Filtered Image
              </button>
              <button
                type="button"
                onClick={copyToClipboard}
                disabled={!hasImage}
                className="w-full min-h-[44px] py-2.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-xs transition-colors disabled:opacity-40"
              >
                {copied ? '✓ Copied to Clipboard!' : '📋 Copy to Clipboard'}
              </button>
            </div>
          </div>

          {/* Canvas Preview column */}
          <div ref={resultRef} className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-200">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Canvas Workspace</span>
                {hasImage && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onMouseDown={() => setShowOriginal(true)}
                      onMouseUp={() => setShowOriginal(false)}
                      onTouchStart={() => setShowOriginal(true)}
                      onTouchEnd={() => setShowOriginal(false)}
                      className="min-h-[44px] px-3 py-1.5 rounded-lg border border-gray-300 bg-gray-50 text-xs font-semibold text-gray-700 select-none hover:bg-gray-100"
                    >
                      Press &amp; Hold to View Original
                    </button>
                  </div>
                )}
              </div>

              <div
                className="relative rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center min-h-[280px]"
                style={{
                  background: bg === 'checker'
                    ? 'repeating-conic-gradient(#e5e7eb 0% 25%, #f9fafb 0% 50%) 0 0 / 20px 20px'
                    : bg
                }}
              >
                {hasImage ? (
                  <canvas ref={canvasRef} className="max-w-full h-auto block rounded-lg shadow-sm" />
                ) : (
                  <div className="text-center py-16 px-4">
                    <div className="text-5xl mb-2 opacity-30">🖼️</div>
                    <div className="text-sm font-semibold text-gray-700">No image loaded</div>
                    <div className="text-xs text-gray-500 mt-1">Upload a photo from the left panel to begin editing</div>
                  </div>
                )}
              </div>

              {hasImage && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500 font-medium">Canvas background:</span>
                    {['checker', '#ffffff', '#111827'].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setBg(v)}
                        className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                          bg === v ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {v === 'checker' ? 'Checker' : v === '#ffffff' ? 'White' : 'Dark'}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {orig ? `${orig.width} × ${orig.height} px` : ''}
                  </div>
                </div>
              )}
            </div>

            {/* How-to */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2">How to edit photos online</h3>
              <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside leading-relaxed">
                <li>Upload an image using drag &amp; drop or click to choose a file.</li>
                <li>Apply instant filter presets (Grayscale, Vivid, Noir, Sepia) or adjust individual sliders.</li>
                <li>Rotate or flip your image as needed.</li>
                <li>Export high-quality PNG, WebP, or JPEG with real applied pixel adjustments.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
