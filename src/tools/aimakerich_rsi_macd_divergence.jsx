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

// One terminal, switchable between languages via tabs.
function CodeTabs({ tabs, intro }) {
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
  { q: 'What is RSI + MACD divergence?', a: 'Divergence happens when price and a momentum indicator like RSI or MACD move in opposite directions. A bearish divergence forms when price makes a higher high but RSI/MACD makes a lower high — momentum is fading. A bullish divergence forms when price makes a lower low but RSI/MACD makes a higher low — sellers are running out of fuel. It signals a possible reversal, not a guaranteed one.' },
  { q: 'Why use both RSI and MACD?', a: 'RSI is best at telling you when momentum is overbought or oversold, while MACD shows the direction and speed of the trend. RSI gives you the early warning (the divergence), and MACD provides a clean confirmation signal when its lines cross. Combining them filters out many false calls.' },
  { q: 'Is divergence a buy or sell signal by itself?', a: 'No. Divergence is a warning that the trend is losing strength, not a trigger to trade. Smart traders wait for confirmation — for example a MACD cross or a break of a support/resistance level — before acting. Front-running a divergence without confirmation is a common way to lose money.' },
  { q: 'What timeframes does it work on?', a: 'It works on any timeframe, but the higher the timeframe (daily, weekly) the more reliable the divergence signal. On 1-minute or 5-minute charts there is a lot of noise and many false divergences. For retail algo trading, daily bars are a solid, honest starting point.' },
  { q: 'How do I code this strategy?', a: 'In Python use pandas and a TA library like ta or pandas-ta to compute RSI and MACD, then scan for pivot highs/lows where price and indicator disagree. The code in the starter below shows the full pattern-detection loop you can adapt.' },
  { q: 'Does this strategy guarantee profits?', a: 'No strategy guarantees profits. Divergence works best in ranging and early-reversal markets and produces many false signals in strong trends. Always backtest with fees and slippage, paper-trade, and never risk money you cannot afford to lose.' },
  { q: 'Is this legal to trade in India?', a: 'Yes. Retail algo trading is legal in India. SEBI requires that algo orders be certified by your broker with an API key before they are routed. Always trade through a SEBI-registered broker with a public API.' },
]

const howItWorks = [
  'Compute RSI (14) and MACD (12, 26, 9) on your price data.',
  'Find the last two significant highs (or lows) in price and compare them with the corresponding RSI/MACD peaks.',
  'If price makes a higher high but RSI/MACD makes a lower high → bearish divergence (sell warning).',
  'If price makes a lower low but RSI/MACD makes a higher low → bullish divergence (buy warning).',
  'Wait for confirmation (a MACD cross or a break of a level), then enter with a stop-loss.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'RSI + MACD Divergence Strategy — Full Guide with Python, Java & C++ Code',
      description: 'Learn the RSI + MACD divergence trading strategy: how to spot bullish and bearish divergences, confirm them with MACD crosses, and code the pattern detector in Python, Java and C++. Includes backtesting tips and risk rules.',
      about: 'RSI MACD divergence trading strategy',
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

export default function aimakerich_rsi_macd_divergence() {
  return (
    <ToolLayout
      title="RSI + MACD Divergence — Spot Reversals Early"
      desc="Learn the RSI + MACD divergence strategy: detect bullish and bearish divergences, confirm them with MACD crosses, and code the detector in Python, Java and C++. Full guide with backtesting and risk rules."
      icon="📉"
      iconBg="linear-gradient(135deg, rgba(251,191,36,0.18), rgba(0,200,180,0.08))"
      category="finance"
      slug="aimakerich/rsi-macd-divergence"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      <WarningBox>
        This page is <b>for education only</b> and is <b>not financial advice</b>. Divergence is a warning, not a
        guaranteed signal — it produces many false calls, especially in strong trends. Always <b>backtest and paper-trade</b>
        first, use stop-losses, and only risk money you can afford to lose. In India, algo orders must be routed through a
        <b> SEBI-registered broker</b> with a certified API key. Consult a qualified financial advisor before trading.
      </WarningBox>

      <Section id="overview" icon="📉" title="What is RSI + MACD Divergence?" subtitle="When price and momentum disagree, a reversal may be near">
        <p>
          <b>Divergence</b> is the gap between what price is doing and what a momentum indicator is doing. Price and
          indicators like <b>RSI</b> or <b>MACD</b> normally move together. When they split, the market is quietly telling you the
          current move is running out of energy.
        </p>
        <p>
          There are two types:
        </p>
        <FeatureGrid items={[
          { i: '🔻', t: 'Bearish divergence', d: 'Price makes a HIGHER HIGH, but RSI/MACD makes a LOWER high. The rally is fading — a drop may follow.' },
          { i: '🔺', t: 'Bullish divergence', d: 'Price makes a LOWER LOW, but RSI/MACD makes a HIGHER low. The sell-off is losing drive — a bounce may follow.' },
          { i: '⚠️', t: 'It is a warning', d: 'Divergence flags a possible reversal. It does NOT tell you exactly when to enter.' },
          { i: '✅', t: 'Needs confirmation', d: 'Wait for a MACD cross or a level break to confirm before you act.' },
        ]} />
      </Section>

      <Section id="why-both" icon="🧩" title="Why Use Both RSI and MACD?" subtitle="Each indicator covers the other's blind spot">
        <InfoBox title="RSI = the early warning">
          The Relative Strength Index (14) moves between 0 and 100. Reading it above 70 (overbought) or below 30 (oversold)
          helps you spot divergences early — momentum is at its limit before price shows it.
        </InfoBox>
        <InfoBox title="MACD = the confirmation">
          MACD (12, 26, 9) tracks the speed and direction of the trend. Its signal-line cross is a clean, objective
          confirmation. RSI says "something may turn", MACD says "it is turning now".
        </InfoBox>
        <InfoBox title="The combo">
          Use RSI for the divergence signal, then wait for a MACD cross to enter. This filters out many of the false
          divergences that appear in trending markets.
        </InfoBox>
      </Section>

      <Section id="pattern" icon="🔍" title="How to Spot a Divergence" subtitle="A three-step mental model">
        <StepRow num={1} title="Mark the pivot points" body="Find the last two significant price highs (for a bearish setup) or lows (for a bullish setup). A pivot is a bar that is higher than the bars on both sides." />
        <StepRow num={2} title="Compare with the indicator" body="Look at the RSI or MACD value at those same two bars. Does the indicator agree with price — or disagree?" />
        <StepRow num={3} title="Judge the disagreement" body="Price higher high + indicator lower high = bearish. Price lower low + indicator higher low = bullish. The bigger and cleaner the split, the stronger the signal." />
        <StepRow num={4} title="Confirm, then act" body="Never trade the divergence alone. Wait for a MACD signal-line cross or a break of a nearby level, then enter with a stop-loss." />
      </Section>

      <Section id="code" icon="💻" title="Starter Code" subtitle="One terminal — switch between Python, Java and C++">
        <p>Three ready-to-run divergence detectors. Use the buttons to <b>switch languages</b> inside the same terminal.
        <b>Python</b> is the easiest entry point with real data, <b>Java</b> suits a scheduled production service, and
        <b>C++</b> is for fast backtesting engines. Each prints the buy/sell warnings it finds.</p>
        <CodeTabs tabs={[
          {
            lang: 'Python', icon: '🐍', title: 'rsi_macd_divergence.py',
            desc: 'A real-data RSI + MACD divergence detector using pandas and the ta library. It finds pivot highs/lows, compares them with RSI peaks, and flags bearish/bullish divergences. Run it: pip install pandas yfinance ta && python rsi_macd_divergence.py. Remember to confirm with a MACD cross before trading.',
            lines: `import pandas as pd
import yfinance as yf
from ta.momentum import RSIIndicator
from ta.trend import MACD

# 1) Daily data for a symbol (Indian or global)
df = yf.download("RELIANCE.NS", start="2020-01-01", auto_adjust=True)
close = df["Close"]

# 2) Indicators
df["RSI"] = RSIIndicator(close, window=14).rsi()
macd = MACD(close, window_slow=26, window_fast=12, window_sign=9)
df["MACD"] = macd.macd()

def pivots(series, order=5):
    """Return indices that are local highs/lows over +/-order bars."""
    highs, lows = [], []
    v = series.values
    for i in range(order, len(v) - order):
        win = v[i - order:i + order + 1]
        if v[i] == win.max(): highs.append(i)
        if v[i] == win.min(): lows.append(i)
    return highs, lows

hi, lo = pivots(df["RSI"])
for i in range(1, len(hi)):
    p1, p2 = hi[i - 1], hi[i]
    # price higher high but RSI lower high  -> bearish divergence
    if close.iloc[p2] > close.iloc[p1] and df["RSI"].iloc[p2] < df["RSI"].iloc[p1]:
        print(f"BEARISH divergence at {df.index[p2].date()}  close={close.iloc[p2]:.1f}")

for i in range(1, len(lo)):
    p1, p2 = lo[i - 1], lo[i]
    # price lower low but RSI higher low  -> bullish divergence
    if close.iloc[p2] < close.iloc[p1] and df["RSI"].iloc[p2] > df["RSI"].iloc[p1]:
        print(f"BULLISH divergence at {df.index[p2].date()}  close={close.iloc[p2]:.1f}")
print("Done. Wait for a MACD cross to confirm before trading.")`,
          },
          {
            lang: 'Java', icon: '☕', title: 'DivergenceScanner.java',
            desc: 'The same idea in Java — computes a simple RSI from sample closes, finds pivot highs/lows, and prints divergence warnings. Drop it into a scheduled job or a Spring service that polls a broker feed. Run it: javac DivergenceScanner.java && java DivergenceScanner.',
            lines: `public class DivergenceScanner {
    // Sample daily closes (in production load these from CSV or a feed)
    static double[] close = {100,102,101,103,104,106,105,107,108,106,
                             109,108,110,109,107,105,104,102,103,105};
    static int n = close.length;

    // Wilder RSI with period 14
    static double[] rsi() {
        double[] r = new double[n];
        double gain = 0, loss = 0;
        for (int i = 1; i < n; i++) {
            double ch = close[i] - close[i-1];
            gain = (gain * 13 + Math.max(ch, 0)) / 14;
            loss = (loss * 13 + Math.max(-ch, 0)) / 14;
            r[i] = loss == 0 ? 100 : 100 - 100 / (1 + gain / loss);
        }
        return r;
    }

    public static void main(String[] args) {
        double[] r = rsi();
        int order = 2;
        for (int i = order; i < n - order; i++) {
            // local low
            boolean isLow = true;
            for (int j = -order; j <= order; j++)
                if (j != 0 && close[i + j] <= close[i]) isLow = false;
            // local high
            boolean isHigh = true;
            for (int j = -order; j <= order; j++)
                if (j != 0 && close[i + j] >= close[i]) isHigh = false;
            if (isHigh && i - order >= 0 && r[i] < r[i - order]
                && close[i] > close[i - order])
                System.out.println("BEARISH divergence at bar " + i);
            if (isLow && i - order >= 0 && r[i] > r[i - order]
                && close[i] < close[i - order])
                System.out.println("BULLISH divergence at bar " + i);
        }
        System.out.println("Confirm with MACD cross before trading.");
    }
}`,
          },
          {
            lang: 'C++', icon: '⚙️', title: 'divergence.cpp',
            desc: 'A fast C++ divergence scanner — ideal to embed in a backtesting engine. It tracks local price/RSI pivots and prints bullish and bearish divergence warnings over the whole series. Run it: g++ -O2 divergence.cpp -o div && ./div.',
            lines: `#include <bits/stdc++.h>
using namespace std;

vector<double> rsi(const vector<double>& c, int period = 14) {
    int n = (int)c.size();
    vector<double> r(n, 50.0);
    double gain = 0, loss = 0;
    for (int i = 1; i < n; i++) {
        double ch = c[i] - c[i-1];
        gain = (gain * (period - 1) + max(ch, 0.0)) / period;
        loss = (loss * (period - 1) + max(-ch, 0.0)) / period;
        r[i] = loss == 0 ? 100.0 : 100.0 - 100.0 / (1.0 + gain / loss);
    }
    return r;
}

int main() {
    vector<double> close = {100,102,101,103,104,106,105,107,108,106,
                            109,108,110,109,107,105,104,102,103,105};
    vector<double> r = rsi(close);
    int n = close.size(), order = 2;
    for (int i = order; i < n - order; i++) {
        bool isHigh = true, isLow = true;
        for (int j = -order; j <= order; j++) {
            if (j == 0) continue;
            if (close[i+j] >= close[i]) isHigh = false;
            if (close[i+j] <= close[i]) isLow  = false;
        }
        if (isHigh && close[i] > close[i-order] && r[i] < r[i-order])
            cout << "BEARISH divergence at bar " << i << "\\n";
        if (isLow && close[i] < close[i-order] && r[i] > r[i-order])
            cout << "BULLISH divergence at bar " << i << "\\n";
    }
    cout << "Confirm with MACD cross before trading.\\n";
    return 0;
}`,
          },
        ]} />
      </Section>

      <Section id="confirmation" icon="✅" title="Confirm Before You Enter" subtitle="Divergence warns, MACD confirms">
        <div className="space-y-3">
          <InfoBox title="The signal-line cross" icon="📈">
            The most common confirmation: a bearish divergence is confirmed when the MACD line crosses below its signal
            line; a bullish divergence when MACD crosses above its signal line. Wait for that cross.
          </InfoBox>
          <InfoBox title="Level break" icon="🧱">
            Wait for price to break the last swing high (bullish) or swing low (bearish). If price does not break the
            level, the divergence is still unconfirmed.
          </InfoBox>
          <InfoBox title="Higher timeframe alignment" icon="⏱️">
            Divergences on the daily or weekly chart are far more trustworthy than those on 1-minute charts. Trade the
            direction of the higher timeframe to filter out noise.
          </InfoBox>
        </div>
      </Section>

      <Section id="dodonts" icon="✅" title="Dos and Don'ts" subtitle="The difference between a warning and a losing trade">
        <DoDont
          good={[
            'Treat divergence as a warning, never as a standalone trigger',
            'Always wait for a MACD cross or level break to confirm',
            'Prefer daily/weekly timeframes over fast intraday charts',
            'Place a stop-loss on every trade, every time',
            'Backtest with fees, slippage and taxes before risking money',
            'Use a SEBI-registered broker with a certified API key in India',
          ]}
          bad={[
            'Buy or sell the moment you see a divergence',
            'Trade divergences in a strong, clean trend without confirmation',
            'Front-run the signal hoping to catch the exact top or bottom',
            'Ignore the false divergences — they happen often',
            'Overfit the pivot window until the backtest looks perfect',
            'Risk money you need for bills or emergencies',
          ]}
        />
      </Section>

      <Section id="backtest" icon="🧪" title="Backtesting Tips" subtitle="Make the numbers real, not flattering">
        <div className="space-y-3">
          <StepRow num={1} title="Tune, then test out-of-sample" body="Choose your pivot window and confirmation rule on one period, then test on a completely different period. If it only works where you tuned it, it is overfit." />
          <StepRow num={2} title="Count every false signal" body="Divergence produces many warnings that never confirm. Track your hit rate honestly — a 40% win rate with big winners can still be profitable, but only if you measure it." />
          <StepRow num={3} title="Add costs aggressively" body="Subtract brokerage, slippage and taxes on every trade. Each extra false signal costs money, and divergence is a signal that fires often." />
          <StepRow num={4} title="Watch the drawdown" body="A strategy that returns 50% but drops 40% along the way will wreck your psychology. Prefer smooth, consistent equity curves." />
        </div>
      </Section>

      <Section id="indiamarket" icon="🇮🇳" title="Trading This in India" subtitle="Rules and reality for Indian retail algo traders">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['📜', 'SEBI requires brokers to certify every algo order with an API key before routing. Register your strategy with your broker and get the key.'],
            ['🏦', 'Trade through a SEBI-registered broker with a public API — most major Indian brokers (Zerodha, Angel One, etc.) offer one.'],
            ['📉', 'Taxes matter: STT, brokerage and capital gains tax eat into returns. Include them in every backtest.'],
            ['📊', 'Free data: yfinance works for many Indian symbols (e.g. RELIANCE.NS, INFY.NS); brokers also provide historical data.'],
            ['⚠️', 'Many brokers limit algo frequency or charge per API call. Read your broker API terms before scaling up.'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300"><span>{c}</span><span>{t}</span></li>
          ))}
        </ul>
      </Section>

      <Section id="resources" icon="🔗" title="Resources & Tools" subtitle="Free and practical places to start">
        <div className="space-y-2">
          {[
            ['🐍', 'ta — Python technical analysis library', 'https://github.com/bukosabino/ta'],
            ['⚡', 'pandas-ta — more TA indicators', 'https://github.com/twopirllc/pandas-ta'],
            ['📊', 'yfinance — free market data', 'https://github.com/ranaroussi/yfinance'],
            ['🐢', 'Backtrader — Python backtesting', 'https://www.backtrader.com'],
            ['🏦', 'Zerodha Kite API (India)', 'https://kite.trade'],
            ['🏦', 'Angel One SmartAPI (India)', 'https://smartapi.angelbroking.com'],
            ['📸', 'AIMakeRich on Instagram', 'https://www.instagram.com/aimakerich'],
          ].map(([i, label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 border border-white/8 hover:border-amber-400/40 hover:bg-white/5 transition-all text-slate-300 hover:text-white no-underline">
              <span>{i}</span>
              <span className="text-sm font-medium">{label}</span>
              <span className="ml-auto text-emerald-300 text-xs font-mono break-all">{href}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you trade">
        <p>
          This page is <b>educational only and is not financial advice</b>. Divergence is a warning signal with many false
          positives; it does not guarantee future moves and past performance does not predict future results. Algorithmic
          trading involves substantial risk of loss and most strategies fail. In India, algo orders must be placed through a
          SEBI-registered broker using a certified API key. You are solely responsible for your trading decisions and any
          losses. Consult a qualified financial advisor before investing or trading.
        </p>
      </Section>
    </ToolLayout>
  )
}
