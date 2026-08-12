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

function StockPick({ name, buy, target, stop, reason, ltp }) {
  return (
    <div className="rounded-xl p-4 border border-emerald-500/25" style={{ background: 'rgba(52,211,153,0.06)' }}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm font-bold text-white">{name}</div>
        {ltp && <div className="text-sm font-mono text-emerald-300">CMP ₹{ltp}</div>}
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
  headline: 'Markets Today — 12 August 2026: Global Cues, News, Levels & Stock Picks',
  datePublished: '2026-08-12',
  description: 'Daily market bulletin for 12 August 2026: global markets, top news with sentiment, Nifty/Bank Nifty/Sensex support-resistance levels, and stocks to watch with buy-target-stop.',
  about: 'Indian stock market daily update 12 August 2026',
}

export default function aimakerich_markets_today() {
  return (
    <ToolLayout
      title="Markets Today — 12 August 2026"
      desc="Daily market bulletin: global cues, top news with market sentiment, Nifty/Bank Nifty/Sensex key levels, and stocks to watch with buy price, target and stop loss for 12 August 2026."
      icon="📰"
      iconBg="linear-gradient(135deg, rgba(0,200,180,0.18), rgba(251,191,36,0.08))"
      category="finance"
      slug="aimakerich/markets-today-2026-08-12"
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="rounded-3xl p-6 mb-6 border border-emerald-500/25" style={{ background: 'linear-gradient(135deg, rgba(0,200,180,0.08), rgba(251,191,36,0.05))' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-300 font-bold mb-1">Daily Market Bulletin</div>
            <h1 className="text-2xl sm:text-3xl font-black text-white m-0">Markets Today · 12 August 2026</h1>
          </div>
          <Link to="/aimakerich/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:border-amber-400/40 transition-all">
            ← All AIMakeRich
          </Link>
        </div>
      </div>

      <Section id="video" icon="🎬" title="Video Bulletin" subtitle="Watch the Markets Today bulletin">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/@aimakerich" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl p-4 border border-white/10 no-underline group"
            style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 ml-0.5 fill-white"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white m-0">Markets Today — 12 August 2026 daily bulletin</p>
                <p className="text-xs text-slate-400 mt-0.5">Watch the full channel →</p>
              </div>
            </div>
            <span className="text-indigo-300 text-xs font-semibold whitespace-nowrap">YouTube ↗</span>
          </a>
        </div>
      </Section>

      <WarningBox />

      <Section id="overview" icon="🌏" title="Market Overview" subtitle="Crude and Hormuz keep a lid on the upside">
        <p>
          Indian indices closed <b>lower</b> on 11 August as a <b>crude spike past $85</b> on Strait of Hormuz worries —
          and a softer rupee — outweighed another day of foreign buying. Nifty closed near <b>24,472</b>, Sensex at
          <b> 78,154</b>, and Bank Nifty near <b>57,446</b>. Institutions stayed net buyers, but elevated crude and Middle
          East uncertainty are capping upside while near-term support holds.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <LevelCard index="Nifty 50" spot="24,472" support="24,408–345" resistance="24,556–640" keyLevel="24,650" tone="down" />
          <LevelCard index="Bank Nifty" spot="57,446" support="57,200–56,955" resistance="57,650–58,099" keyLevel="58,000" tone="down" />
          <LevelCard index="Sensex" spot="78,154" support="77,965–776" resistance="78,427–699" keyLevel="78,500" tone="down" />
        </div>
      </Section>

      <Section id="global" icon="🌍" title="Global Markets" subtitle="Asia mixed, crude the key overhang">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoChip tag="Wall Street" tone="neut" title="US pulled back from highs" impact="Slipped off record levels as crude surged" value="−0.2%" />
          <InfoChip tag="Nikkei 225" tone="bear" title="Japan down on crude" impact="Fell ~2% as oil and yen pressures hit" value="−2.0%" />
          <InfoChip tag="Hang Seng" tone="bear" title="Hong Kong soft" impact="Dropped ~0.6% on mixed cues" value="−0.6%" />
          <InfoChip tag="Gift Nifty" tone="neut" title="Flat early cue for Nifty" impact="Trading flat to slightly lower ahead of open" value="24,4xx" />
        </div>
      </Section>

      <Section id="news" icon="📰" title="News Bulletin" subtitle="Top stories with market sentiment">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoChip tag="Crude" tone="bear" title="Crude elevated past $85" impact="Strait of Hormuz / Middle East worries cap risk appetite" value="+4%" />
          <InfoChip tag="RBI" tone="neut" title="RBI: rates likely to stay" impact="Governor Malhotra flags checked inflation, steady stance" value="5.25%" />
          <InfoChip tag="FIIs" tone="bull" title="Foreign institutions net buyers" impact="3rd straight day · bought net ₹259 Cr on Aug 11" value="+₹259Cr" />
          <InfoChip tag="DIIs" tone="bull" title="Domestic institutions turn buyers" impact="Bought net ₹25 Cr after selling a day earlier" value="+₹25Cr" />
          <InfoChip tag="Gold" tone="neut" title="Gold edges lower" impact="Awaiting key US inflation data later this week" value="₹152k" />
          <InfoChip tag="Rupee" tone="bear" title="Rupee under pressure" impact="Near 95.4 vs USD on firm crude" value="95.40" />
        </div>
        <div className="mt-4">
          <InfoChip tag="Earnings" tone="neut" title="Q1 earnings + index moves in focus" impact="Wipro slips on a looming Nifty 50 exit · stock-specific moves to dominate until crude cools" value="Q1" />
        </div>
      </Section>

      <Section id="picks" icon="🎯" title="Stocks to Watch" subtitle="Personal picks — do your own research">
        <div className="rounded-xl p-4 mb-4 border border-amber-500/30" style={{ background: 'rgba(251,191,36,0.06)' }}>
          <div className="text-xs text-amber-200/90 leading-relaxed">⚠️ These are <b>personal picks, not stock recommendations</b>. Do your own research before investing. Views are for education only — consult a SEBI-registered advisor.</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StockPick name="Suven Life Sciences" buy="333" target="365" stop="315" ltp="333" reason="Bullish rounding-bottom breakout holding 20/50-day EMA support; RSI turning up, HH-HL intact. Target 365." />
          <StockPick name="Poly Medicure" buy="1772" target="1920" stop="1655" ltp="1772" reason="Breakout from consolidation above 200-day EMA on a volume spike; RSI 62.8, above all key EMAs. Target 1920." />
          <StockPick name="Raghav Productivity" buy="1314" target="1400" stop="1250" ltp="1314" reason="Rebound off prior breakout zone with a volume surge; RSI up from midpoint. Target 1400." />
          <StockPick name="Steel Strips Wheels" buy="322" target="350" stop="305" ltp="322" reason="Uptrend resuming above 200-day EMA after shallow pullback; shallow retrace + sharp rebound. Target 350." />
          <StockPick name="Brigade Enterprises" buy="608" target="650" stop="588" ltp="608" reason="Breakout above 200-day EMA with volume expansion; sustaining above key averages. Target 650." />
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
            <div className="text-xs text-slate-400 leading-relaxed">Support is where buyers tend to step in; resistance is where selling tends to appear. A close above resistance or below support signals the next move.</div>
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
          Market data and levels reflect the morning of 12 August 2026 and can change rapidly. The "stocks to watch" are
          <b> personal picks and not recommendations</b>. Trading and investing involve substantial risk of loss — past
          performance does not predict future results. Always do your own research and consult a SEBI-registered advisor
          before investing. You are solely responsible for your decisions.
        </p>
      </Section>
    </ToolLayout>
  )
}

function WarningBox() {
  return (
    <div className="rounded-xl p-4 mb-6 border border-amber-500/30" style={{ background: 'rgba(251,191,36,0.06)' }}>
      <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1.5">⚠️ Not Financial Advice</div>
      <div className="text-xs text-amber-200/80 leading-relaxed">This is a daily market bulletin for education. The stock picks are <b>personal views, not recommendations</b>. Data is as of the morning of 12 August 2026 and may change intraday. Do your own research and consult a SEBI-registered advisor before investing.</div>
    </div>
  )
}
