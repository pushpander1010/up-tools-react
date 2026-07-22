import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

const PRESETS = [
  { fg: '#1e293b', bg: '#ffffff', label: 'Dark on Light' },
  { fg: '#e2e8f0', bg: '#0f172a', label: 'Light on Dark' },
  { fg: '#22c55e', bg: '#ffffff', label: 'Green' },
  { fg: '#6366f1', bg: '#ffffff', label: 'Purple' },
  { fg: '#ef4444', bg: '#ffffff', label: 'Red' },
  { fg: '#f59e0b', bg: '#ffffff', label: 'Gold' },
]

export default function qr_generator() {
  const [text, setText] = useState('')
  const [size, setSize] = useState(256)
  const [fg, setFg] = useState('#e2e8f0')
  const [bg, setBg] = useState('#0f172a')
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const qrUrl = text ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&bgcolor=${bg.replace('#', '')}&color=${fg.replace('#', '')}&margin=10` : null

  const download = async () => {
    if (!qrUrl) return
    setDownloading(true)
    try {
      const res = await fetch(qrUrl)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = 'qr-code.png'; a.click()
      URL.revokeObjectURL(url)
    } catch (e) { console.error(e) }
    setDownloading(false)
  }

  const copyImage = async () => {
    if (!qrUrl) return
    try {
      const res = await fetch(qrUrl)
      const blob = await res.blob()
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    } catch (e) { console.error(e) }
  }

  const ColorSlider = ({ label, value, onChange, accent }) => (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-slate-400">{label}</label>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md border border-white/10" style={{ color: value, background: `${value}15` }}>{value}</span>
      </div>
      <div className="relative h-8 rounded-xl overflow-hidden border-2 border-white/10" style={{ background: `linear-gradient(to right, #000000, ${value}, #ffffff)` }}>
        <input type="range" min="0" max="360" value={parseInt(value.replace('#', ''), 16) % 360}
          onChange={e => {
            const h = parseInt(e.target.value)
            // Convert hue slider to hex-ish color
            const s = 70, l = 50
            const a2 = s/100 * Math.min(l/100, 1-l/100)
            const f = n => { const k = (n + h/30) % 12; return l/100 - a2 * Math.max(Math.min(k-3, 9-k, 1), -1) }
            const hex = '#' + [f(0), f(8), f(4)].map(x => Math.round(x*255).toString(16).padStart(2,'0')).join('')
            onChange(hex)
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg pointer-events-none transition-all"
          style={{ left: `calc(${(parseInt(value.replace('#', ''), 16) % 360) / 360 * 100}% - 8px)`, background: value }} />
      </div>
    </div>
  )

  return (
    <ToolLayout
      title="QR Code Generator"
      desc="Generate QR codes for URLs, text, WiFi, contacts. Customize colors with sliders."
      icon="🔳" iconBg="rgba(139,92,246,0.08)"
      category="images" slug="qr-generator"
      faq={[
        { q: 'What can I encode?', a: 'URLs, plain text, WiFi credentials (WIFI:T:WPA;S:Network;P:pass;;), email, phone numbers, vCards, and more.' },
        { q: 'How do I scan a QR code?', a: 'Open your phone camera and point it at the QR code. Most phones detect QR codes automatically.' },
      ]}
      howItWorks={[
        'Enter the text, URL, or data you want to encode.',
        'Adjust foreground and background color sliders.',
        'Preview the QR code in real-time.',
        'Download as PNG or copy the image.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "QR Code Generator", "applicationCategory": "DesignApplication",
        "url": "https://www.uptools.in/qr-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Content</label>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Enter URL, text, or WiFi: WIFI:T:WPA;S:Network;P:password;;"
            rows={3}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-2xl px-5 py-4 text-white text-sm font-mono outline-none focus:border-purple-500/40 transition-all placeholder:text-slate-600 resize-none" />
        </div>

        {/* Color Sliders */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
          <label className="block text-sm font-semibold text-slate-300 mb-4">🎨 Colors</label>
          <div className="space-y-4">
            <ColorSlider label="Foreground (QR dots)" value={fg} onChange={setFg} accent="purple" />
            <ColorSlider label="Background" value={bg} onChange={setBg} accent="cyan" />
          </div>
          {/* Presets */}
          <div className="flex flex-wrap gap-2 mt-4">
            {PRESETS.map((p, i) => (
              <button key={i} onClick={() => { setFg(p.fg); setBg(p.bg) }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-white/10 hover:border-white/20 transition-all"
                style={{ background: p.bg, color: p.fg }}>
                <span className="w-3 h-3 rounded-full border" style={{ background: p.fg }} />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Size</label>
          <div className="flex gap-2">
            {[128, 256, 512].map(s => (
              <button key={s} onClick={() => setSize(s)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${size === s ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'}`}>
                {s}px
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        {qrUrl ? (
          <div className="flex flex-col items-center gap-5 p-8 rounded-3xl border-2 border-white/[0.08] transition-all"
            style={{ background: bg, animation: 'slideUp 0.35s ease-out' }}>
            <img src={qrUrl} alt="QR Code" className="block rounded-lg shadow-2xl"
              style={{ width: Math.min(size, 280), height: Math.min(size, 280) }} />
            <div className="text-xs text-center max-w-xs truncate px-4 py-1.5 rounded-lg font-mono"
              style={{ color: fg, opacity: 0.6, background: `${fg}10` }}>{text}</div>
            <div className="flex gap-3">
              <button onClick={download} disabled={downloading}
                className="glow-btn px-6 py-2.5 rounded-xl text-sm flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                {downloading ? '⏳' : '⬇'} Download
              </button>
              <button onClick={copyImage}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.02]">
            <div className="text-4xl mb-3 opacity-20">🔳</div>
            <p className="text-sm text-slate-600 font-medium">Enter content above to generate a QR code</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
