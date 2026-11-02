// ─────────────────────────────────────────────────────────────────────────
//  CONFIG DE MARQUE — WHITE LABEL
//  Le SEUL fichier à éditer pour rebrander l'app à un nouveau client.
//  (+ lib/regions.ts pour la liste des secteurs, + les images dans /public,
//   + les variables d'environnement pour les intégrations : voir .env.local.example)
//
//  Palette : noir / gris #333333 / blanc. Les couleurs se règlent dans
//  app/globals.css (bloc @theme) — cherche les variables --color-brand-*
//  et --color-gold (renommage conservé pour compat, mappé au blanc ici).
// ─────────────────────────────────────────────────────────────────────────

export interface BrokerConfig {
  name: string;
  title: string;
  /** Chemin de la photo dans /public (ex. "/broker-1.jpg") */
  photo: string;
  /** Cadrage de la photo dans le rond du badge (ex. "50% 18%") */
  objectPosition: string;
  /** Téléphone affiché (ex. "514 000-0000") */
  phoneDisplay: string;
  /** Téléphone au format tel: (ex. "+15140000000") */
  phoneTel: string;
}

export interface BrandConfig {
  /** Identifiant court du déploiement — sert de "source" au CRM et de projet Clarity Scanner par défaut. */
  slug: string;

  /** Nom de l'équipe (affiché en filigrane dans le formulaire, le footer, le consentement). */
  teamName: string;

  /** Région / territoire couvert (textes marketing, rapport de repli, footer). */
  region: string;
  /** Ville centrale (utilisée dans les textes du rapport de repli). */
  city: string;

  /** Carte décorative du hero. */
  map: {
    center: [number, number]; // [lat, lng]
    zoom: number;
  };

  /** Textes du hero. */
  hero: {
    chip: string;
    title: string;
    /** Segment exact du titre en or shimmer + police douce (serif italique) (ex. "bon moment"). Optionnel. */
    titleHighlight?: string;
    /** Segment exact du titre en police douce dorée (serif italique) (ex. "Gatineau"). Optionnel. */
    titleSoft?: string;
    subtitle: string;
    signature: string; // "Boosté par l'IA"
    cta: string;
    ctaHint: string;
    scrollHint: string;
  };

  /** Logos fixes en haut (équipe à gauche, bannière à droite). */
  logos: {
    team: { src: string; alt: string; width: number; height: number };
    banner: { src: string; alt: string; width: number; height: number };
  };

  /** Courtier(s). Ici : Véronique seule. Les noms servent aux textes du rapport (le badge flottant a été retiré). */
  brokers: BrokerConfig[];
}

export const BRAND: BrandConfig = {
  slug: "eval-babbyrodriguez",

  teamName: "Babby Rodriguez",

  region: "la Rive-Sud de Montreal",
  city: "Longueuil",

  map: {
    // Longueuil (Vieux-Longueuil). Ajuste au besoin.
    center: [45.5312, -73.518],
    zoom: 13,
  },

  hero: {
    chip: "Evaluación personalizada",
    title: "¿Es el momento adecuado para vender su propiedad en Longueuil?",
    titleHighlight: "momento adecuado",
    titleSoft: "Longueuil",
    subtitle:
      "Responda alrededor de diez preguntas y reciba un análisis honesto y confidencial de su momento ideal para vender, basado en su plusvalía, su patrimonio y su situación.",
    signature: "Impulsado por IA",
    cta: "Comenzar mi evaluación",
    ctaHint: "3 minutos — gratis y confidencial",
    scrollHint: "Confidencial · Sin compromiso",
  },

  logos: {
    team: {
      // Logo réel de Babby (icône maison/B + nom + sous-titre), fourni par le
      // client, repassé en blanc sur fond transparent pour poser directement
      // sur le hero sombre (sans pastille).
      src: "/babby-rodriguez-logo.png",
      alt: "Babby Rodriguez — Corredor inmobiliario residencial y comercial",
      width: 795,
      height: 291,
    },
    banner: {
      // Logo réel de l'agence RE/MAX Platine, fourni par le client. Texte
      // repassé en blanc, icône du ballon RE/MAX conservée en couleur,
      // fond transparent.
      src: "/remax-platine-logo.png",
      alt: "RE/MAX Platine — Agencia inmobiliaria",
      width: 1000,
      height: 480,
    },
  },

  // Agente unique — le badge flottant a été retiré (aucun numéro affiché).
  brokers: [
    {
      name: "Babby Rodriguez",
      title: "Corredor inmobiliario residencial y comercial · RE/MAX Platine",
      photo: "/broker-1.svg",
      objectPosition: "50% 18%",
      phoneDisplay: "",
      phoneTel: "",
    },
  ],
};

/** "Prénom ou Prénom" — utilisé dans les textes qui nomment l'équipe. */
export function brokersInlineNames(): string {
  const firsts = BRAND.brokers.map((b) => b.name.split(/\s+/)[0]).filter(Boolean);
  if (firsts.length === 0) return "un agente";
  if (firsts.length === 1) return firsts[0];
  return `${firsts.slice(0, -1).join(", ")} o ${firsts[firsts.length - 1]}`;
}
