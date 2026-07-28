import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function ImageToBase64() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const fileInputRef = useRef(null)
  const [imageUrl, setImageUrl] = useState('')
  const [base64, setBase64] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState('')
  const [imageType, setImageType] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')

  const handleFile = useCallback((file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    setError('')
    setFileName(file.name)
    setFileSize((file.size / 1024).toFixed(1) + ' KB')
    setImageType(file.type)

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target.result
      setBase64(result)
      setPreviewUrl(result)
      // Get dimensions
      const img = new Image()
      img.onload = () => {
        setDimensions(`${img.width} × ${img.height}`)
      }
      img.src = result
      setTimeout(() => jumpTo(), 50)
    }
    reader.readAsDataURL(file)
  }, [jumpTo])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  return (
    <ToolLayout
      title="Image to Base64"
      desc="Convert any image to a Base64 data URL — perfect for embedding images in HTML, CSS, or JSON."
      icon="🖼️" iconBg="rgba(99,102,241,0.08)"
      category="images" slug="image-to-base64"
      faq={[
        { q: 'What is Image to Base64?', a: 'A tool that converts image files (PNG, JPG, GIF, SVG, etc.) into Base64-encoded data URLs that can be embedded directly in code.' },
        { q: 'When should I use Base64?', a: 'Base64 is useful for embedding small images in HTML/CSS, reducing HTTP requests, or storing images in JSON databases.' },
        { q: 'Is there a file size limit?', a: 'The tool works entirely in your browser — no upload to any server. However, very large images may slow down the encoding process.' },
      ]}
      howItWorks={[
        'Click the upload area or drag-and-drop an image file.',
        'The image is instantly converted to a Base64 data URL (no server upload).',
        'View the preview, file details, and copy the Base64 string.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Image to Base64", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/image-to-base64/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Upload area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="bg-white/[0.06] border-2 border-dashed border-white/[0.12] rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-500/30 hover:bg-indigo-500/[0.03] transition-all duration-200"
        >
          <input ref={fileInputRef} type="file" accept="image/*"
            onChange={e => handleFile(e.target.files[0])}
            className="hidden" />
          <div className="text-4xl mb-3 opacity-40">🖼️</div>
          <p className="text-sm text-slate-300 font-semibold">Click to upload or drag & drop an image</p>
          <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, GIF, SVG, WebP, and more</p>
        </div>

        {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}

        {/* File info */}
        {fileName && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              ['File', fileName.split('.').pop()?.toUpperCase() || 'N/A', 'text-indigo-400'],
              ['Size', fileSize, 'text-emerald-400'],
              ['Type', imageType.replace('image/', '').toUpperCase(), 'text-amber-400'],
              ['Dimensions', dimensions || 'Loading...', 'text-cyan-400'],
            ].map(([label, val, color]) => (
              <div key={label} className="p-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-center">
                <div className={`text-sm font-extrabold ${color}`}>{val}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Output */}
        {base64 ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Result</h3>
            </div>

            {/* Preview */}
            <div className="bg-black/20 rounded-xl p-3 mb-4 text-center">
              <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
            </div>

            {/* Base64 text */}
            <label className="block text-xs font-bold text-slate-500 mb-1">Base64 Data URL</label>
            <textarea value={base64} readOnly rows={6}
              className="w-full bg-black/20 border border-white/[0.05] rounded-xl px-4 py-3 text-xs text-slate-400 font-mono resize-none focus:outline-none" />

            <div className="flex gap-3 mt-3">
              <button onClick={() => navigator.clipboard.writeText(base64)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                📋 Copy Data URL
              </button>
              <button onClick={() => navigator.clipboard.writeText(base64.replace(/^data:image\/\w+;base64,/, ''))}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                📋 Copy Raw Base64
              </button>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🖼️</div>
            <p className="text-sm text-slate-600 font-medium">Upload an image to get its Base64 representation</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
