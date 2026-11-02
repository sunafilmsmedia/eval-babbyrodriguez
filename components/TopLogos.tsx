"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BRAND } from "@/lib/brand";

export default function TopLogos() {
  const { team, banner } = BRAND.logos;
  return (
    <>
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

      {/* Logo de l'agence — haut à droite, sur pastille blanche (logo à texte foncé) */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-30 pointer-events-none"
        aria-hidden
      >
        <div className="rounded-xl bg-white px-2 py-1 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] ring-1 ring-black/5">
          <Image
            src={banner.src}
            alt={banner.alt}
            width={banner.width}
            height={banner.height}
            priority
            className="h-8 sm:h-10 w-auto"
          />
        </div>
      </motion.div>
    </>
  );
}
