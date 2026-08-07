import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function whatsapp_profile_picture_downloader() {
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

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="WhatsApp Profile Picture Downloader"
      desc="Download WhatsApp profile pictures free — save any visible WhatsApp DP in full size online. Enter a number or paste a WhatsApp link to get the profile photo, no app or sign-up needed."
      icon="🖼️" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-profile-picture-downloader"
      faq={[
        { q: "How do I download a WhatsApp profile picture?", a: "Open the contact's chat, tap their name, tap the profile photo to view it full-screen, then save. Or use the pps.whatsapp.net image link from WhatsApp Web in our DP downloader to get the full resolution." },
        { q: "How do I download a WhatsApp profile picture by number?", a: "Enter the number in the field above to generate a wa.me link, open it, and tap the contact's profile photo to save it. There is no way to fetch a profile picture by number alone without a logged-in session." },
        { q: "What resolution are WhatsApp DPs?", a: "WhatsApp stores profile pictures at up to 640x640 pixels. Our tool pulls the highest quality version available from the image link." },
        { q: "Can I download a profile picture I can't see?", a: "No. If the person's privacy is set to 'My Contacts' or 'Nobody', WhatsApp won't deliver their photo to you." },
      ]}
      howItWorks={[
        "Enter the phone number or paste a WhatsApp link below.",
        "Open the generated link on your phone to start a chat.",
        "Tap the contact's name → profile photo → save it to your device.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Profile Picture Downloader", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-profile-picture-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-sm text-emerald-300 font-semibold">📸 Save any <b>visible</b> WhatsApp profile picture in full size — free, no app, no sign-up.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Phone Number</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className={inputClass} />
        </div>

        <button onClick={generateLink}
          className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all duration-200 active:scale-[0.98]">
          Open WhatsApp Link
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Profile Picture</h3>
            </div>
            <p className="text-sm text-slate-400 mb-3">Tap the link below, then tap the contact's name → profile photo → save.</p>
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
            <div className="text-4xl mb-3 opacity-20">🖼️</div>
            <p className="text-sm text-slate-600 font-medium">Enter a phone number and click Open WhatsApp Link</p>
          </div>
        )}

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">📱 Step-by-Step (Manual Method)</h3>
          <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
            <li>Open the chat with the person.</li>
            <li>Tap their name at the top of the screen.</li>
            <li>Tap the profile photo to view it full-screen.</li>
            <li>Use the save/share icon to download it to your device.</li>
          </ol>
        </div>

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">❓ FAQ</h3>
          <div className="space-y-3 text-sm text-slate-400">
            <div>
              <p className="font-semibold text-slate-300">What resolution are WhatsApp profile pictures?</p>
              <p>WhatsApp stores them at up to 640x640 pixels.</p>
            </div>
            <div className="border-t border-white/8 pt-3">
              <p className="font-semibold text-slate-300">Can I download a profile picture I can't see?</p>
              <p>No. If their privacy is "My Contacts" or "Nobody", WhatsApp won't send the photo to your device.</p>
            </div>
            <div className="border-t border-white/8 pt-3">
              <p className="font-semibold text-slate-300">Is it legal to save someone's DP?</p>
              <p>Saving for personal use is generally fine, but reusing or sharing without permission may violate privacy.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-6 space-y-4">
          <h2 className="text-base font-bold text-white">How to Download a WhatsApp Profile Picture Online</h2>
          <p className="text-sm text-slate-400">
            Use this free <b className="text-slate-300">WhatsApp profile picture downloader</b> to save a
            <b className="text-slate-300"> WhatsApp profile photo</b> in full size. The quickest route is to
            generate a <b className="text-slate-300">wa.me</b> link from the number above, open it, and tap the
            contact's profile picture to save it to your phone. For the highest resolution, copy the
            <span className="font-mono text-emerald-300"> pps.whatsapp.net</span> image link from WhatsApp Web and
            use our <a className="text-emerald-300 underline" href="/whatsapp-dp-downloader/">WhatsApp DP downloader</a>.
          </p>
          <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
            <li>Enter the phone number and tap <b className="text-slate-300">Open WhatsApp Link</b>.</li>
            <li>Open the chat and tap the contact's name at the top.</li>
            <li>Tap the <b className="text-slate-300">profile photo</b> to view it full-screen.</li>
            <li>Use the save or share icon to <b className="text-slate-300">download the profile picture</b>.</li>
          </ol>
          <div className="border-t border-white/8 pt-4">
            <h3 className="text-sm font-bold text-slate-300 mb-2">WhatsApp Profile Picture Tips</h3>
            <ul className="space-y-1.5 text-sm text-slate-400 list-disc list-inside">
              <li>You can only download a profile picture you can actually see in WhatsApp.</li>
              <li>Full-resolution downloads need the real image link from WhatsApp Web.</li>
              <li>Want to download by number? See <a className="text-emerald-300 underline" href="/whatsapp-dp-by-number/">WhatsApp DP by Number</a>.</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
