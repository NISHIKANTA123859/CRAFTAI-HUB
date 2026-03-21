import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router";
import { ShoppingBag, CreditCard, Truck, CheckCircle, ChevronLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Extract form data
    const formData = new FormData(e.target as HTMLFormElement);
    const customer = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      address: formData.get("address"),
    };

    try {
      const response = await fetch("http://localhost:5002/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
          items: cart,
          total: cartTotal,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        clearCart();
      } else {
        alert(data.error || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Failed to connect to the server. Please ensure the backend is running.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6 border border-green-100"
        >
          <div className="size-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
            <CheckCircle className="size-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900">Order Placed!</h1>
            <p className="text-gray-500">Thank you for supporting traditional artisans. Your treasures will be on their way soon.</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600">
            Order ID: #CRAFT-{Math.floor(Math.random() * 1000000)}
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-500/30 hover:-translate-y-1 transition-all"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-purple-50/30 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate("/marketplace")}
          className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors mb-8 font-bold"
        >
          <ChevronLeft className="size-5" />
          Back to Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Truck className="size-6 text-purple-600" />
                Shipping Details
              </h2>
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">First Name</label>
                    <input name="firstName" required className="w-full px-4 py-3 rounded-xl bg-purple-50/50 border border-purple-100 focus:ring-2 focus:ring-purple-500 outline-none transition-all" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Last Name</label>
                    <input name="lastName" required className="w-full px-4 py-3 rounded-xl bg-purple-50/50 border border-purple-100 focus:ring-2 focus:ring-purple-500 outline-none transition-all" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email Address</label>
                  <input name="email" required type="email" className="w-full px-4 py-3 rounded-xl bg-purple-50/50 border border-purple-100 focus:ring-2 focus:ring-purple-500 outline-none transition-all" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Shipping Address</label>
                  <input name="address" required className="w-full px-4 py-3 rounded-xl bg-purple-50/50 border border-purple-100 focus:ring-2 focus:ring-purple-500 outline-none transition-all" placeholder="123 Artisan Lane" />
                </div>
                
                <h2 className="text-2xl font-black text-gray-900 mt-12 mb-8 flex items-center gap-3">
                  <CreditCard className="size-6 text-purple-600" />
                  Payment Information
                </h2>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Card Number</label>
                  <input required className="w-full px-4 py-3 rounded-xl bg-purple-50/50 border border-purple-100 focus:ring-2 focus:ring-purple-500 outline-none transition-all" placeholder="0000 0000 0000 0000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Expiry Date</label>
                    <input required className="w-full px-4 py-3 rounded-xl bg-purple-50/50 border border-purple-100 focus:ring-2 focus:ring-purple-500 outline-none transition-all" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">CVV</label>
                    <input required className="w-full px-4 py-3 rounded-xl bg-purple-50/50 border border-purple-100 focus:ring-2 focus:ring-purple-500 outline-none transition-all" placeholder="123" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || cart.length === 0}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-bold shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0"
                >
                  {isProcessing ? (
                    <div className="size-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Place Order
                      <ArrowRight className="size-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100 space-y-6">
              <h2 className="text-2xl font-black text-gray-900 border-b border-purple-50 pb-4">Order Summary</h2>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="size-16 rounded-xl overflow-hidden bg-gray-50 border border-purple-50 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="font-bold text-purple-600 text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {cart.length === 0 && <p className="text-gray-500 text-center py-8">Your cart is empty</p>}
              </div>

              <div className="pt-6 border-t border-purple-50 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-purple-50">
                  <span className="text-lg font-black text-gray-900">Total</span>
                  <span className="text-3xl font-black bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 flex gap-4 items-start">
                <ShoppingBag className="size-6 text-purple-600 flex-shrink-0" />
                <p className="text-xs text-purple-700 leading-relaxed font-medium">
                  Your purchase directly empowers artisans and helps preserve traditional craft techniques for future generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
