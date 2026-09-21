# Carte rapide du projet

Ce document sert de point d'entrée avant toute recherche large dans le dépôt. Pour une modification, commencer par la table ci-dessous, ouvrir uniquement les fichiers indiqués et leurs tests associés, puis élargir la recherche seulement si la carte ne couvre pas le besoin.

Le récit détaillé des jalons reste dans [`docs/architecture.md`](architecture.md). Les règles qui priment sur cette carte sont dans [`AGENTS.md`](../AGENTS.md).

## Demande -> fichiers à ouvrir

| Demande | Source principale | À vérifier aussi |
| --- | --- | --- |
| Nom, titre, introduction, disponibilité, portrait | `src/content/profile.data.ts` | `public/assets/profile/`, accueil et section About |
| Compétences, langues, expériences, études, projets, intérêts, contacts, documents | `src/content/portfolio.data.ts` | `src/content/portfolio.schema.ts`, `src/content/portfolio.test.ts` |
| Nouveau type de donnée ou règle de validation | `src/content/portfolio.schema.ts` ou `src/content/adventure.schema.ts` | fichiers `.data.ts` et tests du même dossier |
| Traduction d'un contenu professionnel | `src/content/profile.data.ts` ou `src/content/portfolio.data.ts` | toujours renseigner `fr` et `en` |
| Texte d'interface propre à une page | objet `copy` dans le composant concerné | les deux langues et le test du composant |
| Page d'accueil, cartes des deux modes, portrait ou contacts d'accueil | `src/features/landing/LandingPage.tsx` | styles `.landing-*` dans `src/styles.css`, `LandingPage.test.tsx` |
| Navigation ou contenu du mode classique | `src/features/classic/ClassicPage.tsx` | styles `.classic-*`, `ClassicPage.test.tsx` |
| Galerie « En dehors du code » | `src/content/portfolio.data.ts`, `src/assets/interests/README.md` | `interestMedia.ts`, `src/assets/interests/`, `src/assets/interests-optimized/` |
| Aperçu ou téléchargement du CV et des documents | `src/content/portfolio.data.ts` | `public/documents/`, rendu Documents dans `ClassicPage.tsx` |
| Icônes du classique ou des contacts | `src/shared/ClassicIcon.tsx`, `src/shared/ContactIconLinks.tsx` | tables d'icônes dans `ClassicPage.tsx` |
| Mise en page globale, responsive, téléphone ou paysage | `src/styles.css` | composant qui porte les classes concernées ; tester PC et téléphone |
| Structure React du mode aventure, modales, infos, contacts | `src/features/adventure/AdventurePage.tsx` | `AdventureCanvasOverlay.tsx`, `QuestJournal.tsx`, `AdventureGuide.tsx` |
| Contrôles tactiles, pad virtuel ou bouton A | `src/features/adventure/TouchControls.tsx` | `virtualJoystick.ts`, tests associés, styles `.touch-*` et media queries |
| Rotation, plein écran et retour portrait | `src/features/adventure/orientation.ts` | intégration dans `AdventurePage.tsx`, `orientation.test.ts` |
| Monde, salles, sorties, fragments et références de contenu | `src/content/adventure.data.ts` | `adventure.schema.ts`, `worldLayout.ts`, tests de contenu |
| Décorations, collisions, mode monstres et points de vie | `src/game/adventureEncounters.ts`, `src/game/createAdventureGame.ts`, `src/game/bridge/AdventureBridge.ts`, `src/features/adventure/AdventurePage.tsx` | `adventureEncounters.test.ts`, `AdventureBridge.test.ts`, `AdventurePage.test.tsx` |
| Gameplay Phaser, joueur, collisions, interactions et sprites | `src/game/createAdventureGame.ts` | `worldLayout.ts`, `src/game/bridge/AdventureBridge.ts`, assets aventure |
| Communication React <-> Phaser | `src/game/bridge/AdventureBridge.ts` | `PhaserHost.tsx`, `createAdventureGame.ts`, test du bridge |
| Position ou taille du canvas et des commandes aventure | `src/styles.css` | `AdventurePage.tsx`, `TouchControls.tsx`, vérifier PC sans casser le téléphone |
| Progression, fragments, sauvegarde et migration | `src/domain/progression.ts` | `src/infrastructure/progressRepository.ts` et leurs tests |
| Préférences audio | `src/domain/audioPreferences.ts`, `src/config/audio.ts` | `AudioControls.tsx`, dépôt de préférences et tests |
| Installation, mise à jour et messages PWA | `src/features/pwa/PwaControls.tsx` | `src/domain/pwa.ts`, `vite.config.ts`, `scripts/verify-build.mjs` |
| Routes, lazy loading ou écran de chargement | `src/app/App.tsx` | `src/main.tsx`, métadonnées de chaque page |
| Sélecteur FR/EN | `src/shared/LanguageProvider.tsx`, `LanguageSwitch.tsx` | `language.ts`, routes dans `App.tsx` |
| Fond animé | `src/shared/PixelBlastBackdrop.tsx` | styles associés dans `src/styles.css`, réduction des animations |
| SEO et métadonnées | `src/shared/usePageMetadata.ts` | appel du hook dans chaque page et test associé |
| Manifest, cache hors ligne et découpage du build | `vite.config.ts` | `src/domain/pwa.ts`, `scripts/verify-build.mjs` |
| Déploiement Netlify | `netlify.toml` | build local et routes directes |
| Licence ou provenance d'un asset | `docs/asset-licenses.md` | ne publier que les fichiers réellement utilisés |

## Flux d'architecture

```text
src/content (données bilingues validées)
    |---> React : accueil + mode classique
    `---> React aventure : panneaux et progression
              | typed bridge
              `---> Phaser : rendu du monde, déplacements, collisions

src/domain (logique navigateur-indépendante)
    `---> src/infrastructure (localStorage et adaptateurs navigateur)
```

Règles essentielles :

- `src/content` contient les faits éditoriaux validés. Il ne dépend ni de React ni de Phaser.
- `src/domain` contient la logique pure et ne dépend ni du DOM, ni de React, ni de Phaser.
- React gère les routes, le mode classique et les interfaces accessibles de l'aventure.
- Phaser gère seulement le canvas, le monde, les déplacements, les collisions et les interactions spatiales.
- La frontière React/Phaser passe uniquement par `AdventureBridge`.
- Phaser est importé dynamiquement par `createAdventureGame.ts`; les routes classiques ne doivent pas le charger.
- Un fait professionnel n'est écrit qu'une fois dans la couche de contenu, puis référencé par identifiant stable dans l'aventure.

## Entrées et routes

- `src/main.tsx` monte React, le routeur et le fournisseur de langue.
- `src/app/App.tsx` déclare `/`, `/:locale/classic` et `/:locale/adventure`.
- `src/features/landing/LandingPage.tsx` est l'accueil et le choix du mode.
- `src/features/classic/ClassicPage.tsx` affiche les sections pilotées par le hash : `about`, `skills`, `education`, `experiences`, `projects`, `interests`, `documents`, `contact`.
- `src/features/adventure/AdventurePage.tsx` orchestre l'aventure ; `PhaserHost.tsx` monte et détruit le jeu.

## Données partagées

- `profile.data.ts` : identité, titre, introduction, disponibilité et portrait.
- `portfolio.data.ts` : compétences, langues, expériences, études, projets, intérêts, liens et documents.
- `portfolio.schema.ts` : schéma Zod et types dérivés.
- `selectors.ts` : localisation et résolution des identifiants de contenu.
- `adventure.data.ts` : salles, sorties, fragments et références vers le portfolio.
- `adventure.schema.ts` : contrat validé du monde aventure.

Toute donnée publiée doit exister en français et en anglais. Ne pas inventer de fait professionnel et ne pas recopier une description dans un composant ou dans Phaser.

## Mode classique

`ClassicPage.tsx` concentre la navigation et le rendu des huit sections. Les médias des centres d'intérêt sont découverts avec `import.meta.glob`, puis normalisés par `interestMedia.ts`. Les composants partagés utiles sont :

- `ClassicIcon.tsx` pour le catalogue SVG ;
- `ContactIconLinks.tsx` pour les liens téléphone, e-mail, GitHub et LinkedIn ;
- `LanguageSwitch.tsx` pour FR/EN ;
- `PixelBlastBackdrop.tsx` pour le fond animé.

Les styles du projet sont centralisés dans `src/styles.css`. Chercher d'abord le préfixe de classe du composant (`landing-`, `classic-`, `adventure-`, `game-`, `touch-`) et la media query correspondant au format visé.

## Mode aventure

- `AdventurePage.tsx` : état React, progression, dialogues, orientation et actions globales.
- `PhaserHost.tsx` : cycle de vie du jeu et chargement différé.
- `createAdventureGame.ts` : scène Phaser, joueur, sprites, clavier, collisions, respawn et interactions.
- `mobPatrol.ts` : inversion de direction des monstres aux limites de leur patrouille ou devant un obstacle.
- `adventureEncounters.ts` : configuration déclarative des décorations et des mobs de chaque type de salle.
- `AdventureBridge.ts` : événements et commandes typés entre React et Phaser.
- `worldLayout.ts` : viewport, obstacles, ouvertures, haies supplémentaires de la première salle et positions des contenus.
- `TouchControls.tsx` + `virtualJoystick.ts` : pad tactile glissant et action A.
- `AdventureCanvasOverlay.tsx` : éléments React superposés au canvas.
- `QuestJournal.tsx` et `AdventureGuide.tsx` : journal et aide.
- `orientation.ts` : plein écran, paysage et restauration du portrait.

Pour une modification visuelle du jeu, déterminer d'abord si l'élément appartient au canvas Phaser ou à une surcouche React. Ne pas corriger un problème de gameplay uniquement avec du CSS.

## Assets et documents

- Portrait : `public/assets/profile/`.
- Sprites aventure : `public/assets/adventure/ninja-adventure/`.
- PDF et aperçus du CV : `public/documents/` ; leurs chemins publics sont déclarés dans `portfolio.data.ts`.
- Photos originales des loisirs : `src/assets/interests/<activité>/`.
- Photos optimisées utilisées par le build : `src/assets/interests-optimized/<activité>/`.
- Vidéos des loisirs : lues directement depuis `src/assets/interests/<activité>/`.

Après modification des photos, lancer `npm run optimize:photos`. Mettre à jour `docs/asset-licenses.md` pour tout nouvel asset publié. Ne jamais modifier les PDF sources pour accomplir une demande d'interface.

## Persistance et PWA

- `progression.ts` versionne l'état de progression ; `progressRepository.ts` le stocke et récupère les données invalides proprement.
- `audioPreferences.ts` versionne le volume et l'activation audio ; `audioPreferencesRepository.ts` utilise le stockage navigateur.
- `PwaControls.tsx` affiche les actions d'installation et de mise à jour.
- `vite.config.ts` porte le manifest et les règles Workbox.
- `scripts/verify-build.mjs` vérifie que le build conserve les invariants de bundle et de cache.

## Tests et validation

Les tests sont généralement colocalisés : `NomDuFichier.test.ts(x)`. Commencer par le test de la zone modifiée, puis choisir les contrôles proportionnés au risque :

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm run verify:build
```

Pour une modification de documentation uniquement, `git diff --check` et la validation des chemins suffisent. Pour une modification visuelle ou responsive, vérifier aussi le résultat dans Chrome en mode PC et téléphone. Pour l'aventure, vérifier clavier, tactile, plein écran, rotation, montage/démontage de Phaser et retour au mode classique.

## Méthode de recherche courte

1. Lire cette carte et choisir une ligne de la table.
2. Ouvrir les 1 à 3 fichiers indiqués et leurs tests colocalisés.
3. Chercher le nom exact d'un composant, d'une classe CSS ou d'un identifiant avec `rg` dans le dossier concerné seulement.
4. Élargir à tout `src/` uniquement si le flux traverse plusieurs couches.
5. Si la carte était incomplète ou fausse, la corriger dans la même modification.
