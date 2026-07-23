import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const DISPOSABLE_CHECK = null // not used here

export default function binary_code_translator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('text') // 'text' or 'binary'
  const [activeTab, setActiveTab] = useState('binary')
  const [copied, setCopied] = useState(false)

  const results = useMemo(() => {
    if (mode === 'text') {
      if (!input) return null
      const chars = [...input]
      const mapped = chars.map(ch => {
        const code = ch.charCodeAt(0)
        return {
          char: ch === ' ' ? '␣' : ch,
          code,
          binary: code.toString(2).padStart(8, '0'),
          hex: code.toString(16).toUpperCase().padStart(2, '0'),
          decimal: code.toString(10),
        }
      })
      return mapped
    } else {
      // binary → text: split on spaces, newlines, or groups of 8
      if (!input.trim()) return null
      const cleaned = input.replace(/[^01\s]/g, '').trim()
      const groups = cleaned.split(/\s+/).filter(Boolean)
      if (groups.length === 0) return null
      return groups.map(b => {
        const code = parseInt(b, 2)
        return {
          char: isNaN(code) ? '?' : String.fromCharCode(code),
          code: isNaN(code) ? 0 : code,
          binary: b,
          hex: isNaN(code) ? '??' : code.toString(16).toUpperCase().padStart(2, '0'),
          decimal: isNaN(code) ? '?' : code.toString(10),
        }
      })
    }
  }, [input, mode])

  const formattedOutput = useMemo(() => {
    if (!results) return ''
    if (activeTab === 'binary') return results.map(r => r.binary).join(' ')
    if (activeTab === 'hex') return results.map(r => r.hex).join(' ')
    return results.map(r => r.decimal).join(' ')
  }, [results, activeTab])

  const handleConvert = useCallback(() => {
    jumpTo()
  }, [jumpTo])

  const handleCopy = useCallback(() => {
    if (!formattedOutput) return
    navigator.clipboard.writeText(formattedOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [formattedOutput])

  const handleSwap = useCallback(() => {
    setMode(m => m === 'text' ? 'binary' : 'text')
    setInput('')
  }, [])

  return (
    <ToolLayout
      title="Binary Code Translator"
      desc="Convert text to binary, hexadecimal, and decimal codes. Also reverse binary back to readable text."
      icon="💻" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="binary-code-translator"
      faq={[
        { q: 'What is binary code?', a: 'Binary is a base-2 number system using only 0s and 1s. Computers use binary to represent all data — every character, number, and image is ultimately stored as binary digits (bits).' },
        { q: 'What is ASCII encoding?', a: 'ASCII (American Standard Code for Information Interchange) maps characters to numbers 0–127. For example, the letter "A" is decimal 65, binary 01000001, and hex 41.' },
        { q: 'What is hexadecimal?', a: 'Hexadecimal is a base-16 number system using digits 0–9 and letters A–F. It is commonly used in computing because it represents bytes more compactly than binary (2 hex digits = 1 byte).' },
      ]}
      howItWorks={[
        'Choose a mode: Text to Binary or Binary to Text.',
        'Enter your text or binary string in the input area.',
        'View the results in Binary, Hex, or Decimal tabs.',
        'Click the Copy button to copy the formatted output.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Binary Code Translator", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/binary-code-translator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Mode toggle */}
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-2 block">Mode</label>
          <div className="flex gap-2">
            {[['text', 'Text → Binary'], ['binary', 'Binary → Text']].map(([val, label]) => (
              <button key={val} onClick={() => { handleSwap(); if (val !== mode) setInput('') }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${mode === val
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                  : 'bg-white/[0.06] text-slate-500 border border-white/8'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-2 block">
            {mode === 'text' ? 'Enter text' : 'Enter binary (space-separated 8-bit groups)'}
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={4}
            placeholder={mode === 'text' ? 'Hello World!' : '01001000 01100101 01101100 01101100 01101111'}
            className="w-full bg-white/[0.06] border border-white/8 rounded-2xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none"
          />
        </div>

        {/* Convert button */}
        <button onClick={handleConvert}
          className="glow-btn w-full py-3 rounded-xl text-sm">
          {mode === 'text' ? '🔢 Convert to Binary' : '📝 Convert to Text'}
        </button>

        {/* Results */}
        {results && results.length > 0 && (
          <div ref={resultRef} className="space-y-4"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>

            {/* Tabs */}
            <div className="flex gap-2">
              {[['binary', 'Binary'], ['hex', 'Hex'], ['decimal', 'Decimal']].map(([val, label]) => (
                <button key={val} onClick={() => setActiveTab(val)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === val
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                    : 'bg-white/[0.06] text-slate-500 border border-white/8'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Formatted output */}
            <div className="relative">
              <pre className="bg-white/[0.06] border border-white/8 rounded-2xl px-4 py-4 text-sm text-white font-mono whitespace-pre-wrap break-all min-h-[80px]">
                {formattedOutput}
              </pre>
              <button onClick={handleCopy}
                className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${copied
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>

            {/* Character table */}
            {mode === 'text' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 text-left">
                      <th className="pb-2 pr-4 font-semibold">Char</th>
                      <th className="pb-2 pr-4 font-semibold">Decimal</th>
                      <th className="pb-2 pr-4 font-semibold">Binary</th>
                      <th className="pb-2 font-semibold">Hex</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i} className="border-t border-white/5">
                        <td className="py-1.5 pr-4 text-white font-mono">{r.char}</td>
                        <td className="py-1.5 pr-4 text-slate-300 font-mono">{r.decimal}</td>
                        <td className="py-1.5 pr-4 text-indigo-300 font-mono">{r.binary}</td>
                        <td className="py-1.5 text-amber-300 font-mono">{r.hex}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
