import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

const METHODS = [
  {
    title: '📱 Method 1: WhatsApp Business (Built-in)',
    platform: 'WhatsApp Business',
    platformColor: 'emerald',
    desc: 'WhatsApp Business has built-in scheduling for quick replies and away messages.',
    steps: [
      'Open WhatsApp Business app',
      'Go to Settings → Business tools',
      'Tap Away message or Quick replies',
      'Enable scheduling and set your time',
      'Compose your message and save',
    ],
    note: '⚠️ This only works for automated responses, not individual scheduled messages.',
  },
  {
    title: '🤖 Method 2: Android Built-in Scheduler',
    platform: 'Android',
    platformColor: 'cyan',
    desc: 'Use Android\'s native message scheduling feature (available on Samsung, Google Pixel, and some other brands).',
    steps: [
      'Open WhatsApp and select a chat',
      'Type your message',
      'Long-press the Send button',
      'Select Schedule message',
      'Choose date and time',
      'Confirm to schedule',
    ],
    note: '⚠️ Feature availability depends on your Android device manufacturer.',
  },
  {
    title: '🍎 Method 3: iOS Shortcuts',
    platform: 'iOS',
    platformColor: 'purple',
    desc: 'Use the iOS Shortcuts app to create automated WhatsApp messages.',
    steps: [
      'Open the Shortcuts app on iPhone',
      'Tap + to create a new shortcut',
      'Search for "Send Message" action',
      'Select WhatsApp as the app',
      'Enter recipient and message',
      'Tap Automation → Time of Day',
      'Set your schedule and save',
    ],
    note: '⚠️ iOS automations may require confirmation before sending.',
  },
]

const BEST_PRACTICES = [
  'Test first — send a test message to yourself before scheduling important messages',
  'Time zones — double-check time zones when scheduling international messages',
  'Battery — keep your device charged and connected to ensure messages send',
  'Internet — ensure stable internet connection at scheduled time',
  'Backup — keep a copy of important scheduled messages',
]

export default function whatsapp_message_scheduler() {
  const [activeMethod, setActiveMethod] = useState(0)

  return (
    <ToolLayout
      title="WhatsApp Message Scheduler"
      desc="Learn how to schedule WhatsApp messages for free on Android, iOS, and WhatsApp Business. No third-party apps needed."
      icon="⏰" iconBg="rgba(37,211,102,0.08)"
      category="social" slug="whatsapp-message-scheduler"
      faq={[
        { q: "Can I schedule WhatsApp messages for free?", a: "Yes! WhatsApp Business has built-in message scheduling. For personal WhatsApp, you can use Android's built-in scheduler or iOS Shortcuts app for free." },
        { q: "Does WhatsApp have a built-in scheduler?", a: "WhatsApp Business has a built-in scheduler for quick replies and away messages. Personal WhatsApp doesn't have native scheduling, but you can use device features." },
        { q: "How do I schedule a WhatsApp message on iPhone?", a: "Use the iOS Shortcuts app to create an automation that sends a WhatsApp message at a specific time." },
      ]}
      howItWorks={[
        "Choose a method based on your device (WhatsApp Business, Android, or iOS).",
        "Follow the step-by-step instructions for your platform.",
        "Set your schedule and let the device send messages automatically.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Message Scheduler", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/whatsapp-message-scheduler/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Method tabs */}
        <div className="flex gap-2">
          {METHODS.map((m, i) => (
            <button key={i} onClick={() => setActiveMethod(i)}
              className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border-2
                ${activeMethod === i ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/[0.06] border-white/8 text-slate-500 hover:border-white/12'}`}>
              {m.platform}
            </button>
          ))}
        </div>

        {/* Active method */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white">{METHODS[activeMethod].title}</h3>
            <p className="text-sm text-slate-400 mt-1">{METHODS[activeMethod].desc}</p>
          </div>
          <ol className="space-y-3">
            {METHODS[activeMethod].steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="text-sm text-slate-300">{step}</div>
              </li>
            ))}
          </ol>
          {METHODS[activeMethod].note && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400">
              {METHODS[activeMethod].note}
            </div>
          )}
        </div>

        {/* Best practices */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3">💡 Best Practices</h3>
          <ul className="space-y-2">
            {BEST_PRACTICES.map((tip, i) => (
              <li key={i} className="text-sm text-slate-400">• {tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
}
