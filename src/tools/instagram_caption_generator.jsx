import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function generateCaptions(topic, tone, emojis, length, hashtags) {
  const tones = {
    professional: { greet: '', style: 'clean', tags: ['#business', '#professional', '#success'] },
    casual: { greet: 'Hey! 👋', style: 'friendly', tags: ['#vibes', '#goodtimes', '#life'] },
    funny: { greet: '', style: 'humorous', tags: ['#lol', '#funny', '#memes'] },
    motivational: { greet: '', style: 'inspiring', tags: ['#motivation', '#inspiration', '#hustle'] },
    aesthetic: { greet: '', style: 'artsy', tags: ['#aesthetic', '#mood', '#vibes'] },
  }
  const t = tones[tone] || tones.professional
  const tagStr = hashtags ? hashtags.split(',').map(h => h.trim().startsWith('#') ? h.trim() : '#' + h.trim()).join(' ') : t.tags.join(' ')
  const emojiStr = emojis ? emojis : '✨'
  const captions = []

  const shortCap = `${emojiStr} ${topic} ${emojiStr}\n\n${t.greet ? t.greet + '\n' : ''}${tagStr}`
  captions.push({ text: shortCap, label: 'Short & Sweet' })

  const medCap = `${emojiStr} ${topic} ${emojiStr}\n\n${t.greet ? t.greet + '\n\n' : ''}Loving every moment of this! Who else can relate?\n\nDrop a ${emojiStr} if you agree!\n\n${tagStr}`
  captions.push({ text: medCap, label: 'Engaging' })

  const longCap = `${emojiStr} ${topic} ${emojiStr}\n\n${t.greet ? t.greet + '\n\n' : ''}There's something special about this that I just had to share. It's been an incredible journey and I'm grateful for every step.\n\nWhat are your thoughts? Let me know in the comments below! 👇\n\n${tagStr}`
  captions.push({ text: longCap, label: 'Storytelling' })

  const questionCap = `${emojiStr} ${topic} ${emojiStr}\n\nQuick question: What's your favorite thing about this? 🤔\n\nTell me below! ⬇️\n\n${tagStr}`
  captions.push({ text: questionCap, label: 'Question-Based' })

  const listCap = `${emojiStr} ${topic} - Top 3 things to know:\n\n1️⃣ It's amazing\n2️⃣ You'll love it\n3️⃣ Try it yourself\n\n${tagStr}`
  captions.push({ text: listCap, label: 'List Format' })

  return captions
}

export default function InstagramCaptionGenerator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('professional')
  const [emojis, setEmojis] = useState('✨')
  const [hashtags, setHashtags] = useState('')
  const [captions, setCaptions] = useState([])
  const [copiedIdx, setCopiedIdx] = useState(null)

  const generate = useCallback(() => {
    if (!topic.trim()) return
    const result = generateCaptions(topic, tone, emojis, 'medium', hashtags)
    setCaptions(result)
    jumpTo()
  }, [topic, tone, emojis, hashtags, jumpTo])

  const copyCaption = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1500)
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Caption Generator"
      desc="Generate engaging captions for your Instagram posts. Multiple styles and tones available."
      icon="💬" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="instagram-caption-generator"
      faq={[
        { q: "How long should Instagram captions be?", a: "Captions can be up to 2,200 characters. For best engagement, 138-150 characters is ideal." },
        { q: "Should I use emojis?", a: "Yes! Posts with emojis get 30% more engagement on average." },
      ]}
      howItWorks={[
        "Enter your post topic or theme.",
        "Select a tone and optional emojis/hashtags.",
        "Click Generate to get 5 caption variations.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Caption Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/instagram-caption-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Post Topic/Theme:</label>
              <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
                placeholder="e.g., My morning workout routine"
                onKeyDown={e => e.key === 'Enter' && generate()}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Tone:</label>
              <select value={tone} onChange={e => setTone(e.target.value)} className={inputClass}>
                <option value="professional">💼 Professional</option>
                <option value="casual">😊 Casual</option>
                <option value="funny">😄 Funny</option>
                <option value="motivational">💪 Motivational</option>
                <option value="aesthetic">🎨 Aesthetic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Emojis (optional):</label>
              <input type="text" value={emojis} onChange={e => setEmojis(e.target.value)}
                placeholder="e.g., 🔥💪✨" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Hashtags (comma separated, optional):</label>
              <input type="text" value={hashtags} onChange={e => setHashtags(e.target.value)}
                placeholder="e.g., fitness, workout, motivation" className={inputClass} />
            </div>
            <button onClick={generate}
              className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
              Generate Captions 💬
            </button>
          </div>

          <div>
            <h3 className="text-sm font-bold text-indigo-400 mb-3">Generated Captions</h3>
            {captions.length > 0 ? (
              <div ref={resultRef} className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {captions.map((cap, i) => (
                  <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-indigo-400">{cap.label}</span>
                      <span className="text-xs text-slate-500">{cap.text.length} chars</span>
                    </div>
                    <div className="whitespace-pre-line text-sm text-slate-300 bg-white/[0.03] rounded-xl p-3 mb-3">{cap.text}</div>
                    <button onClick={() => copyCaption(cap.text, i)}
                      className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-semibold hover:bg-indigo-500/20 transition-all">
                      {copiedIdx === i ? '✓ Copied' : '📋 Copy'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div ref={resultRef} className="text-center py-16 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
                <div className="text-4xl mb-3 opacity-20">💬</div>
                <p className="text-sm text-slate-600 font-medium">Enter a topic and click Generate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
