import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import InfiniteCarousel from '../components/InfiniteCarousel'

const apps = [
  { name: 'Mouse Jiggler', file: 'mouse-jiggler-1.0.apk', img: '/assets/apps/mouse-jiggler.svg', ver: 'v1.0 · 5.6 MB', desc: 'Keeps screen awake, ad-free.', tag: 'Utility', accent: 'linear-gradient(135deg, rgba(21,101,192,0.2), rgba(27,255,110,0.08))' },
  { name: 'Scan&PDF', file: 'scanpdf-1.0.apk', img: '/assets/apps/scanpdf.svg', ver: 'v1.0 · 22 MB', desc: 'Document scanner to PDF, ad-free.', tag: 'Productivity', accent: 'linear-gradient(135deg, rgba(13,71,161,0.2), rgba(27,255,110,0.08))' },
  { name: 'NetShield Ad Blocker', file: 'netshield-1.3.apk', img: '/assets/apps/netshield.png', ver: 'v1.3 · 15 MB', desc: 'On-device ad blocking.', tag: 'Privacy & Security', accent: 'linear-gradient(135deg, rgba(27,255,110,0.2), rgba(6,182,212,0.08))' },
  { name: 'RecoveryPRO', file: 'recoverypro-2.1.apk', img: '/assets/apps/recoverypro.png', ver: 'v2.1 · 3.6 MB', desc: 'Deep recovery (SD/USB) + pro UI.', tag: 'System', accent: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(27,255,110,0.08))' },
  { name: 'WiFi Analyzer', file: 'wifi-analyzer-2.1.apk', img: '/assets/apps/wifi-analyzer.png', ver: 'v2.1 · 3.5 MB', desc: 'WiFi scanner + channel graph.', tag: 'Network OSINT', accent: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(27,255,110,0.08))' },
  { name: 'Tank Battle', file: 'tank-battle-1.2.apk', img: '/assets/apps/tank-battle.svg', ver: 'v1.2 · 11 MB', desc: 'Retro 2D arcade combat.', tag: 'Arcade Game', accent: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(255,204,0,0.08))' },
]

const tools = [
  { slug: 'amass', name: 'Amass', img: '/assets/tools/subfinder/subfinder_logo.png', alt: 'Amass subdomain mapper logo', desc: 'In-depth attack surface mapping and subdomain enumeration.', tag: 'Subdomain mapper', accent: 'linear-gradient(135deg, rgba(27,255,110,0.2), rgba(0,200,180,0.08))' },
  { slug: 'wifi-analyzer', name: 'WiFi Analyzer', img: '/assets/apps/wifi-analyzer.png', alt: 'WiFi Analyzer find who uses your WiFi logo', desc: 'Free Android app: list every phone on your WiFi, kick strangers off.', tag: 'WiFi scanner', accent: 'linear-gradient(135deg, rgba(27,255,110,0.2), rgba(0,200,180,0.08))' },
  { slug: 'nikto', name: 'Nikto', img: '/assets/tools/subfinder/subfinder_logo.png', alt: 'Nikto server scanner logo', desc: 'Scan web servers for 7,000+ dangerous files, outdated versions, and misconfigurations.', tag: 'Server scanner', accent: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(27,255,110,0.08))' },
  { slug: 'recon-ng', name: 'Recon-ng', img: '/assets/tools/subfinder/subfinder_logo.png', alt: 'Recon-ng recon framework logo', desc: 'Modular recon framework: workspaces, marketplace modules, and reporting for subdomains, emails, and hosts.', tag: 'Recon framework', accent: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(27,255,110,0.08))' },
  { slug: 'gophish', name: 'GoPhish', img: '/assets/tools/subfinder/subfinder_logo.png', alt: 'GoPhish phishing awareness logo', desc: 'Defensive phishing simulation, spotting fake URLs, and phishing-resistant 2FA.', tag: 'Phishing defense', accent: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(27,255,110,0.08))' },
  { slug: 'shodan', name: 'Shodan', img: '/assets/tools/subfinder/subfinder_logo.png', alt: 'Shodan exposed device search logo', desc: 'Search engine for Internet-connected devices, open ports, and exposed IoT assets.', tag: 'IoT search engine', accent: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(27,255,110,0.08))' },
  { slug: 'wpscan', name: 'WPScan', img: '/assets/tools/subfinder/subfinder_logo.png', alt: 'WPScan WordPress scanner logo', desc: 'Scan WordPress sites for vulnerable plugins, themes, and weak configs.', tag: 'WordPress scanner', accent: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(27,255,110,0.08))' },
  { slug: 'zap', name: 'OWASP ZAP', img: '/assets/tools/subfinder/subfinder_logo.png', alt: 'OWASP ZAP web app scanner logo', desc: 'Free OWASP web app scanner: spider, passive and active scans, REST API automation.', tag: 'Web app scanner', accent: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(27,255,110,0.08))' },
  { slug: 'spiderfoot', name: 'SpiderFoot', img: '/assets/tools/subfinder/subfinder_logo.png', alt: 'SpiderFoot OSINT automation logo', desc: 'Automate OSINT — emails, subdomains, breaches and footprint cleanup with 100+ modules.', tag: 'OSINT automation', accent: 'linear-gradient(135deg, rgba(179,102,255,0.2), rgba(27,255,110,0.08))' },
  { slug: 'masscan', name: 'Masscan', img: '/assets/tools/subfinder/subfinder_logo.png', alt: 'Masscan fast port scanner logo', desc: 'Internet-scale port scanning: scan whole subnets in minutes, grab banners, control packet rate.', tag: 'Port scanner', accent: 'linear-gradient(135deg, rgba(250,204,21,0.2), rgba(27,255,110,0.08))' },
  { slug: 'freqtrade', name: 'Freqtrade', img: '/assets/logo/hackolution.png', alt: 'Freqtrade crypto trading bot logo', desc: 'Free Python crypto bot: backtest, paper trade, go live on 50+ exchanges.', tag: 'Trading bot', accent: 'linear-gradient(135deg, rgba(27,255,110,0.2), rgba(0,200,180,0.08))' },
  { slug: 'ai-trading', name: 'NautilusTrader', img: '/assets/logo/hackolution.png', alt: 'NautilusTrader AI trading bots guide logo', desc: 'Institutional-grade algo trading: NautilusTrader Rust+Python engine, backtesting, and risk defense.', tag: 'AI trading', accent: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(27,255,110,0.08))' },
  { slug: 'rustscan', name: 'RustScan', img: '/assets/tools/rustscan/rustscan_logo.jpg', alt: 'RustScan fast port scanner logo', desc: 'Scan all ports in seconds and hand results to Nmap for depth.', tag: 'Port scanner', accent: 'linear-gradient(135deg, rgba(250,204,21,0.2), rgba(27,255,110,0.08))' },
  { slug: 'linpeas', name: 'LinPEAS', img: '/assets/tools/linpeas/linpeas_logo.jpg', alt: 'LinPEAS privilege escalation scanner logo', desc: 'Audit Linux and Windows hosts for privilege escalation paths.', tag: 'PrivEsc scanner', accent: 'linear-gradient(135deg, rgba(250,204,21,0.2), rgba(251,146,60,0.08))' },
  { slug: 'maigret', name: 'Maigret', img: '/assets/tools/maigret/maigret_cover.jpg', alt: 'Maigret username OSINT logo', desc: 'Trace a username across 500+ sites with PDF and HTML reports.', tag: 'Username OSINT', accent: 'linear-gradient(135deg, rgba(179,102,255,0.2), rgba(27,255,110,0.08))' },
  { slug: 'dalfox', name: 'DalFox', img: '/assets/tools/dalfox/dalfox_logo.jpg', alt: 'DalFox XSS scanner logo', desc: 'Find XSS flaws fast with parameter mining and proven PoCs.', tag: 'XSS scanner', accent: 'linear-gradient(135deg, rgba(251,146,60,0.2), rgba(239,68,68,0.08))' },
  { slug: 'impacket', name: 'Impacket', img: '/assets/tools/impacket/impacket_logo.jpg', alt: 'Impacket Active Directory toolkit logo', desc: 'Roast, dump, and relay in Active Directory labs.', tag: 'AD toolkit', accent: 'linear-gradient(135deg, rgba(255,204,0,0.2), rgba(27,255,110,0.08))' },
  { slug: 'setoolkit', name: 'SET', img: '/assets/tools/setoolkit/setoolkit_logo.jpg', alt: 'Social Engineer Toolkit logo', desc: 'Authorized phishing simulations with the credential harvester.', tag: 'Phishing sim', accent: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.08))' },
  { slug: 'httpx', name: 'HTTPX', img: '/assets/tools/httpx/httpx_logo.jpg', alt: 'HTTPX fast HTTP prober logo', desc: 'Probe live web hosts with status, titles, and tech detection.', tag: 'HTTP prober', accent: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(27,255,110,0.08))' },
  { slug: 'katana', name: 'Katana', img: '/assets/tools/katana/katana_logo.jpg', alt: 'Katana web crawler logo', desc: 'Deep crawling with headless mode and JS endpoint parsing.', tag: 'Web crawler', accent: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(179,102,255,0.08))' },
  { slug: 'netexec', name: 'NetExec', img: '/assets/tools/netexec/netexec_logo.jpg', alt: 'NetExec network executor logo', desc: 'SMB, WinRM, and credential audits across lab networks.', tag: 'Network audit', accent: 'linear-gradient(135deg, rgba(255,204,0,0.2), rgba(239,68,68,0.08))' },
  { slug: 'mobsf', name: 'MobSF', img: '/assets/tools/mobsf/mobsf_logo.jpg', alt: 'MobSF mobile security framework logo', desc: 'Static and dynamic audits for Android and iOS apps.', tag: 'Mobile audit', accent: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(6,182,212,0.08))' },
  { slug: 'ghidra', name: 'Ghidra', img: '/assets/tools/ghidra/ghidra_logo.jpg', alt: 'Ghidra reverse engineering suite logo', desc: 'Decompile binaries with the NSA reversing suite.', tag: 'Reversing', accent: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(255,204,0,0.08))' },
  { slug: 'beef', name: 'BeEF', img: '/assets/tools/beef/beef_logo.jpg', alt: 'BeEF browser exploitation framework logo', desc: 'Browser hook demos for defensive awareness training.', tag: 'Browser test', accent: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(179,102,255,0.08))' },
  { slug: 'feroxbuster', name: 'Feroxbuster', img: '/assets/tools/feroxbuster/feroxbuster_logo.jpg', alt: 'Feroxbuster content discovery logo', desc: 'Brute-force hidden dirs and files with recursion.', tag: 'Content discovery', accent: 'linear-gradient(135deg, rgba(27,255,110,0.2), rgba(0,200,180,0.08))' },
  { slug: 'bloodhound', name: 'BloodHound', img: '/assets/tools/bloodhound/bloodhound_logo.jpg', alt: 'BloodHound AD mapper logo', desc: 'Graph attack paths to Domain Admin in labs.', tag: 'AD mapper', accent: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(179,102,255,0.08))' },
  { slug: 'certipy', name: 'Certipy', img: '/assets/tools/certipy/certipy_logo.jpg', alt: 'Certipy AD CS auditor logo', desc: 'Audit certificate templates for ESC attacks.', tag: 'AD CS audit', accent: 'linear-gradient(135deg, rgba(255,204,0,0.2), rgba(34,197,94,0.08))' },
  { slug: 'chisel', name: 'Chisel', img: '/assets/tools/chisel/chisel_logo.jpg', alt: 'Chisel fast TCP tunnel logo', desc: 'Encrypted tunnels and SOCKS pivots for labs.', tag: 'Tunnel', accent: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(27,255,110,0.08))' },
  { slug: 'jadx', name: 'JADX', img: '/assets/tools/jadx/jadx_logo.jpg', alt: 'JADX Android decompiler logo', desc: 'Decompile APKs back to readable Java.', tag: 'Decompiler', accent: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(27,255,110,0.08))' },
  { slug: 'binwalk', name: 'Binwalk', img: '/assets/tools/binwalk/binwalk_logo.jpg', alt: 'Binwalk firmware analyzer logo', desc: 'Extract firmware images and find backdoors.', tag: 'Firmware', accent: 'linear-gradient(135deg, rgba(251,146,60,0.2), rgba(255,204,0,0.08))' },
  { slug: 'responder', name: 'Responder', img: '/assets/tools/responder/responder_logo.jpg', alt: 'Responder poisoning lab logo', desc: 'LLMNR poisoning and hash capture in labs.', tag: 'Poisoning', accent: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(255,204,0,0.08))' },
  { slug: 'enum4linux', name: 'Enum4linux', img: '/assets/tools/enum4linux/enum4linux_logo.jpg', alt: 'Enum4linux SMB enumerator logo', desc: 'Users, shares, and policy via SMB.', tag: 'SMB enum', accent: 'linear-gradient(135deg, rgba(255,204,0,0.2), rgba(27,255,110,0.08))' },
  { slug: 'bettercap', name: 'Bettercap', img: '/assets/tools/bettercap/bettercap_logo.jpg', alt: 'Bettercap MITM framework logo', desc: 'Sniff and spoof lab traffic live.', tag: 'MITM', accent: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(239,68,68,0.08))' },
  { slug: 'wafw00f', name: 'WAFW00F', img: '/assets/tools/wafw00f/wafw00f_logo.jpg', alt: 'WAFW00F firewall detector logo', desc: 'Name the firewall before you test.', tag: 'WAF detect', accent: 'linear-gradient(135deg, rgba(251,146,60,0.2), rgba(239,68,68,0.08))' },
  { slug: 'frida', name: 'Frida', img: '/assets/tools/frida/frida_logo.jpg', alt: 'Frida dynamic instrumentation logo', desc: 'Hook running apps live.', tag: 'Hooking', accent: 'linear-gradient(135deg, rgba(179,102,255,0.2), rgba(239,68,68,0.08))' },
  { slug: 'gau', name: 'GAU', img: '/assets/tools/gau/gau_logo.jpg', alt: 'GAU URL collector logo', desc: 'Harvest historic URLs from archives.', tag: 'URL harvest', accent: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(179,102,255,0.08))' },
  { slug: 'medusa', name: 'Medusa', img: '/assets/tools/medusa/medusa_logo.jpg', alt: 'Medusa login brute-forcer logo', desc: 'Parallel login audits across protocols.', tag: 'Brute-forcer', accent: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(239,68,68,0.08))' },
  { slug: 'crunch', name: 'Crunch', img: '/assets/tools/crunch/crunch_logo.jpg', alt: 'Crunch wordlist generator logo', desc: 'Pattern-based custom password lists.', tag: 'Wordlists', accent: 'linear-gradient(135deg, rgba(255,204,0,0.2), rgba(251,146,60,0.08))' },
  { slug: 'dirb', name: 'DIRB', img: '/assets/tools/dirb/dirb_logo.jpg', alt: 'DIRB directory scanner logo', desc: 'Classic hidden web object scanner.', tag: 'Dir scanner', accent: 'linear-gradient(135deg, rgba(27,255,110,0.2), rgba(6,182,212,0.08))' },
  { slug: 'steghide', name: 'Steghide', img: '/assets/tools/steghide/steghide_logo.jpg', alt: 'Steghide data hider logo', desc: 'Hide files inside images and audio.', tag: 'Steganography', accent: 'linear-gradient(135deg, rgba(179,102,255,0.2), rgba(6,182,212,0.08))' },
  { slug: 'arjun', name: 'Arjun', img: '/assets/tools/arjun/arjun_logo.jpg', alt: 'Arjun parameter finder logo', desc: 'Discover hidden HTTP parameters.', tag: 'Param finder', accent: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(27,255,110,0.08))' },
  { slug: 'toutatis', name: 'Toutatis', img: '/assets/tools/toutatis/toutatis_logo.jpg', alt: 'Toutatis Instagram OSINT logo', desc: 'Instagram exposure audits by handle.', tag: 'IG OSINT', accent: 'linear-gradient(135deg, rgba(214,41,118,0.2), rgba(179,102,255,0.08))' },
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
        <title>HACKOLUTION — Free Ethical Hacking Tools, Android Apps & Tutorials</title>
        <meta name="description" content="HACKOLUTION: 41 free ethical-hacking tool guides (Nmap alternatives, OSINT automation, AD labs), 6 ad-free Android APKs, full YouTube tutorials and Instagram reels. Learn security the legal way — lab only." />
        <link rel="canonical" href="https://www.uptools.in/hackolution/" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="HACKOLUTION — Free Ethical Hacking Tools, Android Apps & Tutorials | UpTools" />
        <meta property="og:description" content="41 free security tool guides, ad-free Android APKs and full video tutorials. Popular guides (Nmap, Burp, Metasploit…) now live on HNCKER." />
        <meta property="og:url" content="https://www.uptools.in/hackolution/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta property="og:image" content="https://www.uptools.in/assets/logo/hackolution.png" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="HACKOLUTION — Free Ethical Hacking Tools, Android Apps & Tutorials | UpTools" />
        <meta name="twitter:description" content="41 free security tool guides, ad-free Android APKs and full video tutorials on UpTools." />
        <meta name="twitter:image" content="https://www.uptools.in/assets/logo/hackolution.png" />
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
          <Link to="/hackolution/apps"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-neon/10 border border-neon/40 text-neon hover:bg-neon/20 transition-all no-underline">📱 Android Apps (APK)</Link>
          <a href="https://www.instagram.com/hackolution" target="_blank" rel="noopener"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-neon/30 text-neon hover:bg-neon/10 hover:border-neon/50 transition-all no-underline">📸 @hackolution</a>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">🛠️ {tools.length} free tools</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">🎬 Weekly videos</span>
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

      {/* Apps — Infinite Carousel */}
      <div className="glass rounded-3xl mb-6 overflow-hidden" style={{ borderColor: 'rgba(27,255,110,0.1)' }}>
        <div className="px-6 pt-6 pb-4 flex items-center justify-between gap-3 flex-wrap">
          <div><h2 className="text-xl font-bold m-0">📱 Apps</h2><p className="text-xs text-slate-400 mt-1">Our own Android apps — free APK downloads, drag or swipe to browse.</p></div>
          <Link to="/hackolution/apps/"
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/4 border border-white/8 text-slate-400 hover:text-white hover:border-white/12 transition-all no-underline">All apps ↗</Link>
        </div>
        <div className="px-6 pb-6">
          <InfiniteCarousel gap={16}>
            {apps.map(a => (
              <div key={a.file} className="flex-none w-[340px] p-5 rounded-2xl flex flex-col"
                style={{ background: a.accent, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <img src={a.img} alt={`${a.name} icon`} loading="lazy" width="56" height="56"
                    className="w-14 h-14 rounded-xl object-contain bg-black/30 p-1 border border-white/10"
                    style={{ background: 'rgba(0,0,0,0.35)' }} />
                  <div>
                    <h3 className="text-lg font-bold m-0">{a.name}</h3>
                    <span className="text-[11px] text-neon font-semibold uppercase tracking-wider">{a.tag}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-1 flex-1">{a.desc}</p>
                <p className="text-[11px] text-slate-500 mb-4">{a.ver}</p>
                <div className="flex gap-2 flex-wrap">
                  <a href={`/downloads/android/${a.file}`} download
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline"
                    style={{ background: 'linear-gradient(135deg, #1bff6e, #00ffa3)', color: '#080d1a' }}>⬇ Download APK</a>
                </div>
              </div>
            ))}
          </InfiniteCarousel>
        </div>
      </div>

      {/* Moved to HNCKER — keeps one canonical guide per tool */}
      <Link to="/hncker/"
        className="glass rounded-3xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 no-underline group hover:border-neon/40 transition-all"
        style={{ background: 'linear-gradient(135deg, rgba(57,255,20,0.06), rgba(6,182,212,0.04))', borderColor: 'rgba(57,255,20,0.18)' }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-black shrink-0"
            style={{ background: 'linear-gradient(135deg, #39ff14, #00ffa3)', color: '#080d1a' }}>HN</div>
          <div>
            <div className="text-sm font-bold text-white">Looking for Nmap, Burp, Metasploit, Wireshark…?</div>
            <p className="text-xs text-slate-400 m-0 mt-0.5">The 21 most popular guides moved to HNCKER — same content, one address, better videos.</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shrink-0 group-hover:scale-105 transition-transform"
          style={{ background: 'linear-gradient(135deg, #39ff14, #00ffa3)', color: '#080d1a' }}>Open HNCKER ↗</span>
      </Link>

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
