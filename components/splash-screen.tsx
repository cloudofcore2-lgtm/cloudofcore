"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 5000 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Small delay to allow fade out animation
      setTimeout(onComplete, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[5000] flex flex-col items-center justify-center bg-black px-4"
    >
      {/* Decorative Logo - Generated with CSS (Top) */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          delay: 0.2,
        }}
        className="mb-8 flex items-center justify-center"
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-48 lg:w-48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Circle */}
          <circle
            cx="60"
            cy="60"
            r="55"
            stroke="url(#grad1)"
            strokeWidth="2"
            opacity="0.8"
          />

          {/* Inner Circles */}
          <circle
            cx="60"
            cy="60"
            r="40"
            stroke="url(#grad2)"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <circle
            cx="60"
            cy="60"
            r="25"
            stroke="url(#grad3)"
            strokeWidth="1"
            opacity="0.4"
          />

          {/* Center Dot */}
          <circle cx="60" cy="60" r="4" fill="url(#grad1)" />

          {/* Orbiting Elements */}
          <g opacity="0.7">
            <circle cx="85" cy="60" r="3" fill="url(#grad2)" />
            <circle cx="35" cy="60" r="3" fill="url(#grad2)" />
            <circle cx="60" cy="35" r="3" fill="url(#grad3)" />
            <circle cx="60" cy="85" r="3" fill="url(#grad3)" />
          </g>

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#888888", stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#cccccc", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#666666", stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#999999", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#444444", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Secured by IFC ARENA Text (Center) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          delay: 0.4,
        }}
        className="flex flex-col items-center justify-center gap-1 sm:gap-2"
      >
        <p className="text-center text-sm tracking-widest text-gray-300 uppercase sm:text-base">
          Secured by
        </p>
        <h1 className="text-center text-5xl font-black tracking-wider text-white sm:text-6xl md:text-7xl lg:text-8xl">
          IFC ARENA
        </h1>
      </motion.div>

      {/* Loading Animation - Inspired by Samsung Galaxy (Bottom) */}
      <div className="absolute bottom-32 flex items-center justify-center gap-2 sm:bottom-40">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="h-2 w-2 rounded-full bg-white sm:h-3 sm:w-3"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>

      {/* Progress Bar - Simulated loading progress (Bottom) */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "80%" }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          delay: 0.8,
        }}
        className="absolute bottom-8 h-0.5 max-w-xs bg-gradient-to-r from-transparent via-white to-transparent sm:bottom-12"
      >
        <motion.div
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: duration / 1000 - 0.5,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
