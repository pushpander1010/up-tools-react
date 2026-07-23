import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const emojiDict = {
  love: '❤️', like: '👍', happy: '😊', sad: '😢', angry: '😠', laugh: '😂',
  pizza: '🍕', burger: '🍔', coffee: '☕', beer: '🍺', wine: '🍷', cake: '🎂',
  car: '🚗', plane: '✈️', train: '🚂', bike: '🚲', bus: '🚌',
  sun: '☀️', moon: '🌙', star: '⭐', fire: '🔥', water: '💧',
  dog: '🐕', cat: '🐱', bird: '🐦', fish: '🐟',
  home: '🏠', work: '💼', school: '🏫', hospital: '🏥',
  phone: '📱', computer: '💻', camera: '📷', music: '🎵',
  money: '💰', gift: '🎁', party: '🎉', birthday: '🎂',
  good: '👍', bad: '👎', yes: '✅', no: '❌',
  strong: '💪', smart: '🧠', cool: '😎', hot: '🔥'
}

const popularEmojis = ['😊','❤️','👍','🎉','🔥','💯','🚀','⭐','💪','🙏','😂','🎂']

export default function whatsapp_emoji_translator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('I love pizza and coffee')
  const [copied, setCopied] = useState(false)

  const translated = useMemo(() => {
    const words = input.toLowerCase().split(/\s+/)
    return words.map(w => {
      const clean = w.replace(/[^\w]/g, '')
      return emojiDict[clean] || w
    }).join(' ')
  }, [input])

  const copyEmojis = () => {
    navigator.clipboard.writeText(translated).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const addEmoji = (emoji) => {
    setInput(prev => prev ? prev + ' ' + emoji : emoji)
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="WhatsApp Emoji Translator"
      desc="Convert your text to emojis! Make your WhatsApp messages more fun and expressive."
      icon="😊" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-emoji-translator"
      faq={[
        { q: "How do I translate text to emojis?", a: "Type your text in the input box and the tool will automatically convert words to matching emojis. Copy and paste into WhatsApp." },
        { q: "Can I use emoji translations in WhatsApp?", a: "Yes! All emojis work in WhatsApp on Android, iOS, and WhatsApp Web." },
        { q: "Are emoji translations accurate?", a: "The tool uses a dictionary of common words and their emoji equivalents. Some words may have multiple emoji options." },
      ]}
      howItWorks={[
        "Type your message in the input field.",
        "Words are automatically converted to matching emojis.",
        "Click the Copy button to copy the emoji text to your clipboard.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Emoji Translator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-emoji-translator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Enter Text</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Type your message here..."
            rows={3}
            className={inputClass + " resize-vertical"} />
        </div>

        <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Emoji Translation</h3>
          </div>
          <div className="text-2xl font-bold text-white leading-relaxed mb-4 break-words">{translated}</div>
          <button onClick={() => { copyEmojis(); jumpTo() }}
            className={`w-full py-3 rounded-2xl text-sm font-bold transition-all ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-indigo-500 text-white hover:bg-indigo-400 active:scale-[0.98]'
            }`}>
            {copied ? '✓ Copied!' : '📋 Copy Emojis'}
          </button>
        </div>

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">🎯 Popular Emojis</h3>
          <div className="flex flex-wrap gap-2">
            {popularEmojis.map(emoji => (
              <button key={emoji} onClick={() => addEmoji(emoji)}
                className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/8 hover:border-indigo-500/40 text-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95">
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
