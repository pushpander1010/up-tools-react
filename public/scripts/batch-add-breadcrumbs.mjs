#!/usr/bin/env node

/**
 * Batch Add Breadcrumbs & Mobile Menu to All Tool Pages
 * 
 * Usage: node scripts/batch-add-breadcrumbs.mjs
 * 
 * This script:
 * 1. Finds all index.html files in tool directories
 * 2. Adds breadcrumb initialization to each page
 * 3. Updates imports to include createBreadcrumb and initMobileMenu
 * 4. Generates appropriate breadcrumb paths based on tool category
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Category mapping for breadcrumbs
const CATEGORY_MAP = {
  'income-tax-tool': { label: 'Tax', href: '/#tax' },
  'gst-calculator': { label: 'Tax', href: '/#tax' },
  'emi-calculator': { label: 'Finance', href: '/#finance' },
  'fd-calculator': { label: 'Finance', href: '/#finance' },
  'sip-calculator': { label: 'Finance', href: '/#finance' },
  'pnl-calculator': { label: 'Finance', href: '/#finance' },
  'currency-converter': { label: 'Finance', href: '/#finance' },
  'ai-stock-analyzer': { label: 'Finance', href: '/#finance' },
  'ai-top10-stocks': { label: 'Finance', href: '/#finance' },
  'crypto-prices': { label: 'Crypto', href: '/#crypto' },
  'crypto-portfolio': { label: 'Crypto', href: '/#crypto' },
  'crypto-profitability': { label: 'Crypto', href: '/#crypto' },
  'age-calculator': { label: 'Text', href: '/#text' },
  'bmi-calculator': { label: 'Health', href: '/#health' },
  'unit-converter': { label: 'Developer', href: '/#dev' },
  'pan-validator': { label: 'Text', href: '/#text' },
  'pan-aadhaar-link-status': { label: 'Tax', href: '/#tax' },
  'vehicle-registration-details': { label: 'Security', href: '/#security' },
  'ifsc-finder': { label: 'Banking', href: '/#banking' },
  'canada-crs-tool': { label: 'Canada', href: '/#canada' },
  'canada-hst-tool': { label: 'Canada', href: '/#canada' },
  'rrsp-optimizer': { label: 'Canada', href: '/#canada' },
  'tfsa-room-tracker': { label: 'Canada', href: '/#canada' },
  'cpp-ei-calculator': { label: 'Canada', href: '/#canada' },
  'canada-tax-bracket-calculator': { label: 'Canada', href: '/#canada' },
  'canada-mortgage-affordability': { label: 'Canada', href: '/#canada' },
  'cra-refund-estimator': { label: 'Canada', href: '/#canada' },
  'sin-validator': { label: 'Canada', href: '/#canada' },
  'cra-noa-checklist': { label: 'Canada', href: '/#canada' },
  'vehicle-import-duty-estimator': { label: 'Canada', href: '/#canada' },
  'password-generator': { label: 'Security', href: '/#security' },
  'base64-encoder': { label: 'Developer', href: '/#dev' },
  'uuid-generator': { label: 'Developer', href: '/#dev' },
  'json-formatter': { label: 'Developer', href: '/#dev' },
  'ai-prompts': { label: 'AI', href: '/#ai' },
  'ai-writer': { label: 'AI', href: '/#ai' },
  'ai-blog-generator': { label: 'AI', href: '/#ai' },
  'ai-youtube-script': { label: 'AI', href: '/#ai' },
  'ai-email-writer': { label: 'AI', href: '/#ai' },
  'ai-caption-generator': { label: 'AI', href: '/#ai' },
  'ai-budget-planner': { label: 'Finance', href: '/#finance' },
  'ai-business-name-generator': { label: 'AI', href: '/#ai' },
  'ai-product-description': { label: 'AI', href: '/#ai' },
  'instagram-bio-generator': { label: 'Social', href: '/#social' },
  'instagram-caption-generator': { label: 'Social', href: '/#social' },
  'whatsapp-dp-downloader': { label: 'Social', href: '/#social' },
  'tiktok-video-downloader': { label: 'Social', href: '/#social' },
  'facebook-video-downloader': { label: 'Social', href: '/#social' },
  'youtube-audio-downloader': { label: 'Social', href: '/#social' },
  'twitter-video-downloader': { label: 'Social', href: '/#social' },
  'pinterest-downloader': { label: 'Social', href: '/#social' },
  'linkedin-video-downloader': { label: 'Social', href: '/#social' },
  'telegram-downloader': { label: 'Social', href: '/#social' },
  'snapchat-downloader': { label: 'Social', href: '/#social' },
  'ifsc-finder': { label: 'Banking', href: '/#banking' },
  'whatsapp-status-saver': { label: 'Social', href: '/#social' },
  'bank-branch-finder': { label: 'Banking', href: '/#banking' },
};

// Game category
const GAME_CATEGORY = { label: 'Games', href: '/games/' };

function getTitleFromPath(dirName) {
  return dirName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getCategory(dirName) {
  return CATEGORY_MAP[dirName] || { label: 'Tools', href: '/#tools' };
}

function isGame(filePath) {
  return filePath.includes('/games/');
}

function generateBreadcrumbCode(dirName, filePath) {
  const title = getTitleFromPath(dirName);
  const isGamePage = isGame(filePath);
  const category = isGamePage ? GAME_CATEGORY : getCategory(dirName);

  return `    // Initialize breadcrumb navigation and mobile menu
    createBreadcrumb([
      { label: 'Home', href: '/' },
      { label: '${category.label}', href: '${category.href}' },
      { label: '${title}' }
    ]);
    initMobileMenu();`;
}

function updateImportStatement(content) {
  // Check if createBreadcrumb and initMobileMenu are already imported
  if (content.includes('createBreadcrumb') && content.includes('initMobileMenu')) {
    return content; // Already updated
  }

  // Find the import statement
  const importRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\/scripts\/utils\.js['"];/;
  const match = content.match(importRegex);

  if (!match) {
    console.warn('  ⚠️  Could not find import statement');
    return content;
  }

  const imports = match[1];
  const importList = imports.split(',').map(s => s.trim());

  // Add new functions if not already present
  if (!importList.includes('createBreadcrumb')) {
    importList.push('createBreadcrumb');
  }
  if (!importList.includes('initMobileMenu')) {
    importList.push('initMobileMenu');
  }

  // Fix duplicate $ (should be $$)
  const cleanedImports = importList
    .filter((item, index, arr) => !(item === '$' && arr.indexOf('$') !== index))
    .map(item => item === '$' && importList.filter(i => i === '$').length > 1 ? '$$' : item);

  const newImportStatement = `import { ${cleanedImports.join(', ')} } from '/scripts/utils.js';`;
  return content.replace(importRegex, newImportStatement);
}

function addBreadcrumbInitialization(content, dirName, filePath) {
  // Check if already has breadcrumb initialization
  if (content.includes('createBreadcrumb')) {
    return content; // Already updated
  }

  // Find the closing </script> tag of the module script
  const moduleScriptRegex = /(<script type="module">[\s\S]*?)(  <\/script>)/;
  const match = content.match(moduleScriptRegex);

  if (!match) {
    console.warn('  ⚠️  Could not find module script closing tag');
    return content;
  }

  const breadcrumbCode = generateBreadcrumbCode(dirName, filePath);
  const newContent = content.replace(
    moduleScriptRegex,
    `$1\n\n${breadcrumbCode}\n  </script>`
  );

  return newContent;
}

function processFile(filePath) {
  const dirName = path.basename(path.dirname(filePath));

  // Skip if already processed (bmi-calculator is our example)
  if (dirName === 'bmi-calculator') {
    console.log(`✅ ${dirName} - Already updated (example)`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Update import statement
    content = updateImportStatement(content);

    // Add breadcrumb initialization
    content = addBreadcrumbInitialization(content, dirName, filePath);

    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ ${dirName} - Updated`);
    } else {
      console.log(`⏭️  ${dirName} - No changes needed`);
    }
  } catch (error) {
    console.error(`❌ ${dirName} - Error: ${error.message}`);
  }
}

function findAllToolPages() {
  const toolPages = [];

  function walkDir(dir) {
    try {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          // Skip node_modules, dist, .git, etc.
          if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist' && file !== 'htmlcov') {
            walkDir(filePath);
          }
        } else if (file === 'index.html' && !dir.includes('node_modules')) {
          toolPages.push(filePath);
        }
      }
    } catch (error) {
      // Silently skip directories we can't read
    }
  }

  walkDir(rootDir);
  return toolPages;
}

console.log('🚀 Batch Adding Breadcrumbs & Mobile Menu to All Tool Pages\n');

const toolPages = findAllToolPages();
console.log(`Found ${toolPages.length} tool pages\n`);

let updated = 0;
let skipped = 0;
let errors = 0;

for (const filePath of toolPages) {
  const dirName = path.basename(path.dirname(filePath));

  // Skip certain directories
  if (['htmlcov', 'node_modules', 'dist'].includes(dirName)) {
    continue;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Only process files with module scripts
    if (!content.includes('<script type="module">')) {
      continue;
    }

    processFile(filePath);
    updated++;
  } catch (error) {
    errors++;
  }
}

console.log(`\n✨ Done!`);
console.log(`   Updated: ${updated}`);
console.log(`   Skipped: ${skipped}`);
console.log(`   Errors: ${errors}`);
