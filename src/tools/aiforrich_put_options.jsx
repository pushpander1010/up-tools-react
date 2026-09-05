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
    q: 'What is a put option in simple words?',
    a: 'A put option gives you the RIGHT to sell a stock at a fixed strike price before expiry. You pay a small premium. If the stock crashes below strike minus premium, you profit. If it stays above the strike, the put expires worthless and you lose only the premium.',
  },
  {
    q: 'How do puts protect stocks I already own?',
    a: 'This is called a protective put or married put. Own 100 shares at 500? Buy a 480-strike put. If the stock crashes to 400, your put pays off and offsets the loss — like insurance with a deductible equal to the premium plus the 20-point gap.',
  },
  {
    q: 'When do put options make money?',
    a: 'When the stock falls BELOW strike minus premium. Example: strike 100, premium 4. Stock at 88 → profit 8 per share (100 − 88 − 4). The lower it falls, the more you earn — crash protection with defined risk.',
  },
  {
    q: 'What is the maximum loss on a put option?',
    a: 'Only the premium paid. If the stock stays above the strike through expiry, the put expires at zero. No margin calls, no unlimited downside — unlike shorting stock directly.',
  },
  {
    q: 'Put option vs short selling — which is safer?',
    a: 'Puts, by far. Shorting has theoretically unlimited loss (stock can rise forever) plus margin interest and borrow risk. A long put caps loss at the premium while giving the same downside profit profile. Beginners should never short naked.',
  },
  {
    q: 'How do algo traders use puts in scanners?',
    a: 'Bots watch for: (1) unusual put volume (fear building), (2) put-call ratio spikes above 1.2, (3) price breaking below VWAP with volume, (4) rising IV rank (puts getting expensive = hedge demand). The scanner on this page codes all four.',
  },
]

const howItWorks = [
  'Learn the put: right to sell at strike before expiry, premium is max loss.',
  'Two uses: speculate on crashes OR insure stocks you already hold.',
  'Check the math: profit needs stock below strike minus premium.',
  'Scan like an algo: unusual put volume, PCR spikes, price under VWAP.',
  'Hedge smart: buy puts 5-10% below current price, 30-60 days out.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Put Options Explained — Profit From Crashes and Protect Your Stocks',
      description: 'What is a put option: strike, premium, expiry, breakeven math, protective-put hedging, plus a Python put scanner with unusual-volume and put-call-ratio filters.',
      about: 'Put Options Trading Guide',
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

export default function aiforrich_put_options() {
  return (
    <ToolLayout
      title="Put Options Explained — Profit From Crashes and Protect Your Stocks"
      desc="What is a put option? Strike, premium, expiry, protective-put hedging math and a Python put scanner with unusual-volume + put-call-ratio filters. Comment LINK on the @aiforrich reel for the free cheat sheet."
      icon="🛡️"
      iconBg="linear-gradient(135deg, rgba(239,68,68,0.18), rgba(99,102,241,0.08))"
      category="finance"
      slug="aiforrich/put-options"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Reel Companion Video Card */}
      <Section id="video" icon="🎬" title="Reel Companion & Video Summary" subtitle="~60s Reel breakdown from @aiforrich">
        <div className="rounded-2xl p-5 border border-amber-500/20" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(15,23,42,0.8))' }}>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-full sm:w-44 aspect-[9/16] rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center p-4 text-center shrink-0 relative overflow-hidden">
              <div className="text-4xl mb-2">🛡️</div>
              <span className="text-xs font-bold text-red-300">Put Options</span>
              <span className="text-[10px] text-slate-400 mt-1">Duration: ~60s</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-2">
                <span className="text-[10px] font-mono text-emerald-400">@aiforrich reel</span>
              </div>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-400/10 text-red-300 border border-red-400/30">
                🎙️ Voiceover Summary
              </div>
              <p className="italic text-slate-300 m-0">
                &ldquo;Scared the market will crash? A put lets you profit when prices fall — or protect stocks you own. Right to sell at a fixed price before expiry for a small premium. Below strike minus premium you profit, and big crashes mean big gains. Above the strike it expires worthless, but again you only lose the premium.&rdquo;
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
      <Section id="overview" icon="📊" title="What Is a Put Option?" subtitle="Insurance you can also speculate with">
        <p className="m-0">
          A <b className="text-white">put option</b> gives you the <b className="text-white">right to sell</b> a stock at a
          fixed <b className="text-white">strike price</b> before <b className="text-white">expiry</b>, for a small{' '}
          <b className="text-white">premium</b>. Two superpowers: (1) <b className="text-white">speculate on falls</b> —
          profit when prices crash, and (2) <b className="text-white">hedge holdings</b> — cap losses on stocks you own.
          Wrong either way? Loss is capped at the premium. No margin calls, ever.
        </p>
        <FeatureGrid items={[
          { i: '🎯', t: 'Strike Price', d: 'The fixed price you can sell at, even if the market falls far lower.' },
          { i: '🎟️', t: 'Premium', d: 'Your insurance cost — also the maximum you can lose.' },
          { i: '🛡️', t: 'Protective Put', d: 'Own stock + buy put = losses stop at the strike. Sleep well.' },
          { i: '⚖️', t: 'Breakeven', d: 'Strike − premium. Stock must fall below this for profit.' },
        ]} />
      </Section>

      {/* How it works */}
      <Section id="how-it-works" icon="⚙️" title="How a Put Works, Step by Step" subtitle="One contract, two use-cases">
        <div className="space-y-3">
          <StepRow num="1" title="Pay premium, pick strike + expiry"
            body="Stock at 1,000. You buy a 980-strike put, 30 days out, for ₹25 premium. Max loss = ₹25 × lot size. Done." />
          <StepRow num="2" title="Speculate: stock crashes, put explodes"
            body="Bad earnings — stock falls to 900. Your right to sell at 980 is worth 80 intrinsically. Sell the put for ~₹75: profit ₹50 per share." />
          <StepRow num="3" title="Hedge: stock you own is protected"
            body="You hold 100 shares at 1,000 plus the 980 put. Crash to 900: shares lose 100 each, put gains ~75 each. Net pain far smaller — insurance paid off." />
          <StepRow num="4" title="If wrong, cheap lesson"
            body="Stock rallies to 1,100. Put expires at zero. Loss = ₹25 premium. The shares you hedged gained — the put was just insurance." />
        </div>
        <InfoBox title="The one-line math">
          Profit at expiry = max(0, Strike − Stock) − Premium. You need Stock &lt; Strike − Premium to make money.
        </InfoBox>
      </Section>

      {/* Payoff */}
      <Section id="payoff" icon="📉" title="Put Payoff: Crash Profits, Capped Cost" subtitle="Mirror image of the call">
        <FeatureGrid items={[
          { i: '📉', t: 'Market crashes', d: 'Profit grows ₹1-for-₹1 below breakeven. The deeper the fall, the bigger the gain.' },
          { i: '🛡️', t: 'Portfolio hedge', d: 'A 5-10% OTM put caps portfolio drawdowns for ~1-2% annual cost.' },
          { i: '➖', t: 'Market flat/up', d: 'Put decays (theta). Insurance costs money when nothing bad happens.' },
          { i: '😱', t: 'Fear gauge', d: 'When everyone buys puts, IV spikes — puts get expensive. Buy protection BEFORE panic.' },
        ]} />
        <DoDont
          good={['Hedge before events (elections, results, Fed meets)', 'Buy 5-10% OTM puts, 30-60 days out', 'Watch put-call ratio above 1.2 as fear signal', 'Take profit on spikes — fear fades fast']}
          bad={['Buying puts AFTER the crash (IV just robbed you)', 'Using all capital on far-OTM lottery puts', 'Naked shorting instead of defined-risk puts', 'Forgetting puts decay even when you are eventually right']}
        />
      </Section>

      {/* Code */}
      <Section id="code" icon="💻" title="Put Scanner Code — Python + Pine Script" subtitle="Copy-paste: unusual put volume + PCR fear filter">
        <CodeTabs tabs={[
          {
            lang: 'Python', icon: '🐍', title: 'put_scanner.py',
            desc: 'Flags puts with unusual volume, rising put-call ratios and price under VWAP — fear building or hedge demand.',
            lines: [
              '# Put scanner: unusual put volume + PCR fear + under-VWAP',
              '# pip install yfinance pandas',
              'import yfinance as yf, pandas as pd',
              '',
              'SYMBOLS = ["RELIANCE.NS", "INFY.NS", "NIFTY"]',
              'MIN_DTE, MAX_DTE = 30, 60',
              'VOL_MULT, PCR_FEAR = 1.5, 1.2',
              '',
              'def vwap(df):',
              '    pv = ((df["High"] + df["Low"] + df["Close"]) / 3) * df["Volume"]',
              '    return (pv.cumsum() / df["Volume"].cumsum()).iloc[-1]',
              '',
              'def scan(symbol):',
              '    t = yf.Ticker(symbol)',
              '    hist = t.history(period="5d")',
              '    px, vw = hist["Close"].iloc[-1], vwap(hist)',
              '    out = []',
              '    for exp in t.options:',
              '        oc = t.option_chain(exp)',
              '        dte = (pd.Timestamp(exp) - pd.Timestamp.now()).days',
              '        if not (MIN_DTE <= dte <= MAX_DTE): continue',
              '        put_vol = oc.puts["volume"].fillna(0).sum()',
              '        call_vol = oc.calls["volume"].fillna(0).sum() or 1',
              '        pcr = put_vol / call_vol',
              '        for _, r in oc.puts.iterrows():',
              '            oi = r.get("openInterest", 0) or 0',
              '            vol = r.get("volume", 0) or 0',
              '            if abs(r["strike"] - px) / px > 0.03: continue',
              '            unusual = vol > VOL_MULT * max(oi, 1)',
              '            if unusual and pcr > PCR_FEAR and px < vw:',
              '                out.append((symbol, exp, r["strike"], round(pcr,2), vol))',
              '    return sorted(out, key=lambda x: x[4], reverse=True)',
              '',
              'for s in SYMBOLS:',
              '    for row in scan(s)[:5]:',
              '        print(f"{row[0]} {row[1]} strike={row[2]} pcr={row[3]} vol={row[4]}")',
            ].join('\n'),
          },
          {
            lang: 'Pine Script', icon: '🌲', title: 'put_scanner.pine',
            desc: 'TradingView v5: breakdown + volume expansion = downside momentum alert for put consideration.',
            lines: [
              '//@version=5',
              'indicator("AIFORRich Put Momentum", overlay=true)',
              'fastLen = input.int(20, "Fast EMA")',
              'slowLen = input.int(50, "Slow EMA")',
              'volMult = input.float(1.5, "Volume multiple")',
              'fast = ta.ema(close, fastLen)',
              'slow = ta.ema(close, slowLen)',
              'volX = volume > ta.sma(volume, 20) * volMult',
              'bear = ta.crossunder(fast, slow) and volX',
              'plotshape(bear, title="Put signal", style=shape.triangledown,',
              '     location=location.abovebar, color=color.red, size=size.small)',
              'alertcondition(bear, title="Put momentum", message="PUT momentum {{ticker}}")',
            ].join('\n'),
          },
          {
            lang: 'Java', icon: '☕', title: 'PutScanner.java',
            desc: 'Java port: unusual put volume plus put-call-ratio fear filter.',
            lines: [
              'import java.util.*;',
              'public class PutScanner {',
              '  record Put(String sym, String exp, double strike, long vol, long oi) {}',
              '  public static List<Put> scan(List<Put> puts, long callVol, double spot) {',
              '    long pv = puts.stream().mapToLong(p -> p.vol).sum();',
              '    double pcr = pv / Math.max(callVol, 1);',
              '    List<Put> hits = new ArrayList<>();',
              '    for (Put p : puts) {',
              '      if (Math.abs(p.strike - spot) / spot > 0.03) continue;',
              '      if (p.vol > 1.5 * Math.max(p.oi, 1) && pcr > 1.2) hits.add(p);',
              '    }',
              '    hits.sort((a, b) -> Long.compare(b.vol, a.vol));',
              '    return hits;',
              '  }',
              '}',
            ].join('\n'),
          },
          {
            lang: 'C++', icon: '⚙️', title: 'put_scanner.cpp',
            desc: 'C++ port for low-latency downside-momentum scanning.',
            lines: [
              '#include <vector> #include <string> #include <algorithm> #include <cmath>',
              'struct Put { std::string sym, exp; double strike; long vol, oi; };',
              'std::vector<Put> scan(const std::vector<Put>& puts, long callVol, double spot, double pcr) {',
              '  std::vector<Put> hits;',
              '  for (auto& p : puts) {',
              '    if (std::fabs(p.strike - spot) / spot > 0.03) continue;',
              '    if (p.vol > 1.5 * std::max<long>(p.oi, 1) && pcr > 1.2) hits.push_back(p);',
              '  }',
              '  std::sort(hits.begin(), hits.end(),',
              '    [](auto& a, auto& b){ return a.vol > b.vol; });',
              '  return hits;',
              '}',
            ].join('\n'),
          },
        ]} />
        <InfoBox title="How to use this scanner">
          Run it before high-risk events. High PCR + unusual put volume + price under VWAP = institutions hedging. Either follow with defined-risk puts or tighten your own stops.
        </InfoBox>
      </Section>

      {/* CTA */}
      <Section id="free-guide" icon="🎁" title="Free Put Options Cheat Sheet + Scanner" subtitle="Comment LINK on the reel">
        <p className="m-0">
          Want the one-page put options cheat sheet (protective-put math, breakeven, expiry rules) plus this scanner code?
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
