import { useState, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '')
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
  if (hex.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(hex)) return null
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100
  let r, g, b
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

function isValidHex(hex) {
  return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)
}

const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F1948A', '#82E0AA', '#F8C471', '#AED6F1', '#D7BDE2',
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
]

export default function hex_to_rgb_converter() {
  const [hexInput, setHexInput] = useState('#6366F1')
  const [rgbInput, setRgbInput] = useState({ r: 99, g: 102, b: 241 })
  const [hslInput, setHslInput] = useState({ h: 239, s: 84, l: 67 })
  const [color, setColor] = useState({ r: 99, g: 102, b: 241 })
  const [error, setError] = useState('')

  const fromHex = useCallback((hex) => {
    setHexInput(hex)
    const rgb = hexToRgb(hex)
    if (rgb) {
      setError('')
      setRgbInput(rgb)
      setHslInput(rgbToHsl(rgb.r, rgb.g, rgb.b))
      setColor(rgb)
    } else if (hex.replace('#', '').length >= 3) {
      setError('Invalid hex color')
    }
  }, [])

  const fromRgb = useCallback((r, g, b) => {
    const newRgb = { r, g, b }
    setRgbInput(newRgb)
    setHexInput(rgbToHex(r, g, b))
    setHslInput(rgbToHsl(r, g, b))
    setColor(newRgb)
    setError('')
  }, [])

  const fromHsl = useCallback((h, s, l) => {
    setHslInput({ h, s, l })
    const rgb = hslToRgb(h, s, l)
    setRgbInput(rgb)
    setHexInput(rgbToHex(rgb.r, rgb.g, rgb.b))
    setColor(rgb)
    setError('')
  }, [])

  useEffect(() => {
    const rgb = hexToRgb(hexInput)
    if (rgb) {
      setRgbInput(rgb)
      setHslInput(rgbToHsl(rgb.r, rgb.g, rgb.b))
      setColor(rgb)
    }
  }, [])

  const textColor = (color.r * 299 + color.g * 587 + color.b * 114) / 1000 > 128 ? '#000' : '#fff'

  return (
    <ToolLayout
      title="HEX ↔ RGB ↔ HSL Converter"
      desc="Convert between HEX, RGB, and HSL color formats with live preview. Click presets to try colors."
      icon="🌈" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="hex-to-rgb-converter"
      faq={[
        { q: 'What formats are supported?', a: 'HEX (#RRGGBB), RGB (r, g, b), and HSL (h°, s%, l%) with bidirectional conversion.' },
        { q: 'How do I use the preview?', a: 'The large color swatch updates in real-time as you change any value.' },
      ]}
      howItWorks={[
        'Enter a color in any format (HEX, RGB, or HSL).',
        'All other formats update automatically.',
        'Click a preset color or the preview to copy the HEX value.',
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Color preview */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center gap-5">
            <div onClick={() => navigator.clipboard.writeText(rgbToHex(color.r, color.g, color.b))}
              className="w-24 h-24 rounded-2xl border-2 border-white/[0.15] cursor-pointer hover:scale-105 transition-all shadow-lg flex items-center justify-center"
              style={{ backgroundColor: rgbToHex(color.r, color.g, color.b) }}>
              <span className="text-xs font-bold opacity-70" style={{ color: textColor }}>Click to copy</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-300 mb-1">Live Preview</div>
              <div className="font-mono text-lg text-white font-extrabold">{rgbToHex(color.r, color.g, color.b).toUpperCase()}</div>
              <div className="font-mono text-xs text-slate-400 mt-1">
                rgb({color.r}, {color.g}, {color.b})
              </div>
              <div className="font-mono text-xs text-slate-400">
                hsl({rgbToHsl(color.r, color.g, color.b).h}°, {rgbToHsl(color.r, color.g, color.b).s}%, {rgbToHsl(color.r, color.g, color.b).l}%)
              </div>
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Preset Colors</h3>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map(c => (
              <button key={c} onClick={() => fromHex(c)}
                className="w-8 h-8 rounded-lg border-2 hover:scale-110 transition-all"
                style={{ backgroundColor: c, borderColor: hexInput.toLowerCase() === c.toLowerCase() ? 'white' : 'rgba(255,255,255,0.1)' }}
                title={c} />
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">{error}</div>
        )}

        {/* HEX Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">HEX</label>
          <input type="text" value={hexInput} onChange={e => fromHex(e.target.value)}
            placeholder="#FF0000"
            className="mt-2 w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600" />
        </div>

        {/* RGB Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">RGB</label>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[['r', 'Red'], ['g', 'Green'], ['b', 'Blue']].map(([key, label]) => (
              <div key={key}>
                <span className="text-[10px] text-slate-500 uppercase font-bold">{label}</span>
                <input type="number" min={0} max={255} value={rgbInput[key]}
                  onChange={e => fromRgb(
                    key === 'r' ? +e.target.value : rgbInput.r,
                    key === 'g' ? +e.target.value : rgbInput.g,
                    key === 'b' ? +e.target.value : rgbInput.b
                  )}
                  className="mt-1 w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/40 transition-all" />
              </div>
            ))}
          </div>
          {/* RGB sliders */}
          <div className="mt-3 space-y-2">
            {[['r', 255, 0, 0], ['g', 0, 255, 0], ['b', 0, 0, 255]].map(([key, r, g, b]) => (
              <div key={key} className="flex items-center gap-3">
                <input type="range" min={0} max={255} value={rgbInput[key]}
                  onChange={e => fromRgb(
                    key === 'r' ? +e.target.value : rgbInput.r,
                    key === 'g' ? +e.target.value : rgbInput.g,
                    key === 'b' ? +e.target.value : rgbInput.b
                  )}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `rgb(${r},${g},${b})` }} />
                <span className="text-xs text-slate-500 font-mono w-8 text-right">{rgbInput[key]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* HSL Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">HSL</label>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[['h', 'Hue', '°'], ['s', 'Saturation', '%'], ['l', 'Lightness', '%']].map(([key, label, unit]) => (
              <div key={key}>
                <span className="text-[10px] text-slate-500 uppercase font-bold">{label}</span>
                <div className="flex items-center mt-1">
                  <input type="number" min={key === 'h' ? 0 : 0} max={key === 'h' ? 360 : 100}
                    value={hslInput[key]}
                    onChange={e => fromHsl(
                      key === 'h' ? +e.target.value : hslInput.h,
                      key === 's' ? +e.target.value : hslInput.s,
                      key === 'l' ? +e.target.value : hslInput.l
                    )}
                    className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/40 transition-all" />
                  <span className="text-xs text-slate-500 ml-1">{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copy formats */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Copy Format</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              ['HEX', rgbToHex(color.r, color.g, color.b).toUpperCase()],
              ['RGB', `rgb(${color.r}, ${color.g}, ${color.b})`],
              ['HSL', `hsl(${rgbToHsl(color.r, color.g, color.b).h}, ${rgbToHsl(color.r, color.g, color.b).s}%, ${rgbToHsl(color.r, color.g, color.b).l}%)`],
            ].map(([label, val]) => (
              <button key={label} onClick={() => navigator.clipboard.writeText(val)}
                className="bg-black/20 rounded-xl px-3 py-2.5 text-left hover:bg-white/[0.08] transition-all group">
                <span className="text-[10px] text-slate-500 uppercase font-bold">{label}</span>
                <p className="text-xs text-white font-mono group-hover:text-indigo-300 transition-all truncate">{val}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
