import { useState, useCallback } from 'react'

/**
 * Fullscreen toggle hook. Returns [isFullscreen, toggleFs].
 * Uses Fullscreen API with vendor prefixes for Safari/Chrome/Firefox.
 */
export default function useFullscreen() {
  const [isFs, setIsFs] = useState(false)

  const toggle = useCallback(() => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const el = document.documentElement
      const req = el.requestFullscreen || el.webkitRequestFullscreen
      if (req) {
        req.call(el)
        setIsFs(true)
      }
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen
      if (exit) {
        exit.call(document)
        setIsFs(false)
      }
    }
  }, [])

  // Listen for fullscreen changes (user pressing Escape, etc.)
  const onChange = useCallback(() => {
    setIsFs(!!(document.fullscreenElement || document.webkitFullscreenElement))
  }, [])

  // We return the handler; caller should attach to fullscreenchange event in useEffect
  return { isFs, toggle, onChange }
}
