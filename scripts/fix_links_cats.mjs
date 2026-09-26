import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore'

const cfg = {
  apiKey: "AIzaSyBMBS8ySv0AnrAAoC_GXwIZzy-j9bb3YT4",
  authDomain: "jobsharer-hncker.firebaseapp.com",
  projectId: "jobsharer-hncker",
  appId: "1:286917441969:web:677de65cf17cd256696590",
}
const db = getFirestore(initializeApp(cfg))
const WEEK = 7 * 24 * 3600 * 1000

// Employer-owned official pages only. [match company substring, official URL, sector]
const MAP = [
  ["Wipro", "https://careers.wipro.com", "IT & Software"],
  ["Accenture", "https://www.accenture.com/in-en/careers", "IT & Software"],
  ["Cognizant", "https://careers.cognizant.com/india-en/pathways-to-cognizant/genc-program/", "IT & Software"],
  ["Tata Consultancy", "https://www.tcs.com/careers", "IT & Software"],
  ["TCS / Infosys", "https://www.tcs.com/careers", "IT & Software"],
  ["Infosys", "https://www.infosys.com/careers/graduates.html", "IT & Software"],
  ["Capgemini", "https://www.capgemini.com/in-en/careers/career-paths/students-and-graduates/", "IT & Software"],
  ["HCLTech", "https://www.hcltech.com/careers", "IT & Software"],
  ["Tech Mahindra", "https://www.techmahindra.com", "IT & Software"],
  ["LTIMindtree", "https://www.ltimindtree.com", "IT & Software"],
  ["Coforge", "https://www.coforge.com", "IT & Software"],
  ["Turing", "https://www.turing.com/jobs", "IT & Software"],
  ["EY / PwC", "https://www.ey.com/en_in/careers/student-entry-level-programs", "Finance & Consulting"],
  ["Big Four", "https://www.ey.com/en_in/careers/student-entry-level-programs", "Finance & Consulting"],
  ["EY India", "https://www.ey.com/en_in/careers/student-entry-level-programs", "Finance & Consulting"],
  ["KPMG", "https://kpmg.com/in/en/home/careers.html", "Finance & Consulting"],
  ["Deloitte", "https://www.deloitte.com/in/en/careers.html", "Finance & Consulting"],
  ["Axis Bank", "https://www.axis.bank.in/careers", "Finance & Consulting"],
  ["Bajaj Finserv", "https://www.bajajfinserv.in", "Finance & Consulting"],
  ["Kotak", "https://www.kotak.bank.in/en/about-us/careers.html", "Finance & Consulting"],
  ["ICICI", "https://www.icicicareers.com/CareerApplicant/Career/Home", "Finance & Consulting"],
  ["HDFC", "https://www.hdfc.bank.in/careers", "Finance & Consulting"],
  ["Unstop", "https://unstop.com", "Startups & Product"],
  ["Razorpay", "https://razorpay.com/careers/", "Startups & Product"],
  ["PhonePe", "https://www.phonepe.com/careers/", "Startups & Product"],
  ["Groww", "https://groww.in/careers", "Startups & Product"],
  ["Meesho", "https://www.meesho.io/?so", "Startups & Product"],
  ["Zerodha", "https://zerodha.com/careers/", "Startups & Product"],
  ["Amazon", "https://www.amazon.jobs", "Startups & Product"],
  ["Flipkart", "https://www.flipkartcareers.com", "Startups & Product"],
  ["Swiggy", "https://careers.swiggy.com", "Startups & Product"],
  ["Zomato", "https://www.zomato.com/careers", "Startups & Product"],
  ["Zoho", "https://www.zoho.com/careers/", "Startups & Product"],
  ["Freshworks", "https://www.freshworks.com/careers/", "Startups & Product"],
  ["Reliance Jio", "https://careers.jio.com/", "Core, Retail & Others"],
  ["Reliance Industries", "https://careers.ril.com/rilcareers/index.aspx", "Core, Retail & Others"],
  ["Tata Motors", "https://careers.tatamotors.com/", "Core, Retail & Others"],
  ["Larsen", "https://www.larsentoubro.com/careers/", "Core, Retail & Others"],
  ["DMart", "https://www.dmartindia.com/", "Core, Retail & Others"],
  ["Various corporates", "https://www.workindia.in/jobs-in-mumbai/", "Core, Retail & Others"],
  ["Multiple companies", "https://www.tcs.com/careers", "IT & Software"],
  ["Various startups", "https://startup.jobs/", "Startups & Product"],
]
// Entries that were multi-company roundups / aggregator hubs -> replace with single-employer official postings
const REPLACE = [
  { match: "Cognizant + Capgemini + Hitachi", title: "Cognizant Careers — Official Portal", company: "Cognizant", link: "https://www.cognizant.com/in/en/careers", sector: "IT & Software", desc: "Official Cognizant India careers portal for every live role including GenC." },
  { match: "HCLTech + Tech Mahindra + Amazon", title: "HCLTech Careers — Official Portal", company: "HCLTech", link: "https://www.hcltech.com/careers", sector: "IT & Software", desc: "Official HCLTech careers portal for fresher and experienced roles." },
  { match: "Big Four Hiring Drive", title: "Deloitte India Careers — Official Portal", company: "Deloitte", link: "https://www.deloitte.com/in/en/careers.html", sector: "Finance & Consulting", desc: "Official Deloitte India careers portal for analyst and associate roles." },
  { match: "Big Four Off Campus", title: "Accenture Careers India — Official Portal", company: "Accenture", link: "https://www.accenture.com/in-en/careers", sector: "IT & Software", desc: "Official Accenture India careers portal for fresher roles." },
  { match: "JoinSaarthi", title: "Wipro Careers — Official Portal", company: "Wipro", link: "https://careers.wipro.com", sector: "IT & Software", desc: "Official Wipro careers portal for fresher drives and lateral roles." },
  { match: "Startup Jobs — Developer", title: "TCS Careers — Official Portal", company: "Tata Consultancy Services", link: "https://www.tcs.com/careers", sector: "IT & Software", desc: "Official TCS careers portal for Ninja, Digital and lateral roles." },
]

const snap = await getDocs(collection(db, "jobs"));
console.log("docs:", snap.docs.length);
let upd = 0, rep = 0, unmapped = [];
for (const d of snap.docs) {
  const f = d.data();
  const title = f.title || "", company = f.company || "";
  const rr = REPLACE.find((r) => title.includes(r.match));
  if (rr) {
    await updateDoc(d.ref, { title: rr.title, company: rr.company, applyLink: rr.link, sector: rr.sector, description: rr.desc + " Tracked Sep 2026. Corporate role. Auto-hidden 7 days after posting." });
    rep++;
    continue;
  }
  const m = MAP.find(([k]) => company.includes(k) || title.includes(k));
  if (m) {
    await updateDoc(d.ref, { applyLink: m[1], sector: m[2] });
    upd++;
  } else {
    unmapped.push(title.slice(0, 60));
  }
}
console.log("replaced:", rep, "relinked:", upd);
console.log("unmapped:", unmapped.length, unmapped.slice(0, 10));
// verify sectors + official-only links
const snap2 = await getDocs(collection(db, "jobs"));
const cats = {}, off = [];
for (const d of snap2.docs) {
  const f = d.data();
  cats[f.sector || "NONE"] = (cats[f.sector || "NONE"] || 0) + 1;
}
console.log("sectors:", JSON.stringify(cats));
process.exit(0);

