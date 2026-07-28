import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function hexToRgb(hex) {
  hex = hex.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
  const num = parseInt(hex, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')
}

function getRelativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(hex1, hex2) {
  const lum1 = getRelativeLuminance(hexToRgb(hex1))
  const lum2 = getRelativeLuminance(hexToRgb(hex2))
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

function getWCAGResults(ratio) {
  return {
    aaLargeNormal: ratio >= 3,
    aaNormal: ratio >= 4.5,
    aaaLargeNormal: ratio >= 4.5,
    aaaNormal: ratio >= 7,
  }
}

function getGrade(ratio) {
  if (ratio >= 7) return { grade: 'AAA', color: 'text-emerald-400', bg: 'bg-emerald-500/15' }
  if (ratio >= 4.5) return { grade: 'AA', color: 'text-green-400', bg: 'bg-green-500/15' }
  if (ratio >= 3) return { grade: 'AA Large', color: 'text-amber-400', bg: 'bg-amber-500/15' }
  return { grade: 'Fail', color: 'text-red-400', bg: 'bg-red-500/15' }
}

function getContrastSuggestions(fgHex, bgHex) {
  const fg = hexToRgb(fgHex)
  const bg = hexToRgb(bgHex)
  const bgLum = getRelativeLuminance(bg)
  // Try to find closest compliant color by adjusting lightness
  const suggestions = []
  const tryColor = (r, g, b) => hexToHex(rgbToHex(Math.max(0, Math.min(255, Math.round(r))), Math.max(0, Math.min(255, Math.round(g))), Math.max(0, Math.min(255, Math.round(b)))))
  // Darken foreground
  for (let factor = 0.9; factor >= 0.1; factor -= 0.1) {
    const dark = { r: Math.round(fg.r * factor), g: Math.round(fg.g * factor), b: Math.round(fg.b * factor) }
    const hex = rgbToHex(dark.r, dark.g, dark.b)
    const ratio = getContrastRatio(hex, bgHex)
    if (ratio >= 4.5) { suggestions.push({ color: hex, ratio: ratio.toFixed(1), label: 'Darker foreground' }); break }
  }
  // Lighten foreground
  for (let factor = 1.1; factor <= 3; factor += 0.2) {
    const light = { r: Math.min(255, Math.round(fg.r + (255 - fg.r) * (factor - 1))), g: Math.min(255, Math.round(fg.g + (255 - fg.g) * (factor - 1))), b: Math.min(255, Math.round(fg.b + (255 - fg.b) * (factor - 1))) }
    const hex = rgbToHex(light.r, light.g, light.b)
    const ratio = getContrastRatio(hex, bgHex)
    if (ratio >= 4.5) { suggestions.push({ color: hex, ratio: ratio.toFixed(1), label: 'Lighter foreground' }); break }
  }
  return suggestions
}

export default function ColorContrastChecker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [fgColor, setFgColor] = useState('#ffffff')
  const [bgColor, setBgColor] = useState('#1e1e2e')
  const [error, setError] = useState('')

  const isValidHex = (h) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(h)

  const result = useMemo(() => {
    if (!isValidHex(fgColor) || !isValidHex(bgColor)) { setError('Enter valid hex colors (e.g. #ffffff)'); return null }
    setError('')
    const ratio = getContrastRatio(fgColor, bgColor)
    const wcag = getWCAGResults(ratio)
    const grade = getGrade(ratio)
    const suggestions = ratio < 4.5 ? getContrastSuggestions(fgColor, bgColor) : []
    return { ratio, wcag, grade, suggestions }
  }, [fgColor, bgColor])

  const swapColors = () => {
    setFgColor(bgColor)
    setBgColor(fgColor)
  }

  return (
    <ToolLayout
      title="Color Contrast Checker"
      desc="Check WCAG color contrast ratios for accessibility. Get AA/AAA compliance results with live preview."
      icon="👁️" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="color-contrast-checker"
      faq={[
        { q: 'What is Color Contrast Checker?', a: 'A tool that calculates the contrast ratio between two colors and checks compliance with WCAG 2.1 accessibility standards (AA and AAA levels).' },
        { q: 'What is WCAG AA?', a: 'A minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text. This is the baseline accessibility standard.' },
        { q: 'What is WCAG AAA?', a: 'A higher contrast ratio of 7:1 for normal text and 4.5:1 for large text. This is the enhanced accessibility standard.' },
      ]}
      howItWorks={[
        'Select foreground (text) and background colors using color pickers or hex input.',
        'See the contrast ratio and WCAG compliance results in real time.',
        'View a live preview of text with the selected colors.',
        'Get suggestions for improving contrast if below standards.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Color Contrast Checker", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/color-contrast-checker/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Color inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <label className="block text-xs font-semibold text-slate-300 mb-2">🎨 Foreground (Text)</label>
            <div className="flex items-center gap-2">
              <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer" />
              <input type="text" value={fgColor} onChange={e => setFgColor(e.target.value)}
                className="flex-1 bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/40 [color-scheme:dark]" />
            </div>
          </div>
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <label className="block text-xs font-semibold text-slate-300 mb-2">🎨 Background</label>
            <div className="flex items-center gap-2">
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer" />
              <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)}
                className="flex-1 bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/40 [color-scheme:dark]" />
            </div>
          </div>
        </div>

        <button onClick={swapColors}
          className="mx-auto px-4 py-1.5 rounded-xl text-xs font-bold border-2 border-white/[0.08] bg-white/[0.04] text-slate-300 hover:border-white/[0.15] transition-all">
          🔄 Swap Colors
        </button>

        {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}

        {/* Live Preview */}
        <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: bgColor }}>
          <p style={{ color: fgColor, fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            Sample Heading Text
          </p>
          <p style={{ color: fgColor, fontSize: '16px', marginBottom: '4px' }}>
            This is how your text will look with these colors.
          </p>
          <p style={{ color: fgColor, fontSize: '12px', opacity: 0.8 }}>
            Small text (12px) — important for accessibility.
          </p>
        </div>

        {/* Results */}
        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>

            {/* Ratio */}
            <div className="text-center mb-6">
              <div className={`text-5xl font-extrabold ${result.grade.color}`}>{result.ratio.toFixed(2)}:1</div>
              <div className={`inline-block px-3 py-1 rounded-lg text-xs font-bold mt-2 ${result.grade.bg} ${result.grade.color}`}>
                {result.grade.grade}
              </div>
            </div>

            {/* WCAG Results */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                ['AA Normal Text (≥4.5:1)', result.wcag.aaNormal],
                ['AA Large Text (≥3:1)', result.wcag.aaLargeNormal],
                ['AAA Normal Text (≥7:1)', result.wcag.aaaNormal],
                ['AAA Large Text (≥4.5:1)', result.wcag.aaaLargeNormal],
              ].map(([label, pass]) => (
                <div key={label} className={`p-3 rounded-xl border ${pass ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg ${pass ? 'text-emerald-400' : 'text-red-400'}`}>
                      {pass ? '✅' : '❌'}
                    </span>
                    <span className="text-xs font-bold text-slate-300">{label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <h4 className="text-xs font-bold text-amber-400 mb-2">💡 Suggested Improvements</h4>
                {result.suggestions.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 mt-2">
                    <div className="w-6 h-6 rounded border border-white/20" style={{ backgroundColor: s.color }} />
                    <span className="text-xs text-slate-300 font-mono">{s.color}</span>
                    <span className="text-xs text-amber-400 font-bold">{s.ratio}:1</span>
                    <span className="text-[10px] text-slate-500">{s.label}</span>
                    <button onClick={() => { setFgColor(s.color) }}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 ml-auto">
                      Use
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div className="mt-4 text-center text-xs text-slate-600">
              <p>Foreground: <span className="font-mono text-slate-400">{fgColor}</span> · Background: <span className="font-mono text-slate-400">{bgColor}</span></p>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">👁️</div>
            <p className="text-sm text-slate-600 font-medium">Pick two colors to check contrast</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
