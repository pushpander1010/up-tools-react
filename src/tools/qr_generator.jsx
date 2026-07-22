import { useState, useMemo, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import AdBanner from '../components/AdBanner'
import FAQ from '../components/FAQ'

const PRESETS = [
  { fg: '#1e293b', bg: '#ffffff', label: 'Classic' },
  { fg: '#e2e8f0', bg: '#0f172a', label: 'Dark Mode' },
  { fg: '#22c55e', bg: '#ffffff', label: 'Green' },
  { fg: '#6366f1', bg: '#ffffff', label: 'Indigo' },
  { fg: '#ef4444', bg: '#ffffff', label: 'Red' },
  { fg: '#f59e0b', bg: '#ffffff', label: 'Amber' },
]

function hexToHSL(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => { const k = (n + h / 30) % 12; return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1) }
  return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('')
}

const RAINBOW = ['#ff0000','#ff4400','#ff8800','#ffcc00','#ffff00','#aaff00','#55ff00','#00ff00','#00ff55','#00ffaa','#00ffff','#00aaff','#0055ff','#0000ff','#4400ff','#8800ff','#cc00ff','#ff00ff','#ff00aa','#ff0055','#ff0000']

function HueSlider({ label, color, onChange }) {
  const hsl = hexToHSL(color)
  const pct = (hsl.h / 360) * 100
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-semibold text-slate-400">{label}</span>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md border-2 border-white/20 shadow-sm" style={{ background: color }} />
          <span className="text-[10px] font-mono font-bold text-slate-400">{color}</span>
        </div>
      </div>
      <div className="relative h-7 rounded-lg overflow-hidden border border-white/10"
        style={{ background: 'linear-gradient(to right, #ff0000, #ff8800, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}>
        <input type="range" min="0" max="360" step="1" value={hsl.h}
          onChange={e => {
            const h = parseInt(e.target.value)
            const s = Math.max(hsl.s, 70)
            const l = Math.max(Math.min(hsl.l, 65), 35)
            onChange(hslToHex(h, s, l))
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg pointer-events-none z-20 transition-[left] duration-75"
          style={{ left: `calc(${pct}% - 8px)`, background: color }} />
      </div>
    </div>
  )
}

export default function qr_generator() {
  const [text, setText] = useState('')
  const [size, setSize] = useState(256)
  const [fg, setFg] = useState('#e2e8f0')
  const [bg, setBg] = useState('#0f172a')
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const qrUrl = useMemo(() =>
    text ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&bgcolor=${bg.replace('#', '')}&color=${fg.replace('#', '')}&margin=10` : null
  , [text, size, fg, bg])

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
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    } catch (e) { console.error(e) }
  }

  return (
    <>
      <Helmet>
        <title>QR Code Generator — Customize Colors, Download PNG | UpTools</title>
        <meta name="description" content="Generate QR codes for URLs, text, WiFi, contacts. Live preview with customizable foreground and background colors." />
      </Helmet>

      <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-white transition-colors no-underline text-slate-400">Home</Link>
        <span>›</span>
        <span className="text-white">QR Code Generator</span>
      </nav>

      <AdBanner />

      {/* ─── SIDE-BY-SIDE ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* LEFT — Controls */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Content</label>
            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder="Enter URL, text, or WiFi: WIFI:T:WPA;S:MyNetwork;P:password;;"
              rows={3}
              className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-2xl px-5 py-4 text-white text-sm font-mono outline-none focus:border-purple-500/40 transition-all duration-300 placeholder:text-slate-600 resize-none" />
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">🎨 Colors</h3>
            <HueSlider label="Foreground (QR dots)" color={fg} onChange={setFg} />
            <HueSlider label="Background" color={bg} onChange={setBg} />
            <div className="flex flex-wrap gap-2 mt-2">
              {PRESETS.map((p, i) => (
                <button key={i} onClick={() => { setFg(p.fg); setBg(p.bg) }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border-2 border-white/[0.08] hover:border-white/[0.15] transition-all"
                  style={{ background: p.bg }}>
                  <div className="w-4 h-4 rounded-md border border-white/20" style={{ background: p.fg }} />
                  <span style={{ color: p.fg }}>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-2 block">Size</label>
            <div className="flex gap-2">
              {[128, 256, 512].map(s => (
                <button key={s} onClick={() => setSize(s)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${size === s ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-lg shadow-purple-500/10' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'}`}>
                  {s}px
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Live Preview */}
        <div className="flex items-center justify-center">
          {qrUrl ? (
            <div className="flex flex-col items-center gap-4 p-8 rounded-3xl border-2 border-white/[0.08] w-full transition-all duration-300"
              style={{ background: bg }}>
              <img src={qrUrl} alt="QR Code" className="block rounded-xl shadow-2xl"
                style={{ width: Math.min(size, 300), height: Math.min(size, 300) }} />
              <div className="text-xs text-center max-w-xs truncate px-4 py-1.5 rounded-lg font-mono"
                style={{ color: fg, opacity: 0.5, background: `${fg}10` }}>{text}</div>
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
            <div className="text-center py-16 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] w-full">
              <div className="text-5xl mb-4 opacity-20">🔳</div>
              <p className="text-sm text-slate-600 font-medium">Enter content to see QR preview</p>
            </div>
          )}
        </div>
      </div>

      <AdBanner />

      <FAQ questions={[
        { q: 'What can I encode?', a: 'URLs, plain text, WiFi credentials (WIFI:T:WPA;S:Network;P:pass;;), email, phone numbers, vCards, and more.' },
        { q: 'How do I scan a QR code?', a: 'Open your phone camera and point it at the QR code. Most phones detect QR codes automatically.' },
        { q: 'What size should I use?', a: '256px for screens, 512px for print. 128px is fine for small labels.' },
      ]} />
    </>
  )
}
