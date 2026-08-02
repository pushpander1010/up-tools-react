import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const EMOJI_REG = /\p{Emoji}/gu

function parseChat(text) {
  const lines = text.split('\n').filter(Boolean)
  const messages = []
  let current = null
  // Try Android format first: "1/15/23, 10:30 AM - Name: Message"
  // Then iOS format: "[15/01/2023, 10:30:00] Name: Message"
  for (const line of lines) {
    let m = line.match(/^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{2}(?::\d{2})?\s*[AP]M)\s*-\s*([^:]+):\s*(.*)/)
    if (!m) m = line.match(/^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([^:]+):\s*(.*)/)
    if (m) {
      if (current) messages.push(current)
      current = { date: m[1], time: m[2], sender: m[3].trim(), text: m[4].trim() }
    } else if (current) {
      current.text += '\n' + line
    }
  }
  if (current) messages.push(current)
  // Filter out system messages
  return messages.filter(m => m.sender && !m.text.startsWith('Messages and calls are end-to-end encrypted'))
}

function countEmojis(text) {
  return [...text.matchAll(EMOJI_REG)].map(m => m[0])
}

export default function whatsapp_chat_analyzer() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [chatText, setChatText] = useState('')
  const [fileName, setFileName] = useState('')

  const stats = useMemo(() => {
    if (!chatText.trim()) return null
    const msgs = parseChat(chatText)
    if (msgs.length === 0) return { error: 'Could not parse any messages. Make sure you exported the chat correctly (without media).' }

    const senders = {}
    const dayCount = {}
    const hourCount = Array(24).fill(0)
    const allWords = []
    const allEmojis = []
    let mediaCount = 0
    let totalWords = 0

    for (const m of msgs) {
      senders[m.sender] = (senders[m.sender] || 0) + 1
      const words = m.text.split(/\s+/).filter(w => w.length > 0)
      totalWords += words.length
      allWords.push(...words.map(w => w.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()).filter(w => w.length > 2))
      
      const emojis = countEmojis(m.text)
      allEmojis.push(...emojis)

      if (/<Media omitted>|<image omitted>|image omitted|video omitted/i.test(m.text)) mediaCount++

      let h = parseInt(m.time.split(':')[0])
      if (m.time.includes('PM') && h !== 12) h += 12
      if (m.time.includes('AM') && h === 12) h = 0
      if (!isNaN(h) && h >= 0 && h < 24) hourCount[h]++

      const dayKey = m.date
      dayCount[dayKey] = (dayCount[dayKey] || 0) + 1
    }

    // Word frequency
    const wordFreq = {}
    allWords.forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1 })
    const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 20)

    // Emoji frequency
    const emojiFreq = {}
    allEmojis.forEach(e => { emojiFreq[e] = (emojiFreq[e] || 0) + 1 })
    const topEmojis = Object.entries(emojiFreq).sort((a, b) => b[1] - a[1]).slice(0, 15)

    // Top senders
    const topSenders = Object.entries(senders).sort((a, b) => b[1] - a[1])

    return { msgs, senders: topSenders, totalMsgs: msgs.length, totalWords, mediaCount, dayCount, hourCount, topWords, topEmojis, allEmojis }
  }, [chatText])

  const handleFile = (file) => {
    if (!file) return
    setFileName(file.name)
    const r = new FileReader()
    r.onload = (e) => setChatText(e.target.result)
    r.readAsText(file)
  }

  return (
    <ToolLayout
      title="WhatsApp Chat Analyzer"
      desc="Upload your exported WhatsApp chat to get insights: message stats, top senders, word frequency, emoji usage, and activity patterns. All client-side, nothing uploaded."
      icon="💬" iconBg="rgba(37,211,102,0.12)"
      category="whatsapp" slug="whatsapp-chat-analyzer"
      faq={[
        { q: 'How to export my WhatsApp chat?', a: 'Open a chat → ⋮ (menu) → More → Export chat → Without media. Save the .txt file and upload it here.' },
        { q: 'Is my chat data private?', a: 'Yes. Everything runs in your browser. The file is never sent to any server.' },
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Chat Analyzer", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-chat-analyzer/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6" ref={resultRef}>
        {/* Upload */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Upload WhatsApp Chat Export</label>
          <div className="border-2 border-dashed border-white/[0.12] rounded-xl p-8 text-center cursor-pointer hover:border-green-500/40 transition-colors"
            onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
            onClick={() => document.getElementById('chatFile').click()}>
            <div className="text-4xl mb-2">📁</div>
            <p className="text-slate-400 text-sm">Drop your chat .txt file here or click to browse</p>
            <p className="text-slate-400 text-xs mt-1">Export: Chat ⋮ → More → Export chat → Without media</p>
          </div>
          <input id="chatFile" type="file" accept=".txt" className="hidden" onChange={e => handleFile(e.target.files[0])} />
          {fileName && <p className="text-xs text-green-400 mt-2">✓ {fileName} loaded</p>}
        </div>

        {stats?.error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-center text-red-400 text-sm">{stats.error}</div>
        )}

        {stats && !stats.error && (
          <>
            {/* Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Messages', value: stats.totalMsgs.toLocaleString(), color: '#22c55e' },
                { label: 'Total Words', value: stats.totalWords.toLocaleString(), color: '#6366f1' },
                { label: 'Unique Senders', value: stats.senders.length, color: '#f59e0b' },
                { label: 'Media Shared', value: stats.mediaCount, color: '#ec4899' },
              ].map(s => (
                <div key={s.label} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Top Senders */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Top Senders</h3>
              <div className="space-y-2">
                {stats.senders.slice(0, 10).map(([name, count], i) => (
                  <div key={name} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-5">{i + 1}.</span>
                    <span className="text-sm text-white flex-1 truncate">{name}</span>
                    <div className="h-4 bg-indigo-500/30 rounded-full" style={{ width: `${(count / stats.senders[0][1]) * 100}%`, maxWidth: '120px' }} />
                    <span className="text-xs text-slate-400 w-16 text-right">{((count / stats.totalMsgs) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hourly Activity */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Messages by Hour</h3>
              <div className="flex items-end gap-1 h-24">
                {stats.hourCount.map((c, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-indigo-500/40 rounded-t" style={{ height: `${Math.max(2, (c / Math.max(...stats.hourCount)) * 80)}px` }} title={`${i}:00 - ${c} msgs`} />
                    <span className="text-[9px] text-slate-400">{i}h</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Words */}
            {stats.topWords.length > 0 && (
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Top Words</h3>
                <div className="flex flex-wrap gap-2">
                  {stats.topWords.map(([word, count]) => (
                    <span key={word} className="px-3 py-1 rounded-full text-xs bg-white/[0.06] border border-white/[0.08] text-slate-300">
                      {word} <span className="text-slate-400">×{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Top Emojis */}
            {stats.topEmojis.length > 0 && (
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Top Emojis <span className="text-xs text-slate-400">({stats.allEmojis.length} total used)</span></h3>
                <div className="flex flex-wrap gap-3 text-2xl">
                  {stats.topEmojis.map(([emoji, count]) => (
                    <span key={emoji} className="flex flex-col items-center gap-1" title={`${emoji} ×${count}`}>
                      <span>{emoji}</span>
                      <span className="text-xs text-slate-400">{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  )
}
