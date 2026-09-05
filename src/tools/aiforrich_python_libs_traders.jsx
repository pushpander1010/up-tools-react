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
    q: 'What does yfinance do for traders?',
    a: 'yfinance pulls free OHLCV history for stocks, ETFs, crypto and forex from Yahoo Finance in one line — no API keys, no signup. Years of daily (or intraday) bars land in a pandas DataFrame, ready for indicators and backtests. It is the fastest way to get data for research.',
  },
  {
    q: 'Why use TA-Lib instead of coding indicators myself?',
    a: 'TA-Lib implements 150+ indicators (RSI, MACD, Bollinger, ATR, Stochastics) in optimized C under a Python wrapper. One function call replaces ~50 lines of manual rolling-window math, runs 10-100x faster, and matches the exact formulas TradingView and Bloomberg use.',
  },
  {
    q: 'vectorbt vs Backtrader — which backtester should I pick?',
    a: 'vectorbt for speed: vectorized, backtests years of data in milliseconds, perfect for scanning 500 symbols × 20 parameter combos. Backtrader for realism: event-driven engine with commissions, slippage, position sizing and live-broker support. Pros use vectorbt to discover, Backtrader to validate.',
  },
  {
    q: 'Do I need all three libraries together?',
    a: 'Yes — they form a pipeline. yfinance fetches data → TA-Lib computes signals (RSI cross, MACD flip) → vectorbt/Backtrader simulates the strategy with costs → you keep only strategies with profit factor above 1.5 and max drawdown you can stomach.',
  },
  {
    q: 'Can these libraries handle crypto 24/7 data?',
    a: 'yfinance covers BTC/ETH daily well; for intraday crypto use exchange APIs (ccxt library) feeding the same pandas format. TA-Lib and vectorbt/Backtrader are data-source agnostic — any OHLCV DataFrame works, stocks or crypto.',
  },
  {
    q: 'How do I go from backtest to live trading?',
    a: 'Freeze the exact code that backtested well, wrap signal logic in a function, connect a broker API (Alpaca, Zerodha Kite, Binance), start paper-trading for 4-6 weeks, and only then go live with 1% risk per trade. Never edit strategy code mid-test.',
  },
]

const howItWorks = [
  'Fetch data with yfinance: one line, any symbol, years of history.',
  'Compute signals with TA-Lib: RSI, MACD, Bollinger in single calls.',
  'Backtest with vectorbt (fast scan) then Backtrader (realistic costs).',
  'Keep only profit factor 1.5+ strategies with survivable drawdowns.',
  'Paper-trade the frozen code 4-6 weeks before risking real money.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: '3 Python Libraries Every Algo Trader Needs — yfinance, TA-Lib, vectorbt/Backtrader',
      description: 'The exact Python stack pro algo traders use daily: yfinance free market data, TA-Lib 150+ indicators in one call, vectorbt millisecond backtests and Backtrader realistic simulation — with runnable starter code.',
      about: 'Python Libraries for Algorithmic Trading',
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

export default function aiforrich_python_libs_traders() {
  return (
    <ToolLayout
      title="3 Python Libraries Every Algo Trader Needs — Data, Indicators, Backtests"
      desc="Stop building trading tools from scratch: yfinance free market data, TA-Lib 150+ indicators, vectorbt + Backtrader backtests — with starter code. Comment LINK on the @aiforrich reel for the full stack."
      icon="🐍"
      iconBg="linear-gradient(135deg, rgba(52,211,153,0.18), rgba(251,191,36,0.08))"
      category="finance"
      slug="aiforrich/python-libs-traders"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Reel Companion Video Card */}
      <Section id="video" icon="🎬" title="Reel Companion & Video Summary" subtitle="~60s Reel breakdown from @aiforrich">
        <div className="rounded-2xl p-5 border border-amber-500/20" style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.06), rgba(15,23,42,0.8))' }}>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-full sm:w-44 aspect-[9/16] rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center p-4 text-center shrink-0 relative overflow-hidden">
              <div className="text-4xl mb-2">🐍</div>
              <span className="text-xs font-bold text-emerald-300">Python for Traders</span>
              <span className="text-[10px] text-slate-400 mt-1">Duration: ~60s</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-2">
                <span className="text-[10px] font-mono text-emerald-400">@aiforrich reel</span>
              </div>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-400/10 text-emerald-300 border border-emerald-400/30">
                🎙️ Voiceover Summary
              </div>
              <p className="italic text-slate-300 m-0">
                &ldquo;Still building trading tools from scratch? Three Python libraries save you months and every pro uses them daily. yfinance: free market data in one line. TA-Lib: 150 indicators in one call — RSI, MACD, Bollinger, done. vectorbt and Backtrader: backtest years in milliseconds. Strategy, portfolio, risk — all Python, zero complexity.&rdquo;
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
        This library guide is <b>strictly for educational purposes</b> and does <b>not constitute financial or investment advice</b>.
        Backtests are historical simulations, not profit promises. Always paper-trade strategies before connecting live broker APIs.
      </WarningBox>

      {/* Overview */}
      <Section id="overview" icon="📊" title="The 3-Library Stack (Stop Reinventing Wheels)" subtitle="Data → signals → backtest">
        <p className="m-0">
          Every pro algo desk runs the same pipeline: <b className="text-white">fetch data</b>,{' '}
          <b className="text-white">compute indicators</b>, <b className="text-white">simulate the strategy</b>.
          Three free Python libraries cover all three stages — months of work compressed into ~20 lines. Learn them
          once, reuse them on every strategy for years.
        </p>
        <FeatureGrid items={[
          { i: '📥', t: 'yfinance — data', d: 'Free OHLCV for stocks, ETFs, crypto. One line, no API keys, pandas-ready.' },
          { i: '📐', t: 'TA-Lib — indicators', d: '150+ indicators (RSI, MACD, BB, ATR) in single C-optimized calls.' },
          { i: '⚡', t: 'vectorbt — speed', d: 'Vectorized backtests: years of data in milliseconds. Scan everything.' },
          { i: '🎯', t: 'Backtrader — realism', d: 'Event-driven engine: commissions, slippage, sizing, live brokers.' },
        ]} />
      </Section>

      {/* Library deep-dives */}
      <Section id="libraries" icon="📚" title="Each Library in 30 Seconds" subtitle="What it replaces">
        <div className="space-y-3">
          <StepRow num="1" title="yfinance replaces paid data feeds (for research)"
            body="yf.download('RELIANCE.NS', period='5y') gives 5 years of daily bars instantly. Stocks, indices, forex, crypto — same call. For live intraday crypto, swap in ccxt later; the DataFrame format stays identical." />
          <StepRow num="2" title="TA-Lib replaces 50-line indicator math"
            body="talib.RSI(close, 14), talib.MACD(close), talib.BBANDS(close) — done. Same formulas as TradingView/Bloomberg, 10-100x faster than pandas rolling hacks, zero off-by-one bugs." />
          <StepRow num="3" title="vectorbt replaces overnight backtest runs"
            body="Feed it entries/exits arrays, get Sharpe, drawdown, win rate across 500 symbols × 20 params in seconds. Use it to DISCOVER what works." />
          <StepRow num="4" title="Backtrader replaces hope with realism"
            body="Re-run winners with 0.1% commission + slippage, volatility-based sizing, and walk-forward splits. Use it to VALIDATE before paper trading." />
        </div>
        <InfoBox title="Install everything in one line">
          pip install yfinance TA-Lib vectorbt backtrader pandas — on Windows install the TA-Lib wheel first (search 'TA-Lib wheel windows'), then pip works everywhere else.
        </InfoBox>
      </Section>

      {/* Workflow */}
      <Section id="workflow" icon="🔁" title="The Pro Workflow (Copy This)" subtitle="Discover fast, validate honestly">
        <FeatureGrid items={[
          { i: '🔍', t: 'Scan with vectorbt', d: 'Test RSI/MACD/BB combos across NIFTY-500 + BTC/ETH. Keep profit factor 1.5+.' },
          { i: '🧪', t: 'Validate with Backtrader', d: 'Add costs, sizing, regime splits. Kill anything that dies here.' },
          { i: '📝', t: 'Freeze the code', d: 'Lock parameters. No tweaking mid-test — that is curve-fitting.' },
          { i: '💤', t: 'Paper-trade 4-6 weeks', d: 'Same code, fake money, live data. Then 1% risk live.' },
        ]} />
        <DoDont
          good={['One DataFrame format end-to-end (yfinance → TA-Lib → backtester)', 'Walk-forward splits: train past, test future', 'Track max drawdown first, returns second', 'Version-control every strategy file']}
          bad={['Optimizing parameters until the past looks perfect', 'Ignoring commissions (they kill scalpers)', 'Backtesting on 3 months and declaring victory', 'Going live the same day code first runs']}
        />
      </Section>

      {/* Code */}
      <Section id="code" icon="💻" title="Starter Stack Code — Python + Pine Script" subtitle="Copy-paste: full data → signal → backtest pipeline">
        <CodeTabs tabs={[
          {
            lang: 'Python', icon: '🐍', title: 'pro_stack.py',
            desc: 'The complete pipeline: yfinance data, TA-Lib RSI+MACD signals, vectorbt backtest with costs.',
            lines: [
              '# Pro algo starter stack: yfinance + TA-Lib + vectorbt',
              '# pip install yfinance TA-Lib vectorbt pandas',
              'import yfinance as yf, pandas as pd, talib as ta, vectorbt as vbt',
              '',
              '# 1. DATA — 3 years, one line, no keys',
              'df = yf.download("RELIANCE.NS", period="3y", auto_adjust=True)',
              'close = df["Close"]',
              '',
              '# 2. SIGNALS — RSI mean-reversion + MACD trend filter',
              'rsi = ta.RSI(close, 14)',
              'macd, signal, _ = ta.MACD(close)',
              'entries = (rsi < 30) & (macd > signal)   # oversold + momentum turning',
              'exits = (rsi > 70)',
              '',
              '# 3. BACKTEST — with realistic costs, milliseconds',
              'pf = vbt.Portfolio.from_signals(close, entries, exits,',
              '    fees=0.001, slippage=0.0005, freq="1D")',
              'print(pf.stats()[["Total Return [%]", "Sharpe Ratio",',
              '    "Max Drawdown [%]", "Profit Factor", "Win Rate [%]"]])',
              'print("Trades:", pf.trades.count())',
            ].join('\n'),
          },
          {
            lang: 'Pine Script', icon: '🌲', title: 'stack_signals.pine',
            desc: 'Same RSI+MACD logic on TradingView for visual confirmation and webhook alerts.',
            lines: [
              '//@version=5',
              'indicator("AIFORRich Stack Signals", overlay=true)',
              'rsi = ta.rsi(close, 14)',
              '[macdLine, signalLine, _] = ta.macd(close, 12, 26, 9)',
              'buy = rsi < 30 and macdLine > signalLine',
              'sell = rsi > 70',
              'plotshape(buy, style=shape.triangleup, location=location.belowbar,',
              '     color=color.green, size=size.small, title="Buy")',
              'plotshape(sell, style=shape.triangledown, location=location.abovebar,',
              '     color=color.red, size=size.small, title="Sell")',
              'alertcondition(buy, "Stack buy", "STACK BUY {{ticker}}")',
              'alertcondition(sell, "Stack sell", "STACK SELL {{ticker}}")',
            ].join('\n'),
          },
          {
            lang: 'Java', icon: '☕', title: 'StackSignals.java',
            desc: 'Java port of the RSI + MACD crossover signal for JVM execution stacks.',
            lines: [
              'public class StackSignals {',
              '  public static double rsi(double[] c, int i, int n) {',
              '    double g = 0, l = 0;',
              '    for (int k = i - n + 1; k <= i; k++) {',
              '      double d = c[k] - c[k - 1];',
              '      if (d > 0) g += d; else l -= d;',
              '    }',
              '    return l == 0 ? 100 : 100 - 100 / (1 + g / l);',
              '  }',
              '  public static boolean buy(double[] c, int i) {',
              '    return rsi(c, i, 14) < 30; // + MACD filter in prod',
              '  }',
              '}',
            ].join('\n'),
          },
          {
            lang: 'C++', icon: '⚙️', title: 'stack_signals.cpp',
            desc: 'C++ port for embedding the signal in low-latency loops.',
            lines: [
              '#include <vector>',
              'double rsi(const std::vector<double>& c, int i, int n = 14) {',
              '  double g = 0, l = 0;',
              '  for (int k = i - n + 1; k <= i; ++k) {',
              '    double d = c[k] - c[k - 1];',
              '    if (d > 0) g += d; else l -= d;',
              '  }',
              '  return l == 0 ? 100 : 100 - 100 / (1 + g / l);',
              '}',
              '// buy when rsi(...) < 30 && macd turns up',
            ].join('\n'),
          },
        ]} />
        <InfoBox title="What good looks like">
          Profit factor above 1.5, Sharpe above 1.2, max drawdown under 20%, 100+ trades (statistical weight). Miss any one — keep researching, not trading.
        </InfoBox>
      </Section>

      {/* CTA */}
      <Section id="free-guide" icon="🎁" title="Free Python Stack + Code Templates" subtitle="Comment LINK on the reel">
        <p className="m-0">
          Want the complete Python stack guide (install fixes, data recipes, 5 starter strategies) plus all code templates?
          Comment <b className="text-white">LINK</b> on the Instagram reel and follow <b className="text-white">@aiforrich</b> —
          the guide and code land in your DMs, free.
        </p>
        <div className="pt-1">
          <a href="https://www.instagram.com/aiforrich" target="_blank" rel="noopener noreferrer"
            className="glow-btn text-xs px-4 py-2 rounded-xl no-underline inline-flex items-center gap-2"
            style={{ background: 'linear-gradient(92deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)' }}>
            Get it via Instagram @aiforrich ↗
          </a>
        </div>
      </Section>
    </ToolLayout>
  )
}
