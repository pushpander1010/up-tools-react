import { useState, useRef, useEffect, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const FRAMES = [
  { id: 'classic', name: 'Classic Saffron', desc: 'Traditional double border' },
  { id: 'royal', name: 'Royal Maroon', desc: 'Gold + maroon elegant' },
  { id: 'floral', name: 'Floral Pink', desc: 'Soft festive florals' },
  { id: 'gold', name: 'Golden Glow', desc: 'Warm gold aesthetic' },
  { id: 'modern', name: 'Modern Minimal', desc: 'Clean white + orange' },
  { id: 'festive', name: 'Festive Pop', desc: 'Bright purple & amber' },
]

const SIZES = [
  { id: '1:1', label: 'Square 1:1', w: 1080, h: 1080 },
  { id: '4:5', label: 'Portrait 4:5', w: 1080, h: 1350 },
  { id: '9:16', label: 'Story 9:16', w: 1080, h: 1920 },
]

const FONTS = ['Poppins, sans-serif', 'Georgia, serif', 'cursive', 'monospace']
const FONT_LABELS = ['Modern (Poppins)', 'Classic (Georgia)', 'Cursive Handwriting', 'Monospace Code']
const STICKERS = ['🪢', '🎁', '🪔', '❤️', '🌸', '✨', '🎉', '🙏', '💫', '🦚']

export default function rakhi_photo_frame_maker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const fileRef = useRef(null)
  const [frame, setFrame] = useState('classic')
  const [sizeIdx, setSizeIdx] = useState(0)
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('Happy Raksha Bandhan 2026')
  const [fontIdx, setFontIdx] = useState(0)
  const [textColor, setTextColor] = useState('#7f1d1d')
  const [img, setImg] = useState(null)
  const imgRef = useRef(null)
  const [stickers, setStickers] = useState([])
  const [drag, setDrag] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [copied, setCopied] = useState(false)

  const processImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      const im = new Image()
      im.onload = () => {
        imgRef.current = im
        setImg(reader.result)
        jumpTo()
      }
      im.src = reader.result
    }
    reader.readAsDataURL(file)
  }

  const onUpload = (e) => {
    const f = e.target.files?.[0]
    if (f) processImageFile(f)
  }

  const addSticker = (emoji) => {
    setStickers((s) => [
      ...s,
      {
        id: Date.now() + Math.random(),
        emoji,
        x: 0.5 + (Math.random() - 0.5) * 0.2,
        y: 0.2 + Math.random() * 0.15,
        scale: 1,
      },
    ])
  }

  const draw = useCallback(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const { w: W, h: H } = SIZES[sizeIdx]
    cvs.width = W
    cvs.height = H
    const ctx = cvs.getContext('2d')

    // Clean white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)

    // Photo area geometry
    const pad = 32
    const photoTop = 96
    const photoH = H - 240

    // Clip photo with rounded rect
    ctx.save()
    const rr = 24
    ctx.beginPath()
    ctx.roundRect(pad, photoTop, W - pad * 2, photoH, rr)
    ctx.clip()

    if (imgRef.current) {
      const im = imgRef.current
      const scale = Math.max((W - pad * 2) / im.width, photoH / im.height)
      const iw = im.width * scale
      const ih = im.height * scale
      const dx = pad + (W - pad * 2 - iw) / 2
      const dy = photoTop + (photoH - ih) / 2
      ctx.drawImage(im, dx, dy, iw, ih)
    } else {
      ctx.fillStyle = '#fef3c7'
      ctx.fillRect(pad, photoTop, W - pad * 2, photoH)
      ctx.fillStyle = '#7f1d1d'
      ctx.font = 'bold 34px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('📸 Upload your photo', W / 2, photoTop + photoH / 2 - 20)
      ctx.font = '600 16px sans-serif'
      ctx.fillStyle = '#92400e'
      ctx.fillText('Your photo will appear here inside the frame', W / 2, photoTop + photoH / 2 + 20)
    }
    ctx.restore()

    // Frame styling
    ctx.save()
    const frameColors = {
      classic: ['#ea580c', '#eab308', '#16a34a'],
      royal: ['#7f1d1d', '#dc2626', '#d97706'],
      floral: ['#db2777', '#f472b6', '#fbcfe8'],
      gold: ['#b45309', '#f59e0b', '#fef3c7'],
      modern: ['#f97316', '#64748b', '#ffedd5'],
      festive: ['#7c3aed', '#ec4899', '#f59e0b'],
    }[frame] || ['#ea580c', '#eab308', '#16a34a']

    // Double border
    ctx.lineWidth = 16
    ctx.strokeStyle = frameColors[0]
    ctx.strokeRect(pad - 6, photoTop - 6, W - pad * 2 + 12, photoH + 12)
    ctx.lineWidth = 6
    ctx.strokeStyle = frameColors[1]
    ctx.strokeRect(pad - 12, photoTop - 12, W - pad * 2 + 24, photoH + 24)

    // Corner festive emojis
    ctx.font = '32px serif'
    ctx.textAlign = 'center'
    ctx.fillText('🪢', pad + 24, photoTop + 28)
    ctx.fillText('🪢', W - pad - 24, photoTop + 28)
    ctx.fillText('🪔', pad + 24, photoTop + photoH - 12)
    ctx.fillText('🪔', W - pad - 24, photoTop + photoH - 12)
    ctx.restore()

    // Top banner
    ctx.save()
    ctx.fillStyle = frameColors[0]
    ctx.beginPath()
    ctx.roundRect(W / 2 - 280, 20, 560, 58, 29)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 22px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🪢  HAPPY RAKSHA BANDHAN 2026  🪢', W / 2, 49)
    ctx.restore()

    // Stickers
    stickers.forEach((s) => {
      ctx.save()
      ctx.translate(s.x * W, s.y * H)
      ctx.scale(s.scale, s.scale)
      ctx.font = '52px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(s.emoji, 0, 0)
      ctx.restore()
    })

    // Bottom greeting text card
    const cardH = 114
    const cardY = H - 124
    ctx.save()
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.roundRect(W / 2 - 440, cardY, 880, cardH, 20)
    ctx.fill()
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const chosenFont = FONTS[fontIdx] || FONTS[0]
    let fontSize = 38
    ctx.font = `700 ${fontSize}px ${chosenFont}`
    const displayName = name.trim() || msg

    // Dynamic downscaling so long text never overflows the card!
    const maxTextW = 820
    while (ctx.measureText(displayName).width > maxTextW && fontSize > 18) {
      fontSize -= 2
      ctx.font = `700 ${fontSize}px ${chosenFont}`
    }

    ctx.fillText(displayName, W / 2, cardY + 42)
    ctx.fillStyle = '#64748b'
    ctx.font = '14px sans-serif'
    ctx.fillText('Made with ❤️  •  uptools.in  •  Share with love', W / 2, cardY + 80)
    ctx.restore()

    // Drag dashed indicator
    if (drag) {
      ctx.save()
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 3
      ctx.setLineDash([10, 6])
      ctx.strokeRect(pad, photoTop, W - pad * 2, photoH)
      ctx.restore()
    }
  }, [frame, sizeIdx, name, msg, fontIdx, textColor, img, stickers, drag])

  useEffect(() => {
    draw()
  }, [draw])

  const getPos = (e) => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    }
  }

  const onDown = (e) => {
    if (stickers.length === 0) return
    const p = getPos(e)
    let best = null
    let bestD = 0.09
    stickers.forEach((s) => {
      const d = Math.hypot(s.x - p.x, s.y - p.y)
      if (d < bestD) {
        bestD = d
        best = s
      }
    })
    if (best) setDrag({ id: best.id, sx: p.x, sy: p.y, bx: best.x, by: best.y })
  }

  const onMove = (e) => {
    if (!drag) return
    const p = getPos(e)
    const dx = p.x - drag.sx
    const dy = p.y - drag.sy
    setStickers((arr) =>
      arr.map((s) => (s.id === drag.id ? { ...s, x: drag.bx + dx, y: drag.by + dy } : s))
    )
  }

  const onUp = () => setDrag(null)

  const download = () => {
    const cvs = canvasRef.current
    if (!cvs) return
    const a = document.createElement('a')
    a.download = `rakhi-frame-${Date.now()}.png`
    a.href = cvs.toDataURL('image/png')
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const copyToClipboard = () => {
    const cvs = canvasRef.current
    if (!cvs) return
    cvs.toBlob(async (blob) => {
      if (blob) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {
          /* clipboard error */
        }
      }
    }, 'image/png')
  }

  const share = async () => {
    const cvs = canvasRef.current
    if (!cvs) return
    cvs.toBlob(async (blob) => {
      if (navigator.share && blob) {
        const file = new File([blob], 'rakhi-frame.png', { type: 'image/png' })
        try {
          await navigator.share({ files: [file], title: 'Happy Raksha Bandhan' })
        } catch {
          /* user cancelled or unsupported */
        }
      } else {
        window.open(
          `https://wa.me/?text=${encodeURIComponent('Happy Raksha Bandhan! 🪢 Made with uptools.in')}`,
          '_blank'
        )
      }
    }, 'image/png')
  }

  const faq = [
    { q: "How to make Rakhi photo with name?", a: "Upload your photo, choose a frame, type name/message, adjust color and drag stickers, then download HD PNG. Works on phone and desktop — no signup needed." },
    { q: "Can I add my photo to Rakhi frame?", a: "Yes — click Upload Photo, your image is auto-fitted into the frame. You can switch sizes (Square, Portrait, Story) for Instagram, WhatsApp Status or printing." },
    { q: "Is this Rakhi photo frame free?", a: "100% free, no watermark on the main photo area (small uptools.in credit at bottom). Download unlimited HD images." },
    { q: "What size is best for WhatsApp DP?", a: "Use Square 1:1 for WhatsApp DP and Instagram post, Portrait 4:5 for feed, Story 9:16 for WhatsApp/Instagram Stories." },
    { q: "Can I add Hindi text?", a: "Yes — type in Hindi directly in the Name/Message field. Choose a Hindi-friendly font and set your text color." }
  ]
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  }

  return (
    <ToolLayout
      title="Rakhi Photo Frame & Greeting Card Maker with Name & Photo 2026 - Free Online"
      desc="Add your photo to beautiful Rakhi frames — 6 festive designs, name on image, stickers & HD download. Make Happy Raksha Bandhan greeting cards for WhatsApp, Instagram & DP in seconds."
      icon="🖼️"
      iconBg="linear-gradient(135deg,#7f1d1d,#f59e0b)"
      slug="rakhi-photo-frame-maker"
      category="images"
      faq={faq}
      schema={schema}
      howItWorks={["Upload your photo","Choose frame & size (1:1 / 4:5 / 9:16)","Add name/message & stickers","Download HD or share"]}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-[380px,1fr] gap-5">
          {/* Controls Column */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
              {/* Upload Dropzone */}
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragOver(false)
                  if (e.dataTransfer.files?.[0]) processImageFile(e.dataTransfer.files[0])
                }}
                className={`min-h-[50px] p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition-colors ${
                  dragOver ? 'border-orange-600 bg-orange-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                }`}
              >
                <button
                  type="button"
                  className="min-h-[44px] w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-sm transition-colors"
                >
                  📸 Upload Sibling / Family Photo
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  {img ? '✓ Photo loaded — click or drop to replace' : 'JPG, PNG — auto-fitted & cropped'}
                </p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onUpload} />
              </div>

              {/* Frame Style */}
              <div>
                <div className="text-xs font-bold text-gray-900 mb-2">Frame Style</div>
                <div className="grid grid-cols-2 gap-2">
                  {FRAMES.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFrame(f.id)}
                      className={`min-h-[48px] p-2.5 rounded-xl border text-left transition-colors ${
                        frame === f.id
                          ? 'border-orange-600 bg-orange-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-gray-900">{f.name}</div>
                      <div className="text-[11px] text-gray-500">{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <div className="text-xs font-bold text-gray-900 mb-2">Card Dimensions</div>
                <div className="flex gap-2">
                  {SIZES.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSizeIdx(i)}
                      className={`min-h-[44px] flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        sizeIdx === i
                          ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message inputs */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900">Name / Custom Greeting on Card</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aman &amp; Priya"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Default greeting text"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="flex gap-2 pt-1">
                  <select
                    value={fontIdx}
                    onChange={(e) => setFontIdx(Number(e.target.value))}
                    className="flex-1 min-h-[44px] px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 text-xs font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {FONT_LABELS.map((f, i) => (
                      <option key={f} value={i}>{f}</option>
                    ))}
                  </select>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-12 min-h-[44px] rounded-xl border border-gray-300 p-1 bg-white cursor-pointer"
                  />
                </div>
              </div>

              {/* Stickers */}
              <div>
                <div className="text-xs font-bold text-gray-900 mb-2">Stickers — tap to add, drag on canvas to position</div>
                <div className="flex flex-wrap gap-2">
                  {STICKERS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSticker(s)}
                      className="min-w-[44px] min-h-[44px] rounded-xl bg-amber-50 border border-amber-300 text-xl hover:bg-amber-100 flex items-center justify-center transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {stickers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setStickers([])}
                    className="min-h-[44px] text-xs text-red-600 font-semibold mt-1 hover:underline"
                  >
                    Clear all stickers ({stickers.length})
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={download}
                className="min-h-[44px] flex-1 py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                ⬇️ Download HD PNG
              </button>
              <button
                type="button"
                onClick={copyToClipboard}
                className="min-h-[44px] px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
              <button
                type="button"
                onClick={share}
                className="min-h-[44px] px-5 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Share
              </button>
            </div>
          </div>

          {/* Canvas Workspace Column */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-start overflow-hidden">
            <div className="text-xs text-gray-500 font-medium mb-3">
              Canvas aspect: {SIZES[sizeIdx].label} ({SIZES[sizeIdx].w}×{SIZES[sizeIdx].h}px)
            </div>
            <canvas
              ref={canvasRef}
              onMouseDown={onDown}
              onMouseMove={onMove}
              onMouseUp={onUp}
              onMouseLeave={onUp}
              onTouchStart={(e) => onDown(e.touches[0])}
              onTouchMove={(e) => {
                e.preventDefault()
                onMove(e.touches[0])
              }}
              onTouchEnd={onUp}
              className="max-w-full h-auto rounded-2xl shadow-lg bg-white touch-none block"
              style={{
                aspectRatio: `${SIZES[sizeIdx].w} / ${SIZES[sizeIdx].h}`,
                maxHeight: '680px',
              }}
            />
          </div>
        </div>

        {/* SEO Information & Guide */}
        <div ref={resultRef} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Rakhi Photo Frame with Name — Make Greeting Cards in Seconds</h2>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">
            Add your favourite photo to a festive Rakhi frame, write your name and download a HD greeting card ready for WhatsApp, Instagram, DP or printing. No app needed — 6 designer frames, 3 sizes and stickers make every card personal.
          </p>
          <h3 className="font-bold text-gray-900 mt-6">How to create Rakhi photo frame?</h3>
          <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1 mt-2">
            <li>Upload your photo (or siblings&apos; photo) — auto-fitted to frame</li>
            <li>Pick a frame: Classic Saffron, Royal Maroon, Floral Pink, Golden Glow, Modern Minimal or Festive Pop</li>
            <li>Choose size: 1:1 for DP/post, 4:5 for Instagram feed, 9:16 for Story/Status</li>
            <li>Type name/message, pick font &amp; color, add 🪢🎁🪔 stickers and drag to position</li>
            <li>Download HD PNG or Share directly to WhatsApp/Instagram</li>
          </ol>
          <p className="text-sm text-gray-600 mt-4">
            <b>Keywords:</b> rakhi photo frame, rakhi greeting card maker, happy raksha bandhan photo with name, rakhi images with name editor, rakhi dp maker — all covered in one tool without watermark.
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
