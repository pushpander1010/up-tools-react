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
  { q: "Why stablecoins instead of volatile crypto?", a: "Stable value keeps pricing sane. A one-cent quote today is still one cent tomorrow." },
  { q: "Why Base network?", a: "Low fees make sub-cent and few-cent payments practical, which expensive mainnets cannot do." },
  { q: "What does the facilitator actually do?", a: "It verifies the on-chain payment matches the quote and tells your server it is safe to serve content." },
  { q: "How fast is settlement?", a: "Typically seconds. The agent pays, the chain confirms, verification passes, and content unlocks." },
  { q: "Who pays the network fee?", a: "Usually the payer covers a small gas fee on top. Keep quotes slightly above cost to stay profitable." },
  { q: "Can sellers get payouts in local currency?", a: "Facilitators and exchanges offer off-ramps, but that step sits outside the x402 flow itself." },
]

const howItWorks = [
  "Read amount, asset, network, pay-to address, and expiry from the 402 quote.",
  "Submit the exact stablecoin transfer to the stated address on the stated network.",
  "Attach the payment proof to your retried request.",
  "The server verifies amount, asset, destination, and freshness via the facilitator.",
  "Receive the content only after all checks pass.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "How x402 Stablecoin Settlement Works",
      description: "How x402 stablecoin settlement works: USDC on Base, quote fields, facilitator verification, and seller payouts.",
      about: "x402 stablecoin settlement with USDC on Base",
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

export default function x402_stablecoin_payments() {
  return (
    <ToolLayout
      title="How x402 Stablecoin Settlement Works"
      desc="How x402 stablecoin settlement works: USDC on Base, the facilitator role, on-chain verification, and payouts to the seller wallet."
      icon="5"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="crypto"
      slug="x402-stablecoin-payments"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Section id="overview" icon="5" title="How x402 Settlement Works" subtitle="Dollars on rails, cents per request">
        <p>
          x402 payments usually settle in USDC on the Base network: dollar-pegged money on low-fee rails. That combination makes charging a cent or less per request realistic, which card networks were never built for.
        </p>
        <p>
          A facilitator bridges the chain and your server. It confirms the payment is genuine and matches the quote, then your server delivers the content with confidence.
        </p>
        <FeatureGrid items={[
  { t: "Quote states terms", d: "Amount, asset, network, destination, and expiry travel together in the 402 body." },
  { t: "Agent pays on-chain", d: "The transfer is a normal stablecoin payment the whole network can verify." },
  { t: "Server verifies", d: "Your backend checks amount, asset, destination, and freshness before serving." },
  { t: "Content unlocks", d: "Only verified payments get HTTP 200 with the goods." },
]} />
      </Section>

      <Section id="flow" icon="🔁" title="Quote Anatomy" subtitle="Quote in, proof out">
        <p className="text-xs text-slate-400">Each field in the quote has a verification job on the server side. Check all of them.</p>
        <CodeBlock title="payment quote fields" lines={`quote fields in every 402:
  amount: 0.01
  asset: USDC
  network: base
  payTo: 0xSeller address
  memo: dataset/top-stories
  expiresAt: quote deadline`} />
        <InfoBox title="Mental model">
          Price in dollars, settle in stablecoin. The buyer sees a familiar amount and the chain moves the money in seconds.
        </InfoBox>
      </Section>

      <Section id="facts" icon="📌" title="Settlement Pieces" subtitle="The money path">
        <FeatureGrid items={[
  { t: "Dollar-pegged", d: "USDC tracks the US dollar, so a 0.01 quote means one cent. No volatility math for buyers." },
  { t: "Base network", d: "Base is a low-fee Ethereum layer 2, so moving tiny amounts stays economical." },
  { t: "Facilitator checks", d: "The facilitator confirms the transfer exists and matches the quote before content is served." },
  { t: "Direct payout", d: "Funds land in the seller wallet you configured. No app-store cut in the middle." },
]} />
      </Section>

      <Section id="issues" icon="🐞" title="Common Mistakes and Fixes" subtitle="What people get wrong">
        <div className="space-y-3">
          {[["Accepting wrong assets", "Verify the asset and network match the quote. A payment on the wrong chain is not your money."], ["Skipping destination checks", "Confirm funds went to your address. Paying an attacker address proves nothing."], ["Forgetting gas costs", "Tiny quotes with no margin lose money after fees. Keep quotes above total cost."]].map(([issue, fix]) => (
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
          Educational reference only. Networks, fees, and supported assets change over time, so confirm current details in official docs.
        </p>
      </Section>
    </ToolLayout>
  )
}
