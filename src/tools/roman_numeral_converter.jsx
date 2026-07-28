import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

const ROMAN_VALS = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
const ROMAN_SYMS = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']

function toRoman(num) {
  if (num < 1 || num > 3999 || !Number.isInteger(num)) return ''
  let result = ''
  for (let i = 0; i < ROMAN_VALS.length; i++) {
    while (num >= ROMAN_VALS[i]) {
      result += ROMAN_SYMS[i]
      num -= ROMAN_VALS[i]
    }
  }
  return result
}

function fromRoman(str) {
  str = str.trim().toUpperCase()
  if (!str) return null
  const map = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }
  let result = 0, i = 0
  while (i < str.length) {
    const two = str[i] + (str[i + 1] || '')
    if (map[two]) { result += map[two]; i += 2 }
    else if (map[str[i]]) { result += map[str[i]]; i++ }
    else { return null }
  }
  return (result >= 1 && result <= 3999) ? result : null
}

export default function RomanNumeralConverter() {
  const [numValue, setNumValue] = useState('')
  const [romanValue, setRomanValue] = useState('')
  const [numOutput, setNumOutput] = useState('')
  const [romanOutput, setRomanOutput] = useState('')
  const [numError, setNumError] = useState('')
  const [romanError, setRomanError] = useState('')
  const [copied, setCopied] = useState('')

  const handleNumInput = useCallback((val) => {
    setNumValue(val)
    setNumError('')
    setRomanError('')
    if (!val.trim()) {
      setNumOutput('')
      setRomanValue('')
      setRomanOutput('')
      return
    }
    const v = parseInt(val)
    if (isNaN(v) || v < 1 || v > 3999) {
      setNumOutput('⚠️ Enter 1–3999')
      setRomanValue('')
      setRomanOutput('')
      return
    }
    const r = toRoman(v)
    setNumOutput(r)
    setRomanValue(r)
    setRomanOutput(v.toLocaleString())
  }, [])

  const handleRomanInput = useCallback((val) => {
    setRomanValue(val)
    setNumError('')
    setRomanError('')
    if (!val.trim()) {
      setRomanOutput('')
      setNumValue('')
      setNumOutput('')
      return
    }
    const n = fromRoman(val)
    if (n === null) {
      setRomanOutput('⚠️ Invalid Roman numeral')
      setNumValue('')
      setNumOutput('')
      return
    }
    setRomanOutput(n.toLocaleString())
    setNumValue(String(n))
    setNumOutput(toRoman(n))
  }, [])

  const handleCopy = (text, label) => {
    if (!text) return
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(''), 1500)
    })
  }

  const handleClear = () => {
    setNumValue('')
    setRomanValue('')
    setNumOutput('')
    setRomanOutput('')
    setNumError('')
    setRomanError('')
  }

  const referenceTable = [
    ['I = 1', 'X = 10', 'C = 100', 'M = 1000'],
    ['V = 5', 'L = 50', 'D = 500', 'MMMCMXCIX = 3999'],
    ['IV = 4', 'XL = 40', 'CD = 400', 'MMXXVI = 2026'],
    ['IX = 9', 'XC = 90', 'CM = 900', ''],
  ]

  return (
    <ToolLayout
      title="Roman Numeral Converter"
      desc="Convert numbers (1–3999) to Roman numerals and Roman numerals back to numbers. Instant live conversion."
      icon="🏛️" iconBg="rgba(99,102,241,0.08)"
      category="tools" slug="roman-numeral-converter"
      faq={[
        { q: 'What is Roman Numeral Converter?', a: 'A tool that converts numbers between 1 and 3999 to Roman numerals and vice versa. It works bidirectionally — type a number to get the Roman numeral, or type a Roman numeral to get the number.' },
        { q: 'How to use it?', a: 'Enter a number (1–3999) in the left field or a Roman numeral (e.g. XIV) in the right field. The conversion happens instantly in both directions.' },
      ]}
      howItWorks={[
        'Enter a number (1–3999) to convert to Roman numerals, or',
        'Enter a Roman numeral (e.g. XIV, MMXXVI) to convert to a number.',
        'Both fields update automatically in real time.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Roman Numeral Converter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/roman-numeral-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Converter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          {/* Number Input */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Number (1–3999)</label>
            <div className="flex gap-2">
              <input type="number" value={numValue} onChange={e => handleNumInput(e.target.value)}
                placeholder="Enter number…"
                min="1" max="3999"
                className="flex-1 bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white text-sm font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]" />
              <button onClick={() => handleCopy(numOutput, 'num')}
                className="px-3 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-slate-300 transition-all text-sm"
                title="Copy Roman numeral">
                {copied === 'num' ? '✅' : '📋'}
              </button>
            </div>
            <div className={`mt-3 min-h-[48px] p-3 rounded-xl bg-black/20 border border-white/[0.05] font-mono text-lg font-semibold ${numError ? 'text-red-400' : 'text-indigo-400'}`}>
              {numOutput || <span className="text-slate-600 text-base">Roman numeral</span>}
            </div>
          </div>

          {/* Bidirectional Arrow */}
          <div className="hidden sm:flex text-center items-end pb-8 text-2xl text-indigo-400 font-bold">⇄</div>

          {/* Roman Numeral Input */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Roman Numeral</label>
            <div className="flex gap-2">
              <input type="text" value={romanValue} onChange={e => handleRomanInput(e.target.value)}
                placeholder="Enter Roman numeral…"
                className="flex-1 bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white text-sm font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark] uppercase" />
              <button onClick={() => handleCopy(numValue, 'roman')}
                className="px-3 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-slate-300 transition-all text-sm"
                title="Copy number">
                {copied === 'roman' ? '✅' : '📋'}
              </button>
            </div>
            <div className={`mt-3 min-h-[48px] p-3 rounded-xl bg-black/20 border border-white/[0.05] font-mono text-lg font-semibold ${romanError ? 'text-red-400' : 'text-emerald-400'}`}>
              {romanOutput || <span className="text-slate-600 text-base">Number</span>}
            </div>
          </div>
        </div>

        {/* Clear Button */}
        <div className="flex justify-center">
          <button onClick={handleClear}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-slate-300 transition-all">
            🗑️ Clear
          </button>
        </div>

        {/* Quick Reference Table */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">📖 Quick Reference</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {referenceTable.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-1.5 text-sm text-slate-300 font-mono">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
