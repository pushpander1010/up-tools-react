import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="text-center py-8 mt-12 border-t border-white/5 relative z-10">
      <div className="flex items-center justify-center gap-3 mb-3">
        <img src="/assets/logo/uptools-logo.svg" alt="UpTools" className="w-8 h-8 rounded-lg" />
        <span className="text-sm font-semibold text-white">UpTools</span>
      </div>
      <p className="text-xs text-slate-500 max-w-md mx-auto mb-4 leading-relaxed">
        300+ free tools and 24+ browser games. No sign-ups, no data collection. Everything runs in your browser.
      </p>
      <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-500">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <Link to="/games" className="hover:text-white transition-colors">Games</Link>
        <Link to="/hncker" className="hover:text-white transition-colors">HNCKER</Link>
        <a href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</a>
        <a href="/privacy-policy/" className="hover:text-white transition-colors">Privacy</a>
      </div>
      <p className="text-[11px] text-slate-700 mt-4">© {new Date().getFullYear()} UpTools. All rights reserved.</p>
    </footer>
  )
}
