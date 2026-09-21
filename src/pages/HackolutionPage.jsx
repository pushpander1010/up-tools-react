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
  { slug: 'exif', name: 'ExifTool', img: '/assets/tools/exif/exif_logo.png', alt: 'ExifTool image metadata logo', desc: 'Read and strip EXIF metadata — camera, software, GPS — from images.', tag: 'Image metadata', accent: 'linear-gradient(135deg, rgba(27,255,110,0.2), rgba(0,200,180,0.08))' },
  { slug: 'whatsosint', name: 'WhatsOSINT', img: '/assets/tools/whatsosint/whatsosint_logo.png', alt: 'WhatsOSINT WhatsApp number lookup tool logo', desc: 'Check if a phone number is on WhatsApp and pull its public profile data.', tag: 'WhatsApp OSINT', accent: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(27,255,110,0.08))' },
  { slug: 'phunter', name: 'Phunter', img: '/assets/tools/phunter/phunter_logo.png', alt: 'Phunter phone number OSINT tool logo', desc: 'Python phone-number OSINT tool to look up public details from the terminal.', tag: 'Phone OSINT', accent: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.08))' },
  { slug: 'theharvester', name: 'theHarvester', img: '/assets/tools/theharvester/theharvester_logo.png', alt: 'theHarvester OSINT collector logo', desc: 'Harvest emails and subdomains for your domain from public sources.', tag: 'OSINT collector', accent: 'linear-gradient(135deg, rgba(255,204,0,0.2), rgba(27,255,110,0.08))' },
  { slug: 'seeker', name: 'Seeker', img: '/assets/tools/seeker/seeker_logo.png', alt: 'Seeker smartphone locator logo', desc: 'Understand how Seeker locates a smartphone via a location-permission page — and how to protect yourself.', tag: 'GPS locator', accent: 'linear-gradient(135deg, rgba(27,255,110,0.2), rgba(6,182,212,0.08))' },
  { slug: 'hydra', name: 'Hydra', img: '/assets/tools/hydra/hydra_logo.png', alt: 'Hydra login brute-forcer logo', desc: 'Brute-force SSH, FTP and web logins on lab VMs with Hydra and wordlists.', tag: 'Login brute-forcer', accent: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(27,255,110,0.08))' },
  { slug: 'burp', name: 'Burp Suite', img: '/assets/tools/burp/burp_logo.png', alt: 'Burp Suite web proxy logo', desc: 'Intercept and replay web traffic: proxy, Repeater, Intruder on lab apps.', tag: 'Web proxy', accent: 'linear-gradient(135deg, rgba(179,102,255,0.2), rgba(27,255,110,0.08))' },
  { slug: 'metasploit', name: 'Metasploit', img: '/assets/tools/metasploit/metasploit_logo.png', alt: 'Metasploit exploit framework logo', desc: 'Exploit lab VMs: msfconsole, exploit + payload, Meterpreter basics.', tag: 'Exploit framework', accent: 'linear-gradient(135deg, rgba(255,204,0,0.2), rgba(27,255,110,0.08))' },
  { slug: 'aircrack', name: 'Aircrack-ng', img: '/assets/tools/aircrack/aircrack_logo.png', alt: 'Aircrack-ng WiFi auditor logo', desc: 'Audit your own WiFi: monitor mode, handshake capture, passphrase test.', tag: 'WiFi auditor', accent: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(27,255,110,0.08))' },
  { slug: 'wireshark', name: 'Wireshark', img: '/assets/tools/wireshark/wireshark_logo.png', alt: 'Wireshark packet analyzer logo', desc: 'Capture and read packets: filters, TCP streams, plaintext vs TLS.', tag: 'Packet analyzer', accent: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(27,255,110,0.08))' },
  { slug: 'ddos', name: 'DDoS', img: '/assets/tools/ddos/ddos_logo.png', alt: 'DDoS attack breakdown logo', desc: 'How DDoS floods work — botnets, impact and defense layers.', tag: 'Attack defense', accent: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(27,255,110,0.08))' },
  { slug: 'hping3', name: 'hping3', img: '/assets/tools/hping3/hping3_logo.png', alt: 'hping3 packet crafter logo', desc: 'Craft TCP/UDP packets: port scans, firewall tests, flood labs.', tag: 'Packet crafter', accent: 'linear-gradient(135deg, rgba(255,204,0,0.2), rgba(27,255,110,0.08))' },
  { slug: 'mosint', name: 'Mosint', img: '/assets/tools/mosint/mosint_logo.png', alt: 'Mosint email OSINT logo', desc: 'Map email addresses to breach dumps and linked accounts.', tag: 'Email OSINT', accent: 'linear-gradient(135deg, rgba(255,102,204,0.2), rgba(27,255,110,0.08))' },
  { slug: 'apkleaks', name: 'APKLeaks', img: '/assets/tools/apkleaks/apkleaks_output.png', alt: 'APKLeaks APK secrets scanner logo', desc: 'Scan APK files for secrets, endpoints and hardcoded keys.', tag: 'APK scanner', accent: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(27,255,110,0.08))' },
  { slug: 'ffuf', name: 'ffuf', img: '/assets/tools/ffuf/ffuf_logo.png', alt: 'ffuf web fuzzer logo', desc: 'Fuzz hidden pages and directories on lab apps with wordlists.', tag: 'Web fuzzer', accent: 'linear-gradient(135deg, rgba(27,255,110,0.2), rgba(0,200,180,0.08))' },
]

// YouTube videos from the HNCKER channel (@hncker) — newest first, Sep 2026
const ytVideos = [
  { id: 'M6Ayf2vQusg', title: 'SQLMap Full Tutorial — Database Hacking Explained Step by Step | HNCKER', sub: 'SQL injection · database hacking' },
  { id: 'TrgZxWYMLMc', title: 'Netcat Full Tutorial — Swiss Army Knife Explained Step by Step | HNCKER', sub: 'Networking · shells & transfers' },
  { id: 'rzjEnnUSBOU', title: 'Nmap Full Tutorial — Network Scanning Explained Step by Step | HNCKER', sub: 'Network scanner · recon' },
  { id: 'ZNo_K3bMIZo', title: 'How to Use Metasploit: Complete Beginner to Pro Guide | HNCKER', sub: 'Exploit framework · Meterpreter' },
  { id: 'qeMPvVaS7vQ', title: 'Wireshark Full Tutorial — Capture Filter and Analyze Packets | HNCKER', sub: 'Packet analyzer · filters' },
  { id: '9O7mMNf2NUc', title: 'GhostTrack Tutorial — Phone IP and Username OSINT Explained | HNCKER', sub: 'OSINT · phone & IP tracking' },
  { id: '4G1FpK9HWz8', title: 'What is a DDoS Attack? Full Breakdown | HNCKER', sub: 'DDoS layers · defense' },
  { id: 'V-VIp0P5ZTw', title: 'What is hping3 | HPing3 Tutorial — Packet Crafting & Network Testing | HNCKER', sub: 'Packet crafting · firewall testing' },
  { id: 'cpQo8hKoql0', title: 'Seeker GPS Tracking — How Hackers Track a Phone With One Link | HNCKER', sub: 'GPS locator · defense' },
  { id: 'twT8WPbr2sk', title: 'How Hackers Find Vulnerabilities — The 6-Step Method Explained | HNCKER', sub: 'Vuln hunting · method' },
  { id: 'iS_wySR3soo', title: 'Net-C2 Tutorial — Command and Control Framework Explained | HNCKER', sub: 'Botnet C2 · how it works' },
  { id: 'VZK6huQ0NvQ', title: 'WhatsOSINT Tutorial — Check if a Number Is on WhatsApp | HNCKER', sub: 'WhatsApp OSINT · number lookup' },
  { id: 'mprTO_jh0QA', title: 'How to Root Android the Right Way | Magisk Bootloader Full Guide | HNCKER', sub: 'Rooting · Magisk guide' },
  { id: 'GKoWjCmPZEM', title: 'Pegasus Pro Tutorial | Android Penetration Testing Toolkit Explained | HNCKER', sub: 'Android pentest · toolkit' },
  { id: '51LOrmRV8Uk', title: 'STRIX Tutorial | AI Penetration Testing Framework Explained | HNCKER', sub: 'AI pentest · autonomous agents' },
  { id: 'AR7f6Ln-MHY', title: 'ExifTool Tutorial | Extract Hidden Photo Data and GPS Location | HNCKER', sub: 'Image metadata · privacy' },
  { id: 'wB-Jvz__0B4', title: 'Hashcat Tutorial | How Hackers Crack Passwords with GPU | HNCKER', sub: 'Password recovery · GPU cracking' },
  { id: 'H8dwJpti6jg', title: 'ffuf Tutorial | Find Hidden Pages and Directories Full Guide | HNCKER', sub: 'Content discovery · web fuzzing' },
  { id: 'E-6uJ0j3xMo', title: 'Subfinder Tutorial | Find Every Subdomain of a Website | HNCKER', sub: 'Web recon · subdomain discovery' },
  { id: '7e9CTa9sVmE', title: 'APKLeaks Tutorial | Scan APK Files for Secrets and Endpoints | HNCKER', sub: 'APK scanner · secrets' },
]

// Instagram reels are @hackolution only (verified link; more added as they publish)
const igReels = [
  { sc: 'DdeDctagX3Q', title: 'Stop posting photos online until you watch this — hidden tracking data in every picture', views: 'See reel' },
]

export default function HackolutionPage() {
  return (
    <>
      <Helmet>
        <title>HACKOLUTION - Tools, Instagram & YouTube Videos</title>
        <meta name="description" content="Follow HACKOLUTION on Instagram, browse the free security tools, and watch full tutorials on YouTube." />
        <link rel="canonical" href="https://www.uptools.in/hackolution/" />
        <meta property="og:title" content="HACKOLUTION - Tools, Instagram & YouTube Videos | UpTools" />
        <meta property="og:description" content="Follow HACKOLUTION on Instagram, browse the free security tools, and watch full tutorials on YouTube." />
        <meta property="og:url" content="https://www.uptools.in/hackolution/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="HACKOLUTION - Tools, Instagram & YouTube Videos | UpTools" />
        <meta name="twitter:description" content="Follow HACKOLUTION on Instagram, browse the free security tools, and watch full tutorials on YouTube." />
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
            <p className="text-slate-400 text-sm mt-1">No-nonsense hacking, tools & videos.</p>
          </div>
        </div>
        <div className="relative flex flex-wrap gap-2 mt-5">
          <a href="https://www.instagram.com/hackolution" target="_blank" rel="noopener"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-neon/30 text-neon hover:bg-neon/10 hover:border-neon/50 transition-all no-underline">📸 @hackolution</a>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">🛠️ {tools.length} free tools</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">🎬 Weekly videos</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">📸 Instagram</span>
        </div>
      </div>

      {/* Instagram CTA */}
      <div className="glass rounded-3xl p-7 mb-6 flex flex-col sm:flex-row items-center justify-between gap-5"
        style={{ background: 'linear-gradient(135deg, rgba(253,186,116,0.04), rgba(214,41,118,0.04), rgba(150,47,191,0.04))', borderColor: 'rgba(214,41,118,0.12)' }}>
        <div>
          <h2 className="text-xl font-bold m-0">Follow us on Instagram</h2>
          <div className="text-xl font-extrabold my-1"
            style={{ background: 'linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>@hackolution</div>
          <div className="flex gap-6 mt-2">
            <div className="text-center"><b className="block text-white text-lg">19.6K</b><span className="text-[11px] text-slate-400 uppercase tracking-wider">followers</span></div>
            <div className="text-center"><b className="block text-white text-lg">Cyber/AI</b><span className="text-[11px] text-slate-400 uppercase tracking-wider">niche</span></div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="https://www.instagram.com/hackolution" target="_blank" rel="noopener" className="glow-btn text-sm px-5 py-2.5 rounded-xl no-underline"
            style={{ background: 'linear-gradient(92deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)' }}>Instagram ↗</a>
          <a href="https://www.youtube.com/@hncker" target="_blank" rel="noopener" className="glow-btn text-sm px-5 py-2.5 rounded-xl no-underline"
            style={{ background: '#ff0000' }}>▶ YouTube</a>
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
                  <a href={`https://www.youtube.com/@hncker`} target="_blank" rel="noopener"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:border-neon/40 transition-all">▶ Tutorial</a>
                </div>
              </div>
            ))}
          </InfiniteCarousel>
        </div>
      </div>

      {/* Latest YouTube Videos — Infinite Carousel (HNCKER channel) */}
      <div className="glass rounded-3xl mb-6 overflow-hidden" style={{ borderColor: 'rgba(27,255,110,0.1)' }}>
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

      {/* Latest Instagram Reels — @hackolution */}
      <div className="glass rounded-3xl mb-6 overflow-hidden" style={{ borderColor: 'rgba(214,41,118,0.12)' }}>
        <div className="px-6 pt-6 pb-4 flex items-center justify-between gap-3 flex-wrap">
          <div><h2 className="text-xl font-bold m-0">📸 Latest Instagram Reels</h2><p className="text-xs text-slate-400 mt-1">Quick lessons from @hackolution.</p></div>
          <a href="https://www.instagram.com/hackolution" target="_blank" rel="noopener"
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/4 border border-white/8 text-slate-400 hover:text-white hover:border-white/12 transition-all no-underline">All reels ↗</a>
        </div>
        <div className="px-6 pb-6">
          <InfiniteCarousel gap={16}>
            {igReels.map((r) => (
              <a key={r.sc} href={`https://www.instagram.com/reel/${r.sc}/`} target="_blank" rel="noopener"
                className="flex-none w-[300px] rounded-2xl overflow-hidden border border-white/8 hover:border-[#d62976]/40 transition-all hover:-translate-y-1 hover:shadow-xl no-underline group"
                style={{ background: 'linear-gradient(135deg, rgba(214,41,118,0.12), rgba(17,24,39,0.6))' }}>
                <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
                  <span className="text-4xl text-white bg-black/30 group-hover:scale-110 transition-transform duration-300">▶</span>
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold text-white line-clamp-2 mb-1">{r.title}</div>
                  <div className="text-xs text-slate-400">@hackolution · Instagram Reel</div>
                </div>
              </a>
            ))}
          </InfiniteCarousel>
        </div>
      </div>
    </>
  )
}
