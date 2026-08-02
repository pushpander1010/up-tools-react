import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function FindAndReplace() {
  const [input, setInput] = useState('')
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [regexMode, setRegexMode] = useState(false)
  const [copied, setCopied] = useState(false)

  const { output, matchCount, error } = useMemo(() => {
    if (!findText || !input) return { output: input, matchCount: 0, error: null }
    try {
      let result = input
      let count = 0
      if (regexMode) {
        const flags = caseSensitive ? 'g' : 'gi'
        const re = new RegExp(findText, flags)
        const matches = input.match(re)
        count = matches ? matches.length : 0
        result = input.replace(re, replaceText)
      } else {
        const flags = caseSensitive ? 'g' : 'gi'
        const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const re = new RegExp(escaped, flags)
        const matches = input.match(re)
        count = matches ? matches.length : 0
        result = input.replace(re, replaceText)
      }
      return { output: result, matchCount: count, error: null }
    } catch (e) {
      return { output: 'Regex error: ' + e.message, matchCount: 0, error: e.message }
    }
  }, [input, findText, replaceText, caseSensitive, regexMode])

  const handleCopy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const handleClear = () => {
    setInput('')
    setFindText('')
    setReplaceText('')
  }

  return (
    <ToolLayout
      title="Find & Replace"
      desc="Find and replace text across your content. Supports regex, case-sensitive toggles, and shows replacement count."
      icon="🔍" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="find-and-replace"
      faq={[
        { q: 'What is Find & Replace?', a: 'A tool that lets you find all occurrences of text and replace them. Supports plain text and regular expressions, with an optional case-sensitive toggle.' },
        { q: 'How to use it?', a: 'Type the text to find and its replacement. Toggle case sensitivity or regex mode as needed. The output updates live.' },
      ]}
      howItWorks={[
        'Enter the text to find and the replacement text.',
        'Optionally enable Case Sensitive or Regex Mode.',
        'The output updates in real time with a match count.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Find and Replace", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/find-and-replace/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Find / Replace Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Find</label>
            <input type="text" value={findText} onChange={e => setFindText(e.target.value)}
              placeholder="Text to find..."
              className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white text-sm font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400 [color-scheme:dark]" />
          </div>
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Replace with</label>
            <input type="text" value={replaceText} onChange={e => setReplaceText(e.target.value)}
              placeholder="Replacement text..."
              className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white text-sm font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400 [color-scheme:dark]" />
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none">
            <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)}
              className="accent-indigo-500 w-4 h-4 rounded" />
            Case Sensitive
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none">
            <input type="checkbox" checked={regexMode} onChange={e => setRegexMode(e.target.checked)}
              className="accent-indigo-500 w-4 h-4 rounded" />
            Regex Mode
          </label>
          <span className="text-sm text-slate-400 font-medium ml-auto">
            {error ? '⚠️ Error' : `${matchCount} replacement${matchCount !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Input</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Enter text to search in..."
            rows={8}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-mono text-sm outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark] resize-none" />
        </div>

        {/* Output */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Output</label>
          <textarea value={output} readOnly
            placeholder="Result will appear here..."
            rows={8}
            className={`w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-mono text-sm outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark] resize-none ${error ? 'border-red-500/40 text-red-400' : ''}`} />
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
