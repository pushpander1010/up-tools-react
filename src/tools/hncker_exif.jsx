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

function IssueRow({ issue, fix }) {
  return (
    <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex items-start gap-2">
        <span className="text-red-400 font-bold mt-0.5">✕</span>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white mb-1">{issue}</div>
          <div className="text-xs text-slate-400 leading-relaxed">
            <span className="text-green-400 font-semibold">Fix: </span>{fix}
          </div>
        </div>
      </div>
    </div>
  )
}

const faq = [
  { q: 'What is ExifTool?', a: 'ExifTool is a free, open-source command-line tool by Phil Harvey that reads, writes and edits metadata embedded in images, videos and documents. It is the standard utility for inspecting EXIF, IPTC and XMP data.' },
  { q: 'What is EXIF data?', a: 'EXIF (Exchangeable Image File Format) is metadata written by a camera or phone the instant a photo is taken. It stores the camera make and model, lens, ISO, shutter speed, aperture, the editing software, a timestamp, and on most phones, GPS coordinates.' },
  { q: 'Why is EXIF dangerous to share?', a: 'A photo posted online can carry your exact GPS coordinates, the model of your camera or phone, and the software used to edit it. Attackers and OSINT researchers can read this to locate where a photo was taken or identify the person behind it.' },
  { q: 'How do I read metadata from a photo?', a: 'Run `exiftool photo.jpg` to dump every tag, or `exiftool -gps:all photo.jpg` to extract just the GPS coordinates. Add `-a` to see duplicate tags and `-s` for shorter output.' },
  { q: 'How do I strip metadata before sharing?', a: 'Run `exiftool -all= photo.jpg` to wipe every tag into a clean copy. To also remove the original copy, add `-overwrite_original`. On most phones, the share menu removes GPS automatically — but verify.' },
  { q: 'Is ExifTool illegal?', a: 'No. ExifTool is a legitimate open-source utility. Reading metadata from images you own, or that are public, is fine. Using location data to track or dox someone without consent is illegal — stay on the right side of the law.' },
  { q: 'Does ExifTool work on videos?', a: 'Yes. ExifTool reads metadata from many video formats too, including GPS, camera info and creation time. It also handles PDFs, office documents and audio files.' },
  { q: 'How do I protect my own photos?', a: 'Strip metadata before posting, or disable location tagging in your camera. Always re-check the share menu on your phone before sending a photo, since some apps leak GPS even when you do not expect it.' },
]

const howItWorks = [
  'Install ExifTool with apt, brew or a prebuilt binary.',
  'Point it at an image with exiftool photo.jpg to dump every tag.',
  'Extract sensitive fields with targeted flags like -gps:all.',
  'Strip the metadata with -all= before sharing a photo.',
  'Verify the clean output still looks identical to the original.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'ExifTool — Read & Strip Image Metadata (Educational Guide)',
      description: 'Step-by-step reference for using ExifTool to read EXIF metadata — camera, software, GPS — from images, and to strip it before sharing to protect your privacy.',
      about: 'ExifTool image metadata extraction',
      educationalUse: 'Testing, education, and privacy protection only',
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

export default function hncker_exif() {
  return (
    <ToolLayout
      title="ExifTool — Read & Strip Image Metadata Guide"
      desc="Step-by-step reference: install & use ExifTool to read EXIF metadata — camera, software, GPS — from images, and strip it before sharing to protect your privacy. Educational purposes only."
      icon="🖼️"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/exif"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/exif/exif_scan.png" />
      </Helmet>

      <WarningBox>
        ExifTool is a legitimate metadata utility. Reading and stripping metadata on your <b>own photos</b> is fine,
        but using location data to <b>track or dox someone without consent is illegal</b>. This page is for
        <b> educational and privacy-protection purposes only</b>.
      </WarningBox>

      <Section id="overview" icon="🖼️" title="What is ExifTool?" subtitle="Read every hidden detail in a photo">
        <p>
          <b>ExifTool</b> is a free, open-source command-line tool that reads, writes and edits the metadata stored
          inside images, videos and documents. Every photo you take is stamped with EXIF data the moment the shutter
          closes — camera model, lens, ISO, editing software, a timestamp, and on most phones, your exact GPS
          coordinates.
        </p>
        <p>
          A single <span className="font-mono">exiftool photo.jpg</span> turns what looks like a plain picture into a
          data sheet. This is how OSINT researchers and journalists trace photos back to a person or a place.
        </p>
        <FeatureGrid items={[
          { i: '🔍', t: 'Read any tag', d: 'EXIF, IPTC, XMP across images, video & docs.' },
          { i: '📍', t: 'GPS extraction', d: 'Pull hidden coordinates out of a photo.' },
          { i: '🧹', t: 'Strip metadata', d: 'Wipe every tag with one command.' },
          { i: '🖥️', t: 'Open source', d: 'Free Perl tool, runs almost anywhere.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'A photo, video or document to inspect'],
            ['☑️', 'Linux, Windows, macOS or a Perl runtime'],
            ['☑️', 'Permission to read the file (your own content)'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="debian / kali / ubuntu" lines={`sudo apt install libimage-exiftool-perl`} />
        <InfoBox title="macOS / Windows">
          macOS: <span className="font-mono">brew install exiftool</span>. Windows: download the prebuilt binary
          from the official ExifTool site and add it to your PATH.
        </InfoBox>
      </Section>

      <Section id="dump" icon="🔍" title="Step 1 — Dump Every Tag" subtitle="Read the full data sheet">
        <p className="text-xs text-slate-400">Point ExifTool at any image:</p>
        <CodeBlock title="terminal" lines={`exiftool photo.jpg
# Make     : Canon
# Model    : EOS 5D Mark IV
# ISO      : 400
# Exposure : 1/250s
# Software : Adobe Photoshop 25.0`} />
        <InfoBox title="More output">
          <span className="font-mono">-a</span> shows duplicate tags, <span className="font-mono">-s</span> gives
          shorter keys, and <span className="font-mono">-json</span> prints everything as machine-readable JSON.
        </InfoBox>
      </Section>

      <Section id="gps" icon="📍" title="Step 2 — Pull the GPS Coordinates" subtitle="Where the photo was taken">
        <p className="text-xs text-slate-400">Most phone photos carry exact coordinates:</p>
        <CodeBlock title="terminal" lines={`exiftool -gps:all photo.jpg
# GPS Latitude  : 28.6139 N
# GPS Longitude : 77.2090 E`} />
        <InfoBox title="Why it matters">
          Paste those numbers into any map and it drops a pin on the exact spot the photo was taken — your home, your
          office, your hiding spot. This is why you strip metadata before posting.
        </InfoBox>
      </Section>

      <Section id="strip" icon="🧹" title="Step 3 — Strip Metadata Before Sharing" subtitle="Wipe every hidden tag">
        <p className="text-xs text-slate-400">One command removes all metadata and saves a clean copy:</p>
        <CodeBlock title="terminal" lines={`exiftool -all= photo.jpg
# Deleting 42 metadata tags...
# [OK] photo.jpg is clean.`} />
        <InfoBox title="Overwrite the original">
          Add <span className="font-mono">-overwrite_original</span> to remove the original file instead of keeping
          a copy. The picture looks identical — the metadata is simply gone.
        </InfoBox>
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Protect Your Location" subtitle="Stay private when you post">
        <CodeBlock title="terminal" lines={`exiftool -all= -overwrite_original photo.jpg
# [OK] metadata stripped`} />
        <FeatureGrid items={[
          { i: '🧹', t: 'Strip before posting', d: 'Wipe metadata on photos you share publicly.' },
          { i: '📱', t: 'Disable location tagging', d: 'Turn off GPS in your camera settings.' },
          { i: '🔎', t: 'Check the share menu', d: 'Some apps leak GPS even when you expect a clean export.' },
          { i: '✅', t: 'Verify after export', d: 'Re-run exiftool to confirm the copy is clean.' },
        ]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="ExifTool in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/exif/exif_scan.png" alt="ExifTool dumping metadata from an image" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">ExifTool dumps every hidden tag from a photo</figcaption>
        </figure>
      </Section>

      <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-all=</div>
            <div className="text-xs text-slate-400">Strip every metadata tag and write a clean copy.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-gps:all</div>
            <div className="text-xs text-slate-400">Extract only the GPS tags (latitude, longitude, altitude).</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-overwrite_original</div>
            <div className="text-xs text-slate-400">Remove the original file instead of keeping a backup copy.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-a</div>
            <div className="text-xs text-slate-400">Show all duplicate and alternate tags, not just the first.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-json</div>
            <div className="text-xs text-slate-400">Print the full metadata as machine-readable JSON.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-s</div>
            <div className="text-xs text-slate-400">Short output: print only the tag keys, not the descriptions.</div>
          </div>
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          <IssueRow
            issue="exiftool: command not found"
            fix="Install it first — sudo apt install libimage-exiftool-perl on Debian/Kali, or brew install exiftool on macOS. On Windows add the binary folder to your PATH."
          />
          <IssueRow
            issue="Photo shows no GPS data"
            fix="The camera may have location tagging disabled, or the coordinates were already stripped. Try exiftool -a photo.jpg to see all tags, or check your phone's camera location setting."
          />
          <IssueRow
            issue="Stripped file still has metadata"
            fix="Some apps re-embed metadata on export. Use exiftool -all= -overwrite_original and re-run exiftool to verify the output is truly clean."
          />
          <IssueRow
            issue="Editing metadata failed (permission denied)"
            fix="Make a writable copy first with cp photo.jpg photo_edit.jpg, then run exiftool on the copy. Some protected or read-only files reject in-place edits."
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[
            ['📦', 'Official ExifTool site', 'https://exiftool.org/'],
            ['📖', 'ExifTool documentation', 'https://exiftool.org/exiftool_pod.html'],
            ['📚', 'EXIF on Wikipedia', 'https://en.wikipedia.org/wiki/Exif'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you extract anything">
        <p>
          This documentation is provided <b>strictly for educational and privacy-protection purposes</b>. ExifTool is
          a legitimate metadata utility, but using location data to <b>track, stalk or dox someone without consent is
          illegal</b>. Only read and strip metadata on your own photos or files you are authorized to handle. The
          author and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
