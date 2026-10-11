import { Helmet } from 'react-helmet-async'
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

function CodeBlock({ title, lines }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: '#0a0f1e' }}>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10" style={{ background: '#111827' }}>
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        {title && <span className="ml-2 text-[11px] font-mono text-slate-400">{title}</span>}
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-green-300 whitespace-pre-wrap">
{lines}
      </pre>
    </div>
  )
}

function WarningBox({ children }) {
  return (
    <div className="rounded-xl p-4 border border-red-500/30" style={{ background: 'rgba(239,68,68,0.07)' }}>
      <div className="flex items-center gap-2 text-red-300 font-bold text-sm mb-1.5">⚠️ Legal &amp; Ethical Warning</div>
      <div className="text-xs text-red-200/80 leading-relaxed">{children}</div>
    </div>
  )
}

function InfoBox({ title, icon = '💡', children }) {
  return (
    <div className="rounded-xl p-4 border border-cyan-500/25" style={{ background: 'rgba(6,182,212,0.06)' }}>
      <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm mb-1.5">{icon} {title}</div>
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

function IssueRow({ issue, fix }) {
  return (
    <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex items-start gap-2">
        <span className="text-red-400 font-bold mt-0.5">✕</span>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white mb-1">{issue}</div>
          <div className="text-xs text-slate-400 leading-relaxed">
            <span className="text-green-400 font-semibold">Fix: </span>{fix}
          </div>
        </div>
      </div>
    </div>
  )
}

const faq = [
  { q: "What is Freqtrade?", a: "Freqtrade is a free, open-source crypto trading bot written in Python. You pick a strategy, it watches the market 24/7 and places buy and sell orders for you automatically on 50+ supported exchanges, with full control from Telegram." },
  { q: "Is Freqtrade safe to use with real money?", a: "Freqtrade itself is legitimate open-source software with 50,000+ GitHub stars, but any trading bot can lose money fast with a bad strategy. Always backtest on historical data and dry-run (paper trade) before staking real funds, and never invest more than you can afford to lose." },
  { q: "What is backtesting?", a: "Backtesting means replaying your strategy against past market data to see how it would have performed — profit, losses, drawdown — before risking a single rupee. Freqtrade downloads historical candles and simulates every trade." },
  { q: "What is dry-run mode?", a: "Dry-run (paper trading) runs the live bot with fake money: it watches real prices and logs the trades it would take. Run it for days or weeks to prove a strategy works live before going real." },
  { q: "How do I control the bot?", a: "From Telegram. Freqtrade pairs with a Telegram bot so you get trade alerts and can start, stop, and check profit/loss from your phone with simple commands like /profit and /status." },
  { q: "Which exchanges does Freqtrade support?", a: "50+ exchanges including Binance, Kraken, and Coinbase via the CCXT library. Check the official docs for the current list and which features (spot, futures) each supports." },
  { q: "What is hyperopt / strategy optimization?", a: "Freqtrade can auto-tune strategy parameters with machine learning (hyperopt / hyperopt-loss) — testing thousands of combinations to find settings that would have performed best historically. Always confirm optimized settings on unseen data to avoid overfitting." },
  { q: "How do I protect my funds while bot trading?", a: "Use API keys with trading permission only (no withdrawals), enable 2FA on the exchange, start with tiny stake amounts, set stoploss on every strategy, and keep the bot on a machine you control — never hand your keys to anyone." },
]

const howItWorks = [
  "Install Freqtrade and download historical data for your pair.",
  "Pick a strategy and backtest it on past candles.",
  "Dry-run with fake money until it proves itself live.",
  "Go live with a small stake, Telegram control, and stoploss on.",
  "Optimize with machine learning, then re-verify on unseen data.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "Freqtrade — Crypto Trading Bot Guide (Educational)",
      description: "Step-by-step reference for Freqtrade: strategy backtesting, dry-run paper trading, Telegram control, and risk defense.",
      about: "Freqtrade crypto trading bot",
      educationalUse: 'Testing, education, and authorized use only',
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

export default function hackolution_freqtrade() {
  return (
    <ToolLayout
      title="Freqtrade — Crypto Trading Bot Guide"
      desc="Step-by-step Freqtrade reference: strategy backtesting, dry-run paper trading, Telegram control and risk defense. Educational use only."
      icon="🤖"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="finance"
      slug="hackolution/freqtrade"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://uptools.in/assets/logo/hackolution.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Learn it on the HACKOLUTION channel" subtitle="Watch the reel, then practice below">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 flex-wrap mt-1">
            <a href="https://www.instagram.com/hackolution" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline"
              style={{ background: 'linear-gradient(135deg,#f09433,#dc2743,#bc1888)', color: '#fff' }}>📸 Watch the Freqtrade reel</a>
            <a href="https://www.instagram.com/hackolution" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline bg-white/5 border border-white/10 text-slate-200 hover:text-white transition-all">📸 @hackolution</a>
          </div>
        </div>
      </Section>

      <WarningBox>
        Freqtrade is legitimate open-source software, but trading bots can lose real money fast. <b>Backtest and dry-run before staking anything, start tiny, use trade-only API keys (withdrawals off), and never invest more than you can afford to lose.</b> This page is for <b>educational purposes only, not financial advice</b>.
      </WarningBox>

      <Section id="overview" icon="🤖" title="What is Freqtrade?" subtitle="A bot that trades crypto for you">
        <p>
          <b>Freqtrade</b> is a free Python bot that buys and sells crypto automatically. You pick a strategy, it watches the market around the clock and places the orders — and you control everything from Telegram on your phone.
        </p>
        <p>
          With 50,000+ GitHub stars, 50+ supported exchanges, backtesting on historical data, and machine-learning optimization, it is the standard way developers learn algorithmic trading without staring at charts all day.
        </p>
        <FeatureGrid items={[
  { i: "🤖", t: "Auto trading", d: "Runs your strategy 24/7 on 50+ exchanges." },
  { i: "📊", t: "Backtesting", d: "Replay strategies on past data first." },
  { i: "📱", t: "Telegram control", d: "Alerts, profit and stop from your phone." },
  { i: "🧠", t: "ML optimization", d: "Auto-tune parameters with hyperopt." },
]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {["Python 3.11+ on your own machine or VPS", "An exchange account with API keys (trade-only, withdrawals OFF)", "A Telegram bot token for remote control", "Tiny test funds — never start with money you need"].map((t) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>☑️</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One script to install">
        <CodeBlock title="terminal" lines={`git clone https://github.com/freqtrade/freqtrade.git
cd freqtrade
./setup.sh`} />
        <InfoBox title="Docker works too">
          Prefer containers? Freqtrade ships official Docker images — same bot, no local Python setup. Either way, configure trade-only API keys before the first run.
        </InfoBox>
      </Section>

      <Section id="backtest" icon="📊" title="Step 1 — Backtest a Strategy" subtitle="Prove it on past data">
        <p className="text-xs text-slate-400">Download candles, then replay a strategy on history:</p>
        <CodeBlock title="terminal" lines={`freqtrade download-data --exchange binance -p BTC/USDT --timeframes 5m
freqtrade backtesting --strategy SampleStrategy`} />
        <InfoBox title="Read the report">
          Check profit, drawdown and win rate in the backtest table. A strategy that loses on history will lose with real money — fix it here, not live.
        </InfoBox>
      </Section>

      <Section id="dryrun" icon="🧪" title="Step 2 — Dry-Run With Fake Money" subtitle="Paper trade the live market">
        <p className="text-xs text-slate-400">Run the live bot with fake stake before going real:</p>
        <CodeBlock title="terminal" lines={`freqtrade trade --dry-run --strategy SampleStrategy
# watches real prices, logs trades it WOULD take`} />
        <InfoBox title="Let it run">
          Dry-run for days, not minutes — live spreads, fees and slippage differ from backtests. Only go real after sustained paper profit.
        </InfoBox>
      </Section>

      <Section id="live" icon="🚀" title="Step 3 — Go Live Small" subtitle="Real money, tight limits">
        <p className="text-xs text-slate-400">Small stake, stoploss always on, Telegram watching:</p>
        <CodeBlock title="terminal" lines={`# config.json: stake_amount small, stoploss set, dry_run false
freqtrade trade --strategy SampleStrategy
# /profit and /status from your phone`} />
        <InfoBox title="Guardrails first">
          Trade-only API keys, 2FA on the exchange, stoploss on every strategy. Scale the stake only after weeks of live profit.
        </InfoBox>
      </Section>

      <Section id="optimize" icon="🧠" title="Step 4 — Optimize With ML" subtitle="Auto-tune, then verify">
        <p className="text-xs text-slate-400">Let machine learning search thousands of settings:</p>
        <CodeBlock title="terminal" lines={`freqtrade hyperopt --strategy SampleStrategy --hyperopt-loss SharpeHyperOptLoss`} />
        <InfoBox title="Beware overfitting">
          Optimized settings can memorize the past and fail the future. Always confirm on unseen data (a fresh date range) before trusting them live.
        </InfoBox>
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Protect Your Funds" subtitle="Bots attract scammers">
        <CodeBlock title="terminal" lines={`# config.json essentials
"dry_run": true, "stake_amount": 20, "stoploss": -0.10`} />
        <FeatureGrid items={[
  { i: "🔑", t: "Trade-only keys", d: "API keys with withdrawals disabled." },
  { i: "🛑", t: "Stoploss always", d: "Cap every trade's worst case." },
  { i: "🐟", t: "Ignore bot sellers", d: "Nobody sells a profitable bot — scams." },
  { i: "📱", t: "Watch Telegram", d: "Alerts on every fill and error." },
]} />
      </Section>

      <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[["download-data", "Fetch historical candles for backtests."], ["backtesting", "Replay a strategy on past data."], ["--dry-run", "Paper trade live prices with fake money."], ["--strategy", "Which strategy file the bot runs."], ["hyperopt", "ML-search the best strategy settings."], ["--stoploss", "Auto-exit a trade past this loss."], ["--stake-amount", "Max money risked per trade."], ["Telegram /profit", "Check profit from your phone."]].map(([flag, desc]) => (
            <div key={flag} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="text-sm font-semibold text-green-300 font-mono mb-1">{flag}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          {[["Bot buys but never sells", "Your sell conditions or ROI table never trigger — check minimal_roi and stoploss in config, and confirm the strategy has sell signals on your timeframe."], ["Backtest great, live loses", "Overfitting plus fees/slippage. Re-test on unseen dates, include trading fees in config, and dry-run before going real."], ["Exchange rejects orders", "Stake too small for the pair minimum, or wrong market type (spot vs futures). Raise stake_amount above the exchange minimum."], ["Telegram commands silent", "Wrong bot token or chat id in config, or the bot never started polling. Re-check token, chat_id, and restart the bot."]].map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[["📚", "Official Freqtrade docs", "https://www.freqtrade.io/"], ["💻", "Freqtrade GitHub", "https://github.com/freqtrade/freqtrade"], ["📸", "HACKOLUTION Instagram", "https://www.instagram.com/hackolution"]].map(([i, label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 border border-white/8 hover:border-brand/40 hover:bg-white/5 transition-all text-slate-300 hover:text-white no-underline">
              <span>{i}</span>
              <span className="text-sm font-medium">{label}</span>
              <span className="ml-auto text-indigo-300 text-xs font-mono break-all">{href}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you run anything">
        <p>
          This documentation is provided <b>strictly for educational purposes and is not financial advice</b>. Trading bots can lose money; backtest and dry-run first, use trade-only API keys, and never stake funds you cannot afford to lose. The author and this site are not responsible for any losses or misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
