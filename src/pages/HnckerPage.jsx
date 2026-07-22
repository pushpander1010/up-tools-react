import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import videos from '../data/videos.json'

export default function HnckerPage() {
  return (
    <>
      <Helmet>
        <title>HNCKER - Apps, Instagram & Videos</title>
        <meta name="description" content="Follow HNCKER on Instagram, watch our tech videos, and download free Android apps." />
      </Helmet>

      {/* Hero */}
      <section className="glass p-8 mb-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(57,255,20,0.08), transparent)', borderColor: 'rgba(57,255,20,0.2)' }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shrink-0"
            style={{ background: 'linear-gradient(135deg, #39ff14, #00ffa3)', color: '#080d1a', boxShadow: '0 8px 32px rgba(57,255,20,0.3)' }}>
            HN
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight m-0" style={{ background: 'linear-gradient(135deg, #39ff14, #00ffa3, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              HNCKER
            </h1>
            <p className="text-slate-400 text-sm mt-1">No-nonsense tech, apps & videos.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/8 text-slate-300">📱 2 Android apps</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/8 text-slate-300">🎬 Weekly videos</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/8 text-slate-300">📸 Instagram</span>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="glass p-7 mb-6 flex flex-col sm:flex-row items-center justify-between gap-5" style={{ background: 'linear-gradient(135deg, rgba(253,186,116,0.05), rgba(214,41,118,0.05), rgba(150,47,191,0.05))', borderColor: 'rgba(214,41,118,0.15)' }}>
        <div>
          <h2 className="text-xl font-bold m-0">Follow us on Instagram</h2>
          <div className="text-xl font-extrabold my-1" style={{ background: 'linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>@hncker</div>
          <div className="flex gap-6 mt-2">
            <div className="text-center"><b className="block text-white">12K</b><span className="text-[11px] text-slate-500 uppercase tracking-wider">followers</span></div>
            <div className="text-center"><b className="block text-white">Cyber/AI</b><span className="text-[11px] text-slate-500 uppercase tracking-wider">niche</span></div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="https://www.instagram.com/hncker" target="_blank" rel="noopener" className="glow-btn text-sm px-5 py-2 rounded-xl no-underline" style={{ background: 'linear-gradient(92deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)' }}>Instagram ↗</a>
          <a href="https://www.youtube.com/@hncker" target="_blank" rel="noopener" className="glow-btn text-sm px-5 py-2 rounded-xl no-underline" style={{ background: '#ff0000' }}>▶ YouTube</a>
        </div>
      </section>

      {/* Videos Carousel */}
      <section className="glass mb-6 overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-xl font-bold m-0">🎬 Latest Videos</h2>
            <p className="text-xs text-slate-500 mt-1">Swipe to browse — tap to watch.</p>
          </div>
          <a href="https://www.youtube.com/@hncker" target="_blank" rel="noopener" className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/4 border border-white/6 text-slate-400 hover:text-white hover:border-white/12 transition-all no-underline">
            All on YouTube ↗
          </a>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 pb-6" style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
          {videos.map(v => (
            <a key={v.id} href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener"
              className="flex-none w-[300px] rounded-2xl overflow-hidden border border-white/6 hover:border-neon/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-neon/5 no-underline group"
              style={{ scrollSnapAlign: 'start', background: 'rgba(17,24,39,0.6)' }}>
              <div className="relative aspect-video bg-black overflow-hidden">
                <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt={v.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute inset-0 flex items-center justify-center text-4xl text-white bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
              </div>
              <div className="p-3.5">
                <div className="text-sm font-semibold text-white line-clamp-2 mb-1">{v.title}</div>
                <div className="text-xs text-slate-500">{v.sub}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Apps */}
      <section className="glass p-6 mb-6" style={{ borderColor: 'rgba(57,255,20,0.1)' }}>
        <h2 className="text-xl font-bold m-0 mb-4">📱 Our Android Apps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* WiFi Analyzer */}
          <div className="p-5 rounded-2xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(6,182,212,0.15)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.2)' }}>📶</div>
              <div><h3 className="text-lg font-bold m-0">WiFi Analyzer</h3><span className="text-xs text-slate-500 font-mono">com.wifi_analyzer</span></div>
            </div>
            <p className="text-xs text-slate-400 mb-3">Scan networks, find the best channel, test speed.</p>
            <ul className="list-none p-0 m-0 space-y-1.5">
              {['Live WiFi scanner & channel graph', 'Speed test + signal strength', 'No account, works offline'].map(f => (
                <li key={f} className="text-xs text-slate-400 flex items-center gap-2"><span className="text-emerald-400 font-bold">▸</span>{f}</li>
              ))}
            </ul>
            <a href="/assets/apks/wifi-analyzer.apk" download className="glow-btn text-sm px-4 py-2 mt-4 rounded-xl inline-flex no-underline" style={{ background: 'linear-gradient(135deg, #39ff14, #00ffa3)', color: '#080d1a' }}>⬇ Download APK</a>
          </div>

          {/* NetShield */}
          <div className="p-5 rounded-2xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(57,255,20,0.15)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(57,255,20,0.15)', border: '1px solid rgba(57,255,20,0.2)' }}>🛡️</div>
              <div><h3 className="text-lg font-bold m-0">NetShield</h3><span className="text-xs text-slate-500 font-mono">com.hncker.adblocker</span></div>
            </div>
            <p className="text-xs text-slate-400 mb-3">No-root local-VPN ad & tracker blocker.</p>
            <ul className="list-none p-0 m-0 space-y-1.5">
              {['System-wide ad & tracker blocking', 'Local VPN — no root required', 'Privacy-first, no data sold'].map(f => (
                <li key={f} className="text-xs text-slate-400 flex items-center gap-2"><span className="text-neon font-bold">▸</span>{f}</li>
              ))}
            </ul>
            <a href="/assets/apks/netshield.apk" download className="glow-btn text-sm px-4 py-2 mt-4 rounded-xl inline-flex no-underline" style={{ background: 'linear-gradient(135deg, #39ff14, #00ffa3)', color: '#080d1a' }}>⬇ Download APK</a>
          </div>
        </div>
      </section>
    </>
  )
}
