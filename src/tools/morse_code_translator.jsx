import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const MORSE = {
  'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',
  '.':'.-.-.-',',':'--..--','?':'..--..',"'":'.----.','!':'-.-.--','/':'-..-.','(':'-.--.',')':'-.--.-','&':'.-...',':':'---...',';':'-.-.-.','=':'-...-','+':'.-.-.','_':'..--.-','"':'.-..-.','$':'...-..-','@':'.--.-.'
}

const REVERSE = Object.fromEntries(Object.entries(MORSE).map(([k,v]) => [v, k]))

export default function morse_code_translator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [text, setText] = useState('')
  const [morse, setMorse] = useState('')
  const [visual, setVisual] = useState('')

  const toMorse = useCallback(() => {
    if (!text.trim()) return
    const upper = text.toUpperCase()
    let result = ''
    for (const ch of upper) {
      if (ch === ' ') result += ' / '
      else if (MORSE[ch]) result += MORSE[ch] + ' '
    }
    result = result.trim()
    setMorse(result)
    setVisual(result.replace(/\./g, '•').replace(/-/g, '—'))
    jumpTo()
  }, [text, jumpTo])

  const toText = useCallback(() => {
    if (!morse.trim()) return
    const words = morse.split(' / ')
    const decoded = words.map(w =>
      w.split(' ').map(code => REVERSE[code] || '?').join('')
    ).join(' ')
    setText(decoded)
    setMorse('')
    setVisual('')
    jumpTo()
  }, [morse, jumpTo])

  const copyMorse = useCallback(async () => {
    if (!morse) return
    try { await navigator.clipboard.writeText(morse) } catch {
      const ta = document.createElement('textarea'); ta.value = morse
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
    }
  }, [morse])

  return (
    <ToolLayout
      title="Morse Code Translator"
      desc="Convert text to Morse code and back. Copy or share results instantly."
      icon="📡" iconBg="rgba(6,182,212,0.08)"
      category="dev" slug="morse-code-translator"
      faq={[
        { q: 'What is Morse Code?', a: 'Morse Code is a method of encoding text characters as standardized sequences of dots and dashes, widely used in early telecommunication.' },
        { q: 'Can I decode Morse back to text?', a: 'Yes! Paste Morse code in the output area and click the Decode button to convert back to text.' },
      ]}
      howItWorks={[
        'Type or paste text into the input field.',
        'Click "Encode" to convert to Morse code.',
        'Copy the result or decode it back to text.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Morse Code Translator", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/morse-code-translator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Text Input</label>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Type your message here..."
            rows={4}
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600 resize-none" />
        </div>

        <div className="flex gap-3">
          <button onClick={toMorse}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            🔤 → ·− Encode
          </button>
          <button onClick={toText}
            className="flex-1 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
            ·− → 🔤 Decode
          </button>
        </div>

        {morse && (
          <div ref={resultRef} className="rounded-3xl border-2 border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.06] via-white/[0.01] to-transparent p-6"
            style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Morse Code</h3>
              </div>
              <button onClick={copyMorse}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                📋 Copy
              </button>
            </div>
            <div className="text-lg font-mono text-white/90 leading-relaxed tracking-wider">{morse}</div>
            <div className="text-sm font-mono text-cyan-400/60 mt-3 tracking-widest">{visual}</div>
          </div>
        )}

        {!morse && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.02]">
            <div className="text-4xl mb-3 opacity-20">📡</div>
            <p className="text-sm text-slate-600 font-medium">Enter text and click Encode to see Morse code</p>
          </div>
        )}

        {/* Reference */}
        <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
          <h3 className="text-sm font-bold text-slate-300 mb-3">Quick Reference</h3>
          <div className="grid grid-cols-6 gap-2 text-xs font-mono">
            {['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3'].map(ch => (
              <div key={ch} className="text-center py-1 rounded bg-white/[0.04]">
                <span className="text-slate-300">{ch}</span>
                <span className="text-cyan-400/60 ml-1">{MORSE[ch]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
