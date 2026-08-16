#!/usr/bin/env node
// SEO sweep: keyword-rich desc + tags for all finance-category tools in tools.json
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/tools.json', 'utf8'));
let changed = 0;

const M = {
  'income-tax-tool': { desc: 'Compare new vs old income tax regime for FY 2026-27. Calculate tax with 80C, HRA, NPS, home loan deductions, Rs 75,000 standard deduction and 87A rebate. See which regime saves you more.', tags: ['tax','income','fy-2026-27','new-regime','old-regime','80c','hra','nps','deductions','salary','india','finance','itr'] },
  'gst-calculator': { desc: 'GST calculator India: add or remove 5%, 12%, 18%, 28% GST in one click. Compute gross and net amounts with reverse GST for invoices.', tags: ['gst','tax','calculator','india','invoice','18%','reverse-gst','finance'] },
  'emi-calculator': { desc: 'EMI calculator: monthly payment, total interest and amortization for home, car or personal loans. Compare tenures and see the full schedule.', tags: ['emi','loan','home-loan','car-loan','personal-loan','interest','amortization','finance'] },
  'fd-calculator': { desc: 'Fixed deposit calculator India: maturity value, interest earned and monthly payout for cumulative and quarterly FD interest schemes.', tags: ['fd','fixed-deposit','interest','maturity','bank','india','savings','finance'] },
  'sip-calculator': { desc: 'SIP calculator: project mutual fund wealth from monthly investments with expected returns and inflation-adjusted future value.', tags: ['sip','mutual-fund','investment','returns','wealth','india','compounding','finance'] },
  'pnl-calculator': { desc: 'Profit and loss calculator for trading: entry, exit, quantity, brokerage and taxes to see net realised and unrealised gains.', tags: ['pnl','profit-loss','trading','stocks','brokerage','gains','finance'] },
  'currency-converter': { desc: 'Free currency converter with live exchange rates for USD, EUR, INR, GBP and 150+ currencies. Updated hourly.', tags: ['currency','exchange-rate','usd','eur','inr','gbp','converter','finance'] },
  'ai-stock-analyzer': { desc: 'AI stock analyzer: free AI verdict on any stock with technical signals, fundamental scores, news sentiment and a buy-hold-sell plan.', tags: ['ai','stocks','analysis','technical','fundamental','sentiment','trade','finance'] },
  'ai-top10-stocks': { desc: 'AI top 10 stocks daily: AI-scanned picks across NSE, BSE, NASDAQ and NYSE with RSI, moving averages, support-resistance and news tone.', tags: ['ai','stocks','top10','daily','nse','bse','nasdaq','picks','finance'] },
  'crypto-prices': { desc: 'Live cryptocurrency prices: Bitcoin, Ethereum and top coins with 24h change, market cap, volume and historical price charts.', tags: ['crypto','bitcoin','ethereum','prices','btc','eth','market-cap','finance'] },
  'crypto-portfolio': { desc: 'Crypto portfolio tracker: add coins, holdings and buy price to track total value, profit and loss across Bitcoin, Ethereum and altcoins.', tags: ['crypto','portfolio','bitcoin','tracker','holdings','profit','finance'] },
  'crypto-profitability': { desc: 'Crypto profitability calculator: mining and staking returns, investment growth and profit per coin at current market prices.', tags: ['crypto','mining','staking','profitability','bitcoin','returns','finance'] },
  'rrsp-optimizer': { desc: 'RRSP contribution optimizer for Canada: room lookup, tax refund on contributions and TFSA vs RRSP comparison.', tags: ['rrsp','canada','retirement','tax-refund','tfsa','savings','finance'] },
  'tfsa-room-tracker': { desc: 'TFSA room tracker Canada: contribution room, yearly limits, unused room and penalty-free contribution planning.', tags: ['tfsa','canada','contribution-room','savings','tax-free','finance'] },
  'cpp-ei-calculator': { desc: 'CPP and EI calculator Canada: Canada Pension Plan contributions, employment insurance premiums and net pay effects for employees.', tags: ['cpp','ei','canada','pension','employment-insurance','payroll','finance'] },
  'canada-mortgage-affordability': { desc: 'Canada mortgage affordability calculator: what house price you can afford with down payment, income, stress test and property costs.', tags: ['canada','mortgage','affordability','home','down-payment','stress-test','finance'] },
  'vehicle-import-duty-estimator': { desc: 'Vehicle import duty estimator for Canada: RIV fees, GST/HST, duty and compliance costs for importing a car into Canada.', tags: ['vehicle','import','duty','canada','car','riv','gst','finance'] },
  'ai-budget-planner': { desc: 'AI budget planner: split income into needs, wants and savings, plan monthly spending and get a personalised saving plan.', tags: ['ai','budget','planner','savings','expenses','money','finance'] },
  'gst-number-search': { desc: 'GST number search and validator India: verify a GSTIN format, state code and structure of any GST identification number.', tags: ['gst','gstin','validator','india','tax','business','finance'] },
  'percentage-calculator': { desc: 'Percentage calculator: find what percent X is of Y, add or subtract percentages, and percentage change in one click.', tags: ['percentage','math','discount','calculator','marks','finance'] },
  'cagr-calculator': { desc: 'CAGR calculator: compound annual growth rate for investments, SIPs and business metrics from start value, end value and years.', tags: ['cagr','investment','compound','growth-rate','returns','finance'] },
  'markup-margin-calculator': { desc: 'Markup vs margin calculator: convert between markup percentage and profit margin for pricing products and services.', tags: ['markup','margin','pricing','profit','ecommerce','business','finance'] },
  'salary-converter': { desc: 'Salary converter: hourly, daily, weekly, monthly and annual salary conversion with prorated amounts and comparisons.', tags: ['salary','hourly','annual','pay','converter','jobs','finance'] },
  'break-even-calculator': { desc: 'Break-even calculator for business: units and revenue needed to cover fixed and variable costs, with profit margin at any volume.', tags: ['break-even','business','costs','profit','revenue','pricing','finance'] },
  'overtime-calculator': { desc: 'Overtime calculator: pay for extra hours at time-and-a-half, double time and other rates, weekly and monthly totals.', tags: ['overtime','payroll','salary','hours','time-and-a-half','work','finance'] },
  'invoice-calculator': { desc: 'Invoice calculator: totals with tax, discounts, shipping and line items for clean professional invoicing.', tags: ['invoice','freelance','tax','billing','gst','business','finance'] },
  'tip-calculator': { desc: 'Tip calculator: split bills and tips across any number of people with per-person totals and percentage presets.', tags: ['tip','bill','split','restaurant','gratuity','finance'] },
  'sales-tax-calculator': { desc: 'US sales tax calculator: add or remove state and local sales tax, with rates for all 50 states.', tags: ['sales-tax','usa','tax','price','calculator','finance'] },
  'vat-calculator': { desc: 'VAT calculator: add or remove VAT at any rate for UK and Europe, with gross, net and VAT amounts.', tags: ['vat','tax','uk','europe','gross','net','finance'] },
  'mortgage-calculator': { desc: 'Mortgage calculator: monthly payment, total interest, amortization schedule and extra payment impact for your home loan.', tags: ['mortgage','home-loan','emi','interest','amortization','payment','finance'] },
  '401k-calculator': { desc: '401k calculator: project retirement savings with employer match, contribution growth and tax treatment in the USA.', tags: ['401k','retirement','usa','savings','employer-match','finance'] },
  'house-affordability-calculator': { desc: 'House affordability calculator: what home price fits your income, down payment, debts and interest rate, with DTI guidance.', tags: ['house','affordability','home','mortgage','dti','real-estate','finance'] },
  'car-loan-calculator': { desc: 'Car loan calculator: monthly payment, down payment, trade-in value, interest and total cost of auto financing.', tags: ['car-loan','auto','emi','interest','payment','vehicle','finance'] },
  'retirement-calculator': { desc: 'Retirement calculator: how much to save for retirement with inflation, returns and withdrawal planning built in.', tags: ['retirement','savings','planning','inflation','corpus','finance'] },
  'life-insurance-calculator': { desc: 'Life insurance calculator: human life value and coverage needed based on income, expenses, debts and dependents.', tags: ['insurance','life','coverage','term','planning','finance'] },
  'investment-return-calculator': { desc: 'Investment return calculator: total return, CAGR and final value from initial and ongoing investments over any period.', tags: ['investment','returns','cagr','growth','compounding','finance'] },
  'roth-ira-calculator': { desc: 'Roth IRA calculator: tax-free retirement growth, contribution limits and Roth vs traditional comparison for US savers.', tags: ['roth-ira','retirement','usa','tax-free','contributions','finance'] },
  'debt-payoff-calculator': { desc: 'Debt payoff calculator: avalanche and snowball plans with payoff dates, interest saved and monthly payment strategies.', tags: ['debt','payoff','snowball','avalanche','credit-card','finance'] },
  'net-worth-calculator': { desc: 'Net worth calculator: track assets minus liabilities across cash, investments, property and loans to see your true wealth.', tags: ['net-worth','wealth','assets','liabilities','tracker','finance'] },
  'savings-goal-calculator': { desc: 'Savings goal calculator: monthly amount needed to reach any savings target with interest growth and time horizon.', tags: ['savings','goal','target','monthly','planning','finance'] },
  'rent-vs-buy-calculator': { desc: 'Rent vs buy calculator: compare renting versus buying a home with opportunity cost, equity and break-even analysis.', tags: ['rent','buy','housing','mortgage','compare','real-estate','finance'] },
  'refinance-calculator': { desc: 'Refinance calculator: see if refinancing your mortgage saves money with new rate, fees, term and break-even point.', tags: ['refinance','mortgage','rate','savings','break-even','finance'] },
  'property-tax-calculator': { desc: 'Property tax calculator: estimate annual property tax from assessed value and local mill rates for your area.', tags: ['property-tax','tax','real-estate','mill-rate','home','finance'] },
  'stamp-duty-calculator': { desc: 'UK stamp duty calculator: SDLT on residential property with first-time buyer relief, surcharges and band breakdown.', tags: ['stamp-duty','uk','sdlt','property','tax','houses','finance'] },
  'home-equity-calculator': { desc: 'Home equity calculator: how much equity you have in your home and what you can borrow with a HELOC or loan.', tags: ['home-equity','heloc','equity','loan','property','finance'] },
  'multi-currency-converter': { desc: 'Multi-currency converter: live rates for 150+ currencies with a grid view to compare and convert any pair at once.', tags: ['currency','converter','exchange-rates','multi','international','finance'] },
  'roi-calculator': { desc: 'ROI calculator: return on investment with profit, cost, ROI percentage and annualised return for any project or asset.', tags: ['roi','return-on-investment','profit','business','annualised','finance'] },
  'amortization-calculator': { desc: 'Amortization calculator: full loan schedule with principal and interest split per payment and remaining balance.', tags: ['amortization','loan','schedule','principal','interest','finance'] },
  'compound-interest-calculator': { desc: 'Compound interest calculator: growth of savings and investments with compounding frequency, contributions and time.', tags: ['compound','interest','savings','investment','compounding','finance'] },
  'ctc-salary-calculator': { desc: 'CTC to in-hand salary calculator India: take-home pay from CTC with EPF, professional tax, gratuity and income tax deductions.', tags: ['ctc','in-hand','salary','take-home','epf','india','tax','finance'] },
  'epf-calculator': { desc: 'EPF calculator India: provident fund corpus, employee and employer contribution split and interest accrual till retirement.', tags: ['epf','provident-fund','interest','retirement','india','salary','finance'] },
  'gratuity-calculator': { desc: 'Gratuity calculator India: gratuity amount with the 15-days-per-year rule and eligibility after 5 years of service.', tags: ['gratuity','salary','service','payment','india','finance'] },
  'hra-calculator': { desc: 'HRA exemption calculator India: house rent allowance exemption under Rule 2A with metro and non-metro limits.', tags: ['hra','rent','exemption','tax','salary','india','finance'] },
  'ltv-calculator': { desc: 'LTV calculator: loan-to-value ratio for mortgages and margin financing from loan amount and asset value.', tags: ['ltv','loan-to-value','mortgage','ratio','finance'] },
  'nps-calculator': { desc: 'NPS calculator India: National Pension Scheme retirement corpus and monthly pension with employer and own contributions.', tags: ['nps','pension','retirement','india','corpus','tax-savings','finance'] },
  'post-office-rd-calculator': { desc: 'Post office RD calculator India: recurring deposit maturity, monthly deposit growth and interest at current post office rates.', tags: ['rd','recurring-deposit','post-office','india','interest','savings','finance'] },
  'ppf-calculator': { desc: 'PPF calculator India: Public Provident Fund maturity value with tax-free interest, 15-year tenure and extension options.', tags: ['ppf','public-provident-fund','savings','tax-free','india','interest','finance'] },
  'salary-hike-calculator': { desc: 'Salary hike calculator: new salary from hike percentage, absolute increment or comparison between old and new CTC.', tags: ['salary','hike','increment','appraisal','ctc','finance'] },
  'sip-step-up-calculator': { desc: 'SIP step-up calculator India: wealth growth with annual SIP increase, expected returns and inflation-beating goals.', tags: ['sip','step-up','mutual-fund','inflation','wealth','india','finance'] },
  'tds-calculator': { desc: 'TDS calculator India: TDS on salary, rent, interest and professional fees with applicable sections and thresholds.', tags: ['tds','tax-deducted-at-source','salary','rent','interest','india','tax','finance'] },
  'upi-qr-generator': { desc: 'UPI QR code generator: create a scan-and-pay UPI QR from your VPA with amount preset for instant payments.', tags: ['upi','qr-code','payment','vpa','india','finance'] },
  'upi-validator': { desc: 'UPI ID validator: check if a VPA follows the correct UPI format and validate the virtual payment address structure.', tags: ['upi','vpa','validator','payment','india','finance'] },
  'electricity-bill-calculator': { desc: 'Electricity bill calculator India: consumption, tariff slabs, fixed charges and state-wise bill estimation from usage.', tags: ['electricity','bill','energy','consumption','tariff','india','finance'] },
  'loan-comparison-calculator': { desc: 'Loan comparison calculator: compare two loans by EMI, total interest, fees and total cost to pick the cheaper option.', tags: ['loan','compare','emi','interest','fees','finance'] },
};

for (const t of data.tools) {
  const upd = M[t.slug];
  if (!upd) continue;
  if (t.desc !== upd.desc) { t.desc = upd.desc; changed++; }
  if (JSON.stringify(t.tags) !== JSON.stringify(upd.tags)) { t.tags = upd.tags; changed += 0; }
}

fs.writeFileSync('src/data/tools.json', JSON.stringify(data, null, 2) + '\n');
const fin = data.tools.filter(x => (x.cats || []).includes('finance'));
console.log('Updated descs:', changed, '| finance tools now:', fin.length);
// verification: desc lengths
const bad = data.tools.filter(t => t.desc && (t.desc.length < 50 || t.desc.length > 165));
console.log('Desc length issues remaining across ALL tools:', bad.length);