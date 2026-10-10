import ToolLayout from '../components/ToolLayout'
import CodeRunner from '../components/CodeRunner'

const DEFAULT_CODE = `// Online JavaScript Compiler - UpTools
console.log("Hello from UpTools!");

for (let i = 1; i <= 5; i++) {
  console.log("Count: " + i);
}

const total = [10, 20, 30].reduce((a, b) => a + b, 0);
console.log("Total: " + total);`

export default function online_javascript_compiler() {
  return (
    <ToolLayout
      title="Online JavaScript Compiler"
      desc="Online JavaScript Compiler - write and run JavaScript code in your browser free. Instant output, no sign-up needed. Free online, no login."
      icon="🟨" iconBg="rgba(250,204,21,0.08)"
      category="dev" slug="online-javascript-compiler"
      faq={[
        { q: "How do I run JavaScript code online free?", a: "Type or paste your JavaScript code in the editor above and click Run. Your code runs instantly inside your browser and the output appears immediately, free with no sign-up." },
        { q: "Is this Online JavaScript Compiler free?", a: "Yes, completely free with unlimited runs. No sign-up, no login — use it as many times as you need." },
        { q: "Do I need to sign up or log in?", a: "No. Open the page and click Run. Nothing to install and no account needed, on mobile or desktop." },
        { q: "Can I use this for coding interview practice?", a: "Yes. Interviewers often ask candidates to open an online compiler and solve a problem live. This page is ideal for that — instant output with no waiting." },
        { q: "Does this support modern JavaScript syntax?", a: "Yes. Your code runs on your browser's JavaScript engine, so arrow functions, async and await, optional chaining, and modern syntax all work." },
        { q: "How do I give input to my JavaScript program?", a: "Put each input value on its own line in the Program input box. Your program can read the lines from the inputLines array." },
      ]}
      howItWorks={[
        'Type or paste your JavaScript code in the editor.',
        'Add program input in the Stdin box if your code reads input.',
        'Click Run — output appears instantly, right beside your code.',
        'Read the output, fix any errors, and run again.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Online JavaScript Compiler", "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "url": "https://www.uptools.in/online-javascript-compiler/",
      }}
    >
      <CodeRunner mode="local-js" versionLabel="JavaScript · instant in-browser" defaultCode={DEFAULT_CODE} />
    </ToolLayout>
  )
}
