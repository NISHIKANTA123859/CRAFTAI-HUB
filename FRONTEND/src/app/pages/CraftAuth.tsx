import { useState, useRef, useEffect } from "react";
import { ShieldCheck, Upload, CheckCircle2, XCircle, RefreshCcw, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { authenticateCraft } from "../services/authService";

interface AuthResult {
  authenticity_score: string;
  status: "GENUINE" | "FAKE";
  analysis: string[];
  success: boolean;
  error?: string;
}

// Circular Progress Indicator component
function CircularProgress({ score, isGenuine }: { score: number; isGenuine: boolean }) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * score);
      setDisplayScore(start);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [score]);

  const genuineGradientId = "genuine-gradient";
  const fakeGradientId = "fake-gradient";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="180" height="180" className="-rotate-90">
        <defs>
          <linearGradient id={genuineGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id={fakeGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke={isGenuine ? "#D1FAE5" : "#FEE2E2"}
          strokeWidth="12"
        />
        {/* Progress arc */}
        <motion.circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke={`url(#${isGenuine ? genuineGradientId : fakeGradientId})`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-black tabular-nums ${isGenuine ? "text-emerald-600" : "text-red-500"}`}>
          {displayScore}%
        </span>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Score</span>
      </div>
    </div>
  );
}

export function CraftAuth() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [result, setResult] = useState<AuthResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleAuthenticate = async () => {
    if (!selectedFile) return;
    setAuthenticating(true);
    setError(null);

    try {
      const data = await authenticateCraft(selectedFile);
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "Failed to authenticate craft. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to the authentication service.");
    } finally {
      setAuthenticating(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  const score = result ? parseInt(result.authenticity_score.replace("%", ""), 10) || 0 : 0;
  const isGenuine = result?.status === "GENUINE";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="inline-flex items-center justify-center size-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl mb-6 shadow-2xl shadow-purple-500/25"
          >
            <ShieldCheck className="size-10 text-white" />
          </motion.div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-3">
            CraftAuth AI
          </h1>
          <p className="text-xl text-gray-500 max-w-md mx-auto leading-relaxed">
            Upload a craft image to instantly verify its authenticity using AI
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Upload Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-purple-100/60 p-8 mb-6">
                <label
                  htmlFor="auth-upload"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? "border-purple-500 bg-purple-50 scale-[1.01]"
                      : "border-purple-200 hover:border-purple-400 hover:bg-purple-50/40"
                  }`}
                >
                  <div className={`size-16 rounded-full flex items-center justify-center mb-5 transition-colors ${isDragging ? "bg-purple-600" : "bg-purple-100"}`}>
                    <Upload className={`size-8 transition-colors ${isDragging ? "text-white" : "text-purple-500"}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {isDragging ? "Drop it here!" : "Drag & drop your craft image"}
                  </h3>
                  <p className="text-gray-400 text-sm">or click to browse your files &middot; PNG, JPG up to 10MB</p>
                  <input
                    ref={fileInputRef}
                    id="auth-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {selectedImage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6"
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
                      <img
                        src={selectedImage}
                        alt="Craft to authenticate"
                        className="w-full max-h-80 object-contain bg-gray-50"
                      />
                    </div>

                    {error && (
                      <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAuthenticate}
                        disabled={authenticating}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all disabled:opacity-60 flex items-center justify-center gap-3"
                      >
                        {authenticating ? (
                          <>
                            <Loader2 className="size-5 animate-spin" />
                            Authenticating...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="size-5" />
                            Verify Authenticity
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={reset}
                        className="px-6 border-2 border-purple-100 text-purple-600 rounded-2xl font-semibold hover:bg-purple-50 transition-all"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Result Card */}
              <div className="bg-white rounded-3xl shadow-2xl border border-purple-100/60 overflow-hidden">
                {/* Result Header */}
                <div className={`p-8 ${isGenuine ? "bg-gradient-to-br from-emerald-50 to-green-50 border-b border-emerald-100" : "bg-gradient-to-br from-red-50 to-rose-50 border-b border-red-100"}`}>
                  <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${isGenuine ? "text-emerald-500" : "text-red-400"}`}>
                    Craft Authenticity Result
                  </p>
                  <h2 className="text-3xl font-black text-gray-900">
                    Authentication Complete
                  </h2>
                </div>

                <div className="p-8">
                  {/* Score + Status */}
                  <div className="flex flex-col sm:flex-row items-center gap-10 mb-10">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <CircularProgress score={score} isGenuine={isGenuine} />
                    </motion.div>

                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider mb-3">Status</p>
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, type: "spring" }}
                        className={`inline-flex items-center gap-3 px-7 py-3 rounded-full font-black text-xl shadow-lg mb-4 ${
                          isGenuine
                            ? "bg-emerald-500 text-white shadow-emerald-500/30"
                            : "bg-red-500 text-white shadow-red-500/30"
                        }`}
                      >
                        {isGenuine ? <CheckCircle2 className="size-6" /> : <XCircle className="size-6" />}
                        {result.status}
                      </motion.div>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {isGenuine
                          ? "This craft displays strong markers of authentic traditional artisanship."
                          : "This craft shows signs of machine production or design reproduction."}
                      </p>
                    </div>
                  </div>

                  {/* Analysis Section */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                      <span>🔍</span> Why this result?
                    </h3>
                    <div className="space-y-3">
                      {result.analysis.map((point, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          whileHover={{ scale: 1.01, x: 4 }}
                          className="flex items-start gap-4 bg-slate-50 hover:bg-slate-100 transition-all p-4 rounded-2xl cursor-default border border-slate-100"
                        >
                          <div className={`size-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isGenuine ? "bg-emerald-100" : "bg-red-100"}`}>
                            <Check className={`size-4 ${isGenuine ? "text-emerald-600" : "text-red-500"}`} />
                          </div>
                          <p className="text-gray-700 text-sm font-medium leading-relaxed">{point}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={reset}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-2xl font-bold text-base shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                  <Upload className="size-5" />
                  Upload Another Image
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setResult(null); setAuthenticating(false); }}
                  className="flex-1 border-2 border-purple-200 text-purple-700 py-4 rounded-2xl font-bold text-base hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCcw className="size-5" />
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}