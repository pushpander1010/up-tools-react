import ToolLayout from '../components/ToolLayout'

const SECTIONS = [
  {
    title: 'Android Backup',
    subtitle: '📱 Automatic Backup to Google Drive',
    steps: [
      { heading: 'Step 1: Open Settings', text: 'WhatsApp → Settings → Chats → Chat backup' },
      { heading: 'Step 2: Configure Backup', text: 'Select Google Account → Choose backup frequency (Daily, Weekly, Monthly) → Select storage size' },
      { heading: 'Step 3: Verify Backup', text: 'Tap "Back up to Google Drive" to create an immediate backup. Check Google Drive to confirm.' },
    ],
  },
  {
    title: 'iPhone Backup',
    subtitle: '🍎 Automatic Backup to iCloud',
    steps: [
      { heading: 'Step 1: Enable iCloud Backup', text: 'WhatsApp → Settings → Chats → Chat Backup → iCloud Backup' },
      { heading: 'Step 2: Set Backup Frequency', text: 'Choose Daily, Weekly, or Monthly backup schedule' },
      { heading: 'Step 3: Restore on New Device', text: 'Install WhatsApp on new iPhone → Verify phone number → Restore from iCloud backup' },
    ],
  },
]

const RESTORE = [
  { platform: 'Android', emoji: '🔄', text: 'Uninstall WhatsApp → Reinstall from Play Store → Verify phone number → Tap "Restore" when prompted' },
  { platform: 'iPhone', emoji: '🔄', text: 'Install WhatsApp → Verify phone number → Tap "Restore Chat History" → Wait for restoration to complete' },
]

const TIPS = [
  'Backup includes all chats, photos, videos, and voice messages',
  'Backup does NOT include call history',
  'Keep sufficient storage space on Google Drive or iCloud',
  'Backup is encrypted end-to-end',
  'Schedule backups during WiFi to save mobile data',
]

export default function whatsapp_backup_guide() {
  return (
    <ToolLayout
      title="WhatsApp Backup Guide"
      desc="Complete guide to backup and restore WhatsApp chats on Android and iPhone."
      icon="💾" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-backup-guide"
      faq={[
        { q: "How do I backup WhatsApp on Android?", a: "Open WhatsApp → Settings → Chats → Chat backup → Select Google Account → Choose backup frequency." },
        { q: "How do I backup WhatsApp on iPhone?", a: "Open WhatsApp → Settings → Chats → Chat Backup → Enable iCloud Backup → Set backup frequency." },
        { q: "How do I restore WhatsApp chats?", a: "Uninstall and reinstall WhatsApp, verify your phone number, and tap Restore when prompted." },
      ]}
      howItWorks={[
        "Go to WhatsApp Settings → Chats → Chat backup.",
        "Choose your backup destination (Google Drive on Android, iCloud on iPhone).",
        "Set backup frequency and verify the backup completed.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Backup Guide", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-backup-guide/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <p className="text-sm text-slate-400">Never lose your important WhatsApp conversations. Learn how to backup and restore chats on Android and iPhone.</p>

        {SECTIONS.map(section => (
          <div key={section.title} className="rounded-3xl border-2 border-white/5 bg-white/[0.03] p-6">
            <h2 className="text-lg font-bold text-white mb-1">{section.title}</h2>
            <p className="text-sm text-emerald-400 font-semibold mb-4">{section.subtitle}</p>
            <ol className="space-y-4">
              {section.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0 text-xs font-bold text-emerald-400">{i + 1}</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{step.heading}</h4>
                    <p className="text-sm text-slate-400 mt-0.5">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}

        <div className="rounded-3xl border-2 border-white/5 bg-white/[0.03] p-6">
          <h2 className="text-lg font-bold text-white mb-4">Restore Your Chats</h2>
          <div className="space-y-4">
            {RESTORE.map(r => (
              <div key={r.platform} className="flex gap-3">
                <div className="text-xl">{r.emoji}</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Restoring on {r.platform}</h4>
                  <p className="text-sm text-slate-400 mt-0.5">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-6">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3">Important Tips</h3>
          <ul className="space-y-2">
            {TIPS.map((tip, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✅</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-4">
          <p className="text-sm text-slate-400">💡 <strong className="text-white">Pro Tip:</strong> Create manual backups before switching phones or changing phone numbers.</p>
        </div>
      </div>
    </ToolLayout>
  )
}
