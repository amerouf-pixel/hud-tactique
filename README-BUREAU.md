# 🎮 Gaming Companion - Guide de Lancement sur votre Bureau

Félicitations ! Vous avez téléchargé le projet sur votre ordinateur.

## 🚀 Démarrage Rapide (En 2 minutes)

### 1. Prérequis
Assurez-vous d'avoir installé **Node.js** (version 18 ou supérieure) :
- Téléchargeable gratuitement sur : [https://nodejs.org](https://nodejs.org)

### 2. Installation des dépendances
Ouvrez votre terminal (Invite de commandes, PowerShell ou Terminal Mac/Linux) dans ce dossier et tapez :

```bash
npm install
```

### 3. Lancer l'application
Démarrez le serveur de développement local :

```bash
npm run dev
```

L'application s'ouvrira immédiatement dans votre navigateur à l'adresse :
👉 **http://localhost:3000**

---

## 🛠️ Structure du Projet

- `src/components/` : Composants de l'application (Vues, Radar HUD, Terminal Stripe/Paiement, Cartes, etc.)
- `src/components/CheckoutTerminal.tsx` : Terminal bancaire cyberpunk avec redirection personnalisable vers Stripe ou Lemon Squeezy.
- `src/context/` : Gestion des états globaux (profils de jeu, missions, collectibles, progression).
- `src/data/` : Données de démonstration et profils (Cyberpunk 2077, Elden Ring, GTA VI).

---

## 📦 Construire la version de production

Pour générer le build optimisé prêt à être hébergé sur le web (Vercel, Netlify, Cloudflare Pages, etc.) :

```bash
npm run build
```
Les fichiers prêts pour le déploiement se trouveront dans le dossier `dist/`.
