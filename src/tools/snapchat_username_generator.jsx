import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const PREFIXES = {
  cool: ['xX', 'The', 'Real', 'Official', 'King', 'Queen', 'Mr', 'Ms', 'Lil', 'Big'],
  aesthetic: ['Moon', 'Star', 'Cloud', 'Dream', 'Angel', 'Fairy', 'Soft', 'Sweet', 'Pure', 'Lovely'],
  funny: ['Silly', 'Crazy', 'Wacky', 'Goofy', 'Derp', 'Meme', 'Lol', 'Epic', 'Dank', 'Yeet'],
  gamer: ['Pro', 'Epic', 'Ninja', 'Legend', 'Master', 'Elite', 'Savage', 'Toxic', 'Noob', 'GG'],
  simple: ['Just', 'Its', 'Im', 'Hey', 'Hi', 'The', 'A', 'My', 'Your', 'Our'],
}

const SUFFIXES = {
  cool: ['Xx', 'Official', 'Real', 'Pro', 'Boss', 'King', 'Queen', 'Legend', 'Star', 'Vibe'],
  aesthetic: ['Vibes', 'Dreams', 'Clouds', 'Stars', 'Moon', 'Glow', 'Soft', 'Aura', 'Soul', 'Heart'],
  funny: ['Lol', 'Haha', 'Memes', 'Vibes', 'Mode', 'Energy', 'Chaos', 'Mood', 'Life', 'Gang'],
  gamer: ['Gaming', 'Plays', 'Pro', 'YT', 'TTV', 'GG', 'FTW', 'Wins', 'Clutch', 'Ace'],
  simple: ['123', '456', '789', '2025', '24', '99', '007', '21', '13', '777'],
}

export default function snapchat_username_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [name, setName] = useState('')
  const [style, setStyle] = useState('cool')
  const [usernames, setUsernames] = useState([])
  const [copied, setCopied] = useState(null)

  const styles = [
    { id: 'cool', icon: '😎', label: 'Cool' },
    { id: 'aesthetic', icon: '✨', label: 'Aesthetic' },
    { id: 'funny', icon: '😂', label: 'Funny' },
    { id: 'gamer', icon: '🎮', label: 'Gamer' },
    { id: 'simple', icon: '📝', label: 'Simple' },
  ]

  const generate = useCallback(() => {
    const input = name.trim() || 'Snap'
    const base = input.replace(/[^a-zA-Z0-9]/g, '')
    const pre = PREFIXES[style]
    const suf = SUFFIXES[style]
    const result = []

    for (let i = 0; i < 4; i++) {
      result.push(pre[i] + base)
      result.push(base + suf[i])
      result.push(pre[i] + base + suf[i])
    }
    result.push(base + Math.floor(Math.random() * 1000))
    result.push(base + '_' + Math.floor(Math.random() * 100))
    result.push(base + '.' + Math.floor(Math.random() * 100))

    const unique = result.map(u => u.substring(0, 15)).filter((u, i, arr) => arr.indexOf(u) === i).slice(0, 12)
    setUsernames(unique)
    setCopied(null)
    jumpTo()
  }, [name, style, jumpTo])

  const copyUsername = useCallback(async (username) => {
    try { await navigator.clipboard.writeText(username) } catch {}
    setCopied(username)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Snapchat Username Generator"
      desc="Generate unique and cool Snapchat usernames instantly. Perfect for your Snap profile!"
      icon="👻" iconBg="rgba(255,252,0,0.08)"
      category="social" slug="snapchat-username-generator"
      faq={[
        { q: "What makes a good Snapchat username?", a: "A good Snapchat username is: unique, easy to remember, reflects your personality, not too long (15 characters or less), and doesn't contain offensive content." },
        { q: "Can I change my Snapchat username?", a: "Yes! Snapchat now allows you to change your username once per year. Go to Settings > Username > Change Username." },
        { q: "What characters are allowed?", a: "Snapchat usernames can contain letters (a-z), numbers (0-9), periods (.), underscores (_), and hyphens (-). They must be 3-15 characters long." },
      ]}
      howItWorks={[
        "Enter your name or a keyword for your username.",
        "Choose a style: Cool, Aesthetic, Funny, Gamer, or Simple.",
        "Click Generate to see unique username suggestions.",
        "Click any username to copy it to your clipboard.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Snapchat Username Generator", "applicationCategory": "UtilityApplication",
        "url": "https://www.uptools.in/snapchat-username-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Your Name or Keyword</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g., Alex, Cool, Gamer" maxLength={15}
              className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Username Style</label>
            <div className="flex gap-2">
              {styles.map(s => (
                <button key={s.id} onClick={() => setStyle(s.id)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border-2 ${
                    style === s.id
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                      : 'bg-white/[0.04] border-white/8 text-slate-500 hover:border-white/12'
                  }`}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={generate}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-sm hover:opacity-90 transition-all duration-200 active:scale-[0.98]">
          ✨ Generate Usernames
        </button>

        {usernames.length > 0 && (
          <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Your Snapchat Usernames</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">Click any username to copy it.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {usernames.map((u, i) => (
                <button key={i} onClick={() => copyUsername(u)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                    copied === u
                      ? 'bg-emerald-500/20 border-emerald-500/30'
                      : 'bg-black/20 border-white/8 hover:border-amber-500/30'
                  }`}>
                  <span className="text-sm font-mono font-semibold text-white">{u}</span>
                  <span className={`text-xs font-bold ${copied === u ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {copied === u ? '✅ Copied!' : '📋 Copy'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {usernames.length === 0 && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">👻</div>
            <p className="text-sm text-slate-600 font-medium">Enter your name and click Generate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
