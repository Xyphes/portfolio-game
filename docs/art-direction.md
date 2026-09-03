# Adventure art direction

## Identity

The project uses a forest-adventure style built around deep evergreen terrain, moss, foliage, warm-gold rewards, crisp pixel edges, and compact top-down characters. It evokes the immediacy of early exploration games without reproducing Nintendo characters, symbols, maps, interfaces, audio, or sprites.

## Visual foundation

The adventure uses an unmodified subset of Pixel-Boy and AAA's **Ninja Adventure** pack. The pack is CC0 and provides the terrain, vegetation, props, player, guide, and practice guardian. Phaser selects existing 16×16 frames and one floor tile at runtime; no generated artwork is part of the project. Characters and props remain at native logical scale inside a 480×288 world, with exact integer display tiers for crisp presentation.

The classic interface keeps the same forest-green and warm-gold palette, while using modern typography, generous spacing, and direct document access. This makes both modes feel related without forcing the professional view to imitate a game HUD.

## Usage rules

- Keep `image-rendering: pixelated`, disable texture antialiasing, and prefer exact integer display tiers.
- Keep content labels, visible obstacles, and physics bodies on the shared spatial layout; never place decorative scenery independently over an interaction marker. Render interface copy in the React overlay so browser text stays sharp while the Phaser artwork remains pixelated.
- Prefer the retained Ninja Adventure files before adding another pack.
- Record every new external file, source URL, release or commit, license, and modification in `docs/asset-licenses.md`.
- Do not use Zelda, Link, Triforce, Nintendo maps, copied sprites, music, logos, or UI elements.
- Preserve readable contrast and never encode essential portfolio information only in scenery.
