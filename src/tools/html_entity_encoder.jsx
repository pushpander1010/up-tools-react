import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

const entities = [
  ['&', '&amp;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
  ['"', '&quot;'],
  ["'", '&#39;'],
  ['`', '&#96;'],
  ['©', '&copy;'],
  ['®', '&reg;'],
  ['™', '&trade;'],
  ['€', '&euro;'],
  ['£', '&pound;'],
  ['¥', '&yen;'],
  ['°', '&deg;'],
  ['±', '&plusmn;'],
  ['×', '&times;'],
  ['÷', '&divide;'],
  ['©', '&copy;'],
  ['®', '&reg;'],
  ['™', '&trade;'],
  ['←', '&larr;'],
  ['→', '&rarr;'],
  ['↑', '&uarr;'],
  ['↓', '&darr;'],
]

function encodeEntities(text) {
  let result = text
  for (const [char, entity] of entities) {
    result = result.split(char).join(entity)
  }
  return result
}

function decodeEntities(text) {
  const temp = document.createElement('textarea')
  temp.innerHTML = text
  return temp.value
}

export default function html_entity_encoder() {
  const [input, setInput] = useState('<div class="hello">Hello &amp; World © 2024</div>')
  const [mode, setMode] = useState('encode')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const process = useCallback(() => {
    if (mode === 'encode') {
      setOutput(encodeEntities(input))
    } else {
      setOutput(decodeEntities(input))
    }
  }, [input, mode])

  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const swapInputOutput = () => {
    setInput(output)
    setMode(m => m === 'encode' ? 'decode' : 'encode')
    process()
  }

  return (
    <ToolLayout
      title="HTML Entity Encoder / Decoder"
      desc="Encode special characters to HTML entities for safe embedding, or decode entities back to readable text."
      icon="🔤" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="html-entity-encoder"
      faq={[
        { q: 'Why encode HTML entities?', a: 'To safely display text in HTML without it being interpreted as markup. Essential for user content, comments, and dynamic data.' },
        { q: 'Which characters are encoded?', a: 'Common entities: & < > " \' plus symbols like © ® ™ € and more.' },
      ]}
      howItWorks={[
        'Paste text containing HTML entities or special characters.',
        'Choose Encode (special chars → entities) or Decode (entities → chars).',
        'Click Process to see the result.',
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Mode toggle + swap */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl overflow-hidden border border-white/[0.12]">
            {['encode', 'decode'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all ${mode === m ? 'bg-indigo-500 text-white' : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]'}`}>
                {m}
              </button>
            ))}
          </div>
          <button onClick={swapInputOutput}
            className="px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] text-slate-400 text-sm font-bold rounded-xl hover:bg-white/[0.1] transition-all">
            ⇄ Swap
          </button>
        </div>

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            {mode === 'encode' ? 'Text to Encode' : 'Entities to Decode'}
          </label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text with special characters...' : 'Enter HTML entities to decode...'}
            rows={6}
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-y" />
        </div>

        {/* Process button */}
        <button onClick={process}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-indigo-500/20">
          {mode === 'encode' ? 'Encode →' : 'Decode →'}
        </button>

        {/* Output */}
        {output && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-300">Output</label>
              <button onClick={copyOutput}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-all">
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
            <textarea value={output} readOnly rows={6}
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-emerald-400 font-mono focus:outline-none resize-y" />
          </div>
        )}

        {/* Quick reference */}
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Common HTML Entities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {entities.slice(0, 12).map(([char, entity]) => (
              <div key={entity} className="flex items-center gap-2 text-xs bg-black/20 rounded-lg px-3 py-2">
                <span className="text-white font-bold">{char}</span>
                <span className="text-slate-400">→</span>
                <span className="text-emerald-400 font-mono">{entity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
