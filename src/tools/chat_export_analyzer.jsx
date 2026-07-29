import { useState, useMemo, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

// WhatsApp export format: "DD/MM/YYYY, HH:MM - Sender: Message"
const WA_REGEX = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)\s*[-–]\s*(.+?):\s(.+)$/

function parseChat(text) {
  const lines = text.split('\n')
  const messages = []
  let current = null

  for (const line of lines) {
    const match = line.match(WA_REGEX)
    if (match) {
      if (current) messages.push(current)
      current = {
        date: match[1], time: match[2],
        sender: match[3].trim(),
        text: match[4].trim(),
        isMedia: /<Media omitted|image omitted|video omitted|audio omitted|document omitted|sticker omitted/i.test(match[4]),
        isDeleted: match[4] === 'This message was deleted',
      }
    } else if (current) {
      current.text += '\n' + line
    }
  }
  if (current) messages.push(current)
  return messages
}

function analyze(messages) {
  if (messages.length === 0) return null

  const senders = {}
  const hourBuckets = Array(24).fill(0)
  const dayBuckets = Array(7).fill(0)
  const emojis = {}
  let mediaCount = 0
  let deletedCount = 0
  let totalChars = 0
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu

  for (const m of messages) {
    senders[m.sender] = (senders[m.sender] || 0) + 1
    if (m.isMedia) mediaCount++
    if (m.isDeleted) deletedCount++
    totalChars += m.text.length

    const emojisInMsg = m.text.match(emojiRegex) || []
    emojisInMsg.forEach(e => { emojis[e] = (emojis[e] || 0) + 1 })

    try {
      const parts = m.date.split('/')
      const day = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
      dayBuckets[day.getDay()]++
    } catch {}

    const timeMatch = m.time.match(/(\d{1,2}):(\d{2})/)
    if (timeMatch) {
      let h = parseInt(timeMatch[1])
      if (m.time.toLowerCase().includes('pm') && h < 12) h += 12
      if (m.time.toLowerCase().includes('am') && h === 12) h = 0
      hourBuckets[h]++
    }
  }

  const topSenders = Object.entries(senders).sort((a, b) => b[1] - a[1])
  const topEmojis = Object.entries(emojis).sort((a, b) => b[1] - a[1]).slice(0, 10)
  const peakHour = hourBuckets.indexOf(Math.max(...hourBuckets))
  const peakDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayBuckets.indexOf(Math.max(...dayBuckets))]
  const avgMsgLen = Math.round(totalChars / messages.length)

  return {
    totalMessages: messages.length,
    senders: topSenders,
    peakHour, peakDay,
    topEmojis,
    mediaCount, deletedCount,
    avgMsgLen,
    hourBuckets, dayBuckets,
  }
}

export default function chat_export_analyzer() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [rawText, setRawText] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const handleFile = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result
      if (typeof text === 'string') { setRawText(text); setError('') }
    }
    reader.readAsText(file)
  }, [])

  const analyzeChat = useCallback(() => {
    if (!rawText.trim()) { setError('Please paste a chat or upload a .txt file.'); return }
    const msgs = parseChat(rawText)
    if (msgs.length === 0) { setError('No messages found. Make sure this is a WhatsApp exported chat (txt file).'); return }
    setError('')
    setResult(analyze(msgs))
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [rawText])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500"

  return (
    <ToolLayout
      title="WhatsApp Chat Export Analyzer"
      desc="Paste or upload your exported WhatsApp chat (.txt) to see stats: messages per person, peak hours, emoji usage & more."
      icon="📊" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="chat-export-analyzer"
      faq={[
        { q: "How do I export a WhatsApp chat?", a: "Open the chat → Tap ⋮ (three dots) → More → Export chat → Choose 'Without media'. This saves a .txt file." },
        { q: "Is my chat data uploaded?", a: "No. Everything runs entirely in your browser. Your chat data never leaves your device." },
        { q: "What format does it support?", a: "Standard WhatsApp exported .txt files (DD/MM/YYYY, HH:MM - Sender: Message format)." },
      ]}
      howItWorks={[
        "Export a WhatsApp chat as .txt (without media).",
        "Upload the file or paste the text content.",
        "See instant stats: top senders, peak hours, emoji usage & more.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Chat Export Analyzer", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/chat-export-analyzer/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Upload .txt Chat File</label>
          <input ref={fileRef} type="file" accept=".txt,.csv" onChange={handleFile}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-500 file:text-white hover:file:bg-indigo-400 file:cursor-pointer" />
        </div>

        <div className="text-center text-xs text-slate-600">— or paste chat text —</div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Chat Text</label>
          <textarea value={rawText} onChange={e => { setRawText(e.target.value); setError('') }}
            placeholder={"12/07/2026, 10:30 - Alice: Hey!\n12/07/2026, 10:31 - Bob: Hi there!\n..."}
            rows={6} className={inputClass + " resize-vertical font-mono text-xs"} />
        </div>

        {error && <div className="rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm font-semibold px-4 py-2.5 text-center">{error}</div>}

        <button onClick={analyzeChat}
          className="w-full py-3.5 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98]">
          📊 Analyze Chat
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 space-y-6">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-white mb-1">{result.totalMessages.toLocaleString()}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Messages</div>
            </div>

            {/* Top Senders */}
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/6">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">👤 Top Senders</div>
              {result.senders.slice(0, 5).map(([name, count], i) => {
                const pct = Math.round((count / result.totalMessages) * 100)
                return (
                  <div key={i} className="flex items-center gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-white">{name}</span>
                        <span className="text-xs text-slate-400">{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Peak Hour', value: `${result.peakHour}:00` },
                { label: 'Peak Day', value: result.peakDay },
                { label: 'Media Shared', value: result.mediaCount },
                { label: 'Avg Msg Length', value: `${result.avgMsgLen} chars` },
              ].map((s, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.04] border border-white/6 text-center">
                  <div className="text-lg font-bold text-white">{s.value}</div>
                  <div className="text-[10px] text-slate-500 uppercase">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Hourly Activity */}
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/6">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">⏰ Activity by Hour</div>
              <div className="flex items-end gap-0.5 h-20">
                {result.hourBuckets.map((count, h) => {
                  const max = Math.max(...result.hourBuckets)
                  const hPct = max > 0 ? (count / max) * 100 : 0
                  return (
                    <div key={h} className="flex-1 flex flex-col items-center">
                      <div className="w-full rounded-t bg-indigo-500/70 transition-all" style={{ height: `${hPct}%`, minHeight: count > 0 ? 2 : 0 }} />
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between text-[9px] text-slate-600 mt-1">
                <span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>23h</span>
              </div>
            </div>

            {/* Top Emojis */}
            {result.topEmojis.length > 0 && (
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/6">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">😀 Top Emojis</div>
                <div className="flex flex-wrap gap-2">
                  {result.topEmojis.map(([emoji, count], i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/8">
                      <span className="text-lg">{emoji}</span>
                      <span className="text-xs font-semibold text-slate-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
