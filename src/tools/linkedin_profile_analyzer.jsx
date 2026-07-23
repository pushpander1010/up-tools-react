import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function linkedin_profile_analyzer() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [headline, setHeadline] = useState('')
  const [about, setAbout] = useState('')
  const [experience, setExperience] = useState('0')
  const [skills, setSkills] = useState('0')
  const [recommendations, setRecommendations] = useState('0')
  const [connections, setConnections] = useState('0')
  const [result, setResult] = useState(null)

  const analyze = useCallback(() => {
    if (!headline.trim() && !about.trim() && experience === '0' && skills === '0') return

    let totalScore = 0
    const sections = []

    // Headline (25 pts)
    let hScore = 0
    if (headline.length > 0) hScore = 5
    if (headline.length >= 40) hScore = 10
    if (headline.length >= 80) hScore = 15
    if (headline.length >= 120) hScore = 20
    if (headline.length >= 120 && (headline.includes('|') || headline.includes('-') || headline.includes('•'))) hScore = 25
    totalScore += hScore
    sections.push({ name: 'Headline', score: hScore, max: 25, tip: headline.length < 120 ? 'Expand your headline to 120+ characters with keywords and value proposition.' : 'Great headline! Consider adding separators (|, -, •) for readability.' })

    // About (25 pts)
    let aScore = 0
    if (about.length > 0) aScore = 5
    if (about.length >= 50) aScore = 10
    if (about.length >= 150) aScore = 15
    if (about.length >= 300) aScore = 20
    if (about.length >= 500) aScore = 25
    totalScore += aScore
    sections.push({ name: 'About Section', score: aScore, max: 25, tip: about.length < 300 ? 'Expand your about section to 300+ characters with achievements and keywords.' : 'Strong about section! Keep it updated with recent achievements.' })

    // Experience (20 pts)
    const exp = parseInt(experience) || 0
    let eScore = 0
    if (exp >= 1) eScore = 5
    if (exp >= 3) eScore = 10
    if (exp >= 5) eScore = 15
    if (exp >= 7) eScore = 20
    totalScore += eScore
    sections.push({ name: 'Experience', score: eScore, max: 20, tip: exp < 5 ? 'Add more relevant work experience. Include quantifiable achievements.' : 'Good experience count! Focus on detailing achievements in each role.' })

    // Skills (15 pts)
    const sk = parseInt(skills) || 0
    let sScore = 0
    if (sk >= 5) sScore = 3
    if (sk >= 10) sScore = 6
    if (sk >= 15) sScore = 9
    if (sk >= 20) sScore = 12
    if (sk >= 25) sScore = 15
    totalScore += sScore
    sections.push({ name: 'Skills', score: sScore, max: 15, tip: sk < 15 ? 'Add more relevant skills. LinkedIn allows up to 50. Focus on your top 15-20.' : 'Excellent skills list! Ask colleagues to endorse your top skills.' })

    // Recommendations (10 pts)
    const rec = parseInt(recommendations) || 0
    let rScore = 0
    if (rec >= 1) rScore = 2
    if (rec >= 3) rScore = 5
    if (rec >= 5) rScore = 8
    if (rec >= 8) rScore = 10
    totalScore += rScore
    sections.push({ name: 'Recommendations', score: rScore, max: 10, tip: rec < 5 ? 'Request recommendations from colleagues, managers, and clients.' : 'Great! Keep building your recommendation portfolio.' })

    // Connections (5 pts)
    const conn = parseInt(connections) || 0
    let cScore = 0
    if (conn >= 50) cScore = 1
    if (conn >= 150) cScore = 2
    if (conn >= 300) cScore = 3
    if (conn >= 500) cScore = 4
    if (conn >= 1000) cScore = 5
    totalScore += cScore
    sections.push({ name: 'Connections', score: cScore, max: 5, tip: conn < 500 ? 'Grow your network. Connect with colleagues, alumni, and industry professionals.' : 'Strong network! Continue engaging with your connections.' })

    const score = Math.min(100, totalScore)
    const label = score >= 80 ? '🏆 Strong Profile!' : score >= 60 ? '👍 Good Profile' : score >= 40 ? '📈 Needs Improvement' : '⚠️ Weak Profile'
    const summary = score >= 80 ? 'Your profile is well-optimized. Keep it updated!' : score >= 60 ? 'Your profile is decent. Focus on the suggestions below to improve.' : score >= 40 ? 'Your profile needs work. Follow the tips below to boost your score.' : 'Your profile needs significant improvement. Start with the basics.'
    const weakSections = sections.filter(s => (s.score / s.max) < 0.8).sort((a, b) => (a.score / a.max) - (b.score / b.max))

    setResult({ score, label, summary, sections, weakSections })
    jumpTo()
  }, [headline, about, experience, skills, recommendations, connections, jumpTo])

  const reset = useCallback(() => {
    setHeadline(''); setAbout(''); setExperience('0'); setSkills('0'); setRecommendations('0'); setConnections('0')
    setResult(null)
  }, [])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="LinkedIn Profile Strength Analyzer"
      desc="Analyze your LinkedIn profile strength and get actionable tips to improve visibility, engagement, and job opportunities."
      icon="💼" iconBg="rgba(10,102,194,0.08)"
      category="social" slug="linkedin-profile-analyzer"
      faq={[
        { q: "How is LinkedIn profile strength calculated?", a: "Profile strength is calculated based on headline quality, about section completeness, experience count, skills listed, recommendations received, and connection count." },
        { q: "What is a good LinkedIn profile score?", a: "A score of 80+ is considered strong. Aim for a complete profile with all sections filled out, 15+ skills, and 5+ recommendations." },
        { q: "Does this tool store my LinkedIn data?", a: "No. All calculations run in your browser. Nothing is uploaded or stored." },
      ]}
      howItWorks={[
        "Enter your headline, about section, experience, skills, recommendations, and connections.",
        "Click Analyze to see your profile strength score.",
        "Review the section-by-section breakdown and improvement suggestions.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "LinkedIn Profile Strength Analyzer", "applicationCategory": "BusinessApplication",
        "url": "https://www.uptools.in/linkedin-profile-analyzer/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5 space-y-4">
          <h2 className="text-sm font-bold text-white">📊 Enter Your Profile Details</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Headline</label>
            <input type="text" value={headline} onChange={e => setHeadline(e.target.value)}
              placeholder="e.g., Senior Software Engineer at Google | React & Node.js Expert"
              className={inputClass} />
            <p className="text-xs text-slate-500 mt-1">A strong headline includes your role, skills, and value proposition. (Optimal: 120+ characters)</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">About / Summary Section</label>
            <textarea value={about} onChange={e => setAbout(e.target.value)} rows={3}
              placeholder="Describe your professional background, achievements, and career goals..."
              className={inputClass + " resize-none"} />
            <p className="text-xs text-slate-500 mt-1">A detailed about section helps recruiters understand your expertise. (Optimal: 200+ characters)</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Work Experience</label>
              <input type="number" value={experience} onChange={e => setExperience(e.target.value)} min="0" max="50"
                className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Skills Listed</label>
              <input type="number" value={skills} onChange={e => setSkills(e.target.value)} min="0" max="50"
                className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Recommendations</label>
              <input type="number" value={recommendations} onChange={e => setRecommendations(e.target.value)} min="0" max="100"
                className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Connections</label>
              <input type="number" value={connections} onChange={e => setConnections(e.target.value)} min="0" max="30000"
                className={inputClass} />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => { analyze(); jumpTo() }}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-sm hover:opacity-90 transition-all duration-200 active:scale-[0.98]">
            🔍 Analyze Profile
          </button>
          <button onClick={reset}
            className="px-6 py-4 rounded-2xl bg-white/[0.06] border border-white/8 text-slate-400 font-bold text-sm hover:text-white transition-all">
            ↺ Reset
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="space-y-4" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            {/* Score */}
            <div className="rounded-3xl border-2 border-blue-500/15 bg-gradient-to-br from-blue-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">📈 Profile Strength Score</h3>
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white mb-2">{result.score}%</div>
                <div className="text-lg font-bold text-blue-400 mb-3">{result.label}</div>
                <div className="w-full bg-white/[0.06] rounded-full h-3 mb-3">
                  <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000"
                    style={{ width: `${result.score}%` }} />
                </div>
                <p className="text-sm text-slate-400">{result.summary}</p>
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
              <h3 className="text-sm font-bold text-white mb-4">📋 Section Breakdown</h3>
              <div className="space-y-3">
                {result.sections.map((s, i) => {
                  const pct = Math.round((s.score / s.max) * 100)
                  const color = pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'
                  const icon = pct >= 80 ? '✅' : pct >= 50 ? '⚠️' : '❌'
                  return (
                    <div key={i} className="bg-black/20 rounded-xl p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-white">{icon} {s.name}</span>
                        <span className="text-xs text-slate-400">{s.score}/{s.max} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-white/[0.06] rounded-full h-1.5">
                        <div className="h-1.5 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Improvement Tips */}
            <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
              <h3 className="text-sm font-bold text-white mb-4">💡 Improvement Suggestions</h3>
              {result.weakSections.length === 0 ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm text-emerald-400">
                  🎉 Your profile scores well across all sections. Keep it updated!
                </div>
              ) : (
                <div className="space-y-2">
                  {result.weakSections.map((s, i) => (
                    <div key={i} className={`rounded-xl p-3 border ${
                      (s.score / s.max) >= 0.5
                        ? 'bg-amber-500/10 border-amber-500/20'
                        : 'bg-red-500/10 border-red-500/20'
                    }`}>
                      <div className="text-sm font-semibold text-white mb-1">
                        {(s.score / s.max) >= 0.5 ? '⚠️' : '❌'} {s.name} ({Math.round((s.score / s.max) * 100)}%)
                      </div>
                      <div className="text-xs text-slate-400">{s.tip}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💼</div>
            <p className="text-sm text-slate-600 font-medium">Fill in your profile details and click Analyze</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
