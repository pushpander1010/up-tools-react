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
  { q: "When does x402 beat subscriptions?", a: "When usage is irregular or from many unknown agents. You earn from every visit without selling anyone a plan." },
  { q: "When do subscriptions still win?", a: "When one customer makes heavy predictable use. A flat plan is usually cheaper at high volume." },
  { q: "What is wrong with API keys?", a: "Nothing for known partners, but they add signup friction and key management that anonymous agents will not do." },
  { q: "Can x402 and subscriptions coexist?", a: "Yes. Charge anonymous agents per request and keep plans for logged-in heavy users." },
  { q: "Do micropayments annoy buyers?", a: "Tiny per-request amounts are invisible at human scale, but agent builders watch totals, so keep prices sane." },
  { q: "How do refunds work without accounts?", a: "Define a simple policy: failed deliveries refund automatically or on request to the paying wallet." },
]

const howItWorks = [
  "Estimate monthly agent calls per endpoint from your logs.",
  "Multiply by your candidate per-request price for the x402 total.",
  "Compare against the closest API plan or subscription price.",
  "Pick per-request for spiky or long-tail traffic, flat for heavy regulars.",
  "Revisit quarterly as traffic patterns change.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "x402 vs API Keys and Subscriptions",
      description: "Compare x402 micropayments with API keys and subscriptions: costs, friction, and when each model wins for agent traffic.",
      about: "x402 micropayments versus API keys and subscriptions",
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

export default function x402_vs_subscriptions() {
  return (
    <ToolLayout
      title="x402 vs API Keys and Subscriptions"
      desc="x402 micropayments vs API keys and subscriptions: when per-request pricing wins for agent traffic and when a flat plan is cheaper."
      icon="V"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="crypto"
      slug="x402-vs-subscriptions"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Section id="overview" icon="V" title="x402 vs Keys and Subscriptions" subtitle="Pick the model that fits the traffic">
        <p>
          API keys and subscriptions were built for humans who sign up, read docs, and commit monthly. Agents do none of that: they arrive unannounced, grab data, and leave. Per-request x402 pricing meets them where they are.
        </p>
        <p>
          That does not kill subscriptions. Heavy predictable customers still save money on flat plans. The smart setup charges casual agents per request while keeping plans for power users.
        </p>
        <FeatureGrid items={[
  { t: "x402 micropayments", d: "Pay per call in stablecoin. Fits sporadic agent visits and long-tail content." },
  { t: "API keys", d: "Fixed plans with credentials. Best for known developers with steady volume." },
  { t: "Subscriptions", d: "Flat monthly fee. Best for power users who would otherwise overpay per request." },
  { t: "Free sampling", d: "The first calls are free so agents can test quality before spending." },
]} />
      </Section>

      <Section id="flow" icon="🔁" title="Cost Shapes" subtitle="Numbers decide">
        <p className="text-xs text-slate-400">Same 1000 visits under three models. Light use favors x402, heavy use favors flat plans.</p>
        <CodeBlock title="cost comparison" lines={`1000 agent visits compared:
  x402 at 0.01 each  -> 10.00 exact usage
  API plan 49 flat    -> 49.00 overpaid for light use
  API plan 49 flat    -> 49.00 bargain for 50000 calls
Match the model to the traffic shape.`} />
        <InfoBox title="Choosing well">
          Rule of thumb: occasional agent visits favor per-request pricing, while heavy predictable use favors a plan. Offer both when you can.
        </InfoBox>
      </Section>

      <Section id="facts" icon="📌" title="Decision Factors" subtitle="Why the model matters">
        <FeatureGrid items={[
  { t: "Unpredictable traffic", d: "Agent visits spike and dip. Per-request billing tracks reality without forecasting." },
  { t: "Signup friction", d: "API keys need accounts, dashboards, and key rotation. x402 needs only a wallet." },
  { t: "Fractional costs", d: "Low-fee networks make sub-cent charges practical, which card billing cannot do." },
  { t: "Easy hybrid", d: "Keep subscriptions for humans and heavy partners while charging casual agents per request." },
]} />
      </Section>

      <Section id="issues" icon="🐞" title="Common Mistakes and Fixes" subtitle="What people get wrong">
        <div className="space-y-3">
          {[["Forcing plans on casual agents", "Anonymous bots will not sign up. Per-request pricing captures revenue signup walls lose."], ["Pricing heavy users per request", "Regulars with huge volume overpay and leave. Give them a flat plan."], ["No free sample", "Agents cannot judge quality blind. One free endpoint lifts conversion across the rest."]].map(([issue, fix]) => (
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
          Educational comparison with example numbers. Real prices vary by provider, so compare current plans before deciding.
        </p>
      </Section>
    </ToolLayout>
  )
}
