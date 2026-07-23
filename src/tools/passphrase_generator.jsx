import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const WORDS = [
  'apple','river','tiger','cloud','stone','light','ocean','brave','forest','money',
  'planet','silver','golden','rocket','shadow','writer','green','dream','storm','candy',
  'pixel','lucky','maple','frost','ember','coral','honey','noble','quartz','velvet',
  'wonder','zephyr','marble','jolly','rapid','spark','amber','blaze','cedar','dawn',
  'ember','flint','grain','harbor','ivory','jade','kite','lunar','mango','neon',
  'opal','pine','quill','ridge','sage','thorn','umbra','vine','wheat','yacht'
]

const SEPARATORS = ['-', '_', '.', ' ', '+', '~']

export default function passphrase_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [wordCount, setWordCount] = useState(4)
  const [separator, setSeparator] = useState('-')
  const [addNumber, setAddNumber] = useState(false)
  const [passphrase, setPassphrase] = useState(null)

  const generate = useCallback(() => {
    const words = []
    for (let i = 0; i < Math.min(10, Math.max(2, wordCount)); i++) {
      words.push(WORDS[Math.floor(Math.random() * WORDS.length)])
    }
    if (addNumber) words[words.length - 1] += Math.floor(Math.random() * 90 + 10)
    setPassphrase(words.join(separator))
  }, [wordCount, separator, addNumber])

  const copy = useCallback(() => {
    if (passphrase) navigator.clipboard.writeText(passphrase)
  }, [passphrase])

  return (
    <ToolLayout
      title="Passphrase Generator"
      desc="Generate strong, memorable passphrases (diceware-style) with customizable word count, separators and numbers."
      icon="🔑" iconBg="rgba(239,68,68,0.08)"
      category="security" slug="passphrase-generator"
      faq={[
        { q: 'What is a passphrase?', a: 'A sequence of random words that is long, strong and easier to remember than a traditional password.' },
        { q: 'How secure are passphrases?', a: 'Long random word combinations are highly resistant to brute-force and guessing attacks.' },
        { q: 'Is it generated locally?', a: 'Yes — entirely in your browser. Nothing leaves your device.' },
      ]}
      howItWorks={[
        'Choose how many words your passphrase should contain (2-10).',
        'Pick a separator character (hyphen, underscore, dot, space, etc.).',
        'Optionally add a number at the end for extra security.',
        'Click Generate and copy your new passphrase.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Passphrase Generator", "applicationCategory": "SecurityApplication",
        "url": "https://www.uptools.in/passphrase-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Word Count */}
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <label className="text-sm font-semibold text-slate-300">Number of Words</label>
            <span className="text-3xl font-extrabold text-white">{wordCount}</span>
          </div>
          <input type="range" min="2" max="10" value={wordCount} onChange={e => setWordCount(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-white/10 accent-red-500 cursor-pointer" />
          <div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>2</span><span>10</span></div>
        </div>

        {/* Separator */}
        <div>
          <label className="text-sm font-semibold text-slate-300 mb-3 block">Separator</label>
          <div className="flex gap-2">
            {SEPARATORS.map(s => (
              <button key={s} onClick={() => setSeparator(s)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all font-mono ${
                  separator === s
                    ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                    : 'bg-white/[0.06] text-slate-500 border border-white/8 hover:border-white/12'
                }`}>
                {s === ' ' ? '⎵' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Add Number Toggle */}
        <button onClick={() => setAddNumber(!addNumber)}
          className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
            addNumber
              ? 'bg-red-500/8 border-red-500/25 shadow-lg shadow-red-500/10'
              : 'bg-white/[0.05] border-white/8 hover:border-white/12'
          }`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-white">Add Number</span>
              <span className="text-[11px] text-slate-500 ml-2">Appends 2-digit number to last word</span>
            </div>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all ${addNumber ? 'bg-red-500 text-white' : 'bg-white/10 text-transparent'}`}>
              {addNumber && '✓'}
            </div>
          </div>
        </button>

        {/* Generate Button */}
        <button onClick={() => { generate(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
          🔑 Generate Passphrase
        </button>

        {/* Result */}
        {passphrase ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Generated Passphrase</h3>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/6 mb-4">
              <code className="text-white font-mono text-lg break-all">{passphrase}</code>
            </div>
            <button onClick={copy}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/8 text-sm font-bold text-white hover:bg-white/10 hover:border-white/15 transition-all active:scale-[0.98]">
              📋 Copy to Clipboard
            </button>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔑</div>
            <p className="text-sm text-slate-600 font-medium">Click Generate to create a passphrase</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
