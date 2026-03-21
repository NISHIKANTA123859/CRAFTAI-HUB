import { useState } from "react";
import { Wand2, Download, AlertCircle } from "lucide-react";
import { generateCraftDesign } from "../services/generationService";

const craftTypes = [
  "Madhubani",
  "Warli",
  "Kalamkari",
  "Pattachitra",
  "Pottery",
  "Textile Weaving",
];

const designStyles = [
  "Traditional",
  "Modern",
  "Fusion",
];

export function CraftGen() {
  const [craftType, setCraftType] = useState("");
  const [designStyle, setDesignStyle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!craftType || !designStyle) return;

    setGenerating(true);
    setError(null);
    setGeneratedImages([]);
    
    try {
      const result = await generateCraftDesign(craftType, designStyle);
      if (result.success && result.imageUrls) {
        setGeneratedImages(result.imageUrls);
      } else {
        setError(result.error || "Failed to generate designs. Please try again.");
      }
    } catch (err: any) {
      setError("An unexpected error occurred during generation.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (url: string) => {
    // In a real app, this would trigger a direct download.
    // For now, we simulate the browser download behavior.
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = `craftai-${craftType.toLowerCase()}-${designStyle.toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show "Download Complete" message
    setDownloadMsg("Download Complete ✓");
    setTimeout(() => setDownloadMsg(null), 3000);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/30">
            <Wand2 className="size-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CraftGen AI</h1>
          <p className="text-xl text-gray-600">Generate unique craft designs powered by AI</p>
        </div>

        {/* Generator Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-purple-100/50 max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Generating Designs...
                </span>
              ) : (
                "Generate Designs"
              )}
            </button>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="size-5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            
            {downloadMsg && (
              <div className="flex items-center justify-center gap-2 p-3 bg-green-50 text-green-600 rounded-xl border border-green-100 animate-in fade-in zoom-in-95">
                <p className="text-sm font-bold uppercase tracking-wider">{downloadMsg}</p>
              </div>
            )}
          </div>
        </div>

        {/* Generated Gallery Output */}
        {generatedImages.length > 0 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold text-gray-900 text-center">Your AI Craft Gallery</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {generatedImages.map((image, index) => (
                <div key={index} className="bg-white rounded-3xl shadow-xl p-6 border border-purple-100/50 group hover:border-purple-300 transition-all duration-300">
                  <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-6 aspect-square">
                    <img
                      src={image}
                      alt={`Generated craft design ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleDownload(image)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="size-5" />
                      Download
                    </button>
                  </div>
                  
                  {/* Additional details below the button */}
                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                    <div className="bg-gray-50 p-2 rounded-lg flex flex-col items-center">
                        <span className="text-gray-300 mb-1">Craft</span>
                        <span className="text-purple-600 font-extrabold">{craftType}</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg flex flex-col items-center">
                        <span className="text-gray-300 mb-1">Style</span>
                        <span className="text-pink-500 font-extrabold">{designStyle}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center p-8 bg-purple-50 rounded-3xl border border-purple-100">
                <h3 className="font-semibold text-purple-900 mb-1">Authentic {craftType} Designs</h3>
                <p className="text-sm text-purple-700/80">Generated with {designStyle} style principles and traditional motifs.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}