import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function ImageToBase64() {
  const [currentDataUrl, setCurrentDataUrl] = useState("")
  const [format, setFormat] = useState('data-url')
  const [output, setOutput] = useState("")
  const [preview, setPreview] = useState("")
  const [sizeInfo, setSizeInfo] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const [currentFile, setCurrentFile] = useState(null)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const computeOutput = useCallback((dataUrl, fmt) => {
    if (!dataUrl) return ""
    if (fmt === 'data-url') return dataUrl
    if (fmt === 'base64') return dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
    if (fmt === 'css') return `background-image: url("${dataUrl}");`
    if (fmt === 'html') return `<img src="${dataUrl}" alt="Embedded Image" />`
    if (fmt === 'json') return JSON.stringify({ dataUrl }, null, 2)
    return dataUrl
  }, [])

  const updateResult = useCallback((dataUrl, fmt, file) => {
    const out = computeOutput(dataUrl, fmt)
    setOutput(out)
    setPreview(dataUrl)

    if (file && file.size > 0) {
      const origKb = (file.size / 1024).toFixed(1)
      const b64Bytes = dataUrl.length
      const b64Kb = (b64Bytes / 1024).toFixed(1)
      const overheadPct = Math.round(((b64Bytes - file.size) / file.size) * 100)
      setSizeInfo(`Original: ${origKb} KB → Base64: ${b64Kb} KB (+${overheadPct}% encoding overhead)`)
    } else {
      const b64Kb = (dataUrl.length / 1024).toFixed(1)
      setSizeInfo(`Base64 payload: ${b64Kb} KB`)
    }
  }, [computeOutput])

  const handleFile = useCallback((file) => {
    if (!file) return
    if (!file.type.startsWith('image/') && !file.name.endsWith('.ico')) {
      setError("Please select a valid image file.")
      return
    }
    setError("")
    setCurrentFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      setCurrentDataUrl(dataUrl)
      updateResult(dataUrl, format, file)
    }
    reader.onerror = () => {
      setError("Failed to read image file.")
    }
    reader.readAsDataURL(file)
  }, [format, updateResult])

  const handleFormatChange = (newFormat) => {
    setFormat(newFormat)
    if (currentDataUrl) {
      updateResult(currentDataUrl, newFormat, currentFile)
    }
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }, [handleFile])

  const copyOutput = useCallback(async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError("Clipboard write failed. Please select text manually.")
    }
  }, [output])

  const downloadText = useCallback(() => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = (currentFile?.name?.replace(/\.[^.]+$/, '') || 'image') + '-base64.txt'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [output, currentFile])

  const clear = useCallback(() => {
    setCurrentDataUrl("")
    setOutput("")
    setPreview("")
    setSizeInfo("")
    setCurrentFile(null)
    setError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [])

  return (
    <ToolLayout
      title="Image to Base64"
      desc="Image to Base64 - convert any image to a Base64 data URL. All processing done in your browser —, online free. Free online, no sign-up. Works on any device."
      icon="🖼️" iconBg="rgba(99,102,241,0.08)"
      category="images" slug="image-to-base64"
      faq={[
        { q: "How do I convert an image to Base64 online free?", a: "Drop an image above or browse to upload, then copy the Base64 code. Free, runs in your browser." },
        { q: "Is my image uploaded?", a: "No. Everything runs in your browser. Nothing is uploaded or stored." },
        { q: "Is this converter free?", a: "Yes, completely free with no sign-up. Convert unlimited images on any device." },
        { q: "Do I need to sign up?", a: "No sign-up needed. Convert unlimited images free on any device." },
        { q: "Does it work on mobile?", a: "Yes. Convert images free in your phone browser, no app needed." },
        { q: "Which formats are supported?", a: "JPG, PNG, GIF, WebP, SVG, BMP, and ICO, free with no sign-up." },
      ]}
      howItWorks={[
        "Drop an image above or browse to upload.",
        "Get the Base64 code instantly.",
        "Copy it for use in HTML or CSS.",
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          {/* Dropzone */}
          <div
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-4xl mb-2">📁</div>
            <p className="text-gray-900 text-sm font-semibold">
              Drop an image here or <span className="text-indigo-600 underline">browse</span>
            </p>
            <p className="text-gray-500 text-xs mt-1">Supports JPG, PNG, GIF, WebP, SVG, BMP, ICO</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Format selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Output Format</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'data-url', label: 'Data URL (full)' },
                { id: 'base64', label: 'Raw Base64' },
                { id: 'css', label: 'CSS Background' },
                { id: 'html', label: 'HTML <img>' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleFormatChange(f.id)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                    format === f.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Output */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Base64 Code</label>
            <textarea
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-xs text-gray-800 font-mono h-36 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
              readOnly
              value={output}
              placeholder="Base64 output will appear here after selecting an image..."
              onClick={(e) => e.target.select()}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={copyOutput}
              disabled={!output}
              className="min-h-[44px] flex-1 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {copied ? '✓ Copied to Clipboard!' : '📋 Copy Base64'}
            </button>
            <button
              type="button"
              onClick={downloadText}
              disabled={!output}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              💾 Save as .txt
            </button>
            <button
              type="button"
              onClick={clear}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Preview & info */}
          {preview && (
            <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row items-center gap-4">
              <img
                src={preview}
                alt="Preview"
                className="max-w-[180px] max-h-[140px] rounded-lg border border-gray-200 object-contain shadow-sm"
              />
              <div className="text-xs text-gray-600 space-y-1 text-center sm:text-left">
                <div className="font-semibold text-gray-900">{currentFile?.name}</div>
                <div>{sizeInfo}</div>
                <div className="text-emerald-700 font-medium">✓ Ready to embed directly in HTML, CSS, or JSON</div>
              </div>
            </div>
          )}
        </div>

        {/* About */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-2">About Base64 Image Encoding</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Base64 encoding transforms binary image data into standard ASCII text characters. This allows you to embed images directly within HTML, CSS, emails, or JSON payloads without requiring separate HTTP requests. It is ideal for small icons, loaders, and standalone templates.
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
