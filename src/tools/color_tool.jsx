import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

function hslToRgb(h, s, l) {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => { const k = (n + h / 30) % 12; return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1) }
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}
function rgbToCmyk(r, g, b) {
  if (r === 0 && g === 0 && b === 0) return [0, 0, 0, 100]
  let c = 1 - r / 255, m = 1 - g / 255, y = 1 - b / 255, k = Math.min(c, m, y)
  return [Math.round((c - k) / (1 - k) * 100), Math.round((m - k) / (1 - k) * 100), Math.round((y - k) / (1 - k) * 100), Math.round(k * 100)]
}
function hexToRgb(h) {
  h = h.replace('#', '')
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]
}
function rgbToHex(r, g, b) { return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('') }

export default function color_tool() {
  const [h, setH] = useState(187)
  const [s, setS] = useState(100)
  const [l, setL] = useState(50)
  const [hexInput, setHexInput] = useState('')
  const [copied, setCopied] = useState(null)
  const [gradColor2, setGradColor2] = useState('#6366f1')

  const rgb = useMemo(() => hslToRgb(h, s, l), [h, s, l])
  const hex = useMemo(() => rgbToHex(...rgb), [rgb])
  const cmyk = useMemo(() => rgbToCmyk(...rgb), [rgb])

  const cssVars = `:root {\n  --primary: ${hex};\n  --primary-rgb: ${rgb.join(', ')};\n  --primary-hsl: ${h}, ${s}%, ${l}%;\n}`

  const updateFromHex = useCallback((val) => {
    if (/^#?[0-9a-fA-F]{6}$/.test(val)) {
      const [r, g, b] = hexToRgb(val)
      const [nh, ns, nl] = rgbToHsl(r, g, b)
      setH(nh); setS(ns); setL(nl)
    }
  }, [])

  const palettes = useMemo(() => {
    const comp = [(h + 180) % 360]
    const analogous = [(h + 30) % 360, (h + 60) % 360]
    const triadic = [(h + 120) % 360, (h + 240) % 360]
    const split = [(h + 150) % 360, (h + 210) % 360]
    const mono = [l - 20, l - 10, l + 10, l + 20].map(x => ((x % 100) + 100) % 100)
    return { comp, analogous, triadic, split, mono }
  }, [h, l])

  const copySwatch = useCallback((color) => {
    navigator.clipboard.writeText(color)
    setCopied(color); setTimeout(() => setCopied(null), 1500)
  }, [])

  const SwatchRow = ({ label, hues }) => (
    <div className="mb-3">
      <div className="text-xs text-slate-500 font-semibold mb-1.5">{label}</div>
      <div className="flex gap-1.5">
        {hues.map((hue, i) => {
          const [r, g, b] = hslToRgb(hue, s, l)
          const c = rgbToHex(r, g, b)
          return (
            <button key={i} onClick={() => copySwatch(c)}
              className="flex-1 h-10 rounded-lg border border-white/10 hover:scale-105 transition-all flex items-end justify-center pb-1"
              style={{ background: c }}>
              <span className="text-[9px] font-mono font-bold" style={{ color: l > 50 ? '#000' : '#fff', opacity: 0.7 }}>{c}</span>
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <ToolLayout
      title="Color Tool"
      desc="Pick colors, convert between HEX, RGB, HSL, and CMYK formats. Generate complementary, analogous, and triadic palettes."
      icon="🎨" iconBg="rgba(139,92,246,0.08)"
      category="design" slug="color-tool"
      faq={[
        { q: 'What color formats are supported?', a: 'HEX, RGB, HSL, and CMYK. Convert between any format instantly.' },
        { q: 'Can I generate color palettes?', a: 'Yes, see complementary, analogous, triadic, split-complementary, and monochromatic palettes from any color.' },
      ]}
      howItWorks={[
        'Use the sliders or enter a HEX code to pick a color.',
        'See your color in HEX, RGB, HSL, and CMYK formats.',
        'Generate color palettes from any base color.',
        'Click any swatch to copy its HEX value.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Color Tool", "applicationCategory": "DesignApplication",
        "url": "https://www.uptools.in/color-tool/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-lg mx-auto space-y-4">
        {/* Preview */}
        <div className="h-32 rounded-2xl border-2 border-white/10 transition-all" style={{ background: hex }} />

        {/* Sliders */}
        <div className="bg-white/[0.06] border border-white/8 rounded-2xl p-4 space-y-4">
          {[
            { label: 'Hue', val: h, set: setH, max: 359, gradient: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' },
            { label: 'Saturation', val: s, set: setS, max: 100, gradient: `linear-gradient(to right, ${rgbToHex(...hslToRgb(h, 0, l))}, ${rgbToHex(...hslToRgb(h, 100, l))})` },
            { label: 'Lightness', val: l, set: setL, max: 100, gradient: `linear-gradient(to right, ${rgbToHex(...hslToRgb(h, s, 0))}, ${rgbToHex(...hslToRgb(h, s, 50))}, ${rgbToHex(...hslToRgb(h, s, 100))})` },
          ].map(sl => (
            <div key={sl.label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-semibold text-slate-400">{sl.label}</span>
                <span className="text-xs font-mono font-bold text-white">{sl.val}</span>
              </div>
              <input type="range" min="0" max={sl.max} value={sl.val}
                onChange={e => sl.set(+e.target.value)}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ background: sl.gradient }} />
            </div>
          ))}
        </div>

        {/* Format Values */}
        <div className="bg-white/[0.06] border border-white/8 rounded-2xl p-4 space-y-2">
          {[
            { label: 'HEX', value: hex },
            { label: 'RGB', value: `rgb(${rgb.join(', ')})` },
            { label: 'HSL', value: `hsl(${h}, ${s}%, ${l}%)` },
            { label: 'CMYK', value: `cmyk(${cmyk.join('%, ')}%)` },
          ].map(f => (
            <div key={f.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
              <span className="text-xs font-bold text-slate-500 w-12">{f.label}</span>
              <span className="text-xs font-mono text-white flex-1 text-right mr-2">{f.value}</span>
              <button onClick={() => copySwatch(f.value)}
                className={`text-xs px-2 py-1 rounded-lg transition-all ${copied === f.value ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500 hover:text-white'}`}>
                {copied === f.value ? '✓' : '📋'}
              </button>
            </div>
          ))}
          {/* Native Color Picker */}
          <div className="flex items-center justify-between py-1.5">
            <span className="text-xs font-bold text-slate-500">Picker</span>
            <input type="color" value={hex}
              onChange={e => { const [r, g, b] = hexToRgb(e.target.value); const [nh, ns, nl] = rgbToHsl(r, g, b); setH(nh); setS(ns); setL(nl) }}
              className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer bg-transparent" />
          </div>
        </div>

        {/* Palettes */}
        <div className="bg-white/[0.06] border border-white/8 rounded-2xl p-4">
          <div className="text-xs font-bold text-slate-400 mb-3">🎨 Color Palettes</div>
          <SwatchRow label="Complementary" hues={[...palettes.comp, h]} />
          <SwatchRow label="Analogous" hues={[...palettes.analogous, h]} />
          <SwatchRow label="Triadic" hues={[...palettes.triadic, h]} />
          <SwatchRow label="Split-Complementary" hues={[...palettes.split, h]} />
          <SwatchRow label="Monochromatic" hues={palettes.mono.map(l2 => h)} />
        </div>

        {/* CSS Output */}
        <div className="bg-white/[0.06] border border-white/8 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">CSS Variables</span>
            <button onClick={() => copySwatch(cssVars)}
              className={`text-xs px-2 py-1 rounded-lg transition-all ${copied === 'css' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500 hover:text-white'}`}
              onMouseUp={() => { navigator.clipboard.writeText(cssVars); setCopied('css'); setTimeout(() => setCopied(null), 1500) }}>
              {copied === 'css' ? '✓' : '📋'}
            </button>
          </div>
          <pre className="text-xs font-mono text-slate-300 bg-black/20 rounded-xl p-3 overflow-x-auto whitespace-pre">{cssVars}</pre>
        </div>
      </div>
    </ToolLayout>
  )
}
