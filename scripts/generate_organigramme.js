import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const SCREENSHOTS_DIR = path.resolve('screenshots');
const OUT_FILE = path.join(SCREENSHOTS_DIR, 'organigramme_expressor.png');
const TEMP_HTML = path.resolve('scripts/temp_organigramme.html');

const width = 1800;
const height = 1050;

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Organigramme EXPRESSOR</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: ${width}px;
    height: ${height}px;
    background: #ffffff;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    color: #1e293b;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 35px 45px;
    overflow: hidden;
  }
  .container {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border: 2px solid #cbd5e1;
    border-radius: 16px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
    padding: 30px 40px;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 18px;
    margin-bottom: 26px;
  }
  .brand-area {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .logo-box {
    background: #0f172a;
    color: #ffffff;
    font-weight: 900;
    font-size: 20px;
    padding: 8px 16px;
    border-radius: 8px;
    letter-spacing: 1px;
  }
  .logo-box span { color: #f59e0b; }
  .title-area h1 {
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.3px;
  }
  .title-area p {
    font-size: 13px;
    color: #64748b;
    margin-top: 3px;
    font-weight: 500;
  }
  .badge {
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    color: #0f766e;
    font-weight: 700;
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 20px;
  }

  /* TREE STRUCTURE */
  .tree-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    position: relative;
  }

  /* TOP BOX (DIRECTION) */
  .top-box {
    background: linear-gradient(135deg, #1e3a8a, #0284c7);
    color: #ffffff;
    border-radius: 14px;
    padding: 18px 36px;
    text-align: center;
    box-shadow: 0 12px 20px -5px rgba(2, 132, 199, 0.35);
    border: 2px solid #38bdf8;
    min-width: 460px;
    z-index: 2;
  }
  .top-role {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 700;
    color: #bae6fd;
    margin-bottom: 4px;
  }
  .top-name {
    font-size: 21px;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 0.5px;
  }
  .top-desc {
    font-size: 12px;
    color: #e0f2fe;
    margin-top: 6px;
    font-weight: 500;
  }

  /* CONNECTORS */
  .v-line-top {
    width: 3px;
    height: 30px;
    background: #0284c7;
  }
  .h-line-bar {
    width: 82%;
    height: 3px;
    background: #cbd5e1;
    position: relative;
  }
  .v-branch {
    position: absolute;
    top: 0;
    width: 3px;
    height: 32px;
    background: #cbd5e1;
  }
  .v-b1 { left: 0%; }
  .v-b2 { left: 33.33%; background: #0d9488; height: 35px; width: 3px; }
  .v-b3 { left: 66.66%; }
  .v-b4 { left: 100%; }

  /* POLES GRID */
  .poles-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 22px;
    width: 100%;
    margin-top: 32px;
    flex: 1;
  }

  .pole-card {
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 18px 18px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
    position: relative;
  }
  .pole-card.highlight {
    background: #f0fdfa;
    border: 2px solid #0d9488;
    box-shadow: 0 10px 15px -3px rgba(13, 148, 136, 0.15);
  }

  .pole-header {
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 12px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .pole-card.highlight .pole-header {
    border-bottom-color: #99f6e4;
  }

  .pole-icon {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    flex-shrink: 0;
  }
  .icon-blue { background: #e0f2fe; color: #0284c7; }
  .icon-teal { background: #ccfbf1; color: #0f766e; }
  .icon-amber { background: #fef3c7; color: #d97706; }
  .icon-indigo { background: #e0e7ff; color: #4f46e5; }

  .pole-title {
    font-size: 14.5px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.25;
  }
  .pole-card.highlight .pole-title {
    color: #0f766e;
  }

  .manager-tag {
    background: #0f766e;
    color: #ffffff;
    font-size: 11.5px;
    font-weight: 700;
    padding: 5px 10px;
    border-radius: 6px;
    margin-bottom: 10px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .tasks-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 12.5px;
    color: #334155;
    flex: 1;
  }
  .tasks-list li {
    position: relative;
    padding-left: 18px;
    line-height: 1.35;
  }
  .tasks-list li::before {
    content: "•";
    position: absolute;
    left: 4px;
    color: #0284c7;
    font-weight: 900;
    font-size: 16px;
    line-height: 1;
  }
  .pole-card.highlight .tasks-list li::before {
    color: #0d9488;
  }

  .trainee-badge {
    margin-top: 10px;
    background: #e6fffa;
    border: 1px dashed #0d9488;
    color: #0f766e;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 11.5px;
    font-weight: 700;
    text-align: center;
  }

  /* FOOTER INFO */
  .footer-bar {
    margin-top: 18px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #64748b;
  }
  .footer-bar b { color: #0f172a; }
</style>
</head>
<body>
  <div class="container">
    <!-- HEADER -->
    <div class="header">
      <div class="brand-area">
        <div class="logo-box">EXPRESS<span>OR</span></div>
        <div class="title-area">
          <h1>ORGANIGRAMME DE LA SOCIÉTÉ EXPRESSOR S.A.R.L. AU</h1>
          <p>Structure Organisationnelle & Département d'Accueil : Pôle Technique & Systèmes d'Information</p>
        </div>
      </div>
      <div class="badge">FIGURE 1.1 · RAPPORT DE STAGE TECHNICIEN</div>
    </div>

    <!-- TREE -->
    <div class="tree-root">
      <!-- DIRECTION GENERALE -->
      <div class="top-box">
        <div class="top-role">Direction Générale & Gérance</div>
        <div class="top-name">M. Charaf-Eddine MLILI</div>
        <div class="top-desc">Directeur Général & Fondateur · Pilotage Stratégique, Juridique et Développement E-Commerce</div>
      </div>

      <!-- CONNECTOR -->
      <div class="v-line-top"></div>
      <div class="h-line-bar">
        <div class="v-branch v-b1"></div>
        <div class="v-branch v-b2"></div>
        <div class="v-branch v-b3"></div>
        <div class="v-branch v-b4"></div>
      </div>

      <!-- POLES -->
      <div class="poles-grid">
        <!-- 1. Administratif & Financier -->
        <div class="pole-card">
          <div class="pole-header">
            <div class="pole-icon icon-blue">💼</div>
            <div>
              <div class="pole-title">Pôle Administratif & Financier</div>
            </div>
          </div>
          <ul class="tasks-list">
            <li>Comptabilité générale & bilans financiers</li>
            <li>Gestion de la trésorerie et conformité légale</li>
            <li>Suivi administratif, fiscal (ICE, RC Oujda) & RH</li>
            <li>Contrats commerciaux et relations bancaires</li>
          </ul>
        </div>

        <!-- 2. Pôle Technique (HIGHLIGHT) -->
        <div class="pole-card highlight">
          <div class="pole-header">
            <div class="pole-icon icon-teal">💻</div>
            <div>
              <div class="pole-title">Pôle Technique & Systèmes d'Information</div>
            </div>
          </div>
          <div class="manager-tag">
            <span>Directeur :</span> <b>M. Charaf-Eddine MLILI</b>
          </div>
          <ul class="tasks-list">
            <li><b>Architecture Full-Stack :</b> React 19, Vite, Express</li>
            <li><b>Base de données :</b> MySQL 8.0, schéma 10 tables</li>
            <li><b>Cybersécurité :</b> Sessions, hachage scrypt, API REST</li>
            <li><b>Infrastructure :</b> VPS Linux, CI/CD, sauvegardes</li>
          </ul>
          <div class="trainee-badge">
            🎓 Accueil Stage Technicien · Génie Informatique
          </div>
        </div>

        <!-- 3. Pôle Commercial & Marketing -->
        <div class="pole-card">
          <div class="pole-header">
            <div class="pole-icon icon-amber">📱</div>
            <div>
              <div class="pole-title">Pôle Commercial & Marketing</div>
            </div>
          </div>
          <ul class="tasks-list">
            <li>Gestion du catalogue Smartphones & Accessoires</li>
            <li>Partenariats marques : Apple, Samsung, Xiaomi</li>
            <li>Politique de prix (DH), promos flash & bannières</li>
            <li>Marketing digital, acquisition & conversion</li>
          </ul>
        </div>

        <!-- 4. Pôle Logistique & SAV -->
        <div class="pole-card">
          <div class="pole-header">
            <div class="pole-icon icon-indigo">🚚</div>
            <div>
              <div class="pole-title">Pôle Logistique, Livraison & SAV</div>
            </div>
          </div>
          <ul class="tasks-list">
            <li>Préparation et expédition des commandes 24-48h</li>
            <li>Gestion des encaissements COD (Paiement livraison)</li>
            <li>Suivi des colis et hub logistique national</li>
            <li>Service après-vente (SAV) & garantie 1 an Expressor</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer-bar">
      <div><b>Société :</b> EXPRESSOR S.A.R.L. AU · Hay Ngadi, Oujda · RC N° 42505 · ICE : 003489213000074</div>
      <div><b>Période de Stage :</b> 2 Mois (Juillet – Août 2025) · École Polytechnique d'Agadir</div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(TEMP_HTML, html, 'utf8');

console.log('Rendering organigramme via Edge headless...');
const cmd = `"${EDGE}" --headless --disable-gpu "--screenshot=${OUT_FILE}" --window-size=${width},${height} "file://${TEMP_HTML.replace(/\\/g, '/')}"`;
execSync(cmd, { stdio: 'inherit' });

console.log(`Saved screenshot to: ${OUT_FILE}`);

// Also update image4.png in temp_docx/word/media so document is updated
const mediaPath = path.resolve('scripts/temp_docx/word/media/image4.png');
if (fs.existsSync(OUT_FILE)) {
  fs.copyFileSync(OUT_FILE, mediaPath);
  console.log(`Updated docx media image4.png with new organigramme!`);
}

// Copy to user Downloads for instant access
const downloadsCopy = 'C:\\Users\\JOKER\\Downloads\\Figure_1.1_Organigramme_EXPRESSOR_Charaf_Eddine_MLILI.png';
fs.copyFileSync(OUT_FILE, downloadsCopy);
console.log(`Exported direct image copy to: ${downloadsCopy}`);
