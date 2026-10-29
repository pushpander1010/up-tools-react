import { useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/all-tools', label: '🧰 All Tools', key: 'all-tools' },
  { href: '/learning', label: '🎓 Learning', key: 'learning' },
  { href: '/games', label: '🎮 Games', key: 'games' },
  { href: '/blogs', label: '📰 Blogs', key: 'blogs' },
  { href: '/hncker', label: '🛡️ Cyber Lab', key: 'hncker' },
  { href: '/stranger-chat', label: '💬 Chat', key: 'chat' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const navRef = useRef(null)
  const tabRefs = useRef({})
  const indicatorRef = useRef(null)
  const [hovered, setHovered] = useState(null)

  // Determine active tab
  const activeKey = tabs.find(t =>
    t.href === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(t.href) || (t.key === 'hncker' && location.pathname.startsWith('/hackolution'))
  )?.key || 'home'

  const focusKey = hovered || activeKey

  const moveIndicator = useCallback((animate) => {
    const el = tabRefs.current[focusKey]
    const ind = indicatorRef.current
    if (!el || !ind) return
    if (!animate) ind.style.transition = 'none'
    ind.style.left = el.offsetLeft + 'px'
    ind.style.width = el.offsetWidth + 'px'
    if (!animate) {
      void ind.offsetWidth
      ind.style.transition = ''
    }
  }, [focusKey])

  useLayoutEffect(() => {
    moveIndicator(true)
  }, [focusKey, location.pathname, moveIndicator])

  useEffect(() => {
    moveIndicator(false)
    if (document.fonts?.ready) document.fonts.ready.then(() => moveIndicator(false))
    const onResize = () => moveIndicator(false)
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [moveIndicator])

  // Global "/" shortcut to jump to tool search from any page
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) && !document.activeElement?.isContentEditable) {
        e.preventDefault()
        const input = document.getElementById('global-tool-search')
        if (input) {
          input.focus()
          input.scrollIntoView({ behavior: 'smooth', block: 'center' })
        } else {
          navigate('/?focus=1')
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  // Keep active tab visible inside scrollable pill nav on mobile
  useEffect(() => {
    const el = tabRefs.current[activeKey]
    const nav = navRef.current
    if (!el || !nav) return
    const elL = el.offsetLeft
    const elR = elL + el.offsetWidth
    const viewL = nav.scrollLeft
    const viewR = viewL + nav.clientWidth
    if (elL < viewL || elR > viewR) {
      nav.scrollTo({ left: elL - nav.clientWidth / 2 + el.offsetWidth / 2, behavior: 'smooth' })
    }
  }, [activeKey, location.pathname])

  const handleQuickSearch = () => {
    const input = document.getElementById('global-tool-search')
    if (input) {
      input.focus()
      input.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      navigate('/?focus=1')
    }
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/[0.07]"
      style={{
        background: 'rgba(6, 10, 20, 0.84)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.35)',
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-5 h-16 flex items-center justify-between gap-2.5">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0 no-underline" aria-label="UpTools Home">
          <img
            src="/assets/logo/uptools-logo.svg"
            alt="UpTools Logo"
            className="w-9 h-9 rounded-xl shadow-lg shadow-brand/25 group-hover:shadow-brand/45 transition-all"
            width="36"
            height="36"
          />
          <div className="flex items-center gap-2">
            <span className="text-white font-extrabold text-base sm:text-lg tracking-tight whitespace-nowrap">
              UpTools
            </span>
            <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
              600+ Free
            </span>
          </div>
        </Link>

        {/* Primary Pill Navigation */}
        <nav
          ref={navRef}
          aria-label="Primary Navigation"
          className="relative flex items-center gap-0.5 rounded-full p-1 border border-white/[0.08] overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-none min-w-0"
          style={{ background: 'rgba(255, 255, 255, 0.035)' }}
        >
          <div
            ref={indicatorRef}
            className="absolute h-[calc(100%-8px)] top-[4px] left-0 rounded-full z-[1] pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #6366f1, #7c3aed)',
              boxShadow: '0 2px 12px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
              transition: 'left 0.32s cubic-bezier(0.4,0,0.2,1), width 0.32s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
          {tabs.map(t => (
            <Link
              key={t.key}
              ref={el => tabRefs.current[t.key] = el}
              to={t.href}
              onMouseEnter={() => setHovered(t.key)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(t.key)}
              onBlur={() => setHovered(null)}
              className={`relative z-[2] px-3 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-colors whitespace-nowrap no-underline shrink-0 ${
                activeKey === t.key ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        {/* Quick Search Trigger (Desktop/Tablet) */}
        <button
          type="button"
          onClick={handleQuickSearch}
          aria-label="Search tools (Shortcut /)"
          className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span>Search tools…</span>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.08] text-slate-300 border border-white/10">/</kbd>
        </button>
      </div>
    </header>
  )
}
