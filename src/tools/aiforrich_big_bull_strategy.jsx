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
    q: 'How did Jhunjhunwala turn ₹5,000 into crores?',
    a: 'Three bold rules: buy good companies when fear crashes prices, bet big once research convinces you (one winner like Titan pays for ten losers), and hold for years — decades, not days — while India’s growth compounds.',
  },
  {
    q: 'What does “buy the fear” mean?',
    a: 'When markets crash, quality companies go on sale for non-business reasons (panic, flows, headlines). The Big Bull bought cheap when others panicked. Fear is a discount, not a danger — provided the business itself is sound.',
  },
  {
    q: 'How big should a high-conviction bet be?',
    a: 'Big enough to matter if right — concentration creates wealth, diversification preserves it. But size follows research: deep work first, then a position whose win changes your net worth. Never size up on hope.',
  },
  {
    q: 'How long is “hold for years”?',
    a: 'Titan was held for decades. The rule: sell only when the business thesis breaks (moat gone, fraud, permanent decline) — never on price wiggles, news cycles, or impatience. Time plus growth does the work.',
  },
  {
    q: 'Can I code the Big Bull checklist?',
    a: 'Yes — the screener on this page flags drawdown discounts (price vs 52-week high), earnings strength, and holding-period discipline. Run it in fear phases; that is when the list is worth the most.',
  },
]

const howItWorks = [
  'Hunt fear phases — quality on sale, not hype rallies.',
  'Research hard until conviction is earned.',
  'Bet big enough that a win matters.',
  'Hold for years; sell only on thesis break.',
  'Repeat for decades — patience compounds.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Big Bull’s 3 Bold Rules — Fear, Conviction, Patience (With Screener)',
      description: 'Buy the fear, bet big when sure, hold for years: the Jhunjhunwala 3-rule playbook with a Python fear-phase screener.',
      about: 'Rakesh Jhunjhunwala Big Bull Strategy Guide',
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

export default function aiforrich_big_bull_strategy() {
  return (
    <ToolLayout
      title="Big Bull’s 3 Bold Rules — Fear, Conviction, Patience"
      desc="Buy the fear, bet big when sure, hold for years — the Jhunjhunwala playbook that turned ₹5,000 into crores, plus a Python screener. Comment LINK on the @aiforrich reel."
      icon="🐂"
      iconBg="linear-gradient(135deg, rgba(239,68,68,0.18), rgba(251,191,36,0.08))"
      category="finance"
      slug="aiforrich/big-bull-strategy"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Section id="video" icon="🎬" title="Reel Companion & Video Summary" subtitle="~60s Reel breakdown from @aiforrich">
        <div className="rounded-2xl p-5 border border-amber-500/20" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(15,23,42,0.8))' }}>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-full sm:w-44 aspect-[9/16] rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center p-4 text-center shrink-0 relative overflow-hidden">
              <div className="text-4xl mb-2">🐂</div>
              <span className="text-xs font-bold text-red-300">Big Bull Rules</span>
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
                &ldquo;Everyone trades daily and loses. Jhunjhunwala turned 5,000 rupees into crores with 3 bold rules: buy the fear when markets crash, bet big when research makes you sure — one Titan pays for ten losers — and hold for years while India grows.&rdquo;
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
        This Big Bull playbook is <b>strictly for educational purposes</b> and does <b>not constitute financial or investment advice</b>.
        Concentration amplifies losses as well as wins. Do your own research or consult a registered advisor before investing.
      </WarningBox>

      <Section id="overview" icon="🐂" title="The 3 Rules in 30 Seconds" subtitle="Discount, conviction, decades">
        <p className="m-0">
          The Big Bull did not trade — he <b className="text-white">positioned</b>. Crash prices gave the discount,
          deep research gave the conviction to size up, and decades of holding let compounding run. Three bold moves,
          repeated across cycles, turned a tiny account into a fortune.
        </p>
        <FeatureGrid items={[
          { i: '😱', t: 'Buy the fear', d: 'Crashes put quality on sale. Panic is the discount window.' },
          { i: '🎯', t: 'Bet big when sure', d: 'One Titan pays for ten losers. Size follows research.' },
          { i: '📆', t: 'Hold for years', d: 'Decades, not days. Time plus growth does the work.' },
          { i: '🇮🇳', t: 'Ride India', d: 'Great business plus a growing economy compounds twice.' },
        ]} />
      </Section>

      <Section id="checklist" icon="✅" title="The 3-Rule Checklist" subtitle="Fear first, then size, then patience">
        <div className="space-y-3">
          <StepRow num="1" title="Buy the fear"
            body="Track quality names and wait for market-wide fear (sharp drawdowns, panic headlines). Buy sound businesses at sale prices — fear is a discount, not a danger, when the business is intact." />
          <StepRow num="2" title="Bet big when sure"
            body="Research until conviction: earnings, moat, management, growth runway. Then size the position so a win matters. Diversified tiny bets never change your net worth — one right big bet does." />
          <StepRow num="3" title="Hold for years"
            body="Hold through cycles; sell only if the thesis breaks. Titan compounded for decades because it was never traded. Impatience converts a multi-bagger into a missed story." />
        </div>
        <InfoBox title="The Big Bull filter">
          Ask three questions: is it on sale from fear (not fraud)? Have I researched enough to size up? Can I hold 10 years? Three yeses = buy. Anything less = wait.
        </InfoBox>
      </Section>

      <Section id="pro-reads" icon="🧠" title="Why Bold Beats Busy" subtitle="Fewer decisions, bigger outcomes">
        <FeatureGrid items={[
          { i: '📉', t: 'Fear = entry edge', d: 'Buying panic prices beats buying breakout prices over every long sample.' },
          { i: '🔬', t: 'Research = sizing license', d: 'Conviction without homework is gambling. Homework converts risk into edge.' },
          { i: '⏳', t: 'Patience = multiplier', d: 'Holding winners for decades lets earnings compound the position for you.' },
          { i: '🎯', t: 'Concentration = wealth', d: 'Diversification preserves; a few right concentrated bets create.' },
        ]} />
        <DoDont
          good={['Keep a fear-list of quality names before crashes come', 'Size up only after written research, not excitement', 'Hold winners for years; add on business-strength dips', 'Sell only on thesis break, never on headlines']}
          bad={['Day-trading a long-term playbook', 'Sizing up on tips without research', 'Selling multi-baggers on 20% wiggles', 'Buying falling knives (fraud/decline, not fear)']}
        />
      </Section>

      <Section id="code" icon="💻" title="Fear-Phase Screener Code — Python" subtitle="Copy-paste: discount + strength filter">
        <CodeBlock title="bigbull_screener.py" lang="python" lines={[
          '# Big Bull fear-phase screener: drawdown discount + earnings strength',
          '# pip install yfinance pandas',
          'import yfinance as yf',
          '',
          'STOCKS = ["TITAN.NS", "RELIANCE.NS", "TCS.NS"]',
          '',
          'def bigbull(symbol):',
          '    t = yf.Ticker(symbol)',
          '    h = t.history(period="1y")',
          '    if h.empty: return False',
          '    price = h["Close"].iloc[-1]',
          '    high = h["Close"].max()',
          '    discount = 1 - price / high  # drawdown depth',
          '    info = t.info',
          '    pe = info.get("trailingPE") or 0',
          '    ok = discount > 0.15 and 0 < pe < 35',
          '    print(f"{symbol}: {discount:.0%} off high, PE={pe:.1f} -> {ok}")',
          '    return ok',
          '',
          'picks = [s for s in STOCKS if bigbull(s)]',
          'print("Fear-list passes:", picks)',
        ].join('\n')} />
        <InfoBox title="How to use this screener">
          Run during corrections: it flags quality names trading 15%+ off highs at sane multiples. Those are your research shortlist — conviction first, size second, patience always.
        </InfoBox>
      </Section>

      <Section id="free-guide" icon="🎁" title="Free Big Bull Checklist + Screener" subtitle="Comment LINK on the reel">
        <p className="m-0">
          Want the one-page Big Bull checklist plus this fear-phase screener?
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
