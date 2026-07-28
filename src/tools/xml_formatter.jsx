import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function XmlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  return (
    <ToolLayout
      title="XML Formatter & Validator"
      desc="Format, minify & validate XML online."
      icon="📄" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="xml-formatter"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Input</label>
          <textarea className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white font-mono min-h-[160px] resize-y focus:outline-none focus:border-indigo-500/50"
            value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text..."
          />
        </div>
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Output</label>
          <textarea className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white font-mono min-h-[160px] resize-y focus:outline-none focus:border-indigo-500/50"
            value={output} readOnly
          />
        </div>
      </div>
    </ToolLayout>
  )
}
