import ToolLayout from '../components/ToolLayout'

const Steps = [
  {
    icon: '👻', title: 'Open the Snap',
    text: 'Open Snapchat and find the snap or story you want to keep. For stories, open them from the Stories tray on the home screen.',
  },
  {
    icon: '📋', title: 'Copy the Link',
    text: 'Tap the share arrow and choose "Copy Link" to grab the snap/story URL. Public stories and Spotlight videos give you a shareable link.',
  },
  {
    icon: '📥', title: 'Use a Download Service',
    text: 'Paste the link into a trusted Snapchat downloader website (like SnapSaver). It will give you a download button for the video or image.',
  },
  {
    icon: '💾', title: 'Save to Device',
    text: 'Tap Download, then long-press or right-click the result and choose "Save" to store it in your gallery or downloads folder.',
  },
]

const ImgSteps = [
  { icon: '📸', label: 'Photos', desc: 'Snap photos and images can be saved as JPG/PNG.' },
  { icon: '🎬', label: 'Videos', desc: 'Snap and story videos save as MP4 clips.' },
  { icon: '📚', label: 'Memories', desc: 'Videos in your own Memories can be exported directly from the app.' },
  { icon: '⭐', label: 'Spotlight', desc: 'Public Spotlight videos are downloadable via link.' },
]

export default function snapchat_video_downloader() {
  return (
    <ToolLayout
      title="Snapchat Video Downloader"
      desc="Learn how to save Snapchat videos, snaps, and stories — step-by-step guide with photos and video tips for Android and iPhone."
      icon="👻" iconBg="rgba(255,252,0,0.08)"
      category="social" slug="snapchat-video-downloader"
      faq={[
        { q: "How do I download a Snapchat video?", a: "Open the snap or story, tap the share arrow, copy the link, then paste it into a trusted Snapchat downloader site to save the video as MP4." },
        { q: "Can I download Snapchat stories?", a: "Yes, public stories and Spotlight videos give you a copyable link. Friend-only stories require that friend's permission." },
        { q: "Will the sender know I saved their snap?", a: "Using a link-based downloader avoids Snapchat's screenshot notification, but you should always respect others' privacy and ask permission." },
        { q: "Can I save my own snaps?", a: "Yes — snaps and stories in your own Memories can be saved directly in the Snapchat app without any third-party tool." },
      ]}
      howItWorks={[
        "Open the snap or story and copy its share link.",
        "Paste the link into a Snapchat downloader website.",
        "Download the photo or video to your device.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "HowTo",
        name: "How to Download Snapchat Videos",
        url: "https://www.uptools.in/snapchat-video-downloader/",
        step: Steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text }))
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
          <p className="text-sm text-amber-300"><strong>⚠️ Privacy &amp; Legal Notice:</strong> Only save content you have permission to download. Respect others' privacy — Snapchat marks saved snaps, and sharing someone's content without consent may violate their privacy.</p>
        </div>

        {/* Hero visual */}
        <div className="rounded-3xl overflow-hidden border border-white/10 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-purple-500/20" />
          <div className="relative p-8 text-center">
            <div className="text-6xl mb-3">👻</div>
            <h2 className="text-2xl font-bold text-white">Save Snapchat Videos &amp; Stories</h2>
            <p className="text-sm text-slate-300 mt-1">Photos and videos · Android &amp; iPhone · Free</p>
          </div>
        </div>

        {/* What you can download (images/videos) */}
        <div>
          <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-3">🖼️ Photos &amp; 🎬 Videos You Can Save</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ImgSteps.map(it => (
              <div key={it.icon} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-3xl mb-2">{it.icon}</div>
                <div className="text-sm font-bold text-white">{it.label}</div>
                <p className="text-xs text-slate-500 mt-1">{it.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-step */}
        <div>
          <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-3">📖 Step-by-Step Guide</h3>
          <div className="space-y-4">
            {Steps.map((s, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-xl">{s.icon}</div>
                <div>
                  <div className="text-sm font-bold text-white">Step {i + 1}: {s.title}</div>
                  <p className="text-sm text-slate-400 mt-1">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended services */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">🔗 Recommended Download Services</h3>
          <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside">
            <li><b className="text-white">SnapSaver</b> — <a className="text-yellow-400 underline" href="https://snapsaver.app/" target="_blank" rel="noopener noreferrer">snapsaver.app</a> — paste a link to save snaps and stories.</li>
            <li><b className="text-white">In-App Save (Memories)</b> — your own snaps: open Memories → tap the snap → ⋮ → Save.</li>
          </ul>
        </div>

        {/* Video demo note */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">🎥 Video: How it Works</h3>
          <p className="text-sm text-slate-400">The process is the same as downloading any short-form video: copy the link, paste it into the service, and tap download. Snapchat photos save as JPG and videos as MP4 — both play on any phone or computer.</p>
        </div>
      </div>
    </ToolLayout>
  )
}
