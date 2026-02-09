# Masqueur d'anonymat

Outil web (React) qui détecte les **personnes** sur une photo, affiche un **cadre cliquable** sur chacune, permet de **masquer à la demande** (clic pour cacher / réafficher) puis de **télécharger l'image**. 100 % offline (TensorFlow.js + COCO-SSD).

## Stack

- **React 18** + **Vite** + **TypeScript**
- **React Router** : 2 routes — `/` (Home), `/workspace` (Workspace)
- **COCO-SSD** (détection des personnes) via `@tensorflow-models/coco-ssd`

## Lancer le projet

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de dev
npm run dev
```

Puis ouvrir **http://localhost:5173** (ou l’URL affichée par Vite).

## Build production

```bash
npm run build
npm run preview
```

Le build est dans `dist/`. Pour déployer, servir le contenu de `dist/` en HTTPS (le Service Worker en a besoin).

## Routes

| Route        | Page                                             |
| ------------ | ------------------------------------------------ |
| `/`          | Présentation                                     |
| `/workspace` | Workspace (upload, detection, masking, download) |

## Utilisation

1. **Présentation** : page d’accueil qui décrit l’outil.
2. **Workspace** (`/workspace`) :
   - Glisser une photo ou cliquer pour en choisir une.
   - Cliquer sur « Détecter les personnes » (le modèle se charge au premier usage).
   - Cadres sur chaque personne ; cliquer pour masquer ou réafficher. Télécharger l’image.

## Technique

- **Détection** : [COCO-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) (classe « person ») ; cadres cliquables et masquage au clic.
- **Cache** : Service Worker (`public/sw.js`) pour servir l’app hors ligne après le premier chargement.
