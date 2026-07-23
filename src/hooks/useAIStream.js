import { useState, useRef, useCallback } from 'react'

/**
 * Shared hook for AI streaming tools.
 * Returns { output, status, streaming, generate, stop }
 * 
 * Usage:
 *   const { output, status, streaming, generate, stop } = useAIStream()
 *   generate({ messages, temperature })
 */
export default function useAIStream() {
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState('')
  const [streaming, setStreaming] = useState(false)
  const abortRef = useRef(null)

  const stop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const generate = useCallback(async ({ messages, temperature = 0.7, systemPrompt }) => {
    if (streaming) return

    setOutput('')
    setStatus('Generating…')
    setStreaming(true)

    const allMessages = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/ai', {
        method: 'POST',
        signal: abortRef.current.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stream: true,
          temperature,
          messages: allMessages,
        }),
      })

      if (!res.ok) throw new Error('HTTP ' + res.status)

      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let accumulated = ''

      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        for (const line of dec.decode(value).split('\n')) {
          const t = line.trim()
          if (!t.startsWith('data:')) continue
          const p = t.slice(5).trim()
          if (p === '[DONE]') break
          try {
            const d = JSON.parse(p).choices?.[0]?.delta?.content ?? ''
            if (d) {
              accumulated += d
              setOutput(accumulated)
            }
          } catch {}
        }
      }

      setStatus('Done ✓')
    } catch (e) {
      setStatus(e.name === 'AbortError' ? 'Stopped.' : 'Error: ' + e.message)
    } finally {
      setStreaming(false)
      abortRef.current = null
    }
  }, [streaming])

  return { output, status, streaming, generate, stop }
}
