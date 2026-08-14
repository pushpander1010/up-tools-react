import { useState, useRef, useEffect, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const STATUSES = [
  { text: 'Happy Independence Day 🇮🇳 Jai Hind! 🇮🇳', tag: 'Short' },
  { text: 'Freedom in mind, faith in words, pride in our hearts. Happy Independence Day! 🇮🇳', tag: 'Inspirational' },
  { text: 'Sare Jahan Se Achha, Hindustan Hamara. Jai Hind! 🇮🇳', tag: 'Patriotic' },
  { text: 'Proud to be an Indian. Happy Independence Day! 🇮🇳', tag: 'Short' },
  { text: '🇮🇳 The best way to find yourself is to lose yourself in the service of others — Mahatma Gandhi. Happy Independence Day!', tag: 'Quote' },
  { text: 'Freedom is never dear at any price. It is the breath of life. Happy Independence Day! 🇮🇳', tag: 'Quote' },
  { text: 'Azadi ka Amrit Mahotsav vibes! Saluting our freedom fighters today and every day. Jai Hind! 🇮🇳', tag: 'Patriotic' },
  { text: '🇮🇳 Happy Independence Day! Let freedom ring, let the tricolor fly high. 🧡🤍💚', tag: 'Short' },
  { text: 'We owe our freedom to the brave hearts who dreamt of an independent India. Respect & gratitude. 🇮🇳', tag: 'Inspirational' },
  { text: 'One nation, one vision, one pride. Happy Independence Day! Jai Hind! 🇮🇳', tag: 'Short' },
  { text: '🇮🇳 Let us remember the golden heritage of our country and feel proud of its rich culture. Happy Independence Day!', tag: 'Inspirational' },
  { text: 'My heart is Indian, my soul is Indian, and my pride is Indian. Happy Independence Day! 🇮🇳', tag: 'Patriotic' },
  { text: 'They gave us a free India. Let us give them a developed India. Jai Hind! 🇮🇳', tag: 'Quote' },
  { text: '🇮🇳 78 years of freedom, 78 years of pride. Salute to our heroes! 🧡🤍💚', tag: 'Patriotic' },
  { text: 'Where the mind is without fear and the head is held high — Tagore. Happy Independence Day! 🇮🇳', tag: 'Quote' },
  { text: 'Salute to the martyrs who laid down their lives for our freedom. 🇮🇳 Jai Hind!', tag: 'Patriotic' },
  { text: 'Happy Independence Day! May the tricolor always fly high in the sky of freedom. 🇮🇳', tag: 'Short' },
  { text: 'Freedom is the open window through which pours the sunlight of the human spirit. 🇮🇳', tag: 'Quote' },
  { text: 'Proud, patriotic, and free. Wishing you all a very Happy Independence Day! 🇮🇳', tag: 'Short' },
  { text: '🇮🇳 The land of unity in diversity. Celebrating 78 years of independence! 🧡🤍💚 Jai Hind!', tag: 'Patriotic' },
]

const TAG_COLORS = {
  'Short': 'text-cyan-400',
  'Inspirational': 'text-amber-400',
  'Patriotic': 'text-emerald-400',
  'Quote': 'text-purple-400',
}

const SAFRON = '#FF9933'
const GREEN = '#138808'
const NAVY = '#000080'

// Canvas working resolution — height computed from image aspect at load.
const CW = 1080

// 14 themed border frames. Each draw(ctx, W, H) overlays on top of the image.
const FRAMES = [
  { id: 'none', label: 'No Frame', icon: '⬜', draw() {} },
  {
    id: 'tricolor-top', label: 'Tricolor Top', icon: '🧡🤍💚',
    draw(ctx, W, H) {
      const b = Math.max(14, Math.round(H * 0.06))
      ctx.fillStyle = SAFRON; ctx.fillRect(0, 0, W, b)
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, b, W, b)
      ctx.fillStyle = GREEN; ctx.fillRect(0, b * 2, W, b)
    },
  },
  {
    id: 'saffron-top', label: 'Saffron Top', icon: '🧡',
    draw(ctx, W, H) {
      const b = Math.max(16, Math.round(H * 0.07))
      ctx.fillStyle = SAFRON; ctx.fillRect(0, 0, W, b)
    },
  },
  {
    id: 'tricolor-bottom', label: 'Tricolor Bottom', icon: '🤍💚',
    draw(ctx, W, H) {
      const b = Math.max(14, Math.round(H * 0.06))
      ctx.fillStyle = SAFRON; ctx.fillRect(0, H - b * 3, W, b)
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, H - b * 2, W, b)
      ctx.fillStyle = GREEN; ctx.fillRect(0, H - b, W, b)
    },
  },
  {
    id: 'tricolor-frame', label: 'Full Tricolor Frame', icon: '🖼️',
    draw(ctx, W, H) {
      const t = Math.max(12, Math.round(W * 0.03))
      ctx.fillStyle = SAFRON
      ctx.fillRect(0, 0, W, t); ctx.fillRect(0, H - t, W, t)
      ctx.fillRect(0, 0, t, H); ctx.fillRect(W - t, 0, t, H)
      ctx.fillStyle = GREEN
      const t2 = t * 2
      ctx.fillRect(t, t, W - t * 2, t); ctx.fillRect(t, H - t2, W - t * 2, t)
      ctx.fillRect(t, t, t, H - t * 2); ctx.fillRect(W - t2, t, t, H - t * 2)
      ctx.fillStyle = '#FFFFFF'
      const t3 = t * 3
      ctx.fillRect(t2, t2, W - t * 4, t); ctx.fillRect(t2, H - t3, W - t * 4, t)
      ctx.fillRect(t2, t2, t, H - t * 4); ctx.fillRect(W - t3, t2, t, H - t * 4)
    },
  },
  {
    id: 'tricolor-diagonal', label: 'Tricolor Diagonal', icon: '📐',
    draw(ctx, W, H) {
      const n = 3
      const seg = W / n
      for (let i = 0; i < n; i++) {
        ctx.fillStyle = [SAFRON, '#FFFFFF', GREEN][i % 3]
        ctx.beginPath()
        ctx.moveTo(i * seg, 0)
        ctx.lineTo((i + 1) * seg, 0)
        ctx.lineTo((i - n + 1) * seg, H)
        ctx.lineTo((i - n) * seg, H)
        ctx.closePath()
        ctx.fill()
      }
    },
  },
  {
    id: 'chakra-corner', label: 'Chakra + Tricolor', icon: '🧿',
    draw(ctx, W, H) {
      const b = Math.max(10, Math.round(W * 0.025))
      ctx.fillStyle = SAFRON
      ctx.fillRect(0, 0, W, b); ctx.fillRect(0, H - b, W, b)
      ctx.fillStyle = GREEN
      ctx.fillRect(0, b, W, b); ctx.fillRect(0, H - b * 2, W, b)
      const r = Math.max(28, Math.round(H * 0.12))
      const cx = W - r - b * 3, cy = r + b * 2
      ctx.strokeStyle = NAVY; ctx.fillStyle = NAVY; ctx.lineWidth = r * 0.14
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.12, 0, Math.PI * 2); ctx.fill()
      for (let i = 0; i < 24; i++) {
        const a = (i * Math.PI * 2) / 24
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(a) * r * 0.16, cy + Math.sin(a) * r * 0.16)
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
        ctx.stroke()
      }
    },
  },
  {
    id: 'flag-emojis', label: 'Flag Emoji Row', icon: '🇮🇳',
    draw(ctx, W, H) {
      const b = Math.max(40, Math.round(H * 0.11))
      ctx.fillStyle = 'rgba(0,0,0,0.45)'
      ctx.fillRect(0, 0, W, b)
      ctx.font = `${Math.round(b * 0.6)}px serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      for (let i = 0; i < 7; i++) ctx.fillText('🇮🇳', ((i + 0.5) / 7) * W, b / 2 + b * 0.05)
    },
  },
  {
    id: 'jai-hind-banner', label: 'Jai Hind Banner', icon: '✊',
    draw(ctx, W, H) {
      const b = Math.max(44, Math.round(H * 0.12))
      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.fillRect(0, 0, W, b)
      const u = Math.max(6, Math.round(b * 0.14))
      ctx.fillStyle = SAFRON; ctx.fillRect(0, b - u * 3, W, u)
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, b - u * 2, W, u)
      ctx.fillStyle = GREEN; ctx.fillRect(0, b - u, W, u)
      ctx.fillStyle = '#FFFFFF'
      ctx.font = `bold ${Math.round(b * 0.42)}px Arial, sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('🇮🇳  JAI HIND  🇮🇳', W / 2, b * 0.46)
    },
  },
  {
    id: 'tricolor-vignette', label: 'Tricolor Vignette', icon: '🌈',
    draw(ctx, W, H) {
      const g = ctx.createLinearGradient(0, 0, W, H)
      g.addColorStop(0, SAFRON); g.addColorStop(0.33, SAFRON)
      g.addColorStop(0.5, '#FFFFFF'); g.addColorStop(0.66, GREEN)
      g.addColorStop(1, GREEN)
      const inset = Math.max(14, Math.round(W * 0.035))
      ctx.save()
      ctx.strokeStyle = g
      ctx.lineWidth = inset * 2
      ctx.strokeRect(inset, inset, W - inset * 2, H - inset * 2)
      ctx.restore()
    },
  },
  {
    id: 'saffron-gold', label: 'Saffron + Gold', icon: '✨',
    draw(ctx, W, H) {
      const t = Math.max(12, Math.round(W * 0.03))
      ctx.fillStyle = SAFRON
      ctx.fillRect(0, 0, W, t); ctx.fillRect(0, H - t, W, t)
      ctx.fillRect(0, 0, t, H); ctx.fillRect(W - t, 0, t, H)
      ctx.strokeStyle = '#FFD700'; ctx.lineWidth = Math.max(3, t * 0.25)
      ctx.strokeRect(t * 0.8, t * 0.8, W - t * 1.6, H - t * 1.6)
    },
  },
  {
    id: 'tricolor-wave', label: 'Tricolor Bottom Wave', icon: '🌊',
    draw(ctx, W, H) {
      const h = Math.max(30, Math.round(H * 0.09))
      const bands = [SAFRON, '#FFFFFF', GREEN]
      bands.forEach((col, bi) => {
        ctx.fillStyle = col
        ctx.beginPath()
        ctx.moveTo(0, H)
        ctx.lineTo(0, H - h + bi * (h / 3))
        for (let x = 0; x <= W; x += 20) {
          const y = H - h + bi * (h / 3) + Math.sin((x / W) * Math.PI * 2 + bi) * (h / 6)
          ctx.lineTo(x, y)
        }
        ctx.lineTo(W, H)
        ctx.closePath()
        ctx.fill()
      })
    },
  },
  {
    id: 'ashoka-center', label: 'Ashoka Center', icon: '🕉️',
    draw(ctx, W, H) {
      const b = Math.max(34, Math.round(H * 0.1))
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillRect(0, (H - b) / 2, W, b)
      const r = b * 0.4
      const cx = W / 2, cy = H / 2
      ctx.strokeStyle = '#FFFFFF'; ctx.fillStyle = '#FFFFFF'; ctx.lineWidth = r * 0.14
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.12, 0, Math.PI * 2); ctx.fill()
      for (let i = 0; i < 24; i++) {
        const a = (i * Math.PI * 2) / 24
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(a) * r * 0.16, cy + Math.sin(a) * r * 0.16)
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
        ctx.stroke()
      }
    },
  },
  {
    id: 'tricolor-pillars', label: 'Tricolor Pillars', icon: '🏛️',
    draw(ctx, W, H) {
      const p = Math.max(14, Math.round(W * 0.035))
      const colors = [SAFRON, '#FFFFFF', GREEN]
      colors.forEach((col, i) => { ctx.fillStyle = col; ctx.fillRect(i * p, 0, p, H) })
      colors.forEach((col, i) => { ctx.fillStyle = col; ctx.fillRect(W - p * 3 + i * p, 0, p, H) })
    },
  },
]

export default function independence_day_status_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [current, setCurrent] = useState(0)
  const [copied, setCopied] = useState(false)

  // editor state
  const canvasRef = useRef(null)
  const fileRef = useRef(null)
  const [img, setImg] = useState(null) // dataURL
  const [natW, setNatW] = useState(0)
  const [natH, setNatH] = useState(0)
  const [canvasH, setCanvasH] = useState(0)
  const [scale, setScale] = useState(1)
  const [ox, setOx] = useState(0) // image offset x in canvas px
  const [oy, setOy] = useState(0)
  const [frame, setFrame] = useState('tricolor-top')
  const [drag, setDrag] = useState(null) // {startX,startY,startOx,startOy} or null

  const imgRef = useRef(null) // loaded HTMLImageElement

  // fit image on load
  const fitImage = useCallback((w, h) => {
    const ch = Math.round(CW * (h / w))
    setCanvasH(ch)
    setNatW(w); setNatH(h)
    setScale(1)
    setOx(0); setOy(0)
  }, [])

  const onUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const temp = new Image()
      temp.onload = () => {
        setImg(reader.result)
        imgRef.current = temp
        fitImage(temp.width, temp.height)
      }
      temp.src = reader.result
    }
    reader.readAsDataURL(file)
  }

  // main render: image (scaled+panned) + frame overlay
  const render = useCallback(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    ctx.clearRect(0, 0, CW, canvasH)
    // checkerboard for transparent bg
    ctx.fillStyle = '#14141c'
    ctx.fillRect(0, 0, CW, canvasH)

    if (imgRef.current && img) {
      const dw = natW * scale
      const dh = natH * scale
      ctx.drawImage(imgRef.current, ox, oy, dw, dh)
    }
    const f = FRAMES.find(f => f.id === frame) || FRAMES[0]
    f.draw(ctx, CW, canvasH)
  }, [img, natW, natH, canvasH, scale, ox, oy, frame])

  // redraw whenever any editor state changes
  useEffect(() => {
    if (canvasH > 0) {
      const cvs = canvasRef.current
      cvs.width = CW
      cvs.height = canvasH
      render()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, natW, natH, canvasH, scale, ox, oy, frame])

  // canvas pointer events → pan
  const getCanvasPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const sx = CW / rect.width
    const sy = canvasH / rect.height
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy }
  }

  const onPointerDown = (e) => {
    e.preventDefault()
    const p = getCanvasPoint(e)
    setDrag({ sx: p.x, sy: p.y, sox: ox, soy: oy })
  }
  const onPointerMove = (e) => {
    if (!drag) return
    const p = getCanvasPoint(e)
    setOx(drag.sox + (p.x - drag.sx))
    setOy(drag.soy + (p.y - drag.sy))
  }
  const onPointerUp = () => setDrag(null)

  const zoom = (delta) => {
    const next = Math.min(5, Math.max(0.5, scale + delta))
    setScale(next)
  }

  const resetView = () => {
    setScale(1); setOx(0); setOy(0)
  }

  const download = () => {
    jumpTo()
    const cvs = canvasRef.current
    if (!cvs) return
    const link = document.createElement('a')
    link.download = 'independence-day-status.png'
    link.href = cvs.toDataURL('image/png')
    link.click()
  }

  const s = STATUSES[current]

  return (
    <ToolLayout
      title="Independence Day Status Generator"
      desc="Create patriotic statuses for WhatsApp, Instagram and Facebook — and turn your own photo into a tricolor status with 14 frames, pan/zoom and crop."
      icon="🧡" iconBg="rgba(255,153,51,0.10)"
      category="text" slug="independence-day-status-generator"
      faq={[
        { q: 'What is the Independence Day Status Generator?', a: 'A free tool for ready-made patriotic statuses and captions, plus an editor that adds 14 patriotic frames to your own photo.' },
        { q: 'How do I edit my photo?', a: 'Upload it, then drag to move it, use zoom buttons to resize, and pick a frame — it applies instantly. Download when done.' },
        { q: 'How many frames are available?', a: 'There are 14 themed frames — tricolor strips, full frames, chakra designs, banners and more.' },
        { q: 'Is it free?', a: 'Yes, everything is completely free with no sign-up.' },
      ]}
      howItWorks={[
        'Click "New Status" to cycle through patriotic statuses and captions.',
        'Copy the text straight to WhatsApp, Instagram, or Facebook.',
        'Or upload your own photo — drag to move, zoom to resize, pick a frame (auto-applies), then download.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Independence Day Status Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/independence-day-status-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Status generator */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Patriotic Status / Caption</h3>
          <div className="rounded-xl bg-black/30 border border-white/[0.06] p-5 min-h-[90px] flex items-center">
            <p className="text-lg text-white font-medium leading-relaxed">{s.text}</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] ${TAG_COLORS[s.tag] || 'text-slate-300'}`}>{s.tag}</span>
            <span className="text-xs text-slate-500 font-semibold">#{current + 1} / {STATUSES.length}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => { setCopied(false); setCurrent(i => { let n = Math.floor(Math.random() * STATUSES.length); if (n === i) n = (n + 1) % STATUSES.length; return n }) }} className="px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg text-sm">
              🎲 New Status
            </button>
            <button onClick={async () => {
              try { await navigator.clipboard.writeText(s.text) } catch { const ta = document.createElement('textarea'); ta.value = s.text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta) }
              setCopied(true); setTimeout(() => setCopied(false), 1500)
            }} className="px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg text-sm">
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>

        {/* Photo editor */}
        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Turn Your Photo Into a Status</h3>

          <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />

          {!img ? (
            <button onClick={() => fileRef.current?.click()}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg text-sm border-2 border-dashed border-white/10">
              📷 Upload Your Photo
            </button>
          ) : (
            <>
              <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-black/30 select-none cursor-grab active:cursor-grabbing touch-none"
                onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
                onWheel={e => { e.preventDefault(); zoom(e.deltaY > 0 ? -0.1 : 0.1) }}>
                <canvas ref={canvasRef} className="w-full h-auto block pointer-events-none" style={{ touchAction: 'none' }} />
              </div>

              {/* controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => zoom(-0.25)} className="w-9 h-9 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold border border-white/[0.08]">−</button>
                  <span className="text-xs font-bold text-slate-300 w-14 text-center">{Math.round(scale * 100)}%</span>
                  <button onClick={() => zoom(0.25)} className="w-9 h-9 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold border border-white/[0.08]">+</button>
                </div>
                <button onClick={resetView} className="px-3.5 py-2 rounded-lg text-xs font-bold bg-white/[0.08] hover:bg-white/[0.14] text-slate-300 border border-white/[0.08]">
                  ↺ Reset
                </button>
                <span className="text-[11px] text-slate-500 ml-auto">Drag to move • scroll to zoom</span>
              </div>
            </>
          )}

          {/* Frames — auto-apply on select */}
          {img && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Choose a Frame (applies instantly)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FRAMES.map(f => (
                    <button key={f.id} onClick={() => setFrame(f.id)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-bold text-left transition-all border flex items-center gap-2 ${frame === f.id ? 'bg-indigo-600/20 text-white border-indigo-500/40' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] border-white/[0.08]'}`}>
                      <span className="text-base">{f.icon}</span>
                      <span className="truncate">{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <button onClick={() => fileRef.current?.click()} className="px-5 py-3 rounded-xl font-bold text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] transition-all text-sm">
                  📷 Change Photo
                </button>
                <button onClick={download} className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg text-sm">
                  ⬇ Download Status
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
