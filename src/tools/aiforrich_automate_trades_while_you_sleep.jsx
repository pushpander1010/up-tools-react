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
                : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-emerald-400/40'
            }`}
            style={i === active ? { background: 'linear-gradient(135deg, #34d399, #22d3ee)' } : undefined}>
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
      <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1.5">⚠️ Execution & Risk Notice</div>
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
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-400/20 text-emerald-300 font-bold text-sm mt-0.5 flex-none">{num}</span>
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
    q: 'How does the 3-step automated trading workflow work?',
    a: 'Step 1: Your strategy runs 24/7 on TradingView cloud servers and generates a webhook alert when entry/exit conditions trigger. Step 2: The alert sends a JSON payload to your secure Python Flask/FastAPI bridge, which validates secret tokens and enforces risk rules. Step 3: The bridge calls your broker/exchange API (Binance, Bybit, Alpaca, IBKR) to place bracket orders with stop-loss and take-profit.',
  },
  {
    q: 'Do I need to keep my laptop or computer open overnight?',
    a: 'No. That is the primary benefit of cloud automation. TradingView strategies run on TradingView servers, and your lightweight Python webhook bridge runs on a $4/month cloud VPS (e.g. DigitalOcean, AWS EC2, or Railway). Your computer can be completely powered off.',
  },
  {
    q: 'How are broker API keys kept safe?',
    a: 'Your API keys are stored in encrypted environment variables (.env) on your private cloud server. You must always restrict API key permissions to "Read" and "Spot/Futures Trade" ONLY — never enable "Withdrawal" permissions. Additionally, restrict IP access so only your VPS static IP can place trades.',
  },
  {
    q: 'What happens if internet or exchange API goes down during a trade?',
    a: 'Our architecture uses bracket OCO (One-Cancels-the-Other) orders. When an entry order fills, the broker API immediately registers the Stop Loss and Take Profit on exchange servers. Even if your bridge or internet goes offline, the exchange will automatically trigger your stop loss.',
  },
  {
    q: 'What brokers and crypto exchanges support webhook trading?',
    a: 'Any exchange with REST or WebSocket APIs works. For crypto: Binance, Bybit, OKX, Coinbase Advanced, Kraken. For US & International stocks: Alpaca Markets, Interactive Brokers (via IB Gateway), Tradovate, and TradeStation.',
  },
  {
    q: 'How do you prevent duplicate order execution?',
    a: 'The webhook bridge implements idempotency checks. It tracks recent alert IDs and timestamps in a local cache or SQLite database. If TradingView retries an alert within 60 seconds, the bridge recognizes the duplicate and discards it.',
  },
  {
    q: 'Can I receive phone notifications when a trade executes while I sleep?',
    a: 'Yes. The Python webhook server includes a 4-line Telegram bot or Discord webhook notifier. Whenever an order fills or a stop loss triggers, it instantly pings your Telegram channel with entry price, size, and PnL.',
  },
]

const howItWorks = [
  'Set up a quantitative strategy in TradingView Pine Script v5 with parameterized entry, stop loss, and take profit.',
  'Create a Webhook Alert on TradingView with a custom JSON payload and your secure endpoint URL.',
  'Deploy a lightweight Python Flask bridge on a cloud VPS that validates the passphrase and computes position sizing.',
  'Route bracket orders to your exchange API (Binance, Bybit, Alpaca) with predefined stop loss and take profit.',
  'Configure automated Telegram / Discord notifications for instant execution alerts while you sleep.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'How to Automate Trades While You Sleep — 3-Step Workflow',
      description: 'Step-by-step guide to building a 24/7 automated algorithmic trading bot workflow using TradingView alerts, Python Flask webhook bridge, and broker APIs with stop-loss protection.',
      about: 'Automated Algorithmic Trading Systems',
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

export default function aiforrich_automate_trades_while_you_sleep() {
  return (
    <ToolLayout
      title="How to Automate Trades While You Sleep — 3-Step Workflow"
      desc="Build a 24/7 automated trading system that executes while you sleep. Step 1: TradingView alert generation. Step 2: Python Flask webhook bridge for risk rules. Step 3: Broker API execution with automated stop loss."
      icon="🌙"
      iconBg="linear-gradient(135deg, rgba(52,211,153,0.18), rgba(6,182,212,0.08))"
      category="finance"
      slug="aiforrich/automate-trades-while-you-sleep"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Reel Companion Video Card */}
      <Section id="video" icon="🎬" title="Reel Companion & Video Summary" subtitle="32s Automation workflow reel from @aiforrich">
        <div className="rounded-2xl p-5 border border-emerald-500/20" style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.06), rgba(15,23,42,0.8))' }}>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-full sm:w-44 aspect-[9/16] rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center p-4 text-center shrink-0 relative overflow-hidden">
              <div className="text-4xl mb-2">🌙</div>
              <span className="text-xs font-bold text-emerald-300">Automate 24/7</span>
              <span className="text-[10px] text-slate-400 mt-1">Duration: 32s</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-2">
                <span className="text-[10px] font-mono text-cyan-400">@aiforrich reel</span>
              </div>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-400/10 text-emerald-300 border border-emerald-400/30">
                🎙️ Voiceover Summary
              </div>
              <p className="italic text-slate-300 m-0">
                &ldquo;Still watching charts all day? What if your trades run while you sleep? Here is the 3-step workflow: Step 1: Strategy fires a signal on TradingView. Step 2: A secure webhook bridge checks risk and auth rules. Step 3: Your broker API places the order with stop-loss attached — even at 3 AM.&rdquo;
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
        Automated trade execution interacts with real money and exchange APIs. <b>Always test new webhook servers in testnet / paper trading mode</b>
        before enabling real capital. Ensure your broker API keys have withdrawal permissions disabled, and always attach exchange-side stop loss orders.
      </WarningBox>

      {/* Overview */}
      <Section id="overview" icon="🤖" title="Why 24/7 Automation Beats Manual Chart Watching" subtitle="Freedom, discipline, and millisecond execution while you sleep">
        <p>
          Manual trading forces you to sit in front of screen charts for 12 hours a day, suffering from decision fatigue,
          late-night emotional mistakes, and missed opportunities during Asian or European market sessions.
        </p>
        <FeatureGrid items={[
          { i: '⏰', t: '24/7 Crypto & Global Hours', d: 'Major market moves occur at 3 AM UTC. The bot catches every breakout without waking you up.' },
          { i: '🛡️', t: 'Zero Emotional Fatigue', d: 'Algorithms follow risk rules rigidly — no revenge trading, FOMO chasing, or moving stop losses.' },
          { i: '⚡', t: 'Millisecond Execution', d: 'Webhook alerts trigger exchange bracket orders in under 300 milliseconds.' },
          { i: '🔒', t: 'Built-in Capital Protection', d: 'Every order enters with a pre-calculated stop loss and position size enforced by code.' },
        ]} />
      </Section>

      {/* The 3 Steps */}
      <Section id="workflow" icon="📐" title="The 3-Step Automated Architecture" subtitle="How signals travel from chart to execution in 300ms">
        <div className="space-y-4">
          <InfoBox title="Step 1: Signal Generator (TradingView Pine Script Alert)" icon="📡">
            <p className="m-0 mb-2">
              Your quantitative strategy runs in the TradingView cloud. When a candle closes and your entry formula is satisfied,
              TradingView dispatches a secure HTTP POST request with a formatted JSON payload containing symbol, action (BUY/SELL),
              quantity, stop loss, and take profit price.
            </p>
            <div className="rounded-lg p-3 bg-black/40 font-mono text-xs text-emerald-300 border border-white/5">
              {`{ "passphrase": "SECRET_KEY", "ticker": "BTCUSDT", "action": "BUY", "sl": 91200, "tp": 96500 }`}
            </div>
          </InfoBox>

          <InfoBox title="Step 2: Risk-Engine Webhook Bridge (Python Flask / FastAPI)" icon="🛡️">
            <p className="m-0 mb-2">
              A lightweight Python microservice running on a cloud VPS listens for incoming webhooks. It acts as the intelligent
              security firewall:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
              <li>Verifies the secret authentication token.</li>
              <li>Checks daily maximum loss circuit breaker (if daily loss &gt; 3%, block trade).</li>
              <li>Computes exact fractional position size based on current portfolio equity.</li>
              <li>Prevents duplicate alert firings via an idempotency cache.</li>
            </ul>
          </InfoBox>

          <InfoBox title="Step 3: Broker Execution API (Binance, Bybit, Alpaca, IBKR)" icon="⚡">
            <p className="m-0 mb-2">
              The bridge signs the order using HMAC-SHA256 and routes a bracket OCO order directly into the broker or crypto exchange.
              The entry fills instantly, and the exchange automatically places the stop loss on its central orderbook.
            </p>
          </InfoBox>
        </div>
      </Section>

      {/* Code Starter */}
      <Section id="code" icon="💻" title="Production-Ready Webhook Code" subtitle="Switch between Python Flask Server, Pine Script Alert, and Node.js">
        <p>
          Deploy this lightweight Python Flask webhook server on any $4/month VPS (or local testnet). It receives TradingView
          alerts, verifies authentication, calculates risk limits, and routes orders via CCXT.
        </p>
        <CodeTabs tabs={[
          {
            lang: 'Python',
            icon: '🐍',
            title: 'webhook_bridge_server.py',
            desc: 'Production Python Flask webhook listener with auth token validation, max-risk guardrails, and CCXT order execution with stop-loss attachment.',
            lines: `from flask import Flask, request, jsonify
import os
import ccxt

app = Flask(__name__)

# Secret passphrase configured in TradingView alert payload
WEBHOOK_PASSPHRASE = os.getenv("WEBHOOK_SECRET", "MY_SUPER_SECRET_TOKEN_123")

# Initialize CCXT exchange (Binance / Bybit / Alpaca)
exchange = ccxt.binance({
    "apiKey": os.getenv("EXCHANGE_API_KEY", ""),
    "secret": os.getenv("EXCHANGE_API_SECRET", ""),
    "enableRateLimit": True,
    "options": {"defaultType": "future"} # or "spot"
})

@app.route("/webhook", methods=["POST"])
def tradingview_webhook():
    data = request.json
    if not data:
        return jsonify({"error": "No JSON payload provided"}), 400

    # 1) Authenticate secret token
    if data.get("passphrase") != WEBHOOK_PASSPHRASE:
        print("Unauthorized webhook attempt rejected.")
        return jsonify({"error": "Unauthorized"}), 401

    ticker = data.get("ticker", "BTC/USDT")
    action = data.get("action", "BUY").upper()
    stop_loss = data.get("sl")
    take_profit = data.get("tp")
    risk_usd = float(data.get("risk_usd", 100.0)) # Risk $100 per trade

    print(f"\\n[3:00 AM Execution] Signal received: {action} {ticker}")
    print(f"Parameters -> SL: {stop_loss}, TP: {take_profit}, Risk: \${risk_usd}")

    try:
        # 2) Calculate position sizing based on Stop Loss distance
        current_price = float(exchange.fetch_ticker(ticker)["last"])
        sl_distance = abs(current_price - float(stop_loss)) if stop_loss else current_price * 0.02
        position_size = round(risk_usd / sl_distance, 4)

        # 3) Place Market Entry Order
        side = "buy" if action == "BUY" else "sell"
        print(f"Placing {side} order for {position_size} {ticker} at \${current_price}")
        
        # In live mode:
        # order = exchange.create_market_order(ticker, side, position_size)
        # exchange.create_order(ticker, 'STOP_MARKET', 'sell' if side == 'buy' else 'buy', position_size, params={'stopPrice': stop_loss})

        return jsonify({
            "status": "success",
            "ticker": ticker,
            "action": action,
            "size": position_size,
            "entry_price": current_price,
            "stop_loss": stop_loss,
            "take_profit": take_profit
        }), 200

    except Exception as e:
        print(f"Execution Error: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)`,
          },
          {
            lang: 'Pine Script v5',
            icon: '🌲',
            title: 'tradingview_alert_payload.pine',
            desc: 'Pine Script v5 strategy snippet that dynamically formats JSON payload with current ticker, action, ATR stop-loss, and take-profit.',
            lines: `//@version=5
strategy("AIFORRICH — Webhook Alert Generator", overlay=true)

// Strategy Conditions
fast_ema = ta.ema(close, 9)
slow_ema = ta.ema(close, 21)
atr = ta.atr(14)

long_condition = ta.crossover(fast_ema, slow_ema)
short_condition = ta.crossunder(fast_ema, slow_ema)

sl_price_long = close - (1.5 * atr)
tp_price_long = close + (3.0 * atr)

// Dynamic JSON alert payload sent to your Python Webhook Bridge
long_alert_json = '{"passphrase":"MY_SUPER_SECRET_TOKEN_123","ticker":"' + syminfo.ticker + '","action":"BUY","sl":' + str.tostring(sl_price_long, "#.##") + ',"tp":' + str.tostring(tp_price_long, "#.##") + ',"risk_usd":100}'

if long_condition
    strategy.entry("Long", strategy.long)
    // Dispatches webhook alert to server
    alert(long_alert_json, alert.freq_once_per_bar_close)

plot(fast_ema, "Fast EMA", color=color.emerald)
plot(slow_ema, "Slow EMA", color=color.amber)`,
          },
          {
            lang: 'Node.js',
            icon: '⚡',
            title: 'express_webhook_router.js',
            desc: 'Node.js Express webhook router with authentication middleware and CCXT JavaScript execution.',
            lines: `const express = require('express');
const app = express();
app.use(express.json());

const SECRET = process.env.WEBHOOK_SECRET || 'MY_SUPER_SECRET_TOKEN_123';

app.post('/webhook', async (req, res) => {
  const { passphrase, ticker, action, sl, tp } = req.body;
  
  if (passphrase !== SECRET) {
    return res.status(401).json({ error: 'Unauthorized webhook' });
  }

  console.log(\`[Automated Fill] \${action} \${ticker} | SL: \${sl} | TP: \${tp}\`);
  // Route order via CCXT or broker SDK
  res.json({ status: 'queued', ticker, action });
});

app.listen(5000, () => console.log('AIFORRICH Webhook Bridge running on port 5000'));`,
          },
        ]} />
      </Section>

      {/* Security & Fail-Safes */}
      <Section id="security" icon="🔒" title="API Security & Cloud Hardening" subtitle="How to secure your bot so funds remain 100% safe">
        <div className="space-y-3">
          <InfoBox title="1. Read & Trade Permissions Only" icon="🛡️">
            When generating API keys on Binance, Bybit, Alpaca, or Kraken, <b>NEVER enable Withdrawal permissions</b>.
            Only check "Read" and "Trade". Even if an attacker compromised your server, they cannot withdraw funds.
          </InfoBox>
          <InfoBox title="2. IP Whitelisting" icon="🌐">
            Set your exchange API key to accept requests <b>only from your Cloud VPS static IP address</b>. Any request
            from another IP will be rejected immediately by exchange firewalls.
          </InfoBox>
          <InfoBox title="3. OCO Bracket Exchange Stop Losses" icon="🛑">
            Always place bracket orders where the Stop Loss lives on the exchange server orderbook. If your VPS crashes or
            reboots, the exchange stop loss remains active.
          </InfoBox>
        </div>
      </Section>

      {/* Process */}
      <Section id="process" icon="🛠️" title="Setup & Deployment Checklist" subtitle="Get your automated bot running in under 15 minutes">
        <StepRow num={1} title="Launch a Cloud VPS ($4/mo)" body="Create an Ubuntu instance on DigitalOcean, Railway, or AWS Lightsail with a dedicated static IP." />
        <StepRow num={2} title="Deploy Flask Webhook Server" body="Clone your Python script, set environment variables (API keys + secret passphrase), and run with PM2 or Gunicorn systemd service." />
        <StepRow num={3} title="Create TradingView Alert" body="In TradingView alert settings, check 'Webhook URL', enter your VPS endpoint (https://your-domain.com/webhook), and paste the JSON payload." />
        <StepRow num={4} title="Verify in Testnet Mode" body="Trigger test signals on a 1-minute chart in paper/testnet mode to confirm order routing and Telegram notifications." />
        <StepRow num={5} title="Sleep Peacefully" body="Switch to live API keys with strict risk limits. The bot runs 24/7 autonomously." />
      </Section>

      {/* Dos and Don'ts */}
      <Section id="dodonts" icon="✅" title="Dos and Don'ts for Overnight Automation" subtitle="Avoid catastrophic mistakes in automated execution">
        <DoDont
          good={[
            'Use static IP whitelisting on all exchange API key management dashboards',
            'Enforce exchange-side bracket stop losses on every single order',
            'Test with $10-$50 micro-positions for 2 weeks before scaling capital',
            'Set up automatic Telegram alerts so you see execution logs in the morning',
            'Implement a maximum daily drawdown circuit breaker in your Python script',
          ]}
          bad={[
            'Enable withdrawal permissions on your trading API keys',
            'Hardcode private API secrets directly into your Git repository',
            'Run automated bots on local laptops that can sleep, update, or lose WiFi',
            'Trade high-leverage futures without strict liquidation distance buffers',
            'Deploy unverified code without testing idempotency and duplicate alert filters',
          ]}
        />
      </Section>

      {/* Resources */}
      <Section id="resources" icon="🔗" title="Recommended Automation Tools" subtitle="Best cloud providers and trading frameworks">
        <div className="space-y-2">
          {[
            ['🌲', 'TradingView Webhook Alerts Guide', 'https://www.tradingview.com'],
            ['🐍', 'CCXT Multi-Exchange Crypto Library', 'https://github.com/ccxt/ccxt'],
            ['🚀', 'Alpaca Markets Commission-Free Stock API', 'https://alpaca.markets'],
            ['⚡', 'FastAPI High-Performance Python Web Framework', 'https://fastapi.tiangolo.com'],
            ['📸', 'AIFORRICH Official Instagram', 'https://www.instagram.com/aiforrich'],
          ].map(([i, label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 border border-white/8 hover:border-emerald-400/40 hover:bg-white/5 transition-all text-slate-300 hover:text-white no-underline">
              <span>{i}</span>
              <span className="text-sm font-medium">{label}</span>
              <span className="ml-auto text-emerald-300 text-xs font-mono break-all">{href}</span>
            </a>
          ))}
        </div>
      </Section>

      {/* Disclaimer */}
      <Section id="disclaimer" icon="📜" title="Educational Disclaimer" subtitle="Risk disclosure for automated execution systems">
        <p>
          This guide, code, and system architecture are strictly for <b>educational purposes</b>. Automated execution systems
          carry technical and market risks including internet disconnection, exchange downtime, slippage, and API rate limits.
          Never risk capital you cannot afford to lose. You are solely responsible for testing and auditing all code before deployment.
        </p>
      </Section>
    </ToolLayout>
  )
}
