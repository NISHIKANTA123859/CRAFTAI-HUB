import { Link } from "react-router";
import { Eye, Wand2, ShoppingBag, ShieldCheck, Landmark, History } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "CraftVision AI",
    description: "Identify crafts from images",
    path: "/recognition",
    gradient: "from-purple-500 to-purple-700",
  },
  {
    icon: Wand2,
    title: "CraftGen AI",
    description: "Generate new craft designs",
    path: "/craft-gen",
    gradient: "from-purple-600 to-pink-500",
  },
  {
    icon: ShoppingBag,
    title: "CraftMarket AI",
    description: "Buy and sell handicrafts",
    path: "/marketplace",
    gradient: "from-pink-500 to-purple-500",
  },
  {
    icon: ShieldCheck,
    title: "CraftAuth AI",
    description: "Verify craft authenticity",
    path: "/craft-auth",
    gradient: "from-purple-700 to-pink-600",
  },
  {
    icon: Landmark,
    title: "CraftVerse Museum",
    description: "Explore cultural heritage",
    path: "/museum",
    gradient: "from-purple-600 to-pink-600",
  },
  {
    icon: History,
    title: "Craft History",
    description: "View your past AI analyses",
    path: "/history",
    gradient: "from-pink-600 to-purple-700",
  },
];

export function Home() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            CraftAI Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Preserving culture, empowering artisans, and connecting the world through AI
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.path}
                to={feature.path}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-purple-100/50 hover:border-purple-200"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`size-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30`}>
                    <Icon className="size-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
                {/* Gradient border effect on hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}