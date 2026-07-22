import { Helmet } from 'react-helmet-async'
import InfiniteCarousel from '../components/InfiniteCarousel'
import videos from '../data/videos.json'

export default function HnckerPage() {
  return (
    <>
      <Helmet>
        <title>HNCKER - Apps, Instagram & Videos</title>
        <meta name="description" content="Follow HNCKER on Instagram, watch our tech videos, and download free Android apps." />
      </Helmet>

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
            <p className="text-slate-400 text-sm mt-1">No-nonsense tech, apps & videos.</p>
          </div>
        </div>
        <div className="relative flex flex-wrap gap-2 mt-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">📱 2 Android apps</span>
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
            style={{ background: 'linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>@hncker</div>
          <div className="flex gap-6 mt-2">
            <div className="text-center"><b className="block text-white text-lg">12K</b><span className="text-[11px] text-slate-500 uppercase tracking-wider">followers</span></div>
            <div className="text-center"><b className="block text-white text-lg">Cyber/AI</b><span className="text-[11px] text-slate-500 uppercase tracking-wider">niche</span></div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="https://www.instagram.com/hncker" target="_blank" rel="noopener" className="glow-btn text-sm px-5 py-2.5 rounded-xl no-underline"
            style={{ background: 'linear-gradient(92deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)' }}>Instagram ↗</a>
          <a href="https://www.youtube.com/@hncker" target="_blank" rel="noopener" className="glow-btn text-sm px-5 py-2.5 rounded-xl no-underline"
            style={{ background: '#ff0000' }}>▶ YouTube</a>
        </div>
      </div>

      {/* Videos — Infinite Carousel */}
      <div className="glass rounded-3xl mb-6 overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between gap-3 flex-wrap">
          <div><h2 className="text-xl font-bold m-0">🎬 Latest Videos</h2><p className="text-xs text-slate-500 mt-1">Swipe to browse — tap to watch.</p></div>
          <a href="https://www.youtube.com/@hncker" target="_blank" rel="noopener"
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/4 border border-white/8 text-slate-400 hover:text-white hover:border-white/12 transition-all no-underline">All on YouTube ↗</a>
        </div>
        <div className="px-6 pb-6">
          <InfiniteCarousel gap={16}>
            {videos.map(v => (
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
                  <div className="text-xs text-slate-500">{v.sub}</div>
                </div>
              </a>
            ))}
          </InfiniteCarousel>
        </div>
      </div>

      {/* Apps */}
      <div className="glass rounded-3xl p-6 mb-6" style={{ borderColor: 'rgba(57,255,20,0.1)' }}>
        <h2 className="text-xl font-bold m-0 mb-5">📱 Our Android Apps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'WiFi Analyzer', pkg: 'com.wifi_analyzer', icon: '📶', iconBg: 'rgba(6,182,212,0.15)', iconBorder: 'rgba(6,182,212,0.2)', desc: 'Scan networks, find the best channel, test speed.', feats: ['Live WiFi scanner & channel graph', 'Speed test + signal strength', 'No account, works offline'], apk: '/assets/apks/wifi-analyzer.apk' },
            { name: 'NetShield', pkg: 'com.hncker.adblocker', icon: '🛡️', iconBg: 'rgba(57,255,20,0.15)', iconBorder: 'rgba(57,255,20,0.2)', desc: 'No-root local-VPN ad & tracker blocker.', feats: ['System-wide ad & tracker blocking', 'Local VPN — no root required', 'Privacy-first, no data sold'], apk: '/assets/apks/netshield.apk' },
          ].map(app => (
            <div key={app.name} className="p-5 rounded-2xl" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${app.iconBorder}` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: app.iconBg, border: `1px solid ${app.iconBorder}` }}>{app.icon}</div>
                <div><h3 className="text-lg font-bold m-0">{app.name}</h3><span className="text-xs text-slate-500 font-mono">{app.pkg}</span></div>
              </div>
              <p className="text-xs text-slate-400 mb-3">{app.desc}</p>
              <ul className="list-none p-0 m-0 space-y-1.5">
                {app.feats.map(f => <li key={f} className="text-xs text-slate-400 flex items-center gap-2"><span className="text-neon font-bold">▸</span>{f}</li>)}
              </ul>
              <a href={app.apk} download className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-sm font-bold no-underline"
                style={{ background: 'linear-gradient(135deg, #39ff14, #00ffa3)', color: '#080d1a' }}>⬇ Download APK</a>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
