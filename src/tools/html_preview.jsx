import { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const DEFAULT_HTML = `<h1 style="color:#6366f1">Hello UpTools!</h1>
<p>Edit this HTML to see a live preview.</p>
<button onclick="alert('Hi!')">Click Me</button>
<style>
  body { font-family: sans-serif; padding: 16px; }
  button { padding: 8px 16px; border-radius: 8px; border: none;
    background: #6366f1; color: white; cursor: pointer; }
</style>`

export default function html_preview() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [html, setHtml] = useState(DEFAULT_HTML)
  const [copied, setCopied] = useState(false)
  const iframeRef = useRef(null)

  const run = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument || iframe.contentWindow.document
    doc.open()
    doc.write(html)
    doc.close()
  }, [html])

  useEffect(() => {
    run()
  }, [])

  const copy = () => {
    navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolLayout
      title="HTML Preview"
      desc="Write HTML and see a live preview instantly. Edit markup and CSS, render in real time."
      icon="🌐" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="html-preview"
      faq={[
        { q: 'Is the preview real-time?', a: 'Yes — the preview updates live as you type or when you click Run.' },
        { q: 'Can I use CSS?', a: 'Yes — include <style> tags or inline styles in your HTML.' },
      ]}
      howItWorks={[
        'Write or paste your HTML in the left panel.',
        'See the rendered preview in the right panel.',
        'Click Run to refresh the preview.',
        'Copy the HTML source with the copy button.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "HTML Preview", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/html-preview/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button onClick={() => { run(); jumpTo() }}
            className="glow-btn px-4 py-2 rounded-xl text-sm"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            ▶ Run
          </button>
          <button onClick={copy}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>

        <div ref={resultRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Editor */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">HTML</label>
            <textarea value={html} onChange={e => setHtml(e.target.value)}
              placeholder="Write HTML here..."
              rows={18}
              className="w-full bg-black/20 border-2 border-white/8 rounded-2xl px-5 py-4 text-sm text-white font-mono outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600 resize-none" />
          </div>
          {/* Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Preview</label>
            <iframe
              ref={iframeRef}
              sandbox="allow-scripts allow-modals"
              title="HTML Preview"
              className="w-full bg-white rounded-2xl border-2 border-white/8 min-h-[460px]"
              style={{ colorScheme: 'light' }}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
