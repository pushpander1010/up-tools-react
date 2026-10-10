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

function CodeBlock({ title, lines }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: '#0a0f1e' }}>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10" style={{ background: '#111827' }}>
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        {title && <span className="ml-2 text-[11px] font-mono text-slate-400">{title}</span>}
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-green-300 whitespace-pre-wrap">
{lines}
      </pre>
    </div>
  )
}

function InfoBox({ title, icon = '💡', children }) {
  return (
    <div className="rounded-xl p-4 border border-cyan-500/25" style={{ background: 'rgba(6,182,212,0.06)' }}>
      <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm mb-1.5">{icon} {title}</div>
      <div className="text-xs text-slate-300 leading-relaxed">{children}</div>
    </div>
  )
}

function FeatureGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map(f => (
        <div key={f.t} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="text-sm font-semibold text-white mb-0.5">{f.t}</div>
          <div className="text-xs text-slate-400">{f.d}</div>
        </div>
      ))}
    </div>
  )
}

function IssueRow({ issue, fix }) {
  return (
    <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex items-start gap-2">
        <span className="text-red-400 font-bold mt-0.5">✕</span>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white mb-1">{issue}</div>
          <div className="text-xs text-slate-400 leading-relaxed">
            <span className="text-green-400 font-semibold">Fix: </span>{fix}
          </div>
        </div>
      </div>
    </div>
  )
}

const faq = [
  { q: "What is an agent wallet?", a: "A crypto wallet owned by a bot, holding stablecoins it spends on x402 requests without human clicks." },
  { q: "What are Cloudflare Wallets?", a: "Managed stablecoin wallets for AI agents with spending guardrails, built to pair with x402 payments." },
  { q: "Which caps matter most?", a: "Per-request cap stops single overpays, daily cap stops runaway loops, per-domain cap stops one site eating the budget." },
  { q: "How much should fund an agent?", a: "Enough for a day or two of normal use. Top up automatically rather than parking a fortune in the bot." },
  { q: "What if an agent overspends?", a: "Hit the kill switch, review logs to find the loop or price spike, tighten caps, then resume." },
  { q: "Should agents share one wallet?", a: "Avoid it. Shared wallets hide who spent what and let one rogue task drain everyone." },
]

const howItWorks = [
  "Create a dedicated wallet per agent with a small starting balance.",
  "Set per-request, daily, and per-domain caps matching the task budget.",
  "Allow only the assets and networks your tasks actually need.",
  "Enable alerts at half and near-full budget use.",
  "Keep the kill switch tested and reachable at all times.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "Agent Wallets: Caps and Guardrails",
      description: "Agent wallets 101: dedicated stablecoin wallets, per-request and daily caps, alerts, auto top-up, and kill switches.",
      about: "agent wallets with spending caps and guardrails",
      educationalUse: 'Education and reference only',
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

export default function x402_agent_wallets() {
  return (
    <ToolLayout
      title="Agent Wallets: Caps and Guardrails"
      desc="Agent wallets 101: stablecoin wallets for bots, per-request caps, daily budgets, per-domain limits, and kill switches that stop overspend."
      icon="8"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="crypto"
      slug="x402-agent-wallets"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Section id="overview" icon="8" title="Agent Wallets 101" subtitle="Bots with budgets, not blank cheques">
        <p>
          An agent that can pay needs a wallet with boundaries. Without caps, a looping bug or a price spike can empty funds in minutes while nobody watches.
        </p>
        <p>
          The fix is boring and effective: separate wallets, stacked spending caps, alerts before limits hit, and a kill switch you have actually tested. Fund like a metro card and top up often.
        </p>
        <FeatureGrid items={[
  { t: "Own wallet", d: "Each agent spends from its own funded balance with its own limits." },
  { t: "Hard caps", d: "Requests above the per-request cap are skipped automatically, no exceptions." },
  { t: "Spend log", d: "Every payment records amount, destination, and what content it bought." },
  { t: "Auto top-up", d: "Refill small amounts on schedule instead of storing big balances in bots." },
]} />
      </Section>

      <Section id="flow" icon="🔁" title="Cap Layout" subtitle="Layers of limits">
        <p className="text-xs text-slate-400">Stack the caps so each layer catches what the previous one missed, ending in a kill switch.</p>
        <CodeBlock title="wallet guardrails" lines={`wallet guardrails:
  balance: 5.00 max
  per-request cap: 0.05
  daily cap: 1.00
  per-domain cap: 0.50
  allowed assets: USDC only
  allowed networks: base only
  kill switch: armed`} />
        <InfoBox title="Funding habit">
          Fund the wallet like a metro card, not a bank account. Small balance plus auto top-up beats one giant balance sitting in a bot.
        </InfoBox>
      </Section>

      <Section id="facts" icon="📌" title="Guardrail Stack" subtitle="Control layers">
        <FeatureGrid items={[
  { t: "Separate money", d: "One wallet per agent or task keeps spending visible and limits blast radius." },
  { t: "Caps everywhere", d: "Per-request, daily, and per-domain caps stack so no single surprise can drain funds." },
  { t: "Kill switch", d: "One button or API call freezes all spending instantly when something looks wrong." },
  { t: "Alerts first", d: "Notify the owner at 50 and 90 percent of budget so nothing empties silently." },
]} />
      </Section>

      <Section id="issues" icon="🐞" title="Common Mistakes and Fixes" subtitle="What people get wrong">
        <div className="space-y-3">
          {[["One shared wallet", "Shared funds hide who spent what. Give each agent its own wallet and limits."], ["No daily cap", "A loop can burn thousands of micro-payments overnight. Daily caps stop the bleed."], ["Untested kill switch", "A switch you never tested will fail when needed. Test the freeze path monthly."]].map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[["Docs", "Cloudflare x402 docs", "https://developers.cloudflare.com/agents/tools/payments/x402/"], ["Docs", "Cloudflare agent payments overview", "https://developers.cloudflare.com/agents/tools/payments/"], ["News", "Cloudflare Monetization Gateway beta", "https://blog.cloudflare.com/monetization-gateway-beta/"]].map(([i, label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 border border-white/8 hover:border-brand/40 hover:bg-white/5 transition-all text-slate-300 hover:text-white no-underline">
              <span>{i}</span>
              <span className="text-sm font-medium">{label}</span>
              <span className="ml-auto text-indigo-300 text-xs font-mono break-all">{href}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you act">
        <p>
          Educational reference only. Wallet setups vary by provider, so follow your wallet docs for exact steps.
        </p>
      </Section>
    </ToolLayout>
  )
}
