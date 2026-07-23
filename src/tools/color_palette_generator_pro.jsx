import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function hexToHSL(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255
  let max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) { h = s = 0 } else {
    let d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => { const k = (n + h / 30) % 12; return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1) }
  return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('')
}

function generatePalette(baseHex, type, count) {
  const [h, s, l] = hexToHSL(baseHex)
  const colors = []
  for (let i = 0; i < count; i++) {
    let nh, ns, nl
    switch (type) {
      case 'analogous':
        nh = (h + (i * 30) - (count * 15)) % 360; ns = s; nl = l; break
      case 'complementary':
        nh = i < count / 2 ? h : (h + 180) % 360; ns = s; nl = l + (i * 10 - count * 5); break
      case 'triadic':
        nh = (h + (i * 120)) % 360; ns = s; nl = l; break
      case 'split':
        nh = i % 3 === 0 ? h : i % 3 === 1 ? (h + 150) % 360 : (h + 210) % 360; ns = s; nl = l + (i * 8); break
      case 'monochromatic':
        nh = h; ns = s; nl = 20 + (i * (60 / count)); break
      default:
        nh = h; ns = s; nl = l
    }
    colors.push(hslToHex(nh, Math.max(0, Math.min(100, ns)), Math.max(0, Math.min(100, nl))))
  }
  return colors
}

export default function color_palette_generator_pro() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [baseColor, setBaseColor] = useState('#6366f1')
  const [paletteType, setPaletteType] = useState('analogous')
  const [colorCount, setColorCount] = useState(5)
  const [copied, setCopied] = useState('')

  const colors = useMemo(() => generatePalette(baseColor, paletteType, colorCount), [baseColor, paletteType, colorCount])

  const cssText = useMemo(() => ':root {\n' + colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n') + '\n}', [colors])

  const copyColor = useCallback((hex) => {
    navigator.clipboard.writeText(hex)
    setCopied(hex)
    setTimeout(() => setCopied(''), 2000)
  }, [])

  const copyCss = useCallback(() => {
    navigator.clipboard.writeText(cssText)
    setCopied('css')
    setTimeout(() => setCopied(''), 2000)
  }, [cssText])

  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="Color Palette Generator"
      desc="Generate color palettes from a base color. Analogous, complementary, triadic, and more."
      icon="🎨" iconBg="rgba(168,85,247,0.08)"
      category="utility" slug="color-palette-generator-pro"
      faq={[
        { q: 'Is this tool free?', a: 'Yes, completely free with no sign-up required.' },
        { q: 'Is my data private?', a: 'Yes. All processing happens in your browser. Files are never uploaded.' },
        { q: 'Does it work on mobile?', a: 'Yes. All tools are mobile-responsive.' },
      ]}
      howItWorks={[
        'Select a base color using the color picker.',
        'Choose a palette type (analogous, complementary, triadic, etc.).',
        'Set the number of colors and click Generate.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Color Palette Generator", "applicationCategory": "DesignApplication",
        "url": "https://www.uptools.in/color-palette-generator-pro/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Controls */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Base Color</label>
              <input type="color" value={baseColor} onChange={e => setBaseColor(e.target.value)}
                className="w-full h-12 rounded-xl cursor-pointer border-2 border-white/8 bg-transparent" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Palette Type</label>
              <select value={paletteType} onChange={e => setPaletteType(e.target.value)} className={selectClass}>
                <option value="analogous">Analogous</option>
                <option value="complementary">Complementary</option>
                <option value="triadic">Triadic</option>
                <option value="split">Split Complementary</option>
                <option value="monochromatic">Monochromatic</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Colors</label>
              <input type="number" value={colorCount} onChange={e => setColorCount(Math.max(3, Math.min(10, Number(e.target.value))))}
                min="3" max="10" className={`${selectClass} text-center`} />
            </div>
          </div>
        </div>

        {/* Palette Display */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <h2 className="text-sm font-bold text-white mb-3">Generated Palette</h2>
          <div className="flex rounded-2xl overflow-hidden h-24">
            {colors.map((c, i) => (
              <div key={i} className="flex-1" style={{ background: c }} />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {colors.map((c, i) => (
              <button key={i} onClick={() => copyColor(c)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                style={{ background: c }}>
                {copied === c ? 'Copied!' : c}
              </button>
            ))}
          </div>
        </div>

        {/* CSS Variables */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <h2 className="text-sm font-bold text-white mb-3">CSS Variables</h2>
          <pre className="text-xs text-slate-400 bg-white/[0.04] rounded-xl p-4 overflow-x-auto font-mono">{cssText}</pre>
          <button onClick={copyCss}
            className="w-full mt-3 py-3 rounded-xl bg-white/[0.06] border border-white/8 text-white text-xs font-bold hover:bg-white/10 transition-all">
            {copied === 'css' ? 'Copied!' : '📋 Copy CSS'}
          </button>
        </div>
      </div>
    </ToolLayout>
  )
}
