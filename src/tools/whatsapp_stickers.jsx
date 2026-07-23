import { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function whatsapp_stickers() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const [image, setImage] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [padding, setPadding] = useState(16)
  const [radius, setRadius] = useState(36)
  const [bgTransparent, setBgTransparent] = useState(true)
  const [bgColor, setBgColor] = useState('#000000')
  const [text, setText] = useState('')
  const [textSize, setTextSize] = useState(72)
  const [textColor, setTextColor] = useState('#ffffff')
  const [textStroke, setTextStroke] = useState('#000000')
  const [pack, setPack] = useState([])
  const [packTitle, setPackTitle] = useState('My Stickers')

  const SIZE = 512

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = SIZE
    canvas.height = SIZE

    // Background
    if (bgTransparent) {
      ctx.clearRect(0, 0, SIZE, SIZE)
    } else {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, SIZE, SIZE)
    }

    // Rounded rect clip
    ctx.save()
    ctx.beginPath()
    const r = Math.min(radius, SIZE / 2)
    ctx.roundRect(padding, padding, SIZE - padding * 2, SIZE - padding * 2, r)
    ctx.clip()

    if (image) {
      ctx.save()
      ctx.translate(SIZE / 2, SIZE / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(zoom, zoom)
      const maxDim = SIZE - padding * 2
      const scale = Math.min(maxDim / image.width, maxDim / image.height)
      const w = image.width * scale
      const h = image.height * scale
      ctx.drawImage(image, -w / 2 + panX, -h / 2 + panY, w, h)
      ctx.restore()
    }

    ctx.restore()

    // Text overlay
    if (text) {
      ctx.save()
      ctx.font = `bold ${textSize}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.lineWidth = 3
      ctx.strokeStyle = textStroke
      ctx.fillStyle = textColor
      ctx.strokeText(text, SIZE / 2, SIZE / 2)
      ctx.fillText(text, SIZE / 2, SIZE / 2)
      ctx.restore()
    }
  }, [image, zoom, panX, panY, rotation, padding, radius, bgTransparent, bgColor, text, textSize, textColor, textStroke])

  useEffect(() => { draw() }, [draw])

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const img = new Image()
    img.onload = () => { setImage(img); setZoom(1); setPanX(0); setPanY(0); setRotation(0) }
    img.src = URL.createObjectURL(file)
  }

  const handlePaste = async () => {
    try {
      const items = await navigator.clipboard.read()
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type)
            const img = new Image()
            img.onload = () => { setImage(img); setZoom(1); setPanX(0); setPanY(0); setRotation(0) }
            img.src = URL.createObjectURL(blob)
            return
          }
        }
      }
    } catch {}
  }

  const download = (format) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL(`image/${format}`)
    a.download = `sticker-${Date.now()}.${format}`
    a.click()
  }

  const addToPack = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/webp')
    setPack(prev => [...prev, dataUrl])
    setTimeout(() => jumpTo(), 100)
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-2.5 text-white font-semibold text-sm outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  const Slider = ({ label, value, onChange, min, max, step = 1, unit = '' }) => (
    <div className="flex items-center gap-2">
      <label className="text-xs font-semibold text-slate-500 w-16 shrink-0">{label}</label>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 accent-indigo-500" />
      <span className="text-xs text-slate-500 w-12 text-right shrink-0">{value}{unit}</span>
    </div>
  )

  return (
    <ToolLayout
      title="WhatsApp Sticker Maker"
      desc="Make WhatsApp stickers in your browser: upload, zoom, rotate, add text, and export as 512×512."
      icon="🎨" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-stickers"
      faq={[
        { q: "Is this tool free?", a: "Yes, it's completely free with no sign-ups required." },
        { q: "Is my data private?", a: "Yes. All processing runs in your browser. No data is uploaded." },
        { q: "Does it work on mobile?", a: "Yes. The tool is mobile-responsive and works on any device." },
      ]}
      howItWorks={[
        "Upload or paste an image into the editor.",
        "Use the sliders to zoom, pan, rotate, and adjust padding.",
        "Add text/emoji overlay if needed.",
        "Download as WebP or PNG, or add to a sticker pack.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Sticker Maker", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-stickers/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6">
          {/* Editor */}
          <div className="space-y-4">
            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400">Preview</span>
                <div className="flex gap-2">
                  <button onClick={() => { setZoom(1); setPanX(0); setPanY(0) }}
                    className="px-2 py-1 rounded-lg bg-white/[0.06] text-[10px] text-slate-500 hover:text-white transition-all">Fit</button>
                  <button onClick={() => { setRotation(0); setPanX(0); setPanY(0) }}
                    className="px-2 py-1 rounded-lg bg-white/[0.06] text-[10px] text-slate-500 hover:text-white transition-all">Reset</button>
                </div>
              </div>
              <div className="flex justify-center bg-[#1a1a2e] rounded-xl overflow-hidden">
                <canvas ref={canvasRef} width={SIZE} height={SIZE}
                  className="max-w-full" style={{ imageRendering: 'auto' }} />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFile} />
              <button onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2.5 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-400 transition-all">
                ⬆️ Upload
              </button>
              <button onClick={handlePaste}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 text-xs font-bold hover:text-white transition-all">
                📋 Paste
              </button>
              <button onClick={() => download('webp')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30 hover:bg-emerald-500/25 transition-all">
                ⬇️ WebP
              </button>
              <button onClick={() => download('png')}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 text-xs font-bold hover:text-white transition-all">
                ⬇️ PNG
              </button>
            </div>
          </div>

          {/* Tools */}
          <div className="space-y-4">
            <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transform</h3>
              <Slider label="Zoom" value={zoom} onChange={setZoom} min={0.1} max={5} step={0.01} unit="×" />
              <Slider label="Pan X" value={panX} onChange={setPanX} min={-256} max={256} />
              <Slider label="Pan Y" value={panY} onChange={setPanY} min={-256} max={256} />
              <Slider label="Rotate" value={rotation} onChange={setRotation} min={-180} max={180} unit="°" />
              <Slider label="Padding" value={padding} onChange={setPadding} min={0} max={80} unit="px" />
              <Slider label="Rounded" value={radius} onChange={setRadius} min={0} max={180} unit="px" />
            </div>

            <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Background</h3>
              <label className="flex items-center gap-2 text-xs text-slate-400">
                <input type="checkbox" checked={bgTransparent} onChange={e => setBgTransparent(e.target.checked)}
                  className="accent-indigo-500" />
                Transparent Background
              </label>
              {!bgTransparent && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">BG Color</span>
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                </div>
              )}
            </div>

            <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Text / Emoji</h3>
              <input type="text" value={text} onChange={e => setText(e.target.value)}
                placeholder="Add text or emoji 😊" className={inputClass} />
              <Slider label="Size" value={textSize} onChange={setTextSize} min={10} max={160} unit="px" />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500">Text</span>
                  <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500">Stroke</span>
                  <input type="color" value={textStroke} onChange={e => setTextStroke(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sticker Pack</h3>
              <input type="text" value={packTitle} onChange={e => setPackTitle(e.target.value)}
                placeholder="Pack Title" className={inputClass} />
              <button onClick={addToPack}
                className="w-full py-2.5 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-400 transition-all">
                ➕ Add to Pack ({pack.length})
              </button>
              {pack.length > 0 && (
                <div className="grid grid-cols-4 gap-2" ref={resultRef}>
                  {pack.map((src, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/10">
                      <img src={src} alt={`Sticker ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
