# Personalised CK-inspired certificate demos

This update changes the dashboard's certificate gallery and viewer only. The existing public payout posts remain original source photos; those photos are not personalised or altered.

## Designs

- Phase 1 and Phase 2: black paper, gold borders/brand texture, white typography and a centred profile name, following the supplied phase-certificate reference.
- Reward: violet-and-gold layout using a decorative wolf crop from the supplied reward reference. The crop excludes the original recipient, amount, QR code, payout badge and signature.
- Every gallery tile, viewer and print/PDF contains conspicuous **Demo / Design preview** or **Not valid for verification** wording. No real signature, issuer authentication or verification QR is reproduced.

## Personalisation

Save a name in dashboard Settings → Profile details. The certificate uses that saved display name, preserving normal capitalisation, accents and single-word names. Names persist through reloads; an already-open certificate also refreshes when the profile is saved.

The selected account supplies account reference, size, platform, preference and current phase. These are labelled account-preview fields, not completed-phase claims. A Phase 2 layout may be previewed with a Phase 1 account; it does not claim that the account passed Phase 2.

The reward amount is the first simulated payout ledger's trader amount. It is explicitly labelled a demo ledger sample and is not associated with the selected account or evidence of a payment. The date is the browser's current **preview date**, not an issuance date. Identifiers are prefixed `DEMO-`.

## Print/export

The existing print action now prints just the open demo design, not the dashboard underneath. Both templates fit on one A4 landscape page in the tested cases, with the demo banner, watermark and disclaimer retained. Save as PDF from the browser's print interface. The exported sample is not a valid credential, payout confirmation or funding award.

## Implementation

- `certificates.css`: gallery previews, phase/reward layouts, responsive handling and dedicated demo print styles.
- `certificates-ui.js`: focus trapping, Escape-close and scroll/focus restoration.
- `app.js`: demo definitions and personalisation from the existing user/account state. Text is assigned using `textContent`; a user-entered name is not interpreted as HTML.
- `assets/design/certificates/`: decorative border, gold-wordmark and wolf crops from the user-supplied references. Complete reference certificates containing genuine recipient names, signatures and QR codes are not embedded in the frontend.

## Rights and authenticity

These are decorative, non-issued demo layouts, not an official CK Capital certificate system. Demo labelling does not grant rights to third-party trademarks or artwork. Check that you have appropriate permission before publishing or commercially using CK branding/assets. This is not a legal opinion or a claim of affiliation/authorisation.

A real issued-certificate system would need authorised templates and backend checks for identity, milestone completion, payment records and verification. None is added here; the existing application remains a local frontend prototype.
