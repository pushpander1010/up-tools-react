# Low-Value Tools — Needs Improvement

Audit date: 2026-07-29
Total tools: 370 | Low-value identified: ~55-60

---

## 1. STATIC GUIDE PAGES ✅ DONE (2026-07-29)
All 9 static guide pages replaced with interactive tools or removed:

| Old Tool | Replaced With | Status |
|----------|--------------|--------|
| whatsapp_web_guide | REMOVED (whatsapp_link_generator already exists) | ✅ |
| whatsapp_tricks | whatsapp_font_formatter.jsx (new) | ✅ |
| whatsapp_backup_guide | chat_export_analyzer.jsx (new) | ✅ |
| snapchat_filters_guide | story_template_generator.jsx (new) | ✅ |
| cbse_result_guide | cbse_marks_calculator.jsx (new) | ✅ |
| how_to_calculate_gpa | REMOVED (gpa_calculator + cgpa_calculator exist) | ✅ |
| exams_after_12 | career_aptitude_quiz.jsx (new, merged with career_after_12) | ✅ |
| career_after_12 | career_aptitude_quiz.jsx (new, merged with exams_after_12) | ✅ |
| privacy_policy | REMOVED (footer link only) | ✅ |

Tools.json: 370 → 366 tools | Build: ✅ passes

| File | Lines | Issue |
|------|-------|-------|
| whatsapp_web_guide | 91 | Just steps to open WhatsApp Web, no tool |
| whatsapp_tricks | 87 | Static list of tips, zero interactivity |
| whatsapp_backup_guide | 115 | Backup instructions, not a tool |
| snapchat_filters_guide | 182 | Tutorial page |
| cbse_result_guide | 86 | FAQ page |
| privacy_policy | 116 | Legal page, not a tool |
| exams_after_12 | 117 | Informational list |
| career_after_12 | 126 | Informational list |
| how_to_calculate_gpa | 103 | Tutorial, not a calculator |

---

## 2. SOCIAL MEDIA GIMMICK TOOLS (fake data, random generators, no real API)

### WhatsApp fakes
| File | Lines | Issue |
|------|-------|-------|
| whatsapp_dp_downloader | 192 | Can't actually download DPs — no API |
| whatsapp_dp_by_number | 139 | Fake — can't access private data |
| whatsapp_profile_picture_downloader | 116 | No API access, fake |
| whatsapp_group_invite_link | 146 | Trivial URL builder |
| whatsapp_link_generator | 216 | Just wraps text in wa.me links |
| whatsapp_emoji_translator | 108 | Random emoji mapping |
| whatsapp_font_generator | 100 | Just Unicode font tricks |
| whatsapp_business_name_generator | 169 | Random name picker |
| whatsapp_group_name_generator | 151 | Random name picker |
| whatsapp_message_scheduler | 144 | Can't actually schedule messages |

### Instagram fakes
| File | Lines | Issue |
|------|-------|-------|
| instagram_dp_downloader | 124 | Fake — no IG API |
| instagram_profile_picture_downloader | 127 | Same |
| instagram_username_generator | 242 | Random name picker |

### Snapchat fakes
| File | Lines | Issue |
|------|-------|-------|
| snapchat_username_generator | 156 | Random name picker |
| snapchat_score_calculator | 133 | Fake — can't access scores |
| snapchat_streak_calculator | 121 | Trivial date math |

### TikTok fakes
| File | Lines | Issue |
|------|-------|-------|
| tiktok_hashtag_generator | 136 | Random hashtag list |

---

## 3. EVENT/TEMPORARY CONTENT (stale after event ends)

### FIFA World Cup 2026 (16 tools)
| File | Lines | Issue |
|------|-------|-------|
| fifa_world_cup_trophy_counter | 183 | Static historical data |
| fifa_world_cup_fair_play | 74 | Minimal, mostly text |
| fifa_world_cup_discipline | 196 | Hardcoded card data |
| fifa_world_cup_red_cards | 92 | Static list |
| fifa_world_cup_venues | 179 | Static venue list |
| fifa_world_cup_schedule | 146 | Static schedule |
| fifa_world_cup_bracket | 167 | Static bracket |
| fifa_world_cup_countdown | 105 | Countdown to past/future event |
| fifa_world_cup_golden_boot | 118 | Static stats |
| fifa_world_cup_groups | 127 | Static group data |
| fifa_world_cup_match_simulator | 213 | Random result generator |
| fifa_world_cup_predictions | 170 | Opinion-based |
| fifa_world_cup_team_compare | 208 | Static comparison |
| fifa_world_cup_timezone | 229 | Timezone lookup |
| fifa_world_cup_travel_planner | 388 | Heavy, static |
| fifa_world_cup_fantasy_team | 233 | Static data |
| world_cup_2026_results | 104 | Static results |

### Entertainment (4 tools)
| File | Lines | Issue |
|------|-------|-------|
| marvel_doomsday | 103 | Static movie info |
| met_gala_2026 | 105 | Event-specific, expires |
| avengers_doomsday_cast | 91 | Static cast list |
| marvel_movie_timeline | 198 | Static timeline |

---

## 4. DUPLICATE TOOLS (consolidate into one)

### Word/Text counters (5 → 1)
- word_counter (72L)
- word_counter_plus (81L)
- character_counter (90L)
- word_frequency_counter
- text_statistics

### Age calculators (3 → 1)
- age_calculator (81L)
- age_calculator_pro (81L)
- age_calculator_by_date

### Password generators (3 → 1)
- password_generator
- random_password_generator
- password_generator_pro

### QR generators (2 → 1)
- qr_generator
- qr_code_generator_pro

### JSON formatters (3 → 1)
- json_formatter
- json_formatter_pro
- json_formatter_online

### Percentage calculators (2 → 1)
- percentage_calculator
- percentage_calculator_pro

### Unit converters (2 → 1)
- unit_converter
- unit_converter_pro

### UUID generators (2 → 1)
- uuid_generator
- uuid_generator_pro

### Tip calculators (2 → 1)
- tip_calculator
- tip_calculator_pro

### Color tools (4 → 1)
- color_picker
- color_tool
- color_palette_generator
- color_palette_generator_pro

### Instagram downloaders (7 → 1-2)
- instagram_post_downloader
- instagram_reels_downloader
- instagram_video_downloader
- instagram_story_downloader
- instagram_igtv_downloader
- instagram_highlight_downloader
- instagram_carousel_downloader

### YouTube downloaders (3 → 1)
- youtube_video_downloader
- youtube_shorts_downloader
- youtube_audio_downloader

### TikTok downloaders (2 → 1)
- tiktok_video_downloader
- tiktok_audio_downloader

### Drug/medicine info (2 → 1)
- drug_information_tool
- medicine_info

### Facebook downloaders (2 → 1)
- facebook_video_downloader
- facebook_video_downloader_hd

### Dice rollers (2 → 1)
- dice_roller (tool)
- games_dice_roller (game)

### Regex tools (2 → 1)
- regex_tester
- regex_visualizer

---

## 5. ORPHAN FILES (not in tools.json, not accessible)

These 15 tool files exist but have no entry in tools.json:

| File | Issue |
|------|-------|
| json_formatter_online | Duplicate, not listed |
| number-base-converter | Not listed |
| password-generator-pro | Duplicate, not listed |
| percentage-calculator-pro | Duplicate, not listed |
| qr-code-generator-pro | Duplicate, not listed |
| text-diff-checker | Not listed |
| tip-calculator-pro | Duplicate, not listed |
| tool-401k-calculator | Naming mismatch |
| unit-converter-pro | Duplicate, not listed |
| uuid-generator-pro | Duplicate, not listed |
| word-counter-enhanced | Duplicate, not listed |
| dice-roller | Duplicate of games version |

---

## 6. NICHE CANADA TOOLS (very narrow audience, 9 tools)

| File | Lines | Issue |
|------|-------|-------|
| canada_crs_tool | — | CRS calculator |
| canada_hst_tool | — | GST/HST |
| rrsp_optimizer | — | RRSP |
| tfsa_room_tracker | — | TFSA |
| cpp_ei_calculator | — | CPP/EI |
| canada_tax_bracket_calculator | — | Tax brackets |
| canada_mortgage_affordability | — | Mortgage |
| cra_refund_estimator | — | CRA refund |
| cra_noa_checklist | — | CRA checklist |
| sin_validator | — | SIN format |

---

## RECOMMENDED ACTIONS

1. **Remove 21 event tools** (FIFA + entertainment) — time-bound, will stale
2. **Remove 17 social media gimmick tools** — fake data, no real API
3. **Remove 9 static guide pages** — not tools, should be blog posts or FAQ
4. **Consolidate 15+ duplicate sets** into single better tools
5. **Delete 15 orphan files** or add them to tools.json if they have value
6. **Audit 9 Canada tools** — consider if they justify the maintenance cost
7. **Fix 37 orphan files** — either list them or delete them

Estimated cleanup: ~55-60 tools removed/consolidated → site goes from 370 to ~310 higher-quality tools.
