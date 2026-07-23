import { useState, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function favicon_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [text, setText] = useState('A')
  const [bg, setBg] = useState('#6366f1')
  const [fg, setFg] = useState('#ffffff')
  const c16Ref = useRef(null)
  const c32Ref = useRef(null)
  const c48Ref = useRef(null)
  const c180Ref = useRef(null)

  const gen = useCallback(() => {
    const t = text || 'A'
    ;[16, 32, 48, 180].forEach((s, i) => {
      const refs = [c16Ref, c32Ref, c48Ref, c180Ref]
      const c = refs[i].current
      if (!c) return
      const x = c.getContext('2d')
      c.width = s; c.height = s
      x.fillStyle = bg
      x.beginPath()
      x.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2)
      x.fill()
      x.fillStyle = fg
      x.font = `bold ${s * 0.6}px Arial`
      x.textAlign = 'center'
      x.textBaseline = 'middle'
      x.fillText(t, s / 2, s / 2)
    })
  }, [text, bg, fg])

  useEffect(() => { gen() }, [gen])

  const dl = useCallback((canvasRef, name) => {
    const c = canvasRef.current
    if (!c) return
    const a = document.createElement('a')
    a.download = name
    a.href = c.toDataURL('image/png')
    a.click()
  }, [])

  return (
    <ToolLayout
      title="Favicon Generator"
      desc="Generate favicons from text with customizable colors. Download in multiple sizes."
      icon="🎯" iconBg="rgba(245,158,11,0.08)"
      category="generator" slug="favicon-generator"
      faq={[
        { q: "What sizes are generated?", a: "16px, 32px, 48px, and 180px (Apple Touch Icon)." },
        { q: "Can I use emojis?", a: "Yes, enter a letter or emoji as the favicon text." },
      ]}
      howItWorks={["Enter a letter or emoji", "Choose background and text colors", "Preview at 4 sizes and download"]}
      schema={{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Favicon Generator","applicationCategory":"UtilitiesApplication","url":"https://www.uptools.in/favicon-generator/","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6 sm:p-8 space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Letter/Emoji</label>
              <input type="text" value={text} onChange={e => setText(e.target.value.slice(0, 2))}
                maxLength={2} className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-bold text-center text-3xl outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Background</label>
              <input type="color" value={bg} onChange={e => setBg(e.target.value)}
                className="w-full h-[50px] rounded-xl border-2 border-white/8 cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Text Color</label>
              <input type="color" value={fg} onChange={e => setFg(e.target.value)}
                className="w-full h-[50px] rounded-xl border-2 border-white/8 cursor-pointer" />
            </div>
          </div>
        </div>

        <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4">Generated Favicons</h3>
          <div className="flex justify-center gap-6 flex-wrap">
            {[
              { ref: c16Ref, size: 16, name: 'favicon-16.png' },
              { ref: c32Ref, size: 32, name: 'favicon-32.png' },
              { ref: c48Ref, size: 48, name: 'favicon-48.png' },
              { ref: c180Ref, size: 180, name: 'apple-touch-icon.png' },
            ].map(({ ref, size, name }) => (
              <div key={size} className="text-center">
                <canvas ref={ref} width={size} height={size}
                  style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, width: Math.min(size, 96), height: Math.min(size, 96) }} />
                <p className="text-xs text-slate-500 mt-1">{size}px</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-3 mt-5 flex-wrap">
            {[
              { ref: c16Ref, size: 16, name: 'favicon-16.png' },
              { ref: c32Ref, size: 32, name: 'favicon-32.png' },
              { ref: c48Ref, size: 48, name: 'favicon-48.png' },
              { ref: c180Ref, size: 180, name: 'apple-touch-icon.png' },
            ].map(({ ref, size, name }) => (
              <button key={size} onClick={() => { dl(ref, name); jumpTo() }}
                className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 text-sm font-semibold hover:bg-white/10 transition-all">
                Download {size}px
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
