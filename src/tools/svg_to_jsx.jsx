import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

const ATTR_MAP = {
  'class': 'className',
  'for': 'htmlFor',
  'tabindex': 'tabIndex',
  'readonly': 'readOnly',
  'maxlength': 'maxLength',
  'cellpadding': 'cellPadding',
  'cellspacing': 'cellSpacing',
  'rowspan': 'rowSpan',
  'colspan': 'colSpan',
  'accesskey': 'accessKey',
  'contenteditable': 'contentEditable',
  'crossorigin': 'crossOrigin',
  'enctype': 'encType',
  'formaction': 'formAction',
  'formmethod': 'formMethod',
  'formnovalidate': 'formNoValidate',
  'formtarget': 'formTarget',
  'nomodule': 'noModule',
  'playsinline': 'playsInline',
  'allowfullscreen': 'allowFullScreen',
  'autocomplete': 'autoComplete',
  'autofocus': 'autoFocus',
  'autoplay': 'autoPlay',
  'nomodule': 'noModule',
}

const EVENT_MAP = {
  'onclick': 'onClick',
  'onchange': 'onChange',
  'onsubmit': 'onSubmit',
  'onkeydown': 'onKeyDown',
  'onkeyup': 'onKeyUp',
  'onkeypress': 'onKeyPress',
  'onfocus': 'onFocus',
  'onblur': 'onBlur',
  'onmouseover': 'onMouseOver',
  'onmouseout': 'onMouseOut',
  'onmouseenter': 'onMouseEnter',
  'onmouseleave': 'onMouseLeave',
  'onmousedown': 'onMouseDown',
  'onmouseup': 'onMouseUp',
  'oninput': 'onInput',
  'onscroll': 'onScroll',
  'onload': 'onLoad',
  'onerror': 'onError',
  'onwheel': 'onWheel',
  'ondrag': 'onDrag',
  'ondragstart': 'onDragStart',
  'ondragend': 'onDragEnd',
  'ondragover': 'onDragOver',
  'ondragenter': 'onDragEnter',
  'ondragleave': 'onDragLeave',
  'ondrop': 'onDrop',
}

function convertSvgToJsx(svg) {
  let result = svg
    // Convert attribute names
    .replace(/\b(class)=/g, 'className=')
    .replace(/\b(for)=/g, 'htmlFor=')
    .replace(/\b(tabindex)=/g, 'tabIndex=')
    .replace(/\b(readonly)=/g, 'readOnly=')
    .replace(/\b(maxlength)=/g, 'maxLength=')
    .replace(/\b(cellpadding)=/g, 'cellPadding=')
    .replace(/\b(cellspacing)=/g, 'cellSpacing=')
    .replace(/\b(rowspan)=/g, 'rowSpan=')
    .replace(/\b(colspan)=/g, 'colSpan=')
    .replace(/\b(accesskey)=/g, 'accessKey=')
    .replace(/\b(contenteditable)=/g, 'contentEditable=')
    .replace(/\b(crossorigin)=/g, 'crossOrigin=')
    .replace(/\b(enctype)=/g, 'encType=')
    .replace(/\b(formaction)=/g, 'formAction=')
    .replace(/\b(autocomplete)=/g, 'autoComplete=')
    .replace(/\b(autofocus)=/g, 'autoFocus=')
    .replace(/\b(autoplay)=/g, 'autoPlay=')
    .replace(/\b(allowfullscreen)=/g, 'allowFullScreen=')
    // Convert event handlers: onclick → onClick
    .replace(/\bonclick=/g, 'onClick=')
    .replace(/\bonchange=/g, 'onChange=')
    .replace(/\bonsubmit=/g, 'onSubmit=')
    .replace(/\bonkeydown=/g, 'onKeyDown=')
    .replace(/\bonkeyup=/g, 'onKeyUp=')
    .replace(/\bonfocus=/g, 'onFocus=')
    .replace(/\bonblur=/g, 'onBlur=')
    .replace(/\bonmouseover=/g, 'onMouseOver=')
    .replace(/\bonmouseout=/g, 'onMouseOut=')
    .replace(/\bonload=/g, 'onLoad=')
    .replace(/\bonerror=/g, 'onError=')
    .replace(/\bfill-rule=/g, 'fillRule=')
    .replace(/\bclip-rule=/g, 'clipRule=')
    .replace(/\bstroke-width=/g, 'strokeWidth=')
    .replace(/\bstroke-linecap=/g, 'strokeLinecap=')
    .replace(/\bstroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/\bstroke-dasharray=/g, 'strokeDasharray=')
    .replace(/\bstroke-dashoffset=/g, 'strokeDashoffset=')
    .replace(/\bfont-size=/g, 'fontSize=')
    .replace(/\bfont-family=/g, 'fontFamily=')
    .replace(/\bfont-weight=/g, 'fontWeight=')
    .replace(/\btext-anchor=/g, 'textAnchor=')
    .replace(/\bxml-space=/g, 'xmlSpace=')
    .replace(/\bxlink:href=/g, 'xlinkHref=')
    .replace(/\bxlink:title=/g, 'xlinkTitle=')
    // Convert xmlns (remove in JSX since it's not needed)
    .replace(/\s+xmlns="[^"]*"/g, '')
    // Convert self-closing tags for void elements
    .replace(/<br\s*\/?>/g, '<br />')
    .replace(/<hr\s*\/?>/g, '<hr />')
    .replace(/<img\s*\/?>/g, '<img />')
    // Ensure self-closing for SVG elements
    .replace(/<(circle|line|path|polygon|polyline|rect|ellipse|use|stop|image|meta|link)(\s[^>]*?)(?<!\/)>(?=\s*<\/|$)/g, '<$1$2 />')
    // Convert style objects from strings
    .replace(/style="([^"]*)"/g, (_, val) => {
      const props = val.split(';').filter(Boolean).map(s => {
        const [k, v] = s.split(':').map(x => x.trim())
        if (!k || !v) return null
        const camel = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        return `${camel}: '${v}'`
      }).filter(Boolean)
      return `style={{ ${props.join(', ')} }}`
    })
    // Remove XML declarations
    .replace(/<\?xml[^>]*\?>/g, '')
    // Remove comments
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim()

  return result
}

export default function svg_to_jsx() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const convert = () => {
    if (!input.trim()) {
      setError('Please paste an SVG to convert.')
      setOutput('')
      return
    }
    try {
      const jsx = convertSvgToJsx(input)
      setOutput(jsx)
      setError('')
    } catch (e) {
      setError('Conversion failed: ' + e.message)
      setOutput('')
    }
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <ToolLayout
      title="SVG to JSX Converter"
      desc="Convert SVG markup to React-compatible JSX. Automatically transforms attributes and event handlers."
      icon="🔄" iconBg="rgba(16,185,129,0.08)"
      category="developer" slug="svg-to-jsx"
      faq={[
        { q: 'What does SVG to JSX conversion do?', a: 'It transforms SVG markup into React-compatible JSX by converting attribute names (class → className, onclick → onClick, etc.), fixing self-closing tags, and removing unnecessary xmlns declarations.' },
        { q: 'Which attributes are converted?', a: 'HTML attributes like class, for, tabindex, event handlers (onclick → onClick), and SVG-specific attributes like fill-rule → fillRule, stroke-width → strokeWidth.' },
      ]}
      howItWorks={[
        'Paste your SVG code into the input area on the left.',
        'Click "Convert to JSX" to transform the markup.',
        'The React-compatible JSX appears in the output area on the right.',
        'Click "Copy" to copy the JSX output to your clipboard.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "SVG to JSX Converter", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/svg-to-jsx/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={convert}
            className="px-6 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-bold hover:bg-emerald-500/30 transition-all duration-200">
            ⚡ Convert to JSX
          </button>
          <button onClick={clearAll}
            className="px-4 py-2.5 rounded-xl bg-white/[0.04] text-slate-400 text-sm font-bold hover:bg-white/[0.08] hover:text-slate-300 transition-all duration-200">
            🗑️ Clear
          </button>
          {output && (
            <button onClick={copyOutput}
              className="ml-auto px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-bold hover:bg-emerald-500/30 transition-all duration-200">
              {copied ? '✓ Copied!' : '📋 Copy JSX'}
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-400 font-medium">
            {error}
          </div>
        )}

        {/* Editor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SVG Input</span>
            </div>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              placeholder={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\n  <path class="icon" d="M12 2L2 22h20L12 2z" />\n</svg>'}
              className="w-full h-80 bg-transparent text-white font-mono text-xs p-4 outline-none resize-none placeholder:text-slate-600 [color-scheme:dark]" />
          </div>

          {/* Output */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">JSX Output</span>
            </div>
            <textarea value={output} readOnly
              placeholder="Converted JSX will appear here..."
              className="w-full h-80 bg-transparent text-white font-mono text-xs p-4 outline-none resize-none placeholder:text-slate-600 [color-scheme:dark]" />
          </div>
        </div>

        {/* Transformations reference */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">Attribute Transformations</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-[10px] font-mono">
            {[
              ['class →', 'className'],
              ['for →', 'htmlFor'],
              ['onclick →', 'onClick'],
              ['onchange →', 'onChange'],
              ['tabindex →', 'tabIndex'],
              ['readonly →', 'readOnly'],
              ['stroke-width →', 'strokeWidth'],
              ['fill-rule →', 'fillRule'],
              ['font-size →', 'fontSize'],
              ['text-anchor →', 'textAnchor'],
              ['clip-rule →', 'clipRule'],
              ['style="" →', 'style={{}}'],
            ].map(([from, to]) => (
              <div key={from} className="bg-black/20 rounded-lg px-2.5 py-1.5 flex items-center gap-1">
                <span className="text-rose-400">{from}</span>
                <span className="text-emerald-400">{to}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
