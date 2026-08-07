import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

// Kept at the legacy high-traffic URL /whatsapp-private-dp-viewer/
// Same tool as whatsapp_profile_picture_downloader.jsx.
export default function whatsapp_private_dp_viewer() {
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
      title="WhatsApp Private DP Viewer"
      desc="WhatsApp private DP viewer — view and download WhatsApp profile pictures online free. See how to check hidden, blocked, or private DPs, and save any visible profile picture in full size without installing an app."
      icon="🖼️" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-private-dp-viewer"
      faq={[
        { q: "How do I view a WhatsApp DP online?", a: "Open the contact's chat and tap their name, then tap the profile photo to view it full-screen and save it. Or use our WhatsApp DP downloader with the pps.whatsapp.net image link from WhatsApp Web." },
        { q: "Can I view a hidden or blocked WhatsApp DP?", a: "No. If a contact's privacy is set to 'My Contacts' or 'Nobody', or they have blocked you, WhatsApp will not deliver their profile photo to your device — no online viewer can bypass that." },
        { q: "How do I see someone's private WhatsApp DP by number?", a: "There is no way to view a private WhatsApp profile picture by phone number online without a logged-in session. Open a wa.me link or save the contact, then view their photo in the chat." },
        { q: "What resolution are WhatsApp profile pictures?", a: "WhatsApp stores profile pictures at up to 640x640 pixels. Our downloader pulls the highest-quality version available from the image link." },
        { q: "Is a WhatsApp private DP viewer app needed?", a: "No. You can view and save visible profile pictures from the WhatsApp app or WhatsApp Web without installing any third-party viewer app." },
      ]}
      howItWorks={[
        "Enter the phone number or paste a WhatsApp link below.",
        "Open the generated link on your phone to start a chat.",
        "Tap the contact's name → profile photo → save it to your device.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Private DP Viewer", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-private-dp-viewer/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-sm text-emerald-300 font-semibold">📸 View &amp; save any <b>visible</b> WhatsApp profile picture in full size — free, no app, no sign-up.</p>
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
              <p className="font-semibold text-slate-300">Can I view a private profile picture I can't see?</p>
              <p>No. If their privacy is "My Contacts" or "Nobody", WhatsApp won't send the photo to your device.</p>
            </div>
            <div className="border-t border-white/8 pt-3">
              <p className="font-semibold text-slate-300">Is it legal to save someone's DP?</p>
              <p>Saving for personal use is generally fine, but reusing or sharing without permission may violate privacy.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-6 space-y-4">
          <h2 className="text-base font-bold text-white">WhatsApp DP Viewer — What You Can and Can't See</h2>
          <p className="text-sm text-slate-400">
            People search for a <b className="text-slate-300">WhatsApp private DP viewer</b> to see a
            <b className="text-slate-300"> hidden</b>, <b className="text-slate-300">blocked</b>, or
            <b className="text-slate-300"> private</b> profile picture — often
            <b className="text-slate-300"> by number</b> or <b className="text-slate-300">online free</b>.
            Here is the honest answer: WhatsApp protects profile pictures behind your login and each
            contact's privacy setting. If someone's DP is private, hidden, or you are blocked, no online
            viewer or app can show it to you.
          </p>
          <p className="text-sm text-slate-400">
            What you <b className="text-emerald-300">can</b> do: view and save any profile picture you can
            actually see in WhatsApp. Open the contact's chat, tap their name, tap the photo to view it
            full-screen and save it — or grab the <span className="font-mono text-emerald-300">pps.whatsapp.net</span>
            image link from WhatsApp Web and use our <a className="text-emerald-300 underline" href="/whatsapp-dp-downloader/">WhatsApp DP downloader</a>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
            <div className="bg-black/20 rounded-xl p-4 border border-white/8">
              <div className="font-bold text-slate-300 mb-1">✓ You can view</div>
              <div>DPs of contacts you can see in your chats — via the app, WhatsApp Web, or the image link.</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/8">
              <div className="font-bold text-slate-300 mb-1">✗ You cannot view</div>
              <div>Hidden or blocked DPs, or a private profile picture by number, without a logged-in session.</div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
