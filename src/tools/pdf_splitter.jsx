import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function pdf_splitter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [pageCount, setPageCount] = useState(0)
  const [mode, setMode] = useState('range')
  const [range, setRange] = useState('')
  const [status, setStatus] = useState('')
  const [results, setResults] = useState([])
  const [dragOver, setDragOver] = useState(false)

  const loadFile = useCallback(async (f) => {
    if (!f || f.type !== 'application/pdf') return
    setFile(f)
    setStatus('Loading PDF...')
    try {
      const { PDFDocument } = await import('https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm')
      const buf = await f.arrayBuffer()
      const doc = await PDFDocument.load(buf)
      const count = doc.getPageCount()
      setPageCount(count)
      setRange('1-' + count)
      setStatus(f.name + ' — ' + count + ' pages')
    } catch (e) {
      setStatus('Error loading PDF: ' + e.message)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const f = Array.from(e.dataTransfer.files).find(x => x.type === 'application/pdf')
    if (f) loadFile(f)
  }, [loadFile])

  const parseRange = useCallback((str, max) => {
    const pages = []
    str.split(',').forEach(part => {
      const [a, b] = part.split('-').map(Number)
      if (b) { for (let i = a - 1; i < Math.min(b, max); i++) pages.push(i) }
      else if (a && a <= max) pages.push(a - 1)
    })
    return pages
  }, [])

  const splitPDF = useCallback(async () => {
    if (!file) return
    setStatus('Splitting PDF...')
    try {
      const { PDFDocument } = await import('https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm')
      const buf = await file.arrayBuffer()
      const doc = await PDFDocument.load(buf)

      let pageGroups = []
      if (mode === 'range' && range) {
        const indices = parseRange(range, doc.getPageCount())
        pageGroups = [indices]
      } else if (mode === 'every') {
        const n = parseInt(range) || 1
        for (let i = 0; i < doc.getPageCount(); i += n) {
          const group = []
          for (let j = i; j < Math.min(i + n, doc.getPageCount()); j++) group.push(j)
          pageGroups.push(group)
        }
      } else {
        for (let i = 0; i < doc.getPageCount(); i++) pageGroups.push([i])
      }

      const downloads = []
      for (let i = 0; i < pageGroups.length; i++) {
        const newPdf = await PDFDocument.create()
        const copied = await newPdf.copyPages(doc, pageGroups[i])
        copied.forEach(p => newPdf.addPage(p))
        const bytes = await newPdf.save()
        const blob = new Blob([bytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        downloads.push({ url, pages: newPdf.getPageCount(), part: i + 1 })
      }

      setResults(downloads)
      setStatus('Done! ' + downloads.length + ' file(s) created.')
      jumpTo()
    } catch (e) {
      setStatus('Error: ' + e.message)
    }
  }, [file, mode, range, parseRange, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="PDF Splitter"
      desc="Split PDF files by page range, extract pages, or create separate documents. Free and private."
      icon="✂️" iconBg="rgba(6,182,212,0.08)"
      category="utility" slug="pdf-splitter"
      faq={[
        { q: "Is my data private?", a: "Yes. All processing happens in your browser. Files are never uploaded to our servers." },
        { q: "Can I split by page range?", a: "Yes! You can use ranges like '1-5, 8, 10-12' to extract specific pages." },
      ]}
      howItWorks={[
        "Drop a PDF file or click to select one.",
        "Choose a split mode: by range, every N pages, or individual pages.",
        "Click 'Split PDF' and download the resulting files.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "PDF Splitter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/pdf-splitter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Drop zone */}
        <div onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
            dragOver ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-white/8 bg-white/[0.03] hover:border-white/15'
          }`}>
          <div className="text-3xl mb-2 opacity-40">📄</div>
          <p className="text-white font-semibold text-sm">Drop PDF file here or click to select</p>
          {status && <p className="text-slate-400 text-xs mt-2">{status}</p>}
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
            onChange={e => { if (e.target.files[0]) loadFile(e.target.files[0]) }} />
        </div>

        {/* Split mode */}
        <div className="grid grid-cols-3 gap-2">
          {[['range', 'Split by Range', 'e.g., 1-5, 8, 10-12'],
            ['every', 'Split Every N', 'Create separate files'],
            ['single', 'Single Pages', 'Download individually']
          ].map(([m, title, desc]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`p-3 rounded-xl text-left transition-all border-2 ${
                mode === m
                  ? 'bg-cyan-500/10 border-cyan-500/30'
                  : 'bg-white/[0.04] border-white/8 hover:border-white/12'
              }`}>
              <div className={`text-xs font-bold ${mode === m ? 'text-cyan-400' : 'text-white'}`}>{title}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{desc}</div>
            </button>
          ))}
        </div>

        {/* Range input */}
        {mode !== 'single' && (
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {mode === 'every' ? 'Split every N pages' : 'Page Range'}
            </label>
            <input type="text" value={range} onChange={e => setRange(e.target.value)}
              placeholder={mode === 'every' ? 'e.g., 5' : `e.g., 1-${pageCount || 10}`}
              className={inputClass} />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={splitPDF} disabled={!file}
            className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-[0.98] ${
              !file
                ? 'bg-white/[0.06] text-slate-600 cursor-not-allowed'
                : 'bg-cyan-500 text-white hover:bg-cyan-400'
            }`}>
            ✂️ Split PDF
          </button>
          <button onClick={() => { setFile(null); setPageCount(0); setResults([]); setStatus(''); setRange('') }}
            className="px-6 py-4 rounded-2xl bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white font-bold text-sm transition-all">
            Clear
          </button>
        </div>

        {/* Status */}
        {status && !results.length && (
          <p className="text-sm text-center text-slate-400">{status}</p>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div ref={resultRef} className="rounded-3xl border-2 border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Download Split PDFs</h3>
            </div>
            <div className="space-y-2">
              {results.map((r, i) => (
                <a key={i} href={r.url} download={`split-${r.part}.pdf`}
                  className="block py-3 px-4 rounded-xl bg-white/[0.06] border border-white/8 text-white text-sm font-medium hover:border-cyan-500/30 transition-all">
                  ⬇️ Part {r.part} ({r.pages} pages)
                </a>
              ))}
            </div>
          </div>
        )}

        {!file && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">✂️</div>
            <p className="text-sm text-slate-600 font-medium">Drop a PDF file to get started</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
