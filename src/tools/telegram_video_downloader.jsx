import ToolLayout from '../components/ToolLayout'

const Steps = [
  {
    icon: '📱', title: 'Open the Message',
    text: 'Open Telegram and go to the channel, group, or chat that contains the video or photo you want to save. It must be a public channel/group to copy a shareable link.',
  },
  {
    icon: '🔗', title: 'Copy the Message Link',
    text: 'Long-press (or right-click) the message, tap the share/⋯ menu, then choose "Copy Message Link". The link looks like t.me/channelname/123.',
  },
  {
    icon: '🌐', title: 'Open in a Browser',
    text: 'Paste the link into any browser. Telegram shows the message in a web preview page where the media file is directly accessible.',
  },
  {
    icon: '💾', title: 'Save the File',
    text: 'Long-press or right-click the video/photo in the web preview and choose "Save" (or Save Video / Save Image As) to keep it on your device.',
  },
]

const Media = [
  { icon: '🎬', label: 'Videos', desc: 'Saved as MP4, playable on any device.' },
  { icon: '🖼️', label: 'Photos', desc: 'Saved as JPG/PNG images.' },
  { icon: '🎵', label: 'Audio', desc: 'Voice notes & music save as audio files.' },
  { icon: '📄', label: 'Documents', desc: 'PDFs, files & more via the same method.' },
]

export default function telegram_video_downloader() {
  return (
    <ToolLayout
      title="Telegram Video Downloader"
      desc="Learn how to download videos, photos, and media from Telegram channels and groups — step-by-step guide with images and video tips."
      icon="📱" iconBg="rgba(14,165,233,0.08)"
      category="social" slug="telegram-video-downloader"
      faq={[
        { q: 'How do I download a Telegram video?', a: 'Long-press the message, copy the message link, open it in a browser, then long-press the video and choose Save. That works for videos and photos.' },
        { q: 'Can I download from private channels?', a: 'Only public channels and groups give you a copyable link. Private channels require you to be a member, and you can save media from them directly inside the app.' },
        { q: 'Why can\u2019t you download directly here?', a: 'Telegram media is protected and served through login-gated web previews, so the reliable method is the official copy-link → browser → save flow below.' },
        { q: 'Can I save videos without downloading a link?', a: 'Yes — inside the Telegram app, open the video, tap ⋯ (or the download icon), and choose Save to gallery/downloads.' },
      ]}
      howItWorks={[
        "Copy the message link from the Telegram app.",
        "Open the link in a browser.",
        "Long-press the video or photo and choose Save.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "HowTo",
        name: "How to Download Telegram Videos",
        url: "https://www.uptools.in/telegram-video-downloader/",
        step: Steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text }))
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
          <p className="text-sm text-amber-300"><strong>⚠️ Only download content you have permission to download.</strong> Respect copyright and creators' rights.</p>
        </div>

        {/* Hero */}
        <div className="rounded-3xl overflow-hidden border border-white/10 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-transparent to-blue-500/20" />
          <div className="relative p-8 text-center">
            <div className="text-6xl mb-3">📱</div>
            <h2 className="text-2xl font-bold text-white">Download Telegram Videos &amp; Photos</h2>
            <p className="text-sm text-slate-300 mt-1">Public channels &amp; groups · Android, iPhone &amp; Desktop</p>
          </div>
        </div>

        {/* Media types */}
        <div>
          <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-3">🖼️ What You Can Save</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Media.map(m => (
              <div key={m.icon} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-3xl mb-2">{m.icon}</div>
                <div className="text-sm font-bold text-white">{m.label}</div>
                <p className="text-xs text-slate-500 mt-1">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div>
          <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-3">📖 Step-by-Step Guide</h3>
          <div className="space-y-4">
            {Steps.map((s, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-xl">{s.icon}</div>
                <div>
                  <div className="text-sm font-bold text-white">Step {i + 1}: {s.title}</div>
                  <p className="text-sm text-slate-400 mt-1">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In-app method */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">📲 Quick Method — Save Directly in the App</h3>
          <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
            <li>Open the Telegram app and find the video.</li>
            <li>Tap the video to open it, then tap the <b className="text-white">⋯</b> menu (top-right) or the download icon.</li>
            <li>Choose <b className="text-white">Save to Gallery</b> / <b className="text-white">Save to Downloads</b>.</li>
            <li>For photos, long-press the image and tap <b className="text-white">Save Image</b>.</li>
          </ol>
        </div>

        {/* Video demo note */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">🎥 Video: How it Works</h3>
          <p className="text-sm text-slate-400">Whether it's a video (MP4), photo (JPG/PNG), or audio file, the flow is the same: copy the message link → open in browser → long-press the file → Save. This works on Android, iPhone, and desktop browsers.</p>
        </div>
      </div>
    </ToolLayout>
  )
}
