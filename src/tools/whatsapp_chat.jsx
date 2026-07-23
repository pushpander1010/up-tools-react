import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const countryCodes = [
  { code: '91', flag: '🇮🇳', label: 'India' },
  { code: '1', flag: '🇺🇸', label: 'USA' },
  { code: '44', flag: '🇬🇧', label: 'UK' },
  { code: '971', flag: '🇦🇪', label: 'UAE' },
  { code: '61', flag: '🇦🇺', label: 'Australia' },
  { code: '81', flag: '🇯🇵', label: 'Japan' },
  { code: '49', flag: '🇩🇪', label: 'Germany' },
  { code: '33', flag: '🇫🇷', label: 'France' },
  { code: '55', flag: '🇧🇷', label: 'Brazil' },
  { code: '86', flag: '🇨🇳', label: 'China' },
]

export default function whatsapp_chat() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [country, setCountry] = useState('91')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = useCallback(() => {
    const num = phone.replace(/\D/g, '')
    if (!num) return
    const fullNum = country + num
    let url = `https://wa.me/${fullNum}`
    if (message.trim()) url += `?text=${encodeURIComponent(message.trim())}`
    setGeneratedLink(url)
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      jumpTo()
    }, 100)
  }, [country, phone, message])

  const copyLink = () => {
    navigator.clipboard?.writeText(generatedLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const shareLink = () => {
    if (navigator.share) navigator.share({ title: 'WhatsApp Link', url: generatedLink })
    else copyLink()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="WhatsApp Click-to-Chat"
      desc="Send a WhatsApp message by just entering the phone number and text. Copy link, generate QR, and share."
      icon="💬" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-chat"
      faq={[
        { q: "How does WhatsApp click to chat work?", a: "You create a wa.me link that contains the phone number and optional message. Opening that link launches WhatsApp on mobile or Web WhatsApp on desktop." },
        { q: "Do I need to save the number first?", a: "No. Click-to-chat opens a conversation without saving the contact." },
        { q: "What phone number format should I use?", a: "Digits only: country code + number. Do not include +, spaces, or leading zeros." },
      ]}
      howItWorks={[
        "Choose country code and enter digits-only phone number.",
        "Add an optional message.",
        "Click Send on WhatsApp to open the chat instantly.",
        "Use Copy, Share, or QR for quick reuse.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Click-to-Chat", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-chat/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Country</label>
          <select value={country} onChange={e => setCountry(e.target.value)}
            className={inputClass + " appearance-none"}>
            {countryCodes.map(c => (
              <option key={c.code} value={c.code} className="bg-gray-900">{c.flag} {c.label} (+{c.code})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Phone number (digits only)</label>
          <input type="tel" inputMode="numeric" value={phone} onChange={e => setPhone(e.target.value)}
            placeholder="e.g., 9876543210"
            className={inputClass} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Message (optional)</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Hi! I found you via UpTools WhatsApp click to chat."
            rows={3} className={inputClass + " resize-vertical"} />
        </div>

        <div className="flex gap-3 flex-wrap">
          <button onClick={() => { generate(); jumpTo() }}
            className="flex-1 py-3.5 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98]">
            Send on WhatsApp
          </button>
          <button onClick={copyLink}
            className="px-5 py-3.5 rounded-2xl bg-white/[0.06] border border-white/8 text-slate-400 font-bold text-sm hover:text-white transition-all">
            Copy Link
          </button>
          <button onClick={shareLink}
            className="px-5 py-3.5 rounded-2xl bg-white/[0.06] border border-white/8 text-slate-400 font-bold text-sm hover:text-white transition-all">
            Share
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Tip: For India, use <b>91</b> + 10-digit number. Do not include <code>+</code>, spaces, or leading zeros.
        </p>

        {generatedLink && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Generated Link</h3>
            </div>

            <div className="bg-white/[0.06] rounded-xl p-4 mb-4 flex items-center gap-3">
              <code className="text-sm text-emerald-300 font-mono break-all flex-1">{generatedLink}</code>
              <a href={generatedLink} target="_blank" rel="noopener"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500 text-white hover:bg-indigo-400 transition-all shrink-0">
                Open
              </a>
            </div>

            <div className="flex gap-2 mb-6">
              <button onClick={copyLink}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-500 text-white hover:bg-indigo-400'
                }`}>
                {copied ? '✓ Copied' : '📋 Copy Link'}
              </button>
              <button onClick={shareLink}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 text-xs font-bold hover:text-white transition-all">
                🔗 Share
              </button>
            </div>

            <div className="flex justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(generatedLink)}&bgcolor=ffffff&color=000000&margin=10`}
                alt="WhatsApp link QR code" width={160} height={160}
                className="rounded-xl border border-white/10" />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
