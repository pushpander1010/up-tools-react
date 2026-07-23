import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const ENTITY_TYPES = {
  P: { label: 'Individual', color: 'emerald', emoji: '👤' },
  C: { label: 'Company', color: 'blue', emoji: '🏢' },
  H: { label: 'HUF', color: 'purple', emoji: '👨‍👩‍👧‍👦' },
  A: { label: 'AOP', color: 'amber', emoji: '🤝' },
  B: { label: 'BOI', color: 'orange', emoji: '🏛️' },
  G: { label: 'Government', color: 'cyan', emoji: '🏛️' },
  J: { label: 'AJPL', color: 'pink', emoji: '⚙️' },
  L: { label: 'Local Authority', color: 'teal', emoji: '🏙️' },
  F: { label: 'Firm / LLP', color: 'indigo', emoji: '💼' },
  T: { label: 'Trust', color: 'rose', emoji: '🤝' },
}

function validatePAN(pan) {
  if (!pan || typeof pan !== 'string') return { valid: false, error: 'PAN is required' }
  const p = pan.trim().toUpperCase()
  if (p.length !== 10) return { valid: false, error: `PAN must be 10 characters (${p.length} given)`, pan: p }

  // First 5 must be letters
  for (let i = 0; i < 5; i++) {
    if (!/[A-Z]/.test(p[i])) return { valid: false, error: `Character ${i + 1} must be a letter (got '${p[i]}')`, pan: p }
  }
  // Next 4 must be digits
  for (let i = 5; i < 9; i++) {
    if (!/[0-9]/.test(p[i])) return { valid: false, error: `Character ${i + 1} must be a digit (got '${p[i]}')`, pan: p }
  }
  // Last must be letter
  if (!/[A-Z]/.test(p[9])) return { valid: false, error: `Character 10 must be a letter (got '${p[9]}')`, pan: p }

  const fourthChar = p[3]
  const entity = ENTITY_TYPES[fourthChar] || { label: 'Unknown', color: 'slate', emoji: '❓' }

  return {
    valid: true,
    pan: p,
    entityType: fourthChar,
    entity,
    masked: p.slice(0, 5) + 'XXXX' + p[9],
    parts: {
      issuer: p.slice(0, 3),
      entityCode: p[3],
      sequence: p.slice(4, 5),
      serial: p.slice(5, 9),
      checksum: p[9],
    }
  }
}

// GSTIN checksum validation (base-36 mod 36)
const GSTIN_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function validateGSTIN(gstin) {
  if (!gstin || typeof gstin !== 'string') return { valid: false, error: 'GSTIN is required' }
  const g = gstin.trim().toUpperCase()
  if (g.length !== 15) return { valid: false, error: `GSTIN must be 15 characters (${g.length} given)`, gstin: g }

  // Basic format check
  if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(g)) {
    return { valid: false, error: 'Invalid GSTIN format', gstin: g }
  }

  // Checksum validation
  const factor = [1, 3]
  let sum = 0
  for (let i = 0; i < 14; i++) {
    const idx = GSTIN_CHARS.indexOf(g[i])
    if (idx < 0) return { valid: false, error: `Invalid character '${g[i]}' at position ${i + 1}`, gstin: g }
    sum += idx * factor[i % 2]
  }
  const remainder = sum % 36
  const checksumIdx = remainder === 0 ? 0 : 36 - remainder
  const expected = GSTIN_CHARS[checksumIdx]

  if (g[14] !== expected) {
    return { valid: false, error: `Checksum mismatch. Expected '${expected}' at position 15, got '${g[14]}'`, gstin: g }
  }

  const panInGSTIN = g.slice(2, 12)
  const panResult = validatePAN(panInGSTIN)

  return {
    valid: true,
    gstin: g,
    stateCode: g.slice(0, 2),
    panInGSTIN,
    panValid: panResult.valid,
    entityType: panResult.entity,
  }
}

function AnimatedChar({ char, index, isValid, hasValue }) {
  return (
    <div className={`inline-flex items-center justify-center w-8 sm:w-10 h-10 sm:h-12 rounded-lg text-sm sm:text-base font-extrabold transition-all duration-200
      ${!hasValue
        ? 'bg-white/[0.04] border border-white/6 text-slate-600'
        : isValid
          ? 'bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10'
          : 'bg-red-500/15 border-2 border-red-500/30 text-red-400 shadow-lg shadow-red-500/10'
      }`}>
      {hasValue ? char : <span className="text-slate-700">_</span>}
    </div>
  )
}

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(value)
  const frameRef = useRef(null)

  useEffect(() => {
    if (value === undefined || value === null) return
    const start = display
    const diff = value - start
    const duration = 300
    const startTime = performance.now()
    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(start + diff * eased)
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value])

  return <span>{Math.round(display)}</span>
}

export default function pan_validator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [pan, setPan] = useState('')
  const [gstin, setGstin] = useState('')
  const [showMasked, setShowMasked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [bulkMode, setBulkMode] = useState(false)
  const [bulkInput, setBulkInput] = useState('')

  const result = useMemo(() => validatePAN(pan), [pan])
  const gstinResult = useMemo(() => gstin ? validateGSTIN(gstin) : null, [gstin])

  const bulkResults = useMemo(() => {
    if (!bulkMode || !bulkInput.trim()) return []
    return bulkInput.split('\n').filter(l => l.trim()).map(l => validatePAN(l.trim()))
  }, [bulkMode, bulkInput])

  const handleCopy = useCallback(() => {
    const text = result.valid
      ? `PAN: ${result.pan}\nEntity Type: ${result.entity.label}\nMasked: ${result.masked}`
      : `Invalid PAN: ${result.error}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [result])

  const validCount = bulkResults.filter(r => r.valid).length
  const invalidCount = bulkResults.filter(r => !r.valid).length

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-purple-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark] uppercase tracking-widest"
  const btnActive = "bg-purple-500/15 border-purple-500/30 text-purple-400 shadow-lg shadow-purple-500/10"
  const btnInactive = "bg-white/[0.04] border-white/6 text-slate-500 hover:border-white/12 hover:text-slate-300"

  return (
    <ToolLayout
      title="PAN Format Validator"
      desc="Validate Indian PAN card numbers instantly. Check format, identify entity type, verify GSTIN checksum, and bulk validate."
      icon="🪪" iconBg="rgba(168,85,247,0.08)"
      category="text" slug="pan-validator"
      faq={[
        { q: 'What is PAN?', a: 'Permanent Account Number (PAN) is a 10-character alphanumeric identifier issued by the Indian Income Tax Department, used for financial transactions and tax filing.' },
        { q: 'What does each PAN character mean?', a: 'First 3: Issuer code (e.g., AAAA = NSDL). 4th: Entity type (P=Individual, C=Company, etc.). 5th: First letter of surname/name. Next 4: Serial number. Last: Check digit.' },
        { q: 'How to validate PAN format?', a: 'PAN follows the pattern AAAAA9999A — 5 letters, 4 digits, 1 letter. The 4th character determines entity type. This tool validates the full pattern.' },
        { q: 'What is the GSTIN-PAN link?', a: 'GSTIN contains the PAN at positions 2-12. This tool extracts and validates the embedded PAN, plus verifies the GSTIN checksum.' },
      ]}
      howItWorks={[
        'Enter a 10-character PAN number in the input field.',
        'See character-by-character validation with green/red indicators.',
        'Check the entity type identified by the 4th character.',
        'Optionally enter a GSTIN to cross-validate the embedded PAN.',
        'Use bulk mode to validate multiple PANs at once.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "PAN Format Validator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/pan-validator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ─── Mode Toggle ─── */}
        <div className="grid grid-cols-2 gap-2">
          {[
            ['single', 'Single PAN', '🪪'],
            ['bulk', 'Bulk Validate', '📋'],
          ].map(([m, label, icon]) => (
            <button key={m} onClick={() => setBulkMode(m === 'bulk')}
              className={`relative py-4 rounded-2xl text-sm font-bold transition-all duration-300 overflow-hidden border-2
                ${(bulkMode ? 'bulk' : 'single') === m
                  ? btnActive
                  : btnInactive
                }`}>
              <span className="relative text-lg">{icon}</span>
              <span className="relative block mt-1 text-xs">{label}</span>
            </button>
          ))}
        </div>

        {/* ─── Single PAN Input ─── */}
        {!bulkMode && (
          <div style={{ animation: 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Enter PAN Number</label>
            <input type="text" value={pan} onChange={e => setPan(e.target.value.toUpperCase().slice(0, 10))}
              placeholder="ABCDE1234F" maxLength={10}
              className={`${inputClass} text-lg tracking-[0.3em] text-center`}
              style={{ letterSpacing: '0.3em' }} />

            {/* Character-by-Character Validation */}
            {pan.length > 0 && (
              <div className="flex justify-center gap-1.5 mt-4">
                {Array.from({ length: 10 }, (_, i) => {
                  const char = pan[i] || ''
                  const hasValue = i < pan.length
                  let isValid = false
                  if (hasValue) {
                    if (i < 5) isValid = /[A-Z]/.test(char)
                    else if (i < 9) isValid = /[0-9]/.test(char)
                    else isValid = /[A-Z]/.test(char)
                  }
                  return <AnimatedChar key={i} char={char} index={i} isValid={isValid} hasValue={hasValue} />
                })}
              </div>
            )}

            {/* PAN Anatomy Diagram */}
            {pan.length === 10 && (
              <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-xs text-slate-500 font-semibold mb-3">PAN Anatomy</div>
                <div className="flex justify-between text-center gap-0.5">
                  {[
                    { chars: pan.slice(0, 3), label: 'Issuer', span: '3' },
                    { chars: pan[3], label: ENTITY_TYPES[pan[3]]?.label || 'Entity', span: '1' },
                    { chars: pan[4], label: 'Name', span: '1' },
                    { chars: pan.slice(5, 9), label: 'Serial', span: '4' },
                    { chars: pan[9], label: 'Check', span: '1' },
                  ].map((part, i) => (
                    <div key={i} className="flex-1">
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg py-1.5 px-1">
                        <div className="text-xs font-extrabold text-purple-400 tracking-wider">{part.chars}</div>
                      </div>
                      <div className="text-[9px] text-slate-600 mt-1 font-semibold">{part.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Bulk Mode ─── */}
        {bulkMode && (
          <div style={{ animation: 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Paste PANs (one per line)</label>
            <textarea value={bulkInput} onChange={e => setBulkInput(e.target.value.toUpperCase())}
              placeholder={"ABCDE1234F\nFGHIJ5678K\nKLMNO9012P"}
              rows={6}
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-mono text-sm outline-none
                focus:border-purple-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark] resize-none" />
            {bulkResults.length > 0 && (
              <div className="flex gap-4 mt-3">
                <div className="text-xs font-bold text-emerald-400">✓ {validCount} valid</div>
                <div className="text-xs font-bold text-red-400">✗ {invalidCount} invalid</div>
              </div>
            )}
          </div>
        )}

        {/* ─── Bulk Results ─── */}
        {bulkMode && bulkResults.length > 0 && (
          <div ref={resultRef} className="rounded-3xl border-2 border-purple-500/15 bg-gradient-to-br from-purple-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Bulk Validation Results</h3>
            </div>
            <div className="space-y-2">
              {bulkResults.map((r, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200
                  ${r.valid
                    ? 'bg-emerald-500/5 border-emerald-500/15'
                    : 'bg-red-500/5 border-red-500/15'
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${r.valid ? 'text-emerald-400' : 'text-red-400'}`}>
                      {r.valid ? '✓' : '✗'}
                    </span>
                    <span className="text-sm font-mono font-bold text-white tracking-wider">{r.pan || bulkInput.split('\n')[i]?.trim()}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {r.valid ? r.entity.label : r.error}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Single Result ─── */}
        {!bulkMode && result.valid && (
          <div ref={resultRef} className="rounded-3xl border-2 border-purple-500/15 bg-gradient-to-br from-purple-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">PAN Valid ✓</h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Mask Toggle */}
                <button onClick={() => setShowMasked(!showMasked)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:border-white/15 hover:bg-white/10 transition-all duration-200 active:scale-95">
                  {showMasked ? '👁️ Show' : '🙈 Hide'}
                </button>
                {/* Copy */}
                <button onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:border-white/15 hover:bg-white/10 transition-all duration-200 active:scale-95">
                  {copied ? (
                    <><svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Copied!</>
                  ) : (
                    <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg> Copy</>
                  )}
                </button>
              </div>
            </div>

            {/* Entity Type Badge */}
            <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-5">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{result.entity.emoji}</span>
                <div>
                  <div className="text-2xl font-extrabold text-white tracking-wider">{showMasked ? result.masked : result.pan}</div>
                  <div className="text-sm font-bold text-purple-400 mt-1">{result.entity.label}</div>
                </div>
              </div>
            </div>

            {/* Parts Breakdown */}
            <div className="grid grid-cols-5 gap-2 mb-5">
              {[
                { chars: result.parts.issuer, label: 'Issuer', sub: 'Registration' },
                { chars: result.parts.entityCode, label: 'Entity', sub: result.entity.label },
                { chars: result.parts.sequence, label: 'Name', sub: 'First Letter' },
                { chars: result.parts.serial, label: 'Serial', sub: 'Unique ID' },
                { chars: result.parts.checksum, label: 'Check', sub: 'Digit' },
              ].map((part, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/6 text-center">
                  <div className="text-sm font-extrabold text-purple-400 tracking-wider">{part.chars}</div>
                  <div className="text-[10px] text-slate-500 font-bold mt-1">{part.label}</div>
                  <div className="text-[9px] text-slate-600">{part.sub}</div>
                </div>
              ))}
            </div>

            {/* Entity Types Reference */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-xs text-slate-500 font-semibold mb-3">Entity Types (4th Character)</div>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(ENTITY_TYPES).map(([code, info]) => (
                  <div key={code} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold
                    ${result.entityType === code ? 'bg-purple-500/15 text-purple-400' : 'text-slate-500'}`}>
                    <span>{info.emoji}</span>
                    <span className="font-extrabold">{code}</span>
                    <span className="text-slate-600">{info.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Invalid Result ─── */}
        {!bulkMode && pan.length > 0 && !result.valid && (
          <div ref={resultRef} className="rounded-3xl border-2 border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent p-6"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Invalid PAN</h3>
            </div>
            <p className="text-sm text-red-300 font-medium">{result.error}</p>
            {pan.length < 10 && (
              <p className="text-xs text-slate-600 mt-2">Enter {10 - pan.length} more character{10 - pan.length !== 1 ? 's' : ''}</p>
            )}
          </div>
        )}

        {/* ─── GSTIN Cross-Check ─── */}
        {!bulkMode && (
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🔗</span>
              <h4 className="text-sm font-bold text-white">GSTIN Cross-Check</h4>
            </div>
            <p className="text-xs text-slate-500 mb-3">Validate GSTIN and extract embedded PAN</p>
            <input type="text" value={gstin} onChange={e => setGstin(e.target.value.toUpperCase().slice(0, 15))}
              placeholder="Enter 15-character GSTIN" maxLength={15}
              className={`${inputClass} text-sm tracking-[0.15em]`} />
            {gstinResult && (
              <div className={`mt-3 p-3 rounded-xl border transition-all duration-200
                ${gstinResult.valid
                  ? 'bg-emerald-500/5 border-emerald-500/15'
                  : 'bg-red-500/5 border-red-500/15'
                }`}>
                <div className="flex items-center gap-2">
                  <span className={gstinResult.valid ? 'text-emerald-400' : 'text-red-400'}>
                    {gstinResult.valid ? '✓' : '✗'}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {gstinResult.valid ? `Valid GSTIN — PAN: ${gstinResult.panInGSTIN}` : gstinResult.error}
                  </span>
                </div>
                {gstinResult.valid && (
                  <div className="text-xs text-slate-500 mt-1 ml-5">
                    State Code: {gstinResult.stateCode} · Entity: {gstinResult.entityType?.label}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!bulkMode && pan.length === 0 && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🪪</div>
            <p className="text-sm text-slate-600 font-medium">Enter a 10-character PAN number to validate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
