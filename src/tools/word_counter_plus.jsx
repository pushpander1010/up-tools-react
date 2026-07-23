import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!word) return 0
  if (word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')
  const vowels = word.match(/[aeiouy]{1,2}/g)
  return vowels ? vowels.length : 1
}

function analyze(text) {
  if (!text.trim()) return null
  const words = text.trim().split(/\s+/).filter(w => w.length > 0)
  const wordCount = words.length
  const charCount = text.length
  const charNoSpaces = text.replace(/\s/g, '').length
  const sentences = text.trim().split(/[.!?]+/).filter(s => s.trim().length > 0)
  const sentenceCount = sentences.length
  const paragraphs = text.trim().split(/\n\s*\n/).filter(p => p.trim().length > 0)
  const paragraphCount = paragraphs.length || (text.trim() ? 1 : 0)
  const readingMinutes = Math.ceil(wordCount / 200)
  const readingTime = readingMinutes < 1 ? '< 1 min' : readingMinutes + ' min'
  const avgWordLength = wordCount > 0 ? (charNoSpaces / wordCount).toFixed(1) : '0'
  const avgSentenceLength = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : '0'

  let fleschScore = '--'
  let gradeLevel = '--'
  let readingAge = '--'
  let badgeClass = 'text-emerald-400'
  let labelText = 'Enter text to see readability score'

  if (wordCount > 0 && sentenceCount > 0) {
    const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0)
    const score = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (totalSyllables / wordCount)
    fleschScore = Math.max(0, Math.min(100, score)).toFixed(1)
    const grade = 0.39 * (wordCount / sentenceCount) + 11.8 * (totalSyllables / wordCount) - 15.59
    gradeLevel = Math.max(0, grade).toFixed(1)
    readingAge = Math.max(5, Math.round(grade + 5)) + ' years'

    if (Number(fleschScore) >= 70) {
      badgeClass = 'text-emerald-400'
      labelText = '✅ Easy to read — Most readers can understand this'
    } else if (Number(fleschScore) >= 50) {
      badgeClass = 'text-amber-400'
      labelText = '⚠️ Standard difficulty — Suitable for most readers'
    } else {
      badgeClass = 'text-red-400'
      labelText = '❌ Hard to read — Consider simplifying for wider audience'
    }
  }

  return { wordCount, charCount, charNoSpaces, sentenceCount, paragraphCount, readingTime, avgWordLength, avgSentenceLength, fleschScore, gradeLevel, readingAge, badgeClass, labelText }
}

export default function word_counter_plus() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  const stats = useMemo(() => analyze(text), [text])

  const handleCSV = useCallback(() => {
    if (!stats) return
    const rows = [
      ['Words', stats.wordCount], ['Characters', stats.charCount],
      ['Characters (no spaces)', stats.charNoSpaces], ['Sentences', stats.sentenceCount],
      ['Paragraphs', stats.paragraphCount], ['Reading Time', stats.readingTime],
      ['Avg Word Length', stats.avgWordLength], ['Avg Words/Sentence', stats.avgSentenceLength],
      ['Flesch Score', stats.fleschScore], ['Grade Level', stats.gradeLevel], ['Reading Age', stats.readingAge],
    ]
    const csv = '"Metric","Value"\n' + rows.map(([k, v]) => `"${k}","${v}"`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'word_count_stats.csv'
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
  }, [stats])

  const handleShare = useCallback(() => {
    if (!text) return
    const url = new URL(window.location.href)
    url.searchParams.set('text', text.substring(0, 500))
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    })
  }, [text])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Advanced Word Counter"
      desc="Count words, characters, sentences, paragraphs, and estimate reading time. Includes readability score and detailed text analysis."
      icon="📝" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="word-counter-plus"
      faq={[
        { q: 'How is reading time calculated?', a: 'Reading time is estimated at 200 words per minute. Formula: words ÷ 200 = minutes.' },
        { q: 'What is the Flesch Reading Ease score?', a: 'A 0–100 scale rating text readability. 60–70 is standard difficulty, suitable for most readers.' },
        { q: 'Does this tool store my text?', a: 'No. All analysis runs locally in your browser. Nothing is uploaded.' },
      ]}
      howItWorks={[
        'Type or paste your text into the input area.',
        'See real-time word count, character count, sentence count, and more.',
        'Review the readability score and reading time estimate.',
        'Download statistics as CSV or share a permalink.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Advanced Word Counter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/word-counter-plus/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Enter or Paste Your Text</label>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Start typing or paste your text here..."
            rows={8} className={`${inputClass} resize-none`} />
          <div className="flex gap-2 mt-3">
            <button onClick={() => setText('')}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">Clear</button>
            <button onClick={handleCSV}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">📥 CSV</button>
            <button onClick={handleShare}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'}`}>
              {copied ? '✅ Copied' : '🔗 Share'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Statistics</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
              {[
                ['Words', stats.wordCount], ['Characters', stats.charCount], ['No Spaces', stats.charNoSpaces],
              ].map(([label, val]) => (
                <div key={label} className="p-2.5 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                  <div className="text-lg font-extrabold text-white">{val.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">{label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
              {[
                ['Sentences', stats.sentenceCount], ['Paragraphs', stats.paragraphCount], ['Reading Time', stats.readingTime],
              ].map(([label, val]) => (
                <div key={label} className="p-2.5 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                  <div className="text-lg font-extrabold text-white">{val}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">{label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                <div className="text-lg font-extrabold text-white">{stats.avgWordLength}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Avg Word Length</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                <div className="text-lg font-extrabold text-white">{stats.avgSentenceLength}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Avg Words/Sentence</div>
              </div>
            </div>

            {/* Readability */}
            <div className="text-center pt-4 border-t border-white/[0.06]">
              <h4 className="text-sm font-bold text-slate-300 mb-2">Readability Score</h4>
              <div className={`text-4xl font-extrabold ${stats.badgeClass}`}>{stats.fleschScore}</div>
              <div className="text-xs text-slate-500 mt-1 mb-3">{stats.labelText}</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                  <div className="text-sm font-bold text-white">{stats.gradeLevel}</div>
                  <div className="text-[10px] text-slate-500">Grade Level</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                  <div className="text-sm font-bold text-white">{stats.readingAge}</div>
                  <div className="text-[10px] text-slate-500">Reading Age</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!stats && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📝</div>
            <p className="text-sm text-slate-600 font-medium">Enter text to see statistics</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
