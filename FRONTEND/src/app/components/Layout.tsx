import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { Sparkles, Menu, X, Home as HomeIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="size-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                <Sparkles className="size-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                CraftAI Hub
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-10">
              <Link
                to="/"
                className={`transition-all font-bold px-4 py-2 rounded-xl flex items-center gap-2 ${
                  isActive('/') && location.pathname === '/'
                    ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/50'
                }`}
              >
                <HomeIcon className="size-4" />
                Home
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="p-3 rounded-2xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors border border-purple-100 shadow-sm"
              >
                {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Links */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-purple-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-6 space-y-3">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                    isActive('/') && location.pathname === '/'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-purple-50/50 text-gray-700 hover:bg-purple-50'
                  }`}
                >
                  <HomeIcon className="size-5" />
                  Home
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-purple-100 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-purple-400">
            <Sparkles className="size-5" />
          </div>
          <p className="text-gray-500 font-medium">
            © 2026 CraftAI Hub | Preserving Global Heritage
          </p>
          <p className="text-xs text-purple-300 font-bold tracking-[0.2em] uppercase">
            Built for Innovation
          </p>
        </div>
      </footer>
    </div>
  );
}