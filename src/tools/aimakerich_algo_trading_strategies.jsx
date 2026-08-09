import { Helmet } from 'react-helmet-async'
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
  return (
    <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: '#0a0f1e' }}>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10" style={{ background: '#111827' }}>
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        {title && <span className="ml-2 text-[11px] font-mono text-slate-400">{title}</span>}
        {lang && <span className="ml-auto text-[10px] font-mono text-emerald-400/80 uppercase tracking-wider">{lang}</span>}
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
  { q: 'What is algorithmic trading?', a: 'Algorithmic (algo) trading uses computer programs to decide when to buy and sell based on pre-defined rules — speed, price, or indicators — instead of human emotion. The code places the trade automatically when the rule fires. It is popular with traders who want speed, consistency and discipline.' },
  { q: 'Which algo strategy is best for beginners?', a: 'Momentum and mean reversion are the most beginner-friendly. They are simple to code, run on daily or hourly bars (no low-latency infra needed), and can be tested with free data and a backtesting library. Market making and pure arbitrage need fast infrastructure and are not for beginners.' },
  { q: 'Do I need to be a programmer?', a: 'It helps, but you do not need to be an expert. Python is the easiest entry point — pandas for data, backtrader or vectorbt for backtesting, and broker APIs for execution. You can start with a 30-line momentum script and grow from there.' },
  { q: 'Is algo trading legal in India?', a: 'Yes. Retail algo trading is legal in India and is growing fast. SEBI (the market regulator) requires brokers to certify algo orders with an API key before they are routed — you typically get this by registering your strategy with your broker. Always trade through a SEBI-registered broker.' },
  { q: 'How much capital do I need to start?', a: 'You can start small, but you should paper-trade first (simulated, no real money). Once your strategy is profitable in backtests for months, start with a small real amount you can afford to lose. Never risk money you need for living expenses.' },
  { q: 'Can a bot guarantee profits?', a: 'No. No strategy guarantees profits. Markets change, backtests overfit, and losses are part of trading. Algo trading removes emotion and adds discipline and speed — it does not remove risk. Always treat any profit claim with extreme suspicion.' },
  { q: 'What is the difference between backtesting and live trading?', a: 'Backtesting runs your rules on historical data to see how they would have performed. Live trading runs them on real, current data with real orders. Backtests often look better than reality because of slippage, fees, and overfitting — so always account for costs and expect live results to be worse.' },
  { q: 'Do I need a dedicated server?', a: 'For daily or hourly strategies, no — a laptop running during market hours is fine. For high-frequency strategies (millisecond arbitrage), you need a colocated server near the exchange, which is expensive and out of reach for most retail traders.' },
]

const howItWorks = [
  'Pick a strategy: momentum, mean reversion, trend following, or arbitrage.',
  'Define clear entry and exit rules with numbers (e.g. buy when 20-day MA crosses above 50-day MA).',
  'Backtest on historical data to measure return, drawdown and win rate.',
  'Add realistic slippage and fees, then walk-forward test to avoid overfitting.',
  'Paper-trade live for weeks, then deploy with a small real amount via a broker API.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Algo Trading Strategies — Full Guide with Python, Java & C++ Code',
            description: 'Learn the most popular algorithmic trading strategies (momentum, mean reversion, trend following, arbitrage, market making) with copy-paste starter code in Python, Java and C++, plus the full build process, FAQs, and dos and donts.',
      about: 'Algorithmic trading strategies',
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

export default function aimakerich_algo_trading_strategies() {
  return (
    <ToolLayout
      title="Algo Trading Strategies — Full Guide with Code"
      desc="Learn the most popular algo trading strategies: momentum, mean reversion, trend following, arbitrage and market making. Includes copy-paste starter code in Python, Java and C++, the full build process, FAQs and dos and don'ts."
      icon="🤖"
      iconBg="linear-gradient(135deg, rgba(251,191,36,0.18), rgba(52,211,153,0.08))"
      category="finance"
      slug="aimakerich/algo-trading-strategies"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      <WarningBox>
        This page is <b>for education only</b> and is <b>not financial advice</b>. Algorithmic trading carries real risk
        of loss — most strategies fail and no bot guarantees profits. Always <b>backtest and paper-trade</b> first, and only
        risk money you can afford to lose. In India, algo orders must be routed through a <b>SEBI-registered broker</b> with a
        certified API key. Consult a qualified financial advisor before trading.
      </WarningBox>

      <Section id="overview" icon="💹" title="What is Algorithmic Trading?" subtitle="Computers that decide when to buy and sell">
        <p>
          <b>Algorithmic trading</b> (algo trading) replaces human decisions with computer rules. Instead of staring at charts
          and guessing, you write code that watches the market and <b>automatically places trades</b> when your conditions are met.
          The result is <b>speed, discipline and consistency</b> — the computer never hesitates, panics, or gets greedy.
        </p>
        <FeatureGrid items={[
          { i: '⚡', t: 'Speed', d: 'React to price moves in milliseconds, not minutes.' },
          { i: '🎯', t: 'Discipline', d: 'Follows the rules exactly — no emotional trades.' },
          { i: '🧪', t: 'Backtesting', d: 'Test your idea on years of history before risking money.' },
          { i: '🔁', t: 'Consistency', d: 'Trade the same strategy the same way, every time.' },
          { i: '💰', t: 'Cheaper', d: 'Cut costs with better entry prices and lower spreads.' },
          { i: '📊', t: 'Scale', d: 'Watch and trade many symbols at once.' },
        ]} />
      </Section>

      <Section id="strategies" icon="🧠" title="The Most Popular Strategies" subtitle="Pick one that matches your skill and infrastructure">
        <div className="space-y-3">
          <InfoBox title="Momentum — buy what is going up">
            Assets that moved up recently tend to keep moving up for a while. Buy when price breaks above a recent high or when a
            fast moving average crosses above a slow one; sell when the momentum reverses. Simple to code, works on daily bars.
          </InfoBox>
          <InfoBox title="Mean Reversion — buy the dip, sell the spike">
            Prices that shoot too far from their average tend to snap back. Buy when price drops below a moving average or touches
            a lower Bollinger Band; sell when it returns to the mean. Best in choppy, range-bound markets.
          </InfoBox>
          <InfoBox title="Trend Following — ride the big move">
            Stay long in an uptrend and short in a downtrend, ignoring small noise. Uses long moving averages or Donchian
            breakouts. Works across all markets and timeframes; profits come from a few big winners.
          </InfoBox>
          <InfoBox title="Statistical Arbitrage — pairs trading">
            Two correlated stocks usually move together. When the price gap (spread) between them widens abnormally, go long the
            laggard and short the leader, then close when the gap normalizes. Needs two correlated instruments.
          </InfoBox>
          <InfoBox title="Market Making — earn the spread">
            Quote a buy price and a sell price at the same time; earn the difference when both sides get filled. Requires
            low-latency infrastructure and heavy risk management — not for beginners.
          </InfoBox>
          <InfoBox title="Arbitrage — riskless-ish profit">
            Buy in one market and sell at a higher price in another simultaneously (exchange, index, or triangular FX arb).
            Edges are tiny and vanish in milliseconds — needs speed most retail traders do not have.
          </InfoBox>
        </div>
      </Section>

      <Section id="process" icon="🛠️" title="The Full Build Process" subtitle="Six steps from idea to live bot">
        <StepRow num={1} title="Choose one strategy" body="Start with momentum or mean reversion — simple rules, daily bars, no fast infrastructure. Write your entry and exit rules as exact numbers." />
        <StepRow num={2} title="Get historical data" body="Download free data (e.g. Yahoo Finance, NSE/BSE for Indian stocks). You need daily open/high/low/close/volume for at least 3-5 years." />
        <StepRow num={3} title="Backtest it" body="Run your rules on the historical data with a library like backtrader or vectorbt in Python. Measure total return, max drawdown, and win rate." />
        <StepRow num={4} title="Add costs and re-test" body="Subtract realistic brokerage, slippage and taxes. If it is not profitable after costs, it is not profitable. Walk-forward test to reduce overfitting." />
        <StepRow num={5} title="Paper-trade live" body="Run the strategy on live market data with simulated money for several weeks. This catches data feed and timing bugs backtests miss." />
        <StepRow num={6} title="Deploy small, then scale" body="Connect a broker API with a certified key (required in India), start with a small real amount, and scale only after consistent live results." />
      </Section>

      <Section id="python" icon="🐍" title="Starter Code — Python" subtitle="The easiest language for algo trading">
        <p>A simple <b>moving-average crossover momentum</b> strategy using pandas. It computes a fast and slow moving average,
        and goes long when the fast one crosses above the slow one. Runs on daily bars — a solid first bot.</p>
        <CodeBlock title="momentum_ma_crossover.py" lang="Python" lines={`import pandas as pd
import yfinance as yf

# 1) Download daily data for an Indian or global ticker
df = yf.download("RELIANCE.NS", start="2020-01-01", auto_adjust=True)
close = df["Close"]

# 2) Compute fast and slow moving averages
fast = close.rolling(20).mean()   # 20-day MA
slow = close.rolling(50).mean()   # 50-day MA

# 3) Signal: +1 when fast crosses above slow, -1 when it crosses below
signal = 0
signals = []
prev = 0
for f, s in zip(fast, slow):
    if f > s:
        cur = 1
    elif f < s:
        cur = -1
    else:
        cur = prev
    if cur != prev:
        signal = cur
    signals.append(signal)
    prev = cur

df["signal"] = signals
# Daily return when in the market, 0 when flat
df["position"] = df["signal"].shift(1).fillna(0)
df["daily_ret"] = close.pct_change().fillna(0) * df["position"]

print("Strategy return:", round((1 + df["daily_ret"]).prod() - 1, 4))
print("Buy-and-hold  :", round((1 + close.pct_change().fillna(0)).prod() - 1, 4))
# Compare the two — and remember to subtract fees + slippage!`} />
        <InfoBox title="Run it">
          Install once: pip install pandas yfinance. Then: python momentum_ma_crossover.py. It prints the strategy return vs a
          buy-and-hold return. Expect real-world results to be lower once you add brokerage and slippage.
        </InfoBox>
      </Section>

      <Section id="java" icon="☕" title="Starter Code — Java" subtitle="For when you want speed and a production pipeline">
        <p>A Java version of the same <b>moving-average crossover</b> idea. It reads OHLC data from CSV, computes the averages,
        and prints buy/sell decisions. This shape fits a scheduled job or a Spring boot service that talks to a broker API.</p>
        <CodeBlock title="MACrossover.java" lang="Java" lines={`import java.io.*;
import java.util.*;

public class MACrossover {
    // Sample closes for a symbol (in production, load these from CSV or a feed)
    static double[] close = {100, 101, 102, 101, 103, 105, 104, 106, 108, 107,
                             110, 112, 111, 114, 115, 113, 116, 118, 120, 121,
                             119, 122, 124, 123, 126, 128, 127, 130};

    static double ma(double[] a, int from, int period) {
        double sum = 0;
        for (int i = from - period + 1; i <= from; i++) sum += a[i];
        return sum / period;
    }

    public static void main(String[] args) {
        int fast = 5, slow = 10;
        int pos = 0; // 0 = flat, 1 = long
        for (int i = slow; i < close.length; i++) {
            double f = ma(close, i, fast);
            double s = ma(close, i, slow);
            if (f > s && pos == 0) { pos = 1; System.out.println("BUY  at " + close[i]); }
            else if (f < s && pos == 1) { pos = 0; System.out.println("SELL at " + close[i]); }
        }
        System.out.println("Final position: " + (pos == 1 ? "LONG" : "FLAT"));
    }
}`} />
        <InfoBox title="Run it">
          Save as MACrossover.java, then: javac MACrossover.java && java MACrossover. In production, swap the hardcoded array
          for a live data feed and route orders through your broker's Java SDK.
        </InfoBox>
      </Section>

      <Section id="cpp" icon="⚙️" title="Starter Code — C++" subtitle="For low-latency execution and backtesting">
        <p>A <b>mean reversion</b> example in C++: buy when the price drops more than one standard deviation below its moving
        average (a cheap dip), and sell when it returns to the average. This is the classic "buy the dip" idea, written in a
        language used for fast backtesting engines.</p>
        <CodeBlock title="mean_reversion.cpp" lang="C++" lines={`#include <bits/stdc++.h>
using namespace std;

double mean(const vector<double>& v, int n) {
    double s = 0;
    for (int i = (int)v.size() - n; i < (int)v.size(); i++) s += v[i];
    return s / n;
}

double stdev(const vector<double>& v, int n, double m) {
    double s = 0;
    for (int i = (int)v.size() - n; i < (int)v.size(); i++) s += (v[i]-m)*(v[i]-m);
    return sqrt(s / n);
}

int main() {
    // Daily closes of an instrument
    vector<double> close = {100,101,102,99,98,97,100,103,104,101,102,103};
    int window = 5;
    int pos = 0; // 0 flat, 1 long
    for (size_t i = window; i < close.size(); i++) {
        double m  = mean(close, window);
        double sd = stdev(close, window, m);
        double p  = close[i];
        if (p < m - sd && pos == 0) { pos = 1; cout << "BUY  dip at " << p << "\\n"; }
        else if (p > m && pos == 1) { pos = 0; cout << "SELL at " << p << "\\n"; }
    }
    return 0;
}`} />
        <InfoBox title="Run it">
          Compile: g++ -O2 mean_reversion.cpp -o mr && ./mr. The threshold (one standard deviation) is a knob you tune during
          backtesting — raising it means buying deeper dips less often.
        </InfoBox>
      </Section>

      <Section id="dodonts" icon="✅" title="Dos and Don'ts" subtitle="The difference between a hobby and a losing habit">
        <DoDont
          good={[
            'Paper-trade and backtest for months before risking real money',
            'Account for brokerage, slippage and taxes in every test',
            'Use a SEBI-registered broker with a certified API key (India)',
            'Start small and scale only after consistent live results',
            'Set stop-losses and a maximum drawdown you will walk away from',
            'Treat any "guaranteed profit" claim as a scam',
          ]}
          bad={[
            'Risk money you need for bills or emergencies',
            'Trade a strategy you do not understand line by line',
            'Blindly copy a bot from a "make money fast" video',
            'Overfit the backtest by tweaking until it looks perfect',
            'Trade without stop-losses, letting one loss wipe many wins',
            'Assume the market will behave tomorrow as it did yesterday',
          ]}
        />
      </Section>

      <Section id="backtest" icon="🧪" title="How to Backtest Honestly" subtitle="Make the numbers real, not flattering">
        <div className="space-y-3">
          <StepRow num={1} title="Use out-of-sample data" body="Train/tune your parameters on one time period, then test on a different, untouched period. If it only works on the tuning period, it is overfit." />
          <StepRow num={2} title="Add costs aggressively" body={'Subtract realistic brokerage, slippage and taxes on every trade. Retail costs can turn a "profitable" backtest negative.'} />
          <StepRow num={3} title="Watch the drawdown" body="A strategy that returns 50% but drops 40% along the way will wreck your psychology and may be margin-called. Prefer smooth over flashy." />
          <StepRow num={4} title="Walk-forward test" body="Roll your window forward: optimize, test the next chunk, repeat. Consistent results across rolling windows are far more trustworthy than one big backtest." />
        </div>
      </Section>

      <Section id="indiamarket" icon="🇮🇳" title="Trading This in India" subtitle="Rules and reality for Indian retail algo traders">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['📜', 'SEBI requires brokers to certify every algo order with an API key before routing. You register your strategy with your broker and get a key.'],
            ['🏦', 'Trade through a SEBI-registered broker with a public API — most major Indian brokers offer one.'],
            ['📉', 'Taxes matter: STT, brokerage, and capital gains tax eat into returns. Include them in your backtest.'],
            ['📊', 'Free data: Yahoo Finance works for many Indian symbols (e.g. RELIANCE.NS, INFY.NS); brokers also provide historical data.'],
            ['⚠️', 'Many brokers limit algo frequency or charge per-API-call. Read your broker API terms before scaling up.'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300"><span>{c}</span><span>{t}</span></li>
          ))}
        </ul>
      </Section>

      <Section id="resources" icon="🔗" title="Resources & Tools" subtitle="Free and practical places to start">
        <div className="space-y-2">
          {[
            ['🐍', 'Backtrader (Python backtesting)', 'https://www.backtrader.com'],
            ['⚡', 'vectorbt (fast vectorized backtesting)', 'https://github.com/polakowo/vectorbt'],
            ['📊', 'yfinance (free market data)', 'https://github.com/ranaroussi/yfinance'],
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
          This page is <b>educational only and is not financial advice</b>. Algorithmic trading involves substantial risk of loss,
          most strategies fail, and no bot or backtest guarantees future profit. Past performance does not predict future results.
          In India, algo orders must be placed through a SEBI-registered broker using a certified API key. You are solely responsible
          for your trading decisions and any losses. Consult a qualified financial advisor before investing or trading.
        </p>
      </Section>
    </ToolLayout>
  )
}
