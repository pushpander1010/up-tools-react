import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function css_gradient_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [type, setType] = useState('linear')
  const [angle, setAngle] = useState('135')
  const [colors, setColors] = useState(['#6366f1', '#8b5cf6', '#06b6d4'])
  const [copied, setCopied] = useState(false)

  const gradientCSS = (() => {
    const joined = colors.join(', ')
    if (type === 'linear') return `background: linear-gradient(${angle}deg, ${joined});`
    if (type === 'radial') return `background: radial-gradient(circle, ${joined});`
    return `background: conic-gradient(${joined});`
  })()

  const updateColor = useCallback((i, val) => {
    setColors(prev => prev.map((c, idx) => idx === i ? val : c))
  }, [])

  const addColor = useCallback(() => {
    const random = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')
    setColors(prev => [...prev, random])
  }, [])

  const removeColor = useCallback((i) => {
    setColors(prev => prev.filter((_, idx) => idx !== i))
  }, [])

  const copyToClipboard = useCallback(async () => {
    try { await navigator.clipboard.writeText(gradientCSS) } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [gradientCSS])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 [color-scheme:dark]"

  return (
    <ToolLayout
      title="CSS Gradient Generator"
      desc="Create beautiful CSS gradients with live preview. Build linear, radial, and conic gradients with multiple color stops."
      icon="🎨" iconBg="rgba(168,85,247,0.08)"
      category="dev" slug="css-gradient-generator"
      faq={[
        { q: "What gradient types are supported?", a: "Linear, radial, and conic gradients — the three main CSS gradient types." },
        { q: "Can I add more colors?", a: "Yes, click the Add Color button to add more color stops to your gradient." },
      ]}
      howItWorks={[
        "Choose a gradient type (linear, radial, or conic).",
        "Pick colors and adjust the angle for linear gradients.",
        "Copy the CSS code to use in your project.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "CSS Gradient Generator", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/css-gradient-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Live preview */}
        <div className="rounded-3xl overflow-hidden h-40 sm:h-52"
          style={{ background: gradientCSS.replace('background: ', '').replace(';', '') }} />

        {/* Type selector */}
        <div className="flex gap-2">
          {['linear', 'radial', 'conic'].map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold capitalize transition-all border-2 ${
                type === t
                  ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                  : 'bg-white/[0.04] text-slate-500 border-white/8'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Angle (linear only) */}
        {type === 'linear' && (
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Angle: {angle}°</label>
            <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(e.target.value)}
              className="w-full accent-purple-500" />
          </div>
        )}

        {/* Colors */}
        <div className="bg-white/[0.06] border-2 border-white/8 rounded-2xl p-4">
          <p className="text-sm font-semibold text-slate-300 mb-3">Colors</p>
          <div className="space-y-2">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="color" value={c} onChange={e => updateColor(i, e.target.value)}
                  className="w-10 h-10 rounded-lg border-none cursor-pointer bg-transparent" />
                <input type="text" value={c} onChange={e => updateColor(i, e.target.value)}
                  className="flex-1 bg-black/20 border border-white/8 rounded-lg px-3 py-2 text-sm font-mono text-white outline-none focus:border-indigo-500/40" />
                {colors.length > 2 && (
                  <button onClick={() => removeColor(i)}
                    className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-all">
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addColor}
            className="mt-3 w-full px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
            + Add Color
          </button>
        </div>

        <button onClick={() => jumpTo()}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          ✅ Generate CSS
        </button>

        <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">CSS Code</h3>
          </div>
          <div className="bg-black/20 rounded-xl p-4 font-mono text-sm text-emerald-400 break-all mb-3">
            {gradientCSS}
          </div>
          <button onClick={copyToClipboard}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
              copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 border-white/[0.08] text-slate-400 hover:text-white'
            }`}>
            {copied ? '✅ Copied!' : '📋 Copy CSS'}
          </button>
        </div>
      </div>
    </ToolLayout>
  )
}
