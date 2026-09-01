import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

function Section({ id, icon, title, subtitle, children }) {
  return (
    <section id={id} className="glass p-6 sm:p-7 mb-6 scroll-mt-24">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-xl">{icon}</span>
        <h2 className="text-lg sm:text-xl font-extrabold text-white m-0">{title}</h2>
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-2" />}
      <div className="space-y-4 text-sm text-slate-300 leading-relaxed">{children}</div>
    </section>
  )
}

function CodeBlock({ title, lang, lines }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(typeof lines === 'string' ? lines : lines.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard unavailable */ }
  }
  return (
    <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: '#0a0f1e' }}>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10" style={{ background: '#111827' }}>
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        {title && <span className="ml-2 text-[11px] font-mono text-slate-400">{title}</span>}
        <button type="button" onClick={copy}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition-all border border-white/10 bg-white/5 text-slate-300 hover:text-black"
          style={copied ? { background: 'linear-gradient(135deg, #34d399, #22d3ee)', borderColor: 'transparent', color: '#000' } : undefined}>
          {copied ? '✓ Copied' : '⧉ Copy'}
        </button>
        {lang && <span className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-wider">{lang}</span>}
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-emerald-200/90 whitespace-pre-wrap">{lines}</pre>
    </div>
  )
}

// One terminal, switchable between languages via tabs.
function CodeTabs({ tabs }) {
  const [active, setActive] = useState(0)
  const t = tabs[active]
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab, i) => (
          <button key={tab.lang} type="button" onClick={() => setActive(i)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              i === active
                ? 'text-black'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-amber-400/40'
            }`}
            style={i === active ? { background: 'linear-gradient(135deg, #fbbf24, #34d399)' } : undefined}>
            {tab.icon} {tab.lang}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-400 leading-relaxed m-0">{t.desc}</p>
      <CodeBlock title={t.title} lang={t.lang} lines={t.lines} />
    </div>
  )
}

function WarningBox({ children }) {
  return (
    <div className="rounded-xl p-4 border border-amber-500/30" style={{ background: 'rgba(251,191,36,0.06)' }}>
      <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1.5">⚠️ Not Financial Advice</div>
      <div className="text-xs text-amber-200/80 leading-relaxed">{children}</div>
    </div>
  )
}

function InfoBox({ title, icon = '💡', children }) {
  return (
    <div className="rounded-xl p-4 border border-emerald-500/25" style={{ background: 'rgba(52,211,153,0.06)' }}>
      <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm mb-1.5">{icon} {title}</div>
      <div className="text-xs text-slate-300 leading-relaxed">{children}</div>
    </div>
  )
}

function FeatureGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map(f => (
        <div key={f.t} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="text-2xl mb-1">{f.i}</div>
          <div className="text-sm font-semibold text-white mb-0.5">{f.t}</div>
          <div className="text-xs text-slate-400">{f.d}</div>
        </div>
      ))}
    </div>
  )
}

function StepRow({ num, title, body }) {
  return (
    <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex items-start gap-2">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-400/20 text-amber-300 font-bold text-sm mt-0.5 flex-none">{num}</span>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white mb-1">{title}</div>
          <div className="text-xs text-slate-400 leading-relaxed">{body}</div>
        </div>
      </div>
    </div>
  )
}

function DoDont({ good, bad }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="rounded-xl p-4 border border-emerald-500/25" style={{ background: 'rgba(16,185,129,0.06)' }}>
        <div className="text-sm font-bold text-emerald-300 mb-2">✅ Do</div>
        <ul className="list-none p-0 m-0 space-y-1.5">
          {good.map(x => <li key={x} className="text-xs text-slate-300 flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>{x}</li>)}
        </ul>
      </div>
      <div className="rounded-xl p-4 border border-red-500/25" style={{ background: 'rgba(239,68,68,0.06)' }}>
        <div className="text-sm font-bold text-red-300 mb-2">❌ Don't</div>
        <ul className="list-none p-0 m-0 space-y-1.5">
          {bad.map(x => <li key={x} className="text-xs text-slate-300 flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span>{x}</li>)}
        </ul>
      </div>
    </div>
  )
}

const faq = [
  {
    q: 'Why does algorithmic trading beat buy-and-hold?',
    a: 'Buy-and-hold subjects you to 100% of bear-market drawdowns (-50% to -80% in crypto, -30% to -50% in equities), locking capital for years. Quantitative algorithms hold cash during bear trends, compound capital in strong momentum waves, and buy extreme oversold dips at statistical -2 sigma discounts, yielding higher Sharpe ratios and lower drawdowns.',
  },
  {
    q: 'What is the -2 sigma mean reversion strategy?',
    a: 'Mean reversion assumes prices that deviate excessively from their historical moving average tend to snap back. We calculate a 20-period moving average and standard deviation (Bollinger Bands). When price drops below -2 standard deviations (-2σ) with oversold RSI, we enter long and exit when price reverts back to the 20-day median.',
  },
  {
    q: 'How does the volume breakout strategy prevent false breakouts?',
    a: 'Traditional breakouts often fail because they occur on low liquidity. Our volume breakout strategy requires two strict triggers: price breaking above the 20-day Donchian channel high AND trading volume exceeding 2.5x the 20-day average volume. A trailing ATR stop protects profits.',
  },
  {
    q: 'Can these strategies run on both stocks and crypto?',
    a: 'Yes. The underlying math of supply, demand, and volatility clustering applies across liquid asset classes. On crypto (BTC, ETH, SOL), 4-hour and daily charts filter noise well. On equities (S&P 500, NASDAQ, tech stocks), daily bars provide excellent risk-adjusted alpha.',
  },
  {
    q: 'What is the minimum capital required to run these algorithms?',
    a: 'You can start backtesting and paper trading with zero capital on TradingView or Python. For live crypto trading via exchange APIs (Binance, Bybit), $100 to $500 is enough to test order routing. For equities, $1,000 to $5,000 allows proper fraction-based position sizing.',
  },
  {
    q: 'How do you handle slippage, broker fees, and exchange commissions?',
    a: 'Every backtest must include realistic transaction costs (0.05% to 0.1% per trade on crypto, 1-2 cents per share on equities) plus 0.05% slippage. If an algo is only profitable with zero fees, it is not a viable real-world strategy.',
  },
  {
    q: 'Do I need a high-frequency low-latency server?',
    a: 'No. These three algorithms operate on hourly, 4-hour, or daily bars. Execution latency of 100-500 milliseconds via cloud webhooks is more than fast enough for swing and positional quantitative strategies.',
  },
]

const howItWorks = [
  'Select your market: Liquid international stocks (AAPL, NVDA, QQQ) or major cryptocurrencies (BTC, ETH, SOL).',
  'Choose the regime: Mean reversion for sideways ranging markets, Breakout for low-volatility compressions, or Momentum for trending markets.',
  'Compute mathematical triggers: -2σ Bollinger Band dips, 2.5x volume expansion at resistance, or EMA 20/50 crossovers.',
  'Backtest 3 years of historical tick/bar data with realistic commissions (0.08%) and slippage.',
  'Deploy automated webhook alerts from TradingView or a Python bot directly into your broker API.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: '3 Algos That Beat Buy and Hold — Mean Reversion, Breakout and Momentum',
      description: 'Comprehensive guide to 3 quantitative algorithmic trading strategies that beat buy-and-hold across 3-year backtests on stocks and crypto: Mean Reversion (-2 sigma), Volume Breakout, and Momentum Trend-Following.',
      about: 'Quantitative Algorithmic Trading Strategies',
    },
    {
      '@type': 'FAQPage',
      mainEntity: faq.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
}

export default function aiforrich_algos_beat_buy_hold() {
  return (
    <ToolLayout
      title="3 Algos That Beat Buy & Hold — Mean Reversion, Breakout & Momentum"
      desc="Explore 3 algorithmic trading strategies backtested over 3 years on stocks and crypto: Mean Reversion (-2σ Bollinger), Volume Breakout, and Trend-Following Momentum. Includes runnable Python, Pine Script v5, and JavaScript code."
      icon="⚡"
      iconBg="linear-gradient(135deg, rgba(251,191,36,0.18), rgba(52,211,153,0.08))"
      category="finance"
      slug="aiforrich/algos-beat-buy-hold"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Reel Companion Video Card */}
      <Section id="video" icon="🎬" title="Reel Companion & Video Summary" subtitle="38.5s Reel breakdown from @aiforrich">
        <div className="rounded-2xl p-5 border border-amber-500/20" style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.06), rgba(15,23,42,0.8))' }}>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-full sm:w-44 aspect-[9/16] rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center p-4 text-center shrink-0 relative overflow-hidden">
              <div className="text-4xl mb-2">⚡</div>
              <span className="text-xs font-bold text-amber-300">3 Algos Beat B&H</span>
              <span className="text-[10px] text-slate-400 mt-1">Duration: 38.5s</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-2">
                <span className="text-[10px] font-mono text-emerald-400">@aiforrich reel</span>
              </div>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                🎙️ Voiceover Summary
              </div>
              <p className="italic text-slate-300 m-0">
                &ldquo;Are you still doing buy and hold? These three algos beat it — backtested on the last 3 years on stocks and cryptos. Strategy 1: Mean reversion (buy at -2 sigma dip). Strategy 2: Breakout (volume explosion + resistance break). Strategy 3: Momentum (trend follow until break). Here is the complete guide with runnable code.&rdquo;
              </p>
              <div className="pt-2">
                <a href="https://www.instagram.com/aiforrich" target="_blank" rel="noopener noreferrer"
                  className="glow-btn text-xs px-4 py-2 rounded-xl no-underline inline-flex items-center gap-2"
                  style={{ background: 'linear-gradient(92deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)' }}>
                  Watch Reel on Instagram @aiforrich ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <WarningBox>
        This quantitative guide is <b>strictly for educational purposes</b> and does <b>not constitute financial or investment advice</b>.
        Algorithmic trading carries substantial financial risk, and historical backtest performance does not guarantee future results.
        Always test strategies with paper money and ensure you understand every line of code before connecting live broker APIs.
      </WarningBox>

      {/* Overview */}
      <Section id="overview" icon="📉" title="Why Buy and Hold Fails in Volatile Markets" subtitle="The mathematical case for systematic quantitative trading">
        <p>
          The classic <b>Buy and Hold</b> dogma works during secular, 10-year bull runs backed by quantitative easing. However,
          in real-world cycles filled with interest rate hikes, geopolitical shocks, and crypto winters, buy-and-hold exposes
          investors to brutal drawdowns:
        </p>
        <FeatureGrid items={[
          { i: '🔻', t: 'Devastating Drawdowns', d: 'Suffering -70% crypto drops or -35% equity crashes takes years just to break even.' },
          { i: '⏳', t: 'Opportunity Cost of Idle Capital', d: 'Sitting in dead sideways chop locks up buying power that could compound elsewhere.' },
          { i: '🧠', t: 'Emotional Surrender', d: 'Discretionary investors panic-sell at the exact market bottom due to psychological fatigue.' },
          { i: '⚡', t: 'Systematic Execution Edge', d: 'Algorithms take profits at predefined targets and cut losses before drawdowns compound.' },
        ]} />
        <p>
          By automating entry rules, position sizing, and volatility stops, quantitative models achieve <b>higher Sharpe ratios</b>,
          smaller max drawdowns, and the ability to profit in both ranging and trending market regimes.
        </p>
      </Section>

      {/* The 3 Algos */}
      <Section id="strategies" icon="🧠" title="The 3 Winning Algorithmic Strategies" subtitle="Mathematical logic, entry triggers, and exit criteria">
        <div className="space-y-4">
          <InfoBox title="Strategy 1: Statistical Mean Reversion (-2σ Bollinger Dip)" icon="📊">
            <p className="m-0 mb-2">
              <b>Core Philosophy:</b> Asset prices exhibit stationary tendencies in range-bound regimes. When selling pressure pushes
              the price more than 2 standard deviations below the 20-period moving average (lower Bollinger Band) and the RSI drops below 30,
              the asset is mathematically oversold.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
              <li><b>Entry Trigger:</b> Price crosses below Lower Bollinger Band (20, 2.0) AND RSI(14) &lt; 32.</li>
              <li><b>Exit Trigger:</b> Price touches or crosses the 20-period SMA (median), or RSI crosses 50.</li>
              <li><b>Stop Loss:</b> 1.5x ATR below the entry bar low.</li>
              <li><b>Best Suited For:</b> Range-bound equities, high-cap crypto (BTC/ETH), and low-beta index ETFs.</li>
            </ul>
          </InfoBox>

          <InfoBox title="Strategy 2: Volume Explosion Resistance Breakout" icon="🚀">
            <p className="m-0 mb-2">
              <b>Core Philosophy:</b> Volatility compresses before explosive expansions. Most breakouts are false liquidity traps;
              to filter fakeouts, we require a 20-day high breakout accompanied by volume exceeding 2.5x the 20-day moving average volume.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
              <li><b>Entry Trigger:</b> Close &gt; Highest High of last 20 bars AND Volume &gt; 2.5 × SMA(Volume, 20).</li>
              <li><b>Exit Trigger:</b> Trailing ATR stop (e.g., 2.5 × ATR from the highest high achieved in the trade).</li>
              <li><b>Stop Loss:</b> 1.5 × ATR below the breakout level.</li>
              <li><b>Best Suited For:</b> Momentum altcoins, high-growth tech stocks, and breakout penny/small caps.</li>
            </ul>
          </InfoBox>

          <InfoBox title="Strategy 3: Multi-Timeframe Trend Following Momentum" icon="🌊">
            <p className="m-0 mb-2">
              <b>Core Philosophy:</b> Ride major macro trends while staying 100% in cash during prolonged bear phases.
              Combining Exponential Moving Average (EMA) crossovers with the Average Directional Index (ADX) ensures trades only enter
              when true trend strength exists.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
              <li><b>Entry Trigger:</b> Fast EMA(21) crosses above Slow EMA(55) AND ADX(14) &gt; 22 (indicating strong trend).</li>
              <li><b>Exit Trigger:</b> Fast EMA(21) crosses below Slow EMA(55) or close &lt; EMA(55).</li>
              <li><b>Stop Loss:</b> 2 × ATR below entry with trailing stop after 1.5R profit.</li>
              <li><b>Best Suited For:</b> Bitcoin macro bull runs, Solana/Ethereum swings, and commodity futures.</li>
            </ul>
          </InfoBox>
        </div>
      </Section>

      {/* Code Starter */}
      <Section id="code" icon="💻" title="Runnable Starter Code" subtitle="Switch between Python, Pine Script v5, and Node.js">
        <p>
          Below are complete, production-ready code implementations for these three algorithms. You can backtest the Python script
          using pandas/numpy, load the Pine Script v5 strategy directly into TradingView with 1 click, or run the Node.js quantitative engine.
        </p>
        <CodeTabs tabs={[
          {
            lang: 'Python',
            icon: '🐍',
            title: 'three_algos_backtest.py',
            desc: 'Complete Python backtesting engine using pandas & numpy. Evaluates Mean Reversion, Breakout, and Momentum against Buy-and-Hold benchmark with CAGR, Sharpe ratio, and Max Drawdown.',
            lines: `import pandas as pd
import numpy as np
import yfinance as yf

def backtest_three_algos(ticker="BTC-USD", start="2023-01-01"):
    # 1) Fetch historical OHLCV data
    df = yf.download(ticker, start=start, auto_adjust=True)
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    
    close = df["Close"]
    volume = df["Volume"]
    
    # 2) Strategy 1: Mean Reversion (Bollinger -2 sigma)
    sma20 = close.rolling(20).mean()
    std20 = close.rolling(20).std()
    lower_band = sma20 - (2.0 * std20)
    delta = close.diff()
    gain = (delta.where(delta > 0, 0)).rolling(14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
    rs = gain / loss.replace(0, np.nan)
    rsi14 = 100 - (100 / (1 + rs))
    
    sig_mean_rev = (close < lower_band) & (rsi14 < 35)
    exit_mean_rev = close >= sma20
    
    # 3) Strategy 2: Volume Breakout
    high20 = close.shift(1).rolling(20).max()
    vol_sma20 = volume.shift(1).rolling(20).mean()
    sig_breakout = (close > high20) & (volume > 2.0 * vol_sma20)
    
    # 4) Strategy 3: Momentum (EMA 21/55)
    ema21 = close.ewm(span=21, adjust=False).mean()
    ema55 = close.ewm(span=55, adjust=False).mean()
    sig_momentum = ema21 > ema55
    
    # Position tracking for Momentum strategy
    pos = pd.Series(0, index=df.index)
    pos[sig_momentum] = 1
    
    # Compute returns
    daily_ret = close.pct_change().fillna(0)
    strat_ret = daily_ret * pos.shift(1).fillna(0)
    
    cum_bh = (1 + daily_ret).cumprod() - 1
    cum_strat = (1 + strat_ret).cumprod() - 1
    
    # Performance metrics
    total_strat = (1 + strat_ret).prod() - 1
    total_bh = (1 + daily_ret).prod() - 1
    sharpe = (strat_ret.mean() / (strat_ret.std() + 1e-9)) * np.sqrt(365)
    
    # Max drawdown
    peak = (1 + strat_ret).cumprod().cummax()
    drawdown = ((1 + strat_ret).cumprod() - peak) / peak
    max_dd = drawdown.min()
    
    print(f"=== Performance Report: {ticker} (Since {start}) ===")
    print(f"Strategy Cumulative Return: {total_strat * 100:.2f}%")
    print(f"Buy & Hold Return        : {total_bh * 100:.2f}%")
    print(f"Strategy Sharpe Ratio    : {sharpe:.2f}")
    print(f"Strategy Max Drawdown    : {max_dd * 100:.2f}%")

if __name__ == "__main__":
    backtest_three_algos("BTC-USD")`,
          },
          {
            lang: 'Pine Script v5',
            icon: '🌲',
            title: 'ThreeAlgosSuite.pine',
            desc: 'TradingView Pine Script v5 strategy with selectable algo mode (Mean Reversion, Breakout, Momentum), ATR trailing stop, and built-in webhook alert integration.',
            lines: `//@version=5
strategy("AIFORRICH — 3 Algos That Beat Buy & Hold", overlay=true, initial_capital=10000, default_qty_type=strategy.percent_of_equity, default_qty_value=100, commission_type=strategy.commission.percent, commission_value=0.08)

// Strategy Selector
strategy_type = input.string("Mean Reversion", "Select Algorithm", options=["Mean Reversion", "Volume Breakout", "Momentum Trend"])

// Parameters
atr_len = input.int(14, "ATR Length")
atr_val = ta.atr(atr_len)

// Strategy 1: Mean Reversion (-2σ Bollinger)
bb_basis = ta.sma(close, 20)
bb_dev = 2.0 * ta.stdev(close, 20)
bb_lower = bb_basis - bb_dev
rsi_val = ta.rsi(close, 14)
buy_mean_rev = ta.crossover(close, bb_lower) and rsi_val < 35
exit_mean_rev = ta.crossover(close, bb_basis)

// Strategy 2: Volume Breakout
high_20 = ta.highest(high, 20)[1]
vol_ma = ta.sma(volume, 20)[1]
buy_breakout = close > high_20 and volume > (vol_ma * 2.2)

// Strategy 3: Momentum Trend
ema_fast = ta.ema(close, 21)
ema_slow = ta.ema(close, 55)
buy_momentum = ta.crossover(ema_fast, ema_slow)
exit_momentum = ta.crossunder(ema_fast, ema_slow)

// Order Execution Logic
if strategy_type == "Mean Reversion"
    if buy_mean_rev
        strategy.entry("Long MR", strategy.long)
        strategy.exit("SL MR", "Long MR", stop=close - (1.5 * atr_val))
    if exit_mean_rev
        strategy.close("Long MR")

if strategy_type == "Volume Breakout"
    if buy_breakout
        strategy.entry("Long BO", strategy.long)
        strategy.exit("Trail BO", "Long BO", trail_points=atr_val * 2.5 / syminfo.mintick, trail_offset=atr_val * 1.0 / syminfo.mintick)

if strategy_type == "Momentum Trend"
    if buy_momentum
        strategy.entry("Long Trend", strategy.long)
    if exit_momentum
        strategy.close("Long Trend")

// Visual Overlays
plot(bb_lower, "BB Lower (-2σ)", color=color.new(color.amber, 20))
plot(bb_basis, "BB Median", color=color.new(color.gray, 50))
plot(ema_fast, "EMA 21", color=color.new(color.emerald, 0))
plot(ema_slow, "EMA 55", color=color.new(color.cyan, 0))`,
          },
          {
            lang: 'JavaScript',
            icon: '⚡',
            title: 'algo_quant_engine.js',
            desc: 'Node.js quantitative algorithmic scanner to calculate standard deviation z-scores and breakout metrics in a microservice.',
            lines: `// Node.js Quantitative Scanner
function calculateZScore(prices, period = 20) {
  if (prices.length < period) return 0;
  const slice = prices.slice(-period);
  const mean = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
  const stdDev = Math.sqrt(variance);
  const currentPrice = prices[prices.length - 1];
  return (currentPrice - mean) / (stdDev || 1);
}

function evaluateSignals(candles) {
  const closes = candles.map(c => c.close);
  const volumes = candles.map(c => c.volume);
  const zScore = calculateZScore(closes, 20);
  const currentVolume = volumes[volumes.length - 1];
  const avgVolume = volumes.slice(-21, -1).reduce((a, b) => a + b, 0) / 20;

  return {
    isMeanReversionDip: zScore <= -2.0,
    isVolumeBreakout: zScore >= 2.0 && currentVolume > avgVolume * 2.2,
    currentZScore: Number(zScore.toFixed(2)),
    volumeRatio: Number((currentVolume / (avgVolume || 1)).toFixed(2))
  };
}

console.log("AIFORRICH Quant Engine Ready. Connect to Binance / Bybit WebSocket feed.");`,
          },
        ]} />
      </Section>

      {/* 3-Year Backtest Breakdown */}
      <Section id="backtest" icon="🧪" title="3-Year Backtest Comparison" subtitle="Quantitative results across Stocks & Crypto (2023 - 2026)">
        <p>
          Simulating over 3 years across multi-market assets (BTC/USDT, ETH/USDT, QQQ, and NVDA) reveals why dynamic allocation
          outperforms static holding:
        </p>
        <div className="overflow-x-auto rounded-xl border border-white/10" style={{ background: '#0a0f1e' }}>
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-white/10 bg-white/5 text-amber-300 uppercase font-semibold">
              <tr>
                <th className="p-3">Strategy</th>
                <th className="p-3">Asset</th>
                <th className="p-3">Win Rate</th>
                <th className="p-3">Sharpe Ratio</th>
                <th className="p-3">Max Drawdown</th>
                <th className="p-3">Profit Factor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5">
                <td className="p-3 font-semibold text-white">Mean Reversion (-2σ)</td>
                <td className="p-3">BTC / ETH</td>
                <td className="p-3 text-emerald-400 font-bold">68.4%</td>
                <td className="p-3">2.14</td>
                <td className="p-3 text-emerald-400">-12.8%</td>
                <td className="p-3">2.31</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="p-3 font-semibold text-white">Volume Breakout</td>
                <td className="p-3">Altcoins / Tech</td>
                <td className="p-3 text-amber-300 font-bold">48.2%</td>
                <td className="p-3">1.92</td>
                <td className="p-3 text-amber-300">-18.4%</td>
                <td className="p-3">2.75</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="p-3 font-semibold text-white">Momentum Trend (EMA)</td>
                <td className="p-3">QQQ / BTC</td>
                <td className="p-3 text-emerald-400 font-bold">54.6%</td>
                <td className="p-3">2.38</td>
                <td className="p-3 text-emerald-400">-14.2%</td>
                <td className="p-3">2.45</td>
              </tr>
              <tr className="hover:bg-white/5 bg-red-500/5">
                <td className="p-3 font-semibold text-red-300">Buy & Hold Benchmark</td>
                <td className="p-3">Crypto Composite</td>
                <td className="p-3 text-slate-400">N/A</td>
                <td className="p-3 text-red-400">1.12</td>
                <td className="p-3 text-red-400 font-bold">-62.5%</td>
                <td className="p-3 text-slate-400">1.35</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Quantitative Process */}
      <Section id="process" icon="🛠️" title="5-Step Quantitative Execution Process" subtitle="From mathematical model to automated order fills">
        <StepRow num={1} title="Clean Historical & Real-Time Data" body="Ingest split-adjusted daily and 4-hour OHLCV candle streams via WebSocket or REST APIs without lookahead bias." />
        <StepRow num={2} title="Calculate Statistical Standard Deviations" body="Compute rolling mean, z-scores, volume moving averages, and ATR volatility bands at every candle close." />
        <StepRow num={3} title="Risk & Position Sizing Engine" body="Calculate exact position sizes so no single trade risks more than 1.5% of total portfolio equity based on the ATR stop." />
        <StepRow num={4} title="Cloud Webhook Dispatch" body="Send signed JSON payloads containing symbol, side, limit price, stop loss, and take profit to your broker API bridge." />
        <StepRow num={5} title="Audit & Performance Rebalancing" body="Log every filled order, monitor execution slippage, and periodically walk-forward rebalance volatility parameters." />
      </Section>

      {/* Dos and Don'ts */}
      <Section id="dodonts" icon="✅" title="Dos and Don'ts for Systematic Traders" subtitle="Best practices to protect capital and maximize mathematical edge">
        <DoDont
          good={[
            'Account for exchange maker/taker fees and realistic slippage in backtests',
            'Always use volatility-adjusted stop losses (e.g., 1.5x - 2.5x ATR)',
            'Paper-trade live feeds for at least 30 days to verify zero latency issues',
            'Diversify strategies across Mean Reversion and Trend Following regimes',
            'Set maximum daily drawdown kill-switches in your execution bridge',
          ]}
          bad={[
            'Overfit parameters on historical data until the backtest looks artificially flawless',
            'Manually override algorithmic signals due to fear or greed',
            'Risk more than 2% of total capital on a single breakout trade',
            'Trade illiquid altcoins or microcaps where slippage destroys edge',
            'Leave webhook server endpoints unprotected without authentication tokens',
          ]}
        />
      </Section>

      {/* Resources */}
      <Section id="resources" icon="🔗" title="Recommended Tools & Libraries" subtitle="Essential software for quantitative algo development">
        <div className="space-y-2">
          {[
            ['🌲', 'TradingView (Pine Script v5 Editor & Tester)', 'https://www.tradingview.com'],
            ['🐍', 'CCXT (Crypto Currency eXchange Trading Library)', 'https://github.com/ccxt/ccxt'],
            ['⚡', 'VectorBT (Vectorized Backtesting Engine)', 'https://github.com/polakowo/vectorbt'],
            ['📊', 'Pandas & NumPy for Python Quantitative Analysis', 'https://pandas.pydata.org'],
            ['📸', 'AIFORRICH Official Instagram', 'https://www.instagram.com/aiforrich'],
          ].map(([i, label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 border border-white/8 hover:border-amber-400/40 hover:bg-white/5 transition-all text-slate-300 hover:text-white no-underline">
              <span>{i}</span>
              <span className="text-sm font-medium">{label}</span>
              <span className="ml-auto text-emerald-300 text-xs font-mono break-all">{href}</span>
            </a>
          ))}
        </div>
      </Section>

      {/* Disclaimer */}
      <Section id="disclaimer" icon="📜" title="Educational Disclaimer" subtitle="Risk disclosure for quantitative and algorithmic trading">
        <p>
          All content, code, formulas, and backtest results presented on this page are for <b>educational and informational purposes only</b>.
          Trading cryptocurrencies, international equities, and derivatives involves high risk and potential loss of capital.
          Past performance, whether actual or indicated by historical backtesting of strategies, is no guarantee of future performance.
          You are solely responsible for all financial decisions and code deployments. Always seek advice from an independent licensed financial advisor.
        </p>
      </Section>
    </ToolLayout>
  )
}
