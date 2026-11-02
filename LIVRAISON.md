# Babby Rodriguez — Évaluation « bon moment pour vendre ? » (ESPAGNOL)

App one-page de qualification de leads pour Babby Rodriguez, courtier immobilier
RE/MAX Platine (Rive-Sud de Montréal). Clonée du template `eval-veroniqueguillemette`.
Logos réels fournis par le client (`public/babby-rodriguez-logo.png`,
`public/remax-platine-logo.png`) — le genre masculin (« courtier ») vient du logo
du client lui-même, d'où son usage dans les textes espagnols (« corredor »).
Next.js 15 (App Router, TS) · Tailwind v4 · Framer Motion · Leaflet · déploiement Vercel.
Thème **noir / gris #333333 / blanc**, mobile-first, **tout le contenu visiteur est en
espagnol** (vouvoiement formel via « usted »).

**Polices demandées (Gotham / Century Gothic) non disponibles sur Google Fonts**
(polices commerciales) — substituts libres utilisés : Montserrat (Gotham) et Poppins
(Century Gothic). Voir `app/layout.tsx` et `app/globals.css`.

## Parcours (machine à états, un seul écran)
`hero → formulaire (9 questions) → chargement (~2 s, IA) → pré-révélation → résultats`
avec court-circuit « je ne veux pas vendre » (aucun envoi CRM).

- Auto-avance sur les choix (~220 ms), barre de progression, bouton Précédent, transitions slide.
- Question secteur = champ de recherche filtrée (insensible aux accents/casse) + saisie libre
  (« Utiliser "…" », jamais de « pas trouvé »). Confirmation « Bien reçu ! » puis analyse après ~1,1 s.
- Pré-révélation : un seul bouton « Voir ma réponse » → formulaire de contact complet
  **obligatoire** (nom, courriel, téléphone, consentement, tous requis) pour débloquer les résultats.
- Scoring déterministe → verdict 3 niveaux (favorable / moyen / défavorable).
- `/api/analyze` : rapport via Claude (repli déterministe sans clé).
- `/api/lead` : webhook CRM (GHL), payload aplati, **uniquement pour leads qualifiés**
  (verdict défavorable = rien envoyé ; « je ne veux pas vendre » = rien envoyé).

## Pour rebrander un nouveau client — 4 endroits

1. **`lib/brand.ts`** — LE fichier central : nom (Babby Rodriguez), région/ville
   (Rive-Sud de Montréal / Longueuil), textes du hero (espagnol), l'**agente unique**
   (nom, titre, photo, téléphone), logos, centre de la carte. Pas de badge flottant
   (retiré — courtier unique, comme dans le template source).
2. **`lib/regions.ts`** — secteurs de la Rive-Sud (Longueuil, Brossard, Boucherville,
   Vallée-du-Richelieu, Roussillon…).
3. **`public/`** — `babby-rodriguez.svg` (logo texte placeholder), `remax-logo.jpg`
   (générique, repris de eval-amine), `broker-1.svg` (silhouette placeholder — **à
   remplacer par une vraie photo de Babby quand disponible**).
4. **`.env.local`** (voir `.env.local.example`) — **actuellement vide**, clés propres à
   CE déploiement à fournir : `ANTHROPIC_API_KEY`, `CRM_WEBHOOK_URL`,
   `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_CLARITY_ID`,
   `NEXT_PUBLIC_CLARITY_SCANNER_PROJECT`, `NEXT_PUBLIC_SITE_URL`. Sans ces clés : rapport
   déterministe (pas d'IA), pas de pixel Meta, pas de Clarity, pas de webhook CRM (lead
   seulement loggé côté serveur).

Palette : réglable dans `app/globals.css` (bloc `@theme`, variables `--color-brand-*` et
`--color-gold`, qui pointe maintenant vers le blanc). Par défaut : noir / gris #333333 / blanc.

## Développement
```bash
npm install
cp .env.local.example .env.local   # remplir au besoin
npm run dev
```

## Confidentialité (garantie côté serveur)
- Verdict défavorable en mode évaluation → aucun stockage, aucun webhook.
- Court-circuit « je ne veux pas vendre » → aucune capture.
- Clarity Scanner (`window.csTrack`) n'enregistre **jamais** de données personnelles :
  uniquement des libellés d'étape et des choix prédéfinis.
