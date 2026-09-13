import { useEffect, useRef } from 'react'

/**
 * AdSense banner slot — CLS-safe + INP-safe.
 * - The wrapper div (with reserved min-height) renders SYNCHRONOUSLY on first
 *   paint, so no content below ever shifts when the ad fills in late.
 * - The adsbygoogle.push() fires ONCE per mount (not on every SPA route
 *   change), via requestIdleCallback, and is skipped entirely when the slot
 *   is hidden by CSS (e.g. desktop-only rails on mobile) — hidden slots
 *   must never push, they only cost main-thread time for zero revenue.
 * - Vertical rails use CSS `hidden lg:block` (no JS matchMedia gate), so mobile
 *   never reserves space and desktop always reserves 160x600.
 */
export default function GameAdSlot({ slot = '8865234201', format = 'auto', className = '', width, height }) {
  const adRef = useRef(null)
  const isVertical = format === 'vertical'

  // Render the ad once per mount, when the browser is idle, so the async ad
  // load never contends with first paint or user interaction (INP).
  useEffect(() => {
    const fire = () => {
      try {
        if (window.__loadAds) window.__loadAds();
        const ins = adRef.current;
        if (!ins || ins.hasAttribute('data-loaded') || !window.adsbygoogle) return;
        // Skip hidden slots (CSS `hidden lg:block` rails on mobile etc.)
        const rect = ins.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return;
        ins.setAttribute('data-loaded', 'true');
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn('AdSense push error:', e);
      }
    };
    let idleId = null;
    let timer = null;
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(fire, { timeout: 4000 });
    } else {
      timer = setTimeout(fire, 1500);
    }
    return () => {
      if (idleId !== null && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      if (timer !== null) clearTimeout(timer);
    };
  }, []);

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
