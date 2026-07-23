import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

// Color conversion helpers
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
}
function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}
function rgbToHsl({ r, g, b }) {
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
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}
function hslToRgb({ h, s, l }) {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => { const k = (n + h / 30) % 12; return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1) }
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) }
}
function hslToHex(hsl) { return rgbToHex(hslToRgb(hsl)) }
function rotateHue(hsl, deg) { return { h: ((hsl.h + deg) % 360 + 360) % 360, s: hsl.s, l: hsl.l } }

function relativeLuminance({ r, g, b }) {
  const sRGB = [r, g, b].map(c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) })
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
}
function contrastRatio(rgb1, rgb2) {
  const l1 = relativeLuminance(rgb1), l2 = relativeLuminance(rgb2)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

function generateHarmonies(hex) {
  const hsl = rgbToHsl(hexToRgb(hex))
  return [
    { name: 'Complementary', icon: '↔', desc: 'Opposite on color wheel', colors: [hex, hslToHex(rotateHue(hsl, 180))] },
    { name: 'Analogous', icon: '〰', desc: '3 adjacent colors', colors: [hslToHex(rotateHue(hsl, -30)), hex, hslToHex(rotateHue(hsl, 30))] },
    { name: 'Triadic', icon: '△', desc: '3 colors × 120° apart', colors: [hex, hslToHex(rotateHue(hsl, 120)), hslToHex(rotateHue(hsl, 240))] },
    { name: 'Split-Complementary', icon: '⊻', desc: 'Base + two near complement', colors: [hex, hslToHex(rotateHue(hsl, 150)), hslToHex(rotateHue(hsl, 210))] },
    { name: 'Tetradic / Square', icon: '□', desc: '4 colors × 90° apart', colors: [hex, hslToHex(rotateHue(hsl, 90)), hslToHex(rotateHue(hsl, 180)), hslToHex(rotateHue(hsl, 270))] },
  ]
}

function generateTints(hex) {
  const hsl = rgbToHsl(hexToRgb(hex))
  const steps = []
  for (let i = 10; i <= 90; i += 8) steps.push({ hex: hslToHex({ h: hsl.h, s: hsl.s, l: i }), pct: i })
  return steps
}

export default function color_palette_generator() {
  const [hex, setHex] = useState('#22d3ee')
  const [copied, setCopied] = useState(null)

  const isValidHex = v => /^#[0-9a-fA-F]{6}$/.test(v)
  const handleInput = v => { if (!v.startsWith('#')) v = '#' + v; if (isValidHex(v)) setHex(v.toLowerCase()) }

  const harmonies = useMemo(() => generateHarmonies(hex), [hex])
  const tints = useMemo(() => generateTints(hex), [hex])
  const formats = useMemo(() => {
    const rgb = hexToRgb(hex), hsl = rgbToHsl(hexToRgb(hex))
    return { HEX: hex.toUpperCase(), RGB: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, HSL: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` }
  }, [hex])

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const randomHex = () => {
    const h = Math.floor(Math.random() * 360), s = 60 + Math.floor(Math.random() * 30), l = 45 + Math.floor(Math.random() * 20)
    setHex(hslToHex({ h, s, l }))
  }

  const SwatchCard = ({ color }) => {
    const rgb = hexToRgb(color), hsl = rgbToHsl(rgb)
    const crBlack = contrastRatio(rgb, { r: 0, g: 0, b: 0 })
    const crWhite = contrastRatio(rgb, { r: 255, g: 255, b: 255 })
    return (
      <div className="rounded-xl overflow-hidden border border-white/8 hover:border-white/15 transition-all cursor-pointer group"
        onClick={() => copyToClipboard(color.toUpperCase())}>
        <div className="h-16 relative" style={{ background: color }}>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl opacity-0 group-hover:opacity-100 transition-opacity">📋</span>
        </div>
        <div className="p-2 bg-white/[0.04]">
          <div className="text-xs font-bold text-white font-mono">{color.toUpperCase()}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{rgb.r},{rgb.g},{rgb.b}</div>
          <div className="flex gap-1 mt-1 flex-wrap">
            <span className={`text-[9px] px-1 rounded ${crBlack >= 4.5 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-slate-600'}`}>AA ⚫</span>
            <span className={`text-[9px] px-1 rounded ${crWhite >= 4.5 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-slate-600'}`}>AA ⚪</span>
          </div>
        </div>
      </div>
    )
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Color Palette Generator"
      desc="Generate beautiful color palettes with complementary, analogous, triadic harmonies. Get HEX, RGB, HSL values with WCAG contrast checks."
      icon="🎨" iconBg="rgba(168,85,247,0.08)"
      category="design" slug="color-palette-generator"
      faq={[
        { q: 'What color harmonies are supported?', a: 'Complementary, Analogous, Triadic, Split-Complementary, and Tetradic (Square) — all generated from a single base color.' },
        { q: 'What is WCAG contrast checking?', a: 'WCAG (Web Content Accessibility Guidelines) defines minimum contrast ratios for text readability. AA requires 4.5:1, AAA requires 7:1.' },
      ]}
      howItWorks={[
        'Pick a base color using the color picker or hex input.',
        'View harmonious palettes generated automatically.',
        'Check WCAG contrast scores for each swatch.',
        'Click any swatch to copy its color code.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Color Palette Generator", "applicationCategory": "DesignApplication",
        "url": "https://www.uptools.in/color-palette-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Color Picker */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex flex-col sm:flex-row items-center gap-4">
          <input type="color" value={hex} onChange={e => setHex(e.target.value)}
            className="w-16 h-16 rounded-xl cursor-pointer border-2 border-white/10" />
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-500 mb-1 block">HEX</label>
            <input type="text" value={hex} onChange={e => handleInput(e.target.value)}
              className={inputClass} />
          </div>
          <button onClick={randomHex}
            className="px-5 py-3 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 font-bold text-sm hover:text-white transition-all">
            🎲 Random
          </button>
        </div>

        {/* Preview Strip */}
        <div className="h-8 rounded-xl overflow-hidden" style={{
          background: `linear-gradient(to right, ${Array.from({ length: 12 }, (_, i) => hslToHex({ h: i * 30, s: rgbToHsl(hexToRgb(hex)).s, l: rgbToHsl(hexToRgb(hex)).l })).join(', ')})`
        }} />

        {/* Formats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(formats).map(([label, value]) => (
            <div key={label} className="p-3 rounded-xl bg-white/[0.04] border border-white/8 cursor-pointer hover:border-white/15 transition-all"
              onClick={() => copyToClipboard(value)}>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</div>
              <div className="text-sm font-mono font-bold text-white">{value}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">{copied === value ? '✓ Copied' : 'Click to copy'}</div>
            </div>
          ))}
        </div>

        {/* Harmonies */}
        {harmonies.map(h => (
          <div key={h.name} className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-lg mr-2">{h.icon}</span>
                <span className="text-sm font-bold text-white">{h.name}</span>
              </div>
              <span className="text-[10px] text-slate-500">{h.desc}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {h.colors.map((c, i) => <SwatchCard key={i} color={c} />)}
            </div>
          </div>
        ))}

        {/* Tints & Shades */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
          <h3 className="text-sm font-bold text-white mb-3">🌈 Tints & Shades</h3>
          <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
            {tints.map(t => (
              <div key={t.pct} className="rounded-lg overflow-hidden cursor-pointer hover:scale-110 transition-transform"
                onClick={() => copyToClipboard(t.hex.toUpperCase())}>
                <div className="h-10" style={{ background: t.hex }} />
                <div className="p-1 bg-white/[0.04] text-center">
                  <div className="text-[9px] font-mono text-slate-300">{t.hex.toUpperCase()}</div>
                  <div className="text-[8px] text-slate-600">L{t.pct}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
