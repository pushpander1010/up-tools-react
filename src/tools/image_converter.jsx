import { useState, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import { formatBytes, postImage } from '../lib/imageBackend'

const FORMATS = [
  { value: 'jpeg', label: 'JPEG (.jpg)', ext: 'jpg' },
  { value: 'png', label: 'PNG (.png)', ext: 'png' },
  { value: 'webp', label: 'WebP (.webp)', ext: 'webp' },
  { value: 'gif', label: 'GIF (.gif)', ext: 'gif' },
  { value: 'bmp', label: 'BMP (.bmp)', ext: 'bmp' },
  { value: 'tiff', label: 'TIFF (.tiff)', ext: 'tiff' },
]

async function clientConvert(file, format, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const tempUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(tempUrl)
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      // If converting to lossy format without alpha, paint white background
      if (format === 'jpeg' || format === 'bmp') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      ctx.drawImage(img, 0, 0)
      let mime = `image/${format}`
      if (format === 'jpg') mime = 'image/jpeg'
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Canvas conversion failed"))
          resolve({
            blob,
            url: URL.createObjectURL(blob),
            size: blob.size,
            width: img.width,
            height: img.height,
          })
        },
        mime,
        quality / 100
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(tempUrl)
      reject(new Error("Failed to load image for conversion"))
    }
    img.src = tempUrl
  })
}

export default function image_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const fileRef = useRef(null)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [format, setFormat] = useState('png')
  const [quality, setQuality] = useState(90)
  const [outUrl, setOutUrl] = useState(null)
  const [outSize, setOutSize] = useState(0)
  const [outMeta, setOutMeta] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [copied, setCopied] = useState(false)

  const outBlobRef = useRef(null)
  const previewUrlRef = useRef("")
  const outUrlRef = useRef("")

  useEffect(() => {
    previewUrlRef.current = previewUrl
  }, [previewUrl])

  useEffect(() => {
    outUrlRef.current = outUrl
  }, [outUrl])

  // Revoke URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
      if (outUrlRef.current) URL.revokeObjectURL(outUrlRef.current)
    }
  }, [])

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) {
      setError("Please select a valid image file.")
      return
    }
    setError("")
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    if (outUrlRef.current) URL.revokeObjectURL(outUrlRef.current)

    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setOutUrl(null)
    setOutSize(0)
    setOutMeta(null)
    outBlobRef.current = null
  }, [])

  const convert = useCallback(async () => {
    if (!file) return
    setLoading(true)
    setError("")

    if (outUrlRef.current) {
      URL.revokeObjectURL(outUrlRef.current)
      setOutUrl(null)
    }

    try {
      let out
      try {
        out = await postImage('convert', file, { target_format: format, quality })
      } catch {
        // Client fallback if backend is offline or network fails
        out = await clientConvert(file, format, quality)
      }
      outBlobRef.current = out.blob
      setOutUrl(out.url)
      setOutSize(out.size)
      setOutMeta({ width: out.width, height: out.height })
    } catch (e) {
      setError(e.message || "Conversion failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [file, format, quality])

  const download = useCallback(() => {
    if (!outBlobRef.current) return
    const fmtObj = FORMATS.find((f) => f.value === format)
    const ext = fmtObj ? fmtObj.ext : format
    const url = URL.createObjectURL(outBlobRef.current)
    const a = document.createElement('a')
    a.href = url
    a.download = (file?.name?.replace(/\.[^.]+$/, '') || 'image') + '-converted.' + ext
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [format, file])

  const copyToClipboard = async () => {
    const blob = outBlobRef.current
    if (!blob) return
    try {
      if (blob.type === 'image/png') {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        const img = new Image()
        const u = URL.createObjectURL(blob)
        img.onload = () => {
          URL.revokeObjectURL(u)
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          canvas.getContext('2d').drawImage(img, 0, 0)
          canvas.toBlob(async (pngBlob) => {
            if (pngBlob) {
              await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })])
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }
          }, 'image/png')
        }
        img.src = u
      }
    } catch {
      setError("Clipboard write not supported in this browser.")
    }
  }

  const reset = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    if (outUrlRef.current) URL.revokeObjectURL(outUrlRef.current)
    setFile(null)
    setPreviewUrl("")
    setOutUrl(null)
    setOutSize(0)
    setOutMeta(null)
    outBlobRef.current = null
    setError("")
    if (fileRef.current) fileRef.current.value = ""
  }

  const isLossy = format === 'jpeg' || format === 'webp'

  return (
    <ToolLayout
      title="Image Converter — Convert JPG, PNG, WebP Online"
      desc="Convert images between JPG, PNG, WebP, GIF, BMP and TIFF for free. Preserve transparency with PNG, shrink photos with WebP or JPG. No sign-up, files deleted after conversion."
      icon="🔄" iconBg="rgba(99,102,241,0.08)"
      category="image" slug="image-converter"
      faq={[
        { q: 'How do I convert JPG to PNG?', a: 'Upload your JPG and choose PNG as the output format, then click Convert. PNG preserves transparency and is lossless.' },
        { q: 'What formats are supported?', a: 'Input: JPG, PNG, WebP, GIF, BMP, TIFF. Output: JPG, PNG, WebP, GIF, BMP, TIFF.' },
        { q: 'Is this tool private?', a: 'Your image is uploaded to our secure processing server, converted, and deleted immediately. Nothing is stored.' },
        { q: 'Which format is smallest?', a: 'WebP is generally the smallest for photos, followed by JPG. PNG is best when you need transparency or lossless quality.' },
        { q: 'Is image conversion free?', a: 'Yes, all UpTools image tools are free with no watermarks and no sign-up.' },
      ]}
      howItWorks={[
        'Drag & drop an image or click to select a file.',
        'Choose your output format (JPG, PNG, WebP, GIF, BMP, TIFF).',
        'Adjust quality for lossy formats.',
        'Convert and download your image.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Image Converter", "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "url": "https://www.uptools.in/image-converter/",
        "description": "Free online image converter for JPG, PNG, WebP, GIF, BMP and TIFF.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Upload */}
        <div
          className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-colors ${
            dragOver ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
          }`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleFile(e.dataTransfer.files?.[0])
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {file ? (
            <div className="space-y-1">
              <div className="text-sm font-bold text-gray-900">{file.name}</div>
              <div className="text-xs text-gray-500">{formatBytes(file.size)}</div>
              <div className="text-xs text-indigo-600 font-semibold mt-1">Click or drag a new image to replace</div>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-2">📁</div>
              <p className="text-sm text-gray-900 font-semibold">Drop image here or click to select</p>
              <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WebP, GIF, BMP, TIFF</p>
            </>
          )}
        </div>

        {file && (
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Convert to Format</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFormat(f.value)}
                    className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                      format === f.value
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {isLossy && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-700">Quality</label>
                  <span className="text-xs font-bold text-indigo-600">{quality}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => { convert(); jumpTo() }}
                disabled={loading}
                className="min-h-[44px] flex-1 px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? '⏳ Converting...' : '🔄 Convert Image'}
              </button>
              <button
                type="button"
                onClick={reset}
                className="min-h-[44px] px-5 py-3 rounded-xl text-sm font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                {error}
              </div>
            )}

            {/* Preview of Original */}
            {previewUrl && (
              <div className="pt-2 text-center">
                <div className="text-xs font-semibold text-gray-600 mb-2">Original Preview</div>
                <img
                  src={previewUrl}
                  alt="Original"
                  className="max-h-56 max-w-full h-auto mx-auto rounded-xl border border-gray-200 object-contain"
                />
              </div>
            )}
          </div>
        )}

        {/* Output */}
        {outUrl && (
          <div ref={resultRef} className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm text-center space-y-4">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-800">
                ✓ Converted to {FORMATS.find((f) => f.value === format)?.label}
              </div>
              <div className="text-xs text-emerald-700 mt-1 font-semibold">
                Original: {formatBytes(file?.size || 0)} → Converted: {formatBytes(outSize)}
                {outMeta?.width ? ` (${outMeta.width}×${outMeta.height} px)` : ''}
              </div>
            </div>

            <img
              src={outUrl}
              alt="Converted"
              className="max-h-72 max-w-full h-auto mx-auto rounded-xl border border-gray-200 object-contain"
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={download}
                className="min-h-[44px] flex-1 px-6 py-3.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                ⬇️ Download Converted Image
              </button>
              <button
                type="button"
                onClick={copyToClipboard}
                className="min-h-[44px] px-5 py-3.5 rounded-xl text-sm font-semibold bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
