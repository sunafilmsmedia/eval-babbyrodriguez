"use client";

import Script from "next/script";

// Microsoft Clarity — à fournir par déploiement via NEXT_PUBLIC_CLARITY_ID.
// Vide = aucun script Clarity injecté.
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "";

export default function Clarity() {
  if (!CLARITY_PROJECT_ID) return null;
  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `}
    </Script>
  );
}
