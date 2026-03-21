import { useState, useEffect } from "react";
import { 
  History as HistoryIcon, 
  Trash2, 
  ChevronRight, 
  Search, 
  Calendar,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getHistory, clearHistory, HistoryRecord } from "../services/historyService";
import { useNavigate } from "react-router";

export function History() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    const data = await getHistory();
    setHistory(data);
    setLoading(false);
  };

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear your entire history?")) {
      await clearHistory();
      setHistory([]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF5FF] py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-purple-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-purple-600 font-bold mb-4 hover:gap-3 transition-all"
            >
              <ArrowLeft className="size-4" />
              Back to Analyzer
            </button>
            <div className="flex items-center gap-4">
              <div className="size-14 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-purple-100">
                <HistoryIcon className="size-7 text-[#6D28D9]" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-[#1F2937] tracking-tight">Craft History</h1>
                <p className="text-[#6B7280] font-medium">Your past AI-powered craft discoveries</p>
              </div>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-red-100 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition-all shadow-sm"
            >
              <Trash2 className="size-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="size-12 border-4 border-purple-100 border-t-[#6D28D9] rounded-full animate-spin mb-4" />
            <p className="text-[#6B7280] font-medium">Loading your history...</p>
          </div>
        ) : history.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white rounded-[40px] p-20 border border-purple-100/50 shadow-xl shadow-purple-500/5"
          >
            <div className="size-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="size-10 text-[#6D28D9] opacity-40" />
            </div>
            <h2 className="text-3xl font-bold text-[#1F2937] mb-4">No history yet</h2>
            <p className="text-[#6B7280] max-w-md mx-auto mb-10 text-lg leading-relaxed">
              Start by analyzing a craft image to build your personal collection of traditional art discoveries.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-10 py-5 bg-gradient-to-r from-[#6D28D9] to-[#EC4899] text-white rounded-[24px] font-bold text-lg shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
            >
              Analyze New Image
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {history.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group bg-white rounded-[32px] overflow-hidden border border-purple-100/50 shadow-lg shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={record.image} 
                      alt={record.craft} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-purple-50 flex items-center gap-2">
                      <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-black text-[#6D28D9]">{record.authenticity} Match</span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-widest mb-3">
                      <Calendar className="size-3" />
                      {formatDate(record.createdAt)}
                    </div>
                    <h3 className="text-2xl font-black text-[#1F2937] mb-2">{record.craft}</h3>
                    <p className="text-[#6B7280] font-medium mb-4 flex items-center gap-2 text-sm italic">
                      From {record.origin}
                    </p>
                    <p className="text-[#4B5563] text-sm leading-relaxed mb-6 line-clamp-2">
                       {record.description}
                    </p>
                    
                    <button className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-2xl text-[#6D28D9] font-bold group-hover:bg-[#6D28D9] group-hover:text-white transition-all">
                      <span>View Details</span>
                      <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
