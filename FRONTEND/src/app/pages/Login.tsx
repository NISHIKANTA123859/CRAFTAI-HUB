import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  Eye, EyeOff, Mail, Lock, User, Sparkles, 
  ShoppingBag, ShieldCheck, ChevronRight, Fingerprint
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth, UserRole } from "../context/AuthContext";

// ─── Gamified Success Popup ──────────────────────────────────────────────────
function GamifiedSuccessPopup({ role, score, onComplete }: { role: string; score: number; onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10, 10, 26, 0.8)", backdropFilter: "blur(20px)" }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50, rotateX: 20 }}
        animate={{ scale: 1, y: 0, rotateX: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        className="w-full max-w-sm rounded-[2rem] p-8 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(20,20,40,0.9) 0%, rgba(10,10,26,0.9) 100%)",
          border: "1px solid rgba(167,139,250,0.3)",
          boxShadow: "0 25px 50px -12px rgba(109,40,217,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}
      >
        {/* Glow behind badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-600/30 rounded-full blur-[40px] pointer-events-none" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1], rotate: [0, 15, -10, 0] }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_40px_rgba(167,139,250,0.6)]"
        >
          <ShieldCheck className="size-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10"
        >
          <h2 className="text-3xl font-black text-white mb-2 drop-shadow-lg">Access Granted</h2>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Sparkles className="size-4 text-yellow-400" />
            <span className="text-sm font-bold text-yellow-400 uppercase tracking-widest">
              {role === "seller" ? "Verified Artisan" : "Trusted Buyer"}
            </span>
          </div>

          <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">AI Trust Score</p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400"
            >
              {score}%
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── 3D Floating Background Elements ─────────────────────────────────────────
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 perspective-1000">
      <motion.div 
        animate={{ y: [0, -30, 0], rotateX: [0, 10, 0], rotateY: [0, 15, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[10%] opacity-20"
      >
        <ShoppingBag className="size-32 text-purple-500" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 40, 0], rotateX: [0, -15, 0], rotateY: [0, -20, 0] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[20%] right-[10%] opacity-20"
      >
        <Fingerprint className="size-40 text-blue-500" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, -50, 0], rotateZ: [0, 360] }} 
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[40%] left-[80%] opacity-15"
      >
        <ShieldCheck className="size-24 text-pink-500" />
      </motion.div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<UserRole>("buyer");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successScore, setSuccessScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          role
        })
      });

      const data = await response.json();

      if (data.success) {
        setLoading(false);
        setSuccessMessage("Registration successful! You can now login.");
        setTimeout(() => {
          setIsRegistering(false);
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setSuccessMessage(null);
        }, 2000);
      } else {
        setLoading(false);
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setLoading(false);
      setError("Connection error. Please ensure the server is running on port 5001.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (data.success && data.user) {
        setLoading(false);
        // Generate random high trust score for gamification
        const trustScore = Math.floor(Math.random() * (99 - 88 + 1)) + 88;
        setSuccessScore(trustScore);
        
        // Store the logged-in user info for use in finalizeLogin
        sessionStorage.setItem("loginUser", JSON.stringify(data.user));
      } else {
        setLoading(false);
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false);
      setError("Connection error. Please ensure the server is running on port 5001.");
    }
  };

  const finalizeLogin = () => {
    const userData = JSON.parse(sessionStorage.getItem("loginUser") || "{}");
    login({ username: userData.username, email: userData.email, role: userData.role });
    sessionStorage.removeItem("loginUser");
    navigate(userData.role === "seller" ? "/marketplace" : "/home");
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-[#05050a]">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(76,29,149,0.15)_0%,rgba(0,0,0,0)_50%)]" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(30,58,138,0.15)_0%,rgba(0,0,0,0)_50%)]" />
      
      <FloatingElements />

      <AnimatePresence>
        {successScore && (
          <GamifiedSuccessPopup 
            role={role} 
            score={successScore} 
            onComplete={finalizeLogin} 
          />
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px] mx-4 perspective-1000"
      >
        {/* Glow behind card */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-[100px] -z-10 rounded-[3rem]" />

        {/* The 3D Glassmorphism Card */}
        <motion.div 
          whileHover={{ rotateX: 2, rotateY: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden"
          style={{
            background: "rgba(20, 20, 35, 0.4)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 30px 60px -15px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)",
            transformStyle: "preserve-3d"
          }}
        >
          {/* Header */}
          <div className="text-center mb-10 transform-gpu translate-z-10">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 mb-5 relative shadow-[0_0_30px_rgba(147,51,234,0.4)]"
            >
              <div className="absolute inset-[2px] bg-[#0a0a16] rounded-[14px] flex items-center justify-center flex-col">
                <Fingerprint className="size-8 text-white/90" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 tracking-tight mb-2">
              {isRegistering ? "Create Identity" : "CraftAI Hub"}
            </h1>
            <p className="text-sm font-medium text-purple-200/50">
              {isRegistering ? "Join the CraftAI Community" : "Secure Smart Authentication"}
            </p>
          </div>

          {!isRegistering && (
            <>
              {/* Role Selection - Login Only */}
              <div className="flex gap-3 mb-8 transform-gpu translate-z-10 bg-black/30 p-1.5 rounded-2xl border border-white/5">
                {(["buyer", "seller"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative overflow-hidden"
                    style={{
                      color: role === r ? "#fff" : "rgba(255,255,255,0.4)"
                    }}
                  >
                    {role === r && (
                      <motion.div 
                        layoutId="role-active"
                        className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-blue-600/50 rounded-xl"
                        style={{ border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {r === "buyer" ? <User className="size-3.5" /> : <ShoppingBag className="size-3.5" />}
                      {r}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {isRegistering && (
            <>
              {/* Role Selection - Registration Only */}
              <div className="flex gap-3 mb-8 transform-gpu translate-z-10 bg-black/30 p-1.5 rounded-2xl border border-white/5">
                {(["buyer", "seller"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative overflow-hidden"
                    style={{
                      color: role === r ? "#fff" : "rgba(255,255,255,0.4)"
                    }}
                  >
                    {role === r && (
                      <motion.div 
                        layoutId="role-active-reg"
                        className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-blue-600/50 rounded-xl"
                        style={{ border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {r === "buyer" ? <User className="size-3.5" /> : <ShoppingBag className="size-3.5" />}
                      {r}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 rounded-lg bg-green-500/15 border border-green-500/30 text-green-300 text-xs font-medium"
              >
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4 transform-gpu translate-z-10 relative z-20">
            {/* Username Input - Registration Only */}
            {isRegistering && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-400/50 group-focus-within:text-purple-400 transition-colors z-10">
                  <User className="size-5" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-medium outline-none focus:border-purple-500/50 focus:bg-purple-900/10 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] relative z-0"
                  placeholder="Username"
                />
              </div>
            )}

            {/* Email Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-400/50 group-focus-within:text-purple-400 transition-colors z-10">
                <Mail className="size-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-medium outline-none focus:border-purple-500/50 focus:bg-purple-900/10 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] relative z-0"
                placeholder="Email Address"
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-400/50 group-focus-within:text-purple-400 transition-colors z-10">
                <Lock className="size-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white text-sm font-medium outline-none focus:border-purple-500/50 focus:bg-purple-900/10 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] relative z-0"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-400/50 hover:text-white transition-colors z-10"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>

            {/* Confirm Password Input - Registration Only */}
            {isRegistering && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-400/50 group-focus-within:text-purple-400 transition-colors z-10">
                  <Lock className="size-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white text-sm font-medium outline-none focus:border-purple-500/50 focus:bg-purple-900/10 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] relative z-0"
                  placeholder="Confirm Password"
                />
              </div>
            )}

            {!isRegistering && (
              <div className="flex justify-end pt-1 mb-2">
                <a href="#" className="text-xs font-bold text-purple-400/60 hover:text-purple-400 transition-colors">
                  Recover Access?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02, translateZ: 20 }}
              whileTap={{ scale: 0.98, translateZ: -10 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-white text-sm uppercase tracking-widest relative overflow-hidden group shadow-[0_10px_30px_rgba(124,58,237,0.3)] transition-all"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
                border: "1px solid rgba(255,255,255,0.2)"
              }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isRegistering ? "Creating Account..." : "Authenticating AI..."}
                  </>
                ) : (
                  <>
                    {isRegistering ? "Create Account" : "Initialize Session"}
                    <ChevronRight className="size-4" />
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="mt-8 text-center transform-gpu translate-z-10">
            <p className="text-xs font-medium text-white/40">
              {isRegistering ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setIsRegistering(false);
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-purple-400 font-bold hover:text-white transition-colors border-b border-purple-400/30 pb-0.5 ml-1 cursor-pointer bg-none border-none p-0"
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  New to CraftAI Hub?{" "}
                  <button
                    onClick={() => {
                      setIsRegistering(true);
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-purple-400 font-bold hover:text-white transition-colors border-b border-purple-400/30 pb-0.5 ml-1 cursor-pointer bg-none border-none p-0"
                  >
                    Create Identity
                  </button>
                </>
              )}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
