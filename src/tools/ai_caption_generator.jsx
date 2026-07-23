import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import useAIStream from '../hooks/useAIStream'

const PLATFORMS = ['Instagram', 'Facebook', 'LinkedIn', 'Twitter/X']

export default function ai_caption_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const { output, status, streaming, generate, stop } = useAIStream()
  const [copied, setCopied] = useState(false)

  const [platform, setPlatform] = useState('Instagram')
  const [description, setDescription] = useState('')
  const [vibe, setVibe] = useState('casual')
  const [hashtags, setHashtags] = useState('yes')

  const handleGenerate = useCallback(() => {
    if (!description.trim()) return

    const charLimit = platform === 'Twitter/X' ? '280 characters max' : platform === 'LinkedIn' ? '1300 characters max' : '2200 characters max'
    const prompt = `Generate 5 unique ${vibe} ${platform} captions for this post:

Post description: ${description}
Platform: ${platform} (${charLimit})
Tone: ${vibe}
${hashtags === 'yes' ? 'Include 5–15 relevant hashtags at the end of each caption.' : 'No hashtags, captions only.'}

Use emojis naturally. Make each caption distinct in style and approach.

Format:
Caption 1:
[caption text]

Caption 2:
[caption text]
(and so on for all 5)`

    generate({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      systemPrompt: 'You are a social media expert who writes viral, engaging captions that drive likes, comments, and shares.',
    })
    jumpTo()
  }, [description, platform, vibe, hashtags, generate, jumpTo])

  const copy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"
  const selectClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="AI Caption Generator"
      desc="Generate engaging social media captions for Instagram, Facebook, LinkedIn and Twitter with AI."
      icon="📸" iconBg="rgba(236,72,153,0.08)"
      category="ai" slug="ai-caption-generator"
      faq={[
        { q: "How many captions are generated?", a: "5 unique captions per generation, each with a different style and approach." },
        { q: "Can I customize the tone?", a: "Yes, choose from casual, professional, funny, inspiring, or promotional vibes." },
      ]}
      howItWorks={[
        "Select your platform and describe your post.",
        "Choose a vibe/tone and whether to include hashtags.",
        "Click Generate to get 5 ready-to-post captions.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI Caption Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/ai-caption-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Platform</label>
            <div className="flex gap-2 flex-wrap">
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setPlatform(p)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${platform === p ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' : 'bg-white/[0.06] text-slate-500 border-white/[0.08]'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Describe your photo or post *</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              placeholder="e.g. A sunset photo from my trip to Bali with palm trees"
              className={inputClass + ' resize-none'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Vibe</label>
              <select value={vibe} onChange={e => setVibe(e.target.value)} className={selectClass}>
                {['casual', 'professional', 'funny', 'inspiring', 'promotional', 'minimalist'].map(v => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Hashtags</label>
              <select value={hashtags} onChange={e => setHashtags(e.target.value)} className={selectClass}>
                <option value="yes">Include hashtags</option>
                <option value="no">No hashtags</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {streaming ? (
            <button onClick={stop} className="flex-1 px-6 py-3 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all">⏹ Stop</button>
          ) : (
            <button onClick={handleGenerate} disabled={!description.trim()}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>✨ Generate Captions</button>
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
              <div className="text-4xl mb-3 opacity-20">📸</div>
              <p className="text-sm text-slate-600 font-medium">Describe your post and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
