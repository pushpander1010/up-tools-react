import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const PLATFORMS = [
  { id: 'instagram-story', label: 'Instagram Story', w: 1080, h: 1920, icon: '📸' },
  { id: 'instagram-post', label: 'Instagram Post', w: 1080, h: 1080, icon: '🖼️' },
  { id: 'whatsapp-status', label: 'WhatsApp Status', w: 1080, h: 1920, icon: '💬' },
  { id: 'snapchat', label: 'Snapchat Story', w: 1080, h: 1920, icon: '👻' },
  { id: 'facebook-story', label: 'Facebook Story', w: 1080, h: 1920, icon: '👤' },
  { id: 'tiktok', label: 'TikTok / Reels', w: 1080, h: 1920, icon: '🎵' },
  { id: 'youtube-thumb', label: 'YouTube Thumbnail', w: 1280, h: 720, icon: '▶️' },
  { id: 'linkedin-post', label: 'LinkedIn Post', w: 1200, h: 627, icon: '💼' },
]

const BG_PRESETS = [
  { label: 'Midnight', bg: 'linear-gradient(135deg, #0f172a, #1e1b4b)', text: '#ffffff' },
  { label: 'Sunset', bg: 'linear-gradient(135deg, #f97316, #ec4899)', text: '#ffffff' },
  { label: 'Ocean', bg: 'linear-gradient(135deg, #0ea5e9, #6366f1)', text: '#ffffff' },
  { label: 'Forest', bg: 'linear-gradient(135deg, #059669, #0d9488)', text: '#ffffff' },
  { label: 'Peach', bg: 'linear-gradient(135deg, #fb923c, #fbbf24)', text: '#1e293b' },
  { label: 'Minimal White', bg: '#f8fafc', text: '#1e293b' },
  { label: 'Neon', bg: 'linear-gradient(135deg, #7c3aed, #ec4899)', text: '#ffffff' },
  { label: 'Dark Gold', bg: 'linear-gradient(135deg, #1e1b4b, #92400e)', text: '#fbbf24' },
]

const FONT_OPTIONS = [
  { label: 'Sans Serif', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Monospace', value: '"Courier New", monospace' },
  { label: 'Cursive', value: '"Brush Script MT", cursive' },
]

export default function story_template_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const [platform, setPlatform] = useState(PLATFORMS[0])
  const [bgPreset, setBgPreset] = useState(BG_PRESETS[0])
  const [heading, setHeading] = useState('Your Story')
  const [subtext, setSubtext] = useState('')
  const [fontSize, setFontSize] = useState(64)
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].value)
  const [textAlign, setTextAlign] = useState('center')
  const [downloading, setDownloading] = useState(false)

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = platform.w
    const h = platform.h
    canvas.width = w
    canvas.height = h

    // Background
    if (bgPreset.bg.startsWith('linear')) {
      const grad = ctx.createLinearGradient(0, 0, w, h)
      const colors = bgPreset.bg.match(/#[0-9a-fA-F]{6}/g) || ['#0f172a', '#1e1b4b']
      colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c))
      ctx.fillStyle = grad
    } else {
      ctx.fillStyle = bgPreset.bg
    }
    ctx.fillRect(0, 0, w, h)

    // Heading
    const headingSize = fontSize * (w / 1080)
    ctx.fillStyle = bgPreset.text
    ctx.font = `bold ${headingSize}px ${fontFamily}`
    ctx.textAlign = textAlign
    ctx.textBaseline = 'middle'

    const lines = wrapText(ctx, heading, w * 0.85)
    const lineHeight = headingSize * 1.2
    const totalTextH = lines.length * lineHeight + (subtext ? lineHeight * 0.8 : 0)
    let startY = (h - totalTextH) / 2

    lines.forEach((line, i) => {
      ctx.fillText(line, w / 2, startY + i * lineHeight + lineHeight / 2)
    })

    // Subtext
    if (subtext) {
      const subSize = headingSize * 0.4
      ctx.font = `${subSize}px ${fontFamily}`
      ctx.globalAlpha = 0.7
      const subLines = wrapText(ctx, subtext, w * 0.75)
      const subStartY = startY + lines.length * lineHeight + lineHeight * 0.3
      subLines.forEach((line, i) => {
        ctx.fillText(line, w / 2, subStartY + i * subSize * 1.3 + subSize / 2)
      })
      ctx.globalAlpha = 1
    }
  }, [platform, bgPreset, heading, subtext, fontSize, fontFamily, textAlign])

  function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ')
    const lines = []
    let current = ''
    for (const word of words) {
      const test = current ? current + ' ' + word : word
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current)
        current = word
      } else {
        current = test
      }
    }
    if (current) lines.push(current)
    return lines.length ? lines : ['']
  }

  const download = useCallback(() => {
    renderCanvas()
    setDownloading(true)
    const canvas = canvasRef.current
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${platform.id}-template.png`
      a.click()
      URL.revokeObjectURL(url)
      setDownloading(false)
    }, 'image/png')
  }, [renderCanvas, platform])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="Story Template Generator"
      desc="Create beautiful story templates for Instagram, WhatsApp, Snapchat, TikTok & more. Download as PNG."
      icon="🎨" iconBg="rgba(168,85,247,0.08)"
      category="social" slug="story-template-generator"
      faq={[
        { q: "What platforms are supported?", a: "Instagram Story/Post, WhatsApp Status, Snapchat, Facebook Story, TikTok/Reels, YouTube Thumbnail, and LinkedIn Post." },
        { q: "What size are the templates?", a: "Each platform uses its native resolution: Stories/Status = 1080×1920, Posts = 1080×1080, YouTube = 1280×720." },
        { q: "Can I use custom colors?", a: "Choose from 8 gradient presets. For full customization, the generated PNG can be edited in any image editor." },
      ]}
      howItWorks={[
        "Choose your platform (Instagram, WhatsApp, Snapchat, etc.).",
        "Pick a gradient background, type your text, adjust font & size.",
        "Download the ready-to-post template as PNG.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Story Template Generator", "applicationCategory": "DesignApplication",
        "url": "https://www.uptools.in/story-template-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">Platform</label>
              <div className="grid grid-cols-2 gap-1.5">
                {PLATFORMS.map(p => (
                  <button key={p.id} onClick={() => setPlatform(p)}
                    className={`p-2.5 rounded-xl text-xs font-semibold transition-all ${
                      platform.id === p.id
                        ? 'bg-indigo-500/15 border border-indigo-500/40 text-white'
                        : 'bg-white/[0.04] border border-white/6 text-slate-400 hover:border-indigo-500/30'
                    }`}>
                    {p.icon} {p.label}
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-slate-600 mt-1">{platform.w} × {platform.h}px</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">Background</label>
              <div className="grid grid-cols-4 gap-1.5">
                {BG_PRESETS.map((b, i) => (
                  <button key={i} onClick={() => setBgPreset(b)}
                    className={`h-10 rounded-lg border-2 transition-all ${
                      bgPreset === b ? 'border-indigo-500 scale-110' : 'border-white/10'
                    }`}
                    style={{ background: b.bg }} />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">Heading Text</label>
              <input type="text" value={heading} onChange={e => setHeading(e.target.value)}
                className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">Subtext (optional)</label>
              <input type="text" value={subtext} onChange={e => setSubtext(e.target.value)}
                placeholder="Add a caption or tagline..."
                className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">Font Size: {fontSize}px</label>
                <input type="range" min="24" max="120" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">Font Family</label>
                <select value={fontFamily} onChange={e => setFontFamily(e.target.value)}
                  className={inputClass + " appearance-none"}>
                  {FONT_OPTIONS.map(f => <option key={f.value} value={f.value} className="bg-gray-900">{f.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">Text Alignment</label>
              <div className="flex gap-2">
                {['left', 'center', 'right'].map(a => (
                  <button key={a} onClick={() => setTextAlign(a)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      textAlign === a ? 'bg-indigo-500 text-white' : 'bg-white/[0.06] border border-white/8 text-slate-400'
                    }`}>
                    {a.charAt(0).toUpperCase() + a.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => { renderCanvas(); download() }}
              disabled={downloading}
              className="w-full py-3.5 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98] disabled:opacity-50">
              {downloading ? '⏳ Downloading...' : '⬇️ Download PNG'}
            </button>
          </div>

          {/* Preview */}
          <div ref={resultRef} className="flex items-start justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ maxWidth: 300 }}>
              <canvas ref={canvasRef} style={{ width: '100%', height: 'auto' }} />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
