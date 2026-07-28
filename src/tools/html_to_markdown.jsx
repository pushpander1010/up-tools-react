import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

// ── HTML → Markdown converter ──
function htmlToMarkdown(html) {
  let md = html
  // Remove script/style blocks
  md = md.replace(/<script[\s\S]*?<\/script>/gi, '')
  md = md.replace(/<style[\s\S]*?<\/style>/gi, '')
  // Block elements → newlines first
  md = md.replace(/<\/(p|div|h[1-6]|li|tr|blockquote|pre|section|article)>/gi, '\n')
  md = md.replace(/<br\s*\/?>/gi, '\n')
  md = md.replace(/<hr\s*\/?>/gi, '\n---\n')
  // Headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n')
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n')
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n')
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n')
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '\n##### $1\n')
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '\n###### $1\n')
  // Bold / italic / code
  md = md.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
  md = md.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*')
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n```\n$1\n```\n')
  md = md.replace(/<del[^>]*>([\s\S]*?)<\/del>/gi, '~~$1~~')
  md = md.replace(/<s[^>]*>([\s\S]*?)<\/s>/gi, '~~$1~~')
  md = md.replace(/<u[^>]*>([\s\S]*?)<\/u>/gi, '<u>$1</u>')
  // Links and images
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)')
  md = md.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '![$1]($2)')
  // Lists
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (m, content) => {
    const cleaned = content.replace(/<[^>]+>/g, '').trim()
    return `- ${cleaned}\n`
  })
  // Blockquote
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (m, c) => {
    return c.split('\n').filter(l => l.trim()).map(l => `> ${l.trim()}`).join('\n') + '\n'
  })
  // Tables (simple)
  md = md.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (m, body) => {
    const rows = []
    const re = /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi
    let m2, isHeader = true
    const lines = body.split(/<\/tr>/i)
    for (const line of lines) {
      const cells = []
      while ((m2 = re.exec(line)) !== null) {
        cells.push(m2[1].replace(/<[^>]+>/g, '').trim())
      }
      re.lastIndex = 0
      if (cells.length) {
        rows.push(cells)
      }
    }
    if (!rows.length) return ''
    let result = '| ' + rows[0].join(' | ') + ' |\n'
    result += '| ' + rows[0].map(() => '---').join(' | ') + ' |\n'
    for (let i = 1; i < rows.length; i++) {
      result += '| ' + rows[i].join(' | ') + ' |\n'
    }
    return '\n' + result + '\n'
  })
  // Remove remaining HTML tags
  md = md.replace(/<[^>]+>/g, '')
  // Decode common HTML entities
  md = md.replace(/&amp;/g, '&')
  md = md.replace(/&lt;/g, '<')
  md = md.replace(/&gt;/g, '>')
  md = md.replace(/&quot;/g, '"')
  md = md.replace(/&#39;/g, "'")
  md = md.replace(/&nbsp;/g, ' ')
  // Collapse blank lines
  md = md.replace(/\n{3,}/g, '\n\n')
  return md.trim()
}

// ── Markdown → HTML converter ──
function markdownToHtml(md) {
  let html = md
  // Code blocks first
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (m, lang, code) => {
    return `<pre><code class="${lang}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
  })
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  // Headers
  html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>')
  html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>')
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr />')
  // Images (before links)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  // Bold + italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/_(.+?)_/g, '<em>$1</em>')
  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>')
  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
  // Unordered lists
  html = html.replace(/^(?:- (.+)\n?)+/gm, (match) => {
    const items = match.trim().split('\n').map(l => `<li>${l.replace(/^- /, '')}</li>`).join('\n')
    return `<ul>\n${items}\n</ul>\n`
  })
  // Ordered lists
  html = html.replace(/^(?:\d+\. (.+)\n?)+/gm, (match) => {
    const items = match.trim().split('\n').map(l => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('\n')
    return `<ol>\n${items}\n</ol>\n`
  })
  // Tables
  html = html.replace(/(?:^\|.+\|$\n?)+/gm, (block) => {
    const lines = block.trim().split('\n').filter(l => l.trim())
    if (lines.length < 2) return block
    let result = '<table>\n<thead>\n<tr>\n'
    const headerCells = lines[0].split('|').filter(c => c.trim())
    result += headerCells.map(c => `<th>${c.trim()}</th>`).join('\n') + '\n</tr>\n</thead>\n<tbody>\n'
    for (let i = 2; i < lines.length; i++) {
      const cells = lines[i].split('|').filter(c => c.trim())
      result += '<tr>\n' + cells.map(c => `<td>${c.trim()}</td>`).join('\n') + '\n</tr>\n'
    }
    result += '</tbody>\n</table>\n'
    return result
  })
  // Line breaks → paragraphs
  html = html.split(/\n\n+/).map(block => {
    const trimmed = block.trim()
    if (!trimmed) return ''
    if (/^<[a-z]/.test(trimmed)) return trimmed
    return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`
  }).filter(Boolean).join('\n')
  return html
}

export default function HtmlToMarkdown() {
  const [htmlInput, setHtmlInput] = useState('')
  const [mdInput, setMdInput] = useState('')
  const [direction, setDirection] = useState('html2md') // html2md or md2html
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const handleConvert = useCallback(() => {
    if (direction === 'html2md') {
      setOutput(htmlToMarkdown(htmlInput))
    } else {
      setOutput(markdownToHtml(mdInput))
    }
  }, [direction, htmlInput, mdInput])

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolLayout
      title="HTML ⇄ Markdown Converter"
      desc="Convert between HTML and Markdown formats instantly. Supports headings, lists, tables, links, images, and more."
      icon="📝" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="html-to-markdown"
      faq={[
        { q: 'What is HTML to Markdown conversion?', a: 'It converts HTML markup into clean Markdown syntax, useful for documentation, GitHub READMEs, and static site generators.' },
        { q: 'What Markdown features are supported?', a: 'Headings, bold, italic, links, images, lists, blockquotes, code blocks, tables, horizontal rules, and strikethrough.' },
      ]}
      howItWorks={[
        'Paste HTML in the input area (or switch to Markdown mode).',
        'Click Convert to transform the content.',
        'Copy the output for use in your project.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "HTML ⇄ Markdown Converter", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/html-to-markdown/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Direction toggle */}
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${direction === 'html2md' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-400 border border-white/[0.08] hover:text-white'}`}
            onClick={() => { setDirection('html2md'); setOutput('') }}
          >
            HTML → Markdown
          </button>
          <button
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${direction === 'md2html' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-400 border border-white/[0.08] hover:text-white'}`}
            onClick={() => { setDirection('md2html'); setOutput('') }}
          >
            Markdown → HTML
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {direction === 'html2md' ? 'Paste HTML' : 'Paste Markdown'}
            </label>
            <textarea
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white font-mono min-h-[260px] resize-y focus:outline-none focus:border-indigo-500/50"
              value={direction === 'html2md' ? htmlInput : mdInput}
              onChange={e => direction === 'html2md' ? setHtmlInput(e.target.value) : setMdInput(e.target.value)}
              placeholder={direction === 'html2md' ? '<h1>Hello</h1>\n<p>This is <strong>bold</strong> and <em>italic</em>.</p>' : '# Hello\n\nThis is **bold** and *italic*.'}
            />
          </div>

          {/* Output */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-300">
                {direction === 'html2md' ? 'Markdown Output' : 'HTML Output'}
              </label>
              {output && (
                <button onClick={handleCopy} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <textarea
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white font-mono min-h-[260px] resize-y focus:outline-none"
              value={output} readOnly
              placeholder="Converted output will appear here..."
            />
          </div>
        </div>

        <button className="glow-btn text-sm px-6 py-2.5 rounded-xl font-semibold" onClick={handleConvert}>
          Convert
        </button>

        {/* HTML Preview */}
        {output && direction === 'html2md' && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Markdown Preview</label>
            <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
              {output}
            </div>
          </div>
        )}

        {/* HTML Preview for md2html */}
        {output && direction === 'md2html' && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <label className="block text-sm font-semibold text-slate-300 mb-2">HTML Preview</label>
            <div className="text-sm text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: output }} />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
