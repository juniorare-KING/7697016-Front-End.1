# 7697016-Front-End.1

Support de code pour le cours OpenClassrooms « Créez des pages web dynamiques avec JavaScript ».

## Présentation

Ce dépôt contient une petite application front‑end (HTML/CSS/JS) et une API mock basée sur `json-server` (dossier `api-http`). L'application affiche des pièces auto, permet d'ajouter des avis et présente deux graphiques.

## Prérequis

- Node.js (v16+ recommandé)
- npm

## Installation

1. Cloner le dépôt :

   git clone <url-du-repo>
   cd 7697016-Front-End.1

2. Installer les dépendances du frontend :

   npm install

3. Installer et lancer l'API mock (dans un autre terminal) :

   cd api-http
   npm install
   npm start

   L'API démarre par défaut sur `http://localhost:8081` (endpoint principal : `/pieces`, `/avis`).

4. Lancer le frontend :

   Retourner à la racine du projet puis :

   npm start

   Le serveur statique (`http-server`) servira l'application (par défaut http://127.0.0.1:8080).

## Utilisation et dépannage rapide

- Si vous modifiez `api-http/db.json` (ajout de pièces ou d'avis), redémarrez le serveur dans `api-http` pour prendre en compte les changements.
- Le frontend met en cache la liste des pièces dans `localStorage` sous la clé `pieces`. Si les nouvelles pièces ne s'affichent pas :
  - Ouvrez la console du navigateur et exécutez `localStorage.removeItem('pieces')` puis rechargez la page, ou
  - Utilisez le bouton **Mettre à jour les pièces** présent dans l'interface.
- Les images produits sont attendues dans le dossier `images/`. Si une image manque, ajoutez le fichier correspondant (nom exact) ou utilisez un placeholder.

## Scripts utiles

- `npm start` : lance le serveur statique (frontend)
- `npm run lint` : lance ESLint sur les fichiers JS
- Dans `api-http` : `npm start` lance `json-server --port 8081 --no-cors db.json`

## Contributions

N'hésite pas à proposer des améliorations : ajouter des images pour les nouvelles pièces, enrichir `db.json` ou améliorer l'interface.

---

Merci et bon développement !
