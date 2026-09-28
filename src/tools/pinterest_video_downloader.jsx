import ToolLayout from '../components/ToolLayout'
import DlBox from '../components/DlBox'

const FEATURES = [
  { icon: '⚡', label: 'Fast Download' },
  { icon: '🎬', label: 'HD Quality' },
  { icon: '🖼️', label: 'Image Support' },
  { icon: '📱', label: 'All Devices' },
  { icon: '🔒', label: 'Secure' },
  { icon: '✨', label: 'Easy to Use' },
]

export default function pinterest_video_downloader() {
  return (
    <ToolLayout
      title="Pinterest Video Downloader"
      desc="Pinterest Video Downloader - free Pinterest video downloader. Download Pinterest pins, videos, and, online free. Free online in HD. No app or login needed."
      icon="📌" iconBg="rgba(239,68,68,0.08)"
      category="social" slug="pinterest-video-downloader"
      faq={[
        { q: 'How do I download a Pinterest video?', a: 'Copy the pin URL, paste it into our downloader, select quality, and click download.' },
        { q: 'Can I download Pinterest images?', a: 'Yes! Our downloader supports both videos and images from Pinterest pins.' },
        { q: 'Is this tool free?', a: 'Yes, completely free! No registration or payment required.' },
        { q: "How do I download online free?", a: "Paste the link above, pick your option, and save the file. Free with no sign-up or app needed." },
        { q: "What quality do I get?", a: "You get the highest quality available, free. Paste the link above and save it to your device." },
        { q: "Can I download on mobile?", a: "Yes. Open this page in your phone browser, paste the link, and save directly. No app needed." },
      ]}
      howItWorks={[
        'Find the pin or video you want to download on Pinterest.',
        'Copy the URL from the address bar.',
        'Paste the URL into the input field above.',
        'Click Download to save the pin or video.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Pinterest Video Downloader", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/pinterest-video-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Warning */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm text-amber-300"><strong>⚠️ Privacy & Legal Notice:</strong> Only download content you have permission to download. Respect copyright and creators' rights.</p>
        </div>

        <DlBox accent="red" filePrefix="pinterest-video"
          placeholder="Paste Pinterest pin URL here..."
          buttonLabel="⬇️ Download" loadingLabel="⏳ Fetching pin..."
          services={[
            { label: 'Download via ExpertsPHP', href: 'https://www.expertsphp.com/pinterest-video-downloader/' },
            { label: 'Download via PinterestVideoDownloader', href: 'https://pinterestvideodownloader.com/' },
          ]} />

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-3">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/[0.04] border border-white/8 text-center">
              <div className="text-xl mb-1">{f.icon}</div>
              <div className="text-[11px] text-slate-400 font-semibold">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
