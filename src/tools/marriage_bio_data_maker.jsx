import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function marriage_bio_data_maker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()

  const [form, setForm] = useState({
    name: '', gender: 'Male', dob: '', height: '', weight: '', complexion: '',
    religion: '', caste: '', motherTongue: '', nationality: '', maritalStatus: 'Never Married',
    education: '', occupation: '', income: '', company: '', location: '',
    fatherName: '', fatherOccupation: '', motherName: '', siblings: '',
    familyType: 'Joint', familyStatus: 'Middle Class', familyValues: 'Traditional',
    partnerAge: '', partnerHeight: '', partnerEducation: '', partnerOccupation: '',
    partnerReligion: '', partnerCaste: '', partnerLocation: '',
    aboutMe: '',
  })

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const hasData = form.name && form.dob

  const handlePrint = () => {
    const el = document.getElementById('bio-data-printable')
    if (!el) return
    const win = window.open('', '_blank')
    win.document.write(`
      <html><head><title>Bio Data - ${form.name}</title>
      <style>
        body { font-family: Georgia, serif; padding: 40px; color: #1a1a1a; max-width: 700px; margin: auto; }
        h1 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
        h2 { font-size: 14px; color: #555; margin: 16px 0 6px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ddd; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; }
        .row { display: flex; gap: 8px; padding: 3px 0; font-size: 13px; }
        .label { font-weight: bold; min-width: 120px; color: #444; }
        .val { color: #111; }
        .about { font-size: 13px; line-height: 1.6; margin-top: 8px; white-space: pre-wrap; }
        .footer { margin-top: 40px; text-align: right; font-style: italic; color: #666; }
      </style></head><body>${el.innerHTML}</body></html>`)
    win.document.close()
    win.print()
  }

  const handleCopy = () => {
    const text = [
      `BIO DATA - ${form.name}`,
      '='.repeat(40),
      '',
      '--- Personal Details ---',
      `Name: ${form.name}`, `Gender: ${form.gender}`, `Date of Birth: ${form.dob}`,
      `Height: ${form.height}`, `Weight: ${form.weight}`, `Complexion: ${form.complexion}`,
      `Religion: ${form.religion}`, `Caste: ${form.caste}`, `Mother Tongue: ${form.motherTongue}`,
      `Nationality: ${form.nationality}`, `Marital Status: ${form.maritalStatus}`,
      '',
      '--- Education & Career ---',
      `Education: ${form.education}`, `Occupation: ${form.occupation}`,
      `Annual Income: ${form.income}`, `Company: ${form.company}`, `Location: ${form.location}`,
      '',
      '--- Family Details ---',
      `Father: ${form.fatherName} (${form.fatherOccupation})`, `Mother: ${form.motherName}`,
      `Siblings: ${form.siblings}`, `Family Type: ${form.familyType}`,
      `Family Status: ${form.familyStatus}`, `Family Values: ${form.familyValues}`,
      '',
      '--- Partner Preferences ---',
      `Age: ${form.partnerAge}`, `Height: ${form.partnerHeight}`,
      `Education: ${form.partnerEducation}`, `Occupation: ${form.partnerOccupation}`,
      `Religion: ${form.partnerReligion}`, `Caste: ${form.partnerCaste}`,
      `Location: ${form.partnerLocation}`,
      '',
      '--- About Me ---',
      form.aboutMe || 'N/A',
    ].join('\n')
    navigator.clipboard.writeText(text)
  }

  const Field = ({ label, value }) => (
    <div className="flex gap-2 py-1">
      <span className="font-bold text-slate-400 min-w-[110px] text-xs">{label}:</span>
      <span className="text-white text-xs">{value || '—'}</span>
    </div>
  )

  const InputField = ({ label, value, onChange, placeholder, type = 'text' }) => (
    <div>
      <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-xs font-medium outline-none focus:border-purple-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]" />
    </div>
  )

  const SelectField = ({ label, value, onChange, options }) => (
    <div>
      <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">{label}</label>
      <select value={value} onChange={onChange}
        className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-xs font-medium outline-none focus:border-purple-500/40 transition-all [color-scheme:dark]">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )

  const Section = ({ title, children }) => (
    <div className="mb-4">
      <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{children}</div>
    </div>
  )

  return (
    <ToolLayout
      title="Marriage Bio Data Maker"
      desc="Marriage Bio Data Maker - create professional marriage biodata cards with personal, education, family, and partner preference details online free. Free online, no sign-up. Works on any device."
      icon="💍" iconBg="rgba(168,85,247,0.08)"
      category="document" slug="marriage-bio-data-maker"
      faq={[
        { q: 'What is a Marriage Bio Data?', a: 'A marriage biodata is a structured document containing personal, educational, family, and partner preference details shared during matrimonial proceedings.' },
        { q: 'How to use this tool?', a: 'Fill in your personal details, education and career info, family background, and partner preferences, then preview and print or copy your biodata.' },
        { q: 'Can I print the biodata?', a: 'Yes, the print button opens a clean, print-optimized layout of your biodata in a new window ready to print or save as PDF.' },
        { q: 'Is this tool free?', a: 'Yes, completely free with no sign-up. Create unlimited biodata documents online on any device.' },
        { q: 'Can I copy the biodata as text?', a: 'Yes, the copy button copies a plain-text version of your complete biodata to the clipboard.' },
        { q: 'Is my data stored anywhere?', a: 'No, all data stays in your browser. Nothing is sent to any server. Your privacy is fully protected.' },
      ]}
      howItWorks={[
        'Enter personal details like name, age, height, religion, and physical attributes.',
        'Add education, occupation, income, and career information.',
        'Fill in family background including parents, siblings, and family values.',
        'Set partner preferences and preview your printable biodata card.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Marriage Bio Data Maker", "applicationCategory": "BusinessApplication",
        "url": "https://www.uptools.in/marriage-bio-data-maker/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Input Form */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <Section title="Personal Details">
            <InputField label="Full Name" value={form.name} onChange={set('name')} placeholder="e.g. Aarav Kumar" />
            <SelectField label="Gender" value={form.gender} onChange={set('gender')} options={['Male', 'Female', 'Other']} />
            <InputField label="Date of Birth" value={form.dob} onChange={set('dob')} placeholder="e.g. 15 March 1995" />
            <InputField label="Height" value={form.height} onChange={set('height')} placeholder="e.g. 5'10&quot;" />
            <InputField label="Weight" value={form.weight} onChange={set('weight')} placeholder="e.g. 72 kg" />
            <InputField label="Complexion" value={form.complexion} onChange={set('complexion')} placeholder="e.g. Fair" />
            <InputField label="Religion" value={form.religion} onChange={set('religion')} placeholder="e.g. Hindu" />
            <InputField label="Caste" value={form.caste} onChange={set('caste')} placeholder="e.g. Brahmin" />
            <InputField label="Mother Tongue" value={form.motherTongue} onChange={set('motherTongue')} placeholder="e.g. Hindi" />
            <InputField label="Nationality" value={form.nationality} onChange={set('nationality')} placeholder="e.g. Indian" />
            <SelectField label="Marital Status" value={form.maritalStatus} onChange={set('maritalStatus')} options={['Never Married', 'Divorced', 'Widowed']} />
          </Section>

          <Section title="Education & Career">
            <InputField label="Education" value={form.education} onChange={set('education')} placeholder="e.g. B.Tech, MBA" />
            <InputField label="Occupation" value={form.occupation} onChange={set('occupation')} placeholder="e.g. Software Engineer" />
            <InputField label="Annual Income" value={form.income} onChange={set('income')} placeholder="e.g. ₹15 LPA" />
            <InputField label="Company" value={form.company} onChange={set('company')} placeholder="e.g. Google" />
            <InputField label="Location" value={form.location} onChange={set('location')} placeholder="e.g. Bangalore" />
          </Section>

          <Section title="Family Details">
            <InputField label="Father's Name" value={form.fatherName} onChange={set('fatherName')} placeholder="e.g. Suresh Kumar" />
            <InputField label="Father's Occupation" value={form.fatherOccupation} onChange={set('fatherOccupation')} placeholder="e.g. Retd. Govt. Officer" />
            <InputField label="Mother's Name" value={form.motherName} onChange={set('motherName')} placeholder="e.g. Sunita Kumar" />
            <InputField label="Siblings" value={form.siblings} onChange={set('siblings')} placeholder="e.g. 1 Elder Sister" />
            <SelectField label="Family Type" value={form.familyType} onChange={set('familyType')} options={['Nuclear', 'Joint']} />
            <SelectField label="Family Status" value={form.familyStatus} onChange={set('familyStatus')} options={['Upper Class', 'Upper Middle Class', 'Middle Class', 'Lower Middle Class']} />
            <SelectField label="Family Values" value={form.familyValues} onChange={set('familyValues')} options={['Traditional', 'Moderate', 'Liberal']} />
          </Section>

          <Section title="Partner Preferences">
            <InputField label="Preferred Age" value={form.partnerAge} onChange={set('partnerAge')} placeholder="e.g. 25-30 years" />
            <InputField label="Preferred Height" value={form.partnerHeight} onChange={set('partnerHeight')} placeholder="e.g. 5'4&quot; and above" />
            <InputField label="Preferred Education" value={form.partnerEducation} onChange={set('partnerEducation')} placeholder="e.g. Graduate or above" />
            <InputField label="Preferred Occupation" value={form.partnerOccupation} onChange={set('partnerOccupation')} placeholder="e.g. Employed" />
            <InputField label="Preferred Religion" value={form.partnerReligion} onChange={set('partnerReligion')} placeholder="e.g. Hindu" />
            <InputField label="Preferred Caste" value={form.partnerCaste} onChange={set('partnerCaste')} placeholder="e.g. Any" />
            <InputField label="Preferred Location" value={form.partnerLocation} onChange={set('partnerLocation')} placeholder="e.g. Any Metro City" />
          </Section>

          <div className="mb-2">
            <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">About Me</label>
            <textarea value={form.aboutMe} onChange={set('aboutMe')} rows={3}
              placeholder="Write a short description about yourself..."
              className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-lg px-3 py-2 text-white text-xs font-medium outline-none focus:border-purple-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark] resize-none" />
          </div>

          <button onClick={jumpTo}
            className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl text-sm transition-all">
            Preview Biodata
          </button>
        </div>

        {/* Printable Card Preview */}
        {hasData ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-purple-500/15 bg-gradient-to-br from-purple-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Biodata Preview</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={handleCopy}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-lg transition-all">
                  📋 Copy
                </button>
                <button onClick={handlePrint}
                  className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold rounded-lg transition-all">
                  🖨️ Print
                </button>
              </div>
            </div>

            {/* Printable Card */}
            <div id="bio-data-printable"
              className="bg-black/30 border border-white/[0.06] rounded-xl p-6">
              <div style={{ textAlign: 'center', borderBottom: '2px solid rgba(168,85,247,0.3)', paddingBottom: 12, marginBottom: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 'bold', color: '#e2e8f0', margin: 0, textTransform: 'uppercase', letterSpacing: 2 }}>Marriage Biodata</h2>
                <h3 style={{ fontSize: 28, fontWeight: 'bold', color: '#a855f7', margin: '4px 0 0' }}>{form.name}</h3>
              </div>

              <div className="space-y-1">
                <h5 style={{ fontSize: 12, color: '#a855f7', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, margin: '12px 0 4px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 4 }}>Personal Details</h5>
                <Field label="Gender" value={form.gender} />
                <Field label="Date of Birth" value={form.dob} />
                <Field label="Height" value={form.height} />
                <Field label="Weight" value={form.weight} />
                <Field label="Complexion" value={form.complexion} />
                <Field label="Religion" value={form.religion} />
                <Field label="Caste" value={form.caste} />
                <Field label="Mother Tongue" value={form.motherTongue} />
                <Field label="Nationality" value={form.nationality} />
                <Field label="Marital Status" value={form.maritalStatus} />

                <h5 style={{ fontSize: 12, color: '#a855f7', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, margin: '12px 0 4px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 4 }}>Education & Career</h5>
                <Field label="Education" value={form.education} />
                <Field label="Occupation" value={form.occupation} />
                <Field label="Annual Income" value={form.income} />
                <Field label="Company" value={form.company} />
                <Field label="Location" value={form.location} />

                <h5 style={{ fontSize: 12, color: '#a855f7', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, margin: '12px 0 4px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 4 }}>Family Details</h5>
                <Field label="Father" value={`${form.fatherName} (${form.fatherOccupation})`} />
                <Field label="Mother" value={form.motherName} />
                <Field label="Siblings" value={form.siblings} />
                <Field label="Family Type" value={form.familyType} />
                <Field label="Family Status" value={form.familyStatus} />
                <Field label="Family Values" value={form.familyValues} />

                <h5 style={{ fontSize: 12, color: '#a855f7', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, margin: '12px 0 4px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 4 }}>Partner Preferences</h5>
                <Field label="Age" value={form.partnerAge} />
                <Field label="Height" value={form.partnerHeight} />
                <Field label="Education" value={form.partnerEducation} />
                <Field label="Occupation" value={form.partnerOccupation} />
                <Field label="Religion" value={form.partnerReligion} />
                <Field label="Caste" value={form.partnerCaste} />
                <Field label="Location" value={form.partnerLocation} />

                {form.aboutMe && (
                  <>
                    <h5 style={{ fontSize: 12, color: '#a855f7', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, margin: '12px 0 4px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 4 }}>About Me</h5>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{form.aboutMe}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💍</div>
            <p className="text-sm text-slate-600 font-medium">Enter name and date of birth to preview biodata</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
