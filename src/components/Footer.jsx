import { Link } from 'react-router-dom'

const FINANCE_LINKS = [
  { to: '/income-tax-tool/', label: 'Income Tax Calculator' },
  { to: '/gst-calculator/', label: 'GST Calculator India' },
  { to: '/emi-calculator/', label: 'Loan & EMI Calculator' },
  { to: '/sip-calculator/', label: 'SIP Return Calculator' },
  { to: '/ppf-calculator/', label: 'PPF Calculator' },
  { to: '/fd-calculator/', label: 'FD Interest Calculator' },
  { to: '/ctc-salary-calculator/', label: 'CTC to In-Hand Salary' },
  { to: '/gold-rate-india/', label: 'Live Gold Rate India' },
  { to: '/indian-stock-market-live/', label: 'Indian Stock Market Live' },
  { to: '/currency-converter/', label: 'Live Currency Converter' },
]

const UTILITY_LINKS = [
  { to: '/json-formatter/', label: 'JSON Formatter & Validator' },
  { to: '/password-generator/', label: 'Secure Password Generator' },
  { to: '/qr-generator/', label: 'QR Code Generator' },
  { to: '/ai-blog-generator/', label: 'AI Blog & Article Writer' },
  { to: '/rawcv-resume-builder/', label: 'ATS Resume Builder' },
  { to: '/bmi-calculator/', label: 'BMI & Health Calculator' },
  { to: '/age-calculator/', label: 'Exact Age Calculator' },
  { to: '/percentage-calculator/', label: 'Percentage Calculator' },
  { to: '/pan-validator/', label: 'PAN Card Validator' },
  { to: '/ifsc-finder/', label: 'Bank IFSC Code Finder' },
]

const HUBS_AND_GAMES = [
  { to: '/all-tools/', label: 'All 570+ Tools (A–Z Index)' },
  { to: '/games/', label: '50+ Free Browser Games' },
  { to: '/learning/', label: 'AI & DSA Learning Hub' },
  { to: '/learning/ai/', label: 'AI Guides with Animations' },
  { to: '/learning/dsa/', label: 'DSA Algorithms Visualized' },
  { to: '/blogs/', label: 'Trending Tech & AI Blogs' },
  { to: '/hncker/', label: 'HNCKER Security Guides' },
  { to: '/hackolution/', label: 'HACKOLUTION Tools & APKs' },
  { to: '/aimakerich/', label: 'AIMakeRich Finance Guides' },
  { to: '/aiforrich/', label: 'AIFORRICH Algo Trading' },
]

export default function Footer() {
  return (
    <footer
      className="mt-16 border-t border-white/[0.08] relative z-10"
      style={{
        background: 'linear-gradient(180deg, rgba(8, 13, 25, 0.85) 0%, rgba(5, 8, 16, 0.98) 100%)',
        minHeight: '340px',
        containIntrinsicSize: '0 340px',
        contentVisibility: 'auto',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-white/[0.07]">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 no-underline">
              <img
                src="/assets/logo/uptools-logo.svg"
                alt="UpTools Logo"
                className="w-10 h-10 rounded-xl shadow-lg shadow-brand/20"
                width="40"
                height="40"
              />
              <div>
                <span className="text-lg font-extrabold text-white tracking-tight block leading-none">
                  UpTools
                </span>
                <span className="text-[11px] text-indigo-300 font-medium">
                  Fast, Privacy-First Web Utilities
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed max-w-sm m-0">
              570+ free online calculators, financial &amp; tax estimators, developer utilities, AI productivity assistants, interactive learning guides, and 50 instant browser games. Everything runs in your browser with zero sign-up.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
                🔒 100% Client-Side Privacy
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 border border-indigo-500/25 text-indigo-300">
                ⚡ Instant Zero-Login Tools
              </span>
            </div>
          </div>

          {/* Finance & Tax */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5 m-0">
              Finance &amp; Tax Calculators
            </h2>
            <ul className="list-none p-0 m-0 space-y-2">
              {FINANCE_LINKS.map(item => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-xs text-slate-400 hover:text-indigo-300 transition-colors no-underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Utilities & AI */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5 m-0">
              Developer, AI &amp; Everyday Tools
            </h2>
            <ul className="list-none p-0 m-0 space-y-2">
              {UTILITY_LINKS.map(item => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-xs text-slate-400 hover:text-indigo-300 transition-colors no-underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hubs, Academy & Games */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5 m-0">
              Explore Hubs
            </h2>
            <ul className="list-none p-0 m-0 space-y-2">
              {HUBS_AND_GAMES.map(item => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-xs text-slate-400 hover:text-indigo-300 transition-colors no-underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Sitemap Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="m-0">
            © {new Date().getFullYear()} <strong className="text-slate-200 font-semibold">UpTools</strong> (uptools.in). Built for speed, accuracy &amp; privacy.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/about/" className="hover:text-white transition-colors no-underline text-slate-400">About</Link>
            <Link to="/contact/" className="hover:text-white transition-colors no-underline text-slate-400">Contact</Link>
            <Link to="/privacy-policy/" className="hover:text-white transition-colors no-underline text-slate-400">Privacy Policy</Link>
            <Link to="/all-tools/" className="hover:text-white transition-colors no-underline text-slate-400">A–Z Directory</Link>
            <a href="/sitemap.xml" className="hover:text-white transition-colors no-underline text-slate-400">XML Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
