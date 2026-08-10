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
  headline: 'Markets Today — 10 August 2026: Global Cues, News, Levels & Stock Picks',
  datePublished: '2026-08-10',
  description: 'Daily market bulletin for 10 August 2026: global markets, top news with sentiment, Nifty/Bank Nifty/Sensex support-resistance levels, and stocks to watch with buy-target-stop.',
  about: 'Indian stock market daily update 10 August 2026',
}

export default function aimakerich_markets_today() {
  return (
    <ToolLayout
      title="Markets Today — 10 August 2026"
      desc="Daily market bulletin: global cues, top news with market sentiment, Nifty/Bank Nifty/Sensex key levels, and stocks to watch with buy price, target and stop loss for 10 August 2026."
      icon="📰"
      iconBg="linear-gradient(135deg, rgba(0,200,180,0.18), rgba(251,191,36,0.08))"
      category="finance"
      slug="aimakerich/markets-today"
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="rounded-3xl p-6 mb-6 border border-emerald-500/25" style={{ background: 'linear-gradient(135deg, rgba(0,200,180,0.08), rgba(251,191,36,0.05))' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-300 font-bold mb-1">Daily Market Bulletin</div>
            <h1 className="text-2xl sm:text-3xl font-black text-white m-0">Markets Today · 10 August 2026</h1>
          </div>
          <Link to="/aimakerich/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:border-amber-400/40 transition-all">
            ← All AIMakeRich
          </Link>
        </div>
      </div>

      <WarningBox />

      <Section id="overview" icon="🌏" title="Market Overview" subtitle="Range-bound with a mildly constructive bias">
        <p>
          Indian indices opened <b>mildly positive</b> on 10 August, helped by supportive global cues, but stayed
          range-bound as crude oil near <b>$79</b> and Hormuz-jitters kept gains in check. Nifty is around <b>24,570</b>,
          Sensex near <b>78,500</b>, and Bank Nifty just below <b>58,000</b>. The undertone is constructive above key
          support, but no confirmed breakout yet.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <LevelCard index="Nifty 50" spot="24,570" support="24,300–370" resistance="24,700–750" keyLevel="24,600" tone="up" />
          <LevelCard index="Bank Nifty" spot="57,746" support="57,200–400" resistance="58,000–200" keyLevel="58,000" tone="down" />
          <LevelCard index="Sensex" spot="78,499" support="78,000–200" resistance="78,800–79,000" keyLevel="78,800" tone="up" />
        </div>
      </Section>

      <Section id="global" icon="🌍" title="Global Markets" subtitle="Wall Street higher, Asia mixed">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoChip tag="Wall Street" tone="bull" title="US markets closed higher Friday" impact="Tech-led rally after soft US jobs data eased rate-hike fears" value="+0.3%" />
          <InfoChip tag="Nikkei 225" tone="bull" title="Japan tech rally" impact="Gained ~2% to 66,924" value="+2.0%" />
          <InfoChip tag="Hang Seng" tone="bear" title="Hong Kong weak" impact="Fell ~0.6% on mixed cues" value="−0.6%" />
          <InfoChip tag="Gift Nifty" tone="bull" title="Early cue for Nifty" impact="Up 45 pts at 24,686 — mildly positive open" value="+45" />
        </div>
      </Section>

      <Section id="news" icon="📰" title="News Bulletin" subtitle="Top stories with market sentiment">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoChip tag="RBI" tone="neut" title="Repo rate held at 5.25%" impact="Neutral, data-dependent stance — no surprise hike" value="5.25%" />
          <InfoChip tag="VIX" tone="bear" title="India VIX jumps ~5%" impact="Volatility picking up to 12.65" value="12.65" />
          <InfoChip tag="FIIs" tone="bull" title="Foreign institutions net buyers" impact="Bought ₹480 Cr on Aug 7" value="+₹480Cr" />
          <InfoChip tag="DIIs" tone="bull" title="Domestic institutions net buyers" impact="Added ₹236 Cr" value="+₹236Cr" />
          <InfoChip tag="Crude" tone="bear" title="Crude near $79" impact="Hormuz uncertainty keeps energy elevated" value="$79" />
          <InfoChip tag="Rupee" tone="bear" title="Rupee at 95.25" impact="Down ~8 paise in early trade" value="95.25" />
        </div>
        <div className="mt-4">
          <InfoChip tag="Earnings" tone="bull" title="Earnings driving the moves" impact="SBI +2% & Titan +2% on strong Q1 · Hitachi Energy +8% · Delhivery −4% on weak quarter · IPOs: Dhoot Transmission & LEAP India in focus" value="Q1" />
        </div>
      </Section>

      <Section id="picks" icon="🎯" title="Stocks to Watch" subtitle="Personal picks — do your own research">
        <div className="rounded-xl p-4 mb-4 border border-amber-500/30" style={{ background: 'rgba(251,191,36,0.06)' }}>
          <div className="text-xs text-amber-200/90 leading-relaxed">⚠️ These are <b>personal picks, not stock recommendations</b>. Do your own research before investing. Views are for education only — consult a SEBI-registered advisor.</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StockPick name="Physicswallah" buy="131.5" target="140" stop="127" ltp="131.5" reason="Strong bullish candle off the 50-day EMA; RSI back above 54. Buy for a move toward 140." />
          <StockPick name="Grasim Industries" buy="3323" target="3555" stop="3200" ltp="3323" reason="Fresh breakout to new highs; trending above all key EMAs; RSI 64. Target 3555." />
          <StockPick name="Fortis Healthcare" buy="955" target="1020" stop="920" ltp="955" reason="Bullish rebound off the 200-day EMA; reclaimed short & medium EMAs. Target 1020." />
          <StockPick name="BEML" buy="1788" target="1913" stop="1725" ltp="1788" reason="Bullish recovery candle off support with rising volume; RSI turning up. Target 1913." />
          <StockPick name="Honasa Consumer" buy="478" target="512" stop="460" ltp="478" reason="Expansion above all key EMAs; RSI 68.6 strong momentum. Target 512." />
        </div>
      </Section>

      <Section id="how" icon="🧭" title="How to Read This Bulletin" subtitle="A quick framework for tomorrow">
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
          Market data and levels reflect the morning of 10 August 2026 and can change rapidly. The "stocks to watch" are
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
      <div className="text-xs text-amber-200/80 leading-relaxed">This is a daily market bulletin for education. The stock picks are <b>personal views, not recommendations</b>. Data is as of the morning of 10 August 2026 and may change intraday. Do your own research and consult a SEBI-registered advisor before investing.</div>
    </div>
  )
}
