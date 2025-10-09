"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface WelcomeAnimationProps {
  welcomeMessage?: string;
  clientName?: string;
  onComplete: () => void;
}

export default function WelcomeAnimation({ 
  welcomeMessage, 
  clientName,
  onComplete 
}: WelcomeAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade-out animation
    }, 2500); // Show for 2.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  const defaultMessage = clientName 
    ? `Hi ${clientName} – hier ist deine Moodboard-Präsentation ✨`
    : "Willkommen zu deinem Moodboard ✨";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black"
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          />

          <div className="relative z-10 text-center px-6 max-w-3xl">
            {/* Logo/Brand */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-2xl md:text-3xl font-light text-white/90 tracking-wide">
                Moodboard by
              </h1>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-2 tracking-tight">
                Mark Tietz Fotografie
              </h2>
            </motion.div>

            {/* Welcome Message */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xl md:text-2xl text-white/80 font-light"
            >
              {welcomeMessage || defaultMessage}
            </motion.p>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mt-8 w-64 mx-auto"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

