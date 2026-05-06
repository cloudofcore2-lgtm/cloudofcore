"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Trophy, FileText, Target, Bell } from "lucide-react";

interface StudentData {
  classPoints?: number;
  totalPoints?: number;
  examMarks?: number;
  totalMarks?: number;
  notice?: string;
}

interface StudentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentData: StudentData | null;
  accessDenied?: boolean;
  deniedBatch?: string;
}

export function StudentPopup({
  isOpen,
  onClose,
  studentName,
  studentData,
  accessDenied = false,
  deniedBatch = "",
}: StudentPopupProps) {
  const data = studentData || {
    classPoints: 0,
    totalPoints: 0,
    examMarks: 0,
    totalMarks: 0,
    notice: "✨ No special notice available. Keep shining!",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/85 backdrop-blur-xl p-5"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="relative w-full max-w-[500px] rounded-[48px] border-2 border-orange-400 bg-gradient-to-br from-[#231f1a] to-[#0f0c09] p-8 shadow-[0_25px_50px_-12px_rgba(255,102,0,0.5)]"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 transition-all hover:rotate-90 hover:bg-orange-500 hover:text-black"
            >
              <X className="h-6 w-6" />
            </button>

            {accessDenied ? (
              <div className="py-10 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                  <X className="h-12 w-12" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-red-400">ACCESS DENIED</h2>
                <p className="text-gray-400">
                  You are not a student of Batch {deniedBatch}
                </p>
              </div>
            ) : (
              <>
                <h2 className="mb-6 text-center text-2xl font-extrabold capitalize text-orange-300">
                  🌟 {studentName}
                </h2>

                <div className="overflow-hidden rounded-3xl bg-black/40">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-orange-500/30">
                        <td className="flex items-center gap-2 p-4 font-bold text-orange-300">
                          <BookOpen className="h-5 w-5" />
                          Class Points
                        </td>
                        <td className="p-4 text-right font-semibold text-orange-100">
                          {data.classPoints || 0} pts
                        </td>
                      </tr>
                      <tr className="border-b border-orange-500/30">
                        <td className="flex items-center gap-2 p-4 font-bold text-orange-300">
                          <Trophy className="h-5 w-5" />
                          Total Points
                        </td>
                        <td className="p-4 text-right font-semibold text-orange-100">
                          {data.totalPoints || 0} pts
                        </td>
                      </tr>
                      <tr className="border-b border-orange-500/30">
                        <td className="flex items-center gap-2 p-4 font-bold text-orange-300">
                          <FileText className="h-5 w-5" />
                          Exam Marks
                        </td>
                        <td className="p-4 text-right font-semibold text-orange-100">
                          {data.examMarks || 0} / 100
                        </td>
                      </tr>
                      <tr>
                        <td className="flex items-center gap-2 p-4 font-bold text-orange-300">
                          <Target className="h-5 w-5" />
                          Total Marks
                        </td>
                        <td className="p-4 text-right font-semibold text-orange-100">
                          {data.totalMarks || 0}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-[28px] border-l-4 border-orange-500 bg-orange-500/15 p-4">
                  <Bell className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-400" />
                  <p className="text-sm text-orange-200">{data.notice}</p>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
