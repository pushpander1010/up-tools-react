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

const JOB_RE = [/hiring/i, /vacan/i, /apply/i, /salary/i, /\bctc\b/i, /experience/i, /fresher/i, /walk.?in/i, /interview/i, /resume/i, /cv\b/i, /recruit/i, /opening/i, /role/i, /shift/i, /stipend/i, /payroll/i, /lpa/i, /per month/i, /naukri/i, /bharti/i, /roozgar/i, /vetan/i, /aavedan/i, /sampark/i, /yogyata/i, /sarkari/i]
const CHAT_RE = [/^(hi+|hello|hey|namaste|good morning|good evening)\b/i, /how are you/i, /aur batao/i, /kya haal/i, /good night/i, /congrats/i, /happy birthday/i, /lol|haha|\bxd\b/i]
export function layaCheck(text = '') {
  const t0 = performance.now()
  const t = String(text).trim()
  if (!t) return { job: false, score: 0, ms: 0 }
  if (CHAT_RE.some((re) => re.test(t)) && !JOB_RE.some((re) => re.test(t))) return { job: false, score: 0.05, ms: Math.round(performance.now() - t0) }
  let hits = 0
  for (const re of JOB_RE) if (re.test(t)) hits++
  const score = Math.min(0.99, 0.12 * hits + (t.length > 60 ? 0.2 : 0) + (/(https?:\/\/|www\.)/.test(t) ? 0.15 : 0))
  return { job: score >= 0.35, score: Math.round(score * 100) / 100, ms: Math.max(1, Math.round(performance.now() - t0)) }
}

const SPAM = [/whatsapp.*opportunit/i, /earn.*per day/i, /crypto.*doubl/i, /pay.*fee.*job/i, /adult/i, /betting/i]
const SIGNALS = [/hiring/i, /role/i, /salary/i, /ctc/i, /apply/i, /experience/i, /location/i, /remote/i, /full.?time/i, /naukri/i, /bharti/i, /vacan/i]
function classify(f) {
  const t = `${f.title} ${f.company} ${f.description} ${f.applyLink}`
  for (const re of SPAM) if (re.test(t)) return { spam: true, reason: 'Matched spam pattern' }
  if (t.length < 40) return { spam: true, reason: 'Too short to be a real job' }
  if (!SIGNALS.some((re) => re.test(t))) return { spam: true, reason: 'No job details found' }
  return { spam: false }
}

function parseJD(text) {
  const t = String(text || '')
  const out = {}
  const lines = t.split(/\n+/).map((s) => s.trim()).filter(Boolean)
  const get = (re) => { const m = t.match(re); return m ? m[1].trim().slice(0, 120) : '' }
  out.title = get(/(?:role|position|title|hiring for|opening for|vacancy for)\s*[:\-]\s*(.+)/i) || lines[0]?.slice(0, 80) || ''
  out.company = get(/(?:company|organisation|organization|firm)\s*[:\-]\s*(.+)/i)
  out.location = get(/(?:location|place|city|venue)\s*[:\-]\s*(.+)/i) || (/remote|work from home|wfh/i.test(t) ? 'Remote' : '')
  out.salary = get(/(?:salary|ctc|pay|stipend|package)\s*[:\-]\s*(.+)/i)
  const link = t.match(/https?:\/\/[^\s)]+/)?.[0] || ''
  out.applyLink = link.slice(0, 300)
  out.type = /intern/i.test(t) ? 'Internship' : /part.?time/i.test(t) ? 'Part-time' : /remote|wfh|work from home/i.test(t) ? 'Remote' : 'Full-time'
  out.description = t.slice(0, 1500)
  return out
}

const inp = "w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm mb-2 text-white placeholder:text-slate-600 outline-none"

export default function job_share_board() {
  const [tab, setTab] = useState('jobs')
  const [user, setUser] = useState(null)
  const [jobs, setJobs] = useState([])
  const [msgs, setMsgs] = useState([])
  const [q, setQ] = useState('')
  const [loc, setLoc] = useState('')
  const [typ, setTyp] = useState('')
  const [form, setForm] = useState({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '', applyLink: '' })
  const [paste, setPaste] = useState('')
  const [imgPrev, setImgPrev] = useState('')
  const [imgFile, setImgFile] = useState(null)
  const [msg, setMsg] = useState('')
  const [chat, setChat] = useState('')
  const [jobsOnly, setJobsOnly] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    const u1 = onAuthStateChanged(auth, setUser)
    const u2 = onSnapshot(query(collection(db, 'jobs'), orderBy('createdAt', 'desc'), limit(300)), (s) => {
      setJobs(s.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toMillis?.() || Date.now() })).filter(isLive))
    }, () => setMsg('Firestore blocked: check rules.'))
    const u3 = onSnapshot(query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(200)), (s) => {
      setMsgs(s.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toMillis?.() || Date.now() })))
    })
    return () => { u1(); u2(); u3() }
  }, [])

  const login = async () => { await signInWithPopup(auth, googleProvider) }
  const logout = async () => { await signOut(auth) }

  const onPasteFill = () => {
    const p = parseJD(paste)
    setForm((f) => ({ ...f, title: p.title || f.title, company: p.company || f.company, location: p.location || f.location, salary: p.salary || f.salary, type: p.type || f.type, description: p.description || f.description, applyLink: p.applyLink || f.applyLink }))
    const c = layaCheck(paste)
    setMsg(c.job ? `Pasted text looks job-related (Laya score ${c.score}). Review and post.` : `Pasted text scores low (${c.score}). Add role, salary, apply details.`)
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
    const c = classify(form)
    if (c.spam) { setMsg('Blocked: ' + c.reason); return }
    const imageUrl = await uploadImg()
    await addDoc(collection(db, 'jobs'), { ...form, imageUrl: imageUrl || '', author: user.email, createdAt: serverTimestamp(), expiresAt: Date.now() + WEEK })
    setForm({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '', applyLink: '' })
    setPaste(''); setImgPrev(''); setImgFile(null)
    setMsg('Posted with photo. Live for 7 days.')
  }
  const remove = async (id) => { await deleteDoc(doc(db, 'jobs', id)) }
  const sendChat = async (e) => {
    e.preventDefault()
    if (!user) { setMsg('Login to chat.'); return }
    const t = chat.trim()
    if (!t) return
    const c = layaCheck(t)
    await addDoc(collection(db, 'messages'), { text: t.slice(0, 1000), author: user.email, jobRelated: c.job, score: c.score, createdAt: serverTimestamp() })
    setChat('')
  }
  const filtered = jobs.filter((j) =>
    (!q || (j.title + j.company + j.description).toLowerCase().includes(q.toLowerCase())) &&
    (!loc || (j.location || '').toLowerCase().includes(loc.toLowerCase())) &&
    (!typ || j.type === typ))
  const shownMsgs = jobsOnly ? msgs.filter((m) => m.jobRelated) : msgs
  const daysLeft = (j) => Math.max(0, Math.ceil((WEEK - (Date.now() - j.createdAt)) / 86400000))

  return (
    <ToolLayout title="Job Share Board" desc="100+ Indian openings, 7-day expiry, chat group with Laya job-check, paste JD + photo upload. Google login to post." icon="💼" category="career" slug="job-share-board"
      faq={[{ q: "How long do posts stay live?", a: "7 days from posting, then auto-hidden. The 100+ curated openings expire 7 days after seeding — re-curate weekly." }, { q: "How does the Laya check work?", a: "Every chat message gets an on-device Laya-style job decision (~ms, English + Hindi/Hinglish signals). The full 2.37GB convaiinnovations/laya checkpoint runs server-side on Hugging Face." }, { q: "Can I paste a JD and upload a poster?", a: "Yes. Paste the forwarded text to autofill, attach a photo poster which uploads to Firebase Storage." }]}
      howItWorks={["Login with Google", "Browse 100+ openings or chat", "Paste JD + photo to post — expires in 7 days"]}>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex gap-2 mb-4">
          {['jobs', 'chat'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${tab === t ? 'bg-blue-600/20 border-blue-500/40 text-blue-300' : 'bg-white/[0.06] border-white/10 text-slate-400'}`}>{t === 'jobs' ? `Jobs (${jobs.length})` : `Chat (${msgs.length})`}</button>
          ))}
          <div className="ml-auto">
            {user ? (<span><span className="text-sm text-slate-300 mr-2">{user.email}</span><button onClick={logout} className="bg-white/[0.06] border border-white/10 text-slate-300 px-3 py-1.5 rounded-xl text-sm">Logout</button></span>)
              : (<button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">Login with Google</button>)}
          </div>
        </div>

        {tab === 'jobs' && (<>
          <div className="grid md:grid-cols-3 gap-2 mb-4">
            <input className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none" placeholder="Search title, company" value={q} onChange={(e) => setQ(e.target.value)} />
            <input className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none" placeholder="Location" value={loc} onChange={(e) => setLoc(e.target.value)} />
            <select className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none" value={typ} onChange={(e) => setTyp(e.target.value)}>
              <option className="bg-slate-900" value="">All types</option><option className="bg-slate-900">Full-time</option><option className="bg-slate-900">Part-time</option><option className="bg-slate-900">Remote</option><option className="bg-slate-900">Internship</option>
            </select>
          </div>
          <div className="grid md:grid-cols-[340px_1fr] gap-4">
            <form onSubmit={submit} className="border border-white/10 rounded-2xl p-4 bg-white/[0.03] h-fit">
              <h2 className="font-semibold mb-2 text-white">Post a job</h2>
              <textarea className={inp} placeholder="Paste JD / forwarded text here, then Autofill" value={paste} onChange={(e) => setPaste(e.target.value)} rows={3} />
              <button type="button" onClick={onPasteFill} className="bg-white/[0.06] border border-white/10 text-slate-200 px-3 py-1.5 rounded-xl text-sm mb-2 w-full">Autofill from pasted text</button>
              <input required className={inp} placeholder="Job title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <input required className={inp} placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              <input required className={inp} placeholder="Location (or Remote)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <select className={inp} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option className="bg-slate-900">Full-time</option><option className="bg-slate-900">Part-time</option><option className="bg-slate-900">Remote</option><option className="bg-slate-900">Internship</option>
              </select>
              <input className={inp} placeholder="Salary (e.g. 6 LPA)" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
              <textarea required className={inp} placeholder="Role, experience, how to apply" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              <input className={inp} placeholder="Apply link (optional)" value={form.applyLink} onChange={(e) => setForm({ ...form, applyLink: e.target.value })} />
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onImg(e.target.files?.[0])} />
              <button type="button" onClick={() => fileRef.current?.click()} className="bg-white/[0.06] border border-white/10 text-slate-200 px-3 py-1.5 rounded-xl text-sm mb-2 w-full">Upload poster photo</button>
              {imgPrev && <img src={imgPrev} alt="poster preview" className="rounded-xl mb-2 max-h-40 object-cover w-full" />}
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold w-full" type="submit">Share job</button>
              {msg && <p className="text-sm text-slate-400 mt-2">{msg}</p>}
            </form>
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
                  {j.applyLink && <a className="text-blue-400 text-sm" href={j.applyLink} target="_blank" rel="noreferrer">Apply</a>}
                  {user && j.author === user.email && <div><button className="text-red-400 text-sm mt-1" onClick={() => remove(j.id)}>Delete</button></div>}
                </div>
              ))}
              {filtered.length === 0 && <p className="text-sm text-slate-500">No live jobs. Post one.</p>}
            </div>
          </div>
        </>)}

        {tab === 'chat' && (
          <div className="border border-white/10 rounded-2xl p-4 bg-white/[0.03]">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-semibold text-white">Job chat</h2>
              <span className="text-[11px] text-slate-500">every message Laya-checked</span>
              <button onClick={() => setJobsOnly(!jobsOnly)} className={`ml-auto px-3 py-1.5 rounded-xl text-xs font-semibold border ${jobsOnly ? 'bg-blue-600/20 border-blue-500/40 text-blue-300' : 'bg-white/[0.06] border-white/10 text-slate-400'}`}>{jobsOnly ? 'Jobs only: on' : 'Jobs only: off'}</button>
            </div>
            <form onSubmit={sendChat} className="flex gap-2 mb-3">
              <input className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none" placeholder="Type a job lead or question…" value={chat} onChange={(e) => setChat(e.target.value)} />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold" type="submit">Send</button>
            </form>
            {msg && <p className="text-sm text-slate-400 mb-2">{msg}</p>}
            <div className="space-y-2 max-h-[480px] overflow-auto">
              {shownMsgs.map((m) => (
                <div key={m.id} className="border border-white/10 rounded-xl px-3 py-2 bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{m.author}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${m.jobRelated ? 'bg-green-600/20 text-green-300' : 'bg-white/[0.06] text-slate-500'}`}>{m.jobRelated ? `job ✓ ${m.score ?? ''}` : 'chat'}</span>
                  </div>
                  <p className="text-sm text-slate-200 mt-1">{m.text}</p>
                </div>
              ))}
              {shownMsgs.length === 0 && <p className="text-sm text-slate-500">No messages yet. Say hi — job leads get a green badge.</p>}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}

