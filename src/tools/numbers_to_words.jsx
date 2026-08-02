import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

function convertHundreds(n) {
  if (n === 0) return ''
  if (n < 20) return ones[n]
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : '')
  return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + convertHundreds(n % 100) : '')
}

function convertInternational(num) {
  if (num === 0) return 'zero'
  if (num < 0) return 'minus ' + convertInternational(-num)
  const groups = [
    ['', ''],
    ['thousand', 'thousand'],
    ['million', 'million'],
    ['billion', 'billion'],
    ['trillion', 'trillion'],
    ['quadrillion', 'quadrillion'],
  ]
  const parts = []
  let i = 0
  let temp = Math.abs(num)
  while (temp > 0) {
    const chunk = temp % 1000
    if (chunk !== 0) {
      const word = convertHundreds(chunk)
      parts.unshift(word + (groups[i] ? ' ' + groups[i][1] : ''))
    }
    temp = Math.floor(temp / 1000)
    i++
  }
  return parts.join(', ').trim() || 'zero'
}

function convertIndian(num) {
  if (num === 0) return 'zero'
  if (num < 0) return 'minus ' + convertIndian(-num)
  const parts = []
  let temp = Math.abs(num)
  // Indian grouping: last 3 digits, then groups of 2
  const lastThree = temp % 1000
  temp = Math.floor(temp / 1000)
  if (lastThree !== 0) {
    parts.unshift(convertHundreds(lastThree))
  }
  while (temp > 0) {
    const chunk = temp % 100
    temp = Math.floor(temp / 100)
    if (chunk !== 0) {
      parts.unshift(convertHundreds(chunk) + ' thousand')
    } else if (temp > 0 && parts.length === 0) {
      // keep going
    }
  }
  // Re-do with proper Indian numbering
  return convertIndianFull(num)
}

function convertIndianFull(num) {
  if (num === 0) return 'zero'
  if (num < 0) return 'minus ' + convertIndianFull(-num)
  const abs = Math.floor(num)
  // Break into crore/lakh/thousand
  const crore = Math.floor(abs / 10000000)
  const lakh = Math.floor((abs % 10000000) / 100000)
  const thousand = Math.floor((abs % 100000) / 1000)
  const remainder = abs % 1000
  const parts = []
  if (crore > 0) parts.push(convertHundreds(crore) + ' crore')
  if (lakh > 0) parts.push(convertHundreds(lakh) + ' lakh')
  if (thousand > 0) parts.push(convertHundreds(thousand) + ' thousand')
  if (remainder > 0) parts.push(convertHundreds(remainder))
  return parts.join(' ') || 'zero'
}

export default function NumbersToWords() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('international')
  const [error, setError] = useState('')

  const output = useMemo(() => {
    if (!input.trim()) { setError(''); return '' }
    const trimmed = input.trim()
    // Allow numbers with commas, spaces, decimal
    const cleaned = trimmed.replace(/[, ]/g, '')
    const num = parseFloat(cleaned)
    if (isNaN(num)) { setError('Please enter a valid number.'); return '' }
    if (!Number.isFinite(num)) { setError('Number is too large.'); return '' }
    const intPart = Math.trunc(num)
    const decPart = Math.abs(num) - Math.abs(intPart)
    setError('')
    let result = mode === 'indian' ? convertIndianFull(intPart) : convertInternational(intPart)
    if (decPart > 0) {
      const decStr = decPart.toFixed(10).replace(/0+$/, '').slice(2)
      let decWords = 'point'
      for (const ch of decStr) {
        decWords += ' ' + ones[parseInt(ch)]
      }
      result += ' ' + decWords
    }
    return result.charAt(0).toUpperCase() + result.slice(1)
  }, [input, mode])

  return (
    <ToolLayout
      title="Numbers to Words"
      desc="Convert numbers to English words with Indian or international numbering system."
      icon="🔢" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="numbers-to-words"
      faq={[
        { q: 'What is Numbers to Words?', a: 'A tool that converts any number into its English word representation, supporting both Indian (lakh/crore) and international (million/billion) numbering systems.' },
        { q: 'Does it support decimals?', a: 'Yes. Decimal numbers like 123.45 are converted with the fractional part after "point".' },
        { q: 'What is the Indian numbering system?', a: 'It groups digits in lakhs and crores (e.g., 1,00,00,000 = one crore) instead of millions and billions.' },
      ]}
      howItWorks={[
        'Enter a number (supports decimals, commas, and negatives).',
        'Choose between Indian (lakh/crore) and International (million/billion) systems.',
        'See the word representation update instantly.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Numbers to Words", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/numbers-to-words/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Mode toggle */}
        <div className="flex gap-2">
          {['international', 'indian'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 border-2 ${
                mode === m
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
                  : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:border-white/[0.15]'
              }`}>
              {m === 'international' ? '🌍 International (M/B/T)' : '🇮🇳 Indian (L/Cr)'}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Enter a Number</label>
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder="e.g. 1234567 or -1,23,456.78"
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-mono text-lg outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]" />
          {error && <p className="text-red-400 text-xs mt-2 font-semibold">{error}</p>}
        </div>

        {/* Output */}
        {output ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Result</h3>
            </div>
            <p className="text-white text-lg font-semibold leading-relaxed">{output}</p>
            <button onClick={() => navigator.clipboard.writeText(output)}
              className="mt-3 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              📋 Copy to clipboard
            </button>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔢</div>
            <p className="text-sm text-slate-600 font-medium">Enter a number to see its word form</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
