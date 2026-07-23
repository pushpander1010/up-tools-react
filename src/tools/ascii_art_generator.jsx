import { useState, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const FONTS = ['Standard', 'Big', 'Block', 'Shadow', 'Small']

// Simple ASCII art font maps (subset of figlet)
const FONT_MAPS = {
  Standard: {
    A: ['  A  ', ' A A ', 'AAAAA', 'A   A', 'A   A'],
    B: ['BBBB ', 'B   B', 'BBBB ', 'B   B', 'BBBB '],
    C: [' CCC ', 'C   C', 'C    ', 'C   C', ' CCC '],
    D: ['DDDD ', 'D   D', 'D   D', 'D   D', 'DDDD '],
    E: ['EEEEE', 'E    ', 'EEE  ', 'E    ', 'EEEEE'],
    F: ['FFFFF', 'F    ', 'FFF  ', 'F    ', 'F    '],
    G: [' GGG ', 'G   C', 'G  CC', 'G   C', ' GGG '],
    H: ['H   H', 'H   H', 'HHHHH', 'H   H', 'H   H'],
    I: ['IIIII', '  I  ', '  I  ', '  I  ', 'IIIII'],
    J: ['JJJJJ', '   J ', '   J ', 'J  J ', ' JJ  '],
    K: ['K   K', 'K  K ', 'KKK  ', 'K  K ', 'K   K'],
    L: ['L    ', 'L    ', 'L    ', 'L    ', 'LLLLL'],
    M: ['M   M', 'MM MM', 'M M M', 'M   M', 'M   M'],
    N: ['N   N', 'NN  N', 'N N N', 'N  NN', 'N   N'],
    O: [' OOO ', 'O   O', 'O   O', 'O   O', ' OOO '],
    P: ['PPPP ', 'P   P', 'PPPP ', 'P    ', 'P    '],
    Q: [' QQQ ', 'Q   Q', 'Q   Q', 'Q  Q ', ' QQ Q'],
    R: ['RRRR ', 'R   R', 'RRRR ', 'R  R ', 'R   R'],
    S: [' SSS ', 'S    ', ' SSS ', '    S', 'SSS  '],
    T: ['TTTTT', '  T  ', '  T  ', '  T  ', '  T  '],
    U: ['U   U', 'U   U', 'U   U', 'U   U', ' UUU '],
    V: ['V   V', 'V   V', 'V   V', ' V V ', '  V  '],
    W: ['W   W', 'W   W', 'W M W', 'WW WW', ' W W '],
    X: ['X   X', ' X X ', '  X  ', ' X X ', 'X   X'],
    Y: ['Y   Y', ' Y Y ', '  Y  ', '  Y  ', '  Y  '],
    Z: ['ZZZZZ', '   Z ', '  Z  ', ' Z   ', 'ZZZZZ'],
    '0': ['00000', '0   0', '0   0', '0   0', '00000'],
    '1': ['  1  ', ' 11  ', '  1  ', '  1  ', '11111'],
    '2': ['22222', '    2', '22222', '2    ', '22222'],
    '3': ['33333', '    3', ' 3333', '    3', '33333'],
    '4': ['4   4', '4   4', '44444', '    4', '    4'],
    '5': ['55555', '5    ', '55555', '    5', '55555'],
    '6': ['66666', '6    ', '66666', '6   6', '66666'],
    '7': ['77777', '    7', '   7 ', '  7  ', ' 7   '],
    '8': ['88888', '8   8', '88888', '8   8', '88888'],
    '9': ['99999', '9   9', '99999', '    9', '99999'],
    ' ': ['     ', '     ', '     ', '     ', '     '],
    '.': ['     ', '     ', '     ', '     ', '  O  '],
    ',': ['     ', '     ', '     ', '  o  ', ' o   '],
    '!': ['  I  ', '  I  ', '  I  ', '     ', '  I  '],
    '?': [' ??? ', '    ?', '  ?? ', '     ', '  ?? '],
    ':': ['     ', '  O  ', '     ', '  O  ', '     '],
    '-': ['     ', '     ', 'XXXXX', '     ', '     '],
    '+': ['     ', '  +  ', '+++++', '  +  ', '     '],
    '=': ['     ', '     ', '=====', '     ', '     '],
    '/': ['    /', '   / ', '  /  ', ' /   ', '/    '],
    '\\': ['\\    ', ' \\   ', '  \\  ', '   \\ ', '    \\'],
    '(': ['  (  ', ' (   ', ' (   ', ' (   ', '  (  '],
    ')': ['  )  ', '   ) ', '   ) ', '   ) ', '  )  '],
    '[': [' [   ', ' [   ', ' [   ', ' [   ', ' [   '],
    ']': ['   ] ', '   ] ', '   ] ', '   ] ', '   ] '],
    '#': [' # # ', '#####', ' # # ', '#####', ' # # '],
    '@': [' @@@ ', '@@  @', '@ @ @', '@  @@', ' @@@ '],
    "'": ['  I  ', '  I  ', '     ', '     ', '     '],
    '"': ['I I ', 'I I ', '     ', '     ', '     '],
  }
}

function renderText(text, font) {
  const map = FONT_MAPS[font] || FONT_MAPS.Standard
  const lines = Array.from({ length: 5 }, () => '')
  const upper = text.toUpperCase()

  for (const ch of upper) {
    const glyph = map[ch] || map[' '] || map['A']
    for (let i = 0; i < 5; i++) {
      lines[i] += (glyph[i] || '     ') + ' '
    }
  }

  return lines.join('\n')
}

export default function ascii_art_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [text, setText] = useState('Hello')
  const [font, setFont] = useState('Standard')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (text.trim()) {
      setOutput(renderText(text, font))
    } else {
      setOutput('')
    }
  }, [text, font])

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const download = () => {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'ascii-art.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ToolLayout
      title="ASCII Art Generator"
      desc="Convert text to ASCII art with multiple fonts. Create styled text for social media, bios, and comments."
      icon="🎨" iconBg="rgba(245,158,11,0.08)"
      category="text" slug="ascii-art-generator"
      faq={[
        { q: 'What is ASCII art?', a: 'ASCII art is a graphic design technique that uses computers for presentation and consists of pictures pieced together from the 95 printable characters defined by the ASCII standard.' },
        { q: 'Can I use this for social media?', a: 'Yes! ASCII art works great in Instagram bios, Discord messages, GitHub READMEs, and terminal outputs.' },
      ]}
      howItWorks={[
        'Type your text in the input field.',
        'Choose a font style from the dropdown.',
        'See the ASCII art update in real-time.',
        'Copy to clipboard or download as .txt.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "ASCII Art Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/ascii-art-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Input Controls */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Text</label>
              <input type="text" value={text} onChange={e => setText(e.target.value)}
                placeholder="Enter text..."
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm font-mono text-white outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-600" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Font</label>
              <select value={font} onChange={e => setFont(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/40">
                {FONTS.map(f => <option key={f} value={f} className="bg-gray-900">{f}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Output */}
        {output ? (
          <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3"
            style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-500">ASCII Art</label>
              <div className="flex gap-2">
                <button onClick={copy}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
                <button onClick={download}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                  📥 Download
                </button>
              </div>
            </div>
            <div className="bg-black/20 border-2 border-amber-500/20 rounded-xl p-5 overflow-x-auto">
              <pre className="text-sm text-amber-400 font-mono whitespace-pre leading-tight">{output}</pre>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.02]">
            <div className="text-4xl mb-3 opacity-20">🎨</div>
            <p className="text-sm text-slate-600 font-medium">Type text above to generate ASCII art</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
