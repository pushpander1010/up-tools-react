import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
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

function LevelCard({ index, spot, support, resistance, keyLevel, tone }) {
  const up = tone === 'up'
  const arrow = up ? '▲' : '▼'
  const color = up ? '#28dc78' : '#ff6b6b'
  return (
    <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-bold text-white">{index}</div>
        <div className="text-lg font-extrabold font-mono" style={{ color }}>{arrow} {spot}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg p-2" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <div className="text-red-300 font-bold">Support</div>
          <div className="text-slate-200 font-mono mt-0.5">{support}</div>
        </div>
        <div className="rounded-lg p-2" style={{ background: 'rgba(40,220,120,0.08)', border: '1px solid rgba(40,220,120,0.25)' }}>
          <div className="text-emerald-300 font-bold">Resistance</div>
          <div className="text-slate-200 font-mono mt-0.5">{resistance}</div>
        </div>
      </div>
      <div className="mt-2 text-xs"><span className="text-amber-300 font-bold">Key level: </span><span className="font-mono text-slate-200">{keyLevel}</span></div>
    </div>
  )
}

function StockPick({ name, buy, target, stop, reason }) {
  return (
    <div className="rounded-xl p-4 border border-emerald-500/25" style={{ background: 'rgba(52,211,153,0.06)' }}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm font-bold text-white">{name}</div>
        <div className="text-sm font-mono text-emerald-300">Buy ₹{buy}</div>
      </div>
      <div className="flex flex-wrap gap-2 my-2">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold" style={{ background: 'rgba(40,220,120,0.15)', color: '#28dc78', border: '1px solid rgba(40,220,120,0.4)' }}>BUY ₹{buy}</span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold" style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.35)' }}>Target ₹{target}</span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.35)' }}>Stop ₹{stop}</span>
      </div>
      <p className="text-xs text-slate-400 m-0">{reason}</p>
    </div>
  )
}

function InfoChip({ tag, tone, title, impact, value }) {
  const map = { bull: { c: '#28dc78', b: 'rgba(40,220,120,0.15)', bd: 'rgba(40,220,120,0.4)', arrow: '▲' }, bear: { c: '#ff6b6b', b: 'rgba(255,77,77,0.15)', bd: 'rgba(255,77,77,0.4)', arrow: '▼' }, neut: { c: '#c0cad8', b: 'rgba(154,167,189,0.15)', bd: 'rgba(154,167,189,0.4)', arrow: '●' } }
  const m = map[tone]
  return (
    <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ background: m.b, color: m.c, border: `1px solid ${m.bd}` }}>{m.arrow} {tag}</div>
        <div className="text-sm font-mono font-bold" style={{ color: m.c }}>{value}</div>
      </div>
      <div className="text-sm font-bold text-white">{title}</div>
      {impact && <div className="text-xs text-slate-400 mt-1">{impact}</div>}
    </div>
  )
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: 'Markets Today — 14 August 2026: Global Cues, News, Levels & Stock Picks',
  datePublished: '2026-08-14',
  description: 'Daily market bulletin for 14 August 2026: global markets, top news with sentiment, Nifty/Bank Nifty/Sensex support-resistance levels, and stocks to watch with buy-target-stop.',
  about: 'Indian stock market daily update 14 August 2026',
}

export default function aimakerich_markets_today() {
  return (
    <ToolLayout
      title="Markets Today — 14 August 2026"
      desc="Daily market bulletin: global cues, top news with market sentiment, Nifty/Bank Nifty/Sensex key levels, and stocks to watch with buy price, target and stop loss for 14 August 2026."
      icon="📰"
      iconBg="linear-gradient(135deg, rgba(0,200,180,0.18), rgba(251,191,36,0.08))"
      category="finance"
      slug="aimakerich/markets-today"
      schema={schema}
      faq={[
        { q: "What are today Nifty and Sensex key levels?", a: "See the levels section above for spot price, support, resistance, and the key level for Nifty, Bank Nifty, and Sensex for 14 August 2026." },
        { q: "Which stocks are in focus today?", a: "Check the stocks to watch section above for analyst picks with buy price, target, and stop loss for 14 August 2026." },
        { q: "How do I read this market bulletin?", a: "Start with global cues, then top news with sentiment tags, then key levels, then stocks to watch. The How to Read section above explains each part." },
        { q: "Is this market bulletin free?", a: "Yes, completely free with no sign-up. Read it online on any device." },
        { q: "Is this investment advice?", a: "No. This bulletin is educational only, not investment advice. Always do your own research and consult a SEBI-registered advisor." },
      ]}
      howItWorks={[
        "Check global cues for overnight market direction.",
        "Read top news with bullish and bearish sentiment tags.",
        "Note Nifty, Bank Nifty, and Sensex support and resistance levels.",
      ]}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="rounded-3xl p-6 mb-6 border border-emerald-500/25" style={{ background: 'linear-gradient(135deg, rgba(0,200,180,0.08), rgba(251,191,36,0.05))' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-300 font-bold mb-1">Daily Market Bulletin</div>
            <h1 className="text-2xl sm:text-3xl font-black text-white m-0">Markets Today · 14 August 2026</h1>
          </div>
          <Link to="/aimakerich/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:border-amber-400/40 transition-all">
            ← All AIMakeRich
          </Link>
        </div>
      </div>

      <Section id="video" icon="🎬" title="Video Bulletin" subtitle="Watch the Markets Today bulletin">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/watch?v=uVhb0VOJwNo" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl p-4 border border-white/10 no-underline group"
            style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 ml-0.5 fill-white"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white m-0">Markets Today — 14 August 2026 daily bulletin</p>
                <p className="text-xs text-slate-400 mt-0.5">Watch on YouTube →</p>
              </div>
            </div>
            <span className="text-indigo-300 text-xs font-semibold whitespace-nowrap">YouTube ↗</span>
          </a>
        </div>
      </Section>

      <WarningBox />

      <Section id="overview" icon="🌏" title="Market Overview" subtitle="Nifty slips a 3rd day; DIIs cushion the dip">
        <p>
          Indian indices closed <b>mixed</b> on 13 August — the Nifty slipped <b>40 points (-0.16%) to 24,395.85</b> for a third
          straight losing session, while the <b>Sensex gained 113.61 (+0.15%) to 78,079.96</b>. <b>Bank Nifty eased 0.43% to
          57,635</b>. India VIX fell <b>2.31% to ~11.42</b>, a calm tape. July CPI hit a <b>19-month high of 4.45%</b> (food 5.52%),
          and Brent crude stayed elevated near <b>$90</b> on the US–Iran peace-talk deadlock — the key overhang.
          Sector rotation ruled: metals and cement fell ~1% while realty, FMCG and defence (top, +1.58%) gained.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <LevelCard index="Nifty 50" spot="24,396" support="24,300–250" resistance="24,520–550" keyLevel="24,400" tone="down" />
          <LevelCard index="Bank Nifty" spot="57,635" support="57,200–100" resistance="57,900–58,000" keyLevel="58,000" tone="down" />
          <LevelCard index="Sensex" spot="78,080" support="77,800–900" resistance="78,300–400" keyLevel="78,000" tone="up" />
        </div>
      </Section>

      <Section id="global" icon="🌍" title="Global Markets" subtitle="Wall Street up, Europe mixed, crude the overhang">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoChip tag="S&P 500" tone="bull" title="+0.56% on soft CPI" impact="US inflation eased Fed rate fears, stocks near record highs" value="+0.6%" />
          <InfoChip tag="NASDAQ" tone="bull" title="Tech-led gains" impact="Composite +0.73% as tech led" value="+0.7%" />
          <InfoChip tag="Dow / FTSE" tone="bear" title="Mixed" impact="Dow flat, FTSE −0.56% as Europe closed lower" value="−0.6%" />
          <InfoChip tag="Crude Brent" tone="bear" title="Elevated near $90" impact="US–Iran peace-talk deadlock keeps crude high" value="$90" />
        </div>
      </Section>

      <Section id="news" icon="📰" title="News Bulletin" subtitle="Top stories with market sentiment">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoChip tag="CPI" tone="bear" title="July CPI 4.45% — 19-mo high" impact="Food inflation accelerated to 5.52% from 5.32%" value="4.45%" />
          <InfoChip tag="Crude" tone="bear" title="Near $90 on Hormuz deadlock" impact="US–Iran peace talks deadlocked, crude elevated" value="$90" />
          <InfoChip tag="FII" tone="bear" title="FIIs net sellers" impact="Foreign investors sold ₹511 Cr in cash on 13 Aug" value="−₹511 Cr" />
          <InfoChip tag="DII" tone="bull" title="DIIs strong buyers" impact="Domestic institutions bought ₹4,353 Cr, cushioning the dip" value="+₹4,353 Cr" />
          <InfoChip tag="India VIX" tone="bull" title="Easing to 11.42" impact="Volatility down 2.31%, calm near-term tape" value="11.42" />
          <InfoChip tag="Sectors" tone="bull" title="Realty / FMCG / Defence up" impact="Defence +1.58% led; metals & cement fell ~1%" value="+1.6%" />
        </div>
        <div className="mt-4">
          <InfoChip tag="Movers" tone="neut" title="Laggards & leaders" impact="Tata Consumer, TMPV, NTPC led; Hindalco, ICICI Bank, UltraTech lagged. Jio Financial rose 2.4%." value="ROTATION" />
        </div>
      </Section>

      <Section id="picks" icon="🎯" title="Stocks to Watch" subtitle="Analyst picks (SBI Securities, week Aug 10-14) — do your own research">
        <div className="rounded-xl p-4 mb-4 border border-amber-500/30" style={{ background: 'rgba(251,191,36,0.06)' }}>
          <div className="text-xs text-amber-200/90 leading-relaxed">⚠️ These are <b>personal picks, not stock recommendations</b>. Do your own research before investing. Views are for education only — consult a SEBI-registered advisor.</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StockPick name="AIA Engineering" buy="4740–4790" target="5125" stop="4600" reason="Downward-sloping trendline breakout on daily; MACD crossed signal line and reclaimed zero line; rising ADX on weekly confirms bullish trend strength. Accumulate in the 4740–4790 zone." />
          <StockPick name="Cochin Shipyard" buy="1505–1525" target="1630" stop="1460" reason="Strong support at 1400 held twice; reclaimed 20/50/100-day EMA, closed above upper Bollinger band two days; RSI jumped to 65. Accumulate in the 1505–1525 zone." />
        </div>
      </Section>

      <Section id="how" icon="🧭" title="How to Read This Bulletin" subtitle="A quick framework for today">
        <div className="space-y-3">
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-white mb-1">📈 Sentiment tags</div>
            <div className="text-xs text-slate-400 leading-relaxed">▲ bullish = supportive for markets · ▼ bearish = negative for markets · ● neutral = no clear direction.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-white mb-1">🎯 Levels</div>
            <div className="text-xs text-slate-400 leading-relaxed">Support is where buyers tend to step in; resistance is where selling tends to appear. Nifty above 24,400 keeps the recovery intact; a break of 24,300 signals weakness.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-white mb-1">🛡️ Stop loss</div>
            <div className="text-xs text-slate-400 leading-relaxed">Always trade with a stop loss. If price hits your stop, exit — it caps your loss if the pick goes wrong.</div>
          </div>
        </div>
      </Section>

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before acting">
        <p>
          This page is <b>educational and informational only</b>, and is <b>not investment, financial or trading advice</b>.
          Market data and levels reflect the close of 13 August 2026 and can change rapidly. The "stocks to watch" are
          <b> analyst picks (SBI Securities) shown for education, not recommendations</b>. Trading and investing involve
          substantial risk of loss — past performance does not predict future results. Always do your own research and
          consult a SEBI-registered advisor before investing. You are solely responsible for your decisions.
        </p>
      </Section>
    </ToolLayout>
  )
}

function WarningBox() {
  return (
    <div className="rounded-xl p-4 mb-6 border border-amber-500/30" style={{ background: 'rgba(251,191,36,0.06)' }}>
      <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1.5">⚠️ Educational Only — Not Financial Advice</div>
      <div className="text-xs text-amber-200/80 leading-relaxed">This daily bulletin is for <b>education and awareness</b>. It is not investment advice and does not recommend buying or selling any security. Market data changes fast — always verify current prices and do your own research before investing.</div>
    </div>
  )
}
