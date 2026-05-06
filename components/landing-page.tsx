"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { PlexusCanvas } from "./plexus-canvas";
import { AuthModal } from "./auth-modal";
import { Dashboard } from "./dashboard";
import { Server3D } from "./server-3d";

export function LandingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-[#1a0f0a]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-orange-500 border-t-transparent"
        />
      </div>
    );
  }

  if (user) {
    return (
      <>
        <PlexusCanvas />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,100,0,0.08)_0%,#0a0a0a_90%)] pointer-events-none z-[1]" />
        <Dashboard />
      </>
    );
  }

  return (
    <>
      <PlexusCanvas />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,100,0,0.08)_0%,#0a0a0a_90%)] pointer-events-none z-[1]" />

      {/* Landing Content - Desktop: Side by Side, Mobile: Stacked */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto px-5 py-10"
        >
          <div className="flex w-full max-w-6xl flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            {/* Left Side - Logo and Button */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <motion.img
                src="https://i.postimg.cc/kX3Xh6PG/IMG-20260211-135705-716-removebg-preview.png"
                alt="Cloud of Core Logo"
                className="mb-6 w-[min(320px,80%)] drop-shadow-[0_0_40px_rgba(255,100,0,0.8)] lg:w-[380px]"
                animate={{
                  y: [0, -15, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 max-w-md text-lg text-gray-300"
              >
                Experience the future of learning with our International Dashboard
              </motion.p>

              <motion.button
                onClick={() => setShowAuthModal(true)}
                className="w-[min(350px,100%)] rounded-[60px] border border-white/20 bg-gradient-to-r from-orange-500 to-orange-600 px-12 py-4 text-xl font-bold text-white shadow-[0_0_40px_rgba(255,102,0,0.6)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(255,102,0,0.8)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                GO TO DASHBOARD
              </motion.button>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-sm text-gray-400"
              >
                International Dashboard · Cloud of Core 2026
              </motion.p>
            </motion.div>

            {/* Right Side - 3D Server Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="hidden w-full max-w-lg lg:block"
            >
              <Server3D />
            </motion.div>

            {/* Mobile: Show smaller 3D illustration below */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="mt-4 w-full max-w-[280px] lg:hidden"
            >
              <Server3D />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
}
