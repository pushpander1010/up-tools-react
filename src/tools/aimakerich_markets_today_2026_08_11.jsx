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
  headline: 'Markets Today — 11 August 2026: Global Cues, News, Levels & Stock Picks',
  datePublished: '2026-08-11',
  description: 'Daily market bulletin for 11 August 2026: global markets, top news with sentiment, Nifty/Bank Nifty/Sensex support-resistance levels, and stocks to watch with buy-target-stop.',
  about: 'Indian stock market daily update 11 August 2026',
}

export default function aimakerich_markets_today() {
  return (
    <ToolLayout
      title="Markets Today — 11 August 2026"
      desc="Daily market bulletin: global cues, top news with market sentiment, Nifty/Bank Nifty/Sensex key levels, and stocks to watch with buy price, target and stop loss for 11 August 2026."
      icon="📰"
      iconBg="linear-gradient(135deg, rgba(0,200,180,0.18), rgba(251,191,36,0.08))"
      category="finance"
      slug="aimakerich/markets-today-2026-08-11"
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="rounded-3xl p-6 mb-6 border border-emerald-500/25" style={{ background: 'linear-gradient(135deg, rgba(0,200,180,0.08), rgba(251,191,36,0.05))' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-300 font-bold mb-1">Daily Market Bulletin</div>
            <h1 className="text-2xl sm:text-3xl font-black text-white m-0">Markets Today · 11 August 2026</h1>
          </div>
          <Link to="/aimakerich/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:border-amber-400/40 transition-all">
            ← All AIMakeRich
          </Link>
        </div>
      </div>

      <Section id="video" icon="🎬" title="Video Bulletin" subtitle="Watch the Markets Today bulletin">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/watch?v=tKQQSEpA8UU" target="_blank" rel="noopener noreferrer"
            className="block rounded-xl overflow-hidden border border-white/10 no-underline"
            style={{ background: '#000' }}>
            <div className="aspect-video w-full overflow-hidden relative">
              <img src="https://i.ytimg.com/vi/tKQQSEpA8UU/hqdefault.jpg"
                alt="Markets Today — 11 August 2026 daily market bulletin" loading="lazy"
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 ml-1 fill-white"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-sm font-semibold text-white">Markets Today — 11 August 2026 daily bulletin</p>
              </div>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox />

      <Section id="overview" icon="🌏" title="Market Overview" subtitle="Cautious and range-bound, crude the key drag">
        <p>
          Indian indices opened <b>flat to slightly lower</b> on 11 August as a <b>4% jump in crude oil past $85</b> —
          on Strait of Hormuz worries — outweighed strong earnings and renewed foreign buying. Nifty is around
          <b>24,575</b>, Sensex near <b>78,250</b>, and Bank Nifty just above <b>57,600</b>. Foreign institutions stayed net
          buyers, but elevated crude and Middle East uncertainty are capping upside while support holds.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <LevelCard index="Nifty 50" spot="24,575" support="24,523–462" resistance="24,633–682" keyLevel="24,633" tone="down" />
          <LevelCard index="Bank Nifty" spot="57,687" support="57,255–471" resistance="57,959–58,232" keyLevel="58,000" tone="down" />
          <LevelCard index="Sensex" spot="78,245" support="78,000–200" resistance="78,500–800" keyLevel="78,500" tone="down" />
        </div>
      </Section>

      <Section id="global" icon="🌍" title="Global Markets" subtitle="Wall Street eases, Asia mixed on crude">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoChip tag="Wall Street" tone="bear" title="US eased off record high" impact="Slipped from all-time high as crude surged" value="−0.2%" />
          <InfoChip tag="Nikkei 225" tone="bear" title="Japan −2% on crude" impact="Fell ~1,364 pts to 66,970 — crude drag" value="−2.0%" />
          <InfoChip tag="Hang Seng" tone="bear" title="Hong Kong weak" impact="Dropped ~0.6% on mixed cues" value="−0.6%" />
          <InfoChip tag="Gift Nifty" tone="neut" title="Flat early cue for Nifty" impact="Down 13 pts at 24,618 — flat open" value="24,618" />
        </div>
      </Section>

      <Section id="news" icon="📰" title="News Bulletin" subtitle="Top stories with market sentiment">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoChip tag="RBI" tone="neut" title="Repo rate held at 5.25%" impact="4th straight hold · neutral, data-dependent stance" value="5.25%" />
          <InfoChip tag="Crude" tone="bear" title="Crude jumps 4%, past $85" impact="Strait of Hormuz / Middle East worries cap risk" value="+4%" />
          <InfoChip tag="FIIs" tone="bull" title="Foreign institutions net buyers" impact="2nd straight day · bought ₹1,975 Cr on Aug 10" value="+₹1,975Cr" />
          <InfoChip tag="DIIs" tone="bear" title="Domestic institutions net sellers" impact="Offloaded ₹1,290 Cr on Aug 10" value="−₹1,290Cr" />
          <InfoChip tag="Gold" tone="bull" title="Gold firm near record" impact="24K ~₹152,199/10g, up on risk-off" value="₹152,199" />
          <InfoChip tag="Rupee" tone="bear" title="Rupee under pressure" impact="Near 95.4 vs USD on firm crude" value="95.40" />
        </div>
        <div className="mt-4">
          <InfoChip tag="Earnings" tone="bull" title="Earnings + IPOs drive the moves" impact="SBI +2% on Q1 beat (net profit +10% · ₹21,121 Cr) · Adani Ports leads · Bharat Forge & Info Edge in focus · IPO rush: Shiprocket, Milky Mist, Dhoot Transmission" value="Q1" />
        </div>
      </Section>

      <Section id="picks" icon="🎯" title="Stocks to Watch" subtitle="Personal picks — do your own research">
        <div className="rounded-xl p-4 mb-4 border border-amber-500/30" style={{ background: 'rgba(251,191,36,0.06)' }}>
          <div className="text-xs text-amber-200/90 leading-relaxed">⚠️ These are <b>personal picks, not stock recommendations</b>. Do your own research before investing. Views are for education only — consult a SEBI-registered advisor.</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StockPick name="Mazagon Dock" buy="2575" target="2684" stop="2487" ltp="2575" reason="Descending trendline breakout; higher highs above short-term EMAs. Buy 2574–75 for 2684." />
          <StockPick name="ICICI Lombard" buy="1649" target="1740" stop="1575" ltp="1649" reason="Positive RSI divergence off 200-week EMA; bullish reversal candles near demand zone. Target 1740." />
          <StockPick name="JSW Energy" buy="578" target="600" stop="559" ltp="578" reason="Consolidation breakout on the upside, above 20 & 40-day EMAs with bullish momentum crossover. Target 600." />
          <StockPick name="DLF" buy="660" target="694" stop="632" ltp="660" reason="Triangle pattern breakout above short-term averages and the 200-day EMA. Target 694." />
          <StockPick name="Aurobindo Pharma" buy="1666" target="1695" stop="1637" ltp="1666" reason="Bullish momentum into resistance; uptrend intact above support. Target 1695." />
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
          Market data and levels reflect the morning of 11 August 2026 and can change rapidly. The "stocks to watch" are
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
