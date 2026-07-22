/**
 * Shared SEO templates for all UpTools pages.
 * Import and call these functions to inject rich content sections.
 *
 * Usage in a tool's <script type="module">:
 *   import { injectHowto, injectDosDonts, injectFaqSection, injectBreadcrumbJsonLd } from '/scripts/seo-templates.mjs';
 */

const SITE = 'https://www.uptools.in';

// ─── JSON-LD Generators ──────────────────────────────────────────

/**
 * Generate FAQPage JSON-LD for rich results.
 * @param {Array<{q:string,a:string}>} items
 */
export function faqJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(i => ({
      "@type": "Question",
      "name": i.q,
      "acceptedAnswer": { "@type": "Answer", "text": i.a }
    }))
  };
}

/**
 * Generate HowTo JSON-LD.
 * @param {string} name
 * @param {Array<{name:string,text:string}>} steps
 * @param {string} [description]
 */
export function howtoJsonLd(name, steps, description = '') {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    ...(description ? { "description": description } : {}),
    "step": steps.map((s, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": s.name,
      "text": s.text
    }))
  };
}

/**
 * Generate BreadcrumbList JSON-LD.
 * @param {Array<{name:string,url:string}>} items
 */
export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Generate SoftwareApplication / WebApplication JSON-LD.
 */
export function appJsonLd({ name, category = 'UtilityApplication', url, description, image }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "applicationCategory": category,
    "operatingSystem": "Any",
    "url": url,
    ...(description ? { "description": description } : {}),
    ...(image ? { "image": image } : {}),
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
    "publisher": {
      "@type": "Organization",
      "name": "UpTools",
      "url": SITE + "/",
      "logo": { "@type": "ImageObject", "url": SITE + "/assets/logo/uptools-logo.svg" }
    }
  };
}

// ─── HTML Section Generators ─────────────────────────────────────

/**
 * Inject a HowTo section into a target element.
 * @param {HTMLElement} target
 * @param {string} title
 * @param {string[]} steps - Array of step descriptions
 */
export function injectHowto(target, title, steps) {
  const section = document.createElement('section');
  section.className = 'card';
  section.style.marginTop = '16px';
  section.innerHTML = `
    <h2 style="margin-top:0">${title}</h2>
    <ol style="margin:0 0 0 1.2rem; padding:0; list-style:decimal;">
      ${steps.map(s => `<li style="padding:.35rem 0;color:var(--muted,#9aa4b2)">${s}</li>`).join('')}
    </ol>
  `;
  target.appendChild(section);
}

/**
 * Inject a Do's and Don'ts section.
 * @param {HTMLElement} target
 * @param {string[]} dos
 * @param {string[]} donts
 */
export function injectDosDonts(target, dos, donts) {
  const section = document.createElement('section');
  section.className = 'card';
  section.style.marginTop = '16px';
  section.innerHTML = `
    <h2 style="margin-top:0">✅ Do's and ❌ Don'ts</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      <div class="card" style="border-color:rgba(34,197,94,.3)">
        <h3 style="color:#22c55e;margin-top:0;font-size:1rem">✅ Do's</h3>
        <ul style="list-style:none;padding:0;margin:0">
          ${dos.map(d => `<li style="padding:.35rem 0;color:var(--muted,#9aa4b2)">✅ ${d}</li>`).join('')}
        </ul>
      </div>
      <div class="card" style="border-color:rgba(239,68,68,.3)">
        <h3 style="color:#ef4444;margin-top:0;font-size:1rem">❌ Don'ts</h3>
        <ul style="list-style:none;padding:0;margin:0">
          ${donts.map(d => `<li style="padding:.35rem 0;color:var(--muted,#9aa4b2)">❌ ${d}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
  target.appendChild(section);
}

/**
 * Inject a visual FAQ section with <details> elements.
 * @param {HTMLElement} target
 * @param {Array<{q:string,a:string}>} items
 * @param {string} [title]
 */
export function injectFaqSection(target, items, title = 'Frequently Asked Questions') {
  const section = document.createElement('section');
  section.className = 'card';
  section.style.marginTop = '16px';
  section.innerHTML = `
    <h2 style="margin-top:0">${title}</h2>
    ${items.map(i => `
      <details style="margin-bottom:8px;padding:8px 12px;border-radius:8px;border:1px solid #212a3a;background:#0d1626">
        <summary style="cursor:pointer;font-weight:600;color:var(--text,#e6edf3)">${i.q}</summary>
        <p style="margin:8px 0 0;color:var(--muted,#9aa4b2)">${i.a}</p>
      </details>
    `).join('')}
  `;
  target.appendChild(section);
}

/**
 * Inject internal JSON-LD scripts into <head>.
 * @param {Object[]} schemas - Array of JSON-LD objects
 */
export function injectJsonLd(schemas) {
  schemas.forEach(obj => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(obj);
    document.head.appendChild(script);
  });
}

/**
 * Inject a Related Tools section.
 * @param {HTMLElement} target
 * @param {Array<{href:string,label:string,icon:string}>} tools
 */
export function injectRelatedTools(target, tools) {
  const section = document.createElement('section');
  section.className = 'card';
  section.style.marginTop = '16px';
  section.innerHTML = `
    <h2 style="margin-top:0">Related Tools at UpTools</h2>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${tools.map(t => `
        <a href="${t.href}" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;border:1px solid #212a3a;background:#0d1626;color:var(--text,#e6edf3);text-decoration:none;font-size:.9rem">
          <span style="font-weight:700;color:var(--accent,#7aa2ff)">${t.icon}</span> ${t.label}
        </a>
      `).join('')}
    </div>
  `;
  target.appendChild(section);
}

/**
 * Inject "How this tool works" explainer section.
 * @param {HTMLElement} target
 * @param {string} title
 * @param {string} html - Inner HTML content
 */
export function injectExplainer(target, title, html) {
  const section = document.createElement('section');
  section.className = 'card';
  section.style.marginTop = '16px';
  section.innerHTML = `
    <details open>
      <summary style="cursor:pointer;font-weight:700;font-size:1.1rem;padding:4px 0">${title}</summary>
      <div style="margin-top:8px;color:var(--muted,#9aa4b2)">${html}</div>
    </details>
  `;
  target.appendChild(section);
}
