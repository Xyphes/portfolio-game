# Asset provenance register

| Asset | Author | Source | License | Modifications |
| --- | --- | --- | --- | --- |
| PWA monogram `public/icon.svg` | Project-owned | Created for this project | Project-owned | None |
| Current CV PDF and preview images in `public/documents/` | Willy Somkhit | User-provided CV (17 September 2026) | User-provided | PDF copied unchanged; French and English page previews rendered from that PDF |
| Recommendation PDF | Julien Mullet / user-provided | User-provided | User-provided | Copied unchanged to public documents |
| Profile portrait `public/assets/profile/willy-somkhit-portrait.jpg` | User-provided; photographer not specified | User-provided | Publication authorized by Willy Somkhit | Copied unchanged; displayed with CSS crop and color treatment |
| Personal-interest photos and videos in `src/assets/interests/` | User-provided; photographers/videographers not specified | User-provided | Publication authorized by Willy Somkhit | Original files preserved; optimized photo copies generated at a maximum dimension of 1600 px in `src/assets/interests-optimized/`; videos served on demand without precaching |
| Ninja Adventure subset in `public/assets/adventure/ninja-adventure/` | Pixel-Boy and AAA | [Official project page](https://pixel-boy.itch.io/ninja-adventure-asset-pack), [official repository](https://github.com/pixel-boy/NinjaAdventure), commit `6ac78232d5aedcc85ce5f27d060ea92366f7c24a` downloaded 2026-09-02 | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | Files renamed only; spritesheet frames and tileset crops are selected at runtime |

## Ninja Adventure files retained

Only the files needed by the current prototype are copied into the application:

- `hero.png`: `content/character/ninja_blue/sprite.png`
- `guide.png`: `content/character/samurai_green/samurai_green.png`
- `practice-guardian.png`: `content/character/samurai_blue/sprite.png`
- `tileset-floor.png`: `content/map/tileset_floor.png`
- `grass.png`, `crate.png`, `pot.png`: matching files from `content/destroyable/`
- `book.png`: `content/weapon/book/sprite.png`

The upstream pack is not redistributed wholesale. The previously retained village atlas was removed after its cropped prototype use was replaced by correctly scaled standalone pack assets. Attribution is not required by CC0, but the authors and official source remain credited here for traceability.
