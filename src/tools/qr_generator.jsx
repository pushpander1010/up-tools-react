import { useState, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

// Simple QR code generator using canvas
function generateQR(text, size = 256) {
  // Use a minimal QR encoder
  const canvas = document.createElement('canvas')
  canvas.width = size; canvas.height = size
  const ctx = canvas.getContext('2d')

  if (!text) { ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, size, size); return canvas.toDataURL() }

  // Simple pattern-based QR (for demo — real QR needs a library)
  // We'll use the QR Server API for actual QR generation
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&bgcolor=0f172a&color=e2e8f0&margin=10`
}

export default function qr_generator() {
  const [text, setText] = useState('')
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState('#e2e8f0')
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const qrUrl = text ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&bgcolor=0f172a&color=${fgColor.replace('#', '')}&margin=10` : null

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
      desc="Generate QR codes for any text, URL, WiFi password, or contact info. Download as PNG."
      icon="🔳" iconBg="rgba(139,92,246,0.08)"
      category="images" slug="qr-generator"
      faq={[
        { q: 'What can I put in a QR code?', a: 'URLs, plain text, WiFi credentials (WIFI:T:WPA;S:MyNetwork;P:password;;), email addresses, phone numbers, and more.' },
        { q: 'How do I scan a QR code?', a: 'Open your phone camera and point it at the QR code. Most modern phones detect QR codes automatically.' },
        { q: 'Can I customize the QR code colors?', a: 'Yes — change the foreground color using the color picker below.' },
      ]}
      howItWorks={[
        'Enter the text, URL, or WiFi credentials you want to encode.',
        'Choose the QR code size (128 to 512 pixels).',
        'Optionally customize the foreground color.',
        'Download the QR code as a PNG image.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "QR Code Generator", "applicationCategory": "DesignApplication",
        "url": "https://www.uptools.in/qr-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Content</label>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Enter URL, text, or WiFi: WIFI:T:WPA;S:MyNetwork;P:password;;"
            rows={3}
            className="w-full bg-white/[0.03] border-2 border-white/8 rounded-2xl px-5 py-4 text-white text-sm font-mono outline-none focus:border-purple-500/40 transition-all duration-300 placeholder:text-slate-600 resize-none" />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Size</label>
            <div className="flex gap-2">
              {[128, 256, 512].map(s => (
                <button key={s} onClick={() => setSize(s)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${size === s ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-white/[0.03] text-slate-500 border border-white/6'}`}>
                  {s}px
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Foreground Color</label>
            <div className="flex gap-2 items-center">
              {[{ c: '#e2e8f0', l: 'White' }, { c: '#22c55e', l: 'Green' }, { c: '#6366f1', l: 'Purple' }, { c: '#f59e0b', l: 'Gold' }].map(clr => (
                <button key={clr.c} onClick={() => setFgColor(clr.c)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${fgColor === clr.c ? 'border-white scale-110' : 'border-white/20 hover:border-white/40'}`}
                  style={{ background: clr.c }} title={clr.l} />
              ))}
            </div>
          </div>
        </div>

        {/* QR Preview */}
        {qrUrl && (
          <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/[0.02] border border-white/6" style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="p-4 rounded-2xl bg-white shadow-2xl">
              <img src={qrUrl} alt="QR Code" className="block" style={{ width: Math.min(size, 280), height: Math.min(size, 280) }} />
            </div>
            <div className="text-xs text-slate-500 text-center max-w-xs truncate">{text}</div>
            <div className="flex gap-3">
              <button onClick={download} disabled={downloading}
                className="glow-btn px-6 py-2.5 rounded-xl text-sm flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                {downloading ? '⏳' : '⬇'} Download PNG
              </button>
              <button onClick={copyImage}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
          </div>
        )}

        {!text && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔳</div>
            <p className="text-sm text-slate-600 font-medium">Enter text or a URL to generate a QR code</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
