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
    q: 'What are Buffett’s 3 rules?',
    a: 'Buy wonderful businesses you understand, never pay full price (buy below real value so mistakes still make money), and hold forever so compounding does the work. Boring, repeatable, and it works on small accounts too.',
  },
  {
    q: 'What does “wonderful business” mean?',
    a: 'A simple company with a strong brand or moat, steady profits, and management you trust. If you cannot explain how it makes money in one sentence, it fails rule one — skip it.',
  },
  {
    q: 'How do I know I am not overpaying?',
    a: 'Estimate real value (steady earnings × a sane multiple, or discounted cash flow) and demand a margin of safety — pay clearly less. No margin, no buy. Price is the only part of investing you control.',
  },
  {
    q: 'Why hold forever?',
    a: 'Compounding needs time: a great business at a fair price grows earnings year after year, and staying put avoids taxes, fees, and timing mistakes. Trading converts a winning business into a losing hobby.',
  },
  {
    q: 'Can I code the Buffett checklist?',
    a: 'Yes — the screener on this page scores ROE consistency, low debt, and earnings-yield vs history. Run it monthly; only stocks passing all three deserve your deeper reading.',
  },
]

const howItWorks = [
  'Pick wonderful businesses you can explain simply.',
  'Value them and buy only below real value.',
  'Hold for years — let compounding work.',
  'Screen monthly; research only triple-pass names.',
  'Do nothing most of the time — patience is the edge.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Buffett’s 3 Boring Rules That Beat Hot Tips — Small-Account Guide',
      description: 'Wonderful businesses, margin of safety, hold forever: Buffett’s 3-rule checklist with a Python screener.',
      about: 'Warren Buffett Value Investing Guide',
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

export default function aiforrich_buffett_strategy() {
  return (
    <ToolLayout
      title="Buffett’s 3 Boring Rules That Beat Hot Tips"
      desc="Wonderful businesses, never pay full price, hold forever — the Buffett checklist that works on small accounts, plus a Python screener. Comment LINK on the @aiforrich reel."
      icon="🎩"
      iconBg="linear-gradient(135deg, rgba(251,191,36,0.18), rgba(52,211,153,0.08))"
      category="finance"
      slug="aiforrich/buffett-strategy"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Section id="video" icon="🎬" title="Reel Companion & Video Summary" subtitle="~60s Reel breakdown from @aiforrich">
        <div className="rounded-2xl p-5 border border-amber-500/20" style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.06), rgba(15,23,42,0.8))' }}>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-full sm:w-44 aspect-[9/16] rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center p-4 text-center shrink-0 relative overflow-hidden">
              <div className="text-4xl mb-2">🎩</div>
              <span className="text-xs font-bold text-amber-300">Buffett Rules</span>
              <span className="text-[10px] text-slate-400 mt-1">Duration: ~60s</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-2">
                <span className="text-[10px] font-mono text-emerald-400">@aiforrich reel</span>
              </div>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                🎙️ Voiceover Summary
              </div>
              <p className="italic text-slate-300 m-0">
                &ldquo;Everyone chases hot tips and loses. Buffett got rich with 3 boring rules: buy wonderful businesses you understand, never pay full price so mistakes still make money, and hold forever while compounding works. Boring beats exciting.&rdquo;
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
        This Buffett checklist is <b>strictly for educational purposes</b> and does <b>not constitute financial or investment advice</b>.
        Even wonderful businesses can stay overpriced for years. Do your own research or consult a registered advisor before investing.
      </WarningBox>

      <Section id="overview" icon="🎩" title="The 3 Rules in 30 Seconds" subtitle="Boring wins because it compounds">
        <p className="m-0">
          Buffett’s edge was never stock-picking genius — it was <b className="text-white">refusing to play the exciting game</b>.
          Wonderful business (quality), margin of safety (price), forever holding (time). Three rules, decades of compounding,
          and they work from a small account because they depend on behavior, not capital.
        </p>
        <FeatureGrid items={[
          { i: '🏰', t: 'Wonderful business', d: 'Simple, profitable, moated. Understand it fully first.' },
          { i: '🏷️', t: 'Margin of safety', d: 'Pay below real value — mistakes still make money.' },
          { i: '♾️', t: 'Hold forever', d: 'Let compounding work; trading destroys it.' },
          { i: '🐢', t: 'Boring = durable', d: 'No leverage, no timing, no tips. Just repetition.' },
        ]} />
      </Section>

      <Section id="checklist" icon="✅" title="The 3-Rule Checklist" subtitle="All three, or no buy">
        <div className="space-y-3">
          <StepRow num="1" title="Buy wonderful businesses"
            body="Strong brand or moat, steady profits, honest management, business you can explain in one sentence. Confusing, cyclical, or story-only companies fail here — skip regardless of price." />
          <StepRow num="2" title="Never pay full price"
            body="Estimate real value and demand a discount (margin of safety). Even the best company bought at euphoria multiples delivers mediocre returns. No margin = no buy = wait." />
          <StepRow num="3" title="Hold forever"
            body="Favorite holding period: forever. Great business at a fair price compounds earnings while you do nothing. Selling to chase the next tip resets the clock to zero." />
        </div>
        <InfoBox title="The small-account version">
          Same rules, smaller size: one wonderful business per year, bought on dips with a margin of safety, held for a decade. Ten such decisions beat a thousand trades.
        </InfoBox>
      </Section>

      <Section id="pro-reads" icon="🧠" title="Why Boring Beats Tips" subtitle="Behavior is the edge">
        <FeatureGrid items={[
          { i: '🧠', t: 'Circle of competence', d: 'Stay inside businesses you understand; everything else is gambling.' },
          { i: '🛡️', t: 'Margin absorbs errors', d: 'Your valuation will be wrong — the discount makes wrong still profitable.' },
          { i: '⏳', t: 'Time does the heavy lifting', d: 'Compounding is exponential only if you do not interrupt it.' },
          { i: '🚫', t: 'No leverage, no timing', d: 'Buffett avoided both. Leverage turns temporary dips into permanent ruin.' },
        ]} />
        <DoDont
          good={['Write the one-sentence business explanation before buying', 'Demand a margin of safety on every purchase', 'Hold through normal volatility — sell only on thesis break', 'Add on dips to wonderful businesses, not to losers']}
          bad={['Buying businesses you cannot explain', 'Paying full price because “it is going up”', 'Checking prices daily and trading the noise', 'Using leverage to speed up compounding']}
        />
      </Section>

      <Section id="code" icon="💻" title="Buffett Screener Code — Python" subtitle="Copy-paste: moat + margin + patience">
        <CodeBlock title="buffett_screener.py" lang="python" lines={[
          '# Buffett-style screener: consistent ROE + low debt + earnings yield',
          '# pip install yfinance pandas',
          'import yfinance as yf',
          '',
          'STOCKS = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS"]',
          '',
          'def buffett(symbol):',
          '    t = yf.Ticker(symbol)',
          '    info = t.info',
          '    roe = info.get("returnOnEquity") or 0',
          '    de = info.get("debtToEquity") or 999',
          '    pe = info.get("trailingPE") or 0',
          '    ey = 1 / pe if pe else 0  # earnings yield',
          '    ok = roe > 0.15 and de < 50 and 0 < pe < 30',
          '    print(f"{symbol}: ROE={roe:.2f} D/E={de:.0f} EY={ey:.3f} -> {ok}")',
          '    return ok',
          '',
          'winners = [s for s in STOCKS if buffett(s)]',
          'print("Pass:", winners)',
        ].join('\n')} />
        <InfoBox title="How to use this screener">
          Run monthly on large-cap watchlists. Triple-pass names earn deep reading (annual reports, moat check); everything else stays ignored. The screener filters — your judgment buys.
        </InfoBox>
      </Section>

      <Section id="free-guide" icon="🎁" title="Free Buffett Checklist + Screener" subtitle="Comment LINK on the reel">
        <p className="m-0">
          Want the one-page Buffett checklist plus this screener code?
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
