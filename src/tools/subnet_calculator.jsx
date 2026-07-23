import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function ipToLong(ip) {
  const parts = ip.trim().split('.')
  if (parts.length !== 4) return null
  let n = 0
  for (let i = 0; i < 4; i++) {
    const v = parseInt(parts[i], 10)
    if (isNaN(v) || v < 0 || v > 255) return null
    n = (n * 256) + v
  }
  return n >>> 0
}

function longToIp(n) {
  n = n >>> 0
  return [(n>>>24)&255, (n>>>16)&255, (n>>>8)&255, n&255].join('.')
}

function cidrToMask(cidr) {
  if (cidr < 0 || cidr > 32) return null
  if (cidr === 0) return 0
  return (0xFFFFFFFF << (32 - cidr)) >>> 0
}

function maskToCidr(mask) {
  let n = mask >>> 0
  let found0 = false, count = 0
  for (let i = 31; i >= 0; i--) {
    const bit = (n >> i) & 1
    if (bit === 1) { if (found0) return null; count++ }
    else found0 = true
  }
  if ((cidrToMask(count) >>> 0) === (n >>> 0)) return count
  return null
}

function isValidIp(ip) { return ipToLong(ip) !== null }

function getIpClass(ip) {
  const first = parseInt(ip.split('.')[0], 10)
  if (first === 127) return 'Loopback'
  if (first >= 1 && first <= 126) return 'A'
  if (first >= 128 && first <= 191) return 'B'
  if (first >= 192 && first <= 223) return 'C'
  if (first >= 224 && first <= 239) return 'D'
  if (first >= 240) return 'E'
  return '—'
}

function toBinary(n) {
  return [...Array(4)].map((_, i) => ((n >>> ((3-i)*8)) & 0xFF).toString(2).padStart(8,'0'))
}

function fmtNum(n) {
  if (n === 0) return '0'
  return n.toLocaleString('en-US')
}

const CIDR_TABLE = Array.from({ length: 33 }, (_, p) => {
  const maskLong = cidrToMask(p) >>> 0
  const wildLong = (~maskLong) >>> 0
  const total = p === 0 ? 4294967296 : Math.pow(2, 32 - p)
  const usable = p >= 31 ? (p === 32 ? 1 : 2) : total - 2
  const cls = p === 32 ? 'Host' : p === 31 ? 'P2P' : p >= 24 ? 'C' : p >= 16 ? 'B' : p >= 8 ? 'A' : p >= 4 ? 'D' : 'E'
  return { prefix: p, mask: longToIp(maskLong), wildcard: longToIp(wildLong), total, usable, cls }
})

export default function subnet_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [ip, setIp] = useState('')
  const [mask, setMask] = useState('')
  const [cidr, setCidr] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    setError('')
    let ipAddr, cidrVal, maskAddr

    const cidrRaw = cidr.trim()
    const ipRaw = ip.trim()
    const maskRaw = mask.trim()

    if (cidrRaw) {
      const match = cidrRaw.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/)
      if (!match) { setError('Invalid CIDR format. Use e.g. 192.168.1.0/24'); return }
      ipAddr = match[1]; cidrVal = parseInt(match[2], 10)
      if (!isValidIp(ipAddr)) { setError('Invalid IP address in CIDR.'); return }
      if (cidrVal < 0 || cidrVal > 32) { setError('CIDR prefix must be 0-32.'); return }
      maskAddr = longToIp(cidrToMask(cidrVal))
      setIp(ipAddr); setMask(maskAddr)
    } else if (ipRaw && maskRaw) {
      ipAddr = ipRaw; maskAddr = maskRaw
      if (!isValidIp(ipAddr)) { setError('Invalid IP address.'); return }
      if (!isValidIp(maskAddr)) { setError('Invalid subnet mask.'); return }
      const c = maskToCidr(ipToLong(maskAddr))
      if (c === null) { setError('Invalid subnet mask (non-contiguous bits).'); return }
      cidrVal = c
      setCidr(ipAddr + '/' + cidrVal)
    } else {
      setError('Enter CIDR notation OR IP + subnet mask.')
      return
    }

    const ipLong = ipToLong(ipAddr) >>> 0
    const maskLong = cidrToMask(cidrVal) >>> 0
    const wildLong = (~maskLong) >>> 0
    const netLong = (ipLong & maskLong) >>> 0
    const bcastLong = (netLong | wildLong) >>> 0
    const firstLong = cidrVal < 31 ? (netLong + 1) >>> 0 : netLong
    const lastLong = cidrVal < 31 ? (bcastLong - 1) >>> 0 : bcastLong
    const totalIPs = cidrVal === 0 ? 4294967296 : Math.pow(2, 32 - cidrVal)
    const usable = cidrVal >= 31 ? (cidrVal === 32 ? 1 : 2) : totalIPs - 2

    const ipBin = toBinary(ipLong)
    const maskBin = toBinary(maskLong)
    const netBin = toBinary(netLong)
    const bcastBin = toBinary(bcastLong)

    setResult({
      network: longToIp(netLong),
      broadcast: longToIp(bcastLong),
      firstHost: longToIp(firstLong),
      lastHost: longToIp(lastLong),
      usable, totalIPs,
      mask: maskAddr,
      wildcard: longToIp(wildLong),
      cidr: '/' + cidrVal,
      ipClass: getIpClass(ipAddr),
      ipBin, maskBin, netBin, bcastBin
    })
    jumpTo()
  }, [ip, mask, cidr, jumpTo])

  const clearAll = useCallback(() => { setIp(''); setMask(''); setCidr(''); setError(''); setResult(null) }, [])
  const loadExample = useCallback((ex) => { setCidr(ex); setIp(''); setMask(''); setError(''); setTimeout(calculate, 0) }, [calculate])

  const cards = result ? [
    ['Network Address', result.network, 'cyan'],
    ['Broadcast Address', result.broadcast, 'purple'],
    ['First Host', result.firstHost, 'emerald'],
    ['Last Host', result.lastHost, 'emerald'],
    ['Usable Hosts', fmtNum(result.usable), 'amber'],
    ['Total IPs', fmtNum(result.totalIPs), 'slate'],
    ['Subnet Mask', result.mask, 'cyan'],
    ['Wildcard Mask', result.wildcard, 'cyan'],
    ['CIDR Prefix', result.cidr, 'cyan'],
    ['IP Class', result.ipClass, 'amber'],
  ] : []

  return (
    <ToolLayout
      title="Subnet Calculator"
      desc="Calculate network address, broadcast, host range, wildcard mask from IP/CIDR."
      icon="🌐" iconBg="rgba(6,182,212,0.08)"
      category="dev" slug="subnet-calculator"
      faq={[
        { q: 'What is CIDR?', a: 'CIDR (Classless Inter-Domain Routing) notation uses /prefix to indicate network bits, e.g. /24 = 255.255.255.0.' },
        { q: 'What are usable hosts?', a: 'Total IPs minus 2 (network + broadcast addresses). A /30 gives 2 usable hosts.' },
      ]}
      howItWorks={[
        'Enter an IP address with CIDR notation (e.g. 192.168.1.0/24).',
        'Or enter IP address and subnet mask separately.',
        'Click Calculate to see network details, binary representations, and CIDR reference.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Subnet Calculator", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/subnet-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Input */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">IP Address</label>
              <input type="text" value={ip} onChange={e => setIp(e.target.value)}
                placeholder="192.168.1.0"
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Subnet Mask</label>
              <input type="text" value={mask} onChange={e => setMask(e.target.value)}
                placeholder="255.255.255.0"
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600" />
            </div>
          </div>
          <div className="text-center text-xs text-slate-500">— OR use CIDR notation —</div>
          <div className="flex gap-2">
            <input type="text" value={cidr} onChange={e => setCidr(e.target.value)}
              placeholder="192.168.1.0/24"
              className="flex-1 bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600" />
            <button onClick={calculate}
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
              Calculate
            </button>
          </div>
          {error && <div className="text-xs text-red-400">{error}</div>}
          <div className="flex gap-2 flex-wrap">
            <button onClick={clearAll} className="px-3 py-1.5 rounded-lg text-xs text-slate-400 bg-white/[0.04] border border-white/[0.08]">✕ Clear</button>
            <button onClick={() => loadExample('192.168.1.0/24')} className="px-3 py-1.5 rounded-lg text-xs text-cyan-400 bg-cyan-500/[0.08] border border-cyan-500/20">Example: /24</button>
            <button onClick={() => loadExample('10.0.0.0/8')} className="px-3 py-1.5 rounded-lg text-xs text-purple-400 bg-purple-500/[0.08] border border-purple-500/20">Example: /8</button>
            <button onClick={() => loadExample('172.16.0.0/12')} className="px-3 py-1.5 rounded-lg text-xs text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/20">Example: /12</button>
          </div>
        </div>

        {/* Results */}
        {result ? (
          <div ref={resultRef} className="space-y-5" style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="rounded-3xl border-2 border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.06] via-white/[0.01] to-transparent p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Subnet Results</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {cards.map(([label, val, color], i) => (
                  <div key={i} className="p-3 rounded-xl bg-black/20 border border-white/[0.04]">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</div>
                    <div className={`text-sm font-mono font-bold text-${color}-400`}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Binary */}
            <div className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-5 overflow-x-auto">
              <h3 className="text-sm font-bold text-slate-300 mb-3">Binary Representations</h3>
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-slate-500 border-b border-white/[0.04]">
                    <th className="text-left py-2 pr-3">Field</th>
                    <th className="text-left py-2 pr-3">Decimal</th>
                    <th className="text-left py-2">Binary</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['IP Address', ip, result.ipBin],
                    ['Subnet Mask', result.mask, result.maskBin],
                    ['Network', result.network, result.netBin],
                    ['Broadcast', result.broadcast, result.bcastBin],
                  ].map(([label, dec, bin], i) => (
                    <tr key={i} className="border-b border-white/[0.04]">
                      <td className="py-2 pr-3 text-slate-400">{label}</td>
                      <td className="py-2 pr-3 text-white">{dec}</td>
                      <td className="py-2 text-cyan-400">{bin.join('.')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.02]">
            <div className="text-4xl mb-3 opacity-20">🌐</div>
            <p className="text-sm text-slate-600 font-medium">Enter an IP/CIDR or IP + subnet mask and click Calculate</p>
          </div>
        )}

        {/* CIDR Reference */}
        <div className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-5 overflow-x-auto">
          <h3 className="text-sm font-bold text-slate-300 mb-3">📋 CIDR Reference Table</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-white/[0.08]">
                <th className="text-left py-2 pr-2">CIDR</th>
                <th className="text-left py-2 pr-2">Mask</th>
                <th className="text-left py-2 pr-2">Wildcard</th>
                <th className="text-right py-2 pr-2">Total</th>
                <th className="text-right py-2 pr-2">Usable</th>
                <th className="text-left py-2">Class</th>
              </tr>
            </thead>
            <tbody>
              {CIDR_TABLE.map(r => (
                <tr key={r.prefix} className={`border-b border-white/[0.04] ${result?.cidr === '/' + r.prefix ? 'bg-cyan-500/10' : ''}`}>
                  <td className="py-1.5 font-mono text-white">/{r.prefix}</td>
                  <td className="py-1.5 font-mono text-slate-400">{r.mask}</td>
                  <td className="py-1.5 font-mono text-slate-400">{r.wildcard}</td>
                  <td className="py-1.5 font-mono text-white text-right">{fmtNum(r.total)}</td>
                  <td className="py-1.5 font-mono text-white text-right">{fmtNum(r.usable)}</td>
                  <td className="py-1.5 text-slate-400">{r.cls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolLayout>
  )
}
