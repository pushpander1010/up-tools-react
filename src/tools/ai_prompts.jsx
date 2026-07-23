import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

const PROMPTS = [
  // ── IMAGE EDITING (detailed) ──
  { cat: 'image', title: 'LinkedIn Headshot Generator', prompt: `You are a Senior Photo Retoucher. Create a polished LinkedIn headshot.\n\nSubject:\n- Professional corporate portrait, gender-neutral\n- Neat hair, natural grooming, minimal jewelry\n- Formal outfit: dark blazer + light solid shirt, no logos\n\nBackground & Lighting:\n- Neutral gradient backdrop (light grey → soft blue), no banding\n- 3-point lighting: key light at 45°, fill light subtle, rim light for hair separation\n- Soft shadow falloff, no harsh nose shadows\n\nFraming:\n- Vertical crop, head-and-shoulders, eye line at upper third\n- Confident, warm expression; simulate 85mm portrait lens\n- Shallow depth of field for background blur\n\nRetouching:\n- Clean skin tones, remove blemishes, preserve texture (no plastic skin)\n- Even under-eye area, whiten teeth slightly, neutral white balance\n- Fix clothing wrinkles, stray threads, consistent fabric shading\n\nOutput: Single PNG, 2048×2048, sRGB color space, subtle sharpening, no watermark. Return ONLY the image.` },
  { cat: 'image', title: 'Product Photo – White Background', prompt: `You are an E-commerce Photo Specialist. Create a product photo on pure white.\n\nRequirements:\n- Pure white (#FFFFFF) background with soft, realistic contact shadow\n- No clipping halos around product edges\n- Color-accurate product representation\n- Remove dust, scratches, fingerprints\n- Straightened perspective, clean edges\n- Soft, even studio lighting (no harsh highlights)\n\nOutput Format:\n- Single PNG, 2048×2048 pixels, sRGB\n- Tight padding around product (10-15% on each side)\n- No text, no logos, no watermarks\n- File must be web-ready (optimized for e-commerce listings)` },
  { cat: 'image', title: 'Background Removal + Shadow', prompt: `You are a Background Removal Expert. Remove the background and add a professional shadow.\n\nProcess:\n- Detect subject edges precisely (hair, fabric, glass transparency)\n- Remove ALL background elements completely\n- Add a subtle, realistic drop shadow beneath the subject\n- Shadow: soft gaussian blur, offset downward 2-4px, opacity 15-25%\n- Preserve original subject colors and quality\n\nEdge Treatment:\n- Anti-aliased edges, no jagged artifacts\n- Hair strands preserved where possible\n- Transparent/semi-transparent elements handled correctly\n\nOutput: PNG with transparent background + shadow layer. 2048×2048 minimum.` },
  { cat: 'image', title: 'Colorize Black & White Photo', prompt: `You are a Photo Colorization Specialist. Add realistic color to a B&W photo.\n\nColor Accuracy Rules:\n- Skin tones: warm, natural (avoid orange/red oversaturation)\n- Sky: appropriate blue gradient based on time of day\n- Clothing: period-appropriate colors (check era for accuracy)\n- Vegetation: natural greens, not neon\n- Metal/glass: neutral reflections\n\nTechnical Requirements:\n- Maintain original resolution and sharpness\n- No color bleeding between adjacent objects\n- Consistent color temperature across the entire image\n- Preserve photo grain/texture from original\n\nOutput: Full-color image matching original dimensions. No watermarks.` },
  { cat: 'image', title: 'Upscale 4× with Detail Preservation', prompt: `You are an Image Upscaling Specialist. Enhance resolution 4× while preserving detail.\n\nUpscaling Process:\n- Increase resolution by 4× (e.g., 512×512 → 2048×2048)\n- Preserve and enhance fine details (textures, edges, patterns)\n- No blurry or smudged output\n- Maintain original color accuracy and contrast\n\nEnhancement:\n- Subtle sharpening on edges (unsharp mask, 0.5-1.0 radius)\n- Noise reduction on flat areas only\n- Preserve natural image grain in detailed areas\n- No artificial "smooth" look\n\nOutput: PNG at 4× original resolution, same aspect ratio.` },
  { cat: 'image', title: 'Night Photo Denoise + Dehaze', prompt: `You are a Night Photography Editor. Fix dark/low-light photos.\n\nDenoising:\n- Remove luminance noise while preserving detail\n- Reduce color noise (chroma blotching)\n- Keep natural grain in textured areas\n- Don't over-smooth skin or fabric\n\nDehazing:\n- Remove atmospheric haze/fog\n- Restore contrast in distant objects\n- Recover color saturation lost to haze\n\nExposure Fix:\n- Lift shadows without blowing highlights\n- Recover detail in dark areas\n- Maintain natural mood (don't make night look like day)\n\nOutput: Enhanced image with original resolution, natural look.` },
  { cat: 'image', title: 'Object Removal (Logo/Sticker)', prompt: `You are an Object Removal Specialist. Remove unwanted objects cleanly.\n\nRemoval Process:\n- Identify the target object precisely\n- Remove completely (no ghosting, no remnants)\n- Reconstruct background using surrounding pixels\n- Match texture, lighting, and color of the surrounding area\n\nBackground Reconstruction:\n- Use content-aware fill for complex backgrounds\n- Maintain natural patterns (brick walls, grass, fabric)\n- Preserve light direction and shadow consistency\n- No repeating patterns or visible cloning artifacts\n\nOutput: Image with object removed, natural-looking background. Same resolution as input.` },
  { cat: 'image', title: 'Sky Replacement – Golden Hour', prompt: `You are a Landscape Photo Editor. Replace the sky with golden hour lighting.\n\nSky Replacement:\n- Remove original sky completely\n- Insert golden hour sky (warm oranges, pinks, soft clouds)\n- Match perspective and horizon line\n- Blend edges seamlessly with foreground\n\nLighting Match:\n- Adjust foreground lighting to match new sky direction\n- Add warm color cast to match golden hour tones\n- Update shadows to reflect new light source\n- Reflections on water/glass should match new sky\n\nOutput: Composite image with replaced sky, matched lighting. Original resolution.` },
  { cat: 'image', title: 'Portrait Skin Retouch (Natural)', prompt: `You are a Beauty Retoucher. Natural-looking skin enhancement.\n\nSkin Work:\n- Remove temporary blemishes (pimples, redness, dark circles)\n- Smooth skin texture while keeping pores visible\n- Even skin tone across face\n- Remove under-eye bags slightly (not completely)\n\nWhat NOT to Do:\n- Don't make skin look plastic or waxy\n- Don't change face shape or features\n- Don't whiten teeth excessively\n- Don't remove freckles or beauty marks\n\nColor:\n- Natural warm skin tones\n- No orange/red color cast\n- Consistent with overall image lighting\n\nOutput: Enhanced portrait, same resolution, natural retouch.` },

  // ── WEB DEVELOPMENT (detailed) ──
  { cat: 'web', title: 'SaaS Landing Page (Full Build)', prompt: `Build a complete SaaS landing page as a single index.html file.\n\nStructure (top to bottom):\n1. Hero: Headline + subheadline + CTA button + hero image/illustration\n2. Social proof: Logo cloud (6 placeholder logos) + "Trusted by X companies"\n3. Features: 3-column grid with icons, titles, descriptions\n4. How it works: 3 steps with numbered circles\n5. Pricing: 3-tier cards (Free/Pro/Enterprise) with feature lists\n6. Testimonials: 3 cards with avatar, name, role, quote\n7. FAQ: 5 expandable questions (use <details>/<summary>)\n8. CTA: Final call-to-action with email signup form\n9. Footer: Links, social icons, copyright\n\nTechnical Requirements:\n- Responsive (mobile-first, breakpoints at 640/768/1024/1280px)\n- Dark theme with accent color (indigo/purple)\n- CSS variables for theming\n- Smooth scroll navigation\n- Lazy-load images\n- Meta tags: title, description, OG/Twitter cards\n- FAQPage JSON-LD schema\n- Accessibility: ARIA labels, keyboard nav, skip-to-content link\n- Performance: No external frameworks, inline critical CSS\n\nOutput: Complete, production-ready index.html. No commentary.` },
  { cat: 'web', title: 'Analytics Dashboard', prompt: `Build an analytics dashboard as a single index.html file.\n\nLayout:\n- Sidebar navigation (collapsible on mobile)\n- Top bar with search, notifications bell, user avatar\n- Main content: 4 KPI cards (revenue, users, orders, conversion)\n- Line chart area (use CSS-only bars, no libraries)\n- Data table with 10 rows, sortable columns\n- Date range picker (Last 7/30/90 days)\n\nTechnical:\n- CSS Grid for layout\n- CSS custom properties for dark theme\n- Responsive: sidebar collapses to hamburger on mobile\n- Mock data hardcoded (realistic numbers)\n- Hover effects on cards and table rows\n- Tab system for switching views\n- No JavaScript frameworks, vanilla JS only\n- Print-friendly styles\n\nOutput: Complete index.html with embedded CSS/JS.` },
  { cat: 'web', title: 'Personal Portfolio', prompt: `Build a developer portfolio as a single index.html file.\n\nSections:\n1. Hero: Name, title, 1-sentence intro, social links (GitHub/LinkedIn/Twitter), CTA\n2. About: Photo placeholder, bio paragraph, skills tags\n3. Projects: 4 project cards (image, title, description, tech stack tags, live + GitHub links)\n4. Experience: Timeline with 3 jobs (company, role, dates, bullet points)\n5. Blog: 3 recent post previews (title, date, excerpt, read more)\n6. Contact: Form with name, email, message, submit button\n7. Footer: Copyright, back-to-top button\n\nTechnical:\n- Smooth scroll between sections\n- Active nav highlighting based on scroll position\n- Intersection Observer for scroll animations (fade-in)\n- Dark/light theme toggle\n- Mobile responsive\n- SEO meta tags + Open Graph\n- Schema.org Person + WebSite markup\n- Print stylesheet that hides nav/animations\n\nOutput: Complete index.html.` },
  { cat: 'web', title: 'Pricing Page with Comparison Table', prompt: `Build a pricing page as a single index.html file.\n\nLayout:\n- Headline: "Simple, transparent pricing"\n- Toggle: Monthly / Annual (show savings percentage)\n- 3 pricing cards: Starter ($0), Pro ($29/mo), Business ($79/mo)\n- Each card: price, feature list (checkmarks), CTA button\n- Below: Feature comparison table (15+ features, rows for each plan)\n- FAQ section (5 questions about billing, refunds, upgrades)\n\nFeatures to Compare:\n- Users, Projects, Storage, API calls, Support level\n- Integrations, Custom domain, SSO, Audit log, SLA\n\nDesign:\n- "Most Popular" badge on Pro plan with gradient border\n- Annual toggle shows crossed-out monthly price\n- Hover effects on cards (lift + shadow)\n- Responsive: cards stack on mobile, table scrolls horizontally\n\nOutput: Complete index.html with all CSS/JS inline.` },

  // ── SEO (detailed) ──
  { cat: 'seo', title: 'FAQ Schema Generator', prompt: `Generate a complete FAQPage JSON-LD schema for a given topic.\n\nInput: Topic name and 5-7 common questions\n\nOutput Format:\n\`\`\`json\n{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [\n    {\n      "@type": "Question",\n      "name": "Question text here?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "Concise answer (2-3 sentences max). Include the target keyword naturally. Answer should be snippet-worthy for Google."\n      }\n    }\n  ]\n}\n\`\`\`\n\nRules:\n- 7-10 questions per schema\n- Questions must be actual search queries (not marketing speak)\n- Answers must be 50-300 characters (Google snippet length)\n- Include the primary keyword in at least 3 questions\n- Mix question types: "What is X?", "How to Y?", "Why Z?", "Is X worth it?"\n- Each answer must be factually accurate and helpful\n- Output ONLY the JSON, no commentary` },
  { cat: 'seo', title: 'Blog Post Outline Generator', prompt: `Create a detailed blog post outline optimized for SEO.\n\nInput: Target keyword and topic\n\nOutput Structure:\n1. Title (60 chars max, include keyword, use power word)\n2. Meta description (155 chars, include keyword + CTA)\n3. URL slug (short, keyword-rich)\n4. H1 title\n5. Introduction hook (question or statistic)\n6. H2 sections (5-8) with:\n   - H2 heading (include keyword variation)\n   - 2-3 H3 subheadings\n   - Key points to cover (3-5 bullet points)\n   - Internal link opportunities\n   - Suggested word count per section\n7. FAQ section (5 questions)\n8. Conclusion with CTA\n\nSEO Rules:\n- Primary keyword in: title, H1, first paragraph, 1-2 H2s, conclusion\n- Secondary keywords in remaining H2s\n- Total word count: 1500-2500 words\n- Reading level: Grade 8-10 (Flesch-Kincaid)\n\nOutput: Clean markdown outline. No commentary.` },
  { cat: 'seo', title: 'Title Tag + Meta Description Pack', prompt: `Generate 5 title tag + meta description variants for A/B testing.\n\nInput: Target keyword, page type (homepage/product/blog/tool), brand name\n\nFor EACH variant, output:\n- Title tag (50-60 chars, include keyword near start)\n- Meta description (150-155 chars, include keyword + CTA)\n- Why this variant might win (1 sentence)\n\nVariant Strategies:\n1. Power word + number: "10 Best [Keyword] Tools in 2026"\n2. Question: "What Is [Keyword]? Complete Guide for Beginners"\n3. How-to: "How to [Action] with [Keyword] (Step-by-Step)"\n4. Comparison: "[Keyword] vs [Alternative]: Which Is Better?"\n5. Urgency: "[Keyword] Guide – Don't Start Without This"\n\nRules:\n- No keyword stuffing (keyword appears 1-2 times max)\n- Each title must be unique and compelling\n- Descriptions must include a clear CTA\n- Avoid clickbait — be accurate\n\nOutput: 5 variants in a clean table format.` },
  { cat: 'seo', title: 'Internal Linking Strategy', prompt: `Create an internal linking strategy for a website.\n\nInput: List of pages (URL + title + primary keyword)\n\nOutput:\n1. Link Map: For each page, list 3-5 internal pages to link TO (with suggested anchor text)\n2. Hub Pages: Identify 3-5 "pillar" pages that should link to everything in their topic cluster\n3. Orphan Pages: Pages with NO incoming internal links (fix recommendations)\n4. Anchor Text Distribution: Ensure no more than 30% of anchors are exact-match keywords\n\nLink Building Rules:\n- Every page must have at least 3 internal links\n- Link from high-authority pages to low-authority pages\n- Use descriptive anchor text (not "click here")\n- Maintain topical relevance (don't link cooking page to tech page)\n- Breadcrumb structure: Home > Category > Page\n\nOutput Format:\n- Markdown table: Source URL | Target URL | Anchor Text | Reason\n- Priority list of pages needing the most links\n- Recommended site structure (hub-and-spoke model)` },

  // ── MARKETING (detailed) ──
  { cat: 'marketing', title: 'Google Ads RSA Copy (15 Variants)', prompt: `Write 15 Responsive Search Ad variants for Google Ads.\n\nInput: Product/service name, target keyword, USP, landing page URL\n\nFor EACH variant:\n- Headline 1 (30 chars max, include keyword)\n- Headline 2 (30 chars max, benefit/USP)\n- Headline 3 (30 chars max, CTA or social proof)\n- Description 1 (90 chars max, expand on headline)\n- Description 2 (90 chars max, secondary benefit + CTA)\n\nStrategy Mix:\n- 3 variants: Keyword-focused (exact match in headline)\n- 3 variants: Benefit-focused (what user gets)\n- 3 variants: Social proof (numbers, testimonials)\n- 3 variants: Urgency (limited time, act now)\n- 3 variants: Question-based (address pain point)\n\nRules:\n- No ALL CAPS words (Google disapproves)\n- No excessive punctuation (!!! or ???)\n- Include target keyword in at least 50% of headlines\n- Each description must be unique (no duplicates)\n- Total character count per variant under 300\n\nOutput: Clean table with all 15 variants.` },
  { cat: 'marketing', title: 'Facebook Ad Copy Framework', prompt: `Write 3 Facebook ad copy variants using proven frameworks.\n\nInput: Product, target audience, offer/discount, landing page\n\nVariant 1 – PAS (Problem-Agitate-Solution):\n- Hook: Call out the problem directly\n- Agitate: Make the pain feel urgent\n- Solution: Present your product as the answer\n- CTA: Clear action\n\nVariant 2 – AIDA (Attention-Interest-Desire-Action):\n- Attention: Shocking stat or bold claim\n- Interest: Curiosity gap or new information\n- Desire: Paint the picture of life after buying\n- Action: Specific CTA with benefit\n\nVariant 3 – Before-After-Bridge:\n- Before: Describe current painful state\n- After: Show transformed ideal state\n- Bridge: Explain how your product gets them there\n\nFor each variant:\n- Primary text (125 chars for feed, 500 chars for expanded)\n- Headline (40 chars)\n- Description (30 chars)\n- CTA button suggestion (Learn More / Shop Now / Sign Up)\n\nRules:\n- No Facebook policy violations (no before/after body claims)\n- Include social proof or numbers where possible\n- Mobile-first (most users see on phone)\n\nOutput: 3 complete ad variants with all fields.` },
  { cat: 'marketing', title: 'Email Subject Lines (20 Variants)', prompt: `Write 20 email subject lines for A/B testing.\n\nInput: Email purpose (welcome/promo/newsletter/re-engagement), product/brand, key message\n\nCategories (4 each):\n\nCuriosity Gap (4):\n- Create open loop that demands clicking\n- Example pattern: "The one thing most [audience] get wrong about [topic]"\n\nUrgency/Scarcity (4):\n- Time-limited or quantity-limited\n- Example: "Last chance: [offer] expires at midnight"\n\nPersonalization (4):\n- Use {first_name} or behavioral triggers\n- Example: "Your [product] is waiting, {first_name}"\n\nValue-First (4):\n- Lead with the benefit, not the pitch\n- Example: "Save 3 hours/week with this [product] trick"\n\nSocial Proof (4):\n- Numbers, testimonials, FOMO\n- Example: "12,847 people already switched to [product]"\n\nRules:\n- 30-50 characters each (mobile-friendly)\n- No spam words (FREE!!!, Act Now, Guaranteed)\n- No misleading content\n- Each must be genuinely different\n- Include emoji in 5 of them (sparingly)\n\nOutput: 20 subject lines in a numbered list with category label.` },

  // ── RESUME (detailed) ──
  { cat: 'resume', title: 'ATS Resume – Software Engineer', prompt: `Write an ATS-optimized resume for a Software Engineer.\n\nInput: Name, years of experience, key skills, education, notable projects\n\nFormat (plain text, ATS-parseable):\n\n[NAME]\n[Email] | [Phone] | [LinkedIn] | [GitHub]\n\nSUMMARY (2-3 lines):\n- Quantified achievement (# years, # projects, # users served)\n- Key technical skills (top 5)\n- What kind of role you're targeting\n\nEXPERIENCE (reverse chronological):\nFor each role:\n- Title | Company | Dates | Location\n- 4-6 bullet points starting with strong action verbs\n- Each bullet: ACTION + WHAT + RESULT (with numbers)\n- Example: "Reduced API response time by 40% by implementing Redis caching layer serving 2M daily requests"\n\nSKILLS:\n- Languages: [list]\n- Frameworks: [list]\n- Tools: [list]\n- Cloud/DevOps: [list]\n\nEDUCATION:\n- Degree | University | Year\n\nPROJECTS (2-3):\n- Name: brief description + tech stack + link\n\nRules:\n- No columns, tables, or graphics (ATS can't parse)\n- No headers/footers\n- Use standard section headings: Summary, Experience, Education, Skills\n- Every bullet must have a quantified result\n- Keywords must match common job descriptions\n- Length: 1 page (junior) or 2 pages (senior)\n\nOutput: Plain text resume, ready to paste into a document.` },
  { cat: 'resume', title: 'Cover Letter (General)', prompt: `Write a compelling cover letter for a job application.\n\nInput: Company name, job title, your top 3 qualifications, why you want this role\n\nStructure:\n\nParagraph 1 – Hook (3-4 sentences):\n- Open with a specific connection to the company (recent news, product, mission)\n- State the role you're applying for\n- One sentence on why you're uniquely qualified\n\nParagraph 2 – Value Proposition (4-5 sentences):\n- Connect your top 3 qualifications to their requirements\n- Use specific examples with numbers\n- Show you understand their challenges\n\nParagraph 3 – Cultural Fit (2-3 sentences):\n- Why this company specifically (not just any company)\n- What about their mission/culture resonates with you\n- How you'd contribute beyond the job description\n\nParagraph 4 – CTA (2 sentences):\n- Express enthusiasm\n- Clear next step (interview, portfolio review, etc.)\n\nRules:\n- 250-350 words total\n- Professional but not stiff — show personality\n- No generic phrases ("I'm a hard worker", "team player")\n- Reference the company by name 2-3 times\n- Tailored to the specific role (not generic)\n\nOutput: Complete cover letter text, ready to paste.` },

  // ── DATA SCIENCE (detailed) ──
  { cat: 'data', title: 'Pandas Cheat Sheet', prompt: `Create a comprehensive Pandas cheat sheet with real-world examples.\n\nSections to cover:\n\n1. LOADING DATA:\n- pd.read_csv(), read_excel(), read_json(), read_sql()\n- Common options: sep, encoding, dtype, parse_dates, na_values\n\n2. INSPECTION:\n- df.head(), df.info(), df.describe(), df.shape, df.dtypes\n- df.value_counts(), df.nunique(), df.isnull().sum()\n\n3. SELECTION:\n- Column: df['col'], df[['col1','col2']]\n- Row: df.loc[], df.iloc[], df.query()\n- Conditional: df[df['col'] > value], df[df['col'].isin([])]\n\n4. TRANSFORMATION:\n- df.apply(), df.map(), df.applymap()\n- df.assign(), df.rename(), df.astype()\n- String: df['col'].str.contains(), str.replace(), str.split()\n\n5. GROUPING:\n- df.groupby('col').agg({'col2': ['mean', 'sum', 'count']})\n- df.pivot_table(), df.crosstab()\n\n6. MERGING:\n- pd.merge() (inner, left, right, outer)\n- pd.concat(), df.join()\n\n7. TIME SERIES:\n- df.set_index('date').resample('M').mean()\n- df.rolling(7).mean(), df.shift()\n\nEach section: 3-5 code examples with comments.\nOutput: Clean markdown with code blocks.` },
  { cat: 'data', title: 'SQL Window Functions Guide', prompt: `Create a practical SQL window functions guide with examples.\n\nCover these functions with real-world use cases:\n\n1. ROW_NUMBER() – Assign unique numbers\n   - Use case: Paginate results, rank within groups\n   - Example: Top 3 orders per customer\n\n2. RANK() / DENSE_RANK() – Ranking with ties\n   - Use case: Leaderboards, percentile calculations\n   - Example: Employee salary ranking by department\n\n3. LAG() / LEAD() – Access previous/next rows\n   - Use case: Calculate day-over-day change\n   - Example: Monthly revenue growth rate\n\n4. SUM() / AVG() OVER() – Running totals\n   - Use case: Cumulative sales, moving averages\n   - Example: 7-day rolling average of website traffic\n\n5. NTILE() – Divide into buckets\n   - Use case: Percentile groups, quartile analysis\n   - Example: Segment customers into spending tiers\n\n6. FIRST_VALUE() / LAST_VALUE()\n   - Use case: Get first/last transaction per user\n   - Example: First and last login dates\n\n7. WINDOW clause (named windows)\n   - Use case: Reuse window definitions\n   - Example: Multiple aggregations in one query\n\nEach function: syntax + 2 real examples + common mistakes.\nOutput: Markdown with SQL code blocks and explanations.` },

  // ── LEGAL (detailed) ──
  { cat: 'legal', title: 'Privacy Policy Generator', prompt: `Generate a privacy policy for a web application.\n\nInput: App name, data collected, third-party services used\n\nSections to include:\n\n1. INFORMATION WE COLLECT:\n- Personal data (name, email, phone)\n- Usage data (analytics, cookies, device info)\n- User-generated content\n\n2. HOW WE USE YOUR INFORMATION:\n- Service provision\n- Communication\n- Analytics\n- Legal compliance\n\n3. DATA SHARING:\n- Third-party services list (Google Analytics, payment processors)\n- Legal requirements for sharing\n- No sale of personal data statement\n\n4. DATA SECURITY:\n- Encryption methods\n- Access controls\n- Breach notification process\n\n5. YOUR RIGHTS:\n- Access, correction, deletion (GDPR)\n- Opt-out of marketing\n- Data portability\n\n6. COOKIES:\n- Types used (essential, analytics, marketing)\n- How to manage/disable\n\n7. CHILDREN'S PRIVACY (COPPA)\n- Age restriction\n- Parental consent process\n\n8. CONTACT INFORMATION:\n- Privacy officer email\n- Response timeframe\n\nRules:\n- Use plain English, not legalese\n- India-first compliance (IT Act 2000, DPDP Act 2023)\n- Include GDPR compliance section\n- Date stamp and version number\n- Replace placeholders with ALL CAPS: [COMPANY_NAME], [EMAIL], [DATE]\n\nOutput: Complete privacy policy text, ready to publish.` },
]

const CAT_META = {
  image: { label: '🖼️ Image Editing', color: 'text-purple-400 bg-purple-500/15 border-purple-500/20' },
  web: { label: '🌐 Web Dev', color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/20' },
  seo: { label: '🔍 SEO', color: 'text-amber-400 bg-amber-500/15 border-amber-500/20' },
  marketing: { label: '📢 Marketing', color: 'text-pink-400 bg-pink-500/15 border-pink-500/20' },
  resume: { label: '📄 Resume', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20' },
  data: { label: '📊 Data Science', color: 'text-blue-400 bg-blue-500/15 border-blue-500/20' },
  legal: { label: '⚖️ Legal', color: 'text-orange-400 bg-orange-500/15 border-orange-500/20' },
}

const SERVICES = [
  { id: 'chatgpt', label: 'ChatGPT', url: t => `https://chatgpt.com/?q=${encodeURIComponent(t.slice(0, 4000))}` },
  { id: 'gemini', label: 'Gemini', url: () => 'https://gemini.google.com/app', copy: true },
  { id: 'claude', label: 'Claude', url: () => 'https://claude.ai/new', copy: true },
  { id: 'copilot', label: 'Copilot', url: t => `https://copilot.microsoft.com?q=${encodeURIComponent(t.slice(0, 4000))}` },
]

export default function ai_prompts() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [service, setService] = useState('chatgpt')
  const [expanded, setExpanded] = useState(null)
  const [copied, setCopied] = useState(null)

  const filtered = useMemo(() => {
    return PROMPTS.filter(p => {
      if (category !== 'all' && p.cat !== category) return false
      if (query) {
        const q = query.toLowerCase()
        return p.title.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q)
      }
      return true
    })
  }, [query, category])

  const copyPrompt = useCallback((text, id) => {
    navigator.clipboard?.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const openInAI = useCallback((prompt) => {
    const svc = SERVICES.find(s => s.id === service)
    if (!svc) return
    if (svc.copy) navigator.clipboard?.writeText(prompt)
    window.open(svc.url(prompt), '_blank', 'noopener')
  }, [service])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-purple-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  const counts = useMemo(() => {
    const c = { all: PROMPTS.length }
    PROMPTS.forEach(p => { c[p.cat] = (c[p.cat] || 0) + 1 })
    return c
  }, [])

  return (
    <ToolLayout
      title="AI Prompts Library"
      desc={`${PROMPTS.length} detailed, copy-paste AI prompts for image editing, web dev, SEO, marketing, resumes, data science, and legal documents. Each prompt includes specific instructions, constraints, and output format.`}
      icon="🧠" iconBg="rgba(168,85,247,0.08)"
      category="text" slug="ai-prompts"
      faq={[
        { q: 'What makes these prompts different?', a: 'Each prompt includes specific role assignment, detailed instructions, constraints, expected output format, and rules — not just a one-liner. They produce professional-quality output from any AI tool.' },
        { q: 'How do I use them?', a: 'Search or browse by category, expand a prompt to see the full text, copy it, then paste into ChatGPT, Gemini, Claude, or any AI tool.' },
        { q: 'Can I modify the prompts?', a: 'Absolutely! Replace bracketed placeholders with your specific details. The prompts are templates — customize them for your exact use case.' },
      ]}
      howItWorks={[
        'Browse by category or search for specific topics.',
        'Click a prompt card to expand the full detailed instructions.',
        'Copy the prompt or click "Open in AI" to paste it directly.',
        'Replace any [BRACKETED] placeholders with your specifics.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI Prompts Library", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/ai-prompts/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Search + Service */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search prompts..."
            className={inputClass} />
          <select value={service} onChange={e => setService(e.target.value)}
            className={inputClass + ' cursor-pointer'}>
            {SERVICES.map(s => <option key={s.id} value={s.id} className="bg-slate-900">{s.label}{s.copy ? ' (copies first)' : ''}</option>)}
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${category === 'all' ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.03] border-white/6 text-slate-500 hover:text-white'}`}>
            All ({counts.all})
          </button>
          {Object.entries(CAT_META).map(([key, meta]) => (
            <button key={key} onClick={() => setCategory(key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${category === key ? meta.color + ' border-current/20' : 'bg-white/[0.03] border-white/6 text-slate-500 hover:text-white'}`}>
              {meta.label} ({counts[key] || 0})
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500">{filtered.length} detailed prompts</div>

        {/* Prompt Cards */}
        <div className="space-y-3">
          {filtered.map((p, i) => {
            const meta = CAT_META[p.cat]
            const id = `${p.cat}-${i}`
            const isExpanded = expanded === id
            return (
              <div key={id} className="rounded-2xl border-2 border-white/8 bg-white/[0.03] overflow-hidden transition-all duration-200 hover:border-white/12">
                <button onClick={() => setExpanded(isExpanded ? null : id)}
                  className="w-full text-left p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${meta.color}`}>{meta.label}</span>
                    <span className="text-sm font-bold text-white truncate">{p.title}</span>
                  </div>
                  <svg className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3" style={{ animation: 'slideUp 0.2s ease' }}>
                    <pre className="bg-black/30 border border-white/8 rounded-xl p-4 text-xs text-slate-300 whitespace-pre-wrap font-mono overflow-x-auto max-h-96 overflow-y-auto leading-relaxed">{p.prompt}</pre>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => copyPrompt(p.prompt, id)}
                        className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 text-xs font-bold hover:bg-purple-500/30 transition-colors active:scale-95">
                        {copied === id ? '✓ Copied!' : '📋 Copy Full Prompt'}
                      </button>
                      <button onClick={() => openInAI(p.prompt)}
                        className="px-4 py-2 rounded-xl bg-white/5 text-white text-xs font-bold hover:bg-white/10 transition-colors border border-white/8 active:scale-95">
                        🚀 Open in {SERVICES.find(s => s.id === service)?.label}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-600">💡 Replace any [BRACKETED] text with your specifics before using.</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🧠</div>
            <p className="text-sm text-slate-600 font-medium">No prompts match "{query}"</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
