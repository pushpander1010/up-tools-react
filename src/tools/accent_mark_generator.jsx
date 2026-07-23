import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
const QUICK_ACCENTS = [
  ['á', 'a (acute)'], ['à', 'a (grave)'], ['â', 'a (circumflex)'], ['ä', 'a (diaeresis)'],
  ['ã', 'a (tilde)'], ['å', 'a (ring)'], ['ç', 'c (cedilla)'],
  ['é', 'e (acute)'], ['è', 'e (grave)'], ['ê', 'e (circumflex)'], ['ë', 'e (diaeresis)'],
  ['ñ', 'n (tilde)'], ['ó', 'o (acute)'], ['ò', 'o (grave)'], ['ô', 'o (circumflex)'],
  ['ö', 'o (diaeresis)'], ['õ', 'o (tilde)'], ['ü', 'u (diaeresis)'], ['ú', 'u (acute)'],
  ['ù', 'u (grave)'], ['û', 'u (circumflex)'], ['ý', 'y (acute)'], ['ÿ', 'y (diaeresis)'],
  ['ñ', 'n (tilde)'], ['ß', 'ss (eszett)'], ['ø', 'o (stroke)'], ['æ', 'ae (ash)'],
]

export default function accent_mark_generator() {
  const textareaRef = useRef(null)
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  const addAccent = useCallback((accent) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const newText = text.substring(0, start) + accent + text.substring(end)
    setText(newText)
    setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 1; ta.focus() }, 0)
  }, [text])

  const copyResult = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])

  return (
    <ToolLayout
      title="Accent Mark Generator"
      desc="Add accent marks and diacritics to text. Quick buttons for common characters. Copy accented text instantly."
      icon="🎨" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="accent-mark-generator"
      faq={[
        { q: 'How do I add an accent?', a: 'Click any accent button below the text area to append it, or select text first to replace it with the accented version.' },
        { q: 'Which languages does this support?', a: 'It supports any language that uses Latin characters with diacritics — French, Spanish, German, Portuguese, Turkish, Vietnamese, and many more.' },
      ]}
      howItWorks={[
        'Type your text in the text area.',
        'Click any accent button to add it at the cursor position.',
        'Copy the result to clipboard when ready.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Accent Mark Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/accent-mark-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Enter text</label>
          <textarea ref={textareaRef} value={text} onChange={e => setText(e.target.value)}
            placeholder="Type text to add accents..."
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none h-32" />
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-400 mb-2">Quick Accents</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {QUICK_ACCENTS.map(([char, label]) => (
              <button key={char + label} onClick={() => addAccent(char)}
                className="p-3 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:border-indigo-500/30 hover:bg-indigo-500/[0.08] transition-all text-center group">
                <div className="text-xl text-white group-hover:text-indigo-400">{char}</div>
                <div className="text-[9px] text-slate-600 mt-0.5">{label}</div>
              </button>
            ))}
          </div>
        </div>

        {text && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
              <h3 className="text-xs font-semibold text-slate-400 mb-2">Result</h3>
              <div className="text-sm text-white whitespace-pre-wrap">{text}</div>
            </div>
            <button onClick={copyResult}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white'}`}>
              {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
