#!/usr/bin/env node

/**
 * Fix Game Page Headers
 * 
 * This script adds proper headers to game pages that are missing them
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const GAME_HEADER = `  <!-- Header -->
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
  </header>

`;

const GAME_PAGES = [
  'games/snake/index.html',
  'games/2048/index.html',
  'games/tic-tac-toe/index.html',
  'games/flappy-bird/index.html',
  'games/tetris/index.html',
  'games/pac-man/index.html',
  'games/simon-says/index.html',
];

function fixGamePage(filePath) {
  const dirName = path.basename(path.dirname(filePath));

  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Check if header already exists
    if (content.includes('<header class="site"')) {
      console.log(`⏭️  ${dirName} - Already has header`);
      return false;
    }

    // Find the body tag and add header after it
    const bodyMatch = content.match(/<body[^>]*>/);
    if (!bodyMatch) {
      console.log(`❌ ${dirName} - No body tag found`);
      return false;
    }

    const bodyEnd = content.indexOf(bodyMatch[0]) + bodyMatch[0].length;
    
    // Skip the AdSense script if present
    const adScriptMatch = content.substring(bodyEnd).match(/<script[^>]*adsbygoogle[^>]*>[\s\S]*?<\/script>/);
    let insertPos = bodyEnd;
    
    if (adScriptMatch) {
      insertPos = bodyEnd + content.substring(bodyEnd).indexOf(adScriptMatch[0]) + adScriptMatch[0].length;
    }

    const newContent = content.slice(0, insertPos) + '\n' + GAME_HEADER + content.slice(insertPos);

    if (newContent !== originalContent) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      console.log(`✅ ${dirName} - Header added`);
      return true;
    }
  } catch (error) {
    console.error(`❌ ${dirName} - Error: ${error.message}`);
  }

  return false;
}

console.log('🎮 Fixing Game Page Headers\n');

let fixed = 0;
let skipped = 0;

for (const gamePath of GAME_PAGES) {
  const fullPath = path.join(rootDir, gamePath);
  
  if (fs.existsSync(fullPath)) {
    const result = fixGamePage(fullPath);
    if (result) {
      fixed++;
    } else {
      skipped++;
    }
  } else {
    console.log(`⏭️  ${path.basename(path.dirname(gamePath))} - File not found`);
  }
}

console.log(`\n✨ Done!`);
console.log(`   Fixed: ${fixed}`);
console.log(`   Skipped: ${skipped}`);
