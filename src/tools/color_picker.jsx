import { useState, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function color_picker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [hex, setHex] = useState('#8ab4f8')
  const [copied, setCopied] = useState(null)
  const [savedColors, setSavedColors] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cp-saved') || '[]') } catch { return [] }
  })

  const clamp = (x, min, max) => Math.min(max, Math.max(min, x))

  const hexNorm = (h) => {
    h = h.trim().replace('#', '').toLowerCase()
    if (h.length === 3) h = h.split('').map(c => c + c).join('')
    return '#' + h.slice(0, 6)
  }

  const hexToRgb = (hex) => {
    hex = hexNorm(hex).replace('#', '')
    const n = parseInt(hex, 16)
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
  }

  const rgbToHex = ({ r, g, b }) => {
    const toHex = n => n.toString(16).padStart(2, '0')
    return ('#' + toHex(r) + toHex(g) + toHex(b)).toUpperCase()
  }

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2
    if (max === min) { h = s = 0 } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  const hslToRgb = (h, s, l) => {
    h /= 360; s /= 100; l /= 100
    if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v } }
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    return {
      r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
    }
  }

  const hslToHex = (h, s, l) => rgbToHex(hslToRgb(h, s, l))

  const relLum = ({ r, g, b }) => {
    const srgb = [r, g, b].map(v => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow(((v + 0.055) / 1.055), 2.4)
    })
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
  }

  const contrastRatio = (fg, bg) => {
    const L1 = relLum(hexToRgb(fg)), L2 = relLum(hexToRgb(bg))
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
  }

  const rgb = hexToRgb(hex)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

  const paletteSteps = [88, 80, 72, 64, 56, 48, 40, 32, 24, 16]
  const palette = paletteSteps.map(light => hslToHex(hsl.h, hsl.s, clamp(light, 0, 100)))

  const contrastLight = contrastRatio(hex, '#ffffff')
  const contrastDark = contrastRatio(hex, '#0b1020')

  const wcagBadge = (ratio) => {
    if (ratio >= 7) return { text: 'AAA', cls: 'text-emerald-400' }
    if (ratio >= 4.5) return { text: 'AA', cls: 'text-emerald-400' }
    if (ratio >= 3) return { text: 'AA Large', cls: 'text-amber-400' }
    return { text: 'Fail', cls: 'text-red-400' }
  }

  const copyToClipboard = useCallback(async (text, label) => {
    try { await navigator.clipboard.writeText(text) } catch {}
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const saveColor = useCallback(() => {
    const c = hex.toUpperCase()
    if (!savedColors.includes(c)) {
      const next = [c, ...savedColors].slice(0, 48)
      setSavedColors(next)
      try { localStorage.setItem('cp-saved', JSON.stringify(next)) } catch {}
    }
  }, [hex, savedColors])

  const removeSaved = useCallback((c) => {
    const next = savedColors.filter(x => x !== c)
    setSavedColors(next)
    try { localStorage.setItem('cp-saved', JSON.stringify(next)) } catch {}
  }, [savedColors])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Color Picker & Converter"
      desc="Pick colors, convert between HEX, RGB, and HSL, check WCAG contrast, generate palettes, and export CSS variables."
      icon="🎨" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="color-picker"
      faq={[
        { q: "What color formats are supported?", a: "HEX, RGB, and HSL — you can convert between all three instantly." },
        { q: "What is WCAG contrast?", a: "WCAG contrast ratio measures readability of text against backgrounds. AA requires 4.5:1, AAA requires 7:1." },
      ]}
      howItWorks={[
        "Pick a color using the color input or type a HEX value.",
        "View conversions, contrast ratios, and shade palettes.",
        "Copy any format or save colors to your palette.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Color Picker & Converter", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/color-picker/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Color input */}
        <div className="bg-white/[0.06] border-2 border-white/8 rounded-2xl p-4 flex items-center gap-4">
          <input type="color" value={hex} onChange={e => setHex(e.target.value)}
            className="w-16 h-16 rounded-xl border-none cursor-pointer bg-transparent shrink-0" />
          <input type="text" value={hex.toUpperCase()} onChange={e => setHex(e.target.value)}
            className="flex-1 bg-black/20 border border-white/8 rounded-xl px-4 py-3 font-mono text-white text-lg outline-none focus:border-indigo-500/40 uppercase" />
          <div className="w-16 h-16 rounded-xl shrink-0" style={{ background: hex }} />
        </div>

        {/* Readouts */}
        <div className="bg-white/[0.06] border-2 border-white/8 rounded-2xl p-4 space-y-2">
          {[
            { label: 'HEX', value: hex.toUpperCase() },
            { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
            { label: 'HSL', value: `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)` },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1">
              <span className="text-sm text-slate-400">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-white">{item.value}</span>
                <button onClick={() => copyToClipboard(item.value, item.label)}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    copied === item.label ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500 hover:text-white'
                  }`}>
                  {copied === item.label ? '✓' : '📋'}
                </button>
              </div>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button onClick={saveColor}
              className="flex-1 px-3 py-2 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
              ⭐ Save
            </button>
          </div>
        </div>

        {/* WCAG Contrast */}
        <div className="bg-white/[0.06] border-2 border-white/8 rounded-2xl p-4">
          <p className="text-sm font-semibold text-slate-300 mb-3">WCAG Contrast</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">On White</p>
              <p className="font-mono text-sm text-black font-bold">{contrastLight.toFixed(2)}:1</p>
              <span className={`text-xs font-bold ${wcagBadge(contrastLight).cls}`}>{wcagBadge(contrastLight).text}</span>
            </div>
            <div className="bg-[#0b1020] rounded-xl p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">On Dark</p>
              <p className="font-mono text-sm text-white font-bold">{contrastDark.toFixed(2)}:1</p>
              <span className={`text-xs font-bold ${wcagBadge(contrastDark).cls}`}>{wcagBadge(contrastDark).text}</span>
            </div>
          </div>
        </div>

        {/* Palette */}
        <div className="bg-white/[0.06] border-2 border-white/8 rounded-2xl p-4">
          <p className="text-sm font-semibold text-slate-300 mb-3">Shade Palette</p>
          <div className="flex gap-1">
            {palette.map((c, i) => (
              <button key={i} onClick={() => { setHex(c); jumpTo() }}
                className="flex-1 h-10 rounded-lg cursor-pointer hover:scale-110 transition-transform"
                style={{ background: c }} title={c} />
            ))}
          </div>
          <div className="flex gap-1 mt-1">
            {palette.map((c, i) => (
              <button key={i} onClick={() => copyToClipboard(c, 'pal-' + i)}
                className={`flex-1 text-center text-[8px] font-mono rounded transition-all ${
                  copied === 'pal-' + i ? 'text-emerald-400' : 'text-slate-500 hover:text-white'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* CSS Variables */}
        <button onClick={() => {
          const vars = `:root {\n${paletteSteps.map(lv => `  --brand-${lv}: hsl(${hsl.h} ${hsl.s}% ${lv}%);`).join('\n')}\n}`
          copyToClipboard(vars, 'css-vars')
        }}
          className={`w-full py-3 rounded-xl text-sm font-bold border transition-all ${
            copied === 'css-vars' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'
          }`}>
          {copied === 'css-vars' ? '✅ Copied!' : '📋 Copy CSS Variables'}
        </button>

        {/* Saved colors */}
        {savedColors.length > 0 && (
          <div className="bg-white/[0.06] border-2 border-white/8 rounded-2xl p-4">
            <p className="text-sm font-semibold text-slate-300 mb-3">Saved Colors ({savedColors.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {savedColors.map((c, i) => (
                <button key={i} onClick={() => { setHex(c); jumpTo() }}
                  onContextMenu={(e) => { e.preventDefault(); removeSaved(c) }}
                  className="w-8 h-8 rounded-lg cursor-pointer hover:scale-110 transition-transform border border-white/10"
                  style={{ background: c }} title={`${c} — right-click to remove`} />
              ))}
            </div>
          </div>
        )}

        <div ref={resultRef} className="text-center py-8 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
          <p className="text-sm text-slate-600 font-medium">Pick a color above to see conversions and palettes</p>
        </div>
      </div>
    </ToolLayout>
  )
}
