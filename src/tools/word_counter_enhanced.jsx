import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function syllableCount(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '')
  const m = word.match(/[aeiouy]{1,2}/g)
  return m ? m.length : 1
}

function getReadingLevel(score) {
  if (score < 30) return 'Very Difficult'
  if (score < 50) return 'Difficult'
  if (score < 60) return 'Standard'
  if (score < 70) return 'Fairly Easy'
  if (score < 80) return 'Easy'
  return 'Very Easy'
}

export default function word_counter_enhanced() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    const trimmed = text.trim()
    const words = trimmed ? trimmed.split(/\s+/) : []
    const sentences = text.split(/[.!?]+/).filter(x => x.trim())
    const paragraphs = text.split(/\n\s*\n/).filter(x => x.trim())
    const avgWordLen = words.length ? (words.reduce((a, b) => a + b.length, 0) / words.length).toFixed(1) : 0
    const readTime = Math.ceil(words.length / 200)

    let readingLevel = { label: 'Enter text to see reading level.', score: 0 }
    if (words.length > 0 && sentences.length > 0) {
      const syllables = words.reduce((a, b) => a + syllableCount(b), 0)
      const score = 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllables / words.length)
      readingLevel = { label: getReadingLevel(score), score: score.toFixed(1) }
    }

    return {
      words: words.length.toLocaleString(),
      chars: text.length.toLocaleString(),
      sentences: sentences.length.toLocaleString(),
      paragraphs: paragraphs.length.toLocaleString(),
      readTime,
      avgWordLen,
      readingLevel,
    }
  }, [text])

  const [copied, setCopied] = useState(false)
  const copyStats = () => {
    const data = `Words: ${stats.words}\nCharacters: ${stats.chars}\nSentences: ${stats.sentences}\nParagraphs: ${stats.paragraphs}\nRead Time: ${stats.readTime} min\nAvg Word Length: ${stats.avgWordLen}\nReading Level: ${stats.readingLevel.label} (Score: ${stats.readingLevel.score})`
    navigator.clipboard.writeText(data)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const cards = [
    { label: 'Words', value: stats.words, color: '#6366f1' },
    { label: 'Characters', value: stats.chars, color: '#22c55e' },
    { label: 'Sentences', value: stats.sentences, color: '#f59e0b' },
    { label: 'Paragraphs', value: stats.paragraphs, color: '#ef4444' },
    { label: 'Min Read', value: stats.readTime, color: '#8b5cf6' },
    { label: 'Avg Word Len', value: stats.avgWordLen, color: '#06b6d4' },
  ]

  return (
    <ToolLayout
      title="Word Counter Enhanced"
      desc="Count words, characters, sentences, paragraphs, and reading time."
      icon="📊" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="word-counter-enhanced"
      faq={[
        { q: 'What is the Flesch Reading Ease score?', a: 'A score from 0-100 that estimates how easy a text is to read. Higher scores mean easier reading.' },
        { q: 'How is reading time calculated?', a: 'Based on an average reading speed of 200 words per minute.' },
        { q: 'Is my text stored?', a: 'No. Everything runs in your browser. Your text is never uploaded or stored.' },
      ]}
      howItWorks={[
        'Type or paste your text in the input area.',
        'Stats update instantly as you type.',
        'View word count, characters, sentences, and more.',
        'Reading level is calculated automatically.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Word Counter Enhanced", "applicationCategory": "UtilityApplication",
        "url": "https://www.uptools.in/word-counter-enhanced/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <textarea value={text} onChange={e => setText(e.target.value)}
            rows={10} placeholder="Paste or type your text here..."
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none" />
        </div>

        {/* Stats Grid */}
        <div ref={resultRef} className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {cards.map(c => (
            <div key={c.label} className="text-center p-4 bg-white/[0.06] border border-white/[0.08] rounded-xl">
              <div className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</div>
              <div className="text-[11px] text-slate-500 mt-1">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Reading Level */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Reading Level</h2>
            <button onClick={copyStats}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'}`}>
              {copied ? '✓ Copied' : '📋 Copy Stats'}
            </button>
          </div>
          {text.trim() ? (
            <div className="mt-2">
              <span className="text-lg font-bold text-white">{stats.readingLevel.label}</span>
              <span className="text-sm text-slate-500 ml-2">(Score: {stats.readingLevel.score})</span>
            </div>
          ) : (
            <p className="text-sm text-slate-500 mt-2">Enter text to see reading level.</p>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
