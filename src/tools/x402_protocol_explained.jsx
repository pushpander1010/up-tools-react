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
  { q: "What is x402?", a: "x402 is a payment protocol built on the HTTP 402 Payment Required status. A server quotes a price, the buyer pays with crypto, then the server delivers the content." },
  { q: "Why will agents pay every time they visit?", a: "Because agent traffic can be huge and automated. Per-request pricing means the site owner gets paid for each use instead of giving bots free bandwidth." },
  { q: "What do agents pay with?", a: "Usually USDC stablecoin on a low-fee network such as Base. The exact asset and network are stated in every 402 quote." },
  { q: "Is x402 only for AI agents?", a: "No. Any software can use it, but agents are the main use case because they browse and consume data autonomously at scale." },
  { q: "Do I need an account to use x402?", a: "No account or API key. The buyer just needs a funded wallet, and the seller just needs a wallet address to receive funds." },
  { q: "Is x402 connected to Cloudflare?", a: "Cloudflare supports x402 through its Monetization Gateway and Agents SDK, so any site on Cloudflare can charge agents per request." },
]

const howItWorks = [
  "An agent requests a page or API endpoint like a normal visitor.",
  "The server answers HTTP 402 with a quote: amount, asset, network, and destination wallet.",
  "The agent submits the stablecoin payment on-chain from its own wallet.",
  "The agent retries the request carrying payment proof, usually in an x-payment header.",
  "The server verifies the payment and returns the content with HTTP 200.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "What Is x402? HTTP Payments for AI Agents",
      description: "Plain-English explainer: what x402 is, how the 402 pay-per-request flow works, and why AI agents pay per visit.",
      about: "x402 HTTP payment protocol for AI agents",
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

export default function x402_protocol_explained() {
  return (
    <ToolLayout
      title="What Is x402? HTTP Payments for AI Agents"
      desc="What is x402? The HTTP 402 payment protocol explained in plain English: pay-per-request for AI agents, stablecoins, and why agents pay per visit."
      icon="3"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="crypto"
      slug="x402-protocol-explained"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Section id="overview" icon="3" title="What Is x402?" subtitle="Pay-per-request for the agent era">
        <p>
          x402 is an open payment protocol that turns the forgotten HTTP 402 Payment Required status into a working cash register for the web. When an AI agent visits a page or calls an API, the server can answer with a machine-readable price quote instead of the content.
        </p>
        <p>
          The agent pays the quoted amount in stablecoin, retries the request with proof of payment, and receives the content. Every visit settles on its own, which is why people say agents will pay every time they visit.
        </p>
        <FeatureGrid items={[
  { t: "Pay per request", d: "Each visit or API call carries its own tiny price. No monthly plan, no commitment." },
  { t: "No API keys", d: "Payment itself is the credential. Show valid payment and you get the content." },
  { t: "Instant settlement", d: "Money moves on-chain in seconds and the content unlocks right after verification." },
  { t: "Machine readable", d: "The 402 quote is structured data, so both humans and bots can understand the price and terms." },
]} />
      </Section>

      <Section id="flow" icon="🔁" title="The Flow in 30 Seconds" subtitle="Request, quote, pay, receive">
        <p className="text-xs text-slate-400">One visit, four steps. The agent asks, the server quotes, the agent pays, the server delivers.</p>
        <CodeBlock title="the 402 exchange" lines={`GET /premium-data
  -> HTTP 402 Payment Required
  -> { amount: 0.01, asset: USDC, network: base }
  -> agent pays 0.01 USDC, retries with proof
  -> HTTP 200 plus content`} />
        <InfoBox title="Free reading here">
          UpTools guides are free to read. No wallet needed here. When you meet x402 on other sites, the 402 response always states the price, asset, and network before you pay anything.
        </InfoBox>
      </Section>

      <Section id="facts" icon="📌" title="Key Facts" subtitle="The four ideas behind it">
        <FeatureGrid items={[
  { t: "402 status revived", d: "HTTP 402 Payment Required sat unused for decades. x402 gives it a real job: machine-to-machine payment requests." },
  { t: "Stablecoin money", d: "Payments settle in stablecoins such as USDC on fast low-fee networks, so a request can cost a fraction of a cent." },
  { t: "Built for agents", d: "An AI agent can read a 402 quote, pay from its wallet, and retry automatically. No signup forms, no API keys." },
  { t: "Open standard", d: "Anyone can implement the flow: quote in a 402 response, verify payment, then serve the content." },
]} />
      </Section>

      <Section id="issues" icon="🐞" title="Common Mistakes and Fixes" subtitle="What people get wrong">
        <div className="space-y-3">
          {[["Thinking 402 is an error", "In x402, 402 is a price quote. Parse the body for amount, asset, and network instead of treating it as a failure."], ["Paying without reading the quote", "Always verify amount, asset, destination, and expiry before sending money."], ["No spending caps on the agent", "Set per-request and daily caps so a bug or price spike cannot drain the wallet."]].map(([issue, fix]) => (
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
          Educational reference only. Nothing here is financial advice. Crypto prices and fees change, so verify current details in the official docs linked above.
        </p>
      </Section>
    </ToolLayout>
  )
}
