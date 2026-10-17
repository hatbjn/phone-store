# 📱 EXPRESSOR — Plateforme E-Commerce Haute Performance

Plateforme marchande et système de gestion commerciale sur-mesure développés pour la société **EXPRESSOR S.A.R.L. AU** (Oujda, Maroc), sous la direction de **M. Charaf-Eddine MLILI**.

> Projet réalisé dans le cadre du Stage Technicien en **Génie Informatique** à l'**École Polytechnique d'Agadir (Universiapolis)**.

---

## 🚀 Fonctionnalités Clés

- **Charte Graphique Dark Luxury Tech :** Design immersif, responsive et moderne avec animations soignées.
- **Catalogue Dynamique & Filtrage Multicritères :** Recherche temps réel, filtrage par marque (Apple, Samsung, Xiaomi, Oppo, Realme), gamme de prix et catégories.
- **Fiche Produit Détaillée :** Sélecteurs dynamiques de finitions/couleurs, capacités de stockage (128 Go à 1 To) et gestion du stock en temps réel.
- **Panier Interactif & Codes Promo :** Calcul instantané avec réductions et validation de codes promotionnels.
- **Tunnel de Commande en 3 Clics :** Processus d'achat simplifié avec encaissement à la livraison (**Paiement COD - Cash on Delivery**).
- **Espace « Mon Compte » :** Suivi en direct du statut des commandes (En cours, Expédiée, Livrée) et carnet multi-adresses sans chevauchement.
- **Back-Office Administrateur :** Tableau de bord avec indicateurs clés de performance (KPIs financiers, volume des ventes, alertes stock bas) et matrice croisée marketing des favoris clients.
- **Sécurité Applicative :** Authentification sécurisée avec hachage cryptographique `scrypt` et protection des routes d'administration.

---

## 🛠️ Stack Technologique

- **Frontend :** [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [React Router](https://reactrouter.com/), [Lucide React](https://lucide.dev/)
- **Backend & API :** [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), RESTful architecture
- **Base de Données :** [MySQL 8.0](https://www.mysql.com/) avec moteur relationnel InnoDB (10 tables)
- **Déploiement Cloud :** [Vercel](https://vercel.com/) avec fonctions Serverless intégrées

---

## 💻 Démarrage Local

### 1. Prérequis
- Node.js (v18+)
- MySQL (via XAMPP ou installation locale)

### 2. Installation
```bash
git clone https://github.com/hatbjn/phone-store.git
cd phone-store
npm install
```

### 3. Configuration de la base de données
Copiez le fichier `.env.example` en `.env` et adaptez vos identifiants MySQL :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=phone_store
PORT=5000
```

Initialisez la base de données et les données de test :
```bash
node seed-db.js
```

### 4. Lancement de l'application
```bash
npm run dev
```
- Frontend accessible sur : `http://localhost:5173`
- Backend API accessible sur : `http://localhost:5000/api`

---

## ☁️ Déploiement Vercel

Le projet est pré-configuré pour un déploiement instantané sur Vercel avec `vercel.json` et des fonctions serverless :

```bash
vercel
```
Ou connectez simplement ce dépôt GitHub directement depuis le tableau de bord Vercel.

---

## 👥 Comptes de Démonstration

- **Administrateur :** `admin@expressor.ma` (Direction : Charaf-Eddine Mlili)
- **Client :** `amine.tazi@gmail.com` (Amine Tazi)

---

## 📄 Licence & Droits

© 2026 **EXPRESSOR S.A.R.L. AU** · Tous droits réservés.
Projet académique — École Polytechnique d'Agadir.
