"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore"; // onSnapshot import করুন
import { db } from "@/lib/firebase";

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PopupConfig {
  imageUrl: string;
  title: string;
  message: string;
}

export function WelcomePopup({ isOpen, onClose }: WelcomePopupProps) {
  const [config, setConfig] = useState<PopupConfig>({
    imageUrl: "https://i.postimg.cc/kX3Xh6PG/IMG-20260211-135705-716-removebg-preview.png",
    title: "WELCOME TO CLOUD OF CORE",
    message: "🌟 Experience the future of learning. Stay tuned for daily missions and exclusive rewards!",
  });
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Real-time listener for welcome popup config - MODIFIED
  useEffect(() => {
    if (!isOpen) return;

    // onSnapshot ব্যবহার করে রিয়েলটাইম আপডেট শুনুন
    const unsubscribe = onSnapshot(
      doc(db, "welcomePopup", "config"),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setConfig({
            imageUrl: data.imageUrl || config.imageUrl,
            title: data.title || config.title,
            message: data.message || config.message,
          });
          console.log("Welcome popup updated in realtime!");
        }
      },
      (error) => {
        console.log("Using default welcome popup config:", error);
      }
    );

    // Cleanup: popup বন্ধ হলে লিসেনার বন্ধ করুন
    return () => unsubscribe();
  }, [isOpen]); // config.imageUrl dependency বাদ দিন

  // Typing animation effect
  useEffect(() => {
    if (!isOpen) {
      setDisplayedText("");
      setIsTyping(true);
      return;
    }

    let i = 0;
    setDisplayedText("");
    setIsTyping(true);

    const typeWriter = () => {
      if (i < config.message.length) {
        setDisplayedText(config.message.substring(0, i + 1));
        i++;
        setTimeout(typeWriter, 40);
      } else {
        setIsTyping(false);
      }
    };

    const timer = setTimeout(typeWriter, 500);
    return () => clearTimeout(timer);
  }, [isOpen, config.message]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-xl p-5"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="relative w-full max-w-[500px] rounded-[48px] border-2 border-orange-400 bg-gradient-to-br from-[#1f1a15] to-[#0e0b08] p-6 text-center shadow-[0_0_80px_rgba(255,102,0,0.4)]"
          >
            <button
              onClick={onClose}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-orange-500/60 bg-orange-500/20 text-orange-400 transition-all hover:rotate-90 hover:bg-orange-500 hover:text-black"
            >
              <X className="h-6 w-6" />
            </button>

            <img
              src={config.imageUrl}
              alt="Welcome"
              className="mx-auto mb-5 max-h-[260px] w-full rounded-[32px] border-2 border-orange-400 object-contain shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              onError={(e) => {
                // ইমেজ লোড না হলে ডিফল্ট ইমেজ দেখান
                (e.target as HTMLImageElement).src = "https://i.postimg.cc/kX3Xh6PG/IMG-20260211-135705-716-removebg-preview.png";
              }}
            />

            <h2 className="mb-4 bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
              {config.title}
            </h2>

            <div className="min-h-[80px] rounded-[32px] border-l-4 border-orange-500 bg-black/40 p-4 text-left text-lg font-medium leading-relaxed text-orange-200">
              {displayedText}
              {isTyping && (
                <span className="ml-1 inline-block h-5 w-0.5 animate-pulse bg-orange-400" />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
