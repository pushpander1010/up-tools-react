import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const SECTIONS = [
  {
    id: 'overview',
    icon: '🛡️',
    title: '1. Privacy-First Architecture',
    content: [
      'UpTools (accessible at https://www.uptools.in) is built on a strict client-side-first architecture. Over 98% of our calculators, converters, formatters, validators, and browser games run entirely inside your web browser using JavaScript and Web APIs.',
      'Your personal financial inputs (such as salary, tax regime figures, GST amounts, EMI schedules, PAN/Aadhaar checksum validations, or JSON payloads) are computed locally on your device and are never stored in any UpTools database.',
    ],
  },
  {
    id: 'information-collected',
    icon: '📊',
    title: '2. Information We Collect & Process',
    content: [
      'No Account Required: We do not require registration, sign-up, email addresses, or phone numbers to use UpTools.',
      'Local Browser Storage: Certain tools and games store preferences, high scores, saved tools, or form drafts in your browser’s localStorage so your work is preserved when you return. You can clear this data at any time through your browser settings.',
      'Lookup & AI Endpoints: When you explicitly use tools that require live external data (such as Live Currency Rates, Indian Stock Market Live, Gold Rates, Mutual Fund NAVs, or AI Writing Assistants), your query is transmitted over HTTPS to our edge worker proxy solely to return the requested response in real time. Requests are not logged with personal identifiers.',
    ],
  },
  {
    id: 'cookies-ads',
    icon: '🍪',
    title: '3. Cookies, Analytics & Advertising',
    content: [
      'Google Analytics (GA4): We use Google Analytics to understand aggregate, anonymized traffic patterns (such as popular pages, device types, and approximate region) so we can improve tool speed and reliability.',
      'Google AdSense: We display non-intrusive advertisements via Google AdSense to keep all 600+ tools and 50+ games 100% free. Google and its partners may use cookies (such as the DoubleClick cookie) to serve ads based on your prior visits to this or other websites. You can opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com).',
    ],
  },
  {
    id: 'security',
    icon: '🔒',
    title: '4. Data Security & Encryption',
    content: [
      'All connections to UpTools are encrypted via TLS/HTTPS with HTTP Strict Transport Security (HSTS) enabled.',
      'Cryptographic utilities (such as our Password Generator, Hash Generator, and AES Encryption tool) utilize the native browser Web Crypto API (window.crypto.subtle) for true cryptographic randomness and zero server exposure.',
    ],
  },
  {
    id: 'rights',
    icon: '⚖️',
    title: '5. Your Privacy Rights (DPDP Act, GDPR & CCPA)',
    content: [
      'Regardless of whether you reside in India (under the Digital Personal Data Protection Act), the European Economic Area (GDPR), or California (CCPA), you have the right to know how your data is handled, to block or delete cookies via your browser controls, and to contact us regarding any privacy concern.',
    ],
  },
]

export default function PrivacyPolicyPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy — UpTools',
    description: 'Read the UpTools Privacy Policy. Learn how our client-side calculators, converters, AI tools, and browser games protect your privacy with zero account requirements.',
    url: 'https://www.uptools.in/privacy-policy/',
    isPartOf: { '@type': 'WebSite', name: 'UpTools', url: 'https://www.uptools.in/' },
    publisher: { '@type': 'Organization', name: 'UpTools', url: 'https://www.uptools.in/' },
  }

  return (
    <>
      <Helmet>
        <title>Privacy Policy — Client-Side Data & Cookie Policy | UpTools</title>
        <meta
          name="description"
          content="Read the UpTools Privacy Policy. Learn how our 600+ free online calculators, converters, AI tools, and games process data locally in your browser with no sign-up."
        />
        <link rel="canonical" href="https://www.uptools.in/privacy-policy/" />
        <meta property="og:title" content="Privacy Policy — Client-Side Data & Cookie Policy | UpTools" />
        <meta
          property="og:description"
          content="How UpTools protects your data across 600+ free online tools and games: client-side processing, no accounts, and transparent cookie practices."
        />
        <meta property="og:url" content="https://www.uptools.in/privacy-policy/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">Privacy Policy</span>
      </nav>

      {/* Hero */}
      <section className="glass p-7 sm:p-9 mb-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(16,185,129,0.12)' }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 mb-3">
            <span>🔒</span> Privacy-First Web Toolkit · Last Updated October 2026
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight m-0 mb-3">
            Privacy Policy
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed m-0">
            At UpTools, privacy is not an afterthought — it is our default architecture. Almost every calculation, conversion, and document utility runs directly inside your browser so your sensitive numbers never leave your device.
          </p>
        </div>
      </section>

      {/* Policy Sections */}
      <div className="space-y-4 mb-8">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="glass p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2.5 m-0">
              <span>{s.icon}</span> {s.title}
            </h2>
            <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
              {s.content.map((p, idx) => (
                <p key={idx} className="m-0">{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Contact & Related Links */}
      <section className="glass p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white m-0 mb-1">Questions about your privacy?</h2>
          <p className="text-xs sm:text-sm text-slate-400 m-0">
            Reach out to our team at <a href="mailto:support@uptools.in" className="text-indigo-400 hover:underline">support@uptools.in</a> or use our contact form.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link to="/contact/" className="glow-btn text-xs px-4 py-2 rounded-xl no-underline">Contact Support →</Link>
          <Link to="/about/" className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:text-white no-underline">About UpTools</Link>
          <Link to="/all-tools/" className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:text-white no-underline">Browse All Tools</Link>
        </div>
      </section>
    </>
  )
}
