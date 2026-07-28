import { useEffect, useRef } from 'react'

/**
 * AdSense banner slot — renders a responsive ad unit.
 * Slot IDs: bottom=8865234201, left=4214854395, right=4462954769
 */
export default function GameAdSlot({ slot = '8865234201', format = 'auto', className = '' }) {
  const adRef = useRef(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    const timer = setTimeout(() => {
      try {
        if (adRef.current) {
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
          pushed.current = true
        }
      } catch (e) {
        console.warn('AdSense push error:', e)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`w-full overflow-hidden text-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minWidth: '300px', minHeight: format === 'horizontal' ? '90px' : '250px' }}
        data-ad-client="ca-pub-6216304334889617"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
