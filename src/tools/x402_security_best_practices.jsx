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
  { q: "What is the biggest x402 security mistake?", a: "Serving content on an unverified proof. Always confirm through the facilitator first." },
  { q: "What is a replay attack?", a: "Reusing one payment proof for many downloads. Bind proofs to single uses or short windows." },
  { q: "Should I check the destination wallet?", a: "Yes. Confirm funds went to your address, or an attacker can pay themselves and show you the receipt." },
  { q: "Do quotes need expiry?", a: "Yes. Without expiry, buyers can reuse old cheap quotes after you raise prices." },
  { q: "What belongs in the logs?", a: "Quote details, payment proof reference, verification verdict, timestamp, and what was served." },
  { q: "How do refunds stay safe?", a: "Refund only to the paying wallet, only for failed deliveries, and record every refund next to its log entry." },
]

const howItWorks = [
  "Require the payment proof on every retry of a protected endpoint.",
  "Ask the facilitator whether the proof is genuine and matched.",
  "Compare amount, asset, network, and destination against the live quote.",
  "Reject expired quotes and already-used proofs with a fresh 402.",
  "Serve content and write the full audit log entry.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "x402 Security Best Practices",
      description: "x402 security best practices: facilitator verification, replay protection, amount and destination checks, refunds, and audit logging.",
      about: "x402 security checklist for sellers and buyers",
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

export default function x402_security_best_practices() {
  return (
    <ToolLayout
      title="x402 Security Best Practices"
      desc="x402 security checklist: server-side verification, replay protection, amount checks, refund policy, and logging every paid request."
      icon="Y"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="crypto"
      slug="x402-security-best-practices"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Section id="overview" icon="Y" title="x402 Security Checklist" subtitle="Trust proofs, never claims">
        <p>
          x402 moves real money, so its security model is simple: trust nothing the buyer says and verify everything through the facilitator. Every retry must prove a fresh matching payment before content flows.
        </p>
        <p>
          The rest is hygiene that every payment system needs: single-use proofs, expiring quotes, destination checks, honest refunds, and logs detailed enough to settle any dispute.
        </p>
        <FeatureGrid items={[
  { t: "Verify everything", d: "Amount, asset, network, destination, and freshness checked on each retry." },
  { t: "Single-use proofs", d: "One payment unlocks one response unless you explicitly sell passes." },
  { t: "Clear refunds", d: "Failed delivery means money back to the payer wallet, automatically when possible." },
  { t: "Full visibility", d: "Dashboards show paid hits, rejected proofs, and revenue per endpoint." },
]} />
      </Section>

      <Section id="flow" icon="🔁" title="Verification Gates" subtitle="Six gates, zero trust">
        <p className="text-xs text-slate-400">Run every retry through all six gates. First failure returns a fresh 402, not content.</p>
        <CodeBlock title="verification checklist" lines={`on every retry:
  1. proof present? else 402 again
  2. facilitator says valid? else 402
  3. amount matches quote? else 402
  4. asset and network match? else 402
  5. destination is ours? else 402
  6. quote still fresh? else new quote
  pass all six, then serve 200`} />
        <InfoBox title="Golden rule">
          Verification is not optional. Every shortcut here is a way to give away content for free or lose money to fake proofs.
        </InfoBox>
      </Section>

      <Section id="facts" icon="📌" title="Security Pillars" subtitle="Non-negotiables">
        <FeatureGrid items={[
  { t: "Never trust clients", d: "Any proof string can be forged. Only the facilitator verdict counts." },
  { t: "Replay protection", d: "Each proof must unlock content once or within a short window, never forever." },
  { t: "Expiry enforced", d: "Stale quotes get rejected so old prices cannot be reused later." },
  { t: "Log everything", d: "Quote id, amount, proof, and verdict for every paid hit. Logs settle disputes." },
]} />
      </Section>

      <Section id="issues" icon="🐞" title="Common Mistakes and Fixes" subtitle="What people get wrong">
        <div className="space-y-3">
          {[["Serving before verifying", "Content goes out only after the facilitator confirms. No exceptions, even for small amounts."], ["Accepting reused proofs", "Track used proofs and reject repeats. One payment, one delivery."], ["Thin logs", "If it is not logged, it did not happen. Log quote, proof, verdict, and delivery."]].map(([issue, fix]) => (
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
          Educational security guidance, not an audit. Have payment code reviewed before handling real money.
        </p>
      </Section>
    </ToolLayout>
  )
}
