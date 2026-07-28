import { useState, useRef, useEffect, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

// ── Barcode encoding tables ──

// CODE128 character set and encoding patterns
const CODE128_PATTERNS = [
  '11011001100','11001101100','11001100110','10010011000','10010001100','10001001100','10011001000','10011000100','10001100100','11001001000',
  '11001000100','11000100100','10110011100','10011011100','10011001110','10111001100','10011101100','10011100110','11001110010','11001011100',
  '11001001110','11011100100','11001110100','11101101110','11101001100','11100101100','11100100110','11101100100','11100110100','11100110010',
  '11011011000','11011000110','11000110110','10100011000','10001011000','10001000110','10110001000','10001101000','10001100010','11010001000',
  '11000101000','11000100010','10110111000','10110001110','10001101110','10111011000','10111000110','10001110110','11101110110','11010001110',
  '11000101110','11011101000','11011100010','11011101110','11101011000','11101000110','11100010110','11101101000','11101100010','11100011010',
  '11101111010','11001000010','11110001010','10100110000','10100001100','10010110000','10010000110','10000101100','10000100110','10110010000',
  '10110000100','10011010000','10011000010','10000110100','10000110010','11000010010','11001010000','11110111010','11000010100','10001111010',
  '10100111100','10010111100','10010011110','10111100100','10011110100','10011110010','11110100100','11110010100','11110010010','11011011110',
  '11011110110','11110110110','10101111000','10100011110','10001011110','10111101000','10111100010','11110101000','11110100010','10111011110',
  '10111101110','11101011110','11110101110','11010000100','11010010000','11010011100','11000111010','11','11011','110011',
  '1100011','1010','1111011101011',
]

// Code128B character map (32-127 mapped to indices 0-94)
const CODE128B_CHARS = {}
for (let i = 0; i < 95; i++) CODE128B_CHARS[String.fromCharCode(i + 32)] = i

const CODE128_START_B = 104
const CODE128_STOP = 106

function encodeCode128(text) {
  if (!text) return ''
  let checksum = CODE128_START_B
  const patterns = [CODE128_PATTERNS[CODE128_START_B]]
  for (let i = 0; i < text.length; i++) {
    const code = CODE128B_CHARS[text[i]]
    if (code === undefined) continue
    checksum += code * (i + 1)
    patterns.push(CODE128_PATTERNS[code])
  }
  checksum = checksum % 103
  patterns.push(CODE128_PATTERNS[checksum])
  patterns.push(CODE128_PATTERNS[CODE128_STOP])
  return patterns.join('')
}

// EAN-13 encoding
const EAN_L = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011']
const EAN_G = ['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111']
const EAN_R = ['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100']
const EAN_PARITY = [[0,0,0,0,0,0],[0,0,1,0,1,1],[0,0,1,1,0,1],[0,0,1,1,1,0],[0,1,0,0,1,1],[0,1,1,0,0,1],[0,1,1,1,1,0],[0,1,0,1,0,1],[0,1,0,1,1,0],[0,1,1,0,1,0]]

function computeEAN13Check(digits) {
  let sum = 0
  for (let i = 0; i < 12; i++) sum += digits[i] * (i % 2 === 0 ? 1 : 3)
  return (10 - (sum % 10)) % 10
}

function encodeEAN13(code) {
  const digits = code.split('').map(Number)
  while (digits.length < 12) digits.unshift(0)
  if (digits.length === 12) digits.push(computeEAN13Check(digits))
  if (digits.length !== 13) return ''

  let result = '101' // start
  const parity = EAN_PARITY[digits[0]]
  for (let i = 0; i < 6; i++) {
    result += parity[i] === 0 ? EAN_L[digits[i + 1]] : EAN_G[digits[i + 1]]
  }
  result += '01010' // center
  for (let i = 0; i < 6; i++) {
    result += EAN_R[digits[i + 7]]
  }
  result += '101' // end
  return result
}

// UPC-A (simplified: 12 digits, wraps to EAN-13 with leading 0)
function encodeUPCA(code) {
  const digits = code.split('').map(Number)
  while (digits.length < 11) digits.unshift(0)
  let sum = 0
  for (let i = 0; i < 11; i++) sum += digits[i] * (i % 2 === 0 ? 3 : 1)
  if (digits.length === 11) digits.push((10 - (sum % 10)) % 10)
  return encodeEAN13(digits.join(''))
}

// Code 39
const CODE39_CHARS = {
  'A':'000110100','B':'100100100','C':'010100100','D':'001100100','E':'000110100',
  'F':'101100000','G':'011100000','H':'000111100','I':'100110000','J':'010110000',
  'K':'000101100','L':'100010100','M':'010010100','N':'001010100','O':'000110100',
  'P':'101001000','Q':'011001000','R':'001101000','S':'100010010','T':'010010010',
  'U':'001010010','V':'100001010','W':'010001010','X':'001001010','Y':'101010000',
  'Z':'011010000','-': '000100100','.': '100000100',' ': '001000100','$': '001001000',
  '/': '000101010','+': '001010010','%': '010001010','*':'001010100',
  '0':'000110100','1':'100100100','2':'010100100','3':'001100100','4':'000110100',
  '5':'101100000','6':'011100000','7':'000111100','8':'100110000','9':'010110000',
}

function encodeCode39(text) {
  const upper = text.toUpperCase()
  let result = CODE39_CHARS['*'] || '001010100'
  for (const ch of upper) {
    if (CODE39_CHARS[ch]) {
      result += '0' + CODE39_CHARS[ch]
    }
  }
  result += '0' + (CODE39_CHARS['*'] || '001010100')
  return result
}

function renderBarcode(canvas, barcodeBits) {
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  if (!barcodeBits) return

  const bits = barcodeBits.split('')
  const barWidth = Math.max(1, Math.floor(W / bits.length))
  const startX = Math.floor((W - bits.length * barWidth) / 2)

  ctx.fillStyle = '#000000'
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === '1') {
      ctx.fillRect(startX + i * barWidth, 10, barWidth, H - 30)
    }
  }
}

export default function BarcodeGenerator() {
  const canvasRef = useRef(null)
  const [text, setText] = useState('')
  const [format, setFormat] = useState('CODE128')
  const [error, setError] = useState('')
  const [barcodeBits, setBarcodeBits] = useState('')
  const [showText, setShowText] = useState(true)

  const generate = useCallback(() => {
    setError('')
    let bits = ''
    if (!text.trim()) { setError('Enter text or numbers to encode.'); setBarcodeBits(''); return }

    try {
      switch (format) {
        case 'CODE128':
          bits = encodeCode128(text)
          break
        case 'EAN-13':
          if (!/^\d{12,13}$/.test(text)) { setError('EAN-13 requires 12-13 digits.'); setBarcodeBits(''); return }
          bits = encodeEAN13(text)
          break
        case 'UPC-A':
          if (!/^\d{11,12}$/.test(text)) { setError('UPC-A requires 11-12 digits.'); setBarcodeBits(''); return }
          bits = encodeUPCA(text)
          break
        case 'CODE39':
          bits = encodeCode39(text)
          break
        default:
          setError('Unknown format.')
      }
    } catch {
      setError('Failed to encode. Check your input.')
    }

    setBarcodeBits(bits)
  }, [text, format])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && barcodeBits) {
      canvas.width = 500
      canvas.height = 150
      renderBarcode(canvas, barcodeBits)
    }
  }, [barcodeBits, showText])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `barcode-${format.toLowerCase()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <ToolLayout
      title="Barcode Generator"
      desc="Generate CODE128, EAN-13, UPC-A and Code 39 barcodes. Download as PNG."
      icon="📊" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="barcode-generator"
      faq={[
        { q: 'What barcode formats are supported?', a: 'CODE128 (text & numbers), EAN-13 (12-13 digits), UPC-A (11-12 digits), and Code 39 (uppercase letters, digits, and some symbols).' },
        { q: 'Can I download the barcode?', a: 'Yes! Click the Download button to save the barcode as a PNG image.' },
      ]}
      howItWorks={[
        'Select your barcode format.',
        'Enter the text or numbers to encode.',
        'The barcode is generated on a canvas.',
        'Download as PNG when ready.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Barcode Generator", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/barcode-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          <select value={format} onChange={e => { setFormat(e.target.value); setBarcodeBits(''); setError('') }}
            className="bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none">
            <option value="CODE128">CODE128</option>
            <option value="EAN-13">EAN-13</option>
            <option value="UPC-A">UPC-A</option>
            <option value="CODE39">Code 39</option>
          </select>
          <input type="text" value={text} onChange={e => setText(e.target.value)}
            className="flex-1 min-w-[200px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/50"
            placeholder={format === 'CODE128' ? 'Enter text or numbers...' : format === 'CODE39' ? 'UPPERCASE TEXT...' : 'Enter digits only...'}
          />
          <button className="glow-btn text-sm px-5 py-2.5 rounded-xl font-semibold" onClick={generate}>
            Generate
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 text-sm text-red-400">{error}</div>
        )}

        {/* Canvas output */}
        {barcodeBits && (
          <div className="bg-white border border-white/[0.08] rounded-2xl p-4">
            <div className="flex justify-center">
              <canvas ref={canvasRef} className="max-w-full" />
            </div>
            {showText && text && (
              <div className="text-center text-sm font-mono text-slate-700 mt-2">{text}</div>
            )}
          </div>
        )}

        {/* Actions */}
        {barcodeBits && (
          <div className="flex gap-3">
            <button onClick={handleDownload} className="glow-btn text-xs px-4 py-2 rounded-xl font-semibold">
              ⬇ Download PNG
            </button>
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <input type="checkbox" checked={showText} onChange={e => setShowText(e.target.checked)}
                className="rounded border-white/20 bg-white/[0.06]" />
              Show text below barcode
            </label>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
