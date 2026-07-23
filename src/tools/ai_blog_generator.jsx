import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import useAIStream from '../hooks/useAIStream'

export default function ai_blog_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const { output, status, streaming, generate, stop } = useAIStream()

  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('informative')
  const [length, setLength] = useState('medium')
  const [audience, setAudience] = useState('')
  const [keywords, setKeywords] = useState('')
  const [copied, setCopied] = useState(false)

  const blockedTopics = ['how to hack', 'exploit', 'bypass security', 'illegal', 'malware', 'phishing kit']

  const handleGenerate = useCallback(() => {
    const t = topic.trim()
    if (!t) return
    if (t.length > 5000) return
    if (blockedTopics.some(term => t.toLowerCase().includes(term))) return

    const wordCount = length === 'short' ? 400 : length === 'medium' ? 800 : 1500
    const prompt = `Write a complete, SEO-optimized blog post about: "${t}".

Requirements:
- Tone: ${tone}
- Target length: ~${wordCount} words
- Structure: H1 title, introduction, multiple H2 sections with H3 subsections where appropriate, conclusion, call-to-action
${audience ? '- Written for: ' + audience : ''}
${keywords ? '- Naturally incorporate these keywords: ' + keywords : ''}
- Use markdown formatting (# H1, ## H2, ### H3, **bold**, bullet lists)
- Make it engaging, valuable, and shareable
- End with a meta description (under "---\\nMeta Description:")`

    generate({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      systemPrompt: 'You are an expert blog writer and SEO specialist. Write complete, well-structured blog posts in markdown.',
    })
    jumpTo()
  }, [topic, tone, length, audience, keywords, generate, jumpTo])

  const copy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const download = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'blog-post.txt'
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none"
  const selectClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="AI Blog Post Generator"
      desc="Generate full SEO-optimized blog posts instantly with AI. Enter a topic, pick tone and length, get a complete article in seconds."
      icon="📝" iconBg="rgba(99,102,241,0.08)"
      category="ai" slug="ai-blog-generator"
      faq={[
        { q: "Is the AI blog generator free?", a: "Yes, completely free with no sign-up required. Powered by AI via a secure server-side proxy." },
        { q: "Can I use the generated blog posts?", a: "Yes. The generated content is yours to use, edit, and publish. Always review and personalize before publishing." },
        { q: "How long does it take?", a: "Most blog posts stream in 15–30 seconds depending on length." },
      ]}
      howItWorks={[
        "Enter your blog topic and select tone, length, and audience.",
        "Click Generate to stream the AI-written blog post.",
        "Copy or download the result instantly.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI Blog Post Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/ai-blog-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Input Section */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Blog Topic / Title *</label>
            <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="e.g. 10 tips for remote work productivity"
              className={inputClass}
              onKeyDown={e => { if (e.key === 'Enter') handleGenerate() }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Tone</label>
              <select value={tone} onChange={e => setTone(e.target.value)} className={selectClass}>
                <option value="informative">Informative</option>
                <option value="conversational">Conversational</option>
                <option value="professional">Professional</option>
                <option value="persuasive">Persuasive</option>
                <option value="humorous">Humorous</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Length</label>
              <select value={length} onChange={e => setLength(e.target.value)} className={selectClass}>
                <option value="short">Short (~400 words)</option>
                <option value="medium">Medium (~800 words)</option>
                <option value="long">Long (~1500 words)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Target Audience</label>
              <input type="text" value={audience} onChange={e => setAudience(e.target.value)}
                placeholder="e.g. small business owners, students"
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Target Keywords (comma-separated)</label>
              <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)}
                placeholder="e.g. remote work, productivity tips"
                className={inputClass} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          {streaming ? (
            <button onClick={stop}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all">
              ⏹ Stop
            </button>
          ) : (
            <button onClick={handleGenerate} disabled={!topic.trim()}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              ✨ Generate Blog Post
            </button>
          )}
          <button onClick={copy} disabled={!output}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all disabled:opacity-40 ${copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'}`}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
          <button onClick={download} disabled={!output}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all disabled:opacity-40">
            ⬇ Download
          </button>
        </div>

        {/* Status */}
        {status && (
          <div className={`p-3 rounded-xl text-sm ${status.includes('Error') ? 'bg-red-500/10 border border-red-500/20 text-red-400' : status.includes('Done') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400'}`}>
            {status}
          </div>
        )}

        {/* Output */}
        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          {output ? (
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-3 opacity-20">📝</div>
              <p className="text-sm text-slate-600 font-medium">Enter a topic and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
