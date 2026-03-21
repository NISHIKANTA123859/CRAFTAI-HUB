import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  Package, 
  Clock, 
  ChevronRight,
  ExternalLink,
  Search
} from "lucide-react";
import { motion } from "motion/react";

interface Order {
  id: string;
  timestamp: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
  };
  items: any[];
  total: number;
}

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/orders");
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalCustomers = new Set(orders.map(o => o.customer.email)).size;

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 font-medium">Manage your marketplace and track artisan sales</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={fetchOrders}
              className="px-4 py-2 bg-white border border-purple-100 rounded-xl text-sm font-bold text-purple-600 shadow-sm hover:bg-purple-50 transition-all flex items-center gap-2"
            >
              <Clock className="size-4" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "bg-green-500", text: "text-green-600" },
            { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "bg-purple-500", text: "text-purple-600" },
            { label: "Total Customers", value: totalCustomers, icon: Users, color: "bg-blue-500", text: "text-blue-600" },
            { label: "Avg. Order Value", value: `₹${orders.length ? Math.round(totalRevenue / orders.length) : 0}`, icon: BarChart3, color: "bg-pink-500", text: "text-pink-600" },
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className="bg-white p-6 rounded-3xl shadow-sm border border-purple-100/50 flex items-center gap-5"
            >
              <div className={`size-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}>
                <stat.icon className="size-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Orders Table Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden">
          <div className="p-6 border-b border-purple-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-black text-gray-900">Recent Orders</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-purple-100 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none w-full md:w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Products</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-8 h-16 bg-gray-50/20"></td>
                    </tr>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-gray-400 font-medium">
                      <Package className="size-12 mx-auto mb-4 opacity-20" />
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-purple-50/30 transition-colors group">
                      <td className="px-6 py-4 uppercase font-bold text-xs text-purple-600">
                        {order.id.split('-').slice(0, 2).join('-')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{order.customer.firstName} {order.customer.lastName}</span>
                          <span className="text-xs text-gray-500">{order.customer.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="size-6 rounded-md overflow-hidden bg-gray-50 border border-purple-50 flex-shrink-0">
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                              </div>
                              <span className="text-xs font-bold text-gray-700 truncate max-w-[150px]">
                                {item.name} <span className="text-purple-400">x{item.quantity}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider rounded-full">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-black text-gray-900">₹{order.total.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-gray-500 font-medium">
                        {new Date(order.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
