"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, X, Rocket, Calendar, Users, ChevronDown, Check } from "lucide-react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BATCHES = [
  { id: "301", label: "Batch 301", available: false },
  { id: "302", label: "Batch 302", available: false },
  { id: "303", label: "Batch 303", available: false },
  { id: "304", label: "Batch 304", available: false },
  { id: "305", label: "Batch 305", available: true },
];

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [showBatchDropdown, setShowBatchDropdown] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (isSignUp) {
      if (!dateOfBirth) {
        setError("Please enter your date of birth");
        return;
      }
      if (!selectedBatch) {
        setError("Please select your batch");
        return;
      }
    }

    setIsLoading(true);
    setError("");
    setLoadingProgress(0);

    // Simulate loading animation
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Try to save additional user data to Firestore (non-blocking)
        try {
          await setDoc(doc(db, "users", userCredential.user.uid), {
            email,
            dateOfBirth,
            batch: selectedBatch,
            createdAt: new Date().toISOString(),
          });
        } catch {
          // Firestore permission error - continue anyway since auth succeeded
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      clearInterval(progressInterval);
      setLoadingProgress(100);
      
      // Small delay for visual feedback
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsLoading(false);
        setLoadingProgress(0);
      }, 500);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      const errorMessage = err instanceof Error ? err.message : "Authentication failed";
      // Make error messages more user-friendly
      let friendlyError = errorMessage;
      if (errorMessage.includes("auth/email-already-in-use")) {
        friendlyError = "This email is already registered. Please sign in instead.";
      } else if (errorMessage.includes("auth/weak-password")) {
        friendlyError = "Password should be at least 6 characters.";
      } else if (errorMessage.includes("auth/invalid-email")) {
        friendlyError = "Please enter a valid email address.";
      } else if (errorMessage.includes("auth/user-not-found") || errorMessage.includes("auth/wrong-password") || errorMessage.includes("auth/invalid-credential")) {
        friendlyError = "Invalid email or password.";
      }
      setError(friendlyError);
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  const handleBatchSelect = (batchId: string, available: boolean) => {
    if (available) {
      setSelectedBatch(batchId);
      setShowBatchDropdown(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setDateOfBirth("");
    setSelectedBatch("");
    setError("");
    setShowBatchDropdown(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center overflow-y-auto bg-black/90 p-5 backdrop-blur-xl"
        >
          {/* Loading Overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[3000] flex flex-col items-center justify-center bg-black/95"
              >
                {/* Animated Logo */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="mb-8"
                >
                  <img
                    src="https://i.postimg.cc/kX3Xh6PG/IMG-20260211-135705-716-removebg-preview.png"
                    alt="Cloud of Core"
                    className="w-32 drop-shadow-[0_0_30px_rgba(255,100,0,0.8)]"
                  />
                </motion.div>

                {/* Loading Text */}
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="mb-4 text-lg font-semibold text-orange-400"
                >
                  {isSignUp ? "Creating your account..." : "Signing you in..."}
                </motion.p>

                {/* Progress Bar */}
                <div className="h-2 w-64 overflow-hidden rounded-full bg-orange-900/30">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>

                {/* Floating Particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-2 w-2 rounded-full bg-orange-500"
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${30 + Math.random() * 40}%`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="relative w-full max-w-[420px] rounded-[40px] border-2 border-orange-500/50 bg-gradient-to-br from-[#2a1a0f] to-[#0a0a0a] p-8 shadow-[0_30px_60px_-15px_rgba(255,102,0,0.4)]"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-orange-500/30 bg-white/10 text-orange-500 transition-all hover:bg-orange-500 hover:text-black"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-500/10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Rocket className="h-8 w-8 text-orange-500" />
              </motion.div>
            </div>

            <h2 className="mb-5 bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-center text-2xl font-extrabold text-transparent">
              {isSignUp ? "CREATE ACCOUNT" : "WELCOME BACK"}
            </h2>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 rounded-2xl bg-red-500/20 p-3 text-center text-sm text-red-400"
              >
                {error}
              </motion.div>
            )}

            {/* Email Input */}
            <div className="relative mb-4">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-500" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[30px] border-2 border-orange-500/30 bg-[#14141e]/70 py-3.5 pl-12 pr-4 text-white placeholder:text-gray-400 transition-all focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Password Input */}
            <div className="relative mb-4">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-500" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[30px] border-2 border-orange-500/30 bg-[#14141e]/70 py-3.5 pl-12 pr-4 text-white placeholder:text-gray-400 transition-all focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Sign Up Only Fields */}
            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {/* Date of Birth */}
                  <div className="relative mb-4">
                    <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-500" />
                    <input
                      type="date"
                      placeholder="Date of Birth"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full rounded-[30px] border-2 border-orange-500/30 bg-[#14141e]/70 py-3.5 pl-12 pr-4 text-white placeholder:text-gray-400 transition-all focus:border-orange-500 focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
                    />
                  </div>

                  {/* Batch Selection */}
                  <div className="relative mb-4">
                    <Users className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-500 z-10" />
                    <button
                      type="button"
                      onClick={() => setShowBatchDropdown(!showBatchDropdown)}
                      className="flex w-full items-center justify-between rounded-[30px] border-2 border-orange-500/30 bg-[#14141e]/70 py-3.5 pl-12 pr-4 text-left text-white transition-all focus:border-orange-500 focus:outline-none"
                    >
                      <span className={selectedBatch ? "text-white" : "text-gray-400"}>
                        {selectedBatch
                          ? `Batch ${selectedBatch}`
                          : "Select Batch"}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-orange-500 transition-transform ${
                          showBatchDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Batch Dropdown - Opens ABOVE the button */}
                    <AnimatePresence>
                      {showBatchDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 right-0 bottom-full z-[100] mb-2 overflow-hidden rounded-2xl border border-orange-500/50 bg-[#1a1008] shadow-[0_-10px_30px_rgba(255,102,0,0.3)]"
                        >
                          {BATCHES.map((batch) => (
                            <button
                              key={batch.id}
                              type="button"
                              onClick={() =>
                                handleBatchSelect(batch.id, batch.available)
                              }
                              disabled={!batch.available}
                              className={`flex w-full items-center justify-between px-4 py-3 text-left transition-all ${
                                batch.available
                                  ? "cursor-pointer text-white hover:bg-orange-500/20"
                                  : "cursor-not-allowed text-gray-500"
                              } ${
                                selectedBatch === batch.id
                                  ? "bg-orange-500/30"
                                  : ""
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                {batch.label}
                                {!batch.available && (
                                  <span className="rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-400">
                                    Closed
                                  </span>
                                )}
                                {batch.available && (
                                  <span className="rounded bg-orange-500/30 px-2 py-0.5 text-xs text-orange-400">
                                    Open
                                  </span>
                                )}
                              </span>
                              {selectedBatch === batch.id && (
                                <Check className="h-4 w-4 text-orange-500" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={handleAuth}
              disabled={isLoading}
              className="mt-2 w-full rounded-[30px] bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 text-lg font-bold text-white transition-all hover:shadow-[0_0_40px_rgba(255,102,0,0.6)] disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSignUp ? "SIGN UP" : "SIGN IN"}
            </motion.button>

            <div className="mt-5 flex justify-between text-sm text-gray-400">
              <button
                type="button"
                onClick={toggleMode}
                className="text-orange-500 transition-colors hover:text-orange-400"
              >
                {isSignUp ? "Already have an account?" : "Create Account"}
              </button>
              <button
                type="button"
                className="text-orange-500 transition-colors hover:text-orange-400"
              >
                Forgot Password?
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
