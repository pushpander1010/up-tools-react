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
    q: 'What is a call option in simple words?',
    a: 'A call option is a contract that gives you the RIGHT (not obligation) to buy a stock at a fixed price (strike) before a fixed date (expiry). You pay a small premium for this right. If the stock jumps above strike + premium, you profit. If not, you only lose the premium.',
  },
  {
    q: 'When do call options make money?',
    a: 'When the stock price at (or before) expiry is ABOVE strike price + premium paid. Example: strike 100, premium 5. Stock at 112 → profit 7 per share (112 - 100 - 5). The higher the stock goes, the more you earn — upside is unlimited.',
  },
  {
    q: 'What is the maximum loss on a call option?',
    a: 'Just the premium you paid. If the stock stays below the strike, the call expires worthless and you lose only the premium. This defined risk is why traders love calls for betting on upside without owning expensive stock.',
  },
  {
    q: 'Call option vs buying stock — which is better?',
    a: 'Calls need far less capital (premium vs full share price) and cap your loss at the premium. But they decay with time (theta) and expire. Buying stock has no expiry and no decay but needs full capital and carries full downside. Use calls for short-term directional bets with leverage.',
  },
  {
    q: 'What are strike price, premium and expiry?',
    a: 'Strike = the fixed price you can buy at. Premium = the price you pay for the option contract. Expiry = the last date the contract is valid. Pick strikes near the current price (ATM) for balance, and expiries 30-60 days out so time decay hurts less.',
  },
  {
    q: 'How do algo traders scan for call opportunities?',
    a: 'Bots scan for: (1) unusual call volume vs open interest, (2) implied volatility rank under 50 (cheap premium), (3) price above VWAP + rising momentum, (4) days-to-expiry 30-60. The Python scanner on this page implements exactly these four filters.',
  },
]

const howItWorks = [
  'Learn the call: right to buy at strike before expiry, premium is your max loss.',
  'Pick strike + expiry: near-the-money strikes, 30-60 days out to beat time decay.',
  'Check the math: profit needs stock above strike + premium at expiry.',
  'Scan like an algo: unusual call volume, cheap IV, price above VWAP.',
  'Paper-trade first, risk only 1-2% per trade, never hold into expiry week blindly.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Call Options Explained — Profit From Rising Stocks With Limited Risk',
      description: 'What is a call option: strike, premium, expiry, breakeven math, when calls profit, max loss = premium, plus a Python call scanner with unusual-volume and IV-rank filters.',
      about: 'Call Options Trading Guide',
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

export default function aiforrich_call_options() {
  return (
    <ToolLayout
      title="Call Options Explained — Profit From Rising Stocks With Limited Risk"
      desc="What is a call option? Strike, premium, expiry, breakeven math and a Python call scanner with unusual-volume + IV-rank filters. Comment LINK on the @aiforrich reel for the free cheat sheet."
      icon="📈"
      iconBg="linear-gradient(135deg, rgba(52,211,153,0.18), rgba(6,182,212,0.08))"
      category="finance"
      slug="aiforrich/call-options"
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
              <div className="text-4xl mb-2">📈</div>
              <span className="text-xs font-bold text-emerald-300">Call Options</span>
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
                &ldquo;Buying a stock is costly — a call option is cheaper. It gives you the right to buy at a fixed price before expiry. If the price jumps, you profit without owning the stock. Above strike plus premium you earn, upside unlimited. Below the strike it expires worthless, but you only ever lose the premium.&rdquo;
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
        This options guide is <b>strictly for educational purposes</b> and does <b>not constitute financial or investment advice</b>.
        Options trading involves substantial risk including total loss of premium. Paper-trade and understand every line of code before trading real money.
      </WarningBox>

      {/* Overview */}
      <Section id="overview" icon="📊" title="What Is a Call Option?" subtitle="Upside exposure without owning the stock">
        <p className="m-0">
          A <b className="text-white">call option</b> is a contract that gives you the <b className="text-white">right to buy</b> a
          stock at a fixed <b className="text-white">strike price</b> any time before <b className="text-white">expiry</b>.
          You pay a small <b className="text-white">premium</b> for that right. If the stock rockets, you buy cheap at the
          strike and pocket the difference. If it goes nowhere, the contract expires worthless — and your loss is capped
          at the premium. That asymmetry (unlimited upside, fixed downside) is the whole appeal.
        </p>
        <FeatureGrid items={[
          { i: '🎯', t: 'Strike Price', d: 'The fixed price you can buy at, no matter how high the stock goes.' },
          { i: '🎟️', t: 'Premium', d: 'What you pay for the contract — also your maximum possible loss.' },
          { i: '📅', t: 'Expiry', d: 'The deadline. After this date the contract is worth zero.' },
          { i: '⚖️', t: 'Breakeven', d: 'Strike + premium. Stock must cross this for you to profit.' },
        ]} />
      </Section>

      {/* How it works */}
      <Section id="how-it-works" icon="⚙️" title="How a Call Works, Step by Step" subtitle="Follow one contract from buy to profit">
        <div className="space-y-3">
          <StepRow num="1" title="Pay the premium, pick strike + expiry"
            body="Example: NIFTY at 24,000. You buy a 24,200 call expiring in 30 days for ₹80 premium. Total cost = 80 × lot size. That is your max loss." />
          <StepRow num="2" title="Stock rises above the strike"
            body="NIFTY jumps to 24,500. Your right to buy at 24,200 is now worth 300 intrinsically (24,500 − 24,200). The contract reprices upward." />
          <StepRow num="3" title="Sell the contract (or exercise) for profit"
            body="Sell the call for ~₹290. Profit = 290 − 80 = ₹210 per share × lot size. You never owned the stock — you rented the upside for ₹80." />
          <StepRow num="4" title="If wrong, walk away cheap"
            body="NIFTY stays at 23,900. The 24,200 call expires at zero. Loss = ₹80 premium only — versus thousands lost holding falling stock." />
        </div>
        <InfoBox title="The one-line math">
          Profit at expiry = max(0, Stock − Strike) − Premium. You need Stock &gt; Strike + Premium to make money. Everything else is commentary.
        </InfoBox>
      </Section>

      {/* Payoff */}
      <Section id="payoff" icon="📉" title="Call Payoff: Limited Loss, Unlimited Gain" subtitle="Why the risk curve is asymmetric">
        <FeatureGrid items={[
          { i: '📈', t: 'Stock soars', d: 'Profit grows ₹1-for-₹1 with the stock above breakeven. No ceiling.' },
          { i: '➖', t: 'Stock flat', d: 'Contract bleeds value daily (theta decay). Sell before expiry week.' },
          { i: '🛡️', t: 'Stock crashes', d: 'You lose only the premium. The stock owner loses the full fall.' },
          { i: '⏳', t: 'Time decay', d: 'Every passing day eats premium. Buy 30-60 days out, exit with 2+ weeks left.' },
        ]} />
        <DoDont
          good={['Buy calls when IV rank is low (cheap premium)', 'Risk only 1-2% of capital per trade', 'Take profit at +50-100%, don\'t marry the position', 'Exit 2 weeks before expiry to dodge decay']}
          bad={['Buying weekly expiry calls on hype (decay kills you)', 'Averaging down on a dying option', 'Holding through binary events without a hedge', 'Risking rent money on leveraged contracts']}
        />
      </Section>

      {/* Code */}
      <Section id="code" icon="💻" title="Call Scanner Code — Python + Pine Script" subtitle="Copy-paste: unusual call volume + cheap IV + momentum filter">
        <CodeTabs tabs={[
          {
            lang: 'Python', icon: '🐍', title: 'call_scanner.py',
            desc: 'Scans option chains for calls with unusual volume, cheap implied volatility and price above VWAP. Plug in your broker or Yahoo data feed.',
            lines: [
              '# Call option scanner: unusual volume + cheap IV + momentum',
              '# pip install yfinance pandas',
              'import yfinance as yf, pandas as pd',
              '',
              'SYMBOLS = ["RELIANCE.NS", "INFY.NS", "NIFTY"]  # edit your list',
              'MIN_DTE, MAX_DTE = 30, 60      # avoid weekly decay trap',
              'MAX_IV_RANK = 50               # only cheap premium',
              'VOL_MULT = 1.5                 # unusual-volume threshold',
              '',
              'def vwap(df):',
              '    pv = ((df["High"] + df["Low"] + df["Close"]) / 3) * df["Volume"]',
              '    return (pv.cumsum() / df["Volume"].cumsum()).iloc[-1]',
              '',
              'def scan(symbol):',
              '    t = yf.Ticker(symbol)',
              '    px = t.history(period="5d")["Close"].iloc[-1]',
              '    out = []',
              '    for exp in t.options:',
              '        chain = t.option_chain(exp).calls',
              '        dte = (pd.Timestamp(exp) - pd.Timestamp.now()).days',
              '        if not (MIN_DTE <= dte <= MAX_DTE): continue',
              '        for _, r in chain.iterrows():',
              '            oi = r.get("openInterest", 0) or 0',
              '            vol = r.get("volume", 0) or 0',
              '            iv = r.get("impliedVolatility", 1) or 1',
              '            # ATM/near-ATM only: strike within 3% of price',
              '            if abs(r["strike"] - px) / px > 0.03: continue',
              '            unusual = vol > VOL_MULT * max(oi, 1)',
              '            cheap = iv * 100 < MAX_IV_RANK',
              '            if unusual and cheap:',
              '                out.append((symbol, exp, r["strike"], round(iv*100,1), vol, oi))',
              '    return sorted(out, key=lambda x: x[4], reverse=True)',
              '',
              'for s in SYMBOLS:',
              '    for row in scan(s)[:5]:',
              '        print(f"{row[0]} {row[1]} strike={row[2]} iv={row[3]}% vol={row[4]} oi={row[5]}")',
            ].join('\n'),
          },
          {
            lang: 'Pine Script', icon: '🌲', title: 'call_scanner.pine',
            desc: 'TradingView v5: flags bars where call-like momentum + volume expansion suggest upside entry. Use as alert source for the Python bridge.',
            lines: [
              '//@version=5',
              'indicator("AIFORRich Call Momentum", overlay=true)',
              'fastLen = input.int(20, "Fast EMA")',
              'slowLen = input.int(50, "Slow EMA")',
              'volMult = input.float(1.5, "Volume multiple")',
              'fast = ta.ema(close, fastLen)',
              'slow = ta.ema(close, slowLen)',
              'volX = volume > ta.sma(volume, 20) * volMult',
              'bull = ta.crossover(fast, slow) and volX',
              'plotshape(bull, title="Call signal", style=shape.triangleup,',
              '     location=location.belowbar, color=color.green, size=size.small)',
              'alertcondition(bull, title="Call momentum", message="CALL momentum {{ticker}}")',
            ].join('\n'),
          },
          {
            lang: 'Java', icon: '☕', title: 'CallScanner.java',
            desc: 'Java port of the same three filters for JVM-based execution stacks.',
            lines: [
              'import java.util.*;',
              'public class CallScanner {',
              '  record Call(String sym, String exp, double strike, double iv, long vol, long oi) {}',
              '  static final double VOL_MULT = 1.5, MAX_IV = 50.0;',
              '  public static List<Call> scan(List<Call> chain, double spot) {',
              '    List<Call> hits = new ArrayList<>();',
              '    for (Call c : chain) {',
              '      if (Math.abs(c.strike - spot) / spot > 0.03) continue;',
              '      boolean unusual = c.vol > VOL_MULT * Math.max(c.oi, 1);',
              '      if (unusual && c.iv < MAX_IV) hits.add(c);',
              '    }',
              '    hits.sort((a, b) -> Long.compare(b.vol, a.vol));',
              '    return hits;',
              '  }',
              '}',
            ].join('\n'),
          },
          {
            lang: 'C++', icon: '⚙️', title: 'call_scanner.cpp',
            desc: 'C++ port for low-latency HFT-adjacent scanning loops.',
            lines: [
              '#include <vector> #include <string> #include <algorithm> #include <cmath>',
              'struct Call { std::string sym, exp; double strike, iv; long vol, oi; };',
              'std::vector<Call> scan(const std::vector<Call>& chain, double spot) {',
              '  std::vector<Call> hits;',
              '  for (auto& c : chain) {',
              '    if (std::fabs(c.strike - spot) / spot > 0.03) continue;',
              '    if (c.vol > 1.5 * std::max<long>(c.oi, 1) && c.iv < 50.0) hits.push_back(c);',
              '  }',
              '  std::sort(hits.begin(), hits.end(),',
              '    [](auto& a, auto& b){ return a.vol > b.vol; });',
              '  return hits;',
              '}',
            ].join('\n'),
          },
        ]} />
        <InfoBox title="How to use this scanner">
          Run it daily 30-60 DTE. Sort by volume, check IV rank under 50, confirm price above VWAP on the chart, then paper-trade the top 3 hits with a 1% risk cap before ever going live.
        </InfoBox>
      </Section>

      {/* CTA */}
      <Section id="free-guide" icon="🎁" title="Free Call Options Cheat Sheet + Scanner" subtitle="Comment LINK on the reel">
        <p className="m-0">
          Want the one-page call options cheat sheet (strike selection, breakeven math, expiry rules) plus this scanner code?
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
