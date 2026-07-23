import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

const GUIDES = [
  {
    id: 'basics',
    icon: '📱',
    title: 'How to Use Snapchat Filters',
    badge: 'Basic',
    badgeColor: 'emerald',
    steps: [
      'Open the <strong>Snapchat app</strong> and go to the camera',
      '<strong>Tap and hold</strong> on your face (or anywhere on screen)',
      '<strong>Swipe left or right</strong> to browse available filters',
      '<strong>Tap</strong> on a filter to apply it',
      'Take a photo or video with the filter applied',
    ],
  },
  {
    id: 'types',
    icon: '🎨',
    title: 'Types of Snapchat Filters',
    items: [
      { label: 'Face Lenses', desc: 'AR effects that track your face (dog ears, rainbow vomit, etc.)' },
      { label: 'World Lenses', desc: 'AR effects for your environment (3D objects, animations)' },
      { label: 'Color Filters', desc: 'Simple color overlays (swipe left/right after taking snap)' },
      { label: 'Geofilters', desc: 'Location-based overlays (city names, landmarks)' },
      { label: 'Time/Speed Filters', desc: 'Show time, speed, temperature, altitude' },
      { label: 'Sponsored Lenses', desc: 'Brand-created AR experiences' },
    ],
  },
  {
    id: 'trending',
    icon: '🔍',
    title: 'How to Find Trending Filters',
    steps: [
      'Open Snapchat and go to <strong>Explore</strong> (bottom right)',
      'Tap the <strong>search icon</strong> at the top',
      'Browse <strong>Trending Lenses</strong> section',
      'Tap on a lens to preview and use it',
      'Save favorites by tapping the <strong>star icon</strong>',
    ],
  },
  {
    id: 'create',
    icon: '🛠️',
    title: 'Create Your Own Filter',
    badge: 'Advanced',
    badgeColor: 'purple',
    desc: 'Use <strong>Lens Studio</strong> (free desktop app) to create custom AR lenses:',
    steps: [
      'Download <strong>Lens Studio</strong> from lensstudio.snapchat.com',
      'Choose a template or start from scratch',
      'Design your lens using 2D/3D assets',
      'Test on your phone using Snapchat app',
      'Publish to Snap Lens Library',
    ],
  },
  {
    id: 'tips',
    icon: '💡',
    title: 'Pro Tips',
    items: [
      { label: 'Good lighting', desc: 'Filters work best in well-lit environments' },
      { label: 'Update app', desc: 'New filters require latest Snapchat version' },
      { label: 'Save favorites', desc: 'Star filters you use often for quick access' },
      { label: 'Try voice commands', desc: 'Some lenses activate with voice' },
      { label: 'Scan Snapcodes', desc: 'Unlock exclusive filters by scanning codes' },
    ],
  },
]

const FAQ = [
  { q: 'How do I use Snapchat filters?', a: 'Open Snapchat camera, tap and hold on your face, then swipe left or right to browse and select filters.' },
  { q: "Why can't I see Snapchat filters?", a: 'Make sure you have the latest Snapchat version, enable camera permissions, and check your internet connection. Filters require data to load.' },
  { q: 'Can I create my own Snapchat filter?', a: 'Yes! Use Lens Studio (free desktop app from Snap) to create custom AR lenses and filters.' },
]

export default function snapchat_filters_guide() {
  const [activeTab, setActiveTab] = useState('basics')

  return (
    <ToolLayout
      title="Snapchat Filters Guide"
      desc="Complete guide to Snapchat filters and lenses. Learn how to use, create, and find trending filters."
      icon="👻" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="snapchat-filters-guide"
      faq={FAQ}
      howItWorks={[
        'Choose a topic from the tabs below.',
        'Follow the step-by-step instructions for each guide section.',
        'Apply what you learn directly in the Snapchat app.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Snapchat Filters Guide", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/snapchat-filters-guide/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {GUIDES.map(g => (
            <button key={g.id} onClick={() => setActiveTab(g.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border-2 ${
                activeTab === g.id
                  ? 'bg-pink-500/15 text-pink-400 border-pink-500/30'
                  : 'bg-white/[0.04] text-slate-500 border-white/8 hover:border-white/12'
              }`}>
              {g.icon} {g.title.split(' ').slice(0, 2).join(' ')}
            </button>
          ))}
        </div>

        {/* Guide Content */}
        {GUIDES.filter(g => g.id === activeTab).map(guide => (
          <div key={guide.id} className="rounded-3xl border-2 border-white/8 bg-white/[0.04] p-6"
            style={{ animation: 'slideUp 0.25s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{guide.icon}</span>
              <h2 className="text-lg font-extrabold text-white">{guide.title}</h2>
              {guide.badge && (
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider
                  ${guide.badgeColor === 'emerald' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'}`}>
                  {guide.badge}
                </span>
              )}
            </div>

            {guide.desc && (
              <p className="text-sm text-slate-400 mb-4" dangerouslySetInnerHTML={{ __html: guide.desc }} />
            )}

            {guide.steps && (
              <ol className="space-y-3">
                {guide.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-pink-500/15 text-pink-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: step }} />
                  </li>
                ))}
              </ol>
            )}

            {guide.items && (
              <div className="space-y-3">
                {guide.items.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start pl-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 flex-shrink-0 mt-2" />
                    <div>
                      <span className="text-sm font-semibold text-white">{item.label}: </span>
                      <span className="text-sm text-slate-400">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* FAQ */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.04] p-6">
          <h3 className="text-sm font-extrabold text-white mb-4">❓ FAQ</h3>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details key={i} className="group">
                <summary className="text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-slate-600 group-open:rotate-45 transition-transform text-lg">+</span>
                </summary>
                <p className="text-xs text-slate-500 mt-2 pl-4 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
