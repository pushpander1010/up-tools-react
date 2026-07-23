import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import useAIStream from '../hooks/useAIStream'

const NICHES = ['Tech', 'Finance', 'Health', 'Education', 'Entertainment', 'Gaming', 'Cooking', 'Travel', 'Fitness', 'Business']

const WORD_MAP = { short: '500–700', medium: '1200–1600', long: '2000–2800' }

export default function ai_youtube_script() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const { output, status, streaming, generate, stop } = useAIStream()
  const [topic, setTopic] = useState('')
  const [niche, setNiche] = useState('')
  const [duration, setDuration] = useState('medium')
  const [style, setStyle] = useState('Educational')
  const [audience, setAudience] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = useCallback(() => {
    if (!topic.trim()) return

    const prompt = `Write a complete YouTube video script for: "${topic.trim()}"

Niche: ${niche || 'General'} | Style: ${style} | Duration: ${duration} (~${WORD_MAP[duration]} words)
${audience ? 'Target audience: ' + audience.trim() : ''}

Structure with clearly labeled sections:
[HOOK] (0–15s) — Attention-grabbing opening
[INTRO] (15–60s) — What the video covers and why to watch
[SECTION 1], [SECTION 2], etc. — Main content with [TRANSITION] lines between
[OUTRO & CTA] — Wrap up + like/subscribe/comment prompt

Include delivery notes in (parentheses) e.g. (pause), (show graphic), (cut to B-roll).
Use natural, conversational language. Add pattern interrupts for retention.`

    generate({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.75,
      systemPrompt: 'You are a professional YouTube scriptwriter who creates viral, retention-optimized video scripts. You understand pacing, hooks, and audience psychology.',
    })
    jumpTo()
  }, [topic, niche, duration, style, audience, generate, jumpTo])

  const copy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    })
  }

  const download = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'youtube-script.txt'
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"
  const selectClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="AI YouTube Script Writer"
      desc="Write complete, retention-optimized YouTube video scripts with hooks, sections, transitions, and CTAs. Just enter your topic."
      icon="🎬" iconBg="rgba(239,68,68,0.08)"
      category="ai" slug="ai-youtube-script"
      faq={[
        { q: "What format are the scripts in?", a: "Scripts include labeled sections [HOOK], [INTRO], [SECTIONS], [OUTRO & CTA] with delivery notes in parentheses." },
        { q: "How long are the scripts?", a: "Depends on your duration setting: Short (~500–700 words), Medium (~1200–1600), or Long (~2000–2800)." },
      ]}
      howItWorks={[
        "Enter your video topic and optionally select a niche.",
        "Choose duration, style, and target audience.",
        "Click Generate to stream a complete video script.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI YouTube Script Writer", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/ai-youtube-script/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Niche Pills */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <label className="block text-sm font-semibold text-slate-300 mb-3">Niche (optional)</label>
          <div className="flex flex-wrap gap-2">
            {NICHES.map(n => (
              <button key={n} onClick={() => setNiche(niche === n ? '' : n)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  niche === n
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-white/[0.04] text-slate-500 border border-white/[0.08] hover:text-white'
                }`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Video Topic *</label>
            <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="e.g. 10 AI tools that will replace your 9-to-5"
              className={inputClass}
              onKeyDown={e => { if (e.key === 'Enter') handleGenerate() }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Duration</label>
              <select value={duration} onChange={e => setDuration(e.target.value)} className={selectClass}>
                <option value="short">Short (~500–700 words)</option>
                <option value="medium">Medium (~1200–1600)</option>
                <option value="long">Long (~2000–2800)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Style</label>
              <select value={style} onChange={e => setStyle(e.target.value)} className={selectClass}>
                {['Educational', 'Entertainment', 'Tutorial', 'Review', 'Storytelling', 'News'].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Audience</label>
              <input type="text" value={audience} onChange={e => setAudience(e.target.value)}
                placeholder="e.g. Beginners, devs"
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
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              🎬 Write Script
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
              <div className="text-4xl mb-3 opacity-20">🎬</div>
              <p className="text-sm text-slate-600 font-medium">Your script will stream here…</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
