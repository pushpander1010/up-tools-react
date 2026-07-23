import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function ip_address() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const fetchIP = useCallback(async () => {
    setLoading(true)
    setError(null)
    jumpTo()

    try {
      const ipRes = await fetch('https://api.ipify.org?format=json')
      const ipData = await ipRes.json()
      const ip = ipData.ip

      const locRes = await fetch(`https://ipapi.co/${ip}/json/`)
      const locData = await locRes.json()

      setData({
        ip,
        city: locData.city || '—',
        region: locData.region || '—',
        country: locData.country_name || '—',
        countryCode: locData.country_code || '',
        timezone: locData.timezone || '—',
        isp: locData.org || '—',
        lat: locData.latitude || 0,
        lon: locData.longitude || 0,
        postal: locData.postal || '—',
      })
    } catch (err) {
      setError('Failed to fetch IP information. Please try again.')
    }
    setLoading(false)
  }, [jumpTo])

  const handleCopy = useCallback(() => {
    if (!data) return
    navigator.clipboard.writeText(data.ip)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [data])

  // Auto-fetch on first visit
  const [fetched, setFetched] = useState(false)
  if (!fetched && !loading && !data && !error) {
    setFetched(true)
    fetchIP()
  }

  const flagEmoji = data?.countryCode
    ? String.fromCodePoint(...[...data.countryCode.toUpperCase()].map(c => 0x1F1E6 - 65 + c.charCodeAt(0)))
    : '🌍'

  return (
    <ToolLayout
      title="IP Address & ISP Lookup"
      desc="Detect your public IP address, location, ISP, timezone, and coordinates instantly."
      icon="🌐" iconBg="rgba(14,165,233,0.08)"
      category="networking" slug="ip-address"
      faq={[
        { q: 'What is my IP address?', a: 'Your IP (Internet Protocol) address is a unique identifier assigned to your device when connected to the internet. It is like a postal address for data packets — it tells servers where to send responses back.' },
        { q: 'What is the difference between IPv4 and IPv6?', a: 'IPv4 uses 32-bit addresses (e.g., 192.168.1.1) and supports about 4.3 billion addresses. IPv6 uses 128-bit addresses (e.g., 2001:db8::1) and provides a vastly larger address space to accommodate the growing number of internet-connected devices.' },
        { q: 'What is a public vs private IP?', a: 'A public IP is visible to the outside internet and is assigned by your ISP. A private IP (like 192.168.x.x or 10.x.x.x) is used within your local network and is not directly accessible from the internet.' },
      ]}
      howItWorks={[
        'Click "Detect My IP" to fetch your public IP address.',
        'The tool queries your IP via ipify and geolocation via ipapi.co.',
        'View your IP, city, region, country, ISP, timezone, and coordinates.',
        'Click the copy button to copy your IP to the clipboard.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "IP Address Lookup", "applicationCategory": "NetworkingApplication",
        "url": "https://www.uptools.in/ip-address/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Detect button */}
        <button onClick={fetchIP} disabled={loading}
          className="glow-btn w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(14,165,233,0.08))' }}>
          {loading ? '⏳ Detecting...' : '🌐 Detect My IP'}
        </button>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-rose-500/15 bg-rose-500/[0.05] p-4 text-sm text-rose-400 text-center">
            {error}
          </div>
        )}

        {/* Results */}
        {data && (
          <div ref={resultRef} className="space-y-4"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>

            {/* IP Card */}
            <div className="rounded-3xl border border-white/8 bg-gradient-to-br from-sky-500/[0.06] to-transparent p-6 text-center">
              <div className="text-4xl mb-2">{flagEmoji}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Public IP</div>
              <div className="text-3xl font-extrabold text-white font-mono mb-3">{data.ip}</div>
              <button onClick={handleCopy}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${copied
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy IP'}
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                ['🏙️', 'City', data.city],
                ['🗺️', 'Region', data.region],
                ['🏳️', 'Country', `${data.country} (${data.countryCode})`],
                ['🏢', 'ISP', data.isp],
                ['🕐', 'Timezone', data.timezone],
                ['📮', 'Postal', data.postal],
              ].map(([icon, label, value]) => (
                <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                  <div className="text-lg mb-1">{icon}</div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
                  <div className="text-sm text-white font-medium mt-0.5 break-all">{value}</div>
                </div>
              ))}
            </div>

            {/* Coordinates */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">📍 Coordinates</div>
              <div className="text-sm text-white font-mono">
                {data.lat.toFixed(4)}, {data.lon.toFixed(4)}
              </div>
              {/* Visual map placeholder */}
              <div className="mt-3 h-32 rounded-xl bg-white/[0.06] border border-white/8 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `radial-gradient(circle at ${((data.lon + 180) / 360) * 100}% ${((90 - data.lat) / 180) * 100}%, rgba(14,165,233,0.4) 0%, transparent 50%)`,
                  }}
                />
                <div className="relative text-center">
                  <div className="text-2xl mb-1">{flagEmoji}</div>
                  <div className="text-[10px] text-slate-500">Approximate location</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
