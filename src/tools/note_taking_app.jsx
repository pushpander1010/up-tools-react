import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function note_taking_app() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [note, setNote] = useState(() => {
    try { return localStorage.getItem('uptools-note') || '' } catch { return '' }
  })
  const [saved, setSaved] = useState(false)

  const saveNote = useCallback(() => {
    try { localStorage.setItem('uptools-note', note) } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [note])

  const clearNote = useCallback(() => {
    if (window.confirm('Clear all notes?')) {
      setNote('')
      try { localStorage.removeItem('uptools-note') } catch {}
    }
  }, [])

  const exportNote = useCallback(() => {
    const blob = new Blob([note], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'note.txt'
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }, [note])

  const charCount = note.length
  const wordCount = note.trim() ? note.trim().split(/\s+/).length : 0

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Note Taking App"
      desc="Quick note-taking tool with auto-save to your browser. Save, clear, and export notes as text files."
      icon="📝" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="note-taking-app"
      faq={[
        { q: "Where are my notes saved?", a: "Notes are saved in your browser's localStorage, so they persist between sessions but are only on this device." },
        { q: "Can I export my notes?", a: "Yes, click Export to download your note as a .txt file." },
      ]}
      howItWorks={[
        "Type your notes in the text area below.",
        "Click Save to store notes in your browser.",
        "Export as a text file or clear when done.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Note Taking App", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/note-taking-app/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Your Note</label>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="Start typing your note here..."
            rows={12} className={inputClass + " resize-none"} />
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>{charCount} characters</span>
            <span>{wordCount} words</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={saveNote}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] ${
              saved ? 'bg-emerald-500 text-white' : 'bg-emerald-500 text-white hover:bg-emerald-400'
            }`}>
            {saved ? '✅ Saved!' : '💾 Save'}
          </button>
          <button onClick={exportNote}
            className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-400 transition-all active:scale-[0.98]">
            📥 Export
          </button>
          <button onClick={clearNote}
            className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-sm hover:bg-red-500/30 transition-all active:scale-[0.98]">
            🗑️ Clear
          </button>
        </div>

        <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
          <div className="text-4xl mb-3 opacity-20">📝</div>
          <p className="text-sm text-slate-600 font-medium">
            {note ? `${wordCount} words, ${charCount} characters` : 'Start typing to create a note'}
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
