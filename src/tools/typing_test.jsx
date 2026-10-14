import { useState, useCallback, useEffect, useRef } from "react";
import ToolLayout from "../components/ToolLayout";
import useJumpToResult from "../hooks/useJumpToResult";

const WORDS = ("time people way day man thing woman life child world school state family student group country part place case week company work home water room money story fact month lot right study book eye job word business issue side kind head house service friend father power hour game line end member law car community name team minute idea kid body information back parent face others level office door health person art war history party result change morning reason research girl guy moment air teacher force foot boy age process music market sense service nation plan room figure").split(" ");

function sampleWords(n, salt) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(WORDS[(salt * 31 + i * 17) % WORDS.length]);
  return out;
}

export default function typing_test() {
  const { ref: resultRef, jumpTo } = useJumpToResult();
  const [duration, setDuration] = useState(60);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [words, setWords] = useState(() => sampleWords(80, 1));
  const [input, setInput] = useState("");
  const [left, setLeft] = useState(60);
  const [round, setRound] = useState(1);
  const timer = useRef(null);

  const stopTimer = useCallback(() => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
  }, []);

  useEffect(() => stopTimer, [stopTimer]);

  const start = useCallback((secs) => {
    stopTimer();
    setWords(sampleWords(80, Date.now() % 1000));
    setInput("");
    setLeft(secs);
    setStarted(true);
    setFinished(false);
    timer.current = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          stopTimer();
          setFinished(true);
          setStarted(false);
          return 0;
        }
        return l - 1;
      });
    }, 1000);
  }, [stopTimer]);

  const stats = useCallback(() => {
    const typed = input.trim().split(/\s+/).filter(Boolean);
    let correct = 0;
    typed.forEach((w, i) => { if (w === words[i]) correct += 1; });
    const chars = input.replace(/ /g, "").length;
    const elapsed = Math.max(1, duration - left);
    const wpm = Math.round((chars / 5 / elapsed) * 60);
    const acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
    return { wpm: Math.max(0, wpm), acc, correct, total: typed.length, chars };
  }, [input, words, duration, left]);

  const s = finished ? stats() : null;
  const typedWords = input.split(" ");
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]";

  return (
    <ToolLayout
      title="Typing Speed Test"
      desc="Typing Speed Test — check typing speed (WPM) and accuracy online free. 60-second test with live words, instant WPM result and free practice. No login needed."
      icon="⌨️" iconBg="rgba(148,163,184,0.08)"
      category="tools" slug="typing-test"
      faq={[
        { q: "How do I check my typing speed online free?", a: "Pick a duration and tap Start, then type the shown words. The test tracks WPM and accuracy live and shows your final score free with no login." },
        { q: "What is a good typing speed WPM?", a: "Average is about 40 WPM. Above 60 WPM is good for office work, and above 80 WPM is professional level. Practice daily to gain 10 to 15 WPM in a month." },
        { q: "How is WPM calculated?", a: "WPM equals characters typed divided by 5, divided by minutes elapsed. Accuracy is correct words divided by total words typed." },
        { q: "How can I increase typing speed?", a: "Keep fingers on home row, look at the screen not the keyboard, and practice 10 minutes daily. Accuracy first — speed follows automatically." },
        { q: "Does it work on mobile?", a: "Yes, the test works with mobile keyboards too, though WPM will read lower than on a physical keyboard." },
        { q: "Is this typing test free?", a: "Yes, completely free with no sign-up. Retake it unlimited times on any device." },
      ]}
      howItWorks={[
        "Choose test duration: 30, 60 or 120 seconds.",
        "Tap Start Test and type the displayed words.",
        "Get instant WPM, accuracy and character stats when time ends.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Typing Speed Test", "applicationCategory": "EducationalApplication",
        "url": "https://www.uptools.in/typing-test/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex gap-3 items-center">
          <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} disabled={started} className={inputClass}>
            <option value={30}>30 seconds</option>
            <option value={60}>60 seconds</option>
            <option value={120}>120 seconds</option>
          </select>
          <button onClick={() => { setRound((r) => r + 1); start(duration); jumpTo(); }}
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-slate-200 text-slate-900 font-bold text-sm hover:bg-white transition-all duration-200 active:scale-[0.98]">
            {started ? "Restart" : "Start Test"}
          </button>
        </div>

        {(started || finished) && (
          <div key={round} ref={resultRef} className="rounded-3xl border-2 border-slate-400/15 bg-white/[0.02] p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-400">Time left: <span className="text-white text-lg">{left}s</span></span>
              {started && <span className="text-xs font-bold text-slate-500">Type below</span>}
            </div>
            <p className="text-lg leading-8 text-slate-300 font-medium">
              {words.slice(0, 40).map((w, i) => {
                const t = typedWords[i];
                let cls = "text-slate-500";
                if (t !== undefined && i < typedWords.length - (input.endsWith(" ") ? 0 : 1)) cls = t === w ? "text-green-400" : "text-rose-400";
                else if (i === typedWords.length - (input.endsWith(" ") ? 0 : 1)) cls = "text-white bg-white/10 rounded px-1";
                return <span key={i} className={cls}>{w} </span>;
              })}
            </p>
            {!finished ? (
              <textarea value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Start typing here..." rows={3} className={inputClass} autoFocus />
            ) : s && (
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { label: "WPM", value: String(s.wpm) },
                  { label: "Accuracy", value: s.acc + "%" },
                  { label: "Correct Words", value: s.correct + "/" + s.total },
                ].map((r, i) => (
                  <div key={i} className="text-center rounded-2xl border border-white/8 bg-white/[0.03] py-4">
                    <div className="text-2xl font-bold text-white">{r.value}</div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">{r.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {!started && !finished && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">⌨️</div>
            <p className="text-sm text-slate-600 font-medium">Pick a duration and tap Start Test to measure your speed</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
