import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

function hexToRgb(h) {
  const r = parseInt(h.slice(1,3),16)
  const g = parseInt(h.slice(3,5),16)
  const b = parseInt(h.slice(5,7),16)
  return {r,g,b}
}

function luminance(r,g,b) {
  const a = [r,g,b].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
}

function contrastRatio(c1, c2) {
  const l1 = luminance(c1.r, c1.g, c1.b)
  const l2 = luminance(c2.r, c2.g, c2.b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export default function ColorContrastChecker() {
  const [fg, setFg] = useState('#6366f1')
  const [fgHex, setFgHex] = useState('#6366f1')
  const [bg, setBg] = useState('#111827')
  const [bgHex, setBgHex] = useState('#111827')

  const sync = useCallback((type) => {
    if (type === 'fg') {
      if (/^#[0-9a-fA-F]{6}$/.test(fgHex)) setFg(fgHex)
    } else {
      if (/^#[0-9a-fA-F]{6}$/.test(bgHex)) setBg(bgHex)
    }
  }, [fgHex, bgHex])

  const fgRgb = useMemo(() => hexToRgb(fg), [fg])
  const bgRgb = useMemo(() => hexToRgb(bg), [bg])

  const ratio = useMemo(() => contrastRatio(fgRgb, bgRgb), [fgRgb, bgRgb])

  const aa = ratio >= 4.5
  const aaL = ratio >= 3
  const aaa = ratio >= 7
  const aaaL = ratio >= 4.5

  const badgeClass = (pass, type) =>
    `inline-block px-3.5 py-1 rounded-full text-[13px] font-semibold m-1 border ${
      pass
        ? type === 'aaa'
          ? 'bg-green-500/15 text-green-400 border-green-500/30'
          : 'bg-green-500/10 text-green-300 border-green-500/20'
        : 'bg-red-500/10 text-red-400 border-red-500/20'
    }`

  return (
    <ToolLayout
      title="Color Contrast Checker"
      desc="WCAG contrast checker for accessible colors. Test foreground/background combinations."
      icon="👁️" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="color-contrast-checker"
    >
      <div className="max-w-[600px] mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Foreground (Text)</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={fg} onChange={e => { setFg(e.target.value); setFgHex(e.target.value) }} className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent" />
                <input className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/50" type="text" value={fgHex} onChange={e => setFgHex(e.target.value)} onBlur={() => sync('fg')} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Background</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={bg} onChange={e => { setBg(e.target.value); setBgHex(e.target.value) }} className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent" />
                <input className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/50" type="text" value={bgHex} onChange={e => setBgHex(e.target.value)} onBlur={() => sync('bg')} />
              </div>
            </div>
          </div>

          {/* Swatch previews */}
          <div className="flex gap-4 flex-wrap mb-4">
            <div className="flex-1 min-w-[120px] p-6 rounded-xl text-center font-semibold text-lg border-2 border-transparent" style={{ background: bg, color: fg }}>
              Sample Text
            </div>
            <div className="flex-1 min-w-[120px] p-6 rounded-xl text-center font-semibold text-lg border-2 border-transparent" style={{ background: fg, color: bg }}>
              Sample Text
            </div>
          </div>

          {/* Ratio */}
          <div className="text-center py-6 rounded-xl bg-white/[0.04]">
            <div className="text-5xl font-extrabold leading-none">{ratio.toFixed(2)}</div>
            <div className="text-sm text-slate-400 mt-1">Contrast Ratio</div>
            <div className="mt-3">
              <span className={badgeClass(aa, 'aa')}>AA Normal: {aa ? 'PASS ✓' : 'FAIL ✗'} (4.5:1)</span>
              <span className={badgeClass(aaL, 'aa')}>AA Large: {aaL ? 'PASS ✓' : 'FAIL ✗'} (3:1)</span>
              <span className={badgeClass(aaa, 'aaa')}>AAA Normal: {aaa ? 'PASS ✓' : 'FAIL ✗'} (7:1)</span>
              <span className={badgeClass(aaaL, 'aaa')}>AAA Large: {aaaL ? 'PASS ✓' : 'FAIL ✗'} (4.5:1)</span>
            </div>
          </div>
        </div>

        {/* WCAG Legend */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-2">WCAG Legend</h2>
          <div className="text-[13px] text-slate-400 leading-loose">
            <strong className="text-slate-300">AA (Normal text):</strong> ≥ 4.5:1<br/>
            <strong className="text-slate-300">AA (Large text):</strong> ≥ 3:1 (18px+ bold or 24px+ regular)<br/>
            <strong className="text-slate-300">AAA (Normal text):</strong> ≥ 7:1<br/>
            <strong className="text-slate-300">AAA (Large text):</strong> ≥ 4.5:1
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
