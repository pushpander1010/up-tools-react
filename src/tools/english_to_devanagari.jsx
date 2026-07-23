import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

function transliterate(text) {
  text = text.toLowerCase()
  const CONS = [
    ['shri', '\u0936\u094D\u0930\u0940'], ['ksh', '\u0915\u094D\u0937'], ['gya', '\u091C\u094D\u091E'], ['jnya', '\u091C\u094D\u091E'],
    ['chh', '\u091B'], ['kh', '\u0916'], ['gh', '\u0918'], ['ch', '\u091A'], ['jh', '\u091D'],
    ['th', '\u0925'], ['dh', '\u0927'], ['ph', '\u092B'], ['bh', '\u092D'], ['sh', '\u0936'],
    ['ny', '\u091E'], ['ng', '\u0919'], ['tr', '\u0924\u094D\u0930'], ['pr', '\u092A\u094D\u0930'],
    ['k', '\u0915'], ['g', '\u0917'], ['c', '\u091A'], ['j', '\u091C'], ['t', '\u0924'], ['d', '\u0926'],
    ['n', '\u0928'], ['p', '\u092A'], ['b', '\u092C'], ['m', '\u092E'], ['y', '\u092F'], ['r', '\u0930'],
    ['l', '\u0932'], ['v', '\u0935'], ['w', '\u0935'], ['f', '\u092B'], ['s', '\u0938'], ['h', '\u0939'],
    ['z', '\u091C\u093C'], ['q', '\u0915'], ['x', '\u0915\u094D\u0938'],
  ]
  const VOWS = [
    ['aa', '\u0906', '\u093E'], ['ai', '\u0910', '\u0948'], ['ae', '\u0910', '\u0948'],
    ['au', '\u0914', '\u094C'], ['ou', '\u0914', '\u094C'], ['ow', '\u0914', '\u094C'],
    ['ee', '\u0908', '\u0940'], ['ii', '\u0908', '\u0940'], ['oo', '\u090A', '\u0942'], ['uu', '\u090A', '\u0942'],
    ['ri', '\u090B', '\u0943'], ['oa', '\u0913', '\u094B'],
    ['a', '\u0905', ''], ['e', '\u090F', '\u0947'], ['i', '\u0907', '\u093F'], ['u', '\u0909', '\u0941'], ['o', '\u0913', '\u094B'],
  ]
  const VIRAMA = '\u094D'
  let result = ''
  let i = 0
  let afterCons = false
  while (i < text.length) {
    const ch = text[i]
    if (!/[a-z]/.test(ch)) { afterCons = false; result += ch; i++; continue }
    let best = null, bestLen = 0, bestType = null
    for (const [rom, dev] of CONS) {
      if (text.startsWith(rom, i) && rom.length > bestLen) { best = dev; bestLen = rom.length; bestType = 'C' }
    }
    for (const [rom, sa, ma] of VOWS) {
      if (text.startsWith(rom, i) && rom.length > bestLen) { best = [sa, ma]; bestLen = rom.length; bestType = 'V' }
    }
    if (bestType === 'C') { if (afterCons) result += VIRAMA; result += best; i += bestLen; afterCons = true }
    else if (bestType === 'V') { const [sa, ma] = best; result += afterCons ? ma : sa; i += bestLen; afterCons = false }
    else { result += ch; i++; afterCons = false }
  }
  return result
}

const EXAMPLES = [
  { en: 'namaste', dev: 'नमस्ते' },
  { en: 'jai hind', dev: 'जय हिन्द' },
  { en: 'shubh prabhat', dev: 'शुभ प्रभात' },
  { en: 'bharat mata ki jai', dev: 'भरत माता की जय' },
  { en: 'aap kaise hain', dev: 'आप कैसे हैं' },
  { en: 'pranaam', dev: 'प्रणाम' },
]

export default function english_to_devanagari() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const handleInput = useCallback((val) => {
    setInput(val)
    setOutput(transliterate(val))
  }, [])

  const handleChip = useCallback((text) => {
    setInput(text)
    setOutput(transliterate(text))
  }, [])

  const clearAll = useCallback(() => { setInput(''); setOutput('') }, [])

  const handleCopy = useCallback(async () => {
    if (!output) return
    try { await navigator.clipboard.writeText(output) } catch { /* fallback */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [output])

  const inChars = input.length
  const inWords = input.trim() ? input.trim().split(/\s+/).length : 0
  const outChars = output.length
  const outWords = output.trim() ? output.trim().split(/\s+/).length : 0

  return (
    <ToolLayout
      title="English → Devanagari Converter"
      desc="Convert English (Roman) text to Devanagari (Hindi) script instantly. Free online phonetic transliterator."
      icon="🔤" iconBg="rgba(234,179,8,0.08)"
      category="converter" slug="english-to-devanagari"
      faq={[
        { q: 'Is English To Devanagari free?', a: "Yes, it's completely free with no sign-ups required." },
        { q: 'Is English To Devanagari private?', a: 'Yes. All calculations run in your browser. No data is uploaded.' },
        { q: 'Does English To Devanagari work on mobile?', a: 'Yes. All tools are mobile-responsive and work on any device.' },
      ]}
      howItWorks={[
        'Type phonetic English (Roman script) in the input panel.',
        'Get Devanagari (Hindi) script instantly in the output panel.',
        'Copy or share the transliterated text.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "English to Devanagari Converter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/english-to-devanagari/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Example Chips */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-4">
          <h3 className="text-xs font-bold text-white mb-3">✦ Try an example</h3>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button key={ex.en} onClick={() => handleChip(ex.en)}
                className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/8 text-xs hover:border-amber-500/30 hover:bg-amber-500/[0.06] transition-all">
                <span className="text-slate-400">{ex.en}</span>
                <span className="text-amber-400 ml-1.5">{ex.dev}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">Input</span>
              <span className="text-xs text-slate-500">English / Roman</span>
            </div>
            <textarea value={input} onChange={e => handleInput(e.target.value)}
              placeholder="Type phonetic English here…&#10;e.g. namaste, jai hind, aap kaise hain"
              rows={6} spellCheck={false} autoComplete="off"
              className="w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/40 transition-all resize-none placeholder:text-slate-600 [color-scheme:dark]" />
            <div className="flex justify-between mt-2 text-xs text-slate-600">
              <span>Chars: <b className="text-slate-400">{inChars}</b></span>
              <span>Words: <b className="text-slate-400">{inWords}</b></span>
            </div>
          </div>
          <div className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.04] via-white/[0.01] to-transparent p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">Output</span>
              <span className="text-xs text-indigo-400">देवनागरी</span>
            </div>
            <textarea value={output} readOnly rows={6}
              placeholder="देवनागरी यहाँ दिखेगी…"
              className="w-full bg-transparent border border-white/8 rounded-xl px-4 py-3 text-white text-sm outline-none resize-none placeholder:text-slate-600" />
            <div className="flex justify-between mt-2 text-xs text-slate-600">
              <span>Chars: <b className="text-slate-400">{outChars}</b></span>
              <span>Words: <b className="text-slate-400">{outWords}</b></span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={clearAll}
            className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/8 text-white text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
            Clear All
          </button>
          <button onClick={handleCopy}
            className="flex-1 py-3 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-400 transition-all flex items-center justify-center gap-2">
            {copied ? '✓ Copied!' : '📋 Copy Output'}
          </button>
        </div>
      </div>
    </ToolLayout>
  )
}
