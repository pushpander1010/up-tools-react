import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function pdf_merger() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const fileInputRef = useRef(null)
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState('')
  const [result, setResult] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const addFiles = useCallback((newFiles) => {
    const pdfFiles = newFiles.filter(f => f.type === 'application/pdf')
    setFiles(prev => [...prev, ...pdfFiles])
  }, [])

  const removeFile = useCallback((idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx))
  }, [])

  const clearAll = useCallback(() => {
    setFiles([])
    setResult(null)
    setStatus('')
  }, [])

  const mergePDFs = useCallback(async () => {
    if (files.length < 2) return
    setStatus('Merging PDFs...')
    try {
      const { PDFDocument } = await import('https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm')
      const mergedPdf = await PDFDocument.create()

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        pages.forEach(page => mergedPdf.addPage(page))
      }

      const mergedBytes = await mergedPdf.save()
      const blob = new Blob([mergedBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      setResult({ url, pageCount: mergedPdf.getPageCount(), fileCount: files.length })
      setStatus('Done!')
      jumpTo()
    } catch (e) {
      setStatus('Error: ' + e.message)
    }
  }, [files, jumpTo])

  const download = useCallback(() => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result.url
    a.download = 'merged.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }, [result])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(Array.from(e.dataTransfer.files))
  }, [addFiles])

  return (
    <ToolLayout
      title="PDF Merger"
      desc="Merge multiple PDF files into one document. Free, fast, and private - no upload needed."
      icon="📄" iconBg="rgba(239,68,68,0.08)"
      category="utility" slug="pdf-merger"
      faq={[
        { q: "Is my data private?", a: "Yes. All processing happens in your browser. Files are never uploaded to our servers." },
        { q: "How many files can I merge?", a: "You can merge as many PDFs as you want. The only limit is your device's memory." },
      ]}
      howItWorks={[
        "Drop PDF files onto the drop zone or click to select files.",
        "Drag to reorder files if needed (first file is on top).",
        "Click 'Merge PDFs' and download the combined file.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "PDF Merger", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/pdf-merger/",
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
            dragOver ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/8 bg-white/[0.03] hover:border-white/15'
          }`}>
          <div className="text-3xl mb-2 opacity-40">📄</div>
          <p className="text-white font-semibold text-sm">Drop PDF files here or click to select</p>
          <p className="text-slate-500 text-xs mt-1">Select multiple PDF files to merge them</p>
          <input ref={fileInputRef} type="file" accept=".pdf" multiple className="hidden"
            onChange={e => addFiles(Array.from(e.target.files))} />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-4 rounded-xl bg-white/[0.06] border border-white/8">
                <span className="text-white text-sm font-medium truncate">{f.name}</span>
                <span className="flex items-center gap-3">
                  <span className="text-slate-500 text-xs">{(f.size / 1024).toFixed(1)} KB</span>
                  <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-300 text-sm">✕</button>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => { mergePDFs(); }} disabled={files.length < 2}
            className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-[0.98] ${
              files.length < 2
                ? 'bg-white/[0.06] text-slate-600 cursor-not-allowed'
                : 'bg-indigo-500 text-white hover:bg-indigo-400'
            }`}>
            🔗 Merge {files.length} PDFs
          </button>
          <button onClick={clearAll}
            className="px-6 py-4 rounded-2xl bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white font-bold text-sm transition-all">
            Clear
          </button>
        </div>

        {/* Status */}
        {status && (
          <p className="text-sm text-center text-slate-400">{status}</p>
        )}

        {/* Result */}
        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Merged PDF</h3>
            </div>
            <div className="text-white text-sm mb-4">
              ✅ Successfully merged {result.fileCount} PDFs — {result.pageCount} total pages
            </div>
            <button onClick={download}
              className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all">
              ⬇️ Download Merged PDF
            </button>
          </div>
        )}

        {!result && files.length === 0 && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📄</div>
            <p className="text-sm text-slate-600 font-medium">Drop PDF files to get started</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
