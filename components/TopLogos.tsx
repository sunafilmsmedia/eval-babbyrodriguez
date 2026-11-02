"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BRAND } from "@/lib/brand";

export default function TopLogos() {
  const { team, banner } = BRAND.logos;
  return (
    <>
      {/* Logo de Babby — haut à gauche, blanc sur fond transparent, direct sur le hero sombre */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-30 pointer-events-none"
        aria-hidden
      >
        <Image
          src={team.src}
          alt={team.alt}
          width={team.width}
          height={team.height}
          priority
          className="h-9 sm:h-11 w-auto"
        />
      </motion.div>

      {/* Logo de l'agence — haut à droite, texte blanc + icône couleur, fond transparent */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-30 pointer-events-none"
        aria-hidden
      >
        <Image
          src={banner.src}
          alt={banner.alt}
          width={banner.width}
          height={banner.height}
          priority
          className="h-8 sm:h-10 w-auto"
        />
      </motion.div>
    </>
  );
}
