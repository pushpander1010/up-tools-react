import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function TextToImage() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const [text, setText] = useState('')
  const [fontSize, setFontSize] = useState(24)
  const [bgColor, setBgColor] = useState('#1e1e2e')
  const [textColor, setTextColor] = useState('#ffffff')
  const [fontFamily, setFontFamily] = useState('monospace')
  const [padding, setPadding] = useState(40)
  const [lineHeight, setLineHeight] = useState(1.6)
  const [maxWidth, setMaxWidth] = useState(800)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')

  const fonts = ['monospace', 'Arial', 'Georgia', 'Courier New', 'Verdana', 'Times New Roman', 'Trebuchet MS']

  const generateImage = useCallback(() => {
    if (!text.trim()) { setError('Please enter some text.'); return }
    setError('')

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const font = `${fontSize}px ${fontFamily}`
    ctx.font = font

    // Word wrap
    const words = text.split(' ')
    const lines = []
    let currentLine = ''
    const effectiveWidth = maxWidth - padding * 2

    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word
      const metrics = ctx.measureText(testLine)
      if (metrics.width > effectiveWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    if (currentLine) lines.push(currentLine)

    // Handle newlines in input
    const allLines = []
    for (const line of lines) {
      const subLines = line.split('\n')
      allLines.push(...subLines)
    }

    const actualLineHeight = fontSize * lineHeight
    const textHeight = allLines.length * actualLineHeight
    canvas.width = maxWidth
    canvas.height = Math.max(100, textHeight + padding * 2)

    // Background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Text
    ctx.font = font
    ctx.fillStyle = textColor
    ctx.textBaseline = 'top'

    allLines.forEach((line, i) => {
      ctx.fillText(line, padding, padding + i * actualLineHeight)
    })

    const dataUrl = canvas.toDataURL('image/png')
    setImageUrl(dataUrl)
    setTimeout(() => jumpTo(), 50)
  }, [text, fontSize, bgColor, textColor, fontFamily, padding, lineHeight, maxWidth, jumpTo])

  const downloadImage = () => {
    if (!imageUrl) return
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = 'text-image.png'
    a.click()
  }

  return (
    <ToolLayout
      title="Text to Image"
      desc="Convert any text to a downloadable PNG image with custom fonts, colors, and sizing."
      icon="📝" iconBg="rgba(99,102,241,0.08)"
      category="images" slug="text-to-image"
      faq={[
        { q: 'What is Text to Image?', a: 'A tool that renders your text into a PNG image you can download. Customize font, colors, size, padding, and line height.' },
        { q: 'What formats can I download?', a: 'The output is a high-quality PNG image that can be used anywhere — social media, documents, presentations.' },
      ]}
      howItWorks={[
        'Enter your text in the input area.',
        'Customize font, colors, size, padding, and line height.',
        'Click "Generate Image" to create and preview your PNG.',
        'Download the image with the download button.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Text to Image", "applicationCategory": "MultimediaApplication",
        "url": "https://www.uptools.in/text-to-image/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Enter Text</label>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Type or paste text here..."
            rows={5}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-mono text-sm outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark] resize-none" />
        </div>

        {/* Settings */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300">⚙️ Image Settings</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Font Size: {fontSize}px</label>
              <input type="range" min="12" max="72" value={fontSize} onChange={e => setFontSize(+e.target.value)}
                className="w-full accent-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Line Height: {lineHeight}</label>
              <input type="range" min="1" max="3" step="0.1" value={lineHeight} onChange={e => setLineHeight(+e.target.value)}
                className="w-full accent-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Padding: {padding}px</label>
              <input type="range" min="10" max="100" value={padding} onChange={e => setPadding(+e.target.value)}
                className="w-full accent-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Width: {maxWidth}px</label>
              <input type="range" min="300" max="1920" step="10" value={maxWidth} onChange={e => setMaxWidth(+e.target.value)}
                className="w-full accent-indigo-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Background</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer" />
                <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)}
                  className="flex-1 bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500/40" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Text Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer" />
                <input type="text" value={textColor} onChange={e => setTextColor(e.target.value)}
                  className="flex-1 bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500/40" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Font Family</label>
            <div className="flex flex-wrap gap-2">
              {fonts.map(f => (
                <button key={f} onClick={() => setFontFamily(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border-2 transition-all ${
                    fontFamily === f
                      ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
                      : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:border-white/[0.15]'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}

        <button onClick={generateImage}
          disabled={!text.trim()}
          className="glow-btn text-sm font-bold px-6 py-2.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed">
          🖼️ Generate Image
        </button>

        {/* Output */}
        {imageUrl ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Preview</h3>
            </div>
            <div className="bg-black/20 rounded-xl p-3 overflow-x-auto">
              <img src={imageUrl} alt="Generated text image" className="max-w-full rounded-lg" />
            </div>
            <div className="flex gap-3 mt-3">
              <button onClick={downloadImage}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                ⬇️ Download PNG
              </button>
              <button onClick={() => navigator.clipboard.writeText(imageUrl)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                📋 Copy Data URL
              </button>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📝</div>
            <p className="text-sm text-slate-600 font-medium">Enter text and generate an image</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
