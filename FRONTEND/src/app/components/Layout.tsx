import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Sparkles, Menu, X, Home as HomeIcon, ShoppingCart, Trash2, Plus, Minus, ShoppingBag, LayoutDashboard, Package } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "../context/CartContext";

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();
  
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
            <div className="hidden md:flex items-center gap-6">
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
              <Link
                to="/admin"
                className={`transition-all font-bold px-4 py-2 rounded-xl flex items-center gap-2 ${
                  isActive('/admin')
                    ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/50'
                }`}
              >
                <LayoutDashboard className="size-4" />
                Admin
              </Link>
              <Link
                to="/track-order"
                className={`transition-all font-bold px-4 py-2 rounded-xl flex items-center gap-2 ${
                  isActive('/track-order')
                    ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/50'
                }`}
              >
                <Package className="size-4" />
                Track Order
              </Link>
              
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 rounded-2xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all border border-purple-100 shadow-sm group"
              >
                <ShoppingCart className="size-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold size-5 flex items-center justify-center rounded-full shadow-lg border-2 border-white animate-in zoom-in duration-300">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu & Cart Button */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 rounded-2xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors border border-purple-100 shadow-sm"
              >
                <ShoppingCart className="size-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold size-5 flex items-center justify-center rounded-full shadow-lg border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
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
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                    isActive('/admin')
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-purple-50/50 text-gray-700 hover:bg-purple-50'
                  }`}
                >
                  <LayoutDashboard className="size-5" />
                  Admin Portal
                </Link>
                <Link
                  to="/track-order"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                    isActive('/track-order')
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-purple-50/50 text-gray-700 hover:bg-purple-50'
                  }`}
                >
                  <Package className="size-5" />
                  Track Order
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-purple-900/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
            >
              <div className="p-6 border-b border-purple-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <ShoppingBag className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                    <p className="text-xs text-purple-600 font-semibold">{cartCount} items selected</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-purple-600 shadow-sm border border-transparent hover:border-purple-100"
                >
                  <X className="size-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="size-20 bg-purple-50 rounded-full flex items-center justify-center text-purple-200">
                      <ShoppingCart className="size-10" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Your cart is empty</h3>
                      <p className="text-gray-500">Discover authentic crafts in our marketplace</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate("/marketplace");
                      }}
                      className="px-6 py-3 bg-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-500/30 hover:-translate-y-1 transition-all"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="size-24 rounded-2xl overflow-hidden bg-gray-100 border border-purple-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-gray-900 truncate pr-2">{item.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">By {item.artisan}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 bg-purple-50 rounded-xl p-1 border border-purple-100">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-white rounded-lg transition-colors text-purple-600"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="text-sm font-bold w-4 text-center text-purple-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-white rounded-lg transition-colors text-purple-600"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-purple-100 bg-gray-50/50 space-y-4">
                  <div className="flex justify-between items-center text-gray-600 px-2">
                    <span className="font-medium">Subtotal</span>
                    <span className="text-xl font-bold text-gray-900">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => {
                        setIsCartOpen(false);
                        navigate("/marketplace/checkout");
                    }}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-bold shadow-xl shadow-purple-500/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

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