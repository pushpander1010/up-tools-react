import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

// Router default passwords database (educational)
const ROUTERS = [
  { brand: 'TP-Link', model: 'Archer C7', user: 'admin', pass: 'admin', url: 'http://192.168.0.1' },
  { brand: 'TP-Link', model: 'Archer AX50', user: 'admin', pass: 'admin', url: 'http://tplinkwifi.net' },
  { brand: 'Netgear', model: 'R7000', user: 'admin', pass: 'password', url: 'http://192.168.1.1' },
  { brand: 'Netgear', model: 'RAX50', user: 'admin', pass: 'password', url: 'http://routerlogin.net' },
  { brand: 'D-Link', model: 'DIR-867', user: 'admin', pass: '', url: 'http://192.168.0.1' },
  { brand: 'D-Link', model: 'DIR-X1560', user: 'admin', pass: '', url: 'http://dlinkrouter.local' },
  { brand: 'Linksys', model: 'EA7500', user: 'admin', pass: 'admin', url: 'http://192.168.1.1' },
  { brand: 'ASUS', model: 'RT-AC68U', user: 'admin', pass: 'admin', url: 'http://192.168.1.1' },
  { brand: 'ASUS', model: 'RT-AX86U', user: 'admin', pass: 'admin', url: 'http://router.asus.com' },
  { brand: 'Huawei', model: 'B315', user: 'admin', pass: 'admin', url: 'http://192.168.8.1' },
  { brand: 'JioFiber', model: 'Home Gateway', user: 'admin', pass: 'Jio@1234', url: 'http://192.168.29.1' },
  { brand: 'Airtel', model: 'Xstream', user: 'admin', pass: 'admin', url: 'http://192.168.1.1' },
  { brand: 'ZTE', model: 'ZXHN H168N', user: 'user', pass: 'user', url: 'http://192.168.1.1' },
  { brand: 'Mercusys', model: 'MR80X', user: 'admin', pass: 'admin', url: 'http://mwlogin.net' },
  { brand: 'Tenda', model: 'AC10', user: 'admin', pass: 'admin', url: 'http://192.168.0.1' },
  { brand: 'Xiaomi', model: 'Mi Router 4A', user: 'admin', pass: 'admin', url: 'http://192.168.31.1' },
  { brand: 'iBall', model: 'Baton iB-WRB120N', user: 'admin', pass: 'admin', url: 'http://192.168.1.1' },
  { brand: 'Digisol', model: 'DG-HR3400', user: 'admin', pass: 'admin', url: 'http://192.168.1.1' },
  { brand: 'Cisco', model: 'Linksys E1200', user: 'admin', pass: 'admin', url: 'http://192.168.1.1' },
  { brand: 'Belkin', model: 'F9K1002', user: '', pass: '', url: 'http://192.168.2.1' },
]

const BRANDS = [...new Set(ROUTERS.map(r => r.brand))]

export default function wifi_router() {
  const [tab, setTab] = useState('passwords')
  const [search, setSearch] = useState('')
  const [brandFilter, setBrandFilter] = useState('')

  // Wi-Fi QR state
  const [ssid, setSsid] = useState('')
  const [enc, setEnc] = useState('WPA')
  const [wifiPass, setWifiPass] = useState('')
  const [hidden, setHidden] = useState(false)
  const [wifiQrUrl, setWifiQrUrl] = useState('')

  // MAC Lookup state
  const [macInput, setMacInput] = useState('')
  const [macResult, setMacResult] = useState('')

  const filtered = useMemo(() => {
    let list = ROUTERS
    if (brandFilter) list = list.filter(r => r.brand === brandFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(r => r.brand.toLowerCase().includes(q) || r.model.toLowerCase().includes(q) || r.user.toLowerCase().includes(q))
    }
    return list
  }, [search, brandFilter])

  const generateWifiQr = useCallback(() => {
    if (!ssid.trim()) return
    let str = `WIFI:T:${enc};S:${ssid};`
    if (enc !== 'nopass') str += `P:${wifiPass};`
    if (hidden) str += 'H:true;'
    str += ';'
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(str)}&bgcolor=ffffff&color=000000&margin=10`
    setWifiQrUrl(url)
  }, [ssid, enc, wifiPass, hidden])

  const lookupMac = useCallback(() => {
    const clean = macInput.replace(/[:\-\.]/g, '').toUpperCase().slice(0, 6)
    const VENDORS = {
      '001A2B': 'Huawei', '001E58': 'D-Link', '002511': 'Netgear',
      'ACDE48': 'Private', 'B827EB': 'Raspberry Pi', 'DCA632': 'Raspberry Pi',
      '005056': 'VMware', '080027': 'VirtualBox', 'F8FFC2': 'Apple',
      '3C22FB': 'Apple', 'F01898': 'Apple', 'A483E7': 'TP-Link',
      '50C7BF': 'TP-Link', '00146C': 'Netgear', '0024B2': 'Netgear',
      'B07FB9': 'Netgear', 'CC40D0': 'Samsung', '00155D': 'Microsoft',
      '000C29': 'VMware', '080027': 'Oracle', '0003FF': 'Microsoft',
    }
    const vendor = VENDORS[clean] || 'Unknown'
    setMacResult(`${clean.match(/.{2}/g)?.join(':') || clean} → ${vendor}`)
  }, [macInput])

  return (
    <ToolLayout
      title="WiFi Router Tools"
      desc="Default passwords (educational), Wi-Fi QR generator, MAC Vendor lookup."
      icon="📡" iconBg="rgba(34,197,94,0.08)"
      category="networking" slug="wifi-router"
      faq={[
        { q: 'Is this a Wi-Fi password cracker?', a: 'No. These are legal, educational tools: default credential catalog, Wi-Fi QR generator, and MAC vendor lookup.' },
        { q: 'Is the Wi-Fi QR code generated locally?', a: 'The QR string is built locally; rendering uses a public QR API.' },
      ]}
      howItWorks={[
        'Browse default passwords for common router models.',
        'Generate a Wi-Fi QR code to share your network.',
        'Look up MAC address vendors for network identification.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'WiFi Router Tools', applicationCategory: 'SecurityApplication',
        url: 'https://www.uptools.in/wifi-router/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      }}
    >
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Tab Selector */}
        <div className="flex gap-2">
          {[['passwords', '🔑 Passwords'], ['qrcode', '📳 Wi-Fi QR'], ['mac', '🔍 MAC Lookup']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${tab === k ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* Passwords Tab */}
        {tab === 'passwords' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search brand, model..."
                className="flex-1 bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500" />
              <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)}
                className="bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                <option value="">All Brands</option>
                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="text-xs text-slate-500">{filtered.length} router{filtered.length !== 1 ? 's' : ''}</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-white/[0.06]">
                    <th className="text-left py-2 px-3 font-semibold">Brand</th>
                    <th className="text-left py-2 px-3 font-semibold">Model</th>
                    <th className="text-left py-2 px-3 font-semibold">Username</th>
                    <th className="text-left py-2 px-3 font-semibold">Password</th>
                    <th className="text-left py-2 px-3 font-semibold">URL</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-white">{r.brand}</td>
                      <td className="py-2.5 px-3 text-slate-300">{r.model}</td>
                      <td className="py-2.5 px-3 font-mono text-cyan-400">{r.user || '—'}</td>
                      <td className="py-2.5 px-3 font-mono text-amber-400">{r.pass || '(empty)'}</td>
                      <td className="py-2.5 px-3 text-xs text-slate-500">{r.url}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-600">Sources: public manuals & device stickers. Region/firmware may differ. Educational use only.</p>
          </div>
        )}

        {/* Wi-Fi QR Tab */}
        {tab === 'qrcode' && (
          <div className="max-w-sm mx-auto space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Network Name (SSID)</label>
              <input type="text" value={ssid} onChange={e => setSsid(e.target.value)} maxLength={64}
                placeholder="e.g., Home_5G"
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500/40 transition-all placeholder:text-slate-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Encryption</label>
              <select value={enc} onChange={e => setEnc(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none bg-gray-900">
                <option value="WPA">WPA/WPA2/WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (open)</option>
              </select>
            </div>
            {enc !== 'nopass' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Password</label>
                <input type="text" value={wifiPass} onChange={e => setWifiPass(e.target.value)} maxLength={63}
                  placeholder="Use 12+ chars for WPA2/3"
                  className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500/40 transition-all placeholder:text-slate-600" />
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={hidden} onChange={e => setHidden(e.target.checked)}
                className="w-4 h-4 rounded accent-green-500" />
              <span className="text-sm text-slate-400">Hidden SSID</span>
            </label>
            <button onClick={generateWifiQr}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm hover:from-green-400 hover:to-emerald-400 transition-all active:scale-[0.98]">
              📳 Generate QR Code
            </button>
            {wifiQrUrl && (
              <div className="text-center p-4 bg-white rounded-2xl shadow-2xl">
                <img src={wifiQrUrl} alt="Wi-Fi QR Code" className="block mx-auto rounded-xl" style={{ width: 220, height: 220 }} />
              </div>
            )}
          </div>
        )}

        {/* MAC Lookup Tab */}
        {tab === 'mac' && (
          <div className="max-w-sm mx-auto space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">MAC Address</label>
              <input type="text" value={macInput} onChange={e => setMacInput(e.target.value)}
                placeholder="e.g., B8:27:EB:XX:XX:XX"
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-mono outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600" />
            </div>
            <button onClick={lookupMac}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm hover:from-cyan-400 hover:to-blue-400 transition-all active:scale-[0.98]">
              🔍 Lookup Vendor
            </button>
            {macResult && (
              <div className="p-4 rounded-xl bg-white/[0.06] border border-white/[0.08] text-center">
                <div className="text-sm font-bold text-white">{macResult}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
