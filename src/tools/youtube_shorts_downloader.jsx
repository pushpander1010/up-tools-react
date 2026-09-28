import ToolLayout from '../components/ToolLayout'
import DlBox from '../components/DlBox'

export default function youtube_shorts_downloader() {
  return (
    <ToolLayout
      title="YouTube Shorts Downloader"
      desc="YouTube Shorts downloader — download Shorts videos online free in HD 720p and 1080p MP4. Paste the link, pick quality, save on any device, no app needed."
      icon="📱" iconBg="rgba(239,68,68,0.08)"
      category="social" slug="youtube-shorts-downloader"
      faq={[
        { q: "How do I download YouTube Shorts online free?", a: "Paste the Shorts link above and click Download. If our server is blocked, use one of the converter buttons. The video saves as MP4, free with no sign-up." },
        { q: "How do I download YouTube Shorts in HD 1080p?", a: "Paste the shorts URL and use a converter below, then select 1080p quality. HD quality is available when the original Short was uploaded in HD." },
        { q: "Can I download YouTube Shorts on mobile?", a: "Yes. Open this page in your phone browser, paste the Shorts link, and save the MP4 directly to your device." },
        { q: "Do I need an app to download Shorts?", a: "No app needed. This online downloader works in any browser on Android, iPhone, and desktop." },
        { q: "Is the YouTube Shorts downloader free?", a: "Yes, completely free with no login. Download unlimited Shorts videos online." },
        { q: "What format do Shorts download in?", a: "MP4 video in 360p, 720p, or 1080p HD. MP4 plays on every phone, tablet, and computer." },
      ]}
      howItWorks={[
        "Paste a YouTube Shorts URL in the input field.",
        "Click Download.",
        "If our server is blocked, use one of the converter buttons.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "YouTube Shorts Downloader", "applicationCategory": "MultimediaApplication",
        "url": "https://www.uptools.in/youtube-shorts-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        <DlBox accent="red" filePrefix="youtube-short"
          placeholder="https://youtube.com/shorts/..."
          buttonLabel="📥 Download" loadingLabel="⏳ Finding..."
          fallbackText="Click a button below — your Short opens ready to save, no pasting needed:"
          services={[
            { label: 'Download Short — opens ready to save', href: 'https://ssyoutube.com/watch?v={id}' },
            { label: 'More options via SaveFrom', href: 'https://savefrom.net/' },
          ]} />
      </div>
    </ToolLayout>
  )
}
