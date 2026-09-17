# Site vitrine — ProFlux, Ingénierie de l'énergie

Site statique (HTML5 + CSS3 + JavaScript vanilla), sans framework ni étape de build.
Il se déploie en copiant le dossier tel quel sur n'importe quel hébergement.

**Objectif du site : générer des demandes de devis.**
**Source des contenus : la plaquette ProFlux 2026** (textes, chiffres, références,
coordonnées, logo et photos de projets).

---

## 1. Structure des fichiers

```
.
├── index.html            Accueil
├── a-propos.html         Le bureau (histoire, dirigeant, secteurs, certifications)
├── expertise.html        Expertises (15 domaines en 4 familles + FAQ)
├── references.html       Réalisations (projets phares, grands projets, listes)
├── contact.html          Contact (formulaire, coordonnées, carte)
├── css/style.css         Feuille de style unique, commentée par sections
├── js/script.js          Menu, animations, compteurs, filtres, formulaire
├── assets/img/
│   ├── brand/            Logo officiel (navy + blanc), illustration filaire du hero
│   ├── projets/          8 visuels de projets extraits de la plaquette
│   └── ui/               3 photos d'illustration libres de droits (Pexels)
├── robots.txt
└── sitemap.xml
```

Le header, le bandeau CTA, la barre d'action mobile et le footer sont **identiques
sur les cinq pages**. Toute modification de la navigation est à répercuter sur les
cinq fichiers HTML.

---

## 2. Identité visuelle (alignée sur la plaquette)

| Rôle | Couleur | Code |
|---|---|---|
| Fonds sombres (hero, footer, méthodologie) | Navy | `#062742` |
| Accent de mise en valeur et boutons d'action | Orange plaquette | `#E08A2B` |
| Liens, icônes, filets | Bleu logo | `#1B7FC4` |
| Titres et textes | Gris-ardoise | `#37485C` / `#566779` |
| Fonds de section | Neutres froids (trame millimétrée) | `#F5F8FB` / `#EAF0F6` |

- **Typographie** : Poppins (titres, comme la plaquette) + Inter (textes).
- **Boutons d'action** : fond orange, texte navy (contraste 5,7:1, conforme AA).
- **Logo** : fichier officiel extrait de la plaquette, décliné en navy (header clair)
  et en blanc (footer). Pour une netteté maximale sur écrans haute densité,
  remplacer par le logo vectoriel (SVG) d'origine s'il est disponible.
- Toutes les couleurs sont centralisées en tête de `css/style.css`.

---

## 3. Les 15 expertises

| Famille | Expertise | Ancre |
|---|---|---|
| Lots fluides | Ventilation, climatisation & désenfumage | `#cvc` |
| | Chauffage & chaufferies | `#chauffage` |
| | Plomberie sanitaire | `#plomberie` |
| | Protection incendie (RIA & sprinkler) | `#incendie` |
| | Gestion des eaux pluviales | `#eaux-pluviales` |
| Installations spécifiques | Salles propres ISO 14644-1 | `#salles-propres` |
| | Solaire thermique collectif (dimensionnement TECSOL) | `#solaire` |
| | Piscines & thalassothérapie | `#piscines` |
| Réseaux & énergie | Étude de dilatation | `#dilatation` |
| | Équilibrage des réseaux | `#equilibrage` |
| | Rénovation énergétique & études thermiques | `#renovation` |
| Missions & méthodes | Synthèse des lots techniques | `#synthese` |
| | Conception 2D/3D sur REVIT MEP | `#bim` |
| | Chiffrage & métrés | `#chiffrage` |
| | Audit, expertise & diagnostic | `#audit` |

Pour **ajouter une expertise** : le bloc dans `expertise.html`, le méga-menu du
header et la liste du footer (sur les cinq pages), et l'entrée `SERVICES` des
données structurées.

---

## 4. Référencement naturel (SEO)

- **Domaine de référence : `https://www.proflux.com.tn/`** (celui de la plaquette),
  utilisé dans les balises `canonical`, Open Graph, JSON-LD, `sitemap.xml` et
  `robots.txt`. Si le site est publié sur un autre domaine, faire un
  rechercher/remplacer global de cette URL.
- `title` et `meta description` uniques par page.
- **Données structurées JSON-LD** : `ProfessionalService` (adresse du siège, bureau
  de Paris — téléphone de référence —, zone d'intervention, catalogue des 15 prestations),
  `Person` pour le dirigeant, `WebSite`, `BreadcrumbList` par page, `Service` ×15 et
  `FAQPage` sur `expertise.html`.
- ⚠ Si vous modifiez le texte visible d'une réponse de la FAQ, modifiez aussi le
  JSON-LD correspondant : Google sanctionne les divergences.

### À faire

1. **Image de partage social** : exporter la couverture de la plaquette en JPG
   1200 × 630 px dans `assets/img/brand/og-image.jpg`, puis décommenter les balises
   `og:image` en tête de chaque page.
2. **Google Business Profile** pour le siège d'El Mourouj — premier levier de
   visibilité locale.
3. **Search Console** : déclarer le domaine et soumettre `sitemap.xml`.

---

## 5. Conversion

| Élément | Emplacement |
|---|---|
| « Demander un devis » (orange) | Header, hero, bandeau de bas de page, formulaire |
| Bouton « Appeler » (numéro France, référence) | Hero, barre mobile, footer, page contact |
| Barre d'action fixe (Appeler · Devis) | Bas d'écran, sous 900 px |
| Engagements 01 / 02 / 03 et pays d'intervention | Accueil |
| FAQ | Expertises |
| « Ce qui se passe ensuite » | Contact |

**Mesure recommandée** : installer Matomo ou Google Analytics avec deux objectifs —
envoi du formulaire et clic `tel:`.

---

## 6. Images

| Dossier | Contenu | Origine |
|---|---|---|
| `brand/` | Logo navy et blanc, illustration filaire du hero | Plaquette ProFlux 2026 |
| `projets/` | Aéroport Oum Tounsi, centre psychothérapique de Nancy, ORTT N'Djamena, pôle scientifique de Paris, laboratoires MEDIS, hôtel Nahrawess, salle de congrès de Tripoli, logements collectifs | Plaquette ProFlux 2026 |
| `ui/chantier-cvc.jpg` | Gaine de soufflage et piquage | Pexels (libre de droits) |
| `ui/maquette-bim.jpg` | Maquette 3D des réseaux MEP | Pexels (libre de droits) |
| `ui/dilatation-reseaux.jpg` | Tuyauteries calorifugées | Pexels (libre de droits) |

⚠ **Les photos de projets sont en basse définition** (environ 450 px de large) car
elles proviennent de la plaquette PDF compressée. Elles restent correctes dans les
vignettes, mais les fichiers originaux haute définition amélioreraient nettement le
rendu, surtout sur écrans Retina. Remplacez simplement les fichiers en gardant le
même nom.

---

## 7. Coordonnées affichées (source : plaquette)

| | |
|---|---|
| Téléphone France (référence) | +33 1 86 61 78 04 |
| Bureau France | Paris |
| Siège Tunisie | 3 rue de Nice, Appt RA, Immeuble A1, Bloc 17, résidence Angham 1, 2047 El Mourouj 3, Ben Arous |
| E-mail | contact@proflux.com.tn |
| LinkedIn | linkedin.com/in/walimbellakanji |

Le numéro France est affiché comme numéro de référence sur tout le site ; le numéro
tunisien n'est plus affiché. L'adresse du bureau de Paris n'étant pas précisée dans
la plaquette, seule la ville est indiquée.

---

## 8. Formulaire de contact

- **Mode actuel (repli e-mail)** : tant que `data-endpoint` contient `VOTRE_ID`,
  l'envoi ouvre la messagerie du visiteur avec un message pré-rempli adressé à
  `contact@proflux.com.tn`.
- **Mode recommandé (Formspree)** : créer un formulaire gratuit sur
  [formspree.io](https://formspree.io), remplacer `VOTRE_ID` aux **deux** endroits
  du fichier `contact.html` (`action` et `data-endpoint`), puis retirer l'encadré
  d'information au-dessus du formulaire.

---

## 9. Déploiement

Aucune compilation. Copier l'intégralité du dossier sur l'hébergement (FTP/cPanel,
Netlify, Vercel, GitHub Pages, Cloudflare Pages — dossier de publication `.`).

Prévisualisation locale :

```bash
npx serve .
```

---

## 10. Accessibilité et performance

- Navigation clavier complète, lien d'évitement, focus visible partout.
- `aria-current`, `aria-expanded`, `aria-live` sur les composants dynamiques ;
  défilement verrouillé quand le menu mobile est ouvert.
- Images en `loading="lazy"`, sauf le logo et l'illustration du hero, visibles dès
  l'arrivée et donc chargés immédiatement.
- Animations désactivées si le visiteur a activé « réduire les animations ».
- Sans JavaScript, le contenu reste intégralement lisible.
