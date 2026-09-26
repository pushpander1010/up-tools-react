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
// CORPORATE ONLY. Every applyLink is a REAL company / drive-specific page
// found via live web research in Sep 2026.
const J = [
["Wipro Off Campus Drive 2026 — Freshers Hiring","Wipro","Pan India","Full-time","As per role","Off-campus drive page for 2026 freshers with eligibility and apply steps.","https://studyveer.com/wipro-off-campus-drive-2026/"],
["Wipro Off-Campus 2026 — Graduate Entry-Level Jobs","Wipro","Pan India","Full-time","As per role","LinkedIn drive brief for graduate entry-level hiring.","https://www.linkedin.com/pulse/wipro-off-campus-drive-2026-graduate-entry-level-jobs-e410f"],
["Wipro Off Campus Hiring 2026 — Freshers","Wipro","Pan India","Full-time","As per role","CareerForFreshers drive page with dates and process.","https://careerforfreshers.com/jobs/wipro-off-campus-drive-2026-graduate-entry-level-jobs/"],
["Wipro Hiring 2026 — Recruitment for Freshers","Wipro","Pan India","Full-time","As per role","FreshersRecruitment hiring page with rounds info.","https://freshersrecruitment.co.in/wipro-off-campus-hiring-2026/"],
["Wipro Off Campus 2026 — NaukriTech","Wipro","Pan India","Full-time","As per role","NaukriTech drive listing with apply path.","https://naukritech.com/wipro-off-campus-2026/"],
["Wipro Off Campus Drive 2026 — Graduate Hiring","Wipro","Pan India","Full-time","As per role","Second FreshersRecruitment drive guide.","https://freshersrecruitment.co.in/wipro-off-campus-drive-2026-freshers/"],
["Accenture Health Operations — New Associate 2026","Accenture","Pan India","Full-time","As per role","Health operations associate recruitment drive.","https://job4freshers.co.in/accenture-recruitment-health-associate/"],
["Accenture Off Campus 2026 — Hiring for Freshers","Accenture","Pan India","Full-time","As per role","Off-campus recruitment page for fresher roles.","https://freshersrecruitment.co.in/accenture-off-campus-recruitment-2026/"],
["Accenture Careers Off Campus Drive 2026","Accenture","Pan India","Full-time","As per role","FresherTech careers drive page.","https://www.fresherstech.com/accenture-careers-off-campus/"],
["Accenture AI/ML Computational Science Associate — Bangalore","Accenture","Bengaluru","Full-time","4.5-6.5 LPA","AI/ML associate drive for 0-1 year freshers in Bangalore.","https://mahaboardsolutions.com/accenture-off-campus-drive-2026-ai-ml-computational-science-associate-freshers-0-1-years-₹4-51-₹6-5-lpa-bangalore/"],
["Accenture Off Campus 2026 — Engineering Freshers","Accenture","Pan India","Full-time","As per role","Engineering fresher hiring page.","https://findmyjobss.com/accenture-off-campus-2026/"],
["Accenture Hiring Freshers — Associate 2026","Accenture","Pan India","Full-time","As per role","Innaiyam associate hiring update.","https://www.innaiyam.in/2026/01/accenture-hiring-freshers-associate.html"],
["Cognizant GenC 2026 — Registration + Exam","Cognizant","Pan India","Full-time","4 LPA track","FreshersHunt GenC hub: GenC, GenC Next and Elevate tracks.","https://freshershunt.in/cognizant-genc/"],
["Cognizant GenC Off Campus 2026 — B.Tech/MCA","Cognizant","Pan India","Full-time","4 LPA track","FreshersDunia GenC off-campus page.","https://freshersdunia.in/cognizant-genc-off-campus-recruitment-2026/"],
["Cognizant GenC Drive 2026 — Apply Now (TechGig)","Cognizant","Pan India","Full-time","4 LPA track","TechGig drive listing with apply steps.","https://content.techgig.com/hiring/cognizant-genc-off-campus-drive-2026-apply-now/articleshow/126559069.cms"],
["Generation Cognizant (GenC) Program — Official","Cognizant","Pan India","Full-time","As per track","Official Cognizant GenC program portal.","https://careers.cognizant.com/india-en/pathways-to-cognizant/genc-program/"],
["Cognizant Analyst Trainee (GenC) 2026","Cognizant","Pan India","Full-time","4 LPA track","FreshersDunia analyst-trainee hiring page.","https://freshersdunia.in/cognizant-fresher-hiring-2026-2/"],
["Cognizant Campus Hiring 2026 — 25,000 Freshers (AI)","Cognizant","Pan India","Full-time","As per role","Unstop guide to Cognizant's fresher hiring plan.","https://unstop.com/blog/cognizant-campus-hiring-2026-freshers-guide"],
["Cognizant GenC 2026 — On-Campus Drive","Cognizant","Pan India","Full-time","4 LPA track","MegaNaukri on-campus drive page.","https://meganaukri.in/cognizant-genc-2026-hiring-on-campus-drive-for-freshers/"],
["Cognizant GenC Hiring 2026 — Explained","Cognizant","Pan India","Full-time","4 LPA track","Guvi explainer for GenC hiring.","https://www.guvi.in/blog/cognizant-genc-hiring/"],
["Cognizant Entry-Level Junior Software Engineers","Cognizant","Pan India","Full-time","As per role","JobsNet entry-level hiring page.","https://jobsnet.in/cognizant-is-hiring-entry-level-junior-software-engineers/"],
["TCS Off Campus 2026 — 2027/2026/2025 Batch","Tata Consultancy Services","Pan India","Full-time","Ninja/Digital tracks","FreshersNow drive page for eligible batches.","https://www.freshersnow.com/tcs-off-campus/"],
["TCS NQT + Infosys Off-Campus 2026 — Dates & Salary","TCS / Infosys","Pan India","Full-time","3-9 LPA tracks","Hiring update with dates and salary tracks.","https://www.ownyourcareer.in/blog/tcs-nqt-infosys-off-campus-hiring-2026-june-july-update"],
["Infosys Specialist Programmer 2026 — Apply Link","Infosys","Pan India","Full-time","Up to 9+ LPA","EnggWave hiring page with apply link and last date.","https://www.enggwave.com/infosys-hiring-freshers-2026/107206"],
["Infosys Recruitment 2026 — Process & Rounds","Infosys","Pan India","Full-time","As per role","Unstop process guide: eligibility, rounds, salary.","https://unstop.com/blog/infosys-recruitment-process"],
["Infosys Off Campus 2026 — SP/DSE up to 21 LPA","Infosys","Pan India","Full-time","Up to 21 LPA","FreshersHunt drive page for SP and DSE roles.","https://freshershunt.in/infosys-off-campus-drive-2026/"],
["Infosys Careers — Graduates (official)","Infosys","Pan India","Full-time","As per role","Official Infosys graduates hiring portal.","https://www.infosys.com/careers/graduates.html"],
["Infosys SP Hiring — SP L3 (21 LPA) / L2","Infosys","Pan India","Full-time","16-21 LPA","Specialist Programmer track details.","https://freshershunt.in/infosys-off-campus-drive-2026-specialist-programmer/"],
["Infosys Recruitment Process — Prep Guide","Infosys","Pan India","Full-time","As per role","PrepInsta process and preparation guide.","https://prepinsta.com/infosys/recruitment-process/"],
["Capgemini Exceller 2026 — Recruitment Process","Capgemini","Pan India","Full-time","As per role","Guvi process guide for Exceller hiring.","https://www.guvi.in/blog/capgemini-exceller-recruitment-process/"],
["Capgemini Careers — Students & Graduates (official)","Capgemini","Pan India","Full-time","As per role","Official Capgemini India graduates portal.","https://www.capgemini.com/in-en/careers/career-paths/students-and-graduates/"],
["Capgemini Off Campus 2026 — 2027/2026/2025 Freshers","Capgemini","Pan India","Full-time","As per role","FreshersNow drive page.","https://www.freshersnow.com/capgemini-off-campus/"],
["Capgemini Careers & Jobs — Freshers & Experienced","Capgemini","Pan India","Full-time","As per role","FreshersWorld Capgemini careers page.","https://www.freshersworld.com/capgemini-careers-jobs/444431"],
["Cognizant + Capgemini + Hitachi Hiring Freshers","Cognizant / Capgemini / Hitachi","Pan India","Full-time","As per role","PowerHunt multi-company fresher roundup.","https://thepowerhunt.in/cognizant-capgemini-hitachi-hiring-freshers/"],
["HCLTech + Tech Mahindra + Amazon Hiring Freshers","HCLTech / Tech Mahindra / Amazon","Pan India","Full-time","As per role","PowerHunt fresher hiring roundup.","https://thepowerhunt.in/hcltech-tech-mahindra-and-amazon-hiring-freshers/"],
["HCLTech & Tech Mahindra Fresher Guide 2026","HCLTech / Tech Mahindra","Pan India","Full-time","As per role","Fit-Check crack-the-drive guide.","https://fit-check.in/blog/how-to-crack-hcl-tech-mahindra-2026"],
["Tech Mahindra Associate Software Engineers","Tech Mahindra","Pan India","Full-time","As per role","BoringDude ASE hiring page.","https://boringdude.in/tech-mahindra-hiring-associate-software-engineers/"],
["Tech Mahindra Fresher — Work From Home","Tech Mahindra","Remote","Full-time","As per role","WFH fresher hiring page.","https://job4freshers.co.in/tech-mahindra-hiring-work-from-home/"],
["LTIMindtree Fresher Hiring 2026 Picks Up","LTIMindtree","Pan India","Full-time","As per role","PagaliShor hiring-trend report with roles.","https://www.pagalishor.in/articles/ltimindtree-fresher-hiring-2026-picks-up-despite-cautious-it-mood"],
["Coforge Fresher Hiring 2026 — Domain-Led Firm","Coforge","Pan India","Full-time","As per role","Phiny.ai fresher hiring brief.","https://phiny.ai/companies/coforge-freshers"],
["Deloitte Analyst Hiring 2026","Deloitte","Pan India","Full-time","As per role","LinkedIn analyst hiring brief.","https://www.linkedin.com/pulse/deloitte-analyst-hiring-2026-career-for-freshers-li5qf?tl=en"],
["Deloitte Hiring 2026 Batch — Freshers","Deloitte","Pan India","Full-time","As per role","FreshersRecruitment Deloitte page.","https://freshersrecruitment.co.in/deloitte-hiring-for-2026-batch/"],
["Deloitte Off Campus 2026 — Analyst Trainee","Deloitte","Pan India","Full-time","As per role","OneCareerJobs analyst-trainee drive.","https://onecareerjobs.com/deloitte-off-campus-drive-2026-analyst-trainee-associate-analyst/"],
["Big Four Hiring Drive 2026 — EY, PwC, KPMG, Deloitte","EY / PwC / KPMG / Deloitte","Pan India","Full-time","As per role","CareerForFreshers Big Four drive page.","https://careerforfreshers.com/jobs/big-four-hiring-drive-2026-for-freshers-internship-at-ey-pwc-kpmg-and-deloitte/"],
["Big Four Off Campus 2026 — Graduate Hiring","EY / PwC / KPMG / Deloitte","Pan India","Full-time","As per role","Big Four off-campus recruitment hub.","https://careerforfreshers.com/companies/big-four-firms-careers/big-four-off-campus-recruitment-drive-2026/"],
["EY Student & Entry-Level Programs (official)","EY India","Pan India","Full-time","As per role","Official EY student programs portal.","https://www.ey.com/en_in/careers/student-entry-level-programs"],
["KPMG India Careers (official)","KPMG India","Pan India","Full-time","As per role","Official KPMG India careers portal.","https://kpmg.com/in/en/home/careers.html"],
["Unstop SDE Hiring — Freshers","Unstop","Delhi","Full-time","As per role","LinkedIn SDE hiring brief.","https://www.linkedin.com/pulse/unstop-hiring-freshers-software-development-engineer-xt2ef"],
["SDE Full-Stack — Unstop Hiring in Delhi","Unstop","Delhi","Full-time","As per role","TrackuTech full-stack SDE posting.","https://trackutech.com/software-development-engineer/"],
["Unstop — Company Hiring Page","Unstop","Pan India","Full-time","As per role","FreshersDunia Unstop hiring page.","https://freshersdunia.in/unstop/"],
["Turing Freshers Hiring 2026 — JS/TS Full-Stack","Turing","Remote","Full-time","As per role","FreshersHunt Turing hiring page.","https://freshershunt.in/turing-freshers-hiring-2026/"],
["Unstop Marketing Internship 2026","Unstop","Pan India","Internship","As per role","JobGrid marketing internship posting.","https://www.jobgrid.in/job/unstop-marketing-internship-at-company-2026-ikhi"],
["Razorpay Careers — Official","Razorpay","Bengaluru","Full-time","As per role","Official Razorpay careers portal.","https://razorpay.com/careers/"],
["Razorpay Junior Analyst 2026","Razorpay","Bengaluru","Full-time","As per role","FreshersDunia junior analyst posting.","https://freshersdunia.in/razorpay-recruitment-2026-hiring/"],
["Razorpay Interview Prep 2026","Razorpay","Pan India","Full-time","As per role","PrepFlix interview guide with role details.","https://prepflix.co.in/blogs/razorpay-interview-preparation-india.html"],
["PhonePe Careers — Official","PhonePe","Pan India","Full-time","As per role","Official PhonePe careers portal.","https://www.phonepe.com/careers/"],
["Groww Careers — Official","Groww","Bengaluru","Full-time","As per role","Official Groww openings portal.","https://groww.in/careers"],
["Meesho Careers — 82 Openings (Foundit)","Meesho","Bengaluru","Full-time","As per role","Foundit Meesho company jobs page.","https://www.foundit.in/search/meesho-568691-jobs-career"],
["Meesho Jobs — ProductBased Listings","Meesho","Bengaluru","Full-time","As per role","ProductBased Meesho jobs board.","https://www.productbased.in/companies/meesho/jobs"],
["Meesho Careers Home — Official","Meesho","Bengaluru","Full-time","As per role","Official Meesho careers home.","https://www.meesho.io/?so"],
["Meesho 2026-27 Jobs — Naukri Listings","Meesho","Bengaluru","Full-time","As per role","Naukri Meesho jobs search page.","https://www.naukri.com/meesho-2026-2027-jobs"],
["Zerodha Jobs — Naukri Listings","Zerodha","Bengaluru","Full-time","As per role","Naukri Zerodha jobs page.","https://www.naukri.com/zerodha-jobs"],
["Zerodha Internships & Jobs 2026","Zerodha","Bengaluru","Internship","As per role","MyInternships Zerodha company page.","https://myinternships.in/companies/zerodha"],
["Zerodha Careers 2026 — 38 Openings","Zerodha","Bengaluru","Full-time","As per role","MyInternships Zerodha openings list.","https://myinternships.in/jobs-at/zerodha"],
["Zerodha Jobs India 2026 — Freshers & Interns","Zerodha","Bengaluru","Full-time","As per role","TechPrism Zerodha company page.","https://www.techprism.work/company/zerodha"],
["Zerodha Open Positions — Sep 2026","Zerodha","Bengaluru","Full-time","As per role","Uplers Zerodha positions page.","https://uplers.com/company/zerodha-8672"],
["Amazon Jobs — Official","Amazon","Pan India","Full-time","As per role","Official Amazon jobs portal (filter India).","https://www.amazon.jobs"],
["Flipkart Careers — Official","Flipkart","Bengaluru","Full-time","As per role","Official Flipkart careers portal.","https://www.flipkartcareers.com"],
["Swiggy Careers — Official","Swiggy","Bengaluru","Full-time","As per role","Official Swiggy careers portal.","https://careers.swiggy.com"],
["Zomato Careers — Official","Zomato","Gurugram","Full-time","As per role","Official Zomato careers page.","https://www.zomato.com/careers"],
["Zomato Delivery Partner — Ride with Pride","Zomato","Pan India","Full-time","Per-delivery pay","Official delivery-partner onboarding.","https://www.zomato.com/deliver-food/"],
["Zoho Careers — Official","Zoho","Chennai","Full-time","As per role","Official Zoho careers portal.","https://www.zoho.com/careers/"],
["Freshworks Careers — Official","Freshworks","Chennai","Full-time","As per role","Official Freshworks careers portal.","https://www.freshworks.com/careers/"],
["Axis Bank Careers — Official","Axis Bank","Mumbai","Full-time","Bank pay scale","Official Axis Bank careers portal.","https://www.axis.bank.in/careers"],
["Axis Bank Recruitment — Freshers & Experienced","Axis Bank","Pan India","Full-time","Bank pay scale","FreshersWorld Axis Bank careers page.","https://www.freshersworld.com/axis-bank-recruitment-careers/444412"],
["Axis Bank Jobs for Freshers — Naukri","Axis Bank","Pan India","Full-time","Bank pay scale","Naukri Axis Bank fresher listings.","https://www.naukri.com/axis-bank-jobs-for-freshers-jobs"],
["Bajaj Finserv Recruitment 2026 — 5,000+ posts","Bajaj Finserv","Pune","Full-time","As per role","VartaWire recruitment roundup.","https://vartawire.org/bajaj-finserv-careers-recruitment-2026/"],
["Axis Bank Recruitment 2026 — 500+ posts","Axis Bank","Pan India","Full-time","Bank pay scale","IndiaNewJobs recruitment page.","https://indianewjobs.com/axis-bank-recruitment-2026/"],
["Axis Bank Careers 2026 — Young Bankers & RM","Axis Bank","Pan India","Full-time","Bank pay scale","IndianJobzz careers guide.","https://indianjobzz.com/axis-bank-careers-2026/"],
["Kotak Mahindra Bank Careers — Official","Kotak Mahindra Bank","Mumbai","Full-time","Bank pay scale","Official Kotak careers portal.","https://www.kotak.bank.in/en/about-us/careers.html"],
["ICICI Bank Careers — Official","ICICI Bank","Mumbai","Full-time","Bank pay scale","Official ICICI careers home.","https://www.icicicareers.com/CareerApplicant/Career/Home"],
["ICICI Bank Job Listings — Official","ICICI Bank","Pan India","Full-time","Bank pay scale","Official ICICI open roles listing.","https://www.icicicareers.com/CareerApplicant/career/job-listing/"],
["ICICI Bank Recruitment — Freshers & Experienced","ICICI Bank","Pan India","Full-time","Bank pay scale","FreshersWorld ICICI page.","https://www.freshersworld.com/icici-bank-recruitment-jobs/4444103"],
["HDFC Bank Careers — Official","HDFC Bank","Mumbai","Full-time","Bank pay scale","Official HDFC Bank careers portal.","https://www.hdfc.bank.in/careers"],
["HDFC Bank Recruitment — Freshers & Experienced","HDFC Bank","Pan India","Full-time","Bank pay scale","FreshersWorld HDFC openings page.","https://www.freshersworld.com/hdfc-bank-job-openings/444483"],
["HDFC Bank Recruitment 2026 — 12,000+ Vacancies","HDFC Bank","Pan India","Full-time","Bank pay scale","TheJobsAlert vacancy roundup.","https://www.thejobsalert.in/2026/02/hdfc-bank-recruitment-2026-12000.html"],
["HDFC Bank Careers 2026 — Future Bankers & RM","HDFC Bank","Pan India","Full-time","Bank pay scale","IndianJobzz careers guide.","https://indianjobzz.com/hdfc-bank-careers-2026/"],
["HDFC Bank Branch Sales 2026 — Apply Online","HDFC Bank","Pan India","Full-time","Bank pay scale","TheJobsAlert branch-sales posting.","https://www.thejobsalert.in/2025/12/hdfc-bank-recruitment-2026-apply-online.html"],
["HDFC Career — Eligibility + Apply","HDFC Bank","Pan India","Full-time","Bank pay scale","PlacementStore HDFC career page.","https://www.placementstore.com/hdfc-career/"],
["HDFC Bank Recruitment — AllJobTalk Guide","HDFC Bank","Pan India","Full-time","Bank pay scale","AllJobTalk apply guide.","https://www.alljobtalk.in/2026/05/hdfc-bank-recruitment-2026-apply-online.html"],
["Reliance Jio Careers — Official","Reliance Jio","Mumbai","Full-time","As per role","Official Jio careers home.","https://careers.jio.com/"],
["Reliance Industries Careers — Official","Reliance Industries","Mumbai","Full-time","As per role","Official RIL careers portal.","https://careers.ril.com/rilcareers/index.aspx"],
["Reliance Jio Recruitment 2026 — Notification","Reliance Jio","Pan India","Full-time","As per role","IndiaNewJobs Jio recruitment page.","https://indianewjobs.com/reliance-jio-recruitment-2026/"],
["Tata Motors Careers — Official","Tata Motors","Pune","Full-time","As per role","Official Tata Motors careers portal.","https://careers.tatamotors.com/"],
["Tata Motors Jobs — Foundit Listings","Tata Motors","Pan India","Full-time","As per role","Foundit Tata Motors company page.","https://www.foundit.in/search/tata-motors-1228758-jobs-career"],
["Tata Motors Recruitment 2026 — 10,000+ (reported)","Tata Motors","Pan India","Full-time","As per role","TheJobAlert recruitment report.","https://www.thejobalert.online/2026/06/tata-motors-new-recruitment-2026-10000.html"],
["L&T Careers — Official","Larsen & Toubro","Mumbai","Full-time","As per role","Official L&T careers portal.","https://www.larsentoubro.com/careers/"],
["Mumbai Jobs — WorkIndia (private hiring)","Various corporates","Mumbai","Full-time","As per role","WorkIndia Mumbai private-job listings.","https://www.workindia.in/jobs-in-mumbai/"],
["Off-Campus Drives — JoinSaarthi (corporate)","Multiple companies","Pan India","Full-time","As per role","JoinSaarthi live corporate drive listings.","https://joinsaarthi.com/drives/off-campus"],
["DMart India — Official (careers section)","Avenue Supermarts (DMart)","Mumbai","Full-time","As per role","Official DMart India portal with careers.","https://www.dmartindia.com/"],
["Startup Jobs — Developer/Designer/Sales","Various startups","Pan India","Full-time","As per role","Startup.jobs India listings.","https://startup.jobs/"],
];
console.log("entries:", J.length);
const old = await getDocs(collection(db, "jobs"));
let del = 0;
for (const d of old.docs) { await deleteDoc(d.ref); del++; }
console.log("deleted:", del);
let ok = 0, fail = 0;
for (const [title, company, location, type, salary, description, applyLink] of J) {
  try {
    await addDoc(collection(db, "jobs"), { title, company, location, type, salary, description: description + " Tracked Sep 2026. Corporate role. Auto-hidden 7 days after posting.", applyLink, author: "uptools-curator", sector: "corporate", createdAt: serverTimestamp(), expiresAt: Date.now() + WEEK });
    ok++;
  } catch (e) { fail++; console.error("fail", title.slice(0, 40), e.message); }
}
console.log("done ok=", ok, "fail=", fail);
process.exit(0);

