import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

const sections = [
  {
    title: 'Introduction',
    icon: '📋',
    content: `UpTools ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how our website and tools handle your data.`
  },
  {
    title: 'Information We Collect',
    icon: '📦',
    items: [
      { label: 'Usage Data', desc: 'We collect anonymous usage analytics (page views, device type, browser) through Google Analytics to improve our tools.' },
      { label: 'No Personal Accounts', desc: 'We do not require account creation or login. No personal information (name, email, phone) is collected by our tools.' },
      { label: 'No Data Storage', desc: 'All tool calculations run entirely in your browser. Your inputs and results are never sent to our servers.' },
    ]
  },
  {
    title: 'How We Use Information',
    icon: '⚙️',
    items: [
      { label: 'Improve Tools', desc: 'Anonymous analytics help us understand which tools are popular and how to improve them.' },
      { label: 'Display Advertisements', desc: 'We use Google AdSense to display relevant ads. Ad partners may collect device identifiers and ad interaction data.' },
      { label: 'No Selling of Data', desc: 'We never sell, trade, or share your personal information with third parties for marketing purposes.' },
    ]
  },
  {
    title: 'Third-Party Services',
    icon: '🔗',
    items: [
      { label: 'Google AdMob / AdSense', desc: 'Used to display advertisements. See Google\'s Privacy Policy at policies.google.com/privacy.' },
      { label: 'Google Analytics', desc: 'Collects anonymous usage data. IP addresses are anonymized.' },
    ]
  },
  {
    title: 'Data Storage & Security',
    icon: '🔒',
    content: 'All tool data, including any data you enter, is processed locally in your browser. Nothing is uploaded to external servers. We use HTTPS encryption for all page loads.'
  },
  {
    title: 'Children\'s Privacy',
    icon: '👶',
    content: 'Our tools are not directed at children under 13. We do not knowingly collect personal information from children.'
  },
  {
    title: 'Changes to This Policy',
    icon: '📝',
    content: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.'
  },
  {
    title: 'Contact Us',
    icon: '📧',
    content: 'If you have questions about this Privacy Policy, contact us at: support@uptools.in'
  }
]

export default function privacy_policy() {
  const [expanded, setExpanded] = useState(null)

  return (
    <ToolLayout
      title="Privacy Policy"
      desc="How UpTools handles your data across its free online tools and games. Privacy-first: no accounts, minimal logging, client-side processing."
      icon="🔒" iconBg="rgba(99,102,241,0.08)"
      category="legal" slug="privacy-policy"
      faq={[
        { q: 'Do your tools store my data?', a: 'No. All calculations run entirely in your browser. We never receive or store the data you enter into our tools.' },
        { q: 'Do you use cookies?', a: 'We use only essential cookies and Google Analytics for anonymous usage statistics. No tracking cookies are used.' },
        { q: 'Can I request data deletion?', a: 'Since we don\'t collect or store personal data, there\'s nothing to delete. Your data stays on your device.' },
      ]}
      howItWorks={[
        'This page explains our privacy practices in plain language.',
        'All UpTools calculators process data locally in your browser.',
        'No account creation is required to use any of our tools.',
        'Contact us at support@uptools.in for any privacy concerns.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebPage",
        "name": "Privacy Policy", "url": "https://www.uptools.in/privacy-policy/",
        "isPartOf": { "@type": "WebSite", "name": "UpTools", "url": "https://www.uptools.in/" },
        "publisher": { "@type": "Organization", "name": "UpTools" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <p className="text-sm text-slate-300"><strong>Last updated:</strong> July 14, 2026</p>
        </div>

        {sections.map((section, i) => (
          <div key={i} className="rounded-2xl border-2 border-white/8 bg-white/[0.04] overflow-hidden">
            <button onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-center gap-3 p-5 text-left hover:bg-white/[0.02] transition-colors">
              <span className="text-xl">{section.icon}</span>
              <span className="flex-1 text-sm font-bold text-white">{section.title}</span>
              <span className="text-slate-500 text-lg">{expanded === i ? '−' : '+'}</span>
            </button>
            {expanded === i && (
              <div className="px-5 pb-5 pt-0 space-y-3" style={{ animation: 'slideUp 0.2s ease-out' }}>
                {section.content && (
                  <p className="text-sm text-slate-400 leading-relaxed">{section.content}</p>
                )}
                {section.items && section.items.map((item, j) => (
                  <div key={j} className="pl-4 border-l-2 border-white/10">
                    <p className="text-sm font-semibold text-white mb-1">{item.label}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ToolLayout>
  )
}
