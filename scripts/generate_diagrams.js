import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const SCREENSHOTS_DIR = path.resolve('screenshots');
const TEMP_DIR = path.resolve('scripts/temp_diagrams');

if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

function renderAndCapture(htmlContent, outFileName, width = 1400, height = 900) {
  const tempHtml = path.join(TEMP_DIR, `${outFileName}.html`);
  const outPng = path.join(SCREENSHOTS_DIR, `${outFileName}.png`);
  
  const fullHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: ${width}px;
    height: ${height}px;
    background: #0f172a;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    color: #f8fafc;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px;
    overflow: hidden;
  }
  .card {
    width: 100%;
    height: 100%;
    background: #1e293b;
    border: 2px solid #334155;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    padding: 30px;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #334155;
    padding-bottom: 16px;
    margin-bottom: 24px;
  }
  .title {
    font-size: 24px;
    font-weight: 700;
    color: #38bdf8;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .subtitle {
    font-size: 14px;
    color: #94a3b8;
    font-weight: 500;
  }
  .badge {
    background: #0369a1;
    color: #e0f2fe;
    padding: 6px 14px;
    border-radius: 9999px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  .content {
    flex: 1;
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
</head>
<body>
  <div class="card">
    ${htmlContent}
  </div>
</body>
</html>`;

  fs.writeFileSync(tempHtml, fullHtml, 'utf-8');
  console.log(`Rendering diagram: ${outFileName}...`);
  const cmd = `"${EDGE}" --headless --disable-gpu "--screenshot=${outPng}" --window-size=${width},${height} "file://${tempHtml.replace(/\\/g, '/')}"`;
  execSync(cmd, { stdio: 'inherit' });
  console.log(`Saved: ${outPng}`);
}

// 1. Architecture 3-Tiers Découplée
const architecture3TiersHtml = `
  <div class="header">
    <div>
      <div class="title">FIGURE 2.1 : ARCHITECTURE LOGICIELLE 3-TIERS DÉCOUPLÉE</div>
      <div class="subtitle">Plateforme E-Commerce Haute Performance EXPRESSOR (React 19 / Node.js 24 / MySQL 8.0)</div>
    </div>
    <div class="badge">CYCLE INGÉNIEUR • ÉCOLE POLYTECHNIQUE D'AGADIR</div>
  </div>
  <div class="content" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; height: calc(100% - 20px);">
    <!-- TIER 1 -->
    <div style="background: #0f172a; border: 2px solid #0284c7; border-radius: 12px; padding: 20px; display: flex; flex-direction: column;">
      <div style="background: #0284c7; color: white; padding: 10px 14px; border-radius: 8px; font-weight: 700; font-size: 16px; text-align: center; margin-bottom: 16px;">
        1. COUCHE PRÉSENTATION (FRONT-END)
      </div>
      <div style="font-size: 14px; color: #38bdf8; font-weight: 600; margin-bottom: 8px;">Navigateur Client (SPA Réactive)</div>
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 12px; margin-bottom: 12px; font-size: 13px; line-height: 1.6;">
        <b>• Framework :</b> React 19.2 + Vite 8.3<br>
        <b>• Routage :</b> React Router DOM v7 (10 routes)<br>
        <b>• État Global :</b> StoreContext (Panier, Session, Favoris)<br>
        <b>• Design System :</b> Dark Luxury Tech (#050811 / #99e39e)<br>
        <b>• Ergonomie :</b> Flexbox anti-chevauchement
      </div>
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 12px; font-size: 13px; line-height: 1.6;">
        <b>Vues Développées :</b><br>
        - Vitrine Hero Banner & Catalogue Smartphones<br>
        - Fiche Produit (Configurateur Stock & Couleurs)<br>
        - Panier & Encaissement COD (Cash on Delivery)<br>
        - Espace Client (Profil, Adresses, Commandes)<br>
        - Console Dashboard Administrateur Commercial
      </div>
      <div style="margin-top: auto; text-align: center; color: #38bdf8; font-size: 13px; font-weight: 600; padding-top: 10px;">
        Requêtes HTTP Asynchrones (Fetch API / JSON) ➔
      </div>
    </div>

    <!-- TIER 2 -->
    <div style="background: #0f172a; border: 2px solid #0d9488; border-radius: 12px; padding: 20px; display: flex; flex-direction: column;">
      <div style="background: #0d9488; color: white; padding: 10px 14px; border-radius: 8px; font-weight: 700; font-size: 16px; text-align: center; margin-bottom: 16px;">
        2. COUCHE MÉTIER & SERVICES (BACK-END)
      </div>
      <div style="font-size: 14px; color: #2dd4bf; font-weight: 600; margin-bottom: 8px;">Serveur d'Application RESTful</div>
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 12px; margin-bottom: 12px; font-size: 13px; line-height: 1.6;">
        <b>• Moteur :</b> Node.js v24 LTS + Express.js v5<br>
        <b>• Middlewares :</b> CORS, JSON Body Parser, Auth<br>
        <b>• Sessions :</b> Jetons cryptographiques 64 chars<br>
        <b>• Sécurité :</b> Hachage scrypt avec sel aléatoire<br>
        <b>• Pool SQL :</b> mysql2/promise (10 connexions)
      </div>
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 12px; font-size: 13px; line-height: 1.6;">
        <b>Contrôleurs Métier :</b><br>
        - AuthController (Login, Register, Logout, Me)<br>
        - ProductController (Catalogue, Filtres, Stock)<br>
        - OrderController (Validation serveur, Décrémentation)<br>
        - AddressController (Gestion adresses de livraison)<br>
        - AdminController (KPIs financiers, Commandes, Favoris)
      </div>
      <div style="margin-top: auto; text-align: center; color: #2dd4bf; font-size: 13px; font-weight: 600; padding-top: 10px;">
        Connexion TCP Port 3306 (Pool SQL) ➔
      </div>
    </div>

    <!-- TIER 3 -->
    <div style="background: #0f172a; border: 2px solid #8b5cf6; border-radius: 12px; padding: 20px; display: flex; flex-direction: column;">
      <div style="background: #8b5cf6; color: white; padding: 10px 14px; border-radius: 8px; font-weight: 700; font-size: 16px; text-align: center; margin-bottom: 16px;">
        3. COUCHE DONNÉES (SGBD RELATIONNEL)
      </div>
      <div style="font-size: 14px; color: #c084fc; font-weight: 600; margin-bottom: 8px;">Persistance MySQL 8.0 (InnoDB)</div>
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 12px; margin-bottom: 12px; font-size: 13px; line-height: 1.6;">
        <b>• Base :</b> phone_store (Jeu utf8mb4_unicode_ci)<br>
        <b>• Moteur :</b> InnoDB (Transactions ACID)<br>
        <b>• Intégrité :</b> Clés étrangères ON DELETE CASCADE<br>
        <b>• Sécurité :</b> Prévention injections via requêtes préparées (?)<br>
        <b>• Normalisation :</b> Troisième Forme Normale (3FN)
      </div>
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 12px; font-size: 13px; line-height: 1.6;">
        <b>Structure des 10 Tables :</b><br>
        - users, sessions (Comptes & Jetons actifs)<br>
        - products (Smartphones, Accessoires, Stocks)<br>
        - orders, order_items (Transactions & Détails)<br>
        - addresses (Carnet de livraison multi-adresses)<br>
        - favorites, reviews (Engagement & Avis vérifiés)<br>
        - promos, messages (Coupons rabais & Support)
      </div>
      <div style="margin-top: auto; text-align: center; color: #c084fc; font-size: 13px; font-weight: 600; padding-top: 10px;">
        ✓ Sauvegardes automatisées & Index B-Tree
      </div>
    </div>
  </div>
`;

// 2. Planning de Réalisation (Diagramme de Gantt)
const ganttHtml = `
  <div class="header">
    <div>
      <div class="title">FIGURE 2.2 : PLANNING PRÉVISIONNEL ET DIAGRAMME DE GANTT (2 MOIS / 8 SEMAINES)</div>
      <div class="subtitle">Méthodologie Agile Scrum appliquée au projet EXPRESSOR (Du 01/07/2025 au 31/08/2025 – 4 Sprints)</div>
    </div>
    <div class="badge">DÉROULEMENT DU STAGE (2 MOIS)</div>
  </div>
  <div class="content" style="display: flex; flex-direction: column; gap: 12px; justify-content: center;">
    <div style="display: grid; grid-template-columns: 280px 1fr; gap: 16px; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 8px;">
      <div style="font-weight: 700; color: #94a3b8; font-size: 14px;">PHASES & ACTIVITÉS D'INGÉNIERIE</div>
      <div style="display: grid; grid-template-columns: repeat(8, 1fr); text-align: center; font-weight: 700; color: #38bdf8; font-size: 13px;">
        <div>S1</div><div>S2</div><div>S3</div><div>S4</div><div>S5</div><div>S6</div><div>S7</div><div>S8</div>
      </div>
    </div>

    <!-- Tâche 1 -->
    <div style="display: grid; grid-template-columns: 280px 1fr; gap: 16px; align-items: center;">
      <div style="font-size: 13px; font-weight: 600;">1. Cadrage, MCD/MPD & BDD MySQL (Sprint 1)</div>
      <div style="display: grid; grid-template-columns: repeat(8, 1fr); height: 34px;">
        <div style="background: linear-gradient(90deg, #0284c7, #38bdf8); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: white; grid-column: 1 / 3; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
          Spécif. & 10 Tables SQL
        </div>
      </div>
    </div>

    <!-- Tâche 2 -->
    <div style="display: grid; grid-template-columns: 280px 1fr; gap: 16px; align-items: center;">
      <div style="font-size: 13px; font-weight: 600;">2. API REST Express & Sécurité scrypt (Sprint 2)</div>
      <div style="display: grid; grid-template-columns: repeat(8, 1fr); height: 34px;">
        <div style="background: linear-gradient(90deg, #0d9488, #2dd4bf); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: white; grid-column: 2 / 4; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
          Endpoints & Auth
        </div>
      </div>
    </div>

    <!-- Tâche 3 -->
    <div style="display: grid; grid-template-columns: 280px 1fr; gap: 16px; align-items: center;">
      <div style="font-size: 13px; font-weight: 600;">3. UI React, Charte Dark Luxury & Catalogues (Sprint 2)</div>
      <div style="display: grid; grid-template-columns: repeat(8, 1fr); height: 34px;">
        <div style="background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: white; grid-column: 3 / 5; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
          Hero & Filtres Store
        </div>
      </div>
    </div>

    <!-- Tâche 4 -->
    <div style="display: grid; grid-template-columns: 280px 1fr; gap: 16px; align-items: center;">
      <div style="font-size: 13px; font-weight: 600;">4. StoreContext, Panier & Tunnel COD (Sprint 3)</div>
      <div style="display: grid; grid-template-columns: repeat(8, 1fr); height: 34px;">
        <div style="background: linear-gradient(90deg, #e11d48, #fb7185); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: white; grid-column: 4 / 6; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
          Checkout & Promos
        </div>
      </div>
    </div>

    <!-- Tâche 5 -->
    <div style="display: grid; grid-template-columns: 280px 1fr; gap: 16px; align-items: center;">
      <div style="font-size: 13px; font-weight: 600;">5. Espace Client, Adresses & Dashboard Admin (Sprint 3)</div>
      <div style="display: grid; grid-template-columns: repeat(8, 1fr); height: 34px;">
        <div style="background: linear-gradient(90deg, #7c3aed, #a78bfa); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: white; grid-column: 6 / 8; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
          Back-Office & KPIs
        </div>
      </div>
    </div>

    <!-- Tâche 6 -->
    <div style="display: grid; grid-template-columns: 280px 1fr; gap: 16px; align-items: center;">
      <div style="font-size: 13px; font-weight: 600;">6. Recette, Tests, Optimisation & Rapport (Sprint 4)</div>
      <div style="display: grid; grid-template-columns: repeat(8, 1fr); height: 34px;">
        <div style="background: linear-gradient(90deg, #059669, #34d399); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: white; grid-column: 7 / 9; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
          Validation & Clôture
        </div>
      </div>
    </div>

    <div style="margin-top: 18px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 12px 18px; display: flex; justify-content: space-between; font-size: 13px; color: #94a3b8;">
      <div><b>Cadence Agile :</b> 4 Sprints de 2 semaines (2 mois)</div>
      <div><b>Revue hebdomadaire :</b> M. Charaf-Eddine MLILI (Directeur)</div>
      <div><b>Livrable :</b> Plateforme e-commerce opérationnelle & Rapport académique</div>
    </div>
  </div>
`;

// 3. Diagramme des Cas d'Utilisation UML
const umlUseCaseHtml = `
  <div class="header">
    <div>
      <div class="title">FIGURE 3.1-A : DIAGRAMME DES CAS D'UTILISATION (UML USE CASE DIAGRAM)</div>
      <div class="subtitle">Modélisation fonctionnelle des acteurs et services de la plateforme e-commerce EXPRESSOR</div>
    </div>
    <div class="badge">CONCEPTION UML</div>
  </div>
  <div class="content" style="display: grid; grid-template-columns: 220px 1fr 240px; gap: 20px; height: calc(100% - 20px);">
    <!-- ACTEURS CLIENTS -->
    <div style="display: flex; flex-direction: column; gap: 20px; justify-content: center;">
      <!-- Visiteur -->
      <div style="background: #0f172a; border: 2px solid #38bdf8; border-radius: 12px; padding: 16px; text-align: center;">
        <div style="font-size: 32px; margin-bottom: 6px;">👤</div>
        <div style="font-weight: 700; color: #38bdf8; font-size: 15px;">« Acteur »<br>Visiteur</div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 6px;">Internaute non authentifié naviguant sur le store</div>
      </div>

      <!-- Client Enregistré -->
      <div style="background: #0f172a; border: 2px solid #2dd4bf; border-radius: 12px; padding: 16px; text-align: center;">
        <div style="font-size: 32px; margin-bottom: 6px;">🛒</div>
        <div style="font-weight: 700; color: #2dd4bf; font-size: 15px;">« Acteur »<br>Client Vérifié</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;"><i>Hérite des droits du Visiteur</i></div>
        <div style="font-size: 12px; color: #cbd5e1; margin-top: 6px;">Compte client authentifié (ex: Amine TAZI)</div>
      </div>
    </div>

    <!-- SYSTÈME CAS D'USAGE -->
    <div style="background: #0f172a; border: 2px dashed #475569; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between;">
      <div style="text-align: center; font-weight: 700; color: #cbd5e1; font-size: 14px; border-bottom: 1px solid #334155; padding-bottom: 6px;">
        SYSTÈME GLOBAL « EXPRESSOR.MA »
      </div>

      <!-- Use cases Visiteur -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div style="background: #1e293b; border: 1px solid #38bdf8; border-radius: 20px; padding: 8px 12px; text-align: center; font-size: 12px; font-weight: 600;">
          Consulter le catalogue & Hero
        </div>
        <div style="background: #1e293b; border: 1px solid #38bdf8; border-radius: 20px; padding: 8px 12px; text-align: center; font-size: 12px; font-weight: 600;">
          Filtrer par marque, prix, RAM
        </div>
        <div style="background: #1e293b; border: 1px solid #38bdf8; border-radius: 20px; padding: 8px 12px; text-align: center; font-size: 12px; font-weight: 600;">
          Consulter fiche & sélecteur couleur
        </div>
        <div style="background: #1e293b; border: 1px solid #38bdf8; border-radius: 20px; padding: 8px 12px; text-align: center; font-size: 12px; font-weight: 600;">
          Gérer le panier & Calculs
        </div>
        <div style="background: #1e293b; border: 1px solid #38bdf8; border-radius: 20px; padding: 8px 12px; text-align: center; font-size: 12px; font-weight: 600; grid-column: 1 / 3;">
          Créer un compte / S'authentifier (scrypt) & Formulaire de contact
        </div>
      </div>

      <!-- Use cases Client -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 4px;">
        <div style="background: #1e293b; border: 1px solid #2dd4bf; border-radius: 20px; padding: 8px 12px; text-align: center; font-size: 12px; font-weight: 600; color: #2dd4bf;">
          Valider commande (Paiement COD)
        </div>
        <div style="background: #1e293b; border: 1px solid #2dd4bf; border-radius: 20px; padding: 8px 12px; text-align: center; font-size: 12px; font-weight: 600; color: #2dd4bf;">
          Appliquer code promo validé
        </div>
        <div style="background: #1e293b; border: 1px solid #2dd4bf; border-radius: 20px; padding: 8px 12px; text-align: center; font-size: 12px; font-weight: 600; color: #2dd4bf;">
          Gérer carnet d'adresses (CRUD)
        </div>
        <div style="background: #1e293b; border: 1px solid #2dd4bf; border-radius: 20px; padding: 8px 12px; text-align: center; font-size: 12px; font-weight: 600; color: #2dd4bf;">
          Suivre l'historique des commandes
        </div>
        <div style="background: #1e293b; border: 1px solid #2dd4bf; border-radius: 20px; padding: 8px 12px; text-align: center; font-size: 12px; font-weight: 600; color: #2dd4bf; grid-column: 1 / 3;">
          Gérer la liste des favoris & Déposer un avis noté (1 à 5 étoiles)
        </div>
      </div>

      <!-- Use cases Admin -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-top: 4px;">
        <div style="background: #1e293b; border: 1px solid #c084fc; border-radius: 20px; padding: 7px 12px; text-align: center; font-size: 12px; font-weight: 600; color: #c084fc;">
          Consulter Dashboard & KPIs Financiers (CA en DH, Commandes, Panier moyen)
        </div>
        <div style="background: #1e293b; border: 1px solid #c084fc; border-radius: 20px; padding: 7px 12px; text-align: center; font-size: 12px; font-weight: 600; color: #c084fc;">
          CRUD Produits, gestion des stocks & Upload photographique
        </div>
        <div style="background: #1e293b; border: 1px solid #c084fc; border-radius: 20px; padding: 7px 12px; text-align: center; font-size: 12px; font-weight: 600; color: #c084fc;">
          Mettre à jour statuts logistiques (Expédiée, Livrée) & Analyse croisée Favoris
        </div>
      </div>
    </div>

    <!-- ACTEUR ADMIN -->
    <div style="display: flex; flex-direction: column; justify-content: center;">
      <div style="background: #0f172a; border: 2px solid #c084fc; border-radius: 12px; padding: 20px; text-align: center;">
        <div style="font-size: 36px; margin-bottom: 8px;">👨‍💼</div>
        <div style="font-weight: 700; color: #c084fc; font-size: 16px;">« Acteur »<br>Administrateur</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Direction Technique & Commerciale</div>
        <div style="font-size: 12px; color: #cbd5e1; margin-top: 10px; line-height: 1.5;">
          Superviseur : M. Yassine MANSOURI<br>
          Accès total Back-Office & KPIs<br>
          Rôle système : <code>role = 'admin'</code>
        </div>
      </div>
    </div>
  </div>
`;

// 4. Diagramme de Séquence UML (Passation de commande transactionnelle)
const umlSequenceHtml = `
  <div class="header">
    <div>
      <div class="title">FIGURE 3.1-B : DIAGRAMME DE SÉQUENCE (SCÉNARIO COMMANDE TRANSACTIONNELLE COD)</div>
      <div class="subtitle">Flux d'exécution de la validation d'achat avec recalcul serveur et décrémentation des stocks</div>
    </div>
    <div class="badge">SÉQUENCE UML</div>
  </div>
  <div class="content" style="display: flex; flex-direction: column; justify-content: space-between; padding: 10px 0;">
    <!-- LIGNES DE VIE / PARTICIPANTS -->
    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; text-align: center;">
      <div style="background: #0284c7; padding: 8px; border-radius: 8px; font-size: 13px; font-weight: 700;">Client (Web)</div>
      <div style="background: #0d9488; padding: 8px; border-radius: 8px; font-size: 13px; font-weight: 700;">Front React (Checkout)</div>
      <div style="background: #d97706; padding: 8px; border-radius: 8px; font-size: 13px; font-weight: 700;">StoreContext (State)</div>
      <div style="background: #e11d48; padding: 8px; border-radius: 8px; font-size: 13px; font-weight: 700;">API Express (/api/orders)</div>
      <div style="background: #7c3aed; padding: 8px; border-radius: 8px; font-size: 13px; font-weight: 700;">SGBD MySQL (InnoDB)</div>
    </div>

    <!-- ÉTAPES DU SCÉNARIO -->
    <div style="display: flex; flex-direction: column; gap: 10px; margin: 15px 0;">
      <div style="background: #0f172a; border-left: 4px solid #0284c7; padding: 8px 14px; font-size: 12px; display: flex; justify-content: space-between;">
        <span><b>1.</b> Saisie adresse livraison & sélection « Paiement à la livraison » (COD)</span>
        <span style="color: #38bdf8;">Client ➔ Front React</span>
      </div>
      <div style="background: #0f172a; border-left: 4px solid #0d9488; padding: 8px 14px; font-size: 12px; display: flex; justify-content: space-between;">
        <span><b>2.</b> Récupération du panier actif, du token session et code promo</span>
        <span style="color: #2dd4bf;">Front React ➔ StoreContext</span>
      </div>
      <div style="background: #0f172a; border-left: 4px solid #d97706; padding: 8px 14px; font-size: 12px; display: flex; justify-content: space-between;">
        <span><b>3.</b> Requête HTTP POST /api/orders (Authorization: Bearer token, payload JSON)</span>
        <span style="color: #fbbf24;">StoreContext ➔ API Express</span>
      </div>
      <div style="background: #0f172a; border-left: 4px solid #e11d48; padding: 8px 14px; font-size: 12px; display: flex; justify-content: space-between;">
        <span><b>4.</b> Vérification authenticité jeton session & validation format des champs</span>
        <span style="color: #fb7185;">API Express (Middleware)</span>
      </div>
      <div style="background: #0f172a; border-left: 4px solid #7c3aed; padding: 8px 14px; font-size: 12px; display: flex; justify-content: space-between;">
        <span><b>5.</b> Transaction SQL : <code>START TRANSACTION</code> & Vérification stocks réels</span>
        <span style="color: #c084fc;">API Express ➔ MySQL pool</span>
      </div>
      <div style="background: #0f172a; border-left: 4px solid #7c3aed; padding: 8px 14px; font-size: 12px; display: flex; justify-content: space-between;">
        <span><b>6.</b> Insertion commande (<code>INSERT INTO orders</code>) & lignes d'articles (<code>order_items</code>)</span>
        <span style="color: #c084fc;">MySQL (InnoDB ACID)</span>
      </div>
      <div style="background: #0f172a; border-left: 4px solid #7c3aed; padding: 8px 14px; font-size: 12px; display: flex; justify-content: space-between;">
        <span><b>7.</b> Décrémentation atomique des stocks (<code>UPDATE products SET stock = stock - qty</code>) & <code>COMMIT</code></span>
        <span style="color: #c084fc;">MySQL</span>
      </div>
      <div style="background: #0f172a; border-left: 4px solid #e11d48; padding: 8px 14px; font-size: 12px; display: flex; justify-content: space-between;">
        <span><b>8.</b> Réponse HTTP 201 Created : <code>{ success: true, orderId: 42, total: 14200 }</code></span>
        <span style="color: #fb7185;">API Express ➔ Front React</span>
      </div>
      <div style="background: #0f172a; border-left: 4px solid #059669; padding: 8px 14px; font-size: 12px; display: flex; justify-content: space-between;">
        <span><b>9.</b> Purge du panier local (<code>setCart([])</code>) et redirection vers Mon Compte / Commandes</span>
        <span style="color: #34d399;">Front React ➔ Client</span>
      </div>
    </div>

    <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 10px 16px; font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between;">
      <span>🔒 <b>Garantie de Sécurité :</b> Recalcul intégral des montants côté serveur (anti-falsification du prix client).</span>
      <span>⚡ <b>Temps d'exécution mesuré :</b> 215 ms (Round-trip complet).</span>
    </div>
  </div>
`;

// 5. Diagramme de Classes Métier UML
const umlClassDiagramHtml = `
  <div class="header">
    <div>
      <div class="title">FIGURE 3.1-C : DIAGRAMME DE CLASSES MÉTIER (UML CLASS DIAGRAM)</div>
      <div class="subtitle">Modélisation orientée objet des entités métier, attributs typés et associations</div>
    </div>
    <div class="badge">CLASSES UML</div>
  </div>
  <div class="content" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; font-size: 11px;">
    <!-- Classe User -->
    <div style="background: #0f172a; border: 1px solid #38bdf8; border-radius: 8px; overflow: hidden;">
      <div style="background: #0284c7; color: white; padding: 6px 10px; font-weight: 700; text-align: center;">User</div>
      <div style="padding: 8px; line-height: 1.5; border-bottom: 1px solid #334155;">
        + id : int [PK]<br>
        + name : string<br>
        + email : string [UQ]<br>
        + password_hash : string<br>
        + phone : string<br>
        + role : enum('user','admin')<br>
        + created_at : datetime
      </div>
      <div style="padding: 8px; line-height: 1.5; color: #38bdf8;">
        + verifyPassword(pwd): bool<br>
        + getOrders(): List&lt;Order&gt;<br>
        + getAddresses(): List&lt;Address&gt;
      </div>
    </div>

    <!-- Classe Product -->
    <div style="background: #0f172a; border: 1px solid #2dd4bf; border-radius: 8px; overflow: hidden;">
      <div style="background: #0d9488; color: white; padding: 6px 10px; font-weight: 700; text-align: center;">Product</div>
      <div style="padding: 8px; line-height: 1.5; border-bottom: 1px solid #334155;">
        + id : int [PK]<br>
        + name : string<br>
        + brand : string<br>
        + category : string<br>
        + price : decimal<br>
        + stock : int<br>
        + colors : string<br>
        + storages : string<br>
        + image_url : string
      </div>
      <div style="padding: 8px; line-height: 1.5; color: #2dd4bf;">
        + isAvailable(qty): bool<br>
        + decrementStock(qty): void<br>
        + getReviews(): List&lt;Review&gt;
      </div>
    </div>

    <!-- Classe Order -->
    <div style="background: #0f172a; border: 1px solid #f59e0b; border-radius: 8px; overflow: hidden;">
      <div style="background: #d97706; color: white; padding: 6px 10px; font-weight: 700; text-align: center;">Order</div>
      <div style="padding: 8px; line-height: 1.5; border-bottom: 1px solid #334155;">
        + id : int [PK]<br>
        + user_id : int [FK]<br>
        + full_name : string<br>
        + phone : string<br>
        + address : string<br>
        + city : string<br>
        + payment_method : string<br>
        + total : decimal<br>
        + status : enum
      </div>
      <div style="padding: 8px; line-height: 1.5; color: #fbbf24;">
        + calculateTotal(): decimal<br>
        + updateStatus(stat): void<br>
        + getItems(): List&lt;OrderItem&gt;
      </div>
    </div>

    <!-- Classe OrderItem -->
    <div style="background: #0f172a; border: 1px solid #f43f5e; border-radius: 8px; overflow: hidden;">
      <div style="background: #e11d48; color: white; padding: 6px 10px; font-weight: 700; text-align: center;">OrderItem</div>
      <div style="padding: 8px; line-height: 1.5; border-bottom: 1px solid #334155;">
        + id : int [PK]<br>
        + order_id : int [FK]<br>
        + product_id : int [FK]<br>
        + price : decimal<br>
        + quantity : int<br>
        + color : string<br>
        + storage : string
      </div>
      <div style="padding: 8px; line-height: 1.5; color: #fb7185;">
        + getLineTotal(): decimal<br>
        + getProduct(): Product
      </div>
    </div>

    <!-- LIGNE 2 -->
    <!-- Classe Address -->
    <div style="background: #0f172a; border: 1px solid #8b5cf6; border-radius: 8px; overflow: hidden;">
      <div style="background: #7c3aed; color: white; padding: 6px 10px; font-weight: 700; text-align: center;">Address</div>
      <div style="padding: 8px; line-height: 1.5; border-bottom: 1px solid #334155;">
        + id : int [PK]<br>
        + user_id : int [FK]<br>
        + label : string<br>
        + full_name : string<br>
        + phone : string<br>
        + address : string<br>
        + city : string<br>
        + postal_code : string
      </div>
      <div style="padding: 8px; line-height: 1.5; color: #a78bfa;">
        + getFormatted(): string
      </div>
    </div>

    <!-- Classe Favorite -->
    <div style="background: #0f172a; border: 1px solid #ec4899; border-radius: 8px; overflow: hidden;">
      <div style="background: #db2777; color: white; padding: 6px 10px; font-weight: 700; text-align: center;">Favorite</div>
      <div style="padding: 8px; line-height: 1.5; border-bottom: 1px solid #334155;">
        + id : int [PK]<br>
        + user_id : int [FK]<br>
        + product_id : int [FK]<br>
        + created_at : datetime
      </div>
      <div style="padding: 8px; line-height: 1.5; color: #f472b6;">
        + getProduct(): Product<br>
        + getUser(): User
      </div>
    </div>

    <!-- Classe Review -->
    <div style="background: #0f172a; border: 1px solid #10b981; border-radius: 8px; overflow: hidden;">
      <div style="background: #059669; color: white; padding: 6px 10px; font-weight: 700; text-align: center;">Review</div>
      <div style="padding: 8px; line-height: 1.5; border-bottom: 1px solid #334155;">
        + id : int [PK]<br>
        + product_id : int [FK]<br>
        + user_name : string<br>
        + rating : int (1..5)<br>
        + comment : text<br>
        + created_at : datetime
      </div>
      <div style="padding: 8px; line-height: 1.5; color: #34d399;">
        + validateRating(): bool
      </div>
    </div>

    <!-- Classe Promo & Session -->
    <div style="background: #0f172a; border: 1px solid #64748b; border-radius: 8px; overflow: hidden;">
      <div style="background: #475569; color: white; padding: 6px 10px; font-weight: 700; text-align: center;">Promo / Session</div>
      <div style="padding: 8px; line-height: 1.5; border-bottom: 1px solid #334155;">
        <b>Promo:</b> code, discount, active<br>
        <b>Session:</b> token (64 char), user_id<br>
        <b>Message:</b> name, email, msg
      </div>
      <div style="padding: 8px; line-height: 1.5; color: #94a3b8;">
        + applyDiscount(tot): decimal<br>
        + isSessionValid(): bool
      </div>
    </div>
  </div>
`;

// 6. Modèle Physique de Données (MCD / MPD - Schéma Relationnel 10 tables)
const mcdRelationalSchemaHtml = `
  <div class="header">
    <div>
      <div class="title">FIGURE 3.1-D : SCHÉMA RELATIONNEL DE LA BASE DE DONNÉES (MCD / MPD)</div>
      <div class="subtitle">Base de données MySQL « phone_store » : 10 tables normalisées 3FN et clés d'intégrité</div>
    </div>
    <div class="badge">SGBD MYSQL 8.0 • 10 TABLES</div>
  </div>
  <div class="content" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; font-size: 11px;">
    <!-- 1. users -->
    <div style="background: #0f172a; border: 2px solid #38bdf8; border-radius: 8px; overflow: hidden;">
      <div style="background: #0284c7; color: white; padding: 6px 8px; font-weight: 700; font-size: 12px;">users</div>
      <div style="padding: 6px; line-height: 1.5;">
        <b style="color: #38bdf8;">🔑 id</b> : INT PK AI<br>
        name : VARCHAR(100)<br>
        <b>email</b> : VARCHAR(150) UQ<br>
        password : VARCHAR(255)<br>
        phone : VARCHAR(30)<br>
        role : ENUM('user','admin')<br>
        created_at : TIMESTAMP
      </div>
    </div>

    <!-- 2. sessions -->
    <div style="background: #0f172a; border: 1px solid #475569; border-radius: 8px; overflow: hidden;">
      <div style="background: #334155; color: white; padding: 6px 8px; font-weight: 700; font-size: 12px;">sessions</div>
      <div style="padding: 6px; line-height: 1.5;">
        <b style="color: #38bdf8;">🔑 id</b> : INT PK AI<br>
        <span style="color: #f59e0b;">🔗 user_id</span> : INT [FK]<br>
        token : VARCHAR(64) UQ<br>
        created_at : TIMESTAMP<br>
        <i style="color: #94a3b8; font-size: 10px;">CASCADE on users</i>
      </div>
    </div>

    <!-- 3. products -->
    <div style="background: #0f172a; border: 2px solid #2dd4bf; border-radius: 8px; overflow: hidden;">
      <div style="background: #0d9488; color: white; padding: 6px 8px; font-weight: 700; font-size: 12px;">products</div>
      <div style="padding: 6px; line-height: 1.5;">
        <b style="color: #2dd4bf;">🔑 id</b> : INT PK AI<br>
        name : VARCHAR(150)<br>
        brand : VARCHAR(50)<br>
        category : ENUM<br>
        price : DECIMAL(10,2)<br>
        old_price : DECIMAL(10,2)<br>
        stock : INT<br>
        colors, storages : TEXT<br>
        image_url : VARCHAR(255)
      </div>
    </div>

    <!-- 4. orders -->
    <div style="background: #0f172a; border: 2px solid #f59e0b; border-radius: 8px; overflow: hidden;">
      <div style="background: #d97706; color: white; padding: 6px 8px; font-weight: 700; font-size: 12px;">orders</div>
      <div style="padding: 6px; line-height: 1.5;">
        <b style="color: #fbbf24;">🔑 id</b> : INT PK AI<br>
        <span style="color: #38bdf8;">🔗 user_id</span> : INT [FK]<br>
        full_name : VARCHAR(100)<br>
        phone, city : VARCHAR<br>
        address : TEXT<br>
        payment_method : VARCHAR<br>
        total : DECIMAL(10,2)<br>
        status : ENUM
      </div>
    </div>

    <!-- 5. order_items -->
    <div style="background: #0f172a; border: 2px solid #f43f5e; border-radius: 8px; overflow: hidden;">
      <div style="background: #e11d48; color: white; padding: 6px 8px; font-weight: 700; font-size: 12px;">order_items</div>
      <div style="padding: 6px; line-height: 1.5;">
        <b style="color: #fb7185;">🔑 id</b> : INT PK AI<br>
        <span style="color: #fbbf24;">🔗 order_id</span> : INT [FK]<br>
        <span style="color: #2dd4bf;">🔗 product_id</span> : INT [FK]<br>
        price : DECIMAL(10,2)<br>
        quantity : INT<br>
        color, storage : VARCHAR<br>
        <i style="color: #94a3b8; font-size: 10px;">CASCADE on orders</i>
      </div>
    </div>

    <!-- 6. addresses -->
    <div style="background: #0f172a; border: 1px solid #8b5cf6; border-radius: 8px; overflow: hidden;">
      <div style="background: #7c3aed; color: white; padding: 6px 8px; font-weight: 700; font-size: 12px;">addresses</div>
      <div style="padding: 6px; line-height: 1.5;">
        <b style="color: #a78bfa;">🔑 id</b> : INT PK AI<br>
        <span style="color: #38bdf8;">🔗 user_id</span> : INT [FK]<br>
        label, full_name : VARCHAR<br>
        phone, city, postal : VARCHAR<br>
        address : TEXT<br>
        <i style="color: #94a3b8; font-size: 10px;">CASCADE on users</i>
      </div>
    </div>

    <!-- 7. favorites -->
    <div style="background: #0f172a; border: 1px solid #ec4899; border-radius: 8px; overflow: hidden;">
      <div style="background: #db2777; color: white; padding: 6px 8px; font-weight: 700; font-size: 12px;">favorites</div>
      <div style="padding: 6px; line-height: 1.5;">
        <b style="color: #f472b6;">🔑 id</b> : INT PK AI<br>
        <span style="color: #38bdf8;">🔗 user_id</span> : INT [FK]<br>
        <span style="color: #2dd4bf;">🔗 product_id</span> : INT [FK]<br>
        created_at : TIMESTAMP<br>
        <i style="color: #94a3b8; font-size: 10px;">Jointure Admin KPIs</i>
      </div>
    </div>

    <!-- 8. reviews -->
    <div style="background: #0f172a; border: 1px solid #10b981; border-radius: 8px; overflow: hidden;">
      <div style="background: #059669; color: white; padding: 6px 8px; font-weight: 700; font-size: 12px;">reviews</div>
      <div style="padding: 6px; line-height: 1.5;">
        <b style="color: #34d399;">🔑 id</b> : INT PK AI<br>
        <span style="color: #2dd4bf;">🔗 product_id</span> : INT [FK]<br>
        user_name : VARCHAR(100)<br>
        rating : TINYINT (1-5)<br>
        comment : TEXT<br>
        created_at : TIMESTAMP
      </div>
    </div>

    <!-- 9. promos -->
    <div style="background: #0f172a; border: 1px solid #64748b; border-radius: 8px; overflow: hidden;">
      <div style="background: #475569; color: white; padding: 6px 8px; font-weight: 700; font-size: 12px;">promos</div>
      <div style="padding: 6px; line-height: 1.5;">
        <b style="color: #cbd5e1;">🔑 id</b> : INT PK AI<br>
        code : VARCHAR(30) UQ<br>
        discount_percent : INT<br>
        active : TINYINT(1)<br>
        expiry_date : DATE
      </div>
    </div>

    <!-- 10. messages -->
    <div style="background: #0f172a; border: 1px solid #64748b; border-radius: 8px; overflow: hidden;">
      <div style="background: #475569; color: white; padding: 6px 8px; font-weight: 700; font-size: 12px;">messages</div>
      <div style="padding: 6px; line-height: 1.5;">
        <b style="color: #cbd5e1;">🔑 id</b> : INT PK AI<br>
        name, email : VARCHAR<br>
        phone, subject : VARCHAR<br>
        message : TEXT<br>
        created_at : TIMESTAMP
      </div>
    </div>
  </div>
`;

console.log("Generating 6 high-res Conception & Architecture diagrams...");
renderAndCapture(architecture3TiersHtml, 'architecture_3tiers', 1400, 850);
renderAndCapture(ganttHtml, 'diagramme_gantt', 1400, 800);
renderAndCapture(umlUseCaseHtml, 'uml_use_case', 1400, 850);
renderAndCapture(umlSequenceHtml, 'uml_sequence_order', 1400, 850);
renderAndCapture(umlClassDiagramHtml, 'uml_class_diagram', 1400, 850);
renderAndCapture(mcdRelationalSchemaHtml, 'mcd_relational_schema', 1400, 850);

console.log("All 6 diagrams generated successfully in screenshots/!");
