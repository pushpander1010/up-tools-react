import { useRef, useCallback } from 'react'

export default function useJumpToResult(deps) {
  const ref = useRef(null)
  const jumped = useRef(false)

  const trigger = useCallback(() => {
    if (!jumped.current) {
      jumped.current = true
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
    }
  }, [])

  const reset = useCallback(() => { jumped.current = false }, [])

  return { ref, trigger, reset }
}
