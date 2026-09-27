import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const APPS = [
  {
    name: 'Mouse Jiggler',
    version: '1.0',
    size: '5.6 MB',
    file: 'mouse-jiggler-1.0.apk',
    desc: 'Keeps screen awake, ad-free — prevent timeout without changing system settings.',
    tag: 'Utility',
    icon: '/assets/apps/mouse-jiggler.svg',
    accent: 'linear-gradient(135deg, rgba(21,101,192,0.2), rgba(27,255,110,0.08))',
    badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    features: ['Keep screen alive indefinitely', 'Quick notification tile toggle', '100% ad-free & offline']
  },
  {
    name: 'Scan&PDF',
    version: '1.0',
    size: '22 MB',
    file: 'scanpdf-1.0.apk',
    desc: 'Document scanner to PDF, ad-free — scan notes, receipts, and multi-page books.',
    tag: 'Productivity',
    icon: '/assets/apps/scanpdf.svg',
    accent: 'linear-gradient(135deg, rgba(13,71,161,0.2), rgba(27,255,110,0.08))',
    badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    features: ['Auto-edge crop & enhancement', 'Export clean multi-page PDFs', 'Zero ads, zero data tracking']
  },
  {
    name: 'NetShield Ad Blocker',
    version: '1.3',
    size: '15 MB',
    file: 'netshield-1.3.apk',
    desc: 'On-device ad blocking — blocks intrusive ads, trackers, and telemetry system-wide.',
    tag: 'Privacy & Security',
    icon: '/assets/apps/netshield.png',
    accent: 'linear-gradient(135deg, rgba(27,255,110,0.2), rgba(6,182,212,0.08))',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    features: ['Local VPN loopback (no root)', 'Block popups, trackers & banners', 'Saves mobile data & battery']
  },
  {
    name: 'RecoveryPRO',
    version: '1.4',
    size: '3.6 MB',
    file: 'recoverypro-1.4.apk',
    desc: 'Phone storage cleaner — real deleted-file restore, duplicate finder, WhatsApp cleaner.',
    tag: 'System',
    icon: '/assets/apps/recoverypro.png',
    accent: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(27,255,110,0.08))',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    features: ['Instant cache & residual clean', 'Find hidden storage hogs', 'Lightweight 3.6MB footprint']
  },
  {
    name: 'WiFi Analyzer',
    version: '2.1',
    size: '3.5 MB',
    file: 'wifi-analyzer-2.1.apk',
    desc: 'WiFi scanner — scan nearby networks, graph channel interference, and measure speed.',
    tag: 'Network OSINT',
    icon: '/assets/apps/wifi-analyzer.png',
    accent: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(27,255,110,0.08))',
    badgeColor: 'border-teal-500/30 text-teal-400 bg-teal-500/10',
    features: ['2.4 GHz & 5 GHz channel graph', 'Real-time dBm signal analyzer', 'Find least congested channels']
  },
  {
    name: 'Tank Battle',
    version: '1.2',
    size: '11 MB',
    file: 'tank-battle-1.2.apk',
    desc: 'Battle game — retro 2D arcade armored combat with tactical cannons and explosive missions.',
    tag: 'Arcade Game',
    icon: '/assets/apps/tank-battle.svg',
    accent: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(255,204,0,0.08))',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    features: ['Smooth virtual controls', 'Multiple enemy tank waves & bosses', '100% offline gameplay']
  },
]

export default function HackolutionApps() {
  const fallbackIcon = '/assets/logo/hackolution.png'

  return (
    <>
      <Helmet>
        <title>Hackolution Apps</title>
        <meta name="description" content="Download free Android APK apps by HACKOLUTION. Fast, ad-free APK downloads for Mouse Jiggler, Scan&PDF, NetShield Ad Blocker, RecoveryPRO, WiFi Analyzer, and Tank Battle." />
        <link rel="canonical" href="https://www.uptools.in/hackolution/apps/" />
        <meta property="og:title" content="Hackolution Apps | UpTools" />
        <meta property="og:description" content="Download free Android APK apps by HACKOLUTION. Direct downloads for Mouse Jiggler, Scan&PDF, NetShield Ad Blocker, RecoveryPRO, WiFi Analyzer, and Tank Battle." />
        <meta property="og:url" content="https://www.uptools.in/hackolution/apps/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Hackolution Apps | UpTools" />
        <meta name="twitter:description" content="Download free Android APK apps by HACKOLUTION. Fast, ad-free APK downloads for Mouse Jiggler, Scan&PDF, NetShield, RecoveryPRO, WiFi Analyzer, and Tank Battle." />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <Link to="/hackolution" className="hover:text-white transition-colors">HACKOLUTION</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">Android Apps</span>
      </nav>

      {/* Hero Header */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-neon-border p-8 sm:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(27,255,110,0.06), rgba(17,24,39,0.4))' }}>
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(27,255,110,0.15), transparent 70%)' }} />
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src="/assets/logo/hackolution.png"
              alt="HACKOLUTION hooded hacker logo"
              width="64"
              height="64"
              className="w-16 h-16 rounded-2xl shrink-0 object-cover"
              style={{ boxShadow: '0 8px 32px rgba(27,255,110,0.35)', border: '1px solid rgba(27,255,110,0.4)' }}
            />
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-neon/10 border border-neon/30 text-neon mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" /> Android APK Center
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight m-0 lowercase">
                <span className="text-white">hack</span><span style={{ color: '#1bff6e' }}>olution</span> <span className="text-slate-200">apps</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">Direct, privacy-first Android apps built with zero bloatware and zero tracking.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/hackolution"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-white/5 border border-white/10 hover:text-white hover:border-neon/40 hover:bg-neon/5 transition-all no-underline"
            >
              🛠️ View Guides & Tools
            </Link>
          </div>
        </div>

        {/* Hero Badges */}
        <div className="relative flex flex-wrap gap-2 mt-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-neon/30 text-neon">
            📱 {APPS.length} Android Apps
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">
            🛡️ 100% Ad-Free
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">
            ⚡ Direct APK Download
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">
            🔒 No Root Required
          </span>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-white m-0">Available Android Apps</h2>
            <p className="text-xs text-slate-400 mt-1">Tap Download APK to get the official standalone build directly to your phone.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {APPS.map((app) => (
            <div
              key={app.file}
              className="glass rounded-2xl p-6 flex flex-col justify-between border border-white/8 hover:border-neon/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-neon/5 transition-all duration-300 group"
              style={{ background: app.accent }}
            >
              <div>
                {/* App Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={app.icon}
                      alt={`${app.name} icon`}
                      width="56"
                      height="56"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = fallbackIcon
                      }}
                      className="w-14 h-14 rounded-2xl object-cover bg-black/40 p-1 border border-white/10 shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-md"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white m-0 leading-tight group-hover:text-neon transition-colors">
                        {app.name}
                      </h3>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${app.badgeColor}`}>
                        {app.tag}
                      </span>
                    </div>
                  </div>

                  {/* Version & Size Badge */}
                  <div className="text-right shrink-0">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black/40 border border-white/10 text-neon">
                      v{app.version}
                    </span>
                    <span className="block text-[11px] font-mono text-slate-400 mt-1">
                      {app.size}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 mb-4 line-clamp-2 leading-relaxed">
                  {app.desc}
                </p>

                {/* Key Features Bullet List */}
                <ul className="text-xs text-slate-400 space-y-1.5 mb-6 pl-0 list-none">
                  {app.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-neon text-xs">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Download Button */}
              <div className="pt-2">
                <a
                  href={`/downloads/android/${app.file}`}
                  download={app.file}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black text-sm no-underline shadow-lg shadow-neon/15 hover:shadow-neon/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #1bff6e, #00ffa3)',
                    color: '#080d1a',
                  }}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
                  </svg>
                  Download APK ({app.size})
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Installation Guide & Unknown Sources Note */}
      <div
        className="glass rounded-3xl p-7 sm:p-8 mb-8 border border-white/10 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(27,255,110,0.03), rgba(17,24,39,0.6))',
        }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl bg-neon/10 border border-neon/30 text-neon shrink-0">
            ℹ️
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white m-0">How to Install Android APKs</h3>
            <p className="text-xs text-slate-400 mt-1">Direct APK installations are fast, safe, and bypass app store tracking.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-xs font-mono font-bold text-neon mb-1">STEP 01</div>
                <div className="text-sm font-bold text-white mb-1">Download APK</div>
                <p className="text-xs text-slate-400 m-0">Tap any "Download APK" button above to save the installer directly to your device.</p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-xs font-mono font-bold text-neon mb-1">STEP 02</div>
                <div className="text-sm font-bold text-white mb-1">Enable Unknown Apps</div>
                <p className="text-xs text-slate-400 m-0">When prompted, go to Settings and toggle on <b>"Install unknown apps"</b> or <b>"Allow from this source"</b> for your browser/file manager.</p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-xs font-mono font-bold text-neon mb-1">STEP 03</div>
                <div className="text-sm font-bold text-white mb-1">Install & Run</div>
                <p className="text-xs text-slate-400 m-0">Open the downloaded file from your notifications or Files app and tap <b>Install</b>.</p>
              </div>
            </div>

            <div className="mt-5 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-3">
              <span className="text-emerald-400 text-lg">🛡️</span>
              <p className="text-xs text-emerald-300 m-0">
                <b>Security Assurance:</b> All HACKOLUTION APKs are independently compiled, verified clean, and contain zero ads, telemetry, or hidden permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
