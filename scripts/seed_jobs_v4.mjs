import { readFileSync } from 'fs'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore'

const cfg = {
  apiKey: "AIzaSyBMBS8ySv0AnrAAoC_GXwIZzy-j9bb3YT4",
  authDomain: "jobsharer-hncker.firebaseapp.com",
  projectId: "jobsharer-hncker",
  appId: "1:286917441969:web:677de65cf17cd256696590",
}
const db = getFirestore(initializeApp(cfg))
const WEEK = 7 * 24 * 3600 * 1000
const FIN = /(risk|fraud|credit|audit|treasury|compliance|legal|collection|recoveries|financ|accounting|lending)/i
const TECH = /(engineer|sde|developer|software|\bdata\b|analy|\bai\b|\bml\b|qa\b|test|devops|sre|design|ui\b|ux\b|frontend|backend|full.?stack|mobile|ios|android|architect|scientist|security|builder|platform|cloud|product manager|pdm|sdet)/i
const sectorOf = (t) => FIN.test(t) ? "Finance & Risk" : TECH.test(t) ? "IT & Software" : "Business & Operations"
const shortLoc = (l) => {
  const m = (l || "").match(/(Bengaluru|Bangalore|Mumbai|Delhi|Noida|Gurgaon|Gurugram|Hyderabad|Chennai|Pune|Kolkata|Jaipur|Goa|Kochi|Ahmedabad|Remote)/i)
  if (/remote/i.test(l || "")) return "Remote"
  return m ? m[1].replace("Bangalore", "Bengaluru").replace("Gurgaon", "Gurugram") : (l || "India").slice(0, 40)
}
// Engineer-first ordering so the default IT view is rich, then slice per-company caps
const engFirst = (arr) => [...arr].sort((a, b) => (TECH.test(b.title) ? 1 : 0) - (TECH.test(a.title) ? 1 : 0))
const all = JSON.parse(readFileSync("/tmp/postings.json", "utf8"))
const byCo = {}
for (const p of all) (byCo[p.co] = byCo[p.co] || []).push(p)
const caps = { Razorpay: 20, Groww: 7, Cred: 12, Meesho: 30, Paytm: 30 }
let picks = []
for (const [co, cap] of Object.entries(caps)) picks.push(...engFirst(byCo[co] || []).slice(0, cap))
// User-shared live LTIMindtree requisition (verified resolving)
picks.push({ co: "LTIMindtree", title: "LTIMindtree Opening — Job ID 897465", loc: "India", url: "https://ltimindtree.ripplehire.com/candidate/?token=xviyQvbnyYZdGtozXoNm&lang=en&source=CAREERSITE#apply/job/897465", dept: "" })
console.log("picks:", picks.length)
const old = await getDocs(collection(db, "jobs"))
for (const d of old.docs) await deleteDoc(d.ref)
console.log("deleted:", old.docs.length)
let ok = 0
for (const p of picks) {
  const type = /intern/i.test(p.title) ? "Internship" : "Full-time"
  await addDoc(collection(db, "jobs"), {
    title: p.title.slice(0, 120), company: p.co, location: shortLoc(p.loc), type,
    salary: "As per role",
    description: `${p.title} at ${p.co} (${p.loc}). Live requisition on the company's official job board${p.dept ? ` — team: ${p.dept}` : ""}. Apply directly on the employer's page. Tracked Sep 2026, auto-hidden 7 days after posting.`,
    applyLink: p.url, author: "uptools-curator", sector: sectorOf(p.title + " " + (p.dept || "")),
    createdAt: serverTimestamp(), expiresAt: Date.now() + WEEK,
  })
  ok++
}
console.log("inserted:", ok)
process.exit(0)

