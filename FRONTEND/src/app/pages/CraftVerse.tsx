import { useState } from "react";
import { Landmark, X } from "lucide-react";

const crafts = [
  {
    id: 1,
    name: "Madhubani Painting",
    image: "https://images.unsplash.com/photo-1768052272552-0b7193787d72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    shortDesc: "Traditional Indian folk art",
    origin: "Bihar, India",
    story: "Madhubani painting is an ancient art form that originated in the Mithila region of Bihar. Created primarily by women, these paintings feature intricate geometric patterns and vibrant colors derived from natural sources. The art form has been passed down through generations, depicting themes from Hindu mythology, nature, and social events.",
  },
  {
    id: 2,
    name: "Traditional Weaving",
    image: "https://images.unsplash.com/photo-1771098302176-3dea27fdba7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    shortDesc: "Handwoven textile artistry",
    origin: "Various Regions",
    story: "Traditional weaving techniques have been practiced for thousands of years across cultures. Each region developed unique patterns, colors, and methods that reflect their cultural identity and environmental resources. These textiles often carry symbolic meanings and are used in ceremonies and daily life.",
  },
  {
    id: 3,
    name: "Ceramic Pottery",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    shortDesc: "Ancient pottery tradition",
    origin: "Worldwide Heritage",
    story: "Pottery is one of humanity's oldest crafts, dating back over 20,000 years. Different cultures developed distinctive styles and techniques for creating functional and decorative ceramic pieces. The craft requires deep knowledge of clay properties, firing techniques, and artistic vision passed through apprenticeships.",
  },
  {
    id: 4,
    name: "Basket Weaving",
    image: "https://images.unsplash.com/photo-1768902406144-a348c559c73c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    shortDesc: "Woven natural fiber art",
    origin: "Indigenous Traditions",
    story: "Basket weaving is an ancient craft using natural materials like willow, reed, and grass. Indigenous communities worldwide have developed sophisticated weaving techniques to create both utilitarian and ceremonial baskets. The patterns and styles often hold cultural significance and tell stories of the community.",
  },
  {
    id: 5,
    name: "Artisan Jewelry",
    image: "https://images.unsplash.com/photo-1766560360266-38abfd6ce9a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    shortDesc: "Traditional metalwork craft",
    origin: "Global Heritage",
    story: "Traditional jewelry making combines metalworking, stone setting, and artistic design. Artisans use techniques like filigree, granulation, and lost-wax casting that have been refined over centuries. Each piece often carries cultural symbolism and represents the wearer's status, beliefs, or heritage.",
  },
  {
    id: 6,
    name: "Cultural Artifacts",
    image: "https://images.unsplash.com/photo-1771344166583-9054619f5e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    shortDesc: "Historical cultural pieces",
    origin: "Ancient Civilizations",
    story: "Cultural artifacts represent the tangible heritage of civilizations. These objects provide insights into historical societies, their beliefs, technologies, and daily lives. Preserving these artifacts helps maintain cultural identity and allows future generations to connect with their ancestral roots.",
  },
];

export function CraftVerse() {
  const [selectedCraft, setSelectedCraft] = useState<typeof crafts[0] | null>(null);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/30">
            <Landmark className="size-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CraftVerse Museum</h1>
          <p className="text-xl text-gray-600">Explore the world's cultural heritage and traditional crafts</p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {crafts.map((craft) => (
            <div
              key={craft.id}
              onClick={() => setSelectedCraft(craft)}
              className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-purple-100/50"
            >
              {/* Craft Image */}
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={craft.image}
                  alt={craft.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Craft Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {craft.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{craft.shortDesc}</p>
                <p className="text-gray-500 text-sm">📍 {craft.origin}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedCraft && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedCraft(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedCraft.name}</h2>
                <button
                  onClick={() => setSelectedCraft(null)}
                  className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="size-6 text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Large Image */}
                <div className="rounded-2xl overflow-hidden mb-6">
                  <img
                    src={selectedCraft.image}
                    alt={selectedCraft.name}
                    className="w-full h-auto"
                  />
                </div>

                {/* Origin */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">ORIGIN</h3>
                  <p className="text-lg text-gray-900">{selectedCraft.origin}</p>
                </div>

                {/* Cultural Story */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">CULTURAL STORY</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedCraft.story}</p>
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-purple-900">
                    This artifact represents centuries of cultural heritage and traditional craftsmanship passed down through generations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}