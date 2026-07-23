import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const STYLES = {
  cool: { label: '😎 Cool', prefixes: ['xX', 'The', 'Real', 'Official', 'King', 'Queen', 'Mr', 'Ms', 'Lil', 'Big'], suffixes: ['Xx', 'Official', 'Real', 'Pro', 'Boss', 'King', 'Queen', 'Legend', 'Star', 'Vibe'] },
  aesthetic: { label: '✨ Aesthetic', prefixes: ['Moon', 'Star', 'Cloud', 'Dream', 'Angel', 'Fairy', 'Soft', 'Sweet', 'Pure', 'Lovely'], suffixes: ['Vibes', 'Dreams', 'Clouds', 'Stars', 'Moon', 'Glow', 'Soft', 'Aura', 'Soul', 'Heart'] },
  funny: { label: '😂 Funny', prefixes: ['Silly', 'Crazy', 'Wacky', 'Goofy', 'Derp', 'Meme', 'Lol', 'Epic', 'Dank', 'Yeet'], suffixes: ['Lol', 'Haha', 'Memes', 'Vibes', 'Mode', 'Energy', 'Chaos', 'Mood', 'Life', 'Gang'] },
  gamer: { label: '🎮 Gamer', prefixes: ['Pro', 'Epic', 'Ninja', 'Legend', 'Master', 'Elite', 'Savage', 'Toxic', 'Noob', 'GG'], suffixes: ['Gaming', 'Plays', 'Pro', 'YT', 'TTV', 'GG', 'FTW', 'Wins', 'Clutch', 'Ace'] },
  simple: { label: '📝 Simple', prefixes: ['Just', 'Its', 'Im', 'Hey', 'Hi', 'The', 'A', 'My', 'Your', 'Our'], suffixes: ['123', '456', '789', '2025', '24', '99', '007', '21', '13', '777'] },
}

export default function snapchat_username_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [name, setName] = useState('')
  const [style, setStyle] = useState('cool')
  const [usernames, setUsernames] = useState([])
  const [copied, setCopied] = useState('')

  const generate = useCallback(() => {
    const base = (name.trim() || 'Snap').replace(/[^a-zA-Z0-9]/g, '')
    const pre = STYLES[style].prefixes
    const suf = STYLES[style].suffixes
    const result = []

    for (let i = 0; i < 4; i++) {
      result.push(pre[i] + base)
      result.push(base + suf[i])
      result.push(pre[i] + base + suf[i])
    }
    result.push(base + Math.floor(Math.random() * 1000))
    result.push(base + '_' + Math.floor(Math.random() * 100))
    result.push(base + '.' + Math.floor(Math.random() * 100))

    const unique = [...new Set(result.map(u => u.substring(0, 15)))].slice(0, 12)
    setUsernames(unique)
  }, [name, style])

  const copyUsername = useCallback((username) => {
    navigator.clipboard.writeText(username).then(() => {
      setCopied(username)
      setTimeout(() => setCopied(''), 2000)
    })
  }, [])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Snapchat Username Generator"
      desc="Generate unique and cool Snapchat usernames instantly."
      icon="👻" iconBg="rgba(255,252,0,0.08)"
      category="social" slug="snapchat-username-generator"
      faq={[
        { q: "What makes a good Snapchat username?", a: "A good Snapchat username is unique, easy to remember, reflects your personality, not too long (15 characters or less), and doesn't contain offensive content." },
        { q: "Can I change my Snapchat username?", a: "Yes! Snapchat now allows you to change your username once per year. Go to Settings > Username > Change Username." },
        { q: "What characters are allowed?", a: "Snapchat usernames can contain letters (a-z), numbers (0-9), periods (.), underscores (_), and hyphens (-). They must be 3-15 characters long." },
      ]}
      howItWorks={[
        "Enter your name or keyword.",
        "Choose a username style (Cool, Aesthetic, Funny, Gamer, Simple).",
        "Click Generate and tap any username to copy it.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Snapchat Username Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/snapchat-username-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Your Name or Keyword</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g., Alex, Cool, Gamer" maxLength={15} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Username Style</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(STYLES).map(([key, val]) => (
              <button key={key} onClick={() => setStyle(key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  style === key
                    ? 'bg-yellow-400 text-black'
                    : 'bg-white/[0.06] border border-white/8 text-slate-300 hover:border-white/15'
                }`}>
                {val.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => { generate(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-all duration-200 active:scale-[0.98]">
          Generate Usernames
        </button>

        {usernames.length > 0 && (
          <div ref={resultRef} className="rounded-3xl border-2 border-yellow-500/15 bg-gradient-to-br from-yellow-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">Your Usernames</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Click any username to copy it</p>
            <div className="grid grid-cols-2 gap-2">
              {usernames.map((u, i) => (
                <button key={i} onClick={() => copyUsername(u)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${
                    copied === u
                      ? 'border-yellow-400/40 bg-yellow-400/10'
                      : 'border-white/5 bg-white/[0.03] hover:border-white/15'
                  }`}>
                  <span className="text-sm font-mono font-semibold text-white truncate">{u}</span>
                  <span className="text-[10px] text-slate-500 ml-2 shrink-0">
                    {copied === u ? '✅ Copied' : 'Copy'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {usernames.length === 0 && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">👻</div>
            <p className="text-sm text-slate-600 font-medium">Enter a name and click Generate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
