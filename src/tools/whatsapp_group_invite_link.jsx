import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function whatsapp_group_invite_link() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [activeTab, setActiveTab] = useState('create')
  const [groupName, setGroupName] = useState('')
  const [qrGenerated, setQrGenerated] = useState(false)

  const generateQR = () => {
    if (!groupName.trim()) return
    setQrGenerated(true)
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="WhatsApp Group Invite Link"
      desc="Learn how to create, share, and manage WhatsApp group invite links. Generate QR codes for easy group joining."
      icon="🔗" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-group-invite-link"
      faq={[
        { q: "How do I create a WhatsApp group invite link?", a: "Open the group, tap the group name, select 'Invite via link', then copy or share the link. Only group admins can create invite links." },
        { q: "Can I revoke a WhatsApp group invite link?", a: "Yes! Group admins can revoke links by going to Group Info → Invite via link → Revoke link. This makes the old link invalid." },
        { q: "How many people can join via a WhatsApp group link?", a: "WhatsApp groups can have up to 1024 members. Anyone with the invite link can join until the group reaches this limit." },
      ]}
      howItWorks={[
        "Open the WhatsApp group you want to share.",
        "Tap the group name → 'Invite via link'.",
        "Choose 'Share link' or 'Copy link' to distribute.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Group Invite Link", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-group-invite-link/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex gap-2">
          {[['create', '🔗 Create Link'], ['revoke', '🔒 Revoke Link'], ['qr', '🔳 QR Code'], ['settings', '⚙️ Settings']].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/[0.06] text-slate-500 border border-white/8'
              }`}>
              {label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          {activeTab === 'create' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">📱 How to Create Group Invite Link</h3>
              <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
                <li>Open the <b className="text-slate-300">WhatsApp group</b> you want to share</li>
                <li>Tap on the <b className="text-slate-300">group name</b> at the top</li>
                <li>Scroll down and tap <b className="text-slate-300">"Invite via link"</b></li>
                <li>Choose <b className="text-slate-300">"Share link"</b> or <b className="text-slate-300">"Copy link"</b></li>
                <li>Share the link via any app or paste it</li>
              </ol>
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                <p className="text-xs text-amber-300">⚠️ <b>Admin Only:</b> Only group admins can create and share invite links.</p>
              </div>
            </div>
          )}

          {activeTab === 'revoke' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">🔒 How to Revoke Invite Link</h3>
              <p className="text-sm text-slate-400">If your link is shared publicly or you want to stop new members from joining:</p>
              <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
                <li>Open <b className="text-slate-300">Group Info</b> → <b className="text-slate-300">Invite via link</b></li>
                <li>Tap <b className="text-slate-300">"Revoke link"</b></li>
                <li>Confirm by tapping <b className="text-slate-300">"Revoke link"</b> again</li>
                <li>The old link becomes invalid immediately</li>
                <li>Generate a new link if needed</li>
              </ol>
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                <p className="text-xs text-red-300">⚠️ <b>Important:</b> Revoking makes the old link useless. Anyone who tries to join via the old link will see an error.</p>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">📲 How to Generate QR Code</h3>
              <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
                <li>Open <b className="text-slate-300">Group Info</b> → <b className="text-slate-300">Invite via link</b></li>
                <li>Tap <b className="text-slate-300">"Share link via QR code"</b></li>
                <li>Show the QR code to others to scan</li>
                <li>Or save the QR code image to share digitally</li>
              </ol>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                <p className="text-xs text-emerald-300">💡 <b>Pro Tip:</b> QR codes are perfect for in-person events, posters, or business cards!</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Group Name (for reference)</label>
                <input type="text" value={groupName} onChange={e => setGroupName(e.target.value)}
                  placeholder="Enter group name..."
                  className={inputClass} />
              </div>
              <button onClick={generateQR}
                className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all active:scale-[0.98]">
                Generate QR Code
              </button>
              {qrGenerated && (
                <div ref={resultRef} className="text-center py-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                  <div className="text-6xl mb-3">🔳</div>
                  <p className="text-sm text-emerald-400 font-semibold">QR Code Ready</p>
                  <p className="text-xs text-slate-500 mt-1">In WhatsApp, go to Group Info → Invite via link → Share via QR code</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">⚙️ Group Settings for Invite Links</h3>
              <p className="text-sm text-slate-400">Control who can join via link:</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• <b className="text-slate-300">Group Info</b> → <b className="text-slate-300">Group settings</b> → <b className="text-slate-300">Edit group info</b></li>
                <li>• Set to <b className="text-slate-300">"Only admins"</b> to prevent members from adding others</li>
                <li>• Enable <b className="text-slate-300">"Approve new participants"</b> to review join requests</li>
              </ul>
              <div className="border-t border-white/8 pt-4">
                <h4 className="text-xs font-bold text-slate-300 mb-2">💡 Best Practices</h4>
                <ul className="space-y-1 text-xs text-slate-400">
                  <li>• <b className="text-slate-300">Don't share publicly:</b> Avoid posting group links on public websites</li>
                  <li>• <b className="text-slate-300">Revoke regularly:</b> Change links periodically for security</li>
                  <li>• <b className="text-slate-300">Use approval:</b> Enable "Approve new participants" for sensitive groups</li>
                  <li>• <b className="text-slate-300">Monitor members:</b> Check who joins and remove spam accounts</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
