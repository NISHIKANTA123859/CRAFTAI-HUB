import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ShoppingBag, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../context/AuthContext";

// ─── Particle System ──────────────────────────────────────────────────────────
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? "rgba(167,139,250,0.8)" : i % 3 === 1 ? "rgba(96,165,250,0.7)" : "rgba(251,191,36,0.6)",
          }}
          animate={{ y: [0, -(Math.random() * 80 + 40), 0], x: [0, (Math.random() - 0.5) * 60, 0], opacity: [0.3, 1, 0.3], scale: [0.8, 1.4, 0.8] }}
          transition={{ duration: Math.random() * 6 + 5, repeat: Infinity, delay: Math.random() * 5, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function FloatingOrbs() {
  return (
    <>
      <motion.div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(109,40,217,0.4) 0%, transparent 70%)" }} animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 70%)" }} animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
      <motion.div className="absolute -bottom-32 left-1/3 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)" }} animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 4 }} />
    </>
  );
}

function ScannerOverlay() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #1a0533 50%, #0a0a1a 100%)" }}>
      <div className="relative mb-8">
        <motion.div className="w-32 h-32 rounded-full border-2 border-purple-500/30" animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute inset-4 rounded-full border-2 border-blue-400/50" animate={{ rotate: -360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
        <div className="absolute inset-8 rounded-full flex items-center justify-center">
          <Sparkles className="size-8 text-purple-300" />
        </div>
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <motion.div className="absolute w-full h-0.5 left-0" style={{ background: "linear-gradient(90deg, transparent, #a78bfa, transparent)" }} animate={{ top: ["-2px", "130px", "-2px"] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
        </div>
      </div>
      <motion.p className="text-purple-300 font-bold text-lg tracking-[0.3em] uppercase mb-2" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
        Authenticating
      </motion.p>
      <p className="text-purple-500/60 text-sm tracking-widest">CraftAI Hub System</p>
    </motion.div>
  );
}

function InputField({ icon, type, placeholder, value, onChange, error }: { icon: React.ReactNode; type: string; placeholder: string; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <div>
      <div className="group relative">
        <div className="relative rounded-xl overflow-hidden transition-all duration-300 group-focus-within:scale-[1.01]" style={{ border: `1px solid ${error ? "rgba(239,68,68,0.6)" : "rgba(167,139,250,0.2)"}` }}>
          <div className="absolute inset-0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.1), rgba(59,130,246,0.05))" }} />
          <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: "0 0 0 1px rgba(167,139,250,0.5), 0 0 20px rgba(109,40,217,0.15)" }} />
          <div className="relative flex items-center">
            <div className="pl-4 pr-2 flex-shrink-0" style={{ color: error ? "rgba(239,68,68,0.7)" : "rgba(167,139,250,0.5)" }}>{icon}</div>
            <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 py-3.5 pr-4 bg-transparent text-sm font-medium outline-none placeholder:text-purple-300/30" style={{ color: "rgba(255,255,255,0.9)" }} />
          </div>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-400 pl-1">{error}</p>}
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState<UserRole>("buyer");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    setTimeout(() => {
      login({ username, email, role });
      setLoading(false);
      navigate(role === "seller" ? "/marketplace" : "/home");
    }, 2500);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0f0728 35%, #0a0f2e 65%, #0a0a1a 100%)" }}>
      <AnimatePresence>{loading && <ScannerOverlay />}</AnimatePresence>
      <FloatingOrbs />
      <Particles />

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: `linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: "easeOut" }} className="relative z-10 w-full max-w-md mx-4">
        {/* Glow halo */}
        <div className="absolute inset-0 rounded-3xl blur-2xl -z-10 opacity-40" style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.6), rgba(59,130,246,0.4))" }} />

        {/* Card */}
        <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(24px)", border: "1px solid rgba(167,139,250,0.25)", boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)" }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.8), rgba(96,165,250,0.6), transparent)" }} />

          {/* Branding */}
          <div className="text-center mb-7">
            <motion.div className="inline-flex items-center justify-center size-16 rounded-2xl mb-4" style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.8), rgba(59,130,246,0.6))", boxShadow: "0 0 30px rgba(109,40,217,0.5)", border: "1px solid rgba(167,139,250,0.4)" }} animate={{ boxShadow: ["0 0 20px rgba(109,40,217,0.4)", "0 0 40px rgba(109,40,217,0.7)", "0 0 20px rgba(109,40,217,0.4)"] }} transition={{ duration: 3, repeat: Infinity }}>
              <Sparkles className="size-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-black tracking-tight mb-1" style={{ background: "linear-gradient(135deg, #a78bfa, #60a5fa, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              CraftAI Hub
            </h1>
            <p className="text-sm font-medium" style={{ color: "rgba(167,139,250,0.7)" }}>Where Tradition Meets Intelligence</p>
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest mb-3 text-center" style={{ color: "rgba(167,139,250,0.5)" }}>I am a</p>
            <div className="grid grid-cols-2 gap-3">
              {(["buyer", "seller"] as UserRole[]).map((r) => (
                <motion.button
                  key={r}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRole(r)}
                  className="py-3 rounded-xl flex flex-col items-center gap-1.5 transition-all duration-300 font-bold text-sm"
                  style={{
                    background: role === r ? "linear-gradient(135deg, rgba(109,40,217,0.4), rgba(59,130,246,0.3))" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${role === r ? "rgba(167,139,250,0.6)" : "rgba(167,139,250,0.15)"}`,
                    color: role === r ? "rgba(167,139,250,1)" : "rgba(167,139,250,0.4)",
                    boxShadow: role === r ? "0 0 20px rgba(109,40,217,0.2)" : "none",
                  }}
                >
                  {r === "buyer" ? <User className="size-5" /> : <ShoppingBag className="size-5" />}
                  {r === "buyer" ? "Buyer / User" : "Craft Seller"}
                </motion.button>
              ))}
            </div>
            {/* Role hint */}
            <p className="mt-2 text-center text-xs" style={{ color: "rgba(167,139,250,0.35)" }}>
              {role === "buyer" ? "→ Goes to AI Dashboard" : "→ Goes to Seller Market"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <InputField icon={<User className="size-4" />} type="text" placeholder="Username" value={username} onChange={setUsername} error={errors.username} />
            <InputField icon={<Mail className="size-4" />} type="email" placeholder="Gmail address" value={email} onChange={setEmail} error={errors.email} />

            {/* Password */}
            <div>
              <div className="group relative">
                <div className="relative rounded-xl overflow-hidden transition-all duration-300" style={{ border: `1px solid ${errors.password ? "rgba(239,68,68,0.6)" : "rgba(167,139,250,0.2)"}` }}>
                  <div className="absolute inset-0 opacity-0 group-focus-within:opacity-100 transition-opacity" style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.1), rgba(59,130,246,0.05))" }} />
                  <div className="relative flex items-center">
                    <div className="pl-4 pr-2" style={{ color: errors.password ? "rgba(239,68,68,0.7)" : "rgba(167,139,250,0.5)" }}><Lock className="size-4" /></div>
                    <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="flex-1 py-3.5 pr-4 bg-transparent text-sm font-medium outline-none placeholder:text-purple-300/30" style={{ color: "rgba(255,255,255,0.9)" }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-4 pl-2" style={{ color: "rgba(167,139,250,0.5)" }}>
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400 pl-1">{errors.password}</p>}
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs font-semibold transition-colors" style={{ color: "rgba(167,139,250,0.5)" }}>Forgot Password?</button>
            </div>

            {/* Submit */}
            <motion.button type="submit" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="relative w-full py-4 rounded-xl font-bold text-white text-sm tracking-wider uppercase overflow-hidden" style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", boxShadow: "0 0 30px rgba(124,58,237,0.4), 0 8px 32px rgba(0,0,0,0.3)", border: "1px solid rgba(167,139,250,0.3)" }}>
              <div className="absolute top-0 left-0 right-0 h-px bg-white/30" />
              <span className="relative flex items-center justify-center gap-2">
                <Sparkles className="size-4" />
                Login to CraftAI Hub
              </span>
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px" style={{ background: "rgba(167,139,250,0.15)" }} />
            <span className="text-xs font-semibold" style={{ color: "rgba(167,139,250,0.4)" }}>OR</span>
            <div className="flex-1 h-px" style={{ background: "rgba(167,139,250,0.15)" }} />
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wider uppercase" style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", color: "rgba(167,139,250,0.8)" }}>
            Create Account
          </motion.button>

          <p className="text-center text-xs mt-5" style={{ color: "rgba(167,139,250,0.3)" }}>Secured by CraftAI · Powered by Gemini</p>
        </div>
      </motion.div>
    </div>
  );
}
