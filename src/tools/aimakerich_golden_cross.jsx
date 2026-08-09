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

function CodeTabs({ tabs }) {
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
  { q: 'What is the golden cross?', a: 'The golden cross is a bullish chart signal that happens when a short-term moving average (like the 50-day) crosses above a long-term one (like the 200-day). It is widely read as the start of an uptrend and a buy signal. The death cross is the opposite — the fast average crossing below the slow one, seen as bearish.' },
  { q: 'Why do traders use the 50 and 200 day averages?', a: 'The 50-day average reflects roughly two and a half months of price and reacts quickly to recent moves. The 200-day average covers about ten months and is slow and smooth. Together they show short-term momentum versus the long-term trend. When the fast one crosses the slow one, it is a meaningful change in momentum.' },
  { q: 'Is the golden cross a reliable buy signal?', a: 'It is a useful trend signal but NOT a guarantee. It is a lagging indicator, so you enter after the move has started, and it produces false signals in sideways markets. It works best in strong, sustained trends. Always confirm with volume, price action, or other tools, and use a stop loss.' },
  { q: 'How do I code the golden cross?', a: 'In Python use pandas to compute the 50 and 200 day moving averages, then buy when the 50 crosses above the 200 and sell when it crosses below. The code in this guide shows a complete, runnable example with real data.' },
  { q: 'Does the golden cross work in India?', a: 'Indian traders watch the golden cross on indices like Nifty 50 and Bank Nifty and on ETFs. It has often been followed by multi-month gains, but it is not guaranteed. Test it on your own data with fees and slippage, and use stop losses.' },
  { q: 'What is the main weakness of this strategy?', a: 'It is a lagging signal — you enter late and exit late. In choppy, sideways markets the two averages cross back and forth, producing many false signals that lose money to costs. Its edge comes from riding big trends, not from catching every move.' },
  { q: 'Is this legal to trade in India?', a: 'Yes. Retail algo trading is legal in India. SEBI requires brokers to certify algo orders with an API key before routing. Always trade through a SEBI-registered broker with a public API.' },
]

const howItWorks = [
  'Compute the fast (50-day) and slow (200-day) moving averages of the close.',
  'A golden cross forms when the fast average crosses above the slow average — a buy signal.',
  'A death cross forms when the fast average crosses below the slow average — a sell or exit signal.',
  'Backtest the rule, add fees and slippage, and paper-trade before risking real money.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Golden Cross Strategy — Full Guide with Python, Java & C++ Code',
      description: 'Learn the golden cross and death cross moving-average strategy: what they mean, why traders use MA50 and MA200, and how to code the crossover detector in Python, Java and C++. Includes backtesting tips and honest risk rules.',
      about: 'Golden cross death cross moving average strategy',
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

export default function aimakerich_golden_cross() {
  return (
    <ToolLayout
      title="Golden Cross — Spot the Start of an Uptrend"
      desc="Learn the golden cross and death cross moving-average strategy: how to detect the MA50/MA200 crossover and code it in Python, Java and C++. Full guide with backtesting and honest risk rules."
      icon="📈"
      iconBg="linear-gradient(135deg, rgba(255,183,77,0.18), rgba(100,181,246,0.08))"
      category="finance"
      slug="aimakerich/golden-cross"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      <WarningBox>
        This page is <b>for education only</b> and is <b>not financial advice</b>. The golden cross is a lagging,
        trend-following signal — it gives late and false signals, especially in sideways markets. Always
        <b> backtest and paper-trade</b> first, use stop-losses, and only risk money you can afford to lose. In India,
        algo orders must be routed through a <b>SEBI-registered broker</b> with a certified API key. Consult a qualified
        financial advisor before trading.
      </WarningBox>

      <Section id="overview" icon="📈" title="What is the Golden Cross?" subtitle="When two moving averages cross, momentum has shifted">
        <p>
          A <b>golden cross</b> forms when a short-term moving average crosses <b>above</b> a long-term moving average. The
          most watched pair is the <b>50-day</b> and <b>200-day</b> averages. When the fast one crosses above the slow one,
          it signals the start of an uptrend — a buy signal.
        </p>
        <FeatureGrid items={[
          { i: '🟡', t: 'Golden cross', d: 'Fast MA crosses ABOVE slow MA → bullish, buy signal.' },
          { i: '🔴', t: 'Death cross', d: 'Fast MA crosses BELOW slow MA → bearish, sell/exit signal.' },
          { i: '⏱️', t: 'It is lagging', d: 'You enter after the move starts — expect late entries.' },
          { i: '⚠️', t: 'False signals', d: 'In sideways markets the averages cross back and forth.' },
        ]} />
      </Section>

      <Section id="why" icon="🧩" title="Why MA50 and MA200?" subtitle="Fast momentum vs the long-term trend">
        <InfoBox title="MA50 — reacts quickly">
          The 50-day average covers about two and a half months. It turns faster and reflects recent momentum, so it
          catches a change in direction earlier.
        </InfoBox>
        <InfoBox title="MA200 — slow and smooth">
          The 200-day average spans about ten months. It filters out noise and shows the true long-term trend, making it a
          reliable anchor that rarely whipsaws.
        </InfoBox>
        <InfoBox title="The crossover is the signal">
          When the fast line crosses the slow line, short-term momentum has overtaken the long-term trend. That is the
          moment traders watch for.
        </InfoBox>
      </Section>

      <Section id="strategy" icon="🛠️" title="The Strategy in One Rule" subtitle="Beautifully simple, which is why it is so popular">
        <div className="space-y-3">
          <InfoBox title="The only rule" icon="📜">
            When the fast (50-day) average crosses <b>above</b> the slow (200-day) average, buy. When it crosses
            <b> below</b>, sell or stay out. There is no other rule.
          </InfoBox>
          <StepRow num={1} title="Compute the averages" body="Calculate the 50-day and 200-day simple moving averages of the closing price." />
          <StepRow num={2} title="Detect the cross" body="Track when the 50-day line moves from below to above the 200-day (golden) or from above to below (death)." />
          <StepRow num={3} title="Act on the signal" body="Buy on the golden cross, exit or stay flat on the death cross. In strong trends this rides big moves." />
          <StepRow num={4} title="Manage the risk" body="Use a stop-loss. The signal is lagging, so a false cross in a sideways market can lose money." />
        </div>
      </Section>

      <Section id="code" icon="💻" title="Starter Code" subtitle="One terminal — switch between Python, Java and C++">
        <p>Three ready-to-run golden-cross detectors. Use the buttons to <b>switch languages</b> inside the same terminal.
        <b>Python</b> is the easiest with real data, <b>Java</b> suits a scheduled service, and <b>C++</b> is for fast
        backtesting engines.</p>
        <CodeTabs tabs={[
          {
            lang: 'Python', icon: '🐍', title: 'golden_cross.py',
            desc: 'A complete MA crossover detector on real data. It computes the 50 and 200 day averages, goes long when the 50 crosses above the 200, and prints the strategy return vs buy-and-hold. Run it: pip install pandas yfinance && python golden_cross.py.',
            lines: `import pandas as pd
import yfinance as yf

# 1) daily data (Nifty ETF works in India)
df = yf.download("NIFTYBEES.NS", start="2018-01-01", auto_adjust=True)
close = df["Close"]

# 2) moving averages
fast = close.rolling(50).mean()   # 50-day
slow = close.rolling(200).mean()  # 200-day

# 3) signal: +1 when fast is above slow (in market), else 0
df["signal"] = (fast > slow).astype(int)
df["pos"] = df["signal"].shift(1).fillna(0)   # act next day
df["ret"] = close.pct_change().fillna(0) * df["pos"]

# 4) results
strat = (1 + df["ret"]).prod() - 1
bh = (1 + close.pct_change().fillna(0)).prod() - 1
print("Golden cross return :", round(strat, 4))
print("Buy-and-hold        :", round(bh, 4))
# Subtract fees + slippage before trusting this`,
          },
          {
            lang: 'Java', icon: '☕', title: 'GoldenCross.java',
            desc: 'The same crossover idea in Java — computes the fast and slow moving averages over sample closes and prints BUY/SELL on every cross. Drop it into a scheduled job or a Spring service that polls a broker feed. Run it: javac GoldenCross.java && java GoldenCross.',
            lines: `public class GoldenCross {
    // Sample daily closes (production: load from CSV or a feed)
    static double[] close = {100,101,102,103,102,101,100,102,104,106,
                             108,110,112,114,116,115,118,120,122,124,
                             126,128,127,130,133,136,139,142};

    static double ma(int end, int period) {
        double s = 0;
        for (int i = end - period + 1; i <= end; i++) s += close[i];
        return s / period;
    }

    public static void main(String[] args) {
        int fast = 5, slow = 10;   // scaled for the sample
        boolean inMarket = false;
        for (int i = slow; i < close.length; i++) {
            double f = ma(i, fast), s = ma(i, slow);
            if (f > s && !inMarket) { inMarket = true; System.out.println("BUY  at " + close[i]); }
            else if (f < s && inMarket) { inMarket = false; System.out.println("SELL at " + close[i]); }
        }
        System.out.println("Final: " + (inMarket ? "IN MARKET" : "FLAT"));
    }
}`,
          },
          {
            lang: 'C++', icon: '⚙️', title: 'golden_cross.cpp',
            desc: 'A fast C++ golden-cross scanner — ideal to embed in a backtesting engine. It computes rolling averages and prints the crossover signals over the whole series. Run it: g++ -O2 golden_cross.cpp -o gc && ./gc.',
            lines: `#include <bits/stdc++.h>
using namespace std;

int main() {
    vector<double> c = {100,101,102,103,102,101,100,102,104,106,
                        108,110,112,114,116,115,118,120,122,124,
                        126,128,127,130,133,136,139,142};
    int n = c.size(), fast = 5, slow = 10;
    bool in = false;
    for (int i = slow; i < n; i++) {
        double f = 0, s = 0;
        for (int j = i-fast+1; j <= i; j++) f += c[j];
        for (int j = i-slow+1; j <= i; j++) s += c[j];
        f /= fast; s /= slow;
        if (f > s && !in) { in = true; cout << "BUY  at " << c[i] << "\\n"; }
        else if (f < s && in) { in = false; cout << "SELL at " << c[i] << "\\n"; }
    }
    cout << (in ? "IN MARKET\\n" : "FLAT\\n");
    return 0;
}`,
          },
        ]} />
      </Section>

      <Section id="backtest" icon="🧪" title="Backtest Honestly" subtitle="Make the numbers real, not flattering">
        <div className="space-y-3">
          <StepRow num={1} title="Use out-of-sample data" body="Test the golden cross on a period you did not tune. If it only works where you looked, it is overfit." />
          <StepRow num={2} title="Add costs aggressively" body="Subtract brokerage, slippage and taxes on every trade. The golden cross trades often in sideways markets, so costs matter." />
          <StepRow num={3} title="Watch the drawdown" body="The golden cross lags, so you buy late and can ride a dip before the trend helps. Measure the max drawdown, not just the return." />
          <StepRow num={4} title="Expect late signals" body="You will never catch the exact top or bottom. That is fine — the edge is in riding sustained trends, not timing turns." />
        </div>
      </Section>

      <Section id="dodonts" icon="✅" title="Dos and Don'ts" subtitle="The difference between a tool and a money machine">
        <DoDont
          good={[
            'Treat the golden cross as a trend signal, not a guarantee',
            'Use a stop-loss on every position',
            'Prefer strong trending markets where it works best',
            'Backtest with fees, slippage and taxes first',
            'Confirm with volume or price action',
            'Use a SEBI-registered broker with a certified API key in India',
          ]}
          bad={[
            'Expect to catch the exact top or bottom',
            'Trade it blindly in a sideways, choppy market',
            'Ignore the false signals — they happen often',
            'Overfit the MA periods until the backtest looks perfect',
            'Risk money you need for bills or emergencies',
            'Copy a bot from a "guaranteed profit" video',
          ]}
        />
      </Section>

      <Section id="indiamarket" icon="🇮🇳" title="Trading This in India" subtitle="Rules and reality for Indian retail algo traders">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['📜', 'SEBI requires brokers to certify every algo order with an API key before routing. Register your strategy and get the key.'],
            ['🏦', 'Trade through a SEBI-registered broker with a public API (Zerodha, Angel One, etc.).'],
            ['📉', 'Taxes matter: STT, brokerage and capital gains tax eat into returns. Include them in every backtest.'],
            ['📊', 'Free data: yfinance works for many Indian symbols (e.g. NIFTYBEES.NS, RELIANCE.NS).'],
            ['⚠️', 'Many brokers limit algo frequency or charge per API call. Read your broker API terms before scaling up.'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300"><span>{c}</span><span>{t}</span></li>
          ))}
        </ul>
      </Section>

      <Section id="resources" icon="🔗" title="Resources & Tools" subtitle="Free and practical places to start">
        <div className="space-y-2">
          {[
            ['🐍', 'yfinance — free market data', 'https://github.com/ranaroussi/yfinance'],
            ['🐢', 'Backtrader — Python backtesting', 'https://www.backtrader.com'],
            ['⚡', 'vectorbt — fast backtesting', 'https://github.com/polakowo/vectorbt'],
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
          This page is <b>educational only and is not financial advice</b>. The golden cross is a lagging, trend-following
          signal with many false positives; it does not guarantee future moves and past performance does not predict future
          results. Algorithmic trading involves substantial risk of loss and most strategies fail. In India, algo orders must
          be placed through a SEBI-registered broker using a certified API key. You are solely responsible for your trading
          decisions and any losses. Consult a qualified financial advisor before investing or trading.
        </p>
      </Section>
    </ToolLayout>
  )
}
