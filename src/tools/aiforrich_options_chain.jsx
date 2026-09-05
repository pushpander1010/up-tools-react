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
    q: 'How is an options chain laid out?',
    a: 'Calls on the LEFT, puts on the RIGHT, strike prices in the MIDDLE column. Each row is one strike. The top shows the expiry date — every expiry has its own chain. Bid/ask, volume, open interest and IV fill the columns on each side.',
  },
  {
    q: 'What do bid, ask, volume, open interest and IV mean?',
    a: 'Bid = what buyers will pay. Ask = what sellers demand. Volume = contracts traded today. Open Interest (OI) = all live open contracts — where big money sits. IV (implied volatility) = how expensive the option is; high IV means pricey premium.',
  },
  {
    q: 'How do pros find support and resistance from OI?',
    a: 'Strikes with huge call OI act as resistance (writers defend them); huge put OI acts as support. Price gravitates toward max-pain (max OI pain for buyers) into expiry. Rising OI + rising price = new longs; rising OI + falling price = new shorts.',
  },
  {
    q: 'What does rising volume with rising OI mean?',
    a: 'New money entering — fresh positions being built, trend likely to continue. Rising volume with FALLING OI means positions closing (short covering or profit booking) — trend may be exhausting. Always read volume and OI together.',
  },
  {
    q: 'How do you sense fear vs greed from the chain?',
    a: 'Compare total call OI vs put OI (put-call ratio). PCR above ~1.2 = fear/hedging (contrarian bullish). PCR below ~0.7 = complacency/greed (contrarian bearish). Combine with IV rank: expensive puts + high PCR = peak fear.',
  },
  {
    q: 'Can I scan option chains with code instead of reading manually?',
    a: 'Yes — that is what algos do. The Python scanner on this page pulls the chain, ranks strikes by OI, flags volume-vs-OI expansion, and computes PCR per expiry. Run it every morning and trade only the top-3 OI strikes.',
  },
]

const howItWorks = [
  'Orient: calls left, puts right, strikes middle, expiry on top.',
  'Learn 5 numbers: bid, ask, volume, open interest, IV.',
  'Spot walls: max call OI = resistance, max put OI = support.',
  'Read flows: volume + OI rising together = new money entering.',
  'Gauge mood: PCR above 1.2 = fear, below 0.7 = greed — then scan with code.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'How to Read an Options Chain Like a Pro — OI, Volume, PCR in 60 Seconds',
      description: 'Options chain layout (calls left, puts right, strikes middle), the 5 numbers that matter, OI support/resistance walls, volume+OI flows, put-call-ratio fear/greed gauge, plus a Python chain scanner.',
      about: 'Options Chain Analysis Guide',
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

export default function aiforrich_options_chain() {
  return (
    <ToolLayout
      title="How to Read an Options Chain Like a Pro — OI, Volume, PCR in 60 Seconds"
      desc="Options chain decoded: calls left, puts right, strikes middle. The 5 numbers (bid, ask, volume, OI, IV), OI support/resistance walls and PCR fear gauge — plus a Python chain scanner. Comment LINK on the @aiforrich reel."
      icon="⛓️"
      iconBg="linear-gradient(135deg, rgba(99,102,241,0.18), rgba(6,182,212,0.08))"
      category="finance"
      slug="aiforrich/options-chain"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Reel Companion Video Card */}
      <Section id="video" icon="🎬" title="Reel Companion & Video Summary" subtitle="~60s Reel breakdown from @aiforrich">
        <div className="rounded-2xl p-5 border border-amber-500/20" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(15,23,42,0.8))' }}>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-full sm:w-44 aspect-[9/16] rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center p-4 text-center shrink-0 relative overflow-hidden">
              <div className="text-4xl mb-2">⛓️</div>
              <span className="text-xs font-bold text-indigo-300">Options Chain</span>
              <span className="text-[10px] text-slate-400 mt-1">Duration: ~60s</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-2">
                <span className="text-[10px] font-mono text-emerald-400">@aiforrich reel</span>
              </div>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-400/10 text-indigo-300 border border-indigo-400/30">
                🎙️ Voiceover Summary
              </div>
              <p className="italic text-slate-300 m-0">
                &ldquo;The options chain looks scary but it is simple — calls left, puts right, strikes middle, expiry on top. Five numbers matter: bid, ask, volume, open interest, IV. Huge OI at a strike makes support or resistance. Volume plus OI rising together means new money. Compare call and put OI to sense fear or greed.&rdquo;
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
        This chain-reading guide is <b>strictly for educational purposes</b> and does <b>not constitute financial or investment advice</b>.
        OI walls shift intraday and PCR is contrarian, not predictive. Paper-trade patterns before risking capital.
      </WarningBox>

      {/* Overview */}
      <Section id="overview" icon="📊" title="Chain Layout in 10 Seconds" subtitle="Calls left, puts right, strikes middle">
        <p className="m-0">
          Open any options chain and it looks like a wall of numbers. Ignore 90% of it. The layout never changes:{' '}
          <b className="text-white">calls on the left</b> (bullish bets), <b className="text-white">puts on the right</b>{' '}
          (bearish bets/hedges), <b className="text-white">strike prices down the middle</b>, and the{' '}
          <b className="text-white">expiry date</b> on top (each expiry = its own chain). One row = one strike = one
          battlefield between buyers and writers.
        </p>
        <FeatureGrid items={[
          { i: '📍', t: 'Strikes (middle)', d: 'Each row is a strike. ATM (near current price) rows have the most action.' },
          { i: '📅', t: 'Expiry (top)', d: 'Near-week chains = gambling. 30-60 DTE chains = readable positioning.' },
          { i: '📞', t: 'Calls (left)', d: 'Bullish side. Heavy OI here = writers defending a ceiling (resistance).' },
          { i: '📉', t: 'Puts (right)', d: 'Bearish/hedge side. Heavy OI here = institutions defending a floor (support).' },
        ]} />
      </Section>

      {/* Five numbers */}
      <Section id="five-numbers" icon="🔢" title="The 5 Numbers That Matter" subtitle="Everything else is noise">
        <div className="space-y-3">
          <StepRow num="1" title="Bid / Ask — the spread tax"
            body="Bid = buyers' price, Ask = sellers' price. Wide spreads (illiquid strikes) eat 5-10% instantly. Trade only strikes with tight spreads and real volume." />
          <StepRow num="2" title="Volume — today's activity"
            body="Contracts traded today. High volume = liquid, easy entry/exit. Zero volume = trap: you may never exit at a fair price." />
          <StepRow num="3" title="Open Interest — where big money sits"
            body="All live open contracts. Max call OI strike → resistance wall. Max put OI strike → support floor. Price pins to max-pain into expiry." />
          <StepRow num="4" title="IV — the price tag"
            body="Implied volatility = how expensive premium is. IV rank above 70 = overpriced (sell premium). Below 30 = cheap (buy premium). Never buy expensive fear." />
          <StepRow num="5" title="Change in OI — fresh vs dead money"
            body="OI rising + price rising = new longs (bullish). OI rising + price falling = new shorts (bearish). OI falling = positions closing, trend exhausting." />
        </div>
        <InfoBox title="The pro 30-second read">
          Glance 1: max call OI and max put OI — that is today's range. Glance 2: PCR (total put OI ÷ call OI) — above 1.2 fear, below 0.7 greed. Glance 3: IV rank — cheap or expensive? Done. Trade the range, fade the extreme.
        </InfoBox>
      </Section>

      {/* Pro reads */}
      <Section id="pro-reads" icon="🧠" title="3 Pro Reads From the Same Chain" subtitle="Support, flows, sentiment">
        <FeatureGrid items={[
          { i: '🧱', t: 'OI walls = S/R', d: 'NIFTY max call OI at 24,500, max put OI at 24,000? Expect pinball between them into expiry.' },
          { i: '💸', t: 'Volume + OI together', d: 'Both rising = new money entering, trend continues. Volume up + OI down = covering, trend dying.' },
          { i: '😱', t: 'PCR fear/greed', d: 'PCR 1.5 + spiking put IV = peak fear (contrarian bounce zone). PCR 0.5 = greed top (caution).' },
          { i: '🎯', t: 'Max pain pin', d: 'Compute the strike minimizing total option-buyer payout. Expiry-day price magnets there ~70% of the time.' },
        ]} />
        <DoDont
          good={['Trade the 2-3 max-OI strikes only (liquid + meaningful)', 'Check PCR + IV rank before every expiry trade', 'Let volume confirm OI walls (walls without volume are paper)', 'Re-check walls after 2 PM — intraday shifts are real']}
          bad={['Trading zero-volume strikes (no exit)', 'Reading one snapshot all day (chains move)', 'Buying premium at IV rank 80+ into events', 'Assuming walls hold through gap opens/news']}
        />
      </Section>

      {/* Code */}
      <Section id="code" icon="💻" title="Chain Scanner Code — Python + Pine Script" subtitle="Copy-paste: OI walls + PCR + max-pain pin">
        <CodeTabs tabs={[
          {
            lang: 'Python', icon: '🐍', title: 'chain_scanner.py',
            desc: 'Ranks strikes by OI, computes PCR per expiry and estimates the max-pain pin level.',
            lines: [
              '# Options chain scanner: OI walls + PCR + max pain',
              '# pip install yfinance pandas',
              'import yfinance as yf, pandas as pd',
              '',
              'SYMBOL = "RELIANCE.NS"',
              '',
              'def scan(symbol):',
              '    t = yf.Ticker(symbol)',
              '    for exp in t.options[:2]:  # front 2 expiries',
              '        oc = t.option_chain(exp)',
              '        calls, puts = oc.calls.fillna(0), oc.puts.fillna(0)',
              '        pcr = puts["openInterest"].sum() / max(calls["openInterest"].sum(), 1)',
              '        df = pd.merge(calls[["strike","openInterest","volume"]],',
              '                      puts[["strike","openInterest","volume"]],',
              '                      on="strike", suffixes=("_c","_p"))',
              '        # OI walls',
              '        rc = df.loc[df["openInterest_c"].idxmax()]',
              '        rp = df.loc[df["openInterest_p"].idxmax()]',
              '        print(f"{symbol} {exp} PCR={pcr:.2f}")',
              '        print(f"  resistance(call wall): {rc.strike} OI={rc.openInterest_c}")',
              '        print(f"  support(put wall):     {rp.strike} OI={rp.openInterest_p}")',
              '        # max pain: strike minimizing call+put payout',
              '        best, pain = None, float("inf")',
              '        for k in df["strike"]:',
              '            pay = ((df["strike"]-k).clip(lower=0)*df["openInterest_c"]).sum()',
              '            pay += ((k-df["strike"]).clip(lower=0)*df["openInterest_p"]).sum()',
              '            if pay < pain: pain, best = pay, k',
              '        print(f"  max-pain pin: {best}")',
              '',
              'scan(SYMBOL)',
            ].join('\n'),
          },
          {
            lang: 'Pine Script', icon: '🌲', title: 'oi_walls.pine',
            desc: 'TradingView v5: plots prior-day high/low volume nodes as proxy S/R walls beside your chain read.',
            lines: [
              '//@version=5',
              'indicator("AIFORRich OI Wall Proxy", overlay=true)',
              'len = input.int(20, "Lookback")',
              'hiW = ta.highest(high, len)',
              'loW = ta.lowest(low, len)',
              'plot(hiW, "Call wall proxy", color.new(color.red, 20))',
              'plot(loW, "Put wall proxy", color.new(color.green, 20))',
              'bgcolor(ta.rising(close, 3) ? color.new(color.green, 93) : na)',
            ].join('\n'),
          },
          {
            lang: 'Java', icon: '☕', title: 'ChainScanner.java',
            desc: 'Java port: OI-wall detection plus put-call-ratio gauge.',
            lines: [
              'import java.util.*;',
              'public class ChainScanner {',
              '  record Row(double strike, long callOi, long putOi) {}',
              '  public static void scan(List<Row> rows) {',
              '    long c = rows.stream().mapToLong(r -> r.callOi).sum();',
              '    long p = rows.stream().mapToLong(r -> r.putOi).sum();',
              '    System.out.printf("PCR=%.2f%n", p / (double) Math.max(c, 1));',
              '    rows.stream().max(Comparator.comparingLong(r -> r.callOi))',
              '      .ifPresent(r -> System.out.println("resistance: " + r.strike));',
              '    rows.stream().max(Comparator.comparingLong(r -> r.putOi))',
              '      .ifPresent(r -> System.out.println("support: " + r.strike));',
              '  }',
              '}',
            ].join('\n'),
          },
          {
            lang: 'C++', icon: '⚙️', title: 'chain_scanner.cpp',
            desc: 'C++ port for scanning many expiries per second.',
            lines: [
              '#include <vector> #include <cstdio> #include <algorithm>',
              'struct Row { double strike; long callOi, putOi; };',
              'void scan(const std::vector<Row>& rows) {',
              '  long c = 0, p = 0;',
              '  for (auto& r : rows) { c += r.callOi; p += r.putOi; }',
              '  std::printf("PCR=%.2f\\n", p / (double)std::max<long>(c, 1));',
              '  auto rc = std::max_element(rows.begin(), rows.end(),',
              '    [](auto& a, auto& b){ return a.callOi < b.callOi; });',
              '  auto rp = std::max_element(rows.begin(), rows.end(),',
              '    [](auto& a, auto& b){ return a.putOi < b.putOi; });',
              '  std::printf("resistance=%.0f support=%.0f\\n", rc->strike, rp->strike);',
              '}',
            ].join('\n'),
          },
        ]} />
        <InfoBox title="How to use this scanner">
          Run it each morning on NIFTY/BANKNIFTY front expiry. Note the two walls (your range), the PCR (mood), and max pain (magnet). Intraday: long support wall, short resistance wall, stop beyond the wall.
        </InfoBox>
      </Section>

      {/* CTA */}
      <Section id="free-guide" icon="🎁" title="Free Chain Cheat Sheet + Scanner" subtitle="Comment LINK on the reel">
        <p className="m-0">
          Want the one-page options-chain cheat sheet (layout map, 5 numbers, wall + PCR rules) plus this scanner code?
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
