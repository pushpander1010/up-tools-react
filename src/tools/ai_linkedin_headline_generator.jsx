import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import useAIStream from '../hooks/useAIStream'

const PRESETS = [
  { label: '👨‍💻 Software Engineer', role: 'Senior Software Engineer', keywords: 'React, Node.js, Cloud', goal: 'Tech recruiters and CTOs' },
  { label: '📊 Data Scientist', role: 'Data Scientist', keywords: 'Python, ML, Analytics', goal: 'Hiring managers at FAANG' },
  { label: '🎯 Product Manager', role: 'Product Manager', keywords: 'Agile, Strategy, Growth', goal: 'Startup founders and VPs' },
  { label: '🎨 UX Designer', role: 'UX Designer', keywords: 'Figma, Research, Design Systems', goal: 'Design leads and agencies' },
]

export default function ai_linkedin_headline_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const { output, status, streaming, generate, stop } = useAIStream()
  const [role, setRole] = useState('')
  const [tone, setTone] = useState('Professional')
  const [keywords, setKeywords] = useState('')
  const [goal, setGoal] = useState('')
  const [about, setAbout] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = useCallback(() => {
    if (!role.trim()) return

    const prompt = `Create 12 LinkedIn headline options.

Role: ${role.trim() || 'Professional'}
Tone: ${tone}
Keywords: ${keywords.trim() || 'Not specified'}
Target audience: ${goal.trim() || 'General recruiters and clients'}
Background: ${about.trim() || 'No extra background provided'}

Requirements:
- Keep each headline under 220 characters.
- Make them sound credible, modern and useful for search discovery.
- Vary between recruiter-friendly, client-facing and authority-building angles.
- Output as a numbered list only.
- Do not use emoji.
- Avoid generic hype like ninja, guru, rockstar, best-in-class.`

    generate({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      systemPrompt: 'You write concise, high-quality LinkedIn profile headlines.',
    })
    jumpTo()
  }, [role, tone, keywords, goal, about, generate, jumpTo])

  const applyPreset = (preset) => {
    setRole(preset.role)
    setKeywords(preset.keywords)
    setGoal(preset.goal)
  }

  const copy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    })
  }

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"
  const selectClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="AI LinkedIn Headline Generator"
      desc="Generate 12 professional LinkedIn headline options tailored to your role, tone, and keywords. Stand out in recruiter searches."
      icon="💼" iconBg="rgba(14,165,233,0.08)"
      category="ai" slug="ai-linkedin-headline-generator"
      faq={[
        { q: "How many headlines do I get?", a: "12 unique headline options varying between recruiter-friendly, client-facing, and authority-building angles." },
        { q: "Can I customize the tone?", a: "Yes, choose from Professional, Casual, Bold, Creative, or Authoritative." },
      ]}
      howItWorks={[
        "Enter your role and optionally add keywords, target audience, and background.",
        "Choose a tone that matches your personal brand.",
        "Click Generate to get 12 AI-crafted headline options.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI LinkedIn Headline Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/ai-linkedin-headline-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Presets */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <label className="block text-sm font-semibold text-slate-300 mb-3">Quick Presets</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p, i) => (
              <button key={i} onClick={() => applyPreset(p)}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white/[0.04] text-slate-500 border border-white/[0.08] hover:text-white hover:border-white/20 transition-all">
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Your Role / Title *</label>
            <input type="text" value={role} onChange={e => setRole(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className={inputClass}
              onKeyDown={e => { if (e.key === 'Enter') handleGenerate() }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Tone</label>
              <select value={tone} onChange={e => setTone(e.target.value)} className={selectClass}>
                <option>Professional</option><option>Casual</option><option>Bold</option>
                <option>Creative</option><option>Authoritative</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Target Audience</label>
              <input type="text" value={goal} onChange={e => setGoal(e.target.value)}
                placeholder="e.g. Tech recruiters, CTOs"
                className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Keywords / Skills</label>
            <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)}
              placeholder="e.g. React, Node.js, Cloud Architecture"
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">About / Background</label>
            <textarea value={about} onChange={e => setAbout(e.target.value)} rows={3}
              placeholder="e.g. 8 years building scalable SaaS products..."
              className={inputClass + ' resize-none'} />
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
            <button onClick={handleGenerate} disabled={!role.trim()}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}>
              💼 Generate Headlines
            </button>
          )}
          <button onClick={copy} disabled={!output}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all disabled:opacity-40 ${copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'}`}>
            {copied ? '✓ Copied' : '📋 Copy'}
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
              <div className="text-4xl mb-3 opacity-20">💼</div>
              <p className="text-sm text-slate-600 font-medium">Your headline options will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
