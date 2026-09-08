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
    q: 'What is HFT in simple words?',
    a: 'High-frequency trading: computers placed next to exchange servers reacting to prices in microseconds. They win on speed — seeing and acting before your click even reaches the exchange.',
  },
  {
    q: 'How do HFT firms actually make money?',
    a: 'Tiny profits per trade (often paise) × millions of trades a day. Small edge times massive volume equals crores. Strategies include market-making spreads, micro-arbitrage, and momentum ignition.',
  },
  {
    q: 'Can a retail trader copy HFT?',
    a: 'Not the speed — you have no co-located servers. But you can copy the logic: ride momentum instead of predicting, cut losses instantly like a machine, and automate rule-based entries so emotions never touch the trade.',
  },
  {
    q: 'What should I steal from HFT for my algos?',
    a: 'Three things: momentum-first entries (trade what moves now), hard automated stops (no discretion), and session/volume filters (trade when machines provide liquidity, sit out dead zones).',
  },
  {
    q: 'Does HFT hurt retail traders?',
    a: 'It takes the micro-edge (scalps, latency arb) but leaves the macro-edge: multi-day momentum, trends, and patience. You cannot out-click a server — so stop scalping against it and trade slower timeframes with rules.',
  },
]

const howItWorks = [
  'Understand the edge: co-location + microseconds.',
  'See the model: paise per trade × millions of trades.',
  'Accept you cannot copy the speed.',
  'Copy the logic: momentum, instant exits, automation.',
  'Trade slower timeframes where machines do not matter.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'HFT Explained — How Machines Trade in Microseconds (And What to Copy)',
      description: 'Speed, tiny profits at huge size, and the 3 HFT lessons retail algos can copy — with a momentum + auto-exit code template.',
      about: 'High Frequency Trading Explained Guide',
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

export default function aiforrich_hft_explained() {
  return (
    <ToolLayout
      title="HFT Explained — How Machines Trade in Microseconds"
      desc="HFT firms win before you click: co-located servers, paise-profits at massive size. Copy the logic (momentum, instant exits, automation) — plus code. Comment LINK on the @aiforrich reel."
      icon="⚡"
      iconBg="linear-gradient(135deg, rgba(99,102,241,0.18), rgba(52,211,153,0.08))"
      category="finance"
      slug="aiforrich/hft-explained"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Section id="video" icon="🎬" title="Reel Companion & Video Summary" subtitle="~60s Reel breakdown from @aiforrich">
        <div className="rounded-2xl p-5 border border-amber-500/20" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(15,23,42,0.8))' }}>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-full sm:w-44 aspect-[9/16] rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center p-4 text-center shrink-0 relative overflow-hidden">
              <div className="text-4xl mb-2">⚡</div>
              <span className="text-xs font-bold text-indigo-300">HFT Explained</span>
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
                &ldquo;Everyone thinks trading is humans shouting buy-sell. HFT firms park computers next to exchange servers and trade in microseconds — one trade makes paise, but millions of trades make crores. You cannot copy the speed, but copy the logic: momentum, instant exits, automation.&rdquo;
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
        This HFT explainer is <b>strictly for educational purposes</b> and does <b>not constitute financial or investment advice</b>.
        Latency strategies need infrastructure you do not have. Trade slower edges with rules, not speed fantasies.
      </WarningBox>

      <Section id="overview" icon="⚡" title="HFT in 30 Seconds" subtitle="Speed × size = the whole business">
        <p className="m-0">
          Forget charts. HFT is a <b className="text-white">physics business</b>: servers beside the exchange see prices
          first and react in microseconds. Each win is dust — paise per trade — but millions of dust-wins a day compound
          into crores. Your edge is not speed; it is copying their <b className="text-white">discipline at human speed</b>.
        </p>
        <FeatureGrid items={[
          { i: '🚀', t: 'Co-located speed', d: 'Servers next to the exchange. Microseconds, not seconds.' },
          { i: '🪙', t: 'Paise × millions', d: 'Tiny per-trade edge at insane volume equals crores.' },
          { i: '🤖', t: 'Zero emotion', d: 'Rules execute; no fear, no hope, no hesitation.' },
          { i: '🧍', t: 'Your copy', d: 'Momentum entries, instant exits, automated rules.' },
        ]} />
      </Section>

      <Section id="checklist" icon="✅" title="The 3 HFT Lessons" subtitle="Steal logic, not latency">
        <div className="space-y-3">
          <StepRow num="1" title="Speed is the edge (theirs, not yours)"
            body="Co-location + microwave links + FPGA = they act before your order arrives. Do not fight this: avoid 1-minute scalps where latency decides everything." />
          <StepRow num="2" title="Tiny profits at huge size"
            body="Market-making spreads and micro-arbitrage print paise per loop, millions of loops a day. Retail version: small consistent momentum wins, compounded — not one jackpot trade." />
          <StepRow num="3" title="Copy the machine mindset"
            body="Ride what moves now (momentum), cut instantly at your stop (no negotiation), automate entries/exits. Think like a machine, trade like a human — on slower timeframes where speed does not matter." />
        </div>
        <InfoBox title="Where retail actually wins">
          Daily/weekly momentum, breakouts with volume, and systematic exits — timeframes where a microsecond edge is worth exactly zero. Let machines fight over dust; you take trends.
        </InfoBox>
      </Section>

      <Section id="pro-reads" icon="🧠" title="Trade Like a Slow Machine" subtitle="Rules that survive contact with the market">
        <FeatureGrid items={[
          { i: '📈', t: 'Momentum first', d: 'Trade what moves now; never predict, always follow.' },
          { i: '✂️', t: 'Instant exits', d: 'Stop hit = out. Machines never “wait for recovery”.' },
          { i: '⚙️', t: 'Automate rules', d: 'Alerts + brackets > willpower. Code the exit before entry.' },
          { i: '🕐', t: 'Session filters', d: 'Trade liquid hours; sit out dead zones machines own.' },
        ]} />
        <DoDont
          good={['Backtest momentum + stop rules before risking capital', 'Automate exits (GTT/bracket) on every trade', 'Trade liquid sessions and liquid names only', 'Review weekly like a machine log, not a diary']}
          bad={['Scalping 1-minute charts against co-located servers', 'Moving stops because “it will come back”', 'Trading illiquid hours with wide spreads', 'Changing rules mid-trade on emotion']}
        />
      </Section>

      <Section id="code" icon="💻" title="Machine-Logic Template — Python" subtitle="Copy-paste: momentum + auto-exit">
        <CodeBlock title="slow_machine.py" lang="python" lines={[
          '# Retail HFT-logic: momentum entry + hard automated exit',
          '# pip install yfinance pandas',
          'import yfinance as yf',
          '',
          'SYMBOL, FAST, SLOW, STOP = "RELIANCE.NS", 10, 30, 0.02',
          '',
          'def signal(symbol):',
          '    h = yf.download(symbol, period="6mo", progress=False)["Close"]',
          '    f, s = h.rolling(FAST).mean(), h.rolling(SLOW).mean()',
          '    mom = f.iloc[-1] > s.iloc[-1]  # momentum on',
          '    px, entry = h.iloc[-1], h.iloc[-2]',
          '    stop = entry * (1 - STOP)',
          '    print(f"{symbol}: momentum={mom} px={px:.1f} stop={stop:.1f}")',
          '    if mom: print("ENTER with GTT stop at", round(float(stop), 1))',
          '    elif px < stop: print("EXIT — stop hit, no negotiation")',
          '',
          'signal(SYMBOL)',
        ].join('\n')} />
        <InfoBox title="How to use this template">
          Run daily on liquid large-caps: momentum decides entries, the 2% GTT stop decides exits — placed before you enter. That single habit (pre-placed exits) is 80% of “thinking like a machine”.
        </InfoBox>
      </Section>

      <Section id="free-guide" icon="🎁" title="Free Algo Checklist + Code" subtitle="Comment LINK on the reel">
        <p className="m-0">
          Want the HFT-style algo checklist plus this momentum + auto-exit template?
          Comment <b className="text-white">LINK</b> on the Instagram reel and follow <b className="text-white">@aiforrich</b> —
          both land in your DMs, free.
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
