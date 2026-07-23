import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import useAIStream from '../hooks/useAIStream'

const STYLES = ['catchy & memorable', 'modern & techy', 'elegant & luxury', 'playful & fun', 'professional & corporate', 'minimalist']

export default function ai_business_name_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const { output, status, streaming, generate, stop } = useAIStream()
  const [copied, setCopied] = useState(false)

  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState('Technology')
  const [target, setTarget] = useState('')
  const [keywords, setKeywords] = useState('')
  const [avoid, setAvoid] = useState('')
  const [activeStyles, setActiveStyles] = useState(new Set(['catchy & memorable']))

  const toggleStyle = (s) => {
    setActiveStyles(prev => {
      const next = new Set(prev)
      if (next.has(s)) next.delete(s); else next.add(s)
      return next
    })
  }

  const handleGenerate = useCallback(() => {
    if (!description.trim()) return

    const prompt = `Generate 20 unique business name ideas.

Business: ${description}
Industry: ${industry}
${target ? 'Target market: ' + target : ''}
Name style: ${[...activeStyles].join(', ') || 'catchy & memorable'}
${keywords ? 'Keywords to incorporate: ' + keywords : ''}
${avoid ? 'Words/themes to avoid: ' + avoid : ''}

For each name provide:
- The business name
- A short tagline (under 10 words)
- Why it works (1 sentence)

Mix naming approaches: invented words, descriptive, metaphorical, compound words, acronyms.
Format as a numbered list. Make names memorable, unique, and brandable.`

    generate({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
      systemPrompt: 'You are a branding expert and creative director who specializes in naming businesses.',
    })
    jumpTo()
  }, [description, industry, target, keywords, avoid, activeStyles, generate, jumpTo])

  const copy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"
  const selectClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="AI Business Name Generator"
      desc="Generate unique, catchy business names with AI. Get 20 name ideas with taglines for startups, shops, and agencies."
      icon="💡" iconBg="rgba(245,158,11,0.08)"
      category="ai" slug="ai-business-name-generator"
      faq={[
        { q: "How many names are generated?", a: "20 unique, brandable name ideas with taglines and explanations." },
        { q: "Can I use these commercially?", a: "Yes. Always verify trademark availability before committing to a name." },
      ]}
      howItWorks={[
        "Describe your business and select an industry.",
        "Pick name styles you prefer (catchy, modern, elegant, etc.).",
        "Click Generate to get 20 unique name ideas.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI Business Name Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/ai-business-name-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Describe your business *</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              placeholder="e.g. An online store selling handmade eco-friendly candles"
              className={inputClass + ' resize-none'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Industry</label>
              <select value={industry} onChange={e => setIndustry(e.target.value)} className={selectClass}>
                {['Technology', 'Health & Wellness', 'Food & Beverage', 'Fashion', 'Education', 'Finance', 'Real Estate', 'Marketing', 'E-commerce', 'Other'].map(i => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Target Market</label>
              <input type="text" value={target} onChange={e => setTarget(e.target.value)}
                placeholder="e.g. millennials, B2B SaaS" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Name Style</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map(s => (
                <button key={s} onClick={() => toggleStyle(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${activeStyles.has(s) ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-white/[0.06] text-slate-500 border-white/[0.08]'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Keywords (optional)</label>
              <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)}
                placeholder="e.g. eco, green, sustainable" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Avoid (optional)</label>
              <input type="text" value={avoid} onChange={e => setAvoid(e.target.value)}
                placeholder="e.g. cheap, budget" className={inputClass} />
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {streaming ? (
            <button onClick={stop} className="flex-1 px-6 py-3 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all">⏹ Stop</button>
          ) : (
            <button onClick={handleGenerate} disabled={!description.trim()}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>✨ Generate Names</button>
          )}
          <button onClick={copy} disabled={!output} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all disabled:opacity-40 ${copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'}`}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>

        {status && <div className={`p-3 rounded-xl text-sm ${status.includes('Error') ? 'bg-red-500/10 border border-red-500/20 text-red-400' : status.includes('Done') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400'}`}>{status}</div>}

        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          {output ? (
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-3 opacity-20">💡</div>
              <p className="text-sm text-slate-600 font-medium">Describe your business and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
