import { useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/learning', label: '🎓 Learning', key: 'learning' },
  { href: '/games', label: '🎮 Games', key: 'games' },
  { href: '/stranger-chat', label: '💬 Chat', key: 'chat' },
  { href: '/hackolution', label: 'HACKOLUTION', key: 'hackolution' },
  { href: '/blogs', label: 'Blogs', key: 'blogs' },
]

export default function Navbar() {
  const location = useLocation()
  const navRef = useRef(null)
  const tabRefs = useRef({})
  const indicatorRef = useRef(null)
  const [hovered, setHovered] = useState(null)

  // Determine active tab
  const activeKey = tabs.find(t =>
    t.href === '/' ? location.pathname === '/' : location.pathname.startsWith(t.href)
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
      // force reflow, then restore transition
      void ind.offsetWidth
      ind.style.transition = ''
    }
  }, [focusKey])

  // Re-measure on tab change, route change, resize, and after fonts settle.
  // useLayoutEffect avoids a visible jump; nav is `relative` so the
  // absolute indicator positions against it (this was the mobile bug).
  useLayoutEffect(() => {
    moveIndicator(true)
  }, [focusKey, location.pathname, moveIndicator])

  useEffect(() => {
    // Snap without animation on first paint + after fonts load (mobile shift fix)
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

  // Keep the active tab visible inside the scrollable pill nav on mobile
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

  return (
    <header className="sticky top-0 z-50 border-b border-white/5"
      style={{ background: 'rgba(8,13,26,0.85)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-6xl mx-auto px-3 sm:px-5 h-14 flex items-center justify-between gap-2">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <img src="/assets/logo/uptools-logo.svg" alt="" className="w-9 h-9 rounded-xl shadow-lg shadow-brand/20 group-hover:shadow-brand/40 transition-shadow" width="36" height="36" />
          <span className="text-white font-bold text-base tracking-tight hidden md:block opacity-100 max-w-[120px] whitespace-nowrap">
            UpTools
          </span>
        </Link>

        {/* Tabs */}
        <nav ref={navRef}
          className="relative flex items-center gap-0.5 rounded-full p-[3px] border border-white/8 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-none min-w-0"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          {/* Indicator */}
          <div ref={indicatorRef}
            className="absolute h-[calc(100%-6px)] top-[3px] left-0 rounded-full z-[1] pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 2px 12px rgba(99,102,241,0.35)',
              transition: 'left 0.35s cubic-bezier(0.4,0,0.2,1), width 0.35s cubic-bezier(0.4,0,0.2,1)',
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
              className={`relative z-[2] px-3 sm:px-4 py-[7px] rounded-full text-xs sm:text-[13px] font-medium transition-colors whitespace-nowrap no-underline shrink-0 ${
                activeKey === t.key ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
