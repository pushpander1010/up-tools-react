import { useRef, useState, useEffect, useCallback } from 'react'

export default function InfiniteCarousel({ children, gap = 16, className = '' }) {
  const scrollRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 5)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    const ro = new ResizeObserver(checkScroll)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', checkScroll); ro.disconnect() }
  }, [checkScroll, children])

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector(':scope > *')?.offsetWidth || 300
    el.scrollBy({ left: dir * (cardWidth + gap) * 2, behavior: 'smooth' })
  }

  // Mouse drag
  const onMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
    scrollRef.current.style.cursor = 'grabbing'
  }
  const onMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    scrollRef.current.scrollLeft = scrollLeft - (x - startX)
  }
  const onMouseUp = () => {
    setIsDragging(false)
    scrollRef.current.style.cursor = 'grab'
  }

  return (
    <div className={`relative group/carousel ${className}`}>
      {/* Scroll Container */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="flex overflow-x-auto scroll-smooth select-none"
        style={{ gap: `${gap}px`, scrollSnapType: 'x mandatory', scrollbarWidth: 'none', cursor: 'grab', WebkitOverflowScrolling: 'touch' }}
      >
        <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>
        <div className="scrollbar-hide flex" style={{ gap: `${gap}px` }}>
          {children}
        </div>
      </div>

      {/* Navigation Arrows */}
      {canPrev && (
        <button onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-10 h-10 rounded-full bg-navy-800/90 border border-white/10 backdrop-blur-sm text-white flex items-center justify-center shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-navy-700 hover:border-white/20 hover:scale-110 z-10">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
      )}
      {canNext && (
        <button onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 rounded-full bg-navy-800/90 border border-white/10 backdrop-blur-sm text-white flex items-center justify-center shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-navy-700 hover:border-white/20 hover:scale-110 z-10">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      )}

      {/* Fade Edges */}
      {canPrev && <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0f172a] to-transparent pointer-events-none z-[5]" />}
      {canNext && <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0f172a] to-transparent pointer-events-none z-[5]" />}
    </div>
  )
}
