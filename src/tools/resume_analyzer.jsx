import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const WORD_RE = /[\p{L}\p{N}][\p{L}\p{N}''\-+.#\/]*/gu

function counts(text) {
  return { chars: text.length, words: (text.match(WORD_RE) || []).length }
}

function fleschScore(text) {
  const words = (text.match(WORD_RE) || [])
  const W = Math.max(1, words.length)
  const S = Math.max(1, (text.match(/[^.!?\n]+[.!?]*/g) || []).length)
  let SYL = 0
  for (const w of words) {
    const m = w.toLowerCase().match(/[aeiouy]+/g)
    SYL += Math.max(1, m ? m.length : 1)
  }
  return Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * (W / S) - 84.6 * (SYL / W))))
}

function machineReadability(text) {
  if (!text || text.length < 100) return 20
  let score = 100
  const wc = (text.match(WORD_RE) || []).length
  if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text)) score -= 15
  if (!/(\+\d{1,3}[- ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/.test(text)) score -= 15
  const sections = ["experience", "education", "skills", "summary", "objective", "projects"]
  const found = sections.filter(s => new RegExp(`\\b${s}\\b`, 'i').test(text)).length
  if (found < 3) score -= (3 - found) * 8
  if (wc < 250) score -= 10
  if (wc > 1000) score -= 10
  const fs = fleschScore(text)
  if (fs < 30) score -= 10; else if (fs < 50) score -= 5
  return Math.max(0, Math.min(100, Math.round(score)))
}

function guessKeywords(text) {
  const words = (text.toLowerCase().match(/[a-z][a-z0-9\-+.#\/]{2,}/g) || [])
  const freq = {}
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1 })
  return Object.entries(freq).filter(([, c]) => c >= 2).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([w]) => w)
}

export default function resume_analyzer() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [text, setText] = useState('')
  const [jd, setJd] = useState('')
  const [mode, setMode] = useState('standalone')
  const [result, setResult] = useState(null)
  const fileRef = useRef(null)

  const analyze = useCallback(() => {
    if (!text.trim()) return
    const c = counts(text)
    const readability = machineReadability(text)
    const keywords = guessKeywords(text)
    let matchScore = null
    if (mode === 'againstJD' && jd.trim()) {
      const jdKw = guessKeywords(jd)
      const found = jdKw.filter(k => text.toLowerCase().includes(k))
      matchScore = Math.round((found.length / Math.max(1, jdKw.length)) * 100)
    }
    setResult({ ...c, readability, keywords, matchScore, flesch: fleschScore(text) })
    jumpTo()
  }, [text, jd, mode, jumpTo])

  const handleFile = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    if (ext === 'txt' || ext === 'md') {
      setText(await file.text())
    } else if (ext === 'pdf') {
      try {
        // Dynamic load pdf.js
        if (!window.pdfjsLib) {
          const s = document.createElement('script')
          s.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/legacy/build/pdf.min.js'
          document.head.appendChild(s)
          await new Promise(r => s.onload = r)
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/legacy/build/pdf.worker.min.js'
        }
        const buf = await file.arrayBuffer()
        const doc = await window.pdfjsLib.getDocument({ data: buf }).promise
        let extracted = ''
        for (let p = 1; p <= Math.min(doc.numPages, 10); p++) {
          const page = await doc.getPage(p)
          const content = await page.getTextContent()
          extracted += content.items.map(i => i.str || '').join(' ') + '\n'
        }
        setText(extracted.trim())
      } catch { alert('Could not parse PDF. Try pasting text instead.') }
    } else if (ext === 'docx') {
      try {
        if (!window.mammoth) {
          const s = document.createElement('script')
          s.src = 'https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js'
          document.head.appendChild(s)
          await new Promise(r => s.onload = r)
        }
        const buf = await file.arrayBuffer()
        const res = await window.mammoth.extractRawText({ arrayBuffer: buf })
        setText((res?.value || '').trim())
      } catch { alert('Could not parse DOCX.') }
    }
  }, [])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark] resize-none"

  return (
    <ToolLayout
      title="Resume Analyzer"
      desc="Analyze your resume for ATS readability, keyword density, and JD match. Supports PDF, DOCX, and plain text."
      icon="📄" iconBg="rgba(34,197,94,0.08)"
      category="career" slug="resume-analyzer"
      faq={[
        { q: 'What is ATS score?', a: 'ATS (Applicant Tracking System) score measures how well your resume can be parsed by automated screening software used by recruiters.' },
        { q: 'Does this upload my resume?', a: 'No. All analysis runs locally in your browser. No data is sent to any server.' },
      ]}
      howItWorks={[
        'Paste your resume text or upload a PDF/DOCX file.',
        'Optionally paste a job description for JD match scoring.',
        'Click Analyze to see readability, keyword, and ATS scores.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Resume Analyzer", "applicationCategory": "CareerApplication",
        "url": "https://www.uptools.in/resume-analyzer/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-2 justify-center">
          {[['standalone', '📋 Standalone'], ['againstJD', '🎯 Against Job Description']].map(([v, l]) => (
            <button key={v} onClick={() => setMode(v)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === v ? 'bg-emerald-500 text-white' : 'bg-white/[0.06] text-slate-400 border border-white/8'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* Resume Input */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-500">Resume Text</label>
            <div className="flex gap-2">
              <button onClick={() => fileRef.current?.click()}
                className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white/[0.06] text-slate-400 hover:text-white transition-all">
                📁 Upload PDF/DOCX
              </button>
              <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.md" className="hidden" onChange={handleFile} />
            </div>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste your resume text here..." rows={10} className={inputClass} />
          <div className="text-[10px] text-slate-600">{counts(text).words} words · {counts(text).chars} chars</div>
        </div>

        {/* JD Input */}
        {mode === 'againstJD' && (
          <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-3">
            <label className="text-xs font-semibold text-slate-500">Job Description (optional)</label>
            <textarea value={jd} onChange={e => setJd(e.target.value)}
              placeholder="Paste the job description..." rows={6} className={inputClass} />
          </div>
        )}

        {/* Analyze Button */}
        <button onClick={analyze} disabled={!text.trim()}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50">
          🔍 Analyze Resume
        </button>

        {/* Results */}
        {result ? (
          <div ref={resultRef} className="space-y-4" style={{ animation: 'slideUp 0.35s ease-out' }}>
            {/* KPIs */}
            <div className={`grid gap-3 ${result.matchScore != null ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>
              {[
                { label: 'Machine Readability', value: `${result.readability}/100`, color: result.readability >= 70 ? 'text-emerald-400' : result.readability >= 50 ? 'text-amber-400' : 'text-red-400' },
                { label: 'Readability (Flesch)', value: `${result.flesch}/100`, color: result.flesch >= 50 ? 'text-emerald-400' : 'text-amber-400' },
                { label: 'Word Count', value: result.words, color: 'text-blue-400' },
                ...(result.matchScore != null ? [{ label: 'JD Match', value: `${result.matchScore}%`, color: result.matchScore >= 70 ? 'text-emerald-400' : result.matchScore >= 40 ? 'text-amber-400' : 'text-red-400' }] : []),
              ].map(k => (
                <div key={k.label} className="p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-center">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{k.label}</div>
                  <div className={`text-2xl font-extrabold ${k.color}`}>{k.value}</div>
                </div>
              ))}
            </div>

            {/* Keywords */}
            {result.keywords.length > 0 && (
              <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
                <h3 className="text-sm font-bold text-white mb-3">🔑 Top Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((k, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold">{k}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
              <h3 className="text-sm font-bold text-white mb-3">💡 Tips</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                {result.readability < 70 && <li>• Add more section headers (Experience, Education, Skills) for better ATS parsing.</li>}
                {result.words < 300 && <li>• Your resume is short. Add more detail to your experience and projects.</li>}
                {result.words > 800 && <li>• Your resume is very long. Consider condensing to 1-2 pages.</li>}
                {result.flesch < 40 && <li>• Simplify your language — shorter sentences improve readability.</li>}
                {result.matchScore != null && result.matchScore < 50 && <li>• Add more keywords from the job description to improve match score.</li>}
              </ul>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📄</div>
            <p className="text-sm text-slate-600 font-medium">Paste your resume text and click Analyze</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
