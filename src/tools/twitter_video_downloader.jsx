import ToolLayout from '../components/ToolLayout'
import DlBox from '../components/DlBox'

export default function twitter_video_downloader() {
  return (
    <ToolLayout
      title="Twitter/X Video Downloader"
      desc="Twitter/X Video Downloader - download videos, GIFs, and media from X (formerly Twitter) in HD quality., online free. Free online in HD. No app or login needed."
      icon="🐦" iconBg="rgba(29,161,242,0.08)"
      category="social" slug="twitter-video-downloader"
      faq={[
        { q: "How do I download a Twitter/X video?", a: "Copy the tweet URL, paste it into our downloader, select quality, and click download. The video will be saved to your device." },
        { q: "Can I download GIFs from X?", a: "Yes! Our downloader supports GIFs, videos, and all media types from X posts." },
        { q: "What's the maximum video length?", a: "X allows videos up to 2 hours long. We support downloading videos of any length available on X." },
        { q: "How do I download online free?", a: "Paste the link above, pick your option, and save the file. Free with no sign-up or app needed." },
        { q: "What quality do I get?", a: "You get the highest quality available, free. Paste the link above and save it to your device." },
        { q: "Can I download on mobile?", a: "Yes. Open this page in your phone browser, paste the link, and save directly. No app needed." },
      ]}
      howItWorks={[
        "Find the tweet with the video you want to download.",
        "Copy the URL from the address bar.",
        "Paste the URL above and click Download.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Twitter/X Video Downloader", "applicationCategory": "UtilityApplication",
        "url": "https://www.uptools.in/twitter-video-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4 text-sm text-amber-300">
          ⚠️ <strong>Privacy & Legal:</strong> Only download content you have permission to download. Respect copyright and creators' rights.
        </div>

        <DlBox accent="sky" filePrefix="twitter-video"
          placeholder="Paste X/Twitter video URL here..."
          buttonLabel="📥 Download Video" loadingLabel="⏳ Finding video..."
          services={[
            { label: 'Download via SnapSave', href: 'https://snapsave.app/' },
            { label: 'Download via SSSTwitter', href: 'https://ssstwitter.com/' },
          ]} />

        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '⚡', label: 'Fast Download' }, { icon: '🎞️', label: 'GIF Support' }, { icon: '📱', label: 'All Devices' }].map((f, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/8 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{f.icon}</div>
              <div className="text-xs text-slate-400 font-medium">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
