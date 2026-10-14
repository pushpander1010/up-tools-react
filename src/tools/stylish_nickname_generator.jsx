import { useState, useCallback } from "react";
import ToolLayout from "../components/ToolLayout";
import useJumpToResult from "../hooks/useJumpToResult";

function shiftBlock(s, upper, lower, digit) {
  return s.split("").map((ch) => {
    const c = ch.codePointAt(0);
    if (c >= 65 && c <= 90) return String.fromCodePoint(upper + (c - 65));
    if (c >= 97 && c <= 122) return String.fromCodePoint(lower + (c - 97));
    if (c >= 48 && c <= 57 && digit) return String.fromCodePoint(digit + (c - 48));
    return ch;
  }).join("");
}

const STYLES = [
  { name: "Bold", fn: (s) => shiftBlock(s, 0x1d400, 0x1d41a, 0x1d7ce) },
  { name: "Monospace", fn: (s) => shiftBlock(s, 0x1d670, 0x1d68a, 0x1d7f6) },
  { name: "Circled", fn: (s) => shiftBlock(s, 0x24b6, 0x24d0, null).replace(/[0-9]/g, (d) => (d === "0" ? "⓪" : String.fromCodePoint(0x2460 + (parseInt(d) - 1)))) },
  { name: "Leet", fn: (s) => s.replace(/a/gi, "4").replace(/e/gi, "3").replace(/i/gi, "1").replace(/o/gi, "0").replace(/s/gi, "5").replace(/t/gi, "7") },
  { name: "Strike", fn: (s) => s.split("").map((ch) => ch + "̶").join("") },
  { name: "Slash", fn: (s) => s.split("").map((ch) => ch + "̷").join("") },
];

const DECOR = ["꧁", "★", "⚡", "🔥", "♛", "༒"];
const DECOR_END = ["꧂", "★", "⚡", "🔥", "♛", "༒"];

export default function stylish_nickname_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult();
  const [name, setName] = useState("Shadow");
  const [copied, setCopied] = useState(-1);

  const generate = useCallback(() => {
    const base = (name || "").trim();
    if (!base) return null;
    return STYLES.map((st, i) => ({
      style: st.name,
      text: DECOR[i % DECOR.length] + " " + st.fn(base) + " " + DECOR_END[i % DECOR_END.length],
    }));
  }, [name]);

  const result = generate();
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]";

  const copy = (t, i) => {
    try { navigator.clipboard.writeText(t); } catch (e) { /* clipboard unavailable */ }
    setCopied(i);
    setTimeout(() => setCopied(-1), 1500);
  };

  return (
    <ToolLayout
      title="Stylish Nickname Generator"
      desc="Stylish Nickname Generator — make stylish names for BGMI, Free Fire and Instagram online free. Fancy fonts with symbols, copy any style in one tap. No login needed."
      icon="✨" iconBg="rgba(192,132,252,0.08)"
      category="fun" slug="stylish-nickname-generator"
      faq={[
        { q: "How do I make a stylish name for BGMI online free?", a: "Type your name above. The generator creates 6 stylish versions with fancy fonts and symbols — tap any result to copy it into BGMI or Free Fire." },
        { q: "What stylish fonts are included?", a: "Bold, monospace, circled, leet-speak, strikethrough and slash styles, each decorated with gaming symbols." },
        { q: "Can I use these names on Instagram?", a: "Yes. The styled text is plain Unicode, so it pastes into Instagram bio, display names, WhatsApp and Discord." },
        { q: "Why do some fonts show boxes on my phone?", a: "Very old devices lack newer Unicode blocks. Bold and leet styles work almost everywhere — prefer those for game names." },
        { q: "Is this nickname generator free?", a: "Yes, completely free with no sign-up. Create and copy unlimited stylish names." },
        { q: "Can I use symbols in Free Fire nicknames?", a: "Free Fire accepts most Unicode symbols shown here. If one symbol is rejected in-game, try the bold or leet version." },
      ]}
      howItWorks={[
        "Type your name or gaming nickname.",
        "Browse 6 stylish font versions with symbols.",
        "Tap any style to copy it for BGMI, Free Fire or Instagram.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Stylish Nickname Generator", "applicationCategory": "GameApplication",
        "url": "https://www.uptools.in/stylish-nickname-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-400 mb-2">Your Name / Nickname</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Shadow" maxLength={24} className={inputClass} />
        </div>

        <button onClick={jumpTo}
          className="w-full py-4 rounded-2xl bg-purple-500 text-white font-bold text-sm hover:bg-purple-400 transition-all duration-200 active:scale-[0.98]">
          Style My Name
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-purple-500/15 bg-gradient-to-br from-purple-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: "slideUp 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Tap to Copy</h3>
            </div>
            <div className="space-y-3">
              {result.map((r, i) => (
                <button key={i} onClick={() => copy(r.text, i)}
                  className="w-full flex justify-between items-center py-3 px-4 rounded-xl border border-white/8 bg-white/[0.03] hover:border-purple-500/40 transition-all text-left">
                  <span>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">{r.style}</span>
                    <span className="block font-bold text-white text-lg">{r.text}</span>
                  </span>
                  <span className="text-xs font-bold text-purple-400 shrink-0 ml-3">{copied === i ? "Copied" : "Copy"}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">✨</div>
            <p className="text-sm text-slate-600 font-medium">Type a name to generate stylish versions</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
