import ToolLayout from '../components/ToolLayout'

const STEPS = [
  { h: 'Step 1: Open WhatsApp Web', p: 'Visit web.whatsapp.com in your browser (Chrome, Firefox, Safari, Edge).' },
  { h: 'Step 2: Scan QR Code', p: 'Open WhatsApp on your phone → Settings → Linked Devices → Link a Device. Scan the QR code on your screen.' },
  { h: 'Step 3: Start Messaging', p: 'Your chats will sync instantly. You can now send messages, make calls, and share media from your desktop.' },
]

const FEATURES = [
  { h: '🔔 Enable Notifications', p: 'Allow browser notifications to get alerts for new messages even when the tab is in the background.' },
  { h: '📱 Keep Phone Connected', p: 'Your phone must stay connected to the internet. WhatsApp Web works as a mirror of your phone.' },
  { h: '🔐 Security Tips', p: 'Always log out on shared computers. Use "Log out from all devices" if you suspect unauthorized access.' },
]

const FAQS = [
  { q: 'Can I use WhatsApp Web without my phone?', a: 'No, your phone must be connected to the internet. WhatsApp Web is a mirror of your phone, not a standalone app.' },
  { q: 'How many devices can I link?', a: 'You can link up to 4 devices simultaneously to your WhatsApp account.' },
  { q: 'Is WhatsApp Web secure?', a: 'Yes, all messages are end-to-end encrypted. Always log out on public computers for security.' },
  { q: 'Why is WhatsApp Web not working?', a: 'Check your internet connection, clear browser cache, or try a different browser. Restart your phone if needed.' },
]

export default function whatsapp_web_guide() {
  return (
    <ToolLayout
      title="WhatsApp Web Guide"
      desc="Master WhatsApp Web with our complete step-by-step guide. Learn how to set up, use advanced features, and troubleshoot."
      icon="💬" iconBg="rgba(37,211,102,0.08)"
      category="social" slug="whatsapp-web-guide"
      faq={FAQS}
      howItWorks={[
        "Open web.whatsapp.com in your browser.",
        "Scan the QR code using your phone's WhatsApp.",
        "Start messaging from your desktop.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Web Guide", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/whatsapp-web-guide/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Getting Started */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Getting Started</h3>
          <ol className="space-y-4">
            {STEPS.map((step, i) => (
              <li key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{step.h}</div>
                  <div className="text-sm text-slate-400 mt-0.5">{step.p}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Advanced Features */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Advanced Features</h3>
          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-black/20 rounded-xl p-4">
                <div className="text-sm font-semibold text-white">{f.h}</div>
                <div className="text-sm text-slate-400 mt-1">{f.p}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">❓ FAQ</h3>
          {FAQS.map((f, i) => (
            <div key={i}>
              <div className="text-sm font-semibold text-white">{f.q}</div>
              <div className="text-sm text-slate-400 mt-1">{f.a}</div>
            </div>
          ))}
        </div>

        <div className="bg-black/20 rounded-2xl p-4 text-center">
          <p className="text-xs text-slate-500">💡 Tip: Use keyboard shortcuts like Ctrl+N to start a new chat and Ctrl+Shift+M to mute notifications.</p>
        </div>
      </div>
    </ToolLayout>
  )
}
