# CK Capital — Trader Workspace Redesign

The logged-in dashboard has been rebuilt. The approved public homepage composition is retained. The V8 update changes its mobile payout-gallery transitions and replaces recreated brand marks with the supplied logo. Authentication and checkout behavior are preserved.

## Open the build

From this folder:

```sh
python -m http.server 8000
```

Open `http://localhost:8000/dashboard.html` (or `index.html#dashboard`). Existing public and standalone routes still work. This is a static HTML/CSS/JavaScript application; no installation or build step is required.

## What changed

- A product-specific graphite workspace, with a corresponding technical light theme.
- Grouped sidebar navigation, collapsible desktop rail, command search, focus mode, persistent account selection, notifications and profile access.
- Connected equity/balance/floating-P&L presentation instead of equal-weight KPI boxes.
- Active challenge milestone ring and phase track, driven by the selected account.
- Custom SVG journal-performance chart with period controls, keyboard/touch point inspection, axes, dated labels and truthful empty states.
- Risk buffers with active-account limits and explicit demo-data boundaries.
- Recent trades with direct inspection and a searchable journal that becomes readable trade cards on mobile, without sideways scrolling.
- A floating mobile dock with 16px side/bottom spacing, safe-area offsets and reserved end-of-content space. More opens a focus-trapped sheet. There is no mobile hamburger or duplicate drawer: every panel is available through the bottom dock and More sheet, including search, website return and sign-out.
- Original CK media used in a visual editorial panel, not competitor imagery.
- Pane transitions, chart drawing, ring transitions, account-number change feedback and restrained interactive states. OS reduced motion and the existing in-app animation preference are respected.

## Reference synthesis

Both supplied recordings were studied through sampled sequences covering their complete flows.

Reference A informed the clear financial hierarchy, account-first presentation, grouped navigation, appearance controls and readable utility menus. Reference B informed the media-led storytelling, connected account presentation and compact secondary-navigation sheet.

The implementation combines these patterns in an original CK composition. It does not copy their branding, promotional text, proprietary imagery or exact card layouts. The requested floating dock improves on the edge-attached navigation in both recordings.

## Code organization

- `index.html`: rebuilt dashboard shell, overview and mobile navigation; retained secondary-panel hooks and application routes.
- `dashboard.css`: scoped product shell, components, themes and responsive behavior.
- `dashboard-ui.js`: presentation/navigation controller, More-sheet focus management and accessible navigation states. Delegates business actions to existing handlers; does not introduce a second state store.
- `app.js`: original local state engine plus selected-account overview rendering and journal-derived chart data. Preserves pricing, checkout, authentication and existing account interactions.
- `styles.css`: shared styles and retained secondary-panel components. 284 legacy dashboard-shell selector branches were retired rather than leaving the previous shell running underneath the new design.
- `homepage.css` and `homepage.js`: approved homepage layout retained; payout images are decoded before selection, rapid-input requests are serialized, wrapping desktop cards teleport behind the deck, and mobile uses a stable two-layer fade instead of rotating overlapping cards.

## Data and security boundary

This remains the existing frontend prototype, with localStorage-based session/account data. It does not add backend authentication, broker connectivity, live market data, a payment processor or real-money payouts. Existing security toggles are prototype preferences, not backend-enforced controls.

The performance chart uses cumulative closed-trade journal P&L, not fabricated live equity samples. Date filters are relative to the latest recorded trade, explicitly identified in the chart note. Journal totals need not match account-balance snapshots.

Daily-loss usage is the existing supplied demo snapshot for CK-10000 (or an account's `dailyLossUsed` value if present). Other accounts show unavailable daily data instead of reusing another account's number. Maximum usage is computed relative to starting equity and current balance/equity, not a complete historical breach audit. Decorative CK artwork is not financial evidence.

## Validation

Automated browser coverage includes 320, 375, 390, 430, 650, 768, 900, 1024, 1440 and 1920px layouts in dark/light themes; all dashboard panels; dock positioning and viewport persistence; trade filtering/inspection; More-sheet keyboard focus; account switching; funded-account states; chart period values; notifications; theme persistence; new-challenge navigation; sidebar collapse; focus mode; and the existing route/login/checkout regression suite.

The original seven payout images are unchanged. The source-logo crop only removes surrounding black padding; it does not redraw or recolor the logo. See `qa/` for test reports, including the latest V8 account-picker, bottom-navigation, dropdown and gallery coverage.

## V8 usability and brand update

- Removed the duplicate dashboard hamburger and retired the mobile sidebar drawer.
- Built a CK-native account picker (desktop popover/mobile sheet) with capital, balance, platform, phase and selected state; original account engine and hidden select remain the source of truth.
- Replaced journal/support native dropdown UIs with keyboard-accessible CK menus, preserving existing form values and handlers.
- Added search, back-to-website and sign-out to More.
- Refined the mobile account hierarchy and compact milestone layout.
- Replaced the reconstructed SVG/CSS marks with the supplied original logo in the dashboard, auth, homepage decorative composition, source-logo placements and favicon. Wordmarks and account IDs remain text, not replacement logos. Supplied screenshots/certificates are not edited.
- Eager-load/decode all seven payout originals, reject stale selection requests, preserve the outgoing image during mobile fades and visually hide screen-reader announcements. These address the observed transition/compositing risk; remote desktop Chromium tests do not substitute for testing every physical Android/iPhone model.

## V9 requested payout motion and cleanup

The payout gallery now runs continuously on one synchronized 35-second timeline, with seven decoded originals gliding along an arcing right-to-left path: enter low on the right, rise through the center, then descend low on the left. Cards are spaced to stay legible and do not animate stacking order. Off-stage loop resets are clipped; no interval swapping or manual sliding is required.

Every photo opens the original in a full-viewport viewer on the first tap. All motion pauses at the exact current position while the viewer is open, then resumes on close. Motion also pauses when the section is offscreen, the tab is hidden or the public view is inactive. A pause/play control and a static reduced-motion fallback remain available. Arrows/dots are optional navigation aids, not a prerequisite for movement.

Removed the homepage footer Appearance controls and the dashboard More menu's Back to website entry. Sign out and dashboard theme controls remain functional.

The supplied purple logo now has an alpha-transparent PNG/WebP derivative. The near-neutral black JPEG matte was removed and partially transparent edges unmatted; the source JPEG, the earlier crop and all seven payout files remain unchanged. The new assets are `assets/real/brand/ck-capital-logo-transparent.png` and `.webp`; the favicon also uses alpha transparency.

V9 validation covers automatic movement, the rise/fall trajectory, one-tap full-screen viewing, exact pause/resume, all seven photos, responsive bounds from 320–1920px, reduced motion, the requested removals, transparent logo backgrounds, account switching, all dashboard panels in light/dark themes, and existing application routes. Current results are in `qa/summary.json`. Browser tests use Chromium mobile/touch emulation, not physical phones.
