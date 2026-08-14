import { useState, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const FLAG_RATIO = 2 / 3 // width:height = 3:2
const SAFRON = '#FF9933'
const WHITE = '#FFFFFF'
const GREEN = '#138808'
const NAVY = '#000080'

const SIZES = [
  { label: 'Small', w: 300 },
  { label: 'Medium', w: 480 },
  { label: 'Large', w: 720 },
  { label: 'HD', w: 1080 },
]

export default function indian_flag_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const [sizeIdx, setSizeIdx] = useState(1)
  const [withChakra, setWithChakra] = useState(true)
  const [withPole, setWithPole] = useState(false)
  const [withBorder, setWithBorder] = useState(false)
  const [bg, setBg] = useState('transparent')
  const [preview, setPreview] = useState(null)

  const size = SIZES[sizeIdx]

  const drawFlag = () => {
    const cvs = canvasRef.current
    if (!cvs) return
    const w = size.w
    const h = Math.round(w * FLAG_RATIO)
    cvs.width = w
    cvs.height = h
    const ctx = cvs.getContext('2d')
    ctx.clearRect(0, 0, w, h)

    // background
    if (bg !== 'transparent') {
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)
    }

    const bandH = h / 3
    // saffron
    ctx.fillStyle = SAFRON
    ctx.fillRect(0, 0, w, bandH)
    // white
    ctx.fillStyle = WHITE
    ctx.fillRect(0, bandH, w, bandH)
    // green
    ctx.fillStyle = GREEN
    ctx.fillRect(0, bandH * 2, w, bandH)

    // flag pole (left side)
    if (withPole) {
      ctx.save()
      ctx.fillStyle = NAVY
      const poleW = Math.max(3, w * 0.012)
      ctx.fillRect(w * 0.02, bandH * 0.02, poleW, h * 0.96)
      // finial ball on top
      ctx.beginPath()
      ctx.arc(w * 0.02 + poleW / 2, bandH * 0.02, poleW * 0.8, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    // border
    if (withBorder) {
      ctx.save()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = Math.max(2, w * 0.008)
      ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, w - ctx.lineWidth, h - ctx.lineWidth)
      ctx.restore()
    }


    // Ashoka Chakra
    if (withChakra) {
      const cx = w / 2
      const cy = h / 2
      const r = bandH * 0.68
      ctx.save()
      ctx.strokeStyle = NAVY
      ctx.fillStyle = NAVY
      ctx.lineWidth = r * 0.09

      // outer ring
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.stroke()

      // inner ring
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2)
      ctx.stroke()

      // center dot
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.09, 0, Math.PI * 2)
      ctx.fill()

      // 24 spokes
      for (let i = 0; i < 24; i++) {
        const angle = (i * Math.PI * 2) / 24
        const x1 = cx + Math.cos(angle) * r * 0.14
        const y1 = cy + Math.sin(angle) * r * 0.14
        const x2 = cx + Math.cos(angle) * r * 0.62
        const y2 = cy + Math.sin(angle) * r * 0.62
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
      ctx.restore()
    }
  }

  useEffect(() => {
    drawFlag()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeIdx, withChakra, withPole, withBorder, bg])

  const download = () => {
    const cvs = canvasRef.current
    if (!cvs) return
    jumpTo()
    const link = document.createElement('a')
    link.download = `indian-flag-${size.label.toLowerCase()}.png`
    link.href = cvs.toDataURL('image/png')
    link.click()
  }

  const showPreview = () => {
    jumpTo()
    const cvs = canvasRef.current
    if (!cvs) return
    setPreview(cvs.toDataURL('image/png'))
  }

  return (
    <ToolLayout
      title="Indian Flag Generator"
      desc="Create and download a clean Indian flag (Tiranga) PNG in seconds — pick the size, toggle the Ashoka Chakra, and download or preview it."
      icon="🇮🇳" iconBg="rgba(19,136,8,0.10)"
      category="text" slug="indian-flag-generator"
      faq={[
        { q: 'What is the Indian Flag Generator?', a: 'A free tool that renders the Indian national flag (Tiranga) as a PNG image that you can download in multiple sizes.' },
        { q: 'Can I remove the Ashoka Chakra?', a: 'Yes — toggle the Chakra option off to generate a plain tricolor flag without the navy Ashoka Chakra.' },
        { q: 'Is the flag image free to use?', a: 'Yes, the generated image is free for personal use. Respect the Flag Code of India when using it publicly.' },
      ]}
      howItWorks={[
        'Choose your preferred flag size (Small to HD).',
        'Toggle the Ashoka Chakra, flag pole, border, and background options.',
        'Download the flag as a PNG or preview it.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Indian Flag Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/indian-flag-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Controls */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Flag Size</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s, i) => (
                <button key={s.label} onClick={() => setSizeIdx(i)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${i === sizeIdx ? 'bg-indigo-600 text-white' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] border border-white/[0.08]'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Toggle label="Ashoka Chakra" checked={withChakra} onChange={setWithChakra} />
            <Toggle label="Flag Pole" checked={withPole} onChange={setWithPole} />
            <Toggle label="Border" checked={withBorder} onChange={setWithBorder} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Background</label>
            <div className="flex flex-wrap gap-2">
              {[['transparent', 'Transparent'], ['#0c0c14', 'Dark'], ['#ffffff', 'White'], ['#000080', 'Navy']].map(([v, label]) => (
                <button key={v} onClick={() => setBg(v)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${bg === v ? 'bg-indigo-600 text-white' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] border border-white/[0.08]'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div ref={resultRef} className="rounded-3xl border-2 border-white/[0.08] bg-black/30 p-5 flex flex-col items-center gap-4">
          <canvas ref={canvasRef} className="rounded-lg shadow-lg max-w-full h-auto" style={{ background: bg === 'transparent' ? undefined : bg }} />
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={showPreview} className="px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg text-sm">
              Preview
            </button>
            <button onClick={download} className="px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg text-sm">
              ⬇ Download PNG
            </button>
          </div>
        </div>

        {preview && (
          <div className="rounded-3xl border-2 border-emerald-500/15 bg-emerald-500/[0.04] p-5 space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Preview</h3>
            <img src={preview} alt="Generated Indian flag" className="rounded-lg shadow-lg max-w-full h-auto border border-white/[0.08]" />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`px-4 py-2.5 rounded-xl text-sm font-bold text-left transition-all flex items-center justify-between gap-2 border ${checked ? 'bg-indigo-600/20 text-white border-indigo-500/40' : 'bg-white/[0.06] text-slate-300 border-white/[0.08]'}`}>
      {label}
      <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${checked ? 'bg-indigo-500 border-indigo-400 text-white' : 'border-white/20'}`}>
        {checked ? '✓' : ''}
      </span>
    </button>
  )
}
