import { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const OUTPUT_SIZES = [
  { label: 'Indian Passport (35×45 mm)', width: 413, height: 531 },
  { label: 'US Visa / Passport (2×2 in)', width: 600, height: 600 },
  { label: 'UK / EU / Schengen (35×45 mm)', width: 413, height: 531 },
  { label: 'Canada Passport (50×70 mm)', width: 591, height: 827 },
]

const BG_COLORS = [
  { label: 'Pure White', value: '#ffffff' },
  { label: 'Off-White', value: '#f8fafc' },
  { label: 'Light Blue', value: '#e0f2fe' },
  { label: 'Light Gray', value: '#f1f5f9' },
]

export default function passport_photo_maker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const imgRef = useRef(null)
  const containerRef = useRef(null)

  const [image, setImage] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [bgColor, setBgColor] = useState('#ffffff')
  const [sizeIdx, setSizeIdx] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const dragStartRef = useRef({ startX: 0, startY: 0, initialPanX: 0, initialPanY: 0 })
  const activeUrlRef = useRef("")

  const size = OUTPUT_SIZES[sizeIdx]

  useEffect(() => {
    return () => {
      if (activeUrlRef.current) URL.revokeObjectURL(activeUrlRef.current)
    }
  }, [])

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (activeUrlRef.current) URL.revokeObjectURL(activeUrlRef.current)
    const url = URL.createObjectURL(file)
    activeUrlRef.current = url

    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      setImage(url)
      setZoom(1)
      setPan({ x: 0, y: 0 })
      setRotation(0)
      setFlipH(false)
      jumpTo()
    }
    img.src = url
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    canvas.width = size.width
    canvas.height = size.height

    // Background fill
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size.width, size.height)

    // Base scale to cover the passport canvas
    const isRotated90 = rotation === 90 || rotation === 270
    const effectiveImgW = isRotated90 ? img.height : img.width
    const effectiveImgH = isRotated90 ? img.width : img.height

    const scaleX = size.width / effectiveImgW
    const scaleY = size.height / effectiveImgH
    const baseScale = Math.max(scaleX, scaleY)
    const currentScale = baseScale * zoom

    ctx.save()
    ctx.translate(size.width / 2 + pan.x, size.height / 2 + pan.y)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(flipH ? -1 : 1, 1)

    const drawW = img.width * currentScale
    const drawH = img.height * currentScale
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
    ctx.restore()

    // Draw subtle passport head guide oval overlay
    ctx.save()
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 6])
    ctx.beginPath()
    const headW = size.width * 0.48
    const headH = size.height * 0.52
    ctx.ellipse(size.width / 2, size.height * 0.44, headW / 2, headH / 2, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }, [size, zoom, pan, rotation, flipH, bgColor])

  useEffect(() => {
    draw()
  }, [draw])

  // Mouse & Touch Pan Handling
  const handlePointerDown = (clientX, clientY) => {
    setIsDragging(true)
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialPanX: pan.x,
      initialPanY: pan.y,
    }
  }

  const handlePointerMove = useCallback((clientX, clientY) => {
    if (!isDragging || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const scaleFactor = size.width / rect.width
    const dx = (clientX - dragStartRef.current.startX) * scaleFactor
    const dy = (clientY - dragStartRef.current.startY) * scaleFactor
    setPan({
      x: Math.round(dragStartRef.current.initialPanX + dx),
      y: Math.round(dragStartRef.current.initialPanY + dy),
    })
  }, [isDragging, size.width])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (!isDragging) return
    const onMouseMove = (e) => handlePointerMove(e.clientX, e.clientY)
    const onTouchMove = (e) => {
      if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onEnd = () => handlePointerUp()

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onEnd)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onEnd)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onEnd)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onEnd)
    }
  }, [isDragging, handlePointerMove, handlePointerUp])

  const handleDownloadSingle = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `passport-photo-${size.width}x${size.height}.jpg`
    link.href = canvas.toDataURL('image/jpeg', 0.98)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  // Create a 4x6 print sheet (1200 x 1800 px at 300 DPI)
  const handleDownloadSheet = () => {
    const singleCanvas = canvasRef.current
    if (!singleCanvas) return

    const sheet = document.createElement('canvas')
    sheet.width = 1800
    sheet.height = 1200
    const sctx = sheet.getContext('2d')

    // White sheet
    sctx.fillStyle = '#ffffff'
    sctx.fillRect(0, 0, sheet.width, sheet.height)

    // Calculate grid layout for 4x6 inches
    const cols = size.width === 600 ? 3 : 4
    const rows = 2
    const totalPhotos = cols * rows
    const photoW = size.width * (size.width === 600 ? 0.88 : 0.82)
    const photoH = size.height * (size.width === 600 ? 0.88 : 0.82)

    const gapX = (sheet.width - cols * photoW) / (cols + 1)
    const gapY = (sheet.height - rows * photoH) / (rows + 1)

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = gapX + c * (photoW + gapX)
        const y = gapY + r * (photoH + gapY)
        sctx.drawImage(singleCanvas, x, y, photoW, photoH)
        // Thin cutting border around each photo
        sctx.strokeStyle = '#e2e8f0'
        sctx.lineWidth = 1
        sctx.strokeRect(x, y, photoW, photoH)
      }
    }

    const link = document.createElement('a')
    link.download = `passport-photo-sheet-4x6.jpg`
    link.href = sheet.toDataURL('image/jpeg', 0.98)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const rotate90 = () => setRotation((r) => (r + 90) % 360)
  const toggleFlip = () => setFlipH((v) => !v)
  const resetPosition = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setRotation(0)
    setFlipH(false)
  }

  return (
    <ToolLayout
      title="Passport Photo Maker – Free Online Passport Size Photo Editor"
      desc="Create passport size photos from any image. Drag to position, zoom to resize. Supports Indian passport (35×45mm), US visa (2×2in), and UK/EU sizes at 300 DPI print resolution."
      icon="📸" iconBg="rgba(14,165,233,0.08)"
      category="images" slug="passport-photo-maker"
      faq={[
        { q: "What resolution are the output photos?", a: "The output is 300 DPI print resolution — 413×531px for 35×45mm (Indian passport) and 600×600px for 2×2 inch (US visa). Perfect for printing." },
        { q: "Is there a white background?", a: "The canvas enforces a white background by default, which is required for most passport photos. Make sure your original photo has good contrast against it." },
        { q: "How do I position my face in the photo?", a: "Drag the image to pan it within the frame and use the zoom slider to resize. Center your face and ensure proper headroom as per passport guidelines." },
        { q: "What format is the downloaded photo?", a: "The photo downloads as a high-quality JPEG file, ready for printing or uploading to visa applications." },
        { q: "Is this passport photo maker free?", a: "Yes, completely free with no sign-up. Works on mobile and desktop browsers." },
      ]}
      howItWorks={[
        "Upload a photo using the file input above — any portrait photo works.",
        "Use the zoom slider to resize the image to fit your face properly.",
        "Drag the image to pan and position your face in the center of the frame.",
        "Select your output size: Indian Passport (35×45mm), US Visa (2×2in), or UK/EU.",
        "Click Download to save a 300 DPI JPEG ready for printing.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Passport Photo Maker", "applicationCategory": "DesignApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Upload */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0])
          }}
          className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 ${
            dragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/[0.15] bg-white/[0.02] hover:border-white/[0.25] hover:bg-white/[0.04]'
          }`}
        >
          <div className="text-4xl mb-2">📸</div>
          <div className="text-sm font-semibold text-white">Upload Portrait Photo</div>
          <div className="text-xs text-slate-400 mt-1">Click to browse or drop an image file (JPG, PNG, WebP)</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {image && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Passport / Visa Standard</label>
                <select
                  value={sizeIdx}
                  onChange={(e) => setSizeIdx(Number(e.target.value))}
                  className="w-full min-h-[44px] bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-indigo-500/50"
                >
                  {OUTPUT_SIZES.map((s, i) => (
                    <option key={i} value={i} className="bg-slate-900 text-white">{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Background Fill</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {BG_COLORS.map((bg) => {
                    const isSelected = bgColor === bg.value
                    return (
                      <button
                        key={bg.value}
                        type="button"
                        onClick={() => setBgColor(bg.value)}
                        className={`min-h-[44px] px-2 py-1 rounded-xl text-xs font-semibold border transition-all duration-200 flex items-center justify-center gap-1 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/20 active:scale-95'
                            : 'border-white/[0.1] bg-white/[0.04] text-slate-200 hover:bg-white/[0.08] active:scale-95'
                        }`}
                      >
                        {isSelected && <span className="text-[10px]">✓</span>}
                        {bg.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Zoom Slider and Transform Buttons */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                <span>Face Zoom</span>
                <span className="text-indigo-400 font-bold font-mono">{zoom.toFixed(1)}×</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="3.0"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={rotate90}
                  className="min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 hover:text-white transition-colors"
                >
                  ↻ Rotate 90°
                </button>
                <button
                  type="button"
                  onClick={toggleFlip}
                  className="min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 hover:text-white transition-colors"
                >
                  ⇄ Mirror / Flip
                </button>
                <button
                  type="button"
                  onClick={resetPosition}
                  className="min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 hover:text-white transition-colors"
                >
                  Reset Position
                </button>
              </div>
            </div>

            {/* Interactive Cropper / Preview with DYNAMIC aspect ratio! */}
            <div className="text-center space-y-2">
              <p className="text-xs text-slate-400 font-medium">
                👆 Drag photo to align face inside guideline oval.
              </p>

              <div className="flex justify-center p-4 bg-black/40 rounded-2xl border border-white/[0.08]">
                <div
                  ref={containerRef}
                  style={{
                    aspectRatio: `${size.width} / ${size.height}`,
                    maxWidth: size.width === 600 ? '280px' : '240px',
                  }}
                  className="relative w-full rounded-xl border-2 border-indigo-500/70 bg-slate-900 shadow-xl overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none"
                  onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
                  onTouchStart={(e) => {
                    if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)
                  }}
                >
                  <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono font-medium">
                Resolution: {size.width} × {size.height} px (300 DPI Print Quality)
              </div>
            </div>

            {/* Action buttons */}
            <div ref={resultRef} className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadSingle}
                className="glow-btn min-h-[44px] flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2"
              >
                💾 Download Single Photo ({size.width}×{size.height}px)
              </button>
              <button
                type="button"
                onClick={handleDownloadSheet}
                className="min-h-[44px] px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/[0.1] font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                🖨️ Download 4×6 Print Sheet
              </button>
            </div>
          </div>
        )}

        {!image && (
          <div ref={resultRef} className="text-center py-12 rounded-2xl border border-white/[0.08] bg-white/[0.06]">
            <div className="text-4xl mb-2 opacity-40">📸</div>
            <p className="text-sm text-slate-300 font-medium">Upload a photo to create official passport and visa size photos</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
