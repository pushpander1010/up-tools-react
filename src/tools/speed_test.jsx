import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'

const ITERATIONS = 3
const DL_URLS = [
  'https://speed.cloudflare.com/__down?bytes=25000000',
  'https://speed.cloudflare.com/__down?bytes=10000000',
  'https://speed.cloudflare.com/__down?bytes=5000000',
]
const UPLOAD_URL = 'https://www.uptools.in/speedtest/upload'
const UL_SIZE = 5 * 1024 * 1024

const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

export default function speed_test() {
  const [status, setStatus] = useState('')
  const [gaugeVal, setGaugeVal] = useState(0)
  const [gaugeLabel, setGaugeLabel] = useState('Mbps')
  const [ping, setPing] = useState(null)
  const [dl, setDl] = useState(null)
  const [ul, setUl] = useState(null)
  const [testing, setTesting] = useState(false)
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('speedtest_history') || '[]') } catch { return [] }
  })
  const abortRef = useRef(null)

  const measurePing = useCallback(async () => {
    const hosts = ['https://1.1.1.1', 'https://www.gstatic.com/generate_204', 'https://cp.cloudflare.com/']
    const results = []
    for (let i = 0; i < 5; i++) {
      for (const host of hosts) {
        try {
          const t0 = performance.now()
          await fetch(host, { mode: 'no-cors', cache: 'no-store' })
          const ms = Math.round(performance.now() - t0)
          if (ms > 0 && ms < 5000) { results.push(ms); break }
        } catch {}
      }
    }
    return results.length ? Math.round(median(results)) : -1
  }, [])

  const testDownload = useCallback(async (onProgress) => {
    for (const url of DL_URLS) {
      try {
        const t0 = performance.now()
        const resp = await fetch(url, { cache: 'no-store', signal: abortRef.current?.signal })
        if (!resp.ok) continue
        const reader = resp.body.getReader()
        const contentLen = parseInt(resp.headers.get('content-length') || '0', 10)
        let received = 0
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          received += value.byteLength
          if (contentLen > 0) onProgress(received, contentLen)
        }
        const ms = performance.now() - t0
        if (ms < 50) continue
        const mbps = Math.round((received * 8 / (ms / 1000) / 1e6) * 10) / 10
        if (mbps > 0) return mbps
      } catch {}
    }
    return null
  }, [])

  const testUpload = useCallback(async () => {
    const payload = new Uint8Array(UL_SIZE)
    for (let i = 0; i < payload.length; i += 4096) payload[i] = 0x41
    try {
      const t0 = performance.now()
      await fetch(UPLOAD_URL, { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: payload, cache: 'no-store', signal: abortRef.current?.signal })
      const ms = performance.now() - t0
      if (ms < 50) return null
      return Math.round((UL_SIZE * 8 / (ms / 1000) / 1e6) * 10) / 10
    } catch { return null }
  }, [])

  const runTest = useCallback(async () => {
    setTesting(true); abortRef.current = new AbortController()
    setPing(null); setDl(null); setUl(null)
    setGaugeVal(0); setGaugeLabel('Mbps')

    // Phase 1: Ping
    setStatus('Measuring ping...')
    setGaugeVal(2)
    const p = await measurePing()
    setPing(p > 0 ? p : null)

    // Phase 2: Download
    const dlResults = []
    for (let i = 1; i <= ITERATIONS; i++) {
      setStatus(`Download (${i}/${ITERATIONS})...`)
      setGaugeVal(5 + ((i - 1) / ITERATIONS) * 70)
      const r = await testDownload((recv, total) => {
        const base = 5 + ((i - 1) / ITERATIONS) * 70
        setGaugeVal(base + (recv / total) * (70 / ITERATIONS))
      })
      if (r !== null) dlResults.push(r)
    }

    if (dlResults.length === 0) {
      setStatus('Download failed — check your connection')
      setTesting(false)
      return
    }
    const dlMbps = Math.round(median(dlResults) * 10) / 10
    setDl(dlMbps)
    setGaugeVal(100); setGaugeLabel('Mbps ↓')

    // Phase 3: Upload
    const ulResults = []
    for (let i = 1; i <= ITERATIONS; i++) {
      setStatus(`Upload (${i}/${ITERATIONS})...`)
      setGaugeVal(80 + ((i - 1) / ITERATIONS) * 18)
      const r = await testUpload()
      if (r !== null) ulResults.push(r)
    }
    const ulMbps = ulResults.length ? Math.round(median(ulResults) * 10) / 10 : 0
    setUl(ulMbps > 0 ? ulMbps : null)

    setStatus('Done ✓')
    setTesting(false)

    // Save history
    const entry = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString(),
      ping: p > 0 ? p : '—', dl: dlMbps, ul: ulMbps > 0 ? ulMbps : '—',
    }
    setHistory(prev => [entry, ...prev].slice(0, 10))
    localStorage.setItem('speedtest_history', JSON.stringify([entry, ...history].slice(0, 10)))
  }, [measurePing, testDownload, testUpload, history])

  const stopTest = useCallback(() => { abortRef.current?.abort(); setTesting(false); setStatus('Stopped') }, [])

  const gaugeOffset = 666 - (gaugeVal / 100) * 666

  return (
    <ToolLayout
      title="Internet Speed Test"
      desc="Measure your download, upload speed and ping. Cloudflare-powered, accurate results."
      icon="⚡" iconBg="rgba(34,197,94,0.08)"
      category="networking" slug="speed-test"
      faq={[
        { q: 'How accurate is this speed test?', a: 'Uses Cloudflare CDN edge servers. Each test runs 3 iterations and takes the median for consistency.' },
        { q: 'Does this store my data?', a: 'No. All measurements happen in your browser. Nothing is sent to any server.' },
        { q: 'What units are used?', a: 'Speed is shown in Mbps (megabits per second). 100 Mbps ≈ 12.5 MB/s file download.' },
      ]}
      howItWorks={[
        'Click Start to begin the test.',
        'Ping is measured first, then download (3 passes), then upload (3 passes).',
        'Results are shown with a gauge and stat cards.',
        'History of recent tests is saved locally.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'Internet Speed Test', applicationCategory: 'UtilitiesApplication',
        url: 'https://www.uptools.in/speed-test/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      }}
    >
      <div className="max-w-md mx-auto space-y-6">
        {/* Gauge */}
        <div className="flex justify-center">
          <div className="relative w-56 h-56">
            <svg viewBox="0 0 240 240" className="w-full h-full">
              <circle cx="120" cy="120" r="106" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
              <circle cx="120" cy="120" r="106" fill="none" stroke="url(#gaugeGrad)" strokeWidth="12"
                strokeLinecap="round" strokeDasharray="666" strokeDashoffset={gaugeOffset}
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                transform="rotate(-90 120 120)" />
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-extrabold text-white">{testing || dl ? (dl || gaugeVal > 0 ? gaugeVal : '—') : '—'}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">{gaugeLabel}</div>
            </div>
          </div>
        </div>

        {/* Status */}
        {status && <div className="text-center text-sm font-semibold text-slate-400">{status}</div>}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 text-center">
            <div className="text-xs text-slate-500 mb-1">Ping</div>
            <div className="text-lg font-bold text-white">{ping !== null ? `${ping} ms` : '—'}</div>
          </div>
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 text-center">
            <div className="text-xs text-slate-500 mb-1">Download</div>
            <div className="text-lg font-bold text-cyan-400">{dl !== null ? `${dl}` : '—'}</div>
            {dl !== null && <div className="text-[10px] text-slate-600">Mbps</div>}
          </div>
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 text-center">
            <div className="text-xs text-slate-500 mb-1">Upload</div>
            <div className="text-lg font-bold text-purple-400">{ul !== null ? `${ul}` : '—'}</div>
            {ul !== null && <div className="text-[10px] text-slate-600">Mbps</div>}
          </div>
        </div>

        {/* Button */}
        {testing ? (
          <button onClick={stopTest}
            className="w-full py-4 rounded-2xl bg-red-500/15 border-2 border-red-500/30 text-red-400 font-bold text-sm hover:bg-red-500/25 transition-all active:scale-[0.98]">
            ⏹ Stop Test
          </button>
        ) : (
          <button onClick={runTest}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm hover:from-green-400 hover:to-emerald-400 transition-all active:scale-[0.98]">
            {dl !== null ? '🔄 Test Again' : '▶ Start Speed Test'}
          </button>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Results</h3>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/[0.04]">
                  <div>
                    <div className="text-sm font-semibold text-white">↓ {h.dl} Mbps / ↑ {h.ul} Mbps</div>
                    <div className="text-[10px] text-slate-600">{h.date} {h.time} · Ping: {h.ping}ms</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
