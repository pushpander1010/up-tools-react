import { useState, useRef } from 'react'
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

// 14 themed border frames. Each draw(ctx, W, H) overlays on top of the image.
const FRAMES = [
  {
    id: 'none', label: 'No Frame', icon: '⬜',
    draw() {},
  },
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
      // chakra in top-right
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
      const emojis = ['🇮🇳', '🇮🇳', '🇮🇳', '🇮🇳', '🇮🇳', '🇮🇳', '🇮🇳']
      emojis.forEach((e, i) => {
        const x = ((i + 0.5) / emojis.length) * W
        ctx.fillText(e, x, b / 2 + b * 0.05)
      })
    },
  },
  {
    id: 'jai-hind-banner', label: 'Jai Hind Banner', icon: '✊',
    draw(ctx, W, H) {
      const b = Math.max(44, Math.round(H * 0.12))
      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.fillRect(0, 0, W, b)
      // tricolor underline
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
      // dark navy center bar with chakra
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
      colors.forEach((col, i) => {
        ctx.fillStyle = col
        ctx.fillRect(i * p, 0, p, H)
      })
      // right pillar
      colors.forEach((col, i) => {
        ctx.fillStyle = col
        ctx.fillRect(W - p * 3 + i * p, 0, p, H)
      })
    },
  },
]

export default function independence_day_status_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [current, setCurrent] = useState(0)
  const [copied, setCopied] = useState(false)
  const [img, setImg] = useState(null)
  const [frame, setFrame] = useState('tricolor-top')
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileRef = useRef(null)
  const imgCanvasRef = useRef(null)

  const randomize = () => {
    setCopied(false)
    setCurrent(i => {
      let n = Math.floor(Math.random() * STATUSES.length)
      if (n === i) n = (n + 1) % STATUSES.length
      return n
    })
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(STATUSES[current].text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      const ta = document.createElement('textarea')
      ta.value = STATUSES[current].text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const onUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImg(reader.result)
      setDownloadUrl(null)
      setPreviewUrl(null)
    }
    reader.readAsDataURL(file)
  }

  const renderFramed = (onDone) => {
    if (!img) return
    const cvs = imgCanvasRef.current
    const temp = new Image()
    temp.onload = () => {
      const W = 1080
      const H = Math.round(W * (temp.height / temp.width))
      cvs.width = W
      cvs.height = H
      const ctx = cvs.getContext('2d')
      ctx.drawImage(temp, 0, 0, W, H)
      const f = FRAMES.find(f => f.id === frame) || FRAMES[0]
      f.draw(ctx, W, H)
      const url = cvs.toDataURL('image/png')
      setDownloadUrl(url)
      if (onDone) onDone(url)
    }
    temp.src = img
  }

  const applyFrame = () => {
    jumpTo()
    setPreviewUrl(null)
    renderFramed((url) => setPreviewUrl(url))
  }

  const downloadImg = () => {
    jumpTo()
    if (downloadUrl) {
      const link = document.createElement('a')
      link.download = 'independence-day-frame.png'
      link.href = downloadUrl
      link.click()
      return
    }
    renderFramed((url) => {
      const link = document.createElement('a')
      link.download = 'independence-day-frame.png'
      link.href = url
      link.click()
    })
  }

  const s = STATUSES[current]

  return (
    <ToolLayout
      title="Independence Day Status Generator"
      desc="Get ready-to-share Happy Independence Day statuses and captions for WhatsApp, Instagram and Facebook — plus add one of 14 patriotic frames to your own photo. Jai Hind! 🇮🇳"
      icon="🧡" iconBg="rgba(255,153,51,0.10)"
      category="text" slug="independence-day-status-generator"
      faq={[
        { q: 'What is the Independence Day Status Generator?', a: 'A free tool that gives you ready-made patriotic statuses and captions for WhatsApp, Instagram, and Facebook, and lets you add a patriotic frame to your own photo.' },
        { q: 'How many frames are available?', a: 'There are 14 themed frames — tricolor strips, full frames, chakra designs, banners and more.' },
        { q: 'Can I use my own photo?', a: 'Yes — upload any photo, pick a frame, apply it, then download as a PNG.' },
        { q: 'Is it free?', a: 'Yes, everything on this page is completely free with no sign-up.' },
      ]}
      howItWorks={[
        'Click "New Status" to cycle through patriotic statuses and captions.',
        'Copy the text straight to WhatsApp, Instagram, or Facebook.',
        'Or upload your own photo, pick from 14 frames, apply and download.',
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
            <button onClick={randomize} className="px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg text-sm">
              🎲 New Status
            </button>
            <button onClick={copy} className="px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg text-sm">
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>

        {/* Own image frame */}
        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Add a Patriotic Frame to Your Photo</h3>
          <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
          <button onClick={() => fileRef.current?.click()}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg text-sm">
            📷 Upload Your Photo
          </button>

          {img && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FRAMES.map(f => (
                  <button key={f.id} onClick={() => setFrame(f.id)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-bold text-left transition-all border flex items-center gap-2 ${frame === f.id ? 'bg-indigo-600/20 text-white border-indigo-500/40' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] border-white/[0.08]'}`}>
                    <span className="text-base">{f.icon}</span>
                    <span className="truncate">{f.label}</span>
                  </button>
                ))}
              </div>
              <div className="rounded-xl overflow-hidden border border-white/[0.08]">
                <img src={img} alt="Your upload" className="w-full h-auto" />
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={applyFrame} className="px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg text-sm">
                  ✨ Apply Frame
                </button>
                <button onClick={downloadImg} className="px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg text-sm">
                  ⬇ Download
                </button>
              </div>
            </>
          )}

          {previewUrl && (
            <div className="rounded-xl overflow-hidden border-2 border-emerald-500/30">
              <img src={previewUrl} alt="Framed result" className="w-full h-auto" />
            </div>
          )}
        </div>

        <canvas ref={imgCanvasRef} className="hidden" />
      </div>
    </ToolLayout>
  )
}
