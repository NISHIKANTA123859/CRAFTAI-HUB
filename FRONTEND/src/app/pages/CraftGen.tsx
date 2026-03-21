import { useState } from "react";
import { Wand2, Download } from "lucide-react";

const craftTypes = [
  "Pottery",
  "Textile Weaving",
  "Basket Weaving",
  "Wood Carving",
  "Jewelry Making",
  "Embroidery",
  "Metalwork",
];

const designStyles = [
  "Traditional",
  "Modern",
  "Minimalist",
  "Geometric",
  "Floral",
  "Abstract",
  "Cultural Fusion",
];

export function CraftGen() {
  const [craftType, setCraftType] = useState("");
  const [designStyle, setDesignStyle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!craftType || !designStyle) return;

    setGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      // Use a sample generated design image
      setGeneratedImage("https://images.unsplash.com/photo-1610701596007-11502861dcfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080");
      setGenerating(false);
    }, 3000);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/30">
            <Wand2 className="size-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CraftGen AI</h1>
          <p className="text-xl text-gray-600">Generate unique craft designs powered by AI</p>
        </div>

        {/* Generator Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-purple-100/50">
          <div className="space-y-6">
            {/* Craft Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Craft Type
              </label>
              <select
                value={craftType}
                onChange={(e) => setCraftType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Choose a craft type...</option>
                {craftTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Design Style Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Design Style
              </label>
              <select
                value={designStyle}
                onChange={(e) => setDesignStyle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Choose a design style...</option>
                {designStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!craftType || !designStyle || generating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <span className="flex items-center justify-center gap-2">
                  <Wand2 className="size-5 animate-spin" />
                  Generating Design...
                </span>
              ) : (
                "Generate Design"
              )}
            </button>
          </div>
        </div>

        {/* Generated Output */}
        {generatedImage && (
          <div className="bg-white rounded-3xl shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 border border-purple-100/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Generated Design</h2>
            
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={generatedImage}
                  alt="Generated craft design"
                  className="w-full h-auto"
                />
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2">
                  <Download className="size-5" />
                  Download Design
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Generate New
                </button>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-sm text-purple-900">
                  <span className="font-semibold">Style:</span> {designStyle} {craftType}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}