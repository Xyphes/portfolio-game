# Ajouter des photos et vidéos aux galeries « En dehors du code »

Déposez les photos et vidéos directement dans le dossier de l’activité correspondante :

- `climbing/` : escalade
- `leathercraft/` : maroquinerie
- `jewelry/` : joaillerie
- `woodworking/` : menuiserie
- `lockpicking/` : crochetage de serrures
- `swimming/` : natation
- `traveling/` : voyages

Photos prises en charge : `.avif`, `.jpg`, `.jpeg`, `.png` et `.webp`. Vidéos prises en charge : `.mp4` et `.webm` (convertissez les vidéos `.mov` en `.mp4` avant de les déposer).

Après avoir ajouté ou retiré des photos, exécutez `npm run optimize:photos`. Les copies optimisées des photos utilisées par le site sont générées dans `src/assets/interests-optimized/`, tandis que les originaux restent inchangés ici. Les vidéos sont lues directement depuis ce dossier : elles ne sont pas compressées par cette commande, ne sont pas préchargées et ne démarrent jamais automatiquement. Pour un chargement raisonnable, exportez-les dans une taille adaptée au Web avant publication.

Les photos et vidéos sont mélangées par ordre alphabétique du nom de fichier dans le carrousel. Utilisez de préférence des noms simples et ordonnés comme `01-kyoto.webp`, `02-osaka.mp4` ou `03-portefeuille.jpg`.

Avant publication, conservez seulement des médias que vous possédez ou que vous êtes autorisé à publier, puis ajoutez leur provenance dans `docs/asset-licenses.md`.
