# Public navigation and sign-in polish

- Removed the homepage “Explore” shortcut that entered the dashboard directly. Also removed the public command-palette demo dashboard entry.
- Renamed the former terminology consistently throughout HTML, JavaScript, CSS and documentation. Internal dashboard layout classes/IDs now use `workspace-` (e.g. `workspace-sidebar`); all references were updated together.
- Trader Login replaces the old login title. Copy now refers to the trader dashboard, with “Sign in” and “Keep me signed in” controls.
- Fresh visitors start signed out. Dashboard view requests—including a direct dashboard.html URL—go to the local sign-in form if the prototype session is signed out. Existing saved signed-in demo sessions remain usable. Email sign-in and registration retain their original local prototype behavior.
- This is UI gating, NOT production authentication or server-side security. Demo email/password inputs do not validate against a real identity service. Secure public deployment requires backend authentication, authorization and real credential verification.
- New public mobile menu: six illustrated navigation cards, search row, boxed purple Trader login button, create-account shortcut, community link, dark CK palette, backdrop, Escape/outside-click dismissal, focus trap, closed-menu inert state, and scrollable small-screen layout. Desktop login is also boxed and coloured.
- Social options are now “Continue with Google” (multicolour G icon) and “Continue with Discord” (blurple Discord icon). They are visual previews only, as requested. Clicking shows a CK-branded explanation and never signs the visitor in, redirects to a provider or contacts OAuth. Both options use a visible “not connected” note.
- Existing seven payout source images, curved autoplay gallery, dashboard assistant and personalised demo certificates are retained.

Implementation: `public-polish.css`, `public-polish.js`, plus coordinated markup/state/UI-copy edits to the existing files. No dependencies added.
