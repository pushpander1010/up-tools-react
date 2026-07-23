import { useState, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

const STORAGE_KEY = 'uptools:cra-noa:checklist'

const ITEMS = [
  'Notice of Assessment (NOA)',
  'T4 / T4A slips',
  'RRSP contribution receipts',
  'Tuition/T2202 slips',
  'Medical expense receipts',
  'Charitable donation receipts',
  'Investment income slips (T5/T3)',
  'Rent or property tax receipts (if applicable)',
  'Business income/expense records (if self-employed)',
]

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch { return {} }
}

function saveChecked(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

export default function cra_noa_checklist() {
  const [checked, setChecked] = useState(() => loadSaved())

  useEffect(() => { saveChecked(checked) }, [checked])

  const toggle = idx => {
    setChecked(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  const reset = () => setChecked({})

  const doneCount = Object.values(checked).filter(Boolean).length

  return (
    <ToolLayout
      title="CRA Notice of Assessment Checklist"
      desc="Checklist for preparing your CRA Notice of Assessment review. Track documents locally."
      icon="🍁" iconBg="rgba(220,38,38,0.08)"
      category="canada" slug="cra-noa-checklist"
      faq={[
        { q: 'What is this checklist?', a: 'A document checklist for preparing your CRA Notice of Assessment review.' },
        { q: 'Is my data stored?', a: 'Yes, locally in your browser using localStorage. Nothing is uploaded.' },
      ]}
      howItWorks={[
        'Review the checklist items below.',
        'Check off documents you have ready.',
        'Your progress is saved automatically in your browser.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'CRA NOA Checklist', applicationCategory: 'UtilitiesApplication',
        url: 'https://www.uptools.in/cra-noa-checklist/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div className="rounded-2xl bg-white/[0.06] border-2 border-white/8 p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-300">{doneCount} of {ITEMS.length} items ready</span>
            <button onClick={reset} className="text-xs text-slate-500 hover:text-red-400 transition-colors font-medium">Reset</button>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-red-500 transition-all duration-500"
              style={{ width: `${(doneCount / ITEMS.length) * 100}%` }} />
          </div>
        </div>

        {/* Checklist */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.03] overflow-hidden divide-y divide-white/4">
          {ITEMS.map((item, idx) => (
            <label key={idx} className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/[0.03] transition-colors">
              <input type="checkbox" checked={!!checked[idx]} onChange={() => toggle(idx)}
                className="w-5 h-5 rounded-lg border-white/20 bg-white/10 text-red-500 focus:ring-red-500/40 shrink-0" />
              <span className={`text-sm font-medium transition-all duration-200 ${checked[idx] ? 'text-slate-500 line-through' : 'text-white'}`}>
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
