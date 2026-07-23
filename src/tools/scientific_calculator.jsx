import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'

function fact(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN
  if (n > 170) return Infinity
  let r = 1; for (let i = 2; i <= n; i++) r *= i; return r
}
function round15(n) { return isFinite(n) ? parseFloat(n.toPrecision(12)) : n }

export default function scientific_calculator() {
  const [expr, setExpr] = useState('')
  const [display, setDisplay] = useState('0')
  const [angleMode, setAngleMode] = useState('deg')
  const [inv, setInv] = useState(false)
  const [hyp, setHyp] = useState(false)
  const [history, setHistory] = useState([])
  const [justCalced, setJustCalced] = useState(false)

  const toRad = (x) => angleMode === 'deg' ? x * Math.PI / 180 : x

  const press = useCallback((val) => {
    setExpr(prev => {
      let e = prev
      if (justCalced && !['÷', '×', '+', '−'].includes(val)) e = ''
      if (val === 'AC') { setDisplay('0'); setJustCalced(false); return '' }
      if (val === '⌫') return e.slice(0, -1)
      if (val === '=') {
        try {
          let parsed = e
            .replace(/π/g, 'Math.PI').replace(/e\^/g, 'Math.exp(')
            .replace(/10\^\(/g, 'Math.pow(10,').replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-')
            .replace(/sin\(/g, angleMode === 'deg' ? 'Math.sin(Math.PI/180*' : 'Math.sin(')
            .replace(/cos\(/g, angleMode === 'deg' ? 'Math.cos(Math.PI/180*' : 'Math.cos(')
            .replace(/tan\(/g, angleMode === 'deg' ? 'Math.tan(Math.PI/180*' : 'Math.tan(')
            .replace(/ln\(/g, 'Math.log(').replace(/log\(/g, 'Math.log10(')
            .replace(/√\(/g, 'Math.sqrt(').replace(/∛\(/g, 'Math.cbrt(')
            .replace(/²\(/g, 'Math.pow(').replace(/³\(/g, 'Math.pow(')
            .replace(/(\d+\.?\d*)!/g, (_, n) => `${fact(parseInt(n))}`)
            .replace(/e(?!xp)/g, 'Math.E')
          const opens = (parsed.match(/\(/g) || []).length - (parsed.match(/\)/g) || []).length
          for (let i = 0; i < opens; i++) parsed += ')'
          const res = round15(Function('"use strict";return (' + parsed + ')')())
          setHistory(prev => [{ ex: e, val: String(res) }, ...prev].slice(0, 20))
          setDisplay(String(res))
          setJustCalced(true)
          return ''
        } catch { setDisplay('Error'); return '' }
      }
      if (val === '±') {
        try { const v = parseFloat(display); if (!isNaN(v)) { setDisplay(String(-v)); return e } } catch {}
        return e
      }
      if (val === '%') {
        try { const v = parseFloat(display); if (!isNaN(v)) setDisplay(String(v / 100)) } catch {}
        return e
      }
      return e + val
    })
  }, [justCalced, display, angleMode])

  const applyFn = useCallback((fn) => {
    const val = parseFloat(display)
    if (isNaN(val)) return
    let res
    try {
      switch (fn) {
        case 'sin': res = inv ? Math.asin(val) * (angleMode === 'deg' ? 180 / Math.PI : 1) : hyp ? Math.sinh(val) : Math.sin(toRad(val)); break
        case 'cos': res = inv ? Math.acos(val) * (angleMode === 'deg' ? 180 / Math.PI : 1) : hyp ? Math.cosh(val) : Math.cos(toRad(val)); break
        case 'tan': res = inv ? Math.atan(val) * (angleMode === 'deg' ? 180 / Math.PI : 1) : hyp ? Math.tanh(val) : Math.tan(toRad(val)); break
        case 'log': res = inv ? Math.pow(10, val) : Math.log10(val); break
        case 'ln': res = inv ? Math.exp(val) : Math.log(val); break
        case 'sqrt': res = inv ? val * val : Math.sqrt(val); break
        case 'cbrt': res = inv ? val * val * val : Math.cbrt(val); break
        case 'sq': res = val * val; break
        case 'cube': res = val * val * val; break
        case 'fact': res = fact(val); break
        case 'abs': res = Math.abs(val); break
        case '10x': res = Math.pow(10, val); break
        case 'ex': res = Math.exp(val); break
        case '1/x': res = 1 / val; break
        default: res = val
      }
      const r = round15(res)
      setHistory(prev => [{ ex: `${fn}(${val})`, val: String(r) }, ...prev].slice(0, 20))
      setDisplay(String(r))
      setExpr('')
      setJustCalced(true)
    } catch { setDisplay('Error') }
  }, [display, inv, hyp, angleMode])

  const buildGrid = useCallback(() => {
    const fnBtns = inv
      ? [
        ['sin⁻¹', () => applyFn('sin')], ['cos⁻¹', () => applyFn('cos')], ['tan⁻¹', () => applyFn('tan')],
        ['10ˣ', () => applyFn('10x')], ['eˣ', () => applyFn('ex')],
      ]
      : [
        ['sin', () => applyFn('sin')], ['cos', () => applyFn('cos')], ['tan', () => applyFn('tan')],
        ['log', () => applyFn('log')], ['ln', () => applyFn('ln')],
      ]

    return [
      fnBtns,
      [['x²', () => applyFn('sq')], ['x³', () => applyFn('cube')], ['√', () => applyFn('sqrt')], ['∛', () => applyFn('cbrt')], ['x!', () => applyFn('fact')]],
      [['π', () => setExpr(p => p + 'π')], ['e', () => setExpr(p => p + 'e')], ['|x|', () => applyFn('abs')], ['1/x', () => applyFn('1/x')], ['(', () => press('(')]],
      [['AC', () => press('AC')], ['⌫', () => press('⌫')], ['%', () => press('%')], [')', () => press(')')], ['÷', () => press('÷')]],
      [['7', () => press('7')], ['8', () => press('8')], ['9', () => press('9')], ['×', () => press('×')], ['xʸ', () => press('^')]],
      [['4', () => press('4')], ['5', () => press('5')], ['6', () => press('6')], ['−', () => press('−')], ['±', () => press('±')]],
      [['1', () => press('1')], ['2', () => press('2')], ['3', () => press('3')], ['+', () => press('+')], ['=', () => press('=')]],
      [['0', () => press('0'), 2], ['.', () => press('.')], ['EE', () => press('E')]],
    ]
  }, [inv, applyFn, press])

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      const map = { '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '.': '.', 'Enter': '=', '=': '=', 'Backspace': '⌫', 'Escape': 'AC', '+': '+', '-': '−', '*': '×', '/': '÷' }
      if (e.key in map) { e.preventDefault(); press(map[e.key]) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [press])

  const grid = buildGrid()
  const keyClass = (type) => {
    const base = 'rounded-xl text-sm font-bold transition-all active:scale-95 border-2 border-white/8'
    if (type === 'num') return `${base} bg-white/[0.08] text-white hover:bg-white/[0.12]`
    if (type === 'op') return `${base} bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 border-indigo-500/20`
    if (type === 'fn') return `${base} bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/15`
    if (type === 'eq') return `${base} bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:opacity-90 border-indigo-500/30`
    if (type === 'clear') return `${base} bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20`
    return `${base} bg-white/[0.06] text-slate-400 hover:text-white`
  }

  return (
    <ToolLayout
      title="Scientific Calculator"
      desc="Full-featured scientific calculator with trig functions, logarithms, factorial, history, and keyboard support."
      icon="🧮" iconBg="rgba(245,158,11,0.08)"
      category="tools" slug="scientific-calculator"
      faq={[
        { q: 'Does it support degrees and radians?', a: 'Yes, toggle between DEG and RAD mode using the buttons at the top.' },
        { q: 'Can I use keyboard input?', a: 'Yes! Numbers, operators, Enter for equals, Backspace for delete, Escape for clear.' },
      ]}
      howItWorks={[
        'Use the on-screen buttons or your keyboard to input expressions.',
        'Toggle DEG/RAD, INV, and HYP modes for scientific functions.',
        'View calculation history in the panel below.',
        'Press AC to clear, ⌫ to backspace.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Scientific Calculator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/scientific-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-sm mx-auto space-y-3">
        {/* Mode Toggles */}
        <div className="flex gap-2">
          <div className="flex bg-white/[0.06] border border-white/8 rounded-xl overflow-hidden">
            {['deg', 'rad'].map(m => (
              <button key={m} onClick={() => setAngleMode(m)}
                className={`px-4 py-2 text-xs font-bold uppercase transition-all ${angleMode === m ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-white'}`}>
                {m}
              </button>
            ))}
          </div>
          <button onClick={() => setInv(v => !v)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 ${inv ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-white/[0.06] text-slate-500 border-white/8'}`}>INV</button>
          <button onClick={() => setHyp(v => !v)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 ${hyp ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-white/[0.06] text-slate-500 border-white/8'}`}>HYP</button>
        </div>

        {/* Display */}
        <div className="bg-black/30 border-2 border-white/8 rounded-2xl p-4">
          <div className="text-xs text-slate-500 font-mono h-5 text-right truncate">{expr}</div>
          <div className="text-3xl font-mono font-bold text-white text-right truncate mt-1">{display}</div>
        </div>

        {/* Button Grid */}
        <div className="space-y-1.5">
          {grid.map((row, ri) => (
            <div key={ri} className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(5, 1fr)` }}>
              {row.map(([label, fn, span], bi) => {
                const type = ri === 0 ? 'fn' : ri === 1 ? 'fn' : ri === 2 ? 'fn' :
                  label === 'AC' ? 'clear' : ['÷', '×', '−', '+', '%', '⌫', '(', ')', '±', 'EE', 'xʸ'].includes(label) ? 'op' :
                  label === '=' ? 'eq' : 'num'
                return (
                  <button key={bi} onClick={fn}
                    className={`${keyClass(type)} ${span === 2 ? 'col-span-2' : ''} h-12`}>
                    {label}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="bg-white/[0.06] border border-white/8 rounded-2xl p-3 max-h-48 overflow-y-auto">
            <div className="text-xs font-bold text-slate-500 mb-2">📜 History</div>
            {history.map((h, i) => (
              <div key={i} onClick={() => { setDisplay(h.val); setJustCalced(true) }}
                className="flex justify-between items-center py-1.5 px-2 rounded-lg hover:bg-white/[0.04] cursor-pointer text-xs">
                <span className="text-slate-500 font-mono truncate mr-2">{h.ex}</span>
                <span className="text-white font-mono font-bold">= {h.val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
