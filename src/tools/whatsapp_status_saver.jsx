import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function whatsapp_status_saver() {
  const [activeTab, setActiveTab] = useState('android')

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="WhatsApp Status Saver"
      desc="Learn how to save WhatsApp status videos and photos on Android and iPhone."
      icon="📱" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-status-saver"
      faq={[
        { q: "How do I save WhatsApp status on Android?", a: "Open WhatsApp and view the status, open File Manager, enable 'Show hidden files', navigate to WhatsApp/Media/.Statuses, copy the status files to your gallery." },
        { q: "Can I save WhatsApp status on iPhone?", a: "View the status in WhatsApp, take a screenshot or screen recording, or use the share button if available. iOS doesn't allow direct file access to status folder." },
        { q: "Is it legal to save someone's WhatsApp status?", a: "Saving status for personal viewing is generally acceptable, but sharing or reposting without permission may violate privacy and copyright." },
      ]}
      howItWorks={[
        "Open WhatsApp and view the status you want to save.",
        "Follow the platform-specific method below.",
        "Save the file to your gallery or downloads folder.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Status Saver", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-status-saver/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-300 font-semibold">⚠️ <b>Privacy Notice:</b> Always respect others' privacy. Saving and sharing someone's status without permission may violate their privacy rights.</p>
        </div>

        <div className="flex gap-2">
          {[['android', '📱 Android'], ['ios', '🍎 iPhone'], ['web', '💻 WhatsApp Web']].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/[0.06] text-slate-500 border border-white/8'
              }`}>
              {label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          {activeTab === 'android' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Method 1: Using File Manager</h3>
                <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
                  <li>Open WhatsApp and view the status you want to save</li>
                  <li>Open your phone's File Manager app</li>
                  <li>Tap the menu (⋮) and enable "Show hidden files"</li>
                  <li>Navigate to: <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-emerald-300 text-xs">Internal Storage &gt; WhatsApp &gt; Media &gt; .Statuses</code></li>
                  <li>Find the status file you want to save</li>
                  <li>Long-press and select "Copy" or "Move"</li>
                  <li>Paste it to your Gallery or Downloads folder</li>
                </ol>
              </div>
              <div className="border-t border-white/8 pt-4">
                <h3 className="text-sm font-bold text-white mb-2">Method 2: Using Status Saver Apps</h3>
                <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
                  <li>Download a status saver app from Google Play Store</li>
                  <li>Grant necessary permissions (storage access)</li>
                  <li>Open the app - it will show all available statuses</li>
                  <li>Select the status you want to save</li>
                  <li>Tap the download button to save to your gallery</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Method 1: Screenshot/Screen Recording</h3>
                <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
                  <li>Open WhatsApp and view the status</li>
                  <li>For photos: Take a screenshot (Volume Up + Power button)</li>
                  <li>For videos: Use screen recording (Control Center &gt; Record button)</li>
                  <li>The screenshot/recording will be saved to your Photos app</li>
                  <li>Crop or edit as needed</li>
                </ol>
              </div>
              <div className="border-t border-white/8 pt-4">
                <h3 className="text-sm font-bold text-white mb-2">Method 2: Using Third-Party Apps</h3>
                <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
                  <li>Download a status saver app from App Store</li>
                  <li>Open WhatsApp and view the status</li>
                  <li>Open the status saver app</li>
                  <li>Follow the app's instructions to save the status</li>
                  <li>Note: iOS restrictions limit direct file access</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'web' && (
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Saving Status from WhatsApp Web</h3>
              <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
                <li>Open WhatsApp Web on your computer</li>
                <li>Click on the status icon to view statuses</li>
                <li>For photos: Right-click and select "Save image as"</li>
                <li>For videos: Use browser extensions or screen recording software</li>
                <li>Save the file to your desired location</li>
              </ol>
            </div>
          )}
        </div>

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">💡 Tips for Saving WhatsApp Status</h3>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>✅ <b className="text-slate-300">View first:</b> Always view the status in WhatsApp before trying to save it</li>
            <li>✅ <b className="text-slate-300">24-hour window:</b> Statuses disappear after 24 hours, so save them quickly</li>
            <li>✅ <b className="text-slate-300">Quality:</b> Original quality is preserved when using file manager method</li>
            <li>✅ <b className="text-slate-300">Storage:</b> Ensure you have enough storage space on your device</li>
            <li>✅ <b className="text-slate-300">Permissions:</b> Grant necessary storage permissions to apps</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
}
