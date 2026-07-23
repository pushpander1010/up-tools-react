import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function mapChar(text, upperBase, lowerBase, exceptions = {}) {
  return [...text].map(ch => {
    if (exceptions[ch]) return exceptions[ch]
    const c = ch.charCodeAt(0)
    if (c >= 65 && c <= 90) return String.fromCodePoint(upperBase + c - 65)
    if (c >= 97 && c <= 122) return String.fromCodePoint(lowerBase + c - 97)
    return ch
  }).join('')
}

const bold = t => mapChar(t, 0x1D400, 0x1D41A)
const italic = t => mapChar(t, 0x1D434, 0x1D44E, { h: '\u210E' })
const boldItalic = t => mapChar(t, 0x1D468, 0x1D482)
const script = t => mapChar(t, 0x1D4D0, 0x1D4EA)
const fraktur = t => mapChar(t, 0x1D56C, 0x1D586)
const doubleStruck = t => mapChar(t, 0x1D538, 0x1D552, {
  C: '\u2102', H: '\u210D', N: '\u2115', P: '\u2119', Q: '\u211A', R: '\u211D', Z: '\u2124'
})
const monospace = t => mapChar(t, 0x1D670, 0x1D68A)
const circled = t => mapChar(t, 0x24B6, 0x24D0)
const fullwidth = t => [...t].map(ch => {
  const c = ch.charCodeAt(0)
  if (c >= 65 && c <= 90) return String.fromCodePoint(0xFF21 + c - 65)
  if (c >= 97 && c <= 122) return String.fromCodePoint(0xFF41 + c - 97)
  if (c >= 48 && c <= 57) return String.fromCodePoint(0xFF10 + c - 48)
  if (ch === ' ') return '\u3000'
  return ch
}).join('')

const SC = {a:'\u1D00',b:'\u0299',c:'\u1D04',d:'\u1D05',e:'\u1D07',f:'\uA730',g:'\u0262',h:'\u029C',i:'\u026A',j:'\u1D0A',k:'\u1D0B',l:'\u029F',m:'\u1D0D',n:'\u0274',o:'\u1D0F',p:'\u1D18',q:'q',r:'\u0280',s:'\uA731',t:'\u1D1B',u:'\u1D1C',v:'\u1D20',w:'\u1D21',x:'x',y:'\u028F',z:'\u1D22'}
const smallCaps = t => [...t.toLowerCase()].map(c => SC[c] || c.toUpperCase()).join('')
const strikethrough = t => [...t].map(c => c + '\u0336').join('')
const underline = t => [...t].map(c => c + '\u0332').join('')

const BS = {A:'\uD83C\uDD50',B:'\uD83C\uDD51',C:'\uD83C\uDD52',D:'\uD83C\uDD53',E:'\uD83C\uDD54',F:'\uD83C\uDD55',G:'\uD83C\uDD56',H:'\uD83C\uDD57',I:'\uD83C\uDD58',J:'\uD83C\uDD59',K:'\uD83C\uDD5A',L:'\uD83C\uDD5B',M:'\uD83C\uDD5C',N:'\uD83C\uDD5D',O:'\uD83C\uDD5E',P:'\uD83C\uDD5F',Q:'\uD83C\uDD60',R:'\uD83C\uDD61',S:'\uD83C\uDD62',T:'\uD83C\uDD63',U:'\uD83C\uDD64',V:'\uD83C\uDD65',W:'\uD83C\uDD66',X:'\uD83C\uDD67',Y:'\uD83C\uDD68',Z:'\uD83C\uDD69'}
const boldSquare = t => [...t.toUpperCase()].map(c => BS[c] || c).join('')

const FLIP = {a:'\u0250',b:'q',c:'\u0254',d:'p',e:'\u01DD',f:'\u025F',g:'\u0253',h:'\u0265',i:'\u1D09',j:'\u027E',k:'\u029E',l:'l',m:'\u026F',n:'u',o:'o',p:'d',q:'b',r:'\u0279',s:'s',t:'\u0287',u:'n',v:'\u028C',w:'\u028D',x:'x',y:'\u028E',z:'z',A:'\u2200',B:'\uD801\uDC00',C:'\u0186',D:'\uD801\uDC01',E:'\u018E',F:'\u2132',G:'\u2141',H:'H',I:'I',J:'\u017F',K:'\u029E',L:'\u02E5',M:'W',N:'N',O:'O',P:'\u0500',Q:'Q',R:'\u0279',S:'S',T:'\u22A5',U:'\u2229',V:'\u039B',W:'M',X:'X',Y:'\u2144',Z:'Z','!':'\xA1','?':'\xBF'}
const flipText = t => [...t].map(c => FLIP[c] || c).reverse().join('')

const TINY = {a:'\u1D43',b:'\u1D47',c:'\u1D9C',d:'\u1D48',e:'\u1D49',f:'\u1DA0',g:'\u1D4D',h:'\u02B0',i:'\u2071',j:'\u02B2',k:'\u1D4F',l:'\u02E1',m:'\u1D50',n:'\u207F',o:'\u1D52',p:'\u1D56',q:'q',r:'\u02B3',s:'\u02E2',t:'\u1D57',u:'\u1D58',v:'\u1D5B',w:'\u02B7',x:'\u02E3',y:'\u02B8',z:'\u1DBB'}
const tiny = t => [...t.toLowerCase()].map(c => TINY[c] || c).join('')

const STYLES = [
  { label: 'Bold', name: '𝐁𝐨𝐥𝐝', fn: bold },
  { label: 'Italic', name: '𝐼𝑡𝑎𝑙𝑖𝑐', fn: italic },
  { label: 'Bold Italic', name: '𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄', fn: boldItalic },
  { label: 'Script / Cursive', name: '𝒮𝒸𝓇𝒾𝓅𝓉', fn: script },
  { label: 'Gothic / Fraktur', name: '𝖥𝗋𝖺𝗄𝗍𝗎𝗋', fn: fraktur },
  { label: 'Double-Struck', name: '𝔻𝕠𝕦𝕓𝕝𝕖', fn: doubleStruck },
  { label: 'Monospace', name: '𝙼𝚘𝚗𝚘', fn: monospace },
  { label: 'Circled', name: 'Ⓒⓘⓡⓒⓛⓔ', fn: circled },
  { label: 'Fullwidth', name: 'Ｆｕｌｌ', fn: fullwidth },
  { label: 'Small Caps', name: 'Sᴍᴀʟʟ Cᴀᴘs', fn: smallCaps },
  { label: 'Strikethrough', name: 'S̶t̶r̶i̶k̶e̶', fn: strikethrough },
  { label: 'Underline', name: 'U̲n̲d̲e̲r̲l̲i̲n̲e̲', fn: underline },
  { label: 'Bold Square', name: '🅱🅾🆇', fn: boldSquare },
  { label: 'Upside Down', name: 'uʍop', fn: flipText },
  { label: 'Superscript', name: 'ᵗⁱⁿʸ', fn: tiny },
]

export default function fancy_text_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(null)

  const results = useMemo(() => {
    if (!input) return STYLES.map(s => ({ ...s, output: '' }))
    return STYLES.map(s => ({ ...s, output: s.fn(input) }))
  }, [input])

  const copy = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <ToolLayout
      title="Fancy Text Generator"
      desc="Convert text to 15+ Unicode font styles instantly — Bold, Italic, Script, Cursive, Fraktur, Double-Struck, Upside Down."
      icon="✦" iconBg="rgba(168,85,247,0.08)"
      category="text" slug="fancy-text-generator"
      faq={[
        { q: 'Is this tool free?', a: 'Yes, completely free with no sign-ups required.' },
        { q: 'Is my data private?', a: 'Yes. All conversions run locally in your browser. Nothing is uploaded.' },
        { q: 'Where can I use the fancy text?', a: 'Instagram bios, WhatsApp, Twitter/X, Discord, and any platform that supports Unicode.' },
      ]}
      howItWorks={[
        'Type or paste your text in the input area.',
        'Scroll down to see 15+ Unicode font styles generated instantly.',
        'Click any Copy button to copy that style to your clipboard.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Fancy Text Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/fancy-text-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">✎ Your Text</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Type or paste your text here..."
            rows={4}
            className="w-full bg-black/20 border-2 border-white/8 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-purple-500/40 transition-all placeholder:text-slate-600 resize-none" />
          <div className="text-[11px] text-slate-600 mt-1">{[...input].length} characters</div>
        </div>

        {/* Style Cards */}
        <div ref={resultRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {results.map((style, idx) => (
            <div key={style.label} className="p-4 rounded-xl bg-white/[0.05] border border-white/8 hover:border-white/12 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{style.label}</span>
                {style.output && (
                  <button onClick={() => { copy(style.output, idx); jumpTo() }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${copied === idx ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                    {copied === idx ? '✓ Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              <div className="text-sm text-white break-words leading-relaxed min-h-[2.5rem] flex items-center">
                {style.output || <span className="text-slate-600">Your text will appear here…</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
