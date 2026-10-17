import fs from 'fs';
import path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  PageBreak,
  ShadingType
} from 'docx';

const SCREENSHOTS_DIR = path.resolve('screenshots');

// Helper to safely load image buffer
function getImageBuffer(fileName) {
  const p = path.join(SCREENSHOTS_DIR, fileName);
  if (fs.existsSync(p)) {
    return fs.readFileSync(p);
  }
  return null;
}

// Styling Constants
const FONT_FAMILY = 'Times New Roman';
const PRIMARY_COLOR = '1B365D'; // Universiapolis / Academic Navy
const SECONDARY_COLOR = '0F766E'; // Deep Cyan / Slate
const TEXT_COLOR = '1E293B';
const MUTED_COLOR = '64748B';
const BORDER_COLOR = 'CBD5E1';

// Helper generators
function createCoverPage() {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: "ROYAUME DU MAROC",
          bold: true,
          size: 22,
          font: FONT_FAMILY,
          color: PRIMARY_COLOR
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: "UNIVERSITÉ INTERNATIONALE D'AGADIR — UNIVERSIAPOLIS",
          bold: true,
          size: 24,
          font: FONT_FAMILY,
          color: PRIMARY_COLOR
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 300 },
      children: [
        new TextRun({
          text: "ÉCOLE POLYTECHNIQUE D'AGADIR",
          bold: true,
          size: 26,
          font: FONT_FAMILY,
          color: SECONDARY_COLOR
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Filière : Diplôme d'Ingénieur d'État en Génie Informatique",
          italics: true,
          size: 22,
          font: FONT_FAMILY
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 300 },
      children: [
        new TextRun({
          text: "RAPPORT DE STAGE TECHNICIEN",
          bold: true,
          size: 34,
          font: FONT_FAMILY,
          color: PRIMARY_COLOR
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 200 },
      children: [
        new TextRun({
          text: "THÈME DU PROJET :",
          bold: true,
          size: 22,
          font: FONT_FAMILY,
          color: MUTED_COLOR
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 400 },
      children: [
        new TextRun({
          text: "Conception et Développement d'une Plateforme E-Commerce Haute Disponibilité pour la Distribution de Matériel Téléphonique et High-Tech",
          bold: true,
          size: 28,
          font: FONT_FAMILY,
          color: PRIMARY_COLOR
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 300 },
      children: [
        new TextRun({
          text: "Organisme d'accueil : EXPRESSOR (SARL AU)",
          bold: true,
          size: 24,
          font: FONT_FAMILY,
          color: SECONDARY_COLOR
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 50, after: 400 },
      children: [
        new TextRun({
          text: "Siège social : Hay Ngadi Rue 21 N° 4, Oujda — RC 42505 · ICE 003489213000074",
          size: 19,
          italics: true,
          font: FONT_FAMILY,
          color: MUTED_COLOR
        })
      ]
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: "Élaboré par :", bold: true, size: 22, font: FONT_FAMILY }),
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: "Élève-Ingénieur en Génie Informatique", size: 21, font: FONT_FAMILY }),
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: "2ème Année Cycle Ingénieur", size: 20, italics: true, font: FONT_FAMILY }),
                  ]
                })
              ]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: "Encadrant Pédagogique :", bold: true, size: 22, font: FONT_FAMILY }),
                  ]
                }),
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: "M. El AISSAOUI Abdelaaziz", bold: true, size: 22, font: FONT_FAMILY, color: PRIMARY_COLOR }),
                  ]
                }),
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: "Professeur / Tuteur Académique", size: 20, italics: true, font: FONT_FAMILY }),
                  ]
                })
              ]
            })
          ]
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 100 },
      children: [
        new TextRun({
          text: "Année Universitaire : 2025 – 2026",
          bold: true,
          size: 22,
          font: FONT_FAMILY
        })
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

function createParagraph(text, options = {}) {
  const { bold = false, italics = false, size = 22, color = TEXT_COLOR, before = 120, after = 120, align = AlignmentType.BOTH } = options;
  return new Paragraph({
    alignment: align,
    spacing: { before, after, line: 320 },
    children: [
      new TextRun({
        text,
        bold,
        italics,
        size,
        color,
        font: FONT_FAMILY
      })
    ]
  });
}

function createHeading1(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 30,
        font: FONT_FAMILY,
        color: PRIMARY_COLOR
      })
    ]
  });
}

function createHeading2(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 140 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 25,
        font: FONT_FAMILY,
        color: SECONDARY_COLOR
      })
    ]
  });
}

function createHeading3(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 100 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 22,
        font: FONT_FAMILY,
        color: TEXT_COLOR
      })
    ]
  });
}

function createImageFigure(fileName, caption, figureNumber) {
  const imgBuffer = getImageBuffer(fileName);
  if (!imgBuffer) {
    return [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 140, after: 140 },
        children: [
          new TextRun({
            text: `[Image ${fileName} non disponible]`,
            italics: true,
            color: MUTED_COLOR,
            size: 20
          })
        ]
      })
    ];
  }

  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new ImageRun({
          data: imgBuffer,
          transformation: {
            width: 540,
            height: 338
          }
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 200 },
      children: [
        new TextRun({
          text: `Figure ${figureNumber} : `,
          bold: true,
          size: 19,
          font: FONT_FAMILY,
          color: PRIMARY_COLOR
        }),
        new TextRun({
          text: caption,
          italics: true,
          size: 19,
          font: FONT_FAMILY,
          color: TEXT_COLOR
        })
      ]
    })
  ];
}

async function buildDocument() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_FAMILY,
            size: 22,
            color: TEXT_COLOR
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "École Polytechnique d'Agadir — Universiapolis | Rapport de Stage Technicien",
                    size: 17,
                    italics: true,
                    color: MUTED_COLOR,
                    font: FONT_FAMILY
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "EXPRESSOR (SARL AU)  |  Page ",
                    size: 17,
                    color: MUTED_COLOR,
                    font: FONT_FAMILY
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 17,
                    bold: true,
                    color: PRIMARY_COLOR,
                    font: FONT_FAMILY
                  }),
                  new TextRun({
                    text: " sur ",
                    size: 17,
                    color: MUTED_COLOR,
                    font: FONT_FAMILY
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 17,
                    color: MUTED_COLOR,
                    font: FONT_FAMILY
                  })
                ]
              })
            ]
          })
        },
        children: [
          ...createCoverPage(),

          // DEDICACES & REMERCIEMENTS
          createHeading1("REMERCIEMENTS"),
          createParagraph("Au terme de ce stage de formation technique, je tiens tout d'abord à adresser mes remerciements les plus sincères à l'ensemble du corps professoral et administratif de l'École Polytechnique d'Agadir (Universiapolis), pour la qualité de l'encadrement académique et l'excellence de la pédagogie dispensée tout au long de notre cursus d'ingénieur."),
          createParagraph("J'exprime ma profonde gratitude à mon encadrant pédagogique, Monsieur El AISSAOUI Abdelaaziz, pour son écoute bienveillante, ses conseils méthodologiques avisés et son suivi rigoureux qui ont constitué un appui précieux dans la conduite et la structuration de ce travail."),
          createParagraph("Mes remerciements s'adressent tout particulièrement à la direction et à toute l'équipe de l'organisme d'accueil, la société EXPRESSOR (SARL AU) à Oujda, pour leur accueil chaleureux, leur confiance et pour avoir mis à ma disposition les moyens techniques et humains indispensables au bon déroulement de ma mission."),
          createParagraph("Enfin, que tous ceux qui ont contribué de près ou de loin à la réussite de ce projet trouvent ici le témoignage de ma reconnaissance sincère."),
          new Paragraph({ children: [new PageBreak()] }),

          // RESUME & ABSTRACT
          createHeading1("RÉSUMÉ"),
          createParagraph("Le présent rapport synthétise les travaux réalisés dans le cadre du stage technicien de deuxième année du cycle ingénieur en Génie Informatique au sein de la société EXPRESSOR (SARL AU), basée à Oujda. L'objectif fondamental de ce projet consiste en la conception et la mise en œuvre d'une plateforme web e-commerce moderne, réactive et sécurisée, dédiée à la commercialisation de téléphones intelligents haut de gamme, d'accessoires connectés et d'équipements technologiques."),
          createParagraph("Face aux exigences actuelles de fluidité et d'expérience utilisateur, l'architecture retenue repose sur une séparation claire entre la couche présentation et la couche logique d'affaires. Le front-end a été développé avec React 19 et Vite pour garantir des temps de rendu optimaux, tandis que le back-end s'appuie sur Node.js et Express couplé à une base de données relationnelle MySQL pour assurer la cohérence transactionnelle des commandes, des stocks et des profils utilisateurs."),
          createParagraph("Ce rapport détaille la démarche méthodologique adoptée, depuis l'étude du contexte et l'analyse fonctionnelle jusqu'à la modélisation UML, l'implémentation logicielle, le déploiement et la validation technique à travers des scénarios d'utilisation réels.", { after: 160 }),
          createParagraph("Mots-clés : E-Commerce, React 19, Node.js, Express, MySQL, Stage Technicien, EXPRESSOR, Universiapolis, Génie Informatique, Architecture Web.", { bold: true, size: 21 }),

          new Paragraph({ spacing: { before: 240, after: 120 }, children: [] }),

          createHeading1("ABSTRACT"),
          createParagraph("This report presents the technical engineering internship project conducted at EXPRESSOR (SARL AU), located in Oujda, Morocco. The core objective was to design and implement a modern, responsive, and robust e-commerce web platform dedicated to smartphones, mobile accessories, and high-tech equipment."),
          createParagraph("The technical stack leverages modern web architecture: a reactive front-end built with React 19 and Vite for optimal client-side rendering speed, coupled with a RESTful back-end powered by Node.js and Express. Relational data persistence and transaction integrity are managed through a structured MySQL database."),
          createParagraph("This document covers the end-to-end engineering cycle: business context exploration, functional and technical requirements analysis, UML modeling, database schema definition, security and authentication enforcement, as well as comprehensive interface development and functional verification.", { after: 160 }),
          createParagraph("Keywords : E-Commerce Platform, Full-Stack Development, React 19, Express, MySQL, Engineering Internship, EXPRESSOR, Universiapolis, Software Engineering.", { bold: true, size: 21 }),
          new Paragraph({ children: [new PageBreak()] }),

          // LISTE DES SIGLES ET ABREVIATIONS
          createHeading1("LISTE DES SIGLES ET ABRÉVIATIONS"),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: BORDER_COLOR },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [createParagraph("Sigle", { bold: true, color: PRIMARY_COLOR })] }),
                  new TableCell({ width: { size: 75, type: WidthType.PERCENTAGE }, children: [createParagraph("Signification & Contexte", { bold: true, color: PRIMARY_COLOR })] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("API", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Application Programming Interface (Interface de programmation)")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("ICE", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Identifiant Commun de l'Entreprise (Registre fiscal marocain)")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("JWT", { bold: true })] }),
                  new TableCell({ children: [createParagraph("JSON Web Token (Format de jeton d'authentification sécurisé)")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("MCD", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Modèle Conceptuel de Données (Méthode Merise)")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("MPD", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Modèle Physique de Données")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("MVC", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Modèle - Vue - Contrôleur (Patron d'architecture logicielle)")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("RC", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Registre du Commerce (Tribunal de Commerce d'Oujda)")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("REST", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Representational State Transfer (Architecture logicielle web)")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("SARL AU", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Société à Responsabilité Limitée à Associé Unique")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("SPA", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Single Page Application (Application Web monopage)")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("UI / UX", { bold: true })] }),
                  new TableCell({ children: [createParagraph("User Interface / User Experience (Interface et Expérience Utilisateur)")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("UML", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Unified Modeling Language (Langage de modélisation unifié)")] }),
                ]
              })
            ]
          }),
          new Paragraph({ children: [new PageBreak()] }),

          // TABLE DES MATIERES
          createHeading1("TABLE DES MATIÈRES"),
          createParagraph("INTRODUCTION GÉNÉRALE ............................................................................................ 1", { bold: true }),
          createParagraph("CHAPITRE 1 : CONTEXTE GÉNÉRAL ET ORGANISME D'ACCUEIL .......................... 3", { bold: true }),
          createParagraph("  1.1 Présentation de l'Organisme d'Accueil (EXPRESSOR SARL AU) ............................. 3"),
          createParagraph("  1.2 Fiche Signalétique et Renseignements Juridiques ...................................................... 4"),
          createParagraph("  1.3 Contexte Économique et Opportunité Stratégique .................................................... 5"),
          createParagraph("  1.4 Problématique et Objectifs Assignés au Projet ........................................................... 6"),
          createParagraph("CHAPITRE 2 : ANALYSE DES BESOINS ET SPÉCIFICATIONS ................................... 8", { bold: true }),
          createParagraph("  2.1 Étude Préalable et Délimitation du Périmètre .......................................................... 8"),
          createParagraph("  2.2 Spécification des Besoins Fonctionnels ...................................................................... 9"),
          createParagraph("  2.3 Spécification des Exigences Non-Fonctionnelles ....................................................... 11"),
          createParagraph("  2.4 Identification des Acteurs du Système ....................................................................... 12"),
          createParagraph("CHAPITRE 3 : CONCEPTION ET MODÉLISATION DU SYSTÈME ............................. 14", { bold: true }),
          createParagraph("  3.1 Choix Méthodologique et Approche de Conception .................................................. 14"),
          createParagraph("  3.2 Diagrammes des Cas d'Utilisation (UML) .................................................................. 15"),
          createParagraph("  3.3 Modèle Conceptuel et Schéma Relationnel des Données (MySQL) ........................... 17"),
          createParagraph("  3.4 Architecture Globale et Flux de Données .................................................................. 19"),
          createParagraph("CHAPITRE 4 : RÉALISATION, IMPLÉMENTATION ET RÉSULTATS VISUELS ......... 21", { bold: true }),
          createParagraph("  4.1 Environnement et Stack Technologique Retenue .................................................... 21"),
          createParagraph("  4.2 Implémentation du Back-End et API RESTful ........................................................... 23"),
          createParagraph("  4.3 Conception de l'Interface Utilisateur (Front-End React 19) ...................................... 25"),
          createParagraph("  4.4 Présentation Détaillée des Écrans et Fonctionnalités Réalisées ............................... 27"),
          createParagraph("      - Figure 1 : Accueil et Bannière Hero (EXPRESSOR) ............................................. 27"),
          createParagraph("      - Figure 2 : Catalogue des Smartphones et Filtres .............................................. 29"),
          createParagraph("      - Figure 3 : Fiche Produit Détaillée et Options .................................................... 31"),
          createParagraph("      - Figure 4 : Rayon Accessoires et Connectique ..................................................... 33"),
          createParagraph("      - Figure 5 : Gestion du Panier et Codes Promotionnels ....................................... 35"),
          createParagraph("      - Figure 6 : Module d'Authentification et Sécurité ............................................. 37"),
          createParagraph("      - Figure 7 : Formulaire de Contact et Support ................................................... 39"),
          createParagraph("      - Figure 8 : Console d'Administration et Métriques .............................................. 41"),
          createParagraph("CONCLUSION GÉNÉRALE ET BILAN PERSONNEL .................................................. 43", { bold: true }),
          createParagraph("RÉFÉRENCES ET WEBOGRAPHIE ................................................................................. 45", { bold: true }),
          createParagraph("ANNEXES ............................................................................................................................ 46", { bold: true }),
          new Paragraph({ children: [new PageBreak()] }),

          // LISTE DES FIGURES
          createHeading1("LISTE DES FIGURES ET TABLEAUX"),
          createParagraph("Figure 1 : Interface d'Accueil et Bannière Hero (EXPRESSOR Store) .............................. 27", { italics: true }),
          createParagraph("Figure 2 : Catalogue Interactif des Smartphones et Filtrage Dynamique .......................... 29", { italics: true }),
          createParagraph("Figure 3 : Fiche Produit Détaillée avec Sélecteur de Couleurs et Capacités .................... 31", { italics: true }),
          createParagraph("Figure 4 : Section Dédiée aux Accessoires et Objets Connectés ........................................ 33", { italics: true }),
          createParagraph("Figure 5 : Panier d'Achat Interactif et Module de Validation Promo .............................. 35", { italics: true }),
          createParagraph("Figure 6 : Module d'Authentification Sécurisée (Connexion / Inscription) ...................... 37", { italics: true }),
          createParagraph("Figure 7 : Formulaire de Contact et Envoi de Messages au Service Client ...................... 39", { italics: true }),
          createParagraph("Figure 8 : Console d'Administration des Produits, Stocks et Statistiques ......................... 41", { italics: true }),
          createParagraph("Tableau 1 : Fiche Signalétique de la Société EXPRESSOR (SARL AU) ......................... 4", { italics: true }),
          createParagraph("Tableau 2 : Matrice des Rôles et Droits d'Accès de la Plateforme ................................. 13", { italics: true }),
          createParagraph("Tableau 3 : Description des Entités du Schéma Relationnel MySQL ............................ 18", { italics: true }),
          new Paragraph({ children: [new PageBreak()] }),

          // INTRODUCTION GENERALE
          createHeading1("INTRODUCTION GÉNÉRALE"),
          createParagraph("Le commerce électronique connaît une expansion sans précédent à l'échelle internationale et nationale. Au Maroc, la transition numérique des entreprises commerciales s'est considérablement accélérée, soutenue par l'adoption généralisée des smartphones, l'essor des solutions de paiement digital et l'évolution des habitudes de consommation des citoyens."),
          createParagraph("Dans ce contexte hautement concurrentiel, les entreprises de distribution doivent impérativement dépasser les modèles de vente physique traditionnels pour s'équiper de canaux numériques omnicanaux, fiables et attractifs. Un site e-commerce ne se limite plus à une simple vitrine d'articles ; il constitue un écosystème logiciel complexe devant garantir une haute disponibilité, une rapidité d'affichage optimale, une navigation intuitive et une sécurité irréprochable des transactions."),
          createParagraph("C'est dans cette perspective stratégique que s'inscrit le stage de technicien effectué au sein de la société EXPRESSOR (SARL AU), entreprise spécialisée dans le commerce et la distribution d'équipements technologiques et de matériel téléphonique, domiciliée à Oujda."),
          createParagraph("La mission principale qui m'a été confiée a porté sur l'analyse, la conception architecturale et le développement complet d'une plateforme web e-commerce de nouvelle génération. Le projet vise à doter EXPRESSOR d'un outil technologique robuste permettant d'exposer son catalogue de smartphones et d'accessoires, de digitaliser le cycle de commande client, et d'optimiser le suivi des stocks et des indicateurs de ventes."),
          createParagraph("Le présent mémoire rend compte des différentes phases de ce travail d'ingénierie et s'articule autour de quatre grands chapitres :"),
          createParagraph("• Le premier chapitre situe le cadre du stage en décrivant l'organisme d'accueil EXPRESSOR, ses caractéristiques juridiques, son secteur d'activité ainsi que la problématique industrielle ayant motivé le projet."),
          createParagraph("• Le deuxième chapitre expose l'analyse fonctionnelle et technique du cahier des charges, formalisant les besoins des utilisateurs et les exigences non-fonctionnelles du système."),
          createParagraph("• Le troisième chapitre aborde la conception architecturale et la modélisation des données à travers le formalisme UML et le schéma relationnel sous MySQL."),
          createParagraph("• Le quatrième chapitre présente les choix techniques de développement (React 19, Node.js Express, MySQL), détaille l'implémentation et met en valeur les résultats visuels obtenus à l'aide de captures d'écran commentées."),
          new Paragraph({ children: [new PageBreak()] }),

          // CHAPITRE 1
          createHeading1("CHAPITRE 1 : CONTEXTE GÉNÉRAL ET ORGANISME D'ACCUEIL"),
          createHeading2("1.1 Présentation de l'Organisme d'Accueil : EXPRESSOR"),
          createParagraph("La société EXPRESSOR est une structure commerciale dynamique constituée sous la forme d'une Société à Responsabilité Limitée à Associé Unique (SARL AU). Implantée dans la ville d'Oujda, au cœur de la région de l'Oriental, l'entreprise opère dans le secteur de la distribution, de la commercialisation et du service après-vente d'appareils de télécommunication, de téléphones portables intelligents, d'accessoires de protection et d'équipements high-tech connectés."),
          createParagraph("Depuis sa fondation, EXPRESSOR s'attache à proposer à sa clientèle des produits authentiques issus des plus grands constructeurs mondiaux (Apple, Samsung, Xiaomi, Oppo, Anker, Spigen) en combinant conseil personnalisé, garanties constructeur et réactivité du service client."),

          createHeading2("1.2 Fiche Signalétique et Informations Juridiques"),
          createParagraph("Conformément aux documents légaux d'immatriculation d'EXPRESSOR (notamment le certificat d'immatriculation au Registre du Commerce d'Oujda), les renseignements légaux de l'entreprise s'établissent comme suit :"),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: PRIMARY_COLOR },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: PRIMARY_COLOR },
              left: { style: BorderStyle.SINGLE, size: 4, color: PRIMARY_COLOR },
              right: { style: BorderStyle.SINGLE, size: 4, color: PRIMARY_COLOR },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: BORDER_COLOR },
              insideVertical: { style: BorderStyle.SINGLE, size: 2, color: BORDER_COLOR },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, children: [createParagraph("Dénomination Sociale", { bold: true })] }),
                  new TableCell({ width: { size: 60, type: WidthType.PERCENTAGE }, children: [createParagraph("EXPRESSOR", { bold: true, color: PRIMARY_COLOR })] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("Forme Juridique", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Société à Responsabilité Limitée à Associé Unique (SARL AU)")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("Siège Social", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Hay Ngadi Rue 21 N° 4, Oujda, Maroc")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("Capital Social", { bold: true })] }),
                  new TableCell({ children: [createParagraph("100 000,00 MAD (Cent mille dirhams)")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("Numéro du Registre du Commerce (RC)", { bold: true })] }),
                  new TableCell({ children: [createParagraph("42505 (Tribunal de Commerce d'Oujda)")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("Identifiant Commun de l'Entreprise (ICE)", { bold: true })] }),
                  new TableCell({ children: [createParagraph("003489213000074")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("Secteur d'Activité", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Vente de téléphones, accessoires multimédia et solutions technologiques")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("Zone Géographique Couverte", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Région de l'Oriental et livraison nationale sur l'ensemble du territoire marocain")] }),
                ]
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 180 },
            children: [
              new TextRun({ text: "Tableau 1 : Fiche Signalétique de la Société EXPRESSOR (SARL AU)", italics: true, size: 19, color: MUTED_COLOR, font: FONT_FAMILY })
            ]
          }),

          createHeading2("1.3 Contexte Économique et Opportunité Stratégique"),
          createParagraph("Bien qu'implantée avec succès localement à Oujda, l'entreprise EXPRESSOR constatait les limites inhérentes au point de vente unique : zone de chalandise circonscrite géographiquement, horaires d'ouverture fixes, et difficulté à présenter l'intégralité d'un catalogue très fourni en constante rotation."),
          createParagraph("Le déploiement d'une solution numérique e-commerce répond à un triple enjeu stratégique :"),
          createParagraph("1. Élargissement du rayonnement commercial : Rendre le catalogue accessible 24h/24 et 7j/7 aux consommateurs de toutes les régions du Maroc."),
          createParagraph("2. Optimisation des processus de vente : Automatiser la prise de commande, la réservation de stock et la facturation tout en réduisant les erreurs de saisie manuelle."),
          createParagraph("3. Valorisation de l'image de marque : Offrir une vitrine digitale sophistiquée reflétant le caractère avant-gardiste et premium des produits high-tech distribués."),

          createHeading2("1.4 Problématique et Objectifs Assignés au Projet"),
          createParagraph("La problématique centrale de ce stage s'énonce ainsi : Comment concevoir et déployer une architecture logicielle web e-commerce performante, ergonomique et évolutive, capable de supporter un catalogue diversifié de produits technologiques tout en offrant une expérience utilisateur fluide et sécurisée ?"),
          createParagraph("Les objectifs opérationnels fixés pour ce stage comprenaient :"),
          createParagraph("• L'analyse rigoureuse des besoins fonctionnels du consommateur digital et des exigences de gestion des administrateurs."),
          createParagraph("• La modélisation conceptuelle de la base de données pour gérer avec exactitude les variantes de produits (modèles, coloris, capacités de stockage) et les commandes transactionnelles."),
          createParagraph("• Le développement d'une Single Page Application (SPA) réactive, moderne et épurée utilisant les dernières avancées de React 19."),
          createParagraph("• La conception d'un back-end RESTful modulaire avec Node.js / Express assurant la validation des données, le calcul des remises et la sécurité des accès."),
          createParagraph("• La création d'un tableau de bord administratif facilitant le pilotage des stocks, la consultation des revenus et l'édition des fiches articles."),
          new Paragraph({ children: [new PageBreak()] }),

          // CHAPITRE 2
          createHeading1("CHAPITRE 2 : ANALYSE DES BESOINS ET SPÉCIFICATIONS"),
          createHeading2("2.1 Étude Préalable et Délimitation du Périmètre"),
          createParagraph("Avant d'entamer l'implémentation logicielle, une phase approfondie d'analyse a été menée pour recueillir les attentes tant du point de vue des clients finaux que des gestionnaires de la société EXPRESSOR. La démarche s'est appuyée sur les principes du génie logiciel afin de formaliser un cahier des charges clair et hiérarchisé."),

          createHeading2("2.2 Spécification des Besoins Fonctionnels"),
          createParagraph("Les fonctionnalités du système sont découpées en plusieurs modules cohérents :"),
          createParagraph("A. Gestion du Catalogue et Consultation des Produits :", { bold: true }),
          createParagraph("• Affichage dynamique des produits répartis par catégories majeures (Smartphones, Accessoires, Promotions)."),
          createParagraph("• Filtrage instantané par marque (Apple, Samsung, Xiaomi, Oppo, etc.) et barre de recherche textuelle avec autocomplétion."),
          createParagraph("• Consultation détaillée d'un article : galerie visuelle, descriptif technique complet, avis clients certifiés, sélection dynamique de la couleur et de la capacité de stockage."),

          createParagraph("B. Parcours d'Achat et Gestion du Panier :", { bold: true }),
          createParagraph("• Ajout, modification de quantité et suppression d'articles au panier d'achat avec mise à jour immédiate du sous-total."),
          createParagraph("• Prise en charge des codes promotionnels (calcul automatique du taux de remise en pourcentage et déduction sur le total TTC)."),
          createParagraph("• Tunnel de commande épuré en plusieurs étapes : coordonnées de livraison, mode d'expédition, choix du moyen de paiement (carte bancaire, paiement à la livraison)."),

          createParagraph("C. Gestion des Comptes Utilisateurs et Authentification :", { bold: true }),
          createParagraph("• Inscription sécurisée et connexion avec persistance de session via jeton d'authentification."),
          createParagraph("• Espace client personnel permettant la consultation de l'historique des commandes, le suivi de statut et la gestion des adresses favorites."),

          createParagraph("D. Administration et Pilotage Commercial :", { bold: true }),
          createParagraph("• Console d'administration réservée aux gestionnaires habilités."),
          createParagraph("• Indicateurs clés de performance : chiffre d'affaires cumulé, volume de commandes actives, valeur globale de l'inventaire et panier moyen."),
          createParagraph("• Alertes de stock critique (détection proactive des produits dont le stock disponible est inférieur ou égal à 5 unités)."),
          createParagraph("• Formulaire de création et modification d'articles avec téléversement immédiat de médias visuels."),

          createHeading2("2.3 Spécification des Exigences Non-Fonctionnelles"),
          createParagraph("Pour garantir un niveau de qualité de service optimal, le système doit satisfaire aux contraintes non-fonctionnelles suivantes :"),
          createParagraph("• Ergonomie et Responsivité (UI/UX) : L'interface doit s'adapter harmonieusement à toutes les résolutions d'écran (mobiles, tablettes, moniteurs haute définition) selon les règles du Responsive Web Design."),
          createParagraph("• Performance et Temps de Réponse : Les temps de chargement initiaux et les transitions de page ne doivent pas excéder quelques centaines de millisecondes grâce au bundler Vite et au rendu optimisé de React 19."),
          createParagraph("• Intégrité et Cohérence des Données : Les opérations critiques comme la validation d'une commande doivent être exécutées dans des transactions ACID strictes afin d'empêcher les surventes de stocks concurrentes."),
          createParagraph("• Sécurité Applicative : Chiffrement salé des mots de passe (algorithme Scrypt), filtrage préventif contre les injections SQL via requêtes paramétrées, et validation systématique des schémas de requêtes entrantes."),
          new Paragraph({ children: [new PageBreak()] }),

          // CHAPITRE 3
          createHeading1("CHAPITRE 3 : CONCEPTION ET MODÉLISATION DU SYSTÈME"),
          createHeading2("3.1 Choix Méthodologique et Approche de Conception"),
          createParagraph("Pour modéliser la structure de l'application et la dynamique de ses composants, nous avons opté pour le langage UML (Unified Modeling Language), standard de référence en génie logiciel, combiné à l'approche relationnelle pour la conception de la base de données MySQL."),

          createHeading2("3.2 Diagrammes des Cas d'Utilisation (UML)"),
          createParagraph("Le système distingue trois profils d'acteurs principaux interagissant avec la plateforme :"),
          createParagraph("• Le Visiteur (Client non connecté) : Peut explorer le catalogue, appliquer des filtres, consulter les fiches produits, remplir son panier et initier une inscription."),
          createParagraph("• Le Client Authentifié : Bénéficie de l'ensemble des prérogatives du visiteur, auxquelles s'ajoutent la validation de commandes, l'accès au tableau de bord personnel, la rédaction d'avis notés et la gestion de ses adresses de livraison."),
          createParagraph("• L'Administrateur : Dispose des privilèges complets pour ajouter, modifier ou désactiver des produits, administrer les stocks, analyser les indicateurs de ventes et gérer le traitement des commandes."),

          createHeading2("3.3 Modèle Conceptuel et Schéma Relationnel des Données (MySQL)"),
          createParagraph("La persistance des données a été pensée pour préserver une normalisation en Troisième Forme Normale (3FN) tout en garantissant une extensibilité aisée. Les principales tables composant le schéma de données sous MySQL sont :"),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: SECONDARY_COLOR },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: SECONDARY_COLOR },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: BORDER_COLOR },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [createParagraph("Nom de la Table", { bold: true, color: SECONDARY_COLOR })] }),
                  new TableCell({ width: { size: 75, type: WidthType.PERCENTAGE }, children: [createParagraph("Rôle et Attributs Clés", { bold: true, color: SECONDARY_COLOR })] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("products", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Catalogue des articles : id, name, description, price, old_price, stock, category, brand, colors, storages, rating, image_url.")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("users", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Comptes utilisateurs : id, name, email, phone, password_hash, role (user/admin), created_at.")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("sessions", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Gestion des sessions actives : token, user_id, created_at.")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("orders", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Commandes passées : id, user_id, full_name, phone, address, city, payment_method, subtotal, discount, total, promo_code, status.")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("order_items", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Lignes de détail d'une commande : id, order_id, product_id, name, price, quantity, color, storage.")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("addresses", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Adresses de livraison enregistrées par les clients : id, user_id, label, full_name, phone, address, city, postal_code.")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("reviews", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Commentaires et notations étoiles : id, product_id, author, rating, comment, created_at.")] }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createParagraph("messages", { bold: true })] }),
                  new TableCell({ children: [createParagraph("Messages de contact reçus via le portail : id, name, email, subject, message, created_at.")] }),
                ]
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 180 },
            children: [
              new TextRun({ text: "Tableau 3 : Description des Entités du Schéma Relationnel MySQL", italics: true, size: 19, color: MUTED_COLOR, font: FONT_FAMILY })
            ]
          }),

          createHeading2("3.4 Architecture Globale et Flux de Données"),
          createParagraph("Le système adopte une architecture client-serveur découplée (Decoupled Client-Server Architecture) conforme aux meilleures pratiques du web moderne :"),
          createParagraph("1. Client SPA (Single Page Application) : Exécuté sur le navigateur du client, gérant l'état applicatif avec React Context API et assurant un routage instantané sans rechargement de page."),
          createParagraph("2. Serveur d'Application RESTful : Développé sous Node.js Express, il expose des points d'accès HTTP standardisés (/api/products, /api/orders, /api/auth, /api/admin/stats) et gère la logique métier."),
          createParagraph("3. Base de Données Relationnelle : Moteur MySQL garantissant l'intégrité référentielle par clés étrangères et l'isolation transactionnelle lors de la mise à jour des inventaires."),
          new Paragraph({ children: [new PageBreak()] }),

          // CHAPITRE 4
          createHeading1("CHAPITRE 4 : RÉALISATION, IMPLÉMENTATION ET RÉSULTATS VISUELS"),
          createHeading2("4.1 Environnement et Stack Technologique"),
          createParagraph("Le développement de la solution a mobilisé un ensemble d'outils modernes choisis pour leur robustesse et leur efficacité :"),
          createParagraph("• React 19 : Dernière version du framework de référence de Meta, apportant des gains notables de performances de rendu et une gestion réactive de l'état."),
          createParagraph("• Vite : Outil de bundling de nouvelle génération assurant un rechargement à chaud (Hot Module Replacement) ultra-rapide et une compilation de production optimisée."),
          createParagraph("• Node.js & Express 5 : Environnement d'exécution JavaScript côté serveur léger et performant, parfait pour le traitement de flux de données asynchrones."),
          createParagraph("• MySQL 8.0 & Driver mysql2/promise : Base de données relationnelle robuste supportant les transactions concurrentes complexes avec pool de connexions optimisé."),
          createParagraph("• Lucide React : Bibliothèque d'iconographie vectorielle épurée garantissant une identité visuelle moderne et cohérente."),

          createHeading2("4.2 Présentation Détaillée des Écrans et Fonctionnalités Réalisées"),
          createParagraph("Cette section présente les résultats concrets du développement à travers les captures d'écran réelles issues de l'environnement applicatif en fonctionnement."),

          // SCREENSHOT 1
          createHeading3("4.2.1 Page d'Accueil et Bannière Hero (EXPRESSOR)"),
          createParagraph("La page d'accueil plonge immédiatement l'utilisateur dans l'univers technologique haut de gamme d'EXPRESSOR. Elle arbore une bannière Hero sombre raffinée, mettant en avant le produit vedette, les garanties commerciales et les accès directs aux différentes sections."),
          ...createImageFigure("01_accueil.png", "Interface d'Accueil et Bannière Hero (EXPRESSOR Store)", "1"),
          createParagraph("Description détaillée et analyse technique de l'écran :", { bold: true, color: PRIMARY_COLOR, before: 140, after: 60 }),
          createParagraph("La page d'accueil constitue la vitrine d'entrée principale de la plateforme web. Elle a été spécialement élaborée autour d'un thème sombre immersif (#01040b) éliminant toute rupture lumineuse avec les visuels des smartphones. La barre de navigation supérieure intègre l'identité visuelle EXPRESSOR, les liens d'accès rapide aux catégories phares, une barre de recherche textuelle ainsi qu'un badge dynamique quantifiant les articles du panier en temps réel grâce à la Context API de React. La bannière Hero centrale valorise le modèle phare avec un appel à l'action immédiat (« Découvrir ») incitant l'utilisateur à explorer les caractéristiques de l'appareil. En pied de page, un bandeau de réassurance rappelle les engagements de la société : expédition sécurisée dans tout le Maroc, authenticité garantie constructeur et support réactif."),

          // SCREENSHOT 2
          createHeading3("4.2.2 Catalogue Interactif des Smartphones et Filtrage"),
          createParagraph("Le catalogue regroupe l'ensemble des smartphones disponibles chez EXPRESSOR. L'utilisateur peut filtrer les appareils par constructeur (Apple, Samsung, Xiaomi, Oppo, etc.) ou lancer une recherche par mot-clé."),
          ...createImageFigure("02_catalogue_smartphones.png", "Catalogue Interactif des Smartphones et Filtrage Dynamique", "2"),
          createParagraph("Description détaillée et analyse technique de l'écran :", { bold: true, color: PRIMARY_COLOR, before: 140, after: 60 }),
          createParagraph("Cet écran présente la grille réactive des téléphones portables. Les filtres par marque (Apple, Samsung, Xiaomi, Oppo, Realme) permettent d'isoler instantanément les gammes de produits sans aucun rechargement de page. Chaque vignette synthétise les données cruciales : visuel fidèle, marque, dénomination exacte, notation moyenne sur 5 étoiles calculée dynamiquement à partir des avis clients enregistrés en base, état du stock en temps réel et tarif en dirhams marocains (MAD) avec mise en évidence du prix barré pour les offres promotionnelles. Côté technique, le composant communique avec le point de terminaison REST « GET /api/products » avec paramètres de filtrage et intègre un mécanisme d'animation fluide CSS Grid adapté à toutes les résolutions d'écran."),

          // SCREENSHOT 3
          createHeading3("4.2.3 Fiche Produit Détaillée et Sélecteur d'Options"),
          createParagraph("La sélection d'un produit ouvre une page dédiée exposant toutes les spécifications techniques de l'appareil, les déclinaisons de finitions et les avis certifiés des clients."),
          ...createImageFigure("03_fiche_produit.png", "Fiche Produit Détaillée (Sélection de modèle, couleur et stockage)", "3"),
          createParagraph("Description détaillée et analyse technique de l'écran :", { bold: true, color: PRIMARY_COLOR, before: 140, after: 60 }),
          createParagraph("La fiche produit unitaire maximise la conversion en offrant une transparence totale sur les spécifications techniques de l'appareil. L'acheteur dispose d'un sélecteur interactif permettant de choisir sa finition de couleur préférée (Titane Naturel, Bleu Sidéral, Noir) et sa capacité de stockage (128 Go, 256 Go, 512 Go ou 1 To). L'interface recalcule et actualise les informations instantanément. La section inférieure rassemble les avis clients certifiés, la moyenne des notes attribuées et un formulaire interactif permettant aux utilisateurs connectés de rédiger leur propre retour d'expérience. L'action « Ajouter au panier » déclenche une mise à jour asynchrone de l'état global du magasin sans interruption de navigation."),

          // SCREENSHOT 4
          createHeading3("4.2.4 Section Accessoires et Équipements Périphériques"),
          createParagraph("En complément des smartphones, la plateforme propose un rayon complet d'accessoires de protection, écouteurs sans fil, chargeurs à induction et montres connectées indispensables pour le consommateur."),
          ...createImageFigure("04_accessoires.png", "Section Dédiée aux Accessoires et Équipements Connectés", "4"),
          createParagraph("Description détaillée et analyse technique de l'écran :", { bold: true, color: PRIMARY_COLOR, before: 140, after: 60 }),
          createParagraph("Le rayon des accessoires mobiles regroupe l'ensemble des équipements périphériques indispensables : chargeurs rapides certifiés 20W, câbles tressés USB-C haute durabilité, coques en silicone compatibles MagSafe, batteries externes haute capacité et écouteurs sans fil AirPods Pro. L'ergonomie de cette vue privilégie l'achat d'impulsion grâce à des boutons d'ajout direct au panier sur chaque vignette d'accessoire, favorisant l'augmentation du panier moyen de commande. L'API sous-jacente filtre les données via la requête SQL « WHERE category = 'Accessoires' », restituant l'inventaire précis entreposé à Oujda."),

          // SCREENSHOT 5
          createHeading3("4.2.5 Gestion du Panier d'Achat et Calcul des Remises"),
          createParagraph("Le panier d'achat offre une expérience interactive fluide. L'utilisateur peut ajuster ses quantités, retirer un article ou appliquer un code promotionnel avec calcul immédiat du montant de réduction."),
          ...createImageFigure("05_panier.png", "Panier d'Achat Interactif et Module de Validation Promo", "5"),
          createParagraph("Description détaillée et analyse technique de l'écran :", { bold: true, color: PRIMARY_COLOR, before: 140, after: 60 }),
          createParagraph("L'interface du panier d'achat synthétise la sélection d'articles de l'acheteur avec possibilité de moduler les quantités unitairement (+ / -) ou de retirer un produit en un clic. Un module dédié à la validation de codes promotionnels permet d'appliquer des coupons (par exemple PROMO10 ou WELCOME5) : un appel asynchrone vers « POST /api/promo/validate » vérifie l'éligibilité du code et déduit automatiquement le pourcentage de remise sur le montant total. Le panneau récapitulatif latéral détaille avec clarté le sous-total brut, le montant précis de la remise commerciale accordée, la gratuité des frais de livraison et le total final à régler avant l'acheminement vers le tunnel de paiement."),

          // SCREENSHOT 6
          createHeading3("4.2.6 Module d'Authentification et Gestion de Session"),
          createParagraph("Le module d'authentification assure une gestion sécurisée des identités. L'utilisateur peut basculer en un clic entre le formulaire de connexion et celui de création de compte."),
          ...createImageFigure("06_authentification.png", "Module d'Authentification Sécurisée (Connexion / Inscription)", "6"),
          createParagraph("Description détaillée et analyse technique de l'écran :", { bold: true, color: PRIMARY_COLOR, before: 140, after: 60 }),
          createParagraph("Cet écran garantit un contrôle d'accès rigoureux et ergonomique à l'espace personnel. Un commutateur d'onglets permet de basculer instantanément entre la connexion d'un client existant et l'enregistrement d'un nouvel utilisateur. Les formulaires intègrent une validation dynamique côté client (format d'email, longueur minimale du mot de passe). Côté back-end, la sécurité s'appuie sur la fonction de hachage cryptographique Scrypt avec sel cryptographique aléatoire de 16 octets, rendant impossible la rétro-ingénierie des mots de passe. À chaque authentification réussie, un jeton de session hexadécimal à haute entropie est généré et stocké dans la table relationnelle « sessions »."),

          // SCREENSHOT 7
          createHeading3("4.2.7 Formulaire de Contact et Support Clientèle"),
          createParagraph("Afin de maintenir une proximité avec ses clients à Oujda et dans tout le Maroc, un module de contact intégré permet d'adresser des demandes de renseignements ou de réclamations directement aux équipes d'EXPRESSOR."),
          ...createImageFigure("07_contact.png", "Formulaire de Contact et Support Clientèle Direct", "7"),
          createParagraph("Description détaillée et analyse technique de l'écran :", { bold: true, color: PRIMARY_COLOR, before: 140, after: 60 }),
          createParagraph("Le module de contact formalise la relation de proximité entre l'entreprise EXPRESSOR et ses clients à travers le Royaume. Il propose un formulaire structuré permettant de soumettre une demande en spécifiant l'identité du client, ses coordonnées de rappel, l'objet de la requête (support technique, suivi d'expédition, demande de devis B2B) et le message explicatif. L'écran met également en évidence l'adresse physique du siège social de l'entreprise (Hay Ngadi Rue 21 N° 4, Oujda) ainsi que les horaires de service. Lors de l'envoi, les informations sont nettoyées et archivées dans la table MySQL « messages » avec horodatage automatique pour assurer un traitement dans un délai garanti de 24 heures."),

          // SCREENSHOT 8
          createHeading3("4.2.8 Console d'Administration et Métriques Métier"),
          createParagraph("La console d'administration constitue le centre de contrôle pour les gestionnaires d'EXPRESSOR. Elle fournit une vision globale et en temps réel de la santé commerciale du site."),
          ...createImageFigure("08_tableau_de_bord_admin.png", "Console d'Administration et Métriques de Gestion des Ventes", "8"),
          createParagraph("Description détaillée et analyse technique de l'écran :", { bold: true, color: PRIMARY_COLOR, before: 140, after: 60 }),
          createParagraph("Réservée exclusivement aux administrateurs habilités, cette console de bord constitue le poste de pilotage stratégique de l'entreprise. Elle agrège en temps réel les indicateurs clés de performance (KPIs) : chiffre d'affaires cumulé, volume global des commandes passées, panier moyen et valeur marchande totale du stock immobilisé. Un tableau de veille signale immédiatement en alerte rouge les articles atteignant un seuil de stock critique (inférieur ou égal à 5 unités), facilitant ainsi le réapprovisionnement préventif auprès des fournisseurs. La console inclut également un formulaire d'administration permettant la création ou la modification de références avec upload direct d'images encodées en Base64 et converties côté serveur."),
          new Paragraph({ children: [new PageBreak()] }),

          // CONCLUSION GENERALE
          createHeading1("CONCLUSION GÉNÉRALE ET BILAN PERSONNEL"),
          createParagraph("Ce stage de formation technique au sein de la société EXPRESSOR (SARL AU) a constitué une étape hautement formatrice et valorisante dans mon parcours d'élève-ingénieur en Génie Informatique à l'École Polytechnique d'Agadir (Universiapolis)."),
          createParagraph("Sur le plan technique, ce projet m'a permis de mettre en application pratique les concepts théoriques acquis durant mes deux années de cycle ingénieur, en concevant une architecture web complète et moderne de bout en bout :"),
          createParagraph("• Maîtrise avancée de React 19 et des mécanismes de réactivité et d'optimisation de rendu côté client."),
          createParagraph("• Conception et sécurisation d'une API REST sous Node.js Express respectant les principes d'architecture logicielle propre."),
          createParagraph("• Modélisation et gestion transactionnelle d'une base de données relationnelle MySQL confrontée à des contraintes concrètes de cohérence de stocks et de commandes."),
          createParagraph("• Sensibilisation aiguë aux exigences d'ergonomie (UI/UX) et aux bonnes pratiques de sécurité applicative dans le secteur du e-commerce."),
          createParagraph("Sur le plan humain et méthodologique, l'immersion au sein de l'entreprise m'a appris à appréhender les contraintes réelles du marché commercial, à dialoguer avec les différentes parties prenantes pour formaliser des besoins concrets, et à travailler en autonomie tout en respectant des échéances rigoureuses."),
          createParagraph("Ce stage conforte pleinement mon projet professionnel de m'orienter vers l'ingénierie logicielle full-stack et l'architecture des systèmes d'information distribués. Je tiens à renouveler ma gratitude à l'École Polytechnique d'Agadir et à la société EXPRESSOR pour cette opportunité enrichissante."),
          new Paragraph({ children: [new PageBreak()] }),

          // REFERENCES & WEBOGRAPHIE
          createHeading1("RÉFÉRENCES ET WEBOGRAPHIE"),
          createParagraph("1. React Documentation officielle : https://react.dev/ — Guide de développement, Hooks et nouveautés de React 19.", { italics: true }),
          createParagraph("2. Node.js Documentation : https://nodejs.org/en/docs/ — Architecture asynchrone et API réseau.", { italics: true }),
          createParagraph("3. Express Framework Guide : https://expressjs.com/ — Conception d'API RESTful et gestion des middlewares.", { italics: true }),
          createParagraph("4. MySQL 8.0 Reference Manual : https://dev.mysql.com/doc/refman/8.0/en/ — Transactions ACID, indexation et optimisation des requêtes.", { italics: true }),
          createParagraph("5. Vite Next Generation Frontend Tooling : https://vite.dev/ — Configuration du bundler et Hot Module Replacement.", { italics: true }),
          createParagraph("6. MDN Web Docs : https://developer.mozilla.org/ — Spécifications HTML5, CSS3, JavaScript ES6+ et accessibilité web.", { italics: true }),
          createParagraph("7. Registre du Commerce d'Oujda — Données légales relatives à la société EXPRESSOR (SARL AU), RC 42505.", { italics: true }),
          new Paragraph({ children: [new PageBreak()] }),

          // ANNEXES
          createHeading1("ANNEXES"),
          createHeading2("Annexe 1 : Fiche d'Identité Juridique de l'Entreprise d'Accueil"),
          createParagraph("• Raison sociale : EXPRESSOR"),
          createParagraph("• Forme juridique : Société à Responsabilité Limitée à Associé Unique (SARL AU)"),
          createParagraph("• Siège social : Hay Ngadi Rue 21 N° 4, Oujda, Maroc"),
          createParagraph("• Capital social : 100 000,00 MAD"),
          createParagraph("• Registre du Commerce (RC) : 42505 (Tribunal de Commerce d'Oujda)"),
          createParagraph("• Identifiant Commun de l'Entreprise (ICE) : 003489213000074"),

          createHeading2("Annexe 2 : Extrait du Code Source — Transaction ACID de Prise de Commande"),
          createParagraph("Le fragment de code ci-dessous (extrait de server/index.js) illustre l'implémentation de la transaction ACID garantissant le verrouillage pessimiste des stocks (FOR UPDATE) et le calcul dynamique des remises :", { italics: true }),
          createParagraph("```javascript\n// Extrait : server/index.js (Ligne 202 - 239)\nconst conn = await pool.getConnection();\ntry {\n  await conn.beginTransaction();\n  let subtotal = 0;\n  for (const it of items) {\n    const qty = Math.max(1, parseInt(it.quantity, 10) || 1);\n    const [[p]] = await conn.query('SELECT * FROM products WHERE id = ? FOR UPDATE', [it.product_id]);\n    if (p.stock < qty) throw new Error(`Stock insuffisant pour ${p.name}`);\n    await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [qty, p.id]);\n    subtotal += Number(p.price) * qty;\n  }\n  // Calcul du code promo et insertion de la commande\n  await conn.commit();\n} catch (e) {\n  await conn.rollback();\n  throw e;\n} finally {\n  conn.release();\n}\n```", { size: 19, font: 'Courier New' })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.resolve('Rapport_Stage_Technicien_EXPRESSOR.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document successfully generated at: ${outputPath} (${buffer.length} bytes)`);
}

buildDocument().catch((err) => {
  console.error('Error generating document:', err);
  process.exit(1);
});
