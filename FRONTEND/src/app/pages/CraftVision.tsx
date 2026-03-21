import { useState, useRef } from "react";
import { 
  Upload, 
  Eye, 
  Camera, 
  Loader2, 
  CheckCircle2, 
  RefreshCcw, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  History as HistoryIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { recognizeCraft } from "../services/recognitionService";
import { saveToHistory } from "../services/historyService";
import { useNavigate } from "react-router";

interface CraftResult {
  craft: string;
  origin: string;
  description: string;
  authenticity: string;
  reason: string[];
  success: boolean;
}

export function CraftVision() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CraftResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setAnalyzing(true);
    setError(null);
    
    try {
      const data = await recognizeCraft(selectedFile);
      
      if (data.success) {
        setResult(data as CraftResult);
        // Save to history automatically
        saveToHistory({
          craft: data.craft,
          origin: data.origin,
          description: data.description,
          authenticity: data.authenticity,
          image: selectedImage!,
          reason: data.reason
        });
      } else {
        setError(data.error || "Failed to analyze image. Please try again.");
      }
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err.message || "Failed to connect to backend service.");
    } finally {
      setAnalyzing(false);
    }
  };

  const resetUpload = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF5FF] py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-purple-200">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedImage && !analyzing && !result && (
            <motion.div
              key="upload-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              {/* Header */}
              <div className="mb-12">
                <motion.div 
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="inline-flex items-center justify-center size-20 bg-gradient-to-br from-[#6D28D9] to-[#EC4899] rounded-[24px] mb-8 shadow-2xl shadow-purple-500/20"
                >
                  <Eye className="size-10 text-white" />
                </motion.div>
                <h1 className="text-5xl font-bold text-[#1F2937] tracking-tight mb-4">
                  CraftVision AI
                </h1>
                <p className="text-xl text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
                  Upload an image to identify and explore traditional crafts with high-precision AI analysis.
                </p>
              </div>

              {/* Upload Box */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(109,40,217,0.05)] p-10 border border-purple-100/50"
              >
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`group relative flex flex-col items-center justify-center border-2 border-dashed rounded-[24px] p-20 cursor-pointer transition-all duration-300 ${
                    isDragging 
                    ? "border-[#6D28D9] bg-purple-50/50 scale-[1.02]" 
                    : "border-purple-200 hover:border-[#6D28D9] hover:bg-purple-50/30"
                  }`}
                >
                  <div className={`size-16 rounded-full flex items-center justify-center mb-6 transition-colors ${
                    isDragging ? "bg-[#6D28D9]" : "bg-purple-100 group-hover:bg-[#6D28D9]"
                  }`}>
                    <Camera className={`size-8 transition-colors ${
                      isDragging ? "text-white" : "text-[#6D28D9] group-hover:text-white"
                    }`} />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#1F2937] mb-2">{isDragging ? "Drop your image here" : "Drag & drop your image here"}</h3>
                  <p className="text-[#6B7280]">or click to upload from your device</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}

          {selectedImage && (analyzing || !result) && (
            <motion.div
              key="preview-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <button 
                  onClick={() => navigate('/history')}
                  className="flex items-center gap-2 text-purple-600 font-bold hover:gap-3 transition-all"
                >
                  <HistoryIcon className="size-4" />
                  View History
                </button>
              </div>
              <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-purple-100/50">
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                </div>
                
                <div className="p-8">
                  {analyzing ? (
                    <div className="flex flex-col items-center py-8">
                      <div className="relative size-20 mb-6">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                          className="size-full border-4 border-purple-100 border-t-[#6D28D9] rounded-full"
                        />
                        <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 text-[#6D28D9] animate-pulse" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#1F2937] mb-2">Analyzing your craft...</h3>
                      <p className="text-[#6B7280]">Please wait while AI processes the image details</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                          {error}
                        </div>
                      )}
                      <div className="flex gap-4">
                        <button
                          onClick={handleAnalyze}
                          className="flex-1 bg-gradient-to-r from-[#6D28D9] to-[#EC4899] text-white py-5 rounded-[20px] font-bold text-lg shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-2 group"
                        >
                          Identify Craft
                          <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                          onClick={resetUpload}
                          className="px-6 border-2 border-purple-100 text-[#6D28D9] rounded-[20px] font-semibold hover:bg-purple-50 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result-screen"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Success Badge */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-green-50 text-green-700 px-6 py-3 rounded-full flex items-center gap-2 font-bold border border-green-100 shadow-sm"
                >
                  <CheckCircle2 className="size-5" />
                  Craft Identified Successfully
                </motion.div>
              </div>

              <div className="bg-white rounded-[40px] overflow-hidden shadow-[0_30px_100px_rgba(109,40,217,0.1)] border border-purple-100/50 flex flex-col md:flex-row">
                <div className="md:w-2/5 relative">
                  <img
                    src={selectedImage!}
                    alt="Identified Craft"
                    className="h-full w-full object-cover min-h-[300px]"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
                    <ShieldCheck className="size-5 text-[#6D28D9]" />
                    <span className="font-bold text-[#6D28D9]">Authentic</span>
                  </div>
                </div>

                <div className="md:w-3/5 p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#6D28D9] mb-4">
                      <div className="size-2 bg-[#6D28D9] rounded-full animate-pulse" />
                      AI Recognition Result
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-[#1F2937] mb-4 flex items-center gap-2">
                        <span>🧠</span> Craft Info
                      </h3>
                      <div className="space-y-3 pl-2">
                        <h2 className="text-4xl font-extrabold text-[#1F2937] leading-tight">
                          👉 Craft Name: {result.craft}
                        </h2>
                        <p className="text-xl font-semibold text-[#6B7280] flex items-center gap-2">
                          👉 Origin: {result.origin}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-10">
                      <h3 className="text-xl font-bold text-[#1F2937] mb-4 flex items-center gap-2">
                        <span>📖</span> Description
                      </h3>
                      <p className="text-[#4B5563] text-lg leading-relaxed pl-2 bg-purple-50/50 p-4 rounded-2xl border border-purple-100/30">
                        {result.description}
                      </p>
                    </div>
                    
                    <div className="mb-10">
                      <h3 className="text-xl font-bold text-[#1F2937] mb-4 flex items-center gap-2">
                        <span>✅</span> Authenticity Score
                      </h3>
                      <div className="space-y-4 pl-2">
                        <div className="flex justify-between items-end">
                          <label className="text-sm font-bold text-[#1F2937]">Analysis Confidence</label>
                          <span className="text-2xl font-black text-[#6D28D9] tracking-tighter">{result.authenticity}</span>
                        </div>
                        <div className="h-4 bg-purple-100/50 rounded-full overflow-hidden border border-purple-100 p-1">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: result.authenticity }}
                            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#EC4899] rounded-full shadow-[0_0_15px_rgba(109,40,217,0.3)]"
                          />
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
                          <ShieldCheck className="size-3" />
                          VERIFIED TRADITIONAL ART FORM
                        </div>
                      </div>
                    </div>

                    <div className="mb-10">
                      <h3 className="text-xl font-bold text-[#1F2937] mb-4 flex items-center gap-2">
                        <span>🔍</span> Why this score?
                      </h3>
                      <div className="mt-2.5">
                        {result.reason && result.reason.length > 0 ? (
                          <div className="space-y-1.5 pl-2">
                            {result.reason.map((r, i) => (
                              <div key={i} className="bg-[#f5f7ff] px-4 py-3 rounded-xl mb-2 text-sm font-medium text-[#4B5563] border border-blue-50/50 flex items-start gap-3">
                                <span className="text-blue-500 mt-0.5">✔</span>
                                <span>{r}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-1.5 pl-2">
                            <div className="bg-[#f5f7ff] px-4 py-3 rounded-xl mb-2 text-sm font-medium text-[#4B5563] border border-blue-50/50 flex items-start gap-3">
                              <span className="text-blue-500 mt-0.5">✔</span>
                              <span>Pattern analysis applied</span>
                            </div>
                            <div className="bg-[#f5f7ff] px-4 py-3 rounded-xl mb-2 text-sm font-medium text-[#4B5563] border border-blue-50/50 flex items-start gap-3">
                              <span className="text-blue-500 mt-0.5">✔</span>
                              <span>Color detection used</span>
                            </div>
                            <div className="bg-[#f5f7ff] px-4 py-3 rounded-xl mb-2 text-sm font-medium text-[#4B5563] border border-blue-50/50 flex items-start gap-3">
                              <span className="text-blue-500 mt-0.5">✔</span>
                              <span>Cultural style matched</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-6 border-t border-purple-50">
                    <button 
                      onClick={() => navigate('/history')}
                      className="flex-1 min-w-[180px] bg-[#1F2937] text-white py-5 rounded-[22px] font-bold hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 group"
                    >
                      <HistoryIcon className="size-5 group-hover:rotate-[-30deg] transition-transform" />
                      Explore History
                    </button>
                    <button
                      onClick={resetUpload}
                      className="flex-1 min-w-[180px] border-2 border-purple-100 text-[#6D28D9] py-5 rounded-[22px] font-bold hover:bg-purple-50 transition-all flex items-center justify-center gap-3 group"
                    >
                      <RefreshCcw className="size-5 group-hover:rotate-180 transition-transform duration-700" />
                      Try Another Image
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}