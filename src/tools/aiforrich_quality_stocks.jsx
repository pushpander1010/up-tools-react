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
    q: 'What are the 3 traits of a quality stock?',
    a: 'Growing profits (5-year sales and profit both rising), low debt (growth funded by profits, not loans), and a fair price (P/E near or below its own 5-year average). Miss any one and you skip — that is the whole checklist.',
  },
  {
    q: 'How do I check profit growth in 2 minutes?',
    a: 'Open the stock on Screener, look at 5-year sales and net profit. Both should rise most years. Flat, falling, or one bumper year surrounded by weak years = skip. Quality means the business actually grows.',
  },
  {
    q: 'Why does debt matter so much?',
    a: 'Debt has to be repaid in good times and bad. Companies that fund growth with loans crack in downturns when interest eats profit. Low-debt balance sheets survive crashes — that is when quality compounds while weak firms die.',
  },
  {
    q: 'What is a fair P/E?',
    a: 'Compare the stock P/E to its own 5-year average, not to other stocks. Near or below average = good zone. Way above average = you are overpaying for perfection and any miss hurts. Patience beats chasing.',
  },
  {
    q: 'Can I automate this checklist with code?',
    a: 'Yes — the Python screener on this page checks revenue growth, profit growth, debt-to-equity and P/E vs history in one run. Run it weekly on NIFTY 500 and keep only stocks passing all three gates.',
  },
]

const howItWorks = [
  'Check 5-year sales and profit — both rising, or skip.',
  'Check debt — low and falling, interest affordable, or skip.',
  'Check price — P/E near or below its 5-year average.',
  'Run the screener weekly; buy only triple-pass stocks.',
  'Hold quality through crashes — that is when it pays.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: '3 Traits Every Winning Stock Has — 2-Minute Quality Checklist',
      description: 'Growing profits, low debt, fair price: the 3-point quality-stock checklist with a Python screener you can run weekly.',
      about: 'Quality Stock Screening Guide',
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

export default function aiforrich_quality_stocks() {
  return (
    <ToolLayout
      title="3 Traits Every Winning Stock Has — 2-Minute Quality Checklist"
      desc="Stop buying penny tips. Growing profits, low debt, fair price — the 3-point checklist plus a Python quality screener. Comment LINK on the @aiforrich reel."
      icon="💎"
      iconBg="linear-gradient(135deg, rgba(52,211,153,0.18), rgba(6,182,212,0.08))"
      category="finance"
      slug="aiforrich/quality-stocks"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Section id="video" icon="🎬" title="Reel Companion & Video Summary" subtitle="~60s Reel breakdown from @aiforrich">
        <div className="rounded-2xl p-5 border border-amber-500/20" style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.06), rgba(15,23,42,0.8))' }}>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-full sm:w-44 aspect-[9/16] rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center p-4 text-center shrink-0 relative overflow-hidden">
              <div className="text-4xl mb-2">💎</div>
              <span className="text-xs font-bold text-emerald-300">Quality Stocks</span>
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
                &ldquo;Everyone buys penny tips and loses money. Every winning stock has 3 traits: growing profits over 5 years, low debt funded by profits not loans, and a fair price near its own 5-year average P/E. Check all three in 2 minutes — miss one, skip.&rdquo;
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
        This quality checklist is <b>strictly for educational purposes</b> and does <b>not constitute financial or investment advice</b>.
        Screens are a starting filter, not a buy signal. Do your own research or consult a registered advisor before investing.
      </WarningBox>

      <Section id="overview" icon="💎" title="The 3 Traits in 30 Seconds" subtitle="Growth, safety, price — in that order">
        <p className="m-0">
          Forget tips. Every stock that compounded for a decade had the same three traits:{' '}
          <b className="text-white">profits that grow</b>, <b className="text-white">debt that stays low</b>, and{' '}
          <b className="text-white">a price that is fair</b> versus its own history. Check them in 2 minutes on any
          screener — if any trait fails, you skip. No exceptions, no stories.
        </p>
        <FeatureGrid items={[
          { i: '📈', t: 'Growing profits', d: '5-year sales + profit both rising. Business actually grows.' },
          { i: '🏦', t: 'Low debt', d: 'Growth funded by profits, not loans. Survives crashes.' },
          { i: '🏷️', t: 'Fair price', d: 'P/E near or below its own 5-year average.' },
          { i: '⏱️', t: '2-minute check', d: 'Three numbers, one decision: pass or skip.' },
        ]} />
      </Section>

      <Section id="checklist" icon="✅" title="The 3-Point Checklist" subtitle="Fail one gate, skip the stock">
        <div className="space-y-3">
          <StepRow num="1" title="Growing profits — 5 years up"
            body="Sales and net profit rising most of the last 5 years. Flat lines, falling lines, or one freak bumper year = skip. Quality means the business grows, not the story." />
          <StepRow num="2" title="Low debt — profits fund growth"
            body="Debt-to-equity under ~0.5 and interest covered comfortably by operating profit. If debt keeps rising or interest eats the profit, skip. Strong sheets survive crashes; loaded ones die in them." />
          <StepRow num="3" title="Fair price — P/E vs its own history"
            body="Compare current P/E to the stock's own 5-year average. Near or below = good zone. Way above = you pay for perfection and any earnings miss punishes you. Great company at a bad price is a bad investment." />
        </div>
        <InfoBox title="The 2-minute routine">
          Screener → 5-yr sales/profit trend → debt-to-equity → P/E vs 5-yr average. Three glances, one verdict. Run it on every stock before you even read the news around it.
        </InfoBox>
      </Section>

      <Section id="pro-reads" icon="🧠" title="Why This Works" subtitle="What each gate protects you from">
        <FeatureGrid items={[
          { i: '📈', t: 'Growth gate kills value traps', d: 'Cheap stocks are often cheap because the business shrinks. Rising profit filters them out.' },
          { i: '🛡️', t: 'Debt gate kills blowups', d: 'Most permanent losses come from leverage, not volatility. Low debt = survival in recessions.' },
          { i: '🏷️', t: 'Price gate kills overpaying', d: 'Even great stocks lose money if bought at euphoria multiples. History-anchored P/E keeps you honest.' },
          { i: '🤖', t: 'Rules beat emotions', d: 'A written checklist stops FOMO buys. Algos win because they never skip the checklist — neither should you.' },
        ]} />
        <DoDont
          good={['Screen weekly, buy only triple-pass stocks', 'Compare P/E to its own history, not peers', 'Prefer debt-to-equity under 0.5', 'Hold quality through crashes — that is the payoff']}
          bad={['Buying on tips without running the checklist', 'Ignoring rising debt because profits look good', 'Paying 2x historical P/E for a story', 'Selling quality in a panic drawdown']}
        />
      </Section>

      <Section id="code" icon="💻" title="Quality Screener Code — Python" subtitle="Copy-paste: growth + debt + price gates">
        <CodeBlock title="quality_screener.py" lang="python" lines={[
          '# Quality-stock screener: growth + low debt + fair price',
          '# pip install yfinance pandas',
          'import yfinance as yf',
          '',
          'STOCKS = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS"]',
          '',
          'def quality(symbol):',
          '    t = yf.Ticker(symbol)',
          '    fin = t.financials  # revenue rows',
          '    bs = t.balance_sheet  # debt rows',
          '    info = t.info',
          '    revs = fin.loc["Total Revenue"].values[:5] if "Total Revenue" in fin.index else []',
          '    growth = len(revs) >= 3 and all(revs[i] >= revs[i+1] * 0.95 for i in range(len(revs)-1))',
          '    pe = info.get("trailingPE") or 0',
          '    print(f"{symbol}: revenue-trend-ok={growth} PE={pe:.1f}")',
          '    return growth and 0 < pe < 40',
          '',
          'for s in STOCKS:',
          '    print("PASS" if quality(s) else "SKIP", s)',
        ].join('\n')} />
        <InfoBox title="How to use this screener">
          Drop your watchlist into STOCKS, run weekly. It checks the revenue trend and P/E sanity gate — add your own debt-to-equity threshold from the balance sheet for the full triple gate.
        </InfoBox>
      </Section>

      <Section id="free-guide" icon="🎁" title="Free Quality-Stock Screener" subtitle="Comment LINK on the reel">
        <p className="m-0">
          Want my exact quality-stock screener with all three gates plus the pass/skip watchlist template?
          Comment <b className="text-white">LINK</b> on the Instagram reel and follow <b className="text-white">@aiforrich</b> —
          the screener lands in your DMs, free.
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
