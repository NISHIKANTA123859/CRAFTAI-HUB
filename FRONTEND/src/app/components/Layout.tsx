import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Sparkles, Menu, X, Home as HomeIcon, LogOut, User, ShoppingBag, Eye, Wand2, ShieldCheck, Landmark, History as HistoryIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";

const buyerLinks = [
  { to: "/home", label: "Home", icon: HomeIcon },
  { to: "/recognition", label: "CraftVision", icon: Eye },
  { to: "/craft-gen", label: "CraftGen", icon: Wand2 },
  { to: "/craft-auth", label: "CraftAuth", icon: ShieldCheck },
  { to: "/marketplace", label: "Market", icon: ShoppingBag },
  { to: "/museum", label: "Museum", icon: Landmark },
  { to: "/history", label: "History", icon: HistoryIcon },
];

const sellerLinks = [
  { to: "/marketplace", label: "My Market", icon: ShoppingBag },
];

// ─── Logout Confirmation Modal ─────────────────────────────────────────────────
function LogoutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-purple-100"
      >
        <div className="flex items-center justify-center size-16 rounded-2xl bg-red-50 mx-auto mb-5">
          <LogOut className="size-8 text-red-500" />
        </div>
        <h3 className="text-xl font-black text-gray-900 text-center mb-2">Logout?</h3>
        <p className="text-gray-500 text-sm text-center mb-7">Are you sure you want to logout from CraftAI Hub?</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-500/25"
          >
            Yes, Logout
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const links = user?.role === "seller" ? sellerLinks : buyerLinks;

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      <AnimatePresence>{showLogout && <LogoutModal onConfirm={handleLogout} onCancel={() => setShowLogout(false)} />}</AnimatePresence>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={user?.role === "seller" ? "/marketplace" : "/home"} className="flex items-center gap-3 group">
              <div className="size-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                <Sparkles className="size-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                CraftAI Hub
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`transition-all font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 text-sm ${
                    isActive(to)
                      ? "bg-purple-50 text-purple-700 shadow-sm border border-purple-100"
                      : "text-gray-600 hover:text-purple-600 hover:bg-purple-50/60"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {label}
                </Link>
              ))}
            </div>

            {/* User + Logout */}
            <div className="hidden md:flex items-center gap-3">
              {user && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-100">
                  <div className="size-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                    {user.role === "seller" ? <ShoppingBag className="size-3.5 text-white" /> : <User className="size-3.5 text-white" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 leading-none">{user.username}</p>
                    <p className="text-[10px] text-purple-500 font-semibold capitalize leading-none mt-0.5">{user.role}</p>
                  </div>
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLogout(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-500 border border-red-100 hover:bg-red-50 transition-all"
              >
                <LogOut className="size-4" />
                Logout
              </motion.button>
            </div>

            {/* Mobile menu btn */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 rounded-2xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors border border-purple-100">
                {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-purple-100 bg-white overflow-hidden">
              <div className="px-4 py-4 space-y-2">
                {links.map(({ to, label, icon: Icon }) => (
                  <Link key={to} to={to} onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${isActive(to) ? "bg-purple-600 text-white shadow-lg" : "bg-purple-50/50 text-gray-700 hover:bg-purple-50"}`}>
                    <Icon className="size-4" />
                    {label}
                  </Link>
                ))}
                <button onClick={() => { setIsMenuOpen(false); setShowLogout(true); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-all">
                  <LogOut className="size-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1"><Outlet /></main>

      <footer className="bg-white border-t border-purple-100 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-purple-400"><Sparkles className="size-4" /></div>
          <p className="text-gray-500 font-medium text-sm">© 2026 CraftAI Hub · Preserving Global Heritage</p>
          <p className="text-xs text-purple-300 font-bold tracking-[0.2em] uppercase">Built for Innovation</p>
        </div>
      </footer>
    </div>
  );
}