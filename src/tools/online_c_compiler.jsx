import ToolLayout from '../components/ToolLayout'
import CodeRunner from '../components/CodeRunner'

const DEFAULT_CODE = `// Online C Compiler - UpTools
#include <stdio.h>

int main() {
    printf("Hello from UpTools!\\n");
    for (int i = 1; i <= 5; i++) {
        printf("Count: %d\\n", i);
    }
    return 0;
}`

export default function online_c_compiler() {
  return (
    <ToolLayout
      title="Online C Compiler"
      desc="Online C Compiler - compile and run C programs (GCC) in your browser free. Instant output, no sign-up, great for interviews. Free online, no login."
      icon="🔧" iconBg="rgba(148,163,184,0.08)"
      category="dev" slug="online-c-compiler"
      faq={[
        { q: "How do I run C code online free?", a: "Type or paste your C code in the editor above and click Run. Your code compiles with GCC in the cloud and the output appears in seconds, free with no sign-up." },
        { q: "Is this Online C Compiler free?", a: "Yes, completely free with unlimited runs. No sign-up, no login — use it as many times as you need." },
        { q: "Do I need to sign up or log in?", a: "No. Open the page and click Run. Nothing to install and no account needed, on mobile or desktop." },
        { q: "Can I use this for coding interview practice?", a: "Yes. Interviewers often ask candidates to open an online compiler and solve a problem live. This page is ideal for that — real GCC with instant output." },
        { q: "How do I give input to my C program?", a: "Put each input value on its own line in the Program input box. Your scanf calls read from those lines in order." },
        { q: "Which C compiler runs here?", a: "Your code compiles with GCC 13, a current stable release with full C17 support." },
      ]}
      howItWorks={[
        'Type or paste your C code in the editor.',
        'Add program input in the Stdin box if your code uses scanf.',
        'Click Run and wait a few seconds for the cloud compiler.',
        'Read the output below, fix any errors, and run again.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Online C Compiler", "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "url": "https://www.uptools.in/online-c-compiler/",
      }}
    >
      <CodeRunner compiler="gcc-13.2.0-c" versionLabel="GCC 13 (C17)" defaultCode={DEFAULT_CODE} />
    </ToolLayout>
  )
}
