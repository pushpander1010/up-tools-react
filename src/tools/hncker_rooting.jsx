import { Helmet } from 'react-helmet-async'
import ToolLayout from '../components/ToolLayout'

function Section({ id, icon, title, subtitle, children }) {
  return (
    <section id={id} className="glass p-6 sm:p-7 mb-6 scroll-mt-24">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-xl">{icon}</span>
        <h2 className="text-lg sm:text-xl font-extrabold text-white m-0">{title}</h2>
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-2" />}
      <div className="space-y-4 text-sm text-slate-300 leading-relaxed">{children}</div>
    </section>
  )
}

function CodeBlock({ title, lines }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: '#0a0f1e' }}>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10" style={{ background: '#111827' }}>
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        {title && <span className="ml-2 text-[11px] font-mono text-slate-400">{title}</span>}
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-green-300 whitespace-pre-wrap">
{lines}
      </pre>
    </div>
  )
}

function WarningBox({ children }) {
  return (
    <div className="rounded-xl p-4 border border-red-500/30" style={{ background: 'rgba(239,68,68,0.07)' }}>
      <div className="flex items-center gap-2 text-red-300 font-bold text-sm mb-1.5">⚠️ Legal &amp; Ethical Warning</div>
      <div className="text-xs text-red-200/80 leading-relaxed">{children}</div>
    </div>
  )
}

function InfoBox({ title, icon = '💡', children }) {
  return (
    <div className="rounded-xl p-4 border border-cyan-500/25" style={{ background: 'rgba(6,182,212,0.06)' }}>
      <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm mb-1.5">{icon} {title}</div>
      <div className="text-xs text-slate-300 leading-relaxed">{children}</div>
    </div>
  )
}

function FeatureGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map(f => (
        <div key={f.t} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="text-2xl mb-1">{f.i}</div>
          <div className="text-sm font-semibold text-white mb-0.5">{f.t}</div>
          <div className="text-xs text-slate-400">{f.d}</div>
        </div>
      ))}
    </div>
  )
}

function StepRow({ num, title, body }) {
  return (
    <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex items-start gap-2">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand/20 text-brand font-bold text-sm mt-0.5 flex-none">{num}</span>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white mb-1">{title}</div>
          <div className="text-xs text-slate-400 leading-relaxed">{body}</div>
        </div>
      </div>
    </div>
  )
}

const faq = [
  { q: 'What is rooting?', a: 'Rooting gives you full administrative control over your own Android device, like getting the master key. It lets you remove bloatware, back up everything, and unlock features your carrier hid. It works on most Android devices the same way.' },
  { q: 'Is rooting legal?', a: 'Rooting your own device is legal in most places, but it voids your warranty and can permanently trip Samsung\'s Knox security fuse. Rooting or modifying a device you do not own, without written permission, is illegal. Only root your own hardware.' },
  { q: 'Does rooting wipe my data?', a: 'Unlocking the bootloader wipes your phone completely. Always back up your data first. The bootloader unlock is a one-time, irreversible step on most devices.' },
  { q: 'What is Magisk?', a: 'Magisk is the standard open-source tool for rooting. It patches your stock boot image systemlessly, so you can keep root access and still pass some safety checks. Always patch the image on the same device you are rooting.' },
  { q: 'What is the difference between boot and init_boot?', a: 'On Android 13 and newer, you patch the init_boot image. Older devices use boot. The Magisk app tells you which one your device needs, so you always patch the right file.' },
  { q: 'Which devices can I root?', a: 'Google Pixel is the easiest and most open. Samsung requires OEM unlock and trips Knox. Xiaomi needs a 7-day wait with Mi Unlock. OnePlus and Motorola use standard fastboot commands. Always check your exact model on XDA first.' },
  { q: 'Will banking apps work after rooting?', a: 'Often not. Rooting may break banking apps, Google Wallet, and Play Integrity checks. On Samsung it also disables Samsung Pay and Secure Folder. If these matter to you, weigh the trade-off before rooting.' },
]

const howItWorks = [
  'Enable Developer options and turn on OEM unlocking and USB debugging.',
  'Unlock the bootloader (brand-specific): fastboot flashing unlock or fastboot oem unlock.',
  'Get the stock boot or init_boot image from your official firmware.',
  'Patch the image with the Magisk app on the same device.',
  'Flash the patched image with fastboot and reboot for root access.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Root Android the Right Way — Step-by-Step Guide (Educational)',
      description: 'Complete guide to rooting your own Android device: unlock the bootloader, patch the boot image with Magisk, and flash it back. Covers Pixel, Samsung, Xiaomi, OnePlus and Motorola. Educational and authorized use only.',
      about: 'Rooting Android with Magisk',
      educationalUse: 'Testing, education, and authorized use only',
    },
    {
      '@type': 'FAQPage',
      mainEntity: faq.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
}

export default function hncker_rooting() {
  return (
    <ToolLayout
      title="Root Android the Right Way — Step-by-Step Guide"
      desc="Learn how to root your own Android device the right way: unlock the bootloader, patch with Magisk, and flash. Covers Pixel, Samsung, Xiaomi, OnePlus, Motorola. Educational only."
      icon="🔑"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/rooting"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/rooting/rooting_scan.png" />
      </Helmet>

      {/* Video Tutorial */}
      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the full rooting walkthrough">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full rounded-xl border border-white/10"
            src="https://www.youtube.com/embed/mprTO_jh0QA"
            title="Root Android the Right Way — Full Guide | HNCKER"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Section>

      <WarningBox>
        Rooting is a powerful procedure. Only do it on <b>a device you own</b>, and back up all your data first — unlocking
        the bootloader wipes the phone. Rooting voids your warranty and can permanently trip Samsung's Knox security fuse.
        Rooting or modifying a device you do not own, without written permission, is <b>illegal</b>. This page is for
        <b> educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🔑" title="What is Rooting?" subtitle="Full control over your own Android device">
        <p>
          <b>Rooting</b> gives you full administrative control over your Android device — like getting the <b>master key</b>.
          It lets you <b>remove bloatware</b>, <b>back up everything</b>, and <b>unlock features your carrier hid</b> from you.
          Most modern Android devices root the same way.
        </p>
        <FeatureGrid items={[
          { i: '🗑️', t: 'Remove bloatware', d: 'Uninstall apps you never wanted.' },
          { i: '💾', t: 'Full backups', d: 'Back up everything, not just what Android allows.' },
          { i: '🎛️', t: 'Deep customization', d: 'Unlock features your carrier or manufacturer hid.' },
          { i: '⚡', t: 'Systemless root', d: 'Magisk patches your boot image without touching the system.' },
          { i: '🔓', t: 'Master key', d: 'True admin access to your own phone.' },
          { i: '📱', t: 'Works on most devices', d: 'Pixel, Samsung, Xiaomi, OnePlus, Motorola and more.' },
        ]} />
      </Section>

      <Section id="prereqs" icon="🧰" title="What You Need" subtitle="Before you start">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'A device you own and are ready to reset (data will be wiped)'],
            ['☑️', 'A full backup of your data'],
            ['☑️', 'Google SDK Platform Tools (adb and fastboot) — the official package'],
            ['☑️', 'The Magisk APK from its official GitHub'],
            ['☑️', 'Your device\'s stock boot or init_boot image from official firmware'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="steps" icon="🛠️" title="The Rooting Process" subtitle="Four steps, the same pipeline on most phones">
        <StepRow num={1} title="Enable Developer options" body="Go to Settings → About phone, tap the build number seven times, then enable OEM unlocking and USB debugging in Developer options." />
        <StepRow num={2} title="Unlock the bootloader" body={'Brand-specific. Pixel, OnePlus and most devices: adb reboot bootloader, then fastboot flashing unlock. Motorola: fastboot oem unlock with your code. This wipes the phone.'} />
        <StepRow num={3} title="Patch the boot image" body="Get the stock boot (or init_boot on Android 13+) image from your official firmware, push it to your phone, and patch it with the Magisk app. Always patch on the same device." />
        <StepRow num={4} title="Flash and reboot" body={'Boot into fastboot and run: fastboot flash boot magisk_patched.img (or init_boot). Then fastboot reboot. Open the Magisk app to confirm root access.'} />
      </Section>

      <Section id="brands" icon="📱" title="Brand-Specific Notes" subtitle="Every major brand, explained">
        <InfoBox title="Google Pixel — easiest">
          The most open path. Unlock with fastboot flashing unlock, patch the boot or init_boot image, and flash. Fewest restrictions.
        </InfoBox>
        <InfoBox title="Samsung — strictest">
          OEM unlocking must exist (many US/Canada models can't unlock). Unlocking trips the Knox fuse permanently, disabling Samsung Pay and Secure Folder. Flash the patched AP with Odin (never HOME_CSC).
        </InfoBox>
        <InfoBox title="Xiaomi — needs patience">
          Bind your phone to a Mi account and wait, usually 168 hours (7 days), before the Mi Unlock tool will work. Don't sign out during the wait.
        </InfoBox>
        <InfoBox title="OnePlus + Motorola — standard fastboot">
          OnePlus 10+ patches init_boot, older models use boot. Motorola requires an unlock code from its official website, then fastboot oem unlock with that code.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Rooting in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/rooting/rooting_scan.png" alt="Rooting an Android device — flashing the patched boot image in fastboot"
            width="1080" height="1920" className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Flashing the patched boot image in fastboot</figcaption>
        </figure>
      </Section>

      <Section id="issues" icon="🐞" title="Known Issues & How to Fix Them" subtitle="Common problems, with working fixes">
        <div className="space-y-3">
          <StepRow num="!" title="fastboot device not found"
            body="Make sure USB debugging is on and the official platform-tools are installed. Try a different cable or USB port, and run adb devices to confirm the connection." />
          <StepRow num="!" title="OEM unlocking option missing (Samsung)"
            body="On many US and Canada models the option doesn't exist and the phone cannot be unlocked. If it's grayed out, KnoxGuard may be locking the device — the phone must be internet-connected during setup." />
          <StepRow num="!" title="Xiaomi unlock says wait 168 hours"
            body="That's normal. Xiaomi enforces a 7-day binding period. Don't sign out or unlink your Mi account, or the timer restarts. Set a reminder and check back after the wait." />
          <StepRow num="!" title="Flashing the wrong image bricks the phone"
            body="Always patch the boot image on the exact same device you're rooting, and never restore boot, init_boot, recovery, or vbmeta to stock. A full firmware restore with a data wipe is the only recovery." />
          <StepRow num="!" title="Banking apps stopped working"
            body="Rooting breaks Play Integrity and many banking apps, plus Samsung Pay and Secure Folder. This is expected. If it matters, weigh the trade-off before rooting, or use Magisk's DenyList for some apps." />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Repositories & Resources" subtitle="Official links">
        <div className="space-y-2">
          {[
            ['🧙', 'Magisk (official)', 'https://github.com/topjohnwu/Magisk'],
            ['🛠️', 'Google Platform Tools (adb/fastboot)', 'https://developer.android.com/tools/releases/platform-tools'],
            ['🔧', 'TWRP (custom recovery)', 'https://twrp.me/'],
            ['🎬', 'HNCKER tutorials', 'https://www.youtube.com/@hncker'],
          ].map(([i, label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 border border-white/8 hover:border-brand/40 hover:bg-white/5 transition-all text-slate-300 hover:text-white no-underline">
              <span>{i}</span>
              <span className="text-sm font-medium">{label}</span>
              <span className="ml-auto text-indigo-300 text-xs font-mono break-all">{href}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you root anything">
        <p>
          This guide is provided <b>strictly for educational and authorized use</b>. Root only devices you own. Rooting voids
          your warranty, wipes your data during bootloader unlock, and can permanently trip Samsung's Knox fuse. Rooting or
          modifying a device you do not own without written permission is <b>illegal</b>. The authors and this site are not
          responsible for misuse or damage.
        </p>
      </Section>
    </ToolLayout>
  )
}
