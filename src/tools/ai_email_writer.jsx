import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import useAIStream from '../hooks/useAIStream'

const EMAIL_TYPES = ['cold outreach', 'follow-up', 'job application', 'thank you', 'networking', 'proposal']

export default function ai_email_writer() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const { output, status, streaming, generate, stop } = useAIStream()
  const [copied, setCopied] = useState(false)

  const [emailType, setEmailType] = useState('cold outreach')
  const [sender, setSender] = useState('')
  const [recipient, setRecipient] = useState('')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const [context, setContext] = useState('')
  const [cta, setCta] = useState('')

  const phishingTerms = ['verify your account', 'confirm your password', 'update your payment', 'suspended account', 'unauthorized access', 'click here immediately', 'wire transfer', 'send money', 'gift card', 'bitcoin address', 'social security', 'credit card number', 'bank account number', 'phishing', 'scam', 'impersonate', 'pretend to be']

  const handleGenerate = useCallback(() => {
    if (!context.trim()) return
    const lower = context.toLowerCase()
    if (phishingTerms.some(term => lower.includes(term))) return

    const prompt = `Write a ${tone} ${emailType} email.

From: ${sender || 'the sender'}
To: ${recipient || 'the recipient'}
Context: ${context}
${cta ? 'Desired outcome: ' + cta : ''}
Length: ${length}

Format:
Subject: [compelling subject line]

[email body]

[professional sign-off]

Make it natural, ${tone}, and ready to send. Do not use placeholder brackets — use the context provided.`

    generate({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      systemPrompt: 'You are an expert email copywriter. Write clear, professional, and effective emails that get responses. Always include a subject line.',
    })
    jumpTo()
  }, [emailType, sender, recipient, tone, length, context, cta, generate, jumpTo])

  const copy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"
  const selectClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="AI Email Writer"
      desc="Write professional emails instantly — cold outreach, follow-ups, job applications. AI-powered, free, no sign-up."
      icon="✉️" iconBg="rgba(99,102,241,0.08)"
      category="ai" slug="ai-email-writer"
      faq={[
        { q: "What types of emails can it write?", a: "Cold outreach, follow-ups, job applications, thank-you notes, networking, and proposals." },
        { q: "Is the output ready to send?", a: "Yes — the AI writes complete emails with subject lines, body, and sign-off. Always review before sending." },
      ]}
      howItWorks={[
        "Select the email type and fill in sender/recipient details.",
        "Describe what the email is about and your desired outcome.",
        "Click Generate to get a ready-to-send email.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI Email Writer", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/ai-email-writer/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Email Type</label>
            <div className="flex gap-2 flex-wrap">
              {EMAIL_TYPES.map(t => (
                <button key={t} onClick={() => setEmailType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${emailType === t ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-white/[0.06] text-slate-500 border-white/[0.08]'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">From (your name)</label>
              <input type="text" value={sender} onChange={e => setSender(e.target.value)} placeholder="e.g. Sarah Johnson" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">To (recipient)</label>
              <input type="text" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="e.g. Hiring Manager" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Tone</label>
              <select value={tone} onChange={e => setTone(e.target.value)} className={selectClass}>
                <option>professional</option><option>friendly</option><option>formal</option><option>casual</option><option>persuasive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Length</label>
              <select value={length} onChange={e => setLength(e.target.value)} className={selectClass}>
                <option>short (3–4 sentences)</option><option>medium (1 paragraph)</option><option>long (2–3 paragraphs)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">What is the email about? *</label>
            <textarea value={context} onChange={e => setContext(e.target.value)} rows={3}
              placeholder="e.g. Following up on my application for the Frontend Developer role at Google. I submitted my resume last week and want to express my continued interest."
              className={inputClass + ' resize-none'} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Desired Outcome (optional)</label>
            <input type="text" value={cta} onChange={e => setCta(e.target.value)} placeholder="e.g. Schedule an interview, get a meeting, close the deal" className={inputClass} />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {streaming ? (
            <button onClick={stop} className="flex-1 px-6 py-3 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all">⏹ Stop</button>
          ) : (
            <button onClick={handleGenerate} disabled={!context.trim()}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>✨ Generate Email</button>
          )}
          <button onClick={copy} disabled={!output} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all disabled:opacity-40 ${copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'}`}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>

        {status && <div className={`p-3 rounded-xl text-sm ${status.includes('Error') ? 'bg-red-500/10 border border-red-500/20 text-red-400' : status.includes('Done') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400'}`}>{status}</div>}

        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          {output ? (
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-3 opacity-20">✉️</div>
              <p className="text-sm text-slate-600 font-medium">Describe the email and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
