import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function whatsapp_dp_by_number() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [phone, setPhone] = useState('')
  const [result, setResult] = useState(null)

  const generateLink = () => {
    if (!phone.trim()) return
    const clean = phone.replace(/[^0-9+]/g, '')
    const waLink = clean.startsWith('+') ? `https://wa.me/${clean.slice(1)}` : `https://wa.me/${clean}`
    setResult({ phone: clean, link: waLink })
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  const methods = [
    { icon: '1️⃣', title: "Use the contact's WhatsApp link", desc: "Create their wa.me link and open it. Once the chat loads, tap their name → profile photo → save." },
    { icon: '2️⃣', title: 'Save from a saved contact', desc: "Add the number to your contacts, open the WhatsApp chat, tap the name, then tap the profile picture to view and save." },
    { icon: '3️⃣', title: 'Use WhatsApp DP Downloader', desc: "Paste their WhatsApp link into the DP Downloader to fetch the full-resolution image." },
  ]

  return (
    <ToolLayout
      title="WhatsApp DP by Number"
      desc="Learn the real ways to save a WhatsApp profile picture using a phone number. Honest guide with working methods."
      icon="📷" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-dp-by-number"
      faq={[
        { q: "Can I download a WhatsApp DP using only a phone number?", a: "No — WhatsApp does not expose profile pictures through a phone number via any public API. You need the contact saved or their WhatsApp link." },
        { q: "How do I save a WhatsApp profile picture in full size?", a: "Open the contact's chat, tap their name, then tap the profile photo to view it full-screen and use the save/share option." },
        { q: "Why can't I see someone's DP?", a: "The contact likely set their privacy to 'My Contacts' or 'Nobody', or they removed you." },
      ]}
      howItWorks={[
        "Enter the phone number below to generate a WhatsApp link.",
        "Open the link on your phone to start a chat.",
        "Tap the contact's name → tap the profile photo → save it.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp DP by Number", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-dp-by-number/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-300 font-semibold">⚠️ <b>Important:</b> WhatsApp does NOT let you pull a profile picture from a phone number alone. Any site claiming "enter number, get DP" is misleading.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Phone Number</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className={inputClass} />
        </div>

        <button onClick={generateLink}
          className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all duration-200 active:scale-[0.98]">
          Generate WhatsApp Link
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">WhatsApp Link</h3>
            </div>
            <p className="text-sm text-slate-400 mb-3">Open this link on your phone, then tap the contact's name → profile photo → save.</p>
            <a href={result.link} target="_blank" rel="noopener noreferrer"
              className="block text-sm font-mono text-emerald-300 bg-white/[0.06] rounded-xl p-3 break-all border border-emerald-500/20 hover:bg-emerald-500/10 transition-all">
              {result.link}
            </a>
            <button onClick={() => navigator.clipboard.writeText(result.link)}
              className="w-full mt-3 py-3 rounded-2xl bg-white/5 border border-white/8 text-sm font-bold text-slate-400 hover:text-white transition-all">
              📋 Copy Link
            </button>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📷</div>
            <p className="text-sm text-slate-600 font-medium">Enter a phone number and click Generate</p>
          </div>
        )}

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">🔍 Working Methods</h3>
          <div className="space-y-3 text-sm text-slate-400">
            {methods.map(m => (
              <div key={m.icon} className="flex gap-3">
                <span className="text-lg">{m.icon}</span>
                <div><b className="text-slate-300">{m.title}</b> — {m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
