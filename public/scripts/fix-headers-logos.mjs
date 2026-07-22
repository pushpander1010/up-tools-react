#!/usr/bin/env node

/**
 * Fix Headers, Logos, and Favicons
 * 
 * This script fixes all tool pages by:
 * 1. Adding favicon links if missing
 * 2. Fixing header structure with proper logo
 * 3. Adding mobile menu toggle
 * 4. Ensuring brand class is present
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const FAVICON_LINKS = `  <!-- Favicon -->
  <link rel="icon" sizes="50x50" type="image/svg+xml" href="/assets/logo/uptools-logo.svg">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/logo/uptools-logo.svg">`;

const CORRECT_HEADER = `  <!-- Header -->
  <header class="site" role="banner">
    <div class="header-inner">
      <a class="brand" href="/" aria-label="UpTools Home">
        <img src="/assets/logo/uptools-logo.svg" alt="UpTools logo" width="28" height="28" loading="eager">
        <b>UpTools</b>
      </a>
      <button class="mobile-menu-toggle" aria-label="Toggle navigation menu" aria-expanded="false">☰</button>
      <nav class="nav-links" aria-label="Primary">
        <a href="/#tools">Tools</a>
        <a href="/income-tax-tool/">Income Tax</a>
        <a href="/emi-calculator/">EMI</a>
        <a href="/gst-calculator/">GST</a>
        <a href="/games/">Games</a>
        <a href="/about/">About</a>
        <a href="/contact/">Contact</a>
      </nav>
    </div>
  </header>`;

function addFavicon(content) {
  // Check if favicon already exists
  if (content.includes('rel="icon"') || content.includes('rel="apple-touch-icon"')) {
    return content;
  }

  // Find the title tag and add favicon after it
  const titleMatch = content.match(/<title>[^<]*<\/title>/);
  if (!titleMatch) {
    return content;
  }

  const titleEnd = content.indexOf(titleMatch[0]) + titleMatch[0].length;
  return content.slice(0, titleEnd) + '\n' + FAVICON_LINKS + content.slice(titleEnd);
}

function fixHeader(content) {
  // Check if header already has correct structure
  if (content.includes('class="brand"') && content.includes('mobile-menu-toggle')) {
    return content;
  }

  // Find and replace the header section
  const headerRegex = /<header[^>]*class="site"[^>]*>[\s\S]*?<\/header>/;
  const match = content.match(headerRegex);

  if (!match) {
    // No header found, add it after skip link
    const skipLinkMatch = content.match(/<a href="#main" class="sr-only">[^<]*<\/a>/);
    if (skipLinkMatch) {
      const skipLinkEnd = content.indexOf(skipLinkMatch[0]) + skipLinkMatch[0].length;
      return content.slice(0, skipLinkEnd) + '\n\n' + CORRECT_HEADER + content.slice(skipLinkEnd);
    }
    return content;
  }

  // Replace the header
  return content.replace(headerRegex, CORRECT_HEADER);
}

function processFile(filePath) {
  const dirName = path.basename(path.dirname(filePath));

  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Add favicon if missing
    content = addFavicon(content);

    // Fix header if needed
    content = fixHeader(content);

    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ ${dirName}`);
      return true;
    } else {
      console.log(`⏭️  ${dirName} - Already correct`);
      return false;
    }
  } catch (error) {
    console.error(`❌ ${dirName} - Error: ${error.message}`);
    return false;
  }
}

function findAllPages() {
  const pages = [];

  function walkDir(dir) {
    try {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist' && file !== 'htmlcov') {
            walkDir(filePath);
          }
        } else if (file === 'index.html') {
          pages.push(filePath);
        }
      }
    } catch (error) {
      // Silently skip
    }
  }

  walkDir(rootDir);
  return pages;
}

console.log('🔧 Fixing Headers, Logos, and Favicons\n');

const pages = findAllPages();
console.log(`Found ${pages.length} pages\n`);

let fixed = 0;
let skipped = 0;
let errors = 0;

for (const page of pages) {
  const dirName = path.basename(path.dirname(page));

  // Skip certain directories
  if (['htmlcov', 'node_modules', 'dist', 'scripts'].includes(dirName)) {
    continue;
  }

  try {
    const result = processFile(page);
    if (result) {
      fixed++;
    } else {
      skipped++;
    }
  } catch (error) {
    errors++;
  }
}

console.log(`\n✨ Done!`);
console.log(`   Fixed: ${fixed}`);
console.log(`   Skipped: ${skipped}`);
console.log(`   Errors: ${errors}`);
