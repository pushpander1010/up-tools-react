import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function text_diff_checker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [diffHtml, setDiffHtml] = useState('')
  const [stats, setStats] = useState({ add: 0, rem: 0 })

  const diff = () => {
    const a = text1.split('\n')
    const b = text2.split('\n')
    let h = '', add = 0, rem = 0
    const mx = Math.max(a.length, b.length)
    for (let i = 0; i < mx; i++) {
      if (a[i] === b[i]) {
        h += `<span style="color:#9aa4b2">  ${a[i] || ''}</span>\n`
      } else {
        if (a[i] !== undefined) {
          h += `<span style="color:#ef4444;background:rgba(239,68,68,.15)">- ${a[i]}</span>\n`
          rem++
        }
        if (b[i] !== undefined) {
          h += `<span style="color:#22c55e;background:rgba(34,197,94,.15)">+ ${b[i]}</span>\n`
          add++
        }
      }
    }
    setDiffHtml(h)
    setStats({ add, rem })
  }

  const swap = () => {
    setText1(text2)
    setText2('')
  }

  const [copied, setCopied] = useState(false)
  const copyResult = () => {
    const text = diffHtml.replace(/<[^>]+>/g, '')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolLayout
      title="Text Diff Checker"
      desc="Compare two texts side by side with highlighted differences."
      icon="🔍" iconBg="rgba(245,158,11,0.08)"
      category="dev" slug="text-diff-checker"
      faq={[
        { q: 'How does text diff work?', a: 'The tool compares each line of the two texts. Lines that differ are highlighted — red for removed text, green for added text.' },
        { q: 'Can I compare code?', a: 'Yes! The tool works with any text — code, articles, config files, etc.' },
        { q: 'Is my data private?', a: 'Yes. All processing happens in your browser. Nothing is uploaded.' },
      ]}
      howItWorks={[
        'Paste the original text in the left box.',
        'Paste the modified text in the right box.',
        'Click Compare to see the differences.',
        'Review highlighted additions and removals.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Text Diff Checker", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/text-diff-checker/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <label className="text-xs font-semibold text-slate-500 mb-2 block">Original</label>
            <textarea value={text1} onChange={e => setText1(e.target.value)}
              rows={10} placeholder="Paste original text here..."
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none" />
          </div>
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <label className="text-xs font-semibold text-slate-500 mb-2 block">Modified</label>
            <textarea value={text2} onChange={e => setText2(e.target.value)}
              rows={10} placeholder="Paste modified text here..."
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none" />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => { diff(); jumpTo() }}
            className="glow-btn px-6 py-3 rounded-xl text-sm w-full"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>🔍 Compare</button>
          <button onClick={swap}
            className="px-6 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">🔄 Swap</button>
        </div>

        {/* Results */}
        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white">Differences</h2>
            {diffHtml && (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-emerald-400 font-bold">+{stats.add}</span>
                <span className="text-red-400 font-bold">-{stats.rem}</span>
                <button onClick={copyResult}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
            )}
          </div>
          {diffHtml ? (
            <div className="bg-black/20 border-2 border-white/[0.08] rounded-xl p-4 font-mono text-xs whitespace-pre-wrap max-h-[500px] overflow-auto"
              dangerouslySetInnerHTML={{ __html: diffHtml }} />
          ) : (
            <div className="text-center py-8 text-slate-600 text-sm">Click Compare to see differences</div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
