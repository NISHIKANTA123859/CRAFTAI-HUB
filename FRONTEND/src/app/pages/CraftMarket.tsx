import { ShoppingBag, Star, ShoppingCart, Check, Sparkles, X, ShieldCheck, MapPin, Info } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";

const products = [
  // Pottery (2)
  {
    id: 1,
    name: "Handwoven Ceramic Bowl",
    price: 3690,
    category: "Pottery",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    rating: 4.8,
    artisan: "Maria Santos",
    origin: "Mexico",
  },
  {
    id: 2,
    name: "Artisan Pottery Vase",
    price: 5495,
    category: "Pottery",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    rating: 4.7,
    artisan: "Kenji Tanaka",
    origin: "Japan",
  },
  // Textiles (2)
  {
    id: 3,
    name: "Traditional Textile Runner",
    price: 7299,
    category: "Textiles",
    image: "https://images.unsplash.com/photo-1494122353634-c310f45a6d3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    rating: 4.9,
    artisan: "Anita Sharma",
    origin: "India",
  },
  {
    id: 4,
    name: "Hand Block Printed Scarf",
    price: 3250,
    category: "Textiles",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    rating: 4.6,
    artisan: "Priya Mehta",
    origin: "Rajasthan",
  },
  // Baskets (2)
  {
    id: 5,
    name: "Handmade Savannah Basket Set",
    price: 4260,
    category: "Baskets",
    image: "https://images.unsplash.com/photo-1622701893201-9bc9eb616690?auto=format&fit=crop&h=600&w=600&q=80",
    rating: 4.9,
    artisan: "Amara Okafor",
    origin: "Bolgatanga, Ghana",
    description: "Authentic Elephant Grass weave using triple-strand techniques for extreme durability and vibrant colors.",
  },
  {
    id: 6,
    name: "Wicker Storage Nest",
    price: 2890,
    category: "Baskets",
    image: "https://images.unsplash.com/photo-1543251796-0a7eb9b9cc08?auto=format&fit=crop&h=600&w=600&q=80",
    rating: 4.8,
    artisan: "Fatima Al-Rashid",
    origin: "Chefchaouen, Morocco",
    description: "Natural willow fibers hand-harvested and sun-dried for a rustic, eco-friendly aesthetic.",
  },
  // Jewelry (2)
  {
    id: 7,
    name: "Artisan Jewelry Collection",
    price: 10250,
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    rating: 5.0,
    artisan: "Sofia Rodriguez",
    origin: "Peru",
  },
  {
    id: 8,
    name: "Silver Filigree Earrings",
    price: 6800,
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    rating: 4.9,
    artisan: "Lakshmi Devi",
    origin: "Tamil Nadu",
  },
  // Wood Crafts (2)
  {
    id: 9,
    name: "Wooden Heritage Piece",
    price: 7790,
    category: "Wood Crafts",
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    rating: 4.8,
    artisan: "Chen Wei",
    origin: "China",
  },
  {
    id: 10,
    name: "Hand Carved Wooden Elephant",
    price: 5100,
    category: "Wood Crafts",
    image: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    rating: 4.8,
    artisan: "Raju Vishwakarma",
    origin: "Jaipur",
  },
];

const categories = ["All", "Pottery", "Textiles", "Baskets", "Jewelry", "Wood Crafts"];

export function CraftMarket() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addedId, setAddedId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const handleBuyNow = (product: any) => {
    addToCart(product);
    navigate("/marketplace/checkout");
  };

  const handleAnalyzeProduct = async (product: any) => {
    setAnalyzingId(product.id);
    try {
      const response = await fetch("http://localhost:5002/api/analyze-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: product.image })
      });
      const data = await response.json();
      if (data.success) {
        setAnalysisResult({ ...data, productName: product.name });
      } else {
        alert("AI Analysis failed. Please try again later.");
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      alert("Could not connect to AI service.");
    } finally {
      setAnalyzingId(null);
    }
  };

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 relative">
      {/* Analysis Results Modal */}
      <AnimatePresence>
        {analysisResult && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAnalysisResult(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-purple-100"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-8 text-white relative">
                <button 
                  onClick={() => setAnalysisResult(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X className="size-6" />
                </button>
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Sparkles className="size-8 fill-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest opacity-80">AI Craft Analysis</h2>
                    <h3 className="text-3xl font-black">{analysisResult.productName}</h3>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100/50">
                    <div className="flex items-center gap-2 text-purple-600 font-bold mb-2">
                      <MapPin className="size-4" />
                      Traceable Origin
                    </div>
                    <p className="text-xl font-black text-gray-900">{analysisResult.origin}</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-3xl border border-green-100/50">
                    <div className="flex items-center gap-2 text-green-600 font-bold mb-2">
                      <ShieldCheck className="size-4" />
                      Authenticity Score
                    </div>
                    <p className="text-xl font-black text-gray-900">{analysisResult.authenticity}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-900 font-black text-lg">
                    <Info className="size-5 text-purple-600" />
                    Heritage Description
                  </div>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {analysisResult.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-gray-900 text-sm uppercase tracking-wider text-center">Analysis Breakdown</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {analysisResult.reason.map((reason: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl text-sm font-bold text-gray-700 border border-purple-50">
                        <div className="size-2 rounded-full bg-purple-500" />
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setAnalysisResult(null)}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all"
                >
                  Close Insights
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/30">
            <ShoppingBag className="size-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">CraftMarket AI</h1>
          <p className="text-xl text-gray-600">Discover and purchase authentic handcrafted treasures</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/30 -translate-y-0.5"
                  : "bg-white text-gray-700 hover:bg-purple-50 border border-purple-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-purple-100/50"
            >
              {/* Product Image */}
              <div className="aspect-square overflow-hidden bg-gray-100 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-emerald-500/30 flex items-center gap-1">
                    <Check className="size-2.5 stroke-[4px]" />
                    Handmade
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => handleAnalyzeProduct(product)}
                    disabled={analyzingId === product.id}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-xl text-purple-600 shadow-xl hover:bg-white transition-all group/ai"
                  >
                    {analyzingId === product.id ? (
                      <div className="size-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="size-5 group-hover/ai:fill-purple-600 transition-all" />
                    )}
                  </button>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-xl text-purple-600 shadow-xl hover:bg-purple-600 hover:text-white transition-all"
                  >
                    {addedId === product.id ? <Check className="size-5" /> : <ShoppingCart className="size-5" />}
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="size-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-yellow-700">{product.rating}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <p className="font-medium text-purple-600">By {product.artisan}</p>
                  <p className="text-gray-400 capitalize mb-2">{product.origin}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed italic">
                    "{product.description || "Authentic handcrafted piece meticulously created using traditional techniques."}"
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Price</span>
                    <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
                  </div>
                  <button 
                    onClick={() => handleBuyNow(product)}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wide"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}