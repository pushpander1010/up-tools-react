import { useState, useCallback } from "react";
import ToolLayout from "../components/ToolLayout";
import useJumpToResult from "../hooks/useJumpToResult";

const NAMES = [
  { n: "Aarav", g: "boy", o: "Hindu", m: "Peaceful sound" },
  { n: "Vihaan", g: "boy", o: "Hindu", m: "Dawn, morning light" },
  { n: "Arjun", g: "boy", o: "Hindu", m: "Bright, shining; warrior prince" },
  { n: "Krishna", g: "boy", o: "Hindu", m: "Divine, all-attractive" },
  { n: "Aditya", g: "boy", o: "Hindu", m: "The sun" },
  { n: "Kabir", g: "boy", o: "Muslim", m: "Great, powerful" },
  { n: "Zayan", g: "boy", o: "Muslim", m: "Bright, radiant" },
  { n: "Arman", g: "boy", o: "Sikh", m: "Desire, wish" },
  { n: "Harpreet", g: "boy", o: "Sikh", m: "One who loves God" },
  { n: "Aiden", g: "boy", o: "Western", m: "Little fire" },
  { n: "Anya", g: "girl", o: "Hindu", m: "Gracious, inexhaustible" },
  { n: "Diya", g: "girl", o: "Hindu", m: "Lamp, light" },
  { n: "Navya", g: "girl", o: "Hindu", m: "New, fresh" },
  { n: "Aadhya", g: "girl", o: "Hindu", m: "First power, goddess" },
  { n: "Sara", g: "girl", o: "Muslim", m: "Pure, happy" },
  { n: "Zara", g: "girl", o: "Muslim", m: "Radiance, flower" },
  { n: "Simran", g: "girl", o: "Sikh", m: "Remembrance of God" },
  { n: "Gurleen", g: "girl", o: "Sikh", m: "Absorbed in the Guru" },
  { n: "Ava", g: "girl", o: "Western", m: "Life, living one" },
  { n: "Mia", g: "girl", o: "Western", m: "Beloved, mine" },
  { n: "Reyansh", g: "boy", o: "Hindu", m: "Ray of light" },
  { n: "Myra", g: "girl", o: "Hindu", m: "Sweet, admirable" },
  { n: "Ryan", g: "boy", o: "Western", m: "Little king" },
  { n: "Ethan", g: "boy", o: "Western", m: "Strong, firm" },
];

export default function baby_name_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult();
  const [gender, setGender] = useState("any");
  const [origin, setOrigin] = useState("any");
  const [letter, setLetter] = useState("");
  const [seed, setSeed] = useState(1);

  const generate = useCallback(() => {
    let pool = NAMES.filter((x) =>
      (gender === "any" || x.g === gender) &&
      (origin === "any" || x.o === origin) &&
      (!letter || x.n.toLowerCase().startsWith(letter.toLowerCase()))
    );
    if (pool.length === 0) return null;
    const start = (seed * 7) % pool.length;
    const out = [];
    for (let i = 0; i < Math.min(8, pool.length); i++) out.push(pool[(start + i) % pool.length]);
    return out;
  }, [gender, origin, letter, seed]);

  const result = generate();
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]";

  return (
    <ToolLayout
      title="Baby Name Generator"
      desc="Baby Name Generator — find baby boy and girl names with meanings online free. Filter Indian and western names by gender, origin and letter. No login needed."
      icon="👶" iconBg="rgba(251,191,36,0.08)"
      category="tools" slug="baby-name-generator"
      faq={[
        { q: "How do I find baby names with meanings online free?", a: "Pick gender, origin and starting letter above, then tap Generate. You get 8 name ideas with meanings instantly, free with no login." },
        { q: "Does it show Hindu, Muslim, Sikh and Christian names?", a: "Yes. Filter by Hindu, Muslim, Sikh or Western origin to see names from each tradition with their meanings." },
        { q: "What are popular baby names in India in 2026?", a: "Aarav, Vihaan, Reyansh, Anya, Diya and Navya stay popular for Hindu families, while Kabir, Zara, Simran and Ava trend across communities." },
        { q: "Can I search names by starting letter?", a: "Yes. Type any letter to see only names beginning with it — handy for matching family traditions." },
        { q: "Do the names include meanings?", a: "Every name shows its meaning, so you can shortlist names that carry the meaning you want for your child." },
        { q: "Is this baby name generator free?", a: "Yes, completely free with no sign-up. Generate unlimited name ideas on any device." },
      ]}
      howItWorks={[
        "Choose boy, girl or any gender and an origin.",
        "Optionally type a starting letter.",
        "Tap Generate Names to see 8 ideas with meanings.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Baby Name Generator", "applicationCategory": "LifestyleApplication",
        "url": "https://www.uptools.in/baby-name-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputClass}>
                <option value="any">Boy + Girl</option>
                <option value="boy">Boy</option>
                <option value="girl">Girl</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Origin</label>
              <select value={origin} onChange={(e) => setOrigin(e.target.value)} className={inputClass}>
                <option value="any">All origins</option>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Sikh">Sikh</option>
                <option value="Western">Western</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Starting Letter (optional)</label>
            <input value={letter} onChange={(e) => setLetter(e.target.value.slice(0, 1))}
              placeholder="e.g. A" maxLength={1} className={inputClass} />
          </div>
        </div>

        <button onClick={() => { setSeed((s) => s + 1); jumpTo(); }}
          className="w-full py-4 rounded-2xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-400 transition-all duration-200 active:scale-[0.98]">
          Generate Names
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: "slideUp 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Name Ideas</h3>
            </div>
            <div className="space-y-3">
              {result.map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 gap-3">
                  <span className="font-bold text-white">{r.n}</span>
                  <span className="text-slate-400 text-sm text-right">{r.m} · {r.o}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">👶</div>
            <p className="text-sm text-slate-600 font-medium">No names match — try a different letter or origin</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
