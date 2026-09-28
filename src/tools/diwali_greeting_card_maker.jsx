import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const PRESETS = [
  { label: "Happy Diwali", msg: "Happy Diwali! May the festival of lights bring joy, prosperity, and peace to your life." },
  { label: "Warm Wishes", msg: "Wishing you a sparkling Diwali filled with love, laughter, and light!" },
  { label: "Prosperity", msg: "May this Diwali illuminate your life with new hopes and abundant prosperity." },
  { label: "Family Love", msg: "Happy Diwali to you and your family! May the divine lights bless us all." },
  { label: "New Beginnings", msg: "May every Diwali light bring a new beginning and fill your heart with happiness." },
]

const THEMES = [
  { id: 'midnight', label: 'Midnight Diyas', bg1: '#0a0a2e', bg2: '#1a0a3e', accent: '#f59e0b' },
  { id: 'royal', label: 'Royal Maroon-Gold', bg1: '#4a0e0e', bg2: '#2d0a0a', accent: '#fbbf24' },
  { id: 'festive', label: 'Festive Purple', bg1: '#2d1b69', bg2: '#1a0a4e', accent: '#e879f9' },
]

function drawCard(canvas, name, message, themeId) {
  const ctx = canvas.getContext('2d')
  const W = 1080, H = 1080
  canvas.width = W; canvas.height = H
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0]

  // Gradient background
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, theme.bg1)
  bg.addColorStop(1, theme.bg2)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Sparkles
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * W
    const y = Math.random() * H * 0.6
    const r = Math.random() * 2.5 + 0.5
    const alpha = Math.random() * 0.6 + 0.2
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${alpha})`
    ctx.fill()
  }

  // Diya positions along bottom
  const diyas = [160, 400, 540, 680, 920]
  diyas.forEach((dx, i) => {
    const dy = 720 + (i % 2) * 20
    // Diya body
    ctx.beginPath()
    ctx.ellipse(dx, dy + 40, 45, 18, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#c2883a'
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(dx, dy + 30, 35, 12, 0, 0, Math.PI)
    ctx.fillStyle = '#daa520'
    ctx.fill()
    // Flame
    const flicker = Math.sin(Date.now() / 200 + i) * 3
    const fg = ctx.createRadialGradient(dx + flicker, dy - 5, 2, dx + flicker, dy - 5, 35)
    fg.addColorStop(0, '#fff7ae')
    fg.addColorStop(0.4, '#fbbf24')
    fg.addColorStop(0.8, '#f59e0b')
    fg.addColorStop(1, 'rgba(245,158,11,0)')
    ctx.beginPath()
    ctx.arc(dx + flicker, dy - 5, 35, 0, Math.PI * 2)
    ctx.fillStyle = fg
    ctx.fill()
    // Flame tip
    ctx.beginPath()
    ctx.moveTo(dx - 6 + flicker, dy)
    ctx.quadraticCurveTo(dx + flicker, dy - 40, dx + 6 + flicker, dy)
    ctx.fillStyle = '#fff7ae'
    ctx.fill()
  })

  // Glow circles behind diyas
  diyas.forEach((dx, i) => {
    const dy = 700 + (i % 2) * 20
    const glow = ctx.createRadialGradient(dx, dy, 10, dx, dy, 120)
    glow.addColorStop(0, `${theme.accent}33`)
    glow.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath()
    ctx.arc(dx, dy, 120, 0, Math.PI * 2)
    ctx.fillStyle = glow
    ctx.fill()
  })

  // Border
  ctx.strokeStyle = theme.accent + '44'
  ctx.lineWidth = 4
  ctx.strokeRect(30, 30, W - 60, H - 60)

  // Decorative corner accents
  const corners = [[50, 50], [W - 50, 50], [50, H - 50], [W - 50, H - 50]]
  corners.forEach(([cx, cy]) => {
    ctx.beginPath()
    ctx.arc(cx, cy, 15, 0, Math.PI * 2)
    ctx.fillStyle = theme.accent + '55'
    ctx.fill()
  })

  // Title
  ctx.textAlign = 'center'
  ctx.fillStyle = theme.accent
  ctx.font = 'bold 72px Georgia, serif'
  ctx.fillText('✨ Happy Diwali ✨', W / 2, 180)

  // Message
  ctx.fillStyle = '#e2e8f0'
  ctx.font = '36px Georgia, serif'
  const words = message.split(' ')
  let line = '', y = 300
  const maxWidth = W - 160
  words.forEach(word => {
    const test = line + word + ' '
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), W / 2, y)
      line = word + ' '
      y += 52
    } else {
      line = test
    }
  })
  if (line) ctx.fillText(line.trim(), W / 2, y)

  // Sender name
  if (name) {
    ctx.fillStyle = '#94a3b8'
    ctx.font = 'italic 32px Georgia, serif'
    ctx.fillText(`— ${name}`, W / 2, y + 70)
  }

  // Footer
  ctx.fillStyle = '#475569'
  ctx.font = '20px sans-serif'
  ctx.fillText('Made with 🪔 uptools.in', W / 2, H - 60)
}

export default function diwali_greeting_card_maker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const [name, setName] = useState('')
  const [presetIdx, setPresetIdx] = useState(0)
  const [themeId, setThemeId] = useState('midnight')
  const [rendered, setRendered] = useState(false)

  const handleRender = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawCard(canvas, name, PRESETS[presetIdx].msg, themeId)
    setRendered(true)
    jumpTo()
  }, [name, presetIdx, themeId, jumpTo])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'diwali-greeting-card.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${PRESETS[presetIdx].msg}\n\n— ${name || 'A friend'}\nMade with 🪔 uptools.in/diwali-greeting-card-maker`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="Diwali Greeting Card Maker"
      desc="Create beautiful canvas-drawn Diwali greeting cards — choose a theme, message, and download or share on WhatsApp."
      icon="🪔" iconBg="rgba(245,158,11,0.08)"
      category="india" slug="diwali-greeting-card-maker"
      faq={[
        { q: "How do I create a Diwali greeting card?", a: "Enter your name, select a preset message and visual theme, then click 'Create Card'. The 1080×1080 canvas card is drawn instantly — download as PNG or share on WhatsApp." },
        { q: "Can I customize the message?", a: "Choose from 5 festive preset messages. Each card is drawn on a canvas with gradient backgrounds, glowing diyas, and sparkles — no external images needed." },
        { q: "Is this Diwali card maker free?", a: "Yes, completely free with no sign-up. Create unlimited cards on any device." },
        { q: "What themes are available?", a: "Three hand-drawn canvas themes: Midnight Diyas (dark blue with gold), Royal Maroon-Gold (rich red), and Festive Purple (vibrant purple with pink accents)." },
      ]}
      howItWorks={[
        "Enter your name (optional) and select a greeting message preset.",
        "Choose a visual theme: Midnight Diyas, Royal Maroon-Gold, or Festive Purple.",
        "Click 'Create Card' to render the 1080×1080 greeting card on canvas.",
        "Download the card as a PNG or share it directly on WhatsApp.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Diwali Greeting Card Maker", "applicationCategory": "DesignApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Your Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Greeting Message</label>
            <select value={presetIdx} onChange={(e) => setPresetIdx(parseInt(e.target.value))} className={selectClass}>
              {PRESETS.map((p, i) => (
                <option key={i} value={i}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map(t => (
                <button key={t.id} onClick={() => setThemeId(t.id)}
                  className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${themeId === t.id ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/8 bg-white/[0.03] text-slate-400 hover:border-white/15'}`}
                  style={{ background: themeId === t.id ? undefined : `linear-gradient(135deg, ${t.bg1}, ${t.bg2})` }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleRender}
          className="w-full py-4 rounded-2xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-400 transition-all duration-200 active:scale-[0.98]">
          🪔 Create Card
        </button>

        <div ref={resultRef}>
          <canvas ref={canvasRef} className="w-full rounded-2xl border-2 border-white/8" style={{ display: rendered ? 'block' : 'none' }} />
        </div>

        {rendered && (
          <div className="flex gap-3">
            <button onClick={handleDownload}
              className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-500 transition-all">
              ⬇ Download PNG
            </button>
            <button onClick={handleWhatsApp}
              className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all">
              📲 Share on WhatsApp
            </button>
          </div>
        )}

        {!rendered && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🪔</div>
            <p className="text-sm text-slate-600 font-medium">Choose a message and theme, then click Create Card</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
