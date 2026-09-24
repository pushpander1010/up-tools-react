import { useState, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function upi_qr_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [upiId, setUpiId] = useState('')
  const [payeeName, setPayeeName] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [generated, setGenerated] = useState(false)
  const [qrImg, setQrImg] = useState('')
  const [upiString, setUpiString] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(null)

  // Read query params on mount
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.has('pa')) { setUpiId(q.get('pa')); }
    if (q.has('pn')) { setPayeeName(q.get('pn')); }
    if (q.has('am')) { setAmount(q.get('am')); }
    if (q.has('tn')) { setNote(q.get('tn')); }
  }, [])

  const generate = useCallback(async () => {
    setError('')
    if (!upiId.trim()) { setError('Please enter a UPI ID.'); return }
    if (!upiId.includes('@')) { setError('Invalid UPI ID format. Use username@bank.'); return }

    let str = 'upi://pay?pa=' + encodeURIComponent(upiId.trim()) + '&cu=INR'
    if (payeeName.trim()) str += '&pn=' + encodeURIComponent(payeeName.trim())
    if (note.trim()) str += '&tn=' + encodeURIComponent(note.trim())
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      str += '&am=' + encodeURIComponent(parseFloat(amount).toFixed(2))
    }
    setUpiString(str)

    // Preload the QR image, then reveal (avoids drawing to an unmounted canvas)
    try {
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(str)}&bgcolor=ffffff&color=000000&margin=10`
      const img = new Image()
      img.onload = () => {
        setQrImg(url)
        setGenerated(true)
        setTimeout(() => jumpTo(), 50)
      }
      img.onerror = () => setError('Error generating QR code. Check your connection and retry.')
      img.src = url
    } catch (e) { setError('Error: ' + e.message) }
  }, [upiId, payeeName, amount, note, jumpTo])

  const download = useCallback(async () => {
    if (!qrImg) return
    try {
      const res = await fetch(qrImg)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.download = `upi_qr_${upiId.trim().replace(/[^a-zA-Z0-9]/g, '_') || 'code'}.png`
      a.href = url
      a.click()
      URL.revokeObjectURL(url)
    } catch { setError('Download failed. Long-press the QR image to save it.') }
  }, [qrImg, upiId])

  const copy = useCallback(async (text, label) => {
    try { await navigator.clipboard.writeText(text) } catch { /* fallback */ }
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const reset = useCallback(() => {
    setUpiId(''); setPayeeName(''); setAmount(''); setNote('')
    setGenerated(false); setQrImg(''); setUpiString(''); setError('')
    window.history.replaceState(null, '', window.location.pathname)
  }, [])

  return (
    <ToolLayout
      title="Free UPI QR Code Generator – GPay, PhonePe, Paytm"
      desc="Free UPI QR code generator for India: make a scan-and-pay QR from your UPI ID with optional amount and note. Works with GPay, PhonePe, Paytm, BHIM. No signup."
      icon="📱" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="upi-qr-generator"
      faq={[
        { q: 'What is a UPI QR code?', a: 'A scannable code containing your UPI ID and optional amount and note. When a customer scans it with GPay, PhonePe, Paytm, or BHIM, the payment details are pre-filled — they just tap pay.' },
        { q: 'Which apps can scan my UPI QR code?', a: 'All major Indian UPI apps: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay, and WhatsApp Pay.' },
        { q: 'Is the amount mandatory?', a: 'No. Generate a QR with just your UPI ID and the payer enters the amount. Set a fixed amount for fixed-price items like a ₹100 product.' },
        { q: 'Should I add my name to the QR code?', a: 'Yes, adding your shop or personal name builds trust — payers see the name before confirming payment, which reduces failed or wrong payments.' },
        { q: 'Is it safe to share my UPI QR code publicly?', a: 'Yes. A UPI QR only contains your payment address — it cannot be used to withdraw money. Never share UPI PINs or OTPs with anyone.' },
        { q: 'Is this UPI QR generator free?', a: 'Yes, completely free with no sign-up and unlimited QR codes. Your details stay in your browser.' },
      ]}
      howItWorks={[
        'Enter your UPI ID in the format username@bank, plus your name (optional).',
        'Optionally set a fixed amount and a payment note.',
        'Click Generate to create the QR code.',
        'Download, print, or share the QR code image.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'Free UPI QR Code Generator', applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any (Web Browser)',
        url: 'https://www.uptools.in/upi-qr-generator/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      }}
    >
      <div className="max-w-lg mx-auto space-y-5">
        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">UPI ID</label>
            <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)}
              placeholder="e.g., john@okicici"
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500/40 transition-all placeholder:text-slate-600" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">Payee Name (Optional)</label>
            <input type="text" value={payeeName} onChange={e => setPayeeName(e.target.value)}
              placeholder="e.g., John's Store"
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500/40 transition-all placeholder:text-slate-600" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">Amount (₹) — Optional</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="e.g., 100" min="1" step="0.01"
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500/40 transition-all placeholder:text-slate-600" />
            <div className="flex gap-2 mt-2">
              {[10, 50, 100, 500, 1000].map(v => (
                <button key={v} onClick={() => setAmount(String(v))}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/15 transition-all">
                  ₹{v}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">Note (Optional)</label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)}
              placeholder="e.g., Payment for groceries"
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500/40 transition-all placeholder:text-slate-600" />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">❌ {error}</div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <button onClick={generate}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm hover:from-green-400 hover:to-emerald-400 transition-all active:scale-[0.98]">
            📱 Generate QR Code
          </button>
          <button onClick={reset}
            className="px-5 py-3.5 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
            Reset
          </button>
        </div>

        {/* Result */}
        {generated && (
          <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6 text-center space-y-4"
            style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl p-3 shadow-2xl">
                <img src={qrImg} alt="UPI payment QR code — scan with GPay, PhonePe, or Paytm" width={250} height={250} className="block rounded-xl" style={{ width: 220, height: 220 }} />
              </div>
            </div>
            <div className="font-mono text-xs text-slate-400 break-all bg-black/20 rounded-xl p-3">{upiString}</div>
            {amount && !isNaN(amount) ? (
              <div className="text-lg font-bold text-green-400">₹{Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            ) : (
              <div className="text-xs text-slate-400">No fixed amount — user enters when scanning</div>
            )}
            <div className="flex gap-2 justify-center flex-wrap">
              <button onClick={download}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400 transition-all">
                📥 Download
              </button>
              <button onClick={() => copy(upiString, 'upi')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${copied === 'upi' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                {copied === 'upi' ? '✓ Copied' : '📋 Copy UPI String'}
              </button>
            </div>
          </div>
        )}

        {!generated && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.02]">
            <div className="text-4xl mb-3 opacity-20">📱</div>
            <p className="text-sm text-slate-600 font-medium">Enter UPI details and click Generate</p>
          </div>
        )}

        <p className="text-xs text-slate-600 text-center pt-1">
          More free QR tools:{' '}
          <a className="text-green-400 hover:text-green-300" href="/qr-generator/">QR Code Generator</a>,{' '}
          <a className="text-green-400 hover:text-green-300" href="/qr-reader/">QR Code Scanner</a>, and{' '}
          <a className="text-green-400 hover:text-green-300" href="/upi-validator/">UPI ID Validator</a>.
        </p>
      </div>
    </ToolLayout>
  )
}
