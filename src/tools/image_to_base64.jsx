import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function ImageToBase64() {
  const [currentDataUrl, setCurrentDataUrl] = useState('')
  const [format, setFormat] = useState('data-url')
  const [output, setOutput] = useState('')
  const [preview, setPreview] = useState('')
  const [sizeInfo, setSizeInfo] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = useCallback((file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      setCurrentDataUrl(dataUrl)
      showResult(dataUrl, format, file)
    }
    reader.readAsDataURL(file)
  }, [format])

  const showResult = useCallback((dataUrl, fmt, file) => {
    let out = ''
    if (fmt === 'data-url') out = dataUrl
    else if (fmt === 'base64') out = dataUrl.split(',')[1]
    else if (fmt === 'css') out = `background-image: url("${dataUrl}")`
    else if (fmt === 'html') out = `<img src="${dataUrl}" alt="..." />`
    setOutput(out)
    setPreview(dataUrl)

    const bytes = dataUrl.length
    const kb = (bytes / 1024).toFixed(1)
    const orig = file ? (file.size / 1024).toFixed(1) : '?'
    const pct = file ? Math.round((1 - bytes / 1024 / file.size) * 100) : '?'
    setSizeInfo(`Original: ${orig} KB → Base64: ${kb} KB (${pct}% overhead)`)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) handleFile(f)
  }, [handleFile])

  const reconvert = useCallback(() => {
    if (currentDataUrl) {
      const file = fileInputRef.current?.files?.[0]
      showResult(currentDataUrl, format, file)
    }
  }, [currentDataUrl, format, showResult])

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(output)
  }, [output])

  const clear = useCallback(() => {
    setCurrentDataUrl('')
    setOutput('')
    setPreview('')
    setSizeInfo('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  return (
    <ToolLayout
      title="Image to Base64"
      desc="Convert any image to a Base64 data URL. All processing done in your browser — nothing is uploaded."
      icon="🖼️" iconBg="rgba(99,102,241,0.08)"
      category="images" slug="image-to-base64"
    >
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          {/* Dropzone */}
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
              isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/[0.15] hover:border-white/[0.25]'
            }`}
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-5xl mb-2">📁</div>
            <p className="text-slate-400 text-sm">
              Drop an image here or <span className="text-indigo-400 underline">browse</span>
            </p>
            <p className="text-slate-400 text-xs mt-1">Supported: JPG, PNG, GIF, WebP, SVG, BMP, ICO</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleFile(e.target.files?.[0])}
            />
          </div>

          {/* Format selector */}
          <div className="mt-3">
            <label className="block text-sm text-slate-400 mb-1">Output Format</label>
            <select
              className="bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              value={format}
              onChange={e => { setFormat(e.target.value); reconvert() }}
            >
              <option value="data-url">Data URL (full)</option>
              <option value="base64">Base64 only</option>
              <option value="css">CSS background-image</option>
              <option value="html">HTML &lt;img&gt; src</option>
            </select>
          </div>

          {/* Output */}
          <textarea
            className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-xs text-slate-300 font-mono h-[120px] resize-y mt-3 focus:outline-none focus:border-indigo-500/50"
            readOnly
            value={output}
            placeholder="Base64 output will appear here..."
          />

          {/* Buttons */}
          <div className="flex gap-2 mt-2">
            <button onClick={copyOutput} className="text-xs px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition">📋 Copy</button>
            <button onClick={clear} className="text-xs px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition">🗑️ Clear</button>
          </div>

          {/* Preview */}
          {preview && (
            <img src={preview} alt="Preview" className="max-w-[200px] max-h-[200px] rounded-lg mt-3 shadow-lg" />
          )}

          {sizeInfo && <p className="text-xs text-slate-400 mt-2">{sizeInfo}</p>}
        </div>

        {/* About */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-2">About Base64</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Base64 encoding converts binary data (images) into ASCII text, making it safe to embed directly in HTML, CSS, or JavaScript. Useful for small icons, inline images, and data URIs — no separate HTTP request needed.
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
