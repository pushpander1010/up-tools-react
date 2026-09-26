// Daily scraper: pulls live Indian postings from ATS APIs (Greenhouse/Lever)
// + fresher drive RSS feeds, Laya-gates each, dedupes vs Firestore, posts new.
// Run: node scripts/daily_scrape.mjs
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
const DAY = 24 * 3600 * 1000
const UA = { "User-Agent": "Mozilla/5.0 (UpTools Job Bot)" }
const CITIES = ["bengaluru","bangalore","mumbai","delhi","noida","gurgaon","gurugram","hyderabad","chennai","pune","kolkata","jaipur","goa","kochi","ahmedabad","indore","chandigarh","bhubaneswar","coimbatore","mysuru","mysore","nagpur","lucknow","kanpur","surat","vadodara","trivandrum","kota","dehradun","remote","pan india","india"]
const BADLOC = ["dubai","singapore","london","new york","austin","seattle","san francisco","toronto","sydney","dublin","bath","london"]
const inIndia = (l) => { const s = (l || "").toLowerCase(); return CITIES.some((c) => s.includes(c)) && !BADLOC.some((b) => s.includes(b)); }
const COS = ["tcs","infosys","wipro","hcltech","tech mahindra","accenture","cognizant","capgemini","ltimindtree","coforge","deloitte"," ey","kpmg","razorpay","phonepe","groww","meesho","zerodha","cred","paytm","amazon","flipkart","swiggy","zomato","zoho","freshworks","turing","unstop","axis bank","hdfc","icici","kotak","bajaj","reliance","jio","tata motors","l&t","larsen","dmart","hitachi","oracle","ibm","samsung","lg","sony","dell","hp","cisco","adobe","salesforce","uber","ola","makemytrip","yatra","policybazaar","lenskart","delhivery","nykaa","myntra"]
const FIN = /(risk|fraud|credit|audit|treasury|compliance|legal|collection|recoveries|financ|accounting|lending)/i
const TECH = /(engineer|sde|developer|software|\bdata\b|analy|\bai\b|\bml\b|qa\b|test|devops|sre|design|ui\b|ux\b|frontend|backend|full.?stack|mobile|ios|android|architect|scientist|security|builder|platform|cloud|product manager|pdm|sdet|nurse|support engineer)/i
const SCAM = [/earn \d+.*per day/i, /no work.*salary/i, /crypto.*doubl/i, /forex.*profit/i, /pay.*fee.*(job|joining)/i, /registration fee.*job/i, /adult/i, /betting/i, /send.*money.*job/i, /advance.*payment.*job/i]
const SIG = [/hiring/i, /vacan/i, /apply/i, /salary/i, /experience/i, /fresher/i, /walk.?in/i, /interview/i, /resume/i, /recruit/i, /opening/i, /role/i, /drive/i, /eligibility/i, /engineer/i, /developer/i, /analyst/i, /associate/i, /trainee/i, /notification/i]
function laya(t) {
  t = String(t || "");
  for (const re of SCAM) if (re.test(t)) return { ok: false, why: "scam-pattern" };
  if (t.length < 40) return { ok: false, why: "too-short" };
  if (!SIG.some((re) => re.test(t))) return { ok: false, why: "no-job-signals" };
  return { ok: true };
}
const sectorOf = (t) => FIN.test(t) ? "Finance & Risk" : TECH.test(t) ? "IT & Software" : "Business & Operations"
const shortLoc = (l) => {
  if (/remote/i.test(l || "")) return "Remote";
  const m = (l || "").match(/(Bengaluru|Bangalore|Mumbai|Delhi|Noida|Gurgaon|Gurugram|Hyderabad|Chennai|Pune|Kolkata|Jaipur|Goa|Kochi|Ahmedabad|Bhubaneswar|Pan India)/i);
  return m ? m[1].replace("Bangalore", "Bengaluru").replace("Gurgaon", "Gurugram") : "Pan India";
}
const coOf = (t) => { const s = " " + (t || "").toLowerCase(); const f = COS.find((c) => s.includes(c === " ey" ? " ey " : c)); return f ? f.trim().replace(/^./, (x) => x.toUpperCase()).replace(" ey", "EY") : ""; };

async function ats() {
  const out = [];
  const gh = async (board, co, eu) => {
    const r = await fetch(`https://boards-api.greenhouse.io/v1/boards/${board}/jobs?content=false`, { headers: UA });
    const d = await r.json();
    for (const j of d.jobs || []) {
      const loc = (j.location || {}).name || "";
      if (!inIndia(loc)) continue;
      out.push({ title: j.title, company: co, location: shortLoc(loc), type: /intern/i.test(j.title) ? "Internship" : "Full-time", salary: "As per role", description: `${j.title} at ${co} (${loc}). Live requisition on the company's official job board.`, applyLink: j.absolute_url, dept: ((j.departments || [])[0] || {}).name || "" });
    }
  };
  const lever = async (co, label) => {
    const r = await fetch(`https://api.lever.co/v0/postings/${co}?mode=json`, { headers: UA });
    const d = await r.json();
    for (const j of d) {
      const loc = ((j.categories || {}).location) || "";
      if (!inIndia(loc)) continue;
      out.push({ title: j.text, company: label, location: shortLoc(loc), type: /intern/i.test(j.text) ? "Internship" : "Full-time", salary: "As per role", description: `${j.text} at ${label} (${loc}). Live requisition on the company's official job board.`, applyLink: j.hostedUrl, dept: ((j.categories || {}).team) || "" });
    }
  };
  await gh("razorpaysoftwareprivatelimited", "Razorpay");
  await gh("groww", "Groww");
  for (const [c, l] of [["cred", "Cred"], ["meesho", "Meesho"], ["paytm", "Paytm"]]) await lever(c, l);
  return out;
}

async function rss() {
  const out = [];
  const feeds = [["https://freshershunt.in/feed/", "FreshersHunt"], ["https://freshersdunia.in/feed/", "FreshersDunia"], ["https://www.freshersnow.com/feed/", "FreshersNow"], ["https://www.freshersworld.com/feed", "FreshersWorld"]];
  for (const [url, src] of feeds) {
    try {
      const r = await fetch(url, { headers: UA });
      const t = await r.text();
      const items = [...t.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 25);
      for (const [, it] of items) {
        const g = (re) => { const m = it.match(re); return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : ""; };
        const title = g(/<title>([\s\S]*?)<\/title>/).slice(0, 140);
        const link = g(/<link>([\s\S]*?)<\/link>/).split(" ")[0];
        const pub = new Date(g(/<pubDate>([\s\S]*?)<\/pubDate>/) || 0).getTime();
        if (!title || !link.startsWith("http")) continue;
        if (Date.now() - pub > 3 * DAY) continue; // fresh only
        const co = coOf(title) || src + " Drive";
        const lm = title.match(/(Bengaluru|Bangalore|Mumbai|Delhi|Noida|Gurgaon|Gurugram|Hyderabad|Chennai|Pune|Kolkata|Jaipur|Remote|Pan India|Work From Home|WFH)/i);
        out.push({ title, company: co, location: lm ? shortLoc(lm[1]) : "Pan India", type: /intern/i.test(title) ? "Internship" : "Full-time", salary: "As per posting", description: `${title}. Drive posting via ${src}. Open the page for eligibility, dates and the official apply link.`, applyLink: link, dept: "" });
      }
    } catch (e) { console.log("feed fail", src, e.message); }
  }
  return out;
}

const snap = await getDocs(collection(db, "jobs"));
const seen = new Set(snap.docs.map((d) => d.data().applyLink));
console.log("existing:", seen.size);
const [a, b] = await Promise.all([ats(), rss()]);
console.log("scraped ats:", a.length, "rss:", b.length);
let added = 0, skipped = 0;
for (const j of [...a, ...b]) {
  if (added >= 40) break;
  if (!j.applyLink || seen.has(j.applyLink)) { skipped++; continue; }
  const chk = laya(`${j.title} ${j.company} ${j.description} ${j.applyLink}`);
  if (!chk.ok) { skipped++; continue; }
  await addDoc(collection(db, "jobs"), { ...j, author: "uptools-daily-bot", sector: sectorOf(j.title + " " + j.dept), createdAt: serverTimestamp(), expiresAt: Date.now() + WEEK });
  seen.add(j.applyLink);
  added++;
}
// hygiene: drop docs older than 30 days
let pruned = 0;
const now = Date.now();
for (const d of (await getDocs(collection(db, "jobs"))).docs) {
  const c = d.data().createdAt?.toMillis?.() || 0;
  if (c && now - c > 30 * DAY) { await deleteDoc(d.ref); pruned++; }
}
console.log(JSON.stringify({ added, skipped, pruned, total: seen.size + added }));
process.exit(0);

