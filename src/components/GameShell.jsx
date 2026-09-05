import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from './ToolLayout'
import GameAdSlot from './GameAdSlot'
import InterstitialAd from './InterstitialAd'

/**
 * GameShell — ONE uniform shell for every game on uptools.in (snake is the reference).
 *
 * What the shell owns (game files must NOT re-implement any of this):
 * - Fullscreen root (native Fullscreen API + CSS overlay fallback for iPhone Safari),
 *   with `fs` state synced from native fullscreenchange events.
 * - Always-visible ✕ Exit button in the game header (never lost, even in fullscreen).
 * - Escape key always exits fullscreen (covers the CSS-fallback mode where the
 *   browser won't do it natively).
 * - Aside rail ads (160x600, xl screens only) + bottom banner, visible BOTH on the
 *   page AND during fullscreen play (they live inside the fullscreened root).
 * - Interstitial ad on Start/Restart, then runs startAction + enters fullscreen.
 * - ToolLayout SEO furniture (breadcrumb, header, FAQ, how-it-works, related).
 * - After entering/exiting fullscreen, a synthetic window `resize` event is fired
 *   (60ms + 300ms) so each game's existing resize/fit handler re-measures its canvas.
 *
 * Props:
 *   name         short display name for the game header + footer, e.g. "SNAKE"
 *   title/desc/icon/iconBg/category/slug/faq/howItWorks/schema
 *                passed straight through to ToolLayout (copy existing values verbatim)
 *   startAction  () => void — RAW game start/restart logic ONLY (reset state, spawn,
 *                setPlaying(true)...). No ads, no fullscreen calls inside.
 *   startLabel   React node for the Start button, e.g. {playing && !gameOver ? '⟲ Restart' : '▶ Start'}
 *   extraButtons React node — game-specific INLINE controls only (e.g. next-piece
 *                preview, difficulty pills). NO Start/Fullscreen/Exit buttons here.
 *   headerStats  React node — optional small stats centered in the game header
 *                (snake uses Score/Best/Last). Most games keep stats in content.
 *   onExit       () => void — optional cleanup when leaving fullscreen
 *                (e.g. snake stops the game). Default: just leaves fullscreen.
 *   children     game content ONLY: stats cards, board/canvas, hints. REMOVE from the
 *                game file: ToolLayout wrapper, useFullscreen, GameAdSlot rails/banners,
 *                InterstitialAd wiring, useJumpToResult, per-game Start/Fullscreen/Exit
 *                buttons. Canvas-tap-to-start must also be removed (shell bar is the
 *                single start control) — point overlay text at the Restart button.
 */
export default function GameShell({
  name, title, desc, icon, iconBg, category, slug,
  faq = [], howItWorks = [], schema,
  startAction, startLabel = '▶ Start',
  extraButtons = null, headerStats = null, onExit = null,
  children,
}) {
  const rootRef = useRef(null)
  const resultRef = useRef(null)
  const [fs, setFs] = useState(false)
  const [showAd, setShowAd] = useState(false)
  const pendingAction = useRef(null)

  const fireResize = useCallback(() => {
    try { window.dispatchEvent(new Event('resize')) } catch {}
  }, [])

  const goFullscreen = useCallback(() => {
    // Fullscreen the whole game root so header + Exit + ads stay on screen.
    // Falls back to a CSS overlay (fs=true) where the native API is
    // missing or blocked (e.g. iPhone Safari) so Exit is never lost.
    const el = rootRef.current
    if (!el) { setFs(true); return }
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) return
      const req = (el.requestFullscreen && el.requestFullscreen.bind(el)) || (el.webkitRequestFullscreen && el.webkitRequestFullscreen.bind(el))
      if (req) {
        const p = req()
        if (p && p.catch) p.catch(() => { setFs(true); setTimeout(fireResize, 60) })
      } else { setFs(true); setTimeout(fireResize, 60) }
    } catch { setFs(true); setTimeout(fireResize, 60) }
  }, [fireResize])

  const exit = useCallback(() => {
    try { if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {}) } catch {}
    try { if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen() } catch {}
    setFs(false)
    setTimeout(fireResize, 60)
    if (onExit) onExit()
  }, [fireResize, onExit])

  // Escape always exits (covers CSS-fallback mode where the browser won't do it).
  useEffect(() => {
    const k = e => { if (e.key === 'Escape') exit() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [exit])

  // Sync with native fullscreen changes (user pressing Esc, etc.) + re-measure.
  useEffect(() => {
    const h = () => {
      setFs(!!(document.fullscreenElement || document.webkitFullscreenElement))
      setTimeout(fireResize, 60)
      setTimeout(fireResize, 300)
    }
    document.addEventListener('fullscreenchange', h)
    document.addEventListener('webkitfullscreenchange', h)
    return () => { document.removeEventListener('fullscreenchange', h); document.removeEventListener('webkitfullscreenchange', h) }
  }, [fireResize])

  const triggerAd = useCallback((action) => { pendingAction.current = action; setShowAd(true) }, [])
  const onAdDismiss = useCallback(() => {
    setShowAd(false)
    const a = pendingAction.current
    pendingAction.current = null
    if (a) a()
  }, [])

  const handleStart = useCallback(() => {
    triggerAd(() => {
      if (startAction) startAction()
      goFullscreen()
      setTimeout(() => { try { resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) } catch {} }, 100)
    })
  }, [triggerAd, startAction, goFullscreen])

  return (
    <div ref={rootRef} className={`relative w-full min-h-[100dvh] bg-[#030b14] text-white flex flex-col overflow-x-hidden overflow-y-auto ${fs ? 'fixed inset-0 z-[100]' : ''}`}>
      <header className={`flex items-center justify-between px-4 md:px-6 py-3 gap-4 ${fs ? 'border-b border-cyan-500/20 bg-black/60 sticky top-0 z-20' : ''}`}>
        <h1 className="text-base md:text-xl font-black tracking-tighter bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-cyan-200 bg-clip-text text-transparent">{name || title}</h1>
        {headerStats && (
          <div className="flex gap-3 md:gap-5 font-mono text-xs md:text-sm text-cyan-200 whitespace-nowrap">
            {headerStats}
          </div>
        )}
        <button onClick={exit} className="text-xs md:text-sm px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 font-bold">✕ Exit</button>
      </header>

      <ToolLayout
        hideHeader={fs}
        title={title} desc={desc} icon={icon} iconBg={iconBg}
        category={category} slug={slug}
        faq={faq} howItWorks={howItWorks} schema={schema}
      >
        <InterstitialAd show={showAd} onDismiss={onAdDismiss} countdown={3} />
        <div ref={resultRef} className="flex gap-4 max-w-6xl mx-auto overflow-hidden">
          <div className="hidden xl:block w-[160px] shrink-0 sticky top-24 self-start">
            <GameAdSlot slot="3494503358" format="vertical" className="mt-2" width={160} height={600} />
          </div>
          <div className="flex-1 min-w-0 max-w-xl mx-auto space-y-5 overflow-hidden">
            {children}
            <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
              <button onClick={handleStart} className="px-6 py-2.5 rounded-full bg-white/[0.08] border border-white/10 text-cyan-100 font-bold text-sm hover:bg-white/15">{startLabel}</button>
              <button onClick={goFullscreen} className="px-6 py-2.5 rounded-full bg-white/[0.08] border border-white/10 text-cyan-100 font-bold text-sm hover:bg-white/15">⛶ Fullscreen</button>
              {fs && <button onClick={exit} className="px-6 py-2.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-100 font-bold text-sm hover:bg-rose-500/30">✕ Exit game</button>}
              {extraButtons}
            </div>
            <GameAdSlot slot="8865234201" format="horizontal" className="mt-2" />
          </div>
          <div className="hidden xl:block w-[160px] shrink-0 sticky top-24 self-start">
            <GameAdSlot slot="3414612309" format="vertical" className="mt-2" width={160} height={600} />
          </div>
        </div>
      </ToolLayout>
      <footer className="text-center text-[11px] text-slate-600 py-2 font-mono">Neon Arcade · {name || title}</footer>
    </div>
  )
}
