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
  { q: "Do I need crypto experience to add x402?", a: "Basic ideas suffice: a wallet address to receive funds and a facilitator to verify payments. The managed gateway hides the chain details." },
  { q: "What is a facilitator?", a: "A service, such as the Coinbase x402 facilitator, that checks payment validity so your Worker does not read the blockchain directly." },
  { q: "Will this block my human visitors?", a: "Only if you let it. Charge agent-heavy endpoints and leave normal pages free to protect SEO and ad revenue." },
  { q: "Which network and asset should I pick?", a: "USDC on Base is the common default: stable value and low fees. Match what buyer wallets support." },
  { q: "How do I test without spending real money?", a: "Use tiny one-cent quotes on a staging route, and confirm the full 402 to 200 cycle before going live." },
  { q: "Does Cloudflare handle failures and retries?", a: "The Monetization Gateway beta handles verification, failures, retries, and analytics on your behalf." },
]

const howItWorks = [
  "Pick the endpoints worth charging: data APIs, search, and high-cost AI routes.",
  "Return HTTP 402 with amount, asset, network, pay-to address, and expiry for unpaid hits.",
  "Verify the x-payment proof server-side through your facilitator on every retry.",
  "Serve the content only after verification passes, with clean error codes otherwise.",
  "Monitor conversions and adjust prices per endpoint over time.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "Adding x402 to a Cloudflare Worker",
      description: "Guide to adding x402 payments to a Cloudflare Worker: 402 quotes, facilitator verification, selective charging, and testing.",
      about: "adding x402 payments to a Cloudflare Worker",
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

export default function x402_cloudflare_setup() {
  return (
    <ToolLayout
      title="Adding x402 to a Cloudflare Worker"
      desc="Add x402 to a Cloudflare Worker: return 402 quotes, verify payment through a facilitator, and serve content only after proof checks out."
      icon="R"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="crypto"
      slug="x402-cloudflare-setup"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Section id="overview" icon="R" title="Adding x402 to Cloudflare" subtitle="Turn a Worker into a cash register">
        <p>
          Cloudflare Workers sit between the internet and your content, which makes them a natural place to enforce x402. The Worker inspects each request and either serves it or answers with a 402 price quote.
        </p>
        <p>
          When the buyer retries with payment proof, the Worker verifies it through a facilitator and then serves the content. Managed options like the Monetization Gateway handle the quote, verify, retry, and analytics plumbing for you.
        </p>
        <FeatureGrid items={[
  { t: "Worker intercepts", d: "Your Worker checks each request: payment proof present, or a 402 quote goes back." },
  { t: "Server-side verify", d: "Every proof is checked through the facilitator. Never trust the client claim alone." },
  { t: "Wallet receives", d: "Settled funds go to your configured seller wallet address." },
  { t: "Tune prices", d: "Watch which endpoints convert and adjust amounts without redeploying content." },
]} />
      </Section>

      <Section id="flow" icon="🔁" title="The Worker Pattern" subtitle="Intercept, quote, verify, serve">
        <p className="text-xs text-slate-400">The pattern in plain steps: detect unpaid agent traffic, return a 402 quote, verify proof, then serve.</p>
        <CodeBlock title="worker pattern" lines={`on each request:
  if route needs payment and no x-payment header:
    return 402 with amount, asset, network, payTo
  if x-payment header present:
    verify with facilitator
    if valid: serve content (200)
    if invalid: return fresh 402`} />
        <InfoBox title="Rollout tip">
          Keep human visitors free and charge only heavy agent endpoints at first. You keep your ad traffic while you learn what bots will pay for.
        </InfoBox>
      </Section>

      <Section id="facts" icon="📌" title="What You Need" subtitle="Your building blocks">
        <FeatureGrid items={[
  { t: "Monetization Gateway", d: "Cloudflare offers a managed path that handles quotes, verification, retries, and analytics for you." },
  { t: "Facilitator verifies", d: "A facilitator service confirms the on-chain payment is real before your Worker serves anything." },
  { t: "Charge selectively", d: "Protect only the endpoints bots hammer: data feeds, search, and expensive AI routes." },
  { t: "Analytics included", d: "Managed setups report each paid use, so you can see which endpoints earn and adjust prices." },
]} />
      </Section>

      <Section id="issues" icon="🐞" title="Common Mistakes and Fixes" subtitle="What people get wrong">
        <div className="space-y-3">
          {[["Charging every page", "Paywalling articles kills SEO and ads. Charge API-style endpoints, keep content pages free."], ["Trusting proof without verifying", "Always confirm through the facilitator. Unchecked proofs mean free content for forgers."], ["Skipping staging tests", "Run the full 402 to 200 loop with tiny amounts on staging before touching production."]].map(([issue, fix]) => (
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
          Educational guide, not production code. Payment verification must happen server-side through a trusted facilitator, and test with tiny amounts first.
        </p>
      </Section>
    </ToolLayout>
  )
}
