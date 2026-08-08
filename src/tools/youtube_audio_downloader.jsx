import ToolLayout from '../components/ToolLayout'

const Steps = [
  {
    icon: '🎬', title: 'Find the Video',
    text: 'Open YouTube and go to the video you want the audio from. It can be a regular video, a Short, or a music video.',
  },
  {
    icon: '🔗', title: 'Copy the Video URL',
    text: 'Tap Share, then "Copy Link" (on mobile), or copy the URL from the browser address bar on desktop. It looks like youtube.com/watch?v=VIDEOID.',
  },
  {
    icon: '🌐', title: 'Paste into a Converter',
    text: 'Open a trusted YouTube-to-MP3 converter site, paste the link, and choose your audio quality (128–320 kbps).',
  },
  {
    icon: '💾', title: 'Download the MP3',
    text: 'Tap Convert, wait for the audio to process, then tap Download to save the MP3 file to your device.',
  },
]

const Quality = [
  { v: '128', label: '128 kbps', desc: 'Smallest file, good for voice/podcasts' },
  { v: '192', label: '192 kbps', desc: 'Balanced quality and size' },
  { v: '320', label: '320 kbps', desc: 'Best quality, larger file' },
]

export default function youtube_audio_downloader() {
  return (
    <ToolLayout
      title="YouTube Audio Downloader"
      desc="Learn how to download audio from YouTube videos as MP3 — step-by-step guide with quality tips and video instructions."
      icon="🎵" iconBg="rgba(239,68,68,0.08)"
      category="social" slug="youtube-audio-downloader"
      faq={[
        { q: 'Is it legal to download YouTube audio?', a: 'Downloading for personal use is generally acceptable, but respect copyright. Do not distribute copyrighted music. For music you want to keep, consider YouTube Music Premium or your own files.' },
        { q: 'What audio quality should I choose?', a: '320 kbps is the best quality and largest file; 128 kbps is the smallest. Choose based on whether you want quality or a small file.' },
        { q: 'Why can\u2019t you convert directly here?', a: 'YouTube blocks data-center servers from fetching videos, so we explain the reliable method: copy the URL and use a trusted online converter.' },
        { q: 'Can I download Shorts audio too?', a: 'Yes — YouTube Shorts have the same URL format and work the same way in any converter.' },
      ]}
      howItWorks={[
        "Copy the YouTube video or Short URL.",
        "Paste it into a trusted MP3 converter.",
        "Choose quality and download the MP3.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "HowTo",
        name: "How to Download YouTube Audio",
        url: "https://www.uptools.in/youtube-audio-downloader/",
        step: Steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text }))
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
          <p className="text-sm text-amber-300"><strong>⚠️ Copyright notice:</strong> Only download audio you have the right to keep. Respect artists and copyright holders — don't redistribute downloaded music.</p>
        </div>

        {/* Hero */}
        <div className="rounded-3xl overflow-hidden border border-white/10 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-orange-500/20" />
          <div className="relative p-8 text-center">
            <div className="text-6xl mb-3">🎵</div>
            <h2 className="text-2xl font-bold text-white">Download YouTube Audio as MP3</h2>
            <p className="text-sm text-slate-300 mt-1">Videos &amp; Shorts · 128–320 kbps · Any device</p>
          </div>
        </div>

        {/* Quality options */}
        <div>
          <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3">🎧 Audio Quality Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Quality.map(q => (
              <div key={q.v} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-2xl mb-1">🎵</div>
                <div className="text-sm font-bold text-white">{q.label}</div>
                <p className="text-xs text-slate-500 mt-1">{q.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div>
          <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3">📖 Step-by-Step Guide</h3>
          <div className="space-y-4">
            {Steps.map((s, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-red-400/10 border border-red-400/20 flex items-center justify-center text-xl">{s.icon}</div>
                <div>
                  <div className="text-sm font-bold text-white">Step {i + 1}: {s.title}</div>
                  <p className="text-sm text-slate-400 mt-1">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended tools */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">🔗 Trusted MP3 Converters</h3>
          <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside">
            <li><b className="text-white">YTMP3</b> — <a className="text-red-400 underline" href="https://ytmp3s.com/" target="_blank" rel="noopener noreferrer">ytmp3s.com</a> — paste URL, choose quality, download.</li>
            <li><b className="text-white">Y2Mate</b> — <a className="text-red-400 underline" href="https://www.y2mate.com/" target="_blank" rel="noopener noreferrer">y2mate.com</a> — video + audio converter.</li>
          </ul>
        </div>

        {/* Video demo note */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">🎥 Video: How it Works</h3>
          <p className="text-sm text-slate-400">Copy the video URL → open a converter → paste → choose quality → download MP3. The audio converts in seconds and plays in any music app on your phone or computer. Photos/thumbnails aren't needed — you only get the audio track.</p>
        </div>
      </div>
    </ToolLayout>
  )
}
