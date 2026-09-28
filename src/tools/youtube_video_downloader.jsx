import ToolLayout from '../components/ToolLayout'
import DlBox from '../components/DlBox'

export default function youtube_video_downloader() {
  return (
    <ToolLayout
      title="YouTube Video Downloader"
      desc="YouTube Video Downloader - download YouTube videos and audio in HD quality. Save videos as MP4 or, online free. Free online in HD. No app or login needed."
      icon="🎥" iconBg="rgba(239,68,68,0.08)"
      category="social" slug="youtube-video-downloader"
      faq={[
        { q: 'Is this tool free?', a: 'Yes, completely free with no sign-ups required.' },
        { q: 'Is my data private?', a: 'Yes. Your input is used only to fetch the requested content. No data is stored on our servers.' },
        { q: 'Does it work on mobile?', a: 'Yes. All tools are mobile-responsive and work on any device.' },
        { q: "How do I download online free?", a: "Paste the link above, pick your option, and save the file. Free with no sign-up or app needed." },
        { q: "What quality do I get?", a: "You get the highest quality available, free. Paste the link above and save it to your device." },
        { q: "Can I download on mobile?", a: "Yes. Open this page in your phone browser, paste the link, and save directly. No app needed." },
      ]}
      howItWorks={[
        'Open a YouTube video and copy the URL from the address bar.',
        'Paste the YouTube URL in the input field above.',
        'Click Download — if our server is blocked, use one of the converter buttons.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "YouTube Video Downloader", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/youtube-video-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <DlBox accent="red" filePrefix="youtube-video"
          placeholder="Paste YouTube video URL here..."
          buttonLabel="⬇️ Download" loadingLabel="⏳ Finding video..."
          fallbackText="Click a button below — your video opens ready to save, no pasting needed:"
          services={[
            { label: 'Download MP4 — opens ready to save', href: 'https://ssyoutube.com/watch?v={id}' },
            { label: 'More options via SaveFrom', href: 'https://savefrom.net/' },
          ]} />
      </div>
    </ToolLayout>
  )
}
