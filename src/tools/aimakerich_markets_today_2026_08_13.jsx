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
  headline: 'Markets Today — 13 August 2026: Global Cues, News, Levels & Stock Picks',
  datePublished: '2026-08-13',
  description: 'Daily market bulletin for 13 August 2026: global markets, top news with sentiment, Nifty/Bank Nifty/Sensex support-resistance levels, and stocks to watch with buy-target-stop.',
  about: 'Indian stock market daily update 13 August 2026',
}

export default function aimakerich_markets_today() {
  return (
    <ToolLayout
      title="Markets Today — 13 August 2026"
      desc="Daily market bulletin: global cues, top news with market sentiment, Nifty/Bank Nifty/Sensex key levels, and stocks to watch with buy price, target and stop loss for 13 August 2026."
      icon="📰"
      iconBg="linear-gradient(135deg, rgba(0,200,180,0.18), rgba(251,191,36,0.08))"
      category="finance"
      slug="aimakerich/markets-today-2026-08-13"
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="rounded-3xl p-6 mb-6 border border-emerald-500/25" style={{ background: 'linear-gradient(135deg, rgba(0,200,180,0.08), rgba(251,191,36,0.05))' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-300 font-bold mb-1">Daily Market Bulletin</div>
            <h1 className="text-2xl sm:text-3xl font-black text-white m-0">Markets Today · 13 August 2026</h1>
          </div>
          <Link to="/aimakerich/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:border-amber-400/40 transition-all">
            ← All AIMakeRich
          </Link>
        </div>
      </div>

      <Section id="video" icon="🎬" title="Video Bulletin" subtitle="Watch the Markets Today bulletin">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/watch?v=cUiP-4xmyp4" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl p-4 border border-white/10 no-underline group"
            style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 ml-0.5 fill-white"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white m-0">Markets Today — 13 August 2026 daily bulletin</p>
                <p className="text-xs text-slate-400 mt-0.5">Watch on YouTube →</p>
              </div>
            </div>
            <span className="text-indigo-300 text-xs font-semibold whitespace-nowrap">YouTube ↗</span>
          </a>
        </div>
      </Section>

      <WarningBox />

      <Section id="overview" icon="🌏" title="Market Overview" subtitle="Banks firm while crude caps the upside">
        <p>
          Indian indices drifted <b>marginally lower</b> on 12 August as elevated crude — Brent past <b>$88</b> on Strait
          of Hormuz worries — kept a lid on risk appetite. Nifty closed near <b>24,436</b>, Sensex at <b>77,966</b>, but
          <b> Bank Nifty stayed firm</b> near <b>57,885</b> with PSU banks leading. India VIX stayed low around <b>12.2</b>,
          a calm tape. Sector rotation was the theme: banks and metals held up while IT and FMCG slipped.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <LevelCard index="Nifty 50" spot="24,436" support="24,310–184" resistance="24,500–599" keyLevel="24,500" tone="down" />
          <LevelCard index="Bank Nifty" spot="57,885" support="57,465–043" resistance="58,097–307" keyLevel="58,000" tone="up" />
          <LevelCard index="Sensex" spot="77,966" support="77,800–965" resistance="78,300–500" keyLevel="78,000" tone="down" />
        </div>
      </Section>

      <Section id="global" icon="🌍" title="Global Markets" subtitle="Mixed Asia, crude the key overhang">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoChip tag="Wall Street" tone="neut" title="US pulled back on weak chips" impact="Chipmakers slipped on Hormuz uncertainty" value="−0.2%" />
          <InfoChip tag="Nikkei 225" tone="bull" title="Asia firm" impact="Tokyo held gains amid mixed regional cues" value="+0.6%" />
          <InfoChip tag="Hang Seng" tone="bear" title="Hong Kong soft" impact="Dropped ~1.2% on weak cues" value="−1.2%" />
          <InfoChip tag="Crude Brent" tone="bear" title="Elevated on Hormuz" impact="Brent near $88, highest since late July" value="$88" />
        </div>
      </Section>

      <Section id="news" icon="📰" title="News Bulletin" subtitle="Top stories with market sentiment">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoChip tag="Crude" tone="bear" title="Crude +4% past $88" impact="Strait of Hormuz worry caps risk appetite" value="+4%" />
          <InfoChip tag="Grasim" tone="bull" title="Q1 net profit +51%" impact="Cement leader beat estimates, stock-specific strength" value="+51%" />
          <InfoChip tag="India VIX" tone="bull" title="Low volatility ~12.2" impact="Calm tape, range-bound market" value="12.2" />
          <InfoChip tag="Bank Nifty" tone="bull" title="Firm, PSU banks lead" impact="Banking resilient near the 58,000 mark" value="+0.8%" />
          <InfoChip tag="Nifty IT" tone="bear" title="Tech under pressure" impact="Sector slipped ~1.5% as IT lagged" value="−1.5%" />
          <InfoChip tag="FMCG" tone="bear" title="Consumer soft" impact="FMCG fell ~0.7% on weak demand cues" value="−0.7%" />
        </div>
        <div className="mt-4">
          <InfoChip tag="Movers" tone="bull" title="Sector rotation in focus" impact="Hindalco among top gainers · metals firm · watch stock-specific moves until crude cools" value="ROTATION" />
        </div>
      </Section>

      <Section id="picks" icon="🎯" title="Stocks to Watch" subtitle="Personal picks — do your own research">
        <div className="rounded-xl p-4 mb-4 border border-amber-500/30" style={{ background: 'rgba(251,191,36,0.06)' }}>
          <div className="text-xs text-amber-200/90 leading-relaxed">⚠️ These are <b>personal picks, not stock recommendations</b>. Do your own research before investing. Views are for education only — consult a SEBI-registered advisor.</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StockPick name="Indian Overseas Bank" buy="895" target="905" stop="889" ltp="895" reason="Bullish F&O setup, buy 895 · target 905 · stop 889. Banking strength supportive." />
          <StockPick name="Aurobindo Pharma" buy="1666" target="1695" stop="1637" ltp="1666" reason="Positive bias in pharma, buy 1666 · target 1695 · stop 1637." />
          <StockPick name="Trent 3000 PE" buy="69" target="92" stop="57" ltp="69" reason="Options pick — buy Trent 3000 Put at 69, target 92, stop 57 (bearish view)." />
          <StockPick name="Hindalco" buy="1078" target="1170" stop="1040" ltp="1078" reason="Top gainer, metals firm. Buy above 1,078 breakout zone with momentum." />
          <StockPick name="LIC Housing Finance" buy="569" target="615" stop="550" ltp="569" reason="Open=low bullish breakout at 568.68. Buy above 569, ride the breakout." />
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
          Market data and levels reflect the morning of 13 August 2026 and can change rapidly. The "stocks to watch" are
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
      <div className="text-xs text-amber-200/80 leading-relaxed">This is a daily market bulletin for education. The stock picks are <b>personal views, not recommendations</b>. Data is as of the morning of 13 August 2026 and may change intraday. Do your own research and consult a SEBI-registered advisor before investing.</div>
    </div>
  )
}
