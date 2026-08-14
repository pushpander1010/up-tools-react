import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

// Each row of the ASCII flag. Characters represent the tricolor:
// 'S' = saffron, 'W' = white, 'G' = green, '.' = empty, '#' = chakra/outline
const PATTERNS = {
  'flag-simple': {
    label: 'Tricolor Flag',
    rows: [
      'SSSSSSSSSSSSSSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSSSSSSSSSSSSSS',
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      'GGGGGGGGGGGGGGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGGGGGGGGGGGGGG',
    ],
  },
  'flag-chakra': {
    label: 'Flag with Chakra',
    rows: [
      'SSSSSSSSSSSSSSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSSSSSSSSSSSSSS',
      'WWWWWWWWW###########WWWWWWWWW',
      'WWWWWWWW##WWWWWWWWW##WWWWWWWW',
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      'WWWWWWWWW###########WWWWWWWWW',
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      'GGGGGGGGGGGGGGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGGGGGGGGGGGGGG',
    ],
  },
  'flag-wide': {
    label: 'Wide Flag',
    rows: [
      'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
    ],
  },
}

const COLORS = {
  S: '#FF9933',
  W: '#FFFFFF',
  G: '#138808',
  '#': '#000080',
}

function renderPattern(rows, char) {
  const map = { S: char || '█', W: char || '█', G: char || '█', '#': char || '█' }
  return rows.map(row => row.split('').map(c => map[c] || ' ').join('')).join('\n')
}

const PRESETS = [
  { name: 'JAI HIND', text: 'JAI HIND', font: 'standard' },
  { name: 'INDIA', text: 'INDIA', font: 'standard' },
  { name: '🇮🇳', text: 'BHARAT', font: 'standard' },
]

function asciiWord(word, font) {
  // compact block font
  const letters = {
    A: [' ██ ', '█ ██', '████', '█  █'],
    B: ['███', '█ ██', '███', '█ ██'],
    C: [' ███', '█', '█', ' ███'],
    D: ['███ ', '█  █', '█  █', '███ '],
    E: ['████', '███', '█', '████'],
    F: ['████', '███', '█', '█'],
    G: [' ████', '█', '█ ███', ' ████'],
    H: ['█  █', '████', '█  █', '█  █'],
    I: ['███', ' █ ', ' █ ', '███'],
    J: ['  ███', '   █', '█  █', ' ██ '],
    K: ['█  █', '██ ', '█ █', '█  █'],
    L: ['█', '█', '█', '████'],
    M: ['█   █', '██ ██', '█ █ █', '█   █'],
    N: ['█   █', '██  █', '█ █ █', '█  ██'],
    O: [' ███ ', '█   █', '█   █', ' ███ '],
    P: ['███ ', '█  █', '███ ', '█   '],
    Q: [' ███ ', '█   █', '█  █ ', ' ██ █'],
    R: ['███ ', '█  █', '███ ', '█  █'],
    S: [' ████', '██', '  ██', '████ '],
    T: ['█████', '  █  ', '  █  ', '  █  '],
    U: ['█   █', '█   █', '█   █', ' ███ '],
    V: ['█   █', '█   █', ' █ █ ', '  █  '],
    W: ['█   █', '█ █ █', '██ ██', '█   █'],
    X: ['█   █', ' █ █ ', '  █  ', ' █ █ '],
    Y: ['█   █', ' █ █ ', '  █  ', '  █  '],
    Z: ['█████', '  █  ', ' █   ', '█████'],
    ' ': ['  ', '  ', '  ', '  '],
  }
  const h = 4
  const lines = Array(h).fill('')
  for (const ch of word) {
    const l = letters[ch] || letters[' ']
    for (let r = 0; r < h; r++) lines[r] += (l[r] || '').padEnd(6, ' ')
  }
  return lines.join('\n')
}

export default function indian_flag_ascii_art() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [pattern, setPattern] = useState('flag-chakra')
  const [char, setChar] = useState('█')
  const [copied, setCopied] = useState(false)
  const [customText, setCustomText] = useState('JAI HIND')

  const flagArt = renderPattern(PATTERNS[pattern].rows, char)
  const wordArt = asciiWord((customText || 'JAI HIND').toUpperCase(), 'standard')

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const download = (text, name) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const link = document.createElement('a')
    link.download = name
    link.href = URL.createObjectURL(blob)
    link.click()
    setTimeout(() => URL.revokeObjectURL(link.href), 1000)
  }

  return (
    <ToolLayout
      title="Indian Flag ASCII Art"
      desc="Generate Indian flag ASCII art and big patriotic text for WhatsApp, Discord, and terminals. Copy one-click or download as a .txt file."
      icon="🎨" iconBg="rgba(255,153,51,0.10)"
      category="text" slug="indian-flag-ascii-art"
      faq={[
        { q: 'What is Indian Flag ASCII Art?', a: 'A free generator that turns the Indian tricolor flag and patriotic words into ASCII art you can paste anywhere.' },
        { q: 'Where can I use it?', a: 'Anywhere text works — WhatsApp status, Discord, Instagram bios, comments, or a terminal.' },
        { q: 'Can I change the fill character?', a: 'Yes — swap the block character (█) for any symbol like #, *, or @.' },
      ]}
      howItWorks={[
        'Pick a flag pattern or type your own patriotic word.',
        'Choose a fill character if you want something other than blocks.',
        'Copy the result or download it as a .txt file.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Indian Flag ASCII Art", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/indian-flag-ascii-art/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Controls */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Flag Pattern</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PATTERNS).map(([key, p]) => (
                <button key={key} onClick={() => setPattern(key)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${pattern === key ? 'bg-indigo-600 text-white' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] border border-white/[0.08]'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Fill Character</label>
            <div className="flex flex-wrap gap-2">
              {['█', '#', '*', '@', '■'].map(c => (
                <button key={c} onClick={() => setChar(c)}
                  className={`w-11 h-11 rounded-xl text-xl font-bold flex items-center justify-center transition-all ${char === c ? 'bg-indigo-600 text-white' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] border border-white/[0.08]'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Flag art */}
        <div ref={resultRef} className="rounded-3xl border-2 border-white/[0.08] bg-black/30 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">{PATTERNS[pattern].label}</h3>
          </div>
          <pre className="font-mono text-xs sm:text-sm leading-tight overflow-x-auto whitespace-pre" style={{ color: '#e2e8f0' }}>{flagArt}</pre>
          <div className="flex flex-wrap gap-3 pt-1">
            <button onClick={() => { jumpTo(); copy(flagArt) }} className="px-4 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg text-sm">
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
            <button onClick={() => download(flagArt, 'indian-flag-ascii.txt')} className="px-4 py-2.5 rounded-xl font-bold text-white bg-white/[0.08] border border-white/[0.1] hover:bg-white/[0.14] transition-all text-sm">
              ⬇ Download .txt
            </button>
          </div>
        </div>

        {/* Word art */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Patriotic Text Art</h3>
          <input value={customText} onChange={e => setCustomText(e.target.value)} maxLength={12}
            placeholder="JAI HIND"
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400" />
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button key={p.name} onClick={() => setCustomText(p.text)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] border border-white/[0.08]">
                {p.name}
              </button>
            ))}
          </div>
          <pre className="font-mono text-xs sm:text-sm leading-tight overflow-x-auto whitespace-pre bg-black/30 border border-white/[0.06] rounded-xl p-4" style={{ color: '#e2e8f0' }}>{wordArt}</pre>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => copy(wordArt)} className="px-4 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg text-sm">
              📋 Copy
            </button>
            <button onClick={() => download(wordArt, 'patriotic-text.txt')} className="px-4 py-2.5 rounded-xl font-bold text-white bg-white/[0.08] border border-white/[0.1] hover:bg-white/[0.14] transition-all text-sm">
              ⬇ Download .txt
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
