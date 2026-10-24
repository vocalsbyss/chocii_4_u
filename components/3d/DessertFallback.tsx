"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function DessertFallback() {
  return (
    <div className="relative w-full h-full min-h-[460px] md:min-h-[580px] flex items-center justify-center overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-caramel-500/20 blur-3xl -z-10 animate-pulse-slow" />
      <div className="absolute w-60 h-60 rounded-full bg-strawberry-500/15 blur-2xl -z-10 translate-x-20 -translate-y-10" />

      {/* Floating dessert container with smooth float motion */}
      <motion.div
        animate={{
          y: [0, -14, 0],
          rotate: [0, 1.5, 0, -1.5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] md:w-[460px] md:h-[460px] max-w-[85vw] max-h-[85vw] drop-shadow-[0_25px_45px_rgba(0,0,0,0.8)]"
      >
        <Image
          src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop"
          alt="chocii 4 u 3D Signature Cake"
          fill
          priority
          sizes="(max-width: 768px) 300px, 460px"
          className="object-cover rounded-full border-4 border-caramel-500/30 shadow-2xl"
        />

        {/* Glossy reflection overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

        {/* Floating chocolate badges */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -top-3 -right-3 bg-cocoa-900/90 backdrop-blur-md border border-caramel-500/40 text-cream-100 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg"
        >
          ✨ Signature 24K Gold Cake
        </motion.div>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-2 -left-2 bg-cocoa-900/90 backdrop-blur-md border border-strawberry-500/40 text-cream-100 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg"
        >
          🍫 Signature Cocoa Blend
        </motion.div>
      </motion.div>
    </div>
  );
}
