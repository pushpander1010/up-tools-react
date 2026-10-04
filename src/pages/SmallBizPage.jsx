import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import FAQ from '../components/FAQ'

const TITLE = 'AI for Small Business: Automate Daily Ops, WhatsApp & Marketing'
const DESC = 'Master AI automation for small businesses with an interactive shop day simulator — automate morning price lists & inventory, noon WhatsApp customer replies, and evening accounts & bookkeeping. Explore real-time time-saved meters, cost comparison toggles, Python & JavaScript automation code, 5 practice questions, 4 FAQs and actionable business tips.'
const URL = 'https://www.uptools.in/learning/ai/ai-for-small-business/'

// ---------------------------------------------------------------------------
// Shop Day Workflow Presets & Step-by-Step Automation Scenarios
// ---------------------------------------------------------------------------
const SHOP_PRESETS = [
  {
    id: 'retail-grocery',
    name: '🏪 Retail Grocery & Kirana',
    subtitle: 'Daily inventory, wholesale bill OCR, WhatsApp orders & ledger',
    accentColor: '#10b981',
    dailySavingsHours: 4.8,
    efficiencyGain: 86,
    manualCostMonthly: '$650 / ₹35,000',
    aiCostMonthly: '$22 / ₹1,400',
    steps: [
      {
        time: '🌅 08:00 AM — Morning',
        stage: 'Supplier Invoice OCR & Smart Price List',
        manualTask: 'Manually typing 40 supplier invoice items into paper ledger and scribbling daily vegetable & grain rates on a blackboard.',
        aiAutomation: 'Owner snaps a photo of wholesale bills. Vision AI extracts item names, quantities, buy prices, calculates 22% retail margins, and auto-generates a formatted WhatsApp broadcast price card.',
        timeSavedMin: 75,
        accuracyScore: 99,
        speedScore: 95,
        adminScore: 92,
        logOutput: 'Parsed 38 invoice items from image • Margin auto-applied (+22%) • Daily WhatsApp catalog broadcast generated in English & Hindi.',
        badge: 'Vision OCR + Auto-Pricing',
      },
      {
        time: '☀️ 01:00 PM — Afternoon',
        stage: 'WhatsApp Inquiries & Multilingual Order Taking',
        manualTask: 'Owner constantly distracted from in-store customers to answer repetitive WhatsApp texts: "Is Basmati rice in stock?", "What is oil price?".',
        aiAutomation: 'AI WhatsApp bot connects to live inventory sheet. Understands English, Hindi, and Hinglish queries, confirms stock, totals cart with UPI QR code, and alerts delivery boy.',
        timeSavedMin: 120,
        accuracyScore: 98,
        speedScore: 99,
        adminScore: 94,
        logOutput: 'Handled 64 customer chats • 28 orders placed via WhatsApp • 0 manual typing interruptions during peak in-store rush.',
        badge: 'Multilingual Chat Agent',
      },
      {
        time: '🌆 07:00 PM — Evening',
        stage: 'Daily Accounts, UPI Reconciliation & Udhar Ledger',
        manualTask: 'Spending 90 minutes calculating paper cash slips, matching UPI notifications with ledger entries, and listing outstanding credit (Udhar).',
        aiAutomation: 'AI reconciles bank UPI exports against POS tickets, detects ₹180 payment mismatch, updates digital customer ledger, and drafts gentle WhatsApp payment reminders.',
        timeSavedMin: 65,
        accuracyScore: 99,
        speedScore: 94,
        adminScore: 97,
        logOutput: 'Total revenue reconciled: ₹48,650 • 1 mismatch auto-flagged • 12 Udhar payment reminders scheduled with 1-click payment links.',
        badge: 'Reconciliation Engine',
      },
      {
        time: '🌙 09:30 PM — Night',
        stage: 'Automated Retention & Festive Promo Blasts',
        manualTask: 'Rarely doing any marketing because the owner is exhausted at closing time.',
        aiAutomation: 'AI analyzes purchase patterns: identifies 42 customers who haven’t visited in 14 days and sends personalized "We miss you" discount coupons with top purchased items.',
        timeSavedMin: 30,
        accuracyScore: 96,
        speedScore: 92,
        adminScore: 90,
        logOutput: 'Sent 42 targeted win-back messages • Generated weekend special promo banner copy • Estimated extra weekend revenue: +₹14,000.',
        badge: 'Retention Marketing',
      },
    ],
  },
  {
    id: 'cafe-bakery',
    name: '☕ Café & Artisan Bakery',
    subtitle: 'Daily specials, custom cake pre-orders, ingredient alerts & reviews',
    accentColor: '#f59e0b',
    dailySavingsHours: 4.2,
    efficiencyGain: 82,
    manualCostMonthly: '$580 / ₹30,000',
    aiCostMonthly: '$19 / ₹1,200',
    steps: [
      {
        time: '🌅 07:30 AM — Morning',
        stage: 'Daily Specials Menu & Social Copywriting',
        manualTask: 'Chef writes daily dessert board manually and spends 45 mins struggling to write appetizing Instagram captions and story graphics.',
        aiAutomation: 'AI generates mouth-watering descriptions for "Pistachio Croissant" & "Hazelnut Latte", creates Instagram Story copy, and updates the digital QR table menu instantly.',
        timeSavedMin: 45,
        accuracyScore: 96,
        speedScore: 98,
        adminScore: 88,
        logOutput: 'Created 3 Instagram caption variations • Updated QR table menu • Scheduled daily broadcast to 210 VIP café members.',
        badge: 'Creative Menu Engine',
      },
      {
        time: '☀️ 01:30 PM — Afternoon',
        stage: 'Custom Cake Pre-Order Intake & Quotations',
        manualTask: 'Exchanging 15 back-and-forth WhatsApp messages per customer about cake flavors, dietary allergies, weights, and pickup slots.',
        aiAutomation: 'AI order bot guides the customer through a friendly 4-step selector (Flavors, Weight, Eggless/Vegan, Date/Time), calculates price, and logs pickup slot directly in Google Calendar.',
        timeSavedMin: 110,
        accuracyScore: 99,
        speedScore: 96,
        adminScore: 95,
        logOutput: 'Processed 14 custom cake bookings • Verified eggless requirements • Zero double-booked delivery slots.',
        badge: 'Pre-Order Flow Bot',
      },
      {
        time: '🌆 08:00 PM — Evening',
        stage: 'Ingredient Waste Tracking & Stock Reorder Alerts',
        manualTask: 'Barista eyeballing milk cartons, coffee beans, and flour bags on paper pads with frequent morning shortages.',
        aiAutomation: 'AI checks daily sales against recipe bill-of-materials (BOM), estimates remaining coffee beans and dairy stock, and drafts an auto-order email to dairy vendor.',
        timeSavedMin: 55,
        accuracyScore: 97,
        speedScore: 91,
        adminScore: 93,
        logOutput: 'Detected low oat milk stock (<4 cartons) • Auto-drafted reorder PO to supplier for 7:00 AM morning delivery.',
        badge: 'Predictive Stock Check',
      },
      {
        time: '🌙 10:00 PM — Night',
        stage: 'Google Review Monitoring & Sentiment Replies',
        manualTask: 'Ignoring customer Google Maps reviews or copying generic "Thanks" responses.',
        aiAutomation: 'AI monitors new 5-star & 3-star Google reviews, drafts warm personalized replies thanking specific food mentions, and flags any complaint to the manager.',
        timeSavedMin: 40,
        accuracyScore: 98,
        speedScore: 95,
        adminScore: 91,
        logOutput: 'Replied to 7 new reviews on Google Maps • Identified compliment on Barista Alex • 100% positive reputation response rate.',
        badge: 'Reputation Manager',
      },
    ],
  },
  {
    id: 'boutique-fashion',
    name: '👗 Boutique & Fashion Studio',
    subtitle: 'Catalog photo copy, DM size inquiries, vendor tracking & flash sales',
    accentColor: '#ec4899',
    dailySavingsHours: 5.2,
    efficiencyGain: 89,
    manualCostMonthly: '$780 / ₹42,000',
    aiCostMonthly: '$28 / ₹1,800',
    steps: [
      {
        time: '🌅 09:00 AM — Morning',
        stage: 'AI Product Descriptions & Lookbook Copy',
        manualTask: 'Owner spends 2 hours drafting fabric details, sizing specs, and styling suggestions for 12 newly arrived designer dresses.',
        aiAutomation: 'AI vision analyzes dress photos, writes SEO-rich product titles, fabric care tips, and creates matching hashtags for Instagram, Pinterest, and WhatsApp catalogs.',
        timeSavedMin: 80,
        accuracyScore: 97,
        speedScore: 96,
        adminScore: 92,
        logOutput: 'Generated 12 product catalog listings • Extracted color palette & fabric tags • Ready for multi-channel export.',
        badge: 'Catalog Vision Engine',
      },
      {
        time: '☀️ 02:00 PM — Afternoon',
        stage: 'Instagram DM & WhatsApp Size Consultation',
        manualTask: 'Answering hundreds of "Price please?", "Is Size M available in blue?", "Do you ship to Mumbai?" DMs manually.',
        aiAutomation: 'AI DM Assistant answers pricing instantly, provides accurate size recommendation chart based on customer measurements, and shares instant checkout link.',
        timeSavedMin: 140,
        accuracyScore: 99,
        speedScore: 99,
        adminScore: 96,
        logOutput: 'Resolved 85 DM inquiries in under 12 seconds each • Converted 22 direct DM sales without owner intervention.',
        badge: 'Social Commerce Agent',
      },
      {
        time: '🌆 07:30 PM — Evening',
        stage: 'Custom Alteration & Tailoring Order Tracking',
        manualTask: 'Juggling paper tailoring slips, customer fabric swatches, and missed promised pickup deadlines.',
        aiAutomation: 'AI tracks master tailor status, calculates delivery milestones, and sends automated WhatsApp status updates ("Your lehenga is ready for trial!").',
        timeSavedMin: 50,
        accuracyScore: 98,
        speedScore: 93,
        adminScore: 95,
        logOutput: 'Sent 16 trial-ready WhatsApp alerts • Reduced customer inquiry phone calls by 78%.',
        badge: 'Workflow Tracker',
      },
      {
        time: '🌙 09:30 PM — Night',
        stage: 'VIP Flash Sale & Festival Broadcasts',
        manualTask: 'Broadcasting generic PDF brochures to thousands of contacts resulting in high WhatsApp spam block rates.',
        aiAutomation: 'AI segments audience by past purchase preferences (e.g. ethnic wear vs western formal) and generates curated micro-catalogs with 3.4x higher conversion.',
        timeSavedMin: 40,
        accuracyScore: 95,
        speedScore: 94,
        adminScore: 90,
        logOutput: 'Dispatched 3 segmented campaigns to 450 contacts • Zero spam flags • 34% catalog open rate.',
        badge: 'Smart Segmentation',
      },
    ],
  },
  {
    id: 'home-services',
    name: '🛠️ Local Services & Repair Workshop',
    subtitle: 'Quote generation, technician dispatch, photo damage assessment & billing',
    accentColor: '#3b82f6',
    dailySavingsHours: 4.5,
    efficiencyGain: 84,
    manualCostMonthly: '$620 / ₹32,000',
    aiCostMonthly: '$20 / ₹1,300',
    steps: [
      {
        time: '🌅 08:00 AM — Morning',
        stage: 'Lead Intake & Automated Cost Estimation',
        manualTask: 'Calling back 20 homeowners requesting AC repair, plumbing, or electrical estimates without standardized pricing.',
        aiAutomation: 'Customer sends a WhatsApp photo/video of the issue (e.g. leaking AC pipe). AI diagnoses the fault category, estimates standard parts + labor range, and books an inspection slot.',
        timeSavedMin: 70,
        accuracyScore: 95,
        speedScore: 97,
        adminScore: 91,
        logOutput: 'Categorized 18 repair requests • Generated 18 instant price estimate ranges • 12 appointments scheduled.',
        badge: 'Visual Fault Triager',
      },
      {
        time: '☀️ 01:00 PM — Afternoon',
        stage: 'Technician Route Optimization & Live WhatsApp Dispatch',
        manualTask: 'Coordinator phoning 5 technicians across town trying to figure out who is nearest to the next urgent breakdown.',
        aiAutomation: 'AI checks technician live zones, assigns closest job, and sends customer WhatsApp live update: "Technician Rajesh will arrive between 2:15 - 2:45 PM".',
        timeSavedMin: 90,
        accuracyScore: 98,
        speedScore: 98,
        adminScore: 94,
        logOutput: 'Optimized 14 technician routes • Saved 42 km aggregate driving time • Customer no-show rate reduced to <2%.',
        badge: 'Smart Dispatcher',
      },
      {
        time: '🌆 06:30 PM — Evening',
        stage: 'On-Site Photo Invoicing & Payment QR Generation',
        manualTask: 'Technicians bringing messy paper carbon-copy receipts back to office at 9 PM for manual data entry.',
        aiAutomation: 'Technician takes a photo of replaced spare parts in their mobile app. AI generates PDF invoice with warranty terms, sends payment link to customer, and marks job completed.',
        timeSavedMin: 65,
        accuracyScore: 99,
        speedScore: 95,
        adminScore: 96,
        logOutput: 'Generated 14 digital tax invoices with warranty certificates • 92% payments collected on-site via dynamic UPI QR.',
        badge: 'Instant Digital Invoicer',
      },
      {
        time: '🌙 09:00 PM — Night',
        stage: '5-Star Review Trigger & Service Warranty Alerts',
        manualTask: 'Never collecting online reviews; losing local Google SEO ranking to bigger aggregators.',
        aiAutomation: 'AI sends a polite satisfaction check 2 hours post-repair. Delighted customers receive a direct 1-tap Google Maps review link, while any rating <4 stars alerts the owner for quick resolution.',
        timeSavedMin: 45,
        accuracyScore: 96,
        speedScore: 90,
        adminScore: 89,
        logOutput: 'Collected 8 new 5-star Google reviews today • 1 minor leak issue resolved within 30 minutes before negative review.',
        badge: 'Reputation & Growth',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Interactive WhatsApp Customer Bot Simulator Conversations
// ---------------------------------------------------------------------------
const CHAT_SIMULATOR_PRESETS = [
  {
    id: 'stock-check',
    customer: 'Bhaiya, do you have Fortune Mustard Oil 1L and Daawat Basmati Rice 5kg in stock? What is the total price?',
    customerLang: 'Hinglish / English',
    intent: 'Multi-item Inventory Query & Price Quote',
    aiThought: '1. Query local inventory database for "Fortune Mustard Oil 1L" (Stock: 14 pcs, Price: ₹145) and "Daawat Basmati Rice 5kg" (Stock: 8 bags, Price: ₹420). 2. Calculate subtotal: ₹565. 3. Check for active store promo (Free delivery above ₹500). 4. Format crisp multilingual reply with 1-click UPI pay link.',
    botReply: 'Namaste! Yes, both items are available right now in stock:\n\n1️⃣ Fortune Mustard Oil 1L — ₹145\n2️⃣ Daawat Basmati Rice 5kg — ₹420\n━━━━━━━━━━━━━━━\n🧾 Total: ₹565 (Qualifies for Free Home Delivery! 🚚)\n\nReply "YES" to confirm delivery to your saved address, or pay directly via UPI: https://upi.link/store-pay?amt=565',
    latency: '0.8s',
  },
  {
    id: 'custom-cake',
    customer: 'Hi! Can I order a 1kg chocolate truffle cake for tomorrow 6 PM? Must be 100% eggless with message "Happy 30th Rohan".',
    customerLang: 'English',
    intent: 'Custom Pre-Order & Dietary Requirement Verification',
    aiThought: '1. Verify kitchen capacity for tomorrow 6:00 PM slot (Status: Available, 3/8 slots booked). 2. Confirm eggless chocolate truffle availability (Base price: ₹850). 3. Add custom text personalization. 4. Lock calendar slot and issue deposit invoice.',
    botReply: 'Hello! 🎂 We would love to bake this for you!\n\n✨ 1kg Artisan Chocolate Truffle (100% Pure Eggless)\n✍️ Message: "Happy 30th Rohan"\n⏰ Pickup / Delivery: Tomorrow at 6:00 PM\n💰 Total Price: ₹850\n\nWould you prefer store pickup or home delivery? Let us know and we’ll reserve your baking slot immediately!',
    latency: '1.1s',
  },
  {
    id: 'service-quote',
    customer: 'My split AC is making a loud buzzing noise and not cooling. How much will inspection and gas check cost in Indiranagar?',
    customerLang: 'English',
    intent: 'Service Diagnostic, Pricing Transparency & Booking',
    aiThought: '1. Match symptoms "buzzing noise + poor cooling" to fan capacitor / compressor inspection. 2. Standard inspection visit fee = ₹299 (waived if repair is approved). 3. Identify technician coverage for Indiranagar zone (Technician available today 3 PM - 5 PM).',
    botReply: 'Hello! That typically indicates a fan motor or capacitor issue. Here is our transparent pricing:\n\n🔍 Inspection & Diagnostics: ₹299 (100% Free if you proceed with repair)\n❄️ Gas Pressure Check: Included\n⏱️ Available Slot Today: 3:30 PM – 5:00 PM in Indiranagar\n\nOur verified technician carries genuine spare parts with a 90-day service warranty. Reply with your flat number to book!',
    latency: '0.9s',
  },
]

function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5">
        <span className="text-xs font-bold text-slate-300">{lang}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            })
          }}
          className="text-xs font-semibold text-emerald-300 hover:text-white bg-transparent border-0 cursor-pointer"
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <pre className="m-0 p-4 text-xs leading-relaxed overflow-x-auto bg-black/40 text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  )
}

const QUESTIONS = [
  {
    q: 'How can a small retail shop or local business use AI automation without writing complex code?',
    a: 'Small business owners do not need to build custom neural networks or hire engineers. Today, accessible automation stacks combine no-code workflow builders (such as Make.com, Zapier, or n8n) with pre-built AI APIs (OpenAI, Claude, or Google Gemini) and WhatsApp Business API aggregators (WATI, Interakt, AiSensy). An owner can connect a simple Google Sheet or POS database to a WhatsApp bot in under an hour: when a customer messages, the AI reads the sheet for live pricing and replies automatically in conversational English, Hindi, or regional languages.',
  },
  {
    q: 'How does AI handle multilingual customer inquiries on WhatsApp (e.g. Hinglish, typos, and voice notes)?',
    a: 'Modern Large Language Models (LLMs) and Multimodal Whisper models excel at colloquial language understanding. When a customer writes "Bhaiya 2kg aashirvaad atta hai kya price kitna hai?", the LLM tokenizes the mixed dialect, maps "aashirvaad atta" to product SKU "AASHIRVAAD_ATTA_2KG", extracts the intent (stock check & price), queries the store database, and crafts a polite response in the identical linguistic tone chosen by the customer. Whisper speech-to-text models can also transcribe incoming audio voice notes in seconds.',
  },
  {
    q: 'How do AI Vision and OCR models automate daily paper invoices, supplier bills, and handwritten ledgers?',
    a: 'Instead of manually typing vendor invoices line-by-line into accounting software, multimodal vision models (GPT-4o Vision, Gemini 1.5 Flash, Claude 3.5 Sonnet) receive a camera photo of the paper receipt. The model performs structured optical character recognition (OCR), extracts line items, quantities, HSN/GST tax rates, discounts, and total payable amounts, and returns clean JSON structured data. This data is piped directly into Tally, Zoho Books, QuickBooks, or Google Sheets with zero human data entry error.',
  },
  {
    q: 'What safeguards prevent an AI customer service bot from hallucinating incorrect prices or offering unauthorized discounts?',
    a: 'Small businesses protect themselves using 3 critical engineering patterns: 1) Retrieval-Augmented Grounding (RAG / Tool Calling): The AI is strictly instructed to only quote prices returned by an internal database API, never guessing from memory. 2) Strict System Guardrails: "If an item is not found in the product database, politely state that you are checking with the store manager; never invent inventory or discount codes." 3) Human-in-the-Loop Escalation: High-value refund requests, credit requests (Udhar), or complex custom orders trigger an instant manager alert on WhatsApp.',
  },
  {
    q: 'How does AI-driven retention marketing differ from generic, spammy WhatsApp bulk broadcasts?',
    a: 'Generic broadcasts blast identical PDF flyers to all phone numbers, leading to low open rates and customers blocking the business. AI retention marketing performs intelligent customer segmentation: it analyzes purchase frequency, recency, and favorite items. A customer who purchases premium coffee beans every 3 weeks receives a timely reminder with a 10% refill discount on day 20, while a festival greeting includes recommendations tailored to their family dietary preferences (e.g. eggless sweets vs vegan snacks).',
  },
]

const FAQS = [
  {
    q: 'How much does it actually cost for a small business to run AI automation monthly?',
    a: 'For most small and medium businesses (50 to 300 customer conversations per day plus daily bookkeeping OCR), the raw AI API token cost is under $10 to $25 per month (approx. ₹800 – ₹2,000 INR) using fast, cost-effective models like GPT-4o-mini or Gemini 1.5 Flash. Adding WhatsApp Business API messaging fees and a no-code connector platform brings the total monthly operating cost to around $30 – $60 (₹2,500 – ₹5,000 INR), which replaces 100+ hours of manual administrative labor.',
  },
  {
    q: 'Does a business owner need programming skills or technical staff to maintain these AI tools?',
    a: 'No. Modern small-business AI platforms provide visual, drag-and-drop workflow builders where owners configure triggers (e.g. "When a WhatsApp message arrives with an image, run OCR and log to Google Sheets"). Day-to-day catalog updates happen directly in everyday spreadsheets or POS mobile apps that owners already know how to use.',
  },
  {
    q: 'Can AI connect directly with our existing inventory software, POS, or Google Sheets?',
    a: 'Yes. Most modern Point-of-Sale (POS) systems, e-commerce stores (Shopify, WooCommerce), and accounting tools (Zoho Books, QuickBooks, Tally via webhooks) provide REST APIs and webhook integrations. For traditional local shops that do not have custom APIs, Google Sheets or Airtable serves as a lightweight, real-time database that AI can read and update in milliseconds.',
  },
  {
    q: 'How do small businesses ensure customer data privacy and payment security when using AI tools?',
    a: 'Reputable enterprise AI APIs (OpenAI API, Google Cloud Vertex, Anthropic API) do not use customer API data for public model training. Furthermore, payments are never processed directly in plaintext AI chat: the AI provides secure encrypted payment gateway links (such as Razorpay, Stripe, or dynamic UPI QR codes). The AI bot only confirms the webhook payment callback status ("Paid ✓") without touching sensitive bank or card credentials.',
  },
]

const PY_CODE = `# Complete Small Business AI Operations Engine in Python
# 1. Invoice Image OCR & Price Margins
# 2. Automated WhatsApp Customer Order Assistant with Tool Calling
import os
import json
import openai

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Mock Store Database (Can be SQLite, PostgreSQL, or Google Sheets)
INVENTORY_DB = {
    "daawat_basmati_5kg": {"name": "Daawat Rozana Basmati Rice 5kg", "price": 420, "stock": 14},
    "fortune_mustard_oil_1l": {"name": "Fortune Kachi Ghani Mustard Oil 1L", "price": 145, "stock": 28},
    "aashirvaad_atta_10kg": {"name": "Aashirvaad Superior MP Sharbati Atta 10kg", "price": 460, "stock": 9},
}

def query_inventory(item_keyword: str) -> dict:
    """Tool: Searches inventory database for stock availability and retail price."""
    keyword = item_keyword.lower()
    matches = []
    for sku, data in INVENTORY_DB.items():
        if any(w in data["name"].lower() for w in keyword.split()):
            matches.append({"sku": sku, **data})
    return {"status": "success", "results": matches}

def process_supplier_invoice_image(image_url: str) -> dict:
    """
    Vision AI OCR: Extracts line items from a photo of a wholesale paper invoice,
    computes 20% retail markup, and formats for accounting import.
    """
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": """Extract items from the supplier invoice photo into JSON:
                {
                  "supplier_name": "string",
                  "invoice_number": "string",
                  "date": "YYYY-MM-DD",
                  "items": [
                    {"item_name": "str", "qty": int, "wholesale_unit_cost": float, "suggested_retail_price": float}
                  ],
                  "subtotal": float,
                  "tax_gst": float,
                  "total_amount": float
                }
                Apply standard 20% retail margin on wholesale_unit_cost."""
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Extract all line items and compute retail pricing from this invoice:"},
                    {"type": "image_url", "image_url": {"url": image_url}}
                ]
            }
        ]
    )
    return json.loads(response.choices[0].message.content)

def handle_whatsapp_customer_query(customer_phone: str, user_message: str) -> str:
    """
    AI WhatsApp Agent: Handles multilingual customer inquiries, checks real-time inventory,
    and formats crisp checkout replies.
    """
    system_prompt = """
    You are 'Kripa', the friendly AI assistant for Sharma Kirana & Grocery Store.
    Guidelines:
    1. Reply in the same language/dialect as customer (English, Hindi, or Hinglish).
    2. Check live stock before quoting availability using the inventory tool.
    3. If order qualifies for free delivery (> ₹500), highlight it excitedly!
    4. Keep messages concise and formatted with emoji bullet points for mobile screens.
    """

    tools = [
        {
            "type": "function",
            "function": {
                "name": "query_inventory",
                "description": "Look up stock quantity and price for groceries by keyword.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "item_keyword": {"type": "string", "description": "Name or brand of grocery item"}
                    },
                    "required": ["item_keyword"]
                }
            }
        }
    ]

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.2,
        messages=messages,
        tools=tools,
        tool_choice="auto"
    )

    choice = response.choices[0].message
    if choice.tool_calls:
        for tool_call in choice.tool_calls:
            args = json.loads(tool_call.function.arguments)
            tool_res = query_inventory(args.get("item_keyword", ""))
            messages.append(choice)
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(tool_res)
            })

        final_response = client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.2,
            messages=messages
        )
        return final_response.choices[0].message.content
    return choice.content

# Example Run
if __name__ == "__main__":
    test_msg = "Bhaiya, do you have Fortune Mustard Oil and Daawat Basmati Rice 5kg? How much total?"
    bot_reply = handle_whatsapp_customer_query("+919876543210", test_msg)
    print("🤖 WhatsApp Bot Response:\\n", bot_reply)`

const JS_CODE = `// Node.js & Express: Real-Time WhatsApp Cloud API Webhook with AI Integration
import express from 'express';
import OpenAI from 'openai';

const app = express();
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Real-time WhatsApp Inbound Webhook
app.post('/webhook/whatsapp', async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0]?.value;
  const message = changes?.messages?.[0];

  if (!message) return res.sendStatus(200);

  const senderNumber = message.from;
  const messageText = message.text?.body || '';

  console.log(\`📩 Inbound WhatsApp from \${senderNumber}: "\${messageText}"\`);

  // Process customer inquiry with AI
  try {
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: \`You are an automated order concierge for a local bakery.
Understand the customer's order, detect dietary constraints (eggless, gluten-free),
and calculate instant order summary with payment link: https://pay.store.com/upi?user=\${senderNumber}\`
        },
        { role: 'user', content: messageText }
      ]
    });

    const replyText = aiResponse.choices[0].message.content;

    // Dispatch reply back to customer via WhatsApp Cloud API
    await sendWhatsAppMessage(senderNumber, replyText);
  } catch (error) {
    console.error('Error handling AI response:', error);
  }

  res.sendStatus(200);
});

async function sendWhatsAppMessage(recipientPhone, textBody) {
  // Call Meta WhatsApp Cloud API endpoint
  console.log(\`🚀 Sent WhatsApp to \${recipientPhone}:\\n\${textBody}\\n\`);
}

// app.listen(3000, () => console.log('WhatsApp AI Webhook running on port 3000'));`

export default function SmallBizPage() {
  const [activeTab, setActiveTab] = useState('shop-day') // 'shop-day' | 'chat-bot' | 'roi-calculator' | 'stack-blueprint'
  const [selectedPresetId, setSelectedPresetId] = useState('retail-grocery')
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedChatId, setSelectedChatId] = useState('stock-check')
  const [costModel, setCostModel] = useState('ai') // 'manual' | 'ai'
  const [dailyOrderCount, setDailyOrderCount] = useState(40)

  const canvasRef = useRef(null)
  const timerRef = useRef(null)

  const activePreset = useMemo(() => {
    return SHOP_PRESETS.find(p => p.id === selectedPresetId) || SHOP_PRESETS[0]
  }, [selectedPresetId])

  const activeStep = activePreset.steps[currentStepIndex] || activePreset.steps[0]

  const activeChat = useMemo(() => {
    return CHAT_SIMULATOR_PRESETS.find(c => c.id === selectedChatId) || CHAT_SIMULATOR_PRESETS[0]
  }, [selectedChatId])

  // Auto-play timeline step runner
  useEffect(() => {
    if (isPlaying) {
      if (currentStepIndex < activePreset.steps.length - 1) {
        timerRef.current = setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1)
        }, 2600)
      } else {
        setIsPlaying(false)
      }
    }
    return () => clearTimeout(timerRef.current)
  }, [isPlaying, currentStepIndex, activePreset.steps.length])

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id)
    setCurrentStepIndex(0)
    setIsPlaying(false)
  }

  // Visual Gauge & Operational Scorecard Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Background Clear
    ctx.fillStyle = '#0a0f1d'
    ctx.fillRect(0, 0, width, height)

    // Left Side: Circular Speedometer / Time-Saved Gauge (44% width)
    const leftWidth = Math.floor(width * 0.44)
    const centerX = leftWidth / 2 + 10
    const centerY = height * 0.52
    const radius = 68

    // Outer subtle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 1
    ctx.strokeRect(10, 10, leftWidth - 10, height - 20)

    // Header on left
    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px monospace'
    ctx.fillText('DAILY TIME-SAVED GAUGE', 20, 26)

    // Gauge Track (Background Arc)
    const startAngle = Math.PI * 0.75
    const endAngle = Math.PI * 2.25
    const totalAngle = endAngle - startAngle

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 12
    ctx.lineCap = 'round'
    ctx.stroke()

    // Gauge Active Progress Arc
    const efficiency = activePreset.efficiencyGain
    const progressAngle = startAngle + totalAngle * (efficiency / 100)
    const gaugeColor = activePreset.accentColor

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, progressAngle)
    ctx.strokeStyle = gaugeColor
    ctx.lineWidth = 12
    ctx.lineCap = 'round'
    ctx.shadowColor = gaugeColor
    ctx.shadowBlur = 10
    ctx.stroke()
    ctx.shadowBlur = 0

    // Score Text in Center of Gauge
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 26px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${activePreset.dailySavingsHours} hrs`, centerX, centerY + 2)

    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px sans-serif'
    ctx.fillText('SAVED PER DAY', centerX, centerY + 20)

    ctx.fillStyle = gaugeColor
    ctx.font = 'bold 10px sans-serif'
    ctx.fillText(`${efficiency}% OPS AUTOMATED`, centerX, centerY + 36)

    // -------------------------------------------------------------------------
    // Right Side: Multi-Metric Scorecard (Accuracy, Speed, Admin Overhead Cut)
    // -------------------------------------------------------------------------
    const rightX = leftWidth + 20
    const rightWidth = width - rightX - 16

    ctx.textAlign = 'left'
    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px sans-serif'
    ctx.fillText('OPERATIONAL EFFICIENCY BENCHMARKS', rightX, 26)

    const metrics = [
      { label: 'Order & Catalog Accuracy', val: activeStep.accuracyScore, color: '#10b981' },
      { label: 'Customer Reply Speed', val: activeStep.speedScore, color: '#38bdf8' },
      { label: 'Admin Work Reduction', val: activeStep.adminScore, color: '#a855f7' },
    ]

    metrics.forEach((m, idx) => {
      const rowY = 56 + idx * 56

      // Label & Value
      ctx.fillStyle = '#e2e8f0'
      ctx.font = '12px sans-serif'
      ctx.fillText(m.label, rightX, rowY)

      ctx.fillStyle = m.color
      ctx.font = 'bold 12px monospace'
      ctx.textAlign = 'right'
      ctx.fillText(`${m.val}%`, rightX + rightWidth, rowY)
      ctx.textAlign = 'left'

      // Bar Background
      const barY = rowY + 8
      const barHeight = 8
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.beginPath()
      ctx.roundRect(rightX, barY, rightWidth, barHeight, 4)
      ctx.fill()

      // Bar Progress Fill
      const fillW = Math.max(8, (rightWidth * m.val) / 100)
      ctx.fillStyle = m.color
      ctx.shadowColor = m.color
      ctx.shadowBlur = 6
      ctx.beginPath()
      ctx.roundRect(rightX, barY, fillW, barHeight, 4)
      ctx.fill()
      ctx.shadowBlur = 0
    })

    // Subtitle note
    ctx.fillStyle = '#64748b'
    ctx.font = '10px sans-serif'
    ctx.fillText(`Active Phase: ${activeStep.stage}`, rightX, height - 16)
  }, [activeStep, activePreset])

  // Calculated ROI estimates based on slider
  const calculatedSavings = useMemo(() => {
    const hoursSavedPerMonth = Math.round((dailyOrderCount * 0.12 * 30))
    const manualLaborCost = Math.round((hoursSavedPerMonth * 12)) // ~$12/hr equivalent value
    const aiApiCost = Math.round((dailyOrderCount * 0.008 * 30 + 15))
    const netMonthlyProfit = manualLaborCost - aiApiCost
    return { hoursSavedPerMonth, manualLaborCost, aiApiCost, netMonthlyProfit }
  }, [dailyOrderCount])

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESC,
    image: 'https://www.uptools.in/assets/og/default.png',
    author: { '@type': 'Organization', name: 'UpTools', url: 'https://www.uptools.in/' },
    publisher: {
      '@type': 'Organization',
      name: 'UpTools',
      logo: { '@type': 'ImageObject', url: 'https://www.uptools.in/assets/logo/uptools-logo.svg' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
  }

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Automate Small Business Daily Operations Using AI',
    step: [
      {
        '@type': 'HowToStep',
        text: 'Morning Supplier Invoice OCR: Use AI vision models to extract line items and prices from photo receipts, auto-calculate profit margins, and generate digital price lists.',
      },
      {
        '@type': 'HowToStep',
        text: 'Noon WhatsApp Customer Concierge: Connect your inventory spreadsheet to a multilingual WhatsApp AI bot to answer stock queries, calculate totals, and issue UPI payment links 24/7.',
      },
      {
        '@type': 'HowToStep',
        text: 'Evening Daily Accounts Reconciliation: Run automated reconciliation scripts that match bank UPI transaction feeds with POS tickets and paper cash slips.',
      },
      {
        '@type': 'HowToStep',
        text: 'Night Targeted Customer Re-engagement: Automatically segment customers based on purchase recency and send personalized discount offers or review request triggers.',
      },
      {
        '@type': 'HowToStep',
        text: 'Set Guardrails & Human Verification: Restrict AI bot price quotes strictly to database lookups and flag refunds or credit exceptions for owner approval.',
      },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <Helmet>
        <title>{TITLE} | UpTools</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content={`${TITLE} | UpTools`} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="UpTools" />
        <meta property="og:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson11-hero.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${TITLE} | UpTools`} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson11-hero.jpg" />
        <meta
          name="keywords"
          content="AI for small business, small business automation, WhatsApp AI bot, retail AI tools, invoice OCR AI, automated bookkeeping, AI marketing for local shops, small business AI workflow"
        />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.uptools.in/' },
              { '@type': 'ListItem', position: 2, name: 'Learning', item: 'https://www.uptools.in/learning/' },
              { '@type': 'ListItem', position: 3, name: 'AI', item: 'https://www.uptools.in/learning/ai/' },
              { '@type': 'ListItem', position: 4, name: 'AI for Small Business', item: URL },
            ],
          })}
        </script>
      </Helmet>

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5 flex-wrap" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <Link to="/learning" className="hover:text-white transition-colors">Learning</Link>
        <span className="text-slate-700">›</span>
        <Link to="/learning/ai" className="hover:text-white transition-colors">AI</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">AI for Small Business</span>
      </nav>

      {/* BADGE & HEADER */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 mb-4">
        <span>🏪</span> AI · Lesson 11 · Beginner
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
        AI for Small Business: Automate Daily Ops, WhatsApp &amp; Marketing
      </h1>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
        Small business owners spend <strong>4 to 6 hours every day</strong> on repetitive operational drudgery: deciphering supplier paper invoices, answering repetitive WhatsApp pricing queries, reconciling daily UPI cash balances, and chasing reviews. Discover how modern AI turns a traditional local store into an agile, <strong>24/7 automated powerhouse</strong> — saving hundreds of hours and unlocking double-digit revenue growth.
      </p>

      <figure className="m-0 mb-6 rounded-xl border border-white/10 overflow-hidden">
        <img src="/assets/learning/ai/ai-lesson11-hero.jpg" alt="Small shop with robot helper handling lists and messages" loading="lazy" />
      </figure>

      {/* LIVE INTERACTIVE ANIMATOR */}
      <section
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6"
        aria-label="Live Small Business AI Operations Simulator"
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-white m-0">▶ Live Demo: Shop Day Automation Simulator &amp; WhatsApp Bot Lab</h2>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Follow a full shop day from morning price lists to evening accounts, or test the live WhatsApp AI concierge.
            </p>
          </div>
          <div className="flex rounded-xl bg-black/40 border border-white/10 p-1 flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('shop-day')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'shop-day' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🏪 Shop Day Workflow
            </button>
            <button
              onClick={() => setActiveTab('chat-bot')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'chat-bot' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              💬 WhatsApp Concierge
            </button>
            <button
              onClick={() => setActiveTab('roi-calculator')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'roi-calculator' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              💰 Cost &amp; ROI Meter
            </button>
            <button
              onClick={() => setActiveTab('stack-blueprint')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'stack-blueprint' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🛠️ AI Stack Blueprint
            </button>
          </div>
        </div>

        {/* TAB 1: SHOP DAY WORKFLOW ANIMATOR */}
        {activeTab === 'shop-day' && (
          <div className="space-y-4">
            {/* BUSINESS PRESET SELECTOR */}
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-2">Select Small Business Industry Preset:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SHOP_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                      selectedPresetId === preset.id
                        ? 'bg-white/10 border-emerald-500/50 shadow-lg'
                        : 'bg-black/30 border-white/5 hover:border-white/20 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{preset.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{preset.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* CANVAS REAL-TIME SCORECARD & TIME-SAVED GAUGE */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0a0f1d]">
              <canvas
                ref={canvasRef}
                width={700}
                height={210}
                className="w-full block"
                style={{ maxHeight: '230px' }}
              />
            </div>

            {/* STEP CONTROLS & TIMELINE */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                    isPlaying ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-black hover:bg-emerald-400'
                  }`}
                >
                  {isPlaying ? '⏸ Pause Day' : '▶ Play Full Day'}
                </button>
                <button
                  onClick={() => {
                    setCurrentStepIndex(0)
                    setIsPlaying(false)
                  }}
                  className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white cursor-pointer"
                >
                  ⏮ Reset
                </button>
              </div>

              <div className="flex items-center gap-1">
                {activePreset.steps.map((step, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => {
                      setCurrentStepIndex(sIdx)
                      setIsPlaying(false)
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
                      currentStepIndex === sIdx
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-black/20 text-slate-400 border-white/5 hover:border-white/15'
                    }`}
                  >
                    {step.time.split('—')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* BEFORE VS AFTER WORKFLOW CARD */}
            <div className="rounded-xl bg-black/40 border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-2.5">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">{activeStep.time}</span>
                  <h3 className="text-sm sm:text-base font-bold text-white m-0 mt-0.5">{activeStep.stage}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ⏱️ Saved: {activeStep.timeSavedMin} mins
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                    {activeStep.badge}
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                {/* Manual Old Way */}
                <div className="rounded-lg bg-red-950/20 border border-red-500/20 p-3">
                  <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider mb-1">
                    ❌ Traditional Manual Drain
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed m-0">
                    {activeStep.manualTask}
                  </p>
                </div>

                {/* AI Automated New Way */}
                <div className="rounded-lg bg-emerald-950/20 border border-emerald-500/30 p-3">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    ⚡ AI Automated Superpower
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed m-0">
                    {activeStep.aiAutomation}
                  </p>
                </div>
              </div>

              {/* Real-time System Log */}
              <div className="rounded-lg bg-black/60 border border-white/10 p-2.5 font-mono text-[11px] text-slate-400 flex items-center gap-2">
                <span className="text-emerald-400 font-bold">● SYSTEM LOG:</span>
                <span className="text-slate-300">{activeStep.logOutput}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WHATSAPP BOT PLAYGROUND */}
        {activeTab === 'chat-bot' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-300 leading-relaxed">
              Test how an AI WhatsApp concierge understands messy customer messages in natural dialects, triggers live database tools, and formats instant payment checkouts:
            </div>

            {/* QUERY SELECTOR */}
            <div className="grid sm:grid-cols-3 gap-2">
              {CHAT_SIMULATOR_PRESETS.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                    selectedChatId === chat.id
                      ? 'bg-white/10 border-emerald-500/50 shadow'
                      : 'bg-black/30 border-white/5 hover:border-white/20 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{chat.intent}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{chat.customerLang}</div>
                </button>
              ))}
            </div>

            {/* LIVE WHATSAPP PHONE UI SIMULATOR */}
            <div className="max-w-2xl mx-auto rounded-2xl border border-white/15 bg-[#0b141a] overflow-hidden shadow-2xl">
              {/* WhatsApp Header */}
              <div className="bg-[#202c33] p-3 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold text-white">
                    🏪
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Sharma Kirana &amp; Daily Store</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                      AI Assistant Active (Latency: {activeChat.latency})
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                  WhatsApp Business API
                </span>
              </div>

              {/* Chat Canvas Area */}
              <div className="p-4 space-y-3 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
                {/* Customer Inbound Message */}
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-[#202c33] p-3 text-xs text-slate-200 border border-white/5 shadow">
                    <div className="text-[10px] font-bold text-emerald-400 mb-1">Customer (WhatsApp)</div>
                    <p className="m-0 leading-relaxed">{activeChat.customer}</p>
                    <div className="text-[9px] text-slate-400 text-right mt-1 font-mono">01:14 PM · Delivered ✓✓</div>
                  </div>
                </div>

                {/* AI Internal Reasoning Tool Call Box */}
                <div className="rounded-xl bg-black/60 border border-emerald-500/20 p-2.5 text-[11px] font-mono text-emerald-300">
                  <div className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    🧠 AI Tool Execution &amp; Database Query:
                  </div>
                  <div className="text-slate-300 leading-relaxed">{activeChat.aiThought}</div>
                </div>

                {/* Bot Outbound Reply */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-[#005c4b] p-3 text-xs text-white border border-emerald-500/20 shadow">
                    <div className="text-[10px] font-bold text-emerald-200 mb-1">Sharma Kirana AI Concierge</div>
                    <p className="m-0 leading-relaxed whitespace-pre-line">{activeChat.botReply}</p>
                    <div className="text-[9px] text-emerald-200/70 text-right mt-1 font-mono">01:14 PM · Read ✓✓</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ROI & TIME-SAVED CALCULATOR */}
        {activeTab === 'roi-calculator' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-300 leading-relaxed">
              Estimate your monthly labor hours saved, customer response speedup, and net operational savings by introducing AI automation:
            </div>

            <div className="rounded-xl bg-black/40 border border-white/10 p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-white">Daily Customer Inquiries &amp; Orders Handled:</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">{dailyOrderCount} conversations / day</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={dailyOrderCount}
                  onChange={(e) => setDailyOrderCount(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>10 (Small Kiosk)</span>
                  <span>100 (Busy High-Street Shop)</span>
                  <span>200+ (High-Volume Retailer)</span>
                </div>
              </div>

              {/* ROI RESULTS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="rounded-xl bg-emerald-950/30 border border-emerald-500/30 p-3 text-center">
                  <div className="text-[11px] text-slate-400">Monthly Time Saved</div>
                  <div className="text-xl font-extrabold text-emerald-300 font-mono mt-0.5">
                    {calculatedSavings.hoursSavedPerMonth} hrs
                  </div>
                  <div className="text-[10px] text-slate-500">~{Math.round(calculatedSavings.hoursSavedPerMonth / 8)} full working days</div>
                </div>

                <div className="rounded-xl bg-red-950/30 border border-red-500/30 p-3 text-center">
                  <div className="text-[11px] text-slate-400">Manual Labor Value</div>
                  <div className="text-xl font-extrabold text-red-300 font-mono mt-0.5">
                    ${calculatedSavings.manualLaborCost}
                  </div>
                  <div className="text-[10px] text-slate-500">₹{Math.round(calculatedSavings.manualLaborCost * 83).toLocaleString()} INR</div>
                </div>

                <div className="rounded-xl bg-blue-950/30 border border-blue-500/30 p-3 text-center">
                  <div className="text-[11px] text-slate-400">AI API Token Cost</div>
                  <div className="text-xl font-extrabold text-blue-300 font-mono mt-0.5">
                    ${calculatedSavings.aiApiCost}
                  </div>
                  <div className="text-[10px] text-slate-500">₹{Math.round(calculatedSavings.aiApiCost * 83).toLocaleString()} INR</div>
                </div>

                <div className="rounded-xl bg-purple-950/30 border border-purple-500/30 p-3 text-center">
                  <div className="text-[11px] text-slate-400">Net Monthly Savings</div>
                  <div className="text-xl font-extrabold text-purple-300 font-mono mt-0.5">
                    ${calculatedSavings.netMonthlyProfit}
                  </div>
                  <div className="text-[10px] text-slate-500">95% Cost Reduction</div>
                </div>
              </div>
            </div>

            {/* TOGGLE COST COMPARISON TABLE */}
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                    <th className="p-3 font-bold">Operational Metric</th>
                    <th className="p-3 font-bold text-red-400">Manual Way</th>
                    <th className="p-3 font-bold text-emerald-400">AI-Automated Way</th>
                    <th className="p-3 font-bold">Business Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-3 font-semibold text-white">Customer Response Time</td>
                    <td className="p-3 text-slate-300">30 – 90 minutes (Missed during rush)</td>
                    <td className="p-3 text-emerald-300 font-mono">&lt; 8 seconds (24/7 instant)</td>
                    <td className="p-3 text-slate-300">Captures impulse buyers before they message a competitor.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Invoice &amp; Bill Entry</td>
                    <td className="p-3 text-slate-300">45 – 90 mins paper typing</td>
                    <td className="p-3 text-emerald-300 font-mono">15 seconds photo OCR</td>
                    <td className="p-3 text-slate-300">Zero data entry errors; auto-updates inventory margins.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Off-Hours Lead Capture</td>
                    <td className="p-3 text-slate-300">0% (Shop closed at night)</td>
                    <td className="p-3 text-emerald-300 font-mono">100% automated booking</td>
                    <td className="p-3 text-slate-300">Takes morning pre-orders and appointments while you sleep.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Daily Reconciliation</td>
                    <td className="p-3 text-slate-300">60 mins counting slips &amp; UPI</td>
                    <td className="p-3 text-emerald-300 font-mono">1-click automated audit</td>
                    <td className="p-3 text-slate-300">Instantly flags missing UPI transfers and credit overdues.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SMALL BIZ AI STACK BLUEPRINT */}
        {activeTab === 'stack-blueprint' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-300 leading-relaxed">
              Recommended practical technology stack for small businesses to launch AI automation quickly:
            </div>
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                    <th className="p-3 font-bold">Automation Tier</th>
                    <th className="p-3 font-bold">Recommended Tools</th>
                    <th className="p-3 font-bold">Setup Time</th>
                    <th className="p-3 font-bold">Typical Business Use Case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-3 font-semibold text-white">1. WhatsApp &amp; Inquiries</td>
                    <td className="p-3 text-emerald-300 font-mono">WATI / AiSensy + OpenAI GPT-4o-mini</td>
                    <td className="p-3 text-slate-300">1 – 2 Days</td>
                    <td className="p-3 text-slate-300">Auto-replying to product queries, price checks, and delivery tracking.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">2. Invoice &amp; Ledger OCR</td>
                    <td className="p-3 text-emerald-300 font-mono">Google Cloud Vision / Claude 3.5 Sonnet</td>
                    <td className="p-3 text-slate-300">2 – 3 Hours</td>
                    <td className="p-3 text-slate-300">Extracting line items and GST tax from photos of supplier bills.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">3. Social Copy &amp; Catalogs</td>
                    <td className="p-3 text-emerald-300 font-mono">Canva AI + ChatGPT Team</td>
                    <td className="p-3 text-slate-300">30 Minutes</td>
                    <td className="p-3 text-slate-300">Generating daily promo flyers, festive discounts, and localized copy.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">4. No-Code Glue &amp; Webhooks</td>
                    <td className="p-3 text-emerald-300 font-mono">Make.com / Zapier / n8n</td>
                    <td className="p-3 text-slate-300">1 Day</td>
                    <td className="p-3 text-slate-300">Connecting WhatsApp orders directly to Google Sheets or POS databases.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">5. Payment Collection</td>
                    <td className="p-3 text-emerald-300 font-mono">Razorpay / Stripe / Dynamic UPI QR</td>
                    <td className="p-3 text-slate-300">1 Hour</td>
                    <td className="p-3 text-slate-300">Generating automated payment links with webhook callback confirmations.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-[11px] text-slate-500 m-0 mt-3">
          💡 <strong>Key Takeaway:</strong> AI for small businesses is not about replacing human warmth — it is about offloading mechanical administrative busywork so the owner can focus on customer relationships and business expansion.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson11-day.jpg" alt="Shop day automated from morning to evening" loading="lazy" />
        </figure>
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson11-sales.jpg" alt="Shopkeeper checking rising sales with robot helper" loading="lazy" />
        </figure>
      </div>
      {/* EXPLANATION / DEEP DIVE */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">The 4 Pillars of Small Business AI Automation</h2>
        <ol className="text-sm text-slate-300 leading-relaxed space-y-2.5 list-decimal pl-5 m-0">
          <li>
            <strong className="text-white">Multilingual Conversational Commerce on WhatsApp:</strong> Over 80% of local commerce inquiries occur on messaging apps. AI bots connect directly to live product sheets to answer stock availability, calculate delivery fees, and process orders in English, Hindi, and local colloquial dialects with sub-second latency.
          </li>
          <li>
            <strong className="text-white">Vision OCR for Supplier Invoices &amp; Paper Receipts:</strong> Manual data entry of wholesale vendor bills is the single largest bottleneck for local shops. Vision language models parse messy paper invoices, auto-calculate 20%+ retail margins, and import structured inventory lines into accounting software.
          </li>
          <li>
            <strong className="text-white">Automated Daily Reconciliation &amp; Cash Flow Auditing:</strong> Matching daily bank UPI notification dumps with POS paper slips used to take 90 minutes every night. AI scripts cross-reference digital transaction IDs, detect discrepancies, and calculate net daily profit in seconds.
          </li>
          <li>
            <strong className="text-white">Predictive Customer Retention &amp; Review Amplification:</strong> Instead of sending spammy bulk broadcasts that get phone numbers blocked, AI segments customers by purchase recency and favorite items. It triggers timely replenishment offers and converts satisfied buyers into 5-star Google Maps reviews.
          </li>
        </ol>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 text-center">
          {[
            ['WhatsApp Bot', '24/7 Inquiries', 'Multilingual instant quotes'],
            ['Vision OCR', 'Invoice Parsing', 'Zero manual ledger entry'],
            ['Reconciliation', 'UPI & Cash Audit', 'Automated profit calculation'],
            ['Retention AI', 'Smart Broadcasts', '3.4x higher conversion'],
          ].map(([a, b, c]) => (
            <div key={a} className="rounded-xl bg-black/30 border border-white/10 px-2 py-3">
              <div className="text-[11px] text-slate-400 font-semibold">{a}</div>
              <div className="text-sm sm:text-base font-extrabold text-white">{b}</div>
              <div className="text-[10px] text-slate-500 leading-snug">{c}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CODE BLOCK */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">Code: Small Business Operations &amp; WhatsApp Bot in Python &amp; JavaScript</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          Automate supplier invoice parsing, inventory lookups, and customer order management programmatically:
        </p>
        <div className="space-y-3">
          <CodeBlock lang="Python (OpenAI / Vision OCR / Function Calling)" code={PY_CODE} />
          <CodeBlock lang="JavaScript (Node.js / Express / WhatsApp Cloud API Webhook)" code={JS_CODE} />
        </div>
      </section>

      {/* PRACTICE QUESTIONS */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-1">Practice questions</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          Key questions on implementing AI workflows, WhatsApp customer bots, and data security in small business operations.
        </p>
        <div className="space-y-2.5">
          {QUESTIONS.map((it, i) => (
            <details key={i} className="rounded-xl bg-black/30 border border-white/10 px-4 py-1 group">
              <summary className="cursor-pointer text-sm font-semibold text-white py-2.5 list-none flex items-center gap-2">
                <span className="text-emerald-400 text-xs font-bold shrink-0">Q{i + 1}</span>
                {it.q}
              </summary>
              <p className="text-xs text-slate-300 pb-3 pl-8 leading-relaxed m-0">{it.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* BUSINESS TIPS */}
      <section
        className="rounded-2xl border border-emerald-500/20 p-5 sm:p-6 mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(17,24,39,0.4))' }}
      >
        <h2 className="text-lg font-bold text-white mt-0 mb-3">🏪 Small Business Automation Tips</h2>
        <ul className="text-sm text-slate-300 leading-relaxed space-y-2 list-disc pl-5 m-0">
          <li>
            <strong className="text-white">Ground AI in a Single Source of Truth:</strong> Never let an AI bot invent product prices or stock availability from memory. Always connect it to a live Google Sheet, Airtable, or POS database via tool calling.
          </li>
          <li>
            <strong className="text-white">Start with FAQ Auto-Replies First:</strong> Before attempting end-to-end checkout automation, start by automating the top 10 most common customer questions (store hours, address/location map, return policy, delivery range).
          </li>
          <li>
            <strong className="text-white">Enforce Human Approval for Exceptions:</strong> Set clear rules where customer requests for custom credit (Udhar), refunds over ₹500, or negative feedback are instantly routed to the owner’s private WhatsApp for personal touch.
          </li>
          <li>
            <strong className="text-white">Personalize Retention Broadcasts:</strong> Segment your customer list by purchase history. Customers who buy dog food every month should receive pet care reminders, not generic baby diaper discounts.
          </li>
          <li>
            <strong className="text-white">Turn Delighted Customers into 5-Star Reviews:</strong> Automatically send a thank-you message with a direct 1-tap Google Maps review link 2 hours after a successful purchase or repair. Positive online reputation dominates local search rankings.
          </li>
        </ul>
      </section>

      {/* FAQ ACCORDION COMPONENT */}
      <FAQ questions={FAQS} />

      {/* PREV / NEXT NAVIGATION */}
      <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
        <Link to="/learning/ai/ai-for-resumes-interviews" className="text-sm font-semibold text-emerald-300 no-underline hover:text-white transition-colors">
          ← Lesson 10: AI for Resumes and Interviews
        </Link>
        <Link to="/learning/ai/ai-costs-and-tokens" className="text-sm font-semibold text-emerald-300 no-underline hover:text-white transition-colors">
          Lesson 12: AI Costs and Tokens →
        </Link>
      </div>
    </>
  )
}
