import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/
const normalizePan = v => (v || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
const normalizeAadhaar = v => (v || '').replace(/\D/g, '').slice(0, 12)
const maskValue = (v, keep = 4) => v ? '•'.repeat(Math.max(0, v.length - keep)) + v.slice(-keep) : '-'

const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

export default function pan_aadhaar_link_status() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [pan, setPan] = useState('')
  const [aadhaar, setAadhaar] = useState('')
  const [mask, setMask] = useState(false)

  const nPan = normalizePan(pan)
  const nAadhaar = normalizeAadhaar(aadhaar)
  const panOk = PAN_RE.test(nPan)
  const aadhaarOk = nAadhaar.length === 12
  const ready = panOk && aadhaarOk

  const showPan = mask ? maskValue(nPan) : (nPan || '-')
  const showAadhaar = mask ? maskValue(nAadhaar) : (nAadhaar || '-')

  let msg = 'Enter your details to validate format.'
  if (nPan || nAadhaar) msg = ready ? 'Looks good. Open the official portal to check status.' : 'Fix invalid fields before proceeding.'

  const handleCopyPan = useCallback(async () => { if (nPan) await navigator.clipboard.writeText(nPan) }, [nPan])
  const handleCopyAadhaar = useCallback(async () => { if (nAadhaar) await navigator.clipboard.writeText(nAadhaar) }, [nAadhaar])

  return (
    <ToolLayout
      title="PAN–Aadhaar Link Status Checker (Guide)"
      desc="Validate PAN/Aadhaar format and jump to the official Income Tax portal to check link status."
      icon="🆔" iconBg="rgba(234,179,8,0.08)"
      category="finance" slug="pan-aadhaar-link-status"
      faq={[
        { q: 'Does this tool check status directly?', a: 'No. This tool validates format and guides you to the official Income Tax portal to check status securely.' },
        { q: 'Is my PAN or Aadhaar stored?', a: 'No. Everything runs in your browser. Nothing is sent to UpTools servers.' }
      ]}
      howItWorks={['Enter your PAN and Aadhaar numbers.', 'Validate format locally.', 'Open the official portal to check link status.']}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "PAN–Aadhaar Link Status Checker (Guide)", applicationCategory: "FinanceApplication",
        url: "https://www.uptools.in/pan-aadhaar-link-status/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6 sm:p-8 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-1">PAN (10 characters)</label>
            <input className={inputClass} value={pan} onChange={e => setPan(normalizePan(e.target.value))}
              placeholder="ABCDE1234F" maxLength={10} />
            <div className="text-xs text-slate-500 mt-1">{nPan ? (panOk ? 'Valid PAN format' : 'Invalid PAN format') : '-'}</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-1">Aadhaar (12 digits)</label>
            <input className={inputClass} value={aadhaar} onChange={e => setAadhaar(normalizeAadhaar(e.target.value))}
              placeholder="XXXX XXXX XXXX" maxLength={12} />
            <div className="text-xs text-slate-500 mt-1">{nAadhaar ? (aadhaarOk ? 'Valid Aadhaar length' : 'Aadhaar must be 12 digits') : '-'}</div>
          </div>

          <label className="flex items-center gap-3 text-sm text-slate-400 cursor-pointer">
            <input type="checkbox" checked={mask} onChange={e => setMask(e.target.checked)}
              className="w-4 h-4 rounded bg-white/[0.06] border-white/8" />
            Mask PAN/Aadhaar on screen
          </label>

          <div className="flex gap-2 pt-2">
            <button onClick={handleCopyPan}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white transition-all">
              📋 Copy PAN
            </button>
            <button onClick={handleCopyAadhaar}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white transition-all">
              📋 Copy Aadhaar
            </button>
            <button onClick={() => { setPan(''); setAadhaar(''); setMask(false) }}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white transition-all ml-auto">
              Clear
            </button>
          </div>
        </div>

        <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
          style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Status guidance</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
              <span className="text-sm text-slate-400">Readiness</span>
              <span className={`text-sm font-bold ${ready ? 'text-indigo-400' : 'text-slate-500'}`}>
                {nPan || nAadhaar ? (ready ? 'Ready to check status' : 'Incomplete') : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
              <span className="text-sm text-slate-400">PAN</span>
              <span className="text-sm font-semibold text-white">{showPan}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
              <span className="text-sm text-slate-400">Aadhaar</span>
              <span className="text-sm font-semibold text-white">{showAadhaar}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">{msg}</p>

          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-bold text-slate-400">Check status on official portal</h4>
            <div className="flex gap-2">
              <a href="https://www.incometax.gov.in/iec/foportal/pre-login/bl-link-aadhaar" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-sm font-bold bg-indigo-500 text-white hover:bg-indigo-400 transition-all">
                Open Link/Status Page
              </a>
              <a href="https://www.incometax.gov.in/iec/foportal/" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white transition-all">
                Open e-Filing Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
