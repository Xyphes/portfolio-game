# Architecture du portfolio-jeu

## Goal

Prove that the classic React experience and the Phaser adventure can coexist while consuming one validated bilingual content source.

## Boundaries

- `src/content`: canonical portfolio entities and build-time validation.
- `src/domain`: versioned progression rules with no browser or framework dependency.
- `src/features`: React routes and accessible user interfaces.
- `src/game`: Phaser adapter, dynamically imported by the adventure route.
- `src/infrastructure`: browser persistence implementations.
- `src/shared`: cross-feature presentation state such as language.

React creates a bridge for each adventure session. Phaser publishes spatial interaction events through that bridge. React renders dialogue in the DOM and commits progression through the domain repository. Phaser never owns canonical progress.

## Route contract

- `/`: equal choice between adventure and classic modes.
- `/:locale/classic`: directly readable classic portfolio.
- `/:locale/adventure`: lazy-loaded Phaser prototype and accessible overlay.

Supported locales are `fr` and `en`. Invalid routes return to the landing page.

## Visual contract

Both modes share an original forest-adventure palette: deep evergreen surfaces, leaf-green interactions, moss secondary accents, and warm gold for rewards. The classic mode keeps restrained typography and spacing while the adventure mode uses the same tokens with pixel-art presentation. This direction may evoke retro exploration, but must not reproduce Nintendo palettes, assets, maps, logos, or interface layouts.

## Jalon 1 acceptance

- The same Thales entity is shown in classic mode and supplied to the in-game interaction.
- Phaser is absent from the landing/classic static import graph.
- The adventure can mount, unmount, and remount without duplicate canvases or listeners.
- The proof fragment survives a mode switch and page reload.
- Invalid saved progress falls back to a clean versioned state.
- Direct FR/EN routes, typecheck, lint, unit tests, and production build pass.

## Jalon 2 world model

The adventure map is a validated five-screen graph stored in `src/content/adventure.data.ts`. The central training clearing connects to professional experience, studies, projects, and optional personal branches. Every published interaction references approved canonical content; an absent future entity remains unpublished rather than being replaced by invented text.

The one-action training encounter unlocks exploration. React persists its completion and the last visited screen in progress version 2, while a migration retains fragments from version 1 saves. Phaser renders movement, collisions, action feedback, and fixed-screen transitions, then emits typed events through the bridge. It never writes browser storage directly.

## Jalon 3 shared professional content

The canonical portfolio now validates experiences, education, academic projects, interests, technical skills, languages, and human skills. Each adventure screen stores typed content references rather than prose. Phaser renders spatial objects and emits the selected reference; React resolves it into a localized content detail and owns the accessible dialogue.

The three professional branches and the optional personal branch each grant one fragment on the first interaction. Fragment IDs are persisted by the existing versioned progression repository. Discovering every item is not required to reach another screen or to access classic mode, documents, and contact details.

The classic route renders the complete canonical content as crawlable HTML. The adventure remains deliberately selective and spatial, but every approved entity is reachable from one of its four branches.

## Jalon 4 audio and deployment foundation

Audio remains a React-owned global concern and never enters Phaser state. `src/config/audio.ts` is the single activation point: `backgroundMusicPath` stays `null` until the user supplies the MP3, so the application creates no audio element and makes no missing-file request. Once a path is configured, the accessible controls provide user-initiated play/pause, mute, and volume. Playback never starts automatically.

Volume and mute are stored as versioned preferences through `src/domain/audioPreferences.ts` and `src/infrastructure/audioPreferencesRepository.ts`. Corrupt or unavailable browser storage falls back to a safe 35% volume without affecting navigation. The playing state is deliberately session-only.

`netlify.toml` defines the production build, SPA fallback for direct localized routes, immutable caching for fingerprinted assets, and baseline security headers. The generated service worker precaches the application shell and documents; Phaser and adventure artwork use dedicated cache-first runtime caches so classic-mode visitors do not download the game engine.

To activate the future music file:

1. copy it under `public/assets/audio/`;
2. record its provenance and usage rights in `docs/asset-licenses.md`;
3. set `backgroundMusicPath` to its public path;
4. rerun the audio, build, offline, and mobile checks.

## Jalon 5 discovery tracking

Progress version 3 adds `discoveredContentKeys`, using the stable `kind:id` form produced by `getContentReferenceKey`. Version 1 and version 2 saves migrate without losing fragments, tutorial completion, visit count, or the last valid screen.

React records a discovery when Phaser emits a typed content interaction. The same atomic progress update immediately grants that content’s zone fragment. The quest panel reports discoveries for the current zone, while Phaser lowers the opacity of already-read objects.

This separation supports a short main path: one interaction per professional branch is enough to collect the three professional fragments, while recruiters who want detail can inspect every character or object. Personal content remains optional.

## Jalon 6 completion loop

At this milestone, the domain declared the adventure complete only when every ID in `ADVENTURE_FRAGMENT_IDS` was present. Jalon 7 supersedes this single ending with separate professional and optional-personal outcomes.

React opens the completion dialogue only on the transition from an incomplete to a complete journey. A completed save therefore remains quiet after reload. The dialogue pauses Phaser input and offers three non-blocking outcomes: open the complete classic portfolio, download the canonical CV, or continue exploring. Classic mode remains available from the permanent header before, during, and after the adventure.

The quest panel keeps a compact `4 / 4` completion marker after the dialogue is dismissed. No new graphic or audio asset is introduced by this milestone.

## Jalon 7 professional conclusion and optional epilogue

The domain now exposes two explicit predicates. `isProfessionalJourneyComplete` requires the three IDs in `PROFESSIONAL_FRAGMENT_IDS`; `isAdventureComplete` additionally requires `PERSONAL_FRAGMENT_ID`. Existing version 3 saves remain compatible because the stored fragment IDs and schema do not change.

React opens the professional conclusion as soon as the experience, education, and project fragments are collected. It links directly to the full classic portfolio and CV, and offers the personal trail only as an optional continuation. Collecting the personal fragment later opens a distinct epilogue. If the personal fragment was collected first in the open world, both outcomes are presented in order when the professional path finishes.

The quest panel separates professional progress (`0 / 3` through `3 / 3`) from total world fragments and keeps a distinct completed-epilogue marker. Fragment ownership remains entirely in React and the versioned domain state; Phaser only emits the selected stable content reference.

## Jalon 8 adventure accessibility

React owns a reusable modal-focus hook for adventure overlays. Content and completion dialogues move focus to their first action, keep Tab and Shift+Tab inside the active dialogue, close with Escape, and restore focus to the invoking control when it still exists. Only one modal is exposed at a time, and Phaser input remains disabled while a dialogue is active.

Zone, discovery, and professional-fragment changes are mirrored in a polite screen-reader status outside the canvas. The touch controls form a labelled group; every direction and action remains usable as a semantic button with pointer or keyboard activation and exposes its gameplay shortcuts through `aria-keyshortcuts`.

The focus behavior is covered in jsdom, while bridge tests continue to verify that disabling game input clears held directions and queued actions. This milestone changes no content entity, save schema, or asset.

## Jalon 9 install and offline lifecycle

`PwaControls` is mounted once beside the global audio controls. It captures the browser install prompt without forcing it, exposes an install action only when eligible, reports connectivity changes, and uses the PWA registration lifecycle to offer refresh when a new service worker is waiting. The optional installation banner has a bilingual accessible close control; dismissal is stored in `sessionStorage`, so it stays hidden during the current browser session without permanently removing a future opportunity to install. Notices are bilingual, polite, dismissible when appropriate, and absent when no user action is needed.

The domain-level notice selector gives offline state priority over update, cache-readiness, and installation messages. This keeps UI policy deterministic and testable without depending on service-worker or browser APIs.

The production service worker precaches the React application shell, classic route code, CV, and recommendation document. Phaser and adventure artwork stay out of the initial precache and enter dedicated cache-first stores after the first adventure visit. Consequently, classic mode and documents work after the initial online load; a fully offline adventure requires one prior online visit. This tradeoff preserves a fast professional first load on mid-range phones.

The manifest declares the root identity and scope, standalone display, unrestricted orientation, the existing project-owned icon, and a French default language. The standalone archive remains a separate deferred deliverable.

## Jalon 10 performance, metadata, and release readiness

The landing page imports a lightweight canonical `portfolioProfile` rather than evaluating the complete validated catalog. Classic and adventure pages are both route-level lazy chunks. Zod is isolated in a validation chunk used by those content-bearing routes, reducing the blocking application bundle while preserving runtime validation and the one-source content rule. Audio code remains absent until `backgroundMusicPath` is configured.

Each route uses one metadata hook to synchronize the document language, title, description, Open Graph locale and URL, canonical URL, and FR/EN alternate links. Classic mode additionally publishes Person JSON-LD assembled only from approved profile, skill, GitHub, and LinkedIn data. The base HTML remains a French fallback for clients that do not execute JavaScript.

Netlify serves fingerprinted assets immutably while preventing stale HTML and service workers. The manifest receives a short cache lifetime, documents receive a one-day browser cache, and `robots.txt` permits indexing. A sitemap and fixed production canonical origin remain deferred until the final Netlify or custom domain is known; runtime canonicals use the active production origin in the meantime.

## Jalon 11 responsive and release gates

Classic mode keeps its full section navigation in the desktop sidebar. Below 800 px, that navigation is available from an accessible burger menu rather than occupying a permanent horizontal row. The compact header retains the current breadcrumb, while language and adventure access remain reachable without enlarging the document.

The production build has an executable verification gate in `scripts/verify-build.mjs`. It validates manifest identity, required document precaching, deferred Phaser and artwork caches, route-chunk existence, the absence of a Phaser reference from the classic chunk, and a 300 KiB uncompressed ceiling for the initial application bundle.

`docs/release-checklist.md` records the remaining manual acceptance matrix: keyboard and touch playthroughs, responsive widths, screen reader and reduced motion, production offline behavior, audio activation, Lighthouse, content approval, and licenses. These checks remain release evidence rather than application runtime concerns.

## Jalon 12 recruiter path and quest journal

The professional route is now explicit rather than inferred from the total number of interactions. The experience, studies, and projects screens each grant their fragment after one content interaction; their remaining stories are optional depth. The personal screen is labelled as an optional epilogue and therefore never blocks the professional conclusion. This preserves the fixed-screen open-world structure while targeting a 5–10 minute professional visit and up to 15 minutes with personal exploration. Human timed playthroughs remain a release-checklist requirement.

The bilingual quest journal is a React-owned accessible dialogue. It derives its four entries, localized names, hints, content totals, and fragment IDs from the validated `adventureWorld`; discovery and collection states come from the existing version 3 progress object. No quest copy or progression state is duplicated in Phaser, and this milestone requires neither a save migration nor a new asset.

Opening the journal disables Phaser input through the existing bridge runtime state. Focus moves into the dialogue, stays trapped there, closes with Escape, and returns to the invoking button. At narrow widths, quest cards become a single column; in short landscape viewports, the journal remains internally scrollable while keeping all actions reachable.

## Jalon 13 route pacing and wayfinding

The quest panel now derives one recommended destination from the ordered professional fragment IDs. Before training, it points to the central clearing; afterward it recommends the first professional fragment still missing. Only after all three professional fragments are secured does it suggest the personal trail, explicitly labelled as an optional extension. A completed world has no artificial next objective.

The miniature world map mirrors the same recommendation and distinguishes collected branches without changing the graph or locking exits. This preserves free exploration while reducing recruiter hesitation. The interface also states the target duration: 5–10 minutes for the professional journey and up to five additional minutes for personal exploration.

Automated topology checks protect the pacing assumptions: the hub exposes exactly four branches, every branch returns directly to the hub, and each contains approved interactive content. Progression tests protect the deterministic three-fragment recommendation order. These structural gates cannot replace a human timed playthrough, which remains required before release.

## Jalon 14 replay and clean-state validation

The quest journal exposes a bilingual restart action behind an explicit two-step confirmation. Resetting removes only the versioned adventure progress key; language, install state, and audio preferences remain untouched. The repository returns a complete version 3 initial state even when browser storage is unavailable.

React applies the clean state immediately to both its own presentation and the typed bridge, clears pending content or completion overlays, resets completion-transition guards, and increments a session key to remount Phaser. The new scene therefore starts in the training clearing with no stale spatial state, held input, or duplicate canvas.

The confirmation flow and storage isolation are covered by component and repository tests. A human can now use the journal to prepare a fresh 5–10 minute timing run without browser developer tools; actually recording that timed run remains a release action.

## Jalon 15 automatic fragment collection

Professional and personal branches share a direct two-step loop: reach a zone and discover any one approved story. That first reading immediately grants the zone fragment. Additional stories remain optional, exits remain unlocked, and the permanent classic-mode link still bypasses gameplay entirely.

The former spatial beacon, its book sprite, collision body, click target, canvas label, and bridge event were removed. React maps the emitted stable content reference back to its validated adventure screen and persists the discovery plus fragment in one idempotent update. Phaser no longer receives fragment ownership because it has no spatial fragment behavior to render.

Unit tests protect automatic collection and repeated-reading idempotence. Manual keyboard, mouse, and touch playthroughs verify that opening one item updates the journal and route recommendation without a second action.

## Jalon 16 reduced motion inside Phaser

The shared React hook observes the system `prefers-reduced-motion` media query and passes the current value into the dynamically loaded Phaser host. A live preference change remounts only the game canvas; canonical progress remains in React and the versioned repository, so the current zone and collected state survive.

Reduced-motion gameplay keeps essential player translation but uses a static facing frame. The training-enemy fade and screen-transition fades are skipped; zone changes and quest events remain immediate and fully functional. DOM transitions continue to be neutralized by the existing CSS media query. The former empty-action flash was removed entirely in milestone 20.

The media-query subscription and cleanup are unit tested. Manual release QA must still enable reduced motion at operating-system level and verify both canvas and DOM behavior on a physical desktop and phone.

## Jalon 17 adventure loading resilience

`PhaserHost` now owns an explicit loading lifecycle around the dynamically imported engine. While the world initializes, React exposes a bilingual polite status over the correctly sized canvas region. A rejected engine or asset load becomes an accessible alert instead of an empty game frame.

The failure state offers a focused retry action and a direct localized link to classic mode. Retrying first enters loading state, unmounts any partial game, clears its host, and creates one new instance. Successful creation removes the overlay; late promises from cancelled mounts destroy their game immediately, preserving the single-canvas invariant.

This fallback does not move Phaser into the initial bundle or change offline caching: a first offline adventure visit can still fail when the deferred engine was never cached, but the user receives a clear recovery path and can always read the precached classic portfolio. Component tests simulate rejection, retry, successful recovery, focus, localized routing, and cleanup.

## Jalon 18 onboarding and controls guide

The quest panel exposes a concise bilingual help dialogue at any point in the adventure. It explains the complete no-failure loop—choose any professional branch and discover one approved story to receive its fragment immediately—before distinguishing the three-fragment professional conclusion from the optional personal epilogue. Keyboard and touch controls are documented in the same place, together with a permanent direct route to classic mode.

The guide is a React-owned accessible modal rather than canvas text: it receives initial focus, traps keyboard navigation, closes with Escape, restores focus to its trigger, and disables Phaser input while open. Its layout becomes a single column on narrow screens and remains internally scrollable in short landscape viewports. No progress field, canonical portfolio entity, game topology, or asset was added.

Component tests protect both locales, the recruiter loop wording, initial focus, Escape dismissal, and localized classic-mode links. The timed human playthrough remains the release authority for verifying that the explanation is sufficient in practice.

## Jalon 19 mouse navigation

Desktop visitors can click any reachable point in the Phaser world to move toward it. Clicking a story object or the training guardian selects that spatial target and automatically performs the existing action once the player reaches its safe interaction radius. A small code-drawn target ring provides immediate feedback without adding an asset.

Keyboard and on-screen directional input always cancel the active pointer destination. Opening a React overlay, using the action control, reaching a blocked edge, or changing screens also clears the destination and marker, preventing stale movement across UI and scene boundaries. Pointer input is ignored whenever the typed bridge disables gameplay.

The normalized pointer velocity and arrival behavior live in a browser-independent domain helper with unit coverage. Canvas copy and the accessible help dialogue document mouse input in both languages; the release checklist retains a real mouse-only branch playthrough because collision routing and target selection require human validation.

## Jalon 20 visual scale, spatial layout, and information drawer

The adventure is now the primary full-viewport surface. The permanent left column has become a modal information drawer opened from the game frame; it retains the objective, route recommendation, map, discovery and fragment state, journal, and guide. The drawer disables Phaser input, traps focus, closes with Escape, restores focus to its trigger, and scrolls internally when needed. The directional and action controls remain visible for every pointer type and occupy the side gutters around the canvas. The header, frame, and game fit inside one viewport without page scrolling.

The logical world grew from 320×192 to 480×288. CSS selects explicit display sizes at supported viewport tiers, Phaser rounds rendered positions, and texture antialiasing stays disabled. This removes the previous arbitrary enlargement while giving the map 50% more logical width and height. Sprites render at their native logical scale, the artificial per-zone tint is gone, and the pack’s original colors remain intact.

Content markers use a shared tested layout with one spacious row for three entries, a 2×2 layout for four, and a 3×2 layout for six. Visible grass clusters and their Arcade Physics rectangles now share the same coordinates. Characters and interactable objects receive small foot-level static bodies, so the hero no longer passes through them while still remaining inside the existing action radius. Layout tests enforce safe bounds, minimum marker spacing, and clearance from obstacles.

An empty action no longer draws the misleading yellow rectangle. React instead announces a throttled bilingual hint to approach a marker. The malformed crop from the retained village atlas is no longer used and the unused atlas file was removed; no replacement or generated asset was added. Browser QA at 1280×720 verified one-page fit, the information drawer, a mouse transition into the Grove of Rigor, the six-marker spacing, and empty-action feedback.

## Jalon 21 border collisions and crisp canvas copy

Every visible border bush now has a matching static Arcade Physics rectangle. A side without an exit is one continuous wall; a side with an exit is split into two walls around the same central opening used by the rendered foliage. The exit handler independently verifies that the hero is inside this opening before changing screens, so a border transition cannot be triggered through a bush even if physics resolution briefly places the hero beyond the threshold. Shared layout helpers and unit tests keep visual openings, collisions, and transition rules aligned.

Phaser continues to own sprites, movement, collisions, and spatial interactions, but no longer rasterizes interface text into the scaled canvas. A pointer-transparent React layer renders the localized zone title, object labels, action hint, tutorial state, and awaiting-content message from the same validated content and layout coordinates. Container-relative typography tracks every supported game-size tier while remaining browser-rendered and sharp; no editorial text or progress data is duplicated inside Phaser.

## Jalon 22 compact header and map overlay

The redundant frame-label strip was removed so the canvas begins directly inside its border. The information trigger sits beside the monogram in the global adventure header, while language and permanent classic-mode access remain grouped on the opposite side. The compact 36 px `WS` monogram remains visible in short phone and desktop landscapes. Short desktop landscapes between 500 and 699 px high use a dedicated 720×432 presentation tier; standard and large desktop tiers remain 960×576 and 1440×864.

The miniature map moved from the information drawer to a pointer-transparent, semi-transparent overlay in the upper-right corner of the game. It derives current, recommended, completed, and pending states from the same `adventureWorld` coordinates and versioned React progression. React owns the map presentation and accessibility label.

## Jalon 23 viewport-contained routes

Every top-level route now owns exactly the small viewport height (`100svh`) and prevents document-level overflow. The landing page uses a four-row grid—header, compact hero, flexible mode choices, and proof footer—whose spacing, title scale, card padding, and mobile rows respond to both width and height. The two 44 px mode actions remain present at the 320×568 compact-phone target without requiring document scrolling.

Classic mode uses the same viewport boundary but preserves readable full-length content: its sidebar or mobile header and top bar remain inside the shell, while `.classic-scroll` is the sole vertical scroll container. Choosing a hash-addressable category replaces the content of that internal reader rather than moving the browser document. Adventure and route-loading states already used fixed viewport shells and remain unchanged.

The concise bilingual “Portfolio interactif” eyebrow is a low-priority label anchored independently against the upper-left edge, while the language switch occupies the upper-right header. The identity hero reserves a dedicated top offset, placing the name below both controls without overlap on desktop or mobile. The former “prototype d’architecture” qualifier and redundant `WS` monogram were removed from this route; mode-specific headers retain their own navigation identity.

## Jalon 24 category workspace and mobile burger

Classic mode is now a category workspace instead of one continuous document. Desktop sidebar controls select one of the eight canonical sections, React renders only that section in the right-hand reader, and selection returns the reader to its top. The active category is reflected by `aria-current`, the breadcrumb, and a shareable URL hash; changing language preserves the selected hash. No portfolio text is duplicated or moved out of the validated content layer.

The right-hand reader remains the only vertical scroll surface, but its scrollbar chrome is hidden across Firefox, Chromium, and legacy Edge while wheel, touch, and keyboard scrolling remain available. This keeps the fixed-viewport shell visually clean without clipping long experience, project, or document content.

Below 800 px, the 44 px burger sits in the compact identity header immediately beside the language switch. The redundant classic-mode breadcrumb bar is removed at this size, so the content reader begins directly below the header. The burger opens a superposed bilingual category menu with the permanent adventure link; the menu moves focus to its first category, closes by selection, backdrop click, or Escape, and restores focus to its trigger. Component tests protect content replacement, hash state, initial deep links, adventure access, and Escape behavior; responsive visual QA covers desktop and the reliable 500 px Chrome headless viewport.

## Jalon 25 player-over-copy composition

Sharp in-world copy remains a pointer-transparent React overlay, while the character movement and animation remain owned by Phaser. A dedicated typed bridge observer publishes only changed logical position, animation-frame, and transition-visibility values. The overlay writes those values directly to one presentational DOM element, avoiding a React render on every movement frame.

That element reuses the existing transparent hero spritesheet and selects the exact current frame above the copy layer. Only the opaque character pixels cover labels and panels; transparent sprite pixels reveal their original background, eliminating the rectangular floor cutout created by the former mask. The underlying Phaser sprite remains the gameplay reference, while map, touch controls, loading states, and modal interfaces retain their higher HUD priority.

Bridge and overlay tests protect initial visual state, changed-state delivery, duplicate suppression, unsubscription, position conversion, frame selection, and transition visibility. Browser QA confirmed that only the hero silhouette remains visible while crossing the middle of a project label.

## Jalon 26 mobile landscape control gutters

Touch controls now live beside the game frame rather than inside it. In coarse-pointer landscape layouts, the game column becomes a size-query container: the 5:3 frame width is limited by both its available height and a responsive horizontal reserve for the two control gutters. This makes the full lower edge reachable even when mobile browser chrome reduces the small viewport height.

The directional pad is centered in the left gutter and the action button in the right gutter. Their responsive sizes remain independent from Phaser’s 480×288 logical coordinates, while the canvas keeps its aspect ratio, pixel scaling, and centered position. They remain visible on fine-pointer devices as optional click controls; portrait still uses the orientation fallback, and every button retains its pointer-capture and keyboard behavior.

## Jalon 27 progressive orientation request

The portrait adventure fallback exposes its rotation glyph as a semantic button. A user gesture first requests a landscape lock through the Screen Orientation API; when the browser requires fullscreen, the app progressively requests fullscreen and retries once. Unsupported or rejected requests remain non-fatal and produce a localized status message plus the existing classic-mode route. A physical orientation change to landscape also triggers a best-effort fullscreen request; browsers that require transient activation can reject it safely, while an installed standalone PWA already has no browser chrome.

Navigation into adventure mode now primes fullscreen synchronously from the user's click on coarse-pointer devices. This preserves the transient user activation required by mobile browsers before the first physical rotation, instead of waiting for an `orientationchange` event that is already too late to authorize fullscreen. Direct URLs and browsers without the API keep the existing non-fatal portrait fallback.

Every in-app exit link starts portrait restoration synchronously from its navigation click. The route also keeps its deferred unmount cleanup for browser history and external navigation: it removes listeners, unlocks any landscape constraint, requests portrait when supported, and exits only fullscreen owned by the adventure flow. The PWA manifest keeps `orientation: any` because landing and classic reading must remain comfortable in portrait. Automatic orientation is therefore a route-local progressive enhancement rather than a global application restriction. Unit tests cover direct success, fullscreen retry, unsupported-browser fallback, portrait restoration order, and rejected restoration.

## Jalon 28 classic portfolio iconography

The classic skills workspace uses a small internal SVG icon vocabulary for programming languages, frameworks, domains, tools, spoken languages, and human skills. Beyond-code entries and contact methods receive stable-ID-specific pictograms, while document actions use a semantic download symbol instead of a typographic arrow. Labels remain visible, so the icons are decorative and hidden from assistive technology.

All pictograms inherit the existing green-and-gold palette, remain sharp at every responsive scale, and require no font, external request, third-party asset, or production dependency. Their presentation belongs to React and CSS; canonical bilingual content and stable entity IDs remain unchanged.

The same vocabulary now reinforces wayfinding throughout classic mode: every desktop and mobile navigation category carries its own icon, and the active reader repeats that symbol beside its numbered section marker. Document cards distinguish the file itself from the download action, while contact cards use a vector external-link indicator instead of a typographic arrow. Repetition is limited to navigation and action semantics so dense editorial cards remain uncluttered.
