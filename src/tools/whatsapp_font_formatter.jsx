import { useState, useMemo, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const FONT_STYLES = [
  { label: 'Bold', prefix: '*', suffix: '*', preview: (t) => `*${t}*` },
  { label: 'Italic', prefix: '_', suffix: '_', preview: (t) => `_${t}_` },
  { label: 'Strikethrough', prefix: '~', suffix: '~', preview: (t) => `~${t}~` },
  { label: 'Monospace', prefix: '```', suffix: '```', preview: (t) => '```' + t + '```' },
  { label: 'Bold+Italic', prefix: '*_', suffix: '_*', preview: (t) => `*_${t}_*` },
  { label: 'Bold+Strike', prefix: '*~', suffix: '~*', preview: (t) => `*~${t}~*` },
]

const UNICODE_MAP = {
  'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
  'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
}

const DOUBLE_MAP = {
  'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
  'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
}

const SCRIPT_MAP = {
  'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': '𝑒', 'f': '𝒻', 'g': '𝑔', 'h': '𝒽', 'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': '𝑜', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍', 'y': '𝓎', 'z': '𝓏',
  'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': '𝐸', 'F': '𝐹', 'G': '𝒢', 'H': '𝐻', 'I': '𝐼', 'J': '𝒥', 'K': '𝒦', 'L': '𝐿', 'M': '𝑀', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': '𝑅', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝑋', 'Y': '𝑌', 'Z': '𝒵',
}

const GOTHIC_MAP = {
  'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥', 'i': '𝔦', 'j': '𝔧', 'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭', 'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱', 'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵', 'y': '𝔶', 'z': '𝔷',
  'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ', 'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖', 'T': '𝔗', 'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ',
}

function toUnicode(text, map) {
  return text.split('').map(c => map[c] || c).join('')
}

const UNICODE_STYLES = [
  { label: 'Bold (Serif)', fn: (t) => toUnicode(t, DOUBLE_MAP) },
  { label: 'Script', fn: (t) => toUnicode(t, SCRIPT_MAP) },
  { label: 'Gothic', fn: (t) => toUnicode(t, GOTHIC_MAP) },
  { label: 'Small Caps', fn: (t) => t.toUpperCase().replace(/[A-Z]/g, c => String.fromCodePoint(0x1D00 + c.charCodeAt(0) - 65)) },
]

export default function whatsapp_font_formatter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [text, setText] = useState('')
  const [copiedIdx, setCopiedIdx] = useState(null)

  const formatted = useMemo(() => {
    if (!text.trim()) return []
    return [
      ...FONT_STYLES.map(s => ({ label: s.label, result: s.preview(text) })),
      ...UNICODE_STYLES.map(s => ({ label: s.label, result: s.fn(text) })),
    ]
  }, [text])

  const copy = useCallback((str, idx) => {
    navigator.clipboard?.writeText(str)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1500)
  }, [])

  const copyAll = useCallback(() => {
    const all = formatted.map(f => `${f.label}: ${f.result}`).join('\n')
    navigator.clipboard?.writeText(all)
    setCopiedIdx('all')
    setTimeout(() => setCopiedIdx(null), 1500)
  }, [formatted])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500"

  return (
    <ToolLayout
      title="WhatsApp Font Formatter"
      desc="Type text and instantly preview bold, italic, strikethrough, monospace & Unicode font styles for WhatsApp."
      icon="𝐖" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-font-formatter"
      faq={[
        { q: "How do I make text bold in WhatsApp?", a: "Wrap your text with asterisks: *bold text*. This tool generates the formatting for you automatically." },
        { q: "What fonts work in WhatsApp?", a: "WhatsApp supports bold (*text*), italic (_text_), strikethrough (~text~), and monospace (```text```). Unicode styles like 𝐁𝐨𝐥𝐝 work too." },
        { q: "How do I copy formatted text?", a: "Click any style card to copy it to your clipboard, then paste directly into WhatsApp." },
      ]}
      howItWorks={[
        "Type or paste your text in the input box.",
        "Preview all available font styles instantly.",
        "Click any style to copy it, then paste in WhatsApp.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Font Formatter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-font-formatter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Your Text</label>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Type something to format..."
            rows={3} className={inputClass + " resize-vertical"} />
        </div>

        {formatted.length > 0 && (
          <div ref={resultRef}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Formatted Styles ({formatted.length})</h3>
              <button onClick={copyAll}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                {copiedIdx === 'all' ? '✓ Copied All' : '📋 Copy All'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {formatted.map((f, i) => (
                <button key={i} onClick={() => copy(f.result, i)}
                  className="text-left p-3.5 rounded-xl bg-white/[0.04] border border-white/6 hover:border-indigo-500/40 hover:bg-indigo-500/[0.06] transition-all group">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 group-hover:text-indigo-400 transition-colors">{f.label}</div>
                  <div className="text-sm text-white font-medium break-all leading-relaxed">{f.result}</div>
                  <div className="text-[10px] text-slate-600 mt-1.5">{copiedIdx === i ? '✓ Copied!' : 'Click to copy'}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
