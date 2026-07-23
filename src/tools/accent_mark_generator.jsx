import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const ACCENT_GROUPS = {
  'Accents (Latin)': ['á','â','ä','à','ã','å','ā','ă','ą','è','ê','ë','é','ē','ė','ę','ì','î','ï','í','ī','į','ó','ô','ö','ò','õ','ø','ō','ú','û','ü','ù','ū','ý','ÿ','ñ','ç','ß','ś','ş','ź','ż','ž','ľ','ť','ď','ň','ř','đ'],
  'Diacritics (Combining)': ['\u0301','\u0300','\u0302','\u0308','\u0303','\u0304','\u0306','\u0307','\u030A','\u030B','\u030C','\u0312','\u0313','\u0314','\u0315','\u0316','\u0317','\u0318','\u0319','\u031A'],
  'Mathematical': ['±','×','÷','≠','≈','≤','≥','∞','∑','∏','√','∫','∂','∆','∇','∈','∉','⊂','⊃','∪','∩'],
  'Currency': ['€','£','¥','₹','₽','₩','₪','₫','₡','₦','₮','₲','₱','₴','₸'],
  'Arrows': ['←','→','↑','↓','↔','↕','⇐','⇑','⇓','⇑','⇑','⇑','⇑','⇐','⇑','⇓','⇑'],
  'Special': ['©','®','™','°','¶','§','†','‡','•','…','‰','‱','※','★','☆','♠','♣','♥','♦','♫'],
}

export default function accent_mark_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  const addAccent = useCallback((accent) => {
    const ta = document.getElementById('accent-textarea')
    if (!ta) { setText(prev => prev + accent); return }
    const start = ta.selectionStart
    const end = ta.selectionEnd
    if (start === end) {
      setText(prev => prev + accent)
    } else {
      setText(prev => prev.substring(0, start) + accent + prev.substring(end))
    }
    ta.focus()
  }, [])

  const copyResult = useCallback(async () => {
    try { await navigator.clipboard.writeText(text) } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])

  return (
    <ToolLayout
      title="Accent Mark Generator"
      desc="Type special characters, accent marks, diacritics, and symbols. Click to insert at cursor position."
      icon="🔤" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="accent-mark-generator"
      faq={[
        { q: 'What are accent marks?', a: 'Accent marks are diacritical marks placed above or below letters to indicate different pronunciations or meanings.' },
        { q: 'How do I use combining diacritics?', a: 'Combining diacritics are applied to the preceding character. Select a letter in the text area, then click a combining mark.' },
      ]}
      howItWorks={[
        'Browse the character groups below.',
        'Click any character to add it to the text area.',
        'Select text first to replace it with the clicked character.',
        'Copy the result when done.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Accent Mark Generator", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/accent-mark-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Text Area</label>
          <textarea id="accent-textarea" value={text} onChange={e => setText(e.target.value)}
            placeholder="Type or click characters below to insert..."
            rows={4}
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none" />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-600">{text.length} characters</span>
            <button onClick={copyResult}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white'}`}>
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>

        {Object.entries(ACCENT_GROUPS).map(([group, chars]) => (
          <div key={group} className="p-4 bg-white/[0.06] border border-white/[0.08] rounded-2xl">
            <h3 className="text-xs font-semibold text-slate-400 mb-3">{group}</h3>
            <div className="flex flex-wrap gap-1.5">
              {chars.map((ch, i) => (
                <button key={i} onClick={() => addAccent(ch)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-base bg-black/20 border border-white/[0.06] hover:bg-indigo-500/15 hover:border-indigo-500/30 transition-all cursor-pointer"
                  title={ch}>
                  {ch}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  )
}
