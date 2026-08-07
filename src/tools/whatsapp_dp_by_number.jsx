import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function whatsapp_dp_by_number() {
  const [activeMethod, setActiveMethod] = useState(0)

  const methods = [
    {
      title: 'Use the contact\'s WhatsApp link',
      icon: '🔗',
      platform: 'All Devices',
      color: 'green',
      steps: [
        'Create a WhatsApp link: https://wa.me/<number>',
        'Open the link in your browser.',
        'Once the chat loads, tap the contact\'s name.',
        'Tap the profile photo to view it full-screen.',
        'Use the save/share icon to download the DP.',
      ],
      note: 'Our WhatsApp DP Downloader fetches the full-resolution image from a shared link or saved contact.',
      link: '/whatsapp-dp-downloader/',
      linkText: 'Open DP Downloader →',
    },
    {
      title: 'Save from a saved contact',
      icon: '📱',
      platform: 'Mobile',
      color: 'blue',
      steps: [
        'Add the number to your phone\'s contacts.',
        'Open the WhatsApp chat with that contact.',
        'Tap the name at the top of the chat.',
        'Tap the profile picture to view it full-screen.',
        'Use the save/share icon to download the DP.',
      ],
      note: 'This works for anyone who hasn\'t hidden their DP from you.',
    },
    {
      title: 'Status & media saver',
      icon: '📸',
      platform: 'All Devices',
      color: 'purple',
      steps: [
        'For saving WhatsApp status photos/videos (not DPs).',
        'Use our WhatsApp Status Saver tool.',
        'It captures statuses shared with you without reposting.',
      ],
      note: 'Status Saver captures statuses shared with you.',
      link: '/whatsapp-status-saver/',
      linkText: 'Open Status Saver →',
    },
  ]

  return (
    <ToolLayout
      title="WhatsApp DP Download by Number"
      desc="WhatsApp DP download by number explained. Learn how to download a WhatsApp DP with a phone number, why direct by-number download is blocked, and the real methods that work to save any profile picture in full size."
      icon="💬" iconBg="rgba(37,211,102,0.08)"
      category="social" slug="whatsapp-dp-by-number"
      faq={[
        { q: "Can I download a WhatsApp DP using only a phone number?", a: "No — WhatsApp does not expose profile pictures through a phone number via any public API. You need the contact saved, their WhatsApp link, or the real profile-picture image link (pps.whatsapp.net) to download a DP." },
        { q: "How do I download a WhatsApp DP with a number?", a: "Create a wa.me link from the number and open it, save the number as a contact and open the chat, or grab the pps.whatsapp.net image link from WhatsApp Web and paste it into our WhatsApp DP Downloader." },
        { q: "Why can't any site download WhatsApp DP by number?", a: "WhatsApp protects profile pictures behind login. Without your logged-in WhatsApp session, no server can pull a DP from a number alone — sites that claim otherwise are misleading." },
        { q: "How do I save a WhatsApp profile picture in full size?", a: "Open the contact's chat, tap their name, then tap the profile photo to view it full-screen and use the save/share option. Or use the pps.whatsapp.net link in our downloader for the highest resolution." },
        { q: "Why can't I see someone's DP?", a: "The contact likely set their privacy to 'My Contacts' or 'Nobody', or they removed you. Private accounts intentionally hide their DP from non-contacts." },
      ]}
      howItWorks={[
        "WhatsApp does NOT let you pull a DP from a phone number alone.",
        "Use one of the three methods below that actually work.",
        "Method 1 is the easiest — create a wa.me link and open it.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp DP Download by Number", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-dp-by-number/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-300">
          <strong>Important:</strong> WhatsApp does <b>not</b> let you pull a profile picture from a phone number alone. Privacy settings intentionally block it. Any site claiming "enter number, get DP" is misleading.
        </div>

        <div className="flex gap-2">
          {methods.map((m, i) => (
            <button key={i} onClick={() => setActiveMethod(i)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 border-2 ${
                activeMethod === i
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-white/[0.04] border-white/8 text-slate-400 hover:border-white/12'
              }`}>
              {m.icon} Method {i + 1}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{methods[activeMethod].icon}</span>
            <div>
              <h3 className="text-sm font-bold text-white">Method {activeMethod + 1}: {methods[activeMethod].title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                methods[activeMethod].color === 'green' ? 'bg-emerald-500/20 text-emerald-400' :
                methods[activeMethod].color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                'bg-purple-500/20 text-purple-400'
              }`}>{methods[activeMethod].platform}</span>
            </div>
          </div>
          <ol className="space-y-2 ml-4 list-decimal text-sm text-slate-300">
            {methods[activeMethod].steps.map((step, i) => (
              <li key={i} className="pl-1">{step}</li>
            ))}
          </ol>
          {methods[activeMethod].note && (
            <p className="text-xs text-slate-400 mt-3 p-3 bg-black/20 rounded-xl">{methods[activeMethod].note}</p>
          )}
          {methods[activeMethod].link && (
            <a href={methods[activeMethod].link}
              className="inline-block mt-3 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-bold hover:bg-emerald-500/30 transition-all">
              {methods[activeMethod].linkText}
            </a>
          )}
        </div>

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-white mb-3">🔗 Related Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href="/whatsapp-dp-downloader/" className="bg-black/20 rounded-xl p-4 border border-white/8 hover:border-emerald-500/30 transition-all">
              <div className="text-sm font-bold text-white">💬 WhatsApp DP Downloader</div>
              <div className="text-xs text-slate-400 mt-1">Save profile pictures in full size</div>
            </a>
            <a href="/whatsapp-status-saver/" className="bg-black/20 rounded-xl p-4 border border-white/8 hover:border-emerald-500/30 transition-all">
              <div className="text-sm font-bold text-white">📸 WhatsApp Status Saver</div>
              <div className="text-xs text-slate-400 mt-1">Save statuses without reposting</div>
            </a>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-6 space-y-4">
          <h2 className="text-base font-bold text-white">WhatsApp DP Download by Number — What Actually Works</h2>
          <p className="text-sm text-slate-400">
            If you searched for <b className="text-slate-300">WhatsApp DP download by number</b> or
            <b className="text-slate-300"> download WhatsApp DP with number</b>, here is the truth:
            WhatsApp does not let anyone — or any website — pull a profile picture from a phone number
            alone. The DP is protected behind your logged-in WhatsApp session. Any tool that claims to
            <i> "download WhatsApp DP by number"</i> without a session is misleading.
          </p>
          <p className="text-sm text-slate-400">
            The methods that genuinely work are the ones listed above: open a <b className="text-slate-300">wa.me</b> link,
            save the number as a contact, or copy the real profile-picture image link
            (<span className="font-mono text-emerald-300">pps.whatsapp.net</span>) from WhatsApp Web and use our
            <a className="text-emerald-300 underline" href="/whatsapp-dp-downloader/"> WhatsApp DP downloader</a> to save it
            in full resolution.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
            <div className="bg-black/20 rounded-xl p-4 border border-white/8">
              <div className="text-xl mb-1">🔗</div>
              <div className="font-bold text-slate-300">wa.me link</div>
              <div className="mt-1">Open a chat without saving the number, then tap the profile photo.</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/8">
              <div className="text-xl mb-1">📇</div>
              <div className="font-bold text-slate-300">Saved contact</div>
              <div className="mt-1">Add the number, open the chat, tap the name, save the photo.</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/8">
              <div className="text-xl mb-1">🖼️</div>
              <div className="font-bold text-slate-300">Image link</div>
              <div className="mt-1">Copy the pps.whatsapp.net link from WhatsApp Web and download it here.</div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
