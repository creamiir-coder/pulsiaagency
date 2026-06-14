# PULSIA Agency — Guide de déploiement
## Stack : Eleventy + GitHub + Netlify + Decap CMS + Netlify Identity

---

## Comment ça fonctionne (architecture réelle)

```
Vous modifiez dans l'admin (/admin/)
            ↓
Decap CMS écrit les fichiers JSON dans GitHub (commit automatique)
            ↓
Netlify détecte le commit → lance : npm run build
            ↓
Eleventy relit les JSON → génère les pages HTML
            ↓
Site public mis à jour en ~60 secondes ✅
```

Chaque modification dans l'admin se reflète réellement sur le site.

---

## ÉTAPE 1 — Créer le dépôt GitHub

1. Allez sur [github.com](https://github.com) → connectez-vous
2. Bouton **"New"** → nommez le dépôt `pulsia-agency` → **Public** → **"Create repository"**
3. Sur la page du dépôt vide → cliquez **"uploading an existing file"**
4. Extrayez le ZIP `pulsia-agency.zip` → ouvrez le dossier extrait
5. Sélectionnez **tout le contenu** (Ctrl+A) → glissez dans la page GitHub
6. Message de commit : `Initial commit PULSIA Agency` → **"Commit changes"**

✅ Votre code est sur GitHub.

---

## ÉTAPE 2 — Déployer sur Netlify

1. Allez sur [app.netlify.com](https://app.netlify.com) → créez un compte (email : `pulsiaagency@gmail.com`)
2. **"Add new site"** → **"Import an existing project"** → **"GitHub"**
3. Autorisez Netlify → sélectionnez `pulsia-agency`
4. Paramètres de build :
   - **Branch** : `main`
   - **Build command** : `npm run build`  ← important
   - **Publish directory** : `_site`  ← important
5. **"Deploy site"** → Netlify build en ~90 secondes

**Personnaliser l'URL :**
Site settings → Domain management → "Change site name" → `pulsiaagency`
→ URL : `https://pulsiaagency.netlify.app`

✅ Site en ligne.

---

## ÉTAPE 3 — Activer Netlify Identity

1. Netlify → votre site → onglet **"Integrations"**
2. Cherchez **"Identity"** → **"Enable Identity"**
3. Dans Identity → Settings :
   - **Registration** → **"Invite only"** ← vous serez la seule utilisatrice
4. Descendez → **Services** → **"Git Gateway"** → **"Enable Git Gateway"**

✅ Netlify Identity + Git Gateway activés.

---

## ÉTAPE 4 — Créer votre compte administratrice

1. Netlify → votre site → onglet **"Identity"**
2. Bouton **"Invite users"** → entrez `pulsiaagency@gmail.com` → **"Send"**
3. Ouvrez votre boîte email → email de Netlify → cliquez le lien
4. Créez votre mot de passe → compte créé

---

## ÉTAPE 5 — Accéder à l'administration

```
https://pulsiaagency.netlify.app/admin/
```

→ Page de connexion Netlify Identity
→ Entrez email + mot de passe
→ Interface Decap CMS s'ouvre

L'URL `/admin/` n'est mentionnée nulle part sur le site public.

---

## ÉTAPE 6 — Activer les notifications formulaires

1. Netlify → site → onglet **"Forms"** (les formulaires apparaissent après la 1ère visite)
2. **"Form notifications"** → **"Add notification"** → **"Email notification"**
3. Email : `pulsiaagency@gmail.com`
4. Répétez pour chaque formulaire ou configurez une notification globale

---

## UTILISATION DE L'ADMIN

### Ce que vous pouvez modifier depuis /admin/

| Section admin | Ce que ça modifie | Fichier JSON |
|---|---|---|
| ⚙️ Paramètres > Informations & Contact | Email, tél, WhatsApp, adresse, réseaux | `src/_data/site.json` |
| ⚙️ Paramètres > Page d'accueil | Hero, stats, texte À propos, valeurs | `src/_data/homepage.json` |
| 🎨 Services Infographie | Tarifs, descriptions, options, actif/inactif | `src/_data/services.json` |
| 📈 Services Digital | Tarifs, descriptions, options | `src/_data/services.json` |
| 📦 Produits Créamiir | Prix, contenu pack, bénéfices, photos | `src/_data/creamiir.json` |
| 💬 Témoignages | Avis clients, notes, accueil oui/non | `src/_data/temoignages.json` |
| ❓ FAQ | Questions/réponses, catégories | `src/_data/faq.json` |

### Modifier un tarif
1. Admin → **🎨 Services Infographie** (ou Digital)
2. Cliquez sur "Tous les services Infographie"
3. Dans la liste → trouvez le service → changez "Prix indicatif"
4. Bouton **"Publish"** en haut à droite
5. Site mis à jour en ~60 secondes

### Ajouter un service
1. Admin → Services → éditez la liste
2. Cliquez le bouton **"Add item"** en bas de la liste
3. Remplissez : ID (sans accents/espaces), titre, icône, description, prix, note
4. Activez "Service actif"
5. Publiez

### Supprimer un service
1. Admin → Services → trouvez le service
2. Désactivez "Service actif" (il reste masqué sur le site mais conservé dans les données)
3. Ou cliquez l'icône corbeille à côté de l'entrée dans la liste pour le supprimer définitivement

### Modifier le produit Créamiir
1. Admin → **📦 Produits Créamiir**
2. Modifiez : prix, image, description, contenu du pack, bénéfices, témoignages
3. Pour changer l'image : cliquez sur le champ image → "Choose an image" → uploadez
4. Publiez

### Gérer les images
1. Admin → cliquez l'icône **"Media"** dans la barre du haut
2. Glissez vos images ou cliquez Upload
3. Les images sont stockées dans `src/images/uploads/`
4. Pour utiliser une image dans un produit : champ image → sélectionnez dans la médiathèque

---

## Structure du projet

```
pulsia-agency/
├── src/                         ← Sources Eleventy
│   ├── _data/                   ← Données JSON éditées par le CMS
│   │   ├── site.json            ← Infos agence, contact, réseaux
│   │   ├── homepage.json        ← Textes accueil, stats, valeurs
│   │   ├── services.json        ← Tous les services + tarifs
│   │   ├── creamiir.json        ← Produits Créamiir
│   │   ├── temoignages.json     ← Avis clients
│   │   └── faq.json             ← Questions fréquentes
│   ├── _includes/
│   │   └── layouts/
│   │       └── base.njk         ← Layout commun (nav, footer)
│   ├── pages/
│   │   ├── services.njk         ← Page services
│   │   ├── creamiir.njk         ← Page produit
│   │   ├── commande.njk         ← Formulaire commande
│   │   ├── contact.njk          ← Page contact
│   │   └── freelances.njk       ← Recrutement
│   ├── admin/
│   │   ├── index.html           ← Decap CMS (protégé Netlify Identity)
│   │   └── config.yml           ← Configuration CMS
│   ├── css/style.css
│   ├── js/main.js
│   ├── images/
│   └── robots.txt
├── index.njk                    ← Page d'accueil
├── .eleventy.js                 ← Config Eleventy
├── package.json                 ← npm (Eleventy)
└── netlify.toml                 ← Build : npm run build → _site
```

---

## Formulaires (5 formulaires Netlify)

| Formulaire | Page | Contenu |
|---|---|---|
| `contact-home` | Accueil | Nom, email, message |
| `commande` | /commande/ | Service, impression, délai, coords |
| `commande-creamiir` | /creamiir/ | Nom, tél, email, adresse, quantité |
| `candidature-freelance` | /freelances/ | Nom, profil, email, CV PDF, portfolio |
| `contact` | /contact/ | Nom, email, sujet, message |

---

## Sécurité de l'admin

- URL `/admin/` non mentionnée dans les pages publiques
- `<meta name="robots" content="noindex,nofollow">` dans admin/index.html
- Header `X-Robots-Tag: noindex` via netlify.toml
- `Disallow: /admin/` dans robots.txt
- Netlify Identity en mode "Invite only" — seule vous avez accès

---

*PULSIA Agency · pulsiaagency@gmail.com · +212 6 13 58 77 04 · Casablanca, Maroc*

---

## FOOTER — Administration des réseaux sociaux

Les icônes sociales du footer (Facebook, Instagram, LinkedIn, WhatsApp) sont **entièrement administrables** depuis Decap CMS.

### Ajouter ou modifier un réseau social

1. Admin → **⚙️ Paramètres du site** → **"Informations & Contact"**
2. Remplissez les champs :
   - **Instagram URL** : `https://instagram.com/pulsiaagency`
   - **Facebook URL** : `https://facebook.com/pulsiaagency`
   - **LinkedIn URL** : `https://linkedin.com/company/pulsiaagency`
   - Le **WhatsApp** utilise le numéro déjà configuré (champ `whatsapp`)
3. Publiez → les icônes apparaissent automatiquement dans le footer

Si un champ est vide, l'icône correspondante est automatiquement masquée.

### Structure du footer (automatique)

```
[Logo PULSIA Agency cliquable → Accueil]
Casablanca, Maroc
[Facebook] [Instagram] [LinkedIn] [WhatsApp]
─────────────────────────────────────────
© 2025 PULSIA Agency · Casablanca, Maroc · Tous droits réservés.
```

L'année `©` est générée dynamiquement par JavaScript — elle se met à jour automatiquement chaque année, aucune modification nécessaire.

---

## FORMULAIRES — Notes techniques

| Formulaire | Fichier joints | Encoding |
|---|---|---|
| contact, commande, creamiir, accueil | Aucun | `application/x-www-form-urlencoded` |
| candidature-freelance | CV (PDF) obligatoire + portfolio (lien URL) | `multipart/form-data` |

Le CV est envoyé en pièce jointe dans Netlify Forms. Le portfolio est un lien URL (Behance, LinkedIn, Drive, etc.) — pas un fichier uploadé.

