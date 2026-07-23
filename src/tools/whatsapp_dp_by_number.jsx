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
      desc="Learn what's possible with WhatsApp DP by number, why direct download is blocked, and the real ways to save any profile picture in full size."
      icon="💬" iconBg="rgba(37,211,102,0.08)"
      category="social" slug="whatsapp-dp-by-number"
      faq={[
        { q: "Can I download a WhatsApp DP using only a phone number?", a: "No — WhatsApp does not expose profile pictures through a phone number via any public API. You need the contact saved or their WhatsApp link." },
        { q: "How do I save a WhatsApp profile picture in full size?", a: "Open the contact's chat, tap their name, then tap the profile photo to view it full-screen and use the save/share option." },
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
                  : 'bg-white/[0.04] border-white/8 text-slate-500 hover:border-white/12'
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
            <p className="text-xs text-slate-500 mt-3 p-3 bg-black/20 rounded-xl">{methods[activeMethod].note}</p>
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
              <div className="text-xs text-slate-500 mt-1">Save profile pictures in full size</div>
            </a>
            <a href="/whatsapp-status-saver/" className="bg-black/20 rounded-xl p-4 border border-white/8 hover:border-emerald-500/30 transition-all">
              <div className="text-sm font-bold text-white">📸 WhatsApp Status Saver</div>
              <div className="text-xs text-slate-500 mt-1">Save statuses without reposting</div>
            </a>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
