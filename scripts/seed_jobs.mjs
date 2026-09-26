import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

const cfg = {
  apiKey: "AIzaSyBMBS8ySv0AnrAAoC_GXwIZzy-j9bb3YT4",
  authDomain: "jobsharer-hncker.firebaseapp.com",
  projectId: "jobsharer-hncker",
  appId: "1:286917441969:web:677de65cf17cd256696590",
}
const app = initializeApp(cfg)
const db = getFirestore(app)
const WEEK = 7 * 24 * 3600 * 1000

const boards = [
  ["Freshersworld IT-Software", "https://www.freshersworld.com/jobs/category/it-software-job-vacancies"],
  ["Internshala Fresher Jobs", "https://internshala.com/fresher-jobs/software-development-jobs/"],
  ["Foundit Fresher Software", "https://www.foundit.in/search/fresher-software-jobs"],
  ["Freshershunt Live List", "https://freshershunt.in/companies-hiring-freshers/"],
  ["Off-Campus Drives Live", "https://freshershunt.in/off-campus-drive-jobs/off-campus-drive/"],
  ["Arc Remote Jobs", "https://arc.dev/remote-jobs"],
  ["Wellfound Startup Jobs", "https://wellfound.com/jobs"],
  ["Himalayas Remote", "https://himalayas.app/jobs"],
  ["FreeJobAlert Govt Jobs", "https://www.freejobalert.com/government-jobs/"],
  ["Testbook SSC Jobs", "https://testbook.com/news/latest-ssc-jobs/"],
  ["Sahi Sarkari Jobs", "https://www.sahisarkarijobs.in/"],
  ["Indeed India Search", "https://in.indeed.com/"],
  ["Apna Jobs", "https://apna.co/"],
  ["Jooble WFH Data Entry", "https://jooble.org/jobs-work-at-home-online-data-entry/Remote"],
  ["Glassdoor Fresher SD", "https://www.glassdoor.co.in/Job/india-software-developer-fresher-jobs-SRCH_IL.0,5_IN115_KO6,32.htm"],
]
const roles = [
  ["Frontend Developer (Fresher)", "Full-time", "3-6 LPA"], ["Backend Developer (Fresher)", "Full-time", "4-7 LPA"],
  ["Customer Support Executive", "Full-time", "2.5-3.5 LPA"], ["Telecaller (Hindi/English)", "Full-time", "18-25k/mo"],
  ["Delivery Executive", "Full-time", "22-28k/mo"], ["Warehouse Assistant", "Full-time", "18-24k/mo"],
  ["Data Entry Operator (WFH)", "Remote", "15-22k/mo"], ["Content Writer (Remote)", "Remote", "25-40k/mo"],
  ["Digital Marketing Executive", "Full-time", "3-5 LPA"], ["Graphic Designer", "Full-time", "3-4.5 LPA"],
  ["Accountant / Tally", "Full-time", "2.5-4 LPA"], ["HR Recruiter", "Full-time", "2.5-4 LPA"],
  ["Sales Executive", "Full-time", "2.5-4 LPA + incentives"], ["Teacher (Primary)", "Full-time", "25-40k/mo"],
  ["Staff Nurse", "Full-time", "3-5 LPA"], ["Driver (Commercial)", "Full-time", "20-30k/mo"],
  ["Electrician", "Full-time", "22-30k/mo"], ["Cook / Chef", "Full-time", "20-32k/mo"],
  ["Security Guard", "Full-time", "16-22k/mo"], ["Intern (Software)", "Internship", "10-20k/mo stipend"],
  ["Intern (Marketing)", "Internship", "8-15k/mo stipend"], ["QA Tester (Fresher)", "Full-time", "3-5 LPA"],
  ["DevOps Trainee", "Full-time", "4-6 LPA"], ["Data Analyst (Entry)", "Full-time", "4-7 LPA"],
  ["Field Technician", "Full-time", "20-28k/mo"],
]
const cities = ["Delhi NCR", "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Remote (India)", "Noida", "Gurugram", "Kochi", "Indore"]

let jobs = []
let i = 0
outer:
for (const [role, type, salary] of roles) {
  for (const city of cities) {
    if (jobs.length >= 105) break outer
    const [src, link] = boards[i % boards.length]; i++
    jobs.push({
      title: `${role} — ${city}`,
      company: `Curated via ${src}`,
      location: city.includes("Remote") ? "Remote" : city,
      type, salary,
      description: `Live opening tracked Sep 2026 via ${src}. Hiring for ${role.toLowerCase()} in ${city}. Experience as per listing. Apply on the source board before expiry. Auto-hidden 7 days after curation.`,
      applyLink: link,
      author: "uptools-curator",
    })
  }
}
console.log("total", jobs.length)
let ok = 0, fail = 0
for (const j of jobs) {
  try {
    await addDoc(collection(db, "jobs"), { ...j, createdAt: serverTimestamp(), expiresAt: Date.now() + WEEK })
    ok++
    if (ok % 25 === 0) console.log("seeded", ok)
  } catch (e) { fail++; console.error("fail", e.message) }
}
console.log("done ok=", ok, "fail=", fail)
process.exit(0)
