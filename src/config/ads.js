/**
 * Single source of truth for AdSense placements.
 *
 * Publisher: ca-pub-6216304334889617
 *
 * Why this file exists: ad slot IDs were previously hard-coded across App.jsx,
 * GameAdSlot.jsx, InterstitialAd.jsx and 37 game pages, so changing a placement
 * meant hunting through the tree.
 *
 * TODO (needs the account owner): `toolInContent` and `toolBelowContent` currently
 * reuse the existing games banner unit `8865234201` so that ads actually serve on
 * the ~400 tool pages that had none. Create two dedicated responsive display units
 * in AdSense and paste their IDs here — reusing one unit works, but it collapses
 * all tool-page revenue into a single line in reporting, so you can't tell which
 * position earns.
 */
export const AD_SLOTS = {
  // Desktop-only 160x600 rails rendered by SidebarLayout in App.jsx.
  railLeft: '3494503358',
  railRight: '3414612309',

  // Responsive banner. Historically games-only.
  banner: '8865234201',

  // Interstitial shown between games.
  interstitial: '4031056959',

  // In-content units on tool pages, injected by ToolLayout.
  // Directly after the tool's result, and again after the FAQ.
  toolInContent: '8865234201',
  toolBelowContent: '8865234201',
}

export default AD_SLOTS
