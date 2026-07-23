import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import useAIStream from '../hooks/useAIStream'

export default function ai_cover_letter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const { output, status, streaming, generate, stop } = useAIStream()
  const [copied, setCopied] = useState(false)

  const [name, setName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [experience, setExperience] = useState('mid-level (3–7 years)')
  const [tone, setTone] = useState('professional')
  const [industry, setIndustry] = useState('')
  const [skills, setSkills] = useState('')
  const [achievement, setAchievement] = useState('')

  const handleGenerate = useCallback(() => {
    if (!jobTitle.trim()) return

    const prompt = `Write a ${tone} cover letter for a job application.

Applicant: ${name || 'Applicant'}
Applying for: ${jobTitle} at ${company || 'your company'}
Experience: ${experience}
${industry ? 'Industry: ' + industry : ''}
${skills ? 'Key skills: ' + skills : ''}
${achievement ? 'Top achievement: ' + achievement : ''}

Write a complete, ready-to-send cover letter with:
- Proper salutation
- Strong opening paragraph that grabs attention
- 2 body paragraphs highlighting skills and fit
- Closing paragraph with a clear call to action
- Professional sign-off with the applicant's name

Tone: ${tone}. Do not use placeholder brackets — use the details provided.`

    generate({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.65,
      systemPrompt: 'You are an expert career coach and professional cover letter writer. Write compelling, personalized cover letters that get interviews.',
    })
    jumpTo()
  }, [name, jobTitle, company, experience, tone, industry, skills, achievement, generate, jumpTo])

  const copy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }

  const download = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'cover-letter.txt'
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"
  const selectClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="AI Cover Letter Generator"
      desc="Generate professional cover letters instantly with AI. Fill in your details and get a tailored cover letter in seconds."
      icon="📄" iconBg="rgba(99,102,241,0.08)"
      category="ai" slug="ai-cover-letter"
      faq={[
        { q: "Is this cover letter generator free?", a: "Yes, completely free with no sign-up or download required." },
        { q: "Can I download the cover letter?", a: "Yes, you can copy it to clipboard or download as a .txt file instantly." },
      ]}
      howItWorks={[
        "Enter your name, the job title, and company you're applying to.",
        "Select your experience level, tone, and add key skills.",
        "Click Generate to get a professional cover letter.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI Cover Letter Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/ai-cover-letter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Your Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rahul Sharma" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Job Title Applying For *</label>
              <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Senior Product Manager" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Company</label>
              <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Experience Level</label>
              <select value={experience} onChange={e => setExperience(e.target.value)} className={selectClass}>
                <option>entry-level (0–2 years)</option>
                <option>mid-level (3–7 years)</option>
                <option>senior (8+ years)</option>
                <option>executive / leadership</option>
                <option>career changer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Tone</label>
              <select value={tone} onChange={e => setTone(e.target.value)} className={selectClass}>
                <option>professional</option><option>confident</option><option>enthusiastic</option><option>formal</option><option>friendly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Industry (optional)</label>
              <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. tech, finance" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Key Skills (optional)</label>
            <input type="text" value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. React, product strategy, team leadership" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Top Achievement (optional)</label>
            <input type="text" value={achievement} onChange={e => setAchievement(e.target.value)} placeholder="e.g. Led a team that increased revenue by 40%" className={inputClass} />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {streaming ? (
            <button onClick={stop} className="flex-1 px-6 py-3 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all">⏹ Stop</button>
          ) : (
            <button onClick={handleGenerate} disabled={!jobTitle.trim()}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>✨ Generate Cover Letter</button>
          )}
          <button onClick={copy} disabled={!output} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all disabled:opacity-40 ${copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'}`}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
          <button onClick={download} disabled={!output} className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all disabled:opacity-40">⬇ Download</button>
        </div>

        {status && <div className={`p-3 rounded-xl text-sm ${status.includes('Error') ? 'bg-red-500/10 border border-red-500/20 text-red-400' : status.includes('Done') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400'}`}>{status}</div>}

        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          {output ? (
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-3 opacity-20">📄</div>
              <p className="text-sm text-slate-600 font-medium">Enter job details and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
