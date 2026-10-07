# CK Capital — Cinematic Homepage Build

## Run locally

From this folder:

```sh
python -m http.server 8000
```

Open http://localhost:8000/index.html. No install or build step is needed.

## Integration

- `index.html`: redesigned public homepage; existing auth, checkout and dashboard views retained.
- `homepage.css`: scoped homepage composition, devices, responsive layouts and theme treatments.
- `homepage.js`: certificate deck, original-image viewer, swipe/keyboard navigation, event-driven parallax and accessibility states. Reads the existing selector output rather than duplicating pricing logic.
- `app.js`: original application engine; account-size buttons made keyboard accessible, and video playback respects active views and live reduced-motion changes.
- Original routes and remaining application modules are retained.

## Media integrity

All seven certificate posts, all three product/reference images, the Discord image, updated logo and wolf video/poster remain unchanged. The supplied product set contains two mobile dashboard views and one mobile homepage reference; the laptop shows the original dashboard views together, not a fabricated desktop interface. The Discord asset is a server view, not a payment confirmation. Device frames and floating labels are presentation elements.

`assets/design/market-sculpture.webp` is generated decorative artwork, not trading data or financial evidence. The stated payout total is explicitly attributed to CK Capital and not independently verified.

## Prototype boundary

Existing authentication, accounts and checkout retain their original local frontend-prototype behavior. This work does not add a live payment processor, backend authentication or real-money account management.

## QA

Responsive browser checks cover 320, 375, 390, 430, 768, 1024, 1440 and 1920 pixels. Route/view regression, all 18 existing pricing tiers, checkout navigation, galleries, swipe events, FAQ state, theme persistence/system preference and reduced-motion video behavior were checked. Original application view markup and media files were compared with the pre-edit project.

## Motion & cards completion pass

The approved homepage composition is retained. Added TradeLocker/MT5 choice cards, an offer card using the existing CONSISTENCY 15% code, and a swipeable feature-card rail. Platform actions delegate to the original selector; coupon copy reports an honest manual fallback if clipboard access is blocked.

Added masked headline entrances, staggered card/section reveals, device-frame light sweeps, modest scroll perspective, price-change feedback and a viewport-aware certificate slideshow. The slideshow has a pause/play control and stops for reduced motion, hidden tabs, inactive views, viewer opening and interaction. Manual certificate navigation remains available.

Fixed reveal clipping around display-font descenders, card/caption spacing, unsupported decorative icon glyphs, feature-control state after view switching and observer handling on back/forward-cache restoration. Motion, mobile widths, original routes, all existing pricing tiers and source-media integrity were rechecked.

## V9 payout motion and cleanup

The approved homepage composition remains, but the payout gallery's earlier interval/fade behavior is superseded by a continuously animated curved procession. Photos glide from the lower right through a raised center and toward the lower left; tapping opens a full-screen original, pausing and then resuming the same timeline. The footer Appearance row was removed. Branding now uses alpha-transparent PNG/WebP derivatives of the supplied original logo. Source payout posts, original logo JPEG, product screenshots and homepage wolf assets remain unchanged.
