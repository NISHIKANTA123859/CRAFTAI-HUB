import { useState } from "react";
import { Package, Truck, CheckCircle, Search, MapPin, User, Settings, Home, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await fetch(`http://localhost:5002/api/orders/${orderId.trim()}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.error || "Order not found. Please check the ID.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing": return 1;
      case "shipped": return 2;
      case "delivered": return 3;
      default: return 1;
    }
  };

  const steps = [
    { id: 0, name: "Order Placed", icon: CheckCircle, description: "Order successfully placed", time: "Mar 21, 2026 11:21", color: "bg-green-500" },
    { id: 1, name: "Processing", icon: Settings, description: "Order is being prepared", color: "bg-gray-200" },
    { id: 2, name: "Shipped", icon: Truck, description: "In transit", color: "bg-gray-200" },
    { id: 3, name: "Delivered", icon: Home, description: "Successfully received", color: "bg-gray-200" },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Search Bar / Initial State */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 max-w-2xl mx-auto">
          <form onSubmit={handleTrack} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="text"
                placeholder="Enter Order ID to start..."
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
          {error && <p className="mt-2 text-red-500 text-sm font-bold pl-2">{error}</p>}
        </div>

        <AnimatePresence mode="wait">
          {order ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Product Hero Banner */}
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row h-auto md:h-[350px]">
                <div className="flex-1 bg-red-600 relative overflow-hidden group">
                  <img 
                    src={order.items[0]?.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80"} 
                    alt="Banner" 
                    className="w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <h2 className="text-white text-6xl font-black opacity-20 rotate-[-20deg] select-none uppercase tracking-tighter">
                       CRAFT AI
                     </h2>
                  </div>
                  <img 
                    src={order.items[0]?.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80"} 
                    alt="Product" 
                    className="absolute inset-0 m-auto h-[80%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:-translate-y-4 transition-transform duration-500"
                  />
                </div>
                
                {/* Track Order Section (Right Side) */}
                <div className="w-full md:w-[400px] bg-[#e5e7eb]/50 p-8 flex flex-col">
                  <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Track Order</h3>
                  
                  <div className="flex-1 relative">
                    <div className="absolute left-[21px] top-2 bottom-8 w-0.5 bg-gray-300/50" />
                    
                    <div className="space-y-10 relative">
                      {steps.map((step, idx) => {
                        const currentStatusIdx = getStatusStep(order.status || "processing");
                        const isDone = idx <= currentStatusIdx;
                        const isCurrent = idx === currentStatusIdx;
                        const Icon = step.icon;

                        return (
                          <div key={idx} className="flex gap-6 items-start">
                            <div className={`relative z-10 size-11 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-all duration-500 ${isDone ? 'bg-green-500 text-white' : 'bg-white text-gray-400'}`}>
                              <Icon className="size-5" />
                            </div>
                            <div className="flex flex-col">
                              <h4 className={`text-sm font-black tracking-tight ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                                {step.name}
                              </h4>
                              {isDone && (
                                <>
                                  <p className="text-gray-500 text-sm mt-0.5 font-medium">
                                    {isCurrent ? step.description : step.time || "Approved"}
                                  </p>
                                  {!isCurrent && idx !== 0 && (
                                    <p className="text-gray-400 text-xs mt-0.5">{step.description}</p>
                                  )}
                                </>
                              )}
                              {!isDone && (
                                <p className="text-gray-300 text-sm mt-0.5 font-medium">{step.description}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Information & Payment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
                  <h3 className="text-2xl font-black text-gray-900 mb-10 tracking-tight underline decoration-gray-200 underline-offset-8">
                    Shipping Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2">Recipient</h4>
                      <p className="text-lg font-black text-gray-900">{order.customer.firstName} {order.customer.lastName}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2">Phone</h4>
                      <p className="text-lg font-black text-gray-900">{order.customer.phone || "08117839357"}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2">Address</h4>
                      <p className="text-lg font-black text-gray-900 leading-relaxed max-w-md">
                        {order.customer.address}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2">Payment Method</h4>
                      <p className="text-lg font-black text-gray-900 uppercase tracking-wide">
                        {order.paymentMethod || "CASH ON DELIVERY"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-12 pt-10 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="size-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">
                          <Package className="size-6" />
                       </div>
                       <div>
                         <p className="text-xs font-bold text-gray-400">Total Items</p>
                         <p className="text-lg font-black text-gray-900">{order.items.length} Artisan Piece(s)</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-bold text-gray-400">Amount Paid</p>
                       <p className="text-3xl font-black text-gray-900">₹{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Back Link or Additional Info */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-purple-200 transition-all">
                  <div className="size-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <ArrowRight className="size-8 text-gray-300 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-sm text-gray-500 font-medium">Contact our support if you have any questions about your craft journey.</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <div className="size-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mx-auto mb-8 text-gray-200">
                <Search className="size-12" />
              </div>
              <h2 className="text-2xl font-black text-gray-400 italic">Enter your Order ID above to see the magic...</h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
