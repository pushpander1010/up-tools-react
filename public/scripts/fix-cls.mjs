import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const IGNORE = new Set(['.git', 'node_modules', 'dist', 'public', '.vscode', '.wrangler', 'assets', 'scripts', 'worker']);

// Any <link ...> that points at /style.css (with optional ?v=) — async OR plain duplicate.
const RE_STYLE_LINK = /<link\b[^>]*href="(\/style\.css(?:\?[^"]*)?)"[^>]*>/gi;
// noscript whose only content is a style.css link
const RE_NOSCRIPT_CSS = /<noscript>\s*<link\b[^>]*href="\/style\.css[^"]*"[^>]*>\s*<\/noscript>/gi;

// AdSense: reserve space for any ad without an explicit height/min-height
const RE_INS = /<ins class="adsbygoogle"([^>]*)>/g;

let cssFixed = 0, adFixed = 0, filesTouched = 0;

function walk(dir) {
  for (const it of readdirSync(dir)) {
    const full = join(dir, it);
    if (statSync(full).isDirectory()) {
      if (IGNORE.has(it) || it.startsWith('.')) continue;
      walk(full);
      continue;
    }
    if (it !== 'index.html') continue;

    let html = readFileSync(full, 'utf8');
    const orig = html;
    let fileCss = false, fileAd = false;

    // Capture the href (preserve ?v= if any) from the first existing style.css link.
    let href = null;
    let mm;
    const reScan = new RegExp(RE_STYLE_LINK);
    while ((mm = reScan.exec(html))) href = mm[1];
    const canonical = href || '/style.css';

    // Remove all style.css <link>s (async + duplicates) and noscript fallbacks.
    const before = html;
    html = html.replace(RE_STYLE_LINK, '').replace(RE_NOSCRIPT_CSS, '').replace(/<noscript>\s*<\/noscript>/gi, '');
    if (html !== before) {
      fileCss = true;
      // inject exactly one render-blocking link right before </head>
      if (/<\/head>/i.test(html)) {
        html = html.replace(/<\/head>/i, `  <link rel="stylesheet" href="${canonical}">\n</head>`);
      } else {
        html = `  <link rel="stylesheet" href="${canonical}">\n` + html;
      }
    } else if (!/href="\/style\.css"/.test(html) && /<\/head>/i.test(html)) {
      // Pages that had NO style.css reference at all — add one.
      fileCss = true;
      html = html.replace(/<\/head>/i, `  <link rel="stylesheet" href="/style.css">\n</head>`);
    }

    // Tidy: trim whitespace-only lines and collapse 2+ blank lines left by removals
    html = html.split('\n').map(l => l.trim() === '' ? '' : l).join('\n').replace(/\n{3,}/g, '\n\n');

    // Ads: reserve min-height
    html = html.replace(RE_INS, (m) => {
      if (/min-height/i.test(m) || /height\s*[:=]/i.test(m)) return m;
      fileAd = true;
      if (/\bstyle="/i.test(m)) {
        return m.replace(/style="([^"]*)"/i, (s, body) =>
          `style="${body}${body.trim().endsWith(';') ? '' : ';'}min-height:250px"`);
      }
      return m.replace(/<ins class="adsbygoogle"/, '<ins class="adsbygoogle" style="min-height:250px"');
    });

    if (html !== orig) {
      writeFileSync(full, html, 'utf8');
      filesTouched++;
      if (fileCss) cssFixed++;
      if (fileAd) adFixed++;
    }
  }
}

walk(ROOT);
console.log(JSON.stringify({ cssFixed, adFixed, filesTouched }, null, 2));
