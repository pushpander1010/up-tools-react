import ToolLayout from '../components/ToolLayout'

const TRICKS = [
  {
    category: 'Messaging Tricks',
    items: [
      { icon: '📝', title: 'Text Formatting', desc: '*bold* for bold, _italic_ for italic, ~strikethrough~ for strikethrough, `monospace` for code' },
      { icon: '⏰', title: 'Schedule Messages', desc: 'Long press send button → Select time → Message will be sent automatically at scheduled time' },
      { icon: '📌', title: 'Pin Important Messages', desc: 'Long press message → Pin → Choose duration (8 hours, 24 hours, 7 days, or always)' },
      { icon: '🔍', title: 'Search Messages', desc: 'Use search bar to find messages by keyword, date, or sender. Filter by media type.' },
    ],
  },
  {
    category: 'Privacy & Security',
    items: [
      { icon: '👁️', title: 'Hide Last Seen', desc: 'Settings → Privacy → Last Seen → Select "Nobody" to hide when you were last active' },
      { icon: '🔒', title: 'Lock Chats', desc: 'Long press chat → Lock → Requires fingerprint/face ID to open sensitive conversations' },
      { icon: '🚫', title: 'Block & Report', desc: 'Long press contact → Block → Blocked users can\'t see your status, last seen, or profile picture' },
    ],
  },
  {
    category: 'Call Features',
    items: [
      { icon: '📞', title: 'Group Calls', desc: 'Start a call → Tap add icon → Add up to 8 people for group video/audio calls' },
      { icon: '🎥', title: 'Screen Sharing', desc: 'During video call → Tap share icon → Share your screen with the other person' },
    ],
  },
  {
    category: 'Status & Profile',
    items: [
      { icon: '✨', title: 'Custom Status', desc: 'Add text, emoji, or music to your status. Set expiration time (24 hours or custom)' },
      { icon: '🎨', title: 'Theme Customization', desc: 'Settings → Chats → Theme → Choose Light, Dark, or System default' },
    ],
  },
]

export default function whatsapp_tricks() {
  return (
    <ToolLayout
      title="WhatsApp Tricks & Hidden Features"
      desc="Discover hidden WhatsApp tricks and advanced features. Learn pro tips to master messaging."
      icon="🎯" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-tricks"
      faq={[
        { q: "How do I format text in WhatsApp?", a: "Use *bold*, _italic_, ~strikethrough~, and `monospace` formatting markers around your text." },
        { q: "How do I lock a chat on WhatsApp?", a: "Long press a chat → Lock → Requires fingerprint/face ID to open." },
        { q: "How do I share my screen on WhatsApp?", a: "During a video call, tap the share icon to share your screen with the other person." },
      ]}
      howItWorks={[
        "Browse the tricks organized by category.",
        "Follow the step-by-step instructions for each trick.",
        "Try the keyboard shortcuts for faster messaging.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Tricks", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-tricks/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <p className="text-sm text-slate-400">Unlock the full potential of WhatsApp with these pro tips and hidden features.</p>

        {TRICKS.map(section => (
          <div key={section.category} className="rounded-3xl border-2 border-white/5 bg-white/[0.03] p-6">
            <h2 className="text-lg font-bold text-white mb-4">{section.category}</h2>
            <div className="space-y-4">
              {section.items.map((trick, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-xl mt-0.5">{trick.icon}</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{trick.title}</h4>
                    <p className="text-sm text-slate-400 mt-0.5">{trick.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-4">
          <p className="text-sm text-slate-400">💡 <strong className="text-white">Pro Tip:</strong> Use keyboard shortcuts on WhatsApp Web for faster messaging (Ctrl+N for new chat, Ctrl+Shift+M to mute).</p>
        </div>
      </div>
    </ToolLayout>
  )
}
