// Wrapper sûr autour de Clarity Scanner (window.csTrack), chargé via
// app/layout.tsx. Si le tracker n'est pas (encore) chargé, l'appel est ignoré
// silencieusement — aucune fonctionnalité ne dépend de lui.
//
// RÈGLE DE VIE PRIVÉE : ne jamais passer de valeur texte libre (nom, courriel,
// téléphone, secteur saisi à la main). Uniquement des libellés d'étape et des
// choix prédéfinis.

declare global {
  interface Window {
    csTrack?: (event: string, data?: Record<string, unknown>) => void;
  }
}

export function trackStep(name: string, value?: string) {
  if (typeof window === "undefined" || typeof window.csTrack !== "function") return;
  try {
    window.csTrack("step", value ? { name, value } : { name });
  } catch {
    // no-op : le tracking ne doit jamais casser l'app
  }
}
