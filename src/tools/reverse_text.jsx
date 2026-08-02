import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function ReverseText() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const apply = (mode) => {
    if (!input) return
    let result = ''
    if (mode === 'char') {
      result = input.split('').reverse().join('')
    } else if (mode === 'word') {
      result = input.split(' ').reverse().join(' ')
    } else if (mode === 'line') {
      result = input.split('\n').reverse().join('\n')
    } else if (mode === 'mirror') {
      result = input.split('\n').map(l => l.split('').reverse().join('')).join('\n')
    }
    setOutput(result)
  }

  const handleCopy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
  }

  return (
    <ToolLayout
      title="Reverse Text"
      desc="Reverse text characters, words, or lines instantly. All processing is done in your browser."
      icon="🔄" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="reverse-text"
      faq={[
        { q: 'What is Reverse Text?', a: 'A tool that reverses your text in multiple ways: reverse characters, reverse words, reverse lines, or mirror text (reverse each line independently).' },
        { q: 'How to use it?', a: 'Paste or type text, then click one of the four reverse modes. The result appears instantly in the output area.' },
      ]}
      howItWorks={[
        'Type or paste your text in the input area.',
        'Choose a reverse mode: Characters, Words, Lines, or Mirror.',
        'Copy the result from the output area.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Reverse Text", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/reverse-text/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Reverse Mode Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            ['char', 'Reverse Characters', 'text-indigo-400'],
            ['word', 'Reverse Words', 'text-emerald-400'],
            ['line', 'Reverse Lines', 'text-amber-400'],
            ['mirror', 'Mirror Text', 'text-cyan-400'],
          ].map(([mode, label, color]) => (
            <button key={mode}
              onClick={() => apply(mode)}
              className={`px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] transition-all ${color}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Input</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Enter text to reverse..."
            rows={6}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-mono text-sm outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark] resize-none" />
        </div>

        {/* Output */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Output</label>
          <textarea value={output} readOnly
            placeholder="Reversed text will appear here..."
            rows={6}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-mono text-sm outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark] resize-none" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button onClick={handleCopy}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-slate-300 transition-all">
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
          <button onClick={handleClear}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-slate-300 transition-all">
            🗑️ Clear
          </button>
        </div>
      </div>
    </ToolLayout>
  )
}
