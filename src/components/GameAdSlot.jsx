import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * AdSense banner slot — CLS-safe.
 * - The wrapper div (with reserved min-height) renders SYNCHRONOUSLY on first
 *   paint, so no content below ever shifts when the ad fills in late.
 * - Only the adsbygoogle.push() is delayed (400ms, after paint) to protect INP.
 * - Vertical rails use CSS `hidden lg:block` (no JS matchMedia gate), so mobile
 *   never reserves space and desktop always reserves 160x600.
 */
export default function GameAdSlot({ slot = '8865234201', format = 'auto', className = '', width, height }) {
  const adRef = useRef(null)
  const location = useLocation()
  const isVertical = format === 'vertical'

  // Render the ad once per mount, after React has painted, so the async ad load
  // doesn't contend with first meaningful paint.
  useEffect(() => {
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
  }, [location.pathname])

  // Fixed-size rail (desktop only via CSS): always reserves 160x600.
  if (width && height) {
    return (
      <div
        className={`w-full overflow-hidden text-center ${isVertical ? 'hidden lg:block' : ''} ${className}`}
        style={{ minWidth: width + 'px', minHeight: height + 'px' }}
      >
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'inline-block', width: width + 'px', height: height + 'px' }}
          data-ad-client="ca-pub-6216304334889617"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    )
  }

  // Responsive slots: wrapper reserves space up-front (90px horizontal,
  // 250px otherwise — covers 728x90 / 970x90 / 300x250 / 320x100).
  const reserved = format === 'horizontal' ? 90 : 250
  return (
    <div
      className={`w-full overflow-hidden text-center ${className}`}
      style={{ minHeight: reserved + 'px' }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: reserved + 'px' }}
        data-ad-client="ca-pub-6216304334889617"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
