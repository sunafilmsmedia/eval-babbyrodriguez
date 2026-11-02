import type { Region } from "./types";

// ─────────────────────────────────────────────────────────────────────────
//  SECTEURS COUVERTS PAR L'ÉQUIPE — à remplir par déploiement.
//
//  Utilisé par le champ de recherche de secteur (dernière question) :
//  - recherche insensible aux accents et à la casse
//  - si le secteur tapé n'y figure pas, l'utilisateur peut toujours saisir
//    du texte libre (« Utiliser "…" ») — donc la liste n'a pas besoin d'être
//    exhaustive, mais couvrir toutes les municipalités du territoire améliore
//    l'expérience.
//  Aucune coordonnée (lat/lng) n'est requise : seul `name` est affiché.
//
//  Ci-dessous : territoire de la Rive-Sud de Montréal.
// ─────────────────────────────────────────────────────────────────────────
export const REGIONS: Region[] = [
  // ── Agglomération de Longueuil ────────────────────────────────────────
  { id: "vieux-longueuil", name: "Vieux-Longueuil" },
  { id: "saint-hubert", name: "Saint-Hubert" },
  { id: "greenfield-park", name: "Greenfield Park" },
  { id: "lemoyne", name: "LeMoyne" },
  { id: "brossard", name: "Brossard" },
  { id: "saint-lambert", name: "Saint-Lambert" },
  { id: "boucherville", name: "Boucherville" },

  // ── MRC de la Vallée-du-Richelieu ─────────────────────────────────────
  { id: "saint-bruno-de-montarville", name: "Saint-Bruno-de-Montarville" },
  { id: "saint-basile-le-grand", name: "Saint-Basile-le-Grand" },
  { id: "mcmasterville", name: "McMasterville" },
  { id: "otterburn-park", name: "Otterburn Park" },
  { id: "mont-saint-hilaire", name: "Mont-Saint-Hilaire" },
  { id: "beloeil", name: "Beloeil" },
  { id: "chambly", name: "Chambly" },
  { id: "carignan", name: "Carignan" },
  { id: "richelieu", name: "Richelieu" },
  { id: "sainte-julie", name: "Sainte-Julie" },
  { id: "varennes", name: "Varennes" },
  { id: "vercheres", name: "Verchères" },
  { id: "contrecoeur", name: "Contrecoeur" },

  // ── MRC de Roussillon ──────────────────────────────────────────────────
  { id: "la-prairie", name: "La Prairie" },
  { id: "candiac", name: "Candiac" },
  { id: "saint-constant", name: "Saint-Constant" },
  { id: "delson", name: "Delson" },
  { id: "sainte-catherine", name: "Sainte-Catherine" },
  { id: "chateauguay", name: "Châteauguay" },
  { id: "mercier", name: "Mercier" },
  { id: "lery", name: "Léry" },
  { id: "saint-philippe", name: "Saint-Philippe" },
  { id: "saint-mathieu", name: "Saint-Mathieu" },
  { id: "saint-isidore", name: "Saint-Isidore" },
];
