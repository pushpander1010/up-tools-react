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
      title="AI Email Writer – Write Professional Emails with AI (Free)"
      desc="Free AI email writer: write professional emails in seconds — cold outreach, follow-ups, job applications, thank-you notes, and proposals. No sign-up, no credit card. Set tone, length, and language."
      icon="✉️" iconBg="rgba(99,102,241,0.08)"
      category="ai" slug="ai-email-writer"
      faq={[
        { q: "How does the AI email writer work?", a: "You pick an email type (cold outreach, follow-up, job application, etc.), add your tone and length, and describe what the email is about. The AI drafts a complete email with a subject line, body, and sign-off you can review and send." },
        { q: "What kinds of emails can I write with it?", a: "Cold outreach, follow-ups, job applications, thank-you notes, networking emails, and proposals. You can also describe any other situation and it will write a tailored email for it." },
        { q: "Can I set the tone, length, or language?", a: "Yes. Choose from professional, friendly, formal, casual, or persuasive tones, and short, medium, or long length. The AI writes to match the tone and length you select." },
        { q: "Is the AI email writer free?", a: "Yes, it is completely free with no sign-up and no credit card. There is no limit on how many emails you can generate." },
        { q: "Does it write a subject line too?", a: "Yes. Every generated email includes a compelling subject line, the email body, and a professional sign-off — ready to review and send." },
        { q: "How is this different from using a general AI chatbot?", a: "This tool is purpose-built for emails: it structures output as a subject line + body + sign-off, and you can pick a tone and length. A general chatbot needs you to prompt all that formatting yourself." },
        { q: "Is my data private?", a: "You write the email context directly in your browser and it is sent to generate your email. Do not paste sensitive personal data such as passwords or account numbers into the tool." },
        { q: "Should I use it for sensitive emails?", a: "Use your judgement. The AI is a helpful drafting tool, but always review and edit sensitive or high-stakes emails yourself before sending." },
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${emailType === t ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-white/[0.06] text-slate-400 border-white/[0.08]'}`}>
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

      {/* SEO content section */}
      <div className="max-w-2xl mx-auto pt-2">
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Write Professional Emails in Seconds – Free, No Sign-Up</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Writer's block with an important email? This free AI email writer drafts clear,
              professional, ready-to-send emails in seconds. It handles cold outreach, follow-ups,
              job applications, thank-you notes, networking, and proposals — with no sign-up, no
              credit card, and no limits.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">How it works</h3>
            <ol className="list-decimal list-inside text-sm text-slate-400 space-y-1.5 leading-relaxed">
              <li>Pick the email type: cold outreach, follow-up, job application, thank you, networking, or proposal.</li>
              <li>Choose a tone (professional, friendly, formal, casual, or persuasive) and a length.</li>
              <li>Describe what the email is about and your desired outcome.</li>
              <li>Click <strong className="text-slate-200">Generate Email</strong> to get a complete email with a subject line, body, and sign-off.</li>
            </ol>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">What kinds of emails you can write</h3>
            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1.5 leading-relaxed">
              <li>Cold outreach and sales emails that get replies</li>
              <li>Follow-up emails that are polite but effective</li>
              <li>Job application and cover-letter-style emails</li>
              <li>Thank-you notes, networking messages, and proposals</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">Why use our free AI email writer?</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              It is genuinely free with no sign-up and no daily limits. You control the tone, length,
              and type, and every email comes with a subject line and sign-off so it is ready to
              review and send. Perfect for anyone who writes emails regularly but wants to save time
              and sound professional.
            </p>
          </div>
          <p className="text-xs text-slate-600 pt-1">
            More free AI writing tools:{' '}
            <a className="text-indigo-400 hover:text-indigo-300" href="/ai-cover-letter/">AI Cover Letter</a>,{' '}
            <a className="text-indigo-400 hover:text-indigo-300" href="/ai-writer/">AI Writer</a>,{' '}
            and <a className="text-indigo-400 hover:text-indigo-300" href="/ai-caption-generator/">AI Caption Generator</a>.
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
