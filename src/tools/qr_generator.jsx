import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

const COLORS = [
  { fg: '#1e293b', bg: '#ffffff', label: 'Black on White' },
  { fg: '#e2e8f0', bg: '#0f172a', label: 'White on Dark' },
  { fg: '#22c55e', bg: '#ffffff', label: 'Green on White' },
  { fg: '#6366f1', bg: '#ffffff', label: 'Purple on White' },
  { fg: '#ffffff', bg: '#6366f1', label: 'White on Purple' },
  { fg: '#f59e0b', bg: '#1e293b', label: 'Gold on Dark' },
  { fg: '#ef4444', bg: '#ffffff', label: 'Red on White' },
  { fg: '#06b6d4', bg: '#ffffff', label: 'Cyan on White' },
]

export default function qr_generator() {
  const [text, setText] = useState('')
  const [size, setSize] = useState(256)
  const [colorIdx, setColorIdx] = useState(1) // default: white on dark
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const colors = COLORS[colorIdx]
  const qrUrl = text ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&bgcolor=${colors.bg.replace('#', '')}&color=${colors.fg.replace('#', '')}&margin=10` : null

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

  return (
    <ToolLayout
      title="QR Code Generator"
      desc="Generate QR codes for URLs, text, WiFi, contacts. Customize colors and download as PNG."
      icon="🔳" iconBg="rgba(139,92,246,0.08)"
      category="images" slug="qr-generator"
      faq={[
        { q: 'What can I encode?', a: 'URLs, plain text, WiFi credentials (WIFI:T:WPA;S:Network;P:pass;;), email, phone numbers, vCards, and more.' },
        { q: 'How do I scan a QR code?', a: 'Open your phone camera and point it at the QR code. Most phones detect QR codes automatically.' },
      ]}
      howItWorks={[
        'Enter the text, URL, or data you want to encode.',
        'Choose a color scheme and QR code size.',
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
        {/* Content Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Content</label>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Enter URL, text, or WiFi: WIFI:T:WPA;S:Network;P:password;;"
            rows={3}
            className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-white text-sm font-mono outline-none focus:border-purple-500/40 transition-all placeholder:text-slate-600 resize-none" />
        </div>

        {/* Color Scheme */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Color Scheme</label>
          <div className="grid grid-cols-4 gap-2">
            {COLORS.map((c, i) => (
              <button key={i} onClick={() => setColorIdx(i)}
                className={`p-3 rounded-xl border-2 transition-all text-center ${colorIdx === i ? 'border-purple-500/50 shadow-lg shadow-purple-500/10' : 'border-white/8 hover:border-white/12'}`}
                style={{ background: c.bg }}>
                <div className="text-xs font-bold" style={{ color: c.fg }}>QR</div>
                <div className="text-[9px] mt-1" style={{ color: c.fg, opacity: 0.6 }}>{c.label}</div>
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
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${size === s ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-white/[0.06] text-slate-500 border border-white/8'}`}>
                {s}px
              </button>
            ))}
          </div>
        </div>

        {/* QR Preview */}
        {qrUrl ? (
          <div className="flex flex-col items-center gap-5 p-8 rounded-3xl border border-white/8"
            style={{ background: colors.bg, animation: 'slideUp 0.35s ease-out' }}>
            <img src={qrUrl} alt="QR Code" className="block rounded-lg shadow-2xl"
              style={{ width: Math.min(size, 280), height: Math.min(size, 280) }} />
            <div className="text-xs text-center max-w-xs truncate px-4 py-1.5 rounded-lg"
              style={{ color: colors.fg, opacity: 0.7, background: `${colors.fg}10` }}>{text}</div>
            <div className="flex gap-3">
              <button onClick={download} disabled={downloading}
                className="glow-btn px-6 py-2.5 rounded-xl text-sm flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                {downloading ? '⏳' : '⬇'} Download
              </button>
              <button onClick={copyImage}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔳</div>
            <p className="text-sm text-slate-600 font-medium">Enter content above to generate a QR code</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
