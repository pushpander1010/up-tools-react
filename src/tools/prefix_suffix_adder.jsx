import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function PrefixSuffixAdder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [copied, setCopied] = useState(false)

  const getLines = (text) => text.split('\n')

  const updateOutput = (lines) => {
    setOutput(lines.join('\n'))
  }

  const addBoth = () => {
    const lines = getLines(input)
    updateOutput(lines.map(line => line.trim() ? prefix + line + suffix : ''))
  }

  const addPrefix = () => {
    const lines = getLines(input)
    updateOutput(lines.map(line => line.trim() ? prefix + line : ''))
  }

  const addSuffix = () => {
    const lines = getLines(input)
    updateOutput(lines.map(line => line.trim() ? line + suffix : ''))
  }

  const removeBoth = () => {
    const lines = getLines(input)
    updateOutput(lines.map(line => line.replace(prefix, '').replace(suffix, '')))
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

  const inCount = useMemo(() => input ? input.split('\n').length : 0, [input])
  const outCount = useMemo(() => output ? output.split('\n').length : 0, [output])

  return (
    <ToolLayout
      title="Prefix & Suffix Adder"
      desc="Add prefix, suffix, or both to each line of text. Perfect for batch editing lists, URLs, or code."
      icon="📎" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="prefix-suffix-adder"
      faq={[
        { q: 'What is Prefix & Suffix Adder?', a: 'A tool that lets you add text before (prefix) and/or after (suffix) every line in a list. Great for adding URLs, file extensions, or formatting lists in bulk.' },
        { q: 'How to use it?', a: 'Enter your prefix and suffix, paste your lines, then click the desired action button.' },
      ]}
      howItWorks={[
        'Enter a prefix and/or suffix in the respective fields.',
        'Paste your text with one item per line.',
        'Click Add Both, Add Prefix Only, Add Suffix Only, or Remove to transform.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Prefix Suffix Adder", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/prefix-suffix-adder/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Prefix / Suffix Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Prefix</label>
            <input type="text" value={prefix} onChange={e => setPrefix(e.target.value)}
              placeholder="e.g. https://"
              className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white text-sm font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400 [color-scheme:dark]" />
          </div>
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Suffix</label>
            <input type="text" value={suffix} onChange={e => setSuffix(e.target.value)}
              placeholder="e.g. .html"
              className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white text-sm font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400 [color-scheme:dark]" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button onClick={addBoth}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-indigo-400 transition-all">
            Add Both
          </button>
          <button onClick={addPrefix}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-emerald-400 transition-all">
            Add Prefix Only
          </button>
          <button onClick={addSuffix}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-amber-400 transition-all">
            Add Suffix Only
          </button>
          <button onClick={removeBoth}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-cyan-400 transition-all">
            Remove Prefix & Suffix
          </button>
        </div>

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Input (<span className="text-indigo-400">{inCount}</span> lines)
          </label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="One item per line..."
            rows={8}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-mono text-sm outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark] resize-none" />
        </div>

        {/* Output */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Output (<span className="text-emerald-400">{outCount}</span> lines)
          </label>
          <textarea value={output} readOnly
            placeholder="Result will appear here..."
            rows={8}
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
