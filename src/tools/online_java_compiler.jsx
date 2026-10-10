import ToolLayout from '../components/ToolLayout'
import CodeRunner from '../components/CodeRunner'

const DEFAULT_CODE = `// Online Java Compiler - UpTools
class Main {
    public static void main(String[] args) {
        System.out.println("Hello from UpTools!");
        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }
    }
}`

export default function online_java_compiler() {
  return (
    <ToolLayout
      title="Online Java Compiler"
      desc="Online Java Compiler - compile and run Java code in your browser free. Instant output, no sign-up, ideal for interview practice. Free online, no login."
      icon="☕" iconBg="rgba(249,115,22,0.08)"
      category="dev" slug="online-java-compiler"
      faq={[
        { q: "How do I run Java code online free?", a: "Type or paste your Java code in the editor above and click Run. Your code compiles in the cloud and the output appears in seconds, free with no sign-up." },
        { q: "Is this Online Java Compiler free?", a: "Yes, completely free with unlimited runs. No sign-up, no login — use it as many times as you need." },
        { q: "Do I need to sign up or log in?", a: "No. Open the page and click Run. Nothing to install and no account needed, on mobile or desktop." },
        { q: "Can I use this for coding interview practice?", a: "Yes. Interviewers often ask candidates to open an online compiler and solve a problem live. This page is ideal for that — full Java with instant output." },
        { q: "How do I give input to my Java program?", a: "Put each input value on its own line in the Program input box. Your Scanner or BufferedReader reads from those lines in order." },
        { q: "Which Java version runs here?", a: "Your code runs on OpenJDK 22, a current stable Java release, so modern syntax including var and switch expressions works." },
      ]}
      howItWorks={[
        'Type or paste your Java code in the editor.',
        'Add program input in the Stdin box if your code reads input.',
        'Click Run and wait a few seconds for the cloud compiler.',
        'Read the output below, fix any errors, and run again.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Online Java Compiler", "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "url": "https://www.uptools.in/online-java-compiler/",
      }}
    >
      <CodeRunner compiler="openjdk-jdk-22+36" versionLabel="OpenJDK 22" defaultCode={DEFAULT_CODE} />
    </ToolLayout>
  )
}
