import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const DEFAULT_MD = `# Hello World

This is **bold** and *italic* text.

## Features

- Item 1
- Item 2
- Item 3

> This is a blockquote.

### Code Example

\`\`\`js
console.log("Hello from UpTools!");
\`\`\`

Here is some \`inline code\` too.`

function renderMarkdown(md) {
  let h = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  // Code blocks
  h = h.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre style="background:#1e1b4b;padding:12px;border-radius:8px;overflow-x:auto"><code>$2</code></pre>')
  // Headers
  h = h.replace(/^### (.+)$/gm, '<h3 style="color:#a78bfa;margin:12px 0 4px;font-size:1rem">$1</h3>')
  h = h.replace(/^## (.+)$/gm, '<h2 style="color:#818cf8;margin:16px 0 6px;font-size:1.15rem">$1</h2>')
  h = h.replace(/^# (.+)$/gm, '<h1 style="color:#6366f1;margin:20px 0 8px;font-size:1.4rem">$1</h1>')
  // Bold/Italic
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#e2e8f0">$1</strong>')
  h = h.replace(/\*(.+?)\*/g, '<em style="color:#cbd5e1">$1</em>')
  // Inline code
  h = h.replace(/`(.+?)`/g, '<code style="background:#1e1b4b;padding:2px 6px;border-radius:4px;font-size:.85em;color:#a78bfa">$1</code>')
  // Lists
  h = h.replace(/^- (.+)$/gm, '<li style="padding:2px 0;color:#94a3b8">• $1</li>')
  // Blockquote
  h = h.replace(/^&gt; (.+)$/gm, '<blockquote style="border-left:3px solid #6366f1;padding-left:12px;color:#94a3b8;font-style:italic;margin:8px 0">$1</blockquote>')
  // Line breaks
  h = h.replace(/\n\n/g, '<br><br>')
  h = h.replace(/\n/g, '<br>')
  return h
}

export default function markdown_preview() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState(DEFAULT_MD)
  const [copied, setCopied] = useState(false)

  const preview = useMemo(() => renderMarkdown(input), [input])

  const copy = () => {
    navigator.clipboard.writeText(input)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolLayout
      title="Markdown Preview"
      desc="Write Markdown and see rendered output in real-time. Live preview editor."
      icon="📝" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="markdown-preview"
      faq={[
        { q: 'What Markdown is supported?', a: 'Headings, bold, italic, inline code, code blocks, lists, blockquotes, and line breaks.' },
        { q: 'Is it real-time?', a: 'Yes — the preview updates instantly as you type.' },
      ]}
      howItWorks={[
        'Write or paste Markdown in the left panel.',
        'See the rendered preview update in real-time on the right.',
        'Copy the Markdown source with the copy button.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Markdown Preview", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/markdown-preview/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex gap-2 justify-end">
          <button onClick={copy}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
            {copied ? '✓ Copied' : '📋 Copy Source'}
          </button>
        </div>

        <div ref={resultRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Markdown</label>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              placeholder="Write Markdown here..."
              rows={18}
              className="w-full bg-black/20 border-2 border-white/8 rounded-2xl px-5 py-4 text-sm text-white font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none" />
          </div>
          {/* Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Preview</label>
            <div
              className="w-full bg-black/20 border-2 border-white/8 rounded-2xl px-5 py-4 text-sm text-slate-300 min-h-[460px] leading-relaxed overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
