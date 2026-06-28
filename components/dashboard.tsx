"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LogOut,
  TrendingUp,
  TrendingDown,
  Gem,
  Crown,
  Medal,
  Award,
  Star,
  Trophy,
  ChevronUp,
  Target,
  Check,
  X,
  Users,
  Clock,
  Tv,
  Calendar,
  Bell,
  Globe,
  Server,
  Heart,
  Zap,
  BookOpen,
} from "lucide-react";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { WelcomePopup } from "./welcome-popup";
import { StudentPopup } from "./student-popup";

interface BatchStat {
  batch: string;
  value: string;
  trend: "up" | "down";
}

interface LeadershipItem {
  batch: string;
  rank: number;
  value: string;
}

interface MissionItem {
  batch: string;
  rank: number;
  totalMissions: number;
  successMissions: number;
  failedMissions: number;
  highlighted: boolean;
}

interface RankingItem {
  name: string;
  points: number;
}

interface StudentData {
  classPoints?: number;
  totalPoints?: number;
  examMarks?: number;
  totalMarks?: number;
  notice?: string;
}

const BATCH_STUDENTS: Record<string, string[]> = {
  "302": Array.from({ length: 292 }, (_, i) => `Learner ${i + 1}`),
  "303": Array.from({ length: 278 }, (_, i) => `Scholar ${i + 1}`),
  "304": Array.from({ length: 318 }, (_, i) => `Pioneer ${i + 1}`),
  "305": [
    "majedul islam fahad",
    "sayid hossain sayem",
    "abu talha shamim",
    "kamrul hassan sojib",
  ],
  "306": Array.from({ length: 15 }, (_, i) => `Student ${i + 1}`),
};

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return <Gem className="h-5 w-5 text-cyan-300" />;
    case 2:
      return <Crown className="h-5 w-5 text-yellow-400" />;
    case 3:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 4:
      return <Award className="h-5 w-5 text-orange-700" />;
    default:
      return <Star className="h-5 w-5 text-orange-400" />;
  }
};

const getMissionBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-400" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-orange-700" />;
    default:
      return <ChevronUp className="h-5 w-5 text-orange-400" />;
  }
};

export function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeShown, setWelcomeShown] = useState(false);
  const [totalStudents, setTotalStudents] = useState("📊 2026 · 1,852 Students");
  const [batchStats, setBatchStats] = useState<BatchStat[]>([]);
  const [leadership, setLeadership] = useState<LeadershipItem[]>([]);
  const [missionRank, setMissionRank] = useState<MissionItem[]>([]);
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [notice, setNotice] = useState("");
  const [studentsData, setStudentsData] = useState<Record<string, StudentData>>({});
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [showBatch305Leaderboard, setShowBatch305Leaderboard] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ name: string; batch: string }[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{
    name: string;
    batch: string;
  } | null>(null);
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [todayClass, setTodayClass] = useState("No Class");
  const [todayUpdate, setTodayUpdate] = useState("Welcome to Cloud of Core! Stay tuned for daily updates.");

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && !welcomeShown) {
        setTimeout(() => {
          setShowWelcome(true);
          setWelcomeShown(true);
        }, 500);
      }
    });
    return () => unsubscribe();
  }, [welcomeShown]);

  // Real-time data listeners with error handling
  useEffect(() => {
    if (!user) return;

    const unsubscribers: (() => void)[] = [];

    // Total students
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTotalStudents(docSnap.data().totalStudents || "2026 - 1,852 Students");
        }
      } catch {
        // Use default value on permission error
      }
    };
    fetchSettings();

    // Batch stats with error handling
    try {
      const unsubBatchStats = onSnapshot(
        collection(db, "batchStats"),
        (snapshot) => {
          const stats: BatchStat[] = [];
          snapshot.forEach((docItem) => {
            const data = docItem.data();
            stats.push({
              batch: data.batch,
              value: data.value,
              trend: data.trend,
            });
          });
          if (stats.length > 0) {
            setBatchStats(stats.sort((a, b) => parseInt(a.batch) - parseInt(b.batch)));
          }
        },
        () => {
          // Silent fail - use default data
        }
      );
      unsubscribers.push(unsubBatchStats);
    } catch {
      // Firebase not configured properly
    }

    // Leadership board with error handling
    try {
      const leadershipQuery = query(collection(db, "batchLeadership"), orderBy("rank"));
      const unsubLeadership = onSnapshot(
        leadershipQuery,
        (snapshot) => {
          const items: LeadershipItem[] = [];
          snapshot.forEach((docItem) => {
            const data = docItem.data();
            items.push({
              batch: data.batch,
              rank: data.rank,
              value: data.value,
            });
          });
          if (items.length > 0) {
            setLeadership(items);
          }
        },
        () => {
          // Silent fail - use default data
        }
      );
      unsubscribers.push(unsubLeadership);
    } catch {
      // Firebase not configured properly
    }

    // Mission rank with error handling
    try {
      const missionQuery = query(collection(db, "missionRank"), orderBy("rank"));
      const unsubMission = onSnapshot(
        missionQuery,
        (snapshot) => {
          const items: MissionItem[] = [];
          snapshot.forEach((docItem) => {
            const data = docItem.data();
            items.push({
              batch: data.batch,
              rank: data.rank,
              totalMissions: data.totalMissions || 0,
              successMissions: data.successMissions || 0,
              failedMissions: data.failedMissions || 0,
              highlighted: data.highlighted || false,
            });
          });
          if (items.length > 0) {
            setMissionRank(items);
          }
        },
        () => {
          // Silent fail - use default data
        }
      );
      unsubscribers.push(unsubMission);
    } catch {
      // Firebase not configured properly
    }

    // Ranking with error handling
    try {
      const rankingQuery = query(collection(db, "ranking"), orderBy("points", "desc"));
      const unsubRanking = onSnapshot(
        rankingQuery,
        (snapshot) => {
          const items: RankingItem[] = [];
          snapshot.forEach((docItem) => {
            const data = docItem.data();
            items.push({
              name: data.name,
              points: data.points,
            });
          });
          if (items.length > 0) {
            setRanking(items.slice(0, 10));
          }
        },
        () => {
          // Silent fail - use default data
        }
      );
      unsubscribers.push(unsubRanking);
    } catch {
      // Firebase not configured properly
    }

    // Notice with error handling
    try {
      const unsubNotice = onSnapshot(
        doc(db, "notices", "latest"),
        (docSnap) => {
          if (docSnap.exists()) {
            setNotice(docSnap.data().content || "");
          }
        },
        () => {
          // Silent fail - use default notice
        }
      );
      unsubscribers.push(unsubNotice);
    } catch {
      // Firebase not configured properly
    }

    // Students data with error handling
    try {
      const unsubStudents = onSnapshot(
        collection(db, "students"),
        (snapshot) => {
          const data: Record<string, StudentData> = {};
          snapshot.forEach((docItem) => {
            data[docItem.id] = docItem.data() as StudentData;
          });
          setStudentsData(data);
        },
        () => {
          // Silent fail - use default data
        }
      );
      unsubscribers.push(unsubStudents);
    } catch {
      // Firebase not configured properly
    }

    // Today Class with error handling
    try {
      const unsubTodayClass = onSnapshot(
        doc(db, "settings", "todayClass"),
        (docSnap) => {
          if (docSnap.exists()) {
            setTodayClass(docSnap.data().content || "No Class");
          }
        },
        () => {
          // Silent fail - use default
        }
      );
      unsubscribers.push(unsubTodayClass);
    } catch {
      // Firebase not configured properly
    }

    // Today Update with error handling
    try {
      const unsubTodayUpdate = onSnapshot(
        doc(db, "settings", "todayUpdate"),
        (docSnap) => {
          if (docSnap.exists()) {
            setTodayUpdate(docSnap.data().content || "Welcome to Cloud of Core! Stay tuned for daily updates.");
          }
        },
        () => {
          // Silent fail - use default
        }
      );
      unsubscribers.push(unsubTodayUpdate);
    } catch {
      // Firebase not configured properly
    }

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    setWelcomeShown(false);
  };

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (!query) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      const results: { name: string; batch: string }[] = [];
      Object.entries(BATCH_STUDENTS).forEach(([batch, students]) => {
        students.forEach((name) => {
          if (name.toLowerCase().includes(query.toLowerCase())) {
            results.push({ name, batch });
          }
        });
      });

      setSearchResults(results.slice(0, 5));
      setShowSearchResults(results.length > 0);
    },
    []
  );

  const handleStudentClick = (batch: string, name: string) => {
    setSelectedStudent({ name, batch });
    setShowStudentPopup(true);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const handleBatchClick = (batch: string) => {
    if (batch === "305") {
      setSelectedBatch(null);
      setShowBatch305Leaderboard(true);
    } else {
      setShowBatch305Leaderboard(false);
      setSelectedBatch(batch);
    }
  };

  const getBatch305Leaderboard = () => {
    return BATCH_STUDENTS["305"]
      .map((name) => ({
        name,
        data: studentsData[name] || { totalPoints: 0 },
      }))
      .sort((a, b) => (b.data.totalPoints || 0) - (a.data.totalPoints || 0));
  };

  // Default data for display when no Firebase data
  const defaultBatchStats: BatchStat[] = [
    { batch: "302", value: "9.8K", trend: "down" },
    { batch: "303", value: "15.6K", trend: "up" },
    { batch: "304", value: "7.5K", trend: "down" },
    { batch: "305", value: "21.0K", trend: "up" },
    { batch: "306", value: "12.4K", trend: "up" },
  ];

  const defaultRanking: RankingItem[] = Array.from({ length: 10 }, (_, i) => ({
    name: `Top Student ${i + 1}`,
    points: 2000 - i * 100,
  }));

  const displayBatchStats = batchStats.length > 0 ? batchStats : defaultBatchStats;
  const displayRanking = ranking.length > 0 ? ranking : defaultRanking;

  if (!user) return null;

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-3 border-b-2 border-orange-500/50 bg-[#140f0a]/85 px-5 py-3 backdrop-blur-xl">
        <img
          src="https://i.postimg.cc/kX3Xh6PG/IMG-20260211-135705-716-removebg-preview.png"
          alt="Logo"
          className="h-10 drop-shadow-[0_0_15px_#ff6600]"
        />

        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500/50" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-[40px] border border-orange-500/50 bg-[#1e1914]/70 py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
          />

          <AnimatePresence>
            {showSearchResults && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[200px] overflow-y-auto rounded-xl border border-orange-500 bg-[#2a1f15]"
              >
                {searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleStudentClick(result.batch, result.name)}
                    className="cursor-pointer border-b border-orange-400/30 px-4 py-3 text-orange-400 transition-colors hover:bg-orange-500/20"
                  >
                    {result.name} · Batch {result.batch}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-[30px] border-2 border-orange-500 bg-transparent px-5 py-2.5 text-sm font-semibold text-orange-500 transition-all hover:bg-orange-500 hover:text-black"
        >
          <LogOut className="h-4 w-4" />
          EXIT
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-5">
        {/* Logo */}
        <div className="mb-5 text-center">
          <img
            src="https://i.postimg.cc/kX3Xh6PG/IMG-20260211-135705-716-removebg-preview.png"
            alt="Logo"
            className="mx-auto w-[min(200px,45%)] drop-shadow-[0_0_30px_#ff6600]"
          />
          {/* Server Watermark */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-400"
          >
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
              korean Server
            </span>
            <span className="text-gray-600">|</span>
            <span>Country: Bangladesh</span>
          </motion.div>
        </div>

        {/* Total Students */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center text-2xl font-bold text-orange-400 drop-shadow-[0_0_20px_rgba(255,102,0,0.5)]"
        >
          {totalStudents}
        </motion.div>

        {/* Batch Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
        >
          {displayBatchStats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-[20px] border border-orange-500/50 bg-gradient-to-br from-[#281e14]/80 to-[#140f0a]/90 p-4 text-center backdrop-blur-sm"
            >
              <div className="mb-1 text-sm font-bold text-orange-400">
                BATCH {stat.batch}
              </div>
              <div className="flex items-center justify-center gap-1 text-2xl font-extrabold text-white">
                {stat.value}
                {stat.trend === "up" ? (
                  <TrendingUp className="h-5 w-5 text-orange-300" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-orange-600" />
                )}
              </div>
              <div className="mt-2 text-xs font-semibold uppercase text-orange-400">
                TOTAL POINTS
              </div>
            </div>
          ))}
        </motion.div>

        {/* Today Class Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="mb-4 text-center">
            <h3 className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-2xl font-extrabold text-transparent">
              <Tv className="h-6 w-6 text-orange-400" />
              TODAY CLASS
            </h3>
          </div>

          <div className="relative mx-auto max-w-md overflow-hidden rounded-[30px] border-2 border-orange-500/50 bg-gradient-to-br from-[#281e14]/90 to-[#0a0805]/95 p-6 backdrop-blur-lg">
            {/* Watch-like gradient sides */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-orange-500/30 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-orange-500/30 to-transparent" />
            
            {/* Center content */}
            <div className="relative flex flex-col items-center justify-center py-4">
              {/* Clock icon with pulse animation */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mb-4"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-orange-500/50 bg-orange-500/10 shadow-[0_0_30px_rgba(255,102,0,0.3)]">
                  <Clock className="h-8 w-8 text-orange-400" />
                </div>
              </motion.div>

              {/* Class info */}
              <motion.div
                key={todayClass}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,102,0,0.5)]">
                  {todayClass}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  Updated from Admin Panel
                </p>
              </motion.div>

              {/* Decorative dots */}
              <div className="mt-4 flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                    className="h-2 w-2 rounded-full bg-orange-500"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Best Performance Batch */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="mb-4 text-center">
            <h3 className="inline-block bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-2xl font-extrabold text-transparent">
              <Gem className="mr-2 inline h-6 w-6 text-cyan-400" />
              BEST PERFORMANCE BATCH
            </h3>
            <p className="mt-1 text-sm text-gray-400">Top Performing Batches</p>
          </div>

          <div className="flex flex-col gap-2">
            {leadership.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 rounded-[40px] border px-4 py-3 backdrop-blur-sm ${
                  item.batch === "305"
                    ? "border-2 border-orange-400 bg-gradient-to-r from-orange-500/30 to-orange-600/20 shadow-[0_0_20px_rgba(255,102,0,0.3)]"
                    : "border-orange-500/30 bg-gradient-to-r from-[#281e14]/80 to-[#140f0a]/80"
                }`}
              >
                <span className="w-9 text-lg font-extrabold text-orange-400">
                  #{item.rank}
                </span>
                <div className="w-11 animate-pulse">{getRankBadge(item.rank)}</div>
                <span className="flex-1 text-sm font-semibold">BATCH {item.batch}</span>
                <span className="font-bold text-orange-400">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Mission Success Rank */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="mb-4 text-center">
            <h3 className="inline-block bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-2xl font-extrabold text-transparent">
              🎯 MISSION SUCCESS RANK
            </h3>
            <p className="mt-1 text-sm text-gray-400">Batch Mission Statistics</p>
          </div>

          <div className="flex flex-col gap-2">
            {missionRank.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 rounded-[40px] border px-4 py-3 backdrop-blur-sm ${
                  item.highlighted
                    ? "border-2 border-orange-300 bg-gradient-to-r from-orange-500/25 to-orange-600/15 shadow-[0_0_20px_rgba(255,170,0,0.3)]"
                    : "border-orange-500/40 bg-gradient-to-r from-[#322314]/80 to-[#1e140a]/80"
                }`}
              >
                <span className="w-9 text-lg font-extrabold text-orange-300">
                  #{item.rank}
                </span>
                <div className="w-11 animate-pulse">{getMissionBadge(item.rank)}</div>
                <span className="flex-1 text-sm font-semibold">BATCH {item.batch}</span>
                <div className="flex gap-2 text-xs">
                  <div className="flex flex-col items-center">
                    <span className="text-gray-400">Total</span>
                    <span className="font-bold text-white">{item.totalMissions}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-400">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="font-bold text-orange-300">{item.successMissions}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-400">
                      <X className="h-3 w-3" />
                    </span>
                    <span className="font-bold text-orange-600">{item.failedMissions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Batch Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 flex flex-wrap justify-center gap-3"
        >
          {["302", "303", "304", "305", "306"].map((batch) => (
            <button
              key={batch}
              onClick={() => handleBatchClick(batch)}
              className={`flex items-center gap-2 rounded-[50px] border-2 px-8 py-3.5 text-lg font-bold transition-all ${
                batch === "305"
                  ? "border-orange-300 bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-[0_0_30px_rgba(255,102,0,0.5)] hover:scale-105"
                  : "border-orange-500/70 bg-[#281e14]/80 text-white backdrop-blur-sm hover:bg-orange-500/30"
              }`}
            >
              <Users className="h-5 w-5" />
              BATCH {batch}
              {batch === "305" && " · 7"}
            </button>
          ))}
        </motion.div>

        {/* Student List Container */}
        <AnimatePresence>
          {selectedBatch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 max-h-[380px] overflow-y-auto rounded-3xl border border-orange-500/50 bg-[#140f0a]/70 p-5 backdrop-blur-lg"
            >
              <h3 className="mb-4 text-lg font-bold text-orange-400">
                📚 BATCH {selectedBatch} · {BATCH_STUDENTS[selectedBatch]?.length} STUDENTS
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {BATCH_STUDENTS[selectedBatch]?.map((name, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleStudentClick(selectedBatch, name)}
                    className="cursor-pointer rounded-2xl border border-orange-500/30 bg-[#322814]/80 p-3 text-center text-sm font-medium text-orange-400 transition-all hover:border-orange-400 hover:bg-orange-500/20"
                  >
                    {name}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Batch 305 Leaderboard */}
        <AnimatePresence>
          {showBatch305Leaderboard && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 rounded-[32px] border border-orange-400/50 bg-orange-500/10 p-5 backdrop-blur-sm"
            >
              <h3 className="mb-5 flex items-center justify-center gap-3 text-2xl font-extrabold tracking-wide text-orange-300 drop-shadow-[0_0_8px_#ff6600]">
                <Crown className="h-6 w-6" />
                BATCH 305 LEADERBOARD
                <Crown className="h-6 w-6" />
              </h3>

              <div className="flex flex-col gap-3">
                {getBatch305Leaderboard().map((student, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleStudentClick("305", student.name)}
                    className="flex cursor-pointer items-center gap-4 rounded-[60px] border border-orange-500/50 bg-[#191412]/80 px-5 py-4 backdrop-blur-sm transition-all hover:translate-x-1 hover:border-orange-300 hover:bg-orange-500/20"
                  >
                    <div className="w-14 bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-2xl font-extrabold text-transparent">
                      #{idx + 1}
                    </div>
                    <div className="flex flex-1 items-center gap-2 text-lg font-bold capitalize text-orange-100">
                      {idx === 0 ? (
                        <Crown className="h-5 w-5 text-orange-300" />
                      ) : idx === 1 ? (
                        <Medal className="h-5 w-5 text-orange-300" />
                      ) : idx === 2 ? (
                        <Award className="h-5 w-5 text-orange-300" />
                      ) : (
                        <Star className="h-5 w-5 text-orange-300" />
                      )}
                      {student.name}
                    </div>
                    <div className="rounded-[40px] bg-black/30 px-3 py-1 text-lg font-extrabold text-transparent bg-gradient-to-r from-orange-200 to-orange-300 bg-clip-text">
                      {student.data.totalPoints || 0} pts
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top 10 Leaderboard */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="mb-5 bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-center text-2xl font-extrabold text-transparent">
            🏆 TOP 10 LEADERBOARD
          </h2>

          <div className="flex flex-col gap-2">
            {displayRanking.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-[40px] border border-orange-500/30 bg-gradient-to-r from-[#281e14]/80 to-[#140f0a]/80 px-4 py-3 backdrop-blur-sm"
              >
                <span className="w-9 text-lg font-extrabold text-orange-400">
                  #{idx + 1}
                </span>
                <div className="w-11">
                  {idx < 3 ? (
                    idx === 0 ? (
                      <Trophy className="h-5 w-5 text-yellow-400" />
                    ) : idx === 1 ? (
                      <Medal className="h-5 w-5 text-gray-300" />
                    ) : (
                      <Award className="h-5 w-5 text-orange-600" />
                    )
                  ) : (
                    <Star className="h-5 w-5 text-orange-400" />
                  )}
                </div>
                <span className="flex-1 text-sm font-semibold">{item.name}</span>
                <span className="font-bold text-orange-400">{item.points}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Notice Section */}
        {notice && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8 rounded-[28px] border border-orange-500/50 bg-gradient-to-br from-[#281e14]/70 to-[#140f0a]/80 p-5 backdrop-blur-lg"
          >
            <h2 className="mb-3 text-center text-xl font-bold text-orange-400">
              🔥 LIVE UPDATE 🔥
            </h2>
            <div className="rounded-[18px] border-l-4 border-orange-500 bg-black/30 p-4 text-lg leading-relaxed">
              {notice}
            </div>
          </motion.section>
        )}
      </main>

      {/* Today Update Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mx-5 mb-8"
      >
        <div className="rounded-[28px] border border-orange-500/50 bg-gradient-to-br from-[#1f170f]/90 to-[#0a0805]/95 p-5 backdrop-blur-lg">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Calendar className="h-5 w-5 text-orange-400" />
            <h3 className="bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-xl font-bold text-transparent">
              TODAY UPDATE
            </h3>
            <Bell className="h-5 w-5 text-orange-400" />
          </div>
          
          <div className="rounded-[18px] border-l-4 border-orange-500 bg-black/30 p-4">
            <p className="text-sm leading-relaxed text-gray-300">
              {todayUpdate}
            </p>
            <p className="mt-3 text-xs text-gray-500">
              Daily updates from Cloud of Core Team
            </p>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="mt-auto border-t-2 border-orange-500/50 bg-gradient-to-b from-[#140f0a]/95 to-[#0a0805] px-5 py-10 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl">
          {/* Logo and tagline */}
          <div className="mb-6 flex flex-col items-center">
            <img
              src="https://i.postimg.cc/kX3Xh6PG/IMG-20260211-135705-716-removebg-preview.png"
              alt="Cloud of Core"
              className="mb-3 h-16 drop-shadow-[0_0_20px_rgba(255,102,0,0.5)]"
            />
            <p className="text-center text-sm text-gray-400">
              Empowering Students Worldwide
            </p>
          </div>

          {/* Stats */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-orange-500" />
              <span className="text-gray-400">International Edition</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Server className="h-4 w-4 text-green-500" />
              <span className="text-gray-400">US Server Active</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-gray-400">24/7 Online</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span className="text-gray-400">5 Active Batches</span>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-6 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

          {/* Bottom row */}
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-gray-500">
              Made with <Heart className="inline h-4 w-4 text-red-500" /> for students in Bangladesh
            </p>
            <p className="text-xs text-gray-600">
              CLOUD OF CORE © 2026 · All Rights Reserved
            </p>
            <p className="text-xs text-gray-700">
              Version 2.0.1 · Build 2026.05.06
            </p>
          </div>
        </div>
      </footer>

      {/* Welcome Popup */}
      <WelcomePopup isOpen={showWelcome} onClose={() => setShowWelcome(false)} />

      {/* Student Popup */}
      <StudentPopup
        isOpen={showStudentPopup}
        onClose={() => {
          setShowStudentPopup(false);
          setSelectedStudent(null);
        }}
        studentName={selectedStudent?.name || ""}
        studentData={
          selectedStudent?.batch === "305"
            ? studentsData[selectedStudent.name] || null
            : null
        }
        accessDenied={selectedStudent?.batch !== "305"}
        deniedBatch={selectedStudent?.batch || ""}
      />
    </div>
  );
}
