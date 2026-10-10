import ToolLayout from '../components/ToolLayout'
import CodeRunner from '../components/CodeRunner'

const DEFAULT_CODE = `# Online Python Compiler - UpTools
print("Hello from UpTools!")

for i in range(1, 6):
    print(f"Count: {i}")

total = sum([10, 20, 30])
print(f"Total: {total}")`

export default function online_python_compiler() {
  return (
    <ToolLayout
      title="Online Python Compiler"
      desc="Online Python Compiler - write and run Python 3 code in your browser free. Instant output, no sign-up, perfect for interview practice. Free online, no login."
      icon="🐍" iconBg="rgba(34,197,94,0.08)"
      category="dev" slug="online-python-compiler"
      faq={[
        { q: "How do I run Python code online free?", a: "Type or paste your Python code in the editor above and click Run. Your code runs instantly inside your browser and the output appears immediately, free with no sign-up." },
        { q: "Is this Online Python Compiler free?", a: "Yes, completely free with unlimited runs. No sign-up, no login, no watermark — use it as many times as you need." },
        { q: "Do I need to sign up or log in?", a: "No. Open the page and click Run. Nothing to install and no account needed, on mobile or desktop." },
        { q: "Can I use this for coding interview practice?", a: "Yes. Interviewers often ask candidates to open an online compiler and solve a problem live. This page is ideal for that — Python 3 with instant output." },
        { q: "How do I give input to my Python program?", a: "Put each input value on its own line in the Program input box. Your input() calls read from those lines in order." },
        { q: "Which Python version runs here?", a: "Your code runs on full Python 3.12 inside your browser, so there is no waiting and modern syntax like f-strings works." },
      ]}
      howItWorks={[
        'Type or paste your Python code in the editor.',
        'Add program input in the Stdin box if your code uses input().',
        'Click Run — output appears instantly, right beside your code.',
        'Read the output, fix any errors, and run again.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Online Python Compiler", "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "url": "https://www.uptools.in/online-python-compiler/",
      }}
    >
      <CodeRunner mode="pyodide" versionLabel="Python 3.12 · instant in-browser" defaultCode={DEFAULT_CODE} />
    </ToolLayout>
  )
}
