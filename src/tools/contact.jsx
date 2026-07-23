import { useState, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function contact() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)
  const [copied, setCopied] = useState(false)

  const MAX_MSG = 2000

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('contact-draft') || '{}')
      if (saved.name) setName(saved.name)
      if (saved.email) setEmail(saved.email)
      if (saved.topic) setTopic(saved.topic)
      if (saved.message) setMessage(saved.message)
    } catch {}
  }, [])

  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem('contact-draft', JSON.stringify({ name, email, topic, message }))
    } catch {}
    setStatus({ ok: true, msg: 'Draft saved on this device.' })
    setTimeout(() => setStatus(null), 2000)
  }, [name, email, topic, message])

  const clearDraft = useCallback(() => {
    setName(''); setEmail(''); setTopic(''); setMessage('')
    try { localStorage.removeItem('contact-draft') } catch {}
  }, [])

  const copyEmail = useCallback(async () => {
    try { await navigator.clipboard.writeText('support@uptools.in') } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const submit = useCallback((e) => {
    e.preventDefault()
    if (!name || !email || !topic || !message) {
      setStatus({ ok: false, msg: 'Please fill all required fields.' })
      return
    }
    const subject = encodeURIComponent(`[UpTools] ${topic}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message.slice(0, 5000)}`
    )
    window.location.href = `mailto:support@uptools.in?subject=${subject}&body=${body}`
    jumpTo()
  }, [name, email, topic, message])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Contact Us"
      desc="Get in touch with the UpTools team. Report bugs, suggest features, or ask questions."
      icon="📬" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="contact"
      faq={[
        { q: "How do I contact support?", a: "Fill out the form below and click Send — it opens your email client with the message pre-filled." },
        { q: "Is there a response time?", a: "We aim to respond within 48 hours on business days." },
      ]}
      howItWorks={[
        "Fill in your name, email, and topic.",
        "Write your message (max 2000 characters).",
        "Click Send to open your email client with the message.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Contact Us", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/contact/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Support email */}
        <div className="bg-white/[0.06] border-2 border-white/8 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Email us directly</p>
            <p className="font-mono text-sm text-white">support@uptools.in</p>
          </div>
          <button onClick={copyEmail}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 border-white/[0.08] text-slate-400 hover:text-white'
            }`}>
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Your name" required
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com" required
                className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Topic *</label>
            <select value={topic} onChange={e => setTopic(e.target.value)} required
              className={inputClass + " bg-gray-900"}>
              <option value="" className="bg-gray-900">Select a topic...</option>
              <option value="Bug Report" className="bg-gray-900">Bug Report</option>
              <option value="Feature Request" className="bg-gray-900">Feature Request</option>
              <option value="General Question" className="bg-gray-900">General Question</option>
              <option value="Partnership" className="bg-gray-900">Partnership</option>
              <option value="Other" className="bg-gray-900">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Message *</label>
            <textarea value={message} onChange={e => setMessage(e.target.value.slice(0, MAX_MSG))}
              placeholder="Write your message..." rows={6} required
              className={inputClass + " resize-none"} />
            <div className="text-xs text-slate-500 mt-1 text-right">
              {message.length} / {MAX_MSG}
            </div>
          </div>

          {/* Honeypot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off"
            className="absolute opacity-0 pointer-events-none" />

          <div className="flex gap-3">
            <button type="submit"
              className="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98]">
              📧 Send Message
            </button>
            <button type="button" onClick={saveDraft}
              className="px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 font-bold text-sm hover:text-white transition-all">
              💾
            </button>
            <button type="button" onClick={clearDraft}
              className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-all">
              🗑️
            </button>
          </div>
        </form>

        {status && (
          <div ref={resultRef} className={`p-3 rounded-xl text-sm ${
            status.ok ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {status.ok ? '✅' : '❌'} {status.msg}
          </div>
        )}

        {!status && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📬</div>
            <p className="text-sm text-slate-600 font-medium">Fill the form and click Send to reach us</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
