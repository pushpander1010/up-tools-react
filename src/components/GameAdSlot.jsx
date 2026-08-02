import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * AdSense banner slot.
 * - Pushes the ad exactly ONCE per mount (no clearing/re-push on route change),
 *   which removes a major main-thread INP cost.
 * - Skips rendering vertical sidebar slots on small screens (they are CSS-hidden
 *   there anyway), so we never waste a push on a slot the user can't see.
 * - Reserves the ad's final box size up front to avoid layout shift (CLS).
 */
export default function GameAdSlot({ slot = '8865234201', format = 'auto', className = '', width, height }) {
  const adRef = useRef(null)
  const location = useLocation()
  const [rendered, setRendered] = useState(false)

  // Vertical sidebar slots only make sense on desktop (>=1024px, matches lg:block).
  useEffect(() => {
    if (format !== 'vertical') { setRendered(true); return }
    const mq = window.matchMedia('(min-width: 1024px)')
    setRendered(mq.matches)
    const onChange = (e) => setRendered(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [format])

  // Render the ad once per mount, after React has painted, so the async ad load
  // doesn't contend with first meaningful paint.
  useEffect(() => {
    if (!rendered) return
    const timer = setTimeout(() => {
      try {
        const ins = adRef.current
        if (ins && !ins.hasAttribute('data-loaded')) {
          ins.setAttribute('data-loaded', 'true')
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        }
      } catch (e) {
        console.warn('AdSense push error:', e)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [rendered, location.pathname])

  if (!rendered) return null

  const insStyle = width && height
    ? { display: 'inline-block', width: width + 'px', height: height + 'px' }
    : { display: 'block', width: '100%', minWidth: '300px', height: format === 'horizontal' ? '90px' : '250px' }

  return (
    <div className={`w-full overflow-hidden text-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={insStyle}
        data-ad-client="ca-pub-6216304334889617"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
