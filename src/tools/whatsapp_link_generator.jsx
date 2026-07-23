import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const countryCodes = [
  { code: '91', flag: '🇮🇳', label: 'India' },
  { code: '1', flag: '🇺🇸', label: 'USA/Canada' },
  { code: '44', flag: '🇬🇧', label: 'UK' },
  { code: '61', flag: '🇦🇺', label: 'Australia' },
  { code: '971', flag: '🇦🇪', label: 'UAE' },
  { code: '65', flag: '🇸🇬', label: 'Singapore' },
  { code: '60', flag: '🇲🇾', label: 'Malaysia' },
  { code: '92', flag: '🇵🇰', label: 'Pakistan' },
  { code: '880', flag: '🇧🇩', label: 'Bangladesh' },
  { code: '94', flag: '🇱🇰', label: 'Sri Lanka' },
  { code: '977', flag: '🇳🇵', label: 'Nepal' },
  { code: '55', flag: '🇧🇷', label: 'Brazil' },
  { code: '49', flag: '🇩🇪', label: 'Germany' },
  { code: '33', flag: '🇫🇷', label: 'France' },
  { code: '81', flag: '🇯🇵', label: 'Japan' },
  { code: '86', flag: '🇨🇳', label: 'China' },
  { code: '27', flag: '🇿🇦', label: 'South Africa' },
  { code: '234', flag: '🇳🇬', label: 'Nigeria' },
  { code: '254', flag: '🇰🇪', label: 'Kenya' },
  { code: 'other', flag: '🌐', label: 'Other' },
]

const templates = [
  { title: '👋 Simple Hello', msg: "Hi! I'd like to connect with you on WhatsApp." },
  { title: '🛒 Business Inquiry', msg: "Hi! I'm interested in your product/service. Can we discuss?" },
  { title: '🏠 Property/Listing', msg: "Hi! I saw your listing and would like more information. Please contact me." },
  { title: '📅 Appointment', msg: "Hi! I'd like to book an appointment. Please let me know your availability." },
  { title: '🆘 Customer Support', msg: "Hi! I need support with my order. Order ID: [ORDER_ID]. Please help." },
  { title: '🤝 Collaboration', msg: "Hi! I found your contact and would love to collaborate. Let's connect!" },
]

export default function whatsapp_link_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [countryCode, setCountryCode] = useState('91')
  const [otherCode, setOtherCode] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState('')
  const qrRef = useRef(null)

  const getCountryCode = () => countryCode === 'other' ? otherCode.replace(/\D/g, '') : countryCode

  const generate = useCallback(() => {
    const cc = getCountryCode()
    const num = phone.replace(/\D/g, '')
    if (!cc) return setToast('Please select or enter a country code.')
    if (!num) return setToast('Please enter a phone number.')
    const fullNum = cc + num
    let url = `https://wa.me/${fullNum}`
    if (message.trim()) url += `?text=${encodeURIComponent(message.trim())}`
    setGeneratedLink(url)
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      jumpTo()
    }, 100)
    setTimeout(() => setToast(''), 2000)
  }, [countryCode, otherCode, phone, message])

  const clear = () => { setPhone(''); setMessage(''); setGeneratedLink('') }

  const copyLink = () => {
    navigator.clipboard?.writeText(generatedLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const downloadQR = () => {
    const a = document.createElement('a')
    a.href = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generatedLink)}&bgcolor=ffffff&color=000000&margin=10`
    a.download = 'whatsapp-qr.png'
    a.click()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="WhatsApp Link Generator"
      desc="Generate WhatsApp click-to-chat links instantly. Create wa.me links with pre-filled messages & QR codes."
      icon="💬" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-link-generator"
      faq={[
        { q: "What is a WhatsApp link?", a: "A WhatsApp link (wa.me link) lets anyone open a WhatsApp chat with a specific number directly, without saving the contact. You can also pre-fill a message." },
        { q: "How do I create a WhatsApp link?", a: "Enter the phone number with country code and an optional pre-filled message. The tool generates a wa.me link and QR code instantly." },
        { q: "Does it work without saving the number?", a: "Yes, wa.me links open a WhatsApp chat directly without requiring the recipient to be in your contacts." },
      ]}
      howItWorks={[
        "Choose country code and enter digits-only phone number.",
        "Add an optional pre-filled message.",
        "Click Generate Link to create your wa.me link and QR code.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Link Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-link-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {toast && (
          <div className="rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-sm font-semibold px-4 py-2.5 text-center">
            {toast}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">Country Code</label>
            <select value={countryCode} onChange={e => setCountryCode(e.target.value)}
              className={inputClass + " appearance-none"}>
              {countryCodes.map(c => (
                <option key={c.code} value={c.code} className="bg-gray-900">{c.flag} +{c.code} {c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">Phone Number</label>
            <input type="tel" inputMode="numeric" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className={inputClass} />
          </div>
        </div>

        {countryCode === 'other' && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">Custom Country Code</label>
            <input type="number" value={otherCode} onChange={e => setOtherCode(e.target.value)}
              placeholder="e.g. 62 for Indonesia"
              className={inputClass + " max-w-[200px]"} />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Pre-filled Message (optional)</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Hi! I found your contact on UpTools…"
            rows={3} className={inputClass + " resize-vertical"} />
          <div className="text-xs text-slate-600 text-right mt-1">{message.length} / 1000</div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => { generate(); jumpTo() }}
            className="flex-1 py-3.5 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98]">
            💬 Generate Link
          </button>
          <button onClick={clear}
            className="px-5 py-3.5 rounded-2xl bg-white/[0.06] border border-white/8 text-slate-400 font-bold text-sm hover:text-white transition-all">
            Clear
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Message Templates</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {templates.map(t => (
              <button key={t.title} onClick={() => setMessage(t.msg)}
                className="p-3 rounded-xl bg-white/[0.06] border border-white/8 hover:border-indigo-500/40 text-left transition-all">
                <div className="text-xs font-bold text-white mb-1">{t.title}</div>
                <div className="text-[11px] text-slate-500 leading-tight">{t.msg.slice(0, 40)}…</div>
              </button>
            ))}
          </div>
        </div>

        {generatedLink && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Generated Link</h3>
            </div>

            <div className="bg-white/[0.06] rounded-xl p-4 mb-4">
              <code className="text-sm text-emerald-300 font-mono break-all leading-relaxed">{generatedLink}</code>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <button onClick={copyLink}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-indigo-500 text-white hover:bg-indigo-400'
                }`}>
                {copied ? '✓ Copied' : '📋 Copy Link'}
              </button>
              <a href={generatedLink} target="_blank" rel="noopener"
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 text-xs font-bold text-center hover:text-white transition-all">
                Open in WhatsApp
              </a>
              <button onClick={downloadQR}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 text-xs font-bold hover:text-white transition-all">
                ⬇️ Download QR
              </button>
            </div>

            <div className="flex justify-center">
              <img ref={qrRef}
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generatedLink)}&bgcolor=ffffff&color=000000&margin=10`}
                alt="QR code for WhatsApp link"
                className="rounded-xl border border-white/10"
                width={200} height={200} />
            </div>
            <p className="text-xs text-slate-600 text-center mt-3">Scan this QR code to open the WhatsApp chat directly.</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
