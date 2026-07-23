import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const PHONETIC = {
  'A': 'Alfa', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo',
  'F': 'Foxtrot', 'G': 'Golf', 'H': 'Hotel', 'I': 'India', 'J': 'Juliett',
  'K': 'Kilo', 'L': 'Lima', 'M': 'Mike', 'N': 'November', 'O': 'Oscar',
  'P': 'Papa', 'Q': 'Quebec', 'R': 'Romeo', 'S': 'Sierra', 'T': 'Tango',
  'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray', 'Y': 'Yankee',
  'Z': 'Zulu', '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three',
  '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Niner'
}

export default function phonetic_alphabet_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  const convert = useCallback(() => {
    const text = input.toUpperCase()
    if (!text.trim()) return
    let output = ''
    for (const char of text) {
      if (char === ' ') output += ' / '
      else if (PHONETIC[char]) output += PHONETIC[char] + ' '
    }
    setResult(output.trim())
    jumpTo()
  }, [input, jumpTo])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) convert()
  }, [convert])

  const copyToClipboard = useCallback(async () => {
    try { await navigator.clipboard.writeText(result) } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [result])

  return (
    <ToolLayout
      title="Phonetic Alphabet Converter"
      desc="Convert text to NATO phonetic alphabet. Perfect for clear communication over phone or radio."
      icon="🔤" iconBg="rgba(99,102,241,0.08)"
      category="utility" slug="phonetic-alphabet-converter"
      faq={[
        { q: 'What is the NATO phonetic alphabet?', a: 'It\'s a standardized set of words used to spell out letters clearly over radio or phone, e.g., "Alpha" for A, "Bravo" for B.' },
        { q: 'Does it support numbers?', a: 'Yes! Numbers 0-9 are converted too (e.g., 0 → Zero, 9 → Niner).' },
        { q: 'Is this tool free?', a: 'Yes, completely free with no sign-up required.' }
      ]}
      howItWorks={[
        'Type any text into the input field.',
        'Click "Convert to Phonetic" or press Ctrl+Enter.',
        'Copy the NATO phonetic spelling from the result.'
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Phonetic Alphabet Converter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/phonetic-alphabet-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type text to convert to phonetic alphabet..."
          className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 resize-none min-h-[100px]"
        />

        <button onClick={convert}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          🔤 Convert to Phonetic
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">NATO Phonetic</h3>
              </div>
              <button onClick={copyToClipboard}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'
                }`}>
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
            <div className="bg-black/20 rounded-xl p-4 font-mono text-sm text-indigo-300 break-words leading-relaxed">
              {result}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔤</div>
            <p className="text-sm text-slate-600 font-medium">Type text and click Convert</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
