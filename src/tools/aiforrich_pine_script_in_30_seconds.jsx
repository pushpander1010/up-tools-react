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
      <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1.5">⚠️ Backtesting & Risk Disclaimer</div>
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
    q: 'What is Pine Script and why is it so fast to write?',
    a: 'Pine Script is TradingView’s proprietary domain-specific language designed specifically for financial technical analysis and quantitative strategy backtesting. It handles historical bar iteration, candle OHLCV arrays, and charting natively in the background, allowing you to define full algorithmic strategies in 5 lines without writing complex loops or data-fetching pipelines.',
  },
  {
    q: 'Can a 5-line Pine Script bot really be profitable?',
    a: 'Yes, because algorithmic profitability comes from disciplined mathematical edge and risk management, not code complexity. A 5-line moving average crossover with ATR trailing stops on daily bars often outperforms over-engineered 1,000-line indicators that suffer from severe historical curve-fitting.',
  },
  {
    q: 'How do I run a backtest in TradingView?',
    a: 'Open TradingView, click "Pine Editor" at the bottom of the screen, paste your Pine Script v5 code, and click "Add to Chart". The "Strategy Tester" tab will instantly display your 3-year performance metrics, including Net Profit %, Profit Factor, Max Drawdown %, Win Rate, and every executed trade.',
  },
  {
    q: 'What is repainting and how do I avoid it in Pine Script v5?',
    a: 'Repainting happens when a script calculates signals on an unconfirmed (open) candle that changes before the candle closes, or uses future data in multi-timeframe security() calls. In Pine Script v5, avoid repainting by executing on bar close (`calc_on_every_tick=false`) and setting `lookahead=barmerge.lookahead_off`.',
  },
  {
    q: 'What is a good Profit Factor and Sharpe Ratio in Strategy Tester?',
    a: 'A Profit Factor above 1.5 is good; above 2.0 is excellent. Look for a maximum drawdown under 15-20% and a Sharpe Ratio above 1.5. Ensure the strategy executed at least 100+ trades to achieve statistical significance.',
  },
  {
    q: 'How do I connect Pine Script alerts to my broker or exchange?',
    a: 'In Pine Script, use the `alert()` function to output a JSON message. In TradingView, create an Alert on your strategy, check the "Webhook URL" option, enter your server endpoint, and leave the message field set to `{{strategy.order.alert_message}}`.',
  },
  {
    q: 'Is Pine Script v5 free to use?',
    a: 'Yes. Pine Script editor, compiler, and basic backtesting are 100% free on TradingView. Webhook alerts for live broker automation require an essential/plus TradingView plan.',
  },
]

const howItWorks = [
  'Open TradingView (any chart e.g. BTCUSDT, ETHUSDT, NVDA, QQQ) and open the Pine Editor panel.',
  'Write or paste the 5-line Pine Script v5 strategy declaration, EMA indicators, and order entry/exit rules.',
  'Click "Add to Chart" to run the instant backtest across 3+ years of historical data in Strategy Tester.',
  'Review Net Profit, Profit Factor (>1.5), and Max Drawdown (<15%) to ensure genuine statistical edge.',
  'Create a Webhook Alert with a signed JSON payload to automatically route orders to your broker while you sleep.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Pine Script in 30 Seconds — Build and Backtest Algo Bots',
      description: 'Learn how to build, backtest, and automate complete quantitative trading strategies in 30 seconds using 5 lines of Pine Script v5 on TradingView with runnable code.',
      about: 'Pine Script Algorithmic Trading',
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

export default function aiforrich_pine_script_in_30_seconds() {
  return (
    <ToolLayout
      title="Pine Script in 30 Seconds — Build & Backtest Algo Bots"
      desc="Learn how to code and backtest quantitative trading bots in 30 seconds with 5 lines of Pine Script v5 on TradingView. Instant 3-year performance metrics, win rate, profit factor, and webhook alerts."
      icon="🌲"
      iconBg="linear-gradient(135deg, rgba(245,158,11,0.18), rgba(16,185,129,0.08))"
      category="finance"
      slug="aiforrich/pine-script-in-30-seconds"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Reel Companion Video Card */}
      <Section id="video" icon="🎬" title="Reel Companion & Video Summary" subtitle="33.95s Pine Script tutorial from @aiforrich">
        <div className="rounded-2xl p-5 border border-amber-500/20" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(15,23,42,0.8))' }}>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-full sm:w-44 aspect-[9/16] rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center p-4 text-center shrink-0 relative overflow-hidden">
              <div className="text-4xl mb-2">🌲</div>
              <span className="text-xs font-bold text-amber-300">Pine Script 30s</span>
              <span className="text-[10px] text-slate-400 mt-1">Duration: 33.95s</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-2">
                <span className="text-[10px] font-mono text-emerald-400">@aiforrich reel</span>
              </div>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                🎙️ Voiceover Summary
              </div>
              <p className="italic text-slate-300 m-0">
                &ldquo;Still coding bots for hours? Pine Script builds it in 30 seconds. Five lines: entry, exit, stop loss, no complex Python needed. One-click backtest 3 years of stocks and crypto win rate, profit factor, and drawdown — then alert → webhook → broker while you sleep.&rdquo;
              </p>
              <div className="text-[11px] font-mono text-slate-400 pt-1">
                #algotrading #pinescript #tradingview #stockmarket #crypto
              </div>
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
        Backtest results in TradingView Strategy Tester are historical simulations. <b>Always include realistic broker commissions</b>
        (e.g., 0.08%) and slippage (1-2 ticks) in strategy settings. Past performance does not guarantee future profitability.
      </WarningBox>

      {/* Overview */}
      <Section id="overview" icon="⚡" title="Why Pine Script v5 is the Fastest Way to Build Bots" subtitle="Zero database setup, zero server maintenance, instant multi-year backtesting">
        <p>
          Traditional algorithmic bot development in Python or C++ requires downloading gigabytes of CSV data, maintaining
          local databases, writing bar loop engines, and creating visualization charts from scratch.
        </p>
        <FeatureGrid items={[
          { i: '☁️', t: 'Browser-Native Cloud Engine', d: 'Pine Script runs on TradingView servers. No Python environments, no dependency conflicts, no API keys to backtest.' },
          { i: '📈', t: 'Instant 3-Year Backtest', d: 'Click "Add to Chart" and get instant win rate, max drawdown, and profit factor over thousands of historical candles.' },
          { i: '🎯', t: 'Built-in Quantitative Library', d: 'Access EMA, RSI, Bollinger Bands, ATR, Supertrend, and MACD in single-line function calls.' },
          { i: '📡', t: 'Native Webhook Dispatch', d: 'Send formatted JSON payloads directly to broker APIs when conditions trigger.' },
        ]} />
      </Section>

      {/* The 5 Lines */}
      <Section id="the-5-lines" icon="📝" title="Deconstructing the 5-Line Trading Bot" subtitle="Every single line explained in plain English">
        <div className="space-y-3">
          <StepRow num={1} title="Line 1: Strategy Declaration & Commission Setup" body='//@version=5 followed by strategy("5-Line Bot", overlay=true, commission_value=0.08). Defines version 5 compiler and configures realistic transaction fees.' />
          <StepRow num={2} title="Line 2: Indicator Calculations" body='fast = ta.ema(close, 9), slow = ta.ema(close, 21), atr = ta.atr(14). Calculates fast momentum moving average, baseline trend, and volatility.' />
          <StepRow num={3} title="Line 3: Long Entry Condition" body='if ta.crossover(fast, slow) strategy.entry("Long", strategy.long). Executes entry order as soon as fast EMA crosses above slow EMA.' />
          <StepRow num={4} title="Line 4: Trailing Stop Loss & Exit" body='strategy.exit("Exit", "Long", stop=close - (1.5 * atr)). Attaches an ATR volatility-based stop loss to protect against sharp reversals.' />
          <StepRow num={5} title="Line 5: Automated Webhook Dispatch" body={`alert('{"ticker":"' + syminfo.ticker + '", "action":"BUY"}', alert.freq_once_per_bar_close). Dispatches cloud JSON webhook to your broker bridge.`} />
        </div>
      </Section>

      {/* Code Starters */}
      <Section id="code" icon="💻" title="Copy-Paste Starter Code" subtitle="Switch between 5-Line Pine Script, Extended Pine Strategy, and Python Webhook Listener">
        <p>
          Copy the Pine Script v5 code below, open the <b>Pine Editor</b> in TradingView, paste it, and click <b>Add to Chart</b>.
          The Strategy Tester tab will populate instantly.
        </p>
        <CodeTabs tabs={[
          {
            lang: 'Pine Script (5 Lines)',
            icon: '🌲',
            title: 'five_line_bot.pine',
            desc: 'The pure 5-line algorithmic trading bot in Pine Script v5. Fast EMA crossover with ATR stop loss and automated alert.',
            lines: `//@version=5
strategy("AIFORRICH — 5-Line Algo Bot", overlay=true, commission_value=0.08)
fast = ta.ema(close, 9), slow = ta.ema(close, 21), atr = ta.atr(14)
if ta.crossover(fast, slow)
    strategy.entry("Long", strategy.long)
    alert('{"ticker":"' + syminfo.ticker + '","action":"BUY"}', alert.freq_once_per_bar_close)
strategy.exit("Exit", "Long", stop=close - (1.5 * atr), trail_points=atr * 2.0 / syminfo.mintick)`,
          },
          {
            lang: 'Pine Script (Extended Pro)',
            icon: '⚡',
            title: 'pro_quant_strategy.pine',
            desc: 'Extended 20-line production strategy with configurable parameters, RSI momentum filter, ATR trailing stops, and visual chart plots.',
            lines: `//@version=5
strategy("AIFORRICH — Quantitative Pro Strategy", overlay=true, initial_capital=10000, default_qty_type=strategy.percent_of_equity, default_qty_value=100, commission_value=0.08)

// User Inputs
fast_len = input.int(9, "Fast EMA Length")
slow_len = input.int(21, "Slow EMA Length")
rsi_filter = input.int(50, "RSI Filter Level")
atr_multiplier = input.float(1.5, "ATR Stop Multiplier")

// Indicators
fast_ma = ta.ema(close, fast_len)
slow_ma = ta.ema(close, slow_len)
rsi_val = ta.rsi(close, 14)
atr_val = ta.atr(14)

// Entry and Exit Conditions
long_condition = ta.crossover(fast_ma, slow_ma) and rsi_val > rsi_filter
exit_condition = ta.crossunder(fast_ma, slow_ma)

if long_condition
    sl_level = close - (atr_multiplier * atr_val)
    tp_level = close + (atr_multiplier * 2.5 * atr_val)
    strategy.entry("Long", strategy.long)
    strategy.exit("Bracket Exit", "Long", stop=sl_level, limit=tp_level)
    alert('{"passphrase":"SECRET","ticker":"' + syminfo.ticker + '","action":"BUY","sl":' + str.tostring(sl_level) + '}', alert.freq_once_per_bar_close)

if exit_condition
    strategy.close("Long")

// Chart Plots
plot(fast_ma, "Fast EMA", color=color.emerald, linewidth=2)
plot(slow_ma, "Slow EMA", color=color.amber, linewidth=2)`,
          },
          {
            lang: 'Python (Listener)',
            icon: '🐍',
            title: 'pine_alert_receiver.py',
            desc: 'Lightweight Python script to receive the JSON webhook generated by Pine Script and route to broker/crypto API.',
            lines: `from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/webhook", methods=["POST"])
def on_pine_alert():
    data = request.json
    ticker = data.get("ticker", "BTCUSDT")
    action = data.get("action", "BUY")
    sl = data.get("sl")
    
    print(f"🌲 [Pine Script Alert Triggered] -> {action} {ticker} | Stop Loss: {sl}")
    # Forward order to Binance, Bybit, or Alpaca via CCXT/SDK
    return jsonify({"status": "order_received", "ticker": ticker}), 200

if __name__ == "__main__":
    app.run(port=5000)`,
          },
        ]} />
      </Section>

      {/* How to Read Strategy Tester */}
      <Section id="backtest-metrics" icon="📊" title="How to Read TradingView Strategy Tester Metrics" subtitle="What numbers separate a real edge from random luck">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoBox title="1. Profit Factor (> 1.50)" icon="💰">
            Profit Factor = Gross Profits ÷ Gross Losses. A value above 1.5 means the strategy makes $1.50 for every $1.00 it loses. Above 2.0 is institutional grade.
          </InfoBox>
          <InfoBox title="2. Maximum Drawdown (< 15%)" icon="📉">
            The peak-to-trough decline of your account. If a strategy produces 80% returns but has a 45% drawdown, you will likely panic-sell before recovering.
          </InfoBox>
          <InfoBox title="3. Number of Closed Trades (> 100)" icon="🔢">
            A strategy that traded 8 times in 3 years has zero statistical validity. Look for 100+ closed trades to confirm your sample size is valid.
          </InfoBox>
          <InfoBox title="4. Win Rate vs Risk-to-Reward" icon="⚖️">
            A 40% win rate is highly profitable if your average winner is 3x your average loss (1:3 Risk/Reward). Never evaluate win rate in isolation.
          </InfoBox>
        </div>
      </Section>

      {/* Process */}
      <Section id="process" icon="🛠️" title="4-Step Pine Script Workflow" subtitle="From empty script to live automated bot">
        <StepRow num={1} title="Open Pine Editor on TradingView" body="Navigate to any stock or crypto chart on TradingView and expand the Pine Editor tab at the bottom." />
        <StepRow num={2} title="Paste Strategy & Click 'Add to Chart'" body="Paste your Pine Script v5 code and save. The Strategy Tester will instantly backtest thousands of historical bars." />
        <StepRow num={3} title="Review Performance Metrics" body="Inspect Net Profit, Profit Factor, and Max Drawdown across multiple timeframes (1H, 4H, Daily)." />
        <StepRow num={4} title="Create Webhook Alert" body="Click 'Create Alert' on your strategy, check Webhook URL, paste your Python bridge endpoint, and let it trade 24/7." />
      </Section>

      {/* Dos and Don'ts */}
      <Section id="dodonts" icon="✅" title="Dos and Don'ts for Pine Script Developers" subtitle="Avoid common traps that ruin trading algorithms">
        <DoDont
          good={[
            'Always set commission_value (e.g. 0.08%) and slippage in strategy properties',
            'Backtest on 4-Hour and Daily bars for cleaner trends and lower noise',
            'Ensure calc_on_every_tick=false to avoid false repainting signals',
            'Test your script on multiple non-correlated assets (BTC, ETH, NVDA, QQQ)',
            'Use volatility-based ATR stop losses rather than arbitrary fixed dollar amounts',
          ]}
          bad={[
            'Use lookahead=barmerge.lookahead_on in security() calls (causes repainting)',
            'Over-optimize parameters until the backtest is curve-fitted to past noise',
            'Trust a backtest with fewer than 50 total historical trades',
            'Deploy live bots with real capital before paper-trading for 2 weeks',
            'Ignore slippage on low-liquidity small-cap crypto tokens',
          ]}
        />
      </Section>

      {/* Resources */}
      <Section id="resources" icon="🔗" title="Pine Script Learning Resources" subtitle="Master quantitative scripting on TradingView">
        <div className="space-y-2">
          {[
            ['🌲', 'Official TradingView Pine Script v5 User Manual', 'https://www.tradingview.com/pine-script-docs/en/v5/'],
            ['🧑‍💻', 'PineCoders Community Tools & Best Practices', 'https://www.pinecoders.com'],
            ['📊', 'TradingView Strategy Tester Documentation', 'https://www.tradingview.com/support/solutions/43000561845/'],
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
      <Section id="disclaimer" icon="📜" title="Educational Disclaimer" subtitle="Risk disclosure for Pine Script trading strategies">
        <p>
          Pine Script code, indicators, strategies, and backtest results presented on this page are for <b>educational and research purposes only</b>.
          Trading financial assets carries substantial risk of loss. Past backtested performance is not an indicator of future market returns.
          Always conduct independent analysis and test strategies in simulated paper-trading environments before risking capital.
        </p>
      </Section>
    </ToolLayout>
  )
}
