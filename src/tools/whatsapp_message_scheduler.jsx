import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function whatsapp_message_scheduler() {
  const [activeMethod, setActiveMethod] = useState(0)

  const methods = [
    {
      title: 'WhatsApp Business (Built-in)',
      icon: '📱',
      platform: 'WhatsApp Business',
      color: 'green',
      steps: [
        'Open WhatsApp Business app.',
        'Go to Settings → Business tools.',
        'Tap Away message or Quick replies.',
        'Enable scheduling and set your time.',
        'Compose your message and save.',
      ],
      note: 'This only works for automated responses, not individual scheduled messages.',
    },
    {
      title: 'Android Built-in Scheduler',
      icon: '🤖',
      platform: 'Android',
      color: 'blue',
      steps: [
        'Open WhatsApp and select a chat.',
        'Type your message.',
        'Long-press the Send button.',
        'Select Schedule message.',
        'Choose date and time.',
        'Confirm to schedule.',
      ],
      note: 'Feature availability depends on your Android device manufacturer.',
    },
    {
      title: 'iOS Shortcuts',
      icon: '🍎',
      platform: 'iOS',
      color: 'purple',
      steps: [
        'Open the Shortcuts app on iPhone.',
        'Tap + to create a new shortcut.',
        'Search for "Send Message" action.',
        'Select WhatsApp as the app.',
        'Enter recipient and message.',
        'Tap Automation → Time of Day.',
        'Set your schedule and save.',
      ],
      note: 'iOS automations may require confirmation before sending.',
    },
  ]

  return (
    <ToolLayout
      title="WhatsApp Message Scheduler"
      desc="Learn how to schedule WhatsApp messages for free. Step-by-step guide for Android, iOS, and WhatsApp Business. No third-party apps needed."
      icon="⏰" iconBg="rgba(37,211,102,0.08)"
      category="social" slug="whatsapp-message-scheduler"
      faq={[
        { q: "Can I schedule WhatsApp messages for free?", a: "Yes! WhatsApp Business has built-in message scheduling. For personal WhatsApp, you can use Android's built-in scheduler or iOS Shortcuts app for free." },
        { q: "Does WhatsApp have a built-in scheduler?", a: "WhatsApp Business has a built-in scheduler for quick replies and away messages. Personal WhatsApp doesn't have native scheduling." },
        { q: "How do I schedule a WhatsApp message on iPhone?", a: "Use the iOS Shortcuts app to create an automation that sends a WhatsApp message at a specific time." },
      ]}
      howItWorks={[
        "Choose your platform: WhatsApp Business, Android, or iOS.",
        "Follow the step-by-step instructions for your platform.",
        "Set your desired date and time for the message.",
        "Confirm and your message will be sent automatically.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Message Scheduler", "applicationCategory": "UtilityApplication",
        "url": "https://www.uptools.in/whatsapp-message-scheduler/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex gap-2">
          {methods.map((m, i) => (
            <button key={i} onClick={() => setActiveMethod(i)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 border-2 ${
                activeMethod === i
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-white/[0.04] border-white/8 text-slate-500 hover:border-white/12'
              }`}>
              {m.icon} {m.platform.split(' ')[0]}
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
            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
              ⚠️ <strong>Note:</strong> {methods[activeMethod].note}
            </div>
          )}
        </div>

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-white mb-3">💡 Best Practices</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> <strong>Test first:</strong> Send a test message to yourself before scheduling important messages</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> <strong>Time zones:</strong> Double-check time zones when scheduling international messages</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> <strong>Battery:</strong> Keep your device charged and connected to ensure messages send</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> <strong>Internet:</strong> Ensure stable internet connection at scheduled time</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> <strong>Backup:</strong> Keep a copy of important scheduled messages</li>
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-white mb-3">🔗 Related Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href="/whatsapp-chat/" className="bg-black/20 rounded-xl p-4 border border-white/8 hover:border-emerald-500/30 transition-all">
              <div className="text-sm font-bold text-white">💬 WhatsApp Click-to-Chat</div>
              <div className="text-xs text-slate-500 mt-1">Open chats without saving numbers</div>
            </a>
            <a href="/whatsapp-link-generator/" className="bg-black/20 rounded-xl p-4 border border-white/8 hover:border-emerald-500/30 transition-all">
              <div className="text-sm font-bold text-white">🔗 WhatsApp Link Generator</div>
              <div className="text-xs text-slate-500 mt-1">Create wa.me links with pre-filled messages</div>
            </a>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
