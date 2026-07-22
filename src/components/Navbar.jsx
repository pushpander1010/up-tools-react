import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/games', label: '🎮 Games', key: 'games' },
  { href: '/hncker', label: 'HNCKER', key: 'hncker' },
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

  useEffect(() => {
    const el = tabRefs.current[focusKey]
    const ind = indicatorRef.current
    if (!el || !ind) return
    ind.style.left = el.offsetLeft + 'px'
    ind.style.width = el.offsetWidth + 'px'
  }, [focusKey])

  // On mount, snap without transition
  useEffect(() => {
    const el = tabRefs.current[activeKey]
    const ind = indicatorRef.current
    if (!el || !ind) return
    ind.style.transition = 'none'
    ind.style.left = el.offsetLeft + 'px'
    ind.style.width = el.offsetWidth + 'px'
    requestAnimationFrame(() => { ind.style.transition = '' })
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-white/5"
      style={{ background: 'rgba(8,13,26,0.85)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/assets/logo/uptools-logo.svg" alt="UpTools" className="w-9 h-9 rounded-xl shadow-lg shadow-brand/20 group-hover:shadow-brand/40 transition-shadow" />
          <span className="text-white font-bold text-base tracking-tight hidden sm:block opacity-100 max-w-[120px] whitespace-nowrap">
            UpTools
          </span>
        </Link>

        {/* Tabs */}
        <nav ref={navRef}
          className="flex items-center gap-0.5 rounded-full p-[3px] border border-white/6"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          {/* Indicator */}
          <div ref={indicatorRef}
            className="absolute h-[calc(100%-6px)] top-[3px] rounded-full z-[1]"
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
              className={`relative z-[2] px-4 py-[7px] rounded-full text-[13px] font-medium transition-colors whitespace-nowrap no-underline ${
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
