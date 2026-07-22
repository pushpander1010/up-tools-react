import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const CASES = [
  { id: 'upper', label: 'UPPER CASE', icon: '🔠', fn: (s) => s.toUpperCase() },
  { id: 'lower', label: 'lower case', icon: '🔡', fn: (s) => s.toLowerCase() },
  { id: 'title', label: 'Title Case', icon: '📰', fn: (s) => s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
  { id: 'sentence', label: 'Sentence case', icon: '📝', fn: (s) => s.replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase()) },
  { id: 'camel', label: 'camelCase', icon: '🐪', fn: (s) => s.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase()) },
  { id: 'pascal', label: 'PascalCase', icon: '📐', fn: (s) => s.replace(/(^|[^a-zA-Z0-9])+(.)/g, (_, __, c) => c.toUpperCase()) },
  { id: 'snake', label: 'snake_case', icon: '🐍', fn: (s) => s.replace(/([A-Z])/g, '_$1').replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase().replace(/^_/, '') },
  { id: 'kebab', label: 'kebab-case', icon: '🔗', fn: (s) => s.replace(/([A-Z])/g, '-$1').replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase().replace(/^-/, '') },
  { id: 'dot', label: 'dot.case', icon: '•', fn: (s) => s.replace(/([A-Z])/g, '.$1').replace(/[^a-zA-Z0-9]+/g, '.').toLowerCase().replace(/^\./, '') },
  { id: 'flat', label: 'FLATCASE', icon: '📏', fn: (s) => s.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() },
]

export default function text_case_converter() {

  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(null)

  const copy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <ToolLayout
      title="Text Case Converter"
      desc="Convert text between UPPER, lower, Title, camelCase, snake_case, kebab-case and more."
      icon="🔡" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="text-case-converter"
      faq={[
        { q: 'What is camelCase?', a: 'Words joined without separators, each new word capitalized. Used in JavaScript: myVariableName.' },
        { q: 'What is kebab-case?', a: 'Words joined with hyphens, all lowercase. Used in URLs and CSS classes: my-variable-name.' },
        { q: 'What is snake_case?', a: 'Words joined with underscores, all lowercase. Used in Python and databases: my_variable_name.' },
      ]}
      howItWorks={[
        'Type or paste your text in the input area.',
        'Scroll down to see all case conversions instantly.',
        'Click the copy button on any conversion to copy it.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Text Case Converter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/text-case-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Input Text</label>
          <textarea value={input} onChange={e => { setInput(e.target.value); jumpTo() }}
            placeholder="Type or paste your text here..."
            rows={4}
            className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-white text-sm font-mono outline-none focus:border-brand/40 transition-all duration-300 placeholder:text-slate-600 resize-none" />
          <div className="flex justify-between mt-2 text-[11px] text-slate-600">
            <span>{input.length} characters</span>
            <span>{input.split(/\s+/).filter(Boolean).length} words</span>
          </div>
        </div>

        <div className="space-y-2">
          {CASES.map(c => {
            const result = input ? c.fn(input) : ''
            return (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.05] border border-white/8 hover:border-white/12 transition-all group">
                <span className="text-lg w-8 text-center shrink-0">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{c.label}</div>
                  <div className="text-sm text-white font-mono truncate">{result || <span className="text-slate-600">—</span>}</div>
                </div>
                {result && (
                  <button onClick={() => copy(result, c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                      copied === c.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'
                    }`}>
                    {copied === c.id ? '✓' : '📋'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </ToolLayout>
  )
}
