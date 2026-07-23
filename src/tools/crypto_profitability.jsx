import { useState, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

const COIN_META = {
  btc: { id: 'bitcoin', symbol: 'BTC', reward: 3.125, time: 600, unit: 'TH' },
  ltc: { id: 'litecoin', symbol: 'LTC', reward: 6.25, time: 150, unit: 'GH' },
  etc: { id: 'ethereum-classic', symbol: 'ETC', reward: 2.56, time: 13.2, unit: 'MH' },
  rvn: { id: 'ravencoin', symbol: 'RVN', reward: 2500, time: 60, unit: 'MH' },
  xmr: { id: 'monero', symbol: 'XMR', reward: 0.6, time: 120, unit: 'kH' },
  kas: { id: 'kaspa', symbol: 'KAS', reward: 13.5, time: 1, unit: 'GH' },
}
const UNIT_MUL = { H: 1, kH: 1e3, MH: 1e6, GH: 1e9, TH: 1e12, PH: 1e15 }
const UNITS = ['H', 'kH', 'MH', 'GH', 'TH']
const CURRENCIES = ['inr', 'usd']

function fmtCurrency(n, cur) {
  return new Intl.NumberFormat(cur === 'inr' ? 'en-IN' : 'en-US', {
    style: 'currency', currency: cur.toUpperCase(), maximumFractionDigits: Math.abs(n) >= 100 ? 0 : 2
  }).format(n ?? 0)
}

export default function crypto_profitability() {
  const [coin, setCoin] = useState('btc')
  const [vs, setVs] = useState('inr')
  const [price, setPrice] = useState('')
  const [hash, setHash] = useState('')
  const [hashUnit, setHashUnit] = useState('TH')
  const [power, setPower] = useState('')
  const [netMode, setNetMode] = useState('difficulty')
  const [netVal, setNetVal] = useState('')
  const [blockReward, setBlockReward] = useState(String(COIN_META.btc.reward))
  const [blockTime, setBlockTime] = useState(String(COIN_META.btc.time))
  const [fee, setFee] = useState('1')
  const [uptime, setUptime] = useState('98')
  const [elec, setElec] = useState('8')
  const [hwCost, setHwCost] = useState('')
  const [result, setResult] = useState(null)
  const [fetchingPrice, setFetchingPrice] = useState(false)

  const fetchPrice = useCallback(async (coinKey, vsKey) => {
    setFetchingPrice(true)
    try {
      const id = COIN_META[coinKey].id
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${vsKey}`)
      const j = await res.json()
      const p = j?.[id]?.[vsKey]
      if (p) setPrice(String(p))
    } catch {}
    setFetchingPrice(false)
  }, [])

  const changeCoin = useCallback((c) => {
    setCoin(c)
    const m = COIN_META[c]
    setBlockReward(String(m.reward))
    setBlockTime(String(m.time))
    setHashUnit(m.unit)
    fetchPrice(c, vs)
  }, [vs, fetchPrice])

  const calc = useCallback(() => {
    const p = parseFloat(price) || 0
    const h = (parseFloat(hash) || 0) * (UNIT_MUL[hashUnit] || 1)
    const t = parseFloat(blockTime) || 1
    const reward = parseFloat(blockReward) || 0
    const uptimeFrac = (parseFloat(uptime) || 0) / 100
    const feeFrac = (parseFloat(fee) || 0) / 100
    const powerW = parseFloat(power) || 0
    const elecCost = parseFloat(elec) || 0
    const hw = parseFloat(hwCost) || 0

    let netHash = 0
    if (netMode === 'difficulty') {
      const D = parseFloat(netVal) || 0
      if (D <= 0) { setResult(null); return }
      netHash = D * 4294967296 / t
    } else {
      netHash = parseFloat(netVal) || 0
      if (netHash <= 0) { setResult(null); return }
    }
    if (h <= 0 || reward <= 0 || uptimeFrac <= 0) { setResult(null); return }

    const blocksPerDay = 86400 / t
    const coinsD = Math.max(0, (h / netHash) * blocksPerDay * reward * uptimeFrac)
    const coinsH = coinsD / 24

    const revD = coinsD * p * (1 - feeFrac)
    const revH = revD / 24, revW = revD * 7, revM = revD * 30

    const elecH = (powerW / 1000) * elecCost * uptimeFrac
    const elecD = elecH * 24, elecW = elecD * 7, elecM = elecD * 30

    const netH = revH - elecH, netD = revD - elecD, netW = revW - elecW, netM = revM - elecM

    const roiDays = hw > 0 && netD > 0 ? hw / netD : null
    const roiMonths = roiDays ? roiDays / 30 : null

    setResult({
      coinsD, coinsH, symbol: COIN_META[coin].symbol,
      revH, revD, revW, revM,
      elecH, elecD, elecW, elecM,
      netH, netD, netW, netM,
      roiDays, roiMonths,
    })
  }, [price, hash, hashUnit, blockTime, blockReward, uptime, fee, power, elec, netMode, netVal, hwCost, coin])

  useEffect(() => { fetchPrice('btc', 'inr') }, [])

  const Row = ({ label, h, d, w, m }) => (
    <div className="grid grid-cols-5 gap-2 text-xs py-2 border-b border-white/[0.04]">
      <span className="text-slate-500 font-semibold">{label}</span>
      {[h, d, w, m].map((v, i) => (
        <span key={i} className={`text-right font-mono ${i === 3 ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
          {v != null && v !== '—' ? fmtCurrency(v, vs) : '—'}
        </span>
      ))}
    </div>
  )

  return (
    <ToolLayout
      title="Crypto Mining Profitability Calculator"
      desc="Calculate mining profitability for BTC, LTC, ETC, RVN, XMR, and KAS. Real-time price fetching and ROI analysis."
      icon="⛏️" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="crypto-profitability"
      faq={[
        { q: 'How is profitability calculated?', a: 'Based on your hashrate, network difficulty, block reward, electricity cost, and pool fees. Real-time coin prices from CoinGecko.' },
        { q: 'What coins are supported?', a: 'Bitcoin (BTC), Litecoin (LTC), Ethereum Classic (ETC), Ravencoin (RVN), Monero (XMR), and Kaspa (KAS).' },
      ]}
      howItWorks={[
        'Select your coin and currency (INR/USD).',
        'Enter your hashrate, power consumption, and electricity cost.',
        'Set network difficulty or hashrate, block reward, and pool fee.',
        'Click Calculate to see hourly, daily, weekly, and monthly projections.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Crypto Mining Profitability Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/crypto-profitability/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Coin + Currency */}
        <div className="bg-white/[0.06] border border-white/8 rounded-2xl p-4 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Coin</label>
            <select value={coin} onChange={e => changeCoin(e.target.value)}
              className="w-full bg-black/20 border-2 border-white/8 rounded-xl px-3 py-2.5 text-sm text-white outline-none [color-scheme:dark]">
              {Object.entries(COIN_META).map(([k, v]) => <option key={k} value={k}>{v.symbol}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Currency</label>
            <select value={vs} onChange={e => setVs(e.target.value)}
              className="w-full bg-black/20 border-2 border-white/8 rounded-xl px-3 py-2.5 text-sm text-white outline-none [color-scheme:dark]">
              {CURRENCIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
            </select>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="bg-white/[0.06] border border-white/8 rounded-2xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Coin Price', val: price, set: setPrice, suffix: fetchingPrice ? '⏳' : 'Fetch', onClick: () => fetchPrice(coin, vs), type: 'number' },
              { label: 'Your Hashrate', val: hash, set: setHash, type: 'number' },
              { label: 'Hash Unit', val: hashUnit, set: setHashUnit, type: 'select', options: UNITS },
              { label: 'Power (W)', val: power, set: setPower, type: 'number' },
              { label: 'Pool Fee (%)', val: fee, set: setFee, type: 'number' },
              { label: 'Uptime (%)', val: uptime, set: setUptime, type: 'number' },
              { label: `Elec Cost (${vs === 'inr' ? '₹/kWh' : '$/kWh'})`, val: elec, set: setElec, type: 'number' },
              { label: 'Hardware Cost', val: hwCost, set: setHwCost, type: 'number' },
            ].map(inp => (
              <div key={inp.label}>
                <label className="text-[10px] font-semibold text-slate-500 mb-1 block">{inp.label}</label>
                <div className="flex">
                  {inp.type === 'select' ? (
                    <select value={inp.val} onChange={e => inp.set(e.target.value)}
                      className="w-full bg-black/20 border-2 border-white/8 rounded-xl px-3 py-2 text-xs text-white outline-none [color-scheme:dark]">
                      {inp.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="number" value={inp.val} onChange={e => inp.set(e.target.value)}
                      className="flex-1 bg-black/20 border-2 border-white/8 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]" />
                  )}
                  {inp.onClick && (
                    <button onClick={inp.onClick}
                      className="ml-1.5 px-2 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 whitespace-nowrap">
                      {inp.suffix}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Network */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 mb-1 block">Network Mode</label>
              <select value={netMode} onChange={e => setNetMode(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/8 rounded-xl px-3 py-2 text-xs text-white outline-none [color-scheme:dark]">
                <option value="difficulty">Difficulty</option>
                <option value="hashrate">Hashrate (H/s)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 mb-1 block">{netMode === 'difficulty' ? 'Network Difficulty' : 'Network Hashrate'}</label>
              <input type="number" value={netVal} onChange={e => setNetVal(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/8 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 mb-1 block">Block Reward</label>
              <input type="number" value={blockReward} onChange={e => setBlockReward(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/8 rounded-xl px-3 py-2 text-xs text-white outline-none [color-scheme:dark]" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 mb-1 block">Block Time (s)</label>
              <input type="number" value={blockTime} onChange={e => setBlockTime(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/8 rounded-xl px-3 py-2 text-xs text-white outline-none [color-scheme:dark]" />
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <button onClick={calc}
          className="glow-btn w-full py-4 rounded-2xl text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          ⛏️ Calculate Profitability
        </button>

        {/* Results */}
        {result && (
          <div className="bg-white/[0.06] border border-white/8 rounded-2xl p-4 space-y-3"
            style={{ animation: 'slideUp 0.3s ease-out' }}>
            {/* KPIs */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: `Coins/Day`, val: `${result.coinsD.toFixed(6)} ${result.symbol}`, color: '#6366f1' },
                { label: 'Revenue/Day', val: fmtCurrency(result.revD, vs), color: '#22c55e' },
                { label: 'Net/Day', val: fmtCurrency(result.netD, vs), color: result.netD >= 0 ? '#22c55e' : '#ef4444' },
              ].map(k => (
                <div key={k.label} className="bg-black/20 rounded-xl py-3 px-2">
                  <div className="text-sm font-extrabold" style={{ color: k.color }}>{k.val}</div>
                  <div className="text-[10px] text-slate-500 font-semibold">{k.label}</div>
                </div>
              ))}
            </div>

            {/* Revenue Table */}
            <div className="text-xs">
              <div className="grid grid-cols-5 gap-2 text-slate-500 font-bold pb-1 border-b border-white/8">
                <span></span><span className="text-right">Hourly</span><span className="text-right">Daily</span><span className="text-right">Weekly</span><span className="text-right">Monthly</span>
              </div>
              <Row label="Revenue" h={result.revH} d={result.revD} w={result.revW} m={result.revM} />
              <Row label="Electricity" h={result.elecH} d={result.elecD} w={result.elecW} m={result.elecM} />
              <Row label="Net Profit" h={result.netH} d={result.netD} w={result.netW} m={result.netM} />
            </div>

            {/* ROI */}
            {result.roiDays != null && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                <div className="text-xs text-slate-500 mb-1">Hardware ROI</div>
                <div className="text-lg font-extrabold text-indigo-400">
                  {result.roiDays.toFixed(1)} days ({result.roiMonths.toFixed(1)} months)
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
