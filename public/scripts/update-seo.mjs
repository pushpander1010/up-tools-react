import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const ignoreDirs = ['node_modules', 'dist', '.git', '.wrangler', 'assets', 'public', 'scripts', 'games']; // games handled separately or we can include them

function updateSEO(htmlContent, dirName) {
  let newHtml = htmlContent;

  // Extract Title
  const titleMatch = newHtml.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'UpTools';

  // Extract Description
  const descMatch = newHtml.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const description = descMatch ? descMatch[1].trim() : '';

  const canonicalUrl = `https://www.uptools.in/${dirName}/`;

  // 1. Ensure canonical URL
  if (!/<link\s+rel=["']canonical["']/i.test(newHtml)) {
    newHtml = newHtml.replace(/<\/head>/i, `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
  } else {
    newHtml = newHtml.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  }

  // 2. Ensure robots
  if (!/<meta\s+name=["']robots["']/i.test(newHtml)) {
    newHtml = newHtml.replace(/<\/head>/i, `  <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:large" />\n</head>`);
  } else {
    newHtml = newHtml.replace(/<meta\s+name=["']robots["'][^>]*>/i, `<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:large" />`);
  }

  // 3. Ensure Open Graph Tags
  const ogTitleStr = `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />`;
  const ogDescStr = `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />`;
  const ogUrlStr = `<meta property="og:url" content="${canonicalUrl}" />`;
  const ogTypeStr = `<meta property="og:type" content="website" />`;

  if (!/<meta\s+property=["']og:title["']/i.test(newHtml)) {
    newHtml = newHtml.replace(/<\/head>/i, `  ${ogTitleStr}\n</head>`);
  } else {
    newHtml = newHtml.replace(/<meta\s+property=["']og:title["'][^>]*>/i, ogTitleStr);
  }

  if (!/<meta\s+property=["']og:description["']/i.test(newHtml)) {
    newHtml = newHtml.replace(/<\/head>/i, `  ${ogDescStr}\n</head>`);
  } else {
    newHtml = newHtml.replace(/<meta\s+property=["']og:description["'][^>]*>/i, ogDescStr);
  }

  if (!/<meta\s+property=["']og:url["']/i.test(newHtml)) {
    newHtml = newHtml.replace(/<\/head>/i, `  ${ogUrlStr}\n</head>`);
  } else {
    newHtml = newHtml.replace(/<meta\s+property=["']og:url["'][^>]*>/i, ogUrlStr);
  }

  if (!/<meta\s+property=["']og:type["']/i.test(newHtml)) {
    newHtml = newHtml.replace(/<\/head>/i, `  ${ogTypeStr}\n</head>`);
  }

  return newHtml;
}

function processDirectory(directory, baseSlug = '') {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && !ignoreDirs.includes(entry.name)) {
      const fullPath = path.join(directory, entry.name);
      const slug = baseSlug ? `${baseSlug}/${entry.name}` : entry.name;
      
      const indexPath = path.join(fullPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        console.log(`Processing SEO for: ${slug}`);
        const html = fs.readFileSync(indexPath, 'utf-8');
        const updatedHtml = updateSEO(html, slug);
        if (html !== updatedHtml) {
          fs.writeFileSync(indexPath, updatedHtml, 'utf-8');
          console.log(`  Updated ${slug}/index.html`);
        }
      }
      
      // recurse
      processDirectory(fullPath, slug);
    }
  }
}

// Also process games dir manually if we want
const gamesDir = path.join(rootDir, 'games');
if (fs.existsSync(gamesDir)) {
  const gamesEntries = fs.readdirSync(gamesDir, { withFileTypes: true });
  for (const entry of gamesEntries) {
    if (entry.isDirectory()) {
      const fullPath = path.join(gamesDir, entry.name);
      const slug = `games/${entry.name}`;
      const indexPath = path.join(fullPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        console.log(`Processing SEO for game: ${slug}`);
        const html = fs.readFileSync(indexPath, 'utf-8');
        const updatedHtml = updateSEO(html, slug);
        if (html !== updatedHtml) {
          fs.writeFileSync(indexPath, updatedHtml, 'utf-8');
          console.log(`  Updated ${slug}/index.html`);
        }
      }
    }
  }
}

console.log("Starting SEO bulk update...");
processDirectory(rootDir);
console.log("Done.");
