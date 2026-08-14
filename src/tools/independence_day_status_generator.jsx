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
const CW = 1080

let _id = 0
const nid = () => `l${++_id}_${Date.now()}`

// Each element draws in a normalized [-0.5, 0.5] box around origin.
// ctx is already translated+rotated+scaled so size units == 1 element.
const ELEMENTS = [
  {
    kind: 'text', label: 'Text', icon: '✏️', cat: 'Text',
    default: { text: 'JAI HIND', color: '#FFFFFF', stroke: true },
    draw(ctx, e, s) {
      const fs = s
      ctx.font = `bold ${fs}px Arial, sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      if (e.stroke) { ctx.lineWidth = fs * 0.16; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(0,0,0,0.85)'; ctx.strokeText(e.text, 0, 0) }
      ctx.fillStyle = e.color
      ctx.fillText(e.text, 0, 0)
    },
  },
  {
    kind: 'jai-hind', label: 'Jai Hind Banner', icon: '✊', cat: 'Text',
    default: { text: 'JAI HIND' },
    draw(ctx, e, s) {
      const w = s * 2, h = s * 0.62
      const fs = h * 0.5
      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      roundRect(ctx, -w / 2, -h / 2, w, h, h * 0.18); ctx.fill()
      const u = h * 0.1
      ctx.fillStyle = SAFRON; ctx.fillRect(-w / 2, h / 2 - u * 3, w, u)
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-w / 2, h / 2 - u * 2, w, u)
      ctx.fillStyle = GREEN; ctx.fillRect(-w / 2, h / 2 - u, w, u)
      ctx.fillStyle = '#FFFFFF'
      ctx.font = `bold ${fs}px Arial, sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('🇮🇳  ' + e.text + '  🇮🇳', 0, -h * 0.08)
    },
  },
  {
    kind: 'tricolor-bar', label: 'Tricolor Bar', icon: '🧡🤍💚', cat: 'Strips',
    default: {},
    draw(ctx, e, s) {
      const w = s * 2, h = s * 0.55
      const b = h / 3
      ctx.fillStyle = SAFRON; ctx.fillRect(-w / 2, -h / 2, w, b)
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-w / 2, -h / 2 + b, w, b)
      ctx.fillStyle = GREEN; ctx.fillRect(-w / 2, -h / 2 + b * 2, w, b)
    },
  },
  {
    kind: 'saffron-bar', label: 'Saffron Bar', icon: '🧡', cat: 'Strips',
    default: {},
    draw(ctx, e, s) {
      ctx.fillStyle = SAFRON
      ctx.fillRect(-s, -s * 0.28, s * 2, s * 0.56)
    },
  },
  {
    kind: 'frame', label: 'Tricolor Frame', icon: '🖼️', cat: 'Strips',
    default: {},
    draw(ctx, e, s) {
      const w = s * 2, h = s * 1.4
      const t = Math.max(4, s * 0.09)
      ctx.fillStyle = SAFRON
      ctx.fillRect(-w / 2, -h / 2, w, t); ctx.fillRect(-w / 2, h / 2 - t, w, t)
      ctx.fillRect(-w / 2, -h / 2, t, h); ctx.fillRect(w / 2 - t, -h / 2, t, h)
      ctx.fillStyle = GREEN
      ctx.fillRect(-w / 2 + t, -h / 2 + t, w - t * 2, t); ctx.fillRect(-w / 2 + t, h / 2 - t * 2, w - t * 2, t)
      ctx.fillRect(-w / 2 + t, -h / 2 + t, t, h - t * 2); ctx.fillRect(w / 2 - t * 2, -h / 2 + t, t, h - t * 2)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(-w / 2 + t * 2, -h / 2 + t * 2, w - t * 4, t); ctx.fillRect(-w / 2 + t * 2, h / 2 - t * 3, w - t * 4, t)
      ctx.fillRect(-w / 2 + t * 2, -h / 2 + t * 2, t, h - t * 4); ctx.fillRect(w / 2 - t * 3, -h / 2 + t * 2, t, h - t * 4)
    },
  },
  {
    kind: 'chakra', label: 'Ashoka Chakra', icon: '🧿', cat: 'Symbols',
    default: {},
    draw(ctx, e, s) {
      const r = s / 2
      ctx.strokeStyle = NAVY; ctx.fillStyle = NAVY; ctx.lineWidth = r * 0.14
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.arc(0, 0, r * 0.12, 0, Math.PI * 2); ctx.fill()
      for (let i = 0; i < 24; i++) {
        const a = (i * Math.PI * 2) / 24
        ctx.beginPath()
        ctx.moveTo(Math.cos(a) * r * 0.16, Math.sin(a) * r * 0.16)
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
        ctx.stroke()
      }
    },
  },
  {
    kind: 'flag-emoji', label: 'Flag Emoji', icon: '🇮🇳', cat: 'Stickers',
    default: {},
    draw(ctx, e, s) {
      ctx.font = `${s}px serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('🇮🇳', 0, 0)
    },
  },
  {
    kind: 'sticker', label: 'Emoji Sticker', icon: '🧡', cat: 'Stickers',
    default: { emoji: '🧡' },
    draw(ctx, e, s) {
      ctx.font = `${s}px serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(e.emoji, 0, 0)
    },
  },
  {
    kind: 'diagonal', label: 'Diagonal Tricolor', icon: '📐', cat: 'Strips',
    default: {},
    draw(ctx, e, s) {
      const w = s * 2, h = s * 1.6
      const n = 3
      for (let i = 0; i < n; i++) {
        ctx.fillStyle = [SAFRON, '#FFFFFF', GREEN][i % 3]
        ctx.beginPath()
        ctx.moveTo(-w / 2 + (i * w) / n, -h / 2)
        ctx.lineTo(-w / 2 + ((i + 1) * w) / n, -h / 2)
        ctx.lineTo(-w / 2 + ((i - n + 1) * w) / n, h / 2)
        ctx.lineTo(-w / 2 + ((i - n) * w) / n, h / 2)
        ctx.closePath(); ctx.fill()
      }
    },
  },
]

const STICKER_EMOJIS = ['🧡', '🤍', '💚', '🇮🇳', '🧿', '✊', '🎉', '🎆', '🕊️', '🦁', '🌏', '🙏']

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export default function independence_day_status_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [current, setCurrent] = useState(0)
  const [copied, setCopied] = useState(false)

  // editor state
  const canvasRef = useRef(null)
  const fileRef = useRef(null)
  const [img, setImg] = useState(null)
  const imgRef = useRef(null)
  const [canvasH, setCanvasH] = useState(0)
  const [layers, setLayers] = useState([])
  const [selected, setSelected] = useState(null)
  const [drag, setDrag] = useState(null) // {mode, id, sx, sy, baseX, baseY, baseRot, baseSize, startAngle}

  const imgRefReady = useRef(null)

  // working size for new elements (fraction of canvas width)
  const [elSizeFrac, setElSizeFrac] = useState(0.3)

  const onUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const temp = new Image()
      temp.onload = () => {
        imgRef.current = temp
        imgRefReady.current = reader.result
        setCanvasH(Math.round(CW * (temp.height / temp.width)))
        setImg(reader.result)
        setLayers([])
        setSelected(null)
      }
      temp.src = reader.result
    }
    reader.readAsDataURL(file)
  }

  // Render everything
  const render = useCallback(() => {
    const cvs = canvasRef.current
    if (!cvs || canvasH === 0) return
    const ctx = cvs.getContext('2d')
    ctx.clearRect(0, 0, CW, canvasH)
    ctx.fillStyle = '#14141c'
    ctx.fillRect(0, 0, CW, canvasH)

    // base image fit
    if (imgRef.current) {
      ctx.drawImage(imgRef.current, 0, 0, CW, canvasH)
    }

    // layers
    for (const l of layers) {
      ctx.save()
      ctx.translate(l.x * CW, l.y * canvasH)
      ctx.rotate(l.rot * Math.PI / 180)
      const s = l.size
      const def = ELEMENTS.find(el => el.kind === l.kind)
      def.draw(ctx, l, s)
      ctx.restore()
    }

    // selection box
    if (selected) {
      const l = layers.find(x => x.id === selected)
      if (l) {
        const s = l.size
        const box = s * 0.9
        ctx.save()
        ctx.translate(l.x * CW, l.y * canvasH)
        ctx.rotate(l.rot * Math.PI / 180)
        ctx.setLineDash([8, 6])
        ctx.strokeStyle = '#38bdf8'
        ctx.lineWidth = 3
        ctx.strokeRect(-box, -box, box * 2, box * 2)
        ctx.setLineDash([])
        // resize handle bottom-right
        ctx.fillStyle = '#38bdf8'
        ctx.beginPath(); ctx.arc(box, box, 9, 0, Math.PI * 2); ctx.fill()
        // rotate handle top
        ctx.beginPath(); ctx.arc(0, -box - 26, 9, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      }
    }
  }, [canvasH, layers, selected])

  useEffect(() => {
    if (canvasH > 0) {
      const cvs = canvasRef.current
      cvs.width = CW
      cvs.height = canvasH
      render()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasH, layers, selected, render])

  // pointer → canvas coords
  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (CW / rect.width),
      y: (e.clientY - rect.top) * (canvasH / rect.height),
    }
  }

  // topmost layer under point
  const layerAt = (px, py) => {
    for (let i = layers.length - 1; i >= 0; i--) {
      const l = layers[i]
      const dx = (px - l.x * CW) / Math.max(1, l.size)
      const dy = (py - l.y * canvasH) / Math.max(1, l.size)
      // rotate point into element space
      const a = -l.rot * Math.PI / 180
      const rx = dx * Math.cos(a) - dy * Math.sin(a)
      const ry = dx * Math.sin(a) + dy * Math.cos(a)
      if (Math.abs(rx) < 1.05 && Math.abs(ry) < 1.05) return l
    }
    return null
  }

  const onPointerDown = (e) => {
    e.preventDefault()
    if (!img) return
    const p = getPoint(e)
    const hit = layerAt(p.x, p.y)
    if (hit) {
      setSelected(hit.id)
      // is it on the resize handle? (bottom-right of selection box)
      const sel = layers.find(x => x.id === hit.id)
      const a = -sel.rot * Math.PI / 180
      const dx = p.x - sel.x * CW, dy = p.y - sel.y * canvasH
      const rx = dx * Math.cos(a) - dy * Math.sin(a)
      const ry = dx * Math.sin(a) + dy * Math.cos(a)
      const box = sel.size * 0.9
      if (Math.hypot(rx - box, ry - box) < 24) {
        setDrag({ mode: 'resize', id: hit.id, sx: p.x, sy: p.y, baseSize: sel.size })
      } else if (Math.hypot(rx, ry + box + 26) < 24) {
        setDrag({ mode: 'rotate', id: hit.id, sx: p.x, sy: p.y, baseRot: sel.rot, cx: sel.x * CW, cy: sel.y * canvasH })
      } else {
        setDrag({ mode: 'move', id: hit.id, sx: p.x, sy: p.y, baseX: sel.x, baseY: sel.y })
      }
    } else {
      setSelected(null)
      setDrag({ mode: 'pan', sx: p.x, sy: p.y })
    }
  }

  const onPointerMove = (e) => {
    if (!drag) return
    const p = getPoint(e)
    if (drag.mode === 'pan') return // no pan (image is fit) — could add zoom later
    if (drag.mode === 'move') {
      const dx = (p.x - drag.sx) / CW
      const dy = (p.y - drag.sy) / canvasH
      setLayers(ls => ls.map(l => l.id === drag.id ? { ...l, x: drag.baseX + dx, y: drag.baseY + dy } : l))
    } else if (drag.mode === 'resize') {
      const dx = (p.x - drag.sx) / CW
      const dy = (p.y - drag.sy) / canvasH
      const grow = Math.max(dx, dy)
      setLayers(ls => ls.map(l => l.id === drag.id ? { ...l, size: Math.max(0.02, drag.baseSize * (1 + grow * 4)) } : l))
    } else if (drag.mode === 'rotate') {
      const cx = drag.cx, cy = drag.cy
      const ang = Math.atan2(p.y - cy, p.x - cx) * 180 / Math.PI
      setLayers(ls => ls.map(l => l.id === drag.id ? { ...l, rot: Math.round(ang) } : l))
    }
  }

  const onPointerUp = () => setDrag(null)

  const addElement = (kind, overrides = {}) => {
    const def = ELEMENTS.find(el => el.kind === kind)
    const size = Math.round(CW * elSizeFrac)
    const l = {
      id: nid(), kind, x: 0.5, y: 0.5, rot: 0, size,
      ...def.default, ...overrides,
    }
    setLayers(ls => [...ls, l])
    setSelected(l.id)
  }

  const updateLayer = (id, patch) => setLayers(ls => ls.map(l => l.id === id ? { ...l, ...patch } : l))
  const removeLayer = (id) => { setLayers(ls => ls.filter(l => l.id !== id)); setSelected(null) }
  const duplicateLayer = (id) => {
    setLayers(ls => {
      const l = ls.find(x => x.id === id)
      if (!l) return ls
      const copy = { ...l, id: nid(), x: l.x + 0.08, y: l.y + 0.08 }
      return [...ls, copy]
    })
    setSelected(null)
  }
  const moveLayer = (id, dir) => {
    setLayers(ls => {
      const i = ls.findIndex(x => x.id === id)
      if (i < 0) return ls
      const j = i + dir
      if (j < 0 || j >= ls.length) return ls
      const arr = [...ls]
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      return arr
    })
  }

  const sel = selected ? layers.find(x => x.id === selected) : null
  const selDef = sel ? ELEMENTS.find(el => el.kind === sel.kind) : null

  return (
    <ToolLayout
      title="Independence Day Status Generator"
      desc="Create patriotic statuses — and build your own photo status by adding multiple stickers, text, tricolor bars and frames that you can move, resize and rotate anywhere."
      icon="🧡" iconBg="rgba(255,153,51,0.10)"
      category="text" slug="independence-day-status-generator"
      faq={[
        { q: 'What is the Independence Day Status Generator?', a: 'A free tool for ready-made patriotic statuses plus a sticker editor where you add and arrange elements on your own photo.' },
        { q: 'How does the editor work?', a: 'Upload a photo, then tap any element below to add it. Drag to move, use the corner handle to resize, the top handle to rotate. Use Up/Down to reorder layers.' },
        { q: 'Can I add the same sticker multiple times?', a: 'Yes — every tap adds a new copy you can position independently anywhere on the image.' },
        { q: 'Is it free?', a: 'Yes, everything is completely free with no sign-up.' },
      ]}
      howItWorks={[
        'Click "New Status" to cycle through patriotic statuses and captions, and copy them.',
        'Upload your own photo.',
        'Add text, tricolor bars, chakra, flag emoji and stickers — move, resize, rotate, and stack them.',
        'Download your finished status.',
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
            <p className="text-lg text-white font-medium leading-relaxed">{STATUSES[current].text}</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] ${TAG_COLORS[STATUSES[current].tag] || 'text-slate-300'}`}>{STATUSES[current].tag}</span>
            <span className="text-xs text-slate-500 font-semibold">#{current + 1} / {STATUSES.length}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => { setCopied(false); setCurrent(i => { let n = Math.floor(Math.random() * STATUSES.length); if (n === i) n = (n + 1) % STATUSES.length; return n }) }} className="px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg text-sm">
              🎲 New Status
            </button>
            <button onClick={async () => {
              try { await navigator.clipboard.writeText(STATUSES[current].text) } catch { const ta = document.createElement('textarea'); ta.value = STATUSES[current].text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta) }
              setCopied(true); setTimeout(() => setCopied(false), 1500)
            }} className="px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg text-sm">
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>

        {/* Sticker editor */}
        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Build Your Own Status</h3>

          <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />

          {!img ? (
            <button onClick={() => fileRef.current?.click()}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg text-sm border-2 border-dashed border-white/10">
              📷 Upload Your Photo
            </button>
          ) : (
            <>
              <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-black/30 select-none cursor-move touch-none"
                onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
                <canvas ref={canvasRef} className="w-full h-auto block pointer-events-none" style={{ touchAction: 'none' }} />
              </div>

              {/* element library */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Add Elements (tap to add)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <button onClick={() => fileRef.current?.click()} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/[0.08] hover:bg-white/[0.14] text-slate-300 border border-white/[0.08]">📷 Change Photo</button>
                  <span className="text-xs text-slate-500 self-center font-semibold">Element size:</span>
                  <button onClick={() => setElSizeFrac(0.2)} className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${elSizeFrac === 0.2 ? 'bg-indigo-600 text-white' : 'bg-white/[0.08] text-slate-300 border border-white/[0.08]'}`}>S</button>
                  <button onClick={() => setElSizeFrac(0.3)} className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${elSizeFrac === 0.3 ? 'bg-indigo-600 text-white' : 'bg-white/[0.08] text-slate-300 border border-white/[0.08]'}`}>M</button>
                  <button onClick={() => setElSizeFrac(0.45)} className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${elSizeFrac === 0.45 ? 'bg-indigo-600 text-white' : 'bg-white/[0.08] text-slate-300 border border-white/[0.08]'}`}>L</button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {ELEMENTS.map(el => (
                    <button key={el.kind} onClick={() => addElement(el.kind)}
                      className="px-3 py-2.5 rounded-xl text-sm font-bold text-left transition-all border bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] border-white/[0.08] flex items-center gap-2">
                      <span className="text-base">{el.icon}</span>
                      <span className="truncate">{el.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {STICKER_EMOJIS.map(em => (
                    <button key={em} onClick={() => addElement('sticker', { emoji: em })}
                      className="w-10 h-10 rounded-xl text-xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.08] flex items-center justify-center">
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* selected element controls */}
              {sel && (
                <div className="rounded-xl bg-indigo-600/10 border border-indigo-500/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-indigo-300">{selDef.icon} {selDef.label}</h4>
                    <span className="text-[10px] text-slate-500">drag = move • corner = resize • top = rotate</span>
                  </div>

                  {sel.kind === 'text' && (
                    <div className="flex flex-wrap gap-2">
                      <input value={sel.text} onChange={e => updateLayer(sel.id, { text: e.target.value })} maxLength={40}
                        className="flex-1 min-w-[140px] bg-white/[0.06] border-2 border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-semibold outline-none focus:border-indigo-500/40" />
                      <select value={sel.color} onChange={e => updateLayer(sel.id, { color: e.target.value })}
                        className="bg-white/[0.08] border border-white/[0.1] rounded-lg px-2 py-2 text-white text-sm [color-scheme:dark]">
                        {['#FFFFFF', '#FF9933', '#138808', '#000080', '#FFD700', '#000000'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <label className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                        <input type="checkbox" checked={sel.stroke} onChange={e => updateLayer(sel.id, { stroke: e.target.checked })} /> Outline
                      </label>
                    </div>
                  )}
                  {sel.kind === 'jai-hind' && (
                    <input value={sel.text} onChange={e => updateLayer(sel.id, { text: e.target.value })} maxLength={30}
                      className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-semibold outline-none focus:border-indigo-500/40" />
                  )}
                  {sel.kind === 'sticker' && (
                    <div className="flex flex-wrap gap-1.5">
                      {STICKER_EMOJIS.map(em => (
                        <button key={em} onClick={() => updateLayer(sel.id, { emoji: em })}
                          className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center ${sel.emoji === em ? 'bg-indigo-600' : 'bg-white/[0.08] border border-white/[0.08]'}`}>{em}</button>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-xs font-semibold text-slate-300">Resize
                      <input type="range" min={0.05} max={1.5} step={0.01} value={sel.size / CW}
                        onChange={e => updateLayer(sel.id, { size: Math.round(e.target.value * CW) })}
                        className="w-full accent-indigo-500" />
                    </label>
                    <label className="text-xs font-semibold text-slate-300">Rotate {sel.rot}°
                      <input type="range" min={-180} max={180} step={1} value={sel.rot}
                        onChange={e => updateLayer(sel.id, { rot: Number(e.target.value) })}
                        className="w-full accent-indigo-500" />
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => moveLayer(sel.id, -1)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/[0.08] hover:bg-white/[0.14] text-slate-300 border border-white/[0.08]">⬆ Up</button>
                    <button onClick={() => moveLayer(sel.id, 1)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/[0.08] hover:bg-white/[0.14] text-slate-300 border border-white/[0.08]">⬇ Down</button>
                    <button onClick={() => duplicateLayer(sel.id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/[0.08] hover:bg-white/[0.14] text-slate-300 border border-white/[0.08]">⧉ Duplicate</button>
                    <button onClick={() => removeLayer(sel.id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30">🗑 Delete</button>
                    <span className="text-[10px] text-slate-500 self-center ml-auto">{layers.length} element{layers.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              )}

              {!sel && img && layers.length > 0 && (
                <p className="text-xs text-slate-500">Tip: tap an element on the canvas to select it, then resize / rotate / reorder.</p>
              )}

              <div className="flex flex-wrap gap-3 pt-1">
                <button onClick={() => setLayers([])} className="px-4 py-3 rounded-xl font-bold text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] transition-all text-sm">
                  🗑 Clear All
                </button>
                <button onClick={() => { jumpTo(); const cvs = canvasRef.current; if (cvs) { const a = document.createElement('a'); a.download = 'independence-day-status.png'; a.href = cvs.toDataURL('image/png'); a.click() } }} className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg text-sm">
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
