import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * AdSense banner slot — refreshes on every route change for max impressions.
 */
export default function GameAdSlot({ slot = '8865234201', format = 'auto', className = '', width, height }) {
  const adRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const ins = adRef.current
        if (ins) {
          // Clear previous ad content so AdSense renders fresh
          ins.innerHTML = ''
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        }
      } catch (e) {
        console.warn('AdSense push error:', e)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [location.pathname]) // Re-run on every route change

  const insStyle = width && height
    ? { display: 'inline-block', width: width + 'px', height: height + 'px' }
    : { display: 'block', width: '100%', minWidth: '300px', minHeight: format === 'horizontal' ? '90px' : '250px' }

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
