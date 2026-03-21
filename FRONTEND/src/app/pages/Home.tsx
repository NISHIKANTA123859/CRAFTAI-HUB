import { Link } from "react-router";
import { Eye, Wand2, ShoppingBag, ShieldCheck, Landmark, History, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: Eye,
    title: "CraftVision AI",
    description: "Upload any craft image and instantly identify it with AI precision.",
    path: "/recognition",
    gradient: "from-violet-500 to-purple-700",
    glow: "rgba(139,92,246,0.3)",
    tag: "Vision AI",
  },
  {
    icon: Wand2,
    title: "CraftGen AI",
    description: "Generate stunning traditional craft designs in seconds using AI.",
    path: "/craft-gen",
    gradient: "from-purple-600 to-pink-500",
    glow: "rgba(219,39,119,0.3)",
    tag: "Generative AI",
  },
  {
    icon: ShoppingBag,
    title: "CraftMarket AI",
    description: "Buy and sell authentic handicrafts in our AI-powered marketplace.",
    path: "/marketplace",
    gradient: "from-pink-500 to-rose-500",
    glow: "rgba(244,63,94,0.3)",
    tag: "Marketplace",
  },
  {
    icon: ShieldCheck,
    title: "CraftAuth AI",
    description: "Verify if a craft is GENUINE or FAKE with deep AI analysis.",
    path: "/craft-auth",
    gradient: "from-emerald-500 to-teal-600",
    glow: "rgba(20,184,166,0.3)",
    tag: "Authentication",
  },
  {
    icon: Landmark,
    title: "CraftVerse Museum",
    description: "Explore India's rich cultural heritage in a digital museum.",
    path: "/museum",
    gradient: "from-amber-500 to-orange-500",
    glow: "rgba(245,158,11,0.3)",
    tag: "Museum",
  },
  {
    icon: History,
    title: "Craft History",
    description: "View your complete AI analysis history and saved results.",
    path: "/history",
    gradient: "from-blue-500 to-indigo-600",
    glow: "rgba(99,102,241,0.3)",
    tag: "History",
  },
];



export function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">

      {/* Background orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(109,40,217,0.25) 0%, transparent 70%)" }} />
      <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)" }} />

      <div className="relative z-10 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Top bar: greeting */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center mb-12"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="size-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-purple-400 font-bold uppercase tracking-widest">Welcome back</p>
                <p className="text-white font-black text-lg leading-tight">{user?.username || "User"} 👋</p>
              </div>
            </div>
          </motion.div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-xs font-bold uppercase tracking-widest" style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", color: "rgba(167,139,250,0.9)" }}>
              <span className="size-1.5 rounded-full bg-purple-400 animate-pulse" />
              AI-Powered Platform
            </div>
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-5"
              style={{ background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #fbbf24 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              CraftAI Hub
            </h1>
            <p className="text-lg text-purple-200/60 max-w-xl mx-auto font-medium">
              Where Tradition Meets Intelligence · Explore all AI-powered craft tools below
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.path}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                >
                  <Link
                    to={feature.path}
                    className="group block h-full rounded-3xl p-6 relative overflow-hidden transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ boxShadow: `inset 0 0 40px ${feature.glow}` }}
                    />
                    {/* Hover border */}
                    <div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ border: `1px solid ${feature.glow.replace("0.3", "0.5")}` }}
                    />

                    <div className="relative z-10">
                      {/* Tag */}
                      <span
                        className="inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-4"
                        style={{ background: `${feature.glow}`, color: "rgba(255,255,255,0.8)" }}
                      >
                        {feature.tag}
                      </span>

                      {/* Icon */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`size-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                        style={{ boxShadow: `0 8px 24px ${feature.glow}` }}
                      >
                        <Icon className="size-7 text-white" />
                      </motion.div>

                      <h3 className="text-xl font-black text-white mb-2 group-hover:text-purple-200 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-white/50 leading-relaxed mb-5">{feature.description}</p>

                      <div className="flex items-center gap-1 text-xs font-bold" style={{ color: feature.glow.replace("0.3", "0.9") }}>
                        Explore
                        <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-xs mt-12 font-bold uppercase tracking-widest"
            style={{ color: "rgba(167,139,250,0.3)" }}
          >
            © 2026 CraftAI Hub · Preserving Global Heritage · Powered by Gemini AI
          </motion.p>
        </div>
      </div>
    </div>
  );
}