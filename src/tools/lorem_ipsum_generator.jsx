import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat'.split(' ')

function randomWord() { return WORDS[Math.floor(Math.random() * WORDS.length)] }
function randomSentence() {
  let s = ''
  for (let i = 0; i < 8 + Math.floor(Math.random() * 12); i++) {
    s += (i === 0 ? randomWord()[0].toUpperCase() + randomWord().slice(1) : randomWord()) + ' '
  }
  return s.trim() + '.'
}
function randomParagraph() {
  let p = ''
  for (let i = 0; i < 4 + Math.floor(Math.random() * 4); i++) p += randomSentence() + ' '
  return p.trim()
}

export default function lorem_ipsum_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [type, setType] = useState('p')
  const [count, setCount] = useState(5)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = useCallback(() => {
    let r = ''
    for (let i = 0; i < count; i++) {
      if (type === 'p') r += randomParagraph() + '\n\n'
      else if (type === 's') r += randomSentence() + ' '
      else r += randomWord() + ' '
    }
    setOutput(r.trim())
    setTimeout(() => jumpTo(), 50)
  }, [type, count, jumpTo])

  const copyToClipboard = useCallback(async () => {
    try { await navigator.clipboard.writeText(output) } catch {
      const ta = document.createElement('textarea'); ta.value = output
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }, [output])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const btnClass = "px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2"

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      desc="Generate Lorem Ipsum placeholder text with customizable paragraphs, sentences, or words."
      icon="📝" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="lorem-ipsum-generator"
      faq={[
        { q: "What is Lorem Ipsum?", a: "Lorem Ipsum is standard placeholder text used in the printing and typesetting industry since the 1500s." },
        { q: "Is my generated text stored?", a: "No. Everything runs in your browser. Nothing is uploaded." },
      ]}
      howItWorks={[
        "Choose type: paragraphs, sentences, or words.",
        "Set the count (1-100).",
        "Click Generate to create placeholder text.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Lorem Ipsum Generator", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/lorem-ipsum-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className={inputClass}>
                <option value="p">Paragraphs</option>
                <option value="s">Sentences</option>
                <option value="w">Words</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Count</label>
              <input type="number" value={count} onChange={e => setCount(Math.min(100, Math.max(1, +e.target.value || 1)))}
                min={1} max={100} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => { generate(); jumpTo() }}
              className="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98]">
              Generate
            </button>
            <button onClick={copyToClipboard}
              className={`${btnClass} ${copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/8 text-slate-400 hover:text-white'}`}>
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>

        {output && (
          <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">Generated Text</h3>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{output}</pre>
          </div>
        )}

        {!output && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📝</div>
            <p className="text-sm text-slate-600 font-medium">Click Generate to create placeholder text</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
