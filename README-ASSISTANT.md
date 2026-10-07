# CK Assistant and branded controls

## What this update adds
- Circular original CK logo launcher, bottom-right of the trader dashboard; above the mobile navigation dock. Hidden on all public/auth/checkout pages and whenever there is no logged-in prototype session.
- Responsive, keyboard-accessible chat panel with close, Escape, focus trapping, chat clearing, suggested questions, context labels, short response preparation state and panel-navigation shortcuts. Chat text is inserted with `textContent`, never interpreted as HTML.
- Local account summaries, loss-limit calculations, challenge-target progress, trade summaries, win rate, profit factor, best/lowest results, symbol/trade-ID/date filters, payout explanations, profile/certificate help and off-topic redirection.
- Explicit account-ID questions can reference another saved account. Otherwise calculations use the selected account. Old messages retain their original account labels.
- CK-branded native HTML dialog for sign-out and simulated checkout confirmation. No JavaScript `alert`, `confirm` or `prompt` is used.
- Custom country/account-size/payout-method dropdowns, in addition to the existing custom dashboard filters and account picker.

## Deliberate prototype limits
This is a deterministic, browser-local assistant, not a generative AI model, a live market feed or a real support service. Its UI says “Local demo · Not live AI”. It requires no API key and sends no messages or account data to external servers.

Asking to chat with an agent saves one local demo support ticket marked `DEMO // AWAITING CONNECTION`. It tells the trader that nobody has been notified and does not promise a reply, a queue position or a waiting time. Repeated requests reuse an existing pending demo ticket.

The dashboard is a localStorage prototype, not production authentication. Do not use real passwords, payment details or sensitive information. The assistant has a guarded context interface exposing a copy of non-credential workspace data, not sign-in values. Signing out hides chat and clears the in-memory conversation. Saved local demo tickets remain in the existing support list.

Risk calculations match the existing dashboard: default CK-10000 daily usage is $54.80; other daily usage is unknown unless recorded. Maximum loss usage = starting balance minus the lower of balance/equity, floored at zero. No historical-breach certification is inferred. Target progress uses balance growth, not closed-trade P&L. The saved payout ledger has no account linkage, so it is never attributed to an individual account. Payout eligibility is not confirmed.

Full policies for weekend holding, automation, leverage and other unrecorded rules are not invented. The homepage’s news-trading feature is described with a reminder to verify current challenge terms. The assistant does not give buy/sell signals, execute trades, predict returns or mark an account as passed.

The pre-existing Trading insights panel contains illustrative scores/badges, not computed AI analysis; its header now identifies demo insights and directs users to CK Assistant for grounded calculations.

## Production integration later
To add real AI/support, implement a server-side authenticated endpoint, account-level authorization, approved rule retrieval, privacy/retention controls and a real support queue. Keep model API keys on the server, not in this JavaScript. Only claim that an agent was notified once a real backend confirms delivery. Native form validation, browser password-manager UI and operating-system prompts are browser-owned and are not themed by this update.

## Files
`assistant.js`, `assistant.css`, `ck-dialogs.js`; small additions to `app.js` and `index.html`. Original certificates, animated seven-photo payout gallery and assets are preserved.
