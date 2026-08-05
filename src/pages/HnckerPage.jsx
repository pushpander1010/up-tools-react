import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import InfiniteCarousel from '../components/InfiniteCarousel'

const tools = [
  { slug: 'apkleaks', name: 'APKLeaks', img: '/assets/tools/apkleaks/apkleaks_scan.png', alt: 'APKLeaks scanning an Android APK file in the terminal', desc: 'Scan Android APK files to extract URLs, API endpoints and hardcoded secrets.', tag: 'APK scanner', accent: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(57,255,20,0.08))' },
  { slug: 'ahmyth', name: 'AhMyth', img: '/assets/tools/ahmyth/ahmyth_logo.png', alt: 'AhMyth Android remote administration tool logo', desc: 'Open-source Android remote administration tool built with Electron & React.', tag: 'RAT framework', accent: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(6,182,212,0.08))' },
  { slug: 'mosint', name: 'Mosint', img: '/assets/tools/mosint/mosint_logo.png', alt: 'Mosint automated email OSINT tool logo', desc: 'Fast Go-based email OSINT tool — validate emails and surface public info.', tag: 'Email OSINT', accent: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(34,211,238,0.08))' },
  { slug: 'phunter', name: 'Phunter', img: '/assets/tools/phunter/phunter_logo.png', alt: 'Phunter phone number OSINT tool logo', desc: 'Python phone-number OSINT tool to look up public details from the terminal.', tag: 'Phone OSINT', accent: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.08))' },
  { slug: 'nuclei', name: 'Nuclei', img: '/assets/tools/nuclei/nuclei_logo.png', alt: 'Nuclei vulnerability scanner logo', desc: 'Fast template-driven vulnerability scanner from ProjectDiscovery.', tag: 'Vuln scanner', accent: 'linear-gradient(135deg, rgba(0,255,65,0.2), rgba(6,182,212,0.08))' },
  { slug: 'hping3', name: 'hping3', img: '/assets/tools/hping3/hping3_logo.png', alt: 'hping3 packet crafting tool logo', desc: 'Craft raw TCP/UDP/ICMP packets, scan ports and stress-test firewalls.', tag: 'Packet crafting', accent: 'linear-gradient(135deg, rgba(0,255,65,0.2), rgba(6,182,212,0.08))' },
  { slug: 'subfinder', name: 'Subfinder', img: '/assets/tools/subfinder/subfinder_logo.png', alt: 'Subfinder subdomain discovery logo', desc: 'Passive subdomain discovery from dozens of public sources.', tag: 'Subdomain recon', accent: 'linear-gradient(135deg, rgba(0,255,65,0.2), rgba(0,200,180,0.08))' },
  { slug: 'ffuf', name: 'ffuf', img: '/assets/tools/ffuf/ffuf_logo.png', alt: 'ffuf web fuzzer logo', desc: 'Fast web fuzzer for content discovery, parameters and login brute force.', tag: 'Web fuzzer', accent: 'linear-gradient(135deg, rgba(0,255,65,0.2), rgba(0,200,180,0.08))' },
  { slug: 'hashcat', name: 'Hashcat', img: '/assets/tools/hashcat/hashcat_logo.png', alt: 'Hashcat password cracker logo', desc: 'GPU-accelerated password recovery — dictionary, brute-force and rules.', tag: 'Password cracker', accent: 'linear-gradient(135deg, rgba(0,255,65,0.2), rgba(0,200,180,0.08))' },
  { slug: 'ai-agent-escape', name: 'AI Agent Escape', img: '/assets/tools/ai_agent_escape/ai_agent_escape_logo.png', alt: 'AI agent sandbox escape logo', desc: 'How container sandbox escapes work — and how to contain AI agents with gVisor.', tag: 'Sandbox escape', accent: 'linear-gradient(135deg, rgba(0,255,65,0.2), rgba(0,200,180,0.08))' },
  { slug: 'strix', name: 'STRIX', img: '/assets/tools/strix/strix_logo.png', alt: 'STRIX AI penetration testing tool logo', desc: 'Open-source AI pentest with autonomous agents and zero false positives.', tag: 'AI Pentest', accent: 'linear-gradient(135deg, rgba(0,255,65,0.2), rgba(0,200,180,0.08))' },
]

const androidApps = [
  { name: 'WiFi Analyzer', pkg: 'com.wifi_analyzer', icon: '📶', iconBg: 'rgba(6,182,212,0.15)', iconBorder: 'rgba(6,182,212,0.2)', desc: 'Scan networks, find the best channel, test speed.', feats: ['Live WiFi scanner & channel graph', 'Speed test + signal strength', 'No account, works offline'], apk: '/assets/apks/wifi-analyzer.apk' },
  { name: 'NetShield', pkg: 'com.hncker.adblocker', icon: '🛡️', iconBg: 'rgba(57,255,20,0.15)', iconBorder: 'rgba(57,255,20,0.2)', desc: 'No-root local-VPN ad & tracker blocker.', feats: ['System-wide ad & tracker blocking', 'Local VPN — no root required', 'Privacy-first, no data sold'], apk: '/assets/apks/netshield.apk' },
]

const favouriteApps = [
  { name: 'Bitwarden', icon: '🔐', desc: 'Open-source password manager — every account gets a unique password.', url: 'https://bitwarden.com' },
  { name: 'ProtonVPN', icon: '🧅', desc: 'Privacy-first VPN with no-logs policy and free tier.', url: 'https://protonvpn.com' },
  { name: 'Signal', icon: '💬', desc: 'Encrypted messaging that keeps your chats truly private.', url: 'https://signal.org' },
  { name: 'Mullvad', icon: '🦊', desc: 'Simple, anonymous VPN — no account, just a number.', url: 'https://mullvad.net' },
  { name: 'NewPipe', icon: '▶️', desc: 'Ad-free YouTube player, background playback, downloads.', url: 'https://newpipe.net' },
  { name: 'VLC', icon: '🎬', desc: 'Open-source media player that plays basically anything.', url: 'https://www.videolan.org' },
  { name: 'DuckDuckGo', icon: '🦆', desc: 'Private browser that blocks trackers by default.', url: 'https://duckduckgo.com' },
  { name: 'NetGuard', icon: '🚧', desc: 'No-root firewall to block apps from the internet.', url: 'https://www.netguard.me' },
]

const ytVideos = [
  { id: 'E-6uJ0j3xMo', title: 'Subfinder Tutorial — Find Every Subdomain (Full Guide) | HNCKER', sub: 'Web recon · subdomain discovery' },
  { id: 'H8dwJpti6jg', title: 'ffuf Tutorial — Find Hidden Pages & Directories (Full Guide) | HNCKER', sub: 'Content discovery · web fuzzing' },
  { id: 'wB-Jvz__0B4', title: 'Hashcat Tutorial — Crack Passwords with GPU (Full Guide) | HNCKER', sub: 'Password recovery · GPU cracking' },
]

const igReels = [
  { img: '/assets/tools/hashcat/hashcat_scan.png', caption: 'This tool can crack any password. 🔑', tag: 'Hashcat' },
  { img: '/assets/tools/ffuf/ffuf_scan.png', caption: 'A website hides thousands of pages. This finds them in seconds. 🔎', tag: 'ffuf' },
  { img: '/assets/tools/subfinder/subfinder_scan.png', caption: 'Imagine you\'re hacking a website. Where do you start? 🌐', tag: 'Subfinder' },
  { img: '/assets/tools/strix/strix_logo.png', caption: 'Want to hack like a pro? This AI does it for you. 🤖', tag: 'STRIX' },
  { img: '/assets/tools/ai_agent_escape/ai_agent_escape_logo.png', caption: 'An AI agent just escaped its own sandbox 🧊💥', tag: 'AI Escape' },
  { img: '/assets/tools/ai_agent_escape/ai_agent_escape_scan.png', caption: 'Claude escaped its sandbox and hacked 3 real companies 🧊', tag: 'Claude Story' },
]

export default function HnckerPage() {
  return (
    <>
      <Helmet>
        <title>HNCKER - Apps, Tools, Instagram & Videos</title>
        <meta name="description" content="Follow HNCKER on Instagram, browse the free security tools, watch our tech videos, and download free Android apps." />
        <link rel="canonical" href="https://www.uptools.in/hncker/" />
        <meta property="og:title" content="HNCKER - Apps, Tools, Instagram & Videos | UpTools" />
        <meta property="og:description" content="Follow HNCKER on Instagram, browse the free security tools, watch our tech videos, and download free Android apps." />
        <meta property="og:url" content="https://www.uptools.in/hncker/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="HNCKER - Apps, Tools, Instagram & Videos | UpTools" />
        <meta name="twitter:description" content="Follow HNCKER on Instagram, browse the free security tools, watch our tech videos, and download free Android apps." />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">HNCKER</span>
      </nav>

      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-neon-border p-8 sm:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(57,255,20,0.06), rgba(17,24,39,0.3))' }}>
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(57,255,20,0.12), transparent 70%)' }} />
        <div className="relative flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #39ff14, #00ffa3)', color: '#080d1a', boxShadow: '0 8px 32px rgba(57,255,20,0.3)' }}>HN</div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight m-0"
              style={{ background: 'linear-gradient(135deg, #39ff14, #00ffa3, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HNCKER</h1>
            <p className="text-slate-400 text-sm mt-1">No-nonsense tech, tools, apps & videos.</p>
          </div>
        </div>
        <div className="relative flex flex-wrap gap-2 mt-5">
          <a href="https://aistudio.instagram.com/ai/882454998272846/?utm_source=share" target="_blank" rel="noopener"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-neon/30 text-neon hover:bg-neon/10 hover:border-neon/50 transition-all no-underline">🤖 Hncker AI</a>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">🛠️ {tools.length} free tools</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">📱 {androidApps.length} Android apps</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">🎬 Weekly videos</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">📸 Instagram</span>
        </div>
      </div>

      {/* Hncker AI CTA */}
      <a href="https://aistudio.instagram.com/ai/882454998272846/?utm_source=share" target="_blank" rel="noopener"
        className="glass rounded-3xl p-7 mb-6 flex flex-col sm:flex-row items-center justify-between gap-5 no-underline group hover:border-neon/40 transition-all"
        style={{ background: 'linear-gradient(135deg, rgba(57,255,20,0.08), rgba(6,182,212,0.05))', borderColor: 'rgba(57,255,20,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(57,255,20,0.25), rgba(6,182,212,0.2))', border: '1px solid rgba(57,255,20,0.3)' }}>🤖</div>
          <div>
            <h2 className="text-xl font-bold m-0">Chat with Hncker AI</h2>
            <p className="text-xs text-slate-400 mt-1 m-0">Got a doubt or need real code? Ask the official Hncker AI assistant on Instagram.</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shrink-0"
          style={{ background: 'linear-gradient(135deg, #39ff14, #00ffa3)', color: '#080d1a' }}>Try it now ↗</span>
      </a>

      {/* Instagram CTA */}
      <div className="glass rounded-3xl p-7 mb-6 flex flex-col sm:flex-row items-center justify-between gap-5"
        style={{ background: 'linear-gradient(135deg, rgba(253,186,116,0.04), rgba(214,41,118,0.04), rgba(150,47,191,0.04))', borderColor: 'rgba(214,41,118,0.12)' }}>
        <div>
          <h2 className="text-xl font-bold m-0">Follow us on Instagram</h2>
          <div className="text-xl font-extrabold my-1"
            style={{ background: 'linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>@hncker</div>
          <div className="flex gap-6 mt-2">
            <div className="text-center"><b className="block text-white text-lg">16.2K</b><span className="text-[11px] text-slate-400 uppercase tracking-wider">followers</span></div>
            <div className="text-center"><b className="block text-white text-lg">Cyber/AI</b><span className="text-[11px] text-slate-400 uppercase tracking-wider">niche</span></div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="https://www.instagram.com/hncker" target="_blank" rel="noopener" className="glow-btn text-sm px-5 py-2.5 rounded-xl no-underline"
            style={{ background: 'linear-gradient(92deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)' }}>Instagram ↗</a>
          <a href="https://www.youtube.com/@hncker" target="_blank" rel="noopener" className="glow-btn text-sm px-5 py-2.5 rounded-xl no-underline"
            style={{ background: '#ff0000' }}>▶ YouTube</a>
          <a href="https://www.facebook.com/hncker" target="_blank" rel="noopener" className="glow-btn text-sm px-5 py-2.5 rounded-xl no-underline"
            style={{ background: '#1877f2' }}>Facebook ↗</a>
          <a href="https://www.threads.net/@hncker" target="_blank" rel="noopener" className="glow-btn text-sm px-5 py-2.5 rounded-xl no-underline"
            style={{ background: '#000', border: '1px solid rgba(255,255,255,0.15)' }}>Threads ↗</a>
        </div>
      </div>

      {/* Tools — Infinite Carousel */}
      <div className="glass rounded-3xl mb-6 overflow-hidden" style={{ borderColor: 'rgba(57,255,20,0.1)' }}>
        <div className="px-6 pt-6 pb-4 flex items-center justify-between gap-3 flex-wrap">
          <div><h2 className="text-xl font-bold m-0">🛠️ HNCKER Tools</h2><p className="text-xs text-slate-400 mt-1">Real guides with working examples — drag or swipe to browse.</p></div>
        </div>
        <div className="px-6 pb-6">
          <InfiniteCarousel gap={16}>
            {tools.map(t => (
              <div key={t.slug} className="flex-none w-[340px] p-5 rounded-2xl flex flex-col"
                style={{ background: t.accent, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <img src={t.img} alt={t.alt} loading="lazy"
                    className="w-14 h-14 rounded-xl object-contain bg-black/30 p-1 border border-white/10"
                    style={{ background: 'rgba(0,0,0,0.35)' }} />
                  <div>
                    <h3 className="text-lg font-bold m-0">{t.name}</h3>
                    <span className="text-[11px] text-neon font-semibold uppercase tracking-wider">{t.tag}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-4 flex-1">{t.desc}</p>
                <div className="flex gap-2 flex-wrap">
                  <Link to={`/hncker/${t.slug}/`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline"
                    style={{ background: 'linear-gradient(135deg, #39ff14, #00ffa3)', color: '#080d1a' }}>📖 View Guide</Link>
                  <a href={`https://www.youtube.com/@hncker`} target="_blank" rel="noopener"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:border-neon/40 transition-all">▶ Tutorial</a>
                </div>
              </div>
            ))}
          </InfiniteCarousel>
        </div>
      </div>

      {/* Android Apps — Infinite Carousel */}
      <div className="glass rounded-3xl mb-6 overflow-hidden" style={{ borderColor: 'rgba(57,255,20,0.1)' }}>
        <div className="px-6 pt-6 pb-4"><h2 className="text-xl font-bold m-0">📱 Our Android Apps</h2><p className="text-xs text-slate-400 mt-1">Free, open, privacy-first — built by HNCKER.</p></div>
        <div className="px-6 pb-6">
          <InfiniteCarousel gap={16}>
            {androidApps.map(app => (
              <div key={app.name} className="flex-none w-[340px] p-5 rounded-2xl" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${app.iconBorder}` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: app.iconBg, border: `1px solid ${app.iconBorder}` }}>{app.icon}</div>
                  <div><h3 className="text-lg font-bold m-0">{app.name}</h3><span className="text-xs text-slate-400 font-mono">{app.pkg}</span></div>
                </div>
                <p className="text-xs text-slate-400 mb-3">{app.desc}</p>
                <ul className="list-none p-0 m-0 space-y-1.5">
                  {app.feats.map(f => <li key={f} className="text-xs text-slate-400 flex items-center gap-2"><span className="text-neon font-bold">▸</span>{f}</li>)}
                </ul>
                <a href={app.apk} download className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-sm font-bold no-underline"
                  style={{ background: 'linear-gradient(135deg, #39ff14, #00ffa3)', color: '#080d1a' }}>⬇ Download APK</a>
              </div>
            ))}
          </InfiniteCarousel>
        </div>
      </div>

      {/* My Favourite Apps — Infinite Carousel */}
      <div className="glass rounded-3xl mb-6 overflow-hidden" style={{ borderColor: 'rgba(57,255,20,0.1)' }}>
        <div className="px-6 pt-6 pb-4"><h2 className="text-xl font-bold m-0">⭐ My Favourite Apps</h2><p className="text-xs text-slate-400 mt-1">Apps I actually use and recommend.</p></div>
        <div className="px-6 pb-6">
          <InfiniteCarousel gap={14}>
            {favouriteApps.map(app => (
              <a key={app.name} href={app.url} target="_blank" rel="noopener"
                className="flex-none w-[250px] p-4 rounded-2xl no-underline group hover:border-neon/30 transition-all"
                style={{ background: 'rgba(17,24,39,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.18)' }}>{app.icon}</div>
                  <div><h3 className="text-base font-bold m-0 group-hover:text-neon transition-colors">{app.name}</h3><span className="text-[10px] text-slate-500 uppercase tracking-wider">favourite</span></div>
                </div>
                <p className="text-xs text-slate-400 m-0">{app.desc}</p>
              </a>
            ))}
          </InfiniteCarousel>
        </div>
      </div>

      {/* Latest YouTube Videos (not shorts) — Infinite Carousel */}
      <div className="glass rounded-3xl mb-6 overflow-hidden" style={{ borderColor: 'rgba(57,255,20,0.1)' }}>
        <div className="px-6 pt-6 pb-4 flex items-center justify-between gap-3 flex-wrap">
          <div><h2 className="text-xl font-bold m-0">🎬 Latest YouTube Videos</h2><p className="text-xs text-slate-400 mt-1">Full tutorials — not shorts.</p></div>
          <a href="https://www.youtube.com/@hncker" target="_blank" rel="noopener"
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/4 border border-white/8 text-slate-400 hover:text-white hover:border-white/12 transition-all no-underline">All on YouTube ↗</a>
        </div>
        <div className="px-6 pb-6">
          <InfiniteCarousel gap={16}>
            {ytVideos.map(v => (
              <a key={v.id} href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener"
                className="flex-none w-[300px] rounded-2xl overflow-hidden border border-white/8 hover:border-neon/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-neon/5 no-underline group"
                style={{ background: 'rgba(17,24,39,0.6)' }}>
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt={v.title} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute inset-0 flex items-center justify-center text-4xl text-white bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">▶</span>
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold text-white line-clamp-2 mb-1">{v.title}</div>
                  <div className="text-xs text-slate-400">{v.sub}</div>
                </div>
              </a>
            ))}
          </InfiniteCarousel>
        </div>
      </div>

      {/* Latest Instagram Reels — Infinite Carousel */}
      <div className="glass rounded-3xl mb-6 overflow-hidden" style={{ borderColor: 'rgba(214,41,118,0.12)' }}>
        <div className="px-6 pt-6 pb-4 flex items-center justify-between gap-3 flex-wrap">
          <div><h2 className="text-xl font-bold m-0">📸 Latest Instagram Reels</h2><p className="text-xs text-slate-400 mt-1">Quick 30-second lessons from the feed.</p></div>
          <a href="https://www.instagram.com/hncker" target="_blank" rel="noopener"
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/4 border border-white/8 text-slate-400 hover:text-white hover:border-white/12 transition-all no-underline">All reels ↗</a>
        </div>
        <div className="px-6 pb-6">
          <InfiniteCarousel gap={16}>
            {igReels.map((r, i) => (
              <a key={i} href="https://www.instagram.com/hncker" target="_blank" rel="noopener"
                className="flex-none w-[220px] rounded-2xl overflow-hidden border border-white/8 hover:border-[#d62976]/40 transition-all hover:-translate-y-1 hover:shadow-xl no-underline group"
                style={{ background: 'rgba(17,24,39,0.6)' }}>
                <div className="relative aspect-[9/16] bg-black overflow-hidden">
                  <img src={r.img} alt={r.caption} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute inset-0 flex items-center justify-center text-4xl text-white bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">▶</span>
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'linear-gradient(92deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)', color: '#fff' }}>{r.tag}</span>
                </div>
                <div className="p-3">
                  <div className="text-xs font-medium text-white line-clamp-2">{r.caption}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">@hncker · reel</div>
                </div>
              </a>
            ))}
          </InfiniteCarousel>
        </div>
      </div>
    </>
  )
}
