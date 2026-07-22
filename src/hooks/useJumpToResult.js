import { useRef, useCallback } from 'react'

export default function useJumpToResult() {
  const ref = useRef(null)

  const jumpTo = useCallback(() => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }, [])

  return { ref, jumpTo }
}
