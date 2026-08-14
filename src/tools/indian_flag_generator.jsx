import { useState, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const SAFRON = '#FF9933'
const WHITE = '#FFFFFF'
const GREEN = '#138808'
const NAVY = '#000080'

const SIZES = [
  { label: 'Small', w: 480 },
  { label: 'Medium', w: 720 },
  { label: 'Large', w: 1080 },
  { label: 'HD', w: 1440 },
]

const MESSAGES = [
  { label: 'JAI HIND', text: '🇮🇳 JAI HIND 🇮🇳' },
  { label: 'Happy Independence Day', text: 'HAPPY INDEPENDENCE DAY' },
  { label: '15 August', text: '15 AUGUST' },
  { label: 'Proud Indian', text: 'PROUD TO BE INDIAN' },
  { label: '78 Years of Freedom', text: '78 YEARS OF FREEDOM' },
  { label: 'Vande Mataram', text: 'VANDE MATARAM' },
]

export default function indian_flag_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const [sizeIdx, setSizeIdx] = useState(1)
  const [withChakra, setWithChakra] = useState(true)
  const [withPole, setWithPole] = useState(true)
  const [withWave, setWithWave] = useState(false)
  const [bg, setBg] = useState('transparent')
  const [message, setMessage] = useState(null)
  const [customMsg, setCustomMsg] = useState('')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [preview, setPreview] = useState(null)

  const size = SIZES[sizeIdx]

  const drawFlag = () => {
    const cvs = canvasRef.current
    if (!cvs) return
    const w = size.w
    const h = Math.round(w * 0.7) // extra height for pole/stand + message
    cvs.width = w
    cvs.height = h
    const ctx = cvs.getContext('2d')
    ctx.clearRect(0, 0, w, h)

    if (bg !== 'transparent') {
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)
    }

    // flag geometry (3:2 ratio) — slightly right to leave room for pole
    const poleX = withPole ? w * 0.14 : w * 0.05
    const flagW = w * 0.72
    const flagH = flagW * (2 / 3)
    const flagTop = (h - flagH) / 2
    const bandH = flagH / 3

    // flag pole
    if (withPole) {
      const poleW = Math.max(4, flagW * 0.014)
      ctx.save()
      ctx.fillStyle = '#3d3d3d'
      ctx.fillRect(poleX, flagTop - flagH * 0.06, poleW, flagH * 1.12)
      // finial ball
      ctx.beginPath()
      ctx.arc(poleX + poleW / 2, flagTop - flagH * 0.06, poleW * 1.4, 0, Math.PI * 2)
      ctx.fillStyle = NAVY
      ctx.fill()
      // stand (base)
      ctx.fillStyle = '#3d3d3d'
      ctx.fillRect(poleX - poleW * 2, flagTop + flagH * 1.02, poleW * 5, poleW * 1.4)
      ctx.restore()
    }

    // waving effect: draw flag as vertical slices with a sine offset
    const drawBands = (fill, top, hgt) => {
      ctx.save()
      if (!withWave) {
        ctx.fillStyle = fill
        ctx.fillRect(poleX, top, flagW, hgt)
      } else {
        const slices = 60
        const sliceW = flagW / slices
        const amp = flagH * 0.045
        for (let i = 0; i < slices; i++) {
          const x = poleX + i * sliceW
          const offset = Math.sin((i / slices) * Math.PI * 2) * amp
          ctx.fillStyle = fill
          ctx.fillRect(x, top + offset, sliceW + 0.5, hgt)
        }
      }
      ctx.restore()
    }

    drawBands(SAFRON, flagTop, bandH)
    drawBands(WHITE, flagTop + bandH, bandH)
    drawBands(GREEN, flagTop + bandH * 2, bandH)

    // Ashoka Chakra
    if (withChakra) {
      const cx = poleX + flagW / 2
      const cy = flagTop + bandH * 1.5
      const r = bandH * 0.40
      ctx.save()
      ctx.strokeStyle = NAVY
      ctx.fillStyle = NAVY
      ctx.lineWidth = r * 0.14
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.12, 0, Math.PI * 2)
      ctx.fill()
      for (let i = 0; i < 24; i++) {
        const a = (i * Math.PI * 2) / 24
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(a) * r * 0.16, cy + Math.sin(a) * r * 0.16)
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
        ctx.stroke()
      }
      ctx.restore()
    }

    // message text
    const msg = message === 'custom' ? customMsg : message ? MESSAGES.find(m => m.label === message)?.text : null
    if (msg) {
      const fontSize = Math.round(flagW * 0.07)
      ctx.save()
      ctx.font = `bold ${fontSize}px Arial, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.lineWidth = Math.max(3, fontSize * 0.16)
      ctx.lineJoin = 'round'
      ctx.strokeStyle = 'rgba(0,0,0,0.85)'
      const msgY = flagTop + flagH + fontSize * 1.5
      ctx.strokeText(msg, w / 2, msgY)
      ctx.fillStyle = textColor
      ctx.fillText(msg, w / 2, msgY)
      ctx.restore()
    }
  }

  useEffect(() => {
    drawFlag()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeIdx, withChakra, withPole, withWave, bg, message, customMsg, textColor])

  const download = () => {
    const cvs = canvasRef.current
    if (!cvs) return
    jumpTo()
    const link = document.createElement('a')
    link.download = `indian-flag-greeting-${size.label.toLowerCase()}.png`
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
      desc="Create a patriotic Indian flag greeting — add a message, flag pole with stand, or a waving flag effect, then download a high-res PNG."
      icon="🇮🇳" iconBg="rgba(19,136,8,0.10)"
      category="text" slug="indian-flag-generator"
      faq={[
        { q: 'What is the Indian Flag Generator?', a: 'A free tool that renders the Indian national flag as a PNG you can download — with a message, flag pole, stand, and waving effect.' },
        { q: 'Can I add my own message?', a: 'Yes — pick a preset (Jai Hind, Happy Independence Day, etc.) or type your own custom message.' },
        { q: 'Can I remove the Ashoka Chakra?', a: 'Yes — toggle the Chakra option off to generate a plain tricolor flag without the navy Ashoka Chakra.' },
      ]}
      howItWorks={[
        'Choose size and toggle options (chakra, pole + stand, waving effect).',
        'Add a preset or custom message and pick its color.',
        'Download the flag greeting as a high-res PNG.',
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
            <label className="block text-sm font-semibold text-slate-300 mb-2">Image Size</label>
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
            <Toggle label="Pole + Stand" checked={withPole} onChange={setWithPole} />
            <Toggle label="Waving Flag" checked={withWave} onChange={setWithWave} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Message</label>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setMessage(null)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${message === null ? 'bg-indigo-600 text-white' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] border border-white/[0.08]'}`}>
                No Text
              </button>
              {MESSAGES.map(m => (
                <button key={m.label} onClick={() => setMessage(m.label)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${message === m.label ? 'bg-indigo-600 text-white' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] border border-white/[0.08]'}`}>
                  {m.label}
                </button>
              ))}
              <button onClick={() => setMessage('custom')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${message === 'custom' ? 'bg-indigo-600 text-white' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] border border-white/[0.08]'}`}>
                ✏️ Custom
              </button>
            </div>
            {message === 'custom' && (
              <input value={customMsg} onChange={e => setCustomMsg(e.target.value)} maxLength={40}
                placeholder="Type your message..."
                className="mt-3 w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400" />
            )}
          </div>

          {message && (
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Text Color</label>
              <div className="flex flex-wrap gap-2">
                {[['#FFFFFF', 'White'], ['#000080', 'Navy'], ['#FF9933', 'Saffron'], ['#FFD700', 'Gold'], ['#000000', 'Black']].map(([v, label]) => (
                  <button key={v} onClick={() => setTextColor(v)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${textColor === v ? 'bg-indigo-600 text-white' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] border border-white/[0.08]'}`}>
                    <span className="w-3 h-3 rounded-full border border-white/20" style={{ background: v }} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Background</label>
            <div className="flex flex-wrap gap-2">
              {[['transparent', 'Transparent'], ['#0c0c14', 'Dark'], ['#ffffff', 'White'], ['#000080', 'Navy'], ['#e8f0fe', 'Light']].map(([v, label]) => (
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
