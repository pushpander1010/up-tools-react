import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function createBioVariations(name, profession, interests, tone, website, additional, customHashtags) {
  const bios = []
  const emojis = {
    professional: ['💼', '🎯', '📈', '✨', '🚀', '💡'],
    casual: ['😊', '🌟', '💫', '🎉', '🔥', '✨'],
    creative: ['🎨', '✨', '🌈', '💡', '🎭', '🦋'],
    motivational: ['💪', '🌟', '🚀', '⚡', '🔥', '✨'],
    minimalist: ['—', '|', '·', '→', '→', '→'],
    funny: ['😄', '🤣', '😎', '🤪', '🎉', '✨']
  }
  const selectedEmojis = emojis[tone] || emojis.professional
  const interestList = interests ? interests.split(',').map(i => i.trim()).filter(i => i) : []

  const hashtags = (() => {
    let tags = []
    if (customHashtags) tags = customHashtags.split(',').map(t => t.trim()).filter(t => t)
    if (profession) tags.push(profession.toLowerCase().replace(/\s+/g, ''))
    if (interestList.length > 0) interestList.slice(0, 2).forEach(i => tags.push(i.toLowerCase().replace(/\s+/g, '')))
    return tags.slice(0, 3)
  })()
  const hashtagStr = hashtags.length > 0 ? '\n' + hashtags.map(t => '#' + t).join(' ') : ''

  // Bio 1: Professional & Clean
  let bio1 = ''
  if (name) bio1 += `${selectedEmojis[0]} ${name}\n`
  if (profession) bio1 += `${profession}\n`
  if (interestList.length > 0) bio1 += interestList.slice(0, 3).join(' • ') + '\n'
  if (additional) bio1 += `${additional}\n`
  if (website) bio1 += `👇 ${website}`
  if (hashtagStr) bio1 += hashtagStr
  if (bio1.trim()) bios.push({ text: bio1.trim(), label: 'Professional & Clean' })

  // Bio 2: Emoji-Rich & Engaging
  let bio2 = ''
  if (name) bio2 += `${selectedEmojis[1]} ${name} ${selectedEmojis[2]}\n`
  if (profession) bio2 += `${selectedEmojis[0]} ${profession}\n`
  if (interestList.length > 0) {
    bio2 += interestList.slice(0, 3).map((i, idx) => `${selectedEmojis[(idx + 3) % selectedEmojis.length]} ${i}`).join('\n') + '\n'
  }
  if (additional) bio2 += `${additional}\n`
  if (website) bio2 += `🔗 ${website}`
  if (hashtagStr) bio2 += hashtagStr
  if (bio2.trim()) bios.push({ text: bio2.trim(), label: 'Emoji-Rich & Engaging' })

  // Bio 3: One-liner
  const parts = []
  if (name) parts.push(name)
  if (profession) parts.push(profession)
  if (interestList.length > 0) parts.push(interestList[0])
  let bio3 = parts.join(' | ') + ` ${selectedEmojis[3]}`
  if (additional) bio3 += `\n${additional}`
  if (website) bio3 += `\n${website}`
  if (hashtagStr) bio3 += hashtagStr
  if (bio3.trim()) bios.push({ text: bio3.trim(), label: 'One-liner Style' })

  // Bio 4: Minimalist & Artsy
  let bio4 = ''
  if (profession) bio4 += `${profession}`
  if (name) bio4 += bio4 ? `\n${name}` : name
  if (interestList.length > 0) bio4 += `\n${selectedEmojis[4]} ${interestList.slice(0, 2).join(' · ')}`
  if (website) bio4 += `\n🔗 ${website}`
  if (hashtagStr) bio4 += hashtagStr
  if (bio4.trim()) bios.push({ text: bio4.trim(), label: 'Minimalist & Artsy' })

  // Bio 5: Story-Telling
  let bio5 = ''
  if (name) bio5 += `Hey, I'm ${name} 👋\n`
  if (profession) bio5 += `${selectedEmojis[0]} ${profession}\n`
  if (interestList.length > 0) bio5 += `Passionate about ${interestList.slice(0, 2).join(' and ')}\n`
  if (additional) bio5 += `${additional}\n`
  if (website) bio5 += `Check out my work 👇\n${website}`
  if (hashtagStr) bio5 += hashtagStr
  if (bio5.trim()) bios.push({ text: bio5.trim(), label: 'Story-Telling' })

  // Bio 6: CTA Focused
  let bio6 = ''
  if (profession) bio6 += `${selectedEmojis[5]} ${profession}\n`
  if (name) bio6 += `${name}\n`
  if (interestList.length > 0) bio6 += `${interestList.slice(0, 2).join(' | ')}\n`
  if (website) bio6 += `🌐 ${website}\n`
  bio6 += `💬 DM for collabs`
  if (hashtagStr) bio6 += hashtagStr
  if (bio6.trim()) bios.push({ text: bio6.trim(), label: 'CTA Focused' })

  return bios.filter(bio => bio.text.length > 0)
}

export default function InstagramBioGenerator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [name, setName] = useState('')
  const [profession, setProfession] = useState('')
  const [interests, setInterests] = useState('')
  const [tone, setTone] = useState('professional')
  const [website, setWebsite] = useState('')
  const [additional, setAdditional] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [bios, setBios] = useState([])
  const [copiedIdx, setCopiedIdx] = useState(null)

  const generate = useCallback(() => {
    if (!name.trim() && !profession.trim()) return
    const result = createBioVariations(name, profession, interests, tone, website, additional, hashtags)
    setBios(result)
    jumpTo()
  }, [name, profession, interests, tone, website, additional, hashtags, jumpTo])

  const copyBio = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1500)
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-pink-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Bio Generator"
      desc="Create engaging and creative Instagram bios with AI. Get multiple variations tailored to your style."
      icon="📝" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="instagram-bio-generator"
      faq={[
        { q: "How many characters can an Instagram bio have?", a: "Instagram bios are limited to 150 characters." },
        { q: "Can I customize the tone?", a: "Yes! Choose from professional, casual, creative, motivational, minimalist, or funny tones." },
      ]}
      howItWorks={[
        "Enter your name, profession, and interests.",
        "Select a tone and add optional details.",
        "Click Generate to see 6 different bio variations.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Bio Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/instagram-bio-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Name:</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Your name" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Profession/Title:</label>
              <input type="text" value={profession} onChange={e => setProfession(e.target.value)}
                placeholder="e.g., Photographer, Fitness Coach" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Interests (comma separated):</label>
              <textarea value={interests} onChange={e => setInterests(e.target.value)}
                placeholder="e.g., travel, food, photography" rows={2} className={inputClass + " resize-none"} />
              <div className="text-xs text-slate-500 mt-1">{interests.length} characters</div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Tone:</label>
              <select value={tone} onChange={e => setTone(e.target.value)} className={inputClass}>
                <option value="professional">💼 Professional</option>
                <option value="casual">😊 Casual</option>
                <option value="creative">🎨 Creative</option>
                <option value="motivational">💪 Motivational</option>
                <option value="minimally">— Minimalist</option>
                <option value="funny">😄 Funny</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Website/Link:</label>
              <input type="text" value={website} onChange={e => setWebsite(e.target.value)}
                placeholder="yoursite.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Additional Info:</label>
              <input type="text" value={additional} onChange={e => setAdditional(e.target.value)}
                placeholder="e.g., DM for collabs" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Custom Hashtags (comma separated):</label>
              <input type="text" value={hashtags} onChange={e => setHashtags(e.target.value)}
                placeholder="e.g., photography, travel" className={inputClass} />
            </div>
            <button onClick={generate}
              className="w-full py-4 rounded-2xl bg-pink-500 text-white font-bold text-sm hover:bg-pink-400 transition-all duration-200 active:scale-[0.98]">
              Generate Bios ✨
            </button>
          </div>

          {/* Right: Results */}
          <div>
            <h3 className="text-sm font-bold text-pink-400 mb-3">Generated Bios</h3>
            {bios.length > 0 ? (
              <div ref={resultRef} className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {bios.map((bio, i) => (
                  <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-pink-400">{bio.label}</span>
                      <span className="text-xs text-slate-500">{bio.text.length} chars</span>
                    </div>
                    <div className="whitespace-pre-line text-sm text-slate-300 bg-white/[0.03] rounded-xl p-3 mb-3">{bio.text}</div>
                    <button onClick={() => copyBio(bio.text, i)}
                      className="px-4 py-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300 text-sm font-semibold hover:bg-pink-500/20 transition-all">
                      {copiedIdx === i ? '✓ Copied' : '📋 Copy Bio'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div ref={resultRef} className="text-center py-16 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
                <div className="text-4xl mb-3 opacity-20">📝</div>
                <p className="text-sm text-slate-600 font-medium">Fill in the form and click Generate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
