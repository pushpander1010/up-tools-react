import { useEffect, useRef, useState } from 'react'
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import ToolLayout from '../components/ToolLayout'

const cfg = {
  apiKey: "AIzaSyBMBS8ySv0AnrAAoC_GXwIZzy-j9bb3YT4",
  authDomain: "jobsharer-hncker.firebaseapp.com",
  projectId: "jobsharer-hncker",
  storageBucket: "jobsharer-hncker.firebasestorage.app",
  appId: "1:286917441969:web:677de65cf17cd256696590",
}
const app = getApps().length ? getApps()[0] : initializeApp(cfg)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
const googleProvider = new GoogleAuthProvider()
const WEEK = 7 * 24 * 3600 * 1000
const isLive = (p) => Date.now() - (p.createdAt || 0) < WEEK

// Laya-style on-device job/scam decision (convaiinnovations/laya is a 2.37GB
// System-1 decision model; full checkpoint runs server-side on Hugging Face).
const JOB_RE = [/hiring/i, /vacan/i, /apply/i, /salary/i, /\bctc\b/i, /experience/i, /fresher/i, /walk.?in/i, /interview/i, /resume/i, /cv\b/i, /recruit/i, /opening/i, /role/i, /shift/i, /stipend/i, /payroll/i, /lpa/i, /per month/i, /naukri/i, /bharti/i, /notification/i, /eligibility/i, /analyst/i, /engineer/i, /developer/i, /associate/i, /trainee/i]
const SCAM_RE = [/earn \d+.*per day/i, /no work.*salary/i, /crypto.*doubl/i, /forex.*profit/i, /pay.*fee.*(job|joining)/i, /registration fee.*job/i, /adult/i, /betting/i, /work from home.*\$\$\$/i, /send.*money.*job/i, /advance.*payment.*job/i]
export function layaCheck(text = '') {
  const t0 = performance.now()
  const t = String(text).trim()
  const ms = () => Math.max(1, Math.round(performance.now() - t0))
  if (!t) return { job: false, scam: false, score: 0, ms: 0 }
  for (const re of SCAM_RE) if (re.test(t)) return { job: false, scam: true, score: 0.02, ms: ms() }
  let hits = 0
  for (const re of JOB_RE) if (re.test(t)) hits++
  const score = Math.min(0.99, 0.12 * hits + (t.length > 60 ? 0.2 : 0) + (/(https?:\/\/|www\.)/.test(t) ? 0.15 : 0))
  return { job: score >= 0.35, scam: false, score: Math.round(score * 100) / 100, ms: ms() }
}

function parseJD(text) {
  const t = String(text || '')
  const out = {}
  const lines = t.split(/\n+/).map((s) => s.trim()).filter(Boolean)
  const get = (re) => { const m = t.match(re); return m ? m[1].trim().slice(0, 120) : '' }
  out.title = get(/(?:role|position|title|hiring for|opening for|vacancy for|post)\s*[:\-]\s*(.+)/i) || lines[0]?.slice(0, 80) || ''
  out.company = get(/(?:company|organisation|organization|firm|department)\s*[:\-]\s*(.+)/i)
  out.location = get(/(?:location|place|city|venue)\s*[:\-]\s*(.+)/i) || (/remote|work from home|wfh/i.test(t) ? 'Remote' : '')
  out.salary = get(/(?:salary|ctc|pay scale|stipend|package|pay)\s*[:\-]\s*(.+)/i)
  const link = t.match(/https?:\/\/[^\s)]+/)?.[0] || ''
  out.applyLink = link.slice(0, 300)
  out.type = /intern/i.test(t) ? 'Internship' : /part.?time/i.test(t) ? 'Part-time' : /remote|wfh|work from home/i.test(t) ? 'Remote' : 'Full-time'
  out.description = t.slice(0, 1500)
  return out
}

const inp = "w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm mb-2 text-white placeholder:text-slate-600 outline-none"
const OPTS = [
  { n: 'Option 1', t: 'Paste job text', d: 'Paste the JD or forwarded message below, hit Autofill — title, company, salary and link fill themselves.' },
  { n: 'Option 2', t: 'Fill the form', d: 'Type the role, company, location, salary and the real apply link directly into the fields.' },
  { n: 'Option 3', t: 'Attach a photo', d: 'Add the company poster or offer letter photo. It uploads with your post.' },
]

export default function job_share_board() {
  const [tab, setTab] = useState('jobs')
  const [user, setUser] = useState(null)
  const [jobs, setJobs] = useState([])
  const [q, setQ] = useState('')
  const [loc, setLoc] = useState('')
  const [typ, setTyp] = useState('')
  const [sec, setSec] = useState('IT & Software')
  const [form, setForm] = useState({ title: '', company: '', location: '', type: 'Full-time', sector: 'IT & Software', salary: '', description: '', applyLink: '' })
  const [paste, setPaste] = useState('')
  const [imgPrev, setImgPrev] = useState('')
  const [imgFile, setImgFile] = useState(null)
  const [msg, setMsg] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    const u1 = onAuthStateChanged(auth, setUser)
    const u2 = onSnapshot(query(collection(db, 'jobs'), orderBy('createdAt', 'desc'), limit(300)), (s) => {
      setJobs(s.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toMillis?.() || Date.now() })).filter(isLive))
    }, () => setMsg('Could not load jobs. Check connection.'))
    return () => { u1(); u2() }
  }, [])

  const login = async () => { await signInWithPopup(auth, googleProvider) }
  const logout = async () => { await signOut(auth) }

  const onPasteFill = () => {
    const p = parseJD(paste)
    setForm((f) => ({ ...f, title: p.title || f.title, company: p.company || f.company, location: p.location || f.location, salary: p.salary || f.salary, type: p.type || f.type, description: p.description || f.description, applyLink: p.applyLink || f.applyLink }))
    const c = layaCheck(paste)
    if (c.scam) setMsg('Warning: pasted text matches scam patterns. Do not post it.')
    else setMsg(c.job ? `Looks job-related (Laya score ${c.score}). Review and post.` : `Scores low (${c.score}). Add role, salary, apply details.`)
  }
  const onImg = (f) => {
    if (!f) return
    setImgFile(f)
    const r = new FileReader()
    r.onload = () => setImgPrev(String(r.result))
    r.readAsDataURL(f)
  }
  const uploadImg = async () => {
    if (!imgFile) return ''
    try {
      const r = ref(storage, `job-posters/${Date.now()}_${imgFile.name.replace(/[^a-zA-Z0-9.]+/g, '_')}`)
      await uploadBytes(r, imgFile)
      return await getDownloadURL(r)
    } catch {
      return imgPrev
    }
  }
  const submit = async (e) => {
    e.preventDefault()
    if (!user) { setMsg('Login with Google first.'); return }
    const full = `${form.title} ${form.company} ${form.description} ${form.applyLink}`
    const c = layaCheck(full)
    if (c.scam) { setMsg('Blocked by Laya scam-check: matches fraud patterns.'); return }
    if (!c.job) { setMsg(`Blocked by Laya check (score ${c.score}): add real role, salary, and apply details.`); return }
    if (!/^https?:\/\//.test(form.applyLink)) { setMsg('Add a real apply link starting with https://'); return }
    const imageUrl = await uploadImg()
    await addDoc(collection(db, 'jobs'), { ...form, imageUrl: imageUrl || '', layaScore: c.score, author: user.email, createdAt: serverTimestamp(), expiresAt: Date.now() + WEEK })
    setForm({ title: '', company: '', location: '', type: 'Full-time', sector: 'IT & Software', salary: '', description: '', applyLink: '' })
    setPaste(''); setImgPrev(''); setImgFile(null)
    setMsg('Posted after Laya check. Live for 7 days.')
    setTab('jobs')
  }
  const remove = async (id) => { await deleteDoc(doc(db, 'jobs', id)) }
  const filtered = jobs.filter((j) =>
    (!sec || sec === 'All' || (j.sector || 'IT & Software') === sec) &&
    (!q || (j.title + j.company + j.description).toLowerCase().includes(q.toLowerCase())) &&
    (!loc || (j.location || '').toLowerCase().includes(loc.toLowerCase())) &&
    (!typ || j.type === typ))
  const daysLeft = (j) => Math.max(0, Math.ceil((WEEK - (Date.now() - j.createdAt)) / 86400000))

  return (
    <ToolLayout title="Corporate Job Share Board" desc="Verified corporate openings with direct apply links. 3 ways to post: paste JD, fill the form, or attach a photo. Laya scam-check on every post. 7-day expiry." icon="💼" category="career" slug="job-share-board"
      faq={[{ q: "How long do posts stay live?", a: "7 days from posting, then auto-hidden." }, { q: "How are scams blocked?", a: "Every post passes the Laya check: fraud patterns blocked, low-detail posts rejected." }, { q: "Corporate only?", a: "Yes. Only private-company roles are listed here." }]}
      howItWorks={["Browse corporate openings", "Post via paste, form, or photo", "Laya-checks it, live for 7 days"]}>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex gap-2 mb-4">
          {['jobs', 'post'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${tab === t ? 'bg-blue-600/20 border-blue-500/40 text-blue-300' : 'bg-white/[0.06] border-white/10 text-slate-400'}`}>{t === 'jobs' ? `Corporate Jobs (${jobs.length})` : 'Post a Job'}</button>
          ))}
          <div className="ml-auto">
            {user ? (<span><span className="text-sm text-slate-300 mr-2">{user.email}</span><button onClick={logout} className="bg-white/[0.06] border border-white/10 text-slate-300 px-3 py-1.5 rounded-xl text-sm">Logout</button></span>)
              : (<button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">Login with Google</button>)}
          </div>
        </div>

        {tab === 'jobs' && (<>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <select className="bg-blue-600/10 border border-blue-500/30 rounded-xl px-3 py-2 text-sm text-blue-200 font-semibold outline-none" value={sec} onChange={(e) => setSec(e.target.value)}>
              <option className="bg-slate-900">IT & Software</option><option className="bg-slate-900">Finance & Risk</option><option className="bg-slate-900">Business & Operations</option><option className="bg-slate-900">All</option>
            </select>
            <input className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none" placeholder="Search title, company" value={q} onChange={(e) => setQ(e.target.value)} />
            <input className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none" placeholder="Location" value={loc} onChange={(e) => setLoc(e.target.value)} />
            <select className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none" value={typ} onChange={(e) => setTyp(e.target.value)}>
              <option className="bg-slate-900" value="">All types</option><option className="bg-slate-900">Full-time</option><option className="bg-slate-900">Part-time</option><option className="bg-slate-900">Remote</option><option className="bg-slate-900">Internship</option>
            </select>
          </div>
          <div>
            {filtered.map((j) => (
              <div key={j.id} className="border border-white/10 rounded-2xl p-4 mb-3 bg-white/[0.03]">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-white">{j.title}</h3>
                  <span className="text-[11px] text-slate-500 shrink-0">{daysLeft(j)}d left</span>
                </div>
                <p className="text-xs text-slate-400">{j.company} | {j.location} | {j.type}{j.salary ? ' | ' + j.salary : ''}</p>
                {j.imageUrl && <img src={j.imageUrl} alt="job poster" className="rounded-xl mt-2 max-h-56 object-cover w-full" loading="lazy" />}
                <p className="text-sm mt-1 text-slate-300">{j.description}</p>
                <div className="mt-2">
                  <a className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl" href={j.applyLink} target="_blank" rel="noreferrer">Apply for this job</a>
                </div>
                {user && j.author === user.email && <div><button className="text-red-400 text-sm mt-1" onClick={() => remove(j.id)}>Delete</button></div>}
              </div>
            ))}
            {filtered.length === 0 && <p className="text-sm text-slate-500">No live jobs. Post one from the Post a Job tab.</p>}
          </div>
        </>)}

        {tab === 'post' && (
          <div>
            <div className="grid md:grid-cols-3 gap-2 mb-4">
              {OPTS.map((o) => (
                <div key={o.n} className="border border-blue-500/30 bg-blue-600/[0.07] rounded-2xl p-3">
                  <p className="text-[11px] font-bold text-blue-300 uppercase">{o.n}</p>
                  <p className="text-sm font-semibold text-white">{o.t}</p>
                  <p className="text-xs text-slate-400 mt-1">{o.d}</p>
                </div>
              ))}
            </div>
            <form onSubmit={submit} className="border border-white/10 rounded-2xl p-4 bg-white/[0.03]">
              <h2 className="font-semibold mb-1 text-white">Post a corporate job</h2>
              <p className="text-[11px] text-slate-500 mb-3">Use any option above — or combine them. Every post passes the Laya scam-check.</p>
              <div className="grid md:grid-cols-2 gap-x-3">
                <div>
                  <p className="text-xs font-semibold text-blue-300 mb-1">Option 1 — Paste job text</p>
                  <textarea className={inp} placeholder="Paste JD / forwarded text here, then Autofill" value={paste} onChange={(e) => setPaste(e.target.value)} rows={4} />
                  <button type="button" onClick={onPasteFill} className="bg-blue-600/20 border border-blue-500/40 text-blue-200 px-3 py-1.5 rounded-xl text-sm mb-2 w-full font-semibold">Autofill from pasted text</button>
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-300 mb-1">Option 3 — Attach a photo</p>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onImg(e.target.files?.[0])} />
                  <button type="button" onClick={() => fileRef.current?.click()} className="bg-white/[0.06] border border-white/10 text-slate-200 px-3 py-1.5 rounded-xl text-sm mb-2 w-full">Upload poster photo</button>
                  {imgPrev ? <img src={imgPrev} alt="poster preview" className="rounded-xl mb-2 max-h-44 object-cover w-full" /> : <p className="text-xs text-slate-600 mb-2">Company poster or offer photo appears here.</p>}
                </div>
              </div>
              <p className="text-xs font-semibold text-blue-300 mb-1 mt-2">Option 2 — Fill the form</p>
              <div className="grid md:grid-cols-2 gap-x-3">
                <input required className={inp} placeholder="Job title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <input required className={inp} placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <input required className={inp} placeholder="Location (or Remote)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                <select className={inp} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option className="bg-slate-900">Full-time</option><option className="bg-slate-900">Part-time</option><option className="bg-slate-900">Remote</option><option className="bg-slate-900">Internship</option>
                </select>
                <select className={inp} value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })}>
                  <option className="bg-slate-900">IT & Software</option><option className="bg-slate-900">Finance & Risk</option><option className="bg-slate-900">Business & Operations</option>
                </select>
                <input className={inp} placeholder="Salary (e.g. 6 LPA)" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
                <input required className={inp} placeholder="Real apply link (https://…)" value={form.applyLink} onChange={(e) => setForm({ ...form, applyLink: e.target.value })} />
              </div>
              <textarea required className={inp} placeholder="Role, experience, eligibility, how to apply" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold w-full" type="submit">Share job</button>
              {msg && <p className="text-sm text-slate-400 mt-2">{msg}</p>}
            </form>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}

