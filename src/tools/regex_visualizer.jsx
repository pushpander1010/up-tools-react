import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const presets = [
  { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', desc: 'Matches standard email addresses' },
  { name: 'Phone (US)', pattern: '(?:\\+1[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}', desc: 'US phone numbers with optional +1' },
  { name: 'URL', pattern: 'https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[\\w\\-.,@?^=%&:/~+#]*', desc: 'HTTP/HTTPS URLs' },
  { name: 'IPv4', pattern: '\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b', desc: 'IPv4 addresses (0.0.0.0 - 255.255.255.255)' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}[-\\/](?:0[1-9]|1[0-2])[-\\/](?:0[1-9]|[12]\\d|3[01])', desc: 'Dates in YYYY-MM-DD or YYYY/MM/DD format' },
  { name: 'Hex Color', pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b', desc: 'CSS hex colors (#fff, #ff00ff, etc.)' },
  { name: 'HTML Tag', pattern: '<([a-z][a-z0-9]*)\\b[^>]*>.*?<\\/\\1>', desc: 'Opening and closing HTML tags' },
  { name: 'Username', pattern: '[a-zA-Z0-9_]{3,20}', desc: '3-20 alphanumeric characters or underscores' },
  { name: 'Strong Password', pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}', desc: '8+ chars with upper, lower, digit, and special' },
  { name: 'Credit Card', pattern: '\\b(?:\\d{4}[-\\s]?){3}\\d{4}\\b', desc: '16-digit credit card numbers' },
]

const explainPattern = (pattern) => {
  if (!pattern) return []
  const explanations = []
  let i = 0
  const p = pattern

  while (i < p.length) {
    const remaining = p.slice(i)

    // Escaped characters
    if (p[i] === '\\' && i + 1 < p.length) {
      const next = p[i + 1]
      const escapeMap = {
        'd': { token: '\\d', desc: 'Any digit (0-9)' },
        'D': { token: '\\D', desc: 'Any non-digit' },
        'w': { token: '\\w', desc: 'Any word character (letter, digit, underscore)' },
        'W': { token: '\\W', desc: 'Any non-word character' },
        's': { token: '\\s', desc: 'Any whitespace character' },
        'S': { token: '\\S', desc: 'Any non-whitespace character' },
        'b': { token: '\\b', desc: 'Word boundary' },
        'B': { token: '\\B', desc: 'Non-word boundary' },
        'n': { token: '\\n', desc: 'Newline character' },
        't': { token: '\\t', desc: 'Tab character' },
      }
      if (escapeMap[next]) {
        explanations.push(escapeMap[next])
        i += 2
      } else if ('0123456789'.includes(next)) {
        explanations.push({ token: `\\${next}`, desc: `Backreference to group ${next}` })
        i += 2
      } else {
        explanations.push({ token: `\\${next}`, desc: `Literal "${next}" character` })
        i += 2
      }
      continue
    }

    // Character classes
    if (p[i] === '[') {
      const closeIdx = p.indexOf(']', i + 1)
      if (closeIdx !== -1) {
        const cls = p.slice(i, closeIdx + 1)
        const negated = cls[1] === '^'
        const inner = negated ? cls.slice(2, -1) : cls.slice(1, -1)
        let desc
        if (inner.includes('a-z') && inner.includes('A-Z') && inner.includes('0-9')) {
          desc = negated ? 'Any non-alphanumeric character' : 'Any alphanumeric character'
        } else if (inner === 'a-z') {
          desc = negated ? 'Any non-lowercase letter' : 'Any lowercase letter'
        } else if (inner === 'A-Z') {
          desc = negated ? 'Any non-uppercase letter' : 'Any uppercase letter'
        } else if (inner === '0-9') {
          desc = negated ? 'Any non-digit' : 'Any digit'
        } else {
          desc = `${negated ? 'Any character NOT in' : 'Any character in'} "${inner}"`
        }
        explanations.push({ token: cls, desc })
        i = closeIdx + 1
        continue
      }
    }

    // Groups
    if (p[i] === '(' && p[i + 1] === '?') {
      if (p[i + 2] === ':') {
        explanations.push({ token: '(?:', desc: 'Non-capturing group start' })
        i += 3
        continue
      }
      if (p[i + 2] === '=' ) {
        explanations.push({ token: '(?=', desc: 'Positive lookahead' })
        i += 3
        continue
      }
      if (p[i + 2] === '!') {
        explanations.push({ token: '(?!', desc: 'Negative lookahead' })
        i += 3
        continue
      }
      if (p[i + 2] === '<' && p[i + 3] === '=') {
        explanations.push({ token: '(?<=', desc: 'Positive lookbehind' })
        i += 4
        continue
      }
      if (p[i + 2] === '<' && p[i + 3] === '!') {
        explanations.push({ token: '(?<!', desc: 'Negative lookbehind' })
        i += 4
        continue
      }
    }
    if (p[i] === '(') {
      explanations.push({ token: '(', desc: 'Capturing group start' })
      i++
      continue
    }
    if (p[i] === ')') {
      explanations.push({ token: ')', desc: 'Group end' })
      i++
      continue
    }

    // Quantifiers
    if (p[i] === '*' ) {
      explanations.push({ token: p[i + 1] === '?' ? '*?' : '*', desc: p[i + 1] === '?' ? 'Zero or more (lazy)' : 'Zero or more (greedy)' })
      i += p[i + 1] === '?' ? 2 : 1
      continue
    }
    if (p[i] === '+') {
      explanations.push({ token: p[i + 1] === '?' ? '+?' : '+', desc: p[i + 1] === '?' ? 'One or more (lazy)' : 'One or more (greedy)' })
      i += p[i + 1] === '?' ? 2 : 1
      continue
    }
    if (p[i] === '?') {
      explanations.push({ token: '?', desc: 'Optional (zero or one)' })
      i++
      continue
    }

    // Quantifier {n,m}
    if (p[i] === '{') {
      const closeIdx = p.indexOf('}', i)
      if (closeIdx !== -1) {
        const q = p.slice(i, closeIdx + 1)
        const inner = q.slice(1, -1)
        const parts = inner.split(',')
        let desc
        if (parts.length === 1) {
          desc = `Exactly ${parts[0]} times`
        } else if (parts[1] === '') {
          desc = `${parts[0]} or more times`
        } else {
          desc = `Between ${parts[0]} and ${parts[1]} times`
        }
        explanations.push({ token: q, desc })
        i = closeIdx + 1
        continue
      }
    }

    // Anchors
    if (p[i] === '^') {
      explanations.push({ token: '^', desc: 'Start of string/line' })
      i++
      continue
    }
    if (p[i] === '$') {
      explanations.push({ token: '$', desc: 'End of string/line' })
      i++
      continue
    }

    // Dot
    if (p[i] === '.') {
      explanations.push({ token: '.', desc: 'Any character (except newline)' })
      i++
      continue
    }

    // Alternation
    if (p[i] === '|') {
      explanations.push({ token: '|', desc: 'OR — match either side' })
      i++
      continue
    }

    // Literal character
    explanations.push({ token: p[i], desc: `Literal "${p[i]}"` })
    i++
  }

  return explanations
}

const tokenColors = {
  '\\d': '#f97316', '\\D': '#f97316',
  '\\w': '#8b5cf6', '\\W': '#8b5cf6',
  '\\s': '#06b6d4', '\\S': '#06b6d4',
  '\\b': '#10b981', '\\B': '#10b981',
  '[': '#eab308', ']': '#eab308',
  '(': '#6366f1', ')': '#6366f1',
  '*': '#ef4444', '+': '#ef4444', '?': '#ef4444',
  '{': '#ec4899', '}': '#ec4899',
  '.': '#f43f5e',
  '|': '#14b8a6',
  '^': '#22d3ee', '$': '#22d3ee',
}

const getTokenColor = (token) => {
  if (tokenColors[token]) return tokenColors[token]
  for (const [k, v] of Object.entries(tokenColors)) {
    if (token.startsWith(k)) return v
  }
  return '#94a3b8'
}

export default function regex_visualizer() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [pattern, setPattern] = useState('')
  const [testStr, setTestStr] = useState('Contact us at support@example.com or sales@company.org. Call (555) 123-4567 or +1-800-555-0199.')
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false })
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white text-sm font-mono outline-none focus:border-rose-500/40 transition-all placeholder:text-slate-500"

  const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('')

  const matches = useMemo(() => {
    if (!pattern || !testStr) return []
    try {
      setError('')
      const regex = new RegExp(pattern, flagStr)
      const results = [...testStr.matchAll(regex)]
      return results.map((m, i) => ({
        match: m[0],
        index: m.index,
        length: m[0].length,
        groups: m.slice(1),
        groupNames: m.groups,
      }))
    } catch (e) {
      setError(e.message)
      return []
    }
  }, [pattern, testStr, flagStr])

  const explanations = useMemo(() => explainPattern(pattern), [pattern])

  const toggleFlag = (f) => setFlags(prev => ({ ...prev, [f]: !prev[f] }))

  const loadPreset = (preset) => {
    setPattern(preset.pattern)
    setCopied(false)
  }

  const highlightedTest = useMemo(() => {
    if (!testStr || matches.length === 0) return testStr
    const sorted = [...matches].sort((a, b) => a.index - b.index)
    let result = []
    let lastIdx = 0
    sorted.forEach((m, i) => {
      if (m.index > lastIdx) {
        result.push({ text: testStr.slice(lastIdx, m.index), highlight: false })
      }
      result.push({ text: m.match, highlight: true, matchIndex: i })
      lastIdx = m.index + m.length
    })
    if (lastIdx < testStr.length) {
      result.push({ text: testStr.slice(lastIdx), highlight: false })
    }
    return result
  }, [testStr, matches])

  const copyPattern = () => {
    navigator.clipboard.writeText(pattern)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ToolLayout
      title="Regex Visualizer & Tester"
      desc="Test, debug, and understand regular expressions with live match highlighting and pattern explanation breakdown."
      icon="🔬" iconBg="rgba(244,63,94,0.08)"
      category="dev" slug="regex-visualizer"
      faq={[
        { q: "What are regex flags?", a: "Flags modify how the pattern matches: 'g' (global, all matches), 'i' (case-insensitive), 'm' (multiline), 's' (dot matches newline)." },
        { q: "What is the pattern breakdown?", a: "Each token in your regex is explained — character classes, quantifiers, anchors, groups, and special sequences are all identified." },
        { q: "Are there common presets?", a: "Yes! Click any preset button (email, phone, URL, etc.) to load a working pattern you can study and modify." },
      ]}
      howItWorks={[
        "Enter a regex pattern or choose from common presets.",
        "Type or paste text in the test string area.",
        "Matches are highlighted instantly in the test string.",
        "Review the pattern breakdown to understand each token.",
        "Toggle flags (g, i, m, s) to modify matching behavior.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Regex Visualizer & Tester", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/regex-visualizer/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-2 block">Common Patterns</label>
          <div className="flex flex-wrap gap-2">
            {presets.map(p => (
              <button key={p.name} onClick={() => loadPreset(p)}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white/[0.06] text-slate-500 border border-white/8 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/30 transition-all group relative">
                {p.name}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-xs text-slate-300 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
                  {p.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pattern Input */}
        <div className="bg-white/[0.04] rounded-2xl border border-white/[0.06] p-4 space-y-3">
          <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-500">Pattern</label>
                {pattern && (
                  <button onClick={copyPattern}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                    {copied ? '✓ Copied' : '📋 Copy'}
                  </button>
                )}
              </div>
              <div className="flex items-center">
                <span className="text-slate-500 font-mono text-sm mr-1">/</span>
                <input type="text" value={pattern} onChange={e => { setPattern(e.target.value); setCopied(false) }}
                  className="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder:text-slate-600"
                  placeholder="Enter regex pattern..." />
                <span className="text-slate-500 font-mono text-sm ml-1">/{flagStr}</span>
              </div>
              {error && (
                <p className="text-xs text-red-400 mt-1 font-mono">⚠ {error}</p>
              )}
            </div>
            {/* Flags */}
            <div className="flex gap-1.5 pb-0.5">
              {['g', 'i', 'm', 's'].map(f => (
                <button key={f} onClick={() => toggleFlag(f)}
                  className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition-all ${flags[f] ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' : 'bg-white/[0.06] text-slate-600 border border-white/8'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Flag descriptions */}
          <div className="flex flex-wrap gap-2 text-[10px] text-slate-600">
            <span><b className="text-slate-500">g</b> global</span>
            <span><b className="text-slate-500">i</b> case-insensitive</span>
            <span><b className="text-slate-500">m</b> multiline</span>
            <span><b className="text-slate-500">s</b> dotAll</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left: Test String */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-500">Test String</label>
                {matches.length > 0 && (
                  <span className="px-3 py-1 rounded-lg bg-rose-500/15 text-rose-300 text-xs font-bold border border-rose-500/20">
                    {matches.length} match{matches.length !== 1 ? 'es' : ''}
                  </span>
                )}
              </div>
              <textarea value={testStr} onChange={e => setTestStr(e.target.value)}
                className={`${inputClass} h-40 resize-none`}
                placeholder="Enter text to test against your pattern..." />
            </div>

            {/* Highlighted Output */}
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Highlighted Matches</label>
              <div className="bg-slate-950/60 rounded-xl border border-white/[0.08] p-4 min-h-[80px] font-mono text-sm leading-relaxed">
                {pattern && highlightedTest && typeof highlightedTest !== 'string' ? (
                  highlightedTest.map((part, i) => (
                    part.highlight ? (
                      <mark key={i} className="bg-rose-500/30 text-rose-200 rounded px-0.5 border border-rose-500/40">
                        {part.text}
                      </mark>
                    ) : (
                      <span key={i} className="text-slate-400">{part.text}</span>
                    )
                  ))
                ) : (
                  <span className="text-slate-600 text-xs">
                    {testStr ? 'Enter a pattern to see highlighted matches' : 'Enter test text and a pattern'}
                  </span>
                )}
              </div>
            </div>

            {/* Match Details */}
            {matches.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-2 block">Match Details</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {matches.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <span className="text-[10px] text-slate-600 font-mono w-4 shrink-0">#{i + 1}</span>
                      <code className="text-sm font-mono text-rose-300 flex-1 truncate">"{m.match}"</code>
                      <span className="text-[10px] text-slate-600 font-mono shrink-0">idx:{m.index}</span>
                      <span className="text-[10px] text-slate-600 font-mono shrink-0">len:{m.length}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Pattern Explanation */}
          <div className="space-y-4" ref={resultRef}>
            <label className="text-xs font-semibold text-slate-500">Pattern Breakdown</label>
            {explanations.length > 0 ? (
              <div className="bg-slate-950/60 rounded-2xl border border-white/[0.08] p-4 space-y-1 max-h-[300px] overflow-y-auto">
                {explanations.map((ex, i) => (
                  <div key={i} className="flex items-start gap-3 py-1.5 border-b border-white/[0.04] last:border-0">
                    <code className="text-sm font-mono shrink-0 px-2 py-0.5 rounded-lg"
                      style={{ color: getTokenColor(ex.token), backgroundColor: 'rgba(255,255,255,0.04)' }}>
                      {ex.token}
                    </code>
                    <span className="text-xs text-slate-400 pt-0.5">{ex.desc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-950/60 rounded-2xl border border-white/[0.08] p-8 text-center text-slate-600">
                <div className="text-3xl mb-2">🔍</div>
                <p className="text-sm">Enter a regex pattern to see its breakdown</p>
              </div>
            )}

            {/* Quick Reference */}
            <div className="bg-white/[0.04] rounded-2xl border border-white/[0.06] p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Reference</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                {[
                  ['.', 'Any character'],
                  ['\\d', 'Digit (0-9)'],
                  ['\\w', 'Word char [a-zA-Z0-9_]'],
                  ['\\s', 'Whitespace'],
                  ['^', 'Start of string'],
                  ['$', 'End of string'],
                  ['*', 'Zero or more'],
                  ['+', 'One or more'],
                  ['?', 'Optional'],
                  ['{n,m}', 'Repeat n to m times'],
                  ['[abc]', 'Character class'],
                  ['(abc)', 'Capturing group'],
                  ['a|b', 'Alternation (a or b)'],
                  ['(?:abc)', 'Non-capturing group'],
                  ['(?=abc)', 'Lookahead'],
                  ['(?!abc)', 'Neg. lookahead'],
                ].map(([token, desc]) => (
                  <div key={token} className="flex gap-2">
                    <code className="font-mono text-rose-400 shrink-0">{token}</code>
                    <span className="text-slate-500">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
