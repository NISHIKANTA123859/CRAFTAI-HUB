import { ShoppingBag, Star } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const products = [
  {
    id: 1,
    name: "Handwoven Ceramic Bowl",
    price: 45,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    rating: 4.8,
    artisan: "Maria Santos",
    origin: "Mexico",
  },
  {
    id: 2,
    name: "Traditional Textile Runner",
    price: 89,
    image: "https://images.unsplash.com/photo-1771098302176-3dea27fdba7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    rating: 4.9,
    artisan: "Anita Sharma",
    origin: "India",
  },
  {
    id: 3,
    name: "Artisan Pottery Vase",
    price: 67,
    image: "https://images.unsplash.com/photo-1768052272552-0b7193787d72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    rating: 4.7,
    artisan: "Kenji Tanaka",
    origin: "Japan",
  },
  {
    id: 4,
    name: "Handwoven Basket Set",
    price: 52,
    image: "https://images.unsplash.com/photo-1768902406144-a348c559c73c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    rating: 4.6,
    artisan: "Amara Okafor",
    origin: "Ghana",
  },
  {
    id: 5,
    name: "Artisan Jewelry Collection",
    price: 125,
    image: "https://images.unsplash.com/photo-1766560360266-38abfd6ce9a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    rating: 5.0,
    artisan: "Sofia Rodriguez",
    origin: "Peru",
  },
  {
    id: 6,
    name: "Cultural Heritage Piece",
    price: 95,
    image: "https://images.unsplash.com/photo-1771344166583-9054619f5e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    rating: 4.8,
    artisan: "Chen Wei",
    origin: "China",
  },
];

const categories = ["All", "Pottery", "Textiles", "Baskets", "Jewelry", "Wood Crafts"];

export function CraftMarket() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/30">
            <ShoppingBag className="size-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CraftMarket AI</h1>
          <p className="text-xl text-gray-600">Discover and purchase authentic handcrafted treasures</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                category === "All"
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white text-gray-700 hover:bg-purple-50 border border-purple-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-purple-100/50"
            >
              {/* Product Image */}
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Product Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="size-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-yellow-700">{product.rating}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <p>By {product.artisan}</p>
                  <p className="text-gray-500">{product.origin}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                  <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
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