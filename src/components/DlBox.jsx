import { useState, useCallback, useRef } from 'react'

const API = 'https://backend.uptools.in'

// Shared server-download box: tries our backend first (real file),
// falls back to trusted third-party services when the platform blocks us.
export default function DlBox({
  placeholder = 'Paste video URL here...',
  buttonLabel = 'Download',
  loadingLabel = '⏳ Finding...',
  accent = 'blue',
  audio = true,
  services = [],
  fallbackTitle = 'Try a download service',
  fallbackText = "Our server can't fetch this link directly. Paste it into one of these free services:",
  filePrefix = 'video',
}) {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | ready | fallback
  const [info, setInfo] = useState(null)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const ref = useRef(null)
  const jump = () => setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100)

  const lookup = useCallback(async () => {
    const trimmed = url.trim()
    setError('')
    setInfo(null)
    if (!trimmed) { setError('Please paste a URL first.'); return }
    try { new URL(trimmed) } catch { setError('Please enter a valid URL.'); return }
    setStatus('loading')
    try {
      const r = await fetch(API + '/api/dl/info', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.detail || 'Lookup failed')
      setInfo({ ...data, originalUrl: trimmed })
      setStatus('ready')
    } catch (e) {
      setError(e.message || 'Lookup failed')
      setStatus('fallback')
    }
    jump()
  }, [url])

  const download = useCallback(async (audioOnly) => {
    if (!info) return
    setDownloading(true)
    setError('')
    try {
      const r = await fetch(API + '/api/dl', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: info.originalUrl, audio_only: audioOnly }),
      })
      if (!r.ok) {
        const data = await r.json().catch(() => ({}))
        throw new Error(data.detail || 'Download failed')
      }
      const blob = await r.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = (info.title || filePrefix).replace(/[^\w\- ]+/g, '').slice(0, 60) + (audioOnly ? '.mp3' : '.mp4')
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(a.href), 5000)
    } catch (e) {
      setError(e.message || 'Download failed')
    }
    setDownloading(false)
  }, [info, filePrefix])

  const solid = {
    blue: 'bg-blue-600 hover:bg-blue-500',
    red: 'bg-red-500 hover:bg-red-400',
    pink: 'bg-pink-500 hover:bg-pink-400',
    indigo: 'bg-indigo-500 hover:bg-indigo-400',
    sky: 'bg-sky-500 hover:bg-sky-400',
    cyan: 'bg-cyan-600 hover:bg-cyan-500',
    emerald: 'bg-emerald-600 hover:bg-emerald-500',
    yellow: 'bg-yellow-500 hover:bg-yellow-400',
    violet: 'bg-violet-600 hover:bg-violet-500',
  }[accent] || 'bg-blue-600 hover:bg-blue-500'

  const soft = {
    blue: 'border-blue-500/15 from-blue-500/[0.06]',
    red: 'border-red-500/15 from-red-500/[0.06]',
    pink: 'border-pink-500/15 from-pink-500/[0.06]',
    indigo: 'border-indigo-500/15 from-indigo-500/[0.06]',
    sky: 'border-sky-500/15 from-sky-500/[0.06]',
    cyan: 'border-cyan-500/15 from-cyan-500/[0.06]',
    emerald: 'border-emerald-500/15 from-emerald-500/[0.06]',
    yellow: 'border-yellow-500/15 from-yellow-500/[0.06]',
    violet: 'border-violet-500/15 from-violet-500/[0.06]',
  }[accent] || 'border-blue-500/15 from-blue-500/[0.06]'

  const dot = {
    blue: 'bg-blue-400 text-blue-400', red: 'bg-red-400 text-red-400',
    pink: 'bg-pink-400 text-pink-400', indigo: 'bg-indigo-400 text-indigo-400',
    sky: 'bg-sky-400 text-sky-400', cyan: 'bg-cyan-400 text-cyan-400',
    emerald: 'bg-emerald-400 text-emerald-400', yellow: 'bg-yellow-400 text-yellow-400',
    violet: 'bg-violet-400 text-violet-400',
  }[accent] || 'bg-blue-400 text-blue-400'
  const [dotBg, txt] = dot.split(' ')

  const ytId = (u) => {
    const m = (u || '').match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return m ? m[1] : ''
  }
  const buildHref = (h) => h.replace('{id}', ytId(url)).replace('{url}', encodeURIComponent(url))

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <div className="space-y-4" ref={ref}>
      <input type="text" value={url} onChange={e => { setUrl(e.target.value); setError('') }}
        onKeyDown={e => e.key === 'Enter' && lookup()}
        placeholder={placeholder} className={inputClass} />

      <button onClick={lookup} disabled={status === 'loading'}
        className={`w-full py-4 rounded-2xl text-white font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 ${solid}`}>
        {status === 'loading' ? loadingLabel : buttonLabel}
      </button>

      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">❌ {error}</div>}

      {status === 'ready' && info && (
        <div className={`rounded-3xl border-2 ${soft} bg-gradient-to-br via-white/[0.01] to-transparent p-6 overflow-hidden`}
          style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-2 rounded-full animate-pulse ${dotBg}`} />
            <h3 className={`text-sm font-bold uppercase tracking-wider ${txt}`}>Ready to Download</h3>
          </div>
          {info.thumbnail && <img src={info.thumbnail} alt="" className="w-full rounded-xl mb-4 max-h-56 object-cover" />}
          <p className="text-white font-semibold mb-4">{info.title || 'Media file'}</p>
          <div className="space-y-3">
            <button onClick={() => download(false)} disabled={downloading}
              className={`block w-full py-4 rounded-2xl text-white font-bold text-sm transition-all disabled:opacity-50 ${solid}`}>
              {downloading ? '⏳ Downloading...' : '📥 Download Video (MP4)'}
            </button>
            {audio && (
              <button onClick={() => download(true)} disabled={downloading}
                className="block w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 font-bold text-sm hover:text-white transition-all disabled:opacity-50">
                🎵 Audio only (MP3)
              </button>
            )}
          </div>
        </div>
      )}

      {status === 'fallback' && services.length > 0 && (
        <div className={`rounded-3xl border-2 ${soft} bg-white/[0.02] p-6`}>
          <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${txt}`}>{fallbackTitle}</h3>
          <p className="text-sm text-slate-400 mb-4">{fallbackText}</p>
          <div className="space-y-3">
            {services.map((s, i) => (
              <a key={i} href={buildHref(s.href)} target="_blank" rel="noopener noreferrer"
                className={i === 0
                  ? `block w-full py-3 rounded-xl text-white font-bold text-sm text-center transition-all no-underline ${solid}`
                  : 'block w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 font-bold text-sm text-center hover:text-white transition-all no-underline'}>
                📥 {s.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
