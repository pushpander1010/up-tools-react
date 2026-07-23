import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const TEMPLATES = [
  { id: 'professional', label: '💼 Professional', desc: 'Clean, ATS-friendly format' },
  { id: 'creative', label: '🎨 Creative', desc: 'Modern design for design roles' },
  { id: 'executive', label: '👔 Executive', desc: 'Senior leadership format' },
]

const SECTIONS = ['contact', 'summary', 'experience', 'education', 'skills']

const EMPTY_RESUME = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  summary: '',
  experience: [{ company: '', role: '', duration: '', bullets: [''] }],
  education: [{ school: '', degree: '', year: '' }],
  skills: '',
}

export default function rawcv_resume_builder() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [template, setTemplate] = useState('professional')
  const [resume, setResume] = useState(EMPTY_RESUME)
  const [activeSection, setActiveSection] = useState('contact')
  const [preview, setPreview] = useState(false)

  const update = useCallback((field, value) => {
    setResume(prev => ({ ...prev, [field]: value }))
  }, [])

  const updateExp = useCallback((index, field, value) => {
    setResume(prev => {
      const exp = [...prev.experience]
      exp[index] = { ...exp[index], [field]: value }
      return { ...prev, experience: exp }
    })
  }, [])

  const updateExpBullet = useCallback((expIndex, bulletIndex, value) => {
    setResume(prev => {
      const exp = [...prev.experience]
      const bullets = [...exp[expIndex].bullets]
      bullets[bulletIndex] = value
      exp[expIndex] = { ...exp[expIndex], bullets }
      return { ...prev, experience: exp }
    })
  }, [])

  const addExpBullet = useCallback((expIndex) => {
    setResume(prev => {
      const exp = [...prev.experience]
      exp[expIndex] = { ...exp[expIndex], bullets: [...exp[expIndex].bullets, ''] }
      return { ...prev, experience: exp }
    })
  }, [])

  const removeExpBullet = useCallback((expIndex, bulletIndex) => {
    setResume(prev => {
      const exp = [...prev.experience]
      exp[expIndex] = { ...exp[expIndex], bullets: exp[expIndex].bullets.filter((_, i) => i !== bulletIndex) }
      return { ...prev, experience: exp }
    })
  }, [])

  const addExperience = useCallback(() => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', role: '', duration: '', bullets: [''] }]
    }))
  }, [])

  const removeExperience = useCallback((index) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }, [])

  const updateEdu = useCallback((index, field, value) => {
    setResume(prev => {
      const edu = [...prev.education]
      edu[index] = { ...edu[index], [field]: value }
      return { ...prev, education: edu }
    })
  }, [])

  const addEducation = useCallback(() => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', year: '' }]
    }))
  }, [])

  const removeEducation = useCallback((index) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }, [])

  const generateHTML = useCallback(() => {
    const skills = resume.skills.split(',').map(s => s.trim()).filter(Boolean)
    const colors = { professional: '#1e293b', creative: '#7c3aed', executive: '#0f172a' }
    const accentColors = { professional: '#3b82f6', creative: '#8b5cf6', executive: '#0f766e' }
    const color = colors[template]
    const accent = accentColors[template]

    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${resume.name || 'Resume'} - Resume</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Georgia,'Times New Roman',serif;color:#1e293b;background:#fff;padding:40px 60px;line-height:1.5}
h1{font-size:28px;color:${color};margin-bottom:4px}
.subtitle{font-size:14px;color:#64748b;margin-bottom:8px}
.contact{font-size:12px;color:#475569;margin-bottom:20px;display:flex;flex-wrap:wrap;gap:8px}
.section{margin-bottom:18px}
.section-title{font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:${accent};border-bottom:2px solid ${accent};padding-bottom:4px;margin-bottom:10px}
.entry{margin-bottom:12px}
.entry-header{display:flex;justify-content:space-between;align-items:baseline}
.entry-title{font-weight:bold;font-size:14px}
.entry-meta{font-size:12px;color:#64748b}
.entry-sub{font-size:13px;color:#475569}
ul{padding-left:18px;font-size:13px}
li{margin-bottom:3px}
.skills{display:flex;flex-wrap:wrap;gap:6px}
.skill-tag{background:${accent}15;color:${accent};padding:2px 10px;border-radius:4px;font-size:12px}
</style></head><body>
<h1>${resume.name || 'Your Name'}</h1>
<div class="subtitle">${resume.title || 'Professional Title'}</div>
<div class="contact">
${resume.email ? `<span>📧 ${resume.email}</span>` : ''}
${resume.phone ? `<span>📱 ${resume.phone}</span>` : ''}
${resume.location ? `<span>📍 ${resume.location}</span>` : ''}
${resume.linkedin ? `<span>🔗 ${resume.linkedin}</span>` : ''}
</div>
${resume.summary ? `<div class="section"><div class="section-title">Professional Summary</div><p style="font-size:13px">${resume.summary}</p></div>` : ''}
${resume.experience.some(e => e.company || e.role) ? `<div class="section"><div class="section-title">Experience</div>${resume.experience.filter(e => e.company || e.role).map(e => `<div class="entry"><div class="entry-header"><span class="entry-title">${e.role || 'Role'}</span><span class="entry-meta">${e.duration || ''}</span></div><div class="entry-sub">${e.company || ''}</div><ul>${e.bullets.filter(Boolean).map(b => `<li>${b}</li>`).join('')}</ul></div>`).join('')}</div>` : ''}
${resume.education.some(e => e.school || e.degree) ? `<div class="section"><div class="section-title">Education</div>${resume.education.filter(e => e.school || e.degree).map(e => `<div class="entry"><div class="entry-header"><span class="entry-title">${e.degree || ''}</span><span class="entry-meta">${e.year || ''}</span></div><div class="entry-sub">${e.school || ''}</div></div>`).join('')}</div>` : ''}
${skills.length ? `<div class="section"><div class="section-title">Skills</div><div class="skills">${skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div></div>` : ''}
</body></html>`
  }, [resume, template])

  const handlePreview = useCallback(() => {
    setPreview(true)
    jumpTo()
  }, [jumpTo])

  const handleDownload = useCallback(() => {
    const html = generateHTML()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(resume.name || 'resume').replace(/\s+/g, '_').toLowerCase()}.html`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [generateHTML, resume.name])

  const handleCopyHTML = useCallback(() => {
    navigator.clipboard.writeText(generateHTML())
  }, [generateHTML])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 [color-scheme:dark]"
  const labelClass = "block text-xs font-semibold text-slate-400 mb-1.5"

  return (
    <ToolLayout
      title="AI Resume Builder (RawCV)"
      desc="Build a professional ATS-friendly resume with AI. Free, no login, no watermark."
      icon="📝" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="rawcv-resume-builder"
      faq={[
        { q: "What is RawCV Resume Builder?", a: "A free, browser-based resume builder that generates clean, ATS-friendly HTML resumes you can download or copy." },
        { q: "Is it free?", a: "Yes. No login, no watermark, no limits. Your resume is built entirely in your browser." },
      ]}
      howItWorks={[
        "Choose a template style (Professional, Creative, or Executive).",
        "Fill in your contact info, summary, experience, education, and skills.",
        "Preview your resume and download as HTML or copy the source code.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI Resume Builder (RawCV)", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/rawcv-resume-builder/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Template Picker */}
        <div className="flex gap-2">
          {TEMPLATES.map(t => (
            <button key={t.id} onClick={() => setTemplate(t.id)}
              className={`flex-1 p-3 rounded-xl text-xs font-bold transition-all border-2 ${
                template === t.id
                  ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                  : 'bg-white/[0.04] text-slate-500 border-white/8 hover:border-white/12'
              }`}>
              <div>{t.label}</div>
              <div className="text-[10px] font-normal opacity-60 mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>

        {/* Section Tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {SECTIONS.map(s => (
            <button key={s} onClick={() => setActiveSection(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                activeSection === s
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                  : 'bg-white/[0.04] text-slate-500 border border-white/8'
              }`}>
              {s === 'contact' ? '📇 Contact' : s === 'summary' ? '📋 Summary' : s === 'experience' ? '💼 Experience' : s === 'education' ? '🎓 Education' : '🛠️ Skills'}
            </button>
          ))}
        </div>

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <div className="rounded-2xl border-2 border-white/8 bg-white/[0.04] p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Full Name</label><input value={resume.name} onChange={e => update('name', e.target.value)} placeholder="John Doe" className={inputClass} /></div>
              <div><label className={labelClass}>Job Title</label><input value={resume.title} onChange={e => update('title', e.target.value)} placeholder="Software Engineer" className={inputClass} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Email</label><input value={resume.email} onChange={e => update('email', e.target.value)} placeholder="john@email.com" className={inputClass} /></div>
              <div><label className={labelClass}>Phone</label><input value={resume.phone} onChange={e => update('phone', e.target.value)} placeholder="+1 555 123 4567" className={inputClass} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Location</label><input value={resume.location} onChange={e => update('location', e.target.value)} placeholder="San Francisco, CA" className={inputClass} /></div>
              <div><label className={labelClass}>LinkedIn</label><input value={resume.linkedin} onChange={e => update('linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" className={inputClass} /></div>
            </div>
          </div>
        )}

        {/* Summary Section */}
        {activeSection === 'summary' && (
          <div className="rounded-2xl border-2 border-white/8 bg-white/[0.04] p-5">
            <label className={labelClass}>Professional Summary</label>
            <textarea value={resume.summary} onChange={e => update('summary', e.target.value)} rows={5} placeholder="Experienced software engineer with 8+ years building scalable systems..." className={inputClass + " resize-none"} />
          </div>
        )}

        {/* Experience Section */}
        {activeSection === 'experience' && (
          <div className="space-y-3">
            {resume.experience.map((exp, i) => (
              <div key={i} className="rounded-2xl border-2 border-white/8 bg-white/[0.04] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Experience {i + 1}</span>
                  {resume.experience.length > 1 && (
                    <button onClick={() => removeExperience(i)} className="text-red-400 hover:text-red-300 text-xs font-bold">✕ Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>Company</label><input value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} placeholder="Google" className={inputClass} /></div>
                  <div><label className={labelClass}>Role</label><input value={exp.role} onChange={e => updateExp(i, 'role', e.target.value)} placeholder="Senior Engineer" className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>Duration</label><input value={exp.duration} onChange={e => updateExp(i, 'duration', e.target.value)} placeholder="2020 - Present" className={inputClass} /></div>
                <div className="space-y-2">
                  <label className={labelClass}>Key Achievements</label>
                  {exp.bullets.map((bullet, j) => (
                    <div key={j} className="flex gap-2 items-center">
                      <span className="text-slate-600 text-xs">•</span>
                      <input value={bullet} onChange={e => updateExpBullet(i, j, e.target.value)} placeholder="Led team of 5 engineers to deliver..." className={inputClass + " flex-1"} />
                      {exp.bullets.length > 1 && (
                        <button onClick={() => removeExpBullet(i, j)} className="text-red-400/60 hover:text-red-400 text-xs">✕</button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addExpBullet(i)} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">+ Add bullet point</button>
                </div>
              </div>
            ))}
            <button onClick={addExperience} className="w-full py-3 rounded-2xl bg-white/[0.04] border-2 border-dashed border-white/8 text-slate-400 font-bold text-xs hover:text-white hover:border-white/15 transition-all">
              + Add Experience
            </button>
          </div>
        )}

        {/* Education Section */}
        {activeSection === 'education' && (
          <div className="space-y-3">
            {resume.education.map((edu, i) => (
              <div key={i} className="rounded-2xl border-2 border-white/8 bg-white/[0.04] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Education {i + 1}</span>
                  {resume.education.length > 1 && (
                    <button onClick={() => removeEducation(i)} className="text-red-400 hover:text-red-300 text-xs font-bold">✕ Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>School</label><input value={edu.school} onChange={e => updateEdu(i, 'school', e.target.value)} placeholder="MIT" className={inputClass} /></div>
                  <div><label className={labelClass}>Degree</label><input value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} placeholder="B.S. Computer Science" className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>Year</label><input value={edu.year} onChange={e => updateEdu(i, 'year', e.target.value)} placeholder="2016" className={inputClass} /></div>
              </div>
            ))}
            <button onClick={addEducation} className="w-full py-3 rounded-2xl bg-white/[0.04] border-2 border-dashed border-white/8 text-slate-400 font-bold text-xs hover:text-white hover:border-white/15 transition-all">
              + Add Education
            </button>
          </div>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <div className="rounded-2xl border-2 border-white/8 bg-white/[0.04] p-5">
            <label className={labelClass}>Skills (comma-separated)</label>
            <textarea value={resume.skills} onChange={e => update('skills', e.target.value)} rows={4}
              placeholder="React, Node.js, Python, AWS, Docker, SQL, TypeScript"
              className={inputClass + " resize-none font-mono text-xs"} />
            <p className="text-[10px] text-slate-600 mt-2">Separate skills with commas. They'll appear as tags on your resume.</p>
          </div>
        )}

        {/* Action Buttons */}
        <button onClick={handlePreview}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          👁️ Preview Resume
        </button>

        {preview && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Resume Preview</h3>
            </div>

            {/* Live Preview */}
            <div className="bg-white rounded-xl overflow-hidden mb-4 border border-slate-200">
              <iframe
                srcDoc={generateHTML()}
                title="Resume Preview"
                className="w-full border-0"
                style={{ minHeight: 500 }}
                sandbox="allow-same-origin"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={handleDownload}
                className="flex-1 py-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-sm font-bold hover:bg-emerald-500/25 transition-all active:scale-[0.98]">
                📥 Download HTML
              </button>
              <button onClick={handleCopyHTML}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/8 text-sm font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-[0.98]">
                📋 Copy HTML
              </button>
            </div>
          </div>
        )}

        {!preview && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📝</div>
            <p className="text-sm text-slate-600 font-medium">Fill in your details and click Preview</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
