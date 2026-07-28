import { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const themes = {
  'Dracula': { bg: '#282a36', fg: '#f8f8f2', keyword: '#ff79c6', string: '#f1fa8c', comment: '#6272a4', function: '#50fa7b', number: '#bd93f9', line: '#44475a' },
  'Monokai': { bg: '#272822', fg: '#f8f8f2', keyword: '#f92672', string: '#e6db74', comment: '#75715e', function: '#a6e22e', number: '#ae81ff', line: '#3e3d32' },
  'Solarized Dark': { bg: '#002b36', fg: '#839496', keyword: '#859900', string: '#2aa198', comment: '#586e75', function: '#268bd2', number: '#d33682', line: '#073642' },
  'Nord': { bg: '#2e3440', fg: '#d8dee9', keyword: '#81a1c1', string: '#a3be8c', comment: '#616e88', function: '#88c0d0', number: '#b48ead', line: '#3b4252' },
  'GitHub Dark': { bg: '#0d1117', fg: '#c9d1d9', keyword: '#ff7b72', string: '#a5d6ff', comment: '#8b949e', function: '#d2a8ff', number: '#79c0ff', line: '#161b22' },
  'One Dark': { bg: '#282c34', fg: '#abb2bf', keyword: '#c678dd', string: '#98c379', comment: '#5c6370', function: '#61afef', number: '#d19a66', line: '#21252b' },
}

const languages = ['JavaScript', 'Python', 'HTML', 'CSS', 'TypeScript', 'Rust', 'Go', 'Java', 'JSON', 'Markdown']

const sampleCode = `// Welcome to Code to Image 📸
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Generate first 10 Fibonacci numbers
const results = [];
for (let i = 0; i < 10; i++) {
  results.push(fibonacci(i));
}

console.log("Fibonacci:", results);`

const fontSizes = [12, 14, 16, 18, 20, 24]
const paddingOptions = [24, 32, 48, 64]

function simpleHighlight(code, lang, colors) {
  if (!code) return ''
  const lines = code.split('\n')
  return lines.map((line, i) => {
    let highlighted = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    // Comment patterns
    highlighted = highlighted.replace(/(\/\/.*$)/gm, `<span style="color:${colors.comment}">$1</span>`)
    highlighted = highlighted.replace(/(#.*$)/gm, (m) => {
      if (lang === 'Python') return `<span style="color:${colors.comment}">${m}</span>`
      return m
    })

    // Strings
    highlighted = highlighted.replace(/(["'`])(?:(?!\1|\\).|\\.)*\1/g, `<span style="color:${colors.string}">$&</span>`)

    // Keywords
    const kwRegex = /\b(function|const|let|var|return|if|else|for|while|class|import|export|from|default|async|await|new|try|catch|throw|typeof|instanceof|in|of|def|print|lambda|yield|self|None|True|False|fn|pub|use|mod|struct|impl|trait|enum|match|loop|break|continue|mut|ref|static|super|where|type|interface|enum|extends|implements|public|private|protected|static|final|abstract|void|int|string|boolean|null|true|false)\b/g
    highlighted = highlighted.replace(kwRegex, `<span style="color:${colors.keyword}">$&</span>`)

    // Numbers
    highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, `<span style="color:${colors.number}">$1</span>`)

    // Functions (word followed by parenthesis)
    highlighted = highlighted.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, `<span style="color:${colors.function}">$1</span>`)

    return `<span style="color:${colors.line};user-select:none;display:inline-block;width:3ch;text-align:right;margin-right:1.5em;opacity:0.5">${i + 1}</span>${highlighted}`
  }).join('\n')
}

export default function code_to_image() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const [code, setCode] = useState(sampleCode)
  const [theme, setTheme] = useState('Dracula')
  const [language, setLanguage] = useState('JavaScript')
  const [fontSize, setFontSize] = useState(14)
  const [padding, setPadding] = useState(32)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [customBg, setCustomBg] = useState('')
  const [copied, setCopied] = useState(false)

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-2.5 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500"

  const activeTheme = themes[theme]
  const bgColor = customBg || activeTheme.bg

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const lineCount = code.split('\n').length
    const lineHeight = fontSize * 1.6
    const lineNumWidth = showLineNumbers ? (String(lineCount).length + 2) * fontSize * 0.6 + 16 : 0

    // Measure text width
    ctx.font = `${fontSize}px "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace`
    const lines = code.split('\n')
    let maxTextWidth = 0
    lines.forEach(line => {
      const w = ctx.measureText(line).width
      if (w > maxTextWidth) maxTextWidth = w
    })

    const contentWidth = lineNumWidth + maxTextWidth + padding * 2
    const contentHeight = padding * 2 + lineCount * lineHeight + 40 // 40 for title bar

    canvas.width = Math.max(contentWidth, 400)
    canvas.height = Math.max(contentHeight, 200)

    // Background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Title bar
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvas.width, 36)

    // Window dots
    const dotColors = ['#ff5f57', '#febc2e', '#28c840']
    dotColors.forEach((c, i) => {
      ctx.beginPath()
      ctx.arc(20 + i * 24, 18, 6, 0, Math.PI * 2)
      ctx.fillStyle = c
      ctx.fill()
    })

    // Language label
    ctx.font = `bold 12px -apple-system, sans-serif`
    ctx.fillStyle = '#888'
    ctx.textAlign = 'right'
    ctx.fillText(language, canvas.width - 16, 22)
    ctx.textAlign = 'left'

    // Code
    ctx.font = `${fontSize}px "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace`
    const startY = 36 + padding

    lines.forEach((line, i) => {
      const y = startY + i * lineHeight

      // Line number
      if (showLineNumbers) {
        ctx.fillStyle = activeTheme.line
        ctx.globalAlpha = 0.5
        const numStr = String(i + 1).padStart(String(lineCount).length)
        ctx.fillText(numStr, padding, y + fontSize)
        ctx.globalAlpha = 1
      }

      // Syntax highlighting (simplified for canvas)
      const x = padding + lineNumWidth

      // Simple tokenization for canvas
      let currentX = x
      const tokens = tokenizeSimple(line)

      tokens.forEach(token => {
        ctx.fillStyle = token.color
        ctx.fillText(token.text, currentX, y + fontSize)
        currentX += ctx.measureText(token.text).width
      })
    })
  }, [code, theme, language, fontSize, padding, showLineNumbers, bgColor])

  function tokenizeSimple(line) {
    const tokens = []
    let remaining = line
    const colors = activeTheme

    while (remaining.length > 0) {
      let matched = false

      // Comment
      const commentMatch = remaining.match(/^(\/\/.*|#.*)/)
      if (commentMatch) {
        tokens.push({ text: commentMatch[0], color: colors.comment })
        remaining = remaining.slice(commentMatch[0].length)
        matched = true
        continue
      }

      // String
      const stringMatch = remaining.match(/^(["'`])(?:(?!\1|\\).|\\.)*\1/)
      if (stringMatch) {
        tokens.push({ text: stringMatch[0], color: colors.string })
        remaining = remaining.slice(stringMatch[0].length)
        matched = true
        continue
      }

      // Keyword
      const kwMatch = remaining.match(/^(function|const|let|var|return|if|else|for|while|class|import|export|from|default|async|await|new|try|catch|throw|typeof|instanceof|in|of|def|print|lambda|yield|self|None|True|False)\b/)
      if (kwMatch) {
        tokens.push({ text: kwMatch[0], color: colors.keyword })
        remaining = remaining.slice(kwMatch[0].length)
        matched = true
        continue
      }

      // Number
      const numMatch = remaining.match(/^(\d+\.?\d*)/)
      if (numMatch) {
        tokens.push({ text: numMatch[0], color: colors.number })
        remaining = remaining.slice(numMatch[0].length)
        matched = true
        continue
      }

      // Word
      const wordMatch = remaining.match(/^([a-zA-Z_]\w*)/)
      if (wordMatch) {
        const afterWord = remaining.slice(wordMatch[0].length).trimStart()
        const isFunc = afterWord.startsWith('(')
        tokens.push({ text: wordMatch[0], color: isFunc ? colors.function : colors.fg })
        remaining = remaining.slice(wordMatch[0].length)
        matched = true
        continue
      }

      // Whitespace or other characters
      const otherMatch = remaining.match(/^(\s+|[^\w\s"'/#]+)/)
      if (otherMatch) {
        tokens.push({ text: otherMatch[0], color: colors.fg })
        remaining = remaining.slice(otherMatch[0].length)
        matched = true
      }

      if (!matched) {
        tokens.push({ text: remaining[0], color: colors.fg })
        remaining = remaining.slice(1)
      }
    }

    return tokens
  }

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  const downloadPNG = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `code-${language.toLowerCase()}-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyToClipboard = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      const blob = await new Promise(r => canvas.toBlob(r, 'image/png'))
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: download
      downloadPNG()
    }
  }

  return (
    <ToolLayout
      title="Code to Image Converter"
      desc="Convert code snippets to beautiful shareable images. Choose themes, adjust styling, and download as PNG."
      icon="📸" iconBg="rgba(251,146,60,0.08)"
      category="dev" slug="code-to-image"
      faq={[
        { q: "What image format is exported?", a: "The tool generates a high-quality PNG image at 2x resolution for crisp display on social media and blogs." },
        { q: "Can I customize the appearance?", a: "Yes! Choose from 6 themes, adjust font size, padding, and toggle line numbers. You can also set a custom background color." },
        { q: "Is my code sent to any server?", a: "No. Everything runs entirely in your browser using the Canvas API. Your code never leaves your device." },
      ]}
      howItWorks={[
        "Paste or write your code in the editor textarea.",
        "Choose a color theme, language label, font size, and padding.",
        "Preview the result in real-time on the canvas.",
        "Click Download PNG to save or Copy to clipboard to paste directly.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Code to Image Converter", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/code-to-image/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
          {/* Left: Controls */}
          <div className="space-y-4">
            {/* Code Input */}
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Code</label>
              <textarea value={code} onChange={e => setCode(e.target.value)}
                className="w-full h-48 bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white text-xs font-mono outline-none focus:border-orange-500/40 transition-all resize-none placeholder:text-slate-500"
                placeholder="Paste your code here..." spellCheck={false} />
            </div>

            {/* Theme & Language */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Theme</label>
                <select value={theme} onChange={e => setTheme(e.target.value)} className={inputClass}>
                  {Object.keys(themes).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} className={inputClass}>
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Font Size & Padding */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Font Size</label>
                <div className="flex gap-1.5">
                  {fontSizes.map(s => (
                    <button key={s} onClick={() => setFontSize(s)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${fontSize === s ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/8'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Padding</label>
                <div className="flex gap-1.5">
                  {paddingOptions.map(p => (
                    <button key={p} onClick={() => setPadding(p)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${padding === p ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/8'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showLineNumbers}
                  onChange={e => setShowLineNumbers(e.target.checked)}
                  className="accent-orange-500" />
                <span className="text-xs font-semibold text-slate-400">Line Numbers</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Custom BG:</span>
                <input type="color" value={customBg || bgColor}
                  onChange={e => setCustomBg(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent" />
                {customBg && (
                  <button onClick={() => setCustomBg('')}
                    className="text-xs text-red-400 hover:text-red-300 transition-all">Reset</button>
                )}
              </div>
            </div>

            {/* Theme preview dots */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Colors:</span>
              {['keyword', 'string', 'comment', 'function', 'number'].map(key => (
                <div key={key} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeTheme[key] }} />
                  <span className="text-[10px] text-slate-500">{key}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Preview & Download */}
          <div className="space-y-4" ref={resultRef}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-500">Preview</label>
              <div className="flex gap-2">
                <button onClick={copyToClipboard}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
                <button onClick={downloadPNG}
                  className="glow-btn px-5 py-2 rounded-xl text-xs font-bold">
                  ⬇ Download PNG
                </button>
              </div>
            </div>
            <div className="bg-slate-950/50 rounded-2xl border border-white/[0.08] p-4 overflow-auto">
              <canvas ref={canvasRef} className="mx-auto rounded-lg max-w-full" style={{ imageRendering: 'auto' }} />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
