import { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const OUTPUT_SIZES = [
  { label: 'Indian Passport (35×45mm)', width: 413, height: 531 },
  { label: 'US Visa (2×2 in)', width: 600, height: 600 },
  { label: 'UK/EU (3.5×4.5cm)', width: 413, height: 531 },
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
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [sizeIdx, setSizeIdx] = useState(0)
  const [hasDrawn, setHasDrawn] = useState(false)

  const size = OUTPUT_SIZES[sizeIdx]

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        imgRef.current = img
        setImage(ev.target.result)
        setZoom(1)
        setPan({ x: 0, y: 0 })
        setHasDrawn(false)
        jumpTo()
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    canvas.width = size.width
    canvas.height = size.height

    /* White background */
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size.width, size.height)

    /* Scale image to fill canvas while maintaining aspect ratio */
    const scaleX = size.width / img.width
    const scaleY = size.height / img.height
    const baseScale = Math.max(scaleX, scaleY)
    const scale = baseScale * zoom

    const drawW = img.width * scale
    const drawH = img.height * scale
    const x = (size.width - drawW) / 2 + pan.x
    const y = (size.height - drawH) / 2 + pan.y

    ctx.drawImage(img, x, y, drawW, drawH)
    setHasDrawn(true)
  }, [size, zoom, pan])

  useEffect(() => { draw() }, [draw])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) setDragStart({ x: e.clientX - rect.left - pan.x, y: e.clientY - rect.top - pan.y })
  }
  const handleMouseMove = (e) => {
    if (!isDragging) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) setPan({ x: e.clientX - rect.left - dragStart.x, y: e.clientY - rect.top - dragStart.y })
  }
  const handleMouseUp = () => setIsDragging(false)

  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    setIsDragging(true)
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) setDragStart({ x: touch.clientX - rect.left - pan.x, y: touch.clientY - rect.top - pan.y })
  }
  const handleTouchMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const touch = e.touches[0]
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) setPan({ x: touch.clientX - rect.left - dragStart.x, y: touch.clientY - rect.top - dragStart.y })
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `passport-photo-${size.width}x${size.height}.jpg`
    link.href = canvas.toDataURL('image/jpeg', 0.95)
    link.click()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

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
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Upload Photo</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile}
              className="w-full bg-white/[0.06] border-2 border-dashed border-white/12 rounded-xl px-5 py-6 text-white text-sm font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-500 file:text-white file:font-bold file:text-sm file:cursor-pointer hover:file:bg-indigo-400" />
          </div>

          {image && (
            <>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Output Size</label>
                <select value={sizeIdx} onChange={(e) => setSizeIdx(Number(e.target.value))} className={selectClass}>
                  {OUTPUT_SIZES.map((s, i) => (
                    <option key={i} value={i}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Zoom: {zoom.toFixed(1)}x</label>
                <input type="range" min="0.5" max="3" step="0.1" value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-500 bg-white/10" />
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium mb-2">👆 Drag the image to reposition your face</p>
                <div ref={containerRef}
                  className="relative w-full aspect-[35/45] max-w-xs mx-auto rounded-xl border-2 border-white/10 bg-white overflow-hidden cursor-grab active:cursor-grabbing"
                  onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleMouseUp}>
                  <canvas ref={canvasRef} className="w-full h-full" style={{ pointerEvents: 'none' }} />
                </div>
              </div>
            </>
          )}
        </div>

        {image ? (
          <button onClick={handleDownload} ref={resultRef}
            className="w-full py-4 rounded-2xl bg-sky-500 text-white font-bold text-sm hover:bg-sky-400 transition-all duration-200 active:scale-[0.98]">
            Download JPEG ({size.width}×{size.height}px)
          </button>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📸</div>
            <p className="text-sm text-slate-600 font-medium">Upload a photo to create your passport size image</p>
          </div>
        )}

        {image && (
          <p className="text-[11px] text-slate-600 text-center font-medium italic">
            ℹ️ White background is enforced. For best results, use a well-lit photo with good contrast. Adjust zoom and position per passport guidelines.
          </p>
        )}
      </div>
    </ToolLayout>
  )
}
