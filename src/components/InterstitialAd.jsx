import { useState, useEffect, useRef } from 'react'

/**
 * Full-screen interstitial ad overlay. Shows on trigger, dismiss after countdown.
 */
export default function InterstitialAd({ show, onDismiss, countdown = 5 }) {
  const [sec, setSec] = useState(countdown)
  const [visible, setVisible] = useState(false)
  const pushed = useRef(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      setSec(countdown)
      pushed.current = false
    }
  }, [show, countdown])

  useEffect(() => {
    if (!visible) return
    if (sec <= 0) {
      setVisible(false)
      onDismiss?.()
      return
    }
    const t = setTimeout(() => setSec(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [visible, sec, onDismiss])

  // Push ad when interstitial becomes visible
  useEffect(() => {
    if (!visible || pushed.current) return
    const timer = setTimeout(() => {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        pushed.current = true
      } catch {}
    }, 300)
    return () => clearTimeout(timer)
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget && sec <= 0) { setVisible(false); onDismiss?.() } }}>
      {sec <= 0 && (
        <button onClick={() => { setVisible(false); onDismiss?.() }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white text-xl flex items-center justify-center hover:bg-white/20 transition-all z-10">
          ✕
        </button>
      )}
      <div className="w-full max-w-lg mb-6">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '250px', background: 'transparent' }}
          data-ad-client="ca-pub-6216304334889617"
          data-ad-slot="4031056959"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
      <div className="text-center">
        {sec > 0 ? (
          <p className="text-slate-400 text-sm">Starting in {sec}s...</p>
        ) : (
          <button onClick={() => { setVisible(false); onDismiss?.() }}
            className="glow-btn px-8 py-3 text-sm">
            ▶ Start Game
          </button>
        )}
      </div>
    </div>
  )
}
