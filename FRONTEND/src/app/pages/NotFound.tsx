import { Link } from "react-router";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <p className="text-xl text-purple-200/60 mb-8">Page not found</p>
        
        <div className="flex flex-col gap-4">
          <Link
            to="/home"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-purple-500/30 text-purple-300 font-bold hover:bg-purple-500/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Go to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
