# Fragments de parcours

Portfolio professionnel bilingue de Willy Somkhit, proposé en mode classique et sous la forme d'une courte aventure 8-bit.

Le jalon 1 valide l'architecture, la source de contenu partagée et le routage des deux modes. Le jalon 2 ajoute un monde ouvert de cinq écrans, une initiation très courte, les transitions de zone et une sauvegarde migrable. Le jalon 3 migre le parcours professionnel bilingue : six expériences, trois formations, six projets académiques, quatre centres d'intérêt et quatre fragments de découverte partagés entre React et Phaser. Les règles de contribution et les invariants produit se trouvent dans `AGENTS.md` et `.agents/skills/portfolio-game/SKILL.md`.

Le jalon 4 prépare l'audio optionnel sans lecture automatique et ajoute la configuration de déploiement Netlify. Le jalon 5 mémorise les contenus découverts, le jalon 6 ajoute la conclusion de l'aventure, le jalon 7 sépare la fin professionnelle (`3 / 3`) de l'épilogue personnel facultatif (`4 / 4`), le jalon 8 renforce l'accessibilité, le jalon 9 gère le cycle PWA, le jalon 10 optimise les chargements et le SEO, le jalon 11 finalise la navigation mobile et les contrôles de livraison, le jalon 12 ajoute le journal de quête bilingue, le jalon 13 guide le parcours de 5–10 minutes, le jalon 14 permet de recommencer proprement, le jalon 15 ajoute une collecte spatiale, le jalon 16 applique la réduction des animations dans Phaser, le jalon 17 ajoute un fallback de chargement avec relance, le jalon 18 explique la boucle de jeu, le jalon 19 ajoute le déplacement à la souris et le jalon 20 refond l’échelle, les collisions et l’affichage plein écran avec un tiroir d’informations. La musique reste désactivée tant que `src/config/audio.ts` ne référence aucun fichier fourni par l'utilisateur.

## Commandes

- `npm run dev` : développement local.
- `npm run typecheck` : validation TypeScript.
- `npm run lint` : analyse statique.
- `npm test` : tests unitaires.
- `npm run build` : build PWA de production.
- `npm run verify:build` : validation des bundles, du manifeste et du cache après le build.
