#!/usr/bin/env python3
"""Fix the broken content in emi-calculator/index.html"""
import re

with open(r'C:\AI\uptools\emi-calculator\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the footer and everything after it
footer_marker = '<footer class="note small site-footer" role="contentinfo">'
script_marker = '<script defer="">'

footer_pos = content.rfind(footer_marker)
script_pos = content.find(script_marker, footer_pos)

if footer_pos > 0 and script_pos > footer_pos:
    # Keep: everything up to and including </footer>
    end_of_footer = content.find('</footer>', footer_pos) + len('</footer>')
    before = content[:end_of_footer]
    after = content[script_pos:]
    
    new_sections = """
<!-- Do's and Don'ts for EMI -->
<section class="card" style="margin-top:16px">
<h2 style="margin-top:0">✅ Do's and ❌ Don'ts for Loan EMI Planning</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
<div class="card" style="border-color:rgba(34,197,94,.3)">
<h3 style="color:#22c55e;margin-top:0;font-size:1rem">✅ Do's</h3>
<ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
<li style="padding:.35rem 0">✅ <b>Do</b> keep total EMI under 40% of monthly take-home income.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> use prepayment to reduce total interest — even small amounts help.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> compare at least 2-3 lenders before choosing a loan.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> factor in processing fees and prepayment charges.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> use the amortization schedule to plan finances month by month.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> build an emergency fund covering 3-6 months of EMI before borrowing.</li>
</ul>
</div>
<div class="card" style="border-color:rgba(239,68,68,.3)">
<h3 style="color:#ef4444;margin-top:0;font-size:1rem">❌ Don'ts</h3>
<ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
<li style="padding:.35rem 0">❌ <b>Don't</b> choose tenure just for the lowest EMI — it may cost more interest.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> ignore the impact of rate changes on floating-rate loans.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> prepay without checking for prepayment penalties.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> take on new debt before repaying existing EMIs.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> forget insurance and processing fees in total cost.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> share loan details with untrusted third-party apps.</li>
</ul>
</div>
</div>
</section>
<!-- How this EMI calculator works -->
<section class="card" style="margin-top:16px">
<details open>
<summary style="cursor:pointer;font-weight:700;font-size:1.1rem;padding:4px 0">📐 How This EMI Calculator Works</summary>
<div style="margin-top:8px;color:#9aa4b2">
<p><b>Formula:</b> EMI = P × r × (1 + r)<sup>n</sup> ÷ [(1 + r)<sup>n</sup> − 1]</p>
<ul style="margin:4px 0 8px 1.2rem">
<li><b>P</b> = Loan principal (amount borrowed)</li>
<li><b>r</b> = Monthly interest rate = annual rate ÷ 12 ÷ 100</li>
<li><b>n</b> = Total number of months</li>
</ul>
<h3>Worked Example</h3>
<p>₹10,00,000 at 9% p.a. for 240 months:</p>
<p>r = 0.09 ÷ 12 = 0.0075</p>
<p><b>EMI ≈ ₹8,997</b> | Total interest ≈ ₹11,59,280 | Total ≈ ₹21,59,280</p>
<h3>Example with Prepayment</h3>
<p>Prepay ₹2,00,000 in month 12 → remaining principal drops, tenure shortens, and total interest saved can be over ₹1,00,000.</p>
<p style="margin-top:8px">Also try: <a href="/fd-calculator/">FD Calculator</a> · <a href="/sip-calculator/">SIP Calculator</a> · <a href="/income-tax-tool/">Income Tax Calculator</a></p>
</div>
</details>
</section>
<!-- FAQ Section -->
<section class="card" style="margin-top:16px">
<h2 style="margin-top:0">Frequently Asked Questions</h2>
<details><summary><b>What is a good loan tenure?</b></summary><p style="padding:6px 0;color:#9aa4b2">Shorter tenures reduce total interest but increase EMI. Pick an EMI that fits your budget.</p></details>
<details><summary><b>Fixed vs floating rates?</b></summary><p style="padding:6px 0;color:#9aa4b2">Floating rates are usually lower but can change. Fixed rates offer certainty but are higher.</p></details>
<details><summary><b>Can I compare two loans?</b></summary><p style="padding:6px 0;color:#9aa4b2">Yes. Fill in the Compare fields to see EMI and total interest side-by-side.</p></details>
<details><summary><b>How does prepayment reduce interest?</b></summary><p style="padding:6px 0;color:#9aa4b2">Prepayment reduces outstanding principal, so less interest accrues for all remaining months.</p></details>
</section>
"""
    content = before + new_sections + after
    with open(r'C:\AI\uptools\emi-calculator\index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('EMI Calculator updated successfully!')
else:
    print(f'Could not find markers: footer_pos={footer_pos}, script_pos={script_pos}')
