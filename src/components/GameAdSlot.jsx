import { useLayoutEffect, useRef } from 'react'

/**
 * AdSense banner slot — renders a responsive ad unit.
 * Slot IDs: bottom=8865234201, left=4214854395, right=4462954769
 */
export default function GameAdSlot({ slot = '8865234201', format = 'auto', className = '' }) {
  const ref = useRef(null)
  const pushed = useRef(false)

  useLayoutEffect(() => {
    if (pushed.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {}
  }, [])

  return (
    <div className={`overflow-hidden text-center ${className}`}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6216304334889617"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
