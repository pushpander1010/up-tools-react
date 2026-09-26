import { useEffect, useState } from 'react'
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore'
import ToolLayout from '../components/ToolLayout'

const cfg = {
  apiKey: "AIzaSyBMBS8ySv0AnrAAoC_GXwIZzy-j9bb3YT4",
  authDomain: "jobsharer-hncker.firebaseapp.com",
  projectId: "jobsharer-hncker",
  appId: "1:286917441969:web:677de65cf17cd256696590",
}
const app = getApps().length ? getApps()[0] : initializeApp(cfg)
const auth = getAuth(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()
const WEEK = 7 * 24 * 3600 * 1000
const isLive = (p) => Date.now() - (p.createdAt || 0) < WEEK

const SPAM = [/whatsapp.*opportunit/i, /earn.*per day/i, /crypto.*doubl/i, /pay.*fee.*job/i, /adult/i, /betting/i]
const SIGNALS = [/hiring/i, /role/i, /salary/i, /ctc/i, /apply/i, /experience/i, /location/i, /remote/i, /full.?time/i]
function classify(f) {
  const t = `${f.title} ${f.company} ${f.description} ${f.applyLink}`
  for (const re of SPAM) if (re.test(t)) return { spam: true, reason: 'Matched spam pattern' }
  if (t.length < 40) return { spam: true, reason: 'Too short to be a real job' }
  if (!SIGNALS.some((re) => re.test(t))) return { spam: true, reason: 'No job details found' }
  return { spam: false }
}

export default function job_share_board() {
  const [user, setUser] = useState(null)
  const [jobs, setJobs] = useState([])
  const [q, setQ] = useState('')
  const [loc, setLoc] = useState('')
  const [typ, setTyp] = useState('')
  const [form, setForm] = useState({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '', applyLink: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const u1 = onAuthStateChanged(auth, setUser)
    const u2 = onSnapshot(query(collection(db, 'jobs'), orderBy('createdAt', 'desc')), (s) => {
      setJobs(s.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toMillis?.() || Date.now() })).filter(isLive))
    }, () => setMsg('Firestore blocked: check rules.'))
    return () => { u1(); u2() }
  }, [])

  const login = async () => { await signInWithPopup(auth, googleProvider) }
  const logout = async () => { await signOut(auth) }
  const submit = async (e) => {
    e.preventDefault()
    if (!user) { setMsg('Login with Google first.'); return }
    const c = classify(form)
    if (c.spam) { setMsg('Blocked: ' + c.reason); return }
    await addDoc(collection(db, 'jobs'), { ...form, author: user.email, createdAt: serverTimestamp(), expiresAt: Date.now() + WEEK })
    setForm({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '', applyLink: '' })
    setMsg('Posted. Live for 7 days.')
  }
  const remove = async (id) => { await deleteDoc(doc(db, 'jobs', id)) }
  const filtered = jobs.filter((j) =>
    (!q || (j.title + j.company + j.description).toLowerCase().includes(q.toLowerCase())) &&
    (!loc || (j.location || '').toLowerCase().includes(loc.toLowerCase())) &&
    (!typ || j.type === typ))

  return (
    <ToolLayout title="Job Share Board" desc="Share real job openings. Auto spam check, 7-day expiry, filters. Google login to post." icon="💼" category="career" slug="job-share-board"
      faq={[{ q: "How long do posts stay live?", a: "7 days, then auto-hidden." }, { q: "How is spam blocked?", a: "Local classifier blocks no-detail, too-short, and scam-pattern posts." }]}
      howItWorks={["Login with Google", "Post a job with details", "Jobs expire in 7 days"]}>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-400">{jobs.length} live jobs</p>
          {user ? (<span><span className="text-sm text-slate-300 mr-2">{user.email}</span><button onClick={logout} className="bg-white/[0.06] border border-white/10 text-slate-300 px-3 py-1.5 rounded-xl text-sm">Logout</button></span>)
            : (<button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">Login with Google</button>)}
        </div>
        <div className="grid md:grid-cols-3 gap-2 mb-4">
          <input className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none" placeholder="Search title, company" value={q} onChange={(e) => setQ(e.target.value)} />
          <input className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none" placeholder="Location" value={loc} onChange={(e) => setLoc(e.target.value)} />
          <select className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none" value={typ} onChange={(e) => setTyp(e.target.value)}>
            <option className="bg-slate-900" value="">All types</option><option className="bg-slate-900">Full-time</option><option className="bg-slate-900">Part-time</option><option className="bg-slate-900">Remote</option><option className="bg-slate-900">Internship</option>
          </select>
        </div>
        <div className="grid md:grid-cols-[320px_1fr] gap-4">
          <form onSubmit={submit} className="border border-white/10 rounded-2xl p-4 bg-white/[0.03]">
            <h2 className="font-semibold mb-2 text-white">Post a job</h2>
            <input required className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm mb-2 text-white placeholder:text-slate-600 outline-none" placeholder="Job title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input required className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm mb-2 text-white placeholder:text-slate-600 outline-none" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <input required className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm mb-2 text-white placeholder:text-slate-600 outline-none" placeholder="Location (or Remote)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <select className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm mb-2 text-white outline-none" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option className="bg-slate-900">Full-time</option><option className="bg-slate-900">Part-time</option><option className="bg-slate-900">Remote</option><option className="bg-slate-900">Internship</option>
            </select>
            <input className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm mb-2 text-white placeholder:text-slate-600 outline-none" placeholder="Salary (e.g. 6 LPA)" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
            <textarea required className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm mb-2 text-white placeholder:text-slate-600 outline-none" placeholder="Role, experience, how to apply" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm mb-2 text-white placeholder:text-slate-600 outline-none" placeholder="Apply link (optional)" value={form.applyLink} onChange={(e) => setForm({ ...form, applyLink: e.target.value })} />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold w-full" type="submit">Share job</button>
            {msg && <p className="text-sm text-slate-400 mt-2">{msg}</p>}
          </form>
          <div>
            {filtered.map((j) => (
              <div key={j.id} className="border border-white/10 rounded-2xl p-4 mb-3 bg-white/[0.03]">
                <h3 className="font-semibold text-white">{j.title}</h3>
                <p className="text-xs text-slate-400">{j.company} | {j.location} | {j.type}{j.salary ? ' | ' + j.salary : ''}</p>
                <p className="text-sm mt-1 text-slate-300">{j.description}</p>
                {j.applyLink && <a className="text-blue-400 text-sm" href={j.applyLink} target="_blank" rel="noreferrer">Apply</a>}
                {user && j.author === user.email && <div><button className="text-red-400 text-sm mt-1" onClick={() => remove(j.id)}>Delete</button></div>}
              </div>
            ))}
            {filtered.length === 0 && <p className="text-sm text-slate-500">No live jobs. Post one.</p>}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
