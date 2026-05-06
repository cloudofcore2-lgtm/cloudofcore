"use client";

import { motion } from "framer-motion";

export function Server3D() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Glow effect behind */}
      <div className="absolute inset-0 blur-3xl">
        <div className="h-full w-full rounded-full bg-gradient-to-br from-orange-500/30 via-orange-600/20 to-transparent" />
      </div>

      {/* Main 3D Server Illustration */}
      <motion.svg
        viewBox="0 0 400 400"
        className="relative h-auto w-full max-w-[400px]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Background Circle */}
        <motion.circle
          cx="200"
          cy="200"
          r="180"
          fill="url(#bgGradient)"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Server Rack - Main Body */}
        <motion.g
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Server Back Shadow */}
          <rect
            x="125"
            y="95"
            width="160"
            height="220"
            rx="12"
            fill="#1a1008"
            transform="skewY(-2)"
          />

          {/* Server Main Body */}
          <rect
            x="120"
            y="90"
            width="160"
            height="220"
            rx="12"
            fill="url(#serverGradient)"
            stroke="url(#borderGradient)"
            strokeWidth="2"
          />

          {/* Server Top Highlight */}
          <rect
            x="122"
            y="92"
            width="156"
            height="8"
            rx="4"
            fill="rgba(255,150,80,0.3)"
          />

          {/* Server Slots */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              {/* Slot Background */}
              <rect
                x="135"
                y={115 + i * 38}
                width="130"
                height="30"
                rx="6"
                fill="#0a0604"
              />

              {/* Slot Inner */}
              <rect
                x="138"
                y={118 + i * 38}
                width="124"
                height="24"
                rx="4"
                fill="url(#slotGradient)"
              />

              {/* LED Indicators */}
              <motion.circle
                cx="150"
                cy={130 + i * 38}
                r="4"
                fill="#ff6600"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  boxShadow: [
                    "0 0 5px #ff6600",
                    "0 0 15px #ff6600",
                    "0 0 5px #ff6600",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                filter="url(#glow)"
              />

              <motion.circle
                cx="165"
                cy={130 + i * 38}
                r="4"
                fill="#00ff88"
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                filter="url(#glowGreen)"
              />

              {/* Data Lines */}
              <rect
                x="180"
                y={125 + i * 38}
                width="70"
                height="3"
                rx="1.5"
                fill="rgba(255,102,0,0.4)"
              />
              <rect
                x="180"
                y={132 + i * 38}
                width="50"
                height="3"
                rx="1.5"
                fill="rgba(255,102,0,0.25)"
              />
            </g>
          ))}

          {/* Ventilation Grills */}
          <g opacity="0.5">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <rect
                key={i}
                x="270"
                y={110 + i * 28}
                width="3"
                height="20"
                rx="1.5"
                fill="rgba(255,102,0,0.3)"
              />
            ))}
          </g>
        </motion.g>

        {/* Connection Cables */}
        <motion.g
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <path
            d="M120 150 Q 80 150 80 200 Q 80 250 100 280"
            stroke="url(#cableGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M280 180 Q 320 180 320 220 Q 320 260 300 290"
            stroke="url(#cableGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Floating Data Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={i}
            cx={100 + Math.random() * 200}
            cy={100 + Math.random() * 200}
            r="3"
            fill="#ff6600"
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            filter="url(#glow)"
          />
        ))}

        {/* Cloud Icons Around */}
        <motion.g
          animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Cloud 1 */}
          <g transform="translate(60, 80)">
            <ellipse cx="25" cy="20" rx="20" ry="12" fill="rgba(255,102,0,0.3)" />
            <ellipse cx="40" cy="18" rx="15" ry="10" fill="rgba(255,102,0,0.25)" />
            <ellipse cx="32" cy="25" rx="18" ry="10" fill="rgba(255,102,0,0.35)" />
          </g>

          {/* Cloud 2 */}
          <g transform="translate(290, 60)">
            <ellipse cx="20" cy="15" rx="15" ry="10" fill="rgba(255,102,0,0.25)" />
            <ellipse cx="32" cy="13" rx="12" ry="8" fill="rgba(255,102,0,0.2)" />
            <ellipse cx="26" cy="20" rx="14" ry="8" fill="rgba(255,102,0,0.3)" />
          </g>
        </motion.g>

        {/* Gradients and Filters */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(40,25,15,0.8)" />
            <stop offset="100%" stopColor="rgba(10,10,10,0.9)" />
          </linearGradient>

          <linearGradient id="serverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a1a10" />
            <stop offset="50%" stopColor="#1a1008" />
            <stop offset="100%" stopColor="#0d0804" />
          </linearGradient>

          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,102,0,0.6)" />
            <stop offset="50%" stopColor="rgba(255,102,0,0.3)" />
            <stop offset="100%" stopColor="rgba(255,102,0,0.5)" />
          </linearGradient>

          <linearGradient id="slotGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1008" />
            <stop offset="100%" stopColor="#0d0804" />
          </linearGradient>

          <linearGradient id="cableGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,102,0,0.6)" />
            <stop offset="100%" stopColor="rgba(255,102,0,0.2)" />
          </linearGradient>

          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </motion.svg>

      {/* Labels */}
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm font-semibold text-orange-400">Cloud Infrastructure</p>
        <p className="text-xs text-gray-500">Powered by Firebase</p>
      </motion.div>
    </div>
  );
}
