import { useState, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const MARKETS = [
  { value: 'NSE', label: 'NSE (India)', suffix: '.NS' },
  { value: 'BSE', label: 'BSE (India)', suffix: '.BO' },
  { value: 'NASDAQ', label: 'NASDAQ (US)', suffix: '' },
  { value: 'NYSE', label: 'NYSE (US)', suffix: '' },
  { value: 'LSE', label: 'LSE (UK)', suffix: '.L' },
  { value: 'TSX', label: 'TSX (Canada)', suffix: '.TO' },
  { value: 'TSE', label: 'TSE (Tokyo)', suffix: '.T' },
  { value: 'SSE', label: 'SSE (Shanghai)', suffix: '.SS' },
  { value: 'HKEX', label: 'HKEX (Hong Kong)', suffix: '.HK' },
  { value: 'FWB', label: 'XETRA/Frankfurt (DE)', suffix: '.DE' },
]

const RANGES = [
  { value: '1mo', label: '1M' },
  { value: '3mo', label: '3M' },
  { value: '6mo', label: '6M' },
  { value: '1y', label: '1Y' },
  { value: '2y', label: '2Y' },
]

function getSuffix(market) {
  return MARKETS.find(m => m.value === market)?.suffix || ''
}

export default function ai_stock_analyzer() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [market, setMarket] = useState('NSE')
  const [ticker, setTicker] = useState('')
  const [range, setRange] = useState('6mo')
  const [interval, setInterval_] = useState('1d')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('Ready.')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const canvasRef = useRef(null)

  const analyze = useCallback(async () => {
    if (!ticker.trim()) return
    setLoading(true)
    setError('')
    setStatus('Fetching data...')
    try {
      const symbol = ticker.trim().toUpperCase() + getSuffix(market)
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`
      const r = await fetch(url)
      if (!r.ok) throw new Error('Ticker not found or market closed')
      const json = await r.json()
      const result = json.chart?.result?.[0]
      if (!result) throw new Error('No data returned')

      const meta = result.meta
      const closes = result.indicators?.quote?.[0]?.close?.filter(v => v != null) || []
      const highs = result.indicators?.quote?.[0]?.high?.filter(v => v != null) || []
      const lows = result.indicators?.quote?.[0]?.low?.filter(v => v != null) || []
      const volumes = result.indicators?.quote?.[0]?.volume?.filter(v => v != null) || []

      const currentPrice = meta.regularMarketPrice
      const prevClose = meta.chartPreviousClose || closes[closes.length - 2]
      const change = currentPrice - prevClose
      const changePct = ((change / prevClose) * 100)

      // SMA calculation
      const sma = (arr, period) => {
        if (arr.length < period) return null
        return arr.slice(-period).reduce((a, b) => a + b, 0) / period
      }
      const sma50 = sma(closes, 50)
      const sma200 = sma(closes, 200)

      // RSI calculation
      const calcRSI = (arr, period = 14) => {
        if (arr.length < period + 1) return null
        let gains = 0, losses = 0
        for (let i = arr.length - period; i < arr.length; i++) {
          const diff = arr[i] - arr[i - 1]
          if (diff > 0) gains += diff; else losses -= diff
        }
        if (losses === 0) return 100
        const rs = gains / losses
        return 100 - (100 / (1 + rs))
      }
      const rsi = calcRSI(closes)

      // Support/Resistance
      const recentLows = lows.slice(-20)
      const recentHighs = highs.slice(-20)
      const support = Math.min(...recentLows)
      const resistance = Math.max(...recentHighs)

      setData({
        price: currentPrice, change, changePct,
        marketCap: meta.marketCap, currency: meta.currency,
        sma50, sma200, rsi, support, resistance,
        closes, highs, lows,
        exchange: meta.exchangeName || market,
        symbol: meta.symbol || symbol,
      })
      setStatus('Analysis complete.')
      jumpTo()
    } catch (e) {
      setError(e.message || 'Failed to fetch data')
      setStatus('Error.')
    }
    setLoading(false)
  }, [ticker, market, range, interval, jumpTo])

  // Draw chart
  useEffect(() => {
    if (!data || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const w = canvas.width = canvas.offsetWidth * 2
    const h = canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    const cw = w / 2, ch = h / 2

    ctx.clearRect(0, 0, cw, ch)
    const closes = data.closes
    if (closes.length < 2) return

    const min = Math.min(...closes) * 0.98
    const max = Math.max(...closes) * 1.02
    const xStep = cw / (closes.length - 1)
    const yScale = (ch - 40) / (max - min)

    // Draw price line
    ctx.beginPath()
    ctx.strokeStyle = '#22d3ee'
    ctx.lineWidth = 1.5
    closes.forEach((v, i) => {
      const x = i * xStep
      const y = ch - 20 - (v - min) * yScale
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.stroke()

    // SMA50
    if (data.sma50) {
      ctx.beginPath()
      ctx.strokeStyle = '#a78bfa'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      const smaStart = Math.max(0, closes.length - 50)
      for (let i = smaStart; i < closes.length; i++) {
        const avg = closes.slice(i - 49, i + 1).reduce((a, b) => a + b, 0) / 50
        const x = i * xStep
        const y = ch - 20 - (avg - min) * yScale
        i === smaStart ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Support line
    ctx.beginPath()
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 1
    ctx.setLineDash([6, 3])
    const supportY = ch - 20 - (data.support - min) * yScale
    ctx.moveTo(0, supportY)
    ctx.lineTo(cw, supportY)
    ctx.stroke()

    // Resistance line
    ctx.beginPath()
    ctx.strokeStyle = '#f97316'
    ctx.lineWidth = 1
    const resistanceY = ch - 20 - (data.resistance - min) * yScale
    ctx.moveTo(0, resistanceY)
    ctx.lineTo(cw, resistanceY)
    ctx.stroke()
    ctx.setLineDash([])
  }, [data])

  const fmt = (n, decimals = 2) => n != null ? Number(n).toFixed(decimals) : 'N/A'
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold text-sm outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const selectClass = "bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold text-sm outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="AI Stock Analyzer - Multi-Market"
      desc="Live quotes & charts (Yahoo Finance), support/resistance, TA/FA snapshot, news sentiment, and an AI chatbox grounded in retrieved data."
      icon="📈" iconBg="rgba(34,211,238,0.08)"
      category="finance" slug="ai-stock-analyzer"
      faq={[
        { q: 'Which markets are supported?', a: 'NSE (India), BSE (India), NASDAQ, NYSE, LSE (London), TSX (Toronto), TSE (Tokyo), SSE (Shanghai), HKEX (Hong Kong) and more via Yahoo Finance suffix mapping.' },
        { q: 'Do I need an API key?', a: 'No. Data is fetched through Yahoo Finance public endpoints.' },
      ]}
      howItWorks={[
        'Select your market (NSE, BSE, NASDAQ, etc.) and enter a ticker symbol.',
        'Choose a time range and interval, then click Analyze.',
        'View price chart, technical analysis, and key metrics.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI Stock Analyzer", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/ai-stock-analyzer/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Controls */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Market</label>
              <select value={market} onChange={e => setMarket(e.target.value)} className={selectClass}>
                {MARKETS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Ticker</label>
              <input type="text" value={ticker} onChange={e => setTicker(e.target.value)}
                placeholder="e.g. RELIANCE or AAPL" className={inputClass}
                onKeyDown={e => e.key === 'Enter' && analyze()} />
            </div>
            <div className="min-w-[80px]">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Range</label>
              <select value={range} onChange={e => setRange(e.target.value)} className={selectClass}>
                {RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="min-w-[80px]">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Interval</label>
              <select value={interval} onChange={e => setInterval_(e.target.value)} className={selectClass}>
                <option value="1d">1d</option>
                <option value="1h">1h</option>
                <option value="5m">5m</option>
              </select>
            </div>
            <button onClick={analyze} disabled={loading}
              className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all disabled:opacity-50">
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          <div className="text-xs text-slate-500 mt-3">{status}</div>
        </div>

        {error && (
          <div className="rounded-3xl border-2 border-rose-500/15 bg-rose-500/[0.06] p-4">
            <p className="text-sm text-rose-400">{error}</p>
          </div>
        )}

        {data && (
          <div ref={resultRef} className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            {/* Snapshot */}
            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-white">Snapshot</h2>
                <span className="text-xs px-2 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-400 font-semibold">{data.exchange}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-xs text-slate-500">Price</div>
                  <div className="text-lg font-extrabold text-white">{fmt(data.price)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-500">Change</div>
                  <div className={`text-lg font-extrabold ${data.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {data.change >= 0 ? '+' : ''}{fmt(data.change)} ({data.changePct >= 0 ? '+' : ''}{fmt(data.changePct)}%)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-500">Currency</div>
                  <div className="text-lg font-extrabold text-white">{data.currency}</div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-5">
              <h2 className="text-sm font-bold text-white mb-3">Price Chart</h2>
              <canvas ref={canvasRef} className="w-full rounded-xl" style={{ height: '180px' }} />
              <div className="flex gap-3 mt-2 text-xs">
                <span className="text-cyan-400">● Price</span>
                <span className="text-violet-400">● SMA50</span>
                <span className="text-emerald-400">● Support</span>
                <span className="text-orange-400">● Resistance</span>
              </div>
            </div>

            {/* Technical Analysis */}
            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-5">
              <h2 className="text-sm font-bold text-white mb-3">Technical Analysis</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">RSI(14)</span>
                  <span className={`font-bold ${data.rsi > 70 ? 'text-rose-400' : data.rsi < 30 ? 'text-emerald-400' : 'text-white'}`}>
                    {data.rsi != null ? data.rsi.toFixed(1) : 'N/A'}
                    {data.rsi > 70 ? ' (Overbought)' : data.rsi < 30 ? ' (Oversold)' : ''}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">SMA50 vs Price</span>
                  <span className={`font-bold ${data.sma50 && data.price > data.sma50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {data.sma50 ? `₹${data.sma50.toFixed(2)} ${data.price > data.sma50 ? '(Above)' : '(Below)'}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">SMA200 vs Price</span>
                  <span className={`font-bold ${data.sma200 && data.price > data.sma200 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {data.sma200 ? `₹${data.sma200.toFixed(2)} ${data.price > data.sma200 ? '(Above)' : '(Below)'}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Support</span>
                  <span className="text-emerald-400 font-bold">₹{fmt(data.support)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Resistance</span>
                  <span className="text-orange-400 font-bold">₹{fmt(data.resistance)}</span>
                </div>
              </div>
            </div>

            {/* Quick Verdict */}
            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-5">
              <h2 className="text-sm font-bold text-white mb-3">Quick Verdict</h2>
              {(() => {
                let score = 0
                if (data.rsi < 40) score += 2; else if (data.rsi > 60) score -= 1
                if (data.sma50 && data.price > data.sma50) score += 1
                if (data.sma200 && data.price > data.sma200) score += 2
                if (data.changePct > 0) score += 1
                const verdict = score >= 3 ? 'BUY' : score <= -1 ? 'SELL' : 'HOLD'
                const vColor = verdict === 'BUY' ? 'text-emerald-400' : verdict === 'SELL' ? 'text-rose-400' : 'text-amber-400'
                const vBg = verdict === 'BUY' ? 'bg-emerald-500/15' : verdict === 'SELL' ? 'bg-rose-500/15' : 'bg-amber-500/15'
                return (
                  <div className="text-center">
                    <div className={`inline-block px-6 py-3 rounded-2xl ${vBg} text-2xl font-extrabold ${vColor} mb-3`}>{verdict}</div>
                    <p className="text-xs text-slate-500">Based on RSI, SMA trends, and price action. Not financial advice.</p>
                  </div>
                )
              })()}
            </div>
          </div>
        )}

        {!data && !error && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📈</div>
            <p className="text-sm text-slate-600 font-medium">Select market, enter ticker, and click Analyze</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
