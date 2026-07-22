#!/usr/bin/env node

/**
 * Audit Headers, Logos, and Favicons
 * 
 * This script checks all tool pages for:
 * 1. Missing favicon links
 * 2. Missing logo in header
 * 3. Incorrect header structure
 * 4. Missing mobile menu toggle
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const issues = {
  missingFavicon: [],
  missingLogo: [],
  badHeaderStructure: [],
  missingMobileMenu: [],
  missingBrand: [],
};

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const dirName = path.basename(path.dirname(filePath));

    // Skip certain directories
    if (['htmlcov', 'node_modules', 'dist', 'scripts'].includes(dirName)) {
      return;
    }

    // Check for favicon
    const hasFavicon = content.includes('rel="icon"') || content.includes('rel="apple-touch-icon"');
    if (!hasFavicon) {
      issues.missingFavicon.push(dirName);
    }

    // Check for logo in header
    const hasLogoImg = content.includes('<img src="/assets/logo/uptools-logo.svg"');
    if (!hasLogoImg) {
      issues.missingLogo.push(dirName);
    }

    // Check for brand class
    const hasBrand = content.includes('class="brand"');
    if (!hasBrand) {
      issues.missingBrand.push(dirName);
    }

    // Check for mobile menu toggle
    const hasMobileMenu = content.includes('class="mobile-menu-toggle"');
    if (!hasMobileMenu) {
      issues.missingMobileMenu.push(dirName);
    }

    // Check header structure
    const headerMatch = content.match(/<header[^>]*class="site"[^>]*>/);
    if (!headerMatch) {
      issues.badHeaderStructure.push(dirName);
    }
  } catch (error) {
    // Silently skip files we can't read
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

console.log('🔍 Auditing Headers, Logos, and Favicons\n');

const pages = findAllPages();
console.log(`Found ${pages.length} pages\n`);

for (const page of pages) {
  checkFile(page);
}

console.log('📊 Audit Results:\n');

console.log(`❌ Missing Favicon (${issues.missingFavicon.length}):`);
if (issues.missingFavicon.length > 0) {
  issues.missingFavicon.forEach(dir => console.log(`   - ${dir}`));
} else {
  console.log('   ✅ All pages have favicons');
}

console.log(`\n❌ Missing Logo Image (${issues.missingLogo.length}):`);
if (issues.missingLogo.length > 0) {
  issues.missingLogo.forEach(dir => console.log(`   - ${dir}`));
} else {
  console.log('   ✅ All pages have logo images');
}

console.log(`\n❌ Missing Brand Class (${issues.missingBrand.length}):`);
if (issues.missingBrand.length > 0) {
  issues.missingBrand.forEach(dir => console.log(`   - ${dir}`));
} else {
  console.log('   ✅ All pages have brand class');
}

console.log(`\n❌ Missing Mobile Menu Toggle (${issues.missingMobileMenu.length}):`);
if (issues.missingMobileMenu.length > 0) {
  issues.missingMobileMenu.forEach(dir => console.log(`   - ${dir}`));
} else {
  console.log('   ✅ All pages have mobile menu toggle');
}

console.log(`\n❌ Bad Header Structure (${issues.badHeaderStructure.length}):`);
if (issues.badHeaderStructure.length > 0) {
  issues.badHeaderStructure.forEach(dir => console.log(`   - ${dir}`));
} else {
  console.log('   ✅ All pages have correct header structure');
}

const totalIssues = 
  issues.missingFavicon.length +
  issues.missingLogo.length +
  issues.missingBrand.length +
  issues.missingMobileMenu.length +
  issues.badHeaderStructure.length;

console.log(`\n📈 Total Issues: ${totalIssues}`);
console.log(`✅ Pages Checked: ${pages.length}`);
