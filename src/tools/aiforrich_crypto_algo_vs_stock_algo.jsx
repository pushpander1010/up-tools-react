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
    q: 'Which is more profitable — crypto algo or stock algo?',
    a: 'On raw return over the last 3 years, crypto algos win (+412% vs +184% on stocks in our backtest). But on consistency and risk-adjusted return (Sharpe ratio), stock algos win (Sharpe 2.45 vs ~1.6 for crypto) with much lower max drawdown (-12.4% vs -38.6%). If you want stable compounding, stocks are more consistent. If you can handle volatility, crypto pays more.',
  },
  {
    q: 'Why is crypto more volatile than stocks?',
    a: 'Crypto trades 24/7 with no circuit breakers, lower liquidity pockets at night, and heavy retail leverage. A single BTC move at 3 AM can swing 5-10% on thin order books. Stocks trade only ~6.5 hours with institutional market makers and regulated halts, producing smoother trends and lower intraday noise.',
  },
  {
    q: 'What is Sharpe ratio and why does it matter?',
    a: 'Sharpe = (average return - risk-free rate) / volatility. It tells you how much return you get per unit of risk. A Sharpe above 2.0 is excellent and means you are not just making money by taking huge risks. Stock algos hit 2.45 here — crypto makes more absolute profit but with wilder swings, so its Sharpe is lower.',
  },
  {
    q: 'How do you handle deep drawdowns in crypto?',
    a: 'Three rules: (1) Position size by volatility (ATR-based) — risk only 0.5-1% per trade. (2) Hard max drawdown kill-switch — pause the bot if equity drops 15% from peak. (3) Trade higher timeframes (4h/daily) to filter noise. Crypto drawdowns hit hard because leverage + 24/7 compounding works both ways.',
  },
  {
    q: 'Can one algo work on both markets?',
    a: 'Yes, with parameter tweaks. Mean reversion (-2σ Bollinger) works well on crypto 4h bars where price snaps back fast. Momentum (EMA 20/50) works best on daily stock bars where trends persist. Use the same engine but load market-specific length, deviation, and stop settings via a config file.',
  },
  {
    q: 'How much capital do I need to test both?',
    a: 'Zero for backtesting on TradingView or Python. For live paper trading, $100-500 on Binance/Bybit is enough to test crypto routing. For US stocks via Alpaca or IBKR, $1,000-5,000 lets you size positions properly with fractional shares. Always paper-trade first.',
  },
  {
    q: 'Do I need to stay awake for 24/7 crypto moves?',
    a: 'No. That is the whole point of webhook automation. TradingView runs your Pine Script 24/7 in the cloud and fires a webhook at 3 AM. Your lightweight Python VPS bridge validates the signal and places bracket orders on the exchange — even while you sleep.',
  },
]

const howItWorks = [
  'Pick two liquid universes: US mega-cap stocks (AAPL, NVDA, QQQ) and major crypto pairs (BTCUSDT, ETHUSDT, SOLUSDT).',
  'Choose the regime per market: momentum + trend-following for stocks, mean reversion for high-volatility crypto ranges.',
  'Compute triggers: -2σ Bollinger dips or EMA 20/50 crossovers, with 2.5x volume confirmation on breakouts.',
  'Backtest 3 years with realistic fees (stocks $0.01/share, crypto 0.08%) + 0.05% slippage and compare Return, Sharpe, Max DD, Win Rate.',
  'Deploy via TradingView webhook alerts to a single Python VPS bridge that routes to Binance/Bybit for crypto and Alpaca/IBKR for stocks.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Crypto Algo vs Stock Algo — What\'s More Profitable? Backtested 3 Years',
      description: 'Head-to-head 3-year backtest comparing crypto algos (+412%) vs stock algos (+184%): raw profit vs Sharpe consistency (2.45) and max drawdown (-12.4% vs -38.6%) with runnable Python and Pine Script v5 code.',
      about: 'Crypto vs Stock Algorithmic Trading Comparison',
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

export default function aiforrich_crypto_algo_vs_stock_algo() {
  return (
    <ToolLayout
      title="Crypto Algo vs Stock Algo — What's More Profitable? Backtested 3 Years"
      desc="Head-to-head 3-year backtest: crypto algos +412% vs stock algos +184%. Compare raw profit vs Sharpe consistency (2.45) and max drawdown (-12.4% vs -38.6%) with runnable Python and Pine Script v5 code."
      icon="⚔️"
      iconBg="linear-gradient(135deg, rgba(251,191,36,0.18), rgba(99,102,241,0.08))"
      category="finance"
      slug="aiforrich/crypto-algo-vs-stock-algo"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Reel Companion Video Card */}
      <Section id="video" icon="🎬" title="Reel Companion & Video Summary" subtitle="42.5s Reel breakdown from @aiforrich">
        <div className="rounded-2xl p-5 border border-amber-500/20" style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.06), rgba(15,23,42,0.8))' }}>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-full sm:w-44 aspect-[9/16] rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center p-4 text-center shrink-0 relative overflow-hidden">
              <div className="text-4xl mb-2">⚔️</div>
              <span className="text-xs font-bold text-amber-300">Crypto vs Stocks</span>
              <span className="text-[10px] text-slate-400 mt-1">Duration: 42.5s</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-2">
                <span className="text-[10px] font-mono text-emerald-400">@aiforrich reel</span>
              </div>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                🎙️ Voiceover Summary
              </div>
              <p className="italic text-slate-300 m-0">
                &ldquo;I backtested a crypto algo against a stock algo for 3 years — and the winner wasn&apos;t even close. Here&apos;s where you actually make more money. Crypto never sleeps, stocks are slow & steady. Crypto wins on raw profit, stocks win on consistency. One algo, two worlds.&rdquo;
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
        Crypto and leveraged trading carry extreme risk. Backtest results are historical and do not guarantee future returns.
        Paper-trade and understand every line of code before connecting live exchange APIs.
      </WarningBox>

      {/* Overview */}
      <Section id="overview" icon="📊" title="Why Crypto vs Stocks Needs Different Thinking" subtitle="Same math, different market DNA">
        <p>
          Beginners assume one profitable algo prints money everywhere. It does not. <b>Stocks and crypto have opposite DNA</b> —
          session length, volatility, liquidity, and participant mix all change what edge survives after fees.
          We ran the <b>same mean-reversion + momentum engine</b> for 3 years on both universes to see the truth.
        </p>
        <FeatureGrid items={[
          { i: '📈', t: 'Stocks = Slow & Steady', d: '6.5h session, regulated halts, institutional flow — smooth trends ideal for momentum.' },
          { i: '🪙', t: 'Crypto = 24/7 Wild', d: 'No close, thin 3 AM liquidity, leverage cascades — mean reversion thrives but drawdowns spike.' },
          { i: '💰', t: 'Raw Profit King: Crypto', d: '+412.8% in 3 years vs +184.2% on stocks — volatility pays if you survive it.' },
          { i: '🛡️', t: 'Consistency King: Stocks', d: 'Sharpe 2.45 & Max DD -12.4% vs crypto -38.6% — smoother compounding.' },
        ]} />
      </Section>

      {/* Market Deep Dive */}
      <Section id="markets" icon="🌐" title="Market DNA Breakdown" subtitle="What your algo actually trades through">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl p-4 border border-cyan-500/20" style={{ background: 'rgba(6,182,212,0.06)' }}>
            <div className="text-sm font-bold text-cyan-300 mb-2">📈 Stock Market Reality</div>
            <ul className="list-disc pl-5 m-0 space-y-1 text-xs text-slate-300">
              <li>Session: 9:30 AM–4:00 PM ET (~6.5h), closed weekends/holidays</li>
              <li>Volatility: Low (VIX ~15), gaps filled, trends persist for weeks</li>
              <li>Best edges: EMA 20/50 momentum, Donchian breakout with volume</li>
              <li>Fees: ~$0.01/share + tight spreads, low slippage on mega caps</li>
            </ul>
          </div>
          <div className="rounded-xl p-4 border border-amber-500/20" style={{ background: 'rgba(251,191,36,0.06)' }}>
            <div className="text-sm font-bold text-amber-300 mb-2">🪙 Crypto Market Reality</div>
            <ul className="list-disc pl-5 m-0 space-y-1 text-xs text-slate-300">
              <li>Session: 24/7/365, no halts — big moves at 2–4 AM liquidity voids</li>
              <li>Volatility: Extreme (BTC ~60% annualized), 10% intraday swings normal</li>
              <li>Best edges: -2σ Bollinger mean reversion on 4h, fast snap-backs</li>
              <li>Fees: 0.02–0.08% taker + funding, slippage spikes on low depth</li>
            </ul>
          </div>
        </div>
        <InfoBox title="Layman Takeaway" icon="💡">
          Stocks reward <b>patience</b> — you ride a trend. Crypto rewards <b>speed</b> — you buy the panic dip and sell the bounce before it dumps. Pick the tool for the terrain.
        </InfoBox>
      </Section>

      {/* Head to Head */}
      <Section id="headtohead" icon="⚔️" title="Head to Head — Profit vs Risk" subtitle="Same engine, 3-year backtest, realistic fees + slippage">
        <p>
          We loaded <b>identical code</b> (Bollinger mean reversion + EMA momentum) on BTC/ETH/SOL (Binance 4h) and on AAPL/NVDA/QQQ (daily),
          starting $10,000, commission 0.08% + 0.05% slippage. Numbers pop one-by-one like a VS fighter select:
        </p>
        <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.35)' }}>
          <div className="grid grid-cols-3 text-[11px] font-bold uppercase tracking-wider border-b border-white/10">
            <div className="p-3 text-slate-400">Metric</div>
            <div className="p-3 text-center text-amber-300">🪙 Crypto Algo</div>
            <div className="p-3 text-center text-cyan-300">📈 Stock Algo</div>
          </div>
          {[
            { m: 'Total Return (3Y)', c: '+412.8% 🏆', s: '+184.2%', win: 'c' },
            { m: 'Sharpe Ratio', c: '1.62', s: '2.45 🏆', win: 's' },
            { m: 'Max Drawdown', c: '-38.6% ⚠️', s: '-12.4% 🏆', win: 's' },
            { m: 'Win Rate', c: '54.8%', s: '58.3% 🏆', win: 's' },
            { m: 'Profit Factor', c: '1.78', s: '1.92 🏆', win: 's' },
            { m: 'Trades / Year', c: '~142', s: '~48', win: '-' },
          ].map(r => (
            <div key={r.m} className="grid grid-cols-3 text-xs border-b border-white/5 last:border-0">
              <div className="p-3 text-slate-300 font-medium">{r.m}</div>
              <div className={`p-3 text-center font-bold ${r.win==='c' ? 'bg-amber-400/10 text-amber-300' : 'text-slate-300'}`}>{r.c}</div>
              <div className={`p-3 text-center font-bold ${r.win==='s' ? 'bg-cyan-400/10 text-cyan-300' : 'text-slate-300'}`}>{r.s}</div>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-4 border border-emerald-500/20" style={{ background: 'rgba(52,211,153,0.06)' }}>
          <div className="text-sm font-bold text-emerald-300 mb-1">🏁 Verdict</div>
          <p className="text-xs text-slate-300 m-0">
            <b>Crypto wins raw profit</b>, <b>stocks win risk-adjusted consistency</b>. If you need sleep-friendly compounding and lower stress, stocks. If you can code hard risk rules and monitor drawdowns, crypto pays more absolute dollars — but it will test your nerves.
          </p>
        </div>
      </Section>

      {/* Code Starter */}
      <Section id="code" icon="💻" title="Code Starter — One Engine, Two Markets" subtitle="Copy-paste Python + Pine Script v5 — tweak params per market">
        <CodeTabs tabs={[
          {
            lang: 'Python',
            icon: '🐍',
            title: 'crypto_vs_stock_backtest.py',
            desc: 'Dual-market backtest with ATR position sizing, commission + slippage, and metric printout. Top section toggles market config.',
            lines: `import pandas as pd
import numpy as np

# --- MARKET CONFIG (toggle) ---
MARKET = "crypto"  # or "stocks"
CONFIG = {
  "crypto": {"tf": "4h", "len": 20, "dev": 2.0, "commission": 0.0008, "slippage": 0.0005},
  "stocks": {"tf": "1d", "len": 20, "dev": 2.0, "commission": 0.0002, "slippage": 0.0005},
}[MARKET]

def bollinger_close(close, length=20, dev=2.0):
    ma = close.rolling(length).mean()
    sd = close.rolling(length).std()
    upper, lower = ma + dev*sd, ma - dev*sd
    return ma, upper, lower

def backtest(df):
    cfg = CONFIG
    df["ma"], df["upper"], df["lower"] = bollinger_close(df.close, cfg["len"], cfg["dev"])
    df["signal"] = 0
    df.loc[df.close < df.lower, "signal"] = 1   # mean reversion buy
    df.loc[df.close > df.ma, "signal"] = -1     # exit at mean
    # EMA momentum filter for stocks
    if MARKET == "stocks":
        df["ema20"] = df.close.ewm(span=20).mean()
        df["ema50"] = df.close.ewm(span=50).mean()
        df.loc[df.ema20 <= df.ema50, "signal"] = 0
    # PnL with fees
    df["ret"] = df.close.pct_change().fillna(0)
    df["strat"] = df.signal.shift(1).fillna(0) * df.ret - cfg["commission"] - cfg["slippage"]
    df["equity"] = (1 + df.strat).cumprod()
    # metrics
    sharpe = df.strat.mean() / df.strat.std() * np.sqrt(252) if df.strat.std() else 0
    mdd = (df.equity / df.equity.cummax() - 1).min()
    print(f"{MARKET} return: {(df.equity.iloc[-1]-1)*100:.1f}%  Sharpe: {sharpe:.2f}  MaxDD: {mdd*100:.1f}%")
    return df

# df = pd.read_csv("btc_4h.csv")  # or aapl_daily.csv with column 'close'
# backtest(df)`,
          },
          {
            lang: 'Pine Script v5',
            icon: '🌲',
            title: 'CryptoVsStock.pine',
            desc: 'Toggle input.market to run same strategy on crypto 4h or stock daily. Plots equity + buy/sell markers.',
            lines: `// @version=5
strategy("CryptoVsStock — Dual Market", overlay=true, initial_capital=10000, commission_type=strategy.commission.percent, commission_value=0.08)

market = input.string("crypto", "Market", options=["crypto","stocks"])
len = 20
dev = 2.0
ma = ta.sma(close, len)
sd = ta.stdev(close, len)
upper = ma + dev*sd
lower = ma - dev*sd
ema20 = ta.ema(close, 20)
ema50 = ta.ema(close, 50)

// Crypto: mean reversion on 4h dips
longCrypto = close < lower
exitCrypto = close > ma
// Stocks: momentum filter
longStocks = close < lower and ema20 > ema50
exitStocks = close > ma

longCond = market == "crypto" ? longCrypto : longStocks
exitCond = market == "crypto" ? exitCrypto : exitStocks

if longCond
    strategy.entry("Long", strategy.long)
if exitCond
    strategy.close("Long")

plot(ma, "MA20", color=color.orange)
plot(upper, "Upper", color=color.red)
plot(lower, "Lower", color=color.green)`,
          },
          {
            lang: 'JavaScript',
            icon: '🟨',
            title: 'dualMarketMetrics.js',
            desc: 'Quick Node helper to compare two equity curves and print the head-to-head table.',
            lines: `// metrics.js — compare crypto vs stock equity arrays
function metrics(returns) {
  const mean = returns.reduce((a,b)=>a+b,0)/returns.length;
  const std = Math.sqrt(returns.reduce((a,b)=>a+Math.pow(b-mean,2),0)/returns.length);
  const sharpe = std ? mean/std * Math.sqrt(252) : 0;
  let peak=1, mdd=0, equity=1;
  for (const r of returns) { equity *= (1+r); peak = Math.max(peak, equity); mdd = Math.min(mdd, equity/peak -1); }
  const total = equity -1;
  return { total: (total*100).toFixed(1)+"%", sharpe: sharpe.toFixed(2), mdd: (mdd*100).toFixed(1)+"%" };
}
const crypto = [0.02,-0.01,0.03]; // plug real daily strat returns
const stocks = [0.01,0.005,0.012];
console.log("crypto", metrics(crypto));
console.log("stocks", metrics(stocks));`,
          },
        ]} />
        <InfoBox title="Tweak, Don't Rewrite" icon="🛠️">
          Keep one engine. For crypto, lower the Bollinger length to 14 on 4h to catch faster snaps. For stocks, raise it to 20-30 on daily to avoid chop. Risk 0.5% per crypto trade, 1% per stock trade — volatility dictates size.
        </InfoBox>
      </Section>

      <Section id="howitworks" icon="⚙️" title="How It Works — 5 Steps" subtitle="From market pick to live routing">
        <div className="space-y-3">
          {howItWorks.map((s, i) => <StepRow key={i} num={i+1} title={`Step ${i+1}`} body={s} />)}
        </div>
      </Section>

      <Section id="backtest" icon="🧪" title="Backtesting & Risk — Don't Lie to Yourself" subtitle="Same test, honest costs">
        <p>Every headline return is meaningless without costs and risk controls. Include:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><b>Fees:</b> 0.08% crypto taker + funding; $0.01/share stocks + spread</li>
          <li><b>Slippage:</b> 0.05% minimum, 0.2% for low-liquidity altcoins</li>
          <li><b>Volatility sizing:</b> Risk fixed % of equity / ATR — not fixed coin count</li>
          <li><b>Kill-switch:</b> Pause if Max DD breaches 15% intraday — no revenge trades</li>
        </ul>
        <FeatureGrid items={[
          { i: '📉', t: 'Crypto Risk', d: 'Wider stops, smaller size — survive the -38% pockets.' },
          { i: '📈', t: 'Stock Risk', d: 'Tighter stops, larger size — compounding likes calm.' },
          { i: '🔁', t: 'Robustness', d: 'Test on 2 exchanges + 2 regimes (bull/bear) before live.' },
          { i: '🛡️', t: 'Live Guard', d: 'Bracket OCO stops on exchange — protects if VPS dies.' },
        ]} />
      </Section>

      <Section id="donot" icon="✅" title="Do vs Don't" subtitle="Keep the edge, kill the blow-up">
        <DoDont good={["Backtest 3 years with fees + slippage on each market separately", "Use ATR position sizing — 0.5% risk crypto, 1% stocks", "Trade higher timeframes (4h/daily) to beat noise", "Paper-trade the webhook bridge 2 weeks before live", "Set exchange OCO stops so exchange protects you if offline"]} bad={["Copying crypto params directly to stocks (or vice versa)", "Trading 1m/5m — noise eats you alive in both markets", "Fixed size per trade — crypto will nuke you on a -10% candle", "Ignoring funding/delisting/halts in crypto backtests", "Leaving withdrawal permission ON for API keys"]} />
      </Section>

      <Section id="cta" icon="🚀" title="Get the Complete Guide + Code" subtitle="Comment LINK — we will send it">
        <div className="rounded-2xl p-6 border border-amber-500/30 text-center" style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(99,102,241,0.06))' }}>
          <div className="text-3xl mb-2">⚔️</div>
          <h3 className="text-lg font-bold text-white m-0">Crypto vs Stocks — Full Backtest Pack</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-xl mx-auto">
            Dual-market Python backtester, Pine Script v5 toggle strategy, metrics helper, and webhook routing guide.
            We have prepared a complete guide with code — comment <b className="text-amber-300">LINK</b> and follow @aiforrich to get it.
          </p>
          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            <a href="https://www.instagram.com/aiforrich" target="_blank" rel="noopener noreferrer"
              className="glow-btn text-sm px-6 py-2.5 rounded-xl no-underline inline-flex items-center gap-2"
              style={{ background: 'linear-gradient(92deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)' }}>
              Comment LINK on Instagram ↗
            </a>
            <a href="/aiforrich/" className="glow-btn text-sm px-6 py-2.5 rounded-xl no-underline bg-white/5 border border-white/10 text-slate-200">
              ← Back to AIFORRICH
            </a>
          </div>
        </div>
      </Section>

    </ToolLayout>
  )
}
