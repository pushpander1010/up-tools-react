import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import InfiniteCarousel from '../components/InfiniteCarousel'

const tools = [
  { slug: 'nmap', name: 'Nmap', img: '/assets/tools/nmap/nmap_logo.png', alt: 'Nmap network scanner logo', desc: 'Map networks: host discovery, SYN scans, service and OS detection.', tag: 'Network scanner', accent: 'linear-gradient(135deg, rgba(27,255,110,0.2), rgba(0,200,180,0.08))' },
  { slug: 'subfinder', name: 'Subfinder', img: '/assets/tools/subfinder/subfinder_logo.png', alt: 'Subfinder subdomain discovery logo', desc: 'Passive subdomain discovery from dozens of public sources.', tag: 'Subdomain recon', accent: 'linear-gradient(135deg, rgba(27,255,110,0.2), rgba(0,200,180,0.08))' },
  { slug: 'sherlock', name: 'Sherlock', img: '/assets/tools/sherlock/sherlock_logo.png', alt: 'Sherlock username hunter logo', desc: 'Check your username across 400+ sites and clean your footprint.', tag: 'Username OSINT', accent: 'linear-gradient(135deg, rgba(179,102,255,0.2), rgba(27,255,110,0.08))' },
  { slug: 'hashcat', name: 'Hashcat', img: '/assets/tools/hashcat/hashcat_logo.png', alt: 'Hashcat password cracker logo', desc: 'GPU-accelerated password recovery — dictionary, brute-force and rules.', tag: 'Password cracker', accent: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(27,255,110,0.08))' },
  { slug: 'sqlmap', name: 'SQLMap', img: '/assets/tools/sqlmap/sqlmap_logo.png', alt: 'SQLMap SQL injection tester logo', desc: 'Automate SQL injection on lab apps — confirm, enumerate, dump.', tag: 'SQL injection', accent: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(0,200,180,0.08))' },
  { slug: 'holehe', name: 'Holehe', img: '/assets/tools/holehe/holehe_logo.png', alt: 'Holehe email checker logo', desc: 'Check where your email is registered across 120+ sites.', tag: 'Email OSINT', accent: 'linear-gradient(135deg, rgba(255,102,204,0.2), rgba(27,255,110,0.08))' },
]

export default function HackolutionPage() {
  return (
    <>
      <Helmet>
        <title>HACKOLUTION - Hacking Tools, Apps, Instagram & Videos</title>
        <meta name="description" content="Follow HACKOLUTION on Instagram for hacking, tools and tech videos. New content coming soon." />
        <link rel="canonical" href="https://www.uptools.in/hackolution/" />
        <meta property="og:title" content="HACKOLUTION - Hacking Tools, Apps, Instagram & Videos | UpTools" />
        <meta property="og:description" content="Follow HACKOLUTION on Instagram for hacking, tools and tech videos. New content coming soon." />
        <meta property="og:url" content="https://www.uptools.in/hackolution/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="HACKOLUTION - Hacking Tools, Apps, Instagram & Videos | UpTools" />
        <meta name="twitter:description" content="Follow HACKOLUTION on Instagram for hacking, tools and tech videos. New content coming soon." />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">HACKOLUTION</span>
      </nav>

      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-neon-border p-8 sm:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(27,255,110,0.06), rgba(17,24,39,0.3))' }}>
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(27,255,110,0.12), transparent 70%)' }} />
        <div className="relative flex items-center gap-5">
          <img src="/assets/logo/hackolution.png" alt="hackolution hooded hacker logo" width="64" height="64"
            className="w-16 h-16 rounded-2xl shrink-0 object-cover"
            style={{ boxShadow: '0 8px 32px rgba(27,255,110,0.35)', border: '1px solid rgba(27,255,110,0.4)' }} />
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight m-0 lowercase"><span className="text-white">hack</span><span style={{ color: '#1bff6e' }}>olution</span></h1>
            <p className="text-slate-400 text-sm mt-1">New content coming soon.</p>
          </div>
        </div>
        <div className="relative flex flex-wrap gap-2 mt-5">
          <a href="https://www.instagram.com/hackolution" target="_blank" rel="noopener"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-neon/30 text-neon hover:bg-neon/10 hover:border-neon/50 transition-all no-underline">📸 @hackolution</a>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">🛠️ {tools.length} free tools</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">🎬 Weekly reels</span>
        </div>
      </div>

      {/* Tools — Infinite Carousel */}
      <div className="glass rounded-3xl mb-6 overflow-hidden" style={{ borderColor: 'rgba(27,255,110,0.1)' }}>
        <div className="px-6 pt-6 pb-4 flex items-center justify-between gap-3 flex-wrap">
          <div><h2 className="text-xl font-bold m-0">🛠️ HACKOLUTION Tools</h2><p className="text-xs text-slate-400 mt-1">Real guides with working examples — drag or swipe to browse.</p></div>
        </div>
        <div className="px-6 pb-6">
          <InfiniteCarousel gap={16}>
            {tools.map(t => (
              <div key={t.slug} className="flex-none w-[340px] p-5 rounded-2xl flex flex-col"
                style={{ background: t.accent, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <img src={t.img} alt={t.alt} loading="lazy" width="56" height="56"
                    className="w-14 h-14 rounded-xl object-contain bg-black/30 p-1 border border-white/10"
                    style={{ background: 'rgba(0,0,0,0.35)' }} />
                  <div>
                    <h3 className="text-lg font-bold m-0">{t.name}</h3>
                    <span className="text-[11px] text-neon font-semibold uppercase tracking-wider">{t.tag}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-4 flex-1">{t.desc}</p>
                <div className="flex gap-2 flex-wrap">
                  <Link to={`/hackolution/${t.slug}/`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline"
                    style={{ background: 'linear-gradient(135deg, #1bff6e, #00ffa3)', color: '#080d1a' }}>📖 View Guide</Link>
                  <a href="https://www.instagram.com/hackolution" target="_blank" rel="noopener"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:border-neon/40 transition-all">▶ Reel</a>
                </div>
              </div>
            ))}
          </InfiniteCarousel>
        </div>
      </div>
    </>
  )
}
