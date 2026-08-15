import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const STATS = [
  { value: '300+', label: 'Free tools' },
  { value: '40+', label: 'Games' },
  { value: '0', label: 'Accounts required' },
  { value: '<80KB', label: 'Typical page weight' },
]

const HIGHLIGHTS = [
  { icon: '🧠', title: 'Client-side first', desc: 'Calculators and formatters run entirely in your browser using modern JavaScript and the Intl APIs for locale-aware numbers and currency.' },
  { icon: '☁️', title: 'CDN + Caching', desc: 'Assets are versioned and served from the edge so pages load fast and updates never break your cache.' },
  { icon: '♿', title: 'Accessible', desc: 'Semantic HTML, keyboard shortcuts, and high-contrast themes that respect prefers-reduced-motion.' },
  { icon: '🔗', title: 'Shareable', desc: 'Most tools support share links so you can save your inputs or send results in one tap.' },
  { icon: '🔒', title: 'No logins', desc: 'No sign-up, no tracking of your calculations. Your data stays on your device.' },
  { icon: '🇮🇳', title: 'India-focused', desc: 'Income Tax, GST, EMI, SIP, IFSC, PAN and more — built for everyday tasks in India and beyond.' },
]

const FAQS = [
  { q: 'Are my inputs private?', a: 'Yes. Most tools run entirely in your browser; data never leaves your device. Network calls are used only for tools that require lookups (e.g., IFSC).' },
  { q: 'Which finance tools are available?', a: 'Income Tax, GST, EMI, SIP, and Currency Converter with INR support. Results load instantly and can be shared via link.' },
  { q: 'Do I need an account?', a: 'No. UpTools requires no sign-up and stores nothing on our servers about your calculations.' },
]

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About UpTools - Privacy-First Free Web Tools</title>
        <meta name="description" content="UpTools is a fast, privacy-first collection of 300+ free web tools and 40+ games. Calculate tax, GST, EMI and SIP; convert currency; validate PAN; format JSON; and more — no logins, instant results." />
        <link rel="canonical" href="https://www.uptools.in/about/" />
        <meta property="og:title" content="About UpTools - Fast, Privacy-First Web Tools" />
        <meta property="og:description" content="Free calculators, converters, JSON/text utilities, and games. No logins, instant results. Learn more about our approach and privacy." />
        <meta property="og:url" content="https://www.uptools.in/about/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">About</span>
      </nav>

      {/* Hero */}
      <section className="glass p-7 mb-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(99,102,241,0.12)' }} />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(14,165,233,0.1)' }} />
        <div className="relative">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight m-0 mb-2"
            style={{ background: 'linear-gradient(135deg, #fff, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            About UpTools
          </h1>
          <p className="text-slate-400 text-sm max-w-lg">Fast, privacy-first tools for finance, text/JSON, converters, and games. No logins, instant results, lightweight pages.</p>
          <div className="flex flex-wrap gap-6 mt-4">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-extrabold text-white">{s.value}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is UpTools */}
      <section className="glass p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-2">What is UpTools?</h2>
        <p className="text-sm text-slate-400 leading-relaxed">UpTools is a lightweight toolkit designed to run smoothly on any device. Most tools run entirely in your browser, so your data never leaves your device (exceptions: lookups like IFSC). That means instant results and maximum privacy.</p>
      </section>

      {/* Highlights */}
      <section className="mb-6">
        <h2 className="text-sm font-bold text-slate-400 mb-3">Why UpTools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {HIGHLIGHTS.map(h => (
            <div key={h.title} className="glass p-5">
              <div className="text-3xl mb-2">{h.icon}</div>
              <h3 className="text-sm font-bold text-white mb-1">{h.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular tools */}
      <section className="glass p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-3">Popular Tools</h2>
        <div className="flex flex-wrap gap-2">
          <Link to="/income-tax-tool/" className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all no-underline">₹ Income Tax Calculator</Link>
          <Link to="/gst-calculator/" className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all no-underline">GST Calculator</Link>
          <Link to="/emi-calculator/" className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all no-underline">EMI Calculator</Link>
          <Link to="/sip-calculator/" className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all no-underline">SIP Calculator</Link>
          <Link to="/currency-converter/" className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all no-underline">Currency Converter</Link>
          <Link to="/ifsc-finder/" className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all no-underline">IFSC Finder</Link>
          <Link to="/pan-validator/" className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all no-underline">PAN Validator</Link>
          <Link to="/json-formatter/" className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all no-underline">JSON Formatter</Link>
        </div>
        <p className="text-xs text-slate-500 mt-3">Explore more: <Link to="/" className="text-indigo-400 hover:text-indigo-300">All tools</Link> · <Link to="/games/" className="text-indigo-400 hover:text-indigo-300">Games</Link> · <a href="/sitemap.xml" className="text-indigo-400 hover:text-indigo-300">Sitemap</a></p>
      </section>

      {/* Resources */}
      <section className="glass p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-3">Useful Resources</h2>
        <div className="flex flex-wrap gap-2 text-xs">
          <a href="https://www.incometax.gov.in/" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all no-underline">Income Tax Dept.</a>
          <a href="https://www.gst.gov.in/" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all no-underline">GST Portal</a>
          <a href="https://www.rbi.org.in/" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all no-underline">RBI</a>
          <a href="https://www.npci.org.in/what-we-do/upi/product-overview" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all no-underline">NPCI UPI</a>
        </div>
      </section>

      {/* Accessibility */}
      <section className="glass p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-2">Accessibility</h2>
        <ul className="text-sm text-slate-400 space-y-1.5 list-disc list-inside">
          <li>Keyboard shortcuts: press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 text-xs">/</kbd> to focus search; <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 text-xs">Tab</kbd> to navigate links.</li>
          <li>Color contrast meets WCAG AA for text and interactive elements.</li>
          <li>Reduced motion: we respect <code className="text-slate-300">prefers-reduced-motion</code>.</li>
          <li>Screen reader labels on all form fields and important controls.</li>
        </ul>
      </section>

      {/* FAQs */}
      <section className="glass p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-3">FAQs</h2>
        {FAQS.map(f => (
          <details key={f.q} className="mb-2">
            <summary className="text-sm font-semibold text-slate-200 cursor-pointer hover:text-white transition-colors">{f.q}</summary>
            <p className="text-sm text-slate-400 mt-2">{f.a}</p>
          </details>
        ))}
      </section>

      {/* Contact */}
      <section className="glass p-6">
        <h2 className="text-lg font-bold text-white mb-2">Found an issue?</h2>
        <p className="text-sm text-slate-400 mb-3">We usually patch things quickly. Tell us what's wrong or suggest a new tool.</p>
        <Link to="/contact/" className="glow-btn text-sm px-5 py-2.5 rounded-xl no-underline inline-block">Contact Us →</Link>
      </section>
    </>
  )
}
