import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!word) return 0
  if (word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')
  const m = word.match(/[aeiouy]{1,2}/g)
  return m ? Math.max(m.length, 1) : 1
}

export default function TextStatistics() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const stats = useMemo(() => {
    const text = input
    if (!text || !text.trim()) return null

    const len = text.length
    const charsWithSpaces = len
    const charsNoSpaces = text.replace(/\s/g, '').length

    const wordsRaw = text.trim().split(/\s+/).filter(w => w.length > 0)
    const wordCount = wordsRaw.length
    const wordsClean = text.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/).filter(w => w.length > 0)

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const sentenceCount = sentences.length

    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    const paragraphCount = Math.max(paragraphs.length, text.trim() ? 1 : 0)

    const lines = text.split('\n')
    const lineCount = lines.length

    let totalSyllables = 0
    wordsRaw.forEach(w => { totalSyllables += countSyllables(w) })

    const readingMinutes = Math.ceil(wordCount / 200)
    const speakingMinutes = Math.ceil(wordCount / 150)

    const avgWordLength = wordCount > 0 ? (charsNoSpaces / wordCount).toFixed(1) : '0'

    let longestWord = ''
    let shortestWord = ''
    if (wordsClean.length > 0) {
      longestWord = wordsClean.reduce((a, b) => a.length >= b.length ? a : b)
      shortestWord = wordsClean.reduce((a, b) => a.length <= b.length ? a : b)
    }

    let fkGrade = '—'
    if (sentenceCount > 0 && wordCount > 0) {
      const syllableCount = wordsRaw.reduce((s, w) => s + countSyllables(w), 0)
      fkGrade = (0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59).toFixed(1)
    }

    const overview = [
      { val: wordCount, label: 'Words', color: 'text-indigo-400' },
      { val: charsWithSpaces, label: 'Characters (with spaces)', color: 'text-emerald-400' },
      { val: charsNoSpaces, label: 'Characters (no spaces)', color: 'text-amber-400' },
      { val: sentenceCount, label: 'Sentences', color: 'text-cyan-400' },
      { val: paragraphCount, label: 'Paragraphs', color: 'text-purple-400' },
      { val: lineCount, label: 'Lines', color: 'text-pink-400' },
      { val: totalSyllables, label: 'Syllables', color: 'text-orange-400' },
      { val: readingMinutes < 1 ? '<1 min' : readingMinutes + ' min', label: 'Reading Time (200 wpm)', color: 'text-indigo-400' },
      { val: speakingMinutes < 1 ? '<1 min' : speakingMinutes + ' min', label: 'Speaking Time (150 wpm)', color: 'text-emerald-400' },
    ]

    const details = [
      ['Avg Word Length', avgWordLength + ' chars'],
      ['Longest Word', longestWord || '—'],
      ['Shortest Word', shortestWord || '—'],
      ['Flesch-Kincaid Grade', fkGrade],
      ['Avg Syllables/Word', wordCount > 0 ? (totalSyllables / wordCount).toFixed(1) : '—'],
      ['Avg Sentence Length', sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) + ' words' : '—'],
    ]

    const freqMap = {}
    wordsClean.forEach(w => {
      const lower = w.toLowerCase()
      freqMap[lower] = (freqMap[lower] || 0) + 1
    })
    const sorted = Object.entries(freqMap).sort((a, b) => b[1] - a[1]).slice(0, 10)
    const maxFreq = sorted.length > 0 ? sorted[0][1] : 1

    return { overview, details, topWords: sorted, maxFreq }
  }, [input])

  const handleCopy = () => {
    if (!stats) return
    let text = 'Text Statistics\n' + '='.repeat(40) + '\n'
    stats.overview.forEach(s => { text += `${s.label}: ${s.val}\n` })
    text += '\nDetailed Breakdown\n' + '-'.repeat(40) + '\n'
    stats.details.forEach(d => { text += `${d[0]}: ${d[1]}\n` })
    if (stats.topWords.length > 0) {
      text += '\nTop Words\n' + '-'.repeat(40) + '\n'
      stats.topWords.forEach(([word, count], i) => { text += `${i + 1}. "${word}" (${count})\n` })
    }
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const handleClear = () => {
    setInput('')
  }

  return (
    <ToolLayout
      title="Text Statistics"
      desc="Advanced text statistics: characters, words, sentences, syllables, reading time, speaking time, and word frequency analysis."
      icon="📊" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="text-statistics"
      faq={[
        { q: 'What is Text Statistics?', a: 'An advanced text analysis tool that counts characters, words, sentences, syllables, paragraphs, and lines. It also calculates reading/speaking time, Flesch-Kincaid grade level, and shows word frequency.' },
        { q: 'How to use it?', a: 'Paste or type your text and see comprehensive statistics update in real time.' },
      ]}
      howItWorks={[
        'Paste or type your text in the input area.',
        'View overview stats, detailed breakdown, and top word frequency instantly.',
        'Copy the full stats report if needed.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Text Statistics", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/text-statistics/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Enter Your Text</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Paste or type your text here to analyze..."
            rows={8}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-semibold text-sm outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark] resize-y" />
          <div className="flex gap-2 mt-3">
            <button onClick={handleCopy}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-slate-300 transition-all">
              {copied ? '✅ Copied!' : '📋 Copy Stats'}
            </button>
            <button onClick={handleClear}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-slate-300 transition-all">
              🗑️ Clear
            </button>
          </div>
        </div>

        {stats ? (
          <>
            {/* Overview Stats Grid */}
            <div className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
              style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Overview</h3>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {stats.overview.map(s => (
                  <div key={s.label} className="p-2.5 sm:p-3 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                    <div className={`text-xl sm:text-2xl font-extrabold ${s.color}`}>{s.val}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">Detailed Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {stats.details.map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center px-4 py-2.5 rounded-xl bg-black/20 border border-white/[0.05]">
                    <span className="text-sm text-slate-400">{key}</span>
                    <span className="text-sm text-white font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Words Frequency */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">Top 10 Most Frequent Words</h3>
              <div className="flex flex-wrap gap-2">
                {stats.topWords.map(([word, count]) => {
                  const pct = Math.round((count / stats.maxFreq) * 100)
                  return (
                    <div key={word} className="flex-1 min-w-[200px] p-3 rounded-xl bg-black/20 border border-white/[0.05]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-white font-semibold">{word}</span>
                        <span className="text-sm text-indigo-400 font-bold">{count}</span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-400 transition-all duration-300" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📊</div>
            <p className="text-sm text-slate-600 font-medium">Enter text to see statistics</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
