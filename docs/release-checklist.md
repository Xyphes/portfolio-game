# Release checklist

## Automated gate

1. Run `npm run typecheck`.
2. Run `npm run lint`.
3. Run `npm test`.
4. Run `npm run build`.
5. Run `npm run verify:build`.

The build verifier checks the PWA identity, required offline documents, deferred Phaser caches, route-level chunks, the absence of Phaser from classic mode, and a 300 KiB uncompressed budget for the initial application bundle.

## Required manual checks

- Desktop: complete the professional route using only the keyboard in 5–10 minutes.
- Desktop: reach another screen and open a story using only mouse click-to-move; confirm its fragment is granted immediately.
- Desktop: continue through the optional personal route and confirm total session time stays at or below 15 minutes.
- Use the journal restart action, then confirm the next-step guide progresses from training through all three professional zones before suggesting the personal trail.
- Mobile landscape: complete training, move between all five screens, and open a dialogue using touch controls; confirm its fragment is granted immediately.
- Mobile browser chrome: with the address and system bars visible, confirm the complete bottom border and exit remain visible; verify the directional pad stays in the left gutter and the action button in the right gutter without covering the canvas.
- Mobile adventure header: in a short phone landscape, confirm the compact `WS` monogram remains visible immediately to the left of Information.
- Persistent controls: on both fine-pointer desktop and coarse-pointer landscape, confirm the directional pad and A button remain visible, centered in their respective side gutters, and operable by click or touch.
- Fresh run: open one story in each branch and confirm its fragment is granted once, with no beacon sprite, collision, target, cartouche, or second interaction.
- Mobile portrait: confirm that the orientation guidance and immediate classic-mode link remain usable.
- Classic mode at 320 px, tablet, and desktop widths: select every category and confirm only its content replaces the right-hand reader, its hash and breadcrumb update, and both documents, every contact link, the language switch, and adventure mode remain reachable.
- Classic reader: scroll long experience/project categories with wheel, keyboard, and touch while confirming the reader scrollbar remains visually hidden.
- Classic mobile header: confirm the burger sits directly beside FR/EN, the redundant breadcrumb bar is absent, then open the menu, choose a category, dismiss it by backdrop and Escape, verify focus returns to its trigger, and confirm its adventure link works.
- Route containment: at 320×568, 390×844, 1222×575, and 1920×960, confirm the browser document itself never scrolls on landing, classic, adventure, or loading states; only the classic content reader may scroll internally.
- Landing identity: confirm “Portfolio interactif” stays against the upper-left edge and never overlaps the name, while FR/EN remains independently reachable at upper right.
- Screen reader: verify zone announcements, dialogue names/descriptions, focus trapping, Escape dismissal, and focus restoration.
- Reduced motion: verify that DOM transitions, hero walk cycles, training fades, and zone fades are disabled while movement and gameplay information remain usable.
- Desktop viewport: confirm the full adventure frame and information trigger fit without page scrolling at 1280×720, 1366×768, and 1920×1080.
- Short desktop landscape: at 1222×575, confirm the 720×432 game is centered, the former frame-label strip is absent, the header information button is visible, and the semi-transparent map does not hide interactions.
- Spatial layout: verify all six Grove of Rigor markers remain distinct, no content object overlaps a grass collision cluster, and the hero cannot walk through visible obstacles or characters.
- Border collisions: on every screen, push against every bush-lined edge and confirm that only the visible central openings permit a room change; repeat with keyboard, mouse click-to-move, and touch.
- Canvas copy: at the 1×, 2×, and 3× display tiers, confirm that every zone, object, tutorial, and action label is sharp, correctly aligned, and remains localized in FR/EN.
- Player/copy layering: cross object labels and the larger tutorial/fragment panels from all four directions and confirm the complete hero renders above their background and glyphs without flicker.
- Empty action: press Space and E away from all markers and confirm the bilingual proximity hint replaces the former yellow rectangle.
- Production PWA: install once, reload an update, open classic mode and both PDFs offline, then visit adventure online once and retest it offline.
- Install prompt dismissal: close the eligible installation banner with its × control, confirm its accessible FR/EN label, and verify it stays hidden across route changes for the current browser session.
- First-visit offline failure: confirm the adventure shows its retry/classic fallback instead of a blank canvas, then reconnect and retry successfully.
- Audio after the MP3 is supplied: verify explicit playback only, pause, mute, persisted volume, and a harmless missing-file fallback.
- Run a mobile Lighthouse audit and investigate regressions before release; record results rather than weakening budgets to make the audit pass.
- Review every FR/EN text, external link, CV, recommendation letter, and asset license with Willy Somkhit before publishing.

## Deployment inputs still required

- Final Netlify or custom-domain URL for sitemap and fixed social canonical metadata.
- User approval of the current professional and personal content.
- Optional personal photos and music file with confirmed usage rights.
