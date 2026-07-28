import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const defaultSections = {
  stats: true,
  languages: true,
  trophy: false,
  snake: false,
  streak: false,
  activityGraph: false,
  aboutMe: true,
  skills: true,
  socialLinks: true,
}

export default function github_profile_readme_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [skills, setSkills] = useState('')
  const [currentWork, setCurrentWork] = useState('')
  const [pronouns, setPronouns] = useState('')
  const [funFact, setFunFact] = useState('')
  const [twitter, setTwitter] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [website, setWebsite] = useState('')
  const [email, setEmail] = useState('')
  const [sections, setSections] = useState(defaultSections)
  const [theme, setTheme] = useState('tokyonight')
  const [copied, setCopied] = useState(false)

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-2.5 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500"

  const themes = ['tokyonight', 'radical', 'merko', 'gruvbox', 'dracula', 'onedark', 'cobalt', 'synthwave', 'dracula-dark', 'tokyonight-bright']

  const toggleSection = (key) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const readme = useMemo(() => {
    const lines = []

    // Header
    if (username) {
      lines.push(`# Hi 👋, I'm ${name || username}`)
    } else {
      lines.push(`# Hi 👋, I'm [Your Name]`)
    }

    // Bio
    if (bio) {
      lines.push(`\n${bio}`)
    }

    // Fun fact
    if (funFact) {
      lines.push(`\n- 🔭 I'm currently working on **${currentWork || '...'}**`)
      lines.push(`- 🌱 I'm currently learning **${funFact}**`)
    } else if (currentWork) {
      lines.push(`\n- 🔭 I'm currently working on **${currentWork}**`)
    }

    if (pronouns) {
      lines.push(`- 💕 Pronouns: ${pronouns}`)
    }

    // Skills
    if (sections.skills && skills) {
      lines.push(`\n### 🛠️ Tech Stack`)
      lines.push('')
      const skillList = skills.split(',').map(s => s.trim()).filter(Boolean)
      if (skillList.length > 0) {
        // Create skill badges
        const badges = skillList.map(skill => {
          const slug = skill.toLowerCase().replace(/[^a-z0-9+#.]/g, '')
          return `![${skill}](https://img.shields.io/badge/-${encodeURIComponent(skill)}-333?style=flat-square&logo=${slug}&logoColor=white)`
        })
        lines.push(badges.join(' '))
      }
    }

    // Social links
    if (sections.socialLinks && (twitter || linkedin || website || email)) {
      lines.push(`\n### 📫 How to reach me`)
      lines.push('')
      if (email) lines.push(`- ✉️ [Email](mailto:${email})`)
      if (twitter) lines.push(`- 🐦 [Twitter](https://twitter.com/${twitter.replace('@', '')})`)
      if (linkedin) lines.push(`- 💼 [LinkedIn](https://linkedin.com/in/${linkedin.replace(/.*linkedin\.com\/in\//, '')})`)
      if (website) lines.push(`- 🌐 [Website](${website.startsWith('http') ? website : 'https://' + website})`)
    }

    // GitHub Stats
    if (sections.stats && username) {
      lines.push(`\n### 📊 GitHub Stats`)
      lines.push('')
      lines.push(`![${username}'s GitHub stats](https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${theme}&hide_border=true&count_private=true)`)
    }

    // Languages
    if (sections.languages && username) {
      lines.push(`\n### 📊 Top Languages`)
      lines.push('')
      lines.push(`![${username}'s Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}&hide_border=true)`)
    }

    // Trophy
    if (sections.trophy && username) {
      lines.push(`\n### 🏆 Trophies`)
      lines.push('')
      lines.push(`![${username}'s Trophy](https://github-profile-trophy.vercel.app/?username=${username}&theme=${theme}&no-frame=true&column=7)`)
    }

    // Activity Graph
    if (sections.activityGraph && username) {
      lines.push(`\n### 📈 Activity Graph`)
      lines.push('')
      lines.push(`![${username}'s Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=${theme})`)
    }

    // Streak
    if (sections.streak && username) {
      lines.push(`\n### 🔥 GitHub Streak`)
      lines.push('')
      lines.push(`![${username}'s Streak](https://streak-stats.demolab.com?user=${username}&theme=${theme}&hide_border=true)`)
    }

    // Snake
    if (sections.snake && username) {
      lines.push(`\n### 🐍 GitHub Snake`)
      lines.push('')
      lines.push(`![${username}'s Snake animation](https://raw.githubusercontent.com/${username}/${username}/output/github-contribution-grid-snake-dark.svg)`)
    }

    // Footer
    lines.push(`\n---`)
    lines.push(`*Generated with ❤️ by [UpTools Profile README Generator](https://www.uptools.in/github-profile-readme-generator/)*`)

    return lines.join('\n')
  }, [username, name, bio, skills, currentWork, pronouns, funFact, twitter, linkedin, website, email, sections, theme])

  const copyMarkdown = () => {
    navigator.clipboard.writeText(readme)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ToolLayout
      title="GitHub Profile README Generator"
      desc="Generate a beautiful GitHub profile README.md with stats, trophies, skills badges, and social links. Copy and paste into your repo."
      icon="🐙" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="github-profile-readme-generator"
      faq={[
        { q: "How do I use this?", a: "Fill in your details, toggle the sections you want, then copy the generated markdown. Create a repo named after your username and add it as README.md." },
        { q: "What stats are shown?", a: "GitHub stats cards, top languages, trophy achievements, activity graphs, contribution streaks, and the famous snake animation." },
        { q: "Are the badges live?", a: "Yes! All stats are fetched live from GitHub's API via shields.io and github-readme-stats. They update automatically." },
      ]}
      howItWorks={[
        "Enter your GitHub username and personal details.",
        "Add your skills (comma-separated) and social links.",
        "Toggle on/off the sections you want: stats, languages, trophies, snake.",
        "Choose a color theme for your stats cards.",
        "Copy the generated README.md and paste it in your GitHub profile repo.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "GitHub Profile README Generator", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/github-profile-readme-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-6">
          {/* Left: Form */}
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="bg-white/[0.04] rounded-2xl border border-white/[0.06] p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Basic Info</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">GitHub Username *</label>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                    className={inputClass} placeholder="octocat" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Display Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    className={inputClass} placeholder="The Octocat" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Bio / Tagline</label>
                <input type="text" value={bio} onChange={e => setBio(e.target.value)}
                  className={inputClass} placeholder="Full-stack developer | Open source enthusiast" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Currently Working On</label>
                  <input type="text" value={currentWork} onChange={e => setCurrentWork(e.target.value)}
                    className={inputClass} placeholder="A new open-source project" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Pronouns</label>
                  <input type="text" value={pronouns} onChange={e => setPronouns(e.target.value)}
                    className={inputClass} placeholder="they/them" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Fun Fact / Learning</label>
                <input type="text" value={funFact} onChange={e => setFunFact(e.target.value)}
                  className={inputClass} placeholder="Rust and WebAssembly" />
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white/[0.04] rounded-2xl border border-white/[0.06] p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skills (comma-separated)</h3>
              <textarea value={skills} onChange={e => setSkills(e.target.value)}
                className={`${inputClass} h-24 resize-none font-mono`}
                placeholder="JavaScript, React, Node.js, Python, TypeScript, Docker, AWS" />
              <div className="flex flex-wrap gap-1.5">
                {skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 12).map((s, i) => (
                  <span key={i} className="px-2 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 text-[10px] font-bold border border-indigo-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white/[0.04] rounded-2xl border border-white/[0.06] p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Social Links</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Twitter</label>
                  <input type="text" value={twitter} onChange={e => setTwitter(e.target.value)}
                    className={inputClass} placeholder="@octocat" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">LinkedIn</label>
                  <input type="text" value={linkedin} onChange={e => setLinkedin(e.target.value)}
                    className={inputClass} placeholder="username or full URL" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Website</label>
                  <input type="text" value={website} onChange={e => setWebsite(e.target.value)}
                    className={inputClass} placeholder="https://yoursite.com" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className={inputClass} placeholder="you@example.com" />
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="bg-white/[0.04] rounded-2xl border border-white/[0.06] p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sections</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['stats', '📊 GitHub Stats', 'stats'],
                  ['languages', '💻 Top Languages', 'languages'],
                  ['trophy', '🏆 Trophies', 'trophy'],
                  ['snake', '🐍 Snake Animation', 'snake'],
                  ['streak', '🔥 Streak Stats', 'streak'],
                  ['activityGraph', '📈 Activity Graph', 'activityGraph'],
                  ['aboutMe', '👤 About Me', 'aboutMe'],
                  ['skills', '🛠️ Skills', 'skills'],
                  ['socialLinks', '📬 Social Links', 'socialLinks'],
                ].map(([key, label]) => (
                  <label key={key} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all border ${sections[key] ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' : 'bg-white/[0.03] border-white/[0.06] text-slate-500'}`}>
                    <input type="checkbox" checked={sections[key]} onChange={() => toggleSection(key)}
                      className="accent-indigo-500" />
                    <span className="text-xs font-semibold">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div className="bg-white/[0.04] rounded-2xl border border-white/[0.06] p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stats Theme</h3>
              <div className="flex flex-wrap gap-2">
                {themes.map(t => (
                  <button key={t} onClick={() => setTheme(t)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all capitalize ${theme === t ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/8 hover:bg-indigo-500/10'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="space-y-3" ref={resultRef}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-500">README.md Preview</label>
              <button onClick={() => { copyMarkdown(); jumpTo() }}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'glow-btn'}`}>
                {copied ? '✓ Copied to Clipboard' : '📋 Copy Markdown'}
              </button>
            </div>
            <div className="bg-slate-950/60 rounded-2xl border border-white/[0.08] p-5 min-h-[500px] overflow-auto">
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                {readme}
              </pre>
            </div>

            {/* Quick preview of stats cards */}
            {username && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-500">Live Stats Preview</label>
                <div className="bg-white/[0.04] rounded-2xl border border-white/[0.06] p-4 space-y-3 overflow-hidden">
                  {sections.stats && (
                    <img src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${theme}&hide_border=true&count_private=true`}
                      alt="GitHub Stats" className="rounded-xl w-full max-w-md" loading="lazy"
                      onError={e => e.target.style.display = 'none'} />
                  )}
                  {sections.languages && (
                    <img src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}&hide_border=true`}
                      alt="Top Languages" className="rounded-xl w-full max-w-md" loading="lazy"
                      onError={e => e.target.style.display = 'none'} />
                  )}
                  {sections.trophy && (
                    <img src={`https://github-profile-trophy.vercel.app/?username=${username}&theme=${theme}&no-frame=true&column=7`}
                      alt="Trophy" className="rounded-xl w-full max-w-md" loading="lazy"
                      onError={e => e.target.style.display = 'none'} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
